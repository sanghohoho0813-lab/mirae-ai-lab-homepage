import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../components/BusinessInquiryForm'

// 중소기업 대표님을 위한 공개 서비스몰 페이지. 기존 페이지/컴포넌트는 건드리지 않습니다.
// 디자인 토큰(화이트 배경·네이비 포인트·담백한 카드)은 기존 사이트(App.tsx)를 따릅니다.

const trustStats = [
  { value: '100억+', label: '누적 자금조달 지원' },
  { value: '실무 경험', label: '정책자금·인증·사업계획' },
  { value: 'ISO', label: 'ISO 인증 심사원' },
  { value: 'AI 도구', label: 'AI 기반 경영지원 도구 개발' },
]

const flowSteps = ['정책자금', '사업계획', '벤처·인증', '홈페이지+MVP']

const problems = [
  { icon: '🧭', text: '받을 수 있는 지원사업이 있어도, 어디서부터 봐야 할지 모르겠습니다.' },
  { icon: '📝', text: '사업계획서는 필요한데, 우리 회사의 기술성과 차별점을 말로 풀기 어렵습니다.' },
  { icon: '🧩', text: '벤처인증·연구소·정책자금이 따로 놀아서, 전체 전략이 없습니다.' },
  { icon: '🖥️', text: '심사자에게 보여줄 홈페이지나 MVP 결과물이 부족합니다.' },
]

type BadgeTone = 'primary' | 'blue' | 'slate'

type Package = {
  id: string
  category: string
  badge: string
  badgeTone: BadgeTone
  name: string
  tagline: string
  recommendedFor: string[]
  deliverables: string[]
  process: string
  expectation: string
  featured?: boolean
}

const packages: Package[] = [
  {
    id: 'fund-diagnosis',
    category: '자금',
    badge: '입문 추천',
    badgeTone: 'blue',
    name: '정책자금 가능성 진단 패키지',
    tagline: '현재 재무·업종·업력 기준으로 검토 가능한 정책자금 방향을 정리합니다.',
    recommendedFor: ['대출 금리를 낮추고 싶은 대표', '운전자금이 필요한 대표', '어떤 자금부터 봐야 할지 막막한 대표'],
    deliverables: ['정책자금 가능성 진단 리포트', '우선 검토 제도 목록', '신청 전 준비물 체크리스트'],
    process: '진단 → 우선순위 정리 → 신청 준비 안내',
    expectation: '어떤 자금부터 검토할지 우선순위가 정리되고, 신청 전 준비물이 명확해집니다.',
    featured: true,
  },
  {
    id: 'gov-plan',
    category: '지원사업',
    badge: '준비 추천',
    badgeTone: 'slate',
    name: '정부지원사업 사업계획 전략 패키지',
    tagline: '예창패·초창패·소상공인 지원사업 등 신청 전 사업계획 구조를 정리합니다.',
    recommendedFor: ['지원사업을 처음 준비하는 대표', '사업계획서 작성이 막막한 대표'],
    deliverables: ['사업계획 스토리 구조안', '항목별 작성 가이드', '심사 포인트 정리'],
    process: '분석 → 스토리 구조화 → 작성 가이드 제공',
    expectation: '사업계획의 뼈대와 심사 포인트가 잡혀, 작성 방향이 또렷해집니다.',
  },
  {
    id: 'venture-story',
    category: '벤처·인증',
    badge: '성장기업 추천',
    badgeTone: 'blue',
    name: '벤처인증 스토리 설계 패키지',
    tagline: '단순 사업을 기술성·성장성 중심의 벤처인증 스토리로 재구성합니다.',
    recommendedFor: ['벤처기업확인을 준비하는 법인', '기술기업처럼 보여야 하는 대표'],
    deliverables: ['기술성·성장성 스토리라인', '벤처 유형 검토', '준비 서류 로드맵'],
    process: '현황 분석 → 스토리 재구성 → 서류 로드맵',
    expectation: '우리 사업이 기술성·성장성 관점에서 어떻게 보이는지 정리되고, 준비 순서가 잡힙니다.',
    featured: true,
  },
  {
    id: 'web-mvp',
    category: '홈페이지·MVP',
    badge: '대표 추천',
    badgeTone: 'primary',
    name: '홈페이지 + MVP 제작 패키지',
    tagline: '심사자와 고객에게 보여줄 웹페이지와 간단한 작동형 MVP를 제작합니다.',
    recommendedFor: ['아이디어는 있지만 보여줄 결과물이 부족한 대표', '심사자에게 보여줄 화면이 필요한 대표'],
    deliverables: ['소개 웹페이지', '작동형 MVP 화면', '데모용 시연 시나리오'],
    process: '기획 → 화면 제작 → 데모 정리',
    expectation: '심사자와 고객에게 보여줄 웹페이지와 작동 화면이 생겨, 설명이 쉬워집니다.',
    featured: true,
  },
  {
    id: 'lab-cert',
    category: '벤처·인증',
    badge: '법인 추천',
    badgeTone: 'slate',
    name: '연구소·기업인증 로드맵 패키지',
    tagline: '기업부설연구소·벤처·이노비즈/메인비즈 인증 흐름을 정리합니다.',
    recommendedFor: ['인증과 사후관리를 함께 보고 싶은 법인', '여러 인증을 순서대로 준비하려는 대표'],
    deliverables: ['인증 우선순위 로드맵', '요건·서류 체크리스트', '사후관리 일정안'],
    process: '요건 점검 → 우선순위 → 사후관리 계획',
    expectation: '어떤 인증을 어떤 순서로 준비할지 로드맵이 생기고, 사후관리 일정이 잡힙니다.',
  },
  {
    id: 'full',
    category: '풀패키지',
    badge: '로드맵 추천',
    badgeTone: 'slate',
    name: '정책자금·벤처인증 풀패키지',
    tagline: '자금·인증·사업계획·MVP·홈페이지를 하나의 성장 로드맵으로 설계합니다.',
    recommendedFor: ['중장기적으로 기업지원제도를 제대로 활용하려는 대표', '전체 로드맵이 필요한 대표'],
    deliverables: ['통합 성장 로드맵', '단계별 실행 계획', '우선 제작물 우선순위'],
    process: '종합 진단 → 로드맵 설계 → 단계별 실행',
    expectation: '자금·인증·사업계획·결과물이 하나의 성장 로드맵으로 연결되어 실행 순서가 명확해집니다.',
  },
]

