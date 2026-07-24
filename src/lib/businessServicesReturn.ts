// BusinessServicesPage 복귀 스크롤 위치 저장/복원 — 성장 모듈·서비스 상세를 본 뒤 뒤로가기 시
// 이전 스크롤 위치(가능하면 클릭한 카드 기준)로 복원한다. 새 진입/해시 진입은 대상 아님.
const KEY = 'business-services:return-state'

export type ReturnState = {
  path: string
  hash: string
  scrollY: number
  cardId: string | null
  ts: number
}

export function saveBusinessReturn(cardId: string | null): void {
  try {
    const state: ReturnState = {
      path: window.location.pathname,
      hash: window.location.hash,
      scrollY: window.scrollY,
      cardId,
      ts: Date.now(),
    }
    sessionStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* sessionStorage 불가 환경 무시 */
  }
}

export function readBusinessReturn(): ReturnState | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as ReturnState
  } catch {
    return null
  }
}

export function clearBusinessReturn(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
