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

/** 근거 유형 — qualitative(정성) / conditional_verified(조건부 검증 수치) / verified(검증) */
export type ClaimType = 'qualitative' | 'conditional_verified' | 'verified'

/** 공식 출처 (수치형 혜택은 반드시 출처+확인일 함께) */
export type BenefitSource = { name: string; url?: string; verifiedAt?: string }

/** 조건부/검증 혜택 (수치·세제 등) */
export type VerifiedBenefit = {
  text: string
  claimType: ClaimType
  /** 화면 배지 (예: '조건 충족 시 50% 감면 검토') */
  badge?: string
  /** 적용 조건 (반드시 함께 노출) */
  conditions?: string[]
  source?: BenefitSource
}

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
  // ── 확장(선택) — 없으면 기존 표시 유지 ──
  /** 현재 상태에서 아쉬운 점 (한 문장) */
  currentRisk?: string
  /** 쉬운 설명 (중학생도 이해) */
  simpleDescription?: string
  /** '혜택 더 보기'로 펼치는 추가 정성 혜택 */
  moreBenefits?: string[]
  /** 조건부·검증 혜택 (수치·세제) */
  verifiedBenefits?: VerifiedBenefit[]
  /** 연결 상품 slug (부족 시) */
  relatedProductSlugs?: string[]
  /** 하단 주의문구 */
  disclaimer?: string
}

/** 6개 준비도 영역 */
export type ScoreArea = 'funding' | 'employment' | 'govSupport' | 'certification' | 'credibility' | 'digital'

export type AreaPriority = '지금 필요' | '있으면 유리' | '현재 우선순위 낮음' | '먼저 해결할 선결과제'

/** 색상 심각도 톤 */
export type SeverityTone = 'green' | 'blue' | 'amber' | 'orange' | 'red'

export type AreaResult = {
  area: ScoreArea
  label: string
  /** 0~100 — 실제 승인확률이 아닌 내부 준비도 점수 */
  score: number
  status: '먼저 준비 필요' | '기본 준비 부족' | '보완하면 활용 가능' | '활용 준비 양호' | '자료·증빙까지 우수'
  priority: AreaPriority
  note: string
  /** 펼쳤을 때 보여줄 근거 목록 */
  reasons: string[]
  // ── 확장(문제·행동 중심) ──
  /** 현재 상태 한 문장 */
  statusSentence: string
  /** 그대로 두면 놓칠 수 있는 부분 */
  missText: string
  /** 지금 할 수 있는 가장 작은 행동 */
  smallAction: string
  /** 연결 상품 slug */
  linkedProductSlug?: string
  /** 색상 톤 */
  tone: SeverityTone
}

/** 진단 확신도 (잘 모르겠음 응답 기반) */
export type DiagnosisConfidence = { level: '높음' | '보통' | '낮음'; unknownCount: number; note: string }

export type ProductRecommendation = {
  slug: string
  rank: '1순위' | '2순위' | '장기 검토'
  reason: string
  /** 이 서비스로 해결되는 문제 (결과 보고서 표시용) */
  problems?: string[]
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
  /** 진단 확신도 */
  confidence: DiagnosisConfidence
  /** 지금 먼저 확인할 3가지 (문제·행동 중심) */
  topPriorities: TopPriority[]
  /** 지금 놓치고 있을 수 있는 혜택 (≤4) */
  missedBenefits: MissedBenefit[]
  /** 기간별 실행 로드맵 */
  roadmap: { now30: string[]; m1to3: string[]; m3to12: string[] }
  /** 한줄 종합 진단 */
  headline: string
}

export type TopPriority = {
  rank: number
  problem: string
  why: string
  ifIgnored: string
  action: string
  linkedProductSlug?: string
  tone: SeverityTone
}

