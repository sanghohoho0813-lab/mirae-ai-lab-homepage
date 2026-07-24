// SECTION 2 (#ax-showcase) — 사진 1~110 통합 AX 쇼케이스.
// PC/모바일이 같은 컴포넌트·같은 데이터·같은 컨트롤을 쓰고 CSS 레이아웃만 다르다.
// (모바일: 가로 스크롤-스냅 카드 / PC: 2~3열 그리드) 라이트박스는 PhotoSwipe.
import { useMemo, useRef, useState } from 'react'
import {
  AX_SHOWCASE_CATALOG,
  AX_SHOWCASE_FILTERS,
  type ScreenTypeKey,
  type ShowcaseCatalogEntry,
  type ShowcaseImg,
} from '../../data/axShowcase'
import { SectionHead } from './axFrames'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'

// 카드 세그먼트(통합 / 관리자·PC / 현장·모바일) → 실제 이미지 키 후보
const SEGMENTS = [
  { key: 'integrated', label: '통합', imgKeys: ['integrated'] as ScreenTypeKey[] },
  { key: 'pc', label: '관리자·PC', imgKeys: ['desktop', 'admin'] as ScreenTypeKey[] },
  { key: 'mobile', label: '현장·모바일', imgKeys: ['mobile', 'field'] as ScreenTypeKey[] },
] as const
type SegKey = (typeof SEGMENTS)[number]['key']

// 라이트박스 슬라이드 생성 순서 + 화면종류 라벨
const SLIDE_ORDER: ScreenTypeKey[] = ['integrated', 'desktop', 'admin', 'mobile', 'field']
const SCREEN_LABEL: Record<ScreenTypeKey, string> = {
  integrated: '통합 화면',
  desktop: '관리자·PC',
  admin: '관리자·PC',
  mobile: '현장·모바일',
  field: '현장·모바일',
}

function buildSlides(entry: ShowcaseCatalogEntry): { keys: ScreenTypeKey[]; slides: AxPswpSlide[] } {
  const keys = SLIDE_ORDER.filter((k) => entry.images[k])
  const mid = entry.brandName ? `${entry.brandName} · ${entry.category}` : entry.category
  const slides = keys.map((k) => {
    const img = entry.images[k]!
    // src 는 항상 원본(FULL), srcSm 아님 — 확대 화질 확보
    return {
      src: img.src,
      width: img.w,
      height: img.h,
      alt: img.alt,
      caption: `사진 ${img.no} · ${mid} · ${SCREEN_LABEL[k]}`,
    }
  })
  return { keys, slides }
}

