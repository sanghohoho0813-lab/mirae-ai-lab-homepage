// 실제 프로젝트 영상 1편 · 2편 + 그 밖에 진행 중인 프로젝트 — AX 페이지 '직접 만든 화면 22개' 다음, 영상 2(비용) 바로 앞.
// 대표님 요청: 금액을 보기 전에 실제 사례부터. 소개 영상(AxFilms)과 같은 살구색 바탕 · 같은 FilmBlock(핵심만 옆에)으로 단순하게.
//  - 1편 의료폐기물 수거·운반 기업(2분 28초) — 일반 중소기업 사례
//  - 2편 웰니스 케어 기업(쑥뜸원, 2분 41초) — 소상공인 사례
//  - 진행 상태는 두 곳 모두 같은 말: 완성 · 실무에서 쓰며 안정화하는 유지보수 단계 / 정책자금·지원사업은 따로 계속 신청 중
//    (승인·선정을 약속하지 않는다 — '신청 중'까지만)
//  1편이 끝나면 '2편 이어 보기', 2편이 끝나면 '진행 방식·비용(영상 2) 보기'. 재생 속도 1 · 1.25 · 1.5배.
//  회사 이름은 밝히지 않고 업종만. 영상 속 실제 화면은 업체·병원·고객 이름을 ○○ 로 바꾸거나 흐리게 가린 캡처이고 짧게만 나온다.
//  나머지 앱 모양 화면은 예시 데이터로 다시 그렸다. 영상 원본·자막: media/ax-videos/v3/real-ep1 · real-ep2(영상 스타일 v3 · 장면표 v3/SCENES.md).
import { Link } from 'react-router-dom'
import { DEEP_PROJECTS } from '../../data/realProjectsDeep'
import { END_PRIMARY, END_REPLAY, END_SECONDARY, FilmBlock, playFilm, type Film } from './AxFilms'

/** 메뉴 '실제 프로젝트 영상'이 오는 자리 */
export const AX_REAL_FILM_ID = 'real-projects-film'

const stageOf = (slug: string) => DEEP_PROJECTS.find((p) => p.slug === slug)?.stage ?? ''
const FUNDING_STATUS = '정책자금·지원사업은 따로 계속 신청 중'
const CAPTION = '회사 이름은 밝히지 않고 업종만 소개해요. 실제 화면은 이름을 가리고 짧게만, 나머지는 예시 데이터로 다시 그린 화면이에요.'

const REAL: readonly [Film, Film] = [
  {
    id: 'real-project-1',
    no: 1,
    kind: 'real',
    short: '실제 프로젝트 1편',
    mp4: '/business/ax/ax-real-ep1.mp4',
    webm: '/business/ax/ax-real-ep1.webm',
    poster: '/business/ax/ax-real-ep1-poster.webp',
    length: '2분 28초',
    who: '일반 중소기업 사례',
    emoji: '🚛',
    title: '의료폐기물 수거·운반 기업',
    status: [stageOf('medwaste'), FUNDING_STATUS],
    lead: '현장·사무실·거래처가 따로 움직이는 중소기업이라면 꼭 한번 보세요.',
    points: ['현장에서 한 번 입력 → 수거·자재·정산까지', '병원은 전용 포털에서 미리 요청', '다시 필요할 시점을 먼저 알려 주기'],
    caption: CAPTION,
  },
  {
    id: 'real-project-2',
    no: 2,
    kind: 'real',
    short: '실제 프로젝트 2편',
    mp4: '/business/ax/ax-real-ep2.mp4',
    webm: '/business/ax/ax-real-ep2.webm',
    poster: '/business/ax/ax-real-ep2-poster.webp',
    length: '2분 41초',
    who: '소상공인 사례',
    emoji: '🌿',
    title: '웰니스 케어 기업(쑥뜸원)',
    status: [stageOf('wellness'), FUNDING_STATUS],
    lead: '피부관리실·마사지숍·필라테스처럼 이용권 매장이라면 이 편이 더 가까워요.',
    points: ['몇 번의 터치로 관리 기록', '오늘 다시 챙길 고객을 먼저', '고객에게는 전용 플랫폼'],
    caption: CAPTION,
  },
]

