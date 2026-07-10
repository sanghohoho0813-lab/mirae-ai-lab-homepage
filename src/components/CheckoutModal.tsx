// 서비스몰 카드결제 모달 — 상품 확인 + 주문자 정보 + PortOne 카드결제.
// 결제 키(VITE_PORTONE_*) 미설정 시 결제 대신 상담 안내로 자연스럽게 전환합니다.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { BusinessPackage } from '../data/businessPackages'
import { formatKrw, paymentConfigured, requestCardPayment, resolveAmount, type BuyerInfo, type CheckoutResult } from '../lib/checkout'

type Props = {
  pkg: BusinessPackage
  initialVariantIdx?: number
  onClose: () => void
  /** '상담으로 안내' 선택 시 (모달 닫고 상담 폼으로 스크롤) */
  onConsultInstead: () => void
}

type Phase = 'form' | 'paying' | 'done' | 'error'

export default function CheckoutModal({ pkg, initialVariantIdx = 0, onClose, onConsultInstead }: Props) {
  const [variantIdx, setVariantIdx] = useState(initialVariantIdx)
  const [buyer, setBuyer] = useState<BuyerInfo>({ name: '', phone: '', email: '' })
  const [consent, setConsent] = useState(false)
  const [phase, setPhase] = useState<Phase>('form')
  const [result, setResult] = useState<CheckoutResult | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const configured = paymentConfigured()
  const resolved = useMemo(() => resolveAmount(pkg, variantIdx), [pkg, variantIdx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'paying') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('input, button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, phase])

  async function handlePay() {
    if (!resolved) return
    if (!buyer.name.trim() || buyer.phone.replace(/\D/g, '').length < 9) {
      setFieldError('성함과 연락처를 정확히 입력해주세요.')
      return
    }
    if (!consent) {
      setFieldError('개인정보 수집·이용에 동의해주세요.')
      return
    }
    setFieldError(null)
    setPhase('paying')
    const r = await requestCardPayment({ pkg, variantIdx, buyer: { ...buyer, name: buyer.name.trim() } })
    setResult(r)
    setPhase(r.ok ? 'done' : 'error')
  }

  const input =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${pkg.name} 결제`}>
      <button
        type="button"
        aria-label="닫기"
        onClick={phase === 'paying' ? undefined : onClose}
        className="animate-overlay-in absolute inset-0 h-full w-full cursor-default bg-slate-900/55 backdrop-blur-[2px]"
      />
      <div className="absolute inset-0 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6">
        <div
          ref={panelRef}
          className="animate-rise-in relative w-full max-w-[520px] rounded-t-3xl bg-white p-6 shadow-2xl [word-break:keep-all] sm:rounded-3xl sm:p-7"
        >
          <button
            type="button"
            onClick={phase === 'paying' ? undefined : onClose}
            aria-label="결제창 닫기"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>

          {phase === 'done' && result?.ok ? (
            // ── 결제 완료 ──
            <div className="pt-2 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900">결제가 완료되었습니다</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {pkg.name}
                {resolved?.variantLabel ? ` (${resolved.variantLabel})` : ''} · {resolved ? formatKrw(resolved.amount) : ''}
              </p>
              <p className="mt-1 text-xs text-slate-400">주문번호 {result.orderNo}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-left text-sm leading-relaxed text-slate-600">
                담당자가 결제 확인 후 <b className="text-slate-900">영업일 기준 1일 이내</b>에 입력하신 연락처로 진행 안내를 드립니다.
                {!result.recorded && ' (주문 기록 저장이 지연되어 결제 영수증 기준으로 확인 후 연락드립니다.)'}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-slate-700"
              >
                확인
              </button>
            </div>
          ) : !configured ? (
            // ── 결제 키 미설정 — 상담 브릿지 ──
            <div className="pt-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900">카드결제 연결 준비 중입니다</h2>
              <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
                온라인 카드결제 시스템 연결이 마무리되는 중이에요. 아래 상담 신청을 남겨주시면
                결제 안내와 진행을 함께 도와드리겠습니다.
              </p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-bold text-slate-900">{pkg.name}</p>
                {resolved && <p className="mt-1 text-lg font-black text-slate-900">{formatKrw(resolved.amount)}</p>}
              </div>
              <button
                type="button"
                onClick={onConsultInstead}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-blue-700"
              >
                상담으로 진행하기 →
              </button>
            </div>
          ) : (
            // ── 주문서 ──
            <div className="pt-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900">결제하기</h2>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">{pkg.category}</p>
                <p className="mt-0.5 text-base font-black text-slate-900">{pkg.name}</p>
                {pkg.variants && pkg.variants.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pkg.variants.map((v, i) => (
                      <button
                        key={v.label}
                        type="button"
                        onClick={() => setVariantIdx(i)}
                        aria-pressed={i === variantIdx}
                        className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                          i === variantIdx ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
                {pkg.variants?.length === 1 && <p className="mt-1 text-sm font-semibold text-slate-500">{pkg.variants[0].label}</p>}
                <div className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-3">
                  <span className="text-sm font-bold text-slate-500">결제 금액</span>
                  <span className="text-2xl font-black tracking-tight text-slate-900">{resolved ? formatKrw(resolved.amount) : '-'}</span>
                </div>
                {pkg.priceNote && <p className="mt-1 text-right text-xs text-slate-400">{pkg.priceNote}</p>}
              </div>

              <div className="mt-4 space-y-2.5">
                <input type="text" value={buyer.name} onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))} placeholder="성함 (필수)" autoComplete="name" className={input} />
                <input type="tel" value={buyer.phone} onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))} placeholder="연락처 (필수) 예) 010-1234-5678" autoComplete="tel" className={input} />
                <input type="email" value={buyer.email} onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))} placeholder="이메일 (선택)" autoComplete="email" className={input} />
              </div>

              <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300" />
                <span>
                  결제 진행과 서비스 안내를 위한 <b className="text-slate-900">개인정보 수집·이용</b>에 동의합니다. (성함·연락처·이메일 / 목적 달성 시까지 보관)
                </span>
              </label>

              {(fieldError || (phase === 'error' && result && !result.ok)) && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold leading-snug text-red-700">
                  {fieldError ?? (result && !result.ok ? result.message : '')}
                </p>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={phase === 'paying'}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
              >
                {phase === 'paying' ? '결제창을 여는 중…' : `${resolved ? formatKrw(resolved.amount) : ''} 카드로 결제하기`}
              </button>
              <p className="mt-2.5 text-center text-xs leading-relaxed text-slate-400">
                카드 무이자 할부 가능 · 결제 후 담당자가 진행 안내를 드립니다.
              </p>
              <button
                type="button"
                onClick={onConsultInstead}
                className="mt-2 w-full text-center text-sm font-semibold text-slate-400 underline underline-offset-4 hover:text-slate-700"
              >
                결제 전에 상담을 먼저 받고 싶어요
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
