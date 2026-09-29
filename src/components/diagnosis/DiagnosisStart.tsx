// 3분 AX Fit 시작 화면 — 설문지가 아니라 '판단 시작' 느낌 (토스풍 간결 모션).
// 결과로 나오는 상품 세 가지(MVP · 플랫폼형 · 풀 패키지)를 미리 보여주어, 무엇을 판단하는 진단인지 먼저 알린다.
import { AX_FIT_INFO, QUESTION_COUNT } from '../../data/businessDiagnosisQuestions'
import { PACKAGE_META, PACKAGE_ORDER } from '../../lib/businessDiagnosisEngine'

type Props = {
  hasSaved: boolean
  onStart: () => void
  onResume: () => void
}

const PACKAGE_CARDS = PACKAGE_ORDER.map((g) => ({ key: g, ...PACKAGE_META[g] }))

export default function DiagnosisStart({ hasSaved, onStart, onResume }: Props) {
  // 폰에서는 위에서부터 읽히게(가운데 정렬은 위쪽이 비어 보인다), PC 는 세로 가운데
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-57px)] max-w-[720px] flex-col justify-start px-5 py-8 sm:justify-center sm:py-14">
      <p className="animate-rise-in text-sm font-black uppercase tracking-widest text-[#B37744]">{AX_FIT_INFO.name}</p>
      <h1 className="animate-rise-in mt-3 text-[1.6rem] font-black leading-[1.3] tracking-tight text-slate-900 [animation-delay:60ms] sm:text-[2.2rem]">
        우리 회사는<br className="sm:hidden" /> 어디서부터 시작하면 될까요?
      </h1>
      <p className="animate-rise-in mt-4 max-w-lg break-keep text-base leading-relaxed text-slate-600 [animation-delay:120ms] sm:text-lg">
        지금 상황과 일하는 방식을 보고,<br className="sm:hidden" />{' '}
        <b className="font-bold text-slate-900">세 가지 중 어디서 시작하면 될지</b> 알려 드려요.
      </p>

      {/* 결과로 나오는 상품 세 가지 — 폰에서도 한 줄 세 칸(설명 생략)이라 시작 버튼이 첫 화면 안에 들어온다 */}
      <ol className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
        {PACKAGE_CARDS.map((c, i) => (
          <li
            key={c.key}
            className="animate-rise-in flex flex-col rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:rounded-2xl sm:p-5"
            style={{ animationDelay: `${140 + i * 70}ms` }}
          >
            <span className="text-[0.72rem] font-black tracking-[0.12em] text-[#B37744] sm:text-[0.78rem]">STEP {i + 1}</span>
            <span className="mt-1 break-keep text-[1.02rem] font-black leading-tight text-slate-900 sm:text-[1.2rem]">{c.label}</span>
            <span className="mt-0.5 break-keep text-[0.8rem] font-semibold leading-snug text-slate-500 sm:text-[0.9rem]">{c.short}</span>
            <span className="mt-auto pt-2 text-[0.8rem] font-black tabular-nums text-[#9A5F2F] sm:text-[0.92rem]">{c.price}</span>
          </li>
        ))}
      </ol>

      {/* CTA */}
      <div className="animate-rise-in mt-8 flex flex-col gap-2.5 [animation-delay:440ms]">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-[56px] items-center justify-center gap-1.5 rounded-2xl bg-[#171B20] px-7 py-4 text-lg font-black text-white shadow-lg shadow-[#171B20]/15 transition-all hover:-translate-y-0.5 hover:bg-[#0B0E12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99257]"
        >
          3분 AX Fit 시작하기
          <span aria-hidden>→</span>
        </button>
        <p className="text-center text-[0.85rem] font-medium text-slate-500">질문 {QUESTION_COUNT}개 이내 · 약 3분 · 로그인 없이 시작</p>
        {hasSaved && (
          <button
            type="button"
            onClick={onResume}
            className="flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99257]"
          >
            이어서 진단하기
          </button>
        )}
      </div>
    </div>
  )
}
