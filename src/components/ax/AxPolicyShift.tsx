// SECTION #why-ax — "2026 정책자금 × AX" 정책변화 밴드. 메인 위계로 항상 노출한다.
// 제목·공식근거 카드·혁신성장 예시·AX 스프린트·핵심 구분(신속상용화 선정기업 vs 일반 AI 도입기업)은
// 기본 노출로 숨기지 않는다. 아코디언으로 핵심 근거를 가리지 않는다.
// ⚠️ 승인·가점 자동적용 단정 금지. 공식 문구·숫자·출처는 policyFunding2026.ts(POLICY_2026) 단일 소스.
import { POLICY_2026 as P } from '../../data/policyFunding2026'

// 정책 → 실행근거 영업 연결 메시지(섹션 하단 밴드).
const CONNECT = {
  title: 'AI로 문서를 만드는 속도는 빨라졌습니다. 이제 차이는 실제 실행근거에서 납니다.',
  paras: [
    '사업계획서 문장만으로는 우리 회사가 실제로 무엇을 바꾸고, 어떤 데이터를 쌓으며, 어떻게 성장할 것인지 충분히 보여주기 어렵습니다.',
    '미래AI랩은 기존 사업의 반복 업무를 분석해 업무 흐름, 데이터 구조와 실제 화면으로 전환합니다.',
    '정부가 제시한 혁신성장 방향을 문구로만 가져오는 것이 아니라, 회사의 실제 운영방식에 적용할 수 있도록 설계합니다.',
  ],
  emphasis: [
    '계획서를 AI로 작성하는 것과 회사가 AI·AX 방식으로 운영될 준비를 하는 것은 다릅니다.',
    '경쟁사보다 먼저 모든 기능을 만드는 것이 목표가 아닙니다. 우리 회사에 필요한 한 가지 업무부터 실제로 바꾸는 것이 목표입니다.',
  ],
} as const

export default function AxPolicyShift() {
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-9">
        {/* 1. Eyebrow */}
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300 sm:text-sm">{P.eyebrow}</p>

        {/* 2. Title / subtitle / basis */}
        <h2 className="mt-2.5 max-w-4xl break-keep text-[1.5rem] font-black leading-[1.25] tracking-tight text-white sm:text-[2rem]">
          {P.title}
        </h2>
        <p className="mt-3 max-w-3xl break-keep text-[1rem] leading-relaxed text-slate-300">{P.subtitle}</p>
        <p className="mt-1.5 max-w-3xl break-keep text-[0.85rem] leading-relaxed text-slate-400">{P.basis}</p>

        {/* 3. 공식 근거 카드 4종 — 항상 노출(모바일 2열 / 데스크톱 4열) */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {P.cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="break-keep text-[0.92rem] font-black leading-snug text-white">{c.title}</p>
              <p className="mt-2 break-keep text-[0.8rem] leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>

        {/* 4 + 5. 혁신성장 AI·디지털 예시 + AX 스프린트 우대트랙 — 항상 노출 */}
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {/* 4. 혁신성장분야 AI·디지털 예시 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="break-keep text-[1rem] font-black leading-snug text-white">AI·디지털 전환이 혁신성장분야에 명시</p>
            <p className="mt-1.5 break-keep text-[0.82rem] leading-relaxed text-slate-400">
              2026년 정책자금 공고 [참고 1] 혁신성장분야에 포함된 AI·디지털 전환 예시입니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {P.innovationExamples.map((x) => (
                <span
                  key={x}
                  className="break-keep rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-[0.8rem] font-bold text-teal-200"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>

          {/* 5. AX 스프린트 우대트랙 */}
          <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.06] p-4">
            <p className="break-keep text-[1rem] font-black leading-snug text-white">{P.axSprint.title}</p>
            <p className="mt-1.5 break-keep text-[0.82rem] leading-relaxed text-slate-300">{P.axSprint.target}</p>
            <ul className="mt-2.5 space-y-1.5">
              {P.axSprint.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 break-keep text-[0.88rem] leading-snug text-slate-100">
                  <span aria-hidden className="mt-0.5 shrink-0 text-teal-300">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. 핵심 구분 — 신속상용화 선정기업 한정 추가 우대(일반 AI 도입기업 전체 적용 아님) */}
        <div className="mt-3 rounded-2xl border-2 border-amber-400/40 bg-amber-400/[0.06] p-4 sm:p-5">
          <span className="inline-block rounded-md bg-amber-400/15 px-2 py-0.5 text-[0.7rem] font-black uppercase tracking-wider text-amber-300">
            선정기업 한정 추가 우대
          </span>
          <p className="mt-2.5 break-keep text-[1.02rem] font-black leading-snug text-white">{P.fastTrack.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {P.fastTrack.items.map((x) => (
              <span
                key={x}
                className="break-keep rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[0.82rem] font-bold text-amber-200"
              >
                {x}
              </span>
            ))}
          </div>
          <p className="mt-3.5 break-keep rounded-xl border border-amber-400/25 bg-slate-950/40 px-4 py-3 text-[0.86rem] font-bold leading-relaxed text-amber-100">
            {P.fastTrack.distinction}
          </p>
        </div>

        {/* 7. 지원금액 종합산정 고지 */}
        <p className="mt-3 break-keep rounded-xl bg-white/[0.03] px-4 py-2.5 text-[0.8rem] leading-relaxed text-slate-400">
          {P.amountNotice}
        </p>

        {/* 8. 출처 — 항상 노출(공고 번호 포함) */}
        <p className="mt-3 break-keep text-[0.75rem] leading-relaxed text-slate-500">
          <span className="font-bold text-slate-400">출처 </span>
          {P.sources.join('  ·  ')}
        </p>

        {/* 9. 정책 → 실행근거 영업 연결 메시지 */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-6">
          <h3 className="max-w-3xl break-keep text-[1.15rem] font-black leading-snug text-white sm:text-[1.3rem]">
            {CONNECT.title}
          </h3>
          <div className="mt-3 max-w-3xl space-y-2">
            {CONNECT.paras.map((t) => (
              <p key={t} className="break-keep text-[0.92rem] leading-relaxed text-slate-300">{t}</p>
            ))}
          </div>
          <div className="mt-3.5 max-w-3xl space-y-2 border-t border-white/10 pt-3.5">
            {CONNECT.emphasis.map((t) => (
              <p key={t} className="break-keep text-[0.98rem] font-black leading-relaxed text-teal-200">{t}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
