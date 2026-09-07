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
import { AxStoryImages } from '../components/ax-showcase/axStoryHome'
import {
  AxRealProjectsDeep,
  AxScreenShowcase,
} from '../components/ax-showcase/axFinalHome'
import { axStoryV2Section as S } from '../data/axHomeStoryV2'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'
import { canonicalUrl } from '../lib/site'

// 미래AI랩 = 중소기업 맞춤형 실행 AX 설계·구축 전문회사 (경영컨설턴트 출신 AX Architect).
// 정책·정부지원·자금조달은 AX 의 주목적이 아니라, 실제 AX 성과와 기업자산이 이후 성장 과정에서
// 활용될 수 있는 2차 가치로만 말한다(Growth Layer). "자금조달을 위해 AX 를 만든다"는 인상을 주지 않는다.
//
// 홈 = 히어로 이후 인포그래픽 스토리 + Industry AX Preview + 실제 현장 프로젝트 + CTA.
// Preview(AxScreenShowcase, AxPortfolioSection)와 실제 현장 프로젝트(AxRealProjectsDeep)는 기존 섹션을 보존한다.
// 한 섹션 한 주장, 설명 대신 실제 화면과 구조가 말하게 한다. 가격표는 두지 않는다.

const PAGE_TITLE = '미래AI랩 | 경영컨설턴트가 설계하는 중소기업 맞춤형 AX'
const PAGE_DESC =
  '사업과 실제 업무를 먼저 분석하고, ERP·엑셀·카톡 사이에 남아 있는 회사 고유의 업무를 AI와 전용 시스템으로 연결합니다. 운영효율·매출성장·기업자산화를 만드는 중소기업 맞춤형 AX 설계·구축.'

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
  // 하단 고정 바의 '실제 AX 보기' 가 같은 패널을 열 수 있도록 상태를 여기서 관리한다
  const [sampleNavOpen, setSampleNavOpen] = useState(false)
  const isPreviewEmbedded = new URLSearchParams(location.search).has('preview')

  // 브라우저 타이틀 / SEO — 자금조달이 아니라 "중소기업 맞춤형 AX" 가 메인으로 읽히게 한다
  useEffect(() => {
    document.title = PAGE_TITLE
    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      const prev = el.content
      el.content = content
      return () => { el!.content = prev }
    }
    const restores = [
      setMeta('meta[name="description"]', 'name', 'description', PAGE_DESC),
      setMeta('meta[property="og:title"]', 'property', 'og:title', PAGE_TITLE),
      setMeta('meta[property="og:description"]', 'property', 'og:description', PAGE_DESC),
      setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl('/business-services')),
    ]
    return () => restores.forEach((r) => r())
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
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-5 lg:gap-6">
          {/* 태그라인은 그대로 두되, 모바일에서 글자·자간을 줄여 햄버거·미리보기 버튼과 겹치지 않게 한다 */}
          {/* 아주 좁은 화면(320~360px)에서는 남은 폭만큼만 차지하고 태그라인이 …로 줄어든다 */}
          <BrandLogo
            to="/business-services"
            className="min-w-0 max-w-[calc(100vw-148px)] shrink-0 sm:max-w-none"
            imgClassName="h-9 max-w-[132px] sm:h-11 sm:max-w-[196px] lg:h-12 lg:max-w-[224px]"
            taglineClassName="text-[0.5rem]! tracking-[0.13em]! sm:text-[0.7rem]! sm:tracking-[0.16em]!"
          />
          {/* 헤더 폭이 빠듯해 xl 이상에서 핵심 3개만 보인다. Growth Layer·프로그램(개정 중)은 햄버거 메뉴에 있다. */}
          <nav className="hidden shrink-0 items-center gap-4 whitespace-nowrap text-[1.02rem] font-medium text-slate-600 xl:flex">
            <a href="#portfolio" className="transition-colors hover:text-slate-900">AX Preview</a>
            <a href="#real-projects" className="transition-colors hover:text-slate-900">실제 프로젝트</a>
            <a href="#ax-definition" className="transition-colors hover:text-slate-900">AX란</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-[#F3D9C8] bg-[#F3D9C8]/55 px-3 py-1.5 text-[1.0rem] font-bold text-[#171B20] transition-colors hover:bg-[#F3D9C8] xl:inline-flex">
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            {cart.length > 0 && (
              <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
              </Link>
            )}
            {/* 헤더는 폭이 빠듯해 Primary 라벨을 줄여 쓴다(1280px 에서 우측 그룹이 밀려 가로 스크롤이 생겼던 것 방지) */}
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-[#D47A4A] px-4 py-2 text-[1.2rem] sm:text-[1.05rem] font-semibold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] sm:inline-flex">AX 가능성 진단</Link>
            {/* 화면 미리보기 — 떠다니지 않고 헤더 안, 햄버거 옆에 둔다 */}
            {!isPreviewEmbedded && (
              <button
                type="button"
                onClick={openPreview}
                aria-label="PC·스마트폰 화면 미리보기"
                title="PC ↔ 스마트폰 화면 미리보기"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#D47A4A]/40 text-[#171B20] transition-colors hover:bg-[#F3D9C8]/50 xl:h-auto xl:w-auto xl:px-2.5 xl:py-1.5 xl:text-[0.88rem] xl:font-bold"
              >
                {/* xl 미만은 아이콘만 — 모바일은 로고 태그라인 자리를, PC 는 헤더 폭을 아낀다 */}
                <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] xl:hidden" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="1.5" y="4" width="13" height="9.5" rx="1.4" />
                  <path d="M5 17h6" />
                  <rect x="16.5" y="9" width="6" height="11" rx="1.4" />
                </svg>
                <span className="hidden xl:inline">PC ↔ 스마트폰</span>
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

      {/* ── 스토리 v2 (Drive 1-1 … 13-5 순서, 여백·장식 사진은 잘라낸 버전) ─────────────
          섹션 01 사업계획서만으로는 / 02 이런 상황은 아니신가요 / 03 차이는 문서 밖 + 업종 예시
          04 AX의 정의 / 05 왜 지금 AX / 06 실제 자금조달 기업 리서치 / 07 직접 만들어서 보여드립니다
          08 아이디어만 있으면? MVP / 09 일반 개발회사와 무엇이 다른가 / 10 혼자 다 하는 회사?
          11 AX 범위(고객접점) / 12 대표가 없어도 돌아가는 회사 / 13 AX 도입 후 4가지 변화
          인터랙티브 섹션은 이미지에 표시된 자리(7-2, 8-5) 바로 다음에 둔다. */}
      <AxStoryImages names={S(1)} />
      <AxStoryImages names={S(2)} />
      <AxStoryImages names={S(3)} />
      <AxStoryImages id="ax-definition" names={S(4)} />
      <AxStoryImages names={S(5)} />
      <AxStoryImages id="growth" names={S(6)} />

      {/* 07 — 7-2 "Industry AX Preview 안내" 바로 다음에 Preview 10개 (업종별 고객 플랫폼 5개 섹션은 11번 스토리와 겹쳐 제거) */}
      <AxStoryImages names={S(7, 1, 2)} />
      <AxScreenShowcase />
      <AxStoryImages names={S(7, 3)} />

      {/* 08 — 8-5 "직접 만든 10가지 샘플 보기" 바로 다음에 아이디어 MVP 10개, 그 바로 아래 REAL CLIENT AX 6개 (기존 섹션 보존) */}
      <AxStoryImages names={S(8)} />
      <AxPortfolioSection />
      <AxRealProjectsDeep />

      {/* 09 · 10 · 11 · 12 · 13 — 12-2 는 Drive 폴더에 없어 건너뜀 */}
      <AxStoryImages id="why-mirae" names={S(9)} />
      <AxStoryImages names={S(10)} />
      <AxStoryImages names={S(11)} />
      <AxStoryImages names={S(12)} />
      <AxStoryImages names={S(13)} />

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
                우리 회사 AX 가능성 진단
              </Link>
              <a href="#portfolio" className="flex w-full max-w-xs items-center justify-center rounded-xl border border-[#D47A4A]/35 bg-[#343B44]/45 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-[#343B44] sm:w-auto">
                실제 AX 구축 화면 보기
              </a>
            </div>
            <button type="button" onClick={() => setConsultOpen(true)} className="mt-4 text-[1.05rem] font-semibold text-slate-400 underline underline-offset-4 transition-colors hover:text-white">
              상담 신청
            </button>
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* 스크롤 중 어디서나 AX Preview 로 — 평소엔 비켜서 있는 작은 손잡이 */}
      {!isPreviewEmbedded && <SampleQuickNav open={sampleNavOpen} onOpenChange={setSampleNavOpen} />}

      {/* Mobile sticky CTA — Primary(진단) 60% · Secondary(실제 AX 보기) 40% (카톡은 KakaoFloat) */}
      {!heroVisible && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          {/* 모양은 같고 색과 크기만 다르게. basis 0 + min-w-0 이 있어야 글자 길이가 아니라 비율이 폭을 정한다. */}
          <Link
            to="/business-diagnosis"
            className="flex min-w-0 flex-[6_1_0%] items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-[#D47A4A] px-1.5 py-3 text-[0.84rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] min-[360px]:px-2 min-[360px]:text-[0.92rem] min-[400px]:text-[1.0rem]"
          >
            <span className="hidden min-[400px]:inline">우리 회사&nbsp;</span>
            <span>AX 가능성 진단</span>
          </Link>
          <button
            type="button"
            onClick={() => setSampleNavOpen(true)}
            className="flex min-w-0 flex-[4_1_0%] items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-[#171B20] px-1.5 py-3 text-[0.84rem] font-bold text-white shadow-sm transition-colors hover:bg-[#343B44] min-[360px]:px-2 min-[360px]:text-[0.92rem] min-[400px]:text-[1.0rem]"
          >
            <span aria-hidden className="hidden min-[370px]:inline text-[#E8B89A]">▦</span>
            <span>실제 AX 보기</span>
          </button>
        </div>
      )}

      {/* 브랜드 정비(0차): 정책자금 프로그램 위저드·상품 목록 대신 단순 상담 폼으로 연다 */}
      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="중소기업 맞춤형 AX 홈"
        heading="상담 신청"
        showContactMethod
        showCompanyFields
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
