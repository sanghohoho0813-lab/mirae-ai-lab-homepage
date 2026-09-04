// 3분 기업 성장진단 — 점진형(1단계만 해도 결과 → 원하면 2·3단계) 오케스트레이터.
// 화면: start → question ↔ (인라인 혜택/우대요소) → stageReport → gate → stageReport(제출)
// 빠른 전환(가짜 로딩 제거), 인라인 혜택 패널(질문 유지), 단계별 즉시 리포트.
import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import DiagnosisStart from '../components/diagnosis/DiagnosisStart'
import DiagnosisQuestion from '../components/diagnosis/DiagnosisQuestion'
import DiagnosisProgress from '../components/diagnosis/DiagnosisProgress'
import StageReport from '../components/diagnosis/StageReport'
import LeadGate from '../components/diagnosis/LeadGate'
import { getInlineFeedback, STAGE_INFO, stageQuestions } from '../data/businessDiagnosisQuestions'
import { ownedAdvantageIdsFor } from '../data/policyAdvantageFactors'
import { computeStageResult } from '../lib/businessDiagnosisEngine'
import { submitLead, syncSession, trackEvent } from '../lib/businessDiagnosisApi'
import { captureUtmOnce, clearSession, loadSession, newSession, saveResultToHistory, saveSession } from '../lib/businessDiagnosisStorage'
import type {
  DiagnosisSession,
  DiagnosisStage,
  InlineFeedback,
  LeadFormData,
  StageReportData,
} from '../types/businessDiagnosis'

type Screen = 'start' | 'question' | 'stageReport' | 'gate'
const AUTO_MS = 180 // 단일선택 자동 전환 (빠르게)

