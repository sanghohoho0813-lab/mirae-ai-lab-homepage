// 쇼케이스 선택 상태 유지 — 업종 상세페이지에 갔다가 홈으로 돌아오면
// 보던 모드(업종별/업무별)와 선택한 업종이 그대로 복원되어야 한다.
const KEY = 'ax-showcase:selection'

export type AxShowcaseSelection = { mode: 'industry' | 'task'; slug: string; taskKey: string }

export function saveAxSelection(sel: AxShowcaseSelection): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(sel))
  } catch {
    /* sessionStorage 불가 환경 무시 */
  }
}

export function readAxSelection(): AxShowcaseSelection | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as Partial<AxShowcaseSelection>
    if (!v || typeof v.slug !== 'string') return null
    return {
      mode: v.mode === 'task' ? 'task' : 'industry',
      slug: v.slug,
      taskKey: typeof v.taskKey === 'string' ? v.taskKey : 'order',
    }
  } catch {
    return null
  }
}
