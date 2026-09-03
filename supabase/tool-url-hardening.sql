-- ============================================================================
-- tools.external_url 컬럼 접근 차단
--
-- 배경: RLS 정책 tools_select 가 `using (true)` 라 로그인한 사용자는 tools 테이블의
--       모든 컬럼(비공개 도구의 external_url 포함)을 그대로 읽을 수 있었다.
--       체험이 만료된 사용자도 브라우저에서 도구 주소를 얻을 수 있다는 뜻이다.
--
-- 조치: RLS(행 단위)로는 컬럼을 가릴 수 없으므로 컬럼 단위 GRANT 로 제한한다.
--       external_url 은 service_role(서버리스 API)만 읽고,
--       클라이언트는 /api/trial { action:'open' } 으로 권한 확인 후에만 주소를 받는다.
--
-- 적용: Supabase 대시보드 → SQL Editor 에 붙여넣고 실행.
--       (실행 전 src/lib/portal.ts 가 select('*') 를 쓰지 않는지 확인 — 이미 반영됨)
-- ============================================================================

-- 1) 테이블 전체 SELECT 권한 회수
revoke select on public.tools from anon, authenticated;

-- 2) external_url 을 제외한 컬럼만 다시 부여
grant select (
  id,
  slug,
  title,
  category,
  status,
  access_type,
  is_public,
  is_trial_available,
  created_at
) on public.tools to authenticated;

-- 참고: service_role 은 GRANT/RLS 를 우회하므로 서버리스 API(/api/trial)는 그대로 동작한다.

-- 3) 확인용 — authenticated 역할에 남은 컬럼 권한 조회
--    external_url 이 결과에 없어야 한다.
select column_name
from information_schema.column_privileges
where table_schema = 'public'
  and table_name = 'tools'
  and grantee = 'authenticated'
  and privilege_type = 'SELECT'
order by column_name;
