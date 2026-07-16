import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import { evaluateAccess, formatDate, type Profile, type Review, type Survey, type ToolAccess } from '../lib/platform'
import {
  adminAccessAction,
  fetchAllAccess,
  fetchAllProfiles,
  fetchAllReviews,
  fetchAllSurveys,
  fetchAllTools,
  type AdminAction,
  type DbTool,
} from '../lib/portal'

const errMsg = (e: unknown) => (e instanceof Error ? e.message : '요청에 실패했습니다.')
const btn = 'rounded border px-2 py-1 text-xs font-medium transition'
const btnNeutral = `${btn} border-slate-300 text-slate-700 hover:bg-slate-50`

type RunAction = (payload: AdminAction) => void

function ModuleRow({
  user,
  module,
  rec,
  run,
}: {
  user: Profile
  module: DbTool
  rec: ToolAccess | undefined
  run: RunAction
}) {
  const [date, setDate] = useState('')
  const view = evaluateAccess(rec)
  return (
    <tr className="border-t border-slate-100 align-top">
      <td className="py-3 pr-3 font-medium text-slate-800">{module.title}</td>
      <td className="px-2 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            view.active ? 'bg-emerald-50 text-emerald-700' : view.blocked ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {view.statusLabel}
        </span>
      </td>
      <td className="px-2 py-3 text-slate-500">{formatDate(rec?.trial_started_at)}</td>
      <td className="px-2 py-3 text-slate-500">{view.unlimited ? '무제한' : formatDate(view.expiresAt)}</td>
      <td className="px-2 py-3 text-slate-500">{view.unlimited ? '∞' : view.remainingLabel}</td>
      <td className="px-2 py-3 text-xs text-slate-400">
        R {rec?.review_extension_used ? '✓' : '–'} / S {rec?.survey_extension_used ? '✓' : '–'}
      </td>
      <td className="px-2 py-3">
        <span className={`text-xs font-semibold ${view.paid ? 'text-emerald-600' : 'text-slate-400'}`}>{view.paid ? '결제' : '미결제'}</span>
      </td>
      <td className="py-3 pl-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => run({ action: 'grant', userId: user.id, toolId: module.id })} className={btnNeutral}>체험 허용</button>
          <button onClick={() => run({ action: 'extend', userId: user.id, toolId: module.id, days: 7 })} className={btnNeutral}>7일 연장</button>
          <button onClick={() => run({ action: 'unlimited', userId: user.id, toolId: module.id })} className={`${btn} border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}>무제한 권한</button>
          <button onClick={() => run({ action: 'revoke', userId: user.id, toolId: module.id })} className={`${btn} border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100`}>접근 차단</button>
          <button onClick={() => run({ action: 'paid', userId: user.id, toolId: module.id, paid: !view.paid })} className={btnNeutral}>
            {view.paid ? '결제 해제' : '결제 완료 처리'}
          </button>
          <span className="inline-flex items-center gap-1">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} title="만료일 직접 지정" className="rounded border border-slate-300 px-1.5 py-1 text-xs" />
            <button disabled={!date} onClick={() => run({ action: 'setExpiry', userId: user.id, toolId: module.id, date })} className={`${btnNeutral} disabled:opacity-40`}>만료일 적용</button>
          </span>
        </div>
      </td>
    </tr>
  )
}

function UserCard({
  user,
  modules,
  access,
  reviews,
  surveys,
  run,
}: {
  user: Profile
  modules: DbTool[]
  access: ToolAccess[]
  reviews: Review[]
  surveys: Survey[]
  run: RunAction
}) {
  const [memo, setMemo] = useState(user.memo ?? '')
  const [showFeedback, setShowFeedback] = useState(false)
  const myReviews = reviews.filter((r) => r.user_id === user.id)
  const mySurveys = surveys.filter((s) => s.user_id === user.id)
  const usingCount = modules.filter((m) => evaluateAccess(access.find((a) => a.user_id === user.id && a.tool_id === m.id)).active).length

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold text-slate-900">
              {user.name}
              <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">{user.role}</span>
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              {user.email}
              {user.phone ? ` · ${user.phone}` : ''}
              {user.organization ? ` · ${user.organization}` : ''}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              가입 {formatDate(user.created_at)} · 마지막 로그인 {formatDate(user.last_login_at)} · 이용중 {usingCount}/{modules.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="관리자 메모" className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
            <button onClick={() => run({ action: 'memo', userId: user.id, memo })} className={btnNeutral}>메모 저장</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-6 py-2">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2 pr-3">모듈</th>
              <th className="px-2 py-2">상태</th>
              <th className="px-2 py-2">시작일</th>
              <th className="px-2 py-2">만료일</th>
              <th className="px-2 py-2">남은</th>
              <th className="px-2 py-2">연장</th>
              <th className="px-2 py-2">결제</th>
              <th className="py-2 pl-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <ModuleRow key={m.id} user={user} module={m} rec={access.find((a) => a.user_id === user.id && a.tool_id === m.id)} run={run} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-6 py-3">
        <button onClick={() => setShowFeedback((v) => !v)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          리뷰 {myReviews.length} · 설문 {mySurveys.length} {showFeedback ? '접기 ▲' : '보기 ▼'}
        </button>
        {showFeedback && (
          <div className="mt-3 space-y-3">
            {myReviews.length === 0 && mySurveys.length === 0 && <p className="text-sm text-slate-400">제출한 리뷰/설문이 없습니다.</p>}
            {myReviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    리뷰 · {r.char_count}자 ·{' '}
                    <span className={r.status === 'approved' ? 'text-emerald-600' : r.status === 'rejected' ? 'text-rose-600' : 'text-slate-500'}>{r.status}</span>
                  </span>
                  <span className="flex gap-1.5">
                    <button onClick={() => run({ action: 'reviewStatus', reviewId: r.id, status: 'approved' })} className={btnNeutral}>승인</button>
                    <button onClick={() => run({ action: 'reviewStatus', reviewId: r.id, status: 'rejected' })} className={btnNeutral}>반려</button>
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">{r.content}</p>
              </div>
            ))}
            {mySurveys.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500">설문 · {formatDate(s.created_at)}</p>
                <ul className="mt-1.5 space-y-0.5 text-sm text-slate-600">
                  {Object.entries(s.answers)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <li key={k}>
                        <span className="text-slate-400">{k}</span> — {String(v)}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function AdminPage() {
  const { user, isAdmin, configured, loading } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [tools, setTools] = useState<DbTool[]>([])
  const [access, setAccess] = useState<ToolAccess[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [err, setErr] = useState('')
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('all')

  const load = useCallback(async () => {
    setDataLoading(true)
    setErr('')
    try {
      const [p, t, a, r, s] = await Promise.all([
        fetchAllProfiles(),
        fetchAllTools(),
        fetchAllAccess(),
        fetchAllReviews(),
        fetchAllSurveys(),
      ])
      setProfiles(p)
      setTools(t)
      setAccess(a)
      setReviews(r)
      setSurveys(s)
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (configured && isAdmin) void load()
    else setDataLoading(false)
  }, [configured, isAdmin, load])

  const run = useCallback<RunAction>(
    (payload) => {
      void (async () => {
        try {
          await adminAccessAction(payload)
          await load()
        } catch (e) {
          setErr(errMsg(e))
        }
      })()
    },
    [load],
  )

  if (loading) return <PageShell title="관리자"><p className="text-slate-500">불러오는 중…</p></PageShell>
  if (!configured) {
    return (
      <PageShell title="관리자" subtitle="Supabase 환경변수 설정 후 이용할 수 있습니다.">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">Supabase 환경변수가 설정되지 않았습니다.</div>
      </PageShell>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) {
    return (
      <PageShell title="관리자" subtitle="이 페이지는 관리자만 접근할 수 있습니다.">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <p className="font-semibold">관리자 권한이 필요합니다.</p>
          <p className="mt-1 text-sm">
            현재 계정에는 권한이 없습니다. 관리자 계정으로 로그인해 주세요.{' '}
            <Link to="/login" className="font-semibold underline">로그인</Link>
          </p>
        </div>
      </PageShell>
    )
  }

  const modulesAll = tools.filter((t) => t.is_trial_available)
  const modules = toolFilter === 'all' ? modulesAll : modulesAll.filter((m) => m.id === toolFilter)
  const q = query.trim().toLowerCase()
  const filtered = profiles.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone ?? '').replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')),
  )

  return (
    <PageShell title="관리자" subtitle="사용자별 도구 이용 기간, 체험 상태, 리뷰·설문 참여 여부, 결제 상태를 관리할 수 있습니다.">
      {err && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700">{err}</div>}

      <div className="mb-6 flex flex-wrap gap-2.5">
        <Link
          to="/admin/members"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-700"
        >
          👥 가입 회원 관리 →
        </Link>
        <Link
          to="/admin/business-leads"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
        >
          📋 기업 성장진단 DB 관리 →
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          ['가입 사용자', profiles.length],
          ['제출 리뷰', reviews.length],
          ['제출 설문', surveys.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="사용자 검색 (이름 · 이메일 · 휴대폰)" className="w-72 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
        <select value={toolFilter} onChange={(e) => setToolFilter(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500">
          <option value="all">전체 도구</option>
          {modulesAll.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
        <span className="text-sm text-slate-400">{filtered.length}명 표시</span>
      </div>

      {dataLoading ? (
        <p className="text-slate-500">불러오는 중…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
          {profiles.length === 0 ? '아직 가입한 사용자가 없습니다.' : '검색 결과가 없습니다.'}
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((u) => (
            <UserCard key={u.id} user={u} modules={modules} access={access} reviews={reviews} surveys={surveys} run={run} />
          ))}
        </div>
      )}

      <p className="mt-8 text-sm leading-relaxed text-slate-400">
        권한 변경은 서버리스 API(<code>/api/admin/access</code>, service_role)를 통해 처리되며, RLS로 보호됩니다.
      </p>
    </PageShell>
  )
}
