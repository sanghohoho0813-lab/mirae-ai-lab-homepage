// SECTION 1 — Hero. 첫 화면에는 '고객 문제 → AX의 시대 → 1억원 이상 목표' 세 문장만 남긴다.
// 나머지 약속(사업계획서만이 아닙니다 · 최대 2주 · 월 5개사)은 2번 섹션에서 AX 화면과 함께 잇는다.
// 목적: 첫 화면은 설명이 아니라 '무엇을 만들어 준다는 거지?'라는 궁금증만 남기는 것.
export default function AxHero({ onNext }: { onNext: () => void }) {
  return (
    <section className="relative flex min-h-[calc(100svh-57px)] items-center overflow-hidden bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_75%_at_50%_-8%,rgba(56,189,248,0.20),transparent_62%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-4 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-slate-950" />

      <div className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-14 text-center sm:px-6 sm:pb-28 sm:pt-16 lg:max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.82rem] font-bold text-teal-200 backdrop-blur">
          정책자금 × AX 혁신전환
        </span>

        <h1 className="mt-6 break-keep font-black tracking-tight text-[clamp(2rem,7.4vw,2.9rem)] leading-[1.18] text-white sm:mt-7 sm:text-[clamp(2.5rem,5.2vw,3.5rem)]">
          정책자금, 계속 거절당하거나<br />몇천만원 수준에서 그치셨나요?
        </h1>

        <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.05rem] font-bold leading-relaxed text-teal-200 sm:mt-7 sm:text-[1.28rem]">
          이제는 디지털 전환을 넘어 AI 전환, <span className="text-amber-300">AX의 시대</span>입니다.
        </p>

        <p className="mx-auto mt-5 max-w-2xl break-keep rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 text-[1.05rem] leading-relaxed text-slate-200 backdrop-blur sm:mt-6 sm:px-7 sm:py-5 sm:text-[1.22rem]">
          <span className="font-black text-amber-300">1억원 이상 정책자금</span>을 목표로, 자금을 받을 이유가 보이는 <span className="font-bold text-white">AX 혁신기업 구조</span>를 만듭니다.
        </p>
      </div>

      {/* 스크롤 유도 — 다음 화면에서 무엇을 보게 되는지만 알려준다 */}
      <button
        type="button"
        onClick={onNext}
        className="group absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-1.5 px-4 py-2 text-[0.9rem] font-bold text-slate-300 transition-colors hover:text-white sm:bottom-8"
      >
        그래서 무엇을 만들어 드리냐면
        <span aria-hidden className="grid h-8 w-8 animate-bounce place-items-center rounded-full border border-white/20 bg-white/5 text-teal-200">↓</span>
      </button>
    </section>
  )
}
