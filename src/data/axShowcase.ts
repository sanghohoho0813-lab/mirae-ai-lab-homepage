// AX 쇼케이스 단일 출처 데이터 — 메인 페이지(8섹션 압축본).
// 이미지 원본: Drive "미래에이아이랩 프론트 디자인 사진들" → public/ax-showcase/* (WebP, full+sm)
// ⚠️ 전 화면은 가상 업종 기반 프론트엔드 프로토타입 예시. 성공사례·실제 고객사·확정 성과 표현 금지.
// 인벤토리·제외 사유: docs/ax-image-manifest.md
//
// ── 이미지 반복 제한(메인 페이지 전체에서 동일 사진 ≤2회, 37·38·49·65·68·76·84 특히 준수) ──
//   38 → Hero(1)                     50 → Hero(1)                   74 → Hero·결과물(2)
//   36 → 문제→화면(1)  37 → 문제→화면·프로세스5단계(2)              48 → 문제→화면(1)
//   49 → 문제→화면·프로세스5단계(2)  60 → 문제→화면(1)  65 → 문제→화면·프로세스5단계(2)
//   68 → 프로세스 4단계(1)           67 → 결과물(1)                 76 → 미사용(0)
//   84 → 업종(장비, 1)  나머지 업종 이미지 각 1회. Hero 이미지는 업종에서 재사용하지 않음.

export type AxImage = {
  no: number
  src: string
  srcSm: string
  w: number
  h: number
  alt: string
  screen: string
  industry: string
  problem: string
  features: string[]
  level: '화면 설계 예시' | '클릭형 프로토타입' | '작동형 화면 예시'
}

const P = '/ax-showcase'
const LAND = { w: 1672, h: 941 }
const PORT = { w: 853, h: 1844 }

function img(no: number, dir: string, slug: string, orient: typeof LAND | typeof PORT, meta: Omit<AxImage, 'no' | 'src' | 'srcSm' | 'w' | 'h'>): AxImage {
  const base = `${P}/${dir}/photo-${String(no).padStart(2, '0')}-${slug}`
  return { no, src: `${base}.webp`, srcSm: `${base}-sm.webp`, ...orient, ...meta }
}

