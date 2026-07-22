import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import CouponSignupBanner from '../components/CouponSignupBanner'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { consultLinks } from '../config/businessInfo'
import { paymentsEnabled } from '../config/commerce'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { businessPackages, MODULE_GROUP_LABELS, type BusinessPackage, type ModuleGroup } from '../data/businessPackages'
import { CORE_PROGRAMS } from '../data/corePrograms'

// 중소기업 대표 서비스 페이지 (2단계 개편) — "17개 상품 나열형 쇼핑몰"에서
// "자금조달을 입구로 AX 운영혁신과 성장 모듈을 한 흐름으로 제안하는 성장 실행사"로.
// 가격·설명은 corePrograms.ts + businessPackages 분류 필드를 단일 소스로 재사용(하드코딩 금지).
// 순서(압축본): Hero → 상황선택 → 핵심3 → 비교(6항목) → AX+10%혜택(병합) → 무료진단 → 모듈4그룹(접힘) → 신뢰 → FAQ+최종CTA(병합).
// ※ 참여조건·계약·제공범위 상세는 정책자금 상세페이지에서 설명(역할 중복 방지).

// 대표자 신뢰도 — 실제 확인된 정보만(승인율·고객수 등 임의 수치 금지)
const trustStats: { value: string; label: string; sub?: string }[] = [
  { value: '100억원+', label: '누적 자금조달 지원', sub: '지원금·세금 환급 포함' },
  { value: '9년', label: '세무·노무·법무·자금 현장 경험' },
  { value: 'ISO 3종', label: '9001·14001·45001 심사원' },
  { value: '한 흐름', label: '정책자금부터 AX까지 설계' },
]
const trustAwards = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상', detail: '경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국을 빛낸 사회공헌 K-컬처 나눔봉사공헌대상', detail: '벤처부문' },
]

const homeFaqs = [
  { q: '정책자금 승인이나 인증 취득을 보장하나요?', a: '아니요. 승인·선정·취득은 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략, 준비 방향, 진행 관리를 돕습니다.' },
  { q: '기업진단·자금전략(500,000원)만 이용해도 되나요?', a: '네. 이 단계만 이용하고 직접 진행하셔도 되며, 성과보수가 붙지 않습니다. 자금 방향·기관·보완사항·실행 순서가 정리된 결과 요약본이 남습니다.' },
  { q: 'AX 결합 성장자금형은 아무나 진행하나요?', a: '적합성 검토를 통과한 기업만 선별 진행합니다. 조달 목표금액이 1억원 이상인 성장기업에 권장하며, 신청 시 바로 결제되지 않고 적합성 검토·참여 승인 이후 착수합니다.' },
  { q: '인증·연구소 같은 모듈은 꼭 함께 해야 하나요?', a: '아니요. 성장 모듈은 기업진단 결과에 따라 필요한 기업에만 추천합니다. 단독으로 진행할 수도 있고, AX 성장형 참여기업은 벤처확인·연구개발조직 설립 지원을 각각 10% 할인 조건으로 함께 진행할 수 있습니다.' },
]

// 상황 선택 → 핵심 프로그램 카드
const situations = [
  { q: '우리 회사가 어떤 자금을 준비할 수 있는지 알고 싶어요.', to: 'core-A', tag: '기업진단·자금전략' },
  { q: '자료 준비부터 전체 진행까지 맡기고 싶어요.', to: 'core-B', tag: '자금조달 실행형' },
  { q: '자금조달과 회사 업무혁신을 함께 준비하고 싶어요.', to: 'core-C', tag: 'AX 결합 성장자금형' },
]

// 핵심 프로그램 비교 — 대표 페이지에서는 6항목만(세부 자료지원·유지관리는 정책자금 상세에서 설명)
const compareRows: { label: string; cells: string[] }[] = [
  { label: '시작비용', cells: ['500,000원', '착수금 500,000원', '레퍼런스 참여가 1,000,000원'] },
  { label: '성과보수', cells: ['없음', '조달액의 3%', '조달액의 5% · 최대 1,500만원'] },
  { label: '자금 방향 진단', cells: ['O', 'O', 'O'] },
  { label: '전체 진행관리', cells: ['—', 'O', 'O'] },
  { label: 'AX 프로토타입·MVP', cells: ['—', '—', 'O'] },
  { label: '추천 진행방식', cells: ['직접 진행', '전체 위임', '자금+AX 결합'] },
]

