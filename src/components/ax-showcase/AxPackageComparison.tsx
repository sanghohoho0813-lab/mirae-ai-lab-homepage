// A·B·C 프로그램 비교 — 가격표는 홈 1곳, 프로그램 상세 1곳에서만 사용한다.
// B(300만원)를 가장 강조한다. 허위 할인·가짜 정가·카운트다운은 사용하지 않는다.
import { Link } from 'react-router-dom'
import { AX_PACKAGES, AX_PACKAGE_NOTES } from '../../data/axPackages'

export default function AxPackageComparison({ onConsult }: { onConsult?: (code: string) => void }) {
  return (
    <div>
      {/* 세 카드의 A/B/C·상품명·금액 위치가 같은 선상에 놓이도록,
          추천 리본은 카드 흐름 밖(absolute)에 두고 상품명 영역 높이를 고정한다. */}
      <div className="grid gap-3 pt-4 lg:grid-cols-3">
        {AX_PACKAGES.map((p) => (
          <article
            key={p.code}
            className={`relative flex flex-col rounded-3xl border p-5 sm:p-6 ${
              p.recommended
                ? 'border-amber-400/50 bg-gradient-to-b from-amber-400/[0.12] to-white/[0.03] shadow-xl shadow-amber-500/10'
                : 'border-white/12 bg-white/[0.04]'
            }`}
          >
            {p.recommended && p.badges && (
              <span className="absolute -top-4 left-5 inline-flex h-8 items-center rounded-full bg-amber-400 px-3.5 text-[1.1rem] font-black text-slate-900 shadow-lg shadow-amber-500/20 sm:text-[1.3rem]">
                {p.badges[0]}
              </span>
            )}

            <p className="text-[1.1rem] font-black tracking-widest text-teal-300 sm:text-[1.3rem]">{p.key}</p>
            <h3 className="mt-1 flex min-h-[2.4em] items-start break-keep text-[1.65rem] font-black leading-tight text-white sm:text-[1.95rem]">
              {p.name}
            </h3>

            <p className="flex items-baseline gap-2">
              <span className={`text-[2.2rem] font-black leading-none sm:text-[2.99rem] ${p.recommended ? 'text-amber-300' : 'text-white'}`}>{p.price}</span>
              <span className="text-[1.1rem] font-semibold text-slate-400 sm:text-[1.3rem]">{p.priceNote}</span>
            </p>

            {/* 추천 카드의 보조 배지는 금액 아래에 둔다 — 위쪽에 두면 금액 줄이 밀린다 */}
            <span className="mt-3 flex min-h-[2.2rem] items-center sm:min-h-[2.6rem]">
              {p.recommended && p.badges?.[1] && (
                <span className="break-keep rounded-full bg-white/10 px-2.5 py-1 text-[1.1rem] font-black text-amber-200 ring-1 ring-inset ring-amber-400/30 sm:text-[1.3rem]">
                  {p.badges[1]}
                </span>
              )}
            </span>

            <p className="mt-2 break-keep text-[1.2rem] font-bold leading-relaxed text-slate-200 sm:text-[1.417rem]">{p.oneLiner}</p>

            <ul className="mt-4 flex-1 space-y-1.5">
              {p.included.map((it) => (
                <li key={it} className="flex gap-2 break-keep text-[1.13rem] sm:text-[1.339rem] leading-snug text-slate-300">
                  <span aria-hidden className={`mt-[0.3rem] h-1.5 w-1.5 shrink-0 rounded-full ${p.recommended ? 'bg-amber-400' : 'bg-teal-400'}`} />
                  {it}
                </li>
              ))}
            </ul>

            <p className="mt-4 break-keep rounded-xl bg-white/5 px-3 py-2.5 text-[1.1rem] sm:text-[1.3rem] leading-snug text-slate-300 ring-1 ring-inset ring-white/10">
              <span className="font-black text-white">이런 기업에 맞습니다</span><br />
              {p.fit}
            </p>

            {/* 버튼 두 개 — ① 간단 상담 신청 ② 자가진단과 상담을 한 번에 */}
            <div className="mt-5 flex flex-col gap-2.5">
              {onConsult ? (
                <button
                  type="button"
                  onClick={() => onConsult(p.code)}
                  className={`min-h-[54px] w-full rounded-xl px-4 text-[1.24rem] sm:text-[1.469rem] font-black transition-transform hover:-translate-y-0.5 ${
                    p.recommended ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/15'
                  }`}
                >
                  상담 신청하기
                </button>
              ) : (
                <Link
                  to="/business-services/funding-consulting#ax-packages"
                  className={`flex min-h-[54px] w-full items-center justify-center rounded-xl px-4 text-[1.24rem] sm:text-[1.469rem] font-black transition-transform hover:-translate-y-0.5 ${
                    p.recommended ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/15'
                  }`}
                >
                  상담 신청하기
                </Link>
              )}
              <Link
                to={`/business-diagnosis?program=${p.code}`}
                className="flex min-h-[54px] w-full items-center justify-center break-keep rounded-xl border border-teal-400/40 bg-teal-400/10 px-4 text-center text-[1.17rem] sm:text-[1.378rem] font-bold leading-snug text-teal-200 transition-colors hover:bg-teal-400/20"
              >
                더 정확한 결과를 위해<br className="sm:hidden" /> 자가진단 + 상담 한 번에
              </Link>
            </div>
          </article>
        ))}
      </div>

      <ul className="mt-4 space-y-1">
        {AX_PACKAGE_NOTES.map((n) => (
          <li key={n} className="flex gap-2 break-keep text-[1.1rem] sm:text-[1.3rem] leading-relaxed text-slate-500">
            <span aria-hidden>·</span>
            {n}
          </li>
        ))}
      </ul>
    </div>
  )
}
