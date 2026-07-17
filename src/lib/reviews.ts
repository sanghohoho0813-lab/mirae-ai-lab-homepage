// 상품 리뷰 — 클라이언트. 공개 조회·작성은 인증 불필요, 관리자 기능은 Bearer 토큰.
import { supabase } from './supabase'

export type PublicReview = {
  id: string
  authorName: string
  company: string | null
  rating: number
  content: string
  createdAt: string
}
export type ReviewStats = { count: number; avg: number }
export type PublicReviewsResponse = { reviews: PublicReview[]; stats: ReviewStats }

export type SubmitReviewInput = {
  slug: string
  authorName: string
  company?: string
  rating: number
  content: string
  email?: string
  phone?: string
}

export type AdminReview = {
  id: string
  product_slug: string
  author_name: string
  company: string | null
  rating: number
  content: string
  contact_email: string | null
  contact_phone: string | null
  status: 'pending' | 'approved' | 'rejected'
  ebook_sent: boolean
  admin_memo: string | null
  created_at: string
  updated_at: string
}
export type AdminReviewStats = { total: number; pending: number; approved: number; rejected: number; ebookPending: number }
export type AdminReviewsResponse = { reviews: AdminReview[]; stats: AdminReviewStats }

async function json(res: Response): Promise<any> {
  let data: any = {}
  try { data = await res.json() } catch { throw new Error(`요청 실패 (HTTP ${res.status})`) }
  if (!res.ok || data.ok === false) throw new Error(data.message || `요청 실패 (HTTP ${res.status})`)
  return data
}

async function getToken(): Promise<string> {
  if (!supabase) throw new Error('Supabase 설정이 필요합니다.')
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.')
  return token
}

// ── 공개 ──
export async function fetchReviews(slug: string): Promise<PublicReviewsResponse> {
  const res = await fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`)
  const d = await json(res)
  return { reviews: d.reviews ?? [], stats: d.stats ?? { count: 0, avg: 0 } }
}

export async function submitReview(input: SubmitReviewInput): Promise<string> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'submit', ...input }),
  })
  const d = await json(res)
  return d.message ?? '후기가 접수되었습니다.'
}

// ── 관리자 ──
export async function fetchAdminReviews(slug?: string): Promise<AdminReviewsResponse> {
  const token = await getToken()
  const path = slug ? `/api/reviews?action=admin-list&slug=${encodeURIComponent(slug)}` : '/api/reviews?action=admin-list'
  const res = await fetch(path, { headers: { Authorization: `Bearer ${token}` } })
  const d = await json(res)
  return { reviews: d.reviews ?? [], stats: d.stats }
}

export async function moderateReview(
  id: string,
  patch: { status?: 'pending' | 'approved' | 'rejected'; ebookSent?: boolean; adminMemo?: string },
): Promise<void> {
  const token = await getToken()
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'moderate', id, ...patch }),
  })
  await json(res)
}
