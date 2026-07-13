// /login — 카카오 > Google > 이메일 순. 관리자 이메일·내부 구현 안내 없음(공개 화면 보안).
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import PasswordInput from '../components/auth/PasswordInput'
import { useAuth } from '../lib/auth'
import { sanitizeNext } from '../lib/authRouting'
import { trackAuthEvent } from '../lib/authAnalytics'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

export default function LoginPage() {
  const { signIn, configured } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = sanitizeNext(searchParams.get('next') ?? searchParams.get('redirect'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { document.title = '로그인 | 미래 AI 랩' }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return // 중복 제출 방지
    setError('')
    setBusy(true)
    const result = await signIn(email, password)
    setBusy(false)
    if (!result.ok) {
      trackAuthEvent('login_failed', { provider: 'email', failureCategory: 'credentials' })
      setError(result.error ?? '로그인에 실패했습니다.') // 입력값·방식 유지
      return
    }
    trackAuthEvent('login_succeeded', { provider: 'email' })
    // 온보딩 필요 여부·역할별 홈 판단은 /auth/callback 이 담당 (이메일 로그인도 동일 경로 재사용)
    navigate(`/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`, { replace: true })
  }

  return (
    <PageShell title="미래 AI 랩에 로그인하세요" subtitle="대표님과 컨설턴트 모두 하나의 계정으로 이용할 수 있어요." compact>
      {!configured && (
        <div className="mx-auto mb-6 w-full max-w-[500px] rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          로그인 기능을 준비하고 있습니다. 잠시 후 다시 이용해주세요.
        </div>
      )}

      <div className="mx-auto w-full max-w-[500px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <SocialAuthButtons mode="login" next={next} />

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          또는 이메일로 로그인
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[0.95rem] font-semibold text-slate-800">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[0.95rem] font-semibold text-slate-800">
              비밀번호
            </label>
            <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
          </div>
          {error && (
            <p role="alert" aria-live="assertive" className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !configured}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {busy ? '로그인 중…' : '이메일로 로그인'}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-semibold text-slate-500 hover:text-slate-800">
            비밀번호 찾기
          </Link>
          <span className="text-slate-500">
            아직 계정이 없으신가요?{' '}
            <Link
              to={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              회원가입
            </Link>
          </span>
        </div>
      </div>
    </PageShell>
  )
}
