// SECTION 8 — 최종 상담 CTA. 이미지 반복 대신 업종 아이콘 칩. "무료상담" 표현 미사용.
import { Link } from 'react-router-dom'
import { AX_CTA_INDUSTRIES } from '../../data/axShowcase'

export default function AxFinalCta({ onConsult }: { onConsult: () => void }) {
  return (
    <section id="cta" className="scroll-mt-16 border-t border-slate-200 bg-slate-950">
      <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6 sm:py-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.8rem] font-black text-slate-200 ring-1 ring-inset ring-white/15">무료 진단 · 비회원 가능 · 3분</span>
        <h2 className="mt-4 text-2xl font-black leading-[1.25] tracking-tight text-white sm:text-[2.2rem]">
          우리 회사에 필요한 자금과<br />운영 시스템을 한 번에 점검해보세요
        </h2>
        <div className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-3.5 text-base font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
            <span aria-hidden>🩺</span> 3분 기업진단 시작
          </Link>
          <button type="button" onClick={onConsult} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
            AX 구축 적합성 확인
          </button>
        </div>
        {/* 업종 아이콘 (이미지 반복 대신) */}
        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {AX_CTA_INDUSTRIES.map((it) => (
            <span key={it.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[0.82rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/10">
              <span aria-hidden>{it.icon}</span> {it.label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[0.72rem] font-medium text-slate-500">제조·물류·예약·연구소·B2B·플랫폼 등 다양한 업종의 업무 시스템을 설계합니다.</p>
      </div>
    </section>
  )
}
