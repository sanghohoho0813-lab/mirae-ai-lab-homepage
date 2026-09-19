// 유입 트랙 — 대표님이 선택 페이지에서 고른 방향(Full AX / 기술사업·MVP)을 진단·상담까지 들고 간다.
//  - 주소의 ?interest=ax|venture-mvp 가 있으면 그것을 쓰고 같은 탭(sessionStorage)에 기억한다.
//  - 주소에 없으면 기억해 둔 값을 쓴다(트랙 페이지 → 헤더 CTA 처럼 주소 없이 넘어오는 경우).
//  - DB 마이그레이션 없이 남긴다: 진단 리드의 interests[] 라벨('유입 트랙: …') + 세션 utm_content('interest=…').
export type InterestTrack = 'ax' | 'venture-mvp'

export const INTEREST_PARAM = 'interest'

export const INTEREST_LABEL: Record<InterestTrack, string> = {
  ax: 'Full AX',
  'venture-mvp': '기술사업·MVP',
}

/** interests[] 에 남기는 라벨 접두 — 메일·관리자 화면에서 이 접두로 유입 트랙을 알아본다 */
export const INTEREST_TRACK_PREFIX = '유입 트랙: '

const KEY = 'miraeInterestTrack'

export function isInterestTrack(v: unknown): v is InterestTrack {
  return v === 'ax' || v === 'venture-mvp'
}

export function readInterestFromSearch(search: string): InterestTrack | null {
  try {
    const v = new URLSearchParams(search).get(INTEREST_PARAM)
    return isInterestTrack(v) ? v : null
  } catch {
    return null
  }
}

export function rememberInterest(track: InterestTrack) {
  try {
    sessionStorage.setItem(KEY, track)
  } catch {
    /* sessionStorage 불가 환경 무시 */
  }
}

export function loadInterest(): InterestTrack | null {
  try {
    const v = sessionStorage.getItem(KEY)
    return isInterestTrack(v) ? v : null
  } catch {
    return null
  }
}

/** 주소의 ?interest= 를 우선 적용해 기억한 뒤, 현재 트랙을 돌려준다 */
export function syncInterestFromUrl(search: string): InterestTrack | null {
  const fromUrl = readInterestFromSearch(search)
  if (fromUrl) rememberInterest(fromUrl)
  return fromUrl ?? loadInterest()
}

/** 경로에 ?interest= 를 붙인다 (이미 쿼리가 있으면 & 로 잇고, #앵커는 뒤에 유지) */
export function withInterest(path: string, track: InterestTrack | null | undefined): string {
  if (!track) return path
  const [base, hash] = path.split('#')
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}${INTEREST_PARAM}=${track}${hash ? `#${hash}` : ''}`
}

/** 리드 interests[] 에 넣는 라벨 */
export function interestTrackLabel(track: InterestTrack): string {
  return `${INTEREST_TRACK_PREFIX}${INTEREST_LABEL[track]}`
}
