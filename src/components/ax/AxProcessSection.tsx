// SECTION #process — 진행 방식 4단계 (진단 → 실행설계 → 실행근거 제작 → 자금 실행·적용).
// 한 줄 요약만 기본 노출, 세부 진행 내용은 펼쳐보기(아코디언)로만 노출.
import { useState } from 'react'
import { SectionHead } from './axFrames'

const STEPS = [
  {
    no: '1',
    title: '3분 기업진단',
    summary: '업종, 매출, 재무상태, 자금 목적과 반복 업무를 확인합니다.',
    detail: '진단 결과에 따라 자금조달 실행형(A) 또는 AX 결합 성장자금형(B) 중 우리 회사에 맞는 방식을 안내합니다.',
  },
  {
    no: '2',
    title: '자금·AX 실행설계',
    summary: '신청 가능한 자금과 함께 설명해야 할 사업 구조와 AX 범위를 정합니다.',
    detail: '기업·재무현황 진단, 기관·자금 종류 선정, 신청전략과 함께 어떤 업무 흐름을 AX 화면으로 만들지 범위를 확정합니다.',
  },
  {
    no: '3',
    title: '실행근거 제작',
    summary: 'A형은 클릭형 AX 프로토타입, B형은 실제 업무용 작동형 MVP를 제작합니다.',
    detail: '업무 흐름도·화면설계를 바탕으로 A형은 핵심 화면 3~5개의 클릭형 프로토타입을, B형은 로그인·DB·관리자 화면을 포함한 작동형 MVP를 만듭니다.',
  },
  {
    no: '4',
    title: '자금 실행과 업무 적용',
    summary: '신청, 보완과 기관 대응을 진행하고 구축 결과물을 실제 업무에 적용합니다.',
    detail: '신청서류 제출·보완 요청 대응과 함께, 구축한 화면을 자금기관 설명자료로 활용하고 프로젝트 이후 실제 업무에 적용합니다.',
  },
]

export default function AxProcessSection() {
  const [open, setOpen] = useState(false)
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-11">
        <SectionHead
          eyebrow="진행 방식"
          title="진단부터 자금 실행과 AX 구축까지 한 흐름으로 진행합니다."
          desc="복잡한 절차 대신 4단계로 단순하게 진행합니다."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.no} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span aria-hidden className={`grid h-8 w-8 place-items-center rounded-lg text-[0.9rem] font-black text-white ${i === STEPS.length - 1 ? 'bg-teal-500' : 'bg-slate-900'}`}>{s.no}</span>
                <p className="text-[1.02rem] font-black leading-tight text-slate-900">{s.title}</p>
              </div>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-slate-600">{s.summary}</p>
              {open && <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-[0.84rem] leading-relaxed text-slate-500">{s.detail}</p>}
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-[0.85rem] font-bold text-slate-600 transition-colors hover:bg-slate-100">
          {open ? '세부 진행 내용 접기' : '각 단계 세부 진행 내용 보기'}
          <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </button>
      </div>
    </section>
  )
}
