// PortOne V2 서버 연동 — 결제 단건조회 + 웹훅 서명 검증.
// 결제 상태·금액의 최종 신뢰는 항상 GET https://api.portone.io/payments/{paymentId} 재조회 결과입니다.
// (웹훅 body 의 상태·금액은 서명이 검증되어도 그대로 신뢰하지 않습니다)

export type PortOnePayment = {
  status: string
  id?: string
  storeId?: string
  transactionId?: string
  orderName?: string
  currency?: string
  amount?: { total?: number; cancelled?: number }
  method?: { type?: string; provider?: string }
  channel?: { pgProvider?: string; type?: string }
  paidAt?: string
  cancelledAt?: string
  failedAt?: string
  failure?: { reason?: string; pgCode?: string; pgMessage?: string }
  receiptUrl?: string
}

export function portoneConfigured(): boolean {
  return Boolean(process.env.PORTONE_API_SECRET)
}

export function portoneEnvironment(): 'test' | 'live' {
  return process.env.PORTONE_ENV === 'live' ? 'live' : 'test'
}

/** PortOne 결제 단건조회 */
export async function getPortOnePayment(
  paymentId: string,
): Promise<{ ok: true; payment: PortOnePayment } | { ok: false; status: number; debugCode: string }> {
  const secret = process.env.PORTONE_API_SECRET
  if (!secret) return { ok: false, status: 503, debugCode: 'portone_not_configured' }
  try {
    const r = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `PortOne ${secret}` },
    })
    if (!r.ok) {
      return { ok: false, status: r.status === 404 ? 404 : 502, debugCode: r.status === 404 ? 'payment_not_found' : `portone_http_${r.status}` }
    }
    const payment = (await r.json()) as PortOnePayment
    return { ok: true, payment }
  } catch {
    return { ok: false, status: 502, debugCode: 'portone_fetch_failed' }
  }
}

/** PortOne 상태 → 내부 status 매핑 (금액검증 전 단계의 1차 매핑) */
export function mapPortOneStatus(portoneStatus: string): string {
  switch (portoneStatus) {
    case 'PAID': return 'paid'
    case 'FAILED': return 'failed'
    case 'CANCELLED': return 'cancelled'
    case 'PARTIAL_CANCELLED': return 'partial_cancelled'
    case 'VIRTUAL_ACCOUNT_ISSUED': return 'exception' // 이번 카드결제 범위 밖 — 예외 기록
    case 'PAY_PENDING':
    case 'READY':
      return 'payment_requested'
    default: return 'payment_requested'
  }
}

/**
 * 웹훅 서명 검증 — 공식 @portone/server-sdk 의 Webhook.verify 만 사용 (fail-closed).
 * - 검증 성공한 요청만 처리, 실패는 signature_invalid(→ 401)
 * - SDK 를 로드할 수 없으면 sdk_unavailable(→ 5xx 설정 오류) — 검증 생략·수동 대체 없음
 * - rawBody 는 반드시 요청 원문 문자열이어야 합니다.
 */
export async function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
): Promise<{ ok: true } | { ok: false; debugCode: 'missing_webhook_headers' | 'signature_invalid' | 'sdk_unavailable' }> {
  const h = (k: string) => {
    const v = headers[k] ?? headers[k.toLowerCase()]
    return Array.isArray(v) ? v[0] : v
  }
  const webhookHeaders = {
    'webhook-id': h('webhook-id') ?? '',
    'webhook-timestamp': h('webhook-timestamp') ?? '',
    'webhook-signature': h('webhook-signature') ?? '',
  }
  if (!webhookHeaders['webhook-id'] || !webhookHeaders['webhook-timestamp'] || !webhookHeaders['webhook-signature']) {
    return { ok: false, debugCode: 'missing_webhook_headers' }
  }

  let Webhook: typeof import('@portone/server-sdk/webhook')
  try {
    Webhook = await import('@portone/server-sdk/webhook')
  } catch {
    return { ok: false, debugCode: 'sdk_unavailable' }
  }
  try {
    await Webhook.verify(secret, rawBody, webhookHeaders)
    return { ok: true }
  } catch {
    return { ok: false, debugCode: 'signature_invalid' }
  }
}
