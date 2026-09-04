import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import BrandLogo from '../components/BrandLogo'
import ViewportPreview, { type PreviewDevice } from '../components/ViewportPreview'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxPortfolioSection from '../components/ax-showcase/AxPortfolioSection'
import SampleQuickNav from '../components/ax-showcase/SampleQuickNav'
import { AxHeroV2 } from '../components/ax-showcase/axHomeSections'
import {
  AxCeoBusySection,
  AxCustomerPlatformSection,
  AxDefinitionSection,
  AxDeviceOperationSection,
  AxEffectSection,
  AxErpComparisonSection,
  AxIndustryQuestionSection,
  AxInfoFlowSection,
  AxNotAlwaysNeededSection,
  AxTogetherScopeSection,
  AxWhyMiraeSection,
  AxWhyNowOutroSection,
  AxWhyNowSection,
} from '../components/ax-showcase/axStoryHome'
import {
  AxRealProjectsDeep,
  AxScreenShowcase,
} from '../components/ax-showcase/axFinalHome'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { FLAGSHIP } from '../data/corePrograms'
import { readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 미래AI랩 = 기업의 운영·고객·데이터를 AI로 연결하는 AX 회사.
// 정책자금·정부지원은 메인 상품이 아니라 AX 실행력을 성장으로 잇는 Growth Layer 로 배치한다.
//
// 홈 = 히어로 이후 ②~⑭ 인포그래픽 스토리 + 샘플 20개 + 실제 현장 프로젝트 + CTA.
// 샘플 20개(AxScreenShowcase, AxPortfolioSection)와 실제 현장 프로젝트(AxRealProjectsDeep)는 기존 섹션을 보존한다.
// 깊은 설명(정의·프로세스·수행체계·개발방식)은 프로그램 상세페이지가 맡는다.
// 한 섹션 한 주장, 설명 대신 실제 화면과 구조가 말하게 한다.
// 가격 · 진행과정 · 업종별 15개 화면 · 비교표 · FAQ 는 정책자금 상세페이지에서 다룬다.
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
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice | null>(null)
  const isPreviewEmbedded = new URLSearchParams(location.search).has('preview')

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

  const openPreview = () => setPreviewDevice(window.innerWidth < 768 ? 'desktop' : 'mobile')

  return (
    <div className="min-h-screen bg-[#171B20] pb-16 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header — 핵심 메뉴만 */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-5 lg:gap-6">
          {/* 태그라인은 그대로 두되, 모바일에서 글자·자간을 줄여 햄버거·미리보기 버튼과 겹치지 않게 한다 */}
          {/* 아주 좁은 화면(320~360px)에서는 남은 폭만큼만 차지하고 태그라인이 …로 줄어든다 */}
          <BrandLogo
            to="/business-services"
            className="min-w-0 max-w-[calc(100vw-148px)] shrink-0 sm:max-w-none"
            imgClassName="h-9 max-w-[132px] sm:h-11 sm:max-w-[196px] lg:h-12 lg:max-w-[224px]"
            taglineClassName="text-[0.5rem]! tracking-[0.13em]! sm:text-[0.7rem]! sm:tracking-[0.16em]!"
          />
          <nav className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-[1.17rem] sm:text-[1.02rem] font-medium text-slate-600 lg:flex">
            <a href="#portfolio" className="transition-colors hover:text-slate-900">AX 사례</a>
            <a href="#real-projects" className="transition-colors hover:text-slate-900">실제 프로젝트</a>
            <a href="#ax-definition" className="transition-colors hover:text-slate-900">AX란</a>
                        <a href="#growth" className="hidden transition-colors hover:text-slate-900 min-[1360px]:inline">Growth Layer</a>
            {/* 프로그램 상세페이지 전면 개정 중 — 이동을 막는다 */}
            <span className="inline-flex cursor-not-allowed items-center gap-1.5 text-slate-400" aria-disabled="true">
              프로그램
              <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[0.72em] font-black leading-none text-slate-500">업데이트 중</span>
            </span>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-[#F3D9C8] bg-[#F3D9C8]/55 px-3 py-1.5 text-[1.1rem] sm:text-[1.0rem] font-bold text-[#171B20] transition-colors hover:bg-[#F3D9C8] lg:inline-flex">
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            {cart.length > 0 && (
              <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
              </Link>
            )}
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-[#D47A4A] px-4 py-2 text-[1.2rem] sm:text-[1.09rem] font-semibold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] sm:inline-flex">3분 AX 진단</Link>
            {/* 화면 미리보기 — 떠다니지 않고 헤더 안, 햄버거 옆에 둔다 */}
            {!isPreviewEmbedded && (
              <button
                type="button"
                onClick={openPreview}
                aria-label="PC·스마트폰 화면 미리보기"
                title="PC ↔ 스마트폰 화면 미리보기"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#D47A4A]/40 text-[#171B20] transition-colors hover:bg-[#F3D9C8]/50 sm:h-auto sm:w-auto sm:px-2.5 sm:py-1.5 sm:text-[0.88rem] sm:font-bold"
              >
                {/* 모바일은 아이콘만 — 로고 태그라인이 들어갈 자리를 비워준다 */}
                <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="1.5" y="4" width="13" height="9.5" rx="1.4" />
                  <path d="M5 17h6" />
                  <rect x="16.5" y="9" width="6" height="11" rx="1.4" />
                </svg>
                <span className="hidden sm:inline">PC ↔ 스마트폰</span>
              </button>
            )}
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {/* 1. Hero — 무엇을 파는 회사인지 5초 안에 */}
      <div ref={heroRef}>
        <AxHeroV2 />
      </div>

      {/* 2. 첫 번째 문제제기 — "무엇이 있어야 할까요?" 까지 */}
      <AxWhyNowSection />

      {/* 3. AX가 뭐냐면요 — 무엇이 필요한지 물은 직후에 용어를 풀어준다 */}
      <AxDefinitionSection />

      {/* 4. 그래서 2026년, 흐름도 바뀌고 있습니다 */}
      <AxWhyNowOutroSection />

      {/* 샘플 10개 — 기존 섹션 보존 */}
      <AxScreenShowcase />

      {/* 4. 한 번 생긴 정보가 다음 업무로 이어진다 — 샘플을 본 직후에 놓아야 설득이 된다 */}
      <AxInfoFlowSection />

      {/* 5. ERP와 AX */}
      <AxErpComparisonSection />

      {/* 6. PC와 휴대폰 운영 */}
      <AxDeviceOperationSection />

      {/* 7. AX 도입 효과 */}
      <AxEffectSection />

      {/* 8. 고객 플랫폼과 매출 */}
      <AxCustomerPlatformSection />

      {/* 9. 대표가 더 바빠지는 회사 */}
      <AxCeoBusySection />

      {/* 10. 꼭 AX일 필요는 없음 */}
      <AxNotAlwaysNeededSection />

      {/* 샘플 10개 — 기존 섹션 보존 */}
      <AxPortfolioSection />

      {/* REAL · FIELD PROJECTS — 기존 섹션 보존 */}
      <AxRealProjectsDeep />

      {/* 12. 왜 미래AI랩인가 */}
      <AxWhyMiraeSection />

      {/* 13. 필요하면 여기까지 */}
      <div id="growth" className="scroll-mt-16">
        <AxTogetherScopeSection />
      </div>

      {/* 14. 우리 업종에도? */}
      <AxIndustryQuestionSection />

      {/* 최종 CTA — 우리 회사라면? */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-[#343B44] bg-[#171B20]">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="break-keep text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.1rem]">
              우리 회사라면,<br className="sm:hidden" /> 어디부터 바꾸면 될까요?
            </h2>
            <p className="mx-auto mt-4 max-w-xl break-keep text-[1.18rem] leading-[1.7] text-slate-300 sm:text-[1.26rem]">
              업종과 현재 업무방식만 알려주시면, 무엇을 AX로 바꿀 수 있고 고객 플랫폼까지 어디까지 연결할 수 있는지 먼저 봅니다.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto">
                3분 AX 가능성 진단
              </Link>
              <button type="button" onClick={() => setConsultOpen(true)} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-[#D47A4A]/35 bg-[#343B44]/45 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-[#343B44] sm:w-auto">
                상담 신청
              </button>
            </div>
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* 스크롤 중 어디서나 샘플 20개로 — 평소엔 비켜서 있는 작은 손잡이 */}
      {!isPreviewEmbedded && <SampleQuickNav />}

      {/* Mobile sticky CTA — 기업진단(카톡은 KakaoFloat) */}
      {!heroVisible && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <Link to="/business-diagnosis" className="flex items-center justify-center gap-1.5 rounded-xl bg-[#D47A4A] px-4 py-3 text-[1.2rem] sm:text-[1.09rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A]">
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

      {previewDevice && !isPreviewEmbedded && (
        <ViewportPreview
          device={previewDevice}
          onClose={() => setPreviewDevice(null)}
          onDeviceChange={setPreviewDevice}
          path={location.pathname}
          hash={location.hash}
        />
      )}
    </div>
  )
}
