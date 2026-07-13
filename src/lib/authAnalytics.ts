// 인증 퍼널 이벤트 — 민감정보(이름·이메일·전화·생년월일·비밀번호·인증원문) 절대 미포함.
// payload 는 provider / role / failureCategory / elapsedSeconds 만 서버(auth_audit_logs)에 저장됩니다.

export type AuthEvent =
  | 'signup_page_viewed' | 'signup_role_selected'
  | 'oauth_started' | 'oauth_succeeded' | 'oauth_failed'
  | 'identity_started' | 'identity_succeeded' | 'identity_failed'
  | 'terms_agreed' | 'signup_submitted' | 'signup_completed' | 'onboarding_abandoned'
  | 'login_succeeded' | 'login_failed' | 'password_reset_requested'

export function trackAuthEvent(
  event: AuthEvent,
  payload?: { provider?: 'google' | 'kakao' | 'email' | 'portone'; role?: 'ceo' | 'consultant'; failureCategory?: string; elapsedSeconds?: number },
): void {
  try {
    void fetch('/api/identity', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'track', event, ...payload }),
      keepalive: true,
    }).catch(() => {})
  } catch { /* 추적 실패는 무시 */ }
}
