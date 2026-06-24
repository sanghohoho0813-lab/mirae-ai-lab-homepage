// Generates clean, on-brand dashboard preview thumbnails (SVG) for tools whose
// live apps sit behind a login/PIN/onboarding gate. Example data only — meant to
// reflect each tool's actual purpose at a glance (not a generic fake UI).
// Run: node scripts/gen-thumbnails.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'thumbnails')
mkdirSync(outDir, { recursive: true })

const FONT = "'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR','Pretendard',sans-serif"
const pill = {
  emerald: { bg: '#ecfdf5', fg: '#059669' },
  amber: { bg: '#fffbeb', fg: '#d97706' },
  rose: { bg: '#fff1f2', fg: '#e11d48' },
  slate: { bg: '#f1f5f9', fg: '#475569' },
  blue: { bg: '#eff6ff', fg: '#2563eb' },
  violet: { bg: '#f5f3ff', fg: '#7c3aed' },
  indigo: { bg: '#eef2ff', fg: '#4f46e5' },
}
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// writes a text element
const text = (x, y, size, weight, fill, content, { anchor } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" font-family="${FONT}"${
    anchor ? ` text-anchor="${anchor}"` : ''
  }>${esc(content)}</text>`

const badge = (x, y, w, label, color) => {
  const c = pill[color]
  return `<rect x="${x}" y="${y}" width="${w}" height="32" rx="16" fill="${c.bg}"/>${text(
    x + w / 2,
    y + 21,
    13,
    600,
    c.fg,
    label,
    { anchor: 'middle' },
  )}`
}

const header = (accent, initial, title, subtitle, statusText, statusColor) => `
  <rect width="1200" height="96" fill="#ffffff"/>
  <rect y="95" width="1200" height="1" fill="#e2e8f0"/>
  <rect x="40" y="26" width="44" height="44" rx="12" fill="${accent}"/>
  ${text(62, 57, 20, 800, '#ffffff', initial, { anchor: 'middle' })}
  ${text(100, 46, 22, 700, '#0f172a', title)}
  ${text(100, 72, 14, 400, '#64748b', subtitle)}
  ${badge(982, 33, 178, '● ' + statusText, statusColor)}`

const statTiles = (stats, accent, y) => {
  const w = 268
  const xs = [40, 324, 608, 892]
  return stats
    .map((s, i) => {
      const x = xs[i]
      const color = s.color ? pill[s.color].fg : i === 0 ? accent : '#0f172a'
      return `<rect x="${x}" y="${y}" width="${w}" height="128" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
      ${text(x + 22, y + 42, 13, 500, '#64748b', s.label)}
      ${text(x + 22, y + 86, s.value.length > 9 ? 21 : 26, 800, color, s.value)}`
    })
    .join('\n')
}

const frame = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img">
  <rect width="1200" height="750" fill="#f8fafc"/>${body}
</svg>
`

// ── [1] 고용지원금 프로 — 관리 현황 테이블 ───────────────────────────────
function renderHr() {
  const accent = '#2563eb'
  const rows = [
    ['청년채용 장려금', '4명', '신청 가능', 'emerald'],
    ['고용유지 지원금', '3명', '검토중', 'amber'],
    ['고용촉진 장려금', '2명', '신청 가능', 'emerald'],
    ['일자리 함께하기', '미배정', '자료 확인', 'rose'],
  ]
  const tiles = statTiles(
    [
      { label: '예상 수급 가능', value: '32,000,000원' },
      { label: '신청 가능 제도', value: '4건' },
      { label: '관리 대상 인원', value: '12명' },
      { label: '누락 위험 항목', value: '2건', color: 'rose' },
    ],
    accent,
    128,
  )
  const rowEls = rows
    .map(([name, people, status, color], i) => {
      const y = 410 + i * 64
      return `${text(72, y, 16, 600, '#0f172a', name)}
      ${text(620, y, 15, 500, '#475569', people)}
      ${badge(978, y - 21, 150, status, color)}
      ${i < rows.length - 1 ? `<rect x="72" y="${y + 22}" width="1056" height="1" fill="#f1f5f9"/>` : ''}`
    })
    .join('\n')
  return frame(`${header(accent, '고', '고용지원금 Pro', '컨설턴트용 고용지원금 운영관리', '분석 완료', 'emerald')}
  ${tiles}
  <rect x="40" y="288" width="1120" height="422" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
  ${text(72, 336, 18, 700, '#0f172a', '지원금 관리 현황')}
  ${text(72, 372, 13, 600, '#94a3b8', '제도명')}
  ${text(620, 372, 13, 600, '#94a3b8', '대상')}
  ${text(1053, 372, 13, 600, '#94a3b8', '상태', { anchor: 'middle' })}
  <rect x="72" y="386" width="1056" height="1" fill="#e2e8f0"/>
  ${rowEls}`)
}

