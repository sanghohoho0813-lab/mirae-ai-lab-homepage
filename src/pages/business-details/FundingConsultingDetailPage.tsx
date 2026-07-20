// 정책자금 컨설팅 — 전용 상세페이지 (장면형 랜딩 리디자인 · 슈가 컴퍼니류 리듬).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 흐름(장면): 히어로 → 막막함 → 기초 이해(큰 숫자) → 500,000원 기본 해결 → 선택(A/B/C)
//   → 비교표 → 신청과 다른 점(좌우) → 결과물 → 실제 사례 → 신뢰 → 전자책 → 절차(타임라인)
//   → 자가진단+FAQ → 최종 CTA → 유의사항.
// 카드 반복 대신 큰 문장·숫자 강조·타임라인·좌우 비교·통일 SVG 일러스트로 리듬을 만듦.
// ⚠️ 결제/PortOne/slug/amount/카탈로그/데이터 로직은 미변경 — 표현·구조만 재설계.
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import FundingCasesSection from '../../components/FundingCasesSection'
import { HeroScene, StuckScene, PlanScene, DocsScene } from '../../components/funding/FundingScenes'
import { getPackageBySlug } from '../../data/businessPackages'
import { paymentsEnabled, inquiryUrl, paymentsPreparingNotice } from '../../config/commerce'

const pkg = getPackageBySlug('funding-consulting')!
const EBOOK_IMG = '/assets/business-services/ebook-3set.webp'

// 할인 표기 (정가 100만원 → 판매가 50만원)
const LIST_PRICE = '100만원'
const SALE_PRICE = pkg.price // '50만원'
const DISCOUNT_RATE = '50%'

// (섹션 세로 여백은 각 scene 인라인 지정 — py-16 sm:py-24 기준)
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const pains = [
  '은행에선 거절당했는데, 정책자금은 가능할 수도 있다던데…',
  '믿을 만한 업체가 어디인지 모르겠어요',
  '수수료는 비싼데, 조금만 도움받으면 직접 할 수 있을 것 같아요',
  '종류가 너무 많아서, 뭐부터 봐야 할지 모르겠어요',
]

// 미루면 잃는 것 (짧은 라인 · 조작 통계·과도한 협박 금지)
const losses = [
  { icon: '⏳', t: '예산은 소진되면 끝', d: '8월부터 눈에 띄게 줄고, 연말엔 거의 남지 않습니다.' },
  { icon: '💸', t: '이자는 매달 불어남', d: '방향을 몰라 고금리로 버티는 동안 이자만 쌓입니다.' },
  { icon: '🚪', t: '경쟁사는 이미 활용', d: '비슷한 회사가 정책자금으로 투자하는 동안 격차가 벌어집니다.' },
]

// 자금 종류별 비교 (전자책 기준) — 카드론·캐피탈 / 일반 은행 / 정책자금
const loanCompare = [
  { k: '연이자율', card: '12~20%', bank: '5~8%', policy: '2~4% 수준' },
  { k: '상환 기간', card: '보통 1년 이내', bank: '3~5년', policy: '5~10년 (거치 포함)' },
  { k: '거치 기간', card: '없음', bank: '짧거나 없음', policy: '1~3년' },
  { k: '한도', card: '수백~수천만 원', bank: '신용·담보 따라', policy: '수천만 원~수억 원' },
  { k: '신용점수', card: '쓸수록 하락', bank: '과다 시 하락', policy: '정상 이용 시 유리' },
]

