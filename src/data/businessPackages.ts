// 대표자용 서비스몰 상품 데이터 — 서비스몰 홈과 상세페이지가 공유하는 단일 소스.
import type { BusinessVisualType } from '../components/BusinessServiceVisual'

export type BadgeTone = 'primary' | 'blue' | 'slate'

export type Faq = { q: string; a: string }

export type BusinessPackage = {
  id: string
  slug: string
  category: string
  badge: string
  badgeTone: BadgeTone
  name: string
  tagline: string
  /** 인기 카드용 더 짧은 설명 */
  short: string
  recommendedFor: string[]
  deliverables: string[]
  process: string
  expectation: string
  /** 이 상품이 필요한 이유 (상세페이지) */
  why: string
  faqs: Faq[]
  visualType: BusinessVisualType
  /** 실제 이미지 준비 시 지정 (예: '/assets/business-services/funding-diagnosis.png') */
  imageSrc?: string
  featured?: boolean
}

// 카테고리 탭
export const CATEGORIES = ['전체', '자금', '지원사업', '벤처·인증', '홈페이지·MVP', '풀패키지']

// 공통 진행 절차
export const PROCEDURE = ['기본 진단', '자료 확인', '전략 정리', '결과물 제작 또는 문서화', '후속 안내']

// 공통 비용 안내 / 유의사항
export const COST_NOTE = '진단 후 제안 · 상담 후 맞춤 안내'
export const COST_SHORT = '진단 후 안내'
export const PERIOD_NOTE = '상담 후 안내'
export const REVIEW_NOTE = '리뷰 0 · 진행사례 준비중'
export const DISCLAIMER =
  '본 서비스는 정책자금 승인, 정부지원사업 선정, 벤처기업확인 취득을 보장하지 않습니다. 기업의 업종, 재무상태, 대표자 이력, 신청 시점, 기관 심사 기준에 따라 결과는 달라질 수 있습니다.'

