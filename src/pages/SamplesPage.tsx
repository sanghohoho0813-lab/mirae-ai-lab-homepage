// 직접 만든 샘플 모아보기 (/business-services/samples) — 산업별 AX + 아이디어 MVP 를 한 화면에.
// 어느 상품 페이지에도 속하지 않는 중립 페이지다. 2주 기술사업 빌드 페이지의 '샘플 보기'가
// AX 상품 페이지로 넘어가 버리던 문제를 막으려고 따로 만들었다.
//  - 샘플이 늘어도 이 페이지는 그대로: 개수·탭 숫자는 portfolioSamples 데이터에서 계산한다.
//    새 종류가 생기면 GROUPS 에 한 줄 더하면 탭과 구역이 같이 생긴다.
//  - 탭은 주소(?tab=ax · ?tab=mvp)에 남겨서, 다른 페이지에서 원하는 탭을 바로 열 수 있다.
//  - 데모는 모두 새 탭으로 연다(rel="noopener noreferrer").
// ⚠️ 고객사 실적이 아니라 직접 만든 예시 화면이라는 점을 맨 위에 밝힌다.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import KakaoFloat from '../components/KakaoFloat'
import {
  AX_PLATFORM_SAMPLES,
  PORTFOLIO_SAMPLES,
  SAMPLE_TOTAL,
  type AxPlatformSample,
  type PortfolioSample,
} from '../data/portfolioSamples'
import { AX_START_PATH, BUSINESS_CHOOSER_PATH, SAMPLES_PATH, VENTURE_MVP_PATH, type SampleTab } from '../lib/businessRoutes'
import { usePageMeta } from '../lib/pageMeta'

const PAGE_TITLE = `직접 만든 샘플 화면 ${SAMPLE_TOTAL}개 | 미래AI랩`
const PAGE_DESC = `미래AI랩이 직접 기획하고 만든 샘플 화면 ${SAMPLE_TOTAL}개를 한곳에 모았어요. 업종별 AX 화면 ${AX_PLATFORM_SAMPLES.length}개와 아이디어 MVP ${PORTFOLIO_SAMPLES.length}개를 직접 눌러 보세요.`

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const
const BTN = 'inline-flex min-h-10 w-full items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 text-[0.88rem] font-black transition-colors sm:text-[0.92rem]'
const BTN_MAIN = `${BTN} bg-[#171B20] text-white hover:bg-[#343B44]`
const BTN_SUB = `${BTN} border border-[#D9DDE2] bg-white text-[#171B20] hover:border-[#D47A4A]/60 hover:text-[#B35A2A]`

