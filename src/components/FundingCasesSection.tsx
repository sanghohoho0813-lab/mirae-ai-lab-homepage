// 정책자금·보증부 자금 실제 사례 섹션 (정책자금 상세페이지 전용).
// 카톡(승인 사례 공유) 감성: 채팅방 헤더 + 파란 배경 + 흰/노란 말풍선 + 승인 결과 카드.
// 승인 완료 사례와 '진행 중' 사례를 명확히 분리. 모바일 1열 스택.
// ⚠️ 대화는 개인정보 보호를 위해 재구성한 예시(각 창에 '예시' 배지 표기).
import {
  caseStats,
  fundingCases,
  moreFundingCases,
  inProgressCase,
  CASES_DISCLAIMER,
  CASES_CTA,
  type ChatLine,
} from '../data/fundingCases'

const band = 'px-5 py-16 sm:py-24'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-3 text-center text-[1.7rem] font-black leading-[1.28] tracking-tight text-slate-900 sm:text-[2.4rem]'
const subHead = 'text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl'

// 카톡 톤
const KAKAO_BG = 'bg-[#b2c7d9]'
const BUBBLE_L = 'max-w-[15.5rem] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-[15px] leading-relaxed text-slate-800 shadow-sm'
const BUBBLE_R = 'max-w-[15.5rem] rounded-2xl rounded-tr-md bg-[#fee500] px-3.5 py-2.5 text-[15px] leading-relaxed text-slate-900 shadow-sm'

function scrollToApply() {
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 말풍선 한 줄
function Bubble({ line }: { line: ChatLine }) {
  if (line.from === 'me') {
    return (
      <div className="flex justify-end">
        <p className={BUBBLE_R}>{line.text}</p>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-base shadow-sm" aria-hidden>🧑‍💼</span>
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold text-slate-600/80">대표님</p>
        <p className={BUBBLE_L}>{line.text}</p>
      </div>
    </div>
  )
}

export default function FundingCasesSection() {
  return (
    <section className={`bg-white ${band}`}>
      <div className="mx-auto max-w-5xl">
        {/* 상단 요약 */}
        <p className={kicker}>정책자금·보증부 자금 실제 사례</p>
        <h2 className={bigHead}>
          기업마다 막힌 이유가 달랐고,<br />해결 순서도 달랐습니다
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
          매출 증빙이 부족한 초기기업부터 연매출 20억 원대 기업까지, 제조·외식·플랫폼·광고·도소매 등 다양한 업종의 자금 전략을 설계했습니다.
        </p>

        {/* 숫자 요약 카드 4개 (숫자 우선) */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {caseStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className={`font-black tracking-tight text-slate-900 ${s.big ? 'text-2xl sm:text-3xl' : 'text-[1.1rem] leading-snug sm:text-lg'}`}>
                {s.value}
              </p>
              <p className="mt-2 text-[0.8rem] font-medium leading-snug text-slate-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 대표 사례 — 카톡 승인 공유 */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-2">
            <h3 className={subHead}>대표 사례</h3>
            <span className="rounded-full bg-[#fee500] px-2.5 py-1 text-[11px] font-black text-[#3c1e1e]">카톡 승인 공유</span>
          </div>
          <p className="mt-2 text-center text-sm text-slate-500">대표님과 나눈 실제 상담을 예시로 재구성했습니다.</p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {fundingCases.map((c) => (
              <article key={c.industry} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* 채팅방 헤더 */}
                <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-base text-white" aria-hidden>🏢</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-slate-900">{c.industry}</p>
                    <p className="truncate text-xs font-medium text-slate-400">{c.size}</p>
                  </div>
                  <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-500">예시</span>
                </div>

                {/* 대화 (카톡 파란 배경) */}
                <div className={`space-y-3 ${KAKAO_BG} px-4 py-5`}>
                  {c.chat.map((line, i) => (
                    <Bubble key={i} line={line} />
                  ))}

                  {/* 승인 결과 카드 */}
                  <div className="pt-1">
                    <div className="rounded-2xl bg-white p-4 text-center shadow">
                      <p className="text-xs font-black uppercase tracking-wide text-blue-600">✅ 승인 완료</p>
                      <p className="mt-1.5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{c.amount}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{c.amountLabel}</p>
                      {c.meta && c.meta.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                          {c.meta.map((m) => (
                            <span key={m} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{m}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 한 줄 요약 */}
                <p className="px-4 py-3.5 text-sm font-semibold leading-snug text-slate-600">{c.highlight}</p>
              </article>
            ))}
          </div>
        </div>

        {/* 더 다양한 사례 — 승인 공유방 (단체 카톡 느낌) */}
        <div className="mt-14">
          <h3 className={subHead}>더 다양한 사례</h3>
          <div className={`mt-5 rounded-3xl border border-slate-200 ${KAKAO_BG} p-4 shadow-sm sm:p-6`}>
            <p className="mb-4 text-center text-xs font-bold text-slate-700/70"># 정책자금 승인 공유방 · 예시</p>
            <div className="space-y-4">
              {moreFundingCases.map((m) => (
                <div key={m.industry} className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-base shadow-sm" aria-hidden>🏢</span>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold text-slate-700/80">{m.industry}</p>
                    <p className="max-w-[22rem] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-[15px] font-semibold leading-relaxed text-slate-800 shadow-sm">
                      <span className="text-blue-700">{m.result}</span> 승인됐어요!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 진행 중 사례 (승인 완료와 분리) */}
        <div className="mt-14">
          <h3 className={subHead}>진행 중인 사례</h3>
          <div className="mt-5 overflow-hidden rounded-3xl border-2 border-dashed border-amber-300 bg-white shadow-sm sm:mx-auto sm:max-w-md">
            {/* 헤더 (진행 중 표시) */}
            <div className="flex items-center gap-2.5 border-b border-amber-100 bg-amber-50 px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400 text-base" aria-hidden>🚚</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-slate-900">{inProgressCase.industry}</p>
                <p className="truncate text-xs font-medium text-slate-500">{inProgressCase.size}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-900">진행 중</span>
            </div>

            {/* 대화 */}
            <div className={`space-y-3 ${KAKAO_BG} px-4 py-5`}>
              {inProgressCase.chat.map((line, i) => (
                <Bubble key={i} line={line} />
              ))}
              {/* 진행 상태 (승인 아님) */}
              <div className="pt-1">
                <div className="rounded-2xl bg-white p-4 text-center shadow ring-1 ring-inset ring-amber-200">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-600">⏳ 아직 승인 전 · 신청 진행 단계</p>
                  <p className="mt-2 text-base font-bold leading-snug text-slate-900">{inProgressCase.status}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {inProgressCase.prep.map((p) => (
                      <span key={p} className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 고지문 */}
        <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-500">
          {CASES_DISCLAIMER}
        </p>

        {/* 상담 CTA */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-10">
          <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{CASES_CTA.title}</h3>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-600">{CASES_CTA.desc}</p>
          <button
            type="button"
            onClick={scrollToApply}
            className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-7 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-slate-700"
          >
            {CASES_CTA.button}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
