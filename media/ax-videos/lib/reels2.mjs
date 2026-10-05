// 영상 스타일 v2 장면 도구 — AX 페이지 영상 4편(v2/film-1 · film-2 · real-ep1 · real-ep2)
// 스타일: 9:16 · 어두운 차콜 장면과 따뜻한 미색 장면을 번갈아 · 글자는 흰색/차콜 · 구리 · 살구 3색 고정,
//         상자·도형만 7색 팔레트(청록·파랑·호박·초록·장미·보라·구리) · 옅은 장식 도형 · 들어올 때만 천천히.
//  - 장면 파일(comp.html)은 render(t) 하나로 움직인다(CSS 애니메이션 없음). 렌더는 reels-render.mjs.
//  - 자막은 대본 글자 그대로, 시각은 최종 음성에서(subs2.py → timing.json). 장면은 0.25초 겹쳐 0.55초 교차.
//  - 영상 길이 = 음성 + 앞 0.6초 + 뒤 2.6초.
import { readFileSync, writeFileSync } from 'node:fs'
import { ICONS, ic, esc, hi, r2 } from './reels.mjs'

export { ic, hi, r2 }
export const C = { teal: 'var(--teal)', blue: 'var(--blue)', amber: 'var(--amber)', green: 'var(--green)', rose: 'var(--rose)', violet: 'var(--violet)', copper: 'var(--copper)' }
const col = (c) => (c ? `--c:${C[c] ?? c};` : '')
const norm = (s) => String(s).toLowerCase().replace(/[^0-9a-z가-힣]/g, '')

