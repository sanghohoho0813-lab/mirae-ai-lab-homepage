// 공용: 서버리스 함수용 Supabase service_role 클라이언트 + 토큰 검증 + 구조화 응답.
// ⚠️ SUPABASE_SERVICE_ROLE_KEY 는 서버에서만 사용 (절대 프론트 노출 금지).
// 파일명이 '_'로 시작하므로 Vercel 라우트로 노출되지 않습니다.
//
// 중요: 이 파일은 @supabase/supabase-js 를 "정적 import" 하지 않습니다.
//       (정적 import 가 로드 시 실패하면 핸들러 try/catch 밖에서 throw → 빈 500 발생)
//       대신 getAdmin() 안에서 동적 import 하여, 실패해도 JSON 으로 응답할 수 있게 합니다.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { SupabaseClient, User } from '@supabase/supabase-js'

/** service_role 클라이언트 생성 (동적 import). env 없으면 null. */
export async function getAdmin(): Promise<SupabaseClient | null> {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function bearer(req: VercelRequest): string | null {
  const h = ((req.headers.authorization || req.headers.Authorization) as string) || ''
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

/** 민감정보 없는 짧은 에러 설명(개발 확인용). Supabase 에러는 키를 포함하지 않습니다. */
export function shortDetail(cause: unknown): string {
  if (!cause) return ''
  let s: string
  if (cause instanceof Error) s = `${cause.name}: ${cause.message}`
  else if (typeof cause === 'object' && cause && 'message' in cause)
    s = String((cause as { message?: unknown }).message)
  else s = String(cause)
  return s.replace(/\s+/g, ' ').slice(0, 180)
}

export const json = (res: VercelResponse, status: number, body: unknown) => res.status(status).json(body)

export const ok = (res: VercelResponse, body: Record<string, unknown> = {}) =>
  res.status(200).json({ ok: true, ...body })

/** 실패 응답: { ok:false, message, debugCode, detail? } + 서버 로그 */
export function fail(
  res: VercelResponse,
  status: number,
  message: string,
  debugCode: string,
  cause?: unknown,
): VercelResponse {
  const detail = shortDetail(cause)
  console.error(`[api] ${debugCode} (${status}) ${message}${detail ? ` :: ${detail}` : ''}`)
  return res.status(status).json({ ok: false, message, debugCode, ...(detail ? { detail } : {}) })
}
