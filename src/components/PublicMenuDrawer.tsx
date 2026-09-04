// 공개 페이지 공용 햄버거 메뉴 — 대표자용/컨설턴트용 variant 분리.
// 공통 shell(overlay·ESC·focus·body scroll lock·safe-area)만 재사용하고, 메뉴·CTA는 variant 로 나눕니다.
// 목차형 구조: 상단 계정 → 대표 CTA → 넘버링·색상 구분 그룹(01~04) → 하단 고정 CTA.
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { getCart, getLikes } from '../lib/savedItems'
import { useAuth } from '../lib/auth'
import { accountEmail, displayName, memberTypeLabel, resolveAvatarUrl } from '../lib/accountDisplay'
import { loginPathWithNext } from '../lib/authRouting'
import Avatar from './account/Avatar'
import BrandLogo from './BrandLogo'
import ConsultModal from './ConsultModal'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'

export type PublicMenuVariant = 'business' | 'consultant'

type MenuAccent = 'blue' | 'cyan' | 'violet' | 'slate'

type MenuItem = {
  label: string
  to: string
  desc?: string
  /** 항목 넘버링 (예: '1') — 상황형 목차 표시용 */
  no?: string
  match?: (path: string) => boolean
  /** 개편 중이라 이동을 막는 항목 — 링크 대신 '업데이트 중' 배지로 표시한다 */
  updating?: boolean
}

type MenuGroup = {
  no: string
  heading: string
  accent: MenuAccent
  items: MenuItem[]
}

type MenuConfig = {
  topTitle: string
  topSub: string
  lead: MenuItem
  groups: MenuGroup[]
  cta: { label: string; to: string }
}

// 넘버·라인·배지 수준으로만 색을 쓰고, 본문 텍스트는 통일된 네이비 계열을 유지합니다.
const ACCENT: Record<MenuAccent, { no: string; dot: string; line: string; activeBg: string; activeText: string; badge: string; groupBg: string }> = {
  blue: { no: 'text-blue-600', dot: 'bg-blue-500', line: 'bg-blue-200', activeBg: 'bg-blue-100', activeText: 'text-blue-800', badge: 'bg-blue-600', groupBg: 'bg-blue-50' },
  cyan: { no: 'text-cyan-600', dot: 'bg-cyan-500', line: 'bg-cyan-200', activeBg: 'bg-cyan-100', activeText: 'text-cyan-800', badge: 'bg-cyan-600', groupBg: 'bg-cyan-50' },
  violet: { no: 'text-violet-600', dot: 'bg-violet-500', line: 'bg-violet-200', activeBg: 'bg-violet-100', activeText: 'text-violet-800', badge: 'bg-violet-600', groupBg: 'bg-violet-50' },
  slate: { no: 'text-slate-500', dot: 'bg-slate-400', line: 'bg-slate-200', activeBg: 'bg-slate-200', activeText: 'text-slate-900', badge: 'bg-slate-600', groupBg: 'bg-slate-100' },
}

// 대표자용 — 현재 홈 내비게이션과 1:1 동기화. 실제 존재하는 라우트·앵커만 사용한다.
const BUSINESS_MENU: MenuConfig = {
  topTitle: '미래 AI 랩',
  topSub: '중소기업 AX · AI Growth',
  lead: {
    label: '3분 AX 가능성 진단',
    desc: '업종과 현재 업무방식만 알려주시면, 내부 AX와 고객 플랫폼 적용 가능성을 먼저 진단합니다.',
    to: '/business-diagnosis',
    match: (p) => p.startsWith('/business-diagnosis'),
  },
  groups: [
    {
      no: '01',
      heading: 'AX 살펴보기',
      accent: 'blue',
      items: [
        { no: '1', label: 'AX 사례', desc: '실제로 만든 AX·플랫폼 데모 먼저 보기', to: '/business-services#portfolio' },
        { no: '2', label: '실제 기업 프로젝트', desc: '현장에서 고도화 중인 프로젝트', to: '/business-services#real-projects' },
        { no: '3', label: 'AX란 무엇인가', desc: '디지털화와 무엇이 다른가', to: '/business-services#ax-definition' },
        { no: '4', label: '왜 미래AI랩인가', desc: '분절이 아니라 하나의 Growth Story', to: '/business-services#why-mirae' },
      ],
    },
    {
      no: '02',
      heading: '프로그램 · 성장',
      accent: 'cyan',
      items: [
        { no: '1', label: 'Growth Layer', desc: '정책자금·정부지원·벤처·특허 연결', to: '/business-services#growth' },
        // 정책자금 상세페이지 전면 개정 중 — 이동을 막는다
        { no: '2', label: '정책자금 × AX 프로그램', desc: '비용·진행방식·결과물까지', to: '/business-services/funding-consulting', updating: true },
        { no: '3', label: '수행체계', desc: '대표 컨설턴트 · 월 5개사 선별', to: '/business-services/funding-consulting#leader', updating: true },
        { no: '4', label: '자금 이후 성장 로드맵', desc: '인증·IP·복지제도 연계', to: '/business-services/funding-consulting#lifecycle', updating: true },
      ],
    },
    {
      no: '03',
      heading: '내 서비스',
      accent: 'blue',
      items: [
        { label: '마이페이지', to: '/mypage', match: (p) => p.startsWith('/mypage') },
        { label: '주문·진행현황', to: '/my-orders', match: (p) => p.startsWith('/my-orders') },
        { label: '상담 신청', to: '#consult' },
      ],
    },
    {
      no: '04',
      heading: '고객지원',
      accent: 'slate',
      items: [
        { label: '자주 묻는 질문', to: '/business-services/funding-consulting#faq' },
        { label: '이용약관', to: '/terms', match: (p) => p === '/terms' },
        { label: '개인정보처리방침', to: '/privacy', match: (p) => p === '/privacy' },
        { label: '환불·취소 정책', to: '/refund-policy', match: (p) => p === '/refund-policy' },
        { label: '사업자정보', to: '/business-info', match: (p) => p === '/business-info' },
      ],
    },
  ],
  cta: { label: '3분 AX 가능성 진단', to: '/business-diagnosis' },
}

