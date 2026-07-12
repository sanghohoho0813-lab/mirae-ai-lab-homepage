// /api/portone/webhook — PortOne V2 웹훅 (버전 2024-04-25, application/json).
// 검증 순서:
//  1) raw body 확보 (bodyParser 비활성 → 스트림 직접 읽기)
//  2) PORTONE_WEBHOOK_SECRET 로 signature 검증 (@portone/server-sdk Webhook.verify)
//  3) storeId 일치 확인 (PORTONE_STORE_ID 설정 시)
//  4) ⚠️ 웹훅 body 의 상태·금액은 신뢰하지 않음 → PortOne 단건조회 재호출(reconcilePayment)
//  5) complete API 와 같은 reconcile 로직 → 순서가 뒤바뀌거나 중복 수신돼도 결과 동일
// 로그에는 이벤트 타입·paymentId 일부·처리결과만 남기고 구매자 개인정보·전체 body 는 남기지 않음.
import { getSupabaseAdmin } from '../_lib/supabaseAdmin'
import { verifyWebhookSignature, portoneConfigured } from '../_lib/portone'
import { logPaymentEvent, reconcilePayment, stripControl } from '../_lib/paymentReconcile'

export const config = { api: { bodyParser: false } }

type VercelReq = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
  on?: (event: string, cb: (chunk?: unknown) => void) => void
}
type VercelRes = { status: (code: number) => VercelRes; json: (body: unknown) => void; setHeader: (k: string, v: string) => void }

/** raw body 확보 — 스트림 우선, 이미 파싱된 경우 문자열/버퍼만 수용 */
async function readRawBody(req: VercelReq): Promise<string | null> {
  if (typeof req.body === 'string' && req.body.length > 0) return req.body
  if (req.body && Buffer.isBuffer(req.body)) return (req.body as Buffer).toString('utf8')
  if (typeof req.on === 'function') {
    try {
      const chunks: Uint8Array[] = []
      const raw = await new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timeout')), 10000)
        req.on!('data', (c) => chunks.push(Buffer.isBuffer(c) ? new Uint8Array(c as Buffer) : new Uint8Array(Buffer.from(String(c)))))
        req.on!('end', () => { clearTimeout(timer); resolve(Buffer.concat(chunks).toString('utf8')) })
        req.on!('error', () => { clearTimeout(timer); reject(new Error('stream_error')) })
      })
      if (raw.length > 0) return raw
    } catch { /* fallthrough */ }
  }
  // 이미 객체로 파싱돼 원문이 소실된 경우 — 서명 검증 불가능하므로 null (거부)
  return null
}

/** 처리 대상 트랜잭션 이벤트 (그 외 신규 이벤트는 안전하게 무시) */
const HANDLED_PREFIX = 'Transaction.'

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      webhookConfigured: Boolean(process.env.PORTONE_WEBHOOK_SECRET),
      portoneConfigured: portoneConfigured(),
      version: process.env.PORTONE_WEBHOOK_VERSION || '2024-04-25',
    })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, debugCode: 'method_not_allowed' })
  }

  const secret = process.env.PORTONE_WEBHOOK_SECRET
  if (!secret) {
    // 설정 오류를 명확히 반환 (PortOne 재시도 대상이 되도록 5xx)
    return res.status(503).json({ ok: false, debugCode: 'webhook_secret_not_configured' })
  }

  const rawBody = await readRawBody(req)
  const admin = await getSupabaseAdmin()

  if (!rawBody) {
    if (admin) await logPaymentEvent(admin, 'payment_webhook_rejected', null, 'webhook', { reason: 'raw_body_unavailable' })
    return res.status(400).json({ ok: false, debugCode: 'raw_body_unavailable' })
  }

  // ── 서명 검증 ──
  const verified = await verifyWebhookSignature(secret, rawBody, req.headers)
  if (!verified.ok) {
    if (admin) await logPaymentEvent(admin, 'payment_webhook_rejected', null, 'webhook', { reason: verified.debugCode })
    return res.status(401).json({ ok: false, debugCode: verified.debugCode ?? 'signature_invalid' })
  }

  let event: { type?: string; timestamp?: string; data?: { paymentId?: string; storeId?: string; transactionId?: string } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ ok: false, debugCode: 'bad_json' })
  }

  const type = stripControl(event.type, 60)
  const paymentId = stripControl(event.data?.paymentId, 80)
  const storeId = stripControl(event.data?.storeId, 80)

  if (admin) await logPaymentEvent(admin, 'payment_webhook_received', paymentId || null, 'webhook', { type })

  // storeId 확인 (설정된 경우)
  const expectedStore = process.env.PORTONE_STORE_ID
  if (expectedStore && storeId && storeId !== expectedStore) {
    if (admin) await logPaymentEvent(admin, 'payment_webhook_rejected', paymentId || null, 'webhook', { reason: 'store_mismatch', type })
    return res.status(400).json({ ok: false, debugCode: 'store_mismatch' })
  }

  // 결제 트랜잭션 이벤트가 아니거나 paymentId 없음 → 안전 무시 (200)
  if (!type.startsWith(HANDLED_PREFIX) || !paymentId) {
    if (admin) await logPaymentEvent(admin, 'payment_webhook_ignored', paymentId || null, 'webhook', { type })
    return res.status(200).json({ ok: true, ignored: true })
  }

  if (!admin) {
    return res.status(503).json({ ok: false, debugCode: 'supabase_not_configured' })
  }
  if (!portoneConfigured()) {
    return res.status(503).json({ ok: false, debugCode: 'portone_not_configured' })
  }

  await logPaymentEvent(admin, 'payment_webhook_verified', paymentId, 'webhook', { type })

  // ── 웹훅 body 를 신뢰하지 않고 PortOne 재조회로 동기화 (complete 와 동일 함수) ──
  const result = await reconcilePayment(admin, paymentId, 'webhook')
  if (!result.ok) {
    // 내부 주문이 없거나(테스트 콘솔 호출 등) 일시 오류 — 유형별로 응답
    if (result.debugCode === 'order_not_found' || result.debugCode === 'payment_not_found') {
      return res.status(200).json({ ok: true, ignored: true, debugCode: result.debugCode })
    }
    if (result.debugCode === 'amount_mismatch' || result.debugCode === 'store_mismatch') {
      // 기록은 완료됐고 재시도가 필요 없는 최종 상태 → 200
      return res.status(200).json({ ok: true, flagged: true })
    }
    // 일시 오류 → PortOne 재시도 유도
    return res.status(500).json({ ok: false, debugCode: result.debugCode })
  }

  return res.status(200).json({ ok: true, status: result.row.status })
}
