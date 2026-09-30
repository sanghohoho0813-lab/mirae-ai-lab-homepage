// 대표 고객 전용 2-Track 선택 페이지 (/business-services).
// 예전엔 이 주소가 곧 AX 홈(히어로 + 스토리 01~03)이었다. 그 화면은 /business-services/ax-start 로 옮겨 그대로
// 보존했고, 여기서는 "지금 필요한 변화가 어느 쪽인지" 만 고르게 한다 — 선택은 즉시, 설명은 선택 이후에.
// 두 트랙 모두 결국 같은 3분 진단 → 결과 → 상담 퍼널로 합류한다.
//
// 순서: 01 = 2주 기술사업 빌드(BASIC · 정상가 500만원, 런칭 파트너 특가 300만원), 02 = Full AX 구축(ADVANCED · 500만원부터 · 대표 상품).
//   더 큰 상품·메인 상품이 02 라는 게 한눈에 읽히게 02 를 어두운 카드 + 샴페인 골드로, 01 은 밝은 카드로 둔다.
//   폰 첫 화면에서 02 머리(ADVANCED)가 살짝 보이도록 01 과 위 안내를 폰에서만 조밀하게 한다.
//   data-track 값(ax / venture-mvp)은 유입 구분에 쓰이므로 순서가 바뀌어도 그대로 둔다.
// 두 카드의 차이는 "없던 걸 새로 만든다 ↔ 지금 회사를 키운다" 한 줄로 가장 먼저 읽히게 한다.
// 카드는 아주 단순하게(대표님 방향 2026-09): 큰 상품 이름 → 한 줄 → 핵심 문장 → 가격 → 버튼. 설명 문단·키워드·단계 칩은 두지 않는다
// (자세한 설명은 상세 페이지에서). 두 카드는 같은 구성으로 대칭을 맞춘다. 02 문장은 AX 상세 첫 화면 제목과 같은 말(경쟁력 있는 회사로).
// 상품 이름은 '2주 기술사업 빌드' · 'Full AX 구축' — '프로그램'을 붙이면 큰 글씨에서 폰 두 줄로 떨어져서 붙이지 않는다.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import { AX_START_PATH, BUSINESS_CHOOSER_PATH, VENTURE_MVP_PATH } from '../lib/businessRoutes'
import { usePageMeta } from '../lib/pageMeta'

const PAGE_TITLE = '대표님 서비스 선택 | 미래AI랩 — 50인 미만 중소기업 AX · 기술사업·MVP'
const PAGE_DESC =
  '50인 미만 중소기업을 위한 AX와 기술사업을 만들어요. 아이디어는 작동하는 서비스로, 회사는 벤처기업으로 — 2주 MVP·벤처기업확인 패키지부터, 정책자금·지원사업·투자에서 경쟁력 있는 회사로 만드는 AX 도입까지.'

// "AX = 대기업" 이라는 인상을 먼저 걷어내는 자리.
// 새로 지어낸 말은 두지 않는다 — 셋 다 이미 사이트에 있는 사실을 끌어올린 것이다.
//   · 50인 미만 중소기업 / ERP·POS 그대로 사용 → AX 상세 안내 FAQ
//   · 'MVP부터 작게' → 3분 AX Fit 결과(예산·필요에 맞춰 시작 상품을 낮춰 권한다)
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
    d: '진단 결과가 ‘MVP부터’라면, 큰 구축을 권하지 않고 작게 시작하자고 솔직하게 말씀드려요.',
  },
] as const

/** 카드 머리 — 큰 번호 + 등급(BASIC / ADVANCED) + 상태 배지(있을 때만) / 큰 상품 이름(+ 뜻풀이) / 무엇이 다른지 한 줄 + 핵심 문장(children).
 *  배지를 absolute 로 띄우면 360px 에서 상품명 위로 겹쳐서, 번호와 같은 줄에 흐름대로 둔다.
 *  한 줄·핵심 문장 오른쪽 빈 곳에 그림(visual)을 둔다 — 글자와 부딪히지 않게 같은 줄(flex)에 나란히 놓는다.
 *  두 카드가 나란히 서서 좁아지는 폴더블 펼친 화면·태블릿(640~1023px)에서는 그림을 글 아래 가운데로 내리고,
 *  아주 작은 폰(<360px)에서만 숨긴다. */
