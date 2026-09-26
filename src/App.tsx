import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './components/BrandLogo'
import InquiryForm from './components/InquiryForm'
import HeaderAccount from './components/account/HeaderAccount'
import LegalFooter from './components/LegalFooter'
import { useHashScroll } from './lib/businessPageScroll'
import OsDashboardPreview, { OsLaunchSteps } from './components/consultant/OsDashboardPreview'
import OsModules from './components/consultant/OsModules'

// 컨설턴트용 소개 (/consultants) — MIRAE AI LAB OS.
// 3차 개편: 기획의도(왜 만들었나 · 무엇을 바꾸나 · 무엇이 남나)에서 고객(컨설턴트)에게 필요한 것만 뽑았다.
//  ⚠️ 무료 체험 안내는 두지 않는다(지금은 막아 둠). 가격·완성도 % 도 적지 않는다.
//  ⚠️ '얼마나 빨라졌는지' 같은 성과 숫자는 기준선을 재는 중이라 말하지 않는다.

const navItems = [
  { label: '대시보드', href: '#dashboard' },
  { label: '모듈', href: '#modules' },
  { label: '출시 일정', href: '#launch' },
  { label: '전자책', href: '#resources' },
  { label: '문의', href: '#inquiry' },
]

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
)

// 매일 여는 화면(컨설턴트 운영 모듈) — 컨설턴트가 하루에 몇 번씩 시간을 버리던 순간을 없앤다.
// 대표님 설명 그대로: 서류는 한 번 / 어디서든 / 고객사 정보 한눈에 / 수금·마감 / 다음 모듈로 이어져 자동 분석.
// 색 역할(읽기 쉽게): 파랑 = 기본 · 보라 = 고객 정보 · 초록 = 좋아지는 것 · 호박색 = 시간·돈.
// Tailwind 가 클래스를 찾을 수 있게 전체 클래스 이름을 그대로 적는다.
type Tone = 'blue' | 'emerald' | 'violet' | 'amber'
const TONE: Record<Tone, { box: string; chip: string; em: string }> = {
  blue: { box: 'bg-blue-50 text-blue-600 ring-blue-100', chip: 'bg-blue-50 text-blue-700', em: 'text-blue-700' },
  emerald: { box: 'bg-emerald-50 text-emerald-600 ring-emerald-100', chip: 'bg-emerald-50 text-emerald-700', em: 'text-emerald-700' },
  violet: { box: 'bg-violet-50 text-violet-600 ring-violet-100', chip: 'bg-violet-50 text-violet-700', em: 'text-violet-700' },
  amber: { box: 'bg-amber-50 text-amber-600 ring-amber-100', chip: 'bg-amber-50 text-amber-800', em: 'text-amber-700' },
}

/** 문장 속 핵심 구절 하나만 굵게·색으로 — 훑어 읽어도 요점이 걸리게 */
function Em({ text, em, cls }: { text: string; em?: string; cls: string }) {
  const i = em ? text.indexOf(em) : -1
  if (!em || i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <b className={`font-semibold ${cls}`}>{em}</b>
      {text.slice(i + em.length)}
    </>
  )
}

