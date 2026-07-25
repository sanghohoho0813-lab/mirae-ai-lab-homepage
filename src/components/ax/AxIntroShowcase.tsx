// SECTION 2 — 히어로 다음 첫 스크롤 화면. 히어로에서 넘어온 "AX의 시대 · 1억원 이상" 메시지를
// AX 화면 예시와 함께 보여준 뒤, "사업계획서만 준비하는 것이 아닙니다" 메시지와 진행속도·CTA로 이어간다.
// 구성은 아래 #ax-showcase와 동일하다(업종 선택 → 업종 카드 → 화면 탭 → 이미지 클릭 시 전체화면).
// 다른 점은 업종을 4개(도소매·생산제조·학원교육·B2B)로만 좁혀 맛보기로 보여준다는 것뿐이다.
// 업종 데이터는 #ax-showcase와 같은 단일 소스(AX_INDUSTRY_CARDS)를 그대로 읽어온다(내용 변경 없음).
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AX_INDUSTRY_CARDS, type AxIndustryCard, type ShowcaseImg } from '../../data/axShowcase'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'

// 미리보기 업종 4개 — 도소매 · 생산제조 · 학원·교육 · B2B
const PREVIEW_KEYS = ['retail', 'mfg', 'classpilot', 'b2bsales']

// #ax-showcase와 동일한 화면 구분·상태 배지 규칙
const TABS = [
  { key: 'integrated', label: '통합', screen: '통합 화면' },
  { key: 'pc', label: '관리자·PC', screen: '관리자·PC 화면' },
  { key: 'mobile', label: '현장·모바일', screen: '현장·모바일 화면' },
] as const
type TabKey = (typeof TABS)[number]['key']

const STATUS_BADGE: Record<string, { text: string; cls: string } | null> = {
  ready: null,
  similar: { text: '유사 사례', cls: 'bg-amber-400/15 text-amber-200 ring-amber-400/30' },
  soon: { text: '화면 준비 중', cls: 'bg-white/10 text-slate-300 ring-white/20' },
}

type Screen = { key: TabKey; label: string; screen: string; img: ShowcaseImg }

function screensOf(card: AxIndustryCard): Screen[] {
  const out: Screen[] = []
  TABS.forEach((t) => {
    const img = card.screens[t.key]
    if (img) out.push({ key: t.key, label: t.label, screen: t.screen, img })
  })
  return out
}

const PREVIEW_CARDS: AxIndustryCard[] = PREVIEW_KEYS.map((k) => AX_INDUSTRY_CARDS.find((c) => c.key === k)).filter(
  (c): c is AxIndustryCard => Boolean(c),
)

