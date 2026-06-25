// 미래 AI 랩 — mock 인증 컨텍스트 (localStorage).
// ⚠️ 비밀번호 검증/이메일 인증이 없는 mock입니다. 실제 보안은 Supabase Auth로 교체.
// 가입 정책: AUTH_POLICY.md 참고.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  ADMIN_EMAIL,
  createUser,
  getSessionUserId,
  getUserByEmail,
  getUserById,
  getUserByPhone,
  setSession,
  touchLogin,
  type Profile,
} from './platform'

export type SignupInput = {
  name: string
  email: string
  phone: string
  password: string
  organization: string
  interests?: string[]
}

export type AuthResult = { ok: boolean; error?: string; user?: Profile }

const PASSWORD_MIN = 8

type AuthValue = {
  user: Profile | null
  isAdmin: boolean
  login: (email: string, password?: string) => AuthResult
  signup: (input: SignupInput) => AuthResult
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

const eq = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(() => {
    const id = getSessionUserId()
    return id ? getUserById(id) ?? null : null
  })

  const refresh = useCallback(() => {
    const id = getSessionUserId()
    setUser(id ? getUserById(id) ?? null : null)
  }, [])

  // mock 로그인: 가입된 이메일만 허용. (관리자 이메일은 데모 편의를 위해 자동 생성)
  const login = useCallback((email: string): AuthResult => {
    const existing = getUserByEmail(email)
    if (existing) {
      setSession(existing.id)
      touchLogin(existing.id)
      setUser(getUserById(existing.id) ?? existing)
      return { ok: true, user: existing }
    }
    if (eq(email, ADMIN_EMAIL)) {
      const admin = createUser({ email, name: '관리자', phone: '', organization: '미래경영지원센터' })
      setSession(admin.id)
      setUser(admin)
      return { ok: true, user: admin }
    }
    return { ok: false, error: '가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.' }
  }, [])

  // mock 회원가입: 이메일/휴대폰 중복 가입 방지 + 비밀번호 최소 길이
  const signup = useCallback((input: SignupInput): AuthResult => {
    if ((input.password ?? '').length < PASSWORD_MIN) {
      return { ok: false, error: `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.` }
    }
    if (getUserByEmail(input.email)) {
      return { ok: false, error: '이미 가입된 이메일입니다. 로그인해 주세요.' }
    }
    if (input.phone && getUserByPhone(input.phone)) {
      return { ok: false, error: '이미 가입된 휴대폰 번호입니다.' }
    }
    const profile = createUser({
      email: input.email,
      name: input.name,
      phone: input.phone,
      organization: input.organization,
      interests: input.interests,
    })
    setSession(profile.id)
    setUser(profile)
    return { ok: true, user: profile }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthValue>(
    () => ({ user, isAdmin: user?.role === 'admin', login, signup, logout, refresh }),
    [user, login, signup, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
