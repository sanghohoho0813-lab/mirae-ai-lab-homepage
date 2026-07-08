-- ============================================================================
-- 미래 AI 랩 — 결제 / 구독 확장 스키마 (PortOne 연동)
-- ▶ 실행 순서: 기존 schema.sql 를 먼저 실행한 뒤, 이 파일을 Supabase SQL Editor 에서 실행.
-- ▶ 이 파일은 기존 테이블(profiles/tools/tool_access/payments 등)을 건드리지 않고
--    "추가/확장"만 합니다. 여러 번 실행해도 안전(idempotent)하도록 작성했습니다.
--
-- 결제 모델 (2026-07 확정)
--  ── 대표 페이지(중소기업 대표): 일회성 결제 100%
--       · 고정가 패키지 (예: 정책자금 55만원)                → billing_products.kind = 'one_time'
--       · 선택형 (ISO 1/2/3종 = 149/218/399만원)             → billing_products (variant 별 개별 행)
--       · 고용지원금·성장 로드맵은 상담형(카드결제 없음)       → billing_products 미등록
--  ── 컨설턴트 페이지(/consultants): 모듈별 월 구독 (수량제/가산)
--       · 모듈 1개 = 월 5만원, 2개 = 10만원 … 모듈당 unit_amount 가산
--       · 카드 1회 등록(빌링키) → 매월 활성 모듈 합계 1건으로 자동청구
--       · 결제 주기: 사용자 최초 결제일 앵커 (anchor_day)
--       · 모듈 중간 추가: 남은 일수만큼 즉시 일할청구(kind='proration'), 다음 달부터 정상 포함
--       · 모듈 해지 / 전체 해지: 일할 환불(kind='refund', 부분취소)
--  ⚠️ 일할 계산은 PortOne 이 아니라 서버(api/billing/*)에서 계산합니다.
--  ⚠️ 카드번호는 저장하지 않습니다. PortOne 이 발급한 billing_key(토큰)만 저장합니다.
-- ============================================================================

create extension if not exists pgcrypto;

-- 공통 updated_at 트리거 함수는 schema.sql 의 public.set_updated_at() 를 재사용합니다.
-- (없을 경우를 대비해 안전하게 재정의)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ── 1) billing_products : 판매 상품(일회성/구독) 카탈로그 ─────────────────────
--     서버가 결제 금액을 검증할 때의 "정답 금액" 소스이기도 합니다.
create table if not exists public.billing_products (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,                       -- 슬러그 (예: 'funding-consulting', 'iso-3')
  name        text not null,
  kind        text not null check (kind in ('one_time','subscription')),
  audience    text not null default 'ceo' check (audience in ('ceo','consultant')),
  tool_id     uuid references public.tools(id) on delete set null,  -- 구독 모듈이 연결된 도구
  amount      integer not null check (amount >= 0),        -- 원 단위 (구독은 월 단가)
  interval    text check (interval in ('month')),          -- 구독만 사용
  active      boolean not null default true,
  sort        integer not null default 0,
  memo        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_billing_products_kind on public.billing_products(kind) where active;
drop trigger if exists trg_billing_products_updated on public.billing_products;
create trigger trg_billing_products_updated before update on public.billing_products
  for each row execute function public.set_updated_at();

-- ── 2) billing_keys : PortOne 빌링키(카드 등록 토큰) ─────────────────────────
create table if not exists public.billing_keys (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  provider     text not null default 'portone',
  billing_key  text not null,                              -- PortOne billingKey (토큰)
  customer_key text,
  card_name    text,                                       -- 카드사 (표시용)
  card_last4   text,                                       -- 마스킹 뒷 4자리 (표시용)
  status       text not null default 'active' check (status in ('active','deleted')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_billing_keys_user on public.billing_keys(user_id) where status = 'active';
drop trigger if exists trg_billing_keys_updated on public.billing_keys;
create trigger trg_billing_keys_updated before update on public.billing_keys
  for each row execute function public.set_updated_at();

-- ── 3) subscriptions : 사용자별 구독 (1인 1구독, 라인은 subscription_items) ──
create table if not exists public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  billing_key_id       uuid references public.billing_keys(id) on delete set null,
  status               text not null default 'active'
                         check (status in ('active','past_due','canceled')),
  anchor_day           integer check (anchor_day between 1 and 28),  -- 매월 청구 기준일(1~28 정규화)
  current_period_start timestamptz,
  current_period_end   timestamptz,
  next_billing_at      timestamptz,
  canceled_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id)
);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_due
  on public.subscriptions(next_billing_at) where status = 'active';
drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ── 4) subscription_items : 구독 내 모듈별 라인 (수량제/가산) ────────────────
create table if not exists public.subscription_items (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  product_id      uuid not null references public.billing_products(id),
  tool_id         uuid references public.tools(id) on delete set null,
  unit_amount     integer not null check (unit_amount >= 0),  -- 월 단가 스냅샷(가격 변동 영향 차단)
  status          text not null default 'active' check (status in ('active','canceled')),
  added_at        timestamptz not null default now(),
  canceled_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
-- 같은 구독에서 동일 모듈은 활성 1개만 허용(재구독은 이전 행 canceled 후 새 행)
create unique index if not exists uq_sub_item_active
  on public.subscription_items(subscription_id, product_id) where status = 'active';
create index if not exists idx_sub_items_sub on public.subscription_items(subscription_id);
drop trigger if exists trg_sub_items_updated on public.subscription_items;
create trigger trg_sub_items_updated before update on public.subscription_items
  for each row execute function public.set_updated_at();

-- ── 5) payments 확장 : PortOne 필드 + 구독/일할/환불 지원 ────────────────────
alter table public.payments
  add column if not exists provider        text default 'portone',
  add column if not exists kind            text
                                             check (kind in ('one_time','subscription','proration','refund')),
  add column if not exists product_id      uuid references public.billing_products(id),
  add column if not exists subscription_id uuid references public.subscriptions(id) on delete set null,
  add column if not exists merchant_uid    text,   -- 우리 주문번호 (PortOne paymentId)
  add column if not exists pg_tx_id        text,   -- PortOne 거래 식별자 (txId 등)
  add column if not exists method          text,   -- card/kakaopay 등
  add column if not exists receipt_url     text,
  add column if not exists refunded_amount integer not null default 0,
  add column if not exists raw             jsonb;

-- 구독/플랫폼 결제는 특정 tool 에 매이지 않으므로 tool_id 를 nullable 로 완화
alter table public.payments alter column tool_id drop not null;

-- 주문번호 유니크 (중복 결제/재시도 방지)
create unique index if not exists uq_payments_merchant
  on public.payments(merchant_uid) where merchant_uid is not null;

-- payment_status 에 부분환불/취소 상태 추가
alter table public.payments drop constraint if exists payments_payment_status_check;
alter table public.payments add constraint payments_payment_status_check
  check (payment_status in ('pending','paid','failed','refunded','partially_refunded','canceled'));

-- ============================================================================
-- RLS (행 수준 보안)
--  · 서버리스 API 는 service_role 키로 RLS 를 우회하여 write 합니다.
--  · 클라이언트(authenticated)는 본인 데이터 read 위주로만 허용합니다.
-- ============================================================================
alter table public.billing_products     enable row level security;
alter table public.billing_keys         enable row level security;
alter table public.subscriptions        enable row level security;
alter table public.subscription_items   enable row level security;

-- billing_products: 활성 상품은 로그인 사용자 read, 변경은 admin
drop policy if exists billing_products_select on public.billing_products;
create policy billing_products_select on public.billing_products for select to authenticated
  using (active = true or public.is_admin());
drop policy if exists billing_products_admin_write on public.billing_products;
create policy billing_products_admin_write on public.billing_products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- billing_keys: 본인/admin read. (발급 저장은 서버 service_role 로만)
drop policy if exists billing_keys_select on public.billing_keys;
create policy billing_keys_select on public.billing_keys for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists billing_keys_admin_write on public.billing_keys;
create policy billing_keys_admin_write on public.billing_keys for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- subscriptions: 본인/admin read. (생성/청구/해지는 서버)
drop policy if exists subscriptions_select on public.subscriptions;
create policy subscriptions_select on public.subscriptions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists subscriptions_admin_write on public.subscriptions;
create policy subscriptions_admin_write on public.subscriptions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- subscription_items: 소유 구독 본인/admin read.
drop policy if exists sub_items_select on public.subscription_items;
create policy sub_items_select on public.subscription_items for select to authenticated
  using (
    exists (
      select 1 from public.subscriptions s
      where s.id = subscription_id and (s.user_id = auth.uid() or public.is_admin())
    )
  );
drop policy if exists sub_items_admin_write on public.subscription_items;
create policy sub_items_admin_write on public.subscription_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 시드: 대표 페이지 일회성 상품(고정가 + ISO 선택형)
--  · 금액은 원 단위. businessPackages.ts 와 코드(슬러그)를 맞춥니다.
--  · 고용지원금(employment-subsidy) / 성장 로드맵(growth-roadmap-package) 은
--    상담형이라 등록하지 않습니다.
-- ============================================================================
insert into public.billing_products (code, name, kind, audience, amount, sort) values
  ('funding-consulting',     '정책자금 컨설팅',            'one_time', 'ceo',  500000, 10),
  ('venture-innovation',     '벤처인증 패키지(혁신성장형)', 'one_time', 'ceo', 1990000, 20),
  ('venture-investment',     '벤처인증 패키지(투자유형)',   'one_time', 'ceo', 4990000, 30),
  ('responsive-homepage',    '반응형 홈페이지 제작',        'one_time', 'ceo',  490000, 40),
  ('ai-ax-system',           'AI 기반 회사 운영시스템 구축','one_time', 'ceo', 1290000, 50),
  ('rnd-center',             '기업부설연구소 설립',        'one_time', 'ceo', 1490000, 60),
  ('mainbiz-certification',  '메인비즈 인증',              'one_time', 'ceo', 1990000, 70),
  ('innobiz-certification',  '이노비즈 인증',              'one_time', 'ceo', 2490000, 80),
  ('iso-1',                  'ISO 인증 1종',              'one_time', 'ceo', 1490000, 91),
  ('iso-2',                  'ISO 인증 2종',              'one_time', 'ceo', 2780000, 92),
  ('iso-3',                  'ISO 인증 3종 패키지',        'one_time', 'ceo', 3990000, 93)
on conflict (code) do update set
  name = excluded.name, kind = excluded.kind, audience = excluded.audience,
  amount = excluded.amount, sort = excluded.sort;

-- 시드: 컨설턴트 모듈 월 구독 (기존 공개 도구 = 모듈, 모듈당 월 5만원 기본)
--  · 실제 모듈은 계속 추가 중 → 관리자 화면에서 amount/active 를 조정하세요.
--  · 비공개 도구(주식 EXIT)는 제외.
insert into public.billing_products (code, name, kind, audience, tool_id, amount, interval, sort)
select 'sub-' || t.slug, t.title || ' 월 구독', 'subscription', 'consultant', t.id, 50000, 'month', 100
from public.tools t
where t.is_public = true
on conflict (code) do update set
  name = excluded.name, tool_id = excluded.tool_id, amount = excluded.amount, interval = excluded.interval;
