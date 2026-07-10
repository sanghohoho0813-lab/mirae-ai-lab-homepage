// /admin/business-leads — 기업 성장진단 리드 DB 관리 (관리자 전용).
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
import { AREA_LABELS } from '../lib/businessDiagnosisEngine'
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
  funding_urgent: '자금긴급',
  certification_interest: '인증관심',
  employment_interest: '고용관심',
  digital_interest: '디지털관심',
  prerequisite_issue: '선결과제',
  consultation_opt_in: '상담동의',
  information_only: '정보확인형',
}

const GRADE_TONE: Record<string, string> = {
  A: 'bg-red-600 text-white',
  B: 'bg-blue-600 text-white',
  C: 'bg-slate-200 text-slate-600',
}

const BREAKDOWN_LABELS: Record<string, string> = {
  urgency: '실행 긴급도',
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
  const many = (id: string) => (Array.isArray(answers[id]) ? (answers[id] as string[]) : [])
  const out: string[] = []
  if (one('fundingWhen') && one('fundingWhen') !== 'none') out.push('기존 정책자금·은행 대출 잔액과 금리를 확인해주세요.')
  if (['yes', 'paying'].includes(one('taxArrears') ?? '')) out.push('체납 금액·분납 일정과 정리 예상 시점을 확인해주세요.')
  if (['patent', 'utility'].includes(one('ipRights') ?? '')) out.push('최근 3년 내 등록 특허가 실제 법인(대표) 명의인지 확인해주세요.')
  if (one('ipRights') === 'filed') out.push('출원 중인 지식재산권의 등록 예상 시점을 확인해주세요.')
  if (['lab', 'dept'].includes(one('researchLab') ?? '')) out.push('기업부설연구소(전담부서) 인정서 유효상태를 확인해주세요.')
  if (one('venture') === 'expired') out.push('벤처기업확인 만료 시점과 재확인 계획을 확인해주세요.')
  if (many('futurePlans').some((p) => ['bigCorp', 'bidding', 'export'].includes(p)))
    out.push('ISO가 필요한 거래처 요구나 입찰 일정이 있는지 확인해주세요.')
  if (['none', 'snsOnly', 'old'].includes(one('website') ?? '') && ['excel', 'kakao', 'paper', 'scattered'].includes(one('workflow') ?? ''))
    out.push('홈페이지와 AX(업무 자동화) 중 어느 쪽이 먼저 필요한지 확인해주세요.')
  if (['unsure', 'notManaged'].includes(one('rndRatio') ?? '')) out.push('연구개발비 비중은 재무제표로 함께 확인해주세요.')
  if (['notClosed', 'unsure', 'breakeven'].includes(one('operatingProfit') ?? ''))
    out.push('업종 평균 대비 수익성은 재무제표·업종 평균자료로 확인해주세요.')
  if (one('hiring') && one('hiring') !== 'na') out.push('채용 인원·시점과 고용지원금 요건 해당 여부를 확인해주세요.')
  if (out.length === 0) out.push('진단 답변 전반을 확인하며 우선 과제를 함께 정리해주세요.')
  return out
}