export const AX_IMAGES: Record<number, AxImage> = Object.fromEntries(
  [
    img(1, 'manufacturing', 'mes-landing', LAND, { alt: '스마트공장 생산관리 랜딩 화면과 생산 대시보드 목업', screen: '생산관리 시스템 소개 화면', industry: '제조·생산', problem: '흩어진 생산 현황이 한눈에 보이지 않는 문제', features: ['생산 현황 대시보드', '작업지시 연결', '현장 입력'], level: '화면 설계 예시' }),
    img(3, 'manufacturing', 'mes-dashboard', LAND, { alt: '실시간 생산 현황 KPI 대시보드 화면', screen: '실시간 생산 현황 대시보드', industry: '제조·생산', problem: '오늘 공장 상태를 보고로만 파악하는 문제', features: ['생산 KPI 집계', '공정 진행률', '불량률 추이'], level: '클릭형 프로토타입' }),
    img(5, 'manufacturing', 'mes-mobile', LAND, { alt: '현장 작업자 모바일 실적 입력 5단계 화면', screen: '현장 작업자 모바일 입력', industry: '제조·생산', problem: '현장 실적이 수기·구두로 전달되는 문제', features: ['오늘 할 일 확인', '실적·특이사항 입력', '완료 전송'], level: '클릭형 프로토타입' }),
    img(25, 'reservation', 'crm-calendar', LAND, { alt: '직원별 실시간 예약 캘린더 화면', screen: '직원별 예약 캘린더', industry: '예약 서비스업', problem: '전화·수기 예약의 중복·누락 문제', features: ['일간·주간 캘린더', '드래그 일정 변경', '직원별 배정'], level: '클릭형 프로토타입' }),
    img(27, 'reservation', 'crm-customer', LAND, { alt: '고객 프로필과 상담·이용 이력 타임라인 화면', screen: '고객 CRM 이력 관리', industry: '예약 서비스업', problem: '고객 이력이 담당자 머릿속에만 있는 문제', features: ['고객 프로필', '상담·이용 이력', '재방문 힌트'], level: '클릭형 프로토타입' }),
    img(29, 'reservation', 'crm-mobile-booking', LAND, { alt: '고객 모바일 예약 단계별 화면', screen: '고객 모바일 예약 흐름', industry: '예약 서비스업', problem: '전화로만 예약을 받는 문제', features: ['서비스 선택', '시간 선택', '예약 확정'], level: '클릭형 프로토타입' }),
    img(35, 'wms', 'wms-landing', LAND, { alt: '재고 흐름을 한 화면으로 보여주는 WMS 소개 화면', screen: 'WMS 소개 화면', industry: '물류·창고', problem: '입고부터 출고까지 흐름이 끊기는 문제', features: ['재고 대시보드', '모바일 스캔', '입출고 관리'], level: '화면 설계 예시' }),
    img(36, 'wms', 'wms-problem', LAND, { alt: '엑셀과 수기 재고관리의 문제점 정리 화면', screen: '엑셀·수기 재고관리 문제 정리', industry: '물류·창고', problem: '재고차이·오출고가 반복되는 원인 정리', features: ['문제 유형 분류', '위험 항목 정리'], level: '화면 설계 예시' }),
    img(37, 'wms', 'wms-live-dashboard', LAND, { alt: '실시간 창고 대시보드와 구역별 현황 지도', screen: '실시간 창고 대시보드', industry: '물류·창고', problem: '창고 전체 흐름이 실시간으로 보이지 않는 문제', features: ['입출고 KPI', '구역별 현황맵', '작업자 처리량'], level: '클릭형 프로토타입' }),
    img(38, 'wms', 'wms-inbound', LAND, { alt: '입고 검수와 적치 위치 안내 관리 화면', screen: '입고·검수·적치 관리', industry: '물류·창고', problem: '검수 차이와 적치 위치 누락 문제', features: ['검수차이 확인', '적치 위치 추천', '바코드 라벨'], level: '클릭형 프로토타입' }),
    img(41, 'wms', 'wms-mobile-scan', LAND, { alt: '모바일 바코드 스캔 작업 화면 7단계', screen: '현장 모바일 바코드 스캔', industry: '물류·창고', problem: '현장 작업자가 종이 목록으로 일하는 문제', features: ['스캔 피킹', '검수 확인', '출고 확정'], level: '클릭형 프로토타입' }),
    img(42, 'wms', 'wms-risk-alerts', LAND, { alt: '부족재고와 오출고 위험 경고 관리 화면', screen: '부족재고·오출고 위험 관리', industry: '물류·창고', problem: '문제를 사고 이후에 발견하는 문제', features: ['위험 우선순위', '경고 알림', '처리 이력'], level: '클릭형 프로토타입' }),
    img(47, 'rnd', 'rnd-landing', LAND, { alt: '연구소 관리 시스템 소개 화면', screen: '연구소 R&D 관리 소개 화면', industry: '기업부설연구소', problem: '연구활동과 사후관리 위험이 안 보이는 문제', features: ['통합 대시보드', '연구노트', '신고일정'], level: '화면 설계 예시' }),
    img(48, 'rnd', 'rnd-problem', LAND, { alt: '연구소 설립 이후 사후관리 문제점 정리 화면', screen: '연구소 사후관리 문제 정리', industry: '기업부설연구소', problem: '연구노트·증빙·신고가 방치되는 문제', features: ['위험 항목 정리', '관리 공백 진단'], level: '화면 설계 예시' }),
    img(49, 'rnd', 'rnd-dashboard', LAND, { alt: '연구소 통합 대시보드 화면', screen: '연구소 통합 대시보드', industry: '기업부설연구소', problem: '연구소 상태를 점검할 화면이 없는 문제', features: ['연구노트 작성률', '증빙 누락', '신고 일정'], level: '클릭형 프로토타입' }),
    img(51, 'rnd', 'rnd-note', LAND, { alt: '월별 연구노트 작성 화면', screen: '월별 연구노트 작성', industry: '기업부설연구소', problem: '연구노트가 밀려서 한꺼번에 쓰는 문제', features: ['월별 양식', '목적·결과 정리', '첨부 관리'], level: '클릭형 프로토타입' }),
    img(53, 'rnd', 'rnd-schedule', LAND, { alt: '신고일정과 인력변경 관리 화면', screen: '신고일정·인력변경 관리', industry: '기업부설연구소', problem: '신고 기한과 인력변경을 놓치는 문제', features: ['D-day 캘린더', '변경 이력', '알림'], level: '클릭형 프로토타입' }),
    img(60, 'b2b-order', 'b2b-problem', LAND, { alt: '전화·카톡 주문이 엑셀 재입력으로 이어지는 문제 정리', screen: '수기 주문 접수 문제 정리', industry: '도소매·유통', problem: '주문 누락·재입력·정산 오류의 원인 정리', features: ['문제 유형 분류', '업무 병목 정리'], level: '화면 설계 예시' }),
    img(61, 'b2b-order', 'b2b-mobile-reorder', LAND, { alt: '거래처가 모바일에서 바로 재주문하는 화면', screen: '거래처 모바일 반복주문', industry: '도소매·유통', problem: '거래처가 전화로만 주문하는 문제', features: ['자주 주문 상품', '빠른 재주문', '주문 이력'], level: '클릭형 프로토타입' }),
    img(63, 'b2b-order', 'b2b-unit-calc', LAND, { alt: '박스와 낱개 수량 자동 계산 주문 화면', screen: '박스·낱개 수량 자동 계산', industry: '도소매·유통', problem: '박스·낱개 단위 착오로 오출고가 나는 문제', features: ['단위 자동 환산', '금액 자동 계산'], level: '클릭형 프로토타입' }),
    img(65, 'b2b-order', 'b2b-admin-dashboard', LAND, { alt: '관리자 주문·재고·출고 통합 대시보드', screen: '관리자 주문·재고·출고 대시보드', industry: '도소매·유통', problem: '주문·재고·출고를 각각 따로 확인하는 문제', features: ['주문 현황', '재고 연동', '미결제 관리'], level: '클릭형 프로토타입' }),
    img(66, 'b2b-order', 'b2b-fulfillment', LAND, { alt: '주문접수부터 배송완료까지 창고 처리 흐름 화면', screen: '주문→창고·배송 연결 흐름', industry: '도소매·유통', problem: '접수 후 창고·배송으로 흐름이 끊기는 문제', features: ['피킹·검수·포장', '단계별 상태', '모바일 연동'], level: '클릭형 프로토타입' }),
    img(67, 'b2b-order', 'b2b-scope', LAND, { alt: '고객 모바일 화면과 내부 운영관리를 하나로 묶은 구성 요약', screen: '고객 화면 + 내부 운영 통합 구성', industry: '도소매·유통', problem: '고객용과 내부용 시스템이 따로 만들어지는 문제', features: ['모바일 주문', '운영 대시보드', '단일 데이터'], level: '화면 설계 예시' }),
    img(68, 'design-direction', 'design-direction', LAND, { alt: '여섯 가지 화면 디자인 무드 중 선택하는 가이드 화면', screen: '디자인 방향 선택 가이드', industry: '공통', problem: '기능만 논의하고 화면 분위기는 뒤늦게 정하는 문제', features: ['6가지 무드 보드', '브랜드 색상 반영', '업종 특성 반영'], level: '화면 설계 예시' }),
    img(74, 'mobile', 'supplyloop-order-confirm', PORT, { alt: '모바일 주문 확인과 제출 화면', screen: '모바일 주문 확인·제출', industry: '산업용 소모품', problem: '주문 내용·결제조건 확인이 전화로 오가는 문제', features: ['주문 상품 확인', '결제조건 선택', '주문 제출'], level: '클릭형 프로토타입' }),
    img(81, 'equipment-platform', 'equiplink-detail', PORT, { alt: '장비 상세 사양과 점검 리포트 화면', screen: '장비 상세·점검 리포트', industry: '중고 산업장비', problem: '장비 상태 정보를 믿기 어려운 문제', features: ['사양 정리', '점검 리포트', '판매자 정보'], level: '클릭형 프로토타입' }),
    img(82, 'equipment-platform', 'equiplink-quote', PORT, { alt: '견적과 상담 요청 입력 화면', screen: '견적·상담 요청', industry: '중고 산업장비', problem: '견적 요청이 전화·문자로 흩어지는 문제', features: ['요청 항목 입력', '상담 방식 선택'], level: '클릭형 프로토타입' }),
    img(84, 'equipment-platform', 'equiplink-flow', LAND, { alt: '장비 매칭 앱 7단계 전체 서비스 흐름 요약', screen: '장비 매칭 앱 전체 흐름', industry: '중고 산업장비', problem: '탐색부터 상담까지 흐름이 끊기는 문제', features: ['탐색·필터', '상세·점검정보', '견적·상담 요청'], level: '클릭형 프로토타입' }),
  ].map((im) => [im.no, im])
)

