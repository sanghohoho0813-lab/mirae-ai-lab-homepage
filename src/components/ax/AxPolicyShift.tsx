// SECTION #why-ax — 2026 정책자금 × AX 필요성 요약(축약형).
// 펼쳐보기 없이 기본 노출하되 읽기 부담 없게. "내 주장"이 아니라 2026 심사환경 변화 + 정부 방향성.
// ⚠️ 승인·보장·단정 표현 금지. 금액은 "목표로 준비하는 경우가 많습니다" 수준으로만.
import { POLICY_SUMMARY as P } from '../../data/policyFunding2026'

export default function AxPolicyShift() {
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300 sm:text-sm">{P.eyebrow}</p>
        <h2 className="mt-2.5 max-w-3xl break-keep text-[1.55rem] font-black leading-[1.25] tracking-tight text-white sm:text-[2rem]">
          {P.title}
        </h2>
        <p className="mt-3 max-w-2xl break-keep text-[0.95rem] leading-relaxed text-slate-400">{P.intro}</p>

        {/* 핵심 포인트 3개 */}
        <ul className="mt-6 space-y-2.5">
          {P.points.map((t, i) => (
            <li key={t} className="flex items-start gap-3 break-keep text-[0.98rem] leading-relaxed text-slate-200">
              <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-400/15 text-[0.8rem] font-black text-teal-300">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ul>

        {/* 자금 목표 — 준비 방향(보장 아님) */}
        <div className="mt-7 rounded-2xl border border-teal-400/20 bg-teal-400/[0.06] p-5 sm:p-6">
          <p className="break-keep text-[1.05rem] font-black text-white">{P.fundingTitle}</p>
          <ul className="mt-3 space-y-1.5">
            {P.fundingPoints.map((t) => (
              <li key={t} className="flex items-start gap-2 break-keep text-[0.92rem] leading-snug text-slate-100">
                <span aria-hidden className="mt-0.5 shrink-0 text-teal-300">✓</span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-3 break-keep text-[0.8rem] leading-relaxed text-slate-400">{P.fundingNotice}</p>
        </div>

        {/* 미래AI랩의 역할 한 줄 */}
        <p className="mt-6 break-keep border-l-2 border-teal-400 pl-4 text-[1rem] font-bold leading-snug text-teal-100">
          {P.role}
        </p>
        <p className="mt-4 break-keep text-[0.72rem] leading-relaxed text-slate-500">{P.source}</p>
      </div>
    </section>
  )
}
