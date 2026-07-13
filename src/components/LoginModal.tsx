// 로그인 유도 모달 — 결제·계약내역 등 로그인 필요한 동작 앞에서 표시.
// 소셜(카카오>구글) + 이메일 로그인/회원가입 경로 안내. 로그인 후 원래 경로로 복귀(redirect).
import { useLocation, useNavigate } from 'react-router-dom'
import SocialAuthButtons from './auth/SocialAuthButtons'

export default function LoginModal({
  open,
  onClose,
  title = '로그인이 필요해요',
  message = '결제와 계약내역 확인은 로그인 후 이용할 수 있습니다.',
  redirectTo,
}: {
  open: boolean
  onClose?: () => void
  title?: string
  message?: string
  redirectTo?: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  if (!open) return null
  const target = redirectTo ?? location.pathname + location.search
  const q = `?redirect=${encodeURIComponent(target)}`

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{message}</p>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="닫기" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          )}
        </div>

        <div className="mt-6">
          <SocialAuthButtons />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />또는<span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => navigate(`/login${q}`)}
            className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
          >
            이메일로 로그인
          </button>
          <button
            type="button"
            onClick={() => navigate(`/signup${q}`)}
            className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
