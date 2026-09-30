// 상세 페이지(2주 기술사업 빌드 · AX 풀 구축) 폰 하단 고정 바 — 두 페이지가 같은 모양을 쓴다.
//   [주 버튼(주황)] [보조 버튼(먹색)] [카톡] [뒤로 · 앞으로]
// 카톡 상담과 뒤로·앞으로를 바 위에 따로 띄우면 글을 가려서, 바 오른쪽 끝에 작게 끼워 넣는다.
// 바가 떠 있는 동안 떠 있는 카톡 버튼(KakaoFloat mobileHidden)과 뒤로·앞으로 알약(HistoryNav)은 폰에서 숨는다.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { consultLinks } from '../../config/businessInfo'
import { HistoryNavInline } from '../HistoryNav'

type Action = { label: ReactNode; ariaLabel?: string } & ({ to: string; onClick?: never } | { onClick: () => void; to?: never })

const BTN =
  'flex min-h-12 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-xl px-1.5 text-[0.82rem] font-bold shadow-sm transition-colors min-[380px]:px-2 min-[380px]:text-[0.9rem] min-[420px]:text-[0.96rem]'
const PRIMARY = `${BTN} flex-[1.3_1_0%] bg-[#D47A4A] text-[#171B20] hover:bg-[#E8B89A]`
const SECONDARY = `${BTN} flex-[1_1_0%] bg-[#171B20] text-white hover:bg-[#343B44]`

export default function DetailMobileBar({
  primary,
  secondary,
  dataAttrs,
}: {
  primary: Action
  secondary: Action
  /** 기존 점검·스크립트가 찾는 표시(예: data-mvp-sticky) */
  dataAttrs?: Record<string, string>
}) {
  const render = (a: Action, cls: string) =>
    a.to ? (
      <Link to={a.to} aria-label={a.ariaLabel} className={cls}>
        {a.label}
      </Link>
    ) : (
      <button type="button" onClick={a.onClick} aria-label={a.ariaLabel} className={cls}>
        {a.label}
      </button>
    )

  return (
    <div
      {...dataAttrs}
      data-bottom-bar
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-1.5 border-t border-[#E7EAEE] bg-[#FAFAF8]/95 px-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(23,27,32,0.08)] backdrop-blur-md sm:hidden"
    >
      {/* basis 0 + min-w-0 이 있어야 글자 길이가 아니라 비율이 폭을 정한다 */}
      {render(primary, PRIMARY)}
      {render(secondary, SECONDARY)}
      <a
        href={consultLinks.kakaoChat}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡으로 상담하기 (새 탭에서 열림)"
        className="grid w-10 shrink-0 place-items-center rounded-xl bg-[#171B20] text-[#FEE500] shadow-sm transition-colors hover:bg-[#343B44]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 .1 0 .3.2.4.1.1.3 0 .4 0 .5-.1 2.8-1.9 3.3-2.2.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3.4 12 3.4z" />
        </svg>
      </a>
      <HistoryNavInline />
    </div>
  )
}