export const businessPackages: BusinessPackage[] = [
  {
    id: 'fund-diagnosis',
    slug: 'funding-diagnosis',
    category: '자금',
    badge: '입문 추천',
    badgeTone: 'blue',
    name: '정책자금 가능성 진단 패키지',
    tagline: '재무·업종·업력 기준으로 검토 가능한 정책자금 방향을 정리합니다.',
    short: '운전자금·시설자금 방향을 먼저 확인합니다.',
    recommendedFor: ['운전자금이 필요한 대표', '대출 금리를 낮추고 싶은 대표', '어떤 자금부터 볼지 막막한 대표'],
    deliverables: ['정책자금 가능성 진단 리포트', '우선 검토 제도 목록', '신청 전 준비물 체크리스트'],
    process: '진단 → 우선순위 정리 → 신청 준비 안내',
    expectation: '어떤 자금부터 검토할지 우선순위가 정리되고, 신청 전 준비물이 명확해집니다.',
    why: '정책자금은 종류가 많고 자격 요건이 복잡해 무엇부터 봐야 할지 판단하기 어렵습니다. 현재 재무·업종·업력을 기준으로 검토 가능한 방향을 먼저 정리하면 준비 시간과 시행착오를 줄일 수 있습니다.',
    faqs: [
      { q: '정책자금 승인을 보장하나요?', a: '아니요. 승인은 기관 심사 사항이며, 저희는 가능성 진단과 신청 전략 설계를 돕습니다.' },
      { q: '매출이 적어도 진단이 되나요?', a: '네. 업종·업력·재무 상황에 맞춰 검토 가능한 방향을 정리합니다.' },
      { q: '진단 후 신청까지 도와주나요?', a: '진단 결과에 따라 준비물과 다음 단계를 안내드리고, 이후 진행은 상담에서 함께 정합니다.' },
    ],
    visualType: 'funding',
    featured: true,
  },
  {
    id: 'gov-plan',
    slug: 'support-program-plan',
    category: '지원사업',
    badge: '준비 추천',
    badgeTone: 'slate',
    name: '정부지원사업 사업계획 전략 패키지',
    tagline: '예창패·초창패·소상공인 지원사업 신청 전 사업계획 구조를 정리합니다.',
    short: '신청 전 사업계획의 뼈대를 잡습니다.',
    recommendedFor: ['지원사업을 처음 준비하는 대표', '사업계획서 작성이 막막한 대표'],
    deliverables: ['사업계획 스토리 구조안', '항목별 작성 가이드', '심사 포인트 정리'],
    process: '분석 → 스토리 구조화 → 작성 가이드 제공',
    expectation: '사업계획의 뼈대와 심사 포인트가 잡혀, 작성 방향이 또렷해집니다.',
    why: '지원사업은 사업계획서에서 당락이 갈립니다. 우리 사업의 강점을 심사자가 이해하기 쉬운 언어와 구조로 정리하면 준비 방향이 또렷해집니다.',
    faqs: [
      { q: '선정을 보장하나요?', a: '아니요. 선정은 기관 심사 사항이며, 저희는 사업계획 구조화와 심사 포인트 정리를 돕습니다.' },
      { q: '처음 준비하는데 가능한가요?', a: '네. 처음 준비하는 대표님 기준으로 항목별 작성 가이드를 제공합니다.' },
      { q: '어떤 지원사업에 맞나요?', a: '예창패·초창패·소상공인 지원사업 등 대표님 상황에 맞춰 방향을 정리합니다.' },
    ],
    visualType: 'gov',
  },
  {
    id: 'venture-story',
    slug: 'venture-story',
    category: '벤처·인증',
    badge: '성장기업 추천',
    badgeTone: 'blue',
    name: '벤처인증 스토리 설계 패키지',
    tagline: '일반 사업을 기술성·성장성 중심의 벤처인증 스토리로 재구성합니다.',
    short: '일반 사업을 기술성·성장성 중심으로 정리합니다.',
    recommendedFor: ['벤처기업확인을 준비하는 법인', '기술기업처럼 보여야 하는 대표'],
    deliverables: ['기술성·성장성 스토리라인', '벤처 유형 검토', '준비 서류 로드맵'],
    process: '현황 분석 → 스토리 재구성 → 서류 로드맵',
    expectation: '우리 사업이 기술성·성장성 관점에서 어떻게 보이는지 정리되고, 준비 순서가 잡힙니다.',
    why: '같은 사업도 기술성·성장성 관점으로 정리하면 완전히 다르게 보입니다. 벤처기업확인 준비에 맞게 사업의 스토리를 재구성합니다.',
    faqs: [
      { q: '벤처인증 취득을 보장하나요?', a: '아니요. 확인은 기관 심사 사항이며, 저희는 기술성·성장성 스토리 설계와 서류 준비를 돕습니다.' },
      { q: '기술기업이 아니어도 되나요?', a: '업종에 맞는 기술성·성장성 관점을 함께 찾아 정리합니다.' },
      { q: '서류 준비도 도와주나요?', a: '준비 서류 로드맵을 정리해 드리고, 진행은 상담에서 함께 정합니다.' },
    ],
    visualType: 'venture',
    featured: true,
  },
  {
    id: 'web-mvp',
    slug: 'homepage-mvp',
    category: '홈페이지·MVP',
    badge: '대표 추천',
    badgeTone: 'primary',
    name: '홈페이지 + MVP 제작 패키지',
    tagline: '심사자와 고객에게 보여줄 웹페이지와 작동형 MVP를 제작합니다.',
    short: '심사자와 고객에게 보여줄 결과물을 만듭니다.',
    recommendedFor: ['보여줄 결과물이 부족한 대표', '심사자에게 보여줄 화면이 필요한 대표'],
    deliverables: ['소개 웹페이지', '작동형 MVP 화면', '데모용 시연 시나리오'],
    process: '기획 → 화면 제작 → 데모 정리',
    expectation: '심사자와 고객에게 보여줄 웹페이지와 작동 화면이 생겨, 설명이 쉬워집니다.',
    why: "심사자와 고객은 '보여줄 수 있는 결과물'에 반응합니다. 소개 웹페이지와 간단한 작동형 MVP가 있으면 설명이 훨씬 쉬워집니다.",
    faqs: [
      { q: '어느 정도까지 만들어 주나요?', a: '소개 웹페이지와 핵심 기능을 보여주는 작동형 MVP 화면, 데모 시나리오까지 준비합니다.' },
      { q: '아이디어만 있어도 되나요?', a: '네. 아이디어를 화면과 흐름으로 구체화하는 것이 이 패키지의 목적입니다.' },
      { q: '디자인만 하는 건가요?', a: '디자인뿐 아니라 심사·상담에서 보여줄 수 있는 작동 화면 중심으로 만듭니다.' },
    ],
    visualType: 'mvp',
    featured: true,
  },
  {
    id: 'lab-cert',
    slug: 'certification-roadmap',
    category: '벤처·인증',
    badge: '법인 추천',
    badgeTone: 'slate',
    name: '연구소·기업인증 로드맵 패키지',
    tagline: '기업부설연구소·벤처·이노비즈/메인비즈 인증 흐름을 정리합니다.',
    short: '인증과 사후관리 순서를 한 번에 정리합니다.',
    recommendedFor: ['인증과 사후관리를 함께 보고 싶은 법인', '여러 인증을 순서대로 준비하려는 대표'],
    deliverables: ['인증 우선순위 로드맵', '요건·서류 체크리스트', '사후관리 일정안'],
    process: '요건 점검 → 우선순위 → 사후관리 계획',
    expectation: '어떤 인증을 어떤 순서로 준비할지 로드맵이 생기고, 사후관리 일정이 잡힙니다.',
    why: '인증은 하나씩 따로 준비하면 시간이 오래 걸립니다. 기업부설연구소·벤처·이노비즈/메인비즈를 순서와 요건으로 정리하면 준비가 수월해집니다.',
    faqs: [
      { q: '인증 취득을 보장하나요?', a: '아니요. 취득은 기관 심사 사항이며, 저희는 요건 점검과 준비 로드맵을 돕습니다.' },
      { q: '여러 인증을 같이 볼 수 있나요?', a: '네. 우선순위를 정해 순서대로 준비하도록 로드맵을 정리합니다.' },
      { q: '사후관리도 포함되나요?', a: '사후관리 일정안을 함께 정리해 드립니다.' },
    ],
    visualType: 'lab',
  },
  {
    id: 'full',
    slug: 'full-package',
    category: '풀패키지',
    badge: '로드맵 추천',
    badgeTone: 'slate',
    name: '정책자금·벤처인증 풀패키지',
    tagline: '자금·인증·사업계획·MVP·홈페이지를 하나의 성장 로드맵으로 설계합니다.',
    short: '자금·인증·사업계획·결과물을 하나의 로드맵으로.',
    recommendedFor: ['중장기적으로 기업지원제도를 활용하려는 대표', '전체 로드맵이 필요한 대표'],
    deliverables: ['통합 성장 로드맵', '단계별 실행 계획', '우선 제작물 우선순위'],
    process: '종합 진단 → 로드맵 설계 → 단계별 실행',
    expectation: '자금·인증·사업계획·결과물이 하나의 로드맵으로 연결되어 실행 순서가 명확해집니다.',
    why: '자금·인증·사업계획·결과물을 따로 준비하면 흐름이 끊깁니다. 하나의 성장 로드맵으로 연결하면 무엇을 언제 준비할지 명확해집니다.',
    faqs: [
      { q: '한 번에 다 진행하나요?', a: '우선순위를 정해 단계적으로 진행합니다. 무엇부터 할지는 진단에서 함께 정합니다.' },
      { q: '기간이 오래 걸리나요?', a: '범위에 따라 다르며, 상담에서 일정을 함께 정합니다.' },
      { q: '필요한 것만 골라도 되나요?', a: '네. 로드맵을 기준으로 필요한 부분부터 진행할 수 있습니다.' },
    ],
    visualType: 'full',
  },
]

