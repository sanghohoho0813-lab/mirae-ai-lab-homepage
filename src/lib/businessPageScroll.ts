// 대표님용 페이지(홈 · AX 상세 안내)가 함께 쓰는 스크롤 처리.
//  - useHashScroll: 주소의 #앵커 로 이동. 이미지가 늦게 들어와 위치가 밀리므로 여러 번 다시 맞춘다.
//  - useReturnScroll: 샘플을 보고 뒤로 돌아왔을 때 보던 위치로 되돌린다.
import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { readBusinessReturn, clearBusinessReturn } from './businessServicesReturn'

export function useHashScroll() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const go = () => {
      const el = document.getElementById(id)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - 68
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
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
