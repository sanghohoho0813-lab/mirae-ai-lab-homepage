// 3분 AX Fit — 점수·등급 엔진.
// ⚠️ 여기서 계산되는 점수는 승인·선정 확률이 아니라 "우리 회사에 별도 AX가 맞는지"를
//    가늠하는 내부 판단 지표(0~100, 5점 단위)입니다. 지나치게 정밀한 숫자를 만들지 않습니다.
//
// 구성
//  - 문제 강도 (1~8번 합, 최대 24)      → 60점
//  - 고유 업무 (9번, 최대 3)            → 25점
//  - 내부 담당자 (10번, 최대 3)         → 15점
//
// 등급
//  - NO_GO  '지금은 정비 먼저'   : 점수 35 미만
//  - LITE   '작게 시작'         : 35~54, 또는 고유 업무가 약해(9번 ≤ 1) 기성 도구로 해결될 가능성이 큰 경우(점수 70 미만)
//  - FULL   '전면 구축 후보'    : 55 이상이고 고유 업무가 분명한 경우
//  - HIGH   '최우선 검토'       : 75 이상 + 고유 업무 분명 + 대표 의존(2·8번 합 ≥ 4) + 데이터 축적 가능성(7번 ≥ 2)
import type { AxFitGrade, AxFitProblem, AxFitReport, DiagnosisAnswers, SeverityTone } from '../types/businessDiagnosis'
import { DEGREE_OPTIONS, DEGREE_VALUE, DIAGNOSIS_VERSION, OWNER_VALUE } from '../data/businessDiagnosisQuestions'

const PROBLEM_IDS = ['repeatInput', 'askProgress', 'toolGaps', 'manualHandoff', 'missDelay', 'priorityByMemory', 'dataUnused', 'ceoLoadGrows'] as const
/** 점수에 들어가는 업무 문항 — 결과지의 "9개 중 N개" 는 이 목록 기준이다 */
const PAIN_IDS = [...PROBLEM_IDS, 'uniqueWork'] as const

const val = (a: DiagnosisAnswers, id: string): number => {
  const v = a[id]
  return typeof v === 'string' ? (DEGREE_VALUE[v] ?? 0) : 0
}
/** 고른 답을 그대로 (예: '거의 항상 그래요') — 결과지에서 대표님 답을 되돌려 보여준다 */
const answerLabel = (a: DiagnosisAnswers, id: string): string => {
  const v = a[id]
  return typeof v === 'string' ? (DEGREE_OPTIONS.find((o) => o.value === v)?.label ?? '') : ''
}
const ownerVal = (a: DiagnosisAnswers): number => {
  const v = a['internalOwner']
  return typeof v === 'string' ? (OWNER_VALUE[v] ?? 0) : 0
}

/** 5점 단위 반올림 — 가짜 정밀도를 만들지 않는다 */
const round5 = (n: number) => Math.max(0, Math.min(100, Math.round(n / 5) * 5))

export const GRADE_META: Record<AxFitGrade, { label: string; desc: string; headline: string; tone: SeverityTone }> = {
  NO_GO: {
    label: '지금은 정비 먼저',
    desc: '새 시스템을 들이기 전에 엑셀과 카톡부터 정리하면 되는 단계예요.',
    headline: '지금은 새로 만들기보다 정리가 먼저예요.',
    tone: 'blue',
  },
  LITE: {
    label: '작게 시작',
    desc: '전체를 바꾸기보다, 자주 막히는 일부터 손보면 되는 단계예요.',
    headline: '작게 시작하는 게 맞아요.',
    tone: 'amber',
  },
  FULL: {
    label: '전면 구축 후보',
    desc: '우리 회사 방식대로 도는 전용 시스템에 AI 판단까지 붙이길 권해요.',
    headline: '전면 구축까지 검토해 볼 만한 회사예요.',
    tone: 'orange',
  },
  HIGH: {
    label: '최우선 검토',
    desc: '일이 복잡하고 대표님 손을 많이 타는 데다, 쌓아 둔 기록도 쓸 데가 많아요.',
    headline: '지금 AX를 우선 검토해 볼 때예요.',
    tone: 'red',
  },
}

