// 3분 AX Fit — 추천 엔진.
// 답을 보고 세 가지 상품 중 '어디서 시작할지'와 '결국 어디까지 갈지'를 정한다.
//   MVP 500만원부터 · 플랫폼형 1,500만원부터 · 풀 패키지(AX + 플랫폼) 3,000만원부터
// ⚠️ 승인·선정 가능성을 판단하지 않는다. 상담 전에 범위를 맞추기 위한 안내다.
//
// 규칙
//  1. 시작 = '가장 먼저 만들고 싶은 것' (시제품 → MVP · 고객 화면 → 플랫폼형 · 운영 화면/둘 다 → 풀 패키지)
//     '모르겠어요'면 업무 신호로 추정한다.
//  2. 목표 = 시작과 업무 신호로 본 필요 중 큰 쪽
//     - 고객 신호: 고객 요청을 사람이 넘김(manualHandoff ≥ 2) 또는 상담 이유에 '고객 서비스'
//     - 운영 신호: 반복 입력 + 대표 확인 ≥ 4, 고유 업무 ≥ 2, 또는 상담 이유에 '업무 정리'
//     - 운영 신호가 있으면 풀 패키지(AX는 풀 패키지에 들어 있다), 고객 신호만 있으면 플랫폼형
//  3. 예산이 500만 원 안팎이면 MVP, 1,500만 원 안팎이면 플랫폼형까지만 먼저 시작한다(목표는 그대로).
// ⚠️ 서버(api/business-diagnosis.ts 의 axPackage)가 같은 규칙으로 다시 계산한다 — 바꾸면 양쪽을 같이 고친다.
import type { AxFitGrade, AxFitProblem, AxFitReport, DiagnosisAnswers } from '../types/businessDiagnosis'
import { DEGREE_OPTIONS, DEGREE_VALUE, DIAGNOSIS_VERSION, WORK_SIGNAL_IDS, isPreStartup, questions } from '../data/businessDiagnosisQuestions'

const one = (a: DiagnosisAnswers, id: string): string | undefined => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: DiagnosisAnswers, id: string): string[] => (Array.isArray(a[id]) ? (a[id] as string[]) : [])
const val = (a: DiagnosisAnswers, id: string): number => DEGREE_VALUE[one(a, id) ?? ''] ?? 0
/** 보기 값 → 화면 글자 (질문 데이터에서 찾는다) */
const optionLabel = (id: string, v?: string): string => questions.find((q) => q.id === id)?.options.find((o) => o.value === v)?.label ?? ''
/** 고른 답을 그대로 (예: '거의 항상 그래요') — 결과지에서 대표님 답을 되돌려 보여준다 */
const degreeLabel = (a: DiagnosisAnswers, id: string): string => DEGREE_OPTIONS.find((o) => o.value === one(a, id))?.label ?? ''

/** 5점 단위 반올림 — 가짜 정밀도를 만들지 않는다 */
const round5 = (n: number) => Math.max(0, Math.min(100, Math.round(n / 5) * 5))

export const PACKAGE_ORDER: readonly AxFitGrade[] = ['MVP', 'PLATFORM', 'FULL']
const rank = (p: AxFitGrade) => PACKAGE_ORDER.indexOf(p)

export const PACKAGE_META: Record<AxFitGrade, { label: string; ro: string; short: string; price: string; desc: string; headline: string }> = {
  MVP: {
    label: 'MVP',
    ro: 'MVP로',
    short: '보여 줄 시제품',
    price: '500만원부터',
    desc: '꼭 필요한 기능만 담아 실제로 눌러 볼 수 있게 만든 화면이에요. 심사·투자 자리에서도 켜서 보여 줄 수 있어요.',
    headline: '작게, 꼭 필요한 화면 하나부터 만드는 게 맞아요.',
  },
  PLATFORM: {
    label: '플랫폼형',
    ro: '플랫폼형으로',
    short: '고객이 쓰는 화면',
    price: '1,500만원부터',
    desc: '고객·거래처가 직접 주문하고 예약하는 화면이에요. 쓰는 만큼 데이터가 쌓여요.',
    headline: '고객이 쓰는 플랫폼부터 여는 게 맞아요.',
  },
  FULL: {
    label: '풀 패키지',
    ro: '풀 패키지로',
    short: 'AX + 플랫폼',
    price: '3,000만원부터',
    desc: '회사 운영(AX)과 고객 플랫폼을 한 번에 이어요. 회사 현황과 AI 판단이 대표님 폰 한 화면에 나와요.',
    headline: 'AX와 플랫폼을 함께 잇는 풀 패키지가 맞아요.',
  },
}

