// FINAL 리빌드 섹션 — 표면은 짧게, 아코디언은 깊게 (SHORT ON THE SURFACE, DEEP UNDER THE SURFACE).
// 리듬: 강한 한 문장 → 큰 실제 화면 → 짧은 설명 → 인포그래픽 → 직접 눌러보기 → 실제 프로젝트 → 펼쳐보는 깊이 → CTA.
import { Link } from 'react-router-dom'
import { AX_PLATFORM_SAMPLES, type AxPlatformSample } from '../../data/portfolioSamples'
import { DEEP_PROJECTS, type DeepProject } from '../../data/realProjectsDeep'
import { AX_BUILD_PAYMENT } from '../../data/axPackages'

/* ── HOME 03 — 말 대신 화면: 천천히 흐르는 실제 UI + 직접 눌러보기 ─────────── */

function ShowcaseShot({ s }: { s: AxPlatformSample }) {
  return (
    <figure className="relative w-[380px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#343B44] shadow-xl shadow-black/30 sm:w-[520px]">
      <img
        src={s.img}
        srcSet={`${s.imgSm} 720w, ${s.img} 1440w`}
        sizes="520px"
        alt={s.alt}
        width={1440}
        height={900}
        decoding="async"
        className="block aspect-[16/10] w-full object-cover object-top"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171B20]/95 via-[#171B20]/60 to-transparent px-4 pb-3 pt-10">
        <span className="text-[1.25rem] font-black leading-tight text-[#D47A4A] sm:text-[1.45rem]">{s.industry}</span>
      </figcaption>
    </figure>
  )
}

