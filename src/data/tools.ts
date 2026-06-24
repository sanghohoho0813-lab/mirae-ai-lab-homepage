export type ToolStatus = 'MVP 베타' | '비공개 검토중' | '개발중'

export type SubStatus = '정식 출시 예정' | '내부 테스트중' | '현재 외부 공개 제한'

export type Tool = {
  id: string
  title: string
  category: string
  status: ToolStatus
  subStatus: SubStatus
  description: string
  /** 카드 하단 한 줄 가치 메시지 */
  valueLine: string
  url: string
  isPublic: boolean
  buttonText: string
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
    title: '고용지원금 프로',
    category: '고용지원금',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    description:
      '고용지원금 검토 시간을 줄이고, 고객에게 더 정확한 안내를 더 빠르게 제공할 수 있도록 돕는 도구입니다.',
    valueLine: '고객에게 더 정확한 안내를 더 빠르게',
    url: 'https://hr-subsidy-pro.vercel.app/',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['지원금 대상 자동 검토', '활용 가능 제도 정리', '고객 안내 자료화'],
    target: '컨설턴트 · 대표',
    thumbnail: '/thumbnails/hr-subsidy-pro.png',
    thumbPos: 'center',
  },
  {
    id: 'labcare-rnd-os',
    title: '연구소 사후관리 OS',
    category: '연구소 관리',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    description:
      '변경신고와 사후관리를 체계적으로 관리해 관리 누락 위험을 줄이고 고객 만족도를 높이는 도구입니다.',
    valueLine: '관리 누락은 줄이고 고객 만족도는 높이고',
    url: 'https://labcare-rnd-os.vercel.app/dashboard',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['사후관리 일정 추적', '변경신고 관리', '누락 리스크 점검'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/labcare-rnd-os.png',
    thumbPos: 'center',
  },
  {
    id: 'corp-sales-os',
    title: '법인컨설팅 세일즈 OS',
    category: '고객관리·영업',
    status: 'MVP 베타',
    subStatus: '내부 테스트중',
    description:
      '고객관리부터 제안·상담 이력까지 한곳에서 관리해 계약률과 업무 효율을 높이는 도구입니다.',
    valueLine: '계약률을 높이는 컨설턴트용 영업 도구',
    url: 'https://corp-sales-os.vercel.app/',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['고객·상담 이력 관리', '제안 관리', '후속관리 자동화'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/corp-sales-os.png',
    thumbPos: 'center',
  },
  {
    id: 'cretop-analyzer',
    title: '크레탑 자동분석기',
    category: '기업분석',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    description:
      '재무제표 분석 시간을 줄이고, 고객에게 전달할 핵심 인사이트를 빠르게 찾는 도구입니다.',
    valueLine: '데이터 기반 컨설팅을 더 빠르게',
    url: 'https://corp-sales-os-git-claude-cretop-mini-app-ksh90813.vercel.app/mini.html',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['재무제표 자동 분석', '컨설팅 포인트 도출', 'PDF 업로드 분석'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/cretop-analyzer.png',
    thumbPos: 'top',
  },
  {
    id: 'stock-exit-simulator',
    title: '주식 EXIT 솔루션 시뮬레이터',
    category: '자본거래',
    status: '비공개 검토중',
    subStatus: '현재 외부 공개 제한',
    description:
      '이익소각·자사주·배당 등 다양한 EXIT 전략을 비교해, 대표의 자본거래 의사결정을 돕는 도구입니다.',
    valueLine: '복잡한 자본거래 의사결정을 한눈에',
    url: 'https://stock-exit-simulator-a1vm.vercel.app/?review=1',
    isPublic: false,
    buttonText: '공개 준비중',
    features: ['EXIT 전략 비교', '절세효과 시뮬레이션', '자본거래 시나리오'],
    target: '컨설턴트 · 대표',
    thumbnail: '',
    thumbPos: 'center',
  },
  {
    id: 'startup-tax-checker',
    title: '창업감면 & 취등록세 체크',
    category: '절세',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    description:
      '감면 가능성을 빠르게 확인해, 고객의 세금 부담을 줄이는 의사결정을 돕는 도구입니다.',
    valueLine: '검토 시간은 줄이고 절세 기회는 놓치지 않게',
    url: 'https://startup-tax-checker.vercel.app/',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['창업감면 진단', '취등록세 감면 확인', '1분 빠른 판정'],
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

// 상태값 기준으로 자동 계산되는 운영 현황 KPI (하드코딩 금지)
export const kpis = [
  {
    value: tools.filter((tool) => tool.status === 'MVP 베타').length,
    label: 'MVP 베타 도구',
  },
  {
    value: tools.filter((tool) => tool.status === '비공개 검토중').length,
    label: '비공개 검토중',
  },
  {
    value: upcomingTools.length,
    label: '개발중 도구',
  },
  {
    value: tools.filter((tool) => tool.subStatus === '정식 출시 예정').length,
    label: '정식 출시 준비중',
  },
]
