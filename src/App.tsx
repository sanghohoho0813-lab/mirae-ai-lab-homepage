import { Link } from 'react-router-dom'
import HeroSlider from './components/HeroSlider'
import InquiryForm from './components/InquiryForm'
import { useAuth } from './lib/auth'
import { accessTypeLabel } from './lib/platform'
import {
  kpis,
  statusStyles,
  subStatusStyles,
  tools,
  upcomingTools,
  type Tool,
} from './data/tools'

type Field = {
  name: string
  description: string
  icon: string
}

type Principle = {
  no: string
  title: string
  description: string
}

const navItems = [
  { label: '소개', href: '#about' },
  { label: '도구', href: '#tools' },
  { label: '입문 과정', href: '#resources' },
  { label: '이용 방식', href: '#pricing' },
  { label: '문의', href: '#inquiry' },
]

type PricingPlan = {
  name: string
  badge: string
  badgeClass: string
  highlight: boolean
  points: string[]
  cta: { label: string; to?: string; href?: string }
}

const pricingPlans: PricingPlan[] = [
  {
    name: '7일 무료 체험',
    badge: '베타 운영 중',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    highlight: true,
    points: [
      '정식 출시 전 피드백 참여자 우선 제공',
      '신청 시각부터 정확히 7일 체험',
      '리뷰·설문 참여 시 최대 21일까지 연장',
      '실제 고객 상담에 바로 적용',
    ],
    cta: { label: '지금 무료로 시작', to: '/signup' },
  },
  {
    name: '컨설턴트 이용권',
    badge: '출시 예정',
    badgeClass: 'bg-blue-50 text-blue-700',
    highlight: false,
    points: [
      '정식 출시 후 유료 이용 예정',
      '도구별 또는 통합 이용권 제공 예정',
      '고객관리 · 검토 · 제안 업무 지원',
      '결제 연동 준비 중',
    ],
    cta: { label: '출시 알림 받기', href: '#inquiry' },
  },
  {
    name: '관리자 승인 · 맞춤 제작',
    badge: '준비 중',
    badgeClass: 'bg-slate-100 text-slate-600',
    highlight: false,
    points: [
      '관리자 승인으로 기간 연장 가능',
      '특정 도구 무제한 권한 부여 가능',
      '나만의 업무 자동화 도구 제작',
      '반복 업무 분석 · 내부 프로세스 자동화',
    ],
    cta: { label: '내 업무 도구 만들기', href: '#inquiry' },
  },
]

const fields: Field[] = [
  { icon: '🏦', name: '정책자금', description: '정부·지자체 정책자금을 기업 요건에 맞춰 검토하고 매칭합니다.' },
  { icon: '👥', name: '고용지원금', description: '지원금 수급 요건을 판단하고 신청 일정을 관리합니다.' },
  { icon: '🏅', name: '기업인증', description: '벤처·이노비즈·메인비즈 등 인증 취득과 갱신을 관리합니다.' },
  { icon: '🔬', name: '연구소 관리', description: '기업부설연구소 설립과 사후관리를 체계적으로 운영합니다.' },
  { icon: '🧮', name: '세무·절세', description: '급여·배당·퇴직 설계를 바꿔가며 세부담을 시뮬레이션합니다.' },
  { icon: '💱', name: '자본거래', description: '증자·가지급금·주식이동 등 자본거래를 사전 검토합니다.' },
  { icon: '🤝', name: '고객관리·영업', description: '상담 기록과 제안, 고객 파이프라인을 한 곳에서 관리합니다.' },
  { icon: '⚙️', name: '업무자동화', description: '반복되는 문서 작성·계산·안내 업무를 자동화합니다.' },
]

const audienceCards = [
  {
    icon: '🧑‍💼',
    title: '“그 얘기도 했어야 했는데”를 줄이고 싶은 컨설턴트',
    description:
      '상담·검토·제안·사후관리를 한 곳에서. 흩어진 메모 대신, 고객 앞에서 꺼낼 무기가 쌓입니다.',
    audience: '법인·정책자금·고용지원금·기업인증·세무 컨설턴트',
  },
  {
    icon: '🏢',
    title: '직접 확인하고 싶은 대표님',
    description: '정책자금·지원금·감면 가능성을 쉽게 가늠하고, 상담 전에 미리 판단해 볼 수 있습니다.',
    audience: '중소기업 대표 · 소규모 사업장 대표',
  },
]

