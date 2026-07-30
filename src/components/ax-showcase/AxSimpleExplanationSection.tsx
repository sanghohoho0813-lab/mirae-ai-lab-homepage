// 홈 2번 섹션 — AX가 무엇인지, 왜 지금인지, 무엇이 좋아지는지를 한 화면에 압축한다.
// 긴 설명은 정책자금 상세페이지에서 다룬다. 여기서는 딱 보고 이해되는 것만 남긴다.
//
// 문장 원칙: 한 문장에 하나의 주장, 결론부터. API·인프라·백엔드 같은 IT 용어는 쓰지 않는다.
import { AX_NOT_A_PIVOT, AX_SIMPLE_EXPLANATION, AX_WHY_NOW_LINES } from '../../data/policyAxEvidence2026'
import AxBeforeAfterDiagram from './AxBeforeAfterDiagram'
import AxPolicyEvidenceStrip from './AxPolicyEvidenceStrip'

export default function AxSimpleExplanationSection({ onShowcase }: { onShowcase: () => void }) {
  const x = AX_SIMPLE_EXPLANATION

  return (
    <section id="ax-explained" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(85%_100%_at_20%_0%,rgba(45,212,191,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-[1.08rem] font-black tracking-tight text-teal-300">{x.eyebrow}</p>

        {/* 왜 AX라고 부르는지부터 */}
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-[2.1rem] font-black leading-none text-white sm:text-[2.6rem]">AX</span>
          <span className="text-[1.16rem] font-bold text-teal-300 sm:text-[1.3rem]">{x.acronym.en}</span>
          <span className="text-[1.16rem] font-bold text-slate-400 sm:text-[1.3rem]">· {x.acronym.ko}</span>
        </p>

        <h2 className="mt-3 max-w-3xl break-keep text-[1.55rem] font-black leading-[1.3] text-white sm:text-[2.15rem]">
          {x.title}
        </h2>

        <div className="mt-7 grid gap-6 lg:grid-cols-[55fr_45fr] lg:gap-8">
          {/* 왼쪽 — 정의와 세 가지 효과 */}
          <div className="min-w-0">
            <p className="break-keep rounded-2xl border-l-2 border-teal-400 bg-white/[0.04] py-4 pl-4 pr-5 text-[1.2rem] font-bold leading-relaxed text-white sm:text-[1.3rem]">
              {x.definition}
            </p>

            <ul className="mt-4 space-y-2.5">
              {x.benefits.map((b) => (
                <li key={b.title} className="flex gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-4">
                  <span aria-hidden className="text-[1.5rem] leading-none">{b.icon}</span>
                  <span className="min-w-0">
                    <span className="block break-keep text-[1.16rem] font-black leading-snug text-white sm:text-[1.26rem]">{b.title}</span>
                    <span className="mt-1 block break-keep text-[1.08rem] leading-relaxed text-slate-300 sm:text-[1.14rem]">{b.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* 업종을 바꾸는 게 아니라는 한 줄 정리 */}
            <p className="mt-5 break-keep rounded-2xl border border-amber-400/25 bg-amber-400/[0.08] p-4 text-[1.12rem] font-bold leading-relaxed text-amber-100 sm:text-[1.2rem]">
              업종을 바꾸는 것이 아닙니다. <span className="text-amber-300">지금 하는 업무방식을 AX로 바꾸면 됩니다.</span>
              <br />
              AI를 판매하는 기업이 아니어도, AI와 데이터를 실제 업무에 활용하는 기업이 될 수 있습니다.
            </p>
            <p className="mt-2.5 break-keep text-[1.03rem] leading-relaxed text-slate-500">{AX_NOT_A_PIVOT.brandNote}</p>
          </div>

          {/* 오른쪽 — Before→After와 정책근거 */}
          <div className="min-w-0">
            <AxBeforeAfterDiagram />
          </div>
        </div>

        {/* 왜 지금 — 두 줄 + 공식근거 */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <h3 className="break-keep text-[1.4rem] font-black leading-snug text-white sm:text-[1.8rem]">왜 하필 지금 AX일까요?</h3>
          <div className="mt-3 max-w-3xl space-y-2">
            {AX_WHY_NOW_LINES.map((line) => (
              <p key={line} className="break-keep text-[1.12rem] leading-relaxed text-slate-300 sm:text-[1.2rem]">{line}</p>
            ))}
          </div>
          <div className="mt-5">
            <AxPolicyEvidenceStrip />
          </div>
        </div>

        <button
          type="button"
          onClick={onShowcase}
          className="mt-8 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 text-[1.16rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto"
        >
          우리 업종은 어떻게 바뀌는지 보기 <span aria-hidden>↓</span>
        </button>
      </div>
    </section>
  )
}
