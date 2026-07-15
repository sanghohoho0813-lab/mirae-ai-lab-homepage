import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import InquiryForm from './components/InquiryForm'
import HeaderAccount from './components/account/HeaderAccount'
import LegalFooter from './components/LegalFooter'
import { accessTypeLabel } from './lib/platform'
import { tools, upcomingTools, type Tool, type ToolStatus } from './data/tools'

// 컨설턴트용 AI 도구 소개 (/consultants). 2차 개편: 13섹션 → 5섹션으로 압축.
// 메시지는 유지하고 중복 섹션만 정리. 도구 썸네일은 브랜드 공통 코드 배너로 통일.

const navItems = [
  { label: '핵심 가치', href: '#value' },
  { label: '도구', href: '#tools' },
  { label: '이용 방식', href: '#pricing' },
  { label: '전자책', href: '#resources' },
  { label: '문의', href: '#inquiry' },
]

// 대표 도구(큰 카드) — 실제 tools 데이터의 id 기준
const FEATURED_TOOL_IDS = ['hr-subsidy-pro', 'labcare-rnd-os', 'corp-sales-os', 'cretop-analyzer']

// 핵심 가치 3 (기존 8개 업무 → 상담 흐름 3축으로 압축)
const values: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: '고객 진단',
    desc: '크레탑·기업 자료를 빠르게 분석해 상담 전에 꺼낼 핵심 포인트를 정리합니다.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    title: '제안서·자료 제작',
    desc: '검토 결과를 고객 앞에서 바로 설명하고 제안할 수 있는 자료로 정리합니다.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4M9 13h6M9 17h6" />
      </svg>
    ),
  },
  {
    title: '반복업무 자동화',
    desc: '계산·문서·사후관리처럼 매번 반복되는 업무를 도구가 대신 처리합니다.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
  },
]

// 이용 방식 3단계 (기존 요금제 3플랜 → 흐름형 3단계로 압축)
const useSteps = [
  { no: '01', title: '도구 선택', desc: '상담 흐름에 맞는 AI 도구를 고릅니다.' },
  { no: '02', title: '무료 체험', desc: '카드 등록 없이, 신청한 시각부터 정확히 7일 체험합니다.' },
  { no: '03', title: '결제 후 계속 사용', desc: '정식 이용은 결제 또는 관리자 승인 후 이어집니다.' },
]

const faqs = [
  {
    q: '7일 체험 후에는 어떻게 되나요?',
    a: '체험이 끝나면 이용이 제한됩니다. 리뷰·설문 참여 시 최대 21일까지 연장할 수 있고, 정식 이용은 결제 또는 관리자 승인 후 제공됩니다.',
  },
  { q: '도구별로 따로 체험할 수 있나요?', a: '네. 각 도구는 신청한 시각부터 개별적으로 7일간 체험할 수 있습니다.' },
  {
    q: '중소기업 대표도 사용할 수 있나요?',
    a: '네. 주로 컨설턴트의 상담·검토·제안 업무를 돕지만, 직접 확인하고 싶은 대표님도 기초 검토용으로 활용할 수 있습니다.',
  },
]

const gridBackground = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)',
} as const

const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const

// 네이비 배너용(어두운 배경) 상태 배지 스타일
const bannerStatusStyles: Record<ToolStatus, string> = {
  'MVP 베타': 'bg-violet-400/15 text-violet-200 ring-1 ring-inset ring-violet-300/25',
  '비공개 검토중': 'bg-rose-400/15 text-rose-200 ring-1 ring-inset ring-rose-300/25',
  개발중: 'bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-300/25',
}

