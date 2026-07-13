// 공개 페이지 공용 햄버거 메뉴 — 대표자용/컨설턴트용 variant 분리.
// 공통 shell(overlay·ESC·focus·body scroll lock·safe-area)만 재사용하고, 메뉴·CTA는 variant 로 나눕니다.
// drawer 레이아웃: 100dvh, 상단 헤더 고정 / 중간 메뉴 스크롤 / 하단 CTA 고정.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { loadLocalOrders } from '../lib/payments'
import { legalLinks } from '../config/businessInfo'

export type PublicMenuVariant = 'business' | 'consultant'

type MenuItem = {
  label: string
  to: string
  desc?: string
  highlight?: boolean
  match?: (path: string) => boolean
}

type CrossNav = {
  heading: string
  label: string
  desc: string
  to: string
}

type MenuConfig = {
  topTitle: string
  topSub: string
  groups: { heading?: string; items: MenuItem[] }[]
  crossNav: CrossNav
  cta: { label: string; to: string }
}

// 대표자용 상품 slug 는 실제 존재하는 값만 사용
const BUSINESS_MENU: MenuConfig = {
  topTitle: '미래 AI 랩',
  topSub: '중소기업 대표님을 위한 경영지원 서비스',
  groups: [
    {
      items: [
        {
          label: '3분 무료 기업 성장진단',
          desc: '우리 회사에 지금 필요한 자금·지원금·인증을 확인해보세요.',
          to: '/business-diagnosis',
          highlight: true,
          match: (p) => p.startsWith('/business-diagnosis'),
        },
        {
          label: '전체 상품 보기',
          desc: '정책자금부터 기업인증·홈페이지·AI 시스템까지',
          to: '/business-services#products',
          match: (p) => p === '/business-services',
        },
      ],
    },
    {
      heading: '필요한 상황부터 찾기',
      items: [
        { label: '저금리 자금조달이 필요하다면', to: '/business-services/funding-consulting' },
        { label: '고용지원금을 확인하고 싶다면', to: '/business-services/employment-subsidy' },
        { label: '정책자금·지원사업 가점을 준비하려면', to: '/business-services?category=certification' },
        { label: '홈페이지와 업무시스템이 필요하다면', to: '/business-services?category=digital' },
      ],
    },
    {
      heading: '더 알아보기',
      items: [
        { label: '진행 사례', to: '/business-services#cases' },
        { label: '자주 묻는 질문', to: '/business-services#faq' },
        { label: '상담 신청', to: '/business-services#apply' },
      ],
    },
  ],
  crossNav: {
    heading: '컨설턴트이신가요?',
    label: '컨설턴트용 AI 도구',
    desc: '고객 진단·제안·업무 자동화를 돕는 AI 실무 도구',
    to: '/consultants',
  },
  cta: { label: '우리 회사에 필요한 서비스 찾기', to: '/business-diagnosis' },
}

