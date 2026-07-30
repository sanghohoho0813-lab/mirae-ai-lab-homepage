// 운영형 본개발 3단계 — 좌측 색상블록(단계) + 우측 내용(정의·금액·소요기간·구성) 구성.
// 색은 미래AI랩 색만 쓴다(슬레이트 → 틸 → 앰버). 추천(★)은 STEP 3 하나에만 붙인다.
// ⚠️ 금액은 VAT 별도, 일정은 목표 일정이라는 고지를 표 아래에 함께 노출한다.
import { AX_BUILD_STAGES, AX_BUILD_STAGE_NOTE } from '../../data/axPackages'

export default function AxBuildStageCards() {
  return (
    <div>
      <div className="grid gap-3">
        {AX_BUILD_STAGES.map((b) => (
          <article
            key={b.no}
            className={`grid overflow-hidden rounded-2xl border bg-white sm:grid-cols-[minmax(0,210px)_minmax(0,1fr)] ${
              b.best ? 'border-amber-400 shadow-lg shadow-amber-500/10' : 'border-slate-200 shadow-sm'
            }`}
          >
            {/* 단계 라벨 — 모바일은 상단 띠, PC는 좌측 블록 */}
            <div
              className={`flex items-center gap-3 bg-gradient-to-br ${b.tone} px-5 py-4 sm:flex-col sm:items-start sm:justify-center sm:px-6 sm:py-8`}
            >
              <p className={`text-[1.65rem] font-black leading-none tracking-tight sm:text-[2.6rem] ${b.toneText}`}>{b.tierLabel}</p>
              <p className={`break-keep text-[1.16rem] font-bold leading-snug opacity-85 sm:mt-2 sm:text-[1.404rem] ${b.toneText}`}>{b.name}</p>
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-7">
              {/* 추천은 한 단계에만 — 별표와 함께 이유를 한 줄로 적는다 */}
              {b.best && (
                <p className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[1.1rem] font-black text-slate-900 sm:text-[1.3rem]">
                  <span aria-hidden>★</span> 가장 알맞은 단계
                </p>
              )}
              {b.levelTag && (
                <p className="mb-2.5 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-[1.1rem] font-black text-teal-700 ring-1 ring-inset ring-teal-200 sm:text-[1.3rem]">
                  {b.levelTag}
                </p>
              )}
              <h3 className="break-keep text-[1.32rem] font-black leading-snug text-slate-900 sm:text-[1.664rem]">{b.level}</h3>
              {b.bestNote && (
                <p className="mt-1.5 break-keep text-[1.14rem] font-bold leading-snug text-amber-700 sm:text-[1.352rem]">{b.bestNote}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[1.32rem] font-black text-slate-900 sm:text-[1.612rem]">
                  {b.price} <span className="text-[0.78em] font-bold text-slate-500">(VAT 별도)</span>
                </span>
                <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-[1.1rem] font-bold text-slate-600 sm:text-[1.339rem]">
                  {b.duration}
                </span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-2 break-keep text-[1.17rem] leading-relaxed text-slate-700 sm:text-[1.404rem]">
                    <span aria-hidden className="shrink-0 text-slate-400">–</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 break-keep text-[1.1rem] leading-relaxed text-slate-500 sm:text-[1.339rem]">* {AX_BUILD_STAGE_NOTE}</p>
    </div>
  )
}
