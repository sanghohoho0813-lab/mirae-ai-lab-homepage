// 오른쪽 아래 상시 카카오톡 상담 플로팅 버튼 — PC·모바일 모두 "카톡 상담" 네 글자를 항상 표시.
// 모바일 하단 고정 CTA(약 64px)와 브라우저 safe-area 위에 위치해 겹치지 않게 한다.
// 모바일 첫 화면에서는 히어로의 메인 CTA를 가리지 않도록, 조금 스크롤한 뒤에만 나타난다.
import { useEffect, useState } from 'react'
import { consultLinks } from '../config/businessInfo'

export default function KakaoFloat() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const sync = () => {
      // PC(sm 이상)에서는 항상 노출
      if (window.innerWidth >= 640) return setShown(true)
      // 모바일에서는 히어로 CTA를 지난 뒤 노출하고, 최종 CTA 구간에서는 다시 숨긴다
      const nearEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 900
      setShown(window.scrollY > 260 && !nearEnd)
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  return (
    <a
      href={consultLinks.kakaoChat}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡으로 상담하기 (새 탭에서 열림)"
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+84px)] z-40 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 text-[1.17rem] sm:text-[1.06rem] font-black text-[#181600] shadow-lg shadow-slate-900/20 ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 sm:right-6 sm:bottom-6 ${
        shown ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 .1 0 .3.2.4.1.1.3 0 .4 0 .5-.1 2.8-1.9 3.3-2.2.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3.4 12 3.4z" />
      </svg>
      카톡 상담
    </a>
  )
}
