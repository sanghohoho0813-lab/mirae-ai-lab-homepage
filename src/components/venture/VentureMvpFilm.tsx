// 소개 영상(릴스 비율 9:16, 대표님 목소리 + 자막) — 히어로 바로 다음, '예를 들면'(자체 데모 10개) 바로 앞.
// 영상이 '샘플 22개, 직접 눌러서 확인해 보세요' 로 끝나므로, 끝나면 바로 아래 예시 카드로 이어진다.
//  - 첫 상태는 '소리 없는 미리보기': 화면에 절반 이상 보이면 소리 없이 자동 재생(움직임으로 눈길을 끈다).
//    갑자기 소리가 나면 불쾌할 수 있어 소리는 절대 먼저 켜지 않는다. 움직임 줄이기 설정이면 자동 재생도 하지 않는다.
//  - 영상 위 전체가 '소리 켜고 처음부터 보기' 버튼 — 누르면 소리를 켜고 처음부터 한 번 재생(기본 컨트롤 표시).
//  - 히어로의 '영상으로 모든 내용 확인하기' 도 ref 의 playWithSound 로 같은 동작을 한다(누른 순간 바로 재생해야
//    iOS 에서도 소리가 난다 — 스크롤보다 재생을 먼저 부른다).
//  - 끝까지 보면 '샘플 직접 눌러 보기(아래 예시로)' · '무료로 상담받기' 를 띄운다.
//  - preload="none" — 이 구간 근처에 오기 전에는 영상을 받지 않는다(첫 화면 속도 보호).
//  - 영상 원본(HyperFrames)·녹음·자막 파일은 media/venture-mvp-reel/ 에 있다. 게시본은 대표님이 한 번 더 다듬은 최종본.
// ⚠️ 영상 속 화면은 자체 데모다 — 아래 안내 문구를 지우지 않는다.
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'

const FILM_MP4 = '/business/venture-mvp/mvp-reel.mp4'
const FILM_WEBM = '/business/venture-mvp/mvp-reel.webm'
const FILM_POSTER = '/business/venture-mvp/mvp-reel-poster.webp'
const FILM_LENGTH = '1분 42초'
const POINTS = ['벤처인증 혜택과 심사에서 보는 것', '실제로 작동하는 MVP 화면', '2주 일정 · 비용 · 확인까지 걸리는 기간'] as const

export type VentureMvpFilmHandle = { playWithSound: () => void }
type Mode = 'preview' | 'sound' | 'ended'

