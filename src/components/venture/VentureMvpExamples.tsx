// 예를 들면 — 미래AI랩 자체 데모 MVP 10개를 '이런 회사가, 이런 기술사업을' 틀로 보여 준다.
// 개발사 메뉴판(쇼핑몰·예약·구독…)처럼 보이지 않게, '지금 하는 사업 → 새 기술사업' 순서로 읽히게 한다.
//  - 카드 전체가 링크다. 누르면 실제로 작동하는 데모가 새 탭으로 열린다(noopener).
//  - 폰·태블릿은 가로 한 줄 카드(썸네일 + 글) 목록, PC 는 다섯 칸 × 두 줄.
// ⚠️ 고객사 사례가 아니다 — 아래에 '자체 데모'라고 분명히 적는다. 없는 성과·숫자는 붙이지 않는다.
import { PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'

const EXAMPLES: { from: string; to: string; slug: string }[] = [
  { from: '동네 반려동물 미용실', to: '예약·재방문 관리 플랫폼', slug: 'pawbeauty' },
  { from: '농산물 유통 회사', to: '산지직송 신선식품 커머스', slug: 'localmom' },
  { from: '전문가 상담 사무소', to: '전문가 상담 매칭 플랫폼', slug: 'expertmatch' },
  { from: '동네 보습학원', to: '온라인 학습·진도관리 플랫폼', slug: 'eduplaza' },
  { from: '회계·경영 자문 사무소', to: 'AI 경영데이터 분석 서비스', slug: 'insightai' },
  { from: '반려견 훈련·돌봄 센터', to: '유기견 산책 봉사 매칭', slug: 'rescuewalk' },
  { from: '카페·공유오피스 운영 회사', to: '작업하기 좋은 카페 지도', slug: 'cafefocus' },
  { from: 'IT 보안·유지보수 회사', to: 'AI 사기문자 판독 서비스', slug: 'scamshield' },
  { from: '반찬·식자재 판매점', to: '냉장고 식재료 관리 앱', slug: 'freshfridge' },
  { from: '옷가게·의류 쇼핑몰', to: 'AI 코디 점검 서비스', slug: 'stylecheck' },
]

export default function VentureMvpExamples() {
  const items = EXAMPLES.flatMap((e) => {
    const demo = PORTFOLIO_SAMPLES.find((s) => s.slug === e.slug)
    return demo ? [{ ...e, demo }] : []
  })

  return (
    <section data-mvp-examples className="border-b border-[#E7EAEE] bg-[#FAFAF8]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-[1rem] font-black text-[#B35A2A]">예를 들면</p>
        <h2 className="mt-2 break-keep text-[1.75rem] font-black leading-tight tracking-tight text-[#171B20] sm:text-[2.2rem]">
          이런 회사가,
          <br className="sm:hidden" /> 이런 기술사업을
        </h2>
        <p className="mt-3 max-w-2xl break-keep text-[1.02rem] leading-relaxed text-[#646E78] sm:text-[1.08rem]">
          만든 화면은 심사위원이나 투자자 앞에서 직접 눌러 보여 드릴 수 있어요. 말로만 하던 사업계획이 눈에 보이는 근거가 돼요.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <p className="flex items-center gap-2 text-[0.9rem] font-bold">
            <span className="text-[#646E78]">지금 하는 사업</span>
            <span aria-hidden className="text-[#D47A4A]">
              →
            </span>
            <span className="text-[#B35A2A]">새 기술사업</span>
          </p>
          <p className="break-keep text-[0.85rem] font-semibold text-[#8A939C]">누르면 실제로 작동하는 데모가 새 창으로 열려요 ↗</p>
        </div>

        <ul data-mvp-examples-list className="mt-3 grid gap-2.5 md:grid-cols-2 md:gap-3 lg:grid-cols-5 lg:gap-4">
          {items.map(({ from, to, demo }) => (
            <li key={demo.slug} className="flex">
              <a
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${from} → ${to}: ${demo.name} 데모 직접 눌러 보기 (새 탭에서 열림)`}
                data-mvp-example={demo.slug}
                className="group flex w-full items-center gap-3.5 rounded-2xl border border-[#E7EAEE] bg-white p-2.5 pr-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#D47A4A]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D47A4A] motion-reduce:hover:translate-y-0 lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-hidden lg:p-0"
              >
                <div className="w-[6.5rem] shrink-0 overflow-hidden rounded-xl border border-[#E7EAEE] bg-slate-50 min-[400px]:w-[7.5rem] lg:w-full lg:rounded-none lg:border-0 lg:border-b">
                  <img
                    src={demo.imgSm}
                    alt=""
                    width={720}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="min-w-0 flex-1 lg:flex lg:flex-col lg:p-4">
                  <p className="break-keep text-[0.88rem] font-semibold leading-snug text-[#646E78]">{from}</p>
                  <p className="mt-1 break-keep text-[1.02rem] font-black leading-snug text-[#171B20]">
                    <span aria-hidden className="text-[#D47A4A]">
                      →{' '}
                    </span>
                    {to}
                  </p>
                  <p className="mt-3 hidden text-[0.82rem] font-bold text-[#B35A2A] lg:mt-auto lg:block lg:pt-3">
                    {demo.name} 열어 보기 <span aria-hidden>↗</span>
                  </p>
                </div>
                <span aria-hidden className="shrink-0 text-[1.1rem] font-bold text-[#B35A2A] lg:hidden">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 break-keep text-[0.85rem] leading-relaxed text-[#8A939C]">
          위 화면은 미래AI랩이 직접 만든 자체 데모예요. 고객사 사례가 아니고, 실제로는 대표님 회사 사업에 맞춰 새로 설계해요.
        </p>
      </div>
    </section>
  )
}
