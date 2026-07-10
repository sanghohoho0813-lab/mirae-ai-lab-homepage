// 공개 페이지 공용 햄버거 메뉴 (PC·모바일 공통).
// 오른쪽 슬라이드 drawer + 반투명 overlay. ESC/바깥클릭 닫힘, body 스크롤 잠금,
// focus 이동, aria, 현재 페이지 표시, 터치영역 44px+, prefers-reduced-motion 대응(CSS).
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type MenuItem = { label: string; to: string; match?: (path: string) => boolean }

const MENU: MenuItem[] = [
  { label: '홈', to: '/', match: (p) => p === '/' },
  { label: '전체 상품', to: '/business-services#packages', match: (p) => p === '/business-services' },
  { label: '무료 기업 성장진단', to: '/business-diagnosis', match: (p) => p.startsWith('/business-diagnosis') },
  { label: '정책자금·지원금', to: '/business-services?category=funding' },
  { label: '벤처·기업인증', to: '/business-services?category=certification' },
  { label: '홈페이지·AI 시스템', to: '/business-services?category=digital' },
  { label: '진행 사례', to: '/business-services#cases' },
  { label: '자주 묻는 질문', to: '/business-services#faq' },
  { label: '상담 신청', to: '/business-services#apply' },
  { label: '컨설턴트용 서비스', to: '/consultants', match: (p) => p.startsWith('/consultants') },
]

/** 헤더에 넣는 햄버거 버튼 + drawer 세트 */
export default function PublicMenuDrawer({ buttonClassName = '' }: { buttonClassName?: string }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 라우트가 바뀌면 닫기
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search, location.hash])

  // ESC 닫기 + body 스크롤 잠금 + 포커스 이동
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // drawer 첫 포커스
    const first = panelRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      buttonRef.current?.focus()
    }
  }, [open])

  const path = location.pathname

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="전체 메뉴 열기"
        aria-expanded={open}
        className={`grid h-11 w-11 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${buttonClassName}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="전체 메뉴">
          {/* overlay */}
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
            className="animate-overlay-in absolute inset-0 h-full w-full cursor-default bg-slate-900/45 backdrop-blur-[2px]"
          />
          {/* drawer */}
          <div
            ref={panelRef}
            className="animate-drawer-in absolute inset-y-0 right-0 flex w-[85vw] max-w-sm flex-col bg-white shadow-2xl [word-break:keep-all]"
          >
            {/* 상단 */}
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
                  <span className="text-[0.72rem] font-medium text-slate-500">중소기업 대표님을 위한 경영지원 서비스</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="메뉴 닫기"
                className="grid h-11 w-11 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* 메뉴 목록 */}
            <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="사이트 메뉴">
              <ul className="space-y-0.5">
                {MENU.map((m) => {
                  const active = m.match ? m.match(path) : false
                  return (
                    <li key={m.label}>
                      <Link
                        to={m.to}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-11 items-center justify-between rounded-xl px-3.5 py-3 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                          active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {m.label}
                        {active ? (
                          <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-black text-white">현재</span>
                        ) : (
                          <span aria-hidden className="text-slate-300">›</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* 하단 CTA */}
            <div className="border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                to="/business-diagnosis"
                className="flex min-h-[52px] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                3분 무료 성장진단 시작하기
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
