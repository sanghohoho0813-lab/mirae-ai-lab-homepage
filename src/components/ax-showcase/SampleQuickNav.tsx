// 스크롤 어디에서나 20개 샘플로 바로 갈 수 있는 작은 손잡이.
//
//  - 평소에는 오른쪽 가장자리에 반투명하게 비켜서 있어 읽기를 방해하지 않는다.
//    (카톡 버튼은 아래, 헤더는 위 → 세로 가운데에 둔다)
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
}

// 목록을 다 나열하면 훑어야 할 게 너무 많아진다 — 이름 두 개와 한 줄 설명만 크게 보여준다.
const GROUPS: Group[] = [
  {
    id: 'portfolio',
    title: '업종 AX 10',
    desc: '직원이 쓰는 운영 화면과 고객·거래처가 쓰는 플랫폼을 업종별로 만들어 둔 데모입니다.',
  },
  {
    id: 'mvp-refs',
    title: '아이디어 MVP 10',
    desc: '머릿속에만 있던 아이디어를 일단 움직이는 서비스로 만들어 본 초기 레퍼런스입니다.',
  },
]

const TOTAL = AX_PLATFORM_SAMPLES.length + PORTFOLIO_SAMPLES.length

export default function SampleQuickNav() {
  const [open, setOpen] = useState(false)
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
          className="fixed right-0 top-[57%] z-40 -translate-y-1/2 rounded-l-xl border border-r-0 border-white/15 bg-[#171B20]/70 py-3 pl-2.5 pr-2 text-white opacity-60 shadow-lg shadow-black/25 backdrop-blur transition-all hover:bg-[#171B20]/95 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D47A4A]"
        >
          <span aria-hidden className="block text-center text-[1.05rem] leading-none">▦</span>
          <span className="mt-1 block text-center text-[0.62rem] font-black leading-[1.35] tracking-tight text-[#E8B89A]">
            샘플
            <br />
            {TOTAL}개
            <br />
            보기
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
                  className="block w-full rounded-xl border border-white/12 bg-[#22272E] p-4 text-left transition-colors hover:border-[#D47A4A]/50 hover:bg-[#282E36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D47A4A] sm:p-4.5"
                >
                  <p className="flex items-center gap-2 text-[1.42rem] font-black leading-tight text-white sm:text-[1.5rem]">
                    {g.title}
                    <span aria-hidden className="text-[#D47A4A]">→</span>
                  </p>
                  <p className="mt-2 text-[1.02rem] font-medium leading-relaxed text-slate-300 sm:text-[1.05rem]">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
