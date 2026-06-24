import { useState, type FormEvent } from 'react'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

const labelClass = 'mb-2 block text-base font-semibold text-slate-800'

function InquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            이름
          </label>
          <input id="name" name="name" type="text" placeholder="예: 김대표" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact" className={labelClass}>
            연락처
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            placeholder="연락 가능한 전화번호 또는 이메일"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            직업/소속
          </label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="예: 법인컨설턴트 / 중소기업 대표"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="toolType" className={labelClass}>
            만들고 싶은 도구 유형
          </label>
          <input
            id="toolType"
            name="toolType"
            type="text"
            placeholder="예: 고객관리, 지원금 검토, 제안서 자동화"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="repetitiveTask" className={labelClass}>
          현재 가장 시간이 오래 걸리는 반복 업무
        </label>
        <input
          id="repetitiveTask"
          name="repetitiveTask"
          type="text"
          placeholder="예: 엑셀 정리, 상담 기록, 지원금 요건 검토"
          className={inputClass}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="message" className={labelClass}>
          문의 내용
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="자동화하고 싶은 업무 흐름을 편하게 적어주세요."
          className={`${inputClass} resize-y`}
        />
      </div>

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-base font-medium text-amber-800"
        >
          문의 기능은 준비 중입니다. 아래 연락처로 문의해주세요.{' '}
          {/* TODO: 실제 문의 이메일로 교체하세요 */}
          <a href="mailto:contact@aibusinesslab.kr" className="font-semibold underline">
            contact@aibusinesslab.kr
          </a>
        </div>
      )}

      <button
        type="submit"
        className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-slate-700 sm:w-auto"
      >
        문의 남기기
      </button>
    </form>
  )
}

export default InquiryForm
