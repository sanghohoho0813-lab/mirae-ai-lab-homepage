# 회원가입·로그인·본인인증 — 운영자 설정 가이드

코드는 실연동 가능한 상태까지 완성되어 있습니다. 아래 콘솔 설정을 마쳐야 실제로 동작하며,
**설정 전에는 가짜 성공 없이 안전하게 차단**됩니다(소셜 버튼 → 한국어 안내 / 신규가입 → 준비 중 안내).

- 운영 URL: `https://ai-business-lab-delta.vercel.app`
- OAuth 복귀: `https://ai-business-lab-delta.vercel.app/auth/callback`
- Supabase 콜백(모든 Provider 공통): `https://<프로젝트ref>.supabase.co/auth/v1/callback`
  - `<프로젝트ref>` 는 Supabase 대시보드 주소(`https://supabase.com/dashboard/project/<프로젝트ref>`)에서 확인

---

## A. Supabase — Google Provider

1. **Google Cloud Console** (<https://console.cloud.google.com>)
   1. 프로젝트 선택(없으면 새 프로젝트) → 좌측 메뉴 **APIs & Services → OAuth consent screen**
      - User Type: **External** → 앱 이름·지원 이메일 입력 → 저장 (테스트 단계면 Test users 에 본인 이메일 추가)
   2. **APIs & Services → Credentials → + CREATE CREDENTIALS → OAuth client ID**
      - Application type: **Web application**
      - **Authorized JavaScript origins**:
        - `https://ai-business-lab-delta.vercel.app`
        - `https://<프로젝트ref>.supabase.co`
      - **Authorized redirect URIs**:
        - `https://<프로젝트ref>.supabase.co/auth/v1/callback`  ← 이것 하나면 됩니다
      - 만들기 → **Client ID / Client Secret 복사**
2. **Supabase Dashboard** → 프로젝트 → **Authentication → Providers → Google**
   - Enable 토글 ON → 위 Client ID / Client Secret 붙여넣기 → Save
3. **Authentication → URL Configuration**
   - **Site URL**: `https://ai-business-lab-delta.vercel.app`
   - **Redirect URLs** (allowlist) 에 추가:
     - `https://ai-business-lab-delta.vercel.app/auth/callback`
     - `https://ai-business-lab-delta.vercel.app/auth/reset-password`
     - (Preview 배포도 쓰려면) `https://*-ksh90813.vercel.app/auth/callback` 처럼 와일드카드 패턴 추가
       — Supabase Redirect URL 은 `*` 와일드카드 패턴을 지원합니다. Preview 도메인 형식은
       Vercel 프로젝트의 실제 Preview URL 을 보고 맞춰주세요.

## B. Supabase — Kakao Provider

현재 오류 `Unsupported provider: provider is not enabled` 는 **이 설정이 없어서** 발생하는 것으로,
코드 문제가 아닙니다.

1. **Kakao Developers** (<https://developers.kakao.com>) → 내 애플리케이션 → **애플리케이션 추가하기**
2. 앱 설정 → **플랫폼 → Web 플랫폼 등록** → 사이트 도메인: `https://ai-business-lab-delta.vercel.app`
3. 제품 설정 → **카카오 로그인 → 활성화 설정 ON**
   - **Redirect URI 등록**: `https://<프로젝트ref>.supabase.co/auth/v1/callback`
4. 제품 설정 → 카카오 로그인 → **동의항목** — ⚠️ **KOE205 해결의 핵심 (아래를 꼭 읽으세요)**

   > **왜 KOE205 가 나나요?** Supabase 의 관리형 Kakao provider(GoTrue)는 카카오에
   > `account_email`, `profile_image`, `profile_nickname` **세 가지 scope 를 항상 강제로 요청**합니다.
   > **프론트 코드(`options.scopes`)로는 이 기본 scope(특히 `account_email`)를 제거할 수 없습니다**(추가만 가능).
   > 따라서 이 세 항목이 카카오 콘솔의 **동의항목으로 등록되어 있지 않으면** KOE205(요청 scope 미설정)가 발생합니다.
   > → **해결책은 코드가 아니라, 카카오 콘솔에서 이 세 항목을 유효한 동의항목으로 만드는 것**입니다.

   **KOE205 를 없애려면 아래 3개 항목을 모두 동의항목으로 설정하세요:**
   - **닉네임(profile_nickname)** → "선택 동의" 로 설정 (비즈 앱 불필요, 카카오 로그인 활성화 시 보통 기본 포함)
   - **프로필 사진(profile_image)** → "선택 동의" 로 설정 (비즈 앱 불필요)
   - **카카오계정(이메일)(account_email)** → "선택 동의" 로 설정 — ⚠️ **비즈니스 앱 전환이 필요합니다.**
     - 카카오 콘솔 → **비즈니스 → 비즈니스 앱 전환** (사업자등록번호 `657-68-00733` 로 신청·검수)
     - 전환·검수 완료 후 account_email 을 "선택 동의" 로 추가하면 KOE205 가 사라집니다.
     - "선택 동의"이므로 사용자가 이메일 제공을 거부해도 로그인은 되고, 이 경우 사이트 **온보딩에서 이메일을
       직접 입력·확인**하는 폴백이 이미 구현되어 있습니다.

   **비즈니스 앱 전환을 지금 할 수 없다면?** — Supabase 관리형 provider 를 쓰는 한 account_email 강제 요청을
   막을 수 없으므로, 카카오 직접 OAuth(별도 서버리스 구현) 로 전환해야 합니다. 이는 별도 작업이 필요합니다
   (완료 보고의 "대안" 참고). 그 전까지는 **Google·이메일 로그인**으로 안내됩니다.

5. **Supabase Dashboard → Authentication → Providers → Kakao** 에서
   **"Allow users without an email"(또는 유사 항목)을 ON** — 이메일 없는(또는 이메일 미동의) 카카오 사용자 가입 허용.
   - `VITE_KAKAO_OAUTH_SCOPES` 는 위 3개 기본 scope 를 **줄이지 못하며**, 추가 scope 가 필요할 때만 사용합니다(선택).
6. 앱 설정 → **앱 키** 에서 **REST API 키** 확인 + 제품 설정 → 카카오 로그인 → **보안** 에서
   **Client Secret 생성 → 활성화(사용함)**
7. **Supabase Dashboard → Authentication → Providers → Kakao**
   - Enable ON
   - **Client ID = 카카오 REST API 키**
   - **Client Secret = 위에서 생성한 Client Secret**
   - Save
8. (선택) 카카오 scope 조정이 필요하면 Vercel 에 `VITE_KAKAO_OAUTH_SCOPES`(공백 구분) 등록 후 Redeploy.
9. 테스트 단계에서 카카오 앱이 "테스트" 상태면 팀원으로 등록된 카카오계정만 로그인됩니다.
   전체 공개하려면 카카오 앱을 **비즈 앱**으로 전환하세요.

## C. PortOne — 본인인증(통신사 PASS) 설정

⚠️ **전자결제(PG) 계약과 본인인증은 별도 서비스·별도 채널**입니다. 결제용 채널키를
본인인증에 재사용하면 안 됩니다(코드도 별도 변수를 사용합니다).

1. <https://admin.portone.io> 로그인
2. **결제 연동(연동 정보) → 채널 관리 → 채널 추가** 에서 서비스 종류를 **본인인증** 으로 선택
   - 인증 대행사(예: KG이니시스 통신사 본인인증, 다날 등)를 선택해 **테스트 채널** 먼저 생성
   - 실운영은 해당 인증 대행사와의 **본인확인 서비스 계약(신청)** 승인 후 실연동 채널 발급
   - 채널 목록에서 **채널 키(channel-key-…)** 복사
3. **API Secret**: 결제에 쓰는 `PORTONE_API_SECRET`(V2 API Secret)을 **그대로 재사용**합니다
   (V2 API Secret 은 상점 단위라 본인인증 단건조회에도 동일하게 사용 가능)
4. **웹훅**: 본인인증은 서버 단건조회(`GET /identity-verifications/{id}`) 방식이라 **별도 웹훅이 필요 없습니다**
5. Vercel 환경변수 등록(아래 E) 후 **Redeploy**
6. 테스트: `/signup` → 휴대폰 본인인증 클릭 → 테스트 인증창 → 이름·번호 자동입력 확인
   - 설정 상태 확인: 브라우저에서 `https://<도메인>/api/identity` → `identityConfigured: true` 확인

## D. Supabase SQL 실행 (SQL Editor)

실행 순서 (모두 재실행 안전):

1. `supabase/schema.sql` (기존 — 이미 실행했으면 생략)
2. `supabase/billing-policy-foundation.sql` (기존 — user_roles 등)
3. `supabase/member-system.sql` (기존)
4. **`supabase/auth-identity-foundation.sql`** ← 이번 신규
   - profiles 온보딩 컬럼 + 기존 회원 '가입완료' 백필
   - identity_verifications / user_consents / auth_audit_logs
   - member_type → user_roles 이관, RLS

실행 후 확인:

```sql
select column_name from information_schema.columns
 where table_name='profiles' and column_name in ('onboarding_status','initial_signup_provider');
select count(*) from public.user_roles;
select tablename from pg_tables
 where tablename in ('identity_verifications','user_consents','auth_audit_logs');
```

## E. Vercel 환경변수 (Settings → Environment Variables)

| 변수 | 값 | 환경 | 비고 |
|---|---|---|---|
| `VITE_PORTONE_IDENTITY_CHANNEL_KEY` | 본인인증 채널 키 | Production + Preview | 프론트 공개 가능 |
| `PORTONE_IDENTITY_ENV` | `test` → 실계약 후 `live` | Production + Preview | |
| `IDENTITY_VERIFICATION_REQUIRED` | `true` | Production | 기본값 true — 미설정 시에도 true |
| (기존 유지) `PORTONE_API_SECRET` 등 | 변경 없음 | | 결제용 변수 삭제·개명 금지 |

등록 후 **Deployments → 최신 배포 → ⋯ → Redeploy** 해야 적용됩니다.

## F. 운영 전 체크리스트

- [ ] Google 로그인 → /auth/callback → 신규는 /auth/onboarding, 기존은 역할별 홈
- [ ] 카카오 로그인 동일 (이메일 미제공 계정 → 온보딩에서 이메일 등록 요구)
- [ ] 이메일 가입 → 확인 메일 → 인증 후 로그인 (Supabase Auth → Providers → Email 의
      "Confirm email" 설정 상태 확인 — 운영에서는 활성화 권장)
- [ ] `/api/identity` → `identityConfigured: true`
- [ ] 신규 가입: 회원유형 → PASS 인증(이름·번호 자동입력) → 약관 체크 → 가입 완료
- [ ] 기존 회원 로그인 정상 (본인인증 없이도 로그인 가능, 결제 전에만 인증 요구)
- [ ] 관리자 로그인 → /admin 정상
- [ ] ceo → /business-services, consultant → /my-tools 이동
- [ ] 비회원: 성장진단·상품 열람·상담 신청 정상 / 결제·내역은 로그인 안내
- [ ] 테스트 본인인증 1건 후 Supabase `identity_verifications` 에 이름·번호만 저장(CI 원문 없음) 확인
