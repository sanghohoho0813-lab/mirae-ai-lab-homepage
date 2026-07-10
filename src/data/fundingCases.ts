// 정책자금·보증부 자금 실제 사례 데이터 (하드코딩 · 백엔드 없음)
// ⚠️ 개인정보 보호: 회사명 비공개, 업종·대략적 기업 규모만 사용.
// ⚠️ '무조건 승인/100% 가능/누구나' 등 표현 금지. 진행 중 사례는 승인 완료와 분리.
// ⚠️ 대화(chat)는 실제 상담 내용을 개인정보 보호를 위해 재구성한 '예시'입니다.
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
  size: string // 기업 규모
  amount: string // 결과 금액(가장 크게)
  amountLabel: string // 기관/구성 요약
  chat: ChatLine[] // 재구성된 상담 대화 예시
  meta?: string[] // 기간·금리 등
  highlight: string // 한 줄 요약
}

export const fundingCases: FundingCase[] = [
  {
    industry: '스페셜티 커피 원두 제조·로스터리',
    size: '연매출 약 4,000만 원',
    amount: '1억 원',
    amountLabel: '기술보증기금 승인',
    chat: [
      { from: 'client', text: '대표님 저희가 매출이 작아서 은행이랑 지역신보는 한도가 이미 다 막혔는데, 자금이 급해요 ㅠㅠ 방법이 있을까요?' },
      { from: 'me', text: '매출보다 기술이 강한 케이스세요. 로스팅 방식이랑 향미 개발 노하우를 기술자산으로 정리해서 기술보증기금으로 가보시죠.' },
      { from: 'client', text: '방금 승인 문자 받았어요 😭 1억이요!! 진짜 감사합니다 🙏' },
    ],
    meta: ['진행 약 5주'],
    highlight: '연매출 4,000만 원 기업, 기술력을 중심으로 1억 원 승인',
  },
  {
    industry: '시각디자인·간판 제조·OEM',
    size: '창업 1년 차 · 매출 증빙이 어려운 초기기업',
    amount: '1억 3,000만 원',
    amountLabel: '경기신보 + 중진공 합계',
    chat: [
      { from: 'client', text: '창업한 지 1년밖에 안 돼서 실적이 거의 없어요. 심지어 법인전환을 잘못해서 청년창업 세제혜택도 날아갈 판이라 너무 막막합니다.' },
      { from: 'me', text: '지금은 순서가 제일 중요해요. 직접생산·OEM 시장성 자료부터 만들고, 중진공 발표심사를 같이 반복해서 준비해보시죠.' },
      { from: 'client', text: '경기신보 3,000에 중진공 1억까지, 합쳐서 1억 3,000 나왔어요!! ㅠㅠ 감사합니다 대표님' },
    ],
    highlight: '매출 증빙이 부족한 창업 1년 차 기업, 총 1억 3,000만 원 승인',
  },
  {
    industry: '퓨전 한식 프랜차이즈 본사',
    size: '연매출 약 7억 ~ 8억 원',
    amount: '6,000만 원',
    amountLabel: '소상공인 혁신성장촉진자금',
    chat: [
      { from: 'client', text: '기존 대출이 많다고 은행도 보증기관도 다 거절당했습니다… 저흰 이제 안 되는 걸까요?' },
      { from: 'me', text: '대출 이력보다 운영 데이터가 강점이세요. 테이블오더·운영 데이터를 디지털 외식 혁신 역량으로 다시 정리해보죠.' },
      { from: 'client', text: '6주 만에 6,000만원 승인났어요! 금리도 2.99%요 😮 거절만 당하다가 눈물나네요 정말 감사합니다' },
    ],
    meta: ['진행 약 6주', '기록상 금리 연 2.99%'],
    highlight: '대출이 많다는 이유로 거절됐던 프랜차이즈 본사, 6주 만에 6,000만 원 승인',
  },
  {
    industry: '유리 제조',
    size: '공장 이전 · 대규모 시설투자 예정',
    amount: '1억 7,000만 원',
    amountLabel: '신용보증기금 + 소진공 합계',
    chat: [
      { from: 'client', text: '공장 이전 때문에 부채비율이 800% 넘게 잡힐 것 같은데… 이러면 아예 안 되는 거죠?' },
      { from: 'me', text: '소비성 부채가 아니라 공장 이전·자산 취득을 위한 생산적 부채잖아요. 그 구조랑 상환 가능성을 근거로 기관을 나눠서 가보죠.' },
      { from: 'client', text: '신보 1억에 소진공 7,000까지 총 1억 7,000 됐습니다! 포기할 뻔했는데 감사해요' },
    ],
    highlight: '부채비율 800% 예상 제조기업, 기관별 전략을 나눠 총 1억 7,000만 원 승인',
  },
  {
    industry: '토목공사·특수필터 제조 및 시공',
    size: '법인 인수 직후 · 복합 재무위기',
    amount: '3억 원',
    amountLabel: '신보 + 소진공 + 혁신성장 합계',
    chat: [
      { from: 'client', text: '법인을 인수했더니 가지급금이 11억이 나오고, 제 신용도 600점대로 떨어졌어요. 답이 없어 보입니다…' },
      { from: 'me', text: '한 번에 안 갑니다. 가지급금·재무부터 먼저 정리하고 신보 → 저신용 자금 → 혁신성장 순서로 단계별로 가시죠.' },
      { from: 'client', text: '단계별로 하니까 신보 2억, 소진공 3,000, 혁신성장 7,000… 다 합쳐서 3억 조달했어요. 진짜 대박이에요' },
    ],
    highlight: '가지급금 11억·신용 600점대 복합 위기 기업, 단계별 전략으로 총 3억 원 조달',
  },
  {
    industry: '광고·마케팅 대행',
    size: '시장 침체로 매출이 하락한 중소기업',
    amount: '2억 원',
    amountLabel: '중소벤처기업진흥공단 승인',
    chat: [
      { from: 'client', text: '직원 급여가 3개월치 부족한데 주식거래 관련 세무위험까지 겹쳤어요. 지금 자금 신청해도 될까요?' },
      { from: 'me', text: '신청 전에 세무위험부터 정리하는 게 먼저예요. 매출 하락이 일시적이라는 객관적 근거도 같이 준비하죠.' },
      { from: 'client', text: '중진공에서 2억 승인났습니다!! 급한 불 껐어요 정말 감사합니다' },
    ],
    highlight: '매출 하락과 급여 위기를 겪던 광고대행사, 중진공 2억 원 승인',
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
  '상담 대화는 실제 내용을 개인정보 보호를 위해 재구성한 예시이며, 회사명·지역·세부 상황 일부를 유사 범위로 바꿨습니다. 정책자금의 승인 여부와 한도는 기업의 재무상태, 신용, 업력, 자금 용도 및 신청 시점의 제도에 따라 달라질 수 있습니다.'

export const CASES_CTA = {
  title: '우리 회사는 어느 기관부터 봐야 할까요?',
  desc: '매출만 보는 것이 아니라 업력, 신용, 기존 대출, 자금 용도와 성장계획을 함께 확인합니다.',
  button: '정책자금 가능성 상담하기',
}
