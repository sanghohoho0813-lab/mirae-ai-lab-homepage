// 핵심 프로그램 3종(1층) — 상품구조·가격정책의 단일 소스.
// 정책자금 상세(플랜 카드/비교표), 공통 신청폼(진행방식 선택), 이후 메인·목록 리디자인(2단계)이 공유합니다.
// ⚠️ 표시 문구 원칙:
//   - C의 3,000,000원은 "정식 운영 예정 착수금" (허위 정상가·과장 할인율 금지, "67%/80% 할인" 카피 금지)
//   - 1,000,000원은 "초기 10개 기업 레퍼런스 구축 참여가" (조건부 참여가격임을 명시)
//   - "1억원 이상 받을 수 있습니다" 금지 → "조달 목표금액이 1억원 이상인 성장기업에 권장"
//   - 승인·조달금액 보장 표현 금지. 성과보수 세부 산정·지급 시점은 개별 계약서에서 확정.

export type CoreProgramKey = 'A' | 'B' | 'C'

export type CoreProgram = {
  key: CoreProgramKey
  /** 프로그램 정식 명칭 (신청폼 진행방식 선택지와 동일) */
  name: string
  /** 카드 상단 배지 */
  label: string
  /** 대표 메시지 한 줄 */
  catchline: string
  /** 가격 상단 표기 (C: 정식 운영 예정 착수금) */
  priceTop?: { label: string; value: string }
  /** 가격 메인 표기 */
  priceMain: string
  /** 가격 메인 라벨 (C: 초기 10개 기업 레퍼런스 구축 참여가) */
  priceMainLabel?: string
  /** 성과보수 표기 */
  priceSub: string
  /** 성과보수 산정용 수치(계산기 단일 소스) — rate·capKrw 는 priceSub 문구와 반드시 일치시킬 것 */
  successFee?: { rate: number; capKrw: number }
  /** 핵심 포함 범위 (카드) */
  points: string[]
  /** 추천 대상 한 줄 */
  recommend: string
  /** CTA 라벨 */
  ctaLabel: string
  /** 계약 방식 — payment: 기존 결제 연결 / consult: 신청·진단 후 계약(상담형) */
  contract: 'payment' | 'consult'
  /** 결제 연결 slug (contract === 'payment') */
  checkoutSlug?: string
}

export const CORE_PROGRAMS: CoreProgram[] = [
  {
    key: 'A',
    name: '기업진단·자금전략',
    label: '성과보수 없음',
    catchline: '독립적으로 완결되는 1회 유료 컨설팅',
    priceMain: '500,000원',
    priceSub: '성과보수 없음 · 이 금액으로 종료 가능',
    points: [
      '기업 현황 사전분석 · 정책자금·보증·지원사업 가능성 점검',
      '우선 검토 기관과 자금 방향 · 주요 결격요인과 보완사항',
      '준비자료 목록 · 실행 순서 · 대표자용 체크리스트',
      '컨설팅 결과 요약본',
    ],
    recommend: '어떤 자금이 가능한지 확인하고, 준비 순서를 정리한 뒤 직접 진행할 대표님께 맞습니다. 이 상품만 이용하고 종료하셔도 되고, 직접 진행해도 추가 성과보수가 없습니다.',
    ctaLabel: '기업진단·자금전략 시작하기',
    contract: 'payment',
    checkoutSlug: 'funding-consulting',
  },
  {
    key: 'B',
    name: '자금조달 실행형',
    label: '선택형 · 진단 후 계약',
    catchline: '진단 이후 전체 진행을 맡기고 싶은 기업의 확장형',
    priceMain: '착수금 500,000원',
    priceSub: '+ 실제 조달금액의 3% (전체 진행 선택 시)',
    successFee: { rate: 0.03, capKrw: 0 },
    points: [
      '기업진단 · 자금조달 방향 설계 · 기관·상품 검토',
      '자료 요청·구조화 · 사업계획 내용 정리 지원',
      '주요 수치·설명자료 정리 · 예상 질문과 답변 준비',
      '진행 일정 관리 · 보완 요청 대응 지원',
    ],
    recommend: '자료와 사업계획 정리가 어렵거나, 신청 준비와 진행일정을 함께 관리받고 싶은 기업에 맞습니다. AX 시스템까지는 필요하지 않은 기업용입니다.',
    ctaLabel: '자금조달 실행형 가능성 확인',
    contract: 'consult',
  },
  {
    key: 'C',
    name: 'AX 결합 성장자금형',
    label: '선별 진행 · 초기 10개사',
    catchline: '자금조달과 실제 업무혁신을 한 번에',
    priceTop: { label: '정식 운영 예정 착수금', value: '3,000,000원' },
    priceMain: '1,000,000원',
    priceMainLabel: '초기 10개 기업 레퍼런스 구축 참여가',
    priceSub: '+ 실제 조달금액의 5% · 성과보수 최대 15,000,000원',
    successFee: { rate: 0.05, capKrw: 15_000_000 },
    points: [
      '기업·업무 현황 진단 · 반복업무와 비용·시간 낭비 분석',
      '화면 설계·클릭형 프로토타입 · 핵심 업무 MVP · 규칙 기반 자동화',
      '필요 시 선택적 AI 기능 1~2개 · KPI 설정 · 대표자·담당자 테스트',
      '기술성·사업성 설명자료 · 자금조달 진행전략 · 조달 이후 고도화 방향',
    ],
    recommend: '조달 목표금액이 1억원 이상인 성장기업에 권장합니다. 실제 승인 여부와 금액은 기관 평가와 기업 상황에 따라 달라집니다.',
    ctaLabel: 'AX 성장형 적합성 확인',
    contract: 'consult',
  },
]

