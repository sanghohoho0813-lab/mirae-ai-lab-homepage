// 대표님용 페이지 경로와 헤더 메뉴를 한곳에서 관리한다.
// 스토리 04(AX의 정의)부터는 홈이 아니라 AX 상세 안내에 있으므로, 헤더 메뉴도 그쪽 앵커를 가리킨다.
//
// 흐름: / → /business-services(2-Track 선택) → ① /business-services/ax-start(AX 홈: 히어로+스토리 01~03)
//                                             → /business-services/ax(AX 상세 안내) → 3분 진단 → 상담
//                                            ② /business-services/venture-mvp(기술사업·MVP 15장) → 3분 진단 → 상담
export const BUSINESS_CHOOSER_PATH = '/business-services'
export const AX_START_PATH = '/business-services/ax-start'
export const AX_GUIDE_PATH = '/business-services/ax'
export const VENTURE_MVP_PATH = '/business-services/venture-mvp'

export const BUSINESS_NAV = [
  { href: `${AX_GUIDE_PATH}#portfolio`, label: 'AX Preview' },
  { href: `${AX_GUIDE_PATH}#real-projects`, label: '실제 프로젝트' },
  { href: `${AX_GUIDE_PATH}#ax-definition`, label: 'AX란' },
] as const
