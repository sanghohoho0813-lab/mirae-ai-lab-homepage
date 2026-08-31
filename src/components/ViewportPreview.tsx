import { useEffect, useState } from 'react'

export type PreviewDevice = 'mobile' | 'desktop'

type ViewportPreviewProps = {
  device: PreviewDevice
  onClose: () => void
  onDeviceChange: (device: PreviewDevice) => void
  path: string
  hash: string
}

const PREVIEW_SIZES = {
  mobile: { width: 430, maxScale: 1 },
  desktop: { width: 1440, maxScale: 0.78 },
} as const

function readViewport() {
  return { width: window.innerWidth, height: window.innerHeight }
}

export default function ViewportPreview({ device, onClose, onDeviceChange, path, hash }: ViewportPreviewProps) {
  const [viewport, setViewport] = useState(() => readViewport())

  useEffect(() => {
    const updateViewport = () => setViewport(readViewport())
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const size = PREVIEW_SIZES[device]
  const scale = Math.min(size.maxScale, Math.max(0.18, (viewport.width - 32) / size.width))
  const visibleHeight = Math.max(520, viewport.height - 88)
  const frameHeight = Math.ceil(visibleHeight / scale)
  const frameStyle = {
    width: `${size.width * scale}px`,
    height: `${frameHeight * scale}px`,
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#02152f] text-white">
      <div className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#011124] px-3 sm:px-5">
        <p className="hidden whitespace-nowrap text-[0.95rem] font-bold text-slate-300 sm:block">화면 미리보기</p>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            aria-pressed={device === 'mobile'}
            className={`rounded-lg px-3 py-2 text-[0.95rem] font-bold transition-colors ${device === 'mobile' ? 'bg-teal-400 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            모바일
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            aria-pressed={device === 'desktop'}
            className={`rounded-lg px-3 py-2 text-[0.95rem] font-bold transition-colors ${device === 'desktop' ? 'bg-teal-400 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            PC
          </button>
          <button type="button" onClick={onClose} className="ml-1 rounded-lg border border-white/20 px-3 py-2 text-[0.95rem] font-bold text-white transition-colors hover:bg-white/10">
            닫기
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-start justify-center overflow-hidden p-4">
        <div style={frameStyle} className="shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl shadow-black/40">
          <iframe
            title={`${device === 'mobile' ? '모바일' : 'PC'} 화면 미리보기`}
            src={`${path}?preview=${device}${hash}`}
            style={{
              width: `${size.width}px`,
              height: `${frameHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="block border-0 bg-white"
          />
        </div>
      </div>
    </div>
  )
}
