// 미래 AI 랩 — mock 인증 컨텍스트 (localStorage).
// 다음 단계에서 login/signup/logout 본문을 Supabase Auth 호출로 교체하면 됩니다.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  getSessionUserId,
  getUserByEmail,
  getUserById,
  setSession,
  upsertUser,
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

type AuthValue = {
  user: Profile | null
  isAdmin: boolean
  login: (email: string) => Profile
  signup: (input: SignupInput) => Profile
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(() => {
    const id = getSessionUserId()
    return id ? getUserById(id) ?? null : null
  })

  const refresh = useCallback(() => {
    const id = getSessionUserId()
    setUser(id ? getUserById(id) ?? null : null)
  }, [])

  // mock 로그인: 비밀번호는 검증하지 않고, 이메일로 사용자를 찾거나 새로 만듭니다.
  const login = useCallback((email: string) => {
    const existing = getUserByEmail(email)
    const profile =
      existing ??
      upsertUser({ email, name: email.split('@')[0] || '회원', phone: '', organization: '' })
    setSession(profile.id)
    setUser(profile)
    return profile
  }, [])

  const signup = useCallback((input: SignupInput) => {
    const profile = upsertUser({
      email: input.email,
      name: input.name,
      phone: input.phone,
      organization: input.organization,
      interests: input.interests,
    })
    setSession(profile.id)
    setUser(profile)
    return profile
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
