# CUSTOMER PLATFORM AUDIT — PUBLIC (miraeailab.com)

기준 커밋: `8036aff` (origin/main, `3674abc` 포함 확인) · 작업 브랜치: `claude/mirae-customer-platform-v1`

## 0. 한 줄 판정

"마케팅 홈페이지 + 결제 + 도구함 + 진단 리드 수집"은 잘 갖춰져 있다. 그러나 **컨설팅 고객이 로그인해서 "내 프로젝트가 어디까지 왔는지"를 볼 수 있는 화면이 없고,
고객이 여기서 한 행동(진단·주문·요청)이 내부 운영 시스템으로 이어지지 않는다.** 이번 단계는 공개 마케팅 표면을 보존한 채 로그인 후 표면을 "고객 업무 Portal"로 발전시킨다.

## 1. 기술 기반

| 항목 | 현재 | 판정 |
|---|---|---|
| 스택 | Vite 6 · React 19 · TS strict · Tailwind 4 · React Router 7 (`BrowserRouter`, 모든 페이지 **eager import**) | KEEP · 신규 Portal 페이지는 lazy |
| Supabase | `src/lib/supabase.ts` anon 클라이언트(PKCE) · `api/_lib/supabaseAdmin.ts` service_role **서버 전용** | KEEP · 프론트 service_role 0 유지 |
| 서버리스 | `api/*.ts` (Vercel Functions) — trial/open, payments, business-diagnosis, consult, inquiry, admin/* | KEEP |
| 인증 | `src/lib/auth.tsx` `useAuth()` → user/profile/roles/isAdmin/needsOnboarding/getAccessToken | KEEP |
| 도구 접근 통제 | `openTool()` → `/api/trial action=open` 서버 확인 후 URL 발급, `tool-url-hardening.sql`, `public/tool-gate.js` | **보존 필수** (변경 금지) |
| SEO | `public/sitemap.xml`, `public/robots.txt`(Disallow 개인영역), `CanonicalLink`(운영 도메인 고정) | KEEP · 신규 private 라우트 noindex + robots Disallow 추가 |
| 배포 | Vercel `ai-business-lab` · Production = miraeailab.com | 이번 단계 Production 변경 금지 |

## 2. 라우트 인벤토리 (src/main.tsx)

| Route | 화면 | 데이터 | 색인 | 판정 · 새 IA |
|---|---|---|---|---|
| `/` | GatewayPage | 정적 | index | KEEP (마케팅) |
| `/consultants` | App (컨설턴트 OS 소개) | 정적 | index | KEEP |
| `/business-services`, `/business-services/all`, `/business-services/:slug`, `/business-services/funding-consulting` | 서비스 카탈로그·상세 | 정적 + 결제 카탈로그 | index | KEEP |
| `/ax-industries/:slug` | 업종별 AX | 정적 | index | KEEP |
| `/business-diagnosis`, `/business-diagnosis/results(/:id)` | 사업 진단 → `api/business-diagnosis` → `business_diagnosis_sessions/leads` | Supabase(서버) | index / noindex | KEEP · **완료 시 customer_events(diagnosis_completed) 생성 트리거 연결** |
| `/login`, `/signup`, `/forgot-password`, `/auth/callback`, `/auth/onboarding`, `/auth/reset-password` | 인증 | Supabase Auth | noindex | KEEP |
| `/mypage` (`/account`) | MyPage 5탭(내 정보·보안·이용 상품·결제·역할) | profiles/tool_access/payments | noindex | **KEEP → My MIRAE 허브로 고도화**(연결 고객이면 "내 프로젝트" 히어로 추가) |
| `/my-tools` (`/dashboard`) | 내 도구함 (AuthGuard) | tools/tool_access | noindex | KEEP (변경 금지) |
| `/my-orders` | 주문 내역 | product_payments/service_orders | noindex | KEEP |
| `/saved` | 찜 | localStorage | noindex | KEEP |
| `/checkout/:productSlug`, `/payment/complete` | PortOne 결제 → `api/payments` → `service_orders` | 서버 | noindex | KEEP · **주문 생성 시 customer_events(service_order_created) 트리거 연결** |
| `/admin`, `/admin/business-leads`, `/admin/members`, `/admin/reviews`, `/admin/payments` | 관리자 | profiles.role=admin | noindex | KEEP · 관리자에게만 "내부 운영 OS 열기" 외부 링크 추가 |
| `/terms`, `/privacy`, `/refund-policy`, `/business-info` | 약관 | 정적 | index | KEEP |
| **신규** `/my-projects`, `/my-projects/:linkId` | 고객 프로젝트 Portal | portal_* RPC | noindex | **ADD** |

## 3. 데이터 소스 (공개 앱이 아는 테이블)

| 테이블 | 쓰기 | 읽기 | 비고 |
|---|---|---|---|
| `profiles` (id=auth.uid, email, name, phone, organization, role) | 본인/서버 | 본인/관리자 | **Customer Platform 계정** ≠ 내부 `operations_clients` |
| `tools`, `tool_access`, `reviews`, `surveys` | 서버 | 본인 | 도구 체험 |
| `payments`, `product_payments`, `service_orders`, `subscriptions`, `billing_*` | 서버(PortOne 웹훅·검증) | 본인 | `service_orders.internal_memo`는 고객에게 미노출 |
| `business_diagnosis_leads/sessions/events` | 서버 | 관리자 | 리드 |
| `consult_leads`, `identity_verifications`, `phone_verifications`, `user_consents`, `user_coupons`, `user_roles` | 서버 | 본인 | — |

같은 Supabase project(`mirae-ai-lab`)에 내부 앱 테이블(workspaces, operations_clients, …)이 공존한다. 공개 앱은 그 테이블을 직접 읽지 않는다(이번 계약의 핵심).

## 4. 중복 · 레거시

| 항목 | 판단 |
|---|---|
| `docs/ax-mvp-factory-os-설계안.md` | 내부 앱 초기 설계안 사본 — 참고용. DEPRECATE-LATER(내부 docs로 이관) |
| `v19/` 디렉터리 | 옛 버전 스냅샷 — 빌드에 미포함. DEPRECATE-LATER |
| `/dashboard`→`/my-tools`, `/account`→`/mypage`, `/welcome`, `/for-consultants` | 호환 리다이렉트 — KEEP |
| `index.html` favicon `vite.svg` | 브랜드 파비콘 아님 — P1 |

## 5. 사용 빈도 예상

| 방문자 | 회원(도구) | 컨설팅 고객(연결됨) |
|---|---|---|
| 게이트웨이·서비스·진단 | 내 도구함·결제·마이페이지 | **내 프로젝트(할 일·서류·업데이트·요청·결과)** — 신규 |

## 6. P0 / P1

### P0
1. **고객 Portal 부재** — 로그인 고객이 컨설팅 진행 상태를 볼 화면이 없다 → `/my-projects`.
2. **고객 행동이 내부로 안 감** — 진단/주문/요청이 내부 시스템에 이벤트로 들어가지 않는다 → 트리거 + customer_events.
3. **내부 처리 결과가 고객에게 안 옴** → portal_updates(명시 발행).

### P1
1. 개인 영역 페이지에 `<meta name="robots" content="noindex">` 미설정(robots.txt Disallow만) → `NoIndex` 컴포넌트.
2. 신규 Portal 라우트 robots Disallow 추가.
3. 파비콘 `vite.svg` → 브랜드 마크.
4. 계정 메뉴에 "내 프로젝트" 진입(연결 고객에게만).

### P2 (RECOMMENDATIONS)
- 모든 페이지 lazy import 전환(현재 eager)
- `v19/` 정리
