// 답변 직후 "혜택 발견 카드" — 회색(전) → 파랑/초록(후) 전환 체험형 모션.
// 폭죽·카지노 효과 금지. 시각적 햅틱(scale·체크·작은 입자)만 사용.
import { useEffect, useState } from 'react'
import type { BenefitCard } from '../../types/businessDiagnosis'

type Props = {
  card: BenefitCard
  onContinue: (interested: boolean) => void
}

const CONFETTI = [
  { left: '18%', delay: 0, color: 'bg-blue-400' },
  { left: '38%', delay: 80, color: 'bg-emerald-400' },
  { left: '58%', delay: 40, color: 'bg-sky-400' },
  { left: '76%', delay: 120, color: 'bg-blue-300' },
]

export default function BenefitReveal({ card, onContinue }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [shownBenefits, setShownBenefits] = useState(0)

  // 혜택 항목 순차 표시 (120ms 간격)
  useEffect(() => {
    if (!revealed) return
    if (shownBenefits >= card.benefits.length) return
    const t = setTimeout(() => setShownBenefits((n) => n + 1), shownBenefits === 0 ? 250 : 130)
    return () => clearTimeout(t)
  }, [revealed, shownBenefits, card.benefits.length])

  return (
    <div className="animate-rise-in mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-5 py-10">
      {/* 상단 피드백 배지 (전환 후) */}
      <div className="min-h-9">
        {revealed && (
          <span className="animate-pop-in inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
            {card.feedbackLabel}
          </span>
        )}
      </div>

      <h2 className="mt-3 text-[1.45rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[1.7rem]">{card.title}</h2>
      <p className="mt-2.5 text-base leading-relaxed text-slate-600">{card.desc}</p>

      {/* before → after 카드 */}
      <div className="relative mt-7">
        {/* 작은 입자 효과 (전환 순간) */}
        {revealed && (
          <div aria-hidden className="pointer-events-none absolute -top-2 left-0 right-0 h-10">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className={`animate-confetti absolute top-0 h-2 w-2 rounded-[3px] ${c.color}`}
                style={{ left: c.left, animationDelay: `${c.delay}ms` }}
              />
            ))}
          </div>
        )}

        <div
          className={`overflow-hidden rounded-3xl border-2 p-6 transition-all duration-500 sm:p-7 ${
            revealed ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-emerald-50/60 shadow-lg shadow-blue-500/10' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-500 ${revealed ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              {revealed ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </span>
            <p className={`text-base font-black transition-colors duration-500 ${revealed ? 'text-blue-800' : 'text-slate-500'}`}>
              {revealed ? card.afterLabel : card.beforeLabel}
            </p>
          </div>

          {/* 준비도 바 */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-slate-200" aria-hidden>
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${revealed ? 'bg-gradient-to-r from-blue-500 to-emerald-400' : 'bg-slate-300'}`}
              style={{ width: revealed ? '72%' : '28%' }}
            />
          </div>

          {/* 혜택 3개 — 순차 등장 */}
          {revealed && (
            <ul className="mt-5 space-y-2.5">
              {card.benefits.slice(0, shownBenefits).map((b) => (
                <li key={b} className="animate-rise-in flex items-start gap-2.5 text-[0.95rem] font-semibold leading-snug text-slate-800">
                  <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5 10 17.5 19 7" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-7">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex min-h-[56px] w-full items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-6 py-4 text-base font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            {card.revealCta}
          </button>
        ) : (
          <div className="animate-rise-in flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onContinue(true)}
              className="flex min-h-[56px] w-full items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {card.continueCta}
            </button>
            <button
              type="button"
              onClick={() => onContinue(false)}
              className="min-h-11 py-2 text-sm font-semibold text-slate-400 underline underline-offset-4 transition-colors hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              지금은 넘어갈게요
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
