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
  /** 카드용 짧은 설명 */
  short: string
  /** 가격 표기 (예: '55만원', '499만원~') */
  price: string
  /** 가격 보조 문구 (예: '44만원 상당 특허출원 포함') */
  priceNote?: string
  recommendedFor: string[]
  deliverables: string[]
  process: string
  expectation: string
  /** 이 상품이 필요한 이유 (상세페이지) */
  why: string
  faqs: Faq[]
  visualType: BusinessVisualType
  /** 실제 이미지 경로 (예: '/assets/business-services/funding-consulting.png') */
  imageSrc?: string
  /** 상품별 유의사항 (없으면 공통 DISCLAIMER 사용) */
  notice?: string
  /** 히어로 대표 노출 상품 */
  featured?: boolean
  /** 대표 상품 (골드 강조) */
  flagship?: boolean
}

// 카테고리 탭
export const CATEGORIES = ['전체', '자금·지원금', '벤처·인증', '홈페이지·AI', '풀패키지']

// 공통 진행 절차
export const PROCEDURE = ['기본 진단', '자료 확인', '전략 정리', '결과물 제작 또는 문서화', '후속 안내']

// 공통 비용 안내 / 유의사항
export const COST_NOTE = '상담 후 맞춤 안내'
export const COST_SHORT = '상담 후 안내'
export const PERIOD_NOTE = '상담 후 안내'
export const REVIEW_NOTE = '상담 문의 언제든'
export const DISCLAIMER =
  '본 서비스는 정책자금 승인, 정부지원사업 선정, 기업인증 취득을 보장하지 않습니다. 기업의 업종, 재무상태, 대표자 이력, 신청 시점, 기관 심사 기준에 따라 결과는 달라질 수 있습니다.'

