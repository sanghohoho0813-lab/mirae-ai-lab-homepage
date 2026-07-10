// 단계별 결과 리포트 — 짧은 완료 체크 → 즉시 결과 카드. 로딩처럼 오래 대기하지 않음.
// 추천 상품은 게이트(연락처) 제출 후 공개. 1·2단계는 '계속/여기까지', 3단계는 종합.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdvantageResultItem, ProductRecommendation, StageReportData } from '../../types/businessDiagnosis'
import { getPackageBySlug } from '../../data/businessPackages'
import { ADVANTAGE_DISCLAIMER, ADVANTAGE_GROUP_LABELS, EXPERT_REFERRAL_NOTE } from '../../data/policyAdvantageFactors'
import ScoreCard from './ScoreCard'

type Props = {
  report: StageReportData
  submitted: boolean
  consultationConsented: boolean
  onContinueStage: () => void // 다음 단계
  onWantResult: () => void // 여기까지만 결과 받기 → 게이트
  onContinueAfterSubmit: () => void // 제출 후 이어서 다음 단계
  onRestart: () => void
  onProductClick: (slug: string, rank: string, position: string) => void
  onConsultClick: (slug?: string) => void
}

const TONE: Record<string, string> = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  slate: 'text-slate-900',
}
const RANK_TONE: Record<string, string> = {
  '1순위': 'bg-blue-600 text-white',
  '2순위': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  '장기 검토': 'bg-slate-100 text-slate-500',
}
const ADV_STATUS_TONE: Record<AdvantageResultItem['status'], string> = {
  '보유': 'bg-emerald-100 text-emerald-800',
  '준비 중': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  '검토 추천': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  '자료 확인 필요': 'bg-slate-100 text-slate-600',
  '현재 우선순위 낮음': 'bg-slate-50 text-slate-400',
}

