import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { businessInfo, legalLinks } from '../config/businessInfo'
import AccountMenu from './account/AccountMenu'

function BrandMark() {
  return (
    <BrandLogo to="/" imgClassName="h-9 max-w-[168px] sm:h-11 sm:max-w-[204px]" />
  )
}

export default function PageShell({
  title,
  subtitle,
  compact = false,
  children,
}: {
  title: string
  subtitle?: string
  /** 인증 화면용 — 상단 여백 축소 + 제목 중앙 정렬(모바일 잘림 방지) */
  compact?: boolean
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandMark />
          <nav className="flex items-center gap-2 text-sm font-medium sm:gap-3">
            <Link to="/" className="hidden text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              홈
            </Link>
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main className={`mx-auto max-w-6xl px-5 sm:px-6 ${compact ? 'py-8 sm:py-10' : 'py-12 sm:py-16'}`}>
        <div className={compact ? 'mx-auto w-full max-w-[520px] text-center' : 'max-w-3xl'}>
          <h1 className={`font-bold tracking-tight text-slate-900 [word-break:keep-all] ${compact ? 'text-[1.6rem] leading-snug sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
            {title}
          </h1>
          {subtitle && <p className={`mt-3 leading-relaxed text-slate-600 ${compact ? 'text-base' : 'text-lg'}`}>{subtitle}</p>}
        </div>
        <div className={compact ? 'mt-7' : 'mt-10'}>{children}</div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <nav aria-label="약관 및 정책" className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-600">
            {legalLinks.map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors hover:text-slate-900">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-sm text-slate-400">
            {businessInfo.companyName} · 대표 {businessInfo.representative} · 사업자등록번호 {businessInfo.businessNumber}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            © {new Date().getFullYear()} {businessInfo.serviceName} · 미래경영지원센터
          </p>
        </div>
      </footer>
    </div>
  )
}
