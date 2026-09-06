// 업종 상세 — /ax-industries/:slug
// 15개 페이지를 개별 복사하지 않고 하나의 동적 템플릿 + 데이터 파일로 관리한다.
// 순서: 업종 Hero / 대표자가 자주 겪는 문제 / AX 5단계 / 5장 뷰어 / 여기서 끝나지 않습니다 /
//      AX 확장 예시 2개 / 예상되는 신규매출 구조 / 성과가 남으면(2차 가치) / 진행 4단계 / FAQ / 진단 CTA
// 브랜드 정비(0차): 정책자금·벤처·특허 연결 섹션과 가격 프로그램 카드는 텍스트·단계 설명으로 교체했다.
import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import KakaoFloat from '../components/KakaoFloat'
import LegalFooter from '../components/LegalFooter'
import AxBusinessExpansion from '../components/ax-showcase/AxBusinessExpansion'
import AxBusinessIdeaCard from '../components/ax-showcase/AxBusinessIdeaCard'
import AxFiveStageViewer from '../components/ax-showcase/AxFiveStageViewer'
import { AX_V2_DISCLAIMER, AX_V2_INDUSTRIES, axV2Industry } from '../data/axIndustryShowcaseV2'
import { canonicalUrl } from '../lib/site'

const band = 'px-5 py-10 sm:py-14'
const inner = 'mx-auto max-w-[880px]'

/** 진행 4단계 — 가격을 두지 않고 어디까지 무엇을 하는지만 말한다 */
const AX_STAGES = [
  { key: 'AX FIT', title: '우리 회사에 AX가 필요한지 판단' },
  { key: 'AX BLUEPRINT', title: '사업·업무 분석, AX 우선순위, 구축범위, KPI 설계' },
  { key: '1차 AX BUILD', title: '가장 효과가 큰 핵심업무부터 구축' },
  { key: 'AX SCALE', title: '실증 후 추가 업무·AI·고객플랫폼 확장' },
] as const

function useIndustrySeo(title: string, description: string, slug: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.name = name
        document.head.appendChild(el)
      }
      const prev = el.content
      el.content = content
      return () => { el!.content = prev }
    }
    const restoreDesc = setMeta('description', description)

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const created = !link
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    const prevHref = link.href
    link.href = canonicalUrl(`/ax-industries/${slug}`)

    return () => {
      document.title = prevTitle
      restoreDesc()
      if (created) link?.remove()
      else if (link) link.href = prevHref
    }
  }, [title, description, slug])
}

