// AX 쇼케이스 공용 프레임/이미지 유틸 — 브라우저·모바일 목업 프레임과 반응형 이미지
import type { AxImage } from '../../data/axShowcase'

/** srcSet 반응형 이미지 (가로형 800/1600w · 세로형 480/853w) */
export function AxImg({ image, sizes = '(min-width: 1024px) 50vw, 100vw', className = '', eager = false }: { image: AxImage; sizes?: string; className?: string; eager?: boolean }) {
  const [smW, fullW] = image.w >= image.h ? [800, 1600] : [480, 853]
  return (
    <img
      src={image.src}
      srcSet={`${image.srcSm} ${smW}w, ${image.src} ${fullW}w`}
      sizes={sizes}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      width={image.w}
      height={image.h}
      className={className}
    />
  )
}

/** 브라우저 크롬 프레임 */
export function BrowserShell({ label, children, className = '' }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 ${className}`}>
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </span>
        {label && <span className="ml-1 flex-1 truncate rounded-md bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-inset ring-slate-200">{label}</span>}
      </div>
      {children}
    </div>
  )
}

/** 모바일 베젤 프레임 (세로형 스크린샷용) */
export function PhoneShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.9rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl ring-1 ring-black/20 ${className}`}>
      <div className="overflow-hidden rounded-[1.45rem]">{children}</div>
    </div>
  )
}

/** 섹션 머리말 (eyebrow + 제목 + 보조설명) */
export function SectionHead({ eyebrow, title, desc, center = false, dark = false }: { eyebrow: string; title: React.ReactNode; desc?: React.ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      {/* 한글 머리말에는 자간을 벌리지 않는다 — 모바일은 10% 크게, PC는 기존 크기 유지 */}
      <p className={`text-[1.05rem] font-bold tracking-tight sm:text-sm ${dark ? 'text-teal-300' : 'text-blue-600'}`}>{eyebrow}</p>
      <h2 className={`mt-2 break-keep text-[1.65rem] font-extrabold leading-[1.25] tracking-tight sm:text-[2.1rem] ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      {desc && <p className={`mt-3 max-w-2xl break-keep text-[1.1rem] leading-relaxed sm:text-[1rem] ${dark ? 'text-slate-300' : 'text-slate-500'} ${center ? 'mx-auto' : ''}`}>{desc}</p>}
    </div>
  )
}

/** 프로토타입 표기 배지 */
export function ProtoBadge({ text = '가상 업종 기반 프로토타입' }: { text?: string }) {
  return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[0.82rem] font-black text-blue-700 ring-1 ring-inset ring-blue-200">{text}</span>
}
