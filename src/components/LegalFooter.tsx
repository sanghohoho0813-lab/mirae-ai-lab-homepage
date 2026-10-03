// 공개 페이지 공용 푸터 — 사업자 정보 + 법적 문서 링크를 한 곳에서 관리합니다.
// 관리자/내부 앱 화면에는 강제로 넣지 않습니다(공개 페이지 전용).
// 회사 소개 · 서비스 · 정책 · 문의를 열로 나눈 기업 사이트형 푸터. 링크는 실제 라우트만.
// dark(먹색) = 대표님용 페이지(어두운 마무리와 이어진다) / light(아이보리) = 법적 문서·컨설턴트 페이지 등.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { businessInfo, consultLinks, legalLinks } from '../config/businessInfo'

const serviceLinks = [
  { to: '/business-services/venture-mvp', label: '2주 기술사업 빌드' },
  { to: '/business-services/ax-start', label: 'Full AX 구축' },
  { to: '/business-diagnosis', label: '3분 AX Fit 진단' },
  { to: '/consultants', label: '컨설턴트 운영 OS' },
] as const

export default function LegalFooter({
  tone = 'light',
  topSlot,
}: {
  /** light: 아이보리 배경(기본) / dark: 먹색 배경(어두운 마무리 구간과 이어질 때) */
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

  const head = `text-[0.78rem] font-bold tracking-[0.18em] ${dark ? 'text-[#D8A871]' : 'text-[#8B5A2B]'}`
  const link = `inline-flex min-h-10 items-center text-[0.98rem] font-medium transition-colors sm:min-h-9 sm:text-[0.94rem] ${
    dark ? 'text-slate-300 hover:text-white' : 'text-[#343B44] hover:text-[#0E1116]'
  }`

  return (
    <footer
      className={`relative border-t [word-break:keep-all] ${dark ? 'border-white/10 bg-[#0B0E12] text-slate-400' : 'border-[#E7E1D8] bg-[#F7F4EF] text-[#646E78]'}`}
    >
      <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${dark ? 'via-[#D8A871]/45' : 'via-[#C99257]/35'} to-transparent`} />
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-12 sm:pt-14">
        {topSlot && <div className={`mb-10 border-b pb-8 ${dark ? 'border-white/10' : 'border-[#E7E1D8]'}`}>{topSlot}</div>}

        <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          {/* 회사 — 폰은 한 줄 전체, 서비스·정책은 두 열로 나란히 */}
          <div className="col-span-2 max-w-sm lg:col-span-1">
            <BrandLogo to="/" tone={dark ? 'dark' : 'light'} imgClassName="h-9 max-w-[168px] sm:h-10 sm:max-w-[190px]" />
            <p className={`mt-5 text-[0.98rem] leading-relaxed sm:text-[0.94rem] ${dark ? 'text-slate-400' : 'text-[#646E78]'}`}>
              9년 차 경영컨설턴트가 설계하는 <span className={dark ? 'text-slate-200' : 'text-[#171B20]'}>50인 미만 중소기업 AX</span>와
              컨설턴트를 위한 운영 OS를 만듭니다.
            </p>
          </div>

          {/* 서비스 */}
          <nav aria-label="서비스">
            <p className={head}>SERVICES</p>
            <ul className="mt-3 grid">
              {serviceLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 약관·정책 — 링크마다 세로 40px 이상 탭 영역 */}
          <nav aria-label="약관 및 정책">
            <p className={head}>POLICY</p>
            <ul className="mt-3 grid">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 문의 */}
          <div className="col-span-2 lg:col-span-1">
            <p className={head}>CONTACT</p>
            <ul className="mt-3 grid">
              <li>
                <a href={`mailto:${b.contactEmail}`} className={`${link} break-all`}>
                  {b.contactEmail}
                </a>
              </li>
              {b.contactPhone && <li className="py-2 text-[0.94rem]">전화 {b.contactPhone}</li>}
              <li>
                <a href={consultLinks.kakaoChat} target="_blank" rel="noopener noreferrer" className={link}>
                  카카오톡 상담 <span aria-hidden className="ml-1 text-[0.8em] opacity-60">↗</span>
                </a>
              </li>
              <li>
                <a href={consultLinks.youtube} target="_blank" rel="noopener noreferrer" className={link}>
                  유튜브 · 김팀장의 경영노트 <span aria-hidden className="ml-1 text-[0.8em] opacity-60">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className={`mt-12 border-t pt-6 text-[0.9rem] leading-relaxed sm:text-[0.86rem] ${dark ? 'border-white/10 text-slate-400' : 'border-[#E7E1D8] text-[#5E6670]'}`}>
          {/* 폰은 한 줄에 하나씩(줄 머리에 '|' 가 붙지 않게), PC 는 두 줄로 묶는다 */}
          {[infoRows, [`주소 ${b.address}`, `업태 ${b.businessCategory} · 종목 ${b.businessItem}`]].map((group, gi) => (
            <p key={gi} className="flex flex-col gap-y-0.5 sm:mt-0.5 sm:flex-row sm:flex-wrap sm:gap-x-3">
              {group.map((row, i) => (
                <span key={row} className="inline-flex items-center gap-3">
                  {i > 0 && <span aria-hidden className={`hidden sm:inline ${dark ? 'text-white/15' : 'text-[#D9D2C7]'}`}>|</span>}
                  {row}
                </span>
              ))}
            </p>
          ))}
          <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <p className="shrink-0">© {year} {b.companyName}. All rights reserved.</p>
            <p className="sm:text-right">정책자금·정부지원·기업인증·세금 관련 결과는 기관 심사 등에 따라 달라질 수 있으며 특정 결과를 보장하지 않습니다.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