export function getCoreProgram(key: CoreProgramKey): CoreProgram {
  return CORE_PROGRAMS.find((p) => p.key === key)!
}

// ── 메인 페이지 유료 프로그램 = A·B 2종 (단일 소스) ───────────────────────────
// A(자금조달 실행형)는 legacy CORE_PROGRAMS의 B, B(AX 결합)는 legacy C에 대응한다.
// 무료 '3분 기업진단'이 최초 진입점이며, 기업진단·자금전략(legacy A)은 메인 카드에서 제외되고
// 정책자금 상세 페이지(/business-services/funding-consulting)에서 계속 제공된다.
export type MainProgramKey = 'A' | 'B'
export type MainProgram = {
  key: MainProgramKey
  /** 섹션 앵커 (#program-A / #program-B) */
  anchor: string
  /** 하위호환 앵커 (기존 #core-* 링크 매핑) */
  legacyAnchors: string[]
  /** 상담 모달 진행방식 선택값 (PROGRAM_CHOICES 중 하나) */
  consultName: string
  tone: 'blue' | 'navy'
  badge: string
  name: string
  tagline: string
  /** 가격 상단(선택) */
  priceTop?: string
  priceMain: string
  priceSub: string
  /** 계산기: 착수금·요율·상한(원, null=상한 없음) */
  startFee: number
  feeRate: number
  feeCap: number | null
  purpose: string
  recommend: string[]
  included: string[]
  /** 결과물 구현 수준 라벨 */
  levelLabel: string
  /** 기본 제외/별도 범위 */
  excluded: string[]
  excludedLabel: string
  /** A형 AX 제공 원칙(선택) */
  axNote?: string
  ctaLabel: string
}

