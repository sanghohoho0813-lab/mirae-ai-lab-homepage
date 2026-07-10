// 정책자금·보증부 자금 실제 사례 데이터 (하드코딩 · 백엔드 없음)
// ⚠️ 개인정보 보호: 회사명 비공개, 업종·대략적 기업 규모만 사용.
// ⚠️ '무조건 승인/100% 가능/누구나' 등 표현 금지. 진행 중 사례는 승인 완료와 분리.
// ⚠️ 대화(chat)는 개인정보 보호를 위해 회사명·세부 상황을 바꿔 정리한 내용입니다.
// 신용보증기금·기술보증기금·지역신용보증재단 보증부 자금 포함.

export type CaseStat = { value: string; label: string; big?: boolean }

export const caseStats: CaseStat[] = [
  { value: '10건', label: '확인된 고유 승인 사례', big: true },
  { value: '12억 7,000만 원', label: '대표 사례 승인·확보 합계', big: true },
  { value: '5,000만 원 ~ 3억 원', label: '기업별 승인 범위', big: true },
  { value: '초기기업 ~ 연매출 20억 원대', label: '확인되는 기업 매출 범위', big: false },
]

// 카톡 대화 한 줄 (client = 대표님/왼쪽 흰 말풍선, me = 미래 AI 랩/오른쪽 노란 말풍선)
export type ChatLine = { from: 'client' | 'me'; text: string }

export type FundingCase = {
  industry: string // 업종 (채팅방 이름)
  size: string // 기업 규모 (연매출 등)
  amount: string // 결과 금액(가장 크게)
  amountLabel: string // 기관/구성 요약
  chat: ChatLine[] // [정리(me) → 결과(client) → 마무리(me)] 순
  meta?: string[] // 기간·금리 등
}

// 대화 구성: me(노란) = 사례 정리 → client(흰, 대표님) = 결과 통보(말투 다양) → me(노란) = 짧은 마무리
export const fundingCases: FundingCase[] = [
  {
    industry: '스페셜티 커피 원두 제조·로스터리',
    size: '연매출 약 4,000만 원',
    amount: '1억 원',
    amountLabel: '기술보증기금 승인',
    chat: [
      { from: 'me', text: '매출은 적어도 기술이 강하셔서, 기술보증기금으로 진행했습니다.' },
      { from: 'client', text: '1억 원 승인 나왔습니다. 정말 감사합니다.' },
      { from: 'me', text: '정말 잘 됐네요.' },
    ],
    meta: ['진행 약 5주'],
  },
  {
    industry: '시각디자인·간판 제조·OEM',
    size: '창업 1년 차 · 매출 증빙이 어려운 초기기업',
    amount: '1억 3,000만 원',
    amountLabel: '경기신보 + 중진공 합계',
    chat: [
      { from: 'me', text: '창업 초기라 실적이 부족했지만, 시장성 자료를 만들고 경기신보와 중진공을 나눠 진행했습니다.' },
      { from: 'client', text: '합쳐서 1억 3,000만 원이요!! 진짜 믿기지가 않네요 ㅠㅠ' },
      { from: 'me', text: '축하드려요. 고생 많으셨어요.' },
    ],
  },
  {
    industry: '퓨전 한식 프랜차이즈 본사',
    size: '연매출 약 7억 ~ 8억 원',
    amount: '6,000만 원',
    amountLabel: '소상공인 혁신성장촉진자금',
    chat: [
      { from: 'me', text: '대출 이력 때문에 거절되셨던 만큼, 운영 데이터를 혁신 역량으로 재구성해 진행했습니다.' },
      { from: 'client', text: '6주 만에 6,000만 원 승인됐습니다. 금리도 연 2.99%로 나왔어요.' },
      { from: 'me', text: '수고 많으셨습니다.' },
    ],
    meta: ['진행 약 6주', '기록상 금리 연 2.99%'],
  },
  {
    industry: '유리 제조',
    size: '공장 이전 · 대규모 시설투자 예정',
    amount: '1억 7,000만 원',
    amountLabel: '신용보증기금 + 소진공 합계',
    chat: [
      { from: 'me', text: '부채비율이 높게 잡히는 상황이라, 생산적 부채라는 근거로 신보와 소진공을 나눠 진행했습니다.' },
      { from: 'client', text: '신보와 소진공 합쳐 총 1억 7,000만 원 확정됐습니다.' },
      { from: 'me', text: '다행입니다. 정말 잘 됐네요.' },
    ],
  },
  {
    industry: '토목공사·특수필터 제조 및 시공',
    size: '법인 인수 직후 · 복합 재무위기',
    amount: '3억 원',
    amountLabel: '신보 + 소진공 + 혁신성장 합계',
    chat: [
      { from: 'me', text: '가지급금과 신용 문제가 겹쳐서, 재무를 먼저 정리한 뒤 신보·소진공·혁신성장 순서로 진행했습니다.' },
      { from: 'client', text: '단계별로 진행해서 총 3억 원 조달했습니다.' },
      { from: 'me', text: '수고 많으셨습니다.' },
    ],
  },
  {
    industry: '광고·마케팅 대행',
    size: '시장 침체로 매출이 하락한 중소기업',
    amount: '2억 원',
    amountLabel: '중소벤처기업진흥공단 승인',
    chat: [
      { from: 'me', text: '매출 하락과 세무위험이 겹쳐서, 위험을 먼저 정리하고 중진공으로 진행했습니다.' },
      { from: 'client', text: '중진공 2억 원 승인됐습니다. 덕분에 급한 불 껐어요.' },
      { from: 'me', text: '정말 잘 됐네요.' },
    ],
  },
]

