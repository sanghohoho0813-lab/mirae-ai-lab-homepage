// 스크롤 어디에서나 AX Preview 로 바로 갈 수 있는 작은 손잡이.
//
//  - PC: 카톡 버튼 왼쪽에 나란히 놓인 알약.
//    모바일: 하단 고정 바의 오른쪽 40% 버튼이 이 패널을 연다(중복 방지를 위해 알약은 숨김).
//  - 누르면 두 묶음이 펼쳐지고, 각 묶음이 "어떤 화면인지" 한 줄로 보인다.
//  - 개수(20개)를 핵심 메시지처럼 강조하지 않는다. 산업별 AX Preview 는 Concept Prototype 임을 함께 알린다.
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AX_PREVIEW_NOTE } from './axFinalHome'
import { AX_GUIDE_PATH } from '../../lib/businessRoutes'

const HEADER_OFFSET = 68

type Group = {
  id: string
  title: string
  desc: string
  cta: string
  /** 두 묶음을 색으로 구분한다 — 운영은 청록, 아이디어는 보라 */
  card: string
  accent: string
}

const GROUPS: Group[] = [
  {
    id: 'portfolio',
    title: '산업별 AX Preview',
    desc: '직원이 쓰는 운영 화면과 고객·거래처가 쓰는 플랫폼을 업종별 업무를 가정해 구현한 Concept Prototype입니다.',
    cta: '산업별 AX 화면 보기',
    card: 'border-[#3FBFB4]/35 bg-gradient-to-br from-[#0E3138] to-[#123F44] hover:border-[#5EEAD4]/60 hover:from-[#113A42] hover:to-[#154A50]',
    accent: 'text-[#5EEAD4]',
  },
  {
    id: 'mvp-refs',
    title: '아이디어 MVP Preview',
    desc: '머릿속에만 있던 아이디어를 일단 움직이는 서비스로 만들어 본 초기 레퍼런스입니다.',
    cta: 'MVP 화면 보기',
    card: 'border-[#A78BFA]/35 bg-gradient-to-br from-[#241F3D] to-[#2E2652] hover:border-[#C4B5FD]/60 hover:from-[#2A2447] hover:to-[#372D61]',
    accent: 'text-[#C4B5FD]',
  },
]

