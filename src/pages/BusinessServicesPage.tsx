import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import AxHero from '../components/ax/AxHero'
import AxIndustryShowcase from '../components/ax/AxIndustryShowcase'
import AxPolicyShift from '../components/ax/AxPolicyShift'
import AxProcessSection from '../components/ax/AxProcessSection'
import AxDifference from '../components/ax/AxDifference'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { consultLinks } from '../config/businessInfo'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { getMainProgram } from '../data/corePrograms'
import { businessPackages, type ModuleGroup } from '../data/businessPackages'

// 중소기업 대표용 메인 페이지 (모바일 우선). 5초 안에: 정책자금만이 아니라 자금+AX 화면을 함께 만드는 곳임을 전달.
// 순서: Hero → AX SHOWCASE → 진행현황 → 왜 AX인가 → 진행방식 → A·B 프로그램 → 성장모듈 → 대표자·신뢰 → FAQ → 최종CTA
// 가격은 corePrograms.ts MAIN_PROGRAMS 단일 소스. 계산기·대형 결과물 섹션·Problem→Screen 독립섹션은 제거/흡수.

const A = getMainProgram('A')
const B = getMainProgram('B')

const AB_CARDS = [
  {
    key: 'A' as const,
    name: A.name,
    tagline: '정책자금 실행과 심사 설명용 AX 프로토타입을 함께 준비합니다.',
    badge: A.badge,
    priceTop: '런칭가',
    price: A.priceMain,
    priceSub: '정식 전환 예정 조건 · 착수 70만원 + 4%',
    goal: '권장 목표 규모 · 최대 1억원',
    goalNote: '',
    target: '소상공인 · 초기기업 · 첫 정책자금 신청기업',
    results: ['자금조달 전략 및 신청 실행', '업종 맞춤 업무 흐름도', '핵심 화면 3~5개 클릭형 AX 프로토타입'],
    status: '',
    notice: '최대 1억원은 권장 목표 규모이며 승인금액 또는 지원한도를 보장하는 의미가 아닙니다.',
    included: A.included,
    detailHref: '/business-services/funding-consulting#program-a',
    consultName: A.consultName,
    ctaLabel: A.ctaLabel,
  },
  {
    key: 'B' as const,
    name: B.name,
    tagline: '자금조달과 실제 업무에서 사용할 AX MVP를 하나의 프로젝트로 진행합니다.',
    badge: B.badge,
    priceTop: B.priceTop ?? '',
    price: B.priceMain,
    priceSub: B.priceSub,
    goal: '권장 목표 규모 · 1억원 이상',
    goalNote: '특히 2억원 이상의 자금조달과 업무시스템 구축을 함께 검토하는 성장기업에 적합합니다.',
    target: '반복 업무와 직원·거래처 데이터가 존재하는 성장기업',
    results: ['A형 자금조달 실행 전체', '로그인·DB·관리자 기능', '핵심 업무 흐름 1개의 작동형 AX MVP'],
    status: '2026년 7월 24일 기준 초기 10개사 중 3개사 진행 중',
    notice: '자금조달 결과를 보장하지 않습니다. 다만 계획만 설명하는 방식보다 실행 준비도와 사업 설명력을 높이기 위한 현실적인 준비 방식입니다.',
    included: B.included,
    detailHref: '/business-services/funding-consulting#program-b',
    consultName: B.consultName,
    ctaLabel: B.ctaLabel,
  },
]

const DELIVERABLES = ['업무 흐름도', 'AX 화면설계', '클릭형 프로토타입', '작동형 MVP']

const homeFaqs = [
  { q: 'AX 화면이 있어야 정책자금을 받을 수 있나요?', a: 'AX 화면이 모든 정책자금의 필수요건은 아닙니다. 다만 사업화 계획과 실행 준비도를 구체적으로 설명하는 자료로 활용할 수 있습니다. 승인 여부와 지원금액은 기관 심사와 기업 조건에 따라 달라집니다.' },
  { q: 'A형의 클릭형 프로토타입은 실제 앱인가요?', a: '실제 앱 전체 개발이 아니라, 사업 구조와 실행 계획을 확인 가능한 화면으로 정리한 결과물입니다. 로그인·데이터베이스·관리자 운영이 필요한 경우 B형(작동형 MVP)에서 다룹니다.' },
  { q: 'B형 MVP에는 어디까지 포함되나요?', a: '로그인·데이터베이스·관리자 화면과 핵심 업무 흐름 1개의 작동형 MVP가 포함됩니다. PG·ERP 실시간 연동·세금계산서 자동발행·택배사 API 등은 기본 제외 또는 별도 협의 범위입니다.' },
  { q: '승인되지 않아도 비용이 발생하나요?', a: '착수금은 프로젝트 진행에 따라 발생하며, 성과보수는 실제 조달이 완료된 금액을 기준으로 산정합니다. 자금조달 결과는 기관 심사와 기업 조건에 따라 달라지며 승인을 보장하지 않습니다.' },
]

