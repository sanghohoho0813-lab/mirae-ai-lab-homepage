import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import KakaoFloat from '../components/KakaoFloat'
import AxIndustryShowcaseV2 from '../components/ax-showcase/AxIndustryShowcaseV2'
import AxPortfolioSection from '../components/ax-showcase/AxPortfolioSection'
import AxPurposeSection from '../components/ax-showcase/AxPurposeSection'
import AxScreenPreviewSection from '../components/ax-showcase/AxScreenPreviewSection'
import AxSimpleExplanationSection from '../components/ax-showcase/AxSimpleExplanationSection'
import { AxHeroV2, AxSelectionSection } from '../components/ax-showcase/axHomeSections'
import { CONSULT_TOPIC_GROUPS } from '../lib/consultApi'
import { useSavedItems } from '../lib/savedItems'
import { loadHistory } from '../lib/businessDiagnosisStorage'
import { FLAGSHIP } from '../data/corePrograms'
import { saveBusinessReturn, readBusinessReturn, clearBusinessReturn } from '../lib/businessServicesReturn'

// 미래AI랩 = 정책자금 기반 기업 사업화 회사. AX는 자금을 받을 이유를 실제로 만들어 보여주는 수단이다.
//
// 홈은 세 가지만 강하게 보여준다 — 왜 지금 AX인가 / 우리 업종은 어떻게 달라지는가 / 누가 직접 설계하는가.
// 홈 순서: ① Hero(한 문장만) → ② AX의 목적 네 가지(가볍게)
//          → ③ 이런 프로그램을 만들어 드립니다(업종 3개 × 5단계 화면)
//          → ④ 직접 만든 MVP 레퍼런스 10개 → ⑤ AX 쉽게 설명하면 · 왜 하필 지금 AX인가
//          → ⑥ 15개 업종 쇼케이스 → ⑦ 김팀장·수행체계 → ⑧ 월 최대 5개사 → ⑨ 최종 CTA
// 쿠팡·네이버 상세페이지처럼 한 화면에 핵심 메시지 하나, 위아래 여백을 넉넉히 둔다.
// 가격·2주 과정·결과물·비교표·생애주기·FAQ 는 정책자금 상세페이지에서만 다룬다.
const DETAIL = '/business-services/funding-consulting'

const AWARDS = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상 · 경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국 사회공헌 K-컬처 나눔봉사공헌대상 · 벤처부문' },
]


