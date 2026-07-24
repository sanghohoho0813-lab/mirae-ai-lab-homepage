// SECTION #process — 자금조달 전후 진행방식 5단계. 큰 개발비 선지급이 아니라 컨설팅 100만 → 자금조달 후 본개발 정산.
import { useState } from 'react'
import { SectionHead } from './axFrames'

const STEPS = [
  { no: '1', title: '컨설팅 신청', body: '100만원으로 기업분석과 자금·AX 진단을 시작합니다.' },
  { no: '2', title: '1단계 AX 실행설계', body: '신청기관, 사업구조, 업무 흐름과 필요한 구현 수준을 결정하고 주요 화면 초안을 만듭니다.' },
  { no: '3', title: '심사 설명자료 준비', body: '업무 흐름도, 화면 초안과 필요한 범위의 시연자료를 만들어 사업을 구체적으로 설명합니다.' },
  { no: '4', title: '정책자금 신청과 대응', body: '신청서, 사업계획 구조, 보완자료와 기관 질의 대응을 진행합니다.' },
  { no: '5', title: '자금조달 후 본개발', body: '조달된 자금과 기업의 실제 필요에 맞춰 2·3·4단계 중 필요한 수준을 구축합니다.' },
]

export default function AxProcessSection() {
  const [open, setOpen] = useState(false)
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
        <SectionHead
          eyebrow="진행 방식"
          title="처음부터 큰 개발비를 지급하는 방식이 아닙니다."
          desc="컨설팅비 100만원으로 자금전략과 AX 실행설계를 먼저 준비하고, 본개발비는 자금조달 후 선택한 구현 수준에 따라 정산합니다."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <div key={s.no} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span aria-hidden className={`grid h-8 w-8 place-items-center rounded-lg text-[0.9rem] font-black text-white ${i === STEPS.length - 1 ? 'bg-teal-500' : 'bg-slate-900'}`}>{s.no}</span>
              <p className="mt-2.5 text-[0.98rem] font-black leading-tight text-slate-900">{s.title}</p>
              <p className="mt-1.5 text-[0.86rem] leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-[0.86rem] leading-relaxed text-slate-600 ring-1 ring-slate-200">
          자금조달 결과와 지원금액은 기업조건과 기관 심사에 따라 달라지며 보장되지 않습니다. 4단계를 목표로 설계하더라도, 자금조달 전에는 심사 설명에 필요한 업무 흐름과 화면 초안을 먼저 준비합니다.
        </p>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
            <span className="text-[0.9rem] font-black text-slate-800">자금조달 전에 먼저 구축할 수도 있나요?</span>
            <span aria-hidden className={`shrink-0 text-blue-600 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open && (
            <p className="border-t border-slate-100 px-4 py-3 text-[0.86rem] leading-relaxed text-slate-600">
              기업이 별도 개발예산을 보유하고 있거나 실제 서비스 운영이 시급한 경우, 자금조달 전에도 2·3·4단계 개발을 먼저 진행할 수 있습니다. 이 경우 선택한 구현단계의 개발계약과 단계별 대금조건을 별도로 체결합니다.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
