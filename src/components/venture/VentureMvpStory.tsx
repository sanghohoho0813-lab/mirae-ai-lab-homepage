// 2주 기술사업 빌드 — 히어로 다음 '혹시, 이런 고민을…'(고민 5개) · FAQ 앞 '그래서, 2주 기술사업 빌드를 하면?'(마지막 정리).
// 모양은 AX 풀 패키지 페이지와 같다(bigStory: 가운데 정렬 · 큰 글자 · 모두 굵게 · 살구색 강조 · 형광펜 띠 · 스크롤 등장).
// 이 상품의 핵심: 단순 MVP 개발이 아니라 벤처기업확인 + 기술사업 기획 + 실제 MVP + 이후 성장기회를 한 프로젝트로 잇는다.
// ⚠️ 문구는 대표님 원문 그대로. 세제혜택은 반드시 '요건 충족 시'(자세한 요건·예상 절감액은 아래 FAQ). 선정·승인을 약속하지 않는다.
import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
import { scrollToSection } from '../../lib/businessPageScroll'
import { ConcernList, ConcernsNext, Divider, EM, Mark, NW, OUT_BODY, OUT_LINE, bigTitle, brandCls, type Concern } from '../ax-showcase/bigStory'

const wrap = 'mx-auto max-w-6xl'

const MVP_CONCERNS: readonly Concern[] = [
  { lead: '지금 사업은 잘하고 있지만,', key: ['앞으로 회사를 한 단계 더 키울', '새로운 성장동력이 잘 보이지 않는다.'] },
  { lead: 'AI·플랫폼 같은 기술사업을 시작해보고 싶은데,', key: ['우리 회사 업종에서 실제로 무엇을 만들어야 할지 막막하다.'] },
  { lead: '아이디어가 있어도 처음부터 수천만원을 들여 개발하기는 부담스럽고,', key: ['사업계획서만으로 기술성과 가능성을 보여주는 데도 한계를 느낀다.'] },
  { lead: '창업한 지 3년이 지나기 전에 벤처기업확인을 받아', key: ['받을 수 있는 세제혜택은 미리 챙기고,', '기술사업도 함께 준비하고 싶다.'] },
  { lead: '정책자금·정부지원사업 같은 기회가 왔을 때', key: ['비슷한 회사들 사이에서 우리 회사가', '조금이라도 더 경쟁력 있고 눈에 띄었으면 좋겠다.'] },
]

/** 히어로 바로 다음 · 소개 영상 바로 위 — 영상을 보기 전에 '우리 회사 얘기'라고 느끼게 하는 공감 구간(상품 설명 없이 고민 5개만) */
export function VentureMvpConcerns() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="concerns" data-mvp-concerns className="relative scroll-mt-16 overflow-hidden bg-[#171B20]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D47A4A]/35" />
      <div className={`relative w-full ${wrap} px-5 pb-24 pt-20 text-center sm:px-6 sm:pb-28 sm:pt-24`}>
        <h2 data-reveal className={bigTitle('mvp')}>
          <span className={NW}>혹시, <span className={EM}>이런 고민</span>을</span> <span className={NW}>하고 계시진 않나요?</span>
        </h2>
        <ConcernList items={MVP_CONCERNS} data="mvp" />
        <ConcernsNext data="mvp">
          하나라도 해당된다면,
          <br />
          <span className={NW}>벤처기업확인 준비부터</span> <span className={NW}>실제 기술사업 MVP까지</span>
          <br />
          <span className={NW}>어떻게 함께 만드는지</span>{' '}
          <span className={EM}>
            <span className={NW}>영상으로 먼저</span> <span className={NW}>보여드릴게요.</span>
          </span>
        </ConcernsNext>
      </div>
    </section>
  )
}

// 벤처기업확인 혜택 요약 — FAQ 에 자세한 표가 있으니 숫자만 짧게. 세제혜택은 '요건 충족 시' 를 꼭 붙인다
// pre 는 말 덩어리마다 통째로 접힌다(폰에서 '요건 충족 / 시' 처럼 갈라지지 않게)
const BENEFITS = [
  { pre: ['요건 충족 시'], em: '소득세·법인세 50% 감면' },
  { pre: ['요건 충족 시', '사업용 부동산'], em: '취득세 75% 경감' },
  { pre: ['정부지원·정책자금·R&D 등'], em: '후속 성장기회 활용' },
] as const

/** FAQ 바로 앞 — '그래서 이 상품을 하면 결국 우리 회사에 무엇이 남는가?' 를 짧고 강하게.
 *  성장동력 발굴 → 기술사업 MVP → 벤처기업확인 → 정부지원사업·정책자금·R&D·후속 AX → 혜택 요약 → 마지막 두 문장 */
