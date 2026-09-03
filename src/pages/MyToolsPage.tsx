import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import {
  EXTENSION_DAYS,
  MAX_FREE_DAYS,
  REVIEW_MIN_CHARS,
  TRIAL_DAYS,
  evaluateAccess,
  formatDateTime,
  type ToolAccess,
} from '../lib/platform'
import {
  fetchMyAccess,
  fetchTrialTools,
  openTool as apiOpenTool,
  startTrial as apiStartTrial,
  submitReview as apiSubmitReview,
  submitSurvey as apiSubmitSurvey,
  type DbTool,
} from '../lib/portal'

const errMsg = (e: unknown) => (e instanceof Error ? e.message : '요청에 실패했습니다.')

function ReviewPanel({ onSubmit, busy }: { onSubmit: (content: string) => void; busy: boolean }) {
  const [content, setContent] = useState('')
  const count = content.trim().length
  const enough = count >= REVIEW_MIN_CHARS
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm leading-relaxed text-slate-600">
        <b>{REVIEW_MIN_CHARS}자 이상</b>의 솔직한 사용 후기를 남기면 7일 체험 기간을 연장할 수 있습니다.
        좋았던 점뿐 아니라 불편했던 점, 개선되면 좋을 점도 자유롭게 적어주세요. 실제 도구 개선에
        반영됩니다. (연장 1회 · 최대 {MAX_FREE_DAYS}일)
      </p>
      <textarea
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="어떤 점이 좋았는지, 무엇이 불편했는지 자유롭게 적어주세요."
        className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className={enough ? 'font-semibold text-emerald-600' : 'text-slate-400'}>
          {count} / {REVIEW_MIN_CHARS}자 {enough ? '· 연장 가능' : ''}
        </span>
        <button
          type="button"
          disabled={!enough || busy}
          onClick={() => onSubmit(content)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? '제출 중…' : `리뷰 제출 · ${EXTENSION_DAYS}일 연장`}
        </button>
      </div>
    </div>
  )
}

type SurveyQuestion =
  | { name: string; label: string; type: 'radio'; required?: boolean; options: string[] }
  | { name: string; label: string; type: 'text' }

const surveyQuestions: SurveyQuestion[] = [
  {
    name: 'used',
    label: '1. 어떤 도구를 사용하셨나요?',
    type: 'radio',
    required: true,
    options: ['고용지원금 프로', '연구소 사후관리 OS', '법인컨설팅 세일즈 OS', '크레탑 자동분석기', '창업감면 & 취등록세 체크'],
  },
  {
    name: 'helpful',
    label: '2. 가장 도움이 된 부분은 무엇인가요?',
    type: 'radio',
    options: ['검토 시간 단축', '고객 설명이 쉬워짐', '제안서/보고서 준비에 도움', '놓치던 항목 발견', '고객관리/후속관리 도움', '아직 잘 모르겠음'],
  },
  { name: 'reuse', label: '3. 실제 업무에 다시 사용할 의향이 있나요?', type: 'radio', options: ['매우 있음', '있음', '보통', '낮음', '없음'] },
  { name: 'price', label: '4. 유료로 이용한다면 적정하다고 느끼는 월 이용료는?', type: 'radio', options: ['1만원 미만', '1~3만원', '3~5만원', '5~10만원', '10만원 이상', '아직 판단 어려움'] },
  { name: 'improve', label: '5. 가장 개선이 필요한 부분은?', type: 'radio', options: ['기능 부족', '설명 부족', 'UI/UX', '속도', '정확도', '도구별 활용 방법', '기타'] },
  { name: 'recommend', label: '6. 다른 컨설턴트에게 추천할 의향이 있나요?', type: 'radio', options: ['매우 추천', '추천', '보통', '비추천', '매우 비추천'] },
  { name: 'want', label: '7. 추가로 원하는 기능이 있다면 적어주세요.', type: 'text' },
  { name: 'inconvenient', label: '8. 적용하면서 불편했던 점이 있다면 적어주세요.', type: 'text' },
]

