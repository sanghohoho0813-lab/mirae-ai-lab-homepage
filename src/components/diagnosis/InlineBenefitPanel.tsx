// 인라인 혜택 패널 — 질문 하단에 펼쳐지는 교육형 안내 (화면 전환 없음).
// 버튼 의미를 명확히 구분:
//   Primary '내 추천 목록에 담기' → 관심 저장 + 추천 가중치 + 결과의 검토 추천에 포함
//   Secondary '추천에 넣지 않고 다음 질문' → 답변만 저장, 관심/가중치 미반영
import { useEffect, useState } from 'react'
import type { BenefitCard } from '../../types/businessDiagnosis'

type Props = {
  card: BenefitCard
  onAdd: () => void
  onSkip: () => void
}

export default function InlineBenefitPanel({ card, onAdd, onSkip }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!revealed || shown >= card.benefits.length) return
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 120 : 110)
    return () => clearTimeout(t)
  }, [revealed, shown, card.benefits.length])

  return (
    <div className="animate-rise-in overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/50">
      <div className="border-b border-blue-100 bg-white/70 px-4 py-3">
        <p className="text-base font-black leading-snug text-slate-900">{card.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{card.desc}</p>
      </div>

      <div className="p-4">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-[0.95rem] font-black text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            {card.revealCta}
            <span aria-hidden>▾</span>
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
                {card.feedbackLabel}
              </span>
              <span className="text-xs font-semibold text-slate-500">{card.afterLabel}</span>
            </div>
            <ul className="mt-3 space-y-2">
              {card.benefits.slice(0, shown).map((b) => (
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

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              지금 바로 신청되는 것은 아니며, 최종 결과에서 검토 순서를 정리해드려요.
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onAdd}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-[0.95rem] font-black text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                ＋ 내 추천 목록에 담기
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-[0.95rem] font-bold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                추천에 넣지 않고 다음 질문
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
