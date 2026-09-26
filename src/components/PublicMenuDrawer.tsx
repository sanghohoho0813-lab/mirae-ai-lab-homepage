// 공개 페이지 공용 햄버거 메뉴 — 대표자용/컨설턴트용 variant 분리.
// 공통 shell(overlay·ESC·focus·body scroll lock·safe-area)만 재사용하고, 메뉴·CTA는 variant 로 나눕니다.
// 목차형 구조: 상단 계정 → 대표 CTA → 넘버링·색상 구분 그룹(01~04) → 하단 고정 CTA.
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { getCart, getLikes } from '../lib/savedItems'
import { useAuth } from '../lib/auth'
import { accountEmail, displayName, memberTypeLabel, resolveAvatarUrl } from '../lib/accountDisplay'
import { loginPathWithNext } from '../lib/authRouting'
import { scrollToSection } from '../lib/businessPageScroll'
import Avatar from './account/Avatar'
import BrandLogo from './BrandLogo'
import ConsultModal from './ConsultModal'

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

// 대표자용 — 선택 페이지의 두 서비스(기술사업·MVP / 풀 AX)와 1:1. 실제 존재하는 라우트·앵커만 사용한다.
const BUSINESS_MENU: MenuConfig = {
  topTitle: '미래 AI 랩',
  topSub: '중소기업 AX · 기술사업',
  lead: {
    label: '우리 회사 AX 가능성 진단',
    desc: '3분이면 돼요. 정비가 먼저인지, 작게 시작할지, 크게 만들지부터 알려 드려요.',
    to: '/business-diagnosis',
    match: (p) => p.startsWith('/business-diagnosis'),
  },
  groups: [
    {
      no: '01',
      heading: '서비스 선택',
      accent: 'blue',
      // 이름·한 줄 설명은 선택 페이지 카드와 같게
      items: [
        { no: '1', label: '2주 기술사업 빌드', desc: '없던 사업을 새로 만들어요 · 기술사업·MVP·벤처기업확인', to: '/business-services/venture-mvp', match: (p) => p.startsWith('/business-services/venture-mvp') },
        { no: '2', label: '풀 AX 구축', desc: '하던 일을 더 편하게 바꿔요 · 회사 전체 AX', to: '/business-services/ax-start', match: (p) => p.startsWith('/business-services/ax-start') },
        { no: '3', label: '두 서비스 비교하기', desc: '어느 쪽이 맞는지 한 화면에서', to: '/business-services', match: (p) => p === '/business-services' },
      ],
    },
    {
      no: '02',
      heading: 'AX 살펴보기',
      accent: 'cyan',
      items: [
        { no: '1', label: '실제 AX 구축 화면', desc: '업종별 화면을 직접 눌러 보기', to: '/business-services/ax#portfolio' },
        { no: '2', label: '실제 기업 프로젝트', desc: '지금 현장에서 만들고 있는 프로젝트', to: '/business-services/ax#real-projects' },
        { no: '3', label: 'AX가 뭐예요?', desc: '디지털화와 뭐가 다른지', to: '/business-services/ax#ax-definition' },
        { no: '4', label: '성과를 성장으로', desc: 'AX 성과를 다음 단계로 잇는 방법', to: '/business-services/ax#growth' },
        { no: '5', label: '왜 미래AI랩이에요?', desc: '따로따로가 아니라 한 흐름으로', to: '/business-services/ax#why-mirae' },
        // 프로그램 상세페이지 전면 개정 중 — 이동을 막고 한 줄로만 알린다 (프로그램 안내·수행체계·성장 로드맵)
        { no: '6', label: 'AX 프로그램 · 수행체계 · 로드맵', desc: '진행 방식과 결과물 (개정 중)', to: '/business-services/funding-consulting', updating: true },
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
        // 정책자금 상세(개정 중) 대신 AX 상세 안내의 FAQ 로
        { label: '자주 묻는 질문', to: '/business-services/ax#faq' },
        { label: '이용약관', to: '/terms', match: (p) => p === '/terms' },
        { label: '개인정보처리방침', to: '/privacy', match: (p) => p === '/privacy' },
        { label: '환불·취소 정책', to: '/refund-policy', match: (p) => p === '/refund-policy' },
        { label: '사업자정보', to: '/business-info', match: (p) => p === '/business-info' },
      ],
    },
  ],
  cta: { label: '우리 회사 AX 가능성 진단', to: '/business-diagnosis' },
}

