// AX 사업화·자금조달 프로그램 — 구매설득(상세) 페이지.
// 라우트: /business-services/funding-consulting
// 감정 순서: ① 내 이야기다 → ② 이유를 알겠다 → ③ 방법이 보인다 → ④ 실제로 보인다 → ⑤ 빠르다
//           → ⑥ 부담이 적다 → ⑦ 여기가 다르다 → ⑧ 진단받아봐야겠다
// 순서: 히어로 / 고객의 현실 / 사업계획서만으로 부족한 이유 / 정부 정책방향과 AX / AX 혁신전환 4단계 /
//      실제 사례 Before→After / 업종별 AX 화면 / 최대 2주 진행과정 / 최종 결과물 / 가격과 결제시점(1회) /
//      비교 3열 / 김팀장과 월 5개사 / 자금 이후 생애주기 / FAQ / 최종 CTA
// 원칙: 한 섹션 한 메시지, 문단은 2~3문장, 가격은 딱 한 번, 어려운 단어는 짧은 예시와 함께.
// ⚠️ 승인·조달 보장 표현 금지. 가격 500/1,000/1,500 표기는 가격 섹션에서만 노출한다.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import ConsultModal from '../../components/ConsultModal'
import AxIndustryShowcaseV2 from '../../components/ax-showcase/AxIndustryShowcaseV2'
import AxLifecycleModules from '../../components/ax-showcase/AxLifecycleModules'
import AxBuildStageCards from '../../components/ax-showcase/AxBuildStageCards'
import AxJudgeCaseSection from '../../components/ax-showcase/AxJudgeCaseSection'
import { AxHowWeBuildSection } from '../../components/ax-showcase/axRenewalHome'
import { AxCoreValuesSection, AxMethodSection, AxSelectionSection } from '../../components/ax-showcase/axHomeSections'
import AxPolicyEvidenceStrip from '../../components/ax-showcase/AxPolicyEvidenceStrip'
import { axV2Industry } from '../../data/axIndustryShowcaseV2'
import AxPackageComparison from '../../components/ax-showcase/AxPackageComparison'
import AxProcessSection from '../../components/ax/AxProcessSection'
import AxPolicyShift from '../../components/ax/AxPolicyShift'
import KakaoFloat from '../../components/KakaoFloat'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../../lib/consultApi'
import { FLAGSHIP } from '../../data/corePrograms'
import { AX_BUILD_PAYMENT, AX_PACKAGES } from '../../data/axPackages'

// ── 공통 스타일 토큰 ───────────────────────────────────────────────────────
const band = 'px-5 py-10 sm:py-16'
const inner = 'mx-auto max-w-[820px]'
// 한글 머리말이라 자간을 벌리지 않는다
const kicker = 'text-center text-[1.1rem] font-black tracking-tight text-teal-600 sm:text-[1.3rem]'
const bigHead =
  'mt-2.5 text-center text-[1.5rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[2.6rem]'
const lead = 'mx-auto mt-4 max-w-xl text-center text-[1.15rem] leading-relaxed text-slate-600 sm:text-[1.573rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── 2. 고객의 현실 ─────────────────────────────────────────────────────────
const AWARDS = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상 · 경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국 사회공헌 K-컬처 나눔봉사공헌대상 · 벤처부문' },
]

const REALITY = [
  '이미 받은 대출이 있어 추가 한도가 막혀 있습니다.',
  '업력이 짧아 보여줄 수 있는 실적이 많지 않습니다.',
  '신설법인이라 과거 자료로 설명할 것이 거의 없습니다.',
  '기술과 차별성은 있는데 서류로 옮기기가 어렵습니다.',
  '매번 소액만 받아 급한 운영비만 막고 다시 제자리입니다.',
]

// ── 3. 사업계획서만으로 부족한 이유 ────────────────────────────────────────
const PLAN_LINES = [
  '사업계획서 작성에서 끝나지 않습니다.',
  '사업계획과 실제 실행구조를 함께 만듭니다.',
  '문서와 화면이 같은 방향을 말하도록 연결합니다.',
  '정책자금 전략, 사업계획과 AX 프로그램을 하나의 프로젝트로 진행합니다.',
]

// ── 6. 진행형 사례 — 자금승인 완료 사례가 아니라 현재 진행단계 ─────────────
const CASE_A = {
  label: '현장 서비스기업 A사',
  problems: [
    '작업 요청이 전화와 메신저로 흩어져 기록이 남지 않습니다.',
    '고객별 작업이력이 담당자 머릿속에만 있습니다.',
    '처리량을 늘리려면 사람을 더 뽑아야 하는 구조입니다.',
    '자금을 신청해도 성장 근거를 숫자로 설명하기 어렵습니다.',
  ],
  changes: [
    '요청 접수부터 배정·완료까지 한 화면에서 처리합니다.',
    '고객·현장·작업이력이 날짜별로 쌓입니다.',
    '현장 직원은 스마트폰으로 사진과 결과를 바로 올립니다.',
    '관리자는 오늘 할 일과 누락 업무를 한눈에 확인합니다.',
    '작업 데이터가 쌓여 처리량과 단가를 숫자로 설명합니다.',
    '이 구조를 그대로 사업계획서와 심사 설명자료에 연결합니다.',
  ],
  before: '인력과 운영비가 필요합니다.',
  after: '현장업무를 데이터화하고, 고객과 작업이력 관리 시스템을 구축해 서비스 범위와 처리량을 확대합니다.',
  status: '자금전략 · AX 화면 · 설명자료 준비 중',
  notice: '자금승인 완료 사례가 아니라 현재 진행단계입니다.',
}

