-- ============================================================================
-- 미래 AI 랩 — PortOne V2 일회성 카드결제 (대표자용 서비스몰)
-- ▶ 실행 순서: schema.sql → payments-subscriptions.sql → 이 파일
--    (Supabase SQL Editor 에서 실행. 여러 번 실행해도 안전하도록 작성했습니다.)
--
-- 이 파일이 하는 일:
--  1) billing_products 에 product_slug / option_id 매핑 컬럼을 안전하게 추가하고
--     일회성 결제 상품 12개(고정가 7 + AX 2옵션 + ISO 3옵션)를 시드합니다.
--     → 서버 결제금액의 '정답' 소스. 가격 수정은 이 테이블에서 하면 됩니다.
--  2) product_payments : 비회원 대표자 일회성 결제 레코드.
--     ⚠️ 기존 public.payments 는 user_id·tool_id NOT NULL(로그인 컨설턴트 도구 결제 전용)
--        구조라 비회원 상품결제에 재사용할 수 없어 별도 테이블을 만듭니다.
--        기존 payments / subscriptions 테이블은 건드리지 않습니다.
--  3) service_orders : 결제 완료 후 실제 서비스 진행(인테이크·상담·진행상태) 관리.
--  4) payment_events : 결제 퍼널·웹훅 처리 이벤트 로그 (개인정보 저장 금지).
--
-- 참고: 이전 임시 구조였던 public.business_orders(business-orders.sql)는 이 구조로
--       대체되었습니다. 이미 만들었다면 그대로 두어도 무해하며, 비우고 싶다면:
--       -- drop table if exists public.business_orders;
-- ============================================================================

create extension if not exists pgcrypto;

-- updated_at 트리거 함수 (schema.sql 재사용, 없으면 생성)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 1) billing_products — slug/option 매핑 컬럼 추가 (안전 ALTER) + 일회성 상품 시드
-- ────────────────────────────────────────────────────────────────────────────
alter table public.billing_products
  add column if not exists product_slug text,
  add column if not exists option_id    text,
  add column if not exists option_name  text,
  add column if not exists vat_included boolean not null default true;

-- (product_slug, option_id) 조합 유일성 — 옵션 없는 상품은 'default' 로 정규화
create unique index if not exists uq_billing_products_slug_option
  on public.billing_products (product_slug, coalesce(option_id, 'default'))
  where product_slug is not null;

-- 일회성 결제 상품 시드 (code 기준 upsert — 재실행하면 금액·활성상태가 이 값으로 갱신됩니다)
-- ⚠️ 가격 수정은 여기(amount)와 src/data/businessPackages.ts 표시가를 함께 바꿔주세요.
--    vat_included 기본 true = 화면 표시가를 최종 승인금액으로 사용한다는 뜻이며,
--    별도 부가세 정책이 필요하면 운영자가 이 컬럼과 안내문구를 조정하세요.
insert into public.billing_products
  (code, name, kind, audience, amount, active, sort, product_slug, option_id, option_name)
values
  ('funding-consulting',              '정책자금 컨설팅',                    'one_time', 'ceo',  550000, true, 10, 'funding-consulting',    null,               null),
  ('venture-innovation',              '벤처인증 패키지 (혁신성장형)',        'one_time', 'ceo', 1990000, true, 20, 'venture-innovation',    null,               null),
  ('venture-investment',              '벤처인증 패키지 (투자유형)',          'one_time', 'ceo', 5000000, true, 30, 'venture-investment',    null,               null),
  ('responsive-homepage',             '반응형 홈페이지 제작',                'one_time', 'ceo',  490000, true, 40, 'responsive-homepage',   null,               null),
  ('rnd-center',                      '기업부설연구소 설립',                 'one_time', 'ceo', 1490000, true, 50, 'rnd-center',            null,               null),
  ('mainbiz-certification',           '메인비즈 인증',                       'one_time', 'ceo', 1990000, true, 60, 'mainbiz-certification', null,               null),
  ('innobiz-certification',           '이노비즈 인증',                       'one_time', 'ceo', 2490000, true, 70, 'innobiz-certification', null,               null),
  ('ai-ax-system:ax-only',            'AI 기반 회사 운영시스템 구축',        'one_time', 'ceo', 1290000, true, 80, 'ai-ax-system',          'ax-only',          'AX 시스템 구축'),
  ('ai-ax-system:ax-with-homepage',   'AI 기반 회사 운영시스템 구축',        'one_time', 'ceo', 1490000, true, 81, 'ai-ax-system',          'ax-with-homepage', 'AX 시스템 + 반응형 홈페이지'),
  ('iso-certification:iso-one',       'ISO 인증 패키지',                     'one_time', 'ceo', 1490000, true, 90, 'iso-certification',     'iso-one',          'ISO 1종'),
  ('iso-certification:iso-two',       'ISO 인증 패키지',                     'one_time', 'ceo', 2180000, true, 91, 'iso-certification',     'iso-two',          'ISO 2종'),
  ('iso-certification:iso-three',     'ISO 인증 패키지',                     'one_time', 'ceo', 3990000, true, 92, 'iso-certification',     'iso-three',        'ISO 3종 패키지')
on conflict (code) do update set
  name         = excluded.name,
  kind         = excluded.kind,
  audience     = excluded.audience,
  amount       = excluded.amount,
  active       = excluded.active,
  sort         = excluded.sort,
  product_slug = excluded.product_slug,
  option_id    = excluded.option_id,
  option_name  = excluded.option_name;

-- 상담 전용(결제 불가) 상품은 시드하지 않습니다: employment-subsidy, growth-roadmap-package

