import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import BusinessInquiryForm from '../components/BusinessInquiryForm'

// 중소기업 대표님을 위한 공개 서비스몰 페이지. 기존 페이지/컴포넌트는 건드리지 않습니다.
// 디자인 토큰(화이트 배경·네이비 포인트·담백한 카드)은 기존 사이트(App.tsx)를 따릅니다.

const trustBadges = ['정책자금', '정부지원사업', '벤처인증', 'AI 사업계획', 'MVP 제작']

const problems = [
  {
    icon: '🧭',
    text: '받을 수 있는 지원사업이 있어도, 어디서부터 봐야 할지 모르겠습니다.',
  },
  {
    icon: '📝',
    text: '사업계획서는 필요한데, 우리 회사의 기술성과 차별점을 말로 풀기 어렵습니다.',
  },
  {
    icon: '🧩',
    text: '벤처인증·연구소·정책자금이 따로 놀아서, 전체 전략이 없습니다.',
  },
  {
    icon: '🖥️',
    text: '심사자에게 보여줄 홈페이지나 MVP 결과물이 부족합니다.',
  },
]

type Package = {
  name: string
  tagline: string
  target: string
  deliverables: string[]
}

const packages: Package[] = [
  {
    name: '정책자금 가능성 진단 패키지',
    tagline: '현재 재무·업종·업력 기준으로 검토 가능한 정책자금 방향을 정리합니다.',
    target: '대출 금리를 낮추고 싶은 대표, 운전자금이 필요한 대표',
    deliverables: ['정책자금 가능성 진단 리포트', '우선 검토 제도 목록', '신청 전 준비물 체크리스트'],
  },
  {
    name: '정부지원사업 사업계획 전략 패키지',
    tagline: '예창패·초창패·소상공인 지원사업 등 신청 전 사업계획 구조를 정리합니다.',
    target: '지원사업을 처음 준비하는 대표',
    deliverables: ['사업계획 스토리 구조안', '항목별 작성 가이드', '심사 포인트 정리'],
  },
  {
    name: '벤처인증 스토리 설계 패키지',
    tagline: '단순 사업을 기술성·성장성 중심의 벤처인증 스토리로 재구성합니다.',
    target: '벤처기업확인을 준비하는 법인',
    deliverables: ['기술성·성장성 스토리라인', '벤처 유형 검토', '준비 서류 로드맵'],
  },
  {
    name: '홈페이지 + MVP 제작 패키지',
    tagline: '심사자와 고객에게 보여줄 웹페이지와 간단한 작동형 MVP를 제작합니다.',
    target: '아이디어는 있지만 보여줄 결과물이 부족한 대표',
    deliverables: ['소개 웹페이지', '작동형 MVP 화면', '데모용 시연 시나리오'],
  },
  {
    name: '연구소·기업인증 로드맵 패키지',
    tagline: '기업부설연구소·벤처·이노비즈/메인비즈 인증 흐름을 정리합니다.',
    target: '인증과 사후관리를 함께 보고 싶은 법인',
    deliverables: ['인증 우선순위 로드맵', '요건·서류 체크리스트', '사후관리 일정안'],
  },
  {
    name: '정책자금·벤처인증 풀패키지',
    tagline: '자금·인증·사업계획·MVP·홈페이지를 하나의 성장 로드맵으로 설계합니다.',
    target: '중장기적으로 기업지원제도를 제대로 활용하려는 대표',
    deliverables: ['통합 성장 로드맵', '단계별 실행 계획', '우선 제작물 우선순위'],
  },
]

const comparison: { label: string; agency: string; homepage: string; ours: string }[] = [
  {
    label: '접근 초점',
    agency: '신청서 작성 대행',
    homepage: '화면 디자인 제작',
    ours: '자금·인증·사업계획·MVP를 하나로 연결',
  },
  {
    label: '사업계획',
    agency: '양식 채우기',
    homepage: '해당 없음',
    ours: '기술성·성장성 스토리로 구조화',
  },
  {
    label: '결과물',
    agency: '제출 서류',
    homepage: '홈페이지',
    ours: '홈페이지 + MVP + 실행 로드맵',
  },
  {
    label: '관점',
    agency: '단건 처리',
    homepage: '외주 제작',
    ours: '대표님 사업을 제도 언어로 정리',
  },
]

const processSteps = [
  { title: '기본 진단', desc: '현황과 목표를 간단히 확인합니다.' },
  { title: '업종·재무·아이템 분석', desc: '강점과 준비 상태를 점검합니다.' },
  { title: '지원사업·인증 방향 설계', desc: '우선순위와 전략을 정리합니다.' },
  { title: '필요한 결과물 제작', desc: '사업계획·홈페이지·MVP 등을 준비합니다.' },
  { title: '신청 전략·후속 실행 정리', desc: '일정과 준비물을 정리합니다.' },
]

const cases = [
  {
    before: '의료폐기물 수거업체',
    after: '의료폐기물 운영관리 플랫폼 기업 스토리로 재구성',
  },
  {
    before: '일반 제조업체',
    after: '연구개발 과제와 기업부설연구소 운영 흐름 정리',
  },
  {
    before: '신규 창업자',
    after: '정부지원사업용 사업계획서 구조와 MVP 화면 설계',
  },
]

const eyebrow = 'text-base font-bold uppercase tracking-widest text-blue-600'
const h2Class = 'mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'
const cardClass = 'rounded-3xl border border-slate-200 bg-white p-7 shadow-sm'