// 컨설턴트용 — /consultants(MIRAE AI LAB OS) 소개 + 로그인/도구함. 대표님용 안내는 한 줄로만 둔다.
// 무료 체험 안내는 두지 않는다(지금은 막아 둠).
const CONSULTANT_MENU: MenuConfig = {
  topTitle: '미래 AI 랩',
  topSub: 'MIRAE AI LAB OS · 컨설턴트 운영 OS',
  lead: {
    label: '오픈 소식 받기',
    desc: '2026년 10월부터 모듈을 하나씩 엽니다. 열 때마다 먼저 연락드릴게요.',
    to: '/consultants#inquiry',
  },
  groups: [
    {
      no: '01',
      heading: '컨설턴트 OS',
      accent: 'violet',
      items: [
        { label: '대시보드 미리보기', desc: '아침에 열면 할 일이 정리돼 있어요', to: '/consultants#dashboard' },
        { label: '운영 방식', desc: '고객이 올리면 내 할 일로, 처리하면 고객 화면으로', to: '/consultants#how' },
        { label: '7개 모듈', desc: '지금 쓰는 도구와 완성되면 들어갈 기능', to: '/consultants#modules' },
        { label: '출시 일정', desc: '2026년 10월부터 차례로 · 정식 출시 후 월 구독', to: '/consultants#launch' },
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
      heading: '대표님이신가요?',
      accent: 'cyan',
      items: [{ label: '대표님 서비스 보기', desc: '기술사업·MVP · 회사 전체 AX', to: '/business-services' }],
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

  // 메뉴 항목으로 이동.
  //  - 같은 페이지의 구간(#)이면: 메뉴를 닫고(쌓아 둔 기록을 뒤로가기로 소비) 그 구간으로 스크롤한다.
  //    라우터는 같은 페이지 안 #이동에 스크롤을 해 주지 않아, 전에는 메뉴만 닫히고 제자리였다.
  //  - 다른 페이지면: 메뉴가 쌓아 둔 기록 자리에 새 페이지를 바꿔 끼운다 — 뒤로가기 한 번에 원래 페이지로.
  const goItem = (e: MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    const url = new URL(to, window.location.origin)
    const target = url.pathname + url.search + url.hash
    const hasEntry = Boolean((window.history.state as { miraeDrawer?: boolean } | null)?.miraeDrawer)
    if (url.pathname === location.pathname && url.hash) {
      const id = decodeURIComponent(url.hash.slice(1))
      const go = () => {
        navigate(target, { replace: true })
        // 메뉴가 닫히고 스크롤 잠금이 풀린 뒤, 늦게 뜨는 이미지로 위치가 밀려도 다시 맞춘다
        ;[30, 200, 550].forEach((d) => window.setTimeout(() => scrollToSection(id), d))
      }
      if (hasEntry) {
        let done = false
        const once = () => {
          if (done) return
          done = true
          window.removeEventListener('popstate', once)
          go()
        }
        window.addEventListener('popstate', once)
        window.setTimeout(once, 400)
        window.history.back()
      } else {
        setOpen(false)
        go()
      }
      return
    }
    // 지금 보고 있는 페이지를 다시 누르면 — 기록을 더 쌓지 않고 메뉴만 닫은 뒤 맨 위로
    if (url.pathname === location.pathname && url.search === location.search) {
      requestClose()
      window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), 30)
      return
    }
    setOpen(false)
    navigate(target, { replace: hasEntry })
  }

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
                onClick={(e) => goItem(e, config.lead.to)}
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
                                <span className="shrink-0 rounded-md bg-slate-200 px-1.5 py-0.5 text-xs font-black text-slate-500">업데이트 중</span>
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
                              onClick={(e) => goItem(e, m.to)}
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
                              {active && <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs font-black text-white ${acc.badge}`}>현재</span>}
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
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-black ${needsOnboarding ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                          {acctType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    {needsOnboarding && (
                      <Link to="/auth/onboarding" onClick={(e) => goItem(e, '/auth/onboarding')} className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-amber-600">
                        가입 완료하기 →
                      </Link>
                    )}
                    <Link to="/mypage" onClick={(e) => goItem(e, '/mypage')} className="flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100">마이페이지</Link>
                    <Link to="/my-tools" onClick={(e) => goItem(e, '/my-tools')} className="flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100">내 도구함</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={(e) => goItem(e, '/admin')} className="col-span-2 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100">관리자</Link>
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
                  <Link to={loginPathWithNext(location.pathname + location.search)} onClick={(e) => goItem(e, loginPathWithNext(location.pathname + location.search))} className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">로그인</Link>
                  <Link to="/signup" onClick={(e) => goItem(e, '/signup')} className="flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700">회원가입</Link>
                </div>
              )}

            </nav>

            {/* 하단 CTA (고정 + safe-area) */}
            <div className="shrink-0 border-t border-slate-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                to={config.cta.to}
                onClick={(e) => goItem(e, config.cta.to)}
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

      {/* 브랜드 정비(0차): 정책자금 프로그램 위저드·상품 목록 대신 단순 상담 폼으로 연다 */}
      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="메뉴 · 상담 신청"
        heading="상담 신청"
        showContactMethod={variant === 'business'}
        showCompanyFields={variant === 'business'}
      />
    </>
  )
}
