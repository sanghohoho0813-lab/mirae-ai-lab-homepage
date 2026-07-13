// /welcome — 로그인 후 허브.
//  - 회원유형 미선택(주로 소셜 신규) → 온보딩(회원유형 + 휴대폰 인증)
//  - 이미 회원유형 있음 → 원래 경로/회원유형 홈으로 이동
//  - 본인인증(PASS)은 준비중 — 인증 상태 카드로 표시(identityVerification.ts)
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import MemberTypeSelect from '../components/auth/MemberTypeSelect'
import PhoneVerifyField from '../components/auth/PhoneVerifyField'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { confirmPhoneVerified } from '../lib/phoneVerification'
import type { MemberType } from '../lib/platform'

function homeFor(memberType: MemberType | null): string {
  return memberType === 'consultant' ? '/my-tools' : '/business-services'
}
function safeRedirect(r: string | null): string | null {
  if (!r || !r.startsWith('/') || r.startsWith('//')) return null
  return r
}

export default function AccountSetupPage() {
  const { loading, user, profile, configured, memberType, phoneVerified, needsOnboarding, updateMemberType } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = safeRedirect(searchParams.get('redirect'))

  const [selected, setSelected] = useState<MemberType | null>(null)
  const [phone, setPhone] = useState('')
  const [verified, setVerified] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = '시작하기 | 미래 AI 랩' }, [])
  // 프로필에 이미 인증된 번호가 있으면 프리필
  useEffect(() => {
    if (profile?.phone) setPhone(profile.phone)
    if (profile?.phone_verified) setVerified(true)
  }, [profile?.phone, profile?.phone_verified])

  if (!configured) {
    return (
      <PageShell title="시작하기">
        <p className="mx-auto max-w-md text-slate-500">Supabase 환경변수가 설정되지 않았습니다.</p>
      </PageShell>
    )
  }
  if (loading) {
    return (
      <PageShell title="시작하기">
        <p className="mx-auto max-w-md text-slate-500">불러오는 중…</p>
      </PageShell>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  // 온보딩 불필요(회원유형 이미 있음) → 목적지로 이동
  if (!needsOnboarding) {
    return <Navigate to={redirect ?? homeFor(memberType)} replace />
  }

  async function handleComplete() {
    setError('')
    if (!selected) return setError('회원유형을 선택해주세요.')
    if (!verified) return setError('휴대폰 인증을 완료해주세요.')
    setBusy(true)
    // 1) 휴대폰 번호 저장(소셜 신규는 프로필에 번호가 없을 수 있음)
    if (supabase && user && phone) {
      const { error: pErr } = await supabase.from('profiles').update({ phone: phone.replace(/[^0-9]/g, '') }).eq('id', user.id)
      if (pErr && /duplicate|unique/i.test(pErr.message)) {
        setBusy(false)
        return setError('이미 등록된 휴대폰 번호입니다.')
      }
    }
    // 2) 서버에 휴대폰 인증 확정
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (token) await confirmPhoneVerified(phone, token)
    }
    // 3) 회원유형 저장
    const r = await updateMemberType(selected)
    setBusy(false)
    if (!r.ok) return setError(r.error ?? '저장에 실패했습니다.')
    navigate(redirect ?? homeFor(selected), { replace: true })
  }

  return (
    <PageShell title="환영합니다 👋" subtitle="서비스를 시작하기 전에 회원유형과 휴대폰 인증을 완료해주세요.">
      <div className="mx-auto max-w-xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-base font-bold text-slate-800">회원유형 선택 <span className="text-rose-500">*</span></p>
          <div className="mt-3">
            <MemberTypeSelect value={selected} onChange={setSelected} />
          </div>

          <div className="mt-6">
            <p className="text-base font-bold text-slate-800">휴대폰 인증 <span className="text-rose-500">*</span></p>
            <div className="mt-2">
              <PhoneVerifyField phone={phone} onPhoneChange={setPhone} verified={verified} onVerifiedChange={setVerified} />
            </div>
          </div>

          {error && <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>}

          <button
            type="button"
            onClick={handleComplete}
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? '저장 중…' : '시작하기'}
          </button>
        </section>

        {/* 본인인증(PASS) 상태 — 준비중 */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-700">인증 상태</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">휴대폰 인증</span>
              <span className={verified || phoneVerified ? 'font-bold text-emerald-600' : 'font-semibold text-slate-400'}>
                {verified || phoneVerified ? '완료' : '미완료'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">본인인증(PASS)</span>
              <span className="font-semibold text-slate-400">준비 중</span>
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            PASS 실명 본인인증은 준비 중입니다. 연결되면 이 화면에서 바로 진행할 수 있습니다.
          </p>
        </section>
      </div>
    </PageShell>
  )
}
