-- ============================================================================
-- 미래 AI 랩 — 결제정책 기반 (가격 버전·환불정책·구독기간·일할계산·감사로그)
-- ▶ 실행 순서: schema.sql → payments-subscriptions.sql → portone-one-time-payments.sql → 이 파일
--    (Supabase SQL Editor 에서 실행. 여러 번 실행해도 안전하도록 작성했습니다.)
--
-- 이 파일이 하는 일 (⚠️ 실제 환불 실행·빌링키·자동결제는 포함하지 않음 — 정책 기반만):
--  1) user_roles              : 한 사용자가 ceo/consultant/admin 역할을 동시에 보유 (profiles.role 은 호환 유지)
--  2) billing_prices          : 상품 가격 버전 관리 — 가격이 바뀌어도 기존 결제·구독 금액은 불변
--  3) billing_product_policies: 상품별 환불·취소·일할 정책 (코드 수정 없이 DB 로 변경)
--  4) product_payments 확장    : 결제 당시 가격 스냅샷 (billing_price_id / price_version)
--  5) service_orders 확장      : 서비스 시작·진행·환불검토 상태
--  6) subscriptions 확장       : 가입일 anchor 기반 결제주기(1~31 클램프), 해지예약, 상태 확장
--  7) subscription_items 확장  : 모듈별 가격 스냅샷·제거예약 (unit_amount 스냅샷은 기존 유지)
--  8) subscription_price_changes : 가격 변경 예약 (이번엔 스키마만 — 자동 적용 없음)
--  9) billing_refund_requests  : 환불 요청·계산 스냅샷 (실제 PortOne 취소 호출 없음)
-- 10) billing_audit_logs       : 가격·정책·환불·구독 변경 감사 로그
--
-- 기존 매핑(중복 컬럼 생성 대신 재사용):
--  · subscriptions.anchor_day        → billing_anchor_day (check 를 1~28 → 1~31 로 완화)
--  · subscriptions.canceled_at       → cancelled_at
--  · subscription_items.added_at     → activated_at
--  · subscription_items.canceled_at  → removed_at
--  · subscription_items.unit_amount  → 가입 당시 단가 스냅샷 (기존 그대로)
-- ============================================================================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 1) user_roles — 복수 역할 (ceo / consultant / admin)
--    profiles.role('user','admin') 은 기존 코드 호환용으로 그대로 둡니다.
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null check (role in ('ceo','consultant','admin')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
create index if not exists idx_user_roles_user on public.user_roles(user_id);

-- 역할 판정 함수 — user_roles 또는 기존 profiles.role='admin' 호환
create or replace function public.has_role(check_role text)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = check_role)
      or (check_role = 'admin'
          and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
$$;

-- 기존 관리자 계정을 user_roles 에도 반영 (재실행 안전)
insert into public.user_roles (user_id, role)
select id, 'admin' from public.profiles where role = 'admin'
on conflict (user_id, role) do nothing;

-- ────────────────────────────────────────────────────────────────────────────
-- 2) billing_prices — 가격 버전 (가격의 역사 보존, 삭제 대신 종료)
--    · 신규 결제/구독: effective_from 기준 최신 active 가격
--    · 기존 결제/구독: 스냅샷(unit_amount / product_payments.amount) 그대로 — 자동 변경 금지
--    · billing_products.amount 는 호환 필드로 유지 (v1 가격과 동기 시드)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.billing_prices (
  id                 uuid primary key default gen_random_uuid(),
  billing_product_id uuid not null references public.billing_products(id) on delete cascade,
  price_version      integer not null check (price_version >= 1),
  amount             integer not null check (amount >= 0),
  currency           text not null default 'KRW',
  billing_interval   text not null check (billing_interval in ('one_time','month')),
  effective_from     timestamptz not null default now(),
  effective_to       timestamptz,
  active             boolean not null default true,
  applies_to_existing_subscriptions boolean not null default false,
  created_at         timestamptz not null default now(),
  unique (billing_product_id, price_version),
  check (effective_to is null or effective_to > effective_from)
);
create index if not exists idx_billing_prices_product
  on public.billing_prices(billing_product_id, active, effective_from desc);

