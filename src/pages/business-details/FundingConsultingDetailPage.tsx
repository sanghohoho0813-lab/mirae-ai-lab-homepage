// AX 사업화·자금조달 프로그램 — 구매설득(상세) 페이지.
// 라우트: /business-services/funding-consulting
// 대상: 개발을 전혀 모르는 중소기업 대표. 모든 개발용어를 "고객이 얻는 결과"로 바꿔 설명한다.
// 원칙: 이미지 우선, 한 섹션 한 메시지, 가격은 딱 한 번(7섹션), 후불 구조 강조.
// 승인·조달 보장 표현 금지. 가격 500/1,000/1,500 표기는 7섹션 가격표에서만 노출한다.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import ConsultModal from '../../components/ConsultModal'
import AxIndustryShowcase from '../../components/ax/AxIndustryShowcase'
import KakaoFloat from '../../components/KakaoFloat'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../../lib/consultApi'
import { FLAGSHIP, BUILD_LEVELS, type BuildLevel } from '../../data/corePrograms'

// ── 공통 스타일 토큰 ───────────────────────────────────────────────────────
const band = 'px-5 py-14 sm:py-20'
const inner = 'mx-auto max-w-[820px]'
const kicker = 'text-center text-[0.8rem] font-black uppercase tracking-widest text-teal-600'
const bigHead =
  'mt-2.5 text-center text-[1.55rem] font-black leading-[1.32] tracking-tight text-slate-900 sm:text-[2.1rem]'
const lead = 'mx-auto mt-4 max-w-xl text-center text-[1rem] leading-relaxed text-slate-600 sm:text-[1.05rem]'

// 개발 1~4단계만(5단계 별도견적 제외). BuildLevel 타입 사용처.
const DEV_LEVELS: BuildLevel[] = BUILD_LEVELS.filter((l) => l.key !== '5')

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── 이미지(실제 AX 화면 예시) ──────────────────────────────────────────────
const IMG = '/ax-showcase-v2'

// ── 6섹션 구현 수준 탭 — 개발용어를 모두 "고객이 얻는 결과"로 서술 ───────────
type LevelTab = {
  key: '1' | '2' | '3' | '4'
  title: string
  message: string
  list: string[]
  result: string
  recommended?: boolean
}
const LEVEL_TABS: LevelTab[] = [
  {
    key: '1',
    title: '무엇을 만들지 먼저 정합니다.',
    message: '회사의 반복 업무를 찾아 어떤 순서·화면으로 바꿀지 정리합니다.',
    list: [
      '회사에서 반복되는 업무를 찾아 바꿀 순서를 정리합니다.',
      '고객·작업 정보를 어떻게 입력하고 저장할지 설계합니다.',
      '심사에서 보여줄 주요 화면 초안 3~5개를 그립니다.',
      '목표 정책자금과 신청기관을 함께 검토합니다.',
    ],
    result: '업무 흐름도와 주요 화면 초안 3~5개',
  },
  {
    key: '2',
    title: '클릭하며 보여줄 화면을 만듭니다.',
    message: '심사자 앞에서 고객 등록부터 작업 완료까지 화면을 넘기며 보여줍니다.',
    list: [
      '주요 화면 5~8개를 실제처럼 클릭할 수 있게 만듭니다.',
      'PC와 스마트폰에서 모두 보기 편한 화면으로 만듭니다.',
      '예시 데이터로 접수부터 완료까지 흐름을 시연합니다.',
      '회사 밖에서도 인터넷으로 접속해 보여줄 수 있게 설치합니다.',
    ],
    result: '클릭 가능한 시연용 프로토타입',
  },
  {
    key: '3',
    title: '고객·작업기록이 쌓이기 시작합니다.',
    message: '대표자와 담당자가 로그인해 고객·업무정보를 입력하고 저장합니다.',
    list: [
      '직원은 각자 로그인해 자기 업무만 봅니다.',
      '고객정보·작업기록·사진이 사라지지 않고 고객별·날짜별로 쌓입니다.',
      '접수부터 담당자 배정, 처리 완료까지 핵심 업무 하나가 실제로 작동합니다.',
      '회사 밖에서도 인터넷으로 접속해 사용할 수 있습니다.',
    ],
    result: '핵심 업무 한 가지가 실제로 작동하는 초기 시스템',
  },
  {
    key: '4',
    title: '직원이 실제 업무에 씁니다.',
    message: '관리자·현장직원이 각자 화면으로 업무를 처리합니다.',
    list: [
      '현장에서는 사진·결과를 바로 올리고, 관리자는 진행상태를 확인합니다.',
      '대표자·관리자가 오늘 할 일, 진행상태, 누락된 업무를 한 화면에서 확인합니다.',
      '검색·필터·기본 통계와 출력물 1종을 함께 제공합니다.',
      '실제 사용 테스트와 납품 후 30일 오류보수를 포함합니다.',
    ],
    result: '실제 회사 업무에 적용하는 업무용 MVP',
    recommended: true,
  },
]

