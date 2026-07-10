// 단계 완료 스플래시 — 체크 링 애니메이션 + '1단계 완료' (약 1.2초 후 자동 진행).
import { useEffect } from 'react'
import type { DiagnosisStage } from '../../types/businessDiagnosis'
import { STAGE_INFO } from '../../data/businessDiagnosisQuestions'

type Props = {
  stage: DiagnosisStage
  onDone: () => void
}

export default function StageComplete({ stage, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 1300)
    return () => clearTimeout(t)
  }, [onDone])

  const nextStage = stage < 3 ? ((stage + 1) as DiagnosisStage) : null

  return (
    <div className="animate-rise-in mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90" aria-hidden>
          <circle cx="48" cy="48" r="41" fill="none" stroke="#e2e8f0" strokeWidth="7" />
          <circle cx="48" cy="48" r="41" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" className="animate-ring-draw" />
        </svg>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 m-auto" aria-hidden>
          <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
        </svg>
      </div>
      <p className="mt-6 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{stage}단계 완료!</p>
      <p className="mt-2 text-base font-medium text-slate-500">
        {nextStage ? `다음은 ${STAGE_INFO[nextStage].name} 단계예요.` : '결과를 계산할 준비가 됐어요.'}
      </p>
    </div>
  )
}
