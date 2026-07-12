// PortOne V2 서버 연동 — 결제 단건조회 + 웹훅 서명 검증.
// 결제 상태·금액의 최종 신뢰는 항상 GET https://api.portone.io/payments/{paymentId} 재조회 결과입니다.
// (웹훅 body 의 상태·금액은 서명이 검증되어도 그대로 신뢰하지 않습니다)
import crypto from 'node:crypto'

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
 * 웹훅 서명 검증 — @portone/server-sdk(Webhook.verify) 우선, 로드 실패 시
 * Standard Webhooks 규격(HMAC-SHA256) 수동 검증으로 폴백.
 * rawBody 는 반드시 원문 문자열이어야 합니다.
 */
export async function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
): Promise<{ ok: boolean; debugCode?: string }> {
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

  // 1) 공식 SDK
  try {
    const Webhook = await import('@portone/server-sdk/webhook')
    try {
      await Webhook.verify(secret, rawBody, webhookHeaders)
      return { ok: true }
    } catch {
      return { ok: false, debugCode: 'signature_invalid' }
    }
  } catch {
    // SDK 로드 실패 → 수동 검증 폴백
  }

  // 2) Standard Webhooks 수동 검증
  try {
    const ts = Number(webhookHeaders['webhook-timestamp'])
    if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
      return { ok: false, debugCode: 'timestamp_out_of_tolerance' }
    }
    const secretBytes = new Uint8Array(Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64'))
    const signedContent = `${webhookHeaders['webhook-id']}.${webhookHeaders['webhook-timestamp']}.${rawBody}`
    const expected = crypto.createHmac('sha256', secretBytes).update(signedContent, 'utf8').digest('base64')
    const provided = String(webhookHeaders['webhook-signature'])
      .split(' ')
      .map((s) => (s.includes(',') ? s.split(',')[1] : s))
      .filter(Boolean)
    for (const sig of provided) {
      const a = new Uint8Array(Buffer.from(expected))
      const b = new Uint8Array(Buffer.from(sig))
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) return { ok: true }
    }
    return { ok: false, debugCode: 'signature_invalid' }
  } catch {
    return { ok: false, debugCode: 'verify_error' }
  }
}