// ── 9. 최종 결과물 5종 ─────────────────────────────────────────────────────
const DELIVERABLES = [
  { t: '자금조달 전략', d: '어떤 기관에 어떤 순서로 신청할지 정리합니다.' },
  { t: '사업계획과 자금사용계획', d: '받은 자금을 어디에 쓰고 무엇이 좋아지는지 설명합니다.' },
  { t: 'AX 업무 흐름', d: '지금 일하는 방식이 어떻게 바뀌는지 한 장으로 정리합니다.' },
  { t: 'MVP 또는 선택 단계 프로그램', d: '실제로 열어서 보여줄 수 있는 화면을 드립니다.' },
  { t: '이후 성장 로드맵', d: '자금조달 다음에 무엇을 준비할지 순서를 정합니다.' },
]
const DELIVERABLE_SHOTS = [
  { img: '/ax-cases/flow.webp', cap: 'AX 업무 흐름 정리 예시 — 오늘 먼저 처리할 일' },
  { img: '/ax-cases/screen.webp', cap: '실제로 보여줄 수 있는 프로그램 화면 예시' },
]

// ── 11. 비교 3열 ───────────────────────────────────────────────────────────
const COMPARE = [
  {
    label: '일반 정책자금 컨설팅',
    items: ['사업계획서와 신청서류 중심', '실제 화면과 시스템은 별도', '개발업체에 사업을 다시 설명', '자금 이후 실행까지 이어지지 않을 수 있음'],
    highlight: false,
  },
  {
    label: '일반 개발회사',
    items: ['정책자금 심사와 자금논리는 다루지 않음', '처음부터 큰 개발범위로 견적', '착수금·중도금을 먼저 지급', '개발이 사업계획과 따로 진행'],
    highlight: false,
  },
  {
    label: '미래AI랩',
    items: [
      '정책자금 전략과 사업계획을 직접 설계',
      '개발 담당자가 처음부터 같은 프로젝트에 참여',
      '100만원으로 방향과 화면부터 확인',
      '최대 2주 안에 결과물 완성 목표',
      '본개발비는 자금조달 이후 정산',
      '지원금·인증·복지기금·절세까지 다음 단계 연결',
    ],
    highlight: true,
  },
]


// ── 공통 조각 ──────────────────────────────────────────────────────────────
function Shot({ src, alt, ratio = 'aspect-[16/10]', tone = 'light' }: { src: string; alt: string; ratio?: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border ${tone === 'dark' ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-slate-100'} ${ratio}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  )
}

// "예를 들어" 예시 상자 (업종명 + 실제 행동, 2문장 이내)
function Example({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-teal-100 bg-teal-50/70 px-4 py-3">
      <span className="mt-0.5 shrink-0 rounded-md bg-teal-500 px-2 py-0.5 text-[1.1rem] sm:text-[1.3rem] font-black text-white">예를 들어</span>
      <p className="text-[1.17rem] sm:text-[1.378rem] leading-relaxed text-slate-700">{children}</p>
    </div>
  )
}

// 꼭 남겨야 하는 용어용 미니 툴팁(ⓘ) — 탭(모바일)·클릭(PC) 모두 열림
function Tip({ term, children, className = '' }: { term: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-0.5 font-bold underline decoration-dotted underline-offset-2"
      >
        {term}
        <span aria-hidden className="text-[0.72em] opacity-70">ⓘ</span>
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-20 mt-1.5 w-64 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2.5 text-[1.1rem] sm:text-[1.3rem] font-medium leading-relaxed text-slate-100 shadow-xl"
        >
          {children}
        </span>
      )}
    </span>
  )
}

// 반복되는 CTA 묶음 — 3분 AX 진단 + 상담 신청
function CtaButtons({ dark = false, onConsult }: { dark?: boolean; onConsult: () => void }) {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
      <Link
        to="/business-diagnosis"
        className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-teal-400 px-6 text-[1.29rem] sm:text-[1.521rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5"
      >
        3분 AX 진단
      </Link>
      <button
        type="button"
        onClick={onConsult}
        className={`flex min-h-[52px] flex-1 items-center justify-center rounded-xl border px-6 text-[1.26rem] sm:text-[1.495rem] font-bold transition-colors ${
          dark ? 'border-white/25 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
        }`}
      >
        상담 신청
      </button>
    </div>
  )
}

