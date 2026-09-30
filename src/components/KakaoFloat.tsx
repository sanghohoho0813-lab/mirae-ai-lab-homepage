// 오른쪽 아래 상시 카카오톡 상담 플로팅 버튼 — PC는 "카톡 상담" 라벨, 모바일은 하단 고정 CTA와 겹치지 않게 작은 아이콘만.
// 노란 알약은 광고처럼 튀어서, 먹색 바탕에 카카오 노랑 말풍선만 남긴다.
// 모바일 하단 고정 CTA(약 64px)와 브라우저 safe-area 위에 위치해 겹치지 않게 한다.
// 모바일 첫 화면에서는 히어로의 메인 CTA를 가리지 않도록, 조금 스크롤한 뒤에만 나타난다.
// 뒤로·앞으로 알약(HistoryNav)이 떠 있으면 그 바로 위로 살짝 올라간다 — 높이는 HistoryNav 가 --mirae-kakao-bottom 으로 알려 준다.
import { useEffect, useRef, useState } from 'react'
import { consultLinks } from '../config/businessInfo'

export default function KakaoFloat({ mobileHidden = false }: { mobileHidden?: boolean }) {
  const [shown, setShown] = useState(false)
  // 폰 하단 바가 카톡 버튼을 품고 있는 동안에는 폰에서 띄우지 않는다
  const hiddenRef = useRef(mobileHidden)
  hiddenRef.current = mobileHidden

  useEffect(() => {
    const sync = () => {
      // PC(sm 이상)에서는 항상 노출
      if (window.innerWidth >= 640) return setShown(true)
      if (hiddenRef.current) return setShown(false)
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
  }, [mobileHidden])

  return (
    <a
      href={consultLinks.kakaoChat}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡으로 상담하기 (새 탭에서 열림)"
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={`fixed right-4 bottom-[var(--mirae-kakao-bottom,calc(env(safe-area-inset-bottom,0px)+84px))] z-40 inline-flex items-center gap-2 rounded-full bg-[#171B20]/95 p-3.5 text-[1.17rem] font-bold text-white shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0B0E12] sm:right-6 sm:bottom-[var(--mirae-kakao-bottom,1.5rem)] sm:py-3 sm:pl-3.5 sm:pr-4 sm:text-[0.98rem] ${
        shown ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#FEE500] sm:h-5 sm:w-5" fill="currentColor" aria-hidden>
        <path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 .1 0 .3.2.4.1.1.3 0 .4 0 .5-.1 2.8-1.9 3.3-2.2.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3.4 12 3.4z" />
      </svg>
      <span className="hidden sm:inline">카톡 상담</span>
    </a>
  )
}
