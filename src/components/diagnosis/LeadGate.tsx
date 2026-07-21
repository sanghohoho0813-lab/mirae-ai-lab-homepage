// 결과 공개 전 대표자 정보 입력 게이트 — 상담 신청 모달(ConsultModal)과 동일한 톤/필드로 통일.
// 개인정보 동의(필수)와 상담/마케팅 동의(선택)는 분리, 기본 미체크.
// ⚠️ 사업자유형·업종은 3분 설문에서 이미 받으므로 여기서 다시 묻지 않고, 답변은 제출 시 함께 넘어갑니다.
import { useEffect, useRef, useState } from 'react'
import type { LeadFormData } from '../../types/businessDiagnosis'
import { PRIVACY_CONSENT, PRIVACY_CONSENT_VERSION } from '../../config/privacyConsent'
import { CONSULT_METHODS, CONSULT_TOPIC_GROUPS } from '../../lib/consultApi'

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
  const [topics, setTopics] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
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

  const toggleTopic = (t: string) =>
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const toggleGroup = (t: string) =>
    setExpanded((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  const phoneDigits = phone.replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 10 && phoneDigits.length <= 11 && phoneDigits.startsWith('01')
  const canSubmit = companyName.trim() && repName.trim() && phoneOk && privacyOk && !submitting

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit) return
    // 업종·업력·직원수·지역은 설문에서 이미 받으므로, 여기선 관심 상품만 함께 전달
    const companyProfile: Record<string, string> = {}
    if (topics.length) companyProfile['관심 상품'] = topics.join(', ')
    onSubmit({
      companyName: companyName.trim().slice(0, 80),
      representativeName: repName.trim().slice(0, 40),
      phone: phoneDigits,
      email: email.trim().slice(0, 120) || undefined,
      contactMethod: contactMethod || undefined,
      companyProfile: Object.keys(companyProfile).length ? companyProfile : undefined,
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

        {/* 관심 상품 (선택) — 업종·업력·직원수·지역은 설문에서 이미 받았으니, 여기선 상품만 */}
        <div>
          <label className={labelCls}>관심 상품 <span className="font-normal text-slate-400">(선택)</span></label>
          <p className="mb-1.5 text-[0.8rem] leading-snug text-slate-400">선택하지 않으셔도 진단 결과에 맞게 알아서 추천해 드려요.</p>
          <div className="space-y-1.5">
            {CONSULT_TOPIC_GROUPS.map((g) => {
              const isOpen = expanded.includes(g.title)
              const picked = g.products.filter((pr) => topics.includes(pr.name)).length
              return (
                <div key={g.title} className="overflow-hidden rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => toggleGroup(g.title)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[0.9rem] font-semibold transition ${
                      picked > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="min-w-0">
                      {g.title}
                      {picked > 0 && <span className="ml-1.5 text-xs font-bold text-blue-600">· {picked}개 선택</span>}
                    </span>
                    <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-white p-2">
                      {g.products.map((pr) => {
                        const on = topics.includes(pr.name)
                        return (
                          <button
                            key={pr.slug}
                            type="button"
                            onClick={() => toggleTopic(pr.name)}
                            aria-pressed={on}
                            className={`flex flex-col overflow-hidden rounded-xl border text-left transition ${
                              on ? 'border-blue-500 ring-2 ring-inset ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="relative aspect-[16/10] w-full bg-slate-100">
                              {pr.imageSrc && <img src={pr.imageSrc} alt="" loading="lazy" className="h-full w-full object-cover" />}
                              <span
                                className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-[0.7rem] font-black transition ${
                                  on ? 'bg-blue-600 text-white' : 'bg-white/85 text-transparent ring-1 ring-inset ring-slate-300'
                                }`}
                                aria-hidden
                              >
                                ✓
                              </span>
                            </div>
                            <span className={`px-2.5 py-2 text-[0.82rem] font-semibold leading-snug ${on ? 'text-blue-700' : 'text-slate-700'}`}>{pr.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
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
        <p className="text-center text-sm font-medium text-slate-400">입력 후 전체 결과가 즉시 공개됩니다. 그동안 답한 진단 내용도 함께 전달됩니다.</p>
      </div>
    </div>
  )
}
