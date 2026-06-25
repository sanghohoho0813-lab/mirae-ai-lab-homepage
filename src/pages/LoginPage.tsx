import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

const socialClass =
  'flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-400'

export default function LoginPage() {
  const { signIn, configured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const result = await signIn(email, password)
    setBusy(false)
    if (!result.ok) {
      setError(result.error ?? '로그인에 실패했습니다.')
      return
    }
    navigate('/my-tools')
  }

  return (
    <PageShell title="로그인" subtitle="미래 AI 랩에 로그인하고 내 도구함을 확인하세요.">
      {!configured && (
        <div className="mx-auto mb-6 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Supabase 환경변수가 설정되지 않았습니다. 로그인/회원가입은 환경변수(`VITE_SUPABASE_URL`,
          `VITE_SUPABASE_ANON_KEY`) 설정 후 사용할 수 있습니다. (README 참고)
        </div>
      )}

      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-base font-semibold text-slate-800">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-base font-semibold text-slate-800">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className={inputClass}
            />
          </div>
          {error && (
            <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy || !configured}
            className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          또는
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-3">
          <button type="button" disabled className={socialClass}>
            <span aria-hidden>🟢</span> Google로 계속하기 <span className="text-xs">(준비 중)</span>
          </button>
          <button type="button" disabled className={socialClass}>
            <span aria-hidden>💬</span> 카카오로 계속하기 <span className="text-xs">(준비 중)</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
            회원가입
          </Link>
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-slate-400">
        관리자 화면은 <span className="font-semibold text-slate-500">sanghohoho0813@gmail.com</span> 으로
        가입/로그인하면 자동으로 열립니다. (Supabase 트리거로 role=admin 부여)
      </p>
    </PageShell>
  )
}