export function VentureMvpOutcome() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, 130)
  return (
    <section ref={ref} id="outcome" data-mvp-outcome className="relative scroll-mt-16 overflow-hidden bg-[#171B20]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D47A4A]/35" />
      <div className={`relative w-full ${wrap} px-5 pb-24 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28`}>
        <h2 data-reveal className={bigTitle('mvp')}>
          <span className={NW}>그래서,</span> <span className={`${NW} ${EM}`}>2주 기술사업 빌드</span>
          <span className={NW}>를 하면?</span>
        </h2>
        <div className={OUT_BODY}>
          <p>
            <span data-reveal className={OUT_LINE}>우리 회사의 기존 사업 안에서</span>
            <span data-reveal className={OUT_LINE}>
              다음 성장동력이 될 <span className={EM}>기술사업 하나</span>를 찾아냅니다.
            </span>
          </p>
          <p>
            <span data-reveal className={OUT_LINE}>그 아이디어를 서류에만 남겨두지 않고,</span>
            <span data-reveal className={OUT_LINE}>
              <span className={EM}>직접 보여주고 시연할 수 있는 MVP</span>로 만듭니다.
            </span>
          </p>
          <p>
            <span data-reveal className={OUT_LINE}>
              동시에 <span className={EM}>벤처기업확인</span>을 준비해
            </span>
            <span data-reveal className={OUT_LINE}>받을 수 있는 혜택은 챙기고,</span>
            <span data-reveal className={OUT_LINE}>‘기술사업을 계획하는 회사’가 아니라</span>
            <span data-reveal className={OUT_LINE}>
              <span className={EM}>실제로 기술사업을 시작한 회사</span>의 모습을 만듭니다.
            </span>
          </p>
          <p data-mvp-outcome-key>
            <span data-reveal className={OUT_LINE}>그리고 그 결과물을</span>
            <span data-reveal className={OUT_LINE}>
              <Mark>정부지원사업·정책자금·R&D·후속 AX</Mark>로 <span className={NW}>이어질 수 있는</span>
            </span>
            <span data-reveal className={OUT_LINE}>
              <Mark>회사의 경쟁력과 성장 근거</Mark>로 활용합니다.
            </span>
          </p>
        </div>

        {/* 벤처기업확인 혜택 — 숫자만 짧게 한 번 더(자세한 요건·예상 절감액은 아래 FAQ) */}
        <div data-mvp-benefits className="mx-auto mt-[19svh] max-w-3xl break-keep font-bold lg:mt-[24svh] lg:max-w-5xl">
          <p data-reveal className="reveal-soft text-[clamp(1.5rem,7.4vw,1.8rem)] leading-[1.5] text-[#FAFAF8] [text-wrap:balance] sm:text-[1.8rem] lg:text-[2.25rem]">
            창업 초기라면 벤처기업확인의 <span className={EM}>시점</span>도 중요합니다.
          </p>
          <ul className="mx-auto mt-10 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-4xl">
            {BENEFITS.map((b) => (
              <li key={b.em} data-reveal className="relative py-6 text-[clamp(1.3rem,6.2vw,1.5rem)] leading-[1.45] text-slate-200 [text-wrap:balance] sm:py-7 sm:text-[1.5rem] lg:py-9 lg:text-[1.95rem]">
                <span aria-hidden className="rv-line absolute inset-x-0 top-0 h-px bg-white/[0.12]" />
                {b.pre.map((t) => (
                  <span key={t}>
                    <span className={NW}>{t}</span>{' '}
                  </span>
                ))}
                <span className={`${NW} ${EM}`}>{b.em}</span>
              </li>
            ))}
          </ul>
          <a
            href="#faq"
            onClick={(e) => {
              if (scrollToSection('faq', 'smooth')) e.preventDefault()
            }}
            data-reveal
            data-mvp-benefits-faq
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-[1.05rem] font-bold text-[#E8B89A] underline decoration-[#E8B89A]/40 underline-offset-4 transition-colors hover:text-white sm:text-[1.12rem] lg:mt-10 lg:text-[1.3rem]"
          >
            자세한 요건과 예상 절감액은 자주 묻는 질문에서 <span aria-hidden>↓</span>
          </a>
        </div>

        <Divider className="mt-[19svh] lg:mt-[24svh]" />
        <p data-mvp-outcome-brand className={brandCls('mvp')}>
          <span data-reveal className="block reveal-soft [text-wrap:balance]">
            <span className={NW}>벤처기업확인만 받고</span> <span className={NW}>끝내지 않습니다.</span>
          </span>
          <span data-reveal className="mt-[0.35em] block reveal-soft text-[#D47A4A]">
            <span className="block">
              <span className={NW}>받을 수 있는</span> <span className={NW}>혜택은 챙기고,</span>
            </span>
            <span className="block">
              <span className={NW}>앞으로 보여줄 기술사업</span> <span className={NW}>하나까지 남깁니다.</span>
            </span>
          </span>
        </p>
      </div>
    </section>
  )
}