function Guarantee({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`mx-auto mt-6 max-w-md text-center text-[1.1rem] sm:text-[1.3rem] leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      자금조달 결과·금액은 기관 심사에 따라 달라지며 보장되지 않습니다.
    </p>
  )
}

export default function FundingConsultingDetailPage() {
  const [showBar, setShowBar] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [consult, setConsult] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  // 홈의 '더 알아보기'에서 넘어온 업종. 없으면 일반 진입으로 취급한다.
  const requestedIndustry = axV2Industry(searchParams.get('industry') ?? '')?.slug

  const openConsult = () => setConsult(true)
  // A·B·C 카드에서 어떤 프로그램으로 상담을 신청했는지 메일에 함께 실어 보낸다.
  const [consultProgram, setConsultProgram] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  // 해시(#process 등)로 진입/이동 시 해당 앵커로 스크롤.
  // 위쪽 이미지가 늦게 자리를 잡으면 한 번의 스크롤로는 어긋나므로 몇 차례 다시 맞춘다.
  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id) return
    const go = () => {
      const el = document.getElementById(id)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
    }
    go()
    const timers = [80, 250, 600, 1000].map((d) => window.setTimeout(go, d))
    window.addEventListener('load', go, { once: true })
    return () => { timers.forEach(clearTimeout); window.removeEventListener('load', go) }
  }, [location.hash])

  // 스크롤 리빌
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

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 최종 CTA 노출 시 모바일 고정 바 숨김(중복 방지)
  useEffect(() => {
    const el = finalCtaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen bg-white pb-24 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          {/* 로고는 좁은 화면에서 줄어들 수 있게(min-w-0 + truncate), 우측 버튼은 줄어들지 않게(shrink-0) */}
          <Link to="/business-services" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm sm:text-[1.137rem] font-black tracking-tight text-sky-400">AI</span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[1.2rem] sm:text-[1.417rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              {/* 모바일에는 3분 AX 진단 버튼이 함께 놓여 자리가 없다 — 부제는 sm 이상에서만 */}
              <span className="hidden break-keep text-[1.09rem] font-medium text-slate-500 lg:block">Mirae AI Lab · <b className="font-bold text-slate-800">중소기업 AX · AI Growth</b></span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <Link to="/business-services" className="hidden text-[1.2rem] sm:text-[1.417rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">서비스몰 홈</Link>
            <Link to="/business-diagnosis" className="whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-[1.2rem] sm:px-4 sm:text-[1.417rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
              3분 AX 진단
            </Link>
            <HeaderAccount />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-2.5 text-[1.1rem] text-slate-500 sm:px-6 sm:text-[1.3rem]">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">자금·지원금</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">AX 사업화·자금조달 프로그램</span>
        </div>
      </div>

      {/* ── 1. Hero — 내 이야기다 ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 py-12 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1.5 text-[1.1rem] sm:text-[1.3rem] font-bold text-amber-200 backdrop-blur">
            정책자금 × <Tip term="AX" className="text-amber-200">AI 전환(AI Transformation). 사람이 반복하던 업무를 자동화·디지털화해 회사 운영 방식을 바꾸는 것.</Tip> 혁신전환
          </span>
          <h1 className="mt-5 text-[1.87rem] font-black leading-[1.28] tracking-tight text-white sm:text-[3.12rem] sm:leading-[1.18]">
            정책자금, 계속 거절당하거나<br /><span className="text-amber-300">몇천만원</span>에서 멈추셨나요?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[1.29rem] leading-relaxed text-slate-300 sm:text-[1.521rem]">
            이제는 디지털 전환을 넘어 AI 전환, <b className="font-bold text-amber-300">AX의 시대</b>입니다.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[1.33rem] font-bold leading-relaxed text-white sm:text-[1.573rem]">
            <span className="text-amber-300">최소 1억원 이상</span> 정책자금을 목표로, 자금을 받을 이유가 보이는 AX 혁신기업 구조를 만듭니다.
          </p>
          <p className="mx-auto mt-3.5 max-w-xl text-[1.24rem] sm:text-[1.469rem] leading-relaxed text-slate-300">
            사업계획서만 준비하는 것이 아닙니다. 자금전략과 실제 업무에 사용할 AX 프로그램을 함께 만듭니다.
          </p>
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-5 py-4">
            <p className="text-[1.24rem] sm:text-[1.469rem] font-bold leading-relaxed text-white">
              인터뷰와 동시에 설계를 시작해, <span className="text-amber-300">최대 2주</span> 안에 최종 결과물 완성을 목표로 합니다.
            </p>
            <p className="mt-2 text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-400">
              자료가 모두 접수되고 의사결정이 원활한 경우의 목표 일정입니다. 정책기관 심사기간과 별도 본개발 일정은 포함하지 않습니다.
            </p>
          </div>
          <div className="mx-auto mt-7 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              to="/business-diagnosis"
              className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-teal-400 px-7 text-[1.33rem] sm:text-[1.573rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5"
            >
              3분 AX 진단
            </Link>
            <button
              type="button"
              onClick={() => scrollToId('process')}
              className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 text-[1.29rem] sm:text-[1.521rem] font-bold text-white transition-colors hover:bg-white/10"
            >
              2주 진행과정 보기
            </button>
          </div>
          <p className="mt-5 text-[1.1rem] sm:text-[1.3rem] font-semibold leading-relaxed text-teal-200">
            월 5개사 선별 · 김팀장 직접 참여 · 개발 담당자 공동 참여
          </p>
          <Guarantee dark />
        </div>
      </section>

      {/* ── 2. 고객의 현실 — 내 이야기다 ──────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>고객의 현실</p>
          <h2 className={bigHead}>다른 곳에서 컨설팅을 받았는데도,<br /><span className="text-blue-600">결국 몇천만원</span>에서 끝나셨나요?</h2>
          <p className={lead}>
            조건이 좋은 기업은 직접 신청해도 자금이 나옵니다. 첫 거래이고, 기존 대출이 적고, 매출과 신용이 충분한 회사입니다.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-center text-[1.33rem] sm:text-[1.573rem] font-black leading-relaxed text-slate-900">
            문제는 그렇지 않은 기업입니다.
          </p>
          <ul className="mx-auto mt-6 max-w-xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50">
            {REALITY.map((r) => (
              <li key={r} className="flex items-start gap-2.5 px-4 py-2.5">
                <span className="mt-0.5 shrink-0 font-black text-slate-400" aria-hidden>·</span>
                <span className="text-[1.21rem] sm:text-[1.43rem] leading-relaxed text-slate-700">{r}</span>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-6 max-w-xl rounded-3xl border-2 border-slate-900 bg-slate-900 p-5 text-center sm:p-6">
            <p className="text-[1.33rem] sm:text-[1.573rem] font-black leading-snug text-white">사업이 부족해서가 아닐 수 있습니다.</p>
            <p className="mt-2.5 text-[1.24rem] sm:text-[1.469rem] leading-relaxed text-slate-300">
              심사자가 더 큰 자금을 지원해야 할 이유를 충분히 확인하지 못했을 수 있습니다.
            </p>
            <p className="mt-3 text-[1.26rem] sm:text-[1.495rem] font-bold text-teal-300">그렇다고 방법이 없는 것은 아닙니다.</p>
          </div>
        </div>
      </section>

      {/* ── 3. 사업계획서만으로 부족한 이유 — 이유를 알겠다 ────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>메시지</p>
          <h2 className={bigHead}>사업계획서는 필요합니다.<br />하지만 <span className="text-blue-600">사업계획서만으로는 부족</span>합니다.</h2>
          <p className={lead}>
            이제는 AI로 누구나 그럴듯한 계획서를 만듭니다. 그래서 심사자는 문서보다 실행 가능성과 실제 구조, 경쟁력을 확인합니다.
          </p>
          <ul className="mx-auto mt-7 max-w-xl space-y-2.5">
            {PLAN_LINES.map((l) => (
              <li key={l} className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                <span className="mt-0.5 shrink-0 font-black text-teal-500" aria-hidden>✓</span>
                <span className="text-[1.26rem] sm:text-[1.495rem] font-bold leading-relaxed text-slate-800">{l}</span>
              </li>
            ))}
          </ul>
          <Example>
            시설관리 회사라면 점검·보수 요청을 받는 방식부터 화면으로 바꾸고, 그 화면을 사업계획서와 같은 자료로 묶습니다.
          </Example>
        </div>
      </section>

      {/* ── 3-1. 어디에서 새는가 — AX 필요성을 가장 빨리 이해시키는 장치 ──── */}
      <section id="leak" className={`scroll-mt-16 bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>지금 새고 있는 것</p>
          <h2 className={bigHead}>매일 조금씩,<br /><span className="text-blue-600">돈과 시간과 고객이 새고 있습니다</span></h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { t: '놓친 재방문·재구매', d: '다시 올 때가 된 고객을 아무도 챙기지 못하고 지나갑니다.' },
              { t: '견적 누락·미응답', d: '보낸 견적이 어디까지 갔는지, 답이 없는 건이 몇 건인지 모릅니다.' },
              { t: '월말 재입력·이중 장부', d: '같은 숫자를 엑셀과 수기에 두 번 적고, 월말마다 다시 맞춥니다.' },
              { t: '담당자 의존', d: '그 직원이 자리를 비우면 업무가 멈추거나 처음부터 다시 설명합니다.' },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="break-keep text-[1.29rem] font-black leading-snug text-slate-900 sm:text-[1.52rem]">{x.t}</p>
                <p className="mt-2 break-keep text-[1.15rem] leading-relaxed text-slate-600 sm:text-[1.37rem]">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 break-keep text-center text-[1.2rem] font-bold leading-relaxed text-slate-700 sm:text-[1.43rem]">
            AX는 바로 이 새는 지점부터 데이터로 잇는 작업입니다.
          </p>
        </div>
      </section>

      {/* ── 5. AX 혁신전환 4단계 — 방법이 보인다 ──────────────────────────── */}
      <AxCoreValuesSection />

      {/* ── 5. AX 사업화 5단계 방법론 (홈에서 이동) ───────────────────────── */}
      <AxMethodSection />

      {/* ── 5-1. 개발 방식 — 화면만 만드는 것이 아닙니다 ──────────────────── */}
      <AxHowWeBuildSection />

      {/* ── 6. 실제 사례 Before → After ───────────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행형 사례</p>
          <h2 className={bigHead}>같은 회사도<br /><span className="text-blue-600">설명하는 방식</span>이 달라집니다</h2>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-4">
              <p className="mb-2 inline-flex rounded-md bg-slate-200 px-2 py-0.5 text-[1.1rem] font-black text-slate-600 sm:mb-3 sm:px-2.5 sm:py-1 sm:text-[1.3rem]">Before</p>
              <Shot src="/ax-cases/before.webp" alt="장부·엑셀·메모에 기록이 흩어져 있는 기존 업무 방식" />
              <p className="mt-2.5 text-[1.2rem] font-bold leading-snug text-slate-700 sm:text-[1.495rem]">문서로만 설명</p>
              <p className="mt-1 text-[1.11rem] leading-relaxed text-slate-500 sm:text-[1.378rem]">심사자가 실제 모습을 상상해야 합니다.</p>
            </div>
            <div className="rounded-2xl border-2 border-teal-300 bg-teal-50/40 p-2.5 shadow-sm sm:p-4">
              <p className="mb-2 inline-flex rounded-md bg-teal-500 px-2 py-0.5 text-[1.1rem] font-black text-white sm:mb-3 sm:px-2.5 sm:py-1 sm:text-[1.3rem]">After</p>
              <Shot src="/ax-cases/after.webp" alt="같은 데이터를 대표·직원·고객 화면에서 함께 확인하는 AX 적용 모습" />
              <p className="mt-2.5 text-[1.2rem] font-bold leading-snug text-slate-900 sm:text-[1.495rem]">화면과 데이터로 확인</p>
              <p className="mt-1 text-[1.11rem] leading-relaxed text-slate-600 sm:text-[1.378rem]">눈으로 보이니 설명이 훨씬 쉬워집니다.</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <span className="inline-flex rounded-md bg-slate-900 px-2.5 py-1 text-[1.1rem] sm:text-[1.3rem] font-black text-teal-300">{CASE_A.label}</span>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[1.24rem] sm:text-[1.469rem] font-black text-slate-900">기존 문제</p>
                <ul className="mt-2 space-y-1.5">
                  {CASE_A.problems.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[1.18rem] sm:text-[1.391rem] leading-relaxed text-slate-500">
                      <span className="mt-0.5 shrink-0" aria-hidden>—</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[1.24rem] sm:text-[1.469rem] font-black text-slate-900">AX 전환 내용</p>
                <ul className="mt-2 space-y-1.5">
                  {CASE_A.changes.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-[1.18rem] sm:text-[1.391rem] leading-relaxed text-slate-700">
                      <span className="mt-0.5 shrink-0 font-black text-teal-500" aria-hidden>✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 px-4 py-3.5">
                <p className="text-[1.1rem] sm:text-[1.3rem] font-black tracking-tight text-slate-500">자금 설명 · Before</p>
                <p className="mt-1 text-[1.24rem] sm:text-[1.469rem] leading-relaxed text-slate-600">{CASE_A.before}</p>
              </div>
              <div className="rounded-2xl bg-slate-900 px-4 py-3.5">
                <p className="text-[1.1rem] sm:text-[1.3rem] font-black tracking-tight text-teal-300">자금 설명 · After</p>
                <p className="mt-1 text-[1.24rem] sm:text-[1.469rem] font-bold leading-relaxed text-white">{CASE_A.after}</p>
              </div>
            </div>
            <p className="mt-4 text-[1.13rem] sm:text-[1.339rem] font-bold text-teal-700">현재 상태 · {CASE_A.status}</p>
            <p className="mt-1.5 text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-500">{CASE_A.notice}</p>
          </div>
        </div>
      </section>

      {/* ── 7. 업종별 AX 화면 — 실제로 보인다 ─────────────────────────────── */}
      <span id="ax-application" aria-hidden className="block h-0 scroll-mt-20" />
      <AxIndustryShowcaseV2
        initialSlug={requestedIndustry}
        showIdeaDetailLink={false}
        showIndustryDetailLink={false}
      />

      {/* ── 7-1. 데이터·AI가 들어가는 지점 → 성장 → 현재 단계(정직 표기) ──── */}
      <section id="data-ai-growth" className={`scroll-mt-16 bg-slate-950 ${band}`}>
        <div className="mx-auto max-w-[900px]">
          <p className="text-center text-[1.1rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">데이터 · AI · 성장</p>
          <h2 className="mt-3 break-keep text-center text-[1.49rem] font-black leading-snug tracking-tight text-white sm:text-[2.405rem]">
            어디에 데이터가 쌓이고,<br className="sm:hidden" /> 어디에 AI가 들어가는가
          </h2>

          {/* 판단이 필요한 자리에만 AI — 계산은 코드가 한다 */}
          <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.04] p-5 sm:p-7">
            <ol className="flex flex-wrap items-center justify-center gap-y-2">
              {['업무 기록', '데이터 축적', 'Rule · AI 분석', '확인할 것 · 연락할 곳', '실행', '결과 기록'].map((t, i, arr) => (
                <li key={t} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-1.5 text-[1.0rem] font-black text-slate-600">→</span>}
                  <span className={`break-keep rounded-lg px-2.5 py-1.5 text-[1.05rem] font-bold sm:text-[1.2rem] ${
                    i === arr.length - 1 ? 'bg-teal-400/12 text-teal-200 ring-1 ring-inset ring-teal-400/30' : 'bg-slate-900 text-slate-200 ring-1 ring-inset ring-white/12'
                  }`}>{t}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 break-keep text-center text-[1.13rem] leading-relaxed text-slate-400 sm:text-[1.3rem]">
              계산할 수 있는 것은 코드가 계산합니다. AI는 우선순위·누락 위험·설명이 필요한 자리에만 넣습니다.
            </p>
          </div>

          {/* 효율에서 끝나지 않는 성장 */}
          <p className="mt-10 break-keep text-center text-[1.3rem] font-black leading-snug text-white sm:text-[1.7rem]">
            효율에서 끝나지 않습니다.
          </p>
          <ol className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            {['반복업무 · 누락 감소', '데이터 축적', '판단 기준 표준화', '재방문 · 재구매', '새로운 고객 서비스', '사업 확장'].map((t, i, arr) => (
              <li key={t} className="flex items-center gap-2">
                <span className={`break-keep rounded-xl border px-3.5 py-2 text-[1.05rem] font-bold sm:text-[1.2rem] ${
                  i >= 3 ? 'border-teal-400/40 bg-teal-400/[0.08] text-teal-200' : 'border-white/12 bg-white/[0.05] text-slate-200'
                }`}>{t}</span>
                {i < arr.length - 1 && <span aria-hidden className="text-[1.05rem] font-black text-slate-600">→</span>}
              </li>
            ))}
          </ol>

          {/* 현재 단계 — 무엇이 구현됐고 무엇이 남았는지 정직하게 */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { t: '지금 만들어 드리는 것', d: '업무 흐름 설계와 실제 동작하는 화면, 데이터가 쌓이는 구조까지.' },
              { t: '이어서 고도화하는 것', d: '실사용 데이터가 쌓인 뒤의 판단 기준·자동화·고객 접점 확장.' },
              { t: '실증이 필요한 것', d: '매출·생산성 변화는 실제 운영 기간이 지나야 데이터로 확인됩니다.' },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-white/12 bg-white/[0.04] p-5">
                <p className="break-keep text-[1.2rem] font-black leading-snug text-white sm:text-[1.4rem]">{x.t}</p>
                <p className="mt-2 break-keep text-[1.08rem] leading-relaxed text-slate-400 sm:text-[1.24rem]">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 break-keep text-center text-[1.02rem] leading-relaxed text-slate-500 sm:text-[1.15rem]">
            가능한 한 고객사가 자신의 데이터를 직접 보유하고 꺼낼 수 있는 구조를 우선합니다.
          </p>
        </div>
      </section>

      {/* ── 8. 최대 2주 진행과정 — 빠르다 ─────────────────────────────────── */}
      <AxProcessSection onResult={() => scrollToId('deliverables')} />

      {/* ── 9. 최종 결과물 ────────────────────────────────────────────────── */}
      <section id="deliverables" className={`scroll-mt-16 bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>최종 결과물</p>
          <h2 className={bigHead}>사업계획서뿐 아니라,<br /><span className="text-blue-600">실제로 보여주고 사용할</span> AX 프로그램을 갖게 됩니다.</h2>

          <ol className="mx-auto mt-7 max-w-xl space-y-2">
            {DELIVERABLES.map((d, i) => (
              <li key={d.t} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-[1.1rem] sm:text-[1.3rem] font-black text-amber-300">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block text-[1.26rem] sm:text-[1.495rem] font-black leading-snug text-slate-900">{d.t}</span>
                  <span className="mt-0.5 block text-[1.18rem] sm:text-[1.391rem] leading-relaxed text-slate-600">{d.d}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4">
            {DELIVERABLE_SHOTS.map((s) => (
              <figure key={s.img}>
                {/* 원본이 16:9 화면 캡처라 위아래가 잘리지 않게 비율을 맞춘다 */}
                <Shot src={s.img} alt={s.cap} ratio="aspect-[16/9]" />
                <figcaption className="mt-2 text-center text-[1.1rem] leading-snug text-slate-500 sm:text-[1.3rem]">{s.cap}</figcaption>
              </figure>
            ))}
          </div>

          <CtaButtons onConsult={openConsult} />
        </div>
      </section>

      {/* ── 10. 가격과 결제시점 (딱 한 번) — 부담이 적다 ──────────────────── */}
      {/* PC 글자를 키운 만큼 3열 카드가 좁아지지 않게, 이 섹션만 폭을 넓게 쓴다 */}
      <section id="ax-packages" className={`scroll-mt-16 bg-slate-950 ${band}`}>
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[1.1rem] sm:text-[1.3rem] font-black tracking-tight text-teal-300">프로그램 · 비용</p>
          <h2 className="mt-2.5 text-center text-[1.65rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2.6rem]">
            어디까지 준비할지<br /><span className="text-teal-300">먼저 고르세요.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[1.26rem] leading-relaxed text-slate-300 sm:text-[1.573rem]">
            방향만 확인할지, 벤처·연구소까지 함께 준비할지, 특허와 다음 자금 로드맵까지 갈지 선택할 수 있습니다.
          </p>
          <div className="mt-8">
            <AxPackageComparison onConsult={(code) => { setConsultProgram(code); setConsult(true) }} />
          </div>
        </div>
      </section>

      {/* ── 운영형 본개발 안내 — 메인 가격표에 병기하지 않고 여기서만 설명 ── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <h2 className="text-center text-[1.65rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[2.6rem]">
            시연형 MVP 다음,<br className="sm:hidden" /> 운영형 개발은 어디까지 만드나요?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[1.26rem] sm:text-[1.495rem] leading-relaxed text-slate-600">
            필요한 수준을 먼저 고르고, 개발비는 정책자금이 조달된 뒤에 정산합니다.
          </p>

          <div className="mt-8">
            <AxBuildStageCards />
          </div>

          {/* 후불 정산 구조 — "개발이 공짜"로 오해되지 않게 한다 */}
          <div className="mt-8 rounded-3xl border-2 border-amber-300 bg-amber-50/70 p-5 sm:p-7">
            <p className="text-[1.43rem] font-black leading-snug text-slate-900 sm:text-[2.015rem]">
              {AX_BUILD_PAYMENT.title}
            </p>
            <div className="mt-4 space-y-2.5">
              {AX_BUILD_PAYMENT.lines.map((t) => (
                <p key={t} className="break-keep text-[1.23rem] sm:text-[1.456rem] leading-relaxed text-slate-800">{t}</p>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-inset ring-amber-200">
              <p className="text-[1.17rem] sm:text-[1.378rem] font-black text-amber-700">일반 개발회사와 비교하면</p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="text-[1.12rem] sm:text-[1.326rem] font-black text-slate-500">일반 개발회사</p>
                  <p className="mt-1.5 break-keep text-[1.19rem] sm:text-[1.404rem] leading-snug text-slate-600">
                    착수금·중도금으로 수천만원을 먼저 지급
                  </p>
                </div>
                <div className="rounded-xl bg-teal-50 p-3.5 ring-1 ring-inset ring-teal-200">
                  <p className="text-[1.12rem] sm:text-[1.326rem] font-black text-teal-700">미래AI랩</p>
                  <p className="mt-1.5 break-keep text-[1.19rem] sm:text-[1.404rem] font-bold leading-snug text-teal-900">
                    컨설팅 비용만 납부하고 개발 시작 · 개발비는 조달 이후 정산
                  </p>
                </div>
              </div>
            </div>
            <ul className="mt-4 space-y-1">
              {AX_BUILD_PAYMENT.notes.map((t) => (
                <li key={t} className="break-keep text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-500">· {t}</li>
              ))}
            </ul>
          </div>


          <Guarantee />
        </div>
      </section>



      {/* ── 11. 비교 3열 — 여기가 다르다 ──────────────────────────────────── */}
      <section id="compare" className={`scroll-mt-16 bg-white ${band}`}>
        <div className="mx-auto max-w-5xl">
          <p className={kicker}>비교</p>
          <h2 className={bigHead}>각자 잘하는 회사는 많습니다.<br /><span className="text-blue-600">정책자금과 실제 프로그램</span>을 함께 설계하는 곳은 드뭅니다.</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {COMPARE.map((col) =>
              col.highlight ? (
                <div key={col.label} className="relative rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-sm">
                  <span className="absolute -top-3 left-6 inline-flex rounded-full bg-blue-600 px-3 py-1 text-[1.1rem] sm:text-[1.3rem] font-black text-white shadow-sm">여기가 다릅니다</span>
                  <p className="mt-1 text-[1.2rem] sm:text-[1.417rem] font-black text-blue-600">{col.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[1.2rem] sm:text-[1.417rem] font-semibold leading-relaxed text-slate-700">
                        <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div key={col.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-[1.2rem] sm:text-[1.417rem] font-black text-slate-400">{col.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[1.2rem] sm:text-[1.417rem] leading-relaxed text-slate-500">
                        <span className="mt-0.5 shrink-0" aria-hidden>—</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
          <p className="mx-auto mt-6 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center text-[1.26rem] sm:text-[1.495rem] font-bold leading-relaxed text-slate-800">
            정책자금만 받고 끝나는 것도, 시스템만 만들고 끝나는 것도 아닙니다. 자금전략과 실제 회사의 변화를 하나의 프로젝트로 진행합니다.
          </p>
        </div>
      </section>

      {/* ── 12. 정책·성장 근거 — 실증을 외부기관에 설명할 수 있는 이유 ────── */}
      <section id="policy-2026" className={`scroll-mt-16 bg-slate-50 ${band}`}>
        <div className={inner}>
          <h2 className="text-[1.49rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[2.405rem]">
            2026 정책변화와 AX 공식근거
          </h2>
          <p className="mt-3 max-w-2xl text-[1.33rem] sm:text-[1.573rem] leading-relaxed text-slate-600">
            아래는 공식 문서에서 확인되는 변화입니다. 미래AI랩의 실적이나 승인사례가 아닙니다.
          </p>
          <div className="mt-6">
            <AxPolicyEvidenceStrip tone="light" />
          </div>
        </div>
      </section>

      {/* ── 4. 정부 정책방향과 AX ─────────────────────────────────────────── */}
      <AxPolicyShift />

      {/* ── 4-1. 심사위원 반문 + A/B 비교표 + 업계 사례 (홈에서 이동) ──────── */}
      <AxJudgeCaseSection />

      {/* ── 12. 대표 컨설턴트(홈에서 이동) ────────────────────────────────── */}
      <section id="leader" className={`scroll-mt-16 bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>대표 컨설턴트</p>
          <div className="mx-auto mt-5 flex max-w-2xl flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <img src="/assets/profile/ceo-avatar.webp" alt="대표 컨설턴트 김팀장 프로필" loading="lazy" decoding="async" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
            <p className="mt-3 text-[1.1rem] sm:text-[1.3rem] font-bold text-teal-600">김팀장 · 정책자금·AX 성장설계 총괄</p>
            <h2 className="mt-2 text-[1.52rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[1.82rem]">
              대표 컨설턴트가 직접 듣고,<br />직접 설계하고, 끝까지 확인합니다.
            </h2>
            <p className="mt-3 break-keep text-[1.26rem] sm:text-[1.495rem] leading-relaxed text-slate-600">
              자금 가능성 검토에서 끝내지 않습니다. 대표님의 사업을 듣고 어떤 업무를 AX로 바꿀지 직접 기획하며,{' '}
              <b className="text-slate-900">내부 개발자와 함께 사업과 AX 구조를 직접 설계합니다.</b> 그래서 사업계획과 실제 결과물이 따로 움직이지 않습니다. 자금조달 이후에는 지원금·인증·복지제도·절세까지 성장순서에 맞춰 연결합니다.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              {AWARDS.map((a) => (
                <span key={a.title} className="inline-flex items-center gap-1.5 break-keep rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[1.1rem] sm:text-[1.3rem] font-semibold text-slate-600">
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[1.1rem] sm:text-[1.3rem] font-black text-amber-300">{a.year}</span>{a.title}
                </span>
              ))}
            </div>
            <p className="mt-4 break-keep rounded-2xl bg-slate-50 px-4 py-3 text-[1.17rem] sm:text-[1.378rem] leading-relaxed text-slate-600">
              세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원. 누적 자금조달 지원 100억원+ (지원금·세금 환급 포함).
            </p>
            <p className="mt-3 text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-500">
              세무·노무·법률 업무는 해당 자격을 보유한 외부 전문가가 직접 수행합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 13. 월 최대 5개사 선별기준(홈에서 이동) ───────────────────────── */}
      <AxSelectionSection />

      {/* ── 자금 이후 성장 로드맵 ────────────────────────────────────────── */}
      <section id="lifecycle" className={`scroll-mt-16 bg-white ${band}`}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[1.49rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[2.405rem]">
            자금조달이 끝이 아닙니다. 다음 순서까지 함께 설계합니다.
          </h2>
          <AxLifecycleModules />
        </div>
      </section>

      {/* ── 14. FAQ — 남은 걱정 정리 ──────────────────────────────────────── */}
      <section id="faq" className={`scroll-mt-16 bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>자주 묻는 질문</p>
          <h2 className={bigHead}>남은 걱정을<br /><span className="text-blue-600">먼저 정리해드립니다</span></h2>
          <div className="mt-8 space-y-2.5">
            {[
              {
                q: '우리 회사는 AI 회사가 아닌데요.',
                a: <>AI 회사만 대상이 아닙니다. 기존 업무에 AI와 데이터를 도입·활용하는 중소기업도 지원대상으로 보고 있습니다. 업종을 바꾸는 것이 아니라 일하는 방식을 바꾸는 일입니다.</>,
              },
              {
                q: '화면을 만든다고 정책자금이 나오나요?',
                a: <>화면 자체가 자금을 만들어주지는 않습니다. 다만 심사자는 계획이 실제로 실행될 수 있는지를 확인합니다. 업무 흐름과 화면이 있으면 그 설명이 훨씬 구체적이 됩니다.</>,
              },
              {
                q: '또 컨설팅비만 내고 끝나는 것 아닌가요?',
                a: <>문서만 남지 않습니다. 자금전략과 함께 실제로 열어서 보여줄 수 있는 <Tip term="MVP">최소 기능 버전. 가장 중요한 기능부터 실제로 작동하게 만든, 바로 보여줄 수 있는 첫 버전.</Tip> 또는 선택 단계의 프로그램이 결과물로 남습니다.</>,
              },
              {
                q: '왜 다른 곳보다 빠른가요?',
                a: <>자금전략과 화면설계를 한 팀에서 동시에 진행하기 때문입니다. 컨설팅이 끝난 뒤 개발사를 다시 찾아 사업을 처음부터 설명하는 시간이 없습니다.</>,
              },
              {
                q: '정말 2주 안에 되나요?',
                a: <>자료 접수와 의사결정이 원활한 경우의 목표 일정입니다. 외부 시스템 연동과 복잡한 데이터 이전은 별도 일정으로 진행하며, 정책기관 심사기간은 포함하지 않습니다.</>,
              },
              {
                q: '개발비가 너무 큰 것 아닌가요?',
                a: <>100만원으로 방향과 화면부터 확인합니다. 본개발비는 정책자금 조달 이후 정산하며, 자금이 실행되지 않으면 선택하지 않은 본개발비는 발생하지 않습니다.</>,
              },
              {
                q: '왜 월 5개 회사만 하나요?',
                a: <>대표 컨설턴트가 모든 프로젝트에 직접 참여하기 때문입니다. 동시에 진행하는 기업이 늘어나면 인터뷰와 설계의 밀도가 떨어집니다.</>,
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-[1.29rem] sm:text-[1.521rem] font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <div className="mt-3 text-[1.24rem] sm:text-[1.469rem] leading-relaxed text-slate-600">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15. 최종 CTA — 진단받아봐야겠다 ───────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div ref={finalCtaRef} className="mx-auto max-w-[640px] rounded-3xl bg-slate-900 p-7 text-center shadow-xl sm:p-10">
          <p className="text-[1.1rem] sm:text-[1.3rem] font-black tracking-tight text-amber-300">먼저 확인하세요</p>
          <h2 className="mt-3 text-[1.59rem] font-black leading-[1.34] tracking-tight text-white sm:text-[2.405rem]">
            이번에도 몇천만원에서 끝날지,<br /><span className="text-amber-300">1억원 이상을 설명할 구조</span>가 있는지<br />먼저 확인해보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1.26rem] sm:text-[1.495rem] leading-relaxed text-slate-300">
            3분 AX 진단으로 현재 상황을 정리하고, <b className="text-white">{FLAGSHIP.name}</b> 상담으로 이어갈 수 있습니다.
          </p>
          <CtaButtons dark onConsult={openConsult} />
          <p className="mt-5 text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-400">진단만으로 별도 비용이 발생하지 않습니다.</p>
          <p className="mt-1 text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-500">선별 진행 여부는 진단과 상담 후 안내합니다.</p>
          <Guarantee dark />
        </div>
      </section>

      {/* Footer */}
      <LegalFooter
        topSlot={
          <Link to="/business-services" className="text-[0.96rem] font-semibold text-slate-500 transition-colors hover:text-slate-900 sm:text-[1.137rem]">
            ← 서비스몰 홈으로
          </Link>
        }
      />

      {/* 상시 카카오 상담 플로팅 */}
      <KakaoFloat />

      {/* Mobile sticky CTA — 최종 CTA 노출 시 자동 숨김 */}
      {showBar && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[1.2rem] sm:text-[1.417rem] font-black text-slate-900">{FLAGSHIP.name}</span>
            <span className="block truncate text-[1.1rem] sm:text-[1.3rem] font-medium text-slate-500">3분 AX 진단으로 시작하세요</span>
          </span>
          <Link to="/business-diagnosis" className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[1.2rem] sm:text-[1.417rem] font-bold text-white">
            3분 AX 진단
          </Link>
        </div>
      )}

      <ConsultModal
        open={consult}
        onClose={() => setConsult(false)}
        source="AX 사업화·자금조달 프로그램"
        heading="AX 사업화·자금조달 프로그램 상담 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
        preselectProduct="정책자금 컨설팅"
        showContactMethod
        showCompanyFields
        programSelect
        preselectProgram={FLAGSHIP.consultName}
        contextRows={
          [
            {
              label: '관심 프로그램',
              value: consultProgram
                ? (AX_PACKAGES.find((x) => x.code === consultProgram)?.name ?? FLAGSHIP.consultName)
                : FLAGSHIP.consultName,
            },
          ] as ConsultContextRow[]
        }
      />
    </div>
  )
}
