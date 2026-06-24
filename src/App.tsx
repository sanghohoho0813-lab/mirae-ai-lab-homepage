type Field = {
  name: string
  description: string
  icon: string
}

type ToolStatus = '운영중' | '개발중'

type ToolItem = {
  title: string
  category: string
  status: ToolStatus
  url: string
  description: string
}

type UpcomingTool = {
  title: string
  category: string
  description: string
}

type Principle = {
  no: string
  title: string
  description: string
}

const navItems = [
  { label: '소개', href: '#about' },
  { label: '도구', href: '#tools' },
  { label: '활용분야', href: '#fields' },
  { label: '제작철학', href: '#philosophy' },
  { label: '문의', href: '#contact' },
]

const domains =
  '법인컨설팅 · 정책자금 · 고용지원금 · 기업인증 · 연구소 관리 · 세무·절세 · 자본거래 · 고객관리'

const fields: Field[] = [
  {
    icon: '🏦',
    name: '정책자금',
    description: '정부·지자체 정책자금을 기업 요건에 맞춰 검토하고 매칭합니다.',
  },
  {
    icon: '👥',
    name: '고용지원금',
    description: '지원금 수급 요건을 판단하고 신청 일정을 관리합니다.',
  },
  {
    icon: '🏅',
    name: '기업인증',
    description: '벤처·이노비즈·메인비즈 등 인증 취득과 갱신을 관리합니다.',
  },
  {
    icon: '🔬',
    name: '연구소 관리',
    description: '기업부설연구소 설립과 사후관리를 체계적으로 운영합니다.',
  },
  {
    icon: '🧮',
    name: '세무·절세',
    description: '급여·배당·퇴직 설계를 바꿔가며 세부담을 시뮬레이션합니다.',
  },
  {
    icon: '💱',
    name: '자본거래',
    description: '증자·가지급금·주식이동 등 자본거래를 사전 검토합니다.',
  },
  {
    icon: '🤝',
    name: '고객관리·영업',
    description: '상담 기록과 제안, 고객 파이프라인을 한 곳에서 관리합니다.',
  },
  {
    icon: '⚙️',
    name: '업무자동화',
    description: '반복되는 문서 작성·계산·안내 업무를 자동화합니다.',
  },
]

const tools: ToolItem[] = [
  {
    title: '고용지원금 프로',
    category: '고용지원금',
    status: '운영중',
    url: 'https://hr-subsidy-pro.vercel.app/',
    description: '고용지원금 대상 여부와 활용 가능 제도를 빠르게 검토하는 실무형 도구',
  },
  {
    title: '연구소 사후관리 OS',
    category: '연구소 관리',
    status: '운영중',
    url: 'https://labcare-rnd-os.vercel.app/dashboard',
    description: '기업부설연구소 사후관리 및 변경신고 관리를 위한 운영 도구',
  },
  {
    title: '법인컨설팅 세일즈 OS',
    category: '고객관리·영업',
    status: '운영중',
    url: 'https://corp-sales-os.vercel.app/',
    description: '고객관리, 상담이력, 제안관리 중심의 컨설팅 영업 지원 도구',
  },
  {
    title: '크레탑 자동분석기',
    category: '기업분석',
    status: '운영중',
    url: 'https://corp-sales-os-git-claude-cretop-mini-app-ksh90813.vercel.app/mini.html',
    description: '재무제표와 기업정보를 기반으로 컨설팅 포인트를 자동 분석',
  },
  {
    title: '주식 EXIT 솔루션 시뮬레이터',
    category: '자본거래',
    status: '운영중',
    url: 'https://stock-exit-simulator-a1vm.vercel.app/?review=1',
    description: '이익소각, 자사주, 배당 등 다양한 EXIT 전략 비교 시뮬레이션',
  },
  {
    title: '창업감면 & 취등록세 체크',
    category: '절세',
    status: '운영중',
    url: 'https://startup-tax-checker.vercel.app/',
    description: '창업감면과 취등록세 감면 가능성을 빠르게 진단하는 도구',
  },
]

