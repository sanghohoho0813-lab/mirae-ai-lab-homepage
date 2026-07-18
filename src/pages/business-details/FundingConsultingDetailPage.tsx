// 정책자금 컨설팅 — 전용 상세페이지 (한국형 이커머스 "긴 세로 상세" 스타일).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 상단 구매영역(카페24형) + 긴 세로 배너 상세 + 예시 사례(추후 실제 데이터로 교체).
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BusinessInquiryForm from '../../components/BusinessInquiryForm'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import FundingCasesSection from '../../components/FundingCasesSection'
import ProductReviews from '../../components/ProductReviews'
import { getPackageBySlug } from '../../data/businessPackages'
import { paymentsEnabled, inquiryUrl, paymentsPreparingNotice } from '../../config/commerce'

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

// 믿을 수 있는 이유 (블로그 공개 실적 기준)
const reasons = ['누적 자금조달 100억 원+', '기업성장컨설팅 실무 경력 8년+', '진단·전략·서류·실사 동행까지']

// 신뢰 스탯 밴드 — 블로그(공개 성공사례)에서 확인되는 실적만 사용
const trustStats = [
  { value: '100억+', label: '누적 자금조달' },
  { value: '8년+', label: '실무 경력' },
  { value: '0원', label: '성공수수료' },
]

// 정직한 진행 원칙 3가지 — '아무나 받지 않는' 셀렉티브 포지셔닝 (과장 없이)
const principles = [
  { n: '01', t: '무리한 진행을 권하지 않습니다', d: '가능성이 낮으면 낮다고 그대로 말씀드립니다. 성공수수료가 없으니 무리하게 권할 이유도 없습니다.' },
  { n: '02', t: '급한 돌려막기용 자금은 말립니다', d: '사용 계획이 없다면, 자금보다 계획부터 함께 잡는 것이 맞다고 봅니다.' },
  { n: '03', t: '거절도 전략으로 만듭니다', d: '거절 사유를 정확히 파악해 기관·시점·서류를 바꿔 다시 도전합니다.' },
]

// 무료 상담에서 벌어지는 일 3단계 — 상담 신청의 심리 문턱 낮추기
const consultSteps = [
  { t: '현재 상태 진단', d: '재무·업력·필요 자금을 기준으로 지금 위치를 확인합니다.' },
  { t: '가능 경로 정리', d: '우리 회사 조건에 맞는 기관·자금·우선순위를 정리합니다.' },
  { t: '방향 제안', d: '먼저 할 것과 나중에 해도 되는 것을 구분해 드립니다.' },
]

// 타사 비교 VS 테이블 — 확정 비방 없이 '일반적인 방식' 대비로 표현
const vsRows = [
  { k: '성공수수료', other: '실행액의 5~7%', ours: '0원 (전액대행도 3%)' },
  { k: '비용 구조', other: '결과 따라 커지는 수수료', ours: '50만원 정찰제' },
  { k: '진행 방식', other: '전부 대행 → 계속 의존', ours: '자립형 — 다음엔 직접' },
  { k: '세금 환급 검토', other: '별도 진행', ours: '경정청구 함께 검토' },
  { k: '자금 이후', other: '1회성 종료', ours: '인증·세무·노무 연계' },
  { k: '진단 근거', other: '경험과 감', ours: '자체 SaaS 데이터 진단' },
]

// "정책자금만 받고 끝나지 않습니다" — 자금 이후까지 잇는 통합 관리
const beyondFunding = [
  { icon: '💰', t: '숨은 세금부터 돌려받고 시작', d: '경정청구로 더 낸 세금을 먼저 확인합니다. 957만 원을 추가 환급받고 시작한 사례도 있습니다.' },
  { icon: '🏃', t: '실사·기관 방문, 함께 갑니다', d: '보증기관 실사와 은행 방문에 동행하고, 예상 질문까지 미리 준비해 드립니다.' },
  { icon: '🏅', t: '자금 다음은 인증으로', d: '메인비즈·벤처인증으로 다음 자금과 지원사업 기반을 만듭니다.' },
  { icon: '🤝', t: '세무·노무까지 이어지는 관리', d: '세무사·법무사·노무사와 함께 자금 이후 문제까지 챙깁니다.' },
]

