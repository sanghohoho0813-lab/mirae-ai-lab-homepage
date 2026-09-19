// /business-services/venture-mvp 상세 이미지 15장.
// Drive '특허&벤처&&MVP 1~15.png' 를 public/business/venture-mvp/01~15 로 저장했다 — 순서는 절대 바꾸지 않는다.
// 원본 PNG 를 그대로 두고 WebP(q90) 를 함께 둔다. width/height 는 원본 픽셀값 — 자리를 미리 잡아 CLS 를 막는다.
// 장마다 세로 비율이 다르므로(1.25 ~ 2.33) 고정 높이·object-cover·crop 은 쓰지 않는다.
export type VentureMvpImage = { n: string; w: number; h: number }

export const VENTURE_MVP_DIR = '/business/venture-mvp'

export const VENTURE_MVP_IMAGES: readonly VentureMvpImage[] = [
  { n: '01', w: 821, h: 1916 },
  { n: '02', w: 941, h: 1672 },
  { n: '03', w: 941, h: 1672 },
  { n: '04', w: 821, h: 1916 },
  { n: '05', w: 971, h: 1619 },
  { n: '06', w: 971, h: 1619 },
  { n: '07', w: 971, h: 1619 },
  { n: '08', w: 821, h: 1916 },
  { n: '09', w: 821, h: 1916 },
  { n: '10', w: 941, h: 1672 },
  { n: '11', w: 1122, h: 1402 },
  { n: '12', w: 1122, h: 1402 },
  { n: '13', w: 1122, h: 1402 },
  { n: '14', w: 1122, h: 1402 },
  { n: '15', w: 1122, h: 1402 },
]
