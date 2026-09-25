// 섹션 모음 — Hero·월 5개사는 홈에서, 세 가지 가치·5단계 방법론은 정책자금 상세페이지에서 사용한다.
// 한 섹션에서는 하나의 주장만 전달하고, 주장 바로 아래 증명(화면·산출물·근거)을 배치한다.
import AxSampleStrip from './AxSampleStrip'
import { AX_CORE_VALUES, AX_METHOD_STEPS, AX_SELECTION_DECLINE, AX_SELECTION_PRIORITY } from '../../data/axPackages'

const band = 'px-5 py-16 sm:px-6 sm:py-24'
const wrap = 'mx-auto max-w-5xl'
const h2Light = 'break-keep text-[1.6rem] font-black leading-tight text-slate-900 sm:text-[2.795rem]'

/** SECTION 1 — Hero. "경영컨설턴트가 설계하는 중소기업 맞춤형 실행 AX"가 5초 안에 읽히게 한다.
 *  배지 · 한 문장 · 두 문단, 그리고 바로 아래 직접 만든 화면 22개까지가 첫인상이다.
 *  키워드 칩과 버튼은 두지 않는다.
 *  정책자금·정부지원사업·투자는 AX 의 목적이 아니라 "그 변화를 더 강하게 설명할 수 있는 자리"로만 말한다.
 *  승인·선정을 약속하는 표현은 절대 쓰지 않는다. */
export function AxHeroV2() {
  return (
    <section className="relative overflow-hidden bg-[#050B11]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050B11_0%,#111820_48%,#050B11_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D47A4A]/35" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050B11]" />

      {/* 문장 묶음이 첫 화면을 가득 채운다 — 샘플은 화면 경계 아래에서 시작해,
          스크롤을 조금만 내리면 "업종별 AX…" 줄부터 눈에 들어온다.
          폰에서는 첫 화면에 그 줄이 보이지 않게 한 화면을 통째로 쓰고,
          PC 는 3.5rem 만 덜어 제목이 경계에 살짝 걸치게 둔다.
          320px 같은 작은 화면에서는 문단이 두 개라 여백부터 줄여 한 화면에 담는다. */}
      {/* 폰에서는 하단 고정 바(약 64px)가 처음부터 떠 있으므로 아래 여백을 그만큼 더 둔다 (pb-24 / 작은 화면 pb-20) */}
      <div className={`relative flex min-h-[calc(100svh-53px)] sm:min-h-[calc(100svh-53px-3.5rem)] w-full flex-col items-start justify-center ${wrap} px-5 pb-24 pt-12 max-[359px]:pb-20 max-[359px]:pt-7 [@media(max-height:700px)]:pb-20 [@media(max-height:700px)]:pt-7 sm:px-6 sm:pb-12 sm:pt-14`}>
        {/* 390px 에서 한 줄에 들어가도록 모바일 글자를 조금 줄인다 (기준 대비 1.1배) */}
        <span className="hero-anim inline-flex items-center gap-2 break-keep rounded-full border border-[#D47A4A]/35 bg-[#343B44]/70 px-3.5 py-2 text-[0.99rem] font-bold leading-snug text-[#E8B89A] backdrop-blur min-[400px]:text-[1.078rem] sm:px-4 sm:text-[1.155rem]">
          경영컨설턴트가 설계하는 50인 미만 중소기업 맞춤 AX
        </span>

        {/* 정체성 한 문장 — 모바일은 PC 대비 체감이 작지 않게 크게 유지한다 */}
        <h1 style={{ animationDelay: '0.16s' }} className="hero-anim mt-8 max-[359px]:mt-6 max-w-4xl break-keep sm:max-w-5xl text-[clamp(2.255rem,8.36vw,3.52rem)] max-[359px]:text-[2.0rem] font-black leading-[1.3] tracking-normal text-[#FAFAF8] [text-rendering:geometricPrecision] [text-shadow:0_1px_0_rgba(255,255,255,0.08),0_16px_34px_rgba(0,0,0,0.34)] sm:mt-9 sm:text-[clamp(2.75rem,5.28vw,3.96rem)]">
          {/* PC 에서도 같은 자리에서 끊어 "않아요."만 남는 줄이 생기지 않게 한다 */}
          AI 도입으로<br /> 끝내지 않아요.<br />
          <span className="text-[#D47A4A] [text-shadow:0_1px_0_rgba(255,255,255,0.08),0_14px_30px_rgba(212,122,74,0.2)]">회사를 한 단계 더</span> 키웁니다.
        </h1>
        {/* 두 문단 — 문단마다 흰 글자(구체적인 대상) 하나와 브랜드색(남는 결과) 하나만 집어,
            읽는 눈이 어디에 멈출지 분명하게 한다. 줄간격은 1.85 로 넉넉히 둔다. */}
        <p style={{ animationDelay: '0.34s' }} className="hero-anim mt-7 max-[359px]:mt-5 max-w-3xl break-keep text-[1.26rem] font-medium leading-[1.85] max-[359px]:text-[1.12rem] max-[359px]:leading-[1.72] text-[#E7EAEE] sm:mt-8 sm:text-[1.44rem]">
          <b className="font-bold text-[#FAFAF8]">엑셀, 카톡, ERP</b>에 흩어진 일을 한 화면으로 모아요.<br className="hidden sm:block" />{' '}
          누가 무엇을 했는지, 성과까지 <b className="font-bold text-[#E8B89A]">데이터로 남습니다</b>.
        </p>
        <p style={{ animationDelay: '0.46s' }} className="hero-anim mt-5 max-[359px]:mt-4 max-w-3xl break-keep text-[1.26rem] font-medium leading-[1.85] max-[359px]:text-[1.12rem] max-[359px]:leading-[1.72] text-[#E7EAEE] sm:mt-6 sm:text-[1.44rem]">
          이 기록은 <b className="font-bold text-[#E8B89A]">정책자금, 정부지원사업, 투자</b>에서<br className="hidden sm:block" />{' '}
          회사를 설명하는 <b className="font-bold text-[#FAFAF8]">성장 증거</b>가 돼요.
        </p>
      </div>

      {/* 첫 화면 경계 바로 아래 — 설명 대신 실제로 만든 화면 22개.
          히어로 안이라 배경 경계가 보이지 않지만, 자리로는 "다음 장"처럼 읽힌다. */}
      <div className={`relative w-full ${wrap} px-5 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6`}>
        <div className="-mx-5 sm:-mx-6">
          <AxSampleStrip />
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
        <h2 className={h2Light}>무엇을 만들어 드리나요?</h2>
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
          평범한 업무를<br className="hidden sm:block" /> 정책자금에서 설명할 수 있는 <span className="text-blue-600">AX 사업</span>으로 바꿔요.
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
            회사마다 업종도, 막힌 곳도, 쌓인 데이터도 달라요.<br className="hidden sm:block" />{' '}
            같은 자료를 돌려 쓸 수 없습니다.
          </p>
          <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.32rem] font-bold leading-[1.75] text-white sm:text-[1.36rem]">
            대표님 회사에 <span className="text-amber-300">꼭 맞춘 사업구조와 화면</span>을 만들려면,<br className="hidden sm:block" />{' '}
            한 달에 5개사가 현실적인 한계예요.
          </p>
          <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.32rem] leading-[1.75] text-slate-200 sm:text-[1.36rem]">
            그래서 자금만 받고 끝낼 회사보다,<br className="hidden sm:block" /> 자금으로 사업을 실제로 바꾸려는 회사를 먼저 받습니다.
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
