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
//  - NO-GO            : 점수 35 미만
//  - LITE AX          : 35~54, 또는 고유 업무가 약해(9번 ≤ 1) 기성 도구로 해결될 가능성이 큰 경우(점수 70 미만)
//  - FULL AX CANDIDATE: 55 이상이고 고유 업무가 분명한 경우
//  - HIGH PRIORITY    : 75 이상 + 고유 업무 분명 + 대표 의존(2·8번 합 ≥ 4) + 데이터 축적 가능성(7번 ≥ 2)
import type { AxFitGrade, AxFitProblem, AxFitReport, DiagnosisAnswers, SeverityTone } from '../types/businessDiagnosis'
import { DEGREE_VALUE, DIAGNOSIS_VERSION, OWNER_VALUE } from '../data/businessDiagnosisQuestions'

const PROBLEM_IDS = ['repeatInput', 'askProgress', 'toolGaps', 'manualHandoff', 'missDelay', 'priorityByMemory', 'dataUnused', 'ceoLoadGrows'] as const

const val = (a: DiagnosisAnswers, id: string): number => {
  const v = a[id]
  return typeof v === 'string' ? (DEGREE_VALUE[v] ?? 0) : 0
}
const ownerVal = (a: DiagnosisAnswers): number => {
  const v = a['internalOwner']
  return typeof v === 'string' ? (OWNER_VALUE[v] ?? 0) : 0
}

/** 5점 단위 반올림 — 가짜 정밀도를 만들지 않는다 */
const round5 = (n: number) => Math.max(0, Math.min(100, Math.round(n / 5) * 5))

export const GRADE_META: Record<AxFitGrade, { label: string; desc: string; headline: string; tone: SeverityTone }> = {
  NO_GO: {
    label: 'NO-GO',
    desc: '현재는 별도 AX 구축보다 기존 업무와 도구를 먼저 정리하는 편이 적합합니다.',
    headline: '지금은 AX 구축보다 정리가 먼저입니다.',
    tone: 'blue',
  },
  LITE: {
    label: 'LITE AX',
    desc: '전체 시스템보다 일부 반복업무 또는 연결구간부터 작게 개선하는 것을 권장합니다.',
    headline: '작게 시작하는 Lite AX가 맞습니다.',
    tone: 'amber',
  },
  FULL: {
    label: 'FULL AX CANDIDATE',
    desc: '회사 고유의 업무흐름을 시스템화하고 AI 판단을 연결할 가치가 높은 상태입니다.',
    headline: 'Full AX를 검토할 가치가 높은 회사입니다.',
    tone: 'orange',
  },
  HIGH: {
    label: 'HIGH PRIORITY',
    desc: '업무복잡도·대표 의존·데이터 축적 가능성을 볼 때 우선적으로 AX를 검토할 가치가 높습니다.',
    headline: '우선적으로 AX를 검토할 가치가 높습니다.',
    tone: 'red',
  },
}

// 문제 카드 문안 — 질문별 (문제 / 왜 문제인지 / 그대로 두면)
const PROBLEM_COPY: Record<string, { title: string; why: string; ifIgnored: string }> = {
  repeatInput: {
    title: '같은 정보를 여러 곳에 반복 입력',
    why: '입력이 반복되면 오타와 누락이 늘고, 직원 시간이 일이 아니라 옮겨 적기에 쓰입니다.',
    ifIgnored: '거래량이 늘수록 반복 입력도 함께 늘어, 사람을 더 뽑아도 해결되지 않습니다.',
  },
  askProgress: {
    title: '진행상황을 대표·관리자가 직접 물어봐야 파악',
    why: '진행상황이 사람 머릿속에만 있으면 확인하는 일 자체가 업무가 됩니다.',
    ifIgnored: '대표가 자리를 비우면 회사의 흐름도 같이 멈춥니다.',
  },
  toolGaps: {
    title: 'Excel·카톡·전화·ERP 사이에서 업무가 끊김',
    why: '도구 사이의 빈 구간은 늘 사람이 손으로 메우고, 실수는 바로 그 구간에서 납니다.',
    ifIgnored: '어떤 도구도 회사 전체를 보여주지 못해 판단이 늦어집니다.',
  },
  manualHandoff: {
    title: '고객 요청·주문·예약이 내부로 수동 전달',
    why: '고객 접점과 내부 업무가 끊겨 있으면 응답 속도와 정확도가 담당자 상황에 좌우됩니다.',
    ifIgnored: '고객이 늘수록 전달 누락과 응답 지연이 함께 늘어납니다.',
  },
  missDelay: {
    title: '업무 누락·지연·재확인이 반복',
    why: '누락과 재확인은 시스템이 알려주지 않아 사람이 기억으로 막고 있다는 신호입니다.',
    ifIgnored: '재확인에 쓰는 시간이 실제 업무 시간을 계속 잠식합니다.',
  },
  priorityByMemory: {
    title: '우선순위가 담당자의 경험·기억에 의존',
    why: '무엇을 먼저 할지 정하는 기준이 사람마다 다르면 결과도 사람마다 달라집니다.',
    ifIgnored: '담당자가 바뀌면 판단 기준도 함께 사라집니다.',
  },
  dataUnused: {
    title: '데이터는 있지만 의사결정에 쓰지 못함',
    why: '쌓인 기록이 판단으로 이어지지 않으면 데이터는 자산이 아니라 저장 비용입니다.',
    ifIgnored: '감으로 내린 결정이 맞았는지 확인할 방법이 계속 없습니다.',
  },
  ceoLoadGrows: {
    title: '규모가 커질수록 대표·관리자 확인업무가 증가',
    why: '성장할수록 대표가 더 바빠진다면, 회사가 아니라 대표가 시스템 역할을 하고 있는 것입니다.',
    ifIgnored: '매출 두 배가 대표 업무 두 배로 돌아옵니다.',
  },
  uniqueWork: {
    title: '기성 ERP·POS·SaaS로 해결되지 않는 고유 업무',
    why: '회사 고유의 업무는 기성 솔루션이 비워둔 자리이고, 그 자리가 경쟁력이자 병목입니다.',
    ifIgnored: '고유 업무를 계속 사람 손으로 처리하면 그 노하우가 회사에 남지 않습니다.',
  },
}

