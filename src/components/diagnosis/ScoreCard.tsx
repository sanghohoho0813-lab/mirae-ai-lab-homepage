// 영역별 준비도 카드 — 점수보다 '현재 상태·지금 할 일'이 먼저. 색상은 심각도 톤을 따릅니다.
// 기본: 상태 문장 + 핵심 근거 1개 + 지금 할 일. '왜 이런 결과가 나왔나요?'로 상세 펼침.
import { useState } from 'react'
import type { AreaResult, SeverityTone } from '../../types/businessDiagnosis'

const TONE: Record<SeverityTone, { chip: string; bar: string; dot: string; sentence: string }> = {
  green: { chip: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', dot: 'bg-emerald-500', sentence: 'text-emerald-800' },
  blue: { chip: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200', bar: 'bg-blue-500', dot: 'bg-blue-500', sentence: 'text-slate-800' },
  amber: { chip: 'bg-amber-100 text-amber-800', bar: 'bg-amber-400', dot: 'bg-amber-500', sentence: 'text-amber-900' },
  orange: { chip: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500', dot: 'bg-orange-500', sentence: 'text-orange-900' },
  red: { chip: 'bg-red-100 text-red-700', bar: 'bg-red-500', dot: 'bg-red-500', sentence: 'text-red-800' },
}

export default function ScoreCard({ result, index }: { result: AreaResult; index: number }) {
  const [open, setOpen] = useState(false)
  const t = TONE[result.tone]

  return (
    <div className="animate-rise-in rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="p-4.5 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-extrabold text-slate-900">{result.label}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-black ${t.chip}`}>{result.status}</span>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-black tabular-nums tracking-tight text-slate-400">{result.score}</p>
            <p className="text-[10px] font-semibold text-slate-400">준비도</p>
          </div>
        </div>

        {/* 현재 상태 문장 */}
        <p className={`mt-2.5 text-[0.95rem] font-bold leading-snug ${t.sentence}`}>{result.statusSentence}</p>

        {/* 지금 할 일 */}
        <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
          <span aria-hidden className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-black text-white ${t.dot}`}>→</span>
          <p className="text-sm font-semibold leading-snug text-slate-700">
            <span className="text-slate-400">지금 할 일 · </span>
            {result.smallAction}
          </p>
        </div>

        {/* 점수 바 (보조) */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden>
          <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${result.score}%` }} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          왜 이런 결과가 나왔나요?
          <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 px-4.5 pb-4 pt-3 sm:px-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">판단 근거</p>
          <ul className="mt-2 space-y-1.5">
            {result.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm leading-snug text-slate-600">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-black uppercase tracking-wide text-amber-600">그대로 두면</p>
          <p className="mt-1 text-sm leading-snug text-slate-600">{result.missText}</p>
        </div>
      )}
    </div>
  )
}
