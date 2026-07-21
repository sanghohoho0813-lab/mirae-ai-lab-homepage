// 찜한 상품·장바구니 모아보기 — localStorage 기반(비회원 포함). 카드의 하트/장바구니 토글로 바로 제거 가능.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ProductCard from '../components/ProductCard'
import ConsultModal from '../components/ConsultModal'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../lib/consultApi'
import { businessPackages } from '../data/businessPackages'
import { useSavedItems } from '../lib/savedItems'

function bySlugs(slugs: string[]) {
  return slugs
    .map((slug) => businessPackages.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
}

function EmptyBox({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="text-[1.02rem] font-semibold text-slate-500">{label}</p>
      <Link
        to="/business-services"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-slate-700"
      >
        상품 둘러보기
      </Link>
    </div>
  )
}

export default function SavedItemsPage() {
  const { likes, cart } = useSavedItems()
  const likedItems = bySlugs(likes)
  const cartItems = bySlugs(cart)
  const [consultOpen, setConsultOpen] = useState(false)

  // 장바구니에 담긴 상품을 그대로 상담 신청 이메일에 실어 보냅니다.
  const cartContext: ConsultContextRow[] = cartItems.map((pkg, i) => ({
    label: `담은 상품 ${i + 1}`,
    value: `${pkg.name} (${pkg.price})`,
  }))

  useEffect(() => {
    document.title = '찜한 상품 · 장바구니 | 미래 AI 랩'
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      {/* 헤더 — 서비스몰과 동일 스타일 */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.82rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              to="/business-services"
              className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[0.95rem] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
            >
              ← 서비스몰로
            </Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">찜한 상품 · 장바구니</h1>
        <p className="mt-2 text-[0.98rem] text-slate-500">카드의 ♥ · 장바구니 버튼으로 언제든 추가·제거할 수 있어요.</p>

        {/* 장바구니 */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17.5" cy="20" r="1.4" />
                <path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" />
              </svg>
            </span>
            장바구니 <span className="text-blue-600">{cartItems.length}</span>
          </h2>
          {cartItems.length === 0 ? (
            <div className="mt-4"><EmptyBox label="장바구니가 비어 있어요. 마음에 드는 서비스를 담아보세요." /></div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {cartItems.map((pkg) => (
                  <ProductCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              {/* 담은 상품 전체로 상담 신청 — 그대로 지메일 접수 */}
              <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.98rem] font-semibold text-slate-700">
                  담은 <span className="text-blue-600">{cartItems.length}개</span> 상품으로 한 번에 상담 신청할 수 있어요.
                </p>
                <button
                  type="button"
                  onClick={() => setConsultOpen(true)}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-blue-700"
                >
                  담은 상품 상담 신청하기 →
                </button>
              </div>
            </>
          )}
        </section>

        {/* 찜(좋아요) */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500 text-white" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.7 0-3 .8-4 2.1a5.5 5.5 0 0 0-1-1.1A4.6 4.6 0 0 0 9.5 4 4.5 4.5 0 0 0 5 8.5c0 2.3 1.5 4 3 5.5l4 4 3.5-3.5z" />
              </svg>
            </span>
            좋아요 <span className="text-rose-500">{likedItems.length}</span>
          </h2>
          {likedItems.length === 0 ? (
            <div className="mt-4"><EmptyBox label="아직 좋아요한 상품이 없어요." /></div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {likedItems.map((pkg) => (
                <ProductCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </section>
      </main>

      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="장바구니"
        heading="담은 상품 상담 신청"
        intro="담아두신 상품 목록을 그대로 담당자에게 전달합니다. 연락처만 남겨주시면 빠르게 안내드릴게요."
        topicGroups={CONSULT_TOPIC_GROUPS}
        showContactMethod
        showCompanyFields
        contextRows={cartContext}
      />

      <LegalFooter />
    </div>
  )
}
