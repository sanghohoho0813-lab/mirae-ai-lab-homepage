import { useEffect, useState } from 'react'

type Metric = { label: string; value: string }
type Slide = {
  tool: string
  accentText: string
  accentDot: string
  metrics: Metric[]
  feature: string
}

const slides: Slide[] = [
  {
    tool: '고용지원금 프로',
    accentText: 'text-blue-600',
    accentDot: 'bg-blue-500',
    metrics: [
      { label: '예상 수급 가능 지원금', value: '32,000,000원' },
      { label: '신청 가능 제도', value: '4건' },
      { label: '관리 대상 인원', value: '12명' },
      { label: '누락 위험 항목', value: '2건' },
    ],
    feature: '받을 수 있는 지원금을 놓치지 않도록 관리하고, 고객에게 더 많은 혜택을 안내하도록 돕습니다.',
  },
  {
    tool: '연구소 사후관리 OS',
    accentText: 'text-indigo-600',
    accentDot: 'bg-indigo-500',
    metrics: [
      { label: '설립 준비 체크 항목', value: '18개' },
      { label: '이번 달 관리 일정', value: '5건' },
      { label: '월간 알림', value: '활성화' },
      { label: '종합보고서', value: '생성 가능' },
    ],
    feature: '설립 단계부터 사후관리·월간 알림·보고서·추가 제안까지 한 번에 관리합니다.',
  },
  {
    tool: '법인컨설팅 세일즈 OS',
    accentText: 'text-orange-600',
    accentDot: 'bg-orange-500',
    metrics: [
      { label: '잠재 고객', value: '58건' },
      { label: '후속관리 대상', value: '14건' },
      { label: '진행중 제안', value: '9건' },
      { label: '미팅 전략 메모', value: '23건' },
    ],
    feature: '고객관리만이 아니라 미팅 전략·제안·교육·콘텐츠까지 한 곳에서 관리합니다.',
  },
  {
    tool: '크레탑 자동분석기',
    accentText: 'text-emerald-600',
    accentDot: 'bg-emerald-500',
    metrics: [
      { label: '분석 완료 시간', value: '2초' },
      { label: '핵심 재무지표', value: '12개' },
      { label: '3개년 증감 분석', value: '완료' },
      { label: '추천 미팅 주제', value: '7개' },
    ],
    feature: '재무분석 시간을 줄이고, 미팅 전에 꺼낼 핵심 포인트를 한눈에 정리합니다.',
  },
  {
    tool: '창업감면 & 취등록세 체크',
    accentText: 'text-rose-600',
    accentDot: 'bg-rose-500',
    metrics: [
      { label: '창업감면 가능성', value: '높음' },
      { label: '취등록세 절감 예상', value: '72,000,000원' },
      { label: '검토 필요 항목', value: '3개' },
      { label: '1분 진단', value: '가능' },
    ],
    feature: '복잡한 창업감면·취등록세 판단을 1분 안에 확인해 고객 앞에서 바로 보여줍니다.',
  },
]

function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3800)
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
          <span className="ml-2 text-sm font-semibold text-slate-500">미래 AI 랩 · 도구 미리보기</span>
          <span className="ml-auto rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
            {index + 1} / {slides.length}
          </span>
        </div>

        {/* Slide */}
        <div className="relative px-5 py-6 sm:px-7 sm:py-7">
          <div key={index} className="animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${slide.accentDot}`} />
              <p className="text-lg font-bold text-slate-900 sm:text-xl">{slide.tool}</p>
              <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                예시 화면
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {slide.metrics.map((metric, i) => (
                <div key={metric.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                  <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                  <p
                    className={`mt-1.5 text-lg font-extrabold tracking-tight sm:text-xl ${
                      i === 0 ? slide.accentText : 'text-slate-900'
                    }`}
                  >
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-900 px-4 py-3.5">
              <span className={`mt-0.5 text-sm font-bold ${slide.accentText}`} aria-hidden>
                ✦
              </span>
              <p className="text-sm font-medium leading-relaxed text-slate-200">{slide.feature}</p>
            </div>
          </div>

          {/* Controls */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="이전 미리보기"
            className="absolute -left-1 top-[44%] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition hover:bg-white sm:left-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="다음 미리보기"
            className="absolute -right-1 top-[44%] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition hover:bg-white sm:right-2"
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
