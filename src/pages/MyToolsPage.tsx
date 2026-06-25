import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import { tools } from '../data/tools'
import {
  EXTENSION_DAYS,
  MAX_FREE_DAYS,
  REVIEW_MIN_CHARS,
  TRIAL_DAYS,
  evaluateAccess,
  formatDate,
  getAccessRecord,
  startTrial,
  submitReview,
  submitSurvey,
} from '../lib/platform'

function ReviewPanel({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState('')
  const count = content.trim().length
  const enough = count >= REVIEW_MIN_CHARS
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm leading-relaxed text-slate-600">
        솔직한 사용 후기와 개선 피드백을 <b>{REVIEW_MIN_CHARS}자 이상</b> 남겨주시면 체험이 {EXTENSION_DAYS}일
        연장됩니다. (좋은 평가를 강요하지 않습니다. 정직한 후기를 환영합니다.)
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
          disabled={!enough}
          onClick={() => onSubmit(content)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          리뷰 제출 · {EXTENSION_DAYS}일 연장
        </button>
      </div>
    </div>
  )
}

const surveyQuestions: { name: string; label: string; type: 'text' | 'select'; options?: string[] }[] = [
  { name: 'used', label: '어떤 도구를 사용하셨나요?', type: 'text' },
  { name: 'helpful', label: '가장 도움이 된 기능은?', type: 'text' },
  { name: 'inconvenient', label: '불편했던 점은?', type: 'text' },
  { name: 'price', label: '유료로 쓴다면 적정 가격은?', type: 'text' },
  { name: 'want', label: '추가로 원하는 기능은?', type: 'text' },
  { name: 'recommend', label: '추천 의향', type: 'select', options: ['매우 있음', '있음', '보통', '낮음'] },
]

function SurveyPanel({ onSubmit }: { onSubmit: (answers: Record<string, string>) => void }) {
  function handle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const answers: Record<string, string> = {}
    for (const q of surveyQuestions) answers[q.label] = String(fd.get(q.name) ?? '')
    onSubmit(answers)
  }
  return (
    <form onSubmit={handle} className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm leading-relaxed text-slate-600">
        간단한 설문에 참여하시면 체험이 {EXTENSION_DAYS}일 연장됩니다.
      </p>
      {surveyQuestions.map((q) => (
        <div key={q.name}>
          <label className="mb-1 block text-sm font-medium text-slate-700">{q.label}</label>
          {q.type === 'select' ? (
            <select
              name={q.name}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {q.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={q.name}
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        설문 제출 · {EXTENSION_DAYS}일 연장
      </button>
    </form>
  )
}

export default function MyToolsPage() {
  const { user } = useAuth()
  const [, setTick] = useState(0)
  const [panel, setPanel] = useState<{ toolId: string; kind: 'review' | 'survey' } | null>(null)
  const [notice, setNotice] = useState<{ toolId: string; ok: boolean; message: string } | null>(null)

  if (!user) return <Navigate to="/login" replace />

  const refresh = () => setTick((t) => t + 1)
  const modules = tools.filter((t) => t.isTrialAvailable)

  function start(toolId: string) {
    startTrial(user!.id, toolId)
    refresh()
  }
  function review(toolId: string, content: string) {
    const r = submitReview(user!.id, toolId, content)
    setNotice({ toolId, ...r })
    if (r.ok) setPanel(null)
    refresh()
  }
  function survey(toolId: string, answers: Record<string, string>) {
    const r = submitSurvey(user!.id, toolId, answers)
    setNotice({ toolId, ...r })
    if (r.ok) setPanel(null)
    refresh()
  }

  return (
    <PageShell title="내 도구함" subtitle={`${user.name}님이 체험 중인 도구와 남은 기간을 확인하세요.`}>
      {/* 정책 안내 */}
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

      <div className="space-y-5">
        {modules.map((tool) => {
          const view = evaluateAccess(getAccessRecord(user.id, tool.id))
          const isOpen = panel?.toolId === tool.id
          const localNotice = notice?.toolId === tool.id ? notice : null
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
                  <p className="mt-1 text-sm text-slate-500">
                    {view.unlimited
                      ? '무제한 이용 권한이 부여되었습니다.'
                      : view.status === 'none'
                        ? `아직 체험을 시작하지 않았습니다. 시작하면 ${TRIAL_DAYS}일간 이용할 수 있습니다.`
                        : `만료일 ${formatDate(view.expiresAt)} · 남은 기간 ${
                            view.remainingDays === Infinity ? '무제한' : `${view.remainingDays}일`
                          }`}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  {view.status === 'none' ? (
                    <button
                      type="button"
                      onClick={() => start(tool.id)}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                      7일 체험 시작
                    </button>
                  ) : view.active && tool.isPublic ? (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      도구 열기 ↗
                    </a>
                  ) : (
                    <span className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                      {view.status === 'revoked' ? '권한 회수됨' : '체험 만료'}
                    </span>
                  )}
                </div>
              </div>

              {/* 연장 액션 */}
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
                <p
                  className={`mt-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
                    localNotice.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {localNotice.message}
                </p>
              )}

              {isOpen && panel?.kind === 'review' && <ReviewPanel onSubmit={(c) => review(tool.id, c)} />}
              {isOpen && panel?.kind === 'survey' && <SurveyPanel onSubmit={(a) => survey(tool.id, a)} />}
            </article>
          )
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-base font-semibold text-slate-700">정식 이용(결제)은 준비 중입니다.</p>
        <p className="mt-1 text-sm text-slate-500">
          최대 {MAX_FREE_DAYS}일 무료 체험 이후에는 결제 또는 관리자 승인을 통해 계속 이용할 수 있도록 제공될
          예정입니다.
        </p>
      </div>
    </PageShell>
  )
}
