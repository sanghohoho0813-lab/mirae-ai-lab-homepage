// AX 페이지 끝(FAQ 다음, 마무리 바로 앞) — 지금 실제로 만들고 있는 회사 두 곳을 소개하는 영상.
//  - 1편 의료폐기물 수거·운반(2분 31초) · 2편 쑥뜸원(웰니스, 2분 51초) — 녹음 1.1배, 먹색 + 구리색 릴스(9:16).
//  - 요약본(2분 19초, 대표님 목소리) — 두 회사를 한 편에 담은 처음 영상.
//  회사 이름은 밝히지 않고 업종만. 영상 속 실제 화면은 업체·병원·고객 이름을 ○○ 로 바꾸거나 흐리게 가린 캡처이고 짧게만 나온다.
//  나머지 앱 모양 화면은 예시 데이터로 다시 그렸다. 매출·정산·영업 화면은 쓰지 않았다.
//  영상 원본·녹음·자막: media/ax-videos/real-ep1 · real-ep2 · real-projects.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { scrollToSection } from '../../lib/businessPageScroll'
import StoryFilm, { STORY_END_PRIMARY, STORY_END_REPLAY, STORY_END_SECONDARY, type StoryFilmHandle } from '../video/StoryFilm'

export const AX_REAL_FILM_ID = 'real-projects-film'

type EpId = 'ep1' | 'ep2' | 'summary'
const EPISODES: { id: EpId; tab: string; sub: string; label: string; length: string; base: string }[] = [
  { id: 'ep1', tab: '1편', sub: '의료폐기물 수거·운반', label: '실제 프로젝트 1편 · 의료폐기물 수거·운반', length: '2분 31초', base: '/business/ax/ax-real-ep1' },
  { id: 'ep2', tab: '2편', sub: '쑥뜸원(웰니스)', label: '실제 프로젝트 2편 · 쑥뜸원(웰니스)', length: '2분 51초', base: '/business/ax/ax-real-ep2' },
  { id: 'summary', tab: '요약본', sub: '두 회사 한 번에', label: '실제 프로젝트 요약본 · 두 회사 이야기', length: '2분 19초', base: '/business/ax/ax-real-projects' },
]

const POINTS = [
  { k: '의료폐기물 수거·운반', d: '현장에서 휴대폰으로 한 번 입력하면 수거 이력·자재·정산 정보가 이어지고, 병원은 전용 포털에서 미리 요청해요.' },
  { k: '쑥뜸원(웰니스)', d: '몇 번만 누르면 관리 부위와 고객 반응이 기록되고, 오늘 다시 챙길 고객을 먼저 보여 줘요. 고객에게는 전용 플랫폼을 드려요.' },
  { k: '쌓인 데이터 → 다음 할 일', d: '다시 필요할 시점, 먼저 챙길 고객처럼 우선순위와 근거를 정리해 드려요. 앞으로 할 일은 영상에서 계획으로 따로 표시했어요.' },
] as const

