// 퀘스트형 기업 성장진단 — 질문 데이터 (화면 로직과 분리).
// 질문을 추가/수정할 때 이 파일만 고치면 됩니다. showIf 로 분기(생략) 처리.
import type { DiagnosisAnswers, DiagnosisQuestion, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

export const DIAGNOSIS_VERSION = 1

export const STAGE_INFO: Record<DiagnosisStage, { name: string; copy: string }> = {
  1: { name: '회사 기본체력', copy: '먼저 우리 회사의 현재 위치를 확인해볼게요.' },
  2: { name: '자금·지원제도 준비도', copy: '필요한 자금과 지원제도를 활용할 준비가 되어 있는지 확인해볼게요.' },
  3: { name: '성장 인프라', copy: '자금과 지원사업을 더 잘 활용하기 위한 회사의 성장 기반을 살펴볼게요.' },
}

// 답변 헬퍼
const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)

export const isFounderToBe = (a: DiagnosisAnswers) => one(a, 'bizType') === 'pre'
export const isIndividual = (a: DiagnosisAnswers) => one(a, 'bizType') === 'individual'
export const isCorp = (a: DiagnosisAnswers) => one(a, 'bizType') === 'corp'
export const noFundingNeed = (a: DiagnosisAnswers) => one(a, 'fundingWhen') === 'none'
export const hasArrears = (a: DiagnosisAnswers) => one(a, 'taxArrears') === 'yes'

