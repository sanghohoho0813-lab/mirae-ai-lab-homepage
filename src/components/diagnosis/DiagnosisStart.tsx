// 진단 시작 화면 — 설문지가 아니라 '퀘스트 시작' 느낌 (토스풍 간결 모션).
import { STAGE_INFO } from '../../data/businessDiagnosisQuestions'

type Props = {
  hasSaved: boolean
  onStart: () => void
  onResume: () => void
}

const QUEST_CARDS = [
  { stage: 1 as const, desc: '약 1분 · 여기까지만 해도 결과를 받아요', badge: '먼저 여기부터' },
  { stage: 2 as const, desc: '원하면 이어서 · 받을 수 있는 자금·지원제도' },
  { stage: 3 as const, desc: '원하면 이어서 · 인증과 홈페이지·업무시스템' },
]

export default function DiagnosisStart({ hasSaved, onStart, onResume }: Props) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-57px)] max-w-[720px] flex-col justify-center px-5 py-10 sm:py-14">
      <p className="animate-rise-in text-sm font-black uppercase tracking-widest text-blue-600">3분 기업 성장진단</p>
      <h1 className="animate-rise-in mt-3 text-[1.6rem] font-black leading-[1.3] tracking-tight text-slate-900 [animation-delay:60ms] sm:text-[2.2rem]">
        우리 회사는 지금,<br />무엇부터 준비해야 할까요?
      </h1>
      <p className="animate-rise-in mt-4 max-w-lg text-base leading-relaxed text-slate-600 [animation-delay:120ms] sm:text-lg">
        몇 가지 질문에 답하면 자금·지원금·기업인증·홈페이지·AI 시스템까지 대표님 회사의 성장 우선순위를 정리해드립니다.
      </p>

      {/* 3개의 퀘스트 카드 */}
      <div className="mt-8 space-y-3">
        {QUEST_CARDS.map((c, i) => (
          <div
            key={c.stage}
            className={`animate-rise-in flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
              c.stage === 1 ? 'border-blue-500 ring-1 ring-blue-200' : 'border-slate-200'
            }`}
            style={{ animationDelay: `${140 + i * 70}ms` }}
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-black ${c.stage === 1 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}>
              {c.stage}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-base font-extrabold text-slate-900">{STAGE_INFO[c.stage].name}</p>
                {'badge' in c && c.badge && <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-black text-white">{c.badge}</span>}
              </div>
              <p className="mt-0.5 text-sm leading-snug text-slate-500">{c.desc}</p>
            </div>
            <span aria-hidden className="ml-auto text-slate-300">›</span>
          </div>
        ))}
      </div>

      {/* 안내 정보 */}
      <ul className="animate-rise-in mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.85rem] font-medium text-slate-500 [animation-delay:380ms]">
        <li>1단계 기초진단 약 1분</li>
        <li>각 단계가 끝날 때마다 결과 확인</li>
        <li>로그인 없이 시작</li>
        <li>언제든 이어서 진행 가능</li>
      </ul>

      {/* CTA */}
      <div className="animate-rise-in mt-8 flex flex-col gap-2.5 [animation-delay:440ms]">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-[56px] items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-7 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          1단계 무료진단 시작하기
          <span aria-hidden>→</span>
        </button>
        {hasSaved && (
          <button
            type="button"
            onClick={onResume}
            className="flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            이어서 진단하기
          </button>
        )}
      </div>
    </div>
  )
}
