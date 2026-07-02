import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BusinessServiceVisual from '../components/BusinessServiceVisual'
import BusinessInquiryForm from '../components/BusinessInquiryForm'
import {
  badgeToneClass,
  businessPackages,
  COST_NOTE,
  DISCLAIMER,
  getPackageBySlug,
  PROCEDURE,
} from '../data/businessPackages'

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'

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

  const others = businessPackages.filter((p) => p.id !== pkg.id).slice(0, 3)

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
          <Link to="/business-services" className="font-medium hover:text-slate-900">
            서비스몰
          </Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.name}</span>
        </div>
      </div>

      {/* Top product area */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Visual */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm ring-1 ring-slate-900/5">
            <div className="aspect-[4/3]">
              <BusinessServiceVisual type={pkg.visualType} imageSrc={pkg.imageSrc} alt={pkg.name} />
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badgeToneClass[pkg.badgeTone]}`}>{pkg.badge}</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{pkg.category}</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{pkg.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{pkg.tagline}</p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">이런 대표님께 추천</p>
              <ul className="mt-2 space-y-1.5">
                {pkg.recommendedFor.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-slate-400" aria-hidden>·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm font-semibold text-slate-500">비용 안내</span>
              <span className="text-sm font-bold text-slate-900">{COST_NOTE}</span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToId('detail-apply')}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-slate-700"
              >
                이 패키지 상담 신청하기
              </button>
              <Link
                to="/business-services"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-800 transition-colors hover:bg-slate-50"
              >
                다른 패키지 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>상품 요약</p>
          <h2 className={h2Class}>이 패키지가 해주는 일</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">제공 결과물</p>
              <ul className="mt-2 space-y-1.5">
                {pkg.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-blue-500" aria-hidden>✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">진행 방식 · 예상 소요</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{pkg.process}</p>
              <p className="mt-1.5 text-sm text-slate-500">상담 후 범위와 일정을 함께 정합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed description */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <p className={eyebrow}>상세 설명</p>
        <h2 className={h2Class}>왜 이 패키지가 필요할까요</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-900">필요한 이유</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.why}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-900">진행 후 기대되는 변화</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.expectation}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
            <p className="text-sm font-bold text-slate-900">실제로 나오는 결과물</p>
            <ul className="mt-2 space-y-1.5">
              {pkg.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 text-blue-500" aria-hidden>✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Procedure */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>진행 절차</p>
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
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-6 sm:pt-12">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{DISCLAIMER}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <p className={eyebrow}>자주 묻는 질문</p>
        <h2 className={h2Class}>이 패키지에 대해</h2>
        <div className="mt-6 space-y-3">
          {pkg.faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-base font-bold text-slate-900">Q. {f.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consult CTA + form */}
      <section id="detail-apply" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className={eyebrow}>상담 신청</p>
            <h2 className={h2Class}>{pkg.name} 상담 신청하기</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              간단히 남겨주시면 이 패키지 기준으로 어떤 준비부터 시작하면 좋을지 안내드립니다.
            </p>
          </div>
          <div className="mt-6">
            <BusinessInquiryForm />
          </div>

          {/* Other packages */}
          <div className="mt-10">
            <p className="text-sm font-bold text-slate-700">다른 패키지도 살펴보세요</p>
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
            © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 AI 경영지원
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
          className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white"
        >
          이 패키지 상담 신청하기
        </button>
      </div>
    </div>
  )
}
