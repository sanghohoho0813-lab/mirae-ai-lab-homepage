// 기업 성장진단 — 서버 저장 API 클라이언트.
// 익명 사용자는 Supabase 를 직접 쓰지 않고 이 API(/api/business-diagnosis, service_role 서버 전용)로만 저장합니다.
// 답변은 localStorage 즉시 저장, 서버 동기화는 단계 완료·제출 시점 중심. 이벤트는 중요 행동만.
import type { DiagnosisAnswers, DiagnosisSession, LeadFormData, StageReportData } from '../types/businessDiagnosis'
import { questions, STAGE_INFO } from '../data/businessDiagnosisQuestions'

const API = '/api/business-diagnosis'

// 답변(원본 코드값)을 단계별·한글 질문/답변으로 변환 — 이메일 본문에서 그대로 사용.
export type AnswersDisplayStage = { stage: number; name: string; items: { q: string; a: string }[] }

function answerLabel(qid: string, value: unknown): string {
  const q = questions.find((x) => x.id === qid)
  const toLabel = (v: string) => q?.options.find((o) => o.value === v)?.label ?? v
  if (Array.isArray(value)) return value.map((v) => toLabel(String(v))).join(', ')
  return toLabel(String(value))
}

export function buildAnswersDisplay(answers: DiagnosisAnswers): AnswersDisplayStage[] {
  const out: AnswersDisplayStage[] = []
  for (const stage of [1, 2, 3] as const) {
    const items: { q: string; a: string }[] = []
    for (const q of questions.filter((x) => x.stage === stage)) {
      const v = answers[q.id]
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) continue
      items.push({ q: q.title, a: answerLabel(q.id, v) })
    }
    if (items.length) out.push({ stage, name: STAGE_INFO[stage].name, items })
  }
  return out
}

type ApiOk = { ok: true; [k: string]: unknown }
type ApiErr = { ok: false; message?: string; debugCode?: string }

async function post(body: Record<string, unknown>): Promise<ApiOk> {
  const res = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  let data: ApiOk | ApiErr
  try {
    data = (await res.json()) as ApiOk | ApiErr
  } catch {
    throw new Error(`저장 요청에 실패했습니다 (HTTP ${res.status}). 잠시 후 다시 시도해주세요.`)
  }
  if (!res.ok || data.ok === false) {
    throw new Error((data as ApiErr).message || `저장 요청에 실패했습니다 (HTTP ${res.status}).`)
  }
  return data as ApiOk
}

export type StageMeta = {
  completedStage: 1 | 2 | 3
  completedStages?: (1 | 2 | 3)[]
  diagnosisDepth?: 'basic' | 'funding' | 'comprehensive'
  stoppedAfterStage?: boolean
  nextStageInterest?: boolean
  stageDurations?: Partial<Record<number, number>>
}

function reportSnapshot(report: StageReportData) {
  return {
    depth: report.depth,
    headline: report.headline,
    summary: report.summary,
    topTask: report.topTask,
    overallScore: report.overallScore,
    ownedAdvantageCount: report.ownedAdvantageCount,
    strengths: report.strengths,
    improvements: report.improvements,
    prerequisites: report.prerequisites,
    actionPlan: report.actionPlan,
  }
}

/** 세션 스냅샷 동기화 (단계 완료·진단 완료 시). 실패해도 진단 흐름은 계속. */
export async function syncSession(
  session: DiagnosisSession,
  extras?: { status?: string; currentStage?: number; result?: StageReportData | null; stageMeta?: StageMeta },
) {
  try {
    await post({
      action: 'session',
      sessionToken: session.sessionId,
      diagnosisVersion: session.diagnosisVersion,
      startedAt: session.startedAt,
      answers: session.answers,
      interests: session.interests,
      foundAdvantages: session.foundAdvantages,
      skippedBenefits: session.skippedBenefits,
      currentQuestionId: session.currentQuestionId,
      completed: session.completed,
      completedAt: session.completedAt ?? null,
      utm: session.utm ?? null,
      status: extras?.status,
      currentStage: extras?.currentStage,
      scores: extras?.result?.areas?.map((a) => ({ area: a.area, score: a.score, priority: a.priority })) ?? null,
      resultSummary: extras?.result ? reportSnapshot(extras.result) : null,
      advantageFactors: extras?.result?.advantages ?? null,
      recommendedProducts: extras?.result?.recommendations ?? null,
      stageMeta: extras?.stageMeta ?? null,
    })
    return true
  } catch {
    return false
  }
}

export function trackEvent(sessionToken: string, eventType: string, eventKey?: string, payload?: Record<string, unknown>) {
  post({ action: 'event', sessionToken, eventType, eventKey: eventKey ?? null, payload: payload ?? null }).catch(() => {})
}

export type SubmitLeadResult = { leadId: string }

/** 결과 게이트 제출 — 리드 생성/갱신 (idempotent). depth = 완료 단계. */
export async function submitLead(
  session: DiagnosisSession,
  form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number },
  report: StageReportData,
  stageMeta: StageMeta,
): Promise<SubmitLeadResult> {
  const data = await post({
    action: 'submit',
    sessionToken: session.sessionId,
    diagnosisVersion: session.diagnosisVersion,
    startedAt: session.startedAt,
    answers: session.answers,
    interests: session.interests,
    foundAdvantages: session.foundAdvantages,
    skippedBenefits: session.skippedBenefits,
    utm: session.utm ?? null,
    form,
    stageMeta,
    scores: report.areas?.map((a) => ({ area: a.area, score: a.score, priority: a.priority })) ?? null,
    resultSummary: reportSnapshot(report),
    advantageFactors: report.advantages ?? null,
    recommendedProducts: report.recommendations,
    answersDisplay: buildAnswersDisplay(session.answers),
  })
  return { leadId: String(data.leadId) }
}
