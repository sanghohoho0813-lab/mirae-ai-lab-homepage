// 섹션 모음 — Hero·월 5개사는 홈에서, 세 가지 가치·5단계 방법론은 정책자금 상세페이지에서 사용한다.
// 한 섹션에서는 하나의 주장만 전달하고, 주장 바로 아래 증명(화면·산출물·근거)을 배치한다.
import { Link } from 'react-router-dom'
import { AX_CORE_VALUES, AX_METHOD_STEPS, AX_SELECTION_DECLINE, AX_SELECTION_PRIORITY } from '../../data/axPackages'

const band = 'px-5 py-16 sm:px-6 sm:py-24'
const wrap = 'mx-auto max-w-5xl'
const h2Light = 'break-keep text-[1.6rem] font-black leading-tight text-slate-900 sm:text-[2.795rem]'

/** SECTION 1 — Hero. "경영컨설턴트가 설계하는 중소기업 맞춤형 실행 AX"가 5초 안에 읽히게 한다.
 *  시각 구조(배경·버튼 배치·모션)는 유지하고 문구만 브랜드 정의에 맞춘다. 정책자금·지원금·투자 표현은 쓰지 않는다. */
const HERO_KEYWORDS = ['운영효율', '매출성장', '기업자산화'] as const

export function AxHeroV2() {
  return (
    <section className="relative flex min-h-[calc(100svh-53px)] items-center overflow-hidden bg-[#050B11]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050B11_0%,#111820_48%,#050B11_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D47A4A]/35" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050B11]" />

      <div className={`relative w-full ${wrap} px-5 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20`}>
        {/* 390px 에서 한 줄에 들어가도록 모바일 글자를 조금 줄인다 */}
        <span className="inline-flex items-center gap-2 break-keep rounded-full border border-[#D47A4A]/35 bg-[#343B44]/70 px-3.5 py-2 text-[0.9rem] font-bold leading-snug text-[#E8B89A] backdrop-blur min-[400px]:text-[0.98rem] sm:px-4 sm:text-[1.05rem]">
          경영컨설턴트가 설계하는 중소기업 맞춤형 실행 AX
        </span>

        {/* 정체성 한 문장 — 모바일은 PC 대비 체감이 작지 않게 크게 유지한다 */}
        <h1 className="mt-10 max-w-4xl break-keep text-[clamp(2.05rem,7.6vw,3.2rem)] font-black leading-[1.3] tracking-normal text-[#FAFAF8] [text-rendering:geometricPrecision] [text-shadow:0_1px_0_rgba(255,255,255,0.08),0_16px_34px_rgba(0,0,0,0.34)] sm:mt-12 sm:text-[clamp(2.5rem,4.8vw,3.6rem)]">
          대표가 계속 확인해야<br className="sm:hidden" /> 돌아가는 회사를,<br />
          <span className="text-[#D47A4A] [text-shadow:0_1px_0_rgba(255,255,255,0.08),0_14px_30px_rgba(212,122,74,0.2)]">AI와 데이터가 먼저 움직이는 회사</span>로.
        </h1>
        <p className="mt-7 max-w-2xl break-keep text-[1.2rem] font-medium leading-[1.75] text-[#E7EAEE] sm:mt-8 sm:text-[1.36rem]">
          미래AI랩은 회사의 사업과 실제 업무를 먼저 분석합니다.<br className="hidden sm:block" />{' '}
          엑셀·카톡·ERP 사이에 남아 있는 회사 고유의 업무를 연결하고,<br className="hidden sm:block" />{' '}
          AI가 위험·우선순위·다음 행동까지 판단하는 <b className="text-[#FAFAF8]">전용 AX</b>를 설계·구축합니다.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="AX 목표">
          {HERO_KEYWORDS.map((k) => (
            <li key={k} className="rounded-lg border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[1.0rem] font-bold text-slate-200 sm:text-[1.05rem]">
              {k}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row">
          <Link
            to="/business-diagnosis"
            className="shine-cta flex min-h-[58px] w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#D47A4A] px-7 text-[1.24rem] font-black text-[#171B20] shadow-lg shadow-[#D47A4A]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#E8B89A] sm:w-auto sm:text-[1.2rem]"
          >
            우리 회사 AX 가능성 진단
          </Link>
          <a
            href="#portfolio"
            className="flex min-h-[58px] w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-[#D47A4A]/35 bg-[#343B44]/50 px-7 text-[1.24rem] font-bold text-white transition-colors hover:bg-[#343B44] sm:w-auto sm:text-[1.2rem]"
          >
            실제 AX 구축 화면 보기 <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/** 정책자금 상세페이지용 — 미래AI랩이 만드는 세 가지 가치 */
export function AxCoreValuesSection() {
  return (
    <section className={`${band} border-t border-slate-200 bg-white`}>
      <div className={wrap}>
        <h2 className={h2Light}>미래AI랩이 만드는 세 가지</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {AX_CORE_VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span aria-hidden className="text-[2.02rem] sm:text-[2.392rem] leading-none">{v.icon}</span>
              <h3 className="mt-4 break-keep text-[1.39rem] font-black leading-snug text-slate-900 sm:text-[1.794rem]">{v.title}</h3>
              <p className="mt-2.5 break-keep text-[1.24rem] sm:text-[1.469rem] leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** 정책자금 상세페이지용 — 고유 방법론 5단계 */
export function AxMethodSection() {
  return (
    <section id="ax-method" className={`${band} scroll-mt-16 border-t border-slate-200 bg-slate-50`}>
      <div className={wrap}>
        <h2 className={h2Light}>
          평범한 업무를<br className="hidden sm:block" /> 정책자금에서 설명할 수 있는 <span className="text-blue-600">AX 사업</span>으로 바꿉니다.
        </h2>
        <ol className="mt-8 space-y-3">
          {AX_METHOD_STEPS.map((s) => (
            <li key={s.no} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-900 text-[1.39rem] sm:text-[1.638rem]" aria-hidden>{s.icon}</span>
              <div className="min-w-0">
                <p className="text-[1.1rem] sm:text-[1.3rem] font-black tracking-tight text-blue-600">{s.no}단계</p>
                <h3 className="mt-1 break-keep text-[1.36rem] font-black leading-snug text-slate-900 sm:text-[1.768rem]">{s.title}</h3>
                <p className="mt-2 break-keep text-[1.24rem] sm:text-[1.469rem] leading-relaxed text-slate-600">{s.desc}</p>
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
        <div className="rounded-3xl border border-amber-400/35 bg-gradient-to-b from-amber-400/[0.14] to-transparent p-8 text-center sm:p-14">
          <p className="text-[1.26rem] sm:text-[1.15rem] font-black tracking-tight text-amber-300">선별 진행</p>
          <p className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2">
            <span className="text-[3.96rem] font-black leading-none text-amber-300 sm:text-[5rem]">월 5개사</span>
            <span className="text-[1.65rem] font-black text-white sm:text-[1.9rem]">만 진행합니다</span>
          </p>
          <p className="mx-auto mt-8 max-w-2xl break-keep text-[1.32rem] leading-[1.75] text-slate-200 sm:text-[1.36rem]">
            업종이 다르고, 지금 막힌 지점이 다르고, 쌓여 있는 데이터도 다릅니다.<br className="hidden sm:block" />{' '}
            같은 자료를 돌려 쓰는 방식으로는 만들 수 없습니다.
          </p>
          <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.32rem] font-bold leading-[1.75] text-white sm:text-[1.36rem]">
            대표님 회사에 <span className="text-amber-300">완전히 맞춘 사업구조와 화면</span>을 만들어야 하기 때문에,<br className="hidden sm:block" />{' '}
            결과물의 수준을 지키려면 한 달에 5개사가 현실적인 한계입니다.
          </p>
          <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.32rem] leading-[1.75] text-slate-200 sm:text-[1.36rem]">
            그래서 자금만 신청하고 끝나는 기업보다,<br className="hidden sm:block" /> 자금을 통해 사업을 실제로 바꾸려는 기업을 우선합니다.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {/* 각 항목은 반드시 한 줄 — 모바일 폭에 맞춰 좌측 표시와 글자크기를 조절한다 */}
          <div className="rounded-2xl border border-teal-400/25 bg-teal-400/[0.07] p-4 sm:p-7">
            <p className="text-center text-[1.43rem] sm:text-[1.3rem] font-black text-teal-200">우선 진행기업</p>
            <ul className="mx-auto mt-5 w-fit space-y-2.5">
              {AX_SELECTION_PRIORITY.map((t, i) => (
                <li key={t} className="flex items-center gap-2 whitespace-nowrap text-[min(1.02rem,4.05vw)] leading-snug text-slate-200 sm:gap-2.5 sm:text-[1.12rem]">
                  <span aria-hidden className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-400 text-[0.9rem] font-black text-slate-900 sm:h-6 sm:w-6 sm:text-[0.95rem]">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-7">
            <p className="text-center text-[1.43rem] sm:text-[1.3rem] font-black text-slate-300">진행하지 않는 경우</p>
            <ul className="mx-auto mt-5 w-fit space-y-2.5">
              {AX_SELECTION_DECLINE.map((t) => (
                <li key={t} className="flex items-center gap-2 whitespace-nowrap text-[min(1.02rem,4.05vw)] leading-snug text-slate-400 sm:gap-2.5 sm:text-[1.12rem]">
                  <span aria-hidden className="shrink-0 text-slate-600">✕</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
