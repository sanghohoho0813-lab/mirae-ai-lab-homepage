// SECTION #process — "2주 안에 사업계획이 실행구조로". 이미지 중심 4단계.
// 각 단계: 제목 1줄 + 설명 1줄 + 대표 이미지 1장. 14일 범위 고지 포함.
import { SectionHead } from './axFrames'

const STEPS = [
  { no: '1', title: '기업과 자금 분석', desc: '왜 자금이 필요하고 어떤 기관을 검토할지 정합니다.', img: '/ax-showcase/b2b-order/photo-60-b2b-problem.webp', alt: '기업·자금 상황을 분석하는 예시 화면' },
  { no: '2', title: 'AX 적용업무 선정', desc: '반복되는 업무 중 가장 먼저 바꿀 한 가지를 고릅니다.', img: '/ax-showcase/design-direction/photo-68-design-direction.webp', alt: 'AX로 바꿀 업무를 선정하는 예시 화면' },
  { no: '3', title: '업무 흐름과 화면설계', desc: '직원과 관리자가 어떤 순서·화면으로 일할지 만듭니다.', img: '/ax-showcase-v2/photo-089-siteflow-showcase.webp', alt: '업무 흐름과 화면을 설계한 예시 화면' },
  { no: '4', title: '자금 설명자료 완성', desc: '자금 사용계획·사업계획·AX 화면을 하나의 논리로 연결합니다.', img: '/ax-showcase/b2b-order/photo-67-b2b-scope.webp', alt: '자금 설명자료를 정리한 예시 화면' },
]

export default function AxProcessSection({ onResult }: { onResult?: () => void }) {
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          eyebrow="2주 실행과정"
          title={<>2주 안에 사업계획이 <span className="text-blue-600">실행구조</span>로 바뀝니다.</>}
          desc="필요자료가 준비되면, 자금전략부터 업무 흐름과 화면 초안까지 눈으로 확인합니다."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.no} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-xl bg-slate-900 sm:h-[170px]">
                <img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.82rem] font-black text-amber-300">{s.no}</span>
                <p className="text-[1rem] font-black tracking-tight text-slate-900">{s.title}</p>
              </div>
              <p className="mt-1.5 break-keep text-[0.9rem] leading-snug text-slate-500">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute -right-3 top-[85px] z-10 hidden text-xl font-black text-amber-400 lg:block">›</span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 break-keep rounded-xl bg-slate-900 px-5 py-3.5 text-[0.9rem] font-bold leading-relaxed text-white">
          이후 자금이 조달되면 선택한 구현단계에 따라 작동형 시스템으로 개발합니다. <span className="text-amber-300">2주</span>는 1단계 AX 실행설계와 화면 초안 제공기간이며, 정책기관 심사기간·본개발 일정과 고객 자료제출 지연 기간은 포함하지 않습니다.
        </p>

        {onResult && (
          <div className="mt-5 flex justify-center">
            <button type="button" onClick={onResult} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 text-[0.92rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
              2주 동안 받는 결과물 보기 <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
