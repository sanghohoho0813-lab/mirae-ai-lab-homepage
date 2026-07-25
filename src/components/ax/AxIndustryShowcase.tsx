// SECTION #ax-showcase — 업종 16개 중 하나를 고르면, 그 업종 화면만 보여준다.
// 업종 칩: 가로 스크롤 없이 전부 보이도록 wrap 배치(모바일 3열). 터치영역 44px 이상.
// 선택한 업종 안에서만 통합 / 관리자·PC / 현장·모바일 3화면 전환. 다른 업종 화면은 노출하지 않는다.
// 이미지를 누르면 바로 전체화면(PhotoSwipe) — 별도 확대 버튼 없음. PC·모바일 동일 구조. 자동 이동 없음.
// 이미지 정직성: 준비된 화면이 없으면 억지 매핑 대신 '유사 사례' 또는 '준비 중'으로 표시한다.
import { useMemo, useState } from 'react'
import { AX_INDUSTRY_CARDS, AX_INDUSTRY_DEFAULT, type AxIndustryCard, type ShowcaseImg } from '../../data/axShowcase'
import { SectionHead } from './axFrames'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'

const TABS = [
  { key: 'integrated', label: '통합', screen: '통합 화면' },
  { key: 'pc', label: '관리자·PC', screen: '관리자·PC 화면' },
  { key: 'mobile', label: '현장·모바일', screen: '현장·모바일 화면' },
] as const
type TabKey = (typeof TABS)[number]['key']

const STATUS_BADGE: Record<string, { text: string; cls: string } | null> = {
  ready: null,
  similar: { text: '유사 사례', cls: 'bg-amber-400/15 text-amber-200 ring-amber-400/30' },
  soon: { text: '화면 준비 중', cls: 'bg-white/10 text-slate-300 ring-white/20' },
}

type Screen = { key: TabKey; label: string; screen: string; img: ShowcaseImg }

function screensOf(card: AxIndustryCard): Screen[] {
  const out: Screen[] = []
  TABS.forEach((t) => {
    const img = card.screens[t.key]
    if (img) out.push({ key: t.key, label: t.label, screen: t.screen, img })
  })
  return out
}