export default function AxIntroShowcase({ onShowcase, onProcess }: { onShowcase: () => void; onProcess: () => void }) {
  const [key, setKey] = useState(PREVIEW_CARDS[0]?.key ?? 'retail')
  const [tab, setTab] = useState<TabKey>('integrated')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const card = useMemo(() => PREVIEW_CARDS.find((c) => c.key === key) ?? PREVIEW_CARDS[0], [key])
  const available = useMemo(() => screensOf(card), [card])
  const current = available.find((s) => s.key === tab) ?? available[0]

  // 라이트박스는 '선택한 업종의 화면들'만 담는다 — 업종이 섞이지 않는다.
  const slides: AxPswpSlide[] = available.map((s) => ({
    src: s.img.src,
    width: s.img.w,
    height: s.img.h,
    alt: s.img.alt,
    caption: `${card.emoji} ${card.label} · ${s.screen}`,
  }))

  const selectIndustry = (nextKey: string) => {
    setKey(nextKey)
    const next = PREVIEW_CARDS.find((c) => c.key === nextKey)
    const first = next ? screensOf(next)[0] : undefined
    setTab(first ? first.key : 'integrated')
  }

  const openFullscreen = () => {
    if (!current) return
    setIndex(Math.max(0, available.findIndex((s) => s.key === current.key)))
    setOpen(true)
  }

  const badge = STATUS_BADGE[card.status]

  return (
    <section id="ax-preview" className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(90%_100%_at_20%_0%,rgba(45,212,191,0.14),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-blue-600/12 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        {/* 히어로에서 넘어온 메시지 — AX 화면 예시와 같은 화면에서 이어 읽힌다 */}
        <p className="flex items-center gap-2 text-[1.05rem] font-bold leading-relaxed text-teal-300 sm:text-[1.25rem]">
          <span aria-hidden className="h-px w-7 shrink-0 bg-teal-400/60 sm:w-10" />
          <span className="break-keep">이제는 디지털 전환을 넘어 AI 전환, <span className="text-amber-300">AX의 시대</span>입니다.</span>
        </p>
        <p className="relative mt-3 max-w-2xl break-keep overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.09] to-white/[0.02] px-5 py-4 text-[1rem] leading-relaxed text-slate-200 shadow-lg shadow-slate-950/30 backdrop-blur sm:px-6 sm:py-5 sm:text-[1.15rem]">
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 to-amber-500/40" />
          <span className="font-black text-amber-300">1억원 이상 정책자금</span>을 목표로, 자금을 받을 이유가 보이는 <span className="font-bold text-white">AX 혁신기업 구조</span>를 만듭니다.
        </p>

        <p className="mt-6 max-w-2xl break-keep text-[0.9rem] leading-relaxed text-slate-400">
          업종을 고르면 실제 업무가 돌아가는 화면을 바로 확인할 수 있습니다. 눌러서 크게 보세요.
        </p>

        {/* 업종 선택 — 아래 #ax-showcase와 같은 방식(선택한 업종 화면만 노출) */}
        <div role="tablist" aria-label="미리보기 업종 선택" className="mt-4 grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-4">
          {PREVIEW_CARDS.map((c) => {
            const on = c.key === card.key
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => selectIndustry(c.key)}
                className={`flex min-h-[44px] items-center justify-center gap-1.5 break-keep rounded-xl px-2 py-2 text-center text-[0.85rem] font-bold leading-tight transition-all ${
                  on
                    ? 'bg-teal-400 text-slate-900 shadow-lg shadow-teal-400/20'
                    : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span aria-hidden className="text-[1rem] leading-none">{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* 선택한 업종 1개만 — 구성은 #ax-showcase와 동일 */}
        <div className="mt-5 rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.07] to-white/[0.03] p-4 shadow-xl shadow-slate-950/40 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="text-[1.05rem]" aria-hidden>{card.emoji}</span>
            <p className="text-[0.9rem] font-black text-white">{card.label}</p>
            {badge && (
              <span className={`rounded-md px-2 py-0.5 text-[0.78rem] font-bold ring-1 ring-inset ${badge.cls}`}>{badge.text}</span>
            )}
          </div>
          <h3 className="mt-2 break-keep text-[1.2rem] font-black leading-tight text-white sm:text-[1.45rem]">{card.headline}</h3>

          {/* 대표 업무 */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {card.tasks.map((t) => (
              <span key={t} className="rounded-lg bg-white/5 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/10">{t}</span>
            ))}
          </div>

          {/* 정책자금 설명 포인트 */}
          <p className="mt-3 break-keep rounded-lg bg-teal-400/10 px-3 py-2 text-[0.82rem] font-bold leading-snug text-teal-200 ring-1 ring-inset ring-teal-400/20">
            정책자금 설명 포인트 · {card.fundingLine}
          </p>

          {current && (
            <>
              {/* 화면 종류 — 준비된 화면만 노출 */}
              {available.length > 1 && (
                <div role="tablist" aria-label="화면 종류" className="mt-4 flex rounded-xl bg-white/5 p-1 ring-1 ring-inset ring-white/10">
                  {available.map((s) => {
                    const on = s.key === current.key
                    return (
                      <button
                        key={s.key}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => setTab(s.key)}
                        className={`min-h-[44px] flex-1 rounded-lg px-2 text-[0.82rem] font-black transition-colors ${
                          on ? 'bg-teal-400 text-slate-900' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 이미지 — 누르면 바로 전체화면 */}
              <button
                type="button"
                onClick={openFullscreen}
                aria-label={`${card.label} ${current.screen} 크게 보기`}
                className="group mt-3 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 transition-colors hover:border-teal-400/40"
              >
                <img
                  key={current.img.src}
                  src={current.img.src}
                  srcSet={`${current.img.srcSm} 960w, ${current.img.src} ${current.img.w}w`}
                  sizes="(min-width:1024px) 760px, 92vw"
                  alt={current.img.alt}
                  width={current.img.w}
                  height={current.img.h}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[300px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.015] sm:max-h-[380px] lg:max-h-[440px]"
                />
              </button>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-[0.82rem] font-bold text-slate-400">{current.img.caption}</p>
                <p className="text-[0.82rem] text-slate-500">확대해서 확인해보세요</p>
              </div>
            </>
          )}

          {card.note && (
            <p className="mt-2.5 break-keep text-[0.82rem] leading-relaxed text-slate-500">{card.note}</p>
          )}
        </div>

        <button type="button" onClick={onShowcase} className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-teal-400/25 bg-teal-400/10 px-4 py-2.5 text-[0.9rem] font-bold text-teal-200 transition-colors hover:bg-teal-400/20 hover:text-teal-100">
          16개 업종 화면 전체 보기 <span aria-hidden>↓</span>
        </button>

        {/* 핵심 메시지 — 화면을 본 직후에 읽히도록 바로 뒤에 둔다 */}
        <p className="mt-8 break-keep border-t border-white/10 pt-8 text-[1.2rem] font-black leading-snug tracking-tight text-white sm:mt-10 sm:pt-10 sm:text-[1.6rem]">
          사업계획서만 준비하는 것이 아닙니다.<br />
          <span className="text-teal-300">자금전략과 실제 업무에 사용할 AX 프로그램</span>을 함께 만듭니다.
        </p>

        <div className="mt-5 max-w-2xl break-keep border-l-2 border-amber-400 pl-3.5">
          <p className="text-[0.95rem] leading-snug text-amber-100 sm:text-[1rem]">
            인터뷰와 동시에 설계를 시작합니다. 1~2일 안에 방향을 보여드리고, 5일 안에 MVP 초안을 만듭니다.
          </p>
          <p className="mt-1.5 text-[0.95rem] font-bold leading-snug text-amber-100 sm:text-[1rem]">
            피드백과 보완을 거쳐 <span className="text-amber-300">최대 2주</span> 안에 최종 결과물 완성을 목표로 합니다.
          </p>
        </div>
        <p className="mt-2.5 max-w-2xl break-keep text-[0.82rem] leading-relaxed text-slate-500">
          자료가 모두 접수되고 의사결정이 원활한 경우의 목표 일정입니다. 정책기관 심사기간과 별도 본개발 일정은 포함하지 않습니다.
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-3 sm:max-w-lg sm:flex-row">
          <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
            <span aria-hidden>🩺</span> 3분 기업진단
          </Link>
          <button type="button" onClick={onProcess} className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
            2주 진행과정 보기 <span aria-hidden>→</span>
          </button>
        </div>

        {/* 신뢰 바 — 선별 진행 사실을 한 줄로만 */}
        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:gap-4 sm:p-3.5">
          <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필" loading="lazy" decoding="async" width={96} height={96} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-amber-400/40 sm:h-12 sm:w-12" />
          <div className="min-w-0 flex-1">
            <p className="break-keep text-[0.85rem] font-black leading-snug text-white sm:text-[0.9rem]">
              월 5개사 선별 · 김팀장 직접 참여 · 최대 2주 완성 목표
            </p>
            <p className="mt-0.5 break-keep text-[0.82rem] leading-snug text-slate-400">
              정책자금 전문 · 누적 자금조달 지원 100억원+ · 개발 담당자 공동 참여
            </p>
          </div>
        </div>

        <p className="mt-5 break-keep text-[0.82rem] leading-relaxed text-slate-500">
          가상 업종 시나리오로 제작한 프로토타입 화면입니다. 상호·수치는 시연용 예시이며, 기업별 업무분석 후 실제 작동형 시스템으로 확장합니다.
        </p>
      </div>

      <AxPhotoSwipe open={open} slides={slides} index={index} onClose={() => setOpen(false)} />
    </section>
  )
}
