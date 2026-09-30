// 사이트 공용 뒤로 · 앞으로 버튼 — 카카오톡·네이버 앱 안 브라우저처럼 주소창 버튼이 없는 곳에서도
// 실수로 뒤로 간 걸 되돌릴 수 있게 한다. 화면 오른쪽 아래 작은 알약 하나 — 아래 고정 바가 있으면 그 바로 위,
// 카카오톡 상담 버튼은 이 알약 위로 살짝 올라간다(--mirae-kakao-bottom).
//
// 브라우저는 '앞으로 갈 곳이 있는지'를 알려 주지 않아서, 이 탭 안에서의 위치를 history.state 에 직접 적어 둔다.
//  - pushState(새 이동)  → 위치 +1, 앞으로 갈 곳은 사라진다(max = 위치)
//  - replaceState       → 위치 그대로
//  - popstate(뒤로·앞으로) → 적어 둔 위치를 읽는다. 해시(#) 이동처럼 브라우저가 만든 칸은 이어서 +1
//  - 메뉴·상담 창·사진 크게 보기는 열 때 표시 칸(miraeDrawer 등)을 하나 쌓고 닫을 때 뒤로 가며 지운다 —
//    그 빈 칸으로 '앞으로' 가면 아무 일도 안 일어나 보이므로, 창을 닫으며 돌아온 경우엔 앞으로 갈 곳을 지운다.
// 뒤로 버튼은 이 사이트 안의 첫 칸(위치 0)에서 꺼진다 — 버튼으로 사이트 밖(카톡 대화방 등)으로 나가지 않게.
// 동작은 history.back()/forward() 그대로라, 각 페이지의 뒤로가기 처리(진단 화면 등)와 폰 뒤로가기가 똑같이 움직인다.
import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
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

// 사이트의 버튼 크기(폰 34px · PC 32px) + 알약 테두리 — 카톡 버튼을 얼마나 올릴지 계산할 때 쓴다
const PILL_H = { mobile: 38, wide: 36 }

// 상세 페이지의 폰 하단 바처럼 버튼을 바 안에 품는 곳(HistoryNavInline)이 떠 있으면, 폰에서는 떠 있는 알약을 숨긴다
let inlineCount = 0

/** 뒤로·앞으로 가능 여부 — 이동할 때마다 다시 그린다 */
function useNavState() {
  const [, rerender] = useReducer((x: number) => x + 1, 0)
  useEffect(() => {
    installHistoryNav()
    listeners.add(rerender)
    rerender()
    return () => {
      listeners.delete(rerender)
    }
  }, [])
  const pos = typeof window !== 'undefined' ? (posOf(window.history.state) ?? 0) : 0
  return { canBack: pos > 0, canForward: pos < max }
}

const ICON_BACK = (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12.5 4.5 7 10l5.5 5.5" />
  </svg>
)
const ICON_FWD = (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7.5 4.5 13 10l-5.5 5.5" />
  </svg>
)

/**
 * 폰 하단 바 안에 끼워 넣는 뒤로·앞으로 — 바의 다른 버튼과 같은 높이의 어두운 칸.
 * 이게 떠 있는 동안(폰) 화면에 떠 있는 알약은 숨는다.
 */
export function HistoryNavInline() {
  const { canBack, canForward } = useNavState()
  useEffect(() => {
    inlineCount += 1
    listeners.forEach((l) => l())
    return () => {
      inlineCount -= 1
      listeners.forEach((l) => l())
    }
  }, [])
  const btn =
    'grid h-full w-7 place-items-center transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E6C396] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent min-[380px]:w-8'
  return (
    <nav aria-label="페이지 이동" data-history-nav-inline className="flex shrink-0 items-stretch overflow-hidden rounded-xl bg-[#171B20] text-white shadow-sm">
      <button type="button" className={btn} onClick={() => window.history.back()} disabled={!canBack} aria-label="뒤로 가기" title="뒤로 가기">
        {ICON_BACK}
      </button>
      <span aria-hidden className="my-3 w-px bg-white/15" />
      <button type="button" className={btn} onClick={() => window.history.forward()} disabled={!canForward} aria-label="앞으로 가기" title="앞으로 가기">
        {ICON_FWD}
      </button>
    </nav>
  )
}

