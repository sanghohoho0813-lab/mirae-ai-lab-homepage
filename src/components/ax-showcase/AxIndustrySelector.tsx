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
        // 모바일은 아이콘을 위로 올려 업종명이 칩 폭을 온전히 쓰게 한다.
        // 좁은 화면에서는 글자를 vw에 맞춰 살짝 줄여 3열 안에서 잘리지 않게 한다.
        return (
          <button
            key={ind.slug}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(ind.slug)}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 break-keep rounded-xl px-1.5 py-2 text-center text-[min(1.04rem,4.5vw)] font-bold leading-tight transition-all sm:flex-row sm:gap-1.5 sm:px-2 sm:text-[1.03rem] ${
              on
                ? 'bg-teal-400 text-slate-900 shadow-lg shadow-teal-400/20'
                : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span aria-hidden className="shrink-0 text-[1.24rem] leading-none sm:text-[1.21rem]">{ind.icon}</span>
            <span>{ind.displayName}</span>
          </button>
        )
      })}
    </div>
  )
}
