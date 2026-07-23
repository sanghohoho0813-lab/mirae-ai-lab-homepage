import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import AxHero from '../components/ax/AxHero'
import AxTransform from '../components/ax/AxTransform'
import AxProcessSection from '../components/ax/AxProcessSection'
import AxIndustryShowcase from '../components/ax/AxIndustryShowcase'
import AxResults from '../components/ax/AxResults'
import AxDifference from '../components/ax/AxDifference'
import AxFinalCta from '../components/ax/AxFinalCta'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { consultLinks } from '../config/businessInfo'
import { paymentsEnabled } from '../config/commerce'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { CORE_PROGRAMS } from '../data/corePrograms'

// 중소기업 대표용 메인 페이지 (8섹션 압축본) — "정책자금 컨설팅 + 실제 AX 시스템 구축"을
// 5초 안에: 기업진단 → 정책자금 전략 → 인증·근거 정리 → 실제 업무 AX 시스템 구축 흐름으로 전달.
// 8개 흐름: Hero → 문제→화면 → 진행6단계 → 업종예시 → 결과물·수준 → 프로그램 → 차별점 → 최종CTA (헤더·푸터 별도)
// 가격·설명은 corePrograms.ts 단일 소스 재사용(하드코딩 금지). 이미지 반복·데이터는 axShowcase.ts.

// 핵심 프로그램 비교 — 6항목(세부는 정책자금 상세에서)
const compareRows: { label: string; cells: string[] }[] = [
  { label: '시작비용', cells: ['500,000원', '착수금 500,000원', '레퍼런스 참여가 1,000,000원'] },
  { label: '성과보수', cells: ['없음', '조달액의 3%', '조달액의 5% · 최대 1,500만원'] },
  { label: '자금 방향 진단', cells: ['O', 'O', 'O'] },
  { label: '전체 진행관리', cells: ['—', 'O', 'O'] },
  { label: 'AX 프로토타입·MVP', cells: ['—', '—', 'O'] },
  { label: '추천 진행방식', cells: ['직접 진행', '전체 위임', '자금+AX 결합'] },
]

const homeFaqs = [
  { q: '정책자금 승인이나 인증 취득을 보장하나요?', a: '아니요. 승인·선정·취득은 기관 심사 사항이며, AX 구축이 자금 승인을 보장하지 않습니다. 저희는 가능성 진단과 신청 전략, 평가받을 근거 정리, 진행 관리를 돕습니다.' },
  { q: '보여주신 화면은 실제 고객사 화면인가요?', a: '아니요. 구축 가능 범위를 보여드리기 위해 가상 업종 기준으로 직접 설계·구현한 프론트엔드 프로토타입 예시입니다. 실제 구축 화면과 범위는 기업 인터뷰 후 기업별 업무에 맞춰 결정됩니다.' },
  { q: '기업진단·자금전략(500,000원)만 이용해도 되나요?', a: '네. 이 단계만 이용하고 직접 진행하셔도 되며, 성과보수가 붙지 않습니다. 자금 방향·기관·보완사항·실행 순서가 정리된 결과 요약본이 남습니다.' },
  { q: 'AX 결합 성장자금형은 어떻게 선정되나요?', a: '적합성 검토 및 계약 확정 순으로 초기 10개사를 선정합니다. 조달 목표금액 1억원 이상 성장기업에 권장하며, 신청 시 바로 결제되지 않고 검토·승인 이후 착수합니다. 특허는 포함 서비스가 아니며 별도 견적 또는 전문가 연계입니다.' },
]

