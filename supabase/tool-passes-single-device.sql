-- ============================================================================
-- 초대 링크 — "처음 연 사람만 계속 쓸 수 있게" (1인 고정)
--
-- 링크를 처음 연 브라우저에 링크를 묶는다. 그 뒤로는 같은 브라우저에서만 열리고,
-- 링크를 전달받은 다른 사람은 열 수 없다.
--   single_device = true  : 1인 고정 (기본값은 false — 기존에 만든 링크는 그대로 범용)
--   claimed_by            : 처음 연 브라우저의 기기 식별자(우리가 발급, 주소에는 없음)
--   claimed_at            : 고정된 시각
--
-- 고정된 사람이 브라우저 데이터를 지웠다면 관리자 화면에서 [고정 해제]를 누르면
-- 다시 처음 여는 사람에게 묶인다.
--
-- 실행: Supabase SQL Editor 에 붙여넣고 실행. 여러 번 실행해도 안전하다.
-- 선행: tool-passes.sql 이 먼저 실행돼 있어야 한다.
-- ============================================================================

alter table public.tool_passes add column if not exists single_device boolean not null default false;
alter table public.tool_passes add column if not exists claimed_by   text;
alter table public.tool_passes add column if not exists claimed_at   timestamptz;