// ── 가격표(7섹션 전용) — 500/1,000/1,500 은 여기서만 노출 ───────────────────
const PRICE_ROWS: { name: string; price: string; recommended?: boolean }[] = DEV_LEVELS.map((l) => ({
  name:
    l.key === '1'
      ? '1단계 · 무엇을 만들지 설계'
      : l.key === '2'
        ? '2단계 · 클릭하며 보여줄 화면'
        : l.key === '3'
          ? '3단계 · 로그인·저장 시스템'
          : '4단계 · 직원이 쓰는 업무 시스템',
  price: l.priceLabel, // 단일 출처(BUILD_LEVELS). 100 / 500 / 1,000 / 1,500 만원
  recommended: l.recommended,
}))

// ── 공통 조각 ──────────────────────────────────────────────────────────────
// 이미지 카드(실제 화면 예시)
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
      <span className="mt-0.5 shrink-0 rounded-md bg-teal-500 px-2 py-0.5 text-[0.7rem] font-black text-white">예를 들어</span>
      <p className="text-[0.92rem] leading-relaxed text-slate-700">{children}</p>
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
          className="absolute left-1/2 top-full z-20 mt-1.5 w-64 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2.5 text-[0.82rem] font-medium leading-relaxed text-slate-100 shadow-xl"
        >
          {children}
        </span>
      )}
    </span>
  )
}

// 반복되는 CTA 묶음 — 3분 기업진단 + 상담 신청
function CtaButtons({ dark = false, onConsult }: { dark?: boolean; onConsult: () => void }) {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
      <Link
        to="/business-diagnosis"
        className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-teal-400 px-6 text-[1.02rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5"
      >
        3분 기업진단
      </Link>
      <button
        type="button"
        onClick={onConsult}
        className={`flex min-h-[52px] flex-1 items-center justify-center rounded-xl border px-6 text-[1rem] font-bold transition-colors ${
          dark ? 'border-white/25 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
        }`}
      >
        상담 신청
      </button>
    </div>
  )
}