-- 같은 상품에 '현재 유효한' active 가격이 동시에 2개 이상 생기지 않도록
-- (effective_to 가 없는 열린 가격은 상품당 1개만)
create unique index if not exists uq_billing_prices_open
  on public.billing_prices(billing_product_id) where active and effective_to is null;

-- v1 시드 — 기존 billing_products.amount 를 가격 버전 1 로 이관 (이미 있으면 건너뜀)
insert into public.billing_prices (billing_product_id, price_version, amount, currency, billing_interval, effective_from, active)
select p.id, 1, p.amount, 'KRW',
       case when p.kind = 'one_time' then 'one_time' else 'month' end,
       now(), true
from public.billing_products p
where not exists (select 1 from public.billing_prices bp where bp.billing_product_id = p.id);

-- ────────────────────────────────────────────────────────────────────────────
-- 3) billing_product_policies — 상품별 결제·환불·일할 정책 (DB 설정으로 변경)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.billing_product_policies (
  id                                uuid primary key default gen_random_uuid(),
  billing_product_id                uuid unique not null references public.billing_products(id) on delete cascade,
  full_refund_before_service_start  boolean not null default true,
  cancellation_window_days          integer check (cancellation_window_days is null or cancellation_window_days >= 0),
  refund_after_service_start        text not null default 'manual_review'
    check (refund_after_service_start in ('none','manual_review','prorated','custom')),
  partial_refund_allowed            boolean not null default true,
  admin_approval_required           boolean not null default true,
  service_start_trigger             text not null default 'manual'
    check (service_start_trigger in ('manual','consultation_started','document_analysis_started','planning_started','production_started')),
  subscription_cancel_default      text not null default 'period_end'
    check (subscription_cancel_default in ('period_end','immediate')),
  subscription_immediate_cancel_allowed boolean not null default true,
  module_add_proration_enabled      boolean not null default true,
  module_remove_policy              text not null default 'next_period'
    check (module_remove_policy in ('next_period','immediate_prorated_refund')),
  proration_rounding                text not null default 'floor'
    check (proration_rounding in ('floor','round','ceil')),
  minimum_charge_amount             integer not null default 0 check (minimum_charge_amount >= 0),
  policy_version                    text not null default 'v1',
  active                            boolean not null default true,
  created_at                        timestamptz not null default now(),
  updated_at                        timestamptz not null default now()
);
drop trigger if exists trg_billing_product_policies_updated on public.billing_product_policies;
create trigger trg_billing_product_policies_updated
  before update on public.billing_product_policies
  for each row execute function public.set_updated_at();

-- 기본 정책 시드 — 대표자 일회성: 시작 전 전액환불·시작 후 관리자 검토·부분환불 허용·승인 필수
--                 컨설턴트 구독: 기간종료 해지 기본·즉시해지 허용(일할)·모듈추가 즉시 일할·제거는 다음 주기
insert into public.billing_product_policies (billing_product_id)
select p.id from public.billing_products p
where not exists (select 1 from public.billing_product_policies pol where pol.billing_product_id = p.id);

-- ────────────────────────────────────────────────────────────────────────────
-- 4) product_payments — 결제 당시 가격 스냅샷 (향후 가격 변경과 분리)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.product_payments
  add column if not exists billing_price_id uuid references public.billing_prices(id) on delete set null,
  add column if not exists price_version    integer;

