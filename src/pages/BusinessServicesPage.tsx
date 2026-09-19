// 대표 고객 전용 2-Track 선택 페이지 (/business-services).
// 예전엔 이 주소가 곧 AX 홈(히어로 + 스토리 01~03)이었다. 그 화면은 /business-services/ax-start 로 옮겨 그대로
// 보존했고, 여기서는 "지금 필요한 변화가 어느 쪽인지" 만 고르게 한다 — 선택은 즉시, 설명은 선택 이후에.
// 두 트랙 모두 결국 같은 3분 진단 → 결과 → 상담 퍼널로 합류한다.
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import { AX_START_PATH, BUSINESS_CHOOSER_PATH, VENTURE_MVP_PATH } from '../lib/businessRoutes'
import { usePageMeta } from '../lib/pageMeta'

const PAGE_TITLE = '대표님 서비스 선택 | 미래AI랩 — AX 도입 · 기술사업·MVP'
const PAGE_DESC =
  '회사 전체를 바꾸는 AX 도입부터 기술사업 하나를 빠르게 만드는 MVP·벤처기업확인 패키지까지. 지금 필요한 방향을 고르면 맞는 안내로 바로 이어집니다.'

const AX_KEYWORDS = ['내부 업무', '고객접점', '데이터', '자동화', '매출성장'] as const

export default function BusinessServicesPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESC, BUSINESS_CHOOSER_PATH)

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAF8] text-[#171B20] antialiased [word-break:keep-all]">
      {/* 작은 헤더 — 고르기 전이라 AX 쪽 메뉴를 먼저 보여주지 않는다 */}
      <header className="sticky top-0 z-30 border-b border-[#E7EAEE] bg-[#FAFAF8]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <BrandLogo to="/" tagline="대표님 서비스 선택" imgClassName="h-9 max-w-[150px] sm:h-10 sm:max-w-[190px]" />
          <HeaderAccount variant="business" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
        <div className="text-center">
          <p className="hero-anim text-[0.78rem] font-black uppercase tracking-[0.22em] text-[#D47A4A]">For CEO · 2 Tracks</p>
          <h1 className="hero-anim mt-3 text-[1.7rem] font-black leading-[1.25] tracking-tight [animation-delay:60ms] sm:text-[2.5rem]">
            대표님, 지금 필요한 변화는<br className="sm:hidden" /> 어느 쪽인가요?
          </h1>
          <p className="hero-anim mx-auto mt-3.5 max-w-xl text-[1.02rem] leading-relaxed text-[#6B7680] [animation-delay:120ms] sm:text-[1.15rem]">
            회사 전체를 바꾸는 AX부터<br className="sm:hidden" /> 기술사업 하나를 빠르게 만드는 MVP까지.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {/* TRACK A — Full AX : 다크·네이비, 기술·데이터·시스템 느낌 */}
          <Link
            to={AX_START_PATH}
            data-track="ax"
            aria-label="Full AX — 우리 회사에 AX를 도입하고 싶어요. AX 도입 알아보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#D47A4A]/25 bg-gradient-to-br from-[#171B20] via-[#1F252C] to-[#343B44] p-6 text-white shadow-lg shadow-[#171B20]/25 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/60 hover:shadow-2xl hover:shadow-[#171B20]/35 [animation-delay:200ms] sm:p-8"
          >
            {/* 얇은 격자 한 겹 — 기술·데이터 느낌만 준다. 빛나는 그래픽·회로망은 두지 않는다 */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#FAFAF8_1px,transparent_1px),linear-gradient(90deg,#FAFAF8_1px,transparent_1px)] [background-size:28px_28px]"
            />
            <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D47A4A]/20 opacity-70 blur-3xl transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <p className="text-[0.78rem] font-black tracking-[0.2em] text-[#E8B89A]">FULL AX</p>
              <h2 className="mt-3 text-[1.55rem] font-black leading-[1.25] tracking-tight sm:text-[1.95rem]">
                우리 회사에<br />AX를 도입하고 싶어요
              </h2>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-slate-300 sm:text-[1.05rem]">
                반복업무·고객접점·데이터를 연결해{' '}
                <b className="font-bold text-white">운영효율과 매출성장을 함께 만드는 회사 맞춤형 AX</b>
              </p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="핵심 키워드">
                {AX_KEYWORDS.map((k) => (
                  <li key={k} className="rounded-full bg-white/[0.07] px-3 py-1 text-[0.82rem] font-semibold text-slate-200 ring-1 ring-inset ring-white/15">
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <span className="shine-cta relative mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-6 text-[1.08rem] font-black text-[#171B20] transition-colors group-hover:bg-[#E8B89A] sm:mt-auto">
              AX 도입 알아보기 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {/* TRACK B — 기술사업·MVP : 아이보리·웜 화이트, 주황 포인트, 새로운 사업·성장 느낌 */}
          <Link
            to={VENTURE_MVP_PATH}
            data-track="venture-mvp"
            aria-label="2주 기술사업 패키지 — 기술사업·MVP부터 작게 시작하고 싶어요. 2주 기술사업 패키지 보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#E7EAEE] bg-[#FFFDF9] p-6 text-[#171B20] shadow-lg shadow-[#D47A4A]/10 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/50 hover:shadow-2xl hover:shadow-[#D47A4A]/20 [animation-delay:300ms] sm:p-8"
          >
            <span aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#E8B89A]/45 blur-3xl" />
            <div className="relative">
              <p className="text-[0.78rem] font-black tracking-[0.2em] text-[#D47A4A]">2-WEEK BUSINESS BUILD</p>
              <h2 className="mt-3 text-[1.55rem] font-black leading-[1.25] tracking-tight sm:text-[1.95rem]">
                기술사업·MVP부터<br />작게 시작하고 싶어요
              </h2>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-[#343B44] sm:text-[1.05rem]">
                기존 사업을 분석해{' '}
                <b className="font-bold text-[#171B20]">기술사업 아이디어 → 작동하는 MVP → 벤처기업확인 신청</b>까지 하나의 흐름으로 만듭니다.
              </p>
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#E8B89A]/35 px-3 py-1 text-[0.82rem] font-bold text-[#171B20] ring-1 ring-inset ring-[#D47A4A]/30">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#D47A4A]" />
                런칭 파트너 300만원 · 선착순 5개사
              </p>
            </div>
            <span className="shine-cta relative mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#171B20] px-6 text-[1.08rem] font-black text-white transition-colors group-hover:bg-[#343B44] sm:mt-auto">
              2주 기술사업 패키지 보기 <span aria-hidden className="text-[#E8B89A] transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>

        <p className="mt-6 text-center text-[0.86rem] text-[#6B7680] sm:mt-8 sm:text-[0.95rem]">
          어느 쪽을 골라도 <b className="font-semibold text-[#343B44]">3분 진단 → 결과 → 상담</b>으로 이어집니다.
        </p>
      </main>

      <LegalFooter />
      <KakaoFloat />
    </div>
  )
}
