// 퀘스트형 기업 성장진단 — 점수·추천 엔진.
// ⚠️ 여기서 계산되는 점수는 실제 승인확률·선정확률이 아니라
//    이 진단 서비스 내부의 '준비도 점수'(0~100)입니다. 결과 화면에 그 성격을 명시합니다.
// 질문 분기로 답하지 않은 항목은 델타를 더하지 않아 불이익이 없습니다.
import type {
  AreaResult,
  DiagnosisAnswers,
  DiagnosisResultData,
  DiagnosisStage,
  ProductRecommendation,
  ScoreArea,
  StageReportData,
} from '../types/businessDiagnosis'
import { hasArrears, isFounderToBe, isIndividual, isCorp } from '../data/businessDiagnosisQuestions'
import { computeAdvantageItems } from '../data/policyAdvantageFactors'
import { ruleFor } from '../data/businessDiagnosisProductRules'

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

// 받침 유무에 따라 '와/과' 조사 선택
function withWa(word: string): string {
  const code = word.charCodeAt(word.length - 1)
  if (code < 0xac00 || code > 0xd7a3) return `${word}와`
  return (code - 0xac00) % 28 === 0 ? `${word}와` : `${word}과`
}

export const AREA_LABELS: Record<ScoreArea, string> = {
  funding: '정책자금 준비도',
  employment: '고용지원금 활용 가능성',
  govSupport: '정부지원사업 준비도',
  certification: '기업인증·연구개발 기반',
  credibility: '대외 신뢰도·입찰 경쟁력',
  digital: '홈페이지·AX 운영체계',
}

// 질문별 가중치 — 영역마다 {questionId, 답변값 → 델타}. 데이터로 관리해 조정이 쉽습니다.
type Rule = { q: string; map: Record<string, number>; reason?: (v: string) => string | null }
const AREA_RULES: Record<ScoreArea, { base: number; rules: Rule[] }> = {
  funding: {
    base: 40,
    rules: [
      { q: 'taxArrears', map: { no: 18, paying: -8, yes: -30, unsure: -4 } },
      { q: 'bizPlan', map: { recent: 14, old: 5, simple: 2, none: -6 } },
      { q: 'years', map: { pre: -8, lt1: 0, y1to3: 6, y3to7: 10, y7plus: 10 } },
      { q: 'revenue', map: { none: -6, lt1: 0, r1to5: 6, r5to10: 9, r10to30: 10, r30plus: 10 } },
      { q: 'govExperience', map: { won: 8, applied: 4, prepared: 2, never: 0 } },
      { q: 'venture', map: { have: 6, preparing: 2, expired: 0, none: 0, unsure: 0 } },
      { q: 'operatingProfit', map: { profit: 8, breakeven: 2, loss: -8, notClosed: 0, unsure: 0 } },
    ],
  },
  employment: {
    base: 40,
    rules: [
      { q: 'hiring', map: { recent: 24, plan6m: 22, parental: 20, retention: 14, na: -10 } },
      { q: 'employees', map: { none: -8, e1to4: 8, e5to9: 10, e10to29: 12, e30plus: 12 } },
      { q: 'taxArrears', map: { no: 6, paying: -4, yes: -12, unsure: 0 } },
    ],
  },
  govSupport: {
    base: 40,
    rules: [
      { q: 'bizPlan', map: { recent: 18, old: 6, simple: 3, none: -8 } },
      { q: 'govExperience', map: { won: 16, applied: 8, prepared: 4, never: 0 } },
      { q: 'website', map: { good: 6, old: 2, snsOnly: 0, none: -4 } },
      { q: 'venture', map: { have: 6, preparing: 2, expired: 0, none: 0, unsure: 0 } },
      { q: 'researchLab', map: { lab: 6, dept: 4, preparing: 2, none: 0, unsure: 0 } },
    ],
  },
  certification: {
    base: 38,
    rules: [
      { q: 'venture', map: { have: 16, preparing: 7, expired: 3, none: 0, unsure: 0 } },
      { q: 'researchLab', map: { lab: 13, dept: 10, preparing: 5, none: 0, unsure: 0 } },
      { q: 'ipRights', map: { patent: 10, utility: 8, filed: 3, none: 0, unsure: 0 } },
      { q: 'innobiz', map: { have: 7, preparing: 3, expired: 1, none: 0, unsure: 0 } },
      { q: 'mainbiz', map: { have: 7, preparing: 3, expired: 1, none: 0, unsure: 0 } },
      { q: 'iso', map: { iso9001: 4, iso14001: 3, iso45001: 3, isoEtc: 2, preparing: 1, none: 0, unsure: 0 } },
      { q: 'rndRatio', map: { ge5: 5, lt5: 0, notManaged: 0, unsure: 0 } },
      { q: 'newProduct', map: { launched3y: 5, developing: 2, planned: 0, none: 0, na: 0 } },
      { q: 'years', map: { pre: -6, lt1: 0, y1to3: 2, y3to7: 4, y7plus: 4 } },
    ],
  },
  credibility: {
    base: 40,
    rules: [
      { q: 'iso', map: { iso9001: 8, iso14001: 6, iso45001: 6, isoEtc: 4, preparing: 2, none: 0, unsure: 0 } },
      { q: 'mainbiz', map: { have: 6, preparing: 2, expired: 1, none: 0, unsure: 0 } },
      { q: 'innobiz', map: { have: 6, preparing: 2, expired: 1, none: 0, unsure: 0 } },
      { q: 'website', map: { good: 10, old: 3, snsOnly: 0, none: -6 } },
      { q: 'venture', map: { have: 8, preparing: 3, expired: 2, none: 0, unsure: 0 } },
      { q: 'revenue', map: { none: -4, lt1: 0, r1to5: 3, r5to10: 5, r10to30: 7, r30plus: 8 } },
    ],
  },
  digital: {
    base: 36,
    rules: [
      { q: 'website', map: { good: 26, old: 8, snsOnly: 2, none: -6 } },
      { q: 'workflow', map: { system: 26, excel: 6, kakao: 2, paper: -4, scattered: 0 } },
    ],
  },
}

function scoreArea(area: ScoreArea, answers: DiagnosisAnswers, interestBonus: number): number {
  const { base, rules } = AREA_RULES[area]
  let s = base + interestBonus
  for (const r of rules) {
    const v = answers[r.q]
    if (v === undefined) continue // 분기로 생략된 질문 — 불이익 없음
    if (Array.isArray(v)) {
      for (const item of v) s += r.map[item] ?? 0
    } else {
      s += r.map[v] ?? 0
    }
  }
  return clamp(s)
}

// 5구간 통일(촘촘): 91+ 파랑 / 81~90 초록 / 65~80 노랑 / 50~64 주황 / 50 미만 빨강
const statusOf = (score: number): AreaResult['status'] =>
  score < 50 ? '먼저 준비 필요' : score < 65 ? '기본 준비 부족' : score < 81 ? '보완하면 활용 가능' : score < 91 ? '활용 준비 양호' : '자료·증빙까지 우수'

