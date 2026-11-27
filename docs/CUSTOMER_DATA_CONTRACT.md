# CUSTOMER_DATA_CONTRACT — 고객 앱이 쓸 수 있는 것의 전부

정본 SQL 은 내부 저장소 `AX-MVP-Factory-OS/supabase/migrations/20260903000006_customer_bridge.sql` 이다. 이 문서는 그 계약을 고객 앱 관점에서 옮겨 적은 것이며, 어긋나면 SQL 이 이긴다.

## 원칙
1. 고객 앱은 내부 테이블(`operations_clients`, `workspaces`, `ops_journal_entries`, `customer_events`, `portal_*` 기본 테이블)을 **직접 읽거나 쓰지 않는다**. 기본 테이블에는 고객용 RLS 정책이 아예 없다.
2. 고객은 `authenticated` 역할로 아래 RPC 만 호출한다. 모든 RPC 는 `auth.uid()` 가 소유한 `portal_client_links` 에만 동작하며, 남의 link 는 `not found` 다.
3. 응답 필드는 서버가 고른 allowlist 다. 내부 ID(workspace, operations_client, profile)·내부 메모·수임료·활동 기록·업무 일기는 어떤 응답에도 없다.

## RPC
| 함수 | 입력 | 출력 | 용도 |
|---|---|---|---|
| `portal_my_projects()` | — | `link_id, name, company_name, stage, consultant_name, updated_at, pending_actions, requested_documents, open_requests` | 목록 · 마이페이지 히어로 |
| `portal_project(p_link_id)` | uuid | jsonb `{project, updates[], documents[], requests[]}` | 상세 |
| `portal_create_request(p_link_id, p_request_type, p_title, p_body)` | uuid, text(6종), text, text | uuid | 요청 보내기 → 내부 이벤트 |
| `portal_upload_path(p_link_id, p_file_name)` | uuid, text | text (`{ws}/portal/{link}/{uuid}-{safe}`) | 업로드 경로 발급 |
| `portal_register_document(p_link_id, p_document_id, p_document_type, p_title, p_storage_path, p_file_name, p_file_size, p_mime_type, p_customer_note)` | … | uuid | 올린 파일 등록(요청 항목 채우기 또는 신규) → 내부 이벤트 |
| `portal_complete_action(p_update_id)` | uuid | boolean | 요청받은 조치 완료 → 내부 이벤트 |

## 투영 필드
- `project`: `link_id, name, company_name, stage(6종), status, consultant_name, updated_at`
- `updates[]`(published 만): `id, category(progress|document_request|result|notice|question), title, body, action_required, action_label, due_date, completed_at, published_at`
- `documents[]`(requested 또는 customer_uploaded/shared_with_customer 만): `id, document_type, title, status(requested|uploaded|verified|rejected), visibility, file_name, storage_path(공개분만), customer_note, requested_at, uploaded_at, verified_at`
- `requests[]`: `id, request_type, title, body, status(open|answered|resolved|closed), answer, created_at, answered_at`

## Storage (`client-documents`, private)
- 쓰기: `{workspaceId}/portal/{linkId}/…` 만 — 경로는 `portal_upload_path` 가 만들고 `portal_register_document` 가 접두를 검증한다.
- 읽기: 자기 업로드 + `visibility = shared_with_customer` 문서의 `storage_path` 만. `createSignedUrl(path, 300)`.
- 영구 public URL 없음. 20MB 제한(앱 측).

## 고객 단계 (내부 8단계를 그대로 내보내지 않는다)
`preparing 준비 중 → reviewing_docs 자료 확인 중 → in_progress 진행 중 → submitted 기관 접수 → awaiting_result 결과 대기 → completed 완료`

## 이벤트 (고객 앱이 알 필요는 없지만, 무엇이 내부로 가는지)
진단 리드 INSERT → `diagnosis_completed` · 주문 INSERT → `service_order_created` · 상담 INSERT → `consultation_requested` · 요청 INSERT → `customer_request_created` · 서류 업로드 → `document_uploaded` · 조치 완료 → `customer_action_completed`. 각 이벤트의 payload 는 고객이 제출한 값만 담는다(`internal_memo` 제외).

