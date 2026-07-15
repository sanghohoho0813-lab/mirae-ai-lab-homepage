// 결제 UX 공용 프레젠테이션 컴포넌트 (순수 UI — 결제 로직·API·금액 계산과 무관).
// Checkout / PaymentComplete / MyPage 결제내역에서 재사용해 "AI 경영 컨설팅 플랫폼" 톤을 통일한다.
// 토스·카카오페이·Stripe 느낌: 밝은 배경, 네이비 핵심, 청록 포인트, 과한 애니메이션 없음.
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

// ── 서비스 진행 5단계 (결제→계약→진행→완료 서사) ──
export const SERVICE_STEPS = [
  { key: 'paid', label: '결제 완료', desc: '카드 결제가 확인되면 계약이 시작돼요.' },
  { key: 'assigned', label: '담당 컨설턴트 배정', desc: '영업일 기준 담당자가 배정되어 연락드려요.' },
  { key: 'materials', label: '필요 자료 요청', desc: '진행에 필요한 자료를 안내·요청드려요.' },
  { key: 'consulting', label: '컨설팅 진행', desc: '담당 컨설턴트가 1:1로 실무를 진행해요.' },
  { key: 'done', label: '완료', desc: '결과물 전달과 사후 안내로 마무리해요.' },
] as const