// 브랜드 공통 코드 배너 — 실제 스크린샷 대신 네이비+청록 텍스트 배너로 통일(완성도 편차 제거).
function ToolBanner({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden border-b border-slate-800 bg-slate-900 ${compact ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
      <div aria-hidden className="absolute inset-0 opacity-40" style={gridBackground} />
      <div aria-hidden className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-teal-500/20 blur-2xl" />
      <div aria-hidden className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-blue-600/20 blur-2xl" />
      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        {/* 좌상단 카테고리 — 위치 유지, 글자만 살짝 크게 */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-teal-400/15 px-3 py-1 text-[0.95rem] font-bold text-teal-200 ring-1 ring-inset ring-teal-300/25">
            {tool.category}
          </span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-teal-300/50" aria-hidden>
            <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
            <path d="M3.5 9.5h17M7 20.5h10M12 17.5v3" />
          </svg>
        </div>
        {/* 도구명 — 가운데 정렬 · 크게 */}
        <div className="px-2 text-center">
          <p className="text-[0.95rem] font-medium tracking-wide text-slate-400">{tool.stage}</p>
          <h3 className={`mt-1.5 font-black leading-tight tracking-tight text-white ${compact ? 'text-2xl sm:text-[1.7rem]' : 'text-3xl sm:text-4xl'}`}>{tool.title}</h3>
          {!compact && <p className="mt-2 line-clamp-1 text-[1.05rem] text-slate-300">{tool.outcome}</p>}
        </div>
        {/* 상태 배지 — 가운데 정렬 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[0.85rem] font-bold ${bannerStatusStyles[tool.status]}`}>{tool.status}</span>
          <span
            className={`rounded-full px-2.5 py-1 text-[0.85rem] font-bold ${
              tool.isPublic ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-300/25' : 'bg-slate-400/15 text-slate-300 ring-1 ring-inset ring-slate-300/20'
            }`}
          >
            {tool.isPublic ? '체험 가능' : '공개 준비 중'}
          </span>
        </div>
      </div>
    </div>
  )
}

// 대표 도구 — 큰 카드
function ToolCard({ tool }: { tool: Tool }) {
  const cardClass = 'group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 motion-reduce:transition-none'
  const body = (
    <>
      <ToolBanner tool={tool} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="line-clamp-2 text-[1.05rem] leading-relaxed text-slate-600">{tool.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.features.slice(0, 3).map((feature) => (
            <span key={feature} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[0.9rem] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
              {feature}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[0.9rem] font-medium text-slate-400">추천 대상 · {tool.target}</p>
        <div className="mt-auto pt-4">
          <p className="line-clamp-1 rounded-xl bg-blue-50 px-4 py-3 text-[1rem] font-semibold text-blue-700">“{tool.valueLine}”</p>
          {tool.isPublic ? (
            <span className="mt-3.5 inline-flex items-center gap-1.5 text-[1.05rem] font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              {accessTypeLabel[tool.accessType]}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </span>
          ) : (
            <button type="button" disabled className="mt-3.5 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2.5 text-[1rem] font-semibold text-slate-400">
              🔒 {accessTypeLabel[tool.accessType]}
            </button>
          )}
        </div>
      </div>
    </>
  )
  if (tool.isPublic) {
    return (
      <a href={tool.url} {...externalLinkProps} className={`${cardClass} hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl motion-reduce:hover:translate-y-0`}>
        {body}
      </a>
    )
  }
  return <div className={`${cardClass} opacity-95`}>{body}</div>
}

// 보조 도구 — 작은 카드
function ToolCardSmall({ tool }: { tool: Tool }) {
  const cardClass = 'group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 motion-reduce:transition-none'
  const body = (
    <>
      <ToolBanner tool={tool} compact />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="line-clamp-2 text-[0.98rem] leading-relaxed text-slate-600">{tool.description}</p>
        <div className="mt-auto pt-3.5">
          {tool.isPublic ? (
            <span className="inline-flex items-center gap-1 text-[1rem] font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              {accessTypeLabel[tool.accessType]}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[1rem] font-semibold text-slate-400">🔒 {accessTypeLabel[tool.accessType]}</span>
          )}
        </div>
      </div>
    </>
  )
  if (tool.isPublic) {
    return (
      <a href={tool.url} {...externalLinkProps} className={`${cardClass} hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg motion-reduce:hover:translate-y-0`}>
        {body}
      </a>
    )
  }
  return <div className={`${cardClass} opacity-95`}>{body}</div>
}

function App() {
  const featuredTools = FEATURED_TOOL_IDS.map((id) => tools.find((t) => t.id === id)).filter((t): t is Tool => Boolean(t))
  const secondaryTools = tools.filter((t) => !FEATURED_TOOL_IDS.includes(t.id))
  const liveCount = tools.filter((t) => t.status === 'MVP 베타').length

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label="미래 AI 랩 홈으로">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.85rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-base font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/business-services"
              className="hidden rounded-lg border border-slate-200 px-3 py-2 text-base font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
            >
              대표님용 경영지원
            </Link>
            <HeaderAccount variant="consultant" />
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section id="top" className="relative overflow-hidden bg-slate-950">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={gridBackground} />
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 lg:pb-20 lg:pt-20">
          <div className="max-w-3xl">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                컨설턴트 업무 OS · 정식 출시 전 베타
              </span>

              <h1 className="mt-6 text-[1.9rem] font-extrabold leading-[1.18] tracking-tight text-white sm:text-[2.6rem] lg:text-[3rem]">
                고객 앞에서,
                <br />
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">더 전문가처럼.</span>
              </h1>

              <p className="mt-6 text-lg font-semibold leading-relaxed text-white sm:text-xl">
                놓치는 제안을 줄이고, 계약으로 이어지는 상담을 만들기 위해 직접 만들었습니다.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
                상담·분석·제안·사후관리까지, 흩어진 컨설팅 업무를 하나로 잇는 <span className="font-semibold text-white">컨설턴트 OS</span>. 9년 현장의 방식을 그대로 담았습니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-xl shadow-black/25 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                  7일 체험 시작하기
                </Link>
                <a
                  href="#tools"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  AI 도구 둘러보기
                </a>
              </div>

              {/* 신뢰 스탯 — 제작자 경력을 한 줄로 압축 */}
              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6">
                {[
                  { v: '9년', l: '노무·세무·법무·자금 현장' },
                  { v: `${liveCount}개`, l: '운영 중 실무 도구' },
                  { v: '7일', l: '카드 없이 무료 체험' },
                ].map((s) => (
                  <div key={s.l}>
                    <dd className="text-2xl font-extrabold tracking-tight text-white">{s.v}</dd>
                    <dt className="mt-0.5 text-sm text-slate-400">{s.l}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-slate-400">제가 직접 쓰지 않는 도구는 만들지 않습니다. 현업에서 검증한 도구만 공개합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 핵심 가치 3 */}
      <section id="value" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">핵심 가치</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">상담 흐름을 바꾸는 3가지</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">진단부터 제안, 반복업무 자동화까지. 컨설턴트의 하루를 기준으로 설계했습니다.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <article key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md motion-reduce:hover:translate-y-0 sm:p-7">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-sky-300 [&_svg]:h-6 [&_svg]:w-6">{v.icon}</div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-600">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. 판매 중인 도구 — 대표 도구(큰 카드) + 보조 도구(작은 카드) */}
      <section id="tools" className="scroll-mt-20 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">컨설턴트 OS</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">업무 흐름으로 연결되는 도구</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">각 도구는 따로, 또 같이 작동합니다. 카드를 누르면 실제 서비스가 새 탭에서 열립니다.</p>
          </div>

          {/* 대표 도구 */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* 보조 도구 */}
          {secondaryTools.length > 0 && (
            <>
              <p className="mt-12 text-[0.95rem] font-bold uppercase tracking-widest text-slate-500">진단·보조 도구</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {secondaryTools.map((tool) => (
                  <ToolCardSmall key={tool.id} tool={tool} />
                ))}
              </div>
            </>
          )}

          {/* 곧 추가될 도구 — 로드맵을 카드 대신 칩으로 압축 */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                곧 추가될 도구
              </span>
              {upcomingTools.map((t) => (
                <span key={t.id} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[0.95rem] font-medium text-slate-600">
                  {t.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 이용 방식 3단계 */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-blue-600">이용 방식</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">베타는 지금, 정식은 곧</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">정식 출시 전, 피드백을 주시는 분들께 먼저 열어드립니다. 지금은 베타로 무료 체험할 수 있습니다.</p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {useSteps.map((s, i) => (
            <li key={s.no} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-base font-extrabold tracking-widest text-blue-600">{s.no}</span>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-[1.05rem] leading-relaxed text-slate-600">{s.desc}</p>
              {i < useSteps.length - 1 && (
                <span aria-hidden className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-lg font-bold text-slate-300 sm:block">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
            {['카드 등록 없이 시작', '신청한 시각부터 정확히 7일', '리뷰·설문 참여 시 최대 21일'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="text-emerald-500" aria-hidden>✓</span>
                {t}
              </span>
            ))}
          </div>
          <Link
            to="/signup"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
          >
            지금 무료로 시작
          </Link>
        </div>
      </section>

      {/* 5. FAQ + 전자책 + 문의 */}
      <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-base font-bold uppercase tracking-widest text-blue-600">자주 묻는 질문</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">체험 전, 이것만 확인하세요</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-lg font-bold text-slate-900">Q. {item.q}</p>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>

          {/* 실무 전자책 — 큰 이미지 섹션 → 가로 컴팩트 카드 */}
          <div id="resources" className="mt-10 scroll-mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-[0.9fr_1.1fr]">
            <a
              href="https://futureailab.crekit.io/l/deals/zy3n6rjd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="실무 전자책 자세히 보기 (새 탭에서 열림)"
              className="group block overflow-hidden bg-slate-100"
            >
              <img
                src="/ebook-cover.webp"
                alt="정책자금 · 무상지원금 · 고용지원금 실무 전자책 표지"
                width={1500}
                height={844}
                loading="lazy"
                className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </a>
            <div className="p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">📘 실무 전자책</span>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">정책자금 · 무상지원금 · 고용지원금 실무 가이드</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                대표님들이 가장 많이 묻는 3가지 주제를 중심으로, 상담 현장에서 바로 설명하고 제안에 활용할 수 있는 실무 흐름과 핵심 포인트를 담았습니다.
              </p>
              <a
                href="https://futureailab.crekit.io/l/deals/zy3n6rjd"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700"
              >
                전자책 자세히 보기
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* 문의 — 제작철학·상담 CTA를 인트로 한 줄로 압축 */}
          <div id="inquiry" className="mt-12 scroll-mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base font-bold uppercase tracking-widest text-blue-600">문의</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">업무 자동화 제작 문의</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
                AI는 엔진일 뿐, 주인공은 컨설턴트입니다. 자동화하고 싶은 업무를 남겨주시면 김팀장이 직접 검토해 답해드립니다.
              </p>
            </div>
            <div className="mx-auto mt-8 max-w-3xl">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter
        topSlot={
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <p className="max-w-md text-base leading-relaxed text-slate-500">
              컨설턴트의 상담·분석·제안·사후관리를 하나로 잇는 업무 OS. 대표님의 경영지원과 컨설턴트의 실무를 AI로 연결합니다.
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-base font-medium text-slate-600">
              <Link to="/business-services" className="transition-colors hover:text-slate-900">대표님용 경영지원</Link>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        }
      />
    </div>
  )
}

export default App
