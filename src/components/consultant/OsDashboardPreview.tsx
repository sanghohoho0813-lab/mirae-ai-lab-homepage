// 컨설턴트 운영 OS — 대시보드 예시 화면 (/consultants#dashboard).
// ⚠️ 전부 가상 데이터다. 실제 고객사 이름·숫자는 넣지 않는다(고객사는 A사·B사처럼만).
//    왼쪽 메뉴는 실제로 운영 중인 도구 이름을 그대로 쓴다(비공개 검토 중인 도구는 뺀다).
//    이미지 대신 코드로 그려, 도구가 추가되면 목록만 고치면 된다.

const NAV = [
  { name: '대시보드', icon: '▦', active: true },
  { name: '고객사', icon: '◎' },
  { name: '고용지원금 프로', icon: '₩' },
  { name: '연구소 사후관리', icon: '⚗' },
  { name: '세일즈 OS', icon: '↗' },
  { name: '크레탑 분석', icon: '▤' },
  { name: '창업감면 체크', icon: '✓' },
] as const

const SOON = ['정책자금 AI 심사', '기업인증 관리'] as const

const KPIS = [
  { label: '관리 고객사', value: '24', unit: '곳', note: '이번 달 +3' },
  { label: '진행 중 검토', value: '7', unit: '건', note: '마감 임박 2' },
  { label: '이번 달 제안', value: '9', unit: '건', note: '계약 3' },
  { label: '사후관리 알림', value: '3', unit: '건', note: '이번 주' },
] as const

