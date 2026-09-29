// 진단 질문 화면 — 한 화면에 질문 하나. 혜택 패널은 화면을 갈아끼우지 않고 질문 하단에 인라인으로 표시.
// 타이밍은 오케스트레이터가 관리(빠른 전환). 이 컴포넌트는 선택 즉시 onSelect 만 호출.
import { useEffect, useRef, type ReactNode } from 'react'
import type { DiagnosisQuestion as Question, InlineFeedback } from '../../types/businessDiagnosis'

type Props = {
  question: Question
  value: string | string[] | undefined
  feedback: InlineFeedback | null
  /** 혜택/우대요소 인라인 패널 (있으면 질문 하단에 펼침, 자동전환 안 함) */
  inlinePanel?: ReactNode
  onSelect: (value: string | string[]) => void
  onNext: () => void
  onPrev: () => void
  canPrev: boolean
  onSkip?: () => void
}

/** 제목 속 '(한글 풀이)' 는 작고 옅게 — 예: ERP(경영관리 프로그램). 문자열 자체는 메일·관리자 화면에 그대로 쓴다 */
function glossed(text: string): ReactNode[] {
  return text.split(/(\([^)]*\))/).map((part, i) =>
    part.startsWith('(') && part.endsWith(')') ? (
      <span key={i} className="whitespace-nowrap text-[0.72em] font-semibold tracking-normal text-slate-500">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export default function DiagnosisQuestion({ question, value, feedback, inlinePanel, onSelect, onNext, onPrev, canPrev, onSkip }: Props) {
  const isMulti = question.type === 'multi'
  const selected = isMulti ? (Array.isArray(value) ? value : []) : typeof value === 'string' ? value : undefined
  const panelRef = useRef<HTMLDivElement>(null)
  const hasPanel = Boolean(inlinePanel)

  // 인라인 패널이 '처음 열릴 때만' 한 번 스크롤 (매 렌더 스크롤 방지 → 요소 안정)
  useEffect(() => {
    if (hasPanel) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [hasPanel])

  function choose(v: string) {
    if (isMulti) {
      const cur = Array.isArray(value) ? [...value] : []
      const exclusives = question.exclusiveValues ?? []
      let next: string[]
      if (cur.includes(v)) next = cur.filter((x) => x !== v)
      else if (exclusives.includes(v)) next = [v]
      else next = [...cur.filter((x) => !exclusives.includes(x)), v]
      onSelect(next)
    } else {
      onSelect(v)
    }
  }

  return (
    <div key={question.id} className="animate-rise-in mx-auto flex w-full max-w-[720px] flex-1 flex-col px-5 pb-32 pt-6 sm:pb-10 sm:pt-9">
      <h2 className="text-2xl font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[1.8rem]">{glossed(question.title)}</h2>
      {question.desc && <p className="mt-2 text-base leading-relaxed text-slate-500">{question.desc}</p>}
      {question.note && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-[0.88rem] leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="mt-[3px] shrink-0 text-slate-400" aria-hidden>
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 11v5.5M12 7.6v.2" />
          </svg>
          <span className="break-keep">{question.note}</span>
        </p>
      )}

      {feedback && (
        <div
          role="status"
          className={`animate-pop-in mt-4 rounded-xl px-4 py-3 text-sm font-semibold leading-snug ${
            feedback.tone === 'warn'
              ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200'
              : feedback.tone === 'good'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200'
                : 'bg-[#F6ECE1] text-[#7E4B22] ring-1 ring-inset ring-[#EBCBAA]'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2" role={isMulti ? 'group' : 'radiogroup'} aria-label={question.title}>
        {question.options.map((opt) => {
          const isSel = isMulti ? (selected as string[]).includes(opt.value) : selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role={isMulti ? 'checkbox' : 'radio'}
              aria-checked={isSel}
              onClick={() => choose(opt.value)}
              className={`flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border-2 px-4.5 py-3.5 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99257] ${
                isSel ? 'border-[#B37744] bg-[#F6ECE1]/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="min-w-0">
                <span className={`block text-base font-bold leading-snug ${isSel ? 'text-[#7E4B22]' : 'text-slate-800'}`}>{opt.label}</span>
                {opt.desc && <span className="mt-0.5 block text-sm leading-snug text-slate-400">{opt.desc}</span>}
              </span>
              <span
                aria-hidden
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${isSel ? 'border-[#B37744] bg-[#171B20]' : 'border-slate-300 bg-white'}`}
              >
                {isSel && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* 인라인 혜택/우대요소 패널 — 질문을 지우지 않고 아래에 펼침 */}
      {inlinePanel && (
        <div ref={panelRef} className="mt-4">
          {inlinePanel}
        </div>
      )}

      {/* 하단 내비게이션 (인라인 패널이 열려 있으면 패널 버튼이 진행을 담당) */}
      {!inlinePanel && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-100 bg-white/95 px-5 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="mx-auto flex max-w-[720px] items-center gap-2.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={!canPrev}
              className="min-h-[52px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99257]"
            >
              이전
            </button>
            {isMulti && (
              <button
                type="button"
                onClick={onNext}
                disabled={(selected as string[]).length === 0}
                className="flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#171B20] px-6 py-3 text-base font-black text-white shadow-sm transition-colors hover:bg-[#0B0E12] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99257]"
              >
                다음 <span aria-hidden>→</span>
              </button>
            )}
            {!isMulti && question.optional && onSkip && (
              <button type="button" onClick={onSkip} className="ml-auto min-h-[52px] px-3 text-sm font-semibold text-slate-400 underline underline-offset-4 hover:text-slate-600">
                나중에 답하기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
