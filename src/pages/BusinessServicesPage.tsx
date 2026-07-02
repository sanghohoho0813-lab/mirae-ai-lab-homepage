import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../components/BusinessInquiryForm'
import PackageThumb from '../components/PackageThumb'

// 중소기업 대표님을 위한 공개 서비스몰. 상품 선택이 빨리 보이는 "모바일 우선 서비스몰" 구성.
// 기존 페이지/컴포넌트/기능 로직은 건드리지 않습니다.

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
    tagline: '재무·업종·업력 기준으로 검토 가능한 정책자금 방향을 정리합니다.',
    recommendedFor: ['운전자금이 필요한 대표', '대출 금리를 낮추고 싶은 대표', '어떤 자금부터 볼지 막막한 대표'],
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
    tagline: '예창패·초창패·소상공인 지원사업 신청 전 사업계획 구조를 정리합니다.',
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
    tagline: '일반 사업을 기술성·성장성 중심의 벤처인증 스토리로 재구성합니다.',
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
    tagline: '심사자와 고객에게 보여줄 웹페이지와 작동형 MVP를 제작합니다.',
    recommendedFor: ['보여줄 결과물이 부족한 대표', '심사자에게 보여줄 화면이 필요한 대표'],
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
    recommendedFor: ['중장기적으로 기업지원제도를 활용하려는 대표', '전체 로드맵이 필요한 대표'],
    deliverables: ['통합 성장 로드맵', '단계별 실행 계획', '우선 제작물 우선순위'],
    process: '종합 진단 → 로드맵 설계 → 단계별 실행',
    expectation: '자금·인증·사업계획·결과물이 하나의 로드맵으로 연결되어 실행 순서가 명확해집니다.',
  },
]

const top3Short: Record<string, string> = {
  'fund-diagnosis': '운전자금·시설자금 방향을 먼저 확인합니다.',
  'venture-story': '일반 사업을 기술성·성장성 중심으로 정리합니다.',
  'web-mvp': '심사자와 고객에게 보여줄 결과물을 만듭니다.',
}

const CATEGORIES = ['전체', '자금', '지원사업', '벤처·인증', '홈페이지·MVP', '풀패키지']

const recommendations = [
  { when: '운전자금이 필요하다면', cat: '자금', to: '정책자금 가능성 진단' },
  { when: '지원사업 신청을 준비한다면', cat: '지원사업', to: '정부지원사업 사업계획 전략' },
  { when: '기술기업처럼 보여야 한다면', cat: '벤처·인증', to: '벤처인증 스토리 설계' },
  { when: '보여줄 결과물이 없다면', cat: '홈페이지·MVP', to: '홈페이지 + MVP 제작' },
  { when: '전체 로드맵이 필요하다면', cat: '풀패키지', to: '정책자금·벤처인증 풀패키지' },
]

const compareCards = [
  { title: '단순 대행', points: ['신청서 작성 중심', '단건 처리'], primary: false },
  { title: '일반 홈페이지 제작', points: ['화면 디자인 중심', '제작만 완료'], primary: false },
  {
    title: '미래 AI 랩',
    points: ['자금·인증·사업계획·MVP 연결', '제도 언어로 정리', '심사자가 이해할 결과물'],
    primary: true,
  },
]

const processSteps = ['기본 진단', '업종·재무 분석', '방향 설계', '결과물 제작', '실행 정리']

