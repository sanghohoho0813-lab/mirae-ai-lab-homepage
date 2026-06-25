# 미래 AI 랩 플랫폼 로드맵

> 미래경영지원센터가 운영하는 실무형 AI 도구 플랫폼(Mirae AI Lab).
> 단순 랜딩페이지 → 회원 기반 "실무형 AI 도구 중앙 포털"로 확장하기 위한 단계별 계획입니다.
>
> **현재(1단계)는 결제·실인증 없이 구조/UI/데이터 필드/문서까지만 구현**했습니다.
> 인증·DB·결제는 다음 단계에서 별도로 붙입니다.

---

## 1단계: 현재 상태 (구현 완료)

- 랜딩페이지 (브랜드: 미래 AI 랩 / 운영: 미래경영지원센터)
- 도구 쇼룸 (운영중·MVP 베타·비공개·개발중 상태 표시)
- 이용 방식(요금제) 섹션 — 7일 무료 체험 / 컨설턴트 이용권(예정) / 관리자 승인·맞춤 제작
- 문의 폼 + Resend 메일 발송 API (`/api/inquiry`)
- 외부 도구 연결 (각 도구는 별도 Vercel 앱, 새 탭)
- 전자책 외부 판매 페이지 연결
- **mock 회원/권한 구조** (localStorage 기반): 로그인/회원가입/내 도구함/관리자 화면
- **mock 7일 체험 + 리뷰/설문 연장(최대 21일)** 로직
- 도구 데이터에 `accessType` / `isTrialAvailable` / `slug` 필드 추가

### 1단계에서 "아직 mock"인 부분

| 영역 | 현재 | 다음 단계 |
| --- | --- | --- |
| 인증 | localStorage 세션 (비밀번호 미검증) | Supabase Auth |
| 사용자/권한 데이터 | localStorage (`mirae:*`) | Supabase `profiles`, `tool_access` |
| 리뷰/설문 | localStorage, 자동 승인 | Supabase `reviews`, `surveys` + 검수 |
| 결제 | 없음 (UI/데이터 필드만) | Toss/Stripe/수동승인 + `payments` |
| 외부 도구 접근 제어 | 링크 노출/숨김 (완전한 보안 아님) | 각 앱이 중앙 권한 API 확인 (ACCESS_CONTROL_PLAN.md 참고) |

---

## 2단계: 회원 시스템

- Supabase Auth 기반 회원가입 / 로그인 (이메일+비밀번호)
- 소셜 로그인 (Google, Kakao) — 현재 UI에 "준비 중"으로 노출
- 사용자 프로필 (`profiles`: 이름·이메일·휴대폰·소속·관심도구·role)
- 권한 구분: `user` / `admin` (관리자 이메일: `sanghohoho0813@gmail.com`)
- 로그인 후 "내 도구함"에서 이용 가능 도구 + 남은 체험 기간 확인

## 3단계: 결제 시스템

- 요금제(plan) 정의 및 도구별/통합 이용권
- 결제 상태(`payments.payment_status`: pending/paid/failed/refunded)
- 구독/이용 만료(`expires_at`) ↔ `tool_access` 권한 연동
- 결제 후보: Toss Payments, Stripe, 수동 입금/관리자 승인

## 4단계: 관리자 화면

- 사용자 목록 / 검색
- 사용자별 모듈 권한 및 체험 시작일·만료일·남은 기간 확인
- 7일 연장 / 원하는 날짜까지 수동 연장 / 무제한 권한 부여 / 권한 회수
- 리뷰·설문 제출 여부 확인
- 결제 상태 변경 (준비)

## 5단계: 도구 통합

- 각 도구별 접근 권한 통합 (`tool_access`)
- 기존 개별 Vercel 앱 ↔ 중앙 포털(미래 AI 랩) 권한 연동
- 장기적으로 단일 계정(SSO) 체계로 통합

---

## 무료 체험 / 연장 정책 (요약)

- 모듈(도구)별 기본 **7일** 체험
- 리뷰(500자 이상) 작성 시 **+7일** (1회)
- 설문 참여 시 **+7일** (1회)
- 최대 무료 체험 = 7 + 7 + 7 = **21일**
- 이후 **결제 또는 관리자 승인** 필요
- 주식 EXIT 솔루션은 비공개(`private`)로 체험 대상 제외

## 데이터 모델 (Supabase 전제)

`profiles`, `tools`, `tool_access`, `reviews`, `surveys`, `payments`
— 타입 정의와 mock 구현은 `src/lib/platform.ts` 에 있으며, Supabase 테이블과 1:1로 설계했습니다.
세부 컬럼과 접근 제어는 `ACCESS_CONTROL_PLAN.md` 참고.

---

## 바로 다음 작업 추천

1. `Supabase 프로젝트를 연결하고 src/lib/platform.ts의 localStorage 함수들을 Supabase 쿼리로 교체해줘. profiles/tool_access/reviews/surveys/payments 테이블 SQL과 RLS 정책도 만들어줘.`
2. `Supabase Auth(이메일+비밀번호, Google/Kakao OAuth)를 붙이고 src/lib/auth.tsx의 mock login/signup/logout을 실제 세션으로 교체해줘. ProtectedRoute로 /my-tools·/admin을 보호해줘.`
3. `각 외부 도구 앱이 접속 시 중앙 tool_access 상태를 검증하도록 ACCESS_CONTROL_PLAN.md의 2단계 보안 구조(공유 세션/검증 API)를 설계·구현해줘. 만료 사용자는 안내 페이지로 보내줘.`
