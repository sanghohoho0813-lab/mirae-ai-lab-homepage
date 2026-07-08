// 정책자금 컨설팅 — 전용 프리미엄 상세페이지.
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 데이터 일부(가격/FAQ/결과물/유의사항)는 businessPackages 와 동기화, 세일즈 카피는 이 파일 전용.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../../components/BusinessInquiryForm'
import { getPackageBySlug } from '../../data/businessPackages'

const pkg = getPackageBySlug('funding-consulting')!
const IMG = '/assets/business-services/funding-consulting.png'

// 할인 표기 (정가 100만원 → 판매가 50만원)
const LIST_PRICE = '100만원'
const SALE_PRICE = pkg.price // '50만원'
const DISCOUNT_RATE = '50%'

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2 = 'mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const stats = [
  { value: '100억+', label: '누적 자금조달 실무 경험' },
  { value: '운전·시설', label: '자금 유형별 방향 진단' },
  { value: 'ISO 심사원', label: '기업지원 실무 전문' },
]

const pains = [
  { t: '운전자금이 급한데', d: '어디서, 어떤 자금부터 알아봐야 할지 막막합니다.' },
  { t: '대출 금리가 부담', d: '조금이라도 유리한 조건이 있는지 확인하고 싶습니다.' },
  { t: '종류가 너무 많다', d: '정책자금 제도가 복잡해 무엇이 우리에게 맞는지 모르겠습니다.' },
  { t: '서류·자격이 복잡', d: '요건과 준비서류가 까다로워 시작이 어렵습니다.' },
]

const fundTypes = [
  {
    tag: '운전자금',
    title: '사업 운영에 필요한 자금',
    desc: '인건비·재료비·임대료 등 회사를 돌리는 데 필요한 자금 방향을 진단합니다.',
    points: ['업종·업력·재무 기준 검토', '우선 확인할 제도 정리', '신청 전 준비서류 안내'],
  },
  {
    tag: '시설자금',
    title: '설비·시설 투자 자금',
    desc: '설비 도입·공장·사무실 등 시설 투자에 활용 가능한 방향을 함께 검토합니다.',
    points: ['투자 계획 기준 방향 진단', '검토 가능한 제도 우선순위', '신청 전략·서류 준비 안내'],
  },
]

const whyPoints = [
  { t: '시행착오를 줄입니다', d: '무턱대고 여러 곳을 알아보기 전에, 검토 가능한 방향을 먼저 좁혀 준비 시간을 아낍니다.' },
  { t: '우선순위가 생깁니다', d: '지금 우리 회사가 먼저 확인할 자금과 순서를 정리해 드립니다.' },
  { t: '준비가 명확해집니다', d: '신청 전략과 준비서류를 안내받아 다음에 무엇을 해야 할지 또렷해집니다.' },
]

const steps = [
  { t: '상담 신청', d: '간단한 정보를 남기면 담당자가 연락드립니다.' },
  { t: '기업 현황 진단', d: '업종·업력·재무 상황을 함께 확인합니다.' },
  { t: '자금 방향 정리', d: '검토 가능한 자금과 우선순위를 정리합니다.' },
  { t: '신청 전략·서류 안내', d: '신청 전략과 준비서류를 안내드립니다.' },
  { t: '이후 진행 협의', d: '실제 진행 여부·범위는 상담에서 함께 정합니다.' },
]

const cases = [
  {
    tag: '운전자금',
    before: '어떤 자금부터 볼지 막막',
    after: '가능성 진단 후 우선 검토 자금 방향 정리',
    comment: '무엇부터 준비할지 정리됐습니다.',
  },
  {
    tag: '시설자금',
    before: '설비 투자 자금 계획이 불분명',
    after: '투자 계획 기준 검토 방향·준비서류 안내',
    comment: '준비 순서가 명확해졌습니다.',
  },
  {
    tag: '준비 전략',
    before: '요건·서류가 복잡해 시작이 어려움',
    after: '신청 전략과 준비서류 체크 안내',
    comment: '시작할 수 있게 됐습니다.',
  },
]

