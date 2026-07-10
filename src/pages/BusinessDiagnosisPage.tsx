// 3분 기업 성장진단 — 퀘스트형 진단 페이지 (오케스트레이터).
// 화면 상태: start → question ↔ benefit → stageComplete → result
// 데이터·점수·저장은 data/lib 파일에 분리. 이 파일은 흐름 제어만 담당합니다.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicMenuDrawer from '../components/PublicMenuDrawer'
import DiagnosisStart from '../components/diagnosis/DiagnosisStart'
import DiagnosisQuestion from '../components/diagnosis/DiagnosisQuestion'
import DiagnosisProgress from '../components/diagnosis/DiagnosisProgress'
import BenefitReveal from '../components/diagnosis/BenefitReveal'
import StageComplete from '../components/diagnosis/StageComplete'
import DiagnosisResult from '../components/diagnosis/DiagnosisResult'
import { getBenefitAfter } from '../data/businessDiagnosisBenefits'
import { getInlineFeedback, getVisibleQuestions, STAGE_INFO } from '../data/businessDiagnosisQuestions'
import { computeResult } from '../lib/businessDiagnosisEngine'
import { clearSession, loadSession, newSession, saveSession } from '../lib/businessDiagnosisStorage'
import type { BenefitCard, DiagnosisAnswers, DiagnosisSession, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

type Screen = 'start' | 'question' | 'benefit' | 'stageComplete' | 'result'

export default function BusinessDiagnosisPage() {
  const [session, setSession] = useState<DiagnosisSession>(() => loadSession() ?? newSession())
  const [screen, setScreen] = useState<Screen>('start')
  const [qIndex, setQIndex] = useState(0)
  const [benefit, setBenefit] = useState<BenefitCard | null>(null)
  const [feedback, setFeedback] = useState<InlineFeedback | null>(null)
  const [completedStage, setCompletedStage] = useState<DiagnosisStage>(1)
  // 미완료 저장분이 있으면 시작 화면에 '이어서 진단하기' 노출
  const [hasSaved, setHasSaved] = useState<boolean>(() => {
    const saved = loadSession()
    return Boolean(saved && !saved.completed && Object.keys(saved.answers).length > 0)
  })

  // 자동 진행 타이머가 이전 렌더의 클로저를 잡아도 최신 상태를 읽도록 ref 로 미러링
  const sessionRef = useRef(session)
  const qIndexRef = useRef(qIndex)

  useEffect(() => {
    document.title = '3분 기업 성장진단 | 미래AI랩'
    window.scrollTo(0, 0)
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
    persist(newSession())
    setIndex(0)
    setFeedback(null)
    setScreen('question')
    window.scrollTo(0, 0)
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
    clearSession()
    persist(newSession())
    setIndex(0)
    setFeedback(null)
    setHasSaved(false)
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

    // 인라인 피드백 (다음 질문 화면 상단에 표시)
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
      return
    }
    setIndex(idx + 1)
    persist({ ...sessionRef.current, currentQuestionId: next.id })
    setScreen('question')
    window.scrollTo(0, 0)
  }, [persist, setIndex])

  // ── 다음 이동 (혜택 카드 → 단계 완료 → 결과 순서 판단) ──
  const goNext = useCallback(() => {
    const s = sessionRef.current
    const vis = getVisibleQuestions(s.answers)
    const cur = vis[qIndexRef.current]
    if (!cur) return

    // 1) 답변 직후 혜택 카드
    const b = getBenefitAfter(cur.id, s.answers)
    if (b) {
      setBenefit(b)
      setScreen('benefit')
      window.scrollTo(0, 0)
      return
    }
    advance()
  }, [advance])

  function handleBenefitContinue(interested: boolean) {
    const s = sessionRef.current
    if (benefit && interested && !s.interests.includes(benefit.interestKey)) {
      persist({ ...s, interests: [...s.interests, benefit.interestKey] })
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
            {/* 단계 카피 (단계 첫 질문에서만) */}
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

        {screen === 'benefit' && benefit && <BenefitReveal card={benefit} onContinue={handleBenefitContinue} />}

        {screen === 'stageComplete' && <StageComplete stage={completedStage} onDone={handleStageDone} />}

        {screen === 'result' && result && <DiagnosisResult result={result} onRestart={handleRestart} />}
      </main>
    </div>
  )
}
