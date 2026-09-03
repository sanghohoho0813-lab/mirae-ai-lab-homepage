// /api/trial — 체험 시작 / 리뷰 연장 / 설문 연장 통합 엔드포인트.
// (Vercel Hobby 서버리스 함수 개수 제한 대응: 기존 api/trial/{start,review,survey} 3개를 1개로 통합.
//  각 액션의 로직은 원본과 동일하게 유지하고 body.action 으로 분기만 합니다.)
//   POST { action:'start',  toolId }
//   POST { action:'review', toolId, content }
//   POST { action:'survey', toolId, answers }
//   GET  → health 체크
// 자체 포함(외부 helper import 0개) + Supabase 는 핸들러 안에서 동적 import 만 사용.

const TRIAL_DAYS = 7
const EXTENSION_DAYS = 7
const MAX_FREE_DAYS = 21
const REVIEW_MIN_CHARS = 500
const DAY = 86400000

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

// Postgres FK 위반(23503) = profiles 행이 없음 → 다시 로그인/관리자 문의 안내
function isFkViolation(e: unknown): boolean {
  return !!e && typeof e === 'object' && 'code' in e && (e as { code?: unknown }).code === '23503'
}

// 시작 시각 기준 + (기본 7 + 리뷰 7 + 설문 7), 최대 21일. 밀리초 정확도 유지.
function computeExpiry(startedAtIso: string, reviewUsed: boolean, surveyUsed: boolean): string {
  const days = Math.min(MAX_FREE_DAYS, TRIAL_DAYS + (reviewUsed ? EXTENSION_DAYS : 0) + (surveyUsed ? EXTENSION_DAYS : 0))
  return new Date(new Date(startedAtIso).getTime() + days * DAY).toISOString()
}

