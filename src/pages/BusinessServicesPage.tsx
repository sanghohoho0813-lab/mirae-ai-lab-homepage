// 대표 고객 전용 2-Track 선택 페이지 (/business-services).
// 예전엔 이 주소가 곧 AX 홈(히어로 + 스토리 01~03)이었다. 그 화면은 /business-services/ax-start 로 옮겨 그대로
// 보존했고, 여기서는 "지금 필요한 변화가 어느 쪽인지" 만 고르게 한다 — 선택은 즉시, 설명은 선택 이후에.
// 두 트랙 모두 결국 같은 3분 진단 → 결과 → 상담 퍼널로 합류한다.
//
// 순서: 01 = 2주 기술사업 빌드(런칭 파트너 모집 중), 02 = 풀 AX 구축.
//   지금 먼저 내보내는 상품이 01 이라 위(모바일)·왼쪽(PC)에 두고 어두운 카드로 무게를 준다.
//   data-track 값(ax / venture-mvp)은 유입 구분에 쓰이므로 순서가 바뀌어도 그대로 둔다.
// 두 카드의 차이는 "없던 걸 새로 만든다 ↔ 지금 하는 걸 바꾼다" 한 줄로 가장 먼저 읽히게 한다.
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import { AX_START_PATH, BUSINESS_CHOOSER_PATH, VENTURE_MVP_PATH } from '../lib/businessRoutes'
import { usePageMeta } from '../lib/pageMeta'

const PAGE_TITLE = '대표님 서비스 선택 | 미래AI랩 — 2주 기술사업·MVP · AX 도입'
const PAGE_DESC =
  '회사에 없던 기술사업 하나를 2주 안에 만드는 MVP·벤처기업확인 패키지부터, 회사 전체를 바꾸는 AX 도입까지. 지금 필요한 방향을 고르면 맞는 안내로 바로 이어집니다.'

const MVP_STEPS = ['기술사업', 'MVP', '벤처기업확인'] as const
const AX_KEYWORDS = ['내부 업무', '고객접점', '데이터', '자동화', '매출성장'] as const

/** 카드 머리 — 큰 번호 + 상태 배지 / 상품 이름 / 무엇이 다른지 한 줄.
 *  배지를 absolute 로 띄우면 360px 에서 상품명 위로 겹쳐서, 번호와 같은 줄에 흐름대로 둔다. */
