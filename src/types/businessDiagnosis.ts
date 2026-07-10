// 퀘스트형 기업 성장 종합진단 — 공용 타입.
// 질문·혜택·점수는 전부 데이터/엔진 파일에서 관리하고, 화면 컴포넌트는 이 타입만 사용합니다.

/** 답변 맵 — questionId → 선택값(단일) 또는 선택값 배열(다중) */
export type DiagnosisAnswers = Record<string, string | string[] | undefined>

export type DiagnosisStage = 1 | 2 | 3

export type DiagnosisOption = {
  value: string
  label: string
  /** 선택지 아래 짧은 보조설명 (선택) */
  desc?: string
}

export type DiagnosisQuestion = {
  id: string
  stage: DiagnosisStage
  type: 'single' | 'multi'
  title: string
  desc?: string
  options: DiagnosisOption[]
  /** true 면 '나중에 답하기' 허용 */
  optional?: boolean
  /** 다중선택에서 이 값을 고르면 나머지 선택 해제 (예: '해당 없음') */
  exclusiveValues?: string[]
  /** 조건부 노출 — 미충족 시 질문 생략 (생략은 점수에 불이익 없음) */
  showIf?: (answers: DiagnosisAnswers) => boolean
}

/** 답변 직후 짧은 인라인 피드백 (혜택 카드보다 가벼움) */
export type InlineFeedback = {
  tone: 'info' | 'warn' | 'good'
  text: string
}

/** 근거 유형 — 1차에서는 전부 qualitative (검증된 수치 아님) */
export type ClaimType = 'qualitative' | 'verified'

export type BenefitCard = {
  id: string
  /** 이 질문에 답한 직후 노출 */
  afterQuestionId: string
  /** 노출 조건 */
  triggerIf: (answers: DiagnosisAnswers) => boolean
  /** 첫 화면 */
  title: string
  desc: string
  revealCta: string
  /** 전환 후 — before/after 라벨 */
  beforeLabel: string
  afterLabel: string
  /** 순차 등장하는 혜택 문구 (정성 표현만) */
  benefits: string[]
  /** 상단 피드백 배지 (준비도 +N — 내부 지표) */
  feedbackLabel: string
  feedbackArea: ScoreArea
  feedbackPoints: number
  continueCta: string
  /** '점검해볼게요' 클릭 시 저장되는 관심 키 */
  interestKey: string
  claimType: ClaimType
  sourceLabel?: string
  verifiedMetric?: string
  lastVerifiedAt?: string
}

/** 6개 준비도 영역 */
export type ScoreArea = 'funding' | 'employment' | 'govSupport' | 'certification' | 'credibility' | 'digital'

export type AreaPriority = '지금 필요' | '있으면 유리' | '현재 우선순위 낮음' | '먼저 해결할 선결과제'

export type AreaResult = {
  area: ScoreArea
  label: string
  /** 0~100 — 실제 승인확률이 아닌 내부 준비도 점수 */
  score: number
  status: '먼저 준비 필요' | '보완하면 활용 가능' | '활용 검토 가능'
  priority: AreaPriority
  note: string
  /** 펼쳤을 때 보여줄 근거 목록 */
  reasons: string[]
}

export type ProductRecommendation = {
  slug: string
  rank: '1순위' | '2순위' | '장기 검토'
  reason: string
}

export type DiagnosisResultData = {
  summary: string
  areas: AreaResult[]
  strengths: string[]
  improvements: string[]
  prerequisites: string[]
  actionPlan: string[]
  recommendations: ProductRecommendation[]
  /** 정책자금·지원사업 활용 기반 (우대 참고요소) */
  advantages: AdvantageResultItem[]
  ownedAdvantageCount: number
  /** 게이트 전 티저용 — 최우선 과제 1개 / 종합 준비도(내부 지표) */
  topTask: string
  overallScore: number
}

/** 정책자금 평가·우대 참고요소 (⚠️ 확정 가점·승인확률 아님) */
export type AdvantageGroup = 'technology' | 'management' | 'credibility' | 'expert'

export type AdvantageStatus = '보유' | '준비 중' | '검토 추천' | '자료 확인 필요' | '현재 우선순위 낮음'

export type PolicyAdvantageFactor = {
  id: string
  label: string
  group: AdvantageGroup
  description: string
  /** 관련 질문 id (관리자 화면 근거 표시용) */
  questionIds: string[]
  /** 보유로 판정되는 조건 */
  ownedCondition: (answers: DiagnosisAnswers) => boolean
  /** '준비 중'으로 판정되는 조건 */
  preparingCondition?: (answers: DiagnosisAnswers) => boolean
  /** '자료 확인 필요'로 판정되는 조건 (모름·미결산 등) */
  verifyCondition?: (answers: DiagnosisAnswers) => boolean
  /** '검토 추천'(미보유)으로 판정되는 조건 */
  missingCondition: (answers: DiagnosisAnswers) => boolean
  benefits: string[]
  relevantProductSlugs: string[]
  claimType: ClaimType
  sourceLabel?: string
  sourceDate?: string
  verificationNote?: string
  priority: number
  /** true 면 상품 판매 대신 '전문가 연결 검토' 로만 안내 */
  expertReferralOnly: boolean
  /** expertReferralOnly 항목의 노출 조건 */
  showIf?: (answers: DiagnosisAnswers) => boolean
}

export type AdvantageResultItem = {
  id: string
  label: string
  group: AdvantageGroup
  status: AdvantageStatus
  description: string
  expertReferralOnly: boolean
}

/** 유입경로 (첫 진입 시 1회 캡처) */
export type UtmInfo = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
  landingPath?: string
}

/** 결과 게이트에서 수집하는 대표자 정보 */
export type LeadFormData = {
  companyName: string
  representativeName: string
  phone: string
  email?: string
  contactMethod?: string
  preferredContactTime?: string
  privacyConsent: boolean
  consultationConsent: boolean
  marketingConsent: boolean
}

/** localStorage 저장 구조 */
export type DiagnosisSession = {
  diagnosisVersion: number
  sessionId: string
  startedAt: string
  /** 현재 보고 있던 질문 id (이어하기용) */
  currentQuestionId: string | null
  answers: DiagnosisAnswers
  /** 혜택 카드에서 '점검해볼게요'를 누른 관심 키 목록 */
  interests: string[]
  /** 답변 중 발견된 보유 우대 참고요소 id (모션·카운트용) */
  foundAdvantages: string[]
  completed: boolean
  completedAt?: string
  /** 유입경로 (최초 1회) */
  utm?: UtmInfo
  /** 서버 저장 연결 정보 */
  serverSessionId?: string
  leadId?: string
  leadSubmittedAt?: string
}
