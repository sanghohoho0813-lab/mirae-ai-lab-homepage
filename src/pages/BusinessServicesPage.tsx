import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ViewportPreview, { type PreviewDevice } from '../components/ViewportPreview'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import SampleQuickNav from '../components/ax-showcase/SampleQuickNav'
import BusinessHeader from '../components/business/BusinessHeader'
import BusinessStickyCta from '../components/business/BusinessStickyCta'
import { AxHeroV2 } from '../components/ax-showcase/axHomeSections'
import { AxStoryImages } from '../components/ax-showcase/axStoryHome'
import { axStoryV3Section as S } from '../data/axHomeStoryV3'
import { AX_GUIDE_PATH, BUSINESS_NAV } from '../lib/businessRoutes'
import { useHashScroll, useReturnScroll } from '../lib/businessPageScroll'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { canonicalUrl } from '../lib/site'

// 미래AI랩 = 중소기업 맞춤형 실행 AX 설계·구축 전문회사 (경영컨설턴트 출신 AX Architect).
// 정책·정부지원·자금조달은 AX 의 주목적이 아니라, 실제 AX 성과와 기업자산이 이후 성장 과정에서
// 활용될 수 있는 2차 가치로만 말한다(Growth Layer).
//
// 홈은 스토리 01~03 까지만 — "글이 너무 많다"는 피드백에 따라 04(AX의 정의)부터는
// AX 상세 안내(/business-services/ax)로 넘긴다. 03 이 "그런데 AX가 정확히 뭘까요?"로 끝나므로
// 그 질문을 그대로 받아 상세 안내로 넘어가게 한다.

const PAGE_TITLE = '미래AI랩 | 경영컨설턴트가 설계하는 중소기업 맞춤형 AX'
const PAGE_DESC =
  '사업과 실제 업무를 먼저 분석하고, ERP·엑셀·카톡 사이에 남아 있는 회사 고유의 업무를 AI와 전용 시스템으로 연결합니다. 운영효율·매출성장·기업자산화를 만드는 중소기업 맞춤형 AX 설계·구축.'

export default function BusinessServicesPage() {
  const [historyCount] = useState(() => loadHistory().length)
  const [heroVisible, setHeroVisible] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const bridgeRef = useRef<HTMLDivElement>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const location = useLocation()
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

  useReturnScroll()
  useHashScroll()

  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setHeroVisible(entries[0]?.isIntersecting ?? false), { rootMargin: '-40px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = bridgeRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const openPreview = () => setPreviewDevice(window.innerWidth < 768 ? 'desktop' : 'mobile')

  return (
    <div className="min-h-screen bg-[#171B20] pb-16 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      <BusinessHeader
        navLinks={BUSINESS_NAV}
        historyCount={historyCount}
        isPreviewEmbedded={isPreviewEmbedded}
        onOpenPreview={openPreview}
      />

      {/* 1. Hero — 무엇을 파는 회사인지 5초 안에 */}
      <div ref={heroRef}>
        <AxHeroV2 />
      </div>

      {/* ── 스토리 01~03 (Drive 1.1 … 3.7) ───────────────────────────────────────
          01 계획보다 강한 증거 / 02 이런 상황이신가요
          03 사업계획서의 시대가 달라졌습니다 + 업종 예시(그려진 버튼 → 실제 샘플 AX 화면)
          03 이 "그런데 AX가 정확히 뭘까요?" 로 끝나고, 그 답부터는 상세 안내로 넘어간다. */}
      <AxStoryImages names={S(1)} />
      <AxStoryImages names={S(2)} />
      <AxStoryImages names={S(3)} />

      {/* 이어보기 — 03 의 마지막 질문을 그대로 받는다 */}
      <div ref={bridgeRef}>
        <section id="cta" className="border-t border-[#343B44] bg-[#171B20]">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <p className="text-[1.05rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.15rem]">AX 상세 안내</p>
            <h2 className="mt-3 break-keep text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.1rem]">
              그런데 AX가 정확히 뭘까요?<br className="hidden sm:block" /> 이어서 보실 수 있습니다.
            </h2>
            <p className="mx-auto mt-4 max-w-xl break-keep text-[1.18rem] leading-[1.7] text-slate-300 sm:text-[1.26rem]">
              AX의 정의와 왜 지금인지, 실제로 자금을 조달한 기업 리서치, 미래AI랩이 직접 만든 화면과 진행 중인 프로젝트, 자주 묻는 질문까지 한곳에 정리했습니다.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={AX_GUIDE_PATH}
                className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto"
              >
                AX 상세 안내 보기 <span aria-hidden>→</span>
              </Link>
              <Link
                to="/business-diagnosis"
                className="flex w-full max-w-xs items-center justify-center rounded-xl border border-[#D47A4A]/35 bg-[#343B44]/45 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-[#343B44] sm:w-auto"
              >
                3분 AX Fit 진단
              </Link>
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

      <BusinessStickyCta visible={!heroVisible && !atEnd} onOpenSampleNav={() => setSampleNavOpen(true)} />

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
