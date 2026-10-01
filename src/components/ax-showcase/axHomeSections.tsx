// 섹션 모음 — Hero·월 5개사는 홈에서, 세 가지 가치·5단계 방법론은 정책자금 상세페이지에서 사용한다.
// 한 섹션에서는 하나의 주장만 전달하고, 주장 바로 아래 증명(화면·산출물·근거)을 배치한다.
import AxSampleStrip from './AxSampleStrip'
import { AX_CORE_VALUES, AX_METHOD_STEPS, AX_SELECTION_DECLINE, AX_SELECTION_PRIORITY } from '../../data/axPackages'

const band = 'px-5 py-16 sm:px-6 sm:py-24'
const wrap = 'mx-auto max-w-5xl'
const h2Light = 'break-keep text-[1.6rem] font-black leading-tight text-slate-900 sm:text-[2.795rem]'
// 히어로 문장에서 떨어지면 어색한 말 덩어리 — 한 음절만 다음 줄로 넘어가지 않게 통째로 줄바꿈한다
const NW = 'whitespace-nowrap'

/** SECTION 1 — Hero. 한 문장(제목) · 짧은 한 문단 · 상자 하나(시간·비용 ↓ · 매출 ↑ · 혁신기업). 직접 만든 화면 22개(AxSamplesBand)는 소개 영상 2편 다음에 있다.
 *  키워드 칩과 버튼은 두지 않는다.
 *  대표님 방향(2026-09): 중소기업 대표가 수천만원을 쓰는 이유는 '업무 효율'보다 '성장과 생존'이다.
 *  → 제목은 '정책자금·지원사업·투자에서 경쟁력 있는 회사로', 1문단은 왜(이미 시도하고 실제로 보여 주는 혁신기업을 더 선호한다),
 *    2문단은 AX 가 실제로 하는 일(시간·비용은 줄이고 매출은 올린다). 서비스 선택 02 카드도 같은 말을 쓴다.
 *  승인·선정을 약속하는 표현은 절대 쓰지 않는다('경쟁력 있는 회사로' 까지만). */
// 첫 화면 상자 세 칸 — 글 대신 큰 화살표로 '무엇이 달라지는지' 한눈에(시간·비용 ↓ · 매출 ↑ · 혁신기업)
const ARROW = 'h-[1.925rem] w-[1.925rem] sm:h-[2.2rem] sm:w-[2.2rem]'
const AX_HERO_GAINS = [
  {
    label: '시간·비용',
    note: '낭비는 줄이고',
    icon: (
      <svg viewBox="0 0 24 24" className={ARROW} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v15M6 13l6 6 6-6" />
      </svg>
    ),
  },
  {
    label: '매출',
    note: '더 끌어올리고',
    icon: (
      <svg viewBox="0 0 24 24" className={ARROW} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V5M6 11l6-6 6 6" />
      </svg>
    ),
  },
  {
    label: '혁신기업으로',
    note: '만들어 드려요',
    icon: (
      <svg viewBox="0 0 24 24" className={ARROW} fill="currentColor">
        <path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" />
      </svg>
    ),
  },
] as const

