import { useCallback, useEffect, useState } from 'react'
import { createToolPass, fetchToolPasses, adminAccessAction, type DbTool, type ToolPass } from '../../lib/portal'
import { SITE_ORIGIN } from '../../lib/site'

// 관리자 — 초대 링크(게스트 패스) 발급·회수.
// 로그인 없이 특정 도구를 정해진 기간만 열 수 있는 링크를 만든다.
// 토큰 원문은 서버에 저장되지 않으므로(해시만) 발급 직후 한 번만 보여준다.

const errMsg = (e: unknown) => (e instanceof Error ? e.message : '요청에 실패했습니다.')
const btn = 'rounded border px-2 py-1 text-xs font-medium transition'
const field ='rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500'

const passUrl = (token: string) => `${SITE_ORIGIN}/pass/${token}`

function fmt(iso: string | null | undefined): string {
  if (!iso) return '–'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '–' : d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function passState(p: ToolPass): { label: string; tone: string } {
  if (p.revoked) return { label: '회수됨', tone: 'bg-rose-50 text-rose-700' }
  if (new Date(p.expires_at).getTime() <= Date.now()) return { label: '기간 종료', tone: 'bg-slate-100 text-slate-600' }
  if (p.max_uses != null && p.use_count >= p.max_uses) return { label: '횟수 소진', tone: 'bg-slate-100 text-slate-600' }
  if (p.single_device && p.claimed_by) return { label: '사용 중 (1인 고정)', tone: 'bg-blue-50 text-blue-700' }
  if (p.single_device) return { label: '대기 — 처음 여는 분에게 고정', tone: 'bg-amber-50 text-amber-800' }
  return { label: '사용 가능 (범용)', tone: 'bg-emerald-50 text-emerald-700' }
}

export default function ToolPassPanel({ tools }: { tools: DbTool[] }) {
  const [open, setOpen] = useState(false)
  const [passes, setPasses] = useState<ToolPass[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const [toolId, setToolId] = useState('')
  const [label, setLabel] = useState('')
  const [days, setDays] = useState(14)
  const [maxUses, setMaxUses] = useState('')
  // 기본은 1인 고정 — 링크가 이 사람 저 사람에게 퍼지는 걸 막는 쪽이 안전한 실수다
  const [singleDevice, setSingleDevice] = useState(true)
  const [issued, setIssued] = useState<{ url: string; expiresAt: string; singleDevice: boolean } | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      setPasses(await fetchToolPasses())
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  useEffect(() => {
    if (!toolId && tools.length > 0) setToolId(tools[0].id)
  }, [tools, toolId])

  const create = async () => {
    setErr('')
    setCopied(false)
    try {
      const r = await createToolPass({
        toolId,
        days,
        label: label.trim() || undefined,
        maxUses: maxUses.trim() ? Number(maxUses) : null,
        singleDevice,
      })
      // 서버가 알려준 실제 상태를 쓴다 — DB 에 1인 고정 컬럼이 없으면 범용으로 만들어진다
      setIssued({ url: passUrl(r.token), expiresAt: r.expiresAt, singleDevice: r.singleDevice })
      if (singleDevice && !r.singleDevice && r.message) setErr(r.message)
      setLabel('')
      setMaxUses('')
      await load()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  const revoke = async (passId: string) => {
    setErr('')
    try {
      await adminAccessAction({ action: 'revokePass', passId })
      await load()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  const release = async (passId: string) => {
    setErr('')
    try {
      await adminAccessAction({ action: 'releasePass', passId })
      await load()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  const copy = async () => {
    if (!issued) return
    try {
      await navigator.clipboard.writeText(issued.url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const toolTitle = (id: string) => tools.find((t) => t.id === id)?.title ?? '—'

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-slate-50"
      >
        <span>
          <span className="block text-sm font-black text-slate-900">🔗 초대 링크 (로그인 없이 열리는 임시 링크)</span>
          <span className="mt-0.5 block text-xs text-slate-500">
            정식 런칭 전, 특정인에게만 며칠간 도구를 열어줄 때 씁니다. 링크를 받은 사람은 가입·로그인 없이 바로 들어갑니다.
          </span>
        </span>
        <span aria-hidden className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-6 py-5">
          {err && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">{err}</div>}

          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">도구</span>
              <select value={toolId} onChange={(e) => setToolId(e.target.value)} className={field}>
                {tools.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">받는 분 메모</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="예) 김OO 컨설턴트"
                className={`${field} w-52`}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">기간(일)</span>
              <input
                type="number"
                min={1}
                max={90}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className={`${field} w-24`}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">사용 횟수 제한</span>
              <input
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="비우면 무제한"
                className={`${field} w-32`}
              />
            </label>
            <button
              type="button"
              onClick={() => void create()}
              disabled={!toolId}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-40"
            >
              초대 링크 만들기
            </button>
          </div>

          <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={singleDevice}
              onChange={(e) => setSingleDevice(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-slate-900"
            />
            <span className="text-sm text-slate-700">
              <b>한 사람만 사용 (처음 연 기기에 고정)</b>
              <span className="mt-0.5 block text-xs text-slate-500">
                링크를 처음 연 브라우저에 묶습니다. 그 뒤로 링크를 전달받은 다른 사람은 열 수 없습니다.
                끄면 링크를 가진 누구나 열 수 있는 범용 링크가 됩니다.
              </span>
            </span>
          </label>

          {issued && (
            <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3.5">
              <p className="text-sm font-bold text-emerald-900">
                링크가 만들어졌습니다 — {fmt(issued.expiresAt)}까지 사용할 수 있습니다.
              </p>
              <p className="mt-1 text-xs text-emerald-800">
                이 주소는 <b>지금 한 번만</b> 표시됩니다. 창을 닫으면 다시 볼 수 없으니 지금 복사해 두세요.
                {issued.singleDevice
                  ? ' 처음 이 링크를 연 분에게 고정되며, 그 뒤 다른 분은 열 수 없습니다.'
                  : ' 링크를 가진 누구나 열 수 있는 범용 링크입니다.'}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <input
                  readOnly
                  value={issued.url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="min-w-0 flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 font-mono text-xs text-slate-700"
                />
                <button type="button" onClick={() => void copy()} className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                  {copied ? '복사됨 ✓' : '복사'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 overflow-x-auto">
            {loading ? (
              <p className="py-4 text-sm text-slate-500">불러오는 중…</p>
            ) : passes.length === 0 ? (
              <p className="py-4 text-sm text-slate-400">아직 만든 초대 링크가 없습니다.</p>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">도구</th>
                    <th className="px-2 py-2">받는 분</th>
                    <th className="px-2 py-2">상태</th>
                    <th className="px-2 py-2">만료</th>
                    <th className="px-2 py-2">사용</th>
                    <th className="px-2 py-2">고정</th>
                    <th className="px-2 py-2">마지막 사용</th>
                    <th className="py-2 pl-2">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map((p) => {
                    const s = passState(p)
                    return (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="py-2.5 pr-3 font-medium text-slate-800">{toolTitle(p.tool_id)}</td>
                        <td className="px-2 py-2.5 text-slate-600">{p.label || '–'}</td>
                        <td className="px-2 py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.tone}`}>{s.label}</span>
                        </td>
                        <td className="px-2 py-2.5 text-slate-500">{fmt(p.expires_at)}</td>
                        <td className="px-2 py-2.5 text-slate-500">
                          {p.use_count}
                          {p.max_uses != null ? ` / ${p.max_uses}` : '회'}
                        </td>
                        <td className="px-2 py-2.5 text-slate-500">
                          {!p.single_device ? '범용' : p.claimed_at ? `${fmt(p.claimed_at)} 고정` : '대기'}
                        </td>
                        <td className="px-2 py-2.5 text-slate-500">{fmt(p.last_used_at)}</td>
                        <td className="py-2.5 pl-2">
                          {p.revoked ? (
                            <span className="text-xs text-slate-400">–</span>
                          ) : (
                            <span className="flex flex-wrap gap-1.5">
                              {p.single_device && p.claimed_by && (
                                <button
                                  onClick={() => void release(p.id)}
                                  title="고정된 분이 브라우저를 바꿨거나 데이터를 지웠을 때 누르세요"
                                  className={`${btn} border-slate-300 text-slate-700 hover:bg-slate-50`}
                                >
                                  고정 해제
                                </button>
                              )}
                              <button onClick={() => void revoke(p.id)} className={`${btn} border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100`}>
                                링크 회수
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            <b>한 사람만 사용</b>을 켜면 처음 연 브라우저에 묶여, 링크가 퍼져도 다른 사람은 열지 못합니다. 그 분이 브라우저를 바꾸거나 기록을 지우면 <b>고정 해제</b>를 눌러 다시 열어주세요.
            끄면 링크를 가진 누구나 열 수 있으니 기간을 짧게 두세요. 회수는 브라우저에 저장된 권한 때문에 최대 하루 뒤에 적용됩니다.
            계정이 있는 분께는 초대 링크 대신 아래 사용자 목록에서 <b>연장</b>으로 열어주는 편이 추적·회수에 더 좋습니다.
          </p>
        </div>
      )}
    </section>
  )
}
