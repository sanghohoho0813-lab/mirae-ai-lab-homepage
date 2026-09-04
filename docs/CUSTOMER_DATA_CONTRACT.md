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
