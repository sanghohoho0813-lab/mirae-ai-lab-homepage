// /auth/callback — OAuth(PKCE) 복귀 + 이메일 로그인 후 공통 분기점.
// code 교환은 supabase-js(PKCE·detectSessionInUrl)가 수행하며, 여기서는 세션 확립을 기다렸다가
// 온보딩 필요 여부·역할별 홈·next 경로로 분기합니다. 오류는 원문 JSON 없이 한국어로 안내합니다.
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { roleHome, sanitizeNext } from '../../lib/authRouting'
import { trackAuthEvent } from '../../lib/authAnalytics'

function friendlyOAuthError(code: string | null, desc: string | null): string {
  const d = (desc ?? '').toLowerCase()
  if (code === 'access_denied' || d.includes('cancel') || d.includes('denied')) {
    return '로그인이 취소되었습니다. 다시 시도하시거나 다른 방법으로 로그인해주세요.'
  }
  if (d.includes('provider is not enabled') || d.includes('unsupported provider')) {
    return '이 소셜 로그인은 아직 설정 중입니다. 이메일 로그인을 이용해주세요.'
  }
  if (d.includes('email')) {
    return '소셜 계정에서 이메일 정보를 받지 못했습니다. 계정의 이메일 제공에 동의하시거나 이메일 로그인을 이용해주세요.'
  }
  return '로그인을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function AuthCallbackPage() {
  const { loading, user, profile, roles, memberType, needsOnboarding, configured } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = sanitizeNext(searchParams.get('next'))
  const errParam = searchParams.get('error')
  const errDesc = searchParams.get('error_description')
  const [error, setError] = useState<string | null>(errParam ? friendlyOAuthError(errParam, errDesc) : null)
  const [waitedOut, setWaitedOut] = useState(false)
  const handledRef = useRef(false)

  useEffect(() => {
    if (errParam) trackAuthEvent('oauth_failed', { failureCategory: errParam.slice(0, 40) })
    // code 교환(백그라운드) 대기 상한 — 10초 안에 세션이 없으면 안내
    const t = setTimeout(() => setWaitedOut(true), 10_000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (error || loading || handledRef.current) return
    if (!user) {
      if (waitedOut) setError('로그인 세션을 확인하지 못했습니다. 다시 로그인해주세요.')
      return
    }
    if (!profile) return // 프로필 로딩 대기
    handledRef.current = true

    const provider = (user.app_metadata?.provider as string | undefined) ?? 'email'
    if (provider === 'google' || provider === 'kakao') {
      trackAuthEvent('oauth_succeeded', { provider })
      // 마지막 로그인 수단 기록 (컬럼 미존재 환경에서도 흐름 유지)
      if (supabase) {
        void supabase.from('profiles')
          .update({ last_login_provider: provider, last_login_at: new Date().toISOString() })
          .eq('id', user.id)
          .then((r) => {
            if (r.error && supabase) void supabase.from('profiles').update({ last_login_at: new Date().toISOString() }).eq('id', user.id)
          })
      }
    }
    if (needsOnboarding) {
      navigate(`/auth/onboarding${next ? `?next=${encodeURIComponent(next)}` : ''}`, { replace: true })
      return
    }
    navigate(next ?? roleHome(roles, memberType), { replace: true })
  }, [error, loading, user, profile, needsOnboarding, roles, memberType, next, navigate, waitedOut])

  return (
    <div className="grid min-h-dvh place-items-center bg-slate-50 px-5 text-slate-900 [word-break:keep-all]">
      <div className="w-full max-w-[440px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {!configured ? (
          <p className="text-base font-semibold text-slate-600">로그인 기능을 준비하고 있습니다.</p>
        ) : error ? (
          <>
            <p className="text-lg font-black text-slate-900">로그인에 문제가 있어요</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500" role="alert">{error}</p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link to="/login" className="flex min-h-[48px] items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-700">
                로그인 화면으로
              </Link>
              <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-800">홈으로</Link>
            </div>
          </>
        ) : (
          <>
            <span aria-hidden className="mx-auto block h-8 w-8 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
            <p className="mt-4 text-base font-bold text-slate-700" aria-live="polite">로그인을 확인하고 있어요…</p>
            <p className="mt-1 text-sm text-slate-400">잠시만 기다려주세요.</p>
          </>
        )}
      </div>
    </div>
  )
}
