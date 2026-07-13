// 휴대폰 SMS 인증 클라이언트 — 서버리스 /api/phone-verification 호출.
// send: 인증번호 발송 / verify: 코드 검증 / confirm: 가입 후 profiles.phone_verified 서버 세팅.
// 실제 SMS 발송은 서버에서 처리(미설정 시 테스트모드로 devCode 반환). PASS 는 identityVerification.ts 참고.

export type SendResult =
  | { ok: true; expiresInSec: number; devCode?: string; testMode?: boolean }
  | { ok: false; error: string }

export type VerifyResult = { ok: true } | { ok: false; error: string; remainingAttempts?: number }

export type ConfirmResult = { ok: true } | { ok: false; error: string }

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

export function isValidKoreanMobile(phone: string): boolean {
  const p = normalizePhone(phone)
  return /^01[016789][0-9]{7,8}$/.test(p)
}

async function post<T>(body: unknown): Promise<T | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/phone-verification', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as T & { ok?: boolean; message?: string }
    if (!res.ok && (json as { ok?: boolean }).ok !== true) {
      return { ok: false, error: (json as { message?: string }).message ?? '요청을 처리하지 못했습니다.' }
    }
    return json as T
  } catch {
    return { ok: false, error: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  }
}

/** 1) 인증번호 발송 */
export async function sendPhoneCode(phone: string, purpose: 'signup' | 'identity' = 'signup'): Promise<SendResult> {
  if (!isValidKoreanMobile(phone)) return { ok: false, error: '휴대폰 번호 형식을 확인해주세요.' }
  return post<SendResult>({ action: 'send', phone: normalizePhone(phone), purpose })
}

/** 2) 인증번호 검증 */
export async function verifyPhoneCode(phone: string, code: string): Promise<VerifyResult> {
  return post<VerifyResult>({ action: 'verify', phone: normalizePhone(phone), code: code.trim() })
}

/**
 * 3) 가입/로그인(세션 보유) 이후 서버에 phone_verified 확정 요청.
 * accessToken(Supabase 세션)로 본인 확인 후 서버가 profiles.phone_verified=true 세팅.
 */
export async function confirmPhoneVerified(phone: string, accessToken: string): Promise<ConfirmResult> {
  return post<ConfirmResult>({ action: 'confirm', phone: normalizePhone(phone), accessToken })
}
