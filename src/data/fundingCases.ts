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

// 카톡 대화 한 줄 (client = 대표님/왼쪽 어두운 말풍선, me = 미래 AI 랩/오른쪽 노란 말풍선)
// text 안의 [[금액]] 은 화면에서 빨간 강조 박스로 렌더됩니다.
export type ChatLine = { from: 'client' | 'me'; text: string; time?: string }

export type FundingCase = {
  industry: string // 업종 (설명용, 다소 길어도 됨)
  pill: string // 필 배지용 짧은 업종 (예: '커피 로스터리')
  owner: string // 대표님 호칭 (예: '이대표님') — 채팅방 이름·필 배지에 사용
  size: string // 기업 규모 (연매출 등)
  summary: string // 폰 목업 하단 짧은 요약(상황+진행 기관)
  bigAmount: string // 초대형 헤드라인 숫자 (예: '1억')
  amount: string // 결과 금액(정식 표기)
  amountLabel: string // 기관/구성 요약
  chat: ChatLine[]
  meta?: string[] // 기간·금리 등
}

// 대화는 실제 진행 흐름(블로그 공개 사례)을 개인정보 보호 범위에서 재구성한 것입니다.
export const fundingCases: FundingCase[] = [
  {
    industry: '스페셜티 커피 원두 제조·로스터리',
    pill: '커피 로스터리',
    owner: '이대표님',
    size: '연매출 약 4,000만 원 · 기존 대출 보유',
    summary: '매출은 작아도 로스팅 기술력이 강해, 기술보증기금으로 방향을 잡아 5주 만에 승인됐습니다.',
    bigAmount: '1억',
    amount: '1억 원',
    amountLabel: '기술보증기금 승인',
    chat: [
      { from: 'client', text: '팀장님!! 기보에서 연락 왔습니다. [[1억]] 승인이래요!', time: '오후 2:14' },
      { from: 'me', text: '대표님 축하드립니다!! 상담 시작하고 딱 5주 만이네요 😊', time: '오후 2:15' },
      { from: 'client', text: '소진공 거절 났을 때는 진짜 포기할 뻔했는데… 감사합니다.', time: '오후 2:16' },
      { from: 'me', text: '거절 사유 확인하고 기보로 방향 바꾼 게 잘 맞았습니다. 로스터기 들어오면 꼭 보여주세요~', time: '오후 2:17' },
      { from: 'client', text: '원두 보내드릴게요 ㅎㅎ 다음에 채용 지원금도 상담 부탁드려요!', time: '오후 2:19' },
    ],
    meta: ['진행 약 5주', '기록상 금리 연 4%대'],
  },
  {
    industry: '시각디자인·간판 제조·OEM',
    pill: '간판 제조',
    owner: '박대표님',
    size: '창업 1년 차 · 매출 증빙이 어려운 초기기업',
    summary: '창업 초기라 실적이 부족했지만, 시장성 자료를 만들어 경기신보·중진공을 나눠 진행했습니다.',
    bigAmount: '1억 3천',
    amount: '1억 3,000만 원',
    amountLabel: '경기신보 + 중진공 합계',
    chat: [
      { from: 'client', text: '매니저님, 중진공 입금 확인했습니다! 이걸로 [[1억 3천]] 다 받았네요.', time: '오전 11:02' },
      { from: 'me', text: '축하드립니다 대표님~ 실적 없이 시작해서 여기까지 오셨어요 👏', time: '오전 11:03' },
      { from: 'client', text: '작년엔 매출 증빙도 없어서 안 될 줄 알았는데… 어머니가 제일 좋아하세요 ㅠㅠ', time: '오전 11:05' },
      { from: 'me', text: '사업 계획이 좋았습니다. 이어서 법인 전환 건도 진행하시죠!', time: '오전 11:06' },
    ],
  },
  {
    industry: '퓨전 한식 프랜차이즈 본사',
    pill: '외식 프랜차이즈',
    owner: '강대표님',
    size: '연매출 약 7억 ~ 8억 원 · 기존 대출 다수',
    summary: '대출 이력 때문에 계속 거절되던 상황이라, 테이블오더 운영 실적을 혁신성 관점으로 다시 정리했습니다.',
    bigAmount: '6천만',
    amount: '6,000만 원',
    amountLabel: '소상공인 혁신성장촉진자금',
    chat: [
      { from: 'client', text: '승인 문자 왔습니다. 그런데 금리가 [[연 2.99%]] 이거 맞나요??', time: '오후 4:41' },
      { from: 'me', text: '네 맞습니다^^ 기존 대출이 있어도 조건 좋게 나왔어요.', time: '오후 4:42' },
      { from: 'client', text: '은행에서 하도 거절당해서 반신반의했는데… 정말 감사합니다.', time: '오후 4:44' },
      { from: 'me', text: '2년 넘게 쌓인 테이블오더 운영 데이터가 큰 역할 했습니다. 축하드립니다!', time: '오후 4:45' },
    ],
    meta: ['진행 약 6주', '기록상 금리 연 2.99%'],
  },
  {
    industry: '토목공사·특수필터 제조 및 시공',
    pill: '건설·특수시공',
    owner: '박대표님',
    size: '법인 인수 직후 · 가지급금 등 복합 재무위기',
    summary: '가지급금과 신용 문제가 겹쳐, 재무를 먼저 정리한 뒤 신보·소진공·혁신성장 순으로 진행했습니다.',
    bigAmount: '3억',
    amount: '3억 원',
    amountLabel: '신보 + 소진공 + 혁신성장 합계',
    chat: [
      { from: 'client', text: '팀장님, 신보 [[2억]] 실행 확인했습니다. 1년 넘게 정말 고생 많으셨습니다.', time: '오전 10:22' },
      { from: 'me', text: '대표님이 잘 버텨주신 덕분입니다. 가지급금부터 정리한 보람이 있네요.', time: '오전 10:23' },
      { from: 'client', text: '작년엔 은행마다 거절이었는데… 실사 동행까지 해주셔서 든든했습니다.', time: '오전 10:25' },
      { from: 'me', text: '소진공 추가 건도 이번 주에 서류 접수하겠습니다. 끝까지 챙길게요!', time: '오전 10:26' },
    ],
  },
]

export type MoreCase = { industry: string; result: string }

export const moreFundingCases: MoreCase[] = [
  { industry: '유리 제조 (공장 이전·시설투자)', result: '신용보증기금 + 소진공 합계 1억 7,000만 원' },
  { industry: '광고·마케팅 대행 (시장 침체·매출 하락)', result: '중소벤처기업진흥공단 2억 원' },
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
