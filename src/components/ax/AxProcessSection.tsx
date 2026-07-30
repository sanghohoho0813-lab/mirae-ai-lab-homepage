// SECTION #process — 최대 2주 진행과정 타임라인.
// 오래 끄는 컨설팅이 아니라는 점을 날짜로 보여준다. 5구간 세로 타임라인 + 짧은 현실 고지.
import { SectionHead } from './axFrames'

const TIMELINE = [
  { day: 'Day 0~1', title: '인터뷰와 자료 확인', desc: '현재 업무와 자금 상황을 듣고 필요한 자료를 정리합니다.' },
  { day: 'Day 1~2', title: '방향안내와 디자인 초안', desc: '어떤 자금을 어떤 논리로 준비할지, 화면은 어떤 방향일지 먼저 보여드립니다.' },
  { day: 'Day 3~5', title: 'MVP 초안 제작', desc: '실제 업무 기준으로 최소 기능 버전(바로 보여줄 수 있는 첫 버전)을 만듭니다.' },
  { day: 'Day 6~10', title: '소통과 보완', desc: '대표님 피드백을 반영해 화면과 사업 논리를 함께 다듬습니다.' },
  { day: 'Day 10~14', title: '최종 결과물 완성 목표', desc: '자금전략, 사업계획과 AX 프로그램을 하나의 결과물로 정리합니다.' },
]

export default function AxProcessSection({ onResult }: { onResult?: () => void }) {
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          eyebrow="최대 2주 진행과정"
          title={<>오래 끌지 않습니다. <span className="text-blue-600">빠르게 보여드리고</span> 함께 완성합니다.</>}
          desc="인터뷰와 동시에 설계를 시작합니다. 기다리는 시간이 아니라, 확인하는 시간이 됩니다."
        />

        <ol className="mt-8 space-y-0">
          {TIMELINE.map((t, i) => (
            <li key={t.day} className="relative flex gap-4 pb-6 last:pb-0">
              {i < TIMELINE.length - 1 && (
                <span aria-hidden className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-slate-300" />
              )}
              <span className="relative z-10 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.88rem] sm:text-[1.04rem] font-black text-amber-300">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.902rem] sm:text-[1.066rem] font-black uppercase tracking-wider text-blue-600">{t.day}</p>
                <p className="mt-0.5 break-keep text-[1.155rem] sm:text-[1.365rem] font-black leading-snug tracking-tight text-slate-900">{t.title}</p>
                <p className="mt-1 break-keep text-[1.045rem] sm:text-[1.235rem] leading-relaxed text-slate-600">{t.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 break-keep rounded-xl bg-white px-4 py-3 text-[0.88rem] sm:text-[1.04rem] leading-relaxed text-slate-500 ring-1 ring-inset ring-slate-200">
          자료 접수와 의사결정이 원활한 경우의 목표 일정입니다. 외부 시스템 연동과 복잡한 데이터 이전은 별도 일정으로 진행하며, 정책기관 심사기간은 포함하지 않습니다. 최종 범위는 선택한 단계에 따라 달라집니다.
        </p>

        {onResult && (
          <div className="mt-5 flex justify-center">
            <button type="button" onClick={onResult} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 text-[1.012rem] sm:text-[1.196rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
              이 과정에서 받는 결과물 보기 <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
