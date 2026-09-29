import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ViewportPreview, { type PreviewDevice } from '../components/ViewportPreview'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import SampleQuickNav from '../components/ax-showcase/SampleQuickNav'
import BusinessHeader from '../components/business/BusinessHeader'
import BusinessStickyCta from '../components/business/BusinessStickyCta'
import { AxHeroV2, AxSamplesBand } from '../components/ax-showcase/axHomeSections'
import AxFilms from '../components/ax-showcase/AxFilms'
import AxFaqSection from '../components/ax-showcase/AxFaqSection'
import { AxStoryImages } from '../components/ax-showcase/axStoryHome'
import { axStoryV3Section as S } from '../data/axHomeStoryV3'
import { AX_GUIDE_PATH, AX_START_PATH, BUSINESS_NAV } from '../lib/businessRoutes'
import { useHashScroll, useReturnScroll } from '../lib/businessPageScroll'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { rememberInterest, withInterest } from '../lib/interestTrack'
import { canonicalUrl } from '../lib/site'

// AX 진입 페이지 (/business-services/ax-start) — 예전 /business-services 홈을 그대로 옮겨 보존한 화면.
// /business-services 는 이제 AX 도입 / 기술사업·MVP 를 고르는 2-Track 선택 페이지이고,
// 거기서 "AX 도입 알아보기" 를 고르면 여기로 온다.
//
// 지금 구성(기술사업·MVP 페이지처럼 간결하게): 히어로 → 소개 영상 2편 → 직접 만든 화면 22개 → FAQ → 마무리.
// 스토리 01~03 · 이어보기('AX 상세 안내 보기')와 AX 상세 안내(스토리 04~12)는 지우지 않고 잠시 숨겼다
// (SHOW_STORY 아래 · businessRoutes 의 SHOW_AX_GUIDE). 아래 설명은 숨기기 전 구성에 대한 것이다.
//
// 미래AI랩 = 중소기업 맞춤형 실행 AX 설계·구축 전문회사 (경영컨설턴트 출신 AX Architect).
// 정책·정부지원·자금조달은 AX 의 주목적이 아니라, 실제 AX 성과와 기업자산이 이후 성장 과정에서
// 활용될 수 있는 2차 가치로만 말한다(Growth Layer).
//
// 스토리 01~03 까지만 — "글이 너무 많다"는 피드백에 따라 04(AX의 정의)부터는
// AX 상세 안내(/business-services/ax)로 넘긴다. 03 이 "그런데 AX가 정확히 뭘까요?"로 끝나므로
// 그 질문을 그대로 받아 상세 안내로 넘어가게 한다.

const PAGE_TITLE = '미래AI랩 | 경영컨설턴트가 설계하는 50인 미만 중소기업 맞춤형 AX'
const PAGE_DESC =
  '사업과 실제 업무를 먼저 분석하고, ERP·엑셀·카톡 사이에 남아 있는 회사 고유의 업무를 AI와 전용 시스템으로 연결합니다. 운영효율·매출성장·기업자산화를 만드는 50인 미만 중소기업 맞춤형 AX 설계·구축.'

// 이 트랙에서 진단으로 갈 때는 ?interest=ax 를 붙여 유입을 구분한다
const AX_DIAG_HREF = withInterest('/business-diagnosis', 'ax')
// 스토리 01~03 + 이어보기('AX 상세 안내 보기') — 소개 영상 2편이 대신 설명하므로 잠시 숨김. 다시 보이려면 true
const SHOW_STORY = false

