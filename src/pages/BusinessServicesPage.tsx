import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../components/BusinessInquiryForm'
import BusinessServiceVisual from '../components/BusinessServiceVisual'
import {
  businessPackages,
  CATEGORIES,
  categoryToneClass,
  DISCLAIMER,
  packageBanner,
  type BusinessPackage,
} from '../data/businessPackages'

// 중소기업 대표님을 위한 공개 경영지원 서비스몰 홈 (서비스몰형 상품 UI).
// 상품 데이터는 ../data/businessPackages 공유. 기존 기능 로직은 건드리지 않습니다.

const recommendations = [
  { when: '운전자금·지원금', cat: '자금·지원금' },
  { when: '벤처·기업인증', cat: '벤처·인증' },
  { when: '홈페이지·AI 시스템', cat: '홈페이지·AI' },
  { when: '전체 성장 로드맵', cat: '풀패키지' },
]

const compareCards = [
  { title: '단순 대행', points: ['신청서 작성 중심', '단건 처리로 끝'], primary: false },
  { title: '개별 발주', points: ['자금·인증·홈페이지 따로 진행', '흐름이 끊기고 시간 소요'], primary: false },
  { title: '미래 AI 랩', points: ['자금·인증·홈페이지·AI를 하나로 설계', '상담 후 상황에 맞게 제안'], primary: true },
]

const processSteps = ['기본 진단', '업종·재무 분석', '방향 설계', '결과물 제작', '진행 관리']

const cases = [
  {
    type: '정책자금',
    title: '운전자금 방향 정리',
    before: '어떤 자금부터 볼지 막막',
    after: '가능성 진단 후 우선 검토 자금 방향 정리',
    tags: ['가능성 진단', '신청 전략'],
    comment: '무엇부터 준비할지 정리됐습니다.',
  },
  {
    type: '벤처·인증',
    title: '기술성 스토리 재구성',
    before: '일반 사업으로만 보이던 회사',
    after: '기술성·성장성 중심 벤처확인 준비 방향 정리',
    tags: ['기술성 스토리', '특허 연계'],
    comment: '우리 사업을 다르게 설명할 수 있게 됐습니다.',
  },
  {
    type: '홈페이지·AI',
    title: '운영시스템 구축',
    before: '반복업무를 수기로 처리',
    after: 'PC·모바일 통합관리·자동화 구조 설계',
    tags: ['업무 자동화', '데이터 관리'],
    comment: '관리가 훨씬 수월해졌습니다.',
  },
]

