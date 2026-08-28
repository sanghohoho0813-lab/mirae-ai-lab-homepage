// 홈 — 미래AI랩이 직접 만든 MVP 레퍼런스 10개가 아주 천천히 계속 흘러가는 캐러셀.
// 목적: 처음 들어온 방문자가 "이 회사가 실제로 만들 수 있는가"를 사진으로 먼저 판단하게 한다.
//
// 움직임 방식
//  - 단계별로 툭툭 넘기지 않고 매 프레임 조금씩 밀어 끊김 없이 흐르게 한다.
//  - 카드 목록을 두 벌 렌더링하고, 한 바퀴를 지나면 같은 위치로 되돌려 이음매가 보이지 않게 한다.
//  - 마우스 접촉·세로 페이지 스크롤로는 멈추지 않는다. 직접 드래그하거나 버튼을 눌렀을 때만 잠깐 멈춘다.
//  - 탭이 숨겨져 있거나 "동작 줄이기" 설정이면 아예 움직이지 않는다.
import { useCallback, useEffect, useRef, useState } from 'react'
import { PORTFOLIO_SAMPLES, PORTFOLIO_SECTION } from '../../data/portfolioSamples'

/** 초당 이동 거리(px) — 카드 10장을 지루하지 않게 훑을 수 있는 속도 */
const SPEED = 56
/** 캐러셀을 직접 끈 뒤 다시 흐르기까지 기다리는 시간 */
const RESUME_MS = 2500
const N = PORTFOLIO_SAMPLES.length
/** 끊김 없는 순환을 위해 목록을 두 벌 그린다 */
const LOOP = [...PORTFOLIO_SAMPLES, ...PORTFOLIO_SAMPLES]

