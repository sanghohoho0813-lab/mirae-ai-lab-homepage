// SECTION 4 — 업종별 AX 구축 예시 (기존 S4 + S10 갤러리 흡수)
// 6탭. 각 탭: 대표 1 + 보조 ≤2 (탭당 이미지 ≤3). 라이트박스 확대. 이미지는 업종별로 중복 없이 배정.
import { useState } from 'react'
import { AX_INDUSTRY_TABS, ax, type AxImage } from '../../data/axShowcase'
import { AxImg, ProtoBadge, SectionHead } from './axFrames'
import AxLightbox from './AxLightbox'

export default function AxIndustryShowcase() {
  const [tab, setTab] = useState(0)
  const [lb, setLb] = useState<AxImage | null>(null)
  const t = AX_INDUSTRY_TABS[tab]
  const [mainNo, ...subNos] = t.imageNos
  const main = ax(mainNo)
  return (
    <section id="industry" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
        <SectionHead
          dark
          eyebrow="AX Showcase"
          title={<>AX는 어려운 기술이 아니라, 우리 회사의 일이 <span className="text-teal-300">실제 화면으로 움직이는 것</span>입니다</>}
          desc="업종별로 직접 설계·구현한 가상 업종 기반 프로토타입 화면입니다. 실제 구축 범위는 기업 인터뷰 후 결정됩니다."
        />

        {/* 업종 탭 */}
        <div role="tablist" aria-label="업종별 구축 화면" className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {AX_INDUSTRY_TABS.map((it, i) => {
            const on = i === tab
            return (
              <button
                key={it.key}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(i)}
                className={`shrink-0 rounded-full px-4 py-2 text-[0.9rem] font-bold transition-colors ${on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10'}`}
              >
                {it.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
          {/* 설명 */}
          <div>
            <h3 className="text-[1.3rem] font-black tracking-tight text-white">{t.label}</h3>
            <p className="mt-2.5 text-[0.98rem] leading-relaxed text-slate-300">{t.desc}</p>
            <p className="mt-3 text-[0.78rem] font-black text-slate-400">이 업종의 기존 문제</p>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-300">{main.problem}</p>
            <p className="mt-3 text-[0.78rem] font-black text-slate-400">구축되는 핵심 기능</p>
            <ul className="mt-1 space-y-1.5">
              {main.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2 text-[0.92rem] leading-snug text-slate-300"><span aria-hidden className="mt-0.5 text-teal-300">✓</span>{f}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ProtoBadge />
              <span className="text-[0.78rem] font-semibold text-slate-500">구현 수준 · {main.level}</span>
            </div>
          </div>

          {/* 이미지 — 대표 1(contain) + 보조 ≤2(모바일 가로 스크롤) */}
          <div>
            <button type="button" onClick={() => setLb(main)} className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl transition-transform hover:-translate-y-0.5" aria-label={`${main.screen} 확대 보기`}>
              <AxImg image={main} sizes="(min-width:1024px) 640px, 100vw" className="mx-auto max-h-[52vh] w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
            </button>
            {subNos.length > 0 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {subNos.map((no) => {
                  const im = ax(no)
                  return (
                    <button key={no} type="button" onClick={() => setLb(im)} className="group relative w-[46%] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-lg transition-transform hover:-translate-y-0.5 sm:w-[47%]" aria-label={`${im.screen} 확대 보기`}>
                      <span className="flex h-32 items-center justify-center sm:h-40">
                        <AxImg image={im} sizes="300px" className="max-h-full w-full object-contain object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
                      </span>
                      <span aria-hidden className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-slate-900/70 text-white">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M15 3h6v6M21 3l-8 8M9 21H3v-6M3 21l8-8" /></svg>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
            <p className="mt-2.5 text-right text-[0.72rem] font-medium text-slate-500">화면을 누르면 기능 설명과 함께 크게 볼 수 있습니다</p>
          </div>
        </div>
      </div>
      <AxLightbox image={lb} onClose={() => setLb(null)} />
    </section>
  )
}
