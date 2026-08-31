import type { MouseEventHandler } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const LOGO_SRC = '/brand/mirae-ai-lab-logo-transparent.png'
const DEFAULT_TAGLINE = 'MIRAE AI LAB · Business AX Company'

export default function BrandLogo({
  to = '/',
  className = '',
  imgClassName = '',
  taglineClassName = '',
  tagline = DEFAULT_TAGLINE,
  showTagline = true,
  ariaLabel = '미래에이아이랩 홈으로',
  onClick,
}: {
  to?: string
  className?: string
  imgClassName?: string
  taglineClassName?: string
  tagline?: string
  showTagline?: boolean
  ariaLabel?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <Link to={to} onClick={onClick} aria-label={ariaLabel} className={`inline-flex min-w-0 shrink-0 flex-col items-start ${className}`}>
      <span className="inline-flex min-w-0 items-center">
        <img
          src={LOGO_SRC}
          alt="미래에이아이랩"
          width={828}
          height={250}
          decoding="async"
          onError={() => setLogoFailed(true)}
          className={`${logoFailed ? 'hidden' : 'block'} h-10 w-auto max-w-[190px] object-contain sm:h-12 sm:max-w-[230px] ${imgClassName}`}
        />
        {logoFailed && (
          <span className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#171B20] text-[0.82rem] font-black text-[#D47A4A]">
              AI
            </span>
            <span className="whitespace-nowrap text-[1.0rem] font-black leading-tight text-[#171B20] sm:text-[1.08rem]">
              미래 AI 랩
            </span>
          </span>
        )}
      </span>
      {showTagline && (
        <span className={`mt-0.5 block max-w-full truncate text-[0.65rem] font-black tracking-[0.16em] text-slate-500 sm:text-[0.7rem] ${taglineClassName}`}>
          {tagline}
        </span>
      )}
    </Link>
  )
}
