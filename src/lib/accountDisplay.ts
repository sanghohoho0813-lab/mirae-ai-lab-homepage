// 계정 표시 공용 헬퍼 — 이름/회원유형/아바타/이메일 해석을 한 곳에서 관리(순수 함수, 단위 테스트 가능).
// 헤더·드롭다운·모바일 메뉴·마이페이지가 모두 동일 결과를 쓰도록 통일한다.
import type { User } from '@supabase/supabase-js'
import type { AppRole } from './authRouting'
import type { MemberType, Profile } from './platform'
import { resolveUserEmail } from './authRouting'

type MetaLike = Record<string, unknown> | null | undefined

function metaStr(meta: MetaLike, key: string): string | null {
  const v = (meta ?? {})[key]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

/**
 * 표시 이름 우선순위:
 * 1) profiles.name → 2) user_metadata.full_name → 3) user_metadata.name
 * → 4) user_metadata.user_name → 5) 이메일 @ 앞부분 → 6) '회원'
 */
export function displayName(user: User | null | undefined, profile: Profile | null | undefined): string {
  const meta = user?.user_metadata as MetaLike
  const email = resolveUserEmail(user, profile?.email)
  const candidates = [
    typeof profile?.name === 'string' ? profile.name : null,
    metaStr(meta, 'full_name'),
    metaStr(meta, 'name'),
    metaStr(meta, 'user_name'),
    email ? email.split('@')[0] : null,
  ]
  const found = candidates.find((c) => typeof c === 'string' && c.trim().length > 0)
  return found ? (found as string).trim() : '회원'
}

/** 메뉴에 표시할 이메일 (provider 이메일 우선 해석) */
export function accountEmail(user: User | null | undefined, profile: Profile | null | undefined): string | null {
  return resolveUserEmail(user, profile?.email)
}

/**
 * 회원유형 라벨:
 * - 미완료(needsOnboarding) → '가입 완료 필요'
 * - 대표+컨설턴트 → '대표 · 컨설턴트'
 * - 대표(ceo/business) → '중소기업 대표'
 * - 컨설턴트 → '컨설턴트'
 * - 관리자만 → '관리자'
 * - 그 외 → null
 */
export function memberTypeLabel(opts: {
  roles: AppRole[]
  memberType: MemberType | null | undefined
  needsOnboarding: boolean
}): string | null {
  if (opts.needsOnboarding) return '가입 완료 필요'
  const hasCeo = opts.roles.includes('ceo') || opts.memberType === 'business'
  const hasConsultant = opts.roles.includes('consultant') || opts.memberType === 'consultant'
  if (hasCeo && hasConsultant) return '대표 · 컨설턴트'
  if (hasCeo) return '중소기업 대표'
  if (hasConsultant) return '컨설턴트'
  if (opts.roles.includes('admin')) return '관리자'
  return null
}

/** 아바타 이니셜 — 이름 첫 글자. 없으면 null → 호출부에서 AI 아이콘 폴백 */
export function avatarInitial(name: string | null | undefined): string | null {
  const n = (name ?? '').trim()
  if (!n || n === '회원') return null
  return Array.from(n)[0] ?? null
}

/** 프로필 이미지 URL — 소셜 provider 가 제공한 경우만 */
export function resolveAvatarUrl(user: User | null | undefined): string | null {
  const meta = user?.user_metadata as MetaLike
  return metaStr(meta, 'avatar_url') ?? metaStr(meta, 'picture')
}

/** 연결된 로그인 방식 목록 (google/kakao/email) — identities + app_metadata.providers 조합, 중복 제거 */
export function connectedProviders(user: User | null | undefined): string[] {
  if (!user) return []
  const fromIdentities = ((user.identities ?? []).map((i) => i?.provider).filter(Boolean)) as string[]
  const ap = (user.app_metadata ?? {}) as { provider?: string; providers?: string[] }
  const fromApp = ([ap.provider, ...((ap.providers as string[] | undefined) ?? [])].filter(Boolean)) as string[]
  return Array.from(new Set([...fromIdentities, ...fromApp]))
}

/** 이메일/비밀번호 로그인 수단 보유 여부 — 소셜 전용 사용자는 비밀번호가 없다 */
export function hasEmailPassword(user: User | null | undefined): boolean {
  return connectedProviders(user).includes('email')
}

const PROVIDER_LABEL: Record<string, string> = { google: 'Google', kakao: '카카오', email: '이메일' }
export function providerLabel(p: string): string {
  return PROVIDER_LABEL[p] ?? p
}
