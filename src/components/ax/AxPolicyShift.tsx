// SECTION #why-ax — 2026 정책자금 심사환경 변화 (압축형). Hero 다음, AxTransform 앞.
// 밀도: 팩트 가로 스크롤(모바일)·계획vs실행 탭(모바일)·GPT+이유 통합 밴드·가로 타임라인·CTA 1개.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { POLICY_SHIFT as S } from '../../data/policyShift2026'

export default function AxPolicyShift({ onIndustry }: { onIndustry: () => void }) {
  const [tab, setTab] = useState<0 | 1>(1) // 모바일 계획/실행 전환 (기본 실행 근거)
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-8">
        {/* 헤더 */}
        <p className="text-sm font-bold uppercase tracking-widest text-teal-600">{S.eyebrow}</p>
        <h2 className="mt-2 max-w-4xl text-2xl font-black leading-[1.25] tracking-tight text-slate-900 sm:text-[1.95rem]">
          {S.titleA} <span className="text-teal-600">{S.titleAccent}</span>{S.titleB}
        </h2>
        <p className="mt-3 max-w-3xl text-[1rem] leading-relaxed text-slate-600">{S.description}</p>

        {/* 팩트 — 데스크톱 4열 / 모바일 가로 스냅 */}
        <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {S.facts.map((f) => (
            <div key={f.title} className="flex w-[80%] shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:w-auto">
              <p className="text-[1.4rem] font-black leading-none tracking-tight text-teal-600">{f.value}</p>
              <p className="mt-2 text-[0.98rem] font-black leading-snug text-slate-900">{f.title}</p>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[0.76rem] leading-relaxed text-slate-400">{S.sourceNote} <span className="font-medium text-slate-500 sm:hidden">· 옆으로 넘겨보세요 →</span></p>

        {/* 계획 vs 실행 근거 — 데스크톱 2열, 모바일 세그먼트 탭 */}
        <div className="mt-6">
          {/* 모바일 세그먼트 */}
          <div className="lg:hidden">
            <div role="tablist" aria-label="계획 vs 실행 근거" className="flex rounded-xl bg-slate-100 p-1">
              {['계획만 있는 상태', '확인 가능한 실행 근거'].map((t, i) => (
                <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i as 0 | 1)}
                  className={`min-h-[40px] flex-1 rounded-lg px-3 text-[0.9rem] font-bold transition-colors ${tab === i ? (i === 1 ? 'bg-teal-500 text-white' : 'bg-white text-slate-700 shadow-sm') : 'text-slate-500'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className={`mt-3 rounded-2xl border p-4 ${tab === 1 ? 'border-teal-500 bg-teal-50/40' : 'border-dashed border-slate-300 bg-slate-50'}`}>
              <ul className="space-y-1.5">
                {(tab === 1 ? S.evidenceItems : S.planItems).map((it) => (
                  <li key={it} className={`flex items-start gap-2 text-[0.92rem] leading-snug ${tab === 1 ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                    <span aria-hidden className={tab === 1 ? 'mt-0.5 text-teal-500' : 'mt-0.5 text-slate-300'}>{tab === 1 ? '✓' : '○'}</span>{it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* 데스크톱 2열 + 중앙 */}
          <div className="hidden items-stretch gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-[0.82rem] font-black text-slate-500">{S.planLabel}</p>
              <ul className="mt-3 space-y-1.5">
                {S.planItems.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[0.92rem] leading-snug text-slate-500"><span aria-hidden className="mt-0.5 text-slate-300">○</span>{it}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-2">
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/25">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
              <p className="max-w-[9rem] text-center text-[0.78rem] font-bold leading-tight text-teal-600">{S.centerNote}</p>
            </div>
            <div className="rounded-2xl border-2 border-teal-500 bg-teal-50/40 p-5">
              <p className="text-[0.82rem] font-black text-teal-700">{S.evidenceLabel}</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {S.evidenceItems.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[0.92rem] font-semibold leading-snug text-slate-700"><span aria-hidden className="mt-0.5 text-teal-500">✓</span>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* GPT 시대 + AX가 필요한 이유 — 하나의 Navy 밴드 */}
        <div className="mt-6 grid gap-5 rounded-2xl bg-slate-900 p-6 lg:grid-cols-[1.15fr_1fr] lg:items-center sm:p-7">
          <div>
            <p className="text-[1.02rem] font-bold leading-relaxed text-white sm:text-[1.08rem]">{S.bandLead}</p>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-400">{S.definition}</p>
          </div>
          <ol className="grid gap-2">
            {S.bandItems.map((it, i) => (
              <li key={it} className="flex items-start gap-2.5 rounded-xl bg-white/5 px-3.5 py-2.5">
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-teal-400 text-[0.72rem] font-black text-slate-900">{i + 1}</span>
                <span className="text-[0.9rem] font-semibold leading-snug text-slate-200">{it}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 5단계 컴팩트 타임라인 — 데스크톱 가로 한 줄 / 모바일 가로 스크롤 */}
        <div className="mt-6 flex snap-x gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {S.process.map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <div className={`flex w-[9.5rem] shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 lg:w-auto ${i === S.process.length - 1 ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 bg-white'}`}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[0.72rem] font-black ${i === S.process.length - 1 ? 'bg-teal-500 text-white' : 'bg-slate-900 text-white'}`}>{i + 1}</span>
                <span className="text-[0.86rem] font-black leading-tight text-slate-800">{p}</span>
              </div>
              {i < S.process.length - 1 && <span aria-hidden className="hidden shrink-0 text-teal-300 lg:block">›</span>}
            </div>
          ))}
        </div>

        {/* CTA — 1개 버튼 + 보조 링크 (섹션 내부 1회) */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[0.98rem] font-bold text-slate-700">{S.disclaimer}</p>
          <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
            <Link to="/business-diagnosis" className="shine-cta inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-[0.98rem] font-black text-white shadow-lg shadow-teal-500/25 transition-transform hover:-translate-y-0.5">
              <span aria-hidden>🩺</span> {S.ctaButton}
            </Link>
            <button type="button" onClick={onIndustry} className="text-[0.88rem] font-bold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-800">{S.ctaLink} →</button>
          </div>
        </div>
      </div>
    </section>
  )
}
