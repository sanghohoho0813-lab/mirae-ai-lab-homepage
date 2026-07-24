// SECTION #ax-showcase — 업종 선택형 peek 캐러셀 단일 뷰어.
// 8개 업종(신규 브랜드) 각각: 통합=대표(쇼케이스) / 관리자·PC=pc / 현장·모바일=mobile 로 정확히 매핑한다.
// 업종 pill(이모지) 선택 또는 좌우 스와이프 → 가운데 업종 1세트 크게, 양옆 업종은 살짝 겹쳐 보임.
// 선택한 업종 안에서만 통합/관리자·PC/현장·모바일 3화면 전환 → 크게 보기(PhotoSwipe).
// PC·모바일 동일 구조·동일 이미지·동일 순서. 자동 이동 없음.
import { useEffect, useRef, useState } from 'react'
import { SHOWCASE_INDUSTRIES, AX_QUICKNAV_KEYS, type ShowcaseImg, type ShowcaseIndustry } from '../../data/axShowcase'
import { SectionHead } from './axFrames'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'

// 3화면 탭 — 각 업종의 대표(통합)/pc(관리자·PC)/mobile(현장·모바일)
const TABS = [
  { key: 'integrated', label: '통합', pick: (b: ShowcaseIndustry) => b.representative, screen: '통합 화면' },
  { key: 'pc', label: '관리자·PC', pick: (b: ShowcaseIndustry) => b.pc, screen: '관리자·PC' },
  { key: 'mobile', label: '현장·모바일', pick: (b: ShowcaseIndustry) => b.mobile, screen: '현장·모바일' },
] as const
type TabKey = (typeof TABS)[number]['key']

// 업종별 "정책자금 설명 포인트" — 이 화면이 심사에서 어떤 사업구조를 설명하는지(브랜드 key 기준)
const FUNDING_LINE: Record<string, string> = {
  staydeck: '객실운영과 고객요청을 데이터로 관리하는 사업구조',
  garageos: '차량 입고부터 작업사진과 출고까지 기록되는 정비시스템',
  fieldcare: '직원배정·현장사진·완료보고를 연결한 현장관리 구조',
  leaseflow: '계약·공실·수납과 현장점검을 한 화면으로 관리하는 구조',
  careflow: '예약·접수·재방문 안내를 데이터로 연결한 진료운영 구조',
  classpilot: '수업·출결·상담과 학부모 안내를 연결한 운영 구조',
  storepulse: '전 매장 발주·재고·마감을 본사에서 관리하는 구조',
  siteflow: '현장 공정·일일보고·자재요청을 본사와 연결한 관리 구조',
}

// 업종별 이모지(업종명 기준)
const CAT_EMOJI: Record<string, string> = {
  '숙박·호텔': '🏨',
  '자동차 정비': '🚘',
  '시설관리': '🏢',
  '임대·건물관리': '🏠',
  '병원·의원': '🏥',
  '학원·교육': '🎓',
  '외식·프랜차이즈': '🍽️',
  '건설·현장': '🏗️',
}

// 8개 신규 브랜드만 (사진 87~110), QUICKNAV 순서
const BRANDS: ShowcaseIndustry[] = AX_QUICKNAV_KEYS
  .map((k) => SHOWCASE_INDUSTRIES.find((s) => s.key === k))
  .filter((s): s is ShowcaseIndustry => Boolean(s))

