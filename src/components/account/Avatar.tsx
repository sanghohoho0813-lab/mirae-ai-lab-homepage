// 공통 아바타 — 프로필 이미지 > 이름 첫 글자 > AI 아이콘 폴백. 헤더·드롭다운·모바일·마이페이지 공용.
import { avatarInitial } from '../../lib/accountDisplay'

export default function Avatar({
  name,
  imageUrl,
  size = 36,
  className = '',
}: {
  name: string | null | undefined
  imageUrl?: string | null
  size?: number
  className?: string
}) {
  const initial = avatarInitial(name)
  const dim = { width: size, height: size }
  const base = `grid shrink-0 place-items-center overflow-hidden rounded-full ${className}`

  if (imageUrl) {
    return (
      <span className={`${base} bg-slate-100 ring-1 ring-inset ring-slate-200`} style={dim}>
        <img src={imageUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      </span>
    )
  }
  if (initial) {
    return (
      <span
        className={`${base} bg-gradient-to-br from-blue-600 to-blue-700 font-black text-white`}
        style={{ ...dim, fontSize: Math.round(size * 0.42) }}
        aria-hidden
      >
        {initial}
      </span>
    )
  }
  return (
    <span
      className={`${base} bg-slate-900 font-black tracking-tight text-sky-400`}
      style={{ ...dim, fontSize: Math.round(size * 0.34) }}
      aria-hidden
    >
      AI
    </span>
  )
}
