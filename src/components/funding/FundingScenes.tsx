// 정책자금 상세페이지 전용 — 통일된 2D 플랫 벡터 일러스트 세트.
// 팔레트: navy #1e293b · blue #2563eb · sky #38bdf8 · mint #34d399 · amber #fbbf24 · paper #fff · line #cbd5e1
// 선 굵기·라운드·컬러를 통일해 페이지 전반에서 한 세트로 보이도록 함(아이콘 짜깁기 금지).
// 모두 className(폭)만 받는 순수 SVG. 배경 라운드 블롭 위에 최소한의 도형으로 장면을 표현.

const C = {
  navy: '#1e293b',
  blue: '#2563eb',
  sky: '#38bdf8',
  mint: '#34d399',
  amber: '#fbbf24',
  line: '#cbd5e1',
  bg: '#eff6ff',
  paper: '#ffffff',
  faint: '#e2e8f0',
}

type Props = { className?: string }
const base = 'block h-auto w-full'

// 상담/방향 정리 — 대표자 + 컨설턴트가 문서를 함께 보는 장면 (Hero)
export function HeroScene({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 300 200" className={`${base} ${className}`} role="img" aria-label="상담으로 자금 방향을 정리하는 장면">
      <rect x="10" y="18" width="280" height="158" rx="26" fill={C.bg} />
      {/* 왼쪽 사람 (네이비) */}
      <circle cx="74" cy="78" r="17" fill={C.navy} />
      <rect x="50" y="98" width="48" height="52" rx="22" fill={C.navy} />
      {/* 오른쪽 사람 (블루) */}
      <circle cx="226" cy="78" r="17" fill={C.blue} />
      <rect x="202" y="98" width="48" height="52" rx="22" fill={C.blue} />
      {/* 가운데 문서 카드 */}
      <rect x="108" y="74" width="84" height="94" rx="12" fill={C.paper} stroke={C.line} strokeWidth="3" />
      <rect x="122" y="88" width="52" height="7" rx="3.5" fill={C.faint} />
      <rect x="122" y="102" width="36" height="7" rx="3.5" fill={C.faint} />
      {/* 상승 차트 */}
      <rect x="122" y="140" width="12" height="16" rx="3" fill={C.sky} />
      <rect x="140" y="130" width="12" height="26" rx="3" fill={C.blue} />
      <rect x="158" y="118" width="12" height="38" rx="3" fill={C.mint} />
      {/* 체크 배지 */}
      <circle cx="192" cy="158" r="17" fill={C.amber} />
      <path d="M183 158 l6 7 l11 -14" fill="none" stroke={C.navy} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 막막함 — 서류 앞에서 고민하는 대표자 + 물음표 (문제 공감)
export function StuckScene({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 300 200" className={`${base} ${className}`} role="img" aria-label="서류 앞에서 막막해하는 대표자">
      <rect x="10" y="18" width="280" height="158" rx="26" fill={C.bg} />
      {/* 책상 */}
      <rect x="44" y="140" width="212" height="12" rx="6" fill="#dbeafe" />
      {/* 사람 */}
      <circle cx="150" cy="74" r="19" fill={C.navy} />
      <rect x="124" y="97" width="52" height="48" rx="22" fill={C.navy} />
      {/* 어질러진 서류 */}
      <g stroke={C.line} strokeWidth="2.6" fill={C.paper}>
        <rect x="60" y="116" width="46" height="32" rx="6" transform="rotate(-9 83 132)" />
        <rect x="194" y="114" width="46" height="32" rx="6" transform="rotate(8 217 130)" />
      </g>
      <g fill={C.faint}>
        <rect x="68" y="123" width="30" height="4.5" rx="2" transform="rotate(-9 83 132)" />
        <rect x="68" y="131" width="22" height="4.5" rx="2" transform="rotate(-9 83 132)" />
        <rect x="202" y="122" width="30" height="4.5" rx="2" transform="rotate(8 217 130)" />
        <rect x="202" y="130" width="22" height="4.5" rx="2" transform="rotate(8 217 130)" />
      </g>
      {/* 물음표 */}
      <circle cx="212" cy="58" r="15" fill={C.amber} />
      <text x="212" y="64" textAnchor="middle" fontSize="19" fontWeight="900" fill={C.navy}>?</text>
      <circle cx="92" cy="66" r="11" fill={C.sky} />
      <text x="92" y="71" textAnchor="middle" fontSize="14" fontWeight="900" fill={C.paper}>?</text>
    </svg>
  )
}

// 정리 — 흩어진 자료가 하나의 체크리스트로 정리되는 흐름 (기본 해결)
export function PlanScene({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 300 200" className={`${base} ${className}`} role="img" aria-label="흩어진 자료가 실행 순서로 정리되는 장면">
      <rect x="10" y="18" width="280" height="158" rx="26" fill={C.bg} />
      {/* 왼쪽: 어질러진 서류 더미 */}
      <g stroke={C.line} strokeWidth="2.6" fill={C.paper}>
        <rect x="40" y="86" width="52" height="66" rx="8" transform="rotate(-10 66 119)" />
        <rect x="48" y="80" width="52" height="66" rx="8" transform="rotate(-2 74 113)" />
      </g>
      <g fill={C.faint}>
        <rect x="58" y="94" width="34" height="5" rx="2.5" />
        <rect x="58" y="106" width="26" height="5" rx="2.5" />
        <rect x="58" y="118" width="30" height="5" rx="2.5" />
      </g>
      {/* 화살표 */}
      <path d="M126 118 h30" stroke={C.blue} strokeWidth="5" strokeLinecap="round" />
      <path d="M150 108 l12 10 l-12 10" fill="none" stroke={C.blue} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 오른쪽: 정리된 체크리스트 카드 */}
      <rect x="176" y="68" width="86" height="98" rx="12" fill={C.paper} stroke={C.blue} strokeWidth="3" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx="196" cy={92 + i * 26} r="9" fill={C.mint} />
          <path d={`M191 ${92 + i * 26} l4 4 l7 -8`} fill="none" stroke={C.paper} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="212" y={88 + i * 26} width="38" height="8" rx="4" fill={C.faint} />
        </g>
      ))}
    </svg>
  )
}