function buildSlides(b: ShowcaseIndustry): { imgs: ShowcaseImg[]; slides: AxPswpSlide[] } {
  const imgs = TABS.map((t) => t.pick(b)).filter((im): im is ShowcaseImg => Boolean(im))
  const slides = TABS.map((t) => {
    const im = t.pick(b)
    return im ? { src: im.src, width: im.w, height: im.h, alt: im.alt, caption: `${b.brand} · ${b.label} · ${t.screen}` } : null
  }).filter((s): s is AxPswpSlide => Boolean(s))
  return { imgs, slides }
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

function ViewerCard({
  brand,
  active,
  onActivate,
  onOpen,
}: {
  brand: ShowcaseIndustry
  active: boolean
  onActivate: () => void
  onOpen: (b: ShowcaseIndustry, tabKey: TabKey) => void
}) {
  const [tab, setTab] = useState<TabKey>('integrated')
  const activeTab = TABS.find((t) => t.key === tab) ?? TABS[0]
  const img = activeTab.pick(brand) ?? brand.representative

  return (
    <div
      className={`w-[84vw] max-w-[600px] shrink-0 snap-center rounded-3xl border p-4 transition-all duration-300 sm:p-6 ${
        active ? 'border-white/15 bg-white/[0.05] opacity-100' : 'scale-[0.94] cursor-pointer border-white/10 bg-white/[0.02] opacity-55'
      }`}
      onClick={active ? undefined : onActivate}
      aria-hidden={!active}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-[0.72rem] font-black uppercase tracking-widest text-teal-300">{brand.brand}</p>
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[0.72rem] font-bold text-slate-300 ring-1 ring-inset ring-white/10">
          {CAT_EMOJI[brand.label] ? `${CAT_EMOJI[brand.label]} ` : ''}{brand.label}
        </span>
      </div>
      <h3 className="mt-1.5 text-[1.25rem] font-black leading-tight text-white sm:text-[1.5rem]">{brand.headline}</h3>
      <p className="mt-1.5 line-clamp-2 text-[0.9rem] leading-relaxed text-slate-300 sm:text-[0.95rem]">{brand.desc}</p>

      {/* 3화면 탭 */}
      <div role="tablist" aria-label="화면 유형" className="mt-3.5 flex rounded-xl bg-white/5 p-1">
        {TABS.map((t) => {
          const on = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              disabled={!active}
              onClick={() => setTab(t.key)}
              className={`min-h-[44px] flex-1 rounded-lg px-2 text-[0.82rem] font-black transition-colors ${
                on ? 'bg-teal-400 text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* 정책자금 설명 포인트 — 이 화면이 심사에서 설명하는 사업구조 */}
      {FUNDING_LINE[brand.key] && (
        <p className="mt-2.5 break-keep rounded-lg bg-teal-400/10 px-3 py-2 text-[0.82rem] font-bold leading-snug text-teal-200 ring-1 ring-inset ring-teal-400/20">
          정책자금 설명 포인트 · {FUNDING_LINE[brand.key]}
        </p>
      )}

      {/* 현재 화면 캡션 */}
      <p className="mt-2 truncate text-[0.76rem] font-bold text-slate-400">{img.caption}</p>

      {/* 이미지 — 활성 카드는 탭하면 크게 보기 */}
      <button
        type="button"
        onClick={() => active && onOpen(brand, tab)}
        aria-label={`${brand.brand} ${activeTab.label} 화면 크게 보기`}
        tabIndex={active ? 0 : -1}
        className="mt-2 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2"
      >
        <ViewerImg img={img} />
      </button>

      {/* 단일 액션 */}
      <button
        type="button"
        onClick={() => active && onOpen(brand, tab)}
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
    if (!el) return
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

  const openFullscreen = (b: ShowcaseIndustry, tabKey: TabKey) => {
    const { slides } = buildSlides(b)
    const idx = TABS.findIndex((t) => t.key === tabKey)
    setPswpSlides(slides)
    setPswpIndex(Math.max(0, idx))
    setPswpOpen(true)
  }

  return (
    <section id="ax-showcase" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-12">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>우리 회사가 AX로 바뀌면 <span className="text-teal-300">심사에서 이렇게</span> 보여줄 수 있습니다.</>}
          desc="업종을 선택하면 관리자·현장직원·고객이 어떤 화면을 쓰게 되는지 확인할 수 있습니다."
        />

        {/* 업종 pill(이모지) */}
        <div
          className="mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none' }}
          role="tablist"
          aria-label="업종 선택"
        >
          {BRANDS.map((b, i) => {
            const on = i === active
            return (
              <button
                key={b.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => scrollToIdx(i)}
                className={`min-h-[44px] shrink-0 rounded-full px-4 text-[0.85rem] font-bold transition-colors ${
                  on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'
                }`}
              >
                {CAT_EMOJI[b.label] ? `${CAT_EMOJI[b.label]} ` : ''}{b.label}
              </button>
            )
          })}
        </div>

        {/* peek 캐러셀 */}
        <div
          ref={trackRef}
          className="mt-5 -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-[8vw] pb-2 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {BRANDS.map((b, i) => (
            <ViewerCard key={b.key} brand={b} active={i === active} onActivate={() => scrollToIdx(i)} onOpen={openFullscreen} />
          ))}
        </div>

        {/* 현재 위치 표시 */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {BRANDS.map((b, i) => (
            <button
              key={b.key}
              type="button"
              aria-label={`${b.label} 보기`}
              onClick={() => scrollToIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-teal-400' : 'w-1.5 bg-white/25'}`}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[0.78rem] font-medium text-slate-400">
          {active + 1} / {BRANDS.length} · 좌우로 넘기거나 위 업종을 선택하세요
        </p>

        <p className="mt-5 text-[0.78rem] leading-relaxed text-slate-500">
          가상 업종 시나리오로 제작한 프로토타입 화면입니다. 상호·수치는 시연용 예시이며, 기업별 업무분석 후 실제 작동형 시스템으로 확장합니다.
        </p>
      </div>

      <AxPhotoSwipe open={pswpOpen} slides={pswpSlides} index={pswpIndex} onClose={() => setPswpOpen(false)} />
    </section>
  )
}
