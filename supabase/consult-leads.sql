-- consult_leads — 사이트 공통 상담/신청 폼 리드 저장 (api/consult.ts)
-- 진행방식(핵심 프로그램 A/B/C)·자금 공통질문·AX 조건부 문항·동의 내역을 구조화 저장합니다.
-- 실행: Supabase SQL Editor 에서 1회 실행 (기존 테이블·데이터에 영향 없음)

create table if not exists public.consult_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  contact     text not null,
  company     text,
  source      text,           -- 신청 경로 (예: '정책자금 컨설팅', '서비스몰 홈')
  page        text,           -- 접수 페이지 URL
  message     text,           -- 현재 가장 어려운 부분 / 문의 내용
  program     text,           -- 진행방식: 기업진단·자금전략 / 자금조달 실행형 / AX 결합 성장자금형 / 아직 잘 모르겠습니다
  -- 구조화 응답 (jsonb):
  --   bizForm, fundingGoal, fundingTiming, arrears, priorFunding,
  --   companyProfile{업력·업종·연매출·직원 수·지역}, interestedProducts[], contactMethod,
  --   ax{ tasks[], dataForms[], participation[], consents{anonymousCase,detailedFeedback},
  --       feedbackMethods[], disclosureScope[], interestModules[],
  --       referenceBenefit(공개 후기 활용 시 '레퍼런스 구축 참여 혜택 제공' 표시용) }
  structured  jsonb,
  context     jsonb           -- 이메일에 실린 [ {label,value} ] 원본 (감사·대조용)
);

comment on table public.consult_leads is '사이트 상담/신청 폼 리드 (진행방식·자금계획·AX 문항·동의 포함)';
comment on column public.consult_leads.structured is '다중선택은 배열로 저장. ax.consents 는 레퍼런스 필수동의 2건.';

create index if not exists consult_leads_created_at_idx on public.consult_leads (created_at desc);
create index if not exists consult_leads_program_idx on public.consult_leads (program);

-- RLS: 서비스 롤(서버)만 접근 — 공개 정책 없음 (관리자는 Supabase 대시보드 또는 service_role API 로 조회)
alter table public.consult_leads enable row level security;
