# CUSTOMER_PLATFORM_SPEC — MIRAE AI LAB (miraeailab.com) · My MIRAE

## 제품 정의
공개 마케팅 사이트 + 결제/도구함 위에 **고객 업무 Portal(My MIRAE)** 을 더한다. 컨설팅 고객이 로그인해 "내 프로젝트가 어디까지 왔고, 내가 지금 무엇을 해야 하는지"를 보고, 서류를 올리고, 요청을 보내고, 결과를 받는다.

## 보존하는 것 (변경 금지)
Gateway(/) · 컨설턴트 소개(/consultants) · 서비스 카탈로그/상세 · 업종별 AX · 사업 진단(+결과) · 회원가입/로그인/온보딩/비밀번호 · 결제(PortOne)/주문 · 내 도구함과 `openTool` 서버 인가 · 찜 · 관리자 · 약관 · sitemap/robots/canonical · 기존 문의(consult/inquiry).

## 사용자 유형
| Case | 누구 | 보이는 것 |
|---|---|---|
| A | 일반 회원 / 도구 사용자 | 마이페이지(내 정보·보안·이용 상품·결제·역할) · 내 도구함 · 주문 · 진단 · 찜 |
| B | 미래AI랩 컨설팅 고객(내부에서 연결됨) | A + **내 프로젝트**(마이페이지 히어로 "지금 확인할 내용" + /my-projects) |

연결 여부는 서버 함수 `portal_my_projects()` 결과로 판정한다. 연결이 없으면 실패 화면이 아니라 안내 문구를 보여준다.

## PRIMARY CUSTOMER JOURNEY
```
로그인 → 마이페이지(My MIRAE) → 내 프로젝트 → 지금 해야 할 일
  → 요청받은 서류 업로드 / 요청받은 조치 완료 / 추가 요청 보내기
  → (내부 처리) → 업데이트 탭에 진행 소식 · 결과 탭에 공유 자료
```
이 흐름은 실제 Supabase RPC 와 storage 로 동작한다(브릿지 마이그레이션 적용 후 LIVE, 그 전 READY 안내).

## 화면
- `/mypage` — 기존 5탭 유지. Case B 면 상단에 "MY MIRAE · 내 프로젝트" 히어로(할 일 수, 프로젝트 3개, 모두 보기).
- `/my-projects` — 프로젝트 카드(이름·단계·담당·최근 업데이트·해야 할 일 수). 없음/준비 중/오류 상태.
- `/my-projects/:linkId` — 상단(프로젝트명·단계·담당·최근 업데이트) + "지금 확인할 내용" 배너 + 탭 6개:
  1. 지금 해야 할 일 — 조치 요청(완료했어요) + 요청받은 서류(파일 올리기)
  2. 진행 상태 — 6단계 스텝(준비 중→자료 확인 중→진행 중→기관 접수→결과 대기→완료)
  3. 서류 — 요청/올림/확인/공유 상태, 열기(서명 URL)
  4. 업데이트 — 공개된 진행 소식 타임라인
  5. 내 요청 — 새 요청 폼(6종) + 보낸 요청과 답변
  6. 결과 — 결과 안내 업데이트 + 공유된 자료

## 상태
Loading · Empty(연결 없음) · Error(다시 시도) · Success(토스트) · Permission Denied(찾을 수 없음) · Not Ready(준비 중) · Action Required(배너 amber) · Completed(배너 emerald).

## 보안
- 프론트는 anon 키만. service_role 은 `api/_lib/supabaseAdmin.ts`(서버)에만.
- 내부 테이블(operations_clients 등) 직접 조회 0. `portal_*` RPC 만 사용(§CUSTOMER_DATA_CONTRACT).
- 파일: 서버가 발급한 경로(`portal_upload_path`)로만 업로드, 자기 업로드·공유 파일만 서명 URL.
- 개인 영역은 `<meta name="robots" content="noindex">` + robots.txt Disallow. sitemap 미포함.

## Capability Status
| 기능 | 상태 |
|---|---|
| 마케팅·결제·도구함·진단 | LIVE (변경 없음) |
| /my-projects · 상세 6탭 · 업로드 · 요청 · 조치 완료 | **READY** — 브릿지 마이그레이션 적용 후 LIVE |
| 고객 알림 발송 | NEXT |
