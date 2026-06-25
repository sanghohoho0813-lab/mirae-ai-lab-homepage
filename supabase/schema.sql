-- ============================================================================
-- 미래 AI 랩 (Mirae AI Lab) — Supabase 스키마 / RLS / 트리거 / 시드
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
--
-- ⚠️ RLS 정책은 운영 전 Supabase에서 반드시 테스트하세요. (특히 admin 권한)
-- 관리자 이메일: sanghohoho0813@gmail.com (이 이메일로 가입하면 role='admin')
-- ============================================================================

create extension if not exists pgcrypto;

-- ── 공통: updated_at 자동 갱신 ───────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ── 1) profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  name         text not null,
  phone        text unique,
  organization text,
  role         text not null default 'user' check (role in ('user','admin')),
  interests    text[],
  memo         text,
  last_login_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── 2) tools ─────────────────────────────────────────────────────────────────
create table if not exists public.tools (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  title              text not null,
  category           text,
  status             text,
  access_type        text check (access_type in ('public','beta','restricted','private','comingSoon')),
  external_url       text,
  is_public          boolean not null default false,
  is_trial_available boolean not null default true,
  created_at         timestamptz not null default now()
);

-- ── 3) tool_access ───────────────────────────────────────────────────────────
create table if not exists public.tool_access (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  tool_id               uuid not null references public.tools(id) on delete cascade,
  access_status         text not null default 'none'
                          check (access_status in
                            ('none','trial_active','trial_expired','extended_by_review',
                             'extended_by_survey','paid_active','unlimited','revoked')),
  trial_started_at      timestamptz,
  trial_expires_at      timestamptz,
  review_extension_used boolean not null default false,
  survey_extension_used boolean not null default false,
  paid_until            timestamptz,
  is_unlimited          boolean not null default false,
  granted_by_admin      boolean not null default false,
  memo                  text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, tool_id)
);
create index if not exists idx_tool_access_user on public.tool_access(user_id);
create index if not exists idx_tool_access_tool on public.tool_access(tool_id);

drop trigger if exists trg_tool_access_updated on public.tool_access;
create trigger trg_tool_access_updated before update on public.tool_access
  for each row execute function public.set_updated_at();

-- ── 4) reviews ───────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  tool_id    uuid not null references public.tools(id) on delete cascade,
  content    text not null,
  char_count integer not null,
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists idx_reviews_user on public.reviews(user_id);

-- ── 5) surveys ───────────────────────────────────────────────────────────────
create table if not exists public.surveys (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  tool_id    uuid not null references public.tools(id) on delete cascade,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_surveys_user on public.surveys(user_id);

-- ── 6) payments ──────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  tool_id        uuid not null references public.tools(id) on delete cascade,
  plan_id        text,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  amount         integer,
  paid_at        timestamptz,
  expires_at     timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists idx_payments_user on public.payments(user_id);

-- ── 헬퍼: 현재 사용자가 admin 인가 (security definer 로 RLS 재귀 방지) ─────────
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ── 헬퍼: 휴대폰 중복 확인 (가입 전 클라이언트에서 호출, profiles 비노출) ──────
create or replace function public.phone_exists(p text)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where phone = p);
$$;
grant execute on function public.phone_exists(text) to anon, authenticated;

-- ── 가입 시 profiles 자동 생성 트리거 ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone, organization, role, last_login_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'organization', ''),
    case when lower(new.email) = lower('sanghohoho0813@gmail.com') then 'admin' else 'user' end,
    now()
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- RLS 정책  (⚠️ 운영 전 Supabase에서 정책 테스트 필요)
--  - 서버리스 API는 service_role 키를 사용하므로 RLS를 우회합니다(권한 변경 전용).
--  - 클라이언트(anon/authenticated)는 아래 정책의 제한을 받습니다.
-- ============================================================================
alter table public.profiles    enable row level security;
alter table public.tools       enable row level security;
alter table public.tool_access enable row level security;
alter table public.reviews     enable row level security;
alter table public.surveys     enable row level security;
alter table public.payments    enable row level security;

-- profiles: 본인 또는 admin
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated
  with check (id = auth.uid());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- tools: 로그인 사용자는 조회, 변경은 admin 만
drop policy if exists tools_select on public.tools;
create policy tools_select on public.tools for select to authenticated using (true);
drop policy if exists tools_admin_write on public.tools;
create policy tools_admin_write on public.tools for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- tool_access: 본인 조회 / admin 전체. 사용자 직접 update 불가 (서버 API 사용)
drop policy if exists tool_access_select on public.tool_access;
create policy tool_access_select on public.tool_access for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists tool_access_admin_write on public.tool_access;
create policy tool_access_admin_write on public.tool_access for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- reviews: 본인 insert/select, admin 전체 select/update
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists reviews_admin_update on public.reviews;
create policy reviews_admin_update on public.reviews for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- surveys: 본인 insert/select, admin 전체 select
drop policy if exists surveys_select on public.surveys;
create policy surveys_select on public.surveys for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists surveys_insert on public.surveys;
create policy surveys_insert on public.surveys for insert to authenticated
  with check (user_id = auth.uid());

-- payments: 본인 조회 / admin 전체 select·update (insert 는 서버/관리자)
drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists payments_admin_write on public.payments;
create policy payments_admin_write on public.payments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 초기 도구 시드 (현재 미래 AI 랩 도구 목록)
-- 주식 EXIT 는 비공개: is_public=false, is_trial_available=false, access_type='private'
-- ============================================================================
insert into public.tools (slug, title, category, status, access_type, external_url, is_public, is_trial_available)
values
  ('hr-subsidy-pro', '고용지원금 프로', '고용지원금', 'MVP 베타', 'beta',
   'https://hr-subsidy-pro.vercel.app/', true, true),
  ('labcare-rnd-os', '연구소 사후관리 OS', '연구소 관리', 'MVP 베타', 'beta',
   'https://labcare-rnd-os.vercel.app/dashboard', true, true),
  ('corp-sales-os', '법인컨설팅 세일즈 OS', '고객관리·영업', 'MVP 베타', 'restricted',
   'https://corp-sales-os.vercel.app/', true, true),
  ('cretop-analyzer', '크레탑 자동분석기', '기업분석', 'MVP 베타', 'beta',
   'https://corp-sales-os-git-claude-cretop-mini-app-ksh90813.vercel.app/mini.html', true, true),
  ('startup-tax-checker', '창업감면 & 취등록세 체크', '절세', 'MVP 베타', 'beta',
   'https://startup-tax-checker.vercel.app/', true, true),
  ('stock-exit-simulator', '주식 EXIT 솔루션 시뮬레이터', '자본거래', '비공개 검토중', 'private',
   'https://stock-exit-simulator-a1vm.vercel.app/?review=1', false, false)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  status = excluded.status,
  access_type = excluded.access_type,
  external_url = excluded.external_url,
  is_public = excluded.is_public,
  is_trial_available = excluded.is_trial_available;