const upcomingTools: UpcomingTool[] = [
  {
    title: '정책자금 AI 심사도우미',
    category: '정책자금',
    description: '기업 요건을 입력하면 적합한 정책자금을 AI가 사전 심사하고 추천합니다.',
  },
  {
    title: '기업인증 통합관리 OS',
    category: '기업인증',
    description: '벤처·이노비즈·메인비즈 등 인증 취득과 갱신을 한 곳에서 통합 관리합니다.',
  },
  {
    title: 'AI 컨설턴트 비서',
    category: '업무자동화',
    description: '상담·검토·문서 작성을 돕는 컨설턴트 전용 AI 비서입니다.',
  },
]

const kpis = [
  { value: '6개', label: '운영중 도구' },
  { value: '3개', label: '개발중 도구' },
  { value: '100%', label: '업데이트 지속중' },
]

const statusStyles: Record<ToolStatus, string> = {
  운영중: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  개발중: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
}

const principles: Principle[] = [
  {
    no: '01',
    title: '실무에서 출발합니다',
    description:
      '현장에서 매번 반복되는 판단과 계산을 먼저 관찰하고, 거기서부터 도구를 설계합니다. 기능이 아니라 업무가 기준입니다.',
  },
  {
    no: '02',
    title: '판단을 돕되, 대체하지 않습니다',
    description:
      '최종 결정은 컨설턴트가 합니다. 도구는 그 판단을 더 빠르고 정확하게 만들 뿐, 책임을 대신 지지 않습니다.',
  },
  {
    no: '03',
    title: '직접 만들고, 직접 씁니다',
    description:
      '현업에서 직접 써보고 검증한 도구만 공개합니다. 제가 쓰지 않을 도구는 만들지 않습니다.',
  },
]

const featuredUrl = 'https://stock-exit-simulator-a1vm.vercel.app/?review=1'

