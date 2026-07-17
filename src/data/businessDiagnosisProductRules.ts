// 기업 성장진단 — 11개 판매 상품 연결 규칙 (데이터 기반 추천).
// ⚠️ 원칙: 답변상 부족이 있으면 관련 상품 추천 / 이미 보유하면 신규 취득 대신 갱신·사후관리·고도화 /
//    선결과제(체납)면 결제보다 상담 우선 / 강점이 많아도 최소 1개 후속 행동 연결 /
//    관련 없는 상품은 억지로 추천하지 않음.
import type { DiagnosisAnswers } from '../types/businessDiagnosis'

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])
const hasIso = (a: DiagnosisAnswers) => many(a, 'iso').some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v))
const wantsBig = (a: DiagnosisAnswers) => many(a, 'futurePlans').some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
const weakSite = (a: DiagnosisAnswers) => ['none', 'snsOnly', 'old'].includes(one(a, 'website') ?? '')
const weakOps = (a: DiagnosisAnswers) => ['excel', 'kakao', 'paper', 'scattered'].includes(one(a, 'workflow') ?? '')
const isFounder = (a: DiagnosisAnswers) => one(a, 'bizType') === 'pre'
const isIndiv = (a: DiagnosisAnswers) => one(a, 'bizType') === 'individual'
const isCorp = (a: DiagnosisAnswers) => one(a, 'bizType') === 'corp'
const mature = (a: DiagnosisAnswers) => ['y3to7', 'y7plus'].includes(one(a, 'years') ?? '')
const youngCorp = (a: DiagnosisAnswers) => isCorp(a) && ['lt1', 'y1to3'].includes(one(a, 'years') ?? '')
const arrears = (a: DiagnosisAnswers) => one(a, 'taxArrears') === 'yes'
const techIndustry = (a: DiagnosisAnswers) => ['manufacture', 'it'].includes(one(a, 'industry') ?? '')

export type ProductRule = {
  slug: string
  /** 추천 조건 → 가중치(높을수록 우선) */
  recommendWeight: (a: DiagnosisAnswers) => number
  /** 추천 이유 문장 */
  reason: (a: DiagnosisAnswers) => string
  /** 이 상품으로 해결되는 문제 */
  problems: (a: DiagnosisAnswers) => string[]
}

