// 3분 AX Fit — 질문 데이터 (화면 로직과 분리).
// 10문항, 모두 정도 선택형. 질문을 추가/수정할 때 이 파일만 고치면 됩니다.
//
// 1~9번: 현재 업무방식의 문제·복잡도 신호 (아니요 0 → 거의 항상 그래요 3)
// 10번:  새 시스템을 실제로 함께 쓸 내부 담당자 유무 (준비도)
import type { DiagnosisAnswers, DiagnosisQuestion, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

// v5: 종합 경영진단 → AX Fit 10문항. 구버전 세션·결과는 호환되지 않아 안전 초기화한다.
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

/** 10번 내부 담당자 — 준비도 값 */
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
  degree('repeatInput', '같은 정보를 여러 곳에 반복해서 입력하고 있나요?', '예: 카톡으로 받은 주문을 엑셀에 적고, ERP에 또 넣는 식이요.'),
  degree('askProgress', '일이 어디까지 됐는지, 대표님이나 관리자가 직접 물어봐야 아나요?'),
  degree('toolGaps', '엑셀, 카톡, 전화, ERP를 오가다 일이 중간에 끊기나요?'),
  degree('manualHandoff', '고객 주문이나 예약, 문의를 사람이 일일이 담당자에게 넘기나요?'),
  degree('missDelay', '빠뜨리거나 늦어져서 다시 챙겨야 하는 일이 반복되나요?'),
  degree('priorityByMemory', '무슨 일을 먼저 할지, 담당자의 경험이나 기억에 맡기고 있나요?'),
  degree('dataUnused', '거래처, 고객, 업무 기록은 있는데 결정할 때 잘 활용하지 못하나요?'),
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
