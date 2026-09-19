// 사이트 내 상담 신청/문의 폼 → /api/consult (Resend 이메일) 클라이언트.
// 담긴 상품·선택 옵션·진단 체크 항목 등을 context 로 함께 실어 관리자 지메일로 보냅니다.
import { businessPackages } from '../data/businessPackages'

export type ConsultContextRow = { label: string; value: string }

// 상담 희망 분야 — 서비스몰 6개 상황형 목차, 각 목차 안에 실제 상품(썸네일 포함)까지 노출.
// 목차(카테고리) → 해당 카테고리 상품 목록을 자동으로 묶습니다.
export type ConsultProduct = { slug: string; name: string; imageSrc?: string }
export type ConsultTopicGroup = { title: string; category: string; products: ConsultProduct[] }

const SCENARIO_BY_CATEGORY: { title: string; category: string }[] = [
  { title: '저금리로 자금 조달이 필요해요', category: '자금조달' },
  { title: '정부 지원금, 놓치지 않고 받고 싶어요', category: '지원금' },
  { title: '대외 신뢰도·가점·세금 혜택까지 챙기고 싶어요', category: '인증·절세' },
  { title: 'AI 시대에 뒤처지지 않는 회사로 만들고 싶어요', category: 'AX 컨설팅' },
  { title: '믿을 만한 파트너가 늘 함께했으면 해요', category: '풀패키지' },
  { title: '세금은 줄이고, 회사의 부를 제대로 옮기고 싶어요', category: '법인 컨설팅' },
]

export const CONSULT_TOPIC_GROUPS: ConsultTopicGroup[] = SCENARIO_BY_CATEGORY.map((s) => ({
  title: s.title,
  category: s.category,
  products: businessPackages
    .filter((p) => p.category === s.category)
    .map((p) => ({ slug: p.slug, name: p.name, imageSrc: p.imageSrc })),
}))

/** 상품 slug 로 그 상품이 속한 상황 목차 제목을 찾습니다. */
export function scenarioForSlug(slug?: string): string | undefined {
  if (!slug) return undefined
  return CONSULT_TOPIC_GROUPS.find((g) => g.products.some((p) => p.slug === slug))?.title
}

// 상담 희망 방식 — 전화 / 카톡·문자 두 가지만.
export const CONSULT_METHODS = ['전화', '카톡·문자'] as const

// 기업 규모 파악용 선택 항목 (구글폼과 동일 축) — 모두 단일 선택·선택 사항. 업력을 업종 앞에.
export const CONSULT_COMPANY_FIELDS: { key: string; label: string; options: string[] }[] = [
  { key: '업력', label: '업력', options: ['예비창업자(창업 전)', '1년 미만', '1~3년', '3~5년', '5~7년', '7년 이상'] },
  { key: '업종', label: '업종', options: ['제조', '도소매', 'IT', '서비스', '기타'] },
  { key: '연매출', label: '연매출', options: ['1억 이하', '5억 이하', '20억 이하', '20억 이상'] },
  { key: '직원 수', label: '직원 수(4대보험)', options: ['5명 미만', '5~10명', '10~20명', '20명 이상'] },
  { key: '지역', label: '사업장 지역', options: ['서울', '경기', '강원', '충청', '전라', '경상', '그 외'] },
]

/**
 * 함께 검토하고 싶은 분야 — 썸네일·가격 없이, "무엇이 필요한 상황인가" 로 목차를 나누고
 * 항목 옆에 핵심 혜택 한 줄만 붙인다. AX Fit 결과화면·AX Fit 상담 폼·일반 상담 모달이 같은 목록을 쓴다.
 *
 * ⚠️ note 는 제도 일반 정보다. 미래AI랩의 성과로 읽히지 않게 쓰고, 승인·선정·취득을 단정하지 않는다.
 *    (요건 충족 시 / 가점 / 대상 처럼 조건을 남긴다.)
 * ⚠️ 서버는 interests 항목을 30자까지만 저장하고, '정책|R&D|성장' 이 있으면 growth_interest 플래그를 붙인다.
 */
export type ConsultInterestTone = 'blue' | 'sky' | 'emerald' | 'amber' | 'orange' | 'violet'
export type ConsultInterestItem = { name: string; note: string }
export type ConsultInterestGroup = {
  /** 화면·메일에 함께 쓰는 번호 */
  no: number
  title: string
  /** 목차 제목 옆 괄호 안내 (전문가 협업이 필요한 분야에 붙인다) */
  hint?: string
  tone: ConsultInterestTone
  items: ConsultInterestItem[]
}

