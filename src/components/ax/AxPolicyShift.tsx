// SECTION #why-ax — 정책자금 심사환경 변화(축약). 기관 소개로 시작하지 않고 심사환경부터. 핵심 카드 3개만.
// ⚠️ 승인·보장·단정 표현 금지.
import { POLICY_SUMMARY as P } from '../../data/policyFunding2026'

export default function AxPolicyShift({ onDetail }: { onDetail?: () => void }) {
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300 sm:text-sm">{P.eyebrow}</p>
        <h2 className="mt-2.5 max-w-3xl break-keep text-[1.6rem] font-black leading-[1.22] tracking-tight text-white sm:text-[2.1rem]">
          {P.title}
        </h2>
        <p className="mt-3 max-w-2xl break-keep text-[1rem] leading-relaxed text-slate-300">{P.subtitle}</p>

        {/* 핵심 카드 3개 */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {P.cards.map((c, i) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <span aria-hidden className="text-[0.8rem] font-black text-teal-300">0{i + 1}</span>
              <p className="mt-1.5 break-keep text-[1.02rem] font-black leading-snug text-white">{c.title}</p>
              <p className="mt-2 break-keep text-[0.88rem] leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>

        {/* 연결 문구 */}
        <p className="mt-6 break-keep border-l-2 border-teal-400 pl-4 text-[1rem] font-bold leading-relaxed text-teal-100 sm:text-[1.05rem]">
          {P.connect}
        </p>

        {/* 작은 출처 + 상세 링크 */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="break-keep text-[0.72rem] leading-relaxed text-slate-500">출처 · {P.source}</p>
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
