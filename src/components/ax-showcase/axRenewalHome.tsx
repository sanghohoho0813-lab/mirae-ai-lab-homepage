// 홈 리뉴얼 섹션 모음 — "정책자금 대행"이 아니라 "기업을 AI 기반 운영 구조로 바꾸는 AX 회사"로 보이게 한다.
// 원칙: 한 섹션 한 주장, 설명 대신 실제 화면과 구조가 말하게 한다. 과장·불안 조장 카피 금지.
import { AX_PLATFORM_SAMPLES, AX_PORTFOLIO_HEAD, type AxPlatformSample } from '../../data/portfolioSamples'


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
        {/* 이 섹션의 주인공은 글이 아니라 화면 — 헤더는 두 줄로 끝낸다 */}
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          업종마다, 이런 화면을 만들어 왔습니다.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.18rem] leading-[1.7] text-slate-400 sm:text-[1.28rem]">
          직원이 쓰는 <span className="font-bold text-teal-300">Business AX</span>와 고객·거래처가 쓰는{' '}
          <span className="font-bold text-amber-300">플랫폼</span>을 하나의 데이터 흐름으로 연결한 시연형 레퍼런스입니다.
        </p>

        {/* 대표 4종 — 화면을 크게 */}
        <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6">
          {featured.map((s) => (
            <article key={s.slug} className="group/c flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-xl shadow-slate-950/40 transition-colors hover:border-teal-400/40 sm:rounded-3xl">
              <SampleShot s={s} sizes="(min-width:640px) 44vw, 46vw" eager />
              <div className="flex flex-1 flex-col p-3 sm:p-5">
                {/* 업종명이 가장 먼저 읽히게 — 브랜드명은 아래 작게 */}
                <p className="break-keep text-[1.18rem] font-black leading-tight text-teal-300 sm:text-[1.6rem]">{s.industry}</p>
                <p className="mt-1 break-keep text-[0.92rem] font-bold text-slate-500 sm:text-[1.05rem]">{s.name}</p>
                <p className="mt-2 line-clamp-2 break-keep text-[0.98rem] leading-snug text-slate-300 sm:line-clamp-none sm:text-[1.18rem] sm:leading-relaxed">{s.line}</p>
                <div className="mt-auto pt-3 sm:pt-4">
                  <SampleLinks s={s} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 나머지 6종 */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-3">
          {rest.map((s) => (
            <article key={s.slug} className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-slate-900 transition-colors hover:border-teal-400/40">
              <SampleShot s={s} sizes="(min-width:1024px) 30vw, 46vw" />
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className="break-keep text-[1.12rem] font-black leading-tight text-teal-300 sm:text-[1.3rem]">{s.industry}</p>
                <p className="mt-0.5 break-keep text-[0.88rem] font-bold text-slate-500 sm:text-[0.98rem]">{s.name}</p>
                <p className="mt-1.5 line-clamp-2 break-keep text-[0.96rem] leading-snug text-slate-400 sm:text-[1.08rem]">{s.line}</p>
                <div className="mt-auto pt-2.5">
                  <SampleLinks s={s} compact />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-2xl break-keep text-center text-[1.0rem] leading-relaxed text-slate-500 sm:text-[1.1rem]">
          {AX_PORTFOLIO_HEAD.note}
        </p>
      </div>
    </section>
  )
}

/* ── SECTION — 왜 미래AI랩인가: 역할의 차이 세 가지 ──────────────────────── */

const ROLES = [
  { who: '컨설턴트', what: '방향을 제안합니다', how: '진단 · 보고서 · 자금 조언', accent: false },
  { who: '일반 개발사', what: '요청받은 기능을 구현합니다', how: '요구사항 · 개발 · 납품', accent: false },
  { who: '미래AI랩', what: '사업을 이해하고, 만들 것을 설계하고, 직접 구현합니다', how: '사업 진단 → AX 설계 → 구현 → 고객 플랫폼 → 데이터 · 성장', accent: true },
] as const

export function AxDifferenceSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          왜 미래AI랩인가
        </h2>
        <div className="mx-auto mt-9 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {ROLES.map((r) => (
            <div
              key={r.who}
              className={`rounded-2xl p-5 sm:p-6 ${r.accent ? 'border-2 border-teal-500/60 bg-teal-50/60 shadow-lg shadow-teal-500/10' : 'border border-slate-200 bg-slate-50'}`}
            >
              <p className={`text-[1.08rem] font-black sm:text-[1.15rem] ${r.accent ? 'text-teal-700' : 'text-slate-500'}`}>{r.who}</p>
              <p className={`mt-1.5 break-keep text-[1.24rem] font-black leading-snug sm:text-[1.3rem] ${r.accent ? 'text-slate-900' : 'text-slate-700'}`}>{r.what}</p>
              <p className={`mt-2.5 break-keep text-[1.08rem] leading-relaxed sm:text-[1.14rem] ${r.accent ? 'font-semibold text-slate-600' : 'text-slate-500'}`}>{r.how}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SECTION — 실제 기업 AX 프로젝트 (전원 익명) ─────────────────────────── */
// ⚠️ 회사명·대표자명·고객사·내부 보고서·수치는 공개하지 않는다. 업종과 연결 구조, 단계만 보여준다.
//    실제 제품 화면에는 실명·거래처명이 그대로 담겨 있어 썸네일로 쓰지 않고, 데이터 흐름 도식으로 대신한다.

type FieldProject = {
  industry: string
  line: string
  stage: string
  funding?: boolean
  inner: string[]
  outer?: { label: string; items: string[] }
}

const FIELD_PROJECTS: FieldProject[] = [
  {
    industry: '의료폐기물 수거·운반',
    line: '현장 운영과 병원 고객 플랫폼을 하나의 데이터 흐름으로 연결',
    stage: 'Business AX + 고객 플랫폼 고도화',
    funding: true,
    inner: ['거래처', '일정·배차', '수거', '자재·재고', '정산·청구'],
    outer: { label: '병원 화면', items: ['수거요청', '긴급수거', '리포트'] },
  },
  {
    industry: 'Wellness 케어',
    line: '고객기록 → 내부 판단 → 직원 실행 → 고객 확인이 다시 이어지는 구조',
    stage: 'Pilot 준비 · V1',
    funding: true,
    inner: ['방문·상담 기록', '우선관리 고객', '재방문 판단', '실행업무'],
    outer: { label: '고객 화면', items: ['이용기록', '이용권', '피드백'] },
  },
  {
    industry: '피혁 제조·도소매',
    line: '제품·재고·견적·재구매·거래처 영업기회를 연결',
    stage: 'MVP 고도화 진행 중',
    inner: ['제품·재고', '견적·주문', '거래처', '영업기회'],
    outer: { label: '거래처 화면', items: ['주문', '요청'] },
  },
  {
    industry: '산업계측·장비유통',
    line: '재고·수요·견적·재구매와 영업 Action을 연결',
    stage: 'Business AX MVP 진행 중',
    inner: ['재고·수요', '견적', '재구매 예측', '영업 Action'],
  },
  {
    industry: '전기·정보통신 · 프로젝트관리',
    line: '현장·프로젝트·견적·원가·수금과 고객 서비스 흐름을 연결',
    stage: 'Hybrid AX MVP 진행 중',
    inner: ['현장·일정', '프로젝트', '견적·원가', '준공·수금'],
    outer: { label: '고객 화면', items: ['문의', '진행 확인'] },
  },
  {
    industry: '산업용 설비·펌프',
    line: '설비·AS·설치·재고·발주·정산을 연결',
    stage: 'Business AX MVP 진행 중',
    inner: ['설비 이력', 'AS·설치', '재고·발주', '정산'],
  },
]

export function AxRealProjectsSection() {
  return (
    <section id="real-projects" className="scroll-mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.1rem] font-black tracking-tight text-blue-600 sm:text-[1.2rem]">REAL · FIELD PROJECTS</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          Reference에서 끝나지 않습니다.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.15rem] leading-[1.7] text-slate-600 sm:text-[1.25rem]">
          실제 기업을 대상으로 설계·개발이 진행 중인 프로젝트입니다. 고객사 보호를 위해 업종으로만 표기합니다.
        </p>

        <div className="mx-auto mt-10 grid max-w-6xl gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {FIELD_PROJECTS.map((f) => (
            <article key={f.industry} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* 시각 타일 — 내부 운영과 외부 화면이 한 데이터로 이어지는 구조 */}
              <div className="flex h-[150px] flex-col justify-center bg-slate-950 p-4 sm:h-[164px] sm:p-5">
                <p className="text-[0.82rem] font-black tracking-wide text-blue-300">BUSINESS AX</p>
                <p className="mt-1.5 flex flex-wrap gap-1">
                  {f.inner.map((t) => (
                    <span key={t} className="rounded-md bg-blue-400/12 px-1.5 py-0.5 text-[0.88rem] font-bold text-blue-100 ring-1 ring-inset ring-blue-400/25">{t}</span>
                  ))}
                </p>
                {f.outer ? (
                  <>
                    <p aria-hidden className="my-1.5 text-center text-[0.9rem] font-black leading-none text-slate-600">⇅</p>
                    <p className="text-[0.82rem] font-black tracking-wide text-amber-300">{f.outer.label.toUpperCase()}</p>
                    <p className="mt-1.5 flex flex-wrap gap-1">
                      {f.outer.items.map((t) => (
                        <span key={t} className="rounded-md bg-amber-400/12 px-1.5 py-0.5 text-[0.88rem] font-bold text-amber-100 ring-1 ring-inset ring-amber-400/25">{t}</span>
                      ))}
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-[0.85rem] font-bold text-slate-500">내부 운영 중심 · 외부 화면 확장 가능</p>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="break-keep text-[1.28rem] font-black leading-snug text-slate-900 sm:text-[1.4rem]">{f.industry}</p>
                <p className="mt-1.5 line-clamp-2 min-h-[2.6em] break-keep text-[1.02rem] leading-snug text-slate-600 sm:text-[1.1rem]">{f.line}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-3">
                  <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[0.92rem] font-black text-teal-300 sm:text-[0.98rem]">{f.stage}</span>
                  {f.funding && (
                    <span className="inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-slate-500">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 정책자금 조달 신청 진행 중
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[0.98rem] leading-relaxed text-slate-400 sm:text-[1.05rem]">
          업체명·화면·내부 자료는 공개하지 않습니다. 위 도식은 각 프로젝트에서 연결한 업무 흐름을 요약한 것입니다.
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
