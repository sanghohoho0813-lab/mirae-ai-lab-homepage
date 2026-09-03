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

const ACCESS_COLS = 'trial_started_at, trial_expires_at, review_extension_used, survey_extension_used, paid_until, is_unlimited, access_status'

type AccessRow = {
  trial_started_at: string | null
  trial_expires_at: string | null
  review_extension_used: boolean
  survey_extension_used: boolean
  paid_until: string | null
  is_unlimited: boolean
  access_status: string | null
}

/**
 * 지금 이용 가능하면 "언제까지"(ms)를, 이용 불가면 null 을 돌려준다.
 * 판정 순서는 src/utils/access.ts 의 canUseTool 과 동일하다. (서버가 권위)
 */
function accessUntil(rec: AccessRow | null | undefined, now: number): number | null {
  if (!rec) return null
  if (rec.is_unlimited) return now + 365 * DAY
  if (rec.access_status === 'revoked') return null
  const paid = rec.paid_until ? new Date(rec.paid_until).getTime() : 0
  if (paid > now) return paid
  if (!rec.trial_started_at) return null
  const formula = new Date(computeExpiry(rec.trial_started_at, rec.review_extension_used, rec.survey_extension_used)).getTime()
  const manual = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : null
  const exp = manual == null ? formula : Math.max(formula, manual)
  return exp > now ? exp : null
}

// ── 도구 앱 진입 티켓 ───────────────────────────────────────────────────────
// 포털과 도구 앱은 도메인이 달라 로그인 세션을 공유할 수 없다. 그래서 포털이
// "이 사용자는 이 도구를 지금 쓸 수 있다"는 짧은 서명 티켓을 발급하고, 도구 앱이
// 그 티켓을 이 엔드포인트로 되물어 확인한다. 서명 키는 서버에만 있는 service_role 키다.
const TICKET_TTL_MS = 3 * 60 * 1000

async function signTicket(secret: string, payload: { u: string; t: string; e: number }): Promise<string> {
  const { createHmac } = await import('node:crypto')
  const b = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${b}.${createHmac('sha256', secret).update(b).digest('base64url')}`
}

async function readTicket(secret: string, ticket: unknown): Promise<{ u: string; t: string; e: number } | null> {
  if (typeof ticket !== 'string' || !ticket) return null
  const { createHmac, timingSafeEqual } = await import('node:crypto')
  const [b, sig] = ticket.split('.')
  if (!b || !sig) return null
  const expected = createHmac('sha256', secret).update(b).digest('base64url')
  const a = Buffer.from(sig)
  const c = Buffer.from(expected)
  if (a.length !== c.length || !timingSafeEqual(a, c)) return null
  try {
    const p = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'))
    if (!p?.u || !p?.t || typeof p.e !== 'number' || p.e < Date.now()) return null
    return p as { u: string; t: string; e: number }
  } catch {
    return null
  }
}

export default async function handler(req: any, res: any) {
  try {
    // 도구 앱(다른 도메인)이 티켓 검증을 호출하므로 CORS 를 연다.
    // 자격 증명은 쿠키가 아니라 본문의 티켓이므로 '*' 로 열어도 세션이 새지 않는다.
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Vary', 'Origin')
    if (req.method === 'OPTIONS') return res.status(204).end()

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

    // 2) body 파싱 (네트워크 전)
    let body: { action?: string; toolId?: string; content?: string; answers?: Record<string, string>; ticket?: string } = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }
    const action = body?.action
    const toolId = body?.toolId

    // 3) Authorization — verify 는 도구 앱이 티켓만 들고 호출하므로 세션이 없다
    const authHeader: unknown = req.headers?.authorization ?? req.headers?.Authorization
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (action !== 'verify') {
      if (!token) {
        return res.status(401).json({ ok: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.', debugCode: 'no_auth' })
      }
      if (!toolId) {
        return res.status(400).json({ ok: false, message: 'toolId가 필요합니다.', debugCode: 'bad_body' })
      }
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
        .select(ACCESS_COLS)
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .maybeSingle()
      if (recErr) return res.status(500).json({ ok: false, message: '이용 권한을 확인하지 못했습니다.', debugCode: 'access_query', detail: detailOf(recErr) })

      const until = accessUntil(rec, Date.now())
      if (until == null) {
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

      // 도구 앱이 스스로 권한을 확인할 수 있도록 짧은 티켓을 붙여 보낸다.
      let target = tool.external_url
      try {
        const parsed = new URL(tool.external_url)
        parsed.searchParams.set('mlt', await signTicket(serviceKey, { u: user.id, t: toolId, e: Date.now() + TICKET_TTL_MS }))
        target = parsed.toString()
      } catch {
        /* 주소 형식이 이상하면 티켓 없이 원본을 그대로 보낸다 */
      }
      return res.status(200).json({ ok: true, url: target })
    }

    // ── 액션: 티켓 검증 (도구 앱이 호출) ──────────────────────────────
    // 세션이 아니라 티켓만으로 호출된다. 티켓 서명·만료를 확인한 뒤,
    // DB 의 현재 권한을 다시 읽어 "지금" 이용 가능한지 판정한다.
    if (action === 'verify') {
      const claim = await readTicket(serviceKey, body?.ticket)
      if (!claim) {
        return res.status(401).json({ ok: true, allowed: false, reason: 'bad_ticket', message: '진입 티켓이 유효하지 않거나 만료되었습니다. 미래 AI 랩에서 다시 열어주세요.' })
      }
      // 슬러그도 함께 돌려준다 — 도구 앱이 "이 티켓이 나를 위한 것인지" 확인할 수 있게.
      // (A 도구용 티켓을 B 도구 주소에 붙여 넣는 우회를 막는다)
      const [{ data: rec, error: recErr }, { data: toolRow }] = await Promise.all([
        admin.from('tool_access').select(ACCESS_COLS).eq('user_id', claim.u).eq('tool_id', claim.t).maybeSingle(),
        admin.from('tools').select('slug').eq('id', claim.t).maybeSingle(),
      ])
      if (recErr) {
        return res.status(500).json({ ok: false, allowed: false, message: '이용 권한을 확인하지 못했습니다.', debugCode: 'access_query', detail: detailOf(recErr) })
      }
      const until = accessUntil(rec, Date.now())
      if (until == null) {
        return res.status(200).json({ ok: true, allowed: false, reason: rec?.trial_started_at ? 'expired' : 'not_started', message: rec?.trial_started_at ? '이용 기간이 종료되었습니다.' : '아직 체험을 시작하지 않았습니다.' })
      }
      return res.status(200).json({
        ok: true,
        allowed: true,
        toolId: claim.t,
        toolSlug: toolRow?.slug ?? null,
        userId: claim.u,
        expiresAt: new Date(until).toISOString(),
      })
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
