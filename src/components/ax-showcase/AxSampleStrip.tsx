import { useEffect, useRef } from 'react'
import { AX_PLATFORM_SAMPLES, PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'

// 히어로 바로 다음 — "말로 설명하기 전에 실제로 만든 화면부터" 한 줄.
// 22개(업종 AX 12 + 아이디어 MVP 10)를 가로 한 줄에 담아, 세로 공간을 적게 쓰면서
// 저절로 흐르게 둔다. 손을 대면(스와이프·휠·클릭) 흐름을 멈추고 평범한 가로 스크롤이 된다.
//
// 링크는 "그림에 보이는 화면"으로 보낸다 —
// AX 샘플 데이터는 대표 이미지가 고객 화면일 때만 axImg(미니 AX 화면)를 갖고 있으므로,
// axImg 가 있으면 고객 화면을, 없으면 AX 대시보드를 연다.

type StripItem = {
  key: string
  industry: string
  name: string
  img: string
  href: string
  alt: string
}

const items: StripItem[] = [
  ...AX_PLATFORM_SAMPLES.map((s) => ({
    key: `ax-${s.slug}`,
    industry: s.industry,
    name: s.name,
    img: s.imgSm,
    href: s.axImg && s.customerUrl ? s.customerUrl : s.axUrl,
    alt: s.alt,
  })),
  ...PORTFOLIO_SAMPLES.map((s) => ({
    key: `mvp-${s.slug}`,
    industry: s.kind,
    name: s.name,
    img: s.imgSm,
    href: s.url,
    alt: s.alt,
  })),
]

function Card({ item }: { item: StripItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[10.5rem] shrink-0 sm:w-[13.5rem]"
    >
      <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0E1318] shadow-lg shadow-black/30 transition-colors group-hover:border-[#D47A4A]/70">
        <img
          src={item.img}
          alt={item.alt}
          width={720}
          height={450}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-2 truncate text-[0.88rem] sm:text-[0.98rem]">
        <span className="font-bold text-[#E7EAEE]">{item.industry}</span>
        <span className="text-slate-500"> · {item.name}</span>
      </p>
    </a>
  )
}

export default function AxSampleStrip() {
  const rowRef = useRef<HTMLDivElement>(null)

  // 저절로 흐르는 가로 스크롤. 손을 대면 멈추고, 모션을 줄이는 설정이면 처음부터 흐르지 않는다.
  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let running = true
    // scrollLeft 은 정수로 반올림되므로, 0.4px 씩 더하려면 위치를 따로 쌓아두고 대입해야 한다
    let pos = el.scrollLeft
    const half = () => el.scrollWidth / 2

    const step = () => {
      if (!running) return
      pos += 0.4
      // 같은 목록을 두 벌 깔아두고, 한 벌을 지나면 처음으로 되돌려 끊김 없이 잇는다
      if (pos >= half()) pos -= half()
      el.scrollLeft = pos
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const opts = { once: true, passive: true } as const
    el.addEventListener('pointerdown', stop, opts)
    el.addEventListener('touchstart', stop, opts)
    el.addEventListener('wheel', stop, opts)
    el.addEventListener('mouseenter', stop, opts)

    return () => {
      stop()
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('touchstart', stop)
      el.removeEventListener('wheel', stop)
      el.removeEventListener('mouseenter', stop)
    }
  }, [])

  return (
    <section id="samples" className="scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#171B20] py-6 sm:py-10">
      <div className="mx-auto max-w-[1134px] px-5 sm:px-6">
        <p className="text-[0.74rem] font-black uppercase tracking-[0.2em] text-[#D47A4A] sm:text-[0.84rem]">
          AX SAMPLES · {items.length}
        </p>
        <h2 className="mt-1.5 break-keep text-[1.4rem] font-black leading-snug tracking-tight text-[#FAFAF8] sm:text-[1.9rem]">
          설명보다 먼저, 직접 만든 화면 {items.length}개를 보여드립니다.
        </h2>
        <p className="mt-1 break-keep text-[0.95rem] leading-snug text-slate-400 sm:text-[1.1rem]">
          업종별 AX와 아이디어 MVP — 눌러보시면 실제 화면이 열립니다.
        </p>
      </div>

      {/* 한 줄이라 세로 공간을 적게 쓴다. 제목과 같은 폭에 맞춰 시작하고, 좌우 끝은 배경색으로 흐린다 */}
      <div className="relative mx-auto mt-4 max-w-[1134px] sm:mt-6">
        <div
          ref={rowRef}
          className="flex gap-3.5 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {/* 끊김 없이 잇기 위해 같은 목록을 두 벌 깐다. 두 번째 벌은 읽어줄 필요가 없다 */}
          {items.map((it) => (
            <Card key={it.key} item={it} />
          ))}
          <div aria-hidden className="flex gap-3.5 sm:gap-5">
            {items.map((it) => (
              <Card key={`dup-${it.key}`} item={it} />
            ))}
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#171B20] to-transparent sm:w-14" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#171B20] to-transparent sm:w-14" />
      </div>

      <p className="mx-auto mt-3 max-w-[1134px] px-5 text-[0.82rem] leading-relaxed text-slate-500 sm:px-6 sm:text-[0.92rem]">
        모두 미래AI랩이 직접 만든 자체 레퍼런스이며, 화면 속 수치는 가상의 시연 데이터입니다.
      </p>
    </section>
  )
}
