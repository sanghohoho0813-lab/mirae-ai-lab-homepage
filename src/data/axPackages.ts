// AX 사업화 프로그램 A·B·C — 100 / 300 / 500만원. 홈과 프로그램 상세페이지가 공유하는 단일 소스.
//
// 가격 표기 규칙(중요)
//  - 가격표는 홈 1곳, 프로그램 상세페이지 1곳에서만 노출한다.
//  - Hero·과정·FAQ·CTA에서 같은 가격을 반복하지 않는다.
//  - 전 금액 VAT 별도. 허위 할인·가짜 정가·카운트다운은 사용하지 않는다.
//
// 결제 연동 주의
//  - 이 세 프로그램은 카드 즉시결제 상품이 아니라 '진단·상담 후 계약' 상품이다.
//    서버 결제 카탈로그(billing_products.option_id)에 대응 항목이 없으므로
//    체크아웃으로 보내지 않는다. 기존 결제 상품(businessPackages)의 경로는 그대로 둔다.
//  - code 는 상담·문의 데이터에 남길 신규 상품코드다. 기존 문의·결제 레코드는 건드리지 않는다.

export type AxPackageCode = 'AX_PLAN_100' | 'AX_INNOVATION_300' | 'AX_GROWTH_500'

export type AxPackage = {
  key: 'A' | 'B' | 'C'
  code: AxPackageCode
  name: string
  /** 가격 숫자(원) — 표기용. 결제 금액이 아니다. */
  amount: number
  /** 화면 표기 */
  price: string
  priceNote: string
  /** 고객용 한 줄 */
  oneLiner: string
  included: string[]
  fit: string
  /** 추천 강조 여부 — B만 true */
  recommended: boolean
  /** 추천 카드에만 붙는 라벨 */
  badges?: string[]
  ctaLabel: string
}

export const AX_PACKAGES: AxPackage[] = [
  {
    key: 'A',
    code: 'AX_PLAN_100',
    name: 'AX 사업화 설계',
    amount: 1_000_000,
    price: '100만원',
    priceNote: 'VAT 별도',
    oneLiner: '우리 회사가 어떤 AX 사업으로 바뀔 수 있는지 먼저 설계합니다.',
    included: [
      '대표자·기업 인터뷰',
      '현재 사업과 자금문제 진단',
      'AX로 바꿀 핵심업무 선정',
      '현재 업무 AX 구조',
      '신규 사업화 아이디어 2개',
      '핵심 사용자와 업무 흐름',
      '주요 화면 또는 시연형 MVP 초안',
      '정책자금 활용 방향',
      '향후 구현·인증 로드맵',
    ],
    fit: '먼저 가능성과 방향을 구체적으로 확인하고 싶은 기업',
    recommended: false,
    ctaLabel: 'AX 사업화 설계 상담',
  },
  {
    key: 'B',
    code: 'AX_INNOVATION_300',
    name: 'AX 혁신기업 패키지',
    amount: 3_000_000,
    price: '300만원',
    priceNote: 'VAT 별도',
    oneLiner: 'AX 사업화에 벤처와 연구소까지 연결해 혁신기업으로 설명할 근거를 함께 만듭니다.',
    included: [
      'A 프로그램 전체',
      '벤처기업 혁신성장유형 준비',
      '기업부설연구소 또는 연구전담부서 설립 준비',
      'AX 사업과 연구개발 활동의 연결',
      '인증용 사업·기술 설명구조',
      '필요한 증빙과 사후관리 방향',
      '자금기관 설명 포인트',
    ],
    fit: '1억원 이상 정책자금과 기업성장을 본격적으로 준비하는 기업',
    recommended: true,
    badges: ['가장 추천', '정책자금·AX·벤처·연구소를 한 흐름으로'],
    ctaLabel: 'AX 혁신기업 패키지 상담',
  },
  {
    key: 'C',
    code: 'AX_GROWTH_500',
    name: 'AX 혁신성장 완성형',
    amount: 5_000_000,
    price: '500만원',
    priceNote: 'VAT 별도',
    oneLiner: '특허와 다음 자금 로드맵까지 더해 장기 성장전략을 미리 준비합니다.',
    included: [
      'B 프로그램 전체',
      '특허 아이디어 발굴과 기술구조 설계',
      '제휴 변리사를 통한 특허출원 연계 1건',
      '12개월 정책자금·인증 실행 로드맵',
      '우선 신청기관과 준비순서',
      '핵심 심사질문과 대응방향',
      '자금조달 이후 개발·매출확장 계획',
    ],
    fit: '기술자산과 후속 자금까지 한 번에 준비하려는 기업',
    recommended: false,
    ctaLabel: 'AX 혁신성장 완성형 상담',
  },
]

