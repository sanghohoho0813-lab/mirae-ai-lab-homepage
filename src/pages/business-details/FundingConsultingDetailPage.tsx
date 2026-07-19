// 정책자금 컨설팅 — 전용 상세페이지 (한국형 이커머스 "긴 세로 상세" 스타일).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 상단 구매영역(카페24형) + 긴 세로 배너 상세 + 예시 사례(추후 실제 데이터로 교체).
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

const band = 'px-5 py-10 sm:py-14'
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
  '정책자금 종류가 너무 많고, 운전자금은 급한데 뭐부터 봐야 할지 모르겠어요',
]

// 믿을 수 있는 이유 (블로그 공개 실적 기준)
const reasons = ['누적 자금조달 100억 원+', '기업성장컨설팅 실무 경력 8년+', '진단·전략·서류 준비까지']

// 신뢰 스탯 밴드 — 블로그(공개 성공사례)에서 확인되는 실적만 사용
const trustStats = [
  { value: '100억+', label: '누적 자금조달' },
  { value: '8년+', label: '실무 경력' },
  { value: '0원', label: '성공수수료' },
]

// 3가지 진행 방식 — 상품 A/B/C. 금액은 화면 표시용(A 실결제 금액은 서버 카탈로그가 최종 결정).
// ⚠️ 승인/승인금액 보장 표현 금지. 3%·5% 는 '실제 조달금액' 기준 성과보수(결과 보장 아님).
type PlanCta = 'buy' | 'inquiry'
type Plan = {
  key: 'A' | 'B' | 'C'
  name: string
  label: string // 카드 상단 배지 (성과보수 없음 / 선택형 / 선별 진행)
  priceMain: string
  priceSub: string
  points: string[] // 핵심 포함범위 (최대 5개)
  recommend: string // 카드 하단 추천 대상 한 줄
  cta: PlanCta
  ctaLabel: string
  featured?: boolean
}
const plans: Plan[] = [
  {
    key: 'A',
    name: '기업진단·자금전략 1회 컨설팅',
    label: '성과보수 없음',
    priceMain: '500,000원',
    priceSub: '이 금액으로 종료 가능',
    points: [
      '기업 현황·자금 가능성 진단',
      '우선 검토 기관·자금과 실행 순서 정리',
      '보완 항목 + 준비자료·체크리스트 안내',
    ],
    recommend: '방향만 정리하고 직접 진행하려는 경우',
    cta: 'buy',
    ctaLabel: '1회 컨설팅 결제하기',
  },
  {
    key: 'B',
    name: '자금조달 전부 위임형',
    label: '선택형',
    priceMain: '착수금 500,000원',
    priceSub: '+ 조달액의 3% (선택 시)',
    points: ['신청·서류·진행 전부 대행', '업계 성공수수료 5~7% 대비 낮은 편', 'AX 프로그램 구축은 미포함'],
    recommend: '자료 준비와 전체 진행을 맡기려는 경우',
    cta: 'inquiry',
    ctaLabel: '전부 위임형 가능성 확인',
  },
  {
    key: 'C',
    name: 'AX 결합 성장자금형',
    label: '선별 진행',
    priceMain: '착수금 500,000원',
    priceSub: '+ 조달액의 5% · 최대 1,500만원 한도 (선택 시)',
    points: ['기업진단 · 업종별 비효율 분석', '프로토타입 · 핵심 MVP 구축', '선택적 AI 기능 · 현장 테스트 · 성과 측정'],
    recommend: '자금조달과 실제 업무혁신을 함께 추진하려는 경우',
    cta: 'inquiry',
    ctaLabel: 'AX 결합형 적합성 확인',
    featured: true,
  },
]

