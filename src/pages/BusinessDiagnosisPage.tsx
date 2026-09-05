// 3분 AX Fit — 단일 흐름 오케스트레이터.
// 화면: start → question(10) → report → gate(상담 신청) → report(접수됨)
// 빠른 전환(단일선택 자동 진행), 답변은 localStorage 즉시 저장, 서버 동기화는 완료·제출 시점.
import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import DiagnosisStart from '../components/diagnosis/DiagnosisStart'
import DiagnosisQuestion from '../components/diagnosis/DiagnosisQuestion'
import DiagnosisProgress from '../components/diagnosis/DiagnosisProgress'
import AxFitReportView from '../components/diagnosis/AxFitReport'
import LeadGate from '../components/diagnosis/LeadGate'
import { AX_FIT_INFO, getInlineFeedback, stageQuestions } from '../data/businessDiagnosisQuestions'
import { computeAxFit } from '../lib/businessDiagnosisEngine'
import { GROWTH_INTEREST_KEY, submitLead, syncSession, trackEvent } from '../lib/businessDiagnosisApi'
import { captureUtmOnce, clearSession, loadSession, newSession, saveResultToHistory, saveSession } from '../lib/businessDiagnosisStorage'
import type { AxFitReport, DiagnosisSession, InlineFeedback, LeadFormData } from '../types/businessDiagnosis'

type Screen = 'start' | 'question' | 'report' | 'gate'
const AUTO_MS = 180 // 단일선택 자동 전환 (빠르게)

