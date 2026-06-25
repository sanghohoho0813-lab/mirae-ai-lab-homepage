import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import { ADMIN_EMAIL } from '../lib/platform'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

const socialClass =
  'flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-400'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    const result = login(email.trim())
    if (!result.ok) {
      setError(result.error ?? '로그인에 실패했습니다.')
      return
    }
    navigate(result.user?.role === 'admin' ? '/admin' : '/my-tools')
  }

  return (
    <PageShell title="로그인" subtitle="미래 AI 랩에 로그인하고 내 도구함을 확인하세요.">
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
            <input id="password" type="password" placeholder="비밀번호" className={inputClass} />
          </div>
          {error && (
            <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
          >
            로그인
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
        현재는 베타(mock) 단계입니다. 비밀번호 검증 없이 입력한 이메일로 로그인되며, 데이터는 브라우저에만
        저장됩니다. 관리자 화면은 <span className="font-semibold text-slate-500">{ADMIN_EMAIL}</span> 로
        로그인하면 열립니다.
      </p>
    </PageShell>
  )
}
