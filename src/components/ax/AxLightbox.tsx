// 이미지 확대 모달 — 화면 메타(업종·화면명·문제·기능·구현수준)와 신뢰성 고지 표시
import { useEffect } from 'react'
import { AX_DISCLAIMER, type AxImage } from '../../data/axShowcase'
import { AxImg, ProtoBadge } from './axFrames'

export default function AxLightbox({ image, onClose }: { image: AxImage | null; onClose: () => void }) {
  useEffect(() => {
    if (!image) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [image, onClose])

  if (!image) return null
  const portrait = image.h > image.w
  return (
    <div role="dialog" aria-modal="true" aria-label={`${image.screen} 확대 보기`} className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div aria-hidden className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="닫기" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className={`grid min-h-0 flex-1 place-items-center overflow-auto bg-slate-100 p-3 sm:p-5 ${portrait ? 'md:max-w-[46%]' : ''}`}>
          <AxImg image={image} sizes="(min-width: 768px) 60vw, 100vw" className={`h-auto rounded-lg shadow-lg ${portrait ? 'max-h-[60vh] w-auto md:max-h-[82vh]' : 'w-full'}`} />
        </div>
        <div className="w-full shrink-0 space-y-3 overflow-auto border-t border-slate-200 p-5 md:w-[300px] md:border-l md:border-t-0">
          <ProtoBadge />
          <div>
            <p className="text-[0.78rem] font-bold text-slate-400">{image.industry}</p>
            <h3 className="mt-0.5 text-[1.1rem] font-black leading-snug text-slate-900">{image.screen}</h3>
          </div>
          <div>
            <p className="text-[0.78rem] font-black text-slate-500">해결하려는 문제</p>
            <p className="mt-1 text-[0.88rem] leading-relaxed text-slate-600">{image.problem}</p>
          </div>
          <div>
            <p className="text-[0.78rem] font-black text-slate-500">주요 기능</p>
            <ul className="mt-1 space-y-1">
              {image.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[0.88rem] leading-snug text-slate-600"><span aria-hidden className="mt-0.5 text-blue-500">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <p className="text-[0.8rem] font-bold text-slate-700">구현 수준 · <span className="text-blue-600">{image.level}</span></p>
          <p className="border-t border-slate-100 pt-3 text-[0.72rem] leading-relaxed text-slate-400">{AX_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  )
}
