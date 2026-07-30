// 섹션 모음 — Hero·월 5개사는 홈에서, 세 가지 가치·5단계 방법론은 정책자금 상세페이지에서 사용한다.
// 한 섹션에서는 하나의 주장만 전달하고, 주장 바로 아래 증명(화면·산출물·근거)을 배치한다.
import { Link } from 'react-router-dom'
import { AX_V2_INDUSTRIES } from '../../data/axIndustryShowcaseV2'
import { AX_CORE_VALUES, AX_METHOD_STEPS, AX_SELECTION_DECLINE, AX_SELECTION_PRIORITY } from '../../data/axPackages'

const band = 'px-5 py-11 sm:px-6 sm:py-16'
const wrap = 'mx-auto max-w-5xl'
const h2Light = 'break-keep text-[1.6rem] font-black leading-tight text-slate-900 sm:text-[2.15rem]'

// 첫 화면에 바로 보여줄 대표 업종 3개 — 전체 15개 중 가장 익숙한 업종부터.
const HERO_PREVIEW_SLUGS = ['manufacturing', 'wholesale-logistics', 'professional-services']
const HERO_PREVIEWS = HERO_PREVIEW_SLUGS.map((k) => AX_V2_INDUSTRIES.find((i) => i.slug === k)).filter(
  (i): i is (typeof AX_V2_INDUSTRIES)[number] => Boolean(i),
)