// 미루면 잃는 것 (적당한 긴장 — 조작 통계·과도한 협박 금지)
const losses = [
  { icon: '⏳', t: '정책자금 예산은 소진되면 끝입니다', d: '보통 8월부터 예산이 눈에 띄게 줄고, 12월엔 거의 남지 않습니다. 시기를 놓쳤다면 다음 연도 예산을 미리 준비해 두어야 합니다.' },
  { icon: '💸', t: '높은 금리로 이자가 불어나고 있습니다', d: '방향을 몰라 고금리 대출로 버티는 동안, 금리 차이만큼의 이자가 매달 쌓여 갑니다.' },
  { icon: '🚪', t: '경쟁사는 이미 활용하고 있습니다', d: '비슷한 조건의 회사가 정책자금으로 설비와 인력에 투자하는 동안, 격차는 매달 벌어집니다.' },
]

// 정책자금 vs 일반 대출 — 확정적 표현 대신 "~인 경우가 많습니다" 톤 유지(기관·상품마다 다를 수 있음)
const fundFeatures = [
  { icon: '📉', t: '시중은행보다 낮은 금리대인 경우가 많습니다', d: '정부·지자체 재원이나 보증기관을 통해 진행되어, 일반 신용대출보다 낮은 금리대로 설계된 상품이 많습니다.' },
  { icon: '🤝', t: '신용점수 외의 요소도 함께 봅니다', d: '보증기관의 보증을 통해 진행되는 경우, 기술력·사업성 등을 함께 평가해 신용점수만으로 판단하지 않는 경우가 있습니다.' },
  { icon: '🎯', t: '목적에 따라 종류가 다양합니다', d: '운전자금·시설자금·창업자금 등 목적과 기업 상황에 따라 적합한 기관·상품이 달라, 방향을 먼저 잡는 것이 중요합니다.' },
]

// 진행 절차 — 막막함 해소용 6단계 플로우
const processSteps = [
  { t: '상담 신청', d: '홈페이지나 카톡으로 편하게 문의를 남겨주세요.' },
  { t: '기초 현황 확인', d: '사업 현황과 자금이 필요한 목적을 간단히 확인합니다.' },
  { t: '가능성 진단', d: '어떤 자금·기관이 적합한지 검토하고 결과를 안내해 드립니다.' },
  { t: '방향 결정', d: '진단 결과를 보고 진행 여부는 대표님이 직접 결정하십니다.' },
  { t: '서류 준비', d: '사업계획서 등 신청에 필요한 서류 작성을 지원합니다.' },
  { t: '신청 · 사후 안내', d: '신청부터 결과 확인, 다음 절차까지 안내해 드립니다.' },
]

