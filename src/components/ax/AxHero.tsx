// SECTION 1 — Hero (모바일 우선). 핵심 메시지: 억 단위 정책자금 + 실제 AX 화면 + 공동 참여.
// 모바일에서 첫 화면을 거의 꽉 채운다. 상세페이지 진입 버튼을 Hero에서 명확히 제공한다.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AX_HERO2, type ShowcaseImg } from '../../data/axShowcase'

// Hero 신뢰 바 — 실제 확인된 정보만(App.tsx trustStats 동일 축).
const TRUST = [
  { k: '정책자금 전문회사', v: '대표 컨설턴트 직접 참여' },
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

export default function AxHero({ onShowcase, onProcess }: { onShowcase: () => void; onProcess: () => void }) {
  const [slide, setSlide] = useState(0)
  const active = AX_HERO2.slides[slide]
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[90svh] max-w-6xl flex-col justify-center px-5 py-8 sm:px-6 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-14">
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
          <p className="mt-3 max-w-lg break-keep text-[1.02rem] leading-relaxed text-slate-200 sm:text-[1.08rem]">
            <span className="font-black text-amber-300">1억원 이상</span>을 목표로, 자금을 받을 이유가 보이는 <span className="font-bold text-white">AX 혁신기업</span>으로 바꿉니다.
          </p>
          <p className="mt-3.5 break-keep border-l-2 border-amber-400 pl-3.5 text-[0.95rem] font-bold leading-snug text-amber-100 sm:text-[1rem]">
            대표 컨설턴트 김팀장이 직접 참여해 <span className="text-amber-300">2주</span> 안에 실행 초안을 드립니다.
          </p>
          <p className="mt-2 break-keep text-[0.74rem] leading-relaxed text-slate-500">
            필요자료 접수일부터 14일 기준이며, 심사기간·본개발 일정은 별도입니다.
          </p>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:max-w-lg sm:flex-row">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <button type="button" onClick={onProcess} className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
              2주 실행과정 보기 <span aria-hidden>→</span>
            </button>
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