export default function AxRealProjectsFilm({ diagnosisHref }: { diagnosisHref: string }) {
  const [ep, setEp] = useState<EpId>('ep1')
  const film = useRef<StoryFilmHandle>(null)
  // '2편 이어 보기'를 누르면 2편으로 바꾼 뒤 소리 켜고 바로 재생
  const playNext = useRef(false)
  useEffect(() => {
    if (!playNext.current) return
    playNext.current = false
    film.current?.playWithSound()
  }, [ep])
  const cur = EPISODES.find((e) => e.id === ep)!

  return (
    <section id={AX_REAL_FILM_ID} data-ax-real-film className="relative scroll-mt-16 overflow-hidden border-t border-[#343B44] bg-[#171B20] text-white">
      <div aria-hidden className="pointer-events-none absolute -left-28 top-16 h-[22rem] w-[22rem] rounded-full bg-[#D47A4A]/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 md:grid md:grid-cols-[1fr_minmax(0,400px)] md:items-center md:gap-12 lg:gap-16">
        <div className="text-center md:text-left">
          <p className="text-[1.02rem] font-black tracking-tight text-[#D9824F] sm:text-[1.1rem]">REAL PROJECTS</p>
          <h2 className="mt-3 break-keep text-[1.75rem] font-black leading-[1.25] tracking-tight sm:text-[2.2rem]">
            지금 실제로 만들고 있는
            <br /> <span className="text-[#E8B89A]">회사 두 곳</span>을 보여 드려요
          </h2>
          <p className="mx-auto mt-3 max-w-md break-keep text-[1.05rem] leading-relaxed text-slate-300 sm:text-[1.12rem] md:mx-0">
            업종은 전혀 다르지만 원리는 같아요. 한 번 입력한 데이터가 다음 업무로 이어지고, 쌓인 데이터가 다음에 할 일을 알려 줘요.
          </p>
          <ul className="mt-6 hidden gap-3 text-left md:grid">
            {POINTS.map((p) => (
              <li key={p.k} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                <p className="break-keep text-[1.02rem] font-black text-white">{p.k}</p>
                <p className="mt-1 break-keep text-[0.95rem] leading-relaxed text-slate-300">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 md:mt-0">
          {/* 편 고르기 — 1편 · 2편 · 요약본 */}
          <div role="group" aria-label="실제 프로젝트 영상 고르기" className="mx-auto mb-3 grid max-w-[400px] grid-cols-3 gap-1.5 rounded-2xl bg-white/[0.06] p-1.5 ring-1 ring-white/10">
            {EPISODES.map((e) => {
              const on = e.id === ep
              return (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={on}
                  data-real-ep={e.id}
                  onClick={() => setEp(e.id)}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-xl px-1.5 py-1.5 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8894F] ${
                    on ? 'bg-[#E8894F] text-[#171B20]' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[0.98rem] font-black leading-tight">{e.tab}</span>
                  <span className={`mt-0.5 break-keep text-[0.74rem] font-semibold leading-tight ${on ? 'text-[#2A1A10]' : 'text-slate-300'}`}>{e.sub}</span>
                </button>
              )
            })}
          </div>

          <StoryFilm
            key={cur.id}
            ref={film}
            dataAttr="ax-real"
            mp4={`${cur.base}.mp4`}
            webm={`${cur.base}.webm`}
            poster={`${cur.base}-poster.webp`}
            length={cur.length}
            label={cur.label}
            tone="dark"
            caption="회사 이름은 밝히지 않고 업종만 소개해요. 실제 화면은 업체·고객 이름을 가리고 짧게만 보여 드리고, 나머지는 예시 데이터로 다시 그린 화면이에요."
            end={(replay) =>
              cur.id === 'ep1' ? (
                <>
                  <p className="break-keep text-[1.2rem] font-black leading-snug">
                    다음 편은
                    <br /> 쑥뜸원(웰니스) 이야기예요
                  </p>
                  <button
                    type="button"
                    data-real-next
                    onClick={() => {
                      playNext.current = true
                      setEp('ep2')
                    }}
                    className={STORY_END_PRIMARY}
                  >
                    2편 이어 보기 <span aria-hidden>→</span>
                  </button>
                  <Link to={diagnosisHref} className={STORY_END_SECONDARY}>
                    3분 AX Fit 진단 받기 <span aria-hidden>→</span>
                  </Link>
                  <button type="button" onClick={replay} className={STORY_END_REPLAY}>
                    처음부터 다시 보기
                  </button>
                </>
              ) : (
                <>
                  <p className="break-keep text-[1.2rem] font-black leading-snug">
                    우리 회사도
                    <br /> 바뀔 수 있을까요?
                  </p>
                  <Link to={diagnosisHref} className={STORY_END_PRIMARY}>
                    3분 AX Fit 진단 받기 <span aria-hidden>→</span>
                  </Link>
                  <button type="button" onClick={() => scrollToSection('samples', 'smooth')} className={STORY_END_SECONDARY}>
                    업종별 화면 직접 눌러 보기 <span aria-hidden>↑</span>
                  </button>
                  <button type="button" onClick={replay} className={STORY_END_REPLAY}>
                    처음부터 다시 보기
                  </button>
                </>
              )
            }
          />
        </div>
      </div>
    </section>
  )
}
