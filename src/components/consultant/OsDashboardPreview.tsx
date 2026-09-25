// 컨설턴트 운영 OS(MIRAE AI LAB OS) — 대시보드 예시 화면 · 출시 일정.
// ⚠️ 전부 가상 데이터다. 실제 고객사 이름·숫자는 넣지 않는다(고객사는 A사·B사처럼만).
//    메뉴는 실제 운영 OS 의 구성(오늘·고객·상담신청함·일정 / 컨설팅 작업실 / AX STUDIO)을 그대로 쓴다.
//    화면 흐름은 기획의도대로: 아침에 열면 '반드시 처리할 것'과 먼저 할 세 가지가 이유와 함께 나오고,
//    고객이 한 행동(서류 올림·요청)이 상담신청함으로 들어온다.
//    이미지 대신 코드로 그려, 도구가 추가되면 목록만 고치면 된다.

type NavItem = { name: string; icon: string; active?: boolean }

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: '운영',
    items: [
      { name: '오늘', icon: '◉', active: true },
      { name: '고객', icon: '◎' },
      { name: '상담신청함', icon: '✉' },
      { name: '일정', icon: '▦' },
    ],
  },
  {
    title: '컨설팅 작업실',
    items: [
      { name: '세금 계산기', icon: '▤' },
      { name: '창업감면 판정기', icon: '✦' },
      { name: '크레탑 분석기', icon: '↗' },
      { name: '고용지원금 매니저', icon: '♙' },
      { name: '기업부설연구소 OS', icon: '⚗' },
      { name: '정책자금 진단', icon: '▥' },
      { name: '특허+벤처', icon: '◈' },
    ],
  },
  { title: 'AX STUDIO', items: [{ name: '기업 진단', icon: '☰' }] },
]

const MOBILE_TABS = ['오늘', '고객', '상담신청함', '일정', '작업실'] as const

const KPIS = [
  { label: '진행 중 업체', value: '4', unit: '곳' },
  { label: '막힌 서류', value: '6', unit: '건' },
  { label: '못 받은 돈', value: '2', unit: '건', warn: true },
  { label: '새 상담신청', value: '3', unit: '건' },
] as const

type Tone = 'rose' | 'amber' | 'slate'
const WHY: Record<Tone, string> = {
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
}

// 먼저 할 세 가지 — 순서마다 '왜' 가 붙는다 (규칙으로 정해지는 이유)
const FIRST_THREE: { co: string; task: string; why: string; tone: Tone; tool: string }[] = [
  { co: 'B사', task: '정책자금 신청 서류 최종 확인', why: '신청 마감 D-2', tone: 'rose', tool: '정책자금 진단' },
  { co: 'A사', task: '2차 기성 수금 확인 전화', why: '수금 예정일 3일 지남', tone: 'rose', tool: '정산' },
  { co: 'C사', task: '4대보험 가입자명부 다시 받기', why: '서류 유효기간 D-5', tone: 'amber', tool: '고용지원금 매니저' },
]

