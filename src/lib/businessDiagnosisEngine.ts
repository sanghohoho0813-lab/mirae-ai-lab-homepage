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
    desc: '새 시스템을 만들기 전에, 지금 쓰는 업무와 도구부터 정리하는 게 맞는 상태예요.',
    headline: '지금은 AX보다 정리가 먼저입니다.',
    tone: 'blue',
  },
  LITE: {
    label: '작게 시작',
    desc: '전체를 바꾸기보다, 반복되는 일이나 끊기는 구간부터 작게 고치길 권합니다.',
    headline: '작게 시작하는 게 맞아요.',
    tone: 'amber',
  },
  FULL: {
    label: '전면 구축 후보',
    desc: '우리 회사만의 일하는 방식을 시스템으로 만들고, AI 판단까지 붙일 가치가 큰 상태예요.',
    headline: '전면 구축을 검토할 가치가 큰 회사입니다.',
    tone: 'orange',
  },
  HIGH: {
    label: '최우선 검토',
    desc: '업무가 복잡하고 대표님 의존이 크며, 쌓인 데이터를 활용할 여지도 큰 상태입니다.',
    headline: '지금 AX를 우선 검토해 볼 때예요.',
    tone: 'red',
  },
}

// 문제 카드 문안 — 질문별 (문제 / 왜 문제인지 / 그대로 두면)
const PROBLEM_COPY: Record<string, { title: string; why: string; ifIgnored: string }> = {
  repeatInput: {
    title: '같은 정보를 여러 곳에 반복 입력',
    why: '옮겨 적을수록 오타와 빠뜨림이 늘어요. 직원 시간도 일이 아니라 옮겨 적기에 쓰입니다.',
    ifIgnored: '거래가 늘면 입력도 같이 늘어요. 사람을 더 뽑아도 해결되지 않습니다.',
  },
  askProgress: {
    title: '진행 상황을 직접 물어봐야 알 수 있음',
    why: '진행 상황이 사람 머릿속에만 있으면, 확인하는 것 자체가 일이 돼요.',
    ifIgnored: '대표님이 자리를 비우면 회사 일도 같이 멈춥니다.',
  },
  toolGaps: {
    title: '엑셀, 카톡, 전화, ERP 사이에서 일이 끊김',
    why: '도구 사이 빈틈은 사람이 손으로 메워요. 실수도 바로 그 빈틈에서 납니다.',
    ifIgnored: '회사 전체를 한눈에 보여 주는 곳이 없어, 판단이 늦어져요.',
  },
  manualHandoff: {
    title: '고객 요청과 주문, 예약을 사람이 직접 전달',
    why: '고객 응대와 내부 업무가 끊겨 있으면, 답이 빠르고 정확한지가 담당자 사정에 달려요.',
    ifIgnored: '고객이 늘수록 빠뜨린 전달과 늦은 답변도 같이 늘어납니다.',
  },
  missDelay: {
    title: '빠뜨리거나 늦어져 다시 확인하는 일이 반복',
    why: '시스템이 알려 주지 않으니, 사람이 기억으로 막고 있다는 신호예요.',
    ifIgnored: '다시 확인하는 시간이 실제로 일할 시간을 계속 잡아먹습니다.',
  },
  priorityByMemory: {
    title: '무엇부터 할지 담당자의 경험과 기억에 의존',
    why: '먼저 할 일을 정하는 기준이 사람마다 다르면, 결과도 사람마다 달라져요.',
    ifIgnored: '담당자가 바뀌면 판단 기준도 함께 사라집니다.',
  },
  dataUnused: {
    title: '데이터는 있는데 결정할 때 쓰지 못함',
    why: '쌓인 기록이 판단에 쓰이지 않으면, 데이터는 재산이 아니라 보관 비용일 뿐이에요.',
    ifIgnored: '감으로 내린 결정이 맞았는지 확인할 방법이 계속 없습니다.',
  },
  ceoLoadGrows: {
    title: '회사가 커질수록 대표님과 관리자가 확인할 일도 늘어남',
    why: '회사가 클수록 대표님이 더 바빠진다면, 시스템이 할 일을 대표님이 대신 하고 있는 거예요.',
    ifIgnored: '매출 두 배가 대표 업무 두 배로 돌아옵니다.',
  },
  uniqueWork: {
    title: '기존 ERP·POS·SaaS로는 안 되는 우리 회사만의 일',
    why: '우리 회사만의 일은 시중 프로그램이 못 채운 자리예요. 그 자리가 경쟁력이면서, 일이 막히는 곳입니다.',
    ifIgnored: '계속 사람 손으로 처리하면 그 노하우가 회사에 남지 않아요.',
  },
}

