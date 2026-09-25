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

// 왜 만들었나 — 병목은 하나: 일이 많아서가 아니라 흩어져 있어서 시간과 돈이 샌다
const leaks: { tag: string; title: string; desc: string; icon: ReactNode }[] = [
  {
    tag: '시간 손실',
    title: '시간이 샙니다',
    desc: '카톡을 한참 올려 어제 나눈 얘기를 떠올리고, 파일함에서 빠진 서류를 찾고, 달력으로 마감을 확인하고 나서야 첫 전화를 겁니다.',
    icon: svg(
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>,
    ),
  },
  {
    tag: '매출 손실',
    title: '돈이 샙니다',
    desc: '그러다 보면 수금일과 신청 마감을 놓치기 쉽습니다. 서류 한 장을 놓치면 며칠이 밀리고, 마감을 놓치면 그해 기회가 통째로 사라집니다.',
    icon: svg(
      <>
        <path d="M4 7h16v10H4z" />
        <circle cx="12" cy="12" r="2.4" />
        <path d="M7 10v4M17 10v4" />
      </>,
    ),
  },
  {
    tag: '고객의 기대',
    title: '고객은 직접 확인하고 싶어 합니다',
    desc: '‘진행 어떻게 되고 있어요?’라고 카톡으로 묻기보다, 직접 서류를 올리고 어디까지 왔는지 화면으로 보고 싶어 합니다.',
    icon: svg(
      <>
        <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.5" />
        <path d="M9 20h6M12 16v4" />
      </>,
    ),
  },
]

// 고객과 내부가 한 바퀴로 — 화면보다 이 순환이 핵심이다
const loop = [
  { who: '고객', text: 'My MIRAE에서 서류를 올리거나 요청을 남깁니다' },
  { who: '자동', text: '누가, 무엇을, 언제 했는지가 내 상담신청함에 바로 들어옵니다' },
  { who: '나', text: '해당 업체에 연결해 처리하면, 처리한 기록이 그대로 남습니다' },
  { who: '나', text: '정리가 끝난 결과만 고객 화면에 올립니다. 쓰다 만 초안은 보이지 않습니다' },
  { who: '고객', text: '바뀐 진행 단계를 확인하고, 다음 서류나 요청으로 이어 갑니다' },
]

const principles = [
  {
    title: '자동화하기 전에, 필요 없는 일부터 없앴습니다',
    desc: '없앨 일은 없애고, 순서를 정하고, 기록으로 남긴 다음에야 자동화했습니다. AI는 꼭 필요한 곳에만 씁니다. 그래서 카톡으로 진행 상황을 다시 묻거나, 받은 서류를 또 요청하는 일부터 사라졌습니다.',
  },
  {
    title: '왜 그런지 언제든 설명할 수 있게',
    desc: '우선순위와 경고, 하루 정리는 모두 정해진 규칙으로 움직입니다. 그래서 이 일이 왜 먼저인지 늘 설명할 수 있습니다. 사람이 확인하지 않은 채 저절로 실행되는 자동화는 넣지 않았습니다.',
  },
  {
    title: '고객에게는 보여 줄 것만 보입니다',
    desc: '내부 메모와 수임료는 어떤 경우에도 고객 화면에 나가지 않습니다. 주민등록번호나 공동인증서 비밀번호는 아예 저장하지 않습니다.',
  },
]

// 1 → 2 → 3단계 — 3단계가 곧 다른 컨설팅 회사가 쓰는 구독형 OS 다
const stages = [
  { no: '1단계', when: '지금', title: '대표가 매일 직접 씁니다', desc: '고객과 주고받는 흐름을 실제로 돌려 보면서, 얼마나 빨라지는지 잴 기준을 잡고 있습니다.' },
  { no: '2단계', when: '다음', title: '고객 알림과 결과 공유, 직원 계정을 더합니다', desc: '고객이 묻지 않고도 스스로 확인하고 처리하는 일이 늘어납니다.' },
  { no: '3단계', when: '확장', title: '다른 컨설팅 회사도 그대로 쓸 수 있게', desc: '회사 이름과 업무 종류, 메뉴만 바꾸면 되도록 처음부터 그렇게 만들었습니다.' },
]