export type MissedBenefit = {
  title: string
  status: '조건 확인 필요' | '현재 검토 가능' | '자료 확인 필요' | '현재는 대상 가능성 낮음'
  note: string
  /** 수치형이면 조건·출처 */
  verified?: VerifiedBenefit
  linkedProductSlug?: string
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
  /** 기업 규모 정보(업력·업종·연매출·직원수·지역) — 상담 폼에서 선택 시 이메일 동봉 */
  companyProfile?: Record<string, string>
  privacyConsent: boolean
  consultationConsent: boolean
  marketingConsent: boolean
}

/** 진단 깊이 (완료 단계) */
export type DiagnosisDepth = 'basic' | 'funding' | 'comprehensive' // 1 / 2 / 3 단계

/** 단계별 즉시 리포트 */
export type StageReportData = {
  depth: DiagnosisStage // 1 | 2 | 3
  headline: string
  summary: string
  /** 단계 상단 지표 카드 (라벨/값/보조문구) */
  metricCards: { label: string; value: string; sub?: string; tone?: 'blue' | 'emerald' | 'amber' | 'orange' | 'red' | 'slate' }[]
  strengths: string[]
  improvements: string[]
  prerequisites: string[]
  /** 1단계 전용 — 가장 시급한 과제 1개 */
  topTask?: string
  /** 6개 영역 (2·3단계) */
  areas?: AreaResult[]
  /** 3단계 종합 전용 */
  advantages?: AdvantageResultItem[]
  ownedAdvantageCount?: number
  actionPlan?: string[]
  /** 단계별 추천 상품 (1·2단계 ≤2, 3단계 ≤3) */
  recommendations: ProductRecommendation[]
  /** 다음 단계 안내 문구 (3단계는 없음) */
  nextHint?: string
  /** 종합 준비도 (내부 지표) */
  overallScore: number
  // ── 3단계 종합 보고서 확장 ──
  topPriorities?: TopPriority[]
  missedBenefits?: MissedBenefit[]
  roadmap?: { now30: string[]; m1to3: string[]; m3to12: string[] }
  confidence?: DiagnosisConfidence
}

/** 실시간 진단 현황 (질문 답변마다 갱신) */
export type LiveStatus = {
  strengthCount: number
  gapCount: number
  interestCount: number
  headline: string
  /** 최근 변화 (강조용) */
  lastChange?: { kind: 'strength' | 'gap' | 'interest' | 'info'; text: string }
}

/** 저장된 완료 결과 기록 (localStorage history) */
export type SavedResult = {
  resultId: string
  sessionId: string
  createdAt: string
  updatedAt: string
  completedStage: DiagnosisStage
  diagnosisDepth: DiagnosisDepth
  answers: DiagnosisAnswers
  interests: string[]
  foundAdvantages: string[]
  resultVersion: number
  /** 재계산 가능하도록 답변만 보관하고, 표시 스냅샷도 저장 */
  snapshot: StageReportData
  leadId?: string
}

/** localStorage 저장 구조 (v3: 점진형 단계) */
export type DiagnosisSession = {
  diagnosisVersion: number
  sessionId: string
  startedAt: string
  currentQuestionId: string | null
  answers: DiagnosisAnswers
  /** '내 추천 목록에 담기'로 저장된 관심 키 */
  interests: string[]
  /** 답변 중 발견된 보유 우대 참고요소 id */
  foundAdvantages: string[]
  /** 혜택 패널에서 '추천에 넣지 않고 다음'을 누른 키 */
  skippedBenefits: string[]
  /** 진단 진행 상태 */
  currentStage: DiagnosisStage
  completedStages: DiagnosisStage[]
  stoppedAfterStage: DiagnosisStage | null
  nextStageInterest: boolean
  /** 각 단계 시작 시각(ms) — 소요시간 측정 */
  stageStartedAt: Partial<Record<DiagnosisStage, number>>
  stageDurations: Partial<Record<DiagnosisStage, number>>
  completed: boolean
  completedAt?: string
  utm?: UtmInfo
  serverSessionId?: string
  leadId?: string
  leadSubmittedAt?: string
}