/** 영상으로 크게 보여 주는 두 곳 — 아래 '그 밖에' 목록에서는 뺀다 */
const FEATURED = ['medwaste', 'wellness']

export default function AxRealProjectsFilm({ diagnosisHref }: { diagnosisHref: string }) {
  const rest = DEEP_PROJECTS.filter((p) => !FEATURED.includes(p.slug))
  return (
    <section id={AX_REAL_FILM_ID} data-ax-real-film className="relative scroll-mt-16 overflow-hidden bg-[#F4ECE4] text-[#171B20]">
      <div aria-hidden className="pointer-events-none absolute -right-28 top-10 h-[24rem] w-[24rem] rounded-full bg-[#D47A4A]/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-[55%] h-[18rem] w-[18rem] rounded-full bg-[#E8B89A]/35 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 pt-11 text-center sm:px-6 sm:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#171B20] px-4 py-2 text-[0.98rem] font-black text-white shadow-md sm:text-[1.02rem]">REAL PROJECTS</p>
        <h2 className="mt-4 break-keep text-[2rem] font-black leading-[1.18] tracking-tight sm:text-[2.6rem]">
          실제 기업에서
          <br /> <span className="text-[#B4532A]">이렇게 쓰고 있어요</span>
        </h2>
      </div>

      <FilmBlock
        film={REAL[0]}
        end={(replay) => (
          <>
            <p className="break-keep text-[1.2rem] font-black leading-snug">
              다음 편은
              <br /> 웰니스 케어(쑥뜸원) 이야기예요
            </p>
            <button type="button" data-real-next onClick={() => playFilm('real-project-2')} className={END_PRIMARY}>
              2편 이어 보기 <span aria-hidden>↓</span>
            </button>
            <Link to={diagnosisHref} className={END_SECONDARY}>
              3분 AX Fit 진단 받기 <span aria-hidden>→</span>
            </Link>
            <button type="button" onClick={replay} className={END_REPLAY}>
              처음부터 다시 보기
            </button>
          </>
        )}
      />
      <div aria-hidden className="relative mx-auto h-px max-w-4xl bg-[#171B20]/10" />
      <FilmBlock
        film={REAL[1]}
        flip
        end={(replay) => (
          <>
            <p className="break-keep text-[1.2rem] font-black leading-snug">
              이제 진행 방식과
              <br /> 비용을 보세요
            </p>
            <button type="button" data-real-cost onClick={() => playFilm('film-2')} className={END_PRIMARY}>
              진행 방식·비용(영상 2) 보기 <span aria-hidden>▶</span>
            </button>
            <Link to={diagnosisHref} className={END_SECONDARY}>
              3분 AX Fit 진단 받기 <span aria-hidden>→</span>
            </Link>
            <button type="button" onClick={replay} className={END_REPLAY}>
              처음부터 다시 보기
            </button>
          </>
        )}
      />

      {/* 그 밖에 진행 중인 프로젝트 — 업종 · 한 줄 요약 · 진행 단계만 */}
      <div className="relative mx-auto max-w-6xl px-5 pb-12 sm:px-6 sm:pb-16">
        <p data-ax-real-rest className="break-keep text-[1.12rem] font-black sm:text-[1.2rem]">
          그 밖에 진행 중인 프로젝트 {rest.length}곳
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <li key={p.slug} data-ax-real-project className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-[#D47A4A]/25">
              <span className="inline-flex rounded-full bg-[#171B20] px-2.5 py-1 text-[0.78rem] font-bold text-white">{p.stage}</span>
              <p className="mt-2.5 break-keep text-[1.04rem] font-black leading-snug">{p.industry}</p>
              <p className="mt-1 break-keep text-[0.92rem] leading-snug text-[#4A535D]">{p.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 break-keep text-[0.84rem] leading-relaxed text-[#5E6670]">회사 이름 대신 업종만 적었어요. 내부 자료는 공개하지 않아요.</p>
      </div>
    </section>
  )
}
