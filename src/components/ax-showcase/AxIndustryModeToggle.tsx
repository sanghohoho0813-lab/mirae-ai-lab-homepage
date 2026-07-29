// 보기 모드 — 업종별 / 업무별.
export type AxViewMode = 'industry' | 'task'

export default function AxIndustryModeToggle({ value, onChange }: { value: AxViewMode; onChange: (v: AxViewMode) => void }) {
  const tabs: { key: AxViewMode; label: string; hint: string }[] = [
    { key: 'industry', label: '업종별 보기', hint: '우리 업종부터 찾기' },
    { key: 'task', label: '업무별 보기', hint: '바꾸고 싶은 업무부터 찾기' },
  ]
  return (
    <div role="tablist" aria-label="쇼케이스 보기 방식" className="flex gap-1 rounded-2xl bg-white/5 p-1 ring-1 ring-inset ring-white/10">
      {tabs.map((t) => {
        const on = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.key)}
            className={`min-h-[48px] flex-1 break-keep rounded-xl px-3 py-2 text-center transition-colors ${
              on ? 'bg-teal-400 text-slate-900' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="block text-[0.95rem] font-black leading-tight">{t.label}</span>
            <span className={`mt-0.5 block text-[0.8rem] leading-tight ${on ? 'text-slate-700' : 'text-slate-500'}`}>{t.hint}</span>
          </button>
        )
      })}
    </div>
  )
}
