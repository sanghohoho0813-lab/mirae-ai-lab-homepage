// 서버로 보내는 요청의 공통 처리 — 상담카드(/api/consult)와 3분 진단(/api/business-diagnosis)이 함께 쓴다.
//
// 지키는 것
//  - 응답이 없으면 15초 뒤 멈추고 알린다. 예전엔 모바일에서 망이 흔들리면 버튼이 '보내는 중'에 영원히 묶였다.
//  - 인터넷 끊김 / 시간 초과 / 서버 오류 / 입력 확인 필요를 구분해 한국어로 안내한다.
//  - 영어 원문(Failed to fetch)·HTTP 번호·내부 코드(debugCode)는 화면에 내지 않고 콘솔에만 남긴다.
//  - 입력 오류(4xx)에 서버가 보낸 한국어 안내("올바른 휴대전화번호를 입력해주세요.")는 그대로 살린다.
export type ApiErrorKind = 'offline' | 'timeout' | 'server' | 'invalid'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  constructor(kind: ApiErrorKind, message: string) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
  }
}

export const API_TIMEOUT_MS = 15_000

const MSG: Record<Exclude<ApiErrorKind, 'invalid'>, string> = {
  offline: '인터넷 연결이 불안정해 보내지 못했어요. 연결을 확인한 뒤 다시 눌러 주세요.',
  timeout: '응답이 너무 늦어 멈췄어요. 잠시 후 다시 눌러 주세요.',
  server: '서버에 잠시 문제가 있어 보내지 못했어요. 잠시 후 다시 눌러 주세요.',
}

/** 사람에게 그대로 보여줘도 되는 한국어 문장인지 — 영문 식별자·코드·괄호 설명이 섞였으면 아니다 */
function isHumanKorean(s: unknown): s is string {
  return typeof s === 'string' && /[가-힣]/.test(s) && !/[A-Z_]{3,}|HTTP|JSON|\[|\(서버|모듈/.test(s)
}

export async function postJson<T extends Record<string, unknown>>(url: string, body: unknown, timeoutMs = API_TIMEOUT_MS): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    let res: Response
    try {
      res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal })
    } catch (e) {
      console.warn('[api]', url, e)
      if (ctrl.signal.aborted) throw new ApiError('timeout', MSG.timeout)
      throw new ApiError('offline', MSG.offline)
    }

    let data: Record<string, unknown> | null = null
    try {
      data = (await res.json()) as Record<string, unknown>
    } catch (e) {
      // 본문이 끊겼거나(시간 초과) HTML 오류 페이지 등 JSON 이 아닌 응답
      if (ctrl.signal.aborted) throw new ApiError('timeout', MSG.timeout)
      if (res.ok) {
        console.warn('[api]', url, 'JSON 아님', e)
        throw new ApiError('server', MSG.server)
      }
    }

    if (!res.ok || data?.ok === false) {
      console.warn('[api]', url, `HTTP ${res.status}`, data?.debugCode ?? '', data?.message ?? '')
      if (res.status >= 400 && res.status < 500 && isHumanKorean(data?.message)) throw new ApiError('invalid', data.message)
      throw new ApiError('server', MSG.server)
    }
    return (data ?? {}) as T
  } finally {
    clearTimeout(timer)
  }
}