// 결과물 — 정리된 문서 묶음 + 승인 체크 (상담 후 남는 것)
export function DocsScene({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 300 200" className={`${base} ${className}`} role="img" aria-label="정리된 결과 자료 묶음">
      <rect x="10" y="18" width="280" height="158" rx="26" fill={C.bg} />
      {/* 뒤 시트들 */}
      <rect x="86" y="60" width="104" height="118" rx="12" fill={C.paper} stroke={C.line} strokeWidth="3" transform="rotate(-7 138 119)" />
      <rect x="104" y="52" width="104" height="118" rx="12" fill={C.paper} stroke={C.line} strokeWidth="3" transform="rotate(4 156 111)" />
      {/* 앞 시트 */}
      <rect x="96" y="46" width="106" height="120" rx="12" fill={C.paper} stroke={C.blue} strokeWidth="3" />
      <rect x="112" y="64" width="60" height="8" rx="4" fill={C.blue} opacity="0.85" />
      <rect x="112" y="82" width="74" height="6" rx="3" fill={C.faint} />
      <rect x="112" y="96" width="60" height="6" rx="3" fill={C.faint} />
      <rect x="112" y="110" width="70" height="6" rx="3" fill={C.faint} />
      <rect x="112" y="124" width="46" height="6" rx="3" fill={C.faint} />
      {/* 승인 체크 배지 */}
      <circle cx="196" cy="150" r="20" fill={C.mint} />
      <path d="M186 150 l7 8 l13 -16" fill="none" stroke={C.paper} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 신뢰 — 방패 + 체크 + 별 (신뢰/실적 강조 보조)
export function ShieldCheck({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={`${base} ${className}`} role="img" aria-label="신뢰 배지">
      <path d="M60 12 L100 26 V60 C100 86 82 102 60 110 C38 102 20 86 20 60 V26 Z" fill={C.blue} />
      <path d="M44 60 l11 11 l22 -26" fill="none" stroke={C.paper} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
