// 3분 AX Fit — localStorage 저장.
// 진행 세션(miraeBusinessDiagnosis) + 완료 결과 기록(miraeBusinessDiagnosisHistory) 분리.
// v5(AX Fit)는 이전 종합진단(v3·v4)과 질문이 전혀 달라 호환되지 않으므로, 버전이 다르면 안전 초기화한다.
import type { AxFitReport, DiagnosisSession, SavedResult } from '../types/businessDiagnosis'
import { DIAGNOSIS_VERSION } from '../data/businessDiagnosisQuestions'

const KEY = 'miraeBusinessDiagnosis'
const HISTORY_KEY = 'miraeBusinessDiagnosisHistory'
const MAX_HISTORY = 5

export function loadSession(): DiagnosisSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DiagnosisSession
    if (parsed.diagnosisVersion !== DIAGNOSIS_VERSION) {
      localStorage.removeItem(KEY)
      return null
    }
    if (!parsed.answers || typeof parsed.answers !== 'object') return null
    if (!Array.isArray(parsed.interests)) parsed.interests = []
    if (!Array.isArray(parsed.foundAdvantages)) parsed.foundAdvantages = []
    if (!Array.isArray(parsed.skippedBenefits)) parsed.skippedBenefits = []
    if (!Array.isArray(parsed.completedStages)) parsed.completedStages = []
    if (!parsed.currentStage) parsed.currentStage = 1
    if (!parsed.stageStartedAt) parsed.stageStartedAt = {}
    if (!parsed.stageDurations) parsed.stageDurations = {}
    if (parsed.stoppedAfterStage === undefined) parsed.stoppedAfterStage = null
    if (parsed.nextStageInterest === undefined) parsed.nextStageInterest = false
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: DiagnosisSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // 저장 실패(용량 등)해도 진단 진행은 막지 않음
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}

// ── 완료 결과 기록 (최근 5개, 진단을 다시 시작해도 지워지지 않음) ──
// 사용자가 직접 삭제할 때만 사라집니다.
export function loadHistory(): SavedResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    // 이전 종합진단 스냅샷은 AX Fit 화면으로 그릴 수 없으므로 현재 버전 결과만 보여준다
    return (arr as SavedResult[]).filter((r) => r && r.resultId && r.snapshot && r.resultVersion === DIAGNOSIS_VERSION)
  } catch {
    return []
  }
}

export function saveResultToHistory(input: {
  sessionId: string
  completedStage: SavedResult['completedStage']
  diagnosisDepth: SavedResult['diagnosisDepth']
  answers: SavedResult['answers']
  interests: string[]
  foundAdvantages: string[]
  snapshot: AxFitReport
  leadId?: string
}): SavedResult {
  const now = new Date().toISOString()
  const list = loadHistory()
  const prev = list.find((r) => r.sessionId === input.sessionId)
  const result: SavedResult = {
    resultId: prev?.resultId ?? `res_${input.sessionId}`,
    sessionId: input.sessionId,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
    completedStage: input.completedStage,
    diagnosisDepth: input.diagnosisDepth,
    answers: input.answers,
    interests: input.interests,
    foundAdvantages: input.foundAdvantages,
    resultVersion: DIAGNOSIS_VERSION,
    snapshot: input.snapshot,
    leadId: input.leadId ?? prev?.leadId,
  }
  try {
    // 구버전 결과는 loadHistory 에서 이미 걸러졌으므로, 여기서 저장하면 자연스럽게 정리된다
    const rest = list.filter((r) => r.sessionId !== input.sessionId)
    const next = [result, ...rest].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {
    /* 저장 실패해도 진단 진행은 막지 않음 */
  }
  return result
}

export function getResultById(resultId: string): SavedResult | null {
  return loadHistory().find((r) => r.resultId === resultId) ?? null
}

export function deleteResult(resultId: string) {
  try {
    const next = loadHistory().filter((r) => r.resultId !== resultId)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {
    /* noop */
  }
}

export function newSession(): DiagnosisSession {
  return {
    diagnosisVersion: DIAGNOSIS_VERSION,
    sessionId: `diag_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
    startedAt: new Date().toISOString(),
    currentQuestionId: null,
    answers: {},
    interests: [],
    foundAdvantages: [],
    skippedBenefits: [],
    currentStage: 1,
    completedStages: [],
    stoppedAfterStage: null,
    nextStageInterest: false,
    stageStartedAt: {},
    stageDurations: {},
    completed: false,
    utm: loadUtm() ?? undefined,
  }
}

// ── 유입경로(UTM) — 최초 진입 1회만 저장, 이후 유지 ──
const UTM_KEY = 'miraeBusinessDiagnosisUtm'

export type StoredUtm = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
  landingPath?: string
}

export function captureUtmOnce(): StoredUtm {
  const existing = loadUtm()
  if (existing) return existing
  let utm: StoredUtm = {}
  try {
    const q = new URLSearchParams(window.location.search)
    const referrer = document.referrer || undefined
    utm = {
      utmSource: q.get('utm_source') ?? undefined,
      utmMedium: q.get('utm_medium') ?? undefined,
      utmCampaign: q.get('utm_campaign') ?? undefined,
      utmContent: q.get('utm_content') ?? undefined,
      utmTerm: q.get('utm_term') ?? undefined,
      referrer,
      landingPath: window.location.pathname + window.location.search,
    }
    // UTM 없으면 referrer 기반 분류
    if (!utm.utmSource) {
      if (!referrer) utm.utmSource = 'direct'
      else {
        try {
          const host = new URL(referrer).hostname
          utm.utmSource = host.includes(window.location.hostname) ? 'internal' : host || 'unknown'
        } catch {
          utm.utmSource = 'unknown'
        }
      }
    }
    localStorage.setItem(UTM_KEY, JSON.stringify(utm))
  } catch {
    /* noop */
  }
  return utm
}

export function loadUtm(): StoredUtm | null {
  try {
    const raw = localStorage.getItem(UTM_KEY)
    return raw ? (JSON.parse(raw) as StoredUtm) : null
  } catch {
    return null
  }
}
