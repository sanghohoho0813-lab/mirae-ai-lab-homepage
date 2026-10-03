// AX 소개 영상 2편(릴스 9:16, 대표님 목소리 + 자막 + 배경음악) — 페이지 순서(대표님 요청: 금액을 보기 전에 실제 사례부터):
//   히어로 → 영상 1(AxFilmIntro, 살구색) → 직접 만든 화면 22개(먹색) → 실제 프로젝트 1편·2편(AxRealProjectsFilm, 살구색)
//   → 영상 2(AxFilmCost, 살구색) → FAQ → 마무리.
// 기술사업·MVP 페이지의 소개 영상(VentureMvpFilm)과 같은 방식이다. 실제 프로젝트 영상도 같은 FilmBlock 을 쓴다.
//  - 첫 상태는 '소리 없는 미리보기': 화면에 절반 이상 보이면 소리 없이 자동 재생(움직임으로 눈길을 끈다).
//    갑자기 소리가 나면 불쾌할 수 있어 소리는 절대 먼저 켜지 않는다. 움직임 줄이기 설정이면 자동 재생도 하지 않는다.
//  - 영상 위 전체가 '소리 켜고 처음부터 보기' 버튼 — 누르면 소리를 켜고 처음부터 한 번 재생(기본 컨트롤 표시).
//    한 편을 소리 켜고 보면 이 페이지의 다른 영상은 모두 멈춘다(ax-film-sound 알림, 두 소리가 겹치지 않게).
//  - 끝나면 다음에 볼 것을 띄운다. 다른 구간의 영상을 틀 때는 playFilm(id) — 그 영상으로 내려가 소리 켜고 재생.
//  - preload="none" — 이 구간 근처에 오기 전에는 영상을 받지 않는다(첫 화면 속도 보호).
//  - 영상 원본(HyperFrames)·녹음·자막 파일은 media/ax-videos/ 에 있다. 게시본은 대표님이 음악을 넣어 다듬은 최종본.
// ⚠️ 소개 영상 속 화면은 자체 데모(샘플)다 — 아래 안내 문구를 지우지 않는다.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { scrollToSection } from '../../lib/businessPageScroll'
import PlaybackSpeed from '../video/PlaybackSpeed'

export type Film = {
  /** 구간 주소(#film-1 · #real-project-1 …) — playFilm 으로 부를 때도 쓴다 */
  id: string
  no: number
  /** intro: 소개 영상(data-ax-film) · real: 실제 프로젝트(data-real-episode) */
  kind?: 'intro' | 'real'
  mp4: string
  webm: string
  poster: string
  length: string
  /** 이런 분께 — 영상의 역할을 한 줄로 */
  who: string
  title: string
  emoji?: string
  /** 제목 아래 작은 상태 표시 */
  status?: readonly string[]
  lead: string
  points: readonly string[]
  /** '영상 1' · '실제 프로젝트 1편' — 버튼·화면 읽기에 쓴다 */
  short: string
  caption: string
}

const DEMO_CAPTION = '영상 속 화면은 미래AI랩이 직접 만든 자체 데모예요. 고객사 사례가 아니에요.'

const FILMS: readonly [Film, Film] = [
  {
    id: 'film-1',
    no: 1,
    short: '영상 1',
    caption: DEMO_CAPTION,
    mp4: '/business/ax/ax-film-1.mp4',
    webm: '/business/ax/ax-film-1.webm',
    poster: '/business/ax/ax-film-1-poster.webp',
    length: '4분 29초',
    who: 'AX가 아직 생소하다면',
    title: 'AX가 뭐고, 왜 필요한가',
    lead: '정책자금·투자·지원사업 심사에서 왜 ‘보여 줄 화면’이 중요해졌는지, AX가 회사 안과 밖을 어떻게 잇는지 담았어요.',
    points: ['심사에서 결국 보는 것 — 계획보다 실제 화면', '최근 3년 사례 250건 가까이에서 반복된 흐름', '회사 안 운영과 고객 플랫폼을 잇는 AX'],
  },
  {
    id: 'film-2',
    no: 2,
    short: '영상 2',
    caption: DEMO_CAPTION,
    mp4: '/business/ax/ax-film-2.mp4',
    webm: '/business/ax/ax-film-2.webm',
    poster: '/business/ax/ax-film-2-poster.webp',
    length: '4분 15초',
    who: '도입 방식과 비용이 궁금하다면',
    title: '어떻게 진행하고, 얼마가 드나',
    lead: '진단부터 2주 안에 기본 틀을 만드는 진행 4단계, 비용과 정산 방식, 정책자금·지원사업 신청까지 담았어요.',
    points: ['진단 → 2주 안에 MVP·기본 틀 → 데이터 쌓기 → 인증·재무', 'MVP 500만 · 플랫폼형 1,500만 · 풀 패키지 3,000만 원부터', '착수금으로 시작 · 개발비 후불 가능 · 유지보수 1년 무상'],
  },
]

