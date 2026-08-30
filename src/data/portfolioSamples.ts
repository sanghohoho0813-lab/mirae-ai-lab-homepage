// 미래AI랩이 직접 기획·개발한 레퍼런스 — 홈 포트폴리오의 단일 소스.
//
//  - AX_PLATFORM_SAMPLES: 대표 포트폴리오 10종. 내부 운영 AX + 고객/거래처 플랫폼 + AI 기능이
//    한 시스템으로 연결된 데모. 카드에서 AX 화면·고객 화면을 각각 열 수 있다.
//  - PORTFOLIO_SAMPLES: 초기 MVP 레퍼런스 10종. 업종·아이디어의 폭을 보여주는 보조 그룹.
//
// ⚠️ 표기 원칙
//  - 고객사 실적이 아니라 자체 제작 레퍼런스 데모라는 점을 섹션에 명시한다.
//  - 미리보기 이미지는 각 사이트의 실제 화면을 캡처해 /public/portfolio 에 저장한 것이다.
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

export type AxPlatformSample = {
  slug: string
  /** 데모 브랜드명 */
  name: string
  /** 업종 */
  industry: string
  /** 무엇과 무엇이 연결되는지 한 줄 */
  line: string
  /** 내부 운영 AX 화면 주소 */
  axUrl: string
  /** 고객·거래처 플랫폼 화면 주소(있는 경우) */
  customerUrl?: string
  /** 고객 화면 대신 거래처 화면일 때의 라벨 */
  customerLabel?: string
  /** 대표 이미지(원본/모바일) — 하이브리드는 고객 화면, 내부형은 AX 대시보드 */
  img: string
  imgSm: string
  /** 하이브리드 카드에 겹쳐 보여줄 AX 대시보드 미니 화면 */
  axImg?: string
  alt: string
}

