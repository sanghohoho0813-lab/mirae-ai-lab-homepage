// 진단 결과 화면 — 완료 링 → 종합 메시지 → 영역 점수 → 강점/보완/선결과제 → 실행 순서 → 추천 상품.
// 1차: 결과 전체 공개 (다음 단계에서 연락처 게이트로 변경 예정).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DiagnosisResultData } from '../../types/businessDiagnosis'
import { getPackageBySlug } from '../../data/businessPackages'
import ScoreCard from './ScoreCard'

type Props = {
  result: DiagnosisResultData
  onRestart: () => void
}

const RANK_TONE: Record<string, string> = {
  '1순위': 'bg-blue-600 text-white',
  '2순위': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  '장기 검토': 'bg-slate-100 text-slate-500',
}

export default function DiagnosisResult({ result, onRestart }: Props) {
  // 완료 스플래시 → 결과 본문
  const [phase, setPhase] = useState<'splash' | 'body'>('splash')
  useEffect(() => {
    const t = setTimeout(() => setPhase('body'), 1500)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'splash') {
    return (
      <div className="animate-rise-in mx-auto flex min-h-[70dvh] w-full max-w-[640px] flex-col items-center justify-center px-5 text-center">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 96 96" className="h-28 w-28 -rotate-90" aria-hidden>
            <circle cx="48" cy="48" r="41" fill="none" stroke="#e2e8f0" strokeWidth="7" />
            <circle cx="48" cy="48" r="41" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" className="animate-ring-draw" />
          </svg>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 m-auto" aria-hidden>
            <path className="animate-check-draw" d="M5 12.5 10 17.5 19 7" />
          </svg>
        </div>
        <p className="mt-7 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">기업 성장진단이 완료되었습니다</p>
        <p className="mt-2 text-base font-medium text-slate-500">대표님 회사의 우선순위를 찾았어요</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[860px] px-5 pb-20 pt-8 sm:pt-10">
      {/* A. 종합 메시지 */}
      <p className="animate-rise-in text-sm font-black uppercase tracking-widest text-blue-600">진단 결과</p>
      <h1 className="animate-rise-in mt-2 text-[1.5rem] font-black leading-[1.3] tracking-tight text-slate-900 [animation-delay:60ms] sm:text-[2rem]">
        {result.summary}
      </h1>

      {/* E. 선결과제 (있을 때만) */}
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

      {/* B. 6개 영역 준비도 */}
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
            {result.recommendations.map((rec) => {
              const pkg = getPackageBySlug(rec.slug)
              if (!pkg) return null
              return (
                <article key={rec.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {pkg.imageSrc && (
                    <Link to={`/business-services/${pkg.slug}`} className="relative block aspect-[3/2] bg-slate-100">
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
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700"
                      >
                        자세히 보기
                      </Link>
                      <Link
                        to="/business-services#apply"
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
        가능성을 이해하기 위한 내부 진단 지표입니다.
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
