// 미래 AI 랩 — Supabase Auth 기반 인증 컨텍스트.
// - 하나의 계정 + 복수 역할(user_roles: ceo/consultant/admin). profiles.role='admin' 기존 호환 유지.
// - OAuth(구글·카카오)는 PKCE + /auth/callback 복귀. 신규 사용자는 /auth/onboarding 에서 가입 완료.
// - 환경변수 미설정(supabase=null) 시 configured=false 로 두고 화면에서 안내합니다.
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
import type { MemberType, Profile } from './platform'
import { oauthRedirectUrl, resetPasswordRedirectUrl, type AppRole } from './authRouting'

export type OAuthProvider = 'google' | 'kakao'

export type SignupInput = {
  /** 이름·휴대폰은 본인인증(PASS) 결과값 — 사용자가 임의 입력하지 않습니다 */
  name: string
  phone: string
  email: string
  password: string
  memberType: MemberType
  organization?: string
}

export type AuthResult = { ok: boolean; error?: string; needsEmailConfirm?: boolean }

export type OnboardingStatus = 'pending' | 'identity_required' | 'email_verification_required' | 'completed'

type AuthValue = {
  configured: boolean
  loading: boolean
  user: User | null
  profile: Profile | null
  /** 복수 역할 (user_roles). profiles.role='admin' 은 admin 으로 흡수 */
  roles: AppRole[]
  hasRole: (role: AppRole) => boolean
  isAdmin: boolean
  /** 호환 — 단일 member_type (기존 화면용) */
  memberType: MemberType | null
  phoneVerified: boolean
  identityVerified: boolean
  onboardingStatus: OnboardingStatus | null
  /** 로그인했지만 가입(온보딩) 미완료 — /auth/onboarding 필요 */
  needsOnboarding: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (input: SignupInput) => Promise<AuthResult>
  signInWithOAuth: (provider: OAuthProvider, next?: string | null) => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (newPassword: string) => Promise<AuthResult>
  resendConfirmEmail: (email: string) => Promise<AuthResult>
  getAccessToken: () => Promise<string | null>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

async function loadProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  return (data as Profile | null) ?? null
}

async function loadRoles(userId: string): Promise<AppRole[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId)
    if (error) return [] // user_roles 미시드 환경 — member_type 폴백 사용
    return ((data ?? []) as { role: string }[])
      .map((r) => r.role)
      .filter((r): r is AppRole => r === 'ceo' || r === 'consultant' || r === 'admin')
  } catch {
    return []
  }
}

function mapAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('provider is not enabled') || m.includes('unsupported provider')) {
    return '이 소셜 로그인은 아직 설정 중입니다. 이메일 로그인을 이용해주세요.'
  }
  if (m.includes('already') || m.includes('registered')) return '이미 가입된 이메일입니다. 로그인해 주세요.'
  if (m.includes('invalid login')) return '이메일 또는 비밀번호가 올바르지 않습니다.'
  if (m.includes('email not confirmed')) return '이메일 인증이 필요합니다. 메일함을 확인해 주세요.'
  if (m.includes('rate limit') || m.includes('too many')) return '요청이 많습니다. 잠시 후 다시 시도해주세요.'
  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
}