function CardHead({
  no,
  tier,
  name,
  diff,
  badge,
  tone,
  visual,
  note,
  children,
}: {
  no: string
  tier: 'BASIC' | 'ADVANCED'
  name: string
  diff: string
  badge?: string
  tone: 'dark' | 'light'
  visual?: ReactNode
  /** 상품 이름 옆 아주 작은 뜻풀이(예: AX = …). 넓으면 이름 옆, 좁으면 이름 아래 한 줄 */
  note?: ReactNode
  children?: ReactNode
}) {
  const dark = tone === 'dark'
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className={`shrink-0 text-[2.2rem] font-black leading-[0.8] tracking-tighter sm:text-[3.2rem] ${dark ? 'text-[#E6C396]' : 'text-[#171B20]'}`}
          >
            {no}
          </span>
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[0.8rem] font-black tracking-[0.14em] sm:text-[0.86rem] ${
              dark ? 'bg-gradient-to-r from-[#E6C396] to-[#C99257] text-[#15110C] shadow-sm shadow-[#C99257]/30' : 'bg-[#171B20]/[0.06] text-[#646E78] ring-1 ring-inset ring-[#171B20]/10'
            }`}
          >
            {tier}
          </span>
        </span>
        {badge && (
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.76rem] font-black ${
              dark ? 'bg-[#E6C396]/15 text-[#E6C396] ring-1 ring-inset ring-[#E6C396]/45' : 'bg-[#D47A4A] text-[#171B20]'
            }`}
          >
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-[#E6C396]' : 'bg-[#171B20]'}`} />
            {badge}
          </span>
        )}
      </div>
      {/* 상품 이름이 카드에서 가장 먼저 읽히게 — 아래 문장(h2)보다 크게(예전 1.62/2.05rem 의 1.3배).
          폰·태블릿(두 칸)에서도 한 줄에 들어가게 화면 폭에 맞춰 줄이고, 넓은 화면에서 2.66rem 까지 */}
      <div className="mt-3.5 flex flex-wrap items-end gap-x-3 gap-y-1 sm:mt-4">
        <p data-card-name className={`whitespace-nowrap text-[clamp(1.7rem,8.6vw,2.1rem)] font-black leading-[1.12] tracking-tight sm:text-[clamp(1.6rem,3.6vw,2.66rem)] ${dark ? 'text-white' : 'text-[#171B20]'}`}>{name}</p>
        {note && (
          <p
            data-card-note
            className={`break-keep pb-[0.3em] text-[0.76rem] font-medium leading-snug lg:max-w-[13rem] lg:border-l lg:pl-3 lg:text-[0.82rem] ${
              dark ? 'text-slate-400 lg:border-[#E6C396]/35' : 'text-[#646E78] lg:border-[#D47A4A]/35'
            }`}
          >
            {note}
          </p>
        )}
      </div>
      {/* 폰·PC: 글 | 그림 나란히. 두 카드가 나란히 서서 좁아지는 폴더블 펼친 화면·태블릿(640~1023px): 그림을 글 아래 가운데로 */}
      <div className="mt-1.5 flex items-start gap-2.5 sm:flex-col sm:items-stretch sm:gap-0 lg:flex-row lg:items-start lg:gap-4">
        <div className="min-w-0 flex-1">
          <p className={`break-keep text-[0.95rem] font-bold leading-snug sm:text-[1.02rem] ${dark ? 'text-[#E6C396]' : 'text-[#B35A2A]'}`}>{diff}</p>
          {children}
        </div>
        {visual && <div className="mt-0.5 shrink-0 max-[359px]:hidden sm:mt-4 sm:self-center lg:mt-0.5 lg:self-auto">{visual}</div>}
      </div>
    </>
  )
}

// 그림 크기 — 폰: 글 칸이 늘 172px 남도록(100vw − 246px, 100~150px). 폴더블 펼친 화면·태블릿(글 아래): 28vw. PC: 카드마다 따로.
const VIS_PHONE = '[--vw:clamp(100px,calc(100vw-246px),150px)] sm:[--vw:clamp(170px,28vw,230px)] w-[var(--vw)]'

/** 그림 뒤 궤도 — 천천히 흐르는 점선 고리 + 한 바퀴 도는 빛나는 호 + 반짝임(움직임 줄이기면 멈춤).
 *  wide: 가로로 긴 그림(01)용 타원, round: 정사각 그림(02)용 원 */
