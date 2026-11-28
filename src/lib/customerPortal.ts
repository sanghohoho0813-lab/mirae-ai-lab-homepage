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
  // supabase-js 의 PostgrestError 는 Error 인스턴스가 아닐 수 있어 message/code 를 직접 본다
  const o = e as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown } | null
  const msg = [o?.message, o?.code, o?.details, o?.hint].filter((v) => typeof v === 'string').join(' ') || String(e)
  return /could not find the function|does not exist|schema cache|PGRST202|42883|42P01/i.test(msg)
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

/**
 * 올리기 실패 문구를 사람 말로 바꾼다.
 * 저장소가 돌려주는 영어 메시지는 고객에게 아무 정보도 주지 못한다.
 */
function uploadErrorMessage(raw: string): string {
  const t = raw.toLowerCase()
  if (t.includes('exceeded') || t.includes('too large') || t.includes('maximum size')) {
    return '파일이 너무 큽니다. 미래AI랩에 알려 주시면 상한을 올려 드립니다.'
  }
  if (t.includes('mime') || t.includes('content type') || t.includes('not allowed')) {
    return '이 형식은 아직 저장소가 받지 않습니다. 미래AI랩에 알려 주세요.'
  }
  if (t.includes('duplicate') || t.includes('already exists')) {
    return '같은 이름의 파일이 방금 올라갔습니다. 잠시 뒤 다시 시도해 주세요.'
  }
  return `파일을 올리지 못했습니다. ${raw}`
}

/**
 * 서류 업로드 — 1) 서버에서 경로를 받고 2) 그 경로로만 올린 뒤 3) 메타데이터를 등록한다.
 * 경로 규칙은 서버가 정하므로 고객 앱은 내부 구조를 알 필요가 없다.
 *
 * 크기·형식 제한은 앱에서 걸지 않는다. 한글(HWP)·워드·엑셀·압축파일이 오가고
 * 스캔본은 10MB 를 쉽게 넘기 때문이다. 실제 상한은 저장소(프로젝트 전역 설정)
 * 한 곳에서만 정하고, 걸리면 위 문구로 알린다.
 */
export async function uploadDocument(
  linkId: string,
  file: File,
  opts: { documentId?: string | null; documentType: string; title: string; note?: string },
): Promise<string> {
  const client = requireClient()
  const { data: path, error: pathError } = await client.rpc('portal_upload_path', { p_link_id: linkId, p_file_name: file.name })
  if (pathError) throw pathError
  const storagePath = String(path)
  const { error: uploadError } = await client.storage.from(BUCKET).upload(storagePath, file, {
    // 한글(HWP)·압축파일은 브라우저가 형식을 못 알아볼 때가 있다. 그때도 올라가게 둔다.
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })
  if (uploadError) throw new Error(uploadErrorMessage(uploadError.message))
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

/* ------------------------------------------------------------------ */
/* 고객성장관리 — 보고서 · 열람/확인 기록 (내부 저장소 0033)               */
/* ------------------------------------------------------------------ */
// 이 함수들이 아직 없는 환경(0033 전)이거나 운영자가 끈 환경(실행 권한 거둠)이면 '꺼짐' — 화면은 예전 그대로 둔다.
// 열람 · 확인 표시는 '보고서를 보셨다' 는 뜻일 뿐, 계약 검수 · 대금 승인이 아니다.

export type ReportKind = 'consult_summary' | 'progress' | 'interim' | 'final' | 'monthly' | 'annual'

export const REPORT_KIND_LABEL: Record<ReportKind, string> = {
  consult_summary: '상담 요약',
  progress: '경과 보고',
  interim: '중간 보고',
  final: '최종 보고',
  monthly: '월간 보고',
  annual: '연간 보고',
}

export type PortalReportSection = { key: string; title: string; items: { text: string; date?: string | null }[] }

/** 목록 · 요약에 오는 한 편(본문 없음) */
export type PortalReportItem = {
  id: string
  version: number
  kind: ReportKind
  title: string
  period_start: string | null
  period_end: string | null
  summary: string
  status: 'published'
  published_at: string
  corrected: boolean
  correction_note: string | null
  /** 내가(이 계정이) 처음 열어 본 때 · 확인한 때 */
  seen_at: string | null
  acknowledged_at: string | null
}

/** 보고서 한 편 — 발행 중이면 본문까지 · 정정됐거나 내린 판이면 안내만 */
export type PortalReportDetail =
  | (PortalReportItem & { sections: PortalReportSection[]; staff_note: string | null; company_name: string | null; consultant_name: string | null })
  | { id: string; status: 'superseded' | 'withdrawn'; title: string; version: number; kind: ReportKind; published_at: string; withdrawn_at: string | null; latest_id: string | null }

export type GrowthSummary = {
  link_id: string
  reports_total: number
  reports_unseen: number
  reports_unacked: number
  latest_report: PortalReportItem | null
  first_visit_at: string | null
}

const GROWTH_FUNCS = 'portal_(?:reports|report|mark_report_seen|acknowledge_report|mark_home|growth_summary)'

/** 고객성장 기능이 아직 없거나 꺼진 환경인지(그 칸만 숨기고 나머지는 예전 그대로) */
export function isGrowthOff(e: unknown): boolean {
  const o = e as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown } | null
  const msg = [o?.message, o?.code, o?.details, o?.hint].filter((v) => typeof v === 'string').join(' ') || String(e)
  if (/could not find the function|schema cache|PGRST202|42883/i.test(msg)) return true
  return new RegExp(`permission denied for function ${GROWTH_FUNCS}\\b`, 'i').test(msg)
}

