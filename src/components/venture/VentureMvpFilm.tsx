// 세 번째 구간 — 소개 영상(릴스 비율 9:16, 대표님 목소리 + 자막).
// 벤처인증 + 작동하는 MVP 를 한 번에 하는 이유를 실제 자체 데모 화면으로 보여 준다.
//  - 화면에 절반 이상 보이면 소리 없이 자동 재생, 벗어나면 멈춘다. 움직임 줄이기 설정이면 자동 재생하지 않는다.
//  - '소리 켜고 처음부터' 를 누르면 소리를 켜고 처음부터 한 번 재생한다(반복 재생은 끈다).
//  - preload="none" — 이 구간 근처에 오기 전에는 영상을 받지 않는다(첫 화면 속도 보호).
//  - 폰에서는 화면 높이의 약 78% 안에 들어오게 폭을 줄인다(세로 영상이 화면을 넘지 않게).
//  - 영상 원본(HyperFrames)·녹음·자막 파일은 media/venture-mvp-reel/ 에 있다.
// ⚠️ 영상 속 화면은 자체 데모다 — 아래 안내 문구를 지우지 않는다.
import { useEffect, useRef, useState } from 'react'

const FILM_MP4 = '/business/venture-mvp/mvp-reel.mp4'
const FILM_WEBM = '/business/venture-mvp/mvp-reel.webm'
const FILM_POSTER = '/business/venture-mvp/mvp-reel-poster.webp'
const POINTS = ['벤처인증 혜택과 심사에서 보는 것', '실제로 작동하는 데모 화면', '2주 일정 · 비용'] as const

export default function VentureMvpFilm({ onConsult }: { onConsult: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const v = ref.current
    if (!v || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.5 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  // 기본 컨트롤로 소리를 켜도 버튼을 숨긴다
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const sync = () => setMuted(v.muted || v.volume === 0)
    v.addEventListener('volumechange', sync)
    return () => v.removeEventListener('volumechange', sync)
  }, [])

  const playWithSound = () => {
    const v = ref.current
    if (!v) return
    v.muted = false
    v.loop = false
    v.currentTime = 0
    v.play().catch(() => {})
  }

  return (
    <section data-mvp-film className="bg-[#171B20] text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 md:grid md:grid-cols-[1fr_minmax(0,380px)] md:items-center md:gap-12 lg:gap-16">
        <div>
          <p className="text-[1rem] font-black text-[#E8B89A]">영상으로 보기</p>
          <h2 className="mt-2 break-keep text-[1.75rem] font-black leading-tight tracking-tight sm:text-[2.2rem]">
            벤처인증도, MVP도
            <br /> 한 번에 하는 이유
          </h2>
          <p className="mt-3 max-w-md break-keep text-[1.02rem] leading-relaxed text-slate-300 sm:text-[1.08rem]">
            2분이면 충분해요. 자막이 있어 소리 없이 보셔도 되고, 소리를 켜면 대표님께 직접 설명드려요.
          </p>
          <ul className="mt-5 hidden gap-2 md:grid">
            {POINTS.map((t) => (
              <li key={t} className="flex items-start gap-2 break-keep text-[1rem] text-slate-200">
                <span aria-hidden className="font-black text-[#E8B89A]">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onConsult}
            data-mvp-film-cta
            className="mt-7 hidden min-h-12 items-center gap-2 rounded-xl bg-[#D47A4A] px-6 text-[1.05rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A] md:inline-flex"
          >
            무료로 상담받기 <span aria-hidden>→</span>
          </button>
        </div>

        <figure className="mt-6 md:mt-0">
          {/* 세로 영상이 폰 화면을 넘지 않게: 폭 = min(100%, 화면 높이 78% × 9/16) */}
          <div data-mvp-video-box className="relative mx-auto w-full max-w-[min(100%,calc(78svh*9/16))] md:max-w-[380px]">
            <video
              ref={ref}
              data-mvp-video
              poster={FILM_POSTER}
              width={1080}
              height={1920}
              muted
              loop
              playsInline
              controls
              preload="none"
              aria-label="벤처인증과 MVP를 한 번에 하는 이유 — 소개 영상 (자막 포함)"
              className="block aspect-[9/16] h-auto w-full rounded-2xl bg-[#0E1114] shadow-2xl shadow-black/40 ring-1 ring-white/10"
            >
              {/* 대부분의 브라우저는 MP4(H.264)를, H.264 를 못 트는 브라우저는 WebM(VP9)을 받는다 */}
              <source src={FILM_MP4} type="video/mp4" />
              <source src={FILM_WEBM} type="video/webm" />
            </video>
            {muted && (
              <button
                type="button"
                onClick={playWithSound}
                data-mvp-sound
                className="absolute left-1/2 top-3 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#171B20]/85 px-4 text-[0.95rem] font-bold text-white shadow-lg ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-[#D47A4A] hover:text-[#171B20]"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
                소리 켜고 처음부터
              </button>
            )}
          </div>
          <figcaption className="mt-3 break-keep text-center text-[0.82rem] leading-relaxed text-slate-500">
            영상 속 화면은 미래AI랩이 직접 만든 자체 데모예요. 고객사 사례가 아니에요.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
