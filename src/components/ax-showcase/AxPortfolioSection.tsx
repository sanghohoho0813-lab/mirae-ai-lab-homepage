// 홈 — 초기 MVP 레퍼런스 10종. "아이디어를 동작하는 서비스로 만든" 보조 그룹.
//
//  - 위 5개 / 아래 5개로 고정된 격자. 움직이지 않으므로 천천히 훑어보고 고를 수 있다.
//    (좁은 화면은 2열 → 3열 → 5열로 넓어진다. 대표 샘플 섹션과 같은 격자 규칙.)
//  - 카드는 가상 브랜드명보다 "무엇을 위한 서비스인지"(브랜드 포인트 라벨)가 먼저 읽히게 한다.
import { PORTFOLIO_SAMPLES, PORTFOLIO_SECTION, type PortfolioSample } from '../../data/portfolioSamples'

function MvpCard({ s }: { s: PortfolioSample }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card flex flex-col overflow-hidden rounded-xl border border-white/12 bg-[#171B20] transition-colors hover:border-[#D47A4A]/45 sm:rounded-2xl"
    >
      <span className="block aspect-[16/10] overflow-hidden bg-[#343B44]">
        <img
          src={s.imgSm}
          srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 46vw"
          alt={s.alt}
          width={720}
          height={450}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.02]"
        />
      </span>
      <span className="flex flex-1 items-center justify-between gap-2 px-3 py-2.5 sm:px-3.5">
        <span className="min-w-0">
          {/* 무슨 서비스인지가 먼저 — 가상 브랜드명은 보조 */}
          <span className="block truncate text-[1.08rem] font-black leading-snug text-[#D47A4A] sm:text-[1.24rem]">{s.kind}</span>
          <span className="block truncate text-[0.85rem] font-bold text-slate-500 sm:text-[0.92rem]">{s.name}</span>
        </span>
        <span aria-hidden className="shrink-0 text-[0.95rem] font-black text-[#6B7680] transition-colors group-hover/card:text-[#D47A4A]">↗</span>
      </span>
    </a>
  )
}

export default function AxPortfolioSection() {
  return (
    <section id="mvp-refs" className="scroll-mt-16 border-t border-white/10 bg-[#171B20]">
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="text-center text-[1.1rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.2rem]">EARLY MVP</p>
          <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.55rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[1.95rem]">
            머릿속에만 있던 아이디어도,<br className="sm:hidden" /> 일단 움직이게 만들어봅니다.
          </h2>
        </div>

        {/* 5개씩 2줄 고정 격자 — 대표 샘플 섹션과 같은 규칙 */}
        <div className="mx-auto mt-8 grid max-w-[86rem] grid-cols-2 gap-3 px-5 sm:mt-10 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-5">
          {PORTFOLIO_SAMPLES.map((s) => (
            <MvpCard key={s.slug} s={s} />
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl break-keep px-5 text-center text-[1.02rem] leading-relaxed text-[#6B7680] sm:px-6 sm:text-[1.1rem]">
          {PORTFOLIO_SECTION.note}
        </p>
      </div>
    </section>
  )
}
