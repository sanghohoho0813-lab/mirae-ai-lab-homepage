// 2026 AX 정책 공식근거 — 홈의 "왜 하필 지금 AX일까요?" 증거 바와 상세페이지가 함께 읽는 단일 소스.
//
// ⚠️ 표현 원칙
//  - 공식 근거와 미래AI랩의 자체 실적을 절대 섞지 않는다.
//  - "모든 합격기업의 공통점", "평균 2~3억원", "AX를 하면 승인" 같은 단정은 쓰지 않는다.
//  - 지원대상·우대여부·실제 결과는 기업의 사업내용과 기관평가에 따라 달라진다는 고지를 함께 노출한다.
//  - 공문 원문을 길게 옮기지 않는다. 출처명과 핵심 한 문장만 남긴다.

export type AxEvidenceSourceType = '운용계획' | '통합공고' | '평가안내' | '보도자료'

export type AxPolicyEvidence = {
  id: string
  /** 증거 바에 크게 보이는 한 줄 */
  title: string
  /** 한 문장 설명 */
  shortDescription: string
  /** 공식 출처명 */
  sourceName: string
  /** 공식 문서 시점 */
  officialDate: string
  sourceType: AxEvidenceSourceType
  /** 자세히 볼 위치 */
  detailPath: string
}

export const AX_POLICY_EVIDENCE_2026: AxPolicyEvidence[] = [
  {
    id: 'ax-sprint',
    title: '2026 AX 스프린트 우대트랙 신설',
    shortDescription: 'AI를 실제 업무에 도입·활용하려는 기업을 위한 별도 트랙이 새로 생겼습니다.',
    sourceName: '2026년도 중소기업 정책자금 운용계획',
    officialDate: '2026년도',
    sourceType: '운용계획',
    detailPath: '/business-services/funding-consulting#policy-2026',
  },
  {
    id: 'ax-joint-notice',
    title: '주요 AX 사업 3개 부처 통합공고',
    shortDescription: '중기부·과기정통부·산업부가 AX 관련 지원사업을 함께 공고했습니다.',
    sourceName: '2026년도 중기부·과기정통부·산업부 주요 AX 사업 통합공고',
    officialDate: '2026년도',
    sourceType: '통합공고',
    detailPath: '/business-services/funding-consulting#policy-2026',
  },
  {
    id: 'kosmes-priority',
    title: '정책우선도 평가에 혁신성장·IP·기술경영혁신 반영',
    shortDescription: '우선검토 과정에서 혁신성장분야, 지식재산권, 기술·경영혁신, 성장잠재력 AI평가가 지표로 활용됩니다.',
    sourceName: '중소벤처기업진흥공단 정책자금 신청·정책우선도 평가 안내',
    officialDate: '2026년도',
    sourceType: '평가안내',
    detailPath: '/business-services/funding-consulting#policy-2026',
  },
  {
    id: 'kodit-ai',
    title: '신용보증기금 AI혁신부 신설',
    shortDescription: '정책금융기관 조직에도 AI 전담 부서가 새로 만들어졌습니다.',
    sourceName: '신용보증기금 2026년 상반기 조직개편·정기인사 보도자료',
    officialDate: '2026년 상반기',
    sourceType: '보도자료',
    detailPath: '/business-services/funding-consulting#policy-2026',
  },
]

/** 증거 바 옆에 항상 함께 노출하는 고지 */
export const AX_EVIDENCE_DISCLAIMER =
  '지원대상·우대여부와 실제 결과는 기업의 사업내용과 기관평가에 따라 달라집니다.'

/** "왜 하필 지금 AX일까요?" 본문 — 네 단계로 이어지는 설명 */
export const AX_WHY_NOW_LINES: string[] = [
  '정부가 먼저 지원하려는 기업의 방향이 전보다 더 분명해지고 있기 때문입니다.',
  '2026년에는 AI 관련 기업과 기존 업무에 AI를 도입·활용하는 기업을 위한 AX 정책과 지원트랙이 새로 확대됐습니다.',
  '중진공 정책자금의 우선검토 과정에서도 혁신성장분야, 지식재산권, 기술·경영혁신과 성장잠재력 AI평가 등이 중요한 지표로 활용됩니다.',
  '신용보증기금도 AI혁신부를 새로 만들었고, 정책금융기관과 정부지원사업 전반에서 AI와 혁신성장을 더 적극적으로 보고 있습니다.',
]

