// SECTION 7 — 미래AI랩 차별점 (기존 S11 + 대표자 신뢰 병합)
// 3열 비교(일반 컨설팅 / 일반 외주 / 미래AI랩) + 대표자 신뢰 스트립. 과장·가상 성과 수치 금지.
import { AX_DIFF_COLS } from '../../data/axShowcase'
import { SectionHead } from './axFrames'

const AWARDS = [
  { year: '2024', title: 'ESG 골든리더스 브랜드대상', detail: '경영컨설팅 부문 1위' },
  { year: '2025', title: '대한민국 사회공헌 K-컬처 나눔봉사공헌대상', detail: '벤처부문' },
]

export default function AxDifference() {
  return (
    <section id="difference" className="scroll-mt-16 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-7">
        <SectionHead
          center
          eyebrow="Difference"
          title="자금 신청만 돕지 않습니다"
          desc="기업이 평가받을 근거와 실제 성장할 운영구조를 함께 만듭니다."
        />

        {/* 3열 비교 */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {AX_DIFF_COLS.map((c) => (
            <div key={c.key} className={`flex flex-col rounded-3xl border p-6 ${c.highlight ? 'border-2 border-blue-500 bg-white shadow-lg shadow-blue-500/10' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`text-[1.078rem] sm:text-[0.98rem] font-black ${c.highlight ? 'text-blue-600' : 'text-slate-500'}`}>{c.label}</p>
              <p className={`mt-0.5 text-[0.88rem] sm:text-[0.8rem] font-semibold ${c.highlight ? 'text-slate-500' : 'text-slate-400'}`}>{c.sub}</p>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((it) => (
                  <li key={it} className={`flex items-start gap-2.5 text-[1.012rem] sm:text-[0.92rem] leading-snug ${c.highlight ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                    {c.highlight
                      ? <span aria-hidden className="mt-0.5 font-black text-blue-500">✓</span>
                      : <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />}
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 대표자 신뢰 스트립 */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필 사진" loading="lazy" decoding="async" width={200} height={200} className="h-14 w-14 shrink-0 rounded-full object-cover shadow ring-2 ring-slate-200 sm:h-16 sm:w-16" />
            <div className="min-w-0 flex-1">
              <p className="text-[1.122rem] sm:text-[1.02rem] font-black text-slate-900">미래 AI 랩 대표 · Business AX & AI Growth</p>
              <p className="mt-1 text-[0.99rem] sm:text-[0.9rem] leading-relaxed text-slate-600">세무·노무·법무·자금 분야 합산 9년 현장 경험. 정책자금·정부지원금·법인컨설팅 전문, ISO 9001·14001·45001 심사원.</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {AWARDS.map((a) => (
                  <span key={a.title} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.902rem] sm:text-[0.82rem] font-semibold text-slate-600">
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.902rem] sm:text-[0.82rem] font-black text-amber-300">{a.year}</span>
                    {a.title}<span className="text-slate-400"> · {a.detail}</span>
                  </span>
                ))}
                <a href="https://youtube.com/channel/UCjXWwM0_25vl1Mpr2Pc5amQ?si=vBv8_7d3w8Uk5uGA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.902rem] sm:text-[0.82rem] font-bold text-slate-700 hover:text-slate-900" aria-label="유튜브 김팀장의 경영노트 채널 (새 탭에서 열림)">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><rect x="1.5" y="5" width="21" height="14" rx="3.5" fill="#FF0000" /><path d="M10 9.2v5.6l5-2.8-5-2.8z" fill="#fff" /></svg>
                  유튜브 ‘김팀장의 경영노트’ <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
