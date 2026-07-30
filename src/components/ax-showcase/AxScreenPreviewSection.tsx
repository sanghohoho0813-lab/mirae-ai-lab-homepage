// 홈 2번 화면 — "이런 화면을 만들어 드립니다".
// 히어로에서 내려온 방문자가 무엇을 만들어 주는 회사인지 사진으로 먼저 확인한다.
// 업종 3개 중 하나를 고르면 그 업종의 5단계 화면과 단계별 짧은 설명만 보여준다.
// 확장 이야기(여기서 끝나지 않습니다)와 사업화 예시는 아래 15업종 쇼케이스에서 다룬다.
import { useState } from 'react'
import { AX_V2_INDUSTRIES } from '../../data/axIndustryShowcaseV2'
import AxFiveStageViewer from './AxFiveStageViewer'

const PREVIEW_SLUGS = ['manufacturing', 'wholesale-logistics', 'professional-services']
const PREVIEWS = PREVIEW_SLUGS.map((k) => AX_V2_INDUSTRIES.find((i) => i.slug === k)).filter(
  (i): i is (typeof AX_V2_INDUSTRIES)[number] => Boolean(i),
)

export default function AxScreenPreviewSection() {
  const [slug, setSlug] = useState(PREVIEWS[0]?.slug ?? 'manufacturing')
  const industry = PREVIEWS.find((i) => i.slug === slug) ?? PREVIEWS[0]

  return (
    <section id="ax-screen-preview" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(90%_100%_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="break-keep text-center text-[1.85rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.6rem]">
          이런 화면을<br className="sm:hidden" /> 만들어 드립니다.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl break-keep text-center text-[1.15rem] leading-[1.75] text-slate-300 sm:mt-8 sm:text-[1.3rem]">
          업종을 고르면 지금 하는 업무가 어떤 화면으로 바뀌는지<br className="hidden sm:block" /> 다섯 단계로 확인할 수 있습니다.
        </p>

        {/* 업종 3개 */}
        <div role="tablist" aria-label="업종 예시 선택" className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-2.5 sm:mt-12 sm:grid-cols-3">
          {PREVIEWS.map((ind) => {
            const on = ind.slug === industry.slug
            return (
              <button
                key={ind.slug}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setSlug(ind.slug)}
                className={`flex min-h-[56px] items-center justify-center gap-2 break-keep rounded-xl px-3 py-3 text-center text-[1.1rem] font-bold leading-tight transition-all ${
                  on
                    ? 'bg-teal-400 text-slate-900 shadow-lg shadow-teal-400/20'
                    : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span aria-hidden className="text-[1.25rem] leading-none">{ind.icon}</span>
                <span>{ind.displayName}</span>
              </button>
            )
          })}
        </div>

        {/* 5단계 라벨 + 사진 + 단계별 짧은 설명 */}
        <div className="mt-8 sm:mt-10">
          <AxFiveStageViewer industry={industry} />
        </div>

        <p className="mx-auto mt-10 max-w-2xl break-keep text-center text-[1.1rem] leading-[1.75] text-slate-400 sm:mt-12 sm:text-[1.16rem]">
          전체 15개 업종의 화면은 아래에서 모두 확인할 수 있습니다.
        </p>
      </div>
    </section>
  )
}
