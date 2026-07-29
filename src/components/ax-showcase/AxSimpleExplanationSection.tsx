// 홈의 핵심 설득영역 — AX를 아주 쉬운 말로 설명하고, 왜 지금인지 정책변화로 잇고,
// "우리 회사를 반도체 회사로 바꿀 수는 없다"는 반론까지 해소한 뒤 업종 쇼케이스로 넘긴다.
//
// 문장 원칙: 한 문장에 하나의 주장, 결론부터. API·인프라·백엔드 같은 IT 용어는 쓰지 않는다.
// PC는 왼쪽 55%(설명) / 오른쪽 45%(Before→After·정책근거), 모바일은 한 열로 쌓는다.
import {
  AX_FUNDING_REALITY,
  AX_NOT_A_PIVOT,
  AX_SIMPLE_EXPLANATION,
  AX_WHY_NOW_LINES,
} from '../../data/policyAxEvidence2026'
import AxBeforeAfterDiagram from './AxBeforeAfterDiagram'
import AxPolicyEvidenceStrip from './AxPolicyEvidenceStrip'

export default function AxSimpleExplanationSection({ onShowcase }: { onShowcase: () => void }) {
  const x = AX_SIMPLE_EXPLANATION

  return (
    <section id="ax-explained" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(85%_100%_at_20%_0%,rgba(45,212,191,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-[1.08rem] font-black tracking-tight text-teal-300">{x.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl break-keep text-[1.7rem] font-black leading-[1.3] text-white sm:text-[2.3rem]">
          {x.title}
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-[55fr_45fr] lg:gap-8">
          {/* 왼쪽 — 설명 */}
          <div className="min-w-0">
            <p className="break-keep rounded-2xl border-l-2 border-teal-400 bg-white/[0.04] py-4 pl-4 pr-5 text-[1.2rem] font-bold leading-relaxed text-white sm:text-[1.28rem]">
              {x.definition}
            </p>

            <ul className="mt-4 space-y-2">
              {x.examples.map((e) => (
                <li key={e} className="flex gap-2.5 break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">
                  <span aria-hidden className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  {e}
                </li>
              ))}
            </ul>

            <p className="mt-6 break-keep text-[1.18rem] font-bold leading-relaxed text-white sm:text-[1.26rem]">{x.changeLead}</p>
            <p className="mt-2 break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">
              {x.changeBody}
            </p>

            {/* 왜 하필 지금 */}
            <h3 className="mt-10 break-keep text-[1.45rem] font-black leading-snug text-white sm:text-[1.85rem]">
              왜 하필 지금 AX일까요?
            </h3>
            <ol className="mt-4 space-y-2.5">
              {AX_WHY_NOW_LINES.map((line, i) => (
                <li key={line} className="flex gap-3 break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">
                  <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[1.0rem] font-black text-teal-200">
                    {i + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ol>

            {/* 정책근거는 모바일에서 이 위치에, PC에서는 오른쪽 열에 둔다 */}
            <div className="mt-6 lg:hidden">
              <AxPolicyEvidenceStrip />
            </div>

            {/* 고객의 현실 */}
            <h3 className="mt-10 break-keep text-[1.45rem] font-black leading-snug text-white sm:text-[1.85rem]">
              {AX_FUNDING_REALITY.title}
            </h3>
            <div className="mt-4 space-y-2.5">
              {AX_FUNDING_REALITY.lines.map((l) => (
                <p key={l} className="break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">{l}</p>
              ))}
            </div>
            <p className="mt-5 break-keep rounded-2xl border-l-2 border-amber-400 bg-white/[0.04] py-4 pl-4 pr-5 text-[1.18rem] font-bold leading-relaxed text-amber-100 sm:text-[1.26rem]">
              {AX_FUNDING_REALITY.emphasis}
            </p>
            <p className="mt-3 break-keep text-[1.1rem] leading-relaxed text-slate-400 sm:text-[1.16rem]">
              {AX_FUNDING_REALITY.scale}
            </p>

            {/* 반론 해소 */}
            <h3 className="mt-10 break-keep text-[1.45rem] font-black leading-snug text-white sm:text-[1.85rem]">
              {AX_NOT_A_PIVOT.title}
            </h3>
            <div className="mt-4 space-y-2.5">
              {AX_NOT_A_PIVOT.lines.map((l) => (
                <p key={l} className="break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">{l}</p>
              ))}
            </div>
            <div className="mt-5 space-y-2.5 rounded-2xl border border-teal-400/25 bg-teal-400/[0.07] p-4 sm:p-5">
              {AX_NOT_A_PIVOT.core.map((l) => (
                <p key={l} className="break-keep text-[1.16rem] font-bold leading-relaxed text-teal-100 sm:text-[1.24rem]">{l}</p>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {AX_NOT_A_PIVOT.emphasis.map((l) => (
                <p key={l} className="break-keep text-[1.12rem] font-bold leading-relaxed text-white sm:text-[1.2rem]">{l}</p>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {AX_NOT_A_PIVOT.role.map((l) => (
                <p key={l} className="break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">{l}</p>
              ))}
            </div>
            <p className="mt-3 break-keep text-[1.03rem] leading-relaxed text-slate-500">{AX_NOT_A_PIVOT.brandNote}</p>
          </div>

          {/* 오른쪽 — Before/After와 정책근거 (PC 전용 배치) */}
          <div className="min-w-0">
            <AxBeforeAfterDiagram />
            <div className="mt-4 hidden lg:block">
              <AxPolicyEvidenceStrip />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onShowcase}
          className="mt-10 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 text-[1.16rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto"
        >
          우리 업종은 어떻게 바뀌는지 보기 <span aria-hidden>↓</span>
        </button>
      </div>
    </section>
  )
}
