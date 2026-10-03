// 3분 AX Fit 결과 — 설문 결과표가 아니라 "진단서"처럼 읽히게 구성한다.
//   ① 판정 카드(어두운 패널): 상황 요약 → 한 문장 판정 → 추천 시작 상품(가격) → MVP·플랫폼형·풀 패키지 사다리
//      → 대표님 답에서 뽑은 '이 상품을 권하는 이유' → 정산 안내
//   ② 대표님 상황에 맞춰 같이 준비할 것: 상담 이유(정책자금·지원사업·투자·인증…)별 한 줄
//   ③ 지금 걸려 있는 문제: 업무 신호 4개 중 강한 것 — 한 박스 안에서 1·2·3 을 색·크기로 차등하고,
//      아래 어두운 띠에 "이대로 두면" 을 모은다. 무게는 대표님이 고른 답을 그대로 되돌려 보여준다.
//   ④ 그럼, 무엇부터: 권장 방향과 다음 행동 → 상담 CTA
// ⚠️ 가격은 영상 2편·서비스 선택 페이지와 같은 '부터' 금액만 쓴다. 승인·선정을 약속하는 말은 쓰지 않는다.
import { useState } from 'react'
import type { AxFitProblem, AxFitReport as Report } from '../../types/businessDiagnosis'
import { PACKAGE_META, PACKAGE_ORDER } from '../../lib/businessDiagnosisEngine'
import { isInAppBrowser, isIos, runPrint } from '../../lib/printPage'

type Props = {
  report: Report
  submitted: boolean
  consultationConsented: boolean
  onWantConsult: () => void
  onRestart: () => void
  onPrint?: () => void
}

const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className={`mt-[3px] shrink-0 ${className}`} aria-hidden>
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
)

