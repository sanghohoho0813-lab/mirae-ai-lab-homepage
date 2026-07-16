// 회원 쿠폰 — 조회(본인) 전용 클라이언트 레이어.
// 발급은 서버(api/identity.ts 온보딩 완료 시 service_role), 차감은 결제 재개 시 서버 prepare 에서 처리.
import { supabase } from './supabase'

export type UserCoupon = {
  id: string
  kind: string
  code: string | null
  amount: number
  status: 'active' | 'used' | 'expired' | 'revoked'
  issued_at: string
  used_at: string | null
  expires_at: string | null
}

/** 가입 축하 쿠폰 금액(원) — 유도 문구·발급 금액 표시 공용 */
export const SIGNUP_COUPON_AMOUNT = 5000

export function formatWon(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`
}

/** 로그인 사용자의 쿠폰 목록 (RLS: 본인만) */
export async function loadMyCoupons(): Promise<UserCoupon[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('user_coupons')
    .select('id, kind, code, amount, status, issued_at, used_at, expires_at')
    .order('issued_at', { ascending: false })
  if (error) return []
  return (data ?? []) as UserCoupon[]
}

/** 사용 가능한(active) 쿠폰 합계 금액 */
export function activeCouponAmount(coupons: UserCoupon[]): number {
  return coupons.filter((c) => c.status === 'active').reduce((s, c) => s + c.amount, 0)
}