const principles: Principle[] = [
  {
    no: '01',
    title: '업무에서 출발합니다',
    description: '기능이 아니라, 매일 반복되는 업무에서 도구를 설계합니다.',
  },
  {
    no: '02',
    title: '결정은 사람이 합니다',
    description: 'AI는 판단을 돕고, 계약은 컨설턴트가 만듭니다.',
  },
  {
    no: '03',
    title: '직접 만들고, 직접 씁니다',
    description: '현업에서 검증한 도구만 공개합니다. 안 쓰는 도구는 만들지 않습니다.',
  },
]

const gridBackground = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
} as const

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const

function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

function ToolThumbnail({ tool }: { tool: Tool }) {
  const posClass = tool.thumbPos === 'top' ? 'object-top' : 'object-center'

  if (!tool.isPublic) {
    return (
      <div className="relative border-b border-slate-200">
        <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2.5">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          <span className="ml-2 text-xs font-medium text-slate-400">비공개 · 외부 공개 제한</span>
        </div>
        <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-slate-900">
          <div aria-hidden className="absolute inset-0 opacity-40" style={gridBackground} />
          <div className="relative flex flex-col items-center gap-2 text-slate-300">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <rect x="4" y="10.5" width="16" height="10" rx="2" />
              <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
            <span className="text-base font-bold text-white">비공개 검토중</span>
            <span className="text-sm text-slate-400">현재 외부 공개 제한</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative border-b border-slate-200">
      <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-300" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
        <span className="ml-2 truncate rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-400">
          {hostOf(tool.url)}
        </span>
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-white">
        <img
          src={tool.thumbnail}
          alt={`${tool.title} 실제 서비스 화면`}
          loading="lazy"
          className={`h-full w-full object-cover ${posClass} transition-transform duration-300 group-hover:scale-[1.04]`}
        />
      </div>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  const cardClass =
    'group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition'

  const body = (
    <>
      <ToolThumbnail tool={tool} />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">
            <span aria-hidden className="text-blue-400">◆</span>
            {tool.stage}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${statusStyles[tool.status]}`}>
            {tool.status}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${subStatusStyles[tool.subStatus]}`}>
            {tool.subStatus}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{tool.title}</h3>
        <p className="mt-2.5 text-base leading-relaxed text-slate-600">{tool.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tool.features.map((feature) => (
            <span
              key={feature}
              className="rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-500 ring-1 ring-inset ring-slate-200"
            >
              {feature}
            </span>
          ))}
        </div>

        <p className="mt-5 text-sm font-medium text-slate-400">추천 대상 · {tool.target}</p>

        <div className="mt-auto pt-5">
          <p className="rounded-xl bg-blue-50 px-4 py-3 text-base font-semibold text-blue-700">
            “{tool.valueLine}”
          </p>
          {tool.isPublic ? (
            <span className="mt-4 inline-flex items-center gap-1.5 text-base font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              {accessTypeLabel[tool.accessType]}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </span>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2.5 text-base font-semibold text-slate-400"
            >
              🔒 {accessTypeLabel[tool.accessType]}
            </button>
          )}
        </div>
      </div>
    </>
  )

  if (tool.isPublic) {
    return (
      <a
        href={tool.url}
        {...externalLinkProps}
        className={`${cardClass} hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl`}
      >
        {body}
      </a>
    )
  }

  return <div className={`${cardClass} opacity-90`}>{body}</div>
}

function App() {
  const { user, isAdmin } = useAuth()
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black tracking-tight text-sky-400">
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-base font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden text-base font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline"
                  >
                    관리자
                  </Link>
                )}
                <Link
                  to="/my-tools"
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
                >
                  내 도구함
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-slate-950">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={gridBackground} />
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-44 right-0 h-[30rem] w-[30rem] rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-24 lg:pb-40 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-base font-medium text-slate-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                컨설턴트 업무 OS · 정식 출시 전 베타
              </span>

              <h1 className="mt-7 text-[1.9rem] font-extrabold leading-[1.18] tracking-tight text-white sm:text-[2.8rem] lg:text-[3.4rem]">
                고객 앞에서,
                <br />
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  더 전문가처럼.
                </span>
              </h1>

              <p className="mt-7 text-lg leading-relaxed text-slate-300 sm:text-xl sm:leading-relaxed">
                상담·분석·제안·사후관리까지, 흩어진 컨설팅 업무를 하나로 잇는{' '}
                <span className="font-semibold text-white">컨설턴트 OS</span>. 놓치던 제안을 다시
                꺼내고, 계약 가능성을 높입니다.
              </p>

              <p className="mt-4 text-base text-slate-400 sm:text-lg">
                9년 노무·세무·법무·자금 실무를 직접 겪은 컨설턴트, 김팀장이 만들었습니다.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 text-lg font-semibold text-slate-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  상담에 7일 무료로 써보기
                </Link>
                <a
                  href="#tools"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
                >
                  내 업무에 맞는 도구 보기
                </a>
                <a
                  href="#inquiry"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  내 반복 업무 도구화 문의
                </a>
              </div>
            </div>

            {/* Auto-rotating product preview */}
            <HeroSlider />
          </div>
        </div>
      </section>

      {/* Emphasis box */}
      <div className="relative z-20 mx-auto -mt-20 max-w-5xl px-6 lg:-mt-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-900/10 sm:p-10">
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-sm font-bold text-slate-500 sm:text-base">
            {['상담', '분석', '검토', '제안', '계약', '사후관리'].map((step) => (
              <span key={step} className="inline-flex items-center gap-x-1.5">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1">{step}</span>
                <span aria-hidden className="text-slate-300">→</span>
              </span>
            ))}
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-blue-600">재계약</span>
          </div>
          <p className="mt-6 text-xl font-semibold leading-relaxed text-slate-800 sm:text-2xl lg:text-3xl lg:leading-relaxed">
            도구 5개가 아니라, <span className="font-bold text-blue-600">끊기지 않는 하나의 업무 흐름</span>.
          </p>
        </div>
      </div>

      {/* About — 제작자 소개 */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">만든 사람</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              반복 업무를 직접 겪은 사람이 만들었습니다
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
              <p>9년간 노무·세무·법무·자금 실무를, 4년째 법인컨설팅 현장을 직접 겪었습니다.</p>
              <p>
                좋은 컨설팅이 결국 흩어진 메모와 반복 수작업 위에 있다는 걸 알기에, 그 일을 대신할 도구를
                직접 만들고 매일 씁니다.
              </p>
              <p className="font-semibold text-slate-800">제가 직접 쓰지 않는 도구는 만들지 않습니다.</p>
            </div>
          </div>

          {/* Profile card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-2xl font-bold text-sky-400">
                김
              </span>
              <div>
                <p className="text-2xl font-bold text-slate-900">김팀장</p>
                <p className="text-base text-slate-500">법인컨설팅 · 컨설턴트 OS 제작</p>
              </div>
            </div>
            <ul className="mt-7 space-y-4 text-lg text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                노무·세무·법무·자금 실무를 거친 법인컨설팅 전문가
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                정책자금·고용지원금·기업인증 등 다분야 컨설팅 진행
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                현업에서 직접 쓰고 검증한 도구만 공개
              </li>
            </ul>
            <dl className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
              <div>
                <dd className="text-3xl font-extrabold tracking-tight text-slate-900">9년</dd>
                <dt className="mt-1 text-sm font-medium text-slate-500">노무·법무·세무·자금 실무</dt>
              </div>
              <div>
                <dd className="text-3xl font-extrabold tracking-tight text-slate-900">4년차</dd>
                <dt className="mt-1 text-sm font-medium text-slate-500">법인컨설팅 진행중</dt>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Audience — 이런 분들께 특히 도움이 됩니다 */}
      <section id="audience" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">누구를 위한 OS인가</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              아마, 당신의 이야기일 겁니다
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-600">
              컨설턴트의 하루를 기준으로 설계했습니다. 대표님이 직접 확인할 때도 똑같이 쓸 수 있습니다.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {audienceCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-10"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-2xl">
                  {card.icon}
                </span>
                <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{card.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{card.description}</p>
                <p className="mt-6 border-t border-slate-100 pt-5 text-base font-medium text-slate-500">
                  {card.audience}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Fields */}
      <section id="fields" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">다루는 업무</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            한 흐름 안에서 다루는 8개 업무
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-slate-600">
            상담부터 재계약까지, 컨설턴트가 매일 만나는 업무를 도구로 옮깁니다.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map((field) => (
            <article
              key={field.name}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-900 text-2xl transition-colors group-hover:bg-blue-600">
                {field.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{field.name}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-600">{field.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">컨설턴트 OS</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            업무 흐름으로 연결되는 도구
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-slate-600">
            각 도구는 따로, 또 같이 작동합니다. 카드를 누르면 실제 서비스가 새 탭에서 열립니다.
          </p>
        </div>

        {/* 운영 현황 KPI — 상태값 기준 자동 계산 */}
        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-7">
              <dd className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {kpi.value}
                <span className="text-2xl sm:text-3xl">개</span>
              </dd>
              <dt className="mt-2 text-base font-medium text-slate-500">{kpi.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />MVP 베타</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />정식 출시 예정</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" />내부 테스트중</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />비공개 검토중</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Upcoming — 현재 개발중 */}
      <section id="upcoming" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
          <div className="max-w-3xl">
            <p className="text-base font-bold uppercase tracking-widest text-amber-600">로드맵</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">현재 개발중</h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-600">
              현장에서 가장 급한 순서로 만들고 있습니다.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingTools.map((tool) => (
              <article
                key={tool.id}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
                    {tool.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${statusStyles['개발중']}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    개발중
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{tool.title}</h3>
                <p className="mt-2.5 flex-1 text-base leading-relaxed text-slate-600">{tool.description}</p>
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-base font-semibold text-slate-400"
                >
                  곧 공개 예정
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — 이용 방식 */}
      <section id="pricing" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
          <div className="max-w-3xl">
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">이용 방식</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              베타는 지금, 정식은 곧
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-600">
              정식 출시 전, 피드백을 주시는 분들께 먼저 열어드립니다. 지금은 베타로 무료 체험할 수 있습니다.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`flex flex-col rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  plan.highlight ? 'border-2 border-blue-300' : 'border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">{plan.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${plan.badgeClass}`}>
                    {plan.badge}
                  </span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-base text-slate-600">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-blue-500" aria-hidden>
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                {plan.cta.to ? (
                  <Link
                    to={plan.cta.to}
                    className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold transition-colors ${
                      plan.highlight
                        ? 'bg-slate-900 text-white hover:bg-slate-700'
                        : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {plan.cta.label}
                  </Link>
                ) : (
                  <a
                    href={plan.cta.href}
                    className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold transition-colors ${
                      plan.highlight
                        ? 'bg-slate-900 text-white hover:bg-slate-700'
                        : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {plan.cta.label}
                  </a>
                )}
              </article>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-slate-500">
            각 도구는 신청 시각부터 정확히 7일 무료 체험. 리뷰·설문 참여 시 최대 21일까지 연장됩니다. 정식
            이용은 결제 또는 관리자 승인 후 제공됩니다.
          </p>
        </div>
      </section>

      {/* Resources — 컨설턴트를 위한 실무 전자책 */}
      <section id="resources" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">입문 과정</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            컨설턴트 실무, 빠르게 익히는 입문 과정
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-slate-600">
            상담에서 가장 많이 나오는 정책자금·무상지원금·고용지원금 3가지를 빠르게 익히는 과정입니다.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <a
            href="https://futureailab.crekit.io/landing"
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
              className="block w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>
          <div className="p-8 sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              📘 컨설턴트 입문 과정
            </span>
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              정책자금 · 무상지원금 · 고용지원금 실무 가이드
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              고객이 가장 많이 묻는 3가지를 중심으로, 상담과 제안에 바로 쓰도록 정리했습니다. 입문 컨설턴트의
              첫 무기가 됩니다.
            </p>
            <a
              href="https://futureailab.crekit.io/landing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-700"
            >
              입문 과정 살펴보기
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="relative overflow-hidden bg-slate-950">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-32">
          <div className="max-w-3xl">
            <p className="text-base font-bold uppercase tracking-widest text-sky-400">제작철학</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              AI는 엔진일 뿐, 주인공은 컨설턴트
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-400">
              AI가 컨설턴트를 대신하지 않습니다. 더 빠르게, 더 전문가처럼 일하도록 도울 뿐입니다.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle.no} className="bg-slate-950 p-8 sm:p-10">
                <span className="text-base font-bold tracking-widest text-sky-400">{principle.no}</span>
                <h3 className="mt-4 text-2xl font-bold text-white">{principle.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-slate-400">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="mx-auto max-w-6xl px-6 pt-28 sm:pt-32">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 px-8 py-16 text-center shadow-xl sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="relative">
            <p className="text-base font-bold uppercase tracking-widest text-sky-400">문의</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              당신의 반복 업무도, 도구가 될 수 있습니다
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-300">
              엑셀 계산, 흩어진 고객관리, 매번 새로 쓰던 제안서. 당신의 업무 흐름 그대로, 직접 쓰는 도구로
              만들어 드립니다.
            </p>
            <a
              href="#inquiry"
              className="mt-9 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
            >
              내 반복 업무 도구화 문의
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="mx-auto max-w-3xl px-6 py-28 sm:py-32">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">업무 자동화 제작 문의</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
            자동화하고 싶은 업무를 편하게 남겨주세요. 김팀장이 직접 검토해 답해드립니다.
          </p>
        </div>
        <InquiryForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black text-sky-400">
                  AI
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-base font-bold text-slate-900">미래 AI 랩</span>
                  <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-500">
                컨설턴트의 상담·분석·제안·사후관리를 하나로 잇는 업무 OS. 반복 업무를 직접 겪은 컨설턴트
                김팀장이 만듭니다.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-base font-medium text-slate-600">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터</p>
            <p>컨설턴트 업무 OS · Mirae AI Lab</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
