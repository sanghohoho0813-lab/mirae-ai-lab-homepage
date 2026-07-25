import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxHero from '../components/ax/AxHero'
import AxFourSteps from '../components/ax/AxFourSteps'
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

// 미래AI랩 = 정책자금 전문회사. AX는 자금을 받을 이유를 보여주는 실행수단.
// 스토리: Hero → 공감 → 사업계획서만으로 부족한 이유 → 정부 정책방향 → AX 4단계 → AX 화면 →
//          최대 2주 과정 → 결과물 → 프로그램·비용(1회) → 진행형 사례 → 김팀장 → 생애주기 → FAQ → CTA
const DETAIL = '/business-services/funding-consulting'

// 고객 공감 — 소액만 받거나 거절당한 기업의 현실
const EMPATHY = [
  '이미 대출이 있어 추가 한도가 막히셨나요?',
  '업력이 짧아 볼 수 있는 실적이 부족하신가요?',
  '신설법인이라 과거 자료로 설명하기 어려우신가요?',
  '우리 회사의 차별성을 서류로 설명하기 어려우신가요?',
  '매번 소액만 받아 급한 운영비만 막고 제자리로 돌아오지는 않으셨나요?',
]

// 메시지 통일 — 사업계획서는 필요하지만, 그것만으로는 부족하다.
const PLAN_LINES = [
  '사업계획서 작성에서 끝나지 않습니다.',
  '사업계획과 실제 실행구조를 함께 만듭니다.',
  '문서와 화면이 같은 방향을 말하도록 연결합니다.',
  '정책자금 전략, 사업계획과 AX 프로그램을 하나의 프로젝트로 진행합니다.',
]

// 최종 제공 결과물 5종
const DELIVERABLES = [
  { t: '자금조달 전략', d: '어떤 기관에 어떤 순서로 신청할지 정리합니다.' },
  { t: '사업계획과 자금사용계획', d: '받은 자금을 어디에 쓰고 무엇이 좋아지는지 설명합니다.' },
  { t: 'AX 업무 흐름', d: '지금 방식이 어떻게 바뀌는지 흐름으로 정리합니다.' },
  { t: 'MVP 또는 선택 단계 프로그램', d: '실제로 열어서 보여줄 수 있는 화면을 드립니다.' },
  { t: '이후 성장 로드맵', d: '자금조달 다음에 무엇을 할지 순서를 정합니다.' },
]
// 결과물 대표 이미지 — 실제로 일치하는 화면만 사용
const DELIVERABLE_SHOTS = [
  { img: '/ax-showcase/equipment-platform/photo-84-equiplink-flow.webp', cap: 'AX 업무 흐름 정리 예시' },
  { img: '/ax-showcase-v2/photo-110-fieldcare-showcase.webp', cap: '실제로 보여줄 수 있는 프로그램 화면 예시' },
]

