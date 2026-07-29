// 사업화 AX 활용 예시 카드 — 홈에서는 제목·핵심설명·매출태그만, 상세는 펼쳐서 전부.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AxV2Idea } from '../../data/axIndustryShowcaseV2'

export default function AxBusinessIdeaCard({
  idea,
  industryName,
  /** compact: 홈용(접힘 시작) / full: 상세용(펼침 시작) */
  variant = 'compact',
}: {
  idea: AxV2Idea
  industryName: string
  variant?: 'compact' | 'full'
}) {
  const [open, setOpen] = useState(variant === 'full')

  return (
    <article className="flex flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
      <p className="text-[0.8rem] font-black uppercase tracking-widest text-amber-300">사업화 AX 활용 예시 {idea.no}</p>
      <h4 className="mt-1.5 break-keep text-[1.1rem] font-black leading-snug text-white sm:text-[1.25rem]">{idea.name}</h4>
      <p className="mt-2 break-keep text-[0.92rem] leading-relaxed text-slate-300 sm:text-[0.98rem]">{idea.problem}</p>

      {/* 새로운 매출구조 — 접힘 상태에서도 보인다 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {idea.revenues.map((r) => (
          <span key={r} className="break-keep rounded-lg bg-amber-400/12 px-2.5 py-1 text-[0.82rem] font-bold text-amber-200 ring-1 ring-inset ring-amber-400/25">
            {r}
          </span>
        ))}
      </div>

      {open && (
        <div className="mt-4 space-y-3.5 border-t border-white/10 pt-4">
          <div>
            <p className="text-[0.82rem] font-black text-teal-300">적용 후 할 수 있는 일</p>
            <ul className="mt-1.5 space-y-1">
              {idea.actions.map((a) => (
                <li key={a} className="flex gap-2 break-keep text-[0.9rem] leading-relaxed text-slate-300">
                  <span aria-hidden className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <p className="break-keep rounded-lg bg-teal-400/10 px-3 py-2 text-[0.85rem] font-bold leading-snug text-teal-200 ring-1 ring-inset ring-teal-400/20">
            정책자금 설명 포인트 · {idea.policyPoint}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {idea.tags.map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[0.82rem] font-semibold text-slate-400 ring-1 ring-inset ring-white/10">#{t}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {variant === 'compact' && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="min-h-[40px] rounded-lg border border-white/20 bg-white/5 px-3 text-[0.85rem] font-bold text-white transition-colors hover:bg-white/10"
          >
            {open ? '접기' : '자세히 보기'}
          </button>
        )}
        <Link
          to="/business-diagnosis"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-blue-500 px-3.5 text-[0.85rem] font-black text-white transition-colors hover:bg-blue-400"
        >
          우리 회사에 적용해보기 <span aria-hidden>→</span>
        </Link>
        <span className="sr-only">{industryName} 업종 사업화 예시</span>
      </div>
    </article>
  )
}
