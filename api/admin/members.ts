// /api/admin/members — 가입 회원 목록 (관리자 전용).
// GET ?action=list         — 회원 목록 + 진단·상담(리드) 이력 집계 + 가입쿠폰 보유
// GET ?action=detail&id=…  — 특정 회원의 진단·상담(리드) 이력
// service_role 은 서버에서만 사용. 관리자 판정: Bearer → profiles.role === 'admin' (기존 체계 재사용).
import { getSupabaseAdmin, verifyAdmin } from '../_lib/supabaseAdmin'

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

function maskPhone(phone?: string | null): string {
  const d = (phone ?? '').replace(/\D/g, '')
  if (d.length < 8) return phone ?? ''
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`
}

export default async function handler(req: any, res: any) {
  try {
    const admin = await getSupabaseAdmin()
    if (!admin) return res.status(500).json({ ok: false, message: '서버 환경변수가 설정되지 않았습니다.', debugCode: 'no_env' })

    const auth = await verifyAdmin(admin, req.headers?.authorization ?? req.headers?.Authorization)
    if (!auth.ok) return res.status(auth.status).json({ ok: false, message: auth.message, debugCode: auth.debugCode })

    const q = req.query ?? {}
    const action = String(q.action ?? 'list')

    // ── 회원 목록 + 상담 이력 집계 ──
    if (req.method === 'GET' && action === 'list') {
      const { data: profs } = await admin
        .from('profiles')
        .select('id, email, name, phone, organization, member_type, role, onboarding_status, created_at, last_login_at, initial_signup_provider')
        .order('created_at', { ascending: false })
        .limit(2000)
      const members = (profs ?? []) as any[]

      // 리드(상담신청)를 email·phone 으로 집계 (leads 에는 user_id 컬럼이 없음)
      const { data: leads } = await admin
        .from('business_diagnosis_leads')
        .select('email, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(5000)
      const byEmail = new Map<string, { count: number; last: string }>()
      const byPhone = new Map<string, { count: number; last: string }>()
      for (const l of (leads ?? []) as any[]) {
        const em = String(l.email ?? '').trim().toLowerCase()
        if (em) { const c = byEmail.get(em); if (c) { c.count++ } else { byEmail.set(em, { count: 1, last: l.created_at }) } }
        const ph = String(l.phone ?? '').replace(/\D/g, '')
        if (ph) { const c = byPhone.get(ph); if (c) { c.count++ } else { byPhone.set(ph, { count: 1, last: l.created_at }) } }
      }

      // 가입 쿠폰 보유자
      const { data: coupons } = await admin.from('user_coupons').select('user_id').eq('kind', 'signup')
      const couponUsers = new Set(((coupons ?? []) as any[]).map((c) => c.user_id))

      const rows = members.map((m) => {
        const em = String(m.email ?? '').trim().toLowerCase()
        const ph = String(m.phone ?? '').replace(/\D/g, '')
        const e = em ? byEmail.get(em) : undefined
        const p = ph ? byPhone.get(ph) : undefined
        const leadCount = (e?.count ?? 0) || (p?.count ?? 0)
        const lastLeadAt = e?.last ?? p?.last ?? null
        return {
          id: m.id,
          email: m.email,
          name: m.name,
          phone: maskPhone(m.phone),
          organization: m.organization,
          memberType: m.member_type,
          role: m.role,
          onboardingStatus: m.onboarding_status,
          createdAt: m.created_at,
          lastLoginAt: m.last_login_at,
          signupProvider: m.initial_signup_provider,
          leadCount,
          lastLeadAt,
          hasSignupCoupon: couponUsers.has(m.id),
        }
      })

      const today = new Date().toISOString().slice(0, 10)
      const stats = {
        total: rows.length,
        today: rows.filter((r) => String(r.createdAt ?? '').slice(0, 10) === today).length,
        business: rows.filter((r) => r.memberType === 'business').length,
        consultant: rows.filter((r) => r.memberType === 'consultant').length,
        withLeads: rows.filter((r) => r.leadCount > 0).length,
      }
      return res.status(200).json({ ok: true, members: rows, stats })
    }

    // ── 회원 상세: 진단·상담 이력 ──
    if (req.method === 'GET' && action === 'detail') {
      const id = String(q.id ?? '')
      if (!id) return res.status(400).json({ ok: false, message: '회원 ID가 없습니다.', debugCode: 'no_id' })
      const { data: member } = await admin
        .from('profiles')
        .select('id, email, name, phone, organization, member_type, role, onboarding_status, created_at, last_login_at, initial_signup_provider, interests')
        .eq('id', id)
        .maybeSingle()
      if (!member) return res.status(404).json({ ok: false, message: '회원을 찾을 수 없습니다.', debugCode: 'not_found' })

      const em = String((member as any).email ?? '').trim().toLowerCase()
      const ph = String((member as any).phone ?? '').replace(/\D/g, '')
      const cols = 'id, company_name, representative_name, phone, email, lead_status, lead_grade, created_at'
      let leads: any[] = []
      if (em) {
        const { data } = await admin.from('business_diagnosis_leads').select(cols).ilike('email', em).order('created_at', { ascending: false })
        leads = data ?? []
      }
      if (leads.length === 0 && ph) {
        const { data } = await admin.from('business_diagnosis_leads').select(cols).eq('phone', ph).order('created_at', { ascending: false })
        leads = data ?? []
      }
      // 보유 쿠폰
      const { data: coupons } = await admin.from('user_coupons').select('kind, amount, status, issued_at').eq('user_id', id)
      return res.status(200).json({ ok: true, member, leads, coupons: coupons ?? [] })
    }

    return res.status(405).json({ ok: false, message: '허용되지 않은 요청입니다.', debugCode: 'method' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: '회원 정보를 불러오지 못했습니다.', debugCode: 'unhandled', detail: detailOf(e) })
  }
}
