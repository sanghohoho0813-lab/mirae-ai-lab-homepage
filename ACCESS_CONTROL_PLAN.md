# 접근 제어 / 권한 설계 (ACCESS CONTROL PLAN)

> 미래 AI 랩(Mirae AI Lab) 도구 접근 권한 구조 설계.

## ⚠️ 가장 중요한 보안 원칙

**미래 AI 랩 포털에서 버튼을 숨기거나 만료 표시를 하는 것만으로는 진짜 접근 제한이 아니다.**
포털 UI는 "보여주기"일 뿐이며, 외부 도구 앱이 권한을 직접 검증하지 않으면 막을 수 없다.

진짜 접근 제한을 하려면 **각 개별 도구 앱에서도** 사용자의 로그인 세션과 `tool_access` 권한을
확인해야 한다. 장기 구조는 다음이어야 한다.

```
사용자 로그인
 → 미래 AI 랩 중앙 Supabase Auth 세션 발급
 → tool_access 테이블에서 도구별 권한 확인 (trial_expires_at / paid_until / is_unlimited)
 → 권한이 있으면 해당 도구 사용 가능
 → 권한이 없거나 만료되면 사용 불가(locked) 화면 표시
```

외부 도구 앱도 **접속 시 중앙 권한을 확인**해야 한다.

---

## 현재 문제

- 도구들이 각각 **별도 Vercel 앱**으로 배포되어 있어, 미래 AI 랩에서 링크를 숨겨도
  **외부 URL을 직접 알면 접속 가능**하다.
- 7일 체험 만료가 **포털 UI에만 적용**되면 실제 제한이 아니다. (만료돼도 URL로 접속됨)
- 현재 권한/체험 데이터는 **localStorage mock**이라 클라이언트에서 위변조가 가능하다. (데모용)

---

## 1단계 임시 조치 (현재 가능, 완전한 보안 아님)

- 포털에서는 만료 사용자에게 외부 링크를 **숨긴다.** (내 도구함은 활성 상태에서만 "도구 열기" 노출)
- 외부 링크 대신 **"권한 확인 후 이동"** 버튼을 사용한다.
- 권한 없는 사용자는 **문의/결제/연장 화면으로 안내**한다.
- **명시:** 이 단계는 "노출 제어"이며 **완전한 보안이 아니다.** (URL 직접 접속은 막지 못함)

> 구현 위치: `src/pages/MyToolsPage.tsx` (활성 시에만 외부 링크 노출),
> 도구 데이터 `isPublic`/`accessType` (`src/data/tools.ts`), 비공개 도구(주식 EXIT)는 링크 자체 비노출.

### 1단계 보강(선택) — 단기 토큰

- 권한 있는 사용자에게만 **서버가 발급한 단기 유효 토큰**(서명/만료 포함)을 주고,
  외부 도구 진입 URL에 포함. 완전하진 않지만 "URL만 알면 접속"보다 난이도를 높인다.

---

## 2단계 실제 조치 (각 도구 앱에서 권한 검증)

- 각 개별 도구 앱에 **권한 확인 로직**을 추가한다.
- 도구 앱 접속 시 **Supabase Auth 세션**을 확인한다.
- `tool_access` 테이블에서 **해당 `tool_id` 권한**을 조회한다.
- `trial_expires_at`, `paid_until`, `is_unlimited`(및 `access_status='revoked'`)를 확인한다.
- **만료/무권한이면 locked(사용 불가) 페이지**로 이동시킨다.

### 구현 옵션

- **A. 공유 Supabase 세션:** 모든 앱이 같은 Supabase 프로젝트를 바라보고 세션을 공유(동일 루트
  도메인의 서브도메인 전략 등). 각 앱이 RLS로 `tool_access`를 직접 조회.
- **B. 중앙 권한 검증 API:** 미래 AI 랩이 `/api/verify-access?tool=...` (서버에서 JWT 검증 +
  `tool_access` 조회)를 제공하고, 각 도구 앱이 진입 시 호출.
- 두 경우 모두 **서버 측 검증이 핵심**이다. 클라이언트 토글만으로는 막을 수 없다.

---

## 3단계 통합 구조

