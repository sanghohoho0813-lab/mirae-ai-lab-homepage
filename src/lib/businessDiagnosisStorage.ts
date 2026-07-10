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
    sessionId: `diag_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    startedAt: new Date().toISOString(),
    currentQuestionId: null,
    answers: {},
    interests: [],
    completed: false,
  }
}
