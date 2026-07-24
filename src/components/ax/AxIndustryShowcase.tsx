// SECTION 2 (#ax-showcase) — Hero 바로 다음 핵심 섹션. 업종별 실제 AX 화면을 크게 보여준다.
// 모바일: 업종 카드 1개가 거의 전체 폭인 가로 스크롤-스냅(통합/PC/모바일 전환 + 확대). 데스크톱: 업종 탭 + 대표 화면 크게.
// 하단: "이 화면은 어떻게 만들어지나요?"(Problem→Screen 흡수, 기본 접힘) + "기존 AX 화면 더 보기"(사진 1~84).
import { useRef, useState } from 'react'
import {
  AX_GROUPS,
  AX_QUICKNAV_KEYS,
  AX_TRANSFORM_ASIDE,
  SHOWCASE_INDUSTRIES,
  industryLightbox,
  showcaseIndustry,
  type ShowcaseImg,
  type ShowcaseIndustry,
} from '../../data/axShowcase'
import { BrowserShell, PhoneShell, ProtoBadge, SectionHead } from './axFrames'
import AxShowcaseLightbox from './AxShowcaseLightbox'

function ShowImg({ img, sizes, className }: { img: ShowcaseImg; sizes?: string; className?: string }) {
  const portrait = img.h > img.w
  return (
    <img
      src={img.src}
      srcSet={`${img.srcSm} ${portrait ? img.w : 960}w, ${img.src} ${img.w}w`}
      sizes={sizes ?? '(min-width:1024px) 720px, 100vw'}
      alt={img.alt}
      width={img.w}
      height={img.h}
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
}

const VIEWS = [
  { k: 'rep', label: '통합' },
  { k: 'pc', label: 'PC 화면' },
  { k: 'mobile', label: '모바일' },
] as const
type ViewKey = (typeof VIEWS)[number]['k']

// 모바일 업종 카드 — 통합/PC/모바일 전환 + 확대
function MobileCard({ ind, onZoom }: { ind: ShowcaseIndustry; onZoom: (key: string, idx: number) => void }) {
  const [view, setView] = useState<ViewKey>('rep')
  const img = view === 'pc' && ind.pc ? ind.pc : view === 'mobile' && ind.mobile ? ind.mobile : ind.representative
  const idx = view === 'pc' ? 1 : view === 'mobile' ? 2 : 0
  return (
    <div className="flex w-[88vw] max-w-[420px] shrink-0 snap-center flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-lg ring-1 ring-inset ring-white/10">{ind.icon}</span>
        <div className="min-w-0">
          {ind.brand && <p className="text-[0.68rem] font-black uppercase tracking-widest text-teal-300">{ind.brand}</p>}
          <p className="text-[1.02rem] font-black leading-tight text-white">{ind.label}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[0.9rem] font-semibold leading-snug text-slate-300">{ind.headline}</p>
      <button
        type="button"
        onClick={() => onZoom(ind.key, idx)}
        aria-label={`${ind.label} ${VIEWS.find((v) => v.k === view)!.label} 화면 확대`}
        className="mt-2.5 flex h-[210px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950"
      >
        <ShowImg img={img} sizes="86vw" className="max-h-[210px] w-auto object-contain" />
      </button>
      <div className="mt-2.5 flex items-center gap-2">
        <div role="tablist" aria-label="화면 유형" className="flex flex-1 rounded-lg bg-white/5 p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.k}
              type="button"
              role="tab"
              aria-selected={view === v.k}
              onClick={() => setView(v.k)}
              className={`min-h-[36px] flex-1 rounded-md px-2 text-[0.78rem] font-black transition-colors ${view === v.k ? 'bg-teal-400 text-slate-900' : 'text-slate-300'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onZoom(ind.key, idx)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-white/10"
          aria-label="확대해서 보기"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M15 3h6v6M21 3l-8 8M9 21H3v-6M3 21l8-8" /></svg>
        </button>
      </div>
    </div>
  )
}

export default function AxIndustryShowcase() {
  const [key, setKey] = useState(AX_QUICKNAV_KEYS[0])
  const [showAll, setShowAll] = useState(false)
  const [howOpen, setHowOpen] = useState(false)
  const [lbKey, setLbKey] = useState<string>(AX_QUICKNAV_KEYS[0])
  const [lb, setLb] = useState(-1)
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const ind = showcaseIndustry(key) ?? SHOWCASE_INDUSTRIES[0]
  const lbInd = showcaseIndustry(lbKey) ?? ind
  const lightItems = industryLightbox(lbInd)
  const cards = AX_QUICKNAV_KEYS.map((k) => showcaseIndustry(k)!).filter(Boolean)

  const openZoom = (k: string, idx: number) => { setLbKey(k); setLb(idx) }
  const onTrackScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / (el.scrollWidth / cards.length))
    setActive(Math.max(0, Math.min(cards.length - 1, i)))
  }

  return (
    <section id="ax-showcase" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>어떤 업종이든, <span className="text-teal-300">반복되는 업무 하나부터</span> AX로 바꿀 수 있습니다.</>}
          desc="실제 구축 가능한 관리자 웹과 현장 모바일 화면을 업종별로 확인해보세요."
        />

        {/* 모바일 — 업종 카드 가로 스크롤-스냅 */}
        <div className="mt-6 lg:hidden">
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {cards.map((c) => (
              <MobileCard key={c.key} ind={c} onZoom={openZoom} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {cards.map((c, i) => (
              <span key={c.key} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-teal-400' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
          <p className="mt-1.5 text-center text-[0.76rem] font-medium text-slate-400">좌우로 넘겨 8개 업종을 확인하세요 · {active + 1}/{cards.length}</p>
        </div>

        {/* 데스크톱 — 업종 탭 + 대표 화면 크게 */}
        <div className="hidden lg:block">
          <div role="tablist" aria-label="대표 업종" className="mt-6 flex flex-wrap gap-2">
            {cards.map((qi) => (
              <button
                key={qi.key}
                type="button"
                role="tab"
                aria-selected={qi.key === key}
                onClick={() => setKey(qi.key)}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] font-bold transition-colors ${qi.key === key ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'}`}
              >
                <span aria-hidden>{qi.icon}</span>{qi.label}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,3.3fr)] lg:items-start">
            <div>
              <div className="flex items-center gap-2">
                <span aria-hidden className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-xl ring-1 ring-inset ring-white/10">{ind.icon}</span>
                <div>
                  {ind.brand && <p className="text-[0.74rem] font-black uppercase tracking-widest text-teal-300">{ind.brand}</p>}
                  <h3 className="text-[1.3rem] font-black tracking-tight text-white">{ind.label}</h3>
                </div>
              </div>
              <p className="mt-4 text-[1.08rem] font-bold leading-snug text-white">{ind.headline}</p>
              <p className="mt-2 text-[1rem] leading-relaxed text-slate-300">{ind.desc}</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {ind.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[0.9rem] leading-snug text-slate-300"><span aria-hidden className="mt-0.5 text-teal-300">✓</span>{f}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <ProtoBadge />
                <span className="text-[0.78rem] font-semibold text-slate-500">구현 수준 · {ind.prototypeLevel}</span>
              </div>
            </div>

            <div>
              <button type="button" onClick={() => openZoom(ind.key, 0)} aria-label={`${ind.label} 대표 화면 확대 보기`} className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl transition-transform hover:-translate-y-0.5">
                <ShowImg img={ind.representative} sizes="(min-width:1024px) 780px, 100vw" className="w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
              </button>
              {ind.isNew && ind.pc && ind.mobile ? (
                <div className="mt-3 grid grid-cols-[3fr_2fr] gap-3">
                  <button type="button" onClick={() => openZoom(ind.key, 1)} aria-label="관리자 웹 화면 확대 보기" className="group text-left">
                    <BrowserShell label={ind.pc.caption} className="transition-transform group-hover:-translate-y-0.5">
                      <ShowImg img={ind.pc} sizes="440px" className="w-full" />
                    </BrowserShell>
                    <span className="mt-1.5 block text-[0.72rem] font-bold text-slate-400">관리자 웹 · 눌러서 크게</span>
                  </button>
                  <button type="button" onClick={() => openZoom(ind.key, 2)} aria-label="현장 모바일 화면 확대 보기" className="group mx-auto w-full max-w-[190px] text-left">
                    <PhoneShell className="transition-transform group-hover:-translate-y-0.5">
                      <ShowImg img={ind.mobile} sizes="190px" className="w-full" />
                    </PhoneShell>
                    <span className="mt-1.5 block text-center text-[0.72rem] font-bold text-slate-400">현장 모바일</span>
                  </button>
                </div>
              ) : ind.gallery && ind.gallery.length > 0 ? (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {ind.gallery.map((g, i) => (
                    <button key={g.src} type="button" onClick={() => openZoom(ind.key, 1 + i)} aria-label={`${g.caption} 확대 보기`} className="group relative w-[47%] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-lg transition-transform hover:-translate-y-0.5">
                      <span className="flex h-40 items-center justify-center">
                        <ShowImg img={g} sizes="300px" className="max-h-full w-full object-contain object-top" />
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[0.8rem] leading-relaxed text-slate-400">
          가상 업종 시나리오를 기반으로 제작한 <b className="text-slate-300">클릭형 프론트엔드 프로토타입</b>입니다. 화면 속 상호·수치는 시연용 예시 데이터입니다. 기업별 업무분석 후 로그인·데이터베이스·관리자 처리 기능이 포함된 <b className="text-slate-300">작동형 MVP</b>로 확장할 수 있습니다.
        </p>

        {/* 이 화면은 어떻게 만들어지나요? — Problem→Screen 흡수(기본 접힘) */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <button type="button" onClick={() => setHowOpen((v) => !v)} aria-expanded={howOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
            <span>
              <span className="block text-[0.98rem] font-black text-white">이 화면은 어떻게 만들어지나요?</span>
              <span className="mt-0.5 block text-[0.82rem] leading-snug text-slate-400">기존 업무를 그대로 옮기지 않고, 반복되는 흐름을 정리해 실제 사용할 화면으로 설계합니다.</span>
            </span>
            <span aria-hidden className={`shrink-0 text-teal-300 transition-transform ${howOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {howOpen && (
            <div className="border-t border-white/10 p-4">
              <ol className="grid gap-3 lg:grid-cols-3">
                {[
                  { n: '1', t: '흩어진 업무 확인', items: ['전화', '카카오톡', '엑셀', '수기 장부', '담당자 개인 경험'] },
                  { n: '2', t: '핵심 흐름 설계', items: ['사용자', '업무 순서', '입력 데이터', '승인 단계', '관리자 확인'] },
                  { n: '3', t: 'AX 화면 제작', items: ['관리자 웹', '현장 모바일', '클릭형 프로토타입', '작동형 MVP'] },
                ].map((s) => (
                  <li key={s.n} className="rounded-xl border border-white/10 bg-slate-950/40 p-3.5">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-teal-400 text-[0.74rem] font-black text-slate-900">{s.n}</span>
                      <span className="text-[0.95rem] font-black text-white">{s.t}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.items.map((it) => <span key={it} className="rounded-md bg-white/5 px-2 py-0.5 text-[0.76rem] font-semibold text-slate-300">{it}</span>)}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[AX_TRANSFORM_ASIDE.construction, AX_TRANSFORM_ASIDE.reservation].map((g) => (
                  <div key={g.src} className="overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                    <ShowImg img={g} sizes="(min-width:640px) 360px, 90vw" className="w-full object-cover" />
                    <span className="block px-3 py-2 text-left text-[0.76rem] font-bold text-slate-400">{g.caption}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 기존 AX 화면 더 보기 (사진 1~84) — 기본 접힘 */}
        <div className="mt-3">
          <button type="button" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-[0.85rem] font-bold text-slate-200 transition-colors hover:bg-white/10">
            {showAll ? '기존 AX 화면 접기' : '기존 AX 화면 더 보기 (제조·물류·연구소·B2B 등)'}
            <span aria-hidden className={`transition-transform ${showAll ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showAll && (
            <div className="mt-3 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-4">
              {AX_GROUPS.map((g) => {
                const list = SHOWCASE_INDUSTRIES.filter((i) => i.group === g.key && !i.isNew)
                if (!list.length) return null
                return (
                  <div key={g.key}>
                    <p className="text-[0.72rem] font-black uppercase tracking-widest text-teal-300">{g.label}</p>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {list.map((li) => (
                        <button
                          key={li.key}
                          type="button"
                          onClick={() => { setKey(li.key); setShowAll(false); openZoom(li.key, 0) }}
                          className="flex min-h-[40px] items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-left text-[0.86rem] font-bold text-slate-200 transition-colors hover:bg-white/10"
                        >
                          <span aria-hidden>{li.icon}</span>
                          <span className="min-w-0 truncate">{li.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <AxShowcaseLightbox items={lightItems} index={lb} industry={lbInd} onIndex={setLb} onClose={() => setLb(-1)} />
    </section>
  )
}