// 성장 모듈 4그룹 — accent·아이콘·전문가 연계 텍스트 항목
type GroupAccent = { chip: string; no: string; ring: string; soft: string }
const GROUP_META: { key: ModuleGroup; no: string; icon: string; blurb: string; accent: GroupAccent; expertItems?: string[] }[] = [
  { key: 'tech', no: '01', icon: '🔬', blurb: '평가받을 기술·성장 근거를 만듭니다', accent: { chip: 'bg-violet-50 text-violet-700 ring-violet-200', no: 'text-violet-600', ring: 'ring-violet-200', soft: 'bg-violet-50/60' }, expertItems: ['특허 출원 연계 (별도 견적)'] },
  { key: 'trust', no: '02', icon: '🛡️', blurb: '대외 신뢰와 심사 가점을 확보합니다', accent: { chip: 'bg-blue-50 text-blue-700 ring-blue-200', no: 'text-blue-600', ring: 'ring-blue-200', soft: 'bg-blue-50/60' } },
  { key: 'digital', no: '03', icon: '⚙️', blurb: '실제 업무를 시스템으로 바꿉니다', accent: { chip: 'bg-teal-50 text-teal-700 ring-teal-200', no: 'text-teal-600', ring: 'ring-teal-200', soft: 'bg-teal-50/60' } },
  { key: 'finance', no: '04', icon: '📊', blurb: '재무 리스크를 전문가와 정리합니다', accent: { chip: 'bg-slate-100 text-slate-700 ring-slate-300', no: 'text-slate-500', ring: 'ring-slate-200', soft: 'bg-slate-50' }, expertItems: ['가수금 정리', '대표자 보수·퇴직금 설계', '주주구조 정비', '세무·노무·법무 전문가 검토'] },
]

