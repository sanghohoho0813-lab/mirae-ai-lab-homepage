import { useState, type FormEvent } from 'react'

// 프론트 전용 상담 신청 폼 (백엔드 미연결). 제출 시 임시 접수 안내만 표시합니다.
// 기존 InquiryForm(/api/inquiry) 과 분리된 별도 컴포넌트입니다.

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-2 block text-sm font-semibold text-slate-800'

const interestOptions = [
  '정책자금',
  '정부지원사업',
  '벤처인증',
  '연구소',
  '홈페이지+MVP',
  '잘 모르겠음',
]

export default function BusinessInquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 실제 전송 없이 프론트에서만 임시 접수 처리 (추후 연동 예정)
    event.currentTarget.reset()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelClass}>
            회사명 <span className="text-rose-500">*</span>
          </label>
          <input id="company" name="company" type="text" required placeholder="예: (주)미래상사" className={inputClass} />
        </div>
        <div>
          <label htmlFor="ceo" className={labelClass}>
            대표자명 <span className="text-rose-500">*</span>
          </label>
          <input id="ceo" name="ceo" type="text" required placeholder="예: 김대표" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact" className={labelClass}>
            연락처 <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            required
            placeholder="이메일 또는 휴대폰 번호"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="industry" className={labelClass}>
            업종
          </label>
          <input id="industry" name="industry" type="text" placeholder="예: 제조업 / 도소매 / 서비스업" className={inputClass} />
        </div>
      </div>

      <div className="mt-6">
        <span className={labelClass}>현재 관심 분야</span>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
            >
              <input type="radio" name="interest" value={opt} className="h-3.5 w-3.5 accent-blue-600" />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="concern" className={labelClass}>
          현재 고민
        </label>
        <textarea
          id="concern"
          name="concern"
          rows={4}
          placeholder="예: 운전자금이 필요한데 어떤 정책자금부터 봐야 할지 모르겠습니다."
          className={`${inputClass} resize-y`}
        />
      </div>

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-base font-medium text-emerald-800"
        >
          신청 내용이 임시로 접수되었습니다. 실제 연결은 추후 연동 예정입니다.
        </div>
      )}

      <button
        type="submit"
        className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-700 sm:w-auto"
      >
        진단 신청하기
      </button>
      <p className="mt-3 text-sm text-slate-400">
        제출하신 내용은 상담 준비 용도로만 확인하며, 현재 단계에서는 별도 서버로 전송되지 않습니다.
      </p>
    </form>
  )
}