/** 대표 포트폴리오 — 내부 AX + 플랫폼 + AI가 한 세트인 데모 10종 */
export const AX_PLATFORM_SAMPLES: AxPlatformSample[] = [
  {
    slug: 'materix',
    name: 'MATERIX',
    industry: '산업·건축자재 유통',
    line: '견적·주문·재고·수급 관리와 AI 자재 추천이 연결된 B2B 유통 AX',
    axUrl: 'https://sample20.vercel.app/ax',
    customerUrl: 'https://sample20.vercel.app/',
    customerLabel: '거래처 화면',
    img: '/portfolio/ax/materix.webp',
    imgSm: '/portfolio/ax/materix-sm.webp',
    axImg: '/portfolio/ax/materix-ax.webp',
    alt: 'MATERIX 산업·건축자재 B2B 플랫폼 고객 화면',
  },
  {
    slug: 'lumiere',
    name: 'LUMIÈRE',
    industry: '미용실',
    line: '예약·고객·재방문·멤버십과 AI 스타일 추천이 연결된 살롱 AX',
    axUrl: 'https://sample17-lumiere-hair-salon-hybrid.vercel.app/ax',
    customerUrl: 'https://sample17-lumiere-hair-salon-hybrid.vercel.app/',
    img: '/portfolio/ax/lumiere.webp',
    imgSm: '/portfolio/ax/lumiere-sm.webp',
    axImg: '/portfolio/ax/lumiere-ax.webp',
    alt: 'LUMIÈRE 미용실 고객 예약 플랫폼 첫 화면',
  },
  {
    slug: 'edumaster',
    name: '에듀마스터',
    industry: '학원·교육',
    line: '학생·출결·상담·재등록·이탈 위험과 AI 분석이 연결된 학원 AX',
    axUrl: 'https://sample16-edumaster-academy-hybrid-a-steel.vercel.app/ax',
    customerUrl: 'https://sample16-edumaster-academy-hybrid-a-steel.vercel.app/',
    customerLabel: '학생·학부모 화면',
    img: '/portfolio/ax/edumaster.webp',
    imgSm: '/portfolio/ax/edumaster-sm.webp',
    axImg: '/portfolio/ax/edumaster-ax.webp',
    alt: '에듀마스터 학원 학생·학부모 플랫폼 첫 화면',
  },
  {
    slug: 'autobridge',
    name: '오토브릿지 케어',
    industry: '자동차 정비',
    line: '차량관리·정비예약·정비이력과 AI 점검 추천이 연결된 정비 AX',
    axUrl: 'https://sample15-autobridge-auto-service-ax-omega.vercel.app/ax',
    customerUrl: 'https://sample15-autobridge-auto-service-ax-omega.vercel.app/',
    img: '/portfolio/ax/autobridge.webp',
    imgSm: '/portfolio/ax/autobridge-sm.webp',
    axImg: '/portfolio/ax/autobridge-ax.webp',
    alt: '오토브릿지 케어 자동차 정비 고객 플랫폼 첫 화면',
  },
  {
    slug: 'seum',
    name: '세움정밀솔루션',
    industry: '제조 · 정밀가공',
    line: '견적·수주·생산·품질·납기·원가와 AI 리포트가 연결된 제조 AX',
    axUrl: 'https://sample11-seum-manufacturing-busines.vercel.app/',
    customerUrl: 'https://sample11-seum-manufacturing-busines.vercel.app/portal',
    customerLabel: '거래처 화면',
    img: '/portfolio/ax/seum.webp',
    imgSm: '/portfolio/ax/seum-sm.webp',
    axImg: '/portfolio/ax/seum-ax.webp',
    alt: '세움정밀솔루션 거래처 포털 화면',
  },
  {
    slug: 'vitalon',
    name: 'VITALON',
    industry: '웰니스·피트니스',
    line: '회원·예약·재등록·매출과 AI 웰니스 설계가 연결된 피트니스 AX',
    axUrl: 'https://sample19-vitalon-wellness-fitness-h-swart.vercel.app/business',
    customerUrl: 'https://sample19-vitalon-wellness-fitness-h-swart.vercel.app/',
    img: '/portfolio/ax/vitalon.webp',
    imgSm: '/portfolio/ax/vitalon-sm.webp',
    axImg: '/portfolio/ax/vitalon-ax.webp',
    alt: 'VITALON 웰니스 센터 고객 플랫폼 첫 화면',
  },
  {
    slug: 'veloa',
    name: 'VELOA BEAUTY',
    industry: '뷰티 커머스',
    line: '상품·채널·재고·발주·B2B 거래처와 AI 인사이트가 연결된 커머스 AX',
    axUrl: 'https://sample12-veloa-beauty-commerce-ax.vercel.app/#/ax',
    customerUrl: 'https://sample12-veloa-beauty-commerce-ax.vercel.app/#/shop',
    img: '/portfolio/ax/veloa.webp',
    imgSm: '/portfolio/ax/veloa-sm.webp',
    axImg: '/portfolio/ax/veloa-ax.webp',
    alt: 'VELOA BEAUTY 뷰티 커머스 고객 화면',
  },
  {
    slug: 'livarte',
    name: 'LIVARTÉ',
    industry: '인테리어·리모델링',
    line: '상담·견적·공정·원가 관리와 AI 스타일 찾기가 연결된 인테리어 AX',
    axUrl: 'https://sample18-livarte-interior-remodelin-three.vercel.app/business',
    customerUrl: 'https://sample18-livarte-interior-remodelin-three.vercel.app/',
    img: '/portfolio/ax/livarte.webp',
    imgSm: '/portfolio/ax/livarte-sm.webp',
    axImg: '/portfolio/ax/livarte-ax.webp',
    alt: 'LIVARTÉ 인테리어 고객 플랫폼 첫 화면',
  },
  {
    slug: 'gounsot',
    name: '고운솥 식당',
    industry: '음식점 · F&B',
    line: '매출·메뉴 수익성·수요예측·발주·재방문과 AI 브리핑이 연결된 F&B AX',
    axUrl: 'https://sample14-zeta.vercel.app/ax',
    customerUrl: 'https://sample14-zeta.vercel.app/customer',
    img: '/portfolio/ax/gounsot.webp',
    imgSm: '/portfolio/ax/gounsot-sm.webp',
    axImg: '/portfolio/ax/gounsot-ax.webp',
    alt: '고운솥 식당 고객 화면',
  },
  {
    slug: 'cleanway',
    name: 'CLEANWAY',
    industry: '현장 서비스업',
    line: '일정·현장·품질·재계약·수익성과 AI 운영센터가 연결된 서비스 AX',
    axUrl: 'https://sample13-one.vercel.app/',
    img: '/portfolio/ax/cleanway.webp',
    imgSm: '/portfolio/ax/cleanway-sm.webp',
    alt: 'CLEANWAY 현장 서비스 AX 대시보드 화면',
  },
]

/** 대표 포트폴리오 섹션 문구 */
export const AX_PORTFOLIO_HEAD = {
  eyebrow: 'AX + PLATFORM REFERENCES',
  title: '말 대신, 실제로 만든 시스템을 먼저 보여드립니다.',
  lead: '업종별 내부 운영 AX와 고객·거래처 플랫폼, AI 기능까지 실제로 동작하는 데모입니다.',
  platformNote: '카드마다 AX 화면과 고객·거래처 화면을 각각 열어볼 수 있습니다.',
  note: '모든 데모는 미래AI랩이 직접 기획·개발한 자체 레퍼런스이며, 화면 속 수치는 가상의 시연 데이터입니다.',
} as const

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
  /** 섹션 첫 줄 — 지금 무엇이 기본이고 무엇이 필수인지 */
  kicker: '이제는 웹·앱은 기본,\nAX를 접목한 우리 회사만의 웹·앱이 필수입니다.',
  lead: '업종이 달라도, 아이디어가 무엇이든 실제 동작하는 화면으로 만들어 드립니다.',
  note: '미래AI랩이 직접 기획·개발한 초기 MVP 레퍼런스 10종입니다. 고객사 실적이 아닌 자체 데모이며, 카드를 누르면 실제 사이트가 새 창에서 열립니다.',
} as const
