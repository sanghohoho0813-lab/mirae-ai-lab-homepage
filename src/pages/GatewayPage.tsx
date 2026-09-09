import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import NetworkBackdrop from '../components/NetworkBackdrop'
import LegalFooter from '../components/LegalFooter'
import BrandLogo from '../components/BrandLogo'
import AccountMenu from '../components/account/AccountMenu'

// 루트(/) 역할 선택 게이트웨이.
// 이 화면이 하는 일은 하나 — 대표님인지 컨설턴트인지 고르게 하는 것.
// 그래서 질문 두 개만 남기고 설명·키워드·소개 문구는 두지 않는다.
// 모바일에서 스크롤 없이 두 선택지가 한눈에 들어오는 것이 기준이다.

type Choice = {
  to: string
  icon: string
  lines: readonly string[]
  aria: string
  card: string
  glow: string
  iconBox: string
  arrow: string
}

// 대표님 = 밝은 블루(경영지원 서비스) / 컨설턴트 = 다크+사이언(AI 실무 도구)
const choices: readonly Choice[] = [
  {
    to: '/business-services',
    icon: '🏢',
    lines: ['중소기업 대표님 또는', '예비창업가이신가요?'],
    aria: '중소기업 대표님 또는 예비창업가이신가요? 중소기업 맞춤형 AX 보기',
    card: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30',
    glow: 'bg-white/20',
    iconBox: 'bg-white/15 ring-1 ring-inset ring-white/20',
    arrow: 'text-white',
  },
  {
    to: '/consultants',
    icon: '🧑‍💼',
    lines: ['컨설턴트이신가요?'],
    aria: '컨설턴트이신가요? 컨설턴트용 AI 실무 도구 보기',
    card: 'bg-gradient-to-br from-slate-800 to-slate-950 shadow-lg shadow-slate-900/30 hover:shadow-2xl hover:shadow-sky-500/20',
    glow: 'bg-sky-400/25',
    iconBox: 'bg-white/10 ring-1 ring-inset ring-white/15',
    arrow: 'text-sky-300',
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
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-14">
        {/* 화면에는 로고와 질문만 두고, 페이지가 무엇인지는 보조기기에만 알린다 */}
        <h1 className="sr-only">미래AI랩 — 중소기업 맞춤형 AX와 컨설턴트용 AI 실무 도구</h1>

        <BrandLogo
          to="/business-services"
          className="items-center"
          taglineClassName="text-center"
          imgClassName="h-11 max-w-[212px] sm:h-14 sm:max-w-[280px]"
        />

        <div className="mt-8 grid w-full gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          {choices.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              aria-label={c.aria}
              className={`group relative flex min-h-[10.5rem] flex-col justify-between overflow-hidden rounded-3xl px-6 py-6 transition duration-200 hover:-translate-y-1.5 sm:min-h-[13.5rem] sm:px-8 sm:py-8 ${c.card}`}
            >
              <span aria-hidden className={`pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full blur-2xl ${c.glow}`} />
              <span aria-hidden className={`relative grid h-14 w-14 place-items-center rounded-2xl text-2xl sm:h-16 sm:w-16 sm:text-3xl ${c.iconBox}`}>
                {c.icon}
              </span>
              {/* 아이콘을 위로 올려 글줄 폭을 넉넉히 준다 — 좁은 화면에서도 질문이 두 줄 안에 떨어지게 */}
              <span className="relative mt-5 flex items-end justify-between gap-3">
                <span className="min-w-0 text-[1.26rem] font-extrabold leading-[1.35] tracking-tight text-white min-[380px]:text-[1.36rem] sm:text-[1.6rem] sm:leading-[1.3]">
                  {c.lines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </span>
                <span aria-hidden className={`shrink-0 text-2xl font-black leading-none transition-transform group-hover:translate-x-1 sm:text-3xl ${c.arrow}`}>
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <LegalFooter />
      </div>
    </div>
  )
}
