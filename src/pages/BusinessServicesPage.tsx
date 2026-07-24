import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import AxHero from '../components/ax/AxHero'
import AxPolicyShift from '../components/ax/AxPolicyShift'
import AxTransform from '../components/ax/AxTransform'
import AxProcessSection from '../components/ax/AxProcessSection'
import AxIndustryShowcase from '../components/ax/AxIndustryShowcase'
import AxResults from '../components/ax/AxResults'
import AxCostCompare from '../components/ax/AxCostCompare'
import AxFeeCalculator from '../components/ax/AxFeeCalculator'
import AxDifference from '../components/ax/AxDifference'
import AxFinalCta from '../components/ax/AxFinalCta'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { consultLinks } from '../config/businessInfo'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { MAIN_PROGRAMS } from '../data/corePrograms'
import { businessPackages, type ModuleGroup } from '../data/businessPackages'

// 중소기업 대표용 메인 페이지 (8섹션 압축본) — "정책자금 컨설팅 + 실제 AX 시스템 구축"을
// 5초 안에: 기업진단 → 정책자금 전략 → 인증·근거 정리 → 실제 업무 AX 시스템 구축 흐름으로 전달.
// 8개 흐름: Hero → 문제→화면 → 진행6단계 → 업종예시 → 결과물·수준 → 프로그램 → 차별점 → 최종CTA (헤더·푸터 별도)
// 가격·설명은 corePrograms.ts 단일 소스 재사용(하드코딩 금지). 이미지 반복·데이터는 axShowcase.ts.

// A·B 프로그램 비교 — 가격·요율은 MAIN_PROGRAMS 단일 소스, 정성 항목만 로컬 문구
const compareRows: { label: string; cells: [string, string] }[] = [
  { label: '추천 기업', cells: ['소상공인·초기·첫 신청기업', '반복업무·성장기업(조달 1억+)'] },
  { label: '주요 목적', cells: ['심사 설명용 실행근거', '자금조달 후 실제 사용 시스템'] },
  { label: '자금조달 실행', cells: ['O', 'O'] },
  { label: 'AX 결과물', cells: ['클릭형 실행근거 프로토타입', '작동형 AX MVP'] },
  { label: '구현 수준', cells: ['실행근거형 프로토타입', '실제 작동형 AX MVP'] },
  { label: '로그인·DB', cells: ['—', 'O'] },
  { label: '실제 업무 사용', cells: ['심사 설명 중심', 'O (실제 운영)'] },
  { label: '기본 제외', cells: ['로그인·DB·작동형 앱 전체', 'PG·ERP·택배 API 등 별도 협의'] },
  { label: '착수금', cells: ['50만원', '100만원'] },
  { label: '성공보수', cells: ['조달액 3% (상한 없음)', '조달액 5% · 최대 1,500만원'] },
]

const homeFaqs = [
  { q: '정책자금 승인이나 인증 취득을 보장하나요?', a: '아니요. 승인·선정·취득은 기관 심사 사항이며, AX 구축이 자금 승인을 보장하지 않습니다. 저희는 가능성 진단과 신청 전략, 평가받을 근거 정리, 진행 관리를 돕습니다.' },
  { q: '보여주신 화면은 실제 고객사 화면인가요?', a: '아니요. 구축 가능 범위를 보여드리기 위해 가상 업종 기준으로 직접 설계·구현한 프론트엔드 프로토타입 예시입니다. 실제 구축 화면과 범위는 기업 인터뷰 후 기업별 업무에 맞춰 결정됩니다.' },
  { q: '기업진단·자금전략(500,000원)만 이용해도 되나요?', a: '네. 이 단계만 이용하고 직접 진행하셔도 되며, 성과보수가 붙지 않습니다. 자금 방향·기관·보완사항·실행 순서가 정리된 결과 요약본이 남습니다.' },
  { q: 'AX 결합 성장자금형은 어떻게 선정되나요?', a: '적합성 검토 및 계약 확정 순으로 초기 10개사를 선정합니다. 조달 목표금액 1억원 이상 성장기업에 권장하며, 신청 시 바로 결제되지 않고 검토·승인 이후 착수합니다. 특허는 포함 서비스가 아니며 별도 견적 또는 전문가 연계입니다.' },
]

