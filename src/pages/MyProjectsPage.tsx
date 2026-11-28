// /my-projects — My MIRAE 성장 홈(고객 프로젝트 목록).
// 미래AI랩과 진행 중인 컨설팅 프로젝트가 연결된 회원에게만 내용이 있고, 그 외에는 안내만 보인다.
// 맨 위 '지금 할 일'(3개까지 — 새 보고서 · 새 결과 자료 · 올릴 서류 · 해야 할 일) → 최근 보고서(3편) → 프로젝트 카드.
// 보고서 칸은 0033 이 켜진 곳에서만 — 꺼져 있으면 예전 목록 그대로.
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import NoIndex from '../components/NoIndex'
import { useAuth } from '../lib/auth'
import {
  CUSTOMER_STAGE_LABEL,
  REPORT_KIND_LABEL,
  fetchGrowthSummary,
  fetchResultSummary,
  fetchRecommendations,
  markRecommendationInterest,
  type PortalRecommendation,
  fetchMyProjects,
  fetchReports,
  formatKDate,
  isPortalNotReady,
  markHome,
  type GrowthSummary,
  type MyProject,
  type PortalReportItem,
} from '../lib/customerPortal'
import { errorText } from '../lib/apiFetch'

type LoadState = { kind: 'loading' } | { kind: 'ready'; projects: MyProject[] } | { kind: 'not_ready' } | { kind: 'error'; message: string }

export function NoLinkedProject({ email }: { email?: string | null } = {}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center" data-testid="growth-unlinked">
      <p className="text-lg font-bold text-slate-900">아직 연결된 프로젝트가 없습니다</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        미래AI랩과 진행 중인 컨설팅 프로젝트가 연결되면 이곳에서 진행상태와 요청자료를 확인할 수 있습니다.
        연결은 담당 컨설턴트가 회원 이메일로 진행합니다.
      </p>
      {email && (
        <p className="mx-auto mt-3 max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 [overflow-wrap:anywhere]">
          가입한 이메일 <span className="font-bold">{email}</span> — 담당 컨설턴트에게 이 이메일을 알려 주세요.
        </p>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link to="/business-services" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
          컨설팅 서비스 보기
        </Link>
        <Link to="/business-diagnosis" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
          무료 사업 진단
        </Link>
      </div>
    </div>
  )
}

export function PortalNotReady() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="text-base font-bold text-amber-800">고객 프로젝트 화면을 준비하고 있습니다</p>
      <p className="mt-1 text-sm leading-relaxed text-amber-900/80">
        곧 이곳에서 진행상태·요청자료·업데이트를 확인할 수 있습니다. 급한 문의는 담당 컨설턴트에게 연락해 주세요.
      </p>
    </div>
  )
}

type Recent = PortalReportItem & { link_id: string; project: string }
type TodoItem = { key: string; to: string; label: string; sub: string }
type Reco = PortalRecommendation & { link_id: string; project: string }

