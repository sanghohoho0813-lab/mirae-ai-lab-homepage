// AX SHOWCASE v2 라이트박스 — 업종별 화면(대표·PC·모바일·보조) 좌우 순회 + 모바일 스와이프.
// ESC·닫기 버튼·배경 클릭으로 닫힘, 세로 이미지는 object-contain 전체 노출.
import { useEffect, useRef, useState } from 'react'
import { AX_DISCLAIMER, type LightItem, type ShowcaseIndustry } from '../../data/axShowcase'

const KIND_LABEL: Record<LightItem['kind'], string> = {
  showcase: '대표 화면',
  pc: '관리자 웹 화면',
  mobile: '현장·모바일 화면',
  gallery: '추가 화면',
}

export default function AxShowcaseLightbox({
  items,
  index,
  industry,
  onIndex,
  onClose,
}: {
  items: LightItem[]
  index: number
  industry: ShowcaseIndustry | null
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const open = index >= 0 && index < items.length && !!industry
  const touchX = useRef<number | null>(null)
  const [fill, setFill] = useState(false) // 전체 보기(contain) ↔ 화면 채우기(cover)
  const total = items.length
  const go = (d: number) => onIndex((index + d + total) % total)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, total])

  if (!open || !industry) return null
  const item = items[index]
  const portrait = item.h > item.w

  return (
    <div role="dialog" aria-modal="true" aria-label={`${industry.label} ${item.caption} 확대 보기`} className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div aria-hidden className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

      {/* 좌우 이동 (데스크톱) */}
      {total > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="이전 화면" className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30 sm:grid">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="다음 화면" className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30 sm:grid">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[90vh] min-h-[60vh] w-full max-w-[92vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <div className="absolute right-3 top-3 z-10 flex gap-1.5">
          {!portrait && (
            <button type="button" onClick={() => setFill((v) => !v)} aria-label={fill ? '전체 보기' : '화면 채우기'} title={fill ? '전체 보기' : '화면 채우기'} className="grid h-9 w-9 place-items-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900">
              {fill ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" /></svg>
              )}
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="닫기" className="grid h-9 w-9 place-items-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* 이미지 — 최대한 넓게(85vh), 전체 보기(contain) ↔ 화면 채우기(cover) */}
        <div className={`grid min-h-0 flex-1 place-items-center overflow-auto bg-slate-100 p-2 sm:p-3 ${portrait ? 'md:max-w-[44%]' : ''}`}>
          <img
            src={item.src}
            srcSet={`${item.srcSm} ${portrait ? item.w : 960}w, ${item.src} ${item.w}w`}
            sizes="(min-width: 768px) 80vw, 100vw"
            alt={item.alt}
            width={item.w}
            height={item.h}
            className={`rounded-lg shadow-lg ${fill ? 'h-[84vh] w-full object-cover' : `h-auto max-h-[84vh] object-contain ${portrait ? 'w-auto' : 'w-full'}`}`}
          />
        </div>

        {/* 메타 패널 */}
        <div className="flex w-full shrink-0 flex-col gap-3 overflow-auto border-t border-slate-200 p-5 md:w-[300px] md:border-l md:border-t-0">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[0.78rem] font-black text-teal-700 ring-1 ring-inset ring-teal-200">{KIND_LABEL[item.kind]}</span>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[0.76rem] font-bold text-slate-500">사진 {item.no}</span>
            </span>
            {total > 1 && <span className="text-[0.78rem] font-bold tabular-nums text-slate-400">{index + 1} / {total}</span>}
          </div>
          <div>
            <p className="text-[0.8rem] font-bold text-slate-400">{industry.brand ? `${industry.brand} · ${industry.label}` : industry.label}</p>
            <h3 className="mt-0.5 text-[1.1rem] font-black leading-snug text-slate-900">{item.caption}</h3>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-slate-500">{industry.desc}</p>
          </div>
          <div>
            <p className="text-[0.78rem] font-black text-slate-500">주요 기능</p>
            <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
              {industry.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[0.84rem] leading-snug text-slate-600"><span aria-hidden className="mt-0.5 text-teal-500">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <p className="text-[0.8rem] font-bold text-slate-700">구현 수준 · <span className="text-teal-600">{industry.prototypeLevel}</span></p>
          {total > 1 && <p className="text-center text-[0.72rem] font-medium text-slate-400 sm:hidden">← 좌우로 넘겨 같은 업종 화면을 볼 수 있어요 →</p>}
          <p className="mt-auto border-t border-slate-100 pt-3 text-[0.72rem] leading-relaxed text-slate-400">{AX_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  )
}
