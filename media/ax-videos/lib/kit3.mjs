// 고급 모드 부품 — 한 화면을 4~6초 두고, 그 안에서 말에 맞춰 요소가 차분히 쌓인다.
// 색은 먹색 + 샴페인 골드 한 가지, 카드는 반투명 유리 + 가는 선, 움직임은 느리게(expo.out).
import { ic, r2 } from './lib.mjs'

export function kit3(B, K) {
  const { shot, tw, from, to, words, count, WT, phone, runFlow, addCssLast } = B
  const uid = K.uid

  // 한 화면 안에서 바뀌는 큰 글자(상태 여러 개). 앞 상태는 다음 상태 직전에 위로 사라진다
  function heads(states, o = {}) {
    const id = uid('hd')
    const html = states.map((s, i) => `<div class="hd" id="${id}-${i}" style="top:${s.y ?? o.y ?? 1060}px"><div class="kt ${s.size || o.size || 'm'} c">${WT(s.text)}</div>${s.sub ? `<p class="hds" id="${id}-${i}-s">${s.sub}</p>` : ''}</div>`).join('')
    states.forEach((s, i) => {
      words(`#${id}-${i}`, s.at, 0.07)
      if (s.sub) from(`#${id}-${i}-s`, s.at + 0.35, 'y: 16, opacity: 0', 0.7, 'expo.out')
      if (i + 1 < states.length) to(`#${id}-${i}`, states[i + 1].at - 0.3, 'opacity: 0, y: -24', 0.35, 'power2.in')
    })
    return html
  }
  // 작은 머리말(골드 선 + 글자)
  function eyebrow(text, y, at) {
    const id = uid('eb')
    from(`#${id}`, at, 'opacity: 0, y: 12', 0.9, 'expo.out')
    tw(`tl.fromTo('#${id} i', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut', immediateRender: true }, ${r2(at + 0.1)});`)
    return `<div class="cx" style="top:${y}px"><span class="eyeb" id="${id}"><i></i>${text}<i></i></span></div>`
  }
  // 가는 선 원 아이콘
  function licon(k, y, at, cls = '') {
    const id = uid('li')
    from(`#${id}`, at, 'scale: 0.85, opacity: 0', 0.8, 'expo.out')
    return `<div class="cx" style="top:${y}px"><span class="licon ${cls}" id="${id}">${ic(k)}</span></div>`
  }
  // 유리 카드 목록 — 항목마다 말에 맞춰 올라온다. check(골드 체크)·bar(채워지는 막대) 선택
  function cards(items, o = {}) {
    const id = uid('gc')
    const html = `<div class="gcards ${o.layout || 'col'}" style="top:${o.y ?? 380}px">${items.map((it, i) => `<div class="gcard ${it.hl ? 'hl' : ''}" id="${id}-${i}">${it.ic ? ic(it.ic, 'lg') : ''}<div class="gtx"><b>${it.label}</b>${it.sub ? `<small>${it.sub}</small>` : ''}${it.bar != null ? `<span class="gbar"><i id="${id}-${i}-bar"></i><em></em></span>` : ''}</div>${it.checkAt != null ? `<span class="gck${it.x ? ' x' : ''}" id="${id}-${i}-ck">${ic(it.x ? 'x' : 'check')}</span>` : ''}</div>`).join('')}</div>`
    items.forEach((it, i) => {
      from(`#${id}-${i}`, it.at, `${o.layout === 'row' ? 'y: 50' : 'x: -60'}, opacity: 0`, 0.8, 'expo.out')
      if (it.bar != null) tw(`tl.fromTo('#${id}-${i}-bar', { scaleX: 0 }, { scaleX: ${it.bar}, duration: ${it.barD ?? 1.4}, ease: 'power2.out', immediateRender: true }, ${r2(it.barAt ?? it.at + 0.2)});`)
      if (it.checkAt != null) from(`#${id}-${i}-ck`, it.checkAt, 'scale: 0.5, opacity: 0', 0.5, 'expo.out')
    })
    return { id, html }
  }
  // 큰 숫자(말하는 순간 나타나 센다)
  function number(o) {
    const id = uid('nb')
    from(`#${id}`, o.at - 0.05, 'y: 30, opacity: 0', 0.8, 'expo.out')
    count(`#${id}-n`, o.at, o.from ?? 0, o.to, o.d ?? 1.2, o.fmt)
    return `<div class="cnt ${o.cls || ''}" id="${id}" style="top:${o.y}px">${o.pre ? `<span class="pre">${o.pre}</span>` : ''}<b id="${id}-n">${o.from ?? 0}</b><span class="suf">${o.suf || ''}</span></div>`
  }
  // 도장 대신 — 골드 테두리 글자가 자간을 좁히며 자리 잡는다
  function seal(text, y, at, cls = '') {
    const id = uid('sl')
    from(`#${id}`, at, 'opacity: 0, scale: 1.05', 0.9, 'expo.out')
    tw(`tl.fromTo('#${id} i', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut', immediateRender: true }, ${r2(at + 0.1)});`)
    return `<div class="cx" style="top:${y}px"><div class="seal ${cls}" id="${id}"><i></i><b>${text}</b><i></i></div></div>`
  }
  // 점 격자(사례 수 등)
  function dots(n, cols, y, at, each = 0.004) {
    const id = uid('dt')
    tw(`tl.from('#${id} i', { opacity: 0, scale: 0.3, duration: 0.3, stagger: { each: ${each} } }, ${r2(at)});`)
    return `<div class="pdots" id="${id}" style="top:${y}px;grid-template-columns:repeat(${cols},1fr)">${'<i></i>'.repeat(n)}</div>`
  }
  // 한 장면 = 부품 HTML 을 모아 샷 하나로
  function scene(t, parts, o = {}) { return shot(t, parts.join(''), o) }

  // 제목 카드(고급) — 가는 골드 선이 펼쳐지고 제목이 올라온다
  function title(t, o) {
    const id = uid('pt')
    const html = `<div class="ptline" id="${id}-a" style="top:640px"></div>
      <div class="cx" style="top:690px"><span class="pteb" id="${id}-e">${o.no}</span></div>
      <div class="kt xl c" id="${id}-t" style="top:790px">${WT(o.title)}</div>
      <div class="ptline" id="${id}-b" style="top:1120px"></div>`
    shot(t, html, { bg: 'bgT', trans: 'fade', cam: 'in' })
    tw(`tl.fromTo('#${id}-a, #${id}-b', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.inOut', immediateRender: true }, ${r2(t + 0.05)});`)
    from(`#${id}-e`, t + 0.2, 'opacity: 0, y: 12', 1.0, 'expo.out')
    words(`#${id}-t`, t + 0.3, 0.1)
  }

  addCssLast(PREMIUM_CSS)
  return { heads, eyebrow, licon, cards, number, seal, dots, scene, title }
}

