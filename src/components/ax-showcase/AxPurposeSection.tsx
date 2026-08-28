// 홈 3번 섹션 — 레퍼런스 다음에 "AX가 무엇이고 왜 필요한가"를 한 흐름으로 설득한다.
// 순서: ① AX 정의(약자) → ② 왜 AX 웹·앱인가(정부 방향) → ③ 도입 효과 4가지
//      → ④ 심사위원 반문 + A/B 기업 비교표 → "선택이 아니라 필수" → ⑤ 업계 전환 사례
// ⚠️ 한도·선정은 기관 심사 사항 — 목적·예시로만 말하고 고지를 함께 노출한다.
//    사례는 업계에 공개된 내용을 재구성한 것으로, 자체 실적처럼 보이지 않게 한다.
import { Link } from 'react-router-dom'
import { AX_INDUSTRY_CASES, AX_JUDGE, AX_PURPOSE } from '../../data/policyAxEvidence2026'

export default function AxPurposeSection() {
  return (
    <section id="ax-purpose" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        {/* ① AX 정의 */}
        <p className="text-center text-[1.16rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">{AX_PURPOSE.def.eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-3xl whitespace-pre-line break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          {AX_PURPOSE.def.title}
        </h2>
        {AX_PURPOSE.def.lines.map((t) => (
          <p key={t} className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.24rem] leading-[1.75] text-slate-300 sm:text-[1.36rem]">
            {t}
          </p>
        ))}

        {/* ② 왜 AX 웹·앱인가 — 정부가 밀어주는 방향 */}
        <h3 className="mx-auto mt-14 max-w-3xl whitespace-pre-line break-keep text-center text-[1.65rem] font-black leading-[1.4] text-white sm:mt-20 sm:text-[2rem]">
          {AX_PURPOSE.why.title}
        </h3>
        <div className="mx-auto mt-6 max-w-2xl space-y-3">
          {AX_PURPOSE.why.lines.map((t, i) => (
            <p
              key={t}
              className={`break-keep text-center text-[1.24rem] leading-[1.75] sm:text-[1.36rem] ${
                i === AX_PURPOSE.why.lines.length - 1 ? 'font-bold text-teal-200' : 'text-slate-300'
              }`}
            >
              {t}
            </p>
          ))}
        </div>

        {/* ③ 도입 효과 — 정책자금·지원사업 먼저, 운영·매출은 덤이 아니라 본질 */}
        <p className="mx-auto mt-10 max-w-2xl break-keep text-center text-[1.2rem] font-bold leading-relaxed text-slate-200 sm:text-[1.3rem]">
          {AX_PURPOSE.goalsHead}
        </p>
        <ol className="mx-auto mt-6 grid max-w-3xl gap-2.5 sm:grid-cols-2">
          {AX_PURPOSE.goals.map((g, i) => (
            <li key={g.title} className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.05] p-4 sm:p-5">
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
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.1rem] leading-relaxed text-slate-500 sm:text-[1.17rem]">
          {AX_PURPOSE.note}
        </p>

        {/* ④ 심사위원 반문 + 비교표 */}
        <div className="mt-14 rounded-3xl border border-amber-400/35 bg-gradient-to-b from-amber-400/[0.12] to-transparent p-5 sm:mt-20 sm:p-10">
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

        {/* ⑤ 업계 전환 사례 — 자체 실적이 아님을 함께 말한다 */}
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

        {/* 실제로 무엇을 만들어 드리는지는 상세페이지에서 화면까지 함께 본다 */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/business-services/funding-consulting"
            className="flex min-h-[54px] w-full items-center justify-center gap-2 break-keep rounded-xl border border-white/20 bg-white/5 px-6 text-center text-[1.24rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto sm:text-[1.3rem]"
          >
            어떤 프로그램을 만들어 드리는지 보기 <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