- 모든 도구를 **같은 Supabase 프로젝트**와 연결한다.
- 관리자 페이지에서 **사용자별 권한 변경**(연장/무제한/회수/결제 상태).
- 각 앱은 **중앙 권한 API 또는 Supabase RLS** 기반으로 접근 제어.
- 장기적으로 **단일 도메인/서브도메인 구조(SSO)** 를 검토한다.
  (예: `app.mirae-ai-lab.kr`, 도구별 `tool1.mirae-ai-lab.kr` + 공유 세션)

---

## 권한 모델

| 역할 | role | 권한 |
| --- | --- | --- |
| 일반 사용자 | `user` | 본인 체험/연장/이용 |
| 관리자 | `admin` | 전체 사용자·모듈 권한 부여/연장/회수/무제한/결제상태 |

- 관리자 이메일: `sanghohoho0813@gmail.com` (`ADMIN_EMAIL`, `src/lib/platform.ts`)
- **현재 mock 한계:** 로그인이 비밀번호 검증 없는 mock이라, 누구나 관리자 이메일로 로그인하면
  admin이 된다. → 실제로는 Supabase Auth(비밀번호/OAuth) + `profiles.role` + RLS로 보호해야 한다.

### `/admin` 보호 (현재 mock)

- 비로그인 → `/login`으로 리다이렉트
- 로그인했지만 `role !== 'admin'` → "관리자 권한이 필요합니다" 안내 화면
- 단, **클라이언트 가드일 뿐**이며 데이터(localStorage)는 브라우저에서 읽을 수 있다.

### 향후 Supabase 전환 시 관리자 보호

- `profiles.role = 'admin'` 컬럼 + **RLS 정책**으로 관리자 전용 데이터/액션 보호
- 관리자 액션은 **관리자 전용 API(서버)** 에서 role 검증 후 수행
- 클라이언트는 화면만, **권한 판정/변경은 서버에서**

### `tool_access.access_status` 의미

| 상태 | 의미 | 접근 |
| --- | --- | --- |
| `none` | 체험 미시작 | ✕ |
| `trial_active` | 기본 7일 체험 중 | ✔ (만료 전) |
| `extended_by_review` | 리뷰로 +7일 연장 | ✔ (만료 전) |
| `extended_by_survey` | 설문으로 +7일 연장 | ✔ (만료 전) |
| `trial_expired` | 체험 만료 | ✕ |
| `paid_active` | 결제 이용 중(`paid_until`까지) | ✔ |
| `unlimited` | 관리자 무제한 부여 | ✔ |
| `revoked` | 관리자 차단/회수 | ✕ |

---

## 데이터 테이블 (Supabase 전제)

> 타입/mock 구현: `src/lib/platform.ts` · 체험 계산: `src/utils/access.ts`

- **profiles**: `id, email, name, phone, organization, role(user|admin), interests[], memo, last_login_at, created_at`
- **tools**: `id, title, slug, category, status, access_type(public|beta|restricted|private|comingSoon), external_url, is_public, is_trial_available, created_at`
- **tool_access**: `id, user_id, tool_id, access_status, trial_started_at, trial_expires_at, review_extension_used, survey_extension_used, paid_until, is_unlimited, granted_by_admin, memo, created_at, updated_at`
- **reviews**: `id, user_id, tool_id, content, char_count, status(pending|approved|rejected), created_at` — 연장 조건 `char_count >= 500`
- **surveys**: `id, user_id, tool_id, answers(jsonb), created_at`
- **payments**: `id, user_id, tool_id, plan_id, payment_status(pending|paid|failed|refunded), amount, paid_at, expires_at` → `tool_access.paid_until` 와 연결

## RLS(행 수준 보안) 가이드 (2단계)

- `profiles`: 본인 read/update, 관리자 전체 read/update.
- `tool_access`: 본인 read, **쓰기는 서버(Service Role)/관리자만.** 체험 시작·연장은 서버 함수에서 검증 후 기록.
- `reviews`/`surveys`: 본인 insert, 관리자 read 전체.
- `payments`: 결제 Webhook(서버)만 write, 본인/관리자 read.

> 체험 연장(리뷰/설문)·관리자 액션은 **클라이언트가 아니라 서버에서** 검증·기록해야 위변조를 막을 수 있다.
