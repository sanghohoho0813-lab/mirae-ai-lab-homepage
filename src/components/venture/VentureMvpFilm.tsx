// 세 번째 구간 — 1분 소개 영상. 셀링포인트(아이디어 없어도 OK · 작동하는 MVP · 2주 · 벤처기업확인 신청까지 ·
// 런칭 파트너 300만원)를 실제 자체 데모 화면으로 짧게 보여 준다. 자막은 영상에 박혀 있다(소리 없이도 읽힌다).
//  - 화면에 절반 이상 보이면 소리 없이 자동 재생, 벗어나면 멈춘다. 움직임 줄이기 설정이면 자동 재생하지 않는다.
//  - preload="none" — 이 구간 근처에 오기 전에는 영상을 받지 않는다(첫 화면 속도 보호).
//  - 영상 원본(HyperFrames)·대본·자막 파일은 media/venture-mvp-film/ 에 있다.
// ⚠️ 영상 속 화면은 자체 데모다 — 아래 안내 문구를 지우지 않는다.
import { useEffect, useRef } from 'react'

const FILM_MP4 = '/business/venture-mvp/mvp-film.mp4'
const FILM_WEBM = '/business/venture-mvp/mvp-film.webm'
const FILM_POSTER = '/business/venture-mvp/mvp-film-poster.webp'
const POINTS = ['지금 하는 사업이 어떤 기술사업이 되는지', '실제로 작동하는 데모 화면', '2주 일정 · 벤처기업확인 신청 · 비용'] as const

export default function VentureMvpFilm({ onConsult }: { onConsult: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)

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

  return (
    <section data-mvp-film className="bg-[#171B20] text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 md:grid md:grid-cols-[1fr_minmax(0,440px)] md:items-center md:gap-12 lg:gap-16">
        <div>
          <p className="text-[1rem] font-black text-[#E8B89A]">1분 영상</p>
          <h2 className="mt-2 break-keep text-[1.75rem] font-black leading-tight tracking-tight sm:text-[2.2rem]">
            지금 하는 사업이
            <br /> 이렇게 바뀌어요
          </h2>
          <p className="mt-3 max-w-md break-keep text-[1.02rem] leading-relaxed text-slate-300 sm:text-[1.08rem]">
            어떤 기술사업이 되는지, 실제로 작동하는 화면으로 보여 드려요. 소리 없이 자막으로 보셔도 돼요.
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

        {/* 폰에서는 좌우 여백 없이 꽉 채워 자막을 조금이라도 크게 보이게 한다 */}
        <figure className="-mx-5 mt-6 sm:mx-auto sm:w-full sm:max-w-[440px] md:mt-0">
          <video
            ref={ref}
            data-mvp-video
            poster={FILM_POSTER}
            width={1080}
            height={1350}
            muted
            loop
            playsInline
            controls
            preload="none"
            aria-label="2주 기술사업 빌드 1분 소개 영상 (자막 포함)"
            className="block aspect-[4/5] h-auto w-full bg-[#0E1114] sm:rounded-2xl sm:shadow-2xl sm:shadow-black/40 sm:ring-1 sm:ring-white/10"
          >
            {/* 대부분의 브라우저는 MP4(H.264)를, H.264 를 못 트는 브라우저는 WebM(VP9)을 받는다 */}
            <source src={FILM_MP4} type="video/mp4" />
            <source src={FILM_WEBM} type="video/webm" />
          </video>
          <figcaption className="mt-3 break-keep px-5 text-center text-[0.82rem] leading-relaxed text-slate-500 sm:px-0">
            영상 속 화면은 미래AI랩이 직접 만든 자체 데모예요. 고객사 사례가 아니에요.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