export default function AxIndustryDetailPage() {
  const { slug = '' } = useParams()
  const industry = axV2Industry(slug)

  useIndustrySeo(industry?.seoTitle ?? '', industry?.seoDescription ?? '', slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!industry) return <Navigate to="/business-services" replace />

  const others = AX_V2_INDUSTRIES.filter((i) => i.slug !== industry.slug).slice(0, 6)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[880px] items-center justify-between gap-3 px-5 py-3">
          <Link to="/business-services" className="flex items-center gap-1.5 text-[1.13rem] sm:text-[1.03rem] font-bold text-slate-300 transition-colors hover:text-white">
            <span aria-hidden>←</span> 미래 AI 랩
          </Link>
          <HeaderAccount />
        </div>
      </header>

      {/* 1. 업종 Hero */}
      <section className={`${band} border-b border-white/10 bg-slate-900`}>
        <div className={inner}>
          <p className="flex items-center gap-2 text-[1.1rem] sm:text-[1.0rem] font-black tracking-tight text-teal-300">
            <span aria-hidden className="text-[1.45rem] sm:text-[1.32rem] leading-none">{industry.icon}</span> {industry.displayName} · INDUSTRY AX PREVIEW
          </p>
          <h1 className="mt-3 break-keep text-[1.93rem] font-black leading-[1.28] text-white sm:text-[2.5rem]">
            {industry.shortHook}
          </h1>
          <p className="mt-4 max-w-2xl break-keep text-[1.26rem] leading-relaxed text-slate-300 sm:text-[1.26rem]">{industry.overview}</p>
          <div className="mt-6 flex flex-col gap-2.5 sm:max-w-lg sm:flex-row">
            <Link to="/business-diagnosis" className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-[1.26rem] sm:text-[1.15rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
              우리 회사 AX 가능성 진단
            </Link>
            <Link to="/business-services#portfolio" className="flex min-h-[52px] items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 text-[1.26rem] sm:text-[1.15rem] font-bold text-white transition-colors hover:bg-white/10">
              실제 AX 구축 화면 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 대표자가 자주 겪는 문제 */}
      <section className={`${band} border-b border-white/10 bg-slate-950`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">
            {industry.displayName} 대표님이 자주 겪는 문제
          </h2>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {industry.ideas.map((idea) => (
              <p key={idea.no} className="break-keep rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-[1.2rem] sm:text-[1.09rem] leading-relaxed text-slate-300">
                {idea.problem}
              </p>
            ))}
          </div>
          <p className="mt-4 break-keep border-l-2 border-amber-400 pl-3.5 text-[1.26rem] font-bold leading-relaxed text-amber-100 sm:text-[1.24rem]">
            {industry.targetCustomer}에게 특히 필요한 구조입니다.
          </p>
        </div>
      </section>

      {/* 3~4. AX 5단계 + 5장 뷰어 */}
      <section className={`${band} border-b border-white/10 bg-slate-900`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">
            현재 업무에 적용하는 <span className="text-teal-300">AX 5단계</span>
          </h2>
          <p className="mt-2.5 max-w-2xl break-keep text-[1.2rem] sm:text-[1.09rem] leading-relaxed text-slate-400">
            단계를 누르면 이미지와 설명이 함께 바뀝니다. 이미지를 누르면 전체화면으로 볼 수 있습니다.
          </p>
          <div className="mt-4">
            <AxFiveStageViewer industry={industry} />
          </div>
        </div>
      </section>

      {/* 5. 여기서 끝나지 않습니다 */}
      <section className={`${band} border-b border-white/10 bg-slate-950`}>
        <div className={inner}>
          <AxBusinessExpansion industryName={industry.displayName} />
        </div>
      </section>

      {/* 6. AX 확장 예시 2개 */}
      <section className={`${band} border-b border-white/10 bg-slate-900`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">
            {industry.displayName}에서 만들 수 있는 <span className="text-amber-300">새로운 사업</span>
          </h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {industry.ideas.map((idea) => (
              <AxBusinessIdeaCard key={idea.no} idea={idea} industryName={industry.displayName} industrySlug={industry.slug} variant="full" />
            ))}
          </div>
        </div>
      </section>

      {/* 7. 예상되는 신규매출 구조 */}
      <section className={`${band} border-b border-white/10 bg-slate-950`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">예상되는 신규매출 구조</h2>
          <p className="mt-2.5 break-keep text-[1.17rem] sm:text-[1.06rem] leading-relaxed text-slate-400">
            아래는 이 업종에서 만들 수 있는 매출 형태의 예시입니다. 실제 적용 범위와 성과는 기업 상황에 따라 달라집니다.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {industry.ideas.flatMap((i) => i.revenues).map((r, i) => (
              <div key={`${r}-${i}`} className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] p-3">
                <span aria-hidden className="mt-0.5 text-[1.13rem] sm:text-[1.03rem]">💰</span>
                <span className="break-keep text-[1.13rem] sm:text-[1.03rem] font-bold leading-snug text-amber-100">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 성과가 남으면 — 정책·지원은 AX 의 2차 가치로만 */}
      <section className={`${band} border-b border-white/10 bg-slate-900`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">
            성과가 남으면, 기업의 다음 성장단계에서도 <span className="text-teal-300">설명할 수 있습니다.</span>
          </h2>
          <p className="mt-4 max-w-2xl break-keep text-[1.2rem] sm:text-[1.09rem] leading-relaxed text-slate-300">
            미래AI랩은 평가를 위한 화면을 만들지 않습니다. 실제 업무가 바뀌고 데이터와 활용근거가 쌓이며, 그 결과가 향후
            정책지원·R&D·정책금융·성장전략에서도 설명 가능한 기업자산으로 남도록 설계합니다.
          </p>
          <p className="mt-4 break-keep rounded-2xl border border-teal-400/25 bg-teal-400/[0.08] p-4 text-[1.24rem] font-bold leading-relaxed text-teal-100 sm:text-[1.21rem]">
            평가받기 위한 모습을 만드는 것이 아니라, 평가받을 수 있는 실체를 만듭니다.
          </p>
          <p className="mt-3 break-keep text-[1.1rem] sm:text-[1.0rem] leading-relaxed text-slate-500">
            정책지원·R&D·정책금융의 결과는 각 기관의 독립적인 판단으로 결정됩니다.
          </p>
        </div>
      </section>

      {/* 9. 진행 4단계 — 가격 없이 범위만 */}
      <section className={`${band} border-b border-white/10 bg-slate-950`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">이렇게 진행합니다</h2>
          <p className="mt-2.5 break-keep text-[1.17rem] sm:text-[1.06rem] leading-relaxed text-slate-400">
            처음부터 모든 기능을 만들지 않습니다. 필요한지 먼저 판단하고, 효과가 가장 큰 업무부터 구축합니다.
          </p>
          <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {AX_STAGES.map((s, i) => (
              <li key={s.key} className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-4">
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-400 text-[1.0rem] font-black text-slate-900">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[1.05rem] sm:text-[1.0rem] font-black tracking-wide text-teal-300">{s.key}</p>
                  <p className="mt-1 break-keep text-[1.2rem] sm:text-[1.09rem] font-bold leading-snug text-white">{s.title}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className={`${band} border-b border-white/10 bg-slate-900`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.49rem] font-black leading-snug text-white sm:text-[1.8rem]">자주 묻는 질문</h2>
          <div className="mt-4 space-y-2">
            {[
              {
                q: `${industry.displayName} 업종도 정말 적용할 수 있나요?`,
                a: '위 화면은 이 업종의 업무 흐름을 가정해 만든 Concept Prototype입니다. 실제 구축 범위는 대표자 인터뷰와 업무 분석 후 확정합니다.',
              },
              {
                q: '기존에 쓰던 프로그램을 버려야 하나요?',
                a: '아닙니다. 지금 쓰는 시스템은 그대로 두고, 끊겨 있는 부분과 사람 손에 남아 있는 업무부터 연결합니다.',
              },
              {
                q: '위 화면을 그대로 쓰게 되나요?',
                a: '아닙니다. 업종별 업무를 가정해 미래AI랩의 AX 설계방식을 구현한 예시이며, 실제 구축 시 해당 기업의 업무와 프로세스에 맞춰 새롭게 설계합니다.',
              },
              {
                q: '어디까지 만들어야 하나요?',
                a: 'AX Fit으로 필요한지 먼저 판단하고, AX Blueprint에서 사업·업무 분석과 구축범위를 정합니다. 1차 AX Build는 효과가 가장 큰 핵심업무 하나로 시작하고, 실증 후 확장합니다.',
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/12 bg-white/[0.04] p-4">
                <summary className="cursor-pointer list-none break-keep text-[1.24rem] sm:text-[1.13rem] font-black text-white marker:hidden">
                  <span className="mr-2 text-teal-300" aria-hidden>Q</span>
                  {f.q}
                </summary>
                <p className="mt-2.5 break-keep text-[1.17rem] sm:text-[1.06rem] leading-relaxed text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 다른 업종 */}
      <section className={`${band} border-b border-white/10 bg-slate-950`}>
        <div className={inner}>
          <h2 className="text-[1.39rem] font-black text-white sm:text-[1.44rem]">다른 업종도 확인해보세요</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/ax-industries/${o.slug}`}
                className="flex min-h-[52px] items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2 text-[1.13rem] sm:text-[1.03rem] font-bold text-slate-200 transition-colors hover:border-teal-400/40 hover:text-white"
              >
                <span aria-hidden className="text-[1.33rem] sm:text-[1.21rem] leading-none">{o.icon}</span>
                <span className="break-keep">{o.displayName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. 최종 CTA */}
      <section className={`${band} bg-slate-900`}>
        <div className={inner}>
          <h2 className="break-keep text-[1.54rem] font-black leading-snug text-white sm:text-[1.9rem]">
            우리 회사 업무가 어떤 AX 구조로 바뀔 수 있는지<br className="hidden sm:block" /> 먼저 확인해보세요.
          </h2>
          <Link
            to="/business-diagnosis"
            className="mt-5 inline-flex min-h-[56px] items-center gap-2 rounded-xl bg-blue-500 px-6 text-[1.33rem] sm:text-[1.21rem] font-black text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-400"
          >
            우리 회사 AX 가능성 진단
          </Link>
          <p className="mt-5 break-keep text-[1.1rem] sm:text-[1.0rem] leading-relaxed text-slate-500">{AX_V2_DISCLAIMER}</p>
        </div>
      </section>

      <LegalFooter />
      <KakaoFloat />
    </div>
  )
}