// 컨설턴트용 — 실제 존재하는 라우트만 (/consultants 공개 소개 + 로그인/도구함)
const CONSULTANT_MENU: MenuConfig = {
  topTitle: '미래 AI 랩',
  topSub: '컨설턴트의 진단·제안·고객관리를 돕는 AI 업무도구',
  groups: [
    {
      items: [
        { label: '컨설턴트 AI OS 소개', to: '/consultants#top', highlight: true, match: (p) => p.startsWith('/consultants') },
        { label: '전체 AI 도구', to: '/consultants#tools' },
        { label: '무료 체험', to: '/consultants#trial' },
      ],
    },
    {
      heading: '이용 안내',
      items: [
        { label: '요금제·구독 안내', to: '/consultants#pricing' },
        { label: '고객 진단·제안 기능', to: '/consultants#features' },
        { label: '문의하기', to: '/consultants#inquiry' },
      ],
    },
    {
      heading: '내 계정',
      items: [
        { label: '내 도구함', to: '/my-tools' },
        { label: '로그인 · 회원가입', to: '/login' },
      ],
    },
  ],
  crossNav: {
    heading: '중소기업 대표님이신가요?',
    label: '대표님용 경영지원',
    desc: '정책자금·지원금·기업인증·홈페이지·AX 경영지원 서비스',
    to: '/business-services',
  },
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
  const [historyCount, setHistoryCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const location = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 대표자 메뉴에 '내 진단 결과 N건'·'내 결제·신청내역' 동적 항목 추가
  const config = useMemo<MenuConfig>(() => {
    if (variant !== 'business' || (historyCount <= 0 && orderCount <= 0)) return MENUS[variant]
    const base = MENUS.business
    const extra: MenuItem[] = []
    if (historyCount > 0) {
      extra.push({
        label: `내 진단 결과 ${historyCount}건`,
        desc: '저장된 진단 결과를 다시 볼 수 있어요.',
        to: '/business-diagnosis/results',
        match: (p) => p.startsWith('/business-diagnosis/results'),
      })
    }
    if (orderCount > 0) {
      extra.push({
        label: `내 결제·신청내역 ${orderCount}건`,
        desc: '결제한 주문과 진행상태를 확인해요.',
        to: '/my-orders',
        match: (p) => p.startsWith('/my-orders'),
      })
    }
    return { ...base, groups: base.groups.map((g, i) => (i === 0 ? { ...g, items: [...g.items, ...extra] } : g)) }
  }, [variant, historyCount, orderCount])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    if (open && variant === 'business') {
      setHistoryCount(loadHistory().length)
      setOrderCount(loadLocalOrders().length)
    }
  }, [open, variant])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      buttonRef.current?.focus()
    }
  }, [open])

  const path = location.pathname

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

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="전체 메뉴">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
            className="animate-overlay-in absolute inset-0 h-full w-full cursor-default bg-slate-900/45 backdrop-blur-[2px]"
          />
          {/* drawer — 100dvh 3분할: 헤더 고정 / 메뉴 스크롤 / CTA 고정 */}
          <div
            ref={panelRef}
            className="animate-drawer-in absolute inset-y-0 right-0 flex h-[100dvh] w-full max-w-[440px] flex-col bg-white shadow-2xl [word-break:keep-all]"
          >
            {/* 상단 헤더 (고정) */}
            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">{config.topTitle}</span>
                  <span className="text-[0.72rem] font-medium text-slate-500">{config.topSub}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
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
              {config.groups.map((group, gi) => (
                <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
                  {group.heading && <p className="px-3 pb-1.5 text-xs font-black uppercase tracking-wide text-slate-400">{group.heading}</p>}
                  <ul className="space-y-1">
                    {group.items.map((m) => {
                      const active = m.match ? m.match(path) : false
                      if (m.highlight) {
                        return (
                          <li key={m.label}>
                            <Link
                              to={m.to}
                              className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-3.5 text-white shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block text-base font-black">{m.label}</span>
                                {m.desc && <span className="mt-0.5 block text-[0.8rem] font-medium leading-snug text-blue-50">{m.desc}</span>}
                              </span>
                              <span aria-hidden className="text-lg">→</span>
                            </Link>
                          </li>
                        )
                      }
                      return (
                        <li key={m.label}>
                          <Link
                            to={m.to}
                            aria-current={active ? 'page' : undefined}
                            className={`flex min-h-11 items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                              active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <span className="min-w-0">
                              <span className="block text-[0.95rem] font-semibold leading-snug">{m.label}</span>
                              {m.desc && <span className="mt-0.5 block text-xs leading-snug text-slate-400">{m.desc}</span>}
                            </span>
                            {active ? (
                              <span className="shrink-0 rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-black text-white">현재</span>
                            ) : (
                              <span aria-hidden className="shrink-0 text-slate-300">›</span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}

              {/* 대표자 ↔ 컨설턴트 전환 (별도 섹션 — 메뉴와 섞지 않음) */}
              <div className="mt-5">
                <p className="px-3 pb-1.5 text-xs font-black uppercase tracking-wide text-slate-400">{config.crossNav.heading}</p>
                <Link
                  to={config.crossNav.to}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] font-bold text-slate-900">{config.crossNav.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">{config.crossNav.desc}</span>
                  </span>
                  <span aria-hidden className="text-slate-400">→</span>
                </Link>
              </div>

              {/* 약관·정책·사업자정보 */}
              <div className="mt-5">
                <p className="px-3 pb-1.5 text-xs font-black uppercase tracking-wide text-slate-400">약관 및 정책</p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1.5 px-3">
                  {legalLinks.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-[0.85rem] font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
        </div>
      )}
    </>
  )
}