// priceModel 을 UI 문구로 (하드코딩 대신 데이터 기반)
function priceLabel(pkg: BusinessPackage): string {
  if (pkg.priceModel === 'quote') return '기업진단 후 범위·견적 확정'
  if (pkg.priceModel === 'from') return `${pkg.price.replace(/~$/, '')}부터 · 상태·범위에 따라 확정`
  return pkg.price // fixed
}

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[2.1rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BusinessServicesPage() {
  const { likes, cart } = useSavedItems()
  const savedCount = likes.length + cart.length
  const [historyCount] = useState(() => loadHistory().length)
  const [showBar, setShowBar] = useState(false)
  const [consultOpen, setConsultOpen] = useState(false)
  const [preselectProgram, setPreselectProgram] = useState<string | undefined>(undefined)
  const [openGroup, setOpenGroup] = useState<ModuleGroup | null>(null)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = '중소기업 대표님을 위한 기업 성장 설계 | 미래 AI 랩'
  }, [])

  // 딥링크: ?group=tech|trust|digital|finance → 모듈 그룹 열기 + 스크롤 / #hash 이동
  useEffect(() => {
    const g = searchParams.get('group') as ModuleGroup | null
    if (g && GROUP_META.some((m) => m.key === g)) {
      setOpenGroup(g)
      setTimeout(() => scrollToId('modules'), 60)
    } else if (searchParams.get('category')) {
      setTimeout(() => scrollToId('modules'), 60)
    }
  }, [searchParams])

  useEffect(() => {
    if (location.hash) setTimeout(() => scrollToId(location.hash.slice(1)), 60)
  }, [location.hash])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 480)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const moduleProducts = useMemo(() => {
    const map = {} as Record<ModuleGroup, BusinessPackage[]>
    for (const meta of GROUP_META) map[meta.key] = businessPackages.filter((p) => p.tier === 'module' && p.moduleGroup === meta.key)
    return map
  }, [])

  function openProgram(programName?: string) {
    setPreselectProgram(programName)
    setConsultOpen(true)
  }

  // 핵심 프로그램 A CTA — 결제 활성 시 체크아웃, 아니면 상담(진행방식 프리셀렉트)
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
          <nav className="hidden items-center gap-5 text-[0.95rem] font-medium text-slate-600 xl:flex">
            <button type="button" onClick={() => scrollToId('core')} className="transition-colors hover:text-slate-900">핵심 프로그램</button>
            <button type="button" onClick={() => scrollToId('modules')} className="transition-colors hover:text-slate-900">성장 모듈</button>
            <Link to="/business-diagnosis" className="transition-colors hover:text-slate-900">무료 진단</Link>
            <button type="button" onClick={() => scrollToId('faq')} className="transition-colors hover:text-slate-900">FAQ</button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[0.85rem] font-bold text-cyan-800 transition-colors hover:bg-cyan-100 lg:inline-flex">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 3h8l2 2v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5z" /><path d="M9 9h6M9 13h6M9 17h4" /></svg>
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            <Link to="/saved" aria-label={`찜한 상품·장바구니 ${savedCount}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
              {savedCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{savedCount > 99 ? '99+' : savedCount}</span>}
            </Link>
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex">3분 성장진단</Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      <CouponSignupBanner />

      {/* ── 1. Hero — 정체성 ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
            정책자금 · 기업인증 · AX 경영컨설팅
          </span>
          <h1 className="mt-5 text-[2rem] font-black leading-[1.2] tracking-tight text-white sm:text-[3.1rem] sm:leading-[1.14]">
            자금만 신청하지 않습니다.<br /><span className="text-teal-300">기업이 성장할 구조</span>까지 함께 만듭니다.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-slate-300 sm:text-lg">
            기업 현황과 자금 가능성을 먼저 진단하고, 필요한 경우 기술·인증 기반과 실제 업무자동화 시스템까지 한 흐름으로 연결합니다.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              <span aria-hidden>🩺</span> 3분 기업 성장진단
            </Link>
            <button type="button" onClick={() => scrollToId('start')} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
              진행 방식 살펴보기
            </button>
          </div>
          <dl className="mx-auto mt-11 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-4">
            {trustStats.map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-[1.5rem] font-black leading-none tracking-tight text-white sm:text-[1.9rem]">{s.value}</dd>
                <dt className="mt-1.5 text-[0.8rem] font-medium leading-snug text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 2. 지금 필요한 것은 어느 쪽인가요? ───────────────────── */}
      <section id="start" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[2rem]">지금 필요한 것은 어느 쪽인가요?</h2>
          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {situations.map((s, i) => (
              <button
                key={s.to}
                type="button"
                onClick={() => scrollToId(s.to)}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-black text-white">{i + 1}</span>
                <p className="mt-3 flex-1 text-[1.05rem] font-bold leading-snug text-slate-800">“{s.q}”</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[0.9rem] font-bold text-blue-600">
                  {s.tag} <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 핵심 프로그램 3개 ─────────────────────────────────── */}
      <section id="core" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>핵심 프로그램</p>
          <h2 className={h2Class}>가장 먼저, 3가지 진행 방식 중에서</h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-slate-500">
            자금조달이 시작점입니다. 어디까지 맡길지에 따라 방식이 달라지며, 필요한 기업에는 AX 운영혁신과 성장 모듈을 이어서 제안합니다.
          </p>
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
        </div>
      </section>

      {/* ── 4. 핵심 프로그램 비교 ─────────────────────────────────── */}
      <section id="compare" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[2rem]">어디까지 맡길지에 따라<br className="sm:hidden" /> 진행 방식이 달라집니다</h2>
          {/* 데스크톱: 표 / 모바일: 카드형 세로 비교 */}
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
          {/* 모바일 카드형 */}
          <div className="mt-7 space-y-4 sm:hidden">
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
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            성과보수(3%·5%)는 추가 진행을 선택하고 실제로 자금이 조달된 경우에만 발생하며, 기업진단·자금전략(500,000원)에는 자동으로 붙지 않습니다. 세부 산정 기준과 지급 시점은 개별 계약서에서 확정합니다.
          </p>
        </div>
      </section>

      {/* ── 5. AX 초기 10개사 프로그램 (+ 기술기반 10% 혜택 병합) ───── */}
      <section id="ax-launch" className="scroll-mt-16 border-t border-slate-200 bg-slate-900">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
          <p className="text-center text-xs font-black uppercase tracking-widest text-teal-300">AX 결합 성장자금형 · 초기 10개사</p>
          <h2 className="mt-2 text-center text-2xl font-black tracking-tight text-white sm:text-[2.1rem]">초기 10개 기업과 실제 AX 사례를 만듭니다</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[1rem] leading-relaxed text-slate-300">
            단순 시연용 화면이 아니라, 실제 업무에서 사용하고 결과를 측정할 수 있는 시스템을 함께 만듭니다.
          </p>
          {/* 가격·조건 요약 칩 (우선 노출) */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {[
              '레퍼런스 참여가 1,000,000원',
              '정식 운영 예정 착수금 3,000,000원',
              '실제 조달금액의 5%',
              '성과보수 최대 15,000,000원',
              '조달 목표 1억원 이상 권장',
              '적합기업 선별 진행',
            ].map((c) => (
              <span key={c} className="rounded-full bg-white/10 px-3 py-1.5 text-[0.8rem] font-bold text-slate-100 ring-1 ring-inset ring-white/15">{c}</span>
            ))}
          </div>
          {/* 참여조건 — 핵심 3문장만 */}
          <div className="mx-auto mt-6 grid max-w-2xl gap-2.5 sm:grid-cols-3">
            {['실제 업무자료 제공', '대표자 또는 담당자 테스트 참여', '익명 사례 활용 및 종료 후 상세 피드백'].map((c) => (
              <div key={c} className="rounded-xl bg-white/5 px-4 py-3 text-center text-[0.86rem] font-semibold leading-snug text-slate-200 ring-1 ring-white/10">{c}</div>
            ))}
          </div>
          {/* 추가 혜택 — 기술기반 10% (동일 섹션 하단, 소형 블록) */}
          <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-violet-400/25 bg-violet-500/10 p-4 sm:p-5">
            <p className="text-[0.82rem] font-black text-violet-200">AX 성장형 참여기업 전용 추가 혜택</p>
            <p className="mt-1.5 text-[0.9rem] font-bold text-white">벤처확인 준비 10% 할인 · 기업부설연구소·연구개발전담부서 설립 지원 10% 할인</p>
            <p className="mt-1.5 text-[0.78rem] leading-snug text-slate-400">자동 포함이 아니며, 기업진단 후 필요한 경우에만 제안합니다. 특허 출원 연계는 별도 견적입니다.</p>
          </div>
          <div className="mt-7 flex flex-col items-center gap-3">
            <button type="button" onClick={() => openProgram('AX 결합 성장자금형')} className="shine-cta inline-flex items-center justify-center rounded-xl bg-teal-400 px-7 py-3.5 text-base font-black text-slate-900 transition-transform hover:-translate-y-0.5">
              AX 성장형 적합성 확인
            </button>
            <Link to="/business-services/funding-consulting" className="text-[0.85rem] font-semibold text-slate-400 underline underline-offset-4 hover:text-slate-200">참여 조건·기본 범위·세부 사항 자세히 보기 →</Link>
          </div>
        </div>
      </section>

      {/* ── 6. 무료 3분 기업 성장진단 ─────────────────────────────── */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-blue-50/60 to-white">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-6 sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3.5 py-1.5 text-[0.82rem] font-black text-blue-700">무료 · 비회원 가능 · 3분</span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-[2.1rem]">무엇부터 준비할지 먼저 확인해보세요</h2>
          <p className="mx-auto mt-3 max-w-lg text-[1.02rem] leading-relaxed text-slate-600">
            지금 필요한 것이 자금인지, 기술·인증인지, AX 운영혁신인지 3분 진단으로 방향을 정리해 드립니다.
          </p>
          <Link to="/business-diagnosis" className="shine-cta mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/25 transition-transform hover:-translate-y-0.5">
            <span aria-hidden>🩺</span> 3분 기업 성장진단 시작하기
          </Link>
        </div>
      </section>

      {/* ── 7. 성장 모듈 4개 그룹 ─────────────────────────────────── */}
      <section id="modules" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>성장 모듈</p>
          <h2 className={h2Class}>진단 결과에 따라 조합하는 성장 요소</h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-slate-500">
            지금 당장 모두 구매하는 상품이 아닙니다. 기업진단 결과에 따라 필요한 기업에만 아래 모듈을 이어서 제안합니다.
          </p>
          <div className="mt-8 space-y-3">
            {GROUP_META.map((meta) => {
              const items = moduleProducts[meta.key]
              const isOpen = openGroup === meta.key
              return (
                <div key={meta.key} className={`overflow-hidden rounded-2xl border bg-white ring-1 ${meta.accent.ring} border-transparent`}>
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : meta.key)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors sm:px-5 ${isOpen ? meta.accent.soft : 'hover:bg-slate-50'}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`text-[1.1rem] font-black tabular-nums ${meta.accent.no}`}>{meta.no}</span>
                      <span aria-hidden className="text-xl">{meta.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-[1.05rem] font-black leading-tight text-slate-900">{MODULE_GROUP_LABELS[meta.key]}</span>
                        <span className="block text-[0.85rem] font-medium leading-snug text-slate-500">{meta.blurb}</span>
                        {/* 접힘 상태 미리보기 — 대표 항목 2~3개 */}
                        <span className="mt-0.5 block truncate text-[0.78rem] leading-snug text-slate-400">{items.slice(0, 3).map((p) => p.name).join(' · ')}</span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className={`hidden text-[0.8rem] font-bold sm:inline ${meta.accent.no}`}>{isOpen ? '접기' : '자세히 보기'}</span>
                      <svg viewBox="0 0 24 24" className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-3 py-3 sm:px-4">
                      <ul className="space-y-1.5">
                        {items.map((pkg) => (
                          <li key={pkg.id}>
                            <Link to={`/business-services/${pkg.slug}`} className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50">
                              <span className="min-w-0">
                                <span className="block text-[0.98rem] font-bold leading-snug text-slate-900">{pkg.name}</span>
                                <span className="mt-0.5 block text-[0.85rem] leading-snug text-slate-500">{pkg.short}</span>
                                <span className="mt-1.5 flex flex-wrap gap-1">
                                  {(pkg.moduleStatus ?? []).map((st) => (
                                    <span key={st} className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold ring-1 ring-inset ${st === 'AX 참여기업 10% 할인' ? 'bg-violet-50 text-violet-700 ring-violet-200' : `${meta.accent.chip}`}`}>{st}</span>
                                  ))}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block text-[0.82rem] font-black text-slate-700">{priceLabel(pkg)}</span>
                                <span className="mt-0.5 inline-flex items-center gap-0.5 text-[0.8rem] font-bold text-blue-600">자세히 <span aria-hidden>→</span></span>
                              </span>
                            </Link>
                          </li>
                        ))}
                        {meta.expertItems?.map((ex) => (
                          <li key={ex} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[0.9rem] text-slate-500">
                            <span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold ring-1 ring-inset ${meta.accent.chip}`}>전문가 연계</span>
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-5 text-[0.82rem] leading-relaxed text-slate-400">
            표기 가격은 기준 가격이며, ‘기준가부터’·‘기업진단 후 견적’ 항목은 기업 상태와 진행 범위에 따라 확정됩니다.
          </p>
        </div>
      </section>

      {/* ── 8. 대표자 신뢰 ───────────────────────────────────────── */}
      <section id="trust" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필 사진" loading="lazy" decoding="async" width={200} height={200} className="h-16 w-16 shrink-0 rounded-full object-cover shadow ring-2 ring-slate-200 sm:h-20 sm:w-20" />
              <div className="min-w-0">
                <p className="text-[1.05rem] font-black text-slate-900">미래 AI 랩 대표 · 미래경영지원센터</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trustAwards.map((a) => (
                    <span key={a.title} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.78rem] font-semibold text-slate-600">
                      <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.66rem] font-black text-amber-300">{a.year}</span>
                      {a.title}<span className="text-slate-400"> · {a.detail}</span>
                    </span>
                  ))}
                </div>
                <a href="https://youtube.com/channel/UCjXWwM0_25vl1Mpr2Pc5amQ?si=vBv8_7d3w8Uk5uGA" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-slate-700 hover:text-slate-900" aria-label="유튜브 김팀장의 경영노트 채널 (새 탭에서 열림)">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><rect x="1.5" y="5" width="21" height="14" rx="3.5" fill="#FF0000" /><path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="#fff" /></svg>
                  유튜브 ‘김팀장의 경영노트’ <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ + 최종 CTA (병합) ─────────────────────────────── */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
          <p className={eyebrow}>자주 묻는 질문</p>
          <h2 className={h2Class}>대표님들이 자주 묻는 질문</h2>
          <div className="mt-7 space-y-3">
            {homeFaqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-base font-bold text-slate-900">Q. {f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
          {/* 최종 CTA — 동일 섹션 내 마무리 카드 */}
          <div className="mt-8 rounded-3xl bg-slate-900 p-7 text-center sm:p-9">
            <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">내 회사에 맞는 방식부터 확인해보세요</h3>
            <p className="mx-auto mt-2.5 max-w-md text-[0.98rem] leading-relaxed text-slate-300">자금·기술·인증·AX 중 무엇부터인지, 3분 진단 또는 상담으로 정리해 드립니다.</p>
            <div className="mx-auto mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Link to="/business-diagnosis" className="flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-3.5 text-base font-black text-slate-900 transition-transform hover:-translate-y-0.5"><span aria-hidden>🩺</span> 3분 기업 성장진단</Link>
              <button type="button" onClick={() => openProgram(undefined)} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">상담 신청하기</button>
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />

      {/* Mobile sticky CTA */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <Link to="/business-diagnosis" className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-base font-bold text-white">3분 성장진단</Link>
          <a href={consultLinks.kakaoChat} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#FEE500] px-4 py-3.5 text-base font-bold text-[#191919]">카톡 상담</a>
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
