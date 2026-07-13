// /auth/onboarding — 로그인은 됐지만 가입 미완료(주로 소셜 신규) 사용자의 가입 완료 절차.
// 회원유형 → 휴대폰 본인인증(PASS) → 약관 동의 → 서버 complete 판정(역할+인증+동의 모두 충족 시에만).
// 계정을 삭제하지 않고 남은 절차만 이어서 진행합니다. 뒤로가기 시 유효한 인증은 복구됩니다.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import PageShell from '../../components/PageShell'
import MemberTypeSelect from '../../components/auth/MemberTypeSelect'
import IdentityVerifyCard from '../../components/auth/IdentityVerifyCard'
import AgreementsField, { EMPTY_CONSENTS, requiredConsentsAgreed, type ConsentState } from '../../components/auth/AgreementsField'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { AUTH_CONSENTS } from '../../config/authConsents'
import {
  attachIdentityToUser, completeOnboarding, getIdentityHealth, migrateGuestDiagnoses, recordConsents,
  type IdentityHealth, type IdentityVerified,
} from '../../lib/identityVerification'
import { loadHistory } from '../../lib/businessDiagnosisStorage'
import { roleHome, sanitizeNext } from '../../lib/authRouting'
import { trackAuthEvent } from '../../lib/authAnalytics'
import type { MemberType } from '../../lib/platform'

export default function OnboardingPage() {
  const { loading, user, profile, roles, memberType, identityVerified, needsOnboarding, configured, getAccessToken, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = sanitizeNext(searchParams.get('next'))

  const [selected, setSelected] = useState<MemberType | null>(null)
  const [identity, setIdentity] = useState<IdentityVerified | null>(null)
  const [consents, setConsents] = useState<ConsentState>(EMPTY_CONSENTS)
  const [health, setHealth] = useState<IdentityHealth | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const startedAtRef = useRef(Date.now())

  useEffect(() => {
    document.title = '가입 완료하기 | 미래 AI 랩'
    void getIdentityHealth().then(setHealth)
  }, [])
  useEffect(() => {
    if (profile?.member_type) setSelected(profile.member_type as MemberType)
  }, [profile?.member_type])

  const identityRequired = health ? health.required : true
  const identityConfigured = health ? health.identityConfigured : true
  const identityDone = identityVerified || identity !== null
  // 카카오 이메일 미제공 계정 — 이메일 등록·확인 필요
  const missingEmail = Boolean(user && !user.email)

  const canComplete = useMemo(() => {
    if (busy) return false
    if (!selected) return false
    if (identityRequired && identityConfigured && !identityDone) return false
    if (identityRequired && !identityConfigured) return false // fail-closed
    if (!requiredConsentsAgreed(consents)) return false
    if (missingEmail) return false
    return true
  }, [busy, selected, identityRequired, identityConfigured, identityDone, consents, missingEmail])

  if (!configured) {
    return (
      <PageShell title="가입 완료하기" compact>
        <p className="mx-auto max-w-[500px] text-center text-slate-500">서비스를 준비하고 있습니다.</p>
      </PageShell>
    )
  }
  if (loading) {
    return (
      <PageShell title="가입 완료하기" compact>
        <p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p>
      </PageShell>
    )
  }
  if (!user) return <Navigate to={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} replace />
  if (!needsOnboarding) return <Navigate to={next ?? roleHome(roles, memberType)} replace />

  async function handleRegisterEmail() {
    if (!supabase || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailInput)) {
      setError('이메일 주소를 확인해주세요.')
      return
    }
    setError('')
    const { error: e } = await supabase.auth.updateUser({ email: emailInput.trim() })
    if (e) {
      setError('이메일을 등록하지 못했습니다. 다른 주소로 시도해주세요.')
      return
    }
    setEmailSent(true)
  }

  async function handleComplete() {
    if (!canComplete || !selected) return
    setBusy(true)
    setError('')
    const token = await getAccessToken()
    if (!token) {
      setBusy(false)
      setError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
      return
    }
    if (identity && !identityVerified) {
      const at = await attachIdentityToUser(identity.id, token)
      if (!at.ok) {
        setBusy(false)
        setError(at.error ?? '본인인증 연결에 실패했습니다.')
        return
      }
    }
    await recordConsents(token, AUTH_CONSENTS.map((c) => ({ key: c.key, version: c.version, agreed: consents[c.key] })))
    const role = selected === 'business' ? 'ceo' : 'consultant'
    const done = await completeOnboarding(token, role)
    if (!done.ok) {
      setBusy(false)
      setError(done.error ?? '회원가입은 완료되지 않았습니다. 남은 절차를 이어서 진행해주세요.')
      return
    }
    try {
      const tokens = loadHistory().map((r) => r.sessionId).filter(Boolean)
      if (tokens.length > 0) await migrateGuestDiagnoses(token, tokens)
    } catch { /* 선택 기능 */ }
    await refreshProfile()
    const provider = (user?.app_metadata?.provider as 'google' | 'kakao' | undefined) ?? 'email'
    trackAuthEvent('signup_completed', { provider, role, elapsedSeconds: Math.round((Date.now() - startedAtRef.current) / 1000) })
    setBusy(false)
    navigate(next ?? roleHome([role]), { replace: true })
  }

  return (
    <PageShell title="가입을 완료해주세요 👋" subtitle="몇 가지만 확인하면 바로 시작할 수 있어요." compact>
      <div className="mx-auto w-full max-w-[500px] space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* 1. 회원유형 */}
          <p className="text-[0.95rem] font-semibold text-slate-800">회원유형 <span className="text-rose-500">*</span></p>
          <div className="mt-2">
            <MemberTypeSelect
              value={selected}
              onChange={(v) => {
                setSelected(v)
                trackAuthEvent('signup_role_selected', { role: v === 'business' ? 'ceo' : 'consultant' })
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">두 번째 역할은 가입 후 내 계정에서 추가할 수 있어요.</p>

          {/* 2. 본인인증 */}
          <p className="mt-6 text-[0.95rem] font-semibold text-slate-800">휴대폰 본인인증 <span className="text-rose-500">*</span></p>
          <div className="mt-2">
            {identityVerified ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                ✓ 본인인증이 이미 완료되었습니다.
              </p>
            ) : (
              <IdentityVerifyCard verified={identity} onVerified={setIdentity} />
            )}
          </div>

          {/* 3. 이메일 미제공(카카오 등) 처리 */}
          {missingEmail && (
            <div className="mt-6">
              <p className="text-[0.95rem] font-semibold text-slate-800">이메일 등록 <span className="text-rose-500">*</span></p>
              {emailSent ? (
                <p className="mt-2 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-800">
                  확인 메일을 보냈습니다. 메일의 링크를 눌러 이메일 등록을 완료한 뒤 이 화면으로 돌아와주세요.
                </p>
              ) : (
                <>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    소셜 계정에서 이메일 정보를 받지 못했습니다. 안내·영수증 수신을 위해 이메일을 등록해주세요.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com" autoComplete="email"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button type="button" onClick={handleRegisterEmail} className="shrink-0 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-700">
                      등록
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 4. 약관 동의 */}
          <p className="mt-6 text-[0.95rem] font-semibold text-slate-800">약관 동의 <span className="text-rose-500">*</span></p>
          <div className="mt-2">
            <AgreementsField value={consents} onChange={setConsents} />
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className="mt-4 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          )}

          <button
            type="button"
            onClick={handleComplete}
            disabled={!canComplete}
            className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {busy ? '저장 중…' : '가입 완료하고 시작하기'}
          </button>
        </section>
      </div>
    </PageShell>
  )
}
