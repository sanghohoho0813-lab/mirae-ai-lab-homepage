// 인증 라우팅 헬퍼 — next 경로 검증(오픈 리디렉션 방지) · 역할별 홈 · OAuth redirect URL 생성.
import type { MemberType } from './platform'

export type AppRole = 'ceo' | 'consultant' | 'admin'

/** 내부 경로만 허용 — 외부 URL·프로토콜 상대경로(//) 차단 */
export function sanitizeNext(raw: string | null | undefined): string | null {
  if (!raw) return null
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('://') || raw.includes('\\')) return null
  return raw.slice(0, 500)
}

/** 역할별 기본 이동 경로 */
export function roleHome(roles: AppRole[], memberType?: MemberType | null): string {
  const hasCeo = roles.includes('ceo') || memberType === 'business'
  const hasConsultant = roles.includes('consultant') || memberType === 'consultant'
  if (roles.includes('admin')) return '/admin'
  if (hasCeo && hasConsultant) return '/' // 두 역할 모두 → 역할 선택 게이트웨이
  if (hasConsultant) return '/my-tools'
  if (hasCeo) return '/business-services'
  return '/'
}

/** OAuth redirectTo — 항상 이 helper 로 생성 (운영·Preview 도메인 자동 대응) */
export function oauthRedirectUrl(next?: string | null): string {
  const base = `${window.location.origin}/auth/callback`
  const safe = sanitizeNext(next)
  return safe ? `${base}?next=${encodeURIComponent(safe)}` : base
}

/** 비밀번호 재설정 링크 복귀 주소 */
export function resetPasswordRedirectUrl(): string {
  return `${window.location.origin}/auth/reset-password`
}

/** 로그인 페이지로 보낼 때 next 유지 */
export function loginPathWithNext(next: string): string {
  const safe = sanitizeNext(next)
  return safe ? `/login?next=${encodeURIComponent(safe)}` : '/login'
}