// 권장 AX 방향 — 문제 묶음별 한 줄
type Cluster = { id: string; qs: string[]; point: string }
const CLUSTERS: Cluster[] = [
  { id: 'connect', qs: ['repeatInput', 'toolGaps'], point: '여러 곳에 나눠 하던 입력을 한 번으로 모으기' },
  { id: 'visibility', qs: ['askProgress', 'ceoLoadGrows'], point: '묻지 않아도 진행 상황이 먼저 보이는 운영 화면' },
  { id: 'customer', qs: ['manualHandoff'], point: '고객 요청과 주문, 예약이 내부 업무로 자동으로 이어지는 접수 흐름' },
  { id: 'judgment', qs: ['missDelay', 'priorityByMemory'], point: '놓칠 위험과 먼저 할 일, 다음 할 일을 AI가 먼저 알려 주는 구조' },
  { id: 'data', qs: ['dataUnused'], point: '쌓인 데이터를 결정에 쓰는 우리 회사 전용 현황판(대시보드)' },
  { id: 'unique', qs: ['uniqueWork'], point: '시중 프로그램이 못 채운 우리 회사만의 일을 전용 시스템으로' },
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
          title: '새로 만들기보다 정리부터 하세요',
          points: [
            '엑셀, 카톡, ERP가 각각 어떤 일을 맡는지부터 정리해요.',
            '반복 입력이나 확인할 일이 눈에 띄게 늘면, 그때 작게 시작할 범위를 검토합니다.',
          ],
        }
      : grade === 'LITE'
        ? {
            title: '가장 자주 끊기는 곳부터 작게 시작하세요',
            points: [...clusterPoints, '전체가 아니라, 가장 자주 끊기는 한 구간부터 이어요.'],
          }
        : grade === 'FULL'
          ? {
              title: '우리 회사만의 업무 흐름을 시스템으로 만들어 보세요',
              points: [...clusterPoints, 'AI가 위험과 우선순위, 다음 할 일을 알려 줄 업무를 함께 고릅니다.'],
            }
          : {
              title: '전면 구축 설계를 먼저 검토해 보세요',
              points: [...clusterPoints, '대표님 확인을 줄이는 운영 화면과 AI 판단 구조를 함께 설계해요.'],
            }

  // 내부 담당자 준비 상태
  const owner = answers['internalOwner']
  const readiness =
    owner === 'dedicated'
      ? { label: '전담자 있음', note: '함께 쓸 담당자가 있어, 만든 뒤 빨리 자리 잡을 수 있어요.' }
      : owner === 'partTime'
        ? { label: '겸임 담당자 있음', note: '겸임 담당자로도 시작할 수 있어요. 처음엔 대표님과 언제 함께 확인할지 정해 두세요.' }
        : owner === 'ceo'
          ? { label: '대표가 직접', note: '대표님이 직접 쓰며 시작해도 됩니다. 자리 잡을 즈음엔 맡을 담당자를 정해 두세요.' }
          : { label: '아직 없음', note: '함께 쓸 담당자를 정하는 것이 첫 준비입니다.' }

  // 다음 행동
  const nextActions =
    grade === 'NO_GO'
      ? ['지금 쓰는 도구를 정리하고, 반복 입력이 늘면 다시 진단해 보세요.', '필요하면 상담에서 지금 도구 구성만 짧게 점검해 드려요.']
      : grade === 'LITE'
        ? ['가장 자주 끊기는 구간 1개를 정하고, 작게 시작할 범위를 상담에서 확인하세요.', '함께 쓸 담당자를 먼저 정해 두면 진행이 빨라져요.']
        : grade === 'FULL'
          ? ['상담은 AX Blueprint부터 시작하세요. 사업과 업무를 분석해, 무엇부터 어디까지 만들지와 성과 지표(KPI)를 정합니다.', '1차 AX Build는 효과가 가장 큰 핵심 업무 하나로 시작해요.']
          : ['AX Fit 상담을 신청해, 사업과 업무 분석 일정부터 잡으세요.', '1차 구축은 대표님 확인 일을 줄이는 운영 화면부터 검토합니다.']
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