export const MAIN_PROGRAMS: MainProgram[] = [
  {
    key: 'A',
    anchor: 'program-A',
    legacyAnchors: ['core-A', 'core-B'],
    consultName: '자금조달 실행형',
    tone: 'blue',
    badge: '초기 런칭 조건',
    name: '자금조달 실행형',
    tagline: '정책자금 실행과 업종 맞춤 AX 실행근거를 함께 준비합니다.',
    priceMain: '착수 50만원 + 실제 조달금액의 3%',
    priceSub: '정식 전환 예정 조건 · 착수 70만원 + 4%',
    startFee: 500000,
    feeRate: 0.03,
    feeCap: null,
    purpose: '심사에서 설명할 실행근거를 만듭니다.',
    recommend: [
      '소상공인·초기기업, 첫 정책자금 신청기업',
      '대규모 시스템 개발보다 자금 실행이 우선인 기업',
      '사업계획의 실행근거를 보완해야 하는 기업',
    ],
    included: [
      '기업·재무현황 진단 · 자금조달 기관·자금 종류 선정',
      '신청전략 · 사업계획 구조화 · 신청서류 준비',
      '보완 대응 · 예상 질의 대응',
      '업종 맞춤 AX 실행설계 · 업무 흐름도 또는 서비스 구조도',
      '핵심 화면 3~5개 클릭형 프론트엔드 프로토타입 (PC 또는 모바일) · 수정 1회',
    ],
    levelLabel: '실행근거형 프로토타입',
    excluded: ['로그인·데이터베이스 저장·사용자 권한', '실제 관리자 운영·외부 API·결제·ERP 연동', '작동형 전체 MVP·지속 유지보수'],
    excludedLabel: '기본 제외 — 작동형 앱 전체는 미포함',
    axNote: 'AX 실행설계는 모든 A형 프로젝트에 포함됩니다. 기업 상황에 따라 클릭형 화면·업무 흐름도·서비스 구조도 형태로 제공됩니다.',
    ctaLabel: '자금조달 실행형 상담 신청',
  },
  {
    key: 'B',
    anchor: 'program-B',
    legacyAnchors: ['core-C'],
    consultName: 'AX 결합 성장자금형',
    tone: 'navy',
    badge: '초기 레퍼런스 참여기업 10개사',
    name: 'AX 결합 성장자금형',
    tagline: '자금조달과 실제 업무용 AX 시스템 구축을 하나의 프로젝트로 진행합니다.',
    priceTop: '정식 전환 예정 착수금 · 300만원',
    priceMain: '착수 100만원 + 실제 조달금액의 5%',
    priceSub: '성과보수 최대 1,500만원',
    startFee: 1000000,
    feeRate: 0.05,
    feeCap: 15_000_000,
    purpose: '자금조달 후 실제로 사용할 AX 시스템을 만듭니다.',
    recommend: [
      '반복적인 수기 업무가 있고, 직원·거래처가 함께 쓰는 업무 흐름이 있는 기업',
      '엑셀·카카오톡·전화로 업무가 분산된 기업',
      '주문·현장·재고·고객·연구·생산 데이터가 쌓이는 기업',
      '자금조달 이후 실제 시스템을 사용할, 통상 1억원 이상 조달 검토 성장기업',
    ],
    included: [
      'A형의 자금조달 컨설팅 전체',
      '기업 업무 인터뷰 · 요구사항 정의 · 화면설계',
      'PC·모바일 반응형 · 로그인 · 사용자 권한 · 데이터베이스 저장 · 관리자 화면',
      '핵심 업무 흐름 1개 작동형 AX MVP (예: 주문 접수→관리자 확인→출고상태)',
      '테스트 · 기본 운영안내 · 실제 업무 적용을 위한 초기 개선',
    ],
    levelLabel: '작동형 AX MVP',
    excluded: ['카드결제 PG·복잡한 환불·부분취소', 'ERP 실시간 연동·세금계산서 자동발행·택배사 API', '회계 프로그램 연동·복잡한 재고 동기화', '네이티브 앱·대규모 다중 사업장·고급 보안·별도 서버'],
    excludedLabel: '기본 제외 또는 별도 범위 (협의)',
    ctaLabel: 'AX 결합 성장자금형 적합성 확인',
  },
]

export function getMainProgram(key: MainProgramKey): MainProgram {
  return MAIN_PROGRAMS.find((p) => p.key === key)!
}

// ── 대표상품(단일) + 공개 구현 1~4단계 (+ 5단계 이후 별도견적) — 가격 단일 소스 ─────
// A·B 구조를 대체한다. 컨설팅비 100만원은 개발비에서 차감하지 않으며 VAT 별도.
export const CONSULTING_FEE = 1_000_000

