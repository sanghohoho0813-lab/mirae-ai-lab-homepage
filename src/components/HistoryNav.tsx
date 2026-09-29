// 사이트 공용 뒤로 · 앞으로 버튼 — 카카오톡·네이버 앱 안 브라우저처럼 주소창 버튼이 없는 곳에서도
// 실수로 뒤로 간 걸 되돌릴 수 있게 한다. 화면 왼쪽 아래 작은 알약 하나.
//
// 브라우저는 '앞으로 갈 곳이 있는지'를 알려 주지 않아서, 이 탭 안에서의 위치를 history.state 에 직접 적어 둔다.
//  - pushState(새 이동)  → 위치 +1, 앞으로 갈 곳은 사라진다(max = 위치)
//  - replaceState       → 위치 그대로
//  - popstate(뒤로·앞으로) → 적어 둔 위치를 읽는다. 해시(#) 이동처럼 브라우저가 만든 칸은 이어서 +1
//  - 메뉴·상담 창·사진 크게 보기는 열 때 표시 칸(miraeDrawer 등)을 하나 쌓고 닫을 때 뒤로 가며 지운다 —
//    그 빈 칸으로 '앞으로' 가면 아무 일도 안 일어나 보이므로, 창을 닫으며 돌아온 경우엔 앞으로 갈 곳을 지운다.
// 뒤로 버튼은 이 사이트 안의 첫 칸(위치 0)에서 꺼진다 — 버튼으로 사이트 밖(카톡 대화방 등)으로 나가지 않게.
// 동작은 history.back()/forward() 그대로라, 각 페이지의 뒤로가기 처리(진단 화면 등)와 폰 뒤로가기가 똑같이 움직인다.
import { useEffect, useReducer } from 'react'
import { useLocation } from 'react-router-dom'

const POS = '__miraePos'
const MAX_KEY = 'miraeNavMax'
const LAST_KEY = 'miraeNavLast'

type AnyState = Record<string, unknown>
const isObj = (s: unknown): s is AnyState => !!s && typeof s === 'object' && !Array.isArray(s)
const posOf = (s: unknown): number | null => (isObj(s) && typeof s[POS] === 'number' ? (s[POS] as number) : null)
/** 창을 열 때 쌓는 표시 칸인가 (miraeDrawer · miraeConsult · miraeSampleNav · miraePswp · miraeDiag) */
const isMarker = (s: unknown) => isObj(s) && Object.entries(s).some(([k, v]) => k.startsWith('mirae') && Boolean(v))

const store = {
  get: (k: string) => {
    try {
      return Number(sessionStorage.getItem(k)) || 0
    } catch {
      return 0
    }
  },
  set: (k: string, v: number) => {
    try {
      sessionStorage.setItem(k, String(v))
    } catch {
      // 저장이 막혀도(사생활 보호 모드 등) 이 문서 안에서는 그대로 동작한다
    }
  },
}

let installed = false
let max = 0
let lastPos = 0
let prevState: unknown = null
let rawReplace: History['replaceState'] | null = null
const listeners = new Set<() => void>()

function sync() {
  lastPos = posOf(window.history.state) ?? 0
  prevState = window.history.state
  store.set(MAX_KEY, max)
  store.set(LAST_KEY, lastPos)
  listeners.forEach((l) => l())
}

function onPop() {
  const h = window.history
  const pos = posOf(h.state)
  if (pos === null) {
    // 해시(#) 이동처럼 브라우저가 직접 만든 칸 — 이어지는 위치를 붙인다
    const next = lastPos + 1
    rawReplace?.({ ...(isObj(h.state) ? h.state : {}), [POS]: next }, '', window.location.href)
    max = next
  } else if (isMarker(prevState) && !isMarker(h.state) && pos === (posOf(prevState) ?? -2) - 1) {
    // 창을 닫으며 표시 칸에서 한 칸 돌아온 것 — 앞 칸은 빈 표시라 '앞으로' 대상에서 뺀다
    max = pos
  }
  sync()
}

