// 사이트 내 상담 신청/문의 폼 → /api/consult (Resend 이메일) 클라이언트.
// 담긴 상품·선택 옵션·진단 체크 항목 등을 context 로 함께 실어 관리자 지메일로 보냅니다.

export type ConsultContextRow = { label: string; value: string }

// 상담 신청 시 고를 수 있는 상담 분야 — 진단 투트랙처럼 목적별로 묶고, 그 안에서 복수 선택.
// 각 페이지는 자기 주제를 fixedTopic 으로 고정하고, 아래 그룹에서 추가로 고를 수 있습니다.
export type ConsultTopicGroup = { title: string; desc?: string; options: string[] }

export const CONSULT_TOPIC_GROUPS: ConsultTopicGroup[] = [
  {
    title: '💰 자금을 확보하고 싶어요',
    desc: '정책자금·정부지원금·고용지원금',
    options: ['정책자금 (대출)', '정부지원사업 (무상지원금)', '고용지원금'],
  },
  {
    title: '📉 세금은 줄이고, 자산은 지키고 싶어요',
    desc: '절세·가업승계·자본거래',
    options: ['법인 절세·세무 전략', '가업승계·자산 이전', '이익소각·자사주·배당'],
  },
  {
    title: '🚀 회사를 더 단단하게 키우고 싶어요',
    desc: '인증·AX·종합 관리',
    options: ['기업인증 (벤처·이노비즈·ISO)', 'AX·홈페이지·업무자동화', '종합 컨설팅 (자금+인증+절세)'],
  },
]

// 기업 규모 파악용 선택 항목 (구글폼과 동일 축) — 모두 단일 선택·선택 사항.
export const CONSULT_COMPANY_FIELDS: { key: string; label: string; options: string[] }[] = [
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
