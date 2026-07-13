// 구독기간·일할계산 순수 함수 모듈 — DB·네트워크 의존 없음 (그대로 단위테스트 가능).
// 원칙:
//  - 모든 계산은 UTC 기준 (화면 표시는 프론트에서 Asia/Seoul 변환)
//  - 결제주기는 30일 고정이 아니라 calendar month 기준
//  - anchor day(가입일의 일자, 1~31)는 짧은 달에서 말일로 클램프되고, 긴 달에서 원래 일자로 복귀
//  - 금액은 millisecond 비율로 계산 후 rounding 정책(floor/round/ceil)으로 원 단위 정수화
//  - 환불금액은 실제 결제 순액과 남은 미취소 금액을 초과할 수 없음, 음수 금지
export type RoundingRule = 'floor' | 'round' | 'ceil'

export type ProrationResult = {
  originalAmount: number
  usedRatio: number
  remainingRatio: number
  rawAmount: number
  roundedAmount: number
  calculationFrom: string
  calculationTo: string
  totalPeriodSeconds: number
  remainingSeconds: number
  roundingRule: RoundingRule
  explanation: string
}

const MS = 1000

function toDate(d: Date | string): Date {
  const out = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(out.getTime())) throw new Error(`invalid date: ${String(d)}`)
  return out
}

export function applyRoundingRule(n: number, rule: RoundingRule): number {
  if (!Number.isFinite(n)) throw new Error('invalid amount')
  switch (rule) {
    case 'floor': return Math.floor(n)
    case 'ceil': return Math.ceil(n)
    case 'round': return Math.round(n)
  }
}

/** 해당 (UTC) 연·월의 말일 (monthIndex 0-based, 12 이상/음수 자동 이월) */
export function daysInMonthUTC(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
}

/**
 * calendar month +1 — anchor day 를 유지하되 짧은 달은 말일로 클램프.
 * 시각(시·분·초·ms)은 from 의 UTC 시각을 그대로 유지합니다.
 * 예) anchor 31: 1/31 → 2/28(29) → (다시 anchor 31 로) 3/31
 */
export function addCalendarMonthClamped(from: Date | string, anchorDay: number): Date {
  if (!Number.isInteger(anchorDay) || anchorDay < 1 || anchorDay > 31) throw new Error('anchorDay must be 1..31')
  const d = toDate(from)
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1 // 다음 달 (Date.UTC 가 연도 이월 처리)
  const day = Math.min(anchorDay, daysInMonthUTC(y, m))
  return new Date(Date.UTC(y, m, day, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()))
}

/**
 * 첫 결제(또는 갱신) 시점 기준 결제기간 계산.
 * anchorDay 를 지정하지 않으면 시작일의 (UTC) 일자를 anchor 로 사용.
 */
export function calculateBillingPeriod(
  periodStart: Date | string,
  anchorDay?: number,
): { periodStart: Date; periodEnd: Date; anchorDay: number } {
  const start = toDate(periodStart)
  const anchor = anchorDay ?? start.getUTCDate()
  const end = addCalendarMonthClamped(start, anchor)
  if (end.getTime() <= start.getTime()) throw new Error('invalid billing period')
  return { periodStart: start, periodEnd: end, anchorDay: anchor }
}

/** 다음 결제일 = 현재 기간 종료시각 기준 anchor 유지 +1 calendar month 의 시작점(= 현재 periodEnd) */
export function calculateNextBillingDate(currentPeriodEnd: Date | string, anchorDay: number): Date {
  return addCalendarMonthClamped(currentPeriodEnd, anchorDay)
}

/** 남은 기간 비율 (0~1, ms 기준). at 이 기간 밖이면 0 또는 1 로 클램프. */
export function calculateRemainingRatio(periodStart: Date | string, periodEnd: Date | string, at: Date | string): number {
  const start = toDate(periodStart).getTime()
  const end = toDate(periodEnd).getTime()
  const t = toDate(at).getTime()
  if (end <= start) throw new Error('periodEnd must be after periodStart')
  const remaining = Math.min(Math.max(end - t, 0), end - start)
  return remaining / (end - start)
}

function baseResult(
  originalAmount: number,
  periodStart: Date,
  periodEnd: Date,
  at: Date,
  rounding: RoundingRule,
): Omit<ProrationResult, 'rawAmount' | 'roundedAmount' | 'explanation'> {
  const remainingRatio = calculateRemainingRatio(periodStart, periodEnd, at)
  return {
    originalAmount,
    usedRatio: 1 - remainingRatio,
    remainingRatio,
    calculationFrom: at.toISOString(),
    calculationTo: periodEnd.toISOString(),
    totalPeriodSeconds: Math.round((periodEnd.getTime() - periodStart.getTime()) / MS),
    remainingSeconds: Math.round(Math.min(Math.max(periodEnd.getTime() - at.getTime(), 0), periodEnd.getTime() - periodStart.getTime()) / MS),
    roundingRule: rounding,
  }
}

