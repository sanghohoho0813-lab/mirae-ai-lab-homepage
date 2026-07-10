// 기업 성장진단 — 서버 저장 API 클라이언트.
// 익명 사용자는 Supabase 를 직접 쓰지 않고 이 API(/api/business-diagnosis, service_role 서버 전용)로만 저장합니다.
// 원칙: 답변은 localStorage 즉시 저장(1차 구현 유지), 서버 동기화는 단계 완료·완료·제출 시점 중심.
//       question_answered 를 매번 전송하지 않음(비용·중복 방지). 이벤트는 중요 행동만.
import type { DiagnosisResultData, DiagnosisSession, LeadFormData } from '../types/businessDiagnosis'

const API = '/api/business-diagnosis'

type ApiOk = { ok: true; [k: string]: unknown }
type ApiErr = { ok: false; message?: string; debugCode?: string }

async function post(body: Record<string, unknown>): Promise<ApiOk> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  let data: ApiOk | ApiErr
  try {
    data = (await res.json()) as ApiOk | ApiErr
  } catch {
    throw new Error(`저장 요청에 실패했습니다 (HTTP ${res.status}). 잠시 후 다시 시도해주세요.`)
  }
  if (!res.ok || data.ok === false) {
    const err = data as ApiErr
    throw new Error(err.message || `저장 요청에 실패했습니다 (HTTP ${res.status}).`)
  }
  return data as ApiOk
}

/** 세션 스냅샷 동기화 (단계 완료·진단 완료 시). 실패해도 진단 흐름은 계속. */
export async function syncSession(session: DiagnosisSession, extras?: { status?: string; scores?: unknown; result?: DiagnosisResultData | null; currentStage?: number }) {
  try {
    await post({
      action: 'session',
      sessionToken: session.sessionId,
      diagnosisVersion: session.diagnosisVersion,
      startedAt: session.startedAt,
      answers: session.answers,
      interests: session.interests,
      foundAdvantages: session.foundAdvantages,
      currentQuestionId: session.currentQuestionId,
      completed: session.completed,
      completedAt: session.completedAt ?? null,
      utm: session.utm ?? null,
      status: extras?.status,
      currentStage: extras?.currentStage,
      scores: extras?.scores ?? null,
      resultSummary: extras?.result
        ? {
            summary: extras.result.summary,
            topTask: extras.result.topTask,
            overallScore: extras.result.overallScore,
            ownedAdvantageCount: extras.result.ownedAdvantageCount,
            strengths: extras.result.strengths,
            improvements: extras.result.improvements,
            prerequisites: extras.result.prerequisites,
            actionPlan: extras.result.actionPlan,
          }
        : null,
      advantageFactors: extras?.result?.advantages ?? null,
      recommendedProducts: extras?.result?.recommendations ?? null,
    })
    return true
  } catch {
    return false // 조용히 실패 — localStorage 가 원본
  }
}

/** 중요 행동 이벤트 (fire-and-forget) */
export function trackEvent(sessionToken: string, eventType: string, eventKey?: string, payload?: Record<string, unknown>) {
  post({ action: 'event', sessionToken, eventType, eventKey: eventKey ?? null, payload: payload ?? null }).catch(() => {
    /* 이벤트 유실 허용 */
  })
}

export type SubmitLeadResult = { leadId: string }

/** 결과 게이트 제출 — 리드 생성 (idempotent: 같은 세션 재제출 시 기존 리드 갱신) */
export async function submitLead(
  session: DiagnosisSession,
  form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number },
  result: DiagnosisResultData,
): Promise<SubmitLeadResult> {
  const data = await post({
    action: 'submit',
    sessionToken: session.sessionId,
    diagnosisVersion: session.diagnosisVersion,
    startedAt: session.startedAt,
    answers: session.answers,
    interests: session.interests,
    foundAdvantages: session.foundAdvantages,
    utm: session.utm ?? null,
    form,
    // 표시용 결과 스냅샷 (리드 점수·등급은 서버가 답변 기준으로 재계산 — 클라이언트 값 불신)
    scores: result.areas.map((a) => ({ area: a.area, score: a.score, priority: a.priority })),
    resultSummary: {
      summary: result.summary,
      topTask: result.topTask,
      overallScore: result.overallScore,
      ownedAdvantageCount: result.ownedAdvantageCount,
      strengths: result.strengths,
      improvements: result.improvements,
      prerequisites: result.prerequisites,
      actionPlan: result.actionPlan,
    },
    advantageFactors: result.advantages,
    recommendedProducts: result.recommendations,
  })
  return { leadId: String(data.leadId) }
}
