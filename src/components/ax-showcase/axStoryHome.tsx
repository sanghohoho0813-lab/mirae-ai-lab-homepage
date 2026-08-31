// 홈 리빌드 — 설득 스토리 섹션 모음.
// 흐름: WHY NOW(계획서만으로는 부족한 시대) → …실제 화면… → AX란 무엇인가(정의)
//       → AX가 바꾸는 것(Before/After + Closed Loop) → 성장(+정책 시그널·Growth Layer).
// 원칙: 위기감 30 / 희망 70 — 항상 RISK → SOLUTION → OPPORTUNITY 로 끝낸다.
//       기능 나열 금지, 실제 흐름과 화면이 말하게 한다. 과장·보장성 표현 금지.
import { AX_SIMPLE_EXPLANATION } from '../../data/policyAxEvidence2026'


/* ── HOME 02 — Problem Hook: 계획 다음에 무엇이 있습니까 ─────────────────── */

const WHY_NOW_IMAGES = [
  {
    src: '/why-now/why-now-01.png',
    alt: '사업계획서만으로는 부족하며 실제 구현이 중요하다는 메시지',
  },
  {
    src: '/why-now/why-now-02.png',
    alt: '계획보다 실제 작동하는 서비스와 데이터가 강한 평가를 받는다는 메시지',
  },
  {
    src: '/why-now/why-now-03.png',
    alt: 'AX를 결합한 웹과 앱 구조가 필요하다는 메시지',
  },
] as const

export function AxWhyNowSection() {
  return (
    <section id="why-now" className="scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#02152f]">
      <div className="mx-auto max-w-[989px] px-5 sm:px-6">
        <div className="mx-auto max-w-[941px] space-y-8 sm:space-y-12">
          {WHY_NOW_IMAGES.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={941}
              height={1672}
              loading="lazy"
              className="block h-auto w-full"
            />
          ))}
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
