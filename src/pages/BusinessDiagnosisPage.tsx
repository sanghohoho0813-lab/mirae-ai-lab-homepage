// 3분 기업 성장진단 — 퀘스트형 진단 페이지 (오케스트레이터).
// 화면 상태: start → question ↔ (advantage|benefit) → stageComplete → result(티저→게이트→전체)
// 데이터·점수·저장은 data/lib 파일에 분리. 서버 저장은 lib/businessDiagnosisApi (실패해도 진행 유지).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicMenuDrawer from '../components/PublicMenuDrawer'
import DiagnosisStart from '../components/diagnosis/DiagnosisStart'
import DiagnosisQuestion from '../components/diagnosis/DiagnosisQuestion'
import DiagnosisProgress from '../components/diagnosis/DiagnosisProgress'
import AdvantageFound from '../components/diagnosis/AdvantageFound'
import BenefitReveal from '../components/diagnosis/BenefitReveal'
import StageComplete from '../components/diagnosis/StageComplete'
import DiagnosisResult from '../components/diagnosis/DiagnosisResult'
import { getBenefitAfter } from '../data/businessDiagnosisBenefits'
import { getInlineFeedback, getVisibleQuestions, STAGE_INFO } from '../data/businessDiagnosisQuestions'
import { factorById, ownedAdvantageIdsFor } from '../data/policyAdvantageFactors'
import { computeResult } from '../lib/businessDiagnosisEngine'
import { submitLead, syncSession, trackEvent } from '../lib/businessDiagnosisApi'
import { captureUtmOnce, clearSession, loadSession, newSession, saveSession } from '../lib/businessDiagnosisStorage'
import type {
  BenefitCard,
  DiagnosisAnswers,
  DiagnosisSession,
  DiagnosisStage,
  InlineFeedback,
  LeadFormData,
  PolicyAdvantageFactor,
} from '../types/businessDiagnosis'

type Screen = 'start' | 'question' | 'advantage' | 'benefit' | 'stageComplete' | 'result'

