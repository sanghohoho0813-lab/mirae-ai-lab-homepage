// 홈 리빌드 — 설득 스토리 섹션 모음.
// 흐름: WHY NOW(계획서만으로는 부족한 시대) → …실제 화면… → AX란 무엇인가(정의)
//       → AX가 바꾸는 것(Before/After + Closed Loop) → 성장(+정책 시그널·Growth Layer).
// 원칙: 위기감 30 / 희망 70 — 항상 RISK → SOLUTION → OPPORTUNITY 로 끝낸다.
//       기능 나열 금지, 실제 흐름과 화면이 말하게 한다. 과장·보장성 표현 금지.
import { AX_SIMPLE_EXPLANATION } from '../../data/policyAxEvidence2026'


/* ── HOME 02 — Problem Hook: 계획 다음에 무엇이 있습니까 ─────────────────── */

const SIGNAL_FIELDS = ['정책자금', '정부지원', '투자', '기술사업화'] as const

export function AxWhyNowSection() {
  return (
    <section id="why-now" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(85%_100%_at_50%_0%,rgba(251,191,36,0.07),transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="mx-auto max-w-3xl break-keep text-[1.87rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          아직도 <span className="text-amber-300">사업계획서 하나만 가지고</span><br />
          정책자금·정부지원사업·투자 앞에 서시나요?
        </h2>

        <p className="mt-9 break-keep text-[1.24rem] leading-[1.75] text-slate-300 sm:mt-11 sm:text-[1.34rem]">
          계획은 누구나 쓸 수 있습니다.<br />결국 다음 질문이 남습니다.
        </p>
        <p className="mt-5 break-keep text-[1.6rem] font-black leading-snug text-white sm:text-[1.9rem]">
          &ldquo;그래서, 실제로 무엇이 있습니까?&rdquo;
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-1.5">
          {['작동하는 서비스', '실제 고객이 쓰는 화면', '쌓이기 시작한 데이터', '매출과 성장으로 잇는 구조'].map((t) => (
            <span key={t} className="break-keep rounded-lg bg-teal-400/10 px-3 py-1.5 text-[1.05rem] font-bold text-teal-200 ring-1 ring-inset ring-teal-400/25 sm:text-[1.14rem]">
              {t}
            </span>
          ))}
        </div>

        <p className="mt-8 break-keep text-[1.3rem] font-black leading-[1.7] text-white sm:text-[1.45rem]">
          미래AI랩은 그 &lsquo;다음&rsquo;을 실제로 만듭니다.
        </p>

        {/* 작은 시그널 — 평가의 무게중심이 옮겨간다 (선정·승인을 보장한다는 뜻이 아니다) */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.95rem] font-bold text-slate-400 sm:text-[1.0rem]">
            {SIGNAL_FIELDS.map((t) => (
              <span key={t} className="rounded-md bg-white/[0.06] px-2 py-0.5">{t}</span>
            ))}
          </p>
          <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 text-[1.0rem] font-black sm:text-[1.08rem]">
            <span className="text-slate-500 line-through decoration-slate-600">PLAN ONLY</span>
            <span aria-hidden className="text-slate-500">→</span>
            <span className="text-teal-300">SYSTEM + DATA + EVIDENCE</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── HOME 04 — AX란 무엇인가: 정의 + 좌/중/우 인포그래픽 + 결과 3칩 ─────────── */

const HUMAN_CHAIN = ['카카오톡', '메모', '엑셀', '직원 기억', '대표 확인', '고객 연락'] as const
const DATA_CHAIN = ['고객 행동', 'Customer Platform', 'Data', 'Business AX', 'AI · Rule', 'Action', '고객에게 다시 반영'] as const
const AX_OUTCOMES = [
  { t: '덜 샙니다', d: '반복입력 · 누락 · 재작업' },
  { t: '더 잘 보입니다', d: '고객 · 재고 · 매출 · 현장' },
  { t: '더 많이 남깁니다', d: '재방문 · 재구매 · 반복매출' },
] as const

export function AxDefinitionSection() {
  const x = AX_SIMPLE_EXPLANATION
  return (
    <section id="ax-definition" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(85%_100%_at_50%_0%,rgba(45,212,191,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          AX가 어렵게 들리신다면,<br className="sm:hidden" /> 이렇게 생각하시면 됩니다.
        </h2>

        {/* 약자와 정의 — 두 줄로 짧게 */}
        <p className="mt-7 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span className="text-[2.3rem] font-black leading-none text-white sm:text-[2.8rem]">AX</span>
          <span className="text-[1.25rem] font-bold text-teal-300 sm:text-[1.4rem]">{x.acronym.en}</span>
          <span className="text-[1.25rem] font-bold text-slate-400 sm:text-[1.4rem]">· {x.acronym.ko}</span>
        </p>
        <p className="mx-auto mt-5 max-w-3xl break-keep text-center text-[1.22rem] font-bold leading-[1.75] text-slate-200 sm:text-[1.4rem]">
          {x.definition}
        </p>

        {/* 좌(사람이 연결) — 중앙 AX — 우(데이터가 연결) 인포그래픽 */}
        <div className="mx-auto mt-11 grid max-w-4xl items-stretch gap-4 sm:mt-14 sm:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl border border-white/12 bg-slate-950/60 p-5 sm:p-6">
            <p className="text-center text-[1.05rem] font-black text-slate-400 sm:text-[1.14rem]">사람이 연결하는 회사</p>
            <div className="mt-4">
              {HUMAN_CHAIN.map((t, i) => (
                <div key={t}>
                  {i > 0 && <p aria-hidden className="py-0.5 text-center text-[0.95rem] font-black leading-none text-slate-600">↓</p>}
                  <p className="break-keep rounded-lg bg-white/[0.05] px-3 py-1.5 text-center text-[1.02rem] font-bold text-slate-400 ring-1 ring-inset ring-white/10 sm:text-[1.08rem]">{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-teal-400 text-[1.4rem] font-black text-slate-900 shadow-lg shadow-teal-500/30 sm:h-20 sm:w-20 sm:text-[1.6rem]">
              AX
            </span>
          </div>
          <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-400/[0.07] p-5 sm:p-6">
            <p className="text-center text-[1.05rem] font-black text-teal-300 sm:text-[1.14rem]">데이터가 이어지는 회사</p>
            <div className="mt-4">
              {DATA_CHAIN.map((t, i) => (
                <div key={t}>
                  {i > 0 && <p aria-hidden className="py-0.5 text-center text-[0.95rem] font-black leading-none text-teal-500">↓</p>}
                  <p className="break-keep rounded-lg bg-slate-950/50 px-3 py-1.5 text-center text-[1.02rem] font-bold text-slate-100 ring-1 ring-inset ring-teal-400/25 sm:text-[1.08rem]">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl break-keep text-center text-[1.35rem] font-black leading-[1.65] text-white sm:text-[1.55rem]">
          한 번 생긴 정보가<br className="sm:hidden" /> 다음 업무까지 이어지는 것.<br />
          <span className="text-teal-300">미래AI랩이 말하는 AX는 이것입니다.</span>
        </p>

        {/* 그래서 무엇이 좋아지는가 — 딱 3개 */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {AX_OUTCOMES.map((o) => (
            <div key={o.t} className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 text-center">
              <p className="break-keep text-[1.3rem] font-black text-white sm:text-[1.4rem]">{o.t}</p>
              <p className="mt-1.5 break-keep text-[1.02rem] font-bold text-slate-400 sm:text-[1.08rem]">{o.d}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl break-keep text-center text-[1.12rem] font-bold leading-[1.7] text-amber-100 sm:text-[1.2rem]">
          업종을 바꾸는 것이 아닙니다.{' '}
          <span className="text-amber-300">지금 하는 업무방식을 AX로 바꾸면 됩니다.</span>
        </p>
      </div>
    </section>
  )
}
