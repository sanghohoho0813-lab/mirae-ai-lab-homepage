import { MAX_FREE_DAYS } from '../lib/trial-policy'

export type ToolStatus = 'MVP 베타' | '비공개 검토중' | '개발중'

export type SubStatus = '정식 출시 예정' | '내부 테스트중' | '현재 외부 공개 제한'

// 향후 회원 권한 기반 접근으로 확장하기 위한 접근 유형
export type AccessType = 'public' | 'beta' | 'restricted' | 'private' | 'comingSoon'

export type Tool = {
  id: string
  slug: string
  title: string
  category: string
  /** 컨설팅 업무 흐름 단계 (상담→분석→검토→제안→사후관리→재계약) */
  stage: string
  status: ToolStatus
  subStatus: SubStatus
  /** 향후 권한/체험 제어용 접근 유형 */
  accessType: AccessType
  /** 7일 무료 체험 대상 모듈 여부 */
  isTrialAvailable: boolean
  description: string
  /** 카드 하단 한 줄 가치 메시지 */
  valueLine: string
  url: string
  isPublic: boolean
  features: string[]
  /** 추천 대상 */
  target: string
  /** public/ 기준 썸네일 경로 (비공개 도구는 빈 값) */
  thumbnail: string
  /** 썸네일 정렬 위치 */
  thumbPos: 'top' | 'center'
}

export type UpcomingTool = {
  id: string
  title: string
  category: string
  description: string
}

