// SECTION #ax-showcase — 업종 선택형 peek 캐러셀 단일 뷰어.
// 업종 pill(이모지) 선택 또는 좌우 스와이프 → 가운데 업종 1세트를 크게, 양옆 업종은 살짝 겹쳐 보이게.
// 선택된 업종 안에서만 통합/관리자·PC/현장·모바일 3탭 전환 → 크게 보기(PhotoSwipe).
// PC·모바일이 같은 정보구조·같은 동작. 바둑판 그리드 없음. 자동 이동 없음(사용자가 직접 이동).
import { useEffect, useRef, useState } from 'react'
import {
  AX_SHOWCASE_CATALOG,
  type ScreenTypeKey,
  type ShowcaseCatalogEntry,
  type ShowcaseImg,
} from '../../data/axShowcase'
import { SectionHead } from './axFrames'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'

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

// 업종별 이모지(카테고리명 기준)
const CAT_EMOJI: Record<string, string> = {
  '숙박·호텔': '🏨',
  '자동차 정비': '🚘',
  '시설관리': '🏢',
  '건설·현장': '🏗️',
  '생산·제조': '🏭',
  '물류·유통': '🚚',
  '연구소·R&D': '🔬',
  'B2B·영업': '🤝',
  '예약·CRM': '📅',
  '고객서비스': '🎧',
  '기업운영': '⚙️',
  '임대·건물관리': '🏠',
  '외식·프랜차이즈': '🍽️',
}

// 카테고리별 대표 1세트(첫 엔트리)만 노출
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
      sizes="(min-width:1024px) 620px, 84vw"
      alt={img.alt}
      width={img.w}
      height={img.h}
      loading="lazy"
      decoding="async"
      className="max-h-[240px] w-auto object-contain sm:max-h-[320px] lg:max-h-[360px]"
    />
  )
}