function stageLabel(s?: SessionRow | null): string {
  const st = s?.completed_stage
  if (st === 3) return '종합 완료'
  if (st === 2) return '2단계 완료'
  if (st === 1) return '1단계 완료'
  return '-'
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
  const [fIndustry, setFIndustry] = useState('')
  const [fBizType, setFBizType] = useState('')
  const [fUtm, setFUtm] = useState('')
  const [fFlag, setFFlag] = useState('')
  const [fProduct, setFProduct] = useState('')
  const [fAssignee, setFAssignee] = useState('')
  const [fStage, setFStage] = useState('')
  const [fNextInterest, setFNextInterest] = useState('')
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
    if (fIndustry) rows = rows.filter((l) => l.industry === fIndustry)
    if (fBizType) rows = rows.filter((l) => l.business_type === fBizType)
    if (fUtm) rows = rows.filter((l) => (s.get(l.id)?.utm_source ?? l.source_channel ?? '') === fUtm)
    if (fFlag) rows = rows.filter((l) => (l.flags ?? []).includes(fFlag))
    if (fProduct) rows = rows.filter((l) => (s.get(l.id)?.recommended_products ?? []).some((r) => r.slug === fProduct))
    if (fAssignee) rows = rows.filter((l) => (l.assigned_label ?? '(미배정)') === fAssignee)
    if (fStage) rows = rows.filter((l) => String(s.get(l.id)?.completed_stage ?? '') === fStage)
    if (fNextInterest === 'yes') rows = rows.filter((l) => s.get(l.id)?.next_stage_interest)
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
  }, [data, sessionByLead, fGrade, fStatus, fConsent, fIndustry, fBizType, fUtm, fFlag, fProduct, fAssignee, fStage, fNextInterest, fFrom, fTo, search])

  // 필터 옵션 (데이터 기반)
  const industryOptions = useMemo(() => [...new Set((data?.leads ?? []).map((l) => l.industry).filter(Boolean))] as string[], [data])
  const utmOptions = useMemo(
    () => [...new Set((data?.leads ?? []).map((l) => sessionByLead.get(l.id)?.utm_source ?? l.source_channel).filter(Boolean))] as string[],
    [data, sessionByLead],
  )
  const assigneeOptions = useMemo(() => [...new Set((data?.leads ?? []).map((l) => l.assigned_label ?? '(미배정)'))], [data])
  const productOptions = useMemo(() => {
    const set = new Set<string>()
    for (const s of data?.sessions ?? []) for (const r of s.recommended_products ?? []) set.add(r.slug)
    return [...set]
  }, [data])

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
    const headers = ['접수일시', '등급', '점수', '회사명', '대표자명', '연락처', '이메일', '사업자유형', '업종', '업력', '매출구간', '직원수', '최우선과제', '보유우대요소', '준비추천요소', '추천상품1', '추천상품2', '추천상품3', '상담동의', '마케팅동의', '상태', '담당자', 'UTM source', 'UTM campaign', 'referrer']
    const rows = filtered.map((l) => {
      const s = sessionByLead.get(l.id)
      const a = s?.answers ?? {}
      const adv = s?.advantage_factors ?? []
      const recs = s?.recommended_products ?? []
      const recName = (i: number) => (recs[i] ? (getPackageBySlug(recs[i].slug)?.name ?? recs[i].slug) : '')
      return [
        new Date(l.created_at).toLocaleString('ko-KR'),
        l.lead_grade,
        String(l.lead_score),
        l.company_name,
        l.representative_name,
        formatPhone(l.phone),
        l.email ?? '',
        answerLabel('bizType', l.business_type ?? undefined),
        answerLabel('industry', l.industry ?? undefined),
        answerLabel('years', a['years']),
        answerLabel('revenue', a['revenue']),
        answerLabel('employees', a['employees']),
        s?.result_summary?.topTask ?? '',
        adv.filter((x) => x.status === '보유').map((x) => x.label).join(' / '),
        adv.filter((x) => x.status === '검토 추천').map((x) => x.label).join(' / '),
        recName(0),
        recName(1),
        recName(2),
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
    downloadCsv(`미래AI랩_기업성장진단_DB_${date}.csv`, headers, rows)
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
            <h1 className="text-lg font-black tracking-tight">기업 성장진단 DB</h1>
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
            { label: '정책자금 긴급', value: stats?.fundingUrgent ?? 0 },
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
            <option value="">등급 전체</option>
            {['A', 'B', 'C'].map((g) => <option key={g} value={g}>{g}등급</option>)}
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
          <select value={fBizType} onChange={(e) => setFBizType(e.target.value)} className={selectCls}>
            <option value="">사업자유형 전체</option>
            <option value="individual">개인</option>
            <option value="corp">법인</option>
            <option value="pre">예비창업</option>
          </select>
          <select value={fIndustry} onChange={(e) => setFIndustry(e.target.value)} className={selectCls}>
            <option value="">업종 전체</option>
            {industryOptions.map((i) => <option key={i} value={i}>{answerLabel('industry', i)}</option>)}
          </select>
          <select value={fFlag} onChange={(e) => setFFlag(e.target.value)} className={selectCls}>
            <option value="">플래그 전체</option>
            {Object.entries(FLAG_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={fProduct} onChange={(e) => setFProduct(e.target.value)} className={selectCls}>
            <option value="">추천상품 전체</option>
            {productOptions.map((p) => <option key={p} value={p}>{getPackageBySlug(p)?.name ?? p}</option>)}
          </select>
          <select value={fUtm} onChange={(e) => setFUtm(e.target.value)} className={selectCls}>
            <option value="">UTM 전체</option>
            {utmOptions.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={fAssignee} onChange={(e) => setFAssignee(e.target.value)} className={selectCls}>
            <option value="">담당자 전체</option>
            {assigneeOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={fStage} onChange={(e) => setFStage(e.target.value)} className={selectCls}>
            <option value="">완료 단계 전체</option>
            <option value="1">1단계 완료</option>
            <option value="2">2단계 완료</option>
            <option value="3">종합 완료</option>
          </select>
          <select value={fNextInterest} onChange={(e) => setFNextInterest(e.target.value)} className={selectCls}>
            <option value="">다음 단계 관심 전체</option>
            <option value="yes">다음 단계 관심 있음</option>
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
                {['접수일', '등급', '단계', '회사명', '대표자', '연락처', '유형', '업종', '업력', '매출', '최우선 과제', '우대', '추천 1순위', '상담동의', '상태', '담당자', '유입'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l) => {
                const s = sessionByLead.get(l.id)
                const a = s?.answers ?? {}
                const rec1 = s?.recommended_products?.[0]
                return (
                  <tr key={l.id} onClick={() => void openDetail(l.id)} className="cursor-pointer transition-colors hover:bg-blue-50/40">
                    <td className={td}>{new Date(l.created_at).toLocaleDateString('ko-KR')}</td>
                    <td className={td}>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-black ${GRADE_TONE[l.lead_grade]}`}>{l.lead_grade}</span>
                      <span className="ml-1 text-xs text-slate-400">{l.lead_score}</span>
                    </td>
                    <td className={td}>
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${s?.completed_stage === 3 ? 'bg-emerald-100 text-emerald-700' : s?.completed_stage === 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{stageLabel(s)}</span>
                      {s?.next_stage_interest && s?.completed_stage !== 3 && <span className="ml-1 text-[10px] font-bold text-amber-500">▲</span>}
                    </td>
                    <td className={`${td} font-bold text-slate-900`}>{l.company_name}</td>
                    <td className={td}>{l.representative_name}</td>
                    <td className={td}>{maskPhone(l.phone)}</td>
                    <td className={td}>{answerLabel('bizType', l.business_type ?? undefined)}</td>
                    <td className={td}>{answerLabel('industry', l.industry ?? undefined)}</td>
                    <td className={td}>{answerLabel('years', a['years'])}</td>
                    <td className={td}>{answerLabel('revenue', a['revenue'])}</td>
                    <td className={`${td} max-w-[180px] truncate`}>{s?.result_summary?.topTask ?? '-'}</td>
                    <td className={td}>{s?.result_summary?.ownedAdvantageCount ?? 0}개</td>
                    <td className={`${td} max-w-[160px] truncate`}>{rec1 ? (getPackageBySlug(rec1.slug)?.name ?? rec1.slug) : '-'}</td>
                    <td className={td}>{l.consultation_consent ? '✅' : '—'}</td>
                    <td className={td}>{STATUS_LABELS[l.lead_status] ?? l.lead_status}</td>
                    <td className={td}>{l.assigned_label ?? '—'}</td>
                    <td className={td}>{s?.utm_source ?? l.source_channel ?? '—'}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={17} className="px-4 py-10 text-center text-sm text-slate-400">
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
                const adv = session?.advantage_factors ?? []
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
                        <span key={f} className={`rounded-full px-2 py-0.5 text-[11px] font-black ${f === 'hot' ? 'bg-red-100 text-red-700' : f === 'prerequisite_issue' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {FLAG_LABELS[f] ?? f}
                        </span>
                      ))}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        상담 {answerLabel('consultTiming', a['consultTiming'])} · {lead.contact_method ?? '방식 미선택'} {lead.preferred_contact_time ? `· ${lead.preferred_contact_time}` : ''}
                      </span>
                    </div>

                    {/* 진단 진행 (점진형) */}
                    <div className="mt-4 flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-3.5 text-xs">
                      <span className="rounded-md bg-slate-900 px-2 py-1 font-black text-white">{stageLabel(session)}</span>
                      {session?.stopped_after_stage && session?.completed_stage !== 3 && (
                        <span className="rounded-md bg-amber-100 px-2 py-1 font-bold text-amber-700">{session?.completed_stage}단계에서 결과 요청</span>
                      )}
                      {session?.next_stage_interest && session?.completed_stage !== 3 && (
                        <span className="rounded-md bg-blue-100 px-2 py-1 font-bold text-blue-700">다음 단계 관심 있음</span>
                      )}
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-600">
                        소요 {session?.stage1_duration_seconds ?? '-'}s / {session?.stage2_duration_seconds ?? '-'}s / {session?.stage3_duration_seconds ?? '-'}s
                        {session?.total_duration_seconds ? ` · 합 ${session.total_duration_seconds}s` : ''}
                      </span>
                      {(session?.clicked_benefits?.length ?? 0) > 0 && (
                        <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">추천 담기 {session?.clicked_benefits?.length}건</span>
                      )}
                      {(session?.skipped_benefits?.length ?? 0) > 0 && (
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-500">건너뛰기 {session?.skipped_benefits?.length}건</span>
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

                    {/* 준비도 점수 */}
                    {session?.scores && (
                      <>
                        <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">6개 영역 준비도 (내부 지표)</h3>
                        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                          {session.scores.map((sc) => (
                            <div key={sc.area} className="rounded-lg bg-slate-50 px-2.5 py-2">
                              <p className="text-[11px] font-semibold text-slate-500">{(AREA_LABELS as Record<string, string>)[sc.area] ?? sc.area}</p>
                              <p className="text-sm font-black tabular-nums">{sc.score} <span className="text-[10px] font-semibold text-slate-400">{sc.priority}</span></p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* 우대요소 */}
                    {adv.length > 0 && (
                      <>
                        <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">우대 참고요소</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {adv.map((x) => (
                            <span key={x.id} className={`rounded-full px-2.5 py-1 text-xs font-bold ${x.status === '보유' ? 'bg-emerald-100 text-emerald-800' : x.status === '검토 추천' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                              {x.label} · {x.status}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* 추천 상품 */}
                    {session?.recommended_products && session.recommended_products.length > 0 && (
                      <>
                        <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-slate-400">추천 상품</h3>
                        <ul className="mt-2 space-y-1.5">
                          {session.recommended_products.map((r) => (
                            <li key={r.slug} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                              <b>{r.rank}</b> {getPackageBySlug(r.slug)?.name ?? r.slug}
                              <p className="mt-0.5 text-xs leading-snug text-slate-500">{r.reason}</p>
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
                          <dt className="w-44 shrink-0 text-slate-400">{q.title}</dt>
                          <dd className="font-semibold text-slate-800">{answerLabel(q.id, a[q.id])}</dd>
                        </div>
                      ))}
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
