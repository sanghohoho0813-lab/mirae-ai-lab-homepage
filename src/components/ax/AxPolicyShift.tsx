// SECTION #why-ax — "2026 정책자금 × AX" 정책변화 밴드. AX SHOWCASE 바로 다음, 메인 위계.
// 기본 접힘으로 숨기지 않는다: 제목 + 공식 수치 4종이 모바일 첫 화면에도 바로 보인다. 세부·전체출처만 아코디언.
// ⚠️ 승인·가점 자동적용 단정 금지. 공식 숫자·출처는 policyShift2026.ts 단일 소스.
import { useState } from 'react'
import { POLICY_SHIFT as S } from '../../data/policyShift2026'

const LEVEL_LINES = [
  '2단계는 클릭 가능한 실행 화면을 보여줍니다.',
  '3단계는 실제 데이터를 저장하며 핵심 업무를 시험합니다.',
  '4단계는 직원 사용과 관리자 운영까지 연결해 가장 풍부한 실행근거를 제공합니다.',
]

export default function AxPolicyShift() {
  const [open, setOpen] = useState(false)
  return (
    <section id="why-ax" className="scroll-mt-16 border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-300">2026 POLICY FUNDING × AX</p>
        <h2 className="mt-2.5 max-w-4xl text-[1.7rem] font-black leading-[1.22] tracking-tight text-white sm:text-[2.1rem]">
          2026년, 정책자금의 방향이 <span className="text-teal-300">AI·AX 활용기업</span>으로 이동하고 있습니다.
        </h2>
        <p className="mt-3 max-w-3xl text-[1.02rem] leading-relaxed text-slate-300">
          사업계획서만 작성하는 데서 멈추지 않고, 기존 사업에 AI를 어떻게 적용하고 실제 업무를 어떻게 바꿀 것인지 설명할 준비가 필요합니다.
        </p>

        {/* 공식 수치 4종 — 항상 노출(모바일 2열) */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {S.facts.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[1.35rem] font-black leading-none tracking-tight text-teal-300 sm:text-[1.5rem]">{f.value}</p>
              <p className="mt-2 text-[0.9rem] font-black leading-snug text-white">{f.title}</p>
              <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[0.78rem] leading-relaxed text-slate-500">출처: 중소벤처기업부 2026년 중소기업 정책자금 공급계획</p>

        {/* 강조 문구 */}
        <div className="mt-6 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-inset ring-white/10 sm:p-6">
          <p className="text-[1.05rem] font-black leading-relaxed text-white sm:text-[1.12rem]">
            AI로 누구나 계획서를 만들 수 있는 시대, 기업의 차이는 <span className="text-teal-300">실행할 구조와 준비도</span>에서 납니다.
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-300">미래AI랩은 사업계획을 실제 업무 흐름과 확인 가능한 화면으로 바꿉니다.</p>
        </div>

        {/* 세부 설명 + 전체 출처 아코디언 (여기만 접힘) */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 bg-white/[0.03] px-4 py-3.5 text-left">
            <span className="text-[0.92rem] font-black text-white">구현 수준별 실행근거와 전체 고지 보기</span>
            <span aria-hidden className={`shrink-0 text-teal-300 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open && (
            <div className="border-t border-white/10 p-4">
              <ul className="space-y-1.5">
                {LEVEL_LINES.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-[0.9rem] leading-snug text-slate-200"><span aria-hidden className="mt-0.5 text-teal-300">✓</span>{l}</li>
                ))}
              </ul>
              <p className="mt-3 rounded-xl bg-white/[0.03] px-4 py-3 text-[0.82rem] leading-relaxed text-slate-400">
                {S.sourceNote} 모든 정책자금에 AX 가점이 자동 적용되는 것은 아니며, AX 화면이나 MVP가 자금승인을 보장하지 않습니다. 구현 수준은 설명력과 운영 준비도를 보완하기 위한 기준이며 승인결과를 보장하지 않습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
