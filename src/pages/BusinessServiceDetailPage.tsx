import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BusinessServiceVisual from '../components/BusinessServiceVisual'
import BusinessInquiryForm from '../components/BusinessInquiryForm'
import {
  businessPackages,
  categoryToneClass,
  DISCLAIMER,
  getPackageBySlug,
  packageBanner,
  PERIOD_NOTE,
  PROCEDURE,
} from '../data/businessPackages'

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl'

const TABS = [
  { id: 'detail', label: '상품상세' },
  { id: 'results', label: '제공결과물' },
  { id: 'procedure', label: '진행절차' },
  { id: 'faq', label: 'FAQ' },
  { id: 'notice', label: '유의사항' },
]

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BusinessServiceDetailPage() {
  const { slug } = useParams()
  const pkg = getPackageBySlug(slug)

  useEffect(() => {
    if (pkg) document.title = `${pkg.name} | 미래 AI 랩 서비스몰`
    window.scrollTo(0, 0)
  }, [pkg])

  if (!pkg) return <Navigate to="/business-services" replace />

  const b = packageBanner[pkg.id]
  const flagship = pkg.flagship
  const others = businessPackages.filter((p) => p.id !== pkg.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
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
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              서비스몰 홈
            </Link>
            <a
              href="#detail-apply"
              className="hidden rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 sm:inline-flex"
            >
              상담 신청
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.category}</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.name}</span>
        </div>
      </div>

      {/* Top: product image + buy box */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          {/* Thumbnail image */}
          <div className={`overflow-hidden rounded-3xl shadow-sm ${flagship ? 'border-2 border-amber-400 ring-1 ring-amber-300/40' : 'border border-slate-200 ring-1 ring-slate-900/5'}`}>
            <div className="relative aspect-[3/2]">
              <BusinessServiceVisual type={pkg.visualType} title={b.title} subtitle={b.subtitle} accent={b.accent} tag={pkg.category} imageSrc={pkg.imageSrc} alt={pkg.name} size="hero" fit="contain" />
            </div>
          </div>

          {/* Buy box */}
          <div className={`rounded-3xl bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-24 ${flagship ? 'border-2 border-amber-400' : 'border border-slate-200'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.category}</span>
              {flagship ? (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">★ 대표 상품</span>
              ) : (
                pkg.badge && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{pkg.badge}</span>
              )}
            </div>
            <h1 className="mt-3 text-[1.7rem] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{pkg.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{pkg.tagline}</p>

            {/* Price */}
            <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-inset ring-slate-100">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">가격</p>
              <p className={`mt-1 text-3xl font-black tracking-tight sm:text-4xl ${flagship ? 'text-amber-600' : 'text-slate-900'}`}>{pkg.price}</p>
              {pkg.priceNote && <p className="mt-1 text-sm font-medium text-slate-500">{pkg.priceNote}</p>}
            </div>

            {/* 핵심 혜택 (썸네일 하단 밴드에 있던 문구를 텍스트로 노출) */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">핵심 혜택</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pkg.highlights.map((h) => (
                  <span
                    key={h}
                    className={`rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${
                      flagship ? 'bg-amber-50 text-amber-700 ring-amber-500/20' : 'bg-blue-50 text-blue-700 ring-blue-600/15'
                    }`}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {pkg.highlightNote && <p className="mt-2 text-sm font-medium text-slate-500">{pkg.highlightNote}</p>}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">이런 대표님께 추천</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pkg.recommendedFor.map((r) => (
                  <span key={r} className="rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">제공 결과물</p>
              <ul className="mt-2 space-y-1.5">
                {pkg.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-[0.95rem] text-slate-700">
                    <span className={`mt-0.5 font-black ${flagship ? 'text-amber-500' : 'text-blue-500'}`} aria-hidden>✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-5 space-y-2 rounded-2xl bg-slate-50 px-4 py-3.5 ring-1 ring-inset ring-slate-100">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-semibold text-slate-500">진행기간</dt>
                <dd className="text-sm font-bold text-slate-900">{PERIOD_NOTE}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/70 pt-2">
                <dt className="text-sm font-semibold text-slate-500">진행 방식</dt>
                <dd className="text-sm font-bold text-slate-900">상담 신청 후 안내</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => scrollToId('detail-apply')}
              className={`mt-4 flex w-full items-center justify-center rounded-xl px-6 py-4 text-lg font-bold text-white shadow-sm transition-colors ${
                flagship ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-700'
              }`}
            >
              이 서비스 상담 신청하기
            </button>
            <Link
              to="/business-services"
              className="mt-2.5 flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              다른 상품 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky tab nav */}
      <div className="sticky top-[3.4rem] z-20 border-y border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToId(t.id)}
              className="shrink-0 border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상품상세 */}
      <section id="detail" className="scroll-mt-28 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>상품상세</p>
          <h2 className={h2Class}>왜 이 서비스가 필요할까요</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">필요한 이유</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.why}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
              <p className="text-sm font-bold text-slate-900">진행 후 기대되는 변화</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{pkg.expectation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 제공결과물 */}
      <section id="results" className="scroll-mt-28 border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>제공결과물</p>
          <h2 className={h2Class}>실제로 이런 결과물이 나옵니다</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pkg.deliverables.map((d, i) => (
              <div key={d} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-sm font-extrabold text-blue-600">{`0${i + 1}`}</span>
                <p className="mt-2 text-base font-bold text-slate-900">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진행절차 */}
      <section id="procedure" className="scroll-mt-28 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>진행절차</p>
          <h2 className={h2Class}>이렇게 진행됩니다</h2>
          <div className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {PROCEDURE.map((step, i) => (
              <span key={step} className="inline-flex items-center gap-1.5">
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <span className="mr-1.5 text-xs font-extrabold text-blue-600">{`0${i + 1}`}</span>
                  {step}
                </span>
                {i < PROCEDURE.length - 1 && <span aria-hidden className="text-slate-300">→</span>}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">상담 후 범위와 일정을 함께 정합니다.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>FAQ</p>
          <h2 className={h2Class}>이 서비스에 대해</h2>
          <div className="mt-6 space-y-3">
            {pkg.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-base font-bold text-slate-900">Q. {f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 유의사항 */}
      <section id="notice" className="scroll-mt-28">
        <div className="mx-auto max-w-6xl px-5 pt-11 sm:px-6 sm:pt-14">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{pkg.notice ?? DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* Consult CTA + form */}
      <section id="detail-apply" className="scroll-mt-28 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className={eyebrow}>상담 신청</p>
            <h2 className={h2Class}>{pkg.name} 상담 신청하기</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              간단히 남겨주시면 이 서비스 기준으로 어떤 준비부터 시작하면 좋을지 안내드립니다.
            </p>
          </div>
          <div className="mt-6">
            <BusinessInquiryForm />
          </div>

          <div className="mt-10">
            <p className="text-sm font-bold text-slate-700">다른 상품도 살펴보세요</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to={`/business-services/${o.slug}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  {o.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 경영지원
          </p>
          <Link to="/business-services" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            ← 서비스몰 홈으로
          </Link>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <button
          type="button"
          onClick={() => scrollToId('detail-apply')}
          className={`flex w-full items-center justify-center rounded-xl px-6 py-4 text-lg font-bold text-white ${
            flagship ? 'bg-amber-500' : 'bg-slate-900'
          }`}
        >
          이 서비스 상담 신청하기
        </button>
      </div>
    </div>
  )
}