const CATEGORIES = ['전체', '자금', '지원사업', '벤처·인증', '홈페이지·MVP', '풀패키지']

const recommendations = [
  { when: '운전자금이 필요하다면', cat: '자금', to: '정책자금 가능성 진단' },
  { when: '지원사업 신청을 준비한다면', cat: '지원사업', to: '정부지원사업 사업계획 전략' },
  { when: '기술기업처럼 보여야 한다면', cat: '벤처·인증', to: '벤처인증 스토리 설계' },
  { when: '보여줄 결과물이 없다면', cat: '홈페이지·MVP', to: '홈페이지 + MVP 제작' },
  { when: '전체 로드맵이 필요하다면', cat: '풀패키지', to: '정책자금·벤처인증 풀패키지' },
]

const comparison = [
  { label: '접근 초점', agency: '신청서 작성 대행', homepage: '화면 디자인 제작', ours: '자금·인증·사업계획·MVP를 하나로 연결' },
  { label: '사업계획', agency: '양식 채우기', homepage: '해당 없음', ours: '기술성·성장성 스토리로 구조화' },
  { label: '결과물', agency: '제출 서류', homepage: '홈페이지', ours: '홈페이지 + MVP + 실행 로드맵' },
  { label: '관점', agency: '단건 처리', homepage: '외주 제작', ours: '대표님 사업을 제도 언어로 정리' },
]

const processSteps = [
  { title: '기본 진단', desc: '현황과 목표를 간단히 확인합니다.' },
  { title: '업종·재무·아이템 분석', desc: '강점과 준비 상태를 점검합니다.' },
  { title: '지원사업·인증 방향 설계', desc: '우선순위와 전략을 정리합니다.' },
  { title: '필요한 결과물 제작', desc: '사업계획·홈페이지·MVP 등을 준비합니다.' },
  { title: '신청 전략·후속 실행 정리', desc: '일정과 준비물을 정리합니다.' },
]

