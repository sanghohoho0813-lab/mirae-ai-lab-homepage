// 정책자금 컨설팅 — 전용 상세페이지 (3단계 최종 개편).
// /business-services/funding-consulting 라우트에서 렌더됩니다.
// 역할: 고객이 "① 방향만 정리(500,000원) / ② 전체 위임 / ③ AX 결합" 중 하나를 자연스럽게 선택하게 만드는 페이지.
// 가격·수수료는 corePrograms.ts(CORE_PROGRAMS/AX_LAUNCH) 단일 출처만 참조 — 페이지 내 별도 하드코딩 금지.
// 허위 정상가·과장 할인율 금지, 승인·조달금액 보장 표현 금지.
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeaderAccount from '../../components/account/HeaderAccount'
import LegalFooter from '../../components/LegalFooter'
import FundingCasesSection from '../../components/FundingCasesSection'
import ConsultModal from '../../components/ConsultModal'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../../lib/consultApi'
import { getPackageBySlug } from '../../data/businessPackages'
import { CORE_PROGRAMS, AX_LAUNCH } from '../../data/corePrograms'
import { consultLinks } from '../../config/businessInfo'
import { paymentsEnabled } from '../../config/commerce'

const pkg = getPackageBySlug('funding-consulting')!
const [A, B, C] = CORE_PROGRAMS // 단일 출처 (A 기업진단·자금전략 / B 자금조달 실행형 / C AX 결합 성장자금형)

const band = 'px-5 py-12 sm:py-16'
const inner = 'mx-auto max-w-[760px]'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-2.5 text-center text-[1.75rem] font-black leading-[1.3] tracking-tight text-slate-900 sm:text-[2.4rem]'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── §2 문제 공감 — 대표가 실제로 말할 법한 짧은 장면(공포 조장 금지) ──
const pains = [
  { icon: '🏦', t: '어느 기관부터 봐야 할지 모르겠습니다' },
  { icon: '📝', t: '사업계획서는 있는데, 무엇을 보완해야 할지 모르겠습니다' },
  { icon: '📉', t: '매출은 있지만 업종과 재무구조 때문에 계속 막힙니다' },
  { icon: '⚙️', t: '자금을 받으면 시스템을 만들고 싶은데, 심사는 이미 만들어진 실체를 요구합니다' },
]

// ── §3 500,000원 기본상품으로 정리되는 결과물 ──
const baseOutcomes = [
  '기업 현황 진단 요약',
  '가능한 자금과 우선 검토 기관',
  '주요 결격·보완사항',
  '준비자료 목록',
  '실행 순서',
  '대표자용 결과 요약본',
]

// ── §7 컨설팅 후 회사에 남는 결과물(그룹) ──
const outcomeGroups = [
  { label: '공식·심사용 자료', icon: '📄', items: ['기업진단 요약서', '우선 검토 자금·기관', '준비자료 목록'] },
  { label: '보완·전략 자료', icon: '🔍', items: ['보완 항목 정리', '신청 전략과 실행 순서', '예상 질문 대응자료'] },
  { label: '다음 조달 대비', icon: '🧭', items: ['향후 자금조달 일정', '신용·재무 보완 방향', '다음 신청 시점 안내'] },
]

// ── §8 단순 신청지원 vs 미래 AI 랩(담백한 좌우 비교) ──
const applyOnly = ['신청서와 제출자료 중심', '접수 이후 대응 위주', '자금 실행 시 종료']
const miraeWay = ['기업 현황과 보완요소 진단', '기관별 설명자료 구조화', '필요한 경우 기술·인증·AX 연결', '자금 이후 운영 고도화 방향 제안']

// ── §10 대표자 신뢰 — 실제 확인된 정보만 ──
const trustStats = [
  { value: '100억원+', label: '누적 자금조달 지원' },
  { value: '9년', label: '세무·노무·법무·자금 현장 경험' },
  { value: 'ISO 3종', label: '9001·14001·45001 심사원' },
]
const trustAwards = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상 · 경영컨설팅 부문' },
  { year: '2025', title: 'K-컬처 나눔봉사공헌대상 · 벤처부문' },
]