// 성장 모듈 — 진단 후 필요할 때 연결되는 실행 항목(개별 가격·CTA 없음). 드로어 #module-* 앵커와 일치.
const GROWTH_MODULES: { id: string; no: string; title: string; items: string[]; accent: { chip: string; no: string } }[] = [
  { id: 'module-innovation', no: '01', title: '기술·혁신 기반', items: ['벤처확인', '기업부설연구소·연구개발전담부서', '이노비즈', '특허·소프트웨어 저작권 연계'], accent: { chip: 'bg-violet-50 text-violet-700 ring-violet-200', no: 'text-violet-600' } },
  { id: 'module-trust', no: '02', title: '경영·대외 신뢰', items: ['메인비즈', 'ISO 인증', '고용지원금 점검'], accent: { chip: 'bg-blue-50 text-blue-700 ring-blue-200', no: 'text-blue-600' } },
  { id: 'module-digital', no: '03', title: '디지털 실행', items: ['홈페이지', '소형 업무자동화', '작동형 AX 프로토타입', '운영 시스템 고도화'], accent: { chip: 'bg-teal-50 text-teal-700 ring-teal-200', no: 'text-teal-600' } },
  { id: 'module-finance', no: '04', title: '재무·전문가 연계', items: ['가지급금·가수금', '미처분이익잉여금', '대표자 보수·퇴직금', '주주구조', '세무·노무·법무 전문가 검토'], accent: { chip: 'bg-slate-100 text-slate-700 ring-slate-300', no: 'text-slate-500' } },
]

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
  const [preselectProgram, setPreselectProgram] = useState<string | undefined>(undefined)
  const location = useLocation()
  const navigate = useNavigate()

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

  function startProgramA() {
    if (paymentsEnabled) navigate('/checkout/funding-consulting')
    else openProgram('기업진단·자금전략')
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
            <Link to="/business-diagnosis" className="transition-colors hover:text-slate-900">기업진단</Link>
            <Link to="/business-services/funding-consulting" className="transition-colors hover:text-slate-900">자금전략</Link>
            <button type="button" onClick={() => scrollToId('industry')} className="transition-colors hover:text-slate-900">AX 구축</button>
            <button type="button" onClick={() => scrollToId('process')} className="transition-colors hover:text-slate-900">진행 방식</button>
            <button type="button" onClick={() => scrollToId('programs')} className="transition-colors hover:text-slate-900">프로그램</button>
            <button type="button" onClick={() => scrollToId('difference')} className="transition-colors hover:text-slate-900">차별점</button>
            <button type="button" onClick={() => openProgram(undefined)} className="transition-colors hover:text-slate-900">문의</button>
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
      <AxHero onShowcase={() => scrollToId('industry')} />

      {/* ── S2. 문제 → AX 화면 (기존 S2+S5 통합) ──────────────────── */}
      <AxTransform />

      {/* ── S3. 컨설팅 진행 6단계 (S9 디자인방향 흡수) ────────────── */}
      <AxProcessSection />

      {/* ── S4. 업종별 AX 구축 예시 (S10 갤러리 흡수) ─────────────── */}
      <AxIndustryShowcase />

      {/* ── S5. 결과물 + 구축 수준 (기존 S6+S7 통합) ──────────────── */}
      <AxResults />

      {/* ── S6. 3개 핵심 프로그램 (카드 + 비교 + 초기10개사, 단일 섹션) ── */}
      <section id="programs" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>AX 결합 성장자금 프로그램</p>
          <h2 className={h2Class}>어디까지 맡길지에 따라, 3가지 진행 방식</h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-slate-500">
            자금조달이 시작점입니다. 진단만 받고 직접 진행할 수도, 전체를 위임할 수도, 자금과 AX 구축을 함께 진행할 수도 있습니다.
          </p>

          {/* 3개 프로그램 카드 */}
          <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-3">
            {CORE_PROGRAMS.map((p) => {
              const featured = p.key === 'C'
              return (
                <div
                  key={p.key}
                  id={`core-${p.key}`}
                  className={`flex scroll-mt-24 flex-col rounded-3xl border-2 bg-white p-6 ${featured ? 'border-teal-500 shadow-xl shadow-teal-500/10' : 'border-slate-200 shadow-sm'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl text-base font-black ${featured ? 'bg-teal-500 text-white' : 'bg-slate-900 text-white'}`}>{p.key}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${p.key === 'A' ? 'bg-emerald-50 text-emerald-700' : featured ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>{p.label}</span>
                  </div>
                  <h3 className="mt-4 text-[1.3rem] font-black leading-snug tracking-tight text-slate-900">{p.name}</h3>
                  <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-500">{p.catchline}</p>

                  {p.key === 'C' && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['조달 목표 1억원 이상 권장', '적합기업 선별', '초기 10개사', '실제 업무 적용'].map((b) => (
                        <span key={b} className="rounded-full bg-teal-50 px-2 py-0.5 text-[0.7rem] font-black text-teal-700 ring-1 ring-inset ring-teal-200">{b}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 border-y border-slate-100 py-4">
                    {p.priceTop && <p className="text-[0.78rem] font-semibold text-slate-400">{p.priceTop.label} <span className="font-bold text-slate-500">{p.priceTop.value}</span></p>}
                    {p.priceMainLabel && <p className={`mt-1 text-[0.78rem] font-black ${featured ? 'text-teal-600' : 'text-slate-500'}`}>{p.priceMainLabel}</p>}
                    <p className={`mt-0.5 text-[1.6rem] font-black tracking-tight ${featured ? 'text-teal-600' : 'text-slate-900'}`}>{p.priceMain}</p>
                    <p className="mt-1 text-[0.9rem] font-bold text-slate-600">{p.priceSub}</p>
                  </div>

                  <ul className="mt-4 flex-1 space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-[0.9rem] leading-snug text-slate-600">
                        <span className={`mt-0.5 shrink-0 font-black ${featured ? 'text-teal-500' : 'text-slate-400'}`} aria-hidden>✓</span>{pt}
                      </li>
                    ))}
                  </ul>
                  {p.key === 'A' && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[0.82rem] font-semibold leading-snug text-emerald-800">이 단계만 이용하고 직접 진행하셔도 됩니다.</p>}

                  <div className="mt-5">
                    {p.key === 'A' ? (
                      <button type="button" onClick={startProgramA} className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3.5 text-[0.95rem] font-black text-white shadow-sm transition-transform hover:-translate-y-0.5">
                        {paymentsEnabled ? '500,000원 결제하고 시작하기' : '기업진단 신청하기'}
                      </button>
                    ) : (
                      <button type="button" onClick={() => openProgram(p.name)} className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-[0.95rem] font-black shadow-sm transition-transform hover:-translate-y-0.5 ${featured ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-slate-900 text-white'}`}>
                        {p.ctaLabel}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 비교표 (데스크톱 표 / 모바일 카드) */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:block">
            <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr]">
              <div className="bg-slate-100 px-4 py-3" />
              {CORE_PROGRAMS.map((p) => (
                <div key={p.key} className={`px-3 py-3 text-center ${p.key === 'C' ? 'bg-teal-600' : 'bg-slate-800'}`}>
                  <p className={`text-[0.68rem] font-bold ${p.key === 'C' ? 'text-teal-200' : 'text-slate-400'}`}>{p.key}</p>
                  <p className="text-[0.86rem] font-black leading-tight text-white">{p.name}</p>
                </div>
              ))}
            </div>
            {compareRows.map((row, ri) => (
              <div key={row.label} className={`grid grid-cols-[1.1fr_1fr_1fr_1fr] ${ri % 2 ? 'bg-slate-50/70' : 'bg-white'}`}>
                <div className="flex items-center bg-slate-100/70 px-4 py-3"><p className="text-[0.82rem] font-black text-slate-600">{row.label}</p></div>
                {row.cells.map((cell, ci) => (
                  <div key={ci} className={`flex items-center justify-center px-3 py-3 text-center ${ci === 2 ? 'bg-teal-50/60' : ''}`}>
                    <p className={`text-[0.85rem] font-bold leading-tight ${cell === 'O' ? 'text-teal-600' : cell === '—' ? 'text-slate-300' : 'text-slate-700'}`}>{cell}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-7 space-y-3 sm:hidden">
            {CORE_PROGRAMS.map((p, pi) => (
              <div key={p.key} className={`rounded-2xl border-2 p-4 ${p.key === 'C' ? 'border-teal-500' : 'border-slate-200'}`}>
                <p className="text-[1.05rem] font-black text-slate-900">{p.key}. {p.name}</p>
                <dl className="mt-2.5 space-y-1.5">
                  {compareRows.map((row) => (
                    <div key={row.label} className="flex gap-2 text-[0.85rem]">
                      <dt className="w-[7.5rem] shrink-0 font-semibold text-slate-500">{row.label}</dt>
                      <dd className={`min-w-0 font-bold ${row.cells[pi] === 'O' ? 'text-teal-600' : row.cells[pi] === '—' ? 'text-slate-300' : 'text-slate-800'}`}>{row.cells[pi]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* AX 결합 성장자금형 · 초기 10개사 — 참여조건 + 혜택 (별도 CTA 밴드 없이 통합) */}
          <div className="mt-8 rounded-3xl border border-teal-200 bg-white p-5 sm:p-7">
            <p className="text-[0.78rem] font-black uppercase tracking-widest text-teal-600">AX 결합 성장자금형 · 초기 10개사</p>
            <p className="mt-1 text-[1.05rem] font-black text-slate-900">실제 사용경험과 사례를 함께 만드는 참여 프로그램입니다.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['실제 업무자료 제공', '대표자 또는 담당자 테스트 참여', '익명 사례 활용 및 종료 후 상세 피드백'].map((c) => (
                <div key={c} className="rounded-xl bg-slate-50 px-4 py-3 text-center text-[0.86rem] font-semibold leading-snug text-slate-700 ring-1 ring-slate-200">{c}</div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
              <p className="text-[0.82rem] font-black text-violet-700">AX 성장형 참여기업 전용 우대</p>
              <p className="mt-1 text-[0.9rem] font-bold text-slate-800">벤처확인 준비 지원 10% 우대 · 기업부설연구소·연구개발전담부서 설립 지원 10% 우대</p>
              <p className="mt-1.5 text-[0.78rem] leading-snug text-slate-500">자동 포함이 아니며 기업진단 후 필요한 경우에만 제안합니다. 특허 출원은 포함 서비스가 아닌 별도 견적·전문가 연계입니다.</p>
            </div>
            <p className="mt-3 text-[0.8rem] font-semibold text-slate-500">적합성 검토 및 계약 확정 순으로 초기 10개사를 선정합니다. <Link to="/business-services/funding-consulting" className="text-teal-700 underline underline-offset-2 hover:text-teal-800">참여 조건·기본 범위 자세히 보기 →</Link></p>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            성과보수(3%·5%)는 추가 진행을 선택하고 실제로 자금이 조달된 경우에만 발생하며, 기업진단·자금전략(500,000원)에는 자동으로 붙지 않습니다. 자금 승인은 기관 심사 사항이며 AX 구축이 승인을 보장하지 않습니다. 세부 기준은 개별 계약서에서 확정합니다.
          </p>

          {/* 성장 모듈 — 프로그램 섹션 하위 컴팩트 영역(대형 아코디언 아님). 드로어 #module-* 앵커와 일치. */}
          <div id="growth-modules" className="mt-10 scroll-mt-24 border-t border-slate-200 pt-8">
            <p className="text-[0.8rem] font-black text-slate-400">프로그램은 진행 방식이고, 성장 모듈은 진단 결과에 따라 연결되는 실행 항목입니다.</p>
            <h3 className="mt-1.5 text-[1.3rem] font-black tracking-tight text-slate-900 sm:text-[1.5rem]">기업진단 후, 필요한 성장 모듈만 연결합니다.</h3>
            <p className="mt-2 max-w-2xl text-[0.92rem] leading-relaxed text-slate-500">모든 서비스를 한꺼번에 제안하지 않습니다. 기업진단 결과에 따라 자금조달과 성장에 필요한 항목만 우선순위대로 연결합니다.</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GROWTH_MODULES.map((m) => (
                <div key={m.id} id={m.id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.95rem] font-black tabular-nums ${m.accent.no}`}>{m.no}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[0.7rem] font-black ring-1 ring-inset ${m.accent.chip}`}>성장 모듈</span>
                  </div>
                  <p className="mt-2 text-[1.02rem] font-black leading-snug text-slate-900">{m.title}</p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-500">{m.items.join(' · ')}</p>
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
        <div className="mx-auto max-w-3xl px-5 py-11 sm:px-6 sm:py-14">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-6 space-y-3">
            {homeFaqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-base font-bold text-slate-900">Q. {f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
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
