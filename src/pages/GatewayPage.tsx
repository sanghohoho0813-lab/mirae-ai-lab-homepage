import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import NetworkBackdrop from '../components/NetworkBackdrop'
import LegalFooter from '../components/LegalFooter'
import BrandLogo from '../components/BrandLogo'
import AccountMenu from '../components/account/AccountMenu'
import { AX_PATENT_COUNT, AX_PATENT_META, AX_PATENT_PROOF } from '../data/axPatentTech'

// 루트(/) 역할 선택 게이트웨이.
// 화면 순서: 로고(좌상단) → 우리가 누구인지(자격·경험 + 기술자산) → 역할 선택 카드.
// 선택 카드가 주인공이되, 고르기 전에 누가 만드는 회사인지 먼저 읽히게 위쪽에 붙였다.
// 좁은 화면에서도 카드가 첫 화면 안에 남도록 위쪽 블록은 최대한 조밀하게 둔다.

// 브랜드 정비(0차): 자금조달 실적 대신 AX Architect 포지션을 앞세운다.
const trustItems = [
  '경영컨설턴트 출신 AX Architect',
  '정책자금·인증·사업계획 실무 경험',
  'ISO 인증 심사원',
  'AI 기반 경영지원 도구 개발',
]

type Choice = {
  to: string
  icon: string
  lines: readonly string[]
  desc: string
  aria: string
  card: string
  glow: string
  iconBox: string
  descColor: string
  arrow: string
}

// 대표님 = 밝은 블루(경영지원 서비스) / 컨설턴트 = 다크+사이언(AI 실무 도구)
const choices: readonly Choice[] = [
  {
    to: '/business-services',
    icon: '🏢',
    lines: ['중소기업 대표님 또는', '예비창업가이신가요?'],
    desc: '사업과 업무를 먼저 분석해 회사 전용 AX를 설계·구축합니다.',
    aria: '중소기업 대표님 또는 예비창업가이신가요? 중소기업 맞춤형 AX 보기',
    card: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30',
    glow: 'bg-white/20',
    iconBox: 'bg-white/15 ring-1 ring-inset ring-white/20',
    descColor: 'text-blue-50/90',
    arrow: 'text-white',
  },
  {
    to: '/consultants',
    icon: '🧑‍💼',
    lines: ['컨설턴트이신가요?'],
    desc: '고객 진단·제안서·인증 업무를 더 빠르게 처리하는 AI 실무 도구입니다.',
    aria: '컨설턴트이신가요? 컨설턴트용 AI 실무 도구 보기',
    card: 'bg-gradient-to-br from-slate-800 to-slate-950 shadow-lg shadow-slate-900/30 hover:shadow-2xl hover:shadow-sky-500/20',
    glow: 'bg-sky-400/25',
    iconBox: 'bg-white/10 ring-1 ring-inset ring-white/15',
    descColor: 'text-slate-300',
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

      {/* 로고는 좌상단 고정 — 계정 컨트롤은 그 반대편에 둔다 */}
      <div className="relative z-20 flex w-full items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
        <BrandLogo
          to="/"
          imgClassName="h-12 max-w-[236px] sm:h-14 sm:max-w-[280px]"
          taglineClassName="text-[0.62rem]! tracking-[0.14em]! sm:text-[0.7rem]!"
        />
        <div className="shrink-0 rounded-full bg-white/70 px-1 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <AccountMenu />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-6 sm:px-6 sm:py-10">
        <h1 className="sr-only">미래AI랩 — 중소기업 맞춤형 AX와 컨설턴트용 AI 실무 도구</h1>

        {/* 고르기 전에 먼저 읽히는 부분 — 누가 만드는 회사인가 */}
        <p className="text-center text-[0.92rem] font-semibold text-slate-500 min-[380px]:text-[0.98rem] sm:text-[1.05rem]">
          경영컨설턴트가 설계하는 중소기업 맞춤형 AX
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.8rem] font-medium text-slate-500 min-[380px]:text-[0.85rem] sm:mt-3 sm:gap-x-2.5 sm:text-sm">
          {trustItems.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2.5">
              {i > 0 && <span aria-hidden className="text-slate-300">·</span>}
              {t}
            </span>
          ))}
        </div>

        {/* 기술자산 — 배지 없이 얇은 선 사이에만 둔다 */}
        <div className="mt-3.5 w-full border-y border-slate-200/80 py-3.5 sm:mt-5 sm:py-5">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-5 sm:text-left">
            <p className="max-w-md break-keep text-[0.95rem] font-bold leading-relaxed text-slate-600 sm:max-w-none sm:text-[1.0rem]">
              {AX_PATENT_PROOF.lead}
            </p>
            <span aria-hidden className="hidden h-8 w-px bg-slate-200 sm:block" />
            <p className="max-w-md break-keep text-[0.9rem] leading-relaxed text-slate-500 sm:max-w-none sm:text-[0.95rem]">
              업무 자동화 · 다음 행동 추천 · 기업 상태 분석 등<br className="sm:hidden" />{' '}
              AX 핵심기술 특허 <b className="font-black text-[#D47A4A]">{AX_PATENT_COUNT}건</b> 출원
            </p>
          </div>
          <p className="mt-2.5 text-center text-[0.72rem] font-bold tracking-[0.2em] text-slate-400 sm:mt-3 sm:text-[0.76rem]">
            {AX_PATENT_META}
          </p>
        </div>

        {/* 역할 선택 — 이 화면의 목적 */}
        <div className="mt-4 grid w-full gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-6">
          {choices.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              aria-label={c.aria}
              className={`group relative flex min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-3xl px-5 py-4 transition duration-200 hover:-translate-y-1.5 sm:min-h-[13.5rem] sm:px-8 sm:py-8 ${c.card}`}
            >
              <span aria-hidden className={`pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full blur-2xl ${c.glow}`} />
              <span aria-hidden className={`relative grid h-12 w-12 place-items-center rounded-2xl text-xl sm:h-16 sm:w-16 sm:text-3xl ${c.iconBox}`}>
                {c.icon}
              </span>
              {/* 아이콘을 위로 올려 글줄 폭을 넉넉히 준다 — 좁은 화면에서도 질문이 두 줄 안에 떨어지게 */}
              <span className="relative mt-3.5 flex items-end justify-between gap-3 sm:mt-5">
                <span className="min-w-0">
                  <span className="block text-[1.26rem] font-extrabold leading-[1.35] tracking-tight text-white min-[380px]:text-[1.36rem] sm:text-[1.6rem] sm:leading-[1.3]">
                    {c.lines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </span>
                  <span className={`mt-1.5 block text-[0.9rem] leading-relaxed sm:mt-2.5 sm:text-[0.98rem] ${c.descColor}`}>{c.desc}</span>
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
