import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bearer, fail, getAdmin, getUser, isAdmin, json, parseBody } from '../_supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

const DAY = 86400000

type Body = {
  action?: string
  userId?: string
  toolId?: string
  days?: number
  date?: string
  paid?: boolean
  memo?: string
  reviewId?: string
  status?: string
}

async function ensureRow(admin: SupabaseClient, userId: string, toolId: string) {
  const { data } = await admin
    .from('tool_access')
    .select('*')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .maybeSingle()
  if (data) return data
  const { data: created } = await admin
    .from('tool_access')
    .insert({ user_id: userId, tool_id: toolId, access_status: 'none' })
    .select('*')
    .single()
  return created
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { message: '허용되지 않은 요청입니다.' })
  const admin = getAdmin()
  if (!admin) return json(res, 500, { message: '서버 환경변수가 설정되지 않았습니다.' })

  const token = bearer(req)
  if (!token) return json(res, 401, { message: '로그인이 필요합니다.' })
  const user = await getUser(admin, token)
  if (!user) return json(res, 401, { message: '세션이 유효하지 않습니다.' })
  if (!(await isAdmin(admin, user.id))) return json(res, 403, { message: '관리자 권한이 필요합니다.' })

  const body = parseBody<Body>(req)
  const { action, userId, toolId } = body

  try {
    if (action === 'memo') {
      if (!userId) return json(res, 400, { message: 'userId가 필요합니다.' })
      await admin.from('profiles').update({ memo: body.memo ?? '' }).eq('id', userId)
      return json(res, 200, { message: '메모를 저장했습니다.' })
    }

    if (action === 'reviewStatus') {
      if (!body.reviewId || !body.status) return json(res, 400, { message: '잘못된 요청입니다.' })
      await admin.from('reviews').update({ status: body.status }).eq('id', body.reviewId)
      return json(res, 200, { message: '리뷰 상태를 변경했습니다.' })
    }

    if (!userId || !toolId) return json(res, 400, { message: 'userId, toolId가 필요합니다.' })
    const rec = await ensureRow(admin, userId, toolId)
    if (!rec) return json(res, 500, { message: '접근 레코드 생성 실패' })

    let patch: Record<string, unknown> = { granted_by_admin: true }
    const now = Date.now()

    switch (action) {
      case 'grant':
        patch = {
          ...patch,
          access_status: 'trial_active',
          trial_started_at: rec.trial_started_at ?? new Date(now).toISOString(),
          trial_expires_at: new Date(now + 7 * DAY).toISOString(),
        }
        break
      case 'extend': {
        const base = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : now
        patch = {
          ...patch,
          trial_expires_at: new Date(base + (body.days ?? 7) * DAY).toISOString(),
          access_status: rec.is_unlimited ? rec.access_status : 'trial_active',
        }
        break
      }
      case 'setExpiry':
        if (!body.date) return json(res, 400, { message: 'date가 필요합니다.' })
        patch = {
          ...patch,
          trial_started_at: rec.trial_started_at ?? new Date(now).toISOString(),
          trial_expires_at: new Date(body.date).toISOString(),
          access_status: 'trial_active',
        }
        break
      case 'unlimited':
        patch = { ...patch, is_unlimited: true, access_status: 'unlimited' }
        break
      case 'revoke':
        patch = { ...patch, is_unlimited: false, access_status: 'revoked' }
        break
      case 'paid':
        patch = body.paid
          ? { ...patch, paid_until: new Date(now + 30 * DAY).toISOString(), access_status: 'paid_active' }
          : { paid_until: null, access_status: rec.trial_started_at ? 'trial_active' : 'none' }
        break
      default:
        return json(res, 400, { message: '알 수 없는 action 입니다.' })
    }

    const { error } = await admin.from('tool_access').update(patch).eq('id', rec.id)
    if (error) return fail(res, 500, '처리에 실패했습니다.', 'admin_update', error)
    return json(res, 200, { ok: true, message: '처리되었습니다.' })
  } catch (e) {
    return fail(res, 500, '서버 오류가 발생했습니다.', 'admin_unhandled', e)
  }
}