const everyday: { tag: string; title: string; desc: string; em: string; tone: Tone; icon: ReactNode }[] = [
  {
    tag: '서류',
    tone: 'blue',
    em: '다시 달라고 할 일이 없어요',
    title: '서류는 한 번만 받으면 끝',
    desc: '고객이 올린 서류는 업체별로 차곡차곡 쌓여요. ‘그거 저번에 보내 드렸잖아요’ 소리 들으며 다시 달라고 할 일이 없어요.',
    icon: svg(
      <>
        <path d="M7 3.5h7l4 4v13H7z" />
        <path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6" />
      </>,
    ),
  },
  {
    tag: '어디서든',
    tone: 'emerald',
    em: '폰으로 바로 열어 봐요',
    title: 'PC, 폰, 클라우드를 오갈 필요 없이',
    desc: '사무실 컴퓨터에 있었나, 메일로 받았나 뒤질 필요가 없어요. 외근 중에도 폰으로 바로 열어 봐요.',
    icon: svg(
      <>
        <rect x="2.5" y="5" width="13" height="9.5" rx="1.2" />
        <path d="M1.5 18h15" />
        <rect x="17.5" y="8" width="5" height="11" rx="1" />
      </>,
    ),
  },
  {
    tag: '고객사 정보',
    tone: 'violet',
    em: '한 화면에 깔끔하게 정리돼 있어요',
    title: '사업자등록번호부터 한눈에',
    desc: '고객사마다 꼭 필요한 정보가 한 화면에 깔끔하게 정리돼 있어요. 찾아보고, 다시 물어보는 시간이 줄어요.',
    icon: svg(
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
        <circle cx="8.5" cy="11" r="2" />
        <path d="M5.5 15.5c.8-1.4 1.8-2 3-2s2.2.6 3 2M14 10h4.5M14 13.5h4.5" />
      </>,
    ),
  },
  {
    tag: '수금·마감',
    tone: 'amber',
    em: '대신 기억해 둬요',
    title: '수금일과 마감일은 먼저 알려 줘요',
    desc: '받을 돈, 신청 마감, 다음에 연락할 날을 대신 기억해 둬요. 놓칠까 봐 달력을 몇 번씩 들여다볼 필요가 없어요.',
    icon: svg(
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4M9 14.5l2 2 4-4" />
      </>,
    ),
  },
]

// 써 보면 달라지는 것 — 시간 · 여유 · 추가 계약 · 소개 · 처음 맡는 분야 · 첫 미팅
const outcomes: { t: string; d: string; em: string }[] = [
  { t: '헛걸음이 사라져요', d: '찾고, 묻고, 다시 받던 시간을 고객 일에 쓸 수 있어요.', em: '고객 일에 쓸 수 있어요' },
  { t: '같은 시간에 더 많은 고객사를', d: '서류와 일정이 알아서 정리되니, 고객사가 늘어도 허둥대지 않아요.', em: '허둥대지 않아요' },
  { t: '추가 계약이 자연스러워요', d: '쌓인 기록과 분석을 보여 주면서 ‘다음엔 이걸 해 보시죠’라고 말할 수 있어요. 다음 계약은 거기서 시작돼요.', em: '다음 계약은 거기서 시작돼요' },
  { t: '소개받기 좋아져요', d: '고객이 진행 상황을 직접 보니 믿음이 쌓여요. ‘그 컨설턴트는 관리가 확실해’라는 말이 가장 강한 영업이에요.', em: '가장 강한 영업이에요' },
  { t: '처음 맡는 분야도 금방', d: '잘 모르는 분야라도 도구가 요건과 확인할 것을 순서대로 짚어 줘요. 조금만 도움받으면 금방 따라잡아요.', em: '금방 따라잡아요' },
  { t: '첫 미팅부터 달라 보여요', d: '“서류는 여기 올려 주시고, 진행 상황은 여기서 보시면 돼요.” 이 화면 하나로 다른 컨설턴트와 차이가 나요.', em: '다른 컨설턴트와 차이가 나요' },
]

// 예상 반응 — ⚠️ 실제 이용 후기가 아니다(정식 출시 전). 화면에 '예시'로 분명히 적고,
//   실제 이용자 후기가 모이면(동의 받고) 이 목록을 바꾼다. 없는 숫자·실명은 넣지 않는다.
const reactions: { quote: string; who: string }[] = [
  {
    quote: '서류 다시 달라고 연락할 일이 없어졌어요. 아침에 열면 오늘 누구 일부터 할지 정리돼 있어서, 출근하자마자 전화부터 돌려요.',
    who: '법인컨설턴트',
  },
  {
    quote: '제가 올린 서류가 어디까지 처리됐는지 바로 보이니까 따로 물어볼 일이 없더라고요. 이렇게 관리해 주는 컨설턴트는 처음이에요.',
    who: '고객사 대표님',
  },
  {
    quote: '지난번에 받아 둔 서류로 고용지원금이랑 연구소까지 바로 짚어 드렸더니, 그 자리에서 다음 일을 맡겨 주셨어요. 아는 대표님도 소개해 주시고요.',
    who: '정책자금 컨설턴트',
  },
]

