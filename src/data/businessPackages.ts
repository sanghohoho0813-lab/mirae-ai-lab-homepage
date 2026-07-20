// 대표자용 서비스몰 상품 데이터 — 서비스몰 홈과 상세페이지가 공유하는 단일 소스.
import type { BusinessVisualType } from '../components/BusinessServiceVisual'

export type BadgeTone = 'primary' | 'blue' | 'slate'

export type Faq = { q: string; a: string }

// 결제 방식:
//  - fixed   : 고정가 일회성 결제 (예: 55만원)
//  - variant : 선택형(옵션에 따라 금액 변동, 예: ISO 1/2/3종)
//  - consult : 카드결제 없이 상담 후 결정
export type PriceType = 'fixed' | 'variant' | 'consult'
/** optionId 는 서버 결제 카탈로그(billing_products.option_id)와 일치해야 합니다 */
export type PriceVariant = { optionId: string; label: string; amount: number; note?: string; badge?: string }

export type BusinessPackage = {
  id: string
  slug: string
  category: string
  /** 카드·상세 표시용 카테고리 라벨 (그룹핑은 category, 표기만 다르게 할 때) */
  categoryLabel?: string
  badge: string
  badgeTone: BadgeTone
  name: string
  tagline: string
  /** 카드용 짧은 설명 */
  short: string
  /** 가격 표기 (예: '55만원', '상담 후 결정') */
  price: string
  /** 카드결제 금액(원) — fixed 상품용. variant 상품은 variants[].amount 사용, consult 는 없음 */
  amount?: number
  /** 가격 보조 문구 (예: '44만원 상당 특허출원 포함') */
  priceNote?: string
  /** 가격 옆 강조 문구 (빨간색 표시 — 예: '성공수수료 없음') */
  priceHighlight?: string
  /** 결제 방식 (기본 fixed) */
  priceType?: PriceType
  /** variant 결제 시 선택 옵션 */
  variants?: PriceVariant[]
  /** 썸네일 하단 밴드에 있던 핵심 혜택 키워드 (텍스트로 노출) */
  highlights: string[]
  /** 썸네일 하단 캐치프레이즈 */
  highlightNote?: string
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
export const CATEGORIES = ['전체', '자금조달', '지원금', '인증·절세', 'AX 컨설팅', '풀패키지', '법인 컨설팅']

// 카테고리별 상황 헤드라인 (서비스몰 홈 섹션 제목 + 카테고리 탭 라벨)
export const CATEGORY_SCENARIOS: Record<string, string> = {
  '자금조달': '저금리로 자금 조달이 필요하다면',
  '지원금': '정부 지원금, 놓치지 않고 받고 싶다면',
  '인증·절세': '대외 신뢰도·가점·세금 혜택까지 챙기고 싶다면',
  'AX 컨설팅': 'AI 시대에 뒤처지지 않는 회사로 만들고 싶다면',
  '풀패키지': '믿을 만한 파트너가 늘 함께했으면 한다면',
  '법인 컨설팅': '세금은 줄이고, 회사의 부를 제대로 옮기고 싶다면',
}

// 카테고리별 보조 안내 — 섹션 제목 아래 노출 (전문성 신뢰 확보용)
export const CATEGORY_NOTES: Record<string, string> = {
  '법인 컨설팅': '가지급금·이익잉여금·가업승계 같은 세무 사안은 세무사 등 관련 분야 전문 자격사와 함께 진행합니다.',
}

// 대표 상품 TOP 5 노출 순서
export const FEATURED_IDS = ['funding-consulting', 'employment-subsidy', 'growth-roadmap-package', 'venture-innovation', 'ai-ax-system']

// 공통 진행 절차
export const PROCEDURE = ['기본 진단', '자료 확인', '전략 정리', '결과물 제작 또는 문서화', '후속 안내']

// 공통 비용 안내 / 유의사항
export const COST_NOTE = '상담 후 맞춤 안내'
export const COST_SHORT = '상담 후 안내'
export const PERIOD_NOTE = '상담 후 안내'
export const REVIEW_NOTE = '상담 문의 언제든'
export const DISCLAIMER =
  '본 페이지의 내용은 일반적인 제도와 사례를 설명하기 위한 정보이며, 특정 결과(정책자금 승인·정부지원사업 선정·기업인증 취득 등)를 보장하지 않습니다. 실제 적용 여부와 지원금액·세금·인증 가능성은 기업의 업종, 설립일, 매출, 인력, 지분구조, 재무상태, 과거 고용이력 및 신청 시점의 법령·공고에 따라 달라질 수 있습니다. 미래 AI 랩은 기업 현황을 먼저 점검한 뒤 적용 가능한 제도와 실행 순서를 안내하며, 세무신고·법률사무·노무사무·특허대리 등 관계 법령상 자격이 필요한 업무는 해당 자격을 갖춘 전문가와 협업하여 진행합니다.'

export const businessPackages: BusinessPackage[] = [
  {
    id: 'funding-consulting',
    slug: 'funding-consulting',
    category: '자금조달',
    badge: '가능성 진단',
    badgeTone: 'blue',
    name: '정책자금 컨설팅',
    tagline: '운전자금·시설자금 가능성 진단부터 신청 전략까지 정리해 드립니다.',
    short: '운전자금·시설자금 가능성 진단부터 신청 전략까지',
    price: '50만원',
    amount: 500000,
    priceNote: '컨설팅 종료 후 정가 237,000원 상당 전자책 3종 증정 (리뷰 작성 시)',
    priceHighlight: '성공수수료 없음 (업계 평균 5~7%)',
    highlights: ['성공수수료 없음 — 업계 평균 5~7%', '컨설팅 종료 후 정가 237,000원 상당 전자책 3종 증정 (리뷰 작성 시)', '바로 신청 가능한 사업계획서 작성'],
    highlightNote: '운전자금·시설자금 가능성 진단부터 신청 전략까지',
    recommendedFor: ['운전자금·시설자금 가능성을 먼저 확인하고 싶은 대표님', '어떤 자금부터 검토할지 막막한 대표님'],
    deliverables: [
      '우리 회사에 맞는 자금·기관 우선순위',
      '승인 가능성 중심의 신청 전략과 준비서류',
      '바로 신청 가능한 상태의 사업계획서',
      '다음엔 직접 하실 수 있는 셀프 진행 노하우 (전자책 3종)',
    ],
    process: '진단 → 자금 방향 정리 → 신청 전략 안내',
    expectation: '검토 가능한 정책자금 방향이 정리되고, 신청 전 전략과 준비서류가 명확해집니다.',
    why: '정책자금은 종류가 많고 자격 요건이 복잡해 무엇부터 봐야 할지 판단하기 어렵습니다. 운전자금·시설자금 가능성을 먼저 진단하면 준비 시간과 시행착오를 줄일 수 있습니다.',
    faqs: [
      { q: '정책자금 승인을 보장하나요?', a: '아니요. 승인·금리·한도는 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략, 준비서류 방향을 함께 정리합니다.' },
      { q: '매출이 적어도 진단이 되나요?', a: '네. 업종·업력·재무 상황에 맞춰 검토 가능한 자금 방향을 정리합니다.' },
      { q: '진단 후 신청까지 도와주나요?', a: '진단 결과에 따라 준비물과 다음 단계를 안내드리고, 이후 진행은 상담에서 함께 정합니다.' },
      { q: '비용이 정말 50만원이 전부인가요?', a: '기본 진단은 50만원이 전부이고 성과보수도 없습니다. 대부분 이 진단만으로도 충분히 준비하실 수 있습니다. 다만 전체 진행을 맡기시는 전부 위임형은 조달액의 3%, AI 자동화까지 더하는 AX 결합형은 5%가 선택하신 경우에만 발생합니다(업계 성공수수료 5~7%보다 낮은 편).' },
      { q: '증정 전자책은 어떻게 받나요?', a: '결제 후 바로 받으실 수 있도록 안내드립니다. 다만 전자책을 다운로드하신 후에는 환불이 불가한 점 양해 부탁드립니다.' },
    ],
    visualType: 'funding',
    imageSrc: '/assets/business-services/funding-consulting.png',
    notice:
      '정책자금 승인, 대출 실행, 금리, 한도는 보장하지 않습니다. 기업의 업종·재무상태·신청 시점·기관 심사 기준에 따라 결과는 달라질 수 있습니다. 증정 전자책을 다운로드하신 후에는 결제 환불이 불가합니다.',
    featured: true,
  },
  {
    id: 'employment-subsidy',
    slug: 'employment-subsidy',
    category: '지원금',
    badge: '성공보수형',
    badgeTone: 'blue',
    name: '고용지원금 패키지',
    tagline: '기업 상황에 맞는 고용지원금을 찾아 신청부터 사후관리까지 지원합니다.',
    short: '받을 수 있는 지원금을 놓치지 않게, 신청부터 사후관리까지',
    price: '상담 후 안내',
    priceNote: '기업 상황·지원 범위에 따라 맞춤 안내',
    priceType: 'consult',
    highlights: ['신규채용 — 최대 1,440만원 지원', '기존직원 고용유지 — 최대 1,440만원 지원', '육아·대체인력 — 최대 2,100만원 지원'],
    highlightNote: '기업의 인건비 부담을 줄이고, 고용 안정을 지원합니다.',
    recommendedFor: ['채용 계획이 있어 고용지원금을 활용하고 싶은 대표님', '신청부터 사후관리까지 맡기고 싶은 기업'],
    deliverables: ['지원금 가능성 검토', '신청 대상 제도 정리', '신청 및 사후관리 안내'],
    process: '가능성 검토 → 제도 정리 → 신청·사후관리 안내',
    expectation: '기업 상황에 맞는 고용지원금 제도가 정리되고, 신청부터 사후관리까지 진행 방향이 잡힙니다.',
    why: '고용지원금은 제도가 다양하고 요건·기간 관리가 까다롭습니다. 기업 상황에 맞는 제도를 찾아 신청과 사후관리까지 함께 진행하면 놓치는 부분을 줄일 수 있습니다.',
    faqs: [
      { q: '지원금 지급을 보장하나요?', a: '아니요. 지급 여부는 요건 충족과 기관 심사에 따라 달라집니다. 저희는 가능성 검토와 신청·사후관리 진행을 돕습니다.' },
      { q: '비용은 어떻게 되나요?', a: '기업 상황과 지원 범위에 따라 달라, 상담 후 맞춤으로 안내드립니다.' },
      { q: '어떤 지원금이 대상인가요?', a: '채용·고용유지 등 기업 상황에 맞는 제도를 검토해 신청 대상을 정리합니다.' },
    ],
    visualType: 'gov',
    imageSrc: '/assets/business-services/employment-subsidy.png',
    notice:
      '지원금 지급 여부와 금액은 기업 및 요건에 따라 달라질 수 있으며 특정 결과를 보장하지 않습니다. 요건 충족과 기관 심사에 따라 결과가 달라질 수 있습니다.',
    featured: true,
  },
  {
    id: 'venture-innovation',
    slug: 'venture-innovation',
    category: '인증·절세',
    badge: '특허출원 포함',
    badgeTone: 'blue',
    name: '벤처인증 패키지 (혁신성장형)',
    tagline: '기술성과 성장성을 중심으로 벤처확인을 준비합니다.',
    short: '정책자금 우대·가점·신뢰도까지, 특허출원과 함께 준비하는 벤처확인',
    price: '199만원',
    amount: 1990000,
    priceNote: '50만원 상당 특허출원 포함',
    highlights: ['정책자금 우대 혜택', '정부지원사업 가점 확보', '기업 신뢰도 상승 효과'],
    highlightNote: '50만원 상당 특허출원 포함',
    recommendedFor: ['기술성·성장성 중심으로 벤처확인을 준비하는 법인', '특허출원과 벤처인증을 함께 준비하려는 대표님'],
    deliverables: ['벤처확인 방향 진단', '기술성·성장성 스토리 정리', '특허출원 연계', '신청 준비자료 안내'],
    process: '진단 → 스토리 정리 → 특허출원 연계 → 신청 준비',
    expectation: '기술성·성장성 관점의 벤처확인 준비 방향이 정리되고, 특허출원과 신청 자료 준비가 연계됩니다.',
    why: '같은 사업도 기술성·성장성 관점으로 정리하면 다르게 보입니다. 혁신성장형 벤처확인 준비에 맞춰 스토리를 재구성하고 특허출원을 연계합니다.',
    faqs: [
      { q: '벤처인증 취득을 보장하나요?', a: '네, 요건을 갖춘 기업은 취득까지 책임지고 진행합니다. 진행 전 기술성·성장성 가능성을 먼저 진단해, 어려운 경우는 솔직히 말씀드립니다.' },
      { q: '특허출원이 포함되나요?', a: '네. 50만원 상당 특허출원을 연계해 함께 준비합니다.' },
      { q: '기술기업이 아니어도 되나요?', a: '업종에 맞는 기술성·성장성 관점을 함께 찾아 정리합니다.' },
    ],
    visualType: 'venture',
    imageSrc: '/assets/business-services/venture-innovation.png',
    featured: true,
    notice:
      '벤처기업확인 취득을 보장하지 않습니다. 기업의 기술성·성장성 평가와 기관 심사 기준에 따라 결과는 달라질 수 있습니다.',
  },
  {
    id: 'venture-investment',
    slug: 'venture-investment',
    category: '인증·절세',
    badge: '절세 전략',
    badgeTone: 'blue',
    name: '벤처인증 패키지 (투자유형)',
    tagline: '연봉 1억 이상 전문직·자산가들이 많이 활용하는 절세 전략입니다.',
    short: '연봉 1억 이상 전문직·자산가들이 많이 활용하는 절세 전략입니다.',
    price: '상담 후 안내',
    priceType: 'consult',
    priceNote: '기업 상황·투자 조건에 따라 상담 후 맞춤 안내',
    highlights: ['소득공제 최대 4,400만원 — 요건 충족 시', '3년 후 투자금 전액 회수 구조 설명', '연봉 1억+ 전문직·자산가 절세 전략', '벤처확인(투자유형) 준비'],
    highlightNote: '연봉 1억 이상 전문직·자산가들이 많이 활용하는 절세 전략',
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
    category: 'AX 컨설팅',
    badge: '온라인 영업',
    badgeTone: 'slate',
    name: '반응형 홈페이지 제작',
    tagline: '24시간 일하는 온라인 영업사원을 만들어 드립니다.',
    short: '24시간 일하는 온라인 영업사원',
    price: '99만원',
    amount: 990000,
    highlights: ['모바일·PC 완벽 대응', '신뢰도 상승 · 문의 증가', '브랜드 가치 향상'],
    highlightNote: '믿음을 주는 첫인상, 24시간 일하는 온라인 영업사원',
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
    category: 'AX 컨설팅',
    badge: '업무 자동화',
    badgeTone: 'slate',
    name: 'AI 업무 자동화 프로그램 구축',
    tagline: '매일 반복되는 업무를 자동화 프로그램으로 만들어, 시간과 비용을 대폭 절감해 드립니다.',
    short: '매일 반복하는 업무를 자동화해 시간과 인건비를 줄입니다',
    price: '299만원~',
    priceNote: '기업 규모와 자동화 범위에 따라 상담 후 최종 견적이 안내됩니다.',
    priceType: 'consult',
    highlights: ['반복업무 자동화 — 시간·인건비 절감', '업무 진단 후 꼭 필요한 범위만 구축', 'PC·모바일 어디서나 사용'],
    highlightNote: '기업 규모와 자동화 범위에 따라 상담 후 최종 견적이 안내됩니다.',
    recommendedFor: ['매일 반복되는 업무를 자동화하고 싶은 대표님', '회사 상황에 맞는 자동화 범위를 상담으로 정하고 싶은 기업'],
    deliverables: ['반복업무 자동화 프로그램', '업무 진단 및 자동화 설계', 'PC·모바일 대응', '자동화 확장 방향 안내'],
    process: '업무 진단 → 자동화 범위·견적 상담 → 프로그램 구축 → 사용법 안내',
    expectation: '반복하던 업무가 자동화되어, 거기에 들어가던 시간과 인건비가 줄어듭니다. 최종 범위와 견적은 상담에서 확정합니다.',
    why: '반복업무를 사람이 계속 처리하면 시간과 실수가 늘어납니다. 회사 상황에 맞는 자동화 범위를 상담으로 정하면, 꼭 필요한 만큼만 효율적으로 구축할 수 있습니다.',
    faqs: [
      { q: '어떤 업무를 자동화할 수 있나요?', a: '반복 입력·조회·리포트 등 대표님 업무를 진단해 자동화 효과가 가장 큰 업무부터 함께 정합니다.' },
      { q: '견적은 어떻게 정해지나요?', a: '기업 규모와 자동화 범위에 따라 달라, 상담 후 최종 견적을 안내드립니다. 표시된 299만원은 시작 기준 금액입니다.' },
      { q: 'AX 풀 패키지와는 무엇이 다른가요?', a: '이 상품은 반복업무 자동화 프로그램 구축에 집중합니다. 전사 업무 프로세스·CRM·ERP·AI Agent까지 통합 설계하는 것은 별도의 AX 풀 패키지에서 상담으로 진행합니다.' },
    ],
    visualType: 'mvp',
    imageSrc: '/assets/business-services/ai-ax-system.png',
    notice:
      '표시 금액(299만원~)은 시작 기준 금액이며, 최종 견적은 기업 규모와 자동화 범위에 따라 상담 후 확정됩니다.',
    featured: true,
  },
  {
    id: 'ax-full-package',
    slug: 'ax-full-package',
    category: 'AX 컨설팅',
    badge: '한눈에 관리',
    badgeTone: 'slate',
    name: 'AX 풀 패키지',
    tagline: '회사의 모든 정보를 대표님 PC와 스마트폰에서 한눈에 보고 관리할 수 있게 만듭니다. 직원 관리(HR)·고객 관리(CRM)·재고·정산(ERP)·회의 아카이빙까지, 흩어진 업무를 하나로 연결합니다.',
    short: '회사 돌아가는 모든 것, 내 PC·스마트폰에서 한눈에',
    price: '상담 후 안내',
    priceNote: '기업 상황에 맞춰 범위·견적을 상담 후 안내드립니다.',
    priceType: 'consult',
    highlights: ['HR·CRM·ERP·회의기록까지 하나로 연결', '언제 어디서든 PC·스마트폰으로 확인', '필요한 것부터 단계적으로 구축'],
    highlightNote: '흩어진 회사 정보를 한 화면에서 보고 관리합니다.',
    recommendedFor: ['회사 돌아가는 상황을 언제 어디서든 한눈에 보고 싶은 대표님', '엑셀·메신저·수기로 흩어진 업무를 하나로 모으고 싶은 기업'],
    deliverables: ['회사 업무·정보 흐름 진단', 'HR·CRM·ERP·회의 아카이빙 통합 설계', 'PC·스마트폰 어디서든 보는 관리 화면 구축', '단계별 구축·운영 로드맵'],
    process: '종합 진단 → 범위·견적 상담 → 단계별 설계·구축 → 운영 안내',
    expectation: '직원 관리(HR), 고객 관리(CRM), 재고·정산(ERP), 회의 기록까지 흩어져 있던 회사 정보가 하나로 연결되어, 대표님 PC와 스마트폰에서 한눈에 확인하고 관리할 수 있게 됩니다.',
    why: '업무가 엑셀, 메신저, 종이 문서에 흩어져 있으면 회사 상황을 파악하는 데만 하루가 갑니다. 회사의 정보를 한 곳에 모아 PC와 스마트폰 어디서든 볼 수 있게 만들면, 자리에 없어도 회사가 어떻게 돌아가는지 바로 보입니다.',
    faqs: [
      { q: '무엇까지 포함되나요?', a: '직원 관리(HR), 고객 관리(CRM), 재고·매출·정산 관리(ERP), 회의 아카이빙 등 회사 운영에 필요한 것들을 기업 상황에 맞춰 하나로 연결합니다. 범위는 상담에서 정합니다.' },
      { q: '비용은 어떻게 되나요?', a: '기업 규모와 구축 범위에 따라 달라, 상담 후 견적을 안내드립니다.' },
      { q: '한 번에 다 구축하나요?', a: '우선순위를 정해 단계적으로 진행합니다. 무엇부터 할지는 종합 진단에서 함께 정합니다.' },
    ],
    visualType: 'mvp',
    imageSrc: '/assets/business-services/ax-full-package.png',
    notice:
      'AX 풀 패키지의 구축 범위·산출물·비용은 기업 상황에 따라 달라지며, 상담을 통해 확정됩니다.',
  },
  {
    id: 'welfare-fund',
    slug: 'welfare-fund',
    category: 'AX 컨설팅',
    categoryLabel: '직원 복지·절세',
    badge: '전문가 협업',
    badgeTone: 'slate',
    name: '사내·공동 근로복지기금 설립',
    tagline: '회사 세금도, 직원에게 나가는 세금도 함께 줄이면서 직원들이 오래오래 다니고 싶은 회사를 만드는 제도 — 기금 설립부터 운영까지 설계합니다.',
    short: '회사 세금도 직원 세금도 줄이고, 오래 다니고 싶은 회사로',
    price: '299만원~',
    priceNote: '기업 규모·출연 계획에 따라 상담 후 최종 견적 확정',
    priceType: 'consult',
    highlights: ['출연금 손금 인정 — 법인세 부담 절감', '직원 복지 혜택, 소득세·4대보험 부담 없이(요건 충족 시)', '장기 재직을 부르는 복지 체계'],
    highlightNote: '복지는 늘리고, 회사·직원 세금 부담은 함께 줄입니다.',
    recommendedFor: ['직원 복지를 강화하면서 세부담도 줄이고 싶은 대표님', '채용·이직이 잦아 오래 다니는 회사를 만들고 싶은 기업'],
    deliverables: ['사내·공동 기금 적합성 진단', '출연 규모·복지 항목 설계(학자금·경조사·주택자금 등)', '기금법인 설립 절차·인가 진행 안내', '운영 규정·사후관리 안내'],
    process: '적합성 진단 → 출연·복지 설계 → 설립·인가 진행 → 운영 안내',
    expectation: '우리 회사에 맞는 기금 형태(사내/공동)와 출연 규모, 복지 항목이 정리되고, 설립부터 운영까지의 일정이 잡힙니다.',
    why: '근로복지기금에 출연한 금액은 법인 비용으로 인정되고, 기금에서 직원에게 지급하는 복지 혜택은 요건 충족 시 근로소득으로 보지 않아 직원 부담 없이 실질 혜택이 커집니다. 복지가 좋아지면 직원들이 오래 다니고 채용 경쟁력도 함께 올라갑니다. 중소기업은 여러 회사가 함께하는 공동기금으로 정부 지원 연계도 검토할 수 있습니다.',
    faqs: [
      { q: '사내기금과 공동기금은 뭐가 다른가요?', a: '사내기금은 한 회사가 단독으로, 공동기금은 여러 중소기업이 함께 설립합니다. 공동기금은 정부 지원사업 연계를 검토할 수 있어 규모가 작은 기업에 유리한 경우가 많습니다.' },
      { q: '정말 세금이 줄어드나요?', a: '출연금 손금 인정, 복지 혜택 비과세 등은 관련 법령의 요건 충족을 전제로 합니다. 기업 상황에 따라 달라질 수 있어 사전 검토 후 안내드립니다.' },
      { q: '설립이 어렵지 않나요?', a: '정관 작성, 고용노동부 인가 등 절차가 있어 처음엔 복잡하게 느껴질 수 있습니다. 설립부터 운영 규정까지 순서대로 함께 진행합니다.' },
    ],
    visualType: 'gov',
    imageSrc: '/assets/business-services/welfare-fund.png',
    notice:
      '기금 설립·운영과 세제 혜택은 근로복지기본법 등 관련 법령의 요건 충족을 전제로 하며, 기업 상황에 따라 달라질 수 있습니다. 노무·세무 판단이 필요한 부분은 관련 분야 전문 자격사와 협업하여 진행합니다.',
  },
  {
    id: 'rnd-center',
    slug: 'rnd-center',
    category: '인증·절세',
    badge: '가점 확보',
    badgeTone: 'slate',
    name: '기업부설연구소 설립',
    tagline: '정부지원사업·정책자금 가점 확보에 도움이 되는 연구소 설립을 지원합니다.',
    short: '정부지원사업 · 정책자금 가점 확보',
    price: '149만원',
    amount: 1490000,
    priceNote: '사후관리 월 2만원 선택',
    highlights: ['R&D 세액공제 — 최대 수천만원', '정부지원사업 가점 부여', '정책자금 우대 혜택'],
    highlightNote: '정부지원사업·정책자금 가점 확보에 도움이 됩니다.',
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
    category: '인증·절세',
    badge: '3종 패키지',
    badgeTone: 'slate',
    name: 'ISO 인증 패키지',
    tagline: '대기업 거래·공공입찰·해외수출 준비에 필요한 ISO 인증을 준비합니다.',
    short: '대기업 거래 · 공공입찰 · 해외수출 준비',
    price: '149만원~',
    priceNote: '1·2·3종 선택 · 3종 패키지 할인',
    priceType: 'variant',
    variants: [
      { optionId: 'iso-one', label: 'ISO 1종', amount: 1490000, note: '9001·14001·45001 중 택1' },
      { optionId: 'iso-two', label: 'ISO 2종', amount: 2180000, note: '2개 규격 선택' },
      { optionId: 'iso-three', label: 'ISO 3종 패키지', amount: 3990000, badge: '할인' },
    ],
    highlights: ['ISO 9001 품질경영시스템', 'ISO 14001 환경경영시스템', 'ISO 45001 안전보건경영시스템'],
    highlightNote: '대기업 거래 · 공공입찰 · 해외수출 준비에 활용됩니다.',
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
    category: '인증·절세',
    badge: '가점 확보',
    badgeTone: 'slate',
    name: '메인비즈 인증',
    tagline: '정책자금·정부지원사업 선정 가점 확보에 도움이 되는 경영혁신 인증을 준비합니다.',
    short: '정책자금 · 정부지원사업 선정 가점 확보',
    price: '199만원',
    amount: 1990000,
    highlights: ['정책자금 우대평가', '정부지원사업 선정 가점', '기업 신뢰도 상승'],
    highlightNote: '경영혁신형 인증은 정책자금·정부지원사업 평가에서 가점 요소가 될 수 있습니다.',
    recommendedFor: ['정책자금·정부지원사업 가점을 확보하고 싶은 대표님', '경영혁신 활동을 인증으로 정리하려는 기업'],
    deliverables: ['메인비즈 인증 방향 진단', '경영혁신 평가 항목 정리', '신청 준비 자료 안내'],
    process: '진단 → 평가항목 정리 → 신청 준비 안내',
    expectation: '메인비즈(경영혁신형 중소기업) 인증 준비 방향이 정리되고, 정책자금·정부지원사업 가점 확보 가능성을 검토합니다.',
    why: '메인비즈는 경영혁신형 중소기업 인증으로, 정책자금·정부지원사업 선정 시 가점 요소가 될 수 있습니다. 평가 항목에 맞춰 준비 방향을 정리합니다.',
    faqs: [
      { q: '인증 취득을 보장하나요?', a: '네, 요건을 갖춘 기업은 취득까지 책임지고 진행합니다. 평가 항목 기준으로 가능성을 먼저 확인하고, 어려운 경우는 사전에 안내드립니다.' },
      { q: '이노비즈와 무엇이 다른가요?', a: '메인비즈는 경영혁신형, 이노비즈는 기술혁신형 인증입니다. 상황에 맞는 방향을 함께 검토합니다.' },
      { q: '가점이 얼마나 되나요?', a: '가점 폭은 사업·기관 기준에 따라 달라질 수 있어, 가능성 중심으로 안내드립니다.' },
    ],
    visualType: 'lab',
    imageSrc: '/assets/business-services/mainbiz-certification.png',
  },
  {
    id: 'innobiz-certification',
    slug: 'innobiz-certification',
    category: '인증·절세',
    badge: '기술혁신',
    badgeTone: 'slate',
    name: '이노비즈 인증',
    tagline: '기술혁신기업 인증을 통한 정책자금·정부지원사업 우대를 준비합니다.',
    short: '기술혁신기업 인증을 통한 정책자금·정부지원사업 우대',
    price: '199만원',
    amount: 1990000,
    highlights: ['정책자금 우대 혜택', '정부지원사업 선정 가점', '기술혁신 기업 — 브랜드 가치 상승'],
    highlightNote: '기술혁신형 중소기업으로 성장의 기회를 넓히세요.',
    recommendedFor: ['기술혁신 역량을 인증으로 정리하려는 기업', '정책자금·정부지원사업 우대를 준비하는 대표님'],
    deliverables: ['이노비즈 인증 방향 진단', '기술혁신 평가 항목 정리', '신청 준비 자료 안내'],
    process: '진단 → 평가항목 정리 → 신청 준비 안내',
    expectation: '이노비즈(기술혁신형 중소기업) 인증 준비 방향이 정리되고, 정책자금·정부지원사업 우대 가능성을 검토합니다.',
    why: '이노비즈는 기술혁신형 중소기업 인증으로, 정책자금·정부지원사업에서 우대 요소가 될 수 있습니다. 기술혁신 평가 항목에 맞춰 준비 방향을 정리합니다.',
    faqs: [
      { q: '인증 취득을 보장하나요?', a: '네, 요건을 갖춘 기업은 취득까지 책임지고 진행합니다. 기술혁신 평가 항목 기준으로 가능성을 먼저 확인하고, 어려운 경우는 사전에 안내드립니다.' },
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
    tagline: '대표님은 사업에만 집중하세요. 정책자금·인증·홈페이지는 기본이고, 회사 상황을 스마트폰에서 한눈에 보는 업무 자동화 시스템, 법인에 쌓인 자금을 세금 부담은 줄이며 합법적으로 대표님 자산으로 옮기는 구조까지 — 필요한 성장 설계를 한 번에 잡아드립니다.',
    short: '자금·인증·홈페이지에 업무 자동화·법인 절세 구조까지, 회사 성장을 통째로',
    price: '상담 후 결정',
    priceNote: '기업 상황에 따라 맞춤 견적',
    priceType: 'consult',
    highlights: [
      '자금·인증·홈페이지·AI 통합 성장 설계',
      '업무 자동화 시스템(HR·CRM·ERP·회의 기록) — 회사를 스마트폰에서 한눈에',
      '법인 자금·절세 구조 정리(가지급금·이익잉여금 등) — 세금은 줄이고, 자금은 합법적으로 개인화',
      '세무사 등 전문 자격사와 협업 · 전담 원스톱 관리',
      '우선순위별 단계 실행 — 대표님은 사업에만 집중',
    ],
    highlightNote: '복잡한 과정을 한 번에, 대표님은 사업에만 집중하세요.',
    recommendedFor: [
      '사업에 집중하면서 성장 구조 전체를 맡기고 싶은 대표님',
      '자금·인증·홈페이지·업무 자동화를 한 번에 설계하려는 기업',
      '법인에 쌓인 자금·가지급금을 세금 부담 줄여 합법적으로 정리하고 싶은 대표님',
    ],
    deliverables: [
      '통합 성장 로드맵 설계',
      '정책자금·인증 우선순위 정리',
      '홈페이지·업무 자동화 시스템 구축 계획(회사 정보 통합·모바일 관리)',
      '법인 자금·절세 구조 설계(전문 자격사 협업)',
      '단계별 실행 및 진행 관리',
    ],
    process: '종합 진단 → 로드맵 설계 → 단계별 실행 관리',
    expectation: '정책자금·인증·홈페이지에 업무 자동화, 법인 자금·절세 구조까지 하나의 성장 로드맵으로 연결되어, 무엇을 언제 준비할지 명확해집니다.',
    why: '필요한 것을 따로따로 준비하면 흐름이 끊기고 시간이 오래 걸립니다. 정책자금·인증·홈페이지에 더해, 회사 운영을 한눈에 보는 업무 자동화 시스템과 법인 자금·세무 구조 정리(세금 부담은 줄이고 자금은 합법적으로 대표님 자산으로)를 하나의 성장 구조로 설계하면, 대표님은 사업에만 집중하실 수 있습니다.',
    faqs: [
      { q: '한 번에 다 진행하나요?', a: '우선순위를 정해 단계적으로 진행합니다. 자금·인증이 먼저인지, 자동화나 법인 자금 정리가 먼저인지는 종합 진단에서 함께 정합니다.' },
      { q: '견적은 어떻게 정해지나요?', a: '기업 상황과 범위에 따라 달라, 상담 후 맞춤 견적으로 협의드립니다.' },
      { q: '법인 자금·절세 구조도 직접 하시나요?', a: '세무 판단이 필요한 부분은 세무사 등 관련 분야 전문 자격사와 협업해 진행하고, 저희는 전체 로드맵을 설계·관리합니다. 절세 효과는 기업 상황·관련 법령에 따라 달라질 수 있습니다.' },
      { q: '필요한 것만 골라도 되나요?', a: '네. 성장 로드맵을 기준으로 필요한 부분부터 진행할 수 있습니다.' },
    ],
    visualType: 'full',
    imageSrc: '/assets/business-services/growth-roadmap-package.png',
    featured: true,
    flagship: true,
  },
  // ── 법인 컨설팅 (전통 법인 컨설팅 — 세무사 등 전문 자격사 협업, 전부 협의 후 결정) ──
  {
    id: 'provisional-payment',
    slug: 'provisional-payment',
    category: '법인 컨설팅',
    badge: '전문 자격사 협업',
    badgeTone: 'slate',
    name: '가지급금 정리 컨설팅',
    tagline: '세무사 등 관련 분야 전문 자격사와 함께, 쌓여 있는 가지급금의 원인을 분석하고 계획적으로 정리합니다.',
    short: '쌓인 가지급금, 세금 부담이 커지기 전에 계획적으로 정리',
    price: '협의 후 결정',
    priceNote: '가지급금 규모·발생 원인에 따라 협의 후 결정',
    priceType: 'consult',
    highlights: ['가지급금 원인 분석 · 정리 플랜 설계', '인정이자·상여처분 부담 사전 점검', '세무사 등 전문 자격사와 협업 진행'],
    highlightNote: '방치할수록 커지는 가지급금 부담을 계획적으로 줄여갑니다.',
    recommendedFor: ['가지급금이 쌓여 세금 부담이 걱정되는 법인', '법인 자금 흐름을 깨끗하게 정리하고 싶은 대표님'],
    deliverables: ['가지급금 현황·발생 원인 분석', '정리 방안 비교 검토(급여·배당·퇴직금 등)', '실행 순서·일정 정리', '재발 방지 관리 방안 안내'],
    process: '현황 진단 → 정리 방안 설계 → 전문 자격사 협업 실행 → 사후 관리',
    expectation: '가지급금이 왜 쌓였는지 파악되고, 우리 회사 상황에 맞는 정리 순서와 실행 계획이 정리됩니다.',
    why: '가지급금을 방치하면 인정이자 부담이 계속 쌓이고, 정리 시점에 대표 상여로 처분되어 세금 부담이 커질 수 있습니다. 원인을 파악하고 계획을 세워 순서대로 정리하는 것이 부담을 가장 줄이는 방법입니다.',
    faqs: [
      { q: '직접 진행하나요?', a: '세무 판단이 필요한 부분은 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다. 저희는 전체 과정을 설계하고 관리합니다.' },
      { q: '비용은 어떻게 되나요?', a: '가지급금 규모와 발생 원인, 정리 범위에 따라 달라 협의 후 결정됩니다.' },
      { q: '정리하면 세금이 무조건 줄어드나요?', a: '아니요. 기업 상황과 관련 법령에 따라 달라질 수 있어, 사전 검토 후 가능한 범위를 안내드립니다.' },
    ],
    visualType: 'funding',
    imageSrc: '/assets/business-services/provisional-payment.png',
    notice:
      '본 서비스는 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다. 절세 효과와 적용 가능 여부는 기업 상황과 관련 법령·과세관청 해석에 따라 달라질 수 있으며, 특정 결과를 보장하지 않습니다.',
  },
  {
    id: 'retained-earnings',
    slug: 'retained-earnings',
    category: '법인 컨설팅',
    badge: '전문 자격사 협업',
    badgeTone: 'slate',
    name: '이익잉여금 처분 컨설팅',
    tagline: '세무사 등 관련 분야 전문 자격사와 함께, 법인에 쌓인 이익잉여금을 배당·급여·퇴직금 조합으로 계획성 있게 처분합니다.',
    short: '법인에 쌓인 이익잉여금, 배당·급여·퇴직금 조합으로 계획 있게',
    price: '협의 후 결정',
    priceNote: '이익잉여금 규모·주주 구성에 따라 협의 후 결정',
    priceType: 'consult',
    highlights: ['이익잉여금 현황·세부담 시뮬레이션', '배당·급여·퇴직금 조합 설계', '세무사 등 전문 자격사와 협업 진행'],
    highlightNote: '쌓아두기만 한 이익잉여금을 계획적으로 움직입니다.',
    recommendedFor: ['이익잉여금이 쌓여 있는데 어떻게 가져올지 막막한 대표님', '배당·급여·퇴직금을 조합해 세부담을 관리하고 싶은 법인'],
    deliverables: ['이익잉여금 현황 진단', '처분 방안별 세부담 비교(배당·급여·퇴직금 등)', '연도별 실행 플랜 설계', '실행 관리·사후 안내'],
    process: '현황 진단 → 처분 조합 설계 → 전문 자격사 협업 실행 → 사후 관리',
    expectation: '이익잉여금을 언제, 어떤 방식으로, 얼마나 가져올지 연도별 계획이 정리됩니다.',
    why: '이익잉여금을 쌓아두기만 하면 나중에 한 번에 가져올 때 세부담이 커지고, 비상장주식 가치가 올라 승계·양도 부담도 함께 커질 수 있습니다. 미리 조합을 설계해 나눠서 움직이는 것이 유리한 경우가 많습니다.',
    faqs: [
      { q: '어떤 방식들을 검토하나요?', a: '배당, 급여·상여, 임원 퇴직금 등 처분 방식을 기업 상황에 맞춰 조합하고, 방식별 세부담을 비교해 안내드립니다.' },
      { q: '직접 진행하나요?', a: '세무 판단이 필요한 부분은 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다.' },
      { q: '비용은 어떻게 되나요?', a: '이익잉여금 규모와 설계 범위에 따라 달라 협의 후 결정됩니다.' },
    ],
    visualType: 'venture',
    imageSrc: '/assets/business-services/retained-earnings.png',
    notice:
      '본 서비스는 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다. 절세 효과와 적용 가능 여부는 기업 상황과 관련 법령·과세관청 해석에 따라 달라질 수 있으며, 특정 결과를 보장하지 않습니다.',
  },
  {
    id: 'business-succession',
    slug: 'business-succession',
    category: '법인 컨설팅',
    badge: '전문 자격사 협업',
    badgeTone: 'slate',
    name: '가업승계 증여특례 컨설팅',
    tagline: '세무사 등 관련 분야 전문 자격사와 함께, 가업승계 증여세 과세특례 요건을 검토하고 승계 플랜을 설계합니다.',
    short: '자녀에게 물려줄 회사, 증여세 과세특례로 계획적으로 준비',
    price: '협의 후 결정',
    priceNote: '기업 규모·지분 구조에 따라 협의 후 결정',
    priceType: 'consult',
    highlights: ['증여특례 요건·적용 가능성 검토', '승계 일정·지분 이전 플랜 설계', '세무사 등 전문 자격사와 협업 진행'],
    highlightNote: '가업승계는 준비 기간이 길수록 유리합니다.',
    recommendedFor: ['자녀에게 회사를 물려줄 계획이 있는 대표님', '증여세 부담 때문에 승계를 미루고 있는 법인'],
    deliverables: ['가업승계 증여특례 요건 검토', '지분 구조·승계 일정 설계', '특례 적용 후 사후관리 요건 정리', '실행 관리·사후 안내'],
    process: '요건 검토 → 승계 플랜 설계 → 전문 자격사 협업 실행 → 사후관리 안내',
    expectation: '우리 회사가 증여특례를 적용받을 수 있는지, 언제 어떤 순서로 지분을 넘길지 승계 로드맵이 정리됩니다.',
    why: '가업승계는 준비 없이 진행하면 증여세·상속세 부담이 매우 커질 수 있습니다. 과세특례는 요건과 사후관리 의무가 까다로워, 미리 요건을 맞추고 일정을 설계할수록 세부담과 리스크를 줄일 수 있습니다.',
    faqs: [
      { q: '특례를 적용하면 세금이 얼마나 줄어드나요?', a: '기업 규모·지분 가치·요건 충족 여부에 따라 달라집니다. 사전 검토에서 예상 범위를 함께 확인합니다.' },
      { q: '사후관리 요건이 있다고 들었어요.', a: '네. 특례 적용 후 일정 기간 업종·고용 등 유지 의무가 있어, 사후관리까지 함께 설계합니다.' },
      { q: '직접 진행하나요?', a: '세무 판단이 필요한 부분은 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다.' },
    ],
    visualType: 'full',
    imageSrc: '/assets/business-services/business-succession.png',
    notice:
      '본 서비스는 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다. 특례 적용 여부와 절세 효과는 기업 상황과 관련 법령·과세관청 해석에 따라 달라질 수 있으며, 특정 결과를 보장하지 않습니다.',
  },
  {
    id: 'spouse-stock-retirement',
    slug: 'spouse-stock-retirement',
    category: '법인 컨설팅',
    badge: '전문 자격사 협업',
    badgeTone: 'slate',
    name: '배우자 증여 이익소각 설계',
    tagline: '세무사 등 관련 분야 전문 자격사와 함께, 배우자 증여재산공제를 활용한 이익소각 구조의 적용 가능성을 검토하고 설계합니다.',
    short: '배우자 증여공제를 활용한 법인 자금 회수 구조 설계',
    price: '협의 후 결정',
    priceNote: '지분 구조·주식 가치에 따라 협의 후 결정',
    priceType: 'consult',
    highlights: ['배우자 증여공제 활용 구조 검토', '자기주식 취득·소각 절차 설계', '세무사 등 전문 자격사와 협업 진행'],
    highlightNote: '요건과 절차가 까다로운 만큼, 사전 검토가 필수입니다.',
    recommendedFor: ['법인 자금을 회수하고 싶은데 세부담이 걱정되는 대표님', '지분 구조를 정리하면서 자금 회수를 함께 설계하고 싶은 법인'],
    deliverables: ['적용 가능성·리스크 사전 검토', '주식 가치 평가·증여 플랜 설계', '자기주식 취득·소각 절차 설계', '실행 관리·사후 안내'],
    process: '사전 검토 → 구조 설계 → 전문 자격사 협업 실행 → 사후 관리',
    expectation: '우리 회사 상황에서 이익소각 구조가 적용 가능한지, 어떤 절차와 일정으로 진행할지 검토 결과가 정리됩니다.',
    why: '이익소각은 절차와 요건이 까다롭고, 관련 법령·과세관청 해석에 따라 결과가 달라질 수 있는 영역입니다. 실행 전에 전문 자격사와 함께 적용 가능성과 리스크를 충분히 검토하는 것이 중요합니다.',
    faqs: [
      { q: '누구나 활용할 수 있나요?', a: '아니요. 지분 구조·주식 가치·자금 흐름에 따라 적용이 어려운 경우도 있어, 사전 검토가 먼저입니다.' },
      { q: '세무 리스크는 없나요?', a: '관련 법령과 과세관청 해석에 따라 달라질 수 있어, 전문 자격사와 함께 리스크를 검토한 후 진행 여부를 결정합니다.' },
      { q: '비용은 어떻게 되나요?', a: '지분 구조와 설계 범위에 따라 협의 후 결정됩니다.' },
    ],
    visualType: 'lab',
    imageSrc: '/assets/business-services/spouse-stock-retirement.png',
    notice:
      '본 서비스는 세무사 등 관련 분야 전문 자격사와 협업하여 진행합니다. 절세 효과와 적용 가능 여부는 기업 상황과 관련 법령·과세관청 해석에 따라 달라질 수 있으며, 특정 결과를 보장하지 않습니다.',
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
  'ai-ax-system': { title: 'AI 업무 자동화 프로그램', subtitle: '반복업무 자동화 · 상담 후 최종 견적', accent: 'cyan' },
  'ax-full-package': { title: 'AX 풀 패키지', subtitle: '회사의 모든 것, PC·폰에서 한눈에', accent: 'cyan' },
  'welfare-fund': { title: '근로복지기금', subtitle: '회사·직원 세금은 줄이고 복지는 늘리고', accent: 'cyan' },
  'rnd-center': { title: '기업부설연구소 설립', subtitle: '정부지원·정책자금 가점 확보', accent: 'slate' },
  'iso-certification': { title: 'ISO 인증 패키지', subtitle: '거래·입찰·수출 준비', accent: 'slate' },
  'mainbiz-certification': { title: '메인비즈 인증', subtitle: '경영혁신형 가점 확보', accent: 'slate' },
  'innobiz-certification': { title: '이노비즈 인증', subtitle: '기술혁신형 우대 확보', accent: 'slate' },
  'growth-roadmap-package': { title: '성장 로드맵 풀패키지', subtitle: '자금·인증·홈페이지·AI 한 번에', accent: 'blue' },
  'provisional-payment': { title: '가지급금 정리', subtitle: '원인 분석부터 계획적 정리까지', accent: 'indigo' },
  'retained-earnings': { title: '이익잉여금 처분 설계', subtitle: '배당·급여·퇴직금 조합 설계', accent: 'indigo' },
  'business-succession': { title: '가업승계 증여특례', subtitle: '요건 검토부터 지분 이전 플랜까지', accent: 'indigo' },
  'spouse-stock-retirement': { title: '배우자 증여 이익소각 설계', subtitle: '법인 자금 회수 구조 설계', accent: 'indigo' },
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
  '자금조달': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  '지원금': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15',
  '인증·절세': 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/15',
  'AX 컨설팅': 'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/15',
  '풀패키지': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/20',
  '법인 컨설팅': 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/15',
}