export const FLAGSHIP = {
  name: 'AX 사업화·자금조달 프로그램',
  tagline: '자금조달 전략과 업종 맞춤 AX 실행설계, 실제 시스템 구축을 하나의 프로젝트로 진행합니다.',
  priceMain: '컨설팅비 100만원부터 시작',
  priceSub: '기업분석과 AX 실행설계 후 필요한 구현 수준을 확정합니다.',
  consultName: 'AX 사업화·자금조달 프로그램',
  /** 개발 협업 신뢰 문구(사이트 통일) */
  collabLine: '자금 컨설턴트와 개발 담당자가 처음부터 같은 프로젝트로 참여합니다.',
} as const

export type BuildLevelKey = '1' | '2' | '3' | '4' | '5'
export type BuildLevel = {
  key: BuildLevelKey
  name: string
  /** 가격 표기 라벨 */
  priceLabel: string
  /** 개발비(원). 1단계=컨설팅 포함(null), 5단계=별도견적(null) */
  devFee: number | null
  /** 컨설팅비 포함 총액(원). null=별도견적 */
  total: number | null
  /** 한 줄 정의 */
  short: string
  /** 고객에게 보여줄 표현 */
  customer: string
  recommended?: boolean
  included: string[]
  excluded: string[]
  /** 주의/권장 문구(선택) */
  note?: string
}

