// 퀘스트형 기업 성장진단 — 질문 데이터 (화면 로직과 분리).
// v3(점진형): 1단계 기초체력 → 2단계 자금·지원제도 → 3단계 인증·인프라.
//   각 단계는 독립적으로 결과를 낼 수 있고, 원하는 대표만 다음 단계로 진행합니다.
// 질문을 추가/수정할 때 이 파일만 고치면 됩니다. showIf 로 분기(생략) 처리.
import type { DiagnosisAnswers, DiagnosisQuestion, DiagnosisStage, InlineFeedback } from '../types/businessDiagnosis'

// v4: 실시간 현황·결과 기록·문제중심 보고서 (질문 구조 호환 → v3 답변은 이관 유지)
export const DIAGNOSIS_VERSION = 4

export const STAGE_INFO: Record<DiagnosisStage, { name: string; copy: string }> = {
  1: { name: '기업 기초체력', copy: '먼저 우리 회사의 현재 상태를 1분 만에 확인해볼게요.' },
  2: { name: '자금·지원제도', copy: '지금 더 급한 목표를 골라주시면, 딱 필요한 질문만 여쭤볼게요.' },
  3: { name: '인증·성장 인프라', copy: '인증과 홈페이지·업무시스템까지 회사의 성장 기반을 점검해볼게요.' },
}

const one = (a: DiagnosisAnswers, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)

export const isFounderToBe = (a: DiagnosisAnswers) => one(a, 'bizType') === 'pre'
export const isIndividual = (a: DiagnosisAnswers) => one(a, 'bizType') === 'individual'
export const isCorp = (a: DiagnosisAnswers) => one(a, 'bizType') === 'corp'
export const noFundingNeed = (a: DiagnosisAnswers) => one(a, 'fundingWhen') === 'none'
export const hasArrears = (a: DiagnosisAnswers) => one(a, 'taxArrears') === 'yes'
const isMature = (a: DiagnosisAnswers) => ['y3to7', 'y7plus'].includes(one(a, 'years') ?? '')
/** 2단계 투트랙: 돈 받기(fund/both) / 나가는 돈 줄이기(save/both) */
export const wantsMoneyIn = (a: DiagnosisAnswers) => one(a, 'goal') !== 'save'
export const wantsMoneyOut = (a: DiagnosisAnswers) => ['save', 'both'].includes(one(a, 'goal') ?? '')

