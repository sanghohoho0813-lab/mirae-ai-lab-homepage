// 정책자금·보증부 자금 실제 사례 섹션 (정책자금 상세페이지 전용).
// 다크 프리미엄 스타일: 필 배지(업종·대표님) + 초대형 "N억 확보" + 폰 목업 안 다크모드 카톡 대화.
// 금액은 [[..]] 토큰 → 빨간 강조 박스로 렌더. 승인 완료 사례만 게시.
// ⚠️ 대화는 개인정보 보호를 위해 회사명·세부 상황을 바꿔 정리(고지문 표기).
import { useEffect, useRef } from 'react'
import {
  fundingCases,
  CASES_DISCLAIMER,
  type ChatLine,
  type FundingCase,
} from '../data/fundingCases'

const band = 'px-5 py-10 sm:py-14'
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

// 폰 목업 + 설명란 카드 하나 (전체 기본 노출 · 카드 높이 압축)
function PhoneCase({ c }: { c: FundingCase }) {
  const roomName = `${c.pill} ${c.owner.replace('님', '')}님`
  let firstClientSeen = false
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      {/* 상단: 업종 + 확보 금액 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200">
            {c.pill} · {c.owner}
          </span>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-sky-300"><span aria-hidden>📍</span> {c.region}</p>
          <p className="mt-1 text-[13px] font-medium text-slate-400">{c.size}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            <span className="text-sky-400">{c.bigAmount}</span> 확보
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{c.amountLabel}</p>
        </div>
      </div>

      {/* 폰 목업 (압축 · 고객 결과 메시지) */}
      <div className="mt-4 w-full max-w-[280px] self-center rounded-[1.8rem] bg-[#17181d] p-1.5 shadow-xl ring-1 ring-white/10">
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

      {/* 설명란 (핵심만 · 3줄 클램프) */}
      <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-slate-300">{c.summary}</p>
      {c.meta && c.meta.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.meta.map((m) => (
            <span key={m} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-300">{m}</span>
          ))}
        </div>
      )}
    </article>
  )
}

export default function FundingCasesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 사례 카드 자동 좌우 스크롤(천천히·핑퐁). 사용자가 만지면 잠시 멈춤.
  // ⚠️ scrollLeft 은 읽을 때 정수로 반올림되므로 0.35px씩 더하면 누적되지 않는다 →
  //    실수 누산기(pos)에 더해서 대입해야 천천히 움직인다.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let paused = false
    let dir = 1
    let raf = 0
    let pos = el.scrollLeft
    const speed = 0.35 // px/frame — 천천히
    const tick = () => {
      const max = el.scrollWidth - el.clientWidth
      if (!paused && max > 1) {
        pos += speed * dir
        if (pos >= max) { pos = max; dir = -1 }
        else if (pos <= 0) { pos = 0; dir = 1 }
        el.scrollLeft = pos
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const pause = () => { paused = true }
    // 사용자가 직접 스크롤한 위치에서 이어서 움직이도록 재동기화.
    const resume = () => { pos = el.scrollLeft; paused = false }
    el.addEventListener('pointerdown', pause)
    el.addEventListener('pointerenter', pause)
    el.addEventListener('pointerleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', pause)
      el.removeEventListener('pointerenter', pause)
      el.removeEventListener('pointerleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
    }
  }, [])

  return (
    <section className={`bg-[#060b16] ${band}`}>
      <div className="mx-auto max-w-5xl">
        {/* 상단 요약 — 실제 사례 강조 */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3.5 py-1.5 text-xs font-black text-sky-300 ring-1 ring-sky-400/25">✅ 각색 없는 실제 승인 사례</span>
        </div>
        <h2 className="mt-4 text-center text-[1.9rem] font-black leading-[1.18] tracking-tight text-white sm:text-[2.8rem]">
          말이 아니라,<br /><span className="text-sky-400">실제로 이렇게 받았습니다</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-slate-400 sm:text-lg">
          초기기업부터 매출 수십억 원대까지, <b className="text-slate-200">여러 지역·업종</b>에서 실제로 승인된 사례입니다.
        </p>

        {/* 좌우 스크롤 안내 */}
        <p className="mt-9 text-center text-sm font-bold text-slate-300">👉 좌우로 넘겨서 확인해 보세요</p>

        {/* 대표 사례 — 좌우 스크롤 카드(스와이프 · 자동 스크롤) */}
        <div ref={scrollRef} className="mt-4 -mx-5 flex gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:thin]">
          {fundingCases.map((c) => (
            <div key={`${c.pill}-${c.amount}`} className="w-[290px] shrink-0 sm:w-[320px]">
              <PhoneCase c={c} />
            </div>
          ))}
          {/* 그 외 다수 */}
          <div className="flex w-[190px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-6 text-center">
            <p className="text-5xl font-black leading-none text-sky-400">+</p>
            <p className="mt-3 text-lg font-black text-white">그 외 다수</p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-400">더 많은 승인 사례가<br />있습니다</p>
          </div>
        </div>

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
