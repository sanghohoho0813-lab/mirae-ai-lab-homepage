// 정책자금 평가·우대 참고요소 데이터 (2026-07-09 제공 체크리스트 참고).
// ⚠️ 특정 시점·특정 제도의 평가 참고항목입니다. 모든 정책자금에 동일 적용된다고 표현하지 마세요.
// ⚠️ 승인율/한도/가점 확정 표현 금지 — 전부 claimType: 'qualitative'.
//    실제 제도·공고 검증 후에만 개별 항목을 'verified'로 바꿀 수 있습니다.
import type { AdvantageResultItem, AdvantageStatus, DiagnosisAnswers, PolicyAdvantageFactor } from '../types/businessDiagnosis'

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])

const SOURCE = { sourceLabel: '2026-07-09 제공 체크리스트 참고', sourceDate: '2026-07-09' }
const VERIFY_NOTE = '실제 인정 여부와 평가기준은 신청 사업의 공고와 심사기준을 별도로 확인해야 합니다.'

export const ADVANTAGE_GROUP_LABELS: Record<string, string> = {
  technology: '기술·연구개발 기반',
  management: '경영혁신 기반',
  credibility: '거래·대외신인도 기반',
  expert: '업종별 전문 인증 (전문가 연결 검토)',
}

export const EXPERT_REFERRAL_NOTE = '전문 인증기관 또는 해당 분야 전문가 연결을 검토할 수 있습니다.'

export const ADVANTAGE_DISCLAIMER =
  '우대요소는 신청하는 정책자금과 세부사업에 따라 실제 반영 여부가 달라질 수 있습니다.'

// 업종별 전문 인증(D그룹) 공통 노출 조건 — 조건이 맞을 때만 노출
function expertContext(a: DiagnosisAnswers): boolean {
  const industry = one(a, 'industry')
  const plans = many(a, 'futurePlans')
  const isTech = industry === 'manufacture' || industry === 'it'
  const hasNewProduct = ['launched3y', 'developing', 'planned'].includes(one(a, 'newProduct') ?? '') || plans.includes('newProduct')
  const wantsBig = plans.some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
  return isTech || hasNewProduct || wantsBig
}

