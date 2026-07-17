// /admin/reviews — 상품 후기 관리(관리자 전용). 승인/반려 + 전자책 발송 체크 + 연락처 CSV.
// 데이터는 service_role 서버 API(/api/reviews) 경유. 접근제어는 useAuth().isAdmin.
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import { useAuth } from '../lib/auth'
import { downloadCsv } from '../lib/businessLeadsAdmin'
import { fetchAdminReviews, moderateReview, type AdminReview, type AdminReviewStats } from '../lib/reviews'

function fmtDate(s?: string | null): string {
  if (!s) return '-'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return '-'
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const STATUS_LABEL: Record<string, string> = { pending: '대기', approved: '공개', rejected: '반려' }
const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-slate-200 text-slate-500',
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-5 text-center text-slate-600">
      <div>
        <p className="text-lg font-bold text-slate-800">상품 후기 관리</p>
        <p className="mt-2 text-sm">{children}</p>
      </div>
    </div>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <span className="text-sm leading-none" aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'text-amber-400' : 'text-slate-300'} aria-hidden>★</span>
      ))}
    </span>
  )
}

type Filter = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminReviewsPage() {
  const { isAdmin, user, loading } = useAuth()
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [stats, setStats] = useState<AdminReviewStats | null>(null)
  const [busy, setBusy] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('pending')
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => { document.title = '상품 후기 관리 | 미래 AI 랩' }, [])

  function load() {
    setBusy(true)
    setErr(null)
    fetchAdminReviews()
      .then((r) => { setReviews(r.reviews); setStats(r.stats) })
      .catch((e) => setErr(e instanceof Error ? e.message : '불러오지 못했습니다.'))
      .finally(() => setBusy(false))
  }
  useEffect(() => { if (isAdmin) load() }, [isAdmin])

  const filtered = useMemo(
    () => (filter === 'all' ? reviews : reviews.filter((r) => r.status === filter)),
    [reviews, filter],
  )

  async function act(id: string, patch: { status?: 'pending' | 'approved' | 'rejected'; ebookSent?: boolean }) {
    setActingId(id)
    setErr(null)
    try {
      await moderateReview(id, patch)
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...('status' in patch ? { status: patch.status! } : {}), ...('ebookSent' in patch ? { ebook_sent: patch.ebookSent! } : {}) } : r)))
      // 통계 재계산을 위해 조용히 리로드
      fetchAdminReviews().then((r) => setStats(r.stats)).catch(() => {})
    } catch (e) {
      setErr(e instanceof Error ? e.message : '변경에 실패했습니다.')
    } finally {
      setActingId(null)
    }
  }

  function exportContacts() {
    const headers = ['등록일', '표시명', '회사·업종', '별점', '이메일', '연락처', '상태', '전자책발송', '내용']
    const rows = reviews.map((r) => [
      fmtDate(r.created_at), r.author_name, r.company ?? '', String(r.rating),
      r.contact_email ?? '', r.contact_phone ?? '', STATUS_LABEL[r.status] ?? r.status,
      r.ebook_sent ? '완료' : '미발송', r.content,
    ])
    downloadCsv(`product-reviews-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
  }

  if (loading) return <Gate>불러오는 중…</Gate>
  if (!user) return <Gate><Link to="/login" className="font-bold text-blue-600 underline">로그인</Link>이 필요합니다.</Gate>
  if (!isAdmin) return <Navigate to="/" replace />

  const statCards: Array<{ label: string; value: number; key: Filter | 'ebook' }> = stats
    ? [
        { label: '전체', value: stats.total, key: 'all' },
        { label: '승인 대기', value: stats.pending, key: 'pending' },
        { label: '공개중', value: stats.approved, key: 'approved' },
        { label: '반려', value: stats.rejected, key: 'rejected' },
        { label: '전자책 미발송', value: stats.ebookPending, key: 'ebook' },
      ]
    : []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">상품 후기 관리</span>
              <span className="text-[0.72rem] font-medium text-slate-500">관리자 전용</span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link to="/admin/members" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] font-semibold text-slate-600 hover:bg-slate-100 sm:inline">회원 관리</Link>
            <Link to="/admin/business-leads" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[0.85rem] font-semibold text-slate-600 hover:bg-slate-100 sm:inline">상담 리드</Link>
            <HeaderAccount />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="text-2xl font-black tracking-tight">상품 후기 관리</h1>
        <p className="mt-1 text-sm text-slate-500">고객 후기를 검토·공개하고, 전자책 3종 발송 여부를 관리합니다. 연락처는 전자책 발송 용도로만 사용하세요.</p>

        {statCards.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {statCards.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => s.key !== 'ebook' && setFilter(s.key as Filter)}
                className={`rounded-2xl border p-4 text-center transition-colors ${
                  s.key !== 'ebook' && filter === s.key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className={`text-2xl font-black tabular-nums ${s.key === 'ebook' && s.value > 0 ? 'text-amber-500' : ''}`}>{s.value}</p>
                <p className={`mt-1 text-xs font-semibold ${s.key !== 'ebook' && filter === s.key ? 'text-slate-200' : 'text-slate-500'}`}>{s.label}</p>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100'}`}
              >
                {f === 'all' ? '전체' : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={exportContacts}
            disabled={reviews.length === 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            연락처 CSV
          </button>
        </div>

        {err && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{err}</p>}

        {busy ? (
          <p className="mt-8 text-center text-sm text-slate-400">불러오는 중…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-400">해당하는 후기가 없습니다.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[1.02rem] font-bold text-slate-900">{r.author_name}</span>
                  {r.company && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.72rem] font-semibold text-slate-500">{r.company}</span>}
                  <Stars value={r.rating} />
                  <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-black ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status] ?? r.status}</span>
                  {r.status === 'approved' && (
                    <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-black ${r.ebook_sent ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.ebook_sent ? '🎁 전자책 발송완료' : '🎁 전자책 미발송'}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-medium text-slate-400">{fmtDate(r.created_at)}</span>
                </div>

                <p className="mt-3 whitespace-pre-line text-[1.02rem] leading-relaxed text-slate-700">{r.content}</p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {r.contact_email && <span>✉️ {r.contact_email}</span>}
                  {r.contact_phone && <span>📞 {r.contact_phone}</span>}
                  {!r.contact_email && !r.contact_phone && <span className="text-slate-400">연락처 미입력</span>}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {r.status !== 'approved' && (
                    <button type="button" disabled={actingId === r.id} onClick={() => act(r.id, { status: 'approved' })}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">✓ 공개 승인</button>
                  )}
                  {r.status !== 'rejected' && (
                    <button type="button" disabled={actingId === r.id} onClick={() => act(r.id, { status: 'rejected' })}
                      className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-100 disabled:opacity-50">✕ 반려</button>
                  )}
                  {r.status !== 'pending' && (
                    <button type="button" disabled={actingId === r.id} onClick={() => act(r.id, { status: 'pending' })}
                      className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-100 disabled:opacity-50">대기로</button>
                  )}
                  <button type="button" disabled={actingId === r.id} onClick={() => act(r.id, { ebookSent: !r.ebook_sent })}
                    className={`rounded-lg px-3 py-2 text-sm font-bold disabled:opacity-50 ${r.ebook_sent ? 'bg-white text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-100' : 'bg-amber-400 text-slate-900 hover:-translate-y-0.5 transition-transform'}`}>
                    {r.ebook_sent ? '전자책 발송 취소' : '🎁 전자책 발송 완료 표시'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
