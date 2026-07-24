// SECTION 1 — Hero (모바일 우선). 핵심 메시지: 억 단위 정책자금 + 실제 AX 화면 + 공동 참여.
// 모바일에서 첫 화면을 거의 꽉 채운다. 상세페이지 진입 버튼을 Hero에서 명확히 제공한다.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AX_HERO2, type ShowcaseImg } from '../../data/axShowcase'

// Hero 신뢰 바 — 실제 확인된 정보만(App.tsx trustStats 동일 축).
const TRUST = [
  { k: '대표 컨설턴트 직접 참여', v: '정책자금 전략 설계' },
  { k: '누적 자금조달 지원 100억원+', v: '지원금·세금 환급 포함' },
  { k: '개발 담당자 공동 참여', v: 'AX 화면·MVP 구축' },
]

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
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 py-8 sm:px-6 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-14">
        {/* 메시지 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.82rem] font-bold text-teal-200 backdrop-blur">
            정책자금 × 업종 맞춤 AX
          </span>
          <h1 className="mt-5 font-black tracking-tight text-[clamp(1.95rem,6.6vw,2.7rem)] leading-[1.2] sm:text-[clamp(2.3rem,4.2vw,3rem)] lg:text-[2.85rem]">
            <span className="block text-white"><span className="text-amber-300">억 단위 정책자금</span> 조달을 목표로,</span>
            <span className="mt-2 block text-white">심사에서 실제로 보여줄</span>
            <span className="block text-teal-300">AX 화면까지 만듭니다.</span>
          </h1>
          <p className="mt-5 max-w-lg break-keep text-[1rem] leading-relaxed text-slate-300 sm:text-[1.06rem]">
            사업계획서 작성에서 끝나지 않습니다. 자금전략을 실제 업무 흐름과 작동하는 화면으로 구현합니다.
          </p>
          <p className="mt-3.5 break-keep border-l-2 border-amber-400 pl-3.5 text-[0.95rem] font-bold leading-snug text-amber-100 sm:text-[1rem]">
            자금 컨설턴트와 개발 담당자가 처음부터 같은 프로젝트로 참여합니다.
          </p>

          {/* CTA — 진단 우선, 상세페이지 진입 명확 */}
          <div className="mt-7 flex flex-col gap-3 sm:max-w-lg sm:flex-row">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <Link to="/business-services/funding-consulting" className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
              프로그램 자세히 보기 <span aria-hidden>→</span>
            </Link>
          </div>
          <button type="button" onClick={onShowcase} className="mt-4 inline-flex items-center gap-1 text-[0.9rem] font-semibold text-teal-200/90 underline underline-offset-4 transition-colors hover:text-teal-100">
            AX 화면 먼저 보기 <span aria-hidden>↓</span>
          </button>

          {/* 신뢰 바 — 대표자 사진 + 검증된 정보 */}
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:gap-4 sm:p-3.5">
            <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필" loading="lazy" decoding="async" width={96} height={96} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-amber-400/40 sm:h-12 sm:w-12" />
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-3">
              {TRUST.map((t) => (
                <div key={t.k} className="min-w-0">
                  <p className="truncate text-[0.8rem] font-black text-white">{t.k}</p>
                  <p className="truncate text-[0.72rem] text-slate-400">{t.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 데스크톱 — 대표 AX 화면 (모바일 숨김) */}
        <div className="mt-9 hidden lg:mt-0 lg:block" aria-label="직접 구현한 업무시스템 화면 예시">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl ring-1 ring-black/20">
            <HeroImg img={active.img} className="w-full object-contain" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[0.82rem] font-bold text-teal-200">{active.brand} <span className="font-medium text-slate-400">· {active.label}</span></p>
            <div role="tablist" aria-label="대표 화면 전환" className="flex gap-2">
              {AX_HERO2.slides.map((s, i) => (
                <button key={s.brand} type="button" role="tab" aria-selected={i === slide} aria-label={`${s.brand} 화면 보기`} onClick={() => setSlide(i)}
                  className={`rounded-lg px-2.5 py-1.5 text-[0.76rem] font-bold transition-colors ${i === slide ? 'bg-white/10 text-white ring-1 ring-inset ring-teal-400/40' : 'text-slate-400 hover:bg-white/5'}`}>
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
