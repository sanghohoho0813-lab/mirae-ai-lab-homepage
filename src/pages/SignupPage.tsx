// /signup — 미래 AI 랩 시작하기.
// 구성: 소셜(카카오>구글) → 회원유형 → 휴대폰 본인인증(PASS, 이름·휴대폰 자동입력) → 이메일·비밀번호 → 약관 체크 → 가입.
// 이름·휴대폰은 본인인증 결과로만 채워지며(읽기전용), 관심도구 항목은 없습니다.
// 본인인증 미설정 + 필수 정책이면 신규가입을 차단합니다(fail-closed, 서버 이중 차단).
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import MemberTypeSelect from '../components/auth/MemberTypeSelect'
import IdentityVerifyCard from '../components/auth/IdentityVerifyCard'
import PasswordInput, { passwordValid } from '../components/auth/PasswordInput'
import AgreementsField, { EMPTY_CONSENTS, requiredConsentsAgreed, type ConsentState } from '../components/auth/AgreementsField'
import { useAuth } from '../lib/auth'
import { AUTH_CONSENTS } from '../config/authConsents'
import { EMAIL_SIGNUP_ENABLED } from '../config/authFlags'
import {
  attachIdentityToUser, completeOnboarding, getIdentityHealth, migrateGuestDiagnoses, recordConsents,
  type IdentityHealth, type IdentityVerified,
} from '../lib/identityVerification'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { sanitizeNext, roleHome } from '../lib/authRouting'
import { trackAuthEvent } from '../lib/authAnalytics'
import type { MemberType } from '../lib/platform'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-1.5 block text-[0.95rem] font-semibold text-slate-800'