// 구현 수준 — 가격이 아니라 "어디까지 만드는지"
const LEVELS = [
  { no: '1', name: 'AX 실행 설계', msg: '아이디어를 화면구조로 바꿉니다.' },
  { no: '2', name: '시연형 프로토타입', msg: '심사자가 클릭하며 흐름을 확인합니다.' },
  { no: '3', name: '핵심기능 MVP', msg: '로그인·데이터 저장이 실제로 작동합니다.' },
  { no: '4', name: '업무사용형 MVP', msg: '직원이 실제 업무에 사용합니다.', rec: true },
]

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
  const navigate = useNavigate()

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
  const goDetail = (hash = '') => { saveReturn('detail'); navigate(DETAIL + hash) }

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
            <button type="button" onClick={() => scrollToId('ax-showcase')} className="transition-colors hover:text-slate-900">AX 화면</button>
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

      {/* 1. Hero */}
      <div ref={heroRef}>
        <AxHero onShowcase={() => scrollToId('ax-showcase')} onProcess={() => scrollToId('process')} />
      </div>

      {/* 2. 고객의 현실 */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>혹시 이런 상황이신가요?</p>
          <h2 className={h2Class}>다른 곳에서 컨설팅을 받았는데도, 결국 몇천만원에서 끝나셨나요?</h2>
          <p className="mt-3 max-w-2xl break-keep text-[1rem] leading-relaxed text-slate-600">
            첫 거래에 대출이 적고 매출·신용이 충분한 기업은 대표님이 직접 신청해도 자금이 나옵니다. <b className="text-slate-900">문제는 그렇지 않은 기업입니다.</b>
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {EMPATHY.map((q) => (
              <li key={q} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[0.95rem] leading-snug text-slate-700">
                <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">·</span>{q}
              </li>
            ))}
          </ul>
          <div className="mt-5 break-keep border-l-2 border-blue-500 pl-4">
            <p className="text-[1.02rem] font-bold leading-relaxed text-slate-900">사업이 부족해서가 아닐 수 있습니다.</p>
            <p className="mt-1 text-[1rem] leading-relaxed text-slate-600">
              심사자가 <span className="font-bold text-blue-700">더 큰 자금을 지원해야 할 이유</span>를 충분히 확인하지 못했을 수 있습니다.
            </p>
            <p className="mt-2 text-[1rem] font-bold leading-relaxed text-slate-900">그렇다고 방법이 없는 것은 아닙니다.</p>
          </div>
        </div>
      </section>

      {/* 3. 사업계획서만으로 부족한 이유 */}
      <section id="plan" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>지금 심사에서 벌어지는 일</p>
          <h2 className={h2Class}>사업계획서는 필요합니다.<br className="sm:hidden" /> 하지만 사업계획서만으로는 부족합니다.</h2>
          <p className="mt-3 max-w-2xl break-keep text-[1rem] leading-relaxed text-slate-600">
            이제는 AI로 누구나 그럴듯한 사업계획서를 만들 수 있습니다. 그래서 심사자는 문장이 아니라 <b className="text-slate-900">실행 가능성, 실제 구조, 경쟁력</b>을 확인합니다.
          </p>
          <ul className="mt-5 space-y-2">
            {PLAN_LINES.map((l) => (
              <li key={l} className="flex items-start gap-2.5 rounded-xl bg-white px-4 py-3 text-[0.98rem] font-bold leading-snug text-slate-800 ring-1 ring-inset ring-slate-200">
                <span aria-hidden className="mt-0.5 shrink-0 text-blue-500">✓</span>{l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. 정부 정책방향과 AX */}
      <AxPolicyShift onDetail={() => goDetail()} />

      {/* 5. AX 혁신전환 4단계 */}
      <AxFourSteps />

      {/* 6. 업종별 AX 화면 */}
      <AxIndustryShowcase />

      {/* 7. 최대 2주 진행과정 */}
      <AxProcessSection onResult={() => scrollToId('deliverables')} />

      {/* 8. 최종 결과물 */}
      <section id="deliverables" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>받는 결과물</p>
          <h2 className={h2Class}>사업계획서뿐 아니라, 실제로 보여주고 사용할 AX 프로그램을 갖게 됩니다.</h2>
          <ol className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {DELIVERABLES.map((d, i) => (
              <li key={d.t} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-900 text-[0.8rem] font-black text-amber-300">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[1rem] font-black leading-snug text-slate-900">{d.t}</p>
                  <p className="mt-0.5 break-keep text-[0.9rem] leading-snug text-slate-500">{d.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            {DELIVERABLE_SHOTS.map((s) => (
              <figure key={s.img} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
                <img src={s.img} alt={s.cap} loading="lazy" decoding="async" className="h-[128px] w-full object-cover sm:h-[190px]" />
                <figcaption className="break-keep bg-white px-3 py-2.5 text-[0.8rem] font-semibold leading-snug text-slate-500 sm:px-4 sm:text-[0.85rem]">{s.cap}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={() => goDetail()} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-6 text-[0.92rem] font-black text-white transition-transform hover:-translate-y-0.5">
              결과물과 진행방식 자세히 보기 <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. 프로그램 · 비용(홈 유일 노출) */}
      <section id="program" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>프로그램</p>
          <h2 className={h2Class}>큰 자금을 받으려면, 그만한 이유부터 보여줘야 합니다.</h2>
          <p className="mt-3 max-w-2xl break-keep text-[1.02rem] font-bold leading-relaxed text-slate-800">{FUNDING_HOME.main}</p>
          <ul className="mt-3 space-y-1">
            {FUNDING_HOME.notes.map((n) => <li key={n} className="break-keep text-[0.82rem] leading-relaxed text-slate-500">· {n}</li>)}
          </ul>

          <div className="mt-6 rounded-3xl border-2 border-blue-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[1.15rem] font-black tracking-tight text-slate-900">{FLAGSHIP.name}</p>
            <p className="mt-1 break-keep text-[0.95rem] leading-relaxed text-slate-600">정책자금 전략, 사업계획과 AX 프로그램을 하나의 프로젝트로 진행합니다.</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[0.82rem] font-bold text-slate-400">시작 비용</p>
                <p className="mt-0.5 text-[0.98rem] font-black text-slate-900">AX 혁신전환 컨설팅 100만원</p>
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-inset ring-amber-200">
                <p className="text-[0.82rem] font-bold text-amber-700">본개발비 · 후불</p>
                <p className="mt-0.5 text-[0.98rem] font-black text-amber-800">정책자금 조달 이후 정산</p>
              </div>
            </div>
            <p className="mt-3.5 break-keep rounded-xl bg-slate-900 px-4 py-3 text-[0.92rem] font-bold leading-relaxed text-white">
              개발회사처럼 먼저 큰 개발비를 받지 않습니다. 자금이 실행되지 않으면 선택하지 않은 <span className="text-amber-300">본개발비는 발생하지 않습니다.</span>
            </p>

            {/* 구현 수준 — 어디까지 만들지 */}
            <div id="build-levels" className="mt-5 scroll-mt-20">
              <p className="text-[0.82rem] font-black text-slate-400">어디까지 만들지 골라서 진행합니다</p>
              <ul className="mt-2 space-y-1.5">
                {LEVELS.map((l) => (
                  <li key={l.no} className={`flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[0.92rem] leading-snug ${l.rec ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[0.82rem] font-black ${l.rec ? 'bg-amber-400 text-slate-900' : 'bg-white text-slate-500 ring-1 ring-inset ring-slate-200'}`}>{l.no}</span>
                    <span className="min-w-0">
                      <b className={l.rec ? 'text-white' : 'text-slate-900'}>{l.name}</b> · {l.msg}
                      {l.rec && <span className="ml-1.5 rounded-full bg-amber-400 px-2 py-0.5 text-[0.82rem] font-black text-slate-900">권장</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link to={DETAIL} onClick={() => saveReturn('program')} className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-[0.95rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700">
                단계·비용 자세히 보기
              </Link>
              <button type="button" onClick={() => goDetail('#compare')} className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-[0.95rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
                일반 개발회사와 비교하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. 진행형 사례 */}
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

      {/* 11. 김팀장 */}
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

      {/* 12. 기업 생애주기 — 순서 미리보기 */}
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

      {/* 13. FAQ */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-5 space-y-2.5">
            {[
              { q: '우리 회사는 AI 회사가 아닌데요?', a: 'AI를 파는 회사만 대상이 아닙니다. 지금 엑셀·카카오톡·수기로 하는 업무를 데이터로 바꾸는 것도 AX입니다. 업종을 바꾸는 것이 아니라 일하는 방식을 바꾸는 것입니다.' },
              { q: '개발을 전혀 몰라도 진행할 수 있나요?', a: '가능합니다. 대표님은 지금 업무가 어떻게 돌아가는지만 말씀해 주시면 됩니다. 기능명이나 개발용어는 저희가 정리합니다.' },
              { q: '큰 개발비는 언제 내나요?', a: 'AX 혁신전환 컨설팅비 100만원으로 시작합니다. 큰 개발비는 정책자금이 조달된 이후에 정산하고, 자금이 실행되지 않으면 선택하지 않은 개발비는 발생하지 않습니다.' },
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

      {/* 14. 최종 CTA */}
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
