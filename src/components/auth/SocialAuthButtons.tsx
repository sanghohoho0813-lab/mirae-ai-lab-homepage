// 소셜 로그인 버튼 — 카카오 > 구글 순 (로그인·회원가입 공용).
// 실제 Supabase Auth OAuth 연동. Supabase 대시보드에서 Google/Kakao provider 설정 필요(docs/AUTH_SETUP.md).
import { useState } from 'react'
import { useAuth, type OAuthProvider } from '../../lib/auth'

export default function SocialAuthButtons({ disabled }: { disabled?: boolean }) {
  const { signInWithOAuth, configured } = useAuth()
  const [busy, setBusy] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState('')

  async function handle(provider: OAuthProvider) {
    setError('')
    setBusy(provider)
    const result = await signInWithOAuth(provider)
    if (!result.ok) {
      setError(result.error ?? '소셜 로그인에 실패했습니다.')
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3.5 text-base font-bold text-[#191600] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden className="text-lg">💬</span>
        {busy === 'kakao' ? '카카오로 이동 중…' : '카카오로 계속하기'}
      </button>
      <button
        type="button"
        onClick={() => handle('google')}
        disabled={off || busy !== null}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden className="text-lg font-black text-[#4285F4]">G</span>
        {busy === 'google' ? '구글로 이동 중…' : 'Google로 계속하기'}
      </button>
      {error && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>}
    </div>
  )
}
