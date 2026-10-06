// 큰 글자 이야기 구간 — AX 풀 패키지 · 2주 기술사업 빌드 두 상세페이지가 같이 쓴다(대표님 요청 2026-10).
// '혹시, 이런 고민을…'(고민 N개) · '그래서, … 하면?'(마지막 정리) 두 구간의 공통 규칙:
//  - 가운데 정렬 · 폰은 히어로 제목 크기를 기준으로 큼직하게 · PC 는 처음 크기의 1.2배
//  - 글자는 모두 굵게(bold)가 기본이고, 강조하던 곳은 굵기 대신 브랜드 색(살구)으로 · 결론 문단의 핵심 말은 형광펜 띠(rv-mark)
//  - 폰·태블릿은 항목·문단 사이를 화면 높이만큼 크게 띄워 한 번에 하나씩 읽힌다. 고민 항목은 위아래 가는 선 사이 한가운데
//  - 스크롤하면 하나씩 떠오른다(useReveal · index.css 의 reveal-init/reveal-in · reveal-soft · rv-line · rv-mark)
import type { ReactNode } from 'react'

export const NW = 'whitespace-nowrap'
/** 가운데 정렬 문장의 한 줄 — 줄 안에서 접힐 때는 위아래 길이가 고르게(balance) */
export const LINE = 'block [text-wrap:balance]'
/** 마지막 정리 — 줄마다 따로 떠오른다(흐릿 → 또렷) */
export const OUT_LINE = `${LINE} reveal-soft`
/** 브랜드 강조색(살구) — 먹색 바탕에서 굵은 흰 글자 사이에 색으로만 강조 */
export const EM = 'text-[#E8B89A]'

/** '사람·관리비·리스크까지' 처럼 가운뎃점으로 이은 말은 통째로 — 줄 맨 앞에 '·' 가 오지 않게 */
export const keepDots = (t: string) =>
  t.split(' ').flatMap((w, i) => [i ? ' ' : '', w.includes('·') ? <span key={i} className={NW}>{w}</span> : w])

/** 형광펜 강조(나타난 뒤 밑에 은은한 띠가 차오른다) — 가운뎃점 말은 점 뒤에서만 접힌다 */
export function Mark({ children }: { children: string }) {
  const parts = children.split('·')
  if (parts.length === 1) return <b className={`rv-mark font-bold ${EM}`}>{children}</b>
  return (
    <b className={`rv-mark font-bold ${EM}`}>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <wbr />}
          <span className={NW}>
            {p}
            {i < parts.length - 1 ? '·' : ''}
          </span>
        </span>
      ))}
    </b>
  )
}

/** 구간 제목 — 폰은 그 페이지 히어로 제목 크기(36px 안팎), PC 는 44px. hero: 그 페이지 히어로 제목 크기 상한 */
export const bigTitle = (hero: 'ax' | 'mvp') =>
  hero === 'ax'
    ? 'break-keep text-[clamp(1.95rem,9.3vw,2.255rem)] font-black leading-[1.3] text-[#FAFAF8] sm:text-[2.76rem] lg:text-[3.3rem]'
    : 'break-keep text-[1.95rem] font-black leading-[1.3] text-[#FAFAF8] min-[380px]:text-[2.15rem] sm:text-[2.6rem] lg:text-[3.3rem]'

/** 마지막 정리 문단 묶음 — 폰 28.8px · PC 26.9px(처음 22.4px 의 1.2배), 모두 굵게 */
export const OUT_BODY =
  'mx-auto mt-[15svh] max-w-3xl space-y-[19svh] break-keep text-[clamp(1.5rem,7.4vw,1.8rem)] font-bold leading-[1.55] text-slate-200 sm:text-[1.8rem] lg:mt-24 lg:max-w-4xl lg:space-y-28 lg:text-[1.68rem]'

/** 마지막 두 문장(핵심 메시지) — 정리 구간에서 가장 크다. hero: 그 페이지 히어로 제목 크기 상한 */
export const brandCls = (hero: 'ax' | 'mvp') =>
  `mx-auto mt-10 max-w-4xl break-keep font-black leading-[1.32] text-[#FAFAF8] sm:mt-12 lg:max-w-6xl ${
    hero === 'ax' ? 'text-[clamp(1.95rem,9.3vw,2.3rem)] sm:text-[2.76rem] lg:text-[3.6rem]' : 'text-[1.95rem] min-[380px]:text-[2.15rem] sm:text-[2.6rem] lg:text-[3.5rem]'
  }`

