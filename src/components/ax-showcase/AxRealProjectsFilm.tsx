// 실제 기업 프로젝트 6곳 중 두 곳을 영상으로 크게 보여 준다 — AX 페이지 '직접 만든 화면 22개' 구간(#samples) 안,
// REAL PROJECTS 목록 맨 앞(AxSamplesBand 의 featured 자리). 나머지 4곳은 그 아래 작은 카드로 남는다.
//  - 1편 의료폐기물 수거·운반 기업(2분 31초) — 일반 중소기업 사례
//  - 2편 웰니스 케어 기업(쑥뜸원, 2분 51초) — 소상공인 사례
//  녹음 1.1배 · 먹색 + 구리색 릴스(9:16) · 재생 속도 1 · 1.25 · 1.5배. 각 편 옆에 '누가 보면 좋은지'와 핵심 흐름을 둔다.
//  1편이 끝나면 '2편 이어 보기' → 2편으로 내려가 소리 켜고 재생. 한 편을 소리 켜고 보면 다른 편은 멈춘다.
//  회사 이름은 밝히지 않고 업종만. 영상 속 실제 화면은 업체·병원·고객 이름을 ○○ 로 바꾸거나 흐리게 가린 캡처이고 짧게만 나온다.
//  나머지 앱 모양 화면은 예시 데이터로 다시 그렸다. 매출·정산·영업 화면은 쓰지 않았다.
//  영상 원본·녹음·자막: media/ax-videos/real-ep1 · real-ep2.
import { useRef, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { scrollToSection } from '../../lib/businessPageScroll'
import { DEEP_PROJECTS } from '../../data/realProjectsDeep'
import StoryFilm, { STORY_END_PRIMARY, STORY_END_REPLAY, STORY_END_SECONDARY, type StoryFilmHandle } from '../video/StoryFilm'

/** 메뉴 '실제 프로젝트 영상'이 오는 자리 */
export const AX_REAL_FILM_ID = 'real-projects-film'
/** 영상으로 크게 보여 주는 두 곳 — 아래 작은 목록에서는 뺀다 */
export const FEATURED_PROJECT_SLUGS = ['medwaste', 'wellness'] as const

const CAPTION = '업종만 소개해요. 실제 화면은 이름을 가리고 짧게만, 나머지는 예시 데이터로 다시 그린 화면이에요.'
const stageOf = (slug: string) => DEEP_PROJECTS.find((p) => p.slug === slug)?.stage
// 승인·선정을 약속하지 않는다 — '참여 준비 중'까지만
const FUNDING_STATUS = '정책자금·정부지원사업 참여 준비 중'

const EPISODES = [
  {
    no: 1,
    slug: 'medwaste',
    id: 'real-project-1',
    base: '/business/ax/ax-real-ep1',
    label: '실제 프로젝트 1편 · 의료폐기물 수거·운반 기업',
    length: '2분 31초',
    fit: '일반 중소기업 사례',
    emoji: '🚛',
    title: '의료폐기물 수거·운반 기업',
    lead: '현장 직원, 사무실, 거래처가 따로 움직이는 일반 중소기업이시라면 꼭 한번 보세요. 현장에서 적고, 사무실에서 다시 옮기고, 정산을 맞추는 흐름이 우리 회사와 많이 닮았을 거예요.',
    flow: ['현장에서 휴대폰으로 한 번 입력 → 수거 이력·자재·정산 정보까지 이어져요', '거래처(병원)는 전용 포털에서 추가 수거·자재를 미리 요청해요', '쌓인 기록으로 다시 필요할 시점을 먼저 알려 주고, 배차 고도화는 다음 계획이에요'],
  },
  {
    no: 2,
    slug: 'wellness',
    id: 'real-project-2',
    base: '/business/ax/ax-real-ep2',
    label: '실제 프로젝트 2편 · 웰니스 케어 기업(쑥뜸원)',
    length: '2분 51초',
    fit: '소상공인 사례',
    emoji: '🌿',
    title: '웰니스 케어 기업(쑥뜸원)',
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
  const stage = stageOf(ep.slug)
  // 폰: 제목·안내 → 영상 → 핵심 흐름(영상이 일찍 보이게). PC: 글(제목·안내 위, 흐름 아래) 한쪽 + 영상 다른 쪽, 2편은 좌우를 바꾼다.
  const text = flip ? 'md:col-start-2' : 'md:col-start-1'
  return (
    <article
      id={ep.id}
      data-real-episode={ep.no}
      className={`relative scroll-mt-20 overflow-hidden rounded-3xl border border-[#D47A4A]/45 bg-gradient-to-br from-[#D47A4A]/[0.12] via-white/[0.03] to-transparent p-5 shadow-[0_30px_80px_-40px_rgba(212,122,74,0.55)] sm:p-8 md:grid md:grid-rows-[auto_1fr] md:gap-x-10 lg:gap-x-14 ${
        flip ? 'md:grid-cols-[minmax(0,360px)_1fr]' : 'md:grid-cols-[1fr_minmax(0,360px)]'
      }`}
    >
      <div className={`text-center md:row-start-1 md:self-end md:text-left ${text}`}>
        <p className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="rounded-full bg-[#E8894F] px-3 py-1 text-[0.86rem] font-black text-[#171B20]">▶ {ep.no}편 영상</span>
          <span data-real-fit className="rounded-full bg-[#D47A4A]/15 px-3 py-1 text-[0.86rem] font-bold text-[#E8B89A] ring-1 ring-inset ring-[#D47A4A]/40">
            {ep.fit}
          </span>
        </p>
        <h4 className="mt-3 break-keep text-[1.45rem] font-black leading-snug tracking-tight text-white sm:text-[1.75rem]">
          <span aria-hidden className="mr-1.5">{ep.emoji}</span>
          {ep.title}
        </h4>
        {/* 진행 상태 — 두 곳 모두 같은 말로(대표님 확인: 실제로 마무리 단계) */}
        <p data-real-status className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 md:justify-start">
          {stage && <span className="rounded-lg bg-white/[0.08] px-2.5 py-1 text-[0.86rem] font-bold text-white ring-1 ring-inset ring-white/15">{stage}</span>}
          <span className="rounded-lg bg-white/[0.08] px-2.5 py-1 text-[0.86rem] font-bold text-slate-200 ring-1 ring-inset ring-white/15">{FUNDING_STATUS}</span>
        </p>
        <p className="mx-auto mt-3 max-w-md break-keep text-[1.02rem] leading-relaxed text-slate-300 sm:text-[1.08rem] md:mx-0">{ep.lead}</p>
      </div>
      <div className={`mt-6 md:row-span-2 md:row-start-1 md:mt-0 md:self-center ${flip ? 'md:col-start-1' : 'md:col-start-2'}`}>
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
      <ul className={`mx-auto mt-6 grid max-w-md gap-2.5 text-left md:row-start-2 md:mx-0 md:mt-5 md:self-start ${text}`}>
        {ep.flow.map((f, i) => (
          <li key={f} className="flex gap-3 rounded-2xl border border-white/10 bg-[#050B11]/50 px-4 py-3">
            <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#D47A4A] text-[0.8rem] font-black text-[#171B20]">
              {i + 1}
            </span>
            <span className="break-keep text-[0.96rem] leading-relaxed text-slate-200">{f}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

/** 영상 두 편(1편 → 2편) — REAL PROJECTS 목록 맨 앞에 놓는다 */
export default function AxRealProjectsFilm({ diagnosisHref }: { diagnosisHref: string }) {
  const film1 = useRef<StoryFilmHandle>(null)
  const film2 = useRef<StoryFilmHandle>(null)

  return (
    <div data-ax-real-film className="grid gap-8 sm:gap-10">
      <Episode
        ep={EPISODES[0]}
        film={film1}
        onSound={() => film2.current?.pause()}
        end={(replay) => (
          <>
            <p className="break-keep text-[1.2rem] font-black leading-snug">
              다음 편은
              <br /> 웰니스 케어(쑥뜸원) 이야기예요
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
  )
}