export default function BusinessServicesPage() {
  useEffect(() => {
    document.title = '중소기업 대표님을 위한 AI 경영지원 서비스몰 | 미래 AI 랩'
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [word-break:keep-all]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black tracking-tight text-sky-400">
              AI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden text-base font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              홈
            </Link>
            <a
              href="#apply"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
            >
              무료 진단 신청하기
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              미래 AI 랩 · 미래경영지원센터
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.15]">
              중소기업 대표님을 위한
              <br />
              AI 경영지원 서비스몰
            </h1>
            <p className="mt-6 text-lg font-semibold leading-relaxed text-slate-800 sm:text-xl">
              대표님의 사업을 <span className="text-blue-600">정책자금·정부지원사업·벤처인증</span>에 맞는 언어로
              정리해드립니다.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              홈페이지, MVP, 사업계획 스토리, 인증·자금 로드맵까지 — 흩어진 준비물을 하나의 실행 패키지로
              묶어드립니다.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#apply"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-7 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
              >
                무료 진단 신청하기
              </a>
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 text-lg font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                패키지 둘러보기
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className={eyebrow}>이런 고민, 있으셨나요</p>
          <h2 className={h2Class}>준비할 건 많은데, 전략이 없습니다</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {problems.map((p) => (
            <article key={p.text} className={`${cardClass} flex items-start gap-4`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">
                {p.icon}
              </span>
              <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="scroll-mt-20 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className={eyebrow}>경영지원 패키지</p>
            <h2 className={h2Class}>대표님 상황에 맞는 패키지를 고르세요</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              각 패키지는 <b className="font-semibold text-slate-800">문제 → 제공 결과물 → 추천 대상 → 상담</b> 흐름으로
              정리했습니다. 비용은 대표님 상황에 따라 달라, 진단 후 제안드립니다.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <article key={pkg.name} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{pkg.name}</h3>
                <p className="mt-2.5 text-base leading-relaxed text-slate-600">{pkg.tagline}</p>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">제공 결과물</p>
                  <ul className="mt-2 space-y-1.5">
                    {pkg.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-0.5 text-blue-500" aria-hidden>
                          ✓
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-inset ring-slate-100">
                  추천 대상 · {pkg.target}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <span className="text-sm font-semibold text-slate-500">비용 · 진단 후 제안</span>
                  <a
                    href="#apply"
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                  >
                    상담 신청
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className={eyebrow}>무엇이 다른가</p>
          <h2 className={h2Class}>단순 대행도, 단순 제작도 아닙니다</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            AI 기반 경영전략 · 실제 컨설팅 경험 · 웹/MVP 제작 역량을 하나의 스토리로 연결합니다.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-32 px-4 py-3 text-sm font-semibold text-slate-400" />
                <th className="px-4 py-3 text-sm font-bold text-slate-500">단순 대행</th>
                <th className="px-4 py-3 text-sm font-bold text-slate-500">일반 홈페이지 제작</th>
                <th className="rounded-t-xl bg-slate-900 px-4 py-3 text-sm font-bold text-sky-300">미래 AI 랩 방식</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.label} className="border-t border-slate-100">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">{row.label}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{row.agency}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{row.homepage}</td>
                  <td
                    className={`bg-slate-900/[0.03] px-4 py-4 text-sm font-semibold text-slate-900 ${
                      i === comparison.length - 1 ? 'rounded-b-xl' : ''
                    }`}
                  >
                    {row.ours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className={eyebrow}>진행 과정</p>
            <h2 className={h2Class}>진단부터 실행 정리까지, 5단계</h2>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <li key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-extrabold text-blue-600">{`0${i + 1}`}</span>
                <p className="mt-2 text-lg font-bold leading-snug text-slate-900">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cases */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className={eyebrow}>정리 사례</p>
          <h2 className={h2Class}>같은 사업도, 어떻게 정리하느냐가 다릅니다</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            아래는 이해를 돕기 위한 비식별 예시입니다. (실제 업체명이 아닙니다.)
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <article key={c.before} className={cardClass}>
              <p className="text-sm font-semibold text-slate-400">기존</p>
              <p className="mt-1.5 text-base font-medium text-slate-700">{c.before}</p>
              <p className="mt-4 text-sm font-semibold text-blue-600">정리 후 →</p>
              <p className="mt-1.5 text-base font-bold leading-relaxed text-slate-900">{c.after}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            본 서비스는 정책자금 승인, 정부지원사업 선정, 벤처기업확인 취득을 보장하지 않습니다. 기업의 업종,
            재무상태, 대표자 이력, 신청 시점, 기관 심사 기준에 따라 결과는 달라질 수 있습니다. 미래AI랩은
            대표님의 사업을 제도와 심사 기준에 맞게 정리하고, 실행 가능한 준비물을 갖추는 것을 돕습니다.
          </p>
        </div>
      </section>

      {/* Apply CTA */}
      <section id="apply" className="scroll-mt-20 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <div className="text-center">
            <p className={eyebrow}>무료 진단 신청</p>
            <h2 className={h2Class}>먼저, 대표님 상황부터 진단해보세요</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              간단히 남겨주시면, 어떤 준비부터 시작하면 좋을지 방향을 정리해 안내드립니다.
            </p>
          </div>
          <div className="mt-10">
            <BusinessInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-base font-black text-sky-400">
                AI
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-bold text-slate-900">미래 AI 랩</span>
                <span className="text-xs font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
              </span>
            </div>
            <Link to="/" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              ← 미래 AI 랩 홈으로
            </Link>
          </div>
          <p className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-400">
            © {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 AI 경영지원
          </p>
        </div>
      </footer>
    </div>
  )
}
