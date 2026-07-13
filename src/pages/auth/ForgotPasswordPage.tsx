// /forgot-password — 비밀번호 재설정 메일 발송. 계정 존재 여부를 노출하지 않는 동일 응답.
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../../components/PageShell'
import { useAuth } from '../../lib/auth'
import { trackAuthEvent } from '../../lib/authAnalytics'

export default function ForgotPasswordPage() {
  const { resetPassword, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => { document.title = '비밀번호 찾기 | 미래 AI 랩' }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    setBusy(true)
    await resetPassword(email)
    trackAuthEvent('password_reset_requested')
    setBusy(false)
    setSent(true) // 존재 여부와 무관하게 동일 안내
  }

  return (
    <PageShell title="비밀번호 찾기" subtitle="가입하신 이메일로 재설정 링크를 보내드려요." compact>
      <div className="mx-auto w-full max-w-[500px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {sent ? (
          <div role="status" className="rounded-xl bg-emerald-50 px-5 py-4 text-sm leading-relaxed text-emerald-800">
            <b>{email}</b> 이(가) 가입된 이메일이라면 비밀번호 재설정 링크를 보내드렸어요. 메일함(스팸함 포함)을 확인해주세요.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[0.95rem] font-semibold text-slate-800">이메일</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !configured}
              className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? '보내는 중…' : '재설정 링크 보내기'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">로그인 화면으로</Link>
        </p>
      </div>
    </PageShell>
  )
}
