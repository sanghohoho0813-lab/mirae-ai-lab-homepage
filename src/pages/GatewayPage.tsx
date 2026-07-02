import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import NetworkBackdrop from '../components/NetworkBackdrop'

// 루트(/) 역할 선택 게이트웨이. 기존 페이지/컴포넌트는 건드리지 않습니다.
// 배경은 실제 이미지 대신 CSS/SVG 로만 은은한 "AI 경영지원 네트워크"를 구현합니다.

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
  keywords: string[]
  accent: 'blue' | 'navy'
}

const choices: Choice[] = [
  {
    to: '/business-services',
    icon: '🏢',
    title: '중소기업 대표님이신가요?',
    desc: '정책자금, 정부지원사업, 벤처인증, 연구소, 홈페이지+MVP 패키지를 확인해보세요.',
    cta: '대표님용 서비스 보기',
    keywords: ['정책자금', '벤처인증', 'MVP', '사업계획'],
    accent: 'blue',
  },
  {
    to: '/consultants',
    icon: '🧑‍💼',
    title: '컨설턴트이신가요?',
    desc: '고객 진단, 제안서, 지원금·인증 업무를 더 빠르게 처리하는 AI 도구를 확인해보세요.',
    cta: '컨설턴트용 도구 보기',
    keywords: ['고객진단', '제안서', '업무자동화', 'AI도구'],
    accent: 'navy',
  },
]

export default function GatewayPage() {
  useEffect(() => {
    document.title = '미래 AI 랩 | 대표님과 컨설턴트를 위한 AI 경영지원 플랫폼'
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Background: soft glow + AI network */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-48 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>
      <NetworkBackdrop />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-lg font-black tracking-tight text-sky-400 shadow-lg shadow-slate-900/20">
            AI
          </span>
          <div className="leading-tight">
            <p className="text-lg font-bold tracking-tight text-slate-900">미래 AI 랩</p>
            <p className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</p>
          </div>
        </div>

        {/* Main copy */}
        <h1 className="mt-8 text-[1.7rem] font-extrabold leading-[1.25] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.9rem] lg:leading-[1.2]">
          대표님의 성장 전략과 컨설턴트의 실무 도구를
          <br className="hidden sm:block" /> <span className="text-blue-600">AI로 연결</span>합니다.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          정책자금·정부지원사업·벤처인증·사업계획·AI 업무도구를 목적에 맞게 나누어 안내합니다.
        </p>

        {/* Choice cards */}
        <div className="mt-11 grid w-full gap-5 sm:grid-cols-2 sm:gap-6">
          {choices.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group relative flex flex-col rounded-3xl border bg-white/90 p-7 text-left shadow-sm backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                c.accent === 'blue' ? 'border-slate-200 hover:border-blue-300' : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
                  c.accent === 'blue' ? 'bg-blue-50' : 'bg-slate-100'
                }`}
              >
                {c.icon}
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{c.title}</h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-600">{c.desc}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200"
                  >
                    {k}
                  </span>
                ))}
              </div>

              <span
                className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3.5 text-base font-semibold transition-colors ${
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
        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-sm font-medium text-slate-500">
          {trustItems.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2.5">
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
