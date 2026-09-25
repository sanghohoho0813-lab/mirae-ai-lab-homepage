// SECTION #process — 최대 2주 진행과정 타임라인.
// 오래 끄는 컨설팅이 아니라는 점을 날짜로 보여준다. 5구간 세로 타임라인 + 짧은 현실 고지.
import { SectionHead } from './axFrames'

const TIMELINE = [
  { day: 'Day 0~1', title: '인터뷰와 자료 확인', desc: '지금 업무와 자금 상황을 듣고 자료를 정리해요.' },
  { day: 'Day 1~2', title: '방향과 디자인 초안', desc: '준비할 자금과 논리, 화면 방향을 먼저 보여 드립니다.' },
  { day: 'Day 3~5', title: 'MVP 초안 제작', desc: '실제 업무에 맞춰, 바로 보여 줄 수 있는 첫 버전(MVP)을 만들어요.' },
  { day: 'Day 6~10', title: '소통과 보완', desc: '피드백을 받아 화면과 사업 논리를 함께 다듬습니다.' },
  { day: 'Day 10~14', title: '최종 결과물 완성 목표', desc: '자금전략, 사업계획, AX 프로그램을 한 결과물로 묶어요.' },
]

export default function AxProcessSection({ onResult }: { onResult?: () => void }) {
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          eyebrow="최대 2주 진행과정"
          title={<>오래 끌지 않아요. <span className="text-blue-600">먼저 보여 드리고</span> 함께 완성합니다.</>}
          desc="기다리는 대신, 단계마다 직접 확인하게 돼요."
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
          자료 접수와 결정이 원활할 때의 목표 일정입니다. 외부 시스템 연동·복잡한 데이터 이전은 별도이고, 정책기관 심사기간은 포함하지 않습니다. 최종 범위는 선택한 단계에 따라 달라집니다.
        </p>

        {onResult && (
          <div className="mt-5 flex justify-center">
            <button type="button" onClick={onResult} className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-6 text-[1.012rem] sm:text-[1.196rem] font-black text-slate-700 transition-colors hover:bg-slate-50">
              받게 될 결과물 보기 <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
