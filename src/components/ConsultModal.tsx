// 사이트 공통 "상담 신청 / 문의" 모달 — 어디서 열든 담긴 상품·선택 항목(contextRows)을
// 함께 실어 /api/consult(→ 관리자 지메일)로 보냅니다. 카드결제 준비 중 상담 우회 CTA 공용.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitConsult, CONSULT_COMPANY_FIELDS, CONSULT_METHODS, type ConsultContextRow, type ConsultTopicGroup } from '../lib/consultApi'

const CONTACT_EMAIL = 'sanghohoho0813@gmail.com'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-800'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export type ConsultModalProps = {
  open: boolean
  onClose: () => void
  /** 신청 경로(이메일 제목/본문에 표시) 예: '정책자금 컨설팅', '장바구니' */
  source: string
  /** 담긴 상품/선택 옵션/체크 항목 등 — 폼 상단에 요약 표시 + 이메일 동봉 */
  contextRows?: ConsultContextRow[]
  heading?: string
  intro?: string
  submitLabel?: string
  /** 상담 희망 분야 — 6개 상황 목차, 각 목차 안에 상품(썸네일) */
  topicGroups?: ConsultTopicGroup[]
  /** 현재 페이지 상품명 — 자동 선택 + 해당 목차 펼침 */
  preselectProduct?: string
  /** 상담 희망 방식(전화/카톡·문자) 노출 여부 */
  showContactMethod?: boolean
  /** 기업 규모 파악용 선택 항목(업력·업종·매출·직원수·지역) 노출 여부 */
  showCompanyFields?: boolean
}