export const businessPackages: BusinessPackage[] = [
  {
    id: 'funding-consulting',
    slug: 'funding-consulting',
    category: '자금·지원금',
    badge: '가능성 진단',
    badgeTone: 'blue',
    name: '정책자금 컨설팅',
    tagline: '운전자금·시설자금 가능성 진단부터 신청 전략까지 정리해 드립니다.',
    short: '운전자금·시설자금 가능성 진단부터 신청 전략까지',
    price: '55만원',
    recommendedFor: ['운전자금·시설자금 가능성을 먼저 확인하고 싶은 대표님', '어떤 자금부터 검토할지 막막한 대표님'],
    deliverables: ['정책자금 가능성 진단', '우선 검토 자금 방향 정리', '신청 전략 및 준비서류 안내'],
    process: '진단 → 자금 방향 정리 → 신청 전략 안내',
    expectation: '검토 가능한 정책자금 방향이 정리되고, 신청 전 전략과 준비서류가 명확해집니다.',
    why: '정책자금은 종류가 많고 자격 요건이 복잡해 무엇부터 봐야 할지 판단하기 어렵습니다. 운전자금·시설자금 가능성을 먼저 진단하면 준비 시간과 시행착오를 줄일 수 있습니다.',
    faqs: [
      { q: '정책자금 승인을 보장하나요?', a: '아니요. 승인·금리·한도는 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략, 준비서류 방향을 함께 정리합니다.' },
      { q: '매출이 적어도 진단이 되나요?', a: '네. 업종·업력·재무 상황에 맞춰 검토 가능한 자금 방향을 정리합니다.' },
      { q: '진단 후 신청까지 도와주나요?', a: '진단 결과에 따라 준비물과 다음 단계를 안내드리고, 이후 진행은 상담에서 함께 정합니다.' },
    ],
    visualType: 'funding',
    imageSrc: '/assets/business-services/funding-consulting.png',
    notice:
      '정책자금 승인, 대출 실행, 금리, 한도는 보장하지 않습니다. 기업의 업종·재무상태·신청 시점·기관 심사 기준에 따라 결과는 달라질 수 있습니다.',
    featured: true,
  },
  {
    id: 'employment-subsidy',
    slug: 'employment-subsidy',
    category: '자금·지원금',
    badge: '성공보수형',
    badgeTone: 'blue',
    name: '고용지원금 패키지',
    tagline: '기업 상황에 맞는 고용지원금을 찾아 신청부터 사후관리까지 지원합니다.',
    short: '기업 상황에 맞는 고용지원금을 찾아 신청부터 사후관리까지 지원합니다.',
    price: '선불 5% + 성공보수 15%',
    priceNote: '총 20% (선불 5% + 성공보수 15%)',
    recommendedFor: ['채용 계획이 있어 고용지원금을 활용하고 싶은 대표님', '신청부터 사후관리까지 맡기고 싶은 기업'],
    deliverables: ['지원금 가능성 검토', '신청 대상 제도 정리', '신청 및 사후관리 안내'],
    process: '가능성 검토 → 제도 정리 → 신청·사후관리 안내',
    expectation: '기업 상황에 맞는 고용지원금 제도가 정리되고, 신청부터 사후관리까지 진행 방향이 잡힙니다.',
    why: '고용지원금은 제도가 다양하고 요건·기간 관리가 까다롭습니다. 기업 상황에 맞는 제도를 찾아 신청과 사후관리까지 함께 진행하면 놓치는 부분을 줄일 수 있습니다.',
    faqs: [
      { q: '지원금 지급을 보장하나요?', a: '아니요. 지급 여부는 요건 충족과 기관 심사에 따라 달라집니다. 저희는 가능성 검토와 신청·사후관리 진행을 돕습니다.' },
      { q: '비용은 어떻게 되나요?', a: '선불 5%와 성공보수 15%(총 20%) 구조로, 기업 상황에 따라 상담에서 안내드립니다.' },
      { q: '어떤 지원금이 대상인가요?', a: '채용·고용유지 등 기업 상황에 맞는 제도를 검토해 신청 대상을 정리합니다.' },
    ],
    visualType: 'gov',
    imageSrc: '/assets/business-services/employment-subsidy.png',
    featured: true,
  },
  {
    id: 'venture-innovation',
    slug: 'venture-innovation',
    category: '벤처·인증',
    badge: '특허출원 포함',
    badgeTone: 'blue',
    name: '벤처인증 패키지 (혁신성장형)',
    tagline: '기술성과 성장성을 중심으로 벤처확인을 준비합니다.',
    short: '기술성과 성장성을 중심으로 벤처확인을 준비합니다.',
    price: '199만원',
    priceNote: '44만원 상당 특허출원 포함',
    recommendedFor: ['기술성·성장성 중심으로 벤처확인을 준비하는 법인', '특허출원과 벤처인증을 함께 준비하려는 대표님'],
    deliverables: ['벤처확인 방향 진단', '기술성·성장성 스토리 정리', '특허출원 연계', '신청 준비자료 안내'],
    process: '진단 → 스토리 정리 → 특허출원 연계 → 신청 준비',
    expectation: '기술성·성장성 관점의 벤처확인 준비 방향이 정리되고, 특허출원과 신청 자료 준비가 연계됩니다.',
    why: '같은 사업도 기술성·성장성 관점으로 정리하면 다르게 보입니다. 혁신성장형 벤처확인 준비에 맞춰 스토리를 재구성하고 특허출원을 연계합니다.',
    faqs: [
      { q: '벤처인증 취득을 보장하나요?', a: '아니요. 벤처기업확인은 기관 심사 사항입니다. 저희는 기술성·성장성 스토리 설계와 신청 준비를 돕습니다.' },
      { q: '특허출원이 포함되나요?', a: '네. 44만원 상당 특허출원을 연계해 함께 준비합니다.' },
      { q: '기술기업이 아니어도 되나요?', a: '업종에 맞는 기술성·성장성 관점을 함께 찾아 정리합니다.' },
    ],
    visualType: 'venture',
    imageSrc: '/assets/business-services/venture-innovation.png',
    notice:
      '벤처기업확인 취득을 보장하지 않습니다. 기업의 기술성·성장성 평가와 기관 심사 기준에 따라 결과는 달라질 수 있습니다.',
  },
  {
    id: 'venture-investment',
    slug: 'venture-investment',
    category: '벤처·인증',
    badge: '절세 전략',
    badgeTone: 'blue',
    name: '벤처인증 패키지 (투자유형)',
    tagline: '연봉 1억 이상 전문직·자산가들이 많이 활용하는 절세 전략입니다.',
    short: '연봉 1억 이상 전문직·자산가들이 많이 활용하는 절세 전략입니다.',
    price: '500만원',
    recommendedFor: ['연봉 1억 이상 전문직·자산가 대표님', '투자유형으로 벤처확인과 소득공제를 함께 검토하려는 대표님'],
    deliverables: ['투자유형 구조 검토', '소득공제 가능성 안내', '투자금 회수 구조 설명', '벤처확인 준비 방향 정리'],
    process: '구조 검토 → 소득공제 안내 → 회수 구조 설명 → 준비 방향 정리',
    expectation: '투자유형 벤처확인 구조와 소득공제 가능성이 정리되고, 투자금 회수 구조까지 함께 검토합니다.',
    why: '투자유형 벤처확인은 연봉 1억 이상 전문직·자산가들이 많이 활용하는 절세 전략입니다. 투자 구조와 소득공제 가능성, 회수 구조를 함께 검토해 준비 방향을 정리합니다.',
    faqs: [
      { q: '소득공제 효과가 보장되나요?', a: '아니요. 소득공제·절세 효과는 개인의 소득 구조와 세법, 투자 조건에 따라 달라질 수 있습니다. 가능성과 구조를 함께 검토합니다.' },
      { q: '투자금은 회수할 수 있나요?', a: '투자금 회수 구조를 함께 설명드리며, 조건과 시점은 상담에서 구체적으로 안내드립니다.' },
      { q: '누가 많이 활용하나요?', a: '연봉 1억 이상 전문직·자산가 대표님들이 절세 전략으로 많이 검토합니다.' },
    ],
    visualType: 'venture',
    imageSrc: '/assets/business-services/venture-investment.png',
    notice:
      '벤처투자에 따른 소득공제·절세 효과는 개인의 소득 구조와 세법, 투자 조건에 따라 달라질 수 있으며 특정 결과를 보장하지 않습니다. 벤처기업확인 취득 역시 기관 심사 사항입니다.',
  },
  {
    id: 'responsive-homepage',
    slug: 'responsive-homepage',
    category: '홈페이지·AI',
    badge: '온라인 영업',
    badgeTone: 'slate',
    name: '반응형 홈페이지 제작',
    tagline: '24시간 일하는 온라인 영업사원을 만들어 드립니다.',
    short: '24시간 일하는 온라인 영업사원',
    price: '49만원',
    recommendedFor: ['온라인에서 회사를 보여줄 홈페이지가 필요한 대표님', '모바일까지 대응되는 반응형 홈페이지를 원하는 기업'],
    deliverables: ['반응형 홈페이지', '회사 소개 구조 정리', '서비스·문의 섹션 구성', '모바일 최적화'],
    process: '기획 → 구조 설계 → 제작 → 모바일 최적화',
    expectation: 'PC·모바일에서 모두 잘 보이는 반응형 홈페이지가 생겨, 24시간 회사를 소개하고 문의를 받을 수 있습니다.',
    why: '홈페이지는 24시간 일하는 온라인 영업사원입니다. 회사 소개부터 서비스·문의까지 반응형으로 정리하면 고객이 언제든 회사를 확인할 수 있습니다.',
    faqs: [
      { q: '모바일에서도 잘 보이나요?', a: '네. 반응형으로 제작해 PC·태블릿·모바일에서 모두 최적화되어 보입니다.' },
      { q: '어떤 내용이 들어가나요?', a: '회사 소개, 서비스, 문의 섹션을 기본 구조로 구성하고 대표님 상황에 맞춰 정리합니다.' },
      { q: '문의는 어떻게 받나요?', a: '문의 섹션을 구성해 방문자가 바로 상담을 남길 수 있도록 만듭니다.' },
    ],
    visualType: 'mvp',
    imageSrc: '/assets/business-services/responsive-homepage.png',
  },
  {
    id: 'ai-ax-system',
    slug: 'ai-ax-system',
    category: '홈페이지·AI',
    badge: '업무 자동화',
    badgeTone: 'slate',
    name: 'AI 기반 회사 운영시스템 구축',
    tagline: '반복업무 자동화 · PC/모바일 통합관리 · 데이터 기반 경영을 구축합니다.',
    short: '반복업무 자동화 · PC/모바일 통합관리 · 데이터 기반 경영',
    price: '129만원',
    priceNote: '홈페이지 포함 시 149만원',
    recommendedFor: ['반복업무를 자동화하고 싶은 대표님', 'PC·모바일에서 회사 운영을 통합 관리하려는 기업'],
    deliverables: ['업무관리 화면', '데이터 입력·조회 구조', 'PC·모바일 대응', '간단한 자동화·리포트 구조'],
    process: '업무 진단 → 화면 설계 → 구축 → 자동화·리포트 구성',
    expectation: '반복업무가 줄고, PC·모바일에서 데이터를 통합 관리하며 데이터 기반으로 회사를 운영할 수 있는 구조가 생깁니다.',
    why: '반복업무를 사람이 계속 처리하면 시간과 실수가 늘어납니다. 업무관리 화면과 자동화·리포트 구조를 갖추면 PC·모바일에서 데이터 기반으로 회사를 운영할 수 있습니다.',
    faqs: [
      { q: '어떤 업무를 자동화할 수 있나요?', a: '반복 입력·조회·리포트 등 대표님 업무를 진단해 자동화 가능한 부분을 함께 설계합니다.' },
      { q: '홈페이지도 같이 되나요?', a: '네. 홈페이지 포함 시 149만원으로 함께 구축할 수 있습니다.' },
      { q: '모바일에서도 쓸 수 있나요?', a: 'PC·모바일 모두 대응되는 구조로 만들어 어디서든 관리할 수 있습니다.' },
    ],
    visualType: 'mvp',
    imageSrc: '/assets/business-services/ai-ax-system.png',
  },
  {
    id: 'rnd-center',
    slug: 'rnd-center',
    category: '벤처·인증',
    badge: '가점 확보',
    badgeTone: 'slate',
    name: '기업부설연구소 설립',
    tagline: '정부지원사업·정책자금 가점 확보에 도움이 되는 연구소 설립을 지원합니다.',
    short: '정부지원사업 · 정책자금 가점 확보',
    price: '149만원',
    priceNote: '사후관리 월 2만원 선택',
    recommendedFor: ['정부지원사업·정책자금 가점을 확보하고 싶은 대표님', '연구개발 활동을 체계화하려는 법인'],
    deliverables: ['연구소/연구전담부서 설립 방향 진단', '설립 요건·인력 기준 정리', '필요 서류 및 신청 절차 안내', '설립 후 사후관리 안내'],
    process: '요건 점검 → 설립 준비 → 신청 → 사후관리 안내',
    expectation: '연구소 설립 요건과 준비 순서가 정리되고, 정부지원사업·정책자금 가점 확보 가능성을 함께 검토합니다.',
    why: '기업부설연구소나 연구개발전담부서는 정부지원사업·정책자금 심사에서 가점 요소가 될 수 있습니다. 설립 요건과 인력 기준, 사후관리까지 순서대로 정리하면 준비 부담을 줄일 수 있습니다.',
    faqs: [
      { q: '설립하면 지원사업에 무조건 유리한가요?', a: '가점 요소가 될 수 있으나 선정을 보장하지는 않습니다. 요건에 맞춰 설립 방향을 정리합니다.' },
      { q: '사후관리도 되나요?', a: '설립 후 사후관리를 월 2만원 옵션으로 선택하실 수 있습니다.' },
      { q: '인력 요건이 걱정됩니다.', a: '설립 요건과 인력 기준을 함께 점검해 준비 방향을 안내드립니다.' },
    ],
    visualType: 'lab',
    imageSrc: '/assets/business-services/rnd-center.png',
  },
  {
    id: 'iso-certification',
    slug: 'iso-certification',
    category: '벤처·인증',
    badge: '3종 패키지',
    badgeTone: 'slate',
    name: 'ISO 인증 패키지',
    tagline: '대기업 거래·공공입찰·해외수출 준비에 필요한 ISO 인증을 준비합니다.',
    short: '대기업 거래 · 공공입찰 · 해외수출 준비',
    price: '각 149만원',
    priceNote: 'ISO 9001/14001/45001 각 149만원 · 3종 패키지 399만원',
    recommendedFor: ['대기업 거래·공공입찰을 준비하는 기업', '해외 수출을 준비하는 기업'],
    deliverables: ['ISO 인증 유형 진단 (9001/14001/45001)', '요구사항·문서화 방향 정리', '심사 준비 자료 안내', '3종 패키지 통합 진행 옵션'],
    process: '현황 점검 → 문서화 준비 → 심사 대응 안내',
    expectation: '어떤 ISO 인증부터 준비할지 방향이 잡히고, 대기업 거래·공공입찰·수출 준비에 필요한 문서화 순서가 정리됩니다.',
    why: 'ISO 인증은 대기업 거래, 공공입찰, 해외 수출에서 요구되는 경우가 많습니다. 9001·14001·45001 중 필요한 유형을 골라 요구사항과 문서화를 정리하면 준비가 수월해집니다.',
    faqs: [
      { q: '3종을 모두 받아야 하나요?', a: '아니요. 필요한 유형만 선택하거나, 3종 패키지(399만원)로 통합 진행할 수 있습니다.' },
      { q: '어떤 인증이 필요한가요?', a: '거래처·입찰·수출 요구사항에 맞춰 필요한 인증 유형을 함께 진단합니다.' },
      { q: '문서화가 어렵습니다.', a: '요구사항에 맞는 문서화 방향과 심사 준비 자료를 정리해 안내드립니다.' },
    ],
    visualType: 'lab',
    imageSrc: '/assets/business-services/iso-certification.png',
  },
  {
    id: 'mainbiz-certification',
    slug: 'mainbiz-certification',
    category: '벤처·인증',
    badge: '가점 확보',
    badgeTone: 'slate',
    name: '메인비즈 인증',
    tagline: '정책자금·정부지원사업 선정 가점 확보에 도움이 되는 경영혁신 인증을 준비합니다.',
    short: '정책자금 · 정부지원사업 선정 가점 확보',
    price: '199만원',
    recommendedFor: ['정책자금·정부지원사업 가점을 확보하고 싶은 대표님', '경영혁신 활동을 인증으로 정리하려는 기업'],
    deliverables: ['메인비즈 인증 방향 진단', '경영혁신 평가 항목 정리', '신청 준비 자료 안내'],
    process: '진단 → 평가항목 정리 → 신청 준비 안내',
    expectation: '메인비즈(경영혁신형 중소기업) 인증 준비 방향이 정리되고, 정책자금·정부지원사업 가점 확보 가능성을 검토합니다.',
    why: '메인비즈는 경영혁신형 중소기업 인증으로, 정책자금·정부지원사업 선정 시 가점 요소가 될 수 있습니다. 평가 항목에 맞춰 준비 방향을 정리합니다.',
    faqs: [
      { q: '인증 취득을 보장하나요?', a: '아니요. 취득은 기관 심사 사항입니다. 저희는 평가 항목에 맞춘 준비 방향 정리를 돕습니다.' },
      { q: '이노비즈와 무엇이 다른가요?', a: '메인비즈는 경영혁신형, 이노비즈는 기술혁신형 인증입니다. 상황에 맞는 방향을 함께 검토합니다.' },
      { q: '가점이 얼마나 되나요?', a: '가점 폭은 사업·기관 기준에 따라 달라질 수 있어, 가능성 중심으로 안내드립니다.' },
    ],
    visualType: 'lab',
    imageSrc: '/assets/business-services/mainbiz-certification.png',
  },
  {
    id: 'innobiz-certification',
    slug: 'innobiz-certification',
    category: '벤처·인증',
    badge: '기술혁신',
    badgeTone: 'slate',
    name: '이노비즈 인증',
    tagline: '기술혁신기업 인증을 통한 정책자금·정부지원사업 우대를 준비합니다.',
    short: '기술혁신기업 인증을 통한 정책자금·정부지원사업 우대',
    price: '249만원',
    recommendedFor: ['기술혁신 역량을 인증으로 정리하려는 기업', '정책자금·정부지원사업 우대를 준비하는 대표님'],
    deliverables: ['이노비즈 인증 방향 진단', '기술혁신 평가 항목 정리', '신청 준비 자료 안내'],
    process: '진단 → 평가항목 정리 → 신청 준비 안내',
    expectation: '이노비즈(기술혁신형 중소기업) 인증 준비 방향이 정리되고, 정책자금·정부지원사업 우대 가능성을 검토합니다.',
    why: '이노비즈는 기술혁신형 중소기업 인증으로, 정책자금·정부지원사업에서 우대 요소가 될 수 있습니다. 기술혁신 평가 항목에 맞춰 준비 방향을 정리합니다.',
    faqs: [
      { q: '인증 취득을 보장하나요?', a: '아니요. 취득은 기관 심사 사항입니다. 저희는 기술혁신 평가 항목에 맞춘 준비를 돕습니다.' },
      { q: '메인비즈와 함께 받아도 되나요?', a: '네. 기술혁신형(이노비즈)과 경영혁신형(메인비즈)을 상황에 맞춰 함께 검토할 수 있습니다.' },
      { q: '기술 자료가 부족합니다.', a: '기술혁신 평가 항목에 맞춰 준비 방향과 자료를 함께 정리합니다.' },
    ],
    visualType: 'lab',
    imageSrc: '/assets/business-services/innobiz-certification.png',
  },
  {
    id: 'growth-roadmap-package',
    slug: 'growth-roadmap-package',
    category: '풀패키지',
    badge: '대표 상품',
    badgeTone: 'primary',
    name: '성장 로드맵 풀패키지',
    tagline: '대표님은 사업에 집중하고, 정책자금·인증·홈페이지·AI 시스템까지 필요한 성장 구조를 한 번에 설계합니다.',
    short: '대표님은 사업에 집중하고, 필요한 성장 구조를 한 번에 설계합니다.',
    price: '499만원~',
    priceNote: '기업 상황에 따라 맞춤 견적',
    recommendedFor: ['사업에 집중하면서 성장 구조 전체를 맡기고 싶은 대표님', '정책자금·인증·홈페이지·AI를 한 번에 설계하려는 기업'],
    deliverables: ['통합 성장 로드맵 설계', '정책자금·인증 우선순위 정리', '홈페이지·AI 시스템 구축 계획', '단계별 실행 및 진행 관리'],
    process: '종합 진단 → 로드맵 설계 → 단계별 실행 관리',
    expectation: '정책자금·인증·홈페이지·AI 시스템이 하나의 성장 로드맵으로 연결되어, 무엇을 언제 준비할지 명확해집니다.',
    why: '필요한 것을 따로따로 준비하면 흐름이 끊기고 시간이 오래 걸립니다. 정책자금·인증·홈페이지·AI 시스템을 하나의 성장 구조로 설계하면 대표님은 사업에 집중하실 수 있습니다.',
    faqs: [
      { q: '한 번에 다 진행하나요?', a: '우선순위를 정해 단계적으로 진행합니다. 무엇부터 할지는 종합 진단에서 함께 정합니다.' },
      { q: '견적은 어떻게 정해지나요?', a: '기업 상황과 범위에 따라 달라, 499만원부터 맞춤 견적으로 상담 후 안내드립니다.' },
      { q: '필요한 것만 골라도 되나요?', a: '네. 성장 로드맵을 기준으로 필요한 부분부터 진행할 수 있습니다.' },
    ],
    visualType: 'full',
    imageSrc: '/assets/business-services/growth-roadmap-package.png',
    featured: true,
    flagship: true,
  },
]

