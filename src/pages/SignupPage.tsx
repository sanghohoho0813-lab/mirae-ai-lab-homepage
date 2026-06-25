import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import { getTrialModules } from '../lib/platform'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

const labelClass = 'mb-2 block text-base font-semibold text-slate-800'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const modules = getTrialModules()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    signup({
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      password: String(fd.get('password') ?? ''),
      organization: String(fd.get('organization') ?? '').trim(),
      interests: fd.getAll('interests').map(String),
    })
    navigate('/my-tools')
  }

  return (
    <PageShell title="회원가입" subtitle="간단한 정보만 입력하면 도구별 7일 무료 체험을 시작할 수 있습니다.">
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
              <input id="password" name="password" type="password" required placeholder="비밀번호" className={inputClass} />
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

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
          >
            회원가입하고 시작하기
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-slate-400">
        현재는 베타(mock) 단계로, 입력 정보는 브라우저(localStorage)에만 저장됩니다. 향후 Supabase 기반
        회원가입/로그인으로 전환될 예정입니다.
      </p>
    </PageShell>
  )
}
