// 기술사업·MVP 첫 화면 — 예전 01번 통이미지를 글자로 바꿨다(문구를 바로 고칠 수 있고, 폰에서 글자가 더 선명하다).
// 메시지: 아이디어는 작동하는 웹앱 서비스로 만들어드리고, 회사는 벤처기업으로 만들어드려요.
//   결과물은 '서비스(앱)'가 아니라 '회사의 성장(벤처기업)'이라는 컨설팅 관점 — 개발 외주사처럼 보이지 않게 한다.
// ⚠️ '벤처인증까지'처럼 인증을 약속하는 표현은 쓰지 않는다 → '벤처기업확인 신청까지'.
// ⚠️ 가격·선착순은 서비스 선택 페이지 01 카드와 같은 숫자여야 한다(정상가 500만원 → 런칭 파트너 300만원 · 선착순 5개사).
import { VENTURE_FEE_SHORT } from '../../data/ventureFee'
import Orbit from '../business/VisualOrbit'


export default function VentureMvpHero() {
  return (
    <section data-mvp-hero className="relative overflow-hidden bg-[#171B20] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[#D47A4A]/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[22rem] w-[22rem] rounded-full bg-[#E8B89A]/10 blur-3xl" />

      {/* 첫 화면 높이는 AX 상세와 같게 — 폰은 한 화면을 통째로 써 다음 구간이 보이지 않게,
          태블릿·PC 는 3.5rem 만 덜어 다음 구간이 경계에 살짝 걸치게. 폰은 처음부터 떠 있는 하단 바(약 64px)만큼 아래 여백을 더 둔다 */}
      <div className="relative mx-auto flex min-h-[calc(100svh-53px)] max-w-6xl flex-col justify-center px-5 pb-24 pt-9 sm:min-h-[calc(100svh-53px-3.5rem)] sm:px-6 sm:pb-16 sm:pt-14 lg:grid lg:max-w-7xl lg:grid-cols-[1.05fr_0.95fr] lg:content-center lg:items-center lg:gap-12">
        <div>
          {/* 윗줄 배지·3단계 표시·버튼 두 개·체크 목록·작은 안내문은 뺐다(대표님 방향: 심플하게) — 상담은 머리글·폰 하단 바에서 */}
          <h1 style={{ animationDelay: '0.16s' }} className="hero-anim break-keep text-[1.95rem] font-black leading-[1.24] tracking-tight min-[380px]:text-[2.15rem] sm:text-[2.6rem] lg:text-[3.48rem] xl:text-[3.66rem]">
            {/* 줄은 뜻 단위로 끊는다. 폰·PC(오른쪽에 화면이 있어 폭이 좁다)는 다섯 줄,
                가운데 폭(태블릿)은 첫 두 줄을 합쳐 네 줄:
                '아이디어는 / 작동하는 웹앱 서비스로 / 만들어드리고, / 회사는 벤처기업으로 / 만들어드려요.'
                아주 좁은 폰에서는 '작동하는 웹앱 / 서비스로' 로만 나뉘게 두 덩어리로 묶는다 */}
            아이디어는
            <br className="sm:hidden lg:inline" />{' '}
            <span className="text-[#E8B89A]">
              <span className="whitespace-nowrap">작동하는 웹앱</span> <span className="whitespace-nowrap">서비스로</span>
            </span>
            <br />
            만들어드리고,
            <br />
            회사는 <span className="text-[#E8894F]">벤처기업으로</span>
            <br />
            만들어드려요.
          </h1>

          <p style={{ animationDelay: '0.34s' }} className="hero-anim mt-5 max-w-xl break-keep text-[1.04rem] leading-relaxed text-slate-300 sm:text-[1.15rem] lg:max-w-2xl lg:text-[1.38rem]">
            9년 차 경영컨설턴트가 지금 하는 사업에서 기술사업 아이디어를 찾고, 실제로 써 볼 수 있는 첫 버전(MVP)과{' '}
            <b className="font-bold text-white">벤처기업확인 신청까지 2주 안에</b> 끝냅니다.
          </p>

          {/* 가격 — 서비스 선택 01 카드와 같은 숫자 */}
          {/* 정상가를 작게 흐리게 두면 '원래 300만원' 처럼 읽혀서, 정상가를 크게 두고 붉은 선으로 지운 뒤 할인 금액을 붙인다 */}
          <div data-mvp-price style={{ animationDelay: '0.46s' }} className="hero-anim mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:max-w-2xl lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-baseline gap-2.5">
                <span className="text-[0.95rem] font-bold text-slate-400 lg:text-[1.14rem]">정상가</span>
                <del className="text-[1.6rem] font-black leading-none tabular-nums text-slate-300 decoration-[#FF6B4A] decoration-[3px] sm:text-[1.8rem] lg:text-[2.16rem]">500만원</del>
              </p>
              <span className="rounded-full bg-[#D47A4A] px-3 py-1 text-[0.85rem] font-black text-[#171B20] lg:px-3.5 lg:text-[1.02rem]">선착순 5개사</span>
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[1.1rem] font-black text-white lg:text-[1.32rem]">런칭 파트너 특가</span>
              <span className="text-[2.6rem] font-black leading-none tracking-tight text-[#E8894F] sm:text-[3rem] lg:text-[3.6rem]">300만원</span>
              <span className="rounded-full bg-[#D2462A] px-3 py-1.5 text-[0.9rem] font-black leading-none text-white lg:px-3.5 lg:text-[1.08rem]">200만원 할인</span>
            </p>
            {/* 벤처기업확인은 신청 '준비'까지가 이 금액 — 확인기관에 내는 심사 수수료는 별도라는 걸 가격 바로 아래에 */}
            <p data-mvp-fee-note className="mt-2.5 break-keep text-[0.8rem] leading-snug text-slate-400 lg:text-[0.96rem]">{VENTURE_FEE_SHORT}</p>
          </div>
        </div>

        {/* PC 오른쪽 — 서비스 선택 01 카드와 같은 그림(벤처기업확인서 + 같은 MVP 를 띄운 폰·PC)을 고화질로.
            누르는 곳이 아니다(대표님 요청). 뒤에서 카드와 같은 금색 궤도가 천천히 돌고, 그림은 살짝 떠 있다.
            폰에서는 숨긴다(lazy 라 폰은 그림을 받지도 않는다). 원본: 대표님 그림 1536×1024 → 투명 배경 1513×981 */}
        <figure data-mvp-hero-visual style={{ animationDelay: '0.3s' }} className="hero-anim mt-10 hidden lg:mt-0 lg:block">
          <div className="relative aspect-[10/7] w-full">
            <Orbit tone="dark" shape="wide" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/business/venture-mvp/hero-visual.webp"
                srcSet="/business/venture-mvp/hero-visual-1000.webp 1000w, /business/venture-mvp/hero-visual.webp 1513w"
                sizes="(min-width: 1024px) 540px, 1px"
                width={1513}
                height={981}
                loading="lazy"
                decoding="async"
                draggable={false}
                alt="벤처기업확인서 예시와, 같은 MVP 를 띄운 스마트폰·PC 화면(미래AI랩 자체 데모)"
                className="card-float block w-full select-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
          <figcaption className="mt-2 text-center text-[0.85rem] text-slate-400 lg:text-[1rem]">
            확인서와 화면은 예시예요 · 화면은 미래AI랩이 직접 만든 MVP 데모예요
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
