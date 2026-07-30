// 업무별 보기 — 업무를 고르면 관련성 높은 3~5개 업종만 보여준다(전 업종 나열 금지).
import { AX_V2_TASK_VIEWS, AX_V2_INDUSTRIES } from '../../data/axIndustryShowcaseV2'

export default function AxTaskSelector({
  value,
  onChange,
  onPickIndustry,
}: {
  value: string
  onChange: (key: string) => void
  onPickIndustry: (slug: string) => void
}) {
  const active = AX_V2_TASK_VIEWS.find((t) => t.key === value) ?? AX_V2_TASK_VIEWS[0]
  const related = active.slugs
    .map((s) => AX_V2_INDUSTRIES.find((i) => i.slug === s))
    .filter((i): i is (typeof AX_V2_INDUSTRIES)[number] => Boolean(i))

  return (
    <div>
      <div role="tablist" aria-label="업무 선택" className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {AX_V2_TASK_VIEWS.map((t) => {
          const on = t.key === active.key
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(t.key)}
              className={`flex min-h-[48px] items-center justify-center gap-1.5 break-keep rounded-xl px-2 py-2 text-center text-[1.11rem] sm:text-[1.313rem] font-bold leading-tight transition-all ${
                on ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span aria-hidden className="text-[1.26rem] sm:text-[1.495rem] leading-none">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-4 break-keep text-[1.24rem] font-bold leading-relaxed text-teal-200 sm:text-[1.573rem]">{active.desc}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((ind) => (
          <button
            key={ind.slug}
            type="button"
            onClick={() => onPickIndustry(ind.slug)}
            className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-3.5 text-left transition-colors hover:border-teal-400/40 hover:bg-white/[0.08]"
          >
            <span aria-hidden className="text-[1.54rem] sm:text-[1.82rem] leading-none">{ind.icon}</span>
            <span className="min-w-0">
              <span className="block text-[1.2rem] sm:text-[1.417rem] font-black text-white">{ind.displayName}</span>
              <span className="mt-0.5 block break-keep text-[1.1rem] sm:text-[1.3rem] leading-snug text-slate-400">{ind.shortHook}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2.5 text-[1.1rem] sm:text-[1.3rem] text-slate-500">이 업무와 연관성이 높은 업종만 보여드립니다. 눌러서 해당 업종 화면을 확인하세요.</p>
    </div>
  )
}
