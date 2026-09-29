// AX 영상 1·2 공통 도구 — 자막 조각(cue)마다 '샷'을 바꿔 한 화면에 오래 머물지 않게 만든다.
//  - 샷은 저마다 배경·등장 전환(슬라이드·줌·와이프·플래시·컷)과 느린 카메라 움직임(밀기·당기기·흐르기)을 가진다.
//  - 샷끼리 0.3초 겹쳐 전환하고, 트랙을 번갈아 써서 겹쳐도 된다.
//  - 프리즈: 중요한 말 뒤 쉼(1초 남짓)에 화면을 멈춘 듯 흑백·비네트 + 큰 강조 글자.
//  - 숫자는 올라가며 세고(count), 폰 화면은 실제로 눌러 가는 흐름(flows.json)을 쓴다.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

export const W = 1080, H = 1920
export const r2 = (n) => Math.round(n * 100) / 100
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const ICON = {
  money: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 9.5v5M18 9.5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  invest: '<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gov: '<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M6 2.5h8l4 4V21.5H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h6M9 14.5h6M9 18h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  ai: '<svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 2.5v2.5M15 2.5v2.5M9 19v2.5M15 19v2.5M2.5 9h2.5M2.5 15h2.5M19 9h2.5M19 15h2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><text x="12" y="15" text-anchor="middle" font-size="7" font-weight="900" fill="currentColor">AI</text></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor"/></svg>',
  users: '<svg viewBox="0 0 24 24"><circle cx="8.5" cy="8" r="3.2" fill="currentColor"/><circle cx="16.5" cy="9" r="2.6" fill="currentColor" opacity=".7"/><path d="M2.5 20c0-3.6 2.7-6 6-6s6 2.4 6 6z" fill="currentColor"/><path d="M13.5 20c.3-2.6 1.6-4.6 4-4.6 2.6 0 4 2 4 4.6z" fill="currentColor" opacity=".7"/></svg>',
  building: '<svg viewBox="0 0 24 24"><path d="M4 21V5l8-2.5V21M12 8.5l8 2.5V21M2 21h20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 8h2M7 11.5h2M7 15h2M15 13h2M15 16.5h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  shop: '<svg viewBox="0 0 24 24"><path d="M4 9.5V20h16V9.5M3 5h18l-1.5 4.5a2.5 2.5 0 0 1-4.8 0 2.5 2.5 0 0 1-5.4 0 2.5 2.5 0 0 1-4.8 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  excel: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#1F7A4D"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="#F2C94C"/><circle cx="9" cy="10.5" r="1.2" fill="#3A3000"/><circle cx="12.5" cy="10.5" r="1.2" fill="#3A3000"/><circle cx="16" cy="10.5" r="1.2" fill="#3A3000"/></svg>',
  memo: '<svg viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5z" fill="#FFF3B0"/><path d="M8 9h8M8 13h8M8 17h5" stroke="#9A8A3A" stroke-width="1.6" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 7 18z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M20 4h-4a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h4z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  bank: '<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  plug: '<svg viewBox="0 0 24 24"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  db: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7.5" ry="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 21h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M3 6l7 7 4-4 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 11v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M3 18l7-7 4 4 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13V8h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  door: '<svg viewBox="0 0 24 24"><path d="M5 21V4h9v17" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 12h7M18 9l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  q: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1.9-1.1 1.8M12 16.8v.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  team: '<svg viewBox="0 0 24 24"><circle cx="6" cy="8" r="2.6" fill="currentColor"/><circle cx="12" cy="6.5" r="3" fill="currentColor"/><circle cx="18" cy="8" r="2.6" fill="currentColor"/><path d="M1.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5zM7 19.5c0-3.5 2.2-6 5-6s5 2.5 5 6zM13.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5z" fill="currentColor" opacity=".85"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  rocket: '<svg viewBox="0 0 24 24"><path d="M12 2.5c3.5 2.2 5.5 6 5.5 10.5l-2.5 3h-6l-2.5-3C6.5 8.5 8.5 4.7 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2" fill="currentColor"/><path d="M9.5 19l2.5 2.5 2.5-2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24"><path d="M12 3.5v16M5 12.5l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24"><path d="M3.5 12h16M12.5 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
}
export const ic = (k, cls = '') => `<i class="ic ${cls}">${ICON[k]}</i>`

