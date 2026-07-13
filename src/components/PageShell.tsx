import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { businessInfo, legalLinks } from '../config/businessInfo'

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-black tracking-tight text-sky-400">
        AI
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight text-slate-900">미래 AI 랩</span>
        <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
      </span>
    </Link>
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
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandMark />
          <nav className="flex items-center gap-2 text-sm font-medium sm:gap-4">
            <Link to="/" className="hidden text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              홈
            </Link>
            {user ? (
              <>
                <Link to="/my-tools" className="text-slate-600 transition-colors hover:text-slate-900">
                  내 도구함
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-slate-600 transition-colors hover:text-slate-900">
                    관리자
                  </Link>
                )}
                <span className="hidden text-slate-400 md:inline">·</span>
                <span className="hidden text-slate-500 md:inline">{profile?.name ?? user.email}님</span>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut()
                    navigate('/')
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition-colors hover:bg-slate-100"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 transition-colors hover:text-slate-900">
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-white transition-colors hover:bg-slate-700"
                >
                  회원가입
                </Link>
              </>
            )}
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
