// 정책자금 상세페이지 — 심사위원 반문 + A/B 기업 비교표 + 업계 전환 사례 4건 (홈에서 이동).
// ⚠️ 한도·선정은 기관 심사 사항 — 목적·예시로만 말하고 고지를 함께 노출한다.
//    사례는 업계에 공개된 내용을 재구성한 것으로, 자체 실적처럼 보이지 않게 한다.
import { AX_INDUSTRY_CASES, AX_JUDGE } from '../../data/policyAxEvidence2026'

export default function AxJudgeCaseSection() {
  return (
    <section id="judge-compare" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        {/* 심사위원 반문 + 비교표 */}
        <div className="rounded-3xl border border-amber-400/35 bg-gradient-to-b from-amber-400/[0.12] to-transparent p-5 sm:p-10">
          <div className="space-y-1.5">
            {AX_JUDGE.setupLines.map((t) => (
              <p key={t} className="break-keep text-center text-[1.24rem] leading-relaxed text-slate-200 sm:text-[1.36rem]">
                {t}
              </p>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line break-keep text-center text-[1.65rem] font-black leading-[1.4] text-amber-300 sm:text-[2.1rem]">
            {AX_JUDGE.question}
          </p>

          {/* A vs B — 준비 상태의 차이만 비교한다 */}
          <div className="relative mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-2xl border border-white/12 bg-slate-950/60 p-5 sm:p-6">
              <p className="text-[1.1rem] font-black text-slate-400 sm:text-[1.2rem]">{AX_JUDGE.left.label}</p>
              <p className="mt-1 break-keep text-[1.32rem] font-black leading-snug text-slate-200 sm:text-[1.4rem]">{AX_JUDGE.left.tag}</p>
              <ul className="mt-4 space-y-2">
                {AX_JUDGE.left.items.map((t) => (
                  <li key={t} className="flex gap-2 break-keep text-[1.15rem] leading-snug text-slate-400 sm:text-[1.22rem]">
                    <span aria-hidden className="shrink-0 text-slate-600">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 px-3 py-1.5 text-[1.1rem] font-black text-slate-900 shadow-lg sm:block"
            >
              VS
            </span>
            <div className="rounded-2xl border-2 border-teal-400/60 bg-teal-400/[0.08] p-5 shadow-lg shadow-teal-500/10 sm:p-6">
              <p className="text-[1.1rem] font-black text-teal-300 sm:text-[1.2rem]">{AX_JUDGE.right.label}</p>
              <p className="mt-1 break-keep text-[1.32rem] font-black leading-snug text-white sm:text-[1.4rem]">{AX_JUDGE.right.tag}</p>
              <ul className="mt-4 space-y-2">
                {AX_JUDGE.right.items.map((t) => (
                  <li key={t} className="flex gap-2 break-keep text-[1.15rem] font-semibold leading-snug text-slate-100 sm:text-[1.22rem]">
                    <span aria-hidden className="shrink-0 font-black text-teal-400">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line break-keep text-center text-[1.65rem] font-black leading-[1.4] text-white sm:text-[2rem]">
            {AX_JUDGE.conclusion}
          </p>
        </div>

        {/* 업계 전환 사례 — 자체 실적이 아님을 함께 말한다 */}
        <h3 className="mx-auto mt-14 max-w-3xl whitespace-pre-line break-keep text-center text-[1.65rem] font-black leading-[1.4] text-white sm:mt-20 sm:text-[2rem]">
          {AX_INDUSTRY_CASES.title}
        </h3>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.2rem] leading-[1.75] text-slate-300 sm:text-[1.3rem]">
          {AX_INDUSTRY_CASES.intro}
        </p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          {AX_INDUSTRY_CASES.items.map((c) => (
            <div key={c.from} className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 sm:p-6">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 break-keep text-[1.24rem] font-black leading-snug text-white sm:text-[1.32rem]">
                <span aria-hidden className="text-[1.4rem]">{c.icon}</span>
                {c.from} <span aria-hidden className="text-teal-300">→</span> <span className="text-teal-300">{c.to}</span>
              </p>
              <div className="mt-3.5 space-y-1.5">
                <p className="break-keep text-[1.13rem] leading-snug text-slate-400 sm:text-[1.2rem]">Before · {c.before}</p>
                <p className="break-keep text-[1.13rem] font-bold leading-snug text-amber-300 sm:text-[1.2rem]">After · {c.after}</p>
              </div>
              <p className="mt-3 break-keep text-[1.13rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">{c.point}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.05rem] leading-relaxed text-slate-500 sm:text-[1.1rem]">
          {AX_INDUSTRY_CASES.disclaimer}
        </p>
      </div>
    </section>
  )
}
