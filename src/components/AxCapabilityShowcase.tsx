// AX 프론트엔드 구현역량 쇼케이스 (BusinessServicesPage #ax-capability).
// "성공사례"가 아니라 "구현역량·화면 예시" — 실제 React UI 미리보기를 탭으로 전환해 보여준다.
// 가상 성과·고객수·업무개선율·앱스토어·다운로드 금지. 향후 image/video 로 교체 가능(데이터의 mediaType).
import { useRef, useState, type KeyboardEvent } from 'react'
import {
  AX_SHOWCASE_SCREENS,
  AX_PROOF_LABELS,
  AX_CAPABILITY_TAGS,
  AX_BUILD_STEPS,
  AX_EXPERIENCE_NOTE,
  type AxShowcaseScreen,
} from '../data/axCapabilityShowcase'

type Tone = 'ok' | 'warn' | 'risk' | 'info'
const TONE: Record<Tone, string> = {
  ok: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warn: 'bg-amber-50 text-amber-700 ring-amber-200',
  risk: 'bg-rose-50 text-rose-600 ring-rose-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
}
function Chip({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${TONE[tone]}`}>{children}</span>
}

// ── 프레임 ──────────────────────────────────────────────────────────
function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </span>
        <span className="ml-1 flex-1 truncate rounded-md bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-inset ring-slate-200">mirae-ax.app · 운영 대시보드</span>
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  )
}
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[240px] rounded-[1.8rem] border border-white/10 bg-slate-950 p-1.5 shadow-2xl ring-1 ring-black/20">
      <div className="overflow-hidden rounded-[1.4rem] bg-slate-100">
        <div className="flex items-center justify-center bg-slate-900 py-1">
          <span className="h-1 w-12 rounded-full bg-white/30" aria-hidden />
        </div>
        <div className="p-2.5">{children}</div>
      </div>
    </div>
  )
}
function DocumentFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
        <span className="text-[12px] font-black text-slate-700">대표자용 결과 요약</span>
        <span className="text-[11px] font-semibold text-slate-400">보고서 생성</span>
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  )
}

// ── 화면 1: 운영 대시보드 ──────────────────────────────────────────
function DashboardPreview() {
  const stats = [
    { v: '8건', l: '오늘 할 일', tone: 'info' as Tone },
    { v: '3건', l: '확인 필요', tone: 'risk' as Tone },
    { v: '12건', l: '진행 중', tone: 'info' as Tone },
    { v: '74%', l: '완료율', tone: 'ok' as Tone },
  ]
  const people = [
    { n: '김현장', p: 82, t: '진행 중' },
    { n: '이대리', p: 100, t: '완료' },
  ]
  const activity = [
    { t: '자료 보완 요청', tone: 'warn' as Tone, time: '10:24' },
    { t: '지연 1건 발생', tone: 'risk' as Tone, time: '어제' },
  ]
  return (
    <div className="text-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-black text-slate-900">이번 주 업무 현황</p>
        <span className="text-[11px] font-semibold text-slate-400">7월 3주차</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-1.5">
            <p className="text-[1.05rem] font-black leading-none text-slate-900">{s.v}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 p-2.5">
          <p className="text-[11px] font-black text-slate-500">담당자별 진행상태</p>
          <ul className="mt-1.5 space-y-1.5">
            {people.map((p) => (
              <li key={p.n} className="flex items-center gap-2">
                <span className="w-12 shrink-0 truncate text-[11px] font-bold text-slate-700">{p.n}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-teal-500" style={{ width: `${p.p}%` }} />
                </span>
                <Chip tone={p.t === '완료' ? 'ok' : p.t === '진행 중' ? 'info' : 'warn'}>{p.t}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-100 p-2.5">
          <p className="text-[11px] font-black text-slate-500">최근 활동 · 알림</p>
          <ul className="mt-1.5 space-y-1">
            {activity.map((a) => (
              <li key={a.t} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700"><Chip tone={a.tone}>●</Chip>{a.t}</span>
                <span className="shrink-0 text-[10px] font-medium text-slate-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ── 화면 2: 모바일 현장업무 ────────────────────────────────────────
function MobilePreview() {
  return (
    <div className="text-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-black text-slate-900">오늘 현장업무</p>
        <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[11px] font-bold text-teal-700">일정 5건</span>
      </div>
      <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-slate-800">○○상사 방문</span>
          <Chip tone="info">방문 예정</Chip>
        </div>
        <p className="mt-0.5 text-[11px] font-medium text-slate-400">오후 2:00 · 현장 점검</p>
      </div>
      <button type="button" tabIndex={-1} aria-hidden className="mt-2 w-full rounded-xl bg-teal-500 py-2 text-[12px] font-black text-white">업무 시작하기</button>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-600"><span aria-hidden>📷</span> 사진 첨부</div>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-600"><span>처리 수량</span><span className="rounded bg-slate-100 px-2 py-0.5 text-slate-800">24</span></div>
        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-400">특이사항 입력…</div>
      </div>
      <button type="button" tabIndex={-1} aria-hidden className="mt-2 w-full rounded-xl bg-slate-900 py-2 text-[12px] font-black text-white">처리 완료</button>
      <p className="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600"><span aria-hidden>✓</span> 관리자에게 전송됨</p>
    </div>
  )
}

// ── 화면 3: 자동 진단·보고서 ───────────────────────────────────────
function ReportPreview() {
  return (
    <div className="text-slate-800">
      <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3 text-white">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-[1.1rem] font-black text-teal-300">72</div>
        <div>
          <p className="text-[11px] font-semibold text-slate-300">현재 준비도</p>
          <div className="mt-1 flex gap-1">
            <Chip tone="ok">정상 5</Chip><Chip tone="warn">주의 2</Chip><Chip tone="risk">확인 필요 1</Chip>
          </div>
        </div>
      </div>
      <div className="mt-2.5 space-y-1">
        {[
          { t: '우선 확인 필요 · 세금 체납 여부', tone: 'risk' as Tone },
          { t: '보완 권장 · 사업계획 근거자료', tone: 'warn' as Tone },
          { t: '자금 검토 순서 · 보증기관 우선', tone: 'info' as Tone },
          { t: '자료 준비 현황 · 3/5 완료', tone: 'ok' as Tone },
        ].map((r) => (
          <div key={r.t} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5">
            <Chip tone={r.tone}>●</Chip>
            <span className="text-[12px] font-semibold text-slate-700">{r.t}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-lg border border-dashed border-slate-200 p-2.5">
        <p className="text-[11px] font-black text-slate-500">다음 실행과제</p>
        <p className="mt-1 text-[12px] font-semibold leading-snug text-slate-700">① 체납 확인 → ② 근거자료 보완 → ③ 보증기관 신청 준비</p>
      </div>
    </div>
  )
}

function ScreenMedia({ screen }: { screen: AxShowcaseScreen }) {
  // 향후 실제 미디어가 있으면 우선 렌더, 없으면 UI 미리보기(fallback)
  if (screen.mediaType === 'image' && screen.imageSrc) {
    return <img src={screen.imageSrc} alt={`${screen.title} 화면`} loading="lazy" className="w-full rounded-2xl border border-slate-200 shadow-2xl" />
  }
  if (screen.mediaType === 'video' && screen.videoSrc) {
    return (
      <video controls preload="none" poster={screen.posterSrc} className="w-full rounded-2xl border border-slate-200 shadow-2xl" aria-label={`${screen.title} 데모 영상`}>
        <source src={screen.videoSrc} />
      </video>
    )
  }
  if (screen.frame === 'phone') return <PhoneFrame><MobilePreview /></PhoneFrame>
  if (screen.frame === 'document') return <DocumentFrame><ReportPreview /></DocumentFrame>
  return <BrowserFrame><DashboardPreview /></BrowserFrame>
}

export default function AxCapabilityShowcase({ onConsult, onCompare }: { onConsult: () => void; onCompare: () => void }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const screen = AX_SHOWCASE_SCREENS[active]

  // 좌우 화살표로 탭 이동 (WAI-ARIA tabs)
  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (active + dir + AX_SHOWCASE_SCREENS.length) % AX_SHOWCASE_SCREENS.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="ax-capability" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-8 lg:py-5">
        <p className="text-sm font-black uppercase tracking-widest text-teal-300">AX System Design</p>
        <h2 className="mt-1.5 max-w-2xl text-2xl font-extrabold leading-[1.25] tracking-tight text-white sm:text-[2.1rem]">
          말로만 AX를 설명하지 않습니다.
        </h2>
        <p className="mt-2 lg:mt-1.5 max-w-2xl text-[1rem] leading-relaxed text-slate-300 sm:text-[1.05rem]">
          기업의 업무 흐름을 분석해 PC 대시보드부터 모바일 현장 입력, 자동 진단과 보고서까지 <b className="text-white">실제로 작동하는 화면</b>으로 구현합니다.
        </p>
        {/* §2 개발경험 — 제목 아래 보조 문장으로 병합 (별도 카드 없음) */}
        <p className="mt-1.5 lg:mt-1 max-w-2xl text-[0.9rem] leading-relaxed text-slate-400">{AX_EXPERIENCE_NOTE}</p>

        {/* 탭 + 미리보기 (설명은 아래 전체폭으로 분리 → 좌측 컬럼 높이 최소화) */}
        <div className="mt-4 lg:mt-2 grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-start">
          {/* 왼쪽: 탭 */}
          <div role="tablist" aria-label="AX 구현 화면 예시" className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
            {AX_SHOWCASE_SCREENS.map((s, i) => {
              const on = i === active
              return (
                <button
                  key={s.id}
                  ref={(el) => { tabRefs.current[i] = el }}
                  role="tab"
                  id={`axtab-${s.id}`}
                  aria-selected={on}
                  aria-controls={`axpanel-${s.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onTabKey}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-colors motion-reduce:transition-none md:w-full ${
                    on ? 'border-teal-400/40 bg-teal-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-black ${on ? 'bg-teal-400 text-slate-900' : 'bg-white/10 text-slate-300'}`}>{i + 1}</span>
                  <span className="min-w-0">
                    <span className={`block text-[0.95rem] font-black ${on ? 'text-white' : 'text-slate-200'}`}>{s.title}</span>
                    <span className="block text-[0.78rem] font-medium text-slate-400">{s.category}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* 오른쪽: 화면 미리보기 */}
          <div role="tabpanel" id={`axpanel-${screen.id}`} aria-labelledby={`axtab-${screen.id}`} tabIndex={0} className="outline-none">
            <ScreenMedia screen={screen} />
          </div>
        </div>
        {/* 선택 화면 설명 (전체폭 · 1줄) */}
        <p className="mt-2.5 lg:mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.9rem] leading-relaxed text-slate-300">
          <span className="inline-flex items-center rounded-md bg-teal-400/15 px-2 py-0.5 text-[0.72rem] font-black text-teal-200 ring-1 ring-inset ring-teal-400/25">{screen.badge}</span>
          {screen.description}
        </p>

        {/* 보조 안내 + §3 인라인 역량 태그 (작은 인라인 · 별도 대형 제목 없음) */}
        <div className="mt-3 lg:mt-2 flex flex-col gap-2.5 border-t border-white/10 pt-3 lg:pt-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-[0.8rem] leading-relaxed text-slate-500">
            위 화면은 프론트엔드·업무시스템 구현역량을 보여주기 위한 기능 예시({AX_PROOF_LABELS.mvp}·{AX_PROOF_LABELS.prototype})입니다. 실제 구축 화면과 범위는 기업별 업무에 따라 달라집니다.
          </p>
          <div className="flex shrink-0 flex-wrap gap-1.5" aria-label="시스템으로 전환 가능한 업무">
            <span className="sr-only">이런 업무를 시스템으로 바꿀 수 있습니다</span>
            {AX_CAPABILITY_TAGS.map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[0.75rem] font-semibold text-slate-300 ring-1 ring-inset ring-white/10">{t}</span>
            ))}
          </div>
        </div>

        {/* §13 구축 5단계 (컴팩트 넘버링 한 줄) + §5 한 줄 CTA */}
        <div className="mt-3 lg:mt-2 flex flex-col gap-4 border-t border-white/10 pt-3 lg:pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.84rem]">
              {AX_BUILD_STEPS.map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden className="text-slate-600">→</span>}
                  <span className="font-bold text-slate-200"><span className="text-teal-300">{`0${i + 1}`}</span> {s}</span>
                </span>
              ))}
            </div>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-slate-400">가장 필요한 업무부터 작게 구현하고, 실제 사용 결과를 확인하며 확장합니다.</p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
            <button type="button" onClick={onConsult} className="flex w-full items-center justify-center rounded-xl bg-teal-400 px-6 py-3 text-[0.95rem] font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none sm:w-auto">
              AX 성장형 적합성 확인
            </button>
            <button type="button" onClick={onCompare} className="shrink-0 text-center text-sm font-bold text-slate-300 underline underline-offset-4 transition-colors hover:text-white motion-reduce:transition-none sm:text-left">
              진행방식 비교하기
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
