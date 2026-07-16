// 결제 시스템 운영 스위치.
// 카드 PG 심사 대기 등으로 카드결제를 잠시 닫아야 할 때 paymentsEnabled 를 false 로 두면,
// 사이트의 모든 '결제하기' CTA 가 '상담 신청(구글폼)' 으로 우회되고 '결제 준비 중' 안내가 노출됩니다.
// 카드 심사가 끝나면 이 값을 true 로만 바꾸면 기존 카드결제 흐름이 그대로 복구됩니다.
// (서버 결제 로직·PortOne·웹훅은 건드리지 않습니다. 프론트 CTA 라우팅만 바뀝니다.)
import { consultLinks } from './businessInfo'

export const paymentsEnabled = false

/** 결제 대체 상담 링크 — 구글폼(계좌이체 등 안내) */
export const inquiryUrl = consultLinks.googleForm

/** 결제 준비 중 안내 문구 (결제형 상품의 상담 CTA 하단 등에 노출) */
export const paymentsPreparingNotice =
  '현재 카드 결제 시스템을 준비 중입니다. 상담을 신청해 주시면 계좌이체 등으로 빠르게 안내해 드립니다.'
