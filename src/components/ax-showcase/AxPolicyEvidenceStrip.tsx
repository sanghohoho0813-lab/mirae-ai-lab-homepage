// 2026 공식 정책근거 4개 — 짧은 증거 바. 홈에서 공문을 길게 펼치지 않는다.
// "자세히 보기"는 정책자금 상세페이지의 공식근거 영역으로 보낸다.
import { Link } from 'react-router-dom'
import { AX_EVIDENCE_DISCLAIMER, AX_POLICY_EVIDENCE_2026 } from '../../data/policyAxEvidence2026'

export default function AxPolicyEvidenceStrip({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark'
  return (
    <div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {AX_POLICY_EVIDENCE_2026.map((e) => (
          <li
            key={e.id}
            className={`rounded-2xl border p-4 ${dark ? 'border-white/12 bg-white/[0.05]' : 'border-slate-200 bg-white'}`}
          >
            <p className={`text-[1.2rem] sm:text-[1.417rem] font-black leading-snug ${dark ? 'text-teal-200' : 'text-blue-700'}`}>{e.title}</p>
            <p className={`mt-1.5 break-keep text-[1.24rem] sm:text-[1.469rem] leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              {e.shortDescription}
            </p>
            <p className={`mt-2 break-keep text-[1.11rem] sm:text-[1.313rem] leading-snug ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              {e.sourceName} · {e.officialDate}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link
          to="/business-services/funding-consulting#policy-2026"
          className={`inline-flex min-h-[46px] items-center gap-1.5 rounded-xl px-4 text-[1.24rem] sm:text-[1.469rem] font-bold transition-colors ${
            dark
              ? 'border border-teal-400/30 bg-teal-400/10 text-teal-200 hover:bg-teal-400/20'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          2026 공식 근거 자세히 보기 <span aria-hidden>→</span>
        </Link>
      </div>

      <p className={`mt-2.5 break-keep text-[1.13rem] sm:text-[1.339rem] leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
        {AX_EVIDENCE_DISCLAIMER}
      </p>
    </div>
  )
}