// 신청 전 자가진단 — 배제가 아니라 "확인해두면 좋은 것" 톤(해당 안 돼도 상담 가능함을 명시)
const readinessChecks = [
  '최근 연체 이력이 없는지',
  '국세·지방세 체납이 없는지',
  '4대보험이 완납 상태인지',
  '현재 진행 중인 다른 대출이 있는지',
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
  const navigate = useNavigate()
  const [showBar, setShowBar] = useState(false)

  // 결제 시스템 준비 중이면 카드결제 대신 상담(구글폼)으로 우회
  const inquiryOnly = !paymentsEnabled
  function handleBuy() {
    if (inquiryOnly) { window.open(inquiryUrl, '_blank', 'noopener,noreferrer'); return }
    navigate(`/checkout/${pkg.slug}`)
  }

  useEffect(() => {
    document.title = '정책자금 컨설팅 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  // (구버전 호환) ?buy=1 링크 → 체크아웃 페이지
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('buy') === '1') navigate(`/checkout/${pkg.slug}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const BuyButtons = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) =>
    inquiryOnly ? (
      <>
        <a
          href={inquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
        >
          무료 상담 신청하기
        </a>
        <p className={`mt-2 text-xs font-medium leading-relaxed ${variant === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{paymentsPreparingNotice}</p>
      </>
    ) : (
      <>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleBuy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
          >
            <CartIcon /> 바로 결제하기
          </button>
        </div>
        <p className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold ${variant === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>
          <span className="inline-flex items-center gap-1"><span className="text-emerald-400" aria-hidden>✔</span> 카드사별 할부 가능</span>
          <span className="inline-flex items-center gap-1"><span className="text-emerald-400" aria-hidden>✔</span> 결제 단계에서 할부 개월 수 선택</span>
        </p>
        <button
          type="button"
          onClick={() => scrollToId('apply')}
          className={`mt-3 text-sm font-semibold underline underline-offset-4 transition-colors ${
            variant === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          결제 전 상담하기 →
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
              <span className="text-[0.8rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">서비스몰 홈</Link>
            <button type="button" onClick={handleBuy} className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
              {inquiryOnly ? '상담 신청하기' : '바로 결제하기'}
            </button>
            <HeaderAccount />
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
              <button type="button" onClick={() => scrollToId('reviews')} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20 transition-colors hover:bg-amber-100">🎁 후기 쓰고 전자책 받기 →</button>
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
              <li className="flex items-center gap-1.5"><span aria-hidden>🎁</span> 컨설팅 종료 후 정가 237,000원 상당 전자책 3종 증정 (리뷰 작성 시)</li>
              <li className="flex items-center gap-1.5"><span aria-hidden>🏆</span> 누적 자금조달 100억 원+ · 실무 경력 8년+</li>
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

          {/* 신뢰 스탯 밴드 — 블로그 공개 실적 기반 */}
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 divide-x divide-slate-200 rounded-2xl bg-slate-900 py-5 shadow-lg">
            {trustStats.map((s) => (
              <div key={s.label} className="px-2 text-center">
                <p className="text-2xl font-black tracking-tight text-amber-300 sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-300 sm:text-sm">{s.label}</p>
              </div>
            ))}
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
            그런데 결정을 미루는 동안에도, <span className="text-red-600">비용은 계속 나가고 있습니다.</span>
          </p>
        </div>
      </section>

      {/* 정책자금이 낯선 분들을 위한 기초 설명 */}
      <section className={`bg-blue-50/50 ${band}`}>
        <div className={inner}>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-4xl shadow-sm">📘</div>
          <p className={kicker}>정책자금이 처음이라면</p>
          <h2 className={bigHead}>
            정책자금, <span className="text-blue-600">일반 대출과 뭐가 다른가요?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            용어부터 낯설어 시작하기 어려우셨다면, 여기서부터 천천히 짚어보시죠.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {fundFeatures.map((f) => (
              <div key={f.t} className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-2xl" aria-hidden>{f.icon}</span>
                <p className="mt-3 text-[1.1rem] font-extrabold leading-snug text-slate-900">{f.t}</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-lg text-center text-sm leading-relaxed text-slate-500">
            다만 정책자금도 심사 절차를 거치며, 모든 기업의 승인을 보장하지는 않습니다.
            그래서 먼저 <b className="text-slate-700">우리 회사에 맞는 방향인지 확인하는 것</b>이 첫 단계입니다.
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
            “전부 대신 해드립니다”식 컨설팅,<br /><span className="text-blue-600">이제는 맞지 않는 방식입니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            사업의 주인은 대표님입니다. 그래서 저희는 <b className="text-slate-900">반드시 필요한 부분만</b> 돕고,
            신청 같은 나머지는 <b className="text-slate-900">대표님이 직접 하실 수 있도록</b> 만들어 드립니다.
            실행 금액의 5~7%를 성공수수료로 떼는 방식과는 다릅니다.
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
            <p className="mt-2 text-sm font-semibold text-slate-400">정책 환경도 대표님이 직접 챙길 수 있는 방향으로 점점 바뀌고 있습니다.</p>
          </div>
        </div>
      </section>

      {/* 차별화 — 정책자금만 받고 끝나지 않습니다 */}
      <section className={`bg-blue-50/50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>다른 컨설팅과 다른 점</p>
          <h2 className={bigHead}>
            정책자금만 받고<br /><span className="text-blue-600">끝나지 않습니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            일회성으로 자금만 받고 끝나는 컨설팅은 의미가 없다고 생각합니다.
            <b className="text-slate-900"> 자금 이전의 세금 환급부터, 자금 이후의 인증·세무·노무까지</b> 사업의 흐름 전체를 잇습니다.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {beyondFunding.map((b) => (
              <div key={b.t} className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-2xl" aria-hidden>{b.icon}</span>
                <p className="mt-3 text-[1.15rem] font-extrabold leading-snug text-slate-900">{b.t}</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">{b.d}</p>
              </div>
            ))}
          </div>

          {/* VS 비교표 — 일반적인 컨설팅 방식과 직접 비교 */}
          <p className="mt-14 text-center text-xl font-black text-slate-900 sm:text-2xl">
            비슷해 보인다면, <span className="text-blue-600">직접 비교해 보세요</span>
          </p>
          <div className="mx-auto mt-6 max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            {/* 헤더 */}
            <div className="grid grid-cols-[1fr_auto_1.2fr]">
              <div className="bg-slate-800 px-3 py-4 text-center">
                <p className="text-sm font-black text-slate-300 sm:text-base">일반 컨설팅</p>
              </div>
              <div className="grid place-items-center bg-white px-2">
                <span className="text-sm font-black italic text-slate-400">VS</span>
              </div>
              <div className="bg-blue-600 px-3 py-4 text-center">
                <p className="text-sm font-black text-white sm:text-base">미래 AI 랩</p>
              </div>
            </div>
            {/* 행 */}
            {vsRows.map((r, i) => (
              <div key={r.k} className={`grid grid-cols-[1fr_auto_1.2fr] ${i % 2 ? 'bg-slate-50/60' : 'bg-white'}`}>
                <div className="flex items-center justify-center px-3 py-3.5 text-center">
                  <p className="text-[0.88rem] font-medium leading-snug text-slate-400 sm:text-[0.95rem]">{r.other}</p>
                </div>
                <div className="flex w-[4.5rem] items-center justify-center border-x border-slate-100 px-1 text-center sm:w-[5.5rem]">
                  <p className="text-[0.72rem] font-black leading-tight text-slate-500 sm:text-[0.78rem]">{r.k}</p>
                </div>
                <div className="flex items-center justify-center bg-blue-50/50 px-3 py-3.5 text-center">
                  <p className="text-[0.9rem] font-extrabold leading-snug text-blue-700 sm:text-[0.98rem]">{r.ours}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-md text-center text-xs leading-relaxed text-slate-400">
            ※ ‘일반 컨설팅’은 특정 업체가 아닌, 업계에서 일반적으로 통용되는 성공수수료형 진행 방식을 말합니다.
          </p>
        </div>
      </section>

      {/* 진행 절차 — 막막함을 없애는 6단계 플로우 */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행 절차</p>
          <h2 className={bigHead}>
            정책자금 컨설팅,<br /><span className="text-blue-600">이렇게 진행됩니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            무엇부터 해야 할지 몰라도 괜찮습니다. 상담 신청부터 순서대로 안내해 드립니다.
          </p>
          <ol className="mx-auto mt-10 max-w-xl space-y-3">
            {processSteps.map((s, i) => (
              <li key={s.t} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-base font-black text-white" aria-hidden>
                  {i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[1.1rem] font-extrabold leading-snug text-slate-900">{s.t}</p>
                  <p className="mt-1 text-[0.98rem] leading-relaxed text-slate-600">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 정책자금·보증부 자금 실제 사례 (카톡 승인 공유) */}
      <FundingCasesSection />

      {/* 신청 전 자가진단 — 확인해두면 좋은 것들(배제가 아니라 안내) */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>신청 전 자가진단</p>
          <h2 className={bigHead}>
            미리 확인해두면<br /><span className="text-blue-600">진행이 한결 수월합니다</span>
          </h2>
          <div className="mx-auto mt-9 max-w-lg space-y-2.5">
            {readinessChecks.map((c) => (
              <div key={c} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-black text-blue-600" aria-hidden>✓</span>
                <p className="text-[1.05rem] font-semibold text-slate-800">{c}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed text-slate-500">
            위 항목에 해당되지 않는 부분이 있어도 상담은 가능합니다.
            진단 과정에서 대표님 상황에 맞는 방향을 함께 찾아드립니다.
          </p>
        </div>
      </section>

      {/* 정직한 진행 원칙 — 셀렉티브 포지셔닝 */}
      <section className={`bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-amber-300">저희가 지키는 원칙</p>
          <h2 className="mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.7rem]">
            저희도 모든 상담을<br /><span className="text-amber-300">계약으로 이어가지 않습니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base font-medium leading-relaxed text-slate-300 sm:text-lg">
            책임지지 못할 결과라면 시작하지 않는 것이, 서로에게 <b className="text-white">정직한 선택</b>이라고 믿습니다.
          </p>
          <div className="mt-10 space-y-4">
            {principles.map((p) => (
              <div key={p.n} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-black text-amber-300 sm:text-4xl">{p.n}</span>
                  <div className="min-w-0 pt-1">
                    <p className="text-lg font-black leading-snug text-white sm:text-xl">{p.t}</p>
                    <p className="mt-2 text-[1rem] leading-relaxed text-slate-300">{p.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 혜택 2 — 전자책 3종 증정 */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>구매 혜택</p>
          <h2 className={bigHead}>
            23만 7천 원에 판매 중인 전자책 3종,<br /><span className="text-blue-600">그대로 드립니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            현재 <b className="text-slate-900">정가 237,000원에 판매 중인 정책자금 셀프 진행 전자책 3종</b>을, 컨설팅을 마치고 리뷰를 남겨주시면 무료로 드립니다.
            이번에는 저희와 함께, <b className="text-slate-900">다음번에는 대표님이 직접</b> 하실 수 있습니다.
          </p>
          <div className="relative mx-auto mt-10 max-w-lg">
            <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3.5 py-1.5 text-sm font-black text-slate-900 shadow">컨설팅 종료 후 · 리뷰 작성 시</span>
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

      {/* 고객 후기 — 작성 시 전자책 3종 증정 */}
      <div id="reviews">
        <ProductReviews slug="funding-consulting" />
      </div>

      {/* 믿을 수 있는 이유 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>함께하면 좋은 이유</p>
          <h2 className={bigHead}>미래 AI 랩과 함께하시면<br /><span className="text-blue-600">이런 점이 다릅니다</span></h2>
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
              경험과 감에만 기대는 컨설팅과는 <span className="text-blue-600">다릅니다</span>
            </p>
            <p className="mx-auto mt-3 max-w-lg text-center text-[1.05rem] leading-relaxed text-slate-600 sm:text-[1.1rem]">
              직접 개발하고 전문가 검증을 거친 <b className="text-slate-900">자체 SaaS 프로그램</b>이
              자금·인증 심사 데이터를 반영해 진단 기준을 계속 다듬어 갑니다.
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
              <p className="flex items-center gap-1.5"><span aria-hidden>🎁</span> 컨설팅 종료 후 정가 237,000원 상당 전자책 3종 증정 (리뷰 작성 시)</p>
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

      {/* 유의사항 — 항목별로 투명하게 */}
      <section className="bg-white px-5 pb-4">
        <div className={`${inner} rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2 text-[0.98rem] leading-relaxed text-slate-500">
              <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">·</span>
              정책자금 승인, 대출 실행, 금리, 한도는 보장하지 않습니다. 기업의 업종·재무상태·신청 시점·기관 심사 기준에 따라 결과는 달라질 수 있습니다.
            </li>
            <li className="flex items-start gap-2 text-[0.98rem] leading-relaxed text-slate-500">
              <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">·</span>
              증정 전자책을 다운로드하신 후에는 결제 환불이 불가합니다.
            </li>
            <li className="flex items-start gap-2 text-[0.98rem] leading-relaxed text-slate-500">
              <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">·</span>
              신청 서류에는 정확한 정보를 제공해 주셔야 하며, 사실과 다른 정보로 인한 불이익은 책임지지 않습니다.
            </li>
          </ul>
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

          {/* 상담에서 벌어지는 일 3단계 — 신청 전 미리보기 */}
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {consultSteps.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-black uppercase tracking-wide text-blue-600">STEP {`0${i + 1}`}</span>
                <p className="mt-1.5 text-[1.05rem] font-extrabold text-slate-900">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-md text-center text-sm font-medium text-slate-500">
            상담은 여기까지가 전부입니다. <b className="text-slate-700">진행 여부는 방향을 들어보신 뒤, 대표님이 정하시면 됩니다.</b>
          </p>

          <div className="mt-8">
            <BusinessInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter
        topSlot={
          <Link to="/business-services" className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
            ← 서비스몰 홈으로
          </Link>
        }
      />

      {/* Mobile sticky CTA — 상담 모드에선 '가능 여부 확인' 진단형 프레이밍 */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          {inquiryOnly ? (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.92rem] font-black text-slate-900">우리 회사, 가능 여부 확인</span>
              <span className="block truncate text-xs font-medium text-slate-500">무료 상담 · 신청 1~2분</span>
            </span>
          ) : (
            <span className="flex shrink-0 items-baseline gap-1">
              <span className="text-xs font-medium text-slate-400 line-through">{LIST_PRICE}</span>
              <span className="text-lg font-black text-slate-900">{SALE_PRICE}</span>
            </span>
          )}
          <button type="button" onClick={handleBuy} className={`flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white ${inquiryOnly ? 'shrink-0' : 'flex-1'}`}>
            {inquiryOnly ? '상담 신청' : <><CartIcon /> 바로 결제하기</>}
          </button>
        </div>
      )}

    </div>
  )
}