function Orbit({ tone, shape }: { tone: 'light' | 'dark'; shape: 'wide' | 'round' }) {
  const c = tone === 'light' ? { line: '#D47A4A', glow: '#E8B89A', star: '#D47A4A' } : { line: '#E6C396', glow: '#E6C396', star: '#F6E2C0' }
  const wide = shape === 'wide'
  const vb = wide ? { w: 240, h: 180 } : { w: 200, h: 200 }
  const cx = vb.w / 2, cy = vb.h / 2
  const [ro, rio] = wide ? [[114, 82], [100, 68]] : [[94, 94], [76, 76]]
  const gid = `orbitGlow-${tone}-${shape}`
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${vb.w} ${vb.h}`}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={c.glow} stopOpacity={tone === 'light' ? 0.5 : 0.38} />
          <stop offset="0.6" stopColor={c.glow} stopOpacity="0.1" />
          <stop offset="1" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={ro[0] * 0.98} ry={ro[1] * 0.98} fill={`url(#${gid})`} />
      {/* 바깥 점선 — 점이 고리를 따라 천천히 흐른다 */}
      <ellipse className="card-dots" cx={cx} cy={cy} rx={ro[0]} ry={ro[1]} fill="none" stroke={c.line} strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round" pathLength={200} strokeDasharray="0.6 3.4" />
      {/* 안쪽 고리 + 빛나는 호 두 개(서로 반대로 돈다) */}
      <ellipse cx={cx} cy={cy} rx={rio[0]} ry={rio[1]} fill="none" stroke={c.line} strokeOpacity="0.22" strokeWidth="1" />
      <ellipse className="card-comet" cx={cx} cy={cy} rx={rio[0]} ry={rio[1]} fill="none" stroke={c.line} strokeOpacity="0.9" strokeWidth="2.4" strokeLinecap="round" pathLength={100} strokeDasharray="12 88" />
      <ellipse className="card-comet-slow" cx={cx} cy={cy} rx={ro[0]} ry={ro[1]} fill="none" stroke={c.line} strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" pathLength={100} strokeDasharray="6 94" />
      {/* 반짝임 */}
      <path className="card-twinkle" d={`M${vb.w * 0.9} ${vb.h * 0.16} l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2z`} fill={c.star} />
      <path className="card-twinkle [animation-delay:1.6s]" d={`M${vb.w * 0.08} ${vb.h * 0.8} l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z`} fill={c.star} />
    </svg>
  )
}

/** 01 — 벤처기업확인서 + 같은 MVP 를 띄운 스마트폰·PC 모니터: 앱 하나가 아니라 PC·폰 어디서나 열리는 웹앱.
 *  대표님이 준비한 그림(배경 투명). 화면은 미래AI랩 자체 데모(PawBeauty)다. */
function VentureVisual() {
  return (
    <span data-card-visual className={`relative block h-[calc(var(--vw)*0.7)] ${VIS_PHONE} lg:[--vw:clamp(160px,15vw,210px)]`}>
      <Orbit tone="light" shape="wide" />
      <span className="absolute inset-0 flex items-center justify-center">
        <img
          src="/assets/business-services/cards/venture-visual.webp"
          alt="벤처기업확인서 예시와, 같은 MVP 를 띄운 스마트폰·PC 화면(미래AI랩 자체 데모)"
          width={600}
          height={389}
          decoding="async"
          className="card-float block w-full drop-shadow-[0_10px_14px_rgba(23,27,32,0.16)]"
        />
      </span>
    </span>
  )
}

/** 02 — AX 깃발을 단 회사 건물과 성장 화살표, 정책자금·정부지원사업·투자연계: AX 로 경쟁력 있는 회사.
 *  대표님이 준비한 그림(배경 투명). 뒤에서 금색 궤도가 천천히 돈다. */
function AxVisual() {
  return (
    <span data-card-visual className={`relative block h-[calc(var(--vw)*0.96)] ${VIS_PHONE} lg:[--vw:clamp(140px,12.5vw,184px)]`}>
      <Orbit tone="dark" shape="round" />
      <span className="absolute inset-0 flex items-center justify-center">
        <img
          src="/assets/business-services/cards/ax-visual.webp"
          alt="AX 깃발을 단 회사 건물과 성장 화살표 — 정책자금·정부지원사업·투자연계"
          width={560}
          height={533}
          decoding="async"
          className="card-float block w-[96%] drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] [animation-delay:-3s]"
        />
      </span>
    </span>
  )
}

