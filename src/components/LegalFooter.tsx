// 공개 페이지 공용 푸터 — 사업자 정보 + 법적 문서 링크를 한 곳에서 관리합니다.
// 관리자/내부 앱 화면에는 강제로 넣지 않습니다(공개 페이지 전용).
// 크지 않게(정보 위주) · 로고 클릭 시 '/' 이동 · 링크는 실제 라우트만.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { businessInfo, legalLinks } from '../config/businessInfo'

export default function LegalFooter({
  tone = 'light',
  topSlot,
}: {
  /** light: 흰 배경(기본) / dark: 네이비 배경(다크 히어로 페이지와 이어질 때) */
  tone?: 'light' | 'dark'
  /** 사업자 정보 위에 표시할 페이지별 내용(예: 브랜드 소개·섹션 링크) */
  topSlot?: ReactNode
}) {
  const dark = tone === 'dark'
  const b = businessInfo
  const year = new Date().getFullYear()

  const infoRows: string[] = [
    `상호 ${b.companyName} (${b.brandName})`,
    `대표자 ${b.representative}`,
    `사업자등록번호 ${b.businessNumber}`,
  ]
  if (b.mailOrderSalesNumber) infoRows.push(`통신판매업 신고 ${b.mailOrderSalesNumber}`)

  return (
    <footer
      className={`border-t ${dark ? 'border-white/10 bg-slate-950 text-slate-300' : 'border-slate-200 bg-white text-slate-600'} [word-break:keep-all]`}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        {topSlot && <div className="mb-8">{topSlot}</div>}

        {/* 브랜드 + 법적 링크 */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-black tracking-tight ${dark ? 'bg-white/10 text-sky-300' : 'bg-slate-900 text-sky-400'}`}>
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className={`text-[0.95rem] font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{b.serviceName}</span>
              <span className={`text-[0.82rem] font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{b.serviceNameEn} · <b className={`font-bold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>미래경영지원센터</b></span>
            </span>
          </Link>

          <nav aria-label="약관 및 정책" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
            {legalLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`transition-colors ${dark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 사업자 정보 */}
        <div className={`mt-6 border-t pt-5 text-sm leading-relaxed ${dark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {infoRows.map((row) => (
              <span key={row}>{row}</span>
            ))}
          </div>
          <p className="mt-1">주소 {b.address}</p>
          <p className="mt-1">
            업태 {b.businessCategory} · 종목 {b.businessItem}
          </p>
          <p className="mt-1">
            고객 문의{' '}
            <a href={`mailto:${b.contactEmail}`} className={`font-medium underline underline-offset-2 ${dark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}>
              {b.contactEmail}
            </a>
            {b.contactPhone && <span> · 전화 {b.contactPhone}</span>}
          </p>
        </div>

        <div className={`mt-5 flex flex-col gap-1 text-[0.82rem] ${dark ? 'text-slate-500' : 'text-slate-400'} sm:flex-row sm:items-center sm:justify-between`}>
          <p>© {year} {b.companyName}. All rights reserved.</p>
          <p>정책자금·정부지원·기업인증·세금 관련 결과는 기관 심사 등에 따라 달라질 수 있으며 특정 결과를 보장하지 않습니다.</p>
        </div>
      </div>
    </footer>
  )
}