// 신뢰 지표(히어로 우측 패널) — 실제 확인된 정보만. 대표님용 서비스몰과 동일 축.
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
    a: '아직은 어렵습니다. 2026년 10월에 컨설턴트 운영·기업성장 모듈을 먼저 열고, 나머지는 11월 이후에 차례로 엽니다. 문의를 남겨 주시면 여는 순서에 맞춰 연락드리겠습니다.',
  },
  {
    q: '요금은 어떻게 되나요?',
    a: '정식 출시 후 월 구독으로 제공할 예정입니다. 금액과 구성은 오픈할 때 안내해 드리겠습니다.',
  },
  {
    q: '고객 정보는 안전한가요?',
    a: '개인정보는 꼭 필요한 만큼만 둡니다. 주민등록번호와 공동인증서 비밀번호는 저장하지 않고, 내부 메모와 수임료는 고객 화면에 절대 나가지 않습니다.',
  },
  {
    q: 'AI가 알아서 판단하나요?',
    a: '아니요. 우선순위와 경고, 하루 정리는 모두 정해진 규칙으로 움직여서 이유를 설명할 수 있습니다. AI는 하루 정리를 문장으로 풀어 주는 것처럼 정해 둔 곳에만, 근거가 된 기록과 함께 씁니다.',
  },
]

