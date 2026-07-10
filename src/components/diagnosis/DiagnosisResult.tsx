// 진단 결과 화면 — 완료 스플래시 → 티저(종합점수·최우선 과제·우대요소 수) + 잠금 결과 →
// 연락처 게이트(LeadGate) 제출 → 잠금 해제 모션 → 전체 결과.
// 이미 제출된 세션(leadId 보유)은 곧바로 전체 결과를 보여줍니다.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdvantageResultItem, DiagnosisResultData, LeadFormData } from '../../types/businessDiagnosis'
import { getPackageBySlug } from '../../data/businessPackages'
import { ADVANTAGE_DISCLAIMER, ADVANTAGE_GROUP_LABELS, EXPERT_REFERRAL_NOTE } from '../../data/policyAdvantageFactors'
import LeadGate from './LeadGate'
import ScoreCard from './ScoreCard'

type Props = {
  result: DiagnosisResultData
  /** 이미 리드 제출 완료 여부 (localStorage leadId) */
  unlocked: boolean
  /** 제출 시 상담 연락 동의 여부 (완료 메시지 분기) */
  consultationConsented: boolean
  submitting: boolean
  errorMessage: string | null
  onSubmitLead: (form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number }) => void
  onRestart: () => void
  onProductClick: (slug: string, rank: string, position: string) => void
  onConsultClick: (slug?: string) => void
  onGateViewed: () => void
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

function useCountUpNumber(target: number, startDelay: number) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setV(target)
      return
    }
    let raf = 0
    const timer = setTimeout(() => {
      let start: number | null = null
      const step = (ts: number) => {
        if (start === null) start = ts
        const p = Math.min(1, (ts - start) / 700)
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, startDelay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, startDelay])
  return v
}

function CompletionRing({ big = false }: { big?: boolean }) {
  const size = big ? 'h-28 w-28' : 'h-24 w-24'
  return (
    <div className={`relative ${size}`}>
      <svg viewBox="0 0 96 96" className={`${size} -rotate-90`} aria-hidden>
        <circle cx="48" cy="48" r="41" fill="none" stroke="#e2e8f0" strokeWidth="7" />
        <circle cx="48" cy="48" r="41" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" className="animate-ring-draw" />
      </svg>
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 m-auto" aria-hidden>
        <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
      </svg>
    </div>
  )
}

