// 3분 AX Fit 결과 — 설문 결과표가 아니라 "진단서"처럼 읽히게 구성한다.
//   ① 판정 카드(어두운 패널): 한 문장 판정 + 등급 + AX Fit Score + 4단계 중 현재 위치
//   ② 지금 걸려 있는 3가지: 카드 3장으로 흩어 놓지 않고 한 박스 안에서 1·2·3 을
//      색·크기·정보량으로 차등한다. 무게는 대표님이 고른 답(거의 항상/자주/가끔)을
//      그대로 되돌려 보여주는 것으로 만든다 — 없는 수치나 금액을 만들지 않는다.
//   ③ 같은 박스 아래 어두운 띠: "이대로 두면" 을 한 곳에 모은다(긴박감은 여기 한 번만).
//   ④ 그럼, 무엇부터: 권장 방향과 다음 행동을 한 섹션으로 합친다.
//   → 함께 검토할 분야 → 상담 CTA
// ⚠️ 정책자금·지원금 상품, 금액, 상세페이지 링크는 두지 않는다.
//    성장·정책 관심은 메인 결과와 분리된 선택 항목으로만 받는다.
import { useEffect, useState } from 'react'
import type { AxFitGrade, AxFitProblem, AxFitReport as Report, SeverityTone } from '../../types/businessDiagnosis'
import { GRADE_META } from '../../lib/businessDiagnosisEngine'
import { isInAppBrowser, isIos, runPrint } from '../../lib/printPage'
import InterestPicker from '../consult/InterestPicker'

type Props = {
  report: Report
  submitted: boolean
  consultationConsented: boolean
  /** 함께 검토하고 싶은 분야 — 메인 결과와 분리해서, 분야 이름만 여러 개 고른다 */
  growthInterests?: string[]
  onGrowthInterestsChange?: (v: string[]) => void
  onWantConsult: () => void
  onRestart: () => void
  onPrint?: () => void
}

const GRADE_ORDER: AxFitGrade[] = ['NO_GO', 'LITE', 'FULL', 'HIGH']

// 판정 카드(어두운 배경)에서 쓰는 등급 색. 인쇄용 대체는 각 요소에서 print: 로 지정한다.
const VERDICT_SKIN: Record<SeverityTone, { fill: string; edge: string; chip: string; on: string; text: string }> = {
  blue: { fill: 'bg-blue-400', edge: 'bg-blue-400', chip: 'bg-blue-400/15 text-blue-200 ring-1 ring-inset ring-blue-300/30', on: 'bg-blue-500 text-white', text: 'text-blue-300' },
  green: { fill: 'bg-emerald-400', edge: 'bg-emerald-400', chip: 'bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-300/30', on: 'bg-emerald-500 text-white', text: 'text-emerald-300' },
  amber: { fill: 'bg-amber-400', edge: 'bg-amber-400', chip: 'bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-300/30', on: 'bg-amber-400 text-slate-900', text: 'text-amber-300' },
  orange: { fill: 'bg-orange-400', edge: 'bg-orange-400', chip: 'bg-orange-400/15 text-orange-200 ring-1 ring-inset ring-orange-300/30', on: 'bg-orange-400 text-slate-900', text: 'text-orange-300' },
  red: { fill: 'bg-red-500', edge: 'bg-red-500', chip: 'bg-red-500/15 text-red-200 ring-1 ring-inset ring-red-400/30', on: 'bg-red-500 text-white', text: 'text-red-300' },
}

// 1·2·3 의 무게 차이 — 같은 박스 안에서 색·번호 크기·글자 크기·정보량이 순서대로 줄어든다.
// (순서를 나타내는 옷이고, 강도는 아래 SEV_SKIN 이 따로 맡는다)
const RANK_SKIN = [
  {
    row: 'bg-gradient-to-r from-red-50 via-red-50/60 to-white',
    edge: 'bg-red-500',
    num: 'h-11 w-11 bg-red-500 text-[1.15rem] text-white ring-4 ring-red-100',
    tag: 'bg-red-600 text-white',
    tagText: '가장 크게 걸려 있는 문제',
    title: 'text-[1.2rem] sm:text-[1.32rem]',
  },
  {
    row: 'bg-white',
    edge: 'bg-orange-400',
    num: 'h-9 w-9 bg-orange-500 text-[1rem] text-white',
    tag: 'bg-orange-100 text-orange-800',
    tagText: '이어서 볼 문제',
    title: 'text-[1.06rem] sm:text-[1.14rem]',
  },
  {
    row: 'bg-white',
    edge: 'bg-slate-300',
    num: 'h-9 w-9 bg-slate-400 text-[1rem] text-white',
    tag: 'bg-slate-100 text-slate-600',
    tagText: '함께 볼 문제',
    title: 'text-[1.06rem] sm:text-[1.14rem]',
  },
]

