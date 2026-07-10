// 인라인 우대요소 발견 패널 — '보유' 답변 시 질문 하단에 펼쳐지는 긍정 피드백 (화면 전환 없음).
import { useEffect, useState } from 'react'
import type { PolicyAdvantageFactor } from '../../types/businessDiagnosis'

type Props = {
  factor: PolicyAdvantageFactor
  totalFound: number
  onContinue: () => void
}

export default function InlineAdvantagePanel({ factor, totalFound, onContinue }: Props) {
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLit(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-rise-in overflow-hidden rounded-2xl border-2 border-emerald-300 bg-emerald-50/60">
      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${lit ? 'bg-emerald-500' : 'bg-slate-300'}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path className={lit ? 'animate-check-draw' : ''} d="M5 12.5 10 17.5 19 7" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black text-emerald-700">정책자금 평가 참고요소 1개 발견</p>
          <p className="text-[0.95rem] font-bold leading-snug text-slate-900">
            {factor.id === 'research-org' ? '연구개발 조직을 갖추고 있어요.' : `${factor.label}을(를) 갖추고 있어요.`}
          </p>
        </div>
      </div>
      <div className="border-t border-emerald-100 bg-white/60 px-4 py-3">
        <p className="text-sm leading-relaxed text-slate-600">{factor.description}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-500">
            지금까지 발견 <span className="text-emerald-600">{totalFound}개</span>
          </span>
          <button
            type="button"
            onClick={onContinue}
            className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-[0.95rem] font-black text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            계속 진행하기 <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
