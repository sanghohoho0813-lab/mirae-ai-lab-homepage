// SECTION #ax-showcase — 카테고리 선택형 단일 뷰어(바둑판 그리드 없음).
// 업종 pill 하나 선택 → 그 업종 1세트만 크게 노출 → 통합/관리자·PC/현장·모바일 3탭 전환 → 크게 보기(PhotoSwipe).
// PC·모바일이 같은 정보구조·같은 동작. 한 번에 하나만 크게 본다.
import { useState } from 'react'
import {
  AX_SHOWCASE_CATALOG,
  type ScreenTypeKey,
  type ShowcaseCatalogEntry,
  type ShowcaseImg,
} from '../../data/axShowcase'
import { SectionHead } from './axFrames'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'

// 3개 보기 탭 → 실제 이미지 키 후보
const TABS = [
  { key: 'integrated', label: '통합', imgKeys: ['integrated'] as ScreenTypeKey[] },
  { key: 'pc', label: '관리자·PC', imgKeys: ['desktop', 'admin'] as ScreenTypeKey[] },
  { key: 'mobile', label: '현장·모바일', imgKeys: ['mobile', 'field'] as ScreenTypeKey[] },
] as const
type TabKey = (typeof TABS)[number]['key']

const SLIDE_ORDER: ScreenTypeKey[] = ['integrated', 'desktop', 'admin', 'mobile', 'field']
const SCREEN_LABEL: Record<ScreenTypeKey, string> = {
  integrated: '통합 화면',
  desktop: '관리자·PC',
  admin: '관리자·PC',
  mobile: '현장·모바일',
  field: '현장·모바일',
}

// 카테고리별 대표 1세트(첫 엔트리)만 노출 — "한 번에 하나만 크게 보기"
const CATEGORY_SET: ShowcaseCatalogEntry[] = (() => {
  const seen = new Set<string>()
  const out: ShowcaseCatalogEntry[] = []
  for (const e of AX_SHOWCASE_CATALOG) {
    if (seen.has(e.category)) continue
    seen.add(e.category)
    out.push(e)
  }
  return out
})()

function buildSlides(entry: ShowcaseCatalogEntry): { keys: ScreenTypeKey[]; slides: AxPswpSlide[] } {
  const keys = SLIDE_ORDER.filter((k) => entry.images[k])
  const mid = entry.brandName ? `${entry.brandName} · ${entry.category}` : entry.category
  const slides = keys.map((k) => {
    const img = entry.images[k]!
    return { src: img.src, width: img.w, height: img.h, alt: img.alt, caption: `${mid} · ${SCREEN_LABEL[k]}` }
  })
  return { keys, slides }
}

function ViewerImg({ img }: { img: ShowcaseImg }) {
  return (
    <img
      src={img.src}
      srcSet={`${img.srcSm} 960w, ${img.src} ${img.w}w`}
      sizes="(min-width:1024px) 760px, 92vw"
      alt={img.alt}
      width={img.w}
      height={img.h}
      loading="lazy"
      decoding="async"
      className="max-h-[280px] w-auto object-contain sm:max-h-[360px] lg:max-h-[440px]"
    />
  )
}

export default function AxIndustryShowcase() {
  const [catIdx, setCatIdx] = useState(0)
  const [tab, setTab] = useState<TabKey>('integrated')
  const [pswpOpen, setPswpOpen] = useState(false)
  const [pswpSlides, setPswpSlides] = useState<AxPswpSlide[]>([])
  const [pswpIndex, setPswpIndex] = useState(0)

  const entry = CATEGORY_SET[catIdx] ?? CATEGORY_SET[0]
  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0]
  const resolvedKey: ScreenTypeKey = activeTab.imgKeys.find((k) => entry.images[k]) ?? 'integrated'
  const img = entry.images[resolvedKey] ?? entry.images.integrated!

  const selectCat = (i: number) => {
    setCatIdx(i)
    setTab('integrated')
  }

  const openFullscreen = () => {
    const { keys, slides } = buildSlides(entry)
    setPswpSlides(slides)
    setPswpIndex(Math.max(0, keys.indexOf(resolvedKey)))
    setPswpOpen(true)
  }

  return (
    <section id="ax-showcase" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-12">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>업종을 선택하면 <span className="text-teal-300">그 업종의 실제 AX 화면</span>을 보여드립니다.</>}
          desc="한 업종씩, 통합·관리자·현장 화면을 확인하세요."
        />

        {/* 업종 pill — 가로 스크롤(PC·모바일 동일) */}
        <div
          className="mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none' }}
          role="tablist"
          aria-label="업종 선택"
        >
          {CATEGORY_SET.map((e, i) => {
            const on = i === catIdx
            return (
              <button
                key={e.category}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => selectCat(i)}
                className={`min-h-[40px] shrink-0 rounded-full px-4 text-[0.85rem] font-bold transition-colors ${
                  on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'
                }`}
              >
                {e.category}
              </button>
            )
          })}
        </div>

        {/* 단일 뷰어 — 선택한 업종 1세트만 */}
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {entry.brandName && (
              <p className="text-[0.72rem] font-black uppercase tracking-widest text-teal-300">{entry.brandName}</p>
            )}
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[0.72rem] font-bold text-slate-300 ring-1 ring-inset ring-white/10">
              {entry.category}
            </span>
          </div>
          <h3 className="mt-1.5 text-[1.3rem] font-black leading-tight text-white sm:text-[1.55rem]">{entry.solutionName}</h3>
          <p className="mt-2 line-clamp-2 max-w-2xl text-[0.9rem] leading-relaxed text-slate-300 sm:text-[0.95rem]">{entry.description}</p>

          {/* 3개 보기 탭 */}
          <div role="tablist" aria-label="화면 유형" className="mt-4 flex rounded-xl bg-white/5 p-1 sm:max-w-md">
            {TABS.map((t) => {
              const available = t.imgKeys.some((k) => entry.images[k])
              const on = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  disabled={!available}
                  title={available ? undefined : '준비된 화면 없음'}
                  onClick={() => available && setTab(t.key)}
                  className={`min-h-[44px] flex-1 rounded-lg px-2 text-[0.82rem] font-black transition-colors ${
                    on ? 'bg-teal-400 text-slate-900' : available ? 'text-slate-300 hover:text-white' : 'cursor-not-allowed text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* 큰 이미지 — 탭하면 크게 보기 */}
          <button
            type="button"
            onClick={openFullscreen}
            aria-label={`${entry.solutionName} ${activeTab.label} 화면 크게 보기`}
            className="mt-4 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2"
          >
            <ViewerImg img={img} />
          </button>

          {/* 단일 액션 */}
          <button
            type="button"
            onClick={openFullscreen}
            className="mx-auto mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 text-[0.9rem] font-bold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20 sm:w-auto sm:px-8"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
            </svg>
            전체 화면으로 크게 보기
          </button>
        </div>

        <p className="mt-4 text-[0.78rem] leading-relaxed text-slate-500">
          가상 업종 시나리오로 제작한 프로토타입 화면입니다. 상호·수치는 시연용 예시이며, 기업별 업무분석 후 실제 작동형 MVP로 확장합니다.
        </p>
      </div>

      <AxPhotoSwipe open={pswpOpen} slides={pswpSlides} index={pswpIndex} onClose={() => setPswpOpen(false)} />
    </section>
  )
}