/** AX를 중학생도 이해할 수 있게 설명하는 문장 — 전문용어를 쓰지 않는다. */
export const AX_SIMPLE_EXPLANATION = {
  eyebrow: 'AX, 쉽게 설명하면',
  title: '우리 회사가 돌아가는 모습을 휴대폰 한 화면에서 볼 수 있다면 어떨까요?',
  definition:
    'AX는 엑셀·카카오톡·전화로 나눠 하던 일을, AI와 데이터가 연결된 하나의 프로그램에서 더 빠르고 정확하게 처리하도록 바꾸는 것입니다.',
  examples: [
    '대표님은 주문·일정·직원·재고·고객상태를 휴대폰에서 한눈에 확인합니다.',
    '직원은 현장에서 바로 업무와 사진을 기록하고, 고객은 필요한 진행상태를 직접 확인합니다.',
  ],
  changeLead: '단순히 업무가 편해지는 데서 끝나지 않습니다.',
  changeBody:
    '쌓인 고객·거래·운영데이터를 활용해 고객용 앱, 구독서비스와 기업계약 같은 새로운 매출구조로 확장할 수 있습니다.',
} as const

/** 기존 방식 → AX 적용 대비 */
export const AX_BEFORE_AFTER = {
  before: { label: '기존 방식', items: ['엑셀', '카카오톡', '전화', '수기장부'] },
  after: { label: 'AX 적용', items: ['대표', '직원', '고객'], note: '하나의 프로그램으로 연결' },
  phone: ['주문', '일정', '직원', '재고', '고객'],
} as const

/** 고객의 정책자금 현실 — 기본조건을 부정하지 않으면서 차이의 지점을 짚는다. */
export const AX_FUNDING_REALITY = {
  title: '지금 자금이 적게 나온 이유가 사업계획서를 못 써서만은 아닐 수 있습니다.',
  lines: [
    '요즘은 AI를 이용해 누구나 보기 좋은 사업계획서를 만들 수 있습니다.',
    '그래서 계획서의 문장만으로 다른 기업과 차이를 보여주기가 점점 어려워지고 있습니다.',
    '물론 신용점수, 매출, 체납 여부, 기존 부채와 상환능력은 여전히 중요합니다.',
    '이런 기본조건을 통과한 뒤에는 왜 이 기업을 먼저 지원해야 하는지 보여줘야 합니다.',
  ],
  emphasis: '1억원 이상을 목표로 한다면, 신청금액보다 그만한 자금이 필요한 사업구조부터 보여줘야 합니다.',
  scale: '2억~3억원 규모의 자금을 설명하려면 그 돈으로 무엇을 만들고, 매출과 고용이 어떻게 달라지는지가 구체적으로 보여야 합니다.',
} as const

/** "반도체 회사로 바꿀 수는 없습니다" — 고객의 가장 큰 반론 해소 */
export const AX_NOT_A_PIVOT = {
  title: '그렇다고 우리 회사를 반도체 회사로 바꿀 수는 없습니다.',
  lines: [
    '숙박업체가 갑자기 반도체를 만들고, 시설관리회사가 화장품 수출기업이 될 수는 없습니다.',
    '그럴 필요도 없습니다.',
  ],
  core: [
    '업종을 바꾸는 것이 아니라 지금 하고 있는 업무방식을 AX로 바꾸면 됩니다.',
    'AI를 판매하는 기업이 아니어도, AI와 데이터를 실제 업무에 도입·활용하는 기업이 될 수 있습니다.',
  ],
  emphasis: [
    '지원업종처럼 보이게 꾸미는 것이 아닙니다.',
    '직원과 고객이 실제로 사용하는 프로그램을 만들고, 업무기록과 데이터가 실제로 쌓이는 구조를 만듭니다.',
  ],
  role: [
    '미래AI랩은 카카오톡·유튜브·네이버처럼 대표님이 자주 열어볼 수 있는 화면 안에서 우리 회사가 돌아가는 모습을 확인할 수 있게 만듭니다.',
    '내부 업무를 편하게 만들고, 새로운 상품과 반복매출을 설계하며, 그 변화를 정책자금과 정부지원사업에서 설명할 근거로 연결합니다.',
  ],
  /** 예시로 든 서비스명이 제휴·동일 서비스로 오해되지 않게 하는 고지 */
  brandNote: '카카오톡·유튜브·네이버는 익숙한 사용경험을 설명하기 위한 예시이며, 해당 기업과의 제휴나 동일한 서비스 제공을 뜻하지 않습니다.',
} as const