/** 카드 한 장 — 그림을 눌러도 대표 화면이 열린다(버튼과 같은 주소라 화면 읽기에서는 숨긴다) */
function SampleCard({
  slug,
  kind,
  img,
  href,
  title,
  sub,
  line,
  children,
}: {
  slug: string
  kind: string
  img: string
  href: string
  title: string
  sub: string
  line: string
  children: ReactNode
}) {
  return (
    <li data-sample={slug} data-sample-kind={kind} className="flex">
      <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-[#E7EAEE] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D47A4A]/50 hover:shadow-md motion-reduce:hover:translate-y-0">
        <a href={href} {...NEW_TAB} tabIndex={-1} aria-hidden className="relative block overflow-hidden border-b border-[#EEF0F2] bg-slate-50">
          <img
            src={img}
            alt=""
            width={720}
            height={450}
            loading="lazy"
            decoding="async"
            className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        </a>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className="break-keep text-[1.02rem] font-black leading-snug text-[#B35A2A] sm:text-[1.1rem]">{title}</p>
          <p className="mt-0.5 break-keep text-[0.8rem] font-bold tracking-wide text-[#8A939C] sm:text-[0.84rem]">{sub}</p>
          <p className="mt-1.5 line-clamp-3 break-keep text-[0.88rem] leading-snug text-[#4B5560] sm:text-[0.94rem]">{line}</p>
          <div className="mt-auto flex flex-col gap-1.5 pt-3">{children}</div>
        </div>
      </article>
    </li>
  )
}

function AxCard({ s }: { s: AxPlatformSample }) {
  return (
    <SampleCard slug={s.slug} kind="산업별 AX" img={s.imgSm} href={s.customerUrl && s.axImg ? s.customerUrl : s.axUrl} title={s.industry} sub={s.name} line={s.line}>
      <a href={s.axUrl} {...NEW_TAB} aria-label={`${s.name} ${s.industry} AX 화면 열기 (새 탭에서 열림)`} className={BTN_MAIN}>
        AX 화면 <span aria-hidden>↗</span>
      </a>
      {s.customerUrl && (
        <a href={s.customerUrl} {...NEW_TAB} aria-label={`${s.name} ${s.customerLabel ?? '고객 화면'} 열기 (새 탭에서 열림)`} className={BTN_SUB}>
          {s.customerLabel ?? '고객 화면'} <span aria-hidden>↗</span>
        </a>
      )}
    </SampleCard>
  )
}

function MvpCard({ s }: { s: PortfolioSample }) {
  return (
    <SampleCard slug={s.slug} kind="아이디어 MVP" img={s.imgSm} href={s.url} title={s.kind} sub={s.name} line={s.summary}>
      <a href={s.url} {...NEW_TAB} aria-label={`${s.name} 직접 눌러 보기 (새 탭에서 열림)`} className={BTN_MAIN}>
        직접 눌러 보기 <span aria-hidden>↗</span>
      </a>
    </SampleCard>
  )
}

/** 샘플 종류 — 새 종류가 생기면 여기에 한 줄 더한다(탭·구역·개수가 같이 생긴다) */
const GROUPS: { key: Exclude<SampleTab, 'all'>; label: string; short: string; title: string; desc: string; count: number; cards: ReactNode }[] = [
  {
    key: 'ax',
    label: '산업별 AX',
    short: 'AX',
    title: '업종별 AX 화면',
    desc: '직원이 쓰는 AX 화면과 고객·거래처가 보는 화면을 따로 열어 볼 수 있어요. 업종별 업무를 가정해 만든 예시이고, 실제로는 회사마다 일하는 방식에 맞춰 새로 설계해요.',
    count: AX_PLATFORM_SAMPLES.length,
    cards: AX_PLATFORM_SAMPLES.map((s) => <AxCard key={s.slug} s={s} />),
  },
  {
    key: 'mvp',
    label: '아이디어 MVP',
    short: 'MVP',
    title: '아이디어 MVP 화면',
    desc: '아이디어를 작동하는 웹앱 서비스로 만든 예시예요. 심사위원이나 투자자 앞에서 이렇게 직접 눌러 보여 드릴 수 있어요.',
    count: PORTFOLIO_SAMPLES.length,
    cards: PORTFOLIO_SAMPLES.map((s) => <MvpCard key={s.slug} s={s} />),
  },
]

const isTab = (v: string | null): v is Exclude<SampleTab, 'all'> => GROUPS.some((g) => g.key === v)

export default function SamplesPage() {
  usePageMeta(PAGE_TITLE, PAGE_DESC, SAMPLES_PATH)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  // 탭 줄은 헤더 바로 아래에 붙는다 — 헤더 높이(폰·PC·로고 줄바꿈마다 다름)를 재서 그만큼 띄운다
  const headerRef = useRef<HTMLElement>(null)
  const [headerH, setHeaderH] = useState(0)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const sync = () => setHeaderH(el.offsetHeight)
    sync()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const raw = params.get('tab')
  const tab: SampleTab = isTab(raw) ? raw : 'all'
  const shown = tab === 'all' ? GROUPS : GROUPS.filter((g) => g.key === tab)
  const tabs: { key: SampleTab; label: string; short: string; count: number }[] = [{ key: 'all', label: '전체', short: '전체', count: SAMPLE_TOTAL }, ...GROUPS]

  const pick = (key: SampleTab) => setParams(key === 'all' ? {} : { tab: key }, { replace: true, preventScrollReset: true })
  // 다른 페이지에서 들어왔으면 그 페이지로, 주소로 바로 들어왔으면 서비스 선택으로
  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate(BUSINESS_CHOOSER_PATH)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAFAF8] text-[#171B20] antialiased [word-break:keep-all]">
      {/* 작은 헤더 — 로고 · 뒤로. 메뉴는 두지 않는다(상세 페이지와 같은 모양) */}
      <header ref={headerRef} className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#FBFAF7]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-2.5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <BrandLogo
              to="/"
              tagline="샘플 모아보기"
              imgClassName="h-8 max-w-[132px] sm:h-10 sm:max-w-[190px]"
              taglineClassName="text-[0.64rem]! tracking-[0.08em]! sm:text-[0.7rem]! sm:tracking-[0.16em]!"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={goBack}
              data-samples-back
              className="inline-flex min-h-9 items-center gap-1 whitespace-nowrap rounded-full border border-[#D9DDE2] bg-white px-3.5 text-[0.86rem] font-semibold text-[#171B20] shadow-sm transition-colors hover:border-[#171B20] sm:min-h-10 sm:px-4 sm:text-[0.98rem]"
            >
              <span aria-hidden>←</span> 돌아가기
            </button>
            <HeaderAccount variant="business" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-9 sm:px-6 sm:pb-20 sm:pt-14">
          <p className="hero-anim text-[1rem] font-black tracking-tight text-[#B35A2A] sm:text-[1.05rem]">SAMPLES</p>
          <h1 style={{ animationDelay: '0.1s' }} className="hero-anim mt-2 break-keep text-[2rem] font-black leading-[1.25] tracking-[-0.02em] sm:text-[2.6rem]">
            직접 만든 화면 <span className="text-[#D47A4A]">{SAMPLE_TOTAL}개</span>
          </h1>
          <p style={{ animationDelay: '0.2s' }} className="hero-anim mt-3 max-w-2xl break-keep text-[1.05rem] leading-relaxed text-[#4B5560] sm:text-[1.15rem]">
            누르면 실제로 작동하는 화면이 <span className="whitespace-nowrap">새 창으로 열려요.</span>
          </p>
          <p style={{ animationDelay: '0.26s' }} className="hero-anim mt-1.5 max-w-2xl break-keep text-[0.9rem] leading-relaxed text-[#8A939C] sm:text-[0.95rem]" data-samples-note>
            고객사 실적이 아니라 미래AI랩이 직접 기획하고 만든 예시 화면(Concept Prototype)이에요.
          </p>

          {/* 탭 — 주소에 남겨서 다른 페이지가 원하는 탭을 바로 열 수 있다 */}
          <div data-samples-tabs style={{ top: headerH }} className="sticky z-20 -mx-5 mt-7 border-b border-[#E7EAEE] bg-[#FAFAF8]/95 px-5 py-2.5 backdrop-blur-md sm:-mx-6 sm:mt-9 sm:px-6">
            <div role="tablist" aria-label="샘플 종류" className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] sm:gap-2">
              {tabs.map((t) => {
                const on = t.key === tab
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    data-samples-tab={t.key}
                    onClick={() => pick(t.key)}
                    className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[0.92rem] font-bold transition-colors sm:min-h-11 sm:px-4.5 sm:text-[1rem] ${
                      on ? 'bg-[#171B20] text-white' : 'border border-[#D9DDE2] bg-white text-[#4B5560] hover:border-[#171B20] hover:text-[#171B20]'
                    }`}
                  >
                    <span className="min-[420px]:hidden">{t.short}</span>
                    <span className="hidden min-[420px]:inline">{t.label}</span>
                    <span className={`text-[0.82rem] font-black sm:text-[0.88rem] ${on ? 'text-[#E8B89A]' : 'text-[#B35A2A]'}`}>{t.count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {shown.map((g) => (
            <section key={g.key} data-samples-group={g.key} aria-labelledby={`samples-${g.key}`} className="mt-8 sm:mt-10">
              <h2 id={`samples-${g.key}`} className="flex items-baseline gap-2 break-keep text-[1.35rem] font-black tracking-tight sm:text-[1.6rem]">
                {g.title}
                <span className="text-[1rem] font-black text-[#D47A4A] sm:text-[1.1rem]">{g.count}개</span>
              </h2>
              <p className="mt-1.5 max-w-3xl break-keep text-[0.95rem] leading-relaxed text-[#646E78] sm:text-[1rem]">{g.desc}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{g.cards}</ul>
            </section>
          ))}
        </section>

        {/* 마무리 — 어느 서비스로 이어질지 고르게 한다 */}
        <section className="bg-[#171B20] text-white">
          <div className="mx-auto max-w-[880px] px-5 py-14 text-center sm:px-6 sm:py-16">
            <p className="text-[1.02rem] font-bold text-[#E8B89A] sm:text-[1.1rem]">우리 회사에도 이런 화면이 필요하다면</p>
            <h2 className="mt-2.5 break-keep text-[1.6rem] font-black leading-tight tracking-tight sm:text-[2rem]">맞는 서비스를 골라 보세요.</h2>
            <div className="mx-auto mt-7 grid max-w-xl gap-2.5 sm:grid-cols-2 sm:gap-3">
              <Link
                to={VENTURE_MVP_PATH}
                className="flex min-h-14 flex-col items-center justify-center rounded-2xl bg-[#D47A4A] px-4 py-3 text-[#171B20] transition-colors hover:bg-[#E8B89A]"
              >
                <span className="text-[1.1rem] font-black">2주 기술사업 빌드 →</span>
                <span className="mt-0.5 text-[0.86rem] font-semibold">아이디어는 작동하는 웹앱 서비스로</span>
              </Link>
              <Link
                to={AX_START_PATH}
                className="flex min-h-14 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white transition-colors hover:bg-white/[0.12]"
              >
                <span className="text-[1.1rem] font-black">Full AX 구축 →</span>
                <span className="mt-0.5 text-[0.86rem] font-semibold text-slate-300">회사를 AI와 데이터로 일하는 회사로</span>
              </Link>
            </div>
            <p className="mt-5">
              <Link
                to={BUSINESS_CHOOSER_PATH}
                className="inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.95rem] font-semibold text-slate-400 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white hover:decoration-slate-300"
              >
                두 서비스 비교하기 <span aria-hidden>→</span>
              </Link>
            </p>
          </div>
        </section>
      </main>

      <LegalFooter tone="dark" />
      <KakaoFloat />
    </div>
  )
}
