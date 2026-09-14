import { useEffect, useRef } from 'react'
import { AX_PLATFORM_SAMPLES, PORTFOLIO_SAMPLES } from '../../data/portfolioSamples'

// 히어로 문장 바로 아래 — 설명 대신 실제로 만든 화면을 먼저 보여준다.
// 히어로 안에 들어가는 블록이라 배경을 따로 깔지 않는다(경계선이 보이면 안 된다).
//
// 두 줄이 서로 반대 방향으로 아주 천천히 흐른다.
//   위: 업종별 AX + 고객 플랫폼 12
//   아래: 사업화 아이디어 MVP 10
// 손을 대면(스와이프·휠·클릭) 그 줄은 멈추고 평범한 가로 스크롤이 된다.
//
// 링크는 "그림에 보이는 화면"으로 보낸다 —
// AX 샘플 데이터는 대표 이미지가 고객 화면일 때만 axImg(미니 AX 화면)를 갖고 있으므로,
// axImg 가 있으면 고객 화면을, 없으면 AX 대시보드를 연다.

const HERO_BG = '#050B11'

type StripItem = {
  key: string
  industry: string
  name: string
  img: string
  href: string
  alt: string
}

const axItems: StripItem[] = AX_PLATFORM_SAMPLES.map((s) => ({
  key: `ax-${s.slug}`,
  industry: s.industry,
  name: s.name,
  img: s.imgSm,
  href: s.axImg && s.customerUrl ? s.customerUrl : s.axUrl,
  alt: s.alt,
}))

const mvpItems: StripItem[] = PORTFOLIO_SAMPLES.map((s) => ({
  key: `mvp-${s.slug}`,
  industry: s.kind,
  name: s.name,
  img: s.imgSm,
  href: s.url,
  alt: s.alt,
}))

function Card({ item }: { item: StripItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[9.5rem] shrink-0 sm:w-[12.5rem]"
    >
      <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0B1016] shadow-lg shadow-black/40 transition-colors group-hover:border-[#D47A4A]/70">
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
      <p className="mt-1.5 truncate text-[0.84rem] sm:text-[0.94rem]">
        <span className="font-bold text-[#E7EAEE]">{item.industry}</span>
        <span className="text-slate-500"> · {item.name}</span>
      </p>
    </a>
  )
}

/** 한 줄 — dir 1 이면 왼쪽으로, -1 이면 오른쪽으로 흐른다 */
function Row({ items, dir, label, count }: { items: StripItem[]; dir: 1 | -1; label: string; count: number }) {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let running = true
    const half = () => el.scrollWidth / 2
    // 반대 방향으로 흐르는 줄은 가운데(한 벌 뒤)에서 출발해야 왼쪽으로 갈 자리가 있다
    let pos = dir === 1 ? 0 : half()
    el.scrollLeft = pos

    const step = () => {
      if (!running) return
      pos += 0.28 * dir
      // 같은 목록을 두 벌 깔아두고, 한 벌을 지나면 되돌려 끊김 없이 잇는다
      const h = half()
      if (pos >= h) pos -= h
      if (pos <= 0) pos += h
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
  }, [dir])

  return (
    <div>
      <p className="flex items-baseline gap-2 px-5 text-[1.0rem] font-black leading-snug text-[#FAFAF8] sm:px-6 sm:text-[1.16rem]">
        <span className="break-keep">{label}</span>
        <span className="shrink-0 font-black text-[#D47A4A]">{count}</span>
      </p>
      <div className="relative mt-2 sm:mt-2.5">
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it) => (
            <Card key={it.key} item={it} />
          ))}
          {/* 끊김 없이 잇기 위해 같은 목록을 한 벌 더 깐다. 두 번째 벌은 읽어줄 필요가 없다 */}
          <div aria-hidden className="flex gap-3 sm:gap-4">
            {items.map((it) => (
              <Card key={`dup-${it.key}`} item={it} />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10"
          style={{ background: `linear-gradient(to right, ${HERO_BG}, transparent)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10"
          style={{ background: `linear-gradient(to left, ${HERO_BG}, transparent)` }}
        />
      </div>
    </div>
  )
}

export default function AxSampleStrip() {
  return (
    <div id="samples" className="scroll-mt-16 space-y-4 sm:space-y-5">
      <Row label="업종별 AX + 고객 플랫폼" count={axItems.length} items={axItems} dir={1} />
      <Row label="사업화 아이디어 MVP(최소 기능 제품)" count={mvpItems.length} items={mvpItems} dir={-1} />
      <p className="px-5 text-[0.82rem] leading-relaxed text-slate-500 sm:px-6 sm:text-[0.9rem]">
        눌러보시면 실제 화면이 열립니다. 모두 미래AI랩이 직접 만든 자체 레퍼런스이며, 화면 속 수치는 가상의 시연 데이터입니다.
      </p>
    </div>
  )
}