export default function BusinessDiagnosisPage() {
  const [session, setSession] = useState<DiagnosisSession>(() => loadSession() ?? newSession())
  const [screen, setScreen] = useState<Screen>('start')
  const [stage, setStage] = useState<DiagnosisStage>(1)
  const [qIdx, setQIdx] = useState(0) // 현재 단계 내 질문 인덱스
  const [feedback, setFeedback] = useState<InlineFeedback | null>(null)
  const [report, setReport] = useState<StageReportData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [consultationConsented, setConsultationConsented] = useState(false)
  // 1·2단계에서 상담 신청을 눌렀을 때 다음 단계 진행을 권유하는 알림
  const [stageNudge, setStageNudge] = useState(false)
  const [hasSaved, setHasSaved] = useState<boolean>(() => {
    const s = loadSession()
    return Boolean(s && !s.completed && Object.keys(s.answers).length > 0)
  })

  // 최신 상태 미러 (자동전환 타이머 stale closure 방지)
  const sRef = useRef(session)
  const stageRef = useRef(stage)
  const qRef = useRef(qIdx)
  const advancingRef = useRef(false)
  const gateViewedRef = useRef(false)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const homeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()
  const [homeConfirm, setHomeConfirm] = useState(false)

  // 진단 중 좌상단 로고 → 실수로 홈 이탈 방지: 첫 탭은 "한 번 더 누르면 홈으로" 안내, 두 번째 탭에 이동.
  const handleBrandClick = (e: MouseEvent) => {
    if (screen === 'start') return // 시작 화면에선 바로 홈으로 이동
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
    document.title = '3분 기업 성장진단 | 미래AI랩'
    window.scrollTo(0, 0)
    captureUtmOnce()
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      if (homeTimer.current) clearTimeout(homeTimer.current)
    }
  }, [])

  // 저장된 진행 상태가 있으면 시작 화면 없이 바로 이어하기 (이탈 후 복귀 시 처음부터 다시 시작 방지)
  useEffect(() => {
    if (hasSaved) handleResume()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = useCallback((next: DiagnosisSession) => {
    sRef.current = next
    setSession(next)
    saveSession(next)
  }, [])

  const setStageIdx = useCallback((st: DiagnosisStage, i: number) => {
    stageRef.current = st
    qRef.current = i
    setStage(st)
    setQIdx(i)
  }, [])

  const visibleQs = useMemo(() => stageQuestions(stage, session.answers), [stage, session.answers])
  const current = visibleQs[qIdx]
  // 진행률: 현재 단계 기준 — 1단계 9문항이면 답변마다 1/9씩 차오름 (단계 전환 시 리셋)
  const stageProgress = visibleQs.length ? qIdx / visibleQs.length : 0
  const percent = Math.min(100, stageProgress * 100)

  // ── 시작/이어하기/다시하기 ──
  function enterStage(st: DiagnosisStage, sess: DiagnosisSession) {
    const startedAt = { ...sess.stageStartedAt, [st]: Date.now() }
    persist({ ...sess, currentStage: st, currentQuestionId: stageQuestions(st, sess.answers)[0]?.id ?? null, stageStartedAt: startedAt })
    setStageIdx(st, 0)
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
    enterStage(1, fresh)
  }

  function handleResume() {
    const saved = loadSession()
    if (!saved || saved.completed) return handleStart()
    const st = saved.currentStage ?? 1
    const qs = stageQuestions(st, saved.answers)
    const idx = saved.currentQuestionId ? qs.findIndex((q) => q.id === saved.currentQuestionId) : 0
    persist(saved)
    setStageIdx(st, idx < 0 ? 0 : idx)
    setFeedback(null)
    setScreen('question')
    window.scrollTo(0, 0)
  }

  function handleRestart() {
    trackEvent(sRef.current.sessionId, 'diagnosis_restarted')
    clearSession()
    const fresh = newSession()
    persist(fresh)
    setStageIdx(1, 0)
    setFeedback(null)
    setReport(null)
    setHasSaved(false)
    setConsultationConsented(false)
    setSubmitError(null)
    gateViewedRef.current = false
    setScreen('start')
    window.scrollTo(0, 0)
  }

  // ── 답변 저장 ──
  function handleSelect(value: string | string[]) {
    if (!current) return
    const s = sRef.current
    persist({ ...s, answers: { ...s.answers, [current.id]: value }, currentQuestionId: current.id })
    // 단일선택 → 빠른 자동 전환 예약 (인라인 패널이 뜨면 취소됨)
    if (current.type === 'single') {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      autoTimer.current = setTimeout(() => decide(), AUTO_MS)
    }
  }

  // 답변 직후 처리: 흐름을 끊는 중간 패널 없이 우대요소만 기록하고 즉시 전진
  const decide = useCallback(() => {
    const s = sRef.current
    const qs = stageQuestions(stageRef.current, s.answers)
    const cur = qs[qRef.current]
    if (!cur) return
    // '보유' 답변은 우대요소로 기록만 (단계 리포트에 반영)
    const owned = ownedAdvantageIdsFor(cur.id, s.answers).filter((id) => !s.foundAdvantages.includes(id))
    if (owned.length > 0) persist({ ...s, foundAdvantages: [...s.foundAdvantages, ...owned] })
    advance()
  }, [persist])

  // 다음 질문 / 단계 완료
  const advance = useCallback(() => {
    if (advancingRef.current) return
    advancingRef.current = true
    const s = sRef.current
    const st = stageRef.current
    const qs = stageQuestions(st, s.answers)
    const cur = qs[qRef.current]
    const next = qs[qRef.current + 1]
    setFeedback(cur ? getInlineFeedback(cur.id, s.answers) : null)

    if (next) {
      setStageIdx(st, qRef.current + 1)
      persist({ ...s, currentQuestionId: next.id })
      setScreen('question')
      window.scrollTo(0, 0)
      setTimeout(() => (advancingRef.current = false), 60)
      return
    }

    // 단계 완료 → 리포트
    const dur = s.stageStartedAt[st] ? Math.round((Date.now() - (s.stageStartedAt[st] as number)) / 1000) : undefined
    const completedStages = s.completedStages.includes(st) ? s.completedStages : [...s.completedStages, st]
    const nextSession: DiagnosisSession = {
      ...s,
      completedStages,
      stageDurations: dur ? { ...s.stageDurations, [st]: dur } : s.stageDurations,
      completed: st === 3 ? true : s.completed,
      completedAt: st === 3 ? new Date().toISOString() : s.completedAt,
    }
    persist(nextSession)
    const rep = computeStageResult(st, nextSession.answers, nextSession.interests)
    setReport(rep)
    // 완료 결과를 기록에 저장 (같은 세션은 최신 스냅샷으로 갱신, 최근 5개 유지)
    saveResultToHistory({
      sessionId: nextSession.sessionId,
      completedStage: st,
      diagnosisDepth: st === 1 ? 'basic' : st === 2 ? 'funding' : 'comprehensive',
      answers: nextSession.answers,
      interests: nextSession.interests,
      foundAdvantages: nextSession.foundAdvantages,
      snapshot: rep,
      leadId: nextSession.leadId,
    })
    setScreen('stageReport')
    window.scrollTo(0, 0)
    trackEvent(s.sessionId, 'stage_completed', String(st))
    void syncSession(nextSession, {
      status: st === 3 ? 'completed' : 'in_progress',
      currentStage: st,
      result: st === 3 ? rep : null,
      stageMeta: { completedStage: st, completedStages, stageDurations: nextSession.stageDurations },
    })
    setTimeout(() => (advancingRef.current = false), 60)
  }, [persist, setStageIdx])

  function handlePrev() {
    if (qRef.current > 0) {
      setStageIdx(stageRef.current, qRef.current - 1)
      setFeedback(null)
      window.scrollTo(0, 0)
      return
    }
    if (stageRef.current > 1) {
      // 이전 단계 리포트로
      const prev = (stageRef.current - 1) as DiagnosisStage
      setStage(prev)
      stageRef.current = prev
      setReport(computeStageResult(prev, sRef.current.answers, sRef.current.interests))
      setScreen('stageReport')
      window.scrollTo(0, 0)
      return
    }
    setScreen('start')
  }

  // ── 단계 리포트 액션 ──
  function continueToNextStage() {
    const s = sRef.current
    const nextStage = (stageRef.current + 1) as DiagnosisStage
    if (nextStage > 3) return
    persist({ ...s, nextStageInterest: true })
    enterStage(nextStage, sRef.current)
  }

  // 실제 상담 신청 폼(게이트)으로 이동
  function openGate() {
    gateViewedRef.current = true
    trackEvent(sRef.current.sessionId, 'lead_form_viewed')
    // 중단 지점 기록
    persist({ ...sRef.current, stoppedAfterStage: stageRef.current })
    setSubmitError(null)
    setStageNudge(false)
    setScreen('gate')
    window.scrollTo(0, 0)
  }

  function wantResultGate() {
    // 1·2단계에서 상담 신청을 누르면 먼저 다음 단계 진행을 한 번 권유
    if (report && report.depth < 3) {
      trackEvent(sRef.current.sessionId, 'stage_nudge_shown', String(report.depth))
      setStageNudge(true)
      return
    }
    openGate()
  }

  // 알림에서 "다음 단계 진행하기" 선택
  function nudgeContinue() {
    trackEvent(sRef.current.sessionId, 'stage_nudge_continue', String(report?.depth ?? ''))
    setStageNudge(false)
    continueToNextStage()
  }

  async function handleSubmitLead(form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number }) {
    if (!report || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const s = sRef.current
    const depth = report.depth
    try {
      const { leadId } = await submitLead(s, form, report, {
        completedStage: depth,
        diagnosisDepth: depth === 1 ? 'basic' : depth === 2 ? 'funding' : 'comprehensive',
        stoppedAfterStage: depth < 3,
        nextStageInterest: s.nextStageInterest,
        stageDurations: s.stageDurations,
      })
      setConsultationConsented(form.consultationConsent)
      persist({ ...sRef.current, leadId, leadSubmittedAt: new Date().toISOString() })
      // 결과 기록에 leadId 반영
      saveResultToHistory({
        sessionId: s.sessionId,
        completedStage: depth,
        diagnosisDepth: depth === 1 ? 'basic' : depth === 2 ? 'funding' : 'comprehensive',
        answers: s.answers,
        interests: s.interests,
        foundAdvantages: s.foundAdvantages,
        snapshot: report,
        leadId,
      })
      trackEvent(sRef.current.sessionId, 'result_unlocked', leadId)
      setScreen('stageReport')
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
            <BrandLogo to="/business-services" onClick={handleBrandClick} tagline="3분 AX 가능성 진단" imgClassName="h-9 max-w-[150px] sm:h-10 sm:max-w-[180px]" />
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
                서비스몰
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
        <DiagnosisProgress stage={current.stage} questionNumber={qIdx + 1} totalEstimate={visibleQs.length} percent={percent} onBack={handlePrev} />
      )}

      <main className="flex flex-1 flex-col">
        {screen === 'start' && <DiagnosisStart hasSaved={hasSaved} onStart={handleStart} onResume={handleResume} />}

        {screen === 'question' && current && (
          <>
            {qIdx === 0 && (
              <p className="animate-rise-in mx-auto mt-6 w-full max-w-[720px] px-5 text-sm font-bold text-blue-600">{STAGE_INFO[current.stage].copy}</p>
            )}
            <DiagnosisQuestion
              question={current}
              value={session.answers[current.id]}
              feedback={feedback}
              onSelect={handleSelect}
              onNext={decide}
              onPrev={handlePrev}
              canPrev
            />
          </>
        )}

        {screen === 'stageReport' && report && (
          <StageReport
            report={report}
            submitted={submitted}
            consultationConsented={consultationConsented}
            onContinueStage={continueToNextStage}
            onWantResult={wantResultGate}
            onContinueAfterSubmit={continueToNextStage}
            onRestart={handleRestart}
            onPrint={() => trackEvent(sRef.current.sessionId, 'report_printed', String(report.depth))}
          />
        )}

        {screen === 'gate' && report && (
          <div className="mx-auto w-full max-w-[860px] px-5 pb-20 pt-6">
            <button type="button" onClick={() => setScreen('stageReport')} className="mb-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              ← 결과로 돌아가기
            </button>
            <LeadGate submitting={submitting} errorMessage={submitError} onSubmit={handleSubmitLead} />
          </div>
        )}
      </main>

      {/* 단계 유도 알림 — 1·2단계에서 상담 신청 시 다음 단계 진행 권유 */}
      {stageNudge && report && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="다음 단계 진행 안내"
          onClick={() => setStageNudge(false)}
        >
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-7" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v13M12 21h.01M7 8l5-5 5 5" />
              </svg>
            </div>
            <h3 className="mt-4 text-center text-xl font-black tracking-tight text-slate-900">
              {report.depth === 1 ? '2·3단계까지 하면 더 정확해요' : '3단계까지 하면 더 정확해요'}
            </h3>
            <p className="mt-2.5 text-center text-[0.95rem] leading-relaxed text-slate-600">
              지금 단계 정보만으로도 상담은 가능하지만,{' '}
              <b className="font-bold text-slate-900">
                {report.depth === 1 ? '자금·지원제도(2단계)와 인증·성장 인프라(3단계)' : '인증·성장 인프라(3단계)'}
              </b>
              까지 마치면 한 번에 정확한 맞춤 상담을 받을 수 있어요.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={nudgeContinue}
                className="flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-6 py-3.5 text-base font-black text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
              >
                {report.depth === 1 ? '2단계 이어서 진단하기' : '3단계 이어서 진단하기'} <span aria-hidden>→</span>
              </button>
              <button
                type="button"
                onClick={openGate}
                className="flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                지금 단계에서 상담 신청하기
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'start' && <LegalFooter />}
    </div>
  )
}