const gridBackground = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
} as const

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
          <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-x-10">
            {/* 왼쪽 — 메시지·CTA */}
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
                매일 아침 ‘오늘은 누구 일부터 하지?’를 머릿속으로 다시 짜지 않아도 됩니다. 고객이 서류를 올리면 바로 내 할 일로 들어오고,
                처리한 기록은 업체별로 차곡차곡 쌓입니다. 그 기록이 있으니 <span className="font-semibold text-white">다음 제안도 자신 있게</span> 할 수 있습니다.
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
              {/* 진정성 한 줄 (얼굴은 우측 신뢰 패널에 1회만) */}
              <p className="mt-6 border-l-2 border-sky-400/50 pl-3.5 text-sm leading-relaxed text-slate-400 sm:text-base">
                제가 실제 업무에서 매일 쓰고, 도움이 됐다고 확인한 기능만 공개합니다.
              </p>
            </div>

            {/* 오른쪽 — 신뢰 패널 (얼굴 사진 1회 · 모바일에서는 CTA 아래로) */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur sm:p-6 lg:mt-0">
              <p className="text-[0.9rem] font-bold uppercase tracking-widest text-amber-300">믿고 맡기는 이유</p>
              <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 lg:grid-cols-2">
                {trustStats.map((s) => (
                  <div key={s.label} className="border-l-2 border-amber-400/60 pl-3.5">
                    <dd className="text-[1.7rem] font-black leading-none tracking-tight text-white sm:text-[2.1rem]">{s.value}</dd>
                    <dt className="mt-1.5 break-keep text-[0.88rem] font-medium leading-snug text-slate-300 sm:text-[0.92rem]">{s.label}</dt>
                    {s.sub && <p className="mt-0.5 text-[0.78rem] font-semibold leading-snug text-amber-300/90">{s.sub}</p>}
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4 sm:gap-3.5">
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
                    정책자금부터 정부지원사업, 법인컨설팅, AX 구축까지 기업의 성장 과정을 한 흐름으로 설계합니다.
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
        </div>
      </section>

      {/* 2. 왜 만들었나 — 병목 하나 */}
      <section id="value" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="왜 만들었나"
          title="문제는 일이 많은 게 아니라, 여기저기 흩어져 있다는 거였습니다"
          desc="고객사 서너 곳을 함께 맡으면 업체마다 진행 중인 일이 두세 개, 챙길 서류가 열 가지, 받을 돈과 신청 마감도 제각각입니다. 이게 머릿속과 카톡, 파일, 여러 화면에 나뉘어 있으면 매일 아침 ‘오늘 뭐부터 하지, 누구한테 뭘 받아야 하지?’를 처음부터 다시 따져 봐야 합니다."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {leaks.map((v) => (
            <article key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-sky-300 [&_svg]:h-5 [&_svg]:w-5">{v.icon}</div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tracking-wide text-blue-700">{v.tag}</span>
              </div>
              <h3 className="mt-4 break-keep text-xl font-bold text-slate-900">{v.title}</h3>
              <p className="mt-2 break-keep text-[1.05rem] leading-relaxed text-slate-600">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. 대시보드 미리보기 — 아침에 열면 할 일이 이유와 함께 (예시·가상 데이터) */}
      <section id="dashboard" className="scroll-mt-20 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <SectionHead
            eyebrow="대시보드 미리보기"
            title="아침에 열면, 오늘 할 일이 이유와 함께 정리돼 있습니다"
            desc="꼭 처리해야 할 일과, 그중 먼저 할 세 가지를 왜 먼저인지와 함께 보여 줍니다. 업체를 누르면 할 일과 막혀 있는 서류, 아직 못 받은 돈이 한 화면에 모여 있고, 통화가 끝나면 한 줄만 적어 두면 됩니다."
          />
          <div className="mt-8 sm:mt-10">
            <OsDashboardPreview />
          </div>
        </div>
      </section>

      {/* 4. 운영 방식 — 고객과 내부가 한 바퀴 + 원칙 + 기록이 남기는 것 */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="운영 방식"
          title="고객 화면과 내 화면이 하나로 이어집니다"
          desc="고객이 올린 서류와 요청은 곧바로 내 할 일이 되고, 내가 처리한 결과는 고객 화면에 바로 보입니다. 카톡으로 다시 묻고, 받은 걸 또 옮겨 적는 일이 줄어듭니다."
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
              ↺ 그리고 다시 1번으로. 화면보다 이 흐름이 핵심입니다.
            </p>
          </div>

          <div className="grid gap-4">
            {/* 추가 계약의 근거 */}
            <article data-os-renewal className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm sm:p-6">
              <p className="text-xs font-black tracking-wide text-sky-300">쌓이는 기록</p>
              <h3 className="mt-1.5 break-keep text-xl font-bold">꼼꼼히 쌓인 기록이, 다음 계약으로 이어집니다</h3>
              <p className="mt-2 break-keep text-[1rem] leading-relaxed text-slate-300">
                업체마다 무슨 일을 언제 처리했는지, 어떤 서류를 받았는지, 수금은 어디까지 됐는지가 날짜별로 남습니다. 이 기록을 보여 드리면 ‘지금까지 이만큼 해 왔고, 다음엔 이걸 하면 됩니다’라고 자신 있게 제안할 수 있습니다.
              </p>
            </article>
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
            eyebrow="모듈"
            title={<>지금 쓰는 도구를<br className="sm:hidden" /> 7개 모듈로 키워 갑니다</>}
            desc="컨설턴트 운영 모듈을 기본으로 두고, 필요한 분야의 모듈을 같은 화면에 더해 쓰는 방식입니다. 모듈마다 지금 실제로 쓰고 있는 도구와, 완성되면 들어갈 기능을 함께 정리했습니다."
          />
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 motion-safe:animate-pulse" aria-hidden />
            지금도 직접 쓰면서 계속 다듬고 있습니다
          </p>
          <div className="mt-8 sm:mt-10">
            <OsModules />
          </div>
        </div>
      </section>

      {/* 6. 출시 일정 — 무료 체험 없음, 정식 출시 후 월 구독 예정 */}
      <section id="launch" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <SectionHead
          eyebrow="출시 일정"
          title={<>2026년 10월부터<br className="sm:hidden" /> 하나씩 엽니다</>}
          desc={
            <>
              개발은 거의 끝났고, 지금은 직접 써 보면서 완성도를 높이고 화면을 다듬는 중입니다. 정식 출시 후에는{' '}
              <b className="font-bold text-slate-900">월 구독</b>으로 제공할 예정입니다.
            </>
          }
        />
        <div className="mt-8 sm:mt-10">
          <OsLaunchSteps />
        </div>

        <ol className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {stages.map((s) => (
            <li key={s.no} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="flex items-center gap-2 text-sm font-black text-blue-600">
                {s.no}
                <span className={`rounded-md px-1.5 py-0.5 text-xs font-black ${s.when === '지금' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{s.when}</span>
              </p>
              <h3 className="mt-2 break-keep text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-1.5 break-keep text-[0.98rem] leading-relaxed text-slate-600">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="break-keep text-[0.98rem] leading-relaxed text-slate-600">
            얼마나 빨라졌는지는 아직 숫자로 말씀드리지 않습니다. 정확히 비교할 <span className="font-semibold text-slate-800">기준을 지금 재고 있기</span> 때문입니다.
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
                <p className="text-lg font-bold text-slate-900">Q. {item.q}</p>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>

          {/* 실무 전자책 — 큰 이미지 섹션 → 가로 컴팩트 카드 */}
          <div id="resources" className="mt-10 scroll-mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-[0.9fr_1.1fr]">
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
                컨설팅 현장에서 <b className="text-slate-900">고객들이 가장 관심 있어 하는 주제</b>들만 골라 담았습니다. 상담에 바로 꺼내 쓰는 실무 흐름과 노하우가 가득해, 지금 막 시작한 컨설턴트에게는 <b className="text-slate-900">든든한 실무 지침서</b>가 됩니다.
              </p>
              <ul className="mt-4 space-y-1.5 text-[0.98rem] text-slate-600">
                {[
                  '현장 고객이 가장 많이 묻는 주제 중심 구성',
                  '신입 컨설턴트를 위한 실무 지침',
                  '상담에 바로 쓰는 실무 노하우 다수 수록',
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
                모듈을 열 때마다 먼저 연락드리겠습니다. 지금 가장 시간이 많이 드는 업무를 함께 적어 주시면, 김팀장이 직접 읽고 답해 드립니다.
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
              여러 고객사의 일을 한 화면에 모으고, 고객이 한 일이 곧바로 내 할 일로 이어지는 컨설턴트 운영 OS, MIRAE AI LAB OS.
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
