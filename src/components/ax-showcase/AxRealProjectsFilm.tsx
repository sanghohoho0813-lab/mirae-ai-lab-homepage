// AX 페이지 끝(FAQ 다음, 마무리 바로 앞) — 지금 실제로 만들고 있는 회사 두 곳을 두 편 연달아 보여 준다.
//  - 1편 의료폐기물 수거·운반(2분 31초) — 중소기업에 가까운 사례
//  - 2편 쑥뜸원(웰니스, 2분 51초) — 소상공인에 가까운 사례
//  녹음 1.1배 · 먹색 + 구리색 릴스(9:16) · 재생 속도 1 · 1.25 · 1.5배. 각 편 옆에 '누가 보면 좋은지'와 핵심 흐름을 둔다.
//  1편이 끝나면 '2편 이어 보기' → 2편으로 내려가 소리 켜고 재생. 한 편을 소리 켜고 보면 다른 편은 멈춘다.
//  회사 이름은 밝히지 않고 업종만. 영상 속 실제 화면은 업체·병원·고객 이름을 ○○ 로 바꾸거나 흐리게 가린 캡처이고 짧게만 나온다.
//  나머지 앱 모양 화면은 예시 데이터로 다시 그렸다. 매출·정산·영업 화면은 쓰지 않았다.
//  영상 원본·녹음·자막: media/ax-videos/real-ep1 · real-ep2.
import { useRef, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { scrollToSection } from '../../lib/businessPageScroll'
import StoryFilm, { STORY_END_PRIMARY, STORY_END_REPLAY, STORY_END_SECONDARY, type StoryFilmHandle } from '../video/StoryFilm'

export const AX_REAL_FILM_ID = 'real-projects-film'

const CAPTION = '회사 이름은 밝히지 않고 업종만 소개해요. 실제 화면은 업체·고객 이름을 가리고 짧게만 보여 드리고, 나머지는 예시 데이터로 다시 그린 화면이에요.'

const EPISODES = [
  {
    no: 1,
    id: 'real-project-1',
    base: '/business/ax/ax-real-ep1',
    label: '실제 프로젝트 1편 · 의료폐기물 수거·운반',
    length: '2분 31초',
    fit: '중소기업에 가까운 사례',
    title: '의료폐기물 수거·운반 회사',
    lead: '현장 직원, 사무실, 거래처가 따로 움직이는 일반 중소기업이시라면 꼭 한번 보세요. 현장에서 적고, 사무실에서 다시 옮기고, 정산을 맞추는 흐름이 우리 회사와 많이 닮았을 거예요.',
    flow: ['현장에서 휴대폰으로 한 번 입력 → 수거 이력·자재·정산 정보까지 이어져요', '거래처(병원)는 전용 포털에서 추가 수거·자재를 미리 요청해요', '쌓인 기록으로 다시 필요할 시점을 먼저 알려 주고, 배차 고도화는 다음 계획이에요'],
  },
  {
    no: 2,
    id: 'real-project-2',
    base: '/business/ax/ax-real-ep2',
    label: '실제 프로젝트 2편 · 쑥뜸원(웰니스)',
    length: '2분 51초',
    fit: '소상공인에 가까운 사례',
    title: '쑥뜸원(웰니스 매장)',
    lead: '피부관리실·마사지숍·필라테스처럼 이용권을 끊고 다시 오는 매장을 운영하신다면 이 편이 더 가까워요. 단골 고객을 어떻게 다시 챙기는지 보시면 돼요.',
    flow: ['몇 번만 누르면 관리 부위·고객 반응이 기록되고 다음 방문 때 바로 보여요', '오늘 다시 챙길 고객의 우선순위를 먼저 보여 줘요', '고객에게는 이용 내역·방문 요청·새 상품을 보는 전용 플랫폼을 드려요'],
  },
] as const

function Episode({
  ep,
  film,
  flip,
  onSound,
  end,
}: {
  ep: (typeof EPISODES)[number]
  film: Ref<StoryFilmHandle>
  flip?: boolean
  onSound: () => void
  end: (replay: () => void) => ReactNode
}) {
  return (
    <article id={ep.id} data-real-episode={ep.no} className="scroll-mt-20 md:grid md:grid-cols-[1fr_minmax(0,380px)] md:items-center md:gap-12 lg:gap-16">
      <div className={`text-center md:text-left ${flip ? 'md:order-2' : ''}`}>
        <p className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="rounded-full bg-[#E8894F] px-3 py-1 text-[0.86rem] font-black text-[#171B20]">{ep.no}편</span>
          <span data-real-fit className="rounded-full bg-[#D47A4A]/15 px-3 py-1 text-[0.86rem] font-bold text-[#E8B89A] ring-1 ring-inset ring-[#D47A4A]/40">
            {ep.fit}
          </span>
        </p>
        <h3 className="mt-3 break-keep text-[1.45rem] font-black leading-snug tracking-tight sm:text-[1.75rem]">{ep.title}</h3>
        <p className="mx-auto mt-3 max-w-md break-keep text-[1.02rem] leading-relaxed text-slate-300 sm:text-[1.08rem] md:mx-0">{ep.lead}</p>
        <ul className="mx-auto mt-5 grid max-w-md gap-2.5 text-left md:mx-0">
          {ep.flow.map((f, i) => (
            <li key={f} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#D47A4A] text-[0.8rem] font-black text-[#171B20]">
                {i + 1}
              </span>
              <span className="break-keep text-[0.96rem] leading-relaxed text-slate-200">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`mt-7 md:mt-0 ${flip ? 'md:order-1' : ''}`}>
        <StoryFilm
          ref={film}
          dataAttr={`ax-real-${ep.no}`}
          mp4={`${ep.base}.mp4`}
          webm={`${ep.base}.webm`}
          poster={`${ep.base}-poster.webp`}
          length={ep.length}
          label={ep.label}
          tone="dark"
          caption={CAPTION}
          onSound={onSound}
          end={end}
        />
      </div>
    </article>
  )
}

export default function AxRealProjectsFilm({ diagnosisHref }: { diagnosisHref: string }) {
  const film1 = useRef<StoryFilmHandle>(null)
  const film2 = useRef<StoryFilmHandle>(null)

  return (
    <section id={AX_REAL_FILM_ID} data-ax-real-film className="relative scroll-mt-16 overflow-hidden border-t border-[#343B44] bg-[#171B20] text-white">
      <div aria-hidden className="pointer-events-none absolute -left-28 top-16 h-[22rem] w-[22rem] rounded-full bg-[#D47A4A]/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-28 bottom-40 h-[20rem] w-[20rem] rounded-full bg-[#D47A4A]/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[1.02rem] font-black tracking-tight text-[#D9824F] sm:text-[1.1rem]">REAL PROJECTS</p>
          <h2 className="mt-3 break-keep text-[1.75rem] font-black leading-[1.25] tracking-tight sm:text-[2.2rem]">
            지금 실제로 만들고 있는
            <br /> <span className="text-[#E8B89A]">회사 두 곳</span>을 보여 드려요
          </h2>
          <p className="mt-3 break-keep text-[1.05rem] leading-relaxed text-slate-300 sm:text-[1.12rem]">
            1편은 중소기업에, 2편은 소상공인에 가까운 사례예요. 우리 회사와 비슷한 편을 보시면 AX가 대략 어떻게 흘러가는지 예상하실 수 있어요.
          </p>
        </header>

        <div className="mt-10 grid gap-14 sm:mt-12 md:gap-20">
          <Episode
            ep={EPISODES[0]}
            film={film1}
            onSound={() => film2.current?.pause()}
            end={(replay) => (
              <>
                <p className="break-keep text-[1.2rem] font-black leading-snug">
                  다음 편은
                  <br /> 쑥뜸원(웰니스) 이야기예요
                </p>
                <button type="button" data-real-next onClick={() => film2.current?.playWithSound()} className={STORY_END_PRIMARY}>
                  2편 이어 보기 <span aria-hidden>↓</span>
                </button>
                <Link to={diagnosisHref} className={STORY_END_SECONDARY}>
                  3분 AX Fit 진단 받기 <span aria-hidden>→</span>
                </Link>
                <button type="button" onClick={replay} className={STORY_END_REPLAY}>
                  처음부터 다시 보기
                </button>
              </>
            )}
          />
          <Episode
            ep={EPISODES[1]}
            film={film2}
            flip
            onSound={() => film1.current?.pause()}
            end={(replay) => (
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
            )}
          />
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-[#D47A4A]/30 bg-white/[0.04] px-5 py-6 text-center sm:mt-16 sm:px-8">
          <p className="break-keep text-[1.08rem] font-black leading-snug sm:text-[1.2rem]">두 편을 보시면 흐름이 그려지실 거예요</p>
          <p className="mt-2 break-keep text-[0.98rem] leading-relaxed text-slate-300 sm:text-[1.04rem]">
            업종이 달라도 순서는 같아요. 한 번 입력한 데이터가 다음 업무로 이어지고, 쌓인 데이터가 다음에 할 일을 알려 줘요. 우리 회사는 어디서부터 시작하면 좋을지는 3분 진단으로 먼저 확인해 보세요.
          </p>
          <Link
            to={diagnosisHref}
            data-real-diag
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#E8894F] px-6 text-[1.02rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]"
          >
            3분 AX Fit 진단 받기 <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
