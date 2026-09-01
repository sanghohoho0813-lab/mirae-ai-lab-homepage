// 법적 문서 공용 레이아웃 — 이용약관/개인정보/환불정책/사업자정보가 공유합니다.
// 문서형 레이아웃(카드 반복 X) · 흰 배경 · 본문 가독성(모바일 15px+) · 인쇄 친화 · 직접 URL/새로고침 안전.
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { businessInfo, legalLinks } from '../../config/businessInfo'
import LegalFooter from '../LegalFooter'
import BrandLogo from '../BrandLogo'

export type LegalSection = {
  id: string
  /** 목차·제목에 쓰는 조 제목 (번호는 자동 부여) */
  heading: string
  body: React.ReactNode
}

export default function LegalPageLayout({
  docTitle,
  intro,
  effectiveDate = businessInfo.legalEffectiveDate,
  lastUpdated = businessInfo.legalLastUpdated,
  sections,
  numbered = true,
  children,
}: {
  docTitle: string
  intro?: React.ReactNode
  effectiveDate?: string
  lastUpdated?: string
  sections?: LegalSection[]
  /** 목차·제목에 '제N조/N.' 번호를 붙일지 */
  numbered?: boolean
  children?: React.ReactNode
}) {
  const location = useLocation()

  useEffect(() => {
    document.title = `${docTitle} | ${businessInfo.serviceName}`
    window.scrollTo(0, 0)
  }, [docTitle])

  // 직접 URL 로 #anchor 진입 시 해당 조로 스크롤
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const others = legalLinks.filter((l) => l.to !== location.pathname)

  return (
    <div className="min-h-dvh bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header — 로고 클릭 시 홈(/) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-5 py-3">
          <BrandLogo to="/" tagline="약관 및 정책" imgClassName="h-9 max-w-[168px] sm:h-10 sm:max-w-[190px]" />
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            인쇄 · PDF 저장
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[960px] px-5 py-10 sm:py-14">
        {/* 문서 제목 + 시행일 */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-[1.7rem] font-black tracking-tight text-slate-900 sm:text-[2.1rem]">{docTitle}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
            <span>시행일: {effectiveDate}</span>
            <span>최종 개정일: {lastUpdated}</span>
          </div>
          {intro && <div className="mt-5 text-[0.98rem] leading-relaxed text-slate-700">{intro}</div>}
        </div>

        {/* 목차 */}
        {sections && sections.length > 0 && (
          <nav aria-label="목차" className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 print:break-inside-avoid">
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">목차</p>
            <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-[0.95rem] leading-snug text-slate-700 underline-offset-2 hover:text-blue-700 hover:underline">
                    {numbered && <span className="font-semibold text-slate-400">{i + 1}. </span>}
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* 본문 */}
        {sections && sections.length > 0 && (
          <div className="mt-10 space-y-9">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-20 print:break-inside-avoid">
                <h2 className="text-[1.15rem] font-bold tracking-tight text-slate-900 sm:text-[1.3rem]">
                  {numbered && <span className="text-slate-400">{i + 1}. </span>}
                  {s.heading}
                </h2>
                <div className="mt-3 text-[0.98rem] leading-[1.75] text-slate-700 [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        )}

        {children}

        {/* 다른 정책 크로스링크 */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 print:hidden">
          <p className="text-sm font-bold text-slate-700">함께 확인하세요</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-700"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 print:hidden">
          <Link to="/" className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </main>

      <div className="print:hidden">
        <LegalFooter />
      </div>
    </div>
  )
}

/** 본문 공용 — 리스트 */
export function LegalList({ items, ordered = false }: { items: React.ReactNode[]; ordered?: boolean }) {
  const cls = 'mt-2 space-y-1.5 pl-5'
  if (ordered) {
    return (
      <ol className={`list-decimal ${cls}`}>
        {items.map((it, i) => (
          <li key={i} className="leading-[1.7]">{it}</li>
        ))}
      </ol>
    )
  }
  return (
    <ul className={`list-disc ${cls}`}>
      {items.map((it, i) => (
        <li key={i} className="leading-[1.7]">{it}</li>
      ))}
    </ul>
  )
}

/** 본문 공용 — 표 (개인정보 처리위탁·수집항목 등) */
export function LegalTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-[0.92rem]">
        <thead>
          <tr className="bg-slate-100 text-left">
            {head.map((h) => (
              <th key={h} className="border border-slate-200 px-3 py-2 font-bold text-slate-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => (
                <td key={j} className="border border-slate-200 px-3 py-2 leading-relaxed text-slate-700">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
