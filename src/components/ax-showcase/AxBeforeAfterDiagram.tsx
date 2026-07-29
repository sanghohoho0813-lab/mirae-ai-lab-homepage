// 기존 방식 → AX 적용 시각도. 카드·아이콘·배지를 남발하지 않고 한 눈에 대비만 보여준다.
import { AX_BEFORE_AFTER } from '../../data/policyAxEvidence2026'

export default function AxBeforeAfterDiagram() {
  const { before, after, phone } = AX_BEFORE_AFTER
  return (
    <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
      {/* Before */}
      <p className="text-[1.03rem] font-black tracking-tight text-slate-500">{before.label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {before.items.map((t) => (
          <span key={t} className="rounded-lg bg-white/5 px-3 py-1.5 text-[1.13rem] font-semibold text-slate-400 ring-1 ring-inset ring-white/10">
            {t}
          </span>
        ))}
      </div>

      <p aria-hidden className="my-3 text-center text-[1.38rem] leading-none text-teal-400">↓</p>

      {/* After */}
      <p className="text-[1.03rem] font-black tracking-tight text-teal-300">{after.label}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {after.items.map((t) => (
          <span key={t} className="rounded-lg bg-teal-400/15 px-3 py-1.5 text-[1.13rem] font-bold text-teal-100 ring-1 ring-inset ring-teal-400/25">
            {t}
          </span>
        ))}
        <span className="break-keep text-[1.13rem] font-bold text-white">{after.note}</span>
      </div>

      {/* 휴대폰 한 화면 */}
      <div className="mt-4 flex justify-center">
        <div className="w-full max-w-[196px] rounded-[1.6rem] border border-white/15 bg-slate-950 p-2.5 shadow-xl shadow-slate-950/50">
          <p className="text-center text-[1.0rem] font-bold text-slate-500">우리 회사 한 화면</p>
          <ul className="mt-2 space-y-1.5">
            {phone.map((t) => (
              <li key={t} className="flex items-center justify-between rounded-lg bg-white/[0.06] px-2.5 py-2">
                <span className="text-[1.09rem] font-bold text-slate-200">{t}</span>
                <span aria-hidden className="text-[1.03rem] text-teal-300">›</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-2.5 text-center text-[1.01rem] leading-relaxed text-slate-500">
        화면 구성은 이해를 돕기 위한 예시입니다.
      </p>
    </div>
  )
}
