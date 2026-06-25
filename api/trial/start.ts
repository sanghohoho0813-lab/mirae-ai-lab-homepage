// /api/trial/start — 자체 포함(외부 helper import 0개). 모듈 로드 실패가 불가능하도록 작성.
// - GET: health 체크 (브라우저 주소창으로 확인 가능)
// - POST: 7일 무료 체험 시작. Supabase 는 핸들러 안에서 동적 import 만 사용.
//
// ⏱ 만료 시각은 "신청한 정확한 시각 + 정확히 7일(밀리초 기준)" 로 저장합니다.
//    started=2026-06-25T14:37:18.123Z  →  expires=2026-07-02T14:37:18.123Z
//
// ⚡ 성능: 인증(getUser)과 도구 조회를 병렬 실행하고, 별도 profile SELECT 는
//    제거(존재 시 upsert 가 FK 로 보장 → 없으면 친절한 메시지로 변환)하여
//    순차 쿼리 5개 → 왕복 3회로 단축했습니다.

const TRIAL_DAYS = 7
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

// req/res 는 Vercel Node 런타임 객체. 외부 타입 import 를 피하기 위해 any 사용.
export default async function handler(req: any, res: any) {
  try {
    // 0) health 체크 — GET 이면 무조건 alive
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'trial start api alive' })
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
    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return res.status(401).json({ ok: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.', debugCode: 'no_auth' })
    }

    // 3) body 파싱 (네트워크 전)
    let body: { toolId?: string } = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }
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

    // 5) 인증 + 도구 조회를 병렬로 (서로 의존하지 않음 → 왕복 1회 절약)
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

    // 6) 기존 체험 확인 (이미 시작했으면 재시작 불가 — 체험 우회 방지)
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

    // 7) upsert — 신청 시각 기준 정확히 +7일(ms)
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
      // profiles 행 누락(FK) → 사용자에게 친절한 안내로 변환
      if (isFkViolation(upErr)) {
        return res.status(400).json({ ok: false, message: '프로필이 없습니다. 다시 로그인하거나 관리자에게 문의해 주세요.', debugCode: 'no_profile', detail: detailOf(upErr) })
      }
      return res.status(500).json({ ok: false, message: '체험 시작 저장에 실패했습니다.', debugCode: 'access_upsert', detail: detailOf(upErr) })
    }

    return res.status(200).json({ ok: true, message: `${TRIAL_DAYS}일 무료 체험을 시작했습니다.` })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: '서버 처리 중 예외가 발생했습니다.',
      debugCode: 'unhandled_exception',
      detail: error instanceof Error ? error.message : String(error),
    })
  }
}