// A/B/C 빠른 비교표 — 카드(대상·가격·포함범위)와 역할 분리, 상품 차이만 압축.
// 시각 우선순위: 1) 500,000원 기본 진단 2) 맡기는 범위 3) 선택형 성과보수 조건. (표 안에는 CTA 없음)
type CompareCell = string | { main: string; sub: string }
const compareCols: { key: 'A' | 'B' | 'C'; name: string; badge: string; featured?: boolean }[] = [
  { key: 'A', name: '기본 진단', badge: '성과보수 없음', featured: true },
  { key: 'B', name: '전부 위임형', badge: '선택형' },
  { key: 'C', name: 'AX 결합형', badge: '선별 진행' },
]
const compareRows: { label: string; cells: CompareCell[] }[] = [
  { label: '기본 비용', cells: ['500,000원', '착수금 500,000원', '착수금 500,000원'] },
  {
    label: '성과보수',
    cells: [
      { main: '없음', sub: '500,000원으로 종료 가능' },
      { main: '조달액의 3%', sub: '전체 진행 시' },
      { main: '조달액의 5%', sub: '최대 1,500만원 한도' },
    ],
  },
  { label: '맡기는 범위', cells: ['방향·순서 정리', '신청·서류 전체 대행', '전체 진행 + AX 구축'] },
  { label: '업무자동화·AI', cells: ['—', '미포함', '포함'] },
]

// 정직한 진행 원칙 3가지 — '아무나 받지 않는' 셀렉티브 포지셔닝 (과장 없이)
const principles = [
  { n: '01', t: '무리한 진행을 권하지 않습니다', d: '가능성이 낮으면 낮다고 그대로 말씀드립니다. 성공수수료가 없으니 무리하게 권할 이유도 없습니다.' },
  { n: '02', t: '급한 돌려막기용 자금은 말립니다', d: '사용 계획이 없다면, 자금보다 계획부터 함께 잡는 것이 맞다고 봅니다.' },
  { n: '03', t: '거절도 전략으로 만듭니다', d: '거절 사유를 정확히 파악해 기관·시점·서류를 바꿔 다시 도전합니다.' },
]

// "단순 신청 지원과 다른 점" — 담백한 3가지 (과장 표현 없이)
const beyondFunding = [
  { icon: '🔍', t: '자금 가능성만 보지 않습니다', d: '현재 재무·매출 현황과 보완이 필요한 부분을 함께 정리해, 이번 자금뿐 아니라 다음 준비까지 이어지도록 합니다.' },
  { icon: '🌱', t: '필요하면 성장 요소로 연결합니다', d: '상황에 따라 인증·특허·세금 환급·AX(업무자동화) 등 성장에 필요한 요소를 함께 검토합니다.' },
  { icon: '🔁', t: '결과 이후까지 이어갑니다', d: '자금 조달 이후의 운영·유지관리와 다음 자금 시점까지 함께 관리합니다.' },
]

