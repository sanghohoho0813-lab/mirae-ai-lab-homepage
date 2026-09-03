# CUSTOMER_PORTAL_ROUTES

| Route | 화면 | 접근 | 색인 | 데이터 |
|---|---|---|---|---|
| `/mypage` (`/account`) | 마이페이지 — Case B 면 내 프로젝트 히어로 | 로그인 | noindex | profiles/tool_access/payments + `portal_my_projects()` |
| `/my-projects` | 내 프로젝트 목록 | 로그인(+온보딩 완료) | noindex | `portal_my_projects()` |
| `/my-projects/:linkId` | 프로젝트 상세(탭: todo·progress·documents·updates·requests·results) | 로그인, 본인 연결만 | noindex | `portal_project(linkId)` · `portal_create_request` · `portal_upload_path` · `portal_register_document` · `portal_complete_action` · storage signed URL |

리다이렉트: 미로그인 → `/login?next=<원래 경로>` · 온보딩 미완료 → `/auth/onboarding?next=/my-projects`.
지연 로딩: 두 Portal 페이지는 `React.lazy` 로 분리 청크(마케팅 번들 무영향).
robots.txt: `/my-projects` Disallow 추가. sitemap.xml: 변경 없음(개인 영역 미포함).
계정 메뉴: 마이페이지 · 내 도구함 · **내 프로젝트** · 역할 · (관리자) · 로그아웃.
관리자(/admin): 상단에 "내부 운영 OS 열기" 외부 링크(관리자에게만, 세션 공유 없음).
