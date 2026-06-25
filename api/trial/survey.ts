import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, getAdmin, getUser, json, parseBody } from '../_supabase'
import { EXTENSION_DAYS, MAX_FREE_DAYS, computeTrialExpiry } from '../../src/lib/trial-policy'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { message: '허용되지 않은 요청입니다.' })
  const admin = getAdmin()
  if (!admin) return json(res, 500, { message: '서버 환경변수가 설정되지 않았습니다.' })

  const token = bearer(req)
  if (!token) return json(res, 401, { message: '로그인이 필요합니다.' })
  const user = await getUser(admin, token)
  if (!user) return json(res, 401, { message: '세션이 유효하지 않습니다.' })

  const { toolId, answers } = parseBody<{ toolId?: string; answers?: Record<string, string> }>(req)
  if (!toolId) return json(res, 400, { message: 'toolId가 필요합니다.' })

  await admin.from('surveys').insert({ user_id: user.id, tool_id: toolId, answers: answers ?? {} })

  const { data: rec } = await admin
    .from('tool_access')
    .select('*')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .maybeSingle()
  if (!rec?.trial_started_at) return json(res, 400, { message: '먼저 체험을 시작해주세요.' })
  if (rec.survey_extension_used) return json(res, 409, { message: '설문 연장은 1회만 가능합니다.' })

  const expires = computeTrialExpiry(rec.trial_started_at, rec.review_extension_used, true)
  const { error } = await admin
    .from('tool_access')
    .update({ survey_extension_used: true, trial_expires_at: expires, access_status: 'extended_by_survey' })
    .eq('id', rec.id)
  if (error) return json(res, 500, { message: '연장 처리에 실패했습니다.' })

  return json(res, 200, { message: `설문이 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` })
}
