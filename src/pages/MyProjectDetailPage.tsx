// /my-projects/:linkId — 고객 프로젝트 상세 (My MIRAE).
// 탭: 지금 해야 할 일 · 진행 상태 · 서류 · 업데이트 · 내 요청 · 결과.
// 여기 보이는 모든 값은 서버가 고객용으로 골라 준 것(portal_project)이며 내부 메모·수임료·내부 단계는 포함되지 않는다.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import NoIndex from '../components/NoIndex'
import { useAuth } from '../lib/auth'
import {
  CUSTOMER_STAGE_LABEL,
  CUSTOMER_STAGE_ORDER,
  DOCUMENT_STATUS_LABEL,
  REQUEST_STATUS_LABEL,
  REQUEST_TYPE_LABEL,
  UPDATE_CATEGORY_LABEL,
  completeAction,
  createRequest,
  fetchProject,
  formatKDate,
  isPortalNotReady,
  signedFileUrl,
  uploadDocument,
  type PortalDocument,
  type PortalProject,
  type PortalRequestType,
} from '../lib/customerPortal'
import { PortalNotReady } from './MyProjectsPage'

type Tab = 'todo' | 'progress' | 'documents' | 'updates' | 'requests' | 'results'
const TABS: { key: Tab; label: string }[] = [
  { key: 'todo', label: '지금 해야 할 일' },
  { key: 'progress', label: '진행 상태' },
  { key: 'documents', label: '서류' },
  { key: 'updates', label: '업데이트' },
  { key: 'requests', label: '내 요청' },
  { key: 'results', label: '결과' },
]

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">{text}</p>
}

