// 서버 상품 카탈로그 — 결제금액의 '정답'은 서버만 압니다.
// 1순위: Supabase billing_products (운영자가 금액·활성상태를 직접 관리)
// 2순위: 아래 LOCAL_CATALOG — ⚠️ PORTONE_ENV=test 에서만 허용되는 개발 편의 폴백.
//        live 에서는 billing_products 에 active 레코드가 없으면 결제를 차단합니다(코드 가격으로 진행 금지).
// ⚠️ 클라이언트가 보낸 금액은 어떤 경우에도 사용하지 않습니다. (businessPackages 화면가도 불신)
import type { SupabaseAdmin } from './supabaseAdmin.js'

export type ServerProduct = {
  productSlug: string
  optionId: string | null
  name: string
  optionName: string | null
  amount: number
  paymentType: 'one_time' | 'consultation'
  vatIncluded: boolean
  source: 'db' | 'local'
  /** 가격 버전 스냅샷 (billing_prices) — 결제 레코드에 저장해 이후 가격 변경과 분리 */
  priceId: string | null
  priceVersion: number | null
}

/** 상담 전용 — 결제 시도 자체를 차단 (ai-ax-system·ax-full-package 는 상담 견적 상품) */
export const CONSULT_ONLY_SLUGS = ['employment-subsidy', 'growth-roadmap-package', 'ai-ax-system', 'ax-full-package']

/** ⚠️ supabase/portone-one-time-payments.sql 시드와 반드시 같은 값 유지 (화면가=결제가) */
const LOCAL_CATALOG: Array<Omit<ServerProduct, 'source' | 'priceId' | 'priceVersion'>> = [
  { productSlug: 'funding-consulting', optionId: null, name: '정책자금 컨설팅', optionName: null, amount: 590000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'venture-innovation', optionId: null, name: '벤처인증 패키지 (혁신성장형)', optionName: null, amount: 1990000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'venture-investment', optionId: null, name: '벤처인증 패키지 (투자유형)', optionName: null, amount: 4990000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'responsive-homepage', optionId: null, name: '반응형 홈페이지 제작', optionName: null, amount: 990000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'rnd-center', optionId: null, name: '기업부설연구소 설립', optionName: null, amount: 1490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'mainbiz-certification', optionId: null, name: '메인비즈 인증', optionName: null, amount: 1990000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'innobiz-certification', optionId: null, name: '이노비즈 인증', optionName: null, amount: 2490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'iso-certification', optionId: 'iso-one', name: 'ISO 인증 패키지', optionName: 'ISO 1종', amount: 1490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'iso-certification', optionId: 'iso-two', name: 'ISO 인증 패키지', optionName: 'ISO 2종', amount: 2180000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'iso-certification', optionId: 'iso-three', name: 'ISO 인증 패키지', optionName: 'ISO 3종 패키지', amount: 3990000, paymentType: 'one_time', vatIncluded: true },
]

export type CatalogLookup =
  | { kind: 'ok'; product: ServerProduct }
  | { kind: 'consult_only' }
  | { kind: 'not_found' }
  /** live 환경에서 billing_products 조회 불가/미시드 — 결제 차단 (설정 오류) */
  | { kind: 'catalog_unavailable' }

/**
 * 상품·옵션으로 서버 결제 상품을 조회합니다.
 * - live: billing_products 의 active 레코드만 신뢰. 없거나 DB 오류면 catalog_unavailable(결제 차단).
 * - test: DB 우선, 미시드·오류 시 LOCAL_CATALOG 폴백 허용(개발 편의).
 */
export async function getServerProduct(
  admin: SupabaseAdmin | null,
  productSlug: string,
  optionId: string | null,
): Promise<CatalogLookup> {
  if (CONSULT_ONLY_SLUGS.includes(productSlug)) return { kind: 'consult_only' }

  const isLive = process.env.PORTONE_ENV === 'live'
  const normOption = optionId && optionId.trim() ? optionId.trim() : null
  const localExists = LOCAL_CATALOG.some((p) => p.productSlug === productSlug && p.optionId === normOption)

  // 1) DB (billing_products) — 금액은 billing_prices 최신 active 버전 우선, 없으면 amount(호환)
  if (admin) {
    try {
      let q = admin
        .from('billing_products')
        .select('id, product_slug, option_id, name, option_name, amount, kind, active, vat_included')
        .eq('product_slug', productSlug)
        .eq('kind', 'one_time')
        .eq('active', true)
      q = normOption === null ? q.is('option_id', null) : q.eq('option_id', normOption)
      const { data, error } = await q.maybeSingle()
      if (!error && data && typeof data.amount === 'number' && data.amount > 0) {
        // 가격 버전 조회 — effective 기간 필터는 코드에서 (신규 결제는 최신 active 가격)
        let priceId: string | null = null
        let priceVersion: number | null = null
        let amount: number = data.amount
        try {
          const { data: prices } = await admin
            .from('billing_prices')
            .select('id, price_version, amount, currency, effective_from, effective_to, active')
            .eq('billing_product_id', data.id)
            .eq('billing_interval', 'one_time')
            .eq('active', true)
            .order('price_version', { ascending: false })
            .limit(10)
          const nowMs = Date.now()
          const current = (prices ?? []).find((p: { effective_from?: string; effective_to?: string | null; amount?: number }) => {
            const from = p.effective_from ? new Date(p.effective_from).getTime() : 0
            const to = p.effective_to ? new Date(p.effective_to).getTime() : Infinity
            return from <= nowMs && nowMs < to && typeof p.amount === 'number' && p.amount > 0
          })
          if (current) {
            priceId = String(current.id)
            priceVersion = Number(current.price_version)
            amount = Number(current.amount)
          }
        } catch {
          // billing_prices 미시드/조회 실패 → billing_products.amount 호환 경로 유지
        }
        return {
          kind: 'ok',
          product: {
            productSlug,
            optionId: normOption,
            name: String(data.name),
            optionName: data.option_name ? String(data.option_name) : null,
            amount,
            paymentType: 'one_time',
            vatIncluded: data.vat_included !== false,
            source: 'db',
            priceId,
            priceVersion,
          },
        }
      }
      if (error) {
        // DB 오류 — live 는 차단, test 는 폴백
        if (isLive) return { kind: 'catalog_unavailable' }
      } else if (isLive) {
        // DB 정상 조회됐지만 행 없음 — live 에서는 코드 가격으로 진행 금지.
        // 알려진 상품(로컬 카탈로그 존재)이면 '미시드 설정 오류', 아니면 '없는 상품'.
        return localExists ? { kind: 'catalog_unavailable' } : { kind: 'not_found' }
      }
    } catch {
      if (isLive) return { kind: 'catalog_unavailable' }
    }
  } else if (isLive) {
    return { kind: 'catalog_unavailable' }
  }

  // 2) 로컬 카탈로그 폴백 — test 환경 전용
  const local = LOCAL_CATALOG.find((p) => p.productSlug === productSlug && p.optionId === normOption)
  if (local) return { kind: 'ok', product: { ...local, source: 'local', priceId: null, priceVersion: null } }
  return { kind: 'not_found' }
}