export function ax(no: number): AxImage {
  return AX_IMAGES[no]
}

/** 히어로 크롭(앱 영역만) — 원본 38·50에서 추출. 메인 1 + 보조 1 + 폰(74) */
export const AX_HERO = {
  browserMain: { src: `${P}/hero/browser-wms-inbound.webp`, alt: '입고·검수·적치 관리 화면 예시', w: 1095, h: 763, caption: '물류 · 입고검수 관리' },
  browserSub: { src: `${P}/hero/browser-rnd-projects.webp`, alt: '연구원·연구과제 관리 화면 예시', w: 1152, h: 786, caption: '연구소 · 과제관리' },
  phone: 74,
}
/** 히어로 보조 흐름 라벨 */
export const AX_HERO_FLOW = ['기업진단', '자금전략', '성장근거', 'AX 구축']

/** 공통 신뢰성 고지 */
export const AX_DISCLAIMER =
  '모든 화면은 구축 가능 범위를 보여주기 위한 가상 업종 기반 프론트엔드 프로토타입 예시입니다. 실제 고객사 운영 화면이 아니며, 화면 속 상호·수치·제조사명은 시연용 가상 데이터입니다. 실제 구축 범위는 기업 인터뷰 후 결정됩니다.'

/** 섹션 2 — 문제 → 화면 (업종 탭별 Before → Prototype). 36·48·60(Before)은 이 섹션에서만 사용 */
export type AxTransformTab = {
  key: string
  label: string
  industry: string
  note: string
  beforeNo: number
  protoNo: number
  protoFrame: 'browser' | 'phone'
}
export const AX_TRANSFORM_TABS: AxTransformTab[] = [
  { key: 'wms', label: '물류·창고', industry: '물류·창고', note: '엑셀과 수기 재고는 현장을 따라가지 못합니다.', beforeNo: 36, protoNo: 37, protoFrame: 'browser' },
  { key: 'rnd', label: '연구소 관리', industry: '기업부설연구소', note: '설립 이후의 관리는 서류보다 더 어렵습니다.', beforeNo: 48, protoNo: 49, protoFrame: 'browser' },
  { key: 'b2b', label: 'B2B 주문', industry: '도소매·유통', note: '전화·카톡 주문이 다시 엑셀 업무가 됩니다.', beforeNo: 60, protoNo: 65, protoFrame: 'browser' },
]
/** 문제 → 화면 4단계(고정) */
export const AX_TRANSFORM_STEPS = ['기존 방식', '업무 흐름 정리', '화면 설계', '작동 프로토타입']

