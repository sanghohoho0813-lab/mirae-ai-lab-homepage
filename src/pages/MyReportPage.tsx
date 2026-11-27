// /my-projects/reports/:reportId — My MIRAE 보고서 한 편.
//
// 담당자가 보낸 경과 보고 · 상담 요약 · 최종 보고를 읽는 곳. 보이는 값은 서버가 고객용으로 골라 준 것뿐이다(portal_report).
//   · 보고서 끝이 1초 넘게 화면에 보이면 '열어 봄' 으로 남긴다(담당자 화면에 보임). 미리보기 · 다른 계정은 남기지 않는다.
//   · [확인했어요] 는 '보셨다' 는 표시 — 계약 검수 · 대금 승인이 아니다.
//   · [이 보고서 문의] 는 기존 '내 요청' 과 같은 길(portal_create_request)로 담당자에게 간다.
//   · 고쳐진 예전 판은 '새 판 있음' 안내만, 내린 보고서는 제목만 — 본문은 보이지 않는다.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import NoIndex from '../components/NoIndex'
import { useAuth } from '../lib/auth'
import {
  REPORT_ACK_NOTE,
  REPORT_KIND_LABEL,
  acknowledgeReport,
  createRequest,
  findReport,
  formatKDate,
  isGrowthOff,
  isPortalNotReady,
  markReportSeen,
  type PortalReportDetail,
} from '../lib/customerPortal'
import { PortalNotReady } from './MyProjectsPage'

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; linkId: string; report: PortalReportDetail }
  | { kind: 'missing' }
  | { kind: 'off' }
  | { kind: 'error'; message: string }

