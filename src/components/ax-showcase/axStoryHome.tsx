// 홈 스토리 인포그래픽 섹션 (v3) — Drive 폴더 1.1 … 12 (52장), PDF "AX 상세페이지 카피 14섹션 최종 압축본" 구성.
// 이미지에 그려진 버튼([음식점 AX 샘플 보기] · [정책자료 원문 보기] · [심사위원 인터뷰 영상 보기] · [10가지 샘플 보기])은
// 같은 자리에 투명 링크(hotspot)를 얹어 실제로 눌리게 한다. 업종 샘플은 AX_PLATFORM_SAMPLES 의 AX 화면으로 연결한다.
// 인터랙티브 섹션(Industry AX Preview 10 · 아이디어 MVP 10 · REAL CLIENT AX 6 · FAQ)은 BusinessServicesPage 가 이미지 사이에 두고,
// 특정 이미지 바로 아래 붙는 블록(정책자료 출처, 심사위원 영상)은 after 로 넘긴다.
import type { ReactNode } from 'react'
import { AX_PLATFORM_SAMPLES } from '../../data/portfolioSamples'
import { AX_STORY_V3_IMAGES, AX_STORY_V3_ROOT, type AxStoryV3Hotspot } from '../../data/axHomeStoryV3'

type StoryTone = 'dark' | 'light'

function resolveHref(h: AxStoryV3Hotspot): string | null {
  if (h.sample) return AX_PLATFORM_SAMPLES.find((s) => s.slug === h.sample)?.axUrl ?? null
  return h.href ?? null
}

/** 그려진 버튼 위의 투명 링크 — 마우스를 올리면 테두리가 살짝 빛나 눌리는 버튼임을 알 수 있게 한다 */
function Hotspot({ name, h }: { name: string; h: AxStoryV3Hotspot }) {
  const href = resolveHref(h)
  if (!href) return null
  const external = /^https?:/i.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={h.label}
      title={h.label}
      data-hotspot={name}
      className="absolute block rounded-2xl transition-shadow hover:shadow-[0_0_0_3px_rgba(212,122,74,0.6)] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(212,122,74,0.95)]"
      style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
    />
  )
}

/** v3 이미지 묶음 — names 는 '3-3' 같은 파일 이름. after 는 특정 이미지 바로 아래 붙일 블록 */
export function AxStoryImages({
  names,
  id,
  tone = 'dark',
  after,
}: {
  names: readonly string[]
  id?: string
  tone?: StoryTone
  after?: Partial<Record<string, ReactNode>>
}) {
  const sectionClass = tone === 'dark'
    ? 'scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#171B20]'
    : 'scroll-mt-16 overflow-hidden border-t border-[#E7EAEE] bg-[#FAFAF8]'

  return (
    <section id={id} className={sectionClass}>
      {names.map((name) => {
        const meta = AX_STORY_V3_IMAGES[name]
        return (
          <div key={name} className="pb-5 sm:pb-8" style={{ background: meta?.bg ?? '#171B20' }}>
            <div className="mx-auto max-w-[1134px] px-0 sm:px-6">
              <div className="relative mx-auto max-w-[1086px]">
                <img
                  src={`${AX_STORY_V3_ROOT}/${name}.webp`}
                  alt={meta?.alt ?? name}
                  width={meta?.w ?? 1086}
                  height={meta?.h ?? 1448}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
                {meta?.hotspots?.map((h, i) => (
                  <Hotspot key={`${name}-${i}`} name={name} h={h} />
                ))}
              </div>
              {after?.[name]}
            </div>
          </div>
        )
      })}
    </section>
  )
}
