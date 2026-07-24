// SECTION 1 — Hero (모바일 우선). 첫 화면은 핵심 문장만 크게.
// 모바일: 네이비 그라데이션 + 큰 헤드라인 + 한 줄 설명 + CTA 2개(88~100svh). 실제 화면은 바로 다음 #ax-showcase 에서.
// 데스크톱: 좌측 축약 메시지 + 우측 대표 AX 화면(110/107/101 수동 전환) 크게.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AX_HERO2, type ShowcaseImg } from '../../data/axShowcase'

function HeroImg({ img, className }: { img: ShowcaseImg; className?: string }) {
  return (
    <img
      src={img.src}
      srcSet={`${img.srcSm} 960w, ${img.src} ${img.w}w`}
      sizes="(min-width:1024px) 620px, 100vw"
      alt={img.alt}
      width={img.w}
      height={img.h}
      loading="eager"
      decoding="async"
      className={className}
    />
  )
}

export default function AxHero({ onShowcase }: { onShowcase: () => void }) {
  const [slide, setSlide] = useState(0)
  const active = AX_HERO2.slides[slide]
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* 네이비 그라데이션 + 아주 약한 실루엣(장식 최소화) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 py-10 sm:px-6 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-center lg:gap-10 lg:py-16">
        {/* 메시지 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.82rem] font-bold text-teal-200 backdrop-blur">
            {AX_HERO2.eyebrow}
          </span>
          <h1 className="mt-5 font-black tracking-tight text-[clamp(2.6rem,8.6vw,3.1rem)] leading-[1.12] sm:text-[clamp(2.8rem,5vw,3.4rem)] lg:text-[3.1rem]">
            <span className="block text-white">정책자금 신청에서 끝내지 않습니다.</span>
            <span className="mt-3 block text-slate-300">흩어진 업무를,</span>
            <span className="block text-teal-300">AX 화면으로 바꿉니다.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-slate-300 sm:text-[1.08rem]">
            자금조달 전략부터 클릭형 프로토타입과 작동형 MVP까지 함께 설계합니다.
          </p>
          {/* CTA 2개 */}
          <div className="mt-8 flex flex-col gap-3 sm:max-w-md sm:flex-row">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <button type="button" onClick={onShowcase} className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
              AX 사례 먼저 보기 <span aria-hidden>↓</span>
            </button>
          </div>
        </div>

        {/* 데스크톱 — 대표 AX 화면 크게 + 브랜드 수동 전환 (모바일 숨김) */}
        <div className="mt-10 hidden lg:mt-0 lg:block" aria-label="직접 구현한 업무시스템 화면 예시">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl ring-1 ring-black/20">
            <HeroImg img={active.img} className="w-full object-contain" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[0.82rem] font-bold text-teal-200">{active.brand} <span className="font-medium text-slate-400">· {active.label}</span></p>
            <div role="tablist" aria-label="대표 화면 전환" className="flex gap-2">
              {AX_HERO2.slides.map((s, i) => (
                <button
                  key={s.brand}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`${s.brand} 화면 보기`}
                  onClick={() => setSlide(i)}
                  className={`rounded-lg px-2.5 py-1.5 text-[0.76rem] font-bold transition-colors ${i === slide ? 'bg-white/10 text-white ring-1 ring-inset ring-teal-400/40' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  {s.brand}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-right text-[0.72rem] font-medium text-slate-500">직접 설계·구현한 가상 업종 기반 프로토타입 화면 예시</p>
        </div>
      </div>
    </section>
  )
}
