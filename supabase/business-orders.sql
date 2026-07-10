-- ============================================================================
-- 미래 AI 랩 — 서비스몰 카드결제 주문 기록 (PortOne V2)
-- ▶ Supabase SQL Editor 에서 실행. 여러 번 실행해도 안전(idempotent).
-- ▶ 기존 테이블(profiles/tools/payments/business_diagnosis_* 등)은 건드리지 않습니다.
--    쓰기는 서버(api/billing/complete.ts, service_role)만 수행하고,
--    조회는 관리자(profiles.role='admin')만 가능합니다.
-- ============================================================================

create table if not exists public.business_orders (
  id           uuid primary key default gen_random_uuid(),
  payment_id   text unique not null,          -- PortOne paymentId (중복 결제 방지 키)
  slug         text not null,                 -- 상품 slug (예: funding-consulting)
  variant_idx  integer not null default 0,    -- 옵션 인덱스 (ISO 1/2/3종 등)
  order_name   text,
  amount       integer not null,              -- 결제 금액(원) — 서버 가격표로 검증된 값
  currency     text not null default 'KRW',
  status       text not null default 'paid' check (status in ('paid','cancelled','refunded')),
  buyer_name   text,
  buyer_phone  text,
  buyer_email  text,
  paid_at      timestamptz,
  receipt_url  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_business_orders_slug on public.business_orders (slug, created_at desc);
create index if not exists idx_business_orders_status on public.business_orders (status);

-- updated_at 자동 갱신 (schema.sql 의 set_updated_at 재사용)
drop trigger if exists trg_business_orders_updated on public.business_orders;
create trigger trg_business_orders_updated
  before update on public.business_orders
  for each row execute function public.set_updated_at();

-- RLS: 익명 접근 차단. service_role 은 RLS 우회(서버 기록), 관리자만 조회.
alter table public.business_orders enable row level security;

drop policy if exists "business_orders_admin_select" on public.business_orders;
create policy "business_orders_admin_select" on public.business_orders
  for select to authenticated using (public.is_admin());

drop policy if exists "business_orders_admin_update" on public.business_orders;
create policy "business_orders_admin_update" on public.business_orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
