# CUSTOMER_PORTAL_ROUTES

| Route | 화면 | 접근 | 색인 | 데이터 |
|---|---|---|---|---|
| `/mypage` (`/account`) | 마이페이지 — Case B 면 내 프로젝트 히어로 | 로그인 | noindex | profiles/tool_access/payments + `portal_my_projects()` |
| `/my-projects` | 내 프로젝트 목록 | 로그인(+온보딩 완료) | noindex | `portal_my_projects()` |
| `/my-projects` (성장 홈 · D-681) | 위 목록 + 맨 위 '지금 할 일'(3개) · '최근 보고서'(3편) · 카드에 보고서 수 | 같음 | noindex | + `portal_growth_summary()` · `portal_reports(linkId)` · `portal_mark_home()`(들어올 때 방문 기록) — 없으면 예전 목록 그대로 |
| `/my-projects/:linkId` | 프로젝트 상세(탭: todo·reports·progress·documents·updates·requests·results · `?tab=` 로 바로) | 로그인, 본인 연결만 | noindex | `portal_project(linkId)` · `portal_reports(linkId)`(없으면 '보고서' 탭 숨김) · `portal_create_request` · `portal_upload_path` · `portal_register_document` · `portal_complete_action` · storage signed URL |
| `/my-projects/reports/:reportId` (D-681) | 보고서 한 편 — 끝까지 1초 보이면 열어 봄 · [확인했어요] · [이 보고서 문의] · 인쇄 · 정정된 판은 새 판으로 · 내린 판은 안내만 | 로그인, 본인 연결의 보고서만(남의 것은 '볼 수 없어요') | noindex | `portal_my_projects()` 로 내 연결을 찾고(`?link=` 먼저) `portal_report` · `portal_mark_report_seen` · `portal_acknowledge_report` · `portal_create_request` |

리다이렉트: 미로그인 → `/login?next=<원래 경로>`(보고서 주소도 그대로 돌아옴) · 온보딩 미완료 → `/auth/onboarding?next=/my-projects`.
지연 로딩: 두 Portal 페이지는 `React.lazy` 로 분리 청크(마케팅 번들 무영향).
robots.txt: `/my-projects` Disallow 추가. sitemap.xml: 변경 없음(개인 영역 미포함).
계정 메뉴: 마이페이지 · 내 도구함 · **내 프로젝트** · 역할 · (관리자) · 로그아웃.
관리자(/admin): 상단에 "내부 운영 OS 열기" 외부 링크(관리자에게만, 세션 공유 없음).
