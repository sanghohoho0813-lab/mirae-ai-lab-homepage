// Supabase service_role 클라이언트 (서버 전용).
// api/_lib 하위 파일은 Vercel 이 함수 엔드포인트로 배포하지 않습니다(_ 접두 규칙).
// ⚠️ SUPABASE_SERVICE_ROLE_KEY 는 절대 프론트(VITE_)로 노출하지 않습니다.

export type SupabaseAdmin = {
  from: (table: string) => any
  auth: { getUser: (token: string) => Promise<{ data: { user: { id: string } | null }; error: unknown }> }
}

let testClient: SupabaseAdmin | null = null
/** 테스트 전용 — 로컬 유닛테스트에서 가짜 클라이언트 주입 */
export function __setTestSupabaseAdmin(client: SupabaseAdmin | null) {
  testClient = client
}

export function supabaseConfigured(): boolean {
  return Boolean((process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function getSupabaseAdmin(): Promise<SupabaseAdmin | null> {
  if (testClient) return testClient
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) as unknown as SupabaseAdmin
}

/** Bearer 토큰 → profiles.role === 'admin' 확인 (기존 admin API 패턴 재사용) */
export async function verifyAdmin(
  admin: SupabaseAdmin,
  authHeader: string | string[] | undefined,
): Promise<{ ok: true; userId: string } | { ok: false; status: number; message: string; debugCode: string }> {
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return { ok: false, status: 401, message: '로그인이 필요합니다.', debugCode: 'no_token' }
  const { data: userData, error } = await admin.auth.getUser(token)
  if (error || !userData?.user) return { ok: false, status: 401, message: '유효하지 않은 인증입니다.', debugCode: 'bad_token' }
  const { data: me } = await admin.from('profiles').select('role').eq('id', userData.user.id).maybeSingle()
  if ((me as { role?: string } | null)?.role !== 'admin') {
    return { ok: false, status: 403, message: '관리자 권한이 필요합니다.', debugCode: 'not_admin' }
  }
  return { ok: true, userId: userData.user.id }
}
