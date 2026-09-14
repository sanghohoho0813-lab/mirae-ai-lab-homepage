// 함께 검토하고 싶은 분야 — 목차(상황)별로 묶고, 항목 옆에 핵심 혜택 한 줄을 붙인 다중선택.
// AX Fit 결과화면 · AX Fit 상담 폼 · 일반 상담 모달이 이 컴포넌트 하나를 같이 쓴다.
// 썸네일·가격은 두지 않는다. 항목 수가 많아 목차는 접어두고, 고른 개수를 머리글에 보여준다.
import { useState } from 'react'
import { CONSULT_INTEREST_GROUPS, CONSULT_INTEREST_NOTE } from '../../lib/consultApi'

type Props = {
  value: string[]
  onChange: (v: string[]) => void
  /** 같은 화면에 두 번 이상 놓일 때 id 가 겹치지 않도록 */
  idPrefix?: string
}

export default function InterestPicker({ value, onChange, idPrefix = 'ip' }: Props) {
  // 첫 목차만 펼쳐 두고, 고른 항목이 있는 목차는 항상 펼친다
  const [opened, setOpened] = useState<string[]>([CONSULT_INTEREST_GROUPS[0].title])

  function toggleItem(name: string) {
    onChange(value.includes(name) ? value.filter((x) => x !== name) : [...value, name])
  }

  return (
    <div className="space-y-2">
      {CONSULT_INTEREST_GROUPS.map((g) => {
        const picked = g.items.filter((i) => value.includes(i.name)).length
        const open = opened.includes(g.title) || picked > 0
        const panelId = `${idPrefix}-${g.title.replace(/[^가-힣A-Za-z0-9]/g, '')}`
        return (
          <div key={g.title} className="overflow-hidden rounded-xl border border-slate-200">
            <button
              type="button"
              data-interest-group={g.title}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpened((o) => (o.includes(g.title) ? o.filter((x) => x !== g.title) : [...o, g.title]))}
              className="flex min-h-12 w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
            >
              <span className="min-w-0 text-[0.9rem] font-bold leading-snug text-slate-800">{g.title}</span>
              <span className="flex shrink-0 items-center gap-2">
                {picked > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[0.7rem] font-black text-white">{picked}</span>
                )}
                <span aria-hidden className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
              </span>
            </button>
            <div id={panelId} hidden={!open} className="grid gap-1.5 bg-white p-2.5 sm:grid-cols-2">
              {g.items.map((it) => {
                const on = value.includes(it.name)
                return (
                  <button
                    key={it.name}
                    type="button"
                    data-interest={it.name}
                    aria-pressed={on}
                    onClick={() => toggleItem(it.name)}
                    className={`rounded-xl border px-3.5 py-2.5 text-left transition ${
                      on ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className={`block text-[0.92rem] font-bold leading-snug ${on ? 'text-blue-700' : 'text-slate-800'}`}>
                      {on ? '✓ ' : ''}
                      {it.name}
                    </span>
                    <span className={`mt-0.5 block break-keep text-[0.76rem] font-medium leading-snug ${on ? 'text-blue-600/90' : 'text-slate-500'}`}>
                      {it.note}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <p className="pt-0.5 text-[0.72rem] leading-relaxed text-slate-400">{CONSULT_INTEREST_NOTE}</p>
    </div>
  )
}
