// 기술사업 · MVP · 벤처기업확인 패키지 (/business-services/venture-mvp).
// 주인공은 Drive 상세페이지 이미지 15장 자체다 — 웹 텍스트로 다시 설명하지 않는다.
//  - 01→15 순서 고정, 원본 비율 그대로(width:100%; height:auto), 이미지 사이 여백 없음
//  - 첫 장만 우선 로딩, 나머지는 lazy. width/height 로 자리를 미리 잡아 CLS 를 막는다
//  - 이미지 안에 그려진 버튼(01·04·09·15)은 그림일 뿐이라, 그 자리에 투명한 실제 링크(hotspot)를 얹고
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
import { VENTURE_MVP_DIR, VENTURE_MVP_HOTSPOTS, VENTURE_MVP_IMAGES, type VentureMvpHotspot } from '../data/ventureMvpImages'
import { AX_GUIDE_PATH, BUSINESS_CHOOSER_PATH, VENTURE_MVP_PATH } from '../lib/businessRoutes'
import { rememberInterest } from '../lib/interestTrack'
import { usePageMeta } from '../lib/pageMeta'

const PAGE_TITLE = '기술사업 · MVP · 벤처기업확인 | 미래AI랩'
const PAGE_DESC = '지금 하는 사업에서 출발해 기술사업 아이디어를 잡고, 실제로 돌아가는 MVP를 만들고, 벤처기업확인 신청까지 한 번에 이어 갑니다.'

/** 상담 리드의 신청 경로 — consult_leads.source 와 알림 메일 제목에 그대로 들어간다 */
const CONSULT_SOURCE = '기술사업·MVP 상세페이지 (venture-mvp)'
/** 상담카드에 이미 선택된 상태로 표시할 메인 신청 서비스 — 추가 관심 항목과 섞이지 않는다 */
const PRESET_SERVICE = '기술사업 · MVP · 벤처기업확인 패키지'
// 22개 샘플(업종별 AX 12 + 아이디어 MVP 10)은 AX 상세 안내의 Preview 묶음에 이미 있다 — 같은 곳으로 보낸다
const SAMPLES_HREF = `${AX_GUIDE_PATH}#portfolio`
// 09 "벤처기업확인 혜택 보기" — 벤처인증 패키지(혁신성장형) 상세에 제도 혜택이 정리돼 있다
const VENTURE_BENEFIT_HREF = '/business-services/venture-innovation'
const HOTSPOT_CLS =
  'absolute block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8B89A]'
const hotspotStyle = (h: VentureMvpHotspot) => ({ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` })

export default function VentureMvpPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESC, VENTURE_MVP_PATH)
  const [pastTop, setPastTop] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [consultOpen, setConsultOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    rememberInterest('venture-mvp')
  }, [])

  // 모바일 하단 고정 CTA — 첫 장을 어느 정도 본 뒤에만 띄우고, 하단 CTA 가 보이면 숨긴다
  useEffect(() => {
    const sync = () => setPastTop(window.scrollY > 480)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])
  useEffect(() => {
    const el = ctaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAF8] pb-[4.5rem] text-[#171B20] antialiased [word-break:keep-all] sm:pb-0">
      {/* 작은 헤더 — 로고 · 뒤로 · 상담 신청. 이미지가 주인공이라 메뉴는 두지 않는다 */}
      <header className="sticky top-0 z-30 border-b border-[#E7EAEE] bg-[#FAFAF8]/92 backdrop-blur-md">
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
              className="inline-flex min-h-9 items-center whitespace-nowrap rounded-lg bg-[#D47A4A] px-3 text-[0.86rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] sm:min-h-10 sm:px-4 sm:text-[1rem]"
            >
              상담 신청
            </button>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <h1 className="sr-only">기술사업 · MVP · 벤처기업확인 패키지 — 2주 기술사업 빌드</h1>

        {/* 상세 이미지 15장 — 하나의 긴 스토리처럼 붙여서 보여준다 */}
        <div className="mx-auto w-full max-w-[880px]" data-mvp-story>
          {VENTURE_MVP_IMAGES.map((img, i) => (
            <div key={img.n} className="relative">
              <picture>
                <source srcSet={`${VENTURE_MVP_DIR}/${img.n}.webp`} type="image/webp" />
                <img
                  src={`${VENTURE_MVP_DIR}/${img.n}.png`}
                  width={img.w}
                  height={img.h}
                  alt={`기술사업·MVP·벤처기업확인 상세 안내 ${i + 1} / ${VENTURE_MVP_IMAGES.length}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
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

        {/* 실제로 눌리는 CTA — 이미지 안의 버튼은 그림이다.
            마지막 이미지가 끝나자마자 이어지도록 위쪽 경계선·여백을 두지 않는다. */}
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
                  22개 샘플 더 보기 <span aria-hidden>→</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      <LegalFooter />
      <KakaoFloat />

      {/* 모바일 하단 고정 CTA — 한 줄 높이만 차지해 이미지 감상을 방해하지 않는다 */}
      {pastTop && !atEnd && (
        <div
          data-mvp-sticky
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E7EAEE] bg-[#FAFAF8]/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(23,27,32,0.08)] backdrop-blur-md sm:hidden"
        >
          <button
            type="button"
            onClick={() => setConsultOpen(true)}
            className="flex min-h-12 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#D47A4A] px-4 text-[1rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A]"
          >
            우리 회사 기준으로 검토받기 <span aria-hidden>→</span>
          </button>
        </div>
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
