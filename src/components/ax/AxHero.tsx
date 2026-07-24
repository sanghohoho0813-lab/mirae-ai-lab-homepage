// SECTION 1 — Hero: "흩어진 업무 → 실제 사용하는 AX 화면" 을 첫 화면에서 크게 전달
// 데스크톱: 대표 이미지(FieldCare 쇼케이스) 크게 + 수동 전환 탭(LeaseFlow/GarageOS). 모바일: 세로 현장 화면(109) 크게.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AX_HERO2, type ShowcaseImg } from '../../data/axShowcase'

const trustStats: { value: string; label: string }[] = [
  { value: '100억원+', label: '누적 자금조달 지원' },
  { value: '9년', label: '세무·노무·법무·자금 경험' },
  { value: 'ISO 3종', label: '9001·14001·45001 심사원' },
  { value: '직접 구현', label: '화면·프로토타입 자체 제작' },
]

function HeroImg({ img, eager, className }: { img: ShowcaseImg; eager?: boolean; className?: string }) {
  const portrait = img.h > img.w
  return (
    <img
      src={img.src}
      srcSet={`${img.srcSm} ${portrait ? img.w : 960}w, ${img.src} ${img.w}w`}
      sizes={portrait ? '(min-width:1024px) 300px, 88vw' : '(min-width:1024px) 640px, 100vw'}
      alt={img.alt}
      width={img.w}
      height={img.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}

export default function AxHero({ onPrograms, onGrowthModules }: { onPrograms: () => void; onGrowthModules: () => void }) {
  const [slide, setSlide] = useState(0)
  const active = AX_HERO2.slides[slide]
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-9 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8 lg:py-7">
        {/* 왼쪽 — 메시지 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-teal-200 backdrop-blur">
            {AX_HERO2.eyebrow}
          </span>
          <h1 className="mt-4 text-[1.7rem] font-black leading-[1.22] tracking-tight text-white sm:text-[2.3rem] sm:leading-[1.16]">
            <span className="text-slate-300">{AX_HERO2.headlineLead}</span><br />
            {AX_HERO2.headlineTop} <span className="text-teal-300">{AX_HERO2.headlineAccent}</span>{AX_HERO2.headlineTail}
          </h1>
          <p className="mt-3 max-w-xl text-[0.96rem] leading-relaxed text-slate-300 sm:text-[1rem]">{AX_HERO2.sub}</p>
          {/* 짧은 강조 문구 — 핵심 포지셔닝 메시지 */}
          <p className="mt-3 border-l-2 border-teal-400 pl-3.5 text-[0.96rem] font-black leading-snug text-white sm:text-[1.02rem]">{AX_HERO2.emphasis}</p>
          {/* 핵심 라벨 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {AX_HERO2.labels.map((w, i) => (
              <span key={w} className={`rounded-lg px-2.5 py-1 text-[0.8rem] font-black ${i === AX_HERO2.labels.length - 1 ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-200 ring-1 ring-inset ring-white/15'}`}>{w}</span>
            ))}
          </div>
          {/* CTA 위계: Primary(강한 파랑) · Secondary(아웃라인) · 텍스트 링크 2개 */}
          <div className="mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <button type="button" onClick={onPrograms} className="flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
              A·B 프로그램 비교
            </button>
          </div>
          {/* 보조 텍스트 링크 2개 — 버튼보다 낮은 위계 (모바일 2열, sm 이상 한 줄) */}
          <div className="mt-3 grid max-w-md grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:max-w-none sm:gap-5">
            <Link to="/business-services/funding-consulting" className="inline-flex items-center gap-1 text-[0.86rem] font-semibold text-teal-200/90 underline underline-offset-4 transition-colors hover:text-teal-100">
              자금조달 전략 자세히 보기 <span aria-hidden>→</span>
            </Link>
            <button type="button" onClick={onGrowthModules} className="inline-flex items-center gap-1 text-left text-[0.86rem] font-semibold text-teal-200/90 underline underline-offset-4 transition-colors hover:text-teal-100">
              인증·지원금 성장 모듈 보기 <span aria-hidden>→</span>
            </button>
          </div>
          <dl className="mt-5 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 border-t border-white/10 pt-4 sm:grid-cols-4">
            {trustStats.map((s) => (
              <div key={s.label}>
                <dd className="text-[1.2rem] font-black leading-none tracking-tight text-white">{s.value}</dd>
                <dt className="mt-1 text-[0.72rem] font-medium leading-snug text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* 오른쪽 — 대표 이미지 크게 + 수동 전환 (데스크톱) */}
        <div className="relative hidden lg:block" aria-label="직접 구현한 업무시스템 화면 예시">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl ring-1 ring-black/20">
            <HeroImg img={active.img} eager className="w-full object-contain" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[0.82rem] font-bold text-teal-200">{active.brand} <span className="font-medium text-slate-400">· {active.label}</span></p>
            <div role="tablist" aria-label="대표 화면 전환" className="flex gap-1.5">
              {AX_HERO2.slides.map((s, i) => (
                <button
                  key={s.brand}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`${s.brand} ${s.label} 화면 보기`}
                  onClick={() => setSlide(i)}
                  className={`h-2.5 rounded-full transition-all ${i === slide ? 'w-6 bg-teal-400' : 'w-2.5 bg-white/25 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
          {/* 브랜드 전환 탭(라벨형) */}
          <div className="mt-2.5 flex gap-2">
            {AX_HERO2.slides.map((s, i) => (
              <button
                key={s.brand}
                type="button"
                onClick={() => setSlide(i)}
                className={`flex-1 rounded-lg px-2.5 py-1.5 text-[0.74rem] font-bold transition-colors ${i === slide ? 'bg-white/10 text-white ring-1 ring-inset ring-teal-400/40' : 'text-slate-400 hover:bg-white/5'}`}
              >
                {s.brand}
              </button>
            ))}
          </div>
          <p className="mt-3 text-right text-[0.72rem] font-medium text-slate-500">직접 설계·구현한 가상 업종 기반 프로토타입 화면 예시</p>
        </div>

        {/* 모바일 — 세로 현장 화면(109) 크게, contain */}
        <div className="lg:hidden">
          <div className="mx-auto w-[86%] max-w-[300px] overflow-hidden rounded-[1.8rem] border-[6px] border-slate-800 bg-slate-800 shadow-2xl">
            <div className="overflow-hidden rounded-[1.35rem]">
              <HeroImg img={AX_HERO2.mobile} eager className="w-full object-contain" />
            </div>
          </div>
          <p className="mt-2.5 text-center text-[0.78rem] font-bold text-teal-200">{AX_HERO2.mobile.caption}</p>
          <p className="mt-1 text-center text-[0.72rem] font-medium text-slate-500">직접 설계·구현한 가상 업종 기반 프로토타입 예시</p>
        </div>
      </div>
    </section>
  )
}