// ── 우대요소 섹션 ──
function AdvantageSection({ result }: { result: DiagnosisResultData }) {
  const groups: Array<{ key: string; items: AdvantageResultItem[] }> = ['technology', 'management', 'credibility', 'expert']
    .map((g) => ({ key: g, items: result.advantages.filter((a) => a.group === g) }))
    .filter((g) => g.items.length > 0)

  if (result.advantages.length === 0) return null
  return (
    <section className="mt-10">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">정책자금·지원사업 활용 기반</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {result.ownedAdvantageCount > 0
          ? `대표님 회사에서 정책자금·정부지원사업 평가에 참고될 수 있는 기반 요소를 ${result.ownedAdvantageCount}개 확인했습니다.`
          : '지금부터 준비하면 평가에 참고될 수 있는 기반 요소들을 정리했습니다.'}
      </p>
      <div className="mt-4 space-y-4">
        {groups.map((g) => (
          <div key={g.key} className="rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-5">
            <p className="text-sm font-black uppercase tracking-wide text-slate-400">{ADVANTAGE_GROUP_LABELS[g.key]}</p>
            <ul className="mt-3 space-y-2.5">
              {g.items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.95rem] font-bold text-slate-800">{item.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-500">
                      {item.expertReferralOnly ? EXPERT_REFERRAL_NOTE : item.description}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${ADV_STATUS_TONE[item.status]}`}>{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        {ADVANTAGE_DISCLAIMER} 업종 평균 대비 수익성 우수 여부는 재무제표와 업종 평균자료를 함께 확인해야 합니다.
      </p>
    </section>
  )
}

export default function DiagnosisResult({
  result,
  unlocked,
  consultationConsented,
  submitting,
  errorMessage,
  onSubmitLead,
  onRestart,
  onProductClick,
  onConsultClick,
  onGateViewed,
}: Props) {
  // splash → (미제출) teaser → 제출 성공 시 unlocking → full / (기제출) full
  const [phase, setPhase] = useState<'splash' | 'teaser' | 'unlocking' | 'full'>('splash')
  const [wasGated, setWasGated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase((p) => (p === 'splash' ? (unlocked ? 'full' : 'teaser') : p))
    }, 1500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 게이트 상태에서 제출 완료(unlocked 전환) → 잠금 해제 모션
  useEffect(() => {
    if (unlocked && phase === 'teaser') {
      setWasGated(true)
      setPhase('unlocking')
    }
  }, [unlocked, phase])

  useEffect(() => {
    if (phase !== 'unlocking') return
    const t = setTimeout(() => setPhase('full'), 1400)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'teaser') onGateViewed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const overall = useCountUpNumber(result.overallScore, 300)
  const advCount = useCountUpNumber(result.ownedAdvantageCount, 600)

  if (phase === 'splash') {
    return (
      <div className="animate-rise-in mx-auto flex min-h-[70dvh] w-full max-w-[640px] flex-col items-center justify-center px-5 text-center">
        <CompletionRing big />
        <p className="mt-7 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">기업 성장진단이 완료되었습니다</p>
        <p className="mt-2 text-base font-medium text-slate-500">대표님 회사의 가장 중요한 과제를 찾았습니다</p>
      </div>
    )
  }

  if (phase === 'unlocking') {
    return (
      <div className="animate-rise-in mx-auto flex min-h-[70dvh] w-full max-w-[640px] flex-col items-center justify-center px-5 text-center">
        <CompletionRing />
        <p className="mt-6 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">결과가 준비되었습니다</p>
        <p className="mt-2 text-base font-medium text-slate-500">
          {consultationConsented ? '상담 요청이 함께 접수되었습니다.' : '진단 결과가 저장되었습니다.'}
        </p>
      </div>
    )
  }

  // ── 티저 (잠금 상태) ──
  if (phase === 'teaser') {
    return (
      <div className="mx-auto w-full max-w-[860px] px-5 pb-20 pt-8 sm:pt-10">
        <p className="animate-rise-in text-sm font-black uppercase tracking-widest text-blue-600">진단 완료</p>
        <h1 className="animate-rise-in mt-2 text-[1.5rem] font-black leading-[1.3] tracking-tight text-slate-900 [animation-delay:60ms] sm:text-[1.9rem]">
          대표님 회사의 가장 중요한 과제를 찾았습니다
        </h1>

        {/* 티저 카드 3개 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="animate-rise-in rounded-2xl border border-slate-200 bg-white p-5 text-center [animation-delay:120ms]">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">종합 준비도</p>
            <p className="mt-2 text-4xl font-black tabular-nums tracking-tight text-blue-600">{overall}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">내부 진단 지표 (승인확률 아님)</p>
          </div>
          <div className="animate-rise-in rounded-2xl border-2 border-blue-500 bg-blue-50/60 p-5 text-center [animation-delay:200ms]">
            <p className="text-xs font-black uppercase tracking-wide text-blue-600">최우선 과제</p>
            <p className="mt-2 text-base font-extrabold leading-snug text-slate-900">{result.topTask}</p>
          </div>
          <div className="animate-rise-in rounded-2xl border border-slate-200 bg-white p-5 text-center [animation-delay:280ms]">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">평가 참고요소 발견</p>
            <p className="mt-2 text-4xl font-black tabular-nums tracking-tight text-emerald-600">{advCount}개</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{ADVANTAGE_DISCLAIMER}</p>
          </div>
        </div>

        {/* 잠긴 나머지 결과 (흐림 처리) */}
        <div className="relative mt-8" aria-hidden>
          <div className="pointer-events-none select-none space-y-3 blur-[6px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-base font-extrabold text-slate-900">영역별 준비도 6개</p>
              <div className="mt-3 h-2 w-2/3 rounded-full bg-blue-200" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-emerald-200" />
              <div className="mt-2 h-2 w-3/4 rounded-full bg-amber-200" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-base font-extrabold text-slate-900">강점 · 보완할 부분 · 추천 실행 순서 · 맞춤 상품</p>
              <div className="mt-3 h-2 w-3/5 rounded-full bg-slate-200" />
              <div className="mt-2 h-2 w-2/5 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-sm font-bold text-white shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              아래 정보 입력 후 전체 결과가 공개됩니다
            </span>
          </div>
        </div>

        {/* 게이트 폼 */}
        <LeadGate submitting={submitting} errorMessage={errorMessage} onSubmit={onSubmitLead} />
      </div>
    )
  }

  // ── 전체 결과 ──
  return (
    <div className="mx-auto w-full max-w-[860px] px-5 pb-20 pt-8 sm:pt-10">
      {wasGated && (
        <div className="animate-pop-in mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-inset ring-emerald-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
          {consultationConsented ? '상담 요청이 함께 접수되었습니다' : '진단 결과가 저장되었습니다'}
        </div>
      )}

      {/* A. 종합 메시지 */}
      <p className="animate-rise-in text-sm font-black uppercase tracking-widest text-blue-600">진단 결과</p>
      <h1 className="animate-rise-in mt-2 text-[1.5rem] font-black leading-[1.3] tracking-tight text-slate-900 [animation-delay:60ms] sm:text-[2rem]">
        {result.summary}
      </h1>

      {/* E. 선결과제 */}
      {result.prerequisites.length > 0 && (
        <div className="animate-rise-in mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 [animation-delay:120ms]">
          <p className="text-sm font-black uppercase tracking-wide text-amber-700">먼저 해결할 선결과제</p>
          <ul className="mt-2 space-y-1.5">
            {result.prerequisites.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-amber-900">
                <span aria-hidden className="mt-0.5">!</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* B. 영역별 준비도 */}
      <h2 className="mt-10 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">영역별 준비도</h2>
      <p className="mt-1 text-sm text-slate-500">카드를 누르면 판단 근거를 볼 수 있어요.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {result.areas.map((a, i) => (
          <ScoreCard key={a.area} result={a} index={i} />
        ))}
      </div>

      {/* C. 강점 / D. 보완 */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">우리 회사의 강점</p>
          <ul className="mt-3 space-y-2">
            {result.strengths.slice(0, 3).map((s) => (
              <li key={s} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-800">
                <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">먼저 보완할 부분</p>
          <ul className="mt-3 space-y-2">
            {result.improvements.slice(0, 3).map((s) => (
              <li key={s} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-800">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 우대요소 섹션 */}
      <AdvantageSection result={result} />

      {/* F. 추천 실행 순서 */}
      <h2 className="mt-10 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">추천 실행 순서</h2>
      <ol className="mt-4 space-y-2.5">
        {result.actionPlan.map((step, i) => (
          <li key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-black text-white">{i + 1}</span>
            <span className="text-[0.95rem] font-bold text-slate-800">{step}</span>
          </li>
        ))}
      </ol>

      {/* G. 추천 상품 */}
      {result.recommendations.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">대표님께 맞는 서비스</h2>
          <p className="mt-1 text-sm text-slate-500">진단 답변을 바탕으로 우선순위를 정리했어요.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {result.recommendations.map((rec, idx) => {
              const pkg = getPackageBySlug(rec.slug)
              if (!pkg) return null
              const position = idx === 0 ? 'result_primary' : 'result_secondary'
              return (
                <article key={rec.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {pkg.imageSrc && (
                    <Link
                      to={`/business-services/${pkg.slug}`}
                      onClick={() => onProductClick(rec.slug, rec.rank, position)}
                      className="relative block aspect-[3/2] bg-slate-100"
                    >
                      <img src={pkg.imageSrc} alt={pkg.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
                    </Link>
                  )}
                  <div className="flex flex-1 flex-col p-4.5">
                    <span className={`self-start rounded-full px-2.5 py-1 text-xs font-black ${RANK_TONE[rec.rank]}`}>{rec.rank}</span>
                    <h3 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{pkg.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{rec.reason}</p>
                    <p className="mt-3 text-xl font-black tracking-tight text-slate-900">{pkg.price}</p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to={`/business-services/${pkg.slug}`}
                        onClick={() => onProductClick(rec.slug, rec.rank, position)}
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700"
                      >
                        자세히 보기
                      </Link>
                      <Link
                        to="/business-services#apply"
                        onClick={() => onConsultClick(rec.slug)}
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        상담 신청
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}

      {/* H. 점수 성격 안내 */}
      <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-500">
        이 점수는 정책자금 승인확률이나 정부지원사업 선정확률을 의미하지 않습니다. 대표님의 현재 준비상태와 활용
        가능성을 이해하기 위한 내부 진단 지표입니다. 우대요소는 신청하는 정책자금과 세부사업에 따라 실제 반영 여부가
        달라질 수 있습니다.
      </p>

      {/* 다시 시작 */}
      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="flex min-h-[52px] items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          처음부터 다시 진단하기
        </button>
        <Link
          to="/business-services"
          className="flex min-h-[52px] items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          전체 서비스 둘러보기
        </Link>
      </div>
    </div>
  )
}
