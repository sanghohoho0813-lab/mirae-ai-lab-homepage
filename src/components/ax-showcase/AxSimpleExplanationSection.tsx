// 홈 — 앞 섹션에서 AX가 무엇이고 왜 필요한지 이미 설명했다.
// 여기서는 남은 오해 하나(업종을 바꾸는 것 아니냐)를 정리하고, 공식 정책근거로 마무리한다.
//
// 문장 원칙: 한 문장에 하나의 주장, 결론부터. API·인프라·백엔드 같은 IT 용어는 쓰지 않는다.
import { Link } from 'react-router-dom'
import { AX_URGENCY_LINES } from '../../data/policyAxEvidence2026'
import AxPolicyEvidenceStrip from './AxPolicyEvidenceStrip'

export default function AxSimpleExplanationSection() {
  return (
    <section id="ax-explained" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(85%_100%_at_20%_0%,rgba(45,212,191,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
        {/* 업종을 바꾸는 게 아니라는 한 줄 정리 */}
        <div className="rounded-3xl border border-amber-400/25 bg-amber-400/[0.08] p-7 text-center sm:p-10">
          <p className="break-keep text-[1.49rem] font-black leading-[1.6] text-amber-100 sm:text-[1.7rem]">
            업종을 바꾸는 것이 아닙니다.<br />
            <span className="text-amber-300">지금 하는 업무방식을 AX로 바꾸면 됩니다.</span>
          </p>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-[1.26rem] leading-[1.75] text-slate-200 sm:text-[1.28rem]">
            AI를 판매하는 기업이 아니어도, AI와 데이터를 실제 업무에 활용하는 기업이 될 수 있습니다.
          </p>
        </div>

        {/* 공식 정책근거 — 앞에서 말한 방향이 실제 문서로 확인되는 자리 */}
        <div className="mt-20 border-t border-white/10 pt-16 sm:mt-28 sm:pt-20">
          <h3 className="break-keep text-center text-[2.04rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.6rem]">
            2026년, 공식 문서로 확인되는 방향입니다.
          </h3>
          <div className="mt-12 sm:mt-16">
            <AxPolicyEvidenceStrip />
          </div>

          {/* 정책근거 다음 — 지금 시점의 압박을 사실 범위 안에서 전달한다 */}
          <div className="mt-12 rounded-3xl border border-white/12 bg-white/[0.04] p-7 text-center sm:mt-16 sm:p-10">
            {AX_URGENCY_LINES.map((line, i) => (
              <p
                key={line}
                className={`mx-auto max-w-2xl break-keep leading-[1.75] ${i === 0 ? '' : 'mt-4'} ${
                  i === AX_URGENCY_LINES.length - 1
                    ? 'text-[1.43rem] font-black text-amber-200 sm:text-[1.5rem]'
                    : 'text-[1.32rem] text-slate-300 sm:text-[1.34rem]'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 업종별 화면은 상세페이지에서 15개 업종을 모두 볼 수 있다 */}
        <div className="mt-16 flex justify-center sm:mt-20">
          <Link
            to="/business-services/funding-consulting#ax-showcase-v2"
            className="flex min-h-[62px] w-full items-center justify-center gap-2 break-keep rounded-xl bg-teal-400 px-8 text-center text-[1.36rem] sm:text-[1.24rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto"
          >
            우리 업종은 어떻게 바뀌는지 보기 <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
