import { useEffect, type RefObject } from 'react'

/** 스크롤 등장 — ref 안의 [data-reveal] 요소가 화면에 들어오면 아래에서 살짝 떠오른다(index.css 의 reveal-init → reveal-in).
 *  같이 들어온 요소끼리는 위에서부터 step(ms) 간격으로 차례로 나온다(한 줄에 둘이 있으면 왼쪽 → 오른쪽).
 *  움직임 줄이기 설정이거나 IntersectionObserver 가 없으면 아무것도 하지 않는다(처음부터 그대로 보인다). */
export function useReveal(ref: RefObject<HTMLElement | null>, step = 110) {
  useEffect(() => {
    const root = ref.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => els.indexOf(a) - els.indexOf(b))
          .forEach((el, i) => {
            el.style.transitionDelay = `${i * step}ms`
            el.classList.add('reveal-in')
            io.unobserve(el)
          })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => {
      el.classList.add('reveal-init')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [ref, step])
}
