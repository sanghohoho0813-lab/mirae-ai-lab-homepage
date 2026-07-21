// 사이트 내 상담 신청/문의 폼 → /api/consult (Resend 이메일) 클라이언트.
// 담긴 상품·선택 옵션·진단 체크 항목 등을 context 로 함께 실어 관리자 지메일로 보냅니다.

export type ConsultContextRow = { label: string; value: string }

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
