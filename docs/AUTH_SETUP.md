# 회원 시스템 — 운영 설정 체크리스트

미래 AI 랩 회원 시스템(회원유형 · 소셜 로그인 · 휴대폰 인증 · 본인인증 준비) 설정 순서입니다.
**결제(PortOne)·관리자 기능과 완전히 분리**되어 있으며, 아래 설정 전에도 기존 기능은 정상 동작합니다.

---

## 0. DB 마이그레이션 (1회)

Supabase SQL Editor 에서 실행 (재실행 안전):

1. `supabase/schema.sql` (이미 실행했다면 생략)
2. **`supabase/member-system.sql`**
   - `profiles` 확장: `member_type`, `phone_verified`, `identity_verified`, `identity_provider`, `identity_ci`, `identity_verified_at`, `phone_verified_at`
   - `handle_new_user()` 갱신: 메타데이터의 `member_type` 반영 (관리자 이메일 → role=admin 은 그대로)
   - `phone_verifications` 테이블 (SMS 인증 기록, service_role 전용)

> 회원유형(member_type)은 권한(role: user/admin)과 **별개 축**입니다. 관리자는 member_type 이 null 이어도 됩니다.

## 1. 소셜 로그인 (Google / Kakao)

Supabase 대시보드 → **Authentication → Providers** 에서 설정합니다. (코드는 이미 연동 완료)

### Google
1. Google Cloud Console → OAuth 2.0 클라이언트 ID 생성 (웹 애플리케이션)
2. 승인된 리디렉션 URI: `https://<프로젝트ref>.supabase.co/auth/v1/callback`
3. Supabase → Providers → Google → Client ID / Secret 입력 후 Enable

### Kakao
1. [Kakao Developers](https://developers.kakao.com) → 애플리케이션 생성
2. 카카오 로그인 활성화 → Redirect URI: `https://<프로젝트ref>.supabase.co/auth/v1/callback`
3. 보안 → Client Secret 발급, 동의항목에서 필요한 정보(닉네임 등) 설정
4. Supabase → Providers → Kakao → REST API 키(Client ID) / Client Secret 입력 후 Enable

### 리디렉션 URL 허용
Supabase → Authentication → URL Configuration → **Redirect URLs** 에 아래 추가:
`https://<배포도메인>/welcome`

> 로그인/회원가입 후 앱은 `/welcome` 으로 복귀합니다. 회원유형이 없으면(소셜 신규) 온보딩(회원유형+휴대폰 인증),
> 있으면 회원유형별 홈으로 이동합니다.

## 2. 휴대폰 SMS 인증

서버리스 `api/phone-verification.ts` 가 처리합니다. 필요 환경변수 (Vercel → Environment Variables):

| 변수 | 값 | 공개 |
|---|---|---|
| `VITE_SUPABASE_URL` (또는 `SUPABASE_URL`) | Supabase URL | 서버 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 | **서버 전용** (⚠️ VITE_ 금지) |
| `PHONE_VERIFY_SALT` | (선택) 코드 해시 솔트 | **서버 전용** |
| `SMS_PROVIDER` / `SMS_API_KEY` | (미구현·TODO) 실제 SMS 발송 provider | **서버 전용** |

- **⚠️ 현재 실제 SMS 발송 provider 는 미연동(TODO)** 입니다. provider 미설정 시 **테스트모드**로 동작하며
  인증번호를 응답(devCode)으로 반환해 플로우를 확인할 수 있습니다.
- **운영 전환 전 반드시** SOLAPI/NHN/Twilio 등 SMS provider 를 `api/phone-verification.ts` 의 `TODO(SMS)` 지점에
  연결하고, 테스트모드 응답(devCode)이 비활성화되는지 확인하세요(provider 설정 시 자동 비활성).
- 설정 확인: 브라우저에서 `GET /api/phone-verification` → `supabaseConfigured / smsConfigured / testMode` 확인.

### 인증 흐름
1. `send` — 번호 입력 → 6자리 코드 발송(해시만 저장, 평문 미저장). 3분 유효, 1분 3회·1시간 10회 제한.
2. `verify` — 코드 검증(최대 5회 시도).
3. `confirm` — 가입/로그인 세션(access token)으로 본인 확인 → `profiles.phone_verified=true` 세팅(서버 강제).

## 3. PASS 본인인증 (준비 — TODO)

`src/lib/identityVerification.ts` 에 `IdentityVerificationService` 인터페이스와 `PortOnePassIdentityService`
스켈레톤이 있습니다. 실제 PASS 연동은 다음만 채우면 됩니다(결제 PortOne 패턴과 동일):

- `start()` — PortOne 브라우저 SDK `requestIdentityVerification(...)` 호출 → identityVerificationId 반환 `TODO(PASS)`
- `confirm()` — 서버가 PortOne `GET /identity-verifications/{id}` 단건조회로 검증 후
  `profiles.identity_verified / identity_provider / identity_ci / identity_verified_at` 세팅(service_role) `TODO(PASS)`

인증 상태 화면은 `/welcome`(AccountSetupPage)의 "인증 상태" 카드에 이미 표시됩니다(현재 PASS 는 "준비 중").

## 4. 비회원 / 회원 경계

- **비회원(로그인 없이) 가능**: 무료 성장진단, 상품 보기, 상담 신청
- **로그인 필요**: 결제, 계약·결제 내역 조회, (추후) PDF 다운로드, 상담내역 조회
  - 해당 동작 앞에서 `LoginModal` 이 표시되고, 로그인 후 원래 경로(`?redirect=`)로 복귀합니다.
  - PortOne 결제 API(prepare/complete/webhook)는 변경되지 않았습니다 — 클라이언트 로그인 게이트만 추가.

## 5. 회귀 체크 (변경 없음 보장)

- 결제(PortOne) prepare/complete/webhook, 관리자 인증(Bearer→role=admin), 결제 통계/정책 코드는 **미변경**.
- 관리자 계정(`sanghohoho0813@gmail.com`)은 기존과 동일하게 role=admin 자동 부여.
