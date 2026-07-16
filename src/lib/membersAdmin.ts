// 가입 회원 관리 — 관리자 클라이언트 (businessLeadsAdmin 의 토큰·CSV 패턴 재사용).
import { supabase } from './supabase'
import { downloadCsv, formatPhone, maskPhone } from './businessLeadsAdmin'

export { downloadCsv, formatPhone, maskPhone }

export type MemberRow = {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  organization: string | null
  memberType: 'business' | 'consultant' | null
  role: string | null
  onboardingStatus: string | null
  createdAt: string
  lastLoginAt: string | null
  signupProvider: string | null
  leadCount: number
  lastLeadAt: string | null
  hasSignupCoupon: boolean
}

export type MembersStats = { total: number; today: number; business: number; consultant: number; withLeads: number }
export type MembersListResponse = { members: MemberRow[]; stats: MembersStats }

export type MemberLead = {
  id: string
  company_name: string
  representative_name: string
  phone: string
  email: string | null
  lead_status: string
  lead_grade: string
  created_at: string
}
export type MemberCoupon = { kind: string; amount: number; status: string; issued_at: string }
export type MemberDetail = { member: Record<string, unknown>; leads: MemberLead[]; coupons: MemberCoupon[] }

async function getToken(): Promise<string> {
  if (!supabase) throw new Error('Supabase 설정이 필요합니다.')
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.')
  return token
}

async function request(path: string): Promise<any> {
  const token = await getToken()
  const res = await fetch(path, { headers: { Authorization: `Bearer ${token}` } })
  let data: any = {}
  try { data = await res.json() } catch { throw new Error(`요청 실패 (HTTP ${res.status})`) }
  if (!res.ok || data.ok === false) throw new Error(data.message || `요청 실패 (HTTP ${res.status})`)
  return data
}

export const fetchMembers = (): Promise<MembersListResponse> => request('/api/admin/members?action=list')
export const fetchMemberDetail = (id: string): Promise<MemberDetail> =>
  request(`/api/admin/members?action=detail&id=${encodeURIComponent(id)}`)

export function memberTypeText(t: MemberRow['memberType']): string {
  return t === 'business' ? '대표(기업)' : t === 'consultant' ? '컨설턴트' : '미설정'
}
export function providerText(p: string | null): string {
  if (!p) return '이메일'
  if (p === 'google') return '구글'
  if (p === 'kakao') return '카카오'
  if (p === 'email') return '이메일'
  return p
}
