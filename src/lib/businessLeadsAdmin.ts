// 기업 성장진단 리드 — 관리자 클라이언트 (portal.ts 의 토큰 패턴 재사용).
import { supabase } from './supabase'

export type LeadRow = {
  id: string
  company_name: string
  representative_name: string
  phone: string
  email: string | null
  business_type: string | null
  industry: string | null
  contact_method: string | null
  preferred_contact_time: string | null
  privacy_consent: boolean
  privacy_consent_version: string
  consultation_consent: boolean
  marketing_consent: boolean
  consent_at: string | null
  lead_score: number
  lead_grade: 'A' | 'B' | 'C'
  score_breakdown: Record<string, number> | null
  flags: string[] | null
  lead_status: string
  memo: string | null
  meeting_memo: string | null
  contacted_at: string | null
  assigned_label: string | null
  assignment_status: string
  source_channel: string | null
  created_at: string
  updated_at: string
}

export type SessionRow = {
  id: string
  lead_id: string | null
  answers: Record<string, string | string[]>
  scores: Array<{ area: string; score: number; priority: string }> | null
  result_summary: {
    summary?: string
    topTask?: string
    overallScore?: number
    ownedAdvantageCount?: number
    strengths?: string[]
    improvements?: string[]
    prerequisites?: string[]
    actionPlan?: string[]
  } | null
  advantage_factors: Array<{ id: string; label: string; status: string; group: string }> | null
  recommended_products: Array<{ slug: string; rank: string; reason: string }> | null
  clicked_benefits: string[] | null
  skipped_benefits: string[] | null
  completed_stage: number | null
  diagnosis_depth: string | null
  stopped_after_stage: boolean | null
  next_stage_interest: boolean | null
  stage1_duration_seconds: number | null
  stage2_duration_seconds: number | null
  stage3_duration_seconds: number | null
  total_duration_seconds: number | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  landing_path: string | null
  started_at: string | null
  completed_at: string | null
  submitted_at: string | null
}

export type EventRow = { event_type: string; event_key: string | null; payload: unknown; created_at: string }

export type LeadsListResponse = {
  leads: LeadRow[]
  sessions: SessionRow[]
  stats: { total: number; today: number; gradeA: number; consented: number; fundingUrgent: number }
}

async function getToken(): Promise<string> {
  if (!supabase) throw new Error('Supabase 설정이 필요합니다.')
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.')
  return token
}

async function request(path: string, init?: RequestInit): Promise<any> {
  const token = await getToken()
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  })
  let data: any = {}
  try {
    data = await res.json()
  } catch {
    throw new Error(`요청 실패 (HTTP ${res.status})`)
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `요청 실패 (HTTP ${res.status})`)
  }
  return data
}

export const fetchLeads = (): Promise<LeadsListResponse> => request('/api/admin/business-leads?action=list')

export const fetchLeadDetail = (id: string): Promise<{ lead: LeadRow; session: SessionRow | null; events: EventRow[] }> =>
  request(`/api/admin/business-leads?action=detail&id=${encodeURIComponent(id)}`)

export const updateLead = (
  id: string,
  patch: { leadStatus?: string; memo?: string; assignedLabel?: string; contactedAt?: boolean; meetingMemo?: string },
) => request('/api/admin/business-leads', { method: 'POST', body: JSON.stringify({ action: 'update', id, ...patch }) })

/** 전화번호 마스킹 (목록용) — 010-****-1234 */
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 8) return phone
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`
}

export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return phone
}

/** CSV 생성 (UTF-8 BOM — 한글 Excel 호환) + 다운로드 */
export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
