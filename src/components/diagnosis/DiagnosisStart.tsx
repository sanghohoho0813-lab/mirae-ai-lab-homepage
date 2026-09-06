// 3분 AX Fit 시작 화면 — 설문지가 아니라 '판단 시작' 느낌 (토스풍 간결 모션).
// 결과 등급 4단계를 미리 보여주어, 무엇을 판단하는 진단인지 먼저 알린다.
import { AX_FIT_INFO, QUESTION_COUNT } from '../../data/businessDiagnosisQuestions'
import { GRADE_META } from '../../lib/businessDiagnosisEngine'

type Props = {
  hasSaved: boolean
  onStart: () => void
  onResume: () => void
}

const GRADE_CARDS = (['NO_GO', 'LITE', 'FULL', 'HIGH'] as const).map((g) => ({ key: g, ...GRADE_META[g] }))

export default function DiagnosisStart({ hasSaved, onStart, onResume }: Props) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-57px)] max-w-[720px] flex-col justify-center px-5 py-10 sm:py-14">
      <p className="animate-rise-in text-sm font-black uppercase tracking-widest text-blue-600">{AX_FIT_INFO.name}</p>
      <h1 className="animate-rise-in mt-3 text-[1.6rem] font-black leading-[1.3] tracking-tight text-slate-900 [animation-delay:60ms] sm:text-[2.2rem]">
        우리 회사는<br className="sm:hidden" /> 어디부터 바꿔야 할까요?
      </h1>
      <p className="animate-rise-in mt-4 max-w-lg text-base leading-relaxed text-slate-600 [animation-delay:120ms] sm:text-lg">
        모든 회사에 Full AX가 필요한 것은 아닙니다.
      </p>
      <p className="animate-rise-in mt-1.5 max-w-lg text-base leading-relaxed text-slate-600 [animation-delay:150ms] sm:text-lg">
        현재 업무방식과 시스템을 기준으로<br className="sm:hidden" /> No-Go / Lite / Full AX 가능성을 먼저 판단합니다.
      </p>

      {/* 결과 등급 4단계 미리보기 */}
      <div className="mt-8 space-y-3">
        {GRADE_CARDS.map((c, i) => (
          <div
            key={c.key}
            className="animate-rise-in flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            style={{ animationDelay: `${140 + i * 70}ms` }}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-base font-black text-blue-700">{i + 1}</span>
            <div className="min-w-0">
              <p className="text-base font-extrabold text-slate-900">{c.label}</p>
              <p className="mt-0.5 text-sm leading-snug text-slate-500">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="animate-rise-in mt-8 flex flex-col gap-2.5 [animation-delay:440ms]">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-[56px] items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-7 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          3분 AX Fit 시작하기
          <span aria-hidden>→</span>
        </button>
        <p className="text-center text-[0.85rem] font-medium text-slate-500">질문 {QUESTION_COUNT}개 · 약 3분 · 로그인 없이 시작</p>
        {hasSaved && (
          <button
            type="button"
            onClick={onResume}
            className="flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            이어서 진단하기
          </button>
        )}
      </div>
    </div>
  )
}
