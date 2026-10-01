// 기술사업 · MVP · 벤처기업확인 패키지 (/business-services/venture-mvp).
// 순서: 글자 히어로(VentureMvpHero) → 소개 영상(VentureMvpFilm, '꼭 봐 주세요') → '예를 들면'(자체 데모 10개 + AX 12개 더 보기)
//   → 자주 묻는 질문(AX 페이지와 같은 모양, 이 상품에 맞춘 질문) → 마지막 CTA('우리 회사도 가능할까요?'). 영상이 '샘플 22개, 직접 눌러서 확인해 보세요' 로 끝나서 바로 예시로 이어진다.
//   히어로의 '영상으로 모든 내용 확인하기' 를 누르면 영상이 소리를 켜고 처음부터 재생된다.
// Drive 상세페이지 이미지 02~15 는 대표님 요청으로 잠시 숨겨 두었다(SHOW_STORY_IMAGES). 나중에 FAQ 로 마무리할 예정.
//  - 02→15 순서 고정, 원본 비율 그대로(width:100%; height:auto), 이미지 사이 여백 없음
//  - 이미지는 모두 lazy(첫 화면은 글자라 가장 먼저 그려진다). width/height 로 자리를 미리 잡아 CLS 를 막는다
//  - 이미지 안에 그려진 버튼(04·09·15)은 그림일 뿐이라, 그 자리에 투명한 실제 링크(hotspot)를 얹고
//    실제 CTA 는 하단(+모바일 하단 고정)에 따로 둔다
//  - ⚠️ 이 페이지는 3분 AX Fit 진단으로 보내지 않는다. 상세페이지를 끝까지 읽은 사람에게
//    다시 AX 적합도 진단을 시키지 않고, 기존 상담카드(ConsultModal)를 바로 열어 회사 정보를 받는다.
//    (Full AX 트랙은 기존대로 진단 → 결과 → 상담 퍼널을 그대로 쓴다.)
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import ConsultModal from '../components/ConsultModal'
import VentureMvpHero from '../components/venture/VentureMvpHero'
import VentureMvpExamples, { VENTURE_MVP_EXAMPLES_ID } from '../components/venture/VentureMvpExamples'
import VentureMvpFilm, { type VentureMvpFilmHandle } from '../components/venture/VentureMvpFilm'
import SampleQuickNav from '../components/ax-showcase/SampleQuickNav'
import DetailMobileBar from '../components/business/DetailMobileBar'
import FaqSection from '../components/ax-showcase/AxFaqSection'
import { VENTURE_MVP_FAQ } from '../data/ventureMvpFaq'
import { VENTURE_MVP_DIR, VENTURE_MVP_HOTSPOTS, VENTURE_MVP_IMAGES, type VentureMvpHotspot } from '../data/ventureMvpImages'
import { BUSINESS_CHOOSER_PATH, SAMPLES_PATH, VENTURE_MVP_PATH } from '../lib/businessRoutes'
import { SAMPLE_TOTAL } from '../data/portfolioSamples'
import { rememberInterest } from '../lib/interestTrack'
import { usePageMeta } from '../lib/pageMeta'
import { useHashScroll } from '../lib/businessPageScroll'

const PAGE_TITLE = '기술사업 · MVP · 벤처기업확인 | 미래AI랩'
const PAGE_DESC =
  '아이디어는 작동하는 웹앱 서비스로 만들어드리고, 회사는 벤처기업으로 만들어드려요. 경영컨설턴트가 기술사업 아이디어부터 MVP, 벤처기업확인 신청까지 2주 안에 함께합니다. 런칭 파트너 300만원 · 선착순 5개사.'

/** 상담 리드의 신청 경로 — consult_leads.source 와 알림 메일 제목에 그대로 들어간다 */
const CONSULT_SOURCE = '기술사업·MVP 상세페이지 (venture-mvp)'
/** 상담카드에 이미 선택된 상태로 표시할 메인 신청 서비스 — 추가 관심 항목과 섞이지 않는다 */
const PRESET_SERVICE = '기술사업 · MVP · 벤처기업확인 패키지'
// 샘플(업종별 AX + 아이디어 MVP)은 상품 페이지가 아닌 '샘플 모아보기' 페이지로 보낸다 — AX 상품 페이지로 넘어가지 않게
const SAMPLES_HREF = SAMPLES_PATH
// 09 "벤처기업확인 혜택 보기" — 벤처인증 패키지(혁신성장형) 상세에 제도 혜택이 정리돼 있다
const VENTURE_BENEFIT_HREF = '/business-services/venture-innovation'
const HOTSPOT_CLS =
  'absolute block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B89A]'
