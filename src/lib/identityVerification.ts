// 본인인증(Identity Verification) 서비스 인터페이스.
// 1차: 휴대폰 SMS 인증(phoneVerification.ts)만 사용.
// 추후: PortOne PASS 본인인증을 이 인터페이스 구현체로 갈아끼우기만 하면 되도록 분리해 둡니다.
//   - 화면/플로우는 이 인터페이스에만 의존 → 실제 provider 교체 시 UI 수정 불필요.
//   - 실제 PASS 호출부는 아래 TODO 로 표시.

export type IdentityLevel = 'none' | 'phone' | 'identity'

export type IdentityStatus = {
  /** 휴대폰 SMS 인증 완료 */
  phoneVerified: boolean
  /** PASS 등 실명 본인인증 완료 */
  identityVerified: boolean
  provider?: string | null
  verifiedAt?: string | null
}

export type IdentityStartResult =
  | { ok: true; verificationId: string }
  | { ok: false; error: string }

export type IdentityResult =
  | { ok: true; provider: string; ci?: string }
  | { ok: false; error: string }

/** 본인인증 서비스 공통 인터페이스 (SMS / PASS 공용) */
export interface IdentityVerificationService {
  readonly provider: string
  /** 인증 시작 (SMS 발송 / PASS 창 오픈 등) */
  start(input: { phone?: string; purpose?: 'signup' | 'identity' }): Promise<IdentityStartResult>
  /** 인증 확인 (SMS 코드 검증 / PASS 콜백 결과 확인) */
  confirm(input: { verificationId: string; code?: string }): Promise<IdentityResult>
}

/**
 * PortOne PASS 본인인증 구현체 (스켈레톤).
 * ⚠️ 실제 PASS 연동은 아직 미구현 — 아래 TODO 지점만 채우면 동작하도록 설계했습니다.
 * PortOne 본인인증(SDK `requestIdentityVerification`) + 서버 단건조회 검증 패턴을 결제와 동일하게 사용할 예정.
 */
export class PortOnePassIdentityService implements IdentityVerificationService {
  readonly provider = 'portone_pass'

  async start(_input: { phone?: string; purpose?: 'signup' | 'identity' }): Promise<IdentityStartResult> {
    // TODO(PASS): PortOne 브라우저 SDK `requestIdentityVerification({ storeId, identityVerificationId, channelKey })` 호출
    //             → identityVerificationId 반환. (결제의 requestPayment 와 동일한 구조)
    return { ok: false, error: 'PASS 본인인증은 준비 중입니다. 현재는 휴대폰 SMS 인증을 사용해 주세요.' }
  }

  async confirm(_input: { verificationId: string; code?: string }): Promise<IdentityResult> {
    // TODO(PASS): 서버 API 가 PortOne `GET /identity-verifications/{id}` 단건조회로 status=VERIFIED 확인 후
    //             profiles.identity_verified / identity_provider / identity_ci / identity_verified_at 세팅(service_role).
    return { ok: false, error: 'PASS 본인인증은 준비 중입니다.' }
  }
}

/** 현재 활성 본인인증 서비스 (추후 PASS 로 교체) */
export const identityService: IdentityVerificationService = new PortOnePassIdentityService()

export function identityLevelOf(status: IdentityStatus): IdentityLevel {
  if (status.identityVerified) return 'identity'
  if (status.phoneVerified) return 'phone'
  return 'none'
}
