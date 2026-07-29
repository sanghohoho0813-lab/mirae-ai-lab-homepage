// 30개 사업화 아이디어 인덱스 — 업종 15개 × 2개.
// 별도 원본을 두지 않고 axIndustryShowcaseV2 단일 소스에서 파생한다(데이터 중복 입력 금지).
import { AX_V2_INDUSTRIES, type AxV2Idea, type AxV2Industry } from './axIndustryShowcaseV2'

export type AxBusinessIdeaEntry = AxV2Idea & {
  industrySlug: string
  industryName: string
  industryIcon: string
}

export const AX_BUSINESS_IDEAS: AxBusinessIdeaEntry[] = AX_V2_INDUSTRIES.flatMap((ind: AxV2Industry) =>
  ind.ideas.map((idea) => ({
    ...idea,
    industrySlug: ind.slug,
    industryName: ind.displayName,
    industryIcon: ind.icon,
  })),
)

export function axIdeasOf(slug: string): AxBusinessIdeaEntry[] {
  return AX_BUSINESS_IDEAS.filter((i) => i.industrySlug === slug)
}

/** 데이터 정합성 자가검증 — 개발 중 실수(업종당 2개, 총 30개)를 즉시 잡는다. */
export const AX_IDEAS_TOTAL = AX_BUSINESS_IDEAS.length

if (import.meta.env.DEV) {
  const bad = AX_V2_INDUSTRIES.filter((i) => i.ideas.length !== 2).map((i) => i.slug)
  if (bad.length) console.error('[axBusinessIdeas] 업종당 아이디어가 2개가 아님:', bad)
  if (AX_IDEAS_TOTAL !== 30) console.error('[axBusinessIdeas] 총 아이디어 수가 30개가 아님:', AX_IDEAS_TOTAL)
  const badImages = AX_V2_INDUSTRIES.filter((i) => i.stages.length !== 5).map((i) => i.slug)
  if (badImages.length) console.error('[axBusinessIdeas] 5단계가 아닌 업종:', badImages)
}
