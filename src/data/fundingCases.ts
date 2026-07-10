// 정책자금·보증부 자금 실제 사례 데이터 (하드코딩 · 백엔드 없음)
// ⚠️ 개인정보 보호: 회사명 비공개, 업종·대략적 기업 규모만 사용.
// ⚠️ '무조건 승인/100% 가능/누구나' 등 표현 금지. 진행 중 사례는 승인 완료와 분리.
// 신용보증기금·기술보증기금·지역신용보증재단 보증부 자금 포함.

export type CaseStat = { value: string; label: string; big?: boolean }

export const caseStats: CaseStat[] = [
  { value: '10건', label: '확인된 고유 승인 사례', big: true },
  { value: '12억 7,000만 원', label: '대표 사례 승인·확보 합계', big: true },
  { value: '5,000만 원 ~ 3억 원', label: '기업별 승인 범위', big: true },
  { value: '초기기업 ~ 연매출 20억 원대', label: '확인되는 기업 매출 범위', big: false },
]

export type FundingCase = {
  industry: string // 업종
  size: string // 기업 규모
  amount: string // 결과 금액(가장 크게)
  amountLabel: string // 기관/구성 요약
  problem: string
  strategy: string
  result: string // 결과 상세
  meta?: string[] // 기간·금리 등
  highlight: string // 강조문구
}

export const fundingCases: FundingCase[] = [
  {
    industry: '스페셜티 커피 원두 제조·로스터리',
    size: '연매출 약 4,000만 원',
    amount: '1억 원',
    amountLabel: '기술보증기금 승인',
    problem: '은행과 지역신보의 기존 대출 한도가 대부분 소진된 상태',
    strategy: '독자적인 로스팅 방식과 향미 개발 노하우를 기술자산으로 정리',
    result: '기술보증기금 1억 원 승인',
    meta: ['진행 약 5주'],
    highlight: '연매출 4,000만 원 기업, 기술력을 중심으로 1억 원 승인',
  },
  {
    industry: '시각디자인·간판 제조·OEM',
    size: '창업 1년 차 · 매출 증빙이 어려운 초기기업',
    amount: '1억 3,000만 원',
    amountLabel: '경기신보 + 중진공 합계',
    problem: '매출 실적이 부족하고, 잘못된 법인전환으로 청년창업 세제혜택도 사라질 위험',
    strategy: '직접생산·OEM 시장성 자료를 만들고 중진공 발표심사를 반복 훈련',
    result: '경기신용보증재단 3,000만 원 + 중진공 청년전용창업자금 1억 원',
    highlight: '매출 증빙이 부족한 창업 1년 차 기업, 총 1억 3,000만 원 승인',
  },
  {
    industry: '퓨전 한식 프랜차이즈 본사',
    size: '연매출 약 7억 ~ 8억 원',
    amount: '6,000만 원',
    amountLabel: '소상공인 혁신성장촉진자금',
    problem: '과거 대출 이력으로 은행과 보증기관에서 거절',
    strategy: '테이블오더·운영 데이터를 디지털 외식 혁신 역량으로 재구성',
    result: '소상공인 혁신성장촉진자금 6,000만 원 승인',
    meta: ['진행 약 6주', '기록상 금리 연 2.99%'],
    highlight: '대출이 많다는 이유로 거절됐던 프랜차이즈 본사, 6주 만에 6,000만 원 승인',
  },
  {
    industry: '유리 제조',
    size: '매출 비공개',
    amount: '1억 7,000만 원',
    amountLabel: '신용보증기금 + 소진공 합계',
    problem: '공장 이전·대규모 시설자금 차입으로 부채비율이 800%를 넘을 것으로 예상',
    strategy: '소비가 아닌 공장 이전·자산 취득을 위한 생산적 부채라는 점과 향후 상환 가능성을 설명',
    result: '신용보증기금 1억 원 + 소상공인진흥공단 7,000만 원',
    highlight: '부채비율 800% 예상 제조기업, 기관별 전략을 나눠 총 1억 7,000만 원 승인',
  },
  {
    industry: '토목공사·특수필터 제조 및 시공',
    size: '매출 비공개',
    amount: '3억 원',
    amountLabel: '신보 + 소진공 + 혁신성장 합계',
    problem: '법인 인수 후 가지급금 11억 원이 발견되고 대표 신용이 600점대로 하락',
    strategy: '가지급금·재무문제를 먼저 정리한 뒤 신보 → 저신용 자금 → 혁신성장 자금 순서로 접근',
    result: '신용보증기금 2억 원 + 소진공 3,000만 원 + 혁신성장촉진자금 7,000만 원',
    highlight: '가지급금 11억·신용 600점대 복합 위기 기업, 단계별 전략으로 총 3억 원 조달',
  },
  {
    industry: '광고·마케팅 대행',
    size: '시장 침체로 매출이 하락한 중소기업',
    amount: '2억 원',
    amountLabel: '중소벤처기업진흥공단 승인',
    problem: '직원 3개월분 급여 부족과 주식거래 관련 세무위험이 동시에 발생',
    strategy: '자금 신청 전에 세무위험을 먼저 정리하고, 매출 하락이 일시적이라는 객관적 근거를 제출',
    result: '중소벤처기업진흥공단 2억 원 승인',
    highlight: '매출 하락과 급여 위기를 겪던 광고대행사, 중진공 2억 원 승인',
  },
]

export type MoreCase = { industry: string; result: string }

export const moreFundingCases: MoreCase[] = [
  { industry: '맞춤형 가구 제조', result: '혁신성장촉진자금 5,000만 원' },
  { industry: '프랜차이즈 떡볶이 매장', result: '스마트 주방·디지털 운영 개선 구조로 9,000만 원' },
  { industry: '배달 플랫폼 스타트업', result: '신보 거절 후 기관 전환, 지역신용보증재단 1억 원' },
  { industry: '드라이아이스 도소매·임가공 (연매출 20억 원)', result: '보증부 자금 7,000만 원 확보 + 고용지원금 구조 정비' },
]

export const inProgressCase = {
  industry: '특수목적 화물차 도소매·OEM 제조',
  size: '연매출 약 70억 원',
  prep: ['연구전담부서 사후관리', 'ISO 3종', '메인비즈', '직무발명보상제도', '벤처기업 인증'],
  status: '5억 원 이상 성장자금 신청 진행 중',
}

export const CASES_DISCLAIMER =
  '사례는 개인정보 보호를 위해 회사명, 지역 및 세부 상황 일부를 유사 범위로 재구성했습니다. 정책자금의 승인 여부와 한도는 기업의 재무상태, 신용, 업력, 자금 용도 및 신청 시점의 제도에 따라 달라질 수 있습니다.'

export const CASES_CTA = {
  title: '우리 회사는 어느 기관부터 봐야 할까요?',
  desc: '매출만 보는 것이 아니라 업력, 신용, 기존 대출, 자금 용도와 성장계획을 함께 확인합니다.',
  button: '정책자금 가능성 상담하기',
}