-- ────────────────────────────────────────────────────────────────────────────
-- 5) service_orders — 서비스 시작·진행·환불검토 상태
-- ────────────────────────────────────────────────────────────────────────────
alter table public.service_orders
  add column if not exists service_started_at      timestamptz,
  add column if not exists service_start_type      text
    check (service_start_type is null or service_start_type in
      ('manual','consultation_started','document_analysis_started','planning_started','production_started')),
  add column if not exists service_started_by      uuid references public.profiles(id) on delete set null,
  add column if not exists service_progress_percent integer not null default 0
    check (service_progress_percent between 0 and 100),
  add column if not exists refund_eligibility      text
    check (refund_eligibility is null or refund_eligibility in ('full','partial_review','none','manual_review')),
  add column if not exists refund_review_status    text not null default 'not_requested'
    check (refund_review_status in ('not_requested','requested','approved','rejected','completed')),
  add column if not exists completed_at            timestamptz;

-- ────────────────────────────────────────────────────────────────────────────
-- 6) subscriptions — 가입일 anchor 결제주기·해지예약·상태 확장
--    (기존 1인 1구독·컬럼 재사용, anchor_day 제약을 1~28 → 1~31 로 완화:
--     월말 anchor 는 계산 함수가 해당 월 말일로 클램프)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.subscriptions drop constraint if exists subscriptions_anchor_day_check;
alter table public.subscriptions add constraint subscriptions_anchor_day_check
  check (anchor_day is null or anchor_day between 1 and 31);

alter table public.subscriptions drop constraint if exists subscriptions_status_check;
alter table public.subscriptions add constraint subscriptions_status_check
  check (status in ('trialing','active','past_due','paused','cancel_scheduled','cancelled','canceled','expired'));

alter table public.subscriptions
  add column if not exists started_at           timestamptz,
  add column if not exists billing_anchor_time  timestamptz,   -- 최초 결제 시각 (시·분·초 anchor)
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists ended_at             timestamptz,
  add column if not exists price_change_policy  text not null default 'new_customers_only'
    check (price_change_policy in ('new_customers_only','existing_from_next_period','all_immediately','manual_migration'));

-- ────────────────────────────────────────────────────────────────────────────
-- 7) subscription_items — 가격 버전 스냅샷·수량·제거 예약
--    (unit_amount 는 기존부터 '당시 단가 스냅샷' — billing_prices 변경에 영향받지 않음)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.subscription_items drop constraint if exists subscription_items_status_check;
alter table public.subscription_items add constraint subscription_items_status_check
  check (status in ('active','canceled','pending_add','removal_scheduled','removed'));

alter table public.subscription_items
  add column if not exists billing_price_id     uuid references public.billing_prices(id) on delete set null,
  add column if not exists quantity             integer not null default 1 check (quantity >= 1),
  add column if not exists scheduled_removal_at timestamptz;

-- ────────────────────────────────────────────────────────────────────────────
-- 8) subscription_price_changes — 가격 변경 예약 (이번 작업: 스키마만, 자동 적용 없음)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.subscription_price_changes (
  id                   uuid primary key default gen_random_uuid(),
  subscription_id      uuid not null references public.subscriptions(id) on delete cascade,
  subscription_item_id uuid references public.subscription_items(id) on delete cascade,
  old_price_id         uuid references public.billing_prices(id),
  new_price_id         uuid not null references public.billing_prices(id),
  effective_at         timestamptz not null,
  status               text not null default 'scheduled' check (status in ('scheduled','applied','cancelled')),
  created_at           timestamptz not null default now()
);
create index if not exists idx_sub_price_changes_due
  on public.subscription_price_changes(effective_at) where status = 'scheduled';