// 권장 AX 방향 — 문제 묶음별 한 줄
type Cluster = { id: string; qs: string[]; point: string }
const CLUSTERS: Cluster[] = [
  { id: 'connect', qs: ['repeatInput', 'toolGaps'], point: '여러 곳에 흩어진 입력을 한 번으로 모으는 업무 연결 구간' },
  { id: 'visibility', qs: ['askProgress', 'ceoLoadGrows'], point: '대표가 묻지 않아도 진행상황이 먼저 보이는 운영 화면' },
  { id: 'customer', qs: ['manualHandoff'], point: '고객 요청·주문·예약이 내부 업무로 자동 연결되는 접수·처리 흐름' },
  { id: 'judgment', qs: ['missDelay', 'priorityByMemory'], point: '위험·우선순위·다음 행동을 AI가 먼저 표시하는 판단 구조' },
  { id: 'data', qs: ['dataUnused'], point: '쌓인 데이터를 의사결정에 쓰는 회사 전용 대시보드' },
  { id: 'unique', qs: ['uniqueWork'], point: '기성 솔루션이 비워둔 회사 고유 업무의 전용 시스템화' },
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
  const ranked = [...PROBLEM_IDS, 'uniqueWork']
    .map((id, i) => ({ id, i, v: val(answers, id) }))
    .filter((x) => x.v >= 1)
    .sort((x, y) => y.v - x.v || x.i - y.i)
    .slice(0, 3)
  const topProblems: AxFitProblem[] = ranked.map((x, idx) => ({
    rank: idx + 1,
    questionId: x.id,
    ...PROBLEM_COPY[x.id],
    tone: idx === 0 ? 'orange' : 'amber',
  }))

  // 권장 AX 방향
  const clusterPoints = topClusterPoints(answers, 2)
  const direction =
    grade === 'NO_GO'
      ? {
          title: '지금은 구축보다 정리',
          points: [
            '지금 쓰는 도구(엑셀·카톡·ERP)가 각각 무엇을 맡는지 역할부터 정리합니다.',
            '반복 입력이나 확인 업무가 눈에 띄게 늘어나는 시점에 Lite AX부터 검토합니다.',
          ],
        }
      : grade === 'LITE'
        ? {
            title: 'Lite AX — 가장 자주 끊기는 구간부터 작게',
            points: [...clusterPoints, '전체 시스템이 아니라 가장 자주 끊기는 한 구간부터 연결합니다.'],
          }
        : grade === 'FULL'
          ? {
              title: 'Full AX 후보 — 회사 고유 업무흐름의 시스템화',
              points: [...clusterPoints, 'AI 판단(위험·우선순위·다음 행동)을 붙일 업무를 함께 선정합니다.'],
            }
          : {
              title: '우선 검토 — Full AX 설계',
              points: [...clusterPoints, '대표 의존을 줄이는 운영 화면과 AI 판단 구조를 함께 설계합니다.'],
            }

  // 내부 담당자 준비 상태
  const owner = answers['internalOwner']
  const readiness =
    owner === 'dedicated'
      ? { label: '내부 담당자 있음', note: '함께 쓸 담당자가 있어 구축 후 정착 속도가 빠릅니다.' }
      : owner === 'partTime'
        ? { label: '겸임 담당자 있음', note: '겸임 담당자로 시작할 수 있습니다. 초기에는 대표와 함께 확인하는 주기를 정해두세요.' }
        : owner === 'ceo'
          ? { label: '대표가 직접', note: '대표가 직접 쓰는 것으로 시작하되, 정착 단계에서 맡을 내부 담당자를 정해두는 것이 좋습니다.' }
          : { label: '담당자 미정', note: '실제로 함께 사용할 내부 담당자를 정하는 것이 첫 준비입니다.' }

  // 다음 행동
  const nextActions =
    grade === 'NO_GO'
      ? ['지금 쓰는 도구를 정리하고, 반복 입력이 늘어나는 시점에 다시 진단해 보세요.', '필요하면 상담으로 현재 도구 구성만 짧게 점검할 수 있습니다.']
      : grade === 'LITE'
        ? ['가장 자주 끊기는 업무 구간 1개를 정해, Lite AX 범위를 상담으로 확인하세요.', '내부에서 함께 쓸 담당자를 먼저 정해두면 진행이 빨라집니다.']
        : grade === 'FULL'
          ? ['AX Blueprint(사업·업무 분석, AX 우선순위, 구축범위, KPI 설계)부터 상담으로 시작하세요.', '1차 AX Build는 효과가 가장 큰 핵심업무 하나로 시작합니다.']
          : ['AX Fit 상담을 신청해 사업·업무 분석 일정을 먼저 잡으세요.', '대표 확인 업무를 줄이는 운영 화면부터 1차 구축 범위로 검토합니다.']
  if (owner === 'none' || owner === 'ceo') nextActions.push(readiness.note)

  return {
    version: DIAGNOSIS_VERSION,
    grade,
    gradeLabel: meta.label,
    gradeDesc: meta.desc,
    score,
    headline: meta.headline,
    summary: meta.desc,
    topProblems,
    direction,
    nextActions,
    readiness,
  }
}
