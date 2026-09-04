// 개인 영역(마이페이지·내 프로젝트·주문·관리자)이 검색엔진에 색인되지 않게 한다.
// robots.txt Disallow 와 별개로, 페이지가 직접 <meta name="robots" content="noindex"> 를 단다.
// 화면에 아무것도 그리지 않으며, 벗어나면 태그를 제거해 공개 페이지 색인에 영향을 주지 않는다.
import { useEffect } from 'react'

export default function NoIndex() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    const previous = meta.content
    meta.content = 'noindex, nofollow'
    return () => {
      if (!meta) return
      if (created) meta.remove()
      else meta.content = previous
    }
  }, [])
  return null
}
