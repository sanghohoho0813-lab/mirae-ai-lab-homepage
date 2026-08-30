// 홈 리빌드 — 설득 스토리 섹션 모음.
// 흐름: WHY NOW(질문·병목) → …Proof… → AX가 바꾸는 것(Before/After + Closed Loop)
//       → AI·데이터 자산 → 성장(+정책 시그널·Growth Layer).
// 원칙: 위기감 30 / 희망 70 — 항상 RISK → SOLUTION → OPPORTUNITY 로 끝낸다.
//       기능 나열 금지, 실제 흐름과 화면이 말하게 한다. 과장·보장성 표현 금지.
import { Link } from 'react-router-dom'

const DETAIL = '/business-services/funding-consulting'

/* ── SECTION 02 — WHY NOW: 가장 강한 질문 하나 ───────────────────────────── */

const OLD_WAYS = ['엑셀', '카카오톡', '수기 장부', '직원 기억', '대표 판단'] as const
const BOTTLENECKS = ['정보 누락', '판단 지연', '고객 이탈', '대표 업무 증가'] as const

export function AxWhyNowSection() {
  return (
    <section id="why-now" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(85%_100%_at_50%_0%,rgba(251,191,36,0.07),transparent_70%)]" />
      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          지금보다 매출이 두 배가 되어도,<br />
          <span className="text-amber-300">지금 방식으로 운영할 수 있습니까?</span>
        </h2>
        <div className="mx-auto mt-7 max-w-2xl space-y-3">
          <p className="break-keep text-center text-[1.24rem] leading-[1.75] text-slate-300 sm:text-[1.34rem]">
            회사가 작을 때는 대표의 기억과 직원의 경험만으로도 돌아갑니다.
          </p>
          <p className="break-keep text-center text-[1.24rem] leading-[1.75] text-slate-300 sm:text-[1.34rem]">
            하지만 고객·매출·직원이 늘어날수록, 같은 방식이 병목이 됩니다.{' '}
            <b className="text-white">문제가 생긴 뒤에 시스템을 만드는 것은 늦습니다.</b>
          </p>
        </div>

        {/* 현재 방식 → 성장 → 병목 */}
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/12 bg-white/[0.04] p-5 sm:p-7">
          <p className="flex flex-wrap justify-center gap-1.5">
            {OLD_WAYS.map((t) => (
              <span key={t} className="rounded-lg bg-slate-950/60 px-3 py-1.5 text-[1.05rem] font-bold text-slate-300 ring-1 ring-inset ring-white/12 sm:text-[1.12rem]">
                {t}
              </span>
            ))}
          </p>
          <p aria-hidden className="my-3 text-center text-[1.15rem] font-black text-slate-500">
            ↓ <span className="text-[1.0rem] font-bold text-slate-400">고객·매출·직원이 늘어나면</span>
          </p>
          <p className="flex flex-wrap justify-center gap-1.5">
            {BOTTLENECKS.map((t) => (
              <span key={t} className="rounded-lg bg-amber-400/10 px-3 py-1.5 text-[1.05rem] font-bold text-amber-200 ring-1 ring-inset ring-amber-400/25 sm:text-[1.12rem]">
                {t}
              </span>
            ))}
          </p>
        </div>

        {/* RISK 로 끝내지 않는다 — 구조라는 해법 */}
        <p className="mx-auto mt-8 max-w-2xl break-keep text-center text-[1.28rem] font-bold leading-[1.75] text-white sm:text-[1.4rem]">
          Business AX와 데이터, 고객 플랫폼이 갖춰지면<br className="hidden sm:block" />{' '}
          <span className="text-teal-300">같은 인원으로 더 큰 회사를 운영하는 구조</span>가 됩니다.
        </p>
      </div>
    </section>
  )
}

/* ── SECTION — AX가 실제로 바꾸는 것: Before/After + Closed Loop ──────────── */

