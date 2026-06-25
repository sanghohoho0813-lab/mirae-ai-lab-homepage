import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, getAdmin, getUser, json, parseBody } from '../_supabase'
import { EXTENSION_DAYS, MAX_FREE_DAYS, REVIEW_MIN_CHARS, computeTrialExpiry } from '../../src/lib/trial-policy'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { message: '허용되지 않은 요청입니다.' })
  const admin = getAdmin()
  if (!admin) return json(res, 500, { message: '서버 환경변수가 설정되지 않았습니다.' })

  const token = bearer(req)
  if (!token) return json(res, 401, { message: '로그인이 필요합니다.' })
  const user = await getUser(admin, token)
  if (!user) return json(res, 401, { message: '세션이 유효하지 않습니다.' })

  const { toolId, content } = parseBody<{ toolId?: string; content?: string }>(req)
  const text = (content ?? '').trim()
  if (!toolId) return json(res, 400, { message: 'toolId가 필요합니다.' })
  if (text.length < REVIEW_MIN_CHARS) {
    return json(res, 400, { message: `리뷰는 ${REVIEW_MIN_CHARS}자 이상이어야 연장됩니다. (현재 ${text.length}자)` })
  }

  // 리뷰 저장 (500자 이상 → 자동 승인)
  await admin.from('reviews').insert({
    user_id: user.id,
    tool_id: toolId,
    content: text,
    char_count: text.length,
    status: 'approved',
  })

  const { data: rec } = await admin
    .from('tool_access')
    .select('*')
    .eq('user_id', user.id)
    .eq('tool_id', toolId)
    .maybeSingle()
  if (!rec?.trial_started_at) return json(res, 400, { message: '먼저 체험을 시작해주세요.' })
  if (rec.review_extension_used) return json(res, 409, { message: '리뷰 연장은 1회만 가능합니다.' })

  const expires = computeTrialExpiry(rec.trial_started_at, true, rec.survey_extension_used)
  const { error } = await admin
    .from('tool_access')
    .update({ review_extension_used: true, trial_expires_at: expires, access_status: 'extended_by_review' })
    .eq('id', rec.id)
  if (error) return json(res, 500, { message: '연장 처리에 실패했습니다.' })

  return json(res, 200, { message: `리뷰가 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` })
}
