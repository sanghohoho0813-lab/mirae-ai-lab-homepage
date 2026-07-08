// 정책자금 컨설팅 — 전용 상세페이지 (한국형 이커머스 "긴 세로 상세" 스타일).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 상단 구매영역(카페24형) + 긴 세로 배너 상세 + 예시 사례(추후 실제 데이터로 교체).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../../components/BusinessInquiryForm'
import { getPackageBySlug } from '../../data/businessPackages'

const pkg = getPackageBySlug('funding-consulting')!
const IMG = '/assets/business-services/funding-consulting.png'

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

const pains = ['운전자금이 급한데, 어디서부터 봐야 할지 모르겠어요', '대출 금리를 조금이라도 낮추고 싶어요', '정책자금 종류가 너무 많아서 뭐가 뭔지 모르겠어요', '요건이니 서류니, 보다가 그냥 덮었어요']

const whyPoints = [
  { n: '01', t: '헛걸음부터 줄여드려요', d: '무턱대고 여기저기 알아보기 전에, 되는 방향부터 좁혀서 시간을 아껴드립니다.' },
  { n: '02', t: '순서를 정해드려요', d: '지금 우리 회사가 먼저 봐야 할 자금이 뭔지, 우선순위를 잡아드립니다.' },
  { n: '03', t: '다음 할 일이 또렷해져요', d: '신청 전략과 준비서류까지 알려드리니까, 뭘 하면 되는지가 명확해집니다.' },
]

// 예시 사례 (⚠️ 실제 데이터로 교체 예정 · 승인/실행 보장 아님)
const cases = [
  { bank: '○○은행', product: '혁신성장촉진자금 (운전)', repay: '일시상환', amount: '70,000,000원', big: '7,000만원', rate: '연 3.5%' },
  { bank: '○○은행', product: '일반자금대출', repay: '분할상환', amount: '100,000,000원', big: '1억원', rate: '연 2.9%' },
  { bank: '○○기금', product: '소상공인 정책자금 (운전)', repay: '분할상환', amount: '50,000,000원', big: '5,000만원', rate: '연 3.2%' },
]

// 믿을 수 있는 이유 (과장 없는 정성 표현)
const reasons = ['정책자금·인증 실무 경험', '기업 상황에 맞춘 맞춤 진단', '신청 전략·준비서류까지 안내']

// 미루면 잃는 것 (적당한 긴장 — 조작 통계·과도한 협박 금지)
const losses = [
  { icon: '⏳', t: '정책자금 예산은 소진되면 끝이에요', d: '정책자금은 예산 소진형이거든요. 알아보는 사이 올해 예산이 마감되면, 다음 기회는 내년입니다.' },
  { icon: '💸', t: '높은 금리로 이자가 새고 있어요', d: '방향을 몰라 고금리 대출로 버티는 동안, 금리 차이만큼의 이자가 매달 조용히 빠져나가요.' },
  { icon: '🚪', t: '경쟁사는 벌써 쓰고 있어요', d: '비슷한 조건의 회사가 정책자금으로 설비랑 인력에 투자하는 동안, 격차는 매달 벌어집니다.' },
]
const lossClosing = '제일 비싼 비용은 “몰라서 못 받은 자금”이에요.'

// 진행 후 변화 (Before → After)
const afters = [
  { before: '매달 이자 낼 때마다 아까웠던 마음', after: '더 낮은 금리 가능성 확인하고 세우는 이자 계획' },
  { before: '어디서 뭘 알아봐야 할지 몰라 미루던 상태', after: '뭘 먼저 준비할지 순서가 정해진 상태' },
  { before: '은행 창구에서 아쉬운 소리 하던 자리', after: '준비된 서류로 당당하게 신청하는 자리' },
]
const afterClosing = '자금 걱정이 줄면, 대표님의 결정이 빨라져요.'

