import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxHero from '../components/ax/AxHero'
import AxIndustryShowcase from '../components/ax/AxIndustryShowcase'
import AxPolicyShift from '../components/ax/AxPolicyShift'
import AxProcessSection from '../components/ax/AxProcessSection'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { FLAGSHIP } from '../data/corePrograms'
import { FUNDING_HOME } from '../data/policyFunding2026'
import { businessPackages, type ModuleGroup } from '../data/businessPackages'
import { saveBusinessReturn, readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 중소기업 대표용 메인 페이지 (모바일 우선). 핵심 메시지: 억 단위 정책자금 + 실제 AX 화면 + 공동 참여 + 후불.
// 섹션 수는 유지하되 메시지·이미지·구매동선을 강화. 가격은 홈에서 한 곳(프로그램)에서만 노출.
const DETAIL = '/business-services/funding-consulting'

// 최종 제공 결과물(이미지 중심 5개)
const DELIVERABLES = [
  { t: '자금조달 전략', d: '신청기관, 목표금액과 자금사용계획', img: '/ax-showcase/b2b-order/photo-67-b2b-scope.webp' },
  { t: 'AX 업무 흐름도', d: '현재 업무와 개선 업무를 한눈에 정리', img: '/ax-showcase/equipment-platform/photo-84-equiplink-flow.webp' },
  { t: '실제 화면 초안', d: '사업계획을 눈으로 확인할 수 있는 화면', img: '/ax-showcase-v2/photo-104-staydeck-showcase.webp' },
  { t: '시연형·작동형 MVP', d: '선택한 구현단계에 따른 실제 시스템', img: '/ax-showcase/b2b-order/photo-65-b2b-admin-dashboard.webp' },
  { t: '심사 설명자료·특허 연계', d: '기술성과 실행계획을 설명하는 자료', img: '/ax-showcase/design-direction/photo-68-design-direction.webp' },
]

// 1~4단계 — 가격이 아니라 "왜 필요한지"
const LEVELS = [
  { no: '1', name: 'AX 실행 설계', msg: '막연한 아이디어를 실제 화면구조로 바꿉니다.' },
  { no: '2', name: '시연형 프로토타입', msg: '심사자가 클릭하며 서비스 흐름을 확인할 수 있습니다.' },
  { no: '3', name: '핵심기능 MVP', msg: '로그인과 데이터 저장으로 핵심 기능이 실제 작동합니다.' },
  { no: '4', name: '업무사용형 MVP', msg: '대표자와 직원이 실제 업무에 사용하며 운영계획까지 설명할 수 있습니다.', rec: true },
]

const PROJECTS = [
  { label: '진행기업 A', stage: '자금전략 수립 · AX 적용업무 선정' },
  { label: '진행기업 B', stage: '업무 흐름 설계 · 화면 제작' },
  { label: '진행기업 C', stage: '기업자료 검토 · 기관 설명자료 준비' },
]

const AWARDS = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상 · 경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국 사회공헌 K-컬처 나눔봉사공헌대상 · 벤처부문' },
]