export const questions: DiagnosisQuestion[] = [
  // ── 1단계: 기업 기초체력 (약 1분) ─────────────────────────────
  {
    id: 'bizType',
    stage: 1,
    type: 'single',
    title: '현재 사업 상태를 알려주세요',
    options: [
      { value: 'individual', label: '개인사업자' },
      { value: 'corp', label: '법인사업자' },
      { value: 'pre', label: '예비창업자', desc: '아직 사업자등록 전이에요' },
    ],
  },
  {
    id: 'industry',
    stage: 1,
    type: 'single',
    title: '어떤 업종에 가까우신가요?',
    options: [
      { value: 'manufacture', label: '제조업' },
      { value: 'retail', label: '도소매업' },
      { value: 'service', label: '서비스업' },
      { value: 'construction', label: '건설업' },
      { value: 'it', label: 'IT·소프트웨어' },
      { value: 'medical', label: '병원·요양·의료 관련' },
      { value: 'logistics', label: '운수·물류' },
      { value: 'professional', label: '전문직' },
      { value: 'etc', label: '기타' },
    ],
  },
  {
    id: 'years',
    stage: 1,
    type: 'single',
    title: '사업을 시작한 지 얼마나 되셨나요?',
    options: [
      { value: 'pre', label: '창업 전' },
      { value: 'lt1', label: '1년 미만' },
      { value: 'y1to3', label: '1년 이상 3년 미만' },
      { value: 'y3to7', label: '3년 이상 7년 미만' },
      { value: 'y7plus', label: '7년 이상' },
    ],
  },
  {
    id: 'revenue',
    stage: 1,
    type: 'single',
    title: '최근 연매출은 어느 정도인가요?',
    desc: '대략적인 범위면 충분해요.',
    options: [
      { value: 'none', label: '매출 없음' },
      { value: 'lt1', label: '1억원 미만' },
      { value: 'r1to5', label: '1억원 이상 5억원 미만' },
      { value: 'r5to10', label: '5억원 이상 10억원 미만' },
      { value: 'r10to30', label: '10억원 이상 30억원 미만' },
      { value: 'r30plus', label: '30억원 이상' },
    ],
  },
  {
    id: 'employees',
    stage: 1,
    type: 'single',
    title: '현재 직원은 몇 명인가요?',
    desc: '대표님 본인은 제외하고 알려주세요.',
    options: [
      { value: 'none', label: '없음' },
      { value: 'e1to4', label: '1~4명' },
      { value: 'e5to9', label: '5~9명' },
      { value: 'e10to29', label: '10~29명' },
      { value: 'e30plus', label: '30명 이상' },
    ],
  },
  {
    id: 'operatingProfit',
    stage: 1,
    type: 'single',
    title: '최근 결산에서 이익 상황은 어땠나요?',
    desc: '정확하지 않아도 대략 알려주세요.',
    options: [
      { value: 'profit', label: '이익이 났어요' },
      { value: 'breakeven', label: '겨우 본전 수준이에요' },
      { value: 'loss', label: '손해를 봤어요' },
      { value: 'notClosed', label: '아직 결산 전이에요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'concerns',
    stage: 1,
    type: 'multi',
    title: '요즘 가장 큰 고민은 무엇인가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    exclusiveValues: ['unknown'],
    options: [
      { value: 'workingCapital', label: '운전자금' },
      { value: 'facility', label: '시설·장비 구입' },
      { value: 'hiring', label: '신규채용' },
      { value: 'tax', label: '세금 부담' },
      { value: 'govSupport', label: '정부지원사업' },
      { value: 'certification', label: '기업인증' },
      { value: 'bigDeal', label: '대기업 거래·입찰' },
      { value: 'online', label: '홈페이지·온라인 영업' },
      { value: 'manualWork', label: '반복업무·수기관리' },
      { value: 'unknown', label: '아직 무엇이 필요한지 모르겠음' },
    ],
  },
  {
    id: 'taxArrears',
    stage: 1,
    type: 'single',
    title: '국세·지방세 체납이 있으신가요?',
    desc: '솔직하게 답할수록 더 정확한 방향을 안내드릴 수 있어요.',
    options: [
      { value: 'no', label: '없어요' },
      { value: 'paying', label: '지금 나눠서 갚고 있어요' },
      { value: 'yes', label: '있어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'consultTiming',
    stage: 1,
    type: 'single',
    title: '결과를 보고 상담도 받아보고 싶으세요?',
    desc: '부담 없이 골라주세요. 지금 정하지 않아도 괜찮아요.',
    options: [
      { value: 'now', label: '네, 바로 상담받고 싶어요' },
      { value: 'm1', label: '한 달 안에는 받아볼래요' },
      { value: 'm3', label: '3개월 안에 생각해볼게요' },
      { value: 'infoOnly', label: '지금은 결과만 볼래요' },
    ],
  },

  // ── 2단계: 목표 투트랙 — 돈 받기 / 나가는 돈 줄이기 / 둘 다 ──────
  {
    id: 'goal',
    stage: 2,
    type: 'single',
    title: '대표님, 지금 회사에 더 급한 쪽은 어디인가요?',
    desc: '선택에 따라 꼭 필요한 질문만 여쭤볼게요.',
    options: [
      { value: 'fund', label: '💰 돈을 받고 싶어요', desc: '정책자금 대출 · 고용지원금 · 정부지원사업' },
      { value: 'save', label: '📉 나가는 돈을 줄이고 싶어요', desc: '세금 · 인건비 · 반복업무 비용' },
      { value: 'both', label: '🙌 둘 다 원해요', desc: '받을 건 받고, 줄일 건 줄이고' },
    ],
  },
  // 절세 트랙 (save/both)
  {
    id: 'taxBurden',
    stage: 2,
    type: 'single',
    title: '요즘 세금 부담은 어느 정도로 느끼세요?',
    showIf: (a) => wantsMoneyOut(a),
    options: [
      { value: 'heavy', label: '너무 많이 나가서 부담돼요' },
      { value: 'some', label: '줄일 수 있으면 줄이고 싶어요' },
      { value: 'unsure', label: '얼마나 줄일 수 있는지 잘 모르겠어요' },
      { value: 'ok', label: '지금은 크게 부담되지 않아요' },
    ],
  },
  {
    id: 'taxSaveInterest',
    stage: 2,
    type: 'multi',
    title: '들어봤거나 관심 있는 절세 방법이 있나요?',
    desc: '해당하는 것을 모두 골라주세요.',
    showIf: (a) => wantsMoneyOut(a),
    exclusiveValues: ['none'],
    options: [
      { value: 'rnd', label: '기업부설연구소 R&D 세액공제' },
      { value: 'ventureDeduct', label: '벤처투자 소득공제' },
      { value: 'certBenefit', label: '기업인증 세제·우대 혜택' },
      { value: 'none', label: '아직 잘 몰라요 — 그래서 진단이 필요해요' },
    ],
  },
  // 자금 트랙 (fund/both)
  {
    id: 'fundingWhen',
    stage: 2,
    type: 'single',
    showIf: (a) => wantsMoneyIn(a),
    title: '자금이 언제쯤 필요하신가요?',
    options: [
      { value: 'm1', label: '당장 1개월 이내' },
      { value: 'm3', label: '3개월 이내' },
      { value: 'm6', label: '6개월 이내' },
      { value: 'planning', label: '아직 계획 단계' },
      { value: 'none', label: '자금은 필요 없어요' },
    ],
  },
  {
    id: 'fundingPurpose',
    stage: 2,
    type: 'multi',
    title: '자금이 필요한 이유는 무엇인가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    showIf: (a) => wantsMoneyIn(a) && !noFundingNeed(a),
    exclusiveValues: ['unknown'],
    options: [
      { value: 'working', label: '인건비·임차료 등 운영비' },
      { value: 'machine', label: '기계·장비 구입' },
      { value: 'realestate', label: '사업장 구입·확장' },
      { value: 'material', label: '원재료 매입' },
      { value: 'newBiz', label: '신규사업 투자' },
      { value: 'refinance', label: '비싼 대출을 낮은 이자로 갈아타기' },
      { value: 'unknown', label: '아직 정확히 모르겠어요' },
    ],
  },
  {
    id: 'fundingScale',
    stage: 2,
    type: 'single',
    title: '어느 정도 규모의 자금을 생각하세요?',
    desc: '정확하지 않아도 괜찮아요. 대략적인 범위로 골라주세요.',
    showIf: (a) => wantsMoneyIn(a) && !noFundingNeed(a),
    options: [
      { value: 'lt50', label: '5천만원 미만' },
      { value: 's50to100', label: '5천만원 ~ 1억원' },
      { value: 's100to300', label: '1억원 ~ 3억원' },
      { value: 's300plus', label: '3억원 이상' },
      { value: 'unsure', label: '아직 잘 모르겠어요' },
    ],
  },
  {
    id: 'existingLoans',
    showIf: (a) => wantsMoneyIn(a),
    stage: 2,
    type: 'single',
    title: '지금 이용 중인 대출이나 정책자금이 있으신가요?',
    options: [
      { value: 'policy', label: '정책자금을 이용 중이에요' },
      { value: 'bank', label: '은행 대출만 있어요' },
      { value: 'both', label: '둘 다 있어요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'highRateLoan',
    stage: 2,
    type: 'single',
    title: '이자가 높은 대출(카드론·2금융 등)을 쓰고 계신가요?',
    showIf: (a) => ['bank', 'both', 'policy'].includes(one(a, 'existingLoans') ?? ''),
    options: [
      { value: 'yes', label: '네, 있어요' },
      { value: 'little', label: '조금 있어요' },
      { value: 'no', label: '아니요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'financials',
    stage: 2,
    type: 'single',
    title: '최근 재무제표(결산자료)를 가지고 계신가요?',
    desc: '세무사·회계사가 만들어준 자료도 포함이에요.',
    options: [
      { value: 'recent', label: '최근 자료가 있어요' },
      { value: 'old', label: '예전 자료만 있어요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'bizPlan',
    stage: 2,
    type: 'single',
    title: '사업계획서를 가지고 계신가요?',
    options: [
      { value: 'recent', label: '최신 사업계획서가 있어요' },
      { value: 'old', label: '예전에 만든 것만 있어요' },
      { value: 'simple', label: '간단한 메모 수준이에요' },
      { value: 'none', label: '없어요' },
    ],
  },
  {
    id: 'companyIntro',
    stage: 2,
    type: 'single',
    title: '회사 소개자료(회사소개서·제안서)가 있으신가요?',
    options: [
      { value: 'good', label: '잘 정리된 자료가 있어요' },
      { value: 'simple', label: '간단한 소개자료만 있어요' },
      { value: 'none', label: '없어요' },
    ],
  },
  {
    id: 'govExperience',
    showIf: (a) => wantsMoneyIn(a),
    stage: 2,
    type: 'single',
    title: '정부지원사업을 신청해본 적 있으신가요?',
    options: [
      { value: 'won', label: '선정된 적 있어요' },
      { value: 'applied', label: '신청했지만 안 됐어요' },
      { value: 'prepared', label: '준비만 해봤어요' },
      { value: 'never', label: '신청해본 적 없어요' },
    ],
  },
  {
    id: 'hiring',
    showIf: (a) => wantsMoneyIn(a),
    stage: 2,
    type: 'single',
    title: '채용과 관련해 지금 상황은 어떠신가요?',
    options: [
      { value: 'recent', label: '최근 직원을 새로 뽑았어요' },
      { value: 'plan6m', label: '6개월 안에 뽑을 계획이에요' },
      { value: 'parental', label: '육아휴직·대체인력 대상이 있어요' },
      { value: 'retention', label: '기존 직원 유지가 고민이에요' },
      { value: 'na', label: '해당 없어요' },
    ],
  },

  // ── 3단계: 인증·성장 인프라 정밀진단 ─────────────────────────────
  {
    id: 'website',
    stage: 3,
    type: 'single',
    title: '회사 홈페이지가 있으신가요?',
    options: [
      { value: 'good', label: '모바일까지 잘 되는 홈페이지가 있어요' },
      { value: 'old', label: '있긴 한데 오래됐어요' },
      { value: 'snsOnly', label: 'SNS·블로그만 있어요' },
      { value: 'none', label: '없어요' },
    ],
  },
  {
    id: 'workflow',
    stage: 3,
    type: 'single',
    title: '회사 업무는 주로 어떻게 관리하시나요?',
    options: [
      { value: 'system', label: '전용 시스템으로 한번에 관리해요' },
      { value: 'excel', label: '엑셀 위주로 관리해요' },
      { value: 'kakao', label: '카카오톡·메신저 위주예요' },
      { value: 'paper', label: '수기·종이 위주예요' },
      { value: 'scattered', label: '여기저기 흩어져 있어요' },
    ],
  },
  {
    id: 'repetitiveWork',
    stage: 3,
    type: 'single',
    title: '매일 반복되는 단순 업무가 많은 편인가요?',
    desc: '입력·정리·문자발송 같은 반복작업이요.',
    options: [
      { value: 'lots', label: '많아요, 시간이 꽤 들어요' },
      { value: 'some', label: '어느 정도 있어요' },
      { value: 'little', label: '많지 않아요' },
      { value: 'unsure', label: '생각해본 적 없어요' },
    ],
  },
  {
    id: 'repetitiveTime',
    stage: 3,
    type: 'single',
    title: '같은 내용을 여러 번 입력하는 업무에 하루 몇 시간이나 쓰시나요?',
    desc: '대략적인 느낌이면 충분해요.',
    // 반복업무가 있거나 업무가 흩어진 경우에만
    showIf: (a) => ['lots', 'some'].includes(one(a, 'repetitiveWork') ?? '') || ['excel', 'kakao', 'paper', 'scattered'].includes(one(a, 'workflow') ?? ''),
    options: [
      { value: 'none', label: '거의 없어요' },
      { value: 'lt30', label: '하루 30분 미만' },
      { value: 'm30to60', label: '하루 30분~1시간' },
      { value: 'h1to2', label: '하루 1~2시간' },
      { value: 'h2plus', label: '하루 2시간 이상' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'ipRights',
    stage: 3,
    type: 'single',
    title: '최근 3년 안에 등록한 특허·실용신안이 있으신가요?',
    desc: '신청(출원)만 한 것과 등록이 끝난 것은 구분해주세요.',
    showIf: (a) => !isFounderToBe(a),
    options: [
      { value: 'patent', label: '등록 특허가 있어요' },
      { value: 'utility', label: '등록 실용신안·디자인이 있어요' },
      { value: 'filed', label: '신청(출원)만 했어요', desc: '아직 등록 전이에요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'researchLab',
    stage: 3,
    type: 'single',
    title: '기업부설연구소나 연구개발전담부서가 있으신가요?',
    showIf: (a) => !isFounderToBe(a),
    options: [
      { value: 'lab', label: '기업부설연구소가 있어요' },
      { value: 'dept', label: '연구개발전담부서가 있어요' },
      { value: 'preparing', label: '만드는 중이에요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'venture',
    stage: 3,
    type: 'single',
    title: '벤처기업확인을 받으셨나요?',
    showIf: (a) => !isFounderToBe(a),
    options: [
      { value: 'have', label: '받았어요' },
      { value: 'preparing', label: '준비 중이에요' },
      { value: 'expired', label: '예전에 받았는데 만료됐어요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'rndRatio',
    stage: 3,
    type: 'single',
    title: '연구개발비를 매출의 5% 이상 쓰고 계신가요?',
    desc: '정확히 몰라도 괜찮아요. 대략적으로 골라주세요.',
    showIf: (a) => !isFounderToBe(a) && one(a, 'revenue') !== 'none',
    options: [
      { value: 'ge5', label: '5% 이상 쓰는 것 같아요' },
      { value: 'lt5', label: '5%보다 적어요' },
      { value: 'notManaged', label: '따로 관리하지 않아요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'newProduct',
    stage: 3,
    type: 'single',
    title: '최근 새로 개발한 제품·서비스가 있으신가요?',
    showIf: (a) => !isFounderToBe(a),
    options: [
      { value: 'launched3y', label: '최근 3년 안에 출시했어요' },
      { value: 'developing', label: '지금 개발 중이에요' },
      { value: 'planned', label: '계획만 있어요' },
      { value: 'none', label: '없어요' },
      { value: 'na', label: '해당 없어요' },
    ],
  },
  {
    id: 'mainbiz',
    stage: 3,
    type: 'single',
    title: '메인비즈(경영혁신형) 인증이 있으신가요?',
    showIf: (a) => !isFounderToBe(a) && isMature(a),
    options: [
      { value: 'have', label: '있어요' },
      { value: 'preparing', label: '준비 중이에요' },
      { value: 'expired', label: '만료됐어요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'innobiz',
    stage: 3,
    type: 'single',
    title: '이노비즈(기술혁신형) 인증이 있으신가요?',
    showIf: (a) => !isFounderToBe(a) && isMature(a),
    options: [
      { value: 'have', label: '있어요' },
      { value: 'preparing', label: '준비 중이에요' },
      { value: 'expired', label: '만료됐어요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'iso',
    stage: 3,
    type: 'multi',
    title: 'ISO 인증을 가지고 계신가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    showIf: (a) => !isFounderToBe(a),
    exclusiveValues: ['none', 'unsure'],
    options: [
      { value: 'iso9001', label: 'ISO9001 (품질)' },
      { value: 'iso14001', label: 'ISO14001 (환경)' },
      { value: 'iso45001', label: 'ISO45001 (안전보건)' },
      { value: 'isoEtc', label: '기타 ISO' },
      { value: 'preparing', label: '준비 중이에요' },
      { value: 'none', label: '없어요' },
      { value: 'unsure', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'futurePlans',
    stage: 3,
    type: 'multi',
    title: '앞으로 어떤 계획이 있으신가요?',
    desc: '해당하는 것을 모두 골라주세요.',
    exclusiveValues: ['none'],
    options: [
      { value: 'bigCorp', label: '대기업 납품' },
      { value: 'bidding', label: '공공기관 입찰' },
      { value: 'export', label: '해외수출' },
      { value: 'invest', label: '투자유치' },
      { value: 'govSupport', label: '정부지원사업' },
      { value: 'newProduct', label: '신규 제품·서비스 개발' },
      { value: 'expand', label: '지점·사업장 확장' },
      { value: 'none', label: '특별한 계획 없어요' },
    ],
  },
]

/** 단계별 질문 (분기 반영) */
export function stageQuestions(stage: DiagnosisStage, answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => q.stage === stage && (!q.showIf || q.showIf(answers)))
}

/** 답변 직후 짧은 인라인 피드백 */
export function getInlineFeedback(questionId: string, answers: DiagnosisAnswers): InlineFeedback | null {
  const v = answers[questionId]
  if (questionId === 'taxArrears' && v === 'yes') {
    return { tone: 'warn', text: '자금보다 먼저 확인할 부분이 있어요. 결과에서 함께 안내해드릴게요.' }
  }
  if (questionId === 'taxArrears' && v === 'no') {
    return { tone: 'good', text: '좋아요. 자금을 알아보기 좋은 기본 조건이 갖춰져 있어요.' }
  }
  if (questionId === 'fundingWhen' && (v === 'm1' || v === 'm3')) {
    return { tone: 'info', text: '자금이 곧 필요하시군요. 준비 순서가 특히 중요해요.' }
  }
  if (questionId === 'govExperience' && v === 'won') {
    return { tone: 'good', text: '선정 경험은 다음 신청에도 큰 도움이 돼요.' }
  }
  return null
}

/** 전체 노출 질문 목록 (분기 반영) — 관리자/호환용 */
export function getVisibleQuestions(answers: DiagnosisAnswers): DiagnosisQuestion[] {
  return questions.filter((q) => !q.showIf || q.showIf(answers))
}