// 컨설턴트용 — /consultants 공개 소개 + 로그인/도구함
const CONSULTANT_MENU: MenuConfig = {
  topTitle: '미래 AI 랩',
  topSub: '컨설턴트의 진단·제안·고객관리를 돕는 AI 업무도구',
  lead: {
    label: '7일 무료 체험 시작',
    desc: '카드 등록 없이, 신청한 시각부터 정확히 7일 체험할 수 있어요.',
    to: '/signup',
    match: (p) => p === '/signup',
  },
  groups: [
    {
      no: '01',
      heading: '컨설턴트 OS',
      accent: 'violet',
      items: [
        { label: 'AI 도구 전체', to: '/consultants#tools', match: (p) => p.startsWith('/consultants') },
        { label: '핵심 가치', to: '/consultants#value' },
        { label: '이용 방식', to: '/consultants#pricing' },
      ],
    },
    {
      no: '02',
      heading: '내 계정',
      accent: 'blue',
      items: [
        { label: '내 도구함', to: '/my-tools', match: (p) => p.startsWith('/my-tools') },
        { label: '마이페이지', to: '/mypage', match: (p) => p.startsWith('/mypage') },
      ],
    },
    {
      no: '03',
      heading: '대표님 경영지원',
      accent: 'cyan',
      items: [
        { label: '경영지원 서비스', to: '/business-services' },
        { label: '3분 AX 가능성 진단', to: '/business-diagnosis' },
      ],
    },
    {
      no: '04',
      heading: '고객지원',
      accent: 'slate',
      items: [
        { label: '자주 묻는 질문', to: '/consultants#faq' },
        { label: '문의하기', to: '/consultants#inquiry' },
        { label: '이용약관', to: '/terms', match: (p) => p === '/terms' },
        { label: '개인정보처리방침', to: '/privacy', match: (p) => p === '/privacy' },
        { label: '환불·취소 정책', to: '/refund-policy', match: (p) => p === '/refund-policy' },
        { label: '사업자정보', to: '/business-info', match: (p) => p === '/business-info' },
      ],
    },
  ],
  cta: { label: '내 도구함 보기', to: '/my-tools' },
}

const MENUS: Record<PublicMenuVariant, MenuConfig> = { business: BUSINESS_MENU, consultant: CONSULTANT_MENU }

