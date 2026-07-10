// 결과 화면 — 영역별 준비도 카드 (점수 count-up + 바 + 펼쳐지는 근거).
import { useEffect, useRef, useState } from 'react'
import type { AreaResult } from '../../types/businessDiagnosis'

const PRIORITY_TONE: Record<AreaResult['priority'], string> = {
  '지금 필요': 'bg-blue-600 text-white',
  '있으면 유리': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  '현재 우선순위 낮음': 'bg-slate-100 text-slate-500',
  '먼저 해결할 선결과제': 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300',
}

const STATUS_TONE: Record<AreaResult['status'], string> = {
  '먼저 준비 필요': 'text-amber-700',
  '보완하면 활용 가능': 'text-blue-700',
  '활용 검토 가능': 'text-emerald-700',
}

function useCountUp(target: number, delayMs: number, reduce: boolean) {
  const [value, setValue] = useState(reduce ? target : 0)
  const raf = useRef<number>(0)
  useEffect(() => {
    if (reduce) {
      setValue(target)
      return
    }
    let start: number | null = null
    const dur = 700
    const timer = setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts
        const p = Math.min(1, (ts - start) / dur)
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf.current = requestAnimationFrame(step)
      }
      raf.current = requestAnimationFrame(step)
    }, delayMs)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf.current)
    }
  }, [target, delayMs, reduce])
  return value
}

export default function ScoreCard({ result, index }: { result: AreaResult; index: number }) {
  const [open, setOpen] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const value = useCountUp(result.score, 150 + index * 120, reduce)

  return (
    <div className="animate-rise-in rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ animationDelay: `${index * 90}ms` }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:p-5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-extrabold text-slate-900">{result.label}</p>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${PRIORITY_TONE[result.priority]}`}>{result.priority}</span>
          </div>
          <p className="mt-1 text-sm leading-snug text-slate-500">{result.note}</p>
          {/* 점수 바 */}
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                result.score < 40 ? 'bg-amber-400' : result.score < 70 ? 'bg-blue-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-black tabular-nums tracking-tight text-slate-900">{value}</p>
          <p className={`text-[11px] font-black ${STATUS_TONE[result.status]}`}>{result.status}</p>
          <span aria-hidden className={`mt-1 inline-block text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4.5 pb-4 pt-3 sm:px-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">이렇게 판단했어요</p>
          <ul className="mt-2 space-y-1.5">
            {result.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm leading-snug text-slate-600">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