// 성장 모듈 — 진단 후 필요할 때 연결되는 실행 항목(개별 가격·CTA 없음). 드로어 #module-* 앵커와 일치.
// group: businessPackages.moduleGroup 과 매칭 → 카드의 각 상세 링크는 실제 등록된 /business-services/:slug 로 연결.
const GROWTH_MODULES: { id: string; no: string; title: string; group: ModuleGroup; summary: string; accent: { chip: string; no: string } }[] = [
  { id: 'module-innovation', no: '01', title: '기술·혁신 기반', group: 'tech', summary: '벤처확인 · 기업부설연구소 · 이노비즈 · 특허 연계', accent: { chip: 'bg-violet-50 text-violet-700 ring-violet-200', no: 'text-violet-600' } },
  { id: 'module-trust', no: '02', title: '경영·대외 신뢰', group: 'trust', summary: '메인비즈 · ISO 인증 · 고용지원금 점검', accent: { chip: 'bg-blue-50 text-blue-700 ring-blue-200', no: 'text-blue-600' } },
  { id: 'module-digital', no: '03', title: '디지털 실행', group: 'digital', summary: '홈페이지 · 업무자동화 · 작동형 AX · 운영 고도화', accent: { chip: 'bg-teal-50 text-teal-700 ring-teal-200', no: 'text-teal-600' } },
  { id: 'module-finance', no: '04', title: '재무·전문가 연계', group: 'finance', summary: '가지급금 · 이익잉여금 · 승계 · 지분구조 · 전문가 검토', accent: { chip: 'bg-slate-100 text-slate-700 ring-slate-300', no: 'text-slate-500' } },
]
// 성장 모듈 그룹별 실제 상세페이지 상품(등록된 라우트만). growth-roadmap-package 는 moduleGroup 미지정이라 자동 제외.
const MODULE_MEMBERS: Record<ModuleGroup, { slug: string; name: string }[]> = (['tech', 'trust', 'digital', 'finance'] as ModuleGroup[]).reduce(
  (acc, g) => {
    acc[g] = businessPackages.filter((p) => p.moduleGroup === g).map((p) => ({ slug: p.slug, name: p.name }))
    return acc
  },
  {} as Record<ModuleGroup, { slug: string; name: string }[]>,
)

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[2.1rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BusinessServicesPage() {
  const { cart } = useSavedItems()
  const [historyCount] = useState(() => loadHistory().length)
  const [showBar, setShowBar] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [preselectProgram, setPreselectProgram] = useState<string | undefined>(undefined)
  const location = useLocation()

  useEffect(() => {
    document.title = '정책자금 컨설팅과 AX 시스템 구축 | 미래 AI 랩'
  }, [])

  // #hash 딥링크 → 해당 섹션(성장 모듈 #module-* 포함)으로 스크롤. 외부 페이지 진입도 대응.
  useEffect(() => {
    if (location.hash) setTimeout(() => scrollToId(location.hash.slice(1)), 60)
  }, [location.hash])

  // 하단 고정 바 — 어느 정도 스크롤하면 표시
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 480)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 최종 CTA가 화면에 들어오면 하단 고정 바 숨김
  useEffect(() => {
    const el = finalCtaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  function openProgram(programName?: string) {
    setPreselectProgram(programName)
    setConsultOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.82rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-[0.92rem] font-medium text-slate-600 xl:flex">
            <Link to="/business-services/funding-consulting" className="transition-colors hover:text-slate-900">자금조달 전략</Link>
            <button type="button" onClick={() => scrollToId('why-ax')} className="transition-colors hover:text-slate-900">왜 AX인가</button>
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행 방식</button>
            <button type="button" onClick={() => scrollToId('industry')} className="transition-colors hover:text-slate-900">AX 구축 사례</button>
            <button type="button" onClick={() => scrollToId('programs')} className="transition-colors hover:text-slate-900">프로그램</button>
            <button type="button" onClick={() => scrollToId('growth-modules')} className="transition-colors hover:text-slate-900">성장 모듈</button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[0.85rem] font-bold text-cyan-800 transition-colors hover:bg-cyan-100 lg:inline-flex">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 3h8l2 2v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5z" /><path d="M9 9h6M9 13h6M9 17h4" /></svg>
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            {cart.length > 0 && (
              <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
              </Link>
            )}
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex">3분 기업진단</Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {/* ── S1. Hero ─────────────────────────────────────────────── */}
      <AxHero onPrograms={() => scrollToId('programs')} onGrowthModules={() => scrollToId('growth-modules')} />

      {/* ── S1.5 2026 정책자금 × AX 스토리텔링 (#why-ax) ──────────── */}
      <AxPolicyShift onIndustry={() => scrollToId('industry')} />

      {/* ── S2. 문제 → AX 화면 (기존 S2+S5 통합) ──────────────────── */}
      <AxTransform />

      {/* ── S3. 컨설팅 진행 6단계 (S9 디자인방향 흡수) ────────────── */}
      <AxProcessSection />

      {/* ── S4. 업종별 AX 구축 예시 (S10 갤러리 흡수) ─────────────── */}
      <AxIndustryShowcase />

      {/* ── S5. 결과물 + 구축 수준 (기존 S6+S7 통합) ──────────────── */}
      <AxResults />

      {/* ── S6. 3개 핵심 프로그램 (비용비교 흡수 + 카드 + 계산기 + 초기10개사) ── */}
      <section id="programs" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-6">
          <p className={eyebrow}>자금조달 × AX 프로그램</p>
          <h2 className={h2Class}>자금조달 실행형 A · AX 결합 성장자금형 B</h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-slate-500">
            A형은 심사에서 설명할 실행근거를 만들고, B형은 자금조달 후 실제로 사용할 AX 시스템을 만듭니다. 두 프로그램의 차이는 가격이 아니라 결과물의 구현 수준입니다.
          </p>

          {/* 비용·방식 비교 (일반 외주개발 vs 미래AI랩 AX결합형) + 프로그램 C 조건 — 기존 #ax-value 흡수 */}
          <AxCostCompare />

          {/* A·B 안내 — 무료 3분 진단이 진입점 */}
          <p className="mt-6 max-w-3xl text-[0.98rem] leading-relaxed text-slate-600">
            <b className="text-slate-900">자금조달이 우선이라면 A형</b>, 자금조달과 실제 업무혁신이 함께 필요하다면 <b className="text-slate-900">B형</b>을 선택합니다. 어떤 방식이 맞는지는 <Link to="/business-diagnosis" className="font-black text-blue-600 underline underline-offset-2">무료 3분 기업진단</Link>으로 추천받을 수 있습니다.
          </p>

          {/* A·B 프로그램 카드 (기업진단·자금전략 유료카드 제거 → 무료 진단이 진입점) */}
          <div className="mt-5 grid items-stretch gap-4 lg:grid-cols-2">
            {MAIN_PROGRAMS.map((p) => {
              const isB = p.key === 'B'
              return (
                <div key={p.key} id={p.anchor} className={`relative flex scroll-mt-24 flex-col rounded-3xl border-2 bg-white p-6 ${isB ? 'border-slate-800 shadow-xl shadow-slate-900/10' : 'border-blue-500 shadow-sm'}`}>
                  {/* 하위호환 앵커 (#core-*) — 레이아웃 높이 0 */}
                  {p.legacyAnchors.map((a) => <span key={a} id={a} aria-hidden className="pointer-events-none absolute left-0 top-[-6rem] block h-0 w-0" />)}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl text-base font-black text-white ${isB ? 'bg-slate-900' : 'bg-blue-600'}`}>{p.key}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[0.72rem] font-black ${isB ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'}`}>{p.badge}</span>
                  </div>
                  <h3 className="mt-4 text-[1.3rem] font-black leading-snug tracking-tight text-slate-900">{p.key}. {p.name}</h3>
                  <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-500">{p.tagline}</p>
                  <p className={`mt-2 text-[0.95rem] font-black ${isB ? 'text-slate-900' : 'text-blue-700'}`}>“{p.purpose}”</p>

                  <div className="mt-3 border-y border-slate-100 py-3">
                    {p.priceTop && <p className="text-[0.78rem] font-semibold text-slate-400">{p.priceTop}</p>}
                    <p className={`mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight ${isB ? 'text-slate-900' : 'text-blue-700'}`}>{p.priceMain}</p>
                    <p className="mt-1 text-[0.88rem] font-bold text-slate-600">{p.priceSub}</p>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
                    <p className="text-[0.7rem] font-black uppercase tracking-wide text-slate-400">이런 기업에 맞습니다</p>
                    <ul className="mt-1 space-y-0.5">
                      {p.recommend.map((r) => <li key={r} className="text-[0.83rem] leading-snug text-slate-600">· {r}</li>)}
                    </ul>
                  </div>

                  <p className="mt-3 text-[0.7rem] font-black uppercase tracking-wide text-slate-400">포함 범위</p>
                  <ul className="mt-1.5 flex-1 space-y-1.5">
                    {p.included.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-[0.88rem] leading-snug text-slate-600"><span className={`mt-0.5 shrink-0 font-black ${isB ? 'text-slate-700' : 'text-blue-500'}`} aria-hidden>✓</span>{it}</li>
                    ))}
                  </ul>
                  {p.axNote && <p className="mt-2.5 rounded-lg bg-blue-50 px-3 py-2 text-[0.8rem] font-semibold leading-snug text-blue-800">{p.axNote}</p>}
                  <p className="mt-2.5 rounded-lg bg-slate-100 px-3 py-2 text-[0.78rem] leading-snug text-slate-500"><b className="text-slate-600">{p.excludedLabel}</b> — {p.excluded.join(' · ')}</p>

                  <button type="button" onClick={() => openProgram(p.consultName)} className={`mt-4 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-[0.95rem] font-black text-white shadow-sm transition-transform hover:-translate-y-0.5 ${isB ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'}`}>{p.ctaLabel}</button>
                </div>
              )
            })}
          </div>

          {/* 선택형 계산기 — 프로그램 카드 다음 (컴팩트, 기준 접힘) */}
          <div className="mt-6"><AxFeeCalculator /></div>

          {/* A·B 항목별 비교표 — 접이식(펼쳐보기) */}
          <button type="button" onClick={() => setShowCompare((v) => !v)} aria-expanded={showCompare} className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[0.85rem] font-bold text-slate-600 transition-colors hover:bg-slate-100">
            {showCompare ? 'A·B 항목별 비교 접기' : 'A·B 항목별 비교 펼쳐보기'}
            <span aria-hidden className={`transition-transform ${showCompare ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showCompare && (<>
          <div className="mt-3 hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:block">
            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="bg-slate-100 px-4 py-3" />
              {MAIN_PROGRAMS.map((p) => (
                <div key={p.key} className={`px-3 py-3 text-center ${p.key === 'B' ? 'bg-slate-900' : 'bg-blue-600'}`}>
                  <p className={`text-[0.68rem] font-bold ${p.key === 'B' ? 'text-slate-400' : 'text-blue-200'}`}>{p.key}</p>
                  <p className="text-[0.86rem] font-black leading-tight text-white">{p.name}</p>
                </div>
              ))}
            </div>
            {compareRows.map((row, ri) => (
              <div key={row.label} className={`grid grid-cols-[1.2fr_1fr_1fr] ${ri % 2 ? 'bg-slate-50/70' : 'bg-white'}`}>
                <div className="flex items-center bg-slate-100/70 px-4 py-3"><p className="text-[0.82rem] font-black text-slate-600">{row.label}</p></div>
                {row.cells.map((cell, ci) => (
                  <div key={ci} className={`flex items-center justify-center px-3 py-3 text-center ${ci === 1 ? 'bg-slate-50/60' : ''}`}>
                    <p className={`text-[0.85rem] font-bold leading-tight ${cell === 'O' ? 'text-blue-600' : cell === '—' ? 'text-slate-300' : 'text-slate-700'}`}>{cell}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-3 sm:hidden">
            {MAIN_PROGRAMS.map((p, pi) => (
              <div key={p.key} className={`rounded-2xl border-2 p-4 ${p.key === 'B' ? 'border-slate-800' : 'border-blue-500'}`}>
                <p className="text-[1.05rem] font-black text-slate-900">{p.key}. {p.name}</p>
                <dl className="mt-2.5 space-y-1.5">
                  {compareRows.map((row) => (
                    <div key={row.label} className="flex gap-2 text-[0.85rem]">
                      <dt className="w-[7.5rem] shrink-0 font-semibold text-slate-500">{row.label}</dt>
                      <dd className={`min-w-0 font-bold ${row.cells[pi] === 'O' ? 'text-blue-600' : row.cells[pi] === '—' ? 'text-slate-300' : 'text-slate-800'}`}>{row.cells[pi]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          </>)}

          {/* B형 · 초기 10개사 — 참여조건 + 우대 (컴팩트) */}
          <div className="mt-6 rounded-2xl border border-slate-300 bg-white p-5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="text-[0.78rem] font-black uppercase tracking-widest text-slate-600">B형 · 초기 레퍼런스 10개사</p>
              <p className="text-[0.9rem] font-bold text-slate-500">참여조건 · 실제 업무자료 제공 · 대표자/담당자 테스트 참여 · 익명 사례·종료 후 상세 피드백</p>
            </div>
            <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3">
              <p className="text-[0.9rem] font-bold text-slate-800"><b className="font-black text-violet-700">참여기업 전용 우대</b> — 벤처확인 준비 지원 10% · 기업부설연구소·연구개발전담부서 설립 지원 10% (기업진단 후 필요 시 제안 · 특허 출원은 별도 견적·전문가 연계)</p>
            </div>
            <p className="mt-3 text-[0.82rem] font-semibold text-slate-500">적합성 검토 및 계약 확정 순으로 초기 10개사를 선정합니다. <Link to="/business-services/funding-consulting" className="text-blue-700 underline underline-offset-2 hover:text-blue-800">자금조달 전략·참여 조건 자세히 보기 →</Link></p>
            <p className="mt-2.5 text-[0.76rem] leading-relaxed text-slate-400">성과보수(A 3%·B 5%)는 추가 진행을 선택하고 실제로 자금이 조달된 경우에만 발생합니다. 자금 승인은 기관 심사 사항이며 AX 구축이 승인을 보장하지 않습니다. 개발 범위와 비용은 기업별 업무 분석 후 확정됩니다.</p>
          </div>

          {/* 성장 모듈 — 프로그램 섹션 하위 컴팩트 영역(대형 아코디언 아님). 드로어 #module-* 앵커와 일치. */}
          <div id="growth-modules" className="mt-8 scroll-mt-24 border-t border-slate-200 pt-6">
            <p className="text-[0.8rem] font-semibold text-slate-400">프로그램은 자금조달과 AX의 진행 방식이고, 성장 모듈은 기업진단 결과에 따라 연결하는 실행 항목입니다.</p>
            <h3 className="mt-1.5 text-[1.3rem] font-black tracking-tight text-slate-900 sm:text-[1.4rem]">필요한 인증과 지원제도까지 성장 순서에 맞게 연결합니다.</h3>
            <p className="mt-1.5 max-w-2xl text-[0.92rem] leading-relaxed text-slate-500">모든 기업에 모든 인증이 필요한 것은 아닙니다. 자금조달·기술성·고용계획과 성장단계를 진단한 뒤 필요한 항목만 연결합니다.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GROWTH_MODULES.map((m) => (
                <div key={m.id} id={m.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.9rem] font-black tabular-nums ${m.accent.no}`}>{m.no}</span>
                    <p className="text-[1rem] font-black leading-snug text-slate-900">{m.title}</p>
                  </div>
                  <ul className="mt-2.5 space-y-0.5 border-t border-slate-100 pt-2.5">
                    {MODULE_MEMBERS[m.group].map((mp) => (
                      <li key={mp.slug}>
                        <Link
                          to={`/business-services/${mp.slug}`}
                          className="group -mx-1.5 flex items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 text-[0.83rem] font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                        >
                          <span className="min-w-0 truncate">{mp.name}</span>
                          <span aria-hidden className="shrink-0 text-slate-300 transition-colors group-hover:text-blue-500">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-[0.78rem] leading-relaxed text-slate-400">일부 업무는 세무사·노무사·변호사·변리사 등 외부 전문가 검토 또는 연계가 필요할 수 있습니다.</p>
              <Link to="/business-diagnosis" className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-[0.9rem] font-black text-white transition-transform hover:-translate-y-0.5">
                기업진단으로 필요한 항목 확인하기 <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── S7. 미래AI랩 차별점 (S11 + 대표자 신뢰 병합) ──────────── */}
      <AxDifference />

      {/* ── 자주 묻는 질문 (압축 · 드로어 #faq 링크 대응) ─────────── */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-9 sm:px-6 sm:py-6">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-5 space-y-2.5">
            {homeFaqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[0.98rem] font-bold text-slate-900">Q. {f.q}</p>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S8. 최종 상담 CTA ────────────────────────────────────── */}
      <div ref={finalCtaRef}>
        <AxFinalCta onConsult={() => openProgram('AX 결합 성장자금형')} />
      </div>

      <LegalFooter />

      {/* Mobile sticky CTA — 데스크톱 헤더 CTA와 동시 노출 안 됨(sm:hidden). 최종 CTA 노출 시 숨김. */}
      {showBar && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <div className="flex items-center gap-2">
            <Link to="/business-diagnosis" className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[0.95rem] font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
              <span aria-hidden>🩺</span> 3분 기업진단
            </Link>
            <a href={consultLinks.kakaoChat} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-amber-100">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-amber-500" fill="currentColor" aria-hidden><path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9 0 .1 0 .3.2.4.1.1.3 0 .4 0 .5-.1 2.8-1.9 3.3-2.2.6.1 1.2.1 1.8.1 5.1 0 9.2-3.3 9.2-7.4S17.1 3.4 12 3.4z" /></svg>
              상담
            </a>
          </div>
        </div>
      )}

      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source="경영지원 서비스몰"
        heading="상담 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
        showContactMethod
        showCompanyFields
        programSelect
        preselectProgram={preselectProgram}
      />
    </div>
  )
}