// 한 업종 뷰어 카드(활성 카드만 탭·버튼 동작, 비활성은 미리보기)
function ViewerCard({
  entry,
  active,
  onActivate,
  onOpen,
}: {
  entry: ShowcaseCatalogEntry
  active: boolean
  onActivate: () => void
  onOpen: (entry: ShowcaseCatalogEntry, key: ScreenTypeKey) => void
}) {
  const [tab, setTab] = useState<TabKey>('integrated')
  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0]
  const resolvedKey: ScreenTypeKey = activeTab.imgKeys.find((k) => entry.images[k]) ?? 'integrated'
  const img = entry.images[resolvedKey] ?? entry.images.integrated!

  return (
    <div
      className={`w-[84vw] max-w-[600px] shrink-0 snap-center rounded-3xl border p-4 transition-all duration-300 sm:p-6 ${
        active ? 'border-white/15 bg-white/[0.05] opacity-100' : 'scale-[0.94] cursor-pointer border-white/10 bg-white/[0.02] opacity-55'
      }`}
      onClick={active ? undefined : onActivate}
      aria-hidden={!active}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {entry.brandName && <p className="text-[0.72rem] font-black uppercase tracking-widest text-teal-300">{entry.brandName}</p>}
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[0.72rem] font-bold text-slate-300 ring-1 ring-inset ring-white/10">
          {CAT_EMOJI[entry.category] ? `${CAT_EMOJI[entry.category]} ` : ''}{entry.category}
        </span>
      </div>
      <h3 className="mt-1.5 text-[1.25rem] font-black leading-tight text-white sm:text-[1.5rem]">{entry.solutionName}</h3>
      <p className="mt-1.5 line-clamp-2 text-[0.9rem] leading-relaxed text-slate-300 sm:text-[0.95rem]">{entry.description}</p>

      {/* 3개 보기 탭 — 활성 카드만 조작 */}
      <div role="tablist" aria-label="화면 유형" className="mt-3.5 flex rounded-xl bg-white/5 p-1">
        {TABS.map((t) => {
          const available = t.imgKeys.some((k) => entry.images[k])
          const on = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              disabled={!available || !active}
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

      {/* 이미지 — 활성 카드는 탭하면 크게 보기 */}
      <button
        type="button"
        onClick={() => active && onOpen(entry, resolvedKey)}
        aria-label={`${entry.solutionName} ${activeTab.label} 화면 크게 보기`}
        tabIndex={active ? 0 : -1}
        className="mt-3.5 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2"
      >
        <ViewerImg img={img} />
      </button>

      {/* 단일 액션 */}
      <button
        type="button"
        onClick={() => active && onOpen(entry, resolvedKey)}
        tabIndex={active ? 0 : -1}
        className="mt-3.5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 text-[0.9rem] font-bold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
        </svg>
        전체 화면으로 크게 보기
      </button>
    </div>
  )
}

export default function AxIndustryShowcase() {
  const [active, setActive] = useState(0)
  const [pswpOpen, setPswpOpen] = useState(false)
  const [pswpSlides, setPswpSlides] = useState<AxPswpSlide[]>([])
  const [pswpIndex, setPswpIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollToIdx = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.children[i] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActive(i)
  }

  const onScroll = () => {
    const el = trackRef.current
    if (!el || CATEGORY_SET.length === 0) return
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement
      const cc = c.offsetLeft + c.offsetWidth / 2
      const d = Math.abs(cc - center)
      if (d < bestDist) { bestDist = d; best = i }
    }
    setActive(best)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const handler = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(onScroll) }
    el.addEventListener('scroll', handler, { passive: true })
    return () => { el.removeEventListener('scroll', handler); cancelAnimationFrame(raf) }
  }, [])

  const openFullscreen = (entry: ShowcaseCatalogEntry, key: ScreenTypeKey) => {
    const { keys, slides } = buildSlides(entry)
    setPswpSlides(slides)
    setPswpIndex(Math.max(0, keys.indexOf(key)))
    setPswpOpen(true)
  }

  return (
    <section id="ax-showcase" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-12">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>업종마다 <span className="text-teal-300">실제로 다른 AX 화면</span>을 만듭니다.</>}
          desc="업종을 선택하거나 좌우로 넘겨 다른 AX 화면을 확인하세요."
        />

        {/* 업종 pill(이모지) — 가로 스크롤(PC·모바일 동일) */}
        <div
          className="mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none' }}
          role="tablist"
          aria-label="업종 선택"
        >
          {CATEGORY_SET.map((e, i) => {
            const on = i === active
            return (
              <button
                key={e.category}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => scrollToIdx(i)}
                className={`min-h-[44px] shrink-0 rounded-full px-4 text-[0.85rem] font-bold transition-colors ${
                  on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'
                }`}
              >
                {CAT_EMOJI[e.category] ? `${CAT_EMOJI[e.category]} ` : ''}{e.category}
              </button>
            )
          })}
        </div>

        {/* peek 캐러셀 — 가운데 업종 크게, 양옆 살짝 겹쳐 보임 */}
        <div
          ref={trackRef}
          className="mt-5 -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-[8vw] pb-2 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORY_SET.map((entry, i) => (
            <ViewerCard key={entry.id} entry={entry} active={i === active} onActivate={() => scrollToIdx(i)} onOpen={openFullscreen} />
          ))}
        </div>

        {/* 현재 위치 표시 */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {CATEGORY_SET.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`${c.category} 보기`}
              onClick={() => scrollToIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-teal-400' : 'w-1.5 bg-white/25'}`}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[0.78rem] font-medium text-slate-400">
          {active + 1} / {CATEGORY_SET.length} · 좌우로 넘기거나 위 업종을 선택하세요
        </p>

        <p className="mt-5 text-[0.78rem] leading-relaxed text-slate-500">
          가상 업종 시나리오로 제작한 프로토타입 화면입니다. 상호·수치는 시연용 예시이며, 기업별 업무분석 후 실제 작동형 시스템으로 확장합니다.
        </p>
      </div>

      <AxPhotoSwipe open={pswpOpen} slides={pswpSlides} index={pswpIndex} onClose={() => setPswpOpen(false)} />
    </section>
  )
}
