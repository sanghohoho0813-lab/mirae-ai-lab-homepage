// 회원가입 유도 띠배너 — 비로그인 방문자에게만 노출.
// "지금 가입하면 5,000원 쿠폰 즉시 지급" → /signup.
// - 로그인(회원가입 완료) 사용자에겐 렌더하지 않음.
// - ✕: 이번 방문에서만 닫기.  "다시 안 보기" 체크: 앞으로 계속 숨김(localStorage 저장).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { SIGNUP_COUPON_AMOUNT, formatWon } from '../lib/coupons'

const HIDE_KEY = 'miraelab.signupCouponBanner.hidden'

function readHidden(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(HIDE_KEY) === '1'
  } catch {
    return false
  }
}

export default function CouponSignupBanner() {
  const { user, loading } = useAuth()
  const [hidden, setHidden] = useState(true) // 초기엔 숨김 → localStorage 확인 후 결정 (깜빡임 방지)
  const [closed, setClosed] = useState(false) // 이번 방문만 닫기

  useEffect(() => {
    setHidden(readHidden())
  }, [])

  function hideForever() {
    try {
      window.localStorage.setItem(HIDE_KEY, '1')
    } catch {
      /* 저장 실패해도 이번 방문은 숨김 처리 */
    }
    setHidden(true)
  }

  if (loading || user || hidden || closed) return null

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-2.5 text-[0.88rem] font-bold text-slate-900 sm:text-[0.95rem]">
      <Link to="/signup" className="flex flex-1 items-center justify-center gap-2 text-center transition-opacity hover:opacity-80">
        <span aria-hidden>🎁</span>
        지금 회원가입하면 <b className="font-black">{formatWon(SIGNUP_COUPON_AMOUNT)} 쿠폰</b> 즉시 지급
        <span aria-hidden className="font-black">→</span>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5">
        <label className="flex cursor-pointer select-none items-center gap-1 text-[0.7rem] font-semibold text-slate-800/75 hover:text-slate-900 sm:text-[0.75rem]">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 accent-slate-900"
            onChange={(e) => { if (e.target.checked) hideForever() }}
          />
          다시 안 보기
        </label>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="닫기"
          className="grid h-6 w-6 place-items-center rounded-full text-slate-800/70 transition-colors hover:bg-slate-900/10 hover:text-slate-900"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