export const productRules: ProductRule[] = [
  {
    slug: 'funding-consulting',
    recommendWeight: (a) => {
      const w = one(a, 'fundingWhen')
      if (arrears(a)) return 35 // 선결과제 → 상담형, 상위 추천 제한(엔진에서 rank 조정)
      if (w === 'm1') return 100
      if (w === 'm3') return 92
      if (w === 'm6') return 75
      if (w === 'planning') return 58
      if (many(a, 'concerns').includes('workingCapital') || many(a, 'concerns').includes('facility')) return 60
      return 0
    },
    reason: (a) =>
      arrears(a)
        ? '자금은 필요하지만 체납을 먼저 정리해야 해서, 정리한 뒤에 가능성 진단부터 차분히 검토하는 것이 좋습니다.'
        : `자금 필요 시점이 ${
            one(a, 'fundingWhen') === 'm1' ? '1개월 이내' : one(a, 'fundingWhen') === 'm3' ? '3개월 이내' : one(a, 'fundingWhen') === 'm6' ? '6개월 이내' : '가까운 시기'
          }로 다가오고 있어, 심사자에게 보여줄 자료를 함께 준비하면 검토가 수월해집니다.`,
    problems: () => ['자금 사용목적·상환계획 정리 부족', '심사자에게 보여줄 준비자료 부족'],
  },
  {
    slug: 'employment-subsidy',
    recommendWeight: (a) => {
      const h = one(a, 'hiring')
      if (!h || h === 'na') return 0
      return h === 'recent' || h === 'plan6m' ? 82 : h === 'parental' ? 78 : 64
    },
    reason: (a) => {
      const h = one(a, 'hiring')
      const label = h === 'recent' ? '최근 채용을 했' : h === 'plan6m' ? '6개월 이내 채용 계획이 있' : h === 'parental' ? '육아휴직·대체인력 대상이 있' : '고용유지 고민이 있'
      return `${label}어, 채용 전후 시기와 요건을 확인하면 고용지원금 활용 여지를 볼 수 있습니다.`
    },
    problems: () => ['신청 시기·요건 미확인', '지원 대상 여부 미확인'],
  },
  {
    slug: 'venture-innovation',
    recommendWeight: (a) => {
      if (isFounder(a)) return 0
      const v = one(a, 'venture')
      if (!['none', 'expired', 'unsure'].includes(v ?? '')) return 0
      if (youngCorp(a)) return 88
      if (isIndiv(a)) return 28 // 법인 전환 후 검토 → 장기
      return 62
    },
    reason: (a) =>
      youngCorp(a)
        ? '창업 3년 미만 법인이며 벤처기업확인이 없어, 기술성과 성장성을 보여줄 공식 자료를 먼저 준비할 필요가 있습니다.'
        : isIndiv(a)
          ? '개인사업자는 법인 전환 후 검토할 수 있는 영역이라 장기 로드맵에 담아두면 좋습니다.'
          : '벤처기업확인이 없어 기술성·성장성 근거를 보강할 여지가 있습니다.',
    problems: (a) => (youngCorp(a) ? ['기술기업 증빙 부족', '정부지원사업 설명자료 부족', '창업벤처 세제혜택 검토 시기 확인 필요'] : ['기술성·성장성 공식 근거 부족']),
  },
  {
    slug: 'venture-investment',
    recommendWeight: (a) => (isCorp(a) && many(a, 'futurePlans').includes('invest') && ['none', 'expired', 'unsure'].includes(one(a, 'venture') ?? '') ? 56 : 0),
    reason: () => '투자유치 계획이 있어 투자유형 벤처확인이 적합할 수 있습니다.',
    problems: () => ['투자유치용 기업 증빙 부족'],
  },
  {
    slug: 'responsive-homepage',
    recommendWeight: (a) => {
      if (!weakSite(a)) return 0
      const base = one(a, 'website') === 'none' ? 80 : one(a, 'website') === 'snsOnly' ? 72 : 62
      return many(a, 'concerns').includes('online') ? base + 8 : base
    },
    reason: (a) =>
      one(a, 'website') === 'old'
        ? '홈페이지가 오래되어 고객·심사자에게 보여줄 온라인 첫인상 정비가 필요합니다.'
        : '홈페이지가 없어 고객·심사자가 회사를 확인할 기본 채널부터 마련하면 좋습니다.',
    problems: () => ['온라인 첫인상·신뢰도 부족', '신청서 내용을 보여줄 화면 부족'],
  },
  {
    slug: 'ai-ax-system',
    recommendWeight: (a) => {
      if (!weakOps(a)) return 0
      const t = one(a, 'repetitiveTime')
      const timeBoost = t === 'h2plus' ? 16 : t === 'h1to2' ? 12 : t === 'm30to60' ? 6 : 0
      return (many(a, 'concerns').includes('manualWork') ? 70 : 60) + timeBoost
    },
    reason: (a) => {
      const t = one(a, 'repetitiveTime')
      const timeNote = t === 'h2plus' || t === 'h1to2' ? '반복업무에 쓰는 시간이 적지 않아, ' : ''
      return `${timeNote}업무가 엑셀·메신저·수기 중심이라 반복업무 1가지부터 자동화하면 운영 효율을 빠르게 올릴 수 있습니다.`
    },
    problems: () => ['반복 입력·자료 분산', '진행상황을 바로 확인하기 어려움'],
  },
  {
    slug: 'rnd-center',
    recommendWeight: (a) => {
      if (isFounder(a)) return 0
      const lab = one(a, 'researchLab')
      if (!['none', 'unsure'].includes(lab ?? '')) return 0
      const relevant = many(a, 'futurePlans').includes('newProduct') || techIndustry(a) || ['launched3y', 'developing'].includes(one(a, 'newProduct') ?? '')
      if (!relevant) return 0
      return isIndiv(a) ? 34 : many(a, 'futurePlans').includes('newProduct') ? 70 : 56
    },
    reason: (a) =>
      isIndiv(a)
        ? '연구조직은 법인 전환 후 검토하기 좋은 영역이라 장기 계획에 담아두세요.'
        : '기술·제품 개발 활동이 있는데 연구조직이 없어, 연구개발 기반을 정리해두면 활용 폭이 넓어집니다.',
    problems: () => ['연구개발 활동 증빙 부족', 'R&D 세제지원 검토 기반 부족'],
  },
  {
    slug: 'iso-certification',
    recommendWeight: (a) => (!isFounder(a) && wantsBig(a) && !hasIso(a) ? 84 : 0),
    reason: () => '대기업 납품·공공입찰·수출 계획이 있지만 ISO 인증이 없어 대외 신뢰도 보완 우선순위가 높습니다.',
    problems: () => ['입찰·거래처 요구 인증 부족', '관리체계 설명자료 부족'],
  },
  {
    slug: 'mainbiz-certification',
    recommendWeight: (a) => {
      if (isFounder(a) || isIndiv(a) || !mature(a)) return 0
      if (one(a, 'mainbiz') === 'have') return 0
      return wantsBig(a) || !techIndustry(a) ? 52 : 40
    },
    reason: () => '업력이 3년 이상이고 경영혁신 역량을 공식 인증으로 보여줄 여지가 있어 메인비즈를 검토할 수 있습니다.',
    problems: () => ['경영혁신 역량 공식 증빙 부족'],
  },
  {
    slug: 'innobiz-certification',
    recommendWeight: (a) => {
      if (isFounder(a) || isIndiv(a) || !mature(a)) return 0
      if (one(a, 'innobiz') === 'have') return 0
      const techBase = techIndustry(a) || ['lab', 'dept'].includes(one(a, 'researchLab') ?? '') || ['launched3y', 'developing'].includes(one(a, 'newProduct') ?? '')
      return techBase ? 50 : 0
    },
    reason: () => '기술 기반 업종에 업력 3년 이상이라 이노비즈로 기술혁신 역량을 정리할 수 있습니다.',
    problems: () => ['기술혁신 역량 공식 증빙 부족'],
  },
  {
    slug: 'growth-roadmap-package',
    recommendWeight: () => 0, // 엔진에서 부족영역 3+개면 별도 상향
    reason: () => '자금·인증·온라인 등 여러 영역에서 보완점이 함께 발견되어, 하나의 로드맵으로 묶어 설계하는 편이 효율적입니다.',
    problems: () => ['여러 영역의 준비가 동시에 필요'],
  },
]

export function ruleFor(slug: string): ProductRule | undefined {
  return productRules.find((r) => r.slug === slug)
}
