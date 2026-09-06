// 3분 AX Fit — 서버 저장 API 클라이언트.
// 익명 사용자는 Supabase 를 직접 쓰지 않고 이 API(/api/business-diagnosis, service_role 서버 전용)로만 저장합니다.
// 답변은 localStorage 즉시 저장, 서버 동기화는 완료·제출 시점 중심. 이벤트는 중요 행동만.
import type { AxFitReport, DiagnosisAnswers, DiagnosisSession, LeadFormData } from '../types/businessDiagnosis'
import { AX_FIT_INFO, questions } from '../data/businessDiagnosisQuestions'

const API = '/api/business-diagnosis'

/** 결과 화면의 "정책·R&D·기업성장 전략도 함께 검토" 관심 — 라벨 그대로 서버·메일에 전달된다 */
export const GROWTH_INTEREST_KEY = '정책·R&D·기업성장 전략 검토 희망'

// 답변(원본 코드값)을 한글 질문/답변으로 변환 — 이메일 본문에서 그대로 사용.
export type AnswersDisplayStage = { stage: number; name: string; items: { q: string; a: string }[] }

function answerLabel(qid: string, value: unknown): string {
  const q = questions.find((x) => x.id === qid)
  const toLabel = (v: string) => q?.options.find((o) => o.value === v)?.label ?? v
  if (Array.isArray(value)) return value.map((v) => toLabel(String(v))).join(', ')
  return toLabel(String(value))
}

export function buildAnswersDisplay(answers: DiagnosisAnswers): AnswersDisplayStage[] {
  const items: { q: string; a: string }[] = []
  for (const q of questions) {
    const v = answers[q.id]
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) continue
    items.push({ q: q.title, a: answerLabel(q.id, v) })
  }
  return items.length ? [{ stage: 1, name: AX_FIT_INFO.name, items }] : []
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
  completedStage: 1
  completedStages?: 1[]
  diagnosisDepth?: 'basic' | 'funding' | 'comprehensive'
  stoppedAfterStage?: boolean
  nextStageInterest?: boolean
  stageDurations?: Partial<Record<number, number>>
}

/** 서버 result_summary — 관리자 화면·알림 메일이 읽는 요약. 상품 추천은 없다. */
function reportSnapshot(report: AxFitReport) {
  return {
    depth: 1,
    version: report.version,
    grade: report.grade,
    gradeLabel: report.gradeLabel,
    score: report.score,
    headline: report.headline,
    summary: report.summary,
    topTask: report.nextActions[0] ?? '',
    overallScore: report.score,
    topProblems: report.topProblems.map((p) => `${p.rank}. ${p.title}`),
    direction: [report.direction.title, ...report.direction.points],
    readiness: `${report.readiness.label} — ${report.readiness.note}`,
    // 메일 템플릿 호환 키
    strengths: [report.direction.title, ...report.direction.points],
    improvements: report.topProblems.map((p) => `${p.rank}. ${p.title} — ${p.why}`),
    prerequisites: [],
    actionPlan: report.nextActions,
  }
}

/** 세션 스냅샷 동기화 (완료 시). 실패해도 진단 흐름은 계속. */
export async function syncSession(
  session: DiagnosisSession,
  extras?: { status?: string; currentStage?: number; result?: AxFitReport | null; stageMeta?: StageMeta },
) {
  try {
    await post({
      action: 'session',
      sessionToken: session.sessionId,
      diagnosisVersion: session.diagnosisVersion,
      startedAt: session.startedAt,
      answers: session.answers,
      interests: session.interests,
      foundAdvantages: [],
      skippedBenefits: [],
      currentQuestionId: session.currentQuestionId,
      completed: session.completed,
      completedAt: session.completedAt ?? null,
      utm: session.utm ?? null,
      status: extras?.status,
      currentStage: extras?.currentStage,
      scores: extras?.result ? [{ area: 'axFit', score: extras.result.score, priority: extras.result.gradeLabel }] : null,
      resultSummary: extras?.result ? reportSnapshot(extras.result) : null,
      advantageFactors: null,
      recommendedProducts: null,
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

/** 상담 신청 제출 — 리드 생성/갱신 (idempotent). */
export async function submitLead(
  session: DiagnosisSession,
  form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number },
  report: AxFitReport,
  stageMeta: StageMeta,
): Promise<SubmitLeadResult> {
  const data = await post({
    action: 'submit',
    sessionToken: session.sessionId,
    diagnosisVersion: session.diagnosisVersion,
    startedAt: session.startedAt,
    answers: session.answers,
    interests: session.interests,
    foundAdvantages: [],
    skippedBenefits: [],
    utm: session.utm ?? null,
    form,
    stageMeta,
    scores: [{ area: 'axFit', score: report.score, priority: report.gradeLabel }],
    resultSummary: reportSnapshot(report),
    advantageFactors: null,
    recommendedProducts: null,
    answersDisplay: buildAnswersDisplay(session.answers),
  })
  return { leadId: String(data.leadId) }
}
