// 휴대폰 맨 아래 시스템 바 영역 색 맞추기 — 안드로이드 크롬(가장자리까지 그리기)은 화면 맨 아래에 '바탕색 띠'를 그렸다가
// 스크롤하면 걷어 낸다. 띠 색은 문서(html) 바탕색인데, 우리 사이트는 바탕색을 정하지 않아 늘 흰색이었다.
// 그래서 어두운 화면 아래에서 흰 띠 ↔ 어두운 화면이 번갈아 보이며 '반짝이는' 것처럼 보였다(대표님 녹화 2026-10-02).
// 해결: 화면 맨 아래 한가운데에 보이는 내용의 바탕색을 html 바탕색으로 따라 맞춘다(스크롤·화면 이동 때마다).
//  - 반투명 장식(흐린 빛 번짐 등)은 건너뛰고, 거의 불투명한 바탕을 가진 가장 위 요소의 색을 쓴다.
//  - html·body 자신은 건너뛴다(자기 색을 다시 읽는 되먹임 방지). 아무것도 없으면 흰색.
//  - 색이 바뀔 때만 적용한다(스크롤 중 비용 거의 없음). 인쇄할 때는 index.css 가 흰 바탕으로 덮는다.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const FALLBACK = 'rgb(255, 255, 255)'

// 계산된 색의 불투명도 — rgb() · rgba() · oklch(… / a) · color(… / a) 모두. Tailwind v4 는 oklch 로 준다
function alphaOf(c: string): number {
  if (c === 'transparent') return 0
  const m = c.match(/\(([^)]*)\)/)
  if (!m) return 1
  const inner = m[1]
  const raw = inner.includes('/') ? inner.split('/')[1] : inner.split(',')[3]
  if (raw == null) return 1
  const t = raw.trim()
  return t.endsWith('%') ? parseFloat(t) / 100 : parseFloat(t)
}

export function sampleBottomColor(): string {
  const root = document.documentElement
  const x = Math.round(window.innerWidth / 2)
  const y = Math.max(0, window.innerHeight - 2)
  for (const el of document.elementsFromPoint(x, y)) {
    if (el === root || el === document.body) continue
    const c = getComputedStyle(el).backgroundColor
    if (alphaOf(c) >= 0.85) return c
  }
  return FALLBACK
}

export default function BottomBarTint() {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let last = ''
    const apply = () => {
      raf = 0
      const c = sampleBottomColor()
      if (c !== last) {
        last = c
        root.style.backgroundColor = c
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    // 스크롤이 멈춘 뒤 한 번 더 — 아래 고정 바처럼 스크롤 뒤에 미끄러져 들어오는 것까지 맞춘다
    let trail = 0
    const onScroll = () => {
      schedule()
      window.clearTimeout(trail)
      trail = window.setTimeout(schedule, 450)
    }
    // 화면 코드는 나눠 받으므로(lazy) 그려진 뒤에 몇 번 더 맞춘다
    const timers = [0, 150, 600, 1500].map((ms) => window.setTimeout(schedule, ms))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('resize', schedule)
    document.addEventListener('transitionend', schedule, true)
    return () => {
      timers.forEach(clearTimeout)
      window.clearTimeout(trail)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('resize', schedule)
      document.removeEventListener('transitionend', schedule, true)
    }
  }, [pathname])

  return null
}
