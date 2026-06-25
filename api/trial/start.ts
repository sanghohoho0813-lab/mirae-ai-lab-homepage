import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, getAdmin, getUser, json, parseBody } from '../_supabase'
import { TRIAL_DAYS } from '../../src/lib/trial-policy'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { message: '허용되지 않은 요청입니다.' })
  const admin = getAdmin()
  if (!admin) return json(res, 500, { message: '서버 환경변수가 설정되지 않았습니다.' })

  const token = bearer(req)
  if (!token) return json(res, 401, { message: '로그인이 필요합니다.' })
  const user = await getUser(admin, token)
  if (!user) return json(res, 401, { message: '세션이 유효하지 않습니다.' })

  const { toolId } = parseBody<{ toolId?: string }>(req)
  if (!toolId) return json(res, 400, { message: 'toolId가 필요합니다.' })

  const { data: tool } = await admin
    .from('tools')
    .select('id, is_trial_available, access_type')
    .eq('id', toolId)
    .maybeSingle()
  if (!tool) return json(res, 404, { message: '도구를 찾을 수 없습니다.' })
  if (!tool.is_trial_available || tool.access_type === 'private') {
    return json(res, 403, { message: '체험할 수 없는 도구입니다.' })
  }

  const { data: existing } = await admin
    .from('tool_access')
    .select('id, trial_started_at')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .maybeSingle()
  if (existing?.trial_started_at) return json(res, 409, { message: '이미 체험을 시작했습니다.' })

  const now = new Date()
  const expires = new Date(now.getTime() + TRIAL_DAYS * 86400000)
  const { error } = await admin.from('tool_access').upsert(
    {
      user_id: user.id,
      tool_id: toolId,
      access_status: 'trial_active',
      trial_started_at: now.toISOString(),
      trial_expires_at: expires.toISOString(),
    },
    { onConflict: 'user_id,tool_id' },
  )
  if (error) return json(res, 500, { message: '체험 시작에 실패했습니다.' })

  return json(res, 200, { message: `${TRIAL_DAYS}일 무료 체험을 시작했습니다.` })
}