// ── 상품 배너(썸네일) 메타 ───────────────────────────────────────────────────
// 카드/상세 상단 배너에 크게 노출되는 상품 키워드 + 결과 문구 + 색상 포인트.
export type BannerAccent = 'blue' | 'sky' | 'indigo' | 'cyan' | 'slate'

export const packageBanner: Record<string, { title: string; subtitle: string; accent: BannerAccent }> = {
  'fund-diagnosis': { title: '정책자금 가능성 진단', subtitle: '운전자금·시설자금 방향 먼저 확인', accent: 'blue' },
  'gov-plan': { title: '사업계획 전략', subtitle: '지원사업 신청 전 구조 정리', accent: 'sky' },
  'venture-story': { title: '벤처인증 스토리', subtitle: '기술성·성장성 중심으로 재구성', accent: 'indigo' },
  'web-mvp': { title: '홈페이지 + MVP', subtitle: '심사자에게 보여줄 결과물 제작', accent: 'cyan' },
  'lab-cert': { title: '기업인증 로드맵', subtitle: '연구소·벤처·이노비즈 흐름 정리', accent: 'slate' },
  full: { title: '정책자금·벤처 풀패키지', subtitle: '자금·인증·MVP를 하나로', accent: 'blue' },
}

export function getPackageBySlug(slug: string | undefined): BusinessPackage | undefined {
  return businessPackages.find((p) => p.slug === slug)
}

export const badgeToneClass: Record<BadgeTone, string> = {
  primary: 'bg-slate-900 text-white',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  slate: 'bg-slate-100 text-slate-600',
}