// ── §5 진행방식 비교(6항목) — 가격은 CORE_PROGRAMS 참조, 정성 항목만 로컬 문구 ──
type CompareCell = string | { main: string; sub: string }
const compareCols = [
  { key: 'A', name: A.name, badge: A.label, featured: true },
  { key: 'B', name: B.name, badge: '선택형' },
  { key: 'C', name: C.name, badge: '선별 진행' },
]
const compareRows: { label: string; cells: CompareCell[] }[] = [
  { label: '시작비용', cells: [A.priceMain, B.priceMain, { main: C.priceMain, sub: `${C.priceTop!.label} ${C.priceTop!.value}` }] },
  {
    label: '성과보수',
    cells: [
      { main: '없음', sub: '500,000원으로 종료 가능' },
      { main: '조달액의 3%', sub: '전체 진행을 맡기는 경우' },
      { main: '조달액의 5%', sub: '업무자동화·AI 구축까지 · 최대 1,500만원' },
    ],
  },
  { label: '자금 방향 진단', cells: ['O', 'O', 'O'] },
  { label: '전체 진행관리', cells: ['—', 'O', 'O'] },
  { label: 'AX 프로토타입·MVP', cells: ['—', '—', 'O'] },
  { label: '추천 진행방식', cells: ['방향 점검 후 직접 진행', '전체 위임', '자금 + AX 결합'] },
]

// ── §11 FAQ — 실제 구매 결정에 필요한 질문만 ──
const faqs = [
  { q: '500,000원 컨설팅만 이용해도 되나요?', a: '네. 기업진단·자금전략만 이용하고 직접 진행하셔도 됩니다. 이 단계에서 종료해도 추가 성과보수가 없고, 자금 방향·기관·보완사항·실행 순서가 정리된 결과 요약본이 남습니다.' },
  { q: '성과보수는 언제 발생하나요?', a: '기본 진단(500,000원)에는 성과보수가 붙지 않습니다. 전체 진행(3%)이나 AX 결합(5%)을 추가로 선택하고, 실제로 자금이 조달된 경우에만 발생합니다. 세부 산정 기준과 지급 시점은 개별 계약서에서 확정합니다.' },
  { q: '자금조달 실행형과 AX 성장형의 차이는 무엇인가요?', a: '실행형은 자료 준비부터 신청·진행 전체를 위임하는 방식입니다. AX 성장형은 여기에 실제 업무를 바꾸는 프로토타입·MVP 구축까지 함께 진행하는 방식으로, 조달 목표금액이 1억원 이상인 성장기업에 권장합니다.' },
  { q: 'AX 성장형은 모든 기업이 신청할 수 있나요?', a: '적합성 검토를 통과한 기업만 선별 진행합니다. 초기에는 실제 사례를 함께 만들 최대 10개 기업을 선정하며, 신청 시 바로 결제되지 않고 적합성 검토·참여 승인 이후 착수합니다.' },
  { q: '조달 목표 1억원 이상이면 실제 1억원을 받을 수 있나요?', a: '아니요. 권장 기준일 뿐 조달금액을 보장하지 않습니다. 실제 승인 여부와 금액은 기관 평가와 기업의 재무·신용·업종 상황에 따라 달라집니다.' },
  { q: '벤처확인과 연구소는 자동 포함인가요?', a: '아니요. 자동 포함이 아니며, 기업진단 후 실제 필요성이 있는 기업에만 제안합니다. AX 성장형 참여기업은 벤처확인 준비와 연구개발조직 설립 지원을 각각 10% 할인 조건으로 선택할 수 있습니다.' },
  { q: '자금이 부결되면 어떻게 되나요?', a: '거절 사유를 정확히 파악해 기관·시점·서류를 바꿔 다시 준비하는 방향을 함께 잡습니다. 무리한 재신청을 권하지 않으며, 다음 조달까지 고려해 순서를 설계합니다.' },
  { q: '승인이나 조달금액을 보장하나요?', a: '보장하지 않습니다. 승인·금리·한도는 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략, 준비 방향, 진행 관리를 돕습니다.' },
  { q: '부가세와 세부 계약조건은 어떻게 정해지나요?', a: '성과보수 적용 여부·산정 기준, 부가세 포함 여부, AX 구축 범위 등 세부 계약조건은 개별 계약서에서 확정합니다.' },
]

