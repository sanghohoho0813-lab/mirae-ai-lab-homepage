// 홈 스토리 인포그래픽 섹션.
// 히어로 이후의 설명 흐름은 Drive에서 정리한 이미지 순서를 단일 출처로 사용한다.
import { AX_PLATFORM_SAMPLES } from '../../data/portfolioSamples'

type StoryTone = 'dark' | 'light'

type StoryImage = {
  src: string
  alt: string
  bg: string
}

type StorySectionProps = {
  id?: string
  tone?: StoryTone
  images: readonly StoryImage[]
}

const STORY_ROOT = '/ax-home-story-clean'

function storyImage(name: string, alt: string, bg = '#171B20'): StoryImage {
  return { src: `${STORY_ROOT}/${name}`, alt, bg }
}

function AxInfographicStack({ id, tone = 'dark', images }: StorySectionProps) {
  const sectionClass = tone === 'dark'
    ? 'scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#171B20]'
    : 'scroll-mt-16 overflow-hidden border-t border-[#E7EAEE] bg-[#FAFAF8]'

  return (
    <section id={id} className={sectionClass}>
      {images.map((image) => (
        <div key={image.src} className="pb-5 sm:pb-8" style={{ background: image.bg }}>
          <div className="mx-auto max-w-[989px] px-0 sm:px-6">
            <div className="mx-auto max-w-[941px]">
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

const SECTION_02 = [
  storyImage('section-02-problem-01.png', '사업계획서만으로는 부족하며 실제 구현이 중요하다는 첫 번째 문제제기 1', '#0C0F15'),
  storyImage('section-02-problem-02.png', '사업계획서 이후 실제 구현 여부를 묻는 첫 번째 문제제기 2', '#FAFAF8'),
  storyImage('section-02-problem-03.png', '정책자금과 투자유치에서 실제 사업의 모습을 보여주는 힘을 설명하는 첫 번째 문제제기 3', '#050B11'),
  storyImage('section-02-problem-04.png', '작동하는 웹앱과 고객 화면과 데이터의 중요성을 설명하는 첫 번째 문제제기 4', '#FDFCFA'),
  storyImage('section-02-problem-05.png', '실제 사업을 움직이는 웹앱과 AX의 설명력을 말하는 첫 번째 문제제기 5', '#0F1317'),
] as const

const SECTION_03 = [
  storyImage('section-03-screen-01.png', '미래AI랩이 직접 기획하고 개발한 AX 웹앱 화면을 먼저 보여주는 안내', 'linear-gradient(90deg, #0C0F13 0%, #0C0F13 50%, #EEECEA 50%, #EEECEA 100%)'),
] as const

const SECTION_04 = [
  storyImage('section-04-ax-01.png', 'AX는 AI Transformation이며 회사가 일하는 방식을 바꾸는 것이라는 설명 1', '#FCFBF8'),
  storyImage('section-04-ax-02.png', '회사 안의 정보가 엑셀과 카카오톡과 ERP 등에 흩어져 있다는 설명 2', '#FEFDF9'),
  storyImage('section-04-ax-03.png', '한 번 생긴 정보가 다음 업무와 판단으로 이어지는 AX 구조 설명 3', '#0D1116'),
] as const

const SECTION_05 = [
  storyImage('section-05-erp-01.png', 'ERP와 AX의 역할 차이를 설명하는 비교 1', '#FCFBF8'),
  storyImage('section-05-erp-02.png', 'ERP 위에 판단과 실행의 층을 더하는 AX 설명 2', '#FBF9F6'),
] as const

const SECTION_06 = [
  storyImage('section-06-device-01.png', 'PC와 휴대폰으로 회사 전체를 보는 감각 설명 1', '#050B11'),
  storyImage('section-06-device-02.png', '클라우드 기반 AX에서 핵심 상황을 확인하고 판단하는 구조 설명 2', '#FAFAFA'),
] as const

const SECTION_07 = [
  storyImage('section-07-effect-01.png', 'AX 도입 효과 내부 운영이 가벼워지는 변화 1', '#0A1016'),
  storyImage('section-07-effect-02.png', 'AX 도입 효과 대표의 판단이 빨라지는 변화 2', '#F8F8F8'),
  storyImage('section-07-effect-03.png', 'AX 도입 효과 기존 고객에서 더 많은 매출을 만드는 변화 3', '#050B12'),
  storyImage('section-07-effect-04.png', 'AX 도입 효과 외부에도 보여줄 근거가 생기는 변화 4', '#FBFBFB'),
] as const

const SECTION_08_INTRO = [
  storyImage('section-08-platform-01.png', '고객 플랫폼이 붙으면 매출 구조가 달라진다는 설명 1', '#0B1117'),
  storyImage('section-08-platform-02.png', '업종과 규모에 맞는 고객용 플랫폼 예시 설명 2', '#0D1319'),
] as const

const SECTION_08_OUTRO = [
  storyImage('section-08-platform-04.png', '고객 플랫폼으로 쿠팡식 재구매 경험을 만드는 설명 4', '#0C1016'),
  storyImage('section-08-platform-05.png', '작은 고객 플랫폼이어도 직접 연결되는 통로가 중요하다는 설명 5', '#0B1218'),
] as const

const CUSTOMER_PLATFORM_LINKS = [
  {
    industry: '음식점',
    flow: '예약, 재방문, 고객 주문',
    sample: AX_PLATFORM_SAMPLES.find((sample) => sample.slug === 'gounsot')!,
  },
  {
    industry: '미용실',
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

const SECTION_09 = [
  storyImage('section-09-ceo-01.png', '대표가 더 바빠지는 회사가 좋은 성장인지 묻는 설명 1', '#0C131A'),
  storyImage('section-09-ceo-02.png', '사람이 더 바빠지는 회사가 아니라 회사가 더 똑똑해지는 구조 설명 2', '#0B1218'),
] as const

const SECTION_10 = [
  storyImage('section-10-not-ax-01.png', '모든 회사에 AX가 꼭 필요한 것은 아니라는 설명 1', '#F9F9F8'),
  storyImage('section-10-not-ax-02.png', '웹앱으로 구현 가능한 아이디어 예시 설명 2', '#FDFDFC'),
  storyImage('section-10-not-ax-03.png', '머릿속에 있던 아이디어를 일단 움직이게 만드는 설명 3', '#0D1318'),
] as const

const SECTION_11 = [
  storyImage('section-11-real-01.png', '실제 기업 업무와 데이터에도 AX를 적용하고 있다는 안내', 'linear-gradient(90deg, #070D15 0%, #070D15 50%, #FAFAF8 50%, #FAFAF8 100%)'),
] as const

const SECTION_12 = [
  storyImage('section-12-why-01.png', '왜 미래AI랩이어야 하는지 하나의 이야기로 연결해야 한다는 설명 1', 'linear-gradient(180deg, #171B20 0%, #171B20 50%, #FAFAF8 50%, #FAFAF8 100%)'),
  storyImage('section-12-why-02.png', '각자 따로 맡기면 전체 스토리가 어긋나기 쉽다는 설명 2', '#343B44'),
  storyImage('section-12-why-03.png', '미래AI랩은 사업 진단부터 Scale-up까지 하나의 흐름으로 본다는 설명 3', 'linear-gradient(180deg, #FAFAF8 0%, #FAFAF8 50%, #171B20 50%, #171B20 100%)'),
] as const

const SECTION_13 = [
  storyImage('section-13-scope-01.png', '필요하면 기업 구조와 기술자산과 시장 사업성까지 같이 본다는 설명 1', 'linear-gradient(180deg, #FAFAF8 0%, #FAFAF8 50%, #171B20 50%, #171B20 100%)'),
  storyImage('section-13-scope-02.png', '사업계획서와 정책자금과 정부지원사업까지 같은 논리 안에서 연결한다는 설명 2', '#0C151F'),
  storyImage('section-13-scope-03.png', '사업과 시스템과 근거를 먼저 만들고 사업계획서로 정리한다는 설명 3', '#0D141E'),
] as const

const SECTION_14 = [
  storyImage('section-14-industry-01.png', '우리 업종에도 AX나 플랫폼이 가능한지 업종별 화면을 확인하라는 안내', 'linear-gradient(90deg, #0F181E 0%, #0F181E 50%, #EFEFEE 50%, #EFEFEE 100%)'),
] as const

function AxIndustryPlatformLinks() {
  return (
    <section className="overflow-hidden bg-[#FCFCFC]">
      <div className="mx-auto max-w-[989px] px-0 pb-5 sm:px-6 sm:pb-8">
        <div className="mx-auto max-w-[941px] bg-[#FCFCFC] px-7 py-14 sm:px-12 sm:py-18">
          <h2 className="break-keep text-[2.1rem] font-black leading-[1.22] tracking-[-0.01em] text-[#171B20] sm:text-[3.05rem]">
            업종에 맞는<br />
            <span className="text-[#D47A4A]">고객 플랫폼</span>은<br className="sm:hidden" /> 이렇게 달라집니다
          </h2>
          <div className="mt-9 grid gap-3.5">
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
                    aria-label={`${industry} ${label} 샘플 보기`}
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
                    샘플 보기 <span aria-hidden className="ml-1">↗</span>
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

export function AxWhyNowSection() {
  return <AxInfographicStack id="why-now" images={SECTION_02} />
}

export function AxScreenIntroSection() {
  return <AxInfographicStack images={SECTION_03} />
}

export function AxDefinitionSection() {
  return <AxInfographicStack id="ax-definition" images={SECTION_04} />
}

export function AxErpComparisonSection() {
  return <AxInfographicStack images={SECTION_05} />
}

export function AxDeviceOperationSection() {
  return <AxInfographicStack images={SECTION_06} />
}

export function AxEffectSection() {
  return <AxInfographicStack images={SECTION_07} />
}

export function AxCustomerPlatformSection() {
  return (
    <>
      <AxInfographicStack images={SECTION_08_INTRO} />
      <AxIndustryPlatformLinks />
      <AxInfographicStack images={SECTION_08_OUTRO} />
    </>
  )
}

export function AxCeoBusySection() {
  return <AxInfographicStack images={SECTION_09} />
}

export function AxNotAlwaysNeededSection() {
  return <AxInfographicStack images={SECTION_10} />
}

export function AxRealProjectIntroSection() {
  return <AxInfographicStack images={SECTION_11} />
}

export function AxWhyMiraeSection() {
  return <AxInfographicStack id="why-mirae" images={SECTION_12} />
}

export function AxTogetherScopeSection() {
  return <AxInfographicStack images={SECTION_13} />
}

export function AxIndustryQuestionSection() {
  return <AxInfographicStack tone="light" images={SECTION_14} />
}