const RECO_KIND_LABEL = { grant: '지원사업', task: '다음 과제' } as const
const safeUrl = (u: string | null) => (u && /^https?:\/\/[^\s<>"]+$/i.test(u) ? u : null)
/** 마감 글 — '1/15 마감' · 7일 안이면 남은 날 · 지났으면 '마감' */
function recoDeadline(deadline: string | null): string {
  if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return ''
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const [y, m, d] = deadline.split('-').map(Number)
  const left = Math.round((new Date(y, m - 1, d).getTime() - today) / 86_400_000)
  if (left < 0) return '마감'
  if (left === 0) return '오늘 마감'
  return left <= 7 ? `${m}/${d} 마감 · ${left}일 남음` : `${m}/${d} 마감`
}

export default function MyProjectsPage() {
  const { loading, configured, user, needsOnboarding } = useAuth()
  const [state, setState] = useState<LoadState>({ kind: 'loading' })
  // 보고서 칸 — null 이면 꺼진 환경(예전 그대로)
  const [growth, setGrowth] = useState<{ summary: GrowthSummary[]; recent: Recent[] } | null>(null)
  // 새 결과 자료 수(프로젝트마다 · 이 계정 기준) — null 이면 이 기능이 없는 환경(표시만 빠짐)
  const [resultNew, setResultNew] = useState<Map<string, number> | null>(null)
  // 담당자가 추천해요 — null 이면 이 기능이 없는 환경(그 칸만 빠짐)
  const [recos, setRecos] = useState<Reco[] | null>(null)
  const [interestBusy, setInterestBusy] = useState('')

  useEffect(() => { document.title = '내 프로젝트 | 미래 AI 랩' }, [])

  useEffect(() => {
    if (!user || !configured) return
    let alive = true
    fetchMyProjects()
      .then(async (projects) => {
        if (!alive) return
        setState({ kind: 'ready', projects })
        if (!projects.length) return
        void markHome()
        void fetchResultSummary().then((rs) => {
          if (alive && rs) setResultNew(new Map(rs.map((x) => [x.link_id, Number(x.results_new) || 0])))
        })
        void Promise.all(projects.slice(0, 5).map((p) => fetchRecommendations(p.link_id))).then((lists) => {
          if (!alive || lists.every((l) => l === null)) return
          setRecos(lists.flatMap((l, i) => (l ?? []).map((r) => ({ ...r, link_id: projects[i].link_id, project: projects[i].name }))))
        })
        try {
          const summary = await fetchGrowthSummary()
          if (!alive || summary === null) return
          const withReports = summary.filter((x) => x.reports_total > 0).slice(0, 5)
          const lists = await Promise.all(withReports.map((x) => fetchReports(x.link_id).catch(() => null)))
          const name = (id: string) => projects.find((p) => p.link_id === id)?.name ?? ''
          const recent = lists
            .flatMap((l, i) => (l ?? []).map((r) => ({ ...r, link_id: withReports[i].link_id, project: name(withReports[i].link_id) })))
            .sort((a, b) => b.published_at.localeCompare(a.published_at))
          if (alive) setGrowth({ summary, recent })
        } catch {
          /* 보고서 칸만 빠지고 목록은 그대로 */
        }
      })
      .catch((e) => {
        if (!alive) return
        if (isPortalNotReady(e)) setState({ kind: 'not_ready' })
        else setState({ kind: 'error', message: errorText(e, '불러오지 못했어요. 잠시 후 [다시 시도] 를 눌러 주세요.') })
      })
    return () => { alive = false }
  }, [user, configured])

  const projects = useMemo(() => (state.kind === 'ready' ? state.projects : []), [state])
  const todo = useMemo<TodoItem[]>(() => {
    const out: TodoItem[] = []
    for (const r of growth?.recent ?? []) {
      if (!r.seen_at) out.push({ key: `r:${r.id}`, to: `/my-projects/reports/${r.id}?link=${r.link_id}`, label: `새 보고서 · ${r.title}`, sub: `${r.project} · ${formatKDate(r.published_at)}` })
    }
    for (const p of projects) {
      const n = resultNew?.get(p.link_id) ?? 0
      if (n > 0) out.push({ key: `res:${p.link_id}`, to: `/my-projects/${p.link_id}?tab=results`, label: `새 결과 자료 ${n}개`, sub: p.name })
    }
    for (const p of projects) {
      if (p.requested_documents > 0) out.push({ key: `d:${p.link_id}`, to: `/my-projects/${p.link_id}?tab=todo`, label: `서류 ${p.requested_documents}개 올려 주세요`, sub: p.name })
      if (p.pending_actions > 0) out.push({ key: `a:${p.link_id}`, to: `/my-projects/${p.link_id}?tab=todo`, label: `해야 할 일 ${p.pending_actions}건`, sub: p.name })
    }
    return out
  }, [growth, projects, resultNew])
  const reportsOf = (linkId: string) => growth?.summary.find((x) => x.link_id === linkId) ?? null

  if (!configured) {
    return <PageShell title="내 프로젝트" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">서비스를 준비하고 있습니다.</p></PageShell>
  }
  if (loading) {
    return <PageShell title="내 프로젝트" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p></PageShell>
  }
  if (!user) return <Navigate to="/login?next=%2Fmy-projects" replace />
  if (needsOnboarding) return <Navigate to="/auth/onboarding?next=%2Fmy-projects" replace />

  return (
    <PageShell title="내 프로젝트" subtitle="미래AI랩과 진행 중인 컨설팅의 진행상태·요청자료·업데이트를 확인합니다.">
      <NoIndex />
      <div className="max-w-3xl space-y-4" data-testid="growth-home" data-growth={growth ? 'on' : 'off'}>
        {state.kind === 'loading' && <p className="text-slate-500">불러오는 중…</p>}
        {state.kind === 'not_ready' && <PortalNotReady />}
        {state.kind === 'error' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            {state.message}
            <button type="button" onClick={() => window.location.reload()} className="ml-2 font-bold underline">다시 시도</button>
          </div>
        )}
        {state.kind === 'ready' && state.projects.length === 0 && <NoLinkedProject email={user.email} />}

        {/* 지금 할 일 — 3개까지 */}
        {state.kind === 'ready' && todo.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="growth-todo">
            <p className="text-base font-black text-slate-900">지금 할 일 <span className="text-slate-400">{todo.length}</span></p>
            <ul className="mt-2 divide-y divide-slate-100">
              {todo.slice(0, 3).map((t) => (
                <li key={t.key}>
                  <Link to={t.to} className="flex min-h-12 items-center justify-between gap-3 py-2.5 hover:text-slate-900" data-testid="growth-todo-item">
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-slate-900 [overflow-wrap:anywhere]">{t.label}</span>
                      <span className="block truncate text-xs text-slate-500">{t.sub}</span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-slate-400">›</span>
                  </Link>
                </li>
              ))}
            </ul>
            {todo.length > 3 && <p className="mt-1 text-xs text-slate-500">그 밖에 {todo.length - 3}건은 프로젝트 화면에서 볼 수 있어요.</p>}
          </section>
        )}

        {/* 담당자가 추천해요 — 담당자가 고른 것만(업체마다 3개까지) · [관심 있어요] 는 계정마다 한 번 */}
        {state.kind === 'ready' && recos && recos.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="growth-recos">
            <p className="text-base font-black text-slate-900">담당자가 추천해요 <span className="text-slate-400">{recos.length}</span></p>
            <ul className="mt-2 divide-y divide-slate-100">
              {recos.map((r) => {
                const dl = recoDeadline(r.deadline)
                const url = safeUrl(r.link_url)
                return (
                  <li key={r.id} className="py-3" data-testid="growth-reco" data-interested={r.interested_at ? '1' : '0'}>
                    <p className="text-xs text-slate-500">{RECO_KIND_LABEL[r.kind] ?? '추천'}{dl ? ` · ${dl}` : ''}{projects.length > 1 ? ` · ${r.project}` : ''}</p>
                    <p className="text-[15px] font-bold text-slate-900 [overflow-wrap:anywhere]">{r.title}</p>
                    {r.reason && <p className="text-sm text-slate-600 [overflow-wrap:anywhere]">{r.reason}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-3 text-sm font-bold text-slate-800 hover:bg-slate-50" data-testid="growth-reco-link">
                          자세히
                        </a>
                      )}
                      {r.interested_at ? (
                        <span className="text-sm font-bold text-emerald-700" data-testid="growth-reco-sent">관심 보냄 {formatKDate(r.interested_at)} · 담당자가 연락드려요</span>
                      ) : (
                        <button
                          type="button"
                          disabled={!!interestBusy}
                          onClick={() => {
                            setInterestBusy(r.id)
                            void markRecommendationInterest(r.link_id, r.id)
                              .then((at) => {
                                if (at) setRecos((cur) => (cur ? cur.map((x) => (x.id === r.id && x.link_id === r.link_id ? { ...x, interested_at: at } : x)) : cur))
                              })
                              .finally(() => setInterestBusy(''))
                          }}
                          className="inline-flex min-h-10 items-center rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60"
                          data-testid="growth-reco-interest"
                        >
                          관심 있어요
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="mt-1 text-xs text-slate-500">[관심 있어요] 를 누르면 담당자가 연락드려요. 신청 · 계약이 아니에요.</p>
          </section>
        )}

        {/* 최근 보고서 — 3편 */}
        {state.kind === 'ready' && growth && growth.recent.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="growth-recent">
            <p className="text-base font-black text-slate-900">최근 보고서</p>
            <ul className="mt-2 divide-y divide-slate-100">
              {growth.recent.slice(0, 3).map((r) => (
                <li key={r.id}>
                  <Link to={`/my-projects/reports/${r.id}?link=${r.link_id}`} className="flex min-h-12 items-center justify-between gap-3 py-2.5" data-testid="growth-recent-item" data-state={!r.seen_at ? 'new' : r.acknowledged_at ? 'acked' : 'seen'}>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-slate-900 [overflow-wrap:anywhere]">{r.title}</span>
                      <span className="block truncate text-xs text-slate-500">{REPORT_KIND_LABEL[r.kind] ?? '보고서'} · {formatKDate(r.published_at)}{projects.length > 1 ? ` · ${r.project}` : ''}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-black ${!r.seen_at ? 'bg-rose-50 text-rose-700' : r.acknowledged_at ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {!r.seen_at ? '새 보고서' : r.acknowledged_at ? '확인함' : '확인 전'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {state.kind === 'ready' && state.projects.map((p) => {
          const todoN = p.pending_actions + p.requested_documents
          const g = reportsOf(p.link_id)
          // 해야 할 일이 없어도 새 보고서 · 새 결과 자료가 있으면 '확인할 일 없음' 이라고 하지 않는다(위 '지금 할 일' 과 같은 말)
          const newN = (g?.reports_unseen ?? 0) + (resultNew?.get(p.link_id) ?? 0)
          return (
            <Link
              key={p.link_id}
              to={`/my-projects/${p.link_id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-400"
              data-testid="project-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black tracking-tight text-slate-900">{p.name}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {CUSTOMER_STAGE_LABEL[p.stage]}
                    {p.consultant_name ? ` · 담당 ${p.consultant_name}` : ''}
                    {p.updated_at ? ` · 업데이트 ${formatKDate(p.updated_at)}` : ''}
                  </p>
                </div>
                {todoN > 0 ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">해야 할 일 {todoN}</span>
                ) : newN > 0 ? (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700" data-testid="project-new-pill">새로 온 자료 {newN}</span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">확인할 일 없음</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                <span>요청받은 서류 {p.requested_documents}</span>
                <span>내 요청 {p.open_requests}</span>
                {g && <span data-testid="project-reports-count">보고서 {g.reports_total}{g.reports_unseen > 0 ? ` · 새 보고서 ${g.reports_unseen}` : ''}</span>}
                {(resultNew?.get(p.link_id) ?? 0) > 0 && <span data-testid="project-results-new">새 결과 자료 {resultNew?.get(p.link_id)}</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
