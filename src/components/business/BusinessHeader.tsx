// 대표님용 페이지(홈 · AX 상세 안내)가 함께 쓰는 헤더.
// 헤더는 폭이 빠듯해 한 번 어긋나면 가로 스크롤이 생기므로, 두 페이지가 같은 코드를 쓰게 한다.
import { Link } from 'react-router-dom'
import BrandLogo from '../BrandLogo'
import HeaderAccount from '../account/HeaderAccount'
import { useSavedItems } from '../../lib/savedItems'

export type BusinessNavLink = { href: string; label: string }

export default function BusinessHeader({
  navLinks,
  historyCount,
  isPreviewEmbedded,
  onOpenPreview,
}: {
  navLinks: readonly BusinessNavLink[]
  historyCount: number
  isPreviewEmbedded: boolean
  onOpenPreview: () => void
}) {
  const { cart } = useSavedItems()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-5 lg:gap-6">
        {/* 태그라인은 그대로 두되, 모바일에서 글자·자간을 줄여 햄버거·미리보기 버튼과 겹치지 않게 한다 */}
        {/* 아주 좁은 화면(320~360px)에서는 남은 폭만큼만 차지하고 태그라인이 …로 줄어든다 */}
        <BrandLogo
          to="/business-services"
          className="min-w-0 max-w-[calc(100vw-148px)] shrink-0 sm:max-w-none"
          imgClassName="h-9 max-w-[132px] sm:h-11 sm:max-w-[196px] lg:h-12 lg:max-w-[224px]"
          taglineClassName="text-[0.5rem]! tracking-[0.13em]! sm:text-[0.7rem]! sm:tracking-[0.16em]!"
        />
        {/* 헤더 폭이 빠듯해 xl 이상에서 핵심 3개만 보인다. 나머지는 햄버거 메뉴에 있다. */}
        <nav className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-[1.02rem] font-medium text-slate-600 xl:flex">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className="transition-colors hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-2.5">
          {historyCount > 0 && (
            <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-[#F3D9C8] bg-[#F3D9C8]/55 px-3 py-1.5 text-[1.0rem] font-bold text-[#171B20] transition-colors hover:bg-[#F3D9C8] xl:inline-flex">
              내 진단 결과 <b>{historyCount}</b>
            </Link>
          )}
          {cart.length > 0 && (
            <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
              <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
            </Link>
          )}
          {/* 헤더는 폭이 빠듯해 Primary 라벨을 줄여 쓴다(1280px 에서 우측 그룹이 밀려 가로 스크롤이 생겼던 것 방지) */}
          <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-[#D47A4A] px-4 py-2 text-[1.2rem] sm:text-[1.05rem] font-semibold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] sm:inline-flex">AX 가능성 진단</Link>
          {/* 화면 미리보기 — 떠다니지 않고 헤더 안, 햄버거 옆에 둔다 */}
          {!isPreviewEmbedded && (
            <button
              type="button"
              onClick={onOpenPreview}
              aria-label="PC·스마트폰 화면 미리보기"
              title="PC ↔ 스마트폰 화면 미리보기"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#D47A4A]/40 text-[#171B20] transition-colors hover:bg-[#F3D9C8]/50 xl:h-auto xl:w-auto xl:px-2.5 xl:py-1.5 xl:text-[0.88rem] xl:font-bold"
            >
              {/* xl 미만은 아이콘만 — 모바일은 로고 태그라인 자리를, PC 는 헤더 폭을 아낀다 */}
              <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] xl:hidden" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="1.5" y="4" width="13" height="9.5" rx="1.4" />
                <path d="M5 17h6" />
                <rect x="16.5" y="9" width="6" height="11" rx="1.4" />
              </svg>
              <span className="hidden xl:inline">PC ↔ 스마트폰</span>
            </button>
          )}
          <HeaderAccount variant="business" />
        </div>
      </div>
    </header>
  )
}
