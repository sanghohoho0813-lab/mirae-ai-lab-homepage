// 기술사업·MVP 첫 화면 — 예전 01번 통이미지를 글자로 바꿨다(문구를 바로 고칠 수 있고, 폰에서 글자가 더 선명하다).
// 메시지: 아이디어는 작동하는 웹앱 서비스로 만들어드리고, 회사는 벤처기업으로 만들어드려요.
//   결과물은 '서비스(앱)'가 아니라 '회사의 성장(벤처기업)'이라는 컨설팅 관점 — 개발 외주사처럼 보이지 않게 한다.
// ⚠️ '벤처인증까지'처럼 인증을 약속하는 표현은 쓰지 않는다 → '벤처기업확인 신청까지'.
// ⚠️ 가격·선착순은 서비스 선택 페이지 01 카드와 같은 숫자여야 한다(정상가 500만원 → 런칭 파트너 300만원 · 선착순 5개사).
import { PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'
import { VENTURE_FEE_SHORT } from '../../data/ventureFee'


export default function VentureMvpHero() {
  // PC 오른쪽 — 실제로 눌러 볼 수 있는 자체 데모 한 장(광고처럼 '화면'이 먼저 보이게)
  const demo = PORTFOLIO_SAMPLES.find((s) => s.slug === 'pawbeauty')

  return (
    <section data-mvp-hero className="relative overflow-hidden bg-[#171B20] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[#D47A4A]/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[22rem] w-[22rem] rounded-full bg-[#E8B89A]/10 blur-3xl" />

      {/* 첫 화면 높이는 AX 상세와 같게 — 폰은 한 화면을 통째로 써 다음 구간이 보이지 않게,
          태블릿·PC 는 3.5rem 만 덜어 다음 구간이 경계에 살짝 걸치게. 폰은 처음부터 떠 있는 하단 바(약 64px)만큼 아래 여백을 더 둔다 */}
      <div className="relative mx-auto flex min-h-[calc(100svh-53px)] max-w-6xl flex-col justify-center px-5 pb-24 pt-9 sm:min-h-[calc(100svh-53px-3.5rem)] sm:px-6 sm:pb-16 sm:pt-14 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:content-center lg:items-center lg:gap-12">
        <div>
          {/* 윗줄 배지·3단계 표시·버튼 두 개·체크 목록·작은 안내문은 뺐다(대표님 방향: 심플하게) — 상담은 머리글·폰 하단 바에서 */}
          <h1 style={{ animationDelay: '0.16s' }} className="hero-anim break-keep text-[1.95rem] font-black leading-[1.24] tracking-tight min-[380px]:text-[2.15rem] sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.05rem]">
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

          <p style={{ animationDelay: '0.34s' }} className="hero-anim mt-5 max-w-xl break-keep text-[1.04rem] leading-relaxed text-slate-300 sm:text-[1.15rem]">
            9년 차 경영컨설턴트가 지금 하는 사업에서 기술사업 아이디어를 찾고, 실제로 써 볼 수 있는 첫 버전(MVP)과{' '}
            <b className="font-bold text-white">벤처기업확인 신청까지 2주 안에</b> 끝냅니다.
          </p>

          {/* 가격 — 서비스 선택 01 카드와 같은 숫자 */}
          {/* 정상가를 작게 흐리게 두면 '원래 300만원' 처럼 읽혀서, 정상가를 크게 두고 붉은 선으로 지운 뒤 할인 금액을 붙인다 */}
          <div data-mvp-price style={{ animationDelay: '0.46s' }} className="hero-anim mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-baseline gap-2.5">
                <span className="text-[0.95rem] font-bold text-slate-400">정상가</span>
                <del className="text-[1.6rem] font-black leading-none tabular-nums text-slate-300 decoration-[#FF6B4A] decoration-[3px] sm:text-[1.8rem]">500만원</del>
              </p>
              <span className="rounded-full bg-[#D47A4A] px-3 py-1 text-[0.85rem] font-black text-[#171B20]">선착순 5개사</span>
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[1.1rem] font-black text-white">런칭 파트너 특가</span>
              <span className="text-[2.6rem] font-black leading-none tracking-tight text-[#E8894F] sm:text-[3rem]">300만원</span>
              <span className="rounded-full bg-[#FF6B4A] px-3 py-1.5 text-[0.9rem] font-black leading-none text-white">200만원 할인</span>
            </p>
            {/* 벤처기업확인은 신청 '준비'까지가 이 금액 — 확인기관에 내는 심사 수수료는 별도라는 걸 가격 바로 아래에 */}
            <p data-mvp-fee-note className="mt-2.5 break-keep text-[0.8rem] leading-snug text-slate-400">{VENTURE_FEE_SHORT}</p>
          </div>
        </div>

        {/* PC 오른쪽 — 실제로 눌러 볼 수 있는 자체 데모 화면 한 장 */}
        {demo && (
          <figure style={{ animationDelay: '0.3s' }} className="hero-anim mt-10 hidden lg:mt-0 lg:block">
            {/* 화면을 눌러도 데모가 열린다. 키보드는 아래 '직접 눌러 보기' 링크 하나로 충분해 여기선 탭 순서에서 뺀다 */}
            <a
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              aria-hidden
              data-mvp-hero-demo
              className="block overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/50 transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
            >
              <div aria-hidden className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[0.72rem] text-slate-400">{demo.name}</span>
              </div>
              <img src={demo.imgSm} alt={demo.alt} width={720} height={450} className="block h-auto w-full" />
            </a>
            <figcaption className="mt-3 text-center text-[0.85rem] text-slate-400">
              미래AI랩이 직접 만든 MVP 예시 · {demo.name}{' '}
              <a
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-bold text-[#E8B89A] underline decoration-[#E8B89A]/40 underline-offset-4 hover:text-white"
              >
                직접 눌러 보기 ↗
              </a>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}
