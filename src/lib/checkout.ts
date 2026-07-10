// 서비스몰 카드결제 — PortOne(포트원) V2 브라우저 SDK + 서버 검증.
// 흐름: requestCardPayment() → PortOne 결제창 → 성공 시 /api/billing/complete 로 서버 검증·주문 기록.
// 금액은 서버(api/billing/complete.ts)의 가격표가 '정답'이며, 불일치 결제는 서버가 거부합니다.
// 모바일 등 리디렉션 방식 결제는 redirectUrl 로 돌아온 뒤 completePayment() 로 마무리합니다.
import * as PortOne from '@portone/browser-sdk/v2'
import type { BusinessPackage } from '../data/businessPackages'

export type BuyerInfo = { name: string; phone: string; email?: string }

export type CheckoutResult =
  | { ok: true; orderNo: string; recorded: boolean }
  | { ok: false; code: string; message: string }

const STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID as string | undefined
const CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY as string | undefined

/** 프론트 결제 환경(스토어·채널 키)이 설정되어 있는지 */
export function paymentConfigured(): boolean {
  return Boolean(STORE_ID && CHANNEL_KEY)
}

/** 상품·옵션으로 결제 금액 결정 (consult 상품은 null) */
export function resolveAmount(pkg: BusinessPackage, variantIdx: number): { amount: number; variantLabel?: string } | null {
  if (pkg.priceType === 'consult') return null
  if (pkg.variants && pkg.variants.length > 0) {
    const v = pkg.variants[Math.min(variantIdx, pkg.variants.length - 1)]
    return { amount: v.amount, variantLabel: v.label }
  }
  if (typeof pkg.amount === 'number' && pkg.amount > 0) return { amount: pkg.amount }
  return null
}

export const formatKrw = (n: number) => `${n.toLocaleString('ko-KR')}원`

function newPaymentId(): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `mirae-${Date.now().toString(36)}-${rand}`
}

/** 결제 완료 서버 검증 + 주문 기록 (리디렉션 복귀 시에도 사용) */
export async function completePayment(input: {
  paymentId: string
  slug: string
  variantIdx: number
  buyer?: BuyerInfo
}): Promise<CheckoutResult> {
  try {
    const res = await fetch('/api/billing/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = (await res.json().catch(() => null)) as
      | { ok: boolean; orderNo?: string; recorded?: boolean; message?: string; debugCode?: string }
      | null
    if (!data) return { ok: false, code: 'bad_response', message: '결제 확인 응답을 읽지 못했습니다. 잠시 후 다시 시도해주세요.' }
    if (!data.ok) return { ok: false, code: data.debugCode ?? 'verify_failed', message: data.message ?? '결제 확인에 실패했습니다.' }
    return { ok: true, orderNo: data.orderNo ?? input.paymentId, recorded: data.recorded !== false }
  } catch {
    return { ok: false, code: 'network', message: '네트워크 문제로 결제 확인에 실패했습니다. 결제가 되었다면 중복 결제하지 마시고 문의해주세요.' }
  }
}

/**
 * 카드결제 요청 (PortOne 결제창).
 * 반환: ok=true 결제·검증 완료 / ok=false 사용자 취소·실패.
 * 모바일 리디렉션 환경에서는 이 함수가 리턴되지 않고 redirectUrl 로 이동합니다.
 */
export async function requestCardPayment(input: {
  pkg: BusinessPackage
  variantIdx: number
  buyer: BuyerInfo
}): Promise<CheckoutResult> {
  if (!STORE_ID || !CHANNEL_KEY) {
    return { ok: false, code: 'not_configured', message: '카드결제 시스템 연결이 아직 완료되지 않았습니다.' }
  }
  const resolved = resolveAmount(input.pkg, input.variantIdx)
  if (!resolved) return { ok: false, code: 'no_amount', message: '이 상품은 상담 후 금액이 정해지는 상품입니다.' }

  const paymentId = newPaymentId()
  const orderName = resolved.variantLabel ? `${input.pkg.name} — ${resolved.variantLabel}` : input.pkg.name
  // 리디렉션 복귀 대비: 상세페이지로 slug·옵션을 담아 돌아오게 함 (PortOne 이 paymentId 등을 쿼리로 붙여줌)
  const redirectUrl = `${window.location.origin}/business-services/${input.pkg.slug}?variantIdx=${input.variantIdx}`

  let response: Awaited<ReturnType<typeof PortOne.requestPayment>>
  try {
    response = await PortOne.requestPayment({
      storeId: STORE_ID,
      channelKey: CHANNEL_KEY,
      paymentId,
      orderName,
      totalAmount: resolved.amount,
      currency: 'KRW',
      payMethod: 'CARD',
      customer: {
        fullName: input.buyer.name,
        phoneNumber: input.buyer.phone,
        email: input.buyer.email || undefined,
      },
      redirectUrl,
    })
  } catch (e) {
    return { ok: false, code: 'sdk_error', message: e instanceof Error ? e.message : '결제창을 여는 중 문제가 발생했습니다.' }
  }

  if (!response) return { ok: false, code: 'no_response', message: '결제 응답을 받지 못했습니다.' }
  if (response.code !== undefined && response.code !== null) {
    // 사용자가 창을 닫은 경우 등
    return { ok: false, code: String(response.code), message: response.message ?? '결제가 완료되지 않았습니다.' }
  }

  return completePayment({ paymentId: response.paymentId ?? paymentId, slug: input.pkg.slug, variantIdx: input.variantIdx, buyer: input.buyer })
}
