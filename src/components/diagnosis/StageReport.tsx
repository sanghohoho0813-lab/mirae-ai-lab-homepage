// 단계별 결과 리포트 — 짧은 완료 체크 → 즉시 결과. 모바일(세로 스크롤) 우선.
// 1·2단계: 간단 요약(강점/확인할 점). 3단계: 종합 보고서.
//   ① 한눈에 보기  ② 맞춤 서비스(썸네일 카드) + 함께 준비하면 좋은 것들
//   ③ 지금 먼저 확인할 것들  → 영역별 준비도 한눈에(막대 시각화·항상 노출)
//   → 우대 요소(참고용·접힘)  → 마무리 상담 CTA
import { useEffect, useState } from 'react'
import { paymentsEnabled } from '../../config/commerce'
import { Link } from 'react-router-dom'
import ConsultModal from '../ConsultModal'
import type {
  AdvantageResultItem,
  AreaResult,
  ProductRecommendation,
  SeverityTone,
  StageReportData,
  TopPriority,
} from '../../types/businessDiagnosis'
import { getPackageBySlug } from '../../data/businessPackages'
import { ADVANTAGE_DISCLAIMER } from '../../data/policyAdvantageFactors'
import ScoreCard from './ScoreCard'
import { formatKoreanMoney } from '../ProductCard'

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
  amber: 'text-amber-500',
  orange: 'text-orange-600',
  red: 'text-red-600',
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
const CONF_TONE: Record<string, string> = {
  '높음': 'bg-emerald-100 text-emerald-800',
  '보통': 'bg-amber-100 text-amber-800',
  '낮음': 'bg-orange-100 text-orange-800',
}
// 영역별 준비도 막대 — 톤별 막대색/상태칩
const AREA_BAR_TONE: Record<SeverityTone, { bar: string; chip: string }> = {
  green: { bar: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-800' },
  blue: { bar: 'bg-blue-500', chip: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200' },
  amber: { bar: 'bg-amber-400', chip: 'bg-amber-100 text-amber-800' },
  orange: { bar: 'bg-orange-500', chip: 'bg-orange-100 text-orange-800' },
  red: { bar: 'bg-red-500', chip: 'bg-red-100 text-red-700' },
}

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

// ── 지금 먼저 확인할 3가지 ──
function TopPrioritiesSection({ step, items }: { step: string; items: TopPriority[] }) {
  if (!items.length) return null
  return (
    <section className="mt-7 sm:mt-9">
      <SectionHeading step={step} title={`지금 먼저 확인할 ${items.length}가지`} sub="점수를 낮추려는 게 아니라, 순서를 잡기 위한 안내예요." />
      <div className="mt-4 space-y-3.5">
        {items.map((p) => {
          const tone = PRIO_TONE[p.tone]
          const pkg = p.linkedProductSlug ? getPackageBySlug(p.linkedProductSlug) : null
          return (
            <div key={p.rank} className={`rounded-2xl border-2 p-5 sm:p-6 ${tone.card}`}>
              <div className="flex items-start gap-3.5">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg font-black text-white ${tone.num}`}>{p.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${tone.chip}`}>{tone.label}</span>
                  </div>
                  <p className="mt-2 text-[1.2rem] font-black leading-snug text-slate-900">{p.problem}</p>
                  <p className="mt-2 text-[1rem] font-semibold leading-relaxed text-slate-700">{p.why}</p>
                  <div className="mt-3 rounded-xl bg-white/70 px-3.5 py-3">
                    <p className="text-[0.82rem] font-black text-slate-400">그대로 두면</p>
                    <p className="mt-1 text-[0.98rem] leading-relaxed text-slate-600">{p.ifIgnored}</p>
                  </div>
                  {pkg && (
                    <Link
                      to={`/business-services/${pkg.slug}`}
                      className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2.5 text-[0.95rem] font-bold text-white transition-colors hover:bg-slate-700"
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

// 정책자금·지원사업 우대 요소 — 참고용, 기본 접힘(가볍게 칩으로). 인쇄 시에는 항상 펼침
function AdvantageBlock({ report }: { report: StageReportData }) {
  const [open, setOpen] = useState(false)
  if (!report.advantages || report.advantages.length === 0) return null
  return (
    <section className="mt-6 print:break-inside-avoid">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 print:hidden"
      >
        <span>
          <span className="text-[0.95rem] font-extrabold text-slate-700">정책자금·지원사업 우대 요소</span>
          <span className="ml-2 text-sm font-semibold text-slate-400">
            {report.ownedAdvantageCount ? `보유 ${report.ownedAdvantageCount}개` : '참고용'}
          </span>
        </span>
        <span aria-hidden className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`${open ? '' : 'hidden'} print:block`}>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          평가에서 가점·우대가 될 수 있는 요소예요. 지금 다 갖추지 않아도 괜찮고, 상담 때 함께 챙겨드려요.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {report.advantages.map((item) => (
            <span
              key={item.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.85rem] font-bold ${ADV_STATUS_TONE[item.status]}`}
            >
              {item.label}
              <span className="text-[0.72rem] font-semibold opacity-70">· {item.status}</span>
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">{ADVANTAGE_DISCLAIMER}</p>
      </div>
    </section>
  )
}

// 영역별 준비도 한눈에 — 6개 영역을 준비된 순서대로 막대로 시각화(항상 노출) + 근거 상세는 토글
function AreaScoreSummary({ areas }: { areas: AreaResult[] }) {
  const [detail, setDetail] = useState(false)
  if (!areas.length) return null
  const sorted = [...areas].sort((a, b) => b.score - a.score)
  const top = sorted[0]
  const bottom = sorted[sorted.length - 1]
  return (
    <section className="mt-7 sm:mt-9 print:break-inside-avoid">
      <SectionHeading title="영역별 준비도 한눈에" sub="6개 영역을 준비된 순서대로 정리했어요. 아래로 갈수록 먼저 챙기면 좋아요." />
      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2.5">
          <p className="text-[11px] font-black uppercase tracking-wide text-emerald-600">가장 잘 갖춘 영역</p>
          <p className="mt-0.5 text-[0.98rem] font-extrabold leading-tight text-slate-900">{top.label}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50/70 px-3.5 py-2.5">
          <p className="text-[11px] font-black uppercase tracking-wide text-orange-600">먼저 챙기면 좋은 영역</p>
          <p className="mt-0.5 text-[0.98rem] font-extrabold leading-tight text-slate-900">{bottom.label}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        {sorted.map((a) => {
          const t = AREA_BAR_TONE[a.tone]
          return (
            <div key={a.area} className="flex items-center gap-3">
              <span className="w-[86px] shrink-0 text-[0.88rem] font-bold leading-tight text-slate-700 sm:w-[104px] sm:text-[0.92rem]">{a.label}</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${t.bar} transition-all duration-500`} style={{ width: `${Math.max(a.score, 6)}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right text-[0.95rem] font-black tabular-nums text-slate-900">{a.score}</span>
              <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black sm:inline-block ${t.chip}`}>{a.status}</span>
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => setDetail((v) => !v)}
        aria-expanded={detail}
        className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 print:hidden"
      >
        영역별 근거·지금 할 일 자세히 보기
        <span aria-hidden className={`transition-transform ${detail ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`${detail ? 'mt-4 grid gap-3 lg:grid-cols-2' : 'hidden'} print:mt-4 print:grid print:gap-3`}>
        {sorted.map((a, i) => (
          <ScoreCard key={a.area} result={a} index={i} />
        ))}
      </div>
    </section>
  )
}

// 마무리 상담 CTA — 결과를 본 뒤 바로 상담으로 이어지도록(진단 상담 신청 = 설문 응답까지 함께 전달)
function ClosingConsultCTA({ onConsult }: { onConsult: () => void }) {
  return (
    <section className="mt-8 print:hidden">
      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6 text-center sm:p-7">
        <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">어디서부터 시작할지 막막하다면</h3>
        <p className="mx-auto mt-2 max-w-md text-[0.98rem] leading-relaxed text-slate-600">
          진단 결과를 바탕으로 대표님 상황에 맞는 준비 순서와 활용할 수 있는 제도를 무료로 짚어드려요. 방금 답해주신 내용까지 함께 전달되니, 연락처만 남겨주시면 담당자가 확인 후 연락드립니다.
        </p>
        <button
          type="button"
          onClick={onConsult}
          className="shine-cta mt-4 inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-8 py-3.5 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          무료로 맞춤 상담 신청하기 <span aria-hidden>→</span>
        </button>
        <p className="mt-2.5 text-xs text-slate-400">상담은 무료이며, 원하지 않으면 언제든 그만두실 수 있어요.</p>
      </div>
    </section>
  )
}

// ── 맞춤 서비스 (제출 후 공개) — 최종 보고서에서는 우선 확인 항목보다 먼저 노출 ──
function Recommendations({
  step,
  recs,
  onProductClick,
  onConsultClick,
}: {
  step?: string
  recs: ProductRecommendation[]
  onProductClick: Props['onProductClick']
  onConsultClick: Props['onConsultClick']
}) {
  const [consultPkg, setConsultPkg] = useState<{ name: string; price: string } | null>(null)
  if (recs.length === 0) return null
  return (
    <section className="mt-7 sm:mt-9 print:break-inside-avoid">
      <SectionHeading step={step} title="대표님께 맞는 서비스" sub="진단 답변을 바탕으로 우선순위를 정리했어요." />
      <div className="mt-4 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
                <p className="mt-3 flex-1 text-xl font-black tracking-tight text-slate-900">{formatKoreanMoney(pkg.price)}</p>
                <div className="mt-3 flex gap-2 print:hidden">
                  <Link to={`/business-services/${pkg.slug}`} onClick={() => onProductClick(rec.slug, rec.rank, position)} className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700">
                    자세히 보기
                  </Link>
                  {pkg.priceType === 'consult' || !paymentsEnabled ? (
                    <button type="button" onClick={() => { onConsultClick(rec.slug); setConsultPkg({ name: pkg.name, price: pkg.price }) }} className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                      상담 신청
                    </button>
                  ) : (
                    <Link to={`/checkout/${pkg.slug}`} onClick={() => onConsultClick(rec.slug)} className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">
                      바로 결제하기
                    </Link>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <ConsultModal
        open={!!consultPkg}
        onClose={() => setConsultPkg(null)}
        source="진단 결과 추천"
        heading="상담 신청"
        contextRows={
          consultPkg
            ? [
                { label: '상품', value: consultPkg.name },
                { label: '가격', value: formatKoreanMoney(consultPkg.price) },
                { label: '신청 위치', value: '기업 성장진단 결과' },
              ]
            : []
        }
      />
    </section>
  )
}

// ── 함께 준비하면 좋은 것들 — AI 자동화·홈페이지·AX 소프트 추천(고정, 이미 추천된 상품은 제외) ──
const GROWTH_PICKS: { slug: string; nudge: string }[] = [
  {
    slug: 'ai-ax-system',
    nudge: '반복 업무에 들어가는 시간과 인건비는 줄이지 않는 한 매년 그대로 나갑니다. 회사 규모와 상관없이, 먼저 도입한 회사와의 격차가 점점 벌어지는 영역이에요.',
  },
  {
    slug: 'responsive-homepage',
    nudge: '거래처도 지원사업 담당자도 계약 전에 회사부터 검색해 봅니다. 모바일에서 깔끔하게 열리는 홈페이지가 없으면, 그 단계에서 신뢰를 잃기 쉬워요.',
  },
  {
    slug: 'ax-full-package',
    nudge: '디지털 전환을 미리 준비해 두면 정부지원사업·정책자금 평가에서도 준비된 회사라는 인상을 줄 수 있어요. 회사가 오래 성장하기 위한 기반이 되기도 하고요.',
  },
]

function GrowthPicksSection({ excludeSlugs, onProductClick }: { excludeSlugs: string[]; onProductClick: Props['onProductClick'] }) {
  const picks = GROWTH_PICKS.filter((p) => !excludeSlugs.includes(p.slug))
  if (!picks.length) return null
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50/70 to-white p-4 sm:mt-7 sm:p-5 print:break-inside-avoid">
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">요즘 대표님들이 함께 준비하는 것들</h3>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-500">당장 급하지는 않지만, 미룰수록 시간과 비용이 더 들어가는 영역이라 함께 보시면 좋아요.</p>
      <div className="mt-4 space-y-3">
        {picks.map((p) => {
          const pkg = getPackageBySlug(p.slug)
          if (!pkg) return null
          return (
            <Link
              key={p.slug}
              to={`/business-services/${pkg.slug}`}
              onClick={() => onProductClick(p.slug, '함께 준비', 'result_growth_pick')}
              className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              {pkg.imageSrc && <img src={pkg.imageSrc} alt="" loading="lazy" className="h-16 w-[96px] shrink-0 rounded-lg bg-slate-100 object-cover sm:h-[72px] sm:w-[108px]" />}
              <div className="min-w-0 flex-1">
                <p className="text-[1.05rem] font-extrabold leading-tight text-slate-900">{pkg.name}</p>
                <p className="mt-1 text-[0.92rem] leading-relaxed text-slate-500">{p.nudge}</p>
                <p className="mt-1.5 text-[1rem] font-black text-slate-800">{formatKoreanMoney(pkg.price)}</p>
              </div>
              <span aria-hidden className="shrink-0 font-black text-slate-300">→</span>
            </Link>
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
  // 최종 보고서 섹션 번호 — 맞춤 서비스(②)는 제출과 무관하게 결과 화면에서 바로 노출
  const hasRecsSection = report.recommendations.length > 0
  const stepPrio = hasRecsSection ? '③' : '②'

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
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
              {report.metricCards.map((c) => (
                <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center sm:p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">{c.label}</p>
                  <p className={`mt-1.5 text-[1.55rem] font-black tabular-nums tracking-tight sm:text-3xl ${TONE[c.tone ?? 'slate']}`}>
                    {(c.label === '종합 준비도' || c.label === '기초체력 점수') && c.value.endsWith('점') ? `${count}점` : c.value}
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

          {/* ② 맞춤 서비스 — 제출 후 공개, 우선 확인 항목보다 먼저(썸네일 카드) */}
          {hasRecsSection && <Recommendations step="②" recs={report.recommendations} onProductClick={onProductClick} onConsultClick={onConsultClick} />}

          {report.topPriorities && <TopPrioritiesSection step={stepPrio} items={report.topPriorities} />}

          {/* 함께 준비하면 좋은 것들 — '지금 먼저 확인할 것들' 바로 다음에 (이미 추천된 상품은 제외) */}
          <GrowthPicksSection excludeSlugs={hasRecsSection ? report.recommendations.map((r) => r.slug) : []} onProductClick={onProductClick} />

          {/* 영역별 준비도 한눈에 — 6개 영역 막대 시각화(항상 노출) */}
          {report.areas && report.areas.length > 0 && <AreaScoreSummary areas={report.areas} />}

          {/* 정책자금·지원사업 우대 요소 — 참고용(가볍게 접힘) */}
          <AdvantageBlock report={report} />

          {/* 마무리 상담 CTA — 제출 전에만(제출 후엔 아래 접수 안내) */}
          {!submitted && <ClosingConsultCTA onConsult={onWantResult} />}
        </>
      ) : (
        // ═══════════ 1·2단계 간단 요약 ═══════════
        <>
          <p className="animate-rise-in mt-3 text-[0.95rem] leading-relaxed text-slate-600 [animation-delay:60ms]">{report.summary}</p>

          <div className="animate-rise-in mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 [animation-delay:120ms]">
            {report.metricCards.map((c) => (
              <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center sm:p-5">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">{c.label}</p>
                <p className={`mt-1.5 text-[1.55rem] font-black tabular-nums tracking-tight sm:text-3xl ${TONE[c.tone ?? 'slate']}`}>
                  {(c.label === '종합 준비도' || c.label === '기초체력 점수') && c.value.endsWith('점') ? `${count}점` : c.value}
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

      {/* ── CTA 영역 ── (최종 보고서 제출 전 CTA는 위 마무리 카드가 대신하므로 생략) */}
      {!submitted ? (
        isFinal ? null : (
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
        )
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
