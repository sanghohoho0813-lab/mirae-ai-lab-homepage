// /api/trial/survey — 설문 참여로 체험 연장. 자체 포함(외부 helper import 0개).
// start.ts 와 동일하게 모듈 로드 실패가 불가능한 구조 + 동적 supabase import.

const TRIAL_DAYS = 7
const EXTENSION_DAYS = 7
const MAX_FREE_DAYS = 21
const DAY = 86400000

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

function computeExpiry(startedAtIso: string, reviewUsed: boolean, surveyUsed: boolean): string {
  const days = Math.min(MAX_FREE_DAYS, TRIAL_DAYS + (reviewUsed ? EXTENSION_DAYS : 0) + (surveyUsed ? EXTENSION_DAYS : 0))
  return new Date(new Date(startedAtIso).getTime() + days * DAY).toISOString()
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: 'POST만 허용됩니다.', debugCode: 'method_not_allowed' })
    }

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return res.status(500).json({ ok: false, message: '서버 환경변수가 설정되지 않았습니다.', debugCode: 'no_env' })
    }

    const authHeader: unknown = req.headers?.authorization ?? req.headers?.Authorization
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ ok: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.', debugCode: 'no_auth' })

    let body: { toolId?: string; answers?: Record<string, string> } = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }
    const toolId = body?.toolId
    if (!toolId) return res.status(400).json({ ok: false, message: 'toolId가 필요합니다.', debugCode: 'bad_body' })

    let createClient: (url: string, key: string, opts?: unknown) => any
    try {
      ;({ createClient } = await import('@supabase/supabase-js'))
    } catch (e) {
      return res.status(500).json({ ok: false, message: 'Supabase 모듈 로드에 실패했습니다.', debugCode: 'supabase_import', detail: detailOf(e) })
    }
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    const { data: userData, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userData?.user) {
      return res.status(401).json({ ok: false, message: '세션이 유효하지 않습니다. 다시 로그인해 주세요.', debugCode: 'bad_token', detail: detailOf(userErr) })
    }
    const user = userData.user

    // 설문 저장 + 체험 레코드 조회를 병렬로 (서로 독립)
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
  } catch (error) {
    return res.status(500).json({ ok: false, message: '서버 처리 중 예외가 발생했습니다.', debugCode: 'unhandled_exception', detail: error instanceof Error ? error.message : String(error) })
  }
}
