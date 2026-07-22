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
export const PROGRAM_CHOICES = ['기업진단·자금전략', '자금조달 실행형', 'AX 결합 성장자금형', '아직 잘 모르겠습니다'] as const
export type ProgramChoice = (typeof PROGRAM_CHOICES)[number]

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
