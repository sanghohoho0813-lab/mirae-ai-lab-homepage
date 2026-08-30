// 홈 리뉴얼 섹션 모음 — "정책자금 대행"이 아니라 "기업을 AI 기반 운영 구조로 바꾸는 AX 회사"로 보이게 한다.
// 원칙: 한 섹션 한 주장, 설명 대신 실제 화면과 구조가 말하게 한다. 과장·불안 조장 카피 금지.
import { Link } from 'react-router-dom'
import { AX_PLATFORM_SAMPLES, AX_PORTFOLIO_HEAD, PORTFOLIO_SECTION, type AxPlatformSample } from '../../data/portfolioSamples'
import { AX_SIMPLE_EXPLANATION } from '../../data/policyAxEvidence2026'

const DETAIL = '/business-services/funding-consulting'

/* ── SECTION 02a — 대표 포트폴리오: AX + 플랫폼 데모 10종 ─────────────────── */

function SampleLinks({ s, compact = false }: { s: AxPlatformSample; compact?: boolean }) {
  // 모바일(2열 그리드)에서는 항상 작게, sm 이상에서 카드 크기에 맞춘다
  const btn = compact
    ? 'inline-flex min-h-[40px] items-center gap-1 rounded-lg px-2.5 text-[0.98rem] sm:text-[1.05rem] font-black'
    : 'inline-flex min-h-[40px] items-center gap-1 rounded-lg px-2.5 text-[0.98rem] font-black sm:min-h-[44px] sm:gap-1.5 sm:px-3.5 sm:text-[1.14rem]'
  return (
    <span className="flex flex-wrap items-center gap-2">
      <a href={s.axUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-teal-400 text-slate-900 transition-colors hover:bg-teal-300`}>
        AX 화면 <span aria-hidden>↗</span>
      </a>
      {s.customerUrl && (
        <a href={s.customerUrl} target="_blank" rel="noopener noreferrer" className={`${btn} border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10`}>
          {s.customerLabel ?? '고객 화면'} <span aria-hidden>↗</span>
        </a>
      )}
    </span>
  )
}

/** 대표 이미지 + (하이브리드) AX 대시보드 미니 화면 겹치기 */
function SampleShot({ s, sizes, eager = false }: { s: AxPlatformSample; sizes: string; eager?: boolean }) {
  return (
    <span className="relative block aspect-[16/10] overflow-hidden bg-slate-800">
      <img
        src={s.img}
        srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
        sizes={sizes}
        alt={s.alt}
        width={1440}
        height={900}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
      {s.axImg && (
        <span className="absolute bottom-2 right-2 hidden w-[42%] overflow-hidden rounded-lg border border-white/25 shadow-xl shadow-slate-950/60 sm:block">
          <img src={s.axImg} alt="" aria-hidden width={720} height={450} loading="lazy" decoding="async" className="block h-auto w-full" />
          <span className="absolute left-1 top-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-[0.78rem] font-black text-teal-300">Business AX</span>
        </span>
      )}
    </span>
  )
}

export function AxFeaturedPortfolio() {
  const featured = AX_PLATFORM_SAMPLES.slice(0, 4)
  const rest = AX_PLATFORM_SAMPLES.slice(4)
  return (
    <section id="portfolio" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl whitespace-pre-line break-keep text-center text-[1.65rem] font-black leading-[1.4] tracking-[-0.015em] text-teal-300 sm:text-[2.05rem]">
          {PORTFOLIO_SECTION.kicker}
        </h2>
        <p className="mx-auto mt-5 max-w-3xl break-keep text-center text-[1.95rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.5rem]">
          {AX_PORTFOLIO_HEAD.title}
        </p>

        {/* 공통 개념 — 카드마다 배지를 반복하는 대신 여기서 한 번, 크게 (§12·§24) */}
        <p className="mx-auto mt-7 max-w-3xl break-keep text-center text-[1.35rem] font-black leading-[1.6] text-white sm:text-[1.6rem]">
          직원이 사용하는 <span className="text-teal-300">AX</span>와{' '}
          고객·거래처가 사용하는 <span className="text-amber-300">플랫폼</span>을<br className="hidden sm:block" />{' '}
          하나의 데이터 흐름으로 연결합니다.
        </p>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.08rem] leading-[1.7] text-slate-400 sm:text-[1.18rem]">
          Industry AX Reference — 실제 업종의 업무 흐름과 고객 경험을 기준으로 설계한 시연형 Business AX + 플랫폼입니다.{' '}
          카드마다 AX 화면과 고객·거래처 화면을 각각 열어볼 수 있습니다.
        </p>

        {/* 대표 4종 — 모바일은 2열 컴팩트, sm 이상에서 크게 */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          {featured.map((s) => (
            <article key={s.slug} className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-xl shadow-slate-950/40 sm:rounded-3xl">
              <SampleShot s={s} sizes="(min-width:640px) 44vw, 46vw" eager />
              <div className="flex flex-1 flex-col p-3 sm:p-6">
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="break-keep text-[1.08rem] font-black leading-tight text-white sm:text-[1.55rem]">{s.name}</span>
                  <span className="break-keep text-[0.92rem] font-bold text-slate-400 sm:text-[1.15rem]">{s.industry}</span>
                </p>
                <p className="mt-1.5 line-clamp-2 break-keep text-[0.98rem] leading-snug text-slate-300 sm:mt-2 sm:line-clamp-none sm:text-[1.22rem] sm:leading-relaxed">{s.line}</p>
                <div className="mt-auto pt-3 sm:pt-3.5">
                  <SampleLinks s={s} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 나머지 6종 — 모바일 2열 / PC 3열 */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-3">
          {rest.map((s) => (
            <article key={s.slug} className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-slate-900">
              <SampleShot s={s} sizes="(min-width:1024px) 30vw, 46vw" />
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="break-keep text-[1.08rem] font-black leading-tight text-white sm:text-[1.25rem]">{s.name}</span>
                  <span className="break-keep text-[0.92rem] font-bold text-slate-400 sm:text-[1.05rem]">{s.industry}</span>
                </p>
                <p className="mt-1.5 line-clamp-2 break-keep text-[0.98rem] leading-snug text-slate-400 sm:text-[1.1rem]">{s.line}</p>
                <div className="mt-auto pt-2.5">
                  <SampleLinks s={s} compact />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-2xl break-keep text-center text-[1.05rem] leading-relaxed text-slate-500 sm:text-[1.14rem]">
          {AX_PORTFOLIO_HEAD.note}
        </p>
      </div>
    </section>
  )
}

/* ── SECTION 03 — AX란 무엇인가 (짧게) ────────────────────────────────────── */

export function AxWhatIsAx() {
  const x = AX_SIMPLE_EXPLANATION
  return (
    <section id="ax-explained" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(85%_100%_at_20%_0%,rgba(45,212,191,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.16rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">AX란 무엇인가</p>
        <p className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span className="text-[2.6rem] font-black leading-none text-white sm:text-[3.1rem]">AX</span>
          <span className="text-[1.35rem] font-bold text-teal-300 sm:text-[1.45rem]">{x.acronym.en}</span>
          <span className="text-[1.35rem] font-bold text-slate-400 sm:text-[1.45rem]">· {x.acronym.ko}</span>
        </p>
        <p className="mx-auto mt-7 max-w-3xl break-keep text-center text-[1.35rem] font-bold leading-[1.75] text-white sm:text-[1.5rem]">
          {x.definition}
        </p>

        {/* 디지털화와의 차이 한 번에 */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 sm:p-6">
            <p className="text-[1.05rem] font-black text-slate-400 sm:text-[1.15rem]">디지털화</p>
            <p className="mt-1.5 break-keep text-[1.22rem] font-bold leading-snug text-slate-300 sm:text-[1.3rem]">종이와 수기를 화면으로 옮기는 것</p>
          </div>
          <div className="rounded-2xl border-2 border-teal-400/60 bg-teal-400/[0.08] p-5 sm:p-6">
            <p className="text-[1.05rem] font-black text-teal-300 sm:text-[1.15rem]">AX</p>
            <p className="mt-1.5 break-keep text-[1.22rem] font-bold leading-snug text-white sm:text-[1.3rem]">
              데이터가 연결되고, AI가 분석·추천·자동화까지 하는 것
            </p>
          </div>
        </div>

        {/* 남은 오해 하나 정리 */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-amber-400/25 bg-amber-400/[0.08] p-6 text-center sm:p-8">
          <p className="break-keep text-[1.4rem] font-black leading-[1.55] text-amber-100 sm:text-[1.55rem]">
            업종을 바꾸는 것이 아닙니다.<br />
            <span className="text-amber-300">지금 하는 업무방식을 AX로 바꾸면 됩니다.</span>
          </p>
          <p className="mx-auto mt-4 max-w-2xl break-keep text-[1.18rem] leading-[1.7] text-slate-200 sm:text-[1.24rem]">
            AI를 판매하는 기업이 아니어도, AI와 데이터를 실제 업무에 활용하는 기업이 될 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION 04 — 미래AI랩의 구조: 5 Layer ────────────────────────────────── */

const STACK = [
  {
    en: 'CUSTOMER LAYER',
    ko: '고객 접점',
    tone: 'border-sky-400/30 bg-sky-400/[0.06]',
    label: 'text-sky-300',
    items: ['예약·주문', '견적 요청', '회원·멤버십', '리뷰', '거래처 화면'],
  },
  {
    en: 'BUSINESS LAYER',
    ko: '내부 운영',
    tone: 'border-blue-400/30 bg-blue-400/[0.06]',
    label: 'text-blue-300',
    items: ['매출·재고', '생산·일정', '고객관리', '직원·문서'],
  },
  {
    en: 'AI LAYER',
    ko: 'AI 기능',
    tone: 'border-teal-400/40 bg-teal-400/[0.08]',
    label: 'text-teal-300',
    items: ['분석', '추천', '예측', '자동화', '브리핑'],
  },
  {
    en: 'DATA LAYER',
    ko: '데이터',
    tone: 'border-slate-400/30 bg-white/[0.05]',
    label: 'text-slate-300',
    items: ['고객 데이터', '운영 데이터', '매출 데이터', '현장 데이터'],
  },
  {
    en: 'GROWTH LAYER',
    ko: '성장 연결',
    tone: 'border-amber-400/30 bg-amber-400/[0.06]',
    label: 'text-amber-300',
    items: ['정책자금', '정부지원', '벤처·특허', '사업 확장'],
  },
] as const

export function AxStackSection() {
  return (
    <section id="ax-stack" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.16rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">미래AI랩의 구조</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          화면 하나가 아니라,<br className="sm:hidden" /> 이 다섯 층을 한 번에 설계합니다.
        </h2>
        <div className="mx-auto mt-10 max-w-2xl sm:mt-12">
          {STACK.map((l, i) => (
            <div key={l.en}>
              {i > 0 && (
                <div aria-hidden className="flex justify-center py-1.5 text-[1.3rem] font-black leading-none text-slate-600">↓</div>
              )}
              <div className={`rounded-2xl border p-4 sm:p-5 ${l.tone}`}>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className={`text-[0.98rem] font-black tracking-wide ${l.label}`}>{l.en}</span>
                  <span className="break-keep text-[1.3rem] font-black text-white sm:text-[1.4rem]">{l.ko}</span>
                </p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {l.items.map((t) => (
                    <span key={t} className="rounded-lg bg-slate-950/50 px-2.5 py-1 text-[1.02rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/10 sm:text-[1.08rem]">
                      {t}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-9 max-w-2xl break-keep text-center text-[1.24rem] font-bold leading-[1.75] text-slate-200 sm:text-[1.34rem]">
          프로그램 하나를 만드는 것과 이 구조 전체를 설계하는 것은 다른 일입니다.<br className="hidden sm:block" />{' '}
          미래AI랩은 <span className="text-teal-300">구조 전체</span>를 설계합니다.
        </p>
      </div>
    </section>
  )
}

/* ── SECTION 05 — 무엇이 다른가 ──────────────────────────────────────────── */

export function AxDifferenceSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          컨설팅도, 외주 개발도 아닙니다.
        </h2>
        <div className="mx-auto mt-9 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-[1.08rem] font-black text-slate-500 sm:text-[1.15rem]">컨설팅 회사</p>
            <p className="mt-1.5 break-keep text-[1.24rem] font-black leading-snug text-slate-700 sm:text-[1.3rem]">무엇을 해야 하는지 제안합니다</p>
            <p className="mt-2.5 break-keep text-[1.08rem] leading-relaxed text-slate-500 sm:text-[1.14rem]">진단 · 보고서 · 자금 조언</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-[1.08rem] font-black text-slate-500 sm:text-[1.15rem]">개발 회사</p>
            <p className="mt-1.5 break-keep text-[1.24rem] font-black leading-snug text-slate-700 sm:text-[1.3rem]">요청받은 기능을 구현합니다</p>
            <p className="mt-2.5 break-keep text-[1.08rem] leading-relaxed text-slate-500 sm:text-[1.14rem]">요구사항 · 개발 · 납품</p>
          </div>
          <div className="rounded-2xl border-2 border-teal-500/60 bg-teal-50/60 p-5 shadow-lg shadow-teal-500/10 sm:p-6">
            <p className="text-[1.08rem] font-black text-teal-700 sm:text-[1.15rem]">미래AI랩</p>
            <p className="mt-1.5 break-keep text-[1.24rem] font-black leading-snug text-slate-900 sm:text-[1.3rem]">진단부터 구축, 성장까지 하나의 흐름으로 잇습니다</p>
            <p className="mt-2.5 break-keep text-[1.08rem] font-semibold leading-relaxed text-slate-600 sm:text-[1.14rem]">
              사업 진단 → AX 설계 → 직접 구축 → AI 연결 → 성장 연계
            </p>
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-2xl break-keep text-center text-[1.08rem] leading-relaxed text-slate-500 sm:text-[1.16rem]">
          각자의 역할이 있습니다. 미래AI랩은 따로 움직이던 그 단계들을 한 회사 안에서 잇습니다.
        </p>
      </div>
    </section>
  )
}

/* ── SECTION 06 — AI가 실제로 하는 일 ────────────────────────────────────── */

const AI_AT_WORK = [
  ['AI 매출 분석', '메뉴·상품·시간대별 수익 구조'],
  ['재구매 추천', '다시 올 때가 된 고객 알림'],
  ['재고·발주 추천', '떨어지기 전에 먼저 제안'],
  ['수요 예측', '요일·계절·이벤트 반영'],
  ['상담 우선순위', '먼저 응대할 문의 정렬'],
  ['AI 경영 브리핑', '오늘 확인할 것 요약'],
  ['문서 자동화', '견적서·보고서 초안 생성'],
  ['AI 고객응대', '반복 문의 자동 안내'],
  ['정책자금 적합도', '우리 회사에 맞는 자금 탐색'],
  ['AI Agent', '업무 흐름을 대신 수행'],
] as const

const AI_FLOW = ['재고 + 판매이력 + 리드타임', 'AI · Rule 분석', '발주 Risk 발견', '발주 제안', '실행 · 결과 기록'] as const

export function AxAiAtWorkSection() {
  return (
    <section id="ai-at-work" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          AI는 장식이 아니라,<br className="sm:hidden" /> <span className="text-teal-600">실제 업무에서</span> 일합니다.
        </h2>
        <ul className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-3 lg:grid-cols-5">
          {AI_AT_WORK.map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
              <p className="break-keep text-[1.1rem] font-black leading-snug text-slate-900 sm:text-[1.14rem]">{t}</p>
              <p className="mt-1 break-keep text-[0.98rem] leading-snug text-slate-500 sm:text-[1.02rem]">{d}</p>
            </li>
          ))}
        </ul>
        {/* 하나의 흐름으로 — 데이터가 다음 행동으로 이어지는 실제 예 */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-center text-[0.95rem] font-black tracking-wide text-teal-600">예 — 발주가 늦기 전에</p>
          <ol className="mt-3 flex flex-wrap items-center justify-center gap-y-2">
            {AI_FLOW.map((t, i) => (
              <li key={t} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1.5 text-[1.0rem] font-black text-slate-300">→</span>}
                <span className={`break-keep rounded-lg px-2.5 py-1.5 text-[0.98rem] font-bold sm:text-[1.05rem] ${i === AI_FLOW.length - 1 ? 'bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200' : 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200'}`}>
                  {t}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mx-auto mt-6 max-w-2xl break-keep text-center text-[1.08rem] leading-relaxed text-slate-500 sm:text-[1.16rem]">
          AI 모델 자체를 만드는 회사가 아닙니다. 기업의 데이터·업무 흐름과 AI를 결합해 실제 다음 행동을 만드는 데 집중합니다.
        </p>
      </div>
    </section>
  )
}

/* ── SECTION 07 — 구축 프로세스 7단계 ────────────────────────────────────── */

const PROCESS = ['기업 진단', '병목·손실·매출기회 도출', 'AX 설계', 'MVP·프로토타입', '실제 구축', '실사용 데이터 축적', 'AI 고도화·성장 연계'] as const

export function AxBuildProcessSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          진단에서 고도화까지, 한 흐름으로 진행합니다.
        </h2>
        <ol className="mx-auto mt-9 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-2.5 sm:mt-12">
          {PROCESS.map((t, i) => (
            <li key={t} className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.92rem] font-black text-teal-300">{i + 1}</span>
                <span className="break-keep text-[1.08rem] font-bold text-slate-800 sm:text-[1.14rem]">{t}</span>
              </span>
              {i < PROCESS.length - 1 && <span aria-hidden className="text-[1.1rem] font-black text-slate-300">→</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── SECTION 08 — Growth Layer: 정책자금·정부지원은 성장을 잇는 층 ─────────── */

const GROWTH_ITEMS = ['정책자금', '정부지원사업', '벤처확인', '특허·IP', '기업인증', '기업부설연구소'] as const

export function AxGrowthLayerSection({ onConsult }: { onConsult?: () => void }) {
  return (
    <section id="growth" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.16rem] font-black tracking-tight text-amber-300 sm:text-[1.3rem]">GROWTH LAYER</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          기술만 만들고 끝내지 않습니다.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl break-keep text-center text-[1.26rem] leading-[1.8] text-slate-300 sm:text-[1.36rem]">
          AX로 만든 시스템과 데이터는 정책자금·정부지원사업 심사에서 사업을 실물로 증명하는 근거가 됩니다.{' '}
          필요한 경우 자금·지원사업·인증·지식재산까지 성장 순서에 맞춰 연결합니다.
        </p>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {GROWTH_ITEMS.map((t) => (
            <span key={t} className="rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2 text-[1.1rem] font-bold text-slate-200 sm:text-[1.18rem]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={DETAIL}
            className="flex min-h-[56px] w-full max-w-sm items-center justify-center gap-2 break-keep rounded-xl bg-teal-400 px-6 text-center text-[1.24rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto sm:text-[1.28rem]"
          >
            정책자금 × AX 프로그램 보기 <span aria-hidden>→</span>
          </Link>
          {onConsult && (
            <button
              type="button"
              onClick={onConsult}
              className="flex min-h-[56px] w-full max-w-sm items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[1.24rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto sm:text-[1.28rem]"
            >
              상담 신청
            </button>
          )}
        </div>
        <p className="mx-auto mt-6 max-w-2xl break-keep text-center text-[1.02rem] leading-relaxed text-slate-500 sm:text-[1.1rem]">
          자금 한도와 선정 여부는 각 기관의 심사로 결정됩니다.{' '}
          <Link to={`${DETAIL}#policy-2026`} className="font-bold text-slate-400 underline underline-offset-2 hover:text-slate-300">
            2026 공식 정책근거 보기
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ── SECTION 09 — 신뢰: 대표 컨설턴트 한 줄 ──────────────────────────────── */

const TRUST_FACTS = ['세무·노무·법무·자금 합산 9년 현장 경험', '누적 자금조달 지원 100억원+', 'ISO 9001·14001·45001 심사원', '월 5개사 선별 진행'] as const

export function AxTrustStrip() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
          <img
            src="/assets/profile/ceo-avatar.webp"
            alt="미래 AI 랩 대표 컨설턴트 김팀장 프로필 사진"
            loading="lazy"
            decoding="async"
            width={200}
            height={200}
            className="h-16 w-16 rounded-full object-cover shadow ring-2 ring-amber-400/40 sm:h-20 sm:w-20"
          />
          <div>
            <p className="text-[1.05rem] font-black tracking-tight text-blue-600 sm:text-[1.1rem]">정책자금·AX 성장설계 총괄 · 김팀장</p>
            <p className="mt-2 break-keep text-[1.4rem] font-black leading-snug text-slate-900 sm:text-[1.55rem]">
              대표 컨설턴트가 직접 듣고, 내부 개발자와 함께 직접 설계합니다.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {TRUST_FACTS.map((t) => (
              <li key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[1.0rem] font-semibold text-slate-600 sm:text-[1.06rem]">
                {t}
              </li>
            ))}
          </ul>
          <Link to={`${DETAIL}#leader`} className="text-[1.1rem] font-bold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-800 sm:text-[1.16rem]">
            수행체계 자세히 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION — REAL · FIELD PROJECTS: 실제 기업 프로젝트 증명 ─────────────── */
// ⚠️ 내부 개발보고서·수치·전문용어(QA 건수, RLS 등)·고객사 내부정보는 공개하지 않는다.
//    비주얼은 스크린샷이 아니라 데이터 흐름 구조도로 그린다(허위 화면 캡처 금지).
//    §9 실제 기업 MVP 4건은 업체명 비공개 — 업종·단계·한 줄 요약만.

function FlowChips({ items, tone }: { items: string[]; tone: 'blue' | 'teal' }) {
  return (
    <span className="flex flex-wrap items-center gap-y-1">
      {items.map((t, i) => (
        <span key={t} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-1 text-[0.85rem] font-black text-slate-300">→</span>}
          <span className={`rounded-md px-1.5 py-0.5 text-[0.88rem] font-bold sm:text-[0.95rem] ${tone === 'blue' ? 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200' : 'bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200'}`}>
            {t}
          </span>
        </span>
      ))}
    </span>
  )
}

const REAL_FLAGSHIPS = [
  {
    name: '비원미래',
    kind: '의료폐기물 수거·운반',
    line: '현장 운영과 병원 고객 플랫폼을 하나의 데이터 흐름으로 연결한 B2B Business AX',
    stage: 'Business AX + Customer Platform 고도화 단계',
    funding: true,
    flows: [
      { label: 'BUSINESS AX', tone: 'blue' as const, items: ['거래처', '일정·배차', '수거', '자재·재고', '정산·청구', '경영지표'] },
      { label: '병원 고객 플랫폼', tone: 'teal' as const, items: ['수거요청', '긴급수거', '자재요청', '리포트', '정산·문의'] },
    ],
  },
  {
    name: '정통대왕쑥뜸원',
    kind: '웰니스 서비스',
    line: '고객기록 → 내부 판단 → 직원 실행 → 고객 확인이 다시 연결되는 Wellness Business AX',
    stage: 'Pilot 준비 단계 · V1',
    funding: true,
    flows: [
      { label: 'BUSINESS AX', tone: 'blue' as const, items: ['방문·상담 기록', '우선관리 고객', '재방문 판단', '실행업무'] },
      { label: 'MY WELLNESS (고객)', tone: 'teal' as const, items: ['이용기록', '이용권', '피드백'] },
    ],
  },
] as const

const REAL_MVPS = [
  { kind: '피혁 제조·도소매', line: '제품·재고·견적·재구매·거래처 영업기회를 연결한 B2B AX', stage: 'MVP 고도화 진행 중' },
  { kind: '산업계측·장비유통', line: '재고·수요·견적·재구매·영업 Action을 연결한 Business AX', stage: 'Business AX MVP 진행 중' },
  { kind: '전기·정보통신 · 프로젝트관리', line: '현장·프로젝트·견적·원가·수금과 고객 서비스 흐름을 연결한 Hybrid AX', stage: 'Hybrid AX MVP 진행 중' },
  { kind: '산업용 설비·펌프', line: '설비·AS·설치·재고·발주·정산을 연결한 운영 AX', stage: 'Business AX MVP 진행 중' },
] as const

const CAPABILITY_LEVELS = [
  { no: 'LEVEL 01', title: 'IDEA → WORKING MVP', desc: '아이디어를 클릭 가능한 실제 서비스로' },
  { no: 'LEVEL 02', title: 'BUSINESS AX', desc: '데이터를 연결하고 판단·다음 Action까지' },
  { no: 'LEVEL 03', title: 'AX + CUSTOMER PLATFORM', desc: '직원용 AX와 고객·거래처용 화면을 연결' },
  { no: 'LEVEL 04', title: 'PILOT-READY SYSTEM', desc: '로그인·권한·반응형·반복 검증까지 고도화' },
] as const

export function AxRealProjectsSection() {
  return (
    <section id="real-projects" className="scroll-mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.1rem] font-black tracking-tight text-blue-600 sm:text-[1.2rem]">REAL · FIELD PROJECTS</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          데모만 만드는 회사가 아닙니다.<br className="sm:hidden" /> 실제 기업 프로젝트를 고도화하고 있습니다.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.15rem] leading-[1.7] text-slate-600 sm:text-[1.25rem]">
          실제 기업을 대상으로 설계·개발이 진행 중인 프로젝트입니다. 고객사 보호를 위해 일부는 업종만 공개합니다.
        </p>

        {/* 대표 프로젝트 2건 — 화면 대신 데이터 흐름 구조를 보여준다 */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:mt-12 lg:grid-cols-2">
          {REAL_FLAGSHIPS.map((f) => (
            <article key={f.name} className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <h3 className="break-keep text-[1.35rem] font-black leading-tight text-slate-900 sm:text-[1.5rem]">{f.name}</h3>
                <span className="break-keep text-[1.02rem] font-bold text-slate-500 sm:text-[1.1rem]">{f.kind}</span>
              </div>
              <p className="mt-2.5 break-keep text-[1.12rem] leading-relaxed text-slate-700 sm:text-[1.2rem]">{f.line}</p>
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                {f.flows.map((fl) => (
                  <div key={fl.label}>
                    <p className={`text-[0.9rem] font-black tracking-wide ${fl.tone === 'blue' ? 'text-blue-700' : 'text-teal-700'}`}>{fl.label}</p>
                    <div className="mt-1.5"><FlowChips items={[...fl.items]} tone={fl.tone} /></div>
                  </div>
                ))}
                <p className="flex items-center gap-1.5 text-[0.92rem] font-bold text-slate-500">
                  <span aria-hidden className="text-slate-400">⇅</span> 두 화면이 같은 데이터로 연결됩니다
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[0.95rem] font-black text-teal-300 sm:text-[1.0rem]">{f.stage}</span>
                {f.funding && (
                  <span className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[0.95rem] font-black text-amber-800 sm:text-[1.0rem]">
                    정책자금 조달 신청 진행 중
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* 업체명 비공개 실기업 MVP 4건 */}
        <div className="mx-auto mt-5 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REAL_MVPS.map((m) => (
            <article key={m.kind} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="break-keep text-[1.08rem] font-black leading-snug text-slate-900 sm:text-[1.14rem]">{m.kind}</p>
              <p className="mt-1.5 break-keep text-[0.98rem] leading-snug text-slate-600 sm:text-[1.02rem]">{m.line}</p>
              <p className="mt-2.5 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[0.9rem] font-black text-blue-700">{m.stage}</p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[0.98rem] leading-relaxed text-slate-400 sm:text-[1.05rem]">
          고객사 보호를 위해 업체명·내부 자료는 공개하지 않습니다.
        </p>

        {/* Capability Map — 어느 깊이까지 발전시킬 수 있는가 */}
        <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
          <p className="break-keep text-center text-[1.3rem] font-black leading-snug text-slate-900 sm:text-[1.5rem]">
            프로젝트는 필요한 깊이까지 단계적으로 발전합니다.
          </p>
          <ol className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITY_LEVELS.map((l) => (
              <li key={l.no} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[0.88rem] font-black tracking-wide text-blue-600">{l.no}</p>
                <p className="mt-1 break-keep text-[1.05rem] font-black leading-snug text-slate-900 sm:text-[1.1rem]">{l.title}</p>
                <p className="mt-1.5 break-keep text-[0.96rem] leading-snug text-slate-500 sm:text-[1.0rem]">{l.desc}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[0.98rem] leading-relaxed text-slate-400 sm:text-[1.05rem]">
            모든 프로젝트가 같은 단계는 아닙니다 — 지금 단계에 맞는 깊이부터 시작합니다.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION — Conversion Bridge: 우리 회사라면? ──────────────────────────── */

export function AxConversionBridge() {
  return (
    <section className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-6 sm:py-16">
        <h2 className="break-keep text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.1rem]">
          우리 회사라면,<br className="sm:hidden" /> 어떤 AX가 만들어질까요?
        </h2>
        <p className="mx-auto mt-4 max-w-xl break-keep text-[1.18rem] leading-[1.7] text-slate-300 sm:text-[1.26rem]">
          업종과 현재 업무방식만 알려주시면, 내부 AX와 고객 플랫폼 적용 가능성을 먼저 진단합니다.
        </p>
        <div className="mt-7 flex justify-center">
          <Link
            to="/business-diagnosis"
            className="shine-cta flex min-h-[58px] w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 text-[1.24rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto sm:text-[1.2rem]"
          >
            우리 회사 AX 가능성 보기
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 상세페이지 — 개발역량을 쉬운 말로: 화면만 만드는 것이 아닙니다 ─────────── */

const HOW_WE_BUILD = [
  { no: '01', title: '업무가 이어지게 만듭니다', desc: '견적 → 주문 → 현장 → 재고 → 정산처럼 회사에서 실제로 이어지는 업무 흐름을 시스템으로 연결합니다.' },
  { no: '02', title: '고객 화면과 직원 화면을 연결합니다', desc: '고객이 예약·주문·요청하면 내부 AX에 실제 업무가 생기고, 직원이 처리한 결과가 다시 고객 화면에 반영됩니다.' },
  { no: '03', title: '숫자를 보여주는 데서 끝내지 않습니다', desc: '무엇을 확인해야 하는지, 누구에게 연락해야 하는지, 어떤 행동을 해야 하는지까지 연결하는 것이 목표입니다.' },
  { no: '04', title: '실제 운영에서 생기는 실수를 생각합니다', desc: '중복 저장, 잘못된 입력, 권한, 재고·정산 상태, 오류 복구처럼 실제 사용 중 생길 수 있는 문제까지 고려합니다.' },
  { no: '05', title: '화면 하나를 고친 뒤 전체를 다시 확인합니다', desc: 'PC·태블릿·모바일, 권한별 화면, 빈 데이터, 잘못된 입력까지 실제 사용 상황을 반복해서 검증합니다.' },
] as const

export function AxHowWeBuildSection() {
  return (
    <section id="how-we-build" className="scroll-mt-16 border-t border-slate-200 bg-white px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-[820px]">
        <p className="text-center text-[1.1rem] font-black tracking-tight text-teal-600 sm:text-[1.3rem]">개발 방식</p>
        <h2 className="mt-3 break-keep text-center text-[1.6rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[2.2rem]">
          화면만 만드는 것이 아닙니다.
        </h2>
        <ol className="mt-8 space-y-3">
          {HOW_WE_BUILD.map((h) => (
            <li key={h.no} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span aria-hidden className="shrink-0 text-[1.2rem] font-black tabular-nums text-teal-600 sm:text-[1.35rem]">{h.no}</span>
              <span className="min-w-0">
                <span className="block break-keep text-[1.28rem] font-black leading-snug text-slate-900 sm:text-[1.5rem]">{h.title}</span>
                <span className="mt-1.5 block break-keep text-[1.13rem] leading-relaxed text-slate-600 sm:text-[1.35rem]">{h.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
