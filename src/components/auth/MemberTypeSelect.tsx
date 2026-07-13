// 회원유형 선택 — 중소기업 대표 / 컨설턴트 (회원가입·소셜 온보딩 공용).
import type { MemberType } from '../../lib/platform'

const OPTIONS: { value: MemberType; icon: string; title: string; desc: string }[] = [
  { value: 'business', icon: '🏢', title: '중소기업 대표', desc: '정책자금·지원금·인증·홈페이지·AX 등 경영지원 서비스' },
  { value: 'consultant', icon: '🧑‍💼', title: '컨설턴트', desc: '고객 진단·제안·업무 자동화를 돕는 AI 실무 도구' },
]

export default function MemberTypeSelect({
  value,
  onChange,
}: {
  value: MemberType | null
  onChange: (v: MemberType) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`flex flex-col rounded-2xl border-2 p-4 text-left transition-colors ${
              active ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-xl">{o.icon}</span>
              <span className="text-base font-black text-slate-900">{o.title}</span>
              {active && <span aria-hidden className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-xs text-white">✓</span>}
            </span>
            <span className="mt-1.5 text-[0.85rem] leading-snug text-slate-500">{o.desc}</span>
          </button>
        )
      })}
    </div>
  )
}