function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BusinessServicesPage() {
  const { cart } = useSavedItems()
  const [historyCount] = useState(() => loadHistory().length)
  const [heroVisible, setHeroVisible] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const finalCtaRef = useRef<HTMLDivElement>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const location = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    document.title = 'AX 사업화·자금조달 프로그램 | 미래 AI 랩'
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (location.hash) return
    if (navType !== 'POP') return
    const saved = readBusinessReturn()
    if (!saved || saved.path !== location.pathname) return
    const y = Math.max(0, saved.scrollY)
    const apply = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' })
    apply()
    const timers = [60, 160, 320, 560].map((d) => window.setTimeout(apply, d))
    const onLoad = () => apply()
    window.addEventListener('load', onLoad, { once: true })
    const clear = window.setTimeout(() => clearBusinessReturn(), 720)
    return () => { timers.forEach(clearTimeout); window.clearTimeout(clear); window.removeEventListener('load', onLoad) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const go = () => {
      const el = document.getElementById(id)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - 68
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
    }
    go()
    const timers = [80, 250, 600].map((d) => window.setTimeout(go, d))
    window.addEventListener('load', go, { once: true })
    return () => { timers.forEach(clearTimeout); window.removeEventListener('load', go) }
  }, [location.hash])

  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setHeroVisible(entries[0]?.isIntersecting ?? false), { rootMargin: '-40px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = finalCtaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setAtEnd(entries[0]?.isIntersecting ?? false), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const saveReturn = (cardId: string) => saveBusinessReturn(cardId)

  return (
    <div className="min-h-screen bg-white pb-16 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header — 핵심 메뉴만 */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[1.2rem] sm:text-[1.09rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              {/* 모바일에서는 세 줄이 되지 않도록 영문 사명을 접고 태그라인만 남긴다 */}
              <span className="break-keep text-[1.1rem] sm:text-[1.0rem] font-medium text-slate-500">
                <span className="hidden sm:inline">Mirae AI Lab · </span>
                <b className="font-bold text-slate-800">정책자금 × AX사업화 전문</b>
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-[1.17rem] sm:text-[1.06rem] font-medium text-slate-600 lg:flex">
            <Link to={DETAIL} onClick={() => saveReturn('nav')} className="transition-colors hover:text-slate-900">프로그램</Link>
            <button type="button" onClick={() => scrollToId('ax-showcase-v2')} className="transition-colors hover:text-slate-900">업종별 AX</button>
            <button type="button" onClick={() => scrollToId('leader')} className="transition-colors hover:text-slate-900">수행체계</button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {historyCount > 0 && (
              <Link to="/business-diagnosis/results" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[1.1rem] sm:text-[1.0rem] font-bold text-cyan-800 transition-colors hover:bg-cyan-100 lg:inline-flex">
                내 진단 결과 <b>{historyCount}</b>
              </Link>
            )}
            {cart.length > 0 && (
              <Link to="/saved" aria-label={`장바구니 ${cart.length}개 보기`} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="20" r="1.4" /><circle cx="17.5" cy="20" r="1.4" /><path d="M2.5 3.5h2.5l2.6 12h10.7l2.2-8.5H6" /></svg>
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">{cart.length > 99 ? '99+' : cart.length}</span>
              </Link>
            )}
            <Link to="/business-diagnosis" className="hidden whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-[1.2rem] sm:text-[1.09rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex">3분 기업진단</Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {/* 1. Hero — 무엇을 파는 회사인지 5초 안에 */}
      <div ref={heroRef}>
        <AxHeroV2 onNext={() => scrollToId('ax-purpose')} />
      </div>

      {/* 2. AX가 무엇을 위한 것인지 — 목적 네 가지만 가볍게 */}
      <AxPurposeSection onNext={() => scrollToId('ax-screen-preview')} />

      {/* 3. 이런 프로그램을 만들어 드립니다 — 업종 3개 × 5단계 화면 */}
      <AxScreenPreviewSection />

      {/* 4. 직접 만든 MVP 레퍼런스 10개 — 실제로 만들 수 있는 회사인지 먼저 보여준다 */}
      <AxPortfolioSection />

      {/* 3. AX가 무엇인지 쉬운 말로 → 왜 하필 지금인가(공식 정책근거) */}
      <AxSimpleExplanationSection onShowcase={() => scrollToId('ax-showcase-v2')} />

      {/* 5~8. 15개 업종 선택 → 5장 AX 변화 → 여기서 끝나지 않습니다 → 사업화 예시 2개 */}
      <AxIndustryShowcaseV2 />

      {/* 12. 김팀장 */}
      <section id="leader" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 컨설턴트 김팀장 프로필 사진" loading="lazy" decoding="async" width={200} height={200} className="h-16 w-16 shrink-0 rounded-full object-cover shadow ring-2 ring-amber-400/40 sm:h-20 sm:w-20" />
              <div className="min-w-0">
                <p className="text-[1.1rem] sm:text-[1.0rem] font-black tracking-tight text-blue-600">정책자금·AX 성장설계 총괄</p>
                <h3 className="mt-1 break-keep text-[1.52rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">대표 컨설턴트가 직접 듣고, 직접 설계하고, 끝까지 확인합니다.</h3>
              </div>
            </div>
            <p className="mt-5 break-keep text-[1.26rem] sm:text-[1.15rem] leading-relaxed text-slate-700">
              김팀장은 자금 가능성 검토에서 끝내지 않습니다. 대표님의 사업을 듣고 어떤 업무를 AX로 바꿀지 직접 기획하며, <b className="text-slate-900">내부 개발자와 함께 사업과 AX 구조를 직접 설계합니다.</b> 그래서 사업계획과 실제 결과물이 따로 움직이지 않습니다. 자금조달 이후에는 지원금·인증·복지제도까지 성장순서에 맞춰 연결합니다.
            </p>
            <p className="mt-2.5 break-keep text-[1.13rem] sm:text-[1.03rem] leading-relaxed text-slate-500">
              세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원. 누적 자금조달 지원 100억원+(지원금·세금 환급 포함).
            </p>
            <p className="mt-2.5 break-keep rounded-xl bg-slate-100 px-4 py-2.5 text-[1.1rem] sm:text-[1.0rem] leading-relaxed text-slate-600">
              세무·노무·법률 업무는 해당 자격을 보유한 외부 전문가가 직접 수행합니다.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              {AWARDS.map((a) => (
                <span key={a.title} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[1.1rem] sm:text-[1.0rem] font-semibold text-slate-600">
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[1.1rem] sm:text-[1.0rem] font-black text-amber-300">{a.year}</span>{a.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 14. 월 최대 5개사 선별기준 */}
      <AxSelectionSection />

      {/* 15. 최종 CTA */}
      <div ref={finalCtaRef}>
        <section id="cta" className="border-t border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/business-diagnosis" className="shine-cta flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto">
                <span aria-hidden>🩺</span> 3분 기업진단 시작
              </Link>
              <button type="button" onClick={() => setConsultOpen(true)} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto">
                상담 신청
              </button>
              <Link to={DETAIL} onClick={() => saveReturn('cta')} className="flex w-full max-w-xs items-center justify-center rounded-xl border border-teal-400/40 bg-teal-400/10 px-7 py-4 text-[1.26rem] sm:text-[1.15rem] font-bold text-teal-200 transition-colors hover:bg-teal-400/20 sm:w-auto">
                정책자금 × AX 서비스 자세히 알아보기
              </Link>
            </div>
          </div>
        </section>
      </div>

      <LegalFooter />
      <KakaoFloat />

      {/* Mobile sticky CTA — 기업진단(카톡은 KakaoFloat) */}
      {!heroVisible && !atEnd && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur-md sm:hidden">
          <Link to="/business-diagnosis" className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[1.2rem] sm:text-[1.09rem] font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
            <span aria-hidden>🩺</span> 3분 기업진단 시작
          </Link>
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
        preselectProgram={FLAGSHIP.consultName}
      />
    </div>
  )
}
