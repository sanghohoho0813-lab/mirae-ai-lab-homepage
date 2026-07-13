// 휴대폰 본인인증(PASS) 카드 — 인증 전: 버튼만 / 인증 후: 이름·휴대폰 읽기전용 + 완료 배지.
// 이름·휴대폰은 서버가 PortOne 재조회로 검증한 값만 사용합니다(사용자 임의 입력 없음).
// 채널 미설정 시 가짜 성공 없이 안내만 표시(fail-closed 는 서버가 보장).
import { useEffect, useState } from 'react'
import {
  getIdentityHealth, recoverIdentityVerification, runIdentityVerification,
  type IdentityHealth, type IdentityVerified,
} from '../../lib/identityVerification'
import { trackAuthEvent } from '../../lib/authAnalytics'

export default function IdentityVerifyCard({
  verified,
  onVerified,
}: {
  verified: IdentityVerified | null
  onVerified: (v: IdentityVerified | null) => void
}) {
  const [health, setHealth] = useState<IdentityHealth | null | 'loading'>('loading')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void getIdentityHealth().then((h) => { if (active) setHealth(h) })
    // 뒤로가기·새로고침 복구 — 유효한 인증이 있으면 재인증 요구하지 않음
    if (!verified) {
      void recoverIdentityVerification().then((v) => { if (active && v) onVerified(v) })
    }
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notConfigured = health !== 'loading' && (!health || !health.identityConfigured)
  const required = health !== 'loading' && health ? health.required : true

  async function handleVerify() {
    if (busy) return
    setError('')
    setBusy(true)
    trackAuthEvent('identity_started', { provider: 'portone' })
    const r = await runIdentityVerification()
    setBusy(false)
    if (!r.ok) {
      if (!r.cancelled) trackAuthEvent('identity_failed', { provider: 'portone', failureCategory: r.notConfigured ? 'not_configured' : 'failed' })
      setError(r.error)
      return
    }
    trackAuthEvent('identity_succeeded', { provider: 'portone' })
    onVerified(r.verified)
  }

  const maskPhone = (p: string) => p.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')

  if (verified) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="animate-[scale-in_0.2s_ease-out]">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            본인인증 완료
          </span>
          <button
            type="button"
            onClick={() => { onVerified(null); setError('') }}
            className="text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-800"
          >
            다시 인증하기
          </button>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 ring-1 ring-inset ring-slate-200">
            <dt className="font-semibold text-slate-500">이름</dt>
            <dd className="font-bold text-slate-900">{verified.name}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 ring-1 ring-inset ring-slate-200">
            <dt className="font-semibold text-slate-500">휴대폰 번호</dt>
            <dd className="font-bold tabular-nums text-slate-900">{maskPhone(verified.phone)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">인증기관에서 확인된 정보입니다. 변경은 다시 인증하기로만 가능합니다.</p>
      </div>
    )
  }

  return (
    <div>
      {notConfigured ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800" role="status">
          현재 휴대폰 본인인증 설정을 준비하고 있습니다. 잠시 후 다시 이용해주세요.
          {!required && <span className="mt-1 block text-amber-700">(테스트 설정: 본인인증 없이 가입이 허용된 상태입니다)</span>}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleVerify}
          disabled={busy || health === 'loading'}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-blue-50/50 px-4 py-3.5 text-base font-bold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <>
              <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              인증 진행 중… 인증 창을 확인해주세요
            </>
          ) : (
            <>📱 휴대폰 본인인증</>
          )}
        </button>
      )}
      {!notConfigured && (
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          통신사 PASS 본인확인으로 이름·휴대폰 번호가 자동 입력됩니다.
        </p>
      )}
      {error && (
        <p role="alert" aria-live="assertive" className="mt-2 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}