export function createBuild(dir, { title, tag }) {
  const T = JSON.parse(readFileSync(`${dir}/timing.json`, 'utf8'))
  const FLOWS = JSON.parse(readFileSync(`${dir}/assets/flows/flows.json`, 'utf8'))
  let js = '', css = '', overlays = ''
  const tw = (c) => { js += `  ${c}\n` }
  const L = (b, l = 1) => { const x = T.lines.find((y) => y.block === b && y.line === l); if (!x) throw new Error(`no line ${b}.${l}`); return x }
  const K = (id) => { if (!(id in T.keys)) throw new Error('no key ' + id); return T.keys[id] }
  const C = (b, l, p = 0) => { const c = T.cues.find((x) => x.block === b && x.line === l && x.part === p); if (!c) throw new Error(`no cue ${b}.${l}.${p}`); return c }
  const at = (b, l, p = 0) => C(b, l, p).start
  // 문장 (b,l) 바로 앞의 실제 쉼 [시작, 끝] — 줄인 목소리(sil-fast.json) 기준. 프리즈·제목을 여기에 건다
  const SIL = existsSync(`${dir}/sil-fast.json`) ? JSON.parse(readFileSync(`${dir}/sil-fast.json`, 'utf8')) : []
  const silBefore = (b, l) => {
    const i = T.lines.findIndex((x) => x.block === b && x.line === l), prev = T.lines[i - 1], nx = T.lines[i]
    const lo = prev.end - 1.2, hi = nx.start + 0.45
    const c = SIL.filter(([s, e]) => e > lo && s < hi).sort((x, y) => (y[1] - y[0]) - (x[1] - x[0]))[0]
    return c ? [r2(c[0]), r2(c[1])] : [r2(prev.end - 0.1), r2(nx.start + 0.15)]
  }
  // 단어 시간: asr-fast.json 에서 needle 이 들어간 첫 단어(after 이후)의 시작 시간
  const WORDS = JSON.parse(readFileSync(`${dir}/asr-fast.json`, 'utf8')).flatMap((sg) => sg.words)
  const nrm = (x) => x.toLowerCase().replace(/[^가-힣a-z0-9]/g, '')
  const MISSING = []
  const wt = (needle, after = 0, end = false) => {
    const n = nrm(needle)
    // 받아쓰기가 한 단어를 둘로 나눈 경우도 찾는다(이어 붙여 찾되, 시작이 이 단어 안이어야)
    for (let i = 0; i < WORDS.length; i++) {
      if (WORDS[i].s < after - 0.35) continue
      const head = nrm(WORDS[i].w)
      const acc = [0, 1, 2, 3].map((k) => (WORDS[i + k] ? nrm(WORDS[i + k].w) : '')).join('')
      const k = acc.indexOf(n)
      if (k >= 0 && k < Math.max(head.length, 1)) return r2(end ? WORDS[i].e : WORDS[i].s - 0.04)
    }
    MISSING.push(`${needle}@${r2(after)}`)
    return r2(after + 0.5)
  }

  // ── 샷
  const shots = []
  let seq = 0
  const TRANS = ['slideL', 'zoom', 'slideU', 'wipe', 'flash', 'slideR', 'zoomOut', 'cut']
  const BGS = ['bgA', 'bgB', 'bgC', 'bgL', 'bgA', 'bgD', 'bgB', 'bgL']
  const CAMS = ['in', 'out', 'driftL', 'in', 'driftR', 'out']
  function shot(t0, inner, o = {}) {
    const i = seq++
    const id = o.id || `sh${i}`
    shots.push({ id, t0: r2(t0), inner, trans: o.trans || TRANS[i % TRANS.length], bg: o.bg || BGS[i % BGS.length], cam: o.cam || CAMS[i % CAMS.length] })
    return id
  }
  const OVER = 0.3
  function renderShots(TOTAL) {
    shots.sort((a, b) => a.t0 - b.t0)
    let out = ''
    shots.forEach((s, i) => {
      const t1 = i + 1 < shots.length ? r2(shots[i + 1].t0 + OVER) : TOTAL
      const d = r2(t1 - s.t0)
      out += `<section class="clip shot ${s.bg}" id="${s.id}" data-start="${s.t0}" data-duration="${d}" data-track-index="${1 + (i % 2)}"><div class="cam" id="${s.id}-cam">${s.inner}</div></section>\n`
      const t = s.t0, sel = `#${s.id}`
      if (i > 0) {
        if (s.trans === 'slideL') tw(`tl.from('${sel}', { xPercent: 100, duration: 0.38, ease: 'power3.out' }, ${t});`)
        else if (s.trans === 'slideR') tw(`tl.from('${sel}', { xPercent: -100, duration: 0.38, ease: 'power3.out' }, ${t});`)
        else if (s.trans === 'slideU') tw(`tl.from('${sel}', { yPercent: 100, duration: 0.38, ease: 'power3.out' }, ${t});`)
        else if (s.trans === 'zoom') tw(`tl.from('${sel}', { scale: 1.35, opacity: 0, duration: 0.34, ease: 'power2.out' }, ${t});`)
        else if (s.trans === 'zoomOut') tw(`tl.from('${sel}', { scale: 0.82, opacity: 0, duration: 0.34, ease: 'power2.out' }, ${t});`)
        else if (s.trans === 'wipe') tw(`tl.fromTo('${sel}', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power3.inOut', immediateRender: false }, ${t});`)
        else if (s.trans === 'flash') { tw(`tl.from('${sel}', { opacity: 0, duration: 0.12 }, ${t});`); tw(`tl.fromTo('#flash', { opacity: 0.85 }, { opacity: 0, duration: 0.3, immediateRender: false }, ${t});`) }
        else if (s.trans === 'cut') { /* 바로 바꾼다 */ }
      }
      const cam = `#${s.id}-cam`
      if (s.cam === 'in') tw(`tl.fromTo('${cam}', { scale: 1 }, { scale: 1.07, duration: ${d}, ease: 'none' }, ${t});`)
      else if (s.cam === 'out') tw(`tl.fromTo('${cam}', { scale: 1.07 }, { scale: 1, duration: ${d}, ease: 'none' }, ${t});`)
      else if (s.cam === 'driftL') tw(`tl.fromTo('${cam}', { x: 24, scale: 1.04 }, { x: -24, scale: 1.04, duration: ${d}, ease: 'none' }, ${t});`)
      else if (s.cam === 'driftR') tw(`tl.fromTo('${cam}', { x: -24, scale: 1.04 }, { x: 24, scale: 1.04, duration: ${d}, ease: 'none' }, ${t});`)
    })
    return out
  }

  // ── 움직임 도구(절대 시간)
  const from = (sel, t, v, d = 0.45, ease = 'power3.out') => tw(`tl.from('${sel}', { ${v}, duration: ${d}, ease: '${ease}' }, ${r2(t)});`)
  const to = (sel, t, v, d = 0.4, ease = 'power2.out') => tw(`tl.to('${sel}', { ${v}, duration: ${d}, ease: '${ease}' }, ${r2(t)});`)
  const pop = (sel, t, d = 0.45) => from(sel, t, "scale: 0.4, opacity: 0", d, 'back.out(1.9)')
  const rise = (sel, t, d = 0.42) => from(sel, t, 'y: 60, opacity: 0', d, 'power3.out')
  const slam = (sel, t) => from(sel, t, 'scale: 1.8, opacity: 0', 0.3, 'power4.out')
  const stagger = (sel, t, v, each = 0.1, d = 0.4, ease = 'back.out(1.7)') => tw(`tl.from('${sel}', { ${v}, duration: ${d}, ease: '${ease}', stagger: ${each} }, ${r2(t)});`)
  const words = (sel, t, each = 0.08) => tw(`tl.from('${sel} .w', { yPercent: 115, opacity: 0, duration: 0.42, ease: 'power3.out', stagger: ${each} }, ${r2(t)});`)
  const pulse = (sel, t, n = 2) => tw(`tl.to('${sel}', { scale: 1.08, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: ${n * 2 - 1} }, ${r2(t)});`)
  const shake = (sel, t) => { tw(`tl.fromTo('${sel}', { x: 0 }, { x: 14, duration: 0.05, yoyo: true, repeat: 7, ease: 'none', immediateRender: false }, ${r2(t)});`); tw(`tl.set('${sel}', { x: 0 }, ${r2(t + 0.45)});`) }
  const count = (sel, t, a, b, d = 1.1, fmt = "Math.round(v).toLocaleString('ko-KR')") =>
    tw(`(function(){ const o = { v: ${a} }; const el = document.querySelector('${sel}'); tl.to(o, { v: ${b}, duration: ${d}, ease: 'power2.out', onUpdate: () => { const v = o.v; el.textContent = ${fmt}; } }, ${r2(t)}); })();`)
  const draw = (sel, t, d = 0.8) => tw(`tl.fromTo('${sel}', { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: ${d}, ease: 'power2.inOut', immediateRender: true }, ${r2(t)});`)

  // 큰 글자 — 단어마다 가림막에서 올라온다
  const WT = (s) => { let on = false; return s.split(/(<br>)/).map((p) => (p === '<br>' ? '<br>' : p.split(' ').filter(Boolean).map((w) => {
    // '*' 로 강조를 켜고 끈다(여러 단어·단어 일부 모두 가능)
    const parts = w.split('*'); let html = ''
    parts.forEach((q, i) => { if (i > 0) on = !on; if (q) html += on ? `<em class="hl">${q}</em>` : q })
    return `<span class="wm"><span class="w">${html}</span></span>` }).join(' '))).join('') }

  // ── 폰 흐름(실제로 눌러 가는 화면)
  const nn = (x) => String(x).padStart(2, '0')
  const hasA = (name, st) => (FLOWS[name].a || []).includes(st)
  const flowLayer = (id, name, steps, width) => steps.map((st) =>
    (hasA(name, st) ? `<img class="fimg" id="${id}-${name}-${nn(st)}a" src="assets/flows/${name}-${nn(st)}a.jpg" style="width:${width}px;opacity:0" alt="">` : '') +
    `<img class="fimg" id="${id}-${name}-${nn(st)}" src="assets/flows/${name}-${nn(st)}.jpg" style="width:${width}px;opacity:0" alt="">`).join('')
  const touchLayer = (id, name, steps, sc) => steps.filter((st) => FLOWS[name].taps[st]).map((st) => {
    const p = FLOWS[name].taps[st]
    return `<span class="touch" id="${id}-${name}-t${st}" style="left:${r2(p.x * sc)}px;top:${r2(p.y * sc)}px"></span>`
  }).join('')
  const stepAt = (id, name, st, t) => {
    if (hasA(name, st)) tw(`tl.set('#${id}-${name}-${nn(st)}a', { opacity: 1 }, ${r2(t)});`)
    if (FLOWS[name].taps[st]) tw(`tl.fromTo('#${id}-${name}-t${st}', { scale: 0.4, opacity: 0.95 }, { scale: 1.5, opacity: 0, duration: 0.36, ease: 'power2.out', immediateRender: false }, ${r2(t + 0.04)});`)
    tw(`tl.to('#${id}-${name}-${nn(st)}', { opacity: 1, duration: 0.12 }, ${r2(t + (hasA(name, st) ? 0.2 : 0))});`)
  }
  // 폰: base 화면 + 단계 화면들. 390px 캡처 기준 → sw 폭
  const phone = (id, name, base, steps, sw, cls = '', extra = '') =>
    `<div class="phone ${cls}" id="${id}"><div class="screen" style="width:${sw}px"><img class="fimg" src="assets/flows/${name}-${nn(base)}.jpg" style="width:${sw}px" alt="">${flowLayer(id, name, steps, sw)}${touchLayer(id, name, steps, sw / 390)}${extra}</div></div>`
  const phoneImg = (id, src, sw, cls = '') => `<div class="phone ${cls}" id="${id}"><div class="screen" style="width:${sw}px"><img class="fimg" src="${src}" style="width:${sw}px" alt=""></div></div>`
  const runFlow = (id, name, steps, t0, t1) => steps.forEach((st, i) => stepAt(id, name, st, t0 + (i * (t1 - t0)) / steps.length))

  // ── 프리즈 — 화면이 멈춘 듯(흑백·비네트) + 큰 강조 글자. 말 뒤 쉼(edits.json gapBefore)에 건다
  let fz = 0
  function freeze(t, d, label, sub = '') {
    const id = `fz${fz++}`
    overlays += `<div class="clip freeze" id="${id}" data-start="${r2(t)}" data-duration="${r2(d)}" data-track-index="6"><div class="fzv"></div><span class="fzb">❚❚</span><div class="fzl" id="${id}-l"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</div></div>\n`
    tw(`tl.fromTo('#flash', { opacity: 0.9 }, { opacity: 0, duration: 0.25, immediateRender: false }, ${r2(t)});`)
    tw(`tl.from('#${id} .fzv', { opacity: 0, duration: 0.15 }, ${r2(t)});`)
    tw(`tl.from('#${id}-l', { scale: 1.6, opacity: 0, duration: 0.3, ease: 'power4.out' }, ${r2(t + 0.05)});`)
    tw(`tl.to('#${id}-l', { scale: 1.04, duration: ${r2(Math.max(0.3, d - 0.4))}, ease: 'none' }, ${r2(t + 0.35)});`)
  }

  // ── 자막
  const textW = (t) => [...t].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? 50 : /[A-Za-z0-9]/.test(ch) ? 30 : ch === ' ' ? 14 : 18), 0)
  const splitAt = (t) => {
    const ws = t.split(' '), mid = t.length / 2
    let best = null, pos = 0
    for (let i = 0; i < ws.length - 1; i++) {
      pos += ws[i].length
      let score = Math.abs(pos - mid)
      if (/[,.?’”]$/.test(ws[i])) score -= 6
      if (ws[i].length === 1 || ws[i + 1].length === 1) score += 8
      if (!best || score < best.score) best = { pos, score }
      pos += 1
    }
    return best ? best.pos : -1
  }
  const BREAKS = []
  const twoLines = (t) => {
    const manual = BREAKS.find((x) => x.replace(' / ', ' ') === t)
    if (manual) return manual.split(' / ').map(esc).join('<br>')
    if (textW(t) <= 870) return esc(t)
    const sp = splitAt(t)
    return sp > 0 ? `${esc(t.slice(0, sp))}<br>${esc(t.slice(sp + 1))}` : esc(t)
  }

  function finish(TOTAL, extraHtml = '') {
    const shotHtml = renderShots(TOTAL)
    let subs = ''
    T.cues.forEach((c, i) => {
      subs += `<div class="clip sub" id="sub${i}" data-start="${c.start}" data-duration="${r2(c.end - c.start)}" data-track-index="9"><span>${twoLines(c.text)}</span></div>`
      tw(`tl.from('#sub${i} span', { y: 12, opacity: 0, duration: 0.14, ease: 'power1.out' }, ${c.start});`)
    })
    tw(`tl.fromTo('#prog i', { scaleX: 0 }, { scaleX: 1, duration: ${TOTAL}, ease: 'none' }, 0);`)
    const doc = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="assets/gsap.min.js"></script>
<style>
${[['Medium', 500], ['SemiBold', 600], ['Bold', 700], ['ExtraBold', 800], ['Black', 900]].map(([n, w]) => `@font-face { font-family: 'Pretendard'; src: url('assets/fonts/Pretendard-${n}.subset.woff2') format('woff2'); font-weight: ${w}; font-display: block; }`).join('\n')}
${BASE_CSS}
${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
  ${shotHtml}
  ${extraHtml}
  ${overlays}
  <div class="brand"><span class="logo"><img src="assets/logo.png" alt="미래에이아이랩"></span><span class="tag2">${tag}</span></div>
  <p class="foot">miraeailab.com · ${esc(title)}</p><div id="prog"><i></i></div>
  <div id="flash"></div>
  ${subs}
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
${js}
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
</body>
</html>
`
    writeFileSync(`${dir}/index.html`, doc)
    const ts = (x) => { const ms = Math.round(x * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}` }
    writeFileSync(`${dir}/subtitles.srt`, T.cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n'))
    if (MISSING.length) console.log('⚠ 못 찾은 단어:', MISSING.join(' | '))
    console.log('index.html · subtitles.srt', 'TOTAL', TOTAL, 's · shots', shots.length, '· 평균', r2(TOTAL / shots.length), '초')
  }

  return { T, FLOWS, tw, L, K, C, at, wt, silBefore, shot, from, to, pop, rise, slam, stagger, words, pulse, shake, count, draw, WT, phone, phoneImg, runFlow, stepAt, freeze, finish, BREAKS, addCss: (c) => { css += c }, addOverlay: (h) => { overlays += h }, twoLines }
}

