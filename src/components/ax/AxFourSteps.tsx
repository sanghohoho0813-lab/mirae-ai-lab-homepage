// SECTION #four-steps — AX 혁신전환 4단계. 홈·상세에서 같은 이름, 같은 순서로 사용한다.
// 단계별로 이미지 1장 + 문장 1~2개만. 설명을 늘리지 않고 흐름만 보여준다.
import { SectionHead } from './axFrames'

const STEPS = [
  {
    no: '1',
    title: '자금이 막힌 이유 확인',
    desc: '지금까지 왜 몇천만원에서 멈췄는지부터 확인합니다.',
    img: '/ax-showcase/b2b-order/photo-60-b2b-problem.webp',
    alt: '현재 업무와 자금 문제를 정리한 예시 화면',
  },
  {
    no: '2',
    title: '더 큰 자금이 필요한 이유 설계',
    desc: '회사가 어디로 확장하는지, 그래서 자금이 왜 필요한지 논리를 만듭니다.',
    img: '/ax-showcase/design-direction/photo-68-design-direction.webp',
    alt: '사업 확장 방향과 화면 방향을 설계하는 예시 화면',
  },
  {
    no: '3',
    title: '실제 AX 프로그램 제작',
    desc: '설명만 하지 않습니다. 실제로 보여줄 수 있는 화면을 만듭니다.',
    img: '/ax-showcase-v2/photo-089-siteflow-showcase.webp',
    alt: '업무 흐름을 화면으로 구현한 AX 프로그램 예시',
  },
  {
    no: '4',
    title: '정책자금 논리로 연결',
    desc: '사업계획서와 화면이 같은 방향을 말하도록 하나의 자료로 정리합니다.',
    img: '/ax-showcase/b2b-order/photo-67-b2b-scope.webp',
    alt: '사업계획과 실행구조를 하나로 묶은 구성 예시 화면',
  },
]

export default function AxFourSteps({ dark = false }: { dark?: boolean }) {
  return (
    <section id="four-steps" className={`scroll-mt-16 border-t ${dark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          dark={dark}
          eyebrow="AX 혁신전환 4단계"
          title={<>자금을 받을 이유가 보이는 회사는 <span className={dark ? 'text-teal-300' : 'text-blue-600'}>이렇게 만듭니다.</span></>}
        />

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.no} className={`flex flex-col rounded-2xl border p-2.5 sm:p-3 ${dark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className="flex h-[104px] items-center justify-center overflow-hidden rounded-xl bg-slate-900 sm:h-[160px]">
                <img src={s.img} alt={s.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div className="mt-2.5 flex items-start gap-1.5 sm:items-center sm:gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-[0.75rem] font-black text-amber-300 sm:h-7 sm:w-7 sm:text-[0.82rem]">{s.no}</span>
                <p className={`break-keep text-[0.92rem] font-black leading-tight tracking-tight sm:text-[1rem] ${dark ? 'text-white' : 'text-slate-900'}`}>{s.title}</p>
              </div>
              <p className={`mt-1.5 break-keep text-[0.85rem] leading-snug sm:text-[0.92rem] ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
