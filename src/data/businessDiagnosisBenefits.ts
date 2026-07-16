// 퀘스트형 기업 성장진단 — 인라인 "혜택 발견 패널" 데이터.
// ⚠️ 표현 규칙: 승인율/한도/확률 등 근거 없는 수치 금지. 정성 표현이 기본.
//    수치·세제 혜택은 verifiedBenefits + 조건 + 공식 출처(benefitSources)를 함께 표시(conditional_verified).
//    문구는 중학생도 바로 이해할 수 있는 쉬운 말로 작성.
import type { BenefitCard, DiagnosisAnswers } from '../types/businessDiagnosis'
import { benefitSources } from './benefitSources'

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])
const isYoungCorp = (a: DiagnosisAnswers) => one(a, 'bizType') === 'corp' && ['lt1', 'y1to3'].includes(one(a, 'years') ?? '')

export const benefitCards: BenefitCard[] = [
  {
    id: 'venture',
    afterQuestionId: 'venture',
    triggerIf: (a) => ['none', 'expired', 'unsure'].includes(one(a, 'venture') ?? ''),
    title: '벤처기업확인은 아직 없으시네요.',
    currentRisk: '회사의 기술성과 성장 가능성을 공식적으로 설명할 자료가 부족할 수 있어요.',
    simpleDescription: '좋은 기술이나 서비스가 있어도 공식 확인이 없으면 심사자나 거래처가 그 가치를 바로 알아보기 어려울 수 있습니다.',
    desc: '회사의 기술이나 성장 가능성을 잘 정리하면, 심사자가 우리 회사를 이해하기 쉬워져요.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: '벤처기업확인 없음',
    afterLabel: '벤처기업확인 준비 시',
    benefits: [
      '기술과 성장 가능성을 공식 자료로 설명할 수 있어요.',
      '일부 정책자금·정부지원사업에서 우대 또는 평가 참고요소로 활용될 수 있어요.',
      '거래처·투자자에게 기술기업이라는 점을 설명하기 쉬워져요.',
    ],
    moreBenefits: [
      '기업부설연구소 설립요건 등 일부 제도에서 완화된 기준을 검토할 수 있어요.',
      '투자·보증·기술사업화 제도와 연결할 수 있는 범위가 넓어질 수 있어요.',
    ],
    verifiedBenefits: [
      {
        text: '창업 후 3년 이내 벤처기업으로 확인받는 등 창업벤처중소기업 요건을 충족하면, 해당 사업에서 발생한 소득에 대한 소득세·법인세 50% 감면을 최대 5개 과세연도 동안 검토할 수 있습니다.',
        claimType: 'conditional_verified',
        badge: '조건 충족 시 법인세·소득세 50% 감면 검토',
        conditions: [
          '벤처기업확인만 받으면 자동 적용되는 혜택이 아닙니다.',
          '창업 후 3년 이내 벤처확인 등 요건을 충족해야 합니다.',
          '법에서 정한 대상 업종·창업 인정 여부에 해당해야 합니다.',
          '중복감면 여부, 감면기간과 최초 소득 발생 시점을 확인해야 합니다.',
          '실제 적용은 세무전문가 확인이 필요합니다.',
        ],
        source: benefitSources.ventureTaxReduction,
      },
    ],
    disclaimer: '모든 벤처기업에 자동 적용되는 것은 아닙니다.',
    feedbackLabel: '기업인증 준비도 +8',
    feedbackArea: 'certification',
    feedbackPoints: 8,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'venture',
    relatedProductSlugs: ['venture-innovation'],
    claimType: 'conditional_verified',
  },
  {
    id: 'researchLab',
    afterQuestionId: 'researchLab',
    triggerIf: (a) => ['none', 'unsure'].includes(one(a, 'researchLab') ?? ''),
    title: '연구개발 활동을 공식적으로 보여줄 조직이 아직 없어요.',
    currentRisk: '실제로 개발을 하고 있어도, 연구조직과 연구기록이 없으면 그 활동을 공식 자료로 설명하기 어려워요.',
    simpleDescription: '연구개발을 조금이라도 하고 있다면, 그걸 정식 조직으로 만드는 것만으로 활용할 곳이 늘어나요.',
    desc: '연구개발 활동이 조금이라도 있다면, 이를 정식 조직으로 정리하는 것만으로 활용 범위가 넓어질 수 있습니다.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: '연구조직 없음',
    afterLabel: '연구조직 마련 시',
    benefits: [
      '연구개발 업무를 일반 업무와 구분해 관리할 수 있어요.',
      '연구개발비와 연구인력 현황을 체계적으로 정리할 수 있어요.',
      '정책자금·정부지원사업에서 기술개발 활동을 설명할 자료가 생겨요.',
    ],
    moreBenefits: [
      '벤처기업확인이나 이노비즈 등 다른 인증 준비와 연결하기 쉬워져요.',
      '연구노트와 과제관리 체계를 갖추는 출발점이 될 수 있어요.',
    ],
    verifiedBenefits: [
      {
        text: '요건을 충족하면 적격 연구·인력개발비 세액공제, 연구·시험용 시설 투자 세액공제, 기업부설연구소용 부동산 지방세 감면, 연구원 연구활동비 비과세 등을 검토할 수 있습니다.',
        claimType: 'conditional_verified',
        badge: '조건 충족 시 R&D 세제지원 검토',
        conditions: [
          '연구소를 설립했다는 이유만으로 세금이 자동 감면되지 않습니다.',
          '실제 연구개발 활동·적격 비용·인력·공간·증빙자료 요건을 충족해야 합니다.',
          '적용 여부는 세무전문가 확인이 필요합니다.',
        ],
        source: benefitSources.rndTaxCredit,
      },
    ],
    disclaimer: '연구소 설립만으로 세금이 자동 감면되는 것은 아닙니다.',
    feedbackLabel: '연구개발 기반 +10',
    feedbackArea: 'certification',
    feedbackPoints: 10,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'researchLab',
    relatedProductSlugs: ['rnd-center'],
    claimType: 'conditional_verified',
  },
  {
    id: 'mainbiz',
    afterQuestionId: 'mainbiz',
    triggerIf: (a) => ['none', 'expired', 'unsure'].includes(one(a, 'mainbiz') ?? ''),
    title: '회사의 경영혁신 역량을 보여줄 인증이 부족해요.',
    currentRisk: '기술 중심 인증이 맞지 않는 업종은, 경영방식·운영성과를 보여줄 공식 자료가 부족할 수 있어요.',
    simpleDescription: '메인비즈는 기술만이 아니라 회사의 경영방식, 운영성과, 혁신활동을 평가하는 인증입니다.',
    desc: '기술 인증이 맞지 않는 업종도, 경영혁신 역량을 공식적으로 보여줄 수 있어요.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: '메인비즈 없음',
    afterLabel: '메인비즈 취득 시',
    benefits: [
      '경영혁신형 기업이라는 점을 공식적으로 보여줄 수 있어요.',
      '일부 자금·보증·지원사업에서 우대 또는 평가자료로 활용될 수 있어요.',
      '거래처나 금융기관에 회사를 설명할 자료가 추가돼요.',
    ],
    moreBenefits: [
      '회사의 경영체계와 성과를 점검하는 기회가 돼요.',
      '기술기업 인증이 맞지 않는 업종도 검토할 수 있어요.',
    ],
    disclaimer: '모든 정책자금에서 동일한 가점이 주어지는 것은 아니며, 사업별 공고와 평가표를 확인해야 합니다.',
    feedbackLabel: '경영혁신 기반 +8',
    feedbackArea: 'credibility',
    feedbackPoints: 8,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'mainbiz',
    relatedProductSlugs: ['mainbiz-certification'],
    claimType: 'qualitative',
  },
  {
    id: 'innobiz',
    afterQuestionId: 'innobiz',
    triggerIf: (a) => {
      if (!['none', 'expired', 'unsure'].includes(one(a, 'innobiz') ?? '')) return false
      // 기술개발 실적이 거의 없는 일반 기업엔 노출하지 않음
      const industry = one(a, 'industry')
      const techBase =
        industry === 'manufacture' ||
        industry === 'it' ||
        ['lab', 'dept'].includes(one(a, 'researchLab') ?? '') ||
        ['launched3y', 'developing'].includes(one(a, 'newProduct') ?? '') ||
        one(a, 'rndRatio') === 'ge5'
      return techBase
    },
    title: '기술혁신기업이라는 점을 보여줄 공식 인증이 부족해요.',
    currentRisk: '기술개발을 꾸준히 하는데도, 그 역량을 공식 인증으로 보여줄 자료가 없을 수 있어요.',
    simpleDescription: '기술개발을 꾸준히 하는 회사라면 이노비즈로 기술과 성장 가능성을 공식적으로 보여줄 수 있습니다.',
    desc: '기술혁신 역량을 공식 인증으로 정리할 수 있어요.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: '이노비즈 없음',
    afterLabel: '이노비즈 취득 시',
    benefits: [
      '기술혁신 역량을 공식적으로 설명할 수 있어요.',
      '기술보증·금융·정부지원사업의 우대제도를 검토할 수 있어요.',
      '기술개발과 제품화 실적을 체계적으로 정리할 수 있어요.',
    ],
    moreBenefits: [
      '대기업 거래나 공공사업에서 회사의 기술력을 설명하기 쉬워져요.',
      '정책자금 신청 시 제출할 기술 관련 근거가 늘어날 수 있어요.',
    ],
    verifiedBenefits: [
      {
        text: '이노비즈 인증기업은 공식 안내에 따라 금융·기술보증·정부지원사업 등에서 우대제도를 검토할 수 있습니다. 구체적 우대 내용과 적용기관은 최신 공식 자료를 확인해야 합니다.',
        claimType: 'conditional_verified',
        badge: '공식 우대지원 안내 확인',
        conditions: ['우대 내용·적용기관·유효성은 공식 안내에서 최신 확인이 필요합니다.', '사업별 공고와 평가표를 확인해야 합니다.'],
        source: benefitSources.innobiz,
      },
    ],
    disclaimer: '기술개발 실적이 거의 없는 일반 기업에는 적합하지 않을 수 있습니다.',
    feedbackLabel: '기술혁신 기반 +8',
    feedbackArea: 'certification',
    feedbackPoints: 8,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'innobiz',
    relatedProductSlugs: ['innobiz-certification'],
    claimType: 'conditional_verified',
  },
  {
    id: 'website',
    afterQuestionId: 'website',
    triggerIf: (a) => ['none', 'snsOnly', 'old'].includes(one(a, 'website') ?? ''),
    title: '회사를 검색했을 때 보여줄 첫인상이 부족해요.',
    currentRisk: '홈페이지가 없거나 오래되면 실제 사업보다 회사가 작거나 준비되지 않은 것처럼 보일 수 있어요.',
    simpleDescription: '심사자, 거래처, 고객은 상담 전에 회사를 검색해봅니다. 홈페이지는 회사의 온라인 명함 역할을 해요.',
    desc: '고객뿐 아니라 지원사업 심사자와 거래처도 회사를 검색해봅니다.',
    revealCta: '정비하면 달라지는 점 보기',
    beforeLabel: '홈페이지 없음·오래됨',
    afterLabel: '홈페이지 정비 시',
    benefits: [
      '회사와 서비스를 한눈에 설명할 수 있어요.',
      '정책자금·지원사업 신청서에 적은 내용을 실제 화면으로 보여줄 수 있어요.',
      '명함·광고·제안서를 본 사람이 다시 찾아올 공간이 생겨요.',
    ],
    moreBenefits: [
      '기술과 제품, 시제품(MVP), 인증, 진행사례를 한곳에 모을 수 있어요.',
      '모바일에서도 회사 정보를 쉽게 확인할 수 있어요.',
    ],
    feedbackLabel: '온라인 신뢰도 +12',
    feedbackArea: 'digital',
    feedbackPoints: 12,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'website',
    relatedProductSlugs: ['responsive-homepage'],
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
    title: '입찰과 거래처 요구에 대응할 인증이 부족할 수 있어요.',
    currentRisk: 'ISO가 모든 거래에 필수는 아니지만, 거래처나 입찰 조건에서 요구되면 뒤늦게 준비하기 어려울 수 있어요.',
    simpleDescription: 'ISO는 회사가 품질·환경·안전을 일정한 기준으로 관리한다는 점을 보여주는 자료예요.',
    desc: '거래처와 심사기관은 품질·환경·안전관리 체계를 자료로 확인하고 싶어합니다.',
    revealCta: '준비하면 달라지는 점 보기',
    beforeLabel: 'ISO 없음',
    afterLabel: 'ISO 취득 시',
    benefits: [
      '품질·환경·안전을 일정한 기준으로 관리한다는 점을 보여줄 수 있어요.',
      '일부 공공입찰·거래처 평가에서 요구서류 또는 평가자료로 활용될 수 있어요.',
      '대기업 납품·해외거래 시 관리체계를 설명하기 쉬워져요.',
    ],
    moreBenefits: [
      '회사 내부의 업무 절차와 책임을 정리하는 기회가 돼요.',
      '거래처가 요구하는 인증 조건에 미리 대응할 수 있어요.',
    ],
    disclaimer: '모든 입찰에서 가점이 부여되는 것은 아니며, 실제 공고와 거래처 요구조건을 확인해야 합니다.',
    feedbackLabel: '대외 신뢰도 +9',
    feedbackArea: 'credibility',
    feedbackPoints: 9,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'iso',
    relatedProductSlugs: ['iso-certification'],
    claimType: 'qualitative',
  },
  {
    id: 'bizPlan',
    afterQuestionId: 'bizPlan',
    triggerIf: (a) => ['none', 'simple'].includes(one(a, 'bizPlan') ?? ''),
    title: '회사를 설명할 기본 문서가 아직 없으시네요.',
    currentRisk: '좋은 사업이어도 설명이 정리되지 않으면 심사자가 장점을 알아보기 어려워요.',
    simpleDescription: '사업계획서는 자금·지원사업·인증 어느 쪽으로 가더라도 가장 먼저 쓰이는 기본 문서예요.',
    desc: '자금·지원사업·인증 어느 쪽으로 가더라도, 회사를 설명하는 기본 문서는 가장 먼저 쓰입니다.',
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
    relatedProductSlugs: ['funding-consulting'],
    claimType: 'qualitative',
  },
  {
    id: 'workflow',
    afterQuestionId: 'workflow',
    triggerIf: (a) => ['excel', 'kakao', 'paper', 'scattered'].includes(one(a, 'workflow') ?? ''),
    title: '대표님과 직원이 반복업무에 시간을 쓰고 있을 가능성이 높아요.',
    currentRisk: '자료가 엑셀·카톡·개인 PC에 나뉘어 있으면 직원이 늘수록 찾고 확인하는 시간이 계속 늘어나요.',
    simpleDescription: '업무 자료가 여러 곳에 흩어져 있으면, 담당자가 바뀔 때 자료가 사라질 위험도 있어요.',
    desc: '반복업무 1가지만 자동화해도 시간과 누락이 눈에 띄게 줄어드는 경우가 많습니다.',
    revealCta: '정리하면 달라지는 점 보기',
    beforeLabel: '수기·엑셀·메신저 관리',
    afterLabel: '업무 시스템 정리 시',
    benefits: [
      '고객과 업무 진행상황을 한곳에서 볼 수 있어요.',
      '반복 입력과 문서작성을 줄일 수 있어요.',
      '대표가 PC와 휴대전화에서 현황을 바로 확인할 수 있어요.',
    ],
    moreBenefits: [
      '직원별 업무 누락을 확인하기 쉬워져요.',
      '데이터를 쌓아 매출·상담·업무현황을 비교할 수 있어요.',
      '사람이 해야 할 일과 AI가 도울 일을 나눌 수 있어요.',
    ],
    verifiedBenefits: [
      {
        text: '정부·지자체에서도 제조 AI, 스마트공장, 디지털 전환 관련 지원사업을 운영합니다. 다만 업종·지역·공고별 지원대상과 범위가 다릅니다.',
        claimType: 'conditional_verified',
        badge: '스마트공장·디지털전환 지원사업 확인',
        conditions: ['업종·지역·공고별로 지원대상과 범위가 다릅니다.', 'AX 도입이 모든 정책자금에서 자동 우대되는 것은 아닙니다.'],
        source: benefitSources.smartFactory,
      },
    ],
    disclaimer: 'AX 도입이 인건비 절감이나 정책자금 한도 증가를 보장하지 않습니다.',
    feedbackLabel: '운영 효율 준비도 +10',
    feedbackArea: 'digital',
    feedbackPoints: 10,
    continueCta: '내 추천 목록에 담기',
    interestKey: 'workflow',
    relatedProductSlugs: ['ai-ax-system'],
    claimType: 'conditional_verified',
  },
]

/** 특정 질문에 답한 직후 노출할 혜택 카드 (조건 미충족 시 null) */
export function getBenefitAfter(questionId: string, answers: DiagnosisAnswers): BenefitCard | null {
  return benefitCards.find((b) => b.afterQuestionId === questionId && b.triggerIf(answers)) ?? null
}

export { isYoungCorp }
