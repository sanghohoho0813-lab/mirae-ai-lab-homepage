// 정책자금 컨설팅 — 전용 상세페이지 (A·B 프로그램 상세).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 역할: "정책자금 실행 + 업종 맞춤 AX 실행근거"를 A형(자금조달 실행형)·B형(AX 결합 성장자금형)으로
//        전환 탭을 통해 비교·선택하게 하고, 무료 3분 기업진단 또는 프로그램별 상담으로 연결합니다.
// 가격·수수료는 corePrograms.ts(MAIN_PROGRAMS A·B / AX_LAUNCH) 단일 출처만 참조 — 페이지 내 별도 하드코딩 금지.
// 허위 정상가·과장 할인율 금지, 승인·조달금액 보장 표현 금지. 승인/성공 사례를 사실처럼 단정하지 않음.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import ConsultModal from '../../components/ConsultModal'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../../lib/consultApi'
import { getMainProgram, AX_LAUNCH } from '../../data/corePrograms'

type ProgKey = 'A' | 'B'

const band = 'px-5 py-12 sm:py-16'
const inner = 'mx-auto max-w-[760px]'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-2.5 text-center text-[1.75rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[2.4rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── 프로그램별 추가 콘텐츠(가격 외) — 목표 규모·결과물·절차·필수 고지 ─────────────
// 가격 문자열은 전부 MAIN_PROGRAMS(getMainProgram)에서 가져오며, 여기에는 금액을 중복 표기하지 않습니다.
const EXTRA: Record<ProgKey, {
  goalCaption: string
  goalValue: string
  goalNotes: string[]
  whyLead: string
  deliverables: string[]
  process: { label: string; desc: string }[]
  notices: string[]
}> = {
  A: {
    goalCaption: '권장 목표 규모',
    goalValue: '최대 1억원',
    goalNotes: ['최대 1억원은 권장 목표 규모이며 승인금액 또는 지원한도를 보장하는 의미가 아닙니다.'],
    whyLead:
      '정책자금 심사는 서류만이 아니라 실제로 실행할 준비가 되어 있는지를 봅니다. 사업계획서만으로 설명이 부족한 부분을, 업종에 맞춘 화면과 업무 흐름도 같은 실행근거로 함께 정리해 눈으로 확인할 수 있게 만듭니다.',
    deliverables: [
      '자금조달 진단 결과 요약',
      '기관 및 자금 종류 선정안',
      '신청 전략 · 사업계획 구조화',
      '신청 서류 및 보완 대응 자료',
      '예상 질의 대응 자료',
      '업무 흐름도 또는 서비스 구조도',
      '핵심 화면 3~5개 클릭형 프로토타입 (수정 1회)',
    ],
    process: [
      { label: '자금조달 진단', desc: '기업·재무 현황을 확인하고 가능한 자금 방향을 정리합니다.' },
      { label: '기관·자금 종류 선정 및 신청 전략', desc: '우선 검토 기관과 신청 순서를 설계합니다.' },
      { label: '사업계획 구조화 · 서류 준비', desc: '심사에서 설명할 내용을 문서로 정리합니다.' },
      { label: '업종 맞춤 AX 실행설계 · 클릭형 프로토타입', desc: '실행근거가 되는 화면·흐름도를 준비합니다.' },
      { label: '신청 · 보완 대응 · 예상 질의 대응', desc: '접수 이후 보완 요청과 질의에 함께 대응합니다.' },
    ],
    notices: [
      '클릭형 프로토타입은 실제 앱 전체 개발이 아니라, 사업 구조와 실행 계획을 확인 가능한 화면으로 정리한 결과물입니다.',
      '자금조달 목표와 결과는 기업별 조건과 기관 심사에 따라 달라지며 승인과 금액을 보장하지 않습니다.',
    ],
  },
  B: {
    goalCaption: '권장 목표 규모',
    goalValue: '1억원 이상',
    goalNotes: ['특히 2억원 이상의 자금조달과 업무시스템 구축을 함께 검토하는 성장기업에 적합합니다.'],
    whyLead:
      '자금조달과 함께 실제 업무에서 작동하는 시스템을 만듭니다. 심사에서는 사업화 구조와 실행 준비도를 구체적으로 설명하고, 자금조달 이후에는 그대로 실제 업무에 사용합니다.',
    deliverables: [
      'A형 자금조달 실행 전체 결과물',
      '업무 인터뷰 · 요구사항 정의',
      'PC·모바일 화면설계',
      '로그인 · 사용자 권한 · 데이터베이스 · 관리자 화면',
      '핵심 업무 흐름 1개 작동형 AX MVP',
      '테스트 · 기본 운영안내 · 초기 개선',
      '자금기관 설명자료',
    ],
    process: [
      { label: '적합성 신청 및 내부 검토', desc: '신청 즉시 결제되지 않습니다. 적합성을 먼저 검토합니다.' },
      { label: '참여 승인 · 착수금 결제', desc: '참여가 확정되면 착수금 결제 후 프로젝트를 시작합니다.' },
      { label: '업무 인터뷰 · 요구사항 정의 · 화면설계', desc: '실제 업무를 분석해 시스템 범위를 확정합니다.' },
      { label: '핵심 업무 흐름 AX MVP 구축', desc: '작동형 MVP를 만들고 대표·담당자가 테스트합니다.' },
      { label: '테스트 · 기본 운영안내 · 초기 개선', desc: '실제 업무 적용을 위한 초기 개선을 진행합니다.' },
    ],
    notices: [
      'AX MVP는 자금 승인을 보장하는 수단이 아니라, 사업화 구조와 실행 준비도를 구체적으로 설명하고 자금조달 이후 실제 업무에 활용하기 위한 결과물입니다.',
    ],
  },
}

// ── FAQ — 실제 구매 결정에 필요한 질문만(가격 수치 중복 표기 없이 비용 섹션 참조) ──
const faqs = [
  {
    q: 'A형과 B형은 어떻게 다른가요?',
    a: 'A형(자금조달 실행형)은 정책자금 실행에 업종 맞춤 AX 실행근거(업무 흐름도·클릭형 프로토타입)를 더해 준비하는 방식입니다. B형(AX 결합 성장자금형)은 여기에 실제 업무에서 작동하는 AX MVP 구축까지 함께 진행하며, 통상 1억원 이상 조달을 검토하는 성장기업에 권장합니다.',
  },
  {
    q: '최대 1억원 / 1억원 이상이면 그만큼 받을 수 있나요?',
    a: '아니요. 권장 목표 규모일 뿐 승인금액이나 지원한도를 보장하지 않습니다. 실제 승인 여부와 금액은 기관 심사와 기업의 재무·신용·업종 상황에 따라 달라집니다.',
  },
  {
    q: '착수금 외에 성과보수는 언제 발생하나요?',
    a: '착수금 이후 실제로 자금이 조달된 경우에만 조달금액의 일정 비율로 발생하며, 세부 요율과 상한은 각 프로그램의 비용 섹션에 표시됩니다. 성과보수의 세부 산정 기준과 지급 시점은 개별 계약서에서 확정합니다.',
  },
  {
    q: 'A형의 클릭형 프로토타입은 완성된 앱인가요?',
    a: '아니요. 클릭형 프로토타입은 실제 앱 전체 개발이 아니라, 사업 구조와 실행 계획을 확인 가능한 화면으로 정리한 결과물입니다. 로그인·데이터베이스·결제 등 실제 운영 기능은 B형에서 다룹니다.',
  },
  {
    q: 'B형 초기 레퍼런스 10개사는 무엇인가요?',
    a: 'AX 결합 성장자금형을 초기 참여 조건으로 진행하는 최대 10개 기업입니다. 적합성 검토와 계약 확정이 완료된 순서로 선정하며, 신청 즉시 결제되지 않습니다.',
  },
  {
    q: '승인을 보장하나요?',
    a: '승인을 보장하지 않으며 기업별 결과는 기관 심사와 기업 조건에 따라 달라집니다. 저희는 승인 가능성을 높이기 위해 실행 준비도와 설명력을 보완합니다.',
  },
]

// 프로그램 상세 블록(3~9) 공통 카드 래퍼
function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
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
  const [prog, setProg] = useState<ProgKey>(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase() === '#program-b') return 'B'
    return 'A' // #program-a 또는 해시 없음 → A
  })
  const [showBar, setShowBar] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [consult, setConsult] = useState<{ open: boolean; plan: string | null }>({ open: false, plan: null })
  const rootRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const openConsult = (plan: string | null = null) => setConsult({ open: true, plan })

  // 같은 페이지에 머문 상태에서 해시(#program-a/#program-b)가 바뀌어도 탭이 따라가도록 동기화
  useEffect(() => {
    const h = location.hash.toLowerCase()
    if (h === '#program-b') setProg('B')
    else if (h === '#program-a') setProg('A')
  }, [location.hash])

  const p = getMainProgram(prog)
  const x = EXTRA[prog]

  // 탭 전환 — 해시를 갱신하되 스크롤 점프는 만들지 않음(replaceState)
  function selectProgram(key: ProgKey) {
    setProg(key)
    const hash = key === 'A' ? '#program-a' : '#program-b'
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', hash)
    }
  }

  useEffect(() => {
    document.title = '정책자금 컨설팅 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

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
          <span className="font-semibold text-slate-700">정책자금 컨설팅</span>
        </div>
      </div>

      {/* ── 1. 상세 Hero (navy) ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
            정책자금 실행 + 업종 맞춤 AX
          </span>
          <h1 className="mt-5 text-[1.9rem] font-black leading-[1.25] tracking-tight text-white sm:text-[2.9rem] sm:leading-[1.15]">
            정책자금 실행과<br /><span className="text-teal-300">업종 맞춤 AX 실행근거</span>를<br />함께 준비합니다
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[1.02rem] leading-relaxed text-slate-300 sm:text-lg">
            사업계획서만으로 부족한 부분을, 업종에 맞춘 화면과 실제 작동하는 시스템으로 함께 준비합니다. 필요한 범위에 따라 <b className="text-white">A형과 B형</b> 중에서 선택하세요.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/business-diagnosis" className="flex items-center justify-center rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              3분 기업진단 시작하기
            </Link>
            <button type="button" onClick={() => scrollToId('programs')} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
              A·B 프로그램 보기
            </button>
          </div>
          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-slate-500">
            승인을 보장하지 않으며 기업별 결과는 기관 심사와 기업 조건에 따라 달라집니다.
          </p>
        </div>
      </section>

      {/* ── 2. A·B 프로그램 전환 탭 + 선택 프로그램 상세(3~9) ───────────── */}
      <section id="programs" className={`scroll-mt-16 bg-slate-50 ${band}`}>
        <span id="program-a" aria-hidden className="block h-0 scroll-mt-24" />
        <span id="program-b" aria-hidden className="block h-0 scroll-mt-24" />
        <div className="mx-auto max-w-[820px]">
          <p className={kicker}>A · B 프로그램</p>
          <h2 className={bigHead}>필요한 범위에 따라<br /><span className="text-blue-600">A형과 B형 중에서 선택하세요</span></h2>

          {/* 세그먼트 컨트롤 */}
          <div role="tablist" aria-label="프로그램 선택" className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {(['A', 'B'] as const).map((k) => {
              const on = prog === k
              const label = k === 'A' ? 'A. 자금조달 실행형' : 'B. AX 결합 성장자금형'
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => selectProgram(k)}
                  className={`rounded-xl px-3 py-3 text-center text-[0.9rem] font-black leading-snug transition sm:text-[0.98rem] ${
                    on ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* 선택 프로그램 요약 */}
          <div className="mx-auto mt-5 max-w-lg text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[0.78rem] font-black text-blue-700 ring-1 ring-inset ring-blue-100">{p.badge}</span>
            <p className="mt-3 text-[1rem] leading-relaxed text-slate-600">{p.tagline}</p>
            <p className="mt-1.5 text-[0.9rem] font-bold text-slate-500">{p.purpose}</p>
          </div>

          {/* 상세 블록 3~9 + 필수 고지 */}
          <div className="mt-8 space-y-4">
            {/* 3. 추천 대상 및 목표 규모 */}
            <Block n={3} title="추천 대상 및 목표 규모">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-[0.8rem] font-black uppercase tracking-wide text-blue-600">추천 대상</p>
                  <ul className="mt-3 space-y-2">
                    {p.recommend.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-700">
                        <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5">
                  <p className="text-[0.8rem] font-black uppercase tracking-wide text-teal-300">{x.goalCaption}</p>
                  <p className="mt-2 text-[1.6rem] font-black tracking-tight text-white sm:text-3xl">{x.goalValue}</p>
                  <div className="mt-3 space-y-1.5">
                    {x.goalNotes.map((n) => (
                      <p key={n} className="text-[0.8rem] leading-relaxed text-slate-400">{n}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Block>

            {/* 4. 왜 AX 실행근거를 함께 준비하는지 */}
            <Block n={4} title="왜 AX 실행근거를 함께 준비하는지">
              <p className="text-[1rem] leading-relaxed text-slate-600">{x.whyLead}</p>
              {p.axNote && (
                <p className="mt-3 rounded-2xl bg-blue-50 px-4 py-3 text-[0.9rem] leading-relaxed text-blue-800">{p.axNote}</p>
              )}
              <p className="mt-3 text-[0.95rem] font-bold leading-relaxed text-slate-800">
                승인 가능성을 높이기 위해 실행 준비도와 설명력을 보완합니다.
              </p>
            </Block>

            {/* 5. 실제 제공 결과물 */}
            <Block n={5} title="실제 제공 결과물">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[0.78rem] font-black text-teal-700 ring-1 ring-inset ring-teal-200">
                결과물 수준 · {p.levelLabel}
              </div>
              <ul className="grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
                {x.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-700">
                    <span className="mt-0.5 shrink-0 font-black text-teal-500" aria-hidden>◆</span>{d}
                  </li>
                ))}
              </ul>
            </Block>

            {/* 6. 포함 범위 */}
            <Block n={6} title="포함 범위">
              <ul className="space-y-2.5">
                {p.included.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[0.95rem] font-semibold leading-snug text-slate-700">
                    <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>{it}
                  </li>
                ))}
              </ul>
            </Block>

            {/* 7. 제외 및 별도 개발 범위 */}
            <Block n={7} title="제외 및 별도 개발 범위">
              <p className="text-[0.85rem] font-bold text-slate-500">{p.excludedLabel}</p>
              <ul className="mt-3 space-y-2.5">
                {p.excluded.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-slate-500">
                    <span className="mt-0.5 shrink-0 text-slate-400" aria-hidden>—</span>{it}
                  </li>
                ))}
              </ul>
            </Block>

            {/* 8. 진행 절차 */}
            <Block n={8} title="진행 절차">
              <ol className="space-y-3">
                {x.process.map((s, i) => (
                  <li key={s.label} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-[0.8rem] font-black text-white">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-[0.98rem] font-black leading-snug text-slate-900">{s.label}</p>
                      <p className="mt-0.5 text-[0.88rem] leading-relaxed text-slate-500">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {prog === 'B' && (
                <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[0.85rem] font-bold text-slate-700">진행 순서: {AX_LAUNCH.flow}</p>
                  <p className="mt-1 text-[0.82rem] leading-relaxed text-slate-500">{AX_LAUNCH.selection}</p>
                </div>
              )}
            </Block>

            {/* 9. 비용 */}
            <Block n={9} title="비용">
              <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/50 p-5">
                {p.priceTop && <p className="text-[0.82rem] font-semibold text-slate-500">{p.priceTop}</p>}
                <p className="mt-1 text-[1.5rem] font-black tracking-tight text-blue-700 sm:text-[1.75rem]">{p.priceMain}</p>
                <p className="mt-1.5 text-[0.95rem] font-bold text-slate-700">{p.priceSub}</p>
              </div>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-500">{AX_LAUNCH.feeNote}</p>
            </Block>

            {/* 필수 고지 (프로그램별) */}
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-[0.82rem] font-black uppercase tracking-wide text-amber-700">필수 고지</p>
              <ul className="mt-3 space-y-2">
                {x.notices.map((n) => (
                  <li key={n} className="flex items-start gap-2 text-[0.88rem] leading-relaxed text-amber-900">
                    <span className="mt-0.5 shrink-0" aria-hidden>·</span>{n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. 현재 진행 현황 (승인/성공 사례가 아닌 진행 중 프로젝트 framing) ── */}
      <section className={`bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-teal-300">현재 진행 현황</p>
          <h2 className="mt-2.5 text-center text-[1.6rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2rem]">
            현재 진행 중인 AX 결합 프로젝트
          </h2>
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
            <p className="text-[0.95rem] font-bold text-slate-200">2026년 7월 24일 기준</p>
            <p className="mt-1 text-[1.1rem] font-black leading-snug text-white">
              초기 레퍼런스 10개사 중 <span className="text-teal-300">3개사 진행 중</span>
            </p>
            <div className="mt-4 flex justify-center gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <span key={i} className={`h-3 w-3 rounded-full ${i < 3 ? 'bg-teal-400' : 'bg-white/15'}`} aria-hidden />
              ))}
            </div>
            <p className="mt-2 text-[0.8rem] font-semibold text-slate-400">3 / 10</p>
          </div>
          <p className="mx-auto mt-6 max-w-lg text-center text-[0.98rem] leading-relaxed text-slate-300">
            업종별 AX 화면·프로토타입·MVP와 자금기관 설명자료를 함께 준비하고 있습니다.
          </p>
          <p className="mx-auto mt-5 max-w-lg rounded-2xl bg-white/5 p-4 text-center text-[0.82rem] leading-relaxed text-slate-400 ring-1 ring-white/10">
            현재 진행 단계의 프로젝트이며 승인 완료 사례를 의미하지 않습니다. 확정된 결과와 승인 사례는 실제 증빙을 확보한 순서대로 공개합니다.
          </p>
        </div>
      </section>

      {/* ── 11. 성장 모듈 연결 ─────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>성장 모듈 연결</p>
          <h2 className={bigHead}>자금조달 이후,<br /><span className="text-blue-600">성장 모듈로 이어집니다</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1rem] leading-relaxed text-slate-600">
            벤처확인·기업부설연구소 등 성장에 필요한 모듈은 서비스몰에서 함께 확인할 수 있습니다. 자동 포함이 아니며, 기업진단 후 필요한 기업에만 제안합니다.
          </p>
          <div className="mt-7 text-center">
            <Link to="/business-services#growth-modules" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-[0.95rem] font-bold text-slate-700 transition-colors hover:bg-slate-50">
              성장 모듈 보러가기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 12. FAQ ────────────────────────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>자주 묻는 질문</p>
          <h2 className={bigHead}>정책자금 컨설팅 FAQ</h2>
          <div className="mt-9 space-y-3">
            {faqs.map((f) => (
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

      {/* ── 13. 진단/상담 CTA ──────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div ref={finalCtaRef} className="mx-auto max-w-[560px] rounded-3xl bg-slate-900 p-7 text-center shadow-xl sm:p-9">
          <p className="text-sm font-black uppercase tracking-widest text-teal-300">진단 후 시작하세요</p>
          <h2 className="mt-3 text-[1.6rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2rem]">우리 회사에 맞는 방식부터<br />확인해 보세요</h2>
          <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-slate-300">
            3분 기업진단으로 현재 상황을 정리하고, <b className="text-white">{p.name}</b> 상담으로 이어갈 수 있습니다.
          </p>
          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
            <Link to="/business-diagnosis" className="flex items-center justify-center rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              3분 기업진단 시작하기
            </Link>
            <button type="button" onClick={() => openConsult(p.consultName)} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
              {p.name} 상담 신청
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
            <span className="block truncate text-[0.92rem] font-black text-slate-900">{p.name}</span>
            <span className="block truncate text-xs font-medium text-slate-500">3분 기업진단으로 시작하세요</span>
          </span>
          <Link to="/business-diagnosis" className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[0.95rem] font-bold text-white">
            3분 기업진단
          </Link>
        </div>
      )}

      <ConsultModal
        open={consult.open}
        onClose={() => setConsult({ open: false, plan: null })}
        source="정책자금 컨설팅"
        heading="정책자금·AX 결합 상담 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
        preselectProduct="정책자금 컨설팅"
        showContactMethod
        showCompanyFields
        programSelect
        preselectProgram={consult.plan ?? undefined}
        contextRows={consult.plan ? ([{ label: '관심 프로그램', value: consult.plan }] as ConsultContextRow[]) : []}
      />
    </div>
  )
}