// ── 상품 배너(썸네일) 폴백 메타 ─────────────────────────────────────────────
// 실제 이미지 로드 실패 시에만 사용되는 CSS 배너 문구/색상.
export type BannerAccent = 'blue' | 'sky' | 'indigo' | 'cyan' | 'slate'

export const packageBanner: Record<string, { title: string; subtitle: string; accent: BannerAccent }> = {
  'funding-consulting': { title: '정책자금 컨설팅', subtitle: '운전자금·시설자금 가능성 진단', accent: 'blue' },
  'employment-subsidy': { title: '고용지원금 패키지', subtitle: '신청부터 사후관리까지', accent: 'sky' },
  'venture-innovation': { title: '벤처인증 · 혁신성장형', subtitle: '기술성·성장성 중심 준비', accent: 'indigo' },
  'venture-investment': { title: '벤처인증 · 투자유형', subtitle: '절세 전략으로 많이 활용', accent: 'indigo' },
  'responsive-homepage': { title: '반응형 홈페이지', subtitle: '24시간 일하는 온라인 영업사원', accent: 'cyan' },
  'ai-ax-system': { title: 'AI 회사 운영시스템', subtitle: '반복업무 자동화·통합관리', accent: 'cyan' },
  'rnd-center': { title: '기업부설연구소 설립', subtitle: '정부지원·정책자금 가점 확보', accent: 'slate' },
  'iso-certification': { title: 'ISO 인증 패키지', subtitle: '거래·입찰·수출 준비', accent: 'slate' },
  'mainbiz-certification': { title: '메인비즈 인증', subtitle: '경영혁신형 가점 확보', accent: 'slate' },
  'innobiz-certification': { title: '이노비즈 인증', subtitle: '기술혁신형 우대 확보', accent: 'slate' },
  'growth-roadmap-package': { title: '성장 로드맵 풀패키지', subtitle: '자금·인증·홈페이지·AI 한 번에', accent: 'blue' },
}

export function getPackageBySlug(slug: string | undefined): BusinessPackage | undefined {
  return businessPackages.find((p) => p.slug === slug)
}

export const badgeToneClass: Record<BadgeTone, string> = {
  primary: 'bg-slate-900 text-white',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  slate: 'bg-slate-100 text-slate-600',
}

// 카테고리 배지 색상
export const categoryToneClass: Record<string, string> = {
  '자금·지원금': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  '벤처·인증': 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/15',
  '홈페이지·AI': 'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/15',
  '풀패키지': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/20',
}
