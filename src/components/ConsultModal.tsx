// 사이트 공통 "상담 신청 / 문의" 모달 — 어디서 열든 담긴 상품·선택 항목(contextRows)을
// 함께 실어 /api/consult(→ 관리자 지메일)로 보냅니다. 카드결제 준비 중 상담 우회 CTA 공용.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitConsult, type ConsultContextRow } from '../lib/consultApi'

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
}

export default function ConsultModal({
  open,
  onClose,
  source,
  contextRows = [],
  heading = '상담 신청',
  intro = '연락처를 남겨주시면 담당자가 확인 후 빠르게 연락드립니다. 남겨주신 상품·선택 내용은 그대로 함께 전달됩니다.',
  submitLabel = '상담 신청하기',
}: ConsultModalProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [agreeError, setAgreeError] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // 열릴 때마다 상태 초기화 + 스크롤 잠금 + ESC 닫기 + 첫 필드 포커스
  useEffect(() => {
    if (!open) return
    setStatus('idle')
    setServerMessage('')
    setAgree(false)
    setAgreeError(false)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

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
    const company = String(fd.get('company') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    setStatus('submitting')
    setServerMessage('')
    try {
      const res = await submitConsult({ name, contact, company, message, source, context: contextRows })
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
                  <input ref={firstFieldRef} id="consult-name" name="name" type="text" required placeholder="예: 김대표" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="consult-contact" className={labelClass}>
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <input id="consult-contact" name="contact" type="text" required placeholder="휴대폰 번호 또는 이메일" className={inputClass} />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="consult-company" className={labelClass}>
                  회사명 <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <input id="consult-company" name="company" type="text" placeholder="예: (주)미래상사" className={inputClass} />
              </div>

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
