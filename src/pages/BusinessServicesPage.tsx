import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxPortfolioSection from '../components/ax-showcase/AxPortfolioSection'
import { AxHeroV2 } from '../components/ax-showcase/axHomeSections'
import { AxDefinitionSection, AxWhyNowSection } from '../components/ax-showcase/axStoryHome'
import {
  AxCeoMomentSection,
  AxFaqTrioSection,
  AxGrowthFinalSection,
  AxOneStorySection,
  AxRealProjectsDeep,
  AxScreenShowcase,
} from '../components/ax-showcase/axFinalHome'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { FLAGSHIP } from '../data/corePrograms'
import { saveBusinessReturn, readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 미래AI랩 = 기업의 운영·고객·데이터를 AI로 연결하는 AX 회사.
// 정책자금·정부지원은 메인 상품이 아니라 AX 실행력을 성장으로 잇는 Growth Layer 로 배치한다.
//
// 홈 = 1분 설득. CHANGE → WHY NOW → PROOF → AX가 바꾸는 것 → AI·데이터 → GROWTH → CTA.
// 표면은 짧게, 아코디언은 깊게. 심리: 인지 → 호기심 → 정보습득 → 의심제거 → 망설임제거 → 상담.
// 홈 순서: ① Hero → ② Problem Hook("그래서 실제로 무엇이 있습니까?") → ③ 화면 먼저(드리프트+직접 눌러보기)
//          → ④ AX란(정의+인포그래픽+3칩) → ⑤ 대표의 장면 → ⑥ Early MVP
//          → ⑦ 실제 프로젝트(깊은 아코디언) → ⑧ 하나의 Growth Story → ⑨ Growth
//          → ⑩ FAQ 3개+결제 부담 → ⑪ 최종 CTA
// 깊은 설명(정의·프로세스·수행체계·개발방식)은 프로그램 상세페이지가 맡는다.
// 한 섹션 한 주장, 설명 대신 실제 화면과 구조가 말하게 한다.
// 가격 · 진행과정 · 업종별 15개 화면 · 비교표 · FAQ 는 정책자금 상세페이지에서 다룬다.
const DETAIL = '/business-services/funding-consulting'

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5 lg:gap-6">
          <Link to="/business-services" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[1.2rem] sm:text-[1.09rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              {/* 모바일에서는 세 줄이 되지 않도록 영문 사명을 접고 태그라인만 남긴다 */}
              <span className="whitespace-nowrap text-[1.1rem] sm:text-[1.0rem] font-medium text-slate-500">
                <span className="hidden min-[1360px]:inline">Mirae AI Lab · </span>
                <b className="font-bold text-slate-800">중소기업 AX · AI Growth</b>
              </span>
            </span>
          </Link>
          <nav className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-[1.17rem] sm:text-[1.02rem] font-medium text-slate-600 lg:flex">
            <a href="#portfolio" className="transition-colors hover:text-slate-900">AX 사례</a>
            <a href="#real-projects" className="transition-colors hover:text-slate-900">실제 프로젝트</a>
            <a href="#ax-definition" className="transition-colors hover:text-slate-900">AX란</a>
                        <a href="#growth" className="hidden transition-colors hover:text-slate-900 min-[1360px]:inline">Growth Layer</a>
            <Link to={DETAIL} onClick={() => saveReturn('nav')} className="transition-colors hover:text-slate-900">프로그램</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[1.1rem] sm:text-[1.0rem] font-bold text-cyan-800 transition-colors hover:bg-cyan-100 lg:inline-flex">
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            {cart.length > 0 && (
              <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
              </Link>
            )}
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-[1.2rem] sm:text-[1.09rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex">3분 AX 진단</Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {/* 1. Hero — 무엇을 파는 회사인지 5초 안에 */}
      <div ref={heroRef}>
        <AxHeroV2 />
      </div>

      {/* 2. WHY NOW — 가장 강한 질문 하나와 병목 구조 */}
      <AxWhyNowSection />

      {/* 3. 말 대신 화면 — 천천히 흐르는 실제 UI + 직접 눌러보기 */}
      <AxScreenShowcase />

      {/* 4. AX란 무엇인가 — 정의 + 사람/데이터 인포그래픽 + 결과 3칩 */}
      <AxDefinitionSection />

      {/* 5. 대표에게 꽂히는 장면 */}
      <AxCeoMomentSection />

      {/* 6. 초기 MVP 10종 — 반대 방향 핑퐁 드리프트 */}
      <AxPortfolioSection />

      {/* 7. 실제 기업 AX 프로젝트 — 짧은 카드 + 깊은 아코디언 */}
      <AxRealProjectsDeep />

      {/* 8. 왜 미래AI랩인가 — 분절이 아니라 하나의 Growth Story */}
      <AxOneStorySection />

      {/* 9. Growth — 만들어 놓고 끝낼 이유가 없습니다 */}
      <AxGrowthFinalSection onConsult={() => setConsultOpen(true)} />

      {/* 10. 의심·망설임 제거 — FAQ 3개 + 초기 부담 */}
      <AxFaqTrioSection />

      {/* 10. 최종 CTA — 우리 회사라면? */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="break-keep text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.1rem]">
              우리 회사라면,<br className="sm:hidden" /> 어디부터 바꾸면 될까요?
            </h2>
            <p className="mx-auto mt-4 max-w-xl break-keep text-[1.18rem] leading-[1.7] text-slate-300 sm:text-[1.26rem]">
              업종과 현재 업무방식만 알려주시면, 무엇을 AX로 바꿀 수 있고 고객 플랫폼까지 어디까지 연결할 수 있는지 먼저 봅니다.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto">
                3분 AX 가능성 진단
              </Link>
              <button type="button" onClick={() => setConsultOpen(true)} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                상담 신청
              </button>
            </div>
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* Mobile sticky CTA — 기업진단(카톡은 KakaoFloat) */}
      {!heroVisible && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <Link to="/business-diagnosis" className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[1.2rem] sm:text-[1.09rem] font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
            <span aria-hidden>🩺</span> 3분 AX 가능성 진단
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
