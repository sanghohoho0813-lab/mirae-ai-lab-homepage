// 정책자금·보증부 자금 실제 사례 데이터 (하드코딩 · 백엔드 없음)
// ⚠️ 개인정보 보호: 회사명 비공개, 업종·대략적 기업 규모만 사용.
// ⚠️ '무조건 승인/100% 가능/누구나' 등 표현 금지. 승인 완료 사례만 게시.
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
  summary: string // 카드 상단 진행 요약(상황+진행 기관)
  amount: string // 결과 금액(가장 크게)
  amountLabel: string // 기관/구성 요약
  chat: ChatLine[] // [결과 반응(client) → 축하(me)] 순
  meta?: string[] // 기간·금리 등
}

// 상단 summary = 진행 요약 / 대화: client(흰) = 감사·반응(대부분 금액 미특정) → me(노란) = 짧은 축하
export const fundingCases: FundingCase[] = [
  {
    industry: '스페셜티 커피 원두 제조·로스터리',
    size: '연매출 약 4,000만 원',
    summary: '매출은 적어도 기술이 강하셔서, 기술보증기금으로 진행했습니다.',
    amount: '1억 원',
    amountLabel: '기술보증기금 승인',
    chat: [
      { from: 'client', text: '덕분에 잘 해결됐습니다. 정말 감사합니다.' },
      { from: 'me', text: '고생 많으셨습니다. 축하드려요.' },
    ],
    meta: ['진행 약 5주'],
  },
  {
    industry: '시각디자인·간판 제조·OEM',
    size: '창업 1년 차 · 매출 증빙이 어려운 초기기업',
    summary: '창업 초기라 실적이 부족했지만, 시장성 자료를 만들어 경기신보·중진공을 나눠 진행했습니다.',
    amount: '1억 3,000만 원',
    amountLabel: '경기신보 + 중진공 합계',
    chat: [
      { from: 'client', text: '안 될 줄 알았는데 진짜 다행이에요 ㅠㅠ 감사합니다!' },
      { from: 'me', text: '대표님, 정말 축하드립니다!' },
    ],
  },
  {
    industry: '퓨전 한식 프랜차이즈 본사',
    size: '연매출 약 7억 ~ 8억 원',
    summary: '대출 이력으로 거절되던 상황이라, 운영 데이터를 혁신 역량으로 재구성해 진행했습니다.',
    amount: '6,000만 원',
    amountLabel: '소상공인 혁신성장촉진자금',
    chat: [
      { from: 'client', text: '거절만 당하다가… 팀장님 덕분에 잘 풀렸습니다.' },
      { from: 'me', text: '잘 풀려서 다행입니다. 축하드려요.' },
    ],
    meta: ['진행 약 6주', '기록상 금리 연 2.99%'],
  },
  {
    industry: '유리 제조',
    size: '공장 이전 · 대규모 시설투자 예정',
    summary: '부채비율이 높게 잡히는 상황이라, 생산적 부채라는 근거로 신보·소진공을 나눠 진행했습니다.',
    amount: '1억 7,000만 원',
    amountLabel: '신용보증기금 + 소진공 합계',
    chat: [
      { from: 'client', text: '포기할 뻔했는데 잘 마무리됐네요. 고맙습니다.' },
      { from: 'me', text: '끝까지 함께해 주셔서 감사합니다. 축하드려요.' },
    ],
  },
  {
    industry: '토목공사·특수필터 제조 및 시공',
    size: '법인 인수 직후 · 복합 재무위기',
    summary: '가지급금과 신용 문제가 겹쳐, 재무를 먼저 정리한 뒤 신보·소진공·혁신성장 순으로 진행했습니다.',
    amount: '3억 원',
    amountLabel: '신보 + 소진공 + 혁신성장 합계',
    chat: [
      { from: 'client', text: '복잡했는데 단계별로 잘 정리해 주셔서 마무리됐습니다. 감사합니다.' },
      { from: 'me', text: '수고 많으셨습니다.' },
    ],
  },
  {
    industry: '광고·마케팅 대행',
    size: '시장 침체로 매출이 하락한 중소기업',
    summary: '매출 하락과 세무위험이 겹쳐, 위험을 먼저 정리하고 중진공으로 진행했습니다.',
    amount: '2억 원',
    amountLabel: '중소벤처기업진흥공단 승인',
    chat: [
      { from: 'client', text: '급한 불 껐습니다. 덕분에 한숨 돌렸어요.' },
      { from: 'me', text: '다행입니다. 축하드려요.' },
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

export const CASES_DISCLAIMER =
  '상담 내용은 개인정보 보호를 위해 회사명·지역·세부 상황 일부를 바꿔 정리했습니다. 정책자금의 승인 여부와 한도는 기업의 재무상태, 신용, 업력, 자금 용도 및 신청 시점의 제도에 따라 달라질 수 있습니다.'

export const CASES_CTA = {
  title: '우리 회사는 어느 기관부터 봐야 할까요?',
  desc: '매출만 보는 것이 아니라 업력, 신용, 기존 대출, 자금 용도와 성장계획을 함께 확인합니다.',
  button: '정책자금 가능성 상담하기',
}
