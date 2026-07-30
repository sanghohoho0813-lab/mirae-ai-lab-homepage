// A·B·C 프로그램 비교 — 가격표는 홈 1곳, 프로그램 상세 1곳에서만 사용한다.
// B(300만원)를 가장 강조한다. 허위 할인·가짜 정가·카운트다운은 사용하지 않는다.
import { Link } from 'react-router-dom'
import { AX_PACKAGES, AX_PACKAGE_NOTES } from '../../data/axPackages'

export default function AxPackageComparison({ onConsult }: { onConsult?: (code: string) => void }) {
  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-3">
        {AX_PACKAGES.map((p) => (
          <article
            key={p.code}
            className={`relative flex flex-col rounded-3xl border p-5 sm:p-6 ${
              p.recommended
                ? 'border-amber-400/50 bg-gradient-to-b from-amber-400/[0.12] to-white/[0.03] shadow-xl shadow-amber-500/10 lg:-mt-2 lg:mb-2'
                : 'border-white/12 bg-white/[0.04]'
            }`}
          >
            {p.recommended && p.badges && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {p.badges.map((b, i) => (
                  <span
                    key={b}
                    className={`break-keep rounded-full px-2.5 py-1 text-[1.1rem] sm:text-[1.0rem] font-black ${
                      i === 0 ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-amber-200 ring-1 ring-inset ring-amber-400/30'
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[1.1rem] sm:text-[1.0rem] font-black tracking-widest text-teal-300">{p.key}</p>
            <h3 className="mt-1 break-keep text-[1.65rem] font-black leading-tight text-white sm:text-[1.5rem]">{p.name}</h3>

            <p className="mt-3 flex items-baseline gap-2">
              <span className={`text-[2.2rem] font-black leading-none sm:text-[2.3rem] ${p.recommended ? 'text-amber-300' : 'text-white'}`}>{p.price}</span>
              <span className="text-[1.1rem] sm:text-[1.0rem] font-semibold text-slate-400">{p.priceNote}</span>
            </p>

            <p className="mt-3 break-keep text-[1.2rem] sm:text-[1.09rem] font-bold leading-relaxed text-slate-200">{p.oneLiner}</p>

            <ul className="mt-4 flex-1 space-y-1.5">
              {p.included.map((it) => (
                <li key={it} className="flex gap-2 break-keep text-[1.13rem] sm:text-[1.03rem] leading-snug text-slate-300">
                  <span aria-hidden className={`mt-[0.3rem] h-1.5 w-1.5 shrink-0 rounded-full ${p.recommended ? 'bg-amber-400' : 'bg-teal-400'}`} />
                  {it}
                </li>
              ))}
            </ul>

            <p className="mt-4 break-keep rounded-xl bg-white/5 px-3 py-2.5 text-[1.1rem] sm:text-[1.0rem] leading-snug text-slate-300 ring-1 ring-inset ring-white/10">
              <span className="font-black text-white">이런 기업에 맞습니다</span><br />
              {p.fit}
            </p>

            {/* 버튼 두 개 — ① 간단 상담 신청 ② 자가진단과 상담을 한 번에 */}
            <div className="mt-5 flex flex-col gap-2.5">
              {onConsult ? (
                <button
                  type="button"
                  onClick={() => onConsult(p.code)}
                  className={`min-h-[54px] w-full rounded-xl px-4 text-[1.24rem] sm:text-[1.13rem] font-black transition-transform hover:-translate-y-0.5 ${
                    p.recommended ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/15'
                  }`}
                >
                  상담 신청하기
                </button>
              ) : (
                <Link
                  to="/business-services/funding-consulting#ax-packages"
                  className={`flex min-h-[54px] w-full items-center justify-center rounded-xl px-4 text-[1.24rem] sm:text-[1.13rem] font-black transition-transform hover:-translate-y-0.5 ${
                    p.recommended ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' : 'bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/15'
                  }`}
                >
                  상담 신청하기
                </Link>
              )}
              <Link
                to={`/business-diagnosis?program=${p.code}`}
                className="flex min-h-[54px] w-full items-center justify-center break-keep rounded-xl border border-teal-400/40 bg-teal-400/10 px-4 text-center text-[1.17rem] sm:text-[1.06rem] font-bold leading-snug text-teal-200 transition-colors hover:bg-teal-400/20"
              >
                더 정확한 결과를 위해<br className="sm:hidden" /> 자가진단 + 상담 한 번에
              </Link>
            </div>
          </article>
        ))}
      </div>

      <ul className="mt-4 space-y-1">
        {AX_PACKAGE_NOTES.map((n) => (
          <li key={n} className="flex gap-2 break-keep text-[1.1rem] sm:text-[1.0rem] leading-relaxed text-slate-500">
            <span aria-hidden>·</span>
            {n}
          </li>
        ))}
      </ul>
    </div>
  )
}
