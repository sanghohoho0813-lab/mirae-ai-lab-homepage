import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LegalFooter from '../components/LegalFooter'
import BrandLogo from '../components/BrandLogo'
import AccountMenu from '../components/account/AccountMenu'
import { AX_PATENT_COUNT, AX_PATENT_FILED_ON, AX_PATENT_TECHS } from '../data/axPatentTech'

// 루트(/) 역할 선택 게이트웨이 — 회사의 첫인상.
// 화면 순서: 로고 → 누가 만드는 회사인가(한 문장 + 자격 네 칸) → 역할 선택(두 개의 문).
// 톤은 AX 소개 영상과 같은 먹색 + 샴페인 골드. 밝은 파란 카드·이모지·점선 네트워크 배경은 광고 페이지처럼 보여 걷어냈다.
// 좁은 화면에서도 두 개의 문이 첫 화면 안에 남도록 위쪽 블록은 조밀하게 둔다.

// 자격·경험 — 숫자(또는 짧은 이름) 하나 + 설명 한 줄. 네 번째 칸(특허)은 눌러서 5건을 펼친다.
const credentials = [
  { big: '9년', small: '정책자금·인증·사업계획 실무' },
  { big: 'ISO', small: '인증 심사원' },
  { big: '100억 원+', small: '지원금·환급·자금 누적' },
] as const

type Choice = {
  to: string
  kicker: string
  lines: readonly string[]
  desc: string
  aria: string
  tone: Tone
}

// 대표님 = 아이보리 카드(주 고객, 먼저 눈에 들어온다) / 컨설턴트 = 깊은 남색 카드(컨설턴트 페이지의 파란 톤과 이어진다).
// 두 카드 모두 '꽉 찬 색면 + 반대색 화살표 원'으로 무게를 맞춘다 — 한쪽만 투명 유리면 빈 칸처럼 보인다.
type Tone = 'ivory' | 'navy'
const TONE: Record<Tone, { card: string; glow: string; kicker: string; title: string; desc: string; arrow: string }> = {
  ivory: {
    card: 'bg-[#F2EDE6] text-[#0B0E12] shadow-[0_30px_80px_-30px_rgba(216,168,113,0.45)] ring-1 ring-[#E6C396]/60 hover:shadow-[0_40px_90px_-30px_rgba(216,168,113,0.6)]',
    glow: 'bg-[#E6C396]/45',
    kicker: 'text-[#A5703C]',
    title: 'text-[#0B0E12]',
    desc: 'text-[#4A535D]',
    arrow: 'bg-[#0B0E12] text-[#E6C396]',
  },
  navy: {
    card: 'bg-[linear-gradient(135deg,#25406A_0%,#182C4A_52%,#101E34_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_30px_80px_-30px_rgba(74,124,196,0.55)] ring-1 ring-[#8DB3E2]/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_40px_90px_-30px_rgba(74,124,196,0.7)] hover:ring-[#A9C8EE]/50',
    glow: 'bg-[#6FA3E0]/35',
    kicker: 'text-[#A9C8EE]',
    title: 'text-[#F4F1EC]',
    desc: 'text-[#C3CFDF]',
    arrow: 'bg-[#E6C396] text-[#101E34]',
  },
}

const choices: readonly Choice[] = [
  {
    to: '/business-services',
    kicker: 'FOR CEO · 대표님',
    lines: ['중소기업 대표님 또는', '예비창업가이신가요?'],
    // AX 하나만 파는 것처럼 읽히지 않게 — 선택 페이지에서 기술사업·MVP / AX 도입으로 갈린다
    desc: '우리 회사에 맞는 다음 한 걸음을 찾아 드려요. 아이디어를 서비스로 만드는 기술사업부터 회사 전체 AX까지요.',
    aria: '중소기업 대표님 또는 예비창업가이신가요? AX 도입과 기술사업·MVP 중 고르기',
    tone: 'ivory',
  },
  {
    to: '/consultants',
    kicker: 'FOR CONSULTANTS · 컨설턴트',
    lines: ['컨설턴트이신가요?'],
    desc: '서류는 한 번만 받고, 고객사 정보는 어디서든 한눈에. 컨설턴트를 위한 운영 OS예요.',
    aria: '컨설턴트이신가요? 컨설턴트 운영 OS 보기',
    tone: 'navy',
  },
]

