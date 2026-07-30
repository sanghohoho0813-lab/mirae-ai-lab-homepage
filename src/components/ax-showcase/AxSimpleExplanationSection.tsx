// 홈 2번 섹션 — AX가 무엇인지, 왜 지금인지, 무엇이 좋아지는지를 한 화면에 압축한다.
// 긴 설명은 정책자금 상세페이지에서 다룬다. 여기서는 딱 보고 이해되는 것만 남긴다.
//
// 문장 원칙: 한 문장에 하나의 주장, 결론부터. API·인프라·백엔드 같은 IT 용어는 쓰지 않는다.
import { AX_SIMPLE_EXPLANATION, AX_URGENCY_LINES, AX_WHY_NOW_LINES } from '../../data/policyAxEvidence2026'
import AxBeforeAfterDiagram from './AxBeforeAfterDiagram'
import AxPolicyEvidenceStrip from './AxPolicyEvidenceStrip'

export default function AxSimpleExplanationSection({ onShowcase }: { onShowcase: () => void }) {
  const x = AX_SIMPLE_EXPLANATION

  return (
    <section id="ax-explained" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(85%_100%_at_20%_0%,rgba(45,212,191,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="text-center text-[1.26rem] sm:text-[1.15rem] font-black tracking-tight text-teal-300">{x.eyebrow}</p>

        {/* 왜 AX라고 부르는지부터 */}
        <p className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span className="text-[2.86rem] font-black leading-none text-white sm:text-[3.4rem]">AX</span>
          <span className="text-[1.43rem] font-bold text-teal-300 sm:text-[1.5rem]">{x.acronym.en}</span>
          <span className="text-[1.43rem] font-bold text-slate-400 sm:text-[1.5rem]">· {x.acronym.ko}</span>
        </p>

        <h2 className="mx-auto mt-8 max-w-3xl break-keep text-center text-[2.04rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:mt-10 sm:text-[2.6rem]">
          {x.title}
        </h2>

        <p className="mx-auto mt-10 max-w-3xl break-keep text-center text-[1.43rem] font-bold leading-[1.75] text-white sm:mt-12 sm:text-[1.55rem]">
          {x.definition}
        </p>

        {/* 기존 방식 → AX 적용 */}
        <div className="mx-auto mt-14 max-w-md sm:mt-20">
          <AxBeforeAfterDiagram />
        </div>

        {/* 무엇이 좋아지는지 세 가지 */}
        <ul className="mt-16 space-y-5 sm:mt-24 sm:space-y-6">
          {x.benefits.map((b) => (
            <li key={b.title} className="rounded-3xl border border-white/12 bg-white/[0.04] p-7 text-center sm:p-9">
              <span aria-hidden className="text-[2.42rem] sm:text-[2.2rem] leading-none">{b.icon}</span>
              <p className="mt-4 break-keep text-[1.54rem] font-black leading-snug text-white sm:text-[1.7rem]">{b.title}</p>
              <p className="mx-auto mt-3 max-w-xl break-keep text-[1.26rem] leading-[1.75] text-slate-300 sm:text-[1.28rem]">{b.body}</p>
            </li>
          ))}
        </ul>

        {/* 업종을 바꾸는 게 아니라는 한 줄 정리 */}
        <div className="mt-16 rounded-3xl border border-amber-400/25 bg-amber-400/[0.08] p-7 text-center sm:mt-24 sm:p-10">
          <p className="break-keep text-[1.49rem] font-black leading-[1.6] text-amber-100 sm:text-[1.7rem]">
            업종을 바꾸는 것이 아닙니다.<br />
            <span className="text-amber-300">지금 하는 업무방식을 AX로 바꾸면 됩니다.</span>
          </p>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-[1.26rem] leading-[1.75] text-slate-200 sm:text-[1.28rem]">
            AI를 판매하는 기업이 아니어도, AI와 데이터를 실제 업무에 활용하는 기업이 될 수 있습니다.
          </p>
        </div>

        {/* 왜 지금 — 두 줄 + 공식근거 */}
        <div className="mt-20 border-t border-white/10 pt-16 sm:mt-28 sm:pt-20">
          <h3 className="break-keep text-center text-[2.04rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.6rem]">
            왜 AX로 전환해야 하는 걸까요?
          </h3>
          <div className="mx-auto mt-8 max-w-3xl space-y-5 sm:mt-10">
            {AX_WHY_NOW_LINES.map((line) => (
              <p key={line} className="break-keep text-center text-[1.32rem] leading-[1.8] text-slate-300 sm:text-[1.36rem]">{line}</p>
            ))}
          </div>
          <div className="mt-12 sm:mt-16">
            <AxPolicyEvidenceStrip />
          </div>

          {/* 정책근거 다음 — 지금 시점의 압박을 사실 범위 안에서 전달한다 */}
          <div className="mt-12 rounded-3xl border border-white/12 bg-white/[0.04] p-7 text-center sm:mt-16 sm:p-10">
            {AX_URGENCY_LINES.map((line, i) => (
              <p
                key={line}
                className={`mx-auto max-w-2xl break-keep leading-[1.75] ${i === 0 ? '' : 'mt-4'} ${
                  i === AX_URGENCY_LINES.length - 1
                    ? 'text-[1.43rem] font-black text-amber-200 sm:text-[1.5rem]'
                    : 'text-[1.32rem] text-slate-300 sm:text-[1.34rem]'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center sm:mt-20">
          <button
            type="button"
            onClick={onShowcase}
            className="flex min-h-[62px] w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-8 text-[1.36rem] sm:text-[1.24rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto"
          >
            우리 업종은 어떻게 바뀌는지 보기 <span aria-hidden>↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}
