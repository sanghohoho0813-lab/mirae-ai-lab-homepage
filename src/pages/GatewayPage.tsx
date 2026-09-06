import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import NetworkBackdrop from '../components/NetworkBackdrop'
import LegalFooter from '../components/LegalFooter'
import BrandLogo from '../components/BrandLogo'
import AccountMenu from '../components/account/AccountMenu'

// 루트(/) 역할 선택 게이트웨이. 기존 페이지/컴포넌트는 건드리지 않습니다.
// 배경은 실제 이미지 대신 CSS/SVG 로만 은은한 "AI 경영지원 네트워크"를 구현합니다.

// 브랜드 정비(0차): 자금조달 실적 대신 AX Architect 포지션을 앞세운다.
const trustItems = [
  '경영컨설턴트 출신 AX Architect',
  '정책자금·인증·사업계획 실무 경험',
  'ISO 인증 심사원',
  'AI 기반 경영지원 도구 개발',
]

type Theme = {
  card: string
  glow: string
  label: string
  labelBox: string
  iconBox: string
  desc: string
  chip: string
  cta: string
  arrow: string
}

type Choice = {
  to: string
  icon: string
  label: string
  title: string
  desc: string
  cta: string
  keywords: string[]
  theme: Theme
}

// 대표님 = 밝은 블루(경영지원 서비스) / 컨설턴트 = 다크+사이언(AI 실무 도구)
const blueTheme: Theme = {
  card: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30',
  glow: 'bg-white/20',
  label: 'text-white',
  labelBox: 'bg-white/15 ring-1 ring-inset ring-white/25',
  iconBox: 'bg-white/15 ring-1 ring-inset ring-white/20',
  desc: 'text-blue-50',
  chip: 'bg-white/10 text-blue-50 ring-1 ring-inset ring-white/20',
  cta: 'bg-white text-blue-700 group-hover:bg-blue-50',
  arrow: 'text-blue-700',
}
const techTheme: Theme = {
  card: 'bg-gradient-to-br from-slate-800 to-slate-950 shadow-lg shadow-slate-900/30 hover:shadow-2xl hover:shadow-sky-500/20',
  glow: 'bg-sky-400/25',
  label: 'text-sky-300',
  labelBox: 'bg-sky-400/15 ring-1 ring-inset ring-sky-400/30',
  iconBox: 'bg-white/10 ring-1 ring-inset ring-white/15',
  desc: 'text-slate-300',
  chip: 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10',
  cta: 'bg-sky-400 text-slate-900 group-hover:bg-sky-300',
  arrow: 'text-slate-900',
}

const choices: Choice[] = [
  {
    to: '/business-services',
    icon: '🏢',
    label: '중소기업 맞춤형 AX',
    title: '사업과 업무를 먼저 진단하고, 실제 시스템으로 구현하려는 대표님',
    desc: '엑셀·카톡·ERP 사이에 남아 있는 회사 고유의 업무를 AI와 전용 시스템으로 연결합니다. 운영효율·매출성장·기업자산화까지.',
    cta: '중소기업 맞춤형 AX 보기',
    keywords: ['AX Fit 진단', '사업·업무 분석', '전용 시스템 구축', '고객 플랫폼'],
    theme: blueTheme,
  },
  {
    to: '/consultants',
    icon: '🧑‍💼',
    label: 'AI 실무 도구',
    title: '컨설턴트이신가요?',
    desc: '고객 진단·제안서·지원금·인증 업무를 더 빠르게 처리하는 AI 실무 도구를 확인해보세요.',
    cta: '컨설턴트용 도구 보기',
    keywords: ['고객진단', '제안서', '업무자동화', 'AI도구'],
    theme: techTheme,
  },
]

export default function GatewayPage() {
  useEffect(() => {
    document.title = '미래AI랩 | 경영컨설턴트가 설계하는 중소기업 맞춤형 AX'
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Background: soft glow + AI network */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-48 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>
      <NetworkBackdrop />

      {/* 우상단 계정 컨트롤 — 로그인 상태를 홈에서도 동일하게 노출(로그아웃: 로그인/회원가입, 로그인: 아바타) */}
      <div className="absolute right-4 top-4 z-20 rounded-full bg-white/70 px-1 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <AccountMenu />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-8 text-center sm:py-14">
        {/* Brand */}
        <BrandLogo
          to="/business-services"
          className="items-center"
          taglineClassName="text-center"
          imgClassName="h-12 max-w-[232px] sm:h-14 sm:max-w-[280px]"
        />

        {/* Main copy */}
        <h1 className="mt-5 text-[1.55rem] font-extrabold leading-[1.25] tracking-tight text-slate-900 sm:mt-7 sm:text-4xl lg:text-[2.7rem] lg:leading-[1.2]">
          대표님의 회사 운영과 컨설턴트의 실무 도구를
          <br className="hidden sm:block" /> <span className="text-blue-600">AI로 연결</span>합니다.
        </h1>
        <p className="mt-3.5 max-w-2xl text-[0.95rem] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
          중소기업 맞춤형 AX 설계·구축과 컨설턴트용 AI 업무도구를 목적에 맞게 나누어 안내합니다.
        </p>

        {/* Choice cards */}
        <div className="mt-7 grid w-full gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {choices.map((c) => {
            const t = c.theme
            return (
              <Link
                key={c.to}
                to={c.to}
                className={`group relative flex flex-col overflow-hidden rounded-3xl p-7 text-left transition duration-200 hover:-translate-y-1.5 sm:p-8 ${t.card}`}
              >
                <div aria-hidden className={`pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full blur-2xl ${t.glow}`} />
                <div className="relative flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${t.iconBox}`}>{c.icon}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${t.labelBox} ${t.label}`}>{c.label}</span>
                  </div>
                  <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{c.title}</h2>
                  <p className={`mt-2.5 text-[0.95rem] leading-relaxed ${t.desc}`}>{c.desc}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.keywords.map((k) => (
                      <span key={k} className={`rounded-md px-2 py-1 text-xs font-semibold ${t.chip}`}>
                        {k}
                      </span>
                    ))}
                  </div>

                  <span className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3.5 text-base font-bold shadow-sm transition-colors ${t.cta}`}>
                    {c.cta}
                    <span aria-hidden className={`transition-transform group-hover:translate-x-0.5 ${t.arrow}`}>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Trust line */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-sm font-medium text-slate-500 sm:mt-10">
          {trustItems.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2.5">
              {i > 0 && <span aria-hidden className="text-slate-300">·</span>}
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">미래 AI 랩이 직접 운영합니다</p>
      </div>

      <div className="relative z-10">
        <LegalFooter />
      </div>
    </div>
  )
}