export const policyAdvantageFactors: PolicyAdvantageFactor[] = [
  // ── A. 기술·연구개발 기반 ─────────────────────────
  {
    id: 'registered-ip-3y',
    label: '최근 3년 이내 등록 지식재산권',
    group: 'technology',
    description: '일부 정책자금 평가에서 기술개발 역량을 설명하는 참고요소로 활용될 수 있습니다.',
    questionIds: ['ipRights'],
    ownedCondition: (a) => ['patent', 'utility'].includes(one(a, 'ipRights') ?? ''),
    preparingCondition: (a) => one(a, 'ipRights') === 'filed', // 출원 ≠ 등록
    verifyCondition: (a) => one(a, 'ipRights') === 'unsure',
    missingCondition: (a) => one(a, 'ipRights') === 'none',
    benefits: [
      '기술성과 차별성을 설명할 근거가 보강됩니다.',
      '기술개발 실적을 객관적인 자료로 제시할 수 있습니다.',
      '일부 정책자금과 정부지원사업에서 평가 참고요소로 활용될 수 있습니다.',
    ],
    relevantProductSlugs: ['venture-innovation'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 80,
    expertReferralOnly: false,
  },
  {
    id: 'research-org',
    label: '기업부설연구소·연구개발전담부서',
    group: 'technology',
    description: '연구개발 조직을 정식으로 갖추면 연구 역량을 설명하는 자료로 활용될 수 있습니다.',
    questionIds: ['researchLab'],
    ownedCondition: (a) => ['lab', 'dept'].includes(one(a, 'researchLab') ?? ''),
    preparingCondition: (a) => one(a, 'researchLab') === 'preparing',
    verifyCondition: (a) => one(a, 'researchLab') === 'unsure',
    missingCondition: (a) => one(a, 'researchLab') === 'none',
    benefits: [
      '연구개발 활동을 체계적으로 정리할 수 있습니다.',
      '연구개발 관련 세제지원을 검토할 기반이 생깁니다.',
      '일부 정책자금·정부지원사업에서 연구개발 역량 설명자료로 활용될 수 있습니다.',
    ],
    relevantProductSlugs: ['rnd-center'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: '인정서 유효상태와 사후관리 요건은 별도로 확인해야 합니다.',
    priority: 85,
    expertReferralOnly: false,
  },
  {
    id: 'venture-cert',
    label: '벤처기업확인',
    group: 'technology',
    description: '기술성과 성장성을 설명하는 대표적인 참고요소입니다.',
    questionIds: ['venture'],
    ownedCondition: (a) => one(a, 'venture') === 'have',
    preparingCondition: (a) => one(a, 'venture') === 'preparing',
    verifyCondition: (a) => ['expired', 'unsure'].includes(one(a, 'venture') ?? ''),
    missingCondition: (a) => one(a, 'venture') === 'none',
    benefits: [
      '기술성과 성장성을 설명할 근거가 보강됩니다.',
      '일부 정책자금·정부지원사업에서 우대요소로 활용될 수 있습니다.',
      '기업의 대외신인도를 설명할 자료가 추가됩니다.',
    ],
    relevantProductSlugs: ['venture-innovation', 'venture-investment'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 90,
    expertReferralOnly: false,
  },
  {
    id: 'innobiz-cert',
    label: '이노비즈 (기술혁신형)',
    group: 'technology',
    description: '기술혁신 역량을 정리해 보여주는 인증으로, 일부 평가에서 참고요소로 활용될 수 있습니다.',
    questionIds: ['innobiz'],
    ownedCondition: (a) => one(a, 'innobiz') === 'have',
    preparingCondition: (a) => one(a, 'innobiz') === 'preparing',
    verifyCondition: (a) => ['expired', 'unsure'].includes(one(a, 'innobiz') ?? ''),
    missingCondition: (a) => one(a, 'innobiz') === 'none',
    benefits: [
      '기술혁신 역량을 객관적인 인증으로 정리할 수 있습니다.',
      '일부 정책자금·정부지원사업에서 평가 참고요소로 활용될 수 있습니다.',
      '거래처에 기술 기반 기업임을 설명하기 쉬워집니다.',
    ],
    relevantProductSlugs: ['innobiz-certification'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 70,
    expertReferralOnly: false,
  },
  {
    id: 'rnd-ratio-5',
    label: '매출 대비 연구개발비 5% 이상',
    group: 'technology',
    description: '연구개발 투자 수준을 보여주는 참고 지표입니다. 정확한 비중은 재무자료로 확인해야 합니다.',
    questionIds: ['rndRatio'],
    ownedCondition: (a) => one(a, 'rndRatio') === 'ge5',
    verifyCondition: (a) => ['unsure', 'notManaged'].includes(one(a, 'rndRatio') ?? ''), // 모름 = 불리 아님, 자료 확인
    missingCondition: (a) => one(a, 'rndRatio') === 'lt5',
    benefits: [
      '연구개발 투자 수준을 수치로 설명할 수 있습니다.',
      '연구개발비 계정을 정리하면 관련 검토가 쉬워집니다.',
      '일부 평가에서 기술개발 의지를 설명하는 참고자료가 됩니다.',
    ],
    relevantProductSlugs: ['rnd-center'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: '실제 비중은 최근 결산 재무제표로 확인해야 합니다.',
    priority: 55,
    expertReferralOnly: false,
  },
  {
    id: 'new-product-3y',
    label: '최근 3년 내 신제품·신서비스 실적',
    group: 'technology',
    description: '출시·양산 실적은 사업화 역량을 설명하는 참고요소로 활용될 수 있습니다.',
    questionIds: ['newProduct'],
    ownedCondition: (a) => one(a, 'newProduct') === 'launched3y',
    preparingCondition: (a) => one(a, 'newProduct') === 'developing',
    missingCondition: (a) => ['planned', 'none'].includes(one(a, 'newProduct') ?? ''),
    benefits: [
      '기술을 실제 제품·서비스로 만든 실적을 보여줄 수 있습니다.',
      '사업화 역량을 설명하는 자료로 활용될 수 있습니다.',
      '신제품 중심의 성장 스토리를 정리하기 쉬워집니다.',
    ],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: '출시·양산 시점을 증빙자료로 확인해야 합니다.',
    priority: 50,
    expertReferralOnly: false,
  },

  // ── B. 경영혁신 기반 ─────────────────────────────
  {
    id: 'mainbiz-cert',
    label: '메인비즈 (경영혁신형)',
    group: 'management',
    description: '경영혁신 활동을 정리해 보여주는 인증입니다.',
    questionIds: ['mainbiz'],
    ownedCondition: (a) => one(a, 'mainbiz') === 'have',
    preparingCondition: (a) => one(a, 'mainbiz') === 'preparing',
    verifyCondition: (a) => ['expired', 'unsure'].includes(one(a, 'mainbiz') ?? ''),
    missingCondition: (a) => one(a, 'mainbiz') === 'none',
    benefits: [
      '경영혁신 활동을 객관적인 인증으로 정리할 수 있습니다.',
      '일부 정책자금·정부지원사업에서 평가 참고요소로 활용될 수 있습니다.',
      '기업의 대외신인도를 설명할 자료가 추가됩니다.',
    ],
    relevantProductSlugs: ['mainbiz-certification'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 65,
    expertReferralOnly: false,
  },
  {
    id: 'operating-profit',
    label: '최근 결산 영업이익',
    group: 'management',
    description: '수익성은 상환능력을 설명하는 기본 지표입니다. 업종 평균 대비 우수 여부는 재무자료로 확인해야 합니다.',
    questionIds: ['operatingProfit'],
    ownedCondition: (a) => one(a, 'operatingProfit') === 'profit',
    verifyCondition: (a) => ['notClosed', 'unsure', 'breakeven'].includes(one(a, 'operatingProfit') ?? ''),
    missingCondition: (a) => one(a, 'operatingProfit') === 'loss',
    benefits: [
      '상환능력을 설명하는 기본 근거가 됩니다.',
      '수익 구조를 정리하면 자금 계획 설득력이 높아집니다.',
      '업종 평균 대비 수익성은 재무제표와 업종 평균자료를 함께 확인해 활용할 수 있습니다.',
    ],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: '업종 평균 대비 수익성 우수 여부는 재무제표와 업종 평균자료를 함께 확인해야 합니다.',
    priority: 45,
    expertReferralOnly: false,
  },

  // ── C. 거래·대외신인도 기반 ───────────────────────
  {
    id: 'iso-cert',
    label: 'ISO 인증 (품질·환경·안전보건)',
    group: 'credibility',
    description: '관리체계를 자료로 보여주는 인증으로, 거래처 요구·입찰 대응에 활용될 수 있습니다.',
    questionIds: ['iso'],
    ownedCondition: (a) => many(a, 'iso').some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v)),
    preparingCondition: (a) => many(a, 'iso').includes('preparing'),
    verifyCondition: (a) => many(a, 'iso').includes('unsure'),
    missingCondition: (a) => many(a, 'iso').includes('none'),
    benefits: [
      '거래처의 관리체계 요구에 대응할 기반이 생깁니다.',
      '입찰·대외신뢰도 평가자료로 활용될 수 있습니다.',
      '품질·환경·안전관리 체계를 설명할 수 있게 됩니다.',
    ],
    relevantProductSlugs: ['iso-certification'],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: '인증 유효기간과 갱신 심사 일정을 확인해야 합니다.',
    priority: 75,
    expertReferralOnly: false,
  },

  // ── D. 업종별 전문 인증 (전문가 연결 검토 전용) ───
  {
    id: 'net-nep',
    label: 'NET·NEP (신기술·신제품 인증)',
    group: 'expert',
    description: '신기술·신제품을 보유한 기업이 검토할 수 있는 전문 인증입니다.',
    questionIds: ['newProduct', 'futurePlans'],
    ownedCondition: () => false,
    missingCondition: (a) =>
      expertContext(a) && (['launched3y', 'developing'].includes(one(a, 'newProduct') ?? '') || many(a, 'futurePlans').includes('newProduct')),
    benefits: [EXPERT_REFERRAL_NOTE],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 30,
    expertReferralOnly: true,
    showIf: expertContext,
  },
  {
    id: 'green-tech',
    label: '녹색기술 관련 인증',
    group: 'expert',
    description: '친환경·에너지 관련 기술을 보유한 기업이 검토할 수 있는 인증입니다.',
    questionIds: ['industry', 'futurePlans'],
    ownedCondition: () => false,
    missingCondition: (a) => expertContext(a) && one(a, 'industry') === 'manufacture',
    benefits: [EXPERT_REFERRAL_NOTE],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 25,
    expertReferralOnly: true,
    showIf: (a) => expertContext(a) && one(a, 'industry') === 'manufacture',
  },
  {
    id: 'smart-factory',
    label: '스마트공장 관련 사업',
    group: 'expert',
    description: '제조 현장의 디지털화를 준비하는 기업이 검토할 수 있는 사업입니다.',
    questionIds: ['industry', 'workflow'],
    ownedCondition: () => false,
    missingCondition: (a) => one(a, 'industry') === 'manufacture',
    benefits: [EXPERT_REFERRAL_NOTE],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 28,
    expertReferralOnly: true,
    showIf: (a) => one(a, 'industry') === 'manufacture',
  },
  {
    id: 'ip-management',
    label: '지식재산경영인증',
    group: 'expert',
    description: '지식재산을 경영에 활용하는 기업이 검토할 수 있는 인증입니다.',
    questionIds: ['ipRights'],
    ownedCondition: () => false,
    missingCondition: (a) => expertContext(a) && ['patent', 'utility', 'filed'].includes(one(a, 'ipRights') ?? ''),
    benefits: [EXPERT_REFERRAL_NOTE],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 22,
    expertReferralOnly: true,
    showIf: (a) => expertContext(a) && ['patent', 'utility', 'filed'].includes(one(a, 'ipRights') ?? ''),
  },
  {
    id: 'family-friendly',
    label: '가족친화인증·고용 우수기업 인증',
    group: 'expert',
    description: '고용·근로환경이 우수한 기업이 검토할 수 있는 인증입니다.',
    questionIds: ['employees', 'hiring'],
    ownedCondition: () => false,
    missingCondition: (a) => ['e10to29', 'e30plus'].includes(one(a, 'employees') ?? ''),
    benefits: [EXPERT_REFERRAL_NOTE],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 18,
    expertReferralOnly: true,
    showIf: (a) => ['e10to29', 'e30plus'].includes(one(a, 'employees') ?? ''),
  },
  {
    id: 'social-enterprise',
    label: '사회적기업 등 사회적경제기업 인증',
    group: 'expert',
    description: '사회적 가치를 추구하는 사업 모델이 검토할 수 있는 인증입니다.',
    questionIds: ['industry'],
    ownedCondition: () => false,
    missingCondition: () => false, // 명시적 관련 답변이 없으면 노출하지 않음
    benefits: [EXPERT_REFERRAL_NOTE],
    relevantProductSlugs: [],
    claimType: 'qualitative',
    ...SOURCE,
    verificationNote: VERIFY_NOTE,
    priority: 15,
    expertReferralOnly: true,
    showIf: () => false, // 관련 질문이 없어 1차에서는 기본 비노출 (데이터만 준비)
  },
]

/** 답변 기준 우대요소 상태 계산 */
export function computeAdvantageItems(answers: DiagnosisAnswers): AdvantageResultItem[] {
  const items: AdvantageResultItem[] = []
  for (const f of policyAdvantageFactors) {
    if (f.expertReferralOnly) {
      if (!f.showIf?.(answers) || !f.missingCondition(answers)) continue
      items.push({ id: f.id, label: f.label, group: f.group, status: '검토 추천', description: f.description, expertReferralOnly: true })
      continue
    }
    let status: AdvantageStatus | null = null
    if (f.ownedCondition(answers)) status = '보유'
    else if (f.preparingCondition?.(answers)) status = '준비 중'
    else if (f.verifyCondition?.(answers)) status = '자료 확인 필요'
    else if (f.missingCondition(answers)) status = '검토 추천'
    if (!status) continue // 질문 생략 등 — 표시하지 않음 (불이익 없음)
    items.push({ id: f.id, label: f.label, group: f.group, status, description: f.description, expertReferralOnly: false })
  }
  return items.sort((a, b) => {
    const fa = policyAdvantageFactors.find((f) => f.id === a.id)?.priority ?? 0
    const fb = policyAdvantageFactors.find((f) => f.id === b.id)?.priority ?? 0
    return fb - fa
  })
}

// '우대요소 발견' 인터스티셜을 띄우는 핵심 요소 (재무·실적 지표는 결과에서만 표시해 흐름 유지)
const CELEBRATED_FACTORS = ['registered-ip-3y', 'research-org', 'venture-cert', 'innobiz-cert', 'mainbiz-cert', 'iso-cert']

/** 보유 판정된 요소 id 목록 (답변 중 '우대요소 발견' 모션용) */
export function ownedAdvantageIdsFor(questionId: string, answers: DiagnosisAnswers): string[] {
  return policyAdvantageFactors
    .filter(
      (f) =>
        !f.expertReferralOnly &&
        CELEBRATED_FACTORS.includes(f.id) &&
        f.questionIds.includes(questionId) &&
        f.ownedCondition(answers),
    )
    .map((f) => f.id)
}

export function factorById(id: string): PolicyAdvantageFactor | undefined {
  return policyAdvantageFactors.find((f) => f.id === id)
}
