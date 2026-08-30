// 홈 — 초기 MVP 레퍼런스 10종이 위·아래 두 줄로 서로 반대 방향으로 흐르는 마퀴.
// 대표 포트폴리오(AX+플랫폼) 다음에 붙는 보조 그룹: 업종·아이디어의 폭을 빠르게 훑게 한다.
//
//  - 카드를 작게, 두 줄로 나눠 10개가 한 화면에서 거의 다 보인다.
//  - 움직임은 CSS 애니메이션(목록 두 벌 + translateX -50%)이라 끊김이 없다.
//  - 줄에 마우스를 올리면 그 줄만 잠시 멈춰 클릭하기 쉽다. "동작 줄이기" 설정이면 움직이지 않는다.
import { PORTFOLIO_SAMPLES, PORTFOLIO_SECTION, type PortfolioSample } from '../../data/portfolioSamples'

const ROW_A = PORTFOLIO_SAMPLES.slice(0, 5)
const ROW_B = PORTFOLIO_SAMPLES.slice(5)

function MarqueeRow({ items, reverse = false }: { items: PortfolioSample[]; reverse?: boolean }) {
  // 이음매 없는 순환을 위해 목록을 두 벌 렌더링한다
  const loop = [...items, ...items]
  return (
    <div className="ax-marquee-row overflow-hidden">
      <div className={`ax-marquee-track flex w-max gap-3 sm:gap-4 ${reverse ? 'ax-marquee-reverse' : ''}`}>
        {loop.map((s, i) => (
          <a
            key={`${s.slug}-${i}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={i >= items.length || undefined}
            tabIndex={i >= items.length ? -1 : undefined}
            className="group/card w-[46vw] max-w-[210px] shrink-0 overflow-hidden rounded-xl border border-white/12 bg-slate-950 transition-colors hover:border-teal-400/45 sm:w-[280px] sm:max-w-none sm:rounded-2xl"
          >
            <span className="block aspect-[16/10] overflow-hidden bg-slate-800">
              <img
                src={s.imgSm}
                srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
                sizes="(min-width:640px) 280px, 46vw"
                alt={s.alt}
                width={720}
                height={450}
                // 마퀴는 transform 으로 움직여 lazy 판정이 어긋난다 — 작은 썸네일이라 즉시 로딩한다
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.02]"
              />
            </span>
            <span className="flex items-baseline justify-between gap-2 px-3 py-2.5 sm:px-3.5">
              <span className="min-w-0">
                <span className="block truncate text-[1.0rem] font-black leading-tight text-white sm:text-[1.1rem]">{s.name}</span>
                <span className="block truncate text-[0.88rem] font-bold text-teal-300 sm:text-[0.96rem]">{s.kind}</span>
              </span>
              <span aria-hidden className="shrink-0 text-[0.95rem] font-black text-slate-500 transition-colors group-hover/card:text-teal-300">↗</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function AxPortfolioSection() {
  return (
    <section id="mvp-refs" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="text-center text-[1.1rem] font-black tracking-tight text-teal-300 sm:text-[1.2rem]">EARLY MVP REFERENCES</p>
          <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.55rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[1.95rem]">
            아이디어가 무엇이든, 동작하는 화면으로 만들어 드립니다.
          </h2>
        </div>
        <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
          <MarqueeRow items={ROW_A} />
          <MarqueeRow items={ROW_B} reverse />
        </div>
        <p className="mx-auto mt-6 max-w-2xl break-keep px-5 text-center text-[1.02rem] leading-relaxed text-slate-500 sm:px-6 sm:text-[1.1rem]">
          {PORTFOLIO_SECTION.note}
        </p>
      </div>
    </section>
  )
}
