// 함께 검토하고 싶은 분야 — 목차(상황)별로 묶고, 항목 옆에 핵심 혜택 한 줄을 붙인 다중선택.
// AX Fit 결과화면 · AX Fit 상담 폼 · 일반 상담 모달이 이 컴포넌트 하나를 같이 쓴다.
// 썸네일·가격은 두지 않는다. 목차마다 번호와 색을 주어 눈으로 구분되게 하고,
// 항목 수가 많아 목차는 접어두되 고른 목차는 계속 펼쳐 둔다.
import { useState } from 'react'
import { CONSULT_INTEREST_GROUPS, CONSULT_INTEREST_NOTE, CONSULT_INTEREST_UNSURE, type ConsultInterestTone } from '../../lib/consultApi'

type Props = {
  value: string[]
  onChange: (v: string[]) => void
  /** 같은 화면에 두 번 이상 놓일 때 id 가 겹치지 않도록 */
  idPrefix?: string
}

// ⚠️ Tailwind 는 클래스 이름을 정적으로 훑으므로 문자열을 조합하지 말고 전체를 그대로 적는다.
const TONE: Record<ConsultInterestTone, { head: string; title: string; num: string; on: string; onName: string; onNote: string }> = {
  blue: {
    head: 'border-blue-200 bg-blue-50/70', title: 'text-blue-900', num: 'bg-blue-600',
    on: 'border-blue-500 bg-blue-50', onName: 'text-blue-800', onNote: 'text-blue-700/80',
  },
  sky: {
    head: 'border-sky-200 bg-sky-50/70', title: 'text-sky-900', num: 'bg-sky-600',
    on: 'border-sky-500 bg-sky-50', onName: 'text-sky-800', onNote: 'text-sky-700/80',
  },
  emerald: {
    head: 'border-emerald-200 bg-emerald-50/70', title: 'text-emerald-900', num: 'bg-emerald-600',
    on: 'border-emerald-500 bg-emerald-50', onName: 'text-emerald-800', onNote: 'text-emerald-700/80',
  },
  amber: {
    head: 'border-amber-200 bg-amber-50/70', title: 'text-amber-900', num: 'bg-amber-500',
    on: 'border-amber-500 bg-amber-50', onName: 'text-amber-800', onNote: 'text-amber-700/80',
  },
  orange: {
    head: 'border-orange-200 bg-orange-50/70', title: 'text-orange-900', num: 'bg-orange-600',
    on: 'border-orange-500 bg-orange-50', onName: 'text-orange-800', onNote: 'text-orange-700/80',
  },
  violet: {
    head: 'border-violet-200 bg-violet-50/70', title: 'text-violet-900', num: 'bg-violet-600',
    on: 'border-violet-500 bg-violet-50', onName: 'text-violet-800', onNote: 'text-violet-700/80',
  },
}

export default function InterestPicker({ value, onChange, idPrefix = 'ip' }: Props) {
  // 첫 목차만 펼쳐 두고, 고른 항목이 있는 목차는 항상 펼친다
  const [opened, setOpened] = useState<string[]>([CONSULT_INTEREST_GROUPS[0].title])

  // '아직 모르겠음' 은 구체 항목과 같이 고를 수 없다 — 서로가 서로를 해제한다
  const unsureOn = value.includes(CONSULT_INTEREST_UNSURE)

  function toggleItem(name: string) {
    if (value.includes(name)) return onChange(value.filter((x) => x !== name))
    onChange([...value.filter((x) => x !== CONSULT_INTEREST_UNSURE), name])
  }

  function toggleUnsure() {
    onChange(unsureOn ? [] : [CONSULT_INTEREST_UNSURE])
  }

  return (
    <div className="space-y-2">
      {CONSULT_INTEREST_GROUPS.map((g) => {
        const t = TONE[g.tone]
        const picked = g.items.filter((i) => value.includes(i.name)).length
        const open = opened.includes(g.title) || picked > 0
        const panelId = `${idPrefix}-g${g.no}`
        return (
          <div key={g.title} className={`overflow-hidden rounded-xl border ${t.head}`}>
            <button
              type="button"
              data-interest-group={g.title}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpened((o) => (o.includes(g.title) ? o.filter((x) => x !== g.title) : [...o, g.title]))}
              className="flex min-h-12 w-full items-start gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-black/[0.03]"
            >
              <span aria-hidden className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.78rem] font-black text-white ${t.num}`}>
                {g.no}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block break-keep text-[0.9rem] font-bold leading-snug ${t.title}`}>{g.title}</span>
                {g.hint && <span className="mt-0.5 block break-keep text-[0.78rem] font-medium leading-snug text-slate-500">({g.hint})</span>}
              </span>
              <span className="flex shrink-0 items-center gap-2 pt-0.5">
                {picked > 0 && <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-black text-white ${t.num}`}>{picked}</span>}
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
                    className={`rounded-xl border px-3.5 py-2.5 text-left transition ${on ? t.on : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <span className={`block text-[0.92rem] font-bold leading-snug ${on ? t.onName : 'text-slate-800'}`}>
                      {on ? '✓ ' : ''}
                      {it.name}
                    </span>
                    <span className={`mt-0.5 block break-keep text-[0.76rem] font-medium leading-snug ${on ? t.onNote : 'text-slate-500'}`}>
                      {it.note}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      {/* 목차 밖 — 아직 고르기 어려우면 이것만 */}
      <button
        type="button"
        data-interest={CONSULT_INTEREST_UNSURE}
        aria-pressed={unsureOn}
        onClick={toggleUnsure}
        className={`flex min-h-12 w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition ${
          unsureOn ? 'border-slate-500 bg-slate-100' : 'border-slate-200 bg-white hover:bg-slate-50'
        }`}
      >
        <span
          aria-hidden
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.78rem] font-black ${
            unsureOn ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400'
          }`}
        >
          ?
        </span>
        <span className="min-w-0">
          <span className={`block text-[0.92rem] font-bold leading-snug ${unsureOn ? 'text-slate-900' : 'text-slate-800'}`}>
            {unsureOn ? '✓ ' : ''}
            {CONSULT_INTEREST_UNSURE}
          </span>
          <span className="mt-0.5 block break-keep text-[0.76rem] font-medium leading-snug text-slate-500">
            필요한 건 상담에서 함께 찾아 드려요
          </span>
        </span>
      </button>

      <p className="pt-0.5 text-[0.78rem] leading-relaxed text-slate-500">{CONSULT_INTEREST_NOTE}</p>
    </div>
  )
}