export default function BusinessDiagnosisPage() {
  const [session, setSession] = useState<DiagnosisSession>(() => loadSession() ?? newSession())
  const [screen, setScreen] = useState<Screen>('start')
  const [qIndex, setQIndex] = useState(0)
  const [benefit, setBenefit] = useState<BenefitCard | null>(null)
  const [advantageFactor, setAdvantageFactor] = useState<PolicyAdvantageFactor | null>(null)
  const [feedback, setFeedback] = useState<InlineFeedback | null>(null)
  const [completedStage, setCompletedStage] = useState<DiagnosisStage>(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [consultationConsented, setConsultationConsented] = useState(false)
  // 미완료 저장분이 있으면 시작 화면에 '이어서 진단하기' 노출
  const [hasSaved, setHasSaved] = useState<boolean>(() => {
    const saved = loadSession()
    return Boolean(saved && !saved.completed && Object.keys(saved.answers).length > 0)
  })

  // 자동 진행 타이머가 이전 렌더의 클로저를 잡아도 최신 상태를 읽도록 ref 로 미러링
  const sessionRef = useRef(session)
  const qIndexRef = useRef(qIndex)
  const gateViewedRef = useRef(false)
  const completionSyncedRef = useRef(false)

  useEffect(() => {
    document.title = '3분 기업 성장진단 | 미래AI랩'
    window.scrollTo(0, 0)
    captureUtmOnce() // 최초 유입값 저장 (이미 있으면 유지)
  }, [])

  // 답변 기준 노출 질문 목록 (분기 반영)
  const visible = useMemo(() => getVisibleQuestions(session.answers), [session.answers])
  const current = visible[qIndex]
  const percent = visible.length > 0 ? Math.min(100, (qIndex / visible.length) * 100) : 0

  const persist = useCallback((next: DiagnosisSession) => {
    sessionRef.current = next
    setSession(next)
    saveSession(next)
  }, [])

  const setIndex = useCallback((i: number) => {
    qIndexRef.current = i
    setQIndex(i)
  }, [])

  // ── 시작/이어하기/다시하기 ──
  function handleStart() {
    const fresh = newSession()
    fresh.utm = captureUtmOnce()
    persist(fresh)
    setIndex(0)
    setFeedback(null)
    setScreen('question')
    window.scrollTo(0, 0)
    trackEvent(fresh.sessionId, 'diagnosis_started')
    void syncSession(fresh, { status: 'in_progress', currentStage: 1 })
  }

  function handleResume() {
    const saved = loadSession()
    if (!saved || saved.completed) return handleStart()
    persist(saved)
    const vis = getVisibleQuestions(saved.answers)
    const idx = saved.currentQuestionId ? vis.findIndex((q) => q.id === saved.currentQuestionId) : 0
    setIndex(idx < 0 ? 0 : idx)
    setFeedback(null)
    setScreen('question')
    window.scrollTo(0, 0)
  }

  function handleRestart() {
    trackEvent(sessionRef.current.sessionId, 'diagnosis_restarted')
    clearSession()
    persist(newSession())
    setIndex(0)
    setFeedback(null)
    setHasSaved(false)
    setConsultationConsented(false)
    setSubmitError(null)
    gateViewedRef.current = false
    completionSyncedRef.current = false
    setScreen('start')
    window.scrollTo(0, 0)
  }

  // ── 답변 저장 ──
  function handleAnswer(value: string | string[]) {
    if (!current) return
    const s = sessionRef.current
    const answers: DiagnosisAnswers = { ...s.answers, [current.id]: value }
    persist({ ...s, answers, currentQuestionId: current.id })
  }

  // 실제 인덱스 전진 (+단계 완료/결과 처리) — ref 에서 최신 상태를 읽음
  const advance = useCallback(() => {
    const s = sessionRef.current
    const idx = qIndexRef.current
    const vis = getVisibleQuestions(s.answers)
    const cur = vis[idx]
    const next = vis[idx + 1]

    setFeedback(cur ? getInlineFeedback(cur.id, s.answers) : null)

    if (!next) {
      // 마지막 질문 → 결과
      persist({ ...s, completed: true, completedAt: new Date().toISOString(), currentQuestionId: null })
      setScreen('result')
      window.scrollTo(0, 0)
      return
    }
    if (cur && next.stage !== cur.stage) {
      setCompletedStage(cur.stage)
      setScreen('stageComplete')
      window.scrollTo(0, 0)
      trackEvent(s.sessionId, 'stage_completed', String(cur.stage))
      void syncSession(sessionRef.current, { status: 'in_progress', currentStage: cur.stage + 1 })
      return
    }
    setIndex(idx + 1)
    persist({ ...sessionRef.current, currentQuestionId: next.id })
    setScreen('question')
    window.scrollTo(0, 0)
  }, [persist, setIndex])

  // ── 다음 이동: 우대요소 발견 → 혜택 카드 → 전진 ──
  const goNext = useCallback(() => {
    const s = sessionRef.current
    const vis = getVisibleQuestions(s.answers)
    const cur = vis[qIndexRef.current]
    if (!cur) return

    // 1) '보유' 답변 → 우대요소 발견 모션 (새로 발견된 것만)
    const ownedIds = ownedAdvantageIdsFor(cur.id, s.answers).filter((id) => !s.foundAdvantages.includes(id))
    if (ownedIds.length > 0) {
      persist({ ...s, foundAdvantages: [...s.foundAdvantages, ...ownedIds] })
      const factor = factorById(ownedIds[0])
      if (factor) {
        setAdvantageFactor(factor)
        setScreen('advantage')
        window.scrollTo(0, 0)
        trackEvent(s.sessionId, 'benefit_revealed', `advantage:${factor.id}`)
        return
      }
    }

    // 2) 미보유 답변 → 혜택 발견 카드
    const b = getBenefitAfter(cur.id, s.answers)
    if (b) {
      setBenefit(b)
      setScreen('benefit')
      window.scrollTo(0, 0)
      return
    }
    advance()
  }, [advance, persist])

  function handleAdvantageContinue() {
    setAdvantageFactor(null)
    // 우대요소 확인 후에도 같은 질문의 혜택 카드 조건은 검사 (보유+미보유 조합 케이스 대비)
    const s = sessionRef.current
    const vis = getVisibleQuestions(s.answers)
    const cur = vis[qIndexRef.current]
    const b = cur ? getBenefitAfter(cur.id, s.answers) : null
    if (b) {
      setBenefit(b)
      setScreen('benefit')
      window.scrollTo(0, 0)
      return
    }
    advance()
  }

  function handleBenefitContinue(interested: boolean) {
    const s = sessionRef.current
    if (benefit) {
      trackEvent(s.sessionId, interested ? 'benefit_interest_clicked' : 'benefit_revealed', benefit.id)
      if (interested && !s.interests.includes(benefit.interestKey)) {
        persist({ ...s, interests: [...s.interests, benefit.interestKey] })
      }
    }
    setBenefit(null)
    advance()
  }

  function handleStageDone() {
    const s = sessionRef.current
    const vis = getVisibleQuestions(s.answers)
    const nextIdx = qIndexRef.current + 1
    setIndex(nextIdx)
    const nq = vis[nextIdx]
    if (nq) persist({ ...s, currentQuestionId: nq.id })
    setScreen('question')
    window.scrollTo(0, 0)
  }

  function handlePrev() {
    if (qIndexRef.current === 0) {
      setScreen('start')
      return
    }
    setFeedback(null)
    setIndex(Math.max(0, qIndexRef.current - 1))
    window.scrollTo(0, 0)
  }

  // 결과 계산 (완료 시점 기준)
  const result = useMemo(
    () => (screen === 'result' ? computeResult(session.answers, session.interests) : null),
    [screen, session.answers, session.interests],
  )

  // 진단 완료 시 세션 서버 동기화 (1회)
  useEffect(() => {
    if (screen === 'result' && result && !completionSyncedRef.current) {
      completionSyncedRef.current = true
      void syncSession(sessionRef.current, {
        status: sessionRef.current.leadId ? 'submitted' : 'completed',
        scores: result.areas.map((a) => ({ area: a.area, score: a.score, priority: a.priority })),
        result,
      })
    }
  }, [screen, result])

  // ── 게이트 제출 ──
  async function handleSubmitLead(form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number }) {
    if (!result || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { leadId } = await submitLead(sessionRef.current, form, result)
      setConsultationConsented(form.consultationConsent)
      persist({ ...sessionRef.current, leadId, leadSubmittedAt: new Date().toISOString() })
      trackEvent(sessionRef.current.sessionId, 'result_unlocked', leadId)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '저장 중 문제가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleGateViewed() {
    if (gateViewedRef.current) return
    gateViewedRef.current = true
    trackEvent(sessionRef.current.sessionId, 'lead_form_viewed')
  }

  function handleProductClick(slug: string, rank: string, position: string) {
    trackEvent(sessionRef.current.sessionId, 'product_clicked', slug, { rank, position, leadId: sessionRef.current.leadId ?? null })
  }

  function handleConsultClick(slug?: string) {
    trackEvent(sessionRef.current.sessionId, 'consultation_clicked', slug ?? 'general', {
      leadId: sessionRef.current.leadId ?? null,
      topTask: result?.topTask ?? null,
      recommended: result?.recommendations.map((r) => r.slug) ?? [],
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">3분 기업 성장진단</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            {screen !== 'start' && screen !== 'result' && (
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                처음부터
              </button>
            )}
            <PublicMenuDrawer />
          </div>
        </div>
      </header>

      {/* 질문 화면 상단 진행 표시 */}
      {screen === 'question' && current && (
        <DiagnosisProgress
          stage={current.stage}
          questionNumber={qIndex + 1}
          totalEstimate={visible.length}
          percent={percent}
          onBack={handlePrev}
        />
      )}

      <main className="flex flex-1 flex-col">
        {screen === 'start' && <DiagnosisStart hasSaved={hasSaved} onStart={handleStart} onResume={handleResume} />}

        {screen === 'question' && current && (
          <>
            {(qIndex === 0 || visible[qIndex - 1]?.stage !== current.stage) && (
              <p className="animate-rise-in mx-auto mt-6 w-full max-w-[720px] px-5 text-sm font-bold text-blue-600">
                {STAGE_INFO[current.stage].copy}
              </p>
            )}
            <DiagnosisQuestion
              question={current}
              value={session.answers[current.id]}
              feedback={feedback}
              onAnswer={handleAnswer}
              onAutoNext={goNext}
              onNext={goNext}
              onPrev={handlePrev}
              canPrev
              onSkip={current.optional ? goNext : undefined}
            />
          </>
        )}

        {screen === 'advantage' && advantageFactor && (
          <AdvantageFound
            factor={advantageFactor}
            totalFound={session.foundAdvantages.length}
            onContinue={handleAdvantageContinue}
          />
        )}

        {screen === 'benefit' && benefit && <BenefitReveal card={benefit} onContinue={handleBenefitContinue} />}

        {screen === 'stageComplete' && <StageComplete stage={completedStage} onDone={handleStageDone} />}

        {screen === 'result' && result && (
          <DiagnosisResult
            result={result}
            unlocked={Boolean(session.leadId)}
            consultationConsented={consultationConsented}
            submitting={submitting}
            errorMessage={submitError}
            onSubmitLead={handleSubmitLead}
            onRestart={handleRestart}
            onProductClick={handleProductClick}
            onConsultClick={handleConsultClick}
            onGateViewed={handleGateViewed}
          />
        )}
      </main>
    </div>
  )
}
