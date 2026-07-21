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

export type ConsultPayload = {
  name: string
  contact: string
  company?: string
  message?: string
  /** 신청 경로(사람이 읽는 라벨) 예: '정책자금 컨설팅 상세', '장바구니', '진단 결과 추천' */
  source: string
  /** 담긴 상품/선택 옵션/체크 항목 등 (이메일에 표로 표시) */
  context?: ConsultContextRow[]
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
