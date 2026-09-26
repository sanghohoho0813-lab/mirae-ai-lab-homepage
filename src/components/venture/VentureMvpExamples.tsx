// 예를 들면 — 미래AI랩 자체 데모 MVP 를 '이런 회사가, 이런 기술사업을' 틀로 보여 준다.
// 개발사 메뉴판(쇼핑몰·예약·구독…)처럼 보이지 않게, '지금 하는 사업 → 기술사업 → 심사·투자자 앞에서 눌러 보여 줄 화면'
// 순서로 읽히게 한다.
// ⚠️ 고객사 사례가 아니다 — 아래에 '자체 데모'라고 분명히 적는다. 없는 성과·숫자는 붙이지 않는다.
import { PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'

const EXAMPLES: { from: string; to: string; slug: string }[] = [
  { from: '동네 반려동물 미용실', to: '예약·재방문 관리 플랫폼', slug: 'pawbeauty' },
  { from: '농산물 유통 회사', to: '산지직송 신선식품 커머스', slug: 'localmom' },
  { from: '전문가 상담 사무소', to: '전문가 상담 매칭 플랫폼', slug: 'expertmatch' },
]

export default function VentureMvpExamples() {
  const items = EXAMPLES.map((e) => ({ ...e, demo: PORTFOLIO_SAMPLES.find((s) => s.slug === e.slug) })).filter((e) => e.demo)

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

        {/* 폰에서는 옆으로 넘겨 보게 해 구간이 길어지지 않게, PC 에서는 세 칸 */}
        <p className="mt-6 text-[0.85rem] font-semibold text-[#8A939C] md:hidden">옆으로 넘겨 보세요 →</p>
        <ul
          data-mvp-examples-list
          className="-mx-5 mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:mx-0 md:mt-7 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map(({ from, to, demo }) => (
            <li key={to} className="flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#E7EAEE] bg-white shadow-sm min-[480px]:w-[62%] md:w-auto">
              <div className="border-b border-[#E7EAEE] bg-slate-50">
                <img src={demo!.imgSm} alt={demo!.alt} width={720} height={450} loading="lazy" decoding="async" className="block h-auto w-full" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[0.8rem] font-bold text-[#8A939C]">지금 하는 사업</p>
                <p className="mt-0.5 break-keep text-[1.05rem] font-bold text-[#343B44]">{from}</p>
                <p aria-hidden className="my-1.5 text-[#D47A4A]">
                  ↓
                </p>
                <p className="text-[0.8rem] font-bold text-[#B35A2A]">새 기술사업</p>
                <p className="mt-0.5 break-keep text-[1.15rem] font-black text-[#171B20]">{to}</p>
                <a
                  href={demo!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${demo!.name} 데모 직접 눌러 보기 (새 탭에서 열림)`}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 self-start rounded-xl border border-[#E7EAEE] px-3.5 text-[0.95rem] font-bold text-[#343B44] transition-colors hover:border-[#D47A4A]/60 hover:text-[#171B20]"
                >
                  {demo!.name} 직접 눌러 보기 <span aria-hidden>↗</span>
                </a>
              </div>
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