// 3가지 진행 방식 — 상품 A/B/C. 금액은 표시용(실결제는 서버 카탈로그가 최종 결정).
type PlanCta = 'buy' | 'inquiry'
type Plan = {
  key: 'A' | 'B' | 'C'
  name: string
  label: string
  priceMain: string
  priceSub: string
  points: string[]
  recommend: string
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
    points: ['기업 현황·자금 가능성 진단', '검토 기관·자금과 실행 순서 정리', '보완 항목 + 준비자료 안내'],
    recommend: 'AI·서류가 익숙하고 흐름을 아신다면, 이 진단만으로 충분합니다.',
    cta: 'buy',
    ctaLabel: '1회 컨설팅 결제하기',
  },
  {
    key: 'B',
    name: '자금조달 전부 위임형',
    label: '선택형',
    priceMain: '착수금 500,000원',
    priceSub: '+ 조달액의 3% (선택 시)',
    points: ['신청·서류·진행 전부 대행', '업계 성공수수료 5~7%보다 낮은 편', 'AX 구축은 미포함'],
    recommend: '사업이 바빠 직접 하기 어렵다면, 전 과정을 맡아 드립니다.',
    cta: 'inquiry',
    ctaLabel: '전부 위임형 가능성 확인',
  },
  {
    key: 'C',
    name: 'AX 결합 성장자금형',
    label: '선별 진행',
    priceMain: '착수금 500,000원',
    priceSub: '+ 조달액의 5% · 최대 1,500만원 (선택 시)',
    points: ['기업진단·업종별 비효율 분석', '핵심 MVP 구축', 'AI 기능·현장 테스트·성과 측정'],
    recommend: '자금을 넘어 AI 자동화까지. 프로그램도 함께 남습니다.',
    cta: 'inquiry',
    ctaLabel: 'AX 결합형 적합성 확인',
    featured: true,
  },
]

// A/B/C 빠른 비교표
type CompareCell = string | { main: string; sub: string }
const compareCols: { key: string; name: string; badge: string; featured?: boolean }[] = [
  { key: '1', name: '기본 진단', badge: '성과보수 없음', featured: true },
  { key: '2', name: '전부 위임형', badge: '선택형' },
  { key: '3', name: 'AX 결합형', badge: '선별 진행' },
]
const compareRows: { label: string; cells: CompareCell[] }[] = [
  { label: '기본 비용', cells: ['500,000원', '착수금 500,000원', '착수금 500,000원'] },
  {
    label: '성과보수',
    cells: [
      { main: '없음', sub: '500,000원으로 종료' },
      { main: '조달액 3%', sub: '전체 진행 시' },
      { main: '조달액 5%', sub: '최대 1,500만원' },
    ],
  },
  { label: '맡기는 범위', cells: ['방향·순서 정리', '신청·서류 대행', '전체 + AX 구축'] },
  { label: '업무자동화', cells: ['—', '미포함', '포함'] },
]

// 정직한 진행 원칙 3가지
const principles = [
  { n: '01', t: '무리한 진행을 권하지 않습니다', d: '가능성이 낮으면 낮다고 말씀드립니다. 성공수수료가 없으니 무리하게 권할 이유도 없습니다.' },
  { n: '02', t: '급한 돌려막기 자금은 말립니다', d: '사용 계획이 없다면, 자금보다 계획부터 잡는 게 맞습니다.' },
  { n: '03', t: '거절도 전략으로 만듭니다', d: '거절 사유를 파악해 기관·시점·서류를 바꿔 다시 도전합니다.' },
]

// 신청과 다른 점 — 미래 AI 랩이 더 보는 것 (좌우 비교의 우측)
const differenceRight = [
  '기업 현황·보완점까지 함께 정리',
  '필요하면 인증·특허·세금 환급·AX로 연결',
  '자금 이후 운영·다음 시점까지 관리',
]

// 컨설팅 후 남는 결과물
const resultItems = [
  '어디서나 쓸 수 있는 고퀄리티 사업계획서',
  '기업 현황 진단 요약',
  '우선 검토 자금·기관',
  '준비자료 목록',
  '보완해야 할 항목',
  '실행 순서 정리',
  '예상 질문과 대응 준비',
]

// 신뢰 스탯 (블로그 공개 실적 + 대표 자격)
const credStats = [
  { v: '100억+', l: '누적 자금조달' },
  { v: '9년+', l: '현장 경험' },
  { v: 'ISO 3종', l: '인증 심사원' },
]