export type MoreCase = { industry: string; result: string }

export const moreFundingCases: MoreCase[] = [
  { industry: '맞춤형 가구 제조', result: '혁신성장촉진자금 5,000만 원' },
  { industry: '프랜차이즈 떡볶이 매장', result: '스마트 주방·디지털 운영 개선 구조로 9,000만 원' },
  { industry: '배달 플랫폼 스타트업', result: '신보 거절 후 기관 전환, 지역신용보증재단 1억 원' },
  { industry: '드라이아이스 도소매·임가공 (연매출 20억 원)', result: '보증부 자금 7,000만 원 + 고용지원금 구조 정비' },
]

export type InProgressCase = {
  industry: string
  size: string
  prep: string[]
  status: string
  chat: ChatLine[]
}

export const inProgressCase: InProgressCase = {
  industry: '특수목적 화물차 도소매·OEM 제조',
  size: '연매출 약 70억 원',
  prep: ['연구전담부서 사후관리', 'ISO 3종', '메인비즈', '직무발명보상제도', '벤처기업 인증'],
  status: '5억 원 이상 성장자금 신청 진행 중',
  chat: [
    { from: 'client', text: '연매출은 나오는데 성장자금을 더 크게 받고 싶어요. 뭘 준비해두면 유리할까요?' },
    { from: 'me', text: '지금부터 연구전담부서·ISO·메인비즈·벤처인증 같은 근거를 미리 쌓아두시죠. 준비 끝나면 5억 원 이상으로 신청 들어갑니다.' },
    { from: 'client', text: '네 서류 준비할게요! 신청 결과 나오면 바로 공유드릴게요' },
  ],
}

export const CASES_DISCLAIMER =
  '상담 내용은 개인정보 보호를 위해 회사명·지역·세부 상황 일부를 바꿔 정리했습니다. 정책자금의 승인 여부와 한도는 기업의 재무상태, 신용, 업력, 자금 용도 및 신청 시점의 제도에 따라 달라질 수 있습니다.'

export const CASES_CTA = {
  title: '우리 회사는 어느 기관부터 봐야 할까요?',
  desc: '매출만 보는 것이 아니라 업력, 신용, 기존 대출, 자금 용도와 성장계획을 함께 확인합니다.',
  button: '정책자금 가능성 상담하기',
}