export const BUILD_LEVELS: BuildLevel[] = [
  {
    key: '1',
    name: '1단계 · AX 실행설계와 화면 초안',
    priceLabel: '컨설팅비 100만원에 포함',
    devFee: null,
    total: 1_000_000,
    short: '사업계획을 실제 업무 흐름과 화면 구조로 바꾸는 단계',
    customer: '화면을 만들기 전에 어떤 업무를 어떻게 바꿀지 정합니다.',
    included: [
      '기업현황 진단 · 재무·자금 가능성 검토',
      '목표 정책자금과 신청기관 검토',
      '기존 사업의 AX 적용업무 선정 · 사용자 구분',
      '대표자 또는 담당자 인터뷰 · 업무 순서 · 입력 데이터 · 관리자 확인 절차',
      '핵심 기능 목록 · 화면 목록 · 핵심 업무 흐름도',
      '특허 아이디어 1차 구조화 · 구현 수준 추천',
      '자금조달·AX 실행 로드맵 · 자금기관 설명자료 기본 구조',
      '방향 확인용 주요 화면 초안 3~5개 · 프론트엔드 디자인 방향 선택',
    ],
    excluded: ['완성된 프론트엔드·모든 버튼의 실제 연결', '실제 로그인·데이터베이스·실제 데이터 저장', '운영용 배포'],
    note: '1단계에서는 심사와 개발 방향을 정하기 위한 AX 실행설계와 화면 초안을 제공합니다. 버튼을 눌러 시연하는 프로토타입은 2단계부터, 로그인·데이터 저장이 포함된 MVP는 3단계부터 제공됩니다.',
  },
  {
    key: '2',
    name: '2단계 · 시연형 AX 프로토타입',
    priceLabel: '개발비 500만원',
    devFee: 5_000_000,
    total: 6_000_000,
    short: '클릭하며 사업 흐름을 보여줄 수 있지만 실제 업무 데이터는 저장되지 않는 수준',
    customer: '심사자와 관계자 앞에서 실제 서비스처럼 클릭하며 설명할 수 있습니다.',
    included: [
      '주요 화면 5~8개 · PC 또는 모바일 우선 구현',
      '반응형 프론트엔드 · 버튼과 화면 이동 · 메뉴와 핵심 화면 연결',
      '샘플 데이터로 핵심 업무 흐름 시연',
      '기본 배포 URL · 수정 1회',
      '서비스 구조 연계 특허출원 준비 1건',
    ],
    excluded: ['실제 로그인 인증·데이터베이스 저장·사용자별 권한', '실제 고객정보 저장·관리자 실제 업무처리', '외부 API·결제·ERP 연동'],
    note: '2단계만으로도 사업구조를 시각적으로 설명할 수 있지만, 실제 데이터 처리와 운영 준비도까지 보여줘야 하는 기업에는 3단계 이상을 권장합니다.',
  },
  {
    key: '3',
    name: '3단계 · 핵심기능 AX MVP',
    priceLabel: '개발비 1,000만원',
    devFee: 10_000_000,
    total: 11_000_000,
    short: '로그인하고 데이터를 저장하며 핵심 업무 하나를 실제로 시험할 수 있는 수준',
    customer: '대표자나 담당자가 실제 데이터를 입력하며 핵심 기능을 시험할 수 있습니다.',
    included: [
      '주요 화면 최대 12개 · PC·모바일 반응형',
      '실제 로그인 · 사용자 유형 최대 2종',
      'Supabase 또는 동급 관리형 데이터베이스',
      '핵심 업무 흐름 1개 · 기본 관리자 화면',
      '등록 · 조회 · 수정 · 상태변경 · 파일 또는 사진 첨부 1종',
      '클라우드 배포 · 수정 2회 · 기본 테스트',
      '서비스 구조 연계 특허출원 준비 1건',
    ],
    excluded: ['PG 결제·복잡한 환불·ERP 실시간 연동', '복잡한 통계·다중 사업장·네이티브 앱', 'AI 모델 자체개발·복잡한 다단계 권한·대규모 데이터 이전'],
    note: '3단계는 핵심 기능의 작동 여부를 보여주는 MVP입니다. 여러 직원과 복수 업무 흐름을 실제로 운영하려면 4단계를 권장합니다.',
  },
  {
    key: '4',
    name: '4단계 · 업무사용형 AX MVP',
    priceLabel: '개발비 1,500만원',
    devFee: 15_000_000,
    total: 16_000_000,
    recommended: true,
    short: '대표자와 직원이 실제 업무에 사용하기 시작할 수 있는 제한된 범위의 작동형 시스템',
    customer: '심사 이후에도 버리지 않고 실제 회사 업무에 사용할 수 있습니다.',
    included: [
      '주요 화면 최대 18개 · PC·모바일 반응형',
      '사용자 유형 최대 3종 · 권한별 화면',
      '데이터베이스 테이블 최대 12~15개 · 핵심 업무 흐름 최대 2개',
      '관리자 대시보드 · 등록 · 조회 · 수정 · 상태변경 · 파일·사진 첨부',
      '검색 · 필터 · 기본 통계 · 기본 보고서 또는 출력 1종',
      '클라우드 배포 · 실제 사용자 운영 테스트 · 수정 2회',
      '납품 후 기본 오류보수 30일 · 서비스 구조 연계 특허출원 준비 1건',
    ],
    excluded: ['PG 결제·ERP 실시간 연동 등 상용 고도화는 5단계 이후 별도 견적'],
    note: '4단계는 실제 직원 사용, 데이터 저장과 관리자 운영까지 포함해 기업의 실행 준비도와 향후 운영계획을 가장 구체적으로 설명할 수 있습니다. 자금조달 이후 실제 업무에 사용할 시스템을 목표로 한다면 4단계를 권장합니다. 다만 자금조달 결과는 기업의 재무상태·신용·업력·대표자 역량과 기관 심사에 따라 달라지며 보장되지 않습니다.',
  },
  {
    key: '5',
    name: '5단계 이후 · 상용화·고도화 개발',
    priceLabel: '별도 문의 및 별도 견적',
    devFee: null,
    total: null,
    short: '4단계 검증 이후 실제 이용량과 업무범위에 맞춰 상용서비스로 확장하는 단계',
    customer: '외부 전문업체 협업이 필요한 기능은 범위와 비용을 별도로 안내합니다.',
    included: [
      'PG 카드결제 · 부분취소와 복잡한 환불',
      'ERP·회계·택배사 실시간 연동 · 세금계산서 자동발행',
      '카카오 알림톡 · 문자 자동화 · 다중 사업장 · 고객사별 독립공간',
      '복잡한 권한체계 · 네이티브 앱 · 앱스토어 등록 · 고급 보안',
      '모니터링 · 자동 백업 · 대규모 데이터 이전',
      'AI 모델 자체개발 · 고급 예측과 분석 · 장기 운영·유지보수 · 높은 트래픽 상용서비스',
    ],
    excluded: [],
    note: '5단계 이후 기능은 4단계 납품 후 실제 사용결과와 우선순위를 확인해 별도로 고도화합니다.',
  },
]

