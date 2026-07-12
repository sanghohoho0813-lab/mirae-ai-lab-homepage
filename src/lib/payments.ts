// 서비스몰 카드결제 클라이언트 — PortOne V2 (prepare → 결제창 → complete 서버검증).
// 원칙:
//  - paymentId·금액·주문명은 서버 prepare 응답만 사용 (브라우저에서 재계산 금지)
//  - requestPayment 응답에 code 가 없어도 완료 처리하지 않음 → /payment/complete 에서 서버 재검증
//  - 모바일은 redirectUrl(/payment/complete)로 복귀
import * as PortOne from '@portone/browser-sdk/v2'

export type BuyerInput = {
  buyerCompanyName: string
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  buyerBusinessNumber?: string
  buyerMemo?: string
}

export type PrepareResponse = {
  ok: true
  paymentId: string
  merchantOrderId: string
  orderName: string
  amount: number
  currency: string
  productSlug: string
  optionId: string | null
  environment: 'test' | 'live'
  accessToken: string
  customer: { fullName: string; phoneNumber: string; email: string }
  reused?: boolean
}

export type ApiError = { ok: false; message: string; debugCode?: string }

export type OrderSummary = {
  paymentId: string
  orderNumber: string
  status: string
  productSlug: string
  optionId: string | null
  productName: string
  optionName: string | null
  amount: number
  currency: string
  environment: string
  buyerCompanyName: string
  buyerName: string
  buyerPhoneMasked: string
  buyerEmailMasked: string
  paidAt: string | null
  cancelledAt: string | null
  cancelAmount: number
  receiptUrl: string | null
  failureMessage: string | null
  serviceOrderNumber: string | null
  serviceOrderStatus: string | null
  intakeStatus: string | null
  createdAt: string
}

const STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID as string | undefined
const CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY as string | undefined

export function paymentConfigured(): boolean {
  return Boolean(STORE_ID && CHANNEL_KEY)
}

// ── 테스트 결제 접근코드 — sessionStorage(탭 종료 시 소멸)만 사용, localStorage 영구 저장 금지 ──
const TEST_ACCESS_KEY = 'miraePayTestAccess'

export function rememberTestAccessCode(code: string) {
  try { sessionStorage.setItem(TEST_ACCESS_KEY, code) } catch { /* noop */ }
}
export function getTestAccessCode(): string {
  try { return sessionStorage.getItem(TEST_ACCESS_KEY) ?? '' } catch { return '' }
}

/** 로그인 세션이 있으면 Bearer 헤더 (관리자는 테스트 게이트 통과용 — 서버에서 role 재검증) */
async function authHeader(): Promise<Record<string, string>> {
  try {
    const { supabase } = await import('./supabase')
    if (!supabase) return {}
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export const formatKrw = (n: number) => `${n.toLocaleString('ko-KR')}원`

async function post<T>(body: Record<string, unknown>): Promise<T | ApiError> {
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json().catch(() => null)) as T | ApiError | null
    if (!data) return { ok: false, message: '서버 응답을 읽지 못했습니다. 잠시 후 다시 시도해주세요.' }
    return data
  } catch {
    return { ok: false, message: '네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해주세요.', debugCode: 'network' }
  }
}

/** 결제 퍼널 이벤트 (실패해도 결제 흐름에 영향 없음) */
export function trackPaymentEvent(eventType: string, paymentId?: string | null, payload?: Record<string, unknown>) {
  void post({ action: 'event', eventType, paymentId: paymentId ?? undefined, payload }).catch(() => {})
}

/** 서버 결제환경 조회 (테스트 배지·접근 게이트 여부 — secret 값은 오지 않음) */
export async function getPaymentHealth(): Promise<{ portoneConfigured: boolean; environment: 'test' | 'live'; testGateActive: boolean } | null> {
  try {
    const res = await fetch('/api/payments', { method: 'GET' })
    const data = await res.json()
    if (data?.ok) {
      return {
        portoneConfigured: Boolean(data.portoneConfigured),
        environment: data.environment === 'live' ? 'live' : 'test',
        testGateActive: Boolean(data.testGateActive),
      }
    }
    return null
  } catch {
    return null
  }
}

export async function preparePayment(input: {
  productSlug: string
  optionId: string | null
  requestId: string
  buyer: BuyerInput
  isoStandards?: string[]
  leadId?: string | null
  diagnosisSessionId?: string | null
  consentVersions: { privacyVersion: string; purchaseTermsVersion: string; refundPolicyVersion: string }
  honeypot?: string
}): Promise<PrepareResponse | ApiError> {
  // 테스트 게이트: 접근코드(sessionStorage) + 관리자 세션 헤더 — 검증은 서버가 수행
  const headers = await authHeader()
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(buildPrepareBody(input)),
    })
    const data = (await res.json().catch(() => null)) as PrepareResponse | ApiError | null
    if (!data) return { ok: false, message: '서버 응답을 읽지 못했습니다. 잠시 후 다시 시도해주세요.' }
    return data
  } catch {
    return { ok: false, message: '네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해주세요.', debugCode: 'network' }
  }
}

