-- ============================================================================
-- profiles 보호 칸 잠금 (2026-10 보안 점검)
--
-- 문제: profiles_update 정책은 "본인 행은 수정 가능"만 보고 '어떤 칸'인지는 보지 않는다.
--       그래서 로그인한 사용자가 공개 키(anon key)로 직접
--         update profiles set role = 'admin' where id = 본인
--       을 보내면 관리자가 될 수 있다(is_admin()·서버 verifyAdmin 이 profiles.role 을 믿는다).
--       phone_verified · identity_verified · member_type · onboarding_status 도 같은 방법으로 바꿀 수 있다.
--
-- 해결: 사이트(브라우저)에서 오는 수정(authenticated · anon 역할)은 아래 '허용 칸'만 바꿀 수 있게 한다.
--       - 허용 칸: name, last_login_at, last_login_provider, updated_at
--         (사이트 코드가 브라우저에서 직접 바꾸는 칸은 이것뿐 — src/lib/auth.tsx, AuthCallbackPage, MyPage)
--       - 서버(api/*, service_role 키) · SQL 편집기(postgres) · 가입 트리거(security definer 함수)는 그대로 통과
--       - 관리자 계정(is_admin())은 그대로 통과
--       허용 칸 '목록' 방식이라 앞으로 생기는 칸도 기본으로 보호된다.
--
-- 적용: Supabase 대시보드 → SQL Editor → 이 파일 전체를 붙여 넣고 Run. 여러 번 실행해도 안전(멱등).
-- 되돌리기: drop trigger if exists profiles_guard_protected_columns on public.profiles;
-- ============================================================================

-- 0) (선택) 적용 전 점검 — 칸 단위 권한이 이미 있는지 확인
-- select grantee, privilege_type, column_name
--   from information_schema.column_privileges
--  where table_schema = 'public' and table_name = 'profiles' and grantee in ('authenticated', 'anon');

-- 1) 보호 함수 — security definer 가 아니어야 current_user 로 '누가 보냈는지' 알 수 있다
create or replace function public.guard_profile_protected_columns()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  allowed constant text[] := array['name', 'last_login_at', 'last_login_provider', 'updated_at'];
  changed text;
begin
  -- 브라우저(공개 키)에서 온 요청만 검사한다. 서버(service_role)·SQL 편집기·내부 함수는 통과
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  -- 관리자 화면에서의 수정은 통과
  if public.is_admin() then
    return new;
  end if;
  -- 바뀐 칸 중 허용 목록 밖의 것이 있으면 거절
  select key into changed
    from jsonb_each(to_jsonb(new)) as n(key, value)
   where n.value is distinct from (to_jsonb(old) -> n.key)
     and n.key <> all (allowed)
   limit 1;
  if changed is not null then
    raise exception 'profiles.% 는 직접 바꿀 수 없습니다', changed
      using errcode = '42501';
  end if;
  return new;
end;
$$;

-- 2) 트리거 — 이름이 'z' 로 시작해 updated_at 자동 갱신 트리거(mirae_trg_profiles_updated 등)보다 뒤에 돈다
drop trigger if exists profiles_guard_protected_columns on public.profiles;
drop trigger if exists z_profiles_guard_protected_columns on public.profiles;
create trigger z_profiles_guard_protected_columns
  before update on public.profiles
  for each row execute function public.guard_profile_protected_columns();

-- 3) 적용 후 확인(선택) — 일반 회원 계정으로 로그인한 브라우저 콘솔에서:
--    await supabase.from('profiles').update({ role: 'admin' }).eq('id', '<내 id>')
--    → error.code = '42501' 이면 정상. 이름 바꾸기(마이페이지)·로그인은 그대로 되어야 한다.
