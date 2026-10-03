// 릴스(9:16) 장면 도구 — 실제 프로젝트 1편·2편(real-ep1 · real-ep2)용.
// 스타일: 먹색(차콜) 바탕 + 구리색 포인트 한 가지 + Pretendard 굵은 제목 + 느리고 부드러운 등장.
//  - 장면 파일(comp.html)은 시간 t 를 넣으면 화면이 정해지는 render(t) 하나로 움직인다. CSS 애니메이션·트랜지션은 쓰지 않는다.
//  - 자막은 장면 파일 안에서 HTML 로 그린다(가운데 아래 · 최대 2줄 · 한 줄 16자 안팎 · 강조 한 단어).
//  - 안전 영역: 위 220px · 아래 400px · 오른쪽 120px 은 비운다. comp.html?guide=1 로 열면 선이 보인다.
//  - 렌더는 reels-render.mjs (Playwright 로 프레임마다 render(t) → JPEG → ffmpeg).
import { readFileSync, writeFileSync } from 'node:fs'
import { ICON } from './lib.mjs'

export const r2 = (n) => Math.round(n * 100) / 100
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** 제목 속 *단어* → 강조색 */
export const hi = (s) => String(s).replace(/\*(.+?)\*/g, '<span class="acc">$1</span>')

// 한 가지 색(currentColor)만 쓰는 아이콘 — 공통 아이콘(lib.mjs)에 이 영상에서 쓰는 것을 더했다
const S = (d, w = 1.8) => `<svg viewBox="0 0 24 24"><path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const EXTRA = {
  truck: S('M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7zM6.5 18.5a1.8 1.8 0 1 0 0-.01M17 18.5a1.8 1.8 0 1 0 0-.01'),
  phone: S('M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5zM10.5 18.5h3'),
  pen: S('M4 20l1-4.5L15.5 5a2 2 0 0 1 3 3L8 18.5zM13.5 7l3 3'),
  camera: S('M3 8h4l1.6-2.5h6.8L17 8h4v11H3zM12 16.5a3.2 3.2 0 1 0 0-.01'),
  moon: S('M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z'),
  chatm: S('M4 5h16v11H9l-5 4z'),
  sheet: S('M4 4h16v16H4zM4 9.5h16M4 15h16M10 4v16'),
  box: S('M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5L12 12l8.5-4.5M12 12v9'),
  receipt: S('M6 2.5h12v19l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3'),
  coin: S('M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM14.8 9.2c-.6-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.9-2.8 2.1 0 2.8 5.8 1.4 5.8 4.2 0 1.2-1.2 2.1-2.9 2.1-1.3 0-2.4-.6-2.9-1.5M12 6v1.8M12 16.2V18'),
  alert: S('M12 3l9.5 17h-19zM12 10v4.5M12 17.5v.2', 2),
  route: S('M6 19a2.5 2.5 0 1 0 0-.01M18 5a2.5 2.5 0 1 0 0-.01M8.5 19h7a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7h7'),
  store: S('M4 10v10h16V10M3 4h18l-1 6H4zM9.5 20v-5h5v5'),
  spark: S('M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z'),
  bottle: S('M10 2.5h4v3h-4zM9 5.5h6l1 3v12.5H8V8.5zM8 12h8'),
  branch: S('M6 3.5v17M6 9.5c0 3 3 4 6 4h6M18 13.5l-3-3M18 13.5l-3 3'),
  hand: S('M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7-2.5 0-4-1-5.5-3l-2.4-3.6a1.5 1.5 0 0 1 2.4-1.8L8 15'),
  heart: S('M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z'),
  ticket: S('M3 7.5h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14.5 7.5v10'),
  search: S('M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 1 0 0-13zM15.5 15.5L20 20', 2),
  flow: S('M4 6h6v4H4zM14 14h6v4h-6zM7 10v4a2 2 0 0 0 2 2h5M17 14v-4a2 2 0 0 0-2-2h-5'),
  pin: S('M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z'),
  repeat: S('M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3'),
  plus: S('M12 5v14M5 12h14', 2.4),
  layers: S('M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5'),
  minus: S('M5 12h14', 2.4),
}
export const ICONS = { ...ICON, ...EXTRA }
export const ic = (k, cls = '') => {
  if (!ICONS[k]) throw new Error('아이콘 없음: ' + k)
  return `<i class="ic ${cls}">${ICONS[k]}</i>`
}

const norm = (s) => String(s).toLowerCase().replace(/ai/g, '에이아이').replace(/·/g, '').split('').filter((c) => /[가-힣a-z0-9]/.test(c)).join('')

/**
 * @param dir 영상 폴더(timing.json · asr-fast 기준 정렬이 들어 있어야 한다)
 * @param o.offset 영상 앞 여백(초) — 음성은 이만큼 늦게 시작한다
 * @param o.tail 마지막 말 뒤 여백(초) — 끝 화면(로고 · 다음 행동)
 */
export function createReel(dir, { title, offset = 0.6, tail = 5 } = {}) {
  const T = JSON.parse(readFileSync(`${dir}/timing.json`, 'utf8'))
  if (!T.chars) throw new Error('timing.json 에 chars 가 없어요 — 이 폴더의 align.py 로 다시 정렬하세요')
  const O = offset
  const cue = (spec) => {
    const [b, l, p = 0] = String(spec).split('.').map(Number)
    const x = T.cues.find((y) => y.block === b && y.line === l && y.part === p)
    if (!x) throw new Error('자막 조각 없음: ' + spec)
    return x
  }
  /** 자막 조각 시작 시각(영상 기준) — '블록.문장.조각' */
  const c = (spec) => r2(cue(spec).start + O)
  /** 자막 조각 끝 시각 */
  const ce = (spec) => r2(cue(spec).end + O)
  /** 대본 속 단어가 나오는 시각 — after(조각 번호 또는 초) 이후 처음 나오는 곳 */
  const w = (needle, after = 0) => {
    const nd = norm(needle)
    let from = 0
    if (typeof after === 'string') from = cue(after).a
    else from = Math.max(0, T.ctime.findIndex((x) => x + O >= after - 0.3))
    const k = T.chars.indexOf(nd, from)
    if (k < 0) { console.warn('  ⚠️ 못 찾은 단어:', needle, after); return typeof after === 'string' ? c(after) : after }
    return r2(T.ctime[k] + O - 0.08)
  }
  const lastCue = T.cues[T.cues.length - 1]
  const SPEECH_END = r2(lastCue.end + O)
  const END = r2(SPEECH_END + tail)

  // ── 장면 ──
  const scenes = []
  /** 장면 하나 — tin 부터 다음 장면이 시작될 때까지(0.55초 교차). o.out 으로 끝을 정할 수 있다 */
  const scene = (tin, html, o = {}) => { scenes.push({ tin: r2(tin), html, out: o.out, cls: o.cls || '' }) }

  /** 등장하는 요소 하나. a: up · left · scale · card · fade · none */
  const el = (at, inner, { a = 'up', out, cls = '', style = '', dim, hl, mv, attrs = '', tag = 'div' } = {}) =>
    `<${tag} class="${cls}" data-in="${r2(at)}"${out != null ? ` data-out="${r2(out)}"` : ''} data-a="${a}"${dim != null ? ` data-dim="${r2(dim)}"` : ''}${hl != null ? ` data-hl="${r2(hl)}"` : ''}${mv ? ` data-mv="${mv.map(r2).join(',')}"` : ''}${style ? ` style="${style}"` : ''}${attrs ? ' ' + attrs : ''}>${hi(inner)}</${tag}>`

  /** 위쪽 글 묶음: 영문 소제목 + 제목(+설명) — 본문 왼쪽(72px)에서 시작 */
  const head = ({ eb, t, p, at, y = 250, size = 'h2', out, center = false, gap = 22 }) => {
    const parts = []
    if (eb) parts.push(el(at, esc(eb), { cls: 'eyebrow', out }))
    if (t) parts.push(el(at + (eb ? 0.15 : 0), hi(t), { cls: size, out }))
    if (p) parts.push(el(at + 0.5, hi(p), { cls: 'p', out }))
    return `<div class="abs col${center ? ' center' : ''}" style="left:72px;right:120px;top:${y}px;gap:${gap}px">${parts.join('')}</div>`
  }
  /** 화면 아래 작은 표기(예시 데이터 · 실제 화면 안내) — 본문 영역 안(y 1270) */
  const note = (text, at, o = {}) => el(at, esc(text), { cls: 'note', a: 'fade', out: o.out })

  /** 칩 하나 */
  const chip = (t, at, o = {}) => el(at, `${o.icon ? ic(o.icon) : ''}<span>${hi(t)}</span>`, { cls: `chip hlbox ${o.cls || ''}`, a: o.a || 'up', out: o.out, dim: o.dim, hl: o.hl, mv: o.mv, style: o.style || '', attrs: o.attrs || '' })
  /** 번호 태그(단계) */
  const ntag = (n, t, at, o = {}) => el(at, `<span class="n">${n}</span><span class="tx">${hi(t)}${o.sub ? `<small>${hi(o.sub)}</small>` : ''}</span>`, { cls: `ntag hlbox ${o.cls || ''}`, a: o.a || 'left', out: o.out, dim: o.dim, hl: o.hl, style: o.style || '' })
  /** 체크 항목 */
  const check = (t, at, o = {}) => el(at, `<span class="cc">${ICONS.check}</span><span class="tx">${hi(t)}${o.sub ? `<small>${hi(o.sub)}</small>` : ''}</span>`, { cls: `ck ${o.cls || ''}`, a: o.a || 'left', out: o.out, dim: o.dim, hl: o.hl, style: o.style || '' })
  /** 유리 카드 */
  const card = (inner, at, o = {}) => el(at, inner, { cls: `glass hlbox ${o.cls || ''}`, a: o.a || 'card', out: o.out, dim: o.dim, hl: o.hl, mv: o.mv, style: o.style || '' })
  /** 아이콘 + 제목 + 설명 카드 안쪽 */
  const cardIn = (icon, t, sub) => `<div class="ci">${icon ? `<span class="cic">${ic(icon)}</span>` : ''}<div><b>${hi(t)}</b>${sub ? `<small>${hi(sub)}</small>` : ''}</div></div>`

  /**
   * 세로 목록(번호 태그 · 체크 · 카드) — 새 항목이 나오면 앞 항목은 흐리게(.62)
   * items: [{ t, at, sub, hl, icon }]
   */
  const list = (items, { x = 72, y, gap = 22, kind = 'ntag', dimPrev = true, width, endDim } = {}) => {
    const html = items.map((it, i) => {
      const nxt = items[i + 1]
      const dim = dimPrev && nxt && !it.keep ? nxt.at : (endDim ?? undefined)
      const o = { sub: it.sub, hl: it.hl, dim: it.hl != null && it.hl <= (nxt?.at ?? 1e9) ? undefined : dim, cls: it.cls }
      if (kind === 'check') return check(it.t, it.at, o)
      if (kind === 'card') return card(cardIn(it.icon, it.t, it.sub), it.at, { ...o, a: 'left' })
      if (kind === 'chip') return chip(it.t, it.at, { ...o, icon: it.icon, a: 'left' })
      return ntag(it.n ?? i + 1, it.t, it.at, o)
    }).join('')
    return `<div class="abs col" style="left:${x}px;${width ? `width:${width}px` : 'right:120px'};top:${y}px;gap:${gap}px">${html}</div>`
  }

  /**
   * 세로 흐름 — 상자 사이를 짧은 구리선이 그려지며 잇는다
   * items: [{ t, sub, icon, at, hl }]
   */
  const vflow = (items, { x = 72, y, w = 888, gap = 64, h = 112 } = {}) => {
    let out = ''
    items.forEach((it, i) => {
      const top = y + i * (h + gap)
      if (i) out += `<svg class="abs vline" style="left:${x + 60}px;top:${top - gap + 6}px;width:4px;height:${gap - 12}px" viewBox="0 0 4 ${gap - 12}" preserveAspectRatio="none"><path d="M2 0V${gap - 12}" pathLength="1" data-draw="${r2(it.at - 0.45)},${r2(it.at)}"/></svg>`
      out += el(it.at, cardIn(it.icon, it.t, it.sub), { cls: `glass hlbox flowbox${it.cls ? ' ' + it.cls : ''}`, a: 'up', hl: it.hl, dim: it.dim, style: `left:${x}px;top:${top}px;width:${w}px;height:${h}px;position:absolute` })
    })
    return out
  }

  /** 세로 타임라인 — 왼쪽 선이 차례로 그려지고, 오른쪽에 글 */
  const timeline = (items, { x = 72, y, step = 128, size = 40 } = {}) => {
    const n = items.length, H = (n - 1) * step
    let out = `<svg class="abs tline" style="left:${x + 26}px;top:${y + 28}px;width:4px;height:${H}px" viewBox="0 0 4 ${H}" preserveAspectRatio="none"><path class="base" d="M2 0V${H}"/><path d="M2 0V${H}" pathLength="1" data-draw="${r2(items[0].at)},${r2(items[n - 1].at)}"/></svg>`
    items.forEach((it, i) => {
      const nxt = items[i + 1]
      out += el(it.at, `<span class="dot"></span><span class="tx" style="font-size:${size}px">${hi(it.t)}${it.sub ? `<small>${hi(it.sub)}</small>` : ''}</span>`, { cls: 'tl', a: 'left', dim: nxt && !it.keep ? nxt.at : undefined, style: `left:${x}px;top:${y + i * step}px` })
    })
    return out
  }

  /** 휴대폰 틀 + 화면 그림(실제 캡처 또는 예시) — 아래는 부드럽게 잘린다(h 로 높이) */
  const phone = ({ src, at, x = 72, y = 330, w = 470, h, kb, swaps = [], inner = '', a = 'card', cut = true, out }) => {
    const sw = w - 28, sh = Math.round(sw * 844 / 390)
    const H = h ?? sh + 28
    const imgs = [src, ...swaps.map((s) => s.src)].map((s, i) => i === 0
      ? `<img src="${s}" style="width:${sw}px" ${kb ? `data-kb="${kb}"` : ''} alt="">`
      : `<img class="swap" src="${s}" style="width:${sw}px" data-in="${r2(swaps[i - 1].at)}" data-a="none" ${swaps[i - 1].kb || kb ? `data-kb="${swaps[i - 1].kb || kb}"` : ''} alt="">`).join('')
    return el(at, `<div class="scr" style="height:${H - 28}px">${imgs}${inner}</div><span class="notch"></span>`, { cls: `phone${cut && h ? ' cut' : ''}`, a, out, style: `left:${x}px;top:${y}px;width:${w}px;height:${H}px` })
  }
  /** 브라우저 틀(PC 화면) — 세로 영상에선 필요한 곳만 확대(kb) */
  const browser = ({ src, at, x = 72, y = 420, w = 936, h = 640, url = '', kb, a = 'card', out }) =>
    el(at, `<div class="bbar"><i></i><i></i><i></i><span>${esc(url)}</span></div><div class="bview" style="height:${h - 52}px"><img src="${src}" style="width:${w}px" ${kb ? `data-kb="${kb}"` : ''} alt=""></div>`, { cls: 'browser', a, out, style: `left:${x}px;top:${y}px;width:${w}px;height:${h}px` })
  /** 누르는 곳 물결 */
  const touch = (x, y, at) => `<span class="touch" data-touch="${r2(at)}" style="left:${x}px;top:${y}px"></span>`

  /** 취소선 문장(구리색 선이 0.8초에 걸쳐 그어진다) */
  const strike = (t, at, sAt, o = {}) => el(at, `<span class="st">${hi(t)}<span class="sl" data-strike="${r2(sAt)}"></span></span>`, { cls: `${o.cls || 'h3'} strike-wrap`, a: o.a || 'up', out: o.out, style: o.style || '' })

  /**
   * 세로 타원 순환도 — 타원이 그려지고, 노드가 차례로 켜지고, 점이 따라 돈다
   * nodes: [{ t, at, icon }] (위에서부터 시계 방향)
   */
  const loop = ({ nodes, cx = 540, cy = 760, rx = 340, ry = 450, drawAt, drawEnd, dot, center = '', a0 = -90 }) => {
    const n = nodes.length
    let out = `<svg class="abs loop" style="left:0;top:0;width:1080px;height:1920px" viewBox="0 0 1080 1920"><ellipse class="base" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><path d="M${cx} ${cy - ry} A${rx} ${ry} 0 1 1 ${cx - 0.01} ${cy - ry}" pathLength="1" data-draw="${r2(drawAt)},${r2(drawEnd)}"/></svg>`
    nodes.forEach((nd, i) => {
      const ang = (a0 + (360 / n) * i) * Math.PI / 180
      const px = cx + rx * Math.cos(ang), py = cy + ry * Math.sin(ang)
      out += el(nd.at, `<div class="lnb hlbox"><span class="lic">${ic(nd.icon || 'check')}</span><b>${hi(nd.t)}</b></div>`, { cls: 'lnode', a: 'scale', hl: nd.hl, dim: nd.dim, style: `left:${r2(px)}px;top:${r2(py)}px` })
    })
    if (dot) out += `<span class="ldot" data-orbit="${r2(dot[0])},${r2(dot[1])},${cx},${cy},${rx},${ry},${a0},${a0 + (dot[2] ?? 360)}"></span>`
    if (center) out += `<div class="abs lcenter" style="left:${cx - 260}px;top:${cy - 160}px;width:520px;height:320px">${center}</div>`
    return out
  }

  /** 막대(이용권 등) — t0~t1 동안 0 → v */
  const bar = (v, t0, t1, o = {}) => `<span class="bar ${o.cls || ''}" style="${o.style || ''}"><i data-fill="${r2(t0)},${r2(t1)},${v}"></i></span>`

  /** 앱 화면을 닮은 예시 카드(밝은 바탕) — theme: ops(남색) · well(청록·베이지) */
  const mock = ({ theme = 'ops', title: tt, tag = '예시', rows = '', at, x = 120, y = 400, w = 840, a = 'card', out }) =>
    el(at, `<div class="mh">${tt}<em>${esc(tag)}</em></div><div class="mb">${rows}</div>`, { cls: `mock ${theme}`, a, out, style: `left:${x}px;top:${y}px;width:${w}px` })

  /** 끝 화면 — 로고(흰 둥근 사각) + 한 문장 + 다음 행동 */
  const endCard = ({ at, line, sub, cta = [] }) => `
    ${el(at, `<img src="assets/logo.png" alt="미래AI랩">`, { cls: 'logo-box', a: 'scale', style: 'left:290px;top:420px' })}
    ${el(at + 0.3, line, { cls: 'abs h2 center-x', style: 'top:660px' })}
    ${sub ? el(at + 0.55, sub, { cls: 'abs p center-x', style: 'top:840px' }) : ''}
    <div class="abs col center" style="left:140px;right:140px;top:${sub ? 970 : 900}px;gap:20px">${cta.map((t, i) => el(at + 0.85 + i * 0.2, t, { cls: `cta${i ? ' sub' : ''}` })).join('')}</div>`

  // ── 자막 ──
  /** 자막 한 조각을 두 줄 이내로 — 한 줄 18자(공백 포함) 안, 강조(**) 안에서는 끊지 않는다 */
  function wrapSub(text) {
    const plain = text.replace(/\*\*/g, '')
    if (plain.length <= 18) return text
    // 강조 구간 밖의 띄어쓰기 위치(원문 기준)
    const cands = []
    let inB = false, plainIdx = 0
    for (let i = 0; i < text.length; i++) {
      if (text.startsWith('**', i)) { inB = !inB; i++; continue }
      if (text[i] === ' ' && !inB) cands.push({ i, p: plainIdx })
      plainIdx++
    }
    const mid = plain.length / 2
    const ok = cands.filter((cd) => cd.p <= 18 && plain.length - cd.p - 1 <= 18)
    const pick = (ok.length ? ok : cands).sort((a, b) => Math.abs(a.p - mid) - Math.abs(b.p - mid))[0]
    if (!pick) return text
    return text.slice(0, pick.i) + '\n' + text.slice(pick.i + 1)
  }
  const SUBS = T.cues.map((x) => [r2(x.start + O), r2(x.end + O), wrapSub(x.text.trim())])
  // 겹치지 않게 · 최소 0.9초(짧으면 경고 — 대본에서 앞뒤 조각을 합친다)
  SUBS.forEach((s, i) => {
    const nx = SUBS[i + 1]
    if (nx && s[1] > nx[0] - 0.05) s[1] = r2(nx[0] - 0.05)
    if (s[1] - s[0] < 0.9) console.warn(`  ⚠️ 짧은 자막(${r2(s[1] - s[0])}초): ${s[2].replace(/\n/g, ' ')}`)
    for (const ln of s[2].replace(/\*\*/g, '').split('\n')) if (ln.length > 18) console.warn(`  ⚠️ 긴 자막 줄(${ln.length}자): ${ln}`)
  })

  const srtTime = (t) => {
    const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`
  }

  function finish() {
    scenes.sort((a, b) => a.tin - b.tin)
    const body = scenes.map((s, i) => {
      const nx = scenes[i + 1]
      const tout = s.out ?? (nx ? r2(nx.tin + 0.45) : r2(END + 1))
      return `<div class="scene ${s.cls}" data-in="${s.tin}" data-out="${tout}" data-a="scene">${s.html}</div>`
    }).join('\n')
    const html = readFileSync(new URL('./reels-base.html', import.meta.url), 'utf8')
      .replace('%TITLE%', esc(title || 'reel'))
      .replace('%SCENES%', body)
      .replace('%SUBS%', JSON.stringify(SUBS))
      .replace('%DUR%', String(END))
    writeFileSync(`${dir}/comp.html`, html)
    writeFileSync(`${dir}/subs.json`, JSON.stringify(SUBS.map(([a, b, t]) => ({ in: a, out: b, text: t })), null, 1))
    writeFileSync(`${dir}/subtitles.srt`, SUBS.map(([a, b, t], i) => `${i + 1}\n${srtTime(a)} --> ${srtTime(b)}\n${t.replace(/\*\*/g, '')}\n`).join('\n'))
    writeFileSync(`${dir}/reel.json`, JSON.stringify({ duration: END, offset: O, speechEnd: SPEECH_END, scenes: scenes.length }, null, 1))
    console.log(`장면 ${scenes.length}개 · 자막 ${SUBS.length}개 · 길이 ${END}초 (말 끝 ${SPEECH_END}초)`)
  }

  return { T, O, c, ce, w, END, SPEECH_END, scene, el, head, note, chip, ntag, check, card, cardIn, list, vflow, timeline, phone, browser, touch, strike, loop, bar, mock, endCard, finish }
}