export function createReel2(dir, { title, offset = 0.6, tail = 2.6 } = {}) {
  const T = JSON.parse(readFileSync(`${dir}/timing.json`, 'utf8'))
  const O = offset
  const cue = (spec) => {
    const [b, l, p = 0] = String(spec).split('.').map(Number)
    const x = T.cues.find((y) => y.block === b && y.line === l && y.part === p)
    if (!x) throw new Error('자막 조각 없음: ' + spec)
    return x
  }
  /** 자막 조각 시작(영상 기준) — '블록.문장.조각' */
  const c = (spec) => r2(cue(spec).start + O)
  const ce = (spec) => r2(cue(spec).end + O)
  /** 대본 속 말이 시작되는 시각 — after(조각 번호 또는 초) 이후 처음 */
  const w = (needle, after = 0) => {
    const nd = norm(needle)
    const from = typeof after === 'string' ? cue(after).a : Math.max(0, T.ctime.findIndex((x) => x + O >= after - 0.3))
    const k = T.chars.indexOf(nd, from)
    if (k < 0) { console.warn('  ⚠️ 못 찾은 말:', needle, after); return typeof after === 'string' ? c(after) : after }
    return r2(T.ctime[k] + O)
  }
  const VOICE_END = r2(T.audioEnd + O)
  const END = r2(VOICE_END + tail)

  const scenes = []
  /** 장면 — tin 부터 다음 장면 시작 + 0.25초까지. light: 따뜻한 미색 장면 */
  const scene = (tin, html, o = {}) => { scenes.push({ tin: r2(tin), html, light: !!o.light, out: o.out }) }

  const el = (at, inner, { a = 'up', out, cls = '', style = '', dim, hl, mv, attrs = '' } = {}) =>
    `<div class="${cls}" data-in="${r2(at)}"${out != null ? ` data-out="${r2(out)}"` : ''} data-a="${a}"${dim != null ? ` data-dim="${r2(dim)}"` : ''}${hl != null ? ` data-hl="${r2(hl)}"` : ''}${mv ? ` data-mv="${mv.map(r2).join(',')}"` : ''}${style ? ` style="${style}"` : ''}${attrs ? ' ' + attrs : ''}>${hi(inner)}</div>`
  const pos = (o, extra = '') => `left:${o.x ?? 72}px;top:${o.y}px;${o.w ? `width:${o.w}px;` : ''}${o.h ? `height:${o.h}px;` : ''}${extra}`

  /** 영문 소제목 + 제목(+설명) — 왼쪽 x=72 정렬 */
  const head = ({ eb, t, p, at, y = 250, size = 'h2', out, pAt }) => {
    const parts = []
    if (eb) parts.push(el(at, esc(eb), { cls: 'eyebrow', out }))
    if (t) parts.push(el(at + (eb ? 0.15 : 0), t, { cls: size, out }))
    if (p) parts.push(el(pAt ?? at + 0.5, p, { cls: 'p', out }))
    return `<div class="abs col" style="left:72px;right:120px;top:${y}px;gap:20px">${parts.join('')}</div>`
  }
  const note = (text, at, o = {}) => el(at, esc(text), { cls: 'note', a: 'fade', out: o.out, style: o.y ? `top:${o.y}px` : '' })
  const numtag = (n, t, at, o = {}) => el(at, `<span class="num">${n}</span><span>${hi(t)}${o.sub ? `<small>${hi(o.sub)}</small>` : ''}</span>`, { cls: `numtag abs hlbox`, a: 'left', dim: o.dim, hl: o.hl, style: pos(o, col(o.c ?? 'copper')) })
  const check = (t, at, o = {}) => el(at, `<span class="mark">${o.mark ?? '✓'}</span><span>${hi(t)}${o.sub ? `<small>${hi(o.sub)}</small>` : ''}</span>`, { cls: 'check abs', a: 'left', dim: o.dim, style: pos(o, col(o.c ?? 'copper')) })
  const row = (l, r, at, o = {}) => el(at, `<span class="rl">${hi(l)}</span>${r ? `<span class="rr">${hi(r)}</span>` : ''}`, { cls: 'row abs hlbox', a: 'left', dim: o.dim, hl: o.hl, style: pos(o, col(o.c)) })
  const chip = (t, at, o = {}) => el(at, t, { cls: `chip dot abs${o.big ? ' big' : ''} hlbox`, a: o.a ?? 'up', dim: o.dim, hl: o.hl, mv: o.mv, style: pos(o, col(o.c ?? 'copper')) })
  const bubble = (t, at, o = {}) => el(at, t, { cls: `bubble abs${o.r ? ' r' : ''}`, a: 'up', dim: o.dim, style: pos(o, col(o.c)) })
  const node = (inner, at, o = {}) => el(at, inner, { cls: `node abs${o.hiNode ? ' hi' : ''} hlbox`, a: 'scale', dim: o.dim, hl: o.hl, style: pos(o, col(o.c)) })
  const nodeIn = (icon, t, sub) => `${icon ? ic(icon) : ''}${hi(t)}${sub ? `<small>${hi(sub)}</small>` : ''}`
  const hub = (t, at, o = {}) => el(at, t, { cls: `hub abs${o.small ? ' small' : ''}`, a: 'scale', style: `left:${o.x}px;top:${o.y}px` })
  /** 유리(어두움)/흰(밝음) 카드 — c 를 주면 왼쪽 색 띠 */
  const card = (inner, at, o = {}) => el(at, `${o.c ? '<div class="stagebar"></div>' : ''}${inner}`, { cls: `glass abs hlbox${o.hiedge ? ' hiedge' : ''}`, a: o.a ?? 'card', dim: o.dim, hl: o.hl, mv: o.mv, style: pos(o, col(o.c ?? o.ic)) })
  const cardIn = (icon, t, sub) => `<div class="ci">${icon ? `<span class="cic">${ic(icon)}</span>` : ''}<div><b>${hi(t)}</b>${sub ? `<small>${hi(sub)}</small>` : ''}</div></div>`
  const mini = (icon, t, sub) => `<div class="mini">${ic(icon)}<b>${hi(t)}</b>${sub ? `<small>${hi(sub)}</small>` : ''}</div>`
  const status = (t, at, o = {}) => el(at, `<i></i>${hi(t)}`, { cls: 'status abs', a: 'up', style: pos(o) })
  const strike = (t, at, sAt, o = {}) => el(at, `<span class="st">${hi(t)}<span class="sl" data-strike="${r2(sAt)}"></span></span>`, { cls: `${o.cls ?? 'h3'} strike-wrap abs${o.dimtxt === false ? '' : ' dimtxt'}`, a: 'up', style: pos(o) })
  const deco = (kind, x, y, size, c, at) => el(at, '', { cls: `deco ${kind}`, a: 'scale', style: `left:${x}px;top:${y}px;width:${size}px;height:${size}px;${col(c)}` })
  const tagline = (t, at, o = {}) => el(at, `${o.icon ? ic(o.icon) : ''}${hi(t)}`, { cls: 'tagline abs', a: 'fade', style: pos(o) })
  const kpi = (big, small, at, o = {}) => el(at, `${hi(big)}${small ? `<small>${hi(small)}</small>` : ''}`, { cls: 'kpi abs', a: 'scale', style: pos(o, o.size ? `font-size:${o.size}px;` : '') })
  const touch = (x, y, at) => `<span class="touch" data-touch="${r2(at)}" style="left:${x}px;top:${y}px"></span>`

  /** SVG 선들 — lines: [[x1,y1,x2,y2,t0,t1]] 또는 {d,t0,t1} (화면 좌표) */
  const lines = (list, at, o = {}) => `<svg class="abs draw" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;overflow:visible" data-in="${r2(at)}" data-a="fade">${list.map((L) => {
    const d = Array.isArray(L) ? `M${L[0]} ${L[1]}L${L[2]} ${L[3]}` : L.d
    const [t0, t1] = Array.isArray(L) ? [L[4], L[5]] : [L.t0, L.t1]
    return `<path d="${d}" pathLength="1" data-draw="${r2(t0)},${r2(t1)}" style="stroke-width:${o.width ?? 4}px${L.c || o.c ? `;stroke:${C[L.c ?? o.c] ?? L.c ?? o.c}` : ''}"/>`
  }).join('')}</svg>`

  /** 휴대폰(첫 화면만) — 화면 그림 폭에 맞춰 높이를 정한다. kb: 켄 번즈 */
  const phone = ({ src, at, x = 72, y = 330, w = 470, h, ratio = 1212 / 560, kb, swaps = [], inner = '', a = 'card', maxBottom = 1240 }) => {
    // 아래 '예시 데이터' 표기(y 1262)·자막 자리와 겹치지 않게 — 넘치면 폭을 줄인다
    if (!h && y + Math.round((w - 28) * ratio) + 28 > maxBottom) w = Math.floor((maxBottom - y - 28) / ratio) + 28
    const sw = w - 28, sh = h ? h - 28 : Math.round(sw * ratio)
    const imgs = [`<img class="kb" src="${src}" style="width:${sw}px" ${kb ? `data-kb="${kb}"` : ''} alt="">`,
      ...swaps.map((s) => `<img class="kb" src="${s.src}" style="width:${sw}px" data-in="${r2(s.at)}" data-a="none" ${s.kb || kb ? `data-kb="${s.kb || kb}"` : ''} alt="">`)].join('')
    return el(at, `<div class="screen" style="width:${sw}px;height:${sh}px">${imgs}${inner}</div><div class="notch"></div>`, { cls: 'phone', a, style: `left:${x}px;top:${y}px;width:${w}px` })
  }
  /** 브라우저(PC 화면) — 필요한 부분만 크게(kb) */
  const browser = ({ src, at, x = 72, y = 420, w = 888, h = 620, url = 'MIRAE AI LAB · SAMPLE', kb, swaps = [], a = 'card' }) => {
    const imgs = [`<img class="kb" src="${src}" style="width:${w}px" ${kb ? `data-kb="${kb}"` : ''} alt="">`,
      ...swaps.map((s) => `<img class="kb" src="${s.src}" style="width:${w}px" data-in="${r2(s.at)}" data-a="none" ${s.kb || kb ? `data-kb="${s.kb || kb}"` : ''} alt="">`)].join('')
    return el(at, `<div class="bar"><i></i><i></i><i></i><span>${esc(url)}</span></div><div class="view" style="height:${h - 38}px">${imgs}</div>`, { cls: 'browser', a, style: `left:${x}px;top:${y}px;width:${w}px;height:${h}px` })
  }
  // ── v3.1 — 실제 기기 비율 휴대폰(9:19.7) · 실제 스크롤 · 강조(focus) · PC+모바일 짝 ──
  /** 화면 층(layer) — 긴 캡처를 기기 안에서 실제로 스크롤한다. 좌표는 캡처의 CSS px(cssW 기준)
   *  scroll: [[t0,t1,y0,y1], …] (eio, 구간 사이는 멈춤) · focus: [{t0,t1,x,y,w,h}] · at/out: 층 교체(0.35초 교차) */
  //  zoom: [x0, 보이는 폭(CSS px)] — 캡처의 일부(예: 왼쪽 메뉴를 뺀 본문)만 틀에 꽉 차게
  const layer = (L, sw, k0) => {
    const iw = L.zoom ? sw * (sw / k0) / L.zoom[1] : L.coverW ? Math.max(sw, L.coverW) : sw, k = k0 * iw / sw
    const segs = (L.scroll ?? [[0, 0.01, L.y ?? 0, L.y ?? 0]]).map(([a, b, y0, y1]) => [r2(a), r2(b), r2(y0 * k), r2(y1 * k)].join(',')).join(';')
    const fx = (L.focus ?? []).map((f) => `<i class="focus" data-focus="${r2(f.t0)},${r2(f.t1)}" style="left:${r2(f.x * k)}px;top:${r2(f.y * k)}px;width:${r2(f.w * k)}px;height:${r2(f.h * k)}px"></i>`).join('')
    const tch = (L.touch ?? []).map(([x, y, at]) => `<span class="touch" data-touch="${r2(at)}" style="left:${r2(x * k)}px;top:${r2(y * k)}px"></span>`).join('')
    const attrs = L.at != null ? ` data-in="${r2(L.at)}" data-a="none"${L.out != null ? ` data-out="${r2(L.out)}"` : ''}` : ''
    return `<div class="scroller" data-scroll="${segs}"${attrs} style="width:${r2(iw)}px;left:${r2(L.zoom ? -L.zoom[0] * k : (sw - iw) / 2)}px"><img src="${L.src}" alt="">${fx}${tch}</div>`
  }
  /** 휴대폰 — 바깥 비율 9:19.7 고정(찌그러뜨리지 않음). 폭 w 를 주면 높이는 자동 */
  const phone31 = ({ x = 72, y = 230, w = 480, at, layers, cssW = 390, a = 'card', out }) => {
    const H = Math.round(w * 19.7 / 9), sw = w - 28, sh = H - 28, k = sw / cssW
    return el(at, `<div class="screen" style="width:${sw}px;height:${sh}px">${layers.map((L) => layer(L, sw, k)).join('')}</div><div class="notch"></div>`, { cls: 'phone', a, out, style: `left:${x}px;top:${y}px;width:${w}px;height:${H}px` })
  }
  /** 브라우저(PC) — 같은 시스템의 PC 화면. 긴 캡처면 실제로 스크롤 */
  const browser31 = ({ x = 72, y = 400, w = 780, h, at, layers, cssW = 1440, url = 'BUSINESS AX', a = 'card', out }) => {
    const k = w / cssW, vh = (h ?? Math.round(w * 900 / 1440) + 38) - 38
    return el(at, `<div class="bar"><i></i><i></i><i></i><span>${esc(url)}</span></div><div class="view" style="height:${vh}px">${layers.map((L) => layer(L, w, k)).join('')}</div>`, { cls: 'browser', a, out, style: `left:${x}px;top:${y}px;width:${w}px;height:${vh + 38}px` })
  }

  /** 앱 화면을 닮은 예시 카드 */
  const mock = ({ theme = 'ops', title: tt, tag = '예시 화면', rows = '', at, x = 120, y = 400, w = 840 }) =>
    el(at, `<div class="mh">${tt}<em>${esc(tag)}</em></div><div class="mb">${rows}</div>`, { cls: `mock ${theme}`, a: 'card', style: `left:${x}px;top:${y}px;width:${w}px` })

  /** 순환도 — 원(타원) + 노드 + 가운데 허브 + 도는 점(4초에 한 바퀴) */
  const loop = ({ nodes, cx = 540, cy = 780, rx = 300, ry = 420, at, drawAt, drawEnd, orbitAt, hubText, hubAt, nodeW = 250 }) => {
    const n = nodes.length
    let out = `<svg class="abs draw" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0" data-in="${r2(at)}" data-a="fade"><ellipse class="base" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><path d="M${cx} ${cy - ry} A${rx} ${ry} 0 1 1 ${cx - 0.01} ${cy - ry}" pathLength="1" data-draw="${r2(drawAt)},${r2(drawEnd)}" style="stroke-width:3px"/></svg>`
    nodes.forEach((nd, i) => {
      const g = (-90 + (360 / n) * i) * Math.PI / 180
      const px = cx + rx * Math.cos(g), py = cy + ry * Math.sin(g)
      out += node(nodeIn(nd.icon, nd.t), nd.at, { x: r2(px - nodeW / 2), y: r2(py - 62), w: nodeW, c: nd.c, hl: nd.hl })
    })
    if (hubText) out += hub(hubText, hubAt ?? at, { x: cx - 95, y: cy - 95 })
    if (orbitAt != null) out += `<span class="orbit" data-orbit="${r2(orbitAt)},${cx},${cy},${rx},${ry},4"></span>`
    return out
  }
  /** 막대(말한 숫자 비례) — rows: [{label, val, v, at, c}] */
  const bars = (rows, { y = 520, max, step = 150, width = 888 } = {}) => {
    const M = max ?? Math.max(...rows.map((r) => r.v))
    return rows.map((r, i) => {
      const yy = y + i * step, wpx = Math.round(width * r.v / M)
      return el(r.at, r.label, { cls: 'ylabel abs', a: 'fade', style: `left:72px;top:${yy}px` })
        + el(r.at + 0.2, r.val, { cls: 'yval abs', a: 'fade', style: `right:120px;top:${yy - 6}px;text-align:right` })
        + `<div class="track abs" style="left:72px;top:${yy + 64}px;width:${width}px" data-in="${r2(r.at)}" data-a="fade"><div class="fill" style="${col(r.c)}" data-grow="${r2(r.at)},${r2(r.at + 1.2)},${wpx}"></div></div>`
    }).join('')
  }
  /** 끝 장면(밝음) — 로고 + 한 문장 + 다음 행동 */
  const endCard = ({ at, line, sub, cta = [], lineAt, subAt, ctaAt }) => `
    ${el(at, `<img src="assets/logo.png" alt="미래AI랩">`, { cls: 'logo-box', a: 'scale', style: 'left:290px;top:400px' })}
    ${sub ? el(subAt ?? at + 0.3, sub, { cls: 'abs p center-x', style: 'top:640px' }) : ''}
    ${el(lineAt ?? at + 0.5, line, { cls: 'abs h2 center-x', style: `top:${sub ? 720 : 680}px` })}
    <div class="abs col" style="left:140px;right:140px;top:${sub ? 990 : 930}px;gap:20px;align-items:center">${cta.map((t, i) => el((ctaAt ?? at + 0.9) + i * 0.2, t, { cls: `ctab${i ? ' sub' : ''}` })).join('')}</div>`

  // ── 자막: 두 줄 이내, 한 줄 18자(공백 포함) 안, 강조 안에서는 끊지 않는다 ──
  function wrapSub(text) {
    const plain = text.replace(/\*\*/g, '')
    if (plain.length <= 18) return text
    const cands = []
    let inB = false, pi = 0
    for (let i = 0; i < text.length; i++) {
      if (text.startsWith('**', i)) { inB = !inB; i++; continue }
      if (text[i] === ' ' && !inB) cands.push({ i, p: pi })
      pi++
    }
    const mid = plain.length / 2
    const ok = cands.filter((cd) => cd.p <= 18 && plain.length - cd.p - 1 <= 18)
    const pick = (ok.length ? ok : cands).sort((a, b) => Math.abs(a.p - mid) - Math.abs(b.p - mid))[0]
    return pick ? text.slice(0, pick.i) + '\n' + text.slice(pick.i + 1) : text
  }
  const SUBS = T.cues.map((x) => [r2(x.start + O), r2(x.end + O), wrapSub(x.text.trim())])
  SUBS.forEach((s) => {
    for (const ln of s[2].replace(/\*\*/g, '').split('\n')) if (ln.length > 18) console.warn(`  ⚠️ 긴 자막 줄(${ln.length}자): ${ln}`)
    if (s[2].split('\n').length > 2) console.warn('  ⚠️ 3줄 자막:', s[2])
    if ((s[2].match(/\*\*/g) || []).length > 2) console.warn('  ⚠️ 강조 두 군데:', s[2])
  })
  const srtTime = (t) => {
    const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`
  }

  function finish() {
    scenes.sort((a, b) => a.tin - b.tin)
    const body = scenes.map((s, i) => {
      const nx = scenes[i + 1]
      const tout = s.out ?? (nx ? r2(nx.tin + 0.25) : r2(END + 1))
      return `<div class="scene${s.light ? ' light' : ''}" data-in="${s.tin}" data-out="${tout}" data-a="scene">${s.light ? '<div class="lbg"></div>' : ''}${s.html}</div>`
    }).join('\n')
    const html = readFileSync(new URL('./reels2-base.html', import.meta.url), 'utf8')
      .replace('%TITLE%', esc(title || 'reel'))
      .replace('%SCENES%', () => body)
      .replace('%SUBS%', () => JSON.stringify(SUBS))
      .replace('%DUR%', String(END))
    writeFileSync(`${dir}/comp.html`, html)
    writeFileSync(`${dir}/subs.json`, JSON.stringify(SUBS.map(([a, b, t]) => ({ in: a, out: b, text: t })), null, 1))
    writeFileSync(`${dir}/subtitles.srt`, SUBS.map(([a, b, t], i) => `${i + 1}\n${srtTime(a)} --> ${srtTime(b)}\n${t.replace(/\*\*/g, '')}\n`).join('\n'))
    writeFileSync(`${dir}/reel.json`, JSON.stringify({ duration: END, offset: O, voiceEnd: VOICE_END, voice: 'assets/voice.wav', normalized: true, scenes: scenes.length, light: scenes.filter((s) => s.light).length }, null, 1))
    const L = scenes.filter((s) => s.light).length
    const lens = scenes.map((s, i) => r2((scenes[i + 1]?.tin ?? END) - s.tin))
    console.log(`장면 ${scenes.length}개(밝음 ${L}) · 자막 ${SUBS.length}개 · 길이 ${END}초 · 장면 길이 ${Math.min(...lens)}~${Math.max(...lens)}초`)
    let run = 1
    scenes.forEach((s, i) => { if (i && s.light === scenes[i - 1].light) { run++; if (run === 4) console.warn(`  ⚠️ 같은 톤 4장면 연속(장면 ${i - 2}~${i + 1})`) } else run = 1 })
    if (scenes[0]?.light) console.warn('  ⚠️ 첫 장면은 어두워야 해요')
    if (!scenes[scenes.length - 1]?.light) console.warn('  ⚠️ 마지막 장면은 밝아야 해요')
  }

  return { phone31, browser31, T, O, c, ce, w, END, VOICE_END, scene, el, head, note, numtag, check, row, chip, bubble, node, nodeIn, hub, card, cardIn, mini, status, strike, deco, tagline, kpi, touch, lines, phone, browser, mock, loop, bars, endCard, finish, ICONS }
}
