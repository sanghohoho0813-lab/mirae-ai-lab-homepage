import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ViewportPreview, { type PreviewDevice } from '../components/ViewportPreview'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import SampleQuickNav from '../components/ax-showcase/SampleQuickNav'
import BusinessHeader from '../components/business/BusinessHeader'
import BusinessStickyCta from '../components/business/BusinessStickyCta'
import { AxHeroV2 } from '../components/ax-showcase/axHomeSections'
import { AxStoryImages } from '../components/ax-showcase/axStoryHome'
import { axStoryV3Section as S } from '../data/axHomeStoryV3'
import { AX_GUIDE_PATH, BUSINESS_NAV } from '../lib/businessRoutes'
import { useHashScroll, useReturnScroll } from '../lib/businessPageScroll'
import { useScrollReveal } from '../lib/useScrollReveal'
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
  const rootRef = useRef<HTMLDivElement>(null)
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
  useScrollReveal(rootRef)

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
    <div ref={rootRef} className="min-h-screen bg-[#171B20] pb-16 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
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
          {/* 설명 문구 없이 버튼 두 개만 — 03 이 이미 "그런데 AX가 정확히 뭘까요?" 로 끝난다 */}
          <div data-reveal className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-6 sm:py-16">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* 스크롤 중 어디서나 AX Preview 로 — 평소엔 비켜서 있는 작은 손잡이 */}
      {!isPreviewEmbedded && <SampleQuickNav open={sampleNavOpen} onOpenChange={setSampleNavOpen} />}

      <BusinessStickyCta visible={!heroVisible && !atEnd} onOpenSampleNav={() => setSampleNavOpen(true)} />

      {/* 홈에는 상담 폼을 여는 곳이 없다(이어보기는 버튼 두 개만). 상담은 카톡 버튼과 상세 안내의 CTA 에서 연다. */}
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
