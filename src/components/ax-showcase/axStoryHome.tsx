// 홈 스토리 인포그래픽 섹션 (v2).
// 히어로 이후의 설명 흐름은 Drive 폴더의 번호 순서(1-1 … 10-4)를 단일 출처로 사용한다.
// 이미지 사이에 끼는 인터랙티브 섹션(Industry AX Preview 10 · 고객 플랫폼 5 · 아이디어 MVP 10 · REAL CLIENT AX 6)은
// 이미지에 표시된 자리(7-2, 8-5) 바로 다음에 BusinessServicesPage 가 배치한다.
import { AX_PLATFORM_SAMPLES } from '../../data/portfolioSamples'
import { AX_STORY_V2_IMAGES, AX_STORY_V2_ROOT } from '../../data/axHomeStoryV2'

type StoryTone = 'dark' | 'light'

type StoryImage = {
  src: string
  alt: string
  bg: string
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
                width={941}
                height={1672}
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
    return { src: `${AX_STORY_V2_ROOT}/${name}.webp`, alt: meta?.alt ?? name, bg: meta?.bg ?? '#171B20' }
  })
  return <AxInfographicStack id={id} tone={tone} images={images} />
}

const CUSTOMER_PLATFORM_LINKS = [
  {
    industry: '음식점',
    flow: '예약, 재방문, 고객 주문',
    sample: AX_PLATFORM_SAMPLES.find((sample) => sample.slug === 'gounsot')!,
  },
  {
    industry: '헤어숍',
    flow: '예약, 시술이력, 재예약',
    sample: AX_PLATFORM_SAMPLES.find((sample) => sample.slug === 'lumiere')!,
  },
  {
    industry: '정비소',
    flow: '차량이력, 다음 정비, 예약',
    sample: AX_PLATFORM_SAMPLES.find((sample) => sample.slug === 'autobridge')!,
  },
  {
    industry: '학원',
    flow: '상담, 출결, 재등록',
    sample: AX_PLATFORM_SAMPLES.find((sample) => sample.slug === 'edumaster')!,
  },
  {
    industry: '제조업',
    flow: '견적, 재주문, 납기',
    sample: AX_PLATFORM_SAMPLES.find((sample) => sample.slug === 'seum')!,
  },
] as const

/** 업종에 맞는 고객 플랫폼은 이렇게 달라집니다 — 고객 화면 5개 (기존 섹션 보존) */
export function AxIndustryPlatformLinks() {
  return (
    <section id="customer-platforms" className="scroll-mt-16 overflow-hidden bg-[#FCFCFC]">
      <div className="mx-auto max-w-[989px] px-0 pb-5 sm:px-6 sm:pb-8">
        <div className="mx-auto max-w-[941px] bg-[#FCFCFC] px-7 py-14 sm:px-12 sm:py-18">
          <h2 className="break-keep text-[2.1rem] font-black leading-[1.22] tracking-[-0.01em] text-[#171B20] sm:text-[3.05rem]">
            업종에 맞는<br />
            <span className="text-[#D47A4A]">고객 플랫폼</span>은<br className="sm:hidden" /> 이렇게 달라집니다
          </h2>
          <p className="mt-4 max-w-2xl break-keep text-[1.0rem] leading-relaxed text-[#6B7680] sm:text-[1.08rem]">
            업종별 업무를 가정해 구현한 Concept Prototype이며, 실제 구축 시 해당 기업의 업무와 프로세스에 맞춰 새롭게 설계합니다.
          </p>
          <div className="mt-8 grid gap-3.5">
            {CUSTOMER_PLATFORM_LINKS.map(({ industry, flow, sample }) => {
              const href = sample.customerUrl ?? sample.axUrl
              const label = sample.customerLabel ?? '고객 화면'
              return (
                <article key={sample.slug} className="grid gap-3 rounded-2xl border border-[#E7EAEE] bg-white p-3.5 shadow-[0_12px_30px_rgba(23,27,32,0.07)] sm:grid-cols-[144px_1fr_auto] sm:items-center sm:gap-4 sm:p-4">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl bg-[#343B44]"
                    aria-label={`${industry} ${label} Preview 보기`}
                  >
                    <img
                      src={sample.imgSm}
                      alt={sample.alt}
                      width={720}
                      height={450}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03] sm:h-[90px]"
                    />
                  </a>
                  <div className="min-w-0">
                    <p className="break-keep text-[1.38rem] font-black leading-snug text-[#171B20] sm:text-[1.55rem]">{industry}</p>
                    <p className="mt-1 break-keep text-[1.02rem] font-bold leading-snug text-[#6B7680] sm:text-[1.1rem]">{flow}</p>
                    <p className="mt-1 truncate text-[0.9rem] font-semibold text-[#A36A4B]">{sample.name}</p>
                  </div>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl bg-[#D47A4A] px-4 text-[1.02rem] font-black text-[#171B20] shadow-sm shadow-[#D47A4A]/15 transition-colors hover:bg-[#E8B89A] sm:px-5"
                  >
                    Preview 보기 <span aria-hidden className="ml-1">↗</span>
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
