-- ─────────────────────────────────────────────────────────────
-- 미래 AI 랩 — 인증·본인인증 기반 (auth-identity-foundation)
-- 실행 순서: schema.sql → billing-policy-foundation.sql(user_roles) → member-system.sql → 이 파일
--   (user_roles 가 없으면 이 파일이 안전하게 생성합니다 — 재실행 안전)
-- 원칙:
--  * 기존 profiles 데이터·role check('user','admin')·관리자 호환 유지 (컬럼 추가만)
--  * 본인인증 결과는 최소수집: 이름·휴대폰·출생연도·만14세여부·CI 단방향 HMAC 해시만
--    (주민번호·CI/DI 원문·통신사 원문응답 저장 금지)
--  * identity_verifications 는 서버(service_role) 전용 기록 — 익명/일반 사용자 직접 접근 불가
--  * user_consents 는 본인 조회 가능, 기록은 서버 경유
--  * 여러 번 실행해도 안전 (add column if not exists / on conflict / drop policy if exists)
-- ─────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- 0) user_roles — billing-policy-foundation.sql 미실행 환경 대비 (동일 정의, 재실행 안전)
create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null check (role in ('ceo','consultant','admin')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
create index if not exists idx_user_roles_user on public.user_roles(user_id);

create or replace function public.has_role(check_role text)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = check_role)
      or (check_role = 'admin'
          and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
$$;

-- 1) profiles — 온보딩·가입경로 컬럼 (전부 nullable/기본값, 기존 데이터 보존)
alter table public.profiles
  add column if not exists onboarding_status        text not null default 'pending'
    check (onboarding_status in ('pending','identity_required','email_verification_required','completed')),
  add column if not exists terms_agreed_at          timestamptz,
  add column if not exists privacy_agreed_at        timestamptz,
  add column if not exists role_selected_at         timestamptz,
  add column if not exists signup_completed_at      timestamptz,
  add column if not exists initial_signup_provider  text,
  add column if not exists last_login_provider      text;

-- 기존 회원 백필 — 이 마이그레이션 이전에 가입한 회원은 '가입 완료'로 간주 (로그인 유지)
update public.profiles
   set onboarding_status = 'completed',
       signup_completed_at = coalesce(signup_completed_at, created_at)
 where onboarding_status = 'pending'
   and created_at < now() - interval '5 minutes';

-- member_type → user_roles 이관 (business→ceo / consultant→consultant, 멱등)
insert into public.user_roles (user_id, role)
select id, 'ceo' from public.profiles where member_type = 'business'
on conflict (user_id, role) do nothing;
insert into public.user_roles (user_id, role)
select id, 'consultant' from public.profiles where member_type = 'consultant'
on conflict (user_id, role) do nothing;
insert into public.user_roles (user_id, role)
select id, 'admin' from public.profiles where role = 'admin'
on conflict (user_id, role) do nothing;

-- 2) 가입 트리거 갱신 — 가입경로 기록 + 온보딩 상태 (관리자 role=admin 로직 불변)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (
    id, email, name, phone, organization, role, member_type, phone_verified,
    onboarding_status, initial_signup_provider, last_login_provider, last_login_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'organization', ''),
    case when lower(new.email) = lower('sanghohoho0813@gmail.com') then 'admin' else 'user' end,
    case when new.raw_user_meta_data->>'member_type' in ('business','consultant')
         then new.raw_user_meta_data->>'member_type' else null end,
    false,  -- phone_verified 는 서버 본인인증(attach) 후에만 true
    'pending',
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    now()
  )
  on conflict (id) do nothing;
  return new;
end; $$;

