// 미래 AI 랩 — Supabase Auth 기반 인증 컨텍스트.
// 환경변수 미설정(supabase=null) 시 configured=false 로 두고 화면에서 안내합니다.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'
import type { Profile } from './platform'

export type SignupInput = {
  name: string
  email: string
  phone: string
  password: string
  organization: string
  interests?: string[]
}

export type AuthResult = { ok: boolean; error?: string; needsEmailConfirm?: boolean }

type AuthValue = {
  configured: boolean
  loading: boolean
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (input: SignupInput) => Promise<AuthResult>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

async function loadProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  return (data as Profile | null) ?? null
}

function mapAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('already') || m.includes('registered')) return '이미 가입된 이메일입니다. 로그인해 주세요.'
  if (m.includes('invalid login')) return '이메일 또는 비밀번호가 올바르지 않습니다.'
  if (m.includes('email not confirmed')) return '이메일 인증이 필요합니다. 메일함을 확인해 주세요.'
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let active = true
    const sync = async (session: Session | null) => {
      const u = session?.user ?? null
      if (!active) return
      setUser(u)
      setProfile(u ? await loadProfile(u.id) : null)
    }
    supabase.auth.getSession().then(async ({ data }) => {
      await sync(data.session)
      if (active) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void sync(session)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) setProfile(await loadProfile(user.id))
  }, [user])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id)
      setProfile(await loadProfile(data.user.id))
    }
    return { ok: true }
  }, [])

  const signUp = useCallback(async (input: SignupInput): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    if ((input.password ?? '').length < 8) {
      return { ok: false, error: '비밀번호는 8자 이상이어야 합니다.' }
    }
    // 휴대폰 중복 사전 확인 (security definer RPC)
    if (input.phone) {
      const { data: exists } = await supabase.rpc('phone_exists', { p: input.phone.trim() })
      if (exists === true) return { ok: false, error: '이미 등록된 휴대폰 번호입니다.' }
    }
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          name: input.name.trim(),
          phone: input.phone.trim(),
          organization: input.organization.trim(),
        },
      },
    })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    // 세션이 없으면 이메일 인증 대기 상태
    if (!data.session) return { ok: true, needsEmailConfirm: true }
    if (data.user) setProfile(await loadProfile(data.user.id))
    return { ok: true }
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [loading, user, profile, signIn, signUp, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