export default function AxPortfolioSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const resumeAt = useRef(0)
  const acc = useRef(0)
  /** 자동 이동이 발생시킨 scroll 이벤트 수 — 사용자 드래그와 구분한다 */
  const internal = useRef(0)

  // 카드 위치는 실제 offsetLeft 로 계산한다 — 여백·gap 이 달라져도 어긋나지 않는다
  const cards = () => Array.from(trackRef.current?.querySelectorAll('[data-card]') ?? []) as HTMLElement[]
  /** 카드 하나가 차지하는 간격 */
  const step = () => {
    const c = cards()
    return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : (c[0]?.offsetWidth ?? 0)
  }
  /** 한 바퀴 길이 = 카드 10장 */
  const loopWidth = () => {
    const c = cards()
    return c.length > N ? c[N].offsetLeft - c[0].offsetLeft : step() * N
  }
  const hold = useCallback(() => { resumeAt.current = Date.now() + RESUME_MS }, [])

  /** 원하는 카드로 이동 — 지금 위치에서 더 가까운 쪽(원본/복제본)으로 간다 */
  const goTo = useCallback((i: number, smooth = true) => {
    const el = trackRef.current
    const c = cards()
    if (!el || c.length === 0) return
    const w = step()
    const loop = loopWidth()
    const target = ((i % N) + N) % N
    const base = c[0].offsetLeft
    const a = c[target].offsetLeft - base
    const b = a + loop
    const cur = el.scrollLeft
    const to = Math.abs(a - cur) <= Math.abs(b - cur) ? a : b
    hold()
    el.scrollTo({ left: to, behavior: smooth ? 'smooth' : 'auto' })
    if (w > 0) setIndex(target)
  }, [hold])

  // 트랙 스크롤을 따라 현재 순번을 갱신한다.
  // 페이지를 위아래로 스크롤하거나 손이 스치는 것만으로는 절대 멈추지 않는다 —
  // 우리가 민 것이 아닌 가로 이동(직접 드래그)이 감지될 때만 잠깐 멈춘다.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      // 자동 이동이 만든 스크롤이면 정지시키지 않는다
      if (internal.current > 0) {
        internal.current -= 1
      } else {
        hold()
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = step()
        if (w > 0) setIndex(Math.round(el.scrollLeft / w) % N)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [hold])

  // 매 프레임 조금씩 미는 연속 이동 — 모션 축소 설정이면 켜지 않는다
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let prev = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = prev ? Math.min(now - prev, 100) : 0
      prev = now
      const el = trackRef.current
      if (!el || dt === 0) return
      if (document.hidden || Date.now() < resumeAt.current) { acc.current = 0; return }
      const loop = loopWidth()
      // 한 바퀴를 넘어가면 같은 그림 위치로 되돌린다 — 화면에는 이음매가 보이지 않는다
      if (loop > 0 && el.scrollLeft >= loop) {
        internal.current += 1
        el.scrollLeft -= loop
      }
      // scrollLeft 가 정수로 반올림돼도 멈추지 않도록 소수점을 모아 둔다
      acc.current += (SPEED * dt) / 1000
      const move = Math.floor(acc.current)
      if (move >= 1) {
        acc.current -= move
        internal.current += 1
        el.scrollLeft += move
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="portfolio" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="mx-auto max-w-3xl break-keep text-center text-[1.32rem] font-black leading-snug tracking-tight text-teal-300 sm:text-[1.5rem]">
            {PORTFOLIO_SECTION.kicker}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl whitespace-pre-line break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
            {PORTFOLIO_SECTION.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.24rem] leading-[1.75] text-slate-300 sm:text-[1.36rem]">
            {PORTFOLIO_SECTION.lead}
          </p>
        </div>

        {/* 캐러셀 — 좌우로 넘기며 실제 화면을 크게 본다 */}
        <div className="group relative mt-9 sm:mt-12">
          <div
            ref={trackRef}
            role="list"
            aria-label="미래AI랩이 만든 서비스 레퍼런스"
            className="ax-portfolio-track flex gap-4 overflow-x-auto px-5 pb-2 sm:gap-5 sm:px-[max(1.5rem,calc((100vw-64rem)/2))]"
          >
            {LOOP.map((s, i) => (
              <a
                key={`${s.slug}-${i}`}
                data-card
                role="listitem"
                aria-hidden={i >= N || undefined}
                tabIndex={i >= N ? -1 : undefined}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card w-[64vw] max-w-[270px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-slate-950 shadow-xl shadow-slate-950/40 transition-colors hover:border-teal-400/45 sm:w-[560px] sm:max-w-none sm:rounded-3xl"
              >
                <span className="block aspect-[16/10] overflow-hidden bg-slate-800">
                  <img
                    src={s.img}
                    srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
                    sizes="(min-width:640px) 560px, 64vw"
                    alt={s.alt}
                    width={1440}
                    height={900}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.02]"
                  />
                </span>
                <span className="block p-3.5 sm:p-6">
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="break-keep text-[1.14rem] font-black leading-tight text-white sm:text-[1.6rem]">{s.name}</span>
                    <span className="break-keep text-[0.98rem] font-bold text-teal-300 sm:text-[1.24rem]">{s.kind}</span>
                  </span>
                  <span className="mt-2.5 hidden break-keep text-[1.17rem] leading-relaxed text-slate-300 sm:block sm:text-[1.24rem]">{s.summary}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3.5">
                    {s.tags.map((t) => (
                      <span key={t} className="hidden rounded-lg bg-white/8 px-2.5 py-1 font-bold text-slate-300 ring-1 ring-inset ring-white/12 sm:inline text-[1.1rem]">
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto inline-flex items-center gap-1 text-[0.95rem] font-black text-teal-300 sm:text-[1.17rem]">
                      사이트 열기 <span aria-hidden>↗</span>
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>

          {/* 좌우 이동 — PC 에서만 겹쳐 표시 */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="이전 서비스"
            className="absolute left-3 top-[32%] hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/80 text-xl text-white backdrop-blur transition-colors hover:bg-slate-800 lg:grid"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="다음 서비스"
            className="absolute right-3 top-[32%] hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/80 text-xl text-white backdrop-blur transition-colors hover:bg-slate-800 lg:grid"
          >
            →
          </button>
        </div>

        {/* 현재 위치 + 이동 버튼(모바일) */}
        <div className="mx-auto mt-5 flex max-w-5xl items-center justify-center gap-3 px-5 sm:px-6">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="이전 서비스"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-lg text-white lg:hidden"
          >
            ←
          </button>
          <span className="min-w-[4.5rem] text-center text-[1.17rem] font-black tabular-nums text-slate-300 sm:text-[1.24rem]">
            <span className="text-teal-300">{index + 1}</span> / {PORTFOLIO_SAMPLES.length}
          </span>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="다음 서비스"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-lg text-white lg:hidden"
          >
            →
          </button>
        </div>

        {/* 점 표시 — 어디쯤인지 한눈에 */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 px-5">
          {PORTFOLIO_SAMPLES.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${s.name} 보기`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-7 bg-teal-400' : 'w-2.5 bg-white/25 hover:bg-white/40'}`}
            />
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-2xl break-keep px-5 text-center text-[1.1rem] leading-relaxed text-slate-500 sm:px-6 sm:text-[1.17rem]">
          {PORTFOLIO_SECTION.note}
        </p>
      </div>
    </section>
  )
}