function buildPrepareBody(input: Parameters<typeof preparePayment>[0]): Record<string, unknown> {
  return {
    action: 'prepare',
    testAccessCode: getTestAccessCode() || undefined,
    productSlug: input.productSlug,
    optionId: input.optionId ?? undefined,
    requestId: input.requestId,
    buyerCompanyName: input.buyer.buyerCompanyName,
    buyerName: input.buyer.buyerName,
    buyerPhone: input.buyer.buyerPhone,
    buyerEmail: input.buyer.buyerEmail,
    buyerBusinessNumber: input.buyer.buyerBusinessNumber || undefined,
    buyerMemo: input.buyer.buyerMemo || undefined,
    isoStandards: input.isoStandards,
    leadId: input.leadId ?? undefined,
    diagnosisSessionId: input.diagnosisSessionId ?? undefined,
    privacyConsent: true,
    purchaseTermsConsent: true,
    refundPolicyConsent: true,
    privacyVersion: input.consentVersions.privacyVersion,
    purchaseTermsVersion: input.consentVersions.purchaseTermsVersion,
    refundPolicyVersion: input.consentVersions.refundPolicyVersion,
    honeypot: input.honeypot ?? '',
  }
}

/**
 * PortOne 결제창 호출 — prepare 응답 값만 사용.
 * PC: 반환값으로 결과 수신 / 모바일: redirectUrl 로 이동(이 함수가 리턴되지 않을 수 있음).
 */
export async function openPortOnePayment(prepared: PrepareResponse): Promise<
  { kind: 'returned'; paymentId: string } | { kind: 'failed'; code: string; message: string }
> {
  if (!STORE_ID || !CHANNEL_KEY) {
    return { kind: 'failed', code: 'not_configured', message: '결제 설정이 아직 완료되지 않았습니다.' }
  }
  const appUrl = (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined) || window.location.origin
  let response: Awaited<ReturnType<typeof PortOne.requestPayment>>
  try {
    response = await PortOne.requestPayment({
      storeId: STORE_ID,
      channelKey: CHANNEL_KEY,
      paymentId: prepared.paymentId,
      orderName: prepared.orderName,
      totalAmount: prepared.amount,
      currency: 'KRW',
      payMethod: 'CARD',
      customer: {
        fullName: prepared.customer.fullName,
        phoneNumber: prepared.customer.phoneNumber,
        email: prepared.customer.email || undefined,
      },
      redirectUrl: `${appUrl}/payment/complete`,
    })
  } catch (e) {
    return { kind: 'failed', code: 'sdk_error', message: e instanceof Error ? e.message : '결제창을 여는 중 문제가 발생했습니다.' }
  }
  if (!response) return { kind: 'failed', code: 'no_response', message: '결제 응답을 받지 못했습니다. 결제상태를 다시 확인해주세요.' }
  if (response.code !== undefined && response.code !== null) {
    return { kind: 'failed', code: String(response.code), message: response.message ?? '결제가 완료되지 않았습니다.' }
  }
  // ⚠️ code 없음 = 결제창 정상 종료일 뿐, 서버 검증 전까지 완료 아님
  return { kind: 'returned', paymentId: response.paymentId ?? prepared.paymentId }
}

/** 서버 결제 검증 (PortOne 단건조회 후 확정) */
export function completePayment(paymentId: string): Promise<({ ok: true; order: OrderSummary; pendingReason?: string }) | ApiError> {
  return post({ action: 'complete', paymentId })
}

/** 결제상태 재확인 */
export function recheckPayment(paymentId: string): Promise<({ ok: true; order: OrderSummary; pendingReason?: string }) | ApiError> {
  return post({ action: 'status', paymentId })
}

/** 비회원 주문 조회 (paymentId + accessToken) */
export async function getOrder(paymentId: string, token: string): Promise<({ ok: true; order: OrderSummary }) | ApiError> {
  try {
    const res = await fetch(`/api/payments?paymentId=${encodeURIComponent(paymentId)}&token=${encodeURIComponent(token)}`)
    const data = await res.json().catch(() => null)
    if (!data) return { ok: false, message: '서버 응답을 읽지 못했습니다.' }
    return data
  } catch {
    return { ok: false, message: '네트워크 오류가 발생했습니다.', debugCode: 'network' }
  }
}

/** 서비스 진행정보(인테이크) 제출 */
export function submitIntake(input: {
  paymentId: string
  accessToken: string
  concern?: string
  preferredMethod?: string
  preferredTime?: string
  materials?: string
  requests?: string
}): Promise<{ ok: true } | ApiError> {
  return post({ action: 'intake', ...input })
}

// ── 비회원 주문 로컬 기록 (민감정보 저장 금지 — 토큰은 조회용) ──
const ORDERS_KEY = 'miraePaymentOrders'

export type LocalOrder = {
  paymentId: string
  orderAccessToken: string
  orderNumber: string
  productName: string
  optionName: string | null
  amount: number
  status: string
  createdAt: string
}

export function loadLocalOrders(): LocalOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? (arr as LocalOrder[]).filter((o) => o && o.paymentId && o.orderAccessToken) : []
  } catch {
    return []
  }
}

export function saveLocalOrder(order: LocalOrder) {
  try {
    const rest = loadLocalOrders().filter((o) => o.paymentId !== order.paymentId)
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...rest].slice(0, 20)))
  } catch {
    /* noop */
  }
}

export function updateLocalOrderStatus(paymentId: string, status: string) {
  try {
    const orders = loadLocalOrders().map((o) => (o.paymentId === paymentId ? { ...o, status } : o))
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch {
    /* noop */
  }
}

export function findLocalOrder(paymentId: string): LocalOrder | null {
  return loadLocalOrders().find((o) => o.paymentId === paymentId) ?? null
}

export function newRequestId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
  }
}