export default function SignupPage() {
  const { signUp, configured, getAccessToken, refreshProfile, resendConfirmEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = sanitizeNext(searchParams.get('next') ?? searchParams.get('redirect'))

  const [memberType, setMemberType] = useState<MemberType | null>(null)
  const [identity, setIdentity] = useState<IdentityVerified | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [consents, setConsents] = useState<ConsentState>(EMPTY_CONSENTS)
  const [health, setHealth] = useState<IdentityHealth | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmEmailFor, setConfirmEmailFor] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const startedAtRef = useRef(Date.now())

  useEffect(() => {
    document.title = '회원가입 | 미래 AI 랩'
    trackAuthEvent('signup_page_viewed')
    void getIdentityHealth().then(setHealth)
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const identityRequired = health ? health.required : true
  const identityConfigured = health ? health.identityConfigured : true
  // 필수 정책 + 미설정 → 신규가입 완료 불가 (가짜 성공·우회 없음)
  const signupBlocked = identityRequired && !identityConfigured && health !== null

  const pwMismatch = passwordConfirm.length > 0 && password !== passwordConfirm
  const canSubmit = useMemo(() => {
    if (!configured || busy || signupBlocked) return false
    if (!memberType) return false
    if (identityRequired && !identity) return false
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false
    if (!passwordValid(password) || password !== passwordConfirm) return false
    if (!requiredConsentsAgreed(consents)) return false
    return true
  }, [configured, busy, signupBlocked, memberType, identityRequired, identity, email, password, passwordConfirm, consents])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setError('')
    if (!memberType) return setError('회원유형을 선택해주세요.')
    if (identityRequired && !identity) return setError('휴대폰 본인인증을 완료해주세요.')
    if (!requiredConsentsAgreed(consents)) return setError('필수 약관에 동의해주세요.')
    if (password !== passwordConfirm) return setError('비밀번호가 일치하지 않습니다.')

    setBusy(true)
    trackAuthEvent('signup_submitted', { provider: 'email', role: memberType === 'business' ? 'ceo' : 'consultant' })
    const result = await signUp({
      name: identity?.name ?? '',
      phone: identity?.phone ?? '',
      email,
      password,
      memberType,
    })
    if (!result.ok) {
      setBusy(false)
      setError(result.error ?? '회원가입에 실패했습니다.')
      return
    }
    if (result.needsEmailConfirm) {
      // 이메일 확인 후 첫 로그인 시 /auth/callback → onboarding 에서 인증·동의·역할이 이어집니다.
      setBusy(false)
      setConfirmEmailFor(email)
      setResendCooldown(30)
      return
    }
    // 세션 확보됨 → 서버 오케스트레이션 (attach → consent → complete)
    const token = await getAccessToken()
    if (token) {
      if (identity) await attachIdentityToUser(identity.id, token)
      await recordConsents(token, AUTH_CONSENTS.map((c) => ({ key: c.key, version: c.version, agreed: consents[c.key] })))
      const role = memberType === 'business' ? 'ceo' : 'consultant'
      const done = await completeOnboarding(token, role)
      if (!done.ok) {
        setBusy(false)
        setError(done.error ?? '가입을 완료하지 못했습니다. 남은 절차를 이어서 진행해주세요.')
        return
      }
      // 비회원 진단기록 연결 (멱등 — sessionId 기준)
      try {
        const tokens = loadHistory().map((r) => r.sessionId).filter(Boolean)
        if (tokens.length > 0) await migrateGuestDiagnoses(token, tokens)
      } catch { /* 선택 기능 — 실패 무시 */ }
      await refreshProfile()
      trackAuthEvent('signup_completed', { provider: 'email', role, elapsedSeconds: Math.round((Date.now() - startedAtRef.current) / 1000) })
    }
    setBusy(false)
    navigate(next ?? roleHome(memberType === 'business' ? ['ceo'] : ['consultant']), { replace: true })
  }

  if (confirmEmailFor) {
    return (
      <PageShell title="이메일을 확인해주세요" compact>
        <div className="mx-auto w-full max-w-[500px] rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-800">
          <p className="text-base font-semibold leading-relaxed">
            <b>{confirmEmailFor}</b> 로 확인 메일을 보냈습니다. 메일의 링크를 눌러 인증을 완료한 뒤 로그인해 주세요.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-700">
            로그인하면 남은 가입 절차(본인인증 확인 등)가 자동으로 이어집니다.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={async () => {
                const r = await resendConfirmEmail(confirmEmailFor)
                setResendCooldown(60)
                if (!r.ok) setError(r.error ?? '')
              }}
              className="rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 disabled:opacity-50"
            >
              {resendCooldown > 0 ? `재전송 (${resendCooldown}초)` : '확인 메일 재전송'}
            </button>
            <Link to="/login" className="text-sm font-semibold text-emerald-700 underline underline-offset-2">
              로그인 화면으로
            </Link>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="미래 AI 랩 시작하기" subtitle="대표님과 컨설턴트 모두 하나의 계정으로 이용할 수 있어요." compact>
      {!configured && (
        <div className="mx-auto mb-6 w-full max-w-[500px] rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          회원가입 기능을 준비하고 있습니다. 잠시 후 다시 이용해주세요.
        </div>
      )}

      <div className="mx-auto w-full max-w-[500px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <SocialAuthButtons mode="signup" next={next} />

        {EMAIL_SIGNUP_ENABLED ? (
          <>
        <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          또는 이메일로 회원가입
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {signupBlocked && (
          <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
            현재 휴대폰 본인인증 설정을 준비하고 있어 이메일 회원가입을 잠시 중단하고 있습니다. 잠시 후 다시 이용해주세요.
            <span className="mt-1 block">이미 가입하신 회원은 정상적으로 로그인하실 수 있습니다.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* 1. 회원유형 */}
          <div>
            <span className={labelClass}>회원유형 <span className="text-rose-500">*</span></span>
            <MemberTypeSelect
              value={memberType}
              onChange={(v) => {
                setMemberType(v)
                trackAuthEvent('signup_role_selected', { role: v === 'business' ? 'ceo' : 'consultant' })
              }}
            />
          </div>

          {/* 2. 휴대폰 본인인증 — 이름·휴대폰은 인증 결과로만 */}
          <div>
            <span className={labelClass}>휴대폰 본인인증 <span className="text-rose-500">*</span></span>
            <IdentityVerifyCard verified={identity} onVerified={setIdentity} />
          </div>

          {/* 3. 이메일·비밀번호 */}
          <div>
            <label htmlFor="email" className={labelClass}>이메일 <span className="text-rose-500">*</span></label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email" className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>비밀번호 <span className="text-rose-500">*</span></label>
            <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="8자 이상, 영문·숫자 조합" showRules />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className={labelClass}>비밀번호 확인 <span className="text-rose-500">*</span></label>
            <PasswordInput id="passwordConfirm" value={passwordConfirm} onChange={setPasswordConfirm} autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력" />
            {pwMismatch && <p className="mt-1.5 text-sm font-medium text-rose-600" aria-live="polite">비밀번호가 일치하지 않습니다.</p>}
          </div>

          {/* 4. 약관 동의 (직접 체크) */}
          <div>
            <span className={labelClass}>약관 동의 <span className="text-rose-500">*</span></span>
            <AgreementsField value={consents} onChange={setConsents} />
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {busy ? '가입 처리 중…' : '회원가입하고 시작하기'}
          </button>
        </form>
          </>
        ) : (
          <p className="mt-6 text-center text-sm leading-relaxed break-keep text-slate-500">
            카카오 또는 구글 계정으로 가입해 주세요. 따로 비밀번호를 만들지 않아도 되고,
            휴대폰 본인인증 절차도 없습니다.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{' '}
          <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-blue-600 hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