function CardHead({ no, name, diff, badge, tone }: { no: string; name: string; diff: string; badge: string; tone: 'dark' | 'light' }) {
  const dark = tone === 'dark'
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden
          className={`shrink-0 text-[2.7rem] font-black leading-[0.8] tracking-tighter sm:text-[3.2rem] ${dark ? 'text-[#D47A4A]' : 'text-[#171B20]'}`}
        >
          {no}
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.76rem] font-black ${
            dark ? 'bg-[#D47A4A] text-[#171B20]' : 'bg-[#171B20]/[0.06] text-[#6B7680]'
          }`}
        >
          {dark && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#171B20]" />}
          {badge}
        </span>
      </div>
      <p className={`mt-3 break-keep text-[1.08rem] font-black leading-tight tracking-tight sm:text-[1.18rem] ${dark ? 'text-white' : 'text-[#171B20]'}`}>{name}</p>
      <p className={`mt-1 break-keep text-[0.88rem] font-bold leading-snug ${dark ? 'text-[#E8B89A]' : 'text-[#D47A4A]'}`}>{diff}</p>
    </>
  )
}

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

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-10 pt-7 sm:px-6 sm:pb-12 sm:pt-9">
        <div className="text-center">
          <p className="hero-anim text-[0.78rem] font-black uppercase tracking-[0.22em] text-[#D47A4A]">For CEO · 2 Tracks</p>
          <h1 className="hero-anim mt-2.5 text-[1.7rem] font-black leading-[1.25] tracking-tight [animation-delay:60ms] sm:text-[2.4rem]">
            대표님, 지금 필요한 변화는<br className="sm:hidden" /> 어느 쪽인가요?
          </h1>
          <p className="hero-anim mx-auto mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-[#6B7680] [animation-delay:120ms] sm:text-[1.12rem]">
            회사에 없던 기술사업 하나를 새로 만들지,<br className="sm:hidden" /> 지금 하고 있는 일을 회사 전체 단위로 바꿀지.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
          {/* 01 — 2주 기술사업 빌드 : 지금 먼저 내보내는 상품. 어두운 카드로 무게를 준다(상세페이지와도 이어진다) */}
          <Link
            to={VENTURE_MVP_PATH}
            data-track="venture-mvp"
            aria-label="01 2주 기술사업 빌드 — 기술사업 하나를 2주 안에 만듭니다. 2주 기술사업 패키지 보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#D47A4A]/30 bg-gradient-to-br from-[#171B20] via-[#1F252C] to-[#343B44] p-5 pt-6 text-white shadow-lg shadow-[#171B20]/25 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/70 hover:shadow-2xl hover:shadow-[#171B20]/35 [animation-delay:200ms] sm:p-7"
          >
            <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D47A4A]/25 opacity-70 blur-3xl transition-opacity group-hover:opacity-100" />

            <div className="relative">
              <CardHead no="01" name="2주 기술사업 빌드" diff="회사에 없던 것을 새로 만듭니다" badge="선착순 5개사" tone="dark" />
              <h2 className="mt-4 text-[1.5rem] font-black leading-[1.25] tracking-tight sm:text-[1.8rem]">
                기술사업 하나를<br />2주 안에 만듭니다
              </h2>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-slate-300 sm:text-[1.02rem]">
                기존 사업을 분석해{' '}
                <b className="font-bold text-white">기술사업 아이디어 → 작동하는 MVP → 벤처기업확인 신청</b>까지 하나의 흐름으로 만듭니다.
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="패키지 구성">
                {MVP_STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden className="text-[0.8rem] text-slate-500">→</span>}
                    <span className="rounded-full bg-white/[0.08] px-3 py-1 text-[0.84rem] font-bold text-slate-100 ring-1 ring-inset ring-white/15">{s}</span>
                  </li>
                ))}
              </ul>
              {/* 가격 — 이 카드에만 있다. 지금 고를 이유가 가장 분명한 자리 */}
              <p className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-[0.92rem] font-bold text-slate-400 line-through">정상가 500만원</span>
                <span className="text-[0.86rem] font-black text-[#E8B89A]">런칭 파트너</span>
                <span className="text-[1.6rem] font-black leading-none tracking-tight text-white sm:text-[1.75rem]">300만원</span>
              </p>
            </div>

            <span className="shine-cta relative mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-5 text-[1.05rem] font-black text-[#171B20] transition-colors group-hover:bg-[#E8B89A] sm:mt-auto sm:pt-0">
              2주 기술사업 패키지 보기 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {/* 02 — 풀 AX 구축 : 아이보리·웜 화이트. 이미 하고 있는 업무를 바꾸는 쪽 */}
          <Link
            to={AX_START_PATH}
            data-track="ax"
            aria-label="02 풀 AX 구축 — 회사 전체를 AX로 바꿉니다. AX 도입 알아보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#E7EAEE] bg-[#FFFDF9] p-5 pt-6 text-[#171B20] shadow-lg shadow-[#D47A4A]/10 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/50 hover:shadow-2xl hover:shadow-[#D47A4A]/20 [animation-delay:300ms] sm:p-7"
          >
            <span aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#E8B89A]/45 blur-3xl" />

            <div className="relative">
              <CardHead no="02" name="풀 AX 구축" diff="지금 하고 있는 일을 바꿉니다" badge="상담 후 범위 결정" tone="light" />
              <h2 className="mt-4 text-[1.5rem] font-black leading-[1.25] tracking-tight sm:text-[1.8rem]">
                회사 전체를<br />AX로 바꿉니다
              </h2>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-[#343B44] sm:text-[1.02rem]">
                반복업무·고객접점·데이터를 연결해{' '}
                <b className="font-bold text-[#171B20]">운영효율과 매출성장을 함께 만드는 회사 맞춤형 AX</b>
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="핵심 키워드">
                {AX_KEYWORDS.map((k) => (
                  <li key={k} className="rounded-full bg-[#171B20]/[0.05] px-3 py-1 text-[0.84rem] font-bold text-[#343B44] ring-1 ring-inset ring-[#171B20]/10">
                    {k}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9rem] font-semibold leading-relaxed text-[#6B7680]">
                먼저 <b className="font-bold text-[#343B44]">3분 진단</b>으로 전면 구축이 맞는지부터 판단합니다.
              </p>
            </div>

            <span className="shine-cta relative mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#171B20] px-5 text-[1.05rem] font-black text-white transition-colors group-hover:bg-[#343B44] sm:mt-auto">
              AX 도입 알아보기 <span aria-hidden className="text-[#E8B89A] transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>

        <p className="mt-5 text-center text-[0.86rem] text-[#6B7680] sm:mt-7 sm:text-[0.95rem]">
          어느 쪽을 골라도 <b className="font-semibold text-[#343B44]">3분 진단 → 결과 → 상담</b>으로 이어집니다.
        </p>
      </main>

      <LegalFooter />
      <KakaoFloat />
    </div>
  )
}