// 고객과 내부가 한 바퀴로 — 화면보다 이 순환이 핵심이다
const loop = [
  { who: '고객', text: 'My MIRAE에 서류를 올리거나 요청을 남겨요' },
  { who: '자동', text: '누가, 뭘, 언제 했는지 내 상담신청함에 바로 들어와요' },
  { who: '나', text: '업체별로 처리하면, 처리한 기록이 그대로 남아요' },
  { who: '나', text: '정리된 결과만 고객 화면에 올려요. 쓰다 만 초안은 안 보여요' },
  { who: '고객', text: '바뀐 진행 단계를 보고, 다음 서류나 요청을 이어 가요' },
]

const principles = [
  {
    title: '왜 이 일이 먼저인지, 늘 설명할 수 있어요',
    desc: '우선순위와 경고는 정해진 규칙으로 움직여요. 사람이 확인하지 않은 채 저절로 실행되는 건 없어요.',
  },
  {
    title: '고객에겐 보여 줄 것만 보여요',
    desc: '내부 메모와 수임료는 고객 화면에 절대 나가지 않아요. 주민등록번호와 공동인증서 비밀번호는 아예 저장하지 않아요.',
  },
]

// 신뢰 지표(믿고 맡기는 이유) — 실제 확인된 정보만. 대표님용 서비스몰과 동일 축.
// 위치: 전자책 바로 위 (대표님 요청 — 첫 화면은 제품 이야기에 집중).
const trustStats: { value: string; label: string; sub?: string }[] = [
  { value: '100억원+', label: '누적 자금조달 지원', sub: '지원금·세금 환급 포함' },
  { value: '9년', label: '세무·노무·법무·자금 현장 경력' },
  { value: 'ISO 3종', label: '9001·14001·45001 심사원' },
  { value: '2개 수상', label: '경영컨설팅·벤처 부문' },
]

const trustAwards = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상', detail: '경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국을 빛낸 사회공헌 K-컬처 나눔봉사공헌대상', detail: '벤처부문' },
]

const faqs = [
  {
    q: '지금 바로 쓸 수 있나요?',
    a: '아직은요. 2026년 10월에 컨설턴트 운영·기업성장 모듈부터 열고, 세금 계산기·창업감면 판정기·크레탑 분석기가 들어가는 절세·재무 모듈은 10월 이후, 나머지는 11월 이후에 차례로 엽니다. 문의를 남겨 주시면 열 때마다 먼저 연락드릴게요.',
  },
  {
    q: '요금은 어떻게 되나요?',
    a: '정식 출시 후 월 구독으로 제공할 예정이에요. 금액과 구성은 오픈할 때 안내해 드릴게요.',
  },
  {
    q: '우리 회사 방식에 맞게 쓸 수 있나요?',
    a: '네. 회사 이름, 업무 종류, 메뉴만 바꾸면 되도록 처음부터 그렇게 만들었어요.',
  },
  {
    q: '직원이나 고객도 같이 쓰나요?',
    a: '고객은 My MIRAE에서 서류를 올리고 진행 상황을 직접 봐요. 직원 계정과 고객 알림은 다음 단계에서 더할 예정이에요.',
  },
]

const gridBackground = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
} as const

