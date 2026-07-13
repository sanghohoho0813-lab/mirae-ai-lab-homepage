// 결제관리 — /admin/payments (관리자 전용).
// 목록은 전화·이메일 마스킹, 상세에서만 전체 표시. 환불 실행 버튼은 두지 않습니다
// (환불은 PortOne 콘솔에서 처리 → 웹훅으로 상태 자동 반영).
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { businessPackages } from '../data/businessPackages'

type AdminPaymentRow = {
  id: string
  payment_id: string
  merchant_order_id: string
  environment: string
  product_slug: string
  option_id: string | null
  product_name: string
  option_name: string | null
  amount: number
  currency: string
  status: string
  portone_status: string | null
  payment_method: string | null
  pg_provider: string | null
  transaction_id: string | null
  receipt_url: string | null
  buyer_company_name: string
  buyer_name: string
  buyer_phone_masked: string
  buyer_email_masked: string
  needs_review?: boolean
  paid_at: string | null
  cancelled_at: string | null
  cancel_amount: number
  created_at: string
  service_order: { order_number: string; status: string; intake_status: string } | null
}

type Summary = { environment: 'test' | 'live'; todayAmount: number; monthAmount: number; paidCount: number; needsReview: number; cancelledCount: number }

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending: { label: '결제 대기', tone: 'bg-slate-100 text-slate-600' },
  payment_requested: { label: '확인 중', tone: 'bg-blue-50 text-blue-700' },
  paid: { label: '결제 완료', tone: 'bg-emerald-100 text-emerald-800' },
  failed: { label: '실패', tone: 'bg-red-100 text-red-700' },
  cancelled: { label: '취소', tone: 'bg-slate-200 text-slate-600' },
  partial_cancelled: { label: '부분취소', tone: 'bg-amber-100 text-amber-800' },
  amount_mismatch: { label: '금액 불일치', tone: 'bg-orange-200 text-orange-900' },
  verification_failed: { label: '검증 실패', tone: 'bg-orange-200 text-orange-900' },
  exception: { label: '예외', tone: 'bg-orange-100 text-orange-800' },
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  payment_confirmed: '결제 확인', intake_waiting: '진행정보 대기', intake_received: '진행정보 접수',
  assigned: '담당자 배정', consultation_scheduled: '상담 예정', in_progress: '진행 중', completed: '완료', cancelled: '취소',
}

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

async function adminApi(body: Record<string, unknown>): Promise<any> {
  if (!supabase) throw new Error('Supabase 설정이 필요합니다.')
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('로그인이 필요합니다.')
  const res = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) throw new Error(json.message || `요청 실패 (HTTP ${res.status})`)
  return json
}

