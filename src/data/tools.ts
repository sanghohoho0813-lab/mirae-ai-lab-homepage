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
      '받을 수 있는 지원금을 회차별로 관리하고 입·퇴사 변동까지 반영해, 고객에게 더 많은 혜택을 더 정확히 안내할 수 있도록 돕는 도구입니다.',
    valueLine: '놓치는 지원금 없이, 더 많은 혜택을 더 정확히',
    url: 'https://hr-subsidy-pro.vercel.app/',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['수급 가능액 자동 산정', '회차별 누락 방지', '입·퇴사 변동 관리', '고객 보고 자료화'],
    target: '컨설턴트 · 대표',
    thumbnail: '/thumbnails/hr-subsidy-pro.svg',
    thumbPos: 'top',
  },
  {
    id: 'labcare-rnd-os',
    title: '연구소 사후관리 OS',
    category: '연구소 관리',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    description:
      '설립 준비부터 사후관리·월간 알림·종합보고서·추가 제안까지 한 흐름으로 묶어, 관리 누락은 줄이고 고객 만족도는 높이는 도구입니다.',
    valueLine: '관리 누락은 줄이고 고객 만족도는 높이고',
    url: 'https://labcare-rnd-os.vercel.app/dashboard',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['설립 준비 체크', '월간 관리 알림', '종합보고서 생성', '추가 컨설팅 제안'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/labcare-rnd-os.svg',
    thumbPos: 'top',
  },
  {
    id: 'corp-sales-os',
    title: '법인컨설팅 세일즈 OS',
    category: '고객관리·영업',
    status: 'MVP 베타',
    subStatus: '내부 테스트중',
    description:
      '단순 CRM을 넘어 미팅 전략·잠재고객·제안·교육·콘텐츠까지 한 곳에서 관리해, 계약률과 업무 효율을 높이는 도구입니다.',
    valueLine: '흩어진 영업 지식을 한곳에, 계약률은 위로',
    url: 'https://corp-sales-os.vercel.app/',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['잠재고객·후속관리', '미팅 전략 메모', '제안·상담 이력', '콘텐츠·교육 관리'],
    target: '컨설턴트',
    thumbnail: '/thumbnails/corp-sales-os.svg',
    thumbPos: 'top',
  },
  {
    id: 'cretop-analyzer',
    title: '크레탑 자동분석기',
    category: '기업분석',
    status: 'MVP 베타',
    subStatus: '정식 출시 예정',
    description:
      '크레탑 자료 해석을 자동화해 3개년 재무구조와 증감, 미팅에서 꺼낼 핵심 포인트까지 몇 초 만에 정리하는 도구입니다.',
    valueLine: '미팅 전에 꺼낼 무기를 몇 초 만에',
    url: 'https://corp-sales-os-git-claude-cretop-mini-app-ksh90813.vercel.app/mini.html',
    isPublic: true,
    buttonText: '베타 버전 보기',
    features: ['3개년 증감 분석', '핵심 재무지표 정리', '추천 미팅 주제', '임시 가치평가'],
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
      '이익소각·자사주·배당 등 EXIT 전략을 비교해, 대표의 복잡한 자본거래 의사결정을 한눈에 돕는 도구입니다.',
    valueLine: '복잡한 자본거래 의사결정을 한눈에',
    url: 'https://stock-exit-simulator-a1vm.vercel.app/?review=1',
    isPublic: false,
    buttonText: '공개 준비중',
    features: ['EXIT 전략 비교', '절세효과 시뮬레이션', '자본거래 시나리오', '의사결정 리포트'],
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
      '업종·나이·지역·법령 변화에 따라 달라지는 감면 판단을 1분 안에 정리해, 고객 앞에서 바로 절세 가능성을 보여줄 수 있는 도구입니다.',
    valueLine: '복잡한 감면 판단을 1분 만에, 고객 앞에서 바로',
    url: 'https://startup-tax-checker.vercel.app/',
    isPublic: true,
    buttonText: '베타 버전 보기',
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
