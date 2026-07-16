// 서비스몰형 상품 카드 — 카드 전체가 상세페이지 링크. 찜·장바구니는 상품명 위(우측),
// 결제/상담은 상세페이지 상단 CTA 에서 진행. 썸네일은 문구가 가려지지 않게 오버레이 없이 깨끗하게.
// 모바일 2열(2x2) 그리드 우선 — 좁은 폭에서도 글자가 잘리지 않게 기본 크기를 작게, sm 이상에서 확대.
import { useEffect, useState } from 'react'
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

const prefersReduce = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function ProductCard({ pkg }: { pkg: BusinessPackage }) {
  const b = packageBanner[pkg.id]
  const flagship = pkg.flagship
  const priceText = formatKoreanMoney(pkg.price)
  const { likes, cart } = useSavedItems()
  const liked = likes.includes(pkg.slug)
  const inCart = cart.includes(pkg.slug)
  const [likePulse, setLikePulse] = useState(false)
  const [cartPulse, setCartPulse] = useState(false)

  // 활성화(담기/좋아요 켜짐) 순간에만 짧은 팝 모션 재생. 애니메이션 종료 안전망으로 타이머 리셋.
  useEffect(() => {
    if (!likePulse) return
    const t = setTimeout(() => setLikePulse(false), 480)
    return () => clearTimeout(t)
  }, [likePulse])
  useEffect(() => {
    if (!cartPulse) return
    const t = setTimeout(() => setCartPulse(false), 480)
    return () => clearTimeout(t)
  }, [cartPulse])

  // 카드 전체가 Link 이므로 버튼은 내비게이션을 막고 토글만 수행
  const onLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!liked && !prefersReduce()) setLikePulse(true)
    toggleLike(pkg.slug)
  }
  const onCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inCart && !prefersReduce()) setCartPulse(true)
    toggleCart(pkg.slug)
  }

  const miniBtn =
    'relative grid h-8 w-8 place-items-center rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500'

  return (
    <Link
      to={`/business-services/${pkg.slug}`}
      aria-label={`${pkg.name} 자세히 보기`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        flagship
          ? 'border border-amber-300 shadow-sm shadow-amber-500/10 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15'
          : 'border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      {/* 썸네일 — 오버레이 없이 배너 문구가 온전히 보이도록(확대·크롭 없음) */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <BusinessServiceVisual type={pkg.visualType} title={b.title} accent={b.accent} tag={pkg.categoryLabel ?? pkg.category} imageSrc={pkg.imageSrc} alt={pkg.name} fit="cover" minimal />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {/* 카테고리(좌) ↔ 찜·장바구니(우, 상품명 위) */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-bold sm:px-2.5 sm:py-1 sm:text-[0.82rem] ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.categoryLabel ?? pkg.category}</span>
            {!flagship && pkg.badge && <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-500 sm:inline">{pkg.badge}</span>}
          </div>
          <div className="-mr-1 -mt-0.5 flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={onLike}
              aria-pressed={liked}
              aria-label={liked ? `${pkg.name} 좋아요 해제` : `${pkg.name} 좋아요`}
              title={liked ? '좋아요 해제' : '좋아요'}
              className={`${miniBtn} ${liked ? 'bg-rose-50 text-rose-500' : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'}`}
            >
              {likePulse && <span aria-hidden className="animate-save-burst pointer-events-none absolute inset-0 rounded-full bg-rose-400/40" />}
              <svg viewBox="0 0 24 24" className={`h-[18px] w-[18px] ${likePulse ? 'animate-icon-pop' : ''}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.7 0-3 .8-4 2.1a5.5 5.5 0 0 0-1-1.1A4.6 4.6 0 0 0 9.5 4 4.5 4.5 0 0 0 5 8.5c0 2.3 1.5 4 3 5.5l4 4 3.5-3.5z" transform="translate(0 .5)" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onCart}
              aria-pressed={inCart}
              aria-label={inCart ? `${pkg.name} 장바구니에서 빼기` : `${pkg.name} 장바구니에 담기`}
              title={inCart ? '장바구니에서 빼기' : '장바구니에 담기'}
              className={`${miniBtn} ${inCart ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'}`}
            >
              {cartPulse && <span aria-hidden className="animate-save-burst pointer-events-none absolute inset-0 rounded-full bg-blue-400/40" />}
              {inCart ? (
                <svg viewBox="0 0 24 24" className={`h-[18px] w-[18px] ${cartPulse ? 'animate-icon-pop' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

        {/* 대표 상품 라벨 — 상품명 위 (썸네일 대신 콘텐츠 영역에 배치) */}
        {flagship && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.68rem] font-black text-amber-700 sm:text-[0.74rem]">
            <span aria-hidden>★</span> 대표 상품
          </span>
        )}

        {/* 상품명 + 한줄 소개 */}
        <h3 className={`line-clamp-2 text-[1.02rem] font-extrabold leading-snug tracking-tight text-slate-900 sm:line-clamp-1 sm:text-[1.35rem] ${flagship ? 'mt-1' : 'mt-2 sm:mt-3'}`}>{pkg.name}</h3>
        <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-slate-500 sm:mt-1.5 sm:text-[0.98rem]">{pkg.short}</p>

        {/* 가격 존 — 가격 강조 (결제/상담 구분 배지는 노출하지 않음) */}
        <div className="mt-2.5 sm:mt-3.5">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight ${pkg.priceType === 'consult' ? 'text-[1.2rem] text-slate-700 sm:text-[1.6rem]' : flagship ? 'text-[1.35rem] text-amber-600 sm:text-[1.85rem]' : 'text-[1.35rem] text-slate-900 sm:text-[1.85rem]'}`}>{priceText}</span>
          </div>
          {pkg.priceHighlight && <p className="mt-1 text-[0.8rem] font-bold leading-snug text-rose-600 sm:mt-1.5 sm:text-[0.9rem]">{formatKoreanMoney(pkg.priceHighlight)}</p>}
        </div>

        {/* 대표 혜택 3가지 — 스캔형 체크 리스트(잘림 없이 최대 2줄까지 표시) */}
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3 sm:mt-4 sm:space-y-2.5 sm:pt-4">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 text-[0.82rem] font-semibold leading-snug text-slate-700 sm:gap-2.5 sm:text-[0.98rem]">
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full sm:h-5 sm:w-5 ${flagship ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`} aria-hidden>
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.4l2.4 2.4L9 3.2" />
                </svg>
              </span>
              <span>{formatKoreanMoney(h)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
