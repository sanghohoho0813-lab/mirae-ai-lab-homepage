// 퀘스트형 기업 성장진단 — localStorage 임시 저장 (1차: DB 미사용).
// diagnosisVersion 이 다르면 안전하게 초기화합니다.
import type { DiagnosisSession } from '../types/businessDiagnosis'
import { DIAGNOSIS_VERSION } from '../data/businessDiagnosisQuestions'

const KEY = 'miraeBusinessDiagnosis'

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