const BEFORE_FLOW = ['고객 문의', '직원 메모', '엑셀 입력', '담당자 판단', '다른 직원 확인', '다시 고객 연락'] as const
const AFTER_FLOW = ['고객 행동', 'Customer Platform', 'Data', 'Business AX', '판단 · AI Insight', 'Action', '고객 결과 반영'] as const
const LOOP = [
  { en: 'CUSTOMER / PARTNER', ko: '예약 · 주문 · 견적 · 요청', tone: 'border-amber-400/30 bg-amber-400/[0.06] text-amber-300' },
  { en: 'CUSTOMER PLATFORM', ko: '고객·거래처가 쓰는 화면', tone: 'border-sky-400/30 bg-sky-400/[0.06] text-sky-300' },
  { en: 'DATA', ko: '한 번 기록되면 회사 자산으로', tone: 'border-slate-400/30 bg-white/[0.05] text-slate-300' },
  { en: 'BUSINESS AX', ko: '직원이 쓰는 운영 시스템', tone: 'border-blue-400/30 bg-blue-400/[0.06] text-blue-300' },
  { en: 'AI · HUMAN DECISION', ko: '시스템이 찾고, 사람이 결정', tone: 'border-teal-400/40 bg-teal-400/[0.08] text-teal-300' },
  { en: 'ACTION → CUSTOMER RESULT', ko: '처리 결과가 다시 고객 경험으로', tone: 'border-amber-400/30 bg-amber-400/[0.06] text-amber-300' },
] as const

