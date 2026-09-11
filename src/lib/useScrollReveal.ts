// 스크롤하며 섹션이 짧게 떠오르는 효과.
// 숨기는 클래스(reveal-init)는 JS 가 직접 붙인다 — 스크립트가 안 돌면 아무것도 숨기지 않아 내용이 항상 보인다.
// 이미 화면에 보이는 것은 건드리지 않고, 아래에 있는 것만 대상으로 한다.
import { useEffect, type RefObject } from 'react'

export function useScrollReveal(root: RefObject<HTMLElement | null>, selector = '[data-reveal]') {
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('reveal-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )

    const arm = () => {
      el.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        if (node.classList.contains('reveal-init')) return
        // 첫 화면에 이미 보이는 것은 그대로 둔다(로드 직후 깜빡임 방지)
        if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return
        node.classList.add('reveal-init', 'reveal-quick')
        io.observe(node)
      })
    }
    arm()
    // 이미지·지연 렌더로 뒤늦게 붙는 요소까지 한 번 더 훑는다
    const t = window.setTimeout(arm, 700)
    return () => { window.clearTimeout(t); io.disconnect() }
  }, [root, selector])
}