// ── [2] 연구소 사후관리 OS — 설립 진행 + 이번 달 관리 (2단) ────────────────
function renderLab() {
  const accent = '#4f46e5'
  const tiles = `<rect x="40" y="128" width="552" height="120" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
    ${text(62, 170, 13, 500, '#64748b', '설립 준비 체크 항목')}
    ${text(62, 212, 26, 800, accent, '18개')}
    <rect x="608" y="128" width="552" height="120" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
    ${text(630, 170, 13, 500, '#64748b', '이번 달 관리 일정')}
    ${text(630, 212, 26, 800, '#0f172a', '5건')}`
  const checks = ['도면·면적 요건', '연구 전담요원 요건', '조직도 정비']
  const checkEls = checks
    .map((c, i) => {
      const y = 410 + i * 56
      const done = i < 2
      return `<circle cx="80" cy="${y - 5}" r="11" fill="${done ? '#ecfdf5' : '#f1f5f9'}"/>
      ${text(80, y - 1, 13, 700, done ? '#059669' : '#94a3b8', done ? '✓' : '·', { anchor: 'middle' })}
      ${text(104, y, 16, 500, '#334155', c)}`
    })
    .join('\n')
  const schedule = [
    ['06.18', '메디바이오 연구소 점검'],
    ['06.24', '스마트팩토리 변경신고'],
    ['06.30', '월간 종합보고서 발송'],
  ]
  const schedEls = schedule
    .map(([d, label], i) => {
      const y = 408 + i * 50
      return `${badge(640, y - 20, 70, d, 'indigo')}
      ${text(722, y, 15, 500, '#334155', label)}`
    })
    .join('\n')
  return frame(`${header(accent, '연', '연구소 사후관리 OS', '설립부터 사후관리까지', '정상 운영', 'emerald')}
  ${tiles}
  <rect x="40" y="272" width="552" height="438" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
  ${text(72, 320, 18, 700, '#0f172a', '설립 준비 진행')}
  ${text(72, 360, 14, 500, '#64748b', '14 / 18 항목 완료')}
  <rect x="72" y="372" width="488" height="14" rx="7" fill="#e8e8f4"/>
  <rect x="72" y="372" width="380" height="14" rx="7" fill="${accent}"/>
  ${checkEls}
  <rect x="608" y="272" width="552" height="438" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
  ${text(640, 320, 18, 700, '#0f172a', '이번 달 관리 일정')}
  ${schedEls}
  <rect x="640" y="560" width="488" height="56" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
  ${text(664, 594, 15, 600, '#334155', '월간 알림')}
  ${badge(1008, 572, 96, '활성화', 'emerald')}
  <rect x="640" y="630" width="488" height="56" rx="12" fill="#f8fafc" stroke="#e2e8f0"/>
  ${text(664, 664, 15, 600, '#334155', '종합보고서 생성')}
  ${badge(1024, 642, 80, '가능', 'indigo')}`)
}

// ── [3] 법인컨설팅 세일즈 OS — 영업 파이프라인 (칸반) ─────────────────────
function renderCorp() {
  const accent = '#ea580c'
  const tiles = statTiles(
    [
      { label: '잠재 고객', value: '58건' },
      { label: '후속관리 대상', value: '14건' },
      { label: '진행중 제안', value: '9건' },
      { label: '미팅 전략 메모', value: '23건' },
    ],
    accent,
    128,
  )
  const cols = [
    ['잠재 고객', 'slate', ['(주)대성정밀', '한울바이오', '제이텍']],
    ['상담 진행', 'blue', ['우진산업', '코어에너지']],
    ['제안 검토', 'violet', ['그린팩토리', '아이엠']],
    ['계약 완료', 'emerald', ['세종ENG']],
  ]
  const colW = 256
  const colXs = [40, 320, 600, 880]
  const colEls = cols
    .map(([title, color, cards], i) => {
      const x = colXs[i]
      const head = `${badge(x, 332, 120, title, color)}`
      const cardEls = cards
        .map((name, j) => {
          const y = 384 + j * 70
          return `<rect x="${x}" y="${y}" width="${colW}" height="56" rx="10" fill="#ffffff" stroke="#e2e8f0"/>
          ${text(x + 18, y + 26, 14, 600, '#1e293b', name)}
          <rect x="${x + 18}" y="${y + 36}" width="120" height="6" rx="3" fill="#e2e8f0"/>`
        })
        .join('\n')
      return head + '\n' + cardEls
    })
    .join('\n')
  return frame(`${header(accent, '세', '법인컨설팅 세일즈 OS', '영업·고객관리·전략', '진행중', 'blue')}
  ${tiles}
  <rect x="20" y="288" width="1160" height="422" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
  ${text(40, 320, 16, 700, '#0f172a', '영업 파이프라인')}
  ${colEls}`)
}

const out = {
  'hr-subsidy-pro': renderHr(),
  'labcare-rnd-os': renderLab(),
  'corp-sales-os': renderCorp(),
}
for (const [id, svg] of Object.entries(out)) {
  const file = join(outDir, `${id}.svg`)
  writeFileSync(file, svg)
  console.log('wrote', file)
}
