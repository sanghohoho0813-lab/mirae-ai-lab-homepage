import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import { getTrialModules } from '../lib/platform'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

const labelClass = 'mb-2 block text-base font-semibold text-slate-800'

export default function SignupPage() {
  const { signUp, configured } = useAuth()
  const navigate = useNavigate()
  const modules = getTrialModules()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const fd = new FormData(event.currentTarget)
    setBusy(true)
    const result = await signUp({
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      password: String(fd.get('password') ?? ''),
      organization: String(fd.get('organization') ?? '').trim(),
      interests: fd.getAll('interests').map(String),
    })
    setBusy(false)
    if (!result.ok) {
      setError(result.error ?? '회원가입에 실패했습니다.')
      return
    }
    if (result.needsEmailConfirm) {
      setConfirmMsg('가입 확인 메일을 보냈습니다. 메일함에서 인증을 완료한 뒤 로그인해 주세요.')
      return
    }
    navigate('/my-tools')
  }

  if (confirmMsg) {
    return (
      <PageShell title="회원가입" subtitle="가입 확인 메일을 확인해주세요.">
        <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-800">
          <p className="text-lg font-semibold">{confirmMsg}</p>
          <Link to="/login" className="mt-4 inline-block font-semibold text-emerald-700 underline">
            로그인 화면으로
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="회원가입" subtitle="간단한 정보만 입력하면 도구별 7일 무료 체험을 시작할 수 있습니다.">
      {!configured && (
        <div className="mx-auto mb-6 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Supabase 환경변수가 설정되지 않았습니다. 회원가입은 환경변수 설정 후 사용할 수 있습니다.
        </div>
      )}
      <div className="mx-auto mb-6 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
        {['카드 등록 없이 시작', '신청한 시각부터 정확히 7일', '리뷰·설문 참여 시 최대 21일', '베타 참여자 우선 제공'].map(
          (t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className="text-emerald-500" aria-hidden>✓</span>
              {t}
            </span>
          ),
        )}
      </div>

      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                이름 <span className="text-rose-500">*</span>
              </label>
              <input id="name" name="name" type="text" required placeholder="예: 김대표" className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                휴대폰 번호 <span className="text-rose-500">*</span>
              </label>
              <input id="phone" name="phone" type="tel" required placeholder="010-0000-0000" className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                이메일 <span className="text-rose-500">*</span>
              </label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                비밀번호 <span className="text-rose-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="8자 이상"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="organization" className={labelClass}>
              직업/소속
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              placeholder="예: 법인컨설턴트 / 중소기업 대표"
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>관심 도구</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {modules.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 transition hover:border-blue-300"
                >
                  <input type="checkbox" name="interests" value={m.id} className="h-4 w-4 accent-blue-600" />
                  {m.title}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy || !configured}
            className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? '가입 중…' : '회원가입하고 시작하기'}
          </button>
          <p className="text-center text-xs leading-relaxed text-slate-400">
            회원가입 시{' '}
            <Link to="/terms" className="underline underline-offset-2 hover:text-slate-600">이용약관</Link> 및{' '}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-slate-600">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
