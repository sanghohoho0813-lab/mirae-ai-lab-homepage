# PortOne V2 카드결제 — 운영 설정 체크리스트

미래 AI 랩 서비스몰 일회성 카드결제(대표자용 상품)를 실제로 열기 위한 순서입니다.
**테스트 결제 → 검증 → 실결제 전환** 순서를 지켜주세요.

---

## 0. 먼저 이해할 구조

- 결제금액의 '정답'은 서버입니다: Supabase `billing_products`. **live 에서는 billing_products 에
  active 레코드가 없으면 결제가 차단**됩니다(코드 폴백은 test 환경 전용). SQL 시드를 먼저 실행하세요.
  브라우저가 보낸 금액은 어떤 경우에도 사용하지 않습니다.
- 결제 확정은 3중 확인입니다: ① 브라우저 결제창 결과 → ② 서버 complete API 가 PortOne 단건조회로
  상태(PAID)·금액·storeId 재검증 → ③ 웹훅(서명 검증 후 다시 단건조회)으로 누락·취소 동기화.
- 환불·취소는 **PortOne 콘솔에서만** 처리하세요. 웹훅으로 사이트 상태가 자동 반영됩니다.
  (PG사 관리자 페이지에서 직접 취소하면 PortOne 과 상태가 어긋납니다 — 금지)

## 1. Supabase 준비 (1회)

SQL Editor 에서 아래 순서대로 실행 (모두 재실행 안전):

1. `supabase/schema.sql` (이미 실행했다면 생략 가능)
2. `supabase/payments-subscriptions.sql` (〃)
3. **`supabase/portone-one-time-payments.sql`**
   - `billing_products` 확장 + 일회성 상품 12개 시드
   - `product_payments` / `service_orders` / `payment_events` 생성
4. **`supabase/billing-policy-foundation.sql`** (결제정책 기반)
   - `user_roles`(복수 역할) / `billing_prices`(가격 버전) / `billing_product_policies`(환불정책)
   - `billing_refund_requests` / `billing_audit_logs` / 구독기간 컬럼 확장

가격 변경 방법 (기존 결제·구독 금액은 자동으로 바뀌지 않습니다):

- **권장**: `billing_prices` 에서 기존 버전에 `effective_to` 를 채우고, `price_version` 을 올린
  새 행(active, effective_from=적용시점)을 추가 → 신규 결제부터 새 가격 적용
- 호환: `billing_products.amount` 도 함께 맞춰두면 미시드 환경 폴백과 일치합니다
- 화면 표시가는 `src/data/businessPackages.ts` 에서 함께 수정
- 환불·취소 정책은 `billing_product_policies` 에서 상품별로 수정 (코드 수정 불필요)

## 2. PortOne 가입·채널 (테스트)

1. <https://admin.portone.io> 가입 → 사업자 정보 등록
2. PG 전자결제 신청 (카드결제 계약)
3. 결제 연동 → **V2** 채널 생성 (테스트 채널)
4. 테스트 **Store ID** (`store-...`) / **Channel Key** (`channel-key-...`) 확인
5. 결제 연동 → API Keys 에서 **V2 API Secret** 발급
6. 웹훅 메뉴에서 **웹훅 버전 2024-04-25** 선택 후 테스트 Endpoint 등록:
   `https://<배포도메인>/api/portone/webhook`
   → 발급되는 **Webhook Secret** (`whsec_...`) 확인

## 3. Vercel 환경변수 (Preview/Production 각각)

| 변수 | 값 | 공개 여부 |
|---|---|---|
| `VITE_PORTONE_STORE_ID` | store-... | 프론트 공개 가능 |
| `VITE_PORTONE_CHANNEL_KEY` | channel-key-... | 프론트 공개 가능 |
| `VITE_PUBLIC_APP_URL` | https://배포도메인 | 프론트 공개 가능 (redirect 복귀 주소) |
| `PORTONE_STORE_ID` | store-... (위와 동일) | **서버 전용** — storeId 위조 검증용 |
| `PORTONE_API_SECRET` | V2 API Secret | **서버 전용** |
| `PORTONE_WEBHOOK_SECRET` | whsec_... | **서버 전용** |
| `PORTONE_ENV` | `test` 또는 `live` | 서버 (test 면 화면에 '테스트 결제' 배지) |
| `PAYMENT_TEST_ACCESS_CODE` | 임의 문자열 (선택) | **서버 전용** — test 환경 결제 접근 제한 |

- ⚠️ Secret 2종은 절대 `VITE_` 접두사 금지. 등록 후 **Redeploy** 해야 적용됩니다.
- 설정 확인: 브라우저에서 `/api/payments` GET → `portoneConfigured/webhookConfigured/environment` 확인
  (`/api/portone/webhook` GET 도 동일한 상태 점검 제공)

### 테스트 결제 외부노출 방지 (권장)

운영 도메인에서 테스트하는 동안 일반 방문자가 테스트 결제를 실행하지 못하게 하려면
`PAYMENT_TEST_ACCESS_CODE` 를 설정하세요 (PORTONE_ENV=test 일 때만 동작).

- 접근 URL: `https://<도메인>/checkout/<상품슬러그>?testAccess=<코드>` (코드는 탭 세션에만 유지, 주소창에서 즉시 제거)
- 관리자 로그인 상태면 코드 없이 결제 가능합니다.
- 코드가 없는 일반 방문자에게는 "현재 결제 기능을 준비하고 있습니다" + 상담 안내가 표시되고,
  서버 prepare API 도 403 으로 차단합니다 (클라이언트 우회 불가).
- 테스트가 끝나면 변수를 **삭제하거나 값을 변경**하세요. `PORTONE_ENV=live` 에서는 이 게이트가 적용되지 않습니다.

## 4. 테스트 결제 검증

1. `/business-services` → 아무 결제형 상품 → **바로 결제하기**
2. 체크아웃에서 정보 입력 → 테스트 카드로 결제
3. `/payment/complete` 에서 "결제가 완료되었습니다" + 주문번호 확인
4. `/admin/payments` 에서 주문·금액·PortOne 상태 `PAID` 확인
5. PortOne 콘솔 → 웹훅 로그에서 200 응답 확인 (관리자 상세의 이벤트 로그에 `payment_webhook_verified`)
6. PortOne 콘솔에서 해당 결제 **전액취소** → 사이트 관리자에서 상태가 `취소` 로 자동 반영되는지 확인

## 5. 실결제 전환

1. PG 실계약 완료 후 **실연동(live) 채널** 생성
2. Production 환경변수를 live 채널 값으로 교체: `VITE_PORTONE_CHANNEL_KEY`, (필요시 Store ID), `PORTONE_ENV=live`
3. 실연동 웹훅 Endpoint + 새 Webhook Secret 등록 → `PORTONE_WEBHOOK_SECRET` 교체
4. Redeploy 후 **소액 실결제 1건** → 사이트 DB·PortOne 콘솔 내역 비교
5. 해당 건 **전액취소** 테스트 → 상태 동기화 확인
6. 완료. (테스트 주문은 `environment=test` 로 구분되어 관리자 화면에 배지 표시)

## 6. 운영 중 주의

- 금액 변경: `billing_products.amount` + `businessPackages.ts` + (안전망) `paymentCatalog.ts` 세 곳 동기화
- `결제 확인 필요`(amount_mismatch / needs_review) 주문은 반드시 PortOne 콘솔 내역과 대조 후 처리
- 로그·화면에 Secret 이 출력되는 일은 없습니다. 만약 유출이 의심되면 PortOne 콘솔에서 즉시 재발급