/** 섹션 3 — 컨설팅 진행 6단계 */
export type AxStep = { no: string; title: string; client: string; lab: string; output: string; imageNos?: number[] }
export const AX_PROCESS: AxStep[] = [
  { no: '01', title: '기업진단', client: '기본 기업정보와 현재 고민을 공유합니다.', lab: '자금·인증·연구개발·디지털 운영 상태를 진단합니다.', output: '기업진단 결과표' },
  { no: '02', title: '자금·성장전략', client: '목표 자금 규모와 우선순위를 함께 정합니다.', lab: '신청기관·자금 방향과 성장 우선순위를 설계합니다.', output: '자금·성장 전략 로드맵' },
  { no: '03', title: '현장업무 인터뷰', client: '기존 엑셀·메모·자료와 실제 업무방식을 공유합니다.', lab: '반복업무·누락·병목·평가 근거 부족 항목을 정리합니다.', output: '업무 흐름도 · 개선과제 목록' },
  { no: '04', title: '화면 방향 확인', client: '원하는 화면 분위기와 참고 스타일을 선택합니다.', lab: '업종·브랜드에 맞는 화면 방향을 제안합니다.', output: '화면 디자인 가이드', imageNos: [68] },
  { no: '05', title: '작동형 프로토타입 구축', client: '실제 업무 기준으로 화면을 검토하고 피드백합니다.', lab: '핵심 업무 화면과 작동형 프로토타입을 구현합니다.', output: '데스크톱·모바일 프로토타입', imageNos: [37, 49, 65] },
  { no: '06', title: '검증자료·실행계획 정리', client: '요청 자료를 준비하고 일정에 맞춰 진행합니다.', lab: '자금신청 활용 자료를 정리하고 다음 실행계획을 안내합니다.', output: '검증자료 · 실행/고도화 계획' },
]

