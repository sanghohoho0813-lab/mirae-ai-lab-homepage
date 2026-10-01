// 그림 뒤 궤도 — 서비스 선택 카드(01 · 02)와 2주 기술사업 빌드 히어로(PC)가 같이 쓴다.
// 움직임은 index.css 의 card-dots · card-comet · card-comet-slow · card-twinkle (움직임 줄이기 설정이면 멈춘다).
/** 그림 뒤 궤도 — 천천히 흐르는 점선 고리 + 한 바퀴 도는 빛나는 호 + 반짝임(움직임 줄이기면 멈춤).
 *  wide: 가로로 긴 그림(01)용 타원, round: 정사각 그림(02)용 원 */
export default function Orbit({ tone, shape }: { tone: 'light' | 'dark'; shape: 'wide' | 'round' }) {
  const c = tone === 'light' ? { line: '#D47A4A', glow: '#E8B89A', star: '#D47A4A' } : { line: '#E6C396', glow: '#E6C396', star: '#F6E2C0' }
  const wide = shape === 'wide'
  const vb = wide ? { w: 240, h: 180 } : { w: 200, h: 200 }
  const cx = vb.w / 2, cy = vb.h / 2
  const [ro, rio] = wide ? [[114, 82], [100, 68]] : [[94, 94], [76, 76]]
  const gid = `orbitGlow-${tone}-${shape}`
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${vb.w} ${vb.h}`}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={c.glow} stopOpacity={tone === 'light' ? 0.5 : 0.38} />
          <stop offset="0.6" stopColor={c.glow} stopOpacity="0.1" />
          <stop offset="1" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={ro[0] * 0.98} ry={ro[1] * 0.98} fill={`url(#${gid})`} />
      {/* 바깥 점선 — 점이 고리를 따라 천천히 흐른다 */}
      <ellipse className="card-dots" cx={cx} cy={cy} rx={ro[0]} ry={ro[1]} fill="none" stroke={c.line} strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round" pathLength={200} strokeDasharray="0.6 3.4" />
      {/* 안쪽 고리 + 빛나는 호 두 개(서로 반대로 돈다) */}
      <ellipse cx={cx} cy={cy} rx={rio[0]} ry={rio[1]} fill="none" stroke={c.line} strokeOpacity="0.22" strokeWidth="1" />
      <ellipse className="card-comet" cx={cx} cy={cy} rx={rio[0]} ry={rio[1]} fill="none" stroke={c.line} strokeOpacity="0.9" strokeWidth="2.4" strokeLinecap="round" pathLength={100} strokeDasharray="12 88" />
      <ellipse className="card-comet-slow" cx={cx} cy={cy} rx={ro[0]} ry={ro[1]} fill="none" stroke={c.line} strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" pathLength={100} strokeDasharray="6 94" />
      {/* 반짝임 */}
      <path className="card-twinkle" d={`M${vb.w * 0.9} ${vb.h * 0.16} l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2z`} fill={c.star} />
      <path className="card-twinkle [animation-delay:1.6s]" d={`M${vb.w * 0.08} ${vb.h * 0.8} l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z`} fill={c.star} />
    </svg>
  )
}
