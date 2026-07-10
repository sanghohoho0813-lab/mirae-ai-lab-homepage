// 퀘스트형 기업 성장진단 — 점수·추천 엔진.
// ⚠️ 여기서 계산되는 점수는 실제 승인확률·선정확률이 아니라
//    이 진단 서비스 내부의 '준비도 점수'(0~100)입니다. 결과 화면에 그 성격을 명시합니다.
// 질문 분기로 답하지 않은 항목은 델타를 더하지 않아 불이익이 없습니다.
import type {
  AreaResult,
  DiagnosisAnswers,
  DiagnosisResultData,
  ProductRecommendation,
  ScoreArea,
} from '../types/businessDiagnosis'
import { hasArrears, isFounderToBe, isIndividual, isCorp } from '../data/businessDiagnosisQuestions'
import { computeAdvantageItems } from '../data/policyAdvantageFactors'

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
  credibility: '대외신인도·입찰 경쟁력',
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

const statusOf = (score: number): AreaResult['status'] =>
  score < 40 ? '먼저 준비 필요' : score < 70 ? '보완하면 활용 가능' : '활용 검토 가능'

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

  // ── 6개 영역 점수 ──
  const areas: AreaResult[] = (Object.keys(AREA_LABELS) as ScoreArea[]).map((area) => {
    const score = scoreArea(area, answers, interestBonus(area))
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
    return { area, label: AREA_LABELS[area], score, status, priority, note, reasons }
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
  if (improvements.length === 0) improvements.push('큰 공백 없이 고르게 준비되어 있어요. 유지가 곧 전략입니다.')

  const prerequisites: string[] = []
  if (arrears) prerequisites.push('국세·지방세 체납 정리 — 대부분의 정책자금·지원사업 검토 전에 먼저 확인해야 합니다.')
  if (one(answers, 'taxArrears') === 'paying') prerequisites.push('체납 분납·정리 진행 상황 점검 — 완료 시점에 맞춰 자금 일정을 잡는 것이 안전합니다.')

  // ── 종합 메시지 ──
  const top2 = sortedWeak.slice(0, 2).map((a) => a.label.replace(/ (준비도|활용 가능성|운영체계)$/, ''))
  const summary = arrears
    ? '자금 검토보다 체납 정리라는 선결과제가 먼저입니다. 정리 후 준비하면 순서가 훨씬 깔끔해집니다.'
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

  return { summary, areas, strengths, improvements, prerequisites, actionPlan, recommendations, advantages, ownedAdvantageCount, topTask, overallScore }
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
      reason: '대기업 납품·공공입찰·수출 계획이 있지만 ISO 인증이 없어 대외신인도 보완 우선순위가 높습니다.',
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
  }))
}