export default function ConsultModal({
  open,
  onClose,
  source,
  contextRows = [],
  heading = '상담 신청',
  intro = '연락처를 남겨주시면 담당자가 확인 후 빠르게 연락드립니다. 남겨주신 상품·선택 내용은 그대로 함께 전달됩니다.',
  submitLabel = '상담 신청하기',
  topicGroups = [],
  preselectProduct,
  showContactMethod = false,
  showCompanyFields = false,
}: ConsultModalProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [agreeError, setAgreeError] = useState(false)
  const [topics, setTopics] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [method, setMethod] = useState('')
  const [company, setCompany] = useState<Record<string, string>>({})
  const [industryEtc, setIndustryEtc] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleTopic = (t: string) =>
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const toggleGroup = (t: string) =>
    setExpanded((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const pickCompany = (key: string, value: string) =>
    setCompany((cur) => ({ ...cur, [key]: cur[key] === value ? '' : value }))

  // 열릴 때마다 상태 초기화 + 스크롤 잠금 + ESC 닫기 (자동 포커스 없음 → 항상 상단부터)
  useEffect(() => {
    if (!open) return
    setStatus('idle')
    setServerMessage('')
    setAgree(false)
    setAgreeError(false)
    // 현재 상품은 미리 선택하고, 그 상품이 속한 목차를 펼쳐 둠
    const preGroup = preselectProduct ? topicGroups.find((g) => g.products.some((p) => p.name === preselectProduct)) : undefined
    setTopics(preselectProduct ? [preselectProduct] : [])
    setExpanded(preGroup ? [preGroup.title] : topicGroups.length ? [topicGroups[0].title] : [])
    setMethod('')
    setCompany({})
    setIndustryEtc('')
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, preselectProduct, topicGroups])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!agree) {
      setAgreeError(true)
      return
    }
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const contact = String(fd.get('contact') ?? '').trim()
    const companyName = String(fd.get('company') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    setStatus('submitting')
    setServerMessage('')
    // 고른 관심 상품 + 상담 방식 + 기업 정보를 이메일 컨텍스트에 합칩니다.
    const companyRows = CONSULT_COMPANY_FIELDS
      .filter((f) => company[f.key])
      .map((f) => ({
        label: f.key,
        value:
          f.key === '업종' && company[f.key] === '기타' && industryEtc.trim()
            ? `기타 - ${industryEtc.trim()}`
            : company[f.key],
      }))
    const context = [
      ...contextRows,
      ...(topics.length ? [{ label: '관심 상품', value: topics.join(', ') }] : []),
      ...(method ? [{ label: '상담 희망 방식', value: method }] : []),
      ...companyRows,
    ]
    try {
      const res = await submitConsult({ name, contact, company: companyName, message, source, context })
      setServerMessage(res.message)
      setStatus('success')
      form.reset()
    } catch (e) {
      setServerMessage(e instanceof Error ? e.message : '')
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      onClick={onClose}
    >
      <div
        ref={scrollRef}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-6 pb-4 pt-6">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">{heading}</h2>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-500">{intro}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-1.5 -mt-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-7 pt-5">
          {status === 'success' ? (
            <div className="py-4 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
              </div>
              <p className="mt-4 text-base font-bold text-slate-900">{serverMessage || '상담 신청이 접수되었습니다.'}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">담당자가 확인 후 남겨주신 연락처로 연락드리겠습니다.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-slate-700"
              >
                확인
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* 담긴 상품/선택 항목 요약 */}
              {contextRows.length > 0 && (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.78rem] font-black uppercase tracking-wide text-slate-400">신청 내용</p>
                  <dl className="mt-2 space-y-1.5">
                    {contextRows.map((row) => (
                      <div key={`${row.label}-${row.value}`} className="flex gap-2 text-[0.92rem]">
                        <dt className="shrink-0 font-semibold text-slate-500">{row.label}</dt>
                        <dd className="min-w-0 font-bold text-slate-800">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="consult-name" className={labelClass}>
                    성함 <span className="text-rose-500">*</span>
                  </label>
                  <input id="consult-name" name="name" type="text" required placeholder="예: 김대표" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="consult-contact" className={labelClass}>
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <input id="consult-contact" name="contact" type="tel" required defaultValue="010-" placeholder="휴대폰 번호" inputMode="tel" className={inputClass} />
                </div>
              </div>

              {showContactMethod && (
                <div className="mt-4">
                  <p className={labelClass}>상담 희망 방식 <span className="font-normal text-slate-400">(선택)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {CONSULT_METHODS.map((m) => {
                      const on = method === m
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMethod(on ? '' : m)}
                          aria-pressed={on}
                          className={`rounded-lg border px-4 py-2 text-sm transition ${
                            on ? 'border-blue-500 bg-blue-50 font-bold text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {m === '전화' ? '📞 전화' : '💬 카톡·문자'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label htmlFor="consult-company" className={labelClass}>
                  회사명 <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <input id="consult-company" name="company" type="text" placeholder="예: (주)미래상사" className={inputClass} />
              </div>

              {/* 기업 정보 — 규모 파악용(선택). 채워주시면 상담이 더 정확해집니다. */}
              {showCompanyFields && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    기업 정보 <span className="font-normal text-slate-400">(선택 · 채워주시면 상담이 더 정확해져요)</span>
                  </p>
                  <div className="mt-3 space-y-3">
                    {CONSULT_COMPANY_FIELDS.map((f) => (
                      <div key={f.key}>
                        <p className="mb-1.5 text-[0.82rem] font-semibold text-slate-500">{f.label}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {f.options.map((opt) => {
                            const on = company[f.key] === opt
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => pickCompany(f.key, opt)}
                                aria-pressed={on}
                                className={`rounded-lg border px-2.5 py-1.5 text-[0.85rem] transition ${
                                  on ? 'border-blue-500 bg-blue-50 font-bold text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                        {/* 업종 '기타' 선택 시 직접 입력 */}
                        {f.key === '업종' && company['업종'] === '기타' && (
                          <input
                            type="text"
                            value={industryEtc}
                            onChange={(e) => setIndustryEtc(e.target.value)}
                            placeholder="업종을 직접 입력해주세요 (예: 요식업)"
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.85rem] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 관심 상품 — 맨 아래 · 선택 사항(안 골라도 상황 맞춰 추천). 목차 안 상품은 2열 카드+큰 썸네일 */}
              {topicGroups.length > 0 && (
                <div className="mt-4">
                  <p className={labelClass}>관심 상품 <span className="font-normal text-slate-400">(선택)</span></p>
                  <p className="-mt-0.5 mb-2 text-[0.8rem] leading-snug text-slate-400">선택하지 않으셔도 상담 시 상황에 맞게 알아서 추천해 드려요.</p>
                  <div className="space-y-1.5">
                    {topicGroups.map((g) => {
                      const isOpen = expanded.includes(g.title)
                      const picked = g.products.filter((p) => topics.includes(p.name)).length
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
                              {g.products.map((prod) => {
                                const on = topics.includes(prod.name)
                                return (
                                  <button
                                    key={prod.slug}
                                    type="button"
                                    onClick={() => toggleTopic(prod.name)}
                                    aria-pressed={on}
                                    className={`flex flex-col overflow-hidden rounded-xl border text-left transition ${
                                      on ? 'border-blue-500 ring-2 ring-inset ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="relative aspect-[16/10] w-full bg-slate-100">
                                      {prod.imageSrc && <img src={prod.imageSrc} alt="" loading="lazy" className="h-full w-full object-cover" />}
                                      <span
                                        className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-[0.7rem] font-black transition ${
                                          on ? 'bg-blue-600 text-white' : 'bg-white/85 text-transparent ring-1 ring-inset ring-slate-300'
                                        }`}
                                        aria-hidden
                                      >
                                        ✓
                                      </span>
                                    </div>
                                    <span className={`px-2.5 py-2 text-[0.82rem] font-semibold leading-snug ${on ? 'text-blue-700' : 'text-slate-700'}`}>{prod.name}</span>
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
              )}

              <div className="mt-4">
                <label htmlFor="consult-message" className={labelClass}>
                  문의 내용 <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <textarea
                  id="consult-message"
                  name="message"
                  rows={3}
                  placeholder="궁금한 점이나 현재 상황을 편하게 적어주세요."
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* 개인정보 동의 */}
              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked)
                    if (e.target.checked) setAgreeError(false)
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                />
                <span className={`text-[0.86rem] leading-relaxed ${agreeError ? 'text-rose-600' : 'text-slate-500'}`}>
                  <b className="font-bold">[필수]</b> 상담 목적의 개인정보 수집·이용에 동의합니다.{' '}
                  <Link to="/privacy" target="_blank" className="underline underline-offset-2 hover:text-slate-700">개인정보처리방침</Link>
                </span>
              </label>

              {status === 'error' && (
                <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  전송에 문제가 발생했습니다. 잠시 후 다시 시도하시거나 아래로 직접 보내주세요.{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>
                  {serverMessage && <span className="mt-1 block text-xs font-normal text-amber-700/80">사유: {serverMessage}</span>}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? '전송 중…' : submitLabel}
              </button>
              <p className="mt-2.5 text-center text-xs text-slate-400">무료 · 신청 1~2분 · 진행 여부는 상담 후 결정</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
