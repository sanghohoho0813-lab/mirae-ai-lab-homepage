// 3분 AX Fit — 질문 데이터 (화면 로직과 분리).
// 10문항, 모두 정도 선택형. 질문을 추가/수정할 때 이 파일만 고치면 됩니다.
//
// 1~9번: 현재 업무방식의 문제·복잡도 신호 (아니다 0 → 거의 항상 3)
// 10번:  새 시스템을 실제로 함께 쓸 내부 담당자 유무 (준비도)
import type { DiagnosisAnswers, DiagnosisQuestion, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

// v5: 종합 경영진단 → AX Fit 10문항. 구버전 세션·결과는 호환되지 않아 안전 초기화한다.
export const DIAGNOSIS_VERSION = 5

export const AX_FIT_INFO = {
  name: '3분 AX Fit',
  copy: '현재 업무방식과 시스템을 기준으로, 우리 회사에 어떤 AX가 맞는지 먼저 판단합니다.',
} as const

/** 서버·저장 호환용 단계 정보 — AX Fit 은 1단계 하나 */
export const STAGE_INFO: Record<DiagnosisStage, { name: string; copy: string }> = {
  1: { name: AX_FIT_INFO.name, copy: AX_FIT_INFO.copy },
}

/** 정도 선택형 공통 보기 — 값은 점수 계산에서 0·1·2·3 으로 읽는다 */
export const DEGREE_OPTIONS = [
  { value: 'no', label: '아니다' },
  { value: 'sometimes', label: '가끔 그렇다' },
  { value: 'often', label: '자주 그렇다' },
  { value: 'always', label: '거의 항상 그렇다' },
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
  degree('repeatInput', '직원들이 같은 정보를 여러 곳에 반복해서 입력하고 있다.', '예: 주문을 카톡에서 받아 엑셀에 적고, 다시 ERP에 넣는 식이요.'),
  degree('askProgress', '대표나 관리자가 직원에게 진행상황을 자주 직접 물어봐야 한다.'),
  degree('toolGaps', 'Excel·카카오톡·전화·ERP 등 여러 도구 사이에서 업무가 끊긴다.'),
  degree('manualHandoff', '고객 요청·주문·예약·문의가 내부 업무로 수동 전달된다.'),
  degree('missDelay', '업무 누락·지연·재확인이 반복된다.'),
  degree('priorityByMemory', '어떤 일을 먼저 처리할지 담당자의 경험이나 기억에 의존한다.'),
  degree('dataUnused', '거래처·고객·업무 데이터는 있지만 의사결정에 충분히 활용하지 못한다.'),
  degree('ceoLoadGrows', '직원이나 거래량이 늘면서 대표 또는 관리자의 확인업무도 함께 늘고 있다.'),
  degree('uniqueWork', '기존 ERP·POS·SaaS만으로 해결되지 않는 회사 고유의 업무가 있다.', '기성 프로그램에 없는 기능을 엑셀이나 사람 손으로 메우고 있다면 여기에 해당해요.'),
  {
    id: 'internalOwner',
    stage: 1,
    type: 'single',
    title: '새 시스템을 실제로 함께 사용할 내부 담당자 또는 관리자가 있다.',
    desc: '구축보다 정착이 어렵습니다. 함께 쓸 사람이 있는지가 진행 속도를 좌우해요.',
    options: [
      { value: 'dedicated', label: '있다', desc: '전담으로 맡을 담당자가 있어요' },
      { value: 'partTime', label: '겸임으로 맡을 사람이 있다' },
      { value: 'ceo', label: '대표가 직접 해야 한다' },
      { value: 'none', label: '아직 없다' },
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
    return { tone: 'info', text: '기성 솔루션이 비워둔 자리가 있군요. 그 업무가 AX 설계의 출발점이 됩니다.' }
  }
  if (questionId === 'internalOwner' && v === 'none') {
    return { tone: 'warn', text: '괜찮아요. 함께 쓸 담당자를 정하는 것부터 결과에서 안내드릴게요.' }
  }
  return null
}

/** 전체 노출 질문 목록 (분기 반영) — 관리자/호환용 */
export function getVisibleQuestions(answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => !q.showIf || q.showIf(answers))
}
