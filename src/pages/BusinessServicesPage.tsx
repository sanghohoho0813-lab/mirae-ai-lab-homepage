import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import BusinessServiceVisual from '../components/BusinessServiceVisual'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import { consultLinks } from '../config/businessInfo'
import {
  businessPackages,
  CATEGORIES,
  CATEGORY_SCENARIOS,
  categoryToneClass,
  FEATURED_IDS,
  packageBanner,
  type BusinessPackage,
} from '../data/businessPackages'

// 중소기업 대표님을 위한 공개 경영지원 서비스몰 홈 (서비스몰형 상품 UI).
// 상품 데이터는 ../data/businessPackages 공유. 기존 기능 로직은 건드리지 않습니다.

// 대표자 신뢰도 영역 — 실제 확인된 정보만 사용(승인율·고객수 등 임의 수치 금지).
const trustStats = [
  { value: '100억원+', label: '누적 자금조달 지원' },
  { value: '9년', label: '세무·노무·법무·자금 현장 경험' },
  { value: 'ISO 3종', label: '9001·14001·45001 심사원' },
  { value: '2개 수상', label: '경영컨설팅·벤처 부문' },
]

const trustAwards = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상', detail: '경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국을 빛낸 사회공헌 K-컬처 나눔봉사공헌대상', detail: '벤처부문' },
]

const homeFaqs = [
  {
    q: '정책자금 승인이나 인증 취득을 보장하나요?',
    a: '아니요. 승인·선정·취득은 기관 심사 사항입니다. 저희는 가능성 진단과 신청 전략, 준비 방향, 진행 관리를 돕습니다.',
  },
  { q: '어떤 서비스부터 시작해야 할지 모르겠어요.', a: '무료 진단을 신청하시면 기업 상황을 확인하고 어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다.' },
  {
    q: '여러 서비스를 함께 진행할 수 있나요?',
    a: '네. 성장 로드맵 풀패키지로 정책자금·인증·홈페이지·AI 시스템을 하나의 로드맵으로 함께 설계할 수 있습니다.',
  },
  { q: '비용은 어떻게 정해지나요?', a: '상품별 기준 가격이 있으며, 기업 상황과 범위에 따라 달라 상담 후 맞춤 안내드립니다.' },
]

const eyebrow = 'text-sm font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 카드 가격 표기 전용 — '59만원', '23만 7천원' 같은 한국어 축약 표기를 '590,000원' 콤마 표기로 변환.
// ⚠️ 표시(문자열) 변환일 뿐, 실제 결제 금액(pkg.amount / variants[].amount / 서버 카탈로그)과는 무관합니다.
function formatKoreanMoney(text: string): string {
  return text
    .replace(/(\d[\d,]*)\s*만(?:\s*(\d+)\s*천)?\s*원/g, (_m, man: string, cheon?: string) => {
      const won = parseInt(man.replace(/,/g, ''), 10) * 10000 + (cheon ? parseInt(cheon, 10) * 1000 : 0)
      return `${won.toLocaleString('ko-KR')}원`
    })
    .replace(/(?<![\d,])(\d+)\s*천\s*원/g, (_m, cheon: string) => `${(parseInt(cheon, 10) * 1000).toLocaleString('ko-KR')}원`)
}

