// AX 사업화·자금조달 프로그램 — 단일 대표상품 상세페이지.
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 역할: 컨설팅비 100만원으로 시작해 1~4단계 구현 수준(+5단계 별도견적)을 하나의 흐름으로 안내하고,
//        3분 기업진단 또는 프로그램 상담으로 연결합니다. (기존 A·B 탭 구조는 제거됨)
// 가격·수수료·고지 문구는 corePrograms.ts(FLAGSHIP / BUILD_LEVELS / CONSULTING_FEE / PROGRAM_NOTICES)
//   단일 출처만 참조 — 페이지 내 금액 하드코딩 금지.
// 승인·조달금액 보장 표현 금지. 승인/성공 사례를 사실처럼 단정하지 않음. 허위 정상가·과장 할인율 금지.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import ConsultModal from '../../components/ConsultModal'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../../lib/consultApi'
import {
  FLAGSHIP,
  BUILD_LEVELS,
  getBuildLevel,
  levelTotalLabel,
  CONSULTING_FEE,
  PROGRAM_NOTICES,
  type BuildLevel,
} from '../../data/corePrograms'

type LevelTabKey = '1' | '2' | '3' | '4'

const band = 'px-5 py-12 sm:py-16'
const inner = 'mx-auto max-w-[760px]'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-2.5 text-center text-[1.75rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[2.4rem]'

const man = (won: number) => `${(won / 10_000).toLocaleString('ko-KR')}만원`

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 개발 단계(1~4)와 별도견적(5) 분리
const DEV_LEVELS = BUILD_LEVELS.filter((l): l is BuildLevel => l.key !== '5')
const LEVEL_5 = getBuildLevel('5')

// ── 진행방식(자금조달 전후) 5단계 ─────────────────────────────────────────
const FUNDING_STEPS: { t: string; d: string }[] = [
  { t: '컨설팅 신청', d: `컨설팅비 ${man(CONSULTING_FEE)}으로 기업진단과 자금전략을 시작합니다.` },
  { t: '1단계 AX 실행설계', d: '적용업무·사용자 구분·업무 흐름과 화면 초안을 확정합니다.' },
  { t: '심사 설명자료 준비', d: '자금기관에 제출할 설명자료 기본 구조를 정리합니다.' },
  { t: '정책자금 신청·대응', d: '신청서류와 보완 요청·예상 질의에 함께 대응합니다.' },
  { t: '자금조달 후 본개발', d: '2·3·4단계 중 선택한 구현 수준으로 본개발을 진행합니다.' },
]

// ── 단계별 검수·정산 마일스톤 ─────────────────────────────────────────────
const MILESTONES: { pct: string; label: string; desc: string }[] = [
  { pct: '20%', label: '기획·화면설계 승인', desc: 'AX 실행설계와 화면설계를 확정하고 승인받은 시점' },
  { pct: '50%', label: '프론트 중간시연', desc: '주요 화면과 화면 이동을 중간 시연으로 확인한 시점' },
  { pct: '80%', label: '기능구현 완료', desc: '핵심 기능 구현과 내부 점검을 마친 시점' },
  { pct: '100%', label: '최종검수·배포', desc: '최종 검수와 배포까지 완료한 시점' },
]

// ── 2026 AX 정책환경 팩트 (출처 병기) ─────────────────────────────────────
const POLICY_FACTS: { value: string; label: string }[] = [
  { value: '1,400억원', label: 'AX 스프린트 우대트랙 공급' },
  { value: '60억 → 100억', label: '최대 대출잔액 한도 확대' },
  { value: '0.1%p', label: '금리 우대' },
  { value: '신속평가', label: '심사 절차 우대' },
]

// ── FAQ — 실제 구매 결정에 필요한 질문만(승인·조달 보장 표현 없음) ────────────
const FAQS: { q: string; a: string }[] = [
  {
    q: '컨설팅비 100만원은 개발비에서 차감되나요?',
    a: `${PROGRAM_NOTICES.consultingFee} ${PROGRAM_NOTICES.consultingRefund}`,
  },
  {
    q: '몇 단계를 선택해야 하나요?',
    a: '진단과 AX 실행설계(1단계) 이후 필요한 구현 수준을 함께 정합니다. 실제 업무에 사용할 시스템을 목표로 한다면 4단계를 권장합니다. 구현 수준이 높을수록 설명 가능한 실행근거는 많아지지만 자금조달 결과를 보장하지 않습니다.',
  },
  {
    q: '4단계면 자금이 승인되나요?',
    a: '아니요. 4단계 구축이 자금승인이나 특정 지원금액을 보장하지는 않습니다. 승인을 보장하지 않으며 기업별 결과는 기관 심사와 기업 조건에 따라 달라집니다.',
  },
  {
    q: '개발비 외에 추가되는 비용이 있나요?',
    a: `${PROGRAM_NOTICES.devSeparate} ${PROGRAM_NOTICES.vat} 구현단계 기본범위를 초과하는 기능과 외부연동은 별도 견적입니다.`,
  },
  {
    q: '자금조달 전에 먼저 개발할 수 있나요?',
    a: '네, 선개발도 가능합니다. 이 경우 자금조달과 별개의 개발계약으로 진행하며, 본개발비는 선택한 구현 수준에 따라 정산합니다.',
  },
  {
    q: '특허출원도 포함되나요?',
    a: `2단계 이상 선택 시 서비스 구조와 연계한 국내 특허출원 준비 1건을 포함합니다. ${PROGRAM_NOTICES.patent}`,
  },
]

// ── 공통 UI 조각 ──────────────────────────────────────────────────────────
function Notice({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'amber' }) {
  const cls =
    tone === 'amber'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : 'border-slate-200 bg-slate-50 text-slate-500'
  return <p className={`rounded-2xl border px-4 py-3 text-[0.82rem] leading-relaxed ${cls}`}>{children}</p>
}

function IncludedList({ items, mark = '✓', color = 'text-teal-500' }: { items: string[]; mark?: string; color?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-[0.9rem] leading-snug text-slate-700">
          <span className={`mt-0.5 shrink-0 font-black ${color}`} aria-hidden>{mark}</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function ExcludedList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-[0.88rem] leading-snug text-slate-500">
          <span className="mt-0.5 shrink-0 text-slate-400" aria-hidden>—</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

// 구현 단계 카드 — 모바일 단일 뷰 / 데스크톱 4-up 공용
function LevelCard({ l }: { l: BuildLevel }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border-2 p-5 shadow-sm sm:p-6 ${
        l.recommended ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-white'
      }`}
    >
      {l.recommended && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[0.72rem] font-black text-white shadow-sm">
          미래AI랩 권장 최종 목표
        </span>
      )}
      <h4 className="mt-1 text-[1.05rem] font-black leading-snug tracking-tight text-slate-900">{l.name}</h4>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-[0.82rem] font-black text-blue-700 ring-1 ring-inset ring-blue-100">
          {l.priceLabel}
        </span>
        <span className="text-[0.8rem] font-bold text-slate-500">{levelTotalLabel(l)}</span>
      </div>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-600">{l.short}</p>
      <p className="mt-2.5 rounded-xl bg-slate-50 px-3 py-2 text-[0.86rem] font-semibold leading-snug text-slate-700">
        {l.customer}
      </p>
      <p className="mt-4 text-[0.72rem] font-black uppercase tracking-wide text-teal-600">포함</p>
      <div className="mt-2">
        <IncludedList items={l.included} />
      </div>
      {l.excluded.length > 0 && (
        <>
          <p className="mt-4 text-[0.72rem] font-black uppercase tracking-wide text-slate-400">이 단계 제외</p>
          <div className="mt-2">
            <ExcludedList items={l.excluded} />
          </div>
        </>
      )}
      {l.note && (
        <p className="mt-4 rounded-2xl bg-blue-50/70 px-3.5 py-3 text-[0.82rem] leading-relaxed text-blue-800">{l.note}</p>
      )}
    </div>
  )
}

// 상세 블록 공통 카드 래퍼(번호 배지 + 제목)
function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-900 text-[0.8rem] font-black text-white">{n}</span>
        <h3 className="text-[1.15rem] font-black tracking-tight text-slate-900 sm:text-[1.3rem]">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function FundingConsultingDetailPage() {
  const [level, setLevel] = useState<LevelTabKey>('1')
  const [showBar, setShowBar] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [consult, setConsult] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const activeLevel = getBuildLevel(level)
  const level1 = BUILD_LEVELS[0]

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  // 해시(#build-levels, #level-2 …)로 진입/이동 시 해당 앵커로 스크롤
  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const t = window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    return () => window.clearTimeout(t)
  }, [location.hash])

  // 스크롤 리빌
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('reveal-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )
    Array.from(root.querySelectorAll<HTMLElement>('section > div')).forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
      el.classList.add('reveal-init')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 최종 CTA 노출 시 모바일 고정 바 숨김(중복 방지)
  useEffect(() => {
    const el = finalCtaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen bg-white pb-24 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.8rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">서비스몰 홈</Link>
            <Link to="/business-diagnosis" className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
              3분 기업진단
            </Link>
            <HeaderAccount />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">자금·지원금</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">AX 사업화·자금조달 프로그램</span>
        </div>
      </div>

      {/* ── 1. 상세 Hero (navy) ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
            자금전략 + 업종 맞춤 AX 실행설계 + 시스템 구축
          </span>
          <h1 className="mt-5 text-[1.9rem] font-black leading-[1.2] tracking-tight text-white sm:text-[2.9rem] sm:leading-[1.12]">
            AX 사업화·<br /><span className="text-teal-300">자금조달 프로그램</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[1.02rem] leading-relaxed text-slate-300 sm:text-lg">{FLAGSHIP.tagline}</p>
          <div className="mx-auto mt-7 inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4">
            <span className="text-[1.5rem] font-black tracking-tight text-white sm:text-[1.75rem]">{FLAGSHIP.priceMain}</span>
            <span className="mt-1 text-[0.85rem] font-medium text-slate-400">{FLAGSHIP.priceSub}</span>
          </div>
          <p className="mx-auto mt-5 max-w-md text-[0.92rem] font-semibold leading-relaxed text-teal-200">{FLAGSHIP.collabLine}</p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/business-diagnosis" className="flex items-center justify-center rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              3분 기업진단 시작하기
            </Link>
            <button type="button" onClick={() => scrollToId('build-levels')} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
              구현 단계 보기
            </button>
          </div>
          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-slate-500">
            승인을 보장하지 않으며 기업별 결과는 기관 심사와 기업 조건에 따라 달라집니다.
          </p>
        </div>
      </section>

      {/* ── 2. 프로그램 핵심 구조 ──────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>프로그램 핵심 구조</p>
          <h2 className={bigHead}>컨설팅비 100만원으로 시작해<br /><span className="text-blue-600">필요한 구현 수준까지 하나의 흐름</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1rem] leading-relaxed text-slate-600">
            자금컨설팅과 개발을 따로 발주하지 않습니다. 컨설팅비 100만원으로 기업분석과 AX 실행설계를 먼저 진행하고, 필요한 구현 수준을 정한 뒤 본개발로 이어집니다.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-[0.75rem] font-black uppercase tracking-wide text-blue-600">시작</p>
              <p className="mt-2 text-[1.15rem] font-black text-slate-900">컨설팅비 {man(CONSULTING_FEE)}</p>
              <p className="mt-1.5 text-[0.86rem] leading-snug text-slate-500">기업분석 · 자금전략 · AX 실행설계(1단계)</p>
            </div>
            <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 text-center">
              <p className="text-[0.75rem] font-black uppercase tracking-wide text-blue-600">본개발</p>
              <p className="mt-2 text-[1.15rem] font-black text-slate-900">1~4단계 개발 선택</p>
              <p className="mt-1.5 text-[0.86rem] leading-snug text-slate-500">500 · 1,000 · 1,500만원 · 구현 수준별 공개가</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-[0.75rem] font-black uppercase tracking-wide text-slate-400">확장</p>
              <p className="mt-2 text-[1.15rem] font-black text-slate-900">5단계 별도견적</p>
              <p className="mt-1.5 text-[0.86rem] leading-snug text-slate-500">상용화·고도화는 4단계 이후 별도 진행</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 컨설팅비 100만원 및 1단계 범위 ──────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>1단계 · 컨설팅</p>
          <h2 className={bigHead}>컨설팅비 <span className="text-blue-600">{man(CONSULTING_FEE)}</span>으로<br />시작하는 1단계 범위</h2>
          <div className="mt-8">
            <Block n="1" title={level1.name}>
              <div className="rounded-2xl border-2 border-blue-100 bg-white p-5">
                <p className="text-[1.4rem] font-black tracking-tight text-blue-700 sm:text-[1.6rem]">{level1.priceLabel}</p>
                <p className="mt-1 text-[0.9rem] font-bold text-slate-500">{levelTotalLabel(level1)}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{level1.short}</p>
                <p className="mt-2 text-[0.9rem] font-semibold text-slate-700">{level1.customer}</p>
              </div>
              <p className="mt-5 text-[0.72rem] font-black uppercase tracking-wide text-teal-600">1단계 포함</p>
              <div className="mt-2">
                <IncludedList items={level1.included} />
              </div>
              <p className="mt-5 text-[0.72rem] font-black uppercase tracking-wide text-slate-400">1단계 제외</p>
              <div className="mt-2">
                <ExcludedList items={level1.excluded} />
              </div>
              {level1.note && (
                <p className="mt-4 rounded-2xl bg-blue-50/70 px-4 py-3 text-[0.85rem] leading-relaxed text-blue-800">{level1.note}</p>
              )}
            </Block>
            <div className="mt-4 space-y-2">
              <Notice>{PROGRAM_NOTICES.consultingFee}</Notice>
              <Notice>{PROGRAM_NOTICES.consultingRefund}</Notice>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 1~4단계 구현수준 (선택형) ──────────────────────────────── */}
      <section id="build-levels" className={`scroll-mt-16 bg-white ${band}`}>
        <div className="mx-auto max-w-6xl">
          <p className={kicker}>구현 수준</p>
          <h2 className={bigHead}>1~4단계 구현수준을<br /><span className="text-blue-600">골라서 확인하세요</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1rem] leading-relaxed text-slate-600">
            단계가 올라갈수록 실제로 작동하는 범위가 넓어집니다. 5단계 이후는 별도 견적입니다.
          </p>

          {/* 모바일/태블릿: 탭 + 단일 카드 */}
          <div className="mt-8 lg:hidden">
            <div role="tablist" aria-label="구현 단계 선택" className="grid grid-cols-4 gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
              {DEV_LEVELS.map((l) => {
                const on = level === l.key
                return (
                  <button
                    key={l.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setLevel(l.key as LevelTabKey)}
                    className={`relative rounded-xl px-2 py-2.5 text-center text-[0.86rem] font-black transition ${
                      on ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-white'
                    }`}
                  >
                    {l.key}단계
                    {l.recommended && <span className="ml-0.5 align-super text-[0.6rem] text-teal-400" aria-hidden>★</span>}
                  </button>
                )
              })}
            </div>
            <div className="mt-5">
              <LevelCard l={activeLevel} />
            </div>
          </div>

          {/* 데스크톱: 4-up */}
          <div className="mt-9 hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-4">
            {DEV_LEVELS.map((l) => (
              <div key={l.key} id={`level-${l.key}`} className="scroll-mt-16">
                <LevelCard l={l} />
              </div>
            ))}
          </div>

          {/* 5단계 (별도견적) — 항상 별도로 표시 */}
          <div id="level-5" className="mt-4 scroll-mt-16">
            <LevelCard l={LEVEL_5} />
          </div>
        </div>
      </section>

      {/* ── 5. 500·1,000·1,500만원 가격표 ─────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>구현 수준별 가격</p>
          <h2 className={bigHead}>500 · 1,000 · 1,500만원<br /><span className="text-blue-600">공개 가격표</span></h2>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[0.78rem] font-black uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">단계</th>
                  <th className="px-4 py-3">개발비</th>
                  <th className="px-4 py-3">총액(컨설팅 포함)</th>
                </tr>
              </thead>
              <tbody>
                {BUILD_LEVELS.map((l) => (
                  <tr
                    key={l.key}
                    className={`border-b border-slate-100 last:border-0 ${l.recommended ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="px-4 py-3.5 align-top">
                      <span className="block text-[0.92rem] font-black leading-snug text-slate-900">{l.name}</span>
                      {l.recommended && (
                        <span className="mt-1 inline-flex rounded-md bg-blue-600 px-2 py-0.5 text-[0.68rem] font-black text-white">권장 최종 목표</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[0.9rem] font-bold text-slate-700">{l.priceLabel}</td>
                    <td className="px-4 py-3.5 align-top text-[0.9rem] font-black text-blue-700">{levelTotalLabel(l)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-2">
            <Notice>{PROGRAM_NOTICES.devSeparate}</Notice>
            <Notice>{PROGRAM_NOTICES.vat}</Notice>
          </div>
        </div>
      </section>

      {/* ── 6. 4단계 권장 이유 ────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>권장 이유</p>
          <h2 className={bigHead}>왜 4단계를<br /><span className="text-blue-600">최종 목표로 권장하나요?</span></h2>
          <div className="mt-8 space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[0.82rem] font-black text-slate-500">2단계</p>
              <p className="mt-1 text-[0.98rem] font-bold leading-snug text-slate-800">클릭하며 사업 흐름을 설명할 수 있는 수준입니다.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[0.82rem] font-black text-slate-500">3단계</p>
              <p className="mt-1 text-[0.98rem] font-bold leading-snug text-slate-800">로그인하고 데이터를 저장하며 핵심 업무 하나를 실제로 시험할 수 있습니다.</p>
            </div>
            <div className="rounded-3xl border-2 border-blue-500 bg-blue-50/50 p-5">
              <div className="flex items-center gap-2">
                <p className="text-[0.82rem] font-black text-blue-600">4단계</p>
                <span className="inline-flex rounded-md bg-blue-600 px-2 py-0.5 text-[0.68rem] font-black text-white">권장 최종 목표</span>
              </div>
              <p className="mt-1 text-[0.98rem] font-bold leading-snug text-slate-900">
                직원이 실제로 사용하고, 권한·관리자·복수 업무·보고까지 다뤄 실행 준비도를 가장 구체적으로 설명할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Notice tone="amber">4단계 구축이 자금승인이나 특정 지원금액을 보장하지는 않습니다.</Notice>
          </div>
        </div>
      </section>

      {/* ── 7. 자금조달 전후 진행방식 ─────────────────────────────────── */}
      <section className={`bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-teal-300">진행 방식</p>
          <h2 className="mt-2.5 text-center text-[1.75rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2.4rem]">
            자금조달 전후,<br /><span className="text-teal-300">이렇게 진행합니다</span>
          </h2>
          <ol className="mt-8 space-y-3">
            {FUNDING_STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-400 text-[0.85rem] font-black text-slate-900">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[1rem] font-black leading-snug text-white">{s.t}</p>
                  <p className="mt-0.5 text-[0.88rem] leading-relaxed text-slate-300">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 max-w-lg rounded-2xl bg-teal-400/10 p-4 text-center text-[0.95rem] font-bold leading-relaxed text-teal-100 ring-1 ring-teal-400/20">
            본개발비는 자금조달 후 선택한 구현 수준에 따라 정산합니다.
          </p>
          <div className="mx-auto mt-4 max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[0.9rem] font-black text-white">자금조달 전에 먼저 구축할 수도 있나요?</p>
            <p className="mt-1 text-[0.86rem] leading-relaxed text-slate-300">
              네, 선개발도 가능합니다. 이 경우 자금조달과 별개의 개발계약으로 진행합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. 결과물 ─────────────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>결과물</p>
          <h2 className={bigHead}>프로그램을 통해<br /><span className="text-blue-600">받게 되는 결과물</span></h2>
          <div className="mt-8">
            <Block n="8" title="실제 제공 결과물">
              <IncludedList
                mark="◆"
                items={[
                  '기업진단·자금전략 요약과 목표 정책자금·신청기관 검토',
                  'AX 실행설계: 적용업무 선정 · 사용자 구분 · 업무 흐름도 · 핵심 기능·화면 목록',
                  '방향 확인용 주요 화면 초안(1단계) → 선택 단계에 따라 시연형 프로토타입·작동형 MVP',
                  '자금기관 설명자료 기본 구조',
                  '서비스 구조 연계 국내 특허출원 준비 1건 (2단계 이상)',
                  '선택 단계별 배포 URL · 수정 횟수 · 4단계 납품 후 기본 오류보수 30일',
                ]}
              />
              <p className="mt-4 text-[0.85rem] leading-relaxed text-slate-500">
                실제 제공 범위는 선택한 구현 수준(1~4단계)에 따라 달라지며, 자세한 내용은 위 구현 수준 표를 확인하세요.
              </p>
            </Block>
          </div>
        </div>
      </section>

      {/* ── 9. 포함·제외 범위 (단계별 요약) ───────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>포함·제외 범위</p>
          <h2 className={bigHead}>단계별 포함·제외<br /><span className="text-blue-600">한눈에 보기</span></h2>
          <div className="mt-8 space-y-3">
            {BUILD_LEVELS.map((l) => (
              <details key={l.key} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-[1rem] font-black text-slate-900 marker:content-['']">
                  <span className="flex items-center gap-2">
                    {l.name}
                    {l.recommended && <span className="inline-flex rounded-md bg-blue-600 px-2 py-0.5 text-[0.66rem] font-black text-white">권장</span>}
                  </span>
                  <span className="ml-3 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-black uppercase tracking-wide text-teal-600">포함</p>
                    <div className="mt-2">
                      <IncludedList items={l.included} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-black uppercase tracking-wide text-slate-400">제외 또는 별도</p>
                    <div className="mt-2">
                      {l.excluded.length > 0 ? (
                        <ExcludedList items={l.excluded} />
                      ) : (
                        <p className="text-[0.88rem] leading-snug text-slate-500">이 단계 자체가 상용화·고도화(별도 견적) 범위입니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-4">
            <Notice>구현단계 기본범위를 초과하는 기능과 외부연동은 별도 견적입니다.</Notice>
          </div>
        </div>
      </section>

      {/* ── 10. 특허출원 연계 ─────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>특허출원 연계</p>
          <h2 className={bigHead}>서비스 구조와 연계한<br /><span className="text-blue-600">특허출원 준비</span></h2>
          <div className="mt-8 rounded-3xl border-2 border-blue-100 bg-blue-50/50 p-6 text-center">
            <p className="text-[1.05rem] font-black leading-relaxed text-slate-900">
              2단계 이상 선택 시 서비스 구조와 연계한 국내 특허출원 준비 1건을 포함합니다.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Notice>{PROGRAM_NOTICES.patent}</Notice>
            <Notice>벤처기업 혁신성장유형은 기본 포함이 아니며, 성장 모듈(옵션)로 별도 안내합니다.</Notice>
          </div>
        </div>
      </section>

      {/* ── 11. 일반 분리발주 방식 비교 ───────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className="mx-auto max-w-5xl">
          <p className={kicker}>진행 방식 비교</p>
          <h2 className={bigHead}>일반 분리발주 vs<br /><span className="text-blue-600">미래AI랩 런칭 프로그램</span></h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {/* 좌: 일반 분리발주 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-[0.8rem] font-black uppercase tracking-wide text-slate-400">일반적인 분리발주 방식</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  '자금컨설팅과 개발을 각각 따로 발주',
                  '같은 자료를 컨설팅사·개발사에 다시 전달',
                  '진행 중 견적이 바뀔 수 있음',
                  '맞춤 시스템 비용이 수천만원까지 확대될 수 있음',
                  '착수금·중도금 구조',
                  '특허는 별도 업체와 다시 협의',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[0.92rem] leading-snug text-slate-500">
                    <span className="mt-0.5 shrink-0 text-slate-400" aria-hidden>—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 우: 미래AI랩 */}
            <div className="relative rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-sm">
              <span className="absolute -top-3 left-6 inline-flex rounded-full bg-blue-600 px-3 py-1 text-[0.72rem] font-black text-white shadow-sm">
                초기 레퍼런스 런칭 가격
              </span>
              <p className="mt-1 text-[0.8rem] font-black uppercase tracking-wide text-blue-600">미래AI랩 런칭 프로그램</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  '자금 컨설턴트와 개발 담당자가 같은 프로젝트로 참여',
                  `컨설팅비 ${man(CONSULTING_FEE)}으로 시작`,
                  '자금전략과 AX 실행설계를 먼저 진행',
                  '본개발비는 자금조달 후 정산',
                  '단계별 500 · 1,000 · 1,500만원 가격 공개',
                  '포함·제외 범위를 사전 확인',
                  '특허를 서비스 구조와 함께 설계',
                  '4단계 이후 고도화는 별도 진행',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[0.92rem] font-semibold leading-snug text-slate-700">
                    <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Notice>구현단계 기본범위를 초과하는 기능과 외부연동은 별도 견적입니다.</Notice>
          </div>
        </div>
      </section>

      {/* ── 12. 단계별 검수와 정산 원칙 ───────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>검수·정산</p>
          <h2 className={bigHead}>단계별 검수와<br /><span className="text-blue-600">정산 원칙</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1rem] leading-relaxed text-slate-600">
            본개발은 아래 네 시점의 검수와 고객 승인을 거쳐 진행합니다.
          </p>
          <div className="mt-8 space-y-3">
            {MILESTONES.map((m) => (
              <div key={m.pct} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-900 text-[1rem] font-black text-teal-300">{m.pct}</span>
                <div className="min-w-0">
                  <p className="text-[1rem] font-black leading-snug text-slate-900">{m.label}</p>
                  <p className="mt-0.5 text-[0.86rem] leading-relaxed text-slate-500">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <Notice>{PROGRAM_NOTICES.settlement}</Notice>
            <Notice>
              고객 귀책으로 중단되는 경우 완료·승인된 단계까지 정산하며, 기관의 부결과 고객의 임의취소는 동일하게 취급하지 않습니다. 세부 조건은 개별 계약서에서 확정합니다.
            </Notice>
          </div>
        </div>
      </section>

      {/* ── 13. 2026 AX 정책환경 ──────────────────────────────────────── */}
      <section className={`bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-teal-300">2026 AX 정책환경</p>
          <h2 className="mt-2.5 text-center text-[1.6rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2rem]">
            2026년 정책자금, AX에 우대 흐름
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {POLICY_FACTS.map((f) => (
              <div key={f.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center">
                <p className="text-[1.5rem] font-black tracking-tight text-teal-300 sm:text-[1.75rem]">{f.value}</p>
                <p className="mt-1.5 text-[0.9rem] font-semibold text-slate-300">{f.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-lg text-center text-[0.82rem] font-semibold text-slate-400">
            출처: 중소벤처기업부 2026년 중소기업 정책자금 공급계획
          </p>
          <p className="mx-auto mt-5 max-w-lg rounded-2xl bg-white/5 p-4 text-center text-[0.82rem] leading-relaxed text-slate-400 ring-1 ring-white/10">
            위 우대사항은 AX 스프린트 우대트랙의 대상과 심사기준을 충족한 기업에 적용됩니다. 모든 정책자금에 AX 가점이 자동 적용되는 것은 아닙니다. AX 화면이나 MVP가 자금승인을 보장하지 않습니다.
          </p>
        </div>
      </section>

      {/* ── 14. 현재 진행 프로젝트 ────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>현재 진행 현황</p>
          <h2 className={bigHead}>초기 레퍼런스<br /><span className="text-blue-600">프로젝트 진행 중</span></h2>
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
            <p className="text-[0.95rem] font-bold text-slate-500">2026년 7월 24일 기준</p>
            <p className="mt-1 text-[1.2rem] font-black leading-snug text-slate-900">
              <span className="text-blue-600">3개 기업</span> 진행 중
            </p>
            <div className="mt-4 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-3 w-3 rounded-full bg-blue-500" aria-hidden />
              ))}
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-lg">
            <Notice>현재 진행 단계의 프로젝트이며 자금승인 완료 사례를 의미하지 않습니다.</Notice>
          </div>
        </div>
      </section>

      {/* ── 15. 성장 모듈 연결 ────────────────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>성장 모듈 연결</p>
          <h2 className={bigHead}>자금조달 이후,<br /><span className="text-blue-600">성장 모듈로 이어집니다</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1rem] leading-relaxed text-slate-600">
            벤처확인·기업부설연구소 등 성장에 필요한 모듈은 서비스몰에서 함께 확인할 수 있습니다. 자동 포함이 아니며, 기업진단 후 필요한 기업에만 제안합니다.
          </p>
          <div className="mt-7 text-center">
            <Link to="/business-services#growth-modules" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-[0.95rem] font-bold text-slate-700 transition-colors hover:bg-slate-100">
              성장 모듈 보러가기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 16. FAQ ────────────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>자주 묻는 질문</p>
          <h2 className={bigHead}>AX 사업화·자금조달 FAQ</h2>
          <div className="mt-9 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-[1.1rem] font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-[1rem] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 17. 진단/상담 CTA ──────────────────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div ref={finalCtaRef} className="mx-auto max-w-[560px] rounded-3xl bg-slate-900 p-7 text-center shadow-xl sm:p-9">
          <p className="text-sm font-black uppercase tracking-widest text-teal-300">진단 후 시작하세요</p>
          <h2 className="mt-3 text-[1.6rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2rem]">우리 회사에 맞는 방식부터<br />확인해 보세요</h2>
          <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-slate-300">
            3분 기업진단으로 현재 상황을 정리하고, <b className="text-white">{FLAGSHIP.name}</b> 상담으로 이어갈 수 있습니다.
          </p>
          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
            <Link to="/business-diagnosis" className="flex items-center justify-center rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              3분 기업진단 시작하기
            </Link>
            <button type="button" onClick={() => setConsult(true)} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
              {FLAGSHIP.name} 상담 신청
            </button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-slate-400">
            승인을 보장하지 않으며 기업별 결과는 기관 심사와 기업 조건에 따라 달라집니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter
        topSlot={
          <Link to="/business-services" className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
            ← 서비스몰 홈으로
          </Link>
        }
      />

      {/* Mobile sticky CTA — 최종 CTA 노출 시 자동 숨김 */}
      {showBar && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.92rem] font-black text-slate-900">{FLAGSHIP.name}</span>
            <span className="block truncate text-xs font-medium text-slate-500">3분 기업진단으로 시작하세요</span>
          </span>
          <Link to="/business-diagnosis" className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[0.95rem] font-bold text-white">
            3분 기업진단
          </Link>
        </div>
      )}

      <ConsultModal
        open={consult}
        onClose={() => setConsult(false)}
        source="AX 사업화·자금조달 프로그램"
        heading="AX 사업화·자금조달 프로그램 상담 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
        preselectProduct="정책자금 컨설팅"
        showContactMethod
        showCompanyFields
        programSelect
        preselectProgram={FLAGSHIP.consultName}
        contextRows={[{ label: '관심 프로그램', value: FLAGSHIP.consultName }] as ConsultContextRow[]}
      />
    </div>
  )
}
