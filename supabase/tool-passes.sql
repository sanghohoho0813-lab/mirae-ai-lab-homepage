-- ============================================================================
-- 초대 링크(게스트 패스) — 로그인 없이, 정해진 기간 동안만 특정 도구를 열 수 있는 링크.
--
-- 쓰임새: 정식 런칭 준비로 막아 둔 도구를 특정인에게만 "며칠 더" 열어줄 때.
-- 링크를 가진 사람은 누구나 열 수 있으므로(전달 가능) 기간을 짧게 두고,
-- 필요하면 max_uses 로 사용 횟수를 제한하거나 revoked 로 즉시 회수한다.
--
-- 보안: 토큰 원문은 저장하지 않는다. sha256 해시만 보관하며, 원문은 발급 직후
--       관리자 화면에 한 번만 표시된다. (DB 가 새도 링크는 복원되지 않는다)
-- 실행: Supabase SQL Editor 에 붙여넣고 실행. 여러 번 실행해도 안전하다.
-- ============================================================================

create table if not exists public.tool_passes (
  id           uuid primary key default gen_random_uuid(),
  tool_id      uuid not null references public.tools(id) on delete cascade,
  -- 누구에게 줬는지 기억하기 위한 메모 (예: "김OO 컨설턴트 — 정식 런칭 전 체험")
  label        text,
  token_hash   text not null unique,
  expires_at   timestamptz not null,
  -- null 이면 기간 내 무제한. 숫자면 그 횟수만큼만 열 수 있다.
  max_uses     integer,
  use_count    integer not null default 0,
  revoked      boolean not null default false,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists idx_tool_passes_tool on public.tool_passes(tool_id);
create index if not exists idx_tool_passes_created on public.tool_passes(created_at desc);

alter table public.tool_passes enable row level security;

-- 조회는 관리자만. 발급·회수·사용횟수 증가는 서버리스 API(service_role)만 한다 —
-- insert/update/delete 정책을 만들지 않으므로 anon·authenticated 는 쓸 수 없다.
drop policy if exists tool_passes_admin_select on public.tool_passes;
create policy tool_passes_admin_select on public.tool_passes for select to authenticated
  using (public.is_admin());
