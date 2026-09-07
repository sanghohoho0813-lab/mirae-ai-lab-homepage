// 홈 스토리 인포그래픽 섹션 (v2).
// 히어로 이후의 설명 흐름은 Drive 폴더의 번호 순서(1-1 … 13-5)를 단일 출처로 사용한다.
// 이미지 사이에 끼는 인터랙티브 섹션(Industry AX Preview 10 · 아이디어 MVP 10 · REAL CLIENT AX 6)은
// 이미지에 표시된 자리(7-2, 8-5) 바로 다음에 BusinessServicesPage 가 배치한다.
// 각 이미지는 여백·장식 사진을 잘라낸 크기가 다르므로 width/height 를 데이터에서 가져온다 (레이아웃 시프트 방지).
import { AX_STORY_V2_IMAGES, AX_STORY_V2_ROOT } from '../../data/axHomeStoryV2'

type StoryTone = 'dark' | 'light'

type StoryImage = {
  src: string
  alt: string
  bg: string
  width: number
  height: number
  gapClass?: string
  outerClass?: string
  innerClass?: string
}

type StorySectionProps = {
  id?: string
  tone?: StoryTone
  images: readonly StoryImage[]
}

function AxInfographicStack({ id, tone = 'dark', images }: StorySectionProps) {
  const sectionClass = tone === 'dark'
    ? 'scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#171B20]'
    : 'scroll-mt-16 overflow-hidden border-t border-[#E7EAEE] bg-[#FAFAF8]'

  return (
    <section id={id} className={sectionClass}>
      {images.map((image) => (
        <div key={image.src} className={image.gapClass ?? 'pb-5 sm:pb-8'} style={{ background: image.bg }}>
          <div className={image.outerClass ?? 'mx-auto max-w-[989px] px-0 sm:px-6'}>
            <div className={image.innerClass ?? 'mx-auto max-w-[941px]'}>
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

/** v2 이미지 묶음 — names 는 '1-1' 같은 파일 이름. 첫 이미지는 첫 화면에 가까우면 eager 로 바꾸지 않고 브라우저에 맡긴다. */
export function AxStoryImages({ names, id, tone }: { names: readonly string[]; id?: string; tone?: StoryTone }) {
  const images: StoryImage[] = names.map((name) => {
    const meta = AX_STORY_V2_IMAGES[name]
    return {
      src: `${AX_STORY_V2_ROOT}/${name}.webp`,
      alt: meta?.alt ?? name,
      bg: meta?.bg ?? '#171B20',
      width: meta?.w ?? 941,
      height: meta?.h ?? 1672,
    }
  })
  return <AxInfographicStack id={id} tone={tone} images={images} />
}
