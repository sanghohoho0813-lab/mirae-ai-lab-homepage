// SECTION #process — 진행 방식 요약(축약형). 5단계, 짧은 문구, 정돈된 카드.
import { SectionHead } from './axFrames'

const STEPS = [
  { no: '1', title: '업종·자금 적합성 검토', desc: '업종과 자금 상황을 보고 진행 가능 여부를 먼저 확인합니다.' },
  { no: '2', title: 'AX 화면·흐름 설계', desc: '핵심 업무 흐름을 정리하고 실제 화면 구성안을 잡습니다.' },
  { no: '3', title: '시연형 프로토타입 제작', desc: '클릭하며 흐름을 보여줄 수 있는 데모 화면을 만듭니다.' },
  { no: '4', title: '핵심 기능 MVP 구현', desc: '로그인·데이터 저장 등 핵심 기능을 실제로 동작하게 만듭니다.' },
  { no: '5', title: '자금 신청·설명자료 연동', desc: '기관 심사에 쓰일 설명자료와 신청 준비를 함께 정리합니다.' },
]

export default function AxProcessSection() {
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          eyebrow="진행 방식"
          title="한 흐름으로, 필요한 만큼만 진행합니다."
          desc="큰 개발비를 먼저 지급하지 않고 단계별로 확인하며 나아갑니다."
        />

        <ol className="mt-7 space-y-3">
          {STEPS.map((s) => (
            <li key={s.no} className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.95rem] font-black text-teal-300">
                {s.no}
              </span>
              <div className="min-w-0">
                <p className="text-[1.02rem] font-black tracking-tight text-slate-900">{s.title}</p>
                <p className="mt-1 break-keep text-[0.9rem] leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 break-keep rounded-xl bg-slate-900 px-5 py-3.5 text-[0.9rem] font-bold leading-relaxed text-white">
          자금이 실행되지 않으면 선택하지 않은 본개발비는 발생하지 않습니다. 자금조달 결과와 금액은 기관 심사에 따라 달라집니다.
        </p>
      </div>
    </section>
  )
}
