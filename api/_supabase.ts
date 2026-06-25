// 공용: 서버리스 함수용 Supabase service_role 클라이언트 + 토큰 검증.
// ⚠️ SUPABASE_SERVICE_ROLE_KEY 는 서버에서만 사용 (절대 프론트 노출 금지).
// 파일명이 '_'로 시작하므로 Vercel 라우트로 노출되지 않습니다.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

export function getAdmin(): SupabaseClient | null {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function bearer(req: VercelRequest): string | null {
  const h = (req.headers.authorization as string) || ''
  return h.startsWith('Bearer ') ? h.slice(7) : null
}

export async function getUser(admin: SupabaseClient, token: string): Promise<User | null> {
  const { data, error } = await admin.auth.getUser(token)
  if (error) return null
  return data.user
}

export async function isAdmin(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle()
  return (data as { role?: string } | null)?.role === 'admin'
}

export function parseBody<T = Record<string, unknown>>(req: VercelRequest): T {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as T
    } catch {
      return {} as T
    }
  }
  return (req.body ?? {}) as T
}

export const json = (res: VercelResponse, status: number, body: unknown) => res.status(status).json(body)
