import { useEffect, useState } from 'react'

type Stat = { label: string; value: string }
type Slide = { tool: string; accentText: string; accentDot: string; stats: Stat[] }

const slides: Slide[] = [
  {
    tool: '고용지원금 프로',
    accentText: 'text-blue-600',
    accentDot: 'bg-blue-500',
    stats: [
      { label: '예상 지원금', value: '32,000,000원' },
      { label: '신청 가능 제도', value: '4건' },
    ],
  },
  {
    tool: '연구소 사후관리 OS',
    accentText: 'text-indigo-600',
    accentDot: 'bg-indigo-500',
    stats: [
      { label: '이번 달 관리 필요', value: '3건' },
      { label: '변경신고 예정', value: '2건' },
    ],
  },
  {
    tool: '법인컨설팅 세일즈 OS',
    accentText: 'text-orange-600',
    accentDot: 'bg-orange-500',
    stats: [
      { label: '진행 고객', value: '58건' },
      { label: '이번 달 계약률', value: '34%' },
    ],
  },
  {
    tool: '크레탑 자동분석기',
    accentText: 'text-emerald-600',
    accentDot: 'bg-emerald-500',
    stats: [
      { label: '위험 신호', value: '2건' },
      { label: '추천 컨설팅', value: '4건' },
    ],
  },
  {
    tool: '창업감면 & 취등록세 체크',
    accentText: 'text-rose-600',
    accentDot: 'bg-rose-500',
    stats: [{ label: '예상 절세효과', value: '72,000,000원' }],
  },
]

function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500)
    return () => clearInterval(id)
  }, [index, paused])

  const go = (next: number) => setIndex((next + slides.length) % slides.length)
  const slide = slides[index]

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-2xl" />
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          <span className="ml-2 text-sm font-semibold text-slate-500">AI Business Lab · 도구 미리보기</span>
          <span className="ml-auto rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
            {index + 1} / {slides.length}
          </span>
        </div>

        {/* Slide */}
        <div className="relative px-6 py-7 sm:px-7">
          <div key={index} className="animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${slide.accentDot}`} />
              <p className="text-lg font-bold text-slate-900 sm:text-xl">{slide.tool}</p>
              <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                예시 화면
              </span>
            </div>

            <div
              className={`mt-6 grid gap-4 ${slide.stats.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
            >
              {slide.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-5">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl ${slide.accentText}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="이전 미리보기"
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="다음 미리보기"
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm transition hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 border-t border-slate-100 py-4">
          {slides.map((s, i) => (
            <button
              key={s.tool}
              type="button"
              onClick={() => go(i)}
              aria-label={`${s.tool} 미리보기로 이동`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroSlider
