// 2주 기술사업 빌드 — 런칭 파트너 특가(300만원) 선착순 자리. 숫자는 이 파일만 고친다.
// 상세 첫 화면 가격 상자 · 서비스 선택 01 카드 · 자주 묻는 질문 · 검색 설명이 같이 바뀐다.
// 대표님 요청(2026-10): 선착순 5개사 중 마지막 1개사만 남은 것으로 표시.

export const VENTURE_SLOTS_TOTAL = 5
export const VENTURE_SLOTS_LEFT = 1
/** 이미 찬 자리 */
export const VENTURE_SLOTS_TAKEN = VENTURE_SLOTS_TOTAL - VENTURE_SLOTS_LEFT

const LEFT_WORD = VENTURE_SLOTS_LEFT === 1 ? '마지막 1개사' : `${VENTURE_SLOTS_LEFT}개사`

/** 배지 — '선착순 5개사' */
export const VENTURE_SLOTS_TITLE = `선착순 ${VENTURE_SLOTS_TOTAL}개사`
/** 짧은 상태 — '마지막 1개사 남음' */
export const VENTURE_SLOTS_LEFT_SHORT = `${LEFT_WORD} 남음`
/** 남은 자리 강조 말 — '마지막 1개사' */
export const VENTURE_SLOTS_LEFT_WORD = LEFT_WORD
/** 검색 설명 · 읽기 프로그램용 한 줄 — '선착순 5개사 중 마지막 1개사 남음' */
export const VENTURE_SLOTS_LINE = `선착순 ${VENTURE_SLOTS_TOTAL}개사 중 ${LEFT_WORD} 남음`
/** 자주 묻는 질문 — '지금은 **마지막 1개사**만 남아 있어요.' */
export const VENTURE_SLOTS_FAQ = `지금은 **${LEFT_WORD}**${VENTURE_SLOTS_LEFT === 1 ? '만' : '가'} 남아 있어요.`