export function axPackage(key: 'A' | 'B' | 'C'): AxPackage {
  return AX_PACKAGES.find((p) => p.key === key)!
}

/** 가격표 아래 공통 고지 — 자격업무·외부기관 심사는 별도임을 분명히 한다. */
export const AX_PACKAGE_NOTES: string[] = [
  '전 금액 VAT 별도입니다.',
  '특허 등 자격이 필요한 업무는 제휴 변리사가 수행합니다. 세무·노무·법률도 해당 자격 전문가가 담당합니다.',
  '벤처·연구소·특허의 최종 결과와 처리기간은 외부기관의 심사·처리절차에 따라 달라집니다.',
  '세 프로그램은 AX 사업화·컨설팅·인증 준비 패키지입니다. 운영형 본개발은 별도 계약입니다.',
]

/** 2주 진행과정 — 시연형 MVP와 AX 결과물의 범위. 외부기관 일정은 포함하지 않는다. */
export type AxTimelineStep = { range: string; title: string; items: string[] }

export const AX_TIMELINE: AxTimelineStep[] = [
  { range: 'Day 0~1', title: '인터뷰와 자료확인', items: ['사업과 자금문제', '현재 업무', '고객과 매출구조', 'AX로 바꿀 영역'] },
  { range: 'Day 1~2', title: '방향과 디자인 초안', items: ['업무 흐름', '사업화 방향', '주요 화면', '디자인 방향'] },
  { range: 'Day 3~5', title: '시연형 MVP 초안', items: ['핵심 화면', '고객·직원 사용 흐름', '대표자 1차 확인'] },
  { range: 'Day 6~10', title: '피드백과 사업구조 보완', items: ['실제 업무 반영', '신규 매출모델', '자금사용계획 연결'] },
  { range: 'Day 10~14', title: '최종 AX 사업화 결과물 완성 목표', items: ['선택 범위의 최종 화면', '사업화 구조', '정책자금 설명논리', '향후 실행 로드맵'] },
]

export const AX_TIMELINE_INCLUDED = ['AX 사업화 설계', '화면과 시연형 MVP', '사업화 아이디어', '자금·인증 방향']

export const AX_TIMELINE_EXCLUDED = [
  '정책기관의 자금심사',
  '벤처확인기관의 심사',
  '연구소 인정 처리기간',
  '특허청·변리사 처리기간',
  '복잡한 운영형 시스템 전체 개발',
  '고객의 자료제출과 의사결정 지연',
]

export const AX_TIMELINE_NOTICE =
  '자료와 피드백이 원활한 경우 AX 사업화 설계와 시연형 결과물은 최대 2주 완성을 목표로 합니다. 외부기관 심사와 운영형 본개발 일정은 별도입니다.'

/** 최초 5일 산출물의 정확한 정의 — 상용 시스템으로 오인되지 않게 한다. */
export const AX_MVP_DEFINITION =
  '5일 시점의 결과물은 시연형 MVP 초안입니다. 로그인·데이터 저장·외부연동을 갖춘 상용 시스템이 아니라, 화면과 사용 흐름을 직접 눌러 확인하는 단계입니다.'

/** 운영형 본개발 안내 — FAQ·상세 하단에서만 노출한다. */
export const AX_BUILD_NOTE: string[] = [
  '시연형 MVP 이후 실제 운영형 개발이 필요한 경우, 필요한 기능과 사용인원을 확인한 뒤 별도로 견적합니다.',
  '처음부터 모든 기능을 만들지 않고, 정책자금과 실제 업무에 가장 중요한 기능부터 단계적으로 구현합니다.',
]

/** 실제 제공 결과물 — 패키지에 따라 해당 항목을 제공한다. */
export type AxDeliverable = { name: string; desc: string; from: 'A' | 'B' | 'C' }

