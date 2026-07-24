// SECTION #why-ax — "왜 지금은 사업계획서만으로 부족할까요?" (압축형: 3카드 + 결론 + 공식근거 아코디언)
// ⚠️ 승인·가점 단정 금지. corePrograms(가격)와 무관. 공식 숫자는 policyShift2026.ts + 출처 고지 함께 노출.
import { useState } from 'react'
import { POLICY_SHIFT as S } from '../../data/policyShift2026'

const CARDS = [
  {
    n: '1',
    title: '계획서 품질의 평준화',
    body: 'AI로 문서 작성은 쉬워졌습니다. 이제는 사업을 실제로 어떻게 실행할 것인지가 더 중요합니다.',
  },
  {
    n: '2',
    title: '설명 가능한 실행근거',
    body: '업무 흐름도, 프로토타입과 MVP는 계획을 확인 가능한 구조로 설명하는 데 도움이 됩니다.',
  },
  {
    n: '3',
    title: '자금조달 이후의 활용',
    body: '심사만을 위한 일회성 화면이 아니라 자금조달 후 실제 업무에서 사용할 시스템으로 연결합니다.',
  },
]

export default function AxPolicyShift() {
  const [factsOpen, setFactsOpen] = useState(false)
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
        <p className="text-sm font-bold uppercase tracking-widest text-teal-600">왜 지금 AX인가</p>
        <h2 className="mt-2 max-w-4xl text-[1.7rem] font-black leading-[1.22] tracking-tight text-slate-900 sm:text-[2rem]">
          왜 지금은 <span className="text-teal-600">사업계획서만으로 부족</span>할까요?
        </h2>
        <p className="mt-3 max-w-3xl text-[1.02rem] leading-relaxed text-slate-600">
          AI로 누구나 그럴듯한 계획서를 만들 수 있는 시대입니다. 기업의 차이는 문장보다 실행할 구조와 준비도에서 드러납니다.
        </p>

        {/* 3카드 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {CARDS.map((c) => (
            <div key={c.n} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500 text-[0.82rem] font-black text-white">{c.n}</span>
              <p className="mt-3 text-[1.05rem] font-black leading-snug text-slate-900">{c.title}</p>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-600">{c.body}</p>
            </div>
          ))}
        </div>

        {/* 결론 강조 */}
        <p className="mt-5 rounded-2xl bg-slate-900 px-5 py-4 text-[0.98rem] font-bold leading-relaxed text-white sm:text-[1.02rem]">
          AX 화면이 승인을 보장하는 것은 아닙니다. 다만 계획만 제시하는 것보다 <span className="text-teal-300">실행 준비도와 설명력을 높이기 위한 현실적인 방법</span>입니다. 기업별 결과는 업종·재무상태·대표자 역량·자금 종류와 기관 심사에 따라 달라집니다.
        </p>

        {/* 공식 근거 — 기본 접힘 아코디언 */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <button type="button" onClick={() => setFactsOpen((v) => !v)} aria-expanded={factsOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
            <span className="text-[0.95rem] font-black text-slate-800">2026년 정책 및 AI 전환 환경 근거 보기</span>
            <span aria-hidden className={`shrink-0 text-teal-600 transition-transform ${factsOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {factsOpen && (
            <div className="border-t border-slate-100 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {S.facts.map((f) => (
                  <div key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <p className="text-[1.15rem] font-black leading-none tracking-tight text-teal-600">{f.value}</p>
                    <p className="mt-1.5 text-[0.9rem] font-black leading-snug text-slate-900">{f.title}</p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.76rem] leading-relaxed text-slate-400">{S.sourceNote}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
