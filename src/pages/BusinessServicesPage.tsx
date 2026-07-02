import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../components/BusinessInquiryForm'
import BusinessServiceVisual from '../components/BusinessServiceVisual'
import { badgeToneClass, businessPackages, CATEGORIES, DISCLAIMER, packageBanner } from '../data/businessPackages'

// 중소기업 대표님을 위한 공개 서비스몰 홈. 상품 데이터는 ../data/businessPackages 공유.
// 기존 페이지/컴포넌트/기능 로직은 건드리지 않습니다.

const recommendations = [
  { when: '운전자금', cat: '자금' },
  { when: '지원사업 신청', cat: '지원사업' },
  { when: '기술기업 전환', cat: '벤처·인증' },
  { when: '보여줄 결과물', cat: '홈페이지·MVP' },
  { when: '전체 로드맵', cat: '풀패키지' },
]

const compareCards = [
  { title: '단순 대행', points: ['신청서 작성 중심', '단건 처리'], primary: false },
  { title: '일반 홈페이지 제작', points: ['화면 디자인 중심', '제작만 완료'], primary: false },
  { title: '미래 AI 랩', points: ['자금·인증·사업계획·MVP 연결', '심사자가 이해할 결과물'], primary: true },
]

const processSteps = ['기본 진단', '업종·재무 분석', '방향 설계', '결과물 제작', '실행 정리']

const cases = [
  {
    type: '벤처인증',
    title: '수거업 → 플랫폼 기업 스토리',
    before: '의료폐기물 수거업체',
    after: '의료폐기물 운영관리 플랫폼 기업 스토리로 재구성',
    tags: ['기술성 스토리', '서류 로드맵'],
    comment: '우리 사업을 다르게 설명할 수 있게 됐습니다.',
  },
  {
    type: '연구소·인증',
    title: '제조업 → 연구소 운영 흐름',
    before: '일반 제조업체',
    after: '연구개발 과제와 기업부설연구소 운영 흐름 정리',
    tags: ['인증 로드맵', '사후관리 일정'],
    comment: '인증 준비 순서가 명확해졌습니다.',
  },
  {
    type: '지원사업·MVP',
    title: '창업자 → 사업계획 + MVP',
    before: '신규 창업자',
    after: '정부지원사업 사업계획 구조와 MVP 화면 설계',
    tags: ['사업계획 구조', 'MVP 화면'],
    comment: '보여줄 결과물이 생겼습니다.',
  },
]

const homeFaqs = [
  {
    q: '정책자금 승인을 보장하나요?',
    a: '아니요. 승인·선정·취득은 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략 설계, 심사자가 이해하기 쉬운 결과물 정리를 돕습니다.',
  },
  { q: '아직 아이디어만 있어도 가능한가요?', a: '네. 아이디어 단계에서도 사업계획 구조화와 MVP 화면 설계로 구체화할 수 있습니다.' },
  {
    q: '홈페이지와 MVP는 어느 정도까지 만들어주나요?',
    a: '소개 웹페이지와 핵심 기능을 보여주는 작동형 MVP 화면, 데모 시나리오까지 준비합니다.',
  },
  { q: '벤처인증이나 연구소 설립도 같이 볼 수 있나요?', a: '네. 인증·연구소 요건과 우선순위를 하나의 로드맵으로 함께 정리합니다.' },
  { q: '비용은 어떻게 정해지나요?', a: '대표님 상황과 범위에 따라 달라, 진단·상담 후 맞춤 안내드립니다.' },
]