export default function PublicMenuDrawer({
  variant = 'business',
  buttonClassName = '',
}: {
  variant?: PublicMenuVariant
  buttonClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [consultOpen, setConsultOpen] = useState(false)
  const [historyCount, setHistoryCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { user, profile, roles, memberType, needsOnboarding, isAdmin, signOut } = useAuth()

  const acctName = displayName(user, profile)
  const acctEmail = accountEmail(user, profile)
  const acctType = memberTypeLabel({ roles, memberType, needsOnboarding })
  const acctAvatar = resolveAvatarUrl(user)

  // 대표자 메뉴 '내 서비스' 그룹에 '찜·장바구니 N개'·'내 진단 결과 N건' 동적 추가
  // (주문·진행현황은 정적 항목으로 이미 존재하므로 orderCount 중복 링크는 생략)
  const config = useMemo<MenuConfig>(() => {
    if (variant !== 'business' || (historyCount <= 0 && savedCount <= 0)) return MENUS[variant]
    const base = MENUS.business
    const extra: MenuItem[] = []
    if (savedCount > 0) {
      extra.push({ label: `찜·장바구니 ${savedCount}개`, to: '/saved', match: (p) => p === '/saved' })
    }
    if (historyCount > 0) {
      extra.push({ label: `내 진단 결과 ${historyCount}건`, to: '/business-diagnosis/results', match: (p) => p.startsWith('/business-diagnosis/results') })
    }
    return {
      ...base,
      groups: base.groups.map((g) => (g.heading === '내 서비스' ? { ...g, items: [...g.items, ...extra] } : g)),
    }
  }, [variant, historyCount, savedCount])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    if (open && variant === 'business') {
      setHistoryCount(loadHistory().length)
      setSavedCount(getLikes().length + getCart().length)
    }
  }, [open, variant])

  // 뒤로가기(하드웨어/브라우저)로 드로어만 닫히도록 히스토리 센티넬을 push.
  // 열릴 때 항목을 하나 쌓고, 뒤로가기(popstate) 시 페이지 이탈 대신 드로어를 닫는다.
  useEffect(() => {
    if (!open) return
    // 라우터가 관리하는 기존 state(usr·key·idx)를 보존하고 miraeDrawer 플래그만 추가
    window.history.pushState({ ...(window.history.state ?? {}), miraeDrawer: true }, '')
    const onPop = () => setOpen(false)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open])

  // 닫기 요청 — 센티넬을 소비하도록 히스토리 back 호출(→ popstate → setOpen(false))
  const requestClose = () => {
    if ((window.history.state as { miraeDrawer?: boolean } | null)?.miraeDrawer) window.history.back()
    else setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose()
        return
      }
      // 포커스 트랩 — Tab 이 drawer 밖으로 나가지 않도록
      if (e.key === 'Tab' && panel) {
        const nodes = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel?.querySelector<HTMLElement>('a, button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      buttonRef.current?.focus()
    }
  }, [open])

  const path = location.pathname
  const leadActive = config.lead.match ? config.lead.match(path) : false

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="전체 메뉴 열기"
        aria-expanded={open}
        className={`grid h-11 w-11 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${buttonClassName}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="전체 메뉴">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={requestClose}
            className="animate-overlay-in absolute inset-0 h-full w-full cursor-default bg-slate-900/45 backdrop-blur-[2px]"
          />
          {/* drawer — 100dvh 3분할: 헤더 고정 / 메뉴 스크롤 / CTA 고정 */}
          <div
            ref={panelRef}
            className="animate-drawer-in absolute inset-y-0 right-0 flex h-[100dvh] w-full max-w-[440px] flex-col bg-white shadow-2xl [word-break:keep-all]"
          >
            {/* 상단 헤더 (고정) */}
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4">
              <BrandLogo
                to={variant === 'business' ? '/business-services' : '/consultants'}
                onClick={requestClose}
                tagline={config.topSub}
                imgClassName="h-9 max-w-[168px] sm:h-10 sm:max-w-[190px]"
              />
              <button
                type="button"
                onClick={requestClose}
                aria-label="메뉴 닫기"
                className="grid h-11 w-11 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* 메뉴 (독립 스크롤) */}
            <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="사이트 메뉴">
              {/* 대표 CTA (넘버 그룹 위) */}
              <Link
                to={config.lead.to}
                aria-current={leadActive ? 'page' : undefined}
                className="mb-4 flex min-h-[52px] items-center gap-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-3.5 text-white shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-black">{config.lead.label}</span>
                  {config.lead.desc && <span className="mt-0.5 block text-[0.8rem] font-medium leading-snug text-blue-50">{config.lead.desc}</span>}
                </span>
                <span aria-hidden className="text-lg">→</span>
              </Link>

              {/* 넘버링·색상 그룹 (목차형) */}
              {config.groups.map((group) => {
                const acc = ACCENT[group.accent]
                return (
                  <div key={group.no} className={`mt-4 rounded-2xl p-2.5 first:mt-0 ${acc.groupBg}`}>
                    <div className="mb-2 flex items-center gap-2.5 px-2">
                      <span className={`text-[1.2rem] font-black tracking-widest ${acc.no}`}>{group.no}</span>
                      <span className="text-[1.65rem] font-black leading-tight tracking-tight text-slate-900">{group.heading}</span>
                      <span className={`ml-1 h-[3px] flex-1 rounded-full ${acc.line}`} />
                    </div>
                    <ul className="space-y-0.5">
                      {group.items.map((m) => {
                        const active = m.match ? m.match(path) : false
                        // 개편 중인 항목 — 이동시키지 않고 '업데이트 중' 만 알린다.
                        // disabled 버튼이라 탭 순서·포커스 트랩에서도 자동으로 빠진다.
                        if (m.updating) {
                          return (
                            <li key={m.label}>
                              <button
                                type="button"
                                disabled
                                aria-disabled="true"
                                className="flex min-h-11 w-full cursor-not-allowed items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-slate-400"
                              >
                                <span className="flex min-w-0 items-start gap-2">
                                  {m.no && <span className="mt-0.5 shrink-0 text-[0.85rem] font-black tabular-nums text-slate-300">{m.no}.</span>}
                                  <span className="min-w-0">
                                    <span className="block text-[0.95rem] font-semibold leading-snug">{m.label}</span>
                                    {m.desc && <span className="mt-0.5 block text-xs leading-snug text-slate-300">{m.desc}</span>}
                                  </span>
                                </span>
                                <span className="shrink-0 rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-500">업데이트 중</span>
                              </button>
                            </li>
                          )
                        }
                        // 사이트 내 상담 폼(이메일) 모달을 여는 항목
                        if (m.to === '#consult') {
                          return (
                            <li key={m.label}>
                              <button
                                type="button"
                                onClick={() => { requestClose(); setConsultOpen(true) }}
                                className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                              >
                                <span className="flex min-w-0 items-start gap-2">
                                  {m.no && <span className={`mt-0.5 shrink-0 text-[0.85rem] font-black tabular-nums ${acc.no}`}>{m.no}.</span>}
                                  <span className="block text-[0.95rem] font-semibold leading-snug">{m.label}</span>
                                </span>
                                <span aria-hidden className="shrink-0 text-slate-400">✉</span>
                              </button>
                            </li>
                          )
                        }
                        // 외부 링크(카톡 등)는 <a> 로 새 탭 오픈
                        if (m.to.startsWith('http')) {
                          return (
                            <li key={m.label}>
                              <a
                                href={m.to}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-h-11 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                              >
                                <span className="flex min-w-0 items-start gap-2">
                                  {m.no && <span className={`mt-0.5 shrink-0 text-[0.85rem] font-black tabular-nums ${acc.no}`}>{m.no}.</span>}
                                  <span className="block text-[0.95rem] font-semibold leading-snug">{m.label}</span>
                                </span>
                                <span aria-hidden className="shrink-0 text-slate-400">↗</span>
                              </a>
                            </li>
                          )
                        }
                        return (
                          <li key={m.label}>
                            <Link
                              to={m.to}
                              aria-current={active ? 'page' : undefined}
                              className={`flex min-h-11 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                                active ? `${acc.activeBg} ${acc.activeText}` : 'text-slate-700 hover:bg-white/70 hover:text-slate-900'
                              }`}
                            >
                              <span className="flex min-w-0 items-start gap-2">
                                {m.no && <span className={`mt-0.5 shrink-0 text-[0.85rem] font-black tabular-nums ${acc.no}`}>{m.no}.</span>}
                                <span className="min-w-0">
                                  <span className="block text-[0.95rem] font-semibold leading-snug">{m.label}</span>
                                  {m.desc && <span className="mt-0.5 block text-xs leading-snug text-slate-400">{m.desc}</span>}
                                </span>
                              </span>
                              {active && <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black text-white ${acc.badge}`}>현재</span>}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}

              {/* 계정 영역 — 메인 내비 아래 Secondary 위계 */}
              {user ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={acctName} imageUrl={acctAvatar} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.95rem] font-black text-slate-900">{acctName}</p>
                      {acctEmail && <p className="truncate text-xs font-medium text-slate-500">{acctEmail}</p>}
                      {acctType && (
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-black ${needsOnboarding ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                          {acctType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    {needsOnboarding && (
                      <Link to="/auth/onboarding" className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-amber-600">
                        가입 완료하기 →
                      </Link>
                    )}
                    <Link to="/mypage" className="flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100">마이페이지</Link>
                    <Link to="/my-tools" className="flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100">내 도구함</Link>
                    {isAdmin && (
                      <Link to="/admin" className="col-span-2 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100">관리자</Link>
                    )}
                    <button
                      type="button"
                      onClick={async () => { setOpen(false); await signOut(); navigate('/') }}
                      className="col-span-2 flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link to={loginPathWithNext(location.pathname + location.search)} className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">로그인</Link>
                  <Link to="/signup" className="flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700">회원가입</Link>
                </div>
              )}

            </nav>

            {/* 하단 CTA (고정 + safe-area) */}
            <div className="shrink-0 border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                to={config.cta.to}
                className={`flex min-h-[52px] items-center justify-center gap-1.5 rounded-xl px-5 py-3.5 text-base font-bold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  variant === 'business' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {config.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="메뉴 · 상담 신청"
        heading="상담 신청"
        topicGroups={variant === 'business' ? CONSULT_TOPIC_GROUPS : undefined}
        showContactMethod={variant === 'business'}
        showCompanyFields={variant === 'business'}
        programSelect={variant === 'business'}
      />
    </>
  )
}
