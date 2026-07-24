// AX 쇼케이스 라이트박스 — PhotoSwipe v5 프로그래매틱 래퍼.
// DOM 갤러리 패턴이 아니라 new PhotoSwipe({dataSource,index,...}) → init() 로 직접 연다.
// 핀치 확대 / 더블탭 / 확대 시 팬 / 미확대 시에만 스와이프는 PhotoSwipe가 네이티브 처리한다.
import { useEffect, useRef } from 'react'
import PhotoSwipe from 'photoswipe'
import 'photoswipe/style.css'

export type AxPswpSlide = {
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export default function AxPhotoSwipe({
  open,
  slides,
  index,
  onClose,
}: {
  open: boolean
  slides: AxPswpSlide[]
  index: number
  onClose: () => void
}) {
  const slidesRef = useRef(slides)
  const indexRef = useRef(index)
  const onCloseRef = useRef(onClose)
  slidesRef.current = slides
  indexRef.current = index
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const data = slidesRef.current
    if (data.length === 0) {
      onCloseRef.current()
      return
    }

    let destroyed = false
    const pswp = new PhotoSwipe({
      dataSource: data.map((s) => ({ src: s.src, width: s.width, height: s.height, alt: s.alt })),
      index: Math.max(0, Math.min(indexRef.current, data.length - 1)),
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 2.5,
      maxZoomLevel: 4,
      wheelToZoom: true,
      preload: [1, 2],
      pinchToClose: false,
      closeOnVerticalDrag: false,
      bgOpacity: 0.96,
      arrowKeys: true,
      escKey: true,
      loop: false,
    })

    // 캡션(사진번호 · 업종/브랜드 · 화면종류) + 상단 힌트 — PhotoSwipe UI로 등록
    pswp.on('uiRegister', () => {
      pswp.ui?.registerElement({
        name: 'ax-caption',
        appendTo: 'root',
        tagName: 'div',
        order: 8,
        onInit: (el) => {
          Object.assign(el.style, {
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            padding: '16px 18px calc(16px + env(safe-area-inset-bottom))',
            textAlign: 'center',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            lineHeight: '1.35',
            letterSpacing: '0.01em',
            background: 'linear-gradient(to top, rgba(2,6,23,0.78), rgba(2,6,23,0))',
            pointerEvents: 'none',
            zIndex: '10',
          })
          const sync = () => {
            const s = data[pswp.currIndex]
            el.textContent = s ? s.caption : ''
          }
          pswp.on('change', sync)
          sync()
        },
      })

      pswp.ui?.registerElement({
        name: 'ax-hint',
        appendTo: 'root',
        tagName: 'div',
        order: 9,
        onInit: (el) => {
          Object.assign(el.style, {
            position: 'absolute',
            left: '50%',
            top: 'calc(env(safe-area-inset-top) + 58px)',
            transform: 'translateX(-50%)',
            maxWidth: '92vw',
            padding: '7px 14px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.14)',
            color: 'rgba(255,255,255,0.92)',
            fontSize: '12px',
            fontWeight: '500',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: '10',
            transition: 'opacity .5s ease',
          })
          el.textContent = '두 손가락으로 확대하거나 두 번 눌러 자세히 확인하세요.'
          window.setTimeout(() => {
            el.style.opacity = '0'
          }, 3000)
        },
      })
    })

    pswp.on('destroy', () => {
      destroyed = true
      onCloseRef.current()
    })

    pswp.init()

    return () => {
      if (!destroyed) pswp.destroy()
    }
    // open 이 true 로 바뀔 때만 새 인스턴스를 만든다(슬라이드/인덱스는 ref 로 최신값 사용).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return null
}
