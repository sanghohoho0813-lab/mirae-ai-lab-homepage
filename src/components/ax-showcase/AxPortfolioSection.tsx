// 홈 — 초기 MVP 레퍼런스 10종. "아이디어를 동작하는 서비스로 만든" 보조 그룹.
//
//  - PC: 위 5개 / 아래 5개, 복제 없이 서로 반대 방향으로 좌우 ±10% 범위를 아주 천천히
//    오간다(핑퐁 드리프트). 광고 배너처럼 흘러가 사라지지 않아 충분히 읽을 수 있다.
//    줄에 커서를 올리면 그 줄만 멈춘다. "동작 줄이기" 설정이면 움직이지 않는다.
//  - 모바일: 애니메이션 대신 2열 그리드 — 탐색·가독·터치를 우선한다.
//  - 카드는 가상 브랜드명보다 "무엇을 위한 서비스인지"(청록 라벨)가 먼저 읽히게 한다.
import { PORTFOLIO_SAMPLES, PORTFOLIO_SECTION, type PortfolioSample } from '../../data/portfolioSamples'

const ROW_A = PORTFOLIO_SAMPLES.slice(0, 5)
const ROW_B = PORTFOLIO_SAMPLES.slice(5)

function MvpCard({ s, drift = false }: { s: PortfolioSample; drift?: boolean }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/card flex flex-col overflow-hidden rounded-xl border border-white/12 bg-slate-950 transition-colors hover:border-teal-400/45 sm:rounded-2xl ${
        drift ? 'w-[280px] shrink-0' : ''
      }`}
    >
      <span className="block aspect-[16/10] overflow-hidden bg-slate-800">
        <img
          src={s.imgSm}
          srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
          sizes={drift ? '280px' : '46vw'}
          alt={s.alt}
          width={720}
          height={450}
          // 드리프트는 transform 으로 움직여 lazy 판정이 어긋난다 — 작은 썸네일이라 즉시 로딩한다
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.02]"
        />
      </span>
      <span className="flex flex-1 items-center justify-between gap-2 px-3 py-2.5 sm:px-3.5">
        <span className="min-w-0">
          {/* 무슨 서비스인지가 먼저 — 가상 브랜드명은 보조 */}
          <span className="block truncate text-[1.08rem] font-black leading-snug text-teal-300 sm:text-[1.24rem]">{s.kind}</span>
          <span className="block truncate text-[0.85rem] font-bold text-slate-500 sm:text-[0.92rem]">{s.name}</span>
        </span>
        <span aria-hidden className="shrink-0 text-[0.95rem] font-black text-slate-500 transition-colors group-hover/card:text-teal-300">↗</span>
      </span>
    </a>
  )
}

export default function AxPortfolioSection() {
  return (
    <section id="mvp-refs" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="text-center text-[1.1rem] font-black tracking-tight text-teal-300 sm:text-[1.2rem]">EARLY MVP</p>
          <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.55rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[1.95rem]">
            머릿속에만 있던 아이디어도,<br className="sm:hidden" /> 일단 움직이게 만들어봅니다.
          </h2>
        </div>

        {/* PC — 5 + 5 반대 방향 드리프트 (복제 없음) */}
        <div className="mt-8 hidden space-y-4 overflow-hidden sm:mt-10 sm:block">
          <div className="ax-drift-row overflow-hidden">
            <div className="ax-drift-track ax-drift-a flex w-max gap-4 pl-6">
              {ROW_A.map((s) => (
                <MvpCard key={s.slug} s={s} drift />
              ))}
            </div>
          </div>
          <div className="ax-drift-row overflow-hidden">
            <div className="ax-drift-track ax-drift-b ml-auto flex w-max gap-4 pr-6">
              {ROW_B.map((s) => (
                <MvpCard key={s.slug} s={s} drift />
              ))}
            </div>
          </div>
        </div>

        {/* 모바일 — 2열 그리드, 애니메이션 없음 */}
        <div className="mx-auto mt-7 grid grid-cols-2 gap-3 px-5 sm:hidden">
          {PORTFOLIO_SAMPLES.map((s) => (
            <MvpCard key={s.slug} s={s} />
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl break-keep px-5 text-center text-[1.02rem] leading-relaxed text-slate-500 sm:px-6 sm:text-[1.1rem]">
          {PORTFOLIO_SECTION.note}
        </p>
      </div>
    </section>
  )
}
