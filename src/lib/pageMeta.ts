// 새 대표님 페이지(선택 게이트 · 기술사업/MVP)가 함께 쓰는 <title>·description·og 메타 갱신 훅.
// 화면을 떠나면 메타는 이전 값으로 되돌린다. canonical 자체는 CanonicalLink 가 라우트 기준으로 맞춘다.
import { useEffect } from 'react'
import { canonicalUrl } from './site'

export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title
    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      const prev = el.content
      el.content = content
      return () => {
        el!.content = prev
      }
    }
    const restores = [
      setMeta('meta[name="description"]', 'name', 'description', description),
      setMeta('meta[property="og:title"]', 'property', 'og:title', title),
      setMeta('meta[property="og:description"]', 'property', 'og:description', description),
      setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl(path)),
    ]
    return () => restores.forEach((r) => r())
  }, [title, description, path])
}
