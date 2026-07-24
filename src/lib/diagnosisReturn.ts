// 진단 결과 → 상세페이지 이동 시 "돌아갈 위치"를 세션에 보존.
// 진단 응답 자체는 businessDiagnosisStorage(localStorage)가 이미 보존하므로,
// 여기서는 사용자가 보고 있던 결과 화면 경로만 sessionStorage 로 기억한다.
const KEY = 'miraeDiagnosisReturn'

/** 상세페이지로 떠나기 직전, 현재 진단 결과 경로를 기억한다. */
export function rememberDiagnosisReturn(path?: string) {
  try {
    const p = path ?? window.location.pathname + window.location.search + window.location.hash
    sessionStorage.setItem(KEY, p)
  } catch {
    /* sessionStorage 접근 불가 환경 무시 */
  }
}

/** 상세페이지에서 "기업진단으로 돌아가기" 대상 경로를 읽는다(없으면 null). */
export function getDiagnosisReturn(): string | null {
  try {
    const p = sessionStorage.getItem(KEY)
    // 진단 관련 경로만 신뢰(오염 방지)
    return p && p.startsWith('/business-diagnosis') ? p : null
  } catch {
    return null
  }
}

/** 돌아간 뒤 기억을 비운다. */
export function clearDiagnosisReturn() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
