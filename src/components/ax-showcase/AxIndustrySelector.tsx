// 업종 선택 — 15개를 가로 스크롤 없이 전부 노출한다(모바일 3열 / 태블릿 4열 / PC 5열).
// 선택은 aria-pressed 로 알리고, 터치영역은 44px 이상을 유지한다.
import { AX_V2_INDUSTRIES } from '../../data/axIndustryShowcaseV2'

export default function AxIndustrySelector({
  value,
  onChange,
  limitTo,
}: {
  value: string
  onChange: (slug: string) => void
  /** 업무별 보기에서 넘어온 경우, 관련 업종만 보여준다 */
  limitTo?: string[]
}) {
  const items = limitTo?.length ? AX_V2_INDUSTRIES.filter((i) => limitTo.includes(i.slug)) : AX_V2_INDUSTRIES

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-5">
      {items.map((ind) => {
        const on = ind.slug === value
        return (
          <button
            key={ind.slug}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(ind.slug)}
            className={`flex min-h-[52px] items-center justify-center gap-1.5 break-keep rounded-xl px-2 py-2 text-center text-[1.03rem] font-bold leading-tight transition-all ${
              on
                ? 'bg-teal-400 text-slate-900 shadow-lg shadow-teal-400/20'
                : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span aria-hidden className="text-[1.21rem] leading-none">{ind.icon}</span>
            <span>{ind.displayName}</span>
          </button>
        )
      })}
    </div>
  )
}