export default function AxStartPage() {
  const [historyCount] = useState(() => loadHistory().length)
  const [atEnd, setAtEnd] = useState(false)
  const bridgeRef = useRef<HTMLDivElement>(null)
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
      setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl(AX_START_PATH)),
    ]
    return () => restores.forEach((r) => r())
  }, [])

  useReturnScroll()
  useHashScroll()

  // 이 화면에 들어왔다는 것 자체가 "AX 트랙" 선택 — 주소 없이 헤더 CTA 로 진단에 가도 트랙이 남는다
  useEffect(() => {
    rememberInterest('ax')
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
        diagnosisHref={AX_DIAG_HREF}
      />

      {/* 1. Hero — 무엇을 파는 회사인지 5초 안에 */}
      <AxHeroV2 />

      {/* 2. 소개 영상 2편 — 1편 AX가 뭐고 왜 필요한가 / 2편 어떻게 진행하고 얼마가 드나 */}
      <AxFilms samplesAnchor="samples" diagnosisHref={AX_DIAG_HREF} />

      {/* 3. 직접 만든 화면 22개(업종별 AX와 고객 플랫폼 12 + 아이디어 MVP 10) */}
      <AxSamplesBand />

      {/* 4. FAQ */}
      <AxFaqSection />

      {/* 5. 마무리 — 버튼 두 개만 */}
      <div ref={bridgeRef}>
        <section id="cta" className="border-t border-[#343B44] bg-[#171B20]">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="break-keep text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.1rem]">
              다음 단계로 가려면,<br className="hidden sm:block" /> 지금 무엇을 보여줘야 할까요?
            </h2>
            <p className="mx-auto mt-4 max-w-xl break-keep text-[1.18rem] leading-[1.7] text-slate-300 sm:text-[1.26rem]">
              무엇을 만들지 미리 정하지 않으셔도 돼요. 지금 사업과 고객, 일하는 방식을 보고 무엇부터 할지 같이 정해요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={AX_DIAG_HREF} className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto">
                3분 AX Fit 진단 받기
              </Link>
              <a href="#samples" className="flex w-full max-w-xs items-center justify-center rounded-xl border border-[#D47A4A]/35 bg-[#343B44]/45 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-[#343B44] sm:w-auto">
                AX 화면 직접 보기
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ── 잠시 숨김: 스토리 01~03 (Drive 1.1 … 3.7) + 이어보기 ─────────────────────
          01 계획보다 강한 증거 / 02 이런 상황이신가요
          03 사업계획서의 시대가 달라졌습니다 + 업종 예시(그려진 버튼 → 실제 샘플 AX 화면)
          03 이 "그런데 AX가 정확히 뭘까요?" 로 끝나고, 그 답부터는 상세 안내로 넘어간다. */}
      {SHOW_STORY && (
        <>
          <AxStoryImages names={S(1)} />
          <AxStoryImages names={S(2)} />
          <AxStoryImages names={S(3)} />

          {/* 이어보기 — 03 의 마지막 질문을 그대로 받는다 */}
          <div>
            <section className="border-t border-[#343B44] bg-[#171B20]">
              {/* 설명 문구 없이 버튼 두 개만 — 03 이 이미 "그런데 AX가 정확히 뭘까요?" 로 끝난다 */}
              <div className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-6 sm:py-16">
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to={AX_GUIDE_PATH}
                    className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto"
                  >
                    AX 상세 안내 보기 <span aria-hidden>→</span>
                  </Link>
                  <Link
                    to={AX_DIAG_HREF}
                    className="flex w-full max-w-xs items-center justify-center rounded-xl border border-[#D47A4A]/35 bg-[#343B44]/45 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-[#343B44] sm:w-auto"
                  >
                    3분 AX Fit 진단 받기
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      <LegalFooter />
      <KakaoFloat />

      {/* 스크롤 중 어디서나 AX Preview 로 — 평소엔 비켜서 있는 작은 손잡이 */}
      {!isPreviewEmbedded && <SampleQuickNav open={sampleNavOpen} onOpenChange={setSampleNavOpen} />}

      {/* 히어로에는 버튼이 없어(문장만) 폰 첫 화면에 행동할 곳이 없었다 — 상세 안내처럼 처음부터 하단 바를 띄운다.
          히어로 아래 여백(pb-24)이 바 높이만큼 확보돼 문장이 가려지지 않는다. */}
      <BusinessStickyCta visible={!atEnd} onOpenSampleNav={() => setSampleNavOpen(true)} diagnosisHref={AX_DIAG_HREF} />

      {/* 이 페이지에는 상담 폼을 여는 곳이 없다(마무리는 버튼 두 개만). 상담은 카톡 버튼과 진단 결과에서 연다. */}
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