/** SECTION 1 — Hero. 5초 안에 무엇을 파는 회사인지 이해되게 한다. 가격·긴 과정설명은 넣지 않는다. */
export function AxHeroV2({ onShowcase, onPickIndustry }: { onShowcase: () => void; onPickIndustry: (slug: string) => void }) {
  return (
    <section className="relative flex min-h-[calc(100svh-53px)] items-center overflow-hidden bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_78%_at_50%_-10%,rgba(56,189,248,0.22),transparent_62%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-8 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-slate-950" />

      <div className={`relative w-full ${wrap} px-5 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16`}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[1.0rem] font-bold text-teal-200 backdrop-blur">
          정책자금 × AX 사업화
        </span>

        <h1 className="mt-6 max-w-4xl break-keep text-[clamp(2rem,7.4vw,2.9rem)] font-black leading-[1.26] tracking-normal text-white sm:mt-7 sm:text-[clamp(2.5rem,5.4vw,3.6rem)]">
          이제 사업계획서만으로는 부족합니다.<br />
          우리 회사를 <span className="text-teal-300">정책자금을 잘 받을 수 있는 사업체 유형</span>으로<br className="hidden sm:block" /> 먼저 바꿔드립니다.
        </h1>

        <p className="mt-5 max-w-2xl break-keep text-[1.18rem] leading-relaxed text-slate-300 sm:mt-6 sm:text-[1.32rem]">
          기존 업종의 경험과 데이터를 실제 AX 서비스로 바꾸고,<br className="hidden sm:block" />
          화면·사업모델·인증·자금전략을 한 흐름으로 설계합니다.
        </p>

        <p className="mt-5 max-w-2xl break-keep rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-[1.16rem] leading-relaxed text-slate-200 backdrop-blur sm:px-6 sm:py-5 sm:text-[1.28rem]">
          지금 사업을 버리는 것이 아닙니다.<br />
          <span className="font-black text-amber-300">정책자금에서 평가받을 수 있도록</span> 사업의 구조를 바꾸는 것입니다.
        </p>

        {/* 첫 화면부터 실제 화면 3개 — 이게 무엇인지 바로 알 수 있게 한다 */}
        <div className="mt-7">
          <p className="text-[1.03rem] font-bold text-slate-400">이런 화면을 만들어 드립니다 · 전체 15개 업종</p>
          <div className="mt-2.5 grid grid-cols-3 gap-2 sm:gap-3">
            {HERO_PREVIEWS.map((ind) => (
              <button
                key={ind.slug}
                type="button"
                onClick={() => onPickIndustry(ind.slug)}
                aria-label={`${ind.displayName} AX 화면 보기`}
                className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] p-1.5 text-left transition-colors hover:border-teal-400/50 hover:bg-white/[0.08] sm:p-2"
              >
                <span className="block h-[62px] overflow-hidden rounded-lg bg-slate-950 sm:h-[104px]">
                  <img
                    src={ind.stages[0].img.srcSm}
                    alt={`${ind.displayName} AX 화면 예시`}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-1.5 flex items-center gap-1 px-0.5">
                  <span aria-hidden className="text-[1.05rem] leading-none">{ind.icon}</span>
                  <span className="min-w-0 truncate text-[1rem] font-bold leading-tight text-slate-200">{ind.displayName}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:max-w-2xl sm:flex-row">
          <button
            type="button"
            onClick={onShowcase}
            className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 text-[1.15rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300"
          >
            15개 업종 전체 보기
          </button>
          <Link
            to="/business-diagnosis"
            className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 text-[1.15rem] font-bold text-white transition-colors hover:bg-white/10"
          >
            진행 가능 여부 확인
          </Link>
        </div>

        <p className="mt-4">
          <Link to="/business-services/funding-consulting" className="text-[1.06rem] font-semibold text-slate-400 underline underline-offset-4 transition-colors hover:text-white">
            프로그램 자세히 보기
          </Link>
        </p>
      </div>
    </section>
  )
}

/** SECTION 3 — 미래AI랩이 만드는 세 가지 가치 */
export function AxCoreValuesSection() {
  return (
    <section className={`${band} border-t border-slate-200 bg-white`}>
      <div className={wrap}>
        <h2 className={h2Light}>미래AI랩이 만드는 세 가지</h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {AX_CORE_VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span aria-hidden className="text-[1.6rem] leading-none">{v.icon}</span>
              <h3 className="mt-3 break-keep text-[1.26rem] font-black leading-snug text-slate-900 sm:text-[1.38rem]">{v.title}</h3>
              <p className="mt-2 break-keep text-[1.09rem] leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** SECTION 4 — 고유 방법론 5단계 */
export function AxMethodSection() {
  return (
    <section id="ax-method" className={`${band} scroll-mt-16 border-t border-slate-200 bg-slate-50`}>
      <div className={wrap}>
        <h2 className={h2Light}>
          평범한 업무를<br className="hidden sm:block" /> 정책자금에서 설명할 수 있는 <span className="text-blue-600">AX 사업</span>으로 바꿉니다.
        </h2>
        <ol className="mt-6 space-y-2.5">
          {AX_METHOD_STEPS.map((s) => (
            <li key={s.no} className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-[1.26rem]" aria-hidden>{s.icon}</span>
              <div className="min-w-0">
                <p className="text-[1.0rem] font-black tracking-tight text-blue-600">{s.no}단계</p>
                <h3 className="mt-0.5 break-keep text-[1.24rem] font-black leading-snug text-slate-900 sm:text-[1.36rem]">{s.title}</h3>
                <p className="mt-1.5 break-keep text-[1.09rem] leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** SECTION — 고객 선별기준. 월 최대 5개사를 크게 강조한다. */
export function AxSelectionSection() {
  return (
    <section id="selection" className={`${band} scroll-mt-16 border-t border-white/10 bg-slate-950`}>
      <div className={wrap}>
        {/* 숫자를 먼저, 크게 */}
        <div className="rounded-3xl border border-amber-400/35 bg-gradient-to-b from-amber-400/[0.14] to-transparent p-6 sm:p-8">
          <p className="text-[1.08rem] font-black tracking-tight text-amber-300">선별 진행</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[3.2rem] font-black leading-none text-amber-300 sm:text-[4.2rem]">월 5개사</span>
            <span className="text-[1.3rem] font-black text-white sm:text-[1.6rem]">만 진행합니다</span>
          </p>
          <p className="mt-4 max-w-3xl break-keep text-[1.16rem] leading-relaxed text-slate-200 sm:text-[1.26rem]">
            대표 컨설턴트가 사업과 AX 구조를 직접 설계하기 때문에, 같은 기간에 더 많은 기업을 맡지 않습니다.
          </p>
          <p className="mt-3 max-w-3xl break-keep text-[1.16rem] font-bold leading-relaxed text-white sm:text-[1.26rem]">
            자금만 신청하고 끝나는 기업보다, <span className="text-amber-300">자금을 통해 사업을 실제로 바꾸려는 기업</span>을 우선합니다.
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-teal-400/25 bg-teal-400/[0.07] p-4 sm:p-5">
            <p className="text-[1.13rem] font-black text-teal-200">우선 진행기업</p>
            <ul className="mt-2.5 space-y-1.5">
              {AX_SELECTION_PRIORITY.map((t) => (
                <li key={t} className="flex gap-2 break-keep text-[1.07rem] leading-relaxed text-slate-200">
                  <span aria-hidden className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
            <p className="text-[1.13rem] font-black text-slate-300">진행하지 않는 경우</p>
            <ul className="mt-2.5 space-y-1.5">
              {AX_SELECTION_DECLINE.map((t) => (
                <li key={t} className="flex gap-2 break-keep text-[1.07rem] leading-relaxed text-slate-400">
                  <span aria-hidden className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
