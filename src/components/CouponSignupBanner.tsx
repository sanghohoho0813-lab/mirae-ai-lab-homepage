// 회원가입 유도 띠배너 — 비로그인 방문자에게만 노출.
// "지금 가입하면 5,000원 쿠폰 즉시 지급" → /signup. 로그인 사용자에겐 렌더하지 않음.
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { SIGNUP_COUPON_AMOUNT, formatWon } from '../lib/coupons'

export default function CouponSignupBanner() {
  const { user, loading } = useAuth()
  if (loading || user) return null
  return (
    <Link
      to="/signup"
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-2.5 text-center text-[0.88rem] font-bold text-slate-900 transition-colors hover:from-amber-300 hover:to-amber-200 sm:text-[0.95rem]"
    >
      <span aria-hidden>🎁</span>
      지금 회원가입하면 <b className="font-black">{formatWon(SIGNUP_COUPON_AMOUNT)} 쿠폰</b> 즉시 지급
      <span aria-hidden className="font-black">→</span>
    </Link>
  )
}
