// 스크롤 어디에서나 20개 샘플로 바로 갈 수 있는 작은 손잡이.
//
//  - PC: 카톡 버튼 왼쪽에 나란히 놓인 알약.
//    모바일: 하단 고정 바의 오른쪽 40% 버튼이 이 패널을 연다(중복 방지를 위해 알약은 숨김).
//  - 누르면 두 묶음이 펼쳐지고, 각 묶음이 "어떤 샘플들인지" 한 줄 + 이름으로 보인다.
//  - 20개를 번호로 부르면 방문자에게 아무 의미가 없어서, 성격으로 나눠 이름을 붙였다.
//      업종 AX 10   — 실제 업종의 운영 화면과 고객 플랫폼 (페이지 앞쪽)
//      아이디어 MVP 10 — 머릿속 아이디어를 동작하는 서비스로 (페이지 뒤쪽)
import { useEffect, useRef, useState } from 'react'
import { AX_PLATFORM_SAMPLES, PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'

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

// 목록을 다 나열하면 훑어야 할 게 너무 많아진다 — 이름 두 개와 한 줄 설명만 크게 보여준다.
const GROUPS: Group[] = [
  {
    id: 'portfolio',
    title: '업종 AX 10',
    desc: '직원이 쓰는 운영 화면과 고객·거래처가 쓰는 플랫폼을 업종별로 만들어 둔 데모입니다.',
    cta: '업종 화면 10개 확인하기',
    card: 'border-[#3FBFB4]/35 bg-gradient-to-br from-[#0E3138] to-[#123F44] hover:border-[#5EEAD4]/60 hover:from-[#113A42] hover:to-[#154A50]',
    accent: 'text-[#5EEAD4]',
  },
  {
    id: 'mvp-refs',
    title: '아이디어 MVP 10',
    desc: '머릿속에만 있던 아이디어를 일단 움직이는 서비스로 만들어 본 초기 레퍼런스입니다.',
    cta: '아이디어 10개 확인하기',
    card: 'border-[#A78BFA]/35 bg-gradient-to-br from-[#241F3D] to-[#2E2652] hover:border-[#C4B5FD]/60 hover:from-[#2A2447] hover:to-[#372D61]',
    accent: 'text-[#C4B5FD]',
  },
]

const TOTAL = AX_PLATFORM_SAMPLES.length + PORTFOLIO_SAMPLES.length

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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const goTo = (id: string) => {
    setOpen(false)
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
      {/* 닫힌 상태 — 오른쪽 가장자리에 살짝 걸쳐 있는 손잡이 */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label={`샘플 ${TOTAL}개 둘러보기 열기`}
          // 본문 옆을 따라다니면 읽는 데 거슬린다 → 카톡 버튼 왼쪽, 같은 높이에 나란히 둔다
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+84px)] right-[4.75rem] z-40 hidden items-center sm:inline-flex gap-1.5 rounded-full bg-[#171B20]/92 px-3.5 py-3 text-white shadow-lg shadow-slate-900/25 ring-1 ring-white/15 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-[#171B20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D47A4A] sm:bottom-6 sm:right-[10.25rem] sm:px-4"
        >
          <span aria-hidden className="text-[1.05rem] leading-none text-[#E8B89A]">▦</span>
          <span className="whitespace-nowrap text-[1.05rem] font-black leading-none sm:text-[1.06rem]">
            샘플 {TOTAL}<span className="hidden sm:inline">개 보기</span>
          </span>
        </button>
      )}

      {/* 펼친 상태 */}
      {open && (
        <>
          <button
            type="button"
            aria-label="샘플 목록 닫기"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-[2px]"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="샘플 둘러보기"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-2xl border border-white/12 bg-[#171B20] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-white shadow-2xl [word-break:keep-all] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-1/2 sm:w-[360px] sm:-translate-y-1/2 sm:rounded-2xl sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.8rem] font-black tracking-tight text-[#D47A4A]">미래AI랩이 직접 만든 샘플</p>
                <p className="mt-0.5 text-[1.15rem] font-black leading-tight">어떤 걸 보시겠어요?</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
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
          </div>
        </>
      )}
    </>
  )
}
