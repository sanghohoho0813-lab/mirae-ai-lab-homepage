// 대표자 일회성 상품 환불 가능성 판정 — 순수 함수 (PortOne 취소 API 호출 없음).
// 정책은 billing_product_policies(DB)에서 로드하고, 미설정 상품은 기본 정책을 사용합니다.
// ⚠️ 여기서의 판정은 '요청 접수·검토 기준'이며, 실제 환불 실행은 관리자 승인 후 별도 작업에서 처리합니다.

export type OneTimeRefundPolicy = {
  fullRefundBeforeServiceStart: boolean
  cancellationWindowDays: number | null
  refundAfterServiceStart: 'none' | 'manual_review' | 'prorated' | 'custom'
  partialRefundAllowed: boolean
  adminApprovalRequired: boolean
  policyVersion: string
}

export type RefundEligibility = 'full' | 'partial_review' | 'none' | 'manual_review'

export type RefundEligibilityResult = {
  eligibility: RefundEligibility
  maximumRefundAmount: number
  requiresAdminApproval: boolean
  reason: string
  policyVersion: string
}

/** 기본 정책 — billing_product_policies 미시드 상품용 (SQL 시드 기본값과 동일하게 유지) */
export const DEFAULT_ONE_TIME_POLICY: OneTimeRefundPolicy = {
  fullRefundBeforeServiceStart: true,
  cancellationWindowDays: null,
  refundAfterServiceStart: 'manual_review',
  partialRefundAllowed: true,
  adminApprovalRequired: true,
  policyVersion: 'v1-default',
}

function toTime(d: Date | string): number {
  const t = (d instanceof Date ? d : new Date(d)).getTime()
  if (Number.isNaN(t)) throw new Error(`invalid date: ${String(d)}`)
  return t
}

export function evaluateOneTimeRefundEligibility(input: {
  paidAt: Date | string
  now: Date | string
  serviceStartedAt: Date | string | null
  policy: OneTimeRefundPolicy
  paidAmount: number
  cancelledAmount?: number
}): RefundEligibilityResult {
  const { policy } = input
  if (!Number.isInteger(input.paidAmount) || input.paidAmount < 0) throw new Error('paidAmount must be a non-negative integer')
  const cancelled = input.cancelledAmount ?? 0
  if (!Number.isInteger(cancelled) || cancelled < 0) throw new Error('cancelledAmount must be a non-negative integer')

  const paidAt = toTime(input.paidAt)
  const now = toTime(input.now)
  const remaining = Math.max(0, input.paidAmount - cancelled)

  if (remaining <= 0) {
    return {
      eligibility: 'none',
      maximumRefundAmount: 0,
      requiresAdminApproval: false,
      reason: '이미 전액 취소된 결제입니다.',
      policyVersion: policy.policyVersion,
    }
  }

  const serviceStarted = input.serviceStartedAt !== null && toTime(input.serviceStartedAt) <= now

  // ── 서비스 시작 전 ──
  if (!serviceStarted) {
    if (policy.cancellationWindowDays !== null) {
      const windowMs = policy.cancellationWindowDays * 24 * 60 * 60 * 1000
      if (now > paidAt + windowMs) {
        return {
          eligibility: 'manual_review',
          maximumRefundAmount: policy.partialRefundAllowed ? remaining : 0,
          requiresAdminApproval: true,
          reason: `취소 가능 기간(${policy.cancellationWindowDays}일)이 지나 관리자 검토가 필요합니다.`,
          policyVersion: policy.policyVersion,
        }
      }
    }
    if (policy.fullRefundBeforeServiceStart) {
      return {
        eligibility: 'full',
        maximumRefundAmount: remaining,
        requiresAdminApproval: policy.adminApprovalRequired,
        reason: '서비스 시작 전이라 전액 환불 대상입니다.',
        policyVersion: policy.policyVersion,
      }
    }
    return {
      eligibility: 'manual_review',
      maximumRefundAmount: policy.partialRefundAllowed ? remaining : 0,
      requiresAdminApproval: true,
      reason: '이 상품은 시작 전에도 관리자 검토 후 환불이 결정됩니다.',
      policyVersion: policy.policyVersion,
    }
  }

  // ── 서비스 시작 후 ──
  switch (policy.refundAfterServiceStart) {
    case 'none':
      return {
        eligibility: 'none',
        maximumRefundAmount: 0,
        requiresAdminApproval: false,
        reason: '서비스가 시작되어 환불이 불가한 상품입니다.',
        policyVersion: policy.policyVersion,
      }
    case 'prorated':
      return {
        eligibility: 'partial_review',
        maximumRefundAmount: policy.partialRefundAllowed ? remaining : 0,
        requiresAdminApproval: true,
        reason: '서비스 진행 정도에 따라 부분 환불을 검토합니다 (관리자 확인 필요).',
        policyVersion: policy.policyVersion,
      }
    case 'manual_review':
    case 'custom':
    default:
      return {
        eligibility: 'manual_review',
        maximumRefundAmount: policy.partialRefundAllowed ? remaining : 0,
        requiresAdminApproval: true,
        reason: '서비스가 시작되어 관리자 검토 후 환불 여부와 금액이 결정됩니다.',
        policyVersion: policy.policyVersion,
      }
  }
}

/** DB(billing_product_policies) 행 → 정책 객체 (없으면 기본 정책) */
export function policyFromRow(row: Record<string, unknown> | null | undefined): OneTimeRefundPolicy {
  if (!row) return DEFAULT_ONE_TIME_POLICY
  return {
    fullRefundBeforeServiceStart: row.full_refund_before_service_start !== false,
    cancellationWindowDays:
      typeof row.cancellation_window_days === 'number' ? row.cancellation_window_days : null,
    refundAfterServiceStart: (['none', 'manual_review', 'prorated', 'custom'].includes(String(row.refund_after_service_start))
      ? String(row.refund_after_service_start)
      : 'manual_review') as OneTimeRefundPolicy['refundAfterServiceStart'],
    partialRefundAllowed: row.partial_refund_allowed !== false,
    adminApprovalRequired: row.admin_approval_required !== false,
    policyVersion: typeof row.policy_version === 'string' ? row.policy_version : 'v1',
  }
}