export const questions: DiagnosisQuestion[] = [
  // ── 1단계: 회사 기본체력 ─────────────────────────────
  {
    id: 'bizType',
    stage: 1,
    type: 'single',
    title: '현재 사업 상태를 알려주세요',
    options: [
      { value: 'individual', label: '개인사업자' },
      { value: 'corp', label: '법인사업자' },
      { value: 'pre', label: '예비창업자', desc: '아직 사업자등록 전이에요' },
    ],
  },
  {
    id: 'industry',
    stage: 1,
    type: 'single',
    title: '어떤 업종에 가까우신가요?',
    options: [
      { value: 'manufacture', label: '제조업' },
      { value: 'retail', label: '도소매업' },
      { value: 'service', label: '서비스업' },
      { value: 'construction', label: '건설업' },
      { value: 'it', label: 'IT·소프트웨어' },
      { value: 'medical', label: '병원·요양·의료 관련' },
      { value: 'logistics', label: '운수·물류' },
      { value: 'professional', label: '전문직' },
      { value: 'etc', label: '기타' },
    ],
  },
  {
    id: 'years',
    stage: 1,
    type: 'single',
    title: '사업을 시작한 지 얼마나 되셨나요?',
    options: [
      { value: 'pre', label: '창업 전' },
      { value: 'lt1', label: '1년 미만' },
      { value: 'y1to3', label: '1년 이상 3년 미만' },
      { value: 'y3to7', label: '3년 이상 7년 미만' },
      { value: 'y7plus', label: '7년 이상' },
    ],
  },
  {
    id: 'revenue',
    stage: 1,
    type: 'single',
    title: '최근 연매출은 어느 정도인가요?',
    desc: '대략적인 범위면 충분해요.',
    options: [
      { value: 'none', label: '매출 없음' },
      { value: 'lt1', label: '1억원 미만' },
      { value: 'r1to5', label: '1억원 이상 5억원 미만' },
      { value: 'r5to10', label: '5억원 이상 10억원 미만' },
      { value: 'r10to30', label: '10억원 이상 30억원 미만' },
      { value: 'r30plus', label: '30억원 이상' },
    ],
  },
  {
    id: 'employees',
    stage: 1,
    type: 'single',
    title: '현재 직원은 몇 명인가요?',
    desc: '대표님 본인은 제외하고 알려주세요.',
    options: [
      { value: 'none', label: '없음' },
      { value: 'e1to4', label: '1~4명' },
      { value: 'e5to9', label: '5~9명' },
      { value: 'e10to29', label: '10~29명' },
      { value: 'e30plus', label: '30명 이상' },
    ],
  },
  {
    id: 'concerns',
    stage: 1,
    type: 'multi',
    title: '요즘 가장 큰 고민은 무엇인가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    exclusiveValues: ['unknown'],
    options: [
      { value: 'workingCapital', label: '운전자금' },
      { value: 'facility', label: '시설·장비 구입' },
      { value: 'hiring', label: '신규채용' },
      { value: 'tax', label: '세금 부담' },
      { value: 'govSupport', label: '정부지원사업' },
      { value: 'certification', label: '기업인증' },
      { value: 'bigDeal', label: '대기업 거래·입찰' },
      { value: 'online', label: '홈페이지·온라인 영업' },
      { value: 'manualWork', label: '반복업무·수기관리' },
      { value: 'unknown', label: '아직 무엇이 필요한지 모르겠음' },
    ],
  },

  // ── 2단계: 자금·지원제도 준비도 ─────────────────────
  {
    id: 'fundingWhen',
    stage: 2,
    type: 'single',
    title: '자금이 언제쯤 필요하신가요?',
    options: [
      { value: 'm1', label: '당장 1개월 이내' },
      { value: 'm3', label: '3개월 이내' },
      { value: 'm6', label: '6개월 이내' },
      { value: 'planning', label: '아직 계획 단계' },
      { value: 'none', label: '자금 필요 없음' },
    ],
  },
  {
    id: 'fundingPurpose',
    stage: 2,
    type: 'multi',
    title: '자금이 필요한 목적은 무엇인가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    showIf: (a) => !noFundingNeed(a),
    exclusiveValues: ['unknown'],
    options: [
      { value: 'working', label: '인건비·임차료 등 운전자금' },
      { value: 'machine', label: '기계·장비 구입' },
      { value: 'realestate', label: '사업장 구입·확장' },
      { value: 'material', label: '원재료 매입' },
      { value: 'newBiz', label: '신규사업 투자' },
      { value: 'refinance', label: '기존 고금리 대출 대환 검토' },
      { value: 'unknown', label: '아직 정확히 모르겠음' },
    ],
  },
  {
    id: 'taxArrears',
    stage: 2,
    type: 'single',
    title: '국세·지방세 체납이 있으신가요?',
    desc: '솔직하게 답할수록 더 정확한 방향을 안내드릴 수 있어요.',
    options: [
      { value: 'no', label: '없음' },
      { value: 'paying', label: '현재 분납 또는 정리 중' },
      { value: 'yes', label: '있음' },
      { value: 'unsure', label: '잘 모르겠음' },
    ],
  },
  {
    id: 'govExperience',
    stage: 2,
    type: 'single',
    title: '최근 정부지원사업을 신청해본 적 있으신가요?',
    options: [
      { value: 'won', label: '선정 경험 있음' },
      { value: 'applied', label: '신청했지만 미선정' },
      { value: 'prepared', label: '준비만 해봄' },
      { value: 'never', label: '신청 경험 없음' },
    ],
  },
  {
    id: 'bizPlan',
    stage: 2,
    type: 'single',
    title: '사업계획서나 회사 소개자료가 있으신가요?',
    options: [
      { value: 'recent', label: '최신 자료를 보유' },
      { value: 'old', label: '오래된 자료만 보유' },
      { value: 'simple', label: '간단한 소개자료만 있음' },
      { value: 'none', label: '없음' },
    ],
  },
  {
    id: 'hiring',
    stage: 2,
    type: 'single',
    title: '채용과 관련해 지금 상황은 어떠신가요?',
    options: [
      { value: 'recent', label: '최근 신규채용함' },
      { value: 'plan6m', label: '6개월 이내 채용 예정' },
      { value: 'parental', label: '육아휴직 또는 대체인력 대상 있음' },
      { value: 'retention', label: '기존 직원 고용유지가 고민' },
      { value: 'na', label: '해당 없음' },
    ],
  },

  // ── 3단계: 성장 인프라 ───────────────────────────────
  {
    id: 'website',
    stage: 3,
    type: 'single',
    title: '회사 홈페이지가 있으신가요?',
    options: [
      { value: 'good', label: '모바일까지 잘 작동하는 홈페이지 있음' },
      { value: 'old', label: '홈페이지는 있지만 오래됐음' },
      { value: 'snsOnly', label: 'SNS·블로그만 있음' },
      { value: 'none', label: '홈페이지 없음' },
    ],
  },
  {
    id: 'workflow',
    stage: 3,
    type: 'single',
    title: '회사 업무는 주로 어떻게 관리하시나요?',
    options: [
      { value: 'system', label: '전용 시스템으로 통합관리' },
      { value: 'excel', label: '엑셀 위주' },
      { value: 'kakao', label: '카카오톡·메신저 위주' },
      { value: 'paper', label: '수기·종이 위주' },
      { value: 'scattered', label: '여러 도구에 흩어져 있음' },
    ],
  },
  {
    id: 'venture',
    stage: 3,
    type: 'single',
    title: '벤처기업확인을 보유하고 계신가요?',
    // 예비창업자는 기존 기업 대상 인증 질문 생략 (창업 후 검토 안내)
    showIf: (a) => !isFounderToBe(a),
    options: [
      { value: 'have', label: '보유' },
      { value: 'expired', label: '과거 보유했으나 만료' },
      { value: 'preparing', label: '준비 중' },
      { value: 'none', label: '없음' },
      { value: 'unsure', label: '잘 모르겠음' },
    ],
  },
  {
    id: 'researchLab',
    stage: 3,
    type: 'single',
    title: '기업부설연구소나 연구개발전담부서가 있으신가요?',
    showIf: (a) => !isFounderToBe(a),
    options: [
      { value: 'have', label: '보유' },
      { value: 'preparing', label: '준비 중' },
      { value: 'none', label: '없음' },
      { value: 'unsure', label: '잘 모르겠음' },
    ],
  },
  {
    id: 'otherCerts',
    stage: 3,
    type: 'multi',
    title: '보유 중인 다른 기업인증이 있으신가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    showIf: (a) => !isFounderToBe(a),
    exclusiveValues: ['none', 'unsure'],
    options: [
      { value: 'mainbiz', label: '메인비즈' },
      { value: 'innobiz', label: '이노비즈' },
      { value: 'iso', label: 'ISO' },
      { value: 'patent', label: '특허·상표' },
      { value: 'etc', label: '기타 인증' },
      { value: 'none', label: '아무것도 없음' },
      { value: 'unsure', label: '잘 모르겠음' },
    ],
  },
  {
    id: 'futurePlans',
    stage: 3,
    type: 'multi',
    title: '앞으로 어떤 계획이 있으신가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    exclusiveValues: ['none'],
    options: [
      { value: 'bigCorp', label: '대기업 납품' },
      { value: 'bidding', label: '공공기관 입찰' },
      { value: 'export', label: '해외수출' },
      { value: 'invest', label: '투자유치' },
      { value: 'govSupport', label: '정부지원사업' },
      { value: 'newProduct', label: '신규 제품·서비스 개발' },
      { value: 'expand', label: '지점·사업장 확장' },
      { value: 'none', label: '특별한 계획 없음' },
    ],
  },
  {
    id: 'consultTiming',
    stage: 3,
    type: 'single',
    title: '상담이나 실행은 언제쯤 원하시나요?',
    options: [
      { value: 'now', label: '바로 상담받고 싶음' },
      { value: 'm1', label: '한 달 이내' },
      { value: 'm3', label: '3개월 이내' },
      { value: 'infoOnly', label: '정보만 확인하고 싶음' },
    ],
  },
]

/** 답변 직후 짧은 인라인 피드백 (혜택 카드와 별개의 가벼운 문구) */
export function getInlineFeedback(questionId: string, answers: DiagnosisAnswers): InlineFeedback | null {
  const v = answers[questionId]
  if (questionId === 'taxArrears' && v === 'yes') {
    return { tone: 'warn', text: '정책자금보다 먼저 확인해야 할 선결과제가 발견되었습니다.' }
  }
  if (questionId === 'taxArrears' && v === 'no') {
    return { tone: 'good', text: '좋아요. 자금 검토의 기본 조건이 갖춰져 있어요.' }
  }
  if (questionId === 'fundingWhen' && (v === 'm1' || v === 'm3')) {
    return { tone: 'info', text: '자금 시점이 가까워요. 준비 순서가 특히 중요해집니다.' }
  }
  if (questionId === 'govExperience' && v === 'won') {
    return { tone: 'good', text: '선정 경험은 다음 신청에서도 큰 자산이 됩니다.' }
  }
  return null
}

/** 현재 답변 기준으로 노출되는 질문 목록 (분기 반영) */
export function getVisibleQuestions(answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => !q.showIf || q.showIf(answers))
}