// 서비스몰형 상품 카드(3차) — 버튼 없이 카드 전체가 상세페이지 링크.
// 상품명 → 가격(강조) → 대표 혜택 3. 결제/상담은 상세페이지 상단 CTA 에서 진행.
function ProductCard({ pkg }: { pkg: BusinessPackage }) {
  const b = packageBanner[pkg.id]
  const flagship = pkg.flagship
  const consult = pkg.priceType === 'consult'
  const priceText = formatKoreanMoney(pkg.price)

  return (
    <Link
      to={`/business-services/${pkg.slug}`}
      aria-label={`${pkg.name} 자세히 보기`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        flagship
          ? 'border border-amber-300 shadow-sm shadow-amber-500/10 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15'
          : 'border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      {/* 썸네일 — 첫인상 전용(대표 카피·이미지). 16:10 컴팩트, 상단 고정 크롭 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <BusinessServiceVisual type={pkg.visualType} title={b.title} accent={b.accent} tag={pkg.category} imageSrc={pkg.imageSrc} alt={pkg.name} fit="cover" minimal />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* 카테고리 ↔ 대표상품/배지 */}
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[0.82rem] font-bold ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.category}</span>
          {flagship ? (
            <span className="shrink-0 rounded-full bg-amber-400 px-2.5 py-1 text-[0.82rem] font-black text-slate-900">★ 대표 상품</span>
          ) : (
            pkg.badge && <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[0.82rem] font-semibold text-slate-500">{pkg.badge}</span>
          )}
        </div>

        {/* 상품명 + 한줄 소개 */}
        <h3 className="mt-3 line-clamp-1 text-[1.35rem] font-extrabold leading-snug tracking-tight text-slate-900">{pkg.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.98rem] leading-relaxed text-slate-500">{pkg.short}</p>

        {/* 가격 존 — 결제/상담 구분 배지 + 가격 강조 */}
        <div className="mt-3.5">
          {consult ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[0.82rem] font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20">
              <span aria-hidden>💬</span> 상담 후 견적
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.82rem] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
              <span aria-hidden>⚡</span> 바로 결제 가능
            </span>
          )}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight ${consult ? 'text-[1.6rem] text-slate-700' : flagship ? 'text-[1.85rem] text-amber-600' : 'text-[1.85rem] text-slate-900'}`}>{priceText}</span>
          </div>
          {pkg.priceHighlight && <p className="mt-1.5 line-clamp-1 text-[0.9rem] font-bold text-rose-600">{formatKoreanMoney(pkg.priceHighlight)}</p>}
        </div>

        {/* 대표 혜택 3가지 — SaaS 체크 리스트(스캔형) */}
        <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-center gap-2.5 text-[0.98rem] font-semibold text-slate-700">
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${flagship ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`} aria-hidden>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.4l2.4 2.4L9 3.2" />
                </svg>
              </span>
              <span className="line-clamp-1">{formatKoreanMoney(h)}</span>
            </li>
          ))}
        </ul>

      </div>
    </Link>
  )
}

// 햄버거 메뉴 등 외부 링크용 카테고리 쿼리 (?category=funding 등)
const CATEGORY_QUERY_MAP: Record<string, string> = {
  funding: '자금조달',
  subsidy: '지원금',
  certification: '인증·절세',
  digital: 'AX 컨설팅',
  full: '풀패키지',
}

