// 체크아웃 — /checkout/:productSlug?option=...
// 주문 상품 확인 → 신청자 정보 → 필수 동의 3종 → PortOne 카드결제.
// 금액·주문명·paymentId 는 전부 서버 prepare 응답을 사용합니다 (브라우저 계산 금지).
// 결제창 결과가 돌아와도 완료 표시하지 않고 /payment/complete 에서 서버 재검증합니다.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PublicMenuDrawer from '../components/PublicMenuDrawer'
import { getPackageBySlug } from '../data/businessPackages'
import { checkoutTerms } from '../config/checkoutTerms'
import { useAuth } from '../lib/auth'
import {
  formatKrw, getPaymentHealth, getTestAccessCode, newRequestId, openPortOnePayment, paymentConfigured,
  preparePayment, rememberTestAccessCode, saveLocalOrder, trackPaymentEvent, type BuyerInput,
} from '../lib/payments'

const ISO_STANDARDS = ['ISO9001', 'ISO14001', 'ISO45001'] as const

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

export default function CheckoutPage() {
  const { productSlug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const pkg = getPackageBySlug(productSlug)

  const variants = pkg?.variants
  const initialOption = searchParams.get('option')
  const [optionId, setOptionId] = useState<string | null>(() => {
    if (!variants || variants.length === 0) return null
    const found = variants.find((v) => v.optionId === initialOption)
    return (found ?? variants[0]).optionId
  })
  const [isoPicks, setIsoPicks] = useState<string[]>([])
  const [buyer, setBuyer] = useState<BuyerInput>({ buyerCompanyName: '', buyerName: '', buyerPhone: '', buyerEmail: '', buyerBusinessNumber: '', buyerMemo: '' })
  const [consents, setConsents] = useState({ privacy: false, terms: false, refund: false })
  const [honeypot, setHoneypot] = useState('')
  const [phase, setPhase] = useState<'form' | 'preparing' | 'window'>('form')
  const [error, setError] = useState<string | null>(null)
  const [environment, setEnvironment] = useState<'test' | 'live'>('test')
  const [testGateActive, setTestGateActive] = useState(false)
  // requestId — 체크아웃 진입마다 1개 (중복 클릭·재시도 시 같은 pending 주문 재사용)
  const requestIdRef = useRef(newRequestId())
  const busyRef = useRef(false)
  const { isAdmin } = useAuth()

  const configured = paymentConfigured()
  const consult = pkg?.priceType === 'consult'
  // 테스트 결제 게이트 — 서버(prepare)가 최종 검증. 여기서는 안내 표시용.
  const gateBlocked = testGateActive && !getTestAccessCode() && !isAdmin

  const selected = useMemo(() => variants?.find((v) => v.optionId === optionId) ?? null, [variants, optionId])
  const amount = selected ? selected.amount : (pkg?.amount ?? 0)
  const isIso = pkg?.slug === 'iso-certification'
  const isoRequired = isIso ? (optionId === 'iso-one' ? 1 : optionId === 'iso-two' ? 2 : 3) : 0

  useEffect(() => {
    if (pkg) document.title = `결제하기 — ${pkg.name} | 미래 AI 랩`
    window.scrollTo(0, 0)
    // 테스트 접근코드 — URL 로 전달되면 세션 저장(탭 한정) 후 주소창에서 제거 (공유 방지)
    const ta = searchParams.get('testAccess')
    if (ta) {
      rememberTestAccessCode(ta)
      const url = new URL(window.location.href)
      url.searchParams.delete('testAccess')
      window.history.replaceState(null, '', url.pathname + url.search)
    }
    trackPaymentEvent('checkout_viewed', null, { productSlug: pkg?.slug })
    void getPaymentHealth().then((h) => {
      if (h) {
        setEnvironment(h.environment)
        setTestGateActive(h.testGateActive)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 3종은 3개 자동 선택
    if (isIso && optionId === 'iso-three') setIsoPicks([...ISO_STANDARDS])
    else if (isIso) setIsoPicks((prev) => prev.slice(0, isoRequired))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionId])

  if (!pkg) return <Navigate to="/business-services" replace />
  if (consult) return <Navigate to={`/business-services/${pkg.slug}`} replace />

  function toggleIso(std: string) {
    setIsoPicks((prev) => {
      if (prev.includes(std)) return prev.filter((s) => s !== std)
      if (optionId === 'iso-three') return prev
      if (prev.length >= isoRequired) return optionId === 'iso-one' ? [std] : prev
      return [...prev, std]
    })
  }

  async function handlePay() {
    if (busyRef.current) return
    setError(null)
    // 검증
    if (!buyer.buyerCompanyName.trim()) return setError('회사명을 입력해주세요.')
    if (buyer.buyerName.trim().length < 2) return setError('대표자명(신청자명)을 입력해주세요.')
    if (buyer.buyerPhone.replace(/\D/g, '').length < 9) return setError('휴대전화번호를 정확히 입력해주세요.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyer.buyerEmail)) return setError('이메일 주소를 확인해주세요.')
    if (isIso && isoPicks.length !== isoRequired) return setError(`ISO 규격을 ${isoRequired}개 선택해주세요.`)
    if (!consents.privacy || !consents.terms || !consents.refund) return setError('필수 동의 항목을 모두 확인해주세요.')

    busyRef.current = true
    setPhase('preparing')
    trackPaymentEvent('checkout_prepare_started', null, { productSlug: pkg!.slug, optionId })

    const prepared = await preparePayment({
      productSlug: pkg!.slug,
      optionId,
      requestId: requestIdRef.current,
      buyer: { ...buyer, buyerCompanyName: buyer.buyerCompanyName.trim(), buyerName: buyer.buyerName.trim() },
      isoStandards: isIso ? isoPicks : undefined,
      diagnosisSessionId: searchParams.get('diagnosisSession') || undefined,
      consentVersions: {
        privacyVersion: checkoutTerms.privacyVersion,
        purchaseTermsVersion: checkoutTerms.purchaseTermsVersion,
        refundPolicyVersion: checkoutTerms.refundPolicyVersion,
      },
      honeypot,
    })
    if (!prepared.ok) {
      trackPaymentEvent('checkout_prepare_failed', null, { debugCode: prepared.debugCode })
      setError(prepared.message)
      setPhase('form')
      busyRef.current = false
      return
    }

    // 조회 토큰 로컬 저장 (완료페이지·내 주문내역에서 사용)
    saveLocalOrder({
      paymentId: prepared.paymentId,
      orderAccessToken: prepared.accessToken,
      orderNumber: prepared.merchantOrderId,
      productName: prepared.orderName,
      optionName: selected?.label ?? null,
      amount: prepared.amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    setPhase('window')
    trackPaymentEvent('payment_window_opened', prepared.paymentId)
    const result = await openPortOnePayment(prepared)
    if (result.kind === 'failed') {
      const cancelled = /cancel/i.test(result.code) || /취소/.test(result.message)
      trackPaymentEvent(cancelled ? 'payment_cancelled_by_user' : 'payment_client_failed', prepared.paymentId, { code: result.code })
      setError(cancelled ? '결제가 취소되었습니다. 준비되시면 다시 시도해주세요.' : result.message)
      setPhase('form')
      busyRef.current = false
      return
    }
    // 서버 재검증은 완료페이지에서 수행 (PC 흐름)
    navigate(`/payment/complete?paymentId=${encodeURIComponent(result.paymentId)}`)
  }

  const busy = phase !== 'form'

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased [word-break:keep-all]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to={`/business-services/${pkg.slug}`} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.7rem] font-medium text-slate-500">서비스몰 결제</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {environment === 'test' && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700 ring-1 ring-inset ring-amber-300">테스트 결제</span>
            )}
            <PublicMenuDrawer variant="business" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[640px] px-5 pb-24 pt-6">
        <button type="button" onClick={() => navigate(-1)} className="mb-3 text-sm font-semibold text-slate-500 hover:text-slate-900">
          ← 상품으로 돌아가기
        </button>
        <h1 className="text-2xl font-black tracking-tight">결제하기</h1>

        {!configured && (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-[0.95rem] leading-relaxed text-amber-800">
            결제 설정이 아직 완료되지 않았습니다. 아래 상담 신청을 남겨주시면 결제와 진행을 함께 안내드리겠습니다.
            <Link to={`/business-services/${pkg.slug}#apply`} className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white hover:bg-blue-700">
              상담 신청하기 →
            </Link>
          </div>
        )}

        {configured && gateBlocked && (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-[0.95rem] leading-relaxed text-amber-800">
            현재 결제 기능을 준비하고 있습니다. 결제 전 상담을 이용해주세요.
            <Link to={`/business-services/${pkg.slug}#apply`} className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white hover:bg-blue-700">
              결제 전 상담하기 →
            </Link>
          </div>
        )}

        {/* A. 주문 상품 */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">주문 상품</p>
          <div className="mt-3 flex gap-4">
            {pkg.imageSrc && (
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img src={pkg.imageSrc} alt={pkg.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-base font-black leading-snug">{pkg.name}</p>
              <p className="mt-0.5 text-sm text-slate-500">{pkg.short}</p>
              <p className="mt-1 text-xs text-slate-400">수량 1개 · 금액은 수정할 수 없습니다</p>
            </div>
          </div>

          {variants && variants.length > 1 && (
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-700">옵션 선택</p>
              <div className="mt-2 space-y-2">
                {variants.map((v) => (
                  <button
                    key={v.optionId}
                    type="button"
                    onClick={() => { setOptionId(v.optionId); trackPaymentEvent('checkout_option_selected', null, { productSlug: pkg.slug, optionId: v.optionId }) }}
                    aria-pressed={v.optionId === optionId}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      v.optionId === optionId ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-bold">{v.label}{v.badge && <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-black text-amber-700">{v.badge}</span>}</span>
                      {v.note && <span className="mt-0.5 block text-xs text-slate-400">{v.note}</span>}
                    </span>
                    <span className="shrink-0 text-base font-black tabular-nums">{formatKrw(v.amount)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ISO 규격 선택 */}
          {isIso && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-700">
                인증 규격 선택 <span className="text-slate-400">({optionId === 'iso-three' ? '3종 자동 선택' : `${isoRequired}개 선택`})</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ISO_STANDARDS.map((std) => {
                  const on = isoPicks.includes(std)
                  return (
                    <button
                      key={std}
                      type="button"
                      onClick={() => toggleIso(std)}
                      disabled={optionId === 'iso-three'}
                      aria-pressed={on}
                      className={`rounded-lg px-3.5 py-2 text-sm font-bold transition-colors disabled:opacity-70 ${
                        on ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {std}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-slate-400">규격 선택은 진행 참고용이며, 결제금액은 종수 기준으로 확정됩니다.</p>
            </div>
          )}

          <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-bold text-slate-500">최종 결제금액</span>
            <span className="text-[1.7rem] font-black tabular-nums tracking-tight">{formatKrw(amount)}</span>
          </div>
          {checkoutTerms.priceTaxNote && <p className="text-right text-xs text-slate-400">{checkoutTerms.priceTaxNote}</p>}
        </section>

        {/* B. 신청자 정보 */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">신청자 정보</p>
          <div className="mt-3 space-y-2.5">
            <input type="text" value={buyer.buyerCompanyName} onChange={(e) => setBuyer((b) => ({ ...b, buyerCompanyName: e.target.value }))} placeholder="회사명 (필수)" autoComplete="organization" className={inputCls} />
            <input type="text" value={buyer.buyerName} onChange={(e) => setBuyer((b) => ({ ...b, buyerName: e.target.value }))} placeholder="대표자명 또는 신청자명 (필수)" autoComplete="name" className={inputCls} />
            <input type="tel" value={buyer.buyerPhone} onChange={(e) => setBuyer((b) => ({ ...b, buyerPhone: e.target.value }))} placeholder="휴대전화번호 (필수) 예) 010-1234-5678" autoComplete="tel" className={inputCls} />
            <input type="email" value={buyer.buyerEmail} onChange={(e) => setBuyer((b) => ({ ...b, buyerEmail: e.target.value }))} placeholder="이메일 (필수)" autoComplete="email" className={inputCls} />
            <input type="text" value={buyer.buyerBusinessNumber} onChange={(e) => setBuyer((b) => ({ ...b, buyerBusinessNumber: e.target.value }))} placeholder="사업자등록번호 (선택)" className={inputCls} />
            <textarea value={buyer.buyerMemo} onChange={(e) => setBuyer((b) => ({ ...b, buyerMemo: e.target.value }))} placeholder="요청사항 (선택)" rows={3} className={inputCls} />
            {/* honeypot — 화면에 보이지 않음 */}
            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          </div>
        </section>

        {/* C. 동의 */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">필수 동의</p>
          <div className="mt-3 space-y-3">
            {(
              [
                { key: 'privacy' as const, label: '개인정보 수집·이용 동의', desc: checkoutTerms.privacySummary },
                { key: 'terms' as const, label: '구매 및 서비스 진행조건 확인', desc: checkoutTerms.purchaseTermsSummary },
                { key: 'refund' as const, label: '취소·환불 안내 확인', desc: checkoutTerms.refundPolicySummary },
              ]
            ).map((c) => (
              <label key={c.key} className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={consents[c.key]}
                  onChange={(e) => setConsents((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                  className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-800">{c.label} <span className="text-red-500">(필수)</span></span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{c.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* D. 결제 */}
        <section className="mt-4">
          {error && <p role="alert" className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold leading-snug text-red-700">{error}</p>}
          <button
            type="button"
            onClick={handlePay}
            disabled={busy || !configured || gateBlocked}
            className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === 'preparing' ? '주문을 준비하고 있어요…' : phase === 'window' ? '결제창 확인 중…' : `${formatKrw(amount)} 결제하기`}
          </button>
          <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
            결제수단 카드 · {checkoutTerms.serviceStartNotice}
            <br />카드사 할부 가능 여부는 결제창에서 확인할 수 있습니다.
          </p>
          <Link
            to={`/business-services/${pkg.slug}#apply`}
            onClick={() => trackPaymentEvent('payment_consultation_clicked', null, { from: 'checkout', productSlug: pkg.slug })}
            className="mt-2 block text-center text-sm font-semibold text-slate-400 underline underline-offset-4 hover:text-slate-700"
          >
            결제 전 상담을 먼저 받고 싶어요
          </Link>
        </section>
      </main>
    </div>
  )
}
