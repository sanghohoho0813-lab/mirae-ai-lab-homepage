// 모바일 하단 고정 바 — Primary(진단) 60% · Secondary(실제 AX 보기) 40%. 카톡은 KakaoFloat 이 따로 띄운다.
// 홈과 AX 상세 안내가 같은 바를 쓴다.
import { Link } from 'react-router-dom'

export default function BusinessStickyCta({
  visible,
  onOpenSampleNav,
  diagnosisHref = '/business-diagnosis',
}: {
  visible: boolean
  onOpenSampleNav: () => void
  /** 진단 CTA 목적지 — 트랙 페이지는 ?interest= 를 붙여 유입을 구분한다 */
  diagnosisHref?: string
}) {
  if (!visible) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t border-[#E7E1D8] bg-[#F7F4EF]/92 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(11,14,18,0.08)] backdrop-blur-md sm:hidden">
      {/* 모양은 같고 색과 크기만 다르게. basis 0 + min-w-0 이 있어야 글자 길이가 아니라 비율이 폭을 정한다. */}
      <Link
        to={diagnosisHref}
        className="flex min-w-0 flex-[6_1_0%] items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#D47A4A] px-1.5 py-3 text-[0.84rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] min-[360px]:px-2 min-[360px]:text-[0.92rem] min-[400px]:text-[1.0rem]"
      >
        <span className="hidden min-[400px]:inline">우리 회사&nbsp;</span>
        <span>AX 가능성 진단</span>
      </Link>
      <button
        type="button"
        onClick={onOpenSampleNav}
        className="flex min-w-0 flex-[4_1_0%] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#171B20] px-1.5 py-3 text-[0.84rem] font-bold text-white shadow-sm transition-colors hover:bg-[#343B44] min-[360px]:px-2 min-[360px]:text-[0.92rem] min-[400px]:text-[1.0rem]"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="hidden h-3.5 w-3.5 text-[#E6C396] min-[370px]:block" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1.5" y="1.5" width="5" height="5" rx="1" /><rect x="9.5" y="1.5" width="5" height="5" rx="1" /><rect x="1.5" y="9.5" width="5" height="5" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /></svg>
        <span>실제 AX 보기</span>
      </button>
    </div>
  )
}