type Tone = 'rose' | 'amber' | 'slate'
const DUE: Record<Tone, string> = {
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const TODAY: { co: string; meta: string; task: string; tool: string; due: string; tone: Tone }[] = [
  { co: 'B사', meta: '도소매 · 9명', task: '재무 분석 결과로 상담 자료 정리', tool: '크레탑 분석', due: '오늘', tone: 'rose' },
  { co: 'A사', meta: '제조 · 18명', task: '고용지원금 2회차 신청 서류 확인', tool: '고용지원금 프로', due: 'D-2', tone: 'amber' },
  { co: 'C사', meta: 'IT · 32명', task: '연구소 인력 변동 신고 기한 확인', tool: '연구소 사후관리', due: 'D-5', tone: 'slate' },
  { co: 'D사', meta: '서비스 · 6명', task: '창업감면 요건 다시 확인', tool: '창업감면 체크', due: 'D-7', tone: 'slate' },
]

const PIPELINE: [string, number][] = [
  ['첫 상담', 8],
  ['검토 중', 7],
  ['제안 완료', 5],
  ['계약', 3],
]
const PIPE_MAX = Math.max(...PIPELINE.map(([, n]) => n))

export default function OsDashboardPreview() {
  return (
    <figure className="m-0">
      <div
        aria-hidden
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5"
        data-os-preview
      >
        {/* 창 상단 바 */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[0.82rem] font-bold text-slate-500">미래에이아이랩 운영 OS</span>
          <span className="shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-black text-violet-700">예시 화면</span>
        </div>

        <div className="grid md:grid-cols-[196px_1fr]">
          {/* 왼쪽 도구 메뉴 (PC) */}
          <div className="hidden bg-slate-900 p-3 md:block">
            <p className="px-2.5 pb-2 pt-1 text-xs font-black uppercase tracking-widest text-slate-500">도구</p>
            <ul className="space-y-0.5">
              {NAV.map((n) => (
                <li
                  key={n.name}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.88rem] font-semibold ${
                    'active' in n && n.active ? 'bg-white/10 text-white' : 'text-slate-400'
                  }`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-[0.78rem] text-sky-300">{n.icon}</span>
                  <span className="truncate">{n.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 px-2.5 pb-2 text-xs font-black uppercase tracking-widest text-slate-500">곧 추가</p>
            <ul className="space-y-0.5">
              {SOON.map((n) => (
                <li key={n} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.85rem] font-semibold text-slate-500">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-dashed border-slate-600 text-[0.7rem]">+</span>
                  <span className="truncate">{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 bg-slate-50/60 p-4 sm:p-6">
            {/* 도구 메뉴 (폰) — 가로로 넘긴다 */}
            <div className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:hidden [scrollbar-width:none]">
              {NAV.map((n) => (
                <span
                  key={n.name}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[0.8rem] font-bold ${
                    'active' in n && n.active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200'
                  }`}
                >
                  {n.name}
                </span>
              ))}
            </div>

            <p className="text-[0.8rem] font-bold text-slate-500">오늘</p>
            <p className="mt-0.5 text-[1.1rem] font-black tracking-tight text-slate-900 sm:text-[1.25rem]">
              할 일 4건 · 이번 주 마감 2건
            </p>

            {/* 요약 숫자 */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
                  <p className="text-[0.8rem] font-bold text-slate-500">{k.label}</p>
                  <p className="mt-1 text-[1.6rem] font-black leading-none tracking-tight text-slate-900 tabular-nums">
                    {k.value}
                    <span className="ml-0.5 text-[0.85rem] font-bold text-slate-500">{k.unit}</span>
                  </p>
                  <p className="mt-1.5 text-xs font-bold text-violet-600">{k.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_236px]">
              {/* 오늘 할 일 */}
              <div className="rounded-xl bg-white ring-1 ring-inset ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                  <p className="text-[0.9rem] font-black text-slate-900">오늘 할 일</p>
                  <p className="text-xs font-bold text-slate-400">마감 순</p>
                </div>
                <ul className="divide-y divide-slate-100">
                  {TODAY.map((t) => (
                    <li key={t.co + t.task} className="flex items-start gap-3 px-4 py-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-900 text-[0.78rem] font-black text-white">{t.co.slice(0, 1)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="break-keep text-[0.9rem] font-bold leading-snug text-slate-800">{t.task}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {t.co} · {t.meta} · <span className="font-bold text-violet-600">{t.tool}</span>
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-black ring-1 ring-inset ${DUE[t.tone]}`}>{t.due}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 상담 흐름 */}
              <div className="rounded-xl bg-white p-4 ring-1 ring-inset ring-slate-200">
                <p className="text-[0.9rem] font-black text-slate-900">상담 흐름</p>
                <p className="mt-0.5 text-xs text-slate-400">이번 달 · 고객사 수</p>
                <ul className="mt-3 space-y-2.5">
                  {PIPELINE.map(([label, n]) => (
                    <li key={label}>
                      <div className="flex items-center justify-between text-[0.8rem] font-bold text-slate-600">
                        <span>{label}</span>
                        <span className="tabular-nums text-slate-900">{n}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${(n / PIPE_MAX) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm leading-relaxed text-slate-500">
        예시 화면입니다. 고객사와 숫자는 모두 가상 데이터이며, 실제 고객 정보는 표시하지 않습니다.
      </figcaption>
    </figure>
  )
}

// 출시 일정 — 대표님이 정한 문구 그대로(개발 거의 완료 → 테스트·UI/UX 다듬기 → 2026년 10월부터 순차 오픈 → 정식 출시 후 월 구독).
// 날짜·상태가 바뀌면 여기만 고친다.
const LAUNCH: { title: string; desc: string; state: 'done' | 'now' | 'next' }[] = [
  { title: '개발', desc: '모듈 개발은 거의 마무리됐습니다', state: 'done' },
  { title: '다듬는 중', desc: '실사용 테스트와 UI/UX 개선으로 완성도를 끌어올리고 있습니다', state: 'now' },
  { title: '2026년 10월부터', desc: '모듈을 하나씩 순서대로 엽니다', state: 'next' },
  { title: '정식 출시 후', desc: '월 구독으로 제공할 예정입니다', state: 'next' },
]

export function OsLaunchSteps() {
  return (
    <ol data-os-launch className="mt-6 grid gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3" aria-label="출시 일정">
      {LAUNCH.map((l) => (
        <li
          key={l.title}
          className={`flex items-start gap-3 rounded-xl p-3.5 ring-1 ring-inset sm:flex-col sm:gap-2 sm:p-4 ${
            l.state === 'now' ? 'bg-violet-50 ring-violet-200' : 'bg-white ring-slate-200'
          }`}
        >
          <span
            aria-hidden
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.8rem] font-black ${
              l.state === 'done' ? 'bg-emerald-500 text-white' : l.state === 'now' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {l.state === 'done' ? '✓' : l.state === 'now' ? '●' : '○'}
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="text-[0.98rem] font-black text-slate-900">{l.title}</span>
              {l.state === 'now' && <span className="rounded-md bg-violet-600 px-1.5 py-0.5 text-xs font-black text-white">지금</span>}
            </span>
            <span className="mt-0.5 block break-keep text-[0.9rem] leading-snug text-slate-600">{l.desc}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
