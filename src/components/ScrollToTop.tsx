// 라우트(pathname) 변경 시 항상 페이지 맨 위에서 시작.
// - 해시(#faq 등)가 있으면 각 페이지의 해시 스크롤 로직이 처리하므로 건드리지 않음
// - 같은 페이지 내 쿼리 변경(?category=)은 pathname 이 같아 영향 없음
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    // 전역 CSS scroll-behavior:smooth 를 무시하고 즉시 점프 (페이지 전환 시 스크롤 애니메이션 방지)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
