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

const PAGE_TITLE = '대표님 서비스 선택 | 미래AI랩 — 50인 미만 중소기업 AX · 기술사업·MVP'
const PAGE_DESC =
  '50인 미만 중소기업을 위한 AX와 기술사업을 만들어요. 아이디어는 작동하는 서비스로, 회사는 벤처기업으로 — 2주 MVP·벤처기업확인 패키지부터, 회사 전체를 바꾸는 AX 도입까지.'

const MVP_STEPS = ['기술사업', 'MVP', '벤처기업확인'] as const
const AX_KEYWORDS = ['내부 업무', '고객 응대', '데이터', '자동화', '매출 성장'] as const

// "AX = 대기업" 이라는 인상을 먼저 걷어내는 자리.
// 새로 지어낸 말은 두지 않는다 — 셋 다 이미 사이트에 있는 사실을 끌어올린 것이다.
//   · 50인 미만 중소기업 / ERP·POS 그대로 사용 → AX 상세 안내 FAQ
//   · '지금은 정비 먼저' → 3분 AX Fit 결과 등급
const SME_POINTS = [
  {
    t: '지금 쓰는 방식 그대로에서',
    d: '엑셀, 카톡, 수기로 하던 일에서 시작해요. 쓰던 ERP·POS도 그대로 둡니다.',
  },
  {
    t: '전담 IT 인력이 없어도',
    d: '따로 배우지 않아도 바로 쓰는 화면으로 만들어요.',
  },
  {
    t: '크게 만드는 게 답이 아닐 수도',
    d: '진단 결과가 ‘지금은 정비 먼저’라면, 만들자고 권하지 않고 솔직하게 말씀드려요.',
  },
] as const

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
            dark ? 'bg-[#D47A4A] text-[#171B20]' : 'bg-[#171B20]/[0.06] text-[#646E78]'
          }`}
        >
          {dark && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#171B20]" />}
          {badge}
        </span>
      </div>
      <p className={`mt-3 break-keep text-[1.08rem] font-black leading-tight tracking-tight sm:text-[1.18rem] ${dark ? 'text-white' : 'text-[#171B20]'}`}>{name}</p>
      <p className={`mt-1 break-keep text-[0.88rem] font-bold leading-snug ${dark ? 'text-[#E8B89A]' : 'text-[#B35A2A]'}`}>{diff}</p>
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

      {/* 위 여백을 넉넉히 두면 768px(태블릿)에서 두 카드 CTA 가 첫 화면 밖으로 밀린다 */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-6">
        <div className="text-center">
          {/* 첫 줄부터 누구를 위한 서비스인지 못 박는다 — AX 를 대기업 얘기로 넘겨짚지 않게 */}
          {/* 글자 1.2배 (0.84 → 1.01rem · PC 0.9 → 1.08rem). Pretendard 기준 360px 폰에서도 한 줄 */}
          <p className="hero-anim inline-flex items-center gap-2 rounded-full border border-[#D47A4A]/35 bg-white px-3.5 py-2 text-[1.01rem] font-black text-[#171B20] shadow-sm min-[380px]:px-4 sm:text-[1.08rem]">
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#D47A4A]" />
            {/* 한 덩어리로 묶는다 — 나누면 gap-2 가 '중소기업'과 '을' 사이에 끼어든다 */}
            <span className="break-keep">
              <span className="text-[#B35A2A]">50인 미만 중소기업</span>을 위한 AX · 기술사업
            </span>
          </p>
          <h1 className="hero-anim mt-3.5 text-[1.7rem] font-black leading-[1.25] tracking-tight [animation-delay:60ms] sm:text-[2.4rem]">
            대표님, 지금 필요한 변화는<br className="sm:hidden" /> 어느 쪽인가요?
          </h1>
          <p className="hero-anim mx-auto mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-[#646E78] [animation-delay:120ms] sm:text-[1.12rem]">
            없던 사업을 새로 만들지,<br className="sm:hidden" /> 하던 일을 바꿀지만 고르시면 돼요.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
          {/* 01 — 2주 기술사업 빌드 : 지금 먼저 내보내는 상품. 어두운 카드로 무게를 준다(상세페이지와도 이어진다) */}
          <Link
            to={VENTURE_MVP_PATH}
            data-track="venture-mvp"
            aria-label="01 2주 기술사업 빌드 — 아이디어는 작동하는 서비스로, 회사는 벤처기업으로. 2주 기술사업 패키지 보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#D47A4A]/30 bg-gradient-to-br from-[#171B20] via-[#1F252C] to-[#343B44] p-5 pt-6 text-white shadow-lg shadow-[#171B20]/25 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/70 hover:shadow-2xl hover:shadow-[#171B20]/35 [animation-delay:200ms] sm:p-7"
          >
            <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D47A4A]/25 opacity-70 blur-3xl transition-opacity group-hover:opacity-100" />

            <div className="relative">
              <CardHead no="01" name="2주 기술사업 빌드" diff="없던 기술사업을 2주 안에" badge="선착순 5개사" tone="dark" />
              <h2 className="mt-4 text-[1.5rem] font-black leading-[1.25] tracking-tight sm:text-[1.8rem]">
                아이디어는 서비스로,<br />회사는 <span className="text-[#E8894F]">벤처기업으로</span>
              </h2>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-slate-300 sm:text-[1.02rem]">
                지금 하는 사업에서 기술사업 아이디어를 찾고, <b className="font-bold text-white">바로 써 볼 수 있는 첫 버전(MVP)</b>과
                벤처기업확인 신청까지 한 번에 끝내요.
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
            aria-label="02 풀 AX 구축 — 회사 전체를 AX로 바꿔요. AX 도입 알아보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#E7EAEE] bg-[#FFFDF9] p-5 pt-6 text-[#171B20] shadow-lg shadow-[#D47A4A]/10 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/50 hover:shadow-2xl hover:shadow-[#D47A4A]/20 [animation-delay:300ms] sm:p-7"
          >
            <span aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#E8B89A]/45 blur-3xl" />

            <div className="relative">
              <CardHead no="02" name="풀 AX 구축" diff="하던 일을 더 편하게 바꿔요" badge="상담 후 범위 결정" tone="light" />
              <h2 className="mt-4 text-[1.5rem] font-black leading-[1.25] tracking-tight sm:text-[1.8rem]">
                회사 전체를<br />AX로 바꿔요
              </h2>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-[#343B44] sm:text-[1.02rem]">
                반복 업무, 고객 응대, 여기저기 흩어진 데이터를 한 화면으로 모아요.{' '}
                <b className="font-bold text-[#171B20]">일은 줄고, 놓치던 매출은 다시 챙길 수 있어요.</b>
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="핵심 키워드">
                {AX_KEYWORDS.map((k) => (
                  <li key={k} className="rounded-full bg-[#171B20]/[0.05] px-3 py-1 text-[0.84rem] font-bold text-[#343B44] ring-1 ring-inset ring-[#171B20]/10">
                    {k}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9rem] font-semibold leading-relaxed text-[#646E78]">
                먼저 <b className="font-bold text-[#343B44]">3분 진단</b>으로 우리 회사에 맞는지부터 볼게요.
              </p>
            </div>

            <span className="shine-cta relative mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#171B20] px-5 text-[1.05rem] font-black text-white transition-colors group-hover:bg-[#343B44] sm:mt-auto">
              AX 도입 알아보기 <span aria-hidden className="text-[#E8B89A] transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>

        <p className="mt-5 text-center text-[0.86rem] text-[#646E78] sm:mt-7 sm:text-[0.95rem]">
          어느 쪽이든 <b className="font-semibold text-[#343B44]">3분 진단 → 결과 → 상담</b> 순서로 진행돼요.
        </p>

        {/* 중소기업이 기준이라는 것 — 대부분은 여기까지 읽지 않고 두 카드 중 하나를 바로 고른다.
            그래서 한 줄로 접어 두고, 궁금한 분만 펼쳐 본다(내용은 그대로). */}
        <details data-sme className="group mx-auto mt-6 w-full max-w-3xl rounded-2xl border border-[#E7EAEE] bg-white/70 sm:mt-8">
          <summary className="flex min-h-[3.25rem] cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D47A4A] sm:px-6 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 break-keep text-[0.98rem] font-black leading-snug text-[#171B20] sm:text-[1.06rem]">
              AX, 대기업만 하는 거 아닌가요?
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[0.88rem] font-bold text-[#B35A2A]">
              <span className="group-open:hidden">펼쳐보기</span>
              <span className="hidden group-open:inline">접기</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 8l5 5 5-5" />
              </svg>
            </span>
          </summary>

          <div className="border-t border-[#E7EAEE] px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
            <p className="break-keep text-[0.95rem] leading-relaxed text-[#646E78] sm:text-[1.02rem]">
              아니에요. 미래AI랩은 주로 <b className="font-bold text-[#171B20]">50인 미만 중소기업</b>의 AX와 플랫폼을 만들어요.
              대기업 시스템을 줄여 파는 게 아니라, 지금 일하는 방식에서 시작합니다.
            </p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {SME_POINTS.map((s) => (
                <li key={s.t} className="rounded-2xl bg-[#FAFAF8] p-4 ring-1 ring-inset ring-[#E7EAEE]">
                  <p className="flex items-start gap-2 break-keep text-[1rem] font-black leading-snug text-[#171B20]">
                    <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D47A4A]" />
                    {s.t}
                  </p>
                  <p className="mt-2 break-keep pl-3.5 text-[0.9rem] leading-relaxed text-[#646E78]">{s.d}</p>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[0.88rem] leading-relaxed text-[#646E78] sm:text-[0.95rem]">
              설계는 9년 차 경영컨설턴트가 <b className="font-semibold text-[#343B44]">중소기업 현장 기준</b>으로 직접 해요.
            </p>
          </div>
        </details>
      </main>

      <LegalFooter />
      <KakaoFloat />
    </div>
  )
}
