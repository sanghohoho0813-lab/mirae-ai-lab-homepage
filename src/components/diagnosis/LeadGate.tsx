// 결과 공개 전 대표자 정보 입력 게이트 — 토스풍 카드 (행정 신청서 톤 금지, 공포·마감 문구 금지).
// 개인정보 동의(필수)와 상담/마케팅 동의(선택)는 분리, 기본 미체크.
import { useEffect, useRef, useState } from 'react'
import type { LeadFormData } from '../../types/businessDiagnosis'
import { PRIVACY_CONSENT, PRIVACY_CONSENT_VERSION } from '../../config/privacyConsent'
import { questions } from '../../data/businessDiagnosisQuestions'

type Props = {
  submitting: boolean
  errorMessage: string | null
  onSubmit: (form: LeadFormData & { privacyConsentVersion: string; honeypot?: string; formElapsedMs: number }) => void
}

const CONTACT_METHODS = ['전화', '카카오톡', '문자', '대면상담', '아직 상담은 원하지 않음']
const BIZ_TYPES = [
  { value: 'individual', label: '개인사업자' },
  { value: 'corp', label: '법인사업자' },
  { value: 'pre', label: '예비창업자' },
]
const INDUSTRIES = questions.find((q) => q.id === 'industry')?.options ?? []

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
const labelCls = 'block text-sm font-bold text-slate-700'

export default function LeadGate({ submitting, errorMessage, onSubmit }: Props) {
  const [companyName, setCompanyName] = useState('')
  const [repName, setRepName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [bizType, setBizType] = useState('')
  const [industry, setIndustry] = useState('')
  const [contactMethod, setContactMethod] = useState('')
  const [contactTime, setContactTime] = useState('')
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
  const canSubmit = companyName.trim() && repName.trim() && phoneOk && bizType && industry && privacyOk && !submitting

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit) return
    onSubmit({
      companyName: companyName.trim().slice(0, 80),
      representativeName: repName.trim().slice(0, 40),
      phone: phoneDigits,
      email: email.trim().slice(0, 120) || undefined,
      contactMethod: contactMethod || undefined,
      preferredContactTime: contactTime.trim().slice(0, 80) || undefined,
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
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">전체 결과 잠금 해제</p>
      <h2 className="mt-2 text-xl font-black leading-[1.3] tracking-tight text-slate-900 sm:text-2xl">
        전체 진단 결과와 맞춤 성장 로드맵을 확인해보세요
      </h2>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-600">
        대표님 회사의 강점, 보완할 부분, 정책자금·지원사업 활용 기반과 추천 실행 순서를 정리했습니다.
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
            <input id="lg-phone" className={`${inputCls} mt-1.5`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" inputMode="tel" maxLength={13} />
            {touched && !phoneOk && <p className="mt-1 text-xs font-semibold text-red-500">올바른 휴대전화번호를 입력해주세요.</p>}
          </div>
          <div>
            <label htmlFor="lg-email" className={labelCls}>이메일 (선택)</label>
            <input id="lg-email" className={`${inputCls} mt-1.5`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@company.com" inputMode="email" maxLength={120} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lg-biztype" className={labelCls}>사업자 유형 *</label>
            <select id="lg-biztype" className={`${inputCls} mt-1.5`} value={bizType} onChange={(e) => setBizType(e.target.value)}>
              <option value="">선택해주세요</option>
              {BIZ_TYPES.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
            {touched && !bizType && <p className="mt-1 text-xs font-semibold text-red-500">사업자 유형을 선택해주세요.</p>}
          </div>
          <div>
            <label htmlFor="lg-industry" className={labelCls}>업종 *</label>
            <select id="lg-industry" className={`${inputCls} mt-1.5`} value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">선택해주세요</option>
              {INDUSTRIES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {touched && !industry && <p className="mt-1 text-xs font-semibold text-red-500">업종을 선택해주세요.</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lg-method" className={labelCls}>상담 희망 방식 (선택)</label>
            <select id="lg-method" className={`${inputCls} mt-1.5`} value={contactMethod} onChange={(e) => setContactMethod(e.target.value)}>
              <option value="">선택해주세요</option>
              {CONTACT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lg-time" className={labelCls}>상담 희망 시간 (선택)</label>
            <input id="lg-time" className={`${inputCls} mt-1.5`} value={contactTime} onChange={(e) => setContactTime(e.target.value)} placeholder="예: 평일 오후 2~5시" maxLength={80} />
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
          {touched && !privacyOk && <p className="text-xs font-semibold text-red-500">전체 결과 확인을 위해 개인정보 수집·이용 동의가 필요합니다.</p>}
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
          {submitting ? '결과를 준비하고 있어요…' : '전체 진단 결과 확인하기'}
        </button>
        <p className="text-center text-sm font-medium text-slate-400">입력 후 전체 결과가 즉시 공개됩니다.</p>
      </div>
    </div>
  )
}
