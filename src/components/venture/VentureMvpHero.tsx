// 기술사업·MVP 첫 화면 — 예전 01번 통이미지를 글자로 바꿨다(문구를 바로 고칠 수 있고, 폰에서 글자가 더 선명하다).
// 메시지: 아이디어는 작동하는 서비스로 만들어드리고, 회사는 벤처기업으로 만들어드려요.
//   결과물은 '서비스(앱)'가 아니라 '회사의 성장(벤처기업)'이라는 컨설팅 관점 — 개발 외주사처럼 보이지 않게 한다.
// ⚠️ '벤처인증까지'처럼 인증을 약속하는 표현은 쓰지 않는다 → '벤처기업확인 신청까지'.
// ⚠️ 가격·선착순은 서비스 선택 페이지 01 카드와 같은 숫자여야 한다(정상가 500만원 → 런칭 파트너 300만원 · 선착순 5개사).
import { PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'

const STEPS = ['기술사업 아이디어', '작동하는 MVP', '벤처기업확인 신청'] as const
const CHECKS = ['아이디어가 없어도 OK — 지금 사업에서 찾아 드려요', '경영컨설턴트 1:1 설계', '벤처기업확인 신청까지'] as const

export default function VentureMvpHero({ onConsult }: { onConsult: () => void }) {
  // PC 오른쪽 — 실제로 눌러 볼 수 있는 자체 데모 한 장(광고처럼 '화면'이 먼저 보이게)
  const demo = PORTFOLIO_SAMPLES.find((s) => s.slug === 'pawbeauty')

  return (
    <section data-mvp-hero className="relative overflow-hidden bg-[#171B20] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[#D47A4A]/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[22rem] w-[22rem] rounded-full bg-[#E8B89A]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-9 sm:px-6 sm:pb-16 sm:pt-14 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D47A4A]/40 bg-white/[0.04] px-3.5 py-1.5 text-[0.9rem] font-bold text-[#E8B89A] sm:text-[0.95rem]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#D47A4A]" />
            경영컨설턴트가 설계하는 2주 기술사업 빌드
          </p>

          <h1 className="mt-5 break-keep text-[1.95rem] font-black leading-[1.24] tracking-tight min-[380px]:text-[2.15rem] sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.05rem]">
            {/* 줄은 뜻 단위로 끊는다. 폰·PC(오른쪽에 화면이 있어 폭이 좁다)는 다섯 줄,
                가운데 폭(태블릿)은 첫 두 줄을 합쳐 네 줄:
                '아이디어는 / 작동하는 서비스로 / 만들어드리고, / 회사는 벤처기업으로 / 만들어드려요.' */}
            아이디어는
            <br className="sm:hidden lg:inline" /> <span className="text-[#E8B89A]">작동하는 서비스로</span>
            <br />
            만들어드리고,
            <br />
            회사는 <span className="text-[#E8894F]">벤처기업으로</span>
            <br />
            만들어드려요.
          </h1>

          <p className="mt-5 max-w-xl break-keep text-[1.04rem] leading-relaxed text-slate-300 sm:text-[1.15rem]">
            9년 차 경영컨설턴트가 지금 하는 사업에서 기술사업 아이디어를 찾고, 실제로 써 볼 수 있는 첫 버전(MVP)과{' '}
            <b className="font-bold text-white">벤처기업확인 신청까지 2주 안에</b> 끝냅니다.
          </p>

          {/* 세 단계 — 한눈에 무엇이 남는지 */}
          <ol className="mt-6 flex flex-wrap items-center gap-1.5" aria-label="진행 순서">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden className="text-[0.85rem] text-slate-500">
                    →
                  </span>
                )}
                <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[0.88rem] font-bold text-slate-100 ring-1 ring-inset ring-white/15">
                  <span className="mr-1 text-[#E8B89A]">{i + 1}</span>
                  {s}
                </span>
              </li>
            ))}
          </ol>

          {/* 가격 — 서비스 선택 01 카드와 같은 숫자 */}
          <div data-mvp-price className="mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[1rem] font-bold text-slate-400 line-through decoration-[#D47A4A] decoration-2">정상가 500만원</span>
              <span className="rounded-full bg-[#D47A4A] px-3 py-1 text-[0.85rem] font-black text-[#171B20]">선착순 5개사</span>
            </div>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[1.1rem] font-black text-white">런칭 파트너</span>
              <span className="text-[2.6rem] font-black leading-none tracking-tight text-[#E8894F] sm:text-[3rem]">300만원</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onConsult}
            data-mvp-hero-cta
            className="shine-cta mt-5 flex min-h-14 w-full max-w-xl items-center justify-center gap-2 rounded-2xl bg-[#D47A4A] px-6 text-[1.15rem] font-black text-[#171B20] shadow-xl shadow-[#D47A4A]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] motion-reduce:hover:translate-y-0 sm:text-[1.25rem]"
          >
            무료로 상담받기 <span aria-hidden>→</span>
          </button>

          <ul className="mt-4 grid max-w-xl gap-1.5 text-[0.95rem] text-slate-300">
            {CHECKS.map((c) => (
              <li key={c} className="flex items-start gap-2 break-keep">
                <span aria-hidden className="font-black text-[#E8B89A]">
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>

          <p className="mt-4 max-w-xl break-keep text-[0.8rem] leading-relaxed text-slate-500">
            2주는 자료 준비와 결정이 원활할 때의 목표 일정이에요. 벤처기업확인 여부는 확인기관 심사로 정해집니다.
          </p>
        </div>

        {/* PC 오른쪽 — 실제로 눌러 볼 수 있는 자체 데모 화면 한 장 */}
        {demo && (
          <figure className="mt-10 hidden lg:mt-0 lg:block">
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