export function AxHeroV2() {
  return (
    <section className="relative overflow-hidden bg-[#050B11]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050B11_0%,#111820_48%,#050B11_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D47A4A]/35" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050B11]" />

      {/* 문장 묶음이 첫 화면을 가득 채운다 — 소개 영상 구간은 화면 경계 아래에서 시작해,
          스크롤을 조금만 내리면 밝은 영상 구간이 눈에 들어온다.
          폰에서는 첫 화면에 그 구간이 보이지 않게 한 화면을 통째로 쓰고,
          PC 는 3.5rem 만 덜어 제목이 경계에 살짝 걸치게 둔다.
          320px 같은 작은 화면·세로가 짧은 폰(높이 760px 이하)은 위 여백부터 줄여 한 화면에 담는다. */}
      {/* 폰에서는 하단 고정 바(약 64px)가 처음부터 떠 있으므로 아래 여백을 그만큼 더 둔다 (pb-24 / 작은 화면 pb-20) */}
      <div className={`relative flex min-h-[calc(100svh-53px)] sm:min-h-[calc(100svh-53px-3.5rem)] w-full flex-col items-start justify-center ${wrap} px-5 pb-24 pt-12 max-[359px]:pb-20 max-[359px]:pt-7 [@media(max-height:700px)]:pb-20 [@media(max-height:700px)]:pt-7 [@media(max-width:639px)_and_(max-height:760px)]:pt-7 sm:px-6 sm:pb-12 sm:pt-14`}>
        {/* 윗배지(경영컨설턴트가 설계하는 50인 미만 중소기업 맞춤 AX)는 뺐다 — 서비스 선택 화면과 헤더에서 이미 본다 */}
        {/* 정체성 한 문장 — 모바일은 PC 대비 체감이 작지 않게 크게 유지한다 */}
        <h1 style={{ animationDelay: '0.16s' }} className="hero-anim max-w-4xl break-keep sm:max-w-5xl text-[clamp(2.255rem,8.36vw,3.52rem)] max-[359px]:text-[2.0rem] font-black leading-[1.3] tracking-normal text-[#FAFAF8] [text-rendering:geometricPrecision] [text-shadow:0_1px_0_rgba(255,255,255,0.08),0_16px_34px_rgba(0,0,0,0.34)] sm:mt-9 sm:text-[clamp(2.75rem,5.28vw,3.96rem)]">
          {/* PC 는 두 줄. 폰은 말 덩어리대로 나뉜다 — 가운뎃점은 앞 낱말에 붙여 두고(줄 맨 앞에 '·' 가 오지 않게),
              점 뒤(<wbr />)에서만 끊는다 */}
          <span className={NW}>정책자금·</span>
          <wbr />
          <span className={NW}>지원사업·</span>
          <wbr />
          <span className={NW}>투자에서</span>
          <br />
          <span className="text-[#D47A4A] [text-shadow:0_1px_0_rgba(255,255,255,0.08),0_14px_30px_rgba(212,122,74,0.2)]">
            <span className={NW}>경쟁력 있는</span> <span className={NW}>회사로</span>
          </span>{' '}
          <span className={NW}>만들어 드려요.</span>
        </h1>
        {/* 글자가 많으면 눈에 안 들어와서(대표님 피드백), 2주 기술사업 빌드 첫 화면처럼 '짧은 한 문단 + 상자 하나' 로 둔다.
            문단: 왜(심사위원·투자자는 이미 시도하고 실제로 보여 주는 혁신기업을 더 선호한다).
            상자: 무엇을 해 주나(AI와 데이터로 일하는 회사로 → 시간·비용 ↓ · 매출 ↑ · 혁신기업으로) — 글 대신 큰 화살표로 한눈에 */}
        <p style={{ animationDelay: '0.34s' }} className="hero-anim mt-7 max-w-3xl break-keep text-[1.22rem] font-medium leading-[1.7] text-[#E7EAEE] [@media(max-width:639px)_and_(max-height:700px)]:mt-5 max-[359px]:mt-5 max-[359px]:text-[1.08rem] sm:mt-8 sm:text-[1.4rem]">
          <span className={NW}>심사위원과 투자자는</span>{' '}
          <span className={NW}><b className="font-bold text-[#E8B89A]">이미 시도하고</b></span>{' '}
          <span className={NW}><b className="font-bold text-[#E8B89A]">실제로 보여 주는</b></span>{' '}
          <span className={NW}><b className="font-bold text-[#FAFAF8]">혁신기업</b>을</span> <span className={NW}>더 선호해요.</span>
        </p>
        <div data-ax-hero-card style={{ animationDelay: '0.46s' }} className="hero-anim mt-7 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 [@media(max-width:639px)_and_(max-height:700px)]:mt-5 [@media(max-width:639px)_and_(max-height:700px)]:py-3.5 max-[359px]:mt-5 sm:mt-8 sm:p-5">
          <p className="break-keep text-[1.1rem] font-medium leading-snug text-slate-300 sm:text-[1.19rem]">
            <span className={NW}>대표님의 회사를</span> <span className={NW}><b className="font-bold text-[#FAFAF8]">AI와 데이터로</b></span>{' '}
            <span className={NW}>일하는 회사로</span>
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {AX_HERO_GAINS.map((g) => (
              <li key={g.label} className="flex flex-col items-center rounded-xl bg-white/[0.05] px-1.5 py-3 text-center ring-1 ring-inset ring-white/10 [@media(max-width:639px)_and_(max-height:700px)]:py-2.5 sm:py-4">
                <span className="whitespace-nowrap text-[clamp(0.95rem,4.3vw,1.12rem)] font-black text-[#FAFAF8] sm:text-[1.19rem]">{g.label}</span>
                <span aria-hidden className="my-1.5 text-[#E8B89A] [@media(max-width:639px)_and_(max-height:700px)]:my-1">{g.icon}</span>
                <span className="whitespace-nowrap text-[clamp(0.84rem,3.75vw,0.97rem)] font-semibold text-slate-400 sm:text-[1.01rem]">{g.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** 직접 만든 화면 22개 — 소개 영상 2편 바로 다음. 히어로와 같은 먹색 바탕에 두 줄로 흐른다(눌러서 실제 화면 열기). */
export function AxSamplesBand() {
  return (
    <section id="samples" className="relative scroll-mt-16 overflow-hidden bg-[#050B11]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D47A4A]/35" />
      <div className={`relative w-full ${wrap} px-5 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16`}>
        <p className="text-[1.02rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.1rem]">AX PREVIEW</p>
        <h2 className="mt-2 break-keep text-[1.75rem] font-black leading-[1.3] text-[#FAFAF8] sm:text-[2.3rem]">
          직접 만든 화면 22개,
          <br /> <span className="text-[#E8B89A]">눌러서 확인해 보세요</span>
        </h2>
        <div className="-mx-5 mt-7 sm:-mx-6 sm:mt-9">
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
        <h2 className={h2Light}>저희가 만들어 드리는 것</h2>
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
          매일 하던 일을<br className="hidden sm:block" /> 심사에서 <span className="text-blue-600">설명할 수 있는 사업</span>으로 바꿔요.
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
            회사마다 막힌 곳이 달라서,<br className="hidden sm:block" />{' '}
            남의 회사 자료를 돌려 쓸 수 없어요.
          </p>
          <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.32rem] font-bold leading-[1.75] text-white sm:text-[1.36rem]">
            대표님 회사에 <span className="text-amber-300">꼭 맞춘 계획서와 화면</span>을 만들려면,<br className="hidden sm:block" />{' '}
            한 달에 5개사가 현실적인 한계예요.
          </p>
          <p className="mx-auto mt-6 max-w-2xl break-keep text-[1.32rem] leading-[1.75] text-slate-200 sm:text-[1.36rem]">
            그래서 아래 기준으로 먼저 받아요.
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
