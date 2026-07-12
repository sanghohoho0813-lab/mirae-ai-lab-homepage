// 결제 상태 동기화(reconcile) — complete API 와 webhook 이 같은 함수를 사용합니다.
// 원칙:
//  - 최종 신뢰는 PortOne 결제 단건조회 재조회 결과 (웹훅 body·브라우저 응답 불신)
//  - 금액·통화·storeId 불일치 → amount_mismatch + needs_review (service order 생성 금지)
//  - paid 는 어떤 순서로 호출돼도 1번만 확정, service_orders 는 payment_id unique 로 1건만 생성
//  - paid → cancelled / partial_cancelled 전이는 허용 (PortOne 콘솔 취소 동기화)
//  - paid 를 pending/failed 로 되돌리지 않음
import crypto from 'node:crypto'
import type { SupabaseAdmin } from './supabaseAdmin'
import { getPortOnePayment, mapPortOneStatus, type PortOnePayment } from './portone'

export const sha256 = (s: string) => crypto.createHash('sha256').update(s, 'utf8').digest('hex')

export const stripControl = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : ''

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.slice(0, 15)
}

export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 7) return d ? `${d.slice(0, 2)}***` : ''
  return `${d.slice(0, 3)}-${'*'.repeat(Math.max(2, d.length - 7))}-${d.slice(-4)}`
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email ? '***' : ''
  const head = local.slice(0, Math.min(2, local.length))
  return `${head}${'*'.repeat(Math.max(1, local.length - head.length))}@${domain}`
}

export function createPaymentId(): string {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `pay_${ymd}_${crypto.randomBytes(8).toString('hex')}` // 예: pay_20260712_a1b2c3d4e5f60718 (33자)
}

export function createOrderNumber(prefix: 'MO' | 'SO'): string {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = crypto.randomBytes(4).readUInt32BE(0).toString(36).toUpperCase().padStart(6, '0').slice(-6)
  return `${prefix}${ymd}-${rand}`
}

export function createAccessToken(): string {
  return crypto.randomBytes(24).toString('hex')
}

/** 사용자에게 보여줄 안전한 실패 메시지 (내부 코드 노출 금지) */
export function sanitizePaymentError(debugCode: string): string {
  switch (debugCode) {
    case 'amount_mismatch':
      return '결제정보 확인이 필요합니다. 추가 결제를 시도하지 말고 고객센터로 문의해주세요.'
    case 'payment_not_found':
      return '결제 내역을 찾을 수 없습니다. 결제가 진행되지 않았다면 다시 시도해주세요.'
    case 'portone_not_configured':
      return '결제 설정이 아직 완료되지 않았습니다.'
    default:
      return '결제 확인 중 문제가 발생했습니다. 중복 결제하지 말고 잠시 후 다시 확인해주세요.'
  }
}

