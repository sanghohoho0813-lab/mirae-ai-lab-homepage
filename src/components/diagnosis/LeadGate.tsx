// AX Fit 상담 신청 — 결과를 본 뒤 연락처만 남기는 폼. 상담 신청 모달(ConsultModal)과 동일한 톤/필드.
// 개인정보 동의(필수)와 상담/마케팅 동의(선택)는 분리, 기본 미체크.
// ⚠️ 10문항 답변과 AX Fit 결과는 제출 시 함께 넘어간다. 상품 선택은 두지 않는다(진단은 진단만).
import { useEffect, useRef, useState } from 'react'
import type { LeadFormData } from '../../types/businessDiagnosis'
import { PRIVACY_CONSENT, PRIVACY_CONSENT_VERSION } from '../../config/privacyConsent'
import { CONSULT_METHODS } from '../../lib/consultApi'

type Props = {
  submitting: boolean
  errorMessage: string | null
  onSubmit: (form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number }) => void
}

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
const labelCls = 'block text-sm font-bold text-slate-700'

export default function LeadGate({ submitting, errorMessage, onSubmit }: Props) {
  const [companyName, setCompanyName] = useState('')
  const [repName, setRepName] = useState('')
  const [phone, setPhone] = useState('010-')
  const [email, setEmail] = useState('')
  const [contactMethod, setContactMethod] = useState('')
  const [privacyOk, setPrivacyOk] = useState(false)
  const [consultOk, setConsultOk] = useState(false)
  const [marketingOk, setMarketingOk] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [touched, setTouched] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const openedAtRef = useRef<number>(Date.now())

  useEffect(() => {
    openedAtRef.current = Date.now()
  }, [])

  const phoneDigits = phone.replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 10 && phoneDigits.length <= 11 && phoneDigits.startsWith('01')
  const canSubmit = companyName.trim() && repName.trim() && phoneOk && privacyOk && !submitting

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit) return
    onSubmit({
      companyName: companyName.trim().slice(0, 80),
      representativeName: repName.trim().slice(0, 40),
      phone: phoneDigits,
      email: email.trim().slice(0, 120) || undefined,
      contactMethod: contactMethod || undefined,
      privacyConsent: privacyOk,
      consultationConsent: consultOk,
      marketingConsent: marketingOk,
      privacyConsentVersion: PRIVACY_CONSENT_VERSION,
      honeypot: honeypotRef.current?.value || undefined,
      formElapsedMs: Date.now() - openedAtRef.current,
    })
  }

  return (
    <div className="animate-rise-in mx-auto mt-8 w-full max-w-[640px] rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">AX Fit 상담 신청</p>
      <h2 className="mt-2 text-xl font-black leading-[1.3] tracking-tight text-slate-900 sm:text-2xl">
        진단 결과를 바탕으로<br className="sm:hidden" /> 우리 회사 AX 방향을 함께 확인해보세요
      </h2>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-600">
        방금 답하신 10개 문항과 AX Fit 결과가 함께 전달됩니다. 담당자가 확인한 뒤 연락드립니다.
      </p>

      <div className="mt-6 space-y-4">
        {/* honeypot — 화면에 보이지 않는 봇 차단 필드 */}
        <input ref={honeypotRef} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lg-company" className={labelCls}>회사명 *</label>
            <input id="lg-company" className={`${inputCls} mt-1.5`} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="예: 미래상사" maxLength={80} />
            {touched && !companyName.trim() && <p className="mt-1 text-xs font-semibold text-red-500">회사명을 입력해주세요.</p>}
          </div>
          <div>
            <label htmlFor="lg-name" className={labelCls}>대표자명 *</label>
            <input id="lg-name" className={`${inputCls} mt-1.5`} value={repName} onChange={(e) => setRepName(e.target.value)} placeholder="예: 홍길동" maxLength={40} />
            {touched && !repName.trim() && <p className="mt-1 text-xs font-semibold text-red-500">대표자명을 입력해주세요.</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lg-phone" className={labelCls}>휴대전화번호 *</label>
            <input id="lg-phone" className={`${inputCls} mt-1.5`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호" inputMode="tel" maxLength={13} />
            {touched && !phoneOk && <p className="mt-1 text-xs font-semibold text-red-500">올바른 휴대전화번호를 입력해주세요.</p>}
          </div>
          <div>
            <label htmlFor="lg-email" className={labelCls}>이메일 (선택)</label>
            <input id="lg-email" className={`${inputCls} mt-1.5`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@company.com" inputMode="email" maxLength={120} />
          </div>
        </div>

        {/* 상담 희망 방식 */}
        <div>
          <label className={labelCls}>상담 희망 방식 (선택)</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CONSULT_METHODS.map((m) => {
              const on = contactMethod === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setContactMethod(on ? '' : m)}
                  aria-pressed={on}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    on ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m === '전화' ? '📞 전화' : '💬 카톡·문자'}
                </button>
              )
            })}
          </div>
        </div>

        {/* 동의 — 필수/선택 분리, 기본 미체크 */}
        <div className="space-y-2.5 rounded-2xl bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={privacyOk} onChange={(e) => setPrivacyOk(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600" />
            <span className="min-w-0">
              <span className="text-sm font-bold text-slate-800">{PRIVACY_CONSENT.required.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500">{PRIVACY_CONSENT.required.summary}</span>
              <button type="button" onClick={() => setPrivacyOpen((o) => !o)} className="mt-1 text-xs font-semibold text-blue-600 underline underline-offset-2">
                {privacyOpen ? '내용 접기' : '자세히 보기'}
              </button>
              {privacyOpen && (
                <ul className="mt-2 space-y-1 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-500 ring-1 ring-inset ring-slate-200">
                  {PRIVACY_CONSENT.required.detail.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              )}
            </span>
          </label>
          {touched && !privacyOk && <p className="text-xs font-semibold text-red-500">상담 신청을 위해 개인정보 수집·이용 동의가 필요합니다.</p>}
          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={consultOk} onChange={(e) => setConsultOk(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600" />
            <span className="min-w-0">
              <span className="text-sm font-bold text-slate-800">{PRIVACY_CONSENT.consultation.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500">{PRIVACY_CONSENT.consultation.summary}</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={marketingOk} onChange={(e) => setMarketingOk(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600" />
            <span className="min-w-0">
              <span className="text-sm font-bold text-slate-800">{PRIVACY_CONSENT.marketing.label}</span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500">{PRIVACY_CONSENT.marketing.summary}</span>
            </span>
          </label>
        </div>

        {errorMessage && (
          <div role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-snug text-amber-800 ring-1 ring-inset ring-amber-200">
            {errorMessage} <span className="font-medium">작성하신 답변은 안전하게 보관되어 있으니, 잠시 후 다시 시도해주세요.</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {submitting ? '접수하고 있어요…' : 'AX Fit 상담 신청하기'}
        </button>
        <p className="text-center text-sm font-medium text-slate-400">연락처는 상담 목적으로만 사용합니다. 답하신 진단 내용이 함께 전달됩니다.</p>
      </div>
    </div>
  )
}
