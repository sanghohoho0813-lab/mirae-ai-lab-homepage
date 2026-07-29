// "여기서 끝나지 않습니다" — 업무효율화에서 멈추지 않고 새 매출구조로 넘어가는 전환 구간.
// 업종별 5번째 이미지 바로 뒤에 붙는다.
import { AX_V2_EXPANSION_FLOW } from '../../data/axIndustryShowcaseV2'

export default function AxBusinessExpansion({ industryName }: { industryName: string }) {
  return (
    <div className="rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.09] to-transparent p-4 sm:p-6">
      <p className="break-keep text-[1.44rem] font-black leading-tight text-white sm:text-[1.6rem]">여기서 끝나지 않습니다.</p>
      <p className="mt-2.5 max-w-3xl break-keep text-[1.09rem] leading-relaxed text-slate-300 sm:text-[1.21rem]">
        현재 업무를 편하게 만드는 수준을 넘어, <span className="font-bold text-white">{industryName}</span>이 가진 고객·거래·운영 데이터를 활용해
        새로운 앱·웹 서비스와 <span className="font-black text-amber-300">반복매출 구조</span>로 확장할 수 있습니다.
      </p>

      <ol className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-stretch">
        {AX_V2_EXPANSION_FLOW.map((step, i) => (
          <li key={step} className="flex items-center gap-2 sm:flex-1 sm:min-w-[9.5rem]">
            <div className="flex w-full items-center gap-2 rounded-xl border border-white/12 bg-slate-950/40 px-3 py-2.5">
              <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[1.0rem] font-black ${i === AX_V2_EXPANSION_FLOW.length - 1 ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-teal-200'}`}>
                {i + 1}
              </span>
              <span className="break-keep text-[1.0rem] font-bold leading-tight text-slate-200">{step}</span>
            </div>
            <span aria-hidden className="hidden shrink-0 text-slate-600 sm:inline">{i < AX_V2_EXPANSION_FLOW.length - 1 ? '→' : ''}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
