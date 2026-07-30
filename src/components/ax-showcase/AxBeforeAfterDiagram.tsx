// 기존 방식 → AX 적용 시각도.
// "하나로 연결"이 곧 "고객이 회사 내부를 다 본다"로 읽히지 않도록,
// 역할별로 보이는 화면이 다르다는 것을 같은 자리에서 함께 말한다.
import { AX_BEFORE_AFTER } from '../../data/policyAxEvidence2026'

export default function AxBeforeAfterDiagram() {
  const { before, after, phone, extend, privacy } = AX_BEFORE_AFTER

  return (
    <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-5 sm:p-6">
      {/* Before */}
      <p className="text-center text-[1.05rem] font-black tracking-tight text-slate-500">{before.label}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {before.items.map((t) => (
          <span key={t} className="rounded-lg bg-white/5 px-3 py-2 text-[1.08rem] font-semibold text-slate-400 ring-1 ring-inset ring-white/10">
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center text-[1.02rem] leading-relaxed text-slate-500">여기저기 흩어져 있던 일</p>

      <p aria-hidden className="my-5 text-center text-[1.5rem] leading-none text-teal-400">↓</p>

      {/* After — 역할별로 보는 화면이 다르다 */}
      <p className="text-center text-[1.05rem] font-black tracking-tight text-teal-300">{after.label}</p>
      <p className="mx-auto mt-2 max-w-xs break-keep text-center text-[1.12rem] font-bold leading-snug text-white">
        {after.note}
      </p>

      <ul className="mt-4 space-y-2">
        {after.roles.map((r) => (
          <li
            key={r.who}
            className={`flex items-start gap-3 rounded-xl p-3 ring-1 ring-inset ${
              r.tone === 'blue' ? 'bg-blue-400/10 ring-blue-400/25' : 'bg-teal-400/10 ring-teal-400/25'
            }`}
          >
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 text-[1.02rem] font-black ${
                r.tone === 'blue' ? 'bg-blue-400 text-slate-900' : 'bg-teal-400 text-slate-900'
              }`}
            >
              {r.who}
            </span>
            <span className="min-w-0 break-keep text-[1.06rem] leading-snug text-slate-200">{r.sees}</span>
          </li>
        ))}
      </ul>

      {/* 대표가 보는 화면 예시 */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[200px] rounded-[1.6rem] border border-white/15 bg-slate-950 p-3 shadow-xl shadow-slate-950/50">
          <p className="text-center text-[1.0rem] font-bold text-slate-500">대표님 화면</p>
          <ul className="mt-2.5 space-y-1.5">
            {phone.map((t) => (
              <li key={t} className="flex items-center justify-between rounded-lg bg-white/[0.06] px-3 py-2">
                <span className="text-[1.08rem] font-bold text-slate-200">{t}</span>
                <span aria-hidden className="text-[1.03rem] text-teal-300">›</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-sm break-keep text-center text-[1.08rem] font-bold leading-relaxed text-teal-100">
        {extend}
      </p>
      <p className="mx-auto mt-3 max-w-sm break-keep text-center text-[1.02rem] leading-relaxed text-slate-500">
        {privacy}
      </p>
    </div>
  )
}