// 문제 카드 문안 — 질문별 (문제 / 왜 문제인지 / 그대로 두면)
const PROBLEM_COPY: Record<string, { title: string; why: string; ifIgnored: string }> = {
  repeatInput: {
    title: '같은 정보를 여러 곳에 반복 입력',
    why: '옮겨 적을 때마다 오타가 나고, 직원 시간도 거기에 들어가요.',
    ifIgnored: '거래가 늘면 입력도 같이 늘어서, 사람을 더 뽑아도 끝이 안 나요.',
  },
  askProgress: {
    title: '진행 상황을 직접 물어봐야 알 수 있음',
    why: "담당자 머릿속에만 있으니, '그거 어떻게 됐어요?' 묻는 것부터 일이 돼요.",
    ifIgnored: '대표님이 자리를 비우면 회사 일도 같이 멈춰요.',
  },
  toolGaps: {
    title: '엑셀, 카톡, 전화, ERP 사이에서 일이 끊김',
    why: '카톡에서 엑셀로 옮기는 사이를 사람이 메우고, 실수도 거기서 나요.',
    ifIgnored: '회사 상황을 한 번에 볼 곳이 없어 결정이 늦어져요.',
  },
  manualHandoff: {
    title: '고객 요청과 주문, 예약을 사람이 직접 전달',
    why: '문의가 담당자 폰에서 멈추면, 답이 언제 나갈지는 그 사람 사정에 달려요.',
    ifIgnored: '고객이 늘수록 빠뜨리는 주문과 늦는 답변도 같이 늘어요.',
  },
  missDelay: {
    title: '빠뜨리거나 늦어져 다시 확인하는 일이 반복',
    why: '알려 주는 곳이 없어서, 사람 기억으로 겨우 막고 있는 거예요.',
    ifIgnored: '다시 확인하느라 정작 일할 시간이 계속 줄어요.',
  },
  priorityByMemory: {
    title: '무엇부터 할지 담당자의 경험과 기억에 의존',
    why: '누가 맡느냐에 따라 순서도, 결과도 달라져요.',
    ifIgnored: '담당자가 바뀌면 순서를 처음부터 다시 잡아야 해요.',
  },
  dataUnused: {
    title: '데이터는 있는데 결정할 때 쓰지 못함',
    why: '거래 기록은 엑셀에 쌓여만 있고, 결정할 땐 안 꺼내 봐요.',
    ifIgnored: '감으로 내린 결정이 맞았는지 확인할 길이 계속 없어요.',
  },
  ceoLoadGrows: {
    title: '회사가 커질수록 대표님과 관리자가 확인할 일도 늘어남',
    why: '회사가 클수록 대표님이 더 바쁘다면, 시스템이 할 일을 대표님이 하고 있는 거예요.',
    ifIgnored: '매출이 두 배가 되면 대표님 일도 두 배가 돼요.',
  },
  uniqueWork: {
    title: '기존 ERP·POS·SaaS로는 안 되는 우리 회사만의 일',
    why: '이 일이 우리 회사의 강점이자, 지금 자주 막히는 곳이에요.',
    ifIgnored: '계속 사람 손으로 처리하면 그 노하우가 회사에 남지 않아요.',
  },
}

// 권장 AX 방향 — 문제 묶음별 한 줄
type Cluster = { id: string; qs: string[]; point: string }
const CLUSTERS: Cluster[] = [
  { id: 'connect', qs: ['repeatInput', 'toolGaps'], point: '한 번만 입력하면 필요한 곳에 같이 들어가게 해요.' },
  { id: 'visibility', qs: ['askProgress', 'ceoLoadGrows'], point: '안 물어봐도 진행 상황이 한 화면에 보여요.' },
  { id: 'customer', qs: ['manualHandoff'], point: '주문, 예약, 문의가 들어오면 담당자에게 바로 넘어가게 해요.' },
  { id: 'judgment', qs: ['missDelay', 'priorityByMemory'], point: '놓치기 쉬운 일과 먼저 할 일을 AI가 먼저 알려 줘요.' },
  { id: 'data', qs: ['dataUnused'], point: '쌓인 기록을 한눈에 보는 우리 회사 현황판(대시보드)을 만들어요.' },
  { id: 'unique', qs: ['uniqueWork'], point: '시중 프로그램으로 안 되던 일을 전용 시스템으로 만들어요.' },
]

function topClusterPoints(a: DiagnosisAnswers, max: number): string[] {
  return CLUSTERS.map((c, i) => ({ c, i, s: c.qs.reduce((sum, q) => sum + val(a, q), 0) / c.qs.length }))
    .filter((x) => x.s >= 1)
    .sort((x, y) => y.s - x.s || x.i - y.i)
    .slice(0, max)
    .map((x) => x.c.point)
}

export function computeAxFitGrade(a: DiagnosisAnswers): { grade: AxFitGrade; score: number } {
  const pain = PROBLEM_IDS.reduce((sum, id) => sum + val(a, id), 0) // 0~24
  const unique = val(a, 'uniqueWork') // 0~3
  const owner = ownerVal(a) // 0~3
  const score = round5((pain / 24) * 60 + (unique / 3) * 25 + (owner / 3) * 15)

  const ceoDependency = val(a, 'askProgress') + val(a, 'ceoLoadGrows') // 0~6
  const dataPotential = val(a, 'dataUnused') // 0~3

  let grade: AxFitGrade
  if (score < 35) grade = 'NO_GO'
  else if (unique <= 1 && score < 70) grade = 'LITE'
  else if (score < 55) grade = 'LITE'
  else if (score >= 75 && unique >= 2 && ceoDependency >= 4 && dataPotential >= 2) grade = 'HIGH'
  else grade = 'FULL'
  return { grade, score }
}