export const CONSULT_INTEREST_GROUPS: ConsultInterestGroup[] = [
  {
    no: 1,
    title: '연 2%대 · 최대 10억 — 성장자금이 필요하다면',
    tone: 'blue',
    items: [{ name: '정책자금', note: '연 2%대 저금리 · 최대 10억 원' }],
  },
  {
    no: 2,
    title: '정부지원사업 · 정부지원금을 놓치고 있다면',
    tone: 'sky',
    items: [
      { name: '정부지원사업', note: '사업화·판로·마케팅 지원금 공고 대응' },
      { name: 'R&D 과제', note: '개발비 일부를 정부가 부담' },
      { name: '고용지원금', note: '신규채용 · 고용유지 · 육아대체 인력 지원제도' },
    ],
  },
  {
    no: 3,
    title: '외부에서 볼 때 좋은 회사로 보이고 싶다면',
    tone: 'emerald',
    items: [
      { name: '벤처기업 인증', note: '창업 3년 이내 확인 시 법인세·소득세 5년 50% 감면(요건 충족 시)' },
      { name: '기업부설연구소', note: '정책자금·정부지원사업 가점 · R&D 세액공제 대상' },
      // 기존 목록에 없던 항목 — 기술사업·MVP 유입에서 가장 자주 함께 묻는 분야라 추가한다.
      // 등록·권리화 결과를 단정하지 않는다(출원과 등록은 다르다).
      { name: '특허·IP', note: '만든 기술을 출원으로 남겨 두는 방향 검토' },
      { name: '이노비즈 인증', note: '기술혁신형 — 정책자금 우대 · 정부지원사업 선정 가점' },
      { name: '메인비즈 인증', note: '경영혁신형 — 정책자금 우대평가 · 선정 가점' },
      { name: 'ISO 인증', note: '9001·14001·45001 — 대기업 거래 · 공공입찰 · 수출 준비' },
    ],
  },
  {
    no: 4,
    title: '사람을 뽑고, 오래 다니게 하고 싶다면',
    tone: 'amber',
    items: [
      { name: '사내(공동)근로복지기금', note: '출연금 손금 인정 · 직원 복지는 늘리고 세부담은 낮추는 구조' },
    ],
  },
  {
    no: 5,
    title: '일하는 방식을 바꾸고 싶다면',
    tone: 'orange',
    items: [
      { name: 'AX 풀 패키지', note: '회사 돌아가는 모든 것을 내 PC·스마트폰에서 한눈에' },
      { name: '소형 업무자동화', note: 'AX까지는 아니어도, 반복업무 하나만 빠르게 자동화' },
      { name: '사업화 아이디어 MVP', note: '아이디어를 최소 기능 제품으로 먼저 검증' },
      { name: '반응형 홈페이지', note: '24시간 일하는 온라인 영업사원' },
    ],
  },
  {
    no: 6,
    title: '세금을 줄이고 회사 자산을 정리하고 싶다면',
    hint: '세무사 등 각 분야 전문가와 함께 검토',
    tone: 'violet',
    items: [
      { name: '가지급금 정리', note: '쌓인 가지급금, 세부담이 커지기 전에 계획적으로' },
      { name: '이익잉여금 처분', note: '배당·급여·퇴직금 조합으로 계획 있게' },
      { name: '가업승계 증여특례', note: '자녀에게 물려줄 회사, 증여세 과세특례로 준비' },
      { name: '배우자 증여 이익소각', note: '배우자 증여공제를 활용한 법인 자금 회수 설계' },
    ],
  },
]

/**
 * 아직 고르기 어려운 분들을 위한 항목 — 목차 밖에 따로 둔다.
 * ⚠️ 다른 구체 항목과 함께 고를 수 없다(상호배타). 처리는 InterestPicker 한곳에서 한다.
 */
export const CONSULT_INTEREST_UNSURE = '아직 모르겠음'

/** 위 목록을 평평하게 편 이름만 — 저장·판정용 */
export const CONSULT_INTEREST_AREAS: readonly string[] = [
  ...CONSULT_INTEREST_GROUPS.flatMap((g) => g.items.map((i) => i.name)),
  CONSULT_INTEREST_UNSURE,
]

/** 분야 목록 아래에 항상 붙이는 안내 — 제도 일반 정보임을 분명히 한다 */
export const CONSULT_INTEREST_NOTE =
  '위 내용은 제도에 대한 일반 정보이며 특정 결과(승인·선정·취득·감면)를 보장하지 않습니다. 금리·한도·감면 여부는 업종·설립일·재무상태와 신청 시점의 법령·공고, 기관 심사에 따라 달라집니다.'

export type ConsultPayload = {
  name: string
  contact: string
  company?: string
  message?: string
  /** 신청 경로(사람이 읽는 라벨) 예: '정책자금 컨설팅 상세', '장바구니', '진단 결과 추천' */
  source: string
  /** 담긴 상품/선택 옵션/체크 항목 등 (이메일에 표로 표시) */
  context?: ConsultContextRow[]
  /** 구조화 응답(진행방식·자금계획·AX 문항·동의) — 서버에서 Supabase consult_leads 에 저장 */
  structured?: Record<string, unknown>
}

export type ConsultResult = { ok: boolean; message: string }

const SUCCESS_FALLBACK = '상담 신청이 접수되었습니다. 확인 후 빠르게 연락드리겠습니다.'

export async function submitConsult(payload: ConsultPayload): Promise<ConsultResult> {
  const body = {
    ...payload,
    page: typeof window !== 'undefined' ? window.location.href : undefined,
  }
  const res = await fetch('/api/consult', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; debugCode?: string }
  if (!res.ok || data.ok === false) {
    const code = data.debugCode ? ` [${data.debugCode}]` : ''
    throw new Error(data.message ? `${data.message}${code}` : `요청 실패 (HTTP ${res.status})`)
  }
  return { ok: true, message: data.message || SUCCESS_FALLBACK }
}
