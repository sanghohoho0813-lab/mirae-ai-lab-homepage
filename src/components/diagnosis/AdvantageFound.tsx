// 우대요소 발견 인터랙션 — 대표자가 '보유' 항목을 선택했을 때의 긍정 모션.
// 회색 체크 → 초록 전환, 카드 살짝 확대 후 복귀, 작은 입자, 발견 수 +1.
// ⚠️ '우대요소 발견 수'는 승인 개수·가점 개수가 아님 — 하단에 고지.
import { useEffect, useState } from 'react'
import type { PolicyAdvantageFactor } from '../../types/businessDiagnosis'
import { ADVANTAGE_DISCLAIMER } from '../../data/policyAdvantageFactors'

type Props = {
  factor: PolicyAdvantageFactor
  /** 지금까지 발견한 총 개수 (이번 포함) */
  totalFound: number
  onContinue: () => void
}

const PARTICLES = [
  { left: '22%', delay: 0, color: 'bg-emerald-400' },
  { left: '46%', delay: 70, color: 'bg-blue-400' },
  { left: '66%', delay: 30, color: 'bg-emerald-300' },
  { left: '82%', delay: 110, color: 'bg-sky-400' },
]

export default function AdvantageFound({ factor, totalFound, onContinue }: Props) {
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLit(true), 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-rise-in mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-5 py-10">
      {/* 상단 발견 배지 */}
      <div className="min-h-9">
        {lit && (
          <span className="animate-pop-in inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
            정책자금 평가 참고요소 1개 발견
          </span>
        )}
      </div>

      <h2 className="mt-3 text-[1.45rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[1.7rem]">
        {factor.group === 'technology' && factor.id === 'research-org'
          ? '연구개발 조직 기반을 보유하고 있습니다.'
          : `${factor.label}을(를) 보유하고 있습니다.`}
      </h2>
      <p className="mt-2.5 text-base leading-relaxed text-slate-600">{factor.description}</p>

      {/* 전환 카드 */}
      <div className="relative mt-7">
        {lit && (
          <div aria-hidden className="pointer-events-none absolute -top-2 left-0 right-0 h-10">
            {PARTICLES.map((c, i) => (
              <span key={i} className={`animate-confetti absolute top-0 h-2 w-2 rounded-[3px] ${c.color}`} style={{ left: c.left, animationDelay: `${c.delay}ms` }} />
            ))}
          </div>
        )}
        <div
          className={`rounded-3xl border-2 p-6 transition-all duration-500 sm:p-7 ${
            lit ? 'scale-100 border-emerald-400 bg-emerald-50/70 shadow-lg shadow-emerald-500/10' : 'scale-[0.98] border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-500 ${lit ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                {lit && <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />}
                {!lit && <path d="M5 12.5 10 17.5 19 7" opacity="0.6" />}
              </svg>
            </span>
            <p className={`text-base font-black transition-colors duration-500 ${lit ? 'text-emerald-800' : 'text-slate-500'}`}>{factor.label} 보유</p>
          </div>
          {lit && (
            <ul className="mt-4 space-y-2">
              {factor.benefits.slice(0, 2).map((b, i) => (
                <li key={b} className="animate-rise-in flex items-start gap-2.5 text-[0.95rem] font-semibold leading-snug text-slate-700" style={{ animationDelay: `${200 + i * 130}ms` }}>
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 누적 발견 수 */}
      {lit && (
        <p className="animate-rise-in mt-4 text-center text-sm font-bold text-slate-500 [animation-delay:300ms]">
          지금까지 발견한 평가 참고요소 <span className="text-emerald-600">{totalFound}개</span>
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex min-h-[56px] w-full items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-6 py-4 text-base font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        계속 진행하기 <span aria-hidden>→</span>
      </button>

      <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">{ADVANTAGE_DISCLAIMER}</p>
    </div>
  )
}