function toneOf(score: number, priority: AreaResult['priority']): AreaResult['tone'] {
  if (priority === '먼저 해결할 선결과제') return 'red'
  if (score >= 91) return 'blue'
  if (score >= 81) return 'green'
  if (score >= 65) return 'amber'
  if (score >= 50) return 'orange'
  return 'red'
}

/** 지표 카드 색상 — 영역 카드와 동일한 5구간 */
const metricTone = (score: number) => (score >= 91 ? 'blue' : score >= 81 ? 'emerald' : score >= 65 ? 'amber' : score >= 50 ? 'orange' : 'red')

// 각 영역의 '자료 확인 필요'(불확실) 답변 존재 여부 → 85점 이상 남발 방지
const AREA_UNSURE_QS: Record<ScoreArea, string[]> = {
  funding: ['taxArrears', 'operatingProfit', 'financials'],
  employment: ['hiring'],
  govSupport: ['bizPlan', 'govExperience', 'companyIntro'],
  certification: ['venture', 'researchLab', 'ipRights', 'innobiz', 'rndRatio', 'newProduct'],
  credibility: ['iso', 'mainbiz', 'venture'],
  digital: ['website', 'workflow'],
}
const UNSURE_VALUES = ['unsure', 'unknown', 'notClosed', 'notManaged', 'expired']
function areaHasUnsure(area: ScoreArea, a: DiagnosisAnswers): boolean {
  return AREA_UNSURE_QS[area].some((q) => {
    const v = a[q]
    if (Array.isArray(v)) return v.some((x) => UNSURE_VALUES.includes(x))
    return typeof v === 'string' && UNSURE_VALUES.includes(v)
  })
}

/** 혜택 카드 관심 클릭 → 해당 영역 소폭 가산 (진단 내부 지표) */
const INTEREST_AREA: Record<string, ScoreArea> = {
  venture: 'certification',
  researchLab: 'certification',
  website: 'digital',
  workflow: 'digital',
  iso: 'credibility',
  bizPlan: 'govSupport',
}

