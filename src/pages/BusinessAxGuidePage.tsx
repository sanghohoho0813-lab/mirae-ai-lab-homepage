import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ViewportPreview, { type PreviewDevice } from '../components/ViewportPreview'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxPortfolioSection from '../components/ax-showcase/AxPortfolioSection'
import SampleQuickNav from '../components/ax-showcase/SampleQuickNav'
import BusinessHeader from '../components/business/BusinessHeader'
import BusinessStickyCta from '../components/business/BusinessStickyCta'
import { AxStoryImages } from '../components/ax-showcase/axStoryHome'
import { AxJudgeVideo, AxPolicySources } from '../components/ax-showcase/AxStoryExtras'
import AxFaqSection from '../components/ax-showcase/AxFaqSection'
import AxPatentTechSection from '../components/ax-showcase/AxPatentTechSection'
import { AxRealProjectsDeep, AxScreenShowcase } from '../components/ax-showcase/axFinalHome'
import { axStoryV3Section as S } from '../data/axHomeStoryV3'
import { AX_GUIDE_PATH, BUSINESS_NAV } from '../lib/businessRoutes'
import { useHashScroll, useReturnScroll } from '../lib/businessPageScroll'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { canonicalUrl } from '../lib/site'

// AX 상세 안내 — 홈(스토리 01~03) 다음에 오는 페이지.
// 홈이 "그런데 AX가 정확히 뭘까요?" 로 끝나고, 여기 04(AX의 정의)부터 이어진다.
// 구성은 PDF "AX 상세페이지 카피 14섹션 최종 압축본" 그대로:
//   04 AX의 정의 / 05 왜 지금 AX (5.2 아래 정책자료 공식 출처) / 06 실제 자금조달 기업 리서치
//   07 Industry AX Preview 10 + "사업 초기라면 다릅니다" / 08 아이디어만 있으면? (8.3 아래 심사위원 영상)
//   → 아이디어 MVP 10 → REAL CLIENT AX 6 / 09 일반 개발회사와 무엇이 다른가 / 10 대표가 없어도 잘 돌아가는 회사
//   11 AX 하나만 보는 컨설팅이 아닙니다 / 12 처음에 뭘 해주는데요? / 13 FAQ(HTML) / 14 FINAL CTA

const PAGE_TITLE = 'AX 상세 안내 | 미래AI랩 — AX란 무엇이고, 무엇이 남는가'
const PAGE_DESC =
  'AX의 정의부터 정책기관이 보는 기준, 실제 자금조달 기업 리서치, 미래AI랩이 직접 만든 업종별 AX 화면과 진행 중인 프로젝트, 자주 묻는 질문까지 한곳에 정리했습니다.'

export default function BusinessAxGuidePage() {
  const [historyCount] = useState(() => loadHistory().length)
  const [atEnd, setAtEnd] = useState(false)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const location = useLocation()
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice | null>(null)
  const [sampleNavOpen, setSampleNavOpen] = useState(false)
  const isPreviewEmbedded = new URLSearchParams(location.search).has('preview')

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
      setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl(AX_GUIDE_PATH)),
    ]
    return () => restores.forEach((r) => r())
  }, [])

  useReturnScroll()
  useHashScroll()

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
      <BusinessHeader
        navLinks={BUSINESS_NAV}
        historyCount={historyCount}
        isPreviewEmbedded={isPreviewEmbedded}
        onOpenPreview={openPreview}
      />

      {/* 앞 이야기로 돌아가는 길 — 상세 안내로 바로 들어온 사람도 흐름을 알 수 있게 */}
      <div className="border-b border-white/10 bg-[#171B20]">
        <div className="mx-auto flex max-w-[1134px] items-center justify-between gap-3 px-5 py-3 sm:px-6 sm:py-4">
          <Link to="/business-services" className="inline-flex items-center gap-1.5 text-[0.98rem] font-bold text-slate-400 transition-colors hover:text-white sm:text-[1.05rem]">
            <span aria-hidden>←</span> 앞 이야기 보기
          </Link>
          <span className="text-[0.9rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.0rem]">AX 상세 안내</span>
        </div>
      </div>

      {/* 04 · 05 · 06 */}
      <AxStoryImages id="ax-definition" names={S(4)} eagerFirst />
      <AxStoryImages id="growth" names={S(5)} after={{ '5-2': <AxPolicySources /> }} />
      <AxStoryImages names={S(6)} />

      {/* 07 — 말로만 보면 잘 안 와닿으시죠? → Industry AX Preview 10개, 그다음 "사업 초기라면 다릅니다(MVP)" */}
      <AxScreenShowcase />
      <AxStoryImages names={S(7)} />

      {/* 08 — 8.3 심사위원 인터뷰 영상(출처 명시), 8.4 [10가지 샘플 보기] → 아이디어 MVP 10개, 그 바로 아래 REAL CLIENT AX 6개 */}
      <AxStoryImages names={S(8)} after={{ '8-3': <AxJudgeVideo /> }} />
      <AxPortfolioSection />
      <AxRealProjectsDeep />

      {/* 기술자산 — "이렇게 만든다"(실제 프로젝트) 다음, "일반 개발회사와 무엇이 다른가"(09) 직전.
          만든 구조를 회사의 기술로 남긴다는 연결고리 역할이다. */}
      <AxPatentTechSection />

      {/* 09 · 10 · 11 · 12 */}
      <AxStoryImages id="why-mirae" names={S(9)} />
      <AxStoryImages names={S(10)} />
      <AxStoryImages names={S(11)} />
      <AxStoryImages names={S(12)} />

      {/* 13 FAQ — 이미지가 아니라 HTML 텍스트 */}
      <AxFaqSection />

      {/* 14 FINAL — 우리 회사는 지금 무엇을 보여줘야 다음 단계로 갈 수 있을까요? */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-[#343B44] bg-[#171B20]">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="break-keep text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.1rem]">
              우리 회사는 지금 무엇을 보여줘야<br className="hidden sm:block" /> 다음 단계로 갈 수 있을까요?
            </h2>
            <p className="mx-auto mt-4 max-w-xl break-keep text-[1.18rem] leading-[1.7] text-slate-300 sm:text-[1.26rem]">
              무엇을 개발할지 미리 고르지 않으셔도 됩니다. 지금 회사의 사업, 고객, 업무, 데이터, 성장 계획을 보고 무엇부터 하는 게 가장 효과적인지 함께 판단해드립니다.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto">
                3분 기업 성장 · AX Fit 진단
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

      {!isPreviewEmbedded && <SampleQuickNav open={sampleNavOpen} onOpenChange={setSampleNavOpen} />}

      {/* 이 페이지는 히어로가 없어 처음부터 하단 바를 띄운다 */}
      <BusinessStickyCta visible={!atEnd} onOpenSampleNav={() => setSampleNavOpen(true)} />

      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="AX 상세 안내"
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
