// 퀘스트형 기업 성장진단 — 인라인 "혜택 발견 패널" 데이터.
// ⚠️ 표현 규칙: 승인율/한도/확률 등 근거 없는 수치 금지. 전부 정성(qualitative) 표현.
//    문구는 중학생도 바로 이해할 수 있는 쉬운 말로 작성합니다. (제도 용어는 쉬운 설명을 함께)
import type { BenefitCard, DiagnosisAnswers } from '../types/businessDiagnosis'

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])

export const benefitCards: BenefitCard[] = [
  {
    id: 'venture',
    afterQuestionId: 'venture',
    triggerIf: (a) => ['none', 'expired', 'unsure'].includes(one(a, 'venture') ?? ''),
    title: '벤처기업확인은 아직 없으시네요.',
    desc: '회사의 기술이나 성장 가능성을 잘 정리하면, 심사자가 우리 회사를 이해하기 쉬워져요.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: '벤처기업확인 없음',
    afterLabel: '벤처기업확인 준비 시',
    benefits: [
      '정책자금이나 지원사업 신청서에 보여줄 회사의 강점이 늘어날 수 있어요.',
      '기술을 가진 기업이라는 점을 공식 자료로 설명할 수 있어요.',
      '거래처나 투자자에게 회사를 소개할 때 쓸 근거가 생겨요.',
    ],
    feedbackLabel: '기업인증 준비도 +8',
    feedbackArea: 'certification',
    feedbackPoints: 8,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'venture',
    claimType: 'qualitative',
  },
  {
    id: 'researchLab',
    afterQuestionId: 'researchLab',
    triggerIf: (a) => ['none', 'unsure'].includes(one(a, 'researchLab') ?? ''),
    title: '연구개발을 담당하는 조직이 아직 없으시네요.',
    desc: '연구개발을 조금이라도 하고 있다면, 그걸 정식 조직으로 만드는 것만으로 활용할 곳이 늘어나요.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: '연구조직 없음',
    afterLabel: '연구조직 마련 시',
    benefits: [
      '연구개발을 하고 있다는 것을 서류로 깔끔하게 보여줄 수 있어요.',
      '연구개발과 관련된 세금 혜택을 알아볼 바탕이 생겨요.',
      '정부지원사업·정책자금에서 기술 역량을 설명할 자료로 쓸 수 있어요.',
    ],
    feedbackLabel: '연구개발 기반 +10',
    feedbackArea: 'certification',
    feedbackPoints: 10,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'researchLab',
    claimType: 'qualitative',
  },
  {
    id: 'website',
    afterQuestionId: 'website',
    triggerIf: (a) => ['none', 'snsOnly', 'old'].includes(one(a, 'website') ?? ''),
    title: '회사를 검색했을 때 보여줄 대표 화면이 부족해요.',
    desc: '심사자와 거래처도 회사를 검색해볼 수 있어요. 홈페이지는 회사의 온라인 명함 역할을 해요.',
    revealCta: '정비하면 달라지는 점 보기',
    beforeLabel: '홈페이지 없음·오래됨',
    afterLabel: '홈페이지 정비 시',
    benefits: [
      '회사와 서비스를 한눈에 보여줄 수 있어요.',
      '명함·광고·제안서를 보고 들어온 사람을 받을 공간이 생겨요.',
      '기술이나 시제품(MVP)을 실제 화면으로 보여줄 수 있어요.',
    ],
    feedbackLabel: '온라인 신뢰도 +12',
    feedbackArea: 'digital',
    feedbackPoints: 12,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'website',
    claimType: 'qualitative',
  },
  {
    id: 'workflow',
    afterQuestionId: 'workflow',
    triggerIf: (a) => ['excel', 'kakao', 'paper', 'scattered'].includes(one(a, 'workflow') ?? ''),
    title: '업무 자료가 여러 곳에 흩어져 있을 가능성이 높아요.',
    desc: '직원이 늘수록 엑셀, 카톡, 종이에 나뉜 자료를 찾는 시간이 길어져요.',
    revealCta: '정리하면 달라지는 점 보기',
    beforeLabel: '수기·엑셀·메신저 관리',
    afterLabel: '업무 시스템 정리 시',
    benefits: [
      '고객과 업무 진행상황을 한곳에서 확인할 수 있어요.',
      '반복 입력과 빠뜨리는 실수를 줄일 수 있어요.',
      'PC와 휴대전화에서 같은 자료를 볼 수 있어요.',
    ],
    feedbackLabel: '운영 효율 준비도 +10',
    feedbackArea: 'digital',
    feedbackPoints: 10,
    continueCta: '내 추천 목록에 담기',
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
    title: '입찰이나 대기업 거래에 쓸 인증이 아직 부족해요.',
    desc: 'ISO는 회사가 품질·환경·안전을 일정한 기준으로 관리한다는 점을 보여주는 자료예요.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: 'ISO 없음',
    afterLabel: 'ISO 취득 시',
    benefits: [
      '거래처가 요구하는 인증 조건에 대응할 수 있어요.',
      '일부 입찰이나 지원사업에서 평가자료로 쓸 수 있어요.',
      '회사의 관리체계를 설명하기 쉬워져요.',
    ],
    feedbackLabel: '대외신인도 +9',
    feedbackArea: 'credibility',
    feedbackPoints: 9,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'iso',
    claimType: 'qualitative',
  },
  {
    id: 'bizPlan',
    afterQuestionId: 'bizPlan',
    triggerIf: (a) => ['none', 'simple'].includes(one(a, 'bizPlan') ?? ''),
    title: '회사를 설명할 기본 문서가 아직 없으시네요.',
    desc: '좋은 사업이어도 설명이 정리되지 않으면 심사자가 장점을 알아보기 어려워요.',
    revealCta: '정리하면 달라지는 점 보기',
    beforeLabel: '사업계획서 없음·간단',
    afterLabel: '사업계획서 정비 시',
    benefits: [
      '무슨 사업을 하는지 한눈에 설명할 수 있어요.',
      '돈이 왜 필요하고 어디에 쓸지 분명하게 보여줄 수 있어요.',
      '정책자금·지원사업·인증 준비를 하나의 이야기로 연결할 수 있어요.',
    ],
    feedbackLabel: '지원사업 준비도 +11',
    feedbackArea: 'govSupport',
    feedbackPoints: 11,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'bizPlan',
    claimType: 'qualitative',
  },
]

/** 특정 질문에 답한 직후 노출할 혜택 카드 (조건 미충족 시 null) */
export function getBenefitAfter(questionId: string, answers: DiagnosisAnswers): BenefitCard | null {
  return benefitCards.find((b) => b.afterQuestionId === questionId && b.triggerIf(answers)) ?? null
}
