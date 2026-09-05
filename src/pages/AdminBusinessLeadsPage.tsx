// /admin/business-leads — 3분 AX Fit 리드 DB 관리 (관리자 전용).
// 기존 /admin 권한 체계(useAuth.isAdmin) 재사용. 목록·필터·검색·상세·상태관리·CSV.
// 개인정보 보호: 목록에서는 전화번호 마스킹, 상세에서만 전체 표시. 콘솔 출력 금지.
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import {
  downloadCsv,
  fetchLeadDetail,
  fetchLeads,
  formatPhone,
  maskPhone,
  updateLead,
  type EventRow,
  type LeadRow,
  type LeadsListResponse,
  type SessionRow,
} from '../lib/businessLeadsAdmin'
import { questions } from '../data/businessDiagnosisQuestions'
import { getPackageBySlug } from '../data/businessPackages'

// ── 라벨 매핑 ──
const qById = new Map(questions.map((q) => [q.id, q]))
function answerLabel(questionId: string, value: string | string[] | undefined): string {
  if (value === undefined) return '-'
  const q = qById.get(questionId)
  const lab = (v: string) => q?.options.find((o) => o.value === v)?.label ?? v
  return Array.isArray(value) ? value.map(lab).join(', ') : lab(value)
}

const STATUS_LABELS: Record<string, string> = {
  new: '신규',
  reviewing: '검토중',
  contacted: '연락완료',
  meeting_scheduled: '미팅예정',
  proposal_sent: '제안발송',
  contracted: '계약완료',
  nurture: '육성',
  not_qualified: '비대상',
  closed: '종료',
}

const FLAG_LABELS: Record<string, string> = {
  hot: 'HOT',
  ax_high_priority: 'HIGH PRIORITY',
  ax_full_candidate: 'FULL 후보',
  ax_lite: 'LITE',
  ax_no_go: 'NO-GO',
  growth_interest: '성장전략 관심',
  no_internal_owner: '담당자 미정',
  consultation_opt_in: '상담동의',
  // 구버전 리드
  funding_urgent: '자금긴급(구)',
  certification_interest: '인증관심(구)',
  employment_interest: '고용관심(구)',
  digital_interest: '디지털관심(구)',
  prerequisite_issue: '선결과제(구)',
  information_only: '정보확인형(구)',
}

const GRADE_TONE: Record<string, string> = {
  A: 'bg-red-600 text-white',
  B: 'bg-blue-600 text-white',
  C: 'bg-slate-200 text-slate-600',
}

const AX_TONE: Record<string, string> = {
  'HIGH PRIORITY': 'bg-red-100 text-red-700',
  'FULL AX CANDIDATE': 'bg-orange-100 text-orange-800',
  'LITE AX': 'bg-amber-100 text-amber-800',
  'NO-GO': 'bg-blue-50 text-blue-700',
}

const BREAKDOWN_LABELS: Record<string, string> = {
  urgency: '문제 강도',
  fit: '서비스 적합도',
  clarity: '문제 명확성',
  intent: '행동의향',
  completeness: '정보 완성도',
  bonus: '가점',
  penalty: '감점',
}

// ── 1차 상담 확인 질문 (규칙 기반 — AI 미사용) ──
function consultationChecklist(answers: Record<string, string | string[]>): string[] {
  const one = (id: string) => (typeof answers[id] === 'string' ? (answers[id] as string) : undefined)
  const strong = (id: string) => ['often', 'always'].includes(one(id) ?? '')
  const out: string[] = []
  if (strong('repeatInput') || strong('toolGaps')) out.push('지금 쓰는 도구(엑셀·카톡·ERP 등)와 그 사이에서 사람이 옮겨 적는 구간을 확인해주세요.')
  if (strong('askProgress') || strong('ceoLoadGrows')) out.push('대표·관리자가 하루에 직접 확인하는 업무가 무엇인지, 몇 번이나 확인하는지 확인해주세요.')
  if (strong('manualHandoff')) out.push('고객 요청·주문·예약이 어떤 채널로 들어와 누가 어떻게 내부로 넘기는지 확인해주세요.')
  if (strong('missDelay') || strong('priorityByMemory')) out.push('최근 누락·지연 사례 1~2건과, 우선순위를 정하는 실제 기준을 확인해주세요.')
  if (strong('dataUnused')) out.push('어떤 데이터가 어디에(엑셀·ERP·수기) 쌓여 있는지, 의사결정에 쓰고 싶은 항목을 확인해주세요.')
  if (strong('uniqueWork')) out.push('기성 프로그램으로 안 되는 회사 고유 업무가 구체적으로 무엇인지 확인해주세요.')
  else if (one('uniqueWork') === 'no') out.push('고유 업무가 없다고 답했습니다. 기성 SaaS로 충분한지 먼저 확인해주세요(Lite/NO-GO 가능성).')
  if (['none', 'ceo'].includes(one('internalOwner') ?? '')) out.push('시스템을 함께 쓸 내부 담당자를 정할 수 있는지 확인해주세요. 정착 여부를 좌우합니다.')
  if (out.length === 0) out.push('진단 답변 전반을 확인하며 우선 과제를 함께 정리해주세요.')
  return out
}