const accentDot: Record<string, string> = {
  blue: 'bg-blue-400',
  sky: 'bg-sky-400',
  indigo: 'bg-indigo-400',
  cyan: 'bg-cyan-400',
  slate: 'bg-slate-400',
}

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BusinessServicesPage() {
  const [activeCat, setActiveCat] = useState('전체')
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    document.title = '중소기업 대표님을 위한 AI 경영지원 서비스몰 | 미래 AI 랩'
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const featured = businessPackages.filter((p) => p.featured)
  const visible = activeCat === '전체' ? businessPackages : businessPackages.filter((p) => p.category === activeCat)

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Shopping-style header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
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
          <nav className="hidden items-center gap-5 text-[0.95rem] font-medium text-slate-600 lg:flex">
            <button type="button" onClick={() => scrollToId('packages')} className="transition-colors hover:text-slate-900">전체상품</button>
            <button type="button" onClick={() => scrollToId('top3')} className="transition-colors hover:text-slate-900">인기패키지</button>
            <button type="button" onClick={() => scrollToId('cases')} className="transition-colors hover:text-slate-900">진행사례</button>
            <button type="button" onClick={() => scrollToId('faq')} className="transition-colors hover:text-slate-900">FAQ</button>
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToId('packages')}
              aria-label="상품 찾기"
              className="hidden h-9 w-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 sm:grid"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
            </button>
            <a
              href="#apply"
              className="hidden rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 sm:inline-flex"
            >
              무료 진단 신청하기
            </a>
          </div>
        </div>
      </header>

      {/* Promotion-banner hero (navy) */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-28 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                미래경영지원센터 · AI 경영지원 서비스몰
              </span>
              <h1 className="mt-5 text-[1.75rem] font-extrabold leading-[1.22] tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.15]">
                정책자금·벤처인증·MVP 준비,
                <br />
                <span className="text-sky-300">대표님 상황에 맞는 패키지</span>로 시작하세요
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                사업계획서, 홈페이지, 인증 로드맵까지 흩어진 준비물을 하나의 실행 패키지로 정리합니다.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToId('top3')}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-base font-bold text-slate-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 sm:text-lg"
                >
                  인기 패키지 보기
                </button>
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:text-lg"
                >
                  무료 진단 신청
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.8rem] font-medium text-slate-400">
                <span>누적 자금조달 100억+</span>
                <span className="text-slate-600">·</span>
                <span>ISO 인증 심사원</span>
                <span className="text-slate-600">·</span>
                <span>정책자금·인증·사업계획 실무 경험</span>
              </div>
            </div>

            {/* Right preview: package list card */}
            <div className="hidden lg:block">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30 backdrop-blur">
                {featured.map((pkg) => {
                  const b = packageBanner[pkg.id]
                  return (
                    <Link
                      key={pkg.id}
                      to={`/business-services/${pkg.slug}`}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/10"
                    >
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accentDot[b.accent]}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-white">{b.title}</span>
                        <span className="block truncate text-xs text-slate-400">{b.subtitle}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-300">자세히 →</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 3 popular packages */}
      <section id="top3" className="scroll-mt-16 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>인기 패키지</p>
          <h2 className={h2Class}>대표님들이 먼저 확인하는 패키지</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featured.map((pkg) => {
              const b = packageBanner[pkg.id]
              return (
                <article
                  key={pkg.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5"
                >
                  <Link to={`/business-services/${pkg.slug}`} className="block aspect-[16/9]">
                    <BusinessServiceVisual type={pkg.visualType} title={b.title} subtitle={b.subtitle} accent={b.accent} imageSrc={pkg.imageSrc} alt={pkg.name} />
                  </Link>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
                    </div>
                    <h3 className="mt-2.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{pkg.name}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">{pkg.short}</p>
                    <ul className="mt-3 space-y-1">
                      {pkg.deliverables.slice(0, 3).map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 text-blue-500" aria-hidden>✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <Link
                        to={`/business-services/${pkg.slug}`}
                        className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-slate-700"
                      >
                        자세히 보기
                      </Link>
                      <a
                        href="#apply"
                        className="rounded-xl border border-slate-300 px-4 py-3 text-[0.95rem] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        상담
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* All products + tabs + compact situation chips */}
      <section id="packages" className="scroll-mt-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={eyebrow}>전체 상품</p>
              <h2 className={h2Class}>대표님 상황에 맞는 패키지를 고르세요</h2>
            </div>
          </div>

          {/* Category tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
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

          {/* Compact situation shortcuts */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">상황별 바로가기</span>
            {recommendations.map((r) => (
              <button
                key={r.cat}
                type="button"
                onClick={() => setActiveCat(r.cat)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {r.when}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((pkg) => {
              const b = packageBanner[pkg.id]
              return (
                <article
                  key={pkg.id}
                  className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ${
                    pkg.featured ? 'border-2 border-blue-200' : 'border border-slate-200'
                  }`}
                >
                  <Link to={`/business-services/${pkg.slug}`} className="block aspect-[16/9]">
                    <BusinessServiceVisual type={pkg.visualType} title={b.title} subtitle={b.subtitle} accent={b.accent} imageSrc={pkg.imageSrc} alt={pkg.name} />
                  </Link>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
                    </div>
                    <h3 className="mt-2.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{pkg.name}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">{pkg.short}</p>
                    <ul className="mt-3 space-y-1">
                      {pkg.deliverables.slice(0, 2).map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 text-blue-500" aria-hidden>✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <Link
                        to={`/business-services/${pkg.slug}`}
                        className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-slate-700"
                      >
                        자세히 보기
                      </Link>
                      <a
                        href="#apply"
                        className="rounded-xl border border-slate-300 px-4 py-3 text-[0.95rem] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        상담
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-500">비용은 대표님 상황에 따라 달라 상담 후 맞춤 안내드립니다.</p>
        </div>
      </section>

      {/* 진행사례 (review-style) */}
      <section id="cases" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>진행 사례</p>
          <h2 className={h2Class}>이렇게 정리했습니다</h2>
          <p className="mt-2 text-sm text-slate-500">이해를 돕기 위한 비식별 예시입니다. (실제 업체명이 아닙니다.)</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {cases.map((c) => (
              <article key={c.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{c.type}</span>
                  <span className="text-xs font-semibold text-slate-400">진행 사례</span>
                </div>
                <p className="mt-3 text-base font-bold text-slate-900">{c.title}</p>
                <div className="mt-3 flex items-stretch gap-2">
                  <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <p className="text-[11px] font-bold text-slate-400">기존</p>
                    <p className="mt-1 text-xs font-semibold leading-snug text-slate-600">{c.before}</p>
                  </div>
                  <div className="flex items-center text-slate-300" aria-hidden>→</div>
                  <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50/60 p-2.5">
                    <p className="text-[11px] font-bold text-blue-500">정리 후</p>
                    <p className="mt-1 text-xs font-bold leading-snug text-slate-900">{c.after}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{t}</span>
                  ))}
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">“{c.comment}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Compact why/process band */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
            <span className="mr-2 text-sm font-bold text-slate-900">진행 과정</span>
            {processSteps.map((step, i) => (
              <span key={step} className="inline-flex items-center gap-1.5">
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
                  <span className="mr-1 text-xs font-extrabold text-blue-600">{`0${i + 1}`}</span>
                  {step}
                </span>
                {i < processSteps.length - 1 && <span aria-hidden className="text-slate-300">→</span>}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {compareCards.map((c) => (
              <div key={c.title} className={`rounded-2xl p-4 ${c.primary ? 'border-2 border-slate-900 bg-white' : 'border border-slate-200 bg-white'}`}>
                <p className={`text-sm font-bold ${c.primary ? 'text-slate-900' : 'text-slate-500'}`}>{c.title}</p>
                <ul className="mt-2 space-y-1">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className={`mt-0.5 ${c.primary ? 'text-blue-500' : 'text-slate-300'}`} aria-hidden>{c.primary ? '✓' : '·'}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16">
        <div className="mx-auto max-w-3xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-6 space-y-3">
            {homeFaqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-base font-bold text-slate-900">Q. {f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className={eyebrow}>무료 진단 신청</p>
            <h2 className={h2Class}>먼저, 대표님 상황부터 진단해보세요</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              간단히 남겨주시면 어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다.
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">
            {DISCLAIMER}
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

      {/* Mobile sticky CTA */}
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
