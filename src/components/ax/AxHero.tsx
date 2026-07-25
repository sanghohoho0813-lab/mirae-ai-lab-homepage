// SECTION 1 — Hero. 첫 화면에는 '고객 문제 → 대표님이 해야 할 일' 두 문장만 남긴다.
// 나머지 메시지(AX의 시대 · 1억원 이상 목표 · 사업계획서만이 아닙니다 · 최대 2주 · 월 5개사)는
// 2번 섹션에서 AX 화면 예시와 함께 잇는다.
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

        <h1 className="mt-6 break-keep font-black tracking-normal text-[clamp(2.2rem,8.1vw,3.2rem)] leading-[1.28] text-white sm:mt-7 sm:text-[clamp(2.75rem,5.7vw,3.85rem)]">
          정책자금, 계속 거절당한 적 있거나<br />승인되도 금액이 너무 부족하다고 생각된 적 없으신가요?
        </h1>

        <p className="mx-auto mt-6 max-w-2xl break-keep rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 text-[1.05rem] leading-relaxed text-slate-200 backdrop-blur sm:mt-7 sm:px-7 sm:py-5 sm:text-[1.22rem]">
          <span className="font-bold text-white">대표님의 회사를 정부가 원하는 방향으로 바꿔야</span><br />
          <span className="font-black text-amber-300">수 억원의 조달</span>이 이루어질 수 있습니다.
        </p>
      </div>

      {/* 스크롤 유도 */}
      <button
        type="button"
        onClick={onNext}
        aria-label="다음 섹션 보기"
        className="group absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center px-4 py-2 text-slate-300 transition-colors hover:text-white sm:bottom-8"
      >
        <span aria-hidden className="grid h-8 w-8 animate-bounce place-items-center rounded-full border border-white/20 bg-white/5 text-teal-200">↓</span>
      </button>
    </section>
  )
}
