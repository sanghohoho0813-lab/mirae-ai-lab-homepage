// 세로(9:16) 소개 영상 한 편 — AX 소개 영상(AxFilms)과 같은 재생 방식을 한 편짜리로 묶었다.
// 컨설턴트 페이지(상세 페이지 대신 영상)와 AX 페이지 끝 '실제 프로젝트' 영상이 같이 쓴다.
//  - 첫 상태는 '소리 없는 미리보기': 화면에 절반 이상 보이면 소리 없이 자동 재생. 소리는 절대 먼저 켜지 않는다.
//    움직임 줄이기 설정이면 자동 재생도 하지 않는다.
//  - 영상 위 전체가 '소리 켜고 처음부터 보기' 버튼. 끝나면 end 로 받은 버튼들을 띄운다.
//  - preload="none" — 이 구간 근처에 오기 전에는 영상을 받지 않는다(첫 화면 속도 보호).
//  - 재생 속도 1 · 1.25 · 1.5배.
import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react'
import PlaybackSpeed from './PlaybackSpeed'

export type StoryFilmHandle = { playWithSound: () => void; pause: () => void }

type Accent = 'orange' | 'sky'
const ACCENT: Record<Accent, { frame: string; play: string; ping: string; focus: string }> = {
  orange: {
    frame: 'shadow-[0_30px_70px_-20px_rgba(200,97,46,0.55)] ring-2 ring-[#D47A4A]/70',
    play: 'bg-[#E8894F] text-[#171B20]',
    ping: 'bg-[#E8894F]/45',
    focus: 'focus-visible:outline-[#E8894F]',
  },
  sky: {
    frame: 'shadow-[0_30px_70px_-20px_rgba(56,189,248,0.45)] ring-2 ring-sky-400/60',
    play: 'bg-sky-400 text-slate-950',
    ping: 'bg-sky-400/45',
    focus: 'focus-visible:outline-sky-400',
  },
}

type Mode = 'preview' | 'sound' | 'ended'