export function AxScreenShowcase() {
  const rowA = AX_PLATFORM_SAMPLES.slice(0, 5)
  const rowB = AX_PLATFORM_SAMPLES.slice(5)
  return (
    <section id="portfolio" className="scroll-mt-16 border-t border-white/10 bg-[#171B20]">
      <div className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <h2 className="break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
            말로 설명하면 복잡합니다.<br className="sm:hidden" /> 그래서 먼저 보여드릴게요.
          </h2>
        </div>

        {/* 광고 배너가 아니라 제품을 천천히 구경하는 느낌 — PC 전용, 모바일은 아래 그리드로 */}
        <div className="mt-10 hidden space-y-5 overflow-hidden sm:block">
          <div className="ax-drift-row overflow-hidden">
            <div className="ax-drift-track ax-drift-a flex w-max gap-5 pl-8">
              {rowA.map((s) => (
                <ShowcaseShot key={s.slug} s={s} />
              ))}
            </div>
          </div>
          <div className="ax-drift-row overflow-hidden">
            <div className="ax-drift-track ax-drift-b ml-auto flex w-max gap-5 pr-8">
              {rowB.map((s) => (
                <ShowcaseShot key={s.slug} s={s} />
              ))}
            </div>
          </div>
        </div>

        {/* 직접 눌러보기 */}
        <div className="mx-auto mt-12 max-w-[86rem] px-5 sm:mt-16 sm:px-6">
          <p className="break-keep text-center text-[1.5rem] font-black leading-snug text-white sm:text-[1.8rem]">직접 눌러보세요.</p>
          <p className="mx-auto mt-3 max-w-2xl break-keep text-center text-[1.08rem] leading-[1.7] text-slate-400 sm:text-[1.18rem]">
            직원이 쓰는 <span className="font-bold text-[#D47A4A]">AX 화면</span>과 고객·거래처가 쓰는{' '}
            <span className="font-bold text-[#D47A4A]">플랫폼 화면</span>을 각각 열어볼 수 있습니다. 모두 자체 제작 시연 데모입니다.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {AX_PLATFORM_SAMPLES.map((s) => (
              <article key={s.slug} className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#343B44] transition-colors hover:border-[#D47A4A]/45">
                <img
                  src={s.imgSm}
                  alt={s.alt}
                  width={720}
                  height={450}
                  decoding="async"
                  className="block aspect-[16/10] w-full object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-3">
                  <p className="break-keep text-[1.1rem] font-black leading-tight text-[#D47A4A] sm:text-[1.14rem]">{s.industry}</p>
                  <p className="mt-1.5 line-clamp-2 break-keep text-[0.95rem] leading-snug text-slate-400 sm:text-[0.98rem]">{s.line}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
                    <a href={s.axUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#D47A4A] px-2.5 text-[0.95rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]">
                      AX 화면 <span aria-hidden>↗</span>
                    </a>
                    {s.customerUrl && (
                      <a href={s.customerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#D47A4A]/35 bg-white/5 px-2.5 text-[0.95rem] font-black text-white transition-colors hover:bg-[#343B44]">
                        {s.customerLabel ?? '고객 화면'} <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 공용 — 실제 업종 샘플 그리드 (상세페이지 등에서 재사용, 기존 앵커 유지) ── */

export function AxSamplesGridSection({ title }: { title?: string }) {
  return (
    <section id="ax-showcase-v2" className="scroll-mt-16 border-t border-white/10 bg-[#171B20]">
      <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          {title ?? '우리 업종이라면 어떤 모습이 되는지 직접 눌러보세요.'}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.08rem] leading-[1.7] text-slate-400 sm:text-[1.18rem]">
          직원이 쓰는 <span className="font-bold text-[#D47A4A]">AX 화면</span>과 고객·거래처가 쓰는{' '}
          <span className="font-bold text-[#D47A4A]">플랫폼 화면</span>을 각각 열어볼 수 있습니다. 모두 자체 제작 시연 데모입니다.
        </p>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {AX_PLATFORM_SAMPLES.map((s) => (
            <article key={s.slug} className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#343B44] transition-colors hover:border-[#D47A4A]/45">
              <img src={s.imgSm} alt={s.alt} width={720} height={450} decoding="async" className="block aspect-[16/10] w-full object-cover object-top" />
              <div className="flex flex-1 flex-col p-3">
                <p className="break-keep text-[1.1rem] font-black leading-tight text-[#D47A4A] sm:text-[1.14rem]">{s.industry}</p>
                <p className="mt-1.5 line-clamp-2 break-keep text-[0.95rem] leading-snug text-slate-400 sm:text-[0.98rem]">{s.line}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2.5">
                  <a href={s.axUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#D47A4A] px-2.5 text-[0.95rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]">
                    AX 화면 <span aria-hidden>↗</span>
                  </a>
                  {s.customerUrl && (
                    <a href={s.customerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#D47A4A]/35 bg-white/5 px-2.5 text-[0.95rem] font-black text-white transition-colors hover:bg-[#343B44]">
                      {s.customerLabel ?? '고객 화면'} <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── HOME 05 — 대표에게 직접 꽂히는 장면 ─────────────────────────────────── */

const CEO_NOISE = ['전화', '카카오톡', '엑셀', '직원 질문', '결재', '보고'] as const

export function AxCeoMomentSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(251,191,36,0.08),transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="break-keep text-[1.95rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.6rem]">
          매출이 커질수록<br />
          대표가 더 바빠진다면,<br />
          <span className="text-amber-300">그게 정말 좋은 성장일까요?</span>
        </h2>

        {/* 대표를 둘러싼 소음 */}
        <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-2">
          {CEO_NOISE.map((t, i) => (
            <span
              key={t}
              className={`rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[1.05rem] font-bold text-slate-300 sm:text-[1.14rem] ${i % 2 ? 'rotate-1' : '-rotate-1'}`}
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[1.0rem] font-bold text-slate-500 sm:text-[1.08rem]">…사이 어딘가에 대표님이 있습니다.</p>

        <p className="mx-auto mt-12 max-w-2xl break-keep text-[1.35rem] font-black leading-[1.65] text-white sm:mt-16 sm:text-[1.6rem]">
          대표님이 일주일 자리를 비워도<br className="sm:hidden" /> 회사의 기본 운영은 돌아가야 합니다.
        </p>
        <div className="mx-auto mt-6 max-w-2xl space-y-4">
          <p className="break-keep text-[1.18rem] leading-[1.75] text-slate-300 sm:text-[1.3rem]">
            직원이 바뀌어도, 고객과 업무의 기억은 회사에 남아야 합니다.
          </p>
          <p className="break-keep text-[1.18rem] leading-[1.75] text-slate-300 sm:text-[1.3rem]">
            매출이 두 배가 됐다고 대표님의 업무도 두 배가 되는 회사라면, 아직 시스템이 없는 것입니다.
          </p>
        </div>
        <p className="mx-auto mt-8 max-w-2xl break-keep text-[1.22rem] font-bold leading-[1.75] text-slate-100 sm:text-[1.34rem]">
          미래AI랩은 대표의 머릿속에 있는 회사를,{' '}
          <span className="text-teal-300">회사가 스스로 기억하고 먼저 보여주고 기본 업무를 이어가는 구조</span>로 옮깁니다.
        </p>
        <p className="mx-auto mt-4 max-w-xl break-keep text-[1.0rem] leading-relaxed text-slate-500 sm:text-[1.08rem]">
          모든 것이 자동이 되는 것은 아닙니다 — 판단·승인·예외 대응은 대표의 몫으로 남고, 반복 확인과 재정리를 시스템이 맡습니다.
        </p>
      </div>
    </section>
  )
}

/* ── HOME 07 — 실제 개발 프로젝트: 카드 + 깊은 아코디언 ───────────────────── */

function FlowStrip({ label, steps }: { label: string; steps: string[] }) {
  return (
    <div className="rounded-xl border border-teal-400/25 bg-teal-50/60 p-3.5">
      <p className="text-[0.9rem] font-black tracking-wide text-teal-700">{label}</p>
      <p className="mt-2 flex flex-wrap items-center gap-y-1.5">
        {steps.map((t, i) => (
          <span key={t} className="flex items-center">
            {i > 0 && <span aria-hidden className="mx-1 text-[0.85rem] font-black text-teal-500">→</span>}
            <span className="break-keep rounded-md bg-white px-1.5 py-0.5 text-[0.9rem] font-bold text-slate-700 ring-1 ring-inset ring-teal-200">{t}</span>
          </span>
        ))}
      </p>
    </div>
  )
}

function DeepProjectCard({ p }: { p: DeepProject }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* 첫 화면 — 간결하게 */}
      <div className="p-5 sm:p-6">
        <h3 className="break-keep text-[1.35rem] font-black leading-snug text-slate-900 sm:text-[1.5rem]">{p.industry}</h3>
        <p className="mt-1.5 break-keep text-[1.08rem] font-bold text-slate-600 sm:text-[1.16rem]">{p.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[0.95rem] font-black text-teal-300">{p.stage}</span>
          {p.funding && (
            <span className="inline-flex items-center gap-1.5 text-[0.92rem] font-bold text-slate-500">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 정책자금 조달 신청 진행 중
            </span>
          )}
        </div>
      </div>

      {/* 깊이는 펼친 사람에게만 */}
      <details className="group border-t border-slate-200">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-[1.08rem] font-black text-teal-700 transition-colors hover:bg-teal-50/60 sm:px-6 sm:text-[1.14rem] [&::-webkit-details-marker]:hidden">
          {p.expandLabel}
          <span aria-hidden className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
          {p.intro.map((t, i) => (
            <p key={t} className={`break-keep leading-[1.7] ${i === 0 ? 'text-[1.16rem] font-black text-slate-900 sm:text-[1.24rem]' : 'mt-2 text-[1.05rem] text-slate-600 sm:text-[1.1rem]'}`}>
              {t}
            </p>
          ))}
          {p.honesty && (
            <p className="mt-3 break-keep rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[0.98rem] leading-relaxed text-amber-900 sm:text-[1.02rem]">
              {p.honesty}
            </p>
          )}

          {/* 카테고리별 서브 아코디언 — 한 번에 모두 길게 열리지 않게 */}
          <div className="mt-4 space-y-2">
            {p.categories.map((c) => (
              <details key={c.name} className="group/cat rounded-xl border border-slate-200 bg-white">
                <summary className="flex min-h-[46px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-[1.02rem] font-black text-slate-800 transition-colors hover:bg-slate-50 sm:text-[1.08rem] [&::-webkit-details-marker]:hidden">
                  <span className="break-keep">
                    {c.name} <span className="ml-1 font-bold text-slate-400">{c.items.length}</span>
                  </span>
                  <span aria-hidden className="shrink-0 text-slate-300 transition-transform group-open/cat:rotate-180">⌄</span>
                </summary>
                <div className="border-t border-slate-100 px-4 py-3.5">
                  <ul className="space-y-1.5">
                    {c.items.map((t) => (
                      <li key={t} className="flex gap-2 break-keep text-[0.98rem] leading-snug text-slate-600 sm:text-[1.02rem]">
                        <span aria-hidden className="mt-0.5 shrink-0 text-teal-500">·</span>
                        {t.includes('검증 대기') ? (
                          <span>
                            {t.split(' — ')[0]} —{' '}
                            <b className="rounded bg-amber-100 px-1 py-0.5 text-amber-800">{t.split(' — ')[1]}</b>
                          </span>
                        ) : (
                          t
                        )}
                      </li>
                    ))}
                  </ul>
                  {c.flows && (
                    <div className="mt-3 space-y-2.5">
                      {c.flows.map((f) => (
                        <FlowStrip key={f.label} label={f.label} steps={f.steps} />
                      ))}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>

          {p.outro && (
            <div className="mt-4 rounded-xl bg-slate-900 px-4 py-4">
              {p.outro.map((t, i) => (
                <p key={t} className={`break-keep leading-[1.7] ${i === 0 ? 'text-[1.02rem] font-bold text-slate-300' : 'mt-1.5 text-[1.08rem] font-black text-teal-300'} sm:text-[1.1rem]`}>
                  {t}
                </p>
              ))}
            </div>
          )}
        </div>
      </details>
    </article>
  )
}

export function AxRealProjectsDeep() {
  const [flag1, flag2, ...rest] = DEEP_PROJECTS
  return (
    <section id="real-projects" className="scroll-mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.1rem] font-black tracking-tight text-blue-600 sm:text-[1.2rem]">REAL · FIELD PROJECTS</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          그리고 지금,<br className="sm:hidden" /> 실제 현장에서도 만들고 있습니다.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.15rem] leading-[1.7] text-slate-600 sm:text-[1.25rem]">
          실제 기업의 업무와 데이터를 연결하며 운영 가능한 수준으로 고도화하고 있는 프로젝트들입니다. 고객사 보호를 위해 업종으로만 표기합니다.
        </p>

        {/* 대표 2건 — 깊은 아코디언 */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:mt-12 lg:grid-cols-2">
          <DeepProjectCard p={flag1} />
          <DeepProjectCard p={flag2} />
        </div>
        {/* 나머지 4건 — 요약 아코디언 */}
        <div className="mx-auto mt-4 grid max-w-6xl gap-4 lg:grid-cols-2">
          {rest.map((p) => (
            <DeepProjectCard key={p.slug} p={p} />
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[0.98rem] leading-relaxed text-slate-400 sm:text-[1.05rem]">
          업체명·실화면·내부 자료는 공개하지 않습니다. 펼쳐본 범위는 각 프로젝트에서 실제 구현했거나 고도화 범위로 정의된 것입니다.
        </p>
      </div>
    </section>
  )
}

/* ── HOME 08 — 왜 미래AI랩인가: 분절 vs 하나의 이야기 ─────────────────────── */

const SPLIT_PLAYERS = ['경영컨설팅', '개발사', '특허사무소', '인증기관', '사업계획서', '정책자금', '정부지원사업'] as const
const SPLIT_QUESTIONS = [
  '왜 이 AX가 이 회사에 필요한가?',
  '기존 사업의 어떤 문제를 해결하는가?',
  '고객과 매출은 어떻게 늘어나는가?',
  '기술적으로 무엇이 다른가?',
  '어떻게 실증할 것인가?',
] as const
const ONE_STORY = ['사업 진단', '수요·고객·매출 확인', '시장조사', 'AX + Platform 설계', '실제 개발', '데이터 축적', 'IP · 기술자산', '실증', '정책 · 지원 · 투자', 'Scale-up'] as const

const TOGETHER = [
  { name: '기업 구조', items: ['개인 → 법인 전환 검토', '법인 설립', '업종 추가·변경', '목적사항 정비', '정관 개정'] },
  { name: '기술자산', items: ['특허 출원', '지식재산 구조화'] },
  { name: '기술기업 기반', items: ['벤처기업확인', '기업부설연구소 · 연구전담부서', '필요 시 메인비즈 · 이노비즈 · ISO'] },
  { name: '시장 · 사업성', items: ['수요 증명(기존 고객·반복구매·재방문·거래량·실제 매출)', '경쟁구조 · TAM · SAM · SOM', '현실적인 시장점유 범위 · 성장 시나리오'] },
  { name: 'AX · Product', items: ['Business AX', 'Customer · Partner Platform', '데이터 구조 · AI/Rule', 'KPI · Evidence 구조'] },
  { name: '사업화', items: ['사업계획서', '정책자금 · 보증', '정부지원사업', '투자 설명자료'] },
] as const

export function AxOneStorySection() {
  return (
    <section id="why-mirae" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.4] tracking-[-0.015em] text-slate-900 sm:text-[2.4rem]">
          좋은 프로그램 하나만 만들어서는<br className="hidden sm:block" /> 회사가 바뀌지 않습니다.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.2rem] font-bold leading-[1.75] text-slate-700 sm:text-[1.3rem]">
          AX는 사업의 필요성부터 마지막 실증까지 <span className="text-teal-700">하나의 이야기</span>로 연결돼야 합니다.
        </p>

        {/* 따로 맡기면 끊기는 이유 */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <p className="text-[1.0rem] font-black tracking-wide text-slate-400">따로 맡기면</p>
          <p className="mt-2.5 flex flex-wrap items-center gap-y-1.5">
            {SPLIT_PLAYERS.map((t, i) => (
              <span key={t} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1.5 text-[1.0rem] font-black text-slate-300">|</span>}
                <span className="break-keep rounded-md bg-slate-100 px-2 py-1 text-[0.98rem] font-bold text-slate-500 sm:text-[1.05rem]">{t}</span>
              </span>
            ))}
          </p>
          <p className="mt-4 break-keep text-[1.05rem] leading-[1.7] text-slate-600 sm:text-[1.12rem]">
            사업계획에는 A라고 쓰고, 개발사는 B를 만들고, 특허는 C를 설명하고, 지원사업 신청에서는 D를 말한다면 —{' '}
            각각 좋은 결과물이 있어도 이런 질문들 앞에서 이야기가 끊기기 쉽습니다.
          </p>
          <ul className="mt-3 space-y-1">
            {SPLIT_QUESTIONS.map((q) => (
              <li key={q} className="break-keep text-[0.98rem] font-bold leading-snug text-slate-400 sm:text-[1.05rem]">“{q}”</li>
            ))}
          </ul>
        </div>

        {/* 하나의 Growth Story */}
        <div className="mx-auto mt-4 max-w-3xl rounded-3xl border-2 border-teal-500/50 bg-white p-5 shadow-lg shadow-teal-500/10 sm:p-7">
          <p className="text-[1.0rem] font-black tracking-wide text-teal-700">미래AI랩 — 하나의 Growth Story</p>
          <ol className="mt-3 flex flex-wrap items-center gap-y-2">
            {ONE_STORY.map((t, i) => (
              <li key={t} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1.5 text-[0.95rem] font-black text-teal-400">→</span>}
                <span className="break-keep rounded-lg bg-teal-50 px-2 py-1 text-[0.98rem] font-bold text-slate-800 ring-1 ring-inset ring-teal-200 sm:text-[1.05rem]">{t}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 사업계획서도 다르게 — 방향 */}
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="break-keep text-[1.3rem] font-black leading-snug text-slate-900 sm:text-[1.5rem]">
            사업계획서의 문장을 먼저 만들고,<br className="sm:hidden" /> 사업을 그 문장에 맞추지 않습니다.
          </p>
          <p className="mx-auto mt-3 max-w-2xl break-keep text-[1.1rem] leading-[1.75] text-slate-600 sm:text-[1.2rem]">
            고객·매출·반복수요·시장·AX 구조·실제 화면·실증계획을 먼저 만들고, 그 근거를 사업계획서로 정리합니다.
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-y-1.5 text-[1.02rem] font-black sm:text-[1.1rem]">
            {['BUSINESS', 'SYSTEM', 'DATA', 'EVIDENCE', 'PLAN'].map((t, i) => (
              <span key={t} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1.5 text-slate-300">→</span>}
                <span className={i === 4 ? 'rounded-lg bg-slate-900 px-2.5 py-1 text-teal-300' : 'text-slate-700'}>{t}</span>
              </span>
            ))}
          </p>
        </div>

        {/* 필요하다면 여기까지 같이 봅니다 — 펼침 */}
        <details className="group mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white">
          <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 text-[1.1rem] font-black text-slate-800 transition-colors hover:bg-slate-50 sm:text-[1.18rem] [&::-webkit-details-marker]:hidden">
            필요하다면, 여기까지 같이 봅니다
            <span aria-hidden className="shrink-0 text-slate-300 transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <div className="grid gap-3 border-t border-slate-100 px-5 py-5 sm:grid-cols-2">
            {TOGETHER.map((g) => (
              <div key={g.name}>
                <p className="text-[1.0rem] font-black text-teal-700 sm:text-[1.05rem]">{g.name}</p>
                <ul className="mt-1.5 space-y-1">
                  {g.items.map((t) => (
                    <li key={t} className="flex gap-2 break-keep text-[0.96rem] leading-snug text-slate-600 sm:text-[1.0rem]">
                      <span aria-hidden className="mt-0.5 shrink-0 text-slate-300">·</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="break-keep text-[0.95rem] leading-relaxed text-slate-400 sm:col-span-2">
              모든 기업에 모든 항목을 적용하는 것이 아닙니다. 현재 회사의 단계와 목적에 맞게 필요한 것만 선택해 연결합니다.
            </p>
          </div>
        </details>
      </div>
    </section>
  )
}

/* ── HOME 09 — GROWTH ─────────────────────────────────────────────────────── */

const GROWTH_FLOW = ['AX', 'DATA', 'EVIDENCE', 'IP · VENTURE · R&D', 'POLICY · SUPPORT · INVESTMENT', 'SCALE'] as const

export function AxGrowthFinalSection({ onConsult }: { onConsult?: () => void }) {
  return (
    <section id="growth" className="scroll-mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-3xl break-keep text-center text-[1.87rem] font-black leading-[1.35] tracking-[-0.015em] text-white sm:text-[2.4rem]">
          만들어 놓고 끝낼 이유가 없습니다.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.2rem] leading-[1.8] text-slate-300 sm:text-[1.3rem]">
          실제 시스템이 생기고, 데이터가 쌓이고, 사용 결과가 남으면 —{' '}
          그 자체가 회사의 기술성과 사업성을 설명하는 근거가 됩니다.
        </p>
        <ol className="mx-auto mt-9 flex max-w-4xl flex-wrap items-center justify-center gap-y-2.5 sm:mt-12">
          {GROWTH_FLOW.map((t, i) => (
            <li key={t} className="flex items-center">
              {i > 0 && <span aria-hidden className="mx-2 text-[1.05rem] font-black text-slate-600">→</span>}
              <span className={`break-keep rounded-xl border px-3.5 py-2 text-[1.02rem] font-black sm:text-[1.1rem] ${
                i >= 4 ? 'border-amber-400/40 bg-amber-400/[0.08] text-amber-200' : 'border-white/12 bg-white/[0.05] text-slate-200'
              }`}>{t}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/business-services/funding-consulting"
            className="flex min-h-[54px] w-full max-w-sm items-center justify-center gap-2 break-keep rounded-xl bg-teal-400 px-6 text-center text-[1.2rem] font-black text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-teal-300 sm:w-auto sm:text-[1.24rem]"
          >
            정책자금 × AX 프로그램 보기 <span aria-hidden>→</span>
          </Link>
          {onConsult && (
            <button
              type="button"
              onClick={onConsult}
              className="flex min-h-[54px] w-full max-w-sm items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[1.2rem] font-bold text-white transition-colors hover:bg-white/10 sm:w-auto sm:text-[1.24rem]"
            >
              상담 신청
            </button>
          )}
        </div>
        <p className="mx-auto mt-6 max-w-2xl break-keep text-center text-[0.98rem] leading-relaxed text-slate-500 sm:text-[1.05rem]">
          정책자금·보증·지원사업·투자의 결과는 각 기관과 투자자의 독립적인 판단으로 결정됩니다.{' '}
          <Link to="/business-services/funding-consulting#policy-2026" className="font-bold text-slate-400 underline underline-offset-2 hover:text-slate-300">
            2026 공식 정책근거 보기
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ── CTA 직전 — 의심·망설임 제거: FAQ 3개 + 결제 부담 ─────────────────────── */

const FAQ3 = [
  {
    q: '우리 회사에도 맞을까요?',
    a: '업종보다 먼저, 현재 회사가 어떻게 일하고 고객과 돈이 어디에서 움직이는지를 봅니다. 완성된 템플릿을 회사 이름만 바꿔 공급하는 방식이 아닙니다.',
  },
  {
    q: '결국 예쁜 데모 하나 만드는 것 아닌가요?',
    a: 'MVP부터 시작할 수도 있고, 프로젝트에 따라 실제 DB·사용자 권한·고객 플랫폼·현장업무·정산·재고·백업·QA까지 운영 수준으로 고도화합니다. 실제 개발 프로젝트의 상세 범위는 위에서 직접 펼쳐볼 수 있습니다.',
  },
  {
    q: '정책자금이 안 되면 무엇이 남나요?',
    a: '정책자금 승인 자체를 상품으로 팔지 않습니다. 프로젝트가 끝났을 때 시스템·데이터·고객접점·기술자산·실증기반이 회사에 남는 것을 기준으로 설계합니다.',
  },
] as const

export function AxFaqTrioSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-18">
        <h2 className="break-keep text-center text-[1.6rem] font-black leading-snug tracking-[-0.015em] text-slate-900 sm:text-[2.0rem]">
          아직 망설여지는 세 가지
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ3.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-slate-200 bg-slate-50">
              <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 text-[1.14rem] font-black text-slate-900 transition-colors hover:bg-slate-100/70 sm:text-[1.22rem] [&::-webkit-details-marker]:hidden">
                <span className="break-keep">{f.q}</span>
                <span aria-hidden className="shrink-0 text-slate-300 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="break-keep border-t border-slate-200/70 px-5 py-4 text-[1.08rem] leading-[1.75] text-slate-600 sm:text-[1.16rem]">{f.a}</p>
            </details>
          ))}
        </div>

        {/* 초기 부담 — 실제 상품 조건(AX_BUILD_PAYMENT)을 그대로 인용한다 */}
        <div className="mt-10 rounded-3xl border border-teal-200 bg-teal-50/50 p-6 text-center sm:p-8">
          <p className="break-keep text-[1.35rem] font-black leading-snug text-slate-900 sm:text-[1.55rem]">
            부담은 작게 시작하고,<br className="sm:hidden" /> 결과물은 직접 확인하세요.
          </p>
          <div className="mx-auto mt-4 max-w-xl space-y-2">
            {AX_BUILD_PAYMENT.lines.map((t) => (
              <p key={t} className="break-keep text-[1.08rem] leading-[1.7] text-slate-700 sm:text-[1.16rem]">{t}</p>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-xl break-keep text-[0.98rem] leading-relaxed text-slate-500 sm:text-[1.02rem]">
            {AX_BUILD_PAYMENT.notes[0]} {AX_BUILD_PAYMENT.notes[1]} 세부 조건은 기업 상황과 선택 프로그램에 따라 상담 후 확정됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}