export default function BusinessDiagnosisPage() {
  const [session, setSession] = useState<DiagnosisSession>(() => loadSession() ?? newSession())
  const [screen, setScreen] = useState<Screen>('start')
  const [qIdx, setQIdx] = useState(0)
  const [feedback, setFeedback] = useState<InlineFeedback | null>(null)
  const [report, setReport] = useState<AxFitReport | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [consultationConsented, setConsultationConsented] = useState(false)
  const [hasSaved, setHasSaved] = useState<boolean>(() => {
    const s = loadSession()
    return Boolean(s && !s.completed && Object.keys(s.answers).length > 0)
  })

  // 최신 상태 미러 (자동전환 타이머 stale closure 방지)
  const sRef = useRef(session)
  const qRef = useRef(qIdx)
  const advancingRef = useRef(false)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const homeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()
  const [homeConfirm, setHomeConfirm] = useState(false)

  // 진단 중 좌상단 로고 → 실수로 홈 이탈 방지: 첫 탭은 안내, 두 번째 탭에 이동.
  const handleBrandClick = (e: MouseEvent) => {
    if (screen === 'start') return
    e.preventDefault()
    if (homeConfirm) {
      navigate('/')
      return
    }
    setHomeConfirm(true)
    if (homeTimer.current) clearTimeout(homeTimer.current)
    homeTimer.current = setTimeout(() => setHomeConfirm(false), 3000)
  }

  useEffect(() => {
    document.title = '3분 AX Fit | 미래AI랩'
    window.scrollTo(0, 0)
    captureUtmOnce()
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      if (homeTimer.current) clearTimeout(homeTimer.current)
    }
  }, [])

  // 저장된 진행 상태가 있으면 시작 화면 없이 바로 이어하기
  useEffect(() => {
    if (hasSaved) handleResume()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = useCallback((next: DiagnosisSession) => {
    sRef.current = next
    setSession(next)
    saveSession(next)
  }, [])

  const setIdx = useCallback((i: number) => {
    qRef.current = i
    setQIdx(i)
  }, [])

  const visibleQs = useMemo(() => stageQuestions(1, session.answers), [session.answers])
  const current = visibleQs[qIdx]
  const percent = visibleQs.length ? Math.min(100, (qIdx / visibleQs.length) * 100) : 0

  // ── 시작/이어하기/다시하기 ──
  function enter(sess: DiagnosisSession, idx = 0) {
    persist({ ...sess, currentStage: 1, currentQuestionId: stageQuestions(1, sess.answers)[idx]?.id ?? null, stageStartedAt: { 1: sess.stageStartedAt[1] ?? Date.now() } })
    setIdx(idx)
    setFeedback(null)
    setReport(null)
    setScreen('question')
    window.scrollTo(0, 0)
  }

  function handleStart() {
    const fresh = newSession()
    fresh.utm = captureUtmOnce()
    trackEvent(fresh.sessionId, 'diagnosis_started')
    void syncSession(fresh, { status: 'in_progress', currentStage: 1 })
    enter(fresh)
  }

  function handleResume() {
    const saved = loadSession()
    if (!saved || saved.completed) return handleStart()
    const qs = stageQuestions(1, saved.answers)
    const idx = saved.currentQuestionId ? qs.findIndex((q) => q.id === saved.currentQuestionId) : 0
    enter(saved, idx < 0 ? 0 : idx)
  }

  function handleRestart() {
    trackEvent(sRef.current.sessionId, 'diagnosis_restarted')
    clearSession()
    const fresh = newSession()
    persist(fresh)
    setIdx(0)
    setFeedback(null)
    setReport(null)
    setHasSaved(false)
    setConsultationConsented(false)
    setSubmitError(null)
    setScreen('start')
    window.scrollTo(0, 0)
  }

  // ── 답변 저장 ──
  function handleSelect(value: string | string[]) {
    if (!current) return
    const s = sRef.current
    persist({ ...s, answers: { ...s.answers, [current.id]: value }, currentQuestionId: current.id })
    if (current.type === 'single') {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      autoTimer.current = setTimeout(() => advance(), AUTO_MS)
    }
  }

  // 다음 질문 / 완료
  const advance = useCallback(() => {
    if (advancingRef.current) return
    advancingRef.current = true
    const s = sRef.current
    const qs = stageQuestions(1, s.answers)
    const cur = qs[qRef.current]
    const next = qs[qRef.current + 1]
    setFeedback(cur ? getInlineFeedback(cur.id, s.answers) : null)

    if (next) {
      setIdx(qRef.current + 1)
      persist({ ...s, currentQuestionId: next.id })
      setScreen('question')
      window.scrollTo(0, 0)
      setTimeout(() => (advancingRef.current = false), 60)
      return
    }

    // 완료 → 결과
    const dur = s.stageStartedAt[1] ? Math.round((Date.now() - (s.stageStartedAt[1] as number)) / 1000) : undefined
    const nextSession: DiagnosisSession = {
      ...s,
      completedStages: [1],
      stageDurations: dur ? { 1: dur } : s.stageDurations,
      completed: true,
      completedAt: new Date().toISOString(),
    }
    persist(nextSession)
    const rep = computeAxFit(nextSession.answers)
    setReport(rep)
    saveResultToHistory({
      sessionId: nextSession.sessionId,
      completedStage: 1,
      diagnosisDepth: 'comprehensive',
      answers: nextSession.answers,
      interests: nextSession.interests,
      foundAdvantages: [],
      snapshot: rep,
      leadId: nextSession.leadId,
    })
    setScreen('report')
    window.scrollTo(0, 0)
    trackEvent(s.sessionId, 'stage_completed', '1')
    void syncSession(nextSession, {
      status: 'completed',
      currentStage: 1,
      result: rep,
      stageMeta: { completedStage: 1, completedStages: [1], diagnosisDepth: 'comprehensive', stageDurations: nextSession.stageDurations },
    })
    setTimeout(() => (advancingRef.current = false), 60)
  }, [persist, setIdx])

  function handlePrev() {
    if (qRef.current > 0) {
      setIdx(qRef.current - 1)
      setFeedback(null)
      window.scrollTo(0, 0)
      return
    }
    setScreen('start')
  }

  // 성장·정책 관심 — 메인 결과와 분리된 확인 항목. interests 에 라벨로 저장해 상담 메일에 그대로 전달.
  const growthInterest = session.interests.includes(GROWTH_INTEREST_KEY)
  function setGrowthInterest(v: boolean) {
    const s = sRef.current
    const rest = s.interests.filter((k) => k !== GROWTH_INTEREST_KEY)
    persist({ ...s, interests: v ? [...rest, GROWTH_INTEREST_KEY] : rest })
  }

  // 상담 신청 폼(게이트)으로 이동
  function openGate() {
    trackEvent(sRef.current.sessionId, 'lead_form_viewed')
    setSubmitError(null)
    setScreen('gate')
    window.scrollTo(0, 0)
  }

  async function handleSubmitLead(form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number }) {
    if (!report || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const s = sRef.current
    try {
      const { leadId } = await submitLead(s, form, report, {
        completedStage: 1,
        diagnosisDepth: 'comprehensive',
        stoppedAfterStage: false,
        nextStageInterest: false,
        stageDurations: s.stageDurations,
      })
      setConsultationConsented(form.consultationConsent)
      persist({ ...sRef.current, leadId, leadSubmittedAt: new Date().toISOString() })
      saveResultToHistory({
        sessionId: s.sessionId,
        completedStage: 1,
        diagnosisDepth: 'comprehensive',
        answers: s.answers,
        interests: s.interests,
        foundAdvantages: [],
        snapshot: report,
        leadId,
      })
      trackEvent(sRef.current.sessionId, 'result_unlocked', leadId)
      setScreen('report')
      window.scrollTo(0, 0)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '저장 중 문제가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const submitted = Boolean(session.leadId)
  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <BrandLogo to="/business-services" onClick={handleBrandClick} tagline={AX_FIT_INFO.name} imgClassName="h-9 max-w-[150px] sm:h-10 sm:max-w-[180px]" />
            {homeConfirm && screen !== 'start' && (
              <span className="animate-fade-in whitespace-nowrap text-[0.7rem] font-bold leading-tight text-amber-600">
                한 번 더 누르면<br className="sm:hidden" /> 홈으로 이동
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {screen === 'start' && (
              <Link
                to="/business-services"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:inline"
              >
                홈으로
              </Link>
            )}
            {screen !== 'start' && (
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                처음부터
              </button>
            )}
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {screen === 'question' && current && (
        <DiagnosisProgress questionNumber={qIdx + 1} total={visibleQs.length} percent={percent} onBack={handlePrev} />
      )}

      <main className="flex flex-1 flex-col">
        {screen === 'start' && <DiagnosisStart hasSaved={hasSaved} onStart={handleStart} onResume={handleResume} />}

        {screen === 'question' && current && (
          <>
            {qIdx === 0 && (
              <p className="animate-rise-in mx-auto mt-6 w-full max-w-[720px] px-5 text-sm font-bold text-blue-600">{AX_FIT_INFO.copy}</p>
            )}
            <DiagnosisQuestion
              question={current}
              value={session.answers[current.id]}
              feedback={feedback}
              onSelect={handleSelect}
              onNext={advance}
              onPrev={handlePrev}
              canPrev
            />
          </>
        )}

        {screen === 'report' && report && (
          <AxFitReportView
            report={report}
            submitted={submitted}
            consultationConsented={consultationConsented}
            growthInterest={growthInterest}
            onGrowthInterestChange={setGrowthInterest}
            onWantConsult={openGate}
            onRestart={handleRestart}
            onPrint={() => trackEvent(sRef.current.sessionId, 'report_printed', '1')}
          />
        )}

        {screen === 'gate' && report && (
          <div className="mx-auto w-full max-w-[860px] px-5 pb-20 pt-6">
            <button type="button" onClick={() => setScreen('report')} className="mb-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              ← 결과로 돌아가기
            </button>
            <LeadGate submitting={submitting} errorMessage={submitError} onSubmit={handleSubmitLead} />
          </div>
        )}
      </main>

      {screen === 'start' && <LegalFooter />}
    </div>
  )
}
