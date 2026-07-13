// 사업자·법적 고지 단일 소스 — 푸터·법적 페이지·결제 안내가 모두 이 파일을 참조합니다.
// ⚠️ 공개 표시 금지(절대 이 파일에 넣지 마세요): 대표자 생년월일, 주민등록번호,
//    API/Webhook Secret, Supabase Service Role Key, 사업자등록증 QR/이미지, 카드정보, 내부 관리자 메모.
// 통신판매업 신고번호·대표 전화번호는 '확인된 값이 있을 때만' 채워주세요. null 이면 화면에서 줄 자체가 숨겨집니다.

export const businessInfo = {
  /** 서비스/브랜드 표기명 */
  serviceName: '미래 AI 랩',
  serviceNameEn: 'Mirae AI Lab',
  /** 사업자등록증상 상호 */
  companyName: '미래에이아이랩',
  /** 대표자 성명 (생년월일 등은 절대 표기하지 않음) */
  representative: '김상호',
  /** 사업자등록번호 */
  businessNumber: '657-68-00733',
  /** 업태 / 종목 */
  businessCategory: '정보통신업',
  businessItem: '응용 소프트웨어 개발 및 공급업',
  /** 사업장 주소 */
  address: '경기도 남양주시 별내중앙로 26, 5층 504호 엠15호',

  /** 고객 문의 이메일 (개인 휴대전화 번호는 공개하지 않음) */
  contactEmail: 'sanghohoho0813@gmail.com',
  /** 공개 대표 전화번호 — 확인된 공개 번호가 없으면 null 로 두세요(줄 숨김). 개인 휴대전화 금지. */
  contactPhone: null as string | null,
  /** 통신판매업 신고번호 — 확인된 번호가 없으면 null. 임의 생성 금지(줄 숨김). */
  mailOrderSalesNumber: null as string | null,
  /** 개인정보 보호책임자 (문의 창구는 위 이메일과 동일하게 운영) */
  privacyOfficer: '김상호',

  /** 법적 문서 시행/개정일 (개정 시 함께 갱신) */
  legalEffectiveDate: '2026-07-13',
  legalLastUpdated: '2026-07-13',
} as const

/** 법적 페이지 라우트 (푸터·크로스링크 공용) */
export const legalLinks = [
  { to: '/terms', label: '이용약관' },
  { to: '/privacy', label: '개인정보처리방침' },
  { to: '/refund-policy', label: '환불·취소 정책' },
  { to: '/business-info', label: '사업자정보' },
] as const

/** 사업자 정보 요약 한 줄 (푸터/결제 등 좁은 영역용) */
export function businessInfoInline(): string {
  const b = businessInfo
  const parts = [
    `${b.companyName}`,
    `대표 ${b.representative}`,
    `사업자등록번호 ${b.businessNumber}`,
  ]
  if (b.mailOrderSalesNumber) parts.push(`통신판매업 ${b.mailOrderSalesNumber}`)
  return parts.join(' · ')
}