// 강도 막대·답변 글자색은 '순위'가 아니라 '고른 답'을 따라간다.
// (3순위여도 '거의 항상 그렇다'면 빨강 — 순위 색을 따르면 답과 어긋나 보인다)
const SEV_SKIN: Record<number, { bar: string; text: string }> = {
  1: { bar: 'bg-amber-400', text: 'text-amber-700' },
  2: { bar: 'bg-orange-500', text: 'text-orange-700' },
  3: { bar: 'bg-red-500', text: 'text-red-700' },
}

const eyebrow = 'text-[0.78rem] font-black uppercase tracking-[0.14em]'
const h2Cls = 'mt-1.5 break-keep text-[1.42rem] font-black leading-[1.28] tracking-tight text-slate-900 sm:text-[1.7rem]'

/** 답변 강도 3칸 막대 — 고른 답을 그대로 옆에 적는다 */
function SeverityMeter({ severity, answerLabel }: { severity?: number; answerLabel?: string }) {
  if (!severity || !answerLabel) return null
  const sev = SEV_SKIN[severity] ?? SEV_SKIN[1]
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <span aria-hidden className="flex items-center gap-1">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-[5px] w-[18px] rounded-full ${i <= severity ? sev.bar : 'bg-slate-200'}`} />
        ))}
      </span>
      <span className={`text-[0.86rem] font-black ${sev.text}`}>
        <span className="font-semibold text-slate-500">대표님 답변 · </span>
        {answerLabel}
      </span>
    </p>
  )
}

/** ② 지금 걸려 있는 3가지 + ③ 이대로 두면 — 하나의 박스로 묶는다 */
function ProblemsCard({ items, painCount, painTotal }: { items: AxFitProblem[]; painCount?: number; painTotal?: number }) {
  if (items.length === 0) {
    return (
      <section className="mt-8">
        <p className={`${eyebrow} text-slate-400`}>대표님이 답하신 내용</p>
        <h2 className={h2Cls}>지금은 뚜렷하게 걸리는 지점이 없습니다.</h2>
        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[1rem] leading-relaxed text-slate-600">
          답변에서 뚜렷한 문제 신호가 보이지 않아요. 지금 방식이 잘 맞고 있다는 뜻이니, 규모가 커질 때 다시 확인해보세요.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-8 print:break-inside-avoid">
      <p className={`${eyebrow} text-red-600`}>대표님이 답하신 내용</p>
      <h2 className={h2Cls}>지금 회사에서 가장 크게<br className="sm:hidden" /> 걸려 있는 3가지</h2>
      {painCount != null && painTotal != null && (
        <p className="mt-3 inline-flex flex-wrap items-baseline gap-x-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-[0.95rem] font-semibold text-slate-600">
          업무 질문 <b className="text-[1.05rem] font-black text-slate-900">{painTotal}개</b> 중
          <b className="text-[1.05rem] font-black text-red-600">{painCount}개</b>에
          <span className="font-bold text-slate-700">‘자주 그렇다’ 이상으로 답하셨어요</span>
        </p>
      )}

      {/* 1·2·3 을 나란히 — 나뉜 카드가 아니라 한 장의 목록으로 읽히게 한다 */}
      <div className="mt-4 overflow-hidden rounded-[1.4rem] border-2 border-slate-900/10 shadow-lg shadow-slate-900/5">
        <ol className="divide-y divide-slate-200">
          {items.map((p, i) => {
            const skin = RANK_SKIN[Math.min(i, RANK_SKIN.length - 1)]
            return (
              <li key={p.rank} className={`relative flex items-start gap-3.5 py-5 pl-5 pr-5 sm:gap-4 sm:py-6 sm:pl-6 sm:pr-6 ${skin.row}`}>
                <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${skin.edge}`} />
                <span className={`grid shrink-0 place-items-center rounded-full font-black ${skin.num}`}>{p.rank}</span>
                <div className="min-w-0 flex-1">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.75rem] font-black ${skin.tag}`}>{skin.tagText}</span>
                  <p className={`mt-2 break-keep font-black leading-[1.35] text-slate-900 ${skin.title}`}>{p.title}</p>
                  <SeverityMeter severity={p.severity} answerLabel={p.answerLabel} />
                  {/* 1위에만 '왜 문제인지' 를 붙여 시선이 맨 위에서 멈추게 한다 */}
                  {i === 0 && <p className="mt-3 break-keep text-[1rem] font-semibold leading-relaxed text-slate-700">{p.why}</p>}
                </div>
              </li>
            )
          })}
        </ol>

        {/* ③ 이대로 두면 — 결과를 세 카드에 흩지 않고 여기 한 곳에 모은다 */}
        <div className="bg-slate-900 px-5 py-5 sm:px-6 sm:py-6 print:bg-white print:ring-1 print:ring-slate-300">
          <p className={`${eyebrow} text-amber-300 print:text-amber-700`}>이대로 두면</p>
          <ul className="mt-3 space-y-2.5">
            {items.map((p) => (
              <li key={p.rank} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md bg-white/10 text-[0.78rem] font-black text-slate-300 print:bg-slate-100 print:text-slate-600">
                  {p.rank}
                </span>
                <p className="break-keep text-[0.98rem] leading-relaxed text-slate-200 print:text-slate-700">{p.ifIgnored}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** ④ 그럼, 무엇부터 — 권장 방향 + 다음 행동을 한 섹션으로 */
function ActionPlan({ report }: { report: Report }) {
  return (
    <section className="mt-9 print:break-inside-avoid">
      <p className={`${eyebrow} text-blue-600`}>그럼, 무엇부터 할까요?</p>
      <h2 className={h2Cls}>{report.direction.title}</h2>

      <ul className="mt-4 space-y-2">
        {report.direction.points.map((t) => (
          <li key={t} className="flex items-start gap-2.5 rounded-xl bg-blue-50/70 px-4 py-3">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="mt-[3px] shrink-0 text-blue-600" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
            <p className="break-keep text-[1rem] font-semibold leading-relaxed text-slate-800">{t}</p>
          </li>
        ))}
      </ul>

      {/* 다음 행동 — 세로 연결선으로 '순서'가 보이게 */}
      <p className="mt-7 text-[1.02rem] font-black text-slate-900">다음 행동</p>
      <ol className="relative mt-3 space-y-3 border-l-2 border-dashed border-slate-200 pl-5">
        {report.nextActions.map((t, i) => (
          <li key={t} className="relative">
            {/* 점선 위에 번호가 정확히 걸치도록 — pl-5(20px) + 지름 24px 의 절반 = 32px */}
            <span aria-hidden className="absolute -left-8 top-0 grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-[0.78rem] font-black text-white">
              {i + 1}
            </span>
            <p className="break-keep text-[1rem] font-bold leading-relaxed text-slate-800">{t}</p>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-[0.8rem] font-black text-slate-400">내부 담당자</span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[0.82rem] font-black text-slate-700 ring-1 ring-inset ring-slate-200">{report.readiness.label}</span>
        <span className="break-keep text-[0.95rem] font-medium text-slate-500">{report.readiness.note}</span>
      </div>
    </section>
  )
}

// 마무리 상담 CTA — 방금 읽은 3가지와 바로 이어지게.
// 걸리는 지점이 없던 대표님에게는 '이 중'이 가리킬 것이 없으니 문장을 바꾼다.
function ClosingConsultCTA({ onConsult, hasProblems }: { onConsult: () => void; hasProblems: boolean }) {
  return (
    <section data-closing-cta className="mt-9 print:hidden">
      <div className="rounded-[1.4rem] border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6 text-center sm:p-7">
        <h3 className="break-keep text-[1.32rem] font-black leading-tight tracking-tight text-slate-900 sm:text-2xl">
          {hasProblems ? (
            <>이 중 무엇부터 손볼지,<br className="sm:hidden" /> 같이 정리해 드립니다.</>
          ) : (
            <>지금 구성이 맞는지,<br className="sm:hidden" /> 같이 확인해 드립니다.</>
          )}
        </h3>
        <p className="mx-auto mt-2.5 max-w-md break-keep text-[0.98rem] leading-relaxed text-slate-600">
          방금 답하신 10개 문항과 진단 결과가 함께 전달됩니다. 연락처만 남겨주시면 담당자가 확인 후 연락드립니다.
        </p>
        <button
          type="button"
          onClick={onConsult}
          className="shine-cta mt-5 inline-flex min-h-[56px] w-full max-w-sm items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-8 py-3.5 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          AX Fit 상담 신청하기 <span aria-hidden>→</span>
        </button>
        <p className="mt-2.5 text-[0.82rem] text-slate-400">상담은 무료이며, 진행 여부는 상담 후 결정하시면 됩니다.</p>
      </div>
    </section>
  )
}

export default function AxFitReportView({
  report,
  submitted,
  consultationConsented,
  growthInterests = [],
  onGrowthInterestsChange,
  onWantConsult,
  onRestart,
  onPrint,
}: Props) {
  const [count, setCount] = useState(0)
  const [printHelp, setPrintHelp] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
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
  const skin = VERDICT_SKIN[meta.tone]

  // 인쇄가 실제로 시작됐는지 확인해, 안 되는 브라우저(카톡·네이버 앱 안 등)에서는 다른 방법을 안내한다
  async function handlePrint() {
    onPrint?.()
    setPrintHelp(false)
    const ok = await runPrint()
    if (!ok) setPrintHelp(true)
  }

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      setLinkCopied(false)
    }
  }

  return (
    <div data-print-region className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-6 sm:pt-8">
      {/* ① 판정 카드 — 첫 화면에서 판정 한 문장이 가장 먼저 읽히게 */}
      <section className="animate-rise-in overflow-hidden rounded-[1.6rem] bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8 print:bg-white print:text-slate-900 print:shadow-none print:ring-1 print:ring-slate-300">
        <div className="flex items-center gap-2">
          <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
            </svg>
          </span>
          <p className={`${eyebrow} text-emerald-300 print:text-emerald-700`}>3분 AX Fit 진단 완료</p>
        </div>

        <h1 className="mt-3.5 break-keep text-[1.68rem] font-black leading-[1.28] tracking-tight sm:text-[2.2rem]">{report.headline}</h1>

        {/* 등급 + 점수 — 판정 문장을 뒷받침하는 근거 두 줄 */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span data-ax-grade={report.grade} className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[1.02rem] font-black ${skin.chip} print:ring-slate-300 print:text-slate-900`}>
            <span aria-hidden className={`h-3.5 w-1 rounded-full ${skin.edge}`} />
            {report.gradeLabel}
          </span>
          <span className="text-[0.95rem] font-bold text-slate-400 print:text-slate-600">
            {/* 0 → 70 으로 올라갈 때 자릿수가 늘며 옆 글자가 밀리지 않도록 자리를 미리 잡는다 */}
            AX Fit Score <b className="ml-1 inline-block min-w-[2.2ch] text-right text-[1.4rem] tabular-nums text-white print:text-slate-900">{count}</b>
            <span className="text-slate-500"> / 100</span>
          </span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/12 print:bg-slate-200">
          <div className={`h-full rounded-full transition-[width] duration-500 ease-out ${skin.fill}`} style={{ width: `${count}%` }} />
        </div>

        <p className="mt-4 break-keep text-[1.02rem] font-semibold leading-relaxed text-slate-300 print:text-slate-700">{report.gradeDesc}</p>

        {/* 4단계 중 현재 위치 */}
        <ol className="mt-5 grid grid-cols-4 gap-1.5" aria-label="AX Fit 등급 단계">
          {GRADE_ORDER.map((g, i) => {
            const on = g === report.grade
            return (
              <li
                key={g}
                aria-current={on ? 'step' : undefined}
                className={`rounded-lg px-1 py-2 text-center text-[0.75rem] font-black leading-tight sm:text-[0.82rem] ${
                  on ? skin.on : 'bg-white/8 text-slate-500 print:bg-slate-100 print:text-slate-400'
                }`}
              >
                <span className="block text-[0.75rem] font-bold opacity-70">{i + 1}단계</span>
                {GRADE_META[g].label}
              </li>
            )
          })}
        </ol>
        <p className="mt-3 break-keep text-[0.82rem] leading-relaxed text-slate-400 print:text-slate-500">
          이 점수는 승인이나 선정 가능성을 뜻하지 않습니다. 지금 일하는 방식으로 볼 때 우리 회사에 따로 AX를 만드는 게 맞는지 가늠해 보는 내부 기준입니다.
        </p>
      </section>

      {/* ② 지금 걸려 있는 3가지 + ③ 이대로 두면 */}
      <ProblemsCard items={report.topProblems} painCount={report.painCount} painTotal={report.painTotal} />

      {/* ④ 그럼, 무엇부터 */}
      <ActionPlan report={report} />

      {/* 함께 검토하고 싶은 분야 — 메인 결과와 분리된 선택 항목. 썸네일·가격 없이 목차별로 고른다. */}
      {onGrowthInterestsChange && !submitted && (
        <section className="mt-9 rounded-2xl border border-slate-200 bg-white px-4 py-4 print:hidden sm:px-5">
          <p className="text-[1rem] font-black text-slate-900">함께 검토하고 싶은 분야가 있으신가요? (선택)</p>
          <p className="mt-1 text-[0.85rem] leading-snug text-slate-500">
            AX 과정에서 만들어지는 데이터·기술·실증성과는 다른 분야에서도 근거로 쓰일 수 있습니다. 고르신 분야는 상담 때 함께 다룹니다.
          </p>
          <div className="mt-3">
            <InterestPicker idPrefix="fit" value={growthInterests} onChange={onGrowthInterestsChange} />
          </div>
        </section>
      )}

      {/* 상담 CTA — 제출 전에만 */}
      {!submitted ? (
        <ClosingConsultCTA onConsult={onWantConsult} hasProblems={report.topProblems.length > 0} />
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

          {/* 인쇄창이 뜨지 않는 브라우저(카카오톡·네이버 앱 안 등) — 대신 어떻게 하면 되는지 알려준다 */}
          {printHelp && (
            <div className="animate-rise-in mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 print:hidden">
              <p className="text-sm font-black text-amber-900">인쇄 창이 열리지 않았어요</p>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-900">
                {isInAppBrowser()
                  ? '카카오톡·네이버 같은 앱 안의 브라우저는 인쇄를 지원하지 않아요. 아래 주소를 복사해 크롬이나 사파리에서 열면 PDF로 저장할 수 있어요.'
                  : '이 브라우저에서는 인쇄 창을 열 수 없어요. 아래 방법으로 저장해 주세요.'}
              </p>
              <ul className="mt-2.5 space-y-1 text-sm leading-relaxed text-amber-900">
                {isInAppBrowser() && <li>· 오른쪽 위 <b>⋯ (더보기)</b> → <b>다른 브라우저로 열기</b></li>}
                {isIos() ? (
                  <li>· 사파리: 아래 <b>공유</b> → <b>프린트</b> → 미리보기를 두 손가락으로 벌리면 PDF로 저장돼요</li>
                ) : (
                  <li>· 크롬: 오른쪽 위 <b>⋮</b> → <b>공유</b> → <b>인쇄</b> → 대상을 <b>PDF로 저장</b></li>
                )}
                <li>· PC에서 열었다면 <b>Ctrl</b>(맥은 <b>⌘</b>) + <b>P</b> 로도 저장할 수 있어요</li>
              </ul>
              <button
                type="button"
                onClick={copyPageLink}
                className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-amber-400 bg-white px-4 py-2 text-sm font-bold text-amber-900 transition-colors hover:bg-amber-100"
              >
                {linkCopied ? '주소를 복사했어요 ✓' : '이 결과 페이지 주소 복사'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
