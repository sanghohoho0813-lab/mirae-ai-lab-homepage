// 서버리스(api) 전용 체험 정책 상수/계산 — src/ 를 import 하지 않도록 자체 포함.
// (클라이언트는 src/lib/trial-policy.ts 를 사용. 값은 동일하게 유지하세요.)
export const TRIAL_DAYS = 7
export const EXTENSION_DAYS = 7
export const MAX_FREE_DAYS = 21
export const REVIEW_MIN_CHARS = 500

const DAY = 86400000

export function computeTrialExpiry(startedAtIso: string, reviewUsed: boolean, surveyUsed: boolean): string {
  const days = Math.min(
    MAX_FREE_DAYS,
    TRIAL_DAYS + (reviewUsed ? EXTENSION_DAYS : 0) + (surveyUsed ? EXTENSION_DAYS : 0),
  )
  return new Date(new Date(startedAtIso).getTime() + days * DAY).toISOString()
}
