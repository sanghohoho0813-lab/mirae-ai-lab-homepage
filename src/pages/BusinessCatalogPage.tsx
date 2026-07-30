// 컨설팅 상품 전체 목록 — /business-services/all
// 정책자금 상세페이지의 "우리 회사에 맞는 컨설팅 상품 한눈에 보기" 버튼이 여기로 이동한다.
// 상품 썸네일·가격을 카테고리(상황)별로 한 화면에서 모두 보여주는 서비스몰형 목록이다.
// ⚠️ 가격은 기준가이며 상담 후 확정된다는 고지를 하단에 함께 노출한다.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import ProductCard from '../components/ProductCard'
import ConsultModal from '../components/ConsultModal'
import {
  businessPackages,
  CATEGORIES,
  CATEGORY_NOTES,
  CATEGORY_SCENARIOS,
} from '../data/businessPackages'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'

const DETAIL = '/business-services/funding-consulting'

export default function BusinessCatalogPage() {
  const [activeCat, setActiveCat] = useState('전체')
  const [consult, setConsult] = useState(false)

  useEffect(() => {
    document.title = '컨설팅 상품 전체 | 미래 AI 랩'
  }, [])

  const scenarioCats = CATEGORIES.filter((c) => c !== '전체')
  const groups = (activeCat === '전체' ? scenarioCats : [activeCat])
    .map((cat) => ({
      cat,
      scenario: CATEGORY_SCENARIOS[cat] ?? cat,
      items: businessPackages.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[1.2rem] font-bold tracking-tight text-slate-900 sm:text-[1.42rem]">미래 AI 랩</span>
              <span className="hidden break-keep text-[1.3rem] font-medium text-slate-500 sm:block">
                Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b>
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <Link
              to={DETAIL}
              className="hidden text-[1.42rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline"
            >
              정책자금 × AX
            </Link>
            <Link
              to="/business-diagnosis"
              className="whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-[1.2rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 sm:px-4 sm:text-[1.42rem]"
            >
              3분 기업진단
            </Link>
            <HeaderAccount />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-2.5 text-[1.1rem] text-slate-500 sm:px-6 sm:text-[1.3rem]">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <Link to={DETAIL} className="font-medium hover:text-slate-900">정책자금 × AX</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">컨설팅 상품 전체</span>
        </div>
      </div>

      <section className="px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-[1.1rem] font-black tracking-tight text-blue-600 sm:text-[1.3rem]">컨설팅 상품 전체</p>
          <h1 className="mt-2 break-keep text-[1.65rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[2.6rem]">
            지금 진행 가능한 컨설팅을<br className="sm:hidden" /> 한 화면에서 확인하세요.
          </h1>
          <p className="mt-4 max-w-3xl break-keep text-[1.2rem] leading-relaxed text-slate-600 sm:text-[1.43rem]">
            모두 진행해야 하는 것이 아닙니다. 3분 기업진단으로 지금 회사에 필요한 순서를 먼저 정하고, 그 순서대로 하나씩 준비하시면 됩니다.
          </p>

          {/* 카테고리(상황) 탭 */}
          <div className="mt-7 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  aria-pressed={active}
                  className={`min-h-[46px] break-keep rounded-full px-4 text-[1.13rem] font-bold transition-colors sm:px-5 sm:text-[1.3rem] ${
                    active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === '전체' ? '전체' : (CATEGORY_SCENARIOS[cat] ?? cat)}
                </button>
              )
            })}
          </div>

          {/* 상황별 그룹 + 상품 카드 */}
          <div className="mt-9 space-y-11">
            {groups.map((g, gi) => (
              <div key={g.cat}>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[1.3rem] font-black tabular-nums text-blue-600 sm:text-[1.6rem]">
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                  <h2 className="break-keep text-[1.43rem] font-black tracking-tight text-slate-900 sm:text-[1.95rem]">{g.scenario}</h2>
                </div>
                {CATEGORY_NOTES[g.cat] && (
                  <p className="mt-1.5 flex items-start gap-1.5 break-keep text-[1.1rem] font-semibold leading-snug text-slate-500 sm:text-[1.3rem]">
                    <span aria-hidden className="mt-0.5 shrink-0 text-blue-500">✓</span>
                    {CATEGORY_NOTES[g.cat]}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                  {g.items.map((pkg) => (
                    <ProductCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 break-keep text-[1.1rem] leading-relaxed text-slate-500 sm:text-[1.3rem]">
            표기된 가격은 기준 가격입니다. 기업 상황과 진행 범위에 따라 달라질 수 있어 상담에서 확정합니다. 특허·세무·노무·법률처럼 자격이 필요한 업무는 해당 자격 전문가와 함께 진행합니다.
          </p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            <Link
              to="/business-diagnosis"
              className="flex min-h-[56px] flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-[1.26rem] font-black text-white transition-transform hover:-translate-y-0.5 sm:text-[1.495rem]"
            >
              🩺 3분 기업진단으로 순서 정하기
            </Link>
            <button
              type="button"
              onClick={() => setConsult(true)}
              className="flex min-h-[56px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-[1.26rem] font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:text-[1.495rem]"
            >
              상담 신청
            </button>
            <Link
              to={DETAIL}
              className="flex min-h-[56px] flex-1 items-center justify-center break-keep rounded-xl border border-slate-300 bg-white px-6 text-center text-[1.26rem] font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:text-[1.495rem]"
            >
              정책자금 × AX 서비스 보기
            </Link>
          </div>
        </div>
      </section>

      <LegalFooter
        topSlot={
          <Link to={DETAIL} className="text-[0.96rem] font-semibold text-slate-500 transition-colors hover:text-slate-900 sm:text-sm">
            ← 정책자금 × AX 상세로
          </Link>
        }
      />

      <KakaoFloat />

      <ConsultModal
        open={consult}
        onClose={() => setConsult(false)}
        source="컨설팅 상품 전체"
        heading="상담 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
      />
    </div>
  )
}