/** 앱 시작 때 한 번 — 라우터보다 먼저 불러야 첫 칸부터 위치가 붙는다 */
export function installHistoryNav() {
  if (installed || typeof window === 'undefined') return
  installed = true
  const h = window.history
  const push = h.pushState.bind(h)
  const replace = h.replaceState.bind(h)
  rawReplace = replace
  max = store.get(MAX_KEY)
  lastPos = store.get(LAST_KEY)

  // 이 문서의 첫 칸 — 새로고침·뒤로/앞으로로 온 것이면 위치가 이미 적혀 있다.
  // 사이트 안 링크로 페이지를 새로 불러왔으면 이어서 +1, 밖에서 들어왔거나 새 탭이면 0부터.
  if (posOf(h.state) === null) {
    const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined
    let fromSite = false
    try {
      fromSite = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin
    } catch {
      fromSite = false
    }
    const pos = fromSite && nav?.type === 'navigate' && h.length > 1 ? Math.min(lastPos + 1, h.length - 1) : 0
    replace({ ...(isObj(h.state) ? h.state : {}), [POS]: pos }, '', window.location.href)
    max = pos
  }

  h.pushState = (state: unknown, unused: string, url?: string | URL | null) => {
    const pos = (posOf(h.state) ?? 0) + 1
    push(isObj(state) || state == null ? { ...(isObj(state) ? state : {}), [POS]: pos } : state, unused, url)
    max = pos
    sync()
  }
  h.replaceState = (state: unknown, unused: string, url?: string | URL | null) => {
    const pos = posOf(h.state) ?? 0
    replace(isObj(state) || state == null ? { ...(isObj(state) ? state : {}), [POS]: pos } : state, unused, url)
    sync()
  }
  window.addEventListener('popstate', onPop)
  window.addEventListener('hashchange', onPop)
  sync()
}

// 자체 이동 버튼이 있거나(진단: 이전·처음부터) 아래 고정 바가 화면 전체에 깔리는 곳(결제), 곧바로 밖으로 나가는 곳(초대 링크)
const HIDDEN = [/^\/business-diagnosis\/?$/, /^\/checkout\//, /^\/payment\//, /^\/pass\//]

export default function HistoryNav() {
  const { pathname } = useLocation()
  const [, rerender] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    installHistoryNav()
    listeners.add(rerender)
    rerender()
    return () => {
      listeners.delete(rerender)
    }
  }, [])

  if (typeof window === 'undefined') return null
  // 미리보기 틀(iframe) 안에서는 띄우지 않는다
  if (window.self !== window.top) return null
  if (HIDDEN.some((re) => re.test(pathname))) return null

  const pos = posOf(window.history.state) ?? 0
  const canBack = pos > 0
  const canForward = pos < max
  // 처음 들어와 갈 곳이 없으면 아예 숨긴다 — 두 번째 화면부터 나타난다
  if (!canBack && !canForward) return null

  const btn =
    'grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E6C396] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent sm:h-9 sm:w-9'

  return (
    <nav
      aria-label="페이지 이동"
      data-history-nav
      className="animate-fade-in fixed bottom-[calc(env(safe-area-inset-bottom,0px)+88px)] left-3 z-30 flex items-center rounded-full bg-[#0B0E12]/75 p-0.5 text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md sm:bottom-6 sm:left-6 print:hidden"
    >
      <button type="button" className={btn} onClick={() => window.history.back()} disabled={!canBack} aria-label="뒤로 가기" title="뒤로 가기">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12.5 4.5 7 10l5.5 5.5" />
        </svg>
      </button>
      <span aria-hidden className="h-4 w-px bg-white/15" />
      <button type="button" className={btn} onClick={() => window.history.forward()} disabled={!canForward} aria-label="앞으로 가기" title="앞으로 가기">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7.5 4.5 13 10l-5.5 5.5" />
        </svg>
      </button>
    </nav>
  )
}
