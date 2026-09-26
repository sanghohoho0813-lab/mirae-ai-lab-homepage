// 상담 신청 접수 완료 알림 — 배경을 어둡게 덮고 가운데에 한 장으로 알린다.
// 제출 직후 한 번만 뜨고, 닫으면 결과 화면(인쇄·PDF 저장 등)으로 돌아간다.
import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  /** 상담 연락 동의 여부에 따라 안내 문구를 바꾼다 */
  consultationConsented?: boolean
}

export default function SubmitDoneOverlay({ open, onClose, consultationConsented = true }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)
  // 부모가 onClose 를 인라인 함수로 넘겨도 effect 가 다시 돌지 않도록 ref 로 붙잡는다
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => btnRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
      // 포커스는 확인 버튼 하나에 머문다
      if (e.key === 'Tab') {
        e.preventDefault()
        btnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-done-title"
      data-submit-done
      className="fixed inset-0 z-[120] flex items-center justify-center px-5 print:hidden"
    >
      <div aria-hidden onClick={onClose} className="animate-fade-in absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
      <div className="animate-pop-in relative w-full max-w-[420px] rounded-3xl bg-white px-6 py-8 text-center shadow-2xl shadow-slate-900/30 sm:px-8 sm:py-9">
        <div className="relative mx-auto h-16 w-16">
          <svg viewBox="0 0 96 96" className="h-16 w-16 -rotate-90" aria-hidden>
            <circle cx="48" cy="48" r="41" fill="none" stroke="#dcfce7" strokeWidth="9" />
            <circle cx="48" cy="48" r="41" fill="none" stroke="#10b981" strokeWidth="9" strokeLinecap="round" className="animate-ring-draw" />
          </svg>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute inset-0 m-auto"
            aria-hidden
          >
            <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
          </svg>
        </div>

        <h2 id="submit-done-title" className="mt-5 text-[1.45rem] font-black leading-tight tracking-tight text-slate-900 sm:text-2xl">
          상담 신청이 접수됐어요
        </h2>
        <p className="mx-auto mt-3 max-w-[20rem] break-keep text-[1rem] leading-relaxed text-slate-600">
          {consultationConsented
            ? '담당 컨설턴트가 차례로 연락드릴게요.'
            : '진단 결과도 저장했어요. 담당 컨설턴트가 차례로 연락드릴게요.'}
        </p>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-400">
          답하신 10개 질문과 결과도 담당자에게 같이 전달됐어요.
        </p>

        <button
          ref={btnRef}
          type="button"
          onClick={onClose}
          className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-base font-black text-white transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          확인
        </button>
        <p className="mt-2.5 text-xs text-slate-400">닫으면 결과를 다시 보거나 PDF로 저장할 수 있어요.</p>
      </div>
    </div>
  )
}
