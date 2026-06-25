// /api/admin/access — 관리자 권한 변경(연장/만료/무제한/회수/결제/메모/리뷰상태).
// 자체 포함(외부 helper import 0개) + 동적 supabase import. service_role 전용.
// ⚠️ SUPABASE_SERVICE_ROLE_KEY 는 이 서버리스 함수 안에서만 사용됩니다(프론트 노출 금지).

const DAY = 86400000

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

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

async function ensureRow(admin: any, userId: string, toolId: string) {
  const { data } = await admin.from('tool_access').select('*').eq('user_id', userId).eq('tool_id', toolId).maybeSingle()
  if (data) return data
  const { data: created } = await admin
    .from('tool_access')
    .insert({ user_id: userId, tool_id: toolId, access_status: 'none' })
    .select('*')
    .single()
  return created
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

    let body: Body = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }

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

    const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if ((me as { role?: string } | null)?.role !== 'admin') {
      return res.status(403).json({ ok: false, message: '관리자 권한이 필요합니다.', debugCode: 'not_admin' })
    }

    const { action, userId, toolId } = body

    if (action === 'memo') {
      if (!userId) return res.status(400).json({ ok: false, message: 'userId가 필요합니다.', debugCode: 'bad_body' })
      const { error } = await admin.from('profiles').update({ memo: body.memo ?? '' }).eq('id', userId)
      if (error) return res.status(500).json({ ok: false, message: '메모 저장에 실패했습니다.', debugCode: 'memo_update', detail: detailOf(error) })
      return res.status(200).json({ ok: true, message: '메모를 저장했습니다.' })
    }

    if (action === 'reviewStatus') {
      if (!body.reviewId || !body.status) return res.status(400).json({ ok: false, message: '잘못된 요청입니다.', debugCode: 'bad_body' })
      const { error } = await admin.from('reviews').update({ status: body.status }).eq('id', body.reviewId)
      if (error) return res.status(500).json({ ok: false, message: '리뷰 상태 변경에 실패했습니다.', debugCode: 'review_status', detail: detailOf(error) })
      return res.status(200).json({ ok: true, message: '리뷰 상태를 변경했습니다.' })
    }

    if (!userId || !toolId) return res.status(400).json({ ok: false, message: 'userId, toolId가 필요합니다.', debugCode: 'bad_body' })
    const rec = await ensureRow(admin, userId, toolId)
    if (!rec) return res.status(500).json({ ok: false, message: '접근 레코드 생성에 실패했습니다.', debugCode: 'ensure_row' })

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
        if (!body.date) return res.status(400).json({ ok: false, message: 'date가 필요합니다.', debugCode: 'bad_body' })
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
        return res.status(400).json({ ok: false, message: '알 수 없는 action 입니다.', debugCode: 'bad_action' })
    }

    const { error } = await admin.from('tool_access').update(patch).eq('id', rec.id)
    if (error) return res.status(500).json({ ok: false, message: '처리에 실패했습니다.', debugCode: 'admin_update', detail: detailOf(error) })
    return res.status(200).json({ ok: true, message: '처리되었습니다.' })
  } catch (error) {
    return res.status(500).json({ ok: false, message: '서버 처리 중 예외가 발생했습니다.', debugCode: 'unhandled_exception', detail: error instanceof Error ? error.message : String(error) })
  }
}