export default function SampleQuickNav({
  open: openProp,
  onOpenChange,
}: {
  /** 하단 고정 바 버튼처럼 바깥에서 열 때 사용 (미지정이면 스스로 관리) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
} = {}) {
  const [ownOpen, setOwnOpen] = useState(false)
  const open = openProp ?? ownOpen
  const setOpen = (v: boolean) => {
    setOwnOpen(v)
    onOpenChange?.(v)
  }
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  // 폰 뒤로가기 → 페이지를 떠나지 않고 이 창만 닫는다 (메뉴·상담 팝업과 같은 히스토리 센티넬 방식).
  // 이 창을 쓰는 페이지는 스크롤 복원을 직접 하므로(scrollRestoration=manual) 기록을 되돌려도 화면이 튀지 않는다.
  useEffect(() => {
    if (!open) return
    window.history.pushState({ ...(window.history.state ?? {}), miraeSampleNav: true }, '')
    const onPop = () => setOpenRef.current(false)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open])

  const hasEntry = () => Boolean((window.history.state as { miraeSampleNav?: boolean } | null)?.miraeSampleNav)
  // 닫기 — 쌓아 둔 기록을 뒤로가기로 소비한다(→ popstate → 닫힘). 기록이 없으면 바로 닫는다
  const requestClose = () => {
    if (hasEntry()) window.history.back()
    else setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // 묶음을 고르면 창을 닫고 그 구간으로 이동 — 기록을 먼저 되돌린 뒤(popstate) 스크롤해야 이동이 덮이지 않는다
  const goTo = (id: string) => {
    if (!hasEntry()) {
      setOpen(false)
      scrollToGroup(id)
      return
    }
    let done = false
    const run = () => {
      if (done) return
      done = true
      window.removeEventListener('popstate', run)
      window.clearTimeout(fallback)
      setOpen(false)
      scrollToGroup(id)
    }
    window.addEventListener('popstate', run)
    const fallback = window.setTimeout(run, 400)
    window.history.back()
  }

  const scrollToGroup = (id: string) => {
    // AX 시작 페이지(스토리 01~03)에는 샘플 구간이 없다 — 샘플이 있는 AX 상세 안내의 그 구간으로 보낸다
    if (!document.getElementById(id)) {
      navigate(`${AX_GUIDE_PATH}#${id}`)
      return
    }
    const targetY = () => {
      const el = document.getElementById(id)
      if (!el) return null
      return Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET)
    }
    const y = targetY()
    if (y == null) return
    window.scrollTo({ top: y, behavior: 'smooth' })

    // 지나온 구간의 lazy 이미지가 로드되며 높이가 바뀌면 목표가 밀린다 → 멈춘 뒤 다시 맞춘다.
    // 사용자가 직접 스크롤하기 시작하면 즉시 손을 뗀다(끌려가는 느낌 방지).
    const timers: number[] = []
    const stop = () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
    window.addEventListener('wheel', stop, { once: true, passive: true })
    window.addEventListener('touchstart', stop, { once: true, passive: true })
    window.addEventListener('keydown', stop, { once: true })
    ;[500, 900, 1500].forEach((delay, i, arr) => {
      timers.push(
        window.setTimeout(() => {
          const ny = targetY()
          if (ny != null && Math.abs(ny - window.scrollY) > 8) window.scrollTo({ top: ny, behavior: 'auto' })
          if (i === arr.length - 1) stop()
        }, delay),
      )
    })
  }

  return (
    <>
      {/* 닫힌 상태 — 카톡 버튼 왼쪽, 같은 높이에 나란히 (PC 전용) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label="AX Preview 열기"
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+84px)] right-[4.75rem] z-40 hidden items-center sm:inline-flex gap-1.5 rounded-full bg-[#171B20]/92 px-3.5 py-3 text-white shadow-lg shadow-slate-900/25 ring-1 ring-white/15 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-[#171B20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D47A4A] sm:bottom-6 sm:right-[10.25rem] sm:px-4"
        >
          <span aria-hidden className="text-[1.05rem] leading-none text-[#E8B89A]">▦</span>
          <span className="whitespace-nowrap text-[1.05rem] font-black leading-none sm:text-[1.06rem]">AX Preview</span>
        </button>
      )}

      {/* 펼친 상태 */}
      {open && (
        <>
          <button
            type="button"
            aria-label="AX Preview 닫기"
            onClick={requestClose}
            className="fixed inset-0 z-50 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-[2px]"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="AX Preview"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-2xl border border-white/12 bg-[#171B20] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-white shadow-2xl [word-break:keep-all] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-1/2 sm:w-[360px] sm:-translate-y-1/2 sm:rounded-2xl sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.8rem] font-black tracking-tight text-[#D47A4A]">INDUSTRY AX PREVIEW</p>
                <p className="mt-0.5 text-[1.15rem] font-black leading-tight">어떤 화면을 보시겠어요?</p>
              </div>
              <button
                type="button"
                onClick={requestClose}
                aria-label="닫기"
                className="-mr-1.5 -mt-1.5 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => goTo(g.id)}
                  className={`block w-full rounded-xl border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 ${g.card}`}
                >
                  <p className="text-[1.42rem] font-black leading-tight text-white sm:text-[1.5rem]">{g.title}</p>
                  <p className="mt-2 text-[1.02rem] font-medium leading-relaxed text-slate-300 sm:text-[1.05rem]">{g.desc}</p>
                  <p className={`mt-3 flex items-center gap-1.5 text-[1.02rem] font-black ${g.accent}`}>
                    {g.cta}
                    <span aria-hidden>→</span>
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-500">{AX_PREVIEW_NOTE}</p>
          </div>
        </>
      )}
    </>
  )
}
