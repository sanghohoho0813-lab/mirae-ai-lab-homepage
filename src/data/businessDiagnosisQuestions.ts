// 3분 AX Fit — 질문 데이터 (화면 로직과 분리).
// 14문항, 모두 정도 선택형. 질문을 추가/수정할 때 이 파일과 점수 엔진(PROBLEM_IDS·PROBLEM_COPY·CLUSTERS),
// 서버 재계산(api/business-diagnosis.ts 의 AX_PROBLEM_QS)을 같이 고칩니다.
//
// 1~13번: 현재 업무방식의 문제·복잡도 신호 (아니요 0 → 거의 항상 그래요 3). 13번(uniqueWork)은 고유 업무.
// 14번:   새 시스템을 실제로 함께 쓸 내부 담당자 유무 (준비도)
// 문항을 늘려도 저장 버전(DIAGNOSIS_VERSION)은 올리지 않는다 — 기존 답은 그대로 쓰고, 이어하기는 안 푼 질문부터 연다.
import type { DiagnosisAnswers, DiagnosisQuestion, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

// v5: 종합 경영진단 → AX Fit(10문항 → 14문항으로 확장, 같은 v5). 구버전 세션·결과는 호환되지 않아 안전 초기화한다.
export const DIAGNOSIS_VERSION = 5

export const AX_FIT_INFO = {
  name: '3분 AX Fit',
  copy: '지금 일하는 방식을 보고, 우리 회사에 어떤 AX가 맞는지 먼저 판단해 드려요.',
} as const

/** 서버·저장 호환용 단계 정보 — AX Fit 은 1단계 하나 */
export const STAGE_INFO: Record<DiagnosisStage, { name: string; copy: string }> = {
  1: { name: AX_FIT_INFO.name, copy: AX_FIT_INFO.copy },
}

/** 정도 선택형 공통 보기 — 값은 점수 계산에서 0·1·2·3 으로 읽는다 */
export const DEGREE_OPTIONS = [
  { value: 'no', label: '아니요' },
  { value: 'sometimes', label: '가끔 그래요' },
  { value: 'often', label: '자주 그래요' },
  { value: 'always', label: '거의 항상 그래요' },
] as const

export const DEGREE_VALUE: Record<string, number> = { no: 0, sometimes: 1, often: 2, always: 3 }

/** 마지막 문항(내부 담당자) — 준비도 값 */
export const OWNER_VALUE: Record<string, number> = { dedicated: 3, partTime: 2, ceo: 1, none: 0 }

const degree = (id: string, title: string, desc?: string): DiagnosisQuestion => ({
  id,
  stage: 1,
  type: 'single',
  title,
  desc,
  options: DEGREE_OPTIONS.map((o) => ({ ...o })),
})

export const questions: DiagnosisQuestion[] = [
  // 입력·서류 → 진행·연결 → 고객 응대 → 판단·사람 의존 → 데이터·매출 → 성장 부담 순으로 묻는다
  degree('repeatInput', '같은 정보를 여러 곳에 반복해서 입력하고 있나요?', '예: 카톡으로 받은 주문을 엑셀에 적고, ERP에 또 넣는 식이요.'),
  degree('docRepeat', '견적서, 계약서, 보고서 같은 서류를 매번 처음부터 새로 만드나요?', '예: 지난번 견적서를 찾아 복사한 뒤 품목과 금액을 하나하나 고치는 식이요.'),
  degree('askProgress', '일이 어디까지 됐는지, 대표님이나 관리자가 직접 물어봐야 아나요?'),
  degree('toolGaps', '엑셀, 카톡, 전화, ERP를 오가다 일이 중간에 끊기나요?'),
  degree('manualHandoff', '고객 주문이나 예약, 문의를 사람이 일일이 담당자에게 넘기나요?'),
  degree('repeatQuestions', '고객이나 거래처가 묻는 같은 질문에, 직원이 매번 직접 답하나요?', '예: 가격, 재고, 배송 일정, 예약 가능 시간처럼 답이 정해진 질문이요.'),
  degree('missDelay', '빠뜨리거나 늦어져서 다시 챙겨야 하는 일이 반복되나요?'),
  degree('priorityByMemory', '무슨 일을 먼저 할지, 담당자의 경험이나 기억에 맡기고 있나요?'),
  degree('handover', '담당자가 바뀌거나 자리를 비우면, 그 사람이 하던 일이 멈추거나 인수인계가 오래 걸리나요?'),
  degree('dataUnused', '거래처, 고객, 업무 기록은 있는데 결정할 때 잘 활용하지 못하나요?'),
  degree('revenueLeak', '다시 연락할 때가 된 고객이나, 추가로 제안할 거래처를 놓치고 있나요?', '예: 재구매 시기, 계약 갱신일, 견적만 받고 끝난 고객이요.'),
  degree('ceoLoadGrows', '직원이나 거래가 늘수록, 대표님이나 관리자가 확인할 일도 같이 늘고 있나요?'),
  degree('uniqueWork', '기존 ERP, POS, SaaS로는 해결이 안 되는 우리 회사만의 일이 있나요?', '시중 프로그램에 없는 기능을 엑셀이나 사람 손으로 메우고 있다면 해당돼요.'),
  {
    id: 'internalOwner',
    stage: 1,
    type: 'single',
    title: '새 시스템을 회사 안에서 함께 쓸 담당자나 관리자가 있나요?',
    desc: '만드는 것보다 자리 잡게 하는 게 더 어렵습니다. 함께 쓸 사람이 있으면 진행이 빨라져요.',
    options: [
      { value: 'dedicated', label: '있어요', desc: '이 일을 전담으로 맡을 사람이 있어요' },
      { value: 'partTime', label: '다른 일과 함께 맡을 사람이 있어요' },
      { value: 'ceo', label: '대표가 직접 해야 해요' },
      { value: 'none', label: '아직 없어요' },
    ],
  },
]

export const QUESTION_COUNT = questions.length

/** 단계별 질문 (분기 반영) — AX Fit 은 1단계만 있다 */
export function stageQuestions(stage: DiagnosisStage, answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => q.stage === stage && (!q.showIf || q.showIf(answers)))
}

/** 답변 직후 짧은 인라인 피드백 — 흐름을 끊지 않도록 최소한만 */
export function getInlineFeedback(questionId: string, answers: DiagnosisAnswers): InlineFeedback | null {
  const v = answers[questionId]
  if (questionId === 'uniqueWork' && v === 'always') {
    return { tone: 'info', text: '시중 프로그램이 못 채우는 일이 있군요. 그 일이 AX 설계의 출발점이 됩니다.' }
  }
  if (questionId === 'internalOwner' && v === 'none') {
    return { tone: 'warn', text: '괜찮아요. 담당자를 정하는 일부터 결과에서 안내해 드릴게요.' }
  }
  return null
}

/** 전체 노출 질문 목록 (분기 반영) — 관리자/호환용 */
export function getVisibleQuestions(answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => !q.showIf || q.showIf(answers))
}
