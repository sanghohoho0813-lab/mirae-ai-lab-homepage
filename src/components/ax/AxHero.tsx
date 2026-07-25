// SECTION 1 — Hero (모바일 우선). 순서: 고객 문제 → 1억원+AX → 최대 2주 → 월 5개사 → 고지.
// 정책자금 전문회사가 1차 정체성, AX 실행설계가 2차 차별점이 되도록 문장 순서를 고정한다.
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

export default function AxHero({ onShowcase, onProcess }: { onShowcase: () => void; onProcess: () => void }) {
  const [slide, setSlide] = useState(0)
  const active = AX_HERO2.slides[slide]
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 pb-9 pt-6 sm:px-6 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-14">
        {/* 메시지 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.82rem] font-bold text-teal-200 backdrop-blur">
            정책자금 × AX 혁신전환
          </span>
          <h1 className="mt-5 font-black tracking-tight text-[clamp(1.85rem,6.2vw,2.55rem)] leading-[1.2] text-white sm:text-[clamp(2.2rem,4vw,2.9rem)] lg:text-[2.7rem]">
            정책자금, 계속 거절당하거나<br />몇천만원 수준에서 그치셨나요?
          </h1>
          <p className="mt-5 break-keep text-[1rem] font-bold leading-relaxed text-teal-200 sm:text-[1.08rem]">
            이제는 디지털 전환을 넘어 AI 전환, <span className="text-amber-300">AX의 시대</span>입니다.
          </p>
          <p className="mt-3 max-w-xl break-keep text-[1.02rem] leading-relaxed text-slate-200 sm:text-[1.08rem]">
            <span className="font-black text-amber-300">1억원 이상 정책자금</span>을 목표로, 자금을 받을 이유가 보이는 <span className="font-bold text-white">AX 혁신기업 구조</span>를 만듭니다.
          </p>
          <p className="mt-2.5 max-w-xl break-keep text-[0.97rem] leading-relaxed text-slate-300 sm:text-[1.02rem]">
            사업계획서만 준비하는 것이 아닙니다. 자금전략과 실제 업무에 사용할 AX 프로그램을 함께 만듭니다.
          </p>
          <div className="mt-4 max-w-xl break-keep border-l-2 border-amber-400 pl-3.5">
            <p className="text-[0.95rem] leading-snug text-amber-100 sm:text-[1rem]">
              인터뷰와 동시에 설계를 시작합니다. 1~2일 안에 방향을 보여드리고, 5일 안에 MVP 초안을 만듭니다.
            </p>
            <p className="mt-1.5 text-[0.95rem] font-bold leading-snug text-amber-100 sm:text-[1rem]">
              피드백과 보완을 거쳐 <span className="text-amber-300">최대 2주</span> 안에 최종 결과물 완성을 목표로 합니다.
            </p>
          </div>
          <p className="mt-2.5 max-w-xl break-keep text-[0.82rem] leading-relaxed text-slate-500">
            자료가 모두 접수되고 의사결정이 원활한 경우의 목표 일정입니다. 정책기관 심사기간과 별도 본개발 일정은 포함하지 않습니다.
          </p>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:max-w-lg sm:flex-row">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <button type="button" onClick={onProcess} className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
              2주 진행과정 보기 <span aria-hidden>→</span>
            </button>
          </div>
          <button type="button" onClick={onShowcase} className="mt-4 inline-flex items-center gap-1 text-[0.9rem] font-semibold text-teal-200/90 underline underline-offset-4 transition-colors hover:text-teal-100">
            AX 화면 먼저 보기 <span aria-hidden>↓</span>
          </button>

          {/* 신뢰 바 — 선별 진행 사실을 한 줄로만 */}
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:gap-4 sm:p-3.5">
            <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필" loading="lazy" decoding="async" width={96} height={96} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-amber-400/40 sm:h-12 sm:w-12" />
            <div className="min-w-0 flex-1">
              <p className="break-keep text-[0.85rem] font-black leading-snug text-white sm:text-[0.9rem]">
                월 5개사 선별 · 김팀장 직접 참여 · 최대 2주 완성 목표
              </p>
              <p className="mt-0.5 break-keep text-[0.82rem] leading-snug text-slate-400">
                정책자금 전문 · 누적 자금조달 지원 100억원+ · 개발 담당자 공동 참여
              </p>
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
                  className={`rounded-lg px-2.5 py-1.5 text-[0.82rem] font-bold transition-colors ${i === slide ? 'bg-white/10 text-white ring-1 ring-inset ring-teal-400/40' : 'text-slate-400 hover:bg-white/5'}`}>
                  {s.brand}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-right text-[0.82rem] font-medium text-slate-500">직접 설계·구현한 가상 업종 기반 프로토타입 화면 예시</p>
        </div>
      </div>
    </section>
  )
}
