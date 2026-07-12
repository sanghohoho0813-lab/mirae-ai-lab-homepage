// 서버 상품 카탈로그 — 결제금액의 '정답'은 서버만 압니다.
// 1순위: Supabase billing_products (운영자가 금액·활성상태를 직접 관리)
// 2순위: 아래 LOCAL_CATALOG (SQL 미실행·DB 장애 시 폴백. 시드값과 동일하게 유지할 것)
// ⚠️ 클라이언트가 보낸 금액은 어떤 경우에도 사용하지 않습니다.
import type { SupabaseAdmin } from './supabaseAdmin'

export type ServerProduct = {
  productSlug: string
  optionId: string | null
  name: string
  optionName: string | null
  amount: number
  paymentType: 'one_time' | 'consultation'
  vatIncluded: boolean
  source: 'db' | 'local'
}

/** 상담 전용 — 결제 시도 자체를 차단 */
export const CONSULT_ONLY_SLUGS = ['employment-subsidy', 'growth-roadmap-package']

/** ⚠️ supabase/portone-one-time-payments.sql 시드와 반드시 같은 값 유지 */
const LOCAL_CATALOG: Array<Omit<ServerProduct, 'source'>> = [
  { productSlug: 'funding-consulting', optionId: null, name: '정책자금 컨설팅', optionName: null, amount: 550000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'venture-innovation', optionId: null, name: '벤처인증 패키지 (혁신성장형)', optionName: null, amount: 1990000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'venture-investment', optionId: null, name: '벤처인증 패키지 (투자유형)', optionName: null, amount: 5000000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'responsive-homepage', optionId: null, name: '반응형 홈페이지 제작', optionName: null, amount: 490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'rnd-center', optionId: null, name: '기업부설연구소 설립', optionName: null, amount: 1490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'mainbiz-certification', optionId: null, name: '메인비즈 인증', optionName: null, amount: 1990000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'innobiz-certification', optionId: null, name: '이노비즈 인증', optionName: null, amount: 2490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'ai-ax-system', optionId: 'ax-only', name: 'AI 기반 회사 운영시스템 구축', optionName: 'AX 시스템 구축', amount: 1290000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'ai-ax-system', optionId: 'ax-with-homepage', name: 'AI 기반 회사 운영시스템 구축', optionName: 'AX 시스템 + 반응형 홈페이지', amount: 1490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'iso-certification', optionId: 'iso-one', name: 'ISO 인증 패키지', optionName: 'ISO 1종', amount: 1490000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'iso-certification', optionId: 'iso-two', name: 'ISO 인증 패키지', optionName: 'ISO 2종', amount: 2180000, paymentType: 'one_time', vatIncluded: true },
  { productSlug: 'iso-certification', optionId: 'iso-three', name: 'ISO 인증 패키지', optionName: 'ISO 3종 패키지', amount: 3990000, paymentType: 'one_time', vatIncluded: true },
]

/**
 * 상품·옵션으로 서버 결제 상품을 조회합니다.
 * - 상담 전용 상품 → { consultOnly: true } (결제 차단용)
 * - 미존재/비활성 → null
 */
export async function getServerProduct(
  admin: SupabaseAdmin | null,
  productSlug: string,
  optionId: string | null,
): Promise<{ product: ServerProduct | null; consultOnly: boolean }> {
  if (CONSULT_ONLY_SLUGS.includes(productSlug)) return { product: null, consultOnly: true }

  const normOption = optionId && optionId.trim() ? optionId.trim() : null

  // 1) DB (billing_products) 우선
  if (admin) {
    try {
      let q = admin
        .from('billing_products')
        .select('product_slug, option_id, name, option_name, amount, kind, active, vat_included')
        .eq('product_slug', productSlug)
        .eq('kind', 'one_time')
        .eq('active', true)
      q = normOption === null ? q.is('option_id', null) : q.eq('option_id', normOption)
      const { data, error } = await q.maybeSingle()
      if (!error && data && typeof data.amount === 'number' && data.amount > 0) {
        return {
          consultOnly: false,
          product: {
            productSlug,
            optionId: normOption,
            name: String(data.name),
            optionName: data.option_name ? String(data.option_name) : null,
            amount: data.amount,
            paymentType: 'one_time',
            vatIncluded: data.vat_included !== false,
            source: 'db',
          },
        }
      }
      // DB 조회는 됐지만 행이 없음 → 로컬 폴백 시도(SQL 미시드 환경 대비)
    } catch {
      // DB 오류 → 로컬 폴백
    }
  }

  // 2) 로컬 카탈로그 폴백
  const local = LOCAL_CATALOG.find((p) => p.productSlug === productSlug && p.optionId === normOption)
  if (local) return { product: { ...local, source: 'local' }, consultOnly: false }
  return { product: null, consultOnly: false }
}