export function getBuildLevel(key: BuildLevelKey): BuildLevel {
  return BUILD_LEVELS.find((l) => l.key === key)!
}

/** 총액(만원) 문자열 헬퍼 — VAT 별도 */
export function levelTotalLabel(l: BuildLevel): string {
  if (l.total == null) return '별도 견적'
  return `총 ${(l.total / 10_000).toLocaleString('ko-KR')}만원 (VAT 별도)`
}

/** 컨설팅비·환불·정산 관련 공통 고지 */
export const PROGRAM_NOTICES = {
  consultingFee: '컨설팅비는 기업분석, 자금전략과 AX 실행설계에 대한 별도 용역비이며 개발비에서 차감되지 않습니다.',
  consultingRefund: '기업분석과 AX 실행설계 초안 제공 이후에는 컨설팅 용역이 완료된 것으로 보며 환불되지 않습니다.',
  devSeparate: '개발비는 컨설팅비 100만원과 별도로 산정됩니다.',
  settlement: '본개발은 단계별 검수와 고객 승인을 거쳐 진행합니다. 중도변경 또는 중단 시 완료·승인된 단계까지 계약기준에 따라 정산합니다.',
  vat: '모든 가격은 VAT 별도입니다.',
  fundingNotGuaranteed: '자금조달 결과와 지원금액은 기업조건과 기관 심사에 따라 달라지며 보장되지 않습니다.',
  patent: '특허 등록이나 심사결과를 보장하지 않습니다. 관납료·변리사 검토·대리 등 제3자 비용의 포함 여부는 계약서에서 별도로 안내합니다.',
} as const

// ── AX 결합 성장자금형 — 런칭(초기 10개사) 조건 ─────────────────────────────
export const AX_LAUNCH = {
  /** 신청 흐름 — 신청 즉시 결제 없음 */
  flow: '적합성 신청 → 내부 검토 → 참여 승인 → 착수금 결제',
  /** 초기 10개사 선정 방식 (선착순 아님) */
  selection: 'AX 적합성 검토와 계약 확정이 완료된 순서로 최대 10개 기업을 선정합니다.',
  /** 참여조건 */
  conditions: [
    '실제 업무자료를 제공할 수 있음',
    '대표자 또는 현장 담당자가 테스트에 참여할 수 있음',
    '프로젝트 기간 중 정기 피드백 가능',
    '실제 업무에 시스템을 사용할 의지가 있음',
    '익명 사례 공개 동의',
    '프로젝트 종료 후 상세 사용경험 피드백 제공',
  ],
  /** 상세 피드백 방식 — 하나 이상 선택 (긍정 후기 의무화 아님) */
  feedbackOptions: ['비공개 설문', '20분 인터뷰', '500자 이상의 상세 사용경험 피드백'],
  /** 기본 범위 */
  scope: ['핵심 업무 1개', '사용자 역할 최대 3개', '주요 화면 약 5~8개', 'AI 기능 최대 1~2개', '결과 보고서 1종', '관리자 최소 기능', '모바일 웹'],
  /** 기본 제외 */
  excluded: [
    'ERP 전체 구축',
    '대규모 데이터 이전',
    '자체 AI 모델 개발',
    '무제한 기능 추가',
    '네이티브 앱',
    '소스코드 소유권 이전',
    '세무·노무·법무 최종 전문판단',
    '자금 승인 보장',
  ],
  /** AX 참여기업 전용 추가 혜택 (자동 포함 아님 · 진단 후 필요 기업에만 추천 · 자금승인 보장 없음) */
  moduleDiscountNote:
    'AX 성장형 참여기업은 벤처확인과 연구개발조직 설립 지원을 각각 10% 할인된 조건으로 진행할 수 있습니다. 실제 필요성과 진행 가능성은 기업진단 후 안내합니다.',
  feeNote: '성과보수의 세부 산정 기준과 지급 시점은 개별 계약서에서 확정됩니다.',
} as const

