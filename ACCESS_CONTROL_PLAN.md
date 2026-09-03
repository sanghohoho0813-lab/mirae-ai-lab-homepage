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

## 진행 상태 (2026-09 기준)

| 단계 | 상태 |
| --- | --- |
| 포털에서 회원가입·체험 시작 없이 도구 접근 | **차단됨** — `/consultants` 카드가 `/signup` 으로 간다 |
| 공개 번들·API 응답에 도구 주소 노출 | **제거됨** — 권한 확인 후 `/api/trial {action:'open'}` 으로만 전달 |
| 체험 만료 후 포털에서 도구 열기 | **차단됨** — 서버가 만료를 판정해 403 |
| 도구 앱이 스스로 체험 기간을 확인 | **적용 중** — `public/tool-gate.js` (도구별 브랜치 병합 대기) |
| 도구 앱 서버가 데이터 응답 시 권한 확인 | **미적용** — 정적 앱이라 현 구조에서는 불가 |

---

## 해결한 문제

- 도구들이 각각 **별도 Vercel 앱**으로 배포되어 있어, 포털에서 링크를 숨겨도
  **외부 URL을 직접 알면 접속 가능**했다. → 포털이 주소를 아예 내주지 않도록 바꿨다.
- 7일 체험 만료가 **포털 UI에만 적용**되어 실제 제한이 아니었다.
  → 도구 앱에 게이트를 붙여 만료되면 잠기게 했다.

---

## 현재 구조 — 진입 티켓 방식

포털(`miraeailab.com`)과 도구 앱(`*.vercel.app`)은 도메인이 달라 로그인 세션을 공유할 수 없다.
그래서 포털이 짧은 서명 티켓을 발급하고, 도구 앱이 그 티켓을 포털에 되물어 확인한다.

```
내 도구함에서 "도구 열기"
 → POST /api/trial {action:'open'}  (Supabase 세션 검증 + tool_access 판정)
 → 통과 시에만 external_url + ?mlt=<HMAC 서명 티켓, 3분 유효> 반환
 → 도구 앱의 tool-gate.js 가 POST /api/trial {action:'verify'} 로 티켓 확인
 → allowed=true 면 이용 종료 시각을 저장하고 화면을 연다
 → 기간이 지나면 저장된 값도 만료되어 잠금 화면
```

- 티켓 서명 키: 서버에만 있는 `SUPABASE_SERVICE_ROLE_KEY` (HMAC-SHA256)
- 티켓에는 `{ 사용자 id, 도구 id, 만료 }` 만 담기며, 변조하면 서명 검증에서 걸린다
- 응답의 `toolSlug` 를 게이트가 `data-tool` 과 대조해 **다른 도구용 티켓 도용**을 막는다
- 판정식은 `src/utils/access.ts` 의 `canUseTool` 과 `api/trial.ts` 의 `accessUntil()` 이 동일

### 도구 앱에 붙이는 방법

```html
<script src="https://miraeailab.com/tool-gate.js" data-tool="tools.slug 값"></script>
```

### 남은 한계 (반드시 인지할 것)

도구 앱들은 **자체 서버가 없는 정적 앱**이라 검증이 브라우저에서 이뤄진다.
개발자도구를 쓸 줄 아는 사용자는 localStorage 를 직접 조작해 우회할 수 있다.
일반 사용자 기준의 "가입해야 이용 / 7일 뒤 차단" 은 성립하지만,
완전한 차단은 각 도구가 **데이터를 내려줄 때 서버에서** 권한을 확인해야 가능하다.

### 별도 계정 체계 문제 (미해결)

일부 도구는 **자체 Supabase 프로젝트와 자체 계정 체계**를 갖고 있다.
예: 고용지원금 프로 — `user_product_access`(초대코드·만료일), 조직/팀, 결제까지 별도.
포털과 프로젝트가 달라 세션을 공유할 수 없어, 사용자가 **로그인을 두 번** 하게 된다.
해결하려면 다음 중 하나를 선택해야 한다.

1. 도구 앱에 SSO 교환 엔드포인트를 두고, 포털 티켓으로 자체 계정 세션을 발급 (양쪽 코드 + 도구 프로젝트 service_role 키 필요)
2. 도구 앱들을 포털과 같은 Supabase 프로젝트로 통합 (계정·데이터 이관 필요)
3. 도구 자체 계정 체계를 정식 채택하고, 포털은 안내·결제만 담당

---

## 남은 과제

- 도구 앱들을 **같은 Supabase 프로젝트**로 모으거나, SSO 교환으로 이중 로그인을 없앤다.
- 도구가 데이터를 내려줄 때 **서버에서** 권한을 확인한다(현재는 브라우저 검증까지가 한계).
- 장기적으로 **단일 도메인/서브도메인 구조** 를 검토한다.
  (예: `app.miraeailab.com`, 도구별 `tool1.miraeailab.com` + 공유 세션)

---

## 권한 모델

| 역할 | role | 권한 |
| --- | --- | --- |
| 일반 사용자 | `user` | 본인 체험/연장/이용 |
| 관리자 | `admin` | 전체 사용자·모듈 권한 부여/연장/회수/무제한/결제상태 |

- 관리자 이메일: `sanghohoho0813@gmail.com` (`ADMIN_EMAIL`, `src/lib/platform.ts`)
- 인증은 Supabase Auth, 권한 판정은 `profiles.role` + RLS.
  `src/lib/platform.ts` 의 localStorage 구현은 **타입·계산식 원본**으로만 쓰이며,
  실제 읽기는 `src/lib/portal.ts`(RLS), 쓰기는 서버리스 API(service_role)가 담당한다.

### `/admin` 보호

- 비로그인 → `/login`으로 리다이렉트
- 로그인했지만 `role !== 'admin'` → "관리자 권한이 필요합니다" 안내 화면
- 화면 가드는 보조 수단이고, **실제 차단은 RLS(`is_admin()`) 와 `/api/admin/*` 의 role 검증**이다.

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
