import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// 루트(/) 역할 선택 게이트웨이. 기존 페이지/컴포넌트는 건드리지 않습니다.
// 배경은 실제 이미지 대신 CSS 로만 은은한 모션그래픽을 구현합니다.

const gridBackground = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
  backgroundSize: '54px 54px',
  WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 40%, #000 30%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 75% 60% at 50% 40%, #000 30%, transparent 100%)',
} as const

const motionCss = `
  @keyframes gwDriftA { 0%,100% { transform: translate(0,0) } 50% { transform: translate(30px,-22px) } }
  @keyframes gwDriftB { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-26px,18px) } }
  @keyframes gwFloat  { 0%,100% { transform: translateY(0); opacity: .35 } 50% { transform: translateY(-12px); opacity: .7 } }
  @media (prefers-reduced-motion: reduce) { .gw-anim { animation: none !important } }
`

const floatWords = [
  { label: '정책자금', className: 'left-[8%] top-[22%]', delay: '0s' },
  { label: '벤처인증', className: 'right-[10%] top-[28%]', delay: '1.2s' },
  { label: '사업계획', className: 'left-[14%] bottom-[20%]', delay: '2.1s' },
  { label: 'AI 업무도구', className: 'right-[12%] bottom-[24%]', delay: '0.6s' },
]

const trustItems = [
  '누적 자금조달 100억+',
  '정책자금·인증·사업계획 실무 경험',
  'ISO 인증 심사원',
  'AI 기반 경영지원 도구 개발',
]

type Choice = {
  to: string
  icon: string
  title: string
  desc: string
  cta: string
  accent: string
}

const choices: Choice[] = [
  {
    to: '/business-services',
    icon: '🏢',
    title: '중소기업 대표님이신가요?',
    desc: '정책자금, 정부지원사업, 벤처인증, 연구소, 홈페이지+MVP 패키지를 확인해보세요.',
    cta: '대표님용 서비스 보기',
    accent: 'blue',
  },
  {
    to: '/consultants',
    icon: '🧑‍💼',
    title: '컨설턴트이신가요?',
    desc: '고객 진단, 제안서, 지원금·인증 업무를 더 빠르게 처리하는 AI 도구를 확인해보세요.',
    cta: '컨설턴트용 도구 보기',
    accent: 'navy',
  },
]

export default function GatewayPage() {
  useEffect(() => {
    document.title = '미래 AI 랩 | 대표님과 컨설턴트를 위한 AI 경영지원 플랫폼'
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 antialiased [word-break:keep-all]">
      <style>{motionCss}</style>

      {/* Motion background (CSS only) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={gridBackground} />
        <div
          className="gw-anim absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"
          style={{ animation: 'gwDriftA 16s ease-in-out infinite' }}
        />
        <div
          className="gw-anim absolute -bottom-28 right-[-4rem] h-96 w-96 rounded-full bg-sky-400/15 blur-3xl"
          style={{ animation: 'gwDriftB 20s ease-in-out infinite' }}
        />
        <div
          className="gw-anim absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl"
          style={{ animation: 'gwDriftA 24s ease-in-out infinite reverse' }}
        />
        {floatWords.map((w) => (
          <span
            key={w.label}
            className={`gw-anim absolute hidden rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-400 shadow-sm backdrop-blur-sm sm:inline-block ${w.className}`}
            style={{ animation: `gwFloat 7s ease-in-out infinite`, animationDelay: w.delay }}
          >
            {w.label}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-lg font-black tracking-tight text-sky-400">
            AI
          </span>
          <div className="leading-tight">
            <p className="text-lg font-bold tracking-tight text-slate-900">미래 AI 랩</p>
            <p className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</p>
          </div>
        </div>

        {/* Main copy */}
        <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
          대표님과 컨설턴트를 위한
          <br className="hidden sm:block" /> AI 경영지원 플랫폼
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          정책자금·정부지원사업·벤처인증·사업계획·AI 업무도구를 목적에 맞게 나누어 안내합니다.
        </p>

        {/* Choice cards */}
        <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
          {choices.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group flex flex-col rounded-3xl border bg-white p-8 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
                c.accent === 'blue'
                  ? 'border-slate-200 hover:border-blue-300'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
                  c.accent === 'blue' ? 'bg-blue-50' : 'bg-slate-100'
                }`}
              >
                {c.icon}
              </span>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">{c.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{c.desc}</p>
              <span
                className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3.5 text-base font-semibold transition-colors ${
                  c.accent === 'blue'
                    ? 'bg-blue-600 text-white group-hover:bg-blue-500'
                    : 'bg-slate-900 text-white group-hover:bg-slate-700'
                }`}
              >
                {c.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Trust line */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
          {trustItems.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden className="text-slate-300">·</span>}
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">미래경영지원센터 운영 기준</p>
      </div>
    </div>
  )
}
