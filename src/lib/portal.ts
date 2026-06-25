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
  external_url: string | null
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
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as ApiResult
  if (!res.ok) throw new Error(data.message || '요청에 실패했습니다.')
  return data
}

// ── 사용자(내 도구함) ────────────────────────────────────────────────────────
export async function fetchTrialTools(): Promise<DbTool[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('tools')
    .select('*')
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

export const startTrial = (toolId: string) => post('/api/trial/start', { toolId })
export const submitReview = (toolId: string, content: string) =>
  post('/api/trial/review', { toolId, content })
export const submitSurvey = (toolId: string, answers: Record<string, string>) =>
  post('/api/trial/survey', { toolId, answers })

// ── 관리자 ──────────────────────────────────────────────────────────────────
export async function fetchAllProfiles(): Promise<Profile[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Profile[]
}

export async function fetchAllTools(): Promise<DbTool[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('tools').select('*').order('created_at', { ascending: true })
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