export const AX_DELIVERABLES_V2: AxDeliverable[] = [
  { name: '기업·자금 진단 요약', desc: '현재 사업과 자금 상태를 한 장으로 정리합니다.', from: 'A' },
  { name: '현재와 개선 업무 흐름', desc: '지금 방식과 바뀔 방식을 나란히 비교합니다.', from: 'A' },
  { name: 'AX 사업구조', desc: '무엇을 데이터로 남기고 어떤 서비스로 만들지 설계합니다.', from: 'A' },
  { name: '신규 사업화 아이디어 2개', desc: '업종 데이터로 만들 수 있는 새 매출모델을 제안합니다.', from: 'A' },
  { name: '주요 화면과 시연형 MVP', desc: '직접 눌러볼 수 있는 화면으로 만듭니다.', from: 'A' },
  { name: '자금사용계획', desc: '자금이 어디에 쓰이는지 화면과 연결해 설명합니다.', from: 'A' },
  { name: '벤처 준비자료', desc: '혁신성장유형 설명에 필요한 사업·기술 구조를 정리합니다.', from: 'B' },
  { name: '연구소 설립 준비자료', desc: '연구전담부서·연구소 준비 항목과 증빙 방향을 정리합니다.', from: 'B' },
  { name: '특허 아이디어와 출원 연계', desc: '기술구조를 정리하고 제휴 변리사 출원으로 연결합니다.', from: 'C' },
  { name: '12개월 실행 로드맵', desc: '기관 신청 순서와 준비 시점을 월 단위로 정리합니다.', from: 'C' },
]

/** 고객 선별기준 */
export const AX_SELECTION_PRIORITY = [
  '1억원 이상의 성장자금이 실제로 필요한 기업',
  '자금을 사업확장·인력·개발·시설에 사용할 기업',
  '인터뷰와 자료제공에 적극적으로 참여할 기업',
  '기존 사업을 새로운 매출구조로 확장할 의지가 있는 기업',
  '단기 대출보다 기업의 장기성장을 준비하는 기업',
]

export const AX_SELECTION_DECLINE = [
  '개인채무나 생활비 목적',
  '승인만 보장해달라는 경우',
  '허위자료를 요구하는 경우',
  '인터뷰와 자료제공이 어려운 경우',
  '실제 사업변화 없이 AI라는 표현만 붙이려는 경우',
]

/** 미래AI랩 고유 5단계 방법론 */
export type AxMethodStep = { no: number; title: string; desc: string; icon: string }

export const AX_METHOD_STEPS: AxMethodStep[] = [
  { no: 1, icon: '🔍', title: '숨은 사업자산 발견', desc: '대표님의 경험, 고객, 거래와 반복 업무에서 기술과 데이터가 될 부분을 찾습니다.' },
  { no: 2, icon: '🔄', title: '현재 업무 AX 전환', desc: '엑셀·카카오톡·수기 업무를 관리자와 직원이 사용하는 하나의 흐름으로 바꿉니다.' },
  { no: 3, icon: '🚀', title: '신규 사업모델 확장', desc: '내부 관리에서 끝내지 않고 고객이 사용하는 앱·웹과 반복매출 모델로 확장합니다.' },
  { no: 4, icon: '🏅', title: '기술근거 구축', desc: '필요한 기업에는 벤처·연구소·특허를 연결해 혁신성과 개발계획을 설명할 근거를 만듭니다.' },
  { no: 5, icon: '💰', title: '자금과 성장 연결', desc: '사업계획, 자금사용계획과 실제 화면을 연결하고 다음 기관과 성장순서까지 설계합니다.' },
]

/** 미래AI랩이 만드는 세 가지 가치 */
export const AX_CORE_VALUES = [
  { icon: '🏛️', title: '정책자금에서 평가받는 사업구조', desc: '기술성·사업성·성장성을 설명할 수 있는 형태로 회사를 다시 정리합니다.' },
  { icon: '🖥️', title: '심사자가 눈으로 확인하는 실행 증거', desc: '문서 속 계획을 실제 화면과 업무 흐름으로 연결합니다.' },
  { icon: '📈', title: '자금조달 이후의 성장 로드맵', desc: '조달로 끝내지 않고 매출로 이어질 다음 순서까지 함께 설계합니다.' },
]
