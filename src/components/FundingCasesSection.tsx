// 정책자금·보증부 자금 실제 사례 섹션 (정책자금 상세페이지 전용).
// 장면형: 대표 사례 2건은 '큰 이야기'(폰 목업 카톡 + 상황·진행·결과), 나머지는 '작은 결과 카드'.
// 8개 동일 폰 목업 반복을 없애 피로도를 낮춤. 금액은 [[..]] → 빨간 강조. 승인 완료 사례만 게시.
// ⚠️ 대화는 개인정보 보호를 위해 회사명·세부 상황을 바꿔 정리(고지문 표기).
import { fundingCases, CASES_DISCLAIMER, type ChatLine, type FundingCase } from '../data/fundingCases'

const band = 'px-5 py-16 sm:py-24'
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

// 폰 목업 (카톡 결과 메시지)
function PhoneMock({ c }: { c: FundingCase }) {
  const roomName = `${c.pill} ${c.owner.replace('님', '')}님`
  let firstClientSeen = false
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-[1.8rem] bg-[#17181d] p-1.5 shadow-xl ring-1 ring-white/10">
      <div className="overflow-hidden rounded-[1.4rem] bg-[#0e0f13]">
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#17181d] px-3 py-2.5">
          <span className="text-sm text-slate-300" aria-hidden>‹</span>
          <p className="min-w-0 flex-1 truncate text-[12px] font-bold text-white">{roomName}</p>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </div>
        <div className="space-y-1.5 px-3 py-3">
          {c.chat.map((line, i) => {
            const first = line.from === 'client' && !firstClientSeen
            if (first) firstClientSeen = true
            return <DarkBubble key={i} line={line} ownerLabel={`${c.pill} ${c.owner}`} first={first} />
          })}
        </div>
      </div>
    </div>
  )
}

// 큰 이야기형 사례 (대표 2건) — 상황·진행·결과 + 폰 목업
function BigCase({ c }: { c: FundingCase }) {
  return (
    <article className="grid items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2 sm:p-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">{c.pill}</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-300"><span aria-hidden>📍</span>{c.region}</span>
        </div>
        <p className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          <span className="text-sky-400">{c.bigAmount}</span> 확보
        </p>
        <p className="mt-1.5 text-sm font-semibold text-slate-400">{c.amountLabel}</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-300">{c.summary}</p>
        {c.meta && c.meta.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {c.meta.map((m) => (
              <span key={m} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-300">{m}</span>
            ))}
          </div>
        )}
      </div>
      <PhoneMock c={c} />
    </article>
  )
}

// 작은 결과 카드 (나머지) — 업종·지역·금액·기관
function SmallCase({ c }: { c: FundingCase }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-bold text-slate-200">{c.pill}</span>
        <span className="shrink-0 text-[11px] font-semibold text-sky-300">📍{c.region}</span>
      </div>
      <p className="mt-3 text-[1.7rem] font-black leading-none tracking-tight text-white">
        <span className="text-sky-400">{c.bigAmount}</span> 확보
      </p>
      <p className="mt-2 text-[12.5px] font-medium leading-snug text-slate-400">{c.amountLabel}</p>
    </div>
  )
}

export default function FundingCasesSection() {
  const bigCases = fundingCases.slice(0, 2)
  const smallCases = fundingCases.slice(2, 8)
  const restCount = Math.max(fundingCases.length - 2 - smallCases.length, 0)

  return (
    <section className={`bg-[#060b16] ${band}`}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3.5 py-1.5 text-xs font-black text-sky-300 ring-1 ring-sky-400/25">✅ 각색 없는 실제 승인 사례</span>
          <h2 className="mt-4 text-[2.05rem] font-black leading-[1.16] tracking-tight text-white sm:text-[3rem]">
            말이 아니라,<br /><span className="text-sky-400">실제로 이렇게 받았습니다</span>
          </h2>
        </div>

        {/* 대표 2건 — 큰 이야기 */}
        <div className="mt-12 space-y-5">
          {bigCases.map((c) => (
            <BigCase key={`${c.pill}-${c.amount}`} c={c} />
          ))}
        </div>

        {/* 나머지 — 작은 결과 카드 */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {smallCases.map((c) => (
            <SmallCase key={`${c.pill}-${c.amount}`} c={c} />
          ))}
          {restCount > 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-center">
              <p className="text-2xl font-black leading-none text-sky-400">+{restCount}</p>
              <p className="mt-1.5 text-sm font-bold text-white">그 외 다수</p>
            </div>
          )}
        </div>

        {/* 네이버 블로그 전체 사례 (유지) */}
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
        </div>

        {/* 고지문 */}
        <p className="mt-8 rounded-2xl bg-white/5 p-5 text-[13px] leading-relaxed text-slate-400 ring-1 ring-white/10">
          {CASES_DISCLAIMER}
        </p>
      </div>
    </section>
  )
}
