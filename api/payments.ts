// /api/payments — 서비스몰 일회성 카드결제 (PortOne V2) 통합 엔드포인트.
//   GET  ?paymentId=..&token=..   : 주문 상태 조회 (비회원 access token 검증, 마스킹 반환)
//   GET  (파라미터 없음)           : health — env 설정 여부(값은 노출 안 함)
//   POST body.action:
//     prepare     : 서버가 상품·금액 결정 + pending 주문 생성 + paymentId 발급 (멱등: requestId)
//     complete    : PortOne 단건조회 재검증 → paid 확정 + service_order 1회 생성
//     status      : complete 와 동일 검증(reconcile) 후 최신 상태 반환 (pending 재확인용)
//     intake      : 결제 완료 고객의 서비스 진행정보 저장
//     event       : 결제 퍼널 이벤트 기록 (실패해도 200 — 결제 흐름을 막지 않음)
//     admin_list / admin_detail : 관리자 전용 (Bearer → profiles.role='admin')
//
// 보안 원칙:
//  - 금액은 서버 카탈로그(billing_products→로컬 폴백)만 신뢰. 클라이언트 amount 무시.
//  - 상담 전용 상품(prepare) 422 차단. 비활성 상품 차단.
//  - 응답에 secret·service key·타 고객 정보 절대 미포함. 조회 응답은 전화·이메일 마스킹.
//  - 브라우저 응답만으로 paid 처리하지 않음 (PortOne 재조회 필수).
import { getSupabaseAdmin, supabaseConfigured, verifyAdmin, type SupabaseAdmin } from './_lib/supabaseAdmin'
import { CONSULT_ONLY_SLUGS, getServerProduct } from './_lib/paymentCatalog'
import { portoneConfigured, portoneEnvironment } from './_lib/portone'
import {
  createAccessToken, createOrderNumber, createPaymentId, logPaymentEvent, maskEmail, maskPhone,
  normalizePhone, reconcilePayment, sanitizePaymentError, sha256, stripControl, toPublicSummary, type PaymentRow,
} from './_lib/paymentReconcile'
import { DEFAULT_ONE_TIME_POLICY, evaluateOneTimeRefundEligibility, policyFromRow } from './_lib/refundPolicy'

type VercelReq = { method?: string; body?: unknown; query?: Record<string, string | string[]>; headers: Record<string, string | string[] | undefined>; url?: string }
type VercelRes = { status: (code: number) => VercelRes; json: (body: unknown) => void; setHeader: (k: string, v: string) => void }

const CLIENT_EVENTS = [
  'checkout_viewed', 'checkout_option_selected', 'checkout_prepare_started', 'checkout_prepare_failed',
  'payment_window_opened', 'payment_cancelled_by_user', 'payment_client_failed', 'payment_verification_started',
  'payment_complete_viewed', 'payment_retry_clicked', 'payment_consultation_clicked', 'payment_status_rechecked',
]

function bodyOf(req: VercelReq): Record<string, unknown> {
  if (typeof req.body === 'object' && req.body !== null) return req.body as Record<string, unknown>
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) as Record<string, unknown> } catch { return {} }
  }
  return {}
}

function queryOf(req: VercelReq): URLSearchParams {
  try { return new URL(req.url ?? '', 'http://x').searchParams } catch { return new URLSearchParams() }
}

async function getServiceOrder(admin: SupabaseAdmin, paymentRowId: string) {
  const { data } = await admin.from('service_orders').select('order_number, status, intake_status, intake').eq('payment_id', paymentRowId).maybeSingle()
  return data as { order_number?: string; status?: string; intake_status?: string; intake?: unknown } | null
}