/** onboarding_status 가 없던(마이그레이션 전) 프로필 호환 판정 */
function resolveOnboarding(profile: Profile | null): OnboardingStatus | null {
  if (!profile) return null
  const raw = (profile as Record<string, unknown>).onboarding_status
  if (raw === 'pending' || raw === 'identity_required' || raw === 'email_verification_required' || raw === 'completed') {
    return raw
  }
  // 마이그레이션 전 데이터: member_type 이 있으면 가입 완료로 간주(기존 회원 보호)
  return profile.member_type ? 'completed' : 'pending'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<AppRole[]>([])

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
      if (u) {
        const [p, r] = await Promise.all([loadProfile(u.id), loadRoles(u.id)])
        if (!active) return
        setProfile(p)
        setRoles(r)
      } else {
        setProfile(null)
        setRoles([])
      }
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
    if (user) {
      const [p, r] = await Promise.all([loadProfile(user.id), loadRoles(user.id)])
      setProfile(p)
      setRoles(r)
    }
  }, [user])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    if (data.user) {
      // last_login 갱신 — 컬럼 미존재(마이그레이션 전) 환경에서도 로그인 자체는 성공 유지
      await supabase.from('profiles').update({ last_login_at: new Date().toISOString(), last_login_provider: 'email' }).eq('id', data.user.id)
        .then(async (r) => {
          if (r.error) await supabase!.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', data.user!.id)
        })
      const [p, r] = await Promise.all([loadProfile(data.user.id), loadRoles(data.user.id)])
      setProfile(p)
      setRoles(r)
    }
    return { ok: true }
  }, [])

  const signUp = useCallback(async (input: SignupInput): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    if ((input.password ?? '').length < 8) {
      return { ok: false, error: '비밀번호는 8자 이상이어야 합니다.' }
    }
    if (input.phone) {
      const { data: exists } = await supabase.rpc('phone_exists', { p: input.phone.trim() })
      if (exists === true) return { ok: false, error: '이 휴대폰 번호로 가입된 계정이 있습니다. 기존 방식으로 로그인해주세요.' }
    }
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          name: input.name.trim(),
          phone: input.phone.trim(),
          organization: (input.organization ?? '').trim(),
          member_type: input.memberType,
        },
      },
    })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    if (!data.session) return { ok: true, needsEmailConfirm: true }
    if (data.user) setProfile(await loadProfile(data.user.id))
    return { ok: true }
  }, [])

  const signInWithOAuth = useCallback(async (provider: OAuthProvider, next?: string | null): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    // 이미 로그인된 상태의 중복 OAuth 요청 방지
    const { data: cur } = await supabase.auth.getSession()
    if (cur.session) return { ok: true }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: oauthRedirectUrl(next) },
    })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    return { ok: true } // 브라우저가 provider 로 리다이렉트됨
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    // 계정 존재 여부를 노출하지 않기 위해 오류도 성공과 동일하게 응답
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: resetPasswordRedirectUrl() }).catch(() => {})
    return { ok: true }
  }, [])

  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    if (newPassword.length < 8) return { ok: false, error: '비밀번호는 8자 이상이어야 합니다.' }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    return { ok: true }
  }, [])

  const resendConfirmEmail = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    return { ok: true }
  }, [])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setRoles([])
  }, [])

  const value = useMemo<AuthValue>(() => {
    const isAdmin = profile?.role === 'admin' || roles.includes('admin')
    // member_type 폴백 — user_roles 미시드 환경 호환
    const effectiveRoles: AppRole[] = [...roles]
    if (profile?.member_type === 'business' && !effectiveRoles.includes('ceo')) effectiveRoles.push('ceo')
    if (profile?.member_type === 'consultant' && !effectiveRoles.includes('consultant')) effectiveRoles.push('consultant')
    if (isAdmin && !effectiveRoles.includes('admin')) effectiveRoles.push('admin')
    const onboardingStatus = resolveOnboarding(profile)
    return {
      configured: isSupabaseConfigured,
      loading,
      user,
      profile,
      roles: effectiveRoles,
      hasRole: (role: AppRole) => effectiveRoles.includes(role),
      isAdmin,
      memberType: (profile?.member_type as MemberType | null | undefined) ?? null,
      phoneVerified: profile?.phone_verified === true,
      identityVerified: profile?.identity_verified === true,
      onboardingStatus,
      // 관리자는 온보딩 미완료로 접근이 막히지 않도록 예외
      needsOnboarding: Boolean(user && profile && onboardingStatus !== 'completed' && !isAdmin),
      signIn,
      signUp,
      signInWithOAuth,
      resetPassword,
      updatePassword,
      resendConfirmEmail,
      getAccessToken,
      signOut,
      refreshProfile,
    }
  }, [loading, user, profile, roles, signIn, signUp, signInWithOAuth, resetPassword, updatePassword, resendConfirmEmail, getAccessToken, signOut, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
