import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import AxHero from '../components/ax/AxHero'
import AxIndustryShowcase from '../components/ax/AxIndustryShowcase'
import AxPolicyShift from '../components/ax/AxPolicyShift'
import AxProcessSection from '../components/ax/AxProcessSection'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { consultLinks } from '../config/businessInfo'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { FLAGSHIP } from '../data/corePrograms'
import { businessPackages, type ModuleGroup } from '../data/businessPackages'
import { saveBusinessReturn, readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 중소기업 대표용 메인 페이지 (모바일 우선) — "빼고 줄이고 단순하게".
// 순서: Hero → AX 쇼케이스(단일 뷰어) → 2026 정책 요약 → 진행 방식 → 제공 결과물 → 서비스·모듈 링크 → CTA
// 가격 상세·단계·범위는 홈에서 크게 노출하지 않고 상세페이지(/business-services/funding-consulting)에서 확인한다.

// 홈에서 짧게 보여줄 실제 제공 결과물(5개)
const DELIVERABLES = [
  'AX 화면 초안',
  '시연형 프로토타입',
  '핵심 기능 MVP',
  '자금 설명용 요약자료',
  '필요 시 특허 출원 연계',
]

// 서비스 요약(가격 나열 대신 방식 중심)
const PROGRAM_POINTS = [
  '자금 컨설턴트와 개발 담당자가 처음부터 같은 프로젝트로 참여',
  '사업계획서를 넘어 실제 실행화면이 필요한 기업 대상',
  '범위에 따라 단계별로 진행 (착수금 100만원부터 시작)',
]

// 성장 모듈 — 진단 후 필요할 때 연결되는 실행 항목. 드로어 #module-* 앵커와 일치.
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
const h2Class = 'mt-2 text-[1.6rem] font-black tracking-tight text-slate-900 sm:text-[1.9rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 성장 모듈 그룹 — 모바일 아코디언 / 데스크톱 항상 노출
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

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩'
  }, [])

  // 뒤로가기(POP) 복원 — 상세/모듈에서 돌아오면 이전 스크롤 위치로.
  // 브라우저 기본 복원(auto)이 SPA 재렌더 뒤 엉뚱한 위치로 튀므로 manual 로 직접 제어하고,
  // 이미지 로드로 레이아웃이 변해도 어긋나지 않게 여러 시점에 다시 적용한다.
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

  // #hash 딥링크 → 해당 섹션으로 스크롤(명시적 hash 있을 때만).
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

  // Hero가 보이는 동안 하단 고정 CTA 숨김
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

  const openProgram = () => setConsultOpen(true)
  const saveReturn = (cardId: string) => saveBusinessReturn(cardId)

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
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행 방식</button>
            <button type="button" onClick={() => scrollToId('services')} className="transition-colors hover:text-slate-900">서비스</button>
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
        <AxHero onShowcase={() => scrollToId('ax-showcase')} onProgram={() => scrollToId('services')} />
      </div>

      {/* 2. AX 쇼케이스 (단일 뷰어) */}
      <AxIndustryShowcase />

      {/* 3. 2026 정책 요약 */}
      <AxPolicyShift />

      {/* 4. 진행 방식 요약 */}
      <AxProcessSection />

      {/* 5. 실제 제공 결과물 (짧게) */}
      <section id="deliverables" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>실제 제공 결과물</p>
          <h2 className={h2Class}>무엇을 받게 되나요?</h2>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {DELIVERABLES.map((d) => (
              <div key={d} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-[0.8rem] font-black text-white">✓</span>
                <span className="text-[0.98rem] font-bold text-slate-800">{d}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 break-keep text-[0.85rem] leading-relaxed text-slate-500">
            심사에 쓰고 버리는 화면이 아니라, 자금조달 이후 실제 업무에 연결하는 것을 목표로 만듭니다.
          </p>
        </div>
      </section>

      {/* 6. 서비스 요약 + 상세/모듈 링크 (가격 대신 방식 중심) */}
      <section id="services" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>프로그램</p>
          <h2 className={h2Class}>{FLAGSHIP.name}</h2>
          <ul className="mt-5 space-y-2">
            {PROGRAM_POINTS.map((t) => (
              <li key={t} className="flex items-start gap-2.5 break-keep text-[0.98rem] leading-relaxed text-slate-700">
                <span aria-hidden className="mt-0.5 shrink-0 font-black text-blue-500">·</span>{t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link to="/business-services/funding-consulting" onClick={() => saveReturn('services')} className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-[0.95rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700">
              프로그램·단계·비용 자세히 보기
            </Link>
            <button type="button" onClick={openProgram} className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-[0.95rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
              상담 신청
            </button>
          </div>

          {/* 성장 모듈 — 진단 후 필요할 때 연결하는 상세 서비스 */}
          <div className="mt-9">
            <p className="text-[0.9rem] font-bold text-slate-500">진단 결과에 따라 필요한 인증·지원제도만 연결합니다.</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {GROWTH_MODULES.map((m, i) => <ModuleGroupCard key={m.id} m={m} defaultOpen={i === 0} onNav={saveReturn} />)}
            </div>
            {GROWTH_MODULES.map((m) => <span key={m.id} id={m.id} aria-hidden className="block h-0 scroll-mt-24" />)}
          </div>
        </div>
      </section>

      {/* 7. 최종 CTA */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="text-[1.7rem] font-black leading-tight tracking-tight text-white sm:text-[2.1rem]">우리 회사에 맞는 자금과<br className="sm:hidden" /> AX 실행 방향을 함께 점검해보세요.</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto">
                <span aria-hidden>🩺</span> 3분 기업진단 시작
              </Link>
              <button type="button" onClick={() => scrollToId('ax-showcase')} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                AX 사례 다시 보기
              </button>
            </div>
          </div>
        </section>
      </div>

      <LegalFooter />

      {/* Mobile sticky CTA — Hero 보이는 동안·최종 CTA 노출 시 숨김 */}
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
        preselectProgram={FLAGSHIP.consultName}
      />
    </div>
  )
}
