// 3분 AX Fit — 공용 타입.
// 질문·점수는 데이터/엔진 파일에서 관리하고, 화면 컴포넌트는 이 타입만 사용합니다.
//
// v5: 종합 경영진단(정책자금·고용·인증·홈페이지)을 AX 적합성 진단으로 전면 교체.
// v6: 결과를 4단계 등급에서 '어느 상품에서 시작할지'(MVP · 플랫폼형 · 풀 패키지)로 바꿨다.
//     세션·저장·API 페이로드 구조는 서버 호환을 위해 유지한다(단계는 1단계만 사용).

/** 답변 맵 — questionId → 선택값(단일) 또는 선택값 배열(다중) */
export type DiagnosisAnswers = Record<string, string | string[] | undefined>

/** 서버·저장 호환용 단계 번호 — AX Fit 은 1단계 하나로 끝난다 */
export type DiagnosisStage = 1

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

/** 답변 직후 짧은 인라인 피드백 */
export type InlineFeedback = {
  tone: 'info' | 'warn' | 'good'
  text: string
}

/** 색상 심각도 톤 */
export type SeverityTone = 'green' | 'blue' | 'amber' | 'orange' | 'red'

/** 추천 상품 — MVP(500만원부터) · 플랫폼형(1,500만원부터) · 풀 패키지(AX + 플랫폼, 3,000만원부터) */
export type AxFitGrade = 'MVP' | 'PLATFORM' | 'FULL'

/** 현재 가장 큰 문제 (TOP 3) */
export type AxFitProblem = {
  rank: number
  questionId: string
  /** 문제 한 줄 */
  title: string
  /** 왜 문제인지 */
  why: string
  /** 그대로 두면 */
  ifIgnored: string
  tone: SeverityTone
  /** 답변 강도 1~3 (가끔·자주·거의 항상) — 없는 수치를 만들지 않고 고른 답을 그대로 쓴다.
   *  구버전 저장 결과에는 없을 수 있어 선택값이다. */
  severity?: number
  /** 대표님이 고른 답 그대로 (예: '거의 항상 그렇다') */
  answerLabel?: string
}

/** 3분 AX Fit 결과 보고서 */
export type AxFitReport = {
  version: number
  /** 시작 추천 상품 (예산에 맞춰 목표보다 한 단계 낮게 시작할 수 있다) */
  grade: AxFitGrade
  /** 답으로 보아 결국 가야 할 상품 — 시작과 같으면 한 번에 가는 것 */
  target: AxFitGrade
  /** 화면 표기 — MVP / 플랫폼형 / 풀 패키지 */
  gradeLabel: string
  /** 상품 설명 한 문장 */
  gradeDesc: string
  /** 시작 가격 표기 (예: '1,500만원부터') */
  priceFrom: string
  /** 업무 신호 강도 0~100(5점 단위) — 관리자 참고용. 화면에 점수로 보여주지 않는다 */
  score: number
  headline: string
  summary: string
  /** 답에서 뽑은 상황 요약 칩 (단계 · 업종 · 인원 · 시기) */
  situation: { label: string; value: string }[]
  /** 이 상품을 권하는 이유 — 대표님 답을 근거로 */
  reasons: string[]
  /** 상담 이유별로 같이 준비할 것 */
  focus: { title: string; text: string }[]
  /** 비용·정산 안내 한 줄 */
  paymentNote: string
  /** 현재 가장 큰 문제 TOP 3 */
  topProblems: AxFitProblem[]
  /** 업무 문항 중 '자주 그렇다' 이상으로 답한 개수 — 구버전 저장 결과에는 없다 */
  painCount?: number
  /** 업무 문항 총 개수 (현재 4, 예비창업은 0) */
  painTotal?: number
  /** 권장 AX 방향 */
  direction: { title: string; points: string[] }
  /** 다음 행동 */
  nextActions: string[]
  /** 내부 담당자 준비 상태 — 예비창업은 묻지 않아 null */
  readiness: { label: string; note: string } | null
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

/** 상담 신청에서 수집하는 대표자 정보 */
export type LeadFormData = {
  companyName: string
  representativeName: string
  phone: string
  email?: string
  contactMethod?: string
  preferredContactTime?: string
  /** 추가 정보 — 서버가 허용하는 키만 이메일에 동봉된다 */
  companyProfile?: Record<string, string>
  privacyConsent: boolean
  consultationConsent: boolean
  marketingConsent: boolean
}

/** 진단 깊이 — 서버 enum 호환. AX Fit 완료는 'comprehensive' 로 보낸다. */
export type DiagnosisDepth = 'basic' | 'funding' | 'comprehensive'

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
  snapshot: AxFitReport
  leadId?: string
}

/** localStorage 저장 구조 — 서버 페이로드와 같은 모양을 유지한다 */
export type DiagnosisSession = {
  diagnosisVersion: number
  sessionId: string
  startedAt: string
  currentQuestionId: string | null
  answers: DiagnosisAnswers
  /** 결과 화면에서 추가로 표시한 관심 (예: 정책·R&D·기업성장 전략 함께 검토) */
  interests: string[]
  /** (구버전 호환) 항상 빈 배열 */
  foundAdvantages: string[]
  /** (구버전 호환) 항상 빈 배열 */
  skippedBenefits: string[]
  currentStage: DiagnosisStage
  completedStages: DiagnosisStage[]
  stoppedAfterStage: DiagnosisStage | null
  nextStageInterest: boolean
  /** 시작 시각(ms) — 소요시간 측정 */
  stageStartedAt: Partial<Record<DiagnosisStage, number>>
  stageDurations: Partial<Record<DiagnosisStage, number>>
  completed: boolean
  completedAt?: string
  utm?: UtmInfo
  serverSessionId?: string
  leadId?: string
  leadSubmittedAt?: string
}
