# QA_REPORT — Customer Platform (My MIRAE) · 2026-09-03

브랜치 `claude/mirae-customer-platform-v1` · base `8036aff` → `origin/main 222a65b` 병합 · Production(miraeailab.com) 미변경.

## 정적 검사
| 항목 | 결과 |
|---|---|
| TypeScript (`tsc -b --noEmit`) | 0 errors |
| Production build (`vite build`) | OK — 신규 Portal 페이지는 별도 청크(`MyProjectsPage-*.js` 4.4kB, `MyProjectDetailPage-*.js` 15kB), 마케팅 index 번들 크기 영향 없음 |
| 프론트 번들 secret 검사 | `sb_secret_`·service_role JWT 패턴 0 (관리자 안내 문구의 "service_role" 단어만 존재) |

## Mock Contract E2E (Playwright · Chromium)
Production Supabase 에 브릿지가 아직 적용되지 않아(READY), RPC/REST/Storage 를 `docs/CUSTOMER_DATA_CONTRACT.md` 대로 흉내 낸 서버 응답으로 실제 화면 경로를 끝까지 돌렸다. **LIVE 검증이 아니다.** 마이그레이션 적용 후 같은 스크립트를 실계정으로 다시 돌린다.

| # | 시나리오 | 결과 |
|---|---|---|
| 1 | 로그인 상태 `/mypage` — MY MIRAE 히어로(할 일 2건) | PASS |
| 2 | 마이페이지 기존 5탭 보존 | PASS |
| 3 | 개인 영역 `<meta name="robots" content="noindex, nofollow">` | PASS |
| 4 | `/my-projects` 목록(단계·담당·해야 할 일 수) | PASS |
| 5 | 상세: "지금 확인할 내용 2건" 배너 + 탭 6개 | PASS |
| 6 | HTML 에 workspace_id / operations_client / internal_note / handling_note 없음 | PASS |
| 7 | 해야 할 일 → "완료했어요" → `portal_complete_action` → 배너 1건 | PASS |
| 8 | 요청받은 서류 → 파일 올리기 → `portal_upload_path` 발급 경로(`…/portal/{link}/…`)로 storage PUT → `portal_register_document` → 서류 탭 "확인 중" | PASS |
| 9 | 업데이트 탭 타임라인 | PASS |
| 10 | 진행 상태 6단계 표시 | PASS |
| 11 | 내 요청 보내기 → `portal_create_request` → 목록 | PASS |
| 12 | 결과 탭: 공유 자료 | PASS |
| 13 | 호출된 REST 경로 중 내부 테이블 0 (20 calls 전부 RPC/profiles/user_roles/storage) | PASS |
| 14 | 번들 secret 패턴 0 | PASS |
| 15–17 | 390px 가로 넘침 0 (`/mypage`, `/my-projects`, 상세) | PASS |
| 18 | 연결 없는 회원: 안내 문구(실패화면 아님) | PASS |
| 19 | 브릿지 미적용(PGRST202): "준비하고 있습니다" | PASS (수정 후) |
| 20 | 브릿지 미적용: 마이페이지 히어로 미표시(기존 화면 그대로) | PASS |

**20/20**. 콘솔 오류: 외부 폰트 CDN(프록시 차단)·favicon 404 뿐, 앱 오류 0.

## 보안 테스트 매핑 (마스터 프롬프트 §53)
| 항목 | 검증 위치 | 결과 |
|---|---|---|
| A. 고객 A 는 고객 B 의 portal 행을 못 본다 | 내부 `supabase/tests/bridge_contract.sql` §6 | PASS (로컬 PG) |
| B. anon 은 portal 데이터 못 읽음 | 같은 파일 §8 | PASS |
| C. 고객은 내부 일기 못 읽음 | §4 | PASS |
| D. 고객은 operations payload 못 읽음 | §4·§5(투영에 수임료 없음) | PASS |
| E. 고객은 내부 수임료 못 읽음 | §5 (`5000000` 부재) | PASS |
| F. 공개 번들에 service_role 없음 | Mock E2E #14 | PASS |
| G. 도구 URL 서버 인가 보존 | `openTool`·`api/trial`·`tool-gate.js` 미변경 (diff 0) | PASS |
| H. portal 서류 경로 인가 | §5 storage 함수 + Mock E2E #8 경로 접두 확인 | PASS |

## 회귀 (변경하지 않은 경로)
`/` `/consultants` `/business-services/**` `/ax-industries/*` `/business-diagnosis` `/login` `/signup` `/auth/*` `/my-tools` `/my-orders` `/saved` `/admin/*` `/checkout/*` `/payment/complete` `/terms` … — 소스 diff 없음(AccountMenu 링크 1줄·AdminPage 배너·MyPage 히어로·robots 1줄 추가만). 빌드 통과.

## 스크린샷 (내부 저장소 QA 산출물에 보관)
11-mypage-1440 · 11-mypage-390 · 12-myprojects-1440 · 12-myprojects-390 · 13-myproject-todo-1440 · 13-myproject-390 · 14-myproject-documents-1440 · 15-myproject-updates-1440 · 16-myproject-requests-1440 · 17-myprojects-empty

## Known Issues
- Production 에서 LIVE 로 보려면 내부 저장소의 브릿지 마이그레이션 적용 필요(READY 안내가 그때까지 표시).
- 모든 페이지 lazy 전환은 P2(신규 2페이지만 lazy).

## 점수(자가) — Customer Product 92 / 100
- 감점: LIVE 데이터 미검증(-5), 고객 알림 발송 없음(-3). P0 = 0.