// 1회 컨설팅 후 남는 결과물 (기능명 나열이 아니라 고객이 받는 결과 중심)
const resultItems = [
  '기업 현황 진단 요약',
  '우선 검토 자금·기관',
  '준비자료 목록',
  '보완해야 할 항목',
  '실행 순서 정리',
  '예상 질문과 대응 준비',
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
          onClick={() => window.open(inquiryUrl, '_blank', 'noopener,noreferrer')}
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
            <p className="mt-1.5 text-base font-black text-red-600">업계 평균 성공수수료 5~7%, 저희는 받지 않습니다</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">이 1회 컨설팅만 이용하고 직접 진행하셔도 됩니다. 전체 대행·AX 구축은 선택사항입니다.</p>
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

      {/* 문제제기 + 문제심화 — 하나로 합본(고민 → 미루면 손해 → 기초설명으로 자연스럽게 연결) */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-4xl">🤔</div>
          <p className={kicker}>이런 고민, 있으셨죠?</p>
          <h2 className={bigHead}>정책자금, <span className="text-blue-600">시작이 제일 막막하죠</span></h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {pains.map((p) => (
              <div key={p} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white" aria-hidden>?</span>
                <p className="mt-3 text-[1.2rem] font-bold leading-snug text-slate-800 sm:text-[1.35rem]">“{p}”</p>
              </div>
            ))}
          </div>

          {/* 전환 — 고민이 손해로 이어짐 */}
          <p className="mt-12 text-center text-xl font-black leading-snug text-slate-900 sm:text-2xl">
            그런데 결정을 미루는 동안에도, <span className="text-red-600">이자는 불어나고 기회는 사라지고 있습니다.</span>
          </p>

          {/* 문제심화 — 미루면 잃는 것 */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {losses.map((l) => (
              <div key={l.t} className="flex flex-col rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-sm" aria-hidden>{l.icon}</span>
                <p className="mt-3 text-[1.2rem] font-extrabold leading-snug text-slate-900">{l.t}</p>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-600">{l.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-center sm:p-7">
            <p className="text-lg font-black leading-snug text-white sm:text-xl">
              막막하게 느껴지는 건, <span className="text-amber-300">아직 정책자금이 낯설기 때문</span>입니다.
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-400">그래서 먼저, 정책자금이 일반 대출과 어떻게 다른지부터 쉽게 짚어보겠습니다.</p>
          </div>
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
            정책자금도 심사 절차를 거치기 때문에, 먼저 <b className="text-slate-700">우리 회사에 맞는 방향인지 확인하는 것</b>이 첫 단계입니다.
          </p>
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
          <p className="mt-12 text-center text-xl font-black text-slate-900 sm:text-2xl">
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
        </div>
      </section>

      {/* ── 3가지 진행 방식 (상품 A/B/C) + 비교표 — '왜 미래 AI 랩' 바로 앞 배치 ─────── */}
      <section className={`bg-white ${band}`}>
        <div className="mx-auto max-w-[1000px]">
          <p className={kicker}>진행 방식</p>
          <h2 className={bigHead}>
            우선 500,000원으로<br /><span className="text-blue-600">방향부터 정확히 정리합니다</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base font-medium leading-relaxed text-slate-600">
            기업 현황과 자금 가능성 진단부터 — 어떤 기관·자금을 어떤 순서로 준비할지, 필요한 서류와 보완점까지 한 번에 정리해 드립니다.
            <b className="text-slate-900"> 실제로 많은 대표님이 이 500,000원 1회 진단만으로 방향을 잡고 직접 신청까지 진행</b>하시고, 그때도 성과보수는 없습니다.
          </p>

          {/* 밑밥 — 500,000원으로 어디까지 / 언제 3%·5%인지 단계별 안내 */}
          <div className="mx-auto mt-8 max-w-2xl space-y-3">
            {/* 1단계 — 기본 진단 */}
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">1</span>
                <span className="text-[1.05rem] font-black text-slate-900">먼저, 500,000원 기본 진단</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">성과보수 없음</span>
              </div>
              <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-700">
                AI 도구를 어느 정도 다뤄보셨고 정책자금 흐름을 아시는 대표님이라면, <b className="text-slate-900">이 500,000원 진단만으로 방향을 잡고 직접 신청까지</b> 충분히 하실 수 있습니다. 여기서 끝내셔도 되고, <b className="text-slate-900">그때는 추가 비용(성과보수)이 전혀 없습니다.</b>
              </p>
            </div>
            {/* 2단계 — 전부 위임형 3% */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-sm font-black text-white">2</span>
                <span className="text-[1.05rem] font-black text-slate-900">그럼에도 너무 바쁘시다면, 전부 위임형</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600">조달액 3%</span>
              </div>
              <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-700">
                사업이 너무 바빠 서류 작성·기관 가입·신청까지 직접 하기 어렵거나, <b className="text-slate-900">AI·컴퓨터 다루는 게 익숙하지 않고 시간이 안 되는</b> 대표님은 — 신청·서류·진행 전 과정을 저희가 대신 맡습니다. 성과보수 3%는 <b className="text-slate-900">실제로 자금이 조달된 경우에만</b> 발생합니다.
              </p>
            </div>
            {/* 3단계 — AX 결합형 5% */}
            <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/40 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">3</span>
                <span className="text-[1.05rem] font-black text-slate-900">더 나아가 AI 자동화까지, AX 결합형</span>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-black text-white">조달액 5%</span>
              </div>
              <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-700">
                우리 회사를 <b className="text-slate-900">AI 시대에 맞게 바꿔줄 업무 자동화 프로그램까지</b> 원하신다면 여기까지 함께합니다. <b className="text-slate-900">정책자금만 받고 끝나는 게 아니라</b>, 회사에 맞는 자동화 프로그램이 함께 남고 — 그 힘으로 <b className="text-slate-900">억 단위 자금 조달 가능성</b>도 높아집니다.
              </p>
              <ul className="mt-3 space-y-1.5">
                {[
                  '정부도 중소기업 AI 전환·디지털화를 적극 지원하는 추세입니다',
                  '그래서 억 단위 규모로 도전하는 경우가 많습니다',
                  '성과보수 5%는 업계 평균 5~7%보다 낮은 편이고, 최대 1,500만원 한도입니다',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[0.92rem] leading-relaxed text-slate-700">
                    <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-black uppercase tracking-widest text-slate-400">진단 후, 필요한 범위까지만 선택하세요</p>
          <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.key}
                className={`flex flex-col rounded-3xl border-2 bg-white p-5 sm:p-6 ${
                  p.featured ? 'border-blue-600 shadow-xl shadow-blue-600/10' : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-black ${p.featured ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>{p.key}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                      p.key === 'A' ? 'bg-emerald-50 text-emerald-700' : p.featured ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
                <h3 className="mt-4 text-[1.25rem] font-black leading-snug tracking-tight text-slate-900">{p.name}</h3>

                <div className="mt-4 border-y border-slate-100 py-4">
                  <p className={`text-2xl font-black tracking-tight ${p.featured ? 'text-blue-700' : 'text-slate-900'}`}>{p.priceMain}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">{p.priceSub}</p>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[0.95rem] leading-snug text-slate-700">
                      <span className={`mt-0.5 shrink-0 font-black ${p.featured ? 'text-blue-600' : 'text-slate-400'}`} aria-hidden>✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-[0.82rem] font-semibold leading-snug text-slate-600">
                  <span className="text-slate-400">추천</span> · {p.recommend}
                </p>

                <div className="mt-4">
                  {p.cta === 'buy' && !inquiryOnly ? (
                    <button
                      type="button"
                      onClick={handleBuy}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <CartIcon /> {p.ctaLabel}
                    </button>
                  ) : p.cta === 'buy' ? (
                    // 결제 준비 중(paymentsEnabled=false): A 도 상담 신청으로 우회
                    <>
                      <a
                        href={inquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5"
                      >
                        1회 컨설팅 신청하기
                      </a>
                      <p className="mt-1.5 text-center text-[0.72rem] font-medium text-slate-400">카드결제 준비 중 · 신청 시 결제 방법 안내</p>
                    </>
                  ) : (
                    <a
                      href={inquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-[0.95rem] font-black shadow-sm transition-transform hover:-translate-y-0.5 ${
                        p.featured ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {p.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── 세 방식 빠른 비교표 (카드 바로 다음 · 짧은 연결문장만) ─────── */}
          <p className="mx-auto mt-10 max-w-xl text-center text-[0.95rem] font-semibold text-slate-500">
            세 가지 방식의 차이를 한눈에 비교해 보세요.
          </p>
          <div className="mx-auto mt-5 max-w-3xl overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
            {/* 헤더 */}
            <div className="grid grid-cols-[minmax(56px,0.7fr)_1fr_1fr_1fr]">
              <div className="bg-slate-100" />
              {compareCols.map((c) => (
                <div key={c.key} className={`px-1.5 py-3 text-center sm:px-2 ${c.featured ? 'bg-blue-600' : 'bg-slate-800'}`}>
                  <p className={`text-[0.68rem] font-bold ${c.featured ? 'text-blue-200' : 'text-slate-400'}`}>{c.key}</p>
                  <p className={`text-[0.82rem] font-black leading-tight sm:text-sm ${c.featured ? 'text-white' : 'text-slate-100'}`}>{c.name}</p>
                  <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold leading-none ${c.featured ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                    {c.badge}
                  </span>
                </div>
              ))}
            </div>
            {/* 행 */}
            {compareRows.map((row, ri) => (
              <div key={row.label} className={`grid grid-cols-[minmax(56px,0.7fr)_1fr_1fr_1fr] ${ri % 2 ? 'bg-slate-50/70' : 'bg-white'}`}>
                <div className="flex items-center bg-slate-100/70 px-2 py-3">
                  <p className="text-[0.72rem] font-black leading-tight text-slate-600 sm:text-[0.8rem]">{row.label}</p>
                </div>
                {row.cells.map((cell, ci) => {
                  const feat = compareCols[ci].featured
                  return (
                    <div key={ci} className={`flex flex-col items-center justify-center px-1.5 py-3 text-center sm:px-2 ${feat ? 'bg-blue-50/70' : ''}`}>
                      {typeof cell === 'string' ? (
                        <p className={`text-[0.78rem] font-bold leading-tight sm:text-[0.86rem] ${feat ? 'text-blue-700' : 'text-slate-700'}`}>{cell}</p>
                      ) : (
                        <>
                          <p className={`text-[0.78rem] font-bold leading-tight sm:text-[0.86rem] ${feat ? 'text-blue-700' : 'text-slate-700'}`}>{cell.main}</p>
                          <p className="mt-0.5 text-[0.64rem] font-medium leading-tight text-slate-400 sm:text-[0.7rem]">{cell.sub}</p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            ※ 성과보수(B 3%·C 5%)는 <b className="text-slate-500">추가 진행을 선택</b>하고 <b className="text-slate-500">실제로 자금이 조달된 경우에만</b> 발생하며, 기본 1회 컨설팅(500,000원)에는 자동으로 붙지 않습니다.
            조달 성공이나 특정 금액을 보장하지 않으며, 성과보수 발생 시점·조달금액 정의·상한 등 세부 기준은 개별 계약서에서 확정합니다.
          </p>
        </div>
      </section>

      {/* 왜 미래 AI 랩 — 단순 신청 지원과 다른 점(담백한 3가지) */}
      <section className={`bg-blue-50/50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>단순 신청 지원과 다른 점</p>
          <h2 className={bigHead}>
            자금만 보고<br /><span className="text-blue-600">끝내지 않습니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            신청서 작성을 넘어, <b className="text-slate-900">현황 정리부터 자금 이후 관리까지</b> 필요한 만큼 함께 봅니다.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {beyondFunding.map((b) => (
              <div key={b.t} className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-2xl" aria-hidden>{b.icon}</span>
                <p className="mt-3 text-[1.15rem] font-extrabold leading-snug text-slate-900">{b.t}</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">{b.d}</p>
              </div>
            ))}
          </div>
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
          <p className={kicker}>믿을 수 있는 이유</p>
          <h2 className={bigHead}>경험과 실적,<br /><span className="text-blue-600">데이터로 뒷받침합니다</span></h2>
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
          <p className={kicker}>컨설팅 후 남는 결과물</p>
          <h2 className={bigHead}>상담만 받고 끝나지 않고,<br /><span className="text-blue-600">정리된 자료로 남습니다</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-base leading-relaxed text-slate-600">
            대표님이 이후에 직접 실행하거나 내부에서 공유할 수 있도록, 현황부터 자금 방향과 실행 순서까지 정리해 드립니다.
          </p>
          <div className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
            {resultItems.map((d, i) => (
              <div key={d} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{`0${i + 1}`}</span>
                <p className="text-[1.05rem] font-bold leading-snug text-slate-800">{d}</p>
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