const steps = [
  { t: '상담 신청', d: '편하게 남겨주세요. 담당자가 연락드릴게요.' },
  { t: '기업 현황 진단', d: '업종, 업력, 재무 상황을 같이 살펴봐요.' },
  { t: '자금 방향 정리', d: '검토해볼 만한 자금과 순서를 잡아드려요.' },
  { t: '신청 전략·서류 안내', d: '신청 전략이랑 준비서류를 알려드려요.' },
  { t: '이후 진행 협의', d: '진행할지 말지는 이야기해 보고 정하셔도 돼요.' },
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
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{SALE_PRICE}</span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-blue-600"><span aria-hidden>💳</span> 카드 무이자 할부 가능</p>

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
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <span className="rounded-md bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900">{DISCOUNT_RATE}</span>
            <span className="text-sm font-medium text-slate-400 line-through">{LIST_PRICE}</span>
            <span className="text-3xl font-black tracking-tight text-slate-900">{SALE_PRICE}</span>
          </div>
        </div>
      </section>

      {/* 공감 (이런 고민) */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-4xl">🤔</div>
          <p className={kicker}>이런 고민, 있으셨죠?</p>
          <h2 className={bigHead}>정책자금, <span className="text-blue-600">시작이 제일 막막하죠</span></h2>
          <ul className="mx-auto mt-9 max-w-xl space-y-3">
            {pains.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base font-bold text-slate-800 sm:text-lg">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-black text-white" aria-hidden>?</span>
                “{p}”
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-lg font-black text-slate-900 sm:text-xl">
            그런데 이 고민들, <span className="text-red-600">미룰수록 비싸지더라고요.</span>
          </p>
        </div>
      </section>

      {/* 손실 환기 — 미루면 잃는 것 */}
      <section className={`bg-rose-50/60 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-red-600">미루면 어떻게 될까요</p>
          <h2 className={bigHead}>
            가만히 두면,<br /><span className="text-red-600">이런 것들이 조용히 새나가요</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {losses.map((l) => (
              <div key={l.t} className="flex flex-col rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-2xl" aria-hidden>{l.icon}</span>
                <p className="mt-3 text-base font-extrabold leading-snug text-slate-900">{l.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{l.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-center sm:p-7">
            <p className="text-lg font-black leading-snug text-white sm:text-xl">{lossClosing}</p>
            <p className="mt-2 text-sm font-semibold text-slate-400">그래도 다행인 건, 지금 시작해도 늦지 않았다는 거예요.</p>
          </div>
        </div>
      </section>

      {/* 왜 진단부터 */}
      <section className={`bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-amber-300">왜 진단부터냐면요</p>
          <h2 className="mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.7rem]">
            진단부터 하면<br /><span className="text-amber-300">이런 게 달라져요</span>
          </h2>
          <div className="mt-10 space-y-4">
            {whyPoints.map((w) => (
              <div key={w.n} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="text-2xl font-black text-amber-300 sm:text-3xl">{w.n}</span>
                <div>
                  <p className="text-lg font-bold text-white sm:text-xl">{w.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300 sm:text-base">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-amber-400 p-6 text-center">
            <p className="text-base font-black text-slate-900 sm:text-lg">{pkg.expectation}</p>
          </div>
        </div>
      </section>

      {/* 변화 — 진행 후 달라지는 것 (Before → After) */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행 후, 달라지는 것</p>
          <h2 className={bigHead}>
            진단받고 나면,<br /><span className="text-blue-600">대표님 하루가 이렇게 달라져요</span>
          </h2>
          <div className="mt-10 space-y-4">
            {afters.map((a) => (
              <div key={a.after} className="grid items-stretch gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_1.1fr] sm:gap-3 sm:p-5">
                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">지금</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-500 line-through decoration-slate-300 sm:text-[0.95rem]">{a.before}</p>
                </div>
                <div className="flex items-center justify-center text-xl font-black text-blue-600 sm:text-2xl" aria-hidden>→</div>
                <div className="rounded-xl bg-blue-50 p-4 ring-1 ring-inset ring-blue-100">
                  <p className="text-[11px] font-black uppercase tracking-wide text-blue-500">진행 후</p>
                  <p className="mt-1 text-[0.95rem] font-extrabold leading-snug text-slate-900 sm:text-base">{a.after}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-lg font-black text-slate-900 sm:text-xl">{afterClosing}</p>
        </div>
      </section>

      {/* 믿을 수 있는 이유 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>믿을 수 있는 이유</p>
          <h2 className={bigHead}>“왜 미래 AI 랩이냐”<br /><span className="text-blue-600">물으신다면요</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {reasons.map((r) => (
              <div key={r} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-xl font-black text-white" aria-hidden>✓</span>
                <p className="mt-3 text-base font-bold text-slate-900">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 실제 진행 예시 (알림톡형) */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-4xl shadow-sm ring-1 ring-slate-200">🙋‍♂️</div>
          <p className={kicker}>실제 이렇게 진행됩니다</p>
          <h2 className={bigHead}>전문가만 되는 거<br />아니냐고요? <span className="text-blue-600">아닙니다</span></h2>
          <p className="mx-auto mt-5 max-w-md text-center text-base font-semibold leading-relaxed text-slate-600">
            대표님 상황부터 제대로 보고, <b className="text-slate-900">맞는 자금 방향</b>을 같이 잡아드려요.
          </p>

          <div className="mt-12 space-y-14">
            {cases.map((c, i) => (
              <div key={i}>
                <p className="text-center text-[1.6rem] font-black tracking-tight text-slate-900 sm:text-4xl">
                  <span className="text-blue-600">{c.big}</span> 진행 예시
                </p>
                <div className="mx-auto mt-5 max-w-sm overflow-hidden rounded-3xl bg-slate-200/70 shadow-xl ring-1 ring-slate-200">
                  {/* 카톡 알림톡 헤더 */}
                  <div className="flex items-center gap-2 bg-[#FEE500] px-4 py-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-[#3C1E1E] text-[10px] font-black text-[#FEE500]">TALK</span>
                    <span className="text-sm font-black text-[#3C1E1E]">알림톡 도착</span>
                    <span className="ml-auto rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-black text-[#3C1E1E]">예시</span>
                  </div>
                  {/* 메시지 버블 */}
                  <div className="p-4">
                    <div className="rounded-2xl rounded-tl-md bg-white p-4 shadow-sm">
                      <p className="text-sm font-bold text-slate-900">[{c.bank}] 대출 실행 안내</p>
                      <p className="mt-1 text-xs text-slate-400">■■■ 고객님, 대출이 정상 실행되었습니다.</p>
                      <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-[13px]">
                        <div className="flex justify-between"><dt className="text-slate-400">대출상품</dt><dd className="font-semibold text-slate-700">{c.product}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-400">상환방법</dt><dd className="font-semibold text-slate-700">{c.repay}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-400">대출금리</dt><dd className="font-semibold text-slate-700">{c.rate}</dd></div>
                      </dl>
                      {/* 파랑 강조 박스 */}
                      <div className="relative mt-5 rounded-xl border-2 border-blue-600 bg-blue-50 px-4 py-3 text-center">
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">대출금액</span>
                        <p className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{c.amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">
            ※ 위 화면은 이해를 돕기 위한 <b>예시</b>이며 실제 고객 정보가 아닙니다. 대출 승인·실행·금리·한도는 기관 심사에 따라 달라지며 보장하지 않습니다.
          </p>
        </div>
      </section>

      {/* 진단 과정 */}
      <section id="flow" className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행 과정</p>
          <h2 className={bigHead}>진단은 이렇게 진행됩니다</h2>
          <ol className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <li key={s.t} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-900 text-lg font-black text-white">{i + 1}</span>
                <div className="pt-1">
                  <p className="text-lg font-bold text-slate-900">{s.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 sm:text-base">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-center text-sm text-slate-500">부담 갖지 마세요. 진행할지 말지는 이야기해 보고 정하셔도 됩니다.</p>
        </div>
      </section>

      {/* 제공 결과물 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>제공 결과물</p>
          <h2 className={bigHead}>손에 쥐어지는 건<br /><span className="text-blue-600">이것들이에요</span></h2>
          <div className="mt-10 space-y-4">
            {pkg.deliverables.map((d, i) => (
              <div key={d} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="text-2xl font-black text-blue-600 sm:text-3xl">{`0${i + 1}`}</span>
                <p className="text-lg font-extrabold text-slate-900 sm:text-xl">{d}</p>
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
          <h2 className={bigHead}>이런 대표님이라면<br /><span className="text-blue-600">잘 맞으실 거예요</span></h2>
          <ul className="mx-auto mt-10 max-w-xl space-y-3">
            {pkg.recommendedFor.map((r) => (
              <li key={r} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-base font-semibold text-slate-800 shadow-sm">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-black text-white" aria-hidden>✓</span>
                {r}
              </li>
            ))}
          </ul>
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
            <ul className="mx-auto mt-6 max-w-xs space-y-2.5 border-t border-slate-100 pt-6">
              {pkg.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 font-black text-blue-500" aria-hidden>✓</span>{d}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <BuyButtons variant="light" />
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-sm leading-relaxed text-slate-500">
              지금 당장 결정 안 하셔도 괜찮아요.<br />
              <b className="text-slate-700">무료 상담으로 가능성만 먼저 확인</b>해 두세요. 확인만 해두는 건 공짜니까요.
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
                <summary className="flex items-center justify-between text-base font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 유의사항 */}
      <section className="bg-white px-5 pb-4">
        <div className={`${inner} rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{pkg.notice}</p>
        </div>
      </section>

      {/* 상담 폼 */}
      <section id="apply" className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>무료 진단 신청</p>
          <h2 className={bigHead}>일단, 대표님 상황부터<br />같이 봐요</h2>
          <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-slate-600">
            간단히 남겨주시면 어떤 자금부터 검토하면 좋을지 방향을 정리해 안내드립니다.
          </p>
          {payNotice && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
              🛒 온라인 카드결제(무이자 할부)는 지금 준비 중이에요. 우선 아래 <b>상담 신청</b>을 남겨주시면, 결제와 진행을 같이 안내드릴게요.
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