/** 세로 타임라인 — currentStep(0-base) 까지 완료 표시. compact 는 설명 숨김. */
export function ServiceTimeline({ currentStep = -1, compact = false }: { currentStep?: number; compact?: boolean }) {
  return (
    <ol className="relative space-y-0">
      {SERVICE_STEPS.map((s, i) => {
        const done = i < currentStep
        const active = i === currentStep
        const last = i === SERVICE_STEPS.length - 1
        return (
          <li key={s.key} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!last && (
              <span aria-hidden className={`absolute left-[11px] top-6 h-[calc(100%-1rem)] w-0.5 ${done ? 'bg-blue-500' : 'bg-slate-200'}`} />
            )}
            <span
              aria-hidden
              className={`relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black ${
                done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200'
              }`}
            >
              {done ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 5 5 9-11" /></svg>
              ) : (
                i + 1
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={`text-[0.95rem] font-bold leading-snug ${done || active ? 'text-slate-900' : 'text-slate-500'}`}>
                {s.label}
                {active && <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-600 align-middle">현재</span>}
              </p>
              {!compact && <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{s.desc}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ── 구매 혜택 카드 ──
const BENEFITS = [
  { icon: '🤖', title: 'AI 컨설팅 지원', desc: 'AI 분석으로 준비 방향을 빠르게 정리' },
  { icon: '📊', title: '진행 현황 확인', desc: '마이페이지에서 단계별 진행 상태 확인' },
  { icon: '🧑‍💼', title: '담당자 1:1 배정', desc: '전담 컨설턴트가 처음부터 끝까지' },
  { icon: '📄', title: '전자계약 제공', desc: '안전한 전자계약으로 진행 (예정)' },
  { icon: '🧾', title: '결제내역·영수증', desc: '결제내역과 영수증을 언제든 조회' },
]
export function BenefitCards() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {BENEFITS.map((b) => (
        <div key={b.title} className="rounded-xl border border-slate-200 bg-white p-3.5">
          <span aria-hidden className="text-xl">{b.icon}</span>
          <p className="mt-1.5 text-[0.85rem] font-black leading-tight text-slate-900">{b.title}</p>
          <p className="mt-0.5 text-[0.72rem] leading-snug text-slate-400">{b.desc}</p>
        </div>
      ))}
    </div>
  )
}

// ── 환불 안내 아코디언 ──
export function RefundAccordion({ summary, href = '/refund-policy' }: { summary?: string; href?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-[0.95rem] font-bold text-slate-800">취소·환불 안내</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
          <p>{summary ?? '서비스 착수 전에는 전액 환불이 가능하며, 착수 이후에는 진행 정도에 따라 환불 금액이 달라질 수 있습니다.'}</p>
          <Link to={href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-bold text-blue-600 underline underline-offset-2 hover:text-blue-700">
            전체 환불·취소 정책 보기 →
          </Link>
        </div>
      )}
    </div>
  )
}

// ── 결제 중 단계별 오버레이 (단순 spinner 금지) ──
const PAY_STEPS = ['주문 생성 중', '결제 준비 중', 'PortOne 연결 중', '결제창 여는 중'] as const
/** phase: 'preparing' → 1~2단계 / 'window' → 3~4단계. 순수 시각 표현(로직 무관). */
export function PaymentProgressOverlay({ phase }: { phase: 'preparing' | 'window' }) {
  const base = phase === 'preparing' ? 0 : 2
  const [sub, setSub] = useState(0)
  useEffect(() => {
    setSub(0)
    const t = setTimeout(() => setSub(1), 600) // 각 phase 안에서 한 단계 자연스럽게 진행
    return () => clearTimeout(t)
  }, [phase])
  const active = Math.min(base + sub, PAY_STEPS.length - 1)
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/40 backdrop-blur-[2px] p-5" role="status" aria-live="polite">
      <div className="w-full max-w-[340px] rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50">
          <span aria-hidden className="h-6 w-6 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
        </div>
        <p className="mt-4 text-center text-base font-black text-slate-900">안전하게 결제를 준비하고 있어요</p>
        <div className="mt-1 flex justify-center gap-1.5" aria-hidden>
          {PAY_STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= active ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {PAY_STEPS.map((label, i) => {
            const done = i < active
            const now = i === active
            return (
              <li key={label} className="flex items-center gap-2.5">
                <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black ${done ? 'bg-blue-600 text-white' : now ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                  {done ? '✓' : i + 1}
                </span>
                <span className={`text-sm font-semibold ${done ? 'text-slate-400 line-through' : now ? 'text-slate-900' : 'text-slate-400'}`}>{label}…</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-center text-xs text-slate-400">이 화면을 닫아도 결제는 취소되지 않아요.</p>
      </div>
    </div>
  )
}

// ── 주문 상태 뱃지 ──
const STATUS_BADGE: Record<string, { label: string; tone: string }> = {
  pending: { label: '결제 대기', tone: 'bg-slate-100 text-slate-600' },
  payment_requested: { label: '결제 확인 중', tone: 'bg-blue-50 text-blue-700' },
  paid: { label: '결제 완료', tone: 'bg-emerald-100 text-emerald-800' },
  partial_cancelled: { label: '부분취소', tone: 'bg-amber-100 text-amber-800' },
  cancelled: { label: '취소됨', tone: 'bg-slate-200 text-slate-600' },
  failed: { label: '결제 실패', tone: 'bg-red-100 text-red-700' },
  amount_mismatch: { label: '확인 필요', tone: 'bg-orange-100 text-orange-800' },
  verification_failed: { label: '확인 필요', tone: 'bg-orange-100 text-orange-800' },
  exception: { label: '확인 필요', tone: 'bg-orange-100 text-orange-800' },
}
export function orderStatusBadge(status: string): { label: string; tone: string } {
  return STATUS_BADGE[status] ?? { label: status, tone: 'bg-slate-100 text-slate-600' }
}
export function StatusBadge({ status }: { status: string }) {
  const s = orderStatusBadge(status)
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-black ${s.tone}`}>{s.label}</span>
}

// ── 결제내역 Empty 상태 (일러스트 + CTA) ──
export function EmptyOrders({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center ${className}`}>
      <div aria-hidden className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blue-50 to-sky-100">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 6h18l-1.5 9.5a2 2 0 0 1-2 1.7H8a2 2 0 0 1-2-1.7L4.2 4.5A1 1 0 0 0 3.2 3.7H1.5" />
          <circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" />
        </svg>
      </div>
      <p className="mt-4 text-base font-black text-slate-900">아직 결제한 서비스가 없습니다.</p>
      <p className="mt-1 text-sm text-slate-500">필요한 경영지원 서비스를 둘러보고 시작해보세요.</p>
      <Link to="/business-services" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">
        서비스 둘러보기 →
      </Link>
    </div>
  )
}

/** 라벨-값 행 (카드 내부용) */
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <dt className="shrink-0 text-sm font-semibold text-slate-400">{label}</dt>
      <dd className="min-w-0 break-all text-right text-sm font-bold text-slate-800">{children}</dd>
    </div>
  )
}
