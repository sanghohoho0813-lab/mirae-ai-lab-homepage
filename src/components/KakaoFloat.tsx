// 오른쪽 아래 상시 카카오톡 상담 플로팅 버튼 — PC·모바일 모두 "카톡 상담" 네 글자를 항상 표시.
// 모바일 하단 고정 CTA(약 64px)와 브라우저 safe-area 위에 위치해 겹치지 않게 한다.
import { consultLinks } from '../config/businessInfo'

export default function KakaoFloat() {
  return (
    <a
      href={consultLinks.kakaoChat}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡으로 상담하기 (새 탭에서 열림)"
      className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+84px)] z-40 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 text-[0.92rem] font-black text-[#181600] shadow-lg shadow-slate-900/20 ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 .1 0 .3.2.4.1.1.3 0 .4 0 .5-.1 2.8-1.9 3.3-2.2.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3.4 12 3.4z" />
      </svg>
      카톡 상담
    </a>
  )
}
