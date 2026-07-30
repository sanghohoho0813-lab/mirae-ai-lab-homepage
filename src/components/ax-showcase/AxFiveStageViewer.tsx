// 업종별 5장 뷰어 — 5장을 세로로 나열하지 않고 한 번에 한 장만 크게 보여준다.
// PC: 상단 단계 탭 + 큰 이미지 + 좌우 버튼 + 하단 썸네일 5개
// 모바일: 상단 짧은 단계칩 + 큰 이미지 + 좌우 스와이프 + 1/5 표시
// 이미지를 누르면 전체화면(PhotoSwipe). 확대 중에는 이동보다 팬(pan)이 우선한다.
// 성능: 현재 이미지 + 다음 1장만 미리 받는다. 다른 업종 이미지는 DOM에 렌더링하지 않는다.
import { useEffect, useRef, useState } from 'react'
import type { AxV2Industry } from '../../data/axIndustryShowcaseV2'
import AxPhotoSwipe, { type AxPswpSlide } from '../ax/AxPhotoSwipe'

export default function AxFiveStageViewer({ industry }: { industry: AxV2Industry }) {
  const [idx, setIdx] = useState(0)
  const [pswpOpen, setPswpOpen] = useState(false)
  const touchX = useRef<number | null>(null)
  const touchY = useRef<number | null>(null)

  // 업종이 바뀌면 1단계부터 다시 시작한다.
  useEffect(() => { setIdx(0) }, [industry.slug])

  const total = industry.stages.length
  const cur = industry.stages[Math.min(idx, total - 1)]

  // 다음 1장만 미리 받는다.
  useEffect(() => {
    const next = industry.stages[idx + 1]
    if (!next) return
    const im = new Image()
    im.src = next.img.srcSm
  }, [industry, idx])

  const go = (d: number) => setIdx((p) => Math.min(total - 1, Math.max(0, p + d)))

  const slides: AxPswpSlide[] = industry.stages.map((s) => ({
    src: s.img.src,
    width: s.img.w,
    height: s.img.h,
    alt: s.img.alt,
    caption: `${industry.icon} ${industry.displayName} · ${s.no}단계 ${s.label}`,
  }))

  return (
    <div className="rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-3 shadow-xl shadow-slate-950/40 sm:p-5">
      {/* 단계 선택 — 모바일은 가로 2열 칩, PC는 5열 진행바 */}
      <div role="tablist" aria-label="AX 5단계" className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-1.5">
        {industry.stages.map((s, i) => {
          const on = i === idx
          return (
            <button
              key={s.no}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setIdx(i)}
              className={`flex min-h-[44px] items-center justify-center gap-1.5 break-keep rounded-lg px-2 py-1.5 text-[1.1rem] font-bold leading-tight transition-colors sm:text-[1.0rem] ${
                on ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-400 ring-1 ring-inset ring-white/10 hover:text-white'
              }`}
            >
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[1.1rem] sm:text-[1.0rem] font-black ${on ? 'bg-slate-900/15 text-slate-900' : 'bg-white/10 text-slate-300'}`}>{s.no}</span>
              <span className="truncate">{s.label}</span>
            </button>
          )
        })}
      </div>

      {/* 큰 이미지 한 장 */}
      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setPswpOpen(true)}
          aria-label={`${industry.displayName} ${cur.no}단계 ${cur.label} 화면 크게 보기`}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY }}
          onTouchEnd={(e) => {
            if (touchX.current === null || touchY.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            const dy = e.changedTouches[0].clientY - touchY.current
            touchX.current = null
            touchY.current = null
            // 세로 스크롤과 충돌하지 않도록 가로 이동이 분명할 때만 단계 이동
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
          }}
          // 높이를 고정한다 — 이미지가 늦게 로드돼도 아래 내용이 밀리지 않아야
          // 뒤로가기 스크롤 복원 위치가 어긋나지 않는다.
          className="group flex h-[248px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-1.5 transition-colors hover:border-teal-400/40 sm:h-[416px] sm:p-2 lg:h-[486px]"
        >
          <img
            key={cur.img.src}
            src={cur.img.src}
            srcSet={`${cur.img.srcSm} 960w, ${cur.img.src} ${cur.img.w}w`}
            sizes="(min-width:1024px) 820px, 94vw"
            alt={cur.img.alt}
            width={cur.img.w}
            height={cur.img.h}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </button>

        {/* 좌우 이동 — PC에서 이미지 위에 겹쳐 표시 */}
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx === 0}
          aria-label="이전 단계"
          className="absolute left-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-slate-950/70 text-lg text-white backdrop-blur transition-opacity hover:bg-slate-900 disabled:opacity-25 sm:grid"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={idx === total - 1}
          aria-label="다음 단계"
          className="absolute right-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-slate-950/70 text-lg text-white backdrop-blur transition-opacity hover:bg-slate-900 disabled:opacity-25 sm:grid"
        >
          →
        </button>

        {/* 현재 위치 */}
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-[1.1rem] sm:text-[1.0rem] font-black text-teal-200 ring-1 ring-inset ring-white/15">
          {cur.no} / {total}
        </span>
      </div>

      {/* 단계 제목과 설명 */}
      <div className="mt-3.5">
        <p className="text-[1.1rem] sm:text-[1.0rem] font-black tracking-tight text-teal-300">
          {cur.no}단계 · {cur.label}
        </p>
        <h4 className="mt-1.5 break-keep text-[1.39rem] font-black leading-snug text-white sm:text-[1.35rem]">{cur.title}</h4>
        <p className="mt-2 max-w-3xl break-keep text-[1.2rem] leading-relaxed text-slate-300 sm:text-[1.15rem]">{cur.desc}</p>
        {cur.chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {cur.chips.map((c) => (
              <span key={c} className="rounded-lg bg-white/5 px-2.5 py-1 text-[1.1rem] sm:text-[1.0rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/10">{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* 모바일 좌우 이동 + PC 썸네일 */}
      <div className="mt-3.5 flex items-center gap-2 sm:hidden">
        <button type="button" onClick={() => go(-1)} disabled={idx === 0} className="min-h-[44px] flex-1 rounded-xl border border-white/15 bg-white/5 text-[1.11rem] sm:text-[1.01rem] font-bold text-white disabled:opacity-30">← 이전</button>
        <button type="button" onClick={() => go(1)} disabled={idx === total - 1} className="min-h-[44px] flex-1 rounded-xl border border-white/15 bg-white/5 text-[1.11rem] sm:text-[1.01rem] font-bold text-white disabled:opacity-30">다음 →</button>
      </div>

      <div className="mt-3.5 hidden grid-cols-5 gap-2 sm:grid">
        {industry.stages.map((s, i) => (
          <button
            key={s.no}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`${s.no}단계 ${s.label} 보기`}
            aria-pressed={i === idx}
            className={`overflow-hidden rounded-lg border bg-slate-950 p-1 transition-colors ${
              i === idx ? 'border-teal-400' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <img src={s.img.srcSm} alt="" aria-hidden loading="lazy" decoding="async" className="h-[54px] w-full object-cover object-top opacity-90" />
          </button>
        ))}
      </div>

      <p className="mt-2.5 text-[1.1rem] sm:text-[1.0rem] text-slate-500">이미지를 누르면 전체화면으로 확인할 수 있습니다.</p>

      <AxPhotoSwipe open={pswpOpen} slides={slides} index={idx} onClose={() => setPswpOpen(false)} />
    </div>
  )
}