/** 짧은 구리색 선(가운데에서 양옆으로 그어진다) — 마지막 두 문장 위 */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <div data-reveal className={`mx-auto max-w-3xl ${className}`}>
      <span aria-hidden className="rv-line mx-auto block h-px w-24 bg-[#D47A4A]/60" />
    </div>
  )
}

export type Concern = { lead: string; mid?: string; key: readonly string[] }

/** 고민 N개 — 번호 + 원문 줄마다. 위아래 가는 선 사이 한가운데에 놓인다.
 *  폰·태블릿은 1열(선 사이를 화면 높이의 30%로 띄워 1번을 볼 때 2번은 안 보이게), PC(1024px~)는 2열(홀수면 마지막 항목은 가운데 한 줄 전체).
 *  data: 이 페이지의 e2e 표지(예: 'ax' → data-ax-concern) */
export function ConcernList({ items, data }: { items: readonly Concern[]; data: string }) {
  const odd = items.length % 2 === 1
  const line = 'rv-line absolute inset-x-0 h-px bg-white/[0.12]'
  return (
    <>
      <ol className="mx-auto mt-[12svh] grid max-w-2xl lg:mt-20 lg:max-w-none lg:grid-cols-2 lg:gap-x-16">
        {items.map((c, i) => (
          <li
            key={c.key.join('')}
            data-reveal
            {...{ [`data-${data}-concern`]: '' }}
            className={`relative flex flex-col justify-center py-[15svh] lg:py-14 ${odd && i === items.length - 1 ? 'lg:col-span-2 lg:mx-auto lg:w-1/2' : ''}`}
          >
            <span aria-hidden className={`${line} top-0`} />
            <p className="text-[1.2rem] font-black tabular-nums tracking-[0.12em] text-[#D9824F] sm:text-[1.26rem] lg:text-[1.5rem]">{String(i + 1).padStart(2, '0')}</p>
            {/* 모두 굵게 · 핵심 문장은 살구색. 원문 줄마다 따로(줄 안에서는 고르게 나눠 접는다) */}
            <p className="mt-4 break-keep text-[clamp(1.45rem,7vw,1.7rem)] font-bold leading-[1.6] text-[#E7EAEE] sm:text-[1.7rem] lg:text-[1.87rem]">
              <span className={LINE}>{keepDots(c.lead)}</span>
              {c.mid && <span className={LINE}>{keepDots(c.mid)}</span>}
              {c.key.map((k) => (
                <span key={k} className={`${LINE} ${EM}`}>
                  {keepDots(k)}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
      {/* 마지막 아래 선 — PC 2열이면 칸마다(짝수) 또는 한 줄 전체(홀수 · 마지막 항목 폭) */}
      <div data-reveal aria-hidden className={`mx-auto grid max-w-2xl lg:max-w-none ${odd ? '' : 'lg:grid-cols-2 lg:gap-x-16'}`}>
        <span className={`relative block h-px ${odd ? 'lg:mx-auto lg:w-1/2' : ''}`}>
          <span className={`${line} top-0`} />
        </span>
        {!odd && (
          <span className="relative hidden h-px lg:block">
            <span className={`${line} top-0`} />
          </span>
        )}
      </div>
    </>
  )
}

/** 고민 구간 마지막 연결 문구(영상으로 넘긴다) — 모두 굵게, 마지막 줄은 살구색 */
export function ConcernsNext({ data, children }: { data: string; children: ReactNode }) {
  return (
    <p
      data-reveal
      {...{ [`data-${data}-concerns-next`]: '' }}
      className="mx-auto mt-[12svh] max-w-3xl break-keep text-[clamp(1.35rem,6.4vw,1.55rem)] font-bold leading-[1.65] text-[#E7EAEE] sm:text-[1.68rem] lg:mt-24 lg:text-[2rem]"
    >
      {children}
    </p>
  )
}
