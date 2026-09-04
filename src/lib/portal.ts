// 미래 AI 랩 — 클라이언트 Supabase 데이터 레이어.
// 읽기는 Supabase client(RLS 적용)로, 권한 변경 쓰기는 서버리스 API(service_role)로 처리합니다.
import { supabase } from './supabase'
import type { AccessType, Profile, Review, Survey, ToolAccess } from './platform'

export type DbTool = {
  id: string
  slug: string
  title: string
  category: string | null
  status: string | null
  access_type: AccessType
  /**
   * 도구 실제 주소. 일반 사용자 조회(fetchTrialTools)에는 포함하지 않는다 —
   * 만료된 사용자가 응답 본문에서 주소를 주워가는 것을 막기 위해,
   * 권한 확인을 거치는 openTool() 로만 받는다. (관리자 조회에는 포함)
   */
  external_url?: string | null
  is_public: boolean
  is_trial_available: boolean
  created_at: string
}

export type ApiResult = { message?: string; [key: string]: unknown }

async function getToken(): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function post(url: string, body: unknown): Promise<ApiResult> {
  const token = await getToken()
  if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  let data: ApiResult = {}
  try {
    data = (await res.json()) as ApiResult
  } catch {
    // 비정상(비-JSON) 응답 → 함수 크래시/404 등. 상태코드를 노출해 진단 가능하게.
    throw new Error(`요청 실패 (HTTP ${res.status}). 잠시 후 다시 시도하거나 관리자에게 문의해 주세요.`)
  }

  if (!res.ok || data.ok === false) {
    const code = data.debugCode ? ` [${String(data.debugCode)}]` : ''
    const detail = data.detail ? ` ${String(data.detail)}` : ''
    throw new Error(`${data.message || `요청 실패 (HTTP ${res.status})`}${code}${detail}`)
  }
  return data
}

// ── 사용자(내 도구함) ────────────────────────────────────────────────────────
// external_url 은 일부러 제외한다 (권한 확인 후 openTool 로만 전달)
const TRIAL_TOOL_COLUMNS = 'id, slug, title, category, status, access_type, is_public, is_trial_available, created_at'

export async function fetchTrialTools(): Promise<DbTool[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('tools')
    .select(TRIAL_TOOL_COLUMNS)
    .eq('is_trial_available', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as DbTool[]
}

export async function fetchMyAccess(userId: string): Promise<ToolAccess[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('tool_access').select('*').eq('user_id', userId)
  if (error) throw error
  return (data ?? []) as ToolAccess[]
}

// 통합 엔드포인트(/api/trial) — Vercel 서버리스 함수 개수 제한 대응. action 으로 분기.
/**
 * 이용 신청. 승인이 아니라 "신청 접수"만 한다 —
 * 실제 이용 권한은 관리자가 /admin 에서 승인해야 생긴다.
 */
export const requestAccess = (toolId: string) => post('/api/trial', { action: 'request', toolId })
export const submitReview = (toolId: string, content: string) =>
  post('/api/trial', { action: 'review', toolId, content })
export const submitSurvey = (toolId: string, answers: Record<string, string>) =>
  post('/api/trial', { action: 'survey', toolId, answers })

/** 이용 권한을 서버에서 확인한 뒤 도구 주소를 받아온다. 만료·미시작이면 403 으로 실패한다. */
export async function openTool(toolId: string): Promise<string> {
  const r = await post('/api/trial', { action: 'open', toolId })
  const url = typeof r.url === 'string' ? r.url : ''
  if (!url) throw new Error('도구 주소를 받지 못했습니다.')
  return url
}

// ── 관리자 ──────────────────────────────────────────────────────────────────
export async function fetchAllProfiles(): Promise<Profile[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Profile[]
}

export async function fetchAllTools(): Promise<DbTool[]> {
  if (!supabase) return []
  // 관리자 화면도 external_url 은 쓰지 않는다 → 컬럼 권한 회수(tool-url-hardening.sql)와 호환
  const { data, error } = await supabase.from('tools').select(TRIAL_TOOL_COLUMNS).order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as DbTool[]
}

export async function fetchAllAccess(): Promise<ToolAccess[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('tool_access').select('*')
  if (error) throw error
  return (data ?? []) as ToolAccess[]
}

export async function fetchAllReviews(): Promise<Review[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Review[]
}

export async function fetchAllSurveys(): Promise<Survey[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('surveys').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Survey[]
}

export type AdminAction =
  | { action: 'extend'; userId: string; toolId: string; days: number }
  | { action: 'setExpiry'; userId: string; toolId: string; date: string }
  | { action: 'unlimited'; userId: string; toolId: string }
  | { action: 'revoke'; userId: string; toolId: string }
  | { action: 'grant'; userId: string; toolId: string }
  | { action: 'paid'; userId: string; toolId: string; paid: boolean }
  | { action: 'memo'; userId: string; memo: string }
  | { action: 'reviewStatus'; reviewId: string; status: 'approved' | 'rejected' }

export const adminAccessAction = (payload: AdminAction) => post('/api/admin/access', payload)