export function AxChangeLoopSection() {
  return (
    <section id="ax-explained" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(85%_100%_at_20%_0%,rgba(45,212,191,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.16rem] font-black tracking-tight text-teal-300 sm:text-[1.3rem]">AX가 실제로 바꾸는 것</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          한 번 생긴 정보가,<br className="sm:hidden" /> 다음 업무까지 이어지게 만듭니다.
        </h2>

        {/* Before / After */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-2xl border border-white/12 bg-slate-950/60 p-5 sm:p-6">
            <p className="text-[1.05rem] font-black text-slate-400 sm:text-[1.15rem]">BEFORE — 사람이 이어붙이는 흐름</p>
            <p className="mt-3 flex flex-wrap items-center gap-y-1.5">
              {BEFORE_FLOW.map((t, i) => (
                <span key={t} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-1 text-[0.9rem] font-black text-slate-600">→</span>}
                  <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[0.98rem] font-bold text-slate-400 ring-1 ring-inset ring-white/10 sm:text-[1.05rem]">{t}</span>
                </span>
              ))}
            </p>
            <p className="mt-3 break-keep text-[0.98rem] leading-snug text-slate-500 sm:text-[1.05rem]">단계마다 사람이 옮겨 적고, 어디선가 끊깁니다.</p>
          </div>
          <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-400/[0.07] p-5 sm:p-6">
            <p className="text-[1.05rem] font-black text-teal-300 sm:text-[1.15rem]">AFTER — 데이터가 이어주는 흐름</p>
            <p className="mt-3 flex flex-wrap items-center gap-y-1.5">
              {AFTER_FLOW.map((t, i) => (
                <span key={t} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-1 text-[0.9rem] font-black text-teal-500">→</span>}
                  <span className="rounded-md bg-slate-950/50 px-2 py-1 text-[0.98rem] font-bold text-slate-100 ring-1 ring-inset ring-teal-400/25 sm:text-[1.05rem]">{t}</span>
                </span>
              ))}
            </p>
            <p className="mt-3 break-keep text-[0.98rem] leading-snug text-slate-300 sm:text-[1.05rem]">기록은 한 번, 나머지는 시스템이 이어줍니다.</p>
          </div>
        </div>

        {/* Closed Loop — 고객 행동과 내부 업무가 하나의 순환 */}
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16">
          <p className="break-keep text-center text-[1.35rem] font-black leading-snug text-white sm:text-[1.6rem]">
            직원용 프로그램과 고객용 홈페이지를<br className="sm:hidden" /> 따로 만드는 것이 아닙니다.
          </p>
          <p className="mx-auto mt-3 max-w-xl break-keep text-center text-[1.15rem] leading-[1.7] text-slate-400 sm:text-[1.24rem]">
            고객의 행동이 내부 업무를 만들고, 내부 처리 결과가 다시 고객 경험으로 돌아오는 하나의 데이터 루프로 설계합니다.
          </p>
          <div className="mt-7">
            {LOOP.map((l, i) => (
              <div key={l.en}>
                {i > 0 && <div aria-hidden className="flex justify-center py-1 text-[1.2rem] font-black leading-none text-slate-600">↓</div>}
                <div className={`rounded-2xl border p-3.5 sm:p-4 ${l.tone.split(' ').slice(0, 2).join(' ')}`}>
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className={`text-[0.95rem] font-black tracking-wide ${l.tone.split(' ')[2]}`}>{l.en}</span>
                    <span className="break-keep text-[1.02rem] font-bold text-slate-200 sm:text-[1.1rem]">{l.ko}</span>
                  </p>
                </div>
              </div>
            ))}
            <p aria-hidden className="mt-2 text-center text-[1.0rem] font-bold text-slate-500">↻ 결과가 다시 다음 고객 행동으로</p>
          </div>
          <p className="mx-auto mt-8 max-w-xl break-keep text-center text-[1.2rem] font-bold leading-[1.7] text-amber-100 sm:text-[1.3rem]">
            업종을 바꾸는 것이 아닙니다.{' '}
            <span className="text-amber-300">지금 하는 업무방식을 AX로 바꾸면 됩니다.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION — AI는 필요한 자리에서 + 데이터 자산 ────────────────────────── */

const AI_FLOW = ['고객·매출·이용 데이터', 'Rule · AI 분석', 'Risk · 기회 발견', '추천 Action', '사람의 결정', '실행', '결과 · Evidence'] as const
const DATA_KINDS = ['고객', '거래처', '매출', '상품·재고', '현장', '방문·구매', '업무 결과'] as const

export function AxAiDataSection() {
  return (
    <section id="ai-at-work" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          AI는 <span className="text-teal-600">필요한 자리에서</span> 일합니다.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.18rem] leading-[1.75] text-slate-600 sm:text-[1.28rem]">
          계산할 수 있는 것은 코드와 데이터베이스가 계산합니다.{' '}
          AI는 여러 정보를 함께 판단해야 하는 곳 — 우선순위, 누락 위험, 설명이 필요한 자리에 배치합니다.
        </p>

        {/* 하나의 흐름 — 데이터가 다음 행동과 근거로 이어진다 */}
        <div className="mx-auto mt-9 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <ol className="flex flex-wrap items-center justify-center gap-y-2">
            {AI_FLOW.map((t, i) => (
              <li key={t} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1.5 text-[1.0rem] font-black text-slate-300">→</span>}
                <span className={`break-keep rounded-lg px-2.5 py-1.5 text-[0.98rem] font-bold sm:text-[1.05rem] ${
                  i === 4 ? 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200' : i === AI_FLOW.length - 1 ? 'bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200' : 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200'
                }`}>
                  {t}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 break-keep text-center text-[0.98rem] leading-relaxed text-slate-500 sm:text-[1.05rem]">
            무엇을 발견했고, 누가 어떤 판단을 했고, 결과가 어땠는지가 기록으로 남습니다 — 이것이 업무·매출 개선의 Evidence가 됩니다.
          </p>
        </div>

        {/* 데이터 자산 — 화면보다 축적 */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 text-center sm:mt-12 sm:p-8">
          <p className="break-keep text-[1.35rem] font-black leading-snug text-slate-900 sm:text-[1.55rem]">
            AX의 진짜 가치는 화면보다,<br className="sm:hidden" /> <span className="text-teal-600">시간이 지나며 쌓이는 데이터</span>에 있습니다.
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {DATA_KINDS.map((t) => (
              <span key={t} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[0.98rem] font-bold text-slate-600 ring-1 ring-inset ring-slate-200 sm:text-[1.05rem]">{t}</span>
            ))}
            <span aria-hidden className="mx-1 text-[1.0rem] font-black text-slate-400">→</span>
            <span className="rounded-lg bg-slate-900 px-3 py-1 text-[0.98rem] font-black text-teal-300 sm:text-[1.05rem]">COMPANY DATA ASSET</span>
          </p>
          <p className="mx-auto mt-4 max-w-xl break-keep text-[1.08rem] leading-[1.7] text-slate-600 sm:text-[1.16rem]">
            경쟁사가 1년 동안 데이터를 쌓는 사이 우리 회사가 엑셀·카카오톡·기억에 머문다면,{' '}
            그 1년의 격차는 나중에 개발비를 한 번 쓴다고 바로 복구되지 않습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── SECTION — GROWTH: 효율에서 끝나지 않는다 + 정책 시그널 + Growth Layer ── */

const GROWTH_LADDER = [
  '반복업무 · 누락 감소',
  '고객·운영 데이터 축적',
  '판단 기준 표준화',
  '재방문 · 재구매 · 객단가 확대',
  '새로운 고객 서비스',
  '다점포 · 플랫폼 확장',
] as const
const GROWTH_TAGS = ['정책자금', '정부지원', '벤처', '특허', 'R&D', '사업화'] as const

export function AxGrowthOutcomeSection({ onConsult }: { onConsult?: () => void }) {
  return (
    <section id="growth" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          같은 일을 조금 빨리 하는 시스템이 아니라,<br className="hidden sm:block" />{' '}
          <span className="text-teal-300">사업을 더 크게 만드는 구조</span>입니다.
        </h2>
        <ol className="mx-auto mt-9 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-2.5 sm:mt-12">
          {GROWTH_LADDER.map((t, i) => (
            <li key={t} className="flex items-center gap-2">
              <span className={`break-keep rounded-xl border px-3.5 py-2 text-[1.02rem] font-bold sm:text-[1.1rem] ${
                i >= 3 ? 'border-teal-400/40 bg-teal-400/[0.08] text-teal-200' : 'border-white/12 bg-white/[0.05] text-slate-200'
              }`}>
                {t}
              </span>
              {i < GROWTH_LADDER.length - 1 && <span aria-hidden className="text-[1.05rem] font-black text-slate-600">→</span>}
            </li>
          ))}
        </ol>

        {/* 정책 시그널 — WHY NOW 의 외부 근거. 주인공이 아니라 신호 하나 */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/12 bg-white/[0.04] p-6 text-center sm:mt-16 sm:p-8">
          <p className="text-[1.0rem] font-black tracking-wide text-amber-300 sm:text-[1.1rem]">POLICY SIGNAL · GROWTH LAYER</p>
          <p className="mx-auto mt-3 max-w-2xl break-keep text-[1.2rem] font-bold leading-[1.75] text-slate-200 sm:text-[1.3rem]">
            정책과 평가의 방향도 같습니다 — AI를 실제 사업에 적용하고{' '}
            <b className="text-white">데이터·기술성·사업성·실증 가능성</b>을 보여주는 기업을 더 중요하게 보는 흐름입니다.
          </p>
          <p className="mx-auto mt-4 max-w-2xl break-keep text-[1.12rem] leading-[1.7] text-slate-400 sm:text-[1.2rem]">
            기술만 만들고 끝내지 않습니다. 실제 시스템과 데이터가 쌓인 뒤, 필요하면 다음 성장수단까지 연결합니다.
          </p>
          <p className="mt-5 flex flex-wrap justify-center gap-1.5">
            {GROWTH_TAGS.map((t) => (
              <span key={t} className="rounded-lg border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[1.0rem] font-bold text-slate-300 sm:text-[1.06rem]">{t}</span>
            ))}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={DETAIL}
              className="flex min-h-[54px] w-full max-w-sm items-center justify-center gap-2 break-keep rounded-xl bg-teal-400 px-6 text-center text-[1.2rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto sm:text-[1.24rem]"
            >
              정책자금 × AX 프로그램 보기 <span aria-hidden>→</span>
            </Link>
            {onConsult && (
              <button
                type="button"
                onClick={onConsult}
                className="flex min-h-[54px] w-full max-w-sm items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[1.2rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto sm:text-[1.24rem]"
              >
                상담 신청
              </button>
            )}
          </div>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-[0.98rem] leading-relaxed text-slate-500 sm:text-[1.05rem]">
            정책자금·보증·지원사업의 결과는 각 기관의 독립적인 심사로 결정됩니다.{' '}
            <Link to={`${DETAIL}#policy-2026`} className="font-bold text-slate-400 underline underline-offset-2 hover:text-slate-300">
              2026 공식 정책근거 보기
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
