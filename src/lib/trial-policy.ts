// 무료 체험 정책 상수 + 순수 계산. (의존성 없음 → 클라이언트/서버리스 공용)
export const TRIAL_DAYS = 7
export const EXTENSION_DAYS = 7
export const MAX_FREE_DAYS = 21 // 기본 7 + 리뷰 7 + 설문 7
export const REVIEW_MIN_CHARS = 500

const DAY_MS = 24 * 60 * 60 * 1000

/** 허용 총 일수 (기본 + 리뷰/설문 연장), 최대 21일로 고정 */
export function trialAllowedDays(reviewUsed: boolean, surveyUsed: boolean): number {
  return Math.min(
    MAX_FREE_DAYS,
    TRIAL_DAYS + (reviewUsed ? EXTENSION_DAYS : 0) + (surveyUsed ? EXTENSION_DAYS : 0),
  )
}

/** 체험 시작일 + 허용 일수로 만료 시각(ISO) 계산. (서버에서 권위 있는 만료일 산정) */
export function computeTrialExpiry(startedAtIso: string, reviewUsed: boolean, surveyUsed: boolean): string {
  const start = new Date(startedAtIso).getTime()
  return new Date(start + trialAllowedDays(reviewUsed, surveyUsed) * DAY_MS).toISOString()
}
