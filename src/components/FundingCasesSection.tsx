// 정책자금·보증부 자금 실제 사례 섹션 (정책자금 상세페이지 전용).
// 다크 프리미엄 스타일: 필 배지(업종·대표님) + 초대형 "N억 확보" + 폰 목업 안 다크모드 카톡 대화.
// 금액은 [[..]] 토큰 → 빨간 강조 박스로 렌더. 승인 완료 사례만 게시.
// ⚠️ 대화는 개인정보 보호를 위해 회사명·세부 상황을 바꿔 정리(고지문 표기).
import {
  fundingCases,
  moreFundingCases,
  CASES_DISCLAIMER,
  CASES_CTA,
  type ChatLine,
  type FundingCase,
} from '../data/fundingCases'

const band = 'px-5 py-16 sm:py-24'
const BLOG_URL = 'https://blog.naver.com/ksh90813'

function scrollToApply() {
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// [[금액]] → 빨간 강조 박스
function renderText(text: string) {
  const parts = text.split(/\[\[|\]\]/)
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="mx-0.5 inline-block rounded-md border-2 border-red-500 px-1 font-black leading-tight">{p}</span>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

// 다크모드 카톡 말풍선
function DarkBubble({ line, ownerLabel, first }: { line: ChatLine; ownerLabel: string; first: boolean }) {
  if (line.from === 'me') {
    return (
      <div className="flex items-end justify-end gap-1.5">
        {line.time && <span className="shrink-0 text-[9px] font-medium text-slate-500">{line.time}</span>}
        <p className="max-w-[13.5rem] rounded-2xl rounded-tr-md bg-[#fee500] px-3 py-2 text-[12.5px] leading-relaxed text-slate-900 shadow-sm">
          {renderText(line.text)}
        </p>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[10px] bg-[#2c2e36] text-sm" aria-hidden>🧑‍💼</span>
      <div className="min-w-0">
        {first && <p className="mb-1 text-[10px] font-semibold text-slate-400">{ownerLabel}</p>}
        <div className="flex items-end gap-1.5">
          <p className="max-w-[13.5rem] rounded-2xl rounded-tl-md bg-[#26282e] px-3 py-2 text-[12.5px] leading-relaxed text-slate-100 shadow-sm">
            {renderText(line.text)}
          </p>
          {line.time && <span className="shrink-0 text-[9px] font-medium text-slate-500">{line.time}</span>}
        </div>
      </div>
    </div>
  )
}

// 폰 목업 카드 하나
function PhoneCase({ c }: { c: FundingCase }) {
  const roomName = `${c.pill} ${c.owner.replace('님', '')}님`
  let firstClientSeen = false
  return (
    <article className="flex flex-col items-center">
      {/* 필 배지 */}
      <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-bold text-slate-200">
        {c.pill} {c.owner}
      </span>
      {/* 초대형 확보 금액 */}
      <p className="mt-3 text-center text-5xl font-black tracking-tight text-white sm:text-6xl">
        <span className="text-sky-400">{c.bigAmount}</span> 확보
      </p>
      <p className="mt-1.5 text-sm font-semibold text-slate-400">{c.amountLabel}</p>

      {/* 폰 목업 */}
      <div className="mt-5 w-full max-w-[300px] rounded-[2.2rem] bg-[#17181d] p-2 shadow-2xl ring-1 ring-white/10">
        <div className="overflow-hidden rounded-[1.7rem] bg-[#0e0f13]">
          {/* 채팅방 헤더 */}
          <div className="flex items-center gap-2 border-b border-white/5 bg-[#17181d] px-3.5 py-3">
            <span className="text-base text-slate-300" aria-hidden>‹</span>
            <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-white">{roomName}</p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </div>
          {/* 대화 */}
          <div className="space-y-2.5 px-3 py-4">
            {c.chat.map((line, i) => {
              const first = line.from === 'client' && !firstClientSeen
              if (first) firstClientSeen = true
              return <DarkBubble key={i} line={line} ownerLabel={`${c.pill} ${c.owner}`} first={first} />
            })}
          </div>
        </div>
      </div>

      {/* 요약 캡션 */}
      <p className="mt-4 max-w-[300px] text-center text-xs leading-relaxed text-slate-400">
        <b className="text-slate-300">{c.size}</b> · {c.summary}
      </p>
      {c.meta && c.meta.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {c.meta.map((m) => (
            <span key={m} className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-slate-300">{m}</span>
          ))}
        </div>
      )}
    </article>
  )
}

export default function FundingCasesSection() {
  return (
    <section className={`bg-[#060b16] ${band}`}>
      <div className="mx-auto max-w-5xl">
        {/* 상단 요약 */}
        <p className="text-center text-sm font-black uppercase tracking-widest text-sky-400">정책자금·보증부 자금 실제 사례</p>
        <h2 className="mt-3 text-center text-[1.7rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.4rem]">
          기업마다 막힌 이유가 달랐고,<br />해결 순서도 달랐습니다
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-slate-400 sm:text-lg">
          매출 증빙이 부족한 초기기업부터 연매출 20억 원대 기업까지,
          제조·외식·플랫폼·광고·도소매 등 다양한 업종의 자금 전략을 설계했습니다.
        </p>

        {/* 대표 사례 — 폰 목업 카톡 */}
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {fundingCases.map((c) => (
            <PhoneCase key={`${c.pill}-${c.amount}`} c={c} />
          ))}
        </div>

        {/* 네이버 블로그 전체 사례 */}
        <div className="mt-12 text-center">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#03c75a] px-6 py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <span className="grid h-5 w-5 place-items-center rounded bg-white text-xs font-black text-[#03c75a]" aria-hidden>N</span>
            네이버 블로그에서 성공사례 전체 보기 →
          </a>
          <p className="mt-2.5 text-xs font-medium text-slate-400">진행 과정·승인 결과를 블로그에 상세히 공개하고 있습니다.</p>
        </div>

        {/* 더 다양한 사례 — 승인 공유방 */}
        <div className="mt-16">
          <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">더 다양한 사례</h3>
          <div className="mt-5 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-6">
            <p className="mb-4 text-center text-xs font-bold text-slate-400"># 정책자금 승인 공유방</p>
            <div className="space-y-4">
              {moreFundingCases.map((m) => (
                <div key={m.industry} className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[12px] bg-[#2c2e36] text-base" aria-hidden>🏢</span>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold text-slate-400">{m.industry}</p>
                    <p className="max-w-[24rem] rounded-2xl rounded-tl-md bg-[#26282e] px-3.5 py-2.5 text-[15px] font-semibold leading-relaxed text-slate-100 shadow-sm">
                      <span className="text-sky-400">{m.result}</span> 승인됐어요!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 고지문 */}
        <p className="mt-10 rounded-2xl bg-white/5 p-5 text-sm leading-relaxed text-slate-400 ring-1 ring-white/10">
          {CASES_DISCLAIMER}
        </p>

        {/* 상담 CTA */}
        <div className="mt-12 rounded-3xl bg-white/5 p-8 text-center ring-1 ring-white/10 sm:p-10">
          <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">{CASES_CTA.title}</h3>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-400">{CASES_CTA.desc}</p>
          <button
            type="button"
            onClick={scrollToApply}
            className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-7 py-4 text-base font-black text-slate-900 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {CASES_CTA.button}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