function ShowImg({ img, className }: { img: ShowcaseImg; className?: string }) {
  const portrait = img.h > img.w
  return (
    <img
      src={img.src}
      srcSet={`${img.srcSm} ${portrait ? img.w : 960}w, ${img.src} ${img.w}w`}
      sizes="(min-width:1024px) 520px, 88vw"
      alt={img.alt}
      width={img.w}
      height={img.h}
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
}

function ShowcaseCard({
  entry,
  onOpen,
}: {
  entry: ShowcaseCatalogEntry
  onOpen: (entry: ShowcaseCatalogEntry, key: ScreenTypeKey) => void
}) {
  const [seg, setSeg] = useState<SegKey>('integrated')
  const activeSeg = SEGMENTS.find((s) => s.key === seg) ?? SEGMENTS[0]
  const resolvedKey = activeSeg.imgKeys.find((k) => entry.images[k]) ?? 'integrated'
  const img = entry.images[resolvedKey] ?? entry.images.integrated!

  return (
    <div className="flex w-[88vw] max-w-[440px] shrink-0 snap-center flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 lg:w-auto lg:max-w-none">
      {/* 브랜드/솔루션명 + category */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {entry.brandName && (
            <p className="text-[0.66rem] font-black uppercase tracking-widest text-teal-300">{entry.brandName}</p>
          )}
          <h3 className="truncate text-[1.05rem] font-black leading-tight text-white">{entry.solutionName}</h3>
        </div>
        <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[0.68rem] font-bold text-slate-300 ring-1 ring-inset ring-white/10">
          {entry.category}
        </span>
      </div>

      {/* 짧은 설명 */}
      <p className="mt-1.5 line-clamp-2 text-[0.86rem] leading-snug text-slate-300 lg:line-clamp-1">{entry.description}</p>

      {/* 세그먼트 컨트롤 — 이미지 + 캡션 동시 전환 */}
      <div role="group" aria-label="화면 유형" className="mt-2.5 flex rounded-lg bg-white/5 p-0.5">
        {SEGMENTS.map((s) => {
          const available = s.imgKeys.some((k) => entry.images[k])
          const selected = seg === s.key
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={selected}
              disabled={!available}
              title={available ? undefined : '준비된 화면 없음'}
              onClick={() => available && setSeg(s.key)}
              className={`min-h-[44px] flex-1 rounded-md px-2 text-[0.76rem] font-black transition-colors lg:min-h-[36px] ${
                selected
                  ? 'bg-teal-400 text-slate-900'
                  : available
                    ? 'text-slate-300 hover:text-white'
                    : 'cursor-not-allowed text-slate-600'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* 이미지 — 탭하면 전체 화면 (캡션은 이미지 하단 오버레이 → 세로 흐름 절약) */}
      <button
        type="button"
        onClick={() => onOpen(entry, resolvedKey)}
        aria-label={`${entry.solutionName} ${activeSeg.label} 화면 전체 화면으로 보기`}
        className="relative mt-2.5 flex h-[184px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950 lg:h-[136px]"
      >
        <ShowImg img={img} className="max-h-[184px] w-auto object-contain lg:max-h-[136px]" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-transparent px-2.5 pb-1.5 pt-5 text-left text-[0.72rem] font-bold text-slate-200">
          {img.caption}
        </span>
      </button>

      {/* 전체 화면 버튼 — PC/모바일 동일 문구·위치 */}
      <button
        type="button"
        onClick={() => onOpen(entry, resolvedKey)}
        className="mt-2.5 inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 text-[0.85rem] font-bold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
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
  const [filter, setFilter] = useState<string>('전체')
  const [active, setActive] = useState(0)
  const [pswpOpen, setPswpOpen] = useState(false)
  const [pswpSlides, setPswpSlides] = useState<AxPswpSlide[]>([])
  const [pswpIndex, setPswpIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => (filter === '전체' ? AX_SHOWCASE_CATALOG : AX_SHOWCASE_CATALOG.filter((e) => e.category === filter)),
    [filter],
  )

  const selectFilter = (c: string) => {
    setFilter(c)
    setActive(0)
    // 필터 선택 시 첫 카드로 이동
    requestAnimationFrame(() => trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' }))
  }

  const onTrackScroll = () => {
    const el = trackRef.current
    if (!el || filtered.length === 0) return
    const i = Math.round(el.scrollLeft / (el.scrollWidth / filtered.length))
    setActive(Math.max(0, Math.min(filtered.length - 1, i)))
  }

  const openFullscreen = (entry: ShowcaseCatalogEntry, key: ScreenTypeKey) => {
    const { keys, slides } = buildSlides(entry)
    setPswpSlides(slides)
    setPswpIndex(Math.max(0, keys.indexOf(key)))
    setPswpOpen(true)
  }

  return (
    <section id="ax-showcase" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-9">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>어떤 업종이든, <span className="text-teal-300">반복되는 업무 하나부터</span> AX로 바꿀 수 있습니다.</>}
          desc="업종과 업무를 선택해 AX 화면을 확인하세요."
        />

        {/* 카테고리 필터 — PC/모바일 동일 chip(모바일 가로 스크롤, 스크롤바 숨김) */}
        <div
          className="mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:px-0"
          style={{ scrollbarWidth: 'none' }}
          role="group"
          aria-label="업종 카테고리 필터"
        >
          {AX_SHOWCASE_FILTERS.map((c) => {
            const on = filter === c
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => selectFilter(c)}
                className={`min-h-[40px] shrink-0 rounded-full px-4 text-[0.85rem] font-bold transition-colors ${
                  on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>

        {/* 카드 — 모바일: 가로 스크롤-스냅 / PC: 2~3열 그리드 (같은 DOM, CSS만 다름) */}
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="mt-4 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:snap-none lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3"
          style={{ scrollbarWidth: 'none' }}
        >
          {filtered.map((entry) => (
            <ShowcaseCard key={entry.id} entry={entry} onOpen={openFullscreen} />
          ))}
        </div>

        {/* 모바일 현재 인덱스 표시 */}
        {filtered.length > 1 && (
          <div className="mt-2 lg:hidden">
            <div className="flex items-center justify-center gap-1.5">
              {filtered.map((c, i) => (
                <span key={c.id} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-teal-400' : 'w-1.5 bg-white/25'}`} />
              ))}
            </div>
            <p className="mt-1.5 text-center text-[0.76rem] font-medium text-slate-400">
              좌우로 넘겨 확인하세요 · {active + 1}/{filtered.length}
            </p>
          </div>
        )}

        <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[0.8rem] leading-relaxed text-slate-400">
          가상 업종 시나리오를 기반으로 제작한 <b className="text-slate-300">클릭형 프론트엔드 프로토타입</b>입니다. 화면 속 상호·수치는 시연용 예시 데이터입니다. 기업별 업무분석 후 로그인·데이터베이스·관리자 처리 기능이 포함된 <b className="text-slate-300">작동형 MVP</b>로 확장할 수 있습니다.
        </p>
      </div>

      <AxPhotoSwipe open={pswpOpen} slides={pswpSlides} index={pswpIndex} onClose={() => setPswpOpen(false)} />
    </section>
  )
}
