// 사업화 AX 활용 예시 카드 — 홈에서는 제목·핵심설명·매출태그만, 상세는 펼쳐서 전부.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AxV2Idea } from '../../data/axIndustryShowcaseV2'
import { saveBusinessReturn } from '../../lib/businessServicesReturn'

export default function AxBusinessIdeaCard({
  idea,
  industryName,
  industrySlug,
  /** compact: 홈용(접힘 시작) / full: 상세용(펼침 시작) */
  variant = 'compact',
  /** 상세페이지 안에서는 '더 알아보기'가 같은 페이지를 다시 가리키므로 숨긴다 */
  showDetailLink = true,
}: {
  idea: AxV2Idea
  industryName: string
  industrySlug: string
  variant?: 'compact' | 'full'
  showDetailLink?: boolean
}) {
  const [open, setOpen] = useState(variant === 'full')

  return (
    <article className="flex flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
      <p className="text-[1.0rem] font-black tracking-tight text-amber-300">사업화 AX 활용 예시 {idea.no}</p>
      <h4 className="mt-1.5 break-keep text-[1.26rem] font-black leading-snug text-white sm:text-[1.44rem]">{idea.name}</h4>
      <p className="mt-2 break-keep text-[1.06rem] leading-relaxed text-slate-300 sm:text-[1.13rem]">{idea.problem}</p>

      {/* 새로운 매출구조 — 접힘 상태에서도 보인다 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {idea.revenues.map((r) => (
          <span key={r} className="break-keep rounded-lg bg-amber-400/12 px-2.5 py-1 text-[1.0rem] font-bold text-amber-200 ring-1 ring-inset ring-amber-400/25">
            {r}
          </span>
        ))}
      </div>

      {open && (
        <div className="mt-4 space-y-3.5 border-t border-white/10 pt-4">
          <div>
            <p className="text-[1.0rem] font-black text-teal-300">적용 후 할 수 있는 일</p>
            <ul className="mt-1.5 space-y-1">
              {idea.actions.map((a) => (
                <li key={a} className="flex gap-2 break-keep text-[1.03rem] leading-relaxed text-slate-300">
                  <span aria-hidden className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <p className="break-keep rounded-lg bg-teal-400/10 px-3 py-2 text-[1.0rem] font-bold leading-snug text-teal-200 ring-1 ring-inset ring-teal-400/20">
            정책자금 설명 포인트 · {idea.policyPoint}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {idea.tags.map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[1.0rem] font-semibold text-slate-400 ring-1 ring-inset ring-white/10">#{t}</span>
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
            className="min-h-[40px] rounded-lg border border-white/20 bg-white/5 px-3 text-[1.0rem] font-bold text-white transition-colors hover:bg-white/10"
          >
            {open ? '접기' : '자세히 보기'}
          </button>
        )}
        {showDetailLink && (
          <Link
            // 진단·상담이 아니라 정책자금 상세페이지로 보낸다. 선택한 업종은 query 로 전달한다.
            to={`/business-services/funding-consulting?industry=${industrySlug}#ax-application`}
            onClick={() => saveBusinessReturn(`ax-idea:${industrySlug}`)}
            className="inline-flex min-h-[46px] items-center gap-1.5 rounded-lg bg-blue-500 px-4 text-[1.13rem] font-black text-white transition-colors hover:bg-blue-400"
          >
            더 알아보기 <span aria-hidden>→</span>
          </Link>
        )}
        <span className="sr-only">{industryName} 업종 사업화 예시</span>
      </div>
    </article>
  )
}
