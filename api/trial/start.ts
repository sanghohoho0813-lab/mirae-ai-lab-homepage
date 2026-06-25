// /api/trial/start — 7일 체험 시작.
// 절대 빈 500/일반 500으로 끝나지 않도록: 위험한 정적 import 없음(타입만),
// 모든 단계가 JSON { ok, message, debugCode, detail? } 로 응답, 전체 try/catch.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, fail, getAdmin, ok } from '../_supabase'

const TRIAL_DAYS = 7
const DAY = 86400000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1) method
    if (req.method !== 'POST') return fail(res, 405, '허용되지 않은 요청입니다.', 'method')

    // 2) env + Supabase client (동적 import → 로드 실패해도 catch)
    const admin = await getAdmin()
    if (!admin)
      return fail(res, 500, '서버에 Supabase 환경변수(SUPABASE_SERVICE_ROLE_KEY 등)가 설정되지 않았습니다.', 'no_env')

    // 3) Authorization header
    const token = bearer(req)
    if (!token) return fail(res, 401, '인증 토큰이 없습니다. 다시 로그인해 주세요.', 'no_auth')

    // 4) Supabase user
    const { data: userData, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userData?.user)
      return fail(res, 401, '세션이 유효하지 않습니다. 다시 로그인해 주세요.', 'bad_token', userErr)
    const user = userData.user

    // 5) body 파싱
    let body: { toolId?: string } = {}
    try {
      body = typeof req.body === 'string' ? (JSON.parse(req.body) as { toolId?: string }) : (req.body ?? {})
    } catch (e) {
      return fail(res, 400, '요청 본문(JSON)을 해석할 수 없습니다.', 'bad_body', e)
    }

    // 6) toolId
    const toolId = body.toolId
    if (!toolId) return fail(res, 400, 'toolId가 필요합니다.', 'bad_body')

    // 7) tool 조회
    const { data: tool, error: toolErr } = await admin
      .from('tools')
      .select('id, is_trial_available, access_type')
      .eq('id', toolId)
      .maybeSingle()
    if (toolErr) return fail(res, 400, '도구 조회에 실패했습니다. (toolId 형식 확인)', 'no_tool', toolErr)
    if (!tool) return fail(res, 404, '도구를 찾을 수 없습니다.', 'no_tool')
    if (!tool.is_trial_available || tool.access_type === 'private')
      return fail(res, 403, '체험할 수 없는 도구입니다. (비공개/체험 불가)', 'tool_not_available')

    // 8) profile 조회 (tool_access.user_id FK 대상)
    const { data: profile, error: profErr } = await admin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
    if (profErr) return fail(res, 500, '프로필 조회에 실패했습니다.', 'no_profile', profErr)
    if (!profile)
      return fail(res, 400, '프로필이 없습니다. 다시 로그인하거나 관리자에게 문의해 주세요.', 'no_profile')

    // 9) 기존 체험 확인 (중복 시작 방지)
    const { data: existing, error: exErr } = await admin
      .from('tool_access')
      .select('id, trial_started_at')
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .maybeSingle()
    if (exErr) return fail(res, 500, '기존 체험 정보 조회에 실패했습니다.', 'access_query', exErr)
    if (existing?.trial_started_at) return fail(res, 409, '이미 체험을 시작한 도구입니다.', 'already_started')

    // 10) tool_access upsert
    const now = new Date()
    const { error: upErr } = await admin.from('tool_access').upsert(
      {
        user_id: user.id,
        tool_id: toolId,
        access_status: 'trial_active',
        trial_started_at: now.toISOString(),
        trial_expires_at: new Date(now.getTime() + TRIAL_DAYS * DAY).toISOString(),
      },
      { onConflict: 'user_id,tool_id' },
    )
    if (upErr) return fail(res, 500, '체험 시작 저장에 실패했습니다.', 'access_upsert', upErr)

    return ok(res, { message: `${TRIAL_DAYS}일 무료 체험을 시작했습니다.` })
  } catch (e) {
    return fail(res, 500, '서버 처리 중 예외가 발생했습니다.', 'unhandled_exception', e)
  }
}
