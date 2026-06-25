import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, fail, getAdmin, getUser, ok, parseBody } from '../_supabase'
import { EXTENSION_DAYS, MAX_FREE_DAYS, REVIEW_MIN_CHARS, computeTrialExpiry } from '../_trial'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return fail(res, 405, '허용되지 않은 요청입니다.', 'method')
    const admin = getAdmin()
    if (!admin) return fail(res, 500, '서버 환경변수가 설정되지 않았습니다.', 'no_env')

    const token = bearer(req)
    if (!token) return fail(res, 401, '인증 토큰이 없습니다. 다시 로그인해 주세요.', 'no_token')
    const user = await getUser(admin, token)
    if (!user) return fail(res, 401, '세션이 유효하지 않습니다.', 'bad_token')

    const { toolId, content } = parseBody<{ toolId?: string; content?: string }>(req)
    const text = (content ?? '').trim()
    if (!toolId) return fail(res, 400, 'toolId가 필요합니다.', 'no_tool_id')
    if (text.length < REVIEW_MIN_CHARS)
      return fail(res, 400, `리뷰는 ${REVIEW_MIN_CHARS}자 이상이어야 연장됩니다. (현재 ${text.length}자)`, 'too_short')

    const { error: insErr } = await admin.from('reviews').insert({
      user_id: user.id,
      tool_id: toolId,
      content: text,
      char_count: text.length,
      status: 'approved',
    })
    if (insErr) return fail(res, 500, '리뷰 저장에 실패했습니다.', 'review_insert', insErr)

    const { data: rec, error: recErr } = await admin
      .from('tool_access')
      .select('*')
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .maybeSingle()
    if (recErr) return fail(res, 500, '체험 정보를 확인하지 못했습니다.', 'access_query', recErr)
    if (!rec?.trial_started_at) return fail(res, 400, '먼저 체험을 시작해주세요.', 'not_started')
    if (rec.review_extension_used) return fail(res, 409, '리뷰 연장은 1회만 가능합니다.', 'review_used')

    const expires = computeTrialExpiry(rec.trial_started_at, true, rec.survey_extension_used)
    const { error: upErr } = await admin
      .from('tool_access')
      .update({ review_extension_used: true, trial_expires_at: expires, access_status: 'extended_by_review' })
      .eq('id', rec.id)
    if (upErr) return fail(res, 500, '연장 처리에 실패했습니다.', 'access_update', upErr)

    return ok(res, { message: `리뷰가 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` })
  } catch (e) {
    return fail(res, 500, '서버 오류가 발생했습니다.', 'unhandled', e)
  }
}
