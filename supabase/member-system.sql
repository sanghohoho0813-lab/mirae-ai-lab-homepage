-- ─────────────────────────────────────────────────────────────
-- 미래 AI 랩 — 회원 시스템 개선 (회원유형 / 휴대폰 인증 / 본인인증 준비)
-- Supabase SQL Editor 에서 실행하세요. (기존 schema.sql 이후, 재실행 안전)
-- 원칙:
--  * 기존 profiles / RLS / 관리자(role=admin) 로직은 그대로 유지 (추가만)
--  * member_type 은 role(user/admin)과 별개 축 — 관리자는 member_type 이 null 이어도 됨
--  * 휴대폰 SMS 인증 기록은 service_role(서버 API) 전용, anon/authenticated 직접 접근 불가
-- ─────────────────────────────────────────────────────────────

-- 1) profiles 확장 (전부 nullable/기본값 — 기존 데이터 호환)
alter table public.profiles
  add column if not exists member_type          text
    check (member_type is null or member_type in ('business','consultant')),
  add column if not exists phone_verified        boolean not null default false,
  add column if not exists identity_verified     boolean not null default false,
  add column if not exists identity_provider     text,        -- 'portone_pass' 등 (추후)
  add column if not exists identity_ci           text,        -- 본인인증 CI (추후, 서버에서만 기록)
  add column if not exists identity_verified_at  timestamptz,
  add column if not exists phone_verified_at     timestamptz;

create index if not exists idx_profiles_member_type on public.profiles (member_type);

-- 2) 가입 트리거 갱신 — member_type / phone_verified 를 메타데이터에서 반영
--    (관리자 이메일이면 role=admin 은 그대로 유지)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (
    id, email, name, phone, organization, role, member_type, phone_verified, last_login_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'organization', ''),
    case when lower(new.email) = lower('sanghohoho0813@gmail.com') then 'admin' else 'user' end,
    -- 소셜 로그인 등 member_type 미지정 시 null → 온보딩에서 선택
    case when new.raw_user_meta_data->>'member_type' in ('business','consultant')
         then new.raw_user_meta_data->>'member_type' else null end,
    -- phone_verified 는 서버 확인(api/phone-verification confirm) 전까지 false 로 시작
    false,
    now()
  )
  on conflict (id) do nothing;   -- 재실행/경합 안전
  return new;
end; $$;

-- 3) 휴대폰 SMS 인증 기록 (서버 API 전용)
--    send: 코드 해시 저장 → verify: 해시·만료·시도횟수 검증 → confirm: 가입 후 profiles.phone_verified=true
create table if not exists public.phone_verifications (
  id           uuid primary key default gen_random_uuid(),
  phone        text not null,
  code_hash    text not null,               -- sha256(code + salt) — 평문 코드는 저장하지 않음
  purpose      text not null default 'signup' check (purpose in ('signup','identity','recover')),
  attempts     integer not null default 0,
  verified     boolean not null default false,
  verified_at  timestamptz,
  consumed     boolean not null default false,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);
create index if not exists idx_phone_verif_phone on public.phone_verifications (phone, created_at desc);
create index if not exists idx_phone_verif_expires on public.phone_verifications (expires_at);

-- RLS: anon/authenticated 직접 접근 전면 차단 (정책 없음 = 차단). 서버 service_role 만 접근.
alter table public.phone_verifications enable row level security;

-- ── 참고: 본인인증(PASS) ────────────────────────────────────────
-- 실제 PortOne 본인인증 연동 시 identity_verified / identity_provider / identity_ci /
-- identity_verified_at 를 서버(webhook·검증 API)에서만 갱신합니다. 클라이언트 직접 수정 금지.
-- (profiles RLS 의 update 정책은 본인/admin 이지만, 민감 필드는 서버 service_role 로만 세팅)