// 성장 모듈 — 진단 후 필요할 때 연결되는 실행 항목(개별 가격·CTA 없음). 드로어 #module-* 앵커와 일치.
const GROWTH_MODULES: { id: string; no: string; title: string; group: ModuleGroup; summary: string; accent: string }[] = [
  { id: 'module-innovation', no: '01', title: '기술·혁신 기반', group: 'tech', summary: '벤처확인 · 기업부설연구소 · 이노비즈 · 특허 연계', accent: 'text-violet-600' },
  { id: 'module-trust', no: '02', title: '경영·대외 신뢰', group: 'trust', summary: '메인비즈 · ISO 인증 · 고용지원금 점검', accent: 'text-blue-600' },
  { id: 'module-digital', no: '03', title: '디지털 실행', group: 'digital', summary: '홈페이지 · 업무자동화 · 작동형 AX · 운영 고도화', accent: 'text-teal-600' },
  { id: 'module-finance', no: '04', title: '재무·전문가 연계', group: 'finance', summary: '가지급금 · 이익잉여금 · 승계 · 지분구조 · 전문가 검토', accent: 'text-slate-500' },
]
const MODULE_MEMBERS: Record<ModuleGroup, { slug: string; name: string }[]> = (['tech', 'trust', 'digital', 'finance'] as ModuleGroup[]).reduce(
  (acc, g) => {
    acc[g] = businessPackages.filter((p) => p.moduleGroup === g).map((p) => ({ slug: p.slug, name: p.name }))
    return acc
  },
  {} as Record<ModuleGroup, { slug: string; name: string }[]>,
)

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-[1.7rem] font-black tracking-tight text-slate-900 sm:text-[2rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// A·B 프로그램 카드 — 핵심 정보만, 추가 포함범위는 아코디언
function ProgramCard({ p, onConsult }: { p: (typeof AB_CARDS)[number]; onConsult: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const isB = p.key === 'B'
  return (
    <div className={`flex flex-col rounded-3xl border-2 bg-white p-5 sm:p-6 ${isB ? 'border-slate-800 shadow-xl shadow-slate-900/10' : 'border-blue-500 shadow-sm'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`grid h-9 w-9 place-items-center rounded-xl text-base font-black text-white ${isB ? 'bg-slate-900' : 'bg-blue-600'}`}>{p.key}</span>
        <span className={`rounded-full px-2.5 py-1 text-[0.72rem] font-black ${isB ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'}`}>{p.badge}</span>
      </div>
      <h3 className="mt-3.5 text-[1.3rem] font-black leading-snug tracking-tight text-slate-900">{p.key}. {p.name}</h3>
      <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-500">{p.tagline}</p>

      <div className="mt-3 border-y border-slate-100 py-3">
        {p.priceTop && <p className="text-[0.76rem] font-bold text-slate-400">{p.priceTop}</p>}
        <p className={`mt-0.5 text-[1.25rem] font-black leading-tight tracking-tight ${isB ? 'text-slate-900' : 'text-blue-700'}`}>{p.price}</p>
        <p className="mt-1 text-[0.88rem] font-bold text-slate-600">{p.priceSub}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={`rounded-md px-2 py-0.5 text-[0.74rem] font-black text-white ${isB ? 'bg-slate-900' : 'bg-blue-600'}`}>{p.goal}</span>
      </div>
      {p.goalNote && <p className="mt-1.5 text-[0.82rem] leading-snug text-slate-500">{p.goalNote}</p>}
      <p className="mt-2.5 text-[0.88rem] leading-snug text-slate-600"><b className="font-black text-slate-800">대상</b> · {p.target}</p>

      <p className="mt-3 text-[0.7rem] font-black uppercase tracking-wide text-slate-400">핵심 결과물</p>
      <ul className="mt-1.5 flex-1 space-y-1.5">
        {p.results.map((r) => (
          <li key={r} className="flex items-start gap-2 text-[0.9rem] font-semibold leading-snug text-slate-700"><span className={`mt-0.5 shrink-0 font-black ${isB ? 'text-slate-700' : 'text-blue-500'}`} aria-hidden>✓</span>{r}</li>
        ))}
      </ul>

      {p.status && <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[0.8rem] font-bold text-slate-600">{p.status}</p>}
      <p className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-[0.78rem] leading-snug text-amber-800">{p.notice}</p>

      {/* 추가 포함범위 아코디언 */}
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="mt-3 inline-flex items-center gap-1 self-start text-[0.82rem] font-bold text-slate-500 hover:text-slate-800">
        {open ? '포함 범위 접기' : '포함 범위 보기'} <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2.5">
          {p.included.map((it) => <li key={it} className="flex items-start gap-2 text-[0.83rem] leading-snug text-slate-500"><span aria-hidden className="mt-0.5 text-slate-300">·</span>{it}</li>)}
        </ul>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link to={p.detailHref} className={`flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-[0.92rem] font-black text-white transition-transform hover:-translate-y-0.5 ${isB ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'}`}>자세히 보기</Link>
        <button type="button" onClick={() => onConsult(p.consultName)} className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-[0.92rem] font-black text-slate-700 transition-colors hover:bg-slate-50">{p.ctaLabel}</button>
      </div>
    </div>
  )
}

// 성장 모듈 그룹 — 모바일 아코디언 / 데스크톱 항상 노출
function ModuleGroupCard({ m, defaultOpen }: { m: (typeof GROWTH_MODULES)[number]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left lg:pointer-events-none">
        <span className="flex items-center gap-2">
          <span className={`text-[0.9rem] font-black tabular-nums ${m.accent}`}>{m.no}</span>
          <span className="text-[1rem] font-black leading-snug text-slate-900">{m.title}</span>
        </span>
        <span aria-hidden className={`text-slate-400 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`${open ? 'block' : 'hidden'} border-t border-slate-100 px-2 pb-2 lg:block`}>
        <ul className="space-y-0.5 pt-1">
          {MODULE_MEMBERS[m.group].map((mp) => (
            <li key={mp.slug}>
              <Link to={`/business-services/${mp.slug}`} className="group -mx-0.5 flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[0.85rem] font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                <span className="min-w-0 truncate">{mp.name}</span>
                <span aria-hidden className="shrink-0 text-slate-300 transition-colors group-hover:text-blue-500">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function BusinessServicesPage() {
  const { cart } = useSavedItems()
  const [historyCount] = useState(() => loadHistory().length)
  const [heroVisible, setHeroVisible] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const [preselectProgram, setPreselectProgram] = useState<string | undefined>(undefined)
  const location = useLocation()

  useEffect(() => {
    document.title = '정책자금과 업종 맞춤 AX 시스템 | 미래 AI 랩'
  }, [])

  // #hash 딥링크 → 해당 섹션으로 스크롤(명시적 hash 있을 때만). 해시 없으면 ScrollToTop이 상단 처리.
  // 이미지 로드로 레이아웃이 이동해도 정확히 안착하도록 즉시 스크롤을 여러 번(로드 시 포함) 보정.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const go = () => {
      const el = document.getElementById(id)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - 68
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
    }
    go()
    const timers = [80, 250, 600].map((d) => window.setTimeout(go, d))
    window.addEventListener('load', go, { once: true })
    return () => { timers.forEach(clearTimeout); window.removeEventListener('load', go) }
  }, [location.hash])

  // Hero가 화면에 보이는 동안은 하단 고정 CTA 숨김(IntersectionObserver)
  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setHeroVisible(entries[0]?.isIntersecting ?? false), { rootMargin: '-40px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 최종 CTA가 화면에 들어오면 하단 고정 바 숨김
  useEffect(() => {
    const el = finalCtaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  function openProgram(programName?: string) {
    setPreselectProgram(programName)
    setConsultOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.82rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-[0.92rem] font-medium text-slate-600 xl:flex">
            <button type="button" onClick={() => scrollToId('ax-showcase')} className="transition-colors hover:text-slate-900">AX 구축 사례</button>
            <button type="button" onClick={() => scrollToId('why-ax')} className="transition-colors hover:text-slate-900">왜 AX인가</button>
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행 방식</button>
            <button type="button" onClick={() => scrollToId('programs')} className="transition-colors hover:text-slate-900">A·B 프로그램</button>
            <button type="button" onClick={() => scrollToId('growth-modules')} className="transition-colors hover:text-slate-900">성장 모듈</button>
            <Link to="/business-services/funding-consulting" className="transition-colors hover:text-slate-900">자금조달 상세</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[0.85rem] font-bold text-cyan-800 transition-colors hover:bg-cyan-100 lg:inline-flex">
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            {cart.length > 0 && (
              <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
              </Link>
            )}
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex">3분 기업진단</Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {/* ── S1. Hero ─────────────────────────────────────────────── */}
      <div ref={heroRef}>
        <AxHero onShowcase={() => scrollToId('ax-showcase')} />
      </div>

      {/* ── S2. AX SHOWCASE (Hero 바로 다음) ──────────────────────── */}
      <AxIndustryShowcase />

      {/* ── S3. 현재 진행 현황 ────────────────────────────────────── */}
      <section id="status" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-9">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-teal-300">현재 진행 현황</p>
              <h2 className="mt-2 text-[1.5rem] font-black leading-snug tracking-tight text-white sm:text-[1.8rem]">현재 실제 기업과 레퍼런스를 만들고 있습니다.</h2>
              <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-300">업종별 AX 화면·프로토타입·MVP와 자금기관 설명자료를 함께 준비하고 있으며, 기관 상담·검토 과정에서 업무 흐름과 AX 화면을 설명자료로 활용하고 있습니다.</p>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-400">현재 진행 단계의 프로젝트이며 승인 완료 사례를 의미하지 않습니다. 확정된 결과와 승인 사례는 실제 증빙을 확보한 순서대로 공개합니다.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.82rem] font-bold text-slate-400">초기 레퍼런스 10개사 모집</p>
              <p className="mt-1 flex items-baseline gap-1.5 text-white"><span className="text-[2.4rem] font-black leading-none tracking-tight text-teal-300">3</span><span className="text-[1.1rem] font-bold text-slate-400">/ 10개사 진행 중</span></p>
              <div className="mt-3 flex gap-1.5" aria-hidden>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`h-2 flex-1 rounded-full ${i < 3 ? 'bg-teal-400' : 'bg-white/15'}`} />
                ))}
              </div>
              <p className="mt-2.5 text-[0.78rem] text-slate-500">2026년 7월 24일 기준</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── S4. 왜 지금 AX인가 (#why-ax) ─────────────────────────── */}
      <AxPolicyShift />

      {/* ── S5. 진행 방식 (#process) ──────────────────────────────── */}
      <AxProcessSection />

      {/* ── S6. A·B 프로그램 (#programs) — 결과물 4개 + 카드 2개 ──── */}
      <section id="programs" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
          {/* 결과물 4개(홈 축약) */}
          <p className={eyebrow}>실제 제공 결과물</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {DELIVERABLES.map((d, i) => (
              <div key={d} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center">
                <span className="text-[0.72rem] font-black text-slate-300">0{i + 1}</span>
                <p className="mt-0.5 text-[0.92rem] font-black text-slate-800">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[0.86rem] text-slate-500">기업 상황과 선택한 프로그램에 따라 제공 수준이 달라집니다. 세부 포함·제외 범위는 각 프로그램 상세에서 안내합니다.</p>

          {/* A·B 프로그램 */}
          <h2 className={`${h2Class} mt-8`}>자금조달 목표와 필요한 AX 수준에 따라 선택합니다.</h2>
          <p className="mt-2.5 max-w-2xl text-[1rem] leading-relaxed text-slate-500">
            <b className="text-slate-800">A형은 심사에서 설명할 실행근거</b>를 만들고, <b className="text-slate-800">B형은 자금조달 후 실제로 사용할 AX 시스템</b>을 만듭니다. 어떤 방식이 맞는지는 <Link to="/business-diagnosis" className="font-black text-blue-600 underline underline-offset-2">무료 3분 기업진단</Link>으로 추천받을 수 있습니다.
          </p>
          <div className="mt-5 grid items-stretch gap-4 lg:grid-cols-2">
            {AB_CARDS.map((p) => <ProgramCard key={p.key} p={p} onConsult={openProgram} />)}
          </div>
        </div>
      </section>

      {/* ── S7. 성장 모듈 (#growth-modules) — 서브 영역 ───────────── */}
      <section id="growth-modules" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-10">
          <p className="text-[0.8rem] font-semibold text-slate-400">프로그램은 자금조달과 AX의 진행 방식이고, 성장 모듈은 기업진단 결과에 따라 연결하는 실행 항목입니다.</p>
          <h2 className="mt-1.5 text-[1.4rem] font-black tracking-tight text-slate-900 sm:text-[1.6rem]">필요한 인증과 지원제도는 성장 순서에 맞게 연결합니다.</h2>
          <p className="mt-1.5 max-w-2xl text-[0.94rem] leading-relaxed text-slate-500">모든 기업에 모든 인증이 필요한 것은 아닙니다. 자금 목적, 기술성, 고용계획과 성장단계를 확인한 뒤 필요한 항목만 연결합니다.</p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {GROWTH_MODULES.map((m, i) => <ModuleGroupCard key={m.id} m={m} defaultOpen={i === 0} />)}
          </div>
          {/* 성장 모듈 앵커(#module-*) — 드로어 딥링크 대응, 레이아웃 높이 0 */}
          {GROWTH_MODULES.map((m) => <span key={m.id} id={m.id} aria-hidden className="block h-0 scroll-mt-24" />)}
          <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[0.78rem] leading-relaxed text-slate-400">일부 업무는 세무사·노무사·변호사·변리사 등 외부 전문가 검토 또는 연계가 필요할 수 있습니다.</p>
            <Link to="/business-diagnosis" className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-[0.9rem] font-black text-white transition-transform hover:-translate-y-0.5">
              기업진단으로 필요한 항목 확인하기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── S8. 대표자 메시지 + 신뢰(차별점) ──────────────────────── */}
      <section id="leader" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-lg font-black text-teal-300">대표</span>
              <div>
                <p className="text-[0.78rem] font-black uppercase tracking-widest text-blue-600">대표자 메시지</p>
                <p className="text-[1.05rem] font-black tracking-tight text-slate-900">미래 AI 랩 · 미래경영지원센터</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-[1rem] leading-relaxed text-slate-700">
              <p>기존에는 자금조달 중심으로 기업을 도왔습니다. 하지만 현장에서는 사업계획서만으로 기업의 실행력을 충분히 설명하기 어려운 경우가 많았습니다.</p>
              <p>그래서 이제는 자금을 신청하는 것에서 멈추지 않고, 실제 업무 흐름과 화면, 필요한 경우 작동형 MVP까지 함께 만듭니다.</p>
              <p className="font-bold text-slate-900">처음부터 완벽하다고 말하지 않겠습니다. 현재 실제 기업들과 결과를 만들고 있으며, 확인된 성과를 하나씩 투명하게 공개하겠습니다.</p>
            </div>
            <Link to="/business-diagnosis" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-[0.92rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700">
              우리 회사 방향 진단하기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
      <AxDifference />

      {/* ── S9. FAQ (#faq) — 4개 아코디언 ─────────────────────────── */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-9 sm:px-6 sm:py-10">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-5 space-y-2.5">
            {homeFaqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-slate-50 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[0.98rem] font-bold text-slate-900">
                  Q. {f.q}
                  <span aria-hidden className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="px-4 pb-4 text-[0.9rem] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── S10. 최종 CTA (#cta) ──────────────────────────────────── */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-6 sm:py-16">
            <h2 className="text-[1.7rem] font-black leading-tight tracking-tight text-white sm:text-[2.1rem]">우리 회사에 필요한 자금과<br className="sm:hidden" /> 운영 시스템을 한 번에 점검해보세요.</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto">
                <span aria-hidden>🩺</span> 3분 기업진단 시작
              </Link>
              <button type="button" onClick={() => scrollToId('programs')} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                A·B 프로그램 자세히 보기
              </button>
            </div>
          </div>
        </section>
      </div>

      <LegalFooter />

      {/* Mobile sticky CTA — Hero가 보이는 동안·최종 CTA 노출 시 숨김 */}
      {!heroVisible && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <div className="flex items-center gap-2">
            <Link to="/business-diagnosis" className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[0.95rem] font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <a href={consultLinks.kakaoChat} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-amber-100">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-amber-500" fill="currentColor" aria-hidden><path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 .1 0 .3.2.4.1.1.3 0 .4 0 .5-.1 2.8-1.9 3.3-2.2.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3.4 12 3.4z" /></svg>
              상담
            </a>
          </div>
        </div>
      )}

      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="경영지원 서비스몰"
        heading="상담 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
        showContactMethod
        showCompanyFields
        programSelect
        preselectProgram={preselectProgram}
      />
    </div>
  )
}