const md = (d?: string | null) => (d && /^\d{4}-\d{2}-\d{2}/.test(d) ? `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : '')

/** 보고서 끝이 1초 넘게 보이면 한 번 부른다(창이 가려져 있으면 세지 않는다) */
function useSeenAtEnd(enabled: boolean, onSeen: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || done.current || typeof IntersectionObserver === 'undefined') return
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer)
        if (!entry?.isIntersecting) return
        timer = window.setTimeout(() => {
          if (done.current || document.visibilityState !== 'visible') return
          done.current = true
          io.disconnect()
          onSeen()
        }, 1000)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      window.clearTimeout(timer)
      io.disconnect()
    }
  }, [enabled, onSeen])
  return ref
}

export default function MyReportPage() {
  const { reportId = '' } = useParams()
  const [search] = useSearchParams()
  const location = useLocation()
  const { loading, configured, user, needsOnboarding } = useAuth()
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [receipt, setReceipt] = useState<{ seen_at: string | null; acknowledged_at: string | null }>({ seen_at: null, acknowledged_at: null })
  const [ackBusy, setAckBusy] = useState(false)
  const [ask, setAsk] = useState<{ open: boolean; text: string; busy: boolean; sent: boolean; error: string }>({ open: false, text: '', busy: false, sent: false, error: '' })
  const [toast, setToast] = useState('')
  const linkHint = search.get('link')

  const load = useCallback(async () => {
    try {
      const found = await findReport(reportId, linkHint)
      if (!found) {
        setState({ kind: 'missing' })
        return
      }
      setState({ kind: 'ready', ...found })
      if (found.report.status === 'published') setReceipt({ seen_at: found.report.seen_at, acknowledged_at: found.report.acknowledged_at })
    } catch (e) {
      if (isGrowthOff(e)) setState({ kind: 'off' })
      else if (isPortalNotReady(e)) setState({ kind: 'off' })
      else setState({ kind: 'error', message: '보고서를 불러오지 못했어요. 잠시 뒤 다시 열어 주세요.' })
    }
  }, [reportId, linkHint])

  useEffect(() => {
    if (!user || !configured) return
    void load()
  }, [user, configured, load])

  useEffect(() => {
    document.title = state.kind === 'ready' ? `${state.report.title} | 미래 AI 랩` : '보고서 | 미래 AI 랩'
  }, [state])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(id)
  }, [toast])

  const ready = state.kind === 'ready' && state.report.status === 'published' ? state : null
  const onSeen = useCallback(() => {
    if (!ready) return
    void markReportSeen(ready.linkId, ready.report.id)
      .then((r) => { if (r) setReceipt(r) })
      .catch(() => { /* 기록 실패는 화면을 막지 않는다 */ })
  }, [ready])
  const endRef = useSeenAtEnd(!!ready, onSeen)

  if (!configured) {
    return <PageShell title="보고서" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">서비스를 준비하고 있습니다.</p></PageShell>
  }
  if (loading) {
    return <PageShell title="보고서" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p></PageShell>
  }
  const here = `${location.pathname}${location.search}`
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(here)}`} replace />
  if (needsOnboarding) return <Navigate to={`/auth/onboarding?next=${encodeURIComponent(here)}`} replace />

  if (state.kind === 'loading') {
    return <PageShell title="보고서" compact><NoIndex /><p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p></PageShell>
  }
  if (state.kind === 'off') {
    return <PageShell title="보고서" compact><NoIndex /><PortalNotReady /></PageShell>
  }
  if (state.kind === 'missing') {
    return (
      <PageShell title="보고서를 볼 수 없어요" compact>
        <NoIndex />
        <div data-testid="report-page" data-state="missing">
          <p className="text-sm leading-relaxed text-slate-600">이 계정에 연결된 프로젝트의 보고서만 볼 수 있어요. 다른 이메일로 가입하셨다면 그 계정으로 로그인해 주세요.</p>
          <Link to="/my-projects" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">내 프로젝트로</Link>
        </div>
      </PageShell>
    )
  }
  if (state.kind === 'error') {
    return (
      <PageShell title="보고서" compact>
        <NoIndex />
        <p className="text-sm text-rose-700">{state.message}</p>
        <button type="button" onClick={() => void load()} className="mt-3 min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold">다시 시도</button>
      </PageShell>
    )
  }

  const { linkId, report } = state
  const back = (
    <Link to={`/my-projects/${linkId}?tab=reports`} className="text-sm font-semibold text-slate-500 hover:text-slate-900 print:hidden">← 프로젝트로</Link>
  )

  if (report.status !== 'published') {
    return (
      <PageShell title={report.title} compact>
        <NoIndex />
        <div className="max-w-3xl" data-testid="report-page" data-state={report.status}>
          {back}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
            {report.status === 'superseded' ? (
              <>
                <p className="text-base font-black text-slate-900">이 보고서는 고쳐진 새 판이 있어요</p>
                <p className="mt-1 text-sm text-slate-600">담당자가 내용을 바로잡아 다시 보냈어요. 새 판을 봐 주세요.</p>
                {report.latest_id && (
                  <Link to={`/my-projects/reports/${report.latest_id}?link=${linkId}`} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-bold text-white" data-testid="report-latest-link">
                    새 판 보기
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="text-base font-black text-slate-900">담당자가 이 보고서를 내렸어요</p>
                <p className="mt-1 text-sm text-slate-600">궁금한 점은 프로젝트 화면의 '내 요청' 으로 남겨 주세요.</p>
                <Link to={`/my-projects/${linkId}?tab=requests`} className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700">문의하기</Link>
              </>
            )}
          </div>
        </div>
      </PageShell>
    )
  }

  const period = report.period_start && report.period_end ? `${md(report.period_start)} ~ ${md(report.period_end)}` : ''
  const acked = !!receipt.acknowledged_at

  const acknowledge = async () => {
    if (ackBusy || acked) return
    setAckBusy(true)
    try {
      setReceipt(await acknowledgeReport(linkId, report.id))
      setToast('확인했다고 담당자에게 알렸어요.')
    } catch {
      setToast('지금은 표시하지 못했어요. 잠시 뒤 다시 눌러 주세요.')
    } finally {
      setAckBusy(false)
    }
  }

  const sendAsk = async () => {
    const body = ask.text.trim()
    if (!body) { setAsk((a) => ({ ...a, error: '궁금한 점을 한 줄이라도 적어 주세요.' })); return }
    setAsk((a) => ({ ...a, busy: true, error: '' }))
    try {
      await createRequest(linkId, 'status', `보고서 문의 · ${report.title}`.slice(0, 200), body)
      setAsk({ open: false, text: '', busy: false, sent: true, error: '' })
    } catch {
      setAsk((a) => ({ ...a, busy: false, error: '보내지 못했어요. 잠시 뒤 다시 눌러 주세요.' }))
    }
  }

  return (
    <PageShell title={report.title} subtitle={`${REPORT_KIND_LABEL[report.kind] ?? '보고서'}${period ? ` · ${period}` : ''}${report.consultant_name ? ` · 담당 ${report.consultant_name}` : ''}`}>
      <NoIndex />
      <div className="max-w-3xl" data-testid="report-page" data-state="published">
        {back}
        <article className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 print:border-0 print:shadow-none" data-testid="report-body">
          <p className="text-xs font-bold text-slate-500">
            {report.company_name ? `${report.company_name} · ` : ''}{formatKDate(report.published_at)} 보냄
            {report.corrected ? ` · 정정본(${report.version}판)` : ''}
          </p>
          {report.corrected && report.correction_note && (
            <p className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" data-testid="report-correction">고친 곳: {report.correction_note}</p>
          )}
          {report.summary && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800 [overflow-wrap:anywhere]">{report.summary}</p>}
          {report.sections.map((s) => (
            <section key={s.key + s.title} className="mt-5 border-t border-slate-100 pt-4">
              <h2 className="text-base font-black text-slate-900">{s.title}</h2>
              <ul className="mt-2 space-y-1.5">
                {s.items.map((i, n) => (
                  <li key={n} className="flex gap-2 text-[15px] leading-relaxed text-slate-800">
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{i.text}</span>
                    {i.date && <span className="shrink-0 text-sm text-slate-500 tabular-nums">{md(i.date)}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {report.staff_note && (
            <section className="mt-5 border-t border-slate-100 pt-4">
              <h2 className="text-base font-black text-slate-900">담당자 한마디</h2>
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800 [overflow-wrap:anywhere]">{report.staff_note}</p>
            </section>
          )}
          {/* 여기까지 보이면 '열어 봄' — 화면 끝 표시 */}
          <div ref={endRef} data-testid="report-end" className="mt-6 h-px" aria-hidden="true" />
        </article>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void acknowledge()}
              disabled={ackBusy || acked}
              className={`min-h-11 rounded-xl px-5 text-sm font-bold ${acked ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'} disabled:cursor-default`}
              data-testid="report-ack"
              data-acked={acked ? '1' : '0'}
            >
              {acked ? `확인함 · ${formatKDate(receipt.acknowledged_at)}` : ackBusy ? '표시하는 중…' : '확인했어요'}
            </button>
            <button type="button" onClick={() => setAsk((a) => ({ ...a, open: !a.open, sent: false }))} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50" data-testid="report-ask-open">
              이 보고서 문의
            </button>
            <button type="button" onClick={() => window.print()} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50" data-testid="report-print">
              인쇄 · PDF
            </button>
          </div>
          <p className="text-xs leading-relaxed text-slate-500" data-testid="report-ack-note">{REPORT_ACK_NOTE}</p>
          {ask.open && (
            <div className="flex flex-col gap-2">
              <textarea
                value={ask.text}
                onChange={(e) => setAsk((a) => ({ ...a, text: e.target.value }))}
                rows={3}
                maxLength={2000}
                placeholder="예: 다음 계획의 마감일을 조금 미룰 수 있을까요?"
                aria-label="보고서 문의 내용"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-[15px] focus:border-slate-900 focus:outline-none"
                data-testid="report-ask-text"
              />
              {ask.error && <p className="text-xs font-semibold text-rose-600">{ask.error}</p>}
              <button type="button" disabled={ask.busy} onClick={() => void sendAsk()} className="min-h-11 self-start rounded-xl bg-slate-900 px-5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50" data-testid="report-ask-send">
                {ask.busy ? '보내는 중…' : '담당자에게 보내기'}
              </button>
            </div>
          )}
          {ask.sent && (
            <p className="text-sm text-slate-700" data-testid="report-ask-done">
              보냈어요. 답은 <Link to={`/my-projects/${linkId}?tab=requests`} className="font-bold underline">프로젝트 › 내 요청</Link> 에서 볼 수 있어요.
            </p>
          )}
        </div>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-lg print:hidden">
          {toast}
        </div>
      )}
    </PageShell>
  )
}
