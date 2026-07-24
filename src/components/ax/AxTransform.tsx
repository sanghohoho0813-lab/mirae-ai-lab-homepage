// SECTION 2 — 흩어진 업무를 실제 AX 화면으로 바꿉니다 (기존 S2 문제제기 + S5 문제→화면 통합)
// 업종 탭별 4단계: 기존 방식(Before 이미지) → 업무 흐름 정리 → 화면 설계 → 작동 프로토타입(이미지)
// Before 이미지(36·48·60)는 이 섹션에서만 사용. Before와 Prototype에 같은 이미지 중복 금지.
import { useState } from 'react'
import { AX_TRANSFORM_ASIDE, AX_TRANSFORM_STEPS, AX_TRANSFORM_TABS, ax, type AxImage } from '../../data/axShowcase'
import { AxImg, SectionHead } from './axFrames'
import AxLightbox from './AxLightbox'

export default function AxTransform() {
  const [tab, setTab] = useState(0)
  const [lb, setLb] = useState<AxImage | null>(null)
  const t = AX_TRANSFORM_TABS[tab]
  const before = ax(t.beforeNo)
  const proto = ax(t.protoNo)
  return (
    <section id="transform" className="scroll-mt-16 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-7">
        <SectionHead
          eyebrow="Problem → Screen"
          title={<>흩어진 업무를, <span className="text-blue-600">실제로 사용하는 AX 화면</span>으로 바꿉니다</>}
          desc="기존 문제를 그대로 옮기지 않습니다. 업무 흐름을 다시 정리하고 화면으로 설계해, 작동하는 프로토타입까지 만듭니다."
        />

        {/* 업종 탭 */}
        <div role="tablist" aria-label="업종별 문제→화면" className="mt-6 flex gap-1.5">
          {AX_TRANSFORM_TABS.map((x, i) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[0.88rem] font-bold transition-colors ${i === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        {/* 4단계 진행 바 */}
        <ol className="mt-6 grid gap-2 sm:grid-cols-4">
          {AX_TRANSFORM_STEPS.map((s, i) => (
            <li key={s} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${i === 3 ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[0.72rem] font-black ${i === 3 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>{i + 1}</span>
              <span className="text-[0.86rem] font-bold text-slate-700">{s}</span>
            </li>
          ))}
        </ol>

        {/* Before → Prototype */}
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
            <p className="text-[0.72rem] font-black uppercase tracking-widest text-slate-400">Before · 기존 방식</p>
            <p className="mt-1 text-[1.02rem] font-black leading-snug text-slate-700">“{t.note}”</p>
            <button type="button" onClick={() => setLb(before)} className="group mt-3 block w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-0.5" aria-label={`${before.screen} 확대 보기`}>
              <AxImg image={before} sizes="(min-width:1024px) 560px, 100vw" className="w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
            </button>
            <p className="mt-2.5 text-[0.85rem] leading-relaxed text-slate-500">{before.problem}. 먼저 인터뷰로 업무 흐름을 정리하고 개선 과제를 뽑습니다.</p>
          </div>
          {/* Prototype */}
          <div className="relative rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-4">
            <span aria-hidden className="absolute -left-3 top-1/2 hidden -translate-y-1/2 text-2xl font-black text-blue-300 lg:block">→</span>
            <p className="text-[0.72rem] font-black uppercase tracking-widest text-blue-600">After · 작동 프로토타입</p>
            <p className="mt-1 text-[1.02rem] font-black leading-snug text-slate-900">화면 설계 후, 실제로 움직이는 시스템으로</p>
            <button type="button" onClick={() => setLb(proto)} className="group mt-3 block w-full overflow-hidden rounded-xl border border-slate-200 shadow-md transition-transform hover:-translate-y-0.5" aria-label={`${proto.screen} 확대 보기`}>
              <AxImg image={proto} sizes="(min-width:1024px) 560px, 100vw" className="w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
            </button>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[0.72rem] font-black text-blue-700 ring-1 ring-inset ring-blue-200">가상 업종 기반 프로토타입</span>
              <span className="text-[0.78rem] font-semibold text-slate-500">구현 수준 · {proto.level}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[0.75rem] font-medium text-slate-400">화면을 누르면 해결 문제·주요 기능·구현 수준과 함께 크게 볼 수 있습니다.</p>

        {/* 다른 업종 보조 사례 — 건설·예약 (같은 방식의 확장 예시, 컴팩트) */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-[0.82rem] font-bold text-slate-500"><b className="font-black text-slate-700">같은 방식, 다른 업종</b> — 현장·예약 업무도 관리자 웹과 현장 화면으로 다시 설계합니다.</p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible">
            {[AX_TRANSFORM_ASIDE.construction, AX_TRANSFORM_ASIDE.reservation].map((im) => (
              <figure key={im.src} className="w-[86%] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-auto">
                <span className="block h-40 overflow-hidden sm:h-44">
                  <img src={im.src} srcSet={`${im.srcSm} 960w, ${im.src} ${im.w}w`} sizes="(min-width:1024px) 540px, 86vw" alt={im.alt} width={im.w} height={im.h} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                </span>
                <figcaption className="border-t border-slate-100 px-3.5 py-2 text-[0.82rem] font-bold text-slate-500">{im.caption} · 가상 업종 프로토타입 예시</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <AxLightbox image={lb} onClose={() => setLb(null)} />
    </section>
  )
}
