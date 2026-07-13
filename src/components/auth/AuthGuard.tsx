// AuthGuard — 인증 상태 계층 분리.
//   public              : 누구나 (가드 불필요 — 그대로 렌더)
//   authenticated       : 로그인 필요 → /login?next=...
//   onboarding-required : 로그인했지만 가입 미완료 → /auth/onboarding?next=...
//   role-required       : 특정 역할 필요 → 역할 안내 + 즉시 역할 추가 (차단 대신 유도)
//   admin-required      : 관리자는 기존 페이지 자체 가드 유지 (여기선 통과)
// 기존 회원 보호: 역할이 하나도 없는 레거시 계정은 role 가드를 통과시킵니다(사용 차단 금지).
// 무한 리디렉션 방지: /login·/auth/* 경로에는 이 가드를 사용하지 않습니다.
import { useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { addRole } from '../../lib/identityVerification'
import { loginPathWithNext, type AppRole } from '../../lib/authRouting'

export default function AuthGuard({
  children,
  role,
  requireOnboarding = true,
}: {
  children: ReactNode
  /** 필요 역할 (없으면 로그인만 요구) */
  role?: Exclude<AppRole, 'admin'>
  /** 가입(온보딩) 완료까지 요구할지 */
  requireOnboarding?: boolean
}) {
  const { loading, user, needsOnboarding, roles, hasRole, isAdmin, configured, getAccessToken, refreshProfile } = useAuth()
  const location = useLocation()
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const here = location.pathname + location.search

  // env 미설정 환경 — 각 페이지의 자체 안내(configured=false 배너)에 위임
  if (!configured) return <>{children}</>
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-slate-50">
        <span aria-hidden className="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
      </div>
    )
  }
  if (!user) return <Navigate to={loginPathWithNext(here)} replace />
  if (requireOnboarding && needsOnboarding) {
    return <Navigate to={`/auth/onboarding?next=${encodeURIComponent(here)}`} replace />
  }

  const memberRoles = roles.filter((r) => r !== 'admin')
  // 역할 가드: 관리자·해당 역할 보유·레거시(역할 정보 없음) 계정은 통과
  if (role && !hasRole(role) && !isAdmin && memberRoles.length > 0) {
    const label = role === 'consultant' ? '컨설턴트' : '대표자'
    const handleAdd = async () => {
      setAddError('')
      setAdding(true)
      const token = await getAccessToken()
      const r = token ? await addRole(token, role) : { ok: false as const, error: '로그인 세션이 만료되었습니다.' }
      if (r.ok) await refreshProfile()
      else setAddError(r.error ?? '역할을 추가하지 못했습니다.')
      setAdding(false)
    }
    return (
      <div className="grid min-h-dvh place-items-center bg-slate-50 px-5 [word-break:keep-all]">
        <div className="w-full max-w-[440px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-black text-slate-900">{label} 전용 기능이에요</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            이 기능은 {label} 역할로 이용할 수 있습니다. 지금 바로 {label} 역할을 추가할 수 있어요.
          </p>
          {addError && <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{addError}</p>}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {adding ? '추가 중…' : `${label} 역할 추가하기`}
            </button>
            <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-800">홈으로</Link>
          </div>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
