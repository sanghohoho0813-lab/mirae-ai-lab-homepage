// SECTION 4 — 업종별 AX 구축 예시 (v2: 국내 중소기업 8개 실제 업종 + 기존 6개 통합)
// 상단 퀵내비(신규 8) + '전체 업종 보기'(그룹별 전체). 업종 선택 → 대표(크게) + 관리자 웹 + 현장 모바일 + 라이트박스.
import { useEffect, useRef, useState } from 'react'
import {
  AX_GROUPS,
  AX_QUICKNAV_KEYS,
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

function QuickChip({ ind, on, onClick }: { ind: ShowcaseIndustry; on: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (on) ref.current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [on])
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] font-bold transition-colors ${
        on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'
      }`}
    >
      <span aria-hidden>{ind.icon}</span>
      {ind.label}
    </button>
  )
}

export default function AxIndustryShowcase() {
  const [key, setKey] = useState(AX_QUICKNAV_KEYS[0])
  const [showAll, setShowAll] = useState(false)
  const [lb, setLb] = useState(-1)
  const ind = showcaseIndustry(key) ?? SHOWCASE_INDUSTRIES[0]
  const lightItems = industryLightbox(ind)
  const quickInds = AX_QUICKNAV_KEYS.map((k) => showcaseIndustry(k)!).filter(Boolean)

  return (
    <section id="industry" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-7">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>제조·물류부터 병원·학원·정비·숙박까지, <span className="text-teal-300">우리 회사 일이 실제 화면으로</span> 움직입니다</>}
          desc="업종별로 직접 설계·구현한 가상 업종 기반 프로토타입 화면입니다. 관리자 웹과 현장 모바일이 어떻게 연결되는지 보여드립니다. 실제 구축 범위는 기업 인터뷰 후 결정됩니다."
        />

        {/* 업종 퀵내비 — 신규 8 (모바일 가로 스크롤) */}
        <div role="tablist" aria-label="대표 업종" className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {quickInds.map((qi) => (
            <QuickChip key={qi.key} ind={qi} on={qi.key === key} onClick={() => setKey(qi.key)} />
          ))}
        </div>

        {/* 전체 업종 보기 */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-[0.85rem] font-bold text-slate-200 transition-colors hover:bg-white/10"
          >
            {showAll ? '전체 업종 접기' : '전체 업종 보기 (제조·물류·연구소·B2B 등 포함)'}
            <span aria-hidden className={`transition-transform ${showAll ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showAll && (
            <div className="mt-3 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-4">
              {AX_GROUPS.map((g) => {
                const list = SHOWCASE_INDUSTRIES.filter((i) => i.group === g.key)
                if (!list.length) return null
                return (
                  <div key={g.key}>
                    <p className="text-[0.72rem] font-black uppercase tracking-widest text-teal-300">{g.label}</p>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {list.map((li) => (
                        <button
                          key={li.key}
                          type="button"
                          onClick={() => { setKey(li.key); setShowAll(false) }}
                          className={`flex min-h-[40px] items-center gap-2 rounded-lg px-3 py-2 text-left text-[0.86rem] font-bold transition-colors ${
                            li.key === key ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          <span aria-hidden>{li.icon}</span>
                          <span className="min-w-0 truncate">{li.label}</span>
                          {!li.isNew && <span className="ml-auto shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-black text-slate-300">기존</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 선택 업종 상세 */}
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,3.1fr)] lg:items-start">
          {/* 설명 */}
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
            <p className="mt-4 text-[0.78rem] font-black text-slate-400">구축되는 핵심 기능</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {ind.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[0.9rem] leading-snug text-slate-300"><span aria-hidden className="mt-0.5 text-teal-300">✓</span>{f}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ProtoBadge />
              <span className="text-[0.78rem] font-semibold text-slate-500">구현 수준 · {ind.prototypeLevel}</span>
            </div>
          </div>

          {/* 이미지 — 대표(크게) + 관리자 웹 + 현장 모바일 */}
          <div>
            <button type="button" onClick={() => setLb(0)} aria-label={`${ind.label} 대표 화면 확대 보기`} className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl transition-transform hover:-translate-y-0.5">
              <ShowImg img={ind.representative} sizes="(min-width:1024px) 760px, 100vw" className="w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
            </button>

            {ind.isNew && ind.pc && ind.mobile ? (
              /* 신규 업종 — 관리자 웹 + 현장 모바일 (모바일 가로 스와이프, lg 2열 비대칭) */
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-[3fr_2fr] lg:overflow-visible">
                <button type="button" onClick={() => setLb(1)} aria-label="관리자 웹 화면 확대 보기" className="group w-[86%] shrink-0 text-left lg:w-auto">
                  <BrowserShell label={ind.pc.caption} className="transition-transform group-hover:-translate-y-0.5">
                    <ShowImg img={ind.pc} sizes="(min-width:1024px) 440px, 86vw" className="w-full" />
                  </BrowserShell>
                  <span className="mt-1.5 block text-[0.72rem] font-bold text-slate-400">관리자 웹 · 눌러서 크게</span>
                </button>
                <button type="button" onClick={() => setLb(2)} aria-label="현장 모바일 화면 확대 보기" className="group mx-auto w-[52%] shrink-0 text-left lg:w-full lg:max-w-[190px]">
                  <PhoneShell className="transition-transform group-hover:-translate-y-0.5">
                    <ShowImg img={ind.mobile} sizes="190px" className="w-full" />
                  </PhoneShell>
                  <span className="mt-1.5 block text-center text-[0.72rem] font-bold text-slate-400">현장 모바일</span>
                </button>
              </div>
            ) : ind.gallery && ind.gallery.length > 0 ? (
              /* 기존 업종 — 보조 화면 썸네일 */
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {ind.gallery.map((g, i) => (
                  <button key={g.src} type="button" onClick={() => setLb(1 + i)} aria-label={`${g.caption} 확대 보기`} className="group relative w-[47%] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-lg transition-transform hover:-translate-y-0.5">
                    <span className="flex h-32 items-center justify-center sm:h-40">
                      <ShowImg img={g} sizes="300px" className="max-h-full w-full object-contain object-top" />
                    </span>
                    <span aria-hidden className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-slate-900/70 text-white">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M15 3h6v6M21 3l-8 8M9 21H3v-6M3 21l8-8" /></svg>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            <p className="mt-2.5 text-right text-[0.72rem] font-medium text-slate-500">화면을 누르면 좌우로 넘겨가며 크게 볼 수 있습니다</p>
          </div>
        </div>

        {/* 구현 수준 고지 */}
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[0.8rem] leading-relaxed text-slate-400">
          가상 업종 시나리오를 기반으로 제작한 <b className="text-slate-300">클릭형 프론트엔드 프로토타입</b>입니다. 화면 속 상호·수치는 시연용 예시 데이터입니다. 기업별 업무분석 후 로그인·데이터베이스·저장·조회·관리자 처리 기능이 포함된 <b className="text-slate-300">작동형 MVP</b>로 확장할 수 있습니다.
        </p>
      </div>

      <AxShowcaseLightbox items={lightItems} index={lb} industry={ind} onIndex={setLb} onClose={() => setLb(-1)} />
    </section>
  )
}