const hotspotStyle = (h: VentureMvpHotspot) => ({ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` })
// 01 은 글자 히어로(VentureMvpHero)가 대신한다 — 02 부터 붙인다
const STORY_IMAGES = VENTURE_MVP_IMAGES.filter((img) => img.n !== '01')
// 상세 이미지 02~15 — 대표님 요청(영상·예시로 충분, 길면 좋을 게 없다)으로 잠시 숨김. 다시 보이려면 true
const SHOW_STORY_IMAGES = false

export default function VentureMvpPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESC, VENTURE_MVP_PATH)
  const [atEnd, setAtEnd] = useState(false)
  const [consultOpen, setConsultOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const filmRef = useRef<VentureMvpFilmHandle>(null)

  // 메뉴·다른 페이지에서 구간 주소(#film · #mvp-refs · #faq)로 들어오면 그 구간으로
  useHashScroll()

  useEffect(() => {
    rememberInterest('venture-mvp')
  }, [])

  // 모바일 하단 고정 CTA — 첫 화면에 버튼을 두지 않으므로(심플하게) 처음부터 띄우고, 맨 아래 CTA 가 보이면 숨긴다(AX 상세와 같은 방식)
  useEffect(() => {
    const el = ctaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const barVisible = !atEnd

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAF8] pb-[4.5rem] text-[#171B20] antialiased [word-break:keep-all] sm:pb-0">
      {/* 작은 헤더 — 로고 · 뒤로 · 상담 신청. 메뉴는 두지 않는다 */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#FBFAF7]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-2.5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <BrandLogo
              to="/"
              tagline="중소기업 기술사업 · MVP"
              imgClassName="h-8 max-w-[132px] sm:h-10 sm:max-w-[190px]"
              taglineClassName="text-[0.64rem]! tracking-[0.08em]! sm:text-[0.7rem]! sm:tracking-[0.16em]!"
            />
            <Link
              to={BUSINESS_CHOOSER_PATH}
              className="hidden min-h-10 items-center gap-1 whitespace-nowrap text-[0.9rem] font-semibold text-[#6B7680] transition-colors hover:text-[#171B20] min-[420px]:inline-flex sm:text-[0.95rem]"
            >
              <span aria-hidden>←</span> 대표님 서비스 선택
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setConsultOpen(true)}
              className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full bg-[#171B20] px-3.5 text-[0.86rem] font-semibold text-[#F4F1EC] shadow-sm transition-colors hover:bg-[#0B0E12] sm:min-h-10 sm:px-4 sm:text-[0.98rem]"
            >
              상담 신청
            </button>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <VentureMvpHero />
        <VentureMvpFilm ref={filmRef} onConsult={() => setConsultOpen(true)} samplesAnchor={VENTURE_MVP_EXAMPLES_ID} />
        <VentureMvpExamples />

        {/* 상세 이미지 02~15 — 하나의 긴 스토리처럼 붙여서 보여준다(01 은 위 글자 히어로가 대신한다). 지금은 숨김 */}
        {SHOW_STORY_IMAGES && (
          <div className="mx-auto w-full max-w-[880px]" data-mvp-story>
            {STORY_IMAGES.map((img, i) => (
              <div key={img.n} className="relative">
                <picture>
                  <source srcSet={`${VENTURE_MVP_DIR}/${img.n}.webp`} type="image/webp" />
                  <img
                    src={`${VENTURE_MVP_DIR}/${img.n}.png`}
                    width={img.w}
                    height={img.h}
                    alt={`기술사업·MVP·벤처기업확인 상세 안내 ${i + 1} / ${STORY_IMAGES.length}`}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </picture>
                {/* 그림 속 버튼 자리에 얹는 실제 링크 — 보이지 않고 눌리기만 한다 */}
                {(VENTURE_MVP_HOTSPOTS[img.n] ?? []).map((h) =>
                  h.action === 'consult' ? (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => setConsultOpen(true)}
                      aria-label={h.label}
                      data-mvp-hotspot={h.action}
                      className={HOTSPOT_CLS}
                      style={hotspotStyle(h)}
                    />
                  ) : (
                    <Link
                      key={h.label}
                      to={h.action === 'samples' ? SAMPLES_HREF : VENTURE_BENEFIT_HREF}
                      aria-label={h.label}
                      data-mvp-hotspot={h.action}
                      className={HOTSPOT_CLS}
                      style={hotspotStyle(h)}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        )}

        {/* 자주 묻는 질문 — 맨 마지막 CTA 바로 앞 */}
        <FaqSection items={VENTURE_MVP_FAQ} />

        {/* 마지막 CTA — FAQ 가 끝나자마자 이어지도록 위쪽 경계선·여백을 두지 않는다 */}
        <div ref={ctaRef}>
          <section className="bg-[#171B20] text-white">
            <div className="mx-auto max-w-[880px] px-5 py-14 text-center sm:px-6 sm:py-16">
              <p className="text-[1.02rem] font-bold text-[#E8B89A] sm:text-[1.1rem]">우리 회사도 가능할까요?</p>
              <h2 className="mt-2.5 text-[1.65rem] font-black leading-tight tracking-tight sm:text-[2.1rem]">대표님 회사를 알려주세요.</h2>
              <p className="mx-auto mt-3.5 max-w-md break-keep text-[1rem] leading-relaxed text-slate-300 sm:text-[1.08rem]">
                회사명, 업종, 업력 같은 간단한 정보만 남겨 주세요.<br className="hidden sm:block" /> 지금 하는 사업을 기준으로 살펴봐 드릴게요.
              </p>

              {/* Primary 하나만 압도적으로 — Secondary 는 아래 텍스트 링크로 위계를 낮춘다 */}
              <button
                type="button"
                onClick={() => setConsultOpen(true)}
                className="shine-cta mx-auto mt-7 flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-[#D47A4A] px-8 py-[1.15rem] text-[1.2rem] font-black text-[#171B20] shadow-xl shadow-[#D47A4A]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:text-[1.3rem]"
              >
                우리 회사 기준으로 검토받기 <span aria-hidden>→</span>
              </button>
              <p className="mt-3 text-[0.86rem] text-slate-400">1~2분 · 무료 · 진단 없이 바로 신청</p>

              <p className="mt-6">
                <Link
                  to={SAMPLES_HREF}
                  className="inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.95rem] font-semibold text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white hover:decoration-slate-300"
                >
                  샘플 {SAMPLE_TOTAL}개 모아보기 <span aria-hidden>→</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      <LegalFooter tone="dark" />
      {/* 폰에서 하단 바가 떠 있으면 카톡은 바 안에 들어가 있다 */}
      <KakaoFloat mobileHidden={barVisible} />

      {/* 샘플 — PC 는 카톡 버튼 옆 알약, 모바일은 아래 고정 바 오른쪽 버튼. 둘 다 '샘플 모아보기' 페이지로 간다 */}
      <SampleQuickNav pillTo={SAMPLES_HREF} pillLabel={`샘플 ${SAMPLE_TOTAL}개 보기`} />

      {/* 모바일 하단 고정 바 — AX 페이지와 같은 모양: 상담 신청 · 샘플 보기 · 카톡 · 뒤로·앞으로 */}
      {barVisible && (
        <DetailMobileBar
          dataAttrs={{ 'data-mvp-sticky': '' }}
          primary={{
            onClick: () => setConsultOpen(true),
            label: (
              <>
                상담 신청하기 <span aria-hidden>→</span>
              </>
            ),
          }}
          secondary={{
            to: SAMPLES_HREF,
            label: (
              <span data-mvp-sticky-samples>
                <span className="min-[360px]:hidden">샘플 보기</span>
                <span className="hidden min-[360px]:inline">샘플 {SAMPLE_TOTAL}개 보기</span>
              </span>
            ),
          }}
        />
      )}

      {/* 사이트 공통 상담카드를 그대로 재사용 — 신청 서비스만 이미 선택된 상태로 넘긴다 */}
      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source={CONSULT_SOURCE}
        presetService={PRESET_SERVICE}
        heading="대표님 회사를 알려주세요."
        intro="지금 하는 사업에서 어떤 기술사업과 MVP를 만들 수 있을지, 상담에서 함께 살펴봐요."
        submitLabel="상담 신청하기"
        showContactMethod
        showCompanyFields
      />
    </div>
  )
}
