// 퀘스트형 기업 성장진단 — "혜택 발견 카드" 데이터.
// ⚠️ 표현 규칙: 승인율/한도/확률 등 근거 없는 수치 금지. 전부 정성(qualitative) 표현.
//    (+N 점수는 이 진단 내부의 '준비도 점수'이며 결과 화면에 그 성격을 명시합니다.)
import type { BenefitCard, DiagnosisAnswers } from '../types/businessDiagnosis'

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])

export const benefitCards: BenefitCard[] = [
  {
    id: 'venture',
    afterQuestionId: 'venture',
    triggerIf: (a) => ['none', 'expired', 'unsure'].includes(one(a, 'venture') ?? ''),
    title: '현재 벤처기업확인은 보유하고 있지 않습니다.',
    desc: '기업 상황에 따라 기술성과 성장성을 정리하면 정책자금·지원사업·대외신인도 측면에서 활용할 수 있는 여지가 있습니다.',
    revealCta: '준비하면 무엇이 달라질까요?',
    beforeLabel: '벤처기업확인 미보유',
    afterLabel: '벤처기업확인 준비 시',
    benefits: [
      '기술성과 성장성을 설명할 근거가 보강됩니다.',
      '일부 정책자금·정부지원사업에서 우대요소로 활용될 수 있습니다.',
      '기업의 대외신인도를 설명할 자료가 추가됩니다.',
    ],
    feedbackLabel: '기업인증 준비도 +8',
    feedbackArea: 'certification',
    feedbackPoints: 8,
    continueCta: '우리 회사도 가능성을 점검해볼게요',
    interestKey: 'venture',
    claimType: 'qualitative',
  },
  {
    id: 'researchLab',
    afterQuestionId: 'researchLab',
    // v2: lab/dept 보유는 '우대요소 발견' 모션으로 처리, 미보유만 혜택 카드
    triggerIf: (a) => ['none', 'unsure'].includes(one(a, 'researchLab') ?? ''),
    title: '기업부설연구소·전담부서가 아직 없으시군요.',
    desc: '연구개발 활동이 조금이라도 있다면, 이를 정식 조직으로 정리하는 것만으로 활용 범위가 넓어질 수 있습니다.',
    revealCta: '설립하면 무엇이 달라질까요?',
    beforeLabel: '연구조직 미보유',
    afterLabel: '연구조직 보유 시',
    benefits: [
      '연구개발 활동을 체계적으로 정리할 수 있습니다.',
      '연구개발 관련 세제지원을 검토할 기반이 생깁니다.',
      '정부지원사업·정책자금에서 연구개발 역량 설명자료로 활용됩니다.',
    ],
    feedbackLabel: '연구개발 기반 +10',
    feedbackArea: 'certification',
    feedbackPoints: 10,
    continueCta: '우리 회사도 가능성을 점검해볼게요',
    interestKey: 'researchLab',
    claimType: 'qualitative',
  },
  {
    id: 'website',
    afterQuestionId: 'website',
    triggerIf: (a) => ['none', 'snsOnly', 'old'].includes(one(a, 'website') ?? ''),
    title: '회사를 보여줄 홈페이지가 아쉬운 상태네요.',
    desc: '고객뿐 아니라 지원사업 심사자와 거래처도 회사를 검색해봅니다. 첫 화면이 없으면 그만큼 설명 기회를 잃게 됩니다.',
    revealCta: '정비하면 무엇이 달라질까요?',
    beforeLabel: '홈페이지 없음·노후',
    afterLabel: '홈페이지 정비 시',
    benefits: [
      '고객과 심사자가 회사를 이해하는 대표 화면이 생깁니다.',
      '광고·명함·제안서 유입을 받을 기본 채널이 마련됩니다.',
      'MVP나 기술서비스를 보여줄 결과물이 확보됩니다.',
    ],
    feedbackLabel: '온라인 신뢰도 +12',
    feedbackArea: 'digital',
    feedbackPoints: 12,
    continueCta: '우리 회사도 가능성을 점검해볼게요',
    interestKey: 'website',
    claimType: 'qualitative',
  },
  {
    id: 'workflow',
    afterQuestionId: 'workflow',
    triggerIf: (a) => ['excel', 'kakao', 'paper', 'scattered'].includes(one(a, 'workflow') ?? ''),
    title: '업무가 여러 곳에 흩어져 관리되고 있네요.',
    desc: '반복업무 1가지만 자동화해도 시간과 누락이 눈에 띄게 줄어드는 경우가 많습니다.',
    revealCta: '정리하면 무엇이 달라질까요?',
    beforeLabel: '수기·엑셀·메신저 관리',
    afterLabel: '업무 시스템 정리 시',
    benefits: [
      '반복업무를 한 흐름으로 정리할 수 있습니다.',
      'PC·모바일에서 데이터를 통합해 볼 수 있습니다.',
      '직원별 업무 누락과 자료 분산이 줄어들 수 있습니다.',
    ],
    feedbackLabel: '운영 효율 준비도 +10',
    feedbackArea: 'digital',
    feedbackPoints: 10,
    continueCta: '우리 회사도 가능성을 점검해볼게요',
    interestKey: 'workflow',
    claimType: 'qualitative',
  },
  {
    id: 'iso',
    afterQuestionId: 'futurePlans',
    triggerIf: (a) => {
      const plans = many(a, 'futurePlans')
      const iso = many(a, 'iso')
      const hasIso = iso.some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v))
      const wantsBig = plans.some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
      return wantsBig && !hasIso
    },
    title: '대기업·입찰·수출 계획이 있는데, ISO가 아직 없으시네요.',
    desc: '거래처와 심사기관은 품질·환경·안전관리 체계를 자료로 확인하고 싶어합니다.',
    revealCta: '취득하면 무엇이 달라질까요?',
    beforeLabel: 'ISO 미보유',
    afterLabel: 'ISO 보유 시',
    benefits: [
      '거래처의 관리체계 요구에 대응할 기반이 생깁니다.',
      '입찰·대외신뢰도 평가자료로 활용될 수 있습니다.',
      '품질·환경·안전관리 체계를 설명할 수 있게 됩니다.',
    ],
    feedbackLabel: '대외신인도 +9',
    feedbackArea: 'credibility',
    feedbackPoints: 9,
    continueCta: '우리 회사도 가능성을 점검해볼게요',
    interestKey: 'iso',
    claimType: 'qualitative',
  },
  {
    id: 'bizPlan',
    afterQuestionId: 'bizPlan',
    triggerIf: (a) => ['none', 'old'].includes(one(a, 'bizPlan') ?? ''),
    title: '사업계획서가 아직 준비되어 있지 않네요.',
    desc: '자금·지원사업·인증 어느 쪽으로 가더라도, 회사를 설명하는 기본 문서는 가장 먼저 쓰입니다.',
    revealCta: '정리하면 무엇이 달라질까요?',
    beforeLabel: '사업계획서 없음·노후',
    afterLabel: '사업계획서 정비 시',
    benefits: [
      '정부지원사업 심사자가 이해하기 쉬운 구조가 마련됩니다.',
      '자금 사용계획과 성장전략이 정리됩니다.',
      '홈페이지·MVP·인증과 하나의 스토리로 연결할 수 있습니다.',
    ],
    feedbackLabel: '지원사업 준비도 +11',
    feedbackArea: 'govSupport',
    feedbackPoints: 11,
    continueCta: '우리 회사도 가능성을 점검해볼게요',
    interestKey: 'bizPlan',
    claimType: 'qualitative',
  },
]

/** 특정 질문에 답한 직후 노출할 혜택 카드 (조건 미충족 시 null) */
export function getBenefitAfter(questionId: string, answers: DiagnosisAnswers): BenefitCard | null {
  return benefitCards.find((b) => b.afterQuestionId === questionId && b.triggerIf(answers)) ?? null
}
