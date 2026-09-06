// 3분 AX Fit 결과 — 짧은 완료 체크 → 즉시 결과. 모바일(세로 스크롤) 우선.
//   ① 한눈에 보기(등급·AX Fit Score)  ② 현재 가장 큰 문제 TOP 3
//   ③ 권장 AX 방향  ④ 다음 행동  → 상담 CTA
// ⚠️ 정책자금·지원금 상품, 금액, 상세페이지 링크는 두지 않는다.
//    성장·정책 관심은 메인 결과와 분리된 작은 확인 항목으로만 받는다.
import { useEffect, useState } from 'react'
import type { AxFitProblem, AxFitReport as Report, SeverityTone } from '../../types/businessDiagnosis'
import { GRADE_META } from '../../lib/businessDiagnosisEngine'

type Props = {
  report: Report
  submitted: boolean
  consultationConsented: boolean
  /** 성장·정책 전략 함께 검토 관심 (메인 결과와 분리) */
  growthInterest?: boolean
  onGrowthInterestChange?: (v: boolean) => void
  onWantConsult: () => void
  onRestart: () => void
  onPrint?: () => void
}

const GRADE_TONE: Record<SeverityTone, { chip: string; ring: string; text: string }> = {
  blue: { chip: 'bg-blue-600 text-white', ring: 'border-blue-200 bg-blue-50/60', text: 'text-blue-700' },
  green: { chip: 'bg-emerald-600 text-white', ring: 'border-emerald-200 bg-emerald-50/60', text: 'text-emerald-700' },
  amber: { chip: 'bg-amber-500 text-white', ring: 'border-amber-200 bg-amber-50/70', text: 'text-amber-700' },
  orange: { chip: 'bg-orange-600 text-white', ring: 'border-orange-200 bg-orange-50/70', text: 'text-orange-700' },
  red: { chip: 'bg-red-600 text-white', ring: 'border-red-200 bg-red-50/70', text: 'text-red-700' },
}

