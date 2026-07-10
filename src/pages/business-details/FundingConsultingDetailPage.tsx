// 정책자금 컨설팅 — 전용 상세페이지 (한국형 이커머스 "긴 세로 상세" 스타일).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 상단 구매영역(카페24형) + 긴 세로 배너 상세 + 예시 사례(추후 실제 데이터로 교체).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../../components/BusinessInquiryForm'
import PublicMenuDrawer from '../../components/PublicMenuDrawer'
import FundingCasesSection from '../../components/FundingCasesSection'
import { getPackageBySlug } from '../../data/businessPackages'

const pkg = getPackageBySlug('funding-consulting')!
const IMG = '/assets/business-services/funding-consulting.png'
const EBOOK_IMG = '/assets/business-services/ebook-3set.webp'

// 할인 표기 (정가 100만원 → 판매가 50만원)
const LIST_PRICE = '100만원'
const SALE_PRICE = pkg.price // '50만원'
const DISCOUNT_RATE = '50%'

const band = 'px-5 py-16 sm:py-24'
const inner = 'mx-auto max-w-[720px]'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-slate-900 sm:text-[2.7rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const pains = [
  '은행에서는 거절당했는데, 정책자금은 가능할 수도 있다던데… 어디서부터 봐야 하죠?',
  '믿을 만한 업체가 어디인지 모르겠어요',
  '수수료가 너무 비싸요. 조금만 도움받으면 스스로 할 수 있을 것 같은데…',
  '정책자금 종류가 너무 많아서 뭐가 뭔지 모르겠어요',
  '대출 금리를 조금이라도 낮추고 싶어요',
  '운전자금이 급한데, 어디서부터 봐야 할지 모르겠어요',
]

// 믿을 수 있는 이유 (과장 없는 정성 표현)
const reasons = ['정책자금·인증 실무 경험 5년 이상', '기업 상황에 맞춘 맞춤 진단', '신청 전략·준비서류까지 안내']

// 미루면 잃는 것 (적당한 긴장 — 조작 통계·과도한 협박 금지)
const losses = [
  { icon: '⏳', t: '정책자금 예산은 소진되면 끝입니다', d: '보통 8월부터 예산이 눈에 띄게 줄고, 12월엔 거의 남지 않습니다. 시기를 놓쳤다면 다음 연도 예산을 미리 준비해 두어야 합니다.' },
  { icon: '💸', t: '높은 금리로 이자가 불어나고 있습니다', d: '방향을 몰라 고금리 대출로 버티는 동안, 금리 차이만큼의 이자가 매달 쌓여 갑니다.' },
  { icon: '🚪', t: '경쟁사는 이미 활용하고 있습니다', d: '비슷한 조건의 회사가 정책자금으로 설비와 인력에 투자하는 동안, 격차는 매달 벌어집니다.' },
]

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

export default function FundingConsultingDetailPage() {
  const [showBar, setShowBar] = useState(false)
  const [payNotice, setPayNotice] = useState(false)

  function handleBuy() {
    setPayNotice(true)
    scrollToId('apply')
  }

  useEffect(() => {
    document.title = '정책자금 컨설팅 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const BuyButtons = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) => (
    <>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={handleBuy}
          className="flex flex-1 items-center justify-center rounded-xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
        >
          바로 구매하기
        </button>
        <button
          type="button"
          onClick={handleBuy}
          aria-label="장바구니"
          className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-4 font-bold transition-colors ${
            variant === 'dark' ? 'border-white/25 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CartIcon />
        </button>
      </div>
      <button
        type="button"
        onClick={() => scrollToId('apply')}
        className={`mt-3 text-sm font-semibold underline underline-offset-4 transition-colors ${
          variant === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        또는 무료 상담 신청하기 →
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-white pb-24 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">서비스몰 홈</Link>
            <button type="button" onClick={handleBuy} className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
              바로 구매
            </button>
            <PublicMenuDrawer />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">자금·지원금</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">정책자금 컨설팅</span>
        </div>
      </div>

      {/* ── 상단 구매영역 (카페24형) ───────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[900px] gap-7 px-5 py-8 sm:grid-cols-[minmax(0,340px)_1fr] sm:py-10">
          <div className="relative aspect-[3/2] self-start overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={IMG} alt="정책자금 컨설팅" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/15">자금·지원금</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">리뷰 준비중</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">정책자금 컨설팅</h1>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">운전자금·시설자금 가능성 진단부터 신청 전략·준비서류까지</p>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-md bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900">{DISCOUNT_RATE} 할인</span>
              <span className="text-sm font-medium text-slate-400 line-through">정가 {LIST_PRICE}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-end gap-x-2.5 gap-y-1">
              <span className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{SALE_PRICE}</span>
              <span className="pb-1 text-xl font-black leading-tight text-red-600 sm:pb-1.5 sm:text-2xl">+ 성공수수료 없음</span>
            </div>
            <p className="mt-1.5 text-base font-black text-red-600">업계 평균 성공수수료 5~7% → 미래 AI 랩은 0원</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-blue-600"><span aria-hidden>💳</span> 카드 무이자 할부 가능</p>
            <ul className="mt-3 space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-base font-semibold text-slate-700 ring-1 ring-inset ring-slate-100">
              <li className="flex items-center gap-1.5 font-black text-red-600"><span aria-hidden>🚫</span> 성공수수료 없음 — 업계 평균 5~7%</li>
              <li className="flex items-center gap-1.5"><span aria-hidden>🎁</span> 23만 7천원 상당 전자책 3종 증정</li>
            </ul>

            <div className="mt-5">
              <BuyButtons variant="light" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 여기서부터 긴 세로 상세 ───────────────────────────── */}

      {/* Hero banner */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>정책자금 컨설팅</p>
          <h2 className={bigHead}>
            혼자 알아보기엔<br />정책자금은 <span className="text-slate-400">너무 복잡합니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            그래서 <b className="text-blue-600">가능성 진단부터</b> 시작합니다.<br />
            운전자금·시설자금, 지금 우리 회사가 <b className="text-slate-900">뭐부터 봐야 하는지</b> 정리해 드립니다.
          </p>
          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="relative aspect-[3/2]">
              <img src={IMG} alt="정책자금 컨설팅" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <span className="rounded-md bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900">{DISCOUNT_RATE}</span>
              <span className="text-sm font-medium text-slate-400 line-through">{LIST_PRICE}</span>
              <span className="text-3xl font-black tracking-tight text-slate-900">{SALE_PRICE}</span>
            </div>
            <p className="mt-2 text-base font-black text-red-600">+ 성공수수료 없음 (업계 평균 5~7%)</p>
          </div>
        </div>
      </section>

      {/* 공감 (이런 고민) */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-4xl">🤔</div>
          <p className={kicker}>이런 고민, 있으셨죠?</p>
          <h2 className={bigHead}>정책자금, <span className="text-blue-600">시작이 제일 막막하죠</span></h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {pains.map((p) => (
              <div key={p} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white" aria-hidden>?</span>
                <p className="mt-3 text-[1.2rem] font-bold leading-snug text-slate-800 sm:text-[1.35rem]">“{p}”</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-lg font-black text-slate-900 sm:text-xl">
            그런데 결론을 미루는 동안에도, <span className="text-red-600">비용은 계속 나가고 있습니다.</span>
          </p>
        </div>
      </section>

      {/* 손실 환기 — 미루면 잃는 것 */}
      <section className={`bg-rose-50/60 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-red-600">미루면 어떻게 될까요</p>
          <h2 className={bigHead}>
            미루는 동안에도 <span className="text-red-600">이자는 불어나고,</span><br /><span className="text-red-600">기회는 사라지고 있습니다</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {losses.map((l) => (
              <div key={l.t} className="flex flex-col rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-2xl" aria-hidden>{l.icon}</span>
                <p className="mt-3 text-[1.2rem] font-extrabold leading-snug text-slate-900">{l.t}</p>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-600">{l.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-center sm:p-7">
            <p className="text-lg font-black leading-snug text-white sm:text-xl">
              컨설팅은 받아야겠는데, <span className="text-amber-300">어디를 골라야 할지</span> 막막하시죠?
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-400">그래서 저희는 일하는 방식부터 다르게 잡았습니다.</p>
          </div>
        </div>
      </section>

      {/* 혜택 1 — 성공수수료 0원 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>미래 AI 랩의 방식</p>
          <h2 className={bigHead}>
            “전부 대신 해주는” 컨설팅,<br /><span className="text-blue-600">그 시대는 저물고 있습니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            사업의 주인은 대표님입니다. 그래서 저희는 <b className="text-slate-900">반드시 필요한 부분만</b> 돕고,
            신청 같은 나머지는 <b className="text-slate-900">대표님이 직접 하실 수 있도록</b> 만들어 드립니다.
            실행액의 5~7%를 성공수수료로 떼는 방식이 아니라요.
          </p>

          {/* 성공수수료 0원 비교 */}
          <div className="mx-auto mt-9 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">업계 평균 성공수수료</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-400 line-through decoration-red-400/70">5~7%</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">1억 실행 시 500~700만원</p>
            </div>
            <div className="rounded-2xl bg-blue-600 p-6 text-center shadow-lg shadow-blue-600/20">
              <p className="text-xs font-black uppercase tracking-wide text-blue-200">미래 AI 랩 진단·전략</p>
              <p className="mt-2 text-4xl font-black tracking-tight text-white">0원</p>
              <p className="mt-1 text-sm font-semibold text-blue-100">비용은 50만원이 전부</p>
            </div>
          </div>

          {/* 업무 범위 */}
          <p className="mt-14 text-center text-xl font-black text-slate-900 sm:text-2xl">
            50만원으로, <span className="text-blue-600">여기까지 해드립니다</span>
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { icon: '🎯', t: '가장 적합한 기관·자금 판단', d: '어떤 자금이 가장 효율적인지, 승인 가능성이 높은 방향은 무엇인지 짚어드립니다.' },
              { icon: '📄', t: '필요 서류 안내', d: '무엇을 어떻게 준비해야 하는지 빠짐없이 안내해 드립니다.' },
              { icon: '📝', t: '사업계획서 작성', d: '대표님이 바로 신청만 하면 되는, “신청 가능한 상태”까지 만들어 드립니다.' },
              { icon: '🔁', t: '다음엔 직접 하실 수 있게', d: '이후에는 대표님이 스스로 진행하실 수 있도록 방법까지 알려드립니다.' },
            ].map((it) => (
              <div key={it.t} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-2xl" aria-hidden>{it.icon}</span>
                <p className="mt-3 text-[1.2rem] font-extrabold text-slate-900">{it.t}</p>
                <p className="mt-1.5 text-[1.05rem] leading-relaxed text-slate-600">{it.d}</p>
              </div>
            ))}
          </div>

          {/* 3% 전액대행 옵션 */}
          <div className="mt-8 rounded-3xl border-2 border-slate-900 bg-slate-50 p-6 sm:p-7">
            <p className="text-sm font-black text-blue-600">그래도 정말 손댈 여유가 없으시다면</p>
            <p className="mt-2 text-lg font-black leading-snug text-slate-900 sm:text-xl">
              신청까지 전부 대행 — 업계 5~7%가 아닌 <span className="text-blue-600">3%</span>로 진행해 드립니다
            </p>
            <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-600">
              아무것도 손대기 어려운 상황이라면, 처음부터 끝까지 저희가 맡아 진행합니다. 그래도 업계 절반 수준입니다.
            </p>
          </div>

          {/* 철학 마무리 */}
          <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-center sm:p-7">
            <p className="text-lg font-black leading-snug text-white sm:text-xl">
              저희의 목적은 대표님이 <span className="text-amber-300">스스로 하실 수 있게</span> 만드는 것입니다.
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-400">정책 환경도 점점 그 방향으로 바뀌어 가고 있습니다.</p>
          </div>
        </div>
      </section>

      {/* 정책자금·보증부 자금 실제 사례 (카톡 승인 공유) */}
      <FundingCasesSection />

      {/* 혜택 2 — 전자책 3종 증정 */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>구매 혜택</p>
          <h2 className={bigHead}>
            23만 7천 원에 판매 중인 전자책 3종,<br /><span className="text-blue-600">그대로 드립니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            현재 <b className="text-slate-900">23만 7천 원에 판매 중인 정책자금 셀프 진행 전자책 3종</b>을 무료로 드립니다.
            이번에는 저희와 함께, <b className="text-slate-900">다음번에는 대표님이 직접</b> 하실 수 있습니다.
          </p>
          <div className="relative mx-auto mt-10 max-w-lg">
            <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3.5 py-1.5 text-sm font-black text-slate-900 shadow">구매 시 무료 증정</span>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <img src={EBOOK_IMG} alt="정책자금·지원금 전자책 3종" loading="lazy" className="w-full" />
              <div className="flex items-center justify-center gap-2.5 border-t border-slate-100 px-6 py-4">
                <span className="text-base font-bold text-slate-400 line-through">판매가 23만 7천 원</span>
                <span aria-hidden className="text-slate-300">→</span>
                <span className="text-3xl font-black text-blue-600">0원</span>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-relaxed text-slate-400">
            ※ 증정 전자책을 다운로드하신 후에는 결제 환불이 불가합니다.
          </p>
        </div>
      </section>

      {/* 믿을 수 있는 이유 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>함께하면 좋은 이유</p>
          <h2 className={bigHead}>미래 AI 랩과 함께하시면<br /><span className="text-blue-600">좋은 이유들</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {reasons.map((r) => (
              <div key={r} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-xl font-black text-white" aria-hidden>✓</span>
                <p className="mt-3 text-[1.2rem] font-bold text-slate-900">{r}</p>
              </div>
            ))}
          </div>
          {/* 데이터 기반 진단 — 자체 개발 SaaS */}
          <div className="mt-6 rounded-2xl border-2 border-slate-900 bg-white p-6 sm:p-7">
            <p className="text-center text-lg font-black text-slate-900 sm:text-xl">
              감(感)으로 하는 컨설팅과는 <span className="text-blue-600">다릅니다</span>
            </p>
            <p className="mx-auto mt-3 max-w-lg text-center text-[1.05rem] leading-relaxed text-slate-600 sm:text-[1.1rem]">
              직접 개발하고 전문가 검증을 거친 <b className="text-slate-900">자체 SaaS 프로그램</b>이
              자금·인증 심사 데이터를 계속 학습하고 최적화합니다.
              그래서 저희는 감이 아니라 <b className="text-slate-900">수치와 데이터를 근거로</b> 진단하고 방향을 제시합니다.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">🧠 데이터 학습·최적화</span>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">🛠️ 자체 개발 프로그램</span>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">✅ 전문가 검증 완료</span>
            </div>
          </div>
        </div>
      </section>

      {/* 제공 결과물 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>제공 항목</p>
          <h2 className={bigHead}>이 상품으로 대표님이<br /><span className="text-blue-600">얻으시는 것들입니다</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {pkg.deliverables.map((d, i) => (
              <div key={d} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="text-2xl font-black text-blue-600 sm:text-3xl">{`0${i + 1}`}</span>
                <p className="mt-3 text-lg font-extrabold leading-snug text-slate-900">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {pkg.highlights.map((hi) => (
              <span key={hi} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">{hi}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 대상 */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>추천 대상</p>
          <h2 className={bigHead}>이런 대표님이라면<br /><span className="text-blue-600">잘 맞습니다</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {pkg.recommendedFor.map((r) => (
              <div key={r} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white" aria-hidden>✓</span>
                <p className="mt-3 text-[1.2rem] font-semibold leading-snug text-slate-800">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 / 구매 (재CTA) */}
      <section className={`bg-slate-900 ${band}`}>
        <div className="mx-auto max-w-[520px] px-1">
          <p className="text-center text-sm font-black uppercase tracking-widest text-amber-300">고민은 여기까지</p>
          <h2 className="mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.5rem]">정책자금 컨설팅</h2>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-md bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900">{DISCOUNT_RATE} 할인</span>
              <span className="text-sm font-medium text-slate-400 line-through">정가 {LIST_PRICE}</span>
            </div>
            <p className="mt-2 text-center text-5xl font-black tracking-tight text-slate-900">{SALE_PRICE}</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600"><span aria-hidden>💳</span> 카드 무이자 할부 가능</p>
            <div className="mx-auto mt-4 max-w-xs space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-100">
              <p className="flex items-center gap-1.5 font-black text-red-600"><span aria-hidden>🚫</span> 성공수수료 없음 — 업계 평균 5~7%</p>
              <p className="flex items-center gap-1.5"><span aria-hidden>🎁</span> 23만 7천원 상당 전자책 3종 증정</p>
            </div>
            <ul className="mx-auto mt-5 max-w-xs space-y-2.5 border-t border-slate-100 pt-5">
              {pkg.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-[1.05rem] text-slate-700">
                  <span className="mt-0.5 font-black text-blue-500" aria-hidden>✓</span>{d}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <BuyButtons variant="light" />
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-[1.05rem] leading-relaxed text-slate-500">
              지금 당장 결정하지 않으셔도 괜찮습니다.<br />
              <b className="text-slate-700">무료 상담으로 가능성만 먼저 확인</b>해 두세요. 확인하는 데는 비용이 들지 않습니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>자주 묻는 질문</p>
          <h2 className={bigHead}>정책자금 컨설팅 FAQ</h2>
          <div className="mt-9 space-y-3">
            {pkg.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-[1.2rem] font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 유의사항 */}
      <section className="bg-white px-5 pb-4">
        <div className={`${inner} rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-500">{pkg.notice}</p>
        </div>
      </section>

      {/* 상담 폼 */}
      <section id="apply" className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>무료 진단 신청</p>
          <h2 className={bigHead}>먼저, 대표님 상황부터<br />같이 살펴보시죠</h2>
          <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-slate-600">
            간단히 남겨주시면 어떤 자금부터 검토하면 좋을지 방향을 정리해 안내드립니다.
          </p>
          {payNotice && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-[1.05rem] leading-relaxed text-amber-800">
              🛒 온라인 카드결제(무이자 할부)는 준비 중입니다. 우선 아래 <b>상담 신청</b>을 남겨주시면 결제와 진행을 함께 안내드리겠습니다.
            </div>
          )}
          <div className="mt-8">
            <BusinessInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 경영지원</p>
          <Link to="/business-services" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">← 서비스몰 홈으로</Link>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <span className="flex shrink-0 items-baseline gap-1">
            <span className="text-xs font-medium text-slate-400 line-through">{LIST_PRICE}</span>
            <span className="text-lg font-black text-slate-900">{SALE_PRICE}</span>
          </span>
          <button type="button" onClick={handleBuy} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white">
            <CartIcon /> 바로 구매하기
          </button>
        </div>
      )}
    </div>
  )
}
