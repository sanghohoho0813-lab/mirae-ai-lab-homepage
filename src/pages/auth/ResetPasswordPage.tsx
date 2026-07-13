// /auth/reset-password — 재설정 메일 링크 복귀 지점. 링크가 만든 임시 세션으로 새 비밀번호를 설정합니다.
// 만료·잘못된 링크는 한국어로 안내하고 다시 요청으로 유도합니다.
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../../components/PageShell'
import PasswordInput, { passwordValid } from '../../components/auth/PasswordInput'
import { useAuth } from '../../lib/auth'

export default function ResetPasswordPage() {
  const { loading, user, updatePassword, configured } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [waited, setWaited] = useState(false)

  useEffect(() => {
    document.title = '비밀번호 재설정 | 미래 AI 랩'
    const t = setTimeout(() => setWaited(true), 6000) // 링크 세션 확립 대기 상한
    return () => clearTimeout(t)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setError('')
    if (!passwordValid(password)) return setError('비밀번호는 8자 이상, 영문·숫자 조합이어야 합니다.')
    if (password !== confirm) return setError('비밀번호가 일치하지 않습니다.')
    setBusy(true)
    const r = await updatePassword(password)
    setBusy(false)
    if (!r.ok) {
      setError(r.error ?? '비밀번호를 변경하지 못했습니다. 링크가 만료되었을 수 있어요.')
      return
    }
    setDone(true)
  }

  const invalidLink = !loading && !user && waited

  return (
    <PageShell title="새 비밀번호 설정" compact>
      <div className="mx-auto w-full max-w-[500px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {done ? (
          <div className="text-center">
            <p role="status" className="rounded-xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
              비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white hover:bg-slate-700"
            >
              로그인하러 가기
            </button>
          </div>
        ) : invalidLink ? (
          <div className="text-center">
            <p role="alert" className="rounded-xl bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
              재설정 링크가 만료되었거나 잘못되었습니다. 비밀번호 찾기를 다시 요청해주세요.
            </p>
            <Link
              to="/forgot-password"
              className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white hover:bg-slate-700"
            >
              다시 요청하기
            </Link>
          </div>
        ) : loading || !user ? (
          <p className="text-center text-sm text-slate-500">링크를 확인하고 있어요…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="newPassword" className="mb-1.5 block text-[0.95rem] font-semibold text-slate-800">새 비밀번호</label>
              <PasswordInput id="newPassword" value={password} onChange={setPassword} autoComplete="new-password" placeholder="8자 이상, 영문·숫자 조합" showRules />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[0.95rem] font-semibold text-slate-800">새 비밀번호 확인</label>
              <PasswordInput id="confirmPassword" value={confirm} onChange={setConfirm} autoComplete="new-password" placeholder="한 번 더 입력" />
              {confirm.length > 0 && confirm !== password && (
                <p className="mt-1.5 text-sm font-medium text-rose-600" aria-live="polite">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
            {error && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>}
            <button
              type="submit"
              disabled={busy || !configured}
              className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? '변경 중…' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </PageShell>
  )
}
