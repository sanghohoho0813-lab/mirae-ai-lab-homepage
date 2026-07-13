// ───────────────────────────────────────────────────────────────────────────
// 미래 AI 랩 — 플랫폼 mock 레이어 (localStorage 기반)
//
// ⚠️ 1단계(현재): localStorage mock. 실제 인증/DB/서버 검증 없음.
//   - 데이터는 브라우저에 저장되며 클라이언트에서 위변조 가능합니다(데모용).
//   - "버튼 숨김/만료 표시"는 UI 차단일 뿐, 실제 보안 차단이 아닙니다.
//     실제 차단은 서버(Supabase RLS / Edge Function)에서 동일 로직으로 재검증해야 합니다.
//   - 자세한 보안 구조: ACCESS_CONTROL_PLAN.md / 가입 정책: AUTH_POLICY.md
// 다음 단계에서 이 모듈의 함수 본문만 Supabase 호출로 교체하면 됩니다.
// 타입/테이블 구조는 Supabase 스키마를 그대로 따릅니다.
// ───────────────────────────────────────────────────────────────────────────
import { tools as toolCatalog, type AccessType } from '../data/tools'
import {
  EXTENSION_DAYS,
  MAX_FREE_DAYS,
  REVIEW_MIN_CHARS,
  TRIAL_DAYS,
  applyReviewExtension,
  applySurveyExtension,
  calculateTrialDaysLeft,
  formatRemaining,
  canExtendByReview,
  canExtendBySurvey,
  canUseTool,
  effectiveExpiryMs,
  isTrialExpired,
} from '../utils/access'

export type { AccessType }
export { TRIAL_DAYS, EXTENSION_DAYS, MAX_FREE_DAYS, REVIEW_MIN_CHARS }

export const ADMIN_EMAIL = 'sanghohoho0813@gmail.com'

const DAY_MS = 24 * 60 * 60 * 1000

// ── 타입 (Supabase 테이블과 1:1) ────────────────────────────────────────────
export type Role = 'user' | 'admin'

/** 회원유형 — 중소기업 대표(business) / 컨설턴트(consultant). role(권한)과 별개 축. */
export type MemberType = 'business' | 'consultant'

export const MEMBER_TYPE_LABEL: Record<MemberType, string> = {
  business: '중소기업 대표',
  consultant: '컨설턴트',
}

export type AccessStatus =
  | 'none'
  | 'trial_active'
  | 'trial_expired'
  | 'extended_by_review'
  | 'extended_by_survey'
  | 'paid_active'
  | 'unlimited'
  | 'revoked'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type Profile = {
  id: string
  email: string
  name: string
  phone: string
  organization: string
  role: Role
  /** 회원유형 (중소기업 대표 / 컨설턴트). 소셜 신규가입 직후엔 null → 온보딩에서 선택 */
  member_type?: MemberType | null
  /** 휴대폰 SMS 인증 완료 여부 (서버 confirm 후 true) */
  phone_verified?: boolean
  /** PASS 등 본인인증 완료 여부 (추후 서버에서만 세팅) */
  identity_verified?: boolean
  identity_provider?: string | null
  identity_verified_at?: string | null
  interests?: string[]
  memo?: string // 관리자 메모
  last_login_at?: string | null
  created_at: string
}

export type ToolAccess = {
  id: string
  user_id: string
  tool_id: string
  access_status: AccessStatus
  trial_started_at: string | null
  trial_expires_at: string | null
  review_extension_used: boolean
  survey_extension_used: boolean
  paid_until: string | null
  is_unlimited: boolean
  granted_by_admin: boolean
  memo: string
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  user_id: string
  tool_id: string
  content: string
  char_count: number
  status: ReviewStatus
  created_at: string
}

export type Survey = {
  id: string
  user_id: string
  tool_id: string
  answers: Record<string, string>
  created_at: string
}

export type Payment = {
  id: string
  user_id: string
  tool_id: string
  plan_id: string
  payment_status: PaymentStatus
  amount: number
  paid_at: string | null
  expires_at: string | null
}

// ── 라벨 헬퍼 ───────────────────────────────────────────────────────────────
export const accessTypeLabel: Record<AccessType, string> = {
  public: '공개 체험 가능',
  beta: '베타 체험하기',
  restricted: '베타 신청하기',
  private: '공개 준비중',
  comingSoon: '출시 예정',
}

export const accessStatusLabel: Record<AccessStatus, string> = {
  none: '미시작',
  trial_active: '체험 중',
  trial_expired: '체험 만료',
  extended_by_review: '리뷰 연장 중',
  extended_by_survey: '설문 연장 중',
  paid_active: '정식 이용 중',
  unlimited: '무제한',
  revoked: '권한 회수',
}

