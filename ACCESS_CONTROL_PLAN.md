# 접근 제어 / 권한 설계 (ACCESS CONTROL PLAN)

> 미래 AI 랩(Mirae AI Lab)의 도구 접근 권한 구조 설계 문서.
> **핵심 주의:** 각 도구는 현재 각각 별도의 Vercel 앱으로 배포되어 있습니다.
> 따라서 미래 AI 랩 홈페이지에서 링크를 숨기거나 버튼을 막는 것만으로는
> **진짜 접근 제한이 되지 않습니다.** (URL을 아는 사람은 직접 접속 가능)

---

## 1단계 (현재): 임시 구조 — 표시/노출 제어

- 미래 AI 랩에서 로그인/권한(체험 상태)을 보여준다.
- "내 도구함"에서 권한(체험 활성)이 있는 사용자에게만 외부 도구 링크를 노출한다.
- **한계(중요):** 외부 도구 URL을 직접 아는 사람은 권한과 무관하게 접속할 수 있다.
  → 완전한 보안이 아니며, "노출 제어" 수준이다.
- 현재 mock 단계에서는 localStorage 기반이라 클라이언트에서 데이터 변조도 가능하다.
  (데모/검증 용도로만 사용)

## 2단계 (목표): 실제 보안 구조 — 각 앱에서 권한 검증

각 개별 도구 앱이 **반드시 중앙 권한을 직접 확인**해야 실제 보안이 성립한다.

1. 중앙(미래 AI 랩)에 Supabase Auth 세션 + `tool_access` 권한 데이터를 둔다.
2. 각 도구 앱은 사용자가 접속할 때:
   - 공유 Supabase 세션(또는 중앙 권한 검증 API)을 호출해 인증/권한을 확인하고,
   - 해당 사용자의 `tool_access` 상태(활성/만료/무제한/회수)를 조회한다.
3. **만료/무권한 사용자**는 도구 기능에 접근하지 못하고 "이용 불가/체험 만료" 안내 페이지로 이동한다.
4. **유효한 사용자**만 실제 기능을 사용한다.

### 구현 옵션

- **A. 공유 Supabase 세션**: 모든 앱이 동일 Supabase 프로젝트를 바라보고, 세션 쿠키/토큰을 공유(서브도메인 전략 등). 각 앱이 `tool_access`를 직접 RLS로 조회.
- **B. 중앙 권한 검증 API**: 미래 AI 랩이 `/api/verify-access?tool=...` 같은 엔드포인트(서버에서 JWT 검증 + `tool_access` 조회)를 제공하고, 각 도구 앱이 진입 시 호출.
- 두 경우 모두 **서버 측 검증**이 핵심이다. 클라이언트 토글만으로는 막을 수 없다.

### 단기 보강(2단계 이전 임시 강화)

- 도구 앱에 간단한 접근 토큰/서명 파라미터를 요구하고, 미래 AI 랩이 권한 있는 사용자에게만 단기 유효 토큰(서버 발급)을 제공.
- 완전하진 않지만 "URL만 알면 접속"보다 난이도를 높임.

---

## 권한 모델

| 역할 | role | 권한 |
| --- | --- | --- |
| 일반 사용자 | `user` | 본인 체험/연장/이용 |
| 관리자 | `admin` | 전체 사용자·모듈 권한 부여/연장/회수/무제한 |

- 관리자 이메일: `sanghohoho0813@gmail.com` (로그인 시 자동 `admin`, `src/lib/platform.ts`의 `ADMIN_EMAIL`)

### `tool_access.access_status` 의미

| 상태 | 의미 | 접근 |
| --- | --- | --- |
| `none` | 체험 미시작 | ✕ |
| `trial_active` | 기본 7일 체험 중 | ✔ (만료 전) |
| `extended_by_review` | 리뷰로 +7일 연장됨 | ✔ (만료 전) |
| `extended_by_survey` | 설문으로 +7일 연장됨 | ✔ (만료 전) |
| `trial_expired` | 체험 만료 | ✕ |
| `paid_active` | 결제 이용 중 (`paid_until`까지) | ✔ |
| `unlimited` | 관리자 무제한 부여 | ✔ |
| `revoked` | 관리자 권한 회수 | ✕ |

---

## 데이터 테이블 (Supabase 전제)

> 타입과 mock 구현: `src/lib/platform.ts`

### profiles
`id, email, name, phone, organization, role(user|admin), interests[], created_at`

### tools
`id, title, slug, category, status, access_type(public|beta|restricted|private|comingSoon), external_url, is_public, is_trial_available, created_at`

### tool_access
`id, user_id, tool_id, access_status, trial_started_at, trial_expires_at, review_extension_used, survey_extension_used, paid_until, is_unlimited, granted_by_admin, memo, created_at, updated_at`

### reviews
`id, user_id, tool_id, content, char_count, status(pending|approved|rejected), created_at`
- 연장 조건: `char_count >= 500` (mock은 자동 승인 → 운영 시 검수 가능)

### surveys
`id, user_id, tool_id, answers(jsonb), created_at`

### payments
`id, user_id, tool_id, plan_id, payment_status(pending|paid|failed|refunded), amount, paid_at, expires_at`
- `payment_status=paid` + `expires_at` → `tool_access.paid_until` 로 연결

---

## RLS(행 수준 보안) 가이드 (2단계)

- `profiles`: 본인 행만 read/update, 관리자 전체 read/update.
- `tool_access`: 본인 행 read, 쓰기는 서버(Service Role)/관리자만. 체험 시작·연장은 서버 함수(Edge Function)에서 검증 후 기록.
- `reviews`/`surveys`: 본인 insert, 관리자 read 전체.
- `payments`: 서버(Webhook)만 write, 본인/관리자 read.

> 체험 연장(리뷰/설문)·관리자 액션은 **클라이언트가 아니라 서버 함수에서** 검증·기록해야 위변조를 막을 수 있다.
