import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import MemberTypeSelect from '../components/auth/MemberTypeSelect'
import PhoneVerifyField from '../components/auth/PhoneVerifyField'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { confirmPhoneVerified } from '../lib/phoneVerification'
import type { MemberType } from '../lib/platform'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-2 block text-base font-semibold text-slate-800'

export default function SignupPage() {
  const { signUp, configured } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [memberType, setMemberType] = useState<MemberType | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!name.trim()) return setError('이름을 입력해주세요.')
    if (!phoneVerified) return setError('휴대폰 인증을 완료해주세요.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('이메일 주소를 확인해주세요.')
    if (password.length < 8) return setError('비밀번호는 8자 이상이어야 합니다.')
    if (!memberType) return setError('회원유형을 선택해주세요.')

    setBusy(true)
    const result = await signUp({ name, email, phone, password, memberType })
    if (!result.ok) {
      setBusy(false)
      setError(result.error ?? '회원가입에 실패했습니다.')
      return
    }
    // 세션이 있으면 서버에 휴대폰 인증 확정 (phone_verified=true)
    if (!result.needsEmailConfirm && supabase) {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (token) await confirmPhoneVerified(phone, token)
    }
    setBusy(false)
    if (result.needsEmailConfirm) {
      setConfirmMsg('가입 확인 메일을 보냈습니다. 메일함에서 인증을 완료한 뒤 로그인해 주세요.')
      return
    }
    const fallback = memberType === 'business' ? '/business-services' : '/my-tools'
    navigate(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : fallback)
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
    <PageShell title="회원가입" subtitle="회원유형을 선택하고 간단한 정보만 입력하면 시작할 수 있습니다.">
      {!configured && (
        <div className="mx-auto mb-6 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Supabase 환경변수가 설정되지 않았습니다. 회원가입은 환경변수 설정 후 사용할 수 있습니다.
        </div>
      )}

      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        {/* 소셜 회원가입 (카카오 > 구글) */}
        <SocialAuthButtons />

        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          이메일로 회원가입
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className={labelClass}>회원유형 <span className="text-rose-500">*</span></span>
            <MemberTypeSelect value={memberType} onChange={setMemberType} />
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              이름 <span className="text-rose-500">*</span>
            </label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" required placeholder="예: 김대표" autoComplete="name" className={inputClass} />
          </div>

          <div>
            <span className={labelClass}>휴대폰 번호 <span className="text-rose-500">*</span></span>
            <PhoneVerifyField phone={phone} onPhoneChange={setPhone} verified={phoneVerified} onVerifiedChange={setPhoneVerified} />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              이메일 <span className="text-rose-500">*</span>
            </label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" autoComplete="email" className={inputClass} />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              비밀번호 <span className="text-rose-500">*</span>
            </label>
            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} placeholder="8자 이상" autoComplete="new-password" className={inputClass} />
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>}

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
