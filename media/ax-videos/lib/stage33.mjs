// 영상 스타일 v3.3 연출 도구 — BIG MOMENT · 상황 연출(사람 · 문서 · 책상) · PRODUCT PUSH · 실제 비율 휴대폰 흐름
// reels2(createReel2(..., { v33: true }))와 함께 쓴다. 사람은 실제 인물이 아닌 중립적인 실루엣만.
import { readFileSync } from 'node:fs'
import { ic } from './reels.mjs'

export const PAL = { teal: 'var(--teal)', blue: 'var(--blue)', amber: 'var(--amber)', green: 'var(--green)', rose: 'var(--rose)', violet: 'var(--violet)', copper: 'var(--copper)' }

export function stage33(R, { flowsDir = 'assets/flows' } = {}) {
  const { el, phone31, browser31, card } = R
  const r2 = (n) => Math.round(n * 100) / 100
  const FLOWS = JSON.parse(readFileSync(`${flowsDir}/flows.json`, 'utf8'))

  /** 색 원 아이콘 */
  const badge = (icon, c, size) => `<span class="ibadge" style="--c:${PAL[c]}${size ? `;width:${size}px;height:${size}px` : ''}">${ic(icon)}</span>`
  /** 큰 패널 — 아이콘 + 굵은 글(56px) + 작은 설명 */
  const panel = (icon, c, b, small, at, o = {}) =>
    card(`<div class="panel">${badge(icon, c)}<div><b>${b}</b>${small ? `<small>${small}</small>` : ''}</div></div>`, at, { x: o.x ?? 72, y: o.y, w: o.w ?? 888, c, hiedge: o.hiedge, dim: o.dim, hl: o.hl, mv: o.mv })
  /** BIG MOMENT — 한 숫자·한 단어를 180~260px로 */
  const giga = (big, small, at, o = {}) => el(at, `${big}${small ? `<small>${small}</small>` : ''}`, { cls: 'giga abs', a: 'scale', dim: o.dim, out: o.out, style: `left:${o.x ?? 72}px;top:${o.y}px;${o.size ? `font-size:${o.size}px;` : ''}` })
  /** BIG MOMENT 제목 — 120~180px */
  const mega = (t, at, o = {}) => el(at, t, { cls: 'mega abs', a: o.a ?? 'up', dim: o.dim, out: o.out, style: `left:${o.x ?? 72}px;top:${o.y}px;right:${o.right ?? 120}px;${o.size ? `font-size:${o.size}px;` : ''}` })

  /** 사람(중립 실루엣) — 역할을 바로 알게 하는 순간에만. c: 넥타이·명찰 색 */
  const person = (x, y, w, at, o = {}) => {
    const dark = !o.light
    const hd = o.head ?? (dark ? '#d9d0c7' : '#5b626b'), bd = o.body ?? (dark ? '#59616b' : '#2f353c')
    const tie = o.c ? `<path d="M50 70 L43 88 L50 114 L57 88 Z" fill="${PAL[o.c] ?? o.c}"/>` : ''
    return el(at, `<svg viewBox="0 0 100 130"><circle cx="50" cy="31" r="21" fill="${hd}"/><path d="M10 130 C10 88 29 66 50 66 C71 66 90 88 90 130 Z" fill="${bd}"/>${tie}</svg>`, { cls: 'person', a: o.a ?? 'up', dim: o.dim, mv: o.mv, out: o.out, style: `left:${x}px;top:${y}px;width:${w}px` })
  }
  /** 심사 테이블 — 사람 n명 + 책상 + 명패 */
  const panelTable = ({ at, y = 560, n = 3, w = 210, names, light, cs = ['violet', 'blue', 'teal'], gap }) => {
    const total = 888, g = gap ?? (total - n * w) / (n - 1 || 1)
    let out = ''
    for (let i = 0; i < n; i++) out += person(72 + i * (w + g), y, w, at + i * 0.15, { light, c: cs[i % cs.length] })
    const dy = y + w * 1.3 - 40
    out += el(at + 0.1, '', { cls: 'desk', a: 'up', style: `left:40px;right:40px;top:${dy}px;height:120px` })
    for (let i = 0; i < n; i++) out += el(at + 0.3 + i * 0.1, (names ?? [])[i] ?? '심사위원', { cls: 'plate', a: 'fade', style: `left:${72 + i * (w + g) + w / 2 - 70}px;width:140px;text-align:center;top:${dy + 30}px` })
    return out
  }
  /** 문서 더미 — count 장을 area 안에 흩뿌림(재현 가능한 의사난수). mine: 강조할 한 장의 순번 */
  const docPile = ({ at, count = 24, x0 = 60, y0 = 520, x1 = 900, y1 = 1120, mine = -1, mineAt, dimAt, step = 0.05, seed = 7 }) => {
    let s = seed
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    let out = ''
    for (let i = 0; i < count; i++) {
      const x = r2(x0 + rnd() * (x1 - x0 - 150)), y = r2(y0 + rnd() * (y1 - y0 - 200)), rot = r2((rnd() - 0.5) * 26)
      const isMine = i === mine
      out += `<div class="abs" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg)">${el(isMine ? (mineAt ?? at) : at + i * step, isMine ? '<b style="position:absolute;left:14px;bottom:14px;font-size:24px;color:#b75b2a">우리 회사</b>' : '', { cls: `doc${isMine ? ' mine' : ''}`, a: 'scale', dim: isMine ? dimAt : undefined, style: 'position:relative' })}</div>`
    }
    return out
  }
  /** PRODUCT PUSH — 안쪽 요소(기기)를 카메라 쪽으로 당긴다. zoom: [[t0,t1,s0,s1,x0,y0,x1,y1], …], origin: 기준점 */
  const push = (inner, zoom, origin = '540px 900px') =>
    `<div class="abs" style="left:0;top:0;width:1080px;height:1920px;transform-origin:${origin}" data-zoom="${zoom.map((z) => z.map(r2).join(',')).join(';')}">${inner}</div>`
  /** 샘플 앱 흐름(휴대폰) — steps 화면을 times 에 차례로 바꾸고, 바꾸기 직전 누르는 곳에 물결 */
  const flowLayers = (name, steps, times, o = {}) => {
    const taps = FLOWS[name]?.taps ?? {}
    return steps.map((s, i) => ({
      src: `${flowsDir}/${name}-${s}.jpg`,
      coverW: o.coverW,
      at: i ? times[i - 1] : undefined,
      touch: i < steps.length - 1 && taps[String(i + 1)] ? [[taps[String(i + 1)].x, taps[String(i + 1)].y, times[i] - 0.45]] : [],
      scroll: o.scroll?.[i], focus: o.focus?.[i],
    }))
  }
  /** 휴대폰(실제 비율) + 샘플 흐름 — 단독 486px · 짝 360px */
  const flowPhone = (name, steps, times, o) => {
    const w = o.w ?? 486, H = Math.round(w * 19.7 / 9), sh = H - 28
    const coverW = Math.round(sh * 560 / 1212)
    return phone31({ x: o.x, y: o.y, w, at: o.at, out: o.out, layers: flowLayers(name, steps, times, { coverW, ...o }) })
  }
  return { badge, panel, giga, mega, person, panelTable, docPile, push, flowPhone, flowLayers, FLOWS }
}
