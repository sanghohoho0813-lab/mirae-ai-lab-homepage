// PortOne V2 본인인증(통신사 PASS) 클라이언트 — 실제 연동.
// 흐름: prepare(서버가 ID 생성) → PortOne 인증창(browser-sdk) → verify(서버가 PortOne 재조회)
//       → (가입/로그인 후) attach(서버가 profiles 인증 필드 확정)
// 클라이언트 결과는 신뢰하지 않으며, verify/attach 의 서버 판정만 사용합니다.
// 채널키(VITE_PORTONE_IDENTITY_CHANNEL_KEY) 미설정 시 서버가 503 으로 차단합니다(가짜 성공 없음).

export type IdentityHealth = {
  identityConfigured: boolean
  required: boolean
  environment: 'test' | 'live'
  supabaseConfigured: boolean
}

export type IdentityVerified = { id: string; name: string; phone: string }

export type IdentityStartResult =
  | { ok: true; verified: IdentityVerified }
  | { ok: false; error: string; notConfigured?: boolean; cancelled?: boolean }

async function post<T>(body: unknown): Promise<T & { ok: boolean; message?: string; notConfigured?: boolean }> {
  const res = await fetch('/api/identity', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  return (await res.json().catch(() => ({ ok: false, message: '요청을 처리하지 못했습니다.' }))) as T & {
    ok: boolean; message?: string; notConfigured?: boolean
  }
}

/** 서버 설정 상태 — 화면에서 fail-closed 판단에 사용 */
export async function getIdentityHealth(): Promise<IdentityHealth | null> {
  try {
    const res = await fetch('/api/identity')
    if (!res.ok) return null
    const j = (await res.json()) as IdentityHealth & { ok: boolean }
    return j.ok ? j : null
  } catch {
    return null
  }
}

/** 가입 전 임시 세션 ID (레이트리밋·복구용, 개인정보 아님) */
function tempSessionId(): string {
  const KEY = 'miraeIdvSession'
  try {
    let v = sessionStorage.getItem(KEY)
    if (!v) {
      v = `s-${crypto.randomUUID()}`
      sessionStorage.setItem(KEY, v)
    }
    return v
  } catch {
    return 's-fallback'
  }
}

const LAST_IDV_KEY = 'miraeIdvId' // 인증 요청 ID 만 저장 (이름·전화·원문은 저장하지 않음)

/**
 * 본인인증 전체 실행: prepare → PortOne 창 → verify.
 * 성공 시 서버가 검증한 이름·휴대폰을 반환 (화면 자동입력·읽기전용 표시용).
 */
export async function runIdentityVerification(): Promise<IdentityStartResult> {
  // 1) 서버 prepare — 인증 요청 ID 는 서버가 생성
  const prep = await post<{ identityVerificationId: string; storeId: string; channelKey: string }>(
    { action: 'prepare', sessionId: tempSessionId() },
  )
  if (!prep.ok) {
    return { ok: false, error: prep.message ?? '본인인증을 시작하지 못했습니다.', notConfigured: prep.notConfigured }
  }

  // 2) PortOne 본인인증 창 (browser-sdk v2 공식 메서드)
  try {
    const { requestIdentityVerification } = await import('@portone/browser-sdk/v2')
    const resp = await requestIdentityVerification({
      storeId: prep.storeId,
      identityVerificationId: prep.identityVerificationId,
      channelKey: prep.channelKey,
      // 모바일 리디렉션 환경 대비 — 복귀 후 sessionStorage 의 ID 로 status 복구
      redirectUrl: `${window.location.origin}${window.location.pathname}`,
    })
    if (resp?.code) {
      const cancelled = /cancel/i.test(String(resp.code)) || /취소/.test(String(resp.message ?? ''))
      return cancelled
        ? { ok: false, error: '본인인증이 취소되었습니다.', cancelled: true }
        : { ok: false, error: '본인인증을 완료하지 못했습니다. 다시 시도해주세요.' }
    }
  } catch {
    return { ok: false, error: '본인인증 창을 열지 못했습니다. 잠시 후 다시 시도해주세요.' }
  }

  // 3) 서버 verify — PortOne 단건조회 재검증 (유일한 신뢰 경로)
  const ver = await post<{ name: string; phone: string }>({ action: 'verify', identityVerificationId: prep.identityVerificationId })
  if (!ver.ok) return { ok: false, error: ver.message ?? '본인인증 확인에 실패했습니다.' }

  try { sessionStorage.setItem(LAST_IDV_KEY, prep.identityVerificationId) } catch { /* ignore */ }
  return { ok: true, verified: { id: prep.identityVerificationId, name: ver.name, phone: ver.phone } }
}

/** 뒤로가기·새로고침 복구 — 유효한(미사용·미만료) 인증이 있으면 재인증 없이 이어서 진행 */
export async function recoverIdentityVerification(): Promise<IdentityVerified | null> {
  let id: string | null = null
  try { id = sessionStorage.getItem(LAST_IDV_KEY) } catch { /* ignore */ }
  if (!id) return null
  const st = await post<{ status: string; name?: string; phone?: string }>({ action: 'status', identityVerificationId: id })
  if (st.ok && st.status === 'verified' && st.name && st.phone) return { id, name: st.name, phone: st.phone }
  try { sessionStorage.removeItem(LAST_IDV_KEY) } catch { /* ignore */ }
  return null
}

/** 가입/로그인 세션에 인증 결과 연결 — profiles 인증 필드는 서버만 세팅 */
export async function attachIdentityToUser(identityVerificationId: string, accessToken: string): Promise<{ ok: boolean; error?: string }> {
  const r = await post({ action: 'attach', identityVerificationId, accessToken })
  if (r.ok) {
    try { sessionStorage.removeItem(LAST_IDV_KEY) } catch { /* ignore */ }
    return { ok: true }
  }
  return { ok: false, error: r.message ?? '인증 정보를 연결하지 못했습니다.' }
}

/** 약관 동의 기록 */
export async function recordConsents(
  accessToken: string,
  consents: { key: string; version: string; agreed: boolean }[],
): Promise<{ ok: boolean; error?: string }> {
  const r = await post({ action: 'consent', accessToken, consents })
  return r.ok ? { ok: true } : { ok: false, error: r.message }
}

/**
 * 온보딩 완료 판정 요청 (역할+본인인증+필수동의 서버 검증).
 * consents 를 함께 넘기면 서버가 같은 요청에서 동의를 먼저 저장한 뒤 필수동의를 검증한다
 * (동의 기록과 완료 판정을 원자적으로 처리 — 별도 요청의 조용한 실패·경합 방지).
 */
export async function completeOnboarding(
  accessToken: string,
  role: 'ceo' | 'consultant',
  consents?: { key: string; version: string; agreed: boolean }[],
): Promise<{ ok: boolean; roles?: string[]; error?: string; notConfigured?: boolean; debugCode?: string }> {
  const r = await post<{ roles: string[]; debugCode?: string }>({ action: 'complete', accessToken, role, consents })
  return r.ok
    ? { ok: true, roles: r.roles }
    : { ok: false, error: r.message, notConfigured: r.notConfigured, debugCode: r.debugCode }
}

/** 서버가 반환한 debugCode 가 '약관 동의' 관련 오류인지 — 클라이언트/서버 오류를 분리해 표시하기 위함 */
export function isConsentServerError(debugCode?: string): boolean {
  return debugCode === 'consent_missing' || debugCode === 'consent_save_failed' || debugCode === 'consent_bad_key'
}

/** 두 번째 역할 추가 (내 계정) */
export async function addRole(accessToken: string, role: 'ceo' | 'consultant'): Promise<{ ok: boolean; roles?: string[]; error?: string }> {
  const r = await post<{ roles: string[] }>({ action: 'add_role', accessToken, role })
  return r.ok ? { ok: true, roles: r.roles } : { ok: false, error: r.message }
}

/** 비회원 진단기록 → 계정 연결 (sessionToken 기준 멱등) */
export async function migrateGuestDiagnoses(accessToken: string, sessionTokens: string[]): Promise<number> {
  if (sessionTokens.length === 0) return 0
  const r = await post<{ claimed: number }>({ action: 'migrate_diagnosis', accessToken, sessionTokens })
  return r.ok ? (r as { claimed?: number }).claimed ?? 0 : 0
}