export default function StoryFilm({
  ref,
  mp4,
  webm,
  poster,
  length,
  label,
  accent = 'orange',
  tone = 'light',
  caption,
  end,
  onSound,
  dataAttr,
}: {
  ref?: Ref<StoryFilmHandle>
  mp4: string
  webm: string
  poster: string
  /** 예: '2분 19초' */
  length: string
  /** 화면 읽기·속도 버튼에 쓰는 영상 이름 */
  label: string
  accent?: Accent
  /** 영상 아래 글자(속도 버튼·안내)의 바탕 — 밝은 바탕 / 어두운 바탕 */
  tone?: 'light' | 'dark'
  caption?: ReactNode
  /** 끝까지 봤을 때 띄울 버튼들(replay = 처음부터 다시) */
  end: (replay: () => void) => ReactNode
  /** 소리 켜고 볼 때(다른 영상을 멈추는 등) */
  onSound?: () => void
  /** 테스트용 표식 — data-story-film 값 */
  dataAttr?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('preview')
  const modeRef = useRef<Mode>('preview')
  modeRef.current = mode
  // 소리 켜고 재생을 시작한 시각 — 버튼으로 화면 밖의 영상을 틀 때, 스크롤 전 '화면 밖' 알림이 막 시작한 재생을 멈추지 않게
  const soundAt = useRef(0)
  const a = ACCENT[accent]

  useEffect(() => {
    const v = videoRef.current
    if (!v || typeof IntersectionObserver === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          if (performance.now() - soundAt.current > 1500) v.pause()
        } else if (modeRef.current === 'preview' && !reduce) v.play().catch(() => {})
      },
      { threshold: 0.5 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const playWithSound = () => {
    const v = videoRef.current
    if (!v) return
    onSound?.()
    soundAt.current = performance.now()
    v.muted = false
    v.loop = false
    v.currentTime = 0
    v.play().catch(() => {})
    setMode('sound')
    // 재생을 먼저 부른 뒤 영상이 화면 가운데 오게 옮긴다
    boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  useImperativeHandle(ref, () => ({ playWithSound, pause: () => videoRef.current?.pause() }))

  return (
    <figure data-story-film={dataAttr}>
      {/* 세로 영상이 폰 화면을 넘지 않게: 폭 = min(100%, 화면 높이 72% × 9/16) */}
      <div ref={boxRef} data-story-box className={`relative mx-auto w-full max-w-[min(100%,calc(72svh*9/16))] rounded-[1.4rem] p-1.5 md:max-w-[400px] ${a.frame}`}>
        <video
          ref={videoRef}
          data-story-video
          poster={poster}
          width={1080}
          height={1920}
          muted
          loop
          playsInline
          controls={mode === 'sound'}
          preload="none"
          onEnded={() => setMode('ended')}
          aria-label={`${label} — 소개 영상 ${length} (자막 포함)`}
          className="block aspect-[9/16] h-auto w-full rounded-[1.1rem] bg-[#0E1114]"
        >
          {/* 대부분의 브라우저는 MP4(H.264)를, H.264 를 못 트는 브라우저는 WebM(VP9)을 받는다 */}
          <source src={mp4} type="video/mp4" />
          <source src={webm} type="video/webm" />
        </video>

        {mode === 'preview' && (
          <button
            type="button"
            onClick={playWithSound}
            data-story-sound
            aria-label={`소리 켜고 ${label} 처음부터 보기 (${length})`}
            className={`group absolute inset-1.5 flex flex-col items-center justify-end overflow-hidden rounded-[1.1rem] bg-gradient-to-t from-[#0E1114]/90 via-[#0E1114]/15 to-transparent px-4 pb-6 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 ${a.focus}`}
          >
            <span className="absolute left-3 top-3 rounded-full bg-[#0E1114]/75 px-3 py-1.5 text-[0.8rem] font-bold text-slate-200 ring-1 ring-white/15">
              🔇 소리 꺼진 미리보기
            </span>
            <span aria-hidden className="relative mb-4 grid h-20 w-20 place-items-center">
              <span className={`absolute inset-0 animate-ping rounded-full motion-reduce:animate-none ${a.ping}`} />
              <span className={`relative grid h-20 w-20 place-items-center rounded-full pl-1.5 text-[1.9rem] shadow-2xl shadow-black/50 transition-transform group-hover:scale-105 ${a.play}`}>
                ▶
              </span>
            </span>
            <span className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[1.08rem] font-black text-[#171B20] shadow-lg min-[380px]:text-[1.15rem]">
              소리 켜고 처음부터 보기
            </span>
            <span className="mt-2 text-[0.88rem] font-semibold text-slate-200">{length} · 자막 있음</span>
          </button>
        )}

        {mode === 'ended' && (
          <div data-story-end className="absolute inset-1.5 flex flex-col items-center justify-center gap-3 rounded-[1.1rem] bg-[#0E1114]/85 px-6 text-center text-white backdrop-blur-[2px]">
            {end(playWithSound)}
          </div>
        )}
      </div>
      <PlaybackSpeed videoRef={videoRef} label={label} tone={tone} />
      {caption && (
        <figcaption className={`mx-auto mt-2 max-w-[400px] break-keep text-center text-[0.82rem] leading-relaxed ${tone === 'dark' ? 'text-slate-400' : 'text-[#6B7680]'}`}>{caption}</figcaption>
      )}
    </figure>
  )
}

/** 끝 화면 버튼 모양(AX 소개 영상과 같은 모양) */
export const STORY_END_PRIMARY =
  'flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-xl bg-[#E8894F] px-4 text-[1.02rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]'
export const STORY_END_SECONDARY =
  'flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 text-[1.02rem] font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20'
export const STORY_END_REPLAY = 'min-h-11 px-3 text-[0.92rem] font-semibold text-slate-300 underline underline-offset-4 hover:text-white'
