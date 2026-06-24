// Generates clean, on-brand dashboard preview thumbnails (SVG) for tools whose
// live apps are behind a login/PIN gate. Example data only — meant to convey
// "what this tool does" at a glance. Run: node scripts/gen-thumbnails.mjs
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
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function render({ accent, initial, title, subtitle, status, stats, panelTitle, rows }) {
  const st = pill[status.color]
  const tileX = [40, 420, 800]
  const tiles = stats
    .map((s, i) => {
      const x = tileX[i]
      const valColor = i === 0 ? accent : '#0f172a'
      return `
  <rect x="${x}" y="128" width="360" height="150" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="${x + 28}" y="178" font-size="15" fill="#64748b" font-family="${FONT}">${esc(s.label)}</text>
  <text x="${x + 28}" y="234" font-size="34" font-weight="800" fill="${valColor}" font-family="${FONT}">${esc(s.value)}</text>`
    })
    .join('')

  const rowEls = rows
    .map((r, i) => {
      const y = 392 + i * 74
      const p = pill[r.color]
      const fillW = Math.round((420 * r.pct) / 100)
      const divider =
        i < rows.length - 1
          ? `\n  <rect x="72" y="${y + 52}" width="1056" height="1" fill="#f1f5f9"/>`
          : ''
      return `
  <text x="72" y="${y + 26}" font-size="16" font-weight="600" fill="#0f172a" font-family="${FONT}">${esc(r.label)}</text>
  <rect x="520" y="${y + 14}" width="420" height="12" rx="6" fill="#e2e8f0"/>
  <rect x="520" y="${y + 14}" width="${fillW}" height="12" rx="6" fill="${accent}"/>
  <rect x="978" y="${y + 4}" width="150" height="32" rx="16" fill="${p.bg}"/>
  <text x="1053" y="${y + 25}" font-size="13" font-weight="600" fill="${p.fg}" text-anchor="middle" font-family="${FONT}">${esc(r.status)}</text>${divider}`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750" role="img">
  <rect width="1200" height="750" fill="#f8fafc"/>
  <rect width="1200" height="96" fill="#ffffff"/>
  <rect y="95" width="1200" height="1" fill="#e2e8f0"/>
  <rect x="40" y="26" width="44" height="44" rx="12" fill="${accent}"/>
  <text x="62" y="57" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="${FONT}">${esc(initial)}</text>
  <text x="100" y="46" font-size="22" font-weight="700" fill="#0f172a" font-family="${FONT}">${esc(title)}</text>
  <text x="100" y="72" font-size="14" fill="#64748b" font-family="${FONT}">${esc(subtitle)}</text>
  <rect x="980" y="33" width="180" height="32" rx="16" fill="${st.bg}"/>
  <text x="1070" y="54" font-size="13" font-weight="600" fill="${st.fg}" text-anchor="middle" font-family="${FONT}">● ${esc(status.text)}</text>
${tiles}
  <rect x="40" y="302" width="1120" height="408" rx="16" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="72" y="350" font-size="18" font-weight="700" fill="#0f172a" font-family="${FONT}">${esc(panelTitle)}</text>
${rowEls}
</svg>
`
}

const thumbs = {
  'hr-subsidy-pro': {
    accent: '#2563eb',
    initial: '고',
    title: '고용지원금 Pro',
    subtitle: '컨설턴트용 고용지원금 운영관리',
    status: { text: '분석 완료', color: 'emerald' },
    stats: [
      { label: '예상 지원금', value: '32,000,000원' },
      { label: '신청 가능 제도', value: '4건' },
      { label: '검토중 고객', value: '12곳' },
    ],
    panelTitle: '지원금 검토 결과',
    rows: [
      { label: '청년채용 장려금', status: '수급 가능', color: 'emerald', pct: 92 },
      { label: '고용유지 지원금', status: '검토중', color: 'amber', pct: 68 },
      { label: '고용촉진 장려금', status: '수급 가능', color: 'emerald', pct: 85 },
      { label: '일자리 함께하기', status: '자료 확인', color: 'slate', pct: 40 },
    ],
  },
  'labcare-rnd-os': {
    accent: '#4f46e5',
    initial: '연',
    title: '연구소 사후관리 OS',
    subtitle: '기업부설연구소 사후관리',
    status: { text: '정상 운영', color: 'emerald' },
    stats: [
      { label: '이번 달 관리 필요', value: '3건' },
      { label: '변경신고 예정', value: '2건' },
      { label: '관리 연구소', value: '18곳' },
    ],
    panelTitle: '사후관리 현황',
    rows: [
      { label: '메디바이오 연구소', status: '정상', color: 'emerald', pct: 100 },
      { label: '스마트팩토리 연구소', status: '변경신고 D-5', color: 'amber', pct: 60 },
      { label: '그린에너지 연구소', status: '서류 보완', color: 'rose', pct: 35 },
      { label: 'AI솔루션 연구소', status: '정상', color: 'emerald', pct: 100 },
    ],
  },
  'corp-sales-os': {
    accent: '#ea580c',
    initial: '세',
    title: '법인컨설팅 세일즈 OS',
    subtitle: '법인컨설팅 영업·고객관리',
    status: { text: '진행중', color: 'blue' },
    stats: [
      { label: '진행 고객', value: '58건' },
      { label: '이번 달 계약률', value: '34%' },
      { label: '예정 상담', value: '9건' },
    ],
    panelTitle: '영업 파이프라인',
    rows: [
      { label: '상담 예정', status: '14건', color: 'slate', pct: 30 },
      { label: '제안 진행', status: '21건', color: 'blue', pct: 55 },
      { label: '계약 검토', status: '12건', color: 'violet', pct: 72 },
      { label: '계약 완료', status: '11건', color: 'emerald', pct: 90 },
    ],
  },
}

for (const [id, data] of Object.entries(thumbs)) {
  const file = join(outDir, `${id}.svg`)
  writeFileSync(file, render(data))
  console.log('wrote', file)
}
