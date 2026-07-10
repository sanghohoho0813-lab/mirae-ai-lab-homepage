// 인라인 혜택 패널 — 질문 하단에 펼쳐지는 교육형 안내 (화면 전환 없음).
// 핵심 UX 규칙:
//   1) '내 추천 목록에 담기'를 눌러도 화면이 넘어가지 않고 그 자리에 머뭅니다.
//      → 버튼이 초록 체크로 바뀌고, "추천 목록에 담겼어요 · N개" 안내와 토스트가 뜹니다.
//   2) 다음 질문으로 넘어가는 것은 별도의 기본 버튼 '확인했어요 · 다음 질문'입니다.
//   3) 담지 않고 넘어가려면 '추천에 넣지 않고 넘어가기'(건너뛰기)를 누릅니다.
//   4) '혜택 더 보기'로 추가 정성 혜택 + 조건부·검증 혜택(조건·출처)을 펼쳐 봅니다.
import { useEffect, useRef, useState } from 'react'
import type { BenefitCard, VerifiedBenefit } from '../../types/businessDiagnosis'

type Props = {
  card: BenefitCard
  /** 이미 추천 목록에 담긴 상태인지 (뒤로 왔다 다시 와도 유지) */
  added: boolean
  /** 현재 추천 목록에 담긴 총 개수 */
  listCount: number
  onAdd: () => void // 담기 (화면 유지)
  onRemove: () => void // 목록에서 빼기
  onConfirm: () => void // 확인했어요 · 다음 질문
  onSkip: () => void // 추천에 넣지 않고 넘어가기
}

function VerifiedBenefitBlock({ vb }: { vb: VerifiedBenefit }) {
  const [showConditions, setShowConditions] = useState(false)
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
      {vb.badge && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-black text-white">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21.4 7.6 18.2l.9-5.5-4-3.9L10 8z" />
          </svg>
          {vb.badge}
        </span>
      )}
      <p className="mt-2 text-[0.9rem] font-semibold leading-relaxed text-slate-700">{vb.text}</p>
      {vb.conditions && vb.conditions.length > 0 && (
        <div className="mt-2.5">
          <button
            type="button"
            onClick={() => setShowConditions((v) => !v)}
            aria-expanded={showConditions}
            className="inline-flex items-center gap-1 text-xs font-black text-amber-700 hover:text-amber-900"
          >
            적용 조건 {vb.conditions.length}가지 확인
            <span aria-hidden className={`transition-transform ${showConditions ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showConditions && (
            <ul className="mt-2 space-y-1.5">
              {vb.conditions.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs leading-snug text-amber-900/90">
                  <span aria-hidden className="mt-0.5 font-black">·</span>
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {vb.source && (
        <p className="mt-2.5 text-[11px] leading-snug text-slate-500">
          출처 ·{' '}
          {vb.source.url ? (
            <a href={vb.source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-600 underline underline-offset-2 hover:text-slate-900">
              {vb.source.name}
            </a>
          ) : (
            <span className="font-bold text-slate-600">{vb.source.name}</span>
          )}
          {vb.source.verifiedAt && ` (${vb.source.verifiedAt} 확인)`}
        </p>
      )}
    </div>
  )
}

export default function InlineBenefitPanel({ card, added, listCount, onAdd, onRemove, onConfirm, onSkip }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [shown, setShown] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [toast, setToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!revealed || shown >= card.benefits.length) return
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 120 : 110)
    return () => clearTimeout(t)
  }, [revealed, shown, card.benefits.length])

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const hasMore = Boolean((card.moreBenefits && card.moreBenefits.length) || (card.verifiedBenefits && card.verifiedBenefits.length))

  function handleAddClick() {
    if (added) {
      onRemove()
      return
    }
    onAdd()
    setToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 1600)
  }

  return (
    <div className="animate-rise-in relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/50">
      {/* 토스트 */}
      {toast && (
        <div className="animate-pop-in pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white shadow-lg">
          추천 목록에 담겼어요 ✓
        </div>
      )}

      <div className="border-b border-blue-100 bg-white/70 px-4 py-3.5">
        <p className="text-base font-black leading-snug text-slate-900">{card.title}</p>
        {card.currentRisk && <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-500">{card.currentRisk}</p>}
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{card.simpleDescription ?? card.desc}</p>
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
                {card.feedbackLabel}
              </span>
              <span className="text-xs font-semibold text-slate-500">{card.afterLabel}</span>
            </div>

            <p className="mt-2.5 text-xs font-black uppercase tracking-wide text-slate-400">준비하면 이런 점이 좋아져요</p>
            <ul className="mt-2 space-y-2">
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

            {/* 혜택 더 보기 — 추가 정성 혜택 + 조건부·검증 혜택 */}
            {hasMore && shown >= card.benefits.length && (
              <div className="mt-3">
                {!showMore ? (
                  <button
                    type="button"
                    onClick={() => setShowMore(true)}
                    className="inline-flex items-center gap-1 text-sm font-black text-blue-600 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                  >
                    혜택 더 보기
                    <span aria-hidden>▾</span>
                  </button>
                ) : (
                  <div className="animate-rise-in space-y-2.5">
                    {card.moreBenefits && card.moreBenefits.length > 0 && (
                      <ul className="space-y-2">
                        {card.moreBenefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-[0.95rem] font-medium leading-snug text-slate-700">
                            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {card.verifiedBenefits?.map((vb) => <VerifiedBenefitBlock key={vb.text} vb={vb} />)}
                    {card.disclaimer && <p className="text-xs leading-relaxed text-slate-400">※ {card.disclaimer}</p>}
                  </div>
                )}
              </div>
            )}

            <p className="mt-3 text-xs leading-relaxed text-slate-400">지금 바로 신청되는 것은 아니며, 최종 결과에서 검토 순서를 정리해드려요.</p>

            {/* 담김 상태 안내 */}
            {added && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800 ring-1 ring-inset ring-emerald-200">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
                추천 목록에 담겼어요 · 현재 {listCount}개
              </div>
            )}

            {/* 액션 — 담기(토글) + 다음으로(기본) + 건너뛰기 */}
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleAddClick}
                aria-pressed={added}
                className={`flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-[0.95rem] font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  added
                    ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                }`}
              >
                {added ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
                    목록에 담김 · 빼기
                  </>
                ) : (
                  <>＋ 내 추천 목록에 담기</>
                )}
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-[0.95rem] font-black text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  확인했어요 · 다음 질문 <span aria-hidden>→</span>
                </button>
                {!added && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-[0.95rem] font-bold text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                  >
                    추천에 넣지 않고 넘어가기
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
