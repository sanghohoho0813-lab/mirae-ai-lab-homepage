// AX 상세 안내 — 실제 현장 프로젝트(우리는 이렇게 만든다) 다음, 09 일반 개발회사와 무엇이 다른가(차별화) 직전에 온다.
// 흐름: 이렇게 AX를 만든다 → 그 구조를 기술자산으로 남긴다 → 그래서 일반 개발과 무엇이 다른가.
// 특허 자체를 자랑하는 섹션이 아니라 "업무구조까지 설계한다"는 주장의 근거로만 쓴다.
// 배지·메달·기관 로고 없이, 이 사이트가 쓰는 어두운 밴드 + 번호 목록 언어를 그대로 따른다.
import { AX_PATENT_META, AX_PATENT_TECHS } from '../../data/axPatentTech'

export default function AxPatentTechSection() {
  return (
    <section id="tech-assets" className="scroll-mt-16 border-t border-white/10 bg-[#171B20]">
      <div className="mx-auto max-w-[86rem] px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.1rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.2rem]">TECHNOLOGY &amp; IP</p>
        <h2 className="mx-auto mt-3 max-w-3xl break-keep text-center text-[1.7rem] font-black leading-[1.4] tracking-[-0.015em] text-white sm:text-[2.2rem]">
          미래AI랩은 화면만 만드는<br className="sm:hidden" /> 개발이 아닙니다.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl break-keep text-center text-[1.15rem] leading-[1.75] text-slate-300 sm:text-[1.25rem]">
          회사의 업무가 어떻게 판단되고, 어떻게 연결되고, <span className="font-bold text-[#E8B89A]">어떤 다음 행동으로 이어지는지까지</span> 설계합니다.
        </p>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.15rem] leading-[1.75] text-white sm:text-[1.25rem]">
          이 과정에서 만든 핵심 기술을 정리해 <b className="font-black text-[#D47A4A]">2026년 9월, AX 관련 특허 5건을 출원</b>했습니다.
        </p>

        {/* 5가지 기술영역 — 한 줄에 하나씩, 얇은 구분선으로만 나눈다(카드 반복 대신 밀도감) */}
        <ol className="mx-auto mt-10 max-w-4xl divide-y divide-white/10 border-y border-white/10 sm:mt-12">
          {AX_PATENT_TECHS.map((t) => (
            <li key={t.no} className="flex items-start gap-4 py-5 sm:items-center sm:gap-6 sm:py-6">
              <span aria-hidden className="mt-0.5 shrink-0 text-[1.0rem] font-black tracking-tight text-[#D47A4A] sm:mt-0 sm:text-[1.1rem]">
                {t.no}
              </span>
              <div className="min-w-0 flex-1">
                <p className="break-keep text-[1.2rem] font-black leading-snug text-white sm:text-[1.44rem]">{t.name}</p>
                <p className="mt-1.5 break-keep text-[0.98rem] leading-snug text-[#6B7680] sm:mt-2 sm:text-[1.06rem]">{t.sub}</p>
              </div>
              {/* 영문은 시각적 보조 — 좁은 화면에서는 한국어에 집중하도록 숨긴다 */}
              <span aria-hidden className="hidden shrink-0 text-[0.92rem] font-semibold tracking-[0.08em] text-[#6B7680] sm:block sm:text-[0.98rem]">
                {t.en}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-7 text-center text-[0.85rem] font-bold tracking-[0.22em] text-[#6B7680] sm:mt-8 sm:text-[0.92rem]">{AX_PATENT_META} 출원 완료</p>
      </div>
    </section>
  )
}
