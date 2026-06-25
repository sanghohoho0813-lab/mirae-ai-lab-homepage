// ───────────────────────────────────────────────────────────────────────────
// 미래 AI 랩 — 플랫폼 mock 레이어 (localStorage 기반)
//
// ⚠️ 1단계(현재): localStorage mock. 실제 인증/DB 없음.
// 다음 단계에서 이 모듈의 함수 본문만 Supabase 호출로 교체하면 됩니다.
// 타입/테이블 구조는 Supabase 스키마를 그대로 따릅니다.
// ───────────────────────────────────────────────────────────────────────────
import { tools as toolCatalog, type AccessType } from '../data/tools'

export type { AccessType }

export const ADMIN_EMAIL = 'sanghohoho0813@gmail.com'

// 무료 체험 정책
export const TRIAL_DAYS = 7
export const EXTENSION_DAYS = 7
export const MAX_FREE_DAYS = 21 // 기본 7 + 리뷰 7 + 설문 7
export const REVIEW_MIN_CHARS = 500

const DAY_MS = 24 * 60 * 60 * 1000

// ── 타입 (Supabase 테이블과 1:1) ────────────────────────────────────────────
export type Role = 'user' | 'admin'

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
  interests?: string[]
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

// ── 사용자(profiles) ────────────────────────────────────────────────────────
export function getUsers(): Profile[] {
  return read<Profile>(KEY.users)
}

export function getUserById(id: string): Profile | undefined {
  return getUsers().find((u) => u.id === id)
}

export function getUserByEmail(email: string): Profile | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function upsertUser(input: Omit<Profile, 'id' | 'role' | 'created_at'> & Partial<Pick<Profile, 'role'>>): Profile {
  const users = getUsers()
  const existing = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
  const role: Role = input.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : input.role ?? 'user'
  if (existing) {
    const updated: Profile = { ...existing, ...input, role }
    write(KEY.users, users.map((u) => (u.id === existing.id ? updated : u)))
    return updated
  }
  const created: Profile = { id: uid(), role, created_at: nowIso(), ...input }
  write(KEY.users, [...users, created])
  return created
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
  const next = all.map((a) => {
    if (a.id !== id) return a
    updated = { ...a, ...patch, updated_at: nowIso() }
    return updated
  })
  saveAccess(next)
  return updated
}

export function startTrial(userId: string, toolId: string): ToolAccess {
  const rec = ensureAccess(userId, toolId)
  if (rec.trial_started_at) return rec // 이미 시작됨
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
  remainingDays: number
  expiresAt: string | null
  canStart: boolean
  canExtendReview: boolean
  canExtendSurvey: boolean
}

export function evaluateAccess(rec: ToolAccess | undefined): AccessView {
  if (!rec || (!rec.trial_started_at && !rec.is_unlimited && rec.access_status === 'none')) {
    return {
      status: 'none',
      statusLabel: accessStatusLabel.none,
      active: false,
      unlimited: false,
      remainingDays: 0,
      expiresAt: null,
      canStart: true,
      canExtendReview: false,
      canExtendSurvey: false,
    }
  }
  const now = Date.now()

  if (rec.is_unlimited) {
    return {
      status: 'unlimited',
      statusLabel: accessStatusLabel.unlimited,
      active: true,
      unlimited: true,
      remainingDays: Infinity,
      expiresAt: null,
      canStart: false,
      canExtendReview: false,
      canExtendSurvey: false,
    }
  }
  if (rec.access_status === 'revoked') {
    return {
      status: 'revoked',
      statusLabel: accessStatusLabel.revoked,
      active: false,
      unlimited: false,
      remainingDays: 0,
      expiresAt: rec.trial_expires_at,
      canStart: false,
      canExtendReview: false,
      canExtendSurvey: false,
    }
  }
  if (rec.paid_until && new Date(rec.paid_until).getTime() > now) {
    return {
      status: 'paid_active',
      statusLabel: accessStatusLabel.paid_active,
      active: true,
      unlimited: false,
      remainingDays: Math.ceil((new Date(rec.paid_until).getTime() - now) / DAY_MS),
      expiresAt: rec.paid_until,
      canStart: false,
      canExtendReview: false,
      canExtendSurvey: false,
    }
  }

  const expMs = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : 0
  const remainingMs = expMs - now
  const expired = remainingMs <= 0

  return {
    status: expired ? 'trial_expired' : rec.access_status === 'none' ? 'trial_active' : rec.access_status,
    statusLabel: expired ? accessStatusLabel.trial_expired : accessStatusLabel[rec.access_status],
    active: !expired,
    unlimited: false,
    remainingDays: expired ? 0 : Math.ceil(remainingMs / DAY_MS),
    expiresAt: rec.trial_expires_at,
    canStart: false,
    canExtendReview: !rec.review_extension_used,
    canExtendSurvey: !rec.survey_extension_used,
  }
}

