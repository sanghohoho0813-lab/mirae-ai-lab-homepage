// 영상 재생 속도 고르기 — 1배 · 1.25배 · 1.5배. 2배는 너무 빨라서 두지 않는다(대표님 요청).
// AX 소개 영상 1·2, 2주 기술사업 빌드 소개 영상, 실제 프로젝트 영상, 컨설턴트 운영 OS 영상이 같이 쓴다.
//  - defaultPlaybackRate 도 같이 바꾼다: 영상은 처음 재생할 때 파일을 받으면서(preload="none") 속도를 기본값으로 되돌리므로,
//    재생 전에 골라 둔 속도가 그대로 적용되고 '처음부터 다시 보기'에도 유지된다.
//  - 브라우저 기본 메뉴(⋮ → 재생 속도)로 바꿔도 버튼 표시가 따라간다(ratechange).
import { useEffect, useState, type RefObject } from 'react'

export const PLAYBACK_SPEEDS = [1, 1.25, 1.5] as const

export default function PlaybackSpeed({
  videoRef,
  label,
  tone = 'light',
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  label: string
  /** 어두운 바탕에 놓일 때는 'dark' */
  tone?: 'light' | 'dark'
}) {
  const [rate, setRate] = useState(1)
  const dark = tone === 'dark'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const sync = () => setRate(v.playbackRate)
    v.addEventListener('ratechange', sync)
    return () => v.removeEventListener('ratechange', sync)
  }, [videoRef])

  const pick = (r: number) => {
    const v = videoRef.current
    if (v) {
      v.defaultPlaybackRate = r
      v.playbackRate = r
    }
    setRate(r)
  }

  return (
    <div role="group" aria-label={`${label} 재생 속도`} data-playback-speed className="mt-3 flex items-center justify-center gap-1.5">
      <span className={`mr-1 text-[0.86rem] font-bold ${dark ? 'text-slate-400' : 'text-[#6B7680]'}`}>재생 속도</span>
      {PLAYBACK_SPEEDS.map((r) => {
        const on = rate === r
        return (
          <button
            key={r}
            type="button"
            onClick={() => pick(r)}
            aria-pressed={on}
            data-speed={r}
            className={`min-h-10 min-w-[3.7rem] rounded-full px-3 text-[0.9rem] font-black transition-colors ${
              dark
                ? on
                  ? 'bg-white text-[#171B20]'
                  : 'bg-white/10 text-slate-200 ring-1 ring-inset ring-white/20 hover:ring-white/50'
                : on
                  ? 'bg-[#171B20] text-white'
                  : 'bg-white/80 text-[#343B44] ring-1 ring-inset ring-[#D47A4A]/35 hover:ring-[#D47A4A]/70'
            }`}
          >
            {r}배
          </button>
        )
      })}
    </div>
  )
}
