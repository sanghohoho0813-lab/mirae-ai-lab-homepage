// 미래 AI 랩 — 고객 프로젝트 Portal 데이터 레이어 (My MIRAE).
//
// 내부 운영 테이블(operations_clients 등)은 절대 직접 읽지 않는다.
// 고객에게 허용된 것은 portal_* RPC(서버가 컬럼을 골라 준 투영)와, 자기 폴더/공유된 파일에 한한 storage 뿐이다.
// 계약 원문: 내부 저장소 supabase/migrations/20260903000006_customer_bridge.sql · docs/CUSTOMER_DATA_CONTRACT.md
import { supabase } from './supabase'

export type CustomerStage = 'preparing' | 'reviewing_docs' | 'in_progress' | 'submitted' | 'awaiting_result' | 'completed'

export const CUSTOMER_STAGE_ORDER: CustomerStage[] = ['preparing', 'reviewing_docs', 'in_progress', 'submitted', 'awaiting_result', 'completed']
export const CUSTOMER_STAGE_LABEL: Record<CustomerStage, string> = {
  preparing: '준비 중',
  reviewing_docs: '자료 확인 중',
  in_progress: '진행 중',
  submitted: '기관 접수',
  awaiting_result: '결과 대기',
  completed: '완료',
}

export type PortalRequestType = 'document' | 'schedule' | 'status' | 'consultation' | 'info_change' | 'other'
export const REQUEST_TYPE_LABEL: Record<PortalRequestType, string> = {
  document: '서류 문의',
  schedule: '일정 문의',
  status: '진행상태 문의',
  consultation: '추가 상담',
  info_change: '정보 수정',
  other: '기타',
}
export const REQUEST_STATUS_LABEL: Record<string, string> = {
  open: '답변 대기',
  answered: '답변 도착',
  resolved: '해결됨',
  closed: '종료',
}
export const UPDATE_CATEGORY_LABEL: Record<string, string> = {
  progress: '진행 상황',
  document_request: '서류 요청',
  result: '결과 안내',
  notice: '안내',
  question: '확인 요청',
}
export const DOCUMENT_STATUS_LABEL: Record<string, string> = {
  requested: '올려 주세요',
  uploaded: '확인 중',
  verified: '확인 완료',
  rejected: '다시 올려 주세요',
}

export type MyProject = {
  link_id: string
  name: string
  company_name: string
  stage: CustomerStage
  consultant_name: string | null
  updated_at: string
  pending_actions: number
  requested_documents: number
  open_requests: number
}

export type PortalUpdate = {
  id: string
  category: string
  title: string
  body: string
  action_required: boolean
  action_label: string | null
  due_date: string | null
  completed_at: string | null
  published_at: string
}

export type PortalDocument = {
  id: string
  document_type: string
  title: string
  status: 'requested' | 'uploaded' | 'verified' | 'rejected'
  visibility: 'customer_uploaded' | 'shared_with_customer' | 'internal_only'
  file_name: string | null
  storage_path: string | null
  customer_note: string | null
  requested_at: string | null
  uploaded_at: string | null
  verified_at: string | null
}

export type PortalRequest = {
  id: string
  request_type: PortalRequestType
  title: string
  body: string
  status: 'open' | 'answered' | 'resolved' | 'closed'
  answer: string | null
  created_at: string
  answered_at: string | null
}

export type PortalProject = {
  project: {
    link_id: string
    name: string
    company_name: string
    stage: CustomerStage
    status: string
    consultant_name: string | null
    updated_at: string
  } | null
  updates: PortalUpdate[]
  documents: PortalDocument[]
  requests: PortalRequest[]
}

/** 브릿지 함수가 아직 배포되지 않은 환경(READY 상태)인지 — 화면은 이 경우 "준비 중"으로 안내한다 */
export function isPortalNotReady(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e)
  return /could not find the function|does not exist|schema cache|PGRST202|42883/i.test(msg)
}

function requireClient() {
  if (!supabase) throw new Error('서비스를 준비하고 있습니다.')
  return supabase
}

export async function fetchMyProjects(): Promise<MyProject[]> {
  const { data, error } = await requireClient().rpc('portal_my_projects')
  if (error) throw error
  return (data ?? []) as MyProject[]
}

export async function fetchProject(linkId: string): Promise<PortalProject> {
  const { data, error } = await requireClient().rpc('portal_project', { p_link_id: linkId })
  if (error) throw error
  return data as PortalProject
}

export async function createRequest(linkId: string, type: PortalRequestType, title: string, body: string): Promise<string> {
  const { data, error } = await requireClient().rpc('portal_create_request', {
    p_link_id: linkId,
    p_request_type: type,
    p_title: title,
    p_body: body,
  })
  if (error) throw error
  return String(data)
}

export async function completeAction(updateId: string): Promise<void> {
  const { error } = await requireClient().rpc('portal_complete_action', { p_update_id: updateId })
  if (error) throw error
}

const BUCKET = 'client-documents'
const MAX_FILE_BYTES = 20 * 1024 * 1024

/**
 * 서류 업로드 — 1) 서버에서 경로를 받고 2) 그 경로로만 올린 뒤 3) 메타데이터를 등록한다.
 * 경로 규칙은 서버가 정하므로 고객 앱은 내부 구조를 알 필요가 없다.
 */
export async function uploadDocument(
  linkId: string,
  file: File,
  opts: { documentId?: string | null; documentType: string; title: string; note?: string },
): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error('파일은 20MB 이하만 올릴 수 있습니다.')
  const client = requireClient()
  const { data: path, error: pathError } = await client.rpc('portal_upload_path', { p_link_id: linkId, p_file_name: file.name })
  if (pathError) throw pathError
  const storagePath = String(path)
  const { error: uploadError } = await client.storage.from(BUCKET).upload(storagePath, file, {
    contentType: file.type || undefined,
    upsert: false,
  })
  if (uploadError) throw new Error(`파일을 올리지 못했습니다. ${uploadError.message}`)
  const { data, error } = await client.rpc('portal_register_document', {
    p_link_id: linkId,
    p_document_id: opts.documentId ?? null,
    p_document_type: opts.documentType,
    p_title: opts.title,
    p_storage_path: storagePath,
    p_file_name: file.name,
    p_file_size: file.size,
    p_mime_type: file.type || null,
    p_customer_note: opts.note ?? null,
  })
  if (error) throw error
  return String(data)
}

/** 자기 업로드/공유된 파일만 열린다 (storage 정책). 5분짜리 서명 URL. */
export async function signedFileUrl(storagePath: string): Promise<string> {
  const { data, error } = await requireClient().storage.from(BUCKET).createSignedUrl(storagePath, 300)
  if (error || !data?.signedUrl) throw new Error('파일 주소를 만들지 못했습니다.')
  return data.signedUrl
}

export function formatKDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
