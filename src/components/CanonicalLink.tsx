// 라우트가 바뀔 때마다 <link rel="canonical"> 을 운영 도메인 기준으로 갱신한다.
// 화면에 아무것도 그리지 않는다 — 디자인·라우팅에 영향이 없다.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { canonicalUrl } from '../lib/site'

export default function CanonicalLink() {
  const { pathname } = useLocation()

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonicalUrl(pathname)

    // og:url 도 같은 주소로 맞춰 공유 카드가 운영 도메인을 가리키게 한다
    let og = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (!og) {
      og = document.createElement('meta')
      og.setAttribute('property', 'og:url')
      document.head.appendChild(og)
    }
    og.content = canonicalUrl(pathname)
  }, [pathname])

  return null
}