const START_BY_TARGET: Record<string, AxFitGrade> = { demo: 'MVP', customer: 'PLATFORM', internal: 'FULL', both: 'FULL' }
const BUDGET_CAP: Record<string, AxFitGrade> = { under500: 'MVP', around1500: 'PLATFORM' }

function signals(a: DiagnosisAnswers) {
  const reasons = many(a, 'reason')
  const customer = val(a, 'manualHandoff') >= 2 || reasons.includes('service')
  const internal = val(a, 'repeatInput') + val(a, 'ceoCheck') >= 4 || val(a, 'uniqueWork') >= 2 || reasons.includes('ops')
  return { customer, internal }
}

/** 시작 상품과 목표 상품 — 서버 axPackage 와 같은 규칙 */
export function recommendPackage(a: DiagnosisAnswers): { start: AxFitGrade; target: AxFitGrade; capped: boolean } {
  const sig = signals(a)
  const needed: AxFitGrade = sig.internal ? 'FULL' : sig.customer ? 'PLATFORM' : 'MVP'
  const chosen = START_BY_TARGET[one(a, 'buildTarget') ?? '']
  const first = chosen ?? needed
  const target = rank(needed) > rank(first) ? needed : first
  const cap = BUDGET_CAP[one(a, 'budget') ?? '']
  const start = cap && rank(first) > rank(cap) ? cap : first
  return { start, target, capped: start !== first }
}

// 업무 신호 카드 문안 — (문제 / 왜 문제인지 / 그대로 두면)
const PROBLEM_COPY: Record<string, { title: string; why: string; ifIgnored: string }> = {
  repeatInput: {
    title: '같은 정보를 여러 곳에 반복 입력',
    why: '옮겨 적을 때마다 오타가 나고, 직원 시간도 거기에 들어가요.',
    ifIgnored: '거래가 늘면 입력도 같이 늘어서, 사람을 더 뽑아도 끝이 안 나요.',
  },
  ceoCheck: {
    title: '진행 상황을 대표님이 직접 묻고 확인해야 돌아감',
    why: "담당자 머릿속에만 있으니, '그거 어떻게 됐어요?' 묻는 것부터 일이 돼요.",
    ifIgnored: '회사가 커질수록 확인할 일도 같이 늘고, 대표님이 자리를 비우면 일이 멈춰요.',
  },
  manualHandoff: {
    title: '고객 주문과 예약, 문의를 사람이 직접 전달',
    why: '문의가 담당자 폰에서 멈추면, 답이 언제 나갈지는 그 사람 사정에 달려요.',
    ifIgnored: '고객이 늘수록 빠뜨리는 주문과 늦는 답변도 같이 늘어요.',
  },
  uniqueWork: {
    title: '기존 프로그램(ERP·POS·SaaS)으로는 안 되는 우리 회사만의 일',
    why: '이 일이 우리 회사의 강점이자, 지금 자주 막히는 곳이에요.',
    ifIgnored: '계속 사람 손으로 처리하면 그 노하우가 회사에 남지 않아요.',
  },
}

// 업무 신호별 권장 방향 한 줄
const SIGNAL_POINT: Record<string, string> = {
  repeatInput: '한 번만 입력하면 필요한 곳에 같이 들어가게 해요.',
  ceoCheck: '안 물어봐도 진행 상황이 한 화면에 보여요.',
  manualHandoff: '주문, 예약, 문의가 들어오면 담당자에게 바로 넘어가게 해요.',
  uniqueWork: '시중 프로그램으로 안 되던 일을 전용 시스템으로 만들어요.',
}

// 상담 이유별로 같이 준비할 것 — 제도 결과를 약속하지 않고 '무엇을 준비하는지'만 말한다
const FOCUS: Record<string, { title: string; text: string }> = {
  fund: { title: '정책자금', text: '지금 신청할 수 있는 자금과 시기를 같이 보고, 신청 서류에 넣을 화면과 자료를 준비해요.' },
  grant: { title: '정부지원사업', text: '사업계획서에 넣을 실제 화면을 마감 일정에 맞춰 준비해요.' },
  invest: { title: '투자 유치', text: 'IR 자리에서 켜서 보여 줄 화면과 지표를 먼저 정리해요.' },
  cert: { title: '벤처기업확인·인증', text: '벤처기업확인 신청까지 함께 준비해요. 확인기관에 내는 심사 수수료는 별도예요.' },
  ops: { title: '업무 정리', text: '반복 입력과 대표님 확인이 많은 일부터 줄여요.' },
  service: { title: '고객 서비스', text: '고객이 가장 많이 하는 요청(주문·예약·문의)부터 화면으로 열어요.' },
}

