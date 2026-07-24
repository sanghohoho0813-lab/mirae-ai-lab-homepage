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
    img(50, 'rnd', 'rnd-projects', LAND, { alt: '연구원과 연구과제 연결 관리 화면', screen: '연구원·과제 연결 관리', industry: '기업부설연구소', problem: '연구원별 과제·진행률이 정리되지 않는 문제', features: ['과제 간트', '인력 배치', '변경 알림'], level: '클릭형 프로토타입' }),
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
  { key: 'wms', label: '물류·창고', industry: '물류·창고', note: '엑셀과 수기 재고는 현장을 따라가지 못합니다.', beforeNo: 36, protoNo: 38, protoFrame: 'browser' },
  { key: 'rnd', label: '연구소 관리', industry: '기업부설연구소', note: '설립 이후의 관리는 서류보다 더 어렵습니다.', beforeNo: 48, protoNo: 49, protoFrame: 'browser' },
  { key: 'b2b', label: 'B2B 주문', industry: '도소매·유통', note: '전화·카톡 주문이 다시 엑셀 업무가 됩니다.', beforeNo: 60, protoNo: 66, protoFrame: 'browser' },
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
  { no: '05', title: '작동형 프로토타입 구축', client: '실제 업무 기준으로 화면을 검토하고 피드백합니다.', lab: '핵심 업무 화면과 작동형 프로토타입을 구현합니다.', output: '데스크톱·모바일 프로토타입', imageNos: [3, 50, 25] },
  { no: '06', title: '검증자료·실행계획 정리', client: '요청 자료를 준비하고 일정에 맞춰 진행합니다.', lab: '자금신청 활용 자료를 정리하고 다음 실행계획을 안내합니다.', output: '검증자료 · 실행/고도화 계획' },
]

