// 미래AI랩이 직접 기획·개발한 MVP 레퍼런스 10개 — 홈 포트폴리오 캐러셀의 단일 소스.
//
// ⚠️ 표기 원칙
//  - 고객사 실적이 아니라 자체 제작 레퍼런스 데모라는 점을 섹션에 명시한다.
//  - 미리보기 이미지는 각 사이트의 실제 첫 화면을 캡처해 /public/portfolio 에 저장한 것이다.
//  - 링크는 새 탭으로 열고 rel="noopener noreferrer" 를 붙인다.

export type PortfolioSample = {
  slug: string
  /** 서비스명 */
  name: string
  /** 무엇을 하는 서비스인지 한 줄 */
  kind: string
  /** 화면에서 확인할 수 있는 것 */
  summary: string
  /** 기능 분류 2~3개 */
  tags: string[]
  url: string
  /** 캡처 이미지(원본/모바일) */
  img: string
  imgSm: string
  alt: string
}

export const PORTFOLIO_SAMPLES: PortfolioSample[] = [
  {
    slug: 'pawbeauty',
    name: 'PawBeauty',
    kind: '반려동물 미용 예약',
    summary: '미용실 찾기부터 예약, 내 반려동물 관리까지 한 흐름으로 이어집니다.',
    tags: ['예약·스케줄', '고객관리'],
    url: 'https://sample-animalbeauty-booking-mvp.vercel.app/',
    img: '/portfolio/pawbeauty.webp',
    imgSm: '/portfolio/pawbeauty-sm.webp',
    alt: 'PawBeauty 반려동물 미용 예약 서비스 첫 화면',
  },
  {
    slug: 'expertmatch',
    name: 'ExpertMatch',
    kind: '전문가 상담 매칭',
    summary: '창업·마케팅·세무 전문가를 고르고 필요한 시간에 바로 상담을 예약합니다.',
    tags: ['매칭', '상담예약'],
    url: 'https://sample-expertmatch-mvp.vercel.app/',
    img: '/portfolio/expertmatch.webp',
    imgSm: '/portfolio/expertmatch-sm.webp',
    alt: 'ExpertMatch 전문가 상담 매칭 플랫폼 첫 화면',
  },
  {
    slug: 'localmom',
    name: '로컬맘',
    kind: '산지직송 신선식품 커머스',
    summary: '지역 농가와 소비자를 바로 잇는 주문·배송 커머스입니다.',
    tags: ['커머스', '주문·배송'],
    url: 'https://sample-localmat-commerce-mvp.vercel.app/',
    img: '/portfolio/localmom.webp',
    imgSm: '/portfolio/localmom-sm.webp',
    alt: '로컬맘 산지직송 신선식품 커머스 첫 화면',
  },
  {
    slug: 'eduplaza',
    name: 'EduPlaza',
    kind: '온라인 학습 플랫폼',
    summary: '강의 수강과 학습 진도, 퀴즈와 학습노트를 한곳에서 관리합니다.',
    tags: ['교육', '진도관리'],
    url: 'https://sample4-eduplaza-learning-mvp.vercel.app/',
    img: '/portfolio/eduplaza.webp',
    imgSm: '/portfolio/eduplaza-sm.webp',
    alt: 'EduPlaza 온라인 학습 플랫폼 첫 화면',
  },
  {
    slug: 'insightai',
    name: 'InsightAI',
    kind: 'AI 데이터 분석 SaaS',
    summary: '데이터를 올리면 핵심 변화와 이상징후, 예측과 다음 행동까지 정리해 줍니다.',
    tags: ['AI 분석', '리포트'],
    url: 'https://sample5-insight-ai-analytics-mvp.vercel.app/',
    img: '/portfolio/insightai.webp',
    imgSm: '/portfolio/insightai-sm.webp',
    alt: 'InsightAI AI 데이터 분석 SaaS 첫 화면',
  },
  {
    slug: 'rescuewalk',
    name: 'RescueWalk',
    kind: '유기견 산책 매칭',
    summary: '가까운 보호소의 아이와 산책 봉사자를 연결합니다.',
    tags: ['매칭', '봉사신청'],
    url: 'https://sample6-rescuewalk-matching-mvp.vercel.app/',
    img: '/portfolio/rescuewalk.webp',
    imgSm: '/portfolio/rescuewalk-sm.webp',
    alt: 'RescueWalk 유기견 산책 매칭 서비스 첫 화면',
  },
  {
    slug: 'cafefocus',
    name: 'CafeFocus',
    kind: '작업하기 좋은 카페 지도',
    summary: '소음·혼잡도·콘센트·Wi-Fi 정보로 지금 갈 카페를 찾아 줍니다.',
    tags: ['지도', '실시간 데이터'],
    url: 'https://sample7-cafefocus-map-mvp-loz4.vercel.app/',
    img: '/portfolio/cafefocus.webp',
    imgSm: '/portfolio/cafefocus-sm.webp',
    alt: 'CafeFocus 작업하기 좋은 카페 지도 첫 화면',
  },
  {
    slug: 'scamshield',
    name: 'ScamShield',
    kind: 'AI 사기문자 판독',
    summary: '의심스러운 문자와 링크를 넣으면 위험 신호를 확인해 줍니다.',
    tags: ['AI 판별', '생활 안전'],
    url: 'https://sample8-scamshield-ai-mvp.vercel.app/',
    img: '/portfolio/scamshield.webp',
    imgSm: '/portfolio/scamshield-sm.webp',
    alt: 'ScamShield AI 사기문자 판독 서비스 첫 화면',
  },
  {
    slug: 'freshfridge',
    name: 'FreshFridge',
    kind: '냉장고 식재료 관리',
    summary: '유통기한이 지나기 전에 먼저 먹도록 알려 주는 생활 관리 서비스입니다.',
    tags: ['생활관리', '알림'],
    url: 'https://sample9-freshfridge-food-mvp.vercel.app/',
    img: '/portfolio/freshfridge.webp',
    imgSm: '/portfolio/freshfridge-sm.webp',
    alt: 'FreshFridge 냉장고 식재료 관리 서비스 첫 화면',
  },
  {
    slug: 'stylecheck',
    name: 'StyleCheck AI',
    kind: '코디 점검 AI',
    summary: '사진과 상황을 넣으면 오늘 코디가 얼마나 어울리는지 확인해 줍니다.',
    tags: ['이미지 AI', '추천'],
    url: 'https://sample10-stylecheck-ai-mvp.vercel.app/',
    img: '/portfolio/stylecheck.webp',
    imgSm: '/portfolio/stylecheck-sm.webp',
    alt: 'StyleCheck AI 코디 점검 서비스 첫 화면',
  },
]

export const PORTFOLIO_SECTION = {
  eyebrow: '직접 만든 서비스',
  title: '이런 서비스도 직접 만들었습니다.',
  lead: '업종이 달라도, 아이디어가 무엇이든 실제 동작하는 화면으로 만들어 드립니다.',
  note: '아래는 미래AI랩이 직접 기획·개발한 MVP 레퍼런스입니다. 고객사 실적이 아니라 자체 제작 데모이며, 카드를 누르면 실제 사이트가 새 창에서 열립니다.',
} as const