/** 남의 보고서 · 끊긴 연결 · 없는 번호 — 서버는 모두 'not found' 로만 답한다 */
export function isNotFound(e: unknown): boolean {
  const o = e as { message?: unknown; code?: unknown } | null
  return o?.code === 'P0002' || /not found|P0002/i.test(String(o?.message ?? e))
}

/** 내 프로젝트마다 보고서 수 · 안 열어 본 수 · 가장 최근 보고서. 꺼진 환경이면 null */
export async function fetchGrowthSummary(): Promise<GrowthSummary[] | null> {
  const { data, error } = await requireClient().rpc('portal_growth_summary')
  if (error) {
    if (isGrowthOff(error)) return null
    throw error
  }
  return (Array.isArray(data) ? data : []) as GrowthSummary[]
}

/** 이 프로젝트의 보고서(최신 판만 · 내린 것 빼고 · 최근 것 먼저). 꺼진 환경이면 null */
export async function fetchReports(linkId: string): Promise<PortalReportItem[] | null> {
  const { data, error } = await requireClient().rpc('portal_reports', { p_link_id: linkId })
  if (error) {
    if (isGrowthOff(error)) return null
    throw error
  }
  return (Array.isArray(data) ? data : []) as PortalReportItem[]
}

export async function fetchReport(linkId: string, reportId: string): Promise<PortalReportDetail> {
  const { data, error } = await requireClient().rpc('portal_report', { p_link_id: linkId, p_report_id: reportId })
  if (error) throw error
  const d = (data ?? {}) as PortalReportDetail
  if (d.status === 'published') return { ...d, sections: Array.isArray(d.sections) ? d.sections : [] }
  return d
}

/** 고객 화면에 들어왔다(첫 방문 · 최근 방문). 실패해도 화면은 그대로 — 기록만 빠진다 */
export async function markHome(): Promise<void> {
  try {
    await requireClient().rpc('portal_mark_home')
  } catch {
    /* 기록 실패는 고객 화면을 막지 않는다 */
  }
}

/** 결과 자료 하나의 '새' 상태(이 계정 기준) — 0035 */
export type ResultState = { kind: 'document' | 'result'; id: string; seen_at: string | null; is_new: boolean }