function AdvantageBlock({ report }: { report: StageReportData }) {
  if (!report.advantages || report.advantages.length === 0) return null
  const groups = (['technology', 'management', 'credibility', 'expert'] as const)
    .map((g) => ({ key: g, items: report.advantages!.filter((a) => a.group === g) }))
    .filter((g) => g.items.length > 0)
  return (
    <section className="mt-8">
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">정책자금·지원사업 활용 기반</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {report.ownedAdvantageCount
          ? `평가에 참고될 수 있는 기반 요소를 ${report.ownedAdvantageCount}개 확인했어요.`
          : '지금부터 준비하면 도움이 될 요소들을 정리했어요.'}
      </p>
      <div className="mt-3 space-y-3">
        {groups.map((g) => (
          <div key={g.key} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">{ADVANTAGE_GROUP_LABELS[g.key]}</p>
            <ul className="mt-2.5 space-y-2">
              {g.items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.95rem] font-bold text-slate-800">{item.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-500">{item.expertReferralOnly ? EXPERT_REFERRAL_NOTE : item.description}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${ADV_STATUS_TONE[item.status]}`}>{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{ADVANTAGE_DISCLAIMER}</p>
    </section>
  )
}

function Recommendations({
  recs,
  onProductClick,
  onConsultClick,
}: {
  recs: ProductRecommendation[]
  onProductClick: Props['onProductClick']
  onConsultClick: Props['onConsultClick']
}) {
  if (recs.length === 0) return null
  return (
    <section className="mt-8">
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">대표님께 맞는 서비스</h3>
      <p className="mt-1 text-sm text-slate-500">진단 답변을 바탕으로 우선순위를 정리했어요.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {recs.map((rec, idx) => {
          const pkg = getPackageBySlug(rec.slug)
          if (!pkg) return null
          const position = idx === 0 ? 'result_primary' : 'result_secondary'
          return (
            <article key={rec.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {pkg.imageSrc && (
                <Link to={`/business-services/${pkg.slug}`} onClick={() => onProductClick(rec.slug, rec.rank, position)} className="relative block aspect-[3/2] bg-slate-100">
                  <img src={pkg.imageSrc} alt={pkg.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-4.5">
                <span className={`self-start rounded-full px-2.5 py-1 text-xs font-black ${RANK_TONE[rec.rank]}`}>{rec.rank}</span>
                <h4 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{pkg.name}</h4>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{rec.reason}</p>
                <p className="mt-3 text-xl font-black tracking-tight text-slate-900">{pkg.price}</p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/business-services/${pkg.slug}`} onClick={() => onProductClick(rec.slug, rec.rank, position)} className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700">
                    자세히 보기
                  </Link>
                  <Link to="/business-services#apply" onClick={() => onConsultClick(rec.slug)} className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                    상담 신청
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default function StageReport({
  report,
  submitted,
  consultationConsented,
  onContinueStage,
  onWantResult,
  onContinueAfterSubmit,
  onRestart,
  onProductClick,
  onConsultClick,
}: Props) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCount(report.overallScore)
      return
    }
    let raf = 0
    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min(1, (ts - start) / 600)
      setCount(Math.round(report.overallScore * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    const t = setTimeout(() => (raf = requestAnimationFrame(step)), 250)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [report.overallScore])

  const stageWord = report.depth === 1 ? '1단계' : report.depth === 2 ? '2단계' : '종합진단'
  const canContinue = report.depth < 3

  return (
    <div className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-7 sm:pt-9">
      {/* 완료 체크 + 헤드라인 */}
      <div className="animate-rise-in flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 96 96" className="h-12 w-12 -rotate-90" aria-hidden>
            <circle cx="48" cy="48" r="41" fill="none" stroke="#dcfce7" strokeWidth="9" />
            <circle cx="48" cy="48" r="41" fill="none" stroke="#10b981" strokeWidth="9" strokeLinecap="round" className="animate-ring-draw" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 m-auto" aria-hidden>
            <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600">{stageWord} 완료</p>
          <h1 className="text-[1.35rem] font-black leading-tight tracking-tight text-slate-900 sm:text-2xl">{report.headline}</h1>
        </div>
      </div>

      <p className="animate-rise-in mt-3 text-[0.95rem] leading-relaxed text-slate-600 [animation-delay:60ms]">{report.summary}</p>

      {/* 지표 카드 */}
      <div className="animate-rise-in mt-5 grid gap-3 sm:grid-cols-2 [animation-delay:120ms]">
        {report.metricCards.map((c, i) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">{c.label}</p>
            <p className={`mt-1.5 text-3xl font-black tabular-nums tracking-tight ${TONE[c.tone ?? 'slate']}`}>
              {i === 0 && c.value.endsWith('점') ? `${count}점` : c.value}
            </p>
            {c.sub && <p className="mt-0.5 text-xs font-semibold text-slate-400">{c.sub}</p>}
          </div>
        ))}
      </div>

      {/* 선결과제 */}
      {report.prerequisites.length > 0 && (
        <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-amber-700">먼저 확인할 점</p>
          <ul className="mt-2 space-y-1.5">
            {report.prerequisites.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-amber-900">
                <span aria-hidden className="mt-0.5">!</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 강점 / 확인할 점 */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">잘 갖춰진 부분</p>
          <ul className="mt-3 space-y-2">
            {report.strengths.slice(0, 3).map((s) => (
              <li key={s} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-800">
                <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg>
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">{report.depth === 1 ? '먼저 확인할 점' : '보완하면 좋은 부분'}</p>
          <ul className="mt-3 space-y-2">
            {report.improvements.slice(0, 3).map((s) => (
              <li key={s} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-800">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 가장 시급한 과제 (1단계) */}
      {report.topTask && (
        <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">지금 가장 먼저 할 일</p>
          <p className="mt-1 text-lg font-black leading-snug text-slate-900">{report.topTask}</p>
        </div>
      )}

      {/* 영역 점수 (2·3단계) */}
      {report.areas && report.areas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{report.depth === 3 ? '영역별 준비도' : '자금·지원제도 준비도'}</h3>
          <p className="mt-1 text-sm text-slate-500">카드를 누르면 판단 근거를 볼 수 있어요.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {report.areas.map((a, i) => (
              <ScoreCard key={a.area} result={a} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* 우대요소 (3단계) */}
      <AdvantageBlock report={report} />

      {/* 실행 순서 (3단계) */}
      {report.actionPlan && report.actionPlan.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">추천 실행 순서</h3>
          <ol className="mt-4 space-y-2.5">
            {report.actionPlan.map((step, i) => (
              <li key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-black text-white">{i + 1}</span>
                <span className="text-[0.95rem] font-bold text-slate-800">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 추천 상품 — 제출 후 공개 */}
      {submitted && <Recommendations recs={report.recommendations} onProductClick={onProductClick} onConsultClick={onConsultClick} />}

      {/* ── CTA 영역 ── */}
      {!submitted ? (
        <div className="mt-8">
          {report.nextHint && <p className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium leading-snug text-slate-500">📋 {report.nextHint}</p>}
          <div className="flex flex-col gap-2.5">
            {canContinue && (
              <button
                type="button"
                onClick={onContinueStage}
                className="flex min-h-[56px] items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                {report.depth === 1 ? '2단계 자금·지원제도까지 더 알아보기' : '3단계 인증·성장 인프라도 점검하기'}
                <span aria-hidden>→</span>
              </button>
            )}
            <button
              type="button"
              onClick={onWantResult}
              className={`flex min-h-[52px] items-center justify-center rounded-2xl px-6 py-3.5 text-base font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                canContinue ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700'
              }`}
            >
              {report.depth === 1 ? '여기까지만 결과 받기' : report.depth === 2 ? '지금 결과로 맞춤 안내 받기' : '맞춤 상담 안내 받기'}
            </button>
          </div>
          {canContinue && <p className="mt-3 text-center text-sm text-slate-400">진단은 자동으로 저장되어 나중에 이어서 할 수 있어요.</p>}
        </div>
      ) : (
        <div className="mt-8">
          <div className="animate-pop-in mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
            {consultationConsented ? '상담 요청이 함께 접수되었습니다' : '진단 결과가 저장되었습니다'}
          </div>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-500">
            이 점수는 정책자금 승인확률이나 정부지원사업 선정확률을 의미하지 않습니다. 대표님의 현재 준비상태와 활용
            가능성을 이해하기 위한 내부 진단 지표입니다.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            {canContinue && (
              <button
                type="button"
                onClick={onContinueAfterSubmit}
                className="flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                이어서 다음 단계 진단하기 <span aria-hidden>→</span>
              </button>
            )}
            <button type="button" onClick={onRestart} className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50">
              처음부터 다시 진단하기
            </button>
            <Link to="/business-services" className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50">
              전체 서비스 둘러보기
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
