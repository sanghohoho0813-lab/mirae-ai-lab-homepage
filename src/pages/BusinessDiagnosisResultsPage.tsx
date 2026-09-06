// 내 진단 결과 — 저장된 완료 결과(localStorage history) 목록/상세.
// /business-diagnosis/results          → 최근 5개 목록
// /business-diagnosis/results/:resultId → 저장된 스냅샷을 그대로 다시 보기
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import AxFitReportView from '../components/diagnosis/AxFitReport'
import { deleteResult, getResultById, loadHistory } from '../lib/businessDiagnosisStorage'
import { trackEvent } from '../lib/businessDiagnosisApi'
import { AX_FIT_INFO } from '../data/businessDiagnosisQuestions'
import type { SavedResult } from '../types/businessDiagnosis'
import BrandLogo from '../components/BrandLogo'

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch {
    return ''
  }
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <BrandLogo to="/business-diagnosis" tagline="내 진단 결과" imgClassName="h-9 max-w-[160px] sm:h-10 sm:max-w-[190px]" />
        <HeaderAccount variant="business" />
      </div>
    </header>
  )
}

function ResultsList() {
  const [items, setItems] = useState<SavedResult[]>([])
  useEffect(() => {
    document.title = '내 진단 결과 | 미래AI랩'
    setItems(loadHistory())
  }, [])

  function handleDelete(r: SavedResult) {
    if (!window.confirm('이 진단 결과를 삭제할까요? 삭제하면 되돌릴 수 없어요.')) return
    deleteResult(r.resultId)
    trackEvent(r.sessionId, 'saved_result_deleted', r.resultId)
    setItems(loadHistory())
  }

  return (
    <div className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-8">
      <h1 className="text-2xl font-black tracking-tight text-slate-900">내 진단 결과</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">이 기기에 저장된 최근 진단 결과예요 (최대 5개). 진단을 다시 시작해도 지워지지 않아요.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-bold text-slate-700">아직 저장된 진단 결과가 없어요.</p>
          <p className="mt-1 text-sm text-slate-500">{AX_FIT_INFO.name}을 완료하면 결과가 여기에 저장됩니다.</p>
          <Link
            to="/business-diagnosis"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            우리 회사 AX 가능성 진단 →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((r) => (
            <li key={r.resultId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-stretch">
                <Link
                  to={`/business-diagnosis/results/${r.resultId}`}
                  className="min-w-0 flex-1 p-4.5 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-inset ring-blue-200">{AX_FIT_INFO.name}</span>
                    <span className="text-xs font-semibold text-slate-400">{formatDate(r.updatedAt)}</span>
                    {r.leadId && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-emerald-700">상담 접수됨</span>}
                  </div>
                  <p className="mt-2 text-[1.02rem] font-black leading-snug text-slate-900">{r.snapshot.headline}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500">
                      {r.snapshot.gradeLabel} · AX Fit <span className="tabular-nums text-slate-900">{r.snapshot.score}점</span>
                    </span>
                    <span className="text-sm font-semibold text-blue-600">결과 다시 보기 →</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(r)}
                  aria-label="이 결과 삭제"
                  className="grid w-12 shrink-0 place-items-center border-l border-slate-100 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link to="/business-diagnosis" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900">
          ← 진단 페이지로 돌아가기
        </Link>
      </div>
    </div>
  )
}

function ResultDetail({ resultId }: { resultId: string }) {
  const navigate = useNavigate()
  const result = useMemo(() => getResultById(resultId), [resultId])

  useEffect(() => {
    if (result) {
      document.title = '저장된 진단 결과 | 미래AI랩'
      trackEvent(result.sessionId, 'saved_result_opened', resultId)
    }
  }, [result, resultId])

  if (!result) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-16 text-center">
        <p className="text-lg font-black text-slate-900">결과를 찾을 수 없어요.</p>
        <p className="mt-1.5 text-sm text-slate-500">이 기기에 저장된 결과가 아니거나 이미 삭제되었을 수 있어요.</p>
        <Link to="/business-diagnosis/results" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
          내 진단 결과 목록으로
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[860px] px-5 pt-6 print:hidden">
        <Link to="/business-diagnosis/results" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900">
          ← 내 진단 결과 목록
        </Link>
      </div>
      <AxFitReportView
        report={result.snapshot}
        submitted
        consultationConsented={Boolean(result.leadId)}
        onWantConsult={() => navigate('/business-diagnosis')}
        onRestart={() => navigate('/business-diagnosis')}
        onPrint={() => trackEvent(result.sessionId, 'report_printed', String(result.completedStage))}
      />
    </>
  )
}

export default function BusinessDiagnosisResultsPage() {
  const { resultId } = useParams()
  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-900 antialiased [word-break:keep-all]">
      <Header />
      <main className="flex flex-1 flex-col">{resultId ? <ResultDetail resultId={resultId} /> : <ResultsList />}</main>
    </div>
  )
}