export default function FundingConsultingDetailPage() {
  const [showBar, setShowBar] = useState(false)
  const [payNotice, setPayNotice] = useState(false)

  // 결제(포트원)는 연동 예정 → 지금은 상담 신청으로 브릿지
  function handleBuy() {
    setPayNotice(true)
    scrollToId('apply')
  }

  useEffect(() => {
    document.title = '정책자금 컨설팅 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 520)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              서비스몰 홈
            </Link>
            <button
              type="button"
              onClick={() => scrollToId('apply')}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
            >
              상담 신청
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">자금·지원금</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">정책자금 컨설팅</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              자금·지원금 · 정책자금 컨설팅
            </span>
            <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[2.9rem]">
              필요한 자금, 어디서부터 봐야 할지<br />
              <span className="text-amber-300">먼저 진단</span>해 드립니다
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              운전자금·시설자금 <b className="font-semibold text-white">가능성 진단</b>부터 신청 전략·준비서류까지,
              대표님 상황에 맞는 방향을 정리해 드립니다.
            </p>

            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-400 px-2 py-0.5 text-sm font-black text-slate-900">{DISCOUNT_RATE} 할인</span>
                <span className="text-sm font-medium text-slate-400 line-through">정가 {LIST_PRICE}</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">{SALE_PRICE}</span>
                <span className="text-sm font-medium text-slate-300">가능성 진단 · 신청 전략</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-200">
                <span aria-hidden>💳</span> 카드 무이자 할부 가능
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBuy}
                className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
              >
                바로 구매하기
              </button>
              <button
                type="button"
                onClick={handleBuy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                장바구니
              </button>
            </div>
            <button
              type="button"
              onClick={() => scrollToId('apply')}
              className="mt-3 text-sm font-semibold text-slate-300 underline underline-offset-4 transition-colors hover:text-white"
            >
              또는 무료 상담 신청하기 →
            </button>
            <p className="mt-4 text-xs font-medium text-slate-400">
              ※ 정책자금 승인·금리·한도는 보장하지 않습니다. 가능성 진단과 신청 전략을 돕습니다.
            </p>
          </div>

          {/* Hero image card */}
          <div className="w-full">
            <div className="ml-auto max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <div className="relative aspect-[3/2] w-full bg-slate-800">
                <img src={IMG} alt="정책자금 컨설팅" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 py-8 sm:grid-cols-3 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-center">
              <p className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>이런 고민 있으신가요</p>
          <h2 className={h2}>정책자금, 시작이 제일 막막합니다</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pains.map((p) => (
              <div key={p.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg font-black text-blue-600">?</span>
                <p className="mt-3 text-lg font-bold text-slate-900">“{p.t}”</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base font-semibold text-slate-700">
            → 무턱대고 알아보기 전에, <span className="text-blue-600">검토 가능한 방향부터 진단</span>하는 게 먼저입니다.
          </p>
        </div>
      </section>

      {/* Fund types */}
      <section className="scroll-mt-16 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>무엇을 검토하나</p>
          <h2 className={h2}>정책자금, 이런 자금을 진단합니다</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {fundTypes.map((f) => (
              <div key={f.tag} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">{f.tag}</span>
                <p className="mt-3 text-xl font-extrabold text-slate-900">{f.title}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{f.desc}</p>
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {f.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 font-black text-blue-500" aria-hidden>✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>왜 진단부터</p>
          <h2 className={h2}>진단부터 시작하면 달라집니다</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {whyPoints.map((w, i) => (
              <div key={w.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-black text-blue-600">{`0${i + 1}`}</span>
                <p className="mt-2 text-lg font-bold text-slate-900">{w.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{w.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-6">
            <p className="text-base font-bold text-slate-900">진행 후 기대되는 변화</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{pkg.expectation}</p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="flow" className="scroll-mt-16 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>진행 과정</p>
          <h2 className={h2}>진단은 이렇게 진행됩니다</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-black text-white">{i + 1}</span>
                <p className="mt-3 text-base font-bold text-slate-900">{s.t}</p>
                <p className="mt-1 text-[0.82rem] leading-snug text-slate-500">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">실제 진행 여부와 범위는 상담에서 함께 정합니다.</p>
        </div>
      </section>

      {/* Deliverables */}
      <section className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>제공 결과물</p>
          <h2 className={h2}>이런 결과물을 받아보세요</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {pkg.deliverables.map((d, i) => (
              <div key={d} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="text-2xl font-black text-blue-600">{`0${i + 1}`}</span>
                <p className="mt-3 text-lg font-extrabold text-slate-900">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {pkg.highlights.map((hi) => (
              <span key={hi} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">{hi}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended + Price offer */}
      <section className="scroll-mt-16 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <p className={eyebrow}>추천 대상</p>
            <h2 className={h2}>이런 대표님께 추천합니다</h2>
            <ul className="mt-6 space-y-3">
              {pkg.recommendedFor.map((r) => (
                <li key={r} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-[0.98rem] font-medium text-slate-700 shadow-sm">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-black text-white" aria-hidden>✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Price card */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="rounded-3xl border-2 border-slate-900 bg-white p-7 shadow-xl">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/15">정책자금 컨설팅</span>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-black text-slate-900">{DISCOUNT_RATE} 할인</span>
                <span className="text-sm font-medium text-slate-400 line-through">정가 {LIST_PRICE}</span>
              </div>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight text-slate-900">{SALE_PRICE}</span>
                <span className="pb-1 text-sm font-medium text-slate-500">가능성 진단 패키지</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <span aria-hidden>💳</span> 카드 무이자 할부 가능
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                {pkg.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 font-black text-blue-500" aria-hidden>✓</span>
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={handleBuy}
                  className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-5 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-slate-700"
                >
                  바로 구매
                </button>
                <button
                  type="button"
                  onClick={handleBuy}
                  aria-label="장바구니"
                  className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => scrollToId('apply')}
                className="mt-2.5 w-full text-sm font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-900"
              >
                또는 무료 상담 신청
              </button>
              <Link
                to="/business-services"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                다른 상품 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>진행 사례</p>
          <h2 className={h2}>이렇게 정리했습니다</h2>
          <p className="mt-2 text-sm text-slate-500">이해를 돕기 위한 비식별 예시입니다. (실제 업체명이 아닙니다.)</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cases.map((c) => (
              <article key={c.tag} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{c.tag}</span>
                <div className="mt-3 flex items-stretch gap-2">
                  <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] font-bold text-slate-400">기존</p>
                    <p className="mt-1 text-xs font-semibold leading-snug text-slate-600">{c.before}</p>
                  </div>
                  <div className="flex items-center text-slate-300" aria-hidden>→</div>
                  <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50/60 p-3">
                    <p className="text-[11px] font-bold text-blue-500">정리 후</p>
                    <p className="mt-1 text-xs font-bold leading-snug text-slate-900">{c.after}</p>
                  </div>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">“{c.comment}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2}>정책자금 컨설팅 FAQ</h2>
          <div className="mt-8 space-y-3">
            {pkg.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-base font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="scroll-mt-16">
        <div className="mx-auto max-w-3xl px-5 pt-12 sm:px-6 sm:pt-16">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{pkg.notice}</p>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="scroll-mt-16">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className={eyebrow}>무료 진단 신청</p>
            <h2 className={h2}>먼저, 대표님 상황부터 진단해보세요</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              간단히 남겨주시면 어떤 자금부터 검토하면 좋을지 방향을 정리해 안내드립니다.
            </p>
          </div>
          {payNotice && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
              🛒 온라인 카드결제(무이자 할부 포함)는 <b>곧 오픈</b>됩니다. 지금은 아래 <b>상담 신청</b>으로 접수해 주시면
              결제·진행을 함께 안내드릴게요.
            </div>
          )}
          <div className="mt-8">
            <BusinessInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 경영지원</p>
          <Link to="/business-services" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            ← 서비스몰 홈으로
          </Link>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <span className="flex shrink-0 items-baseline gap-1">
            <span className="text-xs font-medium text-slate-400 line-through">{LIST_PRICE}</span>
            <span className="text-lg font-black text-slate-900">{SALE_PRICE}</span>
          </span>
          <button
            type="button"
            onClick={handleBuy}
            className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white"
          >
            바로 구매하기
          </button>
        </div>
      )}
    </div>
  )
}
