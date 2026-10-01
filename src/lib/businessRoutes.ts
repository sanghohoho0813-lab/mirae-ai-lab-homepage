// 대표님용 페이지 경로와 헤더 메뉴를 한곳에서 관리한다.
// 헤더 메뉴는 AX 페이지의 구간을 가리킨다(상세 안내를 다시 보이면 예전처럼 상세 안내 앵커를 가리킨다).
//
// 흐름: / → /business-services(2-Track 선택) → ① /business-services/ax-start(AX: 히어로 → 소개 영상 2편 → 직접 만든 화면 22개 → FAQ → 실제 프로젝트 영상 → 마무리)
//                                                → 3분 진단 → 상담
//                                            ② /business-services/venture-mvp(기술사업·MVP: 히어로 → 소개 영상 → 예시 10개) → 상담
// AX 상세 안내(/business-services/ax, 스토리 04~12)는 잠시 숨김 — 들어오면 AX 페이지로 보낸다. 다시 보이려면 SHOW_AX_GUIDE = true
export const BUSINESS_CHOOSER_PATH = '/business-services'
export const AX_START_PATH = '/business-services/ax-start'
export const AX_GUIDE_PATH = '/business-services/ax'
export const VENTURE_MVP_PATH = '/business-services/venture-mvp'

export const SHOW_AX_GUIDE = false

/** 업종별 AX·MVP 화면이 모여 있는 곳 — 상세 안내를 숨긴 동안에는 AX 페이지의 '직접 만든 화면 22개' */
export const AX_SAMPLES_HREF = SHOW_AX_GUIDE ? `${AX_GUIDE_PATH}#portfolio` : `${AX_START_PATH}#samples`

/** 숨긴 상세 안내의 #앵커 로 들어온 주소를 AX 페이지의 같은 성격 구간으로 옮긴다 */
export function axStartHashFor(guideHash: string) {
  const id = guideHash.replace(/^#/, '')
  if (id === 'real-projects') return '#real-projects-film'
  if (['portfolio', 'mvp-refs'].includes(id)) return '#samples'
  if (id === 'faq' || id === 'cta') return `#${id}`
  return ''
}

export const BUSINESS_NAV = SHOW_AX_GUIDE
  ? ([
      { href: `${AX_GUIDE_PATH}#portfolio`, label: 'AX Preview' },
      { href: `${AX_GUIDE_PATH}#real-projects`, label: '실제 프로젝트' },
      { href: `${AX_GUIDE_PATH}#ax-definition`, label: 'AX란' },
    ] as const)
  : ([
      { href: `${AX_START_PATH}#films`, label: 'AX 소개 영상' },
      { href: `${AX_START_PATH}#samples`, label: 'AX Preview' },
      { href: `${AX_START_PATH}#faq`, label: '자주 묻는 질문' },
    ] as const)

/** 직접 만든 샘플 모아보기 — 어느 상품 페이지에도 속하지 않는 중립 페이지(산업별 AX + 아이디어 MVP).
 *  2주 기술사업 빌드 페이지의 '샘플 보기'가 AX 상품 페이지로 넘어가지 않게 이리로 보낸다. */
export const SAMPLES_PATH = '/business-services/samples'
export type SampleTab = 'all' | 'ax' | 'mvp'
/** 탭을 골라 연다 — 예: samplesHref('ax') → /business-services/samples?tab=ax */
export const samplesHref = (tab?: Exclude<SampleTab, 'all'>) => (tab ? `${SAMPLES_PATH}?tab=${tab}` : SAMPLES_PATH)
