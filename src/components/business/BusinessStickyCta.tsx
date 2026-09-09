// 모바일 하단 고정 바 — Primary(진단) 60% · Secondary(실제 AX 보기) 40%. 카톡은 KakaoFloat 이 따로 띄운다.
// 홈과 AX 상세 안내가 같은 바를 쓴다.
import { Link } from 'react-router-dom'

export default function BusinessStickyCta({ visible, onOpenSampleNav }: { visible: boolean; onOpenSampleNav: () => void }) {
  if (!visible) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
      {/* 모양은 같고 색과 크기만 다르게. basis 0 + min-w-0 이 있어야 글자 길이가 아니라 비율이 폭을 정한다. */}
      <Link
        to="/business-diagnosis"
        className="flex min-w-0 flex-[6_1_0%] items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-[#D47A4A] px-1.5 py-3 text-[0.84rem] font-bold text-[#171B20] shadow-sm transition-colors hover:bg-[#E8B89A] min-[360px]:px-2 min-[360px]:text-[0.92rem] min-[400px]:text-[1.0rem]"
      >
        <span className="hidden min-[400px]:inline">우리 회사&nbsp;</span>
        <span>AX 가능성 진단</span>
      </Link>
      <button
        type="button"
        onClick={onOpenSampleNav}
        className="flex min-w-0 flex-[4_1_0%] items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-[#171B20] px-1.5 py-3 text-[0.84rem] font-bold text-white shadow-sm transition-colors hover:bg-[#343B44] min-[360px]:px-2 min-[360px]:text-[0.92rem] min-[400px]:text-[1.0rem]"
      >
        <span aria-hidden className="hidden min-[370px]:inline text-[#E8B89A]">▦</span>
        <span>실제 AX 보기</span>
      </button>
    </div>
  )
}
