type Tool = {
  name: string
  description: string
  badge: string
  icon: string
}

type Category = {
  title: string
  subtitle: string
  tools: Tool[]
}

const categories: Category[] = [
  {
    title: '기획 · 전략',
    subtitle: '사업 방향을 잡는 AI 도구',
    tools: [
      {
        name: '시장 분석 어시스턴트',
        description: '경쟁사·트렌드 리서치를 30분 만에 요약 리포트로.',
        badge: '인기',
        icon: '📊',
      },
      {
        name: '사업계획서 코파일럿',
        description: '한 줄 아이디어를 투자 가능한 사업계획서 초안으로.',
        badge: '신규',
        icon: '🧭',
      },
    ],
  },
  {
    title: '마케팅 · 세일즈',
    subtitle: '매출을 만드는 AI 도구',
    tools: [
      {
        name: '카피라이팅 스튜디오',
        description: '광고 문구·상세페이지·뉴스레터를 브랜드 톤으로 자동 작성.',
        badge: '인기',
        icon: '✍️',
      },
      {
        name: '리드 스코어링 봇',
        description: '문의 고객을 자동 분류하고 우선순위를 매겨줍니다.',
        badge: '추천',
        icon: '🎯',
      },
    ],
  },
  {
    title: '운영 · 자동화',
    subtitle: '반복 업무를 줄이는 AI 도구',
    tools: [
      {
        name: '회의록 정리기',
        description: '녹취를 핵심 결정·할 일·담당자까지 깔끔하게 정리.',
        badge: '필수',
        icon: '🗂️',
      },
      {
        name: '업무 자동화 레시피',
        description: '엑셀·이메일·메신저를 잇는 노코드 자동화 템플릿.',
        badge: '신규',
        icon: '⚙️',
      },
    ],
  },
]

const stats = [
  { label: '엄선한 AI 도구', value: '120+' },
  { label: '도입 기업', value: '4,800+' },
  { label: '평균 업무 절감', value: '6.5시간/주' },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg font-black text-white">
              AI
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">AI Business Lab</p>
              <p className="text-xs text-slate-500">김팀장의 AI 경영도구 백화점</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-indigo-600" href="#tools">
              도구 둘러보기
            </a>
            <a className="transition hover:text-indigo-600" href="#about">
              소개
            </a>
            <a
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500"
              href="#tools"
            >
              지금 시작하기
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-slate-50" />
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
            🛍️ 실무에 바로 쓰는 AI 경영도구 모음
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            김팀장의 <span className="text-indigo-600">AI 경영도구</span> 백화점
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            기획부터 마케팅, 운영까지. 현장에서 검증된 AI 도구를 한 곳에서 골라 쓰세요.
            복잡한 세팅 없이, 오늘 바로 업무에 적용할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#tools"
              className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 sm:w-auto"
            >
              도구 둘러보기
            </a>
            <a
              href="#about"
              className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 sm:w-auto"
            >
              어떻게 활용하나요?
            </a>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
              >
                <dt className="text-sm text-slate-500">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">카테고리별 추천 도구</h2>
          <p className="mt-3 text-slate-600">
            팀의 업무 흐름에 맞춰, 필요한 매장(카테고리)에서 도구를 골라보세요.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.title}>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{category.title}</h3>
                  <p className="text-sm text-slate-500">{category.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {category.tools.map((tool) => (
                  <article
                    key={tool.name}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-2xl">
                      {tool.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-semibold text-slate-900">{tool.name}</h4>
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          {tool.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
                      <span className="mt-3 inline-block text-sm font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">
                        자세히 보기 →
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            AI는 거들 뿐, 결정은 김팀장이 합니다
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            화려한 기능보다 “오늘 바로 쓸 수 있는가”를 기준으로 도구를 큐레이션합니다.
            도입 가이드와 실무 템플릿까지 함께 제공해, 팀이 헤매지 않도록 돕습니다.
          </p>
          <a
            href="#tools"
            className="mt-8 inline-block rounded-xl bg-indigo-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-400"
          >
            무료로 시작하기
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} AI Business Lab · 김팀장의 AI 경영도구 백화점</p>
          <p>실무에 바로 쓰는 AI, 여기 다 있습니다.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