-- ────────────────────────────────────────────────────────────────────────────
-- 2) product_payments — 일회성 결제 레코드 (비회원 가능, user_id nullable)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.product_payments (
  id                    uuid primary key default gen_random_uuid(),
  payment_id            text unique not null,             -- PortOne paymentId (서버 생성)
  merchant_order_id     text unique not null,             -- 주문번호 (화면 표시용)
  request_id            text unique,                      -- prepare 멱등키 (클라이언트 생성 uuid)
  environment           text not null default 'test' check (environment in ('test','live')),
  product_slug          text not null,
  option_id             text,
  product_name          text not null,
  option_name           text,
  amount                integer not null check (amount > 0),
  currency              text not null default 'KRW',
  status                text not null default 'pending' check (status in
    ('pending','payment_requested','paid','failed','cancelled','partial_cancelled',
     'verification_failed','amount_mismatch','exception')),
  portone_status        text,
  payment_method        text,
  pg_provider           text,
  transaction_id        text,
  receipt_url           text,
  user_id               uuid references public.profiles(id) on delete set null,
  lead_id               uuid,
  diagnosis_session_id  uuid,
  buyer_company_name    text not null default '',
  buyer_name            text not null default '',
  buyer_phone           text not null default '',
  buyer_email           text not null default '',
  buyer_business_number text,
  buyer_memo            text,
  access_token_hash     text,                             -- 비회원 주문조회 토큰의 sha256 (원문 저장 금지)
  needs_review          boolean not null default false,   -- 금액불일치 등 관리자 확인 필요
  paid_at               timestamptz,
  failed_at             timestamptz,
  cancelled_at          timestamptz,
  cancel_amount         integer not null default 0,
  failure_code          text,
  failure_message       text,
  metadata              jsonb,                            -- 동의 이력·ISO 규격 선택 등 (민감정보 금지)
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_product_payments_status  on public.product_payments (status, created_at desc);
create index if not exists idx_product_payments_slug    on public.product_payments (product_slug, created_at desc);
create index if not exists idx_product_payments_created on public.product_payments (created_at desc);

drop trigger if exists trg_product_payments_updated on public.product_payments;
create trigger trg_product_payments_updated
  before update on public.product_payments
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 3) service_orders — 결제 완료 후 서비스 진행 관리 (결제상태와 분리)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.service_orders (
  id             uuid primary key default gen_random_uuid(),
  payment_id     uuid unique not null references public.product_payments(id) on delete cascade,
  order_number   text unique not null,                    -- 예: SO20260712-3F9K2A
  product_slug   text not null,
  option_id      text,
  company_name   text not null default '',
  buyer_name     text not null default '',
  buyer_phone    text not null default '',
  buyer_email    text not null default '',
  status         text not null default 'payment_confirmed' check (status in
    ('payment_confirmed','intake_waiting','intake_received','assigned',
     'consultation_scheduled','in_progress','completed','cancelled')),
  intake_status  text not null default 'waiting' check (intake_status in ('waiting','received')),
  consultation_status text,
  intake         jsonb,                                   -- 진행정보 폼 (고민·희망방식·연락시간·요청사항)
  assigned_to    uuid references public.profiles(id) on delete set null,
  internal_memo  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_service_orders_status on public.service_orders (status, created_at desc);

drop trigger if exists trg_service_orders_updated on public.service_orders;
create trigger trg_service_orders_updated
  before update on public.service_orders
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 4) payment_events — 결제 퍼널·웹훅 이벤트 로그 (개인정보 저장 금지)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.payment_events (
  id          uuid primary key default gen_random_uuid(),
  payment_id  text,                                       -- PortOne paymentId (없을 수 있음)
  event_type  text not null check (event_type in
    ('checkout_viewed','checkout_option_selected','checkout_prepare_started','checkout_prepare_succeeded',
     'checkout_prepare_failed','payment_window_opened','payment_cancelled_by_user','payment_client_failed',
     'payment_verification_started','payment_verified_paid','payment_verification_failed','payment_amount_mismatch',
     'payment_webhook_received','payment_webhook_verified','payment_webhook_rejected','payment_webhook_ignored',
     'service_order_created','payment_complete_viewed','payment_retry_clicked','payment_consultation_clicked',
     'payment_status_rechecked','payment_intake_submitted')),
  source      text,                                       -- client | server | webhook
  payload     jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_payment_events_pid  on public.payment_events (payment_id, created_at);
create index if not exists idx_payment_events_type on public.payment_events (event_type, created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS — 쓰기는 서버(service_role, RLS 우회)만. 조회·수정은 관리자만.
--       익명/일반 사용자는 어떤 행도 직접 읽거나 쓸 수 없습니다.
--       (비회원 주문 조회는 서버 API 가 access token 검증 후 마스킹해 반환)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.product_payments enable row level security;
alter table public.service_orders   enable row level security;
alter table public.payment_events   enable row level security;

drop policy if exists product_payments_admin_select on public.product_payments;
create policy product_payments_admin_select on public.product_payments
  for select to authenticated using (public.is_admin());
drop policy if exists product_payments_admin_update on public.product_payments;
create policy product_payments_admin_update on public.product_payments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists service_orders_admin_select on public.service_orders;
create policy service_orders_admin_select on public.service_orders
  for select to authenticated using (public.is_admin());
drop policy if exists service_orders_admin_update on public.service_orders;
create policy service_orders_admin_update on public.service_orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists payment_events_admin_select on public.payment_events;
create policy payment_events_admin_select on public.payment_events
  for select to authenticated using (public.is_admin());
