import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

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
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  const { user, isAdmin, logout } = useAuth()
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
                <span className="hidden text-slate-500 md:inline">{user.name}님</span>
                <button
                  type="button"
                  onClick={() => {
                    logout()
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

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-lg leading-relaxed text-slate-600">{subtitle}</p>}
        </div>
        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-400">
          © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 실무형 AI 도구 플랫폼 (베타)
        </div>
      </footer>
    </div>
  )
}
