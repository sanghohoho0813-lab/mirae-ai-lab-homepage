// 기술사업 · MVP · 벤처기업확인 패키지 (/business-services/venture-mvp).
// 주인공은 Drive 상세페이지 이미지 15장 자체다 — 웹 텍스트로 다시 설명하지 않는다.
//  - 01→15 순서 고정, 원본 비율 그대로(width:100%; height:auto), 이미지 사이 여백 없음
//  - 첫 장만 우선 로딩, 나머지는 lazy. width/height 로 자리를 미리 잡아 CLS 를 막는다
//  - 이미지 안에 그려진 버튼은 그림일 뿐이라, 실제 CTA 는 하단(+모바일 하단 고정)에 따로 둔다
//  - AX 트랙과 같은 3분 진단 → 결과 → 상담 퍼널로 합류한다. ?interest=venture-mvp 로 유입을 구분한다
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import { VENTURE_MVP_DIR, VENTURE_MVP_IMAGES } from '../data/ventureMvpImages'
import { AX_GUIDE_PATH, BUSINESS_CHOOSER_PATH, VENTURE_MVP_PATH } from '../lib/businessRoutes'
import { rememberInterest, withInterest } from '../lib/interestTrack'
import { usePageMeta } from '../lib/pageMeta'

const PAGE_TITLE = '기술사업 · MVP · 벤처기업확인 | 미래AI랩'
const PAGE_DESC = '기존 사업을 분석해 기술사업 아이디어, 실제 작동하는 MVP, 벤처기업확인 신청까지 하나의 성장 스토리로 연결합니다.'

const DIAG_HREF = withInterest('/business-diagnosis', 'venture-mvp')
// 22개 샘플(업종별 AX 12 + 아이디어 MVP 10)은 AX 상세 안내의 Preview 묶음에 이미 있다 — 같은 곳으로 보낸다
const SAMPLES_HREF = `${AX_GUIDE_PATH}#portfolio`

export default function VentureMvpPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESC, VENTURE_MVP_PATH)
  const [pastTop, setPastTop] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
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
      {/* 작은 헤더 — 로고 · 뒤로 · 3분 체크. 이미지가 주인공이라 메뉴는 두지 않는다 */}
      <header className="sticky top-0 z-30 border-b border-[#E7EAEE] bg-[#FAFAF8]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-2.5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <BrandLogo
              to="/"
              tagline="기술사업 · MVP"
              imgClassName="h-8 max-w-[132px] sm:h-10 sm:max-w-[190px]"
              taglineClassName="text-[0.5rem]! tracking-[0.13em]! sm:text-[0.7rem]! sm:tracking-[0.16em]!"
            />
            <Link
              to={BUSINESS_CHOOSER_PATH}
              className="hidden items-center gap-1 whitespace-nowrap text-[0.9rem] font-semibold text-[#6B7680] transition-colors hover:text-[#171B20] min-[420px]:inline-flex sm:text-[0.95rem]"
            >
              <span aria-hidden>←</span> 대표님 서비스 선택
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <Link
              to={DIAG_HREF}
              className="inline-flex min-h-9 items-center whitespace-nowrap rounded-lg bg-[#D47A4A] px-3 text-[0.86rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] sm:min-h-10 sm:px-4 sm:text-[1rem]"
            >
              3분 가능성 체크
            </Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <h1 className="sr-only">기술사업 · MVP · 벤처기업확인 패키지 — 2주 기술사업 빌드</h1>

        {/* 상세 이미지 15장 — 하나의 긴 스토리처럼 붙여서 보여준다 */}
        <div className="mx-auto w-full max-w-[880px]" data-mvp-story>
          {VENTURE_MVP_IMAGES.map((img, i) => (
            <picture key={img.n}>
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
          ))}
        </div>

        {/* 실제로 눌리는 CTA — 이미지 안의 버튼은 그림이다 */}
        <div ref={ctaRef}>
          <section className="border-t border-[#E7EAEE] bg-[#FAFAF8]">
            <div className="mx-auto max-w-[880px] px-5 py-12 text-center sm:px-6 sm:py-16">
              <p className="text-[0.78rem] font-black uppercase tracking-[0.2em] text-[#D47A4A]">Next Step</p>
              <h2 className="mt-3 text-[1.5rem] font-black leading-tight tracking-tight sm:text-[2rem]">우리 회사도 가능할까요?</h2>
              <p className="mt-2 text-[0.98rem] text-[#6B7680] sm:text-[1.05rem]">3분 · 무료 · 로그인 없이. 결과를 보고 상담 여부를 정하시면 됩니다.</p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to={DIAG_HREF}
                  className="shine-cta flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 py-4 text-[1.15rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto"
                >
                  우리 회사도 가능한지 3분 체크 <span aria-hidden>→</span>
                </Link>
                <Link
                  to={SAMPLES_HREF}
                  className="flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-[#343B44]/25 bg-white px-7 py-4 text-[1.15rem] font-bold text-[#171B20] transition-colors hover:bg-[#E7EAEE]/60 sm:w-auto"
                >
                  <span aria-hidden className="text-[#D47A4A]">▦</span> 22개 샘플 먼저 보기
                </Link>
              </div>
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
          <Link
            to={DIAG_HREF}
            className="flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#D47A4A] px-4 text-[1rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A]"
          >
            우리 회사도 가능한지 3분 체크 <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