// 히어로 오른쪽(PC 전용) — '고객사 화면' 예시. 히어로 문장(서류는 한 번 · 고객사 정보 한눈에 · 다음에 제안할 거리)을 그림으로 보여 준다.
// ⚠️ 가상 데이터(B사, 번호는 가림). 대시보드 예시와 같은 원칙으로 '예시 화면'을 붙이고 화면 읽기에서는 숨긴다.
function HeroClientCard() {
  const row = 'rounded-lg bg-white/[0.06] px-3 py-2'
  return (
    <div aria-hidden className="hidden lg:block">
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.8rem] font-bold tracking-wide text-slate-400">MIRAE AI LAB OS · 고객사</p>
          <span className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[0.7rem] font-black text-violet-200">예시 화면</span>
        </div>
        <p className="mt-1.5 text-xl font-black text-white">
          B사 <span className="text-sm font-semibold text-slate-400">제조 · 직원 12명</span>
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-[0.85rem]">
          <div className={row}>
            <dt className="text-slate-400">사업자등록번호</dt>
            <dd className="mt-0.5 font-bold text-white">123-45-•••••</dd>
          </div>
          <div className={row}>
            <dt className="text-slate-400">대표 연락처</dt>
            <dd className="mt-0.5 font-bold text-white">010-••••-1234</dd>
          </div>
        </dl>
        <div className={`mt-2 ${row} py-2.5`}>
          <div className="flex justify-between text-[0.85rem]">
            <span className="text-slate-400">받은 서류</span>
            <span className="font-bold text-emerald-300">7 / 7 완료</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10">
            <div className="h-full w-full rounded-full bg-emerald-400" />
          </div>
          <p className="mt-2 text-[0.78rem] text-slate-400">사업자등록증 · 재무제표 · 4대보험 명부 …</p>
        </div>
        <div className={`mt-2 flex items-center justify-between ${row} text-[0.85rem]`}>
          <span className="text-slate-400">2차 기성 수금</span>
          <span className="font-bold text-amber-300">D-3</span>
        </div>
        <div className="mt-4 rounded-xl border border-sky-400/30 bg-sky-400/10 p-3.5">
          <p className="text-[0.78rem] font-black text-sky-300">✦ 올려 둔 서류로 찾은 다음 제안</p>
          <ul className="mt-2 space-y-1.5 text-[0.88rem] text-white">
            <li className="flex justify-between gap-3">
              <span className="font-semibold">고용지원금</span>
              <span className="text-slate-300">신청 요건 검토</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="font-semibold">기업부설연구소</span>
              <span className="text-slate-300">인력 조건 확인</span>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-2 text-center text-[0.75rem] text-slate-500">예시 화면 · 가상 데이터</p>
    </div>
  )
}

