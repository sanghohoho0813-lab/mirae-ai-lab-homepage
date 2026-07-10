-- ─────────────────────────────────────────────────────────────
-- 미래 AI 랩 — 기업 성장진단 (2차): 리드 / 세션 / 이벤트
-- Supabase SQL Editor 에서 실행하세요. (기존 schema.sql 이후)
-- 원칙:
--  * 익명 사용자는 이 테이블들을 직접 SELECT/INSERT 할 수 없음 (API service_role 전용)
--  * 관리자(profiles.role='admin', public.is_admin())만 직접 조회 가능
--  * 컨설턴트 배정 확장 대비 필드: assigned_to / assigned_label / assignment_status / assigned_at / source_channel
-- ─────────────────────────────────────────────────────────────

-- 1) 리드 (결과 게이트에서 수집한 대표자 정보)
create table if not exists public.business_diagnosis_leads (
  id                      uuid primary key default gen_random_uuid(),
  company_name            text not null,
  representative_name     text not null,
  phone                   text not null,
  email                   text,
  business_type           text,             -- individual | corp | pre
  industry                text,
  contact_method          text,
  preferred_contact_time  text,
  privacy_consent         boolean not null default false,
  privacy_consent_version text not null default 'unknown',
  consultation_consent    boolean not null default false,
  marketing_consent       boolean not null default false,
  consent_at              timestamptz,
  lead_score              integer not null default 0,     -- 상담 우선순위 점수 (승인 가능성 아님)
  lead_grade              text not null default 'C' check (lead_grade in ('A','B','C')),
  score_breakdown         jsonb,                          -- {urgency, fit, clarity, intent, completeness, bonus, penalty}
  flags                   jsonb,                          -- hot / funding_urgent / prerequisite_issue 등
  lead_status             text not null default 'new' check (lead_status in
    ('new','reviewing','contacted','meeting_scheduled','proposal_sent','contracted','nurture','not_qualified','closed')),
  memo                    text,
  meeting_memo            text,
  contacted_at            timestamptz,
  -- 컨설턴트 배정 확장용 (이번 단계에서는 수동 라벨만 사용)
  assigned_to             uuid,
  assigned_label          text,
  assignment_status       text not null default 'unassigned',
  assigned_at             timestamptz,
  source_channel          text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_bdl_created on public.business_diagnosis_leads (created_at desc);
create index if not exists idx_bdl_grade on public.business_diagnosis_leads (lead_grade);
create index if not exists idx_bdl_status on public.business_diagnosis_leads (lead_status);
create index if not exists idx_bdl_phone on public.business_diagnosis_leads (phone);

-- 2) 진단 세션 (답변·점수·추천·유입경로 스냅샷)
create table if not exists public.business_diagnosis_sessions (
  id                   uuid primary key default gen_random_uuid(),
  session_token        text not null unique,
  diagnosis_version    integer not null default 0,
  status               text not null default 'in_progress' check (status in ('in_progress','completed','submitted')),
  lead_id              uuid references public.business_diagnosis_leads (id) on delete set null,
  answers              jsonb not null default '{}'::jsonb,
  scores               jsonb,
  result_summary       jsonb,
  advantage_factors    jsonb,
  recommended_products jsonb,
  clicked_benefits     jsonb,
  current_stage        integer not null default 1,
  current_question_id  text,
  started_at           timestamptz not null default now(),
  completed_at         timestamptz,
  submitted_at         timestamptz,
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  utm_content          text,
  utm_term             text,
  referrer             text,
  landing_path         text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_bds_lead on public.business_diagnosis_sessions (lead_id);
create index if not exists idx_bds_created on public.business_diagnosis_sessions (created_at desc);
create index if not exists idx_bds_utm_source on public.business_diagnosis_sessions (utm_source);

-- 3) 행동 이벤트
create table if not exists public.business_diagnosis_events (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.business_diagnosis_sessions (id) on delete cascade,
  event_type  text not null check (event_type in
    ('diagnosis_started','stage_completed','question_answered','benefit_revealed','benefit_interest_clicked',
     'benefit_added_to_recommendations','benefit_skipped',
     'product_clicked','lead_form_viewed','lead_submitted','result_unlocked','consultation_clicked','diagnosis_restarted')),
  event_key   text,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_bde_session on public.business_diagnosis_events (session_id, created_at);
create index if not exists idx_bde_type on public.business_diagnosis_events (event_type);

-- ── (점진형 진단) 단계 컬럼 추가 — 기존 데이터 호환 위해 전부 nullable/기본값 ──
-- 이미 실행한 환경에서도 안전하게 재실행 가능 (add column if not exists)
alter table public.business_diagnosis_sessions
  add column if not exists skipped_benefits         jsonb,
  add column if not exists completed_stage          integer,
  add column if not exists diagnosis_depth          text,       -- basic | funding | comprehensive
  add column if not exists stopped_after_stage       boolean not null default false,
  add column if not exists next_stage_interest        boolean not null default false,
  add column if not exists stage1_duration_seconds   integer,
  add column if not exists stage2_duration_seconds   integer,
  add column if not exists stage3_duration_seconds   integer,
  add column if not exists total_duration_seconds    integer;

create index if not exists idx_bds_completed_stage on public.business_diagnosis_sessions (completed_stage);

-- 이벤트 종류 확장(추천 담기/건너뛰기/실시간 현황/결과 기록/인쇄 등) — 기존 환경의 check 제약을 안전하게 갱신
alter table public.business_diagnosis_events drop constraint if exists business_diagnosis_events_event_type_check;
alter table public.business_diagnosis_events add constraint business_diagnosis_events_event_type_check
  check (event_type in
    ('diagnosis_started','stage_completed','question_answered','benefit_revealed','benefit_interest_clicked',
     'benefit_added_to_recommendations','benefit_skipped','benefit_removed_from_recommendations','benefit_more_opened',
     'live_status_updated','saved_result_opened','saved_result_deleted','product_recommended','product_detail_clicked','report_printed',
     'product_clicked','lead_form_viewed','lead_submitted','result_unlocked','consultation_clicked','diagnosis_restarted'));

-- ── updated_at 자동 갱신 ──
create or replace function public.bd_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_bdl_touch on public.business_diagnosis_leads;
create trigger trg_bdl_touch before update on public.business_diagnosis_leads
  for each row execute function public.bd_touch_updated_at();

drop trigger if exists trg_bds_touch on public.business_diagnosis_sessions;
create trigger trg_bds_touch before update on public.business_diagnosis_sessions
  for each row execute function public.bd_touch_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
-- 익명(anon)·일반 로그인 사용자: 어떤 직접 접근도 불가 (정책 없음 = 차단)
-- 서버리스 API(service_role)는 RLS 우회. 관리자는 직접 SELECT 허용(is_admin() 재사용).
alter table public.business_diagnosis_leads enable row level security;
alter table public.business_diagnosis_sessions enable row level security;
alter table public.business_diagnosis_events enable row level security;

drop policy if exists bdl_admin_select on public.business_diagnosis_leads;
create policy bdl_admin_select on public.business_diagnosis_leads
  for select to authenticated using (public.is_admin());

drop policy if exists bdl_admin_update on public.business_diagnosis_leads;
create policy bdl_admin_update on public.business_diagnosis_leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists bds_admin_select on public.business_diagnosis_sessions;
create policy bds_admin_select on public.business_diagnosis_sessions
  for select to authenticated using (public.is_admin());

drop policy if exists bde_admin_select on public.business_diagnosis_events;
create policy bde_admin_select on public.business_diagnosis_events
  for select to authenticated using (public.is_admin());