export default function GatewayPage() {
  // 기술 5건은 기본으로 접어 둔다 — 이 화면의 목적은 역할 선택이라 길어지면 안 된다
  const [techOpen, setTechOpen] = useState(false)

  useEffect(() => {
    document.title = '미래AI랩 | 경영컨설턴트가 설계하는 50인 미만 중소기업 맞춤형 AX'
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0B0E12] text-white antialiased [word-break:keep-all]">
      {/* 배경 — 위 오른쪽 골드 빛, 아래 왼쪽 푸른 회색 빛, 아주 옅은 격자 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-48 h-[40rem] w-[40rem] rounded-full bg-[#D8A871]/[0.13] blur-3xl" />
        <div className="absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-[#5A78AA]/[0.12] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_70%)]" />
      </div>

      {/* 위 — 로고와 계정 */}
      <div className="hero-anim relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 pt-3 sm:px-8 sm:pt-7">
        {/* 모바일은 로고 자체를 키우는 대신 태그라인을 접는다 — 그래야 오른쪽 로그인 버튼이 잘리지 않는다 */}
        <BrandLogo
          to="/"
          tone="dark"
          imgClassName="h-[2.9rem] max-w-none min-[380px]:h-[3.2rem] sm:h-14 sm:max-w-[300px]"
          taglineClassName="hidden! sm:block! sm:text-[0.74rem]! sm:tracking-[0.2em]!"
        />
        <AccountMenu tone="dark" className="shrink-0" />
      </div>

      {/* 본문 */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-6 pt-3 sm:px-8 sm:pb-14 sm:pt-10">
        {/* 누가 만드는 회사인가 */}
        <section style={{ animationDelay: '0.12s' }} className="hero-anim text-center">
          <p className="inline-flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.26em] text-[#D8A871] sm:gap-4 sm:text-[0.8rem] sm:tracking-[0.32em]">
            <span aria-hidden className="h-px w-6 bg-[#D8A871]/60 sm:w-10" />
            MIRAE AI LAB
            <span aria-hidden className="h-px w-6 bg-[#D8A871]/60 sm:w-10" />
          </p>
          <h1 className="mt-3 text-[1.62rem] font-bold leading-[1.3] tracking-[-0.03em] text-[#F4F1EC] min-[380px]:text-[1.75rem] sm:mt-5 sm:text-[2.9rem] sm:leading-[1.22]">
            9년 차 경영컨설턴트가 설계하는
            <br />
            <span className="text-[#E6C396]">50인 미만 중소기업 AX</span>
          </h1>
          {/* AX 를 처음 보는 분이 대부분이라 바로 아래에서 뜻을 밝힌다 */}
          <p className="mt-2 text-[0.98rem] text-slate-400 min-[380px]:text-[1.03rem] sm:mt-4 sm:text-[1.15rem]">
            AX = AI로 회사가 일하는 방식을 바꾸는 것 <span className="hidden sm:inline">· AI 경영지원 도구 직접 개발</span>
          </p>
        </section>

        {/* 자격 네 칸 — 가는 선으로 나눈다. 네 번째 칸(특허)을 누르면 기술 5건이 펼쳐진다 */}
        <section style={{ animationDelay: '0.22s' }} className="hero-anim mx-auto mt-4 w-full max-w-4xl sm:mt-9" aria-label="자격과 경험">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:grid-cols-4">
            {credentials.map((c, i) => (
              <div key={c.big} className={`px-3 py-2.5 text-center sm:px-4 sm:py-5 ${i % 2 === 1 ? 'border-l border-white/10' : ''} ${i >= 2 ? 'border-t border-white/10 sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
                <p className="text-[1.12rem] font-bold tracking-tight text-[#F4F1EC] sm:text-[1.5rem]">{c.big}</p>
                <p className="mt-0.5 text-[0.8rem] leading-snug text-slate-400 min-[380px]:text-[0.86rem] sm:mt-1 sm:text-[0.92rem]">{c.small}</p>
              </div>
            ))}
            <div className="border-l border-t border-white/10 text-center sm:border-t-0">
              <button
                type="button"
                onClick={() => setTechOpen((v) => !v)}
                aria-expanded={techOpen}
                aria-controls="gateway-patent-techs"
                className="group h-full w-full px-3 py-2.5 transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#D8A871] sm:px-4 sm:py-5"
              >
                <span className="block text-[1.12rem] font-bold tracking-tight text-[#E6C396] sm:text-[1.5rem]">
                  특허 {AX_PATENT_COUNT}건
                  <span aria-hidden className={`ml-1 inline-block text-[0.7em] transition-transform ${techOpen ? 'rotate-180' : ''}`}>▾</span>
                </span>
                <span className="mt-0.5 block text-[0.8rem] leading-snug text-slate-400 underline decoration-[#D8A871]/40 underline-offset-4 min-[380px]:text-[0.86rem] sm:mt-1 sm:text-[0.92rem]">AX 핵심기술 출원</span>
              </button>
            </div>
          </div>

          {/* 펼쳐도 발명의 명칭 원문이 아니라 쉬운 말로 보여 준다(출원번호·명칭 원문은 공개하지 않는다). 특허는 '출원'만 쓴다 */}
          {techOpen && (
            <div id="gateway-patent-techs" className="animate-fade-in mt-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left sm:mt-3 sm:px-6 sm:py-4">
              <ol className="grid gap-1.5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-2">
                {AX_PATENT_TECHS.map((t) => (
                  <li key={t.no} className="flex items-baseline gap-2.5 break-keep sm:gap-3">
                    <span className="shrink-0 text-[0.8rem] font-bold tabular-nums text-[#D8A871] sm:text-[0.86rem]">{t.no}</span>
                    <span className="text-[0.92rem] leading-snug text-slate-300 sm:text-[0.98rem]">
                      <b className="font-semibold text-[#F4F1EC]">{t.name}</b>
                      <span className="text-slate-500"> · {t.sub}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-right text-[0.78rem] font-semibold tracking-[0.12em] text-slate-500">{AX_PATENT_FILED_ON} 출원 완료</p>
            </div>
          )}
        </section>

        {/* 역할 선택 — 이 화면의 목적. 두 개의 문 */}
        <div className="mt-4 grid w-full gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {choices.map((c, i) => (
            <Link
              key={c.to}
              to={c.to}
              aria-label={c.aria}
              style={{ animationDelay: `${0.34 + i * 0.12}s` }}
              className={`hero-anim group relative flex flex-col overflow-hidden rounded-[1.6rem] px-5 py-4 transition duration-300 hover:-translate-y-1 sm:min-h-[16rem] sm:px-9 sm:py-8 ${TONE[c.tone].card}`}
            >
              {/* 모서리 빛 */}
              <span aria-hidden className={`pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full blur-3xl ${TONE[c.tone].glow}`} />
              <span className={`relative text-[0.72rem] font-bold tracking-[0.2em] sm:text-[0.8rem] ${TONE[c.tone].kicker}`}>{c.kicker}</span>
              <span className="relative mt-2 flex flex-1 items-end justify-between gap-4 sm:mt-5">
                <span className="min-w-0">
                  <span className={`block text-[1.3rem] font-bold leading-[1.32] tracking-[-0.025em] min-[380px]:text-[1.4rem] sm:text-[1.95rem] sm:leading-[1.25] ${TONE[c.tone].title}`}>
                    {c.lines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </span>
                  <span className={`mt-1.5 block text-[0.9rem] leading-relaxed sm:mt-3 sm:text-[1.05rem] ${TONE[c.tone].desc}`}>{c.desc}</span>
                </span>
                {/* 화살표 — 꽉 찬 원 */}
                <span
                  aria-hidden
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-300 group-hover:translate-x-1 sm:h-14 sm:w-14 ${TONE[c.tone].arrow}`}
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
                  </svg>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <div className="relative z-10">
        <LegalFooter tone="dark" />
      </div>
    </div>
  )
}
