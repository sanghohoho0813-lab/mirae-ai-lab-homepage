import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useAuth } from '../lib/auth'
import {
  adminExpiryUser,
  adminExtendUser,
  adminGrantTrial,
  adminRevokeUser,
  adminUnlimitedUser,
  evaluateAccess,
  formatDate,
  getAccessRecord,
  getReviews,
  getSurveys,
  getTrialModules,
  getUsers,
  type Profile,
  type TrialModule,
} from '../lib/platform'

function ModuleRow({ user, module, onChange }: { user: Profile; module: TrialModule; onChange: () => void }) {
  const [date, setDate] = useState('')
  const rec = getAccessRecord(user.id, module.id)
  const view = evaluateAccess(rec)

  const run = (fn: () => void) => {
    fn()
    onChange()
  }

  return (
    <tr className="border-t border-slate-100 align-top">
      <td className="py-3 pr-3 font-medium text-slate-800">{module.title}</td>
      <td className="px-3 py-3">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
          {view.statusLabel}
        </span>
      </td>
      <td className="px-3 py-3 text-slate-500">{formatDate(rec?.trial_started_at ?? null)}</td>
      <td className="px-3 py-3 text-slate-500">
        {view.unlimited ? '무제한' : formatDate(view.expiresAt)}
      </td>
      <td className="px-3 py-3 text-slate-500">
        {view.unlimited ? '∞' : view.remainingDays > 0 ? `${view.remainingDays}일` : '-'}
      </td>
      <td className="px-3 py-3 text-xs text-slate-400">
        리뷰 {rec?.review_extension_used ? '✓' : '–'} / 설문 {rec?.survey_extension_used ? '✓' : '–'}
      </td>
      <td className="py-3 pl-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {!rec?.trial_started_at && !view.unlimited && (
            <button onClick={() => run(() => adminGrantTrial(user.id, module.id))} className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
              체험 시작
            </button>
          )}
          <button onClick={() => run(() => adminExtendUser(user.id, module.id, 7))} className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
            +7일
          </button>
          <button onClick={() => run(() => adminUnlimitedUser(user.id, module.id))} className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
            무제한
          </button>
          <button onClick={() => run(() => adminRevokeUser(user.id, module.id))} className="rounded border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100">
            회수
          </button>
          <span className="inline-flex items-center gap-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded border border-slate-300 px-1.5 py-1 text-xs"
            />
            <button
              disabled={!date}
              onClick={() => run(() => adminExpiryUser(user.id, module.id, date))}
              className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              적용
            </button>
          </span>
        </div>
      </td>
    </tr>
  )
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const [, setTick] = useState(0)
  const refresh = () => setTick((t) => t + 1)

  if (!user) return <Navigate to="/login" replace />

  if (!isAdmin) {
    return (
      <PageShell title="관리자" subtitle="이 페이지는 관리자만 접근할 수 있습니다.">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          현재 계정에는 관리자 권한이 없습니다. 관리자 계정으로 로그인해 주세요.{' '}
          <Link to="/login" className="font-semibold underline">
            로그인
          </Link>
        </div>
      </PageShell>
    )
  }

  const users = getUsers()
  const modules = getTrialModules()
  const reviews = getReviews()
  const surveys = getSurveys()

  return (
    <PageShell title="관리자" subtitle="사용자별 도구 이용 기간과 권한을 직접 조정할 수 있습니다.">
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          ['가입 사용자', users.length],
          ['제출 리뷰', reviews.length],
          ['제출 설문', surveys.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
          아직 가입한 사용자가 없습니다. 로그인/회원가입으로 사용자를 만든 뒤 다시 확인하세요.
        </div>
      ) : (
        <div className="space-y-6">
          {users.map((u) => (
            <section key={u.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-6 py-4">
                <div>
                  <p className="font-bold text-slate-900">
                    {u.name}{' '}
                    <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {u.role}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500">
                    {u.email} {u.phone ? `· ${u.phone}` : ''} {u.organization ? `· ${u.organization}` : ''}
                  </p>
                </div>
                <p className="text-xs text-slate-400">가입 {formatDate(u.created_at)}</p>
              </div>
              <div className="overflow-x-auto px-6 py-2">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3">모듈</th>
                      <th className="px-3 py-2">상태</th>
                      <th className="px-3 py-2">시작일</th>
                      <th className="px-3 py-2">만료일</th>
                      <th className="px-3 py-2">남은</th>
                      <th className="px-3 py-2">연장</th>
                      <th className="py-2 pl-3">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((m) => (
                      <ModuleRow key={m.id} user={u} module={m} onChange={refresh} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-slate-400">
        결제 상태 연동은 준비 중입니다. 향후 Toss Payments / Stripe / 수동 입금 승인과 권한 상태를 연결할
        예정입니다.
      </p>
    </PageShell>
  )
}