// 진행 절차 6단계
const processSteps = [
  { t: '상담 신청', d: '홈페이지나 카톡으로 편하게 남겨주세요.' },
  { t: '기초 현황 확인', d: '사업 현황과 자금 목적을 간단히 확인합니다.' },
  { t: '가능성 진단', d: '적합한 자금·기관을 검토해 안내합니다.' },
  { t: '방향 결정', d: '진행 여부는 대표님이 직접 결정하십니다.' },
  { t: '서류 준비', d: '사업계획서 등 신청 서류를 지원합니다.' },
  { t: '신청·사후 안내', d: '신청부터 결과 확인, 다음 절차까지 안내합니다.' },
]

// 신청 전 자가진단
const readinessChecks = ['최근 연체 이력', '국세·지방세 체납', '4대보험 완납', '진행 중인 다른 대출']

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
  const rootRef = useRef<HTMLDivElement>(null)

  // 스크롤 등장(리빌) — 각 섹션 콘텐츠가 화면에 들어올 때 페이드+슬라이드업(토스풍)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('reveal-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )
    Array.from(root.querySelectorAll<HTMLElement>('section > div')).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
      el.classList.add('reveal-init')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const inquiryOnly = !paymentsEnabled
  function handleBuy() {
    if (inquiryOnly) { window.open(inquiryUrl, '_blank', 'noopener,noreferrer'); return }
    navigate(`/checkout/${pkg.slug}`)
  }

  useEffect(() => {
    document.title = '정책자금 컨설팅 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('buy') === '1') navigate(`/checkout/${pkg.slug}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 620)
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5"
        >
          1회 컨설팅 시작하기 →
        </a>
        <p className={`mt-2 text-xs font-medium leading-relaxed ${variant === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{paymentsPreparingNotice}</p>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={handleBuy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5"
        >
          <CartIcon /> 바로 결제하기
        </button>
        <p className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold ${variant === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>
          <span className="inline-flex items-center gap-1"><span className="text-emerald-400" aria-hidden>✔</span> 카드 할부 가능</span>
          <span className="inline-flex items-center gap-1"><span className="text-emerald-400" aria-hidden>✔</span> 결제 단계에서 개월 수 선택</span>
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
    <div ref={rootRef} className="min-h-screen bg-white pb-24 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
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

      {/* ── S1 Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-[760px] px-5 py-16 text-center sm:py-20">
          <p className="text-sm font-black tracking-wide text-blue-600">정책자금, 혼자 시작하기 어렵다면</p>
          <h1 className="mt-3 text-[2.4rem] font-black leading-[1.12] tracking-tight text-slate-900 sm:text-[3.4rem]">
            우선 방향부터<br /><span className="text-blue-600">정확히 정리해드립니다</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[1.05rem] font-medium leading-relaxed text-slate-500 sm:text-lg">
            이 단계만 이용하고 직접 진행하셔도 됩니다.
          </p>

          <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg ring-1 ring-slate-100">
            <span className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">500,000원</span>
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-black text-red-600">성과보수 없음</span>
          </div>

          <HeroScene className="mx-auto mt-9 max-w-sm" />

          <div className="mx-auto mt-8 max-w-sm">
            <BuyButtons variant="light" />
            <button type="button" onClick={() => scrollToId('plans')} className="mt-3 text-sm font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-900">
              진행 방식 비교하기 →
            </button>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span aria-hidden>🏆</span> 누적 자금조달 100억+</span>
            <span className="text-slate-300" aria-hidden>·</span>
            <span>9년 현장 경험</span>
            <span className="text-slate-300" aria-hidden>·</span>
            <span>ISO 3종 심사원</span>
          </div>
        </div>
      </section>

      {/* ── S2 막막함 ───────────────────────────────────────────── */}
      <section className="bg-[#faf7f0] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-center text-[2.1rem] font-black leading-[1.18] tracking-tight text-slate-900 sm:text-[3rem]">
            어디서부터 봐야 할지,<br /><span className="text-slate-400">막막하시죠.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-center text-[1.05rem] leading-relaxed text-slate-500">
            회사마다 가능한 기관도, 준비 순서도 다릅니다.
          </p>
          <StuckScene className="mx-auto mt-10 max-w-md" />

          <div className="mx-auto mt-10 max-w-lg space-y-3">
            {pains.map((p) => (
              <div key={p} className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100">
                <span className="mt-0.5 shrink-0 text-lg" aria-hidden>💬</span>
                <p className="text-[1.02rem] font-bold leading-snug text-slate-700">“{p}”</p>
              </div>
            ))}
          </div>

          <p className="mt-14 text-center text-[1.3rem] font-black leading-snug text-slate-900 sm:text-2xl">
            미루는 동안에도, <span className="text-rose-600">이자는 붙고 예산은 줄어듭니다.</span>
          </p>
          <div className="mx-auto mt-7 max-w-lg space-y-3">
            {losses.map((l) => (
              <div key={l.t} className="flex items-start gap-3">
                <span className="shrink-0 text-xl" aria-hidden>{l.icon}</span>
                <p className="text-[1rem] leading-snug text-slate-600"><b className="text-slate-900">{l.t}.</b> {l.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S3 기초 이해 (정책자금 vs 대출 · 큰 숫자) ─────────────── */}
      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px]">
          <p className="text-center text-sm font-black text-blue-600">정책자금이 처음이라면</p>
          <h2 className="mt-3 text-center text-[2rem] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[2.8rem]">
            일반 대출과 <span className="text-blue-600">뭐가 다를까요?</span>
          </h2>

          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div className="grid grid-cols-[minmax(46px,0.5fr)_1fr_1fr_1.05fr]">
              <div className="bg-slate-100" />
              <div className="bg-slate-500 px-1 py-3 text-center"><p className="text-[0.7rem] font-black leading-tight text-white sm:text-[0.8rem]">💳 카드론</p></div>
              <div className="bg-slate-700 px-1 py-3 text-center"><p className="text-[0.7rem] font-black leading-tight text-white sm:text-[0.8rem]">🏦 은행</p></div>
              <div className="bg-blue-600 px-1 py-3 text-center"><p className="text-[0.7rem] font-black leading-tight text-white sm:text-[0.8rem]">🏛️ 정책자금</p></div>
            </div>
            {loanCompare.map((r, i) => (
              <div key={r.k} className={`grid grid-cols-[minmax(46px,0.5fr)_1fr_1fr_1.05fr] ${i % 2 ? 'bg-slate-50/70' : 'bg-white'}`}>
                <div className="flex items-center bg-slate-100/70 px-2 py-3.5"><p className="text-[0.68rem] font-black leading-tight text-slate-600 sm:text-[0.78rem]">{r.k}</p></div>
                <div className="flex items-center justify-center px-1 py-3.5 text-center"><p className="text-[0.7rem] font-medium leading-snug text-slate-500 sm:text-[0.8rem]">{r.card}</p></div>
                <div className="flex items-center justify-center px-1 py-3.5 text-center"><p className="text-[0.7rem] font-medium leading-snug text-slate-500 sm:text-[0.8rem]">{r.bank}</p></div>
                <div className="flex items-center justify-center bg-blue-50/60 px-1 py-3.5 text-center"><p className="text-[0.72rem] font-bold leading-snug text-blue-700 sm:text-[0.82rem]">{r.policy}</p></div>
              </div>
            ))}
          </div>

          {/* 큰 숫자 — 이자 차이 */}
          <div className="mx-auto mt-12 max-w-xl text-center">
            <p className="text-[1.02rem] font-medium text-slate-500">1억 원을 카드론 15% vs 정책자금 3%로 빌리면</p>
            <p className="mt-2 text-[3rem] font-black leading-none tracking-tight text-slate-900 sm:text-[4.2rem]">
              연 <span className="text-blue-600">1,200만원</span>
            </p>
            <p className="mt-2 text-[1.1rem] font-bold text-slate-700">이자 차이. 5년이면 6,000만원이 넘습니다.</p>
            <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-slate-400">
              ※ 연이자율·거치·한도는 기관·상품·시점·신용에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── S4 기본 해결 (500,000원) ─────────────────────────────── */}
      <section className="bg-blue-50/40 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[2.1rem] font-black leading-[1.18] tracking-tight text-slate-900 sm:text-[3rem]">
            우선, <span className="text-blue-600">500,000원으로</span><br />방향부터 정리합니다.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[1.05rem] leading-relaxed text-slate-500">
            이 단계만 이용하고 직접 진행하셔도, <b className="text-slate-900">성과보수는 없습니다.</b>
          </p>

          <div className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row">
            <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">업계 평균 성공수수료</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-400 line-through decoration-red-400/70">5~7%</p>
              <p className="mt-1 text-sm text-slate-500">1억 실행 시 500~700만원</p>
            </div>
            <div className="flex-1 rounded-2xl bg-blue-600 p-6 shadow-lg shadow-blue-600/20">
              <p className="text-xs font-black uppercase tracking-wide text-blue-200">미래 AI 랩 진단·전략</p>
              <p className="mt-2 text-4xl font-black tracking-tight text-white">0원</p>
              <p className="mt-1 text-sm text-blue-100">비용은 50만원이 전부</p>
            </div>
          </div>

          <PlanScene className="mx-auto mt-11 max-w-md" />

          <p className="mt-11 text-[1.25rem] font-black text-slate-900 sm:text-2xl">
            50만원으로, <span className="text-blue-600">여기까지 해드립니다</span>
          </p>
          <div className="mx-auto mt-7 grid max-w-lg gap-x-7 gap-y-5 text-left sm:grid-cols-2">
            {[
              { icon: '🎯', t: '가장 적합한 기관·자금 판단', d: '승인 가능성이 높은 방향을 짚어드립니다.' },
              { icon: '📄', t: '필요 서류 안내', d: '무엇을 어떻게 준비할지 빠짐없이.' },
              { icon: '📝', t: '사업계획서 작성', d: '바로 신청만 하면 되는 상태까지.' },
              { icon: '🔁', t: '다음엔 직접 하실 수 있게', d: '스스로 진행하는 방법까지 알려드립니다.' },
            ].map((it) => (
              <div key={it.t} className="flex items-start gap-3">
                <span className="shrink-0 text-2xl" aria-hidden>{it.icon}</span>
                <div>
                  <p className="text-[1.05rem] font-extrabold leading-snug text-slate-900">{it.t}</p>
                  <p className="mt-0.5 text-[0.95rem] leading-relaxed text-slate-500">{it.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S5 선택 (A/B/C) ─────────────────────────────────────── */}
      <section id="plans" className="bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="text-center text-[2.1rem] font-black leading-[1.18] tracking-tight text-slate-900 sm:text-[3rem]">
            필요한 만큼만 <span className="text-blue-600">맡기세요.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[1.02rem] leading-relaxed text-slate-500">
            진단 후, 딱 필요한 범위까지만 선택하시면 됩니다.
          </p>

          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-3">
            {plans.map((p, i) => (
              <div
                key={p.key}
                className={`flex flex-col rounded-3xl border-2 bg-white p-5 sm:p-6 ${
                  p.featured ? 'border-blue-600 shadow-xl shadow-blue-600/10' : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl text-base font-black ${p.featured ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>{i + 1}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-black ${p.key === 'A' ? 'bg-emerald-50 text-emerald-700' : p.featured ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{p.label}</span>
                </div>
                <h3 className="mt-4 text-[1.22rem] font-black leading-snug tracking-tight text-slate-900">{p.name}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-500">{p.recommend}</p>
                <div className="mt-4 border-y border-slate-100 py-4">
                  <p className={`text-2xl font-black tracking-tight ${p.featured ? 'text-blue-700' : 'text-slate-900'}`}>{p.priceMain}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">{p.priceSub}</p>
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[0.92rem] leading-snug text-slate-700">
                      <span className={`mt-0.5 shrink-0 font-black ${p.featured ? 'text-blue-600' : 'text-slate-400'}`} aria-hidden>✓</span>{pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {p.cta === 'buy' && !inquiryOnly ? (
                    <button type="button" onClick={handleBuy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5">
                      <CartIcon /> {p.ctaLabel}
                    </button>
                  ) : p.cta === 'buy' ? (
                    <>
                      <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5">
                        1회 컨설팅 신청하기
                      </a>
                      <p className="mt-1.5 text-center text-[0.72rem] font-medium text-slate-400">카드결제 준비 중 · 신청 시 안내</p>
                    </>
                  ) : (
                    <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-[0.95rem] font-black shadow-sm transition-transform hover:-translate-y-0.5 ${p.featured ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                      {p.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S6 비교표 ───────────────────────────────────────────── */}
      <section className="bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-[860px]">
          <p className="text-center text-[1.02rem] font-bold text-slate-500">세 방식의 차이를 한눈에</p>
          <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
            <div className="grid grid-cols-[minmax(56px,0.7fr)_1fr_1fr_1fr]">
              <div className="bg-slate-100" />
              {compareCols.map((c) => (
                <div key={c.key} className={`px-1.5 py-3 text-center sm:px-2 ${c.featured ? 'bg-blue-600' : 'bg-slate-800'}`}>
                  <p className={`text-[0.82rem] font-black leading-tight sm:text-sm ${c.featured ? 'text-white' : 'text-slate-100'}`}>{c.name}</p>
                  <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold leading-none ${c.featured ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>{c.badge}</span>
                </div>
              ))}
            </div>
            {compareRows.map((row, ri) => (
              <div key={row.label} className={`grid grid-cols-[minmax(56px,0.7fr)_1fr_1fr_1fr] ${ri % 2 ? 'bg-slate-50/70' : 'bg-white'}`}>
                <div className="flex items-center bg-slate-100/70 px-2 py-3"><p className="text-[0.72rem] font-black leading-tight text-slate-600 sm:text-[0.8rem]">{row.label}</p></div>
                {row.cells.map((cell, ci) => {
                  const feat = compareCols[ci].featured
                  return (
                    <div key={ci} className={`flex flex-col items-center justify-center px-1.5 py-3 text-center sm:px-2 ${feat ? 'bg-blue-50/70' : ''}`}>
                      {typeof cell === 'string' ? (
                        <p className={`text-[0.78rem] font-bold leading-tight sm:text-[0.86rem] ${feat ? 'text-blue-700' : 'text-slate-700'}`}>{cell}</p>
                      ) : (
                        <>
                          <p className={`text-[0.78rem] font-bold leading-tight sm:text-[0.86rem] ${feat ? 'text-blue-700' : 'text-slate-700'}`}>{cell.main}</p>
                          <p className="mt-0.5 text-[0.62rem] font-medium leading-tight text-slate-400 sm:text-[0.68rem]">{cell.sub}</p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            ※ 성과보수(B 3%·C 5%)는 추가 진행을 선택하고 실제 조달된 경우에만 발생하며, 기본 1회 컨설팅(500,000원)에는 붙지 않습니다. 세부 기준은 개별 계약서에서 확정합니다.
          </p>
        </div>
      </section>

      {/* ── S7 신청과 다른 점 (좌우 비교) ────────────────────────── */}
      <section className="bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-center text-[2.1rem] font-black leading-[1.18] tracking-tight text-slate-900 sm:text-[3rem]">
            신청서만 쓰고 <span className="text-blue-600">끝내지 않습니다.</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">일반적인 진행</p>
              <ul className="mt-5 space-y-3">
                {['서류 작성', '신청', '여기서 종료'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[1.02rem] font-semibold text-slate-400">
                    <span aria-hidden>·</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-blue-600 bg-white p-6 shadow-lg shadow-blue-600/10">
              <p className="text-xs font-black uppercase tracking-wide text-blue-600">미래 AI 랩</p>
              <ul className="mt-5 space-y-3">
                {['기업 진단', ...differenceRight, '신청·사후 관리'].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[1.02rem] font-bold text-slate-800">
                    <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 정직한 원칙 — 다크 스트립(카드 아님) */}
          <div className="mt-8 rounded-3xl bg-slate-900 p-7 sm:p-9">
            <p className="text-center text-sm font-black tracking-wide text-amber-300">🤝 저희가 지키는 원칙</p>
            <div className="mt-6 space-y-5">
              {principles.map((p) => (
                <div key={p.n} className="flex items-start gap-4">
                  <span className="text-2xl font-black text-amber-300 sm:text-3xl">{p.n}</span>
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-black leading-snug text-white">{p.t}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-slate-300">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── S8 결과물 ───────────────────────────────────────────── */}
      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[2.1rem] font-black leading-[1.18] tracking-tight text-slate-900 sm:text-[3rem]">
            상담이 끝나도, <span className="text-blue-600">자료는 남습니다.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1.02rem] leading-relaxed text-slate-500">
            직접 신청하거나 내부에서 바로 쓰실 수 있게 정리해 드립니다.
          </p>
          <DocsScene className="mx-auto mt-9 max-w-sm" />
          <div className="mx-auto mt-9 grid max-w-xl gap-x-8 gap-y-0 text-left sm:grid-cols-2">
            {resultItems.map((d, i) => (
              <div key={d} className="flex items-center gap-3 border-b border-slate-100 py-3.5">
                <span className="shrink-0 font-black text-blue-600" aria-hidden>✓</span>
                <p className={`leading-snug ${i === 0 ? 'text-[1.05rem] font-black text-slate-900' : 'text-[1.02rem] font-semibold text-slate-700'}`}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S9 실제 사례 ────────────────────────────────────────── */}
      <FundingCasesSection />

      {/* ── S10 신뢰 ────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-center text-[2rem] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[2.8rem]">
            경험과 실적, <span className="text-blue-600">숫자로 말합니다</span>
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3">
            {credStats.map((s) => (
              <div key={s.l} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100">
                <p className="text-2xl font-black tracking-tight text-blue-600 sm:text-3xl">{s.v}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-bold text-amber-700">🏅 수상 경력</span>
            <span className="rounded-full bg-red-50 px-3.5 py-1.5 text-sm font-bold text-red-600">🚫 성공수수료 0원</span>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-900 p-7 text-center sm:p-9">
            <p className="text-[1.15rem] font-black text-white sm:text-xl">감이 아니라, <span className="text-sky-300">데이터로 진단합니다</span></p>
            <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-slate-300">
              직접 개발하고 전문가 검증을 거친 <b className="text-white">자체 SaaS</b>가 자금·인증 심사 데이터를 반영해 진단 기준을 계속 다듬어 갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── S11 전자책 보너스 ──────────────────────────────────── */}
      <section id="reviews" className="bg-amber-50/60 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-sm font-black text-amber-600">🎁 구매 혜택</p>
          <h2 className="mt-3 text-[1.9rem] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[2.6rem]">
            23만 7천 원 전자책 3종,<br /><span className="text-blue-600">그대로 드립니다</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1.02rem] leading-relaxed text-slate-500">
            컨설팅을 마치고 후기를 남겨주시면 무료로 보내드립니다.
          </p>
          <div className="relative mx-auto mt-10 max-w-lg">
            <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3.5 py-1.5 text-sm font-black text-slate-900 shadow">컨설팅 종료 후 · 후기 작성 시</span>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <img src={EBOOK_IMG} alt="정책자금·지원금 전자책 3종" loading="lazy" className="w-full" />
              <div className="flex items-center justify-center gap-2.5 border-t border-slate-100 px-6 py-4">
                <span className="text-base font-bold text-slate-400 line-through">23만 7천 원</span>
                <span aria-hidden className="text-slate-300">→</span>
                <span className="text-3xl font-black text-blue-600">0원</span>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-slate-400">
            ※ 증정 전자책을 다운로드하신 후에는 결제 환불이 불가합니다.
          </p>
        </div>
      </section>

      {/* ── S12 진행 절차 (타임라인) ───────────────────────────── */}
      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[560px]">
          <h2 className="text-center text-[2rem] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[2.8rem]">
            이렇게 <span className="text-blue-600">진행됩니다</span>
          </h2>
          <ol className="relative mt-12 space-y-7 border-l-2 border-blue-100 pl-9">
            {processSteps.map((s, i) => (
              <li key={s.t} className="relative">
                <span className="absolute -left-[49px] grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm font-black text-white ring-4 ring-white" aria-hidden>{i + 1}</span>
                <p className="text-[1.1rem] font-extrabold leading-snug text-slate-900">{s.t}</p>
                <p className="mt-1 text-[0.98rem] leading-relaxed text-slate-500">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── S13 자가진단 + FAQ ─────────────────────────────────── */}
      <section className="bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[720px]">
          <p className="text-center text-sm font-black text-blue-600">✅ 신청 전 체크</p>
          <h2 className="mt-3 text-center text-[1.8rem] font-black leading-[1.22] tracking-tight text-slate-900 sm:text-[2.4rem]">
            미리 확인해두면 <span className="text-blue-600">수월합니다</span>
          </h2>
          <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2">
            {readinessChecks.map((c) => (
              <span key={c} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100">✓ {c}</span>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-slate-500">
            해당되지 않는 부분이 있어도 상담은 가능합니다.
          </p>

          <h3 className="mt-16 text-center text-[1.7rem] font-black leading-[1.2] tracking-tight text-slate-900 sm:text-[2.1rem]">
            자주 묻는 질문
          </h3>
          <div className="mx-auto mt-8 max-w-[640px] space-y-3">
            {pkg.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between gap-3 text-[1.1rem] font-bold text-slate-900 marker:content-['']">
                  <span className="flex items-start gap-2"><span className="font-black text-blue-600" aria-hidden>Q</span><span>{f.q}</span></span>
                  <span className="ml-2 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 pl-6 text-[1rem] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── S14 최종 CTA ───────────────────────────────────────── */}
      <section className="bg-blue-600 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-[520px] text-center">
          <h2 className="text-[2.1rem] font-black leading-[1.18] tracking-tight text-white sm:text-[2.9rem]">
            일단 방향부터<br />확인해도 괜찮습니다.
          </h2>
          <div className="mt-8 rounded-3xl bg-white p-7 text-left shadow-2xl">
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-md bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900">{DISCOUNT_RATE} 할인</span>
              <span className="text-sm font-medium text-slate-400 line-through">정가 {LIST_PRICE}</span>
            </div>
            <p className="mt-2 text-center text-5xl font-black tracking-tight text-slate-900">{SALE_PRICE}</p>
            <p className="mt-2 text-center text-base font-black text-red-600">+ 성공수수료 없음</p>
            <ul className="mx-auto mt-6 max-w-xs space-y-2.5 border-t border-slate-100 pt-6">
              {pkg.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-[1rem] text-slate-700">
                  <span className="mt-0.5 font-black text-blue-500" aria-hidden>✓</span>{d}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <BuyButtons variant="light" />
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-[0.98rem] leading-relaxed text-slate-500">
              지금 결정 안 하셔도 괜찮아요.<br /><b className="text-slate-700">가능성만 먼저 확인</b>해 보세요. 확인은 무료예요.
            </p>
          </div>
        </div>
      </section>

      {/* 유의사항 */}
      <section className="bg-white px-5 pb-4 pt-14">
        <div className={`mx-auto max-w-[720px] rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <ul className="mt-3 space-y-2">
            {[
              '정책자금 승인·대출 실행·금리·한도는 보장하지 않습니다. 기업 상황·신청 시점·기관 심사 기준에 따라 결과는 달라질 수 있습니다.',
              '증정 전자책을 다운로드하신 후에는 결제 환불이 불가합니다.',
              '신청 서류에는 정확한 정보를 제공해 주셔야 하며, 사실과 다른 정보로 인한 불이익은 책임지지 않습니다.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[0.95rem] leading-relaxed text-slate-500">
                <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">·</span>{t}
              </li>
            ))}
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

      {/* Mobile sticky CTA */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          {inquiryOnly ? (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.92rem] font-black text-slate-900">우선 방향부터 확인</span>
              <span className="block truncate text-xs font-medium text-slate-500">500,000원 · 성과보수 없음</span>
            </span>
          ) : (
            <span className="flex shrink-0 items-baseline gap-1">
              <span className="text-xs font-medium text-slate-400 line-through">{LIST_PRICE}</span>
              <span className="text-lg font-black text-slate-900">{SALE_PRICE}</span>
            </span>
          )}
          <button type="button" onClick={handleBuy} className={`flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white ${inquiryOnly ? 'shrink-0' : 'flex-1'}`}>
            {inquiryOnly ? '시작하기' : <><CartIcon /> 바로 결제하기</>}
          </button>
        </div>
      )}
    </div>
  )
}
