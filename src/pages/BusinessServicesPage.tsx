import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxIndustryShowcaseV2 from '../components/ax-showcase/AxIndustryShowcaseV2'
import AxPackageComparison from '../components/ax-showcase/AxPackageComparison'
import {
  AxCoreValuesSection,
  AxDeliverablesSection,
  AxEmpathyV2,
  AxHeroV2,
  AxMethodSection,
  AxSelectionSection,
  AxTimelineSection,
} from '../components/ax-showcase/axHomeSections'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { FLAGSHIP } from '../data/corePrograms'
import { businessPackages, type ModuleGroup } from '../data/businessPackages'
import { saveBusinessReturn, readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 미래AI랩 = 정책자금 기반 기업 사업화 회사. AX는 자금을 받을 이유를 실제로 만들어 보여주는 수단이다.
// 홈 순서: Hero → 자금문제 공감 → 세 가지 가치 → AX 사업화 5단계 →
//          15개 업종 선택 · 5장 변화 · 여기서 끝나지 않습니다 · 사업화 예시 2개 →
//          프로그램 A·B·C(가격 노출은 홈에서 여기 한 곳) → 최대 2주 과정 → 실제 결과물 →
//          진행 중인 사례 → 김팀장과 수행체계 → 생애주기 → 월 최대 5개사 선별기준 → FAQ → CTA
const DETAIL = '/business-services/funding-consulting'

// 진행형 사례 — 자금승인 완료 사례가 아니라 현재 진행단계
const CASE_A = {
  label: '현장 서비스기업 A사',
  before: '인력과 운영비가 필요합니다.',
  after: '현장업무를 데이터화하고, 고객과 작업이력 관리 시스템을 구축해 서비스 범위와 처리량을 확대합니다.',
  status: '자금전략 · AX 화면 · 설명자료 준비 중',
  notice: '자금승인 완료 사례가 아니라 현재 진행단계입니다.',
}

// 기업 생애주기 로드맵 — 홈은 순서만 미리보기
const LIFECYCLE = [
  { icon: '💰', t: '자금조달' },
  { icon: '👥', t: '고용지원금과 조직' },
  { icon: '🏅', t: '벤처·연구소·메인비즈·이노비즈·ISO' },
  { icon: '🎁', t: '복지기금과 기업제도' },
  { icon: '🧮', t: '전문가와 함께하는 세무·절세전략' },
  { icon: '⚙️', t: 'AX 업무시스템 고도화' },
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

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩'
  }, [])

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

  return (
    <div className="min-h-screen bg-white pb-16 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header — 핵심 메뉴만 */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.82rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">정책자금 전문</b></span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-[0.92rem] font-medium text-slate-600 lg:flex">
            <Link to={DETAIL} onClick={() => saveReturn('nav')} className="transition-colors hover:text-slate-900">프로그램</Link>
            <button type="button" onClick={() => scrollToId('ax-showcase-v2')} className="transition-colors hover:text-slate-900">업종별 AX</button>
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행과정</button>
            <a href="https://pf.kakao.com/_xkxnBxbn/chat" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-900">카톡 상담</a>
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

      {/* 1. Hero — 무엇을 파는 회사인지 5초 안에 */}
      <div ref={heroRef}>
        <AxHeroV2 onShowcase={() => scrollToId('ax-showcase-v2')} />
      </div>

      {/* 2. 고객의 자금문제 공감 */}
      <AxEmpathyV2 />

      {/* 3. 미래AI랩이 만드는 세 가지 가치 */}
      <AxCoreValuesSection />

      {/* 4. AX 사업화 5단계 */}
      <AxMethodSection />

      {/* 5~8. 15개 업종 선택 → 5장 AX 변화 → 여기서 끝나지 않습니다 → 사업화 예시 2개 */}
      <AxIndustryShowcaseV2 />

      {/* 9. 프로그램 A·B·C (홈 유일 가격 노출) */}
      <section id="ax-packages" className="scroll-mt-16 border-t border-white/10 bg-slate-950 px-5 py-11 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="break-keep text-[1.6rem] font-black leading-tight text-white sm:text-[2.15rem]">
            어디까지 준비할지 <span className="text-teal-300">먼저 고르세요.</span>
          </h2>
          <p className="mt-3 max-w-2xl break-keep text-[1rem] leading-relaxed text-slate-300">
            방향만 확인할지, 벤처·연구소까지 함께 준비할지, 특허와 다음 자금 로드맵까지 갈지 선택할 수 있습니다.
          </p>
          <div className="mt-6">
            <AxPackageComparison />
          </div>
        </div>
      </section>

      {/* 10. 최대 2주 진행과정 */}
      <AxTimelineSection />

      {/* 11. 실제 제공 결과물 */}
      <AxDeliverablesSection />

      {/* 11. 진행형 사례 */}
      <section id="projects" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-12">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-300">진행 중인 프로젝트</p>
          <h2 className="mt-2 break-keep text-[1.5rem] font-black leading-snug tracking-tight text-white sm:text-[1.9rem]">
            지금 이렇게 바꾸고 있습니다.
          </h2>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <span className="inline-block rounded-md bg-teal-400/15 px-2 py-0.5 text-[0.82rem] font-black text-teal-200">{CASE_A.label}</span>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/10">
                <p className="text-[0.82rem] font-black uppercase tracking-wider text-slate-400">Before</p>
                <p className="mt-1.5 break-keep text-[0.98rem] leading-relaxed text-slate-300">{CASE_A.before}</p>
              </div>
              <div className="rounded-2xl bg-teal-400/[0.08] p-4 ring-1 ring-inset ring-teal-400/25">
                <p className="text-[0.82rem] font-black uppercase tracking-wider text-teal-300">After</p>
                <p className="mt-1.5 break-keep text-[0.98rem] font-bold leading-relaxed text-white">{CASE_A.after}</p>
              </div>
            </div>
            <p className="mt-3.5 break-keep text-[0.88rem] font-bold text-teal-200">현재 상태 · {CASE_A.status}</p>
            <p className="mt-1.5 break-keep text-[0.8rem] leading-relaxed text-slate-500">{CASE_A.notice}</p>
          </div>
        </div>
      </section>

      {/* 12. 김팀장 */}
      <section id="leader" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 컨설턴트 김팀장 프로필 사진" loading="lazy" decoding="async" width={200} height={200} className="h-16 w-16 shrink-0 rounded-full object-cover shadow ring-2 ring-amber-400/40 sm:h-20 sm:w-20" />
              <div className="min-w-0">
                <p className="text-[0.82rem] font-black uppercase tracking-widest text-blue-600">정책자금·AX 성장설계 총괄</p>
                <h3 className="mt-1 break-keep text-[1.2rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">대표 컨설턴트가 직접 듣고, 직접 설계하고, 끝까지 확인합니다.</h3>
              </div>
            </div>
            <p className="mt-5 break-keep text-[1rem] leading-relaxed text-slate-700">
              김팀장은 자금 가능성 검토에서 끝내지 않습니다. 어떤 업무를 AX로 바꿀지 직접 기획하고, 개발 담당자와 화면을 함께 설계합니다. 자금조달 이후에는 지원금·인증·복지제도까지 성장순서에 맞춰 연결합니다.
            </p>
            <p className="mt-2.5 break-keep text-[0.9rem] leading-relaxed text-slate-500">
              세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원. 누적 자금조달 지원 100억원+(지원금·세금 환급 포함).
            </p>
            <p className="mt-2.5 break-keep rounded-xl bg-slate-100 px-4 py-2.5 text-[0.85rem] leading-relaxed text-slate-600">
              세무·노무·법률 업무는 해당 자격을 보유한 외부 전문가가 직접 수행합니다.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              {AWARDS.map((a) => (
                <span key={a.title} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-600">
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.82rem] font-black text-amber-300">{a.year}</span>{a.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 13. 기업 생애주기 — 순서 미리보기 */}
      <section id="lifecycle" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>기업 생애주기 로드맵</p>
          <h2 className={h2Class}>자금조달이 끝이 아닙니다. 다음 순서까지 함께 설계합니다.</h2>
          <ol className="mt-6 flex flex-wrap gap-2">
            {LIFECYCLE.map((a, i) => (
              <li key={a.t} className="flex min-w-0 flex-1 basis-[calc(50%-0.25rem)] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:basis-[calc(33.333%-0.34rem)]">
                <span aria-hidden className="text-[1.1rem]">{a.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[0.78rem] font-black text-slate-400">STEP {i + 1}</span>
                  <span className="block break-keep text-[0.88rem] font-bold leading-tight text-slate-800">{a.t}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 break-keep text-[0.88rem] leading-relaxed text-slate-500">
            모든 서비스를 한꺼번에 권하지 않습니다. 지금 회사에 가장 필요한 순서부터 하나씩 설계합니다.
          </p>
          {/* 필요한 항목 바로가기(상세 모듈) */}
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {GROWTH_MODULES.map((m, i) => <ModuleGroupCard key={m.id} m={m} defaultOpen={i === 0} onNav={saveReturn} />)}
          </div>
          {GROWTH_MODULES.map((m) => <span key={m.id} id={m.id} aria-hidden className="block h-0 scroll-mt-24" />)}
        </div>
      </section>

      {/* 14. 월 최대 5개사 선별기준 */}
      <AxSelectionSection />

      {/* 15. FAQ */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-5 space-y-2.5">
            {[
              { q: '우리 회사는 AI 회사가 아닌데요?', a: 'AI를 파는 회사만 대상이 아닙니다. 지금 엑셀·카카오톡·수기로 하는 업무를 데이터로 바꾸는 것도 AX입니다. 지금 사업을 버리는 것이 아니라, 정책자금에서 평가받는 구조를 바꾸는 것입니다.' },
              { q: '개발을 전혀 몰라도 진행할 수 있나요?', a: '가능합니다. 대표님은 지금 업무가 어떻게 돌아가는지만 말씀해 주시면 됩니다. 기능명이나 개발용어는 저희가 정리합니다.' },
              { q: '시연형 MVP 이후 운영형 개발은 어떻게 되나요?', a: '세 프로그램은 AX 사업화·컨설팅·인증 준비 범위입니다. 로그인·데이터 저장·외부연동이 필요한 운영형 개발은 필요한 기능과 사용인원을 확인한 뒤 별도로 견적합니다. 처음부터 모든 기능을 만들지 않고 가장 중요한 기능부터 단계적으로 구현합니다.' },
              { q: '정책자금 승인이 보장되나요?', a: '보장되지 않습니다. 다만 사업계획을 실제 업무 흐름, 화면과 자금사용계획으로 구체화해 심사에서 설명할 근거를 보완합니다. 실제 승인 여부와 금액은 기관평가에 따라 달라집니다.' },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white open:bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[1rem] font-bold text-slate-900">
                  Q. {f.q}
                  <span aria-hidden className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="break-keep px-4 pb-4 text-[0.95rem] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 15. 최종 CTA */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="break-keep text-[1.5rem] font-black leading-tight tracking-tight text-white sm:text-[1.95rem]">
              이번에도 몇천만원에서 끝날지,<br /><span className="text-amber-300">1억원 이상을 설명할 구조</span>가 있는지 먼저 확인해보세요.
            </h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto">
                <span aria-hidden>🩺</span> 3분 기업진단 시작
              </Link>
              <button type="button" onClick={() => setConsultOpen(true)} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                상담 신청
              </button>
            </div>
            <p className="mt-5 break-keep text-[0.88rem] leading-relaxed text-slate-400">진단만으로 별도 비용이 발생하지 않습니다.</p>
            <p className="mt-1 break-keep text-[0.82rem] leading-relaxed text-slate-500">선별 진행 여부는 진단과 상담 후 안내합니다.</p>
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* Mobile sticky CTA — 기업진단(카톡은 KakaoFloat) */}
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
