// 공통 계정 컨트롤(데스크톱) — 로그아웃: 로그인/회원가입 / 로그인: 아바타 + 드롭다운.
// 모든 표면(홈·대표자·컨설턴트·내 도구함·상품·진단)에서 동일하게 사용해 로그인 상태를 통일한다.
// 드롭다운은 외부 클릭·ESC·라우트 이동 시 닫힌다.
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { accountEmail, displayName, memberTypeLabel, resolveAvatarUrl } from '../../lib/accountDisplay'
import { loginPathWithNext } from '../../lib/authRouting'
import Avatar from './Avatar'

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function AccountMenu({ className = '' }: { className?: string }) {
  const { user, profile, roles, memberType, needsOnboarding, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = useCallback(() => setOpen(false), [])

  // 라우트 변경 시 닫기
  useEffect(() => { setOpen(false) }, [location.pathname, location.search, location.hash])

  // 외부 클릭 · ESC 닫기
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // ── 로그아웃 상태 ──
  if (!user) {
    const next = loginPathWithNext(location.pathname + location.search)
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link
          to={next}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-700"
        >
          회원가입
        </Link>
      </div>
    )
  }

  // ── 로그인 상태 ──
  const name = displayName(user, profile)
  const email = accountEmail(user, profile)
  const typeLabel = memberTypeLabel({ roles, memberType, needsOnboarding })
  const avatarUrl = resolveAvatarUrl(user)
  const bothRoles = (roles.includes('ceo') || memberType === 'business') && (roles.includes('consultant') || memberType === 'consultant')

  async function handleSignOut() {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  const itemClass =
    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none'

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        <Avatar name={name} imageUrl={avatarUrl} size={32} />
        <span className="hidden max-w-[8rem] truncate text-sm font-bold text-slate-800 sm:inline">{name}</span>
        <span className="text-slate-400"><ChevronDown /></span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl [word-break:keep-all]"
        >
          {/* 상단: 이름 · 이메일 · 회원유형 */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3.5">
            <Avatar name={name} imageUrl={avatarUrl} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-900">{name}</p>
              {email && <p className="truncate text-xs font-medium text-slate-500">{email}</p>}
              {typeLabel && (
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-black ${needsOnboarding ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                  {typeLabel}
                </span>
              )}
            </div>
          </div>

          <nav className="p-1.5" aria-label="계정 메뉴">
            {needsOnboarding && (
              <Link to="/auth/onboarding" role="menuitem" className={`${itemClass} text-amber-700`} onClick={close}>
                <span aria-hidden>✳️</span> 가입 완료하기
              </Link>
            )}
            <Link to="/mypage" role="menuitem" className={itemClass} onClick={close}>
              <span aria-hidden>👤</span> 마이페이지
            </Link>
            <Link to="/my-tools" role="menuitem" className={itemClass} onClick={close}>
              <span aria-hidden>🧰</span> 내 도구함
            </Link>
            <Link to="/my-projects" role="menuitem" className={itemClass} onClick={close}>
              <span aria-hidden>📁</span> 내 프로젝트
            </Link>
            <Link to="/mypage#roles" role="menuitem" className={itemClass} onClick={close}>
              <span aria-hidden>🔀</span> {bothRoles ? '역할 전환·관리' : '역할 추가'}
            </Link>
            {isAdmin && (
              <Link to="/admin" role="menuitem" className={itemClass} onClick={close}>
                <span aria-hidden>🛠️</span> 관리자
              </Link>
            )}
            <button type="button" role="menuitem" onClick={handleSignOut} className={`${itemClass} w-full text-slate-500`}>
              <span aria-hidden>↩️</span> 로그아웃
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
