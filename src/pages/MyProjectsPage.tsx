// /my-projects — My MIRAE 고객 프로젝트 목록.
// 미래AI랩과 진행 중인 컨설팅 프로젝트가 연결된 회원에게만 내용이 있고, 그 외에는 안내만 보인다.
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import NoIndex from '../components/NoIndex'
import { useAuth } from '../lib/auth'
import { CUSTOMER_STAGE_LABEL, fetchMyProjects, formatKDate, isPortalNotReady, type MyProject } from '../lib/customerPortal'

type LoadState = { kind: 'loading' } | { kind: 'ready'; projects: MyProject[] } | { kind: 'not_ready' } | { kind: 'error'; message: string }

export function NoLinkedProject() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-lg font-bold text-slate-900">아직 연결된 프로젝트가 없습니다</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        미래AI랩과 진행 중인 컨설팅 프로젝트가 연결되면 이곳에서 진행상태와 요청자료를 확인할 수 있습니다.
        연결은 담당 컨설턴트가 회원 이메일로 진행합니다.
      </p>
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

export default function MyProjectsPage() {
  const { loading, configured, user, needsOnboarding } = useAuth()
  const [state, setState] = useState<LoadState>({ kind: 'loading' })

  useEffect(() => { document.title = '내 프로젝트 | 미래 AI 랩' }, [])

  useEffect(() => {
    if (!user || !configured) return
    let alive = true
    fetchMyProjects()
      .then((projects) => { if (alive) setState({ kind: 'ready', projects }) })
      .catch((e) => {
        if (!alive) return
        if (isPortalNotReady(e)) setState({ kind: 'not_ready' })
        else setState({ kind: 'error', message: e instanceof Error ? e.message : '불러오지 못했습니다.' })
      })
    return () => { alive = false }
  }, [user, configured])

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
      <div className="max-w-3xl space-y-4">
        {state.kind === 'loading' && <p className="text-slate-500">불러오는 중…</p>}
        {state.kind === 'not_ready' && <PortalNotReady />}
        {state.kind === 'error' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            {state.message}
            <button type="button" onClick={() => window.location.reload()} className="ml-2 font-bold underline">다시 시도</button>
          </div>
        )}
        {state.kind === 'ready' && state.projects.length === 0 && <NoLinkedProject />}
        {state.kind === 'ready' && state.projects.map((p) => {
          const todo = p.pending_actions + p.requested_documents
          return (
            <Link
              key={p.link_id}
              to={`/my-projects/${p.link_id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-400"
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
                {todo > 0 ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">해야 할 일 {todo}</span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">확인할 일 없음</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                <span>요청받은 서류 {p.requested_documents}</span>
                <span>내 요청 {p.open_requests}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
