// 운영형 본개발 3단계 — 좌측 색상블록(단계) + 우측 내용(정의·금액·소요기간·구성) 구성.
// 카드마다 한 가지 수준만 설명하고, 특정 단계를 권장 표시하지 않는다.
// ⚠️ 금액은 VAT 별도, 일정은 목표 일정이라는 고지를 표 아래에 함께 노출한다.
import { AX_BUILD_STAGES, AX_BUILD_STAGE_NOTE } from '../../data/axPackages'

export default function AxBuildStageCards() {
  return (
    <div>
      <div className="grid gap-3">
        {AX_BUILD_STAGES.map((b) => (
          <article
            key={b.no}
            className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]"
          >
            {/* 단계 라벨 — 모바일은 상단 띠, PC는 좌측 블록 */}
            <div
              className={`flex items-center gap-3 bg-gradient-to-br ${b.tone} px-5 py-4 sm:flex-col sm:items-start sm:justify-center sm:px-6 sm:py-8`}
            >
              <p className="text-[1.65rem] font-black leading-none tracking-tight text-white sm:text-[2rem]">{b.tierLabel}</p>
              <p className="break-keep text-[1.16rem] font-bold leading-snug text-white/85 sm:mt-2 sm:text-[1.08rem]">{b.name}</p>
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-7">
              <h3 className="break-keep text-[1.32rem] font-black leading-snug text-slate-900 sm:text-[1.28rem]">{b.level}</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[1.32rem] font-black text-slate-900 sm:text-[1.24rem]">
                  {b.price} <span className="text-[0.78em] font-bold text-slate-500">(VAT 별도)</span>
                </span>
                <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-[1.1rem] font-bold text-slate-600 sm:text-[1.03rem]">
                  {b.duration}
                </span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-2 break-keep text-[1.17rem] leading-relaxed text-slate-700 sm:text-[1.08rem]">
                    <span aria-hidden className="shrink-0 text-slate-400">–</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 break-keep text-[1.1rem] leading-relaxed text-slate-500 sm:text-[1.03rem]">* {AX_BUILD_STAGE_NOTE}</p>
    </div>
  )
}
