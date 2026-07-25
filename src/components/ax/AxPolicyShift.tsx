// SECTION #why-ax — "DX를 넘어 AX" 정책 스토리 블록(하나의 연속된 흐름).
// 정부가 보는 성장방향 → 일반기업은 업종을 바꿀 수 없음 → 기존 업무에 AI를 도입하는 AX 전환은 가능.
// ⚠️ 자동 우대·승인 단정 금지. AX 혁신기업은 정부인증 명칭이 아님을 명시.
import { POLICY_SUMMARY as P } from '../../data/policyFunding2026'

export default function AxPolicyShift({ onDetail }: { onDetail?: () => void }) {
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-[0.82rem] font-black uppercase tracking-[0.2em] text-teal-300 sm:text-sm">{P.eyebrow}</p>
        <h2 className="mt-2.5 max-w-3xl break-keep text-[1.6rem] font-black leading-[1.22] tracking-tight text-white sm:text-[2.1rem]">
          {P.title}
        </h2>
        <p className="mt-3 max-w-2xl break-keep text-[1rem] leading-relaxed text-slate-300">{P.subtitle}</p>

        {/* 현실 → 해결 (연속 흐름) */}
        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="break-keep text-[1.05rem] font-black leading-snug text-white">{P.reality.title}</p>
            <p className="mt-2.5 break-keep text-[0.9rem] leading-relaxed text-slate-400">{P.reality.body}</p>
          </div>
          <div className="rounded-2xl border-2 border-teal-400/30 bg-teal-400/[0.06] p-5">
            <p className="break-keep text-[1.05rem] font-black leading-snug text-white">{P.solution.title}</p>
            <p className="mt-2.5 break-keep text-[0.9rem] leading-relaxed text-slate-200">{P.solution.body}</p>
          </div>
        </div>

        {/* AX 혁신전환 핵심 문장 */}
        <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] p-5 sm:p-6">
          <span className="inline-block rounded-md bg-amber-400/15 px-2 py-0.5 text-[0.78rem] font-black uppercase tracking-wider text-amber-300">AX 혁신전환</span>
          <p className="mt-2.5 break-keep text-[1.15rem] font-black leading-snug text-white sm:text-[1.3rem]">
            자금을 신청하는 회사에서, <span className="text-amber-300">자금을 받을 이유가 보이는 AX 혁신기업</span>으로.
          </p>
          <p className="mt-2.5 break-keep text-[0.82rem] leading-relaxed text-slate-400">{P.concept.disclaimer}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="break-keep text-[0.82rem] leading-relaxed text-slate-500">출처 · {P.source}</p>
          {onDetail && (
            <button type="button" onClick={onDetail} className="text-[0.82rem] font-bold text-teal-300 underline underline-offset-4 hover:text-teal-200">
              2026 정책근거 자세히 보기 →
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
