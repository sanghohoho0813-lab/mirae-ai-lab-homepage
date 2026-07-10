// 정책자금·보증부 자금 실제 사례 섹션 (정책자금 상세페이지 전용).
// 디자인 원칙: 숫자 우선 · 화려한 그라데이션/빛 효과 배제 · 흰색/연회색 배경 + 짙은 남색(slate-900) 텍스트.
// 승인 완료 사례와 '진행 중' 사례를 명확히 분리. 모바일 1열 스택.
import {
  caseStats,
  fundingCases,
  moreFundingCases,
  inProgressCase,
  CASES_DISCLAIMER,
  CASES_CTA,
} from '../data/fundingCases'

const band = 'px-5 py-16 sm:py-24'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-3 text-center text-[1.7rem] font-black leading-[1.28] tracking-tight text-slate-900 sm:text-[2.4rem]'
const subHead = 'text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl'
const fieldLabel = 'text-[11px] font-black uppercase tracking-wide text-slate-400'

function scrollToApply() {
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
              <p className={`font-black tracking-tight text-slate-900 ${s.big ? 'text-2xl sm:text-3xl' : 'text-[1.05rem] leading-snug sm:text-base'}`}>
                {s.value}
              </p>
              <p className="mt-2 text-xs font-medium leading-snug text-slate-500 sm:text-[0.8rem]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 대표 사례 6개 */}
        <div className="mt-16">
          <h3 className={subHead}>대표 사례</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fundingCases.map((c) => (
              <article key={c.industry} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* 한눈에 — 업종 / 규모 / 승인금액 */}
                <p className="text-base font-extrabold leading-snug text-slate-900">{c.industry}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{c.size}</p>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{c.amount}</p>
                  <p className="mt-0.5 text-sm font-bold text-blue-700">{c.amountLabel}</p>
                </div>

                {/* 문제 / 전략 / 결과 순서 */}
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className={fieldLabel}>문제</dt>
                    <dd className="mt-1 leading-relaxed text-slate-700">{c.problem}</dd>
                  </div>
                  <div>
                    <dt className={fieldLabel}>전략</dt>
                    <dd className="mt-1 leading-relaxed text-slate-700">{c.strategy}</dd>
                  </div>
                  <div>
                    <dt className={fieldLabel}>결과</dt>
                    <dd className="mt-1 font-semibold leading-relaxed text-slate-800">{c.result}</dd>
                  </div>
                </dl>

                {c.meta && c.meta.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.meta.map((m) => (
                      <span key={m} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{m}</span>
                    ))}
                  </div>
                )}

                <p className="mt-auto border-t border-slate-100 pt-4 text-sm font-bold leading-snug text-slate-900">“{c.highlight}”</p>
              </article>
            ))}
          </div>
        </div>

        {/* 더 다양한 사례 4개 */}
        <div className="mt-14">
          <h3 className={subHead}>더 다양한 사례</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {moreFundingCases.map((m) => (
              <div key={m.industry} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold leading-snug text-slate-900">{m.industry}</p>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-blue-700">{m.result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 진행 중 사례 (승인 완료와 분리) */}
        <div className="mt-14">
          <h3 className={subHead}>진행 중인 사례</h3>
          <div className="mt-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-900">진행 중</span>
              <span className="text-sm font-semibold text-slate-500">아직 승인 전 · 신청 진행 단계입니다</span>
            </div>
            <p className="mt-3 text-base font-extrabold text-slate-900">{inProgressCase.industry}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{inProgressCase.size}</p>
            <div className="mt-4">
              <p className={fieldLabel}>준비 내용</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {inProgressCase.prep.map((p) => (
                  <span key={p} className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-amber-200">{p}</span>
                ))}
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-white p-3.5 text-sm font-bold text-slate-900 ring-1 ring-inset ring-amber-200">
              <span className="text-amber-600">상태</span> · {inProgressCase.status}
            </p>
          </div>
        </div>

        {/* 고지문 */}
        <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-500">
          {CASES_DISCLAIMER}
        </p>

        {/* 상담 CTA */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-10">
          <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{CASES_CTA.title}</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">{CASES_CTA.desc}</p>
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