/** 섹션 4 — 업종별 AX 구축 예시 (6탭, 대표 1 + 보조 ≤2). Hero·문제→화면 이미지와 겹치지 않게 배정 */
export type AxIndustryTab = { key: string; label: string; short: string; desc: string; imageNos: number[] }
export const AX_INDUSTRY_TABS: AxIndustryTab[] = [
  { key: 'mfg', label: '제조·생산', short: '제조', desc: '작업지시부터 공정 진행, 현장 실적 입력까지 생산 흐름을 하나로 연결합니다.', imageNos: [3, 5, 1] },
  { key: 'wms', label: '물류·창고', short: '물류', desc: '입고·재고 위치·피킹·검수·출고와 현장 모바일 스캔, 부족재고 경고까지 연결합니다.', imageNos: [41, 42, 35] },
  { key: 'reservation', label: '예약·고객관리', short: '예약', desc: '예약, 직원 일정, 고객 이력, 결제와 재방문을 하나로 연결합니다.', imageNos: [25, 27, 29] },
  { key: 'rnd', label: '연구소·R&D', short: '연구소', desc: '연구과제, 연구노트, 증빙자료, 신고일정과 인력변경을 연결합니다.', imageNos: [51, 53, 47] },
  { key: 'b2b', label: 'B2B 주문', short: 'B2B', desc: '전화·카톡 주문을 모바일 반복주문과 관리자 주문·출고관리로 전환합니다.', imageNos: [66, 61, 63] },
  { key: 'equip', label: '장비 매칭', short: '플랫폼', desc: '장비 검색, 필터, 점검정보, 견적 요청과 판매자 상담을 연결하는 매칭 플랫폼도 설계합니다.', imageNos: [84, 81, 82] },
]

/** 섹션 5 — 결과물 9종 */
export const AX_DELIVERABLES: string[] = [
  '기업진단 결과',
  '자금전략 로드맵',
  '업무 흐름도',
  '화면 기획안',
  '관리자 대시보드',
  '모바일 업무화면',
  '작동형 프로토타입',
  '구축 범위 문서',
  '실행 및 고도화 계획',
]
/** 결과물 대표 미리보기 — 관리자(브라우저 67) + 모바일(폰 74) */
export const AX_RESULT_PREVIEW = { browserNo: 67, phoneNo: 74 }

/** 섹션 5 — 구축 수준 3단계 (기본 제공 vs 별도 범위 명확화) */
export type AxLevel = { no: string; name: string; items: string[]; scope: string; provided: '기본 시작' | '선택 확장' | '별도 범위·견적'; tone: 'base' | 'mid' | 'ext' }
export const AX_BUILD_LEVELS: AxLevel[] = [
  { no: '1단계', name: '화면 설계', items: ['핵심 화면·업무 흐름 확인', '클릭형 프론트엔드 프로토타입'], scope: '기본 AX 컨설팅의 시작 범위', provided: '기본 시작', tone: 'base' },
  { no: '2단계', name: '작동형 MVP', items: ['데이터 입력·조회·상태변경', '관리자 화면과 모바일 화면 연동'], scope: '기업 상황에 따라 선택 확장', provided: '선택 확장', tone: 'mid' },
  { no: '3단계', name: '운영 고도화', items: ['실제 데이터베이스·사용자 권한', '외부 API·결제·ERP·메시지 연동'], scope: '외부/추가 개발이 필요한 별도 영역', provided: '별도 범위·견적', tone: 'ext' },
]

/** 섹션 7 — 미래AI랩 차별점 (3열 비교) */
export const AX_DIFF_COLS: { key: string; label: string; sub: string; items: string[]; highlight: boolean }[] = [
  { key: 'consult', label: '일반 정책자금 컨설팅', sub: '신청서·제출 중심', items: ['신청 가능 여부 검토', '서류 작성·제출 대행', '컨설팅 종료 후 남는 시스템 없음'], highlight: false },
  { key: 'dev', label: '일반 웹·앱 외주', sub: '요청받은 화면·기능 중심', items: ['요청한 화면만 제작', '업무 진단·자금 연계 없음', '평가 근거와 분리되어 진행'], highlight: false },
  { key: 'mirae', label: '미래AI랩', sub: '진단 → 전략 → 근거 → 시스템', items: ['기업진단·자금전략', '인증과 성장근거 설계', '실제 업무 흐름 분석', 'AX 프로토타입 구축', '향후 운영 고도화 계획'], highlight: true },
]

/** 섹션 8 — 최종 CTA 업종 아이콘(이미지 반복 대신) */
export const AX_CTA_INDUSTRIES: { icon: string; label: string }[] = [
  { icon: '🏭', label: '제조·생산' },
  { icon: '📦', label: '물류·창고' },
  { icon: '📅', label: '예약·CRM' },
  { icon: '🔬', label: '연구소' },
  { icon: '🧾', label: 'B2B 주문' },
  { icon: '🔧', label: '장비 매칭' },
]
