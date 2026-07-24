// SECTION #process — "계획서가 실제 AX 시스템으로 바뀌는 과정". 텍스트가 아니라 기존 AX 이미지 흐름 중심.
// 각 단계: 제목 1줄 + 설명 1줄 + 대표 이미지 1장. 모바일 세로(이미지 크게) / PC 4열.
import { SectionHead } from './axFrames'

const STEPS = [
  { no: '1', title: '현재 업무 분석', desc: '흩어진 업무와 반복 작업을 찾습니다.', img: '/ax-showcase/b2b-order/photo-60-b2b-problem.webp', alt: '현재 업무의 문제를 정리한 분석 화면 예시' },
  { no: '2', title: 'AX 실행설계', desc: '사용자, 데이터와 화면 구조를 설계합니다.', img: '/ax-showcase/design-direction/photo-68-design-direction.webp', alt: '화면 구조와 디자인 방향 설계 예시' },
  { no: '3', title: '심사용 프로토타입', desc: '심사에서 설명할 화면과 시연자료를 만듭니다.', img: '/ax-showcase-v2/photo-089-siteflow-showcase.webp', alt: '심사에서 시연하는 통합 화면 예시' },
  { no: '4', title: '작동형 업무 MVP', desc: '자금조달 이후 실제 업무에 사용하는 시스템으로 구현합니다.', img: '/ax-showcase/wms/photo-37-wms-live-dashboard.webp', alt: '실제 업무에 사용하는 관리자 대시보드 예시' },
]

export default function AxProcessSection({ onDetail }: { onDetail?: () => void }) {
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          eyebrow="진행 과정"
          title="계획서가 실제 AX 시스템으로 바뀌는 과정"
          desc="흩어진 업무를 분석해 심사에서 보여줄 화면, 그리고 실제로 쓰는 시스템까지 만듭니다."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.no} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {/* 대표 이미지 — 텍스트보다 크게 */}
              <div className="flex h-[150px] items-center justify-center overflow-hidden rounded-xl bg-slate-900 sm:h-[170px]">
                <img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.82rem] font-black text-amber-300">{s.no}</span>
                <p className="text-[1.02rem] font-black tracking-tight text-slate-900">{s.title}</p>
              </div>
              <p className="mt-1.5 break-keep text-[0.9rem] leading-snug text-slate-500">{s.desc}</p>
              {/* 골드 연결 화살표(마지막 제외) */}
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute -right-3 top-[85px] z-10 hidden text-xl font-black text-amber-400 lg:block">›</span>
              )}
            </div>
          ))}
        </div>

        {onDetail && (
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={onDetail} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 text-[0.92rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
              전체 진행방식 자세히 보기 <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
