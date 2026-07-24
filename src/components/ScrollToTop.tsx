// 라우트(pathname) 변경 시 스크롤 위치 처리.
// - 해시(#faq 등)가 있으면 각 페이지의 해시 스크롤 로직이 처리하므로 건드리지 않음
// - 앱 내부 뒤로/앞으로 이동(POP)은 브라우저 스크롤 복원을 유지(뒤로가기 UX 보존)
// - 신규 진입·링크 이동(PUSH/REPLACE)과 새로고침·직접 진입은 항상 페이지 상단(Hero)에서 시작
// - 같은 페이지 내 쿼리 변경(?category=)은 pathname 이 같아 영향 없음
import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType() // 'POP' | 'PUSH' | 'REPLACE'
  const first = useRef(true)

  useEffect(() => {
    if (hash) {
      first.current = false
      return
    }
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    if (first.current) {
      first.current = false
      // 최초 로드: 새로고침·신규 직접 진입은 상단으로, 뒤로/앞으로 복원 진입은 브라우저에 맡김
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav?.type === 'back_forward') return
      toTop()
      return
    }

    // 앱 내부 이동: 뒤로/앞으로(POP)는 스크롤 복원 유지, 그 외(PUSH/REPLACE)는 상단으로
    if (navType === 'POP') return
    toTop()
  }, [pathname, hash, navType])

  return null
}
