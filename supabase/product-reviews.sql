-- 상품 리뷰 (product_reviews)
-- 정책자금 컨설팅 등 서비스몰 상품의 고객 후기. 리뷰 작성 시 전자책 3종 증정(수동 발송) 연동.
-- 작성은 누구나 가능(비회원 포함)하되 status='pending' 으로 접수되고, 관리자 승인 후에만 공개됩니다.
-- 공개 조회·작성·모더레이션은 모두 서버(service_role) API(/api/reviews) 경유 — 클라이언트 직접 접근 차단
-- (연락처 이메일·전화 등 PII 가 공개 조회에 노출되지 않도록).
-- 재실행 안전(idempotent). Supabase SQL Editor 에서 실행하세요.

create table if not exists public.product_reviews (
  id            uuid primary key default gen_random_uuid(),
  product_slug  text not null,                         -- 대상 상품 slug (예: funding-consulting)
  author_name   text not null,                         -- 표시용 작성자명 (예: 김대표, 이○○)
  company       text,                                  -- 회사/업종 (선택, 표시용)
  rating        integer not null check (rating between 1 and 5),
  content       text not null,                         -- 리뷰 본문
  contact_email text,                                  -- 전자책 발송용 (비공개, 서버에서만 조회)
  contact_phone text,                                  -- 전자책 발송 확인용 (비공개)
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  ebook_sent    boolean not null default false,        -- 전자책 3종 발송 완료 여부
  admin_memo    text,                                  -- 관리자 메모 (선택)
  source_ip     text,                                  -- 스팸 방지용 접수 IP (비공개)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists product_reviews_slug_status_idx
  on public.product_reviews (product_slug, status, created_at desc);
create index if not exists product_reviews_status_idx
  on public.product_reviews (status, created_at desc);

-- updated_at 자동 갱신
create or replace function public.touch_product_reviews_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_product_reviews_updated_at on public.product_reviews;
create trigger trg_product_reviews_updated_at
  before update on public.product_reviews
  for each row execute function public.touch_product_reviews_updated_at();

alter table public.product_reviews enable row level security;

-- 관리자만 직접 조회 가능. 공개 조회/작성/모더레이션은 모두 service_role API 경유.
-- (쓰기 정책 없음 = 클라이언트 직접 insert/update 차단 → 상태 조작·스팸 방지)
drop policy if exists product_reviews_select_admin on public.product_reviews;
create policy product_reviews_select_admin on public.product_reviews
  for select using (public.is_admin());
