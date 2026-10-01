// AX 페이지 끝(FAQ 다음, 마무리 바로 앞) — 지금 실제로 만들고 있는 회사 두 곳을 소개하는 영상(대표님 목소리 · 2분 19초).
// 의료폐기물 수거·운반 회사 / 쑥뜸원(웰니스) — 회사 이름은 밝히지 않고 업종만.
// ⚠️ 영상 속 실제 화면은 업체명·병원명·사람 이름·금액·연락처를 ○○ 로 바꾸거나 흐리게 가린 캡처이고, 몇 번만 짧게 나온다.
//    나머지는 각 시스템의 색감만 살려 다시 그린 예시 화면이다. 매출·정산·영업 화면은 쓰지 않았다.
//    영상 원본(HyperFrames)·녹음·자막은 media/ax-videos/real-projects/.
import { Link } from 'react-router-dom'
import { scrollToSection } from '../../lib/businessPageScroll'
import StoryFilm, { STORY_END_PRIMARY, STORY_END_REPLAY, STORY_END_SECONDARY } from '../video/StoryFilm'

export const AX_REAL_FILM_ID = 'real-projects-film'

const POINTS = [
  { k: '의료폐기물 수거·운반', d: '현장에서 휴대폰으로 한 번 입력하면 수거 이력·자재·정산 정보가 이어지고, 병원은 전용 포털에서 바로 요청해요.' },
  { k: '쑥뜸원(웰니스)', d: '몇 번만 누르면 관리 부위와 고객 반응이 기록되고, 다음 방문 때 한눈에 보여요. 고객에게는 전용 플랫폼을 드려요.' },
  { k: '쌓인 데이터 → AI', d: '어디서 시간이 새는지, 누구를 다시 챙길지, 무엇을 먼저 고칠지 우선순위로 정리해 드려요.' },
] as const

export default function AxRealProjectsFilm({ diagnosisHref }: { diagnosisHref: string }) {
  return (
    <section id={AX_REAL_FILM_ID} data-ax-real-film className="relative scroll-mt-16 overflow-hidden border-t border-[#343B44] bg-[#171B20] text-white">
      <div aria-hidden className="pointer-events-none absolute -left-28 top-16 h-[22rem] w-[22rem] rounded-full bg-[#D47A4A]/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 md:grid md:grid-cols-[1fr_minmax(0,400px)] md:items-center md:gap-12 lg:gap-16">
        <div className="text-center md:text-left">
          <p className="text-[1.02rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.1rem]">REAL PROJECTS</p>
          <h2 className="mt-3 break-keep text-[1.75rem] font-black leading-[1.25] tracking-tight sm:text-[2.2rem]">
            지금 실제로 만들고 있는
            <br /> <span className="text-[#E8B89A]">회사 두 곳</span>을 보여 드려요
          </h2>
          <p className="mx-auto mt-3 max-w-md break-keep text-[1.05rem] leading-relaxed text-slate-300 sm:text-[1.12rem] md:mx-0">
            업종은 전혀 다르지만 원리는 같아요. 현장에서 한 번 입력하면 정보가 이어지고, 쌓인 데이터가 다음 할 일을 알려 줘요.
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
          <StoryFilm
            dataAttr="ax-real"
            mp4="/business/ax/ax-real-projects.mp4"
            webm="/business/ax/ax-real-projects.webm"
            poster="/business/ax/ax-real-projects-poster.webp"
            length="2분 19초"
            label="실제 프로젝트 · 두 회사 이야기"
            tone="dark"
            caption="회사 이름은 밝히지 않고 업종만 소개해요. 실제 화면은 업체·개인 정보를 가리고 짧게만 보여 드리고, 나머지는 색감만 살려 다시 그린 예시 화면이에요."
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
      </div>
    </section>
  )
}