export default function BusinessServicesPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESC, BUSINESS_CHOOSER_PATH)

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#F7F4EF] text-[#171B20] antialiased [word-break:keep-all]">
      {/* 아주 옅은 골드 빛 — 아이보리 바탕에 깊이만 준다 */}
      <div aria-hidden className="pointer-events-none absolute -right-48 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#E6C396]/25 blur-3xl" />
      {/* 작은 헤더 — 고르기 전이라 AX 쪽 메뉴를 먼저 보여주지 않는다 */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#FBFAF7]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <BrandLogo to="/" tagline="대표님 서비스 선택" imgClassName="h-9 max-w-[150px] sm:h-10 sm:max-w-[190px]" />
          <HeaderAccount variant="business" />
        </div>
      </header>

      {/* 위 여백을 넉넉히 두면 768px(태블릿)에서 두 카드 CTA 가 첫 화면 밖으로 밀린다 */}
      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-8">
        <div className="text-center">
          {/* 첫 줄부터 누구를 위한 서비스인지 못 박는다 — AX 를 대기업 얘기로 넘겨짚지 않게 */}
          {/* 글자 1.2배 (0.84 → 1.01rem · PC 0.9 → 1.08rem). Pretendard 기준 360px 폰에서도 한 줄 */}
          <p className="hero-anim inline-flex items-center gap-3 text-[1.01rem] font-bold text-[#343B44] sm:text-[1.08rem]">
            <span aria-hidden className="h-px w-6 shrink-0 bg-[#C99257]/70 sm:w-10" />
            {/* 한 덩어리로 묶는다 — 나누면 gap-2 가 '중소기업'과 '을' 사이에 끼어든다 */}
            <span className="break-keep">
              <span className="text-[#A5703C]">50인 미만 중소기업</span>을 위한 AX · 기술사업
            </span>
            <span aria-hidden className="h-px w-6 shrink-0 bg-[#C99257]/70 sm:w-10" />
          </p>
          <h1 className="hero-anim mt-3 text-[1.55rem] font-bold leading-[1.25] tracking-[-0.03em] text-[#0B0E12] [animation-delay:60ms] sm:mt-4 sm:text-[2.55rem]">
            대표님, 지금 필요한 변화는<br className="sm:hidden" /> 어느 쪽인가요?
          </h1>
          {/* 폰에서는 뺀다 — 두 카드의 한 줄(없던 기술사업을 2주 안에 / 지금 회사를 한 단계 위로)이 같은 말을 하고, 02 카드가 첫 화면에 보여야 한다 */}
          <p className="hero-anim mx-auto mt-3 hidden max-w-2xl text-[1.12rem] leading-relaxed text-[#646E78] [animation-delay:120ms] sm:block">
            없던 사업을 새로 만들지, 지금 회사를 키울지만 고르시면 돼요.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-6">
          {/* 01 BASIC — 2주 기술사업 빌드 : 밝은 카드. 가격이 분명한 입문 상품 */}
          <Link
            to={VENTURE_MVP_PATH}
            data-track="venture-mvp"
            aria-label="01 BASIC 2주 기술사업 빌드 — 아이디어는 작동하는 서비스로, 회사는 벤처기업으로. 런칭 파트너 300만원. 2주 기술사업 패키지 보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#E7EAEE] bg-[#FFFDF9] p-4 pt-5 text-[#171B20] shadow-lg shadow-[#D47A4A]/10 transition duration-200 hover:-translate-y-1 hover:border-[#D47A4A]/50 hover:shadow-2xl hover:shadow-[#D47A4A]/20 [animation-delay:200ms] sm:p-7"
          >
            <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#E8B89A]/40 blur-3xl" />

            <div className="relative sm:flex-1">
              <CardHead no="01" tier="BASIC" name="2주 기술사업 빌드" diff="없던 기술사업을 2주 안에" tone="light" visual={<VentureVisual />}>
                <h2 className="mt-3 text-[1.2rem] font-black leading-[1.3] tracking-tight sm:mt-4 sm:text-[clamp(1.15rem,2.2vw,1.5rem)]">
                  아이디어는 서비스로,<br />회사는 <span className="text-[#C8612E]">벤처기업으로</span>
                </h2>
              </CardHead>
              {/* 가격 — '원래 500만원인데 지금 300만원' 이 한눈에 읽히게: 정상가를 크게 두고 붉은 선으로 지운 뒤,
                  아래 줄에 런칭 파트너 가격과 할인 금액을 붙인다(상세 페이지 첫 화면과 같은 숫자) */}
              <div className="mt-3.5 rounded-2xl bg-[#171B20]/[0.035] px-4 py-3 ring-1 ring-inset ring-[#171B20]/10 sm:mt-5">
                <p className="flex items-baseline gap-2">
                  <span className="text-[0.84rem] font-bold text-[#646E78]">정상가</span>
                  <del className="text-[1.2rem] font-black tabular-nums text-[#646E78] decoration-[#D2462E] decoration-[2.5px] sm:text-[1.3rem]">500만원</del>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[0.88rem] font-black text-[#B35A2A]">런칭 파트너 특가</span>
                  <span className="text-[1.6rem] font-black leading-none tracking-tight text-[#171B20] sm:text-[1.8rem]">300만원</span>
                  <span className="rounded-full bg-[#D2462E] px-2.5 py-1 text-[0.8rem] font-black leading-none text-white">200만원 할인</span>
                </p>
                {/* 선착순은 카드 머리가 아니라 할인 바로 아래 — 가격과 한 덩어리로 읽힌다 */}
                <p className="mt-2">
                  <span data-first-come className="inline-flex items-center gap-1.5 rounded-full bg-[#D47A4A] px-2.5 py-1 text-[0.8rem] font-black leading-none text-[#171B20]">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#171B20]" />
                    선착순 5개사
                  </span>
                </p>
                <p className="mt-2 break-keep text-[0.74rem] leading-snug text-[#646E78]">벤처기업확인 심사 수수료는 별도예요.</p>
              </div>
            </div>

            <span className="relative mt-4 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#171B20] px-5 text-[1.05rem] font-black text-white transition-colors group-hover:bg-[#343B44] sm:min-h-[52px]">
              2주 기술사업 패키지 보기 <span aria-hidden className="text-[#E8B89A] transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {/* 02 ADVANCED — Full AX 구축 : 대표 상품. 어두운 카드 + 샴페인 골드로 '더 큰 상품'이 한눈에 읽히게 */}
          <Link
            to={AX_START_PATH}
            data-track="ax"
            aria-label="02 ADVANCED Full AX 구축 — AX 도입으로 정책자금·지원사업·투자에서 경쟁력 있는 회사로. 대표 상품, 500만원부터. AX 도입 알아보기"
            className="hero-anim group relative flex flex-col overflow-hidden rounded-3xl border border-[#D8A871]/50 bg-gradient-to-br from-[#12161B] via-[#1B2027] to-[#2C3138] p-4 pt-5 text-white shadow-xl shadow-[#171B20]/30 ring-1 ring-inset ring-[#E6C396]/15 transition duration-200 hover:-translate-y-1 hover:border-[#E6C396]/85 hover:shadow-2xl hover:shadow-[#171B20]/40 [animation-delay:300ms] sm:p-7"
          >
            <span aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#D8A871]/25 opacity-80 blur-3xl transition-opacity group-hover:opacity-100" />

            <div className="relative sm:flex-1">
              <CardHead
                no="02"
                tier="ADVANCED"
                name="Full AX 구축"
                diff="지금 회사를 한 단계 위로"
                badge="대표 상품"
                tone="dark"
                visual={<AxVisual />}
                note={
                  <>
                    <b className="font-black text-[#E6C396]">AX</b> = 회사가 일하는 방식을 AI 도입으로 바꾸는 것
                  </>
                }
              >
                {/* AX 상세 첫 화면 제목과 같은 말 — 폰에서는 가운뎃점 뒤(<wbr />)에서만 끊는다 */}
                <h2 className="mt-3 text-[1.2rem] font-black leading-[1.3] tracking-tight sm:mt-4 sm:text-[clamp(1.15rem,2.2vw,1.5rem)]">
                  AX 도입으로
                  <br />
                  <span className="whitespace-nowrap">정책자금·</span>
                  <wbr />
                  <span className="whitespace-nowrap">지원사업·</span>
                  <wbr />
                  <span className="whitespace-nowrap">투자에서</span>
                  <br />
                  <span className="text-[#E6C396]">경쟁력 있는 회사로</span>
                </h2>
              </CardHead>
              {/* 가격 — 범위(MVP · 플랫폼 · 풀 패키지)에 따라 달라서 '부터'로만 적는다 */}
              <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-[1.5rem] font-black leading-none tracking-tight text-white sm:text-[1.75rem]">500만원</span>
                <span className="text-[1.05rem] font-black text-[#E6C396]">부터</span>
                <span className="text-[0.86rem] font-semibold text-slate-400">· 범위는 3분 진단과 상담 뒤에 정해요</span>
              </p>
            </div>

            <span className="shine-cta relative mt-4 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E6C396] to-[#C99257] px-5 text-[1.05rem] font-black text-[#15110C] transition-[filter] group-hover:brightness-110 sm:min-h-[52px]">
              AX 도입 알아보기 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
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

      <LegalFooter tone="dark" />
      <KakaoFloat />
    </div>
  )
}