// ── 공통 신청폼 — 진행방식·조건부 문항 상수 ────────────────────────────────
// 대표상품은 단일(AX 사업화·자금조달 프로그램). 구현단계 선택은 선택사항(진단 후 결정 가능).
export const PROGRAM_CHOICES = ['AX 사업화·자금조달 프로그램', '아직 구현수준을 모르겠음'] as const
export type ProgramChoice = (typeof PROGRAM_CHOICES)[number]

/** 상담 모달 — 선택형 구현단계(선택사항). 4단계에 권장 표시 */
export const BUILD_LEVEL_CHOICES = [
  '1단계 AX 실행설계와 화면 초안',
  '2단계 시연형 AX 프로토타입',
  '3단계 핵심기능 AX MVP',
  '4단계 업무사용형 AX MVP (미래AI랩 권장 최종 목표)',
  '5단계 이후 상용화·고도화',
  '진단 후 결정',
] as const

export const FUNDING_GOAL_OPTIONS = ['5천만원 미만', '5천만원 이상~1억원 미만', '1억원 이상~2억원 미만', '2억원 이상~3억원 미만', '3억원 이상', '아직 잘 모르겠습니다']
export const FUNDING_TIMING_OPTIONS = ['1개월 이내', '3개월 이내', '6개월 이내', '올해 안', '아직 미정']
export const ARREARS_OPTIONS = ['체납 없음', '체납 있음', '확인 필요']
export const PRIOR_FUNDING_OPTIONS = ['이용한 적 없음', '현재 이용 중', '과거 이용', '잘 모르겠음']
export const BIZ_FORM_OPTIONS = ['법인사업자', '개인사업자', '예비창업자']

/** AX 선택 시 조건부 문항 */
export const AX_FORM = {
  tasks: {
    label: '현재 반복업무 (복수 선택)',
    options: ['엑셀 반복입력', '서류·보고서 반복작성', '고객·거래처 관리', '견적·원가·마진 계산', '일정·현장·프로젝트 관리', '재고·자산 관리', '직원·인사 관리'],
    etcKey: '기타',
  },
  dataForms: {
    label: '현재 데이터 형태 (복수 선택)',
    options: ['엑셀', '종이문서', '카카오톡', '이메일', 'ERP', 'CRM', '자체 프로그램', '아직 정리된 데이터 없음'],
  },
  participation: {
    label: '참여 가능성 (해당 항목 선택)',
    options: ['실제 업무자료 제공 가능', '대표자 또는 담당자 테스트 참여 가능', '프로젝트 기간 중 정기 피드백 가능', '실제 업무 적용 의사 있음'],
  },
  requiredConsents: [
    '기업명을 공개하지 않는 익명 사례 활용에 동의합니다.',
    '프로젝트 종료 후 상세 사용경험 피드백을 제공합니다.',
  ],
  feedbackOptions: AX_LAUNCH.feedbackOptions,
  disclosureOptions: {
    label: '공개범위 선택 (선택)',
    options: ['업종 공개 가능', '기업 규모 구간 공개 가능', '구축 화면 일부 공개 가능', '자금조달 결과 공개 가능', '익명 인터뷰 문구 공개 가능', '공개 전 최종 확인 희망'],
  },
  interestModules: {
    label: '추가 관심 모듈 (복수 선택)',
    options: ['벤처확인', '기업부설연구소', '연구개발전담부서', '특허 출원 연계', 'ISO', '이노비즈', '아직 잘 모르겠습니다', '필요하지 않습니다'],
    note: AX_LAUNCH.moduleDiscountNote,
  },
} as const