/** 서류 한 줄 — 요청받은 것은 업로드, 올린 것은 상태·열기 */
function DocumentRow({
  doc,
  linkId,
  onChanged,
}: {
  doc: PortalDocument
  linkId: string
  onChanged: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const needsUpload = doc.status === 'requested' || doc.status === 'rejected'

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true); setError('')
    try {
      await uploadDocument(linkId, file, { documentId: doc.id, documentType: doc.document_type, title: doc.title })
      onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : '올리지 못했습니다.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const open = async () => {
    if (!doc.storage_path) return
    try {
      const url = await signedFileUrl(doc.storage_path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setError(e instanceof Error ? e.message : '파일을 열지 못했습니다.')
    }
  }

  const badge =
    doc.status === 'verified' ? 'bg-emerald-50 text-emerald-700'
      : doc.status === 'uploaded' ? 'bg-blue-50 text-blue-700'
        : doc.status === 'rejected' ? 'bg-rose-50 text-rose-700'
          : 'bg-amber-100 text-amber-800'

  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-900">{doc.title}</p>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${badge}`}>{DOCUMENT_STATUS_LABEL[doc.status] ?? doc.status}</span>
          {doc.visibility === 'shared_with_customer' && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600">미래AI랩이 공유</span>}
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {doc.customer_note ? `${doc.customer_note} · ` : ''}
          {doc.file_name ? `${doc.file_name} · ` : ''}
          {doc.uploaded_at ? `올린 날 ${formatKDate(doc.uploaded_at)}` : doc.requested_at ? `요청일 ${formatKDate(doc.requested_at)}` : ''}
        </p>
        {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        {needsUpload && (
          <>
            <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.hwp,.docx,.xlsx" onChange={(e) => void pick(e.target.files?.[0])} />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? '올리는 중…' : doc.status === 'rejected' ? '다시 올리기' : '파일 올리기'}
            </button>
          </>
        )}
        {doc.storage_path && (
          <button type="button" onClick={() => void open()} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            열기
          </button>
        )}
      </div>
    </li>
  )
}

function RequestForm({ linkId, onCreated }: { linkId: string; onCreated: () => void }) {
  const [type, setType] = useState<PortalRequestType>('status')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!title.trim()) { setError('무엇을 문의하는지 한 줄로 적어 주세요.'); return }
    setBusy(true); setError('')
    try {
      await createRequest(linkId, type, title.trim(), body.trim())
      setTitle(''); setBody('')
      onCreated()
    } catch (e) {
      setError(e instanceof Error ? e.message : '보내지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <p className="text-base font-black text-slate-900">다시 문의 · 추가 요청</p>
      <p className="mt-1 text-sm text-slate-500">담당 컨설턴트에게 바로 전달됩니다.</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(Object.keys(REQUEST_TYPE_LABEL) as PortalRequestType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            aria-pressed={type === t}
            className={`rounded-full border px-3 py-1 text-xs font-bold ${type === t ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {REQUEST_TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 벤처인증 진행 상황이 궁금합니다"
        aria-label="요청 제목"
        className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="자세한 내용 (선택)"
        aria-label="요청 내용"
        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
      />
      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
      <button type="button" disabled={busy} onClick={() => void submit()} className="mt-3 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
        {busy ? '보내는 중…' : '보내기'}
      </button>
    </Card>
  )
}

export default function MyProjectDetailPage() {
  const { linkId = '' } = useParams()
  const { loading, configured, user, needsOnboarding } = useAuth()
  const [tab, setTab] = useState<Tab>('todo')
  const [data, setData] = useState<PortalProject | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'not_ready' | 'denied' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await fetchProject(linkId)
      if (!d.project) { setState('denied'); return }
      setData(d)
      setState('ready')
    } catch (e) {
      if (isPortalNotReady(e)) setState('not_ready')
      else if (/not found|P0002|permission/i.test(e instanceof Error ? e.message : String(e))) setState('denied')
      else { setState('error'); setMessage(e instanceof Error ? e.message : '불러오지 못했습니다.') }
    }
  }, [linkId])

  useEffect(() => {
    if (!user || !configured) return
    void load()
  }, [user, configured, load])

  useEffect(() => {
    document.title = data?.project ? `${data.project.name} | 미래 AI 랩` : '내 프로젝트 | 미래 AI 랩'
  }, [data])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(id)
  }, [toast])

  const todo = useMemo(() => {
    if (!data) return { actions: [], docs: [] }
    return {
      actions: data.updates.filter((u) => u.action_required && !u.completed_at),
      docs: data.documents.filter((d) => d.status === 'requested' || d.status === 'rejected'),
    }
  }, [data])

  if (!configured) {
    return <PageShell title="내 프로젝트" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">서비스를 준비하고 있습니다.</p></PageShell>
  }
  if (loading) {
    return <PageShell title="내 프로젝트" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p></PageShell>
  }
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(`/my-projects/${linkId}`)}`} replace />
  if (needsOnboarding) return <Navigate to="/auth/onboarding?next=%2Fmy-projects" replace />

  if (state === 'loading') {
    return <PageShell title="내 프로젝트" compact><NoIndex /><p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p></PageShell>
  }
  if (state === 'not_ready') {
    return <PageShell title="내 프로젝트" compact><NoIndex /><PortalNotReady /></PageShell>
  }
  if (state === 'denied') {
    return (
      <PageShell title="찾을 수 없는 프로젝트" compact>
        <NoIndex />
        <p className="text-sm text-slate-600">이 프로젝트를 볼 수 있는 권한이 없거나 주소가 잘못되었습니다.</p>
        <Link to="/my-projects" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">내 프로젝트로</Link>
      </PageShell>
    )
  }
  if (state === 'error' || !data?.project) {
    return (
      <PageShell title="내 프로젝트" compact>
        <NoIndex />
        <p className="text-sm text-rose-700">{message || '불러오지 못했습니다.'}</p>
        <button type="button" onClick={() => void load()} className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold">다시 시도</button>
      </PageShell>
    )
  }

  const p = data.project
  const stageIdx = CUSTOMER_STAGE_ORDER.indexOf(p.stage)
  const todoCount = todo.actions.length + todo.docs.length

  return (
    <PageShell title={p.name} subtitle={`${CUSTOMER_STAGE_LABEL[p.stage]}${p.consultant_name ? ` · 담당 ${p.consultant_name}` : ''}${p.updated_at ? ` · 최근 업데이트 ${formatKDate(p.updated_at)}` : ''}`}>
      <NoIndex />
      <Link to="/my-projects" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← 내 프로젝트</Link>

      {/* 지금 확인할 내용 */}
      <div className={`mt-4 rounded-2xl border p-5 ${todoCount > 0 ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
        <p className={`text-base font-black ${todoCount > 0 ? 'text-amber-900' : 'text-emerald-800'}`}>
          {todoCount > 0 ? `지금 확인할 내용이 ${todoCount}건 있습니다` : '지금 확인할 내용이 없습니다'}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {todo.docs.length > 0 && `서류 ${todo.docs.length}개 요청됨 · `}
          {todo.actions.length > 0 && `해야 할 일 ${todo.actions.length}건 · `}
          {data.updates.length > 0 ? `진행 업데이트 ${data.updates.length}건` : '아직 업데이트가 없습니다'}
        </p>
      </div>

      {/* 탭 */}
      <div className="mt-6 mb-5 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? 'page' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
            {t.key === 'todo' && todoCount > 0 && <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-[11px] text-white">{todoCount}</span>}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-4">
        {tab === 'todo' && (
          <>
            {todoCount === 0 && <Empty text="지금 해야 할 일이 없습니다. 진행 상황은 '업데이트' 탭에서 확인하세요." />}
            {todo.actions.map((u) => (
              <Card key={u.id}>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600">{UPDATE_CATEGORY_LABEL[u.category] ?? u.category}</span>
                <p className="mt-2 text-base font-black text-slate-900">{u.action_label ?? u.title}</p>
                <p className="mt-1 text-sm text-slate-600">{u.title}{u.body ? ` — ${u.body}` : ''}</p>
                {u.due_date && <p className="mt-1 text-xs font-semibold text-amber-700">{u.due_date}까지</p>}
                <button
                  type="button"
                  onClick={() => void completeAction(u.id).then(() => { setToast('완료로 표시했습니다.'); void load() }).catch((e) => setToast(e instanceof Error ? e.message : '실패했습니다.'))}
                  className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                >
                  완료했어요
                </button>
              </Card>
            ))}
            {todo.docs.length > 0 && (
              <Card>
                <p className="text-base font-black text-slate-900">요청받은 서류</p>
                <ul className="mt-2 divide-y divide-slate-100">
                  {todo.docs.map((d) => <DocumentRow key={d.id} doc={d} linkId={p.link_id} onChanged={() => { setToast('서류를 올렸습니다. 담당자가 확인합니다.'); void load() }} />)}
                </ul>
              </Card>
            )}
          </>
        )}

        {tab === 'progress' && (
          <Card>
            <p className="text-base font-black text-slate-900">진행 상태</p>
            <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CUSTOMER_STAGE_ORDER.map((s, i) => (
                <li key={s} className={`rounded-xl border px-3 py-2.5 text-sm font-bold ${i < stageIdx ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : i === stageIdx ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-400'}`}>
                  <span className="mr-1 text-xs opacity-70">{i + 1}</span>{CUSTOMER_STAGE_LABEL[s]}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-slate-600">
              {p.consultant_name ? `담당 컨설턴트: ${p.consultant_name}` : '담당 컨설턴트가 배정되어 있습니다.'}
              {p.updated_at ? ` · 최근 업데이트 ${formatKDate(p.updated_at)}` : ''}
            </p>
            {data.updates[0] && (
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <span className="font-bold">최근 소식 · </span>{data.updates[0].title}
              </div>
            )}
          </Card>
        )}

        {tab === 'documents' && (
          data.documents.length === 0 ? <Empty text="요청받거나 공유된 서류가 없습니다." /> : (
            <Card>
              <ul className="divide-y divide-slate-100">
                {data.documents.map((d) => <DocumentRow key={d.id} doc={d} linkId={p.link_id} onChanged={() => { setToast('서류를 올렸습니다. 담당자가 확인합니다.'); void load() }} />)}
              </ul>
            </Card>
          )
        )}

        {tab === 'updates' && (
          data.updates.length === 0 ? <Empty text="아직 진행 업데이트가 없습니다. 담당자가 진행 상황을 공유하면 여기에 쌓입니다." /> : (
            <ol className="space-y-3">
              {data.updates.map((u) => (
                <li key={u.id}>
                  <Card>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-black text-slate-600">{UPDATE_CATEGORY_LABEL[u.category] ?? u.category}</span>
                      <span className="text-slate-400">{formatKDate(u.published_at)}</span>
                      {u.action_required && (
                        <span className={`rounded-full px-2 py-0.5 font-black ${u.completed_at ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{u.completed_at ? '완료함' : '해야 할 일'}</span>
                      )}
                    </div>
                    <p className="mt-2 text-base font-black text-slate-900">{u.title}</p>
                    {u.body && <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{u.body}</p>}
                  </Card>
                </li>
              ))}
            </ol>
          )
        )}

        {tab === 'requests' && (
          <>
            <RequestForm linkId={p.link_id} onCreated={() => { setToast('요청을 보냈습니다.'); void load() }} />
            {data.requests.length === 0 ? <Empty text="보낸 요청이 없습니다." /> : (
              <ol className="space-y-3">
                {data.requests.map((r) => (
                  <li key={r.id}>
                    <Card>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-black text-slate-600">{REQUEST_TYPE_LABEL[r.request_type]}</span>
                        <span className={`rounded-full px-2 py-0.5 font-black ${r.status === 'answered' || r.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{REQUEST_STATUS_LABEL[r.status] ?? r.status}</span>
                        <span className="text-slate-400">{formatKDate(r.created_at)}</span>
                      </div>
                      <p className="mt-2 text-base font-black text-slate-900">{r.title}</p>
                      {r.body && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{r.body}</p>}
                      {r.answer && (
                        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
                          <span className="font-bold">답변 · </span>{r.answer}
                        </div>
                      )}
                    </Card>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        {tab === 'results' && (() => {
          const shared = data.documents.filter((d) => d.visibility === 'shared_with_customer')
          const results = data.updates.filter((u) => u.category === 'result')
          if (shared.length === 0 && results.length === 0) return <Empty text="아직 공개된 결과자료가 없습니다. 담당자가 결과를 공유하면 여기에 나타납니다." />
          return (
            <>
              {results.map((u) => (
                <Card key={u.id}>
                  <p className="text-xs text-slate-400">{formatKDate(u.published_at)}</p>
                  <p className="mt-1 text-base font-black text-slate-900">{u.title}</p>
                  {u.body && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{u.body}</p>}
                </Card>
              ))}
              {shared.length > 0 && (
                <Card>
                  <p className="text-base font-black text-slate-900">공유된 자료</p>
                  <ul className="mt-2 divide-y divide-slate-100">
                    {shared.map((d) => <DocumentRow key={d.id} doc={d} linkId={p.link_id} onChanged={() => void load()} />)}
                  </ul>
                </Card>
              )}
            </>
          )
        })()}
      </div>

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </PageShell>
  )
}