-- 3) identity_verifications — PortOne 본인인증 기록 (최소수집, 서버 전용)
create table if not exists public.identity_verifications (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references public.profiles(id) on delete set null,
  verification_id    text not null unique,   -- 서버가 생성한 PortOne identityVerificationId
  provider           text not null default 'portone',
  environment        text not null default 'test' check (environment in ('test','live')),
  status             text not null default 'prepared'
    check (status in ('prepared','verified','used','failed','expired')),
  verified_name      text,
  verified_phone     text,
  birth_year         integer,
  age_over_14        boolean,
  identity_hash      text,                   -- CI 의 단방향 HMAC (원문 미저장, 중복가입 방지용)
  initial_session_id text,                   -- 가입 전 임시 세션 식별 (브라우저 발급 랜덤 id)
  fail_reason        text,
  expires_at         timestamptz not null,
  verified_at        timestamptz,
  used_at            timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_identity_verif_user on public.identity_verifications(user_id);
create index if not exists idx_identity_verif_status on public.identity_verifications(status, created_at desc);
create index if not exists idx_identity_verif_hash on public.identity_verifications(identity_hash) where identity_hash is not null;

-- 4) user_consents — 약관 동의 기록 (버전·시각·최소 접속정보)
create table if not exists public.user_consents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  consent_key text not null,                 -- terms | privacy | age14 | identity | marketing
  version     text not null,
  agreed      boolean not null default true,
  agreed_at   timestamptz not null default now(),
  ip_hash     text,                          -- sha256(ip+salt) — 원문 IP 미저장
  user_agent  text,
  unique (user_id, consent_key, version)
);
create index if not exists idx_user_consents_user on public.user_consents(user_id);

-- 5) auth_audit_logs — 인증 감사/퍼널 이벤트 (민감정보 금지: provider/role/실패분류 정도만)
create table if not exists public.auth_audit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  event_type text not null,
  provider   text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_auth_audit_type on public.auth_audit_logs(event_type, created_at desc);

-- 6) 비회원 진단기록 → 계정 연결 준비 (테이블이 있는 환경에서만, 멱등)
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'business_diagnosis_sessions') then
    execute 'alter table public.business_diagnosis_sessions add column if not exists claimed_by_user_id uuid';
    execute 'create index if not exists idx_bds_claimed on public.business_diagnosis_sessions(claimed_by_user_id)';
  end if;
end $$;

-- ── updated_at 트리거 ──
create or replace function public.auth_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_identity_verif_touch on public.identity_verifications;
create trigger trg_identity_verif_touch before update on public.identity_verifications
  for each row execute function public.auth_touch_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
alter table public.identity_verifications enable row level security;
alter table public.user_consents          enable row level security;
alter table public.auth_audit_logs        enable row level security;
alter table public.user_roles             enable row level security;

-- identity_verifications: 익명·일반 사용자 직접 접근 전면 차단. 관리자 select 만 (쓰기는 service_role).
drop policy if exists identity_verif_admin_select on public.identity_verifications;
create policy identity_verif_admin_select on public.identity_verifications
  for select to authenticated using (public.is_admin());

-- user_consents: 본인 조회 + 관리자 조회. 기록은 서버(service_role) 경유.
drop policy if exists user_consents_select on public.user_consents;
create policy user_consents_select on public.user_consents
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- auth_audit_logs: 관리자 조회만.
drop policy if exists auth_audit_admin_select on public.auth_audit_logs;
create policy auth_audit_admin_select on public.auth_audit_logs
  for select to authenticated using (public.is_admin());

-- user_roles: 본인 조회 + 관리자 전체 (쓰기는 서버/관리자)
drop policy if exists user_roles_select on public.user_roles;
create policy user_roles_select on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists user_roles_admin_write on public.user_roles;
create policy user_roles_admin_write on public.user_roles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── 실행 후 확인 ──
-- select column_name from information_schema.columns where table_name='profiles' and column_name in
--   ('onboarding_status','initial_signup_provider','last_login_provider');
-- select count(*) from public.user_roles;
-- select tablename from pg_tables where tablename in ('identity_verifications','user_consents','auth_audit_logs');
