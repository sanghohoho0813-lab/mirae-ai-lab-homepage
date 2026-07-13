// 소셜 로그인/가입 버튼 — 카카오(공식 노랑) > 구글(흰 배경+테두리) 순.
// 실제 Supabase OAuth(PKCE, /auth/callback 복귀). Provider 미설정 시 원문 오류 대신 쉬운 한국어 안내.
import { useState } from 'react'
import { useAuth, type OAuthProvider } from '../../lib/auth'
import { trackAuthEvent } from '../../lib/authAnalytics'

const PROVIDER_LABEL: Record<OAuthProvider, string> = { kakao: '카카오', google: 'Google' }

export default function SocialAuthButtons({
  mode = 'login',
  next,
  disabled,
}: {
  /** login: '~로 계속하기' / signup: '~로 시작하기' */
  mode?: 'login' | 'signup'
  /** 인증 완료 후 복귀할 내부 경로 */
  next?: string | null
  disabled?: boolean
}) {
  const { signInWithOAuth, configured } = useAuth()
  const [busy, setBusy] = useState<OAuthProvider | null>(null)
  const [notice, setNotice] = useState('')

  const suffix = mode === 'signup' ? '시작하기' : '계속하기'

  async function handle(provider: OAuthProvider) {
    if (busy) return // 중복 클릭 방지
    setNotice('')
    setBusy(provider)
    trackAuthEvent('oauth_started', { provider })
    const result = await signInWithOAuth(provider, next)
    if (!result.ok) {
      trackAuthEvent('oauth_failed', { provider, failureCategory: 'start_failed' })
      const msg = result.error ?? ''
      if (msg.includes('설정 중')) {
        setNotice(`현재 ${PROVIDER_LABEL[provider]} 로그인을 설정하고 있습니다. 이메일 로그인 또는 ${provider === 'kakao' ? 'Google' : '카카오'} 로그인을 이용해주세요.`)
      } else {
        setNotice(msg || `${PROVIDER_LABEL[provider]} 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.`)
      }
      setBusy(null)
    }
    // 성공 시 브라우저가 provider 로 리다이렉트되므로 busy 유지
  }

  const off = disabled || !configured

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handle('kakao')}
        disabled={off || busy !== null}
        aria-label={`카카오로 ${suffix}`}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3.5 text-base font-bold text-[#191600] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="#191600">
          <path d="M12 3C6.48 3 2 6.54 2 10.9c0 2.79 1.85 5.24 4.64 6.63l-.97 3.6c-.08.3.26.55.53.38l4.3-2.86c.49.05.99.08 1.5.08 5.52 0 10-3.54 10-7.83S17.52 3 12 3Z" />
        </svg>
        {busy === 'kakao' ? '카카오로 이동 중…' : `카카오로 ${suffix}`}
      </button>
      <button
        type="button"
        onClick={() => handle('google')}
        disabled={off || busy !== null}
        aria-label={`Google로 ${suffix}`}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z" />
          <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.6 4.59 1.79l3.44-3.44A11.96 11.96 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.87 8.87 4.76 12 4.76Z" />
        </svg>
        {busy === 'google' ? 'Google로 이동 중…' : `Google로 ${suffix}`}
      </button>
      {notice && (
        <p role="alert" aria-live="polite" className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium leading-relaxed text-amber-800">
          {notice}
        </p>
      )}
    </div>
  )
}