// 섹션 표제(작은 안내문구)
function Guarantee({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`mx-auto mt-6 max-w-md text-center text-[0.8rem] leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      자금조달 결과·금액은 기관 심사에 따라 달라지며 보장되지 않습니다.
    </p>
  )
}

export default function FundingConsultingDetailPage() {
  const [level, setLevel] = useState<LevelTab['key']>('1')
  const [showBar, setShowBar] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [consult, setConsult] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const activeTab = LEVEL_TABS.find((t) => t.key === level) ?? LEVEL_TABS[0]
  const openConsult = () => setConsult(true)

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  // 해시(#process 등)로 진입/이동 시 해당 앵커로 스크롤
  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const t = window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    return () => window.clearTimeout(t)
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
            <Link to="/business-diagnosis" className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
              3분 기업진단
            </Link>
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
          <span className="font-semibold text-slate-700">AX 사업화·자금조달 프로그램</span>
        </div>
      </div>

      {/* ── 1. Hero (navy) — 여기는 무엇을 해주는 곳인가? ─────────────────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1.5 text-[0.82rem] font-bold text-amber-200 backdrop-blur">
            정책자금 × <Tip term="AX" className="text-amber-200">AI 전환(AI Transformation). 사람이 반복하던 업무를 자동화·디지털화해 회사 운영 방식을 바꾸는 것.</Tip> 혁신전환
          </span>
          <h1 className="mt-5 text-[1.7rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.16]">
            정책자금, 계속 거절당하거나<br /><span className="text-amber-300">몇천만원</span>에서 멈추셨나요?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-slate-300 sm:text-lg">
            이제는 디지털 전환을 넘어 AI 전환, AX의 시대입니다.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[1.05rem] font-bold leading-relaxed text-white sm:text-lg">
            <span className="text-amber-300">1억원 이상</span> 정책자금을 목표로 합니다. 지금 하는 사업을, 자금을 받을 이유가 보이는 AX 혁신기업으로 바꿉니다.
          </p>
          <p className="mx-auto mt-5 max-w-lg text-[0.95rem] font-semibold leading-relaxed text-teal-200">
            대표 컨설턴트 김팀장이 자금전략과 화면설계에 직접 참여합니다. 개발 담당자도 처음부터 같은 프로젝트에 함께합니다.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              to="/business-diagnosis"
              className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-teal-400 px-7 text-[1.05rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5"
            >
              3분 기업진단
            </Link>
            <button
              type="button"
              onClick={() => scrollToId('process')}
              className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 text-[1.02rem] font-bold text-white transition-colors hover:bg-white/10"
            >
              2주 실행과정 보기
            </button>
          </div>
          <Guarantee dark />
        </div>
      </section>

      {/* ── 1.5 미래AI랩 정체성 — 우리는 어떤 회사인가? ──────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>미래AI랩은</p>
          <h2 className={bigHead}>
            정책자금을 받을 이유를 설계하고,<br />실제 <span className="text-blue-600">AX 화면</span>으로 증명하는 정책자금 전문회사입니다.
          </h2>
          <p className={lead}>
            정책자금 회사는 개발을 모르고, 개발회사는 심사를 모릅니다. 미래AI랩은 자금전략과 실제 화면을 한 팀에서 잇습니다.
          </p>
          <div className="mx-auto mt-7 max-w-xl rounded-3xl border-2 border-amber-300 bg-amber-50/60 p-5 text-center sm:p-6">
            <p className="text-[1.05rem] font-black leading-snug text-slate-900">
              자금을 신청하는 회사에서, <span className="text-amber-600">자금을 받을 이유가 보이는 AX 혁신기업</span>으로.
            </p>
            <p className="mt-2.5 text-[0.82rem] leading-relaxed text-slate-500">
              AX 혁신기업은 기업의 전환상태를 설명하려고 쓰는 표현이며, 특정 정부인증 명칭이 아닙니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. 왜 AX를 함께 준비해야 하나 (Before/After) ─────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>Before / After</p>
          <h2 className={bigHead}>계획서로 설명 vs<br /><span className="text-blue-600">화면으로 증명</span></h2>
          <p className={lead}>같은 사업도 심사자에게 보이는 준비가 완전히 다릅니다.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 inline-flex rounded-md bg-slate-200 px-2.5 py-1 text-[0.78rem] font-black text-slate-600">Before · 다른 곳</p>
              <div className="grayscale [filter:grayscale(1)_opacity(0.85)]">
                <Shot src="/ax-showcase/wms/photo-36-wms-problem.webp" alt="엑셀·수기 등으로 흩어진 현재 업무 예시 화면" />
              </div>
              <p className="mt-3 text-[1rem] font-bold leading-snug text-slate-700">AI로 만든 사업계획서만 제출</p>
              <p className="mt-1 text-[0.92rem] leading-relaxed text-slate-500">심사자가 실제 모습을 상상해야 합니다.</p>
            </div>
            <div className="rounded-3xl border-2 border-teal-300 bg-teal-50/40 p-4 shadow-sm">
              <p className="mb-3 inline-flex rounded-md bg-teal-500 px-2.5 py-1 text-[0.78rem] font-black text-white">After · 미래AI랩</p>
              <Shot src={`${IMG}/photo-089-siteflow-showcase.webp`} alt="업무 흐름과 화면, 데이터 구조까지 실제로 보여주는 AX 화면 예시" />
              <p className="mt-3 text-[1rem] font-bold leading-snug text-slate-900">업무 흐름·화면·데이터까지 눈으로 보여줌</p>
              <p className="mt-1 text-[0.92rem] leading-relaxed text-slate-600">눈으로 확인되니 설명이 훨씬 쉬워집니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 정책자금 심사환경 변화 — 왜 AX가 필요한가? ────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>DX → AX</p>
          <h2 className={bigHead}>왜 지금 DX를 넘어<br /><span className="text-blue-600">AX인가요?</span></h2>
          <p className={lead}>
            정부가 지원할 기업의 방향은 분명합니다. 수출·첨단기술·AI처럼 성장성이 높은 분야를 먼저 검토합니다.
          </p>
          <div className="mt-9 space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-[1.1rem] font-black leading-snug text-slate-900">정부가 보는 성장방향은 분명합니다</h3>
              <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">
                혁신성장분야와 AI 활용기업을 특히 눈여겨봅니다.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-[1.1rem] font-black leading-snug text-slate-900">우리 회사가 수출·첨단기업이 될 수는 없습니다</h3>
              <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">
                숙박업체가 반도체회사가, 시설관리회사가 화장품 수출회사가 될 수는 없습니다.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-[1.1rem] font-black leading-snug text-slate-900">기존 업무에 AI를 도입하는 AX 기업으로는 전환할 수 있습니다</h3>
              <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">
                2026년 정책자금 공고는 AI 분야 기업만이 아니라, 기존 업무에 AI를 도입·활용하는 중소벤처기업도 지원대상에 포함합니다.
              </p>
            </div>
          </div>

          <details className="group mt-4 rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
            <summary className="flex items-center justify-between text-[0.98rem] font-black text-slate-800 marker:content-['']">
              <span>2026 정책근거 자세히 보기</span>
              <span className="ml-3 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <div className="mt-3 space-y-2.5 text-[0.92rem] leading-relaxed text-slate-600">
              <p>
                <Tip term="기술사업성평가">과거 매출만이 아니라 기술·사업모델·성장 가능성을 함께 보는 평가.</Tip>가 확대되고 있습니다. 이제는 과거 매출뿐 아니라 기술과 성장 가능성을 함께 봅니다.
              </p>
              <p>혁신성장분야는 정부가 성장 가능성이 높다고 보고 중점 지원하는 산업·기술 분야를 말합니다.</p>
              <p>AI 분야 기업이 아니어도, 기존 업무에 AI를 도입·활용하면 지원대상에 포함될 수 있습니다.</p>
              <p className="font-semibold text-slate-700">실제 중점지원분야 해당 여부와 우대 적용은 기업의 사업내용·도입방식과 기관평가에 따라 결정됩니다.</p>
              <p className="text-[0.82rem] text-slate-400">출처: 중소벤처기업부·중소벤처기업진흥공단 2026년 정책자금 융자계획 및 참고자료 (공고 제2026-287호).</p>
            </div>
          </details>
        </div>
      </section>

      {/* ── 4. 실제 변화 과정 — 어떤 순서로 진행되나? ────────────────────── */}
      <section id="process" className={`scroll-mt-16 bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>2주 실행과정</p>
          <h2 className={bigHead}><span className="text-amber-600">2주</span> 안에 사업계획이<br /><span className="text-blue-600">실행구조로</span> 바뀝니다</h2>
          <div className="mt-9 space-y-4">
            {([
              { n: '1', src: '/ax-showcase/b2b-order/photo-60-b2b-problem.webp', t: '기업과 자금 분석', d: '왜 자금이 필요한지, 어떤 기관에 신청할지 정합니다.', alt: '엑셀·수기 등 흩어진 현재 업무를 정리하는 예시' },
              { n: '2', src: '/ax-showcase/design-direction/photo-68-design-direction.webp', t: 'AX 적용업무 선정', d: '반복되는 업무 중 가장 먼저 바꿀 한 가지를 고릅니다.', alt: '사용자·데이터·화면 구조를 설계하는 예시' },
              { n: '3', src: `${IMG}/photo-101-garageos-showcase.webp`, t: '업무 흐름과 화면설계', d: '직원과 관리자가 어떤 순서·화면으로 일할지 만듭니다.', alt: '심사에서 시연하는 자동차 정비 통합 화면 예시' },
              { n: '4', src: '/ax-showcase/wms/photo-37-wms-live-dashboard.webp', t: '자금 설명자료 완성', d: '받은 돈을 어디에 쓸지, 사업계획과 AX 화면을 하나로 잇습니다.', alt: '실제 업무를 운영하는 관리자 대시보드 예시' },
            ] as { n: string; src: string; t: string; d: string; alt: string; ex?: string }[]).map((s, i, arr) => (
              <div key={s.n}>
                <div className="grid items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1.1fr,1fr] sm:p-5">
                  <Shot src={s.src} alt={s.alt} />
                  <div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[0.9rem] font-black text-amber-300">{s.n}</span>
                    <h3 className="mt-2 text-[1.15rem] font-black leading-snug text-slate-900">{s.t}</h3>
                    <p className="mt-1.5 text-[1rem] leading-relaxed text-slate-600">{s.d}</p>
                    {s.ex && <Example>{s.ex}</Example>}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="py-1 text-center text-[1.3rem] font-black text-amber-400" aria-hidden>↓</div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[0.85rem] leading-relaxed text-slate-500">
            자료가 모두 접수된 날부터 14일 기준입니다. 심사기간과 본개발 일정은 별도이며, 고객의 자료제출·의사결정이 늦어진 기간은 포함하지 않습니다.
          </p>
        </div>
      </section>

      {/* ── 5. 최종 제공 결과물 — 무엇을 받나? ───────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>결과물</p>
          <h2 className={bigHead}>프로그램으로<br /><span className="text-blue-600">받게 되는 것</span></h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {([
              { src: '/ax-showcase/b2b-order/photo-67-b2b-scope.webp', t: '자금조달 전략', d: '목표 자금·신청기관·준비 순서를 정리합니다.', alt: '목표 자금·신청기관·준비 순서를 정리한 예시' },
              { src: '/ax-showcase/b2b-order/photo-64-b2b-cart-flow.webp', t: 'AX 업무 흐름도', d: '지금(Before)과 바뀐 뒤(After)를 한 장에 담습니다.', alt: '거래처 문의부터 견적·계약까지 업무 흐름 정리 예시', ex: 'B2B 영업에서는 거래처 문의부터 견적·계약까지 흐름을 한 장으로 정리합니다.' },
              { src: '/ax-showcase/design-direction/photo-68-design-direction.webp', t: '실제 화면 초안', d: '심사에서 보여줄 주요 화면을 미리 그립니다.', alt: '심사에서 보여줄 주요 화면 초안 예시' },
              { src: '/ax-showcase/b2b-order/photo-65-b2b-admin-dashboard.webp', t: '시연형·작동형 MVP', d: '선택 단계에 따라 클릭 시연부터 실제 작동까지.', alt: '실제로 작동하는 관리자 화면 예시' },
              { src: '/ax-showcase/equipment-platform/photo-82-equiplink-quote.webp', t: '심사 설명자료·특허 연계', d: '설명자료를 만들고, 서비스 구조와 연계한 특허출원을 준비합니다.', alt: '심사 설명자료와 견적·구조 정리 예시' },
            ] as { src: string; t: string; d: string; alt: string; ex?: string }[]).map((c) => (
              <div key={c.t} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <Shot src={c.src} alt={c.alt} />
                <h3 className="mt-3 text-[1.05rem] font-black leading-snug text-slate-900">{c.t}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-slate-600">{c.d}</p>
                {c.ex && <Example>{c.ex}</Example>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. 구현 수준 (1~4단계 탭) — 각 단계는 어디까지 작동하나? ─────── */}
      <section id="build-levels" className={`scroll-mt-16 bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>구현 수준</p>
          <h2 className={bigHead}>어디까지 작동하는지<br /><span className="text-blue-600">단계별로 확인하세요</span></h2>
          <p className={lead}>단계가 올라갈수록 실제로 작동하는 범위가 넓어집니다.</p>

          <div role="tablist" aria-label="구현 단계 선택" className="mt-8 grid grid-cols-4 gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
            {LEVEL_TABS.map((t) => {
              const on = level === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setLevel(t.key)}
                  className={`relative min-h-[46px] rounded-xl px-2 text-center text-[0.95rem] font-black transition ${
                    on ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  {t.key}단계
                  {t.recommended && <span className="ml-0.5 align-super text-[0.6rem] text-amber-400" aria-hidden>★</span>}
                </button>
              )
            })}
          </div>

          <div className={`mt-5 rounded-3xl border-2 p-5 shadow-sm sm:p-6 ${activeTab.recommended ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'}`}>
            {activeTab.recommended && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[0.74rem] font-black text-slate-900 shadow-sm">
                미래AI랩 권장 최종 목표
              </span>
            )}
            <h3 className="text-[1.25rem] font-black leading-snug tracking-tight text-slate-900">{activeTab.key}단계 · {activeTab.title}</h3>
            <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">{activeTab.message}</p>
            <ul className="mt-4 space-y-2.5">
              {activeTab.list.map((it) => (
                <li key={it} className="flex items-start gap-2 text-[0.98rem] leading-relaxed text-slate-700">
                  <span className="mt-0.5 shrink-0 font-black text-teal-500" aria-hidden>✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3">
              <p className="text-[0.78rem] font-black uppercase tracking-wide text-teal-300">이 단계 결과물</p>
              <p className="mt-1 text-[0.98rem] font-bold leading-snug text-white">{activeTab.result}</p>
            </div>
            {activeTab.key === '3' && (
              <Example>시설관리 회사에서는 현장 직원이 로그인해 점검 사진과 처리결과를 건물별로 저장합니다.</Example>
            )}
            {activeTab.recommended && (
              <>
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-[0.95rem] leading-relaxed text-slate-700">
                  3단계도 핵심 기능을 검증할 수 있지만, 직원 사용과 운영계획까지 보여줘야 하는 기업에는 4단계를 권장합니다.
                </p>
                <Example>물류 창고에서는 관리자와 현장 직원이 각자 화면으로 입고·출고를 처리합니다.</Example>
              </>
            )}
          </div>

          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[0.9rem] leading-relaxed text-slate-500">
            카카오 알림톡, 결제, 택배사, 세무·회계 프로그램처럼 다른 서비스와 자동으로 연결하는 기능은 별도 견적입니다.
          </p>

          <CtaButtons onConsult={openConsult} />
        </div>
      </section>

      {/* ── 7. 비용과 결제시점 (가격표 — 딱 한 번) — 얼마를 언제 내나? ───── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>비용 · 결제시점</p>
          <h2 className={bigHead}>처음부터 수천만원이 아닙니다.<br /><span className="text-blue-600">100만원으로 시작</span>합니다.</h2>
          <div className="mt-9 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[0.8rem] font-black uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">단계</th>
                  <th className="px-4 py-3">비용</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_ROWS.map((r) => (
                  <tr key={r.name} className={`border-b border-slate-100 last:border-0 ${r.recommended ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3.5 align-top">
                      <span className="block text-[0.98rem] font-black leading-snug text-slate-900">{r.name}</span>
                      {r.recommended && (
                        <span className="mt-1 inline-flex rounded-md bg-amber-400 px-2 py-0.5 text-[0.7rem] font-black text-slate-900">권장 최종 목표</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[0.98rem] font-bold text-slate-800">{r.price}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 text-[0.9rem] font-semibold text-slate-500">VAT</td>
                  <td className="px-4 py-3 text-[0.9rem] font-semibold text-slate-500">별도</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-3xl border-2 border-amber-300 bg-amber-50/60 p-5 sm:p-6">
            <p className="text-[1.05rem] font-black leading-snug text-slate-900">
              본개발비는 <span className="text-amber-600">정책자금 조달 이후 정산(후불)</span>합니다.
            </p>
            <ul className="mt-2.5 space-y-1.5 text-[0.98rem] leading-relaxed text-slate-700">
              <li>컨설팅비 100만원은 개발비에서 차감되지 않습니다.</li>
              <li>자금이 실행되지 않으면 선택하지 않은 본개발비는 발생하지 않습니다.</li>
              <li>선개발을 별도 계약한 경우 해당 계약의 지급조건이 적용됩니다.</li>
            </ul>
          </div>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-slate-500">
            자금조달 전에 먼저 개발(선개발)을 원하는 경우, 자금조달과 별개의 개발계약으로 진행합니다.
          </p>
          <Guarantee />
        </div>
      </section>

      {/* ── 8. 일반 개발회사 비교 — 다른 개발회사와 뭐가 다른가? ─────────── */}
      <section className={`bg-white ${band}`}>
        <div className="mx-auto max-w-5xl px-0">
          <p className={kicker}>비교</p>
          <h2 className={bigHead}>각자 잘하는 곳은 있습니다.<br /><span className="text-blue-600">둘을 잇는 곳은 드뭅니다.</span></h2>
          <p className={lead}>정책자금 회사(A)도, 개발회사(B)도 각자 강점이 있습니다. 미래AI랩(C)은 자금전략과 실제 화면을 한 프로젝트로 잇습니다.</p>
          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {([
              {
                label: 'A · 일반 정책자금 컨설팅',
                items: [
                  '사업계획서·신청자료 중심',
                  '실제 AX 화면·시스템은 별도',
                  '개발업체에 사업을 다시 설명',
                  '자금조달 이후 실행까지 연결 안 될 수 있음',
                ],
                highlight: false,
              },
              {
                label: 'B · 일반 개발회사',
                items: [
                  '정책자금 심사·자금논리를 모를 수 있음',
                  '처음부터 큰 개발범위 견적',
                  '착수금·중도금 먼저',
                  '개발 후 사업계획과 별도',
                ],
                highlight: false,
              },
              {
                label: 'C · 미래AI랩',
                items: [
                  '김팀장이 정책자금·사업기획을 직접 설계',
                  '개발 담당자 처음부터 공동참여',
                  '컨설팅비 100만원으로 방향·화면 먼저',
                  '2주 안에 자금전략·화면 초안',
                  '본개발비는 자금조달 이후',
                  '지원금·인증·복지기금·절세까지 성장단계 연결',
                ],
                highlight: true,
              },
            ] as { label: string; items: string[]; highlight: boolean }[]).map((col) =>
              col.highlight ? (
                <div key={col.label} className="relative rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-sm">
                  <span className="absolute -top-3 left-6 inline-flex rounded-full bg-blue-600 px-3 py-1 text-[0.74rem] font-black text-white shadow-sm">미래AI랩</span>
                  <p className="mt-1 text-[0.82rem] font-black uppercase tracking-wide text-blue-600">{col.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-relaxed text-slate-700">
                        <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div key={col.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-[0.82rem] font-black uppercase tracking-wide text-slate-400">{col.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[0.95rem] leading-relaxed text-slate-500">
                        <span className="mt-0.5 shrink-0 text-slate-400" aria-hidden>—</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
          <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-[1rem] font-bold leading-relaxed text-slate-800">
              정책자금만 받고 끝나는 것도, 시스템만 만들고 끝나는 것도 아닙니다. 자금전략과 실제 회사의 변화를 하나의 프로젝트로 진행합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. 업종별 AX 사례 — 우리 업종은 어떻게 되나? ─────────────────── */}
      <AxIndustryShowcase />

      {/* ── 10. 현재 진행 프로젝트 — 뭘 믿나? ────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행 현황</p>
          <h2 className={bigHead}>지금 함께<br /><span className="text-blue-600">진행 중인 프로젝트</span></h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {[
              { c: '진행기업 A', ind: '숙박업', stage: 'AX 실행설계 완료, 심사용 화면 준비 중' },
              { c: '진행기업 B', ind: '시설관리', stage: '핵심 업무 화면 시연 준비' },
              { c: '진행기업 C', ind: '물류·유통', stage: '현재 업무 흐름 분석 진행' },
            ].map((p) => (
              <div key={p.c} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[1rem] font-black text-slate-900">{p.c}</p>
                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.72rem] font-black text-amber-700">진행 중</span>
                </div>
                <p className="mt-2 text-[0.9rem] font-semibold text-slate-500">{p.ind}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-slate-700">{p.stage}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[0.9rem] leading-relaxed text-slate-500">
            자금승인 완료가 아니라 현재 진행 단계입니다.
          </p>
        </div>
      </section>

      {/* ── 11. 대표자와 수행체계 — 누가 책임지고 하나? ──────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>대표 컨설턴트</p>
          <div className="mx-auto mt-5 flex max-w-2xl flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <img src="/assets/profile/ceo-avatar.webp" alt="대표 컨설턴트 김팀장 프로필" loading="lazy" decoding="async" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
            <h2 className="mt-4 text-[1.2rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">
              정책자금만 연결하는 컨설턴트가 아닙니다.<br />기업의 다음 단계까지 설계합니다.
            </h2>
            <p className="mt-3 text-[1rem] leading-relaxed text-slate-600">
              김팀장은 자금 가능성 검토에서 멈추지 않습니다. 어떤 업무를 AX로 바꿀지 기획하고, 개발 담당자와 화면을 함께 만듭니다. 자금조달 이후에는 지원금·인증·복지제도·절세까지 성장순서에 맞춰 연결합니다.
            </p>
            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-[0.92rem] leading-relaxed text-slate-600">
              세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2">
              <span className="text-[1.05rem] font-black text-amber-600">100억원+</span>
              <span className="text-[0.85rem] font-semibold text-slate-600">누적 자금조달 지원 (지원금·세금 환급 포함)</span>
            </div>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-slate-500">
              세무사 등 분야별 전문업무는 해당 자격을 보유한 외부 전문가와 협업해 연결합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 11.5 기업 생애주기 로드맵 — 자금조달 이후 성장순서 ────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>성장 로드맵</p>
          <h2 className={bigHead}>자금조달이 끝이 아닙니다.<br /><span className="text-blue-600">기업이 성장할 다음 순서</span>까지 함께 설계합니다.</h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {([
              { n: '1', t: '자금 확보', d: '현재 기업에 가장 적합한 자금과 기관을 먼저 정합니다.', ex: '정책자금 · 보증기관 · 운전 · 시설자금' },
              { n: '2', t: '사람과 조직', d: '직원 채용·유지에 필요한 제도를 연결합니다.', ex: '고용지원금 · 인사제도 · 사내근로복지기금' },
              { n: '3', t: '기업가치 증명', d: '기술성·신뢰도를 외부에서 확인할 근거를 만듭니다.', ex: '벤처기업 · 연구소 · 메인비즈 · 이노비즈 · ISO' },
              { n: '4', t: '세금과 재무', d: '필요한 전문가와 함께 세금·재무전략을 검토합니다.', ex: '세무사 등 전문가 연계 · 법인운영 · 절세' },
              { n: '5', t: 'AX·업무 고도화', d: '자금조달 이후 실제 업무가 더 잘 돌아가도록 시스템을 고도화합니다.', ex: '' },
            ] as { n: string; t: string; d: string; ex: string }[]).map((a) => (
              <div key={a.n} className="flex items-start gap-3.5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.9rem] font-black text-teal-300">{a.n}</span>
                <div>
                  <h3 className="text-[1.05rem] font-black leading-snug text-slate-900">{a.t}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-slate-600">{a.d}</p>
                  {a.ex && <p className="mt-1.5 text-[0.82rem] font-semibold text-slate-400">{a.ex}</p>}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-[0.92rem] leading-relaxed text-slate-500">
            모든 서비스를 한꺼번에 권하지 않습니다. 현재 문제와 성장단계를 먼저 파악하고 가장 필요한 순서부터 설계합니다.
          </p>
        </div>
      </section>

      {/* ── 12. FAQ — 내가 걱정하는 건? ──────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>자주 묻는 질문</p>
          <h2 className={bigHead}>궁금한 점을<br /><span className="text-blue-600">먼저 풀어드립니다</span></h2>
          <div className="mt-9 space-y-3">
            {[
              {
                q: 'AX가 정확히 뭔가요?',
                a: (
                  <>사람이 반복하던 업무를 자동화·디지털화해 회사 운영 방식을 바꾸는 것입니다(AI Transformation). 고객관리·예약·작업일정 같은 반복 업무부터 화면으로 바꿉니다.</>
                ),
              },
              {
                q: '개발을 전혀 몰라도 진행할 수 있나요?',
                a: <>네. 대표님은 회사 업무만 설명하시면 됩니다. 어떤 화면·기능이 필요한지는 컨설턴트와 개발 담당자가 함께 정리해 드립니다.</>,
              },
              {
                q: '우리 업종에도 적용할 수 있나요?',
                a: (
                  <>
                    반복 업무가 있는 대부분의 업종에 적용됩니다. 임대관리 회사에서는 계약·임대료 수납·수선 요청을 세대별로 관리합니다.
                  </>
                ),
              },
              {
                q: '프로토타입과 MVP는 무엇이 다른가요?',
                a: (
                  <>
                    <Tip term="프로토타입">버튼을 누르며 서비스 흐름을 보여주는 시연용 화면. 실제 데이터는 저장되지 않습니다.</Tip>은 버튼을 누르며 흐름을 보여주는 시연용 화면입니다. <Tip term="MVP">가장 중요한 기능부터 실제로 작동하게 만든 초기 시스템.</Tip>는 가장 중요한 기능부터 실제로 작동해 데이터가 저장되는 초기 시스템입니다.
                  </>
                ),
              },
              {
                q: '처음부터 큰 시스템을 만들어야 하나요?',
                a: <>아니요. 자금조달과 실제 업무에 필요한 기능부터 단계적으로 만듭니다. 불필요한 전체 시스템을 처음부터 만들지 않습니다.</>,
              },
              {
                q: '정책자금 승인이 보장되나요?',
                a: <>보장되지 않습니다. 다만 실제 업무 흐름과 작동하는 화면으로 실행 근거를 보완해, 심사에서 설명할 수 있는 준비를 함께 갖춥니다. 자금조달 결과·금액은 기관 심사에 따라 달라집니다.</>,
              },
              {
                q: '시스템은 어디에 저장되고 누가 관리하나요?',
                a: (
                  <>
                    고객정보·작업기록·사진은 사라지지 않고 고객별·날짜별로 안전한 클라우드에 저장됩니다. 회사 밖에서도 인터넷으로 접속해 사용할 수 있고, 계정과 권한은 대표님이 관리합니다.
                    <details className="group/inner mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 [&_summary]:cursor-pointer">
                      <summary className="flex items-center justify-between text-[0.88rem] font-bold text-slate-600 marker:content-['']">
                        <span>개발방식 자세히 보기</span>
                        <span className="ml-3 shrink-0 text-slate-400 transition-transform group-open/inner:rotate-45" aria-hidden>+</span>
                      </summary>
                      <p className="mt-2 text-[0.82rem] leading-relaxed text-slate-500">
                        관리형 데이터베이스(PostgreSQL 기반 Supabase 등)에 저장하고, 행 단위 접근제어(RLS)와 서비스 역할 키(service role key)를 분리합니다. 고객사별 구분(tenant_id 기반 멀티테넌트), 환경변수와 표준 프레임워크로 구축합니다.
                      </p>
                    </details>
                  </>
                ),
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-[1.05rem] font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <div className="mt-3 text-[0.98rem] leading-relaxed text-slate-600">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. 최종 CTA (navy) ──────────────────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div ref={finalCtaRef} className="mx-auto max-w-[600px] rounded-3xl bg-slate-900 p-7 text-center shadow-xl sm:p-10">
          <p className="text-[0.8rem] font-black uppercase tracking-widest text-amber-300">먼저 확인하세요</p>
          <h2 className="mt-3 text-[1.5rem] font-black leading-[1.32] tracking-tight text-white sm:text-[1.9rem]">
            우리 회사도 AX로 설명할 수 있는지<br />먼저 확인해보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-slate-300">
            3분 기업진단으로 현재 상황을 정리하고, <b className="text-white">{FLAGSHIP.name}</b> 상담으로 이어갈 수 있습니다.
          </p>
          <CtaButtons dark onConsult={openConsult} />
          <Guarantee dark />
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

      {/* 상시 카카오 상담 플로팅 */}
      <KakaoFloat />

      {/* Mobile sticky CTA — 최종 CTA 노출 시 자동 숨김 */}
      {showBar && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.95rem] font-black text-slate-900">{FLAGSHIP.name}</span>
            <span className="block truncate text-[0.8rem] font-medium text-slate-500">3분 기업진단으로 시작하세요</span>
          </span>
          <Link to="/business-diagnosis" className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[0.95rem] font-bold text-white">
            3분 기업진단
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
        contextRows={[{ label: '관심 프로그램', value: FLAGSHIP.consultName }] as ConsultContextRow[]}
      />
    </div>
  )
}