// ── §13 계약·책임 안내 ──
const contractNotes = [
  '정책자금 승인 및 조달금액은 보장하지 않습니다. 기관 평가와 기업 상황에 따라 결과가 달라집니다.',
  '성과보수 적용 여부와 산정 기준, 지급 시점은 개별 계약서에서 확정합니다.',
  'AX 구축 범위는 적합성 검토와 기능명세 확정 후 결정되며, 기본 범위를 넘는 추가 기능·연동·구축 이후 유지보수는 별도 협의로 진행됩니다.',
  '벤처확인·연구개발조직 설립 지원은 자동 포함이 아니며, 진단 후 필요 기업에만 제안합니다.',
  '세무·노무·법무의 최종 판단은 해당 분야 전문가 검토가 필요합니다.',
  '신청 서류에는 정확한 정보를 제공해 주셔야 하며, 사실과 다른 정보로 인한 불이익은 책임지지 않습니다.',
]

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

export default function FundingConsultingDetailPage() {
  const navigate = useNavigate()
  const [showBar, setShowBar] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [consult, setConsult] = useState<{ open: boolean; plan: string | null }>({ open: false, plan: null })
  const rootRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const openConsult = (plan: string | null = null) => setConsult({ open: true, plan })

  const inquiryOnly = !paymentsEnabled
  // 대표 CTA — 결제 활성 시 체크아웃, 아니면 기업진단 진행방식으로 상담
  function startProgramA() {
    if (inquiryOnly) openConsult(A.name)
    else navigate(`/checkout/${pkg.slug}`)
  }
  const primaryCtaLabel = inquiryOnly ? '기업진단 신청하기' : '500,000원 결제하고 시작하기'

  useEffect(() => {
    document.title = '정책자금 컨설팅 | 미래 AI 랩 서비스몰'
    window.scrollTo(0, 0)
  }, [])

  // (구버전 호환) ?buy=1 → 체크아웃
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('buy') === '1') navigate(`/checkout/${pkg.slug}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 최종 CTA 노출 시 모바일 고정 바 숨김(중복 방지) — 메인/BusinessServices와 동일 동작
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
            <button type="button" onClick={startProgramA} className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
              {inquiryOnly ? '기업진단 신청' : '결제하고 시작'}
            </button>
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

      {/* ── 1. Hero — 우선 방향부터 정확히(500,000원 · 성과보수 없음) ───────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
            정책자금 기업진단
          </span>
          <h1 className="mt-5 text-[2rem] font-black leading-[1.2] tracking-tight text-white sm:text-[3rem] sm:leading-[1.15]">
            우선 방향부터<br /><span className="text-teal-300">정확히 정리</span>해드립니다.
          </h1>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="text-4xl font-black tracking-tight text-white sm:text-5xl">{A.priceMain}</span>
            <span className="rounded-lg bg-teal-400/15 px-3 py-1.5 text-sm font-black text-teal-300 ring-1 ring-inset ring-teal-400/30">성과보수 없음</span>
          </div>
          <p className="mx-auto mt-5 max-w-md text-[1.02rem] leading-relaxed text-slate-300 sm:text-lg">
            이 단계만 이용하고 <b className="text-white">직접 진행하셔도 됩니다.</b> 지금 우리 회사가 어느 기관을 어떤 순서로 준비해야 하는지부터 정리해 드립니다.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button type="button" onClick={startProgramA} className="flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              {!inquiryOnly && <CartIcon />} {primaryCtaLabel}
            </button>
            <button type="button" onClick={() => scrollToId('compare')} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
              진행 방식 비교하기
            </button>
          </div>
          <dl className="mx-auto mt-11 grid max-w-lg grid-cols-3 gap-x-4 border-t border-white/10 pt-8">
            {trustStats.map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-[1.35rem] font-black leading-none tracking-tight text-white sm:text-[1.7rem]">{s.value}</dd>
                <dt className="mt-1.5 text-[0.76rem] font-medium leading-snug text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-slate-500">
            승인 여부와 조달금액은 기관 평가와 기업 상황에 따라 달라집니다.
          </p>
        </div>
      </section>

      {/* ── 2. 대표들이 막히는 현실적인 이유 ───────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>이런 상황, 익숙하신가요?</p>
          <h2 className={bigHead}>정책자금 앞에서<br /><span className="text-blue-600">대표들이 막히는 이유</span></h2>
          <div className="mt-9 grid gap-3.5 sm:grid-cols-2">
            {pains.map((p) => (
              <div key={p.t} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl" aria-hidden>{p.icon}</span>
                <p className="pt-1 text-[1.05rem] font-bold leading-snug text-slate-800">“{p.t}”</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-lg text-center text-[1.02rem] leading-relaxed text-slate-600">
            그래서 무작정 신청부터 하지 않고, <b className="text-slate-900">우리 회사에 맞는 방향인지 진단하는 것</b>부터 시작합니다.
          </p>
        </div>
      </section>

      {/* ── 3. 500,000원 기본상품 가치 ─────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>기업진단·자금전략 · {A.priceMain}</p>
          <h2 className={bigHead}>{A.priceMain}으로<br /><span className="text-blue-600">방향부터 정리합니다</span></h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-[1.02rem] leading-relaxed text-slate-600 sm:text-lg">
            전체 진행을 맡기지 않아도 괜찮습니다. 현재 가능한 자금과 준비 순서를 정리한 뒤 <b className="text-slate-900">직접 진행</b>하실 수 있습니다.
          </p>
          {/* 결과 요약본 — 문서형 카드 */}
          <div className="mx-auto mt-9 max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
              <span className="text-lg" aria-hidden>📄</span>
              <p className="text-[0.95rem] font-black text-slate-800">대표자용 결과 요약본에 담기는 것</p>
            </div>
            <ul className="grid gap-x-6 gap-y-3 px-6 py-6 sm:grid-cols-2">
              {baseOutcomes.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-[1rem] font-semibold leading-snug text-slate-700">
                  <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>{o}
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-slate-900 px-6 py-5 text-center">
            <p className="text-[1.05rem] font-black leading-snug text-white sm:text-lg">
              이 단계에서 종료하면 <span className="text-teal-300">추가 성과보수가 없습니다.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. 핵심 프로그램 3개 (A/B/C) ──────────────────────────── */}
      <section id="plans" className={`bg-slate-50 ${band}`}>
        <div className="mx-auto max-w-[1000px]">
          <p className={kicker}>진행 방식</p>
          <h2 className={bigHead}>필요한 만큼만,<br /><span className="text-blue-600">세 가지 중에서 고르세요</span></h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[1.02rem] leading-relaxed text-slate-600">
            대부분 <b className="text-slate-900">{A.priceMain} 진단</b>만으로 방향을 잡고 직접 진행하십니다. 전체 위임이나 AX 구축이 필요할 때만 아래에서 선택하세요.
          </p>
          <div className="mt-9 grid items-stretch gap-4 sm:grid-cols-3">
            {CORE_PROGRAMS.map((p) => {
              const featured = p.key === 'C'
              return (
                <div key={p.key} className={`flex flex-col rounded-3xl border-2 bg-white p-5 sm:p-6 ${featured ? 'border-blue-600 shadow-xl shadow-blue-600/10' : 'border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl text-base font-black ${featured ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>{p.key}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${p.key === 'A' ? 'bg-emerald-50 text-emerald-700' : featured ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{p.label}</span>
                  </div>
                  <h3 className="mt-4 text-[1.2rem] font-black leading-snug tracking-tight text-slate-900">{p.name}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-500">{p.catchline}</p>
                  <div className="mt-4 border-y border-slate-100 py-4">
                    {p.priceTop && <p className="text-[0.76rem] font-semibold text-slate-400">{p.priceTop.label} <span className="font-bold text-slate-500">{p.priceTop.value}</span></p>}
                    {p.priceMainLabel && <p className={`mt-1 text-[0.76rem] font-black ${featured ? 'text-blue-600' : 'text-slate-500'}`}>{p.priceMainLabel}</p>}
                    <p className={`mt-0.5 text-2xl font-black tracking-tight ${featured ? 'text-blue-700' : 'text-slate-900'}`}>{p.priceMain}</p>
                    <p className="mt-1 text-[0.85rem] font-bold text-slate-600">{p.priceSub}</p>
                  </div>
                  {featured && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['조달 목표 1억원 이상 권장', '초기 10개사', '적합기업 선별'].map((t) => (
                        <span key={t} className="rounded-md bg-blue-50 px-2 py-1 text-[0.72rem] font-bold text-blue-700">{t}</span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-slate-600">{p.recommend}</p>
                  <div className="mt-5">
                    {p.key === 'A' && !inquiryOnly ? (
                      <button type="button" onClick={startProgramA} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5">
                        <CartIcon /> {primaryCtaLabel}
                      </button>
                    ) : p.key === 'A' ? (
                      <button type="button" onClick={() => openConsult(p.name)} className="flex w-full items-center justify-center rounded-xl bg-teal-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5">
                        기업진단 신청하기
                      </button>
                    ) : (
                      <button type="button" onClick={() => openConsult(p.name)} className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-[0.95rem] font-black text-white shadow-sm transition-transform hover:-translate-y-0.5 ${featured ? 'bg-blue-600' : 'bg-slate-900'}`}>
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

      {/* ── 5. 진행방식 비교(6항목) ────────────────────────────────── */}
      <section id="compare" className={`scroll-mt-16 bg-white ${band}`}>
        <div className="mx-auto max-w-[900px]">
          <h2 className={bigHead}>어디까지 맡길지에 따라<br /><span className="text-blue-600">진행 방식이 달라집니다</span></h2>
          {/* 데스크톱: 표 */}
          <div className="mx-auto mt-9 hidden max-w-3xl overflow-hidden rounded-3xl border border-slate-200 shadow-lg sm:block">
            <div className="grid grid-cols-[minmax(64px,0.7fr)_1fr_1fr_1fr]">
              <div className="bg-slate-100" />
              {compareCols.map((c) => (
                <div key={c.key} className={`px-2 py-3 text-center ${c.featured ? 'bg-blue-600' : 'bg-slate-800'}`}>
                  <p className={`text-[0.68rem] font-bold ${c.featured ? 'text-blue-200' : 'text-slate-400'}`}>{c.key}</p>
                  <p className={`text-sm font-black leading-tight ${c.featured ? 'text-white' : 'text-slate-100'}`}>{c.name}</p>
                  <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold leading-none ${c.featured ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>{c.badge}</span>
                </div>
              ))}
            </div>
            {compareRows.map((row, ri) => (
              <div key={row.label} className={`grid grid-cols-[minmax(64px,0.7fr)_1fr_1fr_1fr] ${ri % 2 ? 'bg-slate-50/70' : 'bg-white'}`}>
                <div className="flex items-center bg-slate-100/70 px-2.5 py-3.5"><p className="text-[0.8rem] font-black leading-tight text-slate-600">{row.label}</p></div>
                {row.cells.map((cell, ci) => {
                  const feat = compareCols[ci].featured
                  return (
                    <div key={ci} className={`flex flex-col items-center justify-center px-2 py-3.5 text-center ${feat ? 'bg-blue-50/70' : ''}`}>
                      {typeof cell === 'string' ? (
                        <p className={`text-[0.86rem] font-bold leading-tight ${feat ? 'text-blue-700' : 'text-slate-700'}`}>{cell}</p>
                      ) : (
                        <>
                          <p className={`text-[0.86rem] font-bold leading-tight ${feat ? 'text-blue-700' : 'text-slate-700'}`}>{cell.main}</p>
                          <p className="mt-0.5 text-[0.7rem] font-medium leading-tight text-slate-400">{cell.sub}</p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          {/* 모바일: 방식별 카드(가로표 축소 대신) */}
          <div className="mt-8 space-y-3 sm:hidden">
            {compareCols.map((c, ci) => (
              <div key={c.key} className={`rounded-2xl border p-4 ${c.featured ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg text-sm font-black text-white ${c.featured ? 'bg-blue-600' : 'bg-slate-900'}`}>{c.key}</span>
                  <p className="text-[1.02rem] font-black text-slate-900">{c.name}</p>
                </div>
                <dl className="mt-3 space-y-1.5">
                  {compareRows.map((row) => {
                    const cell = row.cells[ci]
                    return (
                      <div key={row.label} className="flex justify-between gap-3 text-[0.9rem]">
                        <dt className="shrink-0 font-semibold text-slate-500">{row.label}</dt>
                        <dd className="text-right font-bold text-slate-800">{typeof cell === 'string' ? cell : `${cell.main}`}</dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            ※ 성과보수(B 조달액의 3%·C 조달액의 5%)는 <b className="text-slate-500">추가 진행을 선택</b>하고 <b className="text-slate-500">실제로 자금이 조달된 경우에만</b> 발생하며, 기업진단·자금전략({A.priceMain})에는 자동으로 붙지 않습니다. C의 성과보수는 최대 15,000,000원을 상한으로 합니다. {AX_LAUNCH.feeNote} 조달 성공이나 특정 금액을 보장하지 않습니다.
          </p>
        </div>
      </section>

      {/* ── 6. AX 초기 10개사 프로그램 ─────────────────────────────── */}
      <section id="ax" className={`scroll-mt-16 bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-teal-300">AX 결합 성장자금형 · 초기 10개사</p>
          <h2 className="mt-2.5 text-center text-[1.75rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2.3rem]">
            초기 10개 기업과<br /><span className="text-teal-300">실제 AX 사례를 만듭니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-[1.02rem] leading-relaxed text-slate-300 sm:text-lg">
            단순 시연용 화면이 아니라, 실제 업무에서 사용하고 결과를 측정할 수 있는 시스템을 함께 만듭니다.
          </p>
          <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-2">
            {[`레퍼런스 참여가 ${C.priceMain}`, `${C.priceTop!.label} ${C.priceTop!.value}`, '실제 조달금액의 5%', '성과보수 최대 15,000,000원', '조달 목표 1억원 이상 권장'].map((t) => (
              <span key={t} className="rounded-lg bg-white/10 px-3 py-1.5 text-[0.82rem] font-bold text-slate-100 ring-1 ring-inset ring-white/15">{t}</span>
            ))}
          </div>
          <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10">
            <p className="text-[0.92rem] font-bold text-slate-100">{AX_LAUNCH.selection}</p>
            <p className="mt-1 text-[0.82rem] text-slate-400">진행 순서: {AX_LAUNCH.flow}</p>
          </div>
          {/* 기본 노출 참여조건 3 */}
          <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
            {['실제 업무자료 제공', '대표자 또는 담당자 테스트 참여', '익명 사례 활용 및 종료 후 상세 피드백'].map((c) => (
              <div key={c} className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-inset ring-white/10">
                <p className="text-[0.9rem] font-bold leading-snug text-slate-100">{c}</p>
              </div>
            ))}
          </div>
          {/* 상세 조건 — 펼치기 */}
          <details className="group mx-auto mt-4 max-w-xl overflow-hidden rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-3.5 text-[0.9rem] font-bold text-slate-100 marker:content-['']">
              <span>상세 참여조건 · 범위 더 보기</span>
              <span className="text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <div className="border-t border-white/10 px-5 py-4 text-[0.85rem] leading-relaxed text-slate-300">
              <p><b className="text-slate-100">추가 참여조건:</b> 프로젝트 기간 중 정기 피드백 · 실제 업무 적용 의사 · 공개 가능 범위 선택 · 공개 전 최종 확인 희망 · 피드백 방식 선택({AX_LAUNCH.feedbackOptions.join(' / ')})</p>
              <p className="mt-2.5"><b className="text-slate-100">기본 범위:</b> {AX_LAUNCH.scope.join(' · ')}</p>
              <p className="mt-2.5"><b className="text-slate-100">기본 제외:</b> {AX_LAUNCH.excluded.join(' · ')}</p>
            </div>
          </details>
          <p className="mx-auto mt-4 max-w-lg text-center text-[0.82rem] leading-relaxed text-slate-400">
            긍정적인 후기 작성을 요구하지 않습니다. 실제 사용경험과 개선 의견을 솔직하게 알려주세요.
          </p>

          {/* §10(내부) 벤처·연구개발조직 10% 혜택 */}
          <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-teal-400/30 bg-teal-400/10 p-5">
            <p className="text-[0.92rem] font-black text-teal-200">기술기반을 더 보강해야 한다면</p>
            <ul className="mt-2.5 space-y-1.5 text-[0.88rem] leading-snug text-slate-200">
              <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-teal-300" aria-hidden>✓</span> 벤처확인 준비 패키지 <b className="text-white">10% 할인</b></li>
              <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-teal-300" aria-hidden>✓</span> 기업부설연구소·연구개발전담부서 설립 지원 <b className="text-white">10% 할인</b></li>
            </ul>
            <p className="mt-2.5 text-[0.76rem] leading-relaxed text-slate-400">
              AX 성장형에 자동 포함되지 않으며, 기업진단 후 필요한 기업에만 제안합니다. 실제 필요성·진행 가능성은 진단 후 확인하며, 자금승인을 보장하는 혜택이 아닙니다. 특허 출원 연계는 별도 견적입니다.
            </p>
            <button type="button" onClick={() => openConsult(C.name)} className="mt-4 flex w-full items-center justify-center rounded-xl bg-teal-400 px-5 py-3.5 text-[0.95rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5">
              AX 성장형 적합성 확인
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. 컨설팅 후 남는 결과물 ───────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>상담이 끝나도</p>
          <h2 className={bigHead}>자료는<br /><span className="text-blue-600">회사에 남습니다</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[1.02rem] leading-relaxed text-slate-600">
            한 번 쓰고 버리는 서류가 아니라, 자금이 필요할 때마다 다시 쓸 수 있는 조달 기준을 만듭니다.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {outcomeGroups.map((g) => (
              <div key={g.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="flex items-center gap-2 text-[0.95rem] font-black text-slate-900"><span aria-hidden>{g.icon}</span>{g.label}</p>
                <ul className="mt-3.5 space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-[0.95rem] font-semibold leading-snug text-slate-600">
                      <span className="mt-0.5 font-black text-blue-600" aria-hidden>✓</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. 단순 신청지원과 다른 점 ─────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>왜 진단부터 하나요</p>
          <h2 className={bigHead}>신청서만 쓰고<br /><span className="text-blue-600">끝내지 않습니다</span></h2>
          <div className="mx-auto mt-9 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-[0.82rem] font-black uppercase tracking-wide text-slate-400">일반적인 신청 지원</p>
              <ul className="mt-4 space-y-2.5">
                {applyOnly.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[0.98rem] leading-snug text-slate-500">
                    <span className="mt-0.5 shrink-0 text-slate-300" aria-hidden>·</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-blue-600 bg-white p-6 shadow-lg shadow-blue-600/10">
              <p className="text-[0.82rem] font-black uppercase tracking-wide text-blue-600">미래 AI 랩</p>
              <ul className="mt-4 space-y-2.5">
                {miraeWay.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[0.98rem] font-semibold leading-snug text-slate-800">
                    <span className="mt-0.5 shrink-0 font-black text-blue-600" aria-hidden>✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. 실제 성공사례 (2 대표 + 결과카드 · 네이버 블로그 CTA 유지) ── */}
      <FundingCasesSection />

      {/* ── 10. 대표자 신뢰 ────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>미래경영지원센터</p>
          <h2 className={bigHead}>경험과 실적,<br /><span className="text-blue-600">데이터로 뒷받침합니다</span></h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {trustStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-[1.7rem] font-black tracking-tight text-slate-900">{s.value}</p>
                <p className="mt-1.5 text-[0.85rem] font-medium leading-snug text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
            {trustAwards.map((a) => (
              <div key={a.title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-lg" aria-hidden>🏆</span>
                <div className="min-w-0">
                  <p className="text-[0.76rem] font-bold text-slate-400">{a.year}</p>
                  <p className="text-[0.9rem] font-bold leading-snug text-slate-800">{a.title}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-xl text-center text-[0.95rem] leading-relaxed text-slate-600">
            감이 아니라, <b className="text-slate-900">자체 개발한 진단 SaaS가 데이터에 근거해</b> 자금 방향을 잡고, 세무·노무·법무 판단은 <b className="text-slate-900">해당 분야 전문가 검토</b>로 확정합니다.
          </p>
          <div className="mt-5 text-center">
            <a href={consultLinks.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
              <span aria-hidden>▶</span> 유튜브 「김팀장의 경영노트」
            </a>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">정책자금·정부지원금·법인컨설팅 실무를 공개합니다. 미래 AI 랩 대표가 직접 운영합니다.</p>
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ────────────────────────────────────────────────── */}
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

      {/* ── 12. 최종 CTA ───────────────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div ref={finalCtaRef} className="mx-auto max-w-[560px] rounded-3xl bg-slate-900 p-7 text-center shadow-xl sm:p-9">
          <p className="text-sm font-black uppercase tracking-widest text-teal-300">고민은 여기까지</p>
          <h2 className="mt-3 text-[1.6rem] font-black leading-[1.3] tracking-tight text-white sm:text-[2rem]">일단 방향부터 확인해도<br />괜찮습니다</h2>
          <p className="mx-auto mt-4 max-w-md text-[1rem] leading-relaxed text-slate-300">
            {A.priceMain} 기업진단만 이용한 뒤 직접 진행하거나, 필요한 범위만 추가로 선택할 수 있습니다.
          </p>
          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
            <button type="button" onClick={startProgramA} className="flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              {!inquiryOnly && <CartIcon />} {primaryCtaLabel}
            </button>
            <button type="button" onClick={() => openConsult(C.name)} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
              AX 성장형 적합성 확인
            </button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-slate-400">확인하는 데는 비용이 들지 않습니다.</p>
        </div>
      </section>

      {/* ── 13. 계약·책임 안내 ─────────────────────────────────────── */}
      <section className="bg-white px-5 pb-6">
        <div className={`${inner} rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">계약·책임 안내</p>
          <ul className="mt-3 space-y-2">
            {contractNotes.map((n) => (
              <li key={n} className="flex items-start gap-2 text-[0.92rem] leading-relaxed text-slate-500">
                <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">·</span>{n}
              </li>
            ))}
          </ul>
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
            <span className="block truncate text-[0.92rem] font-black text-slate-900">우선 방향부터 정리 · {A.priceMain}</span>
            <span className="block truncate text-xs font-medium text-slate-500">성과보수 없음 · 신청 1~2분</span>
          </span>
          <button type="button" onClick={startProgramA} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[0.95rem] font-bold text-white">
            {inquiryOnly ? '기업진단 신청' : <><CartIcon /> 결제하기</>}
          </button>
        </div>
      )}

      <ConsultModal
        open={consult.open}
        onClose={() => setConsult({ open: false, plan: null })}
        source="정책자금 컨설팅"
        heading="정책자금 가능성 진단 신청"
        topicGroups={CONSULT_TOPIC_GROUPS}
        preselectProduct="정책자금 컨설팅"
        showContactMethod
        showCompanyFields
        programSelect
        preselectProgram={consult.plan ?? undefined}
        contextRows={consult.plan ? ([{ label: '선택 방식', value: consult.plan }] as ConsultContextRow[]) : []}
      />
    </div>
  )
}