-- ────────────────────────────────────────────────────────────────────────────
-- 9) billing_refund_requests — 환불 요청·계산 스냅샷 (PortOne 취소 호출은 다음 작업)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.billing_refund_requests (
  id                     uuid primary key default gen_random_uuid(),
  payment_id             uuid references public.payments(id) on delete set null,          -- 컨설턴트 결제(레거시)
  product_payment_id     uuid references public.product_payments(id) on delete set null,  -- 대표자 일회성 결제
  subscription_id        uuid references public.subscriptions(id) on delete set null,
  request_type           text not null check (request_type in
    ('one_time_full','one_time_partial','subscription_immediate','module_removal','manual')),
  requested_amount       integer not null check (requested_amount >= 0),
  calculated_amount      integer not null check (calculated_amount >= 0),
  approved_amount        integer check (approved_amount is null or approved_amount >= 0),
  reason                 text,
  calculation_snapshot   jsonb,
  policy_snapshot        jsonb,
  status                 text not null default 'requested' check (status in
    ('requested','calculating','pending_review','approved','rejected','processing','completed','failed')),
  requested_by           uuid references public.profiles(id) on delete set null,
  reviewed_by            uuid references public.profiles(id) on delete set null,
  requested_at           timestamptz not null default now(),
  reviewed_at            timestamptz,
  completed_at           timestamptz,
  portone_cancellation_id text,
  failure_message        text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  check (payment_id is not null or product_payment_id is not null or subscription_id is not null)
);
create index if not exists idx_refund_requests_status on public.billing_refund_requests(status, requested_at desc);
create index if not exists idx_refund_requests_product_payment on public.billing_refund_requests(product_payment_id);
drop trigger if exists trg_billing_refund_requests_updated on public.billing_refund_requests;
create trigger trg_billing_refund_requests_updated
  before update on public.billing_refund_requests
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 10) billing_audit_logs — 가격·정책·환불·구독 변경 감사 로그 (카드정보·secret 저장 금지)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.billing_audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  actor_type    text not null default 'system' check (actor_type in ('customer','admin','system','webhook')),
  entity_type   text not null,
  entity_id     text,
  action        text not null,
  before_data   jsonb,
  after_data    jsonb,
  reason        text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_billing_audit_entity on public.billing_audit_logs(entity_type, entity_id, created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS
--  · 쓰기(가격·정책·환불·감사)는 service_role 서버만 (RLS 우회)
--  · 일반 사용자: 본인 user_roles / 본인 구독·구독항목만 조회
--  · 관리자: 전체 조회 (+ 정책·가격 관리)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.user_roles                 enable row level security;
alter table public.billing_prices             enable row level security;
alter table public.billing_product_policies   enable row level security;
alter table public.subscription_price_changes enable row level security;
alter table public.billing_refund_requests    enable row level security;
alter table public.billing_audit_logs         enable row level security;

drop policy if exists user_roles_self_select on public.user_roles;
create policy user_roles_self_select on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists billing_prices_admin_select on public.billing_prices;
create policy billing_prices_admin_select on public.billing_prices
  for select to authenticated using (public.is_admin());
drop policy if exists billing_prices_admin_write on public.billing_prices;
create policy billing_prices_admin_write on public.billing_prices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists billing_policies_admin_select on public.billing_product_policies;
create policy billing_policies_admin_select on public.billing_product_policies
  for select to authenticated using (public.is_admin());
drop policy if exists billing_policies_admin_write on public.billing_product_policies;
create policy billing_policies_admin_write on public.billing_product_policies
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists sub_price_changes_admin_select on public.subscription_price_changes;
create policy sub_price_changes_admin_select on public.subscription_price_changes
  for select to authenticated using (public.is_admin());

drop policy if exists refund_requests_admin_select on public.billing_refund_requests;
create policy refund_requests_admin_select on public.billing_refund_requests
  for select to authenticated using (public.is_admin());
drop policy if exists refund_requests_admin_update on public.billing_refund_requests;
create policy refund_requests_admin_update on public.billing_refund_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists billing_audit_admin_select on public.billing_audit_logs;
create policy billing_audit_admin_select on public.billing_audit_logs
  for select to authenticated using (public.is_admin());

-- 구독: 본인 조회 (기존 정책이 있으면 대체 — 본인 또는 관리자)
drop policy if exists subscriptions_select on public.subscriptions;
create policy subscriptions_select on public.subscriptions
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists sub_items_select on public.subscription_items;
create policy sub_items_select on public.subscription_items
  for select to authenticated using (
    exists (select 1 from public.subscriptions s where s.id = subscription_id and s.user_id = auth.uid())
    or public.is_admin()
  );