const G = '#D8A871', G2 = '#E6C396', INK = '#0B0E13', IV = '#F2EDE6'
const PREMIUM_CSS = `
/* ── 고급 모드 덮어쓰기 ── */
#root { background: ${INK}; }
.bgA { background: radial-gradient(1200px 900px at 85% -10%, rgba(216,168,113,.15), rgba(216,168,113,0) 60%), radial-gradient(900px 700px at -10% 110%, rgba(90,120,170,.12), rgba(90,120,170,0) 60%), #0B0E13; }
.bgB { background: radial-gradient(1100px 800px at 10% 0%, rgba(120,150,205,.14), rgba(120,150,205,0) 60%), radial-gradient(800px 600px at 100% 100%, rgba(216,168,113,.08), rgba(216,168,113,0) 60%), #0A0E15; }
.bgC { background: radial-gradient(1000px 800px at 50% -5%, rgba(216,168,113,.20), rgba(216,168,113,0) 65%), #110E0B; }
.bgD { background: radial-gradient(1000px 800px at 90% 100%, rgba(216,168,113,.12), rgba(216,168,113,0) 60%), radial-gradient(900px 700px at 0% 0%, rgba(110,150,140,.10), rgba(110,150,140,0) 60%), #0C1011; }
.bgL { background: radial-gradient(1100px 800px at 85% 0%, rgba(216,168,113,.20), rgba(216,168,113,0) 60%), ${IV}; color: #15181D; }
.bgRoom { background: radial-gradient(900px 620px at 50% 0%, rgba(216,168,113,.13), rgba(216,168,113,0) 62%), #0B0E13; }
.bgBlue { background: radial-gradient(1000px 800px at 50% 0%, rgba(216,168,113,.10), rgba(216,168,113,0) 60%), #0A121C; }
.bgOld { background: radial-gradient(900px 700px at 50% 20%, rgba(216,168,113,.16), rgba(216,168,113,0) 60%), #14100C; }
.bgT { background: radial-gradient(900px 700px at 50% 45%, rgba(216,168,113,.14), rgba(216,168,113,0) 65%), #0B0E13; }
.shot::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.38) 100%); }
.bgL.shot::after { background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,40,20,.10) 100%); }
.bpgrid { background-image: linear-gradient(rgba(216,168,113,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(216,168,113,.07) 1px, transparent 1px); background-size: 72px 72px; }
.kt { font-weight: 800; letter-spacing: -0.045em; line-height: 1.18; text-shadow: none; color: #F4F1EC; }
.bgL .kt { color: #15181D; }
.kt.xl { font-size: 116px; } .kt.l { font-size: 94px; } .kt.m { font-size: 76px; } .kt.s { font-size: 58px; }
.kt .hl { color: ${G}; } .bgL .kt .hl { color: #A5703C; }
.hd { position: absolute; left: 0; right: 0; }
.hds { position: absolute; left: 80px; right: 80px; top: 0; transform: translateY(var(--hsy, 210px)); text-align: center; font-size: 36px; font-weight: 500; color: #A9B0B8; letter-spacing: -0.01em; }
.bgL .hds { color: #5E6670; }
.ksub { font-size: 38px; font-weight: 500; color: #A9B0B8; }
.chip { background: rgba(11,14,19,.35); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.5); color: ${G2}; font-size: 28px; font-weight: 600; letter-spacing: .03em; padding: 10px 26px; }
.chip.big { font-size: 34px; padding: 13px 32px; }
.chip.hot { background: ${G}; color: #15110C; box-shadow: none; }
.chip.gray { color: #A9B0B8; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.18); }
.bgL .chip { background: rgba(255,255,255,.5); box-shadow: inset 0 0 0 1.5px rgba(165,112,60,.45); color: #A5703C; } .bgL .chip.hot { background: #C99257; color: #15110C; }
.eyeb { display: inline-flex; align-items: center; gap: 22px; font-size: 26px; font-weight: 600; letter-spacing: .14em; color: ${G2}; white-space: nowrap; }
.eyeb i { display: block; width: 60px; height: 1.5px; background: ${G}; opacity: .7; }
.bgL .eyeb { color: #A5703C; } .bgL .eyeb i { background: #A5703C; }
.licon, .bigic { display: inline-flex; width: 168px; height: 168px; padding: 46px; border-radius: 50%; background: rgba(216,168,113,.06); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.45); color: ${G}; }
.licon .ic, .bigic .ic { width: 100%; height: 100%; }
.bigic.red, .licon.red { color: #E39A88; box-shadow: inset 0 0 0 1.5px rgba(227,154,136,.45); background: rgba(227,154,136,.06); }
.bigic.green, .licon.green { color: #A8D5B8; box-shadow: inset 0 0 0 1.5px rgba(168,213,184,.45); background: rgba(168,213,184,.06); }
.bgL .licon, .bgL .bigic { background: rgba(255,255,255,.6); box-shadow: inset 0 0 0 1.5px rgba(165,112,60,.4); color: #A5703C; }
.gcards { position: absolute; left: 90px; right: 90px; display: flex; flex-direction: column; gap: 22px; }
.gcards.row { flex-direction: row; justify-content: center; gap: 20px; }
.gcard { position: relative; display: flex; align-items: center; gap: 28px; padding: 32px 38px; border-radius: 28px; background: rgba(255,255,255,.045); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.1), 0 24px 60px rgba(0,0,0,.25); color: #F4F1EC; }
.gcards.row .gcard { flex-direction: column; width: 280px; padding: 40px 20px 34px; text-align: center; gap: 18px; }
.gcard.hl { background: rgba(216,168,113,.1); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.6), 0 24px 60px rgba(0,0,0,.3); }
.gcard .ic.lg { width: 70px; height: 70px; color: ${G}; flex: none; }
.gtx { flex: 1; min-width: 0; } .gtx b { display: block; font-size: 48px; font-weight: 700; letter-spacing: -0.03em; white-space: nowrap; } .gtx small { display: block; margin-top: 6px; font-size: 28px; font-weight: 500; color: #9BA3AD; }
.gcards.row .gtx b { font-size: 42px; white-space: normal; }
.gbar { position: relative; display: block; margin-top: 18px; height: 10px; border-radius: 5px; background: rgba(255,255,255,.08); }
.gbar i { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; border-radius: 5px; background: linear-gradient(90deg, rgba(216,168,113,.5), ${G}); transform-origin: 0 50%; }
.gbar em { position: absolute; right: -2px; top: -10px; width: 4px; height: 30px; border-radius: 2px; background: #F4F1EC; }
.gck { flex: none; width: 72px; height: 72px; padding: 18px; border-radius: 50%; background: ${G}; color: #15110C; display: flex; }
.gck .ic { width: 100%; height: 100%; }
.gcards.row .gck { position: absolute; top: -22px; right: -14px; }
.bgL .gcard { background: rgba(255,255,255,.7); box-shadow: inset 0 0 0 1.5px rgba(21,24,29,.06), 0 20px 50px rgba(60,40,20,.08); color: #15181D; }
.bgL .gcard .ic.lg { color: #A5703C; } .bgL .gtx small { color: #6B737D; }
.seal { position: relative; padding: 26px 56px; font-size: 92px; font-weight: 800; letter-spacing: -0.03em; color: #F4F1EC; text-align: center; white-space: nowrap; }
.seal i { display: block; height: 1.5px; background: linear-gradient(90deg, rgba(216,168,113,0), ${G}, rgba(216,168,113,0)); }
.seal b { display: block; padding: 22px 0; font-weight: 800; }
.seal.gold b { color: ${G}; } .bgL .seal { color: #15181D; }
.pdots { position: absolute; left: 170px; right: 170px; display: grid; gap: 12px; }
.pdots i { display: block; width: 16px; height: 16px; border-radius: 50%; background: ${G}; opacity: .7; }
.ptline { position: absolute; left: 160px; right: 160px; height: 1.5px; background: linear-gradient(90deg, rgba(216,168,113,0), ${G}, rgba(216,168,113,0)); }
.pteb { font-size: 30px; font-weight: 600; letter-spacing: .3em; color: ${G2}; }
.tile { background: rgba(255,255,255,.05); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12); font-size: 48px; font-weight: 700; }
.tile.c0, .tile.c1, .tile.c2, .tile.c3, .tile.dark, .tile.red { background: rgba(255,255,255,.05); color: #F4F1EC; }
.tile .ic.lg { color: ${G}; } .tile .tok { background: ${G}; color: #15110C; } .tile .tx { background: #B85C50; }
.cnt b { color: ${G}; font-weight: 800; font-size: 230px; } .cnt .suf, .cnt .pre { font-weight: 600; font-size: 84px; color: #F4F1EC; }
.bgL .cnt b { color: #A5703C; } .bgL .cnt .suf { color: #15181D; }
.cnt.mid b { font-size: 170px; } .cnt.mid .suf { font-size: 70px; }
.phone { padding: 8px; border-radius: 42px; background: #06080B; box-shadow: 0 50px 110px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.16); }
.phone .screen { border-radius: 34px; }
.phone.held { box-shadow: 0 40px 90px rgba(0,0,0,.6), 0 0 0 2px ${G}; }
.touch { background: rgba(255,255,255,.35); box-shadow: 0 0 0 3px ${G}; }
.brw { border-radius: 18px; box-shadow: 0 50px 110px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.1); }
.brw .bar { background: #13171D; } .btag { background: rgba(11,14,19,.72); color: ${G2}; box-shadow: inset 0 0 0 1px rgba(216,168,113,.5); font-weight: 600; }
.judge .head { background: #2A323D; } .judge .body { background: #1E242C; }
.judge .nm { background: rgba(11,14,19,.6); color: #A9B0B8; font-weight: 600; font-size: 22px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
.judge .react.ok { background: ${G}; color: #15110C; } .judge .react.q { background: #F2EDE6; } .judge .react.meh { background: #3A424D; }
.desk { height: 3px; background: linear-gradient(90deg, rgba(216,168,113,0), ${G}, rgba(216,168,113,0)); box-shadow: none; }
.stage { background: none; }
.bub { font-size: 58px; font-weight: 800; }
.bub.jb { background: ${IV}; color: #15181D; box-shadow: 0 30px 80px rgba(0,0,0,.45); } .bub.jb::before { border-bottom-color: ${IV}; }
.bub.mb { background: #1B2129; color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12), 0 30px 80px rgba(0,0,0,.45); } .bub.mb::after { border-top-color: #1B2129; }
.bub .strike { background: #D98C7C; height: 8px; }
.doc { background: #F7F3EE; } .doc i { background: #E7E0D6; }
.doc.ours { background: #FFF8EF; box-shadow: 0 0 0 4px ${G}, 0 16px 40px rgba(216,168,113,.3); } .doc.ours b { color: #A5703C; }
.doc em { background: #ECE6DC; color: #7A6A55; }
.chart .ax { stroke: rgba(255,255,255,.18); stroke-width: 2; } .bgL .chart .ax { stroke: rgba(21,24,29,.18); }
.chart .pl.hot { stroke: ${G}; stroke-width: 10; filter: drop-shadow(0 0 14px rgba(216,168,113,.45)); } .chart .pl.gray { stroke: #3A424D; stroke-width: 7; }
.ctag { background: rgba(11,14,19,.55); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.3); font-weight: 700; font-size: 32px; }
.ctag.hot2 { background: ${G}; color: #15110C; box-shadow: none; }
.bar2 i { background: #2E353F; } .bar2.hot i { background: linear-gradient(180deg, ${G}, rgba(216,168,113,.55)); } .bar2 span { font-weight: 600; } .bar2.hot span { color: ${G}; }
.cut { border-top: 3px dashed rgba(244,241,236,.6); } .cut span { color: #F4F1EC; font-weight: 600; }
.gapmark { border: 3px solid #D98C7C; background: rgba(217,140,124,.18); } .gapmark b { background: #D98C7C; color: #15110C; }
.rchip { background: rgba(255,255,255,.06); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14); font-weight: 700; font-size: 40px; backdrop-filter: blur(6px); }
.rchip.r0, .rchip.r1, .rchip.r2, .rchip.r3 { background: rgba(20,24,30,.78); color: #F4F1EC; }
.rchip.r1, .rchip.r3 { color: ${G2}; box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.45); }
.bigx { width: 300px; height: 300px; padding: 70px; background: rgba(217,140,124,.12); color: #E39A88; box-shadow: inset 0 0 0 2px #D98C7C, 0 30px 90px rgba(0,0,0,.4); }
.gck.x { background: #3A424D; color: #F4F1EC; }
.runner { color: #4A525D; } .runner.ours { color: ${G}; } .runner .spd { background: linear-gradient(90deg, rgba(154,163,173,0), rgba(154,163,173,.5)); }
.lane { background: repeating-linear-gradient(90deg, rgba(255,255,255,.12) 0 40px, transparent 40px 80px); height: 2px; }
.sitem { background: rgba(255,255,255,.06); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14), 0 20px 50px rgba(0,0,0,.3); font-weight: 700; font-size: 40px; }
.sitem.dark { background: rgba(255,255,255,.04); color: #C9CFD6; } .sitem.hot { background: rgba(216,168,113,.12); box-shadow: inset 0 0 0 1.5px ${G}; }
.sitem .ic.lg { color: ${G}; }
.bgL .sitem { background: #fff; color: #15181D; box-shadow: 0 16px 40px rgba(60,40,20,.1); }
.core { background: ${G}; color: #15110C; box-shadow: 0 0 0 14px rgba(216,168,113,.12), 0 30px 90px rgba(216,168,113,.25); border-radius: 50%; }
.node { background: rgba(255,255,255,.05); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12), 0 30px 70px rgba(0,0,0,.3); border-radius: 36px; }
.node .ic.xl { color: ${G}; width: 110px; height: 110px; } .node b { font-size: 44px; font-weight: 700; }
.node.hot { background: rgba(216,168,113,.12); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px ${G}, 0 30px 70px rgba(0,0,0,.35); } .node.hot .ic.xl { color: ${G2}; }
.bgL .node { background: rgba(255,255,255,.75); color: #15181D; } .bgL .node .ic.xl { color: #A5703C; } .bgL .node.hot { background: rgba(216,168,113,.18); box-shadow: inset 0 0 0 1.5px #C99257; color: #15181D; }
.wire path { stroke: ${G}; stroke-width: 4; } .pkt { width: 16px; height: 16px; margin-top: -8px; background: ${G2}; box-shadow: 0 0 16px ${G}; }
.midic { background: #F2EDE6; color: #A5703C; }
.mcard { font-size: 52px; font-weight: 700; border-radius: 30px; }
.mcard.a { background: rgba(255,255,255,.045); color: #C9CFD6; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.1); }
.mcard.b { background: rgba(216,168,113,.12); color: #F4F1EC; box-shadow: inset 0 0 0 1.5px ${G}, 0 30px 80px rgba(0,0,0,.35); }
.mcard .ic.lg { color: ${G}; } .marrow { color: ${G}; }
.pav { background: rgba(255,255,255,.05); color: ${G}; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14); width: 210px; height: 210px; }
.person b { font-weight: 700; font-size: 40px; }
.bgL .pav { background: rgba(255,255,255,.75); color: #A5703C; }
.prx.heart, .prx.star, .prx.ok { background: ${G}; color: #15110C; } .prx { width: 80px; height: 80px; font-size: 44px; padding: 16px; }
.pz { font-size: 54px; font-weight: 700; } .pz.a { background: #18202B; color: #F4F1EC; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12); } .pz.b { background: ${G}; color: #15110C; }
.pz.a .ic.lg { color: ${G}; }
.bld { color: rgba(216,168,113,.85); } .bin { background: #F2EDE6; color: #A5703C; }
.crack path { stroke: #D98C7C; }
.crowd { color: #2C333C; } .crowd .me { color: ${G}; }
.ntf { background: rgba(242,237,230,.96); } .nic { background: ${G}; color: #15110C; } .nic.blue { background: #1B2129; color: ${G2}; } .nic.green { background: #1B2129; color: #A8D5B8; }
.sys { border-radius: 34px; } .sbtn { background: ${G}; color: #15110C; } .shead .ic { color: #A5703C; }
.dcard { background: #FBF6EF; } .dcard.c1 { background: #F4F1EC; } .dcard.c2 { background: #F7F3EA; }
.dcard .ic.lg, .dcard.c1 .ic.lg, .dcard.c2 .ic.lg { color: #A5703C; }
.wallc { background: rgba(11,14,19,.82); color: #F4F1EC; font-size: 90px; box-shadow: inset 0 0 0 1.5px ${G}, 0 30px 80px rgba(0,0,0,.5); backdrop-filter: blur(6px); }
.wallc small { color: ${G2}; font-weight: 600; }
.wall img { border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.45); }
.official { background: #F4F1EC; } .otag { background: #1B2129; color: ${G2}; }
.axbig { color: ${G}; text-shadow: 0 30px 90px rgba(216,168,113,.3); font-size: 320px; }
.axrow em { color: ${G}; }
.ghost { border: 3px dashed rgba(216,168,113,.45); } .gq { color: ${G}; font-weight: 800; }
.lens { box-shadow: inset 0 0 0 5px #F4F1EC; }
.bpsvg path, .wfsvg rect, .wfsvg path { stroke: ${G2}; stroke-width: 3; }
.frow { background: rgba(255,255,255,.04); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.1); } .frow b { color: ${G2}; font-weight: 700; }
.fstep { background: #1B2129; color: #6E7780; } .farr { background: rgba(255,255,255,.15); height: 2px; }
.dbars i { background: linear-gradient(180deg, ${G}, rgba(216,168,113,.2)); }
.timer .arc { stroke: ${G}; } .timer .trk { stroke: rgba(255,255,255,.1); }
.ctab { background: ${G}; color: #15110C; box-shadow: 0 30px 80px rgba(216,168,113,.3); font-weight: 800; }
.ttbg.soft { background: rgba(255,255,255,.03); }
.ecard { background: ${IV}; } .ecard .no { background: #15181D; color: ${G2}; } .ecard li { background: #EDE3D6; color: #8A5C2E; }
.earrow { background: ${G}; color: #15110C; }
.door { background: rgba(255,255,255,.05); color: #6E7780; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12); }
.walker { color: ${G2}; }
.fzv { backdrop-filter: grayscale(1) brightness(.33) blur(5px); background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 100%); }
.fzb { top: 230px; right: 60px; background: none; box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.6); color: ${G2}; font-size: 22px; padding: 10px 14px; border-radius: 50%; }
.fzl { top: 790px; }
.fzl i { display: block; width: 560px; height: 1.5px; margin: 0 auto; background: linear-gradient(90deg, rgba(216,168,113,0), ${G}, rgba(216,168,113,0)); }
.fzl b { display: block; padding: 26px 20px; background: none; color: #F4F1EC; font-size: 70px; font-weight: 800; box-shadow: none; letter-spacing: -0.035em; }
.fzl small { margin: 0 0 26px; color: ${G2}; font-size: 34px; font-weight: 600; text-shadow: none; }
.sub span { background: rgba(9,11,15,.74); backdrop-filter: blur(8px); box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); font-size: 48px; font-weight: 700; padding: 16px 32px; border-radius: 18px; letter-spacing: -0.01em; }
.brand .tag2 { background: rgba(11,14,19,.55); color: ${G2}; box-shadow: inset 0 0 0 1px rgba(216,168,113,.35); font-weight: 600; }
#prog { height: 4px; background: rgba(255,255,255,.1); } #prog i { background: ${G}; }
.foot { color: #6F7780; font-weight: 600; }
.chap span { background: rgba(11,14,19,.55); color: ${G2}; box-shadow: inset 0 0 0 1px rgba(216,168,113,.45); font-weight: 600; letter-spacing: .03em; font-size: 26px; }
.note span { background: rgba(9,11,15,.74); box-shadow: inset 0 0 0 1px rgba(216,168,113,.35); color: ${G2}; font-weight: 600; }
.fine { color: #7D8590; font-weight: 500; }
.stp { background: rgba(255,255,255,.72); color: #8A9099; box-shadow: inset 0 0 0 1.5px rgba(21,24,29,.06), 0 14px 36px rgba(60,40,20,.07); }
.stp .num { background: #EDE6DC; color: #8A9099; } .stp.done { color: #5E6670; } .stp.done .num { background: #C99257; color: #fff; }
.stp.on { background: #15181D; color: #F4F1EC; box-shadow: 0 30px 70px rgba(21,24,29,.3); } .stp.on .num { background: ${G}; color: #15110C; } .stp.on small { color: ${G2}; } .stp.on > .ic.lg { color: ${G}; }
.stp b { font-weight: 800; } .stp small { font-weight: 500; }
.pcard { background: rgba(255,255,255,.75); box-shadow: inset 0 0 0 1.5px rgba(21,24,29,.06), 0 16px 40px rgba(60,40,20,.08); }
.pnum { background: ${G}; color: #15110C; } .ptop em { background: #EDE3D6; color: #8A5C2E; }
.pcard.on { background: #15181D; color: #F4F1EC; box-shadow: 0 30px 70px rgba(21,24,29,.3), 0 0 0 2px ${G}; } .pcard.on .ptop em { background: rgba(216,168,113,.2); color: ${G2}; }
.pval b { color: #A5703C; font-weight: 800; } .pcard.on .pval b { color: ${G}; } .pval span { font-weight: 600; }
.days i { background: ${G}; } .days i:nth-child(n+8) { background: rgba(216,168,113,.3); }
.cb i { background: #2E353F; } .cb.hot i { background: linear-gradient(180deg, ${G}, rgba(216,168,113,.45)); box-shadow: 0 20px 60px rgba(216,168,113,.25); } .cb span { color: #A9B0B8; font-weight: 700; } .cb.hot span { color: ${G}; }
.stage4 { display: flex; gap: 12px; } .stage4 i { display: block; width: 90px; height: 5px; border-radius: 3px; background: rgba(255,255,255,.14); } .stage4 i.on { background: ${G}; }
.bgL .stage4 i { background: rgba(21,24,29,.12); } .bgL .stage4 i.on { background: #C99257; }
.stairs { position: absolute; left: 120px; right: 120px; height: 620px; display: flex; align-items: flex-end; gap: 26px; }
.stairs div { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
.stairs i { display: block; border-radius: 18px 18px 6px 6px; background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12); }
.stairs b { display: block; margin-top: 18px; text-align: center; font-size: 36px; font-weight: 700; color: #C9CFD6; white-space: nowrap; }
.stairs div.on i { background: rgba(216,168,113,.14); box-shadow: inset 0 0 0 1.5px ${G}; } .stairs div.on b { color: ${G}; }
.climber { position: absolute; width: 56px; height: 56px; border-radius: 50%; background: ${G}; box-shadow: 0 0 0 10px rgba(216,168,113,.18), 0 0 40px rgba(216,168,113,.6); }
`
