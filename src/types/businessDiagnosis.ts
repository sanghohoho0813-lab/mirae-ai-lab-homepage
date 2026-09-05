// 3분 AX Fit — 공용 타입.
// 질문·점수는 데이터/엔진 파일에서 관리하고, 화면 컴포넌트는 이 타입만 사용합니다.
//
// v5: 종합 경영진단(정책자금·고용·인증·홈페이지)을 AX 적합성 진단 10문항으로 전면 교체.
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

/** AX Fit 등급 — 4단계 */
export type AxFitGrade = 'NO_GO' | 'LITE' | 'FULL' | 'HIGH'

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
}

/** 3분 AX Fit 결과 보고서 */
export type AxFitReport = {
  version: number
  grade: AxFitGrade
  /** 화면 표기 — NO-GO / LITE AX / FULL AX CANDIDATE / HIGH PRIORITY */
  gradeLabel: string
  /** 등급 설명 한 문장 */
  gradeDesc: string
  /** 0~100, 5점 단위 — 승인확률이 아니라 내부 판단 지표 */
  score: number
  headline: string
  summary: string
  /** 현재 가장 큰 문제 TOP 3 */
  topProblems: AxFitProblem[]
  /** 권장 AX 방향 */
  direction: { title: string; points: string[] }
  /** 다음 행동 */
  nextActions: string[]
  /** 내부 담당자 준비 상태 */
  readiness: { label: string; note: string }
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