const cases = [
  { before: '의료폐기물 수거업체', after: '의료폐기물 운영관리 플랫폼 기업 스토리로 재구성' },
  { before: '일반 제조업체', after: '연구개발 과제와 기업부설연구소 운영 흐름 정리' },
  { before: '신규 창업자', after: '정부지원사업용 사업계획서 구조와 MVP 화면 설계' },
]

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'
const badgeToneClass: Record<BadgeTone, string> = {
  primary: 'bg-slate-900 text-white',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  slate: 'bg-slate-100 text-slate-600',
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BusinessServicesPage() {
  const [activeCat, setActiveCat] = useState('전체')
  const [openId, setOpenId] = useState<string | null>(null)
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    document.title = '중소기업 대표님을 위한 AI 경영지원 서비스몰 | 미래 AI 랩'
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 460)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const featured = packages.filter((p) => p.featured)
  const visible = activeCat === '전체' ? packages : packages.filter((p) => p.category === activeCat)

  function pickCategory(cat: string) {
    setActiveCat(cat)
    scrollToId('packages')
  }

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Slim header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              홈
            </Link>
            <Link to="/consultants" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              컨설턴트용
            </Link>
            <a
              href="#apply"
              className="hidden rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 sm:inline-flex"
            >
              무료 진단 신청하기
            </a>
          </div>
        </div>
      </header>

      {/* Compact hero */}
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            미래경영지원센터 · AI 경영지원 서비스몰
          </span>
          <h1 className="mt-5 text-[1.7rem] font-extrabold leading-[1.25] tracking-tight text-slate-900 sm:text-[2.6rem] sm:leading-[1.15]">
            중소기업 대표님을 위한
            <br />
            AI 경영지원 서비스몰
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            정책자금·정부지원사업·벤처인증·홈페이지+MVP까지, 대표님 상황에 맞는 패키지를 골라보세요.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-slate-700 sm:text-lg"
            >
              내 회사에 맞는 패키지 진단받기
            </a>
            <button
              type="button"
              onClick={() => scrollToId('top3')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-800 transition-colors hover:bg-slate-50 sm:text-lg"
            >
              인기 패키지 보기
            </button>
          </div>

          {/* slim trust + diagnosis flow (compact) */}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.8rem] font-medium text-slate-500">
            <span>누적 자금조달 100억+</span>
            <span className="text-slate-300">·</span>
            <span>ISO 인증 심사원</span>
            <span className="text-slate-300">·</span>
            <span>AI 기반 경영지원 도구 개발</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.8rem] font-bold text-slate-500">
            <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-inset ring-slate-200">회사 현황</span>
            <span className="text-slate-300">→</span>
            <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-inset ring-slate-200">필요한 준비물</span>
            <span className="text-slate-300">→</span>
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-inset ring-blue-600/15">추천 패키지</span>
          </div>
        </div>
      </section>

      {/* TOP 3 popular packages */}
      <section id="top3" className="scroll-mt-16 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-14">
          <p className={eyebrow}>인기 패키지</p>
          <h2 className={h2Class}>대표님들이 먼저 확인하는 패키지</h2>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {featured.map((pkg) => (
              <article
                key={pkg.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5"
              >
                <PackageThumb variant={pkg.id} />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{pkg.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{top3Short[pkg.id]}</p>

                  <ul className="mt-4 space-y-1.5">
                    {pkg.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-0.5 text-blue-500" aria-hidden>✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-slate-500">진단 후 제안</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a
                      href="#apply"
                      className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-slate-700"
                    >
                      상담 신청
                    </a>
                    <button
                      type="button"
                      onClick={() => pickCategory(pkg.category)}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-[0.95rem] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      자세히
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation nav */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className="text-base font-bold text-slate-900 sm:text-lg">어떤 패키지가 맞을까요?</p>
          <p className="mt-1 text-sm text-slate-500">상황을 누르면 맞는 패키지로 바로 이동합니다.</p>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((r) => (
              <button
                key={r.to}
                type="button"
                onClick={() => pickCategory(r.cat)}
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="font-medium text-slate-600">{r.when}</span>
                <span aria-hidden className="text-slate-300 transition-colors group-hover:text-blue-400">→</span>
                <span className="font-bold text-slate-900 group-hover:text-blue-700">{r.to}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All packages + tabs */}
      <section id="packages" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-14">
          <p className={eyebrow}>전체 패키지</p>
          <h2 className={h2Class}>대표님 상황에 맞는 패키지를 고르세요</h2>

          {/* Category tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((pkg) => {
              const open = openId === pkg.id
              return (
                <article
                  key={pkg.id}
                  className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ${
                    pkg.featured ? 'border-2 border-blue-200' : 'border border-slate-200'
                  }`}
                >
                  <PackageThumb variant={pkg.id} />
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{pkg.name}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{pkg.tagline}</p>

                    {open && (
                      <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
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
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">진행 방식 · 기대되는 변화</p>
                          <p className="mt-2 text-sm font-medium text-slate-700">{pkg.process}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{pkg.expectation}</p>
                        </div>
                        <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-500 ring-1 ring-inset ring-slate-100">
                          유의: 선정·승인·취득을 보장하지 않으며, 심사 기준과 기업 상황에 따라 결과는 달라질 수 있습니다.
                        </p>
                      </div>
                    )}

                    {!open && (
                      <p className="mt-4 text-sm text-slate-500">
                        <span className="font-semibold text-slate-600">추천</span> · {pkg.recommendedFor[0]}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-slate-500">진단 후 제안</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href="#apply"
                        className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-slate-700"
                      >
                        상담 신청
                      </a>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : pkg.id)}
                        aria-expanded={open}
                        className="rounded-xl border border-slate-300 px-4 py-3 text-[0.95rem] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {open ? '접기' : '자세히'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            비용은 대표님 상황에 따라 달라 상담 후 맞춤 안내드립니다.
          </p>
        </div>
      </section>

      {/* Supporting (compact): process · compare · cases */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl space-y-10 px-5 py-12 sm:px-6 sm:py-14">
          {/* Process — compact horizontal steps */}
          <div>
            <p className={eyebrow}>진행 과정</p>
            <h2 className={h2Class}>진단부터 실행 정리까지</h2>
            <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2">
              {processSteps.map((step, i) => (
                <span key={step} className="inline-flex items-center gap-1.5">
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    <span className="mr-1.5 text-xs font-extrabold text-blue-600">{`0${i + 1}`}</span>
                    {step}
                  </span>
                  {i < processSteps.length - 1 && <span aria-hidden className="text-slate-300">→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Compare — compact cards */}
          <div>
            <p className={eyebrow}>무엇이 다른가</p>
            <h2 className={h2Class}>단순 대행도, 단순 제작도 아닙니다</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {compareCards.map((c) => (
                <div
                  key={c.title}
                  className={`rounded-2xl p-5 ${
                    c.primary ? 'border-2 border-slate-900 bg-white shadow-sm' : 'border border-slate-200 bg-white'
                  }`}
                >
                  <p className={`text-base font-bold ${c.primary ? 'text-slate-900' : 'text-slate-500'}`}>{c.title}</p>
                  <ul className="mt-3 space-y-1.5">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className={`mt-0.5 ${c.primary ? 'text-blue-500' : 'text-slate-300'}`} aria-hidden>
                          {c.primary ? '✓' : '·'}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Cases — compact */}
          <div>
            <p className={eyebrow}>정리 사례</p>
            <h2 className={h2Class}>어떻게 정리하느냐가 다릅니다</h2>
            <p className="mt-2 text-sm text-slate-500">이해를 돕기 위한 비식별 예시입니다. (실제 업체명이 아닙니다.)</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {cases.map((c) => (
                <div key={c.before} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold text-slate-400">기존 · {c.before}</p>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-slate-900">→ {c.after}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="scroll-mt-16">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className={eyebrow}>무료 진단 신청</p>
            <h2 className={h2Class}>먼저, 대표님 상황부터 진단해보세요</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              간단히 남겨주시면 어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다.
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            본 서비스는 정책자금 승인, 정부지원사업 선정, 벤처기업확인 취득을 보장하지 않습니다. 기업의 업종·재무상태·대표자 이력·신청 시점·기관 심사 기준에 따라 결과는 달라질 수 있습니다. 미래AI랩은 대표님의 사업을 제도와 심사 기준에 맞게 정리하고, 실행 가능한 준비물을 갖추는 것을 돕습니다.
          </p>
          <div className="mt-6">
            <BusinessInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 AI 경영지원
          </p>
          <Link to="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            ← 미래 AI 랩 홈으로
          </Link>
        </div>
      </footer>

      {/* Mobile sticky CTA (상품 섹션 이후부터 노출) */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <a
            href="#apply"
            className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white"
          >
            내 회사 패키지 진단받기
          </a>
        </div>
      )}
    </div>
  )
}