export default function AxIndustryShowcase() {
  const [key, setKey] = useState(AX_INDUSTRY_DEFAULT)
  const [tab, setTab] = useState<TabKey>('integrated')
  const [pswpOpen, setPswpOpen] = useState(false)
  const [pswpIndex, setPswpIndex] = useState(0)

  const card = useMemo(() => AX_INDUSTRY_CARDS.find((c) => c.key === key) ?? AX_INDUSTRY_CARDS[0], [key])
  const available = useMemo(() => screensOf(card), [card])
  const current = available.find((s) => s.key === tab) ?? available[0]

  const slides: AxPswpSlide[] = available.map((s) => ({
    src: s.img.src,
    width: s.img.w,
    height: s.img.h,
    alt: s.img.alt,
    caption: `${card.emoji} ${card.label} · ${s.screen}`,
  }))

  const selectIndustry = (nextKey: string) => {
    setKey(nextKey)
    const next = AX_INDUSTRY_CARDS.find((c) => c.key === nextKey)
    const first = next ? screensOf(next)[0] : undefined
    setTab(first ? first.key : 'integrated')
  }

  const openFullscreen = () => {
    if (!current) return
    setPswpIndex(Math.max(0, available.findIndex((s) => s.key === current.key)))
    setPswpOpen(true)
  }

  const badge = STATUS_BADGE[card.status]

  return (
    <section id="ax-showcase" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-12">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>우리 회사가 AX로 바뀌면 <span className="text-teal-300">심사에서 이렇게</span> 보여줄 수 있습니다.</>}
          desc="업종을 고르면 관리자·현장직원·고객이 쓰게 될 화면을 바로 확인할 수 있습니다."
        />

        {/* 업종 선택 — 전부 보이는 wrap 배치(가로 스크롤 없음) */}
        <div role="tablist" aria-label="업종 선택" className="mt-6 grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-6">
          {AX_INDUSTRY_CARDS.map((c) => {
            const on = c.key === card.key
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => selectIndustry(c.key)}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 break-keep rounded-xl px-1 py-1.5 text-center text-[0.82rem] font-bold leading-tight transition-colors sm:flex-row sm:gap-1 sm:px-1.5 sm:py-2 sm:text-[0.82rem] ${
                  on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'
                }`}
              >
                <span aria-hidden className="text-[1rem] leading-none">{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* 선택한 업종 1개만 */}
        <div className="mt-5 rounded-3xl border border-white/12 bg-white/[0.05] p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="text-[1.05rem]" aria-hidden>{card.emoji}</span>
            <p className="text-[0.9rem] font-black text-white">{card.label}</p>
            {badge && (
              <span className={`rounded-md px-2 py-0.5 text-[0.78rem] font-bold ring-1 ring-inset ${badge.cls}`}>{badge.text}</span>
            )}
          </div>
          <h3 className="mt-2 break-keep text-[1.2rem] font-black leading-tight text-white sm:text-[1.45rem]">{card.headline}</h3>

          {/* 대표 업무 */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {card.tasks.map((t) => (
              <span key={t} className="rounded-lg bg-white/5 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/10">{t}</span>
            ))}
          </div>

          {/* 정책자금 설명 포인트 */}
          <p className="mt-3 break-keep rounded-lg bg-teal-400/10 px-3 py-2 text-[0.82rem] font-bold leading-snug text-teal-200 ring-1 ring-inset ring-teal-400/20">
            정책자금 설명 포인트 · {card.fundingLine}
          </p>

          {current ? (
            <>
              {/* 화면 종류 — 준비된 화면만 노출 */}
              {available.length > 1 && (
                <div role="tablist" aria-label="화면 종류" className="mt-4 flex rounded-xl bg-white/5 p-1">
                  {available.map((s) => {
                    const on = s.key === current.key
                    return (
                      <button
                        key={s.key}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => setTab(s.key)}
                        className={`min-h-[44px] flex-1 rounded-lg px-2 text-[0.82rem] font-black transition-colors ${
                          on ? 'bg-teal-400 text-slate-900' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 이미지 — 누르면 전체화면 */}
              <button
                type="button"
                onClick={openFullscreen}
                aria-label={`${card.label} ${current.screen} 크게 보기`}
                className="mt-3 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2"
              >
                <img
                  key={current.img.src}
                  src={current.img.src}
                  srcSet={`${current.img.srcSm} 960w, ${current.img.src} ${current.img.w}w`}
                  sizes="(min-width:1024px) 760px, 92vw"
                  alt={current.img.alt}
                  width={current.img.w}
                  height={current.img.h}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[300px] w-auto object-contain sm:max-h-[380px] lg:max-h-[440px]"
                />
              </button>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-[0.82rem] font-bold text-slate-400">{current.img.caption}</p>
                <p className="text-[0.82rem] text-slate-500">확대해서 확인해보세요</p>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-5 text-center">
              <p className="text-[0.92rem] font-black text-white">이 업종 화면은 준비 중입니다.</p>
              <p className="mt-1.5 break-keep text-[0.85rem] leading-relaxed text-slate-400">
                맞지 않는 다른 업종 화면을 대신 보여드리지 않습니다. 위 대표 업무를 기준으로 인터뷰 후 맞춤 설계합니다.
              </p>
            </div>
          )}

          {card.note && (
            <p className="mt-2.5 break-keep text-[0.82rem] leading-relaxed text-slate-500">{card.note}</p>
          )}
        </div>

        <p className="mt-5 break-keep text-[0.82rem] leading-relaxed text-slate-500">
          가상 업종 시나리오로 제작한 프로토타입 화면입니다. 상호·수치는 시연용 예시이며, 기업별 업무분석 후 실제 작동형 시스템으로 확장합니다.
        </p>
      </div>

      <AxPhotoSwipe open={pswpOpen} slides={slides} index={pswpIndex} onClose={() => setPswpOpen(false)} />
    </section>
  )
}
