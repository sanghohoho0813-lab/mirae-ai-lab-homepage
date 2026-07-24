// 비용·방식 비교 (일반 외주개발 vs 미래AI랩 AX결합형) — #programs 섹션 내부.
// B(AX 결합 성장자금형) 조건은 corePrograms.ts MAIN_PROGRAMS 단일 소스에서 파생(금액 임의 변경 금지). 검증되지 않은 시장평균 금액 미기재.
import { getMainProgram } from '../../data/corePrograms'

const OUTSOURCE = [
  '착수 전에 개발비 예산 필요',
  '요구사항 정의에 상당한 시간 소요',
  '자금조달과 개발업체가 별도로 움직임',
  '개발 후 실제 사용 여부가 불확실할 수 있음',
  '수정·추가기능은 별도 비용 가능',
]
const MIRAE = [
  '기업진단과 자금전략을 먼저 설계',
  '실제 업무문제를 기준으로 화면 구성',
  '정책자금 준비와 AX 구축을 하나의 흐름으로 진행',
  '기본 착수비와 성과보수 구조를 사전에 안내',
  '구축 결과물을 심사 이후 실제 운영에도 활용',
]

export default function AxCostCompare() {
  const b = getMainProgram('B')
  const capMan = b.feeCap != null ? Math.round(b.feeCap / 10_000).toLocaleString('ko-KR') : null
  const conditions: { k: string; v: string }[] = [
    { k: '초기 참여기업', v: b.badge },
    { k: '기본 착수비', v: `${b.startFee.toLocaleString('ko-KR')}원${b.priceTop ? ` (${b.priceTop})` : ''}` },
    { k: '성과보수율', v: `조달액의 ${Math.round(b.feeRate * 100)}%` },
    { k: '성과보수 상한', v: capMan ? `최대 ${capMan}만원` : '별도 상한 없음' },
    { k: '적용 조건', v: '조달 목표 1억원 이상 성장기업 권장' },
    { k: '별도 개발 범위', v: '결제·ERP·택배·회계 연동 등은 별도 협의' },
  ]

  return (
    <div id="cost-compare" className="mt-6 scroll-mt-16">
      <h3 className="max-w-3xl text-[1.15rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[1.3rem]">
        일반 개발은 개발비를 먼저 지출하지만, <span className="text-teal-600">미래AI랩은 자금조달과 실제 업무화면 구축을 함께</span> 설계합니다.
      </h3>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {/* 일반 외주개발 */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <p className="text-[0.82rem] font-black text-slate-500">일반적인 외주 개발</p>
          <ul className="mt-3 space-y-1.5">
            {OUTSOURCE.map((it) => (
              <li key={it} className="flex items-start gap-2 text-[0.92rem] leading-snug text-slate-500"><span aria-hidden className="mt-0.5 text-slate-300">○</span>{it}</li>
            ))}
          </ul>
        </div>
        {/* 미래AI랩 AX결합형 */}
        <div className="rounded-2xl border-2 border-teal-500 bg-teal-50/40 p-5">
          <p className="text-[0.82rem] font-black text-teal-700">미래AI랩 AX 결합형</p>
          <ul className="mt-3 space-y-1.5">
            {MIRAE.map((it) => (
              <li key={it} className="flex items-start gap-2 text-[0.92rem] font-semibold leading-snug text-slate-700"><span aria-hidden className="mt-0.5 text-teal-500">✓</span>{it}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 rounded-xl bg-slate-900 px-5 py-3.5 text-[0.95rem] font-bold leading-snug text-white">
        정책자금을 받기 위한 일회성 시연화면이 아니라, 자금조달 이후에도 기업 내부에서 사용할 수 있는 <span className="text-teal-300">업무도구</span>를 목표로 합니다.
      </p>

      {/* 프로그램 B(AX 결합 성장자금형) 현재 조건 */}
      <div className="mt-4 rounded-2xl border border-teal-200 bg-white p-4 sm:p-5">
        <p className="text-[0.78rem] font-black uppercase tracking-widest text-teal-600">B. AX 결합 성장자금형 · 현재 조건</p>
        <dl className="mt-3 grid gap-x-5 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c2) => (
            <div key={c2.k} className="flex flex-col">
              <dt className="text-[0.76rem] font-black text-slate-400">{c2.k}</dt>
              <dd className="text-[0.92rem] font-bold text-slate-800">{c2.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