export const tools: Tool[] = [
  {
    id: 'hr-subsidy-pro',
    slug: 'hr-subsidy-pro',
    title: '고용지원금 프로',
    category: '고용지원금',
    stage: '지원금 검토',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    accessType: 'beta',
    isTrialAvailable: true,
    description:
      '고객이 받을 수 있는 지원금을 놓치지 않게 챙겨, 더 많은 혜택을 제안할 수 있게 합니다. 입·퇴사와 회차 관리까지 자동으로.',
    valueLine: '놓친 지원금은, 놓친 제안입니다',
    url: 'https://hr-subsidy-pro.vercel.app/',
    isPublic: true,
    features: ['수급 가능액 자동 산정', '회차별 누락 방지', '입·퇴사 변동 관리', '고객 보고 자료화'],
    target: '컨설턴트 · 대표',
    thumbnail: '/thumbnails/hr-subsidy-pro.svg',
    thumbPos: 'top',
  },
  {
    id: 'labcare-rnd-os',
    slug: 'labcare-rnd-os',
    title: '연구소 사후관리 OS',
    category: '연구소 관리',
    stage: '사후관리',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    accessType: 'beta',
    isTrialAvailable: true,
    description:
      '사후관리·월간 알림·보고서까지 대신 챙겨, 고객이 “계속 관리받고 있다”고 느끼게 합니다. 자연스럽게 다음 제안 기회로 이어집니다.',
    valueLine: '관리받는 느낌이, 곧 재계약입니다',
    url: 'https://labcare-rnd-os.vercel.app/dashboard',
    isPublic: true,
    features: ['설립 준비 체크', '월간 관리 알림', '종합보고서 생성', '추가 컨설팅 제안'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/labcare-rnd-os.svg',
    thumbPos: 'top',
  },
  {
    id: 'corp-sales-os',
    slug: 'corp-sales-os',
    title: '법인컨설팅 세일즈 OS',
    category: '고객관리·영업',
    stage: '상담·제안 관리',
    status: 'MVP 베타',
    subStatus: '내부 테스트중',
    accessType: 'restricted',
    isTrialAvailable: true,
    description:
      '미팅 전략·잠재고객·후속관리·공고를 한 곳에. 흩어진 메모와 기억을 계약으로 바꾸는 컨설턴트 OS의 중심입니다.',
    valueLine: '계약률을 높이는 컨설턴트 전략 허브',
    url: 'https://corp-sales-os.vercel.app/',
    isPublic: true,
    features: ['미팅 전략 관리', '계약 실패 고객 후속관리', '콘텐츠·교육 아이디어', '최신 법령·공고 체크'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/corp-sales-os.svg',
    thumbPos: 'top',
  },
  {
    id: 'cretop-analyzer',
    slug: 'cretop-analyzer',
    title: '크레탑 자동분석기',
    category: '기업분석',
    stage: '기업 분석',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    accessType: 'beta',
    isTrialAvailable: true,
    description:
      '크레탑 자료를 올리면 핵심 지표·3개년 증감·미팅 주제까지 몇 초 만에. 미팅 전, 꺼낼 무기와 놓치던 제안거리를 찾아줍니다.',
    valueLine: '미팅 전에 꺼낼 무기를 몇 초 만에',
    url: 'https://corp-sales-os-git-claude-cretop-mini-app-ksh90813.vercel.app/mini.html',
    isPublic: true,
    features: ['3개년 증감 분석', '핵심 재무지표 정리', '추천 미팅 주제', '임시 가치평가'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/cretop-analyzer.png',
    thumbPos: 'top',
  },
  {
    id: 'stock-exit-simulator',
    slug: 'stock-exit-simulator',
    title: '주식 EXIT 솔루션 시뮬레이터',
    category: '자본거래',
    stage: '자본 전략',
    status: '비공개 검토중',
    subStatus: '현재 외부 공개 제한',
    accessType: 'private',
    isTrialAvailable: false,
    description:
      '이익소각·자사주·배당 등 EXIT 전략을 비교해, 대표의 복잡한 자본거래 결정을 한눈에 정리해 주는 도구입니다.',
    valueLine: '복잡한 자본거래 의사결정을 한눈에',
    url: 'https://stock-exit-simulator-a1vm.vercel.app/?review=1',
    isPublic: false,
    features: ['EXIT 전략 비교', '절세효과 시뮬레이션', '자본거래 시나리오', '의사결정 리포트'],
    target: '컨설턴트 · 대표',
    thumbnail: '',
    thumbPos: 'center',
  },
  {
    id: 'startup-tax-checker',
    slug: 'startup-tax-checker',
    title: '창업감면 & 취등록세 체크',
    category: '절세',
    stage: '절세 진단',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    accessType: 'beta',
    isTrialAvailable: true,
    description:
      '창업·지역·업종·나이 요건을 1분에 점검해, 고객 앞에서 바로 절세 가능성을 보여줍니다. 상담의 설득력이 달라집니다.',
    valueLine: '고객 앞에서 바로 보여주는 절세 가능성',
    url: 'https://startup-tax-checker.vercel.app/',
    isPublic: true,
    features: ['창업감면 1분 진단', '취등록세 절감 확인', '법령 기준 반영', '상담 즉시 활용'],
    target: '컨설턴트 · 대표',
    thumbnail: '/thumbnails/startup-tax-checker.png',
    thumbPos: 'top',
  },
]

export const upcomingTools: UpcomingTool[] = [
  {
    id: 'policy-fund-ai',
    title: '정책자금 AI 심사도우미',
    category: '정책자금',
    description: '기업 현황을 입력하면 정책자금 가능성과 준비 방향을 빠르게 정리하는 도구',
  },
  {
    id: 'cert-os',
    title: '기업인증 통합관리 OS',
    category: '기업인증',
    description:
      '벤처·메인비즈·이노비즈·ISO 등 기업인증 진행현황과 사후관리를 통합 관리하는 도구',
  },
  {
    id: 'consultant-db-marketing',
    title: '컨설턴트 DB 마케팅 OS',
    category: '고객관리·영업',
    description:
      '컨설턴트가 잠재 고객 DB를 만들고 콘텐츠·상담·후속관리 흐름을 자동화할 수 있도록 돕는 도구',
  },
  {
    id: 'automation-diagnoser',
    title: '고객사 업무자동화 진단기',
    category: '업무자동화',
    description: '고객사에서 시간이 오래 걸리는 반복 업무를 찾아 자동화 가능성을 진단하는 도구',
  },
]

export const statusStyles: Record<ToolStatus, string> = {
  'MVP 베타': 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20',
  '비공개 검토중': 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
  개발중: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
}

export const subStatusStyles: Record<SubStatus, string> = {
  '정식 출시 예정': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  '내부 테스트중': 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-400/40',
  '현재 외부 공개 제한': 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/20',
}

// 운영 현황 KPI — 가능한 값은 데이터에서 자동 계산.
// 거짓 수치 금지: 실집계 전까지 피드백 항목은 "수집 중"으로 표기.
// 향후 Supabase 집계(예: 분석 횟수·관리 중 고객)로 value 만 교체하면 됩니다.
export const kpis: { value: string; label: string }[] = [
  {
    value: `${tools.filter((tool) => tool.status === 'MVP 베타').length}개`,
    label: '운영 중인 실무 도구',
  },
  {
    value: `${upcomingTools.length}개`,
    label: '개발 중인 도구',
  },
  {
    value: `${MAX_FREE_DAYS}일`,
    label: '최대 무료 체험',
  },
  {
    value: '수집 중',
    label: '베타 피드백',
  },
]
