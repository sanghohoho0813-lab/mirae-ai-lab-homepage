// 성과보수 계산기 — A·B 2택. 요율·상한·착수금은 corePrograms.ts MAIN_PROGRAMS 단일 소스에서 파생.
// A: 착수 50만 + 3%(상한 없음) / B: 착수 100만 + 5%(상한 1,500만원).
import { useMemo, useState } from 'react'
import { MAIN_PROGRAMS, type MainProgramKey } from '../../data/corePrograms'

function formatKrw(won: number): string {
  if (won <= 0) return '0원'
  const eok = Math.floor(won / 100_000_000)
  const man = Math.floor((won % 100_000_000) / 10_000)
  const parts: string[] = []
  if (eok > 0) parts.push(`${eok}억`)
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`)
  return `${parts.join(' ')}원`
}

export default function AxFeeCalculator() {
  const [key, setKey] = useState<MainProgramKey>('B')
  const [amount, setAmount] = useState(100_000_000)
  const [open, setOpen] = useState(false)
  const prog = MAIN_PROGRAMS.find((p) => p.key === key)!
  const { fee, capped } = useMemo(() => {
    const raw = Math.round(amount * prog.feeRate)
    const capped = prog.feeCap != null && raw > prog.feeCap
    return { fee: capped ? prog.feeCap! : raw, capped }
  }, [amount, prog])
  const presets = [50_000_000, 100_000_000, 200_000_000, 300_000_000]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[1rem] font-black text-slate-900">예상 성과보수 계산기</p>
        {/* A·B 세그먼트 */}
        <div role="tablist" aria-label="프로그램 선택" className="flex rounded-lg bg-slate-100 p-0.5">
          {MAIN_PROGRAMS.map((p) => (
            <button key={p.key} role="tab" aria-selected={key === p.key} onClick={() => { setKey(p.key); }}
              className={`rounded-md px-3 py-1.5 text-[0.82rem] font-black transition-colors ${key === p.key ? (p.key === 'B' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white') : 'text-slate-500'}`}>
              {p.key}. {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <label htmlFor="fee-amt" className="text-[0.85rem] font-bold text-slate-500">자금조달 목표금액</label>
        <p className="text-[1.5rem] font-black tracking-tight text-slate-900">{formatKrw(amount)}</p>
      </div>
      <input id="fee-amt" type="range" min={0} max={300_000_000} step={10_000_000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={`mt-2 w-full ${key === 'B' ? 'accent-slate-900' : 'accent-blue-600'}`} aria-valuetext={formatKrw(amount)} />
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setAmount(p)} className={`rounded-full px-3 py-1.5 text-[0.82rem] font-black transition-colors ${amount === p ? (key === 'B' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white') : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{formatKrw(p)}</button>
        ))}
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-[0.78rem] font-black text-slate-400">착수금</p>
          <p className="mt-1 text-[1.1rem] font-black text-slate-900">{formatKrw(prog.startFee)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-[0.78rem] font-black text-slate-400">예상 성과보수 ({Math.round(prog.feeRate * 100)}%)</p>
          <p className="mt-1 text-[1.1rem] font-black text-slate-900">{formatKrw(fee)}</p>
          {capped ? <p className="text-[0.72rem] font-semibold text-amber-600">상한 {formatKrw(prog.feeCap!)} 적용</p> : prog.feeCap == null ? <p className="text-[0.72rem] font-semibold text-slate-400">별도 상한 없음</p> : null}
        </div>
        <div className={`rounded-xl border-2 px-4 py-3 ${key === 'B' ? 'border-slate-900 bg-slate-50' : 'border-blue-600 bg-blue-50/60'}`}>
          <p className={`text-[0.78rem] font-black ${key === 'B' ? 'text-slate-700' : 'text-blue-600'}`}>예상 총 비용</p>
          <p className={`mt-1 text-[1.1rem] font-black ${key === 'B' ? 'text-slate-900' : 'text-blue-700'}`}>{formatKrw(prog.startFee + fee)}</p>
        </div>
      </div>
      <p className="mt-2.5 text-[0.82rem] font-semibold text-slate-500">결과물 · <b className={key === 'B' ? 'text-slate-900' : 'text-blue-700'}>{prog.levelLabel}</b> ({prog.key === 'B' ? '실제 작동형 AX MVP' : '클릭형 실행근거 프로토타입'})</p>

      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="mt-3 inline-flex items-center gap-1 text-[0.85rem] font-bold text-slate-500 hover:text-slate-800">
        계산 기준·유의사항 보기 <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <p className={`${open ? 'mt-2' : 'hidden'} text-[0.78rem] leading-relaxed text-slate-400`}>
        계산 결과는 예상 금액이며 실제 계약조건과 조달 결과에 따라 달라질 수 있습니다. 성과보수는 <b className="font-bold text-slate-500">실제 조달이 완료된 금액</b>을 기준으로 산정하며, 추가 진행을 선택한 경우에만 발생합니다. 실제 승인 여부·조달금액은 기관 심사에 따라 달라지며, AX 구축이 자금 승인을 보장하지 않습니다. 세부 산정 기준과 지급 시점은 개별 계약서에서 확정됩니다.
      </p>
    </div>
  )
}