const BASE_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #171B20; }
#root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #171B20; color: #fff; font-family: 'Pretendard', sans-serif; word-break: keep-all; }
em { font-style: normal; } .peach { color: #E8B89A; } .orange { color: #F0894A; } .green { color: #7FD8A4; } .red { color: #FF6B6E; } .blue { color: #7EB2FF; }
.clip { position: absolute; inset: 0; }
.shot { overflow: hidden; }
.cam { position: absolute; inset: 0; transform-origin: 50% 45%; }
.bgA { background: radial-gradient(circle at 85% 8%, rgba(212,122,74,.38), rgba(212,122,74,0) 45%), #171B20; }
.bgB { background: radial-gradient(circle at 10% 90%, rgba(80,130,220,.30), rgba(80,130,220,0) 50%), #10161F; }
.bgC { background: radial-gradient(circle at 50% 0%, rgba(240,137,74,.30), rgba(240,137,74,0) 55%), #221914; }
.bgD { background: radial-gradient(circle at 20% 15%, rgba(127,216,164,.22), rgba(127,216,164,0) 50%), #121A17; }
.bgL { background: radial-gradient(circle at 80% 10%, rgba(240,137,74,.25), rgba(240,137,74,0) 50%), #F4ECE4; color: #171B20; }
.bgL .peach { color: #C8612E; } .bgL .muted { color: #5A636D; }
.muted { color: #9AA3AD; }
.ic { display: inline-flex; width: 44px; height: 44px; color: currentColor; flex: none; } .ic svg { width: 100%; height: 100%; }
.ic.lg { width: 80px; height: 80px; } .ic.xl { width: 150px; height: 150px; }
.wm { display: inline-block; overflow: hidden; vertical-align: bottom; padding-bottom: 6px; } .w { display: inline-block; }
.kt { position: absolute; left: 64px; right: 64px; font-weight: 900; letter-spacing: -0.035em; line-height: 1.14; }
.kt.xl { font-size: 128px; } .kt.l { font-size: 104px; } .kt.m { font-size: 84px; } .kt.s { font-size: 64px; } .kt.c { text-align: center; }
.eyebrow { position: absolute; left: 64px; font-size: 34px; font-weight: 900; letter-spacing: .08em; color: #F0894A; }
.pill { display: inline-flex; align-items: center; gap: 12px; padding: 16px 32px; border-radius: 999px; font-weight: 900; }
.card { border-radius: 30px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); }
.bgL .card { background: #fff; box-shadow: 0 16px 40px rgba(23,27,32,.12), inset 0 0 0 1px rgba(23,27,32,.06); }
.abs { position: absolute; }
.fimg { position: absolute; left: 0; top: 0; display: block; }
.touch { position: absolute; width: 60px; height: 60px; margin: -30px 0 0 -30px; border-radius: 50%; background: rgba(255,255,255,.55); box-shadow: 0 0 0 4px rgba(212,122,74,.95); opacity: 0; z-index: 5; }
.phone { position: absolute; padding: 10px; border-radius: 44px; background: #0E1114; box-shadow: 0 40px 90px rgba(0,0,0,.55), 0 0 0 2px rgba(255,255,255,.16); }
.phone .screen { position: relative; overflow: hidden; border-radius: 34px; background: #fff; aspect-ratio: 390 / 844; }
.fine { position: absolute; left: 70px; right: 70px; font-size: 24px; font-weight: 600; line-height: 1.45; color: #8A939C; } .fine.c { text-align: center; } .bgL .fine { color: #6B7680; }
#flash { position: absolute; inset: 0; background: #fff; opacity: 0; z-index: 35; pointer-events: none; }
.freeze { z-index: 34; }
.fzv { position: absolute; inset: 0; backdrop-filter: grayscale(.9) brightness(.45) blur(3px); background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.6) 100%); }
.fzb { position: absolute; right: 64px; top: 220px; padding: 10px 18px; border-radius: 12px; background: rgba(0,0,0,.6); color: #fff; font-size: 30px; font-weight: 900; letter-spacing: -2px; }
.fzl { position: absolute; left: 50px; right: 50px; top: 760px; text-align: center; }
.fzl b { display: inline-block; padding: 26px 50px; border-radius: 28px; background: #F0894A; color: #171B20; font-size: 76px; font-weight: 900; letter-spacing: -0.03em; line-height: 1.15; box-shadow: 0 30px 80px rgba(240,137,74,.45); }
.fzl small { display: block; margin-top: 22px; font-size: 40px; font-weight: 800; color: #fff; text-shadow: 0 4px 20px rgba(0,0,0,.8); }
.brand { position: absolute; top: 96px; left: 56px; right: 56px; height: 60px; display: flex; align-items: center; justify-content: space-between; z-index: 30; }
.brand .logo { height: 60px; padding: 9px 16px; background: #fff; border-radius: 14px; display: flex; align-items: center; box-shadow: 0 6px 20px rgba(0,0,0,.25); } .brand .logo img { height: 42px; }
.brand .tag2 { padding: 10px 18px; border-radius: 999px; background: rgba(16,20,25,.78); font-size: 25px; font-weight: 800; color: #E8B89A; }
.sub { display: flex; align-items: flex-end; justify-content: center; padding: 0 60px 400px; z-index: 40; }
.sub span { max-width: 960px; padding: 18px 34px; border-radius: 22px; background: rgba(8,10,13,.9); color: #fff; font-size: 50px; font-weight: 800; line-height: 1.32; text-align: center; }
.foot { position: absolute; left: 70px; right: 70px; top: 1664px; text-align: center; font-size: 26px; font-weight: 700; color: #7C8591; z-index: 30; }
#prog { position: absolute; left: 70px; right: 70px; top: 1726px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.14); overflow: hidden; z-index: 30; }
#prog i { display: block; width: 100%; height: 100%; background: #D47A4A; transform-origin: 0 50%; }
`