/** 비회원 접근 검증: paymentId + access token(sha256 비교) */
function tokenMatches(row: PaymentRow, token: string): boolean {
  return Boolean(token && row.access_token_hash && sha256(token) === row.access_token_hash)
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store')

  const admin = await getSupabaseAdmin()

  // ── GET: health / 상태 조회 ──
  if (req.method === 'GET') {
    const q = queryOf(req)
    const paymentId = stripControl(q.get('paymentId') ?? '', 80)
    if (!paymentId) {
      return res.status(200).json({
        ok: true,
        portoneConfigured: portoneConfigured(),
        supabaseConfigured: supabaseConfigured(),
        webhookConfigured: Boolean(process.env.PORTONE_WEBHOOK_SECRET),
        environment: portoneEnvironment(),
        // test 환경에서 접근코드 게이트가 켜져 있는지 (코드 값 자체는 절대 반환하지 않음)
        testGateActive: portoneEnvironment() !== 'live' && Boolean(process.env.PAYMENT_TEST_ACCESS_CODE),
      })
    }
    if (!admin) return res.status(503).json({ ok: false, message: '서버 설정이 완료되지 않았습니다.', debugCode: 'supabase_not_configured' })
    const token = stripControl(q.get('token') ?? '', 120)
    const { data: row } = await admin.from('product_payments').select('*').eq('payment_id', paymentId).maybeSingle()
    if (!row) return res.status(404).json({ ok: false, message: '주문을 찾을 수 없습니다.', debugCode: 'order_not_found' })
    const payment = row as PaymentRow
    // 관리자이거나 access token 이 맞아야 조회 가능
    if (!tokenMatches(payment, token)) {
      const adminCheck = await verifyAdmin(admin, req.headers['authorization'])
      if (!adminCheck.ok) return res.status(403).json({ ok: false, message: '주문 조회 권한이 없습니다.', debugCode: 'forbidden' })
    }
    const so = await getServiceOrder(admin, payment.id)
    return res.status(200).json({ ok: true, order: toPublicSummary(payment, so) })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: '허용되지 않은 메서드입니다.', debugCode: 'method_not_allowed' })
  }

  const body = bodyOf(req)
  const action = stripControl(body.action, 30)

  // ── event: 결제 흐름을 막지 않는 fire-and-forget 로그 ──
  if (action === 'event') {
    const eventType = stripControl(body.eventType, 60)
    if (admin && CLIENT_EVENTS.includes(eventType)) {
      const rawPayload = typeof body.payload === 'object' && body.payload !== null ? (body.payload as Record<string, unknown>) : undefined
      let payload: Record<string, unknown> | undefined
      if (rawPayload) {
        try { payload = JSON.stringify(rawPayload).length <= 1500 ? rawPayload : undefined } catch { payload = undefined }
      }
      await logPaymentEvent(admin, eventType, stripControl(body.paymentId, 80) || null, 'client', payload)
    }
    return res.status(200).json({ ok: true })
  }

  if (!admin) {
    return res.status(503).json({ ok: false, message: '서버 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.', debugCode: 'supabase_not_configured' })
  }

  // ── prepare: 서버가 금액 결정 + pending 주문 생성 ──
  if (action === 'prepare') {
    // honeypot — 봇 차단 (조용히 성공처럼 응답하지 않고 명시적 차단)
    if (stripControl(body.honeypot, 10)) {
      return res.status(400).json({ ok: false, message: '요청을 처리할 수 없습니다.', debugCode: 'bad_request' })
    }
    const productSlug = stripControl(body.productSlug, 60)
    const optionIdRaw = stripControl(body.optionId, 60)
    const optionId = optionIdRaw || null
    const requestId = stripControl(body.requestId, 80)
    const buyerCompanyName = stripControl(body.buyerCompanyName, 80)
    const buyerName = stripControl(body.buyerName, 60)
    const buyerPhone = normalizePhone(stripControl(body.buyerPhone, 30))
    const buyerEmail = stripControl(body.buyerEmail, 120)
    const buyerBusinessNumber = stripControl(body.buyerBusinessNumber, 20)
    const buyerMemo = stripControl(body.buyerMemo, 1000)
    const leadId = stripControl(body.leadId, 60)
    const diagnosisSessionId = stripControl(body.diagnosisSessionId, 60)

    // 필수 동의 3종
    if (body.privacyConsent !== true || body.purchaseTermsConsent !== true || body.refundPolicyConsent !== true) {
      return res.status(400).json({ ok: false, message: '필수 동의 항목을 확인해주세요.', debugCode: 'consent_required' })
    }
    if (!productSlug || !requestId || requestId.length < 8) {
      return res.status(400).json({ ok: false, message: '요청 정보가 올바르지 않습니다.', debugCode: 'bad_request' })
    }
    if (buyerCompanyName.length < 1 || buyerName.length < 2 || buyerPhone.length < 9) {
      return res.status(400).json({ ok: false, message: '회사명·성함·연락처를 정확히 입력해주세요.', debugCode: 'bad_buyer' })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyerEmail)) {
      return res.status(400).json({ ok: false, message: '이메일 주소를 확인해주세요.', debugCode: 'bad_email' })
    }

    // ── 테스트 결제 외부노출 방지 게이트 (live 에서는 미적용) ──
    // PORTONE_ENV=test + PAYMENT_TEST_ACCESS_CODE 설정 시: 일치하는 접근코드 또는 관리자만 prepare 허용.
    // 접근코드 값은 로그·응답에 절대 출력하지 않음 (비교는 sha256 해시로 — 타이밍 안전).
    const gateCode = process.env.PAYMENT_TEST_ACCESS_CODE
    if (portoneEnvironment() !== 'live' && gateCode) {
      const provided = stripControl(body.testAccessCode, 120)
      let allowed = provided.length > 0 && sha256(provided) === sha256(gateCode)
      if (!allowed && req.headers['authorization']) {
        const adminCheck = await verifyAdmin(admin, req.headers['authorization'])
        allowed = adminCheck.ok
      }
      if (!allowed) {
        return res.status(403).json({
          ok: false,
          message: '현재 결제 기능을 준비하고 있습니다. 결제 전 상담을 이용해주세요.',
          debugCode: 'test_access_required',
        })
      }
    }

    // 상담 전용 상품 차단 + 서버 금액 결정 (클라이언트 amount 는 어떤 필드로 와도 무시)
    const lookup = await getServerProduct(admin, productSlug, optionId)
    if (lookup.kind === 'consult_only') {
      return res.status(422).json({ ok: false, message: '이 상품은 상담 후 진행되는 상품입니다. 상담 신청을 이용해주세요.', debugCode: 'consultation_only' })
    }
    if (lookup.kind === 'catalog_unavailable') {
      // live: billing_products 미시드/조회 불가 — 코드 가격으로 진행하지 않고 차단
      return res.status(503).json({ ok: false, message: '현재 결제상품 설정을 확인하고 있습니다. 잠시 후 다시 시도해주세요.', debugCode: 'catalog_unavailable' })
    }
    if (lookup.kind === 'not_found') {
      return res.status(400).json({ ok: false, message: '결제 가능한 상품을 찾을 수 없습니다.', debugCode: 'unknown_product' })
    }
    const product = lookup.product

    // requestId 멱등성 — 같은 요청 재전송이면 기존 pending 주문 재사용 (토큰만 재발급)
    const { data: existing } = await admin.from('product_payments').select('*').eq('request_id', requestId).maybeSingle()
    if (existing) {
      const row = existing as PaymentRow
      if (row.product_slug === product.productSlug && (row.option_id ?? null) === product.optionId && ['pending', 'payment_requested'].includes(row.status)) {
        const accessToken = createAccessToken()
        await admin.from('product_payments').update({ access_token_hash: sha256(accessToken) }).eq('id', row.id)
        return res.status(200).json({
          ok: true, reused: true,
          paymentId: row.payment_id, merchantOrderId: row.merchant_order_id,
          orderName: row.option_name ? `${row.product_name} — ${row.option_name}` : row.product_name,
          amount: row.amount, currency: row.currency, productSlug: row.product_slug, optionId: row.option_id,
          environment: row.environment, accessToken,
          customer: { fullName: row.buyer_name, phoneNumber: row.buyer_phone, email: row.buyer_email },
        })
      }
      return res.status(409).json({ ok: false, message: '이미 처리된 요청입니다. 주문 상태를 확인해주세요.', debugCode: 'request_conflict', paymentId: row.payment_id })
    }

    const paymentId = createPaymentId()
    const merchantOrderId = createOrderNumber('MO')
    const accessToken = createAccessToken()
    const environment = portoneEnvironment()
    const consent = {
      privacyConsent: true, purchaseTermsConsent: true, refundPolicyConsent: true,
      privacyVersion: stripControl(body.privacyVersion, 20) || null,
      purchaseTermsVersion: stripControl(body.purchaseTermsVersion, 20) || null,
      refundPolicyVersion: stripControl(body.refundPolicyVersion, 20) || null,
      consentAt: new Date().toISOString(),
    }
    const isoStandards = Array.isArray(body.isoStandards)
      ? (body.isoStandards as unknown[]).map((s) => stripControl(s, 20)).filter(Boolean).slice(0, 3)
      : []

    const { error: insertErr } = await admin.from('product_payments').insert({
      payment_id: paymentId,
      merchant_order_id: merchantOrderId,
      request_id: requestId,
      environment,
      product_slug: product.productSlug,
      option_id: product.optionId,
      product_name: product.name,
      option_name: product.optionName,
      amount: product.amount, // ⚠️ 서버 카탈로그 금액만 사용
      billing_price_id: product.priceId, // 결제 당시 가격 버전 스냅샷 (이후 가격 변경과 분리)
      price_version: product.priceVersion,
      currency: 'KRW',
      status: 'pending',
      buyer_company_name: buyerCompanyName,
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      buyer_email: buyerEmail,
      buyer_business_number: buyerBusinessNumber || null,
      buyer_memo: buyerMemo || null,
      lead_id: /^[0-9a-f-]{36}$/i.test(leadId) ? leadId : null,
      diagnosis_session_id: /^[0-9a-f-]{36}$/i.test(diagnosisSessionId) ? diagnosisSessionId : null,
      access_token_hash: sha256(accessToken),
      metadata: { consent, isoStandards: isoStandards.length ? isoStandards : undefined, catalogSource: product.source, clientDiagnosisSession: diagnosisSessionId || undefined },
    })
    if (insertErr) {
      return res.status(500).json({ ok: false, message: '주문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'insert_failed' })
    }
    await logPaymentEvent(admin, 'checkout_prepare_succeeded', paymentId, 'server', { productSlug: product.productSlug, optionId: product.optionId, environment })

    return res.status(200).json({
      ok: true,
      paymentId, merchantOrderId,
      orderName: product.optionName ? `${product.name} — ${product.optionName}` : product.name,
      amount: product.amount, currency: 'KRW',
      productSlug: product.productSlug, optionId: product.optionId,
      environment, accessToken,
      customer: { fullName: buyerName, phoneNumber: buyerPhone, email: buyerEmail },
    })
  }

  // ── complete / status: PortOne 재검증 후 최신 상태 반환 ──
  if (action === 'complete' || action === 'status') {
    const paymentId = stripControl(body.paymentId, 80)
    if (!paymentId || !/^[A-Za-z0-9\-_]{6,64}$/.test(paymentId)) {
      return res.status(400).json({ ok: false, message: '결제 ID가 올바르지 않습니다.', debugCode: 'bad_payment_id' })
    }
    if (!portoneConfigured()) {
      return res.status(503).json({ ok: false, message: sanitizePaymentError('portone_not_configured'), debugCode: 'portone_not_configured' })
    }
    const result = await reconcilePayment(admin, paymentId, action === 'complete' ? 'complete' : 'status')
    if (!result.ok) {
      // 결제 시도 전(승인 내역 없음) — pending 으로 안내
      if (result.debugCode === 'payment_not_found' && result.row) {
        const so = await getServiceOrder(admin, result.row.id)
        return res.status(200).json({ ok: true, order: toPublicSummary(result.row, so), pendingReason: 'not_attempted' })
      }
      return res.status(result.status).json({ ok: false, message: result.message, debugCode: result.debugCode })
    }
    const so = await getServiceOrder(admin, result.row.id)
    return res.status(200).json({ ok: true, order: toPublicSummary(result.row, so) })
  }

  // ── intake: 결제 완료 고객 서비스 진행정보 (access token 필요) ──
  if (action === 'intake') {
    const paymentId = stripControl(body.paymentId, 80)
    const token = stripControl(body.accessToken, 120)
    const { data: row } = await admin.from('product_payments').select('*').eq('payment_id', paymentId).maybeSingle()
    if (!row) return res.status(404).json({ ok: false, message: '주문을 찾을 수 없습니다.', debugCode: 'order_not_found' })
    const payment = row as PaymentRow
    if (!tokenMatches(payment, token)) return res.status(403).json({ ok: false, message: '주문 확인 권한이 없습니다.', debugCode: 'forbidden' })
    if (!['paid', 'partial_cancelled'].includes(payment.status)) {
      return res.status(400).json({ ok: false, message: '결제 확인 후 작성할 수 있습니다.', debugCode: 'not_paid' })
    }
    const intake = {
      concern: stripControl(body.concern, 1000) || null,
      preferredMethod: stripControl(body.preferredMethod, 40) || null,
      preferredTime: stripControl(body.preferredTime, 60) || null,
      materials: stripControl(body.materials, 500) || null,
      requests: stripControl(body.requests, 1000) || null,
      submittedAt: new Date().toISOString(),
    }
    const { error: upErr } = await admin
      .from('service_orders')
      .update({ intake, intake_status: 'received', status: 'intake_received' })
      .eq('payment_id', payment.id)
    if (upErr) return res.status(500).json({ ok: false, message: '저장에 실패했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'intake_failed' })
    await logPaymentEvent(admin, 'payment_intake_submitted', paymentId, 'server')
    return res.status(200).json({ ok: true })
  }

  // ── refund_request: 환불 요청 접수 + 정책 판정·계산 스냅샷 저장 ──
  //    ⚠️ 실제 PortOne 취소 API 는 호출하지 않음 — 관리자 검토용 요청 레코드만 생성.
  if (action === 'refund_request') {
    const paymentId = stripControl(body.paymentId, 80)
    const token = stripControl(body.accessToken, 120)
    const reason = stripControl(body.reason, 500)
    const { data: row } = await admin.from('product_payments').select('*').eq('payment_id', paymentId).maybeSingle()
    if (!row) return res.status(404).json({ ok: false, message: '주문을 찾을 수 없습니다.', debugCode: 'order_not_found' })
    const payment = row as PaymentRow
    if (!tokenMatches(payment, token)) {
      const adminCheck = await verifyAdmin(admin, req.headers['authorization'])
      if (!adminCheck.ok) return res.status(403).json({ ok: false, message: '주문 확인 권한이 없습니다.', debugCode: 'forbidden' })
    }
    if (!['paid', 'partial_cancelled'].includes(payment.status)) {
      return res.status(400).json({ ok: false, message: '결제 완료된 주문만 환불을 요청할 수 있습니다.', debugCode: 'not_paid' })
    }

    // 중복 요청 방지 — 진행 중 요청이 있으면 그대로 반환
    const { data: existing } = await admin
      .from('billing_refund_requests')
      .select('id, status, calculated_amount, requested_at')
      .eq('product_payment_id', payment.id)
      .in('status', ['requested', 'calculating', 'pending_review', 'approved', 'processing'])
      .maybeSingle()
    if (existing) {
      return res.status(200).json({
        ok: true, duplicated: true, requestId: existing.id, status: existing.status,
        calculatedAmount: existing.calculated_amount,
        message: '이미 접수된 환불 요청이 검토 중입니다.',
      })
    }

    // 정책 로드 (billing_product_policies ← billing_products.product_slug/option_id) — 미시드 시 기본 정책
    let policyRow: Record<string, unknown> | null = null
    try {
      let pq = admin.from('billing_products').select('id').eq('product_slug', payment.product_slug).eq('kind', 'one_time')
      pq = payment.option_id === null ? pq.is('option_id', null) : pq.eq('option_id', payment.option_id)
      const { data: bp } = await pq.maybeSingle()
      if (bp?.id) {
        const { data: pol } = await admin
          .from('billing_product_policies').select('*')
          .eq('billing_product_id', bp.id).eq('active', true).maybeSingle()
        policyRow = (pol as Record<string, unknown> | null) ?? null
      }
    } catch { /* 기본 정책 사용 */ }
    const policy = policyRow ? policyFromRow(policyRow) : DEFAULT_ONE_TIME_POLICY

    // 서비스 시작 여부 (service_orders)
    const { data: so } = await admin
      .from('service_orders').select('id, service_started_at').eq('payment_id', payment.id).maybeSingle()
    const serviceStartedAt = (so?.service_started_at as string | undefined) ?? null

    const verdict = evaluateOneTimeRefundEligibility({
      paidAt: payment.paid_at ?? payment.created_at,
      now: new Date(),
      serviceStartedAt,
      policy,
      paidAmount: payment.amount,
      cancelledAmount: payment.cancel_amount || 0,
    })

    if (verdict.eligibility === 'none') {
      return res.status(200).json({
        ok: false, eligibility: verdict.eligibility, maximumRefundAmount: 0,
        message: verdict.reason, debugCode: 'refund_not_eligible',
      })
    }

    const requestedAmount = Number.isInteger(body.requestedAmount) && (body.requestedAmount as number) > 0
      ? Math.min(body.requestedAmount as number, verdict.maximumRefundAmount)
      : verdict.maximumRefundAmount
    const requestType = verdict.eligibility === 'full' && requestedAmount === payment.amount - (payment.cancel_amount || 0)
      ? 'one_time_full' : 'one_time_partial'

    const { data: inserted, error: insErr } = await admin
      .from('billing_refund_requests')
      .insert({
        product_payment_id: payment.id,
        request_type: requestType,
        requested_amount: requestedAmount,
        calculated_amount: verdict.maximumRefundAmount,
        reason: reason || null,
        calculation_snapshot: {
          eligibility: verdict.eligibility, maximumRefundAmount: verdict.maximumRefundAmount,
          requiresAdminApproval: verdict.requiresAdminApproval, reason: verdict.reason,
          paidAmount: payment.amount, cancelledAmount: payment.cancel_amount || 0,
          paidAt: payment.paid_at, serviceStartedAt, evaluatedAt: new Date().toISOString(),
        },
        policy_snapshot: { ...policy },
        status: 'pending_review',
      })
      .select('id')
      .maybeSingle()
    if (insErr) return res.status(500).json({ ok: false, message: '요청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'refund_insert_failed' })

    try {
      await admin.from('service_orders').update({ refund_eligibility: verdict.eligibility, refund_review_status: 'requested' }).eq('payment_id', payment.id)
      await admin.from('billing_audit_logs').insert({
        actor_type: 'customer', entity_type: 'refund_request', entity_id: String(inserted?.id ?? ''),
        action: 'refund_requested',
        after_data: { paymentId: payment.payment_id, eligibility: verdict.eligibility, calculatedAmount: verdict.maximumRefundAmount, requestedAmount },
        reason: reason || null,
      })
    } catch { /* 로그 실패가 요청 접수를 막지 않음 */ }
    await logPaymentEvent(admin, 'payment_verification_started', payment.payment_id, 'server', { kind: 'refund_request' })

    return res.status(200).json({
      ok: true,
      requestId: inserted?.id ?? null,
      status: 'pending_review',
      eligibility: verdict.eligibility,
      maximumRefundAmount: verdict.maximumRefundAmount,
      requestedAmount,
      requiresAdminApproval: verdict.requiresAdminApproval,
      message: `환불 요청이 접수되었습니다. ${verdict.reason} 실제 환불은 담당자 확인 후 처리됩니다.`,
    })
  }

  // ── 관리자 전용 ──
  if (action === 'admin_list' || action === 'admin_detail' || action === 'admin_policies') {
    const adminCheck = await verifyAdmin(admin, req.headers['authorization'])
    if (!adminCheck.ok) return res.status(adminCheck.status).json({ ok: false, message: adminCheck.message, debugCode: adminCheck.debugCode })

    if (action === 'admin_detail') {
      const paymentId = stripControl(body.paymentId, 80)
      const { data: row } = await admin.from('product_payments').select('*').eq('payment_id', paymentId).maybeSingle()
      if (!row) return res.status(404).json({ ok: false, message: '주문을 찾을 수 없습니다.', debugCode: 'order_not_found' })
      const payment = row as PaymentRow & Record<string, unknown>
      const { data: so } = await admin.from('service_orders').select('*').eq('payment_id', payment.id).maybeSingle()
      const { data: events } = await admin
        .from('payment_events').select('event_type, source, payload, created_at')
        .eq('payment_id', paymentId).order('created_at', { ascending: true }).limit(100)
      const { data: refunds } = await admin
        .from('billing_refund_requests')
        .select('id, request_type, requested_amount, calculated_amount, approved_amount, status, reason, requested_at, reviewed_at, calculation_snapshot')
        .eq('product_payment_id', payment.id).order('requested_at', { ascending: false }).limit(20)
      // 관리자 상세는 전체 정보(마스킹 없음) — access_token_hash 는 제외
      const { access_token_hash: _hash, ...full } = payment
      return res.status(200).json({ ok: true, payment: full, serviceOrder: so ?? null, events: events ?? [], refundRequests: refunds ?? [] })
    }

    // admin_policies — 상품별 현재 가격·버전·환불정책 (읽기 전용)
    if (action === 'admin_policies') {
      const { data: products } = await admin
        .from('billing_products')
        .select('id, code, name, kind, amount, active, product_slug, option_id, option_name, vat_included')
        .eq('kind', 'one_time').eq('active', true).order('sort', { ascending: true }).limit(100)
      const list = (products ?? []) as Array<Record<string, unknown>>
      const out: Array<Record<string, unknown>> = []
      for (const p of list) {
        let price: Record<string, unknown> | null = null
        let policy: Record<string, unknown> | null = null
        try {
          const { data: prices } = await admin
            .from('billing_prices').select('id, price_version, amount, effective_from, effective_to, active')
            .eq('billing_product_id', p.id).eq('active', true)
            .order('price_version', { ascending: false }).limit(1)
          price = (prices?.[0] as Record<string, unknown> | undefined) ?? null
          const { data: pol } = await admin
            .from('billing_product_policies').select('*').eq('billing_product_id', p.id).maybeSingle()
          policy = (pol as Record<string, unknown> | null) ?? null
        } catch { /* 미시드 환경 — null 로 표시 */ }
        out.push({
          code: p.code, name: p.name, productSlug: p.product_slug, optionId: p.option_id, optionName: p.option_name,
          paymentType: p.kind, legacyAmount: p.amount, vatIncluded: p.vat_included,
          currentPrice: price ? { id: price.id, version: price.price_version, amount: price.amount, effectiveFrom: price.effective_from } : null,
          policy: policy ? {
            fullRefundBeforeServiceStart: policy.full_refund_before_service_start,
            cancellationWindowDays: policy.cancellation_window_days,
            refundAfterServiceStart: policy.refund_after_service_start,
            partialRefundAllowed: policy.partial_refund_allowed,
            adminApprovalRequired: policy.admin_approval_required,
            subscriptionCancelDefault: policy.subscription_cancel_default,
            moduleAddProrationEnabled: policy.module_add_proration_enabled,
            moduleRemovePolicy: policy.module_remove_policy,
            prorationRounding: policy.proration_rounding,
            minimumChargeAmount: policy.minimum_charge_amount,
            policyVersion: policy.policy_version,
            priceChangeDefault: 'new_customers_only',
          } : null,
        })
      }
      return res.status(200).json({ ok: true, products: out })
    }

    // admin_list — 필터 + 요약
    const limit = Math.min(Number(body.limit) || 200, 500)
    let q = admin.from('product_payments').select('*').order('created_at', { ascending: false }).limit(limit)
    const fStatus = stripControl(body.status, 30)
    const fSlug = stripControl(body.productSlug, 60)
    const fEnv = stripControl(body.environment, 10)
    const fFrom = stripControl(body.from, 30)
    const fTo = stripControl(body.to, 30)
    if (fStatus) q = q.eq('status', fStatus)
    if (fSlug) q = q.eq('product_slug', fSlug)
    if (fEnv === 'test' || fEnv === 'live') q = q.eq('environment', fEnv)
    if (fFrom) q = q.gte('created_at', fFrom)
    if (fTo) q = q.lte('created_at', fTo)
    const { data: rows, error: listErr } = await q
    if (listErr) return res.status(500).json({ ok: false, message: '목록 조회에 실패했습니다.', debugCode: 'list_failed' })
    const list = (rows ?? []) as (PaymentRow & { needs_review?: boolean })[]

    const ids = list.map((r) => r.id)
    let orders: Array<{ payment_id: string; order_number: string; status: string; intake_status: string }> = []
    if (ids.length) {
      const { data: os } = await admin.from('service_orders').select('payment_id, order_number, status, intake_status').in('payment_id', ids)
      orders = (os ?? []) as typeof orders
    }
    const orderByPayment = new Map(orders.map((o) => [o.payment_id, o]))

    // ── 요약 — 현재 서버 환경(PORTONE_ENV)의 주문만 집계 (live 통계에 test 주문 미합산) ──
    //  · 매출 합산: paid + partial_cancelled(순액 = 결제금액 - 취소금액)만. cancelled 전액취소 제외.
    //  · amount_mismatch / verification_failed / exception 은 매출에 포함하지 않음(확인 필요 건수로만).
    const summaryEnv = portoneEnvironment()
    const now = new Date()
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    let todayAmount = 0, monthAmount = 0, paidCount = 0, needsReview = 0, cancelledCount = 0
    for (const r of list) {
      if (r.environment !== summaryEnv) continue
      const paidLike = r.status === 'paid' || r.status === 'partial_cancelled'
      const net = r.amount - (r.cancel_amount || 0)
      const t = r.paid_at ? new Date(r.paid_at).getTime() : 0
      if (paidLike) {
        paidCount++
        if (t >= dayStart) todayAmount += net
        if (t >= monthStart) monthAmount += net
      }
      if (r.status === 'amount_mismatch' || r.status === 'verification_failed' || r.needs_review) needsReview++
      if (r.status === 'cancelled' || r.status === 'partial_cancelled') cancelledCount++
    }

    return res.status(200).json({
      ok: true,
      summary: { environment: summaryEnv, todayAmount, monthAmount, paidCount, needsReview, cancelledCount },
      payments: list.map((r) => {
        const { access_token_hash: _h, buyer_phone, buyer_email, buyer_business_number: _b, ...rest } = r as PaymentRow & Record<string, unknown>
        return {
          ...rest,
          buyer_phone_masked: maskPhone(String(buyer_phone ?? '')),
          buyer_email_masked: maskEmail(String(buyer_email ?? '')),
          service_order: orderByPayment.get(r.id) ?? null,
        }
      }),
      consultOnlySlugs: CONSULT_ONLY_SLUGS,
    })
  }

  return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.', debugCode: 'unknown_action' })
}
