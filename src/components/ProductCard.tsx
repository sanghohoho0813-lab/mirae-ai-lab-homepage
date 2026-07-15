// 서비스몰형 상품 카드 — 카드 전체가 상세페이지 링크, 썸네일 우하단에 찜·장바구니 토글.
// 결제/상담은 상세페이지 상단 CTA 에서 진행. (/business-services · /saved 공용)
import { Link } from 'react-router-dom'
import BusinessServiceVisual from './BusinessServiceVisual'
import { categoryToneClass, packageBanner, type BusinessPackage } from '../data/businessPackages'
import { toggleCart, toggleLike, useSavedItems } from '../lib/savedItems'

// 카드 가격 표기 전용 — '59만원', '23만 7천원' 같은 한국어 축약 표기를 '590,000원' 콤마 표기로 변환.
// ⚠️ 표시(문자열) 변환일 뿐, 실제 결제 금액(pkg.amount / variants[].amount / 서버 카탈로그)과는 무관합니다.
export function formatKoreanMoney(text: string): string {
  return text
    .replace(/(\d[\d,]*)\s*만(?:\s*(\d+)\s*천)?\s*원/g, (_m, man: string, cheon?: string) => {
      const won = parseInt(man.replace(/,/g, ''), 10) * 10000 + (cheon ? parseInt(cheon, 10) * 1000 : 0)
      return `${won.toLocaleString('ko-KR')}원`
    })
    .replace(/(?<![\d,])(\d+)\s*천\s*원/g, (_m, cheon: string) => `${(parseInt(cheon, 10) * 1000).toLocaleString('ko-KR')}원`)
}

export default function ProductCard({ pkg }: { pkg: BusinessPackage }) {
  const b = packageBanner[pkg.id]
  const flagship = pkg.flagship
  const consult = pkg.priceType === 'consult'
  const priceText = formatKoreanMoney(pkg.price)
  const { likes, cart } = useSavedItems()
  const liked = likes.includes(pkg.slug)
  const inCart = cart.includes(pkg.slug)

  // 카드 전체가 Link 이므로 버튼은 내비게이션을 막고 토글만 수행
  const onLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike(pkg.slug)
  }
  const onCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCart(pkg.slug)
  }

  const miniBtn =
    'grid h-9 w-9 place-items-center rounded-full shadow-md backdrop-blur transition-all duration-150 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

  return (
    <Link
      to={`/business-services/${pkg.slug}`}
      aria-label={`${pkg.name} 자세히 보기`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        flagship
          ? 'border border-amber-300 shadow-sm shadow-amber-500/10 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15'
          : 'border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      {/* 썸네일 — 첫인상 전용(대표 카피·이미지). 16:10 컴팩트, 상단 고정 크롭 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <BusinessServiceVisual type={pkg.visualType} title={b.title} accent={b.accent} tag={pkg.category} imageSrc={pkg.imageSrc} alt={pkg.name} fit="cover" minimal />

        {/* 찜·장바구니 — 썸네일 우하단 미니 버튼 */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={onLike}
            aria-pressed={liked}
            aria-label={liked ? `${pkg.name} 좋아요 해제` : `${pkg.name} 좋아요`}
            title={liked ? '좋아요 해제' : '좋아요'}
            className={`${miniBtn} ${liked ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-500 hover:bg-white hover:text-rose-500'}`}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.7 0-3 .8-4 2.1a5.5 5.5 0 0 0-1-1.1A4.6 4.6 0 0 0 9.5 4 4.5 4.5 0 0 0 5 8.5c0 2.3 1.5 4 3 5.5l4 4 3.5-3.5z" transform="translate(0 .5)" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onCart}
            aria-pressed={inCart}
            aria-label={inCart ? `${pkg.name} 장바구니에서 빼기` : `${pkg.name} 장바구니에 담기`}
            title={inCart ? '장바구니에서 빼기' : '장바구니에 담기'}
            className={`${miniBtn} ${inCart ? 'bg-blue-600 text-white' : 'bg-white/90 text-slate-500 hover:bg-white hover:text-blue-600'}`}
          >
            {inCart ? (
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4.5 12.5l5 5 10-11" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17.5" cy="20" r="1.4" />
                <path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" />
                <path d="M13 7.5v4M11 9.5h4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* 카테고리 ↔ 대표상품/배지 */}
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[0.82rem] font-bold ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.category}</span>
          {flagship ? (
            <span className="shrink-0 rounded-full bg-amber-400 px-2.5 py-1 text-[0.82rem] font-black text-slate-900">★ 대표 상품</span>
          ) : (
            pkg.badge && <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-500">{pkg.badge}</span>
          )}
        </div>

        {/* 상품명 + 한줄 소개 */}
        <h3 className="mt-3 line-clamp-1 text-[1.35rem] font-extrabold leading-snug tracking-tight text-slate-900">{pkg.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.98rem] leading-relaxed text-slate-500">{pkg.short}</p>

        {/* 가격 존 — 결제/상담 구분 배지 + 가격 강조 */}
        <div className="mt-3.5">
          {consult ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[0.82rem] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20">
              <span aria-hidden>💬</span> 상담 후 견적
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.82rem] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
              <span aria-hidden>⚡</span> 바로 결제 가능
            </span>
          )}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight ${consult ? 'text-[1.6rem] text-slate-700' : flagship ? 'text-[1.85rem] text-amber-600' : 'text-[1.85rem] text-slate-900'}`}>{priceText}</span>
          </div>
          {pkg.priceHighlight && <p className="mt-1.5 line-clamp-1 text-[0.9rem] font-bold text-rose-600">{formatKoreanMoney(pkg.priceHighlight)}</p>}
        </div>

        {/* 대표 혜택 3가지 — SaaS 체크 리스트(스캔형) */}
        <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-center gap-2.5 text-[0.98rem] font-semibold text-slate-700">
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${flagship ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`} aria-hidden>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.4l2.4 2.4L9 3.2" />
                </svg>
              </span>
              <span className="line-clamp-1">{formatKoreanMoney(h)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