export function computeAxFit(answers: DiagnosisAnswers): AxFitReport {
  const { grade, score } = computeAxFitGrade(answers)
  const meta = GRADE_META[grade]

  // 현재 가장 큰 문제 TOP 3 — 1~9번 중 강도 높은 순(동점은 질문 순서)
  const ranked = PAIN_IDS.map((id, i) => ({ id, i, v: val(answers, id) }))
    .filter((x) => x.v >= 1)
    .sort((x, y) => y.v - x.v || x.i - y.i)
    .slice(0, 3)
  const topProblems: AxFitProblem[] = ranked.map((x, idx) => ({
    rank: idx + 1,
    questionId: x.id,
    ...PROBLEM_COPY[x.id],
    tone: idx === 0 ? 'orange' : 'amber',
    severity: x.v,
    answerLabel: answerLabel(answers, x.id),
  }))

  // '자주 그래요' 이상으로 답한 문항 수 — 문제가 몇 군데에 퍼져 있는지 한 숫자로 보여준다
  const painCount = PAIN_IDS.filter((id) => val(answers, id) >= 2).length

  // 권장 AX 방향
  const clusterPoints = topClusterPoints(answers, 2)
  const direction =
    grade === 'NO_GO'
      ? {
          title: '지금 쓰는 도구부터 정리하세요',
          points: [
            '엑셀, 카톡방, ERP에 각각 뭘 남길지부터 정해 두세요.',
            '옮겨 적는 일이 눈에 띄게 늘면, 그때 작게 시작해요.',
          ],
        }
      : grade === 'LITE'
        ? {
            title: '제일 자주 막히는 일 하나부터 시작하세요',
            points: [...clusterPoints, '한 번에 다 바꾸지 않고, 한 곳만 먼저 이어 봐요.'],
          }
        : grade === 'FULL'
          ? {
              title: '우리 회사만의 일부터 시스템으로 옮기세요',
              points: [...clusterPoints, "AI가 '이것부터 하세요' 하고 알려 줄 업무도 같이 골라요."],
            }
          : {
              title: '전면 구축 설계를 먼저 검토해 보세요',
              points: [...clusterPoints, '대표님 확인을 줄이도록 운영 화면과 AI 판단을 함께 설계해요.'],
            }

  // 내부 담당자 준비 상태
  const owner = answers['internalOwner']
  const readiness =
    owner === 'dedicated'
      ? { label: '전담자 있음', note: '함께 쓸 담당자가 있어, 만든 뒤 빨리 자리 잡을 수 있어요.' }
      : owner === 'partTime'
        ? { label: '겸임 담당자 있음', note: '겸임으로도 시작할 수 있어요. 처음엔 대표님과 같이 챙겨 볼 날을 정해 두세요.' }
        : owner === 'ceo'
          ? { label: '대표가 직접', note: '대표님이 직접 쓰면서 시작해도 돼요. 자리 잡을 즈음엔 맡을 사람을 정해 두세요.' }
          : { label: '아직 없음', note: '같이 쓸 담당자부터 정해 두세요.' }

  // 다음 행동
  const nextActions =
    grade === 'NO_GO'
      ? ['도구를 정리한 뒤, 반복 입력이 늘면 이 진단을 다시 해 보세요.', '원하시면 상담에서 지금 도구 구성만 짧게 봐 드려요.']
      : grade === 'LITE'
        ? ['제일 자주 막히는 일 1개를 골라, 상담에서 어디까지 할지 정하세요.', '같이 쓸 담당자를 먼저 정해 두면 진행이 빨라져요.']
        : grade === 'FULL'
          ? ['AX Blueprint 상담부터 시작하세요. 사업과 업무를 같이 보고, 무엇부터 어디까지 만들지와 성과 지표(KPI)를 정해요.', '1차 AX Build는 효과가 가장 큰 핵심 업무 하나로 시작해요.']
          : ['AX Fit 상담을 신청해, 사업과 업무 분석 일정부터 잡으세요.', '1차 구축 범위는 운영 화면부터 검토해요.']
  // ⚠️ 담당자 안내(readiness.note)는 결과지에서 '내부 담당자' 칸으로 따로 보여준다 —
  //    여기에 또 넣으면 같은 문장이 바로 위아래에 두 번 나온다.

  return {
    version: DIAGNOSIS_VERSION,
    grade,
    gradeLabel: meta.label,
    gradeDesc: meta.desc,
    score,
    headline: meta.headline,
    summary: meta.desc,
    topProblems,
    painCount,
    painTotal: PAIN_IDS.length,
    direction,
    nextActions,
    readiness,
  }
}
