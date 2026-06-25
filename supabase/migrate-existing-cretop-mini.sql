-- ============================================================================
-- 미래 AI 랩 — 기존 Supabase 프로젝트(cretop-mini → mirae-ai-lab) 추가 마이그레이션
--
-- ✅ 비파괴적: 기존 테이블(analyses, usage_events, profiles)을 DROP/덮어쓰지 않습니다.
--    - profiles: ALTER TABLE ... ADD COLUMN IF NOT EXISTS 로 "없는 컬럼만" 추가
--    - 기존 컬럼/데이터는 절대 수정하지 않습니다.
--    - analyses, usage_events 는 전혀 건드리지 않습니다.
-- ✅ 새 테이블: tools, tool_access, reviews, surveys, payments (CREATE IF NOT EXISTS)
-- ✅ 가입 트리거는 기존 트리거와 충돌하지 않도록 "마지막에 실행 + ON CONFLICT" 처리.
--
-- ⚠️ RLS 정책은 운영 전 Supabase에서 반드시 테스트하세요. (특히 admin 권한)
-- ⚠️ 기존 앱이 profiles RLS=OFF 에 의존했다면, 아래 RLS 활성화 영향을 먼저 검토하세요.
-- 관리자 이메일: sanghohoho0813@gmail.com (이 이메일로 가입하면 role='admin')
-- Supabase SQL Editor 에 전체를 붙여넣고 실행하세요.
-- ============================================================================

create extension if not exists pgcrypto;

-- ── 공통: updated_at 자동 갱신 함수 ──────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================================
-- 1) 기존 profiles 에 "없는 컬럼만" 추가 (ADD COLUMN IF NOT EXISTS = 안전, no-op)
--    - 요청 컬럼: phone, organization, role, updated_at
--    - 미래 AI 랩 기능에 필요(없으면 추가): email, name, memo, last_login_at, created_at, interests
--      → 이미 존재하면 무시됩니다. 기존 컬럼/데이터는 변경하지 않습니다.
-- ============================================================================
alter table public.profiles add column if not exists email         text;
alter table public.profiles add column if not exists name          text;
alter table public.profiles add column if not exists phone         text;
alter table public.profiles add column if not exists organization  text;
alter table public.profiles add column if not exists role          text default 'user';
alter table public.profiles add column if not exists interests     text[];
alter table public.profiles add column if not exists memo          text;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists created_at    timestamptz default now();
alter table public.profiles add column if not exists updated_at    timestamptz default now();

-- role NULL 백필 (기존 행 보호)
update public.profiles set role = 'user' where role is null;

-- 휴대폰 중복 방지(부분 유니크: NULL 제외). 기존 데이터에 중복이 있으면 건너뜁니다.
do $$
begin
  create unique index if not exists profiles_phone_unique
    on public.profiles (phone) where phone is not null;
exception when others then
  raise notice 'profiles phone unique index skipped: %', sqlerrm;
end $$;

-- profiles updated_at 트리거 (이름 분리 → 기존 트리거와 공존)
drop trigger if exists mirae_trg_profiles_updated on public.profiles;
create trigger mirae_trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 2) 새 테이블: tools
-- ============================================================================
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

-- ============================================================================
-- 헬퍼 함수 (create or replace = 안전)
-- ============================================================================
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.phone_exists(p text)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.profiles where phone = p);
$$;
grant execute on function public.phone_exists(text) to anon, authenticated;

-- ============================================================================
-- 가입 시 profiles 보강 트리거 (멱등 / 기존 트리거와 공존)
--  - 트리거명 'zz_' 접두사 → 기존 가입 트리거가 먼저 실행되도록 알파벳 순서상 마지막에 실행
--  - ON CONFLICT (id) DO UPDATE → 행이 이미 있으면(기존 트리거가 만든 경우) 미래 AI 랩 컬럼만 보강
--  - 기존 email/name 은 덮어쓰지 않음(있으면 보존, 없을 때만 채움)
-- ============================================================================
create or replace function public.handle_new_user_mirae()
returns trigger language plpgsql security definer
set search_path = public as $$
declare
  is_admin_email boolean := lower(new.email) = lower('sanghohoho0813@gmail.com');
begin
  insert into public.profiles (id, email, name, phone, organization, role, last_login_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'organization', ''),
    case when is_admin_email then 'admin' else 'user' end,
    now()
  )
  on conflict (id) do update set
    email         = coalesce(profiles.email, excluded.email),
    name          = coalesce(profiles.name, excluded.name),
    phone         = coalesce(profiles.phone, excluded.phone),
    organization  = coalesce(profiles.organization, excluded.organization),
    role          = case when is_admin_email then 'admin' else coalesce(profiles.role, 'user') end,
    last_login_at = now();
  return new;
end; $$;

drop trigger if exists zz_mirae_on_auth_user_created on auth.users;
create trigger zz_mirae_on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user_mirae();

-- ============================================================================
-- RLS  (⚠️ 운영 전 테스트 필요)
--  - profiles: RLS 활성화 + 미래 AI 랩 정책만 추가(mirae_* 이름). 기존 정책은 보존(추가는 OR).
--    ※ 기존 앱이 profiles RLS=OFF 에 의존했다면 먼저 검토하세요.
--  - 새 테이블: RLS 활성화 + 정책.
--  - 서버리스 API는 service_role 키로 RLS를 우회합니다(권한 변경 전용).
-- ============================================================================
alter table public.profiles    enable row level security;
alter table public.tools       enable row level security;
alter table public.tool_access enable row level security;
alter table public.reviews     enable row level security;
alter table public.surveys     enable row level security;
alter table public.payments    enable row level security;

-- profiles: 본인 또는 admin (mirae_* 정책만 추가)
drop policy if exists mirae_profiles_select on public.profiles;
create policy mirae_profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists mirae_profiles_insert on public.profiles;
create policy mirae_profiles_insert on public.profiles for insert to authenticated
  with check (id = auth.uid());
drop policy if exists mirae_profiles_update on public.profiles;
create policy mirae_profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- tools
drop policy if exists tools_select on public.tools;
create policy tools_select on public.tools for select to authenticated using (true);
drop policy if exists tools_admin_write on public.tools;
create policy tools_admin_write on public.tools for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- tool_access (사용자 직접 update 불가 → 서버 API 사용)
drop policy if exists tool_access_select on public.tool_access;
create policy tool_access_select on public.tool_access for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists tool_access_admin_write on public.tool_access;
create policy tool_access_admin_write on public.tool_access for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- reviews
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists reviews_admin_update on public.reviews;
create policy reviews_admin_update on public.reviews for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- surveys
drop policy if exists surveys_select on public.surveys;
create policy surveys_select on public.surveys for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists surveys_insert on public.surveys;
create policy surveys_insert on public.surveys for insert to authenticated
  with check (user_id = auth.uid());

-- payments
drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists payments_admin_write on public.payments;
create policy payments_admin_write on public.payments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 도구 시드 (slug 기준 upsert — 기존 tools 행은 slug로만 갱신, 다른 데이터 영향 없음)
-- 주식 EXIT: is_public=false, is_trial_available=false, access_type='private'
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
