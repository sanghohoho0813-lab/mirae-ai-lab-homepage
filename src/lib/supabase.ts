// 미래 AI 랩 — Supabase 클라이언트.
// 환경변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)가 없으면 client=null 로 두어
// 앱이 깨지지 않게 하고, 화면에서 "환경변수 미설정" 안내를 보여줍니다.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      // PKCE — OAuth(구글·카카오) code 교환 방식. /auth/callback 에서 세션이 확립됩니다.
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
    })
  : null