function SurveyPanel({ onSubmit, busy }: { onSubmit: (a: Record<string, string>) => void; busy: boolean }) {
  function handle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const answers: Record<string, string> = {}
    for (const q of surveyQuestions) answers[q.label] = String(fd.get(q.name) ?? '')
    onSubmit(answers)
  }
  return (
    <form onSubmit={handle} className="mt-4 space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm leading-relaxed text-slate-600">
        짧은 설문(객관식 중심)에 참여하면 7일 체험 기간을 연장할 수 있습니다. 응답은 도구 개선과 정식 출시
        방향을 정하는 데 활용됩니다. (연장 1회 · 최대 {MAX_FREE_DAYS}일)
      </p>
      {surveyQuestions.map((q) => (
        <div key={q.name}>
          <p className="mb-2 text-sm font-semibold text-slate-800">{q.label}</p>
          {q.type === 'radio' ? (
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
                >
                  <input type="radio" name={q.name} value={opt} required={q.required} className="h-3.5 w-3.5 accent-blue-600" />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              name={q.name}
              rows={2}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
      >
        {busy ? '제출 중…' : `설문 제출 · ${EXTENSION_DAYS}일 연장`}
      </button>
    </form>
  )
}

export default function MyToolsPage() {
  const { user, profile, configured, loading } = useAuth()
  const [tools, setTools] = useState<DbTool[]>([])
  const [access, setAccess] = useState<ToolAccess[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [panel, setPanel] = useState<{ toolId: string; kind: 'review' | 'survey' } | null>(null)
  const [notice, setNotice] = useState<{ toolId: string; ok: boolean; message: string } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setDataLoading(true)
    try {
      const [t, a] = await Promise.all([fetchTrialTools(), fetchMyAccess(user.id)])
      setTools(t)
      setAccess(a)
    } catch (e) {
      setNotice({ toolId: '', ok: false, message: errMsg(e) })
    } finally {
      setDataLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (configured && user) void load()
    else setDataLoading(false)
  }, [configured, user, load])

  if (loading) {
    return (
      <PageShell title="내 도구함">
        <p className="text-slate-500">불러오는 중…</p>
      </PageShell>
    )
  }
  if (!configured) {
    return (
      <PageShell title="내 도구함" subtitle="Supabase 환경변수 설정 후 이용할 수 있습니다.">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          Supabase 환경변수가 설정되지 않았습니다. (README의 Supabase 설정을 참고하세요.)
        </div>
      </PageShell>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  // 도구 열기 — 주소를 미리 갖고 있지 않고, 누를 때 서버에 권한을 물어 받아온다.
  // 팝업 차단을 피하려고 클릭 시점에 빈 탭을 먼저 열고 주소를 채운다.
  async function openToolTab(toolId: string) {
    const tab = window.open('about:blank', '_blank')
    setBusyId(toolId)
    try {
      const url = await apiOpenTool(toolId)
      if (tab) {
        tab.opener = null
        tab.location.replace(url)
      } else {
        window.location.assign(url)
      }
    } catch (e) {
      tab?.close()
      setNotice({ toolId, ok: false, message: errMsg(e) })
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function run(toolId: string, fn: () => Promise<{ message?: string }>) {
    setBusyId(toolId)
    try {
      const r = await fn()
      setNotice({ toolId, ok: true, message: r.message ?? '처리되었습니다.' })
      setPanel(null)
    } catch (e) {
      setNotice({ toolId, ok: false, message: errMsg(e) })
    } finally {
      setBusyId(null)
      await load()
    }
  }

  return (
    <PageShell title="내 도구함" subtitle={`${profile?.name ?? user.email}님이 체험 중인 도구와 남은 기간을 확인하세요.`}>
      <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-4">
        {[
          ['기본 체험', `${TRIAL_DAYS}일`],
          ['리뷰 작성 시', `+${EXTENSION_DAYS}일`],
          ['설문 참여 시', `+${EXTENSION_DAYS}일`],
          ['최대 무료 체험', `${MAX_FREE_DAYS}일`],
        ].map(([label, value]) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <p className="mb-8 text-center text-sm leading-relaxed text-slate-500">
        각 도구는 신청한 시각부터 정확히 {TRIAL_DAYS}일간 체험할 수 있습니다. 리뷰와 설문에 참여하면 최대{' '}
        {MAX_FREE_DAYS}일까지 무료 체험을 연장할 수 있습니다.
      </p>

      {dataLoading ? (
        <p className="text-slate-500">도구를 불러오는 중…</p>
      ) : (
        <div className="space-y-5">
          {tools.map((tool) => {
            const rec = access.find((a) => a.tool_id === tool.id)
            const view = evaluateAccess(rec)
            const isOpen = panel?.toolId === tool.id
            const localNotice = notice?.toolId === tool.id ? notice : null
            const busy = busyId === tool.id
            return (
              <article key={tool.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {tool.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          view.active
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                            : view.status === 'trial_expired'
                              ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                              : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-400/30'
                        }`}
                      >
                        {view.statusLabel}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{tool.title}</h3>
                    <div className="mt-1.5 space-y-1 text-sm text-slate-500">
                      {view.unlimited ? (
                        <p>무제한 이용 권한이 부여되었습니다.</p>
                      ) : view.status === 'none' ? (
                        <p>
                          아직 체험을 시작하지 않았습니다. 시작하면 지금 시각부터 정확히 {TRIAL_DAYS}일 동안
                          사용할 수 있습니다.
                        </p>
                      ) : view.blocked ? (
                        <p>관리자에 의해 접근이 제한되었습니다.</p>
                      ) : (
                        <>
                          <p>
                            만료 {formatDateTime(view.expiresAt)} · 남은 기간{' '}
                            <b className="text-slate-700">{view.remainingLabel}</b>
                          </p>
                          <p>
                            {view.paid
                              ? '정식 이용 중입니다. 만료 전까지 도구를 열어 사용하세요.'
                              : view.active
                                ? '현재 체험 중입니다. 만료 전까지 도구를 열어 실제 업무 흐름을 확인해보세요.'
                                : '체험 기간이 종료되었습니다. 리뷰, 설문, 결제 또는 관리자 승인을 통해 이용 기간을 연장할 수 있습니다.'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {view.status === 'none' ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => run(tool.id, () => apiStartTrial(tool.id))}
                        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busy ? '처리 중…' : '7일 체험 시작'}
                      </button>
                    ) : view.active ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openToolTab(tool.id)}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busy ? '확인 중…' : '도구 열기 ↗'}
                      </button>
                    ) : (
                      <span className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                        {view.status === 'revoked' ? '권한 회수됨' : '체험 종료 · 연장/결제 필요'}
                      </span>
                    )}
                  </div>
                </div>

                {view.status !== 'none' && !view.unlimited && view.status !== 'paid_active' && (
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                    <span className="text-sm text-slate-500">무료 연장:</span>
                    <button
                      type="button"
                      disabled={!view.canExtendReview}
                      onClick={() => setPanel(isOpen && panel?.kind === 'review' ? null : { toolId: tool.id, kind: 'review' })}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      리뷰 작성 (+{EXTENSION_DAYS}일){!view.canExtendReview ? ' · 사용됨' : ''}
                    </button>
                    <button
                      type="button"
                      disabled={!view.canExtendSurvey}
                      onClick={() => setPanel(isOpen && panel?.kind === 'survey' ? null : { toolId: tool.id, kind: 'survey' })}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      설문 참여 (+{EXTENSION_DAYS}일){!view.canExtendSurvey ? ' · 사용됨' : ''}
                    </button>
                    <span className="ml-auto text-xs text-slate-400">정식 이용은 결제 또는 관리자 승인 예정</span>
                  </div>
                )}

                {localNotice && (
                  <p className={`mt-3 rounded-lg px-4 py-2.5 text-sm font-medium ${localNotice.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {localNotice.message}
                  </p>
                )}

                {isOpen && panel?.kind === 'review' && (
                  <ReviewPanel busy={busy} onSubmit={(c) => run(tool.id, () => apiSubmitReview(tool.id, c))} />
                )}
                {isOpen && panel?.kind === 'survey' && (
                  <SurveyPanel busy={busy} onSubmit={(a) => run(tool.id, () => apiSubmitSurvey(tool.id, a))} />
                )}
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-base font-semibold text-slate-700">정식 이용(결제)은 준비 중입니다.</p>
        <p className="mt-1 text-sm text-slate-500">
          최대 {MAX_FREE_DAYS}일 무료 체험 이후에는 결제 또는 관리자 승인을 통해 계속 이용할 수 있도록 제공될
          예정입니다. 도구 주소는 이용 권한이 확인된 경우에만 전달되며, 각 도구 앱 자체의 권한 검증은 순차적으로
          연동하고 있습니다.
        </p>
      </div>
    </PageShell>
  )
}
