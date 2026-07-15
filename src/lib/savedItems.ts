// 찜(좋아요)·장바구니 — localStorage 기반 (비회원 포함 즉시 사용, 서버 불필요).
// 상품 식별은 slug. 변경 시 커스텀 이벤트로 모든 구독 컴포넌트 동기화.
import { useEffect, useState } from 'react'

const LIKES_KEY = 'mirae:likes:v1'
const CART_KEY = 'mirae:cart:v1'
const EVENT = 'mirae:saved-changed'

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    const v = raw ? JSON.parse(raw) : []
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function write(key: string, slugs: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(slugs))
  } catch {
    /* storage 불가 환경은 조용히 무시 */
  }
  window.dispatchEvent(new CustomEvent(EVENT))
}

export const getLikes = () => read(LIKES_KEY)
export const getCart = () => read(CART_KEY)

/** 토글 후 현재 포함 여부 반환 */
export function toggleLike(slug: string): boolean {
  const cur = getLikes()
  const has = cur.includes(slug)
  write(LIKES_KEY, has ? cur.filter((s) => s !== slug) : [...cur, slug])
  return !has
}

export function toggleCart(slug: string): boolean {
  const cur = getCart()
  const has = cur.includes(slug)
  write(CART_KEY, has ? cur.filter((s) => s !== slug) : [...cur, slug])
  return !has
}

/** 찜·장바구니 실시간 구독 훅 */
export function useSavedItems(): { likes: string[]; cart: string[] } {
  const [state, setState] = useState(() => ({ likes: getLikes(), cart: getCart() }))
  useEffect(() => {
    const sync = () => setState({ likes: getLikes(), cart: getCart() })
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return state
}
