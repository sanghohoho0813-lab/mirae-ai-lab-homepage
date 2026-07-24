// AX SHOWCASE v2 라이트박스 — 모바일 화질/제스처 개선판.
// 전체 해상도(item.src) 노출 · 더블탭/핀치 확대 · 확대 시 좌우 스와이프 잠금 · 상단 안전영역 닫기.
import { type MouseEvent, type TouchEvent, useEffect, useRef, useState } from 'react'
import { type LightItem, type ShowcaseIndustry } from '../../data/axShowcase'

const KIND_LABEL: Record<LightItem['kind'], string> = {
  showcase: '대표 화면',
  pc: '관리자 웹 화면',
  mobile: '현장·모바일 화면',
  gallery: '추가 화면',
}

const MIN_SCALE = 1
const MAX_SCALE = 4
const DOUBLE_TAP_SCALE = 2.2
const SWIPE_THRESHOLD = 70 // px, 좌우 이미지 이동 확정
const DOUBLE_TAP_MS = 300

type GestureMode = 'none' | 'pan' | 'swipe' | 'pinch'
type Gesture = {
  active: boolean
  mode: GestureMode
  hadTwo: boolean // 제스처 도중 두 손가락이 닿은 적이 있으면 이미지 이동 금지
  startX: number
  startY: number
  lastX: number
  lastY: number
  startTx: number
  startTy: number
  startDist: number
  startScale: number
}
const freshGesture = (): Gesture => ({
  active: false,
  mode: 'none',
  hadTwo: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  startTx: 0,
  startTy: 0,
  startDist: 0,
  startScale: 1,
})

