// 약관 동의 필드 — 전체 동의 + 필수/선택 개별 체크박스 + '보기' 링크.
// "가입 시 동의 간주" 방식이 아니라 사용자가 직접 체크해야 합니다.
import { Link } from 'react-router-dom'
import { AUTH_CONSENTS, type ConsentKey } from '../../config/authConsents'

export type ConsentState = Record<ConsentKey, boolean>

export const EMPTY_CONSENTS: ConsentState = { terms: false, privacy: false, age14: false, identity: false, marketing: false }

export function requiredConsentsAgreed(state: ConsentState): boolean {
  return AUTH_CONSENTS.filter((c) => c.required).every((c) => state[c.key])
}

export default function AgreementsField({
  value,
  onChange,
}: {
  value: ConsentState
  onChange: (next: ConsentState) => void
}) {
  const allChecked = AUTH_CONSENTS.every((c) => value[c.key])

  function toggleAll() {
    const next = !allChecked
    const state = { ...value }
    for (const c of AUTH_CONSENTS) state[c.key] = next
    onChange(state)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* 전체 동의 */}
      <label className="flex cursor-pointer items-center gap-2.5 border-b border-slate-100 px-4 py-3.5">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className="h-5 w-5 rounded border-slate-300 accent-blue-600"
          aria-label="약관 전체 동의"
        />
        <span className="text-base font-bold text-slate-900">전체 동의</span>
        <span className="text-xs text-slate-400">(선택 동의 포함)</span>
      </label>

      <div className="space-y-1 px-4 py-3">
        {AUTH_CONSENTS.map((c) => (
          <div key={c.key} className="flex items-start justify-between gap-2">
            <label className="flex flex-1 cursor-pointer items-start gap-2.5 py-1.5">
              <input
                type="checkbox"
                checked={value[c.key]}
                onChange={(e) => onChange({ ...value, [c.key]: e.target.checked })}
                className="mt-0.5 h-4.5 w-4.5 rounded border-slate-300 accent-blue-600"
              />
              <span className="min-w-0 text-[0.95rem] leading-snug text-slate-700">
                <span className={`mr-1.5 text-xs font-black ${c.required ? 'text-blue-600' : 'text-slate-400'}`}>
                  {c.required ? '[필수]' : '[선택]'}
                </span>
                {c.label}
                {c.detail && <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{c.detail}</span>}
              </span>
            </label>
            {c.link && (
              <Link
                to={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 shrink-0 text-xs font-semibold text-slate-400 underline underline-offset-2 hover:text-slate-700"
              >
                보기
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
