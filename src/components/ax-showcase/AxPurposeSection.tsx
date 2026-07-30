// 홈 2번 화면 — 히어로 다음에 AX가 무엇을 위한 것인지 네 가지 목적으로 가볍게 짚는다.
// 여기서는 정의만 짧게. 자세한 설명(쉬운 말·정책근거)은 아래 "AX, 쉽게 설명하면" 섹션에서 다룬다.
// ⚠️ 한도·선정 결과는 기관 심사 사항이므로 목적으로만 쓰고 고지를 함께 노출한다.
import { AX_PURPOSE } from '../../data/policyAxEvidence2026'

export default function AxPurposeSection({ onNext }: { onNext?: () => void }) {
  return (
    <section id="ax-purpose" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.16rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">{AX_PURPOSE.eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          {AX_PURPOSE.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.24rem] leading-[1.75] text-slate-300 sm:text-[1.36rem]">
          {AX_PURPOSE.lead}
        </p>

        {/* 목적 네 가지 — 순서대로 읽히도록 번호를 붙인다 */}
        <ol className="mx-auto mt-9 grid max-w-3xl gap-2.5 sm:mt-11 sm:grid-cols-2">
          {AX_PURPOSE.goals.map((g, i) => (
            <li
              key={g.title}
              className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.05] p-4 sm:p-5"
            >
              <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-400/15 text-[1.43rem] sm:text-[1.5rem]">
                {g.icon}
              </span>
              <span className="min-w-0">
                <span className="flex items-baseline gap-1.5">
                  <span aria-hidden className="text-[1.04rem] font-black text-teal-300 sm:text-[1.1rem]">0{i + 1}</span>
                  <span className="break-keep text-[1.32rem] font-black leading-snug text-white sm:text-[1.4rem]">{g.title}</span>
                </span>
                <span className="mt-1.5 block break-keep text-[1.17rem] leading-relaxed text-slate-300 sm:text-[1.24rem]">{g.desc}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-6 max-w-2xl break-keep text-center text-[1.1rem] leading-relaxed text-slate-500 sm:text-[1.17rem]">
          {AX_PURPOSE.note}
        </p>

        {onNext && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onNext}
              className="flex min-h-[54px] w-full items-center justify-center gap-2 break-keep rounded-xl border border-white/20 bg-white/5 px-6 text-center text-[1.24rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto sm:text-[1.3rem]"
            >
              어떤 프로그램을 만들어 드리는지 보기 <span aria-hidden>↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
