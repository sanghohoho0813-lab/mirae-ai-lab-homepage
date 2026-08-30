// 홈 리뉴얼 섹션 모음 — "정책자금 대행"이 아니라 "기업을 AI 기반 운영 구조로 바꾸는 AX 회사"로 보이게 한다.
// 원칙: 한 섹션 한 주장, 설명 대신 실제 화면과 구조가 말하게 한다. 과장·불안 조장 카피 금지.
import { AX_PLATFORM_SAMPLES, AX_PORTFOLIO_HEAD, PORTFOLIO_SECTION, type AxPlatformSample } from '../../data/portfolioSamples'


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

        {/* 공통 개념 — 카드마다 배지를 반복하는 대신 여기서 한 번, 크게 */}
        <p className="mx-auto mt-6 max-w-3xl break-keep text-center text-[1.35rem] font-black leading-[1.6] text-white sm:text-[1.6rem]">
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
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[0.95rem] font-black text-teal-300 sm:text-[1.0rem]">{f.stage}</span>
                {f.funding && (
                  <span className="inline-flex items-center gap-1.5 text-[0.92rem] font-bold text-slate-500 sm:text-[0.98rem]">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 정책자금 조달 신청 진행 중
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