// 1·2·3 의 무게 차이 — 같은 박스 안에서 색·번호 크기·글자 크기·정보량이 순서대로 줄어든다.
// (순서를 나타내는 옷이고, 강도는 아래 SEV_SKIN 이 따로 맡는다)
const RANK_SKIN = [
  {
    row: 'bg-gradient-to-r from-red-50 via-red-50/60 to-white',
    edge: 'bg-red-500',
    num: 'h-11 w-11 bg-red-500 text-[1.15rem] text-white ring-4 ring-red-100',
    tag: 'bg-red-600 text-white',
    tagText: '가장 큰 문제',
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
// (3순위여도 '거의 항상 그래요'면 빨강 — 순위 색을 따르면 답과 어긋나 보인다)
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

/** ② 대표님 상황에 맞춰 같이 준비할 것 — 상담 이유별 한 줄 */
function FocusCard({ items, note }: { items: Report['focus']; note?: string }) {
  if (!items || items.length === 0) return null
  return (
    <section className="mt-8 print:break-inside-avoid">
      <p className={`${eyebrow} text-[#94602F]`}>대표님 상황에 맞춰</p>
      <h2 className={h2Cls}>상담에서 같이 준비할 것</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((f) => (
          <li key={f.title} className="rounded-2xl border border-[#EBDCCB] bg-[#FBF7F2] px-4 py-3.5">
            <p className="text-[0.98rem] font-black text-slate-900">{f.title}</p>
            <p className="mt-1 break-keep text-[0.95rem] leading-relaxed text-slate-600">{f.text}</p>
          </li>
        ))}
      </ul>
      {note && <p className="mt-2.5 break-keep text-[0.84rem] leading-relaxed text-slate-500">※ {note}</p>}
    </section>
  )
}

/** ③ 지금 걸려 있는 문제 + 이대로 두면 — 하나의 박스로 묶는다 */
function ProblemsCard({ items, painCount, painTotal }: { items: AxFitProblem[]; painCount?: number; painTotal?: number }) {
  // 예비창업은 업무 질문을 묻지 않았다
  if (painTotal === 0) return null
  if (items.length === 0) {
    return (
      <section className="mt-8">
        <p className={`${eyebrow} text-slate-400`}>대표님이 답하신 내용</p>
        <h2 className={h2Cls}>지금은 크게 걸리는 곳이 없어요.</h2>
        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[1rem] leading-relaxed text-slate-600">
          지금 방식이 잘 맞고 있다는 뜻이에요. 회사가 커지면 그때 다시 해 보세요.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-8 print:break-inside-avoid">
      <p className={`${eyebrow} text-red-600`}>대표님이 답하신 내용</p>
      <h2 className={h2Cls}>지금 회사에서 가장 크게<br className="sm:hidden" /> 걸려 있는 {items.length === 1 ? '곳' : `${items.length}가지`}</h2>
      {painCount != null && painTotal != null && (
        <p className="mt-3 inline-flex flex-wrap items-baseline gap-x-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-[0.95rem] font-semibold text-slate-600">
          업무 질문 <b className="text-[1.05rem] font-black text-slate-900">{painTotal}개</b> 중
          <b className="text-[1.05rem] font-black text-red-600">{painCount}개</b>에
          <span className="font-bold text-slate-700">‘자주 그래요’ 이상으로 답하셨어요</span>
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
      <p className={`${eyebrow} text-[#94602F]`}>그럼, 무엇부터 할까요?</p>
      <h2 className={h2Cls}>{report.direction.title}</h2>

      <ul className="mt-4 space-y-2">
        {report.direction.points.map((t) => (
          <li key={t} className="flex items-start gap-2.5 rounded-xl bg-[#F6ECE1]/70 px-4 py-3">
            <CheckIcon className="text-[#94602F]" />
            <p className="break-keep text-[1rem] font-semibold leading-relaxed text-slate-800">{t}</p>
          </li>
        ))}
      </ul>

      {/* 다음 행동 — 세로 연결선으로 '순서'가 보이게 */}
      <p className="mt-7 text-[1.02rem] font-black text-slate-900">다음에 할 일</p>
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

      {report.readiness && (
        <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-[0.8rem] font-black text-slate-400">내부 담당자</span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[0.82rem] font-black text-slate-700 ring-1 ring-inset ring-slate-200">{report.readiness.label}</span>
          <span className="break-keep text-[0.95rem] font-medium text-slate-500">{report.readiness.note}</span>
        </div>
      )}
    </section>
  )
}

// 마무리 상담 CTA — 방금 읽은 3가지와 바로 이어지게.
// 걸리는 지점이 없던 대표님에게는 '이 중'이 가리킬 것이 없으니 문장을 바꾼다.
function ClosingConsultCTA({ onConsult, hasProblems }: { onConsult: () => void; hasProblems: boolean }) {
  // 걸린 문제가 없거나(예비창업 포함) 있으면 문장만 바꾼다
  return (
    <section data-closing-cta className="mt-9 print:hidden">
      <div className="rounded-[1.4rem] border-2 border-[#EBCBAA] bg-gradient-to-b from-[#F6ECE1] to-white p-6 text-center sm:p-7">
        <h3 className="break-keep text-[1.32rem] font-black leading-tight tracking-tight text-slate-900 sm:text-2xl">
          {hasProblems ? (
            <>무엇부터 어디까지 만들지,<br className="sm:hidden" /> 같이 정리해 드립니다.</>
          ) : (
            <>어디서부터 시작할지,<br className="sm:hidden" /> 같이 정해 드립니다.</>
          )}
        </h3>
        <p className="mx-auto mt-2.5 max-w-md break-keep text-[0.98rem] leading-relaxed text-slate-600">
          연락처만 남겨 주세요. 답하신 질문과 결과를 보고 담당자가 연락드려요.
        </p>
        <button
          type="button"
          onClick={onConsult}
          className="shine-cta mt-5 inline-flex min-h-[56px] w-full max-w-sm items-center justify-center gap-1.5 rounded-2xl bg-[#171B20] px-8 py-3.5 text-lg font-black text-white shadow-lg shadow-[#171B20]/15 transition-all hover:-translate-y-0.5 hover:bg-[#0B0E12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99257]"
        >
          AX Fit 상담 신청하기 <span aria-hidden>→</span>
        </button>
        <p className="mt-2.5 text-[0.82rem] text-slate-400">상담은 무료고, 진행 여부는 상담 뒤에 정하시면 돼요.</p>
      </div>
    </section>
  )
}

export default function AxFitReportView({ report, submitted, consultationConsented, onWantConsult, onRestart, onPrint }: Props) {
  const [printHelp, setPrintHelp] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const stepping = report.target !== report.grade

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
      {/* ① 판정 카드 — 첫 화면에서 '어디서 시작할지'가 가장 먼저 읽히게 */}
      <section className="animate-rise-in overflow-hidden rounded-[1.6rem] bg-[#0B0E12] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8 print:bg-white print:text-slate-900 print:shadow-none print:ring-1 print:ring-slate-300">
        <div className="flex items-center gap-2">
          <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
            </svg>
          </span>
          <p className={`${eyebrow} text-emerald-300 print:text-emerald-700`}>3분 AX Fit 진단 완료</p>
        </div>

        {/* 대표님이 답한 상황 — 한 줄 요약 */}
        {report.situation.length > 0 && (
          <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="답하신 상황">
            {report.situation.map((c) => (
              <li key={c.label} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[0.8rem] font-bold text-slate-300 ring-1 ring-inset ring-white/10 print:bg-slate-100 print:text-slate-600">
                {c.value}
              </li>
            ))}
          </ul>
        )}

        <h1 className="mt-3.5 break-keep text-[1.62rem] font-black leading-[1.3] tracking-tight sm:text-[2.1rem]">{report.headline}</h1>

        {/* 추천 시작 상품 */}
        <div data-ax-grade={report.grade} className="mt-5 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-inset ring-[#D8A871]/40 sm:p-5 print:bg-white print:ring-slate-300">
          <p className="text-[0.76rem] font-black tracking-[0.16em] text-[#D8A871] print:text-[#9A5F2F]">추천 시작</p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <p className="text-[1.7rem] font-black leading-tight tracking-tight text-white print:text-slate-900">{report.gradeLabel}</p>
            <p className="text-[1.08rem] font-black tabular-nums text-[#E6C396] print:text-[#9A5F2F]">{report.priceFrom}</p>
          </div>
          <p className="mt-1.5 break-keep text-[0.98rem] leading-relaxed text-slate-300 print:text-slate-700">{report.gradeDesc}</p>
        </div>

        {/* MVP → 플랫폼형 → 풀 패키지 — 시작과 목표를 표시한다 */}
        <ol className="mt-3 grid grid-cols-3 gap-1.5" aria-label="상품 단계">
          {PACKAGE_ORDER.map((g, i) => {
            const isStart = g === report.grade
            const isTarget = stepping && g === report.target
            return (
              <li
                key={g}
                aria-current={isStart ? 'step' : undefined}
                className={`rounded-xl px-1.5 py-2 text-center leading-tight ${
                  isStart
                    ? 'bg-[#D8A871] text-[#0B0E12]'
                    : isTarget
                      ? 'bg-white/[0.04] text-[#E6C396] ring-1 ring-inset ring-[#D8A871]/70'
                      : 'bg-white/[0.06] text-slate-500 print:bg-slate-100 print:text-slate-400'
                }`}
              >
                <span className="block text-[0.7rem] font-bold opacity-80">{isStart ? '여기서 시작' : isTarget ? '목표' : `STEP ${i + 1}`}</span>
                <span className="mt-0.5 block text-[0.9rem] font-black sm:text-[0.98rem]">{PACKAGE_META[g].label}</span>
                <span className="mt-0.5 block text-[0.68rem] font-semibold tabular-nums opacity-80 sm:text-[0.74rem]">{PACKAGE_META[g].price}</span>
              </li>
            )
          })}
        </ol>

        {/* 이 상품을 권하는 이유 — 대표님 답에서만 뽑는다 */}
        {report.reasons.length > 0 && (
          <ul className="mt-5 space-y-2">
            {report.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2.5">
                <CheckIcon className="text-[#D8A871]" />
                <p className="break-keep text-[0.98rem] font-semibold leading-relaxed text-slate-200 print:text-slate-700">{r}</p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-5 break-keep border-t border-white/10 pt-4 text-[0.84rem] leading-relaxed text-slate-400 print:border-slate-200 print:text-slate-500">
          {report.paymentNote} 어떤 상품이든 벤처기업확인 신청까지 함께 준비해요. 확인기관에 내는 심사 수수료는 별도예요.
        </p>
      </section>

      {/* ② 상황별로 같이 준비할 것 */}
      <FocusCard items={report.focus} note={report.focusNote} />

      {/* ③ 지금 걸려 있는 문제 + 이대로 두면 */}
      <ProblemsCard items={report.topProblems} painCount={report.painCount} painTotal={report.painTotal} />

      {/* ④ 그럼, 무엇부터 */}
      <ActionPlan report={report} />

      {/* 상담 CTA — 제출 전에만 */}
      {!submitted ? (
        <ClosingConsultCTA onConsult={onWantConsult} hasProblems={report.topProblems.length > 0} />
      ) : (
        <div className="mt-9">
          <div className="animate-pop-in mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200 print:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
            {consultationConsented ? '상담 요청도 함께 접수됐어요' : '진단 결과를 저장했어요'}
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
                  ? '카카오톡이나 네이버 앱 안에서는 인쇄가 안 돼요. 아래 주소를 복사해 크롬이나 사파리에서 열면 PDF로 저장할 수 있어요.'
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
