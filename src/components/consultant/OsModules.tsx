// MIRAE AI LAB OS — 7개 모듈 (/consultants#modules).
// 기준: 대표님이 정리한 모듈표(대모듈 · 포함 기능). '지금 쓰는 도구' 는 실제 운영 OS 의 컨설팅 작업실 메뉴다.
// 일정은 대표님이 정한 대로 — 컨설턴트 운영 · 기업성장 모듈은 10월 중, 나머지는 11월 이후. 바뀌면 여기만 고친다.
// ⚠️ 가격·완성도 % 는 적지 않는다(정해지지 않은 숫자를 보이지 않는다).

type When = '10월 중 완성 예정' | '11월 이후'

type OsModule = {
  name: string
  /** 한 줄 부연 — 이 모듈이 컨설턴트의 어떤 일을 대신 잡아 주는지 */
  desc: string
  features: string[]
  /** 지금 실제 운영 OS 에서 쓰고 있는 도구 */
  now?: string[]
  when: When
  /** 다른 모듈의 바탕이 되는 모듈 */
  base?: boolean
}

export const OS_MODULES: OsModule[] = [
  {
    name: '컨설턴트 운영 모듈',
    base: true,
    desc: '매일 여는 바탕 화면. 여러 고객사의 할 일·서류·수금을 한 화면에 모으고, 고객 화면(My MIRAE)과 한 바퀴로 이어 관리합니다.',
    features: ['고객관리', '일정', '상담이력', '문서', '기성고', '정산', '리포트'],
    now: ['오늘 화면', '업체별 현황표', '상담신청함', '업무 일기', '고객 발행'],
    when: '10월 중 완성 예정',
  },
  {
    name: '기업성장 모듈',
    desc: '인증·자금·인력 지원처럼 회사가 커 가는 단계마다 필요한 일을, 요건 확인부터 사후관리까지 끊기지 않게 이어 갑니다.',
    features: ['기업인증', '정책자금', '보증', '고용지원금', '연구소', '성장 로드맵'],
    now: ['고용지원금 매니저', '기업부설연구소 OS', '정책자금 진단', '특허+벤처'],
    when: '10월 중 완성 예정',
  },
  {
    name: '정부지원사업 모듈',
    desc: '공고를 고객사 조건과 맞춰 보고, 신청부터 결과까지 마감을 놓치지 않게 관리합니다.',
    features: ['사업화', 'R&D', '바우처', '수출', '지자체 공고 매칭·관리'],
    now: ['자금·지원사업'],
    when: '11월 이후',
  },
  {
    name: '절세·재무 모듈',
    desc: '세금 계산과 감면 판정, 절세 시뮬레이션으로 상담 자리에서 숫자로 설명할 수 있게 돕습니다.',
    features: ['세금계산기', '창업감면', '절세 시뮬레이션', '가업승계', '재무기초 분석'],
    now: ['세금 계산기', '창업감면 판정기', '크레탑 분석기'],
    when: '11월 이후',
  },
  {
    name: 'IP·R&D 모듈',
    desc: '기술 아이디어를 특허 출원 준비와 연구개발 기획으로 정리해, 기술사업화까지 한 흐름으로 잇습니다.',
    features: ['특허 아이디어 정리', '출원준비', '연구개발 기획', '기술사업화'],
    now: ['특허+벤처'],
    when: '11월 이후',
  },
  {
    name: 'AX 구축 모듈',
    desc: '고객사의 업무를 진단하고 MVP·화면·자동화 설계까지, AX 프로젝트의 앞단을 표준화합니다.',
    features: ['AX 진단', 'MVP 기획', '화면 설계', '업무 자동화 설계'],
    now: ['AX STUDIO · 기업 진단'],
    when: '11월 이후',
  },
  {
    name: 'WEB STUDIO',
    desc: '고객사의 홈페이지·랜딩페이지를 기획부터 카피·디자인·배포까지 한 번에 진행합니다.',
    features: ['홈페이지·랜딩페이지 기획', '카피', '디자인', '배포'],
    when: '11월 이후',
  },
]

export default function OsModules() {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2" data-os-modules>
      {OS_MODULES.map((m, i) => {
        const soon = m.when === '10월 중 완성 예정'
        return (
          <article
            key={m.name}
            className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${m.base ? 'border-violet-300 ring-1 ring-violet-200 md:col-span-2' : 'border-slate-200'}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black tabular-nums text-slate-400">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-[1.2rem] font-black tracking-tight text-slate-900 sm:text-[1.3rem]">{m.name}</h3>
              {m.base && <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-xs font-black text-white">모든 모듈의 바탕</span>}
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-black ${
                  soon ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
                }`}
              >
                {m.when}
              </span>
            </div>
            <p className="mt-2.5 break-keep text-[1rem] leading-relaxed text-slate-600">{m.desc}</p>

            <p className="mt-4 text-xs font-black tracking-wide text-slate-400">포함 기능</p>
            <ul className="mb-4 mt-1.5 flex flex-wrap gap-1.5">
              {m.features.map((f) => (
                <li key={f} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[0.88rem] font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                  {f}
                </li>
              ))}
            </ul>

            {m.now && (
              <p className="mt-auto break-keep border-t border-slate-100 pt-3 text-[0.88rem] leading-relaxed text-slate-500">
                <span className="font-bold text-violet-700">지금 쓰는 도구 · </span>
                {m.now.join(' · ')}
              </p>
            )}
          </article>
        )
      })}
    </div>
  )
}