// ── localStorage 스토어 ─────────────────────────────────────────────────────
const KEY = {
  session: 'mirae:session',
  users: 'mirae:users',
  access: 'mirae:tool_access',
  reviews: 'mirae:reviews',
  surveys: 'mirae:surveys',
} as const

function read<T>(key: string): T[] {
  if (typeof localStorage === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]
  } catch {
    return []
  }
}

function write<T>(key: string, value: T[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'id-' + Math.abs(Date.now() ^ (Math.floor(performance.now() * 1000) || 0)).toString(36)
}

const nowIso = () => new Date().toISOString()
const norm = (s: string) => s.trim().toLowerCase()
const normPhone = (s: string) => s.replace(/[^0-9]/g, '')

// ── 사용자(profiles) ────────────────────────────────────────────────────────
export function getUsers(): Profile[] {
  return read<Profile>(KEY.users)
}

export function getUserById(id: string): Profile | undefined {
  return getUsers().find((u) => u.id === id)
}

export function getUserByEmail(email: string): Profile | undefined {
  return getUsers().find((u) => norm(u.email) === norm(email))
}

export function getUserByPhone(phone: string): Profile | undefined {
  const p = normPhone(phone)
  if (!p) return undefined
  return getUsers().find((u) => normPhone(u.phone) === p)
}

type CreateUserInput = {
  email: string
  name: string
  phone: string
  organization: string
  interests?: string[]
}

/** 신규 생성 (중복 검사는 호출부에서 수행). 관리자 이메일이면 role=admin */
export function createUser(input: CreateUserInput): Profile {
  const users = getUsers()
  const created: Profile = {
    id: uid(),
    role: norm(input.email) === norm(ADMIN_EMAIL) ? 'admin' : 'user',
    created_at: nowIso(),
    last_login_at: nowIso(),
    memo: '',
    ...input,
  }
  write(KEY.users, [...users, created])
  return created
}

export function updateUser(id: string, patch: Partial<Profile>): Profile | undefined {
  const users = getUsers()
  let updated: Profile | undefined
  write(
    KEY.users,
    users.map((u) => {
      if (u.id !== id) return u
      updated = { ...u, ...patch }
      return updated
    }),
  )
  return updated
}

export function touchLogin(id: string): void {
  updateUser(id, { last_login_at: nowIso() })
}

// ── 세션 (mock 로그인) ──────────────────────────────────────────────────────
export function getSessionUserId(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(KEY.session)
}

export function setSession(userId: string | null): void {
  if (typeof localStorage === 'undefined') return
  if (userId) localStorage.setItem(KEY.session, userId)
  else localStorage.removeItem(KEY.session)
}

// ── 도구 접근(tool_access) ──────────────────────────────────────────────────
export function getAccessByUser(userId: string): ToolAccess[] {
  return read<ToolAccess>(KEY.access).filter((a) => a.user_id === userId)
}

export function getAllAccess(): ToolAccess[] {
  return read<ToolAccess>(KEY.access)
}

function saveAccess(records: ToolAccess[]): void {
  write(KEY.access, records)
}

export function getAccessRecord(userId: string, toolId: string): ToolAccess | undefined {
  return read<ToolAccess>(KEY.access).find((a) => a.user_id === userId && a.tool_id === toolId)
}

function ensureAccess(userId: string, toolId: string): ToolAccess {
  const all = read<ToolAccess>(KEY.access)
  const found = all.find((a) => a.user_id === userId && a.tool_id === toolId)
  if (found) return found
  const created: ToolAccess = {
    id: uid(),
    user_id: userId,
    tool_id: toolId,
    access_status: 'none',
    trial_started_at: null,
    trial_expires_at: null,
    review_extension_used: false,
    survey_extension_used: false,
    paid_until: null,
    is_unlimited: false,
    granted_by_admin: false,
    memo: '',
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  saveAccess([...all, created])
  return created
}

function patchAccess(id: string, patch: Partial<ToolAccess>): ToolAccess | undefined {
  const all = read<ToolAccess>(KEY.access)
  let updated: ToolAccess | undefined
  saveAccess(
    all.map((a) => {
      if (a.id !== id) return a
      updated = { ...a, ...patch, updated_at: nowIso() }
      return updated
    }),
  )
  return updated
}

export function startTrial(userId: string, toolId: string): ToolAccess {
  const rec = ensureAccess(userId, toolId)
  if (rec.trial_started_at) return rec // 이미 시작됨 → 재시작 불가 (체험 우회 방지)
  const started = new Date()
  const expires = new Date(started.getTime() + TRIAL_DAYS * DAY_MS)
  return (
    patchAccess(rec.id, {
      access_status: 'trial_active',
      trial_started_at: started.toISOString(),
      trial_expires_at: expires.toISOString(),
    }) ?? rec
  )
}

// ── 평가 (파생 상태) ────────────────────────────────────────────────────────
export type AccessView = {
  status: AccessStatus
  statusLabel: string
  active: boolean
  unlimited: boolean
  paid: boolean
  blocked: boolean
  remainingDays: number
  /** 사람이 보기 좋은 남은 기간 (예: "6일", "23시간", "15분", "체험 종료", "무제한") */
  remainingLabel: string
  expiresAt: string | null
  canStart: boolean
  canExtendReview: boolean
  canExtendSurvey: boolean
}

export function evaluateAccess(rec: ToolAccess | undefined): AccessView {
  if (!rec) {
    return {
      status: 'none',
      statusLabel: accessStatusLabel.none,
      active: false,
      unlimited: false,
      paid: false,
      blocked: false,
      remainingDays: 0,
      remainingLabel: '미시작',
      expiresAt: null,
      canStart: true,
      canExtendReview: false,
      canExtendSurvey: false,
    }
  }

  const now = Date.now()
  const active = canUseTool(rec, now)
  const paid = !!rec.paid_until && new Date(rec.paid_until).getTime() > now
  const blocked = rec.access_status === 'revoked'

  let status: AccessStatus
  if (rec.is_unlimited) status = 'unlimited'
  else if (blocked) status = 'revoked'
  else if (paid) status = 'paid_active'
  else if (!rec.trial_started_at) status = 'none'
  else if (isTrialExpired(rec, now)) status = 'trial_expired'
  else if (rec.access_status === 'extended_by_review' || rec.access_status === 'extended_by_survey')
    status = rec.access_status
  else status = 'trial_active'

  const expMs = paid ? new Date(rec.paid_until!).getTime() : effectiveExpiryMs(rec)
  const remainingDays = rec.is_unlimited
    ? Infinity
    : paid
      ? Math.max(0, Math.ceil((new Date(rec.paid_until!).getTime() - now) / DAY_MS))
      : calculateTrialDaysLeft(rec, now)

  const remainingLabel = rec.is_unlimited
    ? '무제한'
    : status === 'none'
      ? '미시작'
      : blocked
        ? '권한 회수'
        : formatRemaining(expMs, now)

  return {
    status,
    statusLabel: accessStatusLabel[status],
    active,
    unlimited: rec.is_unlimited,
    paid,
    blocked,
    remainingDays,
    remainingLabel,
    expiresAt: rec.is_unlimited ? null : expMs ? new Date(expMs).toISOString() : null,
    canStart: status === 'none',
    canExtendReview: canExtendByReview(rec),
    canExtendSurvey: canExtendBySurvey(rec),
  }
}

// ── 리뷰 / 설문 연장 ────────────────────────────────────────────────────────
export type SubmitResult = { ok: boolean; message: string }

export function submitReview(userId: string, toolId: string, content: string): SubmitResult {
  const charCount = content.trim().length
  const rec = ensureAccess(userId, toolId)
  const meets = charCount >= REVIEW_MIN_CHARS
  const review: Review = {
    id: uid(),
    user_id: userId,
    tool_id: toolId,
    content: content.trim(),
    char_count: charCount,
    status: meets ? 'approved' : 'rejected', // mock: 500자 이상 자동 승인
    created_at: nowIso(),
  }
  write(KEY.reviews, [...read<Review>(KEY.reviews), review])

  if (!meets) {
    return { ok: false, message: `리뷰는 ${REVIEW_MIN_CHARS}자 이상이어야 연장됩니다. (현재 ${charCount}자)` }
  }
  if (!canExtendByReview(rec)) {
    return { ok: false, message: '리뷰 연장은 1회만 가능합니다. (이미 사용/무제한)' }
  }
  patchAccess(rec.id, applyReviewExtension(rec))
  return { ok: true, message: `리뷰가 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` }
}

export function submitSurvey(userId: string, toolId: string, answers: Record<string, string>): SubmitResult {
  const rec = ensureAccess(userId, toolId)
  const survey: Survey = {
    id: uid(),
    user_id: userId,
    tool_id: toolId,
    answers,
    created_at: nowIso(),
  }
  write(KEY.surveys, [...read<Survey>(KEY.surveys), survey])

  if (!canExtendBySurvey(rec)) {
    return { ok: false, message: '설문 연장은 1회만 가능합니다. (이미 사용/무제한)' }
  }
  patchAccess(rec.id, applySurveyExtension(rec))
  return { ok: true, message: `설문이 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다. (최대 ${MAX_FREE_DAYS}일)` }
}

export function getReviews(): Review[] {
  return read<Review>(KEY.reviews)
}
export function getSurveys(): Survey[] {
  return read<Survey>(KEY.surveys)
}
export function getReviewsByUser(userId: string): Review[] {
  return getReviews().filter((r) => r.user_id === userId)
}
export function getSurveysByUser(userId: string): Survey[] {
  return getSurveys().filter((s) => s.user_id === userId)
}
export function setReviewStatus(reviewId: string, status: ReviewStatus): void {
  write(
    KEY.reviews,
    getReviews().map((r) => (r.id === reviewId ? { ...r, status } : r)),
  )
}

// ── 관리자 액션 (사용자+도구 단위, 레코드 없으면 생성) ──────────────────────
export function adminGrantTrial(userId: string, toolId: string): ToolAccess {
  const rec = ensureAccess(userId, toolId)
  const started = new Date()
  return (
    patchAccess(rec.id, {
      access_status: 'trial_active',
      trial_started_at: rec.trial_started_at ?? started.toISOString(),
      trial_expires_at: new Date(started.getTime() + TRIAL_DAYS * DAY_MS).toISOString(),
      granted_by_admin: true,
    }) ?? rec
  )
}

export function adminExtendUser(userId: string, toolId: string, days: number): ToolAccess | undefined {
  const rec = ensureAccess(userId, toolId)
  const base = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : Date.now()
  return patchAccess(rec.id, {
    trial_expires_at: new Date(base + days * DAY_MS).toISOString(),
    access_status: rec.is_unlimited ? rec.access_status : 'trial_active',
    granted_by_admin: true,
  })
}

export function adminExpiryUser(userId: string, toolId: string, isoDate: string): ToolAccess | undefined {
  const rec = ensureAccess(userId, toolId)
  return patchAccess(rec.id, {
    trial_started_at: rec.trial_started_at ?? new Date().toISOString(),
    trial_expires_at: new Date(isoDate).toISOString(),
    access_status: 'trial_active',
    granted_by_admin: true,
  })
}

export function adminUnlimitedUser(userId: string, toolId: string): ToolAccess | undefined {
  return patchAccess(ensureAccess(userId, toolId).id, {
    is_unlimited: true,
    access_status: 'unlimited',
    granted_by_admin: true,
  })
}

/** 도구별 접근 차단 (권한 회수) */
export function adminRevokeUser(userId: string, toolId: string): ToolAccess | undefined {
  return patchAccess(ensureAccess(userId, toolId).id, { is_unlimited: false, access_status: 'revoked' })
}

/** 도구별 접근 허용 (회수 해제 → 7일 체험 부여) */
export function adminAllowUser(userId: string, toolId: string): ToolAccess | undefined {
  return adminGrantTrial(userId, toolId)
}

/** 결제 상태 수동 처리 (mock) */
export function adminSetPaid(userId: string, toolId: string, days = 30): ToolAccess | undefined {
  return patchAccess(ensureAccess(userId, toolId).id, {
    paid_until: new Date(Date.now() + days * DAY_MS).toISOString(),
    access_status: 'paid_active',
    granted_by_admin: true,
  })
}
export function adminClearPaid(userId: string, toolId: string): ToolAccess | undefined {
  const rec = ensureAccess(userId, toolId)
  return patchAccess(rec.id, {
    paid_until: null,
    access_status: rec.trial_started_at ? 'trial_active' : 'none',
  })
}

export function adminSaveMemo(userId: string, memo: string): void {
  updateUser(userId, { memo })
}

// ── 체험 가능한 도구(모듈) 목록 ─────────────────────────────────────────────
export type TrialModule = {
  id: string
  title: string
  category: string
  accessType: AccessType
}

export function getTrialModules(): TrialModule[] {
  return toolCatalog
    .filter((t) => t.isTrialAvailable)
    .map((t) => ({ id: t.id, title: t.title, category: t.category, accessType: t.accessType }))
}

export function getToolTitle(toolId: string): string {
  return toolCatalog.find((t) => t.id === toolId)?.title ?? toolId
}

// ── 포맷 헬퍼 ───────────────────────────────────────────────────────────────
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/** 정확한 만료 "시각"까지 표시 (예: 2026. 07. 02. 14:37) */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