function extend(rec: ToolAccess, kind: 'review' | 'survey'): ToolAccess {
  const base = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : Date.now()
  const next = new Date(base + EXTENSION_DAYS * DAY_MS).toISOString()
  return (
    patchAccess(rec.id, {
      trial_expires_at: next,
      access_status: kind === 'review' ? 'extended_by_review' : 'extended_by_survey',
      review_extension_used: kind === 'review' ? true : rec.review_extension_used,
      survey_extension_used: kind === 'survey' ? true : rec.survey_extension_used,
    }) ?? rec
  )
}

// ── 리뷰 / 설문 연장 ────────────────────────────────────────────────────────
export type SubmitResult = { ok: boolean; message: string }

export function submitReview(userId: string, toolId: string, content: string): SubmitResult {
  const charCount = content.trim().length
  const rec = ensureAccess(userId, toolId)
  const review: Review = {
    id: uid(),
    user_id: userId,
    tool_id: toolId,
    content: content.trim(),
    char_count: charCount,
    status: charCount >= REVIEW_MIN_CHARS ? 'approved' : 'pending', // mock: 자동 승인
    created_at: nowIso(),
  }
  write(KEY.reviews, [...read<Review>(KEY.reviews), review])

  if (charCount < REVIEW_MIN_CHARS) {
    return { ok: false, message: `리뷰는 ${REVIEW_MIN_CHARS}자 이상이어야 연장됩니다. (현재 ${charCount}자)` }
  }
  if (rec.review_extension_used) {
    return { ok: false, message: '리뷰 연장은 이미 사용했습니다.' }
  }
  extend(rec, 'review')
  return { ok: true, message: `리뷰가 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다.` }
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

  if (rec.survey_extension_used) {
    return { ok: false, message: '설문 연장은 이미 사용했습니다.' }
  }
  extend(rec, 'survey')
  return { ok: true, message: `설문이 접수되어 체험이 ${EXTENSION_DAYS}일 연장되었습니다.` }
}

export function getReviews(): Review[] {
  return read<Review>(KEY.reviews)
}

export function getSurveys(): Survey[] {
  return read<Survey>(KEY.surveys)
}

// ── 관리자 액션 ─────────────────────────────────────────────────────────────
export function adminExtendDays(accessId: string, days: number): ToolAccess | undefined {
  const all = read<ToolAccess>(KEY.access)
  const rec = all.find((a) => a.id === accessId)
  if (!rec) return undefined
  const base = rec.trial_expires_at ? new Date(rec.trial_expires_at).getTime() : Date.now()
  return patchAccess(accessId, {
    trial_expires_at: new Date(base + days * DAY_MS).toISOString(),
    access_status: 'trial_active',
    granted_by_admin: true,
  })
}

export function adminSetExpiry(accessId: string, isoDate: string): ToolAccess | undefined {
  return patchAccess(accessId, {
    trial_expires_at: new Date(isoDate).toISOString(),
    access_status: 'trial_active',
    granted_by_admin: true,
  })
}

export function adminSetUnlimited(accessId: string): ToolAccess | undefined {
  return patchAccess(accessId, { is_unlimited: true, access_status: 'unlimited', granted_by_admin: true })
}

export function adminRevoke(accessId: string): ToolAccess | undefined {
  return patchAccess(accessId, { is_unlimited: false, access_status: 'revoked' })
}

export function adminGrantTrial(userId: string, toolId: string): ToolAccess {
  const rec = ensureAccess(userId, toolId)
  const started = new Date()
  const expires = new Date(started.getTime() + TRIAL_DAYS * DAY_MS)
  return (
    patchAccess(rec.id, {
      access_status: 'trial_active',
      trial_started_at: started.toISOString(),
      trial_expires_at: expires.toISOString(),
      granted_by_admin: true,
    }) ?? rec
  )
}

// 사용자+도구 단위 관리자 액션 (레코드 없으면 생성 후 적용)
export function adminExtendUser(userId: string, toolId: string, days: number) {
  return adminExtendDays(ensureAccess(userId, toolId).id, days)
}
export function adminUnlimitedUser(userId: string, toolId: string) {
  return adminSetUnlimited(ensureAccess(userId, toolId).id)
}
export function adminRevokeUser(userId: string, toolId: string) {
  return adminRevoke(ensureAccess(userId, toolId).id)
}
export function adminExpiryUser(userId: string, toolId: string, isoDate: string) {
  return adminSetExpiry(ensureAccess(userId, toolId).id, isoDate)
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
export function formatDate(iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
