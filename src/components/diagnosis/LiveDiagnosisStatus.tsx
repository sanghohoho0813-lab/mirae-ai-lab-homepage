// 실시간 진단 현황 — 질문에 답할 때마다 '잘 갖춘 점 / 확인할 점 / 담은 추천' 수가 바뀝니다.
// 방금 늘어난 항목은 잠깐 강조(스케일+링)해서 변화가 눈에 보이게 합니다.
import { useEffect, useRef, useState } from 'react'
import type { LiveStatus } from '../../types/businessDiagnosis'

type ToneKey = 'emerald' | 'amber' | 'blue'
const TONE: Record<ToneKey, { box: string; dot: string; flash: string }> = {
  emerald: { box: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500 text-white', flash: 'ring-2 ring-emerald-400' },
  amber: { box: 'border-amber-200 bg-amber-50', dot: 'bg-amber-500 text-white', flash: 'ring-2 ring-amber-400' },
  blue: { box: 'border-blue-200 bg-blue-50', dot: 'bg-blue-600 text-white', flash: 'ring-2 ring-blue-400' },
}

const STATS: { key: 's' | 'g' | 'i'; label: string; tone: ToneKey }[] = [
  { key: 's', label: '잘 갖춘 점', tone: 'emerald' },
  { key: 'g', label: '확인할 점', tone: 'amber' },
  { key: 'i', label: '담은 추천', tone: 'blue' },
]

export default function LiveDiagnosisStatus({ status }: { status: LiveStatus }) {
  const counts = { s: status.strengthCount, g: status.gapCount, i: status.interestCount }
  const prev = useRef(counts)
  const [pulse, setPulse] = useState({ s: false, g: false, i: false })

  useEffect(() => {
    const up = { s: counts.s > prev.current.s, g: counts.g > prev.current.g, i: counts.i > prev.current.i }
    prev.current = counts
    if (up.s || up.g || up.i) {
      setPulse(up)
      const t = setTimeout(() => setPulse({ s: false, g: false, i: false }), 700)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts.s, counts.g, counts.i])

  return (
    <div className="mx-auto w-full max-w-[860px] px-4 pt-3 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between px-0.5 pb-1.5">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">실시간 진단 현황</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            답변마다 갱신
          </span>
        </div>
        <div className="flex items-stretch gap-2">
          {STATS.map((st) => {
            const val = counts[st.key]
            const on = pulse[st.key]
            const tone = TONE[st.tone]
            return (
              <div
                key={st.key}
                className={`flex flex-1 items-center gap-2 rounded-xl border px-2.5 py-2 transition-all duration-200 ${tone.box} ${on ? `scale-[1.04] ${tone.flash}` : ''}`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm font-black tabular-nums ${tone.dot}`}>{val}</span>
                <span className="text-[11px] font-bold leading-tight text-slate-600 sm:text-xs">{st.label}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-2 flex items-start gap-1.5 px-0.5 text-[13px] font-semibold leading-snug text-slate-600">
          <span aria-hidden className="mt-px text-blue-500">▸</span>
          {status.headline}
        </p>
      </div>
    </div>
  )
}
