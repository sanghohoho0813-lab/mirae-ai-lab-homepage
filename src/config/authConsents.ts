// 회원가입 약관 동의 항목 — 문구·버전을 한 곳에서 관리합니다.
// 문구를 수정하면 version 을 올려주세요 (user_consents 에 버전별로 기록됩니다).

export type ConsentKey = 'terms' | 'privacy' | 'age14' | 'identity' | 'marketing'

export type ConsentItem = {
  key: ConsentKey
  label: string
  required: boolean
  version: string
  /** 상세 보기 링크 (없으면 미표시) */
  link?: string
  /** 링크 대신 인라인으로 보여줄 짧은 설명 */
  detail?: string
}

export const AUTH_CONSENTS: ConsentItem[] = [
  {
    key: 'terms',
    label: '이용약관 동의',
    required: true,
    version: '2026-07-13.1',
    link: '/terms',
  },
  {
    key: 'privacy',
    label: '개인정보 수집·이용 동의',
    required: true,
    version: '2026-07-13.1',
    link: '/privacy',
  },
  {
    key: 'age14',
    label: '만 14세 이상입니다',
    required: true,
    version: '2026-07-13.1',
    detail: '미래 AI 랩은 만 14세 미만 아동의 가입을 받지 않습니다.',
  },
  {
    key: 'identity',
    label: '본인인증 및 계정 생성에 필요한 정보 처리 동의',
    required: true,
    version: '2026-07-13.1',
    link: '/privacy#identity',
  },
  {
    key: 'marketing',
    label: '지원제도·기업정보 안내 수신 동의 (선택)',
    required: false,
    version: '2026-07-13.1',
    detail: '정책자금·지원사업 등 기업에 도움이 되는 정보를 보내드립니다. 동의하지 않아도 가입할 수 있습니다.',
  },
]

export const REQUIRED_CONSENT_KEYS = AUTH_CONSENTS.filter((c) => c.required).map((c) => c.key)

/** 본인인증(본인확인기관) 안내 — 실제 계약 기관 확정 전에는 일반 문구 사용 (허위 업체명 금지) */
export const IDENTITY_PROVIDER_NOTICE = {
  /** 계약 확정 후 실제 인증사업자명으로 교체 (예: 'KG이니시스(통신사 PASS)') */
  providerName: null as string | null,
  fallbackText: '포트원(PortOne)을 통해 연결된 본인확인기관',
}
