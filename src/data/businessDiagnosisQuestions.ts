// 3분 AX Fit — 질문 데이터 (화면 로직과 분리).
// 질문을 추가/수정할 때 이 파일과 추천 엔진(src/lib/businessDiagnosisEngine.ts),
// 서버 재계산(api/business-diagnosis.ts 의 axPackage·scoreLead)을 같이 고칩니다.
//
// v6: '업무가 얼마나 힘든가' 만 묻던 14문항을, 상품 세 가지(MVP 500 · 플랫폼형 1,500 · 풀 패키지 3,000만원부터)
//     중 어디서 시작할지 가를 수 있게 다시 짰다. 상담 전에 알아야 할 것(상황·이유·시기·예산)을 함께 묻는다.
//
//  ① 회사와 상황   : 사업 단계 · 업종 · 인원 · 상담 이유(여러 개) · 시기
//  ② 만들 것       : 가장 먼저 만들고 싶은 것
//  ③ 업무 신호 4개 : 반복 입력 · 대표 확인 · 고객 요청 전달 · 고유 업무 (정도 선택형)
//  ④ 준비          : 내부 담당자 · 예산
// 예비창업(창업 전)은 굴러가는 업무가 없으니 ③과 내부 담당자를 건너뛴다(7문항).
import type { DiagnosisAnswers, DiagnosisQuestion, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

// v5(업무 강도 10·14문항)와 질문·결과 구조가 달라 저장된 세션·결과는 안전 초기화한다.
export const DIAGNOSIS_VERSION = 6

export const AX_FIT_INFO = {
  name: '3분 AX Fit',
  copy: '지금 상황과 일하는 방식을 보고, 어디서부터 시작하면 좋을지 판단해 드려요.',
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

/** 내부 담당자 — 준비도 값 */
export const OWNER_VALUE: Record<string, number> = { dedicated: 3, partTime: 2, ceo: 1, none: 0 }

/** 업무 신호(정도 선택형) — 결과지의 "업무 질문 4개 중 N개" 는 이 목록 기준이다 */
export const WORK_SIGNAL_IDS = ['repeatInput', 'ceoCheck', 'manualHandoff', 'uniqueWork'] as const

/** 예비창업이면 굴러가는 업무가 없어 업무 신호·내부 담당자를 묻지 않는다 */
export const isPreStartup = (a: DiagnosisAnswers) => a['bizStage'] === 'pre'
const operating = (a: DiagnosisAnswers) => !isPreStartup(a)

const degree = (id: string, title: string, desc?: string): DiagnosisQuestion => ({
  id,
  stage: 1,
  type: 'single',
  title,
  desc,
  options: DEGREE_OPTIONS.map((o) => ({ ...o })),
  showIf: operating,
})

const single = (id: string, title: string, options: DiagnosisQuestion['options'], desc?: string): DiagnosisQuestion => ({
  id,
  stage: 1,
  type: 'single',
  title,
  desc,
  options,
})

export const questions: DiagnosisQuestion[] = [
  // ① 회사와 상황 — 가볍게 답할 수 있는 것부터
  single('bizStage', '지금 사업은 어느 단계인가요?', [
    { value: 'pre', label: '창업 전이에요', desc: '예비창업' },
    { value: 'early', label: '창업 3년 미만이에요' },
    { value: 'growth', label: '3~7년 됐어요' },
    { value: 'mature', label: '7년 넘었어요' },
  ]),
  single('industry', '어떤 일을 하는 회사인가요?', [
    { value: 'manufacturing', label: '제조' },
    { value: 'distribution', label: '도소매·유통' },
    { value: 'food', label: '음식점·프랜차이즈' },
    { value: 'booking', label: '예약·방문 서비스', desc: '병원, 학원, 뷰티, 스포츠 등' },
    { value: 'it', label: 'IT·플랫폼·앱' },
    { value: 'other', label: '그 밖의 서비스' },
  ]),
  single('teamSize', '대표님을 포함해 몇 명이 함께 일하나요?', [
    { value: 'solo', label: '혼자예요' },
    { value: 'small', label: '2~4명' },
    { value: 'mid', label: '5~19명' },
    { value: 'large', label: '20~49명' },
    { value: 'over', label: '50명 이상' },
  ]),
  {
    id: 'reason',
    stage: 1,
    type: 'multi',
    title: 'AX 상담을 받아 보려는 이유는 무엇인가요?',
    desc: '해당하는 것을 모두 골라 주세요.',
    // AX가 '정책자금 받는 수단'으로만 읽히지 않게 — 회사 일(업무 정리·고객 서비스)을 먼저 두고,
    // 자금·지원사업·투자는 그 뒤에 두면서 보장하지 않는다는 말을 보기 위에 늘 보여 준다.
    note: 'AX는 정책자금을 받기 위한 수단이 아니라, 회사가 일하는 방식을 바꾸는 일이에요. 정책자금·지원사업·투자도 함께 준비해 드리지만, 만든 화면과 데이터는 심사에서 참고 자료나 가점 요소가 될 수 있을 뿐 승인·선정·투자를 보장하지 않아요.',
    options: [
      { value: 'ops', label: '회사 일이 복잡해져 정리가 필요해요' },
      { value: 'service', label: '고객이 쓸 서비스를 만들고 싶어요', desc: '주문, 예약, 회원, 앱 등' },
      { value: 'fund', label: '정책자금이 필요해요', desc: '운전자금, 시설자금 등' },
      { value: 'grant', label: '정부지원사업에 붙고 싶어요', desc: '예비·초기창업패키지, R&D(연구개발) 과제 등' },
      { value: 'invest', label: '투자 유치를 앞두고 있어요' },
      { value: 'cert', label: '벤처기업확인·기업 인증을 준비해요' },
      { value: 'explore', label: '아직은 알아보는 중이에요' },
    ],
    exclusiveValues: ['explore'],
  },
  single('timeline', '언제까지 준비가 필요하세요?', [
    { value: 'within1m', label: '1개월 안', desc: '신청 마감이나 발표가 코앞이에요' },
    { value: 'within3m', label: '3개월 안' },
    { value: 'within6m', label: '6개월 안' },
    { value: 'none', label: '정해진 일정은 없어요' },
  ]),

  // ② 만들 것 — 세 가지 상품으로 갈리는 질문
  single('buildTarget', '가장 먼저 만들고 싶은 것은 무엇인가요?', [
    { value: 'demo', label: '심사·투자 자리에서 보여 줄 시제품', desc: '아이디어를 실제로 눌러 볼 수 있는 화면' },
    { value: 'customer', label: '고객·거래처가 직접 쓰는 화면', desc: '주문, 예약, 회원, 상담 신청 등' },
    { value: 'internal', label: '직원과 대표가 쓰는 회사 운영 화면', desc: '매출·재고·업무 현황과 AI 판단' },
    { value: 'both', label: '고객 화면과 회사 운영을 한 번에', desc: '들어온 주문이 바로 회사 운영으로 이어지게' },
    { value: 'unsure', label: '아직 잘 모르겠어요', desc: '상담에서 같이 정해요' },
  ]),

  // ③ 업무 신호 — 예전 14문항에서 판단에 가장 크게 쓰이던 네 가지만 남겼다
  degree('repeatInput', '같은 정보를 여러 곳에 반복해서 입력하고 있나요?', '예: 카톡으로 받은 주문을 엑셀에 적고, ERP(경영관리 프로그램)에 또 넣는 식이요.'),
  degree('ceoCheck', '일이 어디까지 됐는지, 대표님이 직접 묻고 확인해야 돌아가나요?'),
  degree('manualHandoff', '고객 주문이나 예약, 문의를 사람이 일일이 받아서 넘기나요?'),
  // 영어 용어는 괄호 안에 한글을 붙인다 — 질문 화면은 괄호 부분을 작고 옅게 보여 준다
  degree(
    'uniqueWork',
    'ERP(경영관리 프로그램), POS(매장 판매관리), SaaS(구독형 프로그램) 같은 기존 프로그램으로는 해결이 안 되는 우리 회사만의 일이 있나요?',
    '시중 프로그램에 없는 기능을 엑셀이나 사람 손으로 메우고 있다면 해당돼요.',
  ),

  // ④ 준비 — 예산은 마지막에 묻는다(앞에서 상황을 다 말한 뒤라 덜 부담스럽다)
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
    showIf: operating,
  },
  single(
    'budget',
    '비용은 어느 정도로 생각하고 계세요?',
    [
      { value: 'under500', label: '500만 원 안팎' },
      { value: 'around1500', label: '1,500만 원 안팎' },
      { value: 'over3000', label: '3,000만 원 이상도 괜찮아요' },
      { value: 'afterFunding', label: '정책자금·지원금이 들어온 뒤 정하고 싶어요' },
      { value: 'unknown', label: '아직 모르겠어요' },
    ],
    '정해진 답은 없어요. 상담 전에 범위를 맞춰 보려는 질문이에요.',
  ),
]

/** 전체 질문 수(예비창업은 이보다 적다) */
export const QUESTION_COUNT = questions.length

/** 단계별 질문 (분기 반영) — AX Fit 은 1단계만 있다 */
export function stageQuestions(stage: DiagnosisStage, answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => q.stage === stage && (!q.showIf || q.showIf(answers)))
}

/** 답변 직후 짧은 인라인 피드백 — 흐름을 끊지 않도록 최소한만 */
export function getInlineFeedback(questionId: string, answers: DiagnosisAnswers): InlineFeedback | null {
  const v = answers[questionId]
  if (questionId === 'teamSize' && v === 'over') {
    return { tone: 'warn', text: '저희는 50인 미만 회사를 주로 돕고 있어요. 규모에 맞는지 상담에서 먼저 확인해 드릴게요.' }
  }
  if (questionId === 'timeline' && v === 'within1m') {
    return { tone: 'info', text: '일정이 빠듯하군요. 2주 안에 기본 틀을 만드는 순서로 같이 볼게요.' }
  }
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