export default async function handler(req: any, res: any) {
  try {
    // 0) health 체크
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'trial api alive' })
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: 'POST만 허용됩니다.', debugCode: 'method_not_allowed' })
    }

    // 1) env (네트워크 전 빠른 실패)
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return res
        .status(500)
        .json({ ok: false, message: '서버에 Supabase 환경변수(SUPABASE_SERVICE_ROLE_KEY 등)가 설정되지 않았습니다.', debugCode: 'no_env' })
    }

    // 2) Authorization
    const authHeader: unknown = req.headers?.authorization ?? req.headers?.Authorization
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return res.status(401).json({ ok: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.', debugCode: 'no_auth' })
    }

    // 3) body 파싱 (네트워크 전)
    let body: { action?: string; toolId?: string; content?: string; answers?: Record<string, string> } = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }
    const action = body?.action
    const toolId = body?.toolId
    if (!toolId) {
      return res.status(400).json({ ok: false, message: 'toolId가 필요합니다.', debugCode: 'bad_body' })
    }

    // 4) Supabase 모듈 동적 import
    let createClient: (url: string, key: string, opts?: unknown) => any
    try {
      ;({ createClient } = await import('@supabase/supabase-js'))
    } catch (e) {
      return res.status(500).json({ ok: false, message: 'Supabase 모듈 로드에 실패했습니다.', debugCode: 'supabase_import', detail: detailOf(e) })
    }
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // ── 액션: 체험 시작 ──────────────────────────────────────────────
    if (action === 'start') {
      // 인증 + 도구 조회를 병렬로 (서로 의존하지 않음)
      const [{ data: userData, error: userErr }, { data: tool, error: toolErr }] = await Promise.all([
        admin.auth.getUser(token),
        admin.from('tools').select('id, is_trial_available, access_type').eq('id', toolId).maybeSingle(),
      ])
      if (userErr || !userData?.user) {
        return res.status(401).json({ ok: false, message: '세션이 유효하지 않습니다. 다시 로그인해 주세요.', debugCode: 'bad_token', detail: detailOf(userErr) })
      }
      const user = userData.user

      if (toolErr) return res.status(400).json({ ok: false, message: '도구 조회에 실패했습니다. (toolId 형식 확인)', debugCode: 'no_tool', detail: detailOf(toolErr) })
      if (!tool) return res.status(404).json({ ok: false, message: '도구를 찾을 수 없습니다.', debugCode: 'no_tool' })
      if (!tool.is_trial_available || tool.access_type === 'private') {
        return res.status(403).json({ ok: false, message: '체험할 수 없는 도구입니다. (비공개/체험 불가)', debugCode: 'tool_not_available' })
      }

      const { data: existing, error: exErr } = await admin
        .from('tool_access')
        .select('id, trial_started_at')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .maybeSingle()
      if (exErr) return res.status(500).json({ ok: false, message: '기존 체험 정보 조회에 실패했습니다.', debugCode: 'access_query', detail: detailOf(exErr) })
      if (existing?.trial_started_at) {
        return res.status(409).json({ ok: false, message: '이미 체험을 시작한 도구입니다.', debugCode: 'already_started' })
      }

      const startedMs = Date.now()
      const { error: upErr } = await admin.from('tool_access').upsert(
        {
          user_id: user.id,
          tool_id: toolId,
          access_status: 'trial_active',
          trial_started_at: new Date(startedMs).toISOString(),
          trial_expires_at: new Date(startedMs + TRIAL_DAYS * DAY).toISOString(),
        },
        { onConflict: 'user_id,tool_id' },
      )
      if (upErr) {
        if (isFkViolation(upErr)) {
          return res.status(400).json({ ok: false, message: '프로필이 없습니다. 다시 로그인하거나 관리자에게 문의해 주세요.', debugCode: 'no_profile', detail: detailOf(upErr) })
        }
        return res.status(500).json({ ok: false, message: '체험 시작 저장에 실패했습니다.', debugCode: 'access_upsert', detail: detailOf(upErr) })
      }

      return res.status(200).json({ ok: true, message: `${TRIAL_DAYS}일 무료 체험을 시작했습니다.` })
    }

    // ── 액션: 도구 열기 ──────────────────────────────────────────────
    // 이용 권한이 살아 있을 때만 external_url 을 내려준다.
    // (클라이언트는 도구 주소를 미리 갖고 있지 않으므로, 만료되면 주소 자체를 얻지 못한다)
    if (action === 'open') {
      const [{ data: userData, error: userErr }, { data: tool, error: toolErr }] = await Promise.all([
        admin.auth.getUser(token),
        admin.from('tools').select('id, external_url').eq('id', toolId).maybeSingle(),
      ])
      if (userErr || !userData?.user) {
        return res.status(401).json({ ok: false, message: '세션이 유효하지 않습니다. 다시 로그인해 주세요.', debugCode: 'bad_token', detail: detailOf(userErr) })
      }
      const user = userData.user
      if (toolErr) return res.status(400).json({ ok: false, message: '도구 조회에 실패했습니다.', debugCode: 'no_tool', detail: detailOf(toolErr) })
      if (!tool) return res.status(404).json({ ok: false, message: '도구를 찾을 수 없습니다.', debugCode: 'no_tool' })

      const { data: rec, error: recErr } = await admin
        .from('tool_access')
        .select('trial_started_at, trial_expires_at, review_extension_used, survey_extension_used, paid_until, is_unlimited, access_status')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .maybeSingle()
      if (recErr) return res.status(500).json({ ok: false, message: '이용 권한을 확인하지 못했습니다.', debugCode: 'access_query', detail: detailOf(recErr) })

      // src/utils/access.ts 의 canUseTool 과 동일한 판정 (서버가 권위)
      const now = Date.now()
      let usable = false
      if (rec) {
        if (rec.is_unlimited) usable = true
        else if (rec.access_status === 'revoked') usable = false
        else if (rec.paid_until && new Date(rec.paid_until).getTime() > now) usable = true
        else if (rec.trial_started_at) {
          const formula = new Date(computeExpiry(rec.trial_started_at, rec.review_extension_used, rec.survey_extension_used)).getTime()
          const manual = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : null
          usable = (manual == null ? formula : Math.max(formula, manual)) > now
        }
      }
      if (!usable) {
        return res.status(403).json({
          ok: false,
          message: rec?.trial_started_at
            ? '이용 기간이 종료되었습니다. 리뷰·설문으로 연장하거나 결제 후 이용해 주세요.'
            : `먼저 ${TRIAL_DAYS}일 무료 체험을 시작해 주세요.`,
          debugCode: 'no_access',
        })
      }
      if (!tool.external_url) {
        return res.status(404).json({ ok: false, message: '도구 주소가 등록되어 있지 않습니다. 관리자에게 문의해 주세요.', debugCode: 'no_url' })
      }
      return res.status(200).json({ ok: true, url: tool.external_url })
    }

    // ── 액션: 리뷰 연장 ──────────────────────────────────────────────
    if (action === 'review') {
      const text = (body?.content ?? '').trim()
      if (text.length < REVIEW_MIN_CHARS) {
        return res.status(400).json({ ok: false, message: `리뷰는 ${REVIEW_MIN_CHARS}자 이상이어야 연장됩니다. (현재 ${text.length}자)`, debugCode: 'too_short' })
      }

      const { data: userData, error: userErr } = await admin.auth.getUser(token)
      if (userErr || !userData?.user) {
        return res.status(401).json({ ok: false, message: '세션이 유효하지 않습니다. 다시 로그인해 주세요.', debugCode: 'bad_token', detail: detailOf(userErr) })
      }
      const user = userData.user

      const [{ error: insErr }, { data: rec, error: recErr }] = await Promise.all([
        admin.from('reviews').insert({ user_id: user.id, tool_id: toolId, content: text, char_count: text.length, status: 'approved' }),
        admin.from('tool_access').select('id, trial_started_at, review_extension_used, survey_extension_used').eq('user_id', user.id).eq('tool_id', toolId).maybeSingle(),
      ])
      if (insErr) return res.status(500).json({ ok: false, message: '리뷰 저장에 실패했습니다.', debugCode: 'review_insert', detail: detailOf(insErr) })
      if (recErr) return res.status(500).json({ ok: false, message: '체험 정보를 확인하지 못했습니다.', debugCode: 'access_query', detail: detailOf(recErr) })
      if (!rec?.trial_started_at) return res.status(400).json({ ok: false, message: '먼저 체험을 시작해 주세요.', debugCode: 'not_started' })
      if (rec.review_extension_used) return res.status(409).json({ ok: false, message: '리뷰 연장은 1회만 가능합니다.', debugCode: 'review_used' })

      const expires = computeExpiry(rec.trial_started_at, true, rec.survey_extension_used)
      const { error: upErr } = await admin
        .from('tool_access')
        .update({ review_extension_used: true, trial_expires_at: expires, access_status: 'extended_by_review' })
        .eq('id', rec.id)
      if (upErr) return res.status(500).json({ ok: false, message: '연장 처리에 실패했습니다.', debugCode: 'access_update', detail: detailOf(upErr) })

      return res.status(200).json({ ok: true, message: `리뷰가 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` })
    }

    // ── 액션: 설문 연장 ──────────────────────────────────────────────
    if (action === 'survey') {
      const { data: userData, error: userErr } = await admin.auth.getUser(token)
      if (userErr || !userData?.user) {
        return res.status(401).json({ ok: false, message: '세션이 유효하지 않습니다. 다시 로그인해 주세요.', debugCode: 'bad_token', detail: detailOf(userErr) })
      }
      const user = userData.user

      const [{ error: insErr }, { data: rec, error: recErr }] = await Promise.all([
        admin.from('surveys').insert({ user_id: user.id, tool_id: toolId, answers: body?.answers ?? {} }),
        admin.from('tool_access').select('id, trial_started_at, review_extension_used, survey_extension_used').eq('user_id', user.id).eq('tool_id', toolId).maybeSingle(),
      ])
      if (insErr) return res.status(500).json({ ok: false, message: '설문 저장에 실패했습니다.', debugCode: 'survey_insert', detail: detailOf(insErr) })
      if (recErr) return res.status(500).json({ ok: false, message: '체험 정보를 확인하지 못했습니다.', debugCode: 'access_query', detail: detailOf(recErr) })
      if (!rec?.trial_started_at) return res.status(400).json({ ok: false, message: '먼저 체험을 시작해 주세요.', debugCode: 'not_started' })
      if (rec.survey_extension_used) return res.status(409).json({ ok: false, message: '설문 연장은 1회만 가능합니다.', debugCode: 'survey_used' })

      const expires = computeExpiry(rec.trial_started_at, rec.review_extension_used, true)
      const { error: upErr } = await admin
        .from('tool_access')
        .update({ survey_extension_used: true, trial_expires_at: expires, access_status: 'extended_by_survey' })
        .eq('id', rec.id)
      if (upErr) return res.status(500).json({ ok: false, message: '연장 처리에 실패했습니다.', debugCode: 'access_update', detail: detailOf(upErr) })

      return res.status(200).json({ ok: true, message: `설문이 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` })
    }

    return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다. (action)', debugCode: 'bad_action' })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: '서버 처리 중 예외가 발생했습니다.',
      debugCode: 'unhandled_exception',
      detail: error instanceof Error ? error.message : String(error),
    })
  }
}
