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
import { FLAGSHIP, BUILD_LEVELS, levelTotalLabel, PROGRAM_NOTICES, type BuildLevel } from '../data/corePrograms'
import { businessPackages, type ModuleGroup } from '../data/businessPackages'
import { saveBusinessReturn, readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 중소기업 대표용 메인 페이지 (모바일 우선). 대표상품 1개 + 공개 구현 1~4단계(+5단계 별도견적).
// 순서: Hero → AX SHOWCASE → 2026 AX → 대표 프로그램 → 1~4단계 → 진행방식 → 분리발주 비교 → 진행현황 → 성장모듈 → 대표자 → FAQ → CTA
// 가격은 corePrograms.ts(FLAGSHIP·BUILD_LEVELS) 단일 소스. 컨설팅비 100만은 개발비에서 차감하지 않음(VAT 별도).

const LEVELS_1_4 = BUILD_LEVELS.filter((l) => l.key !== '5')
const LEVEL_5 = BUILD_LEVELS.find((l) => l.key === '5')!

const OUTSOURCE = [
  '자금 컨설팅과 개발업체가 별도로 움직일 수 있음',
  '컨설팅 자료를 개발업체에 다시 전달',
  '개발범위에 따라 견적이 변동',
  '맞춤형 업무시스템은 기능과 연동 범위에 따라 수천만원 규모까지 확대될 수 있음',
  '개발 착수 전 계약금과 진행 중 중도금이 발생할 수 있음',
  '특허·인증을 다른 업체와 다시 협의할 수 있음',
]
const MIRAE = [
  '자금 컨설턴트와 개발 담당자가 처음부터 같은 프로젝트로 참여',
  '컨설팅비 100만원으로 시작',
  '자금전략과 AX 실행설계를 먼저 준비',
  '본개발비는 자금조달 후 정산',
  '구현 단계별 500·1,000·1,500만원 공개',
  '기본 포함과 제외범위를 사전에 확인',
  '서비스 구조와 특허출원을 함께 설계',
  '4단계 이후 필요한 기능만 별도로 고도화 가능',
]

const homeFaqs = [
  { q: '기업진단이 구현 1단계인가요?', a: '아니요. 기업·자금 진단은 모든 프로젝트의 선행 업무이며, 공개 구현 1단계는 AX 실행설계와 화면 초안입니다. 버튼을 눌러 시연하는 프로토타입은 2단계부터, 로그인·데이터 저장이 포함된 MVP는 3단계부터 제공됩니다.' },
  { q: '컨설팅비 100만원은 개발비에서 차감되나요?', a: '차감되지 않습니다. 컨설팅비는 기업분석·자금전략·AX 실행설계에 대한 별도 용역비입니다. 개발비는 컨설팅비 100만원과 별도로 산정되며 모든 가격은 VAT 별도입니다.' },
  { q: '어느 단계까지 만들어야 하나요?', a: '미래AI랩은 4단계(업무사용형 AX MVP)를 기본 프로그램의 최종 목표로 권장합니다. 다만 기업 상황에 따라 2단계 또는 3단계로도 충분할 수 있으며, 복수 업무와 실제 운영 준비가 중요한 기업에는 4단계를 권장합니다.' },
  { q: '구현 수준이 높으면 자금이 승인되나요?', a: '구현 수준이 높을수록 설명 가능한 업무 흐름과 실행근거는 많아집니다. 다만 자금조달 결과는 기업의 재무상태·신용·업력·대표자 역량과 기관 심사에 따라 달라지며 보장되지 않습니다.' },
  { q: '구축된 시스템은 어디에 저장되고 운영되나요?', a: '프로젝트 규모에 따라 Vercel, Supabase 또는 동급의 관리형 클라우드 서비스를 활용하며, 화면·로그인·데이터베이스·파일저장을 고객 프로젝트 단위로 구성합니다. 운영용 도메인, 클라우드 사용료, 유료 API와 문자·메일 사용료는 별도로 안내합니다.' },
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
const h2Class = 'mt-2 text-[1.7rem] font-black tracking-tight text-slate-900 sm:text-[2rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 구현 단계 카드(선택된 단계 상세)
function LevelDetail({ l }: { l: BuildLevel }) {
  return (
    <div className={`rounded-2xl border-2 bg-white p-5 sm:p-6 ${l.recommended ? 'border-slate-800 shadow-xl shadow-slate-900/10' : 'border-slate-200 shadow-sm'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[1.15rem] font-black tracking-tight text-slate-900">{l.name}</p>
        {l.recommended && <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[0.72rem] font-black text-teal-300">미래AI랩 권장 최종 목표</span>}
      </div>
      <p className="mt-2 text-[1.05rem] font-black text-blue-700">{l.priceLabel}</p>
      <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-500">{l.short}</p>
      <p className="mt-2.5 rounded-lg bg-blue-50 px-3 py-2 text-[0.86rem] font-bold leading-snug text-blue-800">“{l.customer}”</p>
      <p className="mt-3 text-[0.7rem] font-black uppercase tracking-wide text-slate-400">포함</p>
      <ul className="mt-1.5 space-y-1">
        {l.included.map((it) => <li key={it} className="flex items-start gap-2 text-[0.86rem] leading-snug text-slate-700"><span aria-hidden className="mt-0.5 shrink-0 font-black text-blue-500">✓</span>{it}</li>)}
      </ul>
      {l.excluded.length > 0 && <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[0.8rem] leading-snug text-slate-500"><b className="text-slate-600">기본 제외</b> — {l.excluded.join(' · ')}</p>}
      {l.note && <p className="mt-2.5 text-[0.8rem] leading-relaxed text-slate-500">{l.note}</p>}
    </div>
  )
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
  const [levelKey, setLevelKey] = useState('4')
  const [showLevel5, setShowLevel5] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const location = useLocation()
  const navType = useNavigationType()
  const level = LEVELS_1_4.find((l) => l.key === levelKey) ?? LEVELS_1_4[0]

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩'
  }, [])

  // 뒤로가기 복원 vs 신규/해시 진입 구분.
  // - 해시가 있으면 해시 우선(아래 효과에서 처리)
  // - 뒤로가기(POP)로 복귀 + 저장된 위치가 이 페이지면 레이아웃 안정화 후 스크롤 복원
  useEffect(() => {
    if (location.hash) return
    if (navType !== 'POP') return
    const saved = readBusinessReturn()
    if (!saved || saved.path !== location.pathname) return
    let raf1 = 0, raf2 = 0
    const t = window.setTimeout(() => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          // 저장된 정확한 스크롤 위치로 복원(레이아웃 안정화 후). 페이지 구조는 결정적이라 픽셀 복원이 가장 정확.
          window.scrollTo({ top: Math.max(0, saved.scrollY), behavior: 'instant' })
          clearBusinessReturn()
        })
      })
    }, 180)
    return () => { window.clearTimeout(t); cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // #hash 딥링크 → 해당 섹션으로 스크롤(명시적 hash 있을 때만). 이미지 로드 후에도 정확히 안착.
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
            <button type="button" onClick={() => scrollToId('why-ax')} className="transition-colors hover:text-slate-900">2026 AX 변화</button>
            <button type="button" onClick={() => scrollToId('program')} className="transition-colors hover:text-slate-900">프로그램</button>
            <button type="button" onClick={() => scrollToId('build-levels')} className="transition-colors hover:text-slate-900" title="1단계 설계부터 4단계 업무사용형 MVP까지">구현 수준</button>
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행 방식</button>
            <button type="button" onClick={() => scrollToId('growth-modules')} className="transition-colors hover:text-slate-900">성장 모듈</button>
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

      {/* S1. Hero */}
      <div ref={heroRef}>
        <AxHero onShowcase={() => scrollToId('ax-showcase')} onProgram={() => scrollToId('program')} />
      </div>

      {/* S2. AX SHOWCASE */}
      <AxIndustryShowcase />

      {/* S3. 2026 정책자금 × AX */}
      <AxPolicyShift />

      {/* S4. 하나의 대표 프로그램 (#program) */}
      <section id="program" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <span id="programs" aria-hidden className="block h-0 scroll-mt-24" />
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
          <p className={eyebrow}>하나의 대표 프로그램</p>
          <h2 className={h2Class}>{FLAGSHIP.name}</h2>
          <p className="mt-2.5 max-w-2xl text-[1.02rem] leading-relaxed text-slate-600">{FLAGSHIP.tagline}</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-[0.8rem] font-bold text-slate-400">메인 가격</p>
              <p className="mt-0.5 text-[1.7rem] font-black tracking-tight text-blue-700 sm:text-[2rem]">{FLAGSHIP.priceMain}</p>
              <p className="mt-1.5 text-[0.92rem] font-bold text-slate-600">{FLAGSHIP.priceSub}</p>
              <p className="mt-4 border-l-2 border-teal-500 pl-3.5 text-[0.95rem] font-black leading-snug text-slate-900">{FLAGSHIP.collabLine}</p>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-slate-500">자금전략과 개발을 서로 다른 업체에 전달하지 않아, 사업 구조와 실제 구현 사이의 차이를 줄입니다. 기업진단부터 자금전략, AX 화면설계와 본개발까지 하나의 흐름으로 진행합니다.</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/business-services/funding-consulting" className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-[0.95rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700">전체 비용·단계 자세히 보기</Link>
                <button type="button" onClick={openProgram} className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-[0.95rem] font-black text-slate-700 transition-colors hover:bg-slate-50">상담 신청</button>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900 p-6 text-white sm:p-7">
              <p className="text-[0.82rem] font-black uppercase tracking-widest text-teal-300">비용 구조 한눈에</p>
              <dl className="mt-3 space-y-2">
                {[
                  ['컨설팅비', '100만원 · AX 실행설계와 화면 초안 포함'],
                  ['2단계 개발비', '500만원 · 시연형 프로토타입'],
                  ['3단계 개발비', '1,000만원 · 로그인·DB 핵심기능 MVP'],
                  ['4단계 개발비', '1,500만원 · 업무사용형 MVP (권장 목표)'],
                  ['5단계 이후', '별도 문의 · 상용화·고도화'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
                    <dt className="shrink-0 text-[0.86rem] font-bold text-slate-400">{k}</dt>
                    <dd className="text-right text-[0.88rem] font-bold text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-slate-400">{PROGRAM_NOTICES.consultingFee} {PROGRAM_NOTICES.vat}</p>
              <button type="button" onClick={() => scrollToId('build-levels')} className="mt-3 inline-flex items-center gap-1 text-[0.88rem] font-bold text-teal-200 underline underline-offset-4 hover:text-teal-100">구현 단계별 자세히 보기 <span aria-hidden>↓</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* S5. 1~4단계 구현수준 (#build-levels) */}
      <section id="build-levels" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
          <p className={eyebrow}>공개 구현 수준</p>
          <h2 className={h2Class}>1단계 설계부터 4단계 업무사용형 MVP까지</h2>
          <p className="mt-2.5 max-w-2xl text-[0.98rem] leading-relaxed text-slate-500">아래 단계는 기능 범위를 이해하기 쉽도록 구분한 미래AI랩 자체 구현 수준 기준입니다. 기업진단과 자금검토는 모든 프로젝트의 선행 업무로 진행됩니다.</p>

          {/* 단계 탭 */}
          <div role="tablist" aria-label="구현 단계" className="mt-5 grid grid-cols-4 gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 sm:max-w-2xl">
            {LEVELS_1_4.map((l) => {
              const on = l.key === levelKey
              return (
                <button key={l.key} type="button" role="tab" aria-selected={on} onClick={() => setLevelKey(l.key)}
                  className={`relative rounded-xl px-2 py-2.5 text-center text-[0.82rem] font-black leading-tight transition ${on ? (l.recommended ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white') : 'text-slate-500 hover:bg-slate-50'}`}>
                  {l.key}단계
                  {l.recommended && <span className="mt-0.5 block text-[0.62rem] font-bold text-teal-300">권장</span>}
                </button>
              )
            })}
          </div>

          <div className="mt-4"><LevelDetail l={level} /></div>

          {/* 단계별 가격·총액 표 */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-slate-100 px-3 py-2 text-[0.74rem] font-black text-slate-500 sm:px-4">
              <span>단계</span><span className="text-right">개발비</span><span className="text-right">총액 (VAT 별도)</span>
            </div>
            {LEVELS_1_4.map((l) => (
              <div key={l.key} className={`grid grid-cols-[1.3fr_1fr_1fr] items-center px-3 py-2.5 text-[0.82rem] sm:px-4 ${l.recommended ? 'bg-slate-50' : ''}`}>
                <span className="font-bold text-slate-700">{l.key}단계 {l.recommended && <span className="ml-1 rounded bg-slate-900 px-1.5 py-0.5 text-[0.62rem] font-black text-teal-300">권장</span>}</span>
                <span className="text-right font-bold text-slate-600">{l.devFee == null ? '컨설팅 포함' : `${(l.devFee / 10_000).toLocaleString('ko-KR')}만원`}</span>
                <span className="text-right font-black text-blue-700">{levelTotalLabel(l).replace(' (VAT 별도)', '')}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-slate-500">{PROGRAM_NOTICES.devSeparate} {PROGRAM_NOTICES.vat}</p>

          {/* 5단계 이후 별도 문의 */}
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-300 bg-white">
            <button type="button" onClick={() => setShowLevel5((v) => !v)} aria-expanded={showLevel5} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
              <span>
                <span className="block text-[0.98rem] font-black text-slate-900">{LEVEL_5.name}</span>
                <span className="mt-0.5 block text-[0.82rem] text-slate-500">{LEVEL_5.priceLabel} · {LEVEL_5.short}</span>
              </span>
              <span aria-hidden className={`shrink-0 text-slate-400 transition-transform ${showLevel5 ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {showLevel5 && (
              <div className="border-t border-slate-100 px-4 py-3">
                <p className="text-[0.7rem] font-black uppercase tracking-wide text-slate-400">대상 기능(별도 견적)</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {LEVEL_5.included.flatMap((it) => it.split(' · ')).map((it) => <span key={it} className="rounded-md bg-slate-100 px-2 py-0.5 text-[0.76rem] font-semibold text-slate-600">{it}</span>)}
                </div>
                <p className="mt-2.5 text-[0.82rem] leading-relaxed text-slate-500">{LEVEL_5.note} 외부 전문업체 협업이 필요한 기능은 범위와 비용을 별도로 안내합니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* S6. 진행 방식 (#process) */}
      <AxProcessSection />

      {/* S7. 분리발주 비교 */}
      <section id="compare" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
          <p className={eyebrow}>비교</p>
          <h2 className={h2Class}>자금컨설팅과 개발을 따로 맡길 때와 무엇이 다른가요?</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-[0.82rem] font-black text-slate-500">일반적인 분리발주 방식</p>
              <ul className="mt-3 space-y-1.5">
                {OUTSOURCE.map((it) => <li key={it} className="flex items-start gap-2 text-[0.9rem] leading-snug text-slate-500"><span aria-hidden className="mt-0.5 text-slate-300">○</span>{it}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-blue-500 bg-blue-50/40 p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.82rem] font-black text-blue-700">미래AI랩 런칭 프로그램</p>
                <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[0.7rem] font-black text-white">초기 레퍼런스 런칭 가격</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {MIRAE.map((it) => <li key={it} className="flex items-start gap-2 text-[0.9rem] font-semibold leading-snug text-slate-700"><span aria-hidden className="mt-0.5 text-blue-500">✓</span>{it}</li>)}
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-slate-900 px-5 py-4 text-[0.95rem] font-bold leading-relaxed text-white">
            개발비가 무조건 저렴하다고 말하지 않습니다. 자금전략과 구현범위를 먼저 정해 불필요한 기능과 초기 부담을 줄이고, 자금조달과 개발을 연결해 별도 업체 사이의 기획 전달과 재설계 단계를 줄입니다.
          </p>
          <p className="mt-2.5 text-[0.82rem] leading-relaxed text-slate-500">구현단계의 기본범위를 초과하는 기능과 외부연동은 별도 견적입니다.</p>
        </div>
      </section>

      {/* S8. 현재 진행현황 (#status) */}
      <section id="status" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-9">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-teal-300">현재 진행현황</p>
              <h2 className="mt-2 text-[1.5rem] font-black leading-snug tracking-tight text-white sm:text-[1.8rem]">초기 레퍼런스 프로젝트를 진행하고 있습니다.</h2>
              <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-300">자금전략, 업종별 AX 실행설계와 기관 설명자료를 함께 준비하고 있습니다.</p>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-400">현재 진행 단계의 프로젝트이며 자금승인 완료 사례를 의미하지 않습니다. 확정된 결과는 실제 증빙을 확보한 순서대로 공개합니다.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.82rem] font-bold text-slate-400">2026년 7월 24일 기준</p>
              <p className="mt-1 flex items-baseline gap-1.5 text-white"><span className="text-[2.4rem] font-black leading-none tracking-tight text-teal-300">3</span><span className="text-[1.1rem] font-bold text-slate-400">개 기업 진행 중</span></p>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-500">초기 레퍼런스 프로젝트 진행 중</p>
            </div>
          </div>
        </div>
      </section>

      {/* S9. 성장 모듈 (#growth-modules) */}
      <section id="growth-modules" className="scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-10">
          <p className="text-[0.8rem] font-semibold text-slate-400">프로그램은 자금조달과 AX의 진행 방식이고, 성장 모듈은 기업진단 결과에 따라 연결하는 실행 항목입니다.</p>
          <h2 className="mt-1.5 text-[1.4rem] font-black tracking-tight text-slate-900 sm:text-[1.6rem]">필요한 인증과 지원제도는 성장 순서에 맞게 연결합니다.</h2>
          <p className="mt-1.5 max-w-2xl text-[0.94rem] leading-relaxed text-slate-500">모든 기업에 모든 인증이 필요한 것은 아닙니다. 자금 목적, 기술성, 고용계획과 성장단계를 확인한 뒤 필요한 항목만 연결합니다.</p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {GROWTH_MODULES.map((m, i) => <ModuleGroupCard key={m.id} m={m} defaultOpen={i === 0} onNav={saveReturn} />)}
          </div>
          {GROWTH_MODULES.map((m) => <span key={m.id} id={m.id} aria-hidden className="block h-0 scroll-mt-24" />)}
          <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[0.78rem] leading-relaxed text-slate-400">일부 업무는 세무사·노무사·변호사·변리사 등 외부 전문가 검토 또는 연계가 필요할 수 있습니다.</p>
            <Link to="/business-diagnosis" className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-[0.9rem] font-black text-white transition-transform hover:-translate-y-0.5">
              기업진단으로 필요한 항목 확인하기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* S10. 대표자 메시지 */}
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
              <p>그래서 이제는 자금을 신청하는 것에서 멈추지 않고, 실제 업무 흐름과 화면, 필요한 경우 작동형 MVP까지 함께 만듭니다. 자금 컨설턴트와 개발 담당자가 처음부터 같은 프로젝트로 참여합니다.</p>
              <p className="font-bold text-slate-900">처음부터 완벽하다고 말하지 않겠습니다. 현재 실제 기업들과 결과를 만들고 있으며, 확인된 성과를 하나씩 투명하게 공개하겠습니다.</p>
            </div>
            <Link to="/business-diagnosis" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-[0.92rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700">
              우리 회사 방향 진단하기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* S11. FAQ (#faq) */}
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

      {/* S12. 최종 CTA (#cta) */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-6 sm:py-16">
            <h2 className="text-[1.7rem] font-black leading-tight tracking-tight text-white sm:text-[2.1rem]">우리 회사에 필요한 자금과<br className="sm:hidden" /> 운영 시스템을 한 번에 점검해보세요.</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto">
                <span aria-hidden>🩺</span> 3분 기업진단 시작
              </Link>
              <button type="button" onClick={() => scrollToId('program')} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                프로그램과 가격 보기
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
