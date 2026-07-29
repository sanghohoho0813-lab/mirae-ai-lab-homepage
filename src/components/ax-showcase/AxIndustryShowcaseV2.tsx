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
import AxBusinessExpansion from './AxBusinessExpansion'
import AxBusinessIdeaCard from './AxBusinessIdeaCard'
import AxFiveStageViewer from './AxFiveStageViewer'
import AxIndustryModeToggle, { type AxViewMode } from './AxIndustryModeToggle'
import AxIndustrySelector from './AxIndustrySelector'
import AxTaskSelector from './AxTaskSelector'

export default function AxIndustryShowcaseV2() {
  const restored = useMemo(() => readAxSelection(), [])
  const [mode, setMode] = useState<AxViewMode>(restored?.mode ?? 'industry')
  const [slug, setSlug] = useState(restored?.slug ?? AX_V2_DEFAULT_SLUG)
  const [taskKey, setTaskKey] = useState(restored?.taskKey ?? AX_V2_TASK_VIEWS[0].key)

  const industry = axV2Industry(slug) ?? AX_V2_INDUSTRIES[0]

  useEffect(() => {
    saveAxSelection({ mode, slug: industry.slug, taskKey })
  }, [mode, industry.slug, taskKey])

  return (
    <section id="ax-showcase-v2" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(90%_100%_at_25%_0%,rgba(45,212,191,0.13),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
        <h2 className="break-keep text-[1.6rem] font-black leading-tight text-white sm:text-[2.25rem]">
          우리 업종이 AX로 바뀌면<br className="hidden sm:block" /> 무엇이 달라지는지 <span className="text-teal-300">직접 확인해보세요.</span>
        </h2>
        <p className="mt-3 max-w-3xl break-keep text-[1rem] leading-relaxed text-slate-300 sm:text-[1.08rem]">
          먼저 현재 업무가 어떻게 달라지는지 보고, 그다음 새로운 앱·웹 서비스와 반복매출로 확장되는 과정을 확인할 수 있습니다.
        </p>

        <div className="mt-6">
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
            <span aria-hidden className="text-[1.3rem] leading-none">{industry.icon}</span>
            <h3 className="text-[1.15rem] font-black text-white sm:text-[1.3rem]">{industry.displayName}</h3>
            <span className="rounded-md bg-white/8 px-2 py-0.5 text-[0.82rem] font-bold text-slate-300 ring-1 ring-inset ring-white/15">
              화면 5장
            </span>
          </div>
          <p className="mt-2 max-w-3xl break-keep text-[0.95rem] leading-relaxed text-slate-300 sm:text-[1rem]">{industry.overview}</p>

          <div className="mt-4">
            <AxFiveStageViewer industry={industry} />
          </div>

          {/* 5번째 이미지 뒤 — 확장 구간 */}
          <div className="mt-5">
            <AxBusinessExpansion industryName={industry.displayName} />
          </div>

          {/* 사업화 예시 2개 */}
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {industry.ideas.map((idea) => (
              <AxBusinessIdeaCard key={idea.no} idea={idea} industryName={industry.displayName} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              to={`/ax-industries/${industry.slug}`}
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl border border-teal-400/30 bg-teal-400/10 px-4 text-[0.95rem] font-bold text-teal-200 transition-colors hover:bg-teal-400/20 hover:text-teal-100"
            >
              {industry.displayName} 상세 보기 <span aria-hidden>→</span>
            </Link>
            <Link
              to="/business-diagnosis"
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-blue-500 px-4 text-[0.95rem] font-black text-white transition-colors hover:bg-blue-400"
            >
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
          </div>
        </div>

        <p className="mt-6 break-keep text-[0.85rem] leading-relaxed text-slate-500">{AX_V2_DISCLAIMER}</p>
      </div>
    </section>
  )
}
