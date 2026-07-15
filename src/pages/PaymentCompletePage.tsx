// 결제 완료 — /payment/complete
// PC 반환값 흐름과 모바일 redirect 흐름을 모두 처리합니다.
//  - URL 의 paymentId 로 서버 complete API 를 호출해 검증된 결과만 표시 (URL 금액·상품명 불신)
//  - code/message 쿼리가 있으면 실패·취소 상태로 표시
//  - 새로고침해도 중복 주문 없이 기존 결과를 다시 보여줍니다 (서버 멱등)
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import {
  completePayment, findLocalOrder, formatKrw, recheckPayment, submitIntake,
  trackPaymentEvent, updateLocalOrderStatus, type OrderSummary,
} from '../lib/payments'

type ViewState =
  | { kind: 'verifying' }
  | { kind: 'paid'; order: OrderSummary }
  | { kind: 'pending'; order: OrderSummary | null; reason?: string }
  | { kind: 'failed'; message: string; order?: OrderSummary | null }
  | { kind: 'cancelled'; message: string; order?: OrderSummary | null }
  | { kind: 'mismatch'; message: string }

function StatusIcon({ tone }: { tone: 'ok' | 'warn' | 'bad' | 'wait' }) {
  const bg = tone === 'ok' ? 'bg-emerald-100' : tone === 'warn' ? 'bg-amber-100' : tone === 'bad' ? 'bg-red-100' : 'bg-slate-100'
  const color = tone === 'ok' ? '#059669' : tone === 'warn' ? '#d97706' : tone === 'bad' ? '#dc2626' : '#64748b'
  return (
    <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${bg}`}>
      {tone === 'ok' ? (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
      ) : tone === 'wait' ? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" aria-hidden className="animate-spin"><path d="M21 12a9 9 0 1 1-6.2-8.56" /></svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M12 7v6M12 16.8v.2" /><circle cx="12" cy="12" r="9.2" /></svg>
      )}
    </div>
  )
}

function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <dl className="mt-5 space-y-2 rounded-2xl border border-slate-200 bg-white p-5 text-left text-sm">
      {[
        ['상품', order.optionName ? `${order.productName}` : order.productName],
        ...(order.optionName ? ([['옵션', order.optionName]] as [string, string][]) : []),
        ['결제금액', formatKrw(order.amount)],
        ...(order.cancelAmount > 0 ? ([['취소금액', formatKrw(order.cancelAmount)]] as [string, string][]) : []),
        ['주문번호', order.orderNumber],
        ['신청자', `${order.buyerCompanyName} · ${order.buyerName}`],
        ...(order.paidAt ? ([['결제일시', new Date(order.paidAt).toLocaleString('ko-KR')]] as [string, string][]) : []),
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3">
          <dt className="shrink-0 font-semibold text-slate-400">{k}</dt>
          <dd className="text-right font-bold text-slate-800">{v}</dd>
        </div>
      ))}
      {order.receiptUrl && (
        <div className="pt-1 text-right">
          <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 underline underline-offset-4 hover:text-blue-800">
            영수증 보기 →
          </a>
        </div>
      )}
    </dl>
  )
}

function IntakeForm({ order }: { order: OrderSummary }) {
  const local = findLocalOrder(order.paymentId)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(order.intakeStatus === 'received')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState({ concern: '', preferredMethod: '', preferredTime: '', materials: '', requests: '' })
  const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none'

  if (!local) return null
  if (done) {
    return (
      <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 ring-1 ring-inset ring-emerald-200">
        서비스 진행정보가 접수되었습니다. 담당자가 확인 후 연락드립니다.
      </div>
    )
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-blue-700">
        서비스 진행정보 작성하기
      </button>
    )
  }
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-left">
      <p className="text-sm font-black text-slate-900">서비스 진행정보</p>
      <p className="mt-1 text-xs text-slate-500">이미 입력하신 회사·연락처 정보는 다시 쓰실 필요 없어요.</p>
      <div className="mt-3 space-y-2.5">
        <textarea value={form.concern} onChange={(e) => setForm((f) => ({ ...f, concern: e.target.value }))} rows={3} placeholder="회사의 현재 고민 (예: 운전자금이 필요해요)" className={inputCls} />
        <select value={form.preferredMethod} onChange={(e) => setForm((f) => ({ ...f, preferredMethod: e.target.value }))} className={inputCls}>
          <option value="">희망 상담방식 선택</option>
          <option value="전화">전화</option>
          <option value="카카오톡">카카오톡</option>
          <option value="문자">문자</option>
          <option value="대면상담">대면상담</option>
        </select>
        <input type="text" value={form.preferredTime} onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))} placeholder="희망 연락시간 (예: 평일 오후 2~5시)" className={inputCls} />
        <input type="text" value={form.materials} onChange={(e) => setForm((f) => ({ ...f, materials: e.target.value }))} placeholder="보유자료 (예: 사업계획서, 재무제표)" className={inputCls} />
        <textarea value={form.requests} onChange={(e) => setForm((f) => ({ ...f, requests: e.target.value }))} rows={2} placeholder="기타 요청사항" className={inputCls} />
      </div>
      {err && <p className="mt-2 text-sm font-semibold text-red-600">{err}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          setErr(null)
          const r = await submitIntake({ paymentId: order.paymentId, accessToken: local.orderAccessToken, ...form })
          setBusy(false)
          if (r.ok) setDone(true)
          else setErr(r.message)
        }}
        className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
      >
        {busy ? '저장 중…' : '제출하기'}
      </button>
    </div>
  )
}

export default function PaymentCompletePage() {
  const [searchParams] = useSearchParams()
  const [view, setView] = useState<ViewState>({ kind: 'verifying' })
  const paymentId = searchParams.get('paymentId') ?? ''
  const errCode = searchParams.get('code')
  const errMessage = searchParams.get('message')

  const verify = useCallback(async (mode: 'complete' | 'recheck' = 'complete') => {
    if (!paymentId) {
      setView({ kind: 'failed', message: '결제 정보가 없습니다. 주문내역에서 다시 확인해주세요.' })
      return
    }
    setView({ kind: 'verifying' })
    trackPaymentEvent('payment_verification_started', paymentId)
    const r = mode === 'recheck' ? await recheckPayment(paymentId) : await completePayment(paymentId)
    if (!r.ok) {
      if (r.debugCode === 'amount_mismatch' || r.debugCode === 'store_mismatch') {
        setView({ kind: 'mismatch', message: r.message })
      } else if (r.debugCode === 'not_paid') {
        setView({ kind: 'pending', order: null })
      } else {
        setView({ kind: 'failed', message: r.message })
      }
      return
    }
    const order = r.order
    updateLocalOrderStatus(order.paymentId, order.status)
    if (order.status === 'paid' || order.status === 'partial_cancelled') setView({ kind: 'paid', order })
    else if (order.status === 'failed') setView({ kind: 'failed', message: order.failureMessage ?? '카드결제를 완료하지 못했습니다. 결제수단을 확인하거나 다시 시도해주세요.', order })
    else if (order.status === 'cancelled') setView({ kind: 'cancelled', message: '결제가 취소되었습니다. 카드 승인이 있었다면 취소 처리됩니다.', order })
    else if (order.status === 'amount_mismatch') setView({ kind: 'mismatch', message: '결제정보 확인이 필요합니다. 추가 결제를 시도하지 말고 고객센터로 문의해주세요.' })
    else setView({ kind: 'pending', order, reason: r.pendingReason })
  }, [paymentId])

  useEffect(() => {
    document.title = '결제 결과 | 미래 AI 랩'
    window.scrollTo(0, 0)
    trackPaymentEvent('payment_complete_viewed', paymentId || null)
    // 모바일 redirect 실패 파라미터 — 승인되지 않은 취소/실패
    if (errCode) {
      const cancelled = /cancel/i.test(errCode)
      trackPaymentEvent(cancelled ? 'payment_cancelled_by_user' : 'payment_client_failed', paymentId || null, { code: errCode })
      setView(cancelled
        ? { kind: 'cancelled', message: '결제창이 닫혔거나 결제가 취소되었습니다. 결제가 승인되지 않았습니다.' }
        : { kind: 'failed', message: errMessage || '카드결제를 완료하지 못했습니다. 결제수단을 확인하거나 다시 시도해주세요.' })
      return
    }
    void verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const local = paymentId ? findLocalOrder(paymentId) : null

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/business-services" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">결제 결과</span>
            </span>
          </Link>
          <HeaderAccount variant="business" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-5 pb-24 pt-10 text-center">
        {view.kind === 'verifying' && (
          <>
            <StatusIcon tone="wait" />
            <h1 className="mt-4 text-xl font-black">결제 결과를 확인하고 있습니다</h1>
            <p className="mt-2 text-sm text-slate-500">잠시만 기다려주세요. 이 화면을 닫아도 결제는 취소되지 않습니다.</p>
          </>
        )}

        {view.kind === 'paid' && (
          <>
            <StatusIcon tone="ok" />
            <h1 className="mt-4 text-2xl font-black">결제가 완료되었습니다</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">결제가 정상적으로 확인되었습니다.<br />담당자가 영업일 기준으로 신청내용을 확인해 안내드립니다.</p>
            {view.order.environment === 'test' && (
              <p className="mt-2"><span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700 ring-1 ring-inset ring-amber-300">테스트 결제</span></p>
            )}
            {view.order.status === 'partial_cancelled' && (
              <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">이 주문에는 부분취소 내역이 있습니다. 자세한 내용은 담당자가 안내드립니다.</p>
            )}
            <OrderCard order={view.order} />
            <IntakeForm order={view.order} />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Link to="/my-orders" className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 hover:bg-slate-50">내 주문 확인하기</Link>
              <Link to="/business-services" className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 hover:bg-slate-50">상품몰로 돌아가기</Link>
            </div>
          </>
        )}

        {view.kind === 'pending' && (
          <>
            <StatusIcon tone="wait" />
            <h1 className="mt-4 text-xl font-black">결제가 확인 중입니다</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              카드 승인은 완료됐을 수 있습니다. <b className="text-slate-900">중복 결제하지 말고</b> 결제상태를 다시 확인해주세요.
            </p>
            {view.order && <OrderCard order={view.order} />}
            <button
              type="button"
              onClick={() => { trackPaymentEvent('payment_status_rechecked', paymentId); void verify('recheck') }}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white hover:bg-blue-700"
            >
              결제 상태 다시 확인
            </button>
          </>
        )}

        {view.kind === 'cancelled' && (
          <>
            <StatusIcon tone="warn" />
            <h1 className="mt-4 text-xl font-black">결제가 완료되지 않았습니다</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{view.message}</p>
            {view.order && <OrderCard order={view.order} />}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {local && (
                <Link
                  to={`/checkout/${view.order?.productSlug ?? ''}`}
                  onClick={() => trackPaymentEvent('payment_retry_clicked', paymentId)}
                  className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-black text-slate-900"
                >
                  다시 결제하기
                </Link>
              )}
              <Link to="/business-services#apply" onClick={() => trackPaymentEvent('payment_consultation_clicked', paymentId)} className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 hover:bg-slate-50">
                상담 신청하기
              </Link>
            </div>
          </>
        )}

        {view.kind === 'failed' && (
          <>
            <StatusIcon tone="bad" />
            <h1 className="mt-4 text-xl font-black">결제를 완료하지 못했습니다</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{view.message}</p>
            {view.order && <OrderCard order={view.order} />}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                to={view.order ? `/checkout/${view.order.productSlug}` : '/business-services'}
                onClick={() => trackPaymentEvent('payment_retry_clicked', paymentId || null)}
                className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-black text-slate-900"
              >
                다시 결제하기
              </Link>
              <Link to="/business-services#apply" onClick={() => trackPaymentEvent('payment_consultation_clicked', paymentId || null)} className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 hover:bg-slate-50">
                상담 신청하기
              </Link>
            </div>
          </>
        )}

        {view.kind === 'mismatch' && (
          <>
            <StatusIcon tone="bad" />
            <h1 className="mt-4 text-xl font-black">결제정보 확인이 필요합니다</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              추가 결제를 시도하지 말고 고객센터로 문의해주세요. 담당자가 결제 내역을 확인해 처리해드립니다.
            </p>
            <Link to="/business-services#apply" className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white hover:bg-slate-700">
              고객센터 문의하기
            </Link>
          </>
        )}
      </main>
    </div>
  )
}
