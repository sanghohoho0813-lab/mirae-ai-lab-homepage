// 서비스몰형 상품 카드 — 카드 전체가 상세페이지 링크, 썸네일 우하단에 찜·장바구니 토글.
// 결제/상담은 상세페이지 상단 CTA 에서 진행. (/business-services · /saved 공용)
// 모바일 2열(2x2) 그리드 우선 — 좁은 폭에서도 글자가 잘리지 않게 기본 크기를 작게, sm 이상에서 확대.
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

export default function ProductCard({ pkg, rank }: { pkg: BusinessPackage; rank?: number }) {
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
    'grid h-8 w-8 place-items-center rounded-full shadow-md backdrop-blur transition-all duration-150 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-9 sm:w-9'

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

        {/* TOP 순위 배지 — 썸네일 좌상단(대표 상품 TOP N 에서만) */}
        {rank && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-lg bg-gradient-to-b from-amber-400 to-amber-500 px-2 py-1 font-black leading-none tracking-tight text-slate-900 shadow-md ring-1 ring-amber-300/50">
            <span className="text-[0.6rem] font-black sm:text-[0.68rem]">TOP</span>
            <span className="text-[0.95rem] sm:text-[1.1rem]">{rank}</span>
          </span>
        )}

        {/* 찜·장바구니 — 썸네일 우하단 미니 버튼(세로 배치, 좋아요 위) */}
        <div className="absolute bottom-2 right-2 flex flex-col items-center gap-1.5 sm:bottom-2.5 sm:right-2.5">
          <button
            type="button"
            onClick={onLike}
            aria-pressed={liked}
            aria-label={liked ? `${pkg.name} 좋아요 해제` : `${pkg.name} 좋아요`}
            title={liked ? '좋아요 해제' : '좋아요'}
            className={`${miniBtn} ${liked ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-500 hover:bg-white hover:text-rose-500'}`}
          >
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
              <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4.5 12.5l5 5 10-11" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17.5" cy="20" r="1.4" />
                <path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" />
                <path d="M13 7.5v4M11 9.5h4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {/* 카테고리 ↔ 대표상품/배지 */}
        <div className="flex items-center justify-between gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-bold sm:px-2.5 sm:py-1 sm:text-[0.82rem] ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.category}</span>
          {flagship ? (
            <span className="shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[0.72rem] font-black text-slate-900 sm:px-2.5 sm:py-1 sm:text-[0.82rem]">★ 대표</span>
          ) : (
            pkg.badge && <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-500 sm:inline">{pkg.badge}</span>
          )}
        </div>

        {/* 상품명 + 한줄 소개 */}
        <h3 className="mt-2 line-clamp-2 text-[1.02rem] font-extrabold leading-snug tracking-tight text-slate-900 sm:mt-3 sm:line-clamp-1 sm:text-[1.35rem]">{pkg.name}</h3>
        <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-slate-500 sm:mt-1.5 sm:text-[0.98rem]">{pkg.short}</p>

        {/* 가격 존 — 결제/상담 구분 배지 + 가격 강조 */}
        <div className="mt-2.5 sm:mt-3.5">
          {consult ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[0.72rem] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20 sm:px-2.5 sm:py-1 sm:text-[0.82rem]">
              <span aria-hidden>💬</span> 상담 후 견적
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.72rem] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/15 sm:px-2.5 sm:py-1 sm:text-[0.82rem]">
              <span aria-hidden>⚡</span> 바로 결제
            </span>
          )}
          <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2">
            <span className={`font-black tracking-tight ${consult ? 'text-[1.2rem] text-slate-700 sm:text-[1.6rem]' : flagship ? 'text-[1.35rem] text-amber-600 sm:text-[1.85rem]' : 'text-[1.35rem] text-slate-900 sm:text-[1.85rem]'}`}>{priceText}</span>
          </div>
          {pkg.priceHighlight && <p className="mt-1 line-clamp-1 text-[0.8rem] font-bold text-rose-600 sm:mt-1.5 sm:text-[0.9rem]">{formatKoreanMoney(pkg.priceHighlight)}</p>}
        </div>

        {/* 대표 혜택 — 스캔형 체크 리스트. 모바일 2개, sm 이상 3개 */}
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3 sm:mt-4 sm:space-y-2.5 sm:pt-4">
          {pkg.highlights.slice(0, 3).map((h, i) => (
            <li key={h} className={`flex items-center gap-2 text-[0.82rem] font-semibold text-slate-700 sm:gap-2.5 sm:text-[0.98rem] ${i === 2 ? 'hidden sm:flex' : ''}`}>
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full sm:h-5 sm:w-5 ${flagship ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`} aria-hidden>
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