## 준비 상태 판정
RPC 가 없으면 PostgREST 가 `PGRST202`/`could not find the function` 을 돌려준다 → `isPortalNotReady()` 가 true → 화면은 "준비하고 있습니다"를 보여준다. 마이그레이션 적용 후 자동으로 LIVE.

## 고객성장관리(D-681 · 내부 저장소 마이그레이션 0033) — 더한 것만

원문: 내부 저장소 `supabase/migrations/20261127000033_customer_growth.sql` · `docs/CUSTOMER_GROWTH_DATA_CONTRACT.md`. 예전 RPC · 칸은 바꾸지 않았다.

| RPC | 돌려주는 것 | 기록 |
|---|---|---|
| `portal_growth_summary()` | 내 활성 연결마다 `{link_id, reports_total, reports_unseen, reports_unacked, latest_report, first_visit_at}` | 없음 |
| `portal_reports(p_link_id)` | 발행 중 보고서(최신 판만 · 내린 것 빼고 · 본문 없음) + 내가 연 때 `seen_at` · 확인한 때 `acknowledged_at` | 없음 |
| `portal_report(p_link_id, p_report_id)` | 발행 중: 본문(`sections` · `staff_note`) + `company_name` · `consultant_name` / 정정된 판: `{status:'superseded', latest_id}` / 내린 판: `{status:'withdrawn'}`(본문 없음) | 없음 |
| `portal_mark_report_seen(p_link_id, p_report_id)` | `{seen_at, acknowledged_at}` — 보고서 끝이 1초 넘게 보인 뒤 | 계정 · 판마다 한 줄 |
| `portal_acknowledge_report(p_link_id, p_report_id)` | `{seen_at, acknowledged_at}` — 다시 눌러도 처음 때 그대로 | 확인 시각 |
| `portal_mark_home()` | 활성 연결 수 — 성장 홈에 들어올 때 | 연결마다 방문 한 줄 |

- 보고서는 업체 단위, 열람 · 확인은 **계정 단위**(같은 회사 두 계정이면 기록 따로).
- '확인했어요' 는 보셨다는 표시 — 계약 검수 · 대금 승인이 아니다(화면에 늘 이 한 줄 · `REPORT_ACK_NOTE`).
- 남의 연결 · 남의 보고서 · 멈춘/끊은 연결은 모두 `not found(P0002)` — 화면은 '이 계정에 연결된 프로젝트의 보고서만 볼 수 있어요'.
- 고객 모양에 없는 것: 출처 · 발행한 사람 · 내린 까닭 · 발행 번호 · 작업공간 · 업체 id · 내부 메모 · 수수료.
- **꺼짐**: 함수가 없거나(0033 전) 실행 권한을 거뒀으면(되돌리기) `isGrowthOff` → 성장 홈 칸 · '보고서' 탭만 숨고 예전 화면 그대로. 그 밖의 오류는 숨기지 않는다.

## 결과 자료 열람(D-685 · 내부 저장소 마이그레이션 0034) — 더한 것만

| RPC | 언제 부르나 | 기록 |
|---|---|---|
| `portal_mark_item_seen(p_link_id, p_kind, p_item_id)` | `p_kind = 'document'`: 공유받은 서류(`visibility = shared_with_customer`)를 [열기]로 연 뒤 · `'result'`: '결과' 탭에서 결과 글이 1초 넘게 보인 뒤(이 화면에서 한 번씩) | 계정 · 자료마다 한 줄 · 1분 안 반복은 횟수 그대로 |

- 그 연결(활성)의 고객 · 그 연결에 공유한 것만 기록된다(그 밖은 `not found`). 열어 봤다는 표시일 뿐 — 검수 · 승인이 아니다.
- 기록 실패(0034 전 · 되돌림 · 끊긴 연결)는 화면을 막지 않는다 — `markItemSeen` 이 조용히 넘긴다. 화면 · 경로 · 디자인은 그대로.

