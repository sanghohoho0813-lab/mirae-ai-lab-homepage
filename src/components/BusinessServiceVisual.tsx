// 대표자용 서비스몰 상품 배너(썸네일) — 실사 사진 대신 CSS/HTML 로 만든 "상품 배너형" 비주얼.
//  - imageSrc 가 있으면 실제 이미지(<img>)를 보여줍니다.
//    (예: '/assets/business-services/funding-consulting.png' → public/assets/business-services/…)
//  - 없으면 어두운 네이비 배경 + 큰 상품 키워드 + 결과 문구 + 상품별 색상 포인트 + 작은 그래픽.
// 부모가 비율(aspect) 컨테이너를 주고, 이 컴포넌트는 h-full w-full 로 채웁니다.
// imageSrc 파일이 없거나 로드 실패하면 자동으로 CSS 배너로 폴백합니다(깨진 이미지 방지).
import { useState } from 'react'

export type BusinessVisualType = 'hero' | 'funding' | 'gov' | 'venture' | 'mvp' | 'lab' | 'full'
export type VisualAccent = 'blue' | 'sky' | 'indigo' | 'cyan' | 'slate'

type Props = {
  type: BusinessVisualType
  title?: string
  subtitle?: string
  accent?: VisualAccent
  imageSrc?: string
  alt?: string
  /** 배너 좌상단 태그 라벨 (예: 카테고리). 기본 '서비스 패키지' */
  tag?: string
  /** 크게: 상세 상단 배너 등에서 텍스트를 키움 */
  size?: 'card' | 'hero'
  /** 이미지 맞춤: cover=상단 고정 크롭(카드), contain=전체 표시(상세) */
  fit?: 'cover' | 'contain'
  /** 카드 썸네일 단순화 — 부제·모티프 그래픽 숨기고 태그+대표카피만 (첫인상 전용) */
  minimal?: boolean
}

const accentMap: Record<VisualAccent, { glow: string; chip: string; bar: string; motif: string }> = {
  blue: { glow: 'bg-blue-500/30', chip: 'bg-blue-500/20 text-blue-100', bar: 'bg-blue-400', motif: 'text-blue-300/70' },
  sky: { glow: 'bg-sky-500/30', chip: 'bg-sky-500/20 text-sky-100', bar: 'bg-sky-400', motif: 'text-sky-300/70' },
  indigo: { glow: 'bg-indigo-500/30', chip: 'bg-indigo-500/20 text-indigo-100', bar: 'bg-indigo-400', motif: 'text-indigo-300/70' },
  cyan: { glow: 'bg-cyan-500/30', chip: 'bg-cyan-500/20 text-cyan-100', bar: 'bg-cyan-400', motif: 'text-cyan-300/70' },
  slate: { glow: 'bg-slate-400/25', chip: 'bg-white/10 text-slate-200', bar: 'bg-slate-400', motif: 'text-slate-300/70' },
}

// 상품별 작은 그래픽 (배너 우상단, 은은하게)
function Motif({ type }: { type: BusinessVisualType }) {
  const doc = (
    <div className="w-11 rounded-md bg-white/10 p-1.5 ring-1 ring-inset ring-white/10">
      <div className="space-y-1">
        <div className="h-1 w-full rounded bg-white/40" />
        <div className="h-1 w-4/5 rounded bg-white/25" />
        <div className="h-1 w-3/5 rounded bg-white/25" />
      </div>
    </div>
  )
  switch (type) {
    case 'funding':
      return (
        <div className="flex items-end gap-1.5">
          {doc}
          <span className="rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-black text-white">✓</span>
        </div>
      )
    case 'gov':
      return (
        <div className="flex items-start gap-1.5">
          {doc}
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-[2px] bg-white/25" />
            ))}
          </div>
        </div>
      )
    case 'venture':
      return (
        <div className="flex items-end gap-1">
          {[10, 16, 24, 32].map((h, i) => (
            <span key={i} className="w-2 rounded-t bg-white/30" style={{ height: h }} />
          ))}
        </div>
      )
    case 'mvp':
      return (
        <div className="w-14 overflow-hidden rounded-md bg-white/10 ring-1 ring-inset ring-white/10">
          <div className="flex gap-0.5 bg-white/10 px-1.5 py-1">
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="h-1 w-1 rounded-full bg-white/30" />
          </div>
          <div className="space-y-1 p-1.5">
            <div className="h-1 w-2/3 rounded bg-white/40" />
            <span className="inline-block rounded bg-white/25 px-1 text-[9px] font-bold text-white">▶</span>
          </div>
        </div>
      )
    case 'lab':
      return (
        <div className="space-y-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-[11px] font-black text-white/70">✓</span>
              <span className="h-1 w-8 rounded bg-white/25" />
            </div>
          ))}
        </div>
      )
    case 'full':
    default:
      return (
        <div className="flex items-center gap-1 text-[10px] font-bold text-white/70">
          <span className="rounded bg-white/10 px-1 py-0.5">자금</span>→
          <span className="rounded bg-white/10 px-1 py-0.5">인증</span>→
          <span className="rounded bg-white/10 px-1 py-0.5">MVP</span>
        </div>
      )
  }
}

export default function BusinessServiceVisual({ type, title, subtitle, accent = 'blue', imageSrc, alt, tag = '서비스 패키지', size = 'card', fit = 'cover', minimal = false }: Props) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imageSrc && !imgFailed) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={alt ?? title ?? ''}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className={`h-full w-full object-top ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
        />
      </div>
    )
  }

  const a = accentMap[accent]
  const titleSize = size === 'hero' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-900">
      {/* accent glow */}
      <div aria-hidden className={`absolute -right-10 -top-12 h-40 w-40 rounded-full blur-2xl ${a.glow}`} />
      <div aria-hidden className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
      {/* motif */}
      {!minimal && (
        <div className={`absolute right-4 top-4 ${a.motif}`}>
          <Motif type={type} />
        </div>
      )}
      {/* text */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${a.chip}`}>{tag}</span>
        <p className={`mt-2 font-black leading-tight tracking-tight text-white ${titleSize}`}>{title}</p>
        {!minimal && subtitle && <p className="mt-1.5 text-xs font-medium text-slate-300 sm:text-[0.8rem]">{subtitle}</p>}
      </div>
      <div aria-hidden className={`absolute inset-x-0 bottom-0 h-1 ${a.bar}`} />
    </div>
  )
}
