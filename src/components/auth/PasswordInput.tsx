// 비밀번호 입력 — 표시/숨김 토글 + 실시간 규칙 안내 (값은 어떤 로그·이벤트에도 저장하지 않음)
import { useState } from 'react'

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

export function passwordValid(pw: string): boolean {
  return pw.length >= 8 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw)
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '비밀번호',
  autoComplete = 'current-password',
  showRules = false,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: 'current-password' | 'new-password'
  showRules?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const lenOk = value.length >= 8
  const mixOk = /[a-zA-Z]/.test(value) && /[0-9]/.test(value)

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          minLength={8}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {showRules && value.length > 0 && (
        <div className="mt-1.5 flex gap-3 text-xs font-medium" aria-live="polite">
          <span className={lenOk ? 'text-emerald-600' : 'text-slate-400'}>{lenOk ? '✓' : '·'} 8자 이상</span>
          <span className={mixOk ? 'text-emerald-600' : 'text-slate-400'}>{mixOk ? '✓' : '·'} 영문·숫자 조합</span>
        </div>
      )}
    </div>
  )
}
