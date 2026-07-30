// 자금 이후 성장 로드맵 — 홈에서 정책자금 상세페이지로 옮겨온 영역.
// 드로어의 /business-services/funding-consulting#module-* 링크가 가리키는 앵커를 여기서 제공한다.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { businessPackages, type ModuleGroup } from '../../data/businessPackages'

const LIFECYCLE = [
  { icon: '💰', t: '자금조달' },
  { icon: '👥', t: '고용지원금과 조직' },
  { icon: '🏅', t: '벤처·연구소·메인비즈·이노비즈·ISO' },
  { icon: '🎁', t: '복지기금과 기업제도' },
  { icon: '🧮', t: '전문가와 함께하는 세무·절세전략' },
  { icon: '⚙️', t: 'AX 업무시스템 고도화' },
]

const GROWTH_MODULES: { id: string; no: string; title: string; group: ModuleGroup; accent: string }[] = [
  { id: 'module-innovation', no: '01', title: '기술·혁신 기반', group: 'tech', accent: 'text-violet-600' },
  { id: 'module-trust', no: '02', title: '경영·대외 신뢰', group: 'trust', accent: 'text-blue-600' },
  { id: 'module-digital', no: '03', title: '디지털 실행', group: 'digital', accent: 'text-teal-600' },
  { id: 'module-finance', no: '04', title: '재무·전문가 연계', group: 'finance', accent: 'text-slate-500' },
]

const MODULE_MEMBERS: Record<ModuleGroup, { slug: string; name: string }[]> = (
  ['tech', 'trust', 'digital', 'finance'] as ModuleGroup[]
).reduce(
  (acc, g) => {
    acc[g] = businessPackages.filter((p) => p.moduleGroup === g).map((p) => ({ slug: p.slug, name: p.name }))
    return acc
  },
  {} as Record<ModuleGroup, { slug: string; name: string }[]>,
)

function ModuleGroupCard({ m, defaultOpen }: { m: (typeof GROWTH_MODULES)[number]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  // min-w-0 — 상품명이 긴 링크(truncate) 때문에 그리드 칸보다 카드가 넓어지지 않게 한다
  return (
    <div id={m.id} className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-4 text-left lg:pointer-events-none"
      >
        <span className="flex items-center gap-2">
          <span className={`text-[1.29rem] sm:text-[1.17rem] font-black tabular-nums ${m.accent}`}>{m.no}</span>
          <span className="text-[1.45rem] sm:text-[1.32rem] font-black leading-snug text-slate-900">{m.title}</span>
        </span>
        <span aria-hidden className={`text-slate-400 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`${open ? 'block' : 'hidden'} border-t border-slate-100 px-2 pb-2 lg:block`}>
        <ul className="space-y-0.5 pt-1">
          {MODULE_MEMBERS[m.group].map((mp) => (
            <li key={mp.slug}>
              <Link
                to={`/business-services/${mp.slug}`}
                className="group -mx-0.5 flex items-center justify-between gap-2 rounded-lg px-2.5 py-2.5 text-[1.24rem] sm:text-[1.13rem] font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <span className="min-w-0 truncate">{mp.name}</span>
                <span aria-hidden className="shrink-0 text-slate-300 transition-colors group-hover:text-blue-500">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function AxLifecycleModules() {
  const [allOpen, setAllOpen] = useState(false)
  return (
    <div>
      {/* 320px급 화면에서는 한 줄에 하나 — 두 개씩 넣으면 항목명이 가로로 삐져나온다 */}
      <ol className="mt-6 flex flex-wrap gap-2">
        {LIFECYCLE.map((a, i) => (
          <li
            key={a.t}
            className="flex min-w-0 flex-1 basis-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 min-[360px]:basis-[calc(50%-0.25rem)] sm:basis-[calc(33.333%-0.34rem)]"
          >
            <span aria-hidden className="text-[1.58rem] sm:text-[1.44rem]">{a.icon}</span>
            <span className="min-w-0">
              <span className="block text-[1.13rem] sm:text-[1.03rem] font-black text-slate-400">STEP {i + 1}</span>
              <span className="block break-keep text-[1.26rem] sm:text-[1.15rem] font-bold leading-tight text-slate-800">{a.t}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 break-keep text-[1.26rem] sm:text-[1.15rem] leading-relaxed text-slate-500">
        모든 서비스를 한꺼번에 권하지 않습니다. 지금 회사에 가장 필요한 순서부터 하나씩 설계합니다.
      </p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {GROWTH_MODULES.map((m, i) => (
          <ModuleGroupCard key={m.id} m={m} defaultOpen={i === 0} />
        ))}
      </div>
      {/* 네 그룹으로 나눠 보는 것과 별개로, 지금 가능한 컨설팅을 한 화면에서 전부 보고 싶은 경우 */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setAllOpen((v) => !v)}
          aria-expanded={allOpen}
          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[1.26rem] sm:text-[1.15rem] font-black text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          우리 회사에 맞는 컨설팅 상품 한눈에 보기 <span aria-hidden>{allOpen ? '↑' : '↓'}</span>
        </button>
      </div>

      {allOpen && (
        <div id="all-modules" className="mt-6 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[1.32rem] sm:text-[1.2rem] font-black text-slate-900">지금 진행 가능한 컨설팅 전체</p>
          <p className="mt-2 break-keep text-[1.17rem] sm:text-[1.06rem] leading-relaxed text-slate-500">
            모두 진행해야 하는 것이 아닙니다. 진단 후 지금 필요한 것부터 순서를 잡습니다.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {GROWTH_MODULES.map((m) => (
              <div key={m.id} className="min-w-0">
                <p className={`text-[1.2rem] sm:text-[1.09rem] font-black ${m.accent}`}>{m.title}</p>
                <ul className="mt-2 space-y-1">
                  {MODULE_MEMBERS[m.group].map((mp) => (
                    <li key={mp.slug}>
                      <Link
                        to={`/business-services/${mp.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-[1.17rem] sm:text-[1.06rem] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
                      >
                        <span className="min-w-0 truncate">{mp.name}</span>
                        <span aria-hidden className="shrink-0 text-slate-300">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            to="/business-diagnosis"
            className="mt-6 flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-[1.23rem] sm:text-[1.12rem] font-black text-white transition-colors hover:bg-blue-400"
          >
            <span aria-hidden>🩺</span> 우리 회사에 맞는 순서 진단받기
          </Link>
        </div>
      )}
    </div>
  )
}