const exitScenarios = [
  { title: '이익소각', sub: '자기주식 취득 후 소각', score: 88 },
  { title: '자사주 매입', sub: '단계적 매입 · 분산 처리', score: 79 },
  { title: '현금 배당', sub: '배당소득 분리과세 활용', score: 71 },
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

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-black tracking-tight text-sky-400">
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-slate-900">AI Business Lab</span>
              <span className="text-[11px] font-medium text-slate-500">업무 자동화 LAB · 김팀장</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
          >
            제작 문의하기
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-slate-950">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={gridBackground} />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-44 right-0 h-[30rem] w-[30rem] rounded-full bg-sky-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                업무 자동화 LAB
              </span>

              <h1 className="mt-6 text-pretty text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  AI 도구
                </span>
                를 직접 만드는
                <br className="hidden sm:block" /> 경영 컨설턴트, 김팀장
              </h1>

              <p className="mt-6 max-w-xl text-lg font-medium text-slate-200">
                컨설턴트를 위한 실무형 AI 업무도구를 만듭니다.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
                법인컨설팅, 정책자금, 고용지원금, 기업인증, 절세, 고객관리 업무에서 반복되는
                판단·계산·안내·제안 과정을 AI 도구로 바꾸고 있습니다.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#tools"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  도구 둘러보기
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  제작 문의하기
                </a>
              </div>
            </div>

            {/* Product mockup — links to a live tool */}
            <div className="relative">
              <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-2xl" />
              <a
                href={featuredUrl}
                {...externalLinkProps}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-rose-300" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-300" />
                  <span className="ml-2 text-xs font-semibold text-slate-500">
                    주식 EXIT 솔루션 시뮬레이터
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    운영중
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    절세효과 높은 순 · 전략 비교
                  </p>
                  {exitScenarios.map((m) => (
                    <div
                      key={m.title}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{m.title}</p>
                        <p className="truncate text-xs text-slate-500">{m.sub}</p>
                      </div>
                      <div className="ml-4 shrink-0 text-right">
                        <p className="text-sm font-bold text-slate-900">{m.score}점</p>
                        <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-sky-400 to-blue-500"
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
                    <span className="text-sm font-medium text-slate-200">추천 전략 · 예상 절세효과</span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-sky-300">
                      바로 열기 <span aria-hidden>↗</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Domains strip */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="text-center text-xs font-medium tracking-wide text-slate-500 sm:text-sm">
            {domains}
          </p>
        </div>
      </div>

      {/* About — 제작자 소개 */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">제작자 소개</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              실무에서 시작된 AI 도구들
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                안녕하세요. 저는 법인컨설팅 실무를 하면서 반복되는 판단, 계산, 안내, 검토 업무를
                AI 도구로 바꾸고 있는 김팀장입니다.
              </p>
              <p>
                정책자금, 고용지원금, 기업인증, 연구소, 절세, 자본거래 등 다양한 분야의 컨설팅을
                진행하며 느낀 것은 많은 업무가 여전히 수작업에 의존하고 있다는 점이었습니다.
              </p>
              <p>
                그래서 실제 현장에서 사용하는 도구들을 직접 만들기 시작했고, 지금도 계속 개발하고
                있습니다.
              </p>
              <p className="font-medium text-slate-800">
                이 사이트는 제가 직접 만들고 운영하는 AI 업무도구들을 모아둔 공간입니다.
              </p>
            </div>
          </div>

          {/* Profile card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-xl font-bold text-sky-400">
                김
              </span>
              <div>
                <p className="text-lg font-bold text-slate-900">김팀장</p>
                <p className="text-sm text-slate-500">경영 컨설턴트 · AI 도구 제작</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                법인컨설팅 실무 경험을 기반으로 도구를 설계합니다.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                정책자금·고용지원금·기업인증 등 다분야 컨설팅을 진행합니다.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>✓</span>
                현업에서 직접 쓰고 검증한 도구만 공개합니다.
              </li>
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">6개</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">운영중 도구</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">3개</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">개발중 도구</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fields */}
      <section id="fields" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">활용분야</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              컨설턴트 실무에 맞춘 8개 영역
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              각 영역의 반복 업무를 AI 도구로 옮기고 있습니다. 필요한 영역부터 골라 적용해 보세요.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fields.map((field) => (
              <article
                key={field.name}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-xl transition-colors group-hover:bg-blue-600">
                  {field.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{field.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{field.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">도구</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            실무형 AI 도구 모음
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            지금 운영 중인 도구들입니다. 카드를 누르면 실제 서비스가 새 탭에서 열립니다.
          </p>
        </div>

        {/* 운영 현황 KPI */}
        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
            >
              <dd className="text-3xl font-extrabold tracking-tight text-slate-900">{kpi.value}</dd>
              <dt className="mt-1 text-sm font-medium text-slate-500">{kpi.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />운영중
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />개발중
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.url}
              {...externalLinkProps}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {tool.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[tool.status]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {tool.status}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900">{tool.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                도구 열기
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Upcoming — 현재 개발중 */}
      <section id="upcoming" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">로드맵</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              현재 개발중
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              곧 공개될 도구들입니다. 현장에서 가장 필요한 순서대로 만들고 있습니다.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {upcomingTools.map((tool) => (
              <article
                key={tool.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {tool.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles['개발중']}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    개발중
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                >
                  곧 공개 예정
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="relative overflow-hidden bg-slate-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">제작철학</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              AI는 거들 뿐, 결정은 컨설턴트가 합니다
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              도구를 많이 만드는 것보다, 실제로 쓰이는 도구를 만드는 데 집중합니다.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.no} className="bg-slate-950 p-8">
                <span className="text-sm font-bold tracking-widest text-sky-400">{p.no}</span>
                <h3 className="mt-4 text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 px-8 py-16 text-center shadow-xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl"
          />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">문의</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              도구 제작 또는 자동화가 필요하신가요?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              반복되는 엑셀 업무, 검토 업무, 고객관리 업무를 AI 도구로 바꾸고 싶다면 문의해주세요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {/* TODO: 실제 문의 이메일 또는 문의 폼 주소로 교체하세요 */}
              <a
                href="mailto:contact@aibusinesslab.kr"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                제작 문의하기
              </a>
              <a
                href="#tools"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                도구 먼저 둘러보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-black text-sky-400">
                  AI
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-slate-900">AI Business Lab</span>
                  <span className="text-[11px] font-medium text-slate-500">업무 자동화 LAB</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
                AI 도구를 직접 만드는 경영 컨설턴트, 김팀장. 컨설턴트를 위한 실무형 AI 업무도구를
                만듭니다.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} AI Business Lab · 김팀장</p>
            <p>실무형 AI 도구 모음 · AI Business Tools</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
