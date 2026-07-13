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

// ── OAuth 사용자 provider·이메일 해석 (온보딩 완료 판정 공용, 순수 함수라 테스트 가능) ──
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

type OAuthUserLike = {
  email?: string | null
  app_metadata?: { provider?: string; providers?: string[] } | null
  user_metadata?: Record<string, unknown> | null
  identities?: Array<{ provider?: string; identity_data?: Record<string, unknown> | null }> | null
} | null | undefined

/** google/kakao 소셜 로그인 여부 — app_metadata.provider/providers + identities[].provider 조합 */
export function isSocialProvider(user: OAuthUserLike): boolean {
  if (!user) return false
  const ap = user.app_metadata ?? {}
  const list = [ap.provider, ...(ap.providers ?? []), ...((user.identities ?? []).map((i) => i?.provider))]
  return list.some((p) => p === 'google' || p === 'kakao')
}

/** 소셜 provider 이름 라벨 (표시용) */
export function socialProviderLabel(user: OAuthUserLike): string {
  if (!user) return '소셜'
  const ap = user.app_metadata ?? {}
  const list = [ap.provider, ...(ap.providers ?? []), ...((user.identities ?? []).map((i) => i?.provider))]
  if (list.includes('kakao')) return '카카오'
  if (list.includes('google')) return 'Google'
  return '소셜'
}

/**
 * OAuth provider 가 검증한 이메일 해석.
 * 우선순위: user.email → profiles.email → identities.identity_data.email → user_metadata.(account_)email
 * 카카오가 이메일을 user.email 이 아닌 다른 위치에 넣어도 "미제공"으로 오판하지 않도록 한다.
 */
export function resolveUserEmail(user: OAuthUserLike, profileEmail?: string | null): string | null {
  if (!user) return null
  const meta = (user.user_metadata ?? {}) as { email?: unknown; account_email?: unknown }
  const cands: unknown[] = [
    user.email,
    profileEmail,
    ...((user.identities ?? []).map((i) => (i?.identity_data as { email?: unknown } | undefined)?.email)),
    meta.email,
    meta.account_email,
  ]
  const found = cands.find((e) => typeof e === 'string' && EMAIL_RE.test(e))
  return typeof found === 'string' ? found : null
}
