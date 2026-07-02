// 공개 페이지용 배경 시각 장치 — CSS/SVG 기반의 은은한 "AI 경영지원 네트워크".
// 실제 이미지 없이 노드+연결선으로 데이터가 흐르는 느낌만 담담하게 표현합니다.
// prefers-reduced-motion 시 애니메이션은 멈춥니다.

type Node = { x: number; y: number; label?: string; accent?: boolean }

const nodes: Node[] = [
  { x: 120, y: 140, label: '자금' },
  { x: 305, y: 90 },
  { x: 485, y: 160, label: '사업계획', accent: true },
  { x: 700, y: 110, label: '인증' },
  { x: 885, y: 185, label: 'AI' },
  { x: 195, y: 365 },
  { x: 425, y: 420, label: 'MVP', accent: true },
  { x: 645, y: 380, label: '제안서' },
  { x: 860, y: 435 },
  { x: 520, y: 525 },
]

const edges: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [2, 6],
  [6, 7],
  [7, 3],
  [7, 8],
  [4, 8],
  [6, 9],
  [9, 7],
  [1, 5],
]

const css = `
  @keyframes nbPulse { 0%,100% { opacity:.35 } 50% { opacity:.85 } }
  @keyframes nbFlow  { to { stroke-dashoffset:-160 } }
  .nb-edge { stroke-dasharray: 5 9; animation: nbFlow 11s linear infinite; }
  .nb-node { animation: nbPulse 4.5s ease-in-out infinite; transform-origin: center; }
  @media (prefers-reduced-motion: reduce) {
    .nb-edge, .nb-node { animation: none; }
  }
`

export default function NetworkBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{css}</style>
      <svg
        className="h-full w-full opacity-70"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="#cbd5e1" strokeWidth="1">
          {edges.map(([a, b], i) => (
            <line
              key={`e-${i}`}
              className="nb-edge"
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              style={{ animationDelay: `${(i % 5) * 0.9}s` }}
            />
          ))}
        </g>
        {nodes.map((n, i) => (
          <g key={`n-${i}`} className="nb-node" style={{ animationDelay: `${(i % 6) * 0.6}s` }}>
            <circle cx={n.x} cy={n.y} r={n.accent ? 6 : 4} fill={n.accent ? '#3b82f6' : '#94a3b8'} />
            {n.label && (
              <text
                x={n.x + 12}
                y={n.y + 4}
                fontSize="15"
                fontWeight="700"
                fill={n.accent ? '#60a5fa' : '#cbd5e1'}
              >
                {n.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
