// SECTION #process — 진행방식 5단계 타임라인. 무료 사전검토 → 100만 컨설팅 → 14영업일 실행설계 → 신청·대응 → 자금조달 후 본개발.
import { useState } from 'react'
import { SectionHead } from './axFrames'

const STEPS = [
  { no: '1', title: '무료 사전 적합성 검토', paid: false, items: ['3분 기업진단', '사업 실체 확인', '자금 제한요건 확인', 'AX 적용 가능성', '대표자 실행의지'], result: '유료 프로그램 진행 가능 여부' },
  { no: '2', title: '100만원 컨설팅 시작', paid: true, items: ['기업·재무 분석', '기관과 자금방향', 'AX 적용업무 선정', '대표자 인터뷰'], result: '자금전략과 AX 실행설계 착수' },
  { no: '3', title: '14영업일 실행설계', paid: true, items: ['현재·개선 업무 흐름', '기능 목록·사용자 구분', '화면 초안 3~5개', '특허 아이디어 구조', '구현단계 추천'], result: '1단계 AX 실행설계 보고서' },
  { no: '4', title: '신청자료와 기관대응', paid: true, items: ['주력 자금 1개 선정', '사업계획 핵심논리·자금 사용계획', '기술·사업성 설명자료', '예상질문·보완자료·기관 질의 대응'], result: '기본범위: 주력 기관·자금 1회, 부결사유 검토 1회, 전략 재점검 1회, 핵심자료 수정 1회 (다른 기관 신규 신청·전면 재작성은 별도 협의)' },
  { no: '5', title: '자금조달 후 본개발', paid: true, items: ['2단계 500만원 / 3단계 1,000만원 / 4단계 1,500만원', '단계별 범위확인서', '단계별 고객 검수', '배포와 인계'], result: '선택한 구현 수준의 작동형 결과물' },
]

export default function AxProcessSection() {
  const [sel, setSel] = useState('2')
  const step = STEPS.find((s) => s.no === sel) ?? STEPS[0]
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8">
        <SectionHead
          eyebrow="진행 방식"
          title="처음부터 큰 개발비를 지급하지 않습니다."
          desc="100만원으로 자금전략과 화면 초안을 먼저 확인하고, 자금조달 이후 필요한 구현수준을 선택합니다."
        />

        {/* 타임라인 선택 */}
        <div role="tablist" aria-label="진행 단계" className="mt-6 grid grid-cols-5 gap-1.5">
          {STEPS.map((s) => {
            const on = s.no === sel
            return (
              <button key={s.no} type="button" role="tab" aria-selected={on} onClick={() => setSel(s.no)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 text-center transition ${on ? 'border-blue-500 bg-white shadow-sm' : 'border-transparent bg-white/60 hover:bg-white'}`}>
                <span className={`grid h-7 w-7 place-items-center rounded-full text-[0.82rem] font-black text-white ${on ? 'bg-blue-600' : 'bg-slate-300'}`}>{s.no}</span>
                <span className={`text-[0.66rem] font-bold leading-tight sm:text-[0.76rem] ${on ? 'text-slate-900' : 'text-slate-400'}`}>{s.title}</span>
              </button>
            )
          })}
        </div>

        {/* 선택 단계 상세 */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-[0.9rem] font-black text-white">{step.no}</span>
            <h3 className="text-[1.2rem] font-black tracking-tight text-slate-900">{step.title}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-black ${step.paid ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{step.paid ? '유료' : '무료'}</span>
          </div>
          <ul className="mt-3.5 grid gap-1.5 sm:grid-cols-2">
            {step.items.map((it) => <li key={it} className="flex items-start gap-2 text-[0.9rem] leading-snug text-slate-700"><span aria-hidden className="mt-0.5 shrink-0 font-black text-blue-500">✓</span>{it}</li>)}
          </ul>
          <p className="mt-3.5 flex flex-wrap items-baseline gap-2 rounded-xl bg-slate-50 px-4 py-3 text-[0.88rem] leading-snug">
            <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[0.72rem] font-black text-white">결과</span>
            <b className="text-slate-800">{step.result}</b>
          </p>
        </div>

        <p className="mt-4 rounded-xl bg-slate-900 px-5 py-4 text-[0.95rem] font-bold leading-relaxed text-white">
          자금이 실행되지 않으면 선택하지 않은 본개발비는 발생하지 않습니다. 자금조달 결과와 지원금액은 기관심사에 따라 달라지며 보장되지 않습니다.
        </p>
      </div>
    </section>
  )
}
