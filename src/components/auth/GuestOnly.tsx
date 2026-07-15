// 로그인 사용자가 /login · /signup 에 접근하면 역할별 홈(또는 온보딩)으로 보낸다.
// 단, 페이지에서 '지금 막' 로그인/가입이 진행되는 경우(진입 시엔 게스트였던 경우)는
// 페이지 자체 흐름(약관·complete·확인메일)을 방해하지 않도록 리다이렉트하지 않는다.
import { useRef, type ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { roleHome, sanitizeNext } from '../../lib/authRouting'

export default function GuestOnly({ children }: { children: ReactNode }) {
  const { loading, user, needsOnboarding, roles, memberType } = useAuth()
  const [searchParams] = useSearchParams()
  const next = sanitizeNext(searchParams.get('next'))

  // 인증 로딩이 끝난 첫 시점에 '진입 당시 게스트였는지'를 1회 기록
  const wasGuestAtEntry = useRef<boolean | null>(null)
  if (wasGuestAtEntry.current === null && !loading) {
    wasGuestAtEntry.current = !user
  }

  if (loading) return <>{children}</>
  // 이미 로그인된 채로 방문한 경우에만 리다이렉트
  if (user && wasGuestAtEntry.current === false) {
    if (needsOnboarding) return <Navigate to="/auth/onboarding" replace />
    return <Navigate to={next ?? roleHome(roles, memberType)} replace />
  }
  return <>{children}</>
}
