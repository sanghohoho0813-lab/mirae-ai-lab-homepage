// /api/billing/complete — 서비스몰 카드결제(PortOne V2) 서버 검증 + 주문 기록. 자체 포함.
//   - GET  : health 체크 (env 설정 여부 확인)
//   - POST : { paymentId, slug, variantIdx?, buyer{name,phone,email?} }
//            → PortOne 결제 단건조회로 상태(PAID)·금액을 검증하고 business_orders 에 기록
//
// ⚠️ 금액의 '정답'은 이 파일의 PRICE_TABLE 입니다(클라이언트 금액은 신뢰하지 않음).
//    상품 가격을 바꾸면 src/data/businessPackages.ts 와 이 표를 함께 수정하세요.
//
// 필요 환경변수 (Vercel → Settings → Environment Variables, 등록 후 Redeploy):
//   PORTONE_API_SECRET        — (필수) PortOne V2 API Secret. 서버 전용, VITE_ 금지.
//   SUPABASE_SERVICE_ROLE_KEY — (필수) 주문 기록 저장용. 서버 전용.
//   VITE_SUPABASE_URL         — Supabase 프로젝트 URL (프론트와 공유)
//   (프론트) VITE_PORTONE_STORE_ID / VITE_PORTONE_CHANNEL_KEY — 결제창 호출용.

type VercelReq = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}
type VercelRes = {
  status: (code: number) => VercelRes
  json: (body: unknown) => void
  setHeader: (k: string, v: string) => void
}

// ── 가격표 (원) — 단일가는 number, 옵션 상품은 variantIdx 순서 배열 ──
const PRICE_TABLE: Record<string, number | number[]> = {
  'funding-consulting': 500000,
  'venture-innovation': 1990000,
  'venture-investment': 4990000,
  'responsive-homepage': 490000,
  'ai-ax-system': [1290000],
  'rnd-center': 1490000,
  'iso-certification': [1490000, 2780000, 3990000],
  'mainbiz-certification': 1990000,
  'innobiz-certification': 2490000,
}

const strip = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : ''

function expectedAmount(slug: string, variantIdx: number): number | null {
  const entry = PRICE_TABLE[slug]
  if (entry === undefined) return null
  if (Array.isArray(entry)) {
    const amount = entry[variantIdx]
    return typeof amount === 'number' ? amount : null
  }
  return entry
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store')

  const portoneSecret = process.env.PORTONE_API_SECRET
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      portoneConfigured: Boolean(portoneSecret),
      supabaseConfigured: Boolean(supabaseUrl && serviceKey),
    })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: '허용되지 않은 메서드입니다.', debugCode: 'method_not_allowed' })
  }
  if (!portoneSecret) {
    return res.status(503).json({
      ok: false,
      message: '결제 확인 시스템이 아직 연결되지 않았습니다. 상담으로 안내드릴게요.',
      debugCode: 'portone_not_configured',
    })
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<string, unknown>
  const paymentId = strip(body.paymentId, 80)
  const slug = strip(body.slug, 60)
  const variantIdx = Number.isInteger(body.variantIdx) ? (body.variantIdx as number) : 0
  const buyer = (typeof body.buyer === 'object' && body.buyer !== null ? body.buyer : {}) as Record<string, unknown>
  const buyerName = strip(buyer.name, 60)
  const buyerPhone = strip(buyer.phone, 30)
  const buyerEmail = strip(buyer.email, 120)

  if (!paymentId || !/^[A-Za-z0-9\-_]+$/.test(paymentId)) {
    return res.status(400).json({ ok: false, message: '결제 ID가 올바르지 않습니다.', debugCode: 'bad_payment_id' })
  }
  const expected = expectedAmount(slug, variantIdx)
  if (expected === null) {
    return res.status(400).json({ ok: false, message: '결제 대상 상품을 찾을 수 없습니다.', debugCode: 'unknown_product' })
  }

  // ── 1) PortOne 결제 단건조회로 실제 결제 상태·금액 확인 ──
  let payment: Record<string, unknown>
  try {
    const r = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `PortOne ${portoneSecret}` },
    })
    if (!r.ok) {
      const code = r.status === 404 ? 'payment_not_found' : `portone_${r.status}`
      return res.status(400).json({ ok: false, message: '결제 내역을 확인하지 못했습니다.', debugCode: code })
    }
    payment = (await r.json()) as Record<string, unknown>
  } catch {
    return res.status(502).json({ ok: false, message: '결제사 확인 요청에 실패했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'portone_fetch_failed' })
  }

  const status = String(payment.status ?? '')
  const amountObj = (typeof payment.amount === 'object' && payment.amount !== null ? payment.amount : {}) as Record<string, unknown>
  const paidTotal = Number(amountObj.total ?? NaN)
  const currency = String(payment.currency ?? 'KRW')

  if (status !== 'PAID') {
    return res.status(400).json({ ok: false, message: `결제가 완료 상태가 아닙니다. (${status || '상태 미확인'})`, debugCode: 'not_paid' })
  }
  if (paidTotal !== expected || currency !== 'KRW') {
    // 금액 불일치 — 위·변조 가능성. 주문 처리하지 않고 기록만 시도.
    return res.status(400).json({
      ok: false,
      message: '결제 금액이 상품 금액과 일치하지 않습니다. 고객센터로 문의해주세요.',
      debugCode: 'amount_mismatch',
    })
  }

  // ── 2) 주문 기록 (실패해도 결제 자체는 완료이므로 ok 반환 + recorded:false) ──
  let recorded = false
  if (supabaseUrl && serviceKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
      const orderName = String(payment.orderName ?? slug)
      const { error } = await admin.from('business_orders').upsert(
        {
          payment_id: paymentId,
          slug,
          variant_idx: variantIdx,
          order_name: orderName.slice(0, 200),
          amount: expected,
          currency: 'KRW',
          status: 'paid',
          buyer_name: buyerName || null,
          buyer_phone: buyerPhone || null,
          buyer_email: buyerEmail || null,
          paid_at: typeof payment.paidAt === 'string' ? payment.paidAt : new Date().toISOString(),
          receipt_url: typeof (payment as { receiptUrl?: unknown }).receiptUrl === 'string' ? (payment as { receiptUrl?: string }).receiptUrl : null,
        },
        { onConflict: 'payment_id' },
      )
      recorded = !error
    } catch {
      recorded = false
    }
  }

  return res.status(200).json({ ok: true, orderNo: paymentId, recorded })
}
