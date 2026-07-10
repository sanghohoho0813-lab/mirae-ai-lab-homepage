// 단계별 결과 리포트 — 짧은 완료 체크 → 즉시 결과.
// 1·2단계: 간단 요약(강점/확인할 점). 3단계: 5개 섹션 종합 보고서.
//   ① 한눈에 보기  ② 지금 먼저 확인할 3가지  ③ 놓치고 있을 혜택  ④ 성장 로드맵  ⑤ 맞춤 서비스(제출 후)
//   + 영역별 상세 준비도(접힘). 추천 상품은 게이트(연락처) 제출 후 공개.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  AdvantageResultItem,
  MissedBenefit,
  ProductRecommendation,
  SeverityTone,
  StageReportData,
  TopPriority,
} from '../../types/businessDiagnosis'
import { getPackageBySlug } from '../../data/businessPackages'
import { ADVANTAGE_DISCLAIMER, ADVANTAGE_GROUP_LABELS, EXPERT_REFERRAL_NOTE } from '../../data/policyAdvantageFactors'
import ScoreCard from './ScoreCard'

type Props = {
  report: StageReportData
  submitted: boolean
  consultationConsented: boolean
  onContinueStage: () => void
  onWantResult: () => void
  onContinueAfterSubmit: () => void
  onRestart: () => void
  onProductClick: (slug: string, rank: string, position: string) => void
  onConsultClick: (slug?: string) => void
  onPrint?: () => void
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
// 우선 확인 카드 색상 — 파랑 대신 앰버/주황 계열로 '보완 필요'를 명확히
const PRIO_TONE: Record<SeverityTone, { card: string; num: string; chip: string; label: string }> = {
  red: { card: 'border-red-300 bg-red-50', num: 'bg-red-500', chip: 'bg-red-100 text-red-700', label: '먼저 해결' },
  orange: { card: 'border-orange-300 bg-orange-50', num: 'bg-orange-500', chip: 'bg-orange-100 text-orange-800', label: '우선 확인' },
  amber: { card: 'border-amber-300 bg-amber-50', num: 'bg-amber-500', chip: 'bg-amber-100 text-amber-800', label: '보완 추천' },
  blue: { card: 'border-blue-200 bg-blue-50', num: 'bg-blue-500', chip: 'bg-blue-100 text-blue-700', label: '점검' },
  green: { card: 'border-emerald-200 bg-emerald-50', num: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-800', label: '양호' },
}
const MB_STATUS_TONE: Record<MissedBenefit['status'], string> = {
  '조건 확인 필요': 'bg-amber-100 text-amber-800',
  '현재 검토 가능': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  '자료 확인 필요': 'bg-slate-100 text-slate-600',
  '현재는 대상 가능성 낮음': 'bg-slate-50 text-slate-500',
}
const CONF_TONE: Record<string, string> = {
  '높음': 'bg-emerald-100 text-emerald-800',
  '보통': 'bg-amber-100 text-amber-800',
  '낮음': 'bg-orange-100 text-orange-800',
}

function SectionHeading({ step, title, sub }: { step: string; title: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2.5">
      <span className="text-sm font-black text-blue-600">{step}</span>
      <div>
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h3>
        {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
      </div>
    </div>
  )
}

// ── ② 지금 먼저 확인할 3가지 ──
function TopPrioritiesSection({ items }: { items: TopPriority[] }) {
  if (!items.length) return null
  return (
    <section className="mt-9">
      <SectionHeading step="②" title="지금 먼저 확인할 3가지" sub="점수를 낮추려는 게 아니라, 순서를 잡기 위한 안내예요." />
      <div className="mt-4 space-y-3">
        {items.map((p) => {
          const tone = PRIO_TONE[p.tone]
          const pkg = p.linkedProductSlug ? getPackageBySlug(p.linkedProductSlug) : null
          return (
            <div key={p.rank} className={`rounded-2xl border-2 p-4.5 sm:p-5 ${tone.card}`}>
              <div className="flex items-start gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-base font-black text-white ${tone.num}`}>{p.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${tone.chip}`}>{tone.label}</span>
                  </div>
                  <p className="mt-1.5 text-[1.05rem] font-black leading-snug text-slate-900">{p.problem}</p>
                  <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-600">{p.why}</p>
                  <div className="mt-2.5 rounded-xl bg-white/70 px-3 py-2.5">
                    <p className="text-xs font-black text-slate-400">그대로 두면</p>
                    <p className="mt-0.5 text-sm leading-snug text-slate-600">{p.ifIgnored}</p>
                  </div>
                  {pkg && (
                    <Link
                      to={`/business-services/${pkg.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-700"
                    >
                      도움되는 서비스 · {pkg.name} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── ③ 지금 놓치고 있을 수 있는 혜택 ──
function MissedBenefitsSection({ items }: { items: MissedBenefit[] }) {
  if (!items.length) return null
  return (
    <section className="mt-9">
      <SectionHeading step="③" title="지금 놓치고 있을 수 있는 혜택" sub="조건과 출처를 함께 확인하고, 자동으로 적용되는 것은 아니에요." />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((m) => {
          const pkg = m.linkedProductSlug ? getPackageBySlug(m.linkedProductSlug) : null
          return (
            <div key={m.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-[0.95rem] font-black leading-snug text-slate-900">{m.title}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${MB_STATUS_TONE[m.status]}`}>{m.status}</span>
              </div>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{m.note}</p>
              {m.verified?.conditions && m.verified.conditions.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {m.verified.conditions.slice(0, 2).map((c) => (
                    <li key={c} className="flex items-start gap-1.5 text-xs leading-snug text-amber-900/80">
                      <span aria-hidden className="mt-0.5 font-black">·</span>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {m.verified?.source && (
                <p className="mt-2 text-[11px] text-slate-400">
                  출처 ·{' '}
                  {m.verified.source.url ? (
                    <a href={m.verified.source.url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                      {m.verified.source.name}
                    </a>
                  ) : (
                    m.verified.source.name
                  )}
                </p>
              )}
              {pkg && (
                <Link to={`/business-services/${pkg.slug}`} className="mt-2.5 text-sm font-bold text-blue-600 hover:text-blue-800">
                  관련 서비스 보기 →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── ④ 성장 로드맵 ──
function RoadmapSection({ roadmap }: { roadmap: NonNullable<StageReportData['roadmap']> }) {
  const cols = [
    { key: 'now30', label: '지금 ~ 30일', tone: 'bg-blue-600', items: roadmap.now30 },
    { key: 'm1to3', label: '1 ~ 3개월', tone: 'bg-indigo-500', items: roadmap.m1to3 },
    { key: 'm3to12', label: '3 ~ 12개월', tone: 'bg-slate-500', items: roadmap.m3to12 },
  ].filter((c) => c.items.length > 0)
  if (!cols.length) return null
  return (
    <section className="mt-9">
      <SectionHeading step="④" title="성장 로드맵" sub="무엇을 언제 하면 좋을지 기간별로 정리했어요." />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {cols.map((c) => (
          <div key={c.key} className="rounded-2xl border border-slate-200 bg-white p-4">
            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-black text-white ${c.tone}`}>{c.label}</span>
            <ul className="mt-3 space-y-2">
              {c.items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-sm font-semibold leading-snug text-slate-700">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function AdvantageBlock({ report }: { report: StageReportData }) {
  if (!report.advantages || report.advantages.length === 0) return null
  const groups = (['technology', 'management', 'credibility', 'expert'] as const)
    .map((g) => ({ key: g, items: report.advantages!.filter((a) => a.group === g) }))
    .filter((g) => g.items.length > 0)
  return (
    <section className="mt-9">
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

// ── ⑤ 맞춤 서비스 (제출 후 공개) ──
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
    <section className="mt-9 print:break-inside-avoid">
      <SectionHeading step="⑤" title="대표님께 맞는 서비스" sub="진단 답변을 바탕으로 우선순위를 정리했어요." />
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
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{rec.reason}</p>
                {rec.problems && rec.problems.length > 0 && (
                  <div className="mt-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-[11px] font-black text-slate-400">이런 점을 도와드려요</p>
                    <ul className="mt-1 space-y-1">
                      {rec.problems.map((pr) => (
                        <li key={pr} className="flex items-start gap-1.5 text-xs leading-snug text-slate-600">
                          <span aria-hidden className="mt-0.5 text-blue-500">·</span>
                          {pr}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-3 flex-1 text-xl font-black tracking-tight text-slate-900">{pkg.price}</p>
                <div className="mt-3 flex gap-2 print:hidden">
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
  onPrint,
}: Props) {
  const [count, setCount] = useState(0)
  const [showAreas, setShowAreas] = useState(false)
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
  const isFinal = report.depth === 3

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
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600">{stageWord} 완료</p>
          <h1 className="text-[1.35rem] font-black leading-tight tracking-tight text-slate-900 sm:text-2xl">{report.headline}</h1>
        </div>
      </div>

      {isFinal ? (
        // ═══════════ 3단계 종합 보고서 (5개 섹션) ═══════════
        <>
          {/* ① 한눈에 보기 */}
          <section className="mt-6">
            <SectionHeading step="①" title="한눈에 보기" />
            <p className="animate-rise-in mt-2.5 text-[0.98rem] font-semibold leading-relaxed text-slate-700">{report.summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
            {report.confidence && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-xs font-black text-slate-400">진단 확신도</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${CONF_TONE[report.confidence.level]}`}>{report.confidence.level}</span>
                <span className="text-sm font-medium text-slate-500">{report.confidence.note}</span>
              </div>
            )}
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              이 점수는 정책자금 승인확률이나 정부지원사업 선정확률이 아니라, 현재 준비상태를 이해하기 위한 내부 진단 지표입니다.
            </p>
          </section>

          {report.prerequisites.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-orange-300 bg-orange-50 p-5">
              <p className="text-sm font-black uppercase tracking-wide text-orange-700">먼저 확인할 선결과제</p>
              <ul className="mt-2 space-y-1.5">
                {report.prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-orange-900">
                    <span aria-hidden className="mt-0.5">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.topPriorities && <TopPrioritiesSection items={report.topPriorities} />}
          {report.missedBenefits && <MissedBenefitsSection items={report.missedBenefits} />}
          {report.roadmap && <RoadmapSection roadmap={report.roadmap} />}

          {/* ⑤ 맞춤 서비스 — 제출 후 공개 */}
          {submitted && <Recommendations recs={report.recommendations} onProductClick={onProductClick} onConsultClick={onConsultClick} />}

          <AdvantageBlock report={report} />

          {/* 영역별 상세 준비도 — 접힘 */}
          {report.areas && report.areas.length > 0 && (
            <div className="mt-9 print:hidden">
              <button
                type="button"
                onClick={() => setShowAreas((v) => !v)}
                aria-expanded={showAreas}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <span>
                  <span className="text-base font-extrabold text-slate-900">영역별 상세 준비도</span>
                  <span className="ml-2 text-sm font-semibold text-slate-400">6개 영역 점수·근거</span>
                </span>
                <span aria-hidden className={`text-slate-400 transition-transform ${showAreas ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {showAreas && (
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {report.areas.map((a, i) => (
                    <ScoreCard key={a.area} result={a} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // ═══════════ 1·2단계 간단 요약 ═══════════
        <>
          <p className="animate-rise-in mt-3 text-[0.95rem] leading-relaxed text-slate-600 [animation-delay:60ms]">{report.summary}</p>

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

          {report.prerequisites.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-orange-300 bg-orange-50 p-5">
              <p className="text-sm font-black uppercase tracking-wide text-orange-700">먼저 확인할 점</p>
              <ul className="mt-2 space-y-1.5">
                {report.prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-orange-900">
                    <span aria-hidden className="mt-0.5">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <p className="text-sm font-black uppercase tracking-wide text-amber-700">{report.depth === 1 ? '먼저 확인할 점' : '보완하면 좋은 부분'}</p>
              <ul className="mt-3 space-y-2">
                {report.improvements.slice(0, 3).map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-800">
                    <span aria-hidden className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-400 text-[11px] font-black text-white">!</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {report.topTask && (
            <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">지금 가장 먼저 할 일</p>
              <p className="mt-1 text-lg font-black leading-snug text-slate-900">{report.topTask}</p>
            </div>
          )}

          {report.areas && report.areas.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">자금·지원제도 준비도</h3>
              <p className="mt-1 text-sm text-slate-500">카드를 누르면 판단 근거를 볼 수 있어요.</p>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {report.areas.map((a, i) => (
                  <ScoreCard key={a.area} result={a} index={i} />
                ))}
              </div>
            </div>
          )}

          {submitted && <Recommendations recs={report.recommendations} onProductClick={onProductClick} onConsultClick={onConsultClick} />}
        </>
      )}

      {/* ── CTA 영역 ── */}
      {!submitted ? (
        <div className="mt-9 print:hidden">
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
        <div className="mt-9">
          <div className="animate-pop-in mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200 print:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
            {consultationConsented ? '상담 요청이 함께 접수되었습니다' : '진단 결과가 저장되었습니다'}
          </div>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row print:hidden">
            {canContinue && (
              <button
                type="button"
                onClick={onContinueAfterSubmit}
                className="flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                이어서 다음 단계 진단하기 <span aria-hidden>→</span>
              </button>
            )}
            {isFinal && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                결과 인쇄 · PDF 저장
              </button>
            )}
            <button type="button" onClick={onRestart} className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50">
              처음부터 다시 진단하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