// 믿고 맡기는 이유 — 만든 사람의 이력. 전자책 바로 위에 둔다.
function TrustPanel() {
  return (
    <div data-os-trust className="mt-10 rounded-3xl bg-slate-900 p-5 text-white shadow-sm sm:p-8">
      <p className="text-[0.9rem] font-bold uppercase tracking-widest text-amber-300">믿고 맡기는 이유</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
          {trustStats.map((s) => (
            <div key={s.label} className="border-l-2 border-amber-400/60 pl-3.5">
              <dd className="text-[1.7rem] font-black leading-none tracking-tight text-white sm:text-[2.1rem]">{s.value}</dd>
              <dt className="mt-1.5 break-keep text-[0.88rem] font-medium leading-snug text-slate-300 sm:text-[0.92rem]">{s.label}</dt>
              {s.sub && <p className="mt-0.5 text-[0.78rem] font-semibold leading-snug text-amber-300/90">{s.sub}</p>}
            </div>
          ))}
        </dl>
        <div className="flex items-start gap-3 border-t border-white/10 pt-5 sm:gap-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <img
            src="/assets/profile/ceo-avatar.webp"
            alt="미래 AI 랩 대표 프로필 사진"
            loading="lazy"
            decoding="async"
            width={200}
            height={200}
            className="h-16 w-16 shrink-0 rounded-full object-cover shadow-lg shadow-black/30 ring-[3px] ring-amber-400/60 sm:h-24 sm:w-24"
          />
          <div className="min-w-0">
            <p className="text-[0.98rem] font-semibold leading-relaxed text-slate-100 sm:text-[1.1rem]">
              정책자금, 정부지원사업, 법인컨설팅, AX 구축까지 9년 동안 현장에서 직접 해 온 일을 이 도구에 담았어요.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.9rem] font-medium text-slate-300 sm:mt-2.5 sm:text-[0.95rem]">
              <span className="font-bold text-white">미래 AI 랩 대표</span>
              <span className="text-slate-600">·</span>
              <span>Mirae AI Lab</span>
              <span className="text-slate-600">·</span>
              <a
                href="https://youtube.com/channel/UCjXWwM0_25vl1Mpr2Pc5amQ?si=vBv8_7d3w8Uk5uGA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                aria-label="유튜브 김팀장의 경영노트 채널 (새 탭에서 열림)"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" aria-hidden>
                  <rect x="1.5" y="5" width="21" height="14" rx="3.5" fill="#FF0000" />
                  <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="#fff" />
                </svg>
                김팀장의 경영노트
                <span aria-hidden className="text-slate-300">↗</span>
              </a>
            </div>
            <div className="mt-3 space-y-1.5">
              {trustAwards.map((a) => (
                <div key={a.title} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                  <span className="mt-px shrink-0 rounded bg-amber-400 px-1.5 py-0.5 text-[0.76rem] font-black text-slate-900">{a.year}</span>
                  <p className="min-w-0 break-keep text-[0.82rem] font-semibold leading-snug text-slate-100">
                    {a.title}
                    <span className="font-normal text-slate-400"> · {a.detail}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 섹션 머리 — 작은 라벨 + 제목 + 설명
function SectionHead({ eyebrow, title, desc }: { eyebrow: string; title: ReactNode; desc?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-base font-bold uppercase tracking-widest text-blue-600">{eyebrow}</p>
      <h2 className="mt-3 break-keep text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 break-keep text-lg leading-relaxed text-slate-600">{desc}</p>}
    </div>
  )
}

function App() {
  // index.html 기본 타이틀은 브랜드(AX)용이므로, 컨설턴트 페이지는 자기 타이틀을 유지한다
  useEffect(() => {
    document.title = 'MIRAE AI LAB OS | 컨설턴트 운영 OS — 꼼꼼한 관리가 다음 계약으로'
  }, [])
  // /consultants#modules 처럼 구간 주소로 들어오면 그 구간으로 (메뉴·다른 페이지에서 올 때)
  useHashScroll()

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandLogo to="/" imgClassName="h-9 max-w-[168px] sm:h-11 sm:max-w-[204px]" />
          <nav className="hidden items-center gap-7 text-base font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/business-services"
              className="hidden rounded-lg border border-slate-200 px-3 py-2 text-base font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
            >
              대표님용 경영지원
            </Link>
            <HeaderAccount variant="consultant" />
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section id="top" className="relative overflow-hidden bg-slate-950">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={gridBackground} />
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 lg:pb-20 lg:pt-20">
          <div className="lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-x-12">
            {/* 메시지·CTA — 신뢰 패널은 전자책 바로 위로 옮겼다 */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                MIRAE AI LAB OS · 10월부터 하나씩 오픈
              </span>

              <h1 className="mt-6 text-[1.9rem] font-extrabold leading-[1.18] tracking-tight text-white sm:text-[2.6rem] lg:text-[3rem]">
                고객 앞에서,
                <br />
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">더 전문가처럼.</span>
              </h1>

              {/* 추가 계약의 명분 — 꼼꼼하게 관리한 기록이 있어야 다음 제안이 설득력을 갖는다 */}
              <p data-hero-renewal className="mt-6 break-keep text-[1.3rem] font-bold leading-snug text-white sm:text-[1.6rem]">
                꼼꼼한 관리가,<br className="sm:hidden" /> <span className="text-sky-300">다음 계약의 명분</span>이 됩니다.
              </p>
              <p className="mt-3 break-keep text-base leading-relaxed text-slate-300 sm:text-lg">
                서류는 한 번 받으면 끝. 고객사 정보는 밖에서도 폰으로 바로 꺼내 보고,
                올려 둔 서류로 <span className="font-semibold text-emerald-300">다음에 제안할 거리</span>까지 찾아 줍니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#inquiry"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-xl shadow-black/25 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                  오픈 소식 받기
                </a>
                <a
                  href="#dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  대시보드 미리보기
                </a>
              </div>

              {/* 현황 — 실제 운영 OS 기준(기능 상태표 LIVE 13) · 모듈 7 · 월 구독 예정 */}
              <dl className="mt-8 grid grid-cols-3 gap-x-4 border-t border-white/10 pt-6 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
                {[
                  { v: '13개', l: '매일 쓰는 기능' },
                  { v: '7개', l: '준비 중인 모듈' },
                  { v: '월 구독', l: '정식 출시 후 예정' },
                ].map((s) => (
                  <div key={s.l}>
                    <dd className="text-2xl font-extrabold tracking-tight text-white">{s.v}</dd>
                    <dt className="mt-0.5 break-keep text-sm leading-snug text-slate-400">{s.l}</dt>
                  </div>
                ))}
              </dl>
              {/* 진정성 한 줄 (얼굴·이력은 아래 '믿고 맡기는 이유'에 1회만) */}
              <p className="mt-6 border-l-2 border-sky-400/50 pl-3.5 text-sm leading-relaxed text-slate-400 sm:text-base">
                제가 매일 쓰면서 쓸모 있다고 확인한 기능만 내놓습니다.
              </p>
            </div>

            <HeroClientCard />

          </div>
        </div>
      </section>

      {/* 2. 매일 여는 화면 — 컨설턴트 운영 모듈이 없애 주는 시간 + 다음 계약으로 이어지는 핵심 */}
      <section id="value" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="매일 여는 화면"
          title="찾고, 묻고, 다시 받는 시간이 사라져요"
          desc="컨설턴트 운영 모듈은 아침마다 가장 먼저 여는 화면이에요. 고객사가 서너 곳만 돼도 서류 찾고 정보 묻다 하루가 가죠. 그 시간을 없애려고 만들었어요."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5" data-os-everyday>
          {everyday.map((v) => (
            <article key={v.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset [&_svg]:h-5 [&_svg]:w-5 ${TONE[v.tone].box}`}>{v.icon}</div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ${TONE[v.tone].chip}`}>{v.tag}</span>
              </div>
              <h3 className="mt-4 break-keep text-xl font-bold text-slate-900">{v.title}</h3>
              <p className="mt-2 break-keep text-[1.02rem] leading-relaxed text-slate-600">
                <Em text={v.desc} em={v.em} cls={TONE[v.tone].em} />
              </p>
            </article>
          ))}

          {/* 핵심 — 올려 둔 서류가 다음 컨설팅 모듈로 이어져 자동으로 분석된다 → 다음 제안 거리 */}
          <article data-os-next className="rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 p-5 text-white shadow-lg shadow-blue-600/20 sm:col-span-2 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white [&_svg]:h-5 [&_svg]:w-5">
                {svg(
                  <>
                    <path d="M4 12h11M11 6l6 6-6 6" />
                    <path d="M19.5 3.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" />
                  </>,
                )}
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold tracking-wide">다음 계약</span>
            </div>
            <h3 className="mt-4 break-keep text-[1.35rem] font-bold leading-snug sm:text-2xl">올려 둔 서류가, 다음에 제안할 거리를 찾아 줘요</h3>
            <p className="mt-2 max-w-3xl break-keep text-[1.04rem] leading-relaxed text-blue-50">
              서류를 올려 두기만 하면 정책자금, 고용지원금, 연구소, 세금 같은 다음 컨설팅 모듈로 그대로 이어져 자동으로 분석해요. 이 회사에 다음으로 뭘 제안하면 좋을지가 보여요.
            </p>
          </article>
        </div>

        {/* 써 보면 달라지는 것 — 시간 · 다음 계약 · 처음 맡는 분야 · 첫 미팅 */}
        <div data-os-renewal className="mt-10 rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-9">
          <p className="text-sm font-black tracking-wide text-emerald-300">써 보면 달라지는 것</p>
          <h3 className="mt-2 break-keep text-[1.6rem] font-bold leading-snug sm:text-3xl">
            시간은 아끼고,<br className="sm:hidden" /> 계약과 소개는 가까워져요
          </h3>
          <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {outcomes.map((o, i) => (
              <li key={o.t} className="border-l-2 border-emerald-400/70 pl-4">
                <p className="flex items-baseline gap-2.5 break-keep text-lg font-bold">
                  <span className="shrink-0 text-[0.95rem] font-black tabular-nums text-emerald-300">{String(i + 1).padStart(2, '0')}</span>
                  {o.t}
                </p>
                <p className="mt-1 break-keep text-[1rem] leading-relaxed text-slate-300">
                  <Em text={o.d} em={o.em} cls="text-emerald-300" />
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-7 break-keep border-t border-white/10 pt-5 text-[1.05rem] font-semibold leading-relaxed text-white sm:text-lg">
            꼼꼼하게 관리받은 고객은 다시 찾고, 주변에도 소개해요. <span className="text-emerald-300">일이 일을 부르는 컨설턴트</span>가 되는 거예요.
          </p>
        </div>

        {/* 예상 반응 — 정식 출시 전이라 실제 후기가 아니다. 제목·안내 문장은 대표님 요청으로 뺐고,
            카드마다 '· 예시' 표기는 남겨 실제 후기로 읽히지 않게 한다 */}
        <div data-os-reactions className="mt-8">
          <ul className="grid gap-4 md:grid-cols-3">
            {reactions.map((r) => (
              <li key={r.who} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p aria-hidden className="text-[1.05rem] tracking-[0.15em] text-amber-400">★★★★★</p>
                <p className="mt-3 flex-1 break-keep text-[1.02rem] leading-relaxed text-slate-700">“{r.quote}”</p>
                <p className="mt-4 text-sm font-bold text-slate-500">
                  {r.who} <span className="font-medium text-slate-400">· 예시</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. 대시보드 미리보기 — 아침에 열면 할 일이 이유와 함께 (예시·가상 데이터) */}
      <section id="dashboard" className="scroll-mt-20 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <SectionHead
            eyebrow="대시보드 미리보기"
            title="아침에 열면, 오늘 할 일이 정리돼 있어요"
            desc="먼저 할 일 세 가지가 왜 먼저인지와 함께 떠요. 업체를 누르면 할 일, 막힌 서류, 못 받은 돈이 한 화면에 모여 있어요."
          />
          <div className="mt-8 sm:mt-10">
            <OsDashboardPreview />
          </div>
        </div>
      </section>

      {/* 4. 운영 방식 — 고객과 내부가 한 바퀴 + 원칙 + 기록이 남기는 것 */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="고객 화면과 연결"
          title="고객 화면과 내 화면이 하나로 이어져요"
          desc="고객은 My MIRAE에서 서류를 올리고 진행 상황을 직접 봐요. ‘어디까지 됐어요?’ 하는 카톡이 줄어요."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <ol data-os-loop>
              {loop.map((l, i) => (
                <li key={l.text} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {i < loop.length - 1 && <span aria-hidden className="absolute left-[1.05rem] top-9 h-[calc(100%-2.25rem)] w-px bg-slate-200" />}
                  <span className="grid h-[2.1rem] w-[2.1rem] shrink-0 place-items-center rounded-full bg-slate-900 text-[0.85rem] font-black text-white">{i + 1}</span>
                  <div className="min-w-0 pt-0.5">
                    <span className={`text-xs font-black tracking-wide ${l.who === '고객' ? 'text-violet-600' : l.who === '자동' ? 'text-sky-600' : 'text-slate-500'}`}>{l.who}</span>
                    <p className="break-keep text-[1.02rem] font-semibold leading-snug text-slate-800">{l.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-[0.92rem] leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200">
              ↺ 다시 1번으로. 화면보다 이 흐름이 핵심이에요.
            </p>
          </div>

          <div className="grid content-start gap-4">
            {principles.map((p) => (
              <article key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="break-keep text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-1.5 break-keep text-[0.98rem] leading-relaxed text-slate-600">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 7개 모듈 — 지금 쓰는 도구를 모듈로 묶어 확장 */}
      <section id="modules" className="scroll-mt-20 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <SectionHead
            eyebrow="7개 모듈"
            title={<>지금 쓰는 도구를<br className="sm:hidden" /> 7개 모듈로 키워 가요</>}
            desc="기본은 컨설턴트 운영 모듈이고, 필요한 모듈을 더해 한 화면에서 써요. 운영 모듈에 올린 서류는 다른 모듈로 그대로 이어져요."
          />
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 motion-safe:animate-pulse" aria-hidden />
            지금도 매일 쓰면서 다듬고 있어요
          </p>
          <div className="mt-8 sm:mt-10">
            <OsModules />
          </div>
        </div>
      </section>

      {/* 6. 출시 일정 — 무료 체험 없음, 정식 출시 후 월 구독 예정 */}
      <section id="launch" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="언제 쓸 수 있나요?"
          title={<>2026년 10월부터<br className="sm:hidden" /> 하나씩 열어요</>}
          desc={
            <>
              개발은 거의 끝났고, 지금은 직접 써 보면서 다듬고 있어요. 정식 출시 후에는{' '}
              <b className="font-bold text-slate-900">월 구독</b>으로 제공할 예정이에요.
            </>
          }
        />
        <div className="mt-8 sm:mt-10">
          <OsLaunchSteps />
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="break-keep text-[0.98rem] leading-relaxed text-slate-600">
            빨라진 정도는 아직 숫자로 말씀드리지 않아요. 제대로 비교할 <span className="font-semibold text-slate-800">기준을 지금 재고 있어서요.</span>
          </p>
          <a
            href="#inquiry"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
          >
            오픈 소식 받기
          </a>
        </div>
      </section>

      {/* 5. FAQ + 전자책 + 문의 */}
      <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">자주 묻는 질문</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">도입 전, 이것만 확인하세요</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-lg font-bold text-slate-900"><span className="text-blue-600">Q.</span> {item.q}</p>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>

          <TrustPanel />

          {/* 실무 전자책 — 큰 이미지 섹션 → 가로 컴팩트 카드 */}
          <div id="resources" className="mt-6 scroll-mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-[0.9fr_1.1fr]">
            <a
              href="https://futureailab.crekit.io/l/deals/zy3n6rjd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="실무 전자책 자세히 보기 (새 탭에서 열림)"
              className="group block overflow-hidden bg-slate-100"
            >
              <img
                src="/ebook-cover.webp"
                alt="정책자금 · 무상지원금 · 고용지원금 실무 전자책 표지"
                width={1500}
                height={844}
                loading="lazy"
                className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </a>
            <div className="p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">📘 실무 전자책</span>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">정책자금 · 무상지원금 · 고용지원금 실무 가이드</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                <b className="text-slate-900">고객이 가장 많이 묻는 주제</b>만 골라 담았어요. 상담 자리에서 바로 꺼내 쓸 수 있어서, 막 시작한 컨설턴트에게 <b className="text-slate-900">든든한 지침서</b>가 될 거예요.
              </p>
              <ul className="mt-4 space-y-1.5 text-[0.98rem] text-slate-600">
                {[
                  '고객이 가장 많이 묻는 주제 중심',
                  '신입 컨설턴트를 위한 실무 지침',
                  '상담에 바로 쓰는 노하우',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 font-black text-blue-500" aria-hidden>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="https://futureailab.crekit.io/l/deals/zy3n6rjd"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
              >
                전자책 자세히 보기
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* 문의 — 제작철학·상담 CTA를 인트로 한 줄로 압축 */}
          <div id="inquiry" className="mt-12 scroll-mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base font-bold uppercase tracking-widest text-blue-600">문의</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">오픈 소식 · 도입 문의</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                모듈을 열 때마다 먼저 연락드릴게요. 요즘 가장 시간을 잡아먹는 일을 적어 주시면, 김팀장이 직접 읽고 답해 드려요.
              </p>
            </div>
            <div className="mx-auto mt-8 max-w-3xl">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter
        topSlot={
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <p className="max-w-md text-base leading-relaxed text-slate-500">
              MIRAE AI LAB OS — 여러 고객사의 일을 한 화면에서 챙기는 컨설턴트 운영 OS예요.
            </p>
            <nav className="-my-2.5 flex flex-wrap gap-x-6 text-base font-medium text-slate-600">
              <Link to="/business-services" className="inline-flex min-h-11 items-center transition-colors hover:text-slate-900">대표님용 경영지원</Link>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="-mx-1.5 inline-flex min-h-11 items-center px-1.5 transition-colors hover:text-slate-900">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        }
      />
    </div>
  )
}

export default App
