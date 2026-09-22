// /business-services/venture-mvp 상세 이미지 15장.
// Drive '특허&벤처&&MVP 1~15.png' 를 public/business/venture-mvp/01~15 로 저장했다 — 순서는 절대 바꾸지 않는다.
// 원본 PNG 를 그대로 두고 WebP(q90) 를 함께 둔다. width/height 는 원본 픽셀값 — 자리를 미리 잡아 CLS 를 막는다.
// 장마다 세로 비율이 다르므로(1.25 ~ 2.33) 고정 높이·object-cover·crop 은 쓰지 않는다.
export type VentureMvpImage = { n: string; w: number; h: number }

export const VENTURE_MVP_DIR = '/business/venture-mvp'

export type VentureMvpHotspotAction = 'consult' | 'samples' | 'venture-benefit'
export type VentureMvpHotspot = {
  /** 스크린리더용 이름 — 그림 속 버튼 글자 그대로 */
  label: string
  action: VentureMvpHotspotAction
  /** 이미지 크기 기준 % (왼쪽·위·너비·높이) */
  x: number
  y: number
  w: number
  h: number
}

/** 이미지 안에 그려진 버튼 위에 얹는 실제 링크 자리.
 *  그림 버튼을 눌러도 아무 일이 없던 것을 막는다. 값은 원본 PNG 에서 버튼 색 영역을 측정한 % 좌표라
 *  이미지가 어떤 폭으로 그려져도 같은 자리에 겹친다. 위아래 1% 정도는 손가락 여유로 더 잡았다. */
export const VENTURE_MVP_HOTSPOTS: Partial<Record<string, VentureMvpHotspot[]>> = {
  '01': [{ label: '우리 회사도 만들어보기 — 상담 신청', action: 'consult', x: 5.7, y: 77.5, w: 88.4, h: 6.5 }],
  '04': [{ label: '22개 전체 샘플 직접 보기', action: 'samples', x: 5.6, y: 95.3, w: 88.8, h: 4.5 }],
  '09': [{ label: '벤처기업확인 혜택 보기', action: 'venture-benefit', x: 16.3, y: 86.2, w: 67.4, h: 6.5 }],
  '15': [
    { label: '우리 회사도 가능한지 1분 체크 — 상담 신청', action: 'consult', x: 5.9, y: 65.4, w: 88.5, h: 8.6 },
    { label: '22개 샘플 먼저 보기', action: 'samples', x: 27.2, y: 78.6, w: 45.9, h: 8.5 },
  ],
}

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