/** 섹션 4 — 업종별 AX 구축 예시 (6탭, 대표 1 + 보조 ≤2). Hero·문제→화면 이미지와 겹치지 않게 배정 */
export type AxIndustryTab = { key: string; label: string; short: string; desc: string; imageNos: number[] }
export const AX_INDUSTRY_TABS: AxIndustryTab[] = [
  { key: 'mfg', label: '제조·생산', short: '제조', desc: '작업지시부터 공정 진행, 현장 실적 입력까지 생산 흐름을 하나로 연결합니다.', imageNos: [3, 5, 1] },
  { key: 'wms', label: '물류·창고', short: '물류', desc: '부족재고·오출고 위험, 입고·피킹·출고와 현장 모바일 스캔까지 한 화면에서 관리합니다.', imageNos: [42, 41, 35] },
  { key: 'reservation', label: '예약·고객관리', short: '예약', desc: '예약, 직원 일정, 고객 이력, 결제와 재방문을 하나로 연결합니다.', imageNos: [25, 27, 29] },
  { key: 'rnd', label: '연구소·R&D', short: '연구소', desc: '연구원·연구과제, 연구노트, 신고일정과 인력변경을 하나로 연결합니다.', imageNos: [50, 51, 53] },
  { key: 'b2b', label: 'B2B 주문', short: 'B2B', desc: '전화·카톡 주문을 모바일 반복주문과 관리자 주문·재고·출고 대시보드로 전환합니다.', imageNos: [65, 61, 63] },
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
/** 결과물 대표 미리보기 — 관리자 대시보드(65) + 모바일(74) + 구성/문서(67) 각각 크게 */
export const AX_RESULT_PREVIEW = { browserNo: 65, phoneNo: 74, docNo: 67 }

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

// ══════════════════════════════════════════════════════════════════════════
// AX SHOWCASE v2 (사진 85~110) — 국내 중소기업 8개 실제 업종 브랜드 목업
// 매핑 근거: 각 이미지에 렌더된 실제 브랜드명 기준(docs/ax-showcase-v2-image-manifest.md).
// 기존 사진 1~84(위 AX_IMAGES/AX_INDUSTRY_TABS)는 그대로 보존하고 여기서 확장만 추가한다.
// ══════════════════════════════════════════════════════════════════════════

export type ShowcaseImg = { no: number; src: string; srcSm: string; w: number; h: number; alt: string; caption: string }
export type ShowcaseKind = 'showcase' | 'pc' | 'mobile' | 'gallery'
export type LightItem = ShowcaseImg & { kind: ShowcaseKind }
export type GroupKey = 'production' | 'field' | 'service' | 'ops'

export type ShowcaseIndustry = {
  key: string
  group: GroupKey
  brand: string
  label: string
  icon: string
  headline: string
  desc: string
  features: string[]
  prototypeLevel: string
  representative: ShowcaseImg
  pc?: ShowcaseImg
  mobile?: ShowcaseImg
  gallery?: ShowcaseImg[]
  isNew: boolean
}

const P2 = '/ax-showcase-v2'
function v2(no: number, slug: string, orient: 'land' | 'port', alt: string, caption: string): ShowcaseImg {
  const base = `${P2}/photo-${String(no).padStart(3, '0')}-${slug}`
  const [w, h] = orient === 'land' ? [1600, 900] : no === 109 ? [759, 1600] : [900, 1600]
  return { no, src: `${base}.webp`, srcSm: `${base}-sm.webp`, w, h, alt, caption }
}
/** 기존 AX_IMAGES(1~84) 항목을 쇼케이스 이미지 형태로 감싼다(전체 업종 보기용) */
function legacy(no: number): ShowcaseImg {
  const im = AX_IMAGES[no]
  return { no: im.no, src: im.src, srcSm: im.srcSm, w: im.w, h: im.h, alt: im.alt, caption: im.screen }
}

export const AX_GROUPS: { key: GroupKey; label: string }[] = [
  { key: 'production', label: '생산·유통' },
  { key: 'field', label: '현장·시설' },
  { key: 'service', label: '고객·서비스' },
  { key: 'ops', label: '기업 운영' },
]

// 신규 8개 업종 (사진 87~110)
const NEW_INDUSTRIES: ShowcaseIndustry[] = [
  {
    key: 'siteflow', group: 'field', brand: 'SiteFlow', label: '건설·현장', icon: '🏗️',
    headline: '현장과 본사의 공정 정보를 하나의 흐름으로 연결합니다.',
    desc: '공정일정, 일일보고, 자재 요청, 현장사진과 이슈·하자 상태를 함께 관리합니다.',
    features: ['공정 일정', '일일보고', '자재 요청', '현장 사진', '이슈·하자', '보고서'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(89, 'siteflow-showcase', 'land', 'SiteFlow 건설 현장·본사 공정 연결 대표 화면', '건설 현장 · 공정 통합 화면'),
    pc: v2(87, 'siteflow-pc', 'land', 'SiteFlow 관리자 PC 현장 운영 화면', '관리자 웹 · 현장 운영'),
    mobile: v2(88, 'siteflow-mobile', 'port', 'SiteFlow 현장 소장·작업자용 모바일 일일보고 화면', '현장 모바일 · 일일보고'),
  },
  {
    key: 'storepulse', group: 'production', brand: 'StorePulse', label: '외식·프랜차이즈', icon: '🍽️',
    headline: '매장별 발주와 운영상태를 본사에서 한눈에 확인합니다.',
    desc: '재고 부족, 발주 승인, 위생점검과 마감보고를 여러 매장과 본사 사이에서 연결합니다.',
    features: ['전 매장 현황', '발주 승인', '원재료 재고', '위생 체크', '마감보고', '매장 사진'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(92, 'storepulse-showcase', 'land', 'StorePulse 매장·본사 발주 운영 대표 화면', '외식·프랜차이즈 · 통합 운영'),
    pc: v2(90, 'storepulse-pc', 'land', 'StorePulse 본사 전 매장 운영 대시보드', '본사 웹 · 전 매장 운영'),
    mobile: v2(91, 'storepulse-mobile', 'port', 'StorePulse 점장용 모바일 마감업무 화면', '점장 모바일 · 마감업무'),
  },
  {
    key: 'careflow', group: 'service', brand: 'CareFlow', label: '병원·의원', icon: '🏥',
    headline: '예약부터 방문 이후 안내까지 환자 흐름을 연결합니다.',
    desc: '의료진 시간표, 접수·대기 상태, 검사 일정과 재방문 안내를 하나의 운영 화면에서 관리합니다.',
    features: ['의료진 일정', '환자 흐름', '예약 변경', '검사 일정', '재방문 안내', '방문 전 안내'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(95, 'careflow-showcase', 'land', 'CareFlow 병원 진료 운영 대표 화면', '병원·의원 · 진료 운영'),
    pc: v2(93, 'careflow-pc', 'land', 'CareFlow 병원 관리자 PC 진료 운영 보드', '관리자 웹 · 진료 운영'),
    mobile: v2(94, 'careflow-mobile', 'port', 'CareFlow 환자용 모바일 예약·방문 안내 화면', '환자 모바일 · 예약·안내'),
  },
  {
    key: 'classpilot', group: 'service', brand: 'ClassPilot', label: '학원·교육', icon: '🎓',
    headline: '수업·출결·상담과 학부모 안내를 하나로 관리합니다.',
    desc: '강의실 시간표, 학생 출결, 보강 일정, 상담과 학부모 공지를 연결합니다.',
    features: ['강의 시간표', '출결 관리', '수업일지', '보강 관리', '학생 상담', '학부모 공지'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(98, 'classpilot-showcase', 'land', 'ClassPilot 학원 수업·출결 운영 대표 화면', '학원·교육 · 운영 통합'),
    pc: v2(96, 'classpilot-pc', 'land', 'ClassPilot 학원 관리자 PC 시간표·출결 대시보드', '관리자 웹 · 시간표·출결'),
    mobile: v2(97, 'classpilot-mobile', 'port', 'ClassPilot 강사용 모바일 출결·수업일지 화면', '강사 모바일 · 출결·일지'),
  },
  {
    key: 'garageos', group: 'production', brand: 'GarageOS', label: '자동차 정비', icon: '🔧',
    headline: '차량 접수부터 정비 완료와 출고까지 진행상태를 연결합니다.',
    desc: '작업 베이, 부품 요청, 정비사진과 고객 확인사항을 작업장과 모바일에서 함께 관리합니다.',
    features: ['차량 접수', '작업 베이', '점검 체크리스트', '부품 요청', '정비 사진', '고객 확인'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(101, 'garageos-showcase', 'land', 'GarageOS 자동차 정비 접수·출고 대표 화면', '자동차 정비 · 작업 운영'),
    pc: v2(99, 'garageos-pc', 'land', 'GarageOS 정비소 관리자 PC 작업장 운영보드', '관리자 웹 · 작업장 운영'),
    mobile: v2(100, 'garageos-mobile', 'port', 'GarageOS 정비기사용 모바일 차량 점검·작업보고', '정비기사 모바일 · 점검보고'),
  },
  {
    key: 'staydeck', group: 'service', brand: 'StayDeck', label: '숙박·호텔', icon: '🏨',
    headline: '예약과 객실 정비상태를 실시간으로 연결합니다.',
    desc: '객실맵, 체크인·체크아웃 일정, 하우스키핑 배정과 고객 요청을 하나의 화면에서 관리합니다.',
    features: ['객실 상태', '예약 일정', '하우스키핑', '비품 재고', '고객 요청', '점검 관리'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(104, 'staydeck-showcase', 'land', 'StayDeck 숙박 예약·객실 정비 대표 화면', '숙박·호텔 · 객실 운영'),
    pc: v2(102, 'staydeck-pc', 'land', 'StayDeck 관리자용 PC 객실 운영 대시보드', '관리자 웹 · 객실 운영'),
    mobile: v2(103, 'staydeck-mobile', 'port', 'StayDeck 객실 정비직원용 모바일 화면', '정비직원 모바일 · 객실 정비'),
  },
  {
    key: 'fieldcare', group: 'field', brand: 'FieldCare', label: '시설관리', icon: '🧹',
    headline: '정기 방문부터 현장 증빙과 고객 확인까지 연결합니다.',
    desc: '방문 일정, 직원 배정, 체크리스트, 작업 전후 사진과 완료보고를 통합 관리합니다.',
    features: ['방문 일정', '직원 배정', '현장 체크리스트', '사진 증빙', '소모품 관리', '고객 서명'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(110, 'fieldcare-showcase', 'land', 'FieldCare 시설관리 방문·현장 증빙 대표 화면', '시설관리 · 방문·현장 운영'),
    pc: v2(108, 'fieldcare-pc', 'land', 'FieldCare 관리자용 PC 방문 일정·직원 배정 화면', '관리자 웹 · 방문·배정'),
    mobile: v2(109, 'fieldcare-mobile', 'port', 'FieldCare 현장직원용 모바일 체크리스트·완료보고', '현장 모바일 · 체크·완료보고'),
  },
  {
    key: 'leaseflow', group: 'field', brand: 'LeaseFlow', label: '임대·건물관리', icon: '🏢',
    headline: '계약·공실·수납과 시설관리를 하나의 화면에서 확인합니다.',
    desc: '호실 현황, 계약 일정, 월세 입금, 시설민원과 현장점검을 연결합니다.',
    features: ['호실 현황', '계약 타임라인', '공실 관리', '수납 관리', '시설 민원', '현장 점검'],
    prototypeLevel: '클릭형 프론트엔드 프로토타입', isNew: true,
    representative: v2(107, 'leaseflow-showcase', 'land', 'LeaseFlow 임대·계약·공실·수납 대표 화면', '임대·건물관리 · 통합 운영'),
    pc: v2(105, 'leaseflow-pc', 'land', 'LeaseFlow 관리자용 PC 임대·계약·공실·수납 화면', '관리자 웹 · 임대·수납'),
    mobile: v2(106, 'leaseflow-mobile', 'port', 'LeaseFlow 시설 민원·현장점검 모바일 화면', '현장 모바일 · 민원·점검'),
  },
]

// 기존 6개 업종(사진 1~84) — "전체 업종 보기"에서 함께 노출
const LEGACY_INDUSTRIES: ShowcaseIndustry[] = AX_INDUSTRY_TABS.map((t): ShowcaseIndustry => {
  const [rep, ...rest] = t.imageNos
  const legacyIcon: Record<string, { icon: string; group: GroupKey }> = {
    mfg: { icon: '🏭', group: 'production' },
    wms: { icon: '📦', group: 'production' },
    reservation: { icon: '📅', group: 'service' },
    rnd: { icon: '🔬', group: 'ops' },
    b2b: { icon: '🧾', group: 'production' },
    equip: { icon: '🛠️', group: 'production' },
  }
  const meta = legacyIcon[t.key] ?? { icon: '🗂️', group: 'production' as GroupKey }
  return {
    key: t.key, group: meta.group, brand: '', label: t.label, icon: meta.icon,
    headline: ax(rep).screen, desc: t.desc, features: ax(rep).features,
    prototypeLevel: ax(rep).level === '작동형 화면 예시' ? '작동형 화면 예시' : '클릭형 프론트엔드 프로토타입',
    isNew: false,
    representative: legacy(rep),
    gallery: rest.map(legacy),
  }
})

/** 전체 업종(신규 8 + 기존 6) — 쇼케이스 컴포넌트 단일 소스 */
export const SHOWCASE_INDUSTRIES: ShowcaseIndustry[] = [...NEW_INDUSTRIES, ...LEGACY_INDUSTRIES]
/** 첫 화면 노출 순서(스펙): 숙박 → 정비 → 시설관리 → 임대 → 병원 → 학원 → 외식 → 건설 */
export const AX_QUICKNAV_KEYS = ['staydeck', 'garageos', 'fieldcare', 'leaseflow', 'careflow', 'classpilot', 'storepulse', 'siteflow']

export function showcaseIndustry(key: string): ShowcaseIndustry | undefined {
  return SHOWCASE_INDUSTRIES.find((i) => i.key === key)
}
/** 업종 상세의 라이트박스 순회 목록(대표 → PC → 모바일 → 보조) */
export function industryLightbox(ind: ShowcaseIndustry): LightItem[] {
  const out: LightItem[] = [{ ...ind.representative, kind: 'showcase' }]
  if (ind.pc) out.push({ ...ind.pc, kind: 'pc' })
  if (ind.mobile) out.push({ ...ind.mobile, kind: 'mobile' })
  if (ind.gallery) ind.gallery.forEach((g) => out.push({ ...g, kind: 'gallery' }))
  return out
}

/** 신규 Hero — 대표 이미지 110(FieldCare 쇼케이스) 크게 + 107/101 수동 전환, 모바일 109 */
export const AX_HERO2 = {
  eyebrow: '정책자금 · AX 실행설계 · 기업 성장제도',
  headlineLead: '정책자금 신청에서 끝내지 않습니다.',
  headlineTop: '흩어진 업무를, 실제로 사용하는',
  headlineAccent: 'AX 화면',
  headlineTail: '으로 바꿉니다.',
  sub: '기존 자금조달 컨설팅 경험에 AI 전환 설계와 구현 역량을 더했습니다. 모든 실행형 프로젝트에 업종 맞춤 AX 실행안을 포함하고, 필요한 경우 기업인증과 고용지원금까지 성장 순서에 맞게 연결합니다.',
  emphasis: '서류만 남는 컨설팅이 아니라, 자금과 시스템이 함께 남는 컨설팅.',
  labels: ['관리자 웹', '현장 모바일', '업무 데이터 연결', '클릭형 프로토타입', '작동형 MVP 확장'],
  slides: [
    { img: v2(110, 'fieldcare-showcase', 'land', 'FieldCare 시설관리 방문·현장 운영 대표 화면', ''), brand: 'FieldCare', label: '시설관리 · 방문·현장 운영' },
    { img: v2(107, 'leaseflow-showcase', 'land', 'LeaseFlow 임대·건물관리 통합 운영 대표 화면', ''), brand: 'LeaseFlow', label: '임대·건물관리 · 통합 운영' },
    { img: v2(101, 'garageos-showcase', 'land', 'GarageOS 자동차 정비 작업 운영 대표 화면', ''), brand: 'GarageOS', label: '자동차 정비 · 작업 운영' },
  ],
  mobile: v2(109, 'fieldcare-mobile', 'port', 'FieldCare 현장직원용 모바일 체크리스트·완료보고 화면', '시설관리 · 현장 모바일'),
}

/** 문제→AX 화면 섹션 보조 사례(사진 85 건설 · 86 예약·서비스) */
export const AX_TRANSFORM_ASIDE = {
  construction: v2(85, 'construction-admin', 'land', '건설 현장관리 관리자 화면 보조 예시', '건설 현장관리'),
  reservation: v2(86, 'reservation-transform', 'land', '예약·고객관리 CRM 전환 화면 보조 예시', '예약·고객관리'),
}

// ══════════════════════════════════════════════════════════════════════════
// AX SHOWCASE CATALOG — 통합 쇼케이스(사진 1~110) 단일 소스.
// 신규 8개 브랜드(NEW_INDUSTRIES) + 기존 6개 업종(AX_INDUSTRY_TABS)을 한 배열로.
// 화면종류 키: integrated(통합) · desktop/admin(관리자·PC) · mobile/field(현장·모바일).
// 실제 이미지가 있는 키만 포함한다. (준비된 화면 없음 → 카드 세그먼트 disabled)
// ══════════════════════════════════════════════════════════════════════════

export type ScreenTypeKey = 'integrated' | 'desktop' | 'admin' | 'mobile' | 'field'
export type ShowcaseCatalogImages = Partial<Record<ScreenTypeKey, ShowcaseImg>>
export type ShowcaseCatalogEntry = {
  id: string
  solutionName: string
  brandName: string
  category: string
  description: string
  features: string[]
  images: ShowcaseCatalogImages
  photoNumbers: number[]
  prototypeType: string
  sourceType: 'new' | 'legacy'
}

/** 신규 브랜드 category(브랜드 label 기반, 병원·의원/학원·교육은 고객서비스로 통합) */
const NEW_CATEGORY: Record<string, string> = {
  staydeck: '숙박·호텔',
  garageos: '자동차 정비',
  fieldcare: '시설관리',
  siteflow: '건설·현장',
  storepulse: '외식·프랜차이즈',
  careflow: '병원·의원',
  classpilot: '학원·교육',
  leaseflow: '임대·건물관리',
}
/** 기존 6개 업종 category(스펙 매핑) */
const LEGACY_CATEGORY: Record<string, string> = {
  mfg: '생산·제조',
  wms: '물류·유통',
  reservation: '예약·CRM',
  rnd: '연구소·R&D',
  b2b: 'B2B·영업',
  equip: '기업운영',
}

/** 신규 브랜드 → 카탈로그 엔트리 (integrated=대표, desktop=PC, mobile=모바일) */
function newCatalogEntry(ind: ShowcaseIndustry): ShowcaseCatalogEntry {
  const images: ShowcaseCatalogImages = { integrated: ind.representative }
  const photoNumbers = [ind.representative.no]
  if (ind.pc) {
    images.desktop = ind.pc
    photoNumbers.push(ind.pc.no)
  }
  if (ind.mobile) {
    images.mobile = ind.mobile
    photoNumbers.push(ind.mobile.no)
  }
  return {
    id: ind.key,
    solutionName: ind.brand,
    brandName: ind.brand,
    category: NEW_CATEGORY[ind.key] ?? ind.label,
    description: ind.desc,
    features: ind.features,
    images,
    photoNumbers,
    prototypeType: ind.prototypeLevel,
    sourceType: 'new',
  }
}

/** 기존 이미지들을 화면종류 슬롯으로 분배(첫 번째=통합, 나머지는 데스크톱/모바일 성격에 맞춰 truthful 배치) */
function legacyCatalogImages(imageNos: number[]): ShowcaseCatalogImages {
  const [first, ...rest] = imageNos
  const images: ShowcaseCatalogImages = { integrated: legacy(first) }
  const deskSlots: ScreenTypeKey[] = ['desktop', 'admin']
  const mobileSlots: ScreenTypeKey[] = ['mobile', 'field']
  let di = 0
  let mi = 0
  for (const no of rest) {
    const im = AX_IMAGES[no]
    const mobileLike = im.screen.includes('모바일') || im.h > im.w
    if (mobileLike) {
      const slot = mobileSlots[mi] ?? deskSlots[di]
      if (mobileSlots[mi]) mi += 1
      else di += 1
      images[slot] = legacy(no)
    } else {
      const slot = deskSlots[di] ?? mobileSlots[mi]
      if (deskSlots[di]) di += 1
      else mi += 1
      images[slot] = legacy(no)
    }
  }
  return images
}

/** 기존 업종 탭 → 카탈로그 엔트리 */
function legacyCatalogEntry(t: AxIndustryTab): ShowcaseCatalogEntry {
  const first = t.imageNos[0]
  return {
    id: `legacy-${t.key}`,
    solutionName: t.label,
    brandName: '',
    category: LEGACY_CATEGORY[t.key] ?? t.label,
    description: t.desc,
    features: ax(first).features,
    images: legacyCatalogImages(t.imageNos),
    photoNumbers: [...t.imageNos],
    prototypeType: ax(first).level === '작동형 화면 예시' ? '작동형 화면 예시' : '클릭형 프론트엔드 프로토타입',
    sourceType: 'legacy',
  }
}

const NEW_BY_KEY = new Map(NEW_INDUSTRIES.map((i) => [i.key, i] as const))
const NEW_CATALOG = AX_QUICKNAV_KEYS.map((k) => NEW_BY_KEY.get(k)).filter((i): i is ShowcaseIndustry => Boolean(i)).map(newCatalogEntry)
const LEGACY_CATALOG = AX_INDUSTRY_TABS.map(legacyCatalogEntry)

/** 통합 쇼케이스 단일 소스 — 신규 8 + 기존 6 = 14 엔트리 */
export const AX_SHOWCASE_CATALOG: ShowcaseCatalogEntry[] = [...NEW_CATALOG, ...LEGACY_CATALOG]

/** 필터 우선순위(존재하는 category만 노출, 목록 밖 category는 뒤에 append) */
const FILTER_PRIORITY = ['숙박·호텔', '자동차 정비', '시설관리', '건설·현장', '생산·제조', '물류·유통', '연구소·R&D', 'B2B·영업', '예약·CRM', '고객서비스', '기업운영']
const PRESENT_CATEGORIES = new Set(AX_SHOWCASE_CATALOG.map((e) => e.category))
export const AX_SHOWCASE_FILTERS: string[] = [
  '전체',
  ...FILTER_PRIORITY.filter((c) => PRESENT_CATEGORIES.has(c)),
  ...[...PRESENT_CATEGORIES].filter((c) => !FILTER_PRIORITY.includes(c)),
]