type Pt = { clientX: number; clientY: number }
function touchDist(a: Pt, b: Pt): number {
  const dx = a.clientX - b.clientX
  const dy = a.clientY - b.clientY
  return Math.hypot(dx, dy)
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
  const total = items.length
  const go = (d: number) => {
    if (total > 0) onIndex((index + d + total) % total)
  }

  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [ready, setReady] = useState(false)
  const [errored, setErrored] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [lastSrc, setLastSrc] = useState<string | null>(null)

  const imgRef = useRef<HTMLImageElement>(null)
  const prevSrcRef = useRef<string | null>(null) // 직전에 로드 완료된 전체 이미지 URL
  const gesture = useRef<Gesture>(freshGesture())
  const lastTap = useRef<{ t: number; x: number; y: number }>({ t: 0, x: 0, y: 0 })

  const dismissHint = () => setShowHint(false)

  // 확대 시 팬 이동 한계 계산(이미지 레이아웃 크기 기준, transform 미반영 offset 사용)
  const clampPan = (nx: number, ny: number, s: number) => {
    const el = imgRef.current
    if (!el || s <= 1) return { x: 0, y: 0 }
    const maxX = ((s - 1) * el.offsetWidth) / 2
    const maxY = ((s - 1) * el.offsetHeight) / 2
    return {
      x: Math.max(-maxX, Math.min(maxX, nx)),
      y: Math.max(-maxY, Math.min(maxY, ny)),
    }
  }

  // 키보드(ESC/←→) + body 스크롤 잠금
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, total])

  // 힌트: 열릴 때 표시 후 2.5초 뒤 자동 소멸 + 이전 세션 이미지 캐시 정리 + 닫힐 때 확대 초기화
  useEffect(() => {
    if (!open) return
    prevSrcRef.current = null
    setShowHint(true)
    const t = window.setTimeout(() => setShowHint(false), 2500)
    return () => {
      window.clearTimeout(t)
      setScale(1)
      setTx(0)
      setTy(0)
      setDragging(false)
      gesture.current = freshGesture()
    }
  }, [open])

  // 현재·이전·다음 전체 이미지 프리로드
  useEffect(() => {
    if (!open || total === 0) return
    const at = (i: number) => items[((i % total) + total) % total]
    for (const i of [index, index - 1, index + 1]) {
      const it = at(i)
      if (it) {
        const im = new Image()
        im.decoding = 'async'
        im.src = it.src
      }
    }
  }, [open, index, total, items])

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (e.touches.length >= 2) {
      g.active = true
      g.mode = 'pinch'
      g.hadTwo = true
      g.startDist = touchDist(e.touches[0], e.touches[1])
      g.startScale = scale
      setDragging(true)
      dismissHint()
      return
    }
    const t = e.touches[0]
    const now = Date.now()
    const prev = lastTap.current
    // 더블탭: 1 ↔ 2.2 토글
    if (now - prev.t < DOUBLE_TAP_MS && Math.hypot(t.clientX - prev.x, t.clientY - prev.y) < 40) {
      lastTap.current = { t: 0, x: 0, y: 0 }
      dismissHint()
      if (scale > 1) {
        setScale(1)
        setTx(0)
        setTy(0)
      } else {
        setScale(DOUBLE_TAP_SCALE)
      }
      g.active = true
      g.mode = 'none' // 이 탭으로는 이동/팬을 확정하지 않음
      return
    }
    lastTap.current = { t: now, x: t.clientX, y: t.clientY }
    g.active = true
    g.hadTwo = false
    g.mode = scale > 1 ? 'pan' : 'swipe' // 확대 상태면 팬, 아니면 스와이프 후보
    g.startX = g.lastX = t.clientX
    g.startY = g.lastY = t.clientY
    g.startTx = tx
    g.startTy = ty
    if (g.mode === 'pan') setDragging(true)
  }

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g.active) return

    if (g.mode === 'pinch' && e.touches.length >= 2) {
      const d = touchDist(e.touches[0], e.touches[1])
      if (g.startDist > 0) {
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, g.startScale * (d / g.startDist)))
        setScale(next)
        if (next <= 1) {
          setTx(0)
          setTy(0)
        } else {
          const c = clampPan(tx, ty, next)
          setTx(c.x)
          setTy(c.y)
        }
      }
      return
    }

    if (g.mode === 'pan' && e.touches.length === 1) {
      const t = e.touches[0]
      g.lastX = t.clientX
      g.lastY = t.clientY
      const c = clampPan(g.startTx + (t.clientX - g.startX), g.startTy + (t.clientY - g.startY), scale)
      setTx(c.x)
      setTy(c.y)
      return
    }

    if (g.mode === 'swipe' && e.touches.length === 1) {
      const t = e.touches[0]
      g.lastX = t.clientX
      g.lastY = t.clientY
    }
  }

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const g = gesture.current

    // 손가락이 남아있으면(예: 두 손가락 중 하나만 뗌) 이동 확정 금지, 남은 손가락 기준으로 재설정
    if (e.touches.length >= 1) {
      const t = e.touches[0]
      g.mode = scale > 1 ? 'pan' : 'none'
      g.startX = g.lastX = t.clientX
      g.startY = g.lastY = t.clientY
      g.startTx = tx
      g.startTy = ty
      return
    }

    setDragging(false)

    // 스와이프 확정: 확대 없음 + 두 손가락 이력 없음 + scale===1 일 때만
    if (g.mode === 'swipe' && !g.hadTwo && scale === 1) {
      const dx = g.lastX - g.startX
      const dy = g.lastY - g.startY
      if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1)
      }
      // 세로 이동이 우세하면 이미지 변경 취소(아무 것도 하지 않음)
    }

    gesture.current = freshGesture()
  }

  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!open || !industry) return null
  const item = items[index]

  // 이미지가 바뀌면 렌더 단계에서 로딩/확대 상태를 즉시 초기화(전환 시 빈 화면 깜빡임 방지)
  if (lastSrc !== item.src) {
    setLastSrc(item.src)
    setReady(false)
    setErrored(false)
    setScale(1)
    setTx(0)
    setTy(0)
    setDragging(false)
    gesture.current = freshGesture()
  }

  const navDisabled = scale > 1
  const brand = industry.brand ? `${industry.brand} · ${industry.label}` : industry.label
  const showPrev = !ready && !errored && !!prevSrcRef.current && prevSrcRef.current !== item.src
  const imgConstraint = { maxWidth: '94vw', maxHeight: '86dvh' } as const

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${industry.label} ${item.caption} 확대 보기`}
      className="fixed inset-0 z-[70] flex select-none flex-col bg-slate-950"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        overscrollBehavior: 'contain',
      }}
      onClick={onBackdropClick}
    >
      {/* 상단 안전영역 컨트롤 바 — 닫기 X + 힌트(이미지 위에 겹치지 않음) */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <p
          aria-hidden
          className={`truncate rounded-full bg-white/10 px-3 py-1 text-[0.74rem] font-medium text-white/80 transition-opacity duration-500 ${showHint ? 'opacity-100' : 'opacity-0'}`}
        >
          두 손가락으로 확대해 확인하세요
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* 이미지 영역 — 전체 해상도(item.src) object-contain, 확대/팬 transform */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2"
        style={{ touchAction: scale > 1 ? 'none' : 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {/* 이전 이미지 유지 — 다음 이미지 로드 전 깜빡임 방지 */}
        {showPrev && (
          <img
            src={prevSrcRef.current ?? undefined}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none object-contain opacity-60"
            style={imgConstraint}
          />
        )}

        {/* 로딩 스켈레톤(스피너) */}
        {!ready && !errored && (
          <div aria-hidden className="pointer-events-none absolute grid place-items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
          </div>
        )}

        {/* 오류 폴백 */}
        {errored && (
          <div className="pointer-events-none absolute px-6 text-center text-[0.9rem] font-medium text-white/70">
            이미지를 불러오지 못했습니다.
          </div>
        )}

        {/* 현재(전체 해상도) 이미지 */}
        <img
          ref={imgRef}
          key={item.src}
          src={item.src}
          alt={item.alt}
          decoding="async"
          draggable={false}
          onLoad={() => {
            prevSrcRef.current = item.src
            setReady(true)
          }}
          onError={() => setErrored(true)}
          className="select-none object-contain"
          style={{
            ...imgConstraint,
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: 'center',
            willChange: 'transform',
            opacity: ready ? 1 : 0,
            transition: dragging ? 'opacity .2s ease' : 'opacity .2s ease, transform .2s ease',
          }}
        />

        {/* 좌우 이동(데스크톱 엣지 버튼) — scale===1 에서만 동작 */}
        {total > 1 && !navDisabled && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="이전 화면"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30 sm:grid"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 화면"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white/15 p-2.5 text-white transition-colors hover:bg-white/30 sm:grid"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 하단 컴팩트 바 — 브랜드 · 사진번호 · 캡션 / 종류 + Prev/Next */}
      <div className="flex shrink-0 items-center gap-3 px-4 py-3">
        {total > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 화면"
            disabled={navDisabled}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:pointer-events-none disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        )}

        <div className="min-w-0 flex-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[0.72rem] text-white/60">
            <span className="rounded bg-teal-400/15 px-1.5 py-0.5 font-bold text-teal-300">{KIND_LABEL[item.kind]}</span>
            <span className="truncate font-medium text-white/80">{brand}</span>
            <span className="text-white/30">·</span>
            <span className="shrink-0 tabular-nums">사진 {item.no}</span>
            {total > 1 && (
              <>
                <span className="text-white/30">·</span>
                <span className="shrink-0 tabular-nums">{index + 1} / {total}</span>
              </>
            )}
          </div>
          <p className="mt-0.5 truncate text-[0.9rem] font-bold text-white">{item.caption}</p>
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 화면"
            disabled={navDisabled}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:pointer-events-none disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