export default function HistoryNav() {
  const { pathname } = useLocation()
  const { canBack, canForward } = useNavState()
  // 화면 맨 아래에 깔린 고정 바(data-bottom-bar) 높이 — 있으면 그 바로 위에 붙는다
  const [barH, setBarH] = useState(0)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 640)

  // 고정 바는 스크롤 위치에 따라 나타나고 사라져서, 스크롤·화면 크기·DOM 변화 때마다 다시 잰다(한 프레임에 한 번)
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      setWide(window.innerWidth >= 640)
      let h = 0
      document.querySelectorAll<HTMLElement>('[data-bottom-bar]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.height > 0 && r.bottom >= window.innerHeight - 2) h = Math.max(h, window.innerHeight - r.top)
      })
      setBarH(Math.round(h))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mo.disconnect()
    }
  }, [pathname])

  const inFrame = typeof window !== 'undefined' && window.self !== window.top
  const hiddenRoute = HIDDEN.some((re) => re.test(pathname))
  // 폰에서 하단 바가 버튼을 품고 있으면 떠 있는 알약은 숨긴다
  const hostedInBar = inlineCount > 0 && !wide
  // 처음 들어와 갈 곳이 없으면 아예 숨긴다 — 두 번째 화면부터 나타난다
  const visible = !inFrame && !hiddenRoute && !hostedInBar && (canBack || canForward)

  // 오른쪽 아래 — 아래 고정 바가 있으면 바로 위(8px), 없으면 폰 16px · PC 24px
  const pillH = wide ? PILL_H.wide : PILL_H.mobile
  const bottom = wide ? '24px' : barH > 0 ? `${barH + 8}px` : 'calc(env(safe-area-inset-bottom, 0px) + 16px)'

  // 카카오톡 상담 버튼은 이 알약 바로 위로 살짝 올린다(원래 자리보다 낮아지지는 않게)
  useLayoutEffect(() => {
    const root = document.documentElement
    if (!visible) {
      root.style.removeProperty('--mirae-kakao-bottom')
      return
    }
    const above = wide ? `${24 + pillH + 10}px` : barH > 0 ? `${barH + 8 + pillH + 10}px` : `calc(env(safe-area-inset-bottom, 0px) + ${16 + pillH + 10}px)`
    const base = wide ? '24px' : 'calc(env(safe-area-inset-bottom, 0px) + 84px)'
    root.style.setProperty('--mirae-kakao-bottom', `max(${base}, ${above})`)
    return () => {
      root.style.removeProperty('--mirae-kakao-bottom')
    }
  }, [visible, wide, barH, pillH])

  if (!visible) return null

  const btn =
    'grid h-[34px] w-[34px] place-items-center rounded-full transition-colors hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E6C396] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent sm:h-8 sm:w-8'

  return (
    <nav
      aria-label="페이지 이동"
      data-history-nav
      style={{ bottom }}
      className="animate-fade-in fixed right-3 z-30 flex items-center rounded-full bg-[#0B0E12]/70 p-0.5 text-white shadow-[0_8px_22px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/15 backdrop-blur-md transition-[bottom] duration-200 sm:right-6 print:hidden"
    >
      <button type="button" className={btn} onClick={() => window.history.back()} disabled={!canBack} aria-label="뒤로 가기" title="뒤로 가기">
        {ICON_BACK}
      </button>
      <span aria-hidden className="h-3.5 w-px bg-white/15" />
      <button type="button" className={btn} onClick={() => window.history.forward()} disabled={!canForward} aria-label="앞으로 가기" title="앞으로 가기">
        {ICON_FWD}
      </button>
    </nav>
  )
}
