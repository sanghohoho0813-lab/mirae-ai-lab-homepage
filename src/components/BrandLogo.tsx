import type { MouseEventHandler } from 'react'
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
  return (
    <Link to={to} onClick={onClick} aria-label={ariaLabel} className={`inline-flex min-w-0 flex-col items-start ${className}`}>
      <img
        src={LOGO_SRC}
        alt="미래에이아이랩"
        width={828}
        height={250}
        decoding="async"
        className={`block h-10 w-auto max-w-[190px] object-contain sm:h-12 sm:max-w-[230px] ${imgClassName}`}
      />
      {showTagline && (
        <span className={`mt-0.5 block max-w-full truncate text-[0.65rem] font-black tracking-[0.16em] text-slate-500 sm:text-[0.7rem] ${taglineClassName}`}>
          {tagline}
        </span>
      )}
    </Link>
  )
}
