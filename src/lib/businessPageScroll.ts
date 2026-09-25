// 대표님용 페이지(홈 · AX 상세 안내)가 함께 쓰는 스크롤 처리.
//  - useHashScroll: 주소의 #앵커 로 이동. 이미지가 늦게 들어와 위치가 밀리므로 여러 번 다시 맞춘다.
//  - useReturnScroll: 샘플을 보고 뒤로 돌아왔을 때 보던 위치로 되돌린다.
import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { readBusinessReturn, clearBusinessReturn } from './businessServicesReturn'

/**
 * 구간(id)으로 바로 이동 — 위에 붙어 있는 헤더 높이(페이지마다 다르다)와 구간의 scroll-margin 중 큰 만큼 비켜서,
 * 구간 제목이 헤더 밑에 가려지지 않게 한다. 구간이 없으면 false.
 */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const header = [...document.querySelectorAll('header')].find((h) => {
    const pos = getComputedStyle(h).position
    return pos === 'sticky' || pos === 'fixed'
  })
  const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  const y = el.getBoundingClientRect().top + window.scrollY - Math.max(headerBottom, margin)
  window.scrollTo({ top: Math.max(0, y), left: 0, behavior: 'instant' })
  return true
}

export function useHashScroll() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    const go = () => {
      scrollToSection(id)
    }
    go()
    const timers = [80, 250, 600].map((d) => window.setTimeout(go, d))
    window.addEventListener('load', go, { once: true })
    return () => { timers.forEach(clearTimeout); window.removeEventListener('load', go) }
  }, [location.hash])
}

export function useReturnScroll() {
  const location = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (location.hash) return
    if (navType !== 'POP') return
    const saved = readBusinessReturn()
    if (!saved || saved.path !== location.pathname) return
    const y = Math.max(0, saved.scrollY)
    const apply = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' })
    apply()
    const timers = [60, 160, 320, 560].map((d) => window.setTimeout(apply, d))
    const onLoad = () => apply()
    window.addEventListener('load', onLoad, { once: true })
    const clear = window.setTimeout(() => clearBusinessReturn(), 720)
    return () => { timers.forEach(clearTimeout); window.clearTimeout(clear); window.removeEventListener('load', onLoad) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
