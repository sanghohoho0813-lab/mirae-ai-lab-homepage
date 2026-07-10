// 기업 성장진단 — 검증된 혜택의 공식 출처 (수치·세제형 혜택 표시 조건).
// ⚠️ 제도는 변경될 수 있습니다. verifiedAt 이 오래됐거나 확인이 어려우면 수치를 숨기고
//    정성(qualitative) 문구만 노출하세요. 개정 시 이 파일만 수정합니다.
import type { BenefitSource } from '../types/businessDiagnosis'

export const SOURCE_VERIFIED_AT = '2026-07-10'

export const benefitSources: Record<string, BenefitSource> = {
  ventureTaxReduction: {
    name: '국가법령정보센터 · 조세특례제한법 제6조(창업중소기업 등에 대한 세액감면)',
    url: 'https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000022353',
    verifiedAt: SOURCE_VERIFIED_AT,
  },
  rndTaxCredit: {
    name: '한국산업기술진흥협회 · R&D 조세지원 안내',
    url: 'https://www.koita.or.kr/conts/104003001000000.do',
    verifiedAt: SOURCE_VERIFIED_AT,
  },
  innobiz: {
    name: '이노비즈 공식 우대지원 안내',
    url: 'https://www.innobiz.net/intro/intro3_1.asp',
    verifiedAt: SOURCE_VERIFIED_AT,
  },
  smartFactory: {
    name: '스마트공장 사업관리시스템',
    url: 'https://www.smart-factory.kr/',
    verifiedAt: SOURCE_VERIFIED_AT,
  },
}