export default function VentureMvpFilm({
  ref,
  onConsult,
  samplesAnchor,
}: {
  ref?: Ref<VentureMvpFilmHandle>
  onConsult: () => void
  /** 끝난 뒤 '샘플 직접 눌러 보기' 로 내려갈 구간 id */
  samplesAnchor: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('preview')
  const modeRef = useRef<Mode>('preview')
  modeRef.current = mode

  // 미리보기일 때만: 보이면 소리 없이 재생, 벗어나면 멈춘다. 소리 켠 뒤에는 벗어날 때 멈추기만 한다
  useEffect(() => {
    const v = videoRef.current
    if (!v || typeof IntersectionObserver === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause()
        else if (modeRef.current === 'preview' && !reduce) v.play().catch(() => {})
      },
      { threshold: 0.5 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const playWithSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.loop = false
    v.currentTime = 0
    v.play().catch(() => {})
    setMode('sound')
    // 재생을 먼저 부른 뒤 영상이 화면 가운데 오게 옮긴다
    boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  useImperativeHandle(ref, () => ({ playWithSound }))

  const goSamples = () => document.getElementById(samplesAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section id="film" data-mvp-film className="relative scroll-mt-16 overflow-hidden bg-[#F4ECE4] text-[#171B20]">
      <div aria-hidden className="pointer-events-none absolute -right-28 top-10 h-[24rem] w-[24rem] rounded-full bg-[#D47A4A]/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-[18rem] w-[18rem] rounded-full bg-[#E8B89A]/35 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-16 md:grid md:grid-cols-[1fr_minmax(0,400px)] md:items-center md:gap-12 lg:gap-16">
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#171B20] px-4 py-2 text-[0.98rem] font-black text-white shadow-md sm:text-[1.02rem]">
            <span aria-hidden className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8894F] opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E8894F]" />
            </span>
            꼭 봐 주세요
          </p>
          <h2 className="mt-4 break-keep text-[2rem] font-black leading-[1.18] tracking-tight sm:text-[2.6rem]">
            영상 하나로
            <br /> <span className="text-[#C8612E]">모든 설명</span>을 드려요
          </h2>
          <p className="mx-auto mt-3 max-w-md break-keep text-[1.05rem] leading-relaxed text-[#4A535D] sm:text-[1.12rem] md:mx-0">
            <b className="font-black text-[#171B20]">{FILM_LENGTH}</b> · 자막 포함. 벤처인증 혜택부터 실제로 작동하는 MVP, 2주 일정과 비용까지 이 영상에 다 담았어요.
          </p>
          <ul className="mt-5 hidden gap-2 md:grid">
            {POINTS.map((t) => (
              <li key={t} className="flex items-start gap-2 break-keep text-[1.02rem] font-semibold text-[#343B44]">
                <span aria-hidden className="font-black text-[#D47A4A]">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={playWithSound}
            data-mvp-film-cta
            className="shine-cta mt-7 hidden min-h-14 items-center gap-2.5 rounded-2xl bg-[#171B20] px-7 text-[1.12rem] font-black text-white shadow-xl shadow-[#171B20]/20 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 md:inline-flex"
          >
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-[#E8894F] text-[0.9rem] text-[#171B20]">
              ▶
            </span>
            영상으로 모든 내용 확인하기
          </button>
        </div>

        <figure className="mt-7 md:mt-0">
          {/* 세로 영상이 폰 화면을 넘지 않게: 폭 = min(100%, 화면 높이 72% × 9/16) */}
          <div
            ref={boxRef}
            data-mvp-video-box
            className="relative mx-auto w-full max-w-[min(100%,calc(72svh*9/16))] rounded-[1.4rem] p-1.5 shadow-[0_30px_70px_-20px_rgba(200,97,46,0.55)] ring-2 ring-[#D47A4A]/70 md:max-w-[400px]"
          >
            <video
              ref={videoRef}
              data-mvp-video
              poster={FILM_POSTER}
              width={1080}
              height={1920}
              muted
              loop
              playsInline
              controls={mode === 'sound'}
              preload="none"
              onEnded={() => setMode('ended')}
              aria-label={`벤처인증과 MVP를 한 번에 하는 이유 — 소개 영상 ${FILM_LENGTH} (자막 포함)`}
              className="block aspect-[9/16] h-auto w-full rounded-[1.1rem] bg-[#0E1114]"
            >
              {/* 대부분의 브라우저는 MP4(H.264)를, H.264 를 못 트는 브라우저는 WebM(VP9)을 받는다 */}
              <source src={FILM_MP4} type="video/mp4" />
              <source src={FILM_WEBM} type="video/webm" />
            </video>

            {/* 소리 없는 미리보기 — 영상 위 전체가 '소리 켜고 처음부터 보기' 버튼 */}
            {mode === 'preview' && (
              <button
                type="button"
                onClick={playWithSound}
                data-mvp-sound
                aria-label={`소리 켜고 영상 처음부터 보기 (${FILM_LENGTH})`}
                className="group absolute inset-1.5 flex flex-col items-center justify-end overflow-hidden rounded-[1.1rem] bg-gradient-to-t from-[#0E1114]/90 via-[#0E1114]/15 to-transparent px-4 pb-6 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#E8894F]"
              >
                <span className="absolute left-3 top-3 rounded-full bg-[#0E1114]/75 px-3 py-1.5 text-[0.8rem] font-bold text-slate-200 ring-1 ring-white/15">
                  🔇 소리 꺼진 미리보기
                </span>
                <span aria-hidden className="relative mb-4 grid h-20 w-20 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#E8894F]/45 motion-reduce:animate-none" />
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-[#E8894F] pl-1.5 text-[1.9rem] text-[#171B20] shadow-2xl shadow-black/50 transition-transform group-hover:scale-105">
                    ▶
                  </span>
                </span>
                <span className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[1.08rem] font-black text-[#171B20] shadow-lg min-[380px]:text-[1.15rem]">
                  소리 켜고 처음부터 보기
                </span>
                <span className="mt-2 text-[0.88rem] font-semibold text-slate-200">{FILM_LENGTH} · 모든 설명이 들어 있어요</span>
              </button>
            )}

            {/* 끝까지 봤을 때 — 바로 아래 샘플로, 또는 상담으로 */}
            {mode === 'ended' && (
              <div data-mvp-film-end className="absolute inset-1.5 flex flex-col items-center justify-center gap-3 rounded-[1.1rem] bg-[#0E1114]/85 px-6 text-center text-white backdrop-blur-[2px]">
                <p className="break-keep text-[1.2rem] font-black leading-snug">
                  이제 샘플을
                  <br /> 직접 눌러 보세요
                </p>
                <button
                  type="button"
                  onClick={goSamples}
                  className="flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-xl bg-[#E8894F] px-4 text-[1.02rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]"
                >
                  샘플 직접 눌러 보기 <span aria-hidden>↓</span>
                </button>
                <button
                  type="button"
                  onClick={onConsult}
                  className="flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 text-[1.02rem] font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
                >
                  무료로 상담받기 <span aria-hidden>→</span>
                </button>
                <button type="button" onClick={playWithSound} className="min-h-11 px-3 text-[0.92rem] font-semibold text-slate-300 underline underline-offset-4 hover:text-white">
                  처음부터 다시 보기
                </button>
              </div>
            )}
          </div>
          <figcaption className="mt-3 break-keep text-center text-[0.82rem] leading-relaxed text-[#6B7680]">
            영상 속 화면은 미래AI랩이 직접 만든 자체 데모예요. 고객사 사례가 아니에요.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
