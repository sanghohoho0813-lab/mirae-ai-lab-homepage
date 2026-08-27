// 홈 — 미래AI랩이 직접 만든 MVP 레퍼런스 10개를 좌우로 넘겨 보는 캐러셀.
// 목적: 처음 들어온 방문자가 "이 회사가 실제로 만들 수 있는가"를 사진 한 장으로 판단하게 한다.
// 자동으로 천천히 넘어가되, 사용자가 만지거나 탭이 숨겨지면 멈춘다(모션 축소 설정도 존중).
import { useCallback, useEffect, useRef, useState } from 'react'
import { PORTFOLIO_SAMPLES, PORTFOLIO_SECTION } from '../../data/portfolioSamples'

const AUTO_MS = 4800

export default function AxPortfolioSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const resumeAt = useRef(0)

  // 카드 위치는 실제 offsetLeft 로 계산한다 — 여백·gap·스냅이 달라져도 어긋나지 않는다
  const cards = () => Array.from(trackRef.current?.querySelectorAll('[data-card]') ?? []) as HTMLElement[]
  const step = () => {
    const c = cards()
    return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : (c[0]?.offsetWidth ?? 0)
  }

  const goTo = useCallback((i: number, smooth = true) => {
    const el = trackRef.current
    const c = cards()
    if (!el || c.length === 0) return
    const n = c.length
    const next = ((i % n) + n) % n
    el.scrollTo({ left: c[next].offsetLeft - c[0].offsetLeft, behavior: smooth ? 'smooth' : 'auto' })
    setIndex(next)
  }, [])

  // 사용자가 직접 스크롤하면 현재 위치를 따라가고, 잠시 자동이동을 멈춘다
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = step()
        if (w <= 0) return
        // 끝까지 밀면 마지막 카드가 다 보이지 않아도 마지막 순번으로 센다
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
        setIndex(atEnd ? PORTFOLIO_SAMPLES.length - 1 : Math.min(PORTFOLIO_SAMPLES.length - 1, Math.round(el.scrollLeft / w)))
      })
    }
    const hold = () => { resumeAt.current = Date.now() + 9000 }
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('pointerdown', hold, { passive: true })
    el.addEventListener('wheel', hold, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', hold)
      el.removeEventListener('wheel', hold)
      cancelAnimationFrame(raf)
    }
  }, [])

  // 자동 이동 — 모션 축소 설정이면 켜지 않는다
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (paused || document.hidden || Date.now() < resumeAt.current) return
      const el = trackRef.current
      if (!el) return
      const w = step()
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
      const cur = atEnd ? PORTFOLIO_SAMPLES.length - 1 : w > 0 ? Math.round(el.scrollLeft / w) : 0
      goTo(cur + 1)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, goTo])

  return (
    <section id="portfolio" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="text-center text-[1.16rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">{PORTFOLIO_SECTION.eyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
            {PORTFOLIO_SECTION.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.24rem] leading-[1.75] text-slate-300 sm:text-[1.36rem]">
            {PORTFOLIO_SECTION.lead}
          </p>
        </div>

        {/* 캐러셀 — 좌우로 넘기며 실제 화면을 크게 본다 */}
        <div
          className="group relative mt-9 sm:mt-12"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            role="list"
            aria-label="미래AI랩이 만든 서비스 레퍼런스"
            className="ax-portfolio-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:gap-5 sm:px-[max(1.5rem,calc((100vw-64rem)/2))]"
          >
            {PORTFOLIO_SAMPLES.map((s, i) => (
              <a
                key={s.slug}
                data-card
                role="listitem"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card w-[86vw] max-w-[560px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/12 bg-slate-950 shadow-xl shadow-slate-950/40 transition-colors hover:border-teal-400/45 sm:w-[560px]"
              >
                <span className="block aspect-[16/10] overflow-hidden bg-slate-800">
                  <img
                    src={s.img}
                    srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
                    sizes="(min-width:640px) 560px, 86vw"
                    alt={s.alt}
                    width={1440}
                    height={900}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.02]"
                  />
                </span>
                <span className="block p-5 sm:p-6">
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="break-keep text-[1.43rem] font-black leading-tight text-white sm:text-[1.6rem]">{s.name}</span>
                    <span className="break-keep text-[1.17rem] font-bold text-teal-300 sm:text-[1.24rem]">{s.kind}</span>
                  </span>
                  <span className="mt-2.5 block break-keep text-[1.17rem] leading-relaxed text-slate-300 sm:text-[1.24rem]">{s.summary}</span>
                  <span className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-lg bg-white/8 px-2.5 py-1 text-[1.04rem] font-bold text-slate-300 ring-1 ring-inset ring-white/12 sm:text-[1.1rem]">
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto inline-flex items-center gap-1 text-[1.1rem] font-black text-teal-300 sm:text-[1.17rem]">
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
