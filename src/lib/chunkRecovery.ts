// 코드 분할된 화면 파일(청크)을 못 불러왔을 때의 복구.
//
// 왜 필요한가: 배포가 새로 되면 예전 화면을 열어 둔 탭은 이미 사라진 파일 이름을 요청한다.
// Vercel 은 없는 파일 대신 index.html(200, text/html)을 돌려주므로 브라우저가 스크립트로 읽지 못해 실패한다.
// 하루에도 여러 번 배포하므로 실제로 일어나는 일이다.
//
// 대응: 한 번만 새로고침해 새 index.html(= 새 파일 이름)을 받게 한다.
// 30초 안에 또 실패하면 새로고침하지 않고 에러 화면(직접 새로고침 버튼)으로 넘긴다 — 무한 새로고침 방지.
import { lazy, type ComponentType } from 'react'

const KEY = 'miraeChunkReloadAt'
const WINDOW_MS = 30_000

export function isChunkLoadError(e: unknown): boolean {
  const msg = e instanceof Error ? `${e.name} ${e.message}` : String(e ?? '')
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk [\w-]+ failed|Unable to preload CSS|MIME type/i.test(msg)
}

/** 최근 30초 안에 이미 새로고침했거나, 저장소가 막혀 기록을 못 남기면 새로고침하지 않고 false */
export function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < WINDOW_MS) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

/** React.lazy 와 같지만, 배포 직후 파일 이름이 바뀌어 못 받으면 한 번 새로고침한다 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyPage<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await factory()
      // main.tsx 의 vite:preloadError 처리기가 새로고침을 시작하며 오류를 삼키면 빈 값이 넘어온다.
      // 그대로 넘기면 React 가 오류를 내 에러 화면이 잠깐 번쩍이므로, 새로고침될 때까지 아무것도 그리지 않는다.
      if (!mod || !('default' in mod)) return await new Promise<{ default: T }>(() => {})
      return mod
    } catch (e) {
      if (isChunkLoadError(e) && reloadOnce()) {
        // 새로고침이 진행되는 동안에는 아무것도 그리지 않는다
        return await new Promise<{ default: T }>(() => {})
      }
      throw e
    }
  })
}
