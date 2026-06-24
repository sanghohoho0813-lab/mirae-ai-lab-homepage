import HeroSlider from './components/HeroSlider'
import InquiryForm from './components/InquiryForm'
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
  { label: '대상', href: '#audience' },
  { label: '도구', href: '#tools' },
  { label: '활용분야', href: '#fields' },
  { label: '자료', href: '#resources' },
  { label: '문의', href: '#inquiry' },
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
    badge: '주 타깃',
    icon: '🧑‍💼',
    title: '컨설턴트를 위한 실무 도구',
    description:
      '고객 상담, 제안 준비, 지원금 검토, 기업인증 관리, 절세 시뮬레이션처럼 반복되는 업무를 더 빠르고 체계적으로 처리할 수 있도록 돕습니다.',
    audience: '법인·정책자금·고용지원금·기업인증·세무 컨설팅 실무자',
  },
  {
    badge: '부 타깃',
    icon: '🏢',
    title: '대표를 위한 이해 도구',
    description:
      '정책자금, 고용지원금, 감면 가능성처럼 어려운 내용을 대표가 더 쉽게 이해하고, 컨설턴트와 더 좋은 의사결정을 할 수 있도록 돕습니다.',
    audience: '중소기업 대표, 직접 검토하고 싶은 소규모 사업장 대표',
  },
]