type Mode = 'preview' | 'sound' | 'ended'

/** 다른 구간의 영상을 소리 켜고 튼다(그 영상으로 내려가며) — 이어 보기 버튼에서 쓴다 */
export const playFilm = (id: string) => window.dispatchEvent(new CustomEvent('ax-film-play', { detail: id }))

/** 영상 1 — 히어로 바로 다음(살구색). 위에 '꼭 봐 주세요' 머리말과 골라 보기 */
export function AxFilmIntro({ samplesAnchor, realAnchor }: { samplesAnchor: string; realAnchor: string }) {
  const film = FILMS[0]
  return (
    <section id="films" data-ax-films className="relative scroll-mt-16 overflow-hidden bg-[#F4ECE4] text-[#171B20]">
      <div aria-hidden className="pointer-events-none absolute -right-28 top-10 h-[24rem] w-[24rem] rounded-full bg-[#D47A4A]/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-[45%] h-[18rem] w-[18rem] rounded-full bg-[#E8B89A]/35 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 pt-11 text-center sm:px-6 sm:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#171B20] px-4 py-2 text-[0.98rem] font-black text-white shadow-md sm:text-[1.02rem]">
          <span aria-hidden className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8894F] opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E8894F]" />
          </span>
          꼭 봐 주세요
        </p>
        <h2 className="mt-4 break-keep text-[2rem] font-black leading-[1.18] tracking-tight sm:text-[2.6rem]">
          영상으로
          <br /> <span className="text-[#B4532A]">먼저 보여 드릴게요</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl break-keep text-[1.05rem] leading-relaxed text-[#4A535D] sm:text-[1.12rem]">
          <b className="font-black text-[#171B20]">필요한 것만 골라 보셔도 돼요.</b> 모든 영상에 자막이 있어요.
        </p>

        {/* 골라 보기 — 페이지 순서대로: 영상 1 → 직접 만든 화면 → 실제 사례 → 영상 2(비용) */}
        <ul data-ax-film-picker className="mx-auto mt-6 grid max-w-4xl gap-2.5 text-left sm:mt-7 sm:grid-cols-2 sm:gap-3">
          {[
            { id: 'film-1', mark: '1', who: FILMS[0].who, what: `영상 1 · ${FILMS[0].length}` },
            { id: samplesAnchor, mark: '▦', who: '설명보다 화면이 먼저라면', what: '직접 만든 화면 22개' },
            { id: realAnchor, mark: '▶', who: '실제 기업 사례가 궁금하다면', what: '실제 프로젝트 1편 · 2편' },
            { id: 'film-2', mark: '2', who: FILMS[1].who, what: `영상 2 · ${FILMS[1].length}` },
          ].map((c) => (
            <li key={c.id} className="flex">
              <button
                type="button"
                onClick={() => scrollToSection(c.id, 'smooth')}
                data-ax-film-pick={c.id}
                className="group flex min-h-[3.75rem] w-full items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm ring-1 ring-[#D47A4A]/30 transition hover:-translate-y-0.5 hover:ring-[#D47A4A]/70 motion-reduce:hover:translate-y-0"
              >
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#171B20] text-[0.9rem] font-black text-white">
                  {c.mark}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-keep text-[1.02rem] font-black leading-snug text-[#171B20] sm:text-[1.04rem]">{c.who}</span>
                  <span className="mt-0.5 block text-[0.86rem] font-bold text-[#B4532A]">{c.what}</span>
                </span>
                <span aria-hidden className="shrink-0 text-[1.1rem] font-black text-[#B4532A] transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <FilmBlock
        film={film}
        end={(replay) => (
          <>
            <p className="break-keep text-[1.2rem] font-black leading-snug">
              다음은 직접 만든 화면과
              <br /> 실제 기업 사례예요
            </p>
            <button type="button" onClick={() => scrollToSection(samplesAnchor, 'smooth')} className={END_PRIMARY}>
              직접 만든 화면 보기 <span aria-hidden>↓</span>
            </button>
            <button type="button" onClick={() => playFilm('film-2')} className={END_SECONDARY}>
              진행 방식·비용(영상 2) 보기 <span aria-hidden>▶</span>
            </button>
            <button type="button" onClick={replay} className={END_REPLAY}>
              1편 처음부터 다시 보기
            </button>
          </>
        )}
      />
    </section>
  )
}

/** 영상 2 — 실제 프로젝트 다음, FAQ 바로 앞(살구색). 금액은 실제 사례를 본 뒤에 */
export function AxFilmCost({ diagnosisHref }: { diagnosisHref: string }) {
  return (
    <section data-ax-films-cost className="relative overflow-hidden bg-[#F4ECE4] text-[#171B20]">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-16 h-[20rem] w-[20rem] rounded-full bg-[#D47A4A]/15 blur-3xl" />
      <div aria-hidden className="relative mx-auto h-px max-w-4xl bg-[#171B20]/10" />
      <FilmBlock
        film={FILMS[1]}
        end={(replay) => (
          <>
            <p className="break-keep text-[1.2rem] font-black leading-snug">
              우리 회사에도 맞을지
              <br /> 먼저 확인해 보세요
            </p>
            <Link to={diagnosisHref} className={END_PRIMARY}>
              3분 AX Fit 진단 받기 <span aria-hidden>→</span>
            </Link>
            <button type="button" onClick={() => scrollToSection('faq', 'smooth')} className={END_SECONDARY}>
              자주 묻는 질문 보기 <span aria-hidden>↓</span>
            </button>
            <button type="button" onClick={replay} className={END_REPLAY}>
              2편 처음부터 다시 보기
            </button>
          </>
        )}
      />
    </section>
  )
}

export const END_PRIMARY =
  'flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-xl bg-[#E8894F] px-4 text-[1.02rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]'
export const END_SECONDARY =
  'flex min-h-12 w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-xl bg-white/10 px-4 text-[1.02rem] font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20'
export const END_REPLAY = 'min-h-11 px-3 text-[0.92rem] font-semibold text-slate-300 underline underline-offset-4 hover:text-white'

export function FilmBlock({
  film,
  flip = false,
  end,
}: {
  film: Film
  /** PC 에서 영상을 왼쪽에 둔다(지그재그로 읽히게) */
  flip?: boolean
  /** 끝까지 봤을 때 띄울 버튼들 */
  end: (replay: () => void) => ReactNode
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('preview')
  const modeRef = useRef<Mode>('preview')
  modeRef.current = mode
  // 소리 켜고 재생을 시작한 시각 — 이어서 보기로 화면 밖의 편을 틀 때, 스크롤 전에 남아 있던
  // '화면 밖' 알림이 막 시작한 재생을 멈추지 않게 잠깐 무시한다
  const soundAt = useRef(0)

  // 미리보기일 때만: 보이면 소리 없이 재생, 벗어나면 멈춘다. 소리 켠 뒤에는 벗어날 때 멈추기만 한다
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
    // 이 페이지의 다른 영상은 멈춘다
    window.dispatchEvent(new CustomEvent('ax-film-sound', { detail: film.id }))
    soundAt.current = performance.now()
    v.muted = false
    v.loop = false
    v.currentTime = 0
    v.play().catch(() => {})
    setMode('sound')
    // 재생을 먼저 부른 뒤 영상이 화면 가운데 오게 옮긴다
    boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const playRef = useRef(playWithSound)
  playRef.current = playWithSound
  useEffect(() => {
    const onSound = (e: Event) => { if ((e as CustomEvent<string>).detail !== film.id) videoRef.current?.pause() }
    const onPlay = (e: Event) => { if ((e as CustomEvent<string>).detail === film.id) playRef.current() }
    window.addEventListener('ax-film-sound', onSound)
    window.addEventListener('ax-film-play', onPlay)
    return () => {
      window.removeEventListener('ax-film-sound', onSound)
      window.removeEventListener('ax-film-play', onPlay)
    }
  }, [film.id])

  const label = `${film.short} · ${film.title}`
  const dataAttr = film.kind === 'real' ? { 'data-real-episode': film.no } : { 'data-ax-film': film.no }

  return (
    <div
      id={film.id}
      {...dataAttr}
      className={`relative mx-auto max-w-6xl scroll-mt-16 px-5 py-11 sm:px-6 sm:py-16 md:grid md:items-center md:gap-12 lg:gap-16 ${flip ? 'md:grid-cols-[minmax(0,400px)_1fr]' : 'md:grid-cols-[1fr_minmax(0,400px)]'}`}
    >
      <div className={`text-center md:text-left ${flip ? 'md:order-2' : ''}`}>
        <p className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-[0.98rem] font-black text-[#B4532A] ring-1 ring-[#D47A4A]/40">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#171B20] text-[0.82rem] text-white">{film.no}</span>
          <span className="sr-only">{film.short} ·</span>
          {film.who}
          <span className="hidden font-bold text-[#5E6670] sm:inline">· {film.length}</span>
        </p>
        <h3 className="mt-3.5 break-keep text-[1.7rem] font-black leading-[1.25] tracking-tight sm:text-[2.1rem]">
          {film.emoji && <span aria-hidden className="mr-2">{film.emoji}</span>}
          {film.title}
        </h3>
        {film.status && (
          <p data-film-status className="mt-3 flex flex-wrap items-center justify-center gap-1.5 md:justify-start">
            {film.status.map((t) => (
              <span key={t} className="rounded-lg bg-white/75 px-2.5 py-1 text-[0.86rem] font-bold text-[#343B44] ring-1 ring-inset ring-[#171B20]/10">
                {t}
              </span>
            ))}
          </p>
        )}
        <p className="mx-auto mt-3 max-w-md break-keep text-[1.05rem] leading-relaxed text-[#4A535D] sm:text-[1.12rem] md:mx-0">{film.lead}</p>
        <ul className="mt-5 hidden gap-2 md:grid">
          {film.points.map((t) => (
            <li key={t} className="flex items-start gap-2 break-keep text-[1.02rem] font-semibold text-[#343B44]">
              <span aria-hidden className="font-black text-[#B4532A]">
                ✓
              </span>
              {t}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={playWithSound}
          data-ax-film-cta
          className="shine-cta mt-7 hidden min-h-14 items-center gap-2.5 rounded-2xl bg-[#171B20] px-7 text-[1.12rem] font-black text-white shadow-xl shadow-[#171B20]/20 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 md:inline-flex"
        >
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-[#E8894F] text-[0.9rem] text-[#171B20]">
            ▶
          </span>
          {film.short} 소리 켜고 보기
        </button>
      </div>

      <figure className={`mt-7 md:mt-0 ${flip ? 'md:order-1' : ''}`}>
        {/* 세로 영상이 폰 화면을 넘지 않게: 폭 = min(100%, 화면 높이 72% × 9/16) */}
        <div
          ref={boxRef}
          data-ax-video-box
          className="relative mx-auto w-full max-w-[min(100%,calc(72svh*9/16))] rounded-[1.4rem] p-1.5 shadow-[0_30px_70px_-20px_rgba(200,97,46,0.55)] ring-2 ring-[#D47A4A]/70 md:max-w-[400px]"
        >
          <video
            ref={videoRef}
            data-ax-video
            poster={film.poster}
            width={1080}
            height={1920}
            muted
            loop
            playsInline
            controls={mode === 'sound'}
            preload="none"
            onEnded={() => setMode('ended')}
            aria-label={`${label} — 소개 영상 ${film.length} (자막 포함)`}
            className="block aspect-[9/16] h-auto w-full rounded-[1.1rem] bg-[#0E1114]"
          >
            {/* 대부분의 브라우저는 MP4(H.264)를, H.264 를 못 트는 브라우저는 WebM(VP9)을 받는다 */}
            <source src={film.mp4} type="video/mp4" />
            <source src={film.webm} type="video/webm" />
          </video>

          {/* 소리 없는 미리보기 — 영상 위 전체가 '소리 켜고 처음부터 보기' 버튼 */}
          {mode === 'preview' && (
            <button
              type="button"
              onClick={playWithSound}
              data-ax-sound
              aria-label={`소리 켜고 ${label} 처음부터 보기 (${film.length})`}
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
              <span className="mt-2 text-[0.88rem] font-semibold text-slate-200">
                {film.short} · {film.length}
              </span>
            </button>
          )}

          {mode === 'ended' && (
            <div data-ax-film-end className="absolute inset-1.5 flex flex-col items-center justify-center gap-3 rounded-[1.1rem] bg-[#0E1114]/85 px-6 text-center text-white backdrop-blur-[2px]">
              {end(playWithSound)}
            </div>
          )}
        </div>
        {/* 재생 속도 1배 · 1.25배 · 1.5배 */}
        <PlaybackSpeed videoRef={videoRef} label={label} />
        <figcaption className="mt-2 break-keep text-center text-[0.82rem] leading-relaxed text-[#5E6670]">{film.caption}</figcaption>
      </figure>
    </div>
  )
}
