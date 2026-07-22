// 정책자금·보증부 자금 실제 사례 섹션 (정책자금 상세페이지 전용).
// 3단계 개편: 폰 목업 반복 대신 ▷ 대표 사례 2건(큰 이야기형 · 고객 메시지 포함) + ▷ 나머지 결과 카드형(밀도 높은 그리드).
// 카톡 말풍선은 고객이 보낸 결과 메시지만(from:'client') — 연출·자화자찬 금지. 네이버 블로그 CTA·고지문 유지. 사례 전체 기본 노출(더보기 없음).
import {
  fundingCases,
  CASES_DISCLAIMER,
  type ChatLine,
  type FundingCase,
} from '../data/fundingCases'

const band = 'px-5 py-12 sm:py-16'
const BLOG_URL = 'https://m.blog.naver.com/ksh90813?categoryNo=27&noTrackingCode=true&proxyReferer=&tab=1'

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

// 고객(대표님) 결과 메시지 말풍선 — 어두운 카톡 스타일
function ClientBubble({ line }: { line: ChatLine }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[8px] bg-[#2c2e36] text-xs" aria-hidden>🧑‍💼</span>
      <p className="max-w-[15rem] rounded-2xl rounded-tl-md bg-[#26282e] px-3 py-2 text-[12.5px] leading-relaxed text-slate-100 shadow-sm">
        {renderText(line.text)}
      </p>
    </div>
  )
}

// 대표 사례(큰 이야기형) — 업종·상황·결과·고객 메시지·진행 방향
function HeroCase({ c }: { c: FundingCase }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200">{c.pill} · {c.owner}</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-300"><span aria-hidden>📍</span> {c.region}</span>
      </div>
      <p className="mt-4 text-[2.4rem] font-black leading-none tracking-tight text-white sm:text-[3rem]">
        <span className="text-sky-400">{c.bigAmount}</span> 확보
      </p>
      <p className="mt-1.5 text-[0.85rem] font-semibold text-slate-400">{c.amountLabel}</p>
      <p className="mt-3 text-[0.85rem] font-medium text-slate-400">당시 상황 · {c.size}</p>

      {/* 고객 결과 메시지 */}
      <div className="mt-4 space-y-1.5 rounded-2xl bg-[#0e0f13] p-3.5 ring-1 ring-white/5">
        {c.chat.map((line, i) => <ClientBubble key={i} line={line} />)}
      </div>

      {/* 진행 방향 */}
      <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-300">{c.summary}</p>
      {c.meta && c.meta.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.meta.map((m) => <span key={m} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-300">{m}</span>)}
        </div>
      )}
    </article>
  )
}

// 결과 카드형 — 업종·기관·금액·핵심 조건·전략(요약) + 짧은 고객 메시지 1줄
function ResultCard({ c }: { c: FundingCase }) {
  const quote = c.chat[0]?.text
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[0.82rem] font-bold text-slate-200">{c.pill}</p>
          <p className="mt-0.5 text-[0.72rem] font-medium text-sky-300">📍 {c.region}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-black leading-none tracking-tight text-white"><span className="text-sky-400">{c.bigAmount}</span></p>
          <p className="mt-0.5 text-[0.62rem] font-semibold text-slate-400">확보</p>
        </div>
      </div>
      <p className="mt-2 text-[0.72rem] font-bold text-slate-300">{c.amountLabel}</p>
      <p className="mt-1 text-[0.72rem] leading-snug text-slate-500">{c.size}</p>
      <p className="mt-2.5 line-clamp-3 text-[0.8rem] leading-relaxed text-slate-400">{c.summary}</p>
      {quote && <p className="mt-2.5 border-t border-white/5 pt-2.5 text-[0.75rem] italic leading-snug text-slate-500">“{quote.replace(/\[\[|\]\]/g, '')}”</p>}
    </article>
  )
}

export default function FundingCasesSection() {
  const [hero1, hero2, ...rest] = fundingCases

  return (
    <section className={`bg-[#060b16] ${band}`}>
      <div className="mx-auto max-w-5xl">
        {/* 상단 요약 */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3.5 py-1.5 text-xs font-black text-sky-300 ring-1 ring-sky-400/25">✅ 각색 없는 실제 승인 사례</span>
        </div>
        <h2 className="mt-4 text-center text-[1.75rem] font-black leading-[1.2] tracking-tight text-white sm:text-[2.5rem]">
          말이 아니라,<br /><span className="text-sky-400">실제로 이렇게 받았습니다</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[1.02rem] leading-relaxed text-slate-400 sm:text-lg">
          초기기업부터 매출 수십억 원대까지, <b className="text-slate-200">여러 지역·업종</b>에서 실제로 승인된 사례입니다.
        </p>

        {/* 대표 사례 2건 (큰 이야기형) */}
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {[hero1, hero2].filter(Boolean).map((c) => <HeroCase key={`${c.pill}-${c.amount}`} c={c} />)}
        </div>

        {/* 나머지 결과 카드형 (밀도 높은 그리드) */}
        {rest.length > 0 && (
          <>
            <p className="mt-10 text-center text-sm font-bold text-slate-400">그 외 승인 사례</p>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {rest.map((c) => <ResultCard key={`${c.pill}-${c.amount}`} c={c} />)}
            </div>
          </>
        )}

        {/* 네이버 블로그 전체 사례 (유지) */}
        <div className="mt-10 text-center">
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

        {/* 고지문 */}
        <p className="mt-10 rounded-2xl bg-white/5 p-5 text-sm leading-relaxed text-slate-400 ring-1 ring-white/10">
          {CASES_DISCLAIMER}
        </p>
      </div>
    </section>
  )
}
