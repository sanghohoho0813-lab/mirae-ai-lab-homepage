// /admin/members — 가입 회원 관리(관리자 전용). 목록 + 검색 + 진단·상담 이력 + CSV.
// 데이터는 service_role 서버 API(/api/admin/members) 경유. 접근제어는 useAuth().isAdmin.
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import { useAuth } from '../lib/auth'
import BrandLogo from '../components/BrandLogo'
import {
  downloadCsv, fetchMemberDetail, fetchMembers, formatPhone, memberTypeText, providerText,
  type MemberDetail, type MemberRow, type MembersStats,
} from '../lib/membersAdmin'

function fmtDate(s?: string | null): string {
  if (!s) return '-'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return '-'
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-5 text-center text-slate-600">
      <div>
        <p className="text-lg font-bold text-slate-800">가입 회원 관리</p>
        <p className="mt-2 text-sm">{children}</p>
      </div>
    </div>
  )
}

const LEAD_STATUS_LABEL: Record<string, string> = {
  new: '신규', reviewing: '검토중', contacted: '연락함', meeting_scheduled: '미팅예정',
  proposal_sent: '제안발송', contracted: '계약', nurture: '관리중', not_qualified: '부적합', closed: '종료',
}

export default function AdminMembersPage() {
  const { isAdmin, user, loading } = useAuth()
  const [members, setMembers] = useState<MemberRow[]>([])
  const [stats, setStats] = useState<MembersStats | null>(null)
  const [busy, setBusy] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState<MemberDetail | null>(null)
  const [detailBusy, setDetailBusy] = useState(false)

  useEffect(() => { document.title = '가입 회원 관리 | 미래 AI 랩' }, [])
  useEffect(() => {
    if (!isAdmin) return
    setBusy(true)
    setErr(null)
    fetchMembers()
      .then((r) => { setMembers(r.members); setStats(r.stats) })
      .catch((e) => setErr(e instanceof Error ? e.message : '불러오지 못했습니다.'))
      .finally(() => setBusy(false))
  }, [isAdmin])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter((m) => [m.name, m.email, m.organization].some((v) => String(v ?? '').toLowerCase().includes(q)))
  }, [members, query])

  function exportCsv() {
    const headers = ['가입일', '이름', '이메일', '전화', '회사', '회원유형', '가입경로', '상담건수', '최근상담', '가입쿠폰']
    const rows = filtered.map((m) => [
      fmtDate(m.createdAt), m.name ?? '', m.email ?? '', m.phone ?? '', m.organization ?? '',
      memberTypeText(m.memberType), providerText(m.signupProvider), String(m.leadCount), fmtDate(m.lastLeadAt),
      m.hasSignupCoupon ? '보유' : '-',
    ])
    downloadCsv(`members-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
  }

  async function openDetail(id: string) {
    setDetailBusy(true)
    setDetail(null)
    try { setDetail(await fetchMemberDetail(id)) } catch (e) { setErr(e instanceof Error ? e.message : '상세를 불러오지 못했습니다.') } finally { setDetailBusy(false) }
  }

  if (loading) return <Gate>불러오는 중…</Gate>
  if (!user) return <Gate><Link to="/login" className="font-bold text-blue-600 underline">로그인</Link>이 필요합니다.</Gate>
  if (!isAdmin) return <Navigate to="/" replace />

  const statCards: Array<{ label: string; value: number }> = stats
    ? [
        { label: '전체 회원', value: stats.total },
        { label: '오늘 가입', value: stats.today },
        { label: '대표(기업)', value: stats.business },
        { label: '컨설턴트', value: stats.consultant },
        { label: '상담 연동', value: stats.withLeads },
      ]
    : []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <BrandLogo to="/admin" tagline="가입 회원 관리 · 관리자 전용" imgClassName="h-8 max-w-[144px] sm:h-9 sm:max-w-[168px]" />
          <div className="flex items-center gap-2.5">
            <Link to="/admin/business-leads" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] font-semibold text-slate-600 hover:bg-slate-100 sm:inline">상담 리드</Link>
            <Link to="/admin/payments" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] font-semibold text-slate-600 hover:bg-slate-100 sm:inline">결제 내역</Link>
            <HeaderAccount />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">가입 회원 관리</h1>
        <p className="mt-1 text-sm text-slate-500">가입자 목록과 각 회원의 진단·상담 이력을 확인하고, 엑셀(CSV)로 내보낼 수 있습니다.</p>

        {statCards.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-black tabular-nums text-slate-900">{s.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·이메일·회사 검색"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:max-w-xs"
          />
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            CSV 내보내기 ({filtered.length})
          </button>
        </div>

        {err && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{err}</p>}

        {busy ? (
          <p className="mt-8 text-center text-sm text-slate-400">불러오는 중…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-400">표시할 회원이 없습니다.</p>
        ) : (
          <div className="mt-4 space-y-2.5">
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => openDetail(m.id)}
                className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[1.02rem] font-bold text-slate-900">{m.name || '(이름 미등록)'}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-black ${m.memberType === 'business' ? 'bg-blue-50 text-blue-700' : m.memberType === 'consultant' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                      {memberTypeText(m.memberType)}
                    </span>
                    {m.role === 'admin' && <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[0.72rem] font-black text-white">관리자</span>}
                    {m.hasSignupCoupon && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.72rem] font-black text-amber-700">🎁 쿠폰</span>}
                  </div>
                  <p className="mt-1 truncate text-[0.85rem] text-slate-500">{m.email ?? '이메일 미등록'} · {m.phone || '-'}{m.organization ? ` · ${m.organization}` : ''}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-right text-[0.8rem]">
                  <div><p className="font-semibold text-slate-400">가입</p><p className="font-bold text-slate-700">{fmtDate(m.createdAt)}</p><p className="text-[0.72rem] text-slate-400">{providerText(m.signupProvider)}</p></div>
                  <div><p className="font-semibold text-slate-400">상담</p><p className={`font-black ${m.leadCount > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>{m.leadCount}건</p><p className="text-[0.72rem] text-slate-400">{m.lastLeadAt ? fmtDate(m.lastLeadAt) : '-'}</p></div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* 상세 드로어 */}
      {(detail || detailBusy) && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button type="button" aria-label="닫기" onClick={() => setDetail(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          <div className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <p className="text-base font-black text-slate-900">회원 상세</p>
              <button type="button" onClick={() => setDetail(null)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            {detailBusy || !detail ? (
              <p className="p-8 text-center text-sm text-slate-400">불러오는 중…</p>
            ) : (
              <div className="p-5">
                {(() => {
                  const m = detail.member as Record<string, any>
                  return (
                    <div className="space-y-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                      <Row label="이름">{m.name || '-'}</Row>
                      <Row label="이메일">{m.email || '-'}</Row>
                      <Row label="전화">{m.phone ? formatPhone(m.phone) : '-'}</Row>
                      <Row label="회사">{m.organization || '-'}</Row>
                      <Row label="회원유형">{memberTypeText(m.member_type)}</Row>
                      <Row label="가입경로">{providerText(m.initial_signup_provider)}</Row>
                      <Row label="가입일">{fmtDate(m.created_at)}</Row>
                      <Row label="마지막 로그인">{m.last_login_at ? fmtDate(m.last_login_at) : '-'}</Row>
                      <Row label="온보딩">{m.onboarding_status || '-'}</Row>
                    </div>
                  )
                })()}

                {detail.coupons.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">보유 쿠폰</p>
                    <div className="mt-2 space-y-1.5">
                      {detail.coupons.map((c, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
                          <span className="font-bold text-amber-800">🎁 {c.kind === 'signup' ? '가입 축하' : c.kind}</span>
                          <span className="font-black text-amber-700">{c.amount.toLocaleString('ko-KR')}원 <span className="text-[0.72rem] font-medium text-amber-600/80">({c.status})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">진단·상담 이력 ({detail.leads.length})</p>
                  {detail.leads.length === 0 ? (
                    <p className="mt-2 rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-400">연결된 상담 이력이 없습니다.<br />(이메일·전화 기준으로 매칭됩니다)</p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {detail.leads.map((l) => (
                        <div key={l.id} className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[0.95rem] font-bold text-slate-900">{l.company_name || '-'}</span>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[0.72rem] font-black text-slate-600">{LEAD_STATUS_LABEL[l.lead_status] ?? l.lead_status}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{l.representative_name || '-'} · 등급 {l.lead_grade} · {fmtDate(l.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0 font-semibold text-slate-500">{label}</span>
      <span className="min-w-0 text-right font-medium text-slate-800">{children}</span>
    </div>
  )
}
