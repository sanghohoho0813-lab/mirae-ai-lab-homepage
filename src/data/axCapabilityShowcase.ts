// AX 프론트엔드 구현역량 쇼케이스 — 데이터/타입 (BusinessServicesPage #ax-capability 전용).
// 목적: "성공사례"가 아니라 "구현역량·화면 예시". 가상 성과·고객수·업무개선율 금지.
// 향후 실제 고객 이미지/영상으로 쉽게 교체할 수 있도록 미디어 필드를 분리한다.
//   - 현재: mediaType 'ui-preview' → 컴포넌트의 React UI 미리보기를 렌더(=fallback)
//   - 향후: mediaType 'image' + imageSrc, 또는 'video' + videoSrc(+posterSrc) 로 바꾸면 같은 레이아웃에서 실제 미디어 표시
//     (video 는 자동재생 금지·클릭 재생·poster 지원. imageSrc/videoSrc 가 없으면 ui-preview fallback)

/** 증거 수준 — 향후 실제 사례를 붙일 때 재사용 */
export type AxProofLevel = 'concept' | 'prototype' | 'mvp' | 'pilot' | 'operation'
export const AX_PROOF_LABELS: Record<AxProofLevel, string> = {
  concept: '화면 컨셉',
  prototype: '클릭형 프로토타입',
  mvp: '작동형 MVP',
  pilot: '기업 테스트',
  operation: '실제 운영',
}

export type AxMediaType = 'ui-preview' | 'image' | 'video'

/** 화면 프레임 종류 — 브라우저(PC) / 모바일 디바이스 / 문서(보고서) */
export type AxFrame = 'browser' | 'phone' | 'document'

export type AxShowcaseScreen = {
  id: string
  /** 탭 라벨 (짧게) */
  title: string
  category: string
  /** 화면 설명 (탭 선택 시 노출) */
  description: string
  proofLevel: AxProofLevel
  /** 화면 배지 (예: 프론트엔드 구현 예시 / 작동형 화면 예시) */
  badge: string
  keyFeatures: string[]
  /** 프레임 종류 — UI 미리보기 렌더 분기에 사용 */
  frame: AxFrame
  mediaType: AxMediaType
  imageSrc?: string
  videoSrc?: string
  posterSrc?: string
  demoUrl?: string
  isClientWork: boolean
  disclaimer?: string
}

// ⚠️ 현재는 전부 'ui-preview'(실 미디어 없음). isClientWork=false, proofLevel 은 prototype/mvp 수준까지만.
export const AX_SHOWCASE_SCREENS: AxShowcaseScreen[] = [
  {
    id: 'dashboard',
    title: '운영 대시보드',
    category: 'PC 관리자',
    description: '흩어진 업무 정보를 한 화면에 모아 오늘 할 일·진행·위험을 바로 확인합니다.',
    proofLevel: 'mvp',
    badge: '프론트엔드 구현 예시',
    keyFeatures: ['업무 현황 집계', '담당자별 진행상태', '지연·누락 알림'],
    frame: 'browser',
    mediaType: 'ui-preview',
    isClientWork: false,
  },
  {
    id: 'mobile',
    title: '모바일 현장업무',
    category: '현장 직원',
    description: 'PC 관리자 화면뿐 아니라, 현장 직원이 모바일에서 일정을 확인하고 사진·수량·특이사항을 바로 입력해 관리자에게 전송합니다.',
    proofLevel: 'mvp',
    badge: '모바일 업무화면 예시',
    keyFeatures: ['오늘 일정 확인', '사진·수량·특이사항 입력', '처리 완료 전송'],
    frame: 'phone',
    mediaType: 'ui-preview',
    isClientWork: false,
  },
  {
    id: 'report',
    title: '자동 진단·보고서',
    category: '대표자용 요약',
    description: '수집된 데이터를 정리해, 대표자가 바로 판단할 수 있는 상태 점수·우선 과제·다음 실행순서로 요약합니다.',
    proofLevel: 'prototype',
    badge: '대표자용 결과 요약 예시',
    keyFeatures: ['상태 점수·구분', '우선 개선과제', '다음 실행순서'],
    frame: 'document',
    mediaType: 'ui-preview',
    isClientWork: false,
  },
]

// §9 시스템으로 전환 가능한 업무 — 작은 인라인 태그 (최대 5개)
export const AX_CAPABILITY_TAGS = ['업무 대시보드', '모바일 입력', '조건 자동판정', '문서·보고서', '업무 알림']

// §13 구축 과정 (5단계 · 컴팩트 라벨)
export const AX_BUILD_STEPS = ['업무 인터뷰', '기능 설계', '프로토타입', '작동형 MVP', '실제 테스트']

// §10 실제 개발경험 메시지 (제목 아래 2줄 보조문장으로 병합 · 과장 없이)
export const AX_EXPERIENCE_NOTE =
  '기업진단, 연구개발조직 관리, 고용지원금 검토, 근로계약·현장 운영관리 등 실무형 웹 시스템의 프로토타입과 MVP를 직접 설계·구현하고 있습니다.'