export default function BusinessServicesPage() {
  const [activeCat, setActiveCat] = useState('전체')
  const [showBar, setShowBar] = useState(false)
  const [searchParams] = useSearchParams()
  const location = useLocation()

  useEffect(() => {
    document.title = '대표님을 위한 경영지원 서비스몰 | 미래 AI 랩'
  }, [])

  // ?category= 쿼리 → 카테고리 필터 + 상품 섹션으로 스크롤
  useEffect(() => {
    const q = searchParams.get('category')
    const mapped = q ? CATEGORY_QUERY_MAP[q] : undefined
    if (mapped && CATEGORIES.includes(mapped)) {
      setActiveCat(mapped)
      setTimeout(() => scrollToId('packages'), 60)
    }
  }, [searchParams])

  // #hash 이동 (drawer 의 /business-services#faq 등 라우터 링크 대응)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      setTimeout(() => scrollToId(id), 60)
    }
  }, [location.hash])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 대표 상품 TOP 5 (FEATURED_IDS 순서)
  const featured = FEATURED_IDS.map((id) => businessPackages.find((p) => p.id === id)).filter(
    (p): p is BusinessPackage => Boolean(p),
  )
  // 전체 보기: 카테고리(상황) 순서대로 그룹핑
  const scenarioCats = CATEGORIES.filter((c) => c !== '전체')
  const groups = (activeCat === '전체' ? scenarioCats : [activeCat]).map((cat) => ({
    cat,
    scenario: CATEGORY_SCENARIOS[cat],
    items: businessPackages.filter((p) => p.category === cat),
  }))

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Shopping-style header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.82rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-[0.95rem] font-medium text-slate-600 lg:flex">
            <button type="button" onClick={() => scrollToId('trust')} className="transition-colors hover:text-slate-900">전문성</button>
            <button type="button" onClick={() => scrollToId('top3')} className="transition-colors hover:text-slate-900">대표상품</button>
            <button type="button" onClick={() => scrollToId('packages')} className="transition-colors hover:text-slate-900">전체상품</button>
            <button type="button" onClick={() => scrollToId('faq')} className="transition-colors hover:text-slate-900">FAQ</button>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              to="/consultants"
              className="hidden text-[0.95rem] font-medium text-slate-500 transition-colors hover:text-slate-900 lg:inline"
            >
              컨설턴트용 AI 도구
            </Link>
            <Link
              to="/business-diagnosis"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex"
            >
              필요한 서비스 찾기
            </Link>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      {/* Hero (navy) */}
      <section className="relative overflow-hidden bg-slate-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            미래경영지원센터 · 경영지원 서비스몰
          </span>
          <h1 className="mt-4 max-w-3xl text-[1.75rem] font-extrabold leading-[1.25] tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.18]">
            대표님에게 필요한 <span className="text-amber-300">경영지원 서비스</span>를 골라보세요
          </h1>
          <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-slate-300 sm:text-xl">
            정책자금·고용지원금·기업인증·홈페이지·AI 시스템까지, 기업 상황에 맞는 패키지를 상담 후 제안드립니다.
          </p>
          <div className="mt-7 max-w-3xl">
            <Link
              to="/business-diagnosis"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-7 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              🩺 우리 회사에 필요한 서비스 직접 체크해보기
            </Link>
            <p className="mt-2 text-[0.9rem] font-bold text-amber-200/90">✓ 비회원도 체크 가능</p>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              <button
                type="button"
                onClick={() => scrollToId('top3')}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500 sm:px-6"
              >
                대표 상품 TOP 5 보기
              </button>
              <button
                type="button"
                onClick={() => scrollToId('packages')}
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:px-6"
              >
                전체 상품 보기
              </button>
              <a
                href={consultLinks.kakaoChat}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] px-5 py-3.5 text-base font-bold text-[#191919] transition-transform hover:-translate-y-0.5 sm:px-6"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
                  <path fill="#191919" d="M12 3C6.75 3 2.5 6.36 2.5 10.5c0 2.64 1.73 4.96 4.34 6.29l-.9 3.33c-.08.3.26.54.52.37l3.96-2.63c.51.07 1.04.14 1.58.14 5.25 0 9.5-3.36 9.5-7.5S17.25 3 12 3z" />
                </svg>
                카톡 상담하기
              </a>
              <a
                href={consultLinks.googleForm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 sm:px-6"
              >
                대면 상담 신청하기
              </a>
            </div>
          </div>

          {/* 신뢰 지표 — 서비스 찾기 CTA 바로 아래, 상품보다 먼저 눈에 띄게 */}
          <div id="trust" className="mt-7 max-w-4xl scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur sm:p-6">
            <p className="text-[0.9rem] font-bold uppercase tracking-widest text-amber-300">믿고 맡기는 이유</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
              {trustStats.map((s) => (
                <div key={s.label} className="border-l-2 border-amber-400/60 pl-3.5">
                  <dd className="text-[1.85rem] font-black leading-none tracking-tight text-white sm:text-[2.1rem]">{s.value}</dd>
                  <dt className="mt-2 text-[0.92rem] font-medium leading-snug text-slate-300">{s.label}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-start gap-3.5 border-t border-white/10 pt-5">
              <img
                src="/assets/profile/ceo-avatar.webp"
                alt="미래 AI 랩 대표 프로필 사진"
                loading="lazy"
                decoding="async"
                width={200}
                height={200}
                className="h-20 w-20 shrink-0 rounded-full object-cover shadow-lg shadow-black/30 ring-[3px] ring-amber-400/60 sm:h-24 sm:w-24"
              />
              <div className="min-w-0">
              <p className="text-[1.1rem] font-semibold leading-relaxed text-slate-100">
                정책자금부터 정부지원사업, 법인컨설팅, AX 구축까지 기업의 성장 과정을 한 흐름으로 설계합니다.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[0.95rem] font-medium text-slate-300">
                <span className="font-bold text-white">미래 AI 랩 대표</span>
                <span className="text-slate-600">·</span>
                <span>미래경영지원센터</span>
                <span className="text-slate-600">·</span>
                <a
                  href="https://youtube.com/channel/UCjXWwM0_25vl1Mpr2Pc5amQ?si=vBv8_7d3w8Uk5uGA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  aria-label="유튜브 김팀장의 경영노트 채널 (새 탭에서 열림)"
                >
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" aria-hidden>
                    <rect x="1.5" y="5" width="21" height="14" rx="3.5" fill="#FF0000" />
                    <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="#fff" />
                  </svg>
                  김팀장의 경영노트
                  <span aria-hidden className="text-slate-300">↗</span>
                </a>
              </div>
              {/* 수상 — 모바일에서도 2열 병렬, 소형 */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {trustAwards.map((a) => (
                  <div key={a.title} className="flex items-start gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                    <span className="mt-0.5 shrink-0 rounded bg-amber-400 px-1.5 py-0.5 text-[0.68rem] font-black text-slate-900">{a.year}</span>
                    <span className="min-w-0">
                      <span className="block text-[0.78rem] font-bold leading-snug text-slate-100">{a.title}</span>
                      <span className="text-[0.7rem] text-slate-400">{a.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 대표 상품 TOP 5 */}
      <section id="top3" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>대표 상품 TOP 5</p>
          <h2 className={h2Class}>대표님들이 가장 많이 찾는 서비스</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg) => (
              <ProductCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 전체 상품 + 카테고리 탭 */}
      <section id="packages" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
          <p className={eyebrow}>전체 상품</p>
          <h2 className={h2Class}>기업 상황에 맞는 서비스를 고르세요</h2>

          {/* Category tabs — 상황 문장으로 표기 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  aria-pressed={active}
                  className={`rounded-full px-5 py-2.5 text-[0.95rem] font-bold transition-colors ${
                    active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === '전체' ? '전체' : CATEGORY_SCENARIOS[cat]}
                </button>
              )
            })}
          </div>

          {/* 상황별 시나리오 그룹 */}
          <div className="mt-8 space-y-10">
            {groups.map((g) => (
              <div key={g.cat}>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{g.scenario}</h3>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((pkg) => (
                    <ProductCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            표기된 가격은 기준 가격이며, 기업 상황과 범위에 따라 달라질 수 있어 상담 후 맞춤 안내드립니다.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
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
        </div>
      </section>

      {/* 활동·신뢰 — 유튜브 채널 (SNS 활동 결과물, 추후 확장) */}
      <section id="channel" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
          <div className="text-center">
            <p className={eyebrow}>믿을 수 있는 활동</p>
            <h2 className={h2Class}>유튜브 ‘김팀장의 경영노트’</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              정책자금·정부지원금·절세 실무를 영상으로 직접 공개하고 있습니다.
            </p>
          </div>
          <a
            href={consultLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="유튜브 김팀장의 경영노트 채널 (새 탭에서 열림)"
            className="group mt-7 block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg motion-reduce:transition-none"
          >
            <img
              src="/assets/profile/youtube-channel.webp"
              alt="유튜브 김팀장의 경영노트 채널 화면 — 정책자금·지원금·절세 실무 영상"
              loading="lazy"
              decoding="async"
              className="w-full"
            />
            <span className="flex items-center justify-center gap-2 border-t border-slate-100 px-4 py-4 text-[1.05rem] font-bold text-slate-800">
              <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden>
                <rect x="1.5" y="5" width="21" height="14" rx="3.5" fill="#FF0000" />
                <path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="#fff" />
              </svg>
              채널 바로가기
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter />

      {/* Mobile sticky CTA */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <Link
            to="/business-diagnosis"
            className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-base font-bold text-white"
          >
            서비스 직접 체크해보기
          </Link>
          <a
            href={consultLinks.kakaoChat}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#FEE500] px-4 py-3.5 text-base font-bold text-[#191919]"
          >
            카톡 상담
          </a>
        </div>
      )}
    </div>
  )
}
