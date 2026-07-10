// 진단 상단 진행 표시 — 뒤로가기 · 단계 · 진행률 바 · 질문 카운터.
import type { DiagnosisStage } from '../../types/businessDiagnosis'
import { STAGE_INFO } from '../../data/businessDiagnosisQuestions'

type Props = {
  stage: DiagnosisStage
  questionNumber: number
  totalEstimate: number
  percent: number
  onBack: () => void
  backLabel?: string
}

export default function DiagnosisProgress({ stage, questionNumber, totalEstimate, percent, onBack, backLabel = '이전' }: Props) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-[860px] px-4 pb-2.5 pt-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={backLabel}
            className="grid h-11 w-11 -ml-2 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-blue-600">{stage}단계 / 3단계</p>
            <p className="truncate text-sm font-bold text-slate-900">{STAGE_INFO[stage].name}</p>
          </div>
          <p className="shrink-0 whitespace-nowrap text-right text-[11px] font-semibold text-slate-400 sm:text-sm">
            질문 {questionNumber} <span className="text-slate-300">/</span> 예상 {totalEstimate}
          </p>
        </div>
        {/* 진행률 바 */}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100} aria-label="진단 진행률">
          <div
            className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