const GROWTH_MODULES: { id: string; no: string; title: string; group: ModuleGroup; accent: string }[] = [
  { id: 'module-innovation', no: '01', title: '기술·혁신 기반', group: 'tech', accent: 'text-violet-600' },
  { id: 'module-trust', no: '02', title: '경영·대외 신뢰', group: 'trust', accent: 'text-blue-600' },
  { id: 'module-digital', no: '03', title: '디지털 실행', group: 'digital', accent: 'text-teal-600' },
  { id: 'module-finance', no: '04', title: '재무·전문가 연계', group: 'finance', accent: 'text-slate-500' },
]
const MODULE_MEMBERS: Record<ModuleGroup, { slug: string; name: string }[]> = (['tech', 'trust', 'digital', 'finance'] as ModuleGroup[]).reduce(
  (acc, g) => {
    acc[g] = businessPackages.filter((p) => p.moduleGroup === g).map((p) => ({ slug: p.slug, name: p.name }))
    return acc
  },
  {} as Record<ModuleGroup, { slug: string; name: string }[]>,
)

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-[1.55rem] font-black tracking-tight text-slate-900 sm:text-[1.9rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function ModuleGroupCard({ m, defaultOpen, onNav }: { m: (typeof GROWTH_MODULES)[number]; defaultOpen: boolean; onNav: (id: string) => void }) {
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
              <Link to={`/business-services/${mp.slug}`} onClick={() => onNav(m.id)} className="group -mx-0.5 flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[0.85rem] font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
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
  const location = useLocation()
  const navType = useNavigationType()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩'
  }, [])

  // 뒤로가기(POP) 복원 — 상세/모듈에서 돌아오면 이전 스크롤 위치로. manual 로 직접 제어.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (location.hash) return
    if (navType !== 'POP') return
    const saved = readBusinessReturn()
    if (!saved || saved.path !== location.pathname) return
    const y = Math.max(0, saved.scrollY)
    const apply = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' })
    apply()
    const timers = [60, 160, 320, 560].map((d) => window.setTimeout(apply, d))
    const onLoad = () => apply()
    window.addEventListener('load', onLoad, { once: true })
    const clear = window.setTimeout(() => clearBusinessReturn(), 720)
    return () => { timers.forEach(clearTimeout); window.clearTimeout(clear); window.removeEventListener('load', onLoad) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setHeroVisible(entries[0]?.isIntersecting ?? false), { rootMargin: '-40px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = finalCtaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const saveReturn = (cardId: string) => saveBusinessReturn(cardId)
  const goDetail = (hash = '') => { saveReturn('detail'); navigate(DETAIL + hash) }

  return (
    <div className="min-h-screen bg-white pb-16 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
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
          <nav className="hidden items-center gap-5 text-[0.92rem] font-medium text-slate-600 xl:flex">
            <button type="button" onClick={() => scrollToId('ax-showcase')} className="transition-colors hover:text-slate-900">AX 쇼케이스</button>
            <button type="button" onClick={() => scrollToId('why-ax')} className="transition-colors hover:text-slate-900">2026 정책</button>
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행 과정</button>
            <button type="button" onClick={() => scrollToId('build-levels')} className="transition-colors hover:text-slate-900">구현 수준</button>
            <Link to={DETAIL} className="transition-colors hover:text-slate-900">프로그램</Link>
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

      {/* 1. Hero */}
      <div ref={heroRef}>
        <AxHero onShowcase={() => scrollToId('ax-showcase')} />
      </div>

      {/* 2. 업종별 AX 쇼케이스 */}
      <AxIndustryShowcase />

      {/* 3. 정책자금 심사환경 변화 */}
      <AxPolicyShift onDetail={() => goDetail()} />

      {/* 4. 억 단위 자금 목표 + 단일 프로그램 (홈 유일의 가격 노출) */}
      <section id="program" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>억 단위 자금 목표 · 단일 프로그램</p>
          <h2 className={h2Class}>{FUNDING_HOME.title}</h2>
          <p className="mt-3 max-w-2xl break-keep text-[1.05rem] font-bold leading-relaxed text-slate-800">{FUNDING_HOME.main}</p>
          <ul className="mt-3 space-y-1">
            {FUNDING_HOME.notes.map((n) => <li key={n} className="break-keep text-[0.82rem] leading-relaxed text-slate-500">· {n}</li>)}
          </ul>

          {/* 프로그램 + 비용 구조(가격 한 곳) */}
          <div className="mt-6 rounded-3xl border-2 border-blue-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[1.15rem] font-black tracking-tight text-slate-900">{FLAGSHIP.name}</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[0.76rem] font-bold text-slate-400">시작</p>
                <p className="mt-0.5 text-[0.95rem] font-black text-slate-900">컨설팅비 100만원</p>
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-inset ring-amber-200">
                <p className="text-[0.76rem] font-bold text-amber-700">본개발비 · 후불</p>
                <p className="mt-0.5 text-[0.95rem] font-black text-amber-800">정책자금 조달 이후 정산</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[0.76rem] font-bold text-slate-400">구현범위</p>
                <p className="mt-0.5 text-[0.95rem] font-black text-slate-900">500만~1,500만원 <span className="text-[0.78rem] font-bold text-slate-500">VAT 별도</span></p>
              </div>
            </div>
            <p className="mt-3.5 break-keep rounded-xl bg-slate-900 px-4 py-3 text-[0.9rem] font-bold leading-relaxed text-white">
              자금이 실행되지 않으면 선택하지 않은 <span className="text-amber-300">본개발비는 발생하지 않습니다.</span>
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <Link to={DETAIL} onClick={() => saveReturn('program')} className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-[0.95rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700">
                프로그램·단계·비용 자세히 보기
              </Link>
              <button type="button" onClick={() => setConsultOpen(true)} className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-[0.95rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
                상담 신청
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 계획서가 AX 시스템으로 바뀌는 과정(이미지 흐름) */}
      <AxProcessSection onDetail={() => goDetail()} />

      {/* 6. 최종 제공 결과물(이미지 중심 5개) */}
      <section id="deliverables" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>실제 제공 결과물</p>
          <h2 className={h2Class}>최종적으로 무엇을 받게 되나요?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((d) => (
              <Link key={d.t} to={DETAIL} onClick={() => saveReturn('deliverables')} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
                <div className="flex h-[150px] items-center justify-center overflow-hidden bg-slate-900">
                  <img src={d.img} alt={`${d.t} 예시 이미지`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-start justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <p className="text-[1.02rem] font-black text-slate-900">{d.t}</p>
                    <p className="mt-1 break-keep text-[0.88rem] leading-snug text-slate-500">{d.d}</p>
                  </div>
                  <span aria-hidden className="mt-0.5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-500">→</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={() => goDetail()} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-6 text-[0.92rem] font-black text-white transition-transform hover:-translate-y-0.5">
              비용과 제공 결과물 자세히 보기 <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. 1~4단계 구현수준(가격 없이 메시지 중심) */}
      <section id="build-levels" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>구현 수준</p>
          <h2 className={h2Class}>어디까지 만들지 골라서 진행합니다.</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {LEVELS.map((l) => (
              <div key={l.no} className={`rounded-2xl border p-5 ${l.rec ? 'border-2 border-slate-800 bg-white shadow-md' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-2">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[0.9rem] font-black ${l.rec ? 'bg-slate-900 text-amber-300' : 'bg-slate-100 text-slate-600'}`}>{l.no}</span>
                  <p className="text-[1.05rem] font-black text-slate-900">{l.name}</p>
                  {l.rec && <span className="ml-auto rounded-full bg-amber-400 px-2.5 py-0.5 text-[0.68rem] font-black text-slate-900">권장 최종 목표</span>}
                </div>
                <p className="mt-2.5 break-keep text-[0.92rem] leading-relaxed text-slate-600">{l.msg}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 break-keep text-[0.85rem] leading-relaxed text-slate-500">
            3단계도 핵심 기능을 검증할 수 있지만, 직원 사용과 운영계획까지 보여줘야 하는 기업에는 4단계를 권장합니다. 자금조달 결과와 금액은 기관 심사에 따라 달라지며 보장되지 않습니다.
          </p>
          <div className="mt-5 flex justify-center">
            <button type="button" onClick={() => goDetail('#build-levels')} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 text-[0.92rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
              단계별 범위 확인하기 <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. 일반 개발방식 비교(홈은 링크만) */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="break-keep text-[0.98rem] font-bold leading-snug text-slate-700">
              일반 개발회사에 처음부터 전체 시스템을 의뢰하는 방식과 무엇이 다른지 확인해보세요.
            </p>
            <button type="button" onClick={() => goDetail('#compare')} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 text-[0.9rem] font-black text-white transition-transform hover:-translate-y-0.5">
              일반 개발방식과 비교하기 <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. 현재 진행 프로젝트 */}
      <section id="projects" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-300">현재 진행 프로젝트</p>
          <h2 className="mt-2 text-[1.5rem] font-black leading-snug tracking-tight text-white sm:text-[1.9rem]">지금 첫 AX 결합 레퍼런스를 만들고 있습니다.</h2>
          <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {PROJECTS.map((p) => (
              <div key={p.label} className="w-[80%] shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:w-auto">
                <span className="inline-block rounded-md bg-teal-400/15 px-2 py-0.5 text-[0.72rem] font-black text-teal-200">진행 중</span>
                <p className="mt-2.5 text-[1.02rem] font-black text-white">{p.label}</p>
                <p className="mt-1.5 break-keep text-[0.86rem] leading-relaxed text-slate-400">{p.stage}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 break-keep text-[0.8rem] leading-relaxed text-slate-500">현재 3개 기업과 진행 중이며 자금승인 완료 사례가 아닙니다. 고객사명과 세부정보는 동의 없이 공개하지 않습니다.</p>
        </div>
      </section>

      {/* 10. 성장 모듈 */}
      <section id="growth-modules" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className="text-[0.8rem] font-semibold text-slate-400">진단 결과에 따라 필요한 인증·지원제도만 연결합니다.</p>
          <h2 className="mt-1.5 text-[1.4rem] font-black tracking-tight text-slate-900 sm:text-[1.6rem]">필요한 항목만 성장 순서에 맞게 연결합니다.</h2>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {GROWTH_MODULES.map((m, i) => <ModuleGroupCard key={m.id} m={m} defaultOpen={i === 0} onNav={saveReturn} />)}
          </div>
          {GROWTH_MODULES.map((m) => <span key={m.id} id={m.id} aria-hidden className="block h-0 scroll-mt-24" />)}
        </div>
      </section>

      {/* 11. 대표자 신뢰영역 */}
      <section id="leader" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필 사진" loading="lazy" decoding="async" width={200} height={200} className="h-16 w-16 shrink-0 rounded-full object-cover shadow ring-2 ring-amber-400/40 sm:h-20 sm:w-20" />
              <div className="min-w-0">
                <p className="text-[0.78rem] font-black uppercase tracking-widest text-blue-600">대표자와 수행체계</p>
                <h3 className="mt-1 break-keep text-[1.2rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">자금만 아는 사람도, 개발만 아는 사람도 만들기 어려운 방식입니다.</h3>
              </div>
            </div>
            <p className="mt-5 break-keep text-[1rem] leading-relaxed text-slate-700">
              정책자금 전략은 대표 컨설턴트가 직접 설계하고, 개발 담당자가 처음부터 함께 참여합니다.
            </p>
            <p className="mt-2.5 break-keep text-[0.9rem] leading-relaxed text-slate-500">
              세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원. 누적 자금조달 지원 100억원+(지원금·세금 환급 포함).
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              {AWARDS.map((a) => (
                <span key={a.title} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.75rem] font-semibold text-slate-600">
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.64rem] font-black text-amber-300">{a.year}</span>{a.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-5 space-y-2.5">
            {[
              { q: 'AX가 정확히 뭔가요?', a: '새로운 AI 사업을 시작한다는 뜻만은 아닙니다. 지금 엑셀, 카카오톡이나 수기로 처리하는 업무를 로그인·데이터 저장·자동화가 되는 화면으로 바꾸는 것도 AX입니다.' },
              { q: '개발을 전혀 몰라도 진행할 수 있나요?', a: '가능합니다. 대표자는 현재 업무가 어떻게 돌아가는지만 설명하면 됩니다. 기능명이나 개발용어를 미리 알 필요는 없습니다.' },
              { q: '큰 개발비는 언제 내나요?', a: '컨설팅비 100만원으로 시작하고, 본개발비는 정책자금이 조달된 이후에 정산합니다. 자금이 실행되지 않으면 선택하지 않은 본개발비는 발생하지 않습니다.' },
              { q: '정책자금 승인이 보장되나요?', a: '보장되지 않습니다. 다만 사업계획을 실제 업무 흐름, 화면과 자금사용계획으로 구체화해 심사에서 설명할 근거를 보완합니다.' },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-slate-50 open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[0.98rem] font-bold text-slate-900">
                  Q. {f.q}
                  <span aria-hidden className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="break-keep px-4 pb-4 text-[0.92rem] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 13. 최종 CTA */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="break-keep text-[1.65rem] font-black leading-tight tracking-tight text-white sm:text-[2.1rem]">우리 회사도 AX로 설명할 수 있는지<br className="sm:hidden" /> 먼저 확인해보세요.</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto">
                <span aria-hidden>🩺</span> 3분 기업진단 시작
              </Link>
              <Link to={DETAIL} onClick={() => saveReturn('cta')} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                프로그램 자세히 보기
              </Link>
            </div>
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* Mobile sticky CTA — 기업진단(카톡은 KakaoFloat가 담당) */}
      {!heroVisible && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <Link to="/business-diagnosis" className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[0.95rem] font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
            <span aria-hidden>🩺</span> 3분 기업진단 시작
          </Link>
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
        preselectProgram={FLAGSHIP.consultName}
      />
    </div>
  )
}