const homeFaqs = [
  {
    q: '정책자금 승인이나 인증 취득을 보장하나요?',
    a: '아니요. 승인·선정·취득은 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략, 준비 방향, 진행 관리를 돕습니다.',
  },
  { q: '어떤 서비스부터 시작해야 할지 모르겠어요.', a: '무료 진단을 신청하시면 기업 상황을 확인하고 어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다.' },
  {
    q: '여러 서비스를 함께 진행할 수 있나요?',
    a: '네. 성장 로드맵 풀패키지로 정책자금·인증·홈페이지·AI 시스템을 하나의 로드맵으로 함께 설계할 수 있습니다.',
  },
  { q: '비용은 어떻게 정해지나요?', a: '상품별 기준 가격이 있으며, 기업 상황과 범위에 따라 달라 상담 후 맞춤 안내드립니다.' },
]

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 서비스몰형 상품 카드 (실제 썸네일 · 카테고리 배지 · 가격 · 핵심 혜택 · CTA)
function ProductCard({ pkg }: { pkg: BusinessPackage }) {
  const b = packageBanner[pkg.id]
  const flagship = pkg.flagship
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-transform duration-200 hover:-translate-y-1 ${
        flagship
          ? 'border-2 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-300/40'
          : 'border border-slate-200 shadow-sm hover:shadow-lg'
      }`}
    >
      {/* 썸네일 (텍스트 오버레이 없음 — 이미지에 문구 포함) */}
      <Link to={`/business-services/${pkg.slug}`} className="relative block aspect-[3/2] bg-slate-100">
        <BusinessServiceVisual type={pkg.visualType} title={b.title} subtitle={b.subtitle} accent={b.accent} tag={pkg.category} imageSrc={pkg.imageSrc} alt={pkg.name} />
        {flagship && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900 shadow-md">
            ★ 대표 상품
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {/* 카테고리 배지 + 하이라이트 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>
            {pkg.category}
          </span>
          {pkg.badge && !flagship && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{pkg.badge}</span>
          )}
        </div>

        {/* 상품명 (크게) */}
        <h3 className="mt-2.5 text-xl font-extrabold leading-snug tracking-tight text-slate-900">{pkg.name}</h3>
        {/* 짧은 설명 */}
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{pkg.short}</p>

        {/* 가격 (크게) */}
        <div className="mt-3.5">
          <p className={`text-2xl font-black tracking-tight ${flagship ? 'text-amber-600' : 'text-slate-900'}`}>{pkg.price}</p>
          {pkg.priceNote && <p className="mt-0.5 text-xs font-medium text-slate-400">{pkg.priceNote}</p>}
        </div>

        {/* 핵심 혜택 2~3개 */}
        <ul className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3.5">
          {pkg.deliverables.slice(0, 3).map((d) => (
            <li key={d} className="flex items-start gap-1.5 text-[0.82rem] leading-snug text-slate-600">
              <span className={`mt-0.5 shrink-0 font-black ${flagship ? 'text-amber-500' : 'text-blue-500'}`} aria-hidden>✓</span>
              <span className="line-clamp-1">{d}</span>
            </li>
          ))}
        </ul>

        {/* 버튼 2개 (상담 신청 / 자세히 보기) */}
        <div className="mt-auto flex gap-2 pt-5">
          <a
            href="#apply"
            className={`flex flex-1 items-center justify-center rounded-xl px-3 py-3 text-base font-bold text-white shadow-sm transition-colors ${
              flagship ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-700'
            }`}
          >
            상담 신청
          </a>
          <Link
            to={`/business-services/${pkg.slug}`}
            className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-3 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            자세히 보기
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function BusinessServicesPage() {
  const [activeCat, setActiveCat] = useState('전체')
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    document.title = '대표님을 위한 경영지원 서비스몰 | 미래 AI 랩'
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
            <button type="button" onClick={() => scrollToId('top3')} className="transition-colors hover:text-slate-900">대표상품</button>
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

      {/* Hero (navy) */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            미래경영지원센터 · 경영지원 서비스몰
          </span>
          <h1 className="mt-4 max-w-3xl text-[1.75rem] font-extrabold leading-[1.25] tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.18]">
            대표님에게 필요한 <span className="text-amber-300">경영지원 서비스</span>를 골라보세요
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-slate-300 sm:text-lg">
            정책자금·고용지원금·기업인증·홈페이지·AI 시스템까지, 기업 상황에 맞는 패키지를 상담 후 제안드립니다.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
            >
              무료 진단 신청하기
            </a>
            <button
              type="button"
              onClick={() => scrollToId('packages')}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10"
            >
              전체 상품 보기
            </button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.78rem] font-medium text-slate-400">
            <span>누적 자금조달 100억+</span>
            <span className="text-slate-600">·</span>
            <span>ISO 인증 심사원</span>
            <span className="text-slate-600">·</span>
            <span>정책자금·인증·홈페이지·AI 실무 경험</span>
          </div>
        </div>
      </section>

      {/* 대표 상품 3개 즉시 노출 */}
      <section id="top3" className="scroll-mt-16 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>대표 상품</p>
          <h2 className={h2Class}>대표님들이 먼저 확인하는 서비스</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg) => (
              <ProductCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 전체 상품 + 카테고리 탭 */}
      <section id="packages" className="scroll-mt-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>전체 상품</p>
          <h2 className={h2Class}>기업 상황에 맞는 서비스를 고르세요</h2>

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
                  className={`rounded-full px-5 py-2.5 text-[0.95rem] font-bold transition-colors ${
                    active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Situation shortcuts */}
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

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((pkg) => (
              <ProductCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            표기된 가격은 기준 가격이며, 기업 상황과 범위에 따라 달라질 수 있어 상담 후 맞춤 안내드립니다.
          </p>
        </div>
      </section>

      {/* 진행사례 (review-style) */}
      <section id="cases" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>진행 사례</p>
          <h2 className={h2Class}>이렇게 정리했습니다</h2>
          <p className="mt-2 text-sm text-slate-500">이해를 돕기 위한 비식별 예시입니다. (실제 업체명이 아닙니다.)</p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
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
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
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
          <div className="mt-7 space-y-3">
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
            © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 경영지원
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
            className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-lg font-bold text-white"
          >
            무료 진단 신청하기
          </a>
        </div>
      )}
    </div>
  )
}
