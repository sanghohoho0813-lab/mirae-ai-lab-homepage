// AX 핵심기술 특허 출원 — 첫 진입화면의 작은 신뢰영역과 AX 상세 안내의 기술자산 섹션이 함께 쓴다.
//
// 표기 원칙 (지키지 않으면 사실과 다른 주장이 된다)
//  - "출원"만 쓴다. 등록·보유·인증·독점 같은 표현은 쓰지 않는다.
//  - 출원번호와 출원번호통지서는 공개하지 않는다.
//  - 특허 자체를 자랑하지 않고, "업무구조까지 설계하는 회사"라는 근거로만 쓴다.

export const AX_PATENT_COUNT = 5

/** 5건 출원이 모두 끝난 날짜. 출원번호는 쓰지 않고 이 날짜까지만 밝힌다. */
export const AX_PATENT_FILED_ON = '2026. 9. 11.'
export const AX_PATENT_FILED_LABEL = `${AX_PATENT_FILED_ON} 출원 완료`
export const AX_PATENT_META = `PATENT APPLICATIONS · ${AX_PATENT_COUNT} · ${AX_PATENT_FILED_ON}`

/** 첫 진입화면 신뢰영역 문구 */
export const AX_PATENT_PROOF = {
  lead: '미래AI랩은 AX를 단순 개발이 아닌 회사의 기술자산으로 설계합니다.',
  sub: '업무 자동화 · 다음 행동 추천 · 기업 상태 분석 등 AX 핵심기술 특허 5건 출원',
} as const

/** 상세 안내 섹션의 5가지 기술영역 — 한국어가 먼저 읽히고, 영문은 시각적 보조다. */
export const AX_PATENT_TECHS = [
  { no: '01', name: '업무 상태 자동 연결', sub: '이벤트 기반 상태 동기화', en: 'Event / State / Sync' },
  { no: '02', name: '필요한 업무·자료 재산정', sub: '동적 요구사항 재산정', en: 'Requirement / Recalculation' },
  { no: '03', name: '다음 행동 추천', sub: '상태기반 후속행동 산정', en: 'State / Next Action' },
  { no: '04', name: '회사별 맞춤 업무구조', sub: '메타데이터 기반 멀티테넌트 업무처리', en: 'Metadata / Multi-tenant' },
  { no: '05', name: '기업 상태와 기회요건 분석', sub: '충족차이 기반 기회평가', en: 'Gap / Action / Opportunity' },
] as const
