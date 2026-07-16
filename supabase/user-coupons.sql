-- 회원가입 축하 쿠폰 (user_coupons)
-- 가입(온보딩 완료) 시 서버(service_role)가 1인 1장 자동 발급. 결제 재개 시 결제 단계에서 차감 연결.
-- 재실행 안전(idempotent). Supabase SQL Editor 에서 실행하세요.

create table if not exists public.user_coupons (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  kind            text not null default 'signup',      -- 발급 종류 (signup = 가입 축하)
  code            text,                                 -- 표시용 코드 (선택)
  amount          integer not null check (amount > 0),  -- 할인 금액(원)
  status          text not null default 'active' check (status in ('active','used','expired','revoked')),
  issued_at       timestamptz not null default now(),
  used_at         timestamptz,
  used_payment_id text,                                 -- 사용된 결제 식별자(product_payments.payment_id)
  expires_at      timestamptz,                          -- 만료(선택, null = 무기한)
  created_at      timestamptz not null default now()
);

-- 가입 쿠폰(kind='signup')은 회원당 1장만 (멱등 발급 보장)
create unique index if not exists user_coupons_signup_once
  on public.user_coupons (user_id) where kind = 'signup';
create index if not exists user_coupons_user_status_idx
  on public.user_coupons (user_id, status);

alter table public.user_coupons enable row level security;

-- 본인(또는 관리자)만 조회. 쓰기 정책 없음 = 클라이언트 직접 발급/사용 차단(서버 service_role 만 기록).
drop policy if exists user_coupons_select_own on public.user_coupons;
create policy user_coupons_select_own on public.user_coupons
  for select using (auth.uid() = user_id or public.is_admin());