/**
 * 모듈 중간 추가 시 즉시 청구액 — 남은 실제 기간 비율 × 월 단가.
 * - 기간 시작 전 추가는 이상 데이터 → Error
 * - 기간 종료 이후 추가는 0원 (호출측이 차단·다음 주기 편입 처리)
 * - 최소 청구금액 미만이면 minimumChargeBehavior 에 따라 0원 또는 최소금액
 */
export function calculateProratedCharge(input: {
  periodStart: Date | string
  periodEnd: Date | string
  addAt: Date | string
  monthlyAmount: number
  rounding?: RoundingRule
  minimumChargeAmount?: number
  minimumChargeBehavior?: 'zero' | 'minimum'
}): ProrationResult {
  const periodStart = toDate(input.periodStart)
  const periodEnd = toDate(input.periodEnd)
  const addAt = toDate(input.addAt)
  const rounding = input.rounding ?? 'floor'
  if (!Number.isInteger(input.monthlyAmount) || input.monthlyAmount < 0) throw new Error('monthlyAmount must be a non-negative integer')
  if (addAt.getTime() < periodStart.getTime()) throw new Error('addAt is before period start')

  const base = baseResult(input.monthlyAmount, periodStart, periodEnd, addAt, rounding)

  if (addAt.getTime() >= periodEnd.getTime()) {
    return { ...base, rawAmount: 0, roundedAmount: 0, explanation: '기간 종료 이후 추가 — 이번 기간 청구 없음 (다음 주기부터 반영)' }
  }

  const raw = input.monthlyAmount * base.remainingRatio
  let rounded = Math.max(0, applyRoundingRule(raw, rounding))
  let explanation = `월 ${input.monthlyAmount}원 × 남은기간 ${(base.remainingRatio * 100).toFixed(4)}% = ${raw.toFixed(4)} → ${rounding} ${rounded}원`

  const minCharge = input.minimumChargeAmount ?? 0
  if (minCharge > 0 && rounded > 0 && rounded < minCharge) {
    if ((input.minimumChargeBehavior ?? 'zero') === 'minimum') {
      rounded = minCharge
      explanation += ` (최소 청구금액 ${minCharge}원 적용)`
    } else {
      rounded = 0
      explanation += ` (최소 청구금액 ${minCharge}원 미만 — 0원 처리)`
    }
  }
  return { ...base, rawAmount: raw, roundedAmount: rounded, explanation }
}

/**
 * 즉시 해지/모듈 즉시 제거 시 일할 환불액 — 실제 결제 순액 × 남은 기간 비율.
 * - paidNetAmount: 할인·쿠폰 반영된 실제 결제 순액
 * - alreadyCancelledAmount: 과거 부분취소 누계 (환불 가능 잔액 상한에 반영)
 * - 기간 종료 후 해지는 0원, 원 결제액(잔액) 초과 금지, 음수 금지
 */
export function calculateProratedRefund(input: {
  periodStart: Date | string
  periodEnd: Date | string
  cancelAt: Date | string
  paidNetAmount: number
  alreadyCancelledAmount?: number
  rounding?: RoundingRule
}): ProrationResult {
  const periodStart = toDate(input.periodStart)
  const periodEnd = toDate(input.periodEnd)
  const cancelAt = toDate(input.cancelAt)
  const rounding = input.rounding ?? 'floor'
  if (!Number.isInteger(input.paidNetAmount) || input.paidNetAmount < 0) throw new Error('paidNetAmount must be a non-negative integer')
  const alreadyCancelled = input.alreadyCancelledAmount ?? 0
  if (!Number.isInteger(alreadyCancelled) || alreadyCancelled < 0) throw new Error('alreadyCancelledAmount must be a non-negative integer')
  if (cancelAt.getTime() < periodStart.getTime()) throw new Error('cancelAt is before period start')

  const base = baseResult(input.paidNetAmount, periodStart, periodEnd, cancelAt, rounding)
  const refundable = Math.max(0, input.paidNetAmount - alreadyCancelled)

  if (cancelAt.getTime() >= periodEnd.getTime()) {
    return { ...base, rawAmount: 0, roundedAmount: 0, explanation: '기간 종료 이후 해지 — 환불 0원' }
  }

  const raw = input.paidNetAmount * base.remainingRatio
  const rounded = Math.min(Math.max(0, applyRoundingRule(raw, rounding)), refundable)
  const explanation =
    `결제 순액 ${input.paidNetAmount}원 × 남은기간 ${(base.remainingRatio * 100).toFixed(4)}% = ${raw.toFixed(4)} → ${rounding} ` +
    `${applyRoundingRule(raw, rounding)}원, 환불가능 잔액 ${refundable}원 한도 적용 → ${rounded}원`
  return { ...base, rawAmount: raw, roundedAmount: rounded, explanation }
}
