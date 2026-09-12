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

/** 초대 링크(게스트 패스) — 로그인 없이 정해진 기간 동안만 도구를 여는 링크 */
export type ToolPass = {
  id: string
  tool_id: string
  label: string | null
  expires_at: string
  max_uses: number | null
  use_count: number
  revoked: boolean
  created_at: string
  last_used_at: string | null
  /** 처음 연 브라우저에 링크를 묶는다 — 전달받은 다른 사람은 열 수 없다 */
  single_device: boolean
  claimed_by: string | null
  claimed_at: string | null
}

/**
 * 이 브라우저의 기기 식별자. 1인 고정 링크가 "처음 연 사람"을 알아보는 데만 쓴다.
 * miraeailab.com 저장소에만 있고 링크·주소에는 들어가지 않는다.
 * 저장을 못 하는 환경(시크릿 모드 등)이면 이번 방문에만 쓰는 임시 값을 만든다.
 */
const DEVICE_KEY = 'mirae:device-id'
let memoryDeviceId = ''
export function deviceId(): string {
  const make = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `d${Date.now()}-${Math.random().toString(36).slice(2)}`
  try {
    const saved = localStorage.getItem(DEVICE_KEY)
    if (saved) return saved
    const next = make()
    localStorage.setItem(DEVICE_KEY, next)
    return next
  } catch {
    if (!memoryDeviceId) memoryDeviceId = make()
    return memoryDeviceId
  }
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
  | { action: 'createPass'; toolId: string; days: number; label?: string; maxUses?: number | null; singleDevice?: boolean }
  | { action: 'listPasses' }
  | { action: 'revokePass'; passId: string }
  | { action: 'releasePass'; passId: string }

export const adminAccessAction = (payload: AdminAction) => post('/api/admin/access', payload)

/** 발급된 초대 링크 목록 (관리자) */
export async function fetchToolPasses(): Promise<ToolPass[]> {
  const r = await adminAccessAction({ action: 'listPasses' })
  return Array.isArray(r.passes) ? (r.passes as ToolPass[]) : []
}

/**
 * 초대 링크 발급 (관리자). 토큰 원문은 이 응답에서만 볼 수 있다 —
 * DB 에는 해시만 저장되므로 다시 꺼낼 수 없다.
 */
export async function createToolPass(input: { toolId: string; days: number; label?: string; maxUses?: number | null; singleDevice?: boolean }) {
  const r = await adminAccessAction({ action: 'createPass', ...input })
  return { token: String(r.token ?? ''), passId: String(r.passId ?? ''), expiresAt: String(r.expiresAt ?? '') }
}

/**
 * 초대 링크로 도구 열기. 로그인하지 않은 사람이 부르므로 Authorization 헤더가 없다.
 * (post() 는 세션 토큰을 요구하기 때문에 여기서는 직접 fetch 한다)
 */
export async function openToolPass(token: string): Promise<{ url: string; toolTitle: string | null; expiresAt: string | null }> {
  const res = await fetch('/api/trial', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'pass', token, device: deviceId() }),
  })
  let data: ApiResult = {}
  try {
    data = (await res.json()) as ApiResult
  } catch {
    throw new Error(`요청 실패 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`)
  }
  if (!res.ok || data.ok === false || typeof data.url !== 'string' || !data.url) {
    throw new Error(String(data.message || '링크를 열 수 없습니다.'))
  }
  return {
    url: data.url,
    toolTitle: typeof data.toolTitle === 'string' ? data.toolTitle : null,
    expiresAt: typeof data.expiresAt === 'string' ? data.expiresAt : null,
  }
}
