// ───────────────────────────────────────────────────────────────────────────
// 무료 체험(trial) 계산 — 순수 함수 (localStorage/DB 의존 없음)
//
// ⚠️ 보안 주의: 이 계산은 "표시/판정용"입니다. 클라이언트에서 실행되므로
// 위변조가 가능합니다. 실제 권한 차단은 서버(Supabase RLS / Edge Function)에서
// 동일 로직으로 다시 검증해야 합니다. (ACCESS_CONTROL_PLAN.md 참고)
// ───────────────────────────────────────────────────────────────────────────
import type { ToolAccess } from '../lib/platform'
import { EXTENSION_DAYS, MAX_FREE_DAYS, REVIEW_MIN_CHARS, TRIAL_DAYS } from '../lib/trial-policy'

export { TRIAL_DAYS, EXTENSION_DAYS, MAX_FREE_DAYS, REVIEW_MIN_CHARS }

const DAY_MS = 24 * 60 * 60 * 1000

/** 무료 체험으로 허용되는 총 일수 (기본 + 리뷰/설문 연장), 최대 21일로 고정 */
export function trialAllowedDays(a: ToolAccess): number {
  const days =
    TRIAL_DAYS +
    (a.review_extension_used ? EXTENSION_DAYS : 0) +
    (a.survey_extension_used ? EXTENSION_DAYS : 0)
  return Math.min(MAX_FREE_DAYS, days)
}

/** 체험 시작일 + 허용 일수로 계산한 만료 시각(ms). 미시작이면 null */
function formulaExpiryMs(a: ToolAccess): number | null {
  if (!a.trial_started_at) return null
  return new Date(a.trial_started_at).getTime() + trialAllowedDays(a) * DAY_MS
}

/**
 * 적용할 만료 시각(ms). 관리자가 수동 지정한 trial_expires_at 이 공식보다 늦으면
 * (수동 연장) 그 값을 사용하고, 아니면 공식값을 사용한다. → 21일 캡은 공식으로 보장.
 */
export function effectiveExpiryMs(a: ToolAccess): number | null {
  const formula = formulaExpiryMs(a)
  const manual = a.trial_expires_at ? new Date(a.trial_expires_at).getTime() : null
  if (formula == null) return manual
  if (manual == null) return formula
  return Math.max(formula, manual)
}

export function calculateTrialDaysLeft(a: ToolAccess, now = Date.now()): number {
  const exp = effectiveExpiryMs(a)
  if (exp == null) return 0
  return Math.max(0, Math.ceil((exp - now) / DAY_MS))
}

export function isTrialExpired(a: ToolAccess, now = Date.now()): boolean {
  if (a.is_unlimited) return false
  const exp = effectiveExpiryMs(a)
  if (exp == null) return true // 미시작 = 사용 불가(만료로 간주)
  return exp <= now
}

/** 실제 사용 가능 여부 (무제한 / 결제중 / 회수 / 체험 만료 반영) */
export function canUseTool(a: ToolAccess, now = Date.now()): boolean {
  if (a.is_unlimited) return true
  if (a.access_status === 'revoked') return false
  if (a.paid_until && new Date(a.paid_until).getTime() > now) return true
  if (!a.trial_started_at) return false
  return !isTrialExpired(a, now)
}

export function canExtendByReview(a: ToolAccess): boolean {
  return !!a.trial_started_at && !a.is_unlimited && !a.review_extension_used
}

export function canExtendBySurvey(a: ToolAccess): boolean {
  return !!a.trial_started_at && !a.is_unlimited && !a.survey_extension_used
}

/** 리뷰 연장 적용 패치 (만료일을 시작일 기준으로 재계산 → 21일 초과 불가) */
export function applyReviewExtension(a: ToolAccess): Partial<ToolAccess> {
  const next: ToolAccess = { ...a, review_extension_used: true }
  const exp = formulaExpiryMs(next)
  return {
    review_extension_used: true,
    trial_expires_at: exp ? new Date(exp).toISOString() : a.trial_expires_at,
    access_status: 'extended_by_review',
  }
}

/** 설문 연장 적용 패치 (만료일을 시작일 기준으로 재계산 → 21일 초과 불가) */
export function applySurveyExtension(a: ToolAccess): Partial<ToolAccess> {
  const next: ToolAccess = { ...a, survey_extension_used: true }
  const exp = formulaExpiryMs(next)
  return {
    survey_extension_used: true,
    trial_expires_at: exp ? new Date(exp).toISOString() : a.trial_expires_at,
    access_status: 'extended_by_survey',
  }
}