// 문제 카드 색상 — 앰버/주황 계열로 '먼저 볼 것'을 분명히
const PRIO_TONE: Record<SeverityTone, { card: string; num: string; chip: string; label: string }> = {
  red: { card: 'border-red-300 bg-red-50', num: 'bg-red-500', chip: 'bg-red-100 text-red-700', label: '먼저 해결' },
  orange: { card: 'border-orange-300 bg-orange-50', num: 'bg-orange-500', chip: 'bg-orange-100 text-orange-800', label: '가장 큰 문제' },
  amber: { card: 'border-amber-300 bg-amber-50', num: 'bg-amber-500', chip: 'bg-amber-100 text-amber-800', label: '함께 볼 문제' },
  blue: { card: 'border-blue-200 bg-blue-50', num: 'bg-blue-500', chip: 'bg-blue-100 text-blue-700', label: '점검' },
  green: { card: 'border-emerald-200 bg-emerald-50', num: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-800', label: '양호' },
}

const GRADE_ORDER: Array<keyof typeof GRADE_META> = ['NO_GO', 'LITE', 'FULL', 'HIGH']

function SectionHeading({ step, title, sub }: { step?: string; title: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2.5">
      {step && <span className="text-sm font-black text-blue-600">{step}</span>}
      <div>
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h3>
        {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
      </div>
    </div>
  )
}

function TopProblemsSection({ items }: { items: AxFitProblem[] }) {
  return (
    <section className="mt-7 sm:mt-9">
      <SectionHeading step="②" title="현재 가장 큰 문제 TOP 3" sub="점수를 낮추려는 게 아니라, 어디부터 볼지 순서를 잡기 위한 안내예요." />
      {items.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[0.98rem] leading-relaxed text-slate-600">
          답변에서 뚜렷한 문제 신호가 보이지 않아요. 지금 방식이 잘 맞고 있다는 뜻이니, 규모가 커질 때 다시 확인해보세요.
        </p>
      ) : (
        <div className="mt-4 space-y-3.5">
          {items.map((p) => {
            const tone = PRIO_TONE[p.tone]
            return (
              <div key={p.rank} className={`rounded-2xl border-2 p-5 sm:p-6 ${tone.card}`}>
                <div className="flex items-start gap-3.5">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg font-black text-white ${tone.num}`}>{p.rank}</span>
                  <div className="min-w-0 flex-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${tone.chip}`}>{tone.label}</span>
                    <p className="mt-2 text-[1.2rem] font-black leading-snug text-slate-900">{p.title}</p>
                    <p className="mt-2 text-[1rem] font-semibold leading-relaxed text-slate-700">{p.why}</p>
                    <div className="mt-3 rounded-xl bg-white/70 px-3.5 py-3">
                      <p className="text-[0.82rem] font-black text-slate-400">그대로 두면</p>
                      <p className="mt-1 text-[0.98rem] leading-relaxed text-slate-600">{p.ifIgnored}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

// 마무리 상담 CTA — 결과를 본 뒤 바로 상담으로 (설문 응답까지 함께 전달)
function ClosingConsultCTA({ onConsult }: { onConsult: () => void }) {
  return (
    <section className="mt-8 print:hidden">
      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6 text-center sm:p-7">
        <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">우리 회사 AX 방향을 함께 확인해보세요</h3>
        <p className="mx-auto mt-2 max-w-md text-[0.98rem] leading-relaxed text-slate-600">
          진단 결과를 바탕으로 어디부터 바꾸면 되는지, 어느 범위가 맞는지 함께 정리해 드립니다. 방금 답하신 내용도 같이 전달되니 연락처만 남겨주시면 담당자가 확인 후 연락드립니다.
        </p>
        <button
          type="button"
          onClick={onConsult}
          className="shine-cta mt-4 inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-8 py-3.5 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          AX Fit 상담 신청하기 <span aria-hidden>→</span>
        </button>
        <p className="mt-2.5 text-xs text-slate-400">상담은 무료이며, 진행 여부는 상담 후 결정하시면 됩니다.</p>
      </div>
    </section>
  )
}

export default function AxFitReportView({
  report,
  submitted,
  consultationConsented,
  growthInterest = false,
  onGrowthInterestChange,
  onWantConsult,
  onRestart,
  onPrint,
}: Props) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCount(report.score)
      return
    }
    let raf = 0
    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min(1, (ts - start) / 600)
      setCount(Math.round(report.score * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    const t = setTimeout(() => (raf = requestAnimationFrame(step)), 250)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [report.score])

  const meta = GRADE_META[report.grade]
  const tone = GRADE_TONE[meta.tone]

  function handlePrint() {
    onPrint?.()
    window.print()
  }

  return (
    <div data-print-region className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-7 sm:pt-9">
      {/* 완료 체크 + 헤드라인 */}
      <div className="animate-rise-in flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 print:hidden">
          <svg viewBox="0 0 96 96" className="h-12 w-12 -rotate-90" aria-hidden>
            <circle cx="48" cy="48" r="41" fill="none" stroke="#dcfce7" strokeWidth="9" />
            <circle cx="48" cy="48" r="41" fill="none" stroke="#10b981" strokeWidth="9" strokeLinecap="round" className="animate-ring-draw" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 m-auto" aria-hidden>
            <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600">3분 AX Fit 완료</p>
          <h1 className="text-[1.35rem] font-black leading-tight tracking-tight text-slate-900 sm:text-2xl">{report.headline}</h1>
        </div>
      </div>

      {/* ① 한눈에 보기 — 등급 + AX Fit Score */}
      <section className="mt-6">
        <SectionHeading step="①" title="한눈에 보기" />
        <div className={`mt-4 rounded-2xl border-2 p-5 sm:p-6 ${tone.ring}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span data-ax-grade={report.grade} className={`rounded-lg px-3 py-1.5 text-[1.05rem] font-black tracking-wide ${tone.chip}`}>{report.gradeLabel}</span>
            <span className="text-sm font-bold text-slate-500">
              AX Fit Score <b className={`ml-1 text-[1.35rem] tabular-nums ${tone.text}`}>{count}</b>
              <span className="text-slate-400"> / 100</span>
            </span>
          </div>
          <p className="mt-3 text-[1.02rem] font-semibold leading-relaxed text-slate-800">{report.gradeDesc}</p>
        </div>

        {/* 4단계 위치 표시 — 어디쯤인지 한눈에 */}
        <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-label="AX Fit 등급 단계">
          {GRADE_ORDER.map((g) => {
            const on = g === report.grade
            const gt = GRADE_TONE[GRADE_META[g].tone]
            return (
              <li key={g} className={`rounded-lg px-1.5 py-2 text-center text-[0.7rem] font-black leading-tight sm:text-[0.78rem] ${on ? gt.chip : 'bg-slate-100 text-slate-400'}`}>
                {GRADE_META[g].label}
              </li>
            )
          })}
        </ol>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          이 점수는 승인·선정 확률이 아니라, 현재 업무방식 기준으로 별도 AX가 맞는지 가늠하는 내부 판단 지표입니다.
        </p>
      </section>

      {/* ② 현재 가장 큰 문제 TOP 3 */}
      <TopProblemsSection items={report.topProblems} />

      {/* ③ 권장 AX 방향 */}
      <section className="mt-7 sm:mt-9 print:break-inside-avoid">
        <SectionHeading step="③" title="권장 AX 방향" />
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[1.15rem] font-black leading-snug text-slate-900">{report.direction.title}</p>
          <ul className="mt-3 space-y-2">
            {report.direction.points.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[0.98rem] font-semibold leading-snug text-slate-700">
                <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-900 text-[11px] font-black text-white">→</span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-xs font-black text-slate-400">내부 담당자</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-inset ring-slate-200">{report.readiness.label}</span>
            <span className="text-sm font-medium text-slate-500">{report.readiness.note}</span>
          </div>
        </div>
      </section>

      {/* ④ 다음 행동 */}
      <section className="mt-7 sm:mt-9 print:break-inside-avoid">
        <SectionHeading step="④" title="다음 행동" />
        <ol className="mt-4 space-y-2.5">
          {report.nextActions.map((t, i) => (
            <li key={t} className="flex items-start gap-3 rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 py-3.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-black text-white">{i + 1}</span>
              <p className="text-[1rem] font-bold leading-snug text-slate-900">{t}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 성장·정책 관심 — 메인 결과와 분리된 작은 확인 항목 */}
      {onGrowthInterestChange && !submitted && (
        <label className="mt-6 flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 print:hidden">
          <input
            type="checkbox"
            checked={growthInterest}
            onChange={(e) => onGrowthInterestChange(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-slate-900"
          />
          <span className="min-w-0">
            <span className="block text-[0.95rem] font-bold text-slate-800">정책·R&D·기업성장 전략도 함께 검토하시겠습니까?</span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
              AX 도입 과정에서 만들어지는 데이터·기술·실증성과는 향후 정책지원·R&D·기업성장 전략에서도 활용 가능한 근거가 될 수 있습니다. 상담 시 함께 다룹니다.
            </span>
          </span>
        </label>
      )}

      {/* 상담 CTA — 제출 전에만 */}
      {!submitted ? (
        <ClosingConsultCTA onConsult={onWantConsult} />
      ) : (
        <div className="mt-9">
          <div className="animate-pop-in mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200 print:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
            {consultationConsented ? '상담 요청이 함께 접수되었습니다' : '진단 결과가 저장되었습니다'}
          </div>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              결과 인쇄 · PDF 저장
            </button>
            <button type="button" onClick={onRestart} className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50">
              처음부터 다시 진단하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