/**
 * 내 프로젝트마다 새 결과 자료 수(공유 서류 · 결과 글 가운데 이 계정이 아직 안 연 것).
 * 이 기능이 없거나 꺼진 환경 · 그 밖의 실패는 null — '새 결과 자료' 표시만 빠지고 화면은 그대로.
 */
export async function fetchResultSummary(): Promise<{ link_id: string; results_new: number }[] | null> {
  try {
    const { data, error } = await requireClient().rpc('portal_result_summary')
    if (error) return null
    return (Array.isArray(data) ? data : []) as { link_id: string; results_new: number }[]
  } catch {
    return null
  }
}

/** 이 프로젝트의 결과 자료마다 새 것인지(읽기만 — 기록 0). 실패하면 null(표시만 빠짐) */
export async function fetchResultsState(linkId: string): Promise<ResultState[] | null> {
  try {
    const { data, error } = await requireClient().rpc('portal_results_state', { p_link_id: linkId })
    if (error) return null
    return (Array.isArray(data) ? data : []) as ResultState[]
  } catch {
    return null
  }
}

/**
 * 공유받은 결과 자료를 열었다(document = [열기] 로 파일을 연 뒤 · result = '결과' 탭에서 그 글이 1초 넘게 보인 뒤).
 * 기록 실패(이 기능이 없는 환경 · 끊긴 연결)는 고객 화면을 막지 않는다 — 조용히 넘어간다.
 */
export async function markItemSeen(linkId: string, kind: 'document' | 'result', itemId: string): Promise<void> {
  try {
    await requireClient().rpc('portal_mark_item_seen', { p_link_id: linkId, p_kind: kind, p_item_id: itemId })
  } catch {
    /* 기록 실패는 고객 화면을 막지 않는다 */
  }
}

/** 보고서를 끝까지 봤다(화면 끝이 1초 넘게 보인 뒤에 부른다) */
export async function markReportSeen(linkId: string, reportId: string): Promise<{ seen_at: string | null; acknowledged_at: string | null } | null> {
  const { data, error } = await requireClient().rpc('portal_mark_report_seen', { p_link_id: linkId, p_report_id: reportId })
  if (error) {
    if (isGrowthOff(error)) return null
    throw error
  }
  return (data ?? null) as { seen_at: string | null; acknowledged_at: string | null } | null
}

/** [확인했어요] — 다시 눌러도 처음 때 그대로. 계약 검수 · 대금 승인이 아니다 */
export async function acknowledgeReport(linkId: string, reportId: string): Promise<{ seen_at: string | null; acknowledged_at: string | null }> {
  const { data, error } = await requireClient().rpc('portal_acknowledge_report', { p_link_id: linkId, p_report_id: reportId })
  if (error) throw error
  return (data ?? { seen_at: null, acknowledged_at: null }) as { seen_at: string | null; acknowledged_at: string | null }
}

/** 보고서 주소(/my-projects/reports/:id)로 왔을 때 — 내 프로젝트 가운데 그 보고서가 있는 곳을 찾는다(남의 것은 어디서도 'not found') */
export async function findReport(reportId: string, linkHint?: string | null): Promise<{ linkId: string; report: PortalReportDetail } | null> {
  const links = (await fetchMyProjects()).map((p) => p.link_id)
  const order = linkHint && links.includes(linkHint) ? [linkHint, ...links.filter((l) => l !== linkHint)] : links
  for (const linkId of order) {
    try {
      return { linkId, report: await fetchReport(linkId, reportId) }
    } catch (e) {
      if (isNotFound(e)) continue
      throw e
    }
  }
  return null
}

export const REPORT_ACK_NOTE = '확인 표시는 보고서를 보셨다는 뜻이에요. 계약 검수 · 대금 승인이 아니에요.'

export function formatKDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
