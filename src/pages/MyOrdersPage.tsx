// 내 결제·신청내역 — /my-orders
// 비회원 결제도 같은 브라우저에서는 다시 확인할 수 있게 localStorage(miraePaymentOrders)의
// paymentId + orderAccessToken 으로 서버에서 최신 상태를 검증해 보여줍니다 (마스킹 반환).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicMenuDrawer from '../components/PublicMenuDrawer'
import LoginModal from '../components/LoginModal'
import { useAuth } from '../lib/auth'
import { formatKrw, getOrder, loadLocalOrders, updateLocalOrderStatus, type LocalOrder, type OrderSummary } from '../lib/payments'

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending: { label: '결제 대기', tone: 'bg-slate-100 text-slate-600' },
  payment_requested: { label: '결제 확인 중', tone: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200' },
  paid: { label: '결제 완료', tone: 'bg-emerald-100 text-emerald-800' },
  failed: { label: '결제 실패', tone: 'bg-red-100 text-red-700' },
  cancelled: { label: '취소됨', tone: 'bg-slate-200 text-slate-600' },
  partial_cancelled: { label: '부분취소', tone: 'bg-amber-100 text-amber-800' },
  amount_mismatch: { label: '확인 필요', tone: 'bg-orange-100 text-orange-800' },
  verification_failed: { label: '확인 필요', tone: 'bg-orange-100 text-orange-800' },
  exception: { label: '확인 필요', tone: 'bg-orange-100 text-orange-800' },
}

type Row = { local: LocalOrder; server: OrderSummary | null; error?: string }

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [rows, setRows] = useState<Row[] | null>(null)

  useEffect(() => {
    document.title = '내 결제·신청내역 | 미래 AI 랩'
    window.scrollTo(0, 0)
    if (!user) return // 로그인 후에만 내역 조회
    const locals = loadLocalOrders()
    if (locals.length === 0) {
      setRows([])
      return
    }
    void Promise.all(
      locals.map(async (local): Promise<Row> => {
        const r = await getOrder(local.paymentId, local.orderAccessToken)
        if (r.ok) {
          updateLocalOrderStatus(local.paymentId, r.order.status)
          return { local, server: r.order }
        }
        return { local, server: null, error: r.message }
      }),
    ).then(setRows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/business-services" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">내 결제·신청내역</span>
            </span>
          </Link>
          <PublicMenuDrawer variant="business" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[640px] px-5 pb-24 pt-8">
        <h1 className="text-2xl font-black tracking-tight">내 결제·신청내역</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">이 브라우저에서 결제한 주문을 보여드려요. 상태는 서버에서 다시 확인한 값입니다.</p>

        {rows === null && <p className="mt-8 text-center text-sm font-semibold text-slate-400">주문 상태를 확인하고 있어요…</p>}

        {rows !== null && rows.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-base font-bold text-slate-700">아직 결제한 주문이 없어요.</p>
            <Link to="/business-services" className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white hover:bg-blue-700">
              상품 둘러보기 →
            </Link>
          </div>
        )}

        {rows !== null && rows.length > 0 && (
          <ul className="mt-6 space-y-3">
            {rows.map(({ local, server, error }) => {
              const status = server?.status ?? local.status
              const st = STATUS_LABEL[status] ?? { label: status, tone: 'bg-slate-100 text-slate-600' }
              return (
                <li key={local.paymentId}>
                  <Link
                    to={`/payment/complete?paymentId=${encodeURIComponent(local.paymentId)}`}
                    className="block rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition-colors hover:border-blue-300"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-black ${st.tone}`}>{st.label}</span>
                      {server?.environment === 'test' && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-700">테스트</span>}
                      <span className="ml-auto text-xs font-semibold text-slate-400">{new Date(local.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <p className="mt-2 text-base font-black leading-snug">{server?.productName ?? local.productName}</p>
                    {(server?.optionName ?? local.optionName) && <p className="mt-0.5 text-sm text-slate-500">{server?.optionName ?? local.optionName}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-slate-400">주문번호 {server?.orderNumber ?? local.orderNumber}</span>
                      <span className="text-lg font-black tabular-nums">{formatKrw(server?.amount ?? local.amount)}</span>
                    </div>
                    {server?.serviceOrderStatus && (
                      <p className="mt-1.5 text-xs font-semibold text-slate-500">
                        서비스 진행: {server.intakeStatus === 'received' ? '진행정보 접수됨 · 담당자 확인 중' : '진행정보 작성 대기'}
                      </p>
                    )}
                    {error && <p className="mt-1.5 text-xs font-semibold text-slate-400">상태 확인 실패 — 눌러서 다시 확인해보세요.</p>}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      <LoginModal
        open={!authLoading && !user}
        onClose={() => { window.location.href = '/business-services' }}
        title="로그인이 필요해요"
        message="계약·결제 내역은 로그인 후 확인할 수 있습니다."
      />
    </div>
  )
}