export default function AdminPaymentsPage() {
  const { user, isAdmin, loading } = useAuth()
  const [rows, setRows] = useState<AdminPaymentRow[] | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<{ payment: Record<string, unknown>; serviceOrder: Record<string, unknown> | null; events: Array<{ event_type: string; source: string; created_at: string }>; refundRequests?: Array<Record<string, unknown>> } | null>(null)
  const [policies, setPolicies] = useState<Array<Record<string, any>> | null>(null)
  const [policiesOpen, setPoliciesOpen] = useState(false)
  const [fStatus, setFStatus] = useState('')
  const [fSlug, setFSlug] = useState('')
  const [fEnv, setFEnv] = useState('')
  const [fFrom, setFFrom] = useState('')
  const [fTo, setFTo] = useState('')
  const [search, setSearch] = useState('')

  async function reload() {
    setError(null)
    try {
      const data = await adminApi({
        action: 'admin_list',
        status: fStatus || undefined,
        productSlug: fSlug || undefined,
        environment: fEnv || undefined,
        from: fFrom ? `${fFrom}T00:00:00+09:00` : undefined,
        to: fTo ? `${fTo}T23:59:59+09:00` : undefined,
      })
      setRows(data.payments)
      setSummary(data.summary)
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
      setRows([])
    }
  }

  useEffect(() => {
    document.title = '결제관리 | 미래 AI 랩 관리자'
    if (user && isAdmin) void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, fStatus, fSlug, fEnv, fFrom, fTo])

  const filtered = useMemo(() => {
    if (!rows) return []
    const s = search.trim().toLowerCase()
    if (!s) return rows
    return rows.filter((r) =>
      [r.buyer_company_name, r.buyer_name, r.merchant_order_id, r.payment_id, r.product_name, r.option_name ?? '']
        .join(' ').toLowerCase().includes(s),
    )
  }, [rows, search])

  if (loading) return <div className="grid min-h-dvh place-items-center text-sm font-semibold text-slate-400">확인 중…</div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← 관리자 홈</Link>
            <h1 className="text-lg font-black tracking-tight">결제관리</h1>
          </div>
          <Link to="/admin/business-leads" className="text-sm font-semibold text-slate-500 hover:text-slate-900">진단 리드 관리 →</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-6">
        {/* 요약 — 현재 서버 환경 주문만 집계 (test/live 미합산) */}
        {summary && (
          <p className="mb-2 text-xs font-bold text-slate-400">
            아래 통계는 <span className={summary.environment === 'live' ? 'text-emerald-600' : 'text-amber-600'}>{summary.environment === 'live' ? '실결제(live)' : '테스트(test)'}</span> 주문만 집계합니다. 전액취소·금액불일치 건은 매출에 포함되지 않습니다.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { label: '오늘 결제금액', value: summary ? won(summary.todayAmount) : '—' },
            { label: '이번 달 결제금액', value: summary ? won(summary.monthAmount) : '—' },
            { label: '결제 완료 건수', value: summary ? `${summary.paidCount}건` : '—' },
            { label: '결제 확인 필요', value: summary ? `${summary.needsReview}건` : '—', warn: (summary?.needsReview ?? 0) > 0 },
            { label: '취소·부분취소', value: summary ? `${summary.cancelledCount}건` : '—' },
          ].map((c) => (
            <div key={c.label} className={`rounded-2xl border bg-white p-4 ${c.warn ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}>
              <p className="text-xs font-black text-slate-400">{c.label}</p>
              <p className={`mt-1 text-xl font-black tabular-nums ${c.warn ? 'text-orange-700' : 'text-slate-900'}`}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* 환불 안내 */}
        <p className="mt-3 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-500">
          환불·취소는 PortOne 콘솔에서 처리하면 웹훅으로 상태가 자동 반영됩니다. (사이트 내 환불 버튼은 제공하지 않습니다)
        </p>

        {/* 상품 가격·환불정책 (읽기 전용) — 값 변경은 Supabase billing_prices/billing_product_policies 에서 */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              setPoliciesOpen((v) => !v)
              if (!policies) void adminApi({ action: 'admin_policies' }).then((d) => setPolicies(d.products)).catch((e) => setError(e.message))
            }}
            aria-expanded={policiesOpen}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <span>상품 가격·환불정책 (읽기 전용)</span>
            <span aria-hidden className={`text-slate-400 transition-transform ${policiesOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {policiesOpen && (
            <div className="mt-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 font-black uppercase tracking-wide text-slate-400">
                    {['상품', '유형', '현재 가격', '가격 버전', '시작 전 전액환불', '취소가능일수', '시작 후 처리', '부분환불', '해지 기본', '모듈추가 일할', '반올림', '가격변경 적용'].map((h) => (
                      <th key={h} className="px-3 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {policies === null && <tr><td colSpan={12} className="px-3 py-6 text-center font-semibold text-slate-400">불러오는 중…</td></tr>}
                  {policies !== null && policies.length === 0 && <tr><td colSpan={12} className="px-3 py-6 text-center font-semibold text-slate-400">billing_products 미시드 — SQL 실행 후 표시됩니다.</td></tr>}
                  {(policies ?? []).map((p) => (
                    <tr key={String(p.code)} className="border-b border-slate-50">
                      <td className="whitespace-nowrap px-3 py-2 font-bold text-slate-800">{p.name}{p.optionName ? ` — ${p.optionName}` : ''}</td>
                      <td className="px-3 py-2 text-slate-500">{p.paymentType === 'one_time' ? '일회성' : String(p.paymentType)}</td>
                      <td className="whitespace-nowrap px-3 py-2 font-black tabular-nums">{won(Number(p.currentPrice?.amount ?? p.legacyAmount ?? 0))}</td>
                      <td className="px-3 py-2 text-slate-500">{p.currentPrice ? `v${p.currentPrice.version}` : '(호환: amount)'}</td>
                      <td className="px-3 py-2">{p.policy ? (p.policy.fullRefundBeforeServiceStart ? '가능' : '검토') : '기본값'}</td>
                      <td className="px-3 py-2 text-slate-500">{p.policy?.cancellationWindowDays ?? '제한 없음'}</td>
                      <td className="px-3 py-2 text-slate-500">{p.policy?.refundAfterServiceStart ?? 'manual_review'}</td>
                      <td className="px-3 py-2">{p.policy ? (p.policy.partialRefundAllowed ? '허용' : '불가') : '허용'}</td>
                      <td className="px-3 py-2 text-slate-500">{p.policy?.subscriptionCancelDefault ?? 'period_end'}</td>
                      <td className="px-3 py-2">{p.policy ? (p.policy.moduleAddProrationEnabled ? '일할청구' : '없음') : '일할청구'}</td>
                      <td className="px-3 py-2 text-slate-500">{p.policy?.prorationRounding ?? 'floor'}</td>
                      <td className="px-3 py-2 text-slate-500">{p.policy?.priceChangeDefault ?? 'new_customers_only'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2.5 text-[11px] text-slate-400">가격 변경: billing_prices 에 새 버전 추가 (기존 결제·구독 금액은 자동 변경되지 않음) · 정책 변경: billing_product_policies</p>
            </div>
          )}
        </div>

        {/* 필터 */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold">
            <option value="">전체 상태</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={fSlug} onChange={(e) => setFSlug(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold">
            <option value="">전체 상품</option>
            {businessPackages.filter((p) => p.priceType !== 'consult').map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <select value={fEnv} onChange={(e) => setFEnv(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold">
            <option value="">테스트+실결제</option>
            <option value="live">실결제만</option>
            <option value="test">테스트만</option>
          </select>
          <input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
          <span className="text-slate-400">~</span>
          <input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
          <input
            type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="회사명·구매자·주문번호 검색"
            className="min-w-[220px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button type="button" onClick={() => void reload()} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">새로고침</button>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

        {/* 목록 */}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-wide text-slate-400">
                {['결제일/생성일', '주문번호', '회사·구매자', '상품', '금액', '결제상태', '서비스 진행', 'PortOne', '수단'].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows === null && (
                <tr><td colSpan={9} className="px-4 py-10 text-center font-semibold text-slate-400">불러오는 중…</td></tr>
              )}
              {rows !== null && filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center font-semibold text-slate-400">결제 내역이 없습니다.</td></tr>
              )}
              {filtered.map((r) => {
                const st = STATUS_LABEL[r.status] ?? { label: r.status, tone: 'bg-slate-100 text-slate-600' }
                return (
                  <tr
                    key={r.id}
                    onClick={() => { void adminApi({ action: 'admin_detail', paymentId: r.payment_id }).then((d) => setDetail({ payment: d.payment, serviceOrder: d.serviceOrder, events: d.events, refundRequests: d.refundRequests })).catch((e) => setError(e.message)) }}
                    className={`cursor-pointer border-b border-slate-50 transition-colors hover:bg-blue-50/40 ${r.needs_review || r.status === 'amount_mismatch' ? 'bg-orange-50/60' : ''}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{new Date(r.paid_at ?? r.created_at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold">{r.merchant_order_id}<br /><span className="text-[11px] font-medium text-slate-400">{r.payment_id.slice(0, 18)}…</span></td>
                    <td className="px-4 py-3"><b>{r.buyer_company_name}</b><br /><span className="text-slate-500">{r.buyer_name} · {r.buyer_phone_masked}</span></td>
                    <td className="px-4 py-3">{r.product_name}{r.option_name && <><br /><span className="text-slate-500">{r.option_name}</span></>}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-black tabular-nums">{won(r.amount)}{r.cancel_amount > 0 && <><br /><span className="text-xs font-bold text-amber-700">-{won(r.cancel_amount)}</span></>}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-[11px] font-black ${st.tone}`}>{st.label}</span>
                      {r.environment === 'test' && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-700">테스트</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{r.service_order ? (ORDER_STATUS_LABEL[r.service_order.status] ?? r.service_order.status) : '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{r.portone_status ?? '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{r.payment_method?.replace('PaymentMethod', '') ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* 상세 드로어 */}
      {detail && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="결제 상세">
          <button type="button" aria-label="닫기" onClick={() => setDetail(null)} className="absolute inset-0 h-full w-full cursor-default bg-slate-900/45" />
          <div className="absolute inset-y-0 right-0 w-full max-w-[560px] overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">결제 상세</h2>
              <button type="button" onClick={() => setDetail(null)} className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900" aria-label="닫기">✕</button>
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <section className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase text-slate-400">주문·구매자 (전체 표시)</p>
                <dl className="mt-2 space-y-1.5">
                  {[
                    ['주문번호', String(detail.payment.merchant_order_id ?? '')],
                    ['paymentId', String(detail.payment.payment_id ?? '')],
                    ['상품', `${detail.payment.product_name ?? ''}${detail.payment.option_name ? ` — ${detail.payment.option_name}` : ''}`],
                    ['금액', won(Number(detail.payment.amount ?? 0))],
                    ['회사명', String(detail.payment.buyer_company_name ?? '')],
                    ['구매자', String(detail.payment.buyer_name ?? '')],
                    ['연락처', String(detail.payment.buyer_phone ?? '')],
                    ['이메일', String(detail.payment.buyer_email ?? '')],
                    ['사업자번호', String(detail.payment.buyer_business_number ?? '') || '—'],
                    ['요청사항', String(detail.payment.buyer_memo ?? '') || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3"><dt className="shrink-0 text-slate-400">{k}</dt><dd className="break-all text-right font-semibold">{v}</dd></div>
                  ))}
                </dl>
              </section>
              <section className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase text-slate-400">결제·검증</p>
                <dl className="mt-2 space-y-1.5">
                  {[
                    ['내부 상태', String(detail.payment.status ?? '')],
                    ['PortOne 상태', String(detail.payment.portone_status ?? '—')],
                    ['transactionId', String(detail.payment.transaction_id ?? '—')],
                    ['결제수단 / PG', `${String(detail.payment.payment_method ?? '—')} / ${String(detail.payment.pg_provider ?? '—')}`],
                    ['환경', String(detail.payment.environment ?? '')],
                    ['결제일시', detail.payment.paid_at ? new Date(String(detail.payment.paid_at)).toLocaleString('ko-KR') : '—'],
                    ['취소일시', detail.payment.cancelled_at ? new Date(String(detail.payment.cancelled_at)).toLocaleString('ko-KR') : '—'],
                    ['취소금액', won(Number(detail.payment.cancel_amount ?? 0))],
                    ['확인 필요', detail.payment.needs_review ? '예 ⚠️' : '아니오'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3"><dt className="shrink-0 text-slate-400">{k}</dt><dd className="break-all text-right font-semibold">{String(v)}</dd></div>
                  ))}
                </dl>
                {typeof detail.payment.receipt_url === 'string' && detail.payment.receipt_url && (
                  <a href={detail.payment.receipt_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-bold text-blue-600 underline underline-offset-4">영수증 열기 →</a>
                )}
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">환불은 PortOne 콘솔에서 처리 후 상태가 자동 반영됩니다.</p>
              </section>
              <section className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase text-slate-400">서비스 주문</p>
                {detail.serviceOrder ? (
                  <dl className="mt-2 space-y-1.5">
                    {[
                      ['주문번호', String(detail.serviceOrder.order_number ?? '')],
                      ['진행상태', ORDER_STATUS_LABEL[String(detail.serviceOrder.status ?? '')] ?? String(detail.serviceOrder.status ?? '')],
                      ['진행정보', String(detail.serviceOrder.intake_status) === 'received' ? '접수됨' : '대기'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3"><dt className="text-slate-400">{k}</dt><dd className="font-semibold">{v}</dd></div>
                    ))}
                    {detail.serviceOrder.intake != null && (
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{JSON.stringify(detail.serviceOrder.intake, null, 2)}</pre>
                    )}
                  </dl>
                ) : (
                  <p className="mt-2 text-slate-400">아직 생성되지 않았습니다 (결제 완료 시 자동 생성).</p>
                )}
              </section>
              {detail.refundRequests && detail.refundRequests.length > 0 && (
                <section className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
                  <p className="text-xs font-black uppercase text-orange-600">환불 요청</p>
                  <ul className="mt-2 space-y-2">
                    {detail.refundRequests.map((r) => (
                      <li key={String(r.id)} className="rounded-xl bg-white p-3 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="font-black text-slate-800">{String(r.request_type)} · {String(r.status)}</span>
                          <span className="text-slate-400">{new Date(String(r.requested_at)).toLocaleString('ko-KR')}</span>
                        </div>
                        <p className="mt-1 text-slate-600">요청 {won(Number(r.requested_amount ?? 0))} / 계산 {won(Number(r.calculated_amount ?? 0))}{r.approved_amount != null ? ` / 승인 ${won(Number(r.approved_amount))}` : ''}</p>
                        {typeof r.reason === 'string' && r.reason && <p className="mt-1 text-slate-500">사유: {r.reason}</p>}
                        <p className="mt-1 text-[11px] text-slate-400">실제 환불 실행은 PortOne 콘솔에서 처리 후 웹훅으로 반영됩니다.</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase text-slate-400">이벤트 로그</p>
                <ul className="mt-2 space-y-1">
                  {detail.events.length === 0 && <li className="text-slate-400">기록 없음</li>}
                  {detail.events.map((ev, i) => (
                    <li key={i} className="flex justify-between gap-3 text-xs">
                      <span className="font-semibold text-slate-600">{ev.event_type} <span className="text-slate-300">({ev.source})</span></span>
                      <span className="shrink-0 text-slate-400">{new Date(ev.created_at).toLocaleString('ko-KR')}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