export function computeResult(answers: DiagnosisAnswers, interests: string[]): DiagnosisResultData {
  const arrears = hasArrears(answers)
  const founder = isFounderToBe(answers)
  const individual = isIndividual(answers)
  const corp = isCorp(answers)
  const concerns = many(answers, 'concerns')
  const plans = many(answers, 'futurePlans')
  const hasIso = many(answers, 'iso').some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v))
  const fundingWhen = one(answers, 'fundingWhen')
  const hiring = one(answers, 'hiring')
  const employees = one(answers, 'employees')
  const website = one(answers, 'website')
  const workflow = one(answers, 'workflow')
  const venture = one(answers, 'venture')
  const lab = one(answers, 'researchLab')
  const bizPlan = one(answers, 'bizPlan')
  const years = one(answers, 'years')

  const interestBonus = (area: ScoreArea) =>
    interests.filter((k) => INTEREST_AREA[k] === area).length * 3

  const wantsBig = plans.some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
  const weakSite = ['none', 'snsOnly', 'old'].includes(website ?? '')
  const weakOps = ['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '')

  // 영역별 문제·행동·연결상품 (문제 중심 카드)
  function enrich(area: ScoreArea): { statusSentence: string; missText: string; smallAction: string; linkedProductSlug?: string } {
    if (area === 'funding') {
      return {
        statusSentence: arrears
          ? '자금보다 먼저 체납 정리를 확인해야 해요.'
          : (byAreaScore.funding ?? 0) < 55
            ? '돈이 필요한 이유는 있지만, 심사자에게 보여줄 자료가 아직 부족해요.'
            : '자금을 검토할 기본 자료가 어느 정도 준비되어 있어요.',
        missText: '인증이 없어도 신청은 할 수 있지만, 매출·재무·업종 경쟁력만으로 회사를 설명해야 해서 부담이 커질 수 있어요.',
        smallAction: arrears
          ? '체납·분납 상태와 신청 가능 시점을 먼저 확인하세요.'
          : bizPlan !== 'recent'
            ? '사업계획과 자금 사용목적부터 정리하세요.'
            : '정책자금 가능성 진단을 받아보세요.',
        linkedProductSlug: 'funding-consulting',
      }
    }
    if (area === 'employment') {
      const active = hiring && hiring !== 'na'
      return {
        statusSentence: active ? '채용·고용 상황이 있어 지원금을 확인해볼 수 있어요.' : '지금은 채용 이슈가 없어 해당 사항이 적어요.',
        missText: '지원대상이었더라도 신청시기를 지나면 활용하기 어려운 제도가 있을 수 있어요.',
        smallAction: active ? '채용 시기와 대상 요건을 확인해보세요.' : '채용 계획이 생기면 그때 다시 확인하세요.',
        linkedProductSlug: active ? 'employment-subsidy' : undefined,
      }
    }
    if (area === 'govSupport') {
      return {
        statusSentence:
          (byAreaScore.govSupport ?? 0) < 55 ? '좋은 사업이라도 설명자료가 부족하면 심사자가 장점을 알아보기 어려워요.' : '지원사업에 대응할 기본 자료가 준비되어 있어요.',
        missText: '준비 없이 급하게 신청하면 회사의 강점을 제대로 보여주기 어려울 수 있어요.',
        smallAction: bizPlan !== 'recent' ? '회사를 설명할 사업계획서부터 정리하세요.' : '관심 지원사업 공고를 미리 확인하세요.',
        linkedProductSlug: 'funding-consulting',
      }
    }
    if (area === 'certification') {
      const weakCert = ['none', 'expired', 'unsure'].includes(venture ?? '') && ['none', 'unsure'].includes(lab ?? '')
      return {
        statusSentence: weakCert ? '공식적으로 보여줄 기술·연구개발 증빙이 부족해요.' : '기술·인증 기반이 어느 정도 갖춰져 있어요.',
        missText: '인증이 없어도 정책자금을 신청할 수는 있지만, 같은 조건의 기업과 비교할 때 기술성이나 성장성을 증명할 공식 자료가 적을 수 있어요.',
        smallAction:
          corp && (years === 'lt1' || years === 'y1to3') && ['none', 'expired', 'unsure'].includes(venture ?? '')
            ? '창업 3년 미만 법인이라면 벤처기업확인 가능성부터 먼저 살펴보세요.'
            : ['none', 'unsure'].includes(lab ?? '')
              ? '연구개발 활동이 있으면 연구조직부터 검토하세요.'
              : '보유한 인증의 유효기간을 점검하세요.',
        linkedProductSlug:
          founder || individual
            ? undefined
            : corp && (years === 'lt1' || years === 'y1to3') && ['none', 'expired', 'unsure'].includes(venture ?? '')
              ? 'venture-innovation'
              : ['none', 'unsure'].includes(lab ?? '') && (industryIsTech || plans.includes('newProduct'))
                ? 'rnd-center'
                : ['y3to7', 'y7plus'].includes(years ?? '')
                  ? 'innobiz-certification'
                  : 'venture-innovation',
      }
    }
    if (area === 'credibility') {
      return {
        statusSentence: wantsBig && !hasIso ? '입찰·거래처 요구에 대응할 인증이 부족할 수 있어요.' : '대외 신뢰도 자료가 어느 정도 준비되어 있어요.',
        missText: '입찰이나 대기업 거래를 시작한 뒤 인증을 준비하면 일정이 촉박할 수 있어요.',
        smallAction: wantsBig && !hasIso ? '계획에 맞는 ISO 규격부터 확인하세요.' : '거래처 요구조건을 미리 확인하세요.',
        linkedProductSlug: wantsBig && !hasIso ? 'iso-certification' : ['y3to7', 'y7plus'].includes(years ?? '') && one(answers, 'mainbiz') !== 'have' ? 'mainbiz-certification' : undefined,
      }
    }
    // digital
    return {
      statusSentence: weakSite && weakOps ? '온라인 첫인상과 내부 운영 모두 정비가 필요해요.' : weakSite ? '회사를 검색했을 때 보여줄 대표 화면이 부족해요.' : weakOps ? '업무자료가 여러 곳에 흩어져 있을 가능성이 높아요.' : '홈페이지와 업무 운영이 잘 갖춰져 있어요.',
      missText: '직원이 늘어난 뒤 업무시스템을 정리하면 이미 흩어진 자료를 다시 모으는 데 더 많은 시간이 들 수 있어요.',
      smallAction: weakSite ? '회사를 보여줄 홈페이지부터 정비하세요.' : weakOps ? '반복업무 1가지부터 자동화를 검토하세요.' : '현재 상태를 유지하며 데이터 활용을 넓혀보세요.',
      linkedProductSlug: weakSite ? 'responsive-homepage' : weakOps ? 'ai-ax-system' : undefined,
    }
  }

  const industryIsTech = ['manufacture', 'it'].includes(one(answers, 'industry') ?? '')
  // 1차 점수 (enrich 의 statusSentence 문턱 판단용)
  const byAreaScore = Object.fromEntries((Object.keys(AREA_LABELS) as ScoreArea[]).map((k) => [k, scoreArea(k, answers, interestBonus(k))])) as Record<ScoreArea, number>

  // ── 6개 영역 점수 ──
  const areas: AreaResult[] = (Object.keys(AREA_LABELS) as ScoreArea[]).map((area) => {
    let score = byAreaScore[area]
    // 보수적 상한 — 불확실 답변이 있으면 85점 이상 남발하지 않음
    if (score >= 85 && areaHasUnsure(area, answers)) score = 84
    const status = statusOf(score)

    // 우선순위 + 한 줄 설명 + 근거
    let priority: AreaResult['priority'] = '있으면 유리'
    let note = ''
    const reasons: string[] = []

    if (area === 'funding') {
      if (arrears) {
        priority = '먼저 해결할 선결과제'
        note = '체납 정리가 먼저입니다. 정리 후 자금 검토를 권해드려요.'
        reasons.push('국세·지방세 체납이 있다고 답하셨어요. 대부분의 정책자금은 체납 정리가 선행되어야 합니다.')
      } else if (fundingWhen === 'm1' || fundingWhen === 'm3') {
        priority = '지금 필요'
        note = '자금 시점이 가까워 가능성 진단부터 서두르는 것이 좋습니다.'
        reasons.push(`자금 필요 시점이 ${fundingWhen === 'm1' ? '1개월' : '3개월'} 이내라고 답하셨어요.`)
      } else if (fundingWhen === 'none') {
        priority = '현재 우선순위 낮음'
        note = '지금은 자금 수요가 없어 준비 상태만 유지하면 됩니다.'
        reasons.push('자금 필요 없음으로 답하셨어요.')
      } else {
        note = '계획 단계일 때 준비해두면 필요할 때 빠르게 움직일 수 있습니다.'
        if (fundingWhen) reasons.push('자금은 아직 계획 단계라고 답하셨어요.')
      }
      if (bizPlan === 'recent') reasons.push('최신 사업계획서를 보유하고 있어 신청 준비에 유리해요.')
      if (bizPlan === 'none') reasons.push('사업계획서가 없어 신청 전 정리가 필요해요.')
    }

    if (area === 'employment') {
      if (hiring === 'na') {
        priority = '현재 우선순위 낮음'
        note = '채용·고용 이슈가 없어 지금은 해당 사항이 적습니다.'
        reasons.push(
          employees === 'none' || !employees
            ? '직원이 없고 채용 계획도 없다고 답하셨어요. 부족이 아니라 해당 없음으로 처리했어요.'
            : '현재 채용·고용유지 관련 이슈가 없다고 답하셨어요.',
        )
      } else if (hiring && hiring !== 'na') {
        priority = '지금 필요'
        note = '채용·고용유지 상황이 있어 지원금 검토 여지가 있습니다.'
        reasons.push('최근 채용 또는 채용·고용유지 계획이 있다고 답하셨어요.')
      } else {
        note = '채용 계획이 생기면 그때 다시 살펴보면 됩니다.'
      }
    }

    if (area === 'govSupport') {
      if (plans.includes('govSupport') || concerns.includes('govSupport')) {
        priority = score < 55 ? '지금 필요' : '있으면 유리'
        reasons.push('정부지원사업에 관심이 있다고 답하셨어요.')
      }
      note =
        bizPlan === 'recent'
          ? '기본 서류가 준비되어 있어 기회가 올 때 빠르게 대응할 수 있습니다.'
          : '회사를 설명할 기본 문서부터 정리하면 준비도가 빠르게 올라갑니다.'
      if (one(answers, 'govExperience') === 'won') reasons.push('선정 경험이 있어 신청 프로세스에 익숙하세요.')
      if (one(answers, 'govExperience') === 'never') reasons.push('아직 신청 경험이 없어 첫 준비가 필요해요.')
    }

    if (area === 'certification') {
      if (founder) {
        priority = '현재 우선순위 낮음'
        note = '창업 후 검토할 수 있는 영역이에요. 지금은 사업계획에 집중하세요.'
        reasons.push('예비창업자라 기업 인증은 창업 이후 단계에서 검토하면 됩니다.')
      } else if (individual) {
        note = '일부 인증은 법인 전환 후 검토할 수 있는 영역입니다.'
        reasons.push('개인사업자는 일부 인증을 법인 전환 후 검토할 수 있어요.')
        priority = score < 45 ? '있으면 유리' : '있으면 유리'
      } else if (corp && (years === 'lt1' || years === 'y1to3') && ['none', 'expired', 'unsure'].includes(venture ?? '')) {
        priority = '지금 필요'
        note = '창업 3년 미만 법인이라 벤처확인부터 검토할 만합니다.'
        reasons.push('창업 3년 미만 법인이고 벤처기업확인이 없다고 답하셨어요.')
      } else {
        note = venture === 'have' ? '보유 인증을 유지·활용하는 단계입니다.' : '인증은 자금·지원사업의 근거자료가 되어줍니다.'
      }
      if (lab === 'none' && plans.includes('newProduct'))
        reasons.push('신규 제품·서비스 개발 계획이 있는데 연구조직이 없어요.')
    }

    if (area === 'credibility') {
      const wantsBig = plans.some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
      if (wantsBig && !hasIso) {
        priority = '지금 필요'
        note = '대기업·입찰·수출 계획 대비 관리체계 자료 보완이 필요합니다.'
        reasons.push('대기업 납품·입찰·수출 계획이 있지만 ISO 인증이 없다고 답하셨어요.')
      } else if (wantsBig) {
        note = '계획에 맞춰 보유 자료를 최신으로 유지하세요.'
        reasons.push('대기업·입찰·수출 계획이 있고 관련 인증을 일부 보유하고 있어요.')
      } else {
        priority = '있으면 유리'
        note = '당장 급하지 않지만 거래처 요구가 생기기 전에 준비해두면 좋습니다.'
      }
    }

    if (area === 'digital') {
      const weakSite = ['none', 'snsOnly', 'old'].includes(website ?? '')
      const weakOps = ['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '')
      if (weakSite && weakOps) {
        priority = '지금 필요'
        note = '온라인 첫인상과 내부 운영 모두 정비가 필요한 상태입니다.'
      } else if (weakSite) {
        priority = '지금 필요'
        note = '회사를 보여줄 온라인 화면부터 정비하면 좋습니다.'
      } else if (weakOps) {
        priority = '있으면 유리'
        note = '반복업무 1가지부터 자동화를 검토할 만합니다.'
      } else {
        priority = '현재 우선순위 낮음'
        note = '홈페이지와 운영체계가 이미 잘 갖춰져 있어요.'
      }
      if (weakSite) reasons.push(`홈페이지가 ${website === 'old' ? '오래되었' : '없'}다고 답하셨어요.`)
      else if (website === 'good') reasons.push('모바일까지 잘 작동하는 홈페이지를 보유하고 있어요.')
      if (weakOps) reasons.push('업무가 엑셀·메신저·수기 중심으로 관리되고 있어요.')
      else if (workflow === 'system') reasons.push('전용 시스템으로 업무를 통합관리하고 있어요.')
    }

    if (reasons.length === 0) reasons.push('답변 내용을 종합해 산출한 내부 준비도 지표입니다.')
    const e = enrich(area)
    return {
      area,
      label: AREA_LABELS[area],
      score,
      status,
      priority,
      note,
      reasons,
      statusSentence: e.statusSentence,
      missText: e.missText,
      smallAction: e.smallAction,
      linkedProductSlug: e.linkedProductSlug,
      tone: toneOf(score, priority),
    }
  })

  const byArea = Object.fromEntries(areas.map((a) => [a.area, a])) as Record<ScoreArea, AreaResult>

  // ── 강점 / 보완 / 선결과제 ──
  const strengths: string[] = []
  if (one(answers, 'taxArrears') === 'no') strengths.push('세금 체납이 없어 자금·지원제도 검토의 기본기가 탄탄해요.')
  if (bizPlan === 'recent') strengths.push('최신 사업계획서를 보유해 어떤 신청이든 빠르게 시작할 수 있어요.')
  if (one(answers, 'govExperience') === 'won') strengths.push('정부지원사업 선정 경험이 있어 심사 대응에 익숙해요.')
  if (venture === 'have') strengths.push('벤처기업확인을 보유해 기술성·성장성 근거가 이미 있어요.')
  if (['lab', 'dept'].includes(one(answers, 'researchLab') ?? '')) strengths.push('연구개발 조직을 보유해 연구 역량을 설명할 수 있어요.')
  if (website === 'good') strengths.push('모바일 대응 홈페이지가 있어 온라인 첫인상이 준비되어 있어요.')
  if (workflow === 'system') strengths.push('업무를 전용 시스템으로 통합관리하고 있어 운영 기반이 좋아요.')
  if (hasIso) strengths.push('ISO 인증을 보유해 관리체계를 자료로 설명할 수 있어요.')
  if (['patent', 'utility'].includes(one(answers, 'ipRights') ?? '')) strengths.push('최근 3년 내 등록 지식재산권이 있어 기술력을 자료로 보여줄 수 있어요.')
  if (strengths.length === 0) strengths.push('진단을 끝까지 완료하신 것 자체가 성장 준비의 시작이에요.')

  const improvements: string[] = []
  const sortedWeak = [...areas].filter((a) => a.priority !== '현재 우선순위 낮음').sort((x, y) => x.score - y.score)
  for (const a of sortedWeak.slice(0, 3)) {
    if (a.score < 70) improvements.push(`${a.label} — ${a.note}`)
  }
  if (improvements.length === 0) improvements.push('큰 공백 없이 고르게 준비돼 있어요. 지금 상태를 잘 유지하시는 것이 가장 좋습니다.')

  const prerequisites: string[] = []
  if (arrears) prerequisites.push('국세·지방세 체납 정리 — 대부분의 정책자금·지원사업 검토 전에 먼저 확인해야 합니다.')
  if (one(answers, 'taxArrears') === 'paying') prerequisites.push('체납 분납·정리 진행 상황 점검 — 완료 시점에 맞춰 자금 일정을 잡는 것이 안전합니다.')

  // ── 종합 메시지 ──
  const top2 = sortedWeak.slice(0, 2).map((a) => a.label.replace(/ (준비도|활용 가능성|운영체계)$/, ''))
  const summary = arrears
    ? '자금을 알아보기 전에 밀린 세금·보험료부터 정리하는 것이 먼저입니다. 정리하고 나면 이후 준비가 훨씬 수월해집니다.'
    : top2.length >= 2
      ? `현재는 ${withWa(top2[0])} ${top2[1]} 보완이 가장 먼저 필요합니다.`
      : '전반적으로 고르게 준비되어 있습니다. 계획에 맞춰 활용 단계로 넘어가세요.'

  // ── 실행 순서 ──
  const actionPlan: string[] = []
  if (arrears) actionPlan.push('체납 정리 계획 수립 (분납·정리 일정 확인)')
  if (bizPlan !== 'recent') actionPlan.push('사업계획과 자금 사용목적 정리')
  if (fundingWhen && fundingWhen !== 'none' && !arrears) actionPlan.push('정책자금 가능성 진단')
  if (['none', 'snsOnly', 'old'].includes(website ?? '')) actionPlan.push('홈페이지 또는 MVP 정비')
  if (!founder && ['none', 'expired', 'unsure'].includes(venture ?? '')) actionPlan.push('기업인증(벤처확인 등) 검토')
  if (['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '')) actionPlan.push('반복업무 1가지 자동화 검토')
  if (actionPlan.length === 0) actionPlan.push('현재 준비 상태 유지 및 계획별 활용 검토')

  // ── 상품 추천 (최대 3개, 반드시 이유 포함) ──
  const recommendations = recommend(answers, { arrears, founder, individual, corp, areas: byArea })

  // ── 정책자금·지원사업 활용 기반 (우대 참고요소) ──
  const advantages = computeAdvantageItems(answers)
  const ownedAdvantageCount = advantages.filter((x) => x.status === '보유').length

  // 게이트 전 티저 — 최우선 과제 1개 + 종합 준비도(해당 없음 제외 평균, 내부 지표)
  const topTask = actionPlan[0] ?? '현재 준비 상태 유지'
  const applicable = areas.filter((x) => x.priority !== '현재 우선순위 낮음')
  const overallScore = Math.round(
    (applicable.length ? applicable : areas).reduce((sum, x) => sum + x.score, 0) / (applicable.length ? applicable.length : areas.length),
  )

  // ── 진단 확신도 (잘 모르겠음 응답 수) ──
  let unknownCount = 0
  for (const [, v] of Object.entries(answers)) {
    if (Array.isArray(v)) {
      if (v.some((x) => UNSURE_VALUES.includes(x))) unknownCount++
    } else if (typeof v === 'string' && UNSURE_VALUES.includes(v)) unknownCount++
  }
  const confidence = {
    level: unknownCount >= 5 ? ('낮음' as const) : unknownCount >= 3 ? ('보통' as const) : ('높음' as const),
    unknownCount,
    note: unknownCount > 0 ? `확인이 필요한 답변이 ${unknownCount}개 있어요.` : '답변이 명확해 결과 신뢰도가 높아요.',
  }

  // ── 지금 먼저 확인할 3가지 (문제·행동 중심) ──
  const prio = [...areas].filter((a) => a.priority !== '현재 우선순위 낮음').sort((x, y) => x.score - y.score)
  const topPriorities = [
    ...(arrears
      ? [{ rank: 1, problem: '세금 체납 정리', why: '대부분의 정책자금은 체납 정리가 먼저 확인돼요.', ifIgnored: '정리 전에는 신청 자체가 어려울 수 있어요.', action: '체납·분납 상태와 신청 가능 시점을 확인하세요.', linkedProductSlug: 'funding-consulting', tone: 'red' as const }]
      : []),
    ...prio.slice(0, arrears ? 2 : 3).map((a, i) => ({
      rank: (arrears ? 2 : 1) + i,
      problem: a.smallAction,
      why: a.statusSentence,
      ifIgnored: a.missText,
      action: a.smallAction,
      linkedProductSlug: a.linkedProductSlug,
      tone: (i === 0 && !arrears ? 'orange' : 'amber') as 'orange' | 'amber',
    })),
  ].slice(0, 3)

  // ── 지금 놓치고 있을 수 있는 혜택 (판매 상품 연계, ≤4) ──
  const missedBenefits = buildMissedBenefits(answers, { founder, individual, corp, arrears, wantsBig, hasIso, weakSite, weakOps })

  // ── 기간별 로드맵 ──
  const roadmap = {
    now30: [
      ...(arrears ? ['체납·분납 상태 확인 및 정리 계획'] : []),
      ...(bizPlan !== 'recent' ? ['사업계획과 자금 사용목적 정리'] : []),
      ...(fundingWhen && fundingWhen !== 'none' && !arrears ? ['정책자금 가능성 진단·상담'] : []),
    ],
    m1to3: [
      ...(weakSite ? ['홈페이지 또는 대표 화면 정비'] : []),
      ...(!founder && ['none', 'expired', 'unsure'].includes(venture ?? '') && (years === 'lt1' || years === 'y1to3') ? ['벤처기업확인 가능성 검토'] : []),
      ...(weakOps ? ['반복업무 1가지 자동화 검토'] : []),
    ],
    m3to12: [
      ...(!founder && !individual && ['y3to7', 'y7plus'].includes(years ?? '') ? ['이노비즈·메인비즈 등 인증 고도화 검토'] : []),
      ...(wantsBig && !hasIso ? ['ISO 등 거래·입찰 인증 준비'] : []),
      '보유 인증 사후관리 및 추가 자금조달 계획',
    ],
  }
  if (roadmap.now30.length === 0) roadmap.now30.push('현재 상태 점검 및 상담으로 우선순위 확정')

  const headline = summary

  return {
    summary,
    headline,
    areas,
    strengths,
    improvements,
    prerequisites,
    actionPlan,
    recommendations,
    advantages,
    ownedAdvantageCount,
    topTask,
    overallScore,
    confidence,
    topPriorities,
    missedBenefits,
    roadmap,
  }
}

// 놓치고 있을 수 있는 혜택 (판매 상품 관련 부족항목 중심)
function buildMissedBenefits(
  a: DiagnosisAnswers,
  ctx: { founder: boolean; individual: boolean; corp: boolean; arrears: boolean; wantsBig: boolean; hasIso: boolean; weakSite: boolean; weakOps: boolean },
): DiagnosisResultData['missedBenefits'] {
  const out: DiagnosisResultData['missedBenefits'] = []
  const v = one(a, 'venture')
  const lab = one(a, 'researchLab')
  const years = one(a, 'years')
  if (!ctx.founder && ['none', 'expired', 'unsure'].includes(v ?? '')) {
    const young = ctx.corp && ['lt1', 'y1to3'].includes(years ?? '')
    out.push({
      title: '창업벤처중소기업 세액감면 검토 가능성',
      status: young ? '조건 확인 필요' : '현재는 대상 가능성 낮음',
      note: young
        ? '창업 후 3년 이내 벤처확인 등 요건을 충족하면 소득세·법인세 50% 감면을 검토할 수 있어요. 자동 적용은 아닙니다.'
        : '창업 3년 이상이라 이 세제혜택보다 기술성·대외 신뢰도 중심으로 검토하는 편이 맞아요.',
      linkedProductSlug: 'venture-innovation',
    })
  }
  if (!ctx.founder && ['none', 'unsure'].includes(lab ?? '') && (['manufacture', 'it'].includes(one(a, 'industry') ?? '') || many(a, 'futurePlans').includes('newProduct'))) {
    out.push({ title: '연구개발비 세액공제 검토 기반', status: '자료 확인 필요', note: '연구조직과 적격 비용·증빙을 갖추면 R&D 세제지원을 검토할 수 있어요. 설립만으로 자동 감면되지 않아요.', linkedProductSlug: 'rnd-center' })
  }
  if (one(a, 'hiring') && one(a, 'hiring') !== 'na') {
    out.push({ title: '고용지원금 활용 가능성', status: '조건 확인 필요', note: '채용 전후 시기와 근로자·회사 요건을 확인해야 활용 여부를 알 수 있어요.', linkedProductSlug: 'employment-subsidy' })
  }
  if (ctx.wantsBig && !ctx.hasIso) {
    out.push({ title: 'ISO·이노비즈 등 거래·입찰 준비', status: '현재 검토 가능', note: '대기업 거래·입찰 계획에 맞춰 관리체계·기술 인증을 준비할 수 있어요.', linkedProductSlug: 'iso-certification' })
  }
  if (ctx.weakSite && out.length < 4) {
    out.push({ title: '홈페이지 온라인 신뢰도', status: '현재 검토 가능', note: '회사를 검색했을 때 보여줄 대표 화면을 마련하면 첫인상이 달라져요.', linkedProductSlug: 'responsive-homepage' })
  }
  if (ctx.weakOps && out.length < 4) {
    out.push({ title: 'AX로 반복업무 축소', status: '현재 검토 가능', note: '반복 입력·자료 분산을 줄이면 대표님과 직원의 시간을 아낄 수 있어요.', linkedProductSlug: 'ai-ax-system' })
  }
  return out.slice(0, 4)
}

// ─────────────────────────────────────────────────────────────
// 단계별 즉시 리포트 (점진형 진단) — 각 단계 완료 시 그 단계까지의 답변으로 계산.
// ⚠️ 승인확률이 아닌 내부 준비도 지표.
// ─────────────────────────────────────────────────────────────

// 1단계 기초체력 점수 (기본 재무·규모·리스크 종합, 0~100)
function basicVitalityScore(a: DiagnosisAnswers): number {
  let s = 45
  s += ({ pre: -10, lt1: -2, y1to3: 4, y3to7: 10, y7plus: 12 }[one(a, 'years') ?? ''] ?? 0)
  s += ({ none: -6, lt1: 0, r1to5: 6, r5to10: 10, r10to30: 13, r30plus: 15 }[one(a, 'revenue') ?? ''] ?? 0)
  s += ({ none: -2, e1to4: 4, e5to9: 7, e10to29: 9, e30plus: 10 }[one(a, 'employees') ?? ''] ?? 0)
  s += ({ profit: 16, breakeven: 4, loss: -14, notClosed: 0, unsure: 0 }[one(a, 'operatingProfit') ?? ''] ?? 0)
  s += ({ no: 8, paying: -6, yes: -18, unsure: -2 }[one(a, 'taxArrears') ?? ''] ?? 0)
  return clamp(s)
}

function companyStageLabel(a: DiagnosisAnswers): string {
  const years = one(a, 'years')
  const rev = one(a, 'revenue')
  const profit = one(a, 'operatingProfit')
  if (years === 'pre' || years === 'lt1' || rev === 'none') return '성장 초기'
  if (profit === 'loss' || one(a, 'taxArrears') === 'yes') return '전환 필요'
  if (years === 'y7plus' && ['r10to30', 'r30plus'].includes(rev ?? '')) return '안정 운영'
  return '성장 중'
}

export function computeStageResult(depth: DiagnosisStage, answers: DiagnosisAnswers, interests: string[]): StageReportData {
  const full = computeResult(answers, interests)
  const arrears = hasArrears(answers)
  const byArea = Object.fromEntries(full.areas.map((x) => [x.area, x])) as Record<ScoreArea, AreaResult>

  if (depth === 1) {
    const score = basicVitalityScore(answers)
    const stageName = companyStageLabel(answers)

    const strengths: string[] = []
    if (one(answers, 'operatingProfit') === 'profit') strengths.push('최근 결산에서 이익이 나고 있어 자금 계획을 세우기 좋아요.')
    if (one(answers, 'taxArrears') === 'no') strengths.push('세금 체납이 없어 자금·지원제도를 알아보기 좋은 상태예요.')
    if (['y3to7', 'y7plus'].includes(one(answers, 'years') ?? '')) strengths.push('사업을 꾸준히 이어와 업력이 안정적이에요.')
    if (['r5to10', 'r10to30', 'r30plus'].includes(one(answers, 'revenue') ?? '')) strengths.push('매출 규모가 자금·지원사업을 검토하기에 충분한 편이에요.')
    if (strengths.length === 0) strengths.push('진단을 시작하신 것 자체가 성장 준비의 첫걸음이에요.')

    const checks: string[] = []
    if (arrears) checks.push('세금 체납은 자금을 알아보기 전에 먼저 정리하는 것이 좋아요.')
    if (one(answers, 'operatingProfit') === 'loss') checks.push('최근 손실이 있어, 자금 계획에서 이 부분을 함께 봐야 해요.')
    if (['unsure', 'notClosed'].includes(one(answers, 'operatingProfit') ?? '')) checks.push('결산·재무 상태는 자료로 한 번 더 확인하면 좋아요.')
    if (one(answers, 'taxArrears') === 'unsure') checks.push('체납 여부를 정확히 확인해두면 자금 준비가 수월해져요.')
    if (checks.length === 0) checks.push('큰 위험요소는 보이지 않아요. 2단계에서 자금·지원제도를 더 살펴보세요.')

    const topTask = arrears
      ? '세금 체납 정리 (자금 검토 전 먼저 확인)'
      : one(answers, 'operatingProfit') === 'loss'
        ? '수익 구조 점검 후 자금 계획 세우기'
        : full.topTask

    return {
      depth: 1,
      headline: '우리 회사의 기초체력을 확인했어요.',
      summary:
        stageName === '전환 필요'
          ? '지금은 자금보다 먼저 정리할 부분이 있어요. 순서를 잡으면 훨씬 수월해집니다.'
          : '기본 상태를 확인했어요. 받을 수 있는 자금과 지원제도는 2단계에서 더 자세히 살펴볼 수 있어요.',
      metricCards: [
        { label: '현재 회사 단계', value: stageName, tone: 'blue' },
        { label: '기초체력 점수', value: `${score}점`, sub: '내부 진단 지표', tone: metricTone(score) },
      ],
      strengths: strengths.slice(0, 3),
      improvements: checks.slice(0, 3),
      prerequisites: full.prerequisites,
      topTask,
      recommendations: full.recommendations.slice(0, 2),
      nextHint: '2단계에서는 받을 수 있는 자금과 지원제도를 더 자세히 살펴봅니다.',
      overallScore: score,
    }
  }

  if (depth === 2) {
    const focus: ScoreArea[] = ['funding', 'employment', 'govSupport']
    const areas = focus.map((k) => byArea[k])
    const usable = areas.filter((a) => a.score >= 60).map((a) => a.label)
    const improve = areas.filter((a) => a.score < 60).map((a) => a.label)
    return {
      depth: 2,
      headline: '자금과 지원제도 준비상태를 확인했어요.',
      summary: arrears
        ? '체납 정리라는 먼저 할 일이 있어요. 그 뒤에 자금을 준비하면 순서가 깔끔해집니다.'
        : improve.length > 0
          ? `${withWa(improve[0].replace(/ (준비도|활용 가능성)$/, ''))} 관련 준비를 조금 더 하면 활용하기 좋아져요.`
          : '자금·지원제도 활용 준비가 잘 되어 있어요.',
      metricCards: areas.map((a) => ({
        label: a.label,
        value: `${a.score}점`,
        sub: a.status,
        tone: metricTone(a.score),
      })),
      strengths: usable.length ? usable.map((l) => `${l} 영역은 지금 상태로도 활용을 검토해볼 만해요.`) : ['조금씩 준비하면 활용할 수 있는 영역이 있어요.'],
      improvements: improve.length ? improve.map((l) => `${l} 영역은 자료를 보완하면 검토할 수 있는 범위가 넓어져요.`) : ['큰 공백 없이 준비되어 있어요.'],
      prerequisites: full.prerequisites,
      areas,
      recommendations: full.recommendations.slice(0, 2),
      nextHint: '3단계에서는 벤처·연구소·ISO 같은 인증과 홈페이지·업무시스템까지 확인합니다.',
      overallScore: Math.round(areas.reduce((s, a) => s + a.score, 0) / areas.length),
    }
  }

  // depth 3 — 종합
  return {
    depth: 3,
    headline: '종합 성장진단이 완료되었습니다.',
    summary: full.summary,
    metricCards: [
      { label: '종합 준비도', value: `${full.overallScore}점`, sub: '내부 진단 지표', tone: metricTone(full.overallScore) },
      { label: '평가 참고요소 발견', value: `${full.ownedAdvantageCount}개`, sub: '보유 우대요소', tone: 'emerald' },
    ],
    strengths: full.strengths,
    improvements: full.improvements,
    prerequisites: full.prerequisites,
    areas: full.areas,
    advantages: full.advantages,
    ownedAdvantageCount: full.ownedAdvantageCount,
    actionPlan: full.actionPlan,
    recommendations: full.recommendations,
    overallScore: full.overallScore,
    topPriorities: full.topPriorities,
    missedBenefits: full.missedBenefits,
    roadmap: full.roadmap,
    confidence: full.confidence,
  }
}

// ── 실시간 진단 현황 (질문 답변마다 갱신) ──
export function computeLiveStatus(answers: DiagnosisAnswers, interests: string[]): import('../types/businessDiagnosis').LiveStatus {
  const has = (id: string, vals: string[]) => vals.includes(one(answers, id) ?? '')
  const isMulti = (id: string, v: string) => many(answers, id).includes(v)
  let strengthCount = 0
  let gapCount = 0

  // 강점
  if (has('operatingProfit', ['profit'])) strengthCount++
  if (has('taxArrears', ['no'])) strengthCount++
  if (has('venture', ['have'])) strengthCount++
  if (has('researchLab', ['lab', 'dept'])) strengthCount++
  if (has('mainbiz', ['have'])) strengthCount++
  if (has('innobiz', ['have'])) strengthCount++
  if (has('ipRights', ['patent', 'utility'])) strengthCount++
  if (has('website', ['good'])) strengthCount++
  if (has('workflow', ['system'])) strengthCount++
  if (has('bizPlan', ['recent'])) strengthCount++
  if (has('govExperience', ['won'])) strengthCount++
  if (many(answers, 'iso').some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v))) strengthCount++

  // 확인할 부분
  if (has('taxArrears', ['yes', 'paying'])) gapCount++
  if (has('operatingProfit', ['loss'])) gapCount++
  if (has('venture', ['none', 'expired'])) gapCount++
  if (has('researchLab', ['none'])) gapCount++
  if (has('bizPlan', ['none', 'simple'])) gapCount++
  if (has('companyIntro', ['none'])) gapCount++
  if (has('website', ['none', 'snsOnly', 'old'])) gapCount++
  if (has('workflow', ['excel', 'kakao', 'paper', 'scattered'])) gapCount++
  if (isMulti('iso', 'none') && many(answers, 'futurePlans').some((p) => ['bigCorp', 'bidding', 'export'].includes(p))) gapCount++

  const arrears = has('taxArrears', ['yes'])
  const weakSite = has('website', ['none', 'snsOnly', 'old'])
  const headline = arrears
    ? '자금보다 먼저 체납 정리를 확인하는 것이 좋아요.'
    : has('bizPlan', ['none', 'simple'])
      ? '회사를 설명할 사업계획서와 자료를 먼저 챙기면 좋아요.'
      : weakSite
        ? '온라인에서 회사를 보여줄 화면부터 정비하면 좋아요.'
        : strengthCount > gapCount
          ? '기반이 잘 갖춰지고 있어요. 남은 부분만 보완하면 돼요.'
          : '지금 부족한 부분부터 하나씩 확인해보세요.'

  return { strengthCount, gapCount, interestCount: interests.length, headline }
}

type RecContext = {
  arrears: boolean
  founder: boolean
  individual: boolean
  corp: boolean
  areas: Record<ScoreArea, AreaResult>
}

function recommend(answers: DiagnosisAnswers, ctx: RecContext): ProductRecommendation[] {
  const concerns = many(answers, 'concerns')
  const plans = many(answers, 'futurePlans')
  const hasIso = many(answers, 'iso').some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v))
  const fundingWhen = one(answers, 'fundingWhen')
  const hiring = one(answers, 'hiring')
  const website = one(answers, 'website')
  const workflow = one(answers, 'workflow')
  const venture = one(answers, 'venture')
  const lab = one(answers, 'researchLab')
  const years = one(answers, 'years')
  const industry = one(answers, 'industry')

  // 후보: { slug, weight, reason }
  const cand: Array<{ slug: string; w: number; reason: string }> = []

  // 정책자금 — 체납 시 강추천 금지(선결과제 우선)
  if (fundingWhen && fundingWhen !== 'none') {
    if (ctx.arrears) {
      cand.push({
        slug: 'funding-consulting',
        w: 35,
        reason: '자금 수요는 있지만 체납 선결과제가 있어, 정리 이후 가능성 진단부터 차분히 검토하시길 권해드려요.',
      })
    } else {
      const urgency = fundingWhen === 'm1' ? 100 : fundingWhen === 'm3' ? 92 : fundingWhen === 'm6' ? 75 : 60
      cand.push({
        slug: 'funding-consulting',
        w: urgency,
        reason: `자금 필요 시점이 ${
          fundingWhen === 'm1' ? '1개월 이내' : fundingWhen === 'm3' ? '3개월 이내' : fundingWhen === 'm6' ? '6개월 이내' : '계획 단계'
        }이고 세금 체납이 없어 정책자금 가능성 검토 우선순위가 높습니다.`,
      })
    }
  }

  // 고용지원금
  if (hiring && hiring !== 'na') {
    const label =
      hiring === 'recent' ? '최근 신규채용을 했' : hiring === 'plan6m' ? '6개월 이내 채용 계획이 있' : hiring === 'parental' ? '육아휴직·대체인력 대상이 있' : '고용유지 고민이 있'
    cand.push({ slug: 'employment-subsidy', w: hiring === 'retention' ? 68 : 82, reason: `${label}어 고용지원금 활용 여지를 확인해볼 만합니다.` })
  }

  // 벤처 혁신성장형 — 법인 & 3년 미만 & 벤처 없음이면 상향
  if (!ctx.founder && ['none', 'expired', 'unsure'].includes(venture ?? '')) {
    const young = years === 'lt1' || years === 'y1to3'
    if (ctx.corp) {
      cand.push({
        slug: 'venture-innovation',
        w: young ? 88 : 66,
        reason: young
          ? '창업 3년 미만 법인이며 벤처기업확인을 보유하지 않아 혁신성장형 벤처확인 준비를 검토할 수 있습니다.'
          : '벤처기업확인이 없어 기술성·성장성 근거를 보강할 여지가 있습니다.',
      })
    } else if (ctx.individual) {
      // 개인사업자 — 즉시 구매 권유 대신 장기 검토 후보로만
      cand.push({
        slug: 'venture-innovation',
        w: 30,
        reason: '개인사업자는 법인 전환 후 검토할 수 있는 영역이에요. 장기 로드맵에 넣어두시면 좋습니다.',
      })
    }
  }

  // 벤처 투자유형 — 투자유치 계획이 있을 때만
  if (ctx.corp && plans.includes('invest') && ['none', 'expired', 'unsure'].includes(venture ?? '')) {
    cand.push({ slug: 'venture-investment', w: 58, reason: '투자유치 계획이 있어 투자유형 벤처확인이 적합할 수 있습니다.' })
  }

  // 홈페이지
  if (['none', 'snsOnly', 'old'].includes(website ?? '')) {
    const w = website === 'none' ? 80 : website === 'snsOnly' ? 72 : 62
    cand.push({
      slug: 'responsive-homepage',
      w: concerns.includes('online') ? w + 8 : w,
      reason:
        website === 'old'
          ? '홈페이지가 오래되어 고객·심사자에게 보여줄 온라인 첫인상 정비가 필요합니다.'
          : '홈페이지가 없어 고객·심사자가 회사를 확인할 기본 채널부터 마련하면 좋습니다.',
    })
  }

  // AX 시스템
  if (['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '')) {
    cand.push({
      slug: 'ai-ax-system',
      w: concerns.includes('manualWork') ? 78 : 64,
      reason: '업무가 엑셀·메신저·수기 중심이라 반복업무 1가지부터 자동화하면 운영 효율을 빠르게 올릴 수 있습니다.',
    })
  }

  // 연구소
  if (!ctx.founder && ['none', 'unsure'].includes(lab ?? '') && (plans.includes('newProduct') || industry === 'it' || industry === 'manufacture')) {
    cand.push({
      slug: 'rnd-center',
      w: ctx.individual ? 34 : plans.includes('newProduct') ? 70 : 56,
      reason: ctx.individual
        ? '연구조직은 법인 전환 후 검토하기 좋은 영역이에요. 장기 계획에 담아두세요.'
        : '기술·제품 개발 계획이 있는데 연구조직이 없어, 연구개발 기반을 정리해두면 활용 폭이 넓어집니다.',
    })
  }

  // ISO
  const wantsBig = plans.some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
  if (!ctx.founder && wantsBig && !hasIso) {
    cand.push({
      slug: 'iso-certification',
      w: 84,
      reason: '대기업 납품·공공입찰·수출 계획이 있지만 ISO 인증이 없어 대외 신뢰도 보완 우선순위가 높습니다.',
    })
  }

  // 메인비즈/이노비즈 — 업력 3년+ & 미보유일 때 보조 후보
  const mature = years === 'y3to7' || years === 'y7plus'
  if (!ctx.founder && !ctx.individual && mature && one(answers, 'mainbiz') !== 'have' && wantsBig) {
    cand.push({ slug: 'mainbiz-certification', w: 52, reason: '업력이 3년 이상이고 거래처 계획이 있어 메인비즈로 경영혁신 근거를 더할 수 있습니다.' })
  }
  if (!ctx.founder && !ctx.individual && mature && one(answers, 'innobiz') !== 'have' && (industry === 'manufacture' || industry === 'it')) {
    cand.push({ slug: 'innobiz-certification', w: 50, reason: '기술 기반 업종에 업력 3년 이상이라 이노비즈로 기술혁신 역량을 정리할 수 있습니다.' })
  }

  // 풀패키지 — 부족 영역이 3개 이상이면 상위 추천
  const weakCount = Object.values(ctx.areas).filter((a) => a.score < 55 && a.priority !== '현재 우선순위 낮음').length
  if (weakCount >= 3) {
    cand.push({
      slug: 'growth-roadmap-package',
      w: 86,
      reason: `자금·인증·온라인 등 ${weakCount}개 영역에서 보완점이 함께 발견되어, 하나의 로드맵으로 묶어 설계하는 편이 효율적입니다.`,
    })
  }

  // 이미 잘 갖춘 회사 — 신규 취득 대신 갱신·사후관리·고도화·통합 로드맵 연결 (최소 1개 후속 행동)
  if (cand.length === 0) {
    if (venture === 'expired' || one(answers, 'innobiz') === 'expired' || one(answers, 'mainbiz') === 'expired') {
      cand.push({ slug: 'growth-roadmap-package', w: 40, reason: '보유하셨던 인증 중 만료된 항목이 있어, 갱신과 사후관리를 함께 점검하는 편이 좋습니다.' })
    } else if (['lab', 'dept'].includes(lab ?? '') && fundingWhen && fundingWhen !== 'none') {
      cand.push({ slug: 'funding-consulting', w: 45, reason: '연구조직과 기본 기반을 갖추셨으니, 이를 근거로 정책자금 활용을 검토해볼 수 있습니다.' })
    } else if (website === 'good' && ['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '')) {
      cand.push({ slug: 'ai-ax-system', w: 45, reason: '온라인 기반은 갖추셨으니, 다음은 내부 업무 자동화로 운영을 고도화할 수 있습니다.' })
    } else if (venture === 'have' || ['lab', 'dept'].includes(lab ?? '') || hasIso) {
      cand.push({ slug: 'growth-roadmap-package', w: 42, reason: '주요 인증·기반을 갖추셨으니, 정책자금·추가 인증·AX 등 다음 성장단계를 로드맵으로 설계할 수 있습니다.' })
    } else {
      cand.push({ slug: 'funding-consulting', w: 35, reason: '큰 공백은 없지만, 지금 상태에서 활용할 수 있는 자금·지원제도를 상담으로 확인해두면 좋습니다.' })
    }
  }

  // 정렬 → 최대 3개 (같은 slug 중복 제거)
  const seen = new Set<string>()
  let picked = cand
    .sort((a, b) => b.w - a.w)
    .filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true)))
    .slice(0, 3)

  // 체납 선결과제가 있으면 정책자금은 상위 순위로 올리지 않음 (맨 뒤 + '장기 검토' 고정)
  if (ctx.arrears) {
    picked = [...picked.filter((c) => c.slug !== 'funding-consulting'), ...picked.filter((c) => c.slug === 'funding-consulting')]
  }

  const ranks: ProductRecommendation['rank'][] = ['1순위', '2순위', '장기 검토']
  return picked.map((c, i) => ({
    slug: c.slug,
    rank: ctx.arrears && c.slug === 'funding-consulting' ? '장기 검토' : ranks[i],
    reason: c.reason,
    problems: ruleFor(c.slug)?.problems(answers),
  }))
}