const principles: Principle[] = [
  {
    no: '01',
    title: '실무에서 출발합니다',
    description:
      '현장에서 매번 반복되는 판단과 계산을 먼저 관찰하고, 거기서부터 도구를 설계합니다. 기능이 아니라 업무가 기준입니다.',
  },
  {
    no: '02',
    title: '품질과 속도를 함께 높입니다',
    description:
      'AI가 컨설턴트를 대체하는 것이 아니라, 컨설팅의 품질과 속도를 함께 높이는 데 집중합니다. 결정은 사람이 합니다.',
  },
  {
    no: '03',
    title: '직접 만들고, 직접 씁니다',
    description:
      '현업에서 직접 써보고 검증한 도구만 공개합니다. 제가 쓰지 않을 도구는 만들지 않습니다.',
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
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-600">
            {tool.category}
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
              {tool.buttonText}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </span>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2.5 text-base font-semibold text-slate-400"
            >
              🔒 {tool.buttonText}
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
              <span className="text-base font-bold tracking-tight text-slate-900">AI Business Lab</span>
              <span className="text-xs font-medium text-slate-500">업무 자동화 LAB · 김팀장</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-base font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#inquiry"
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
          >
            제작 문의하기
          </a>
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
                업무 자동화 LAB
              </span>

              <h1 className="mt-7 text-3xl font-extrabold leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  AI 도구
                </span>
                를 직접 만드는
                <br />
                경영 컨설턴트, <span className="text-sky-300">김팀장</span>
              </h1>

              <p className="mt-7 text-lg leading-relaxed text-slate-300 sm:text-xl sm:leading-relaxed">
                9년간 노무·법무·세무·자금 실무를 경험했고, 현재는 4년째 법인컨설팅 업무를 하고 있습니다.
                실제 현장에서 반복되는 판단·계산·검토·안내 업무를{' '}
                <span className="font-semibold text-white">AI 도구</span>로 바꾸고 있습니다.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#tools"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 text-lg font-semibold text-slate-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  도구 둘러보기
                </a>
                <a
                  href="#inquiry"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  제작 문의하기
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
          <p className="text-xl font-semibold leading-relaxed text-slate-800 sm:text-2xl lg:text-3xl lg:leading-relaxed">
            <span className="text-blue-600">정책자금, 고용지원금, 기업인증, 연구소, 절세, 고객관리</span>까지.
            <br className="hidden sm:block" /> 반복되는{' '}
            <span className="font-bold text-slate-900">검토·계산·안내·제안</span> 업무를 AI 도구로 바꾸고 있습니다.
          </p>
        </div>
      </div>

      {/* About — 제작자 소개 */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">제작자 소개</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              실무에서 시작된 AI 도구들
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
              <p>
                9년간 노무·법무·세무·자금 분야 실무를 경험했고, 현재는 4년째 법인컨설팅 업무를 하고
                있습니다.
              </p>
              <p>
                현장에서 느낀 가장 큰 문제는 많은 업무가 여전히 반복적인 수작업에 의존하고 있다는
                점이었습니다.
              </p>
              <p>
                그래서 실제로 사용하는 업무 흐름을 기반으로 AI 도구들을 직접 만들기 시작했고, 지금도 계속
                개발하고 있습니다.
              </p>
              <p className="font-semibold text-slate-800">
                이 사이트는 제가 직접 만들고 운영하는 실무형 AI 도구들을 모아둔 공간입니다.
              </p>
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
                <p className="text-base text-slate-500">경영 컨설턴트 · AI 도구 제작</p>
              </div>
            </div>
            <ul className="mt-7 space-y-4 text-lg text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                노무·법무·세무·자금 실무를 거친 법인컨설팅 전문가입니다.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                정책자금·고용지원금·기업인증 등 다분야 컨설팅을 진행합니다.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                현업에서 직접 쓰고 검증한 도구만 공개합니다.
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

      {/* Audience — 누구를 위한 도구인가요? */}
      <section id="audience" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">활용 대상</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              누구를 위한 도구인가요?
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-600">
              이 도구들은 컨설턴트가 고객에게 더 빠르고 정확하고 질 좋은 컨설팅을 제공하도록 돕습니다.
              동시에 직접 확인하고 싶은 대표들도 기초 검토용으로 활용할 수 있습니다.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {audienceCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-2xl">
                    {card.icon}
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                    {card.badge}
                  </span>
                </div>
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
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">활용분야</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            컨설턴트 실무에 맞춘 8개 영역
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-slate-600">
            각 영역의 반복 업무를 AI 도구로 옮기고 있습니다. 필요한 영역부터 골라 적용해 보세요.
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
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">도구</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            실무형 AI 도구 모음
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-slate-600">
            데모가 아니라 실제로 동작하는 서비스들입니다. 카드를 누르면 진짜 서비스가 새 탭에서 열립니다.
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
              곧 공개될 도구들입니다. 현장에서 가장 필요한 순서대로 만들고 있습니다.
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

      {/* Resources — 무료 실무 자료 */}
      <section id="resources" className="mx-auto max-w-6xl px-6 py-28 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">무료 실무 자료</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            실무에 바로 쓰는 자료를 무료로
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              📘 무료 전자책
            </span>
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              초보 컨설턴트를 위한 실무 가이드
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              정책자금, 고용지원금, 기업인증, 상담 노하우 등 실무에 바로 활용할 수 있는 내용을 정리한
              자료입니다.
            </p>
            {/* TODO: 실제 다운로드 링크(전자책 파일/노션/구글드라이브)로 교체하세요 */}
            <a
              href="#"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-700"
            >
              무료 다운로드
              <span aria-hidden>↓</span>
            </a>
          </div>

          {/* Visual */}
          <div className="relative hidden items-center justify-center overflow-hidden bg-slate-950 p-10 md:flex">
            <div aria-hidden className="absolute inset-0 opacity-50" style={gridBackground} />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-blue-600/30 blur-3xl"
            />
            <div className="relative w-44 rotate-2 rounded-xl border border-white/10 bg-white p-5 shadow-2xl shadow-black/40">
              <div className="h-2 w-10 rounded-full bg-blue-500" />
              <p className="mt-4 text-lg font-extrabold leading-tight text-slate-900">
                초보 컨설턴트
                <br />
                실무 가이드
              </p>
              <div className="mt-4 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-slate-200" />
                <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
                <div className="h-1.5 w-3/5 rounded-full bg-slate-200" />
              </div>
              <p className="mt-5 text-[11px] font-semibold text-slate-400">AI Business Lab</p>
            </div>
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
              AI는 컨설팅의 품질과 속도를 높입니다
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-slate-400">
              AI가 컨설턴트를 대체하는 것이 아니라, 더 좋은 결과를 더 빠르게 만들도록 돕습니다.
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
              나만의 업무 자동화 도구가 필요하신가요?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-300">
              반복되는 엑셀 업무, 고객관리, 상담 기록, 제안서 작성, 지원금 검토처럼 시간과 비용을 많이
              잡아먹는 업무가 있다면 알려주세요. 현장의 업무 흐름을 바탕으로 실제로 쓸 수 있는 AI 도구나
              자동화 프로그램으로 바꿔드립니다.
            </p>
            <a
              href="#inquiry"
              className="mt-9 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
            >
              나만의 자동화 도구 제작 문의하기
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="mx-auto max-w-3xl px-6 py-28 sm:py-32">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">업무 자동화 제작 문의</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
            컨설턴트 업무, 고객관리, 엑셀 반복작업, 상담 자동화, 제안서 작성 등 자동화하고 싶은 업무를
            편하게 남겨주세요.
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
                  <span className="text-base font-bold text-slate-900">AI Business Lab</span>
                  <span className="text-xs font-medium text-slate-500">업무 자동화 LAB</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-500">
                AI 도구를 직접 만드는 경영 컨설턴트, 김팀장. 컨설턴트와 대표 모두를 위한 실무형 AI
                업무도구를 만듭니다.
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
            <p>© {new Date().getFullYear()} AI Business Lab · 김팀장</p>
            <p>실무형 AI 도구 모음 · AI Business Tools</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