const SHORT: Record<'bizStage' | 'teamSize' | 'timeline', Record<string, string>> = {
  bizStage: { pre: '예비창업', early: '창업 3년 미만', growth: '업력 3~7년', mature: '업력 7년 이상' },
  teamSize: { solo: '1인', small: '2~4명', mid: '5~19명', large: '20~49명', over: '50명 이상' },
  timeline: { within1m: '1개월 안', within3m: '3개월 안', within6m: '6개월 안', none: '일정 미정' },
}

export function computeAxFit(answers: DiagnosisAnswers): AxFitReport {
  const pre = isPreStartup(answers)
  const { start, target, capped } = recommendPackage(answers)
  const meta = PACKAGE_META[start]
  const reasonsPicked = many(answers, 'reason')
  const buildTarget = one(answers, 'buildTarget')
  const budget = one(answers, 'budget')

  // 업무 신호 — 예비창업은 묻지 않는다
  const workIds = pre ? [] : [...WORK_SIGNAL_IDS]
  const workSum = workIds.reduce((sum, id) => sum + val(answers, id), 0)
  const score = workIds.length ? round5((workSum / (workIds.length * 3)) * 100) : 0

  const ranked = workIds
    .map((id, i) => ({ id, i, v: val(answers, id) }))
    .filter((x) => x.v >= 1)
    .sort((x, y) => y.v - x.v || x.i - y.i)
    .slice(0, 3)
  const topProblems: AxFitProblem[] = ranked.map((x, idx) => ({
    rank: idx + 1,
    questionId: x.id,
    ...PROBLEM_COPY[x.id],
    tone: idx === 0 ? 'orange' : 'amber',
    severity: x.v,
    answerLabel: degreeLabel(answers, x.id),
  }))
  const painCount = workIds.filter((id) => val(answers, id) >= 2).length

  // 상황 요약 칩 — 보기 문장('~이에요') 대신 짧은 이름으로
  const situation = [
    { label: '단계', value: SHORT.bizStage[one(answers, 'bizStage') ?? ''] ?? '' },
    { label: '업종', value: optionLabel('industry', one(answers, 'industry')) },
    { label: '인원', value: SHORT.teamSize[one(answers, 'teamSize') ?? ''] ?? '' },
    { label: '일정', value: SHORT.timeline[one(answers, 'timeline') ?? ''] ?? '' },
  ].filter((c) => c.value)

  // 이 상품을 권하는 이유 — 대표님 답에서만 뽑는다
  const why: string[] = []
  if (buildTarget && buildTarget !== 'unsure') why.push(`먼저 만들고 싶은 것 — ${optionLabel('buildTarget', buildTarget)}`)
  else why.push('만들 것은 상담에서 같이 정해요. 지금 답으로는 이 구성이 가장 가까워요.')
  if (pre && start === 'MVP') why.push('창업 전이라, 보여 줄 수 있는 화면부터 갖추는 게 순서예요.')
  // 업무 신호 — 목표가 풀 패키지면 운영 쪽 근거를, 아니면 고객 쪽 근거를 먼저 든다
  const customerWhy: string[] = []
  const internalWhy: string[] = []
  if (!pre && val(answers, 'manualHandoff') >= 2) customerWhy.push('고객 주문·예약·문의를 사람이 일일이 넘기고 있어요.')
  if (reasonsPicked.includes('service') && customerWhy.length === 0) customerWhy.push('고객이 쓸 서비스를 만들고 싶다고 하셨어요.')
  if (!pre && val(answers, 'repeatInput') + val(answers, 'ceoCheck') >= 4) internalWhy.push('반복 입력과 대표님 확인이 일의 흐름을 막고 있어요.')
  if (!pre && val(answers, 'uniqueWork') >= 2) internalWhy.push('시중 프로그램으로 안 되는 우리 회사만의 일이 있어요.')
  why.push(...(target === 'FULL' ? [...internalWhy, ...customerWhy] : [...customerWhy, ...internalWhy]))
  if (start === 'MVP' && buildTarget !== 'demo' && (reasonsPicked.includes('grant') || reasonsPicked.includes('invest'))) why.push('심사·투자 자리에서 보여 줄 화면이 먼저 필요해요.')
  const capLine = capped ? `예산에 맞춰 ${PACKAGE_META[start].ro} 먼저 시작하고, 쓰면서 넓혀 가요.` : ''
  const reasons = [...why.slice(0, capLine ? 2 : 3), ...(capLine ? [capLine] : [])]

  // 상담 이유별로 같이 준비할 것 (+ 1개월 안 일정)
  const focus = reasonsPicked.filter((r) => FOCUS[r]).map((r) => FOCUS[r])
  if (one(answers, 'timeline') === 'within1m') focus.unshift({ title: '1개월 안 일정', text: '마감에 맞출 수 있는 범위부터 정하고, 2주 안에 기본 틀을 만들어요.' })
  // AX가 자금을 받기 위한 수단으로 읽히지 않게 — 자금·지원사업·투자를 고르면 보장하지 않는다는 말을 붙인다
  const focusNote = ['fund', 'grant', 'invest'].some((r) => reasonsPicked.includes(r))
    ? 'AX로 만든 화면과 데이터는 정책자금·지원사업·투자 심사에서 참고 자료나 가점 요소가 될 수 있을 뿐, 승인·선정·투자를 보장하지 않아요. 결과는 기관과 투자자의 심사로 정해져요.'
    : undefined

  // 비용·정산 안내 — 영상 2편과 같은 말로
  const deferred = budget === 'afterFunding' || reasonsPicked.includes('fund') || reasonsPicked.includes('grant')
  const paymentNote =
    '금액은 시작 기준이에요. 범위는 상담에서 정하고, 자금 승인 여부와 관계없이 진행 정도에 따라 정산해요.' +
    (deferred ? ' 자금 흐름이 부담되면 착수금으로 시작하고, 개발비는 자금이 들어온 뒤 후불로 정산할 수도 있어요.' : '')

  // 권장 방향 + 다음 행동 (시작 상품 기준)
  const signalPoints = ranked.filter((x) => x.v >= 2).map((x) => SIGNAL_POINT[x.id])
  const steppingUp = rank(target) > rank(start) ? `반응을 보며 ${PACKAGE_META[target].label}까지 한 단계씩 넓혀요.` : ''
  const direction =
    start === 'MVP'
      ? {
          title: '꼭 필요한 화면 하나부터 만드세요',
          points: ['꼭 보여 줄 기능 1~2개만 골라, 2주 안에 눌러 볼 수 있게 만들어요.', ...signalPoints.slice(0, 1), ...(steppingUp ? [steppingUp] : [])],
        }
      : start === 'PLATFORM'
        ? {
            title: '고객이 쓰는 화면부터 여세요',
            points: [
              '주문, 예약, 문의가 들어오면 담당자에게 바로 넘어가게 해요.',
              '고객이 쓰는 만큼 데이터가 쌓여, 다음 단계를 정할 근거가 돼요.',
              ...(steppingUp ? [steppingUp] : []),
            ],
          }
        : {
            title: '회사 운영과 고객 화면을 한 번에 이으세요',
            points: [...signalPoints.slice(0, 2), '회사 현황과 AI 판단을 대표님 폰 한 화면에서 봐요.'],
          }
  const nextActions =
    start === 'MVP'
      ? ['상담에서 일정과, 꼭 보여 줄 기능 1~2개를 정해요.', '2주 안에 MVP를 만들고, 반응을 보며 다음 단계를 정해요.']
      : start === 'PLATFORM'
        ? ['상담에서 고객이 가장 많이 하는 요청부터 정해요.', '2주 안에 기본 틀을 열고, 실제로 쓰면서 다듬어요.']
        : ['AX Blueprint 상담에서 사업과 업무를 같이 보고, 무엇부터 어디까지 만들지와 성과 지표(KPI)를 정해요.', '2주 안에 기본 틀을 잡은 뒤, 실제 업무 자료로 다듬고 테스트해요.']

  // 내부 담당자 준비 상태 — 예비창업은 묻지 않는다
  const owner = one(answers, 'internalOwner')
  const readiness =
    pre || !owner
      ? null
      : owner === 'dedicated'
        ? { label: '전담자 있음', note: '함께 쓸 담당자가 있어, 만든 뒤 빨리 자리 잡을 수 있어요.' }
        : owner === 'partTime'
          ? { label: '겸임 담당자 있음', note: '겸임으로도 시작할 수 있어요. 처음엔 대표님과 같이 챙겨 볼 날을 정해 두세요.' }
          : owner === 'ceo'
            ? { label: '대표가 직접', note: '대표님이 직접 쓰면서 시작해도 돼요. 자리 잡을 즈음엔 맡을 사람을 정해 두세요.' }
            : { label: '아직 없음', note: '같이 쓸 담당자부터 정해 두세요.' }

  const headline = start === target ? meta.headline : `${meta.ro} 시작해, ${PACKAGE_META[target].label}까지 한 단계씩 가는 게 맞아요.`

  return {
    version: DIAGNOSIS_VERSION,
    grade: start,
    target,
    gradeLabel: meta.label,
    gradeDesc: meta.desc,
    priceFrom: meta.price,
    score,
    headline,
    summary: meta.desc,
    situation,
    reasons,
    focus,
    focusNote,
    paymentNote,
    topProblems,
    painCount,
    painTotal: workIds.length,
    direction,
    nextActions,
    readiness,
  }
}
