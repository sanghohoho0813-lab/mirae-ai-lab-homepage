import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, fail, getAdmin, getUser, ok, parseBody } from '../_supabase'
import { TRIAL_DAYS } from '../_trial'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return fail(res, 405, '허용되지 않은 요청입니다.', 'method')

    const admin = getAdmin()
    if (!admin)
      return fail(res, 500, '서버에 Supabase 환경변수(SUPABASE_SERVICE_ROLE_KEY 등)가 설정되지 않았습니다.', 'no_env')

    const token = bearer(req)
    if (!token) return fail(res, 401, '인증 토큰이 없습니다. 다시 로그인해 주세요.', 'no_token')
    const user = await getUser(admin, token)
    if (!user) return fail(res, 401, '세션이 유효하지 않습니다. 다시 로그인해 주세요.', 'bad_token')

    const { toolId } = parseBody<{ toolId?: string }>(req)
    if (!toolId) return fail(res, 400, 'toolId가 필요합니다.', 'no_tool_id')

    const { data: tool, error: toolErr } = await admin
      .from('tools')
      .select('id, is_trial_available, access_type')
      .eq('id', toolId)
      .maybeSingle()
    if (toolErr) return fail(res, 400, '도구 조회에 실패했습니다. (toolId 형식을 확인하세요)', 'tool_query', toolErr)
    if (!tool) return fail(res, 404, '도구를 찾을 수 없습니다.', 'tool_not_found')
    if (!tool.is_trial_available || tool.access_type === 'private')
      return fail(res, 403, '체험할 수 없는 도구입니다. (비공개/체험 불가)', 'tool_not_trialable')

    const { data: existing, error: exErr } = await admin
      .from('tool_access')
      .select('id, trial_started_at')
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .maybeSingle()
    if (exErr) return fail(res, 500, '기존 체험 정보를 확인하지 못했습니다.', 'access_query', exErr)
    if (existing?.trial_started_at) return fail(res, 409, '이미 체험을 시작한 도구입니다.', 'already_started')

    const now = new Date()
    const expires = new Date(now.getTime() + TRIAL_DAYS * 86400000)
    const { error: upErr } = await admin.from('tool_access').upsert(
      {
        user_id: user.id,
        tool_id: toolId,
        access_status: 'trial_active',
        trial_started_at: now.toISOString(),
        trial_expires_at: expires.toISOString(),
      },
      { onConflict: 'user_id,tool_id' },
    )
    if (upErr) return fail(res, 500, '체험 시작 저장에 실패했습니다.', 'access_upsert', upErr)

    return ok(res, { message: `${TRIAL_DAYS}일 무료 체험을 시작했습니다.` })
  } catch (e) {
    return fail(res, 500, '서버 오류가 발생했습니다.', 'unhandled', e)
  }
}