const cases = [
  { before: '의료폐기물 수거업체', after: '의료폐기물 운영관리 플랫폼 기업 스토리로 재구성' },
  { before: '일반 제조업체', after: '연구개발 과제와 기업부설연구소 운영 흐름 정리' },
  { before: '신규 창업자', after: '정부지원사업용 사업계획서 구조와 MVP 화면 설계' },
]

const eyebrow = 'text-base font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'
const badgeToneClass: Record<BadgeTone, string> = {
  primary: 'bg-slate-900 text-white',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  slate: 'bg-slate-100 text-slate-600',
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function CtaBanner({ heading, sub, tone = 'light' }: { heading: string; sub?: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div
        className={`flex flex-col items-center justify-between gap-4 rounded-2xl border px-6 py-6 text-center sm:flex-row sm:text-left ${
          dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div>
          <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{heading}</p>
          {sub && <p className={`mt-1 text-sm ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{sub}</p>}
        </div>
        <a
          href="#apply"
          className={`shrink-0 rounded-xl px-6 py-3 text-base font-semibold transition-colors ${
            dark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          무료 진단 신청하기
        </a>
      </div>
    </section>
  )
}

// 히어로 미니 대시보드: 회사 현황 → 필요한 준비물 → 추천 패키지 흐름을 담담하게 시각화.
function HeroFunnel() {
  const steps = [
    { no: '1', title: '회사 현황', chips: ['업종', '매출', '업력'] },
    { no: '2', title: '필요한 준비물', chips: ['사업계획', '인증', '자금'] },
  ]
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md ring-1 ring-slate-900/5 sm:p-7">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">내 상황 진단 미리보기</p>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">예시 화면</span>
      </div>
      <div className="mt-5 space-y-2">
        {steps.map((s) => (
          <div key={s.no}>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-white text-xs font-extrabold text-blue-600 ring-1 ring-inset ring-slate-200">
                  {s.no}
                </span>
                <p className="text-sm font-bold text-slate-800">{s.title}</p>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.chips.map((c) => (
                  <span key={c} className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div aria-hidden className="py-1 text-center text-slate-300">↓</div>
          </div>
        ))}
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600 text-xs font-extrabold text-white">3</span>
            <p className="text-sm font-bold text-slate-900">추천 패키지</p>
          </div>
          <p className="mt-2 text-sm font-bold text-blue-700">정책자금 가능성 진단 패키지</p>
          <p className="mt-1 text-xs text-slate-500">대표님 상황에 따라 추천 패키지는 달라집니다.</p>
        </div>
      </div>
    </div>
  )
}

export default function BusinessServicesPage() {
  const [activeCat, setActiveCat] = useState('전체')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    document.title = '중소기업 대표님을 위한 AI 경영지원 서비스몰 | 미래 AI 랩'
  }, [])

  const featured = packages.filter((p) => p.featured)
  const visible = activeCat === '전체' ? packages : packages.filter((p) => p.category === activeCat)

  function pickCategory(cat: string) {
    setActiveCat(cat)
    scrollToId('packages')
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black tracking-tight text-sky-400">
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden text-base font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              홈
            </Link>
            <Link to="/consultants" className="hidden text-base font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              컨설턴트용
            </Link>
            <a
              href="#apply"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
            >
              무료 진단 신청하기
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                미래 AI 랩 · 미래경영지원센터
              </span>
              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.15]">
                중소기업 대표님을 위한
                <br />
                AI 경영지원 서비스몰
              </h1>
              <p className="mt-6 text-lg font-semibold leading-relaxed text-slate-800 sm:text-xl">
                대표님의 사업을 <span className="text-blue-600">정책자금·정부지원사업·벤처인증</span>에 맞는 언어로
                정리하고, 필요한 결과물을 함께 준비합니다.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                홈페이지, MVP, 사업계획, 인증 로드맵을 따로 보지 않고 하나의 흐름으로 정리합니다.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-7 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
                >
                  내 회사에 맞는 패키지 진단받기
                </a>
                <button
                  type="button"
                  onClick={() => scrollToId('packages')}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 text-lg font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  패키지 둘러보기
                </button>
              </div>
            </div>

            <HeroFunnel />
          </div>

          {/* Connected flow graphic (CSS only) */}
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-bold text-slate-600 sm:text-base">
              {flowSteps.map((step, i) => (
                <span key={step} className="inline-flex items-center gap-x-2">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5">{step}</span>
                  {i < flowSteps.length - 1 && (
                    <span aria-hidden className="text-slate-300">→</span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-sm leading-relaxed text-slate-500">
              따로 준비하던 자금·사업계획·인증·결과물을 하나의 흐름으로 정리합니다.
            </p>
          </div>

          {/* Trust numbers */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {trustStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{s.value}</p>
                <p className="mt-1.5 text-sm leading-snug text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400 sm:text-left">미래경영지원센터 운영 기준</p>
        </div>
      </section>

      {/* Featured 3 */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className={eyebrow}>대표님들이 가장 많이 찾는 패키지</p>
          <h2 className={h2Class}>이 3가지부터 확인해보세요</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((pkg) => (
            <article
              key={pkg.id}
              className="flex flex-col rounded-3xl border border-slate-300 bg-white p-7 shadow-md ring-1 ring-slate-900/5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{pkg.name}</h3>
              <p className="mt-2.5 flex-1 text-base leading-relaxed text-slate-600">{pkg.tagline}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <span className="text-sm font-semibold text-slate-500">진단 후 제안</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => pickCategory(pkg.category)}
                    className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    자세히
                  </button>
                  <a
                    href="#apply"
                    className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                  >
                    상담 신청
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        heading="내 회사에 맞는 패키지, 무료로 진단받기"
        sub="어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다."
      />

      {/* Problems */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className={eyebrow}>이런 고민, 있으셨나요</p>
          <h2 className={h2Class}>준비할 건 많은데, 전략이 없습니다</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {problems.map((p) => (
            <article key={p.text} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">{p.icon}</span>
              <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="scroll-mt-20 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className={eyebrow}>경영지원 패키지</p>
            <h2 className={h2Class}>대표님 상황에 맞는 패키지를 고르세요</h2>
          </div>

          {/* Recommendation nav */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
            <p className="text-base font-bold text-slate-900">어떤 패키지가 맞을까요?</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((r) => (
                <button
                  key={r.to}
                  type="button"
                  onClick={() => pickCategory(r.cat)}
                  className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="font-medium text-slate-600">{r.when}</span>
                  <span aria-hidden className="text-slate-300 transition-colors group-hover:text-blue-400">→</span>
                  <span className="font-bold text-slate-900 group-hover:text-blue-700">{r.to}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Package grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((pkg) => {
              const open = openId === pkg.id
              return (
                <article
                  key={pkg.id}
                  className={`flex flex-col rounded-3xl bg-white p-7 shadow-sm ${
                    pkg.featured ? 'border-2 border-blue-200' : 'border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{pkg.name}</h3>
                  <p className="mt-2.5 text-base leading-relaxed text-slate-600">{pkg.tagline}</p>

                  {open && (
                    <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">이런 대표님께 맞습니다</p>
                        <ul className="mt-2 space-y-1.5">
                          {pkg.recommendedFor.map((r) => (
                            <li key={r} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-0.5 text-slate-400" aria-hidden>·</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">제공되는 결과물</p>
                        <ul className="mt-2 space-y-1.5">
                          {pkg.deliverables.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-0.5 text-blue-500" aria-hidden>✓</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">진행 방식</p>
                        <p className="mt-2 text-sm font-medium text-slate-700">{pkg.process}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">진행 후 기대되는 변화</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">{pkg.expectation}</p>
                      </div>
                      <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500 ring-1 ring-inset ring-slate-100">
                        유의: 선정·승인·취득을 보장하지 않으며, 심사 기준과 기업 상황에 따라 결과는 달라질 수 있습니다.
                      </p>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <span className="text-sm font-semibold text-slate-500">진단 후 제안</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : pkg.id)}
                        aria-expanded={open}
                        className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {open ? '접기' : '자세히 보기'}
                      </button>
                      <a
                        href="#apply"
                        className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                      >
                        상담 신청
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-slate-500">
            비용은 대표님 상황에 따라 달라, 상담 후 맞춤 안내드립니다. 각 패키지는{' '}
            <b className="font-semibold text-slate-700">문제 → 제공 결과물 → 추천 대상 → 상담</b> 흐름으로 정리했습니다.
          </p>
        </div>
      </section>

      <CtaBanner
        heading="어떤 준비부터 해야 할지, 무료로 확인하기"
        sub="대표님 상황을 남겨주시면 우선순위를 정리해드립니다."
        tone="dark"
      />

      {/* Differentiation */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className={eyebrow}>무엇이 다른가</p>
          <h2 className={h2Class}>단순 대행도, 단순 제작도 아닙니다</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            심사자가 이해하기 쉬운 사업계획 스토리와 결과물을, 자금·인증·지원사업 관점에서 하나로 정리합니다.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-32 px-4 py-3 text-sm font-semibold text-slate-400" />
                <th className="px-4 py-3 text-sm font-bold text-slate-500">단순 대행</th>
                <th className="px-4 py-3 text-sm font-bold text-slate-500">일반 홈페이지 제작</th>
                <th className="rounded-t-xl bg-slate-900 px-4 py-3 text-sm font-bold text-sky-300">미래 AI 랩 방식</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.label} className="border-t border-slate-100">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">{row.label}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{row.agency}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{row.homepage}</td>
                  <td
                    className={`bg-slate-900/[0.03] px-4 py-4 text-sm font-semibold text-slate-900 ${
                      i === comparison.length - 1 ? 'rounded-b-xl' : ''
                    }`}
                  >
                    {row.ours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className={eyebrow}>진행 과정</p>
            <h2 className={h2Class}>진단부터 실행 정리까지, 5단계</h2>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <li key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-extrabold text-blue-600">{`0${i + 1}`}</span>
                <p className="mt-2 text-lg font-bold leading-snug text-slate-900">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cases */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className={eyebrow}>정리 사례</p>
          <h2 className={h2Class}>같은 사업도, 어떻게 정리하느냐가 다릅니다</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            아래는 이해를 돕기 위한 비식별 예시입니다. (실제 업체명이 아닙니다.)
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <article key={c.before} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-slate-400">기존</p>
              <p className="mt-1.5 text-base font-medium text-slate-700">{c.before}</p>
              <p className="mt-4 text-sm font-semibold text-blue-600">정리 후 →</p>
              <p className="mt-1.5 text-base font-bold leading-relaxed text-slate-900">{c.after}</p>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        heading="대표님 상황에 맞는 패키지 추천받기"
        sub="비식별 상담으로 먼저 방향만 확인하셔도 됩니다."
      />

      {/* Disclaimer */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            본 서비스는 정책자금 승인, 정부지원사업 선정, 벤처기업확인 취득을 보장하지 않습니다. 기업의 업종,
            재무상태, 대표자 이력, 신청 시점, 기관 심사 기준에 따라 결과는 달라질 수 있습니다. 미래AI랩은
            대표님의 사업을 제도와 심사 기준에 맞게 정리하고, 실행 가능한 준비물을 갖추는 것을 돕습니다.
          </p>
        </div>
      </section>

      {/* Apply CTA */}
      <section id="apply" className="scroll-mt-20 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <p className={eyebrow}>무료 진단 신청</p>
            <h2 className={h2Class}>먼저, 대표님 상황부터 진단해보세요</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              간단히 남겨주시면, 어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다.
            </p>
          </div>
          <div className="mt-10">
            <BusinessInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black text-sky-400">
                AI
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-bold text-slate-900">미래 AI 랩</span>
                <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
              </span>
            </div>
            <Link to="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              ← 미래 AI 랩 홈으로
            </Link>
          </div>
          <p className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-400">
            © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 AI 경영지원
          </p>
        </div>
      </footer>
    </div>
  )
}
