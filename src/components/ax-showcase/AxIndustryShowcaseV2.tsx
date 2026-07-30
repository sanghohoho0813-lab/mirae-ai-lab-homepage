// 15개 업종 AX 쇼케이스 — 홈의 중심 섹션.
// 한 번에 한 업종만 크게 보여준다. 다른 업종 이미지는 DOM에 렌더링하지 않는다.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AX_V2_DEFAULT_SLUG,
  AX_V2_DISCLAIMER,
  AX_V2_INDUSTRIES,
  AX_V2_TASK_VIEWS,
  axV2Industry,
} from '../../data/axIndustryShowcaseV2'
import { readAxSelection, saveAxSelection } from '../../lib/axShowcaseState'
import { saveBusinessReturn } from '../../lib/businessServicesReturn'
import AxBusinessExpansion from './AxBusinessExpansion'
import AxBusinessIdeaCard from './AxBusinessIdeaCard'
import AxFiveStageViewer from './AxFiveStageViewer'
import AxIndustryModeToggle, { type AxViewMode } from './AxIndustryModeToggle'
import AxIndustrySelector from './AxIndustrySelector'
import AxTaskSelector from './AxTaskSelector'

export default function AxIndustryShowcaseV2({
  /** 상세페이지에서 ?industry=... 로 넘어온 업종을 처음부터 선택해 둔다 */
  initialSlug,
  externalSlug,
  /** 상세페이지에서는 '더 알아보기'가 자기 자신을 가리키므로 숨긴다 */
  showIdeaDetailLink = true,
  /** 상세페이지에서는 업종 상세로 다시 나가는 링크를 숨긴다 */
  showIndustryDetailLink = true,
}: {
  initialSlug?: string
  /** 히어로의 업종 예시를 눌렀을 때 바깥에서 선택을 밀어넣는다 */
  externalSlug?: string
  showIdeaDetailLink?: boolean
  showIndustryDetailLink?: boolean
} = {}) {
  const restored = useMemo(() => readAxSelection(), [])
  const [mode, setMode] = useState<AxViewMode>(initialSlug ? 'industry' : (restored?.mode ?? 'industry'))
  const [slug, setSlug] = useState(initialSlug ?? restored?.slug ?? AX_V2_DEFAULT_SLUG)
  const [taskKey, setTaskKey] = useState(restored?.taskKey ?? AX_V2_TASK_VIEWS[0].key)

  const industry = axV2Industry(slug) ?? AX_V2_INDUSTRIES[0]

  useEffect(() => {
    if (externalSlug) setSlug(externalSlug)
  }, [externalSlug])

  // 홈에서 고른 업종만 세션에 남긴다. 상세페이지 진입은 홈의 선택을 덮어쓰지 않는다.
  useEffect(() => {
    if (initialSlug) return
    saveAxSelection({ mode, slug: industry.slug, taskKey })
  }, [initialSlug, mode, industry.slug, taskKey])

  return (
    <section id="ax-showcase-v2" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(90%_100%_at_25%_0%,rgba(45,212,191,0.13),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="break-keep text-center text-[2.04rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.6rem]">
          우리 업종이 AX로 바뀌면<br className="hidden sm:block" /> 무엇이 달라지는지 <span className="text-teal-300">직접 확인해보세요.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl break-keep text-center text-[1.32rem] leading-[1.75] text-slate-300 sm:text-[1.36rem]">
          15개 업종 중 하나를 선택하면 현재 업무가 달라지는 5단계와<br className="hidden sm:block" /> 새로운 매출로 확장할 사업화 아이디어를 확인할 수 있습니다.
        </p>

        <div className="mt-12">
          <AxIndustryModeToggle value={mode} onChange={setMode} />
        </div>

        <div className="mt-4">
          {mode === 'industry' ? (
            <AxIndustrySelector value={industry.slug} onChange={setSlug} />
          ) : (
            <AxTaskSelector
              value={taskKey}
              onChange={setTaskKey}
              onPickIndustry={(s) => {
                setSlug(s)
                setMode('industry')
              }}
            />
          )}
        </div>

        {/* 선택한 업종 하나만 크게 */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {initialSlug && (
              <span className="rounded-md bg-amber-400/15 px-2.5 py-1 text-[1.13rem] sm:text-[1.03rem] font-black text-amber-200 ring-1 ring-inset ring-amber-400/30">
                선택한 업종 · {industry.displayName}
              </span>
            )}
            <span aria-hidden className="text-[1.65rem] sm:text-[1.5rem] leading-none">{industry.icon}</span>
            <h3 className="text-[1.45rem] font-black text-white sm:text-[1.5rem]">{industry.displayName}</h3>
            <span className="rounded-md bg-white/8 px-2 py-0.5 text-[1.1rem] sm:text-[1.0rem] font-bold text-slate-300 ring-1 ring-inset ring-white/15">
              화면 5장
            </span>
          </div>
          <p className="mt-2 max-w-3xl break-keep text-[1.2rem] leading-relaxed text-slate-300 sm:text-[1.15rem]">{industry.overview}</p>

          <div className="mt-4">
            <AxFiveStageViewer industry={industry} />
          </div>

          {/* 5번째 이미지 뒤 — 확장 구간과 사업화 예시를 한 박스로 묶어 이어 읽히게 한다 */}
          <div className="mt-5 rounded-3xl border border-amber-400/25 bg-gradient-to-b from-amber-400/[0.09] to-transparent p-4 sm:p-5">
            <AxBusinessExpansion industryName={industry.displayName} inBox />
            <div className="mt-5 grid gap-3 border-t border-amber-400/20 pt-5 lg:grid-cols-2">
              {industry.ideas.map((idea) => (
                <AxBusinessIdeaCard key={idea.no} idea={idea} industryName={industry.displayName} industrySlug={industry.slug} showDetailLink={showIdeaDetailLink} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {showIndustryDetailLink && (
            <Link
              to={`/ax-industries/${industry.slug}`}
              // 뒤로가기로 돌아왔을 때 스크롤 위치까지 복원되도록 현재 위치를 남긴다.
              // 선택한 업종·보기 모드는 sessionStorage(axShowcaseState)에서 이미 복원된다.
              onClick={() => saveBusinessReturn(`ax-industry:${industry.slug}`)}
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl border border-teal-400/30 bg-teal-400/10 px-4 text-[1.2rem] sm:text-[1.09rem] font-bold text-teal-200 transition-colors hover:bg-teal-400/20 hover:text-teal-100"
            >
              {industry.displayName} 상세 보기 <span aria-hidden>→</span>
            </Link>
            )}
            <Link
              to="/business-diagnosis"
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-blue-500 px-4 text-[1.2rem] sm:text-[1.09rem] font-black text-white transition-colors hover:bg-blue-400"
            >
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
          </div>
        </div>

        <p className="mt-6 break-keep text-[1.1rem] sm:text-[1.0rem] leading-relaxed text-slate-500">{AX_V2_DISCLAIMER}</p>
      </div>
    </section>
  )
}