export type PaymentRow = {
  id: string
  payment_id: string
  merchant_order_id: string
  environment: string
  product_slug: string
  option_id: string | null
  product_name: string
  option_name: string | null
  amount: number
  currency: string
  status: string
  portone_status: string | null
  payment_method: string | null
  receipt_url: string | null
  buyer_company_name: string
  buyer_name: string
  buyer_phone: string
  buyer_email: string
  access_token_hash: string | null
  paid_at: string | null
  cancelled_at: string | null
  cancel_amount: number
  failure_message: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export async function logPaymentEvent(
  admin: SupabaseAdmin,
  eventType: string,
  paymentId: string | null,
  source: 'client' | 'server' | 'webhook',
  payload?: Record<string, unknown>,
) {
  try {
    await admin.from('payment_events').insert({
      payment_id: paymentId ? paymentId.slice(0, 80) : null,
      event_type: eventType,
      source,
      payload: payload ?? null,
    })
  } catch {
    // 이벤트 기록 실패가 결제 처리를 막지 않음
  }
}

export type ReconcileResult =
  | { ok: true; row: PaymentRow; serviceOrderNumber: string | null }
  | { ok: false; status: number; debugCode: string; message: string; row?: PaymentRow }

/** 결제 1건을 PortOne 기준으로 동기화 */
export async function reconcilePayment(
  admin: SupabaseAdmin,
  paymentId: string,
  source: 'complete' | 'webhook' | 'status',
): Promise<ReconcileResult> {
  // 1) 내부 결제 레코드
  const { data: row, error } = await admin
    .from('product_payments')
    .select('*')
    .eq('payment_id', paymentId)
    .maybeSingle()
  if (error) return { ok: false, status: 500, debugCode: 'db_error', message: sanitizePaymentError('db_error') }
  if (!row) return { ok: false, status: 404, debugCode: 'order_not_found', message: '주문을 찾을 수 없습니다.' }
  const payment = row as PaymentRow

  // 이미 최종 확정(paid)이고 취소 동기화 요청이 아닌 경우에도
  // PortOne 재조회로 취소 여부를 확인한다 (콘솔 취소 동기화).

  // 2) PortOne 단건조회 (최종 신뢰 소스)
  const po = await getPortOnePayment(paymentId)
  if (!po.ok) {
    if (po.debugCode === 'payment_not_found') {
      // 결제창을 열지 않았거나 승인 시도가 없었던 경우 — pending 유지
      return { ok: false, status: 404, debugCode: 'payment_not_found', message: sanitizePaymentError('payment_not_found'), row: payment }
    }
    return { ok: false, status: po.status, debugCode: po.debugCode, message: sanitizePaymentError(po.debugCode), row: payment }
  }
  const p: PortOnePayment = po.payment

  // 3) storeId 확인 (설정된 경우)
  const expectedStore = process.env.PORTONE_STORE_ID
  if (expectedStore && p.storeId && p.storeId !== expectedStore) {
    await admin.from('product_payments').update({ needs_review: true, portone_status: p.status ?? null }).eq('id', payment.id)
    await logPaymentEvent(admin, 'payment_verification_failed', paymentId, 'server', { reason: 'store_mismatch', source })
    return { ok: false, status: 400, debugCode: 'store_mismatch', message: sanitizePaymentError('amount_mismatch'), row: payment }
  }

  const portoneStatus = String(p.status ?? '')
  const mapped = mapPortOneStatus(portoneStatus)
  const paidTotal = Number(p.amount?.total ?? NaN)
  const cancelled = Number(p.amount?.cancelled ?? 0) || 0
  const currency = String(p.currency ?? 'KRW')

  const commonFields = {
    portone_status: portoneStatus,
    transaction_id: p.transactionId ?? null,
    payment_method: p.method?.type ?? null,
    pg_provider: p.channel?.pgProvider ?? null,
    receipt_url: typeof p.receiptUrl === 'string' ? p.receiptUrl : null,
  }

  // 4) 상태별 전이
  if (portoneStatus === 'PAID' || portoneStatus === 'PARTIAL_CANCELLED' || portoneStatus === 'CANCELLED') {
    // 금액·통화 검증 (승인 총액 기준)
    if (portoneStatus === 'PAID' && (paidTotal !== payment.amount || currency !== payment.currency)) {
      await admin
        .from('product_payments')
        .update({ ...commonFields, status: 'amount_mismatch', needs_review: true, failure_message: null })
        .eq('id', payment.id)
      await logPaymentEvent(admin, 'payment_amount_mismatch', paymentId, 'server', {
        source, expected: payment.amount, currencyExpected: payment.currency,
      })
      return { ok: false, status: 400, debugCode: 'amount_mismatch', message: sanitizePaymentError('amount_mismatch'), row: payment }
    }

    const nextStatus = mapped // paid | cancelled | partial_cancelled
    const update: Record<string, unknown> = {
      ...commonFields,
      status: nextStatus,
      paid_at: p.paidAt ?? payment.paid_at ?? new Date().toISOString(),
      cancel_amount: cancelled,
    }
    if (nextStatus === 'cancelled' || nextStatus === 'partial_cancelled') {
      update.cancelled_at = p.cancelledAt ?? new Date().toISOString()
    }
    await admin.from('product_payments').update(update).eq('id', payment.id)

    let serviceOrderNumber: string | null = null
    if (nextStatus === 'paid' || nextStatus === 'partial_cancelled') {
      serviceOrderNumber = await createServiceOrderOnce(admin, { ...payment, ...(update as object) } as PaymentRow)
      if (payment.status !== 'paid') {
        await logPaymentEvent(admin, 'payment_verified_paid', paymentId, source === 'webhook' ? 'webhook' : 'server', { source })
      }
    }
    if ((nextStatus === 'cancelled' || nextStatus === 'partial_cancelled') && serviceOrderNumber === null) {
      // 전액취소 → 서비스 주문이 이미 있으면 cancelled 로 동기화
      try {
        if (nextStatus === 'cancelled') {
          await admin.from('service_orders').update({ status: 'cancelled' }).eq('payment_id', payment.id)
        }
      } catch { /* noop */ }
    }

    const { data: fresh } = await admin.from('product_payments').select('*').eq('id', payment.id).maybeSingle()
    return { ok: true, row: (fresh ?? payment) as PaymentRow, serviceOrderNumber }
  }

  if (portoneStatus === 'FAILED') {
    if (payment.status !== 'paid') {
      await admin
        .from('product_payments')
        .update({
          ...commonFields,
          status: 'failed',
          failed_at: p.failedAt ?? new Date().toISOString(),
          failure_code: p.failure?.pgCode ?? null,
          failure_message: stripControl(p.failure?.reason ?? p.failure?.pgMessage ?? '', 300) || null,
        })
        .eq('id', payment.id)
    }
    const { data: fresh } = await admin.from('product_payments').select('*').eq('id', payment.id).maybeSingle()
    return { ok: true, row: (fresh ?? payment) as PaymentRow, serviceOrderNumber: null }
  }

  // VIRTUAL_ACCOUNT_ISSUED(범위 외 예외) / PAY_PENDING / READY
  if (payment.status !== 'paid') {
    await admin
      .from('product_payments')
      .update({ ...commonFields, status: portoneStatus === 'VIRTUAL_ACCOUNT_ISSUED' ? 'exception' : 'payment_requested' })
      .eq('id', payment.id)
  }
  const { data: fresh } = await admin.from('product_payments').select('*').eq('id', payment.id).maybeSingle()
  return { ok: true, row: (fresh ?? payment) as PaymentRow, serviceOrderNumber: null }
}

/** 결제 성공 시 서비스 주문을 정확히 1번만 생성 (payment_id unique + on conflict ignore) */
export async function createServiceOrderOnce(admin: SupabaseAdmin, payment: PaymentRow): Promise<string | null> {
  try {
    const { data: existing } = await admin.from('service_orders').select('order_number').eq('payment_id', payment.id).maybeSingle()
    if (existing?.order_number) return String(existing.order_number)
    const orderNumber = createOrderNumber('SO')
    const { error } = await admin.from('service_orders').insert({
      payment_id: payment.id,
      order_number: orderNumber,
      product_slug: payment.product_slug,
      option_id: payment.option_id,
      company_name: payment.buyer_company_name,
      buyer_name: payment.buyer_name,
      buyer_phone: payment.buyer_phone,
      buyer_email: payment.buyer_email,
      status: 'intake_waiting',
      intake_status: 'waiting',
    })
    if (error) {
      // 동시 생성 경합 → 이미 생성된 행 반환
      const { data: again } = await admin.from('service_orders').select('order_number').eq('payment_id', payment.id).maybeSingle()
      return again?.order_number ? String(again.order_number) : null
    }
    await logPaymentEvent(admin, 'service_order_created', payment.payment_id, 'server', { orderNumber })
    return orderNumber
  } catch {
    return null
  }
}

/** 사용자(비회원 포함)에게 반환할 마스킹된 주문 요약 */
export function toPublicSummary(row: PaymentRow, serviceOrder?: { order_number?: string; status?: string; intake_status?: string } | null) {
  return {
    paymentId: row.payment_id,
    orderNumber: row.merchant_order_id,
    status: row.status,
    productSlug: row.product_slug,
    optionId: row.option_id,
    productName: row.product_name,
    optionName: row.option_name,
    amount: row.amount,
    currency: row.currency,
    environment: row.environment,
    buyerCompanyName: row.buyer_company_name,
    buyerName: row.buyer_name,
    buyerPhoneMasked: maskPhone(row.buyer_phone),
    buyerEmailMasked: maskEmail(row.buyer_email),
    paidAt: row.paid_at,
    cancelledAt: row.cancelled_at,
    cancelAmount: row.cancel_amount,
    receiptUrl: row.receipt_url,
    failureMessage: row.failure_message,
    serviceOrderNumber: serviceOrder?.order_number ?? null,
    serviceOrderStatus: serviceOrder?.status ?? null,
    intakeStatus: serviceOrder?.intake_status ?? null,
    createdAt: row.created_at,
  }
}