function axLabel(s?: SessionRow | null): string {
  const g = s?.result_summary?.gradeLabel
  return g ? String(g) : s?.completed_stage ? '진단 완료(구버전)' : '-'
}

const th = 'px-3 py-2.5 text-left text-xs font-black uppercase tracking-wide text-slate-400 whitespace-nowrap'
const td = 'px-3 py-2.5 text-sm text-slate-700 whitespace-nowrap'
const selectCls = 'rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700'

export default function AdminBusinessLeadsPage() {
  const { user, isAdmin, loading } = useAuth()
  const [data, setData] = useState<LeadsListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // 필터
  const [fGrade, setFGrade] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fConsent, setFConsent] = useState('')
  const [fUtm, setFUtm] = useState('')
  const [fFlag, setFFlag] = useState('')
  const [fAx, setFAx] = useState('')
  const [fAssignee, setFAssignee] = useState('')
  const [fFrom, setFFrom] = useState('')
  const [fTo, setFTo] = useState('')
  const [search, setSearch] = useState('')

  // 상세
  const [detail, setDetail] = useState<{ lead: LeadRow; session: SessionRow | null; events: EventRow[] } | null>(null)
  const [detailBusy, setDetailBusy] = useState(false)
  const [memoDraft, setMemoDraft] = useState('')
  const [assigneeDraft, setAssigneeDraft] = useState('')
  const [meetingDraft, setMeetingDraft] = useState('')

  async function reload() {
    setBusy(true)
    setError(null)
    try {
      setData(await fetchLeads())
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (isAdmin) void reload()
  }, [isAdmin])

  const sessionByLead = useMemo(() => {
    const m = new Map<string, SessionRow>()
    for (const s of data?.sessions ?? []) if (s.lead_id) m.set(s.lead_id, s)
    return m
  }, [data])

  const filtered = useMemo(() => {
    let rows = data?.leads ?? []
    const s = sessionByLead
    if (fGrade) rows = rows.filter((l) => l.lead_grade === fGrade)
    if (fStatus) rows = rows.filter((l) => l.lead_status === fStatus)
    if (fConsent === 'yes') rows = rows.filter((l) => l.consultation_consent)
    if (fConsent === 'no') rows = rows.filter((l) => !l.consultation_consent)
    if (fUtm) rows = rows.filter((l) => (s.get(l.id)?.utm_source ?? l.source_channel ?? '') === fUtm)
    if (fFlag) rows = rows.filter((l) => (l.flags ?? []).includes(fFlag))
    if (fAx) rows = rows.filter((l) => axLabel(s.get(l.id)) === fAx)
    if (fAssignee) rows = rows.filter((l) => (l.assigned_label ?? '(미배정)') === fAssignee)
    if (fFrom) rows = rows.filter((l) => l.created_at >= fFrom)
    if (fTo) rows = rows.filter((l) => l.created_at <= `${fTo}T23:59:59`)
    if (search.trim()) {
      const t = search.trim().toLowerCase()
      const digits = t.replace(/\D/g, '')
      rows = rows.filter(
        (l) =>
          l.company_name.toLowerCase().includes(t) ||
          l.representative_name.toLowerCase().includes(t) ||
          (digits.length >= 4 && l.phone.includes(digits)) ||
          (l.email ?? '').toLowerCase().includes(t),
      )
    }
    return rows
  }, [data, sessionByLead, fGrade, fStatus, fConsent, fUtm, fFlag, fAx, fAssignee, fFrom, fTo, search])

  // 필터 옵션 (데이터 기반)
  const utmOptions = useMemo(
    () => [...new Set((data?.leads ?? []).map((l) => sessionByLead.get(l.id)?.utm_source ?? l.source_channel).filter(Boolean))] as string[],
    [data, sessionByLead],
  )
  const assigneeOptions = useMemo(() => [...new Set((data?.leads ?? []).map((l) => l.assigned_label ?? '(미배정)'))], [data])
  const axOptions = useMemo(() => [...new Set((data?.leads ?? []).map((l) => axLabel(sessionByLead.get(l.id))).filter((x) => x !== '-'))], [data, sessionByLead])

  async function openDetail(id: string) {
    setDetailBusy(true)
    try {
      const d = await fetchLeadDetail(id)
      setDetail(d)
      setMemoDraft(d.lead.memo ?? '')
      setAssigneeDraft(d.lead.assigned_label ?? '')
      setMeetingDraft(d.lead.meeting_memo ?? '')
    } catch (e) {
      setError(e instanceof Error ? e.message : '상세를 불러오지 못했습니다.')
    } finally {
      setDetailBusy(false)
    }
  }

  async function patchLead(id: string, patch: Parameters<typeof updateLead>[1]) {
    try {
      await updateLead(id, patch)
      await reload()
      if (detail?.lead.id === id) await openDetail(id)
    } catch (e) {
      setError(e instanceof Error ? e.message : '변경에 실패했습니다.')
    }
  }

  function exportCsv() {
    const headers = ['접수일시', '우선순위 등급', '점수', 'AX Fit 등급', 'AX Fit Score', '회사명', '대표자명', '연락처', '이메일', '가장 큰 문제', '권장 방향', '다음 행동', '내부 담당자', '상담동의', '마케팅동의', '상태', '담당자', 'UTM source', 'UTM campaign', 'referrer']
    const rows = filtered.map((l) => {
      const s = sessionByLead.get(l.id)
      const r = s?.result_summary
      const join = (v: unknown) => (Array.isArray(v) ? v.map(String).join(' / ') : '')
      return [
        new Date(l.created_at).toLocaleString('ko-KR'),
        l.lead_grade,
        String(l.lead_score),
        axLabel(s),
        r?.score !== undefined ? String(r.score) : '',
        l.company_name,
        l.representative_name,
        formatPhone(l.phone),
        l.email ?? '',
        join(r?.topProblems ?? r?.improvements),
        join(r?.direction ?? r?.strengths),
        join(r?.actionPlan),
        answerLabel('internalOwner', s?.answers?.['internalOwner']),
        l.consultation_consent ? 'Y' : 'N',
        l.marketing_consent ? 'Y' : 'N',
        STATUS_LABELS[l.lead_status] ?? l.lead_status,
        l.assigned_label ?? '',
        s?.utm_source ?? l.source_channel ?? '',
        s?.utm_campaign ?? '',
        s?.referrer ?? '',
      ]
    })
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`미래AI랩_AX_Fit_DB_${date}.csv`, headers, rows)
  }

  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">확인 중…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin)
    return (
      <div className="grid min-h-screen place-items-center bg-white px-6 text-center [word-break:keep-all]">
        <div>
          <p className="text-lg font-bold text-slate-900">관리자 권한이 필요합니다.</p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold text-blue-600 underline">홈으로</Link>
        </div>
      </div>
    )

  const stats = data?.stats

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← 관리자 홈</Link>
            <h1 className="text-lg font-black tracking-tight">3분 AX Fit 리드 DB</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void reload()} disabled={busy} className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              {busy ? '불러오는 중…' : '새로고침'}
            </button>
            <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-40">
              CSV 다운로드 ({filtered.length}건)
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 pt-6">
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200">{error}</div>}

        {/* 상단 요약 */}
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { label: '전체 DB', value: stats?.total ?? 0 },
            { label: '오늘 접수', value: stats?.today ?? 0 },
            { label: 'A등급', value: stats?.gradeA ?? 0 },
            { label: '상담동의', value: stats?.consented ?? 0 },
            { label: 'AX HIGH PRIORITY', value: stats?.highPriority ?? 0 },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-black tabular-nums">{c.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">{c.label}</p>
            </div>
          ))}
        </div>

        {/* 필터 */}
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3.5">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="회사명·대표자·전화·이메일 검색" className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <select value={fGrade} onChange={(e) => setFGrade(e.target.value)} className={selectCls}>
            <option value="">우선순위 전체</option>
            {['A', 'B', 'C'].map((g) => <option key={g} value={g}>{g}등급</option>)}
          </select>
          <select value={fAx} onChange={(e) => setFAx(e.target.value)} className={selectCls}>
            <option value="">AX Fit 전체</option>
            {axOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={selectCls}>
            <option value="">상태 전체</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={fConsent} onChange={(e) => setFConsent(e.target.value)} className={selectCls}>
            <option value="">상담동의 전체</option>
            <option value="yes">동의</option>
            <option value="no">미동의</option>
          </select>
          <select value={fFlag} onChange={(e) => setFFlag(e.target.value)} className={selectCls}>
            <option value="">플래그 전체</option>
            {Object.entries(FLAG_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={fUtm} onChange={(e) => setFUtm(e.target.value)} className={selectCls}>
            <option value="">UTM 전체</option>
            {utmOptions.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={fAssignee} onChange={(e) => setFAssignee(e.target.value)} className={selectCls}>
            <option value="">담당자 전체</option>
            {assigneeOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} className={selectCls} aria-label="접수일 시작" />
          <span className="text-slate-300">~</span>
          <input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} className={selectCls} aria-label="접수일 끝" />
        </div>

        {/* 목록 */}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['접수일', '우선순위', 'AX Fit', '회사명', '대표자', '연락처', '가장 큰 문제', '내부 담당자', '상담동의', '상태', '담당자', '유입'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l) => {
                const s = sessionByLead.get(l.id)
                const r = s?.result_summary
                const ax = axLabel(s)
                const firstProblem = Array.isArray(r?.topProblems) ? String(r?.topProblems[0] ?? '') : Array.isArray(r?.improvements) ? String(r?.improvements[0] ?? '') : ''
                return (
                  <tr key={l.id} onClick={() => void openDetail(l.id)} className="cursor-pointer transition-colors hover:bg-blue-50/40">
                    <td className={td}>{new Date(l.created_at).toLocaleDateString('ko-KR')}</td>
                    <td className={td}>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-black ${GRADE_TONE[l.lead_grade]}`}>{l.lead_grade}</span>
                      <span className="ml-1 text-xs text-slate-400">{l.lead_score}</span>
                    </td>
                    <td className={td}>
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${AX_TONE[ax] ?? 'bg-slate-100 text-slate-600'}`}>{ax}</span>
                      {r?.score !== undefined && <span className="ml-1 text-xs text-slate-400">{String(r.score)}</span>}
                    </td>
                    <td className={`${td} font-bold text-slate-900`}>{l.company_name}</td>
                    <td className={td}>{l.representative_name}</td>
                    <td className={td}>{maskPhone(l.phone)}</td>
                    <td className={`${td} max-w-[220px] truncate`}>{firstProblem || '-'}</td>
                    <td className={td}>{answerLabel('internalOwner', s?.answers?.['internalOwner'])}</td>
                    <td className={td}>{l.consultation_consent ? '✅' : '—'}</td>
                    <td className={td}>{STATUS_LABELS[l.lead_status] ?? l.lead_status}</td>
                    <td className={td}>{l.assigned_label ?? '—'}</td>
                    <td className={td}>{s?.utm_source ?? l.source_channel ?? '—'}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-sm text-slate-400">
                    {busy ? '불러오는 중…' : '조건에 맞는 리드가 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 상세 패널 */}
        {(detail || detailBusy) && (
          <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="리드 상세">
            <button type="button" aria-label="닫기" onClick={() => setDetail(null)} className="absolute inset-0 h-full w-full cursor-default bg-slate-900/40" />
            <div className="animate-drawer-in absolute inset-y-0 right-0 w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
              {detailBusy && <p className="text-sm text-slate-400">불러오는 중…</p>}
              {detail && (() => {
                const { lead, session, events } = detail
                const a = session?.answers ?? {}
                const r = session?.result_summary
                const ax = axLabel(session)
                const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : [])
                return (
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-sm font-black ${GRADE_TONE[lead.lead_grade]}`}>{lead.lead_grade}</span>
                          <h2 className="text-xl font-black">{lead.company_name}</h2>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {lead.representative_name} · {formatPhone(lead.phone)} {lead.email ? `· ${lead.email}` : ''}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          접수 {new Date(lead.created_at).toLocaleString('ko-KR')} · 수정 {new Date(lead.updated_at).toLocaleString('ko-KR')} · 동의버전 {lead.privacy_consent_version}
                        </p>
                      </div>
                      <button type="button" onClick={() => setDetail(null)} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">✕</button>
                    </div>

                    {/* 플래그 */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(lead.flags ?? []).map((f) => (
                        <span key={f} className={`rounded-full px-2 py-0.5 text-[11px] font-black ${f === 'hot' ? 'bg-red-100 text-red-700' : f === 'ax_high_priority' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                          {FLAG_LABELS[f] ?? f}
                        </span>
                      ))}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        {lead.contact_method ?? '상담 방식 미선택'} {lead.preferred_contact_time ? `· ${lead.preferred_contact_time}` : ''}
                      </span>
                    </div>

                    {/* AX Fit 결과 */}
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded-md px-2 py-1 font-black ${AX_TONE[ax] ?? 'bg-slate-900 text-white'}`}>{ax}</span>
                        {r?.score !== undefined && <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-700">AX Fit Score {String(r.score)}</span>}
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-600">
                          소요 {session?.total_duration_seconds ?? session?.stage1_duration_seconds ?? '-'}s
                        </span>
                        {(session?.clicked_benefits?.length ?? 0) > 0 && (
                          <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">{session?.clicked_benefits?.join(', ')}</span>
                        )}
                      </div>
                      {r?.headline && <p className="mt-3 text-sm font-black text-slate-900">{String(r.headline)}</p>}
                      {r?.summary && <p className="mt-1 text-sm text-slate-600">{String(r.summary)}</p>}
                      {list(r?.topProblems ?? r?.improvements).length > 0 && (
                        <>
                          <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">가장 큰 문제 TOP 3</p>
                          <ul className="mt-1 space-y-0.5 text-sm text-slate-700">{list(r?.topProblems ?? r?.improvements).map((t) => <li key={t}>· {t}</li>)}</ul>
                        </>
                      )}
                      {list(r?.direction ?? r?.strengths).length > 0 && (
                        <>
                          <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">권장 AX 방향</p>
                          <ul className="mt-1 space-y-0.5 text-sm text-slate-700">{list(r?.direction ?? r?.strengths).map((t) => <li key={t}>· {t}</li>)}</ul>
                        </>
                      )}
                      {list(r?.actionPlan).length > 0 && (
                        <>
                          <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">다음 행동</p>
                          <ul className="mt-1 space-y-0.5 text-sm text-slate-700">{list(r?.actionPlan).map((t) => <li key={t}>· {t}</li>)}</ul>
                        </>
                      )}
                    </div>

                    {/* 상태 관리 */}
                    <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                      <label className="text-sm font-bold text-slate-700">
                        상담 상태
                        <select value={lead.lead_status} onChange={(e) => void patchLead(lead.id, { leadStatus: e.target.value })} className={`${selectCls} mt-1 w-full`}>
                          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </label>
                      <label className="text-sm font-bold text-slate-700">
                        담당자
                        <div className="mt-1 flex gap-1.5">
                          <input value={assigneeDraft} onChange={(e) => setAssigneeDraft(e.target.value)} placeholder="예: 김팀장" className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
                          <button type="button" onClick={() => void patchLead(lead.id, { assignedLabel: assigneeDraft })} className="shrink-0 rounded-lg bg-slate-900 px-3 text-sm font-bold text-white">저장</button>
                        </div>
                      </label>
                      <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                        내부 메모
                        <div className="mt-1 flex gap-1.5">
                          <textarea value={memoDraft} onChange={(e) => setMemoDraft(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
                          <button type="button" onClick={() => void patchLead(lead.id, { memo: memoDraft })} className="shrink-0 rounded-lg bg-slate-900 px-3 text-sm font-bold text-white">저장</button>
                        </div>
                      </label>
                      <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                        상담일정 메모
                        <div className="mt-1 flex gap-1.5">
                          <input value={meetingDraft} onChange={(e) => setMeetingDraft(e.target.value)} placeholder="예: 7/15(월) 14시 전화상담" className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
                          <button type="button" onClick={() => void patchLead(lead.id, { meetingMemo: meetingDraft })} className="shrink-0 rounded-lg bg-slate-900 px-3 text-sm font-bold text-white">저장</button>
                        </div>
                      </label>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <button type="button" onClick={() => void patchLead(lead.id, { contactedAt: true, leadStatus: 'contacted' })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
                          연락완료 표시
                        </button>
                        {lead.contacted_at && <span className="text-xs text-slate-400">연락 {new Date(lead.contacted_at).toLocaleString('ko-KR')}</span>}
                      </div>
                    </div>

                    {/* 점수 구성 */}
                    <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">상담 우선순위 점수 — {lead.lead_score}점 ({lead.lead_grade}등급)</h3>
                    <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                      {Object.entries(lead.score_breakdown ?? {}).map(([k, v]) => (
                        <div key={k} className="rounded-lg bg-slate-50 px-2.5 py-2 text-center">
                          <p className="text-sm font-black tabular-nums">{k === 'penalty' ? `-${v}` : v}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{BREAKDOWN_LABELS[k] ?? k}</p>
                        </div>
                      ))}
                    </div>

                    {/* (구버전 리드) 추천 상품 */}
                    {session?.recommended_products && session.recommended_products.length > 0 && (
                      <>
                        <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">(구버전) 추천 상품</h3>
                        <ul className="mt-2 space-y-1.5">
                          {session.recommended_products.map((rp) => (
                            <li key={rp.slug} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                              <b>{rp.rank}</b> {getPackageBySlug(rp.slug)?.name ?? rp.slug}
                              <p className="mt-0.5 text-xs leading-snug text-slate-500">{rp.reason}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* 1차 상담 확인 질문 */}
                    <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">1차 상담에서 확인할 질문</h3>
                    <ul className="mt-2 space-y-1.5">
                      {consultationChecklist(a).map((qq) => (
                        <li key={qq} className="flex items-start gap-2 rounded-lg bg-blue-50/60 px-3 py-2 text-sm text-slate-700">
                          <span aria-hidden className="mt-0.5 text-blue-500">☐</span>{qq}
                        </li>
                      ))}
                    </ul>

                    {/* 전체 답변 */}
                    <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">전체 질문 답변</h3>
                    <dl className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                      {questions.filter((q) => a[q.id] !== undefined).map((q) => (
                        <div key={q.id} className="flex gap-3 px-3 py-2 text-sm">
                          <dt className="w-56 shrink-0 text-slate-400">{q.title}</dt>
                          <dd className="font-semibold text-slate-800">{answerLabel(q.id, a[q.id])}</dd>
                        </div>
                      ))}
                      {questions.every((q) => a[q.id] === undefined) && Object.keys(a).length > 0 && (
                        <div className="px-3 py-2 text-xs text-slate-400">구버전 진단 답변 — 원본 코드값: {JSON.stringify(a).slice(0, 300)}</div>
                      )}
                    </dl>

                    {/* 유입경로 + 이벤트 */}
                    <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">유입경로</h3>
                    <p className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      source: {session?.utm_source ?? '-'} · medium: {session?.utm_medium ?? '-'} · campaign: {session?.utm_campaign ?? '-'}
                      <br />referrer: {session?.referrer ?? '-'} · landing: {session?.landing_path ?? '-'}
                    </p>
                    <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-slate-400">행동 이벤트 ({events.length})</h3>
                    <ul className="mt-1.5 max-h-44 space-y-1 overflow-y-auto rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                      {events.map((ev, i) => (
                        <li key={i}>
                          {new Date(ev.created_at).toLocaleTimeString('ko-KR')} — {ev.event_type}
                          {ev.event_key ? ` (${ev.event_key})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