// 상담신청함 — 고객이 My MIRAE 에서 한 행동이 자동으로 들어온다
const INBOX: { co: string; what: string; when: string }[] = [
  { co: 'C사', what: '사업자등록증 올림', when: '10분 전' },
  { co: 'A사', what: '진행 상황 확인 요청', when: '1시간 전' },
  { co: 'D사', what: '서류 2건 올림', when: '어제' },
]

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
          <span className="min-w-0 flex-1 truncate text-[0.82rem] font-bold tracking-wide text-slate-500">MIRAE AI LAB OS</span>
          <span className="shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-black text-violet-700">예시 화면</span>
        </div>

        <div className="grid md:grid-cols-[200px_1fr]">
          {/* 왼쪽 메뉴 (PC) — 실제 운영 OS 구성 */}
          <div className="hidden bg-[#171B20] p-3 md:block">
            {NAV_GROUPS.map((g) => (
              <div key={g.title} className="mb-3 last:mb-0">
                <p className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-1 text-xs font-black tracking-wide text-slate-400">
                  <span className="h-3 w-0.5 rounded-full bg-violet-400" />
                  {g.title}
                </p>
                <ul className="space-y-0.5">
                  {g.items.map((n) => (
                    <li
                      key={n.name}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[0.85rem] font-semibold ${
                        n.active ? 'bg-white/10 text-white' : 'text-slate-300'
                      }`}
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-[0.76rem] text-violet-300">{n.icon}</span>
                      <span className="truncate">{n.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="min-w-0 bg-slate-50/60 p-4 sm:p-6">
            {/* 메뉴 (폰) — 가로로 넘긴다 */}
            <div className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:hidden [scrollbar-width:none]">
              {MOBILE_TABS.map((n, i) => (
                <span
                  key={n}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[0.8rem] font-bold ${
                    i === 0 ? 'bg-[#171B20] text-white' : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200'
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>

            <p className="text-[0.8rem] font-bold text-slate-500">오늘</p>
            <p className="mt-0.5 text-[1.1rem] font-black tracking-tight text-slate-900 sm:text-[1.25rem]">
              반드시 처리할 것 <span className="text-rose-600">5건</span>
            </p>

            {/* 요약 숫자 */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
                  <p className="text-[0.8rem] font-bold text-slate-500">{k.label}</p>
                  <p className={`mt-1 text-[1.6rem] font-black leading-none tracking-tight tabular-nums ${'warn' in k && k.warn ? 'text-rose-600' : 'text-slate-900'}`}>
                    {k.value}
                    <span className="ml-0.5 text-[0.85rem] font-bold text-slate-500">{k.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_236px]">
              {/* 먼저 할 세 가지 — 이유와 함께 */}
              <div className="rounded-xl bg-white ring-1 ring-inset ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                  <p className="text-[0.9rem] font-black text-slate-900">먼저 할 세 가지</p>
                  <p className="text-xs font-bold text-slate-400">이유와 함께</p>
                </div>
                <ol className="divide-y divide-slate-100">
                  {FIRST_THREE.map((t, i) => (
                    <li key={t.co + t.task} className="flex items-start gap-3 px-4 py-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#171B20] text-[0.8rem] font-black text-white">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="break-keep text-[0.9rem] font-bold leading-snug text-slate-800">{t.task}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {t.co} · <span className="font-bold text-violet-600">{t.tool}</span>
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-black ring-1 ring-inset ${WHY[t.tone]}`}>{t.why}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 상담신청함 — 고객이 한 일 */}
              <div className="rounded-xl bg-white p-4 ring-1 ring-inset ring-slate-200">
                <p className="text-[0.9rem] font-black text-slate-900">상담신청함</p>
                <p className="mt-0.5 text-xs text-slate-400">고객이 My MIRAE 에서 한 일</p>
                <ul className="mt-3 space-y-2.5">
                  {INBOX.map((e) => (
                    <li key={e.co + e.what} className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                      <div className="min-w-0">
                        <p className="break-keep text-[0.84rem] font-bold leading-snug text-slate-800">
                          {e.co} · {e.what}
                        </p>
                        <p className="text-xs text-slate-400">{e.when}</p>
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

// 출시 일정 — 대표님이 정한 내용 그대로. 날짜·상태가 바뀌면 여기만 고친다.
//  (핵심 기능 개발 거의 완료 → 테스트·UI/UX 다듬기 → 2026년 10월 컨설턴트 운영·기업성장 모듈 → 11월 이후 나머지 · 월 구독)
const LAUNCH: { title: string; desc: string; state: 'done' | 'now' | 'next' }[] = [
  { title: '개발', desc: '핵심 기능 개발은 거의 마무리됐습니다', state: 'done' },
  { title: '다듬는 중', desc: '실사용 테스트와 UI/UX 개선으로 완성도를 끌어올리고 있습니다', state: 'now' },
  { title: '2026년 10월', desc: '컨설턴트 운영 · 기업성장 모듈부터 엽니다', state: 'next' },
  { title: '11월 이후', desc: '나머지 모듈을 차례로 더하고, 정식 출시 후 월 구독으로 제공할 예정입니다', state: 'next' },
]

export function OsLaunchSteps() {
  return (
    <ol data-os-launch className="grid gap-2 sm:grid-cols-4 sm:gap-3" aria-label="출시 일정">
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
