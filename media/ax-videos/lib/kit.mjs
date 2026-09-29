// 샷 부품 — 한 샷 = 한 자막 조각(2~4초). 글자는 짧은 핵심어만, 나머지는 그림·숫자·실제 화면으로 움직인다.
// 모든 시간은 절대 시간(초). t = 샷 시작(보통 자막 조각 시작).
import { ic, r2 } from './lib.mjs'

export function kit(B) {
  const { shot, tw, from, to, pop, rise, slam, stagger, words, pulse, shake, count, draw, WT, phone, runFlow, addCss, addOverlay } = B
  let n = 0
  const uid = (p) => `${p}${n++}`
  const chipAt = (id, text, top, cls = '') => `<div class="cx" style="top:${top}px"><span class="chip ${cls}" id="${id}">${text}</span></div>`
  const subAt = (id, text, top, cls = '') => `<p class="ksub ${cls}" id="${id}" style="top:${top}px">${text}</p>`
  const fineAt = (id, text, top) => `<p class="fine c" id="${id}" style="top:${top}px">${text}</p>`

  // 큰 글자(핵심어) + 아이콘 + 짧은 보조 한 줄
  function big(t, o) {
    const id = uid('bt'), y = o.y ?? 700
    const iconY = o.iconY ?? y - 330
    const html = `${o.bgx || ''}${o.eb ? chipAt(`${id}-eb`, o.eb, o.ebY ?? (o.icon ? iconY - 100 : y - 120), o.ebc || '') : ''}
      ${o.icon ? `<div class="cx" style="top:${iconY}px"><span class="bigic ${o.icc || ''}" id="${id}-ic">${ic(o.icon)}</span></div>` : ''}
      <div class="kt ${o.size || 'l'} c" id="${id}-t" style="top:${y}px">${WT(o.text)}</div>
      ${o.sub ? subAt(`${id}-s`, o.sub, o.subY ?? y + (o.size === 'xl' ? 330 : 280), o.subc || '') : ''}
      ${o.fine ? fineAt(`${id}-f`, o.fine, o.fineY ?? 1290) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    if (o.icon) pop(`#${id}-ic`, o.iconAt ?? t + 0.08)
    words(`#${id}-t`, o.at ?? t + 0.12, o.each ?? 0.07)
    if (o.sub) rise(`#${id}-s`, o.subAt ?? t + 0.55)
    if (o.fine) from(`#${id}-f`, t + 0.4, 'opacity: 0', 0.4)
    if (o.pulseAt) pulse(`#${id}-t`, o.pulseAt, 1)
    return id
  }

  // 아이콘 타일 여러 개가 말에 맞춰 날아든다
  function tiles(t, o) {
    const id = uid('tl')
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, o.ebY ?? 250) : ''}<div class="tiles ${o.layout || 'col'}" style="top:${o.y ?? 330}px">${o.items.map((it, i) =>
      `<div class="tile ${it.c || 'c' + (i % 4)}" id="${id}-${i}">${ic(it.ic, 'lg')}<b>${it.label}</b>${it.x ? `<span class="tx" id="${id}-${i}-x">${ic('x')}</span>` : ''}${it.ok ? `<span class="tok" id="${id}-${i}-ok">${ic('check')}</span>` : ''}</div>`).join('')}</div>${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    o.items.forEach((it, i) => {
      from(`#${id}-${i}`, it.at ?? t + 0.12 + i * 0.22, `x: ${i % 2 ? 760 : -760}, rotation: ${i % 2 ? 10 : -10}, opacity: 0`, 0.42, 'back.out(1.3)')
      if (it.x) slam(`#${id}-${i}-x`, it.xAt)
      if (it.ok) pop(`#${id}-${i}-ok`, it.okAt)
    })
    return id
  }

  // 도장 쾅
  function stamp(t, o) {
    const id = uid('st'), y = o.y ?? 600, at = o.at ?? t + 0.25
    const html = `${o.under || ''}<div class="cx" style="top:${y}px"><div class="stamp ${o.color || 'red'}" id="${id}">${o.text}</div></div>${o.sub ? subAt(`${id}-s`, o.sub, o.subY ?? y + 250) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    tw(`tl.from('#${id}', { scale: 2.8, opacity: 0, duration: 0.26, ease: 'power4.in' }, ${r2(at)});`)
    tw(`tl.fromTo('#${id}', { x: 0 }, { x: 12, duration: 0.05, yoyo: true, repeat: 5, ease: 'none', immediateRender: false }, ${r2(at + 0.26)});`)
    if (o.sub) rise(`#${id}-s`, o.subAt ?? at + 0.45)
    return id
  }

  // 올라가는 숫자
  function counter(t, o) {
    const id = uid('cn'), y = o.y ?? 520
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, o.ebY ?? y - 120, o.ebc || '') : ''}${o.above || ''}
      <div class="cnt ${o.cls || ''}" id="${id}" style="top:${y}px">${o.pre ? `<span class="pre">${o.pre}</span>` : ''}<b id="${id}-n">${o.fromTxt ?? o.from ?? 0}</b><span class="suf">${o.suf || ''}</span></div>
      ${o.label ? subAt(`${id}-s`, o.label, o.labelY ?? y + 290) : ''}${o.fine ? fineAt(`${id}-f`, o.fine, o.fineY ?? 1290) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    // 숫자는 말하는 순간(at) 튀어나오며 센다 — 그 전엔 '0' 이 떠 있지 않게
    from(`#${id}`, (o.at ?? t + 0.2) - 0.05, 'scale: 0.6, opacity: 0', 0.35, 'back.out(1.6)')
    count(`#${id}-n`, o.at ?? t + 0.2, o.from ?? 0, o.to, o.d ?? 1.2, o.fmt)
    if (o.label) rise(`#${id}-s`, o.labelAt ?? t + 0.6)
    if (o.fine) from(`#${id}-f`, t + 0.5, 'opacity: 0', 0.4)
    return id
  }

  // 폰 + 실제로 눌러 가는 화면
  function phoneShot(t, o) {
    const id = uid('ph'), sw = o.sw ?? 420, W = sw + 20, left = o.left ?? (1080 - W) / 2 + (o.dx || 0), top = o.top ?? 250
    const html = `${o.bgx || ''}<div class="abs" style="left:${left}px;top:${top}px">${phone(id, o.name, o.base, o.steps || [], sw, o.cls || '', o.inner || '')}</div>
      ${o.label ? chipAt(`${id}-lb`, o.label, o.labelY ?? top + sw * 844 / 390 + 40, o.lbc || '') : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    from(`#${id}`, t + 0.02, `y: 420, rotation: ${o.rot ?? 5}, opacity: 0`, 0.5, 'power3.out')
    if (o.label) from(`#${id}-lb`, o.labelAt ?? t + 0.35, 'y: 30, opacity: 0', 0.35)
    if (o.run) runFlow(id, o.name, o.steps, o.run[0], o.run[1])
    if (o.scrollAt) to(`#${id} .screen > img`, o.scrollAt, `y: ${o.scrollBy ?? -300}`, 1.2, 'power2.inOut')
    return id
  }

  // 브라우저 창 + 가로 화면(데스크톱 캡처) — 천천히 훑는다
  function browser(t, o) {
    const id = uid('bw'), top = o.top ?? 360
    const html = `${o.bgx || ''}${o.eb ? chipAt(`${id}-eb`, o.eb, o.ebY ?? top - 100, o.ebc || '') : ''}
      <div class="brw" id="${id}" style="top:${top}px"><div class="bar"><i></i><i></i><i></i><span>${o.url || ''}</span></div><div class="vp"><img id="${id}-img" src="${o.src}" alt=""></div>${o.tag ? `<span class="btag">${o.tag}</span>` : ''}</div>
      ${o.label ? chipAt(`${id}-lb`, o.label, o.labelY ?? top + 700, o.lbc || '') : ''}${o.sub ? subAt(`${id}-s`, o.sub, o.subY ?? top + 690) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    from(`#${id}`, t + 0.02, 'y: 260, rotationX: 28, transformPerspective: 1400, opacity: 0', 0.5, 'power3.out')
    tw(`tl.fromTo('#${id}-img', { scale: 1.02, x: 0, y: 0 }, { scale: ${o.zoom ?? 1.22}, x: ${o.panX ?? -60}, y: ${o.panY ?? -30}, duration: ${o.d ?? 3.2}, ease: 'sine.inOut' }, ${r2(t)});`)
    if (o.eb) from(`#${id}-eb`, t + 0.15, 'y: -30, opacity: 0', 0.35)
    if (o.label) from(`#${id}-lb`, o.labelAt ?? t + 0.4, 'y: 30, opacity: 0', 0.35)
    if (o.sub) rise(`#${id}-s`, o.subAt ?? t + 0.45)
    return id
  }

  // 한 샷 안에서 화면이 말에 맞춰 휙휙 바뀐다(업종별)
  function swap(t, o) {
    const id = uid('sw'), top = o.top ?? 420
    const html = `<div class="brw" id="${id}" style="top:${top}px"><div class="bar"><i></i><i></i><i></i><span>${o.url || ''}</span></div><div class="vp">${o.items.map((it, i) => `<img id="${id}-${i}" src="${it.src}" alt="" style="opacity:${i ? 0 : 1}">`).join('')}</div>${o.tag ? `<span class="btag">${o.tag}</span>` : ''}</div>
      <div class="cx" style="top:${top - 130}px">${o.items.map((it, i) => `<span class="chip big abs0" id="${id}-l${i}" style="opacity:${i ? 0 : 1}">${it.label}</span>`).join('')}</div>${o.extra || ''}`
    shot(t, html, o.shot)
    from(`#${id}`, t + 0.02, 'y: 260, opacity: 0', 0.45)
    o.items.forEach((it, i) => {
      if (i) {
        tw(`tl.fromTo('#${id}-${i}', { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1.05, duration: 0.22, ease: 'power2.out', immediateRender: false }, ${r2(it.at)});`)
        tw(`tl.set('#${id}-l${i - 1}', { opacity: 0 }, ${r2(it.at)});`)
        tw(`tl.fromTo('#${id}-l${i}', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.25, immediateRender: false }, ${r2(it.at)});`)
        tw(`tl.fromTo('#flash', { opacity: 0.35 }, { opacity: 0, duration: 0.18, immediateRender: false }, ${r2(it.at)});`)
      } else {
        from(`#${id}-l0`, t + 0.15, 'y: -30, opacity: 0', 0.3)
      }
    })
    return id
  }

  // 화면 벽 — 샘플 여러 개가 쏟아져 들어온다
  function wall(t, o) {
    const id = uid('wl'), cols = o.cols ?? 4, tw_ = o.tile ?? 238, th = Math.round(tw_ * 0.625), gap = 12
    const top = o.top ?? 280
    const html = `<div class="wall" id="${id}" style="top:${top}px;width:${cols * tw_ + (cols - 1) * gap}px;grid-template-columns:repeat(${cols},${tw_}px);grid-auto-rows:${th}px">${o.srcs.map((s) => `<img src="${s}" alt="">`).join('')}</div>
      ${o.center ? `<div class="cx" style="top:${o.centerY ?? 640}px"><div class="wallc" id="${id}-c">${o.center}</div></div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    tw(`tl.from('#${id} img', { scale: 0, rotation: (i) => ((i * 37) % 30) - 15, opacity: 0, duration: 0.36, ease: 'back.out(1.6)', stagger: { each: ${o.each ?? 0.05}, from: 'center' } }, ${r2(t + 0.05)});`)
    if (o.center) slam(`#${id}-c`, o.centerAt ?? t + 0.9)
    return id
  }

  // 심사장 — 심사위원 셋 + 말풍선(심사위원 / 발표자)
  function room(t, o) {
    const id = uid('rm')
    const judge = (k) => `<div class="judge" id="${id}-j${k}"><span class="head"></span><span class="body"></span><span class="nm">심사위원</span>${o.react ? `<span class="react ${o.react}" id="${id}-r${k}">${o.react === 'ok' ? ic('check') : o.react === 'q' ? '?' : '…'}</span>` : ''}</div>`
    const bubble = o.q ? `<div class="cx" style="top:${o.qY ?? 720}px"><div class="bub jb" id="${id}-q"><span id="${id}-qt">${o.q}</span></div></div>` : ''
    const mine = o.me ? `<div class="cx" style="top:${o.meY ?? 930}px"><div class="bub mb ${o.meCls || ''}" id="${id}-m"><span id="${id}-mt">${o.me}</span>${o.cross ? `<i class="strike" id="${id}-x"></i>` : ''}</div></div>` : ''
    const show = o.show ? `<div class="abs" style="left:${(1080 - 290) / 2}px;top:${o.showY ?? 680}px">${B.phoneImg(`${id}-ph`, o.show, 270, 'held')}</div>` : ''
    const html = `<div class="stage"></div><div class="judges" id="${id}-js">${judge(0)}${judge(1)}${judge(2)}</div><div class="desk"></div>${bubble}${mine}${show}${o.extra || ''}`
    shot(t, html, { bg: 'bgRoom', ...(o.shot || {}) })
    tw(`tl.from('#${id}-js .judge', { y: 80, opacity: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, ${r2(t + 0.02)});`)
    if (o.q) {
      from(`#${id}-q`, o.qAt ?? t + 0.2, 'scale: 0.3, opacity: 0, transformOrigin: "50% 0%"', 0.35, 'back.out(1.8)')
      tw(`tl.fromTo('#${id}-qt', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: ${o.qType ?? 0.8}, ease: 'none', immediateRender: true }, ${r2((o.qAt ?? t + 0.2) + 0.15)});`)
    }
    if (o.me) {
      from(`#${id}-m`, o.meAt ?? t + 0.25, 'scale: 0.3, opacity: 0, transformOrigin: "50% 100%"', 0.35, 'back.out(1.8)')
      tw(`tl.fromTo('#${id}-mt', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: ${o.meType ?? 0.8}, ease: 'none', immediateRender: true }, ${r2((o.meAt ?? t + 0.25) + 0.15)});`)
    }
    if (o.cross) { tw(`tl.fromTo('#${id}-x', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: true }, ${r2(o.crossAt)});`); tw(`tl.to('#${id}-m', { opacity: 0.45, duration: 0.3 }, ${r2(o.crossAt + 0.2)});`) }
    if (o.show) from(`#${id}-ph`, o.showAt ?? t + 0.2, 'y: 700, rotation: -8', 0.55, 'power3.out')
    if (o.react) tw(`tl.from('#${id}-js .react', { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(2)', stagger: 0.12 }, ${r2(o.reactAt ?? t + 0.8)});`)
    if (o.frown) tw(`tl.to('#${id}-js .head', { backgroundColor: '#6B7280', duration: 0.4 }, ${r2(o.frown)});`)
    return id
  }

  // 문서 격자 — 비슷비슷한 계획서들
  function docs(t, o) {
    const id = uid('dc'), N = o.n ?? 24, ours = o.ours ?? 13
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 250) : ''}<div class="docs" id="${id}" style="top:${o.top ?? 340}px">${Array.from({ length: N }, (_, i) => `<div class="doc ${i === ours ? 'ours' : ''}" ${i === ours ? `id="${id}-o"` : ''}><i></i><i></i><i></i><i></i>${o.ai ? '<em>AI</em>' : ''}${i === ours ? '<b>우리 회사</b>' : ''}</div>`).join('')}</div>${o.extra || ''}`
    shot(t, html, { bg: 'bgL', ...(o.shot || {}) })
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    tw(`tl.from('#${id} .doc', { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(1.6)', stagger: { each: ${o.each ?? 0.03}, from: ${ours} } }, ${r2(t + 0.05)});`)
    if (o.grayAt) { tw(`tl.to('#${id}-o', { backgroundColor: '#E6E1DB', boxShadow: 'none', duration: 0.5 }, ${r2(o.grayAt)});`); tw(`tl.to('#${id}-o b', { opacity: 0, duration: 0.4 }, ${r2(o.grayAt)});`); tw(`tl.to('#${id}', { scale: 0.86, opacity: 0.55, duration: 0.8, ease: 'power2.inOut' }, ${r2(o.grayAt)});`) }
    if (o.pulseAt) pulse(`#${id}-o`, o.pulseAt, 1)
    return id
  }

  // 선 그래프 — 오르는 / 멈춘 / 남들만 오르는 / 다시 오르는
  function chart(t, o) {
    const id = uid('ch'), top = o.top ?? 430
    const P = {
      up: 'M60 520 C 260 500, 380 420, 520 330 S 780 120, 860 70',
      flat: 'M60 400 C 260 396, 500 404, 860 400',
      o1: 'M60 520 C 300 470, 520 260, 860 80', o2: 'M60 520 C 300 480, 560 320, 860 160', o3: 'M60 520 C 300 500, 600 380, 860 240',
      ours: 'M60 520 C 300 516, 560 522, 860 514',
    }
    let paths = ''
    if (o.mode === 'others') paths = ['o1', 'o2', 'o3'].map((k) => `<path class="pl gray" d="${P[k]}"/>`).join('') + `<path class="pl hot" d="${P.ours}"/>`
    else if (o.mode === 'recover') paths = `<path class="pl gray" d="M60 470 C 200 468, 330 474, 440 470"/><path class="pl hot" id="${id}-up" d="M440 470 C 560 460, 640 360, 720 260 S 820 110, 870 70"/>`
    else if (o.mode === 'gap') paths = `<path class="pl gray" d="M60 470 C 300 462, 560 470, 860 452"/><path class="pl hot" d="M60 470 C 300 440, 560 300, 860 70"/>`
    else if (o.mode === 'flat') paths = `<path class="pl gray" d="${P.flat}"/>`
    else paths = `<path class="pl hot" d="${P.up}"/>`
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, top - 110, o.ebc || '') : ''}<svg class="chart" id="${id}" viewBox="0 0 920 600" style="top:${top}px"><path class="ax" d="M60 40 V560 H880"/>${paths}</svg>
      ${o.tagOurs ? `<span class="ctag" id="${id}-to" style="left:${o.tagOursX ?? 700}px;top:${top + (o.tagOursY ?? 560)}px">${o.tagOurs}</span>` : ''}
      ${o.tagTop ? `<span class="ctag hot2" id="${id}-tt" style="left:${o.tagTopX ?? 680}px;top:${top + (o.tagTopY ?? 20)}px">${o.tagTop}</span>` : ''}
      ${o.label ? subAt(`${id}-s`, o.label, o.labelY ?? top + 700) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    tw(`tl.fromTo('#${id} .pl', { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: ${o.d ?? 1.4}, ease: 'power2.inOut', stagger: ${o.mode === 'recover' ? 0.9 : 0.12}, immediateRender: true }, ${r2(o.at ?? t + 0.1)});`)
    if (o.tagOurs) pop(`#${id}-to`, o.tagOursAt ?? t + 1.0)
    if (o.tagTop) pop(`#${id}-tt`, o.tagTopAt ?? t + 1.4)
    if (o.label) rise(`#${id}-s`, o.labelAt ?? t + 0.7)
    return id
  }

  // 막대 + 기준선 — 한 끗 모자라다
  function cutline(t, o) {
    const id = uid('cl'), top = o.top ?? 400
    const bars = [['A사', 0.96, 'g'], ['B사', 0.9, 'g'], ['우리 회사', 0.8, 'hot'], ['C사', 0.93, 'g']]
    const html = `<div class="bars" id="${id}" style="top:${top}px">${bars.map(([nm, h, c], i) => `<div class="bar2 ${c}"><i id="${id}-b${i}" style="height:${h * 640}px"></i><span>${nm}</span></div>`).join('')}
      <div class="cut" id="${id}-cut" style="bottom:${0.84 * 640 + 60}px"><span>선정 기준선</span></div>
      <div class="gapmark" id="${id}-g" style="left:${2 * 222 + 40}px;bottom:${0.8 * 640 + 60}px;height:${0.04 * 640}px"><b>한 끗</b></div></div>${o.extra || ''}`
    shot(t, html, o.shot)
    tw(`tl.from('#${id} .bar2 i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.7, ease: 'power3.out', stagger: 0.1 }, ${r2(t + 0.05)});`)
    from(`#${id}-cut`, t + 0.35, 'scaleX: 0, transformOrigin: "0% 50%"', 0.45, 'power2.out')
    pop(`#${id}-g`, o.gapAt ?? t + 0.9)
    if (o.gapAt) pulse(`#${id}-g`, o.gapAt + 0.4, 1)
    return id
  }

  // 쏟아지는 칩(새 기술 등)
  function rain(t, o) {
    const id = uid('rn'), labels = o.labels, dur = o.d ?? 3.2
    const xs = [80, 560, 300, 720, 150, 480, 640, 40, 380, 700, 220, 520, 90, 610]
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 240, 'hot') : ''}<div class="rain" id="${id}">${labels.map((l, i) => `<span class="rchip r${i % 4}" id="${id}-${i}" style="left:${xs[i % xs.length]}px">${l}</span>`).join('')}</div>${o.center ? `<div class="kt m c" id="${id}-c" style="top:${o.centerY ?? 1080}px">${WT(o.center)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    labels.forEach((_, i) => tw(`tl.fromTo('#${id}-${i}', { y: -200, rotation: ${(i % 2 ? 1 : -1) * (6 + (i % 3) * 5)} }, { y: 1500, rotation: ${(i % 2 ? -1 : 1) * 8}, duration: ${r2(1.5 + (i % 3) * 0.3)}, ease: 'power1.in', immediateRender: true }, ${r2(t + (i * (dur - 1.2)) / labels.length)});`))
    if (o.eb) pop(`#${id}-eb`, t + 0.1)
    if (o.center) words(`#${id}-c`, o.centerAt ?? t + 0.4)
    return id
  }

  // 달리는 회사들 vs 제자리
  function race(t, o) {
    const id = uid('rc')
    const lanes = [360, 560, 760, 960]
    const html = `${lanes.map((y, i) => `<div class="lane" style="top:${y}px"></div>`).join('')}
      ${[0, 1, 3].map((k, i) => `<span class="runner" id="${id}-r${i}" style="top:${lanes[k] - 50}px">${ic('building')}<i class="spd"></i></span>`).join('')}
      <span class="runner ours" id="${id}-me" style="top:${lanes[2] - 50}px;left:420px">${ic('building')}<b>우리 회사</b></span>
      ${o.label ? `<div class="kt m c" id="${id}-t" style="top:1100px">${WT(o.label)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    ;[0, 1, 2].forEach((i) => tw(`tl.fromTo('#${id}-r${i}', { x: -260 }, { x: 1300, duration: ${r2(1.1 + i * 0.25)}, ease: 'none', repeat: 3, immediateRender: true }, ${r2(t + i * 0.2)});`))
    pop(`#${id}-me`, t + 0.1)
    if (o.label) words(`#${id}-t`, o.labelAt ?? t + 0.5)
    if (o.shrinkAt) tw(`tl.to('#${id}-me', { scale: 0.7, filter: 'grayscale(1)', opacity: 0.6, duration: 0.8 }, ${r2(o.shrinkAt)});`)
    return id
  }

  // 흩어진 것들 → (explode) 흩어짐 / (gather) 한곳에 모임
  function scatter(t, o) {
    const id = uid('sc')
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 240) : ''}${o.items.map((it, i) => `<div class="sitem ${it.cls || ''}" id="${id}-${i}" style="left:${it.x}px;top:${it.y}px;transform:rotate(${it.r || 0}deg)">${it.ic ? ic(it.ic, 'lg') : ''}${it.label ? `<b>${it.label}</b>` : ''}</div>`).join('')}
      ${o.core ? `<div class="core" id="${id}-core" style="left:${(1080 - 300) / 2}px;top:${o.coreY ?? 560}px">${ic(o.core.ic, 'xl')}<b>${o.core.label}</b></div>` : ''}${o.center ? `<div class="kt m c" id="${id}-t" style="top:${o.centerY ?? 1120}px">${WT(o.center)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    o.items.forEach((it, i) => pop(`#${id}-${i}`, it.at ?? t + 0.1 + i * 0.12))
    if (o.explodeAt) o.items.forEach((it, i) => to(`#${id}-${i}`, o.explodeAt, `x: ${(it.x - 440) * 0.9}, y: ${(it.y - 700) * 0.9}, rotation: ${(i % 2 ? 1 : -1) * 25}, opacity: 0.35`, 0.7, 'power2.out'))
    if (o.gatherAt) {
      o.items.forEach((it, i) => to(`#${id}-${i}`, o.gatherAt + i * 0.05, `x: ${440 - it.x}, y: ${(o.coreY ?? 560) + 80 - it.y}, scale: 0.2, opacity: 0`, 0.55, 'power2.in'))
      if (o.core) from(`#${id}-core`, o.gatherAt + 0.45, 'scale: 0, opacity: 0', 0.45, 'back.out(1.8)')
    } else if (o.core) pop(`#${id}-core`, o.coreAt ?? t + 0.3)
    if (o.center) words(`#${id}-t`, o.centerAt ?? t + 0.5)
    return id
  }

  // 두 점을 잇는 선(안 ↔ 밖, 데이터 연결)
  function link(t, o) {
    const id = uid('lk'), y = o.y ?? 600
    const node = (k, n) => `<div class="node ${n.cls || ''}" id="${id}-${k}" style="left:${k === 'a' ? 90 : 630}px;top:${y}px">${ic(n.ic, 'xl')}<b>${n.label}</b></div>`
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, y - 150, o.ebc || '') : ''}${node('a', o.a)}${node('b', o.b)}
      <svg class="wire" viewBox="0 0 1080 200" style="top:${y + 60}px"><path id="${id}-w" d="M 420 100 C 500 20, 580 180, 660 100"/></svg>
      ${[0, 1, 2].map((k) => `<span class="pkt" id="${id}-p${k}" style="top:${y + 150}px"></span>`).join('')}
      ${o.mid ? `<div class="cx" style="top:${y + 40}px"><span class="midic" id="${id}-mid">${ic(o.mid, 'lg')}</span></div>` : ''}
      ${o.label ? `<div class="kt m c" id="${id}-t" style="top:${o.labelY ?? y + 380}px">${WT(o.label)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.1, 'y: -30, opacity: 0', 0.35)
    from(`#${id}-a`, o.aAt ?? t + 0.05, 'x: -300, opacity: 0', 0.45, 'back.out(1.4)')
    from(`#${id}-b`, o.bAt ?? t + 0.2, 'x: 300, opacity: 0', 0.45, 'back.out(1.4)')
    const la = o.linkAt ?? t + 0.6
    tw(`tl.fromTo('#${id}-w', { strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', immediateRender: true }, ${r2(la)});`)
    ;[0, 1, 2].forEach((k) => tw(`tl.fromTo('#${id}-p${k}', { x: 430, opacity: 0 }, { x: 640, opacity: 1, duration: 0.7, ease: 'none', repeat: 3, immediateRender: false }, ${r2(la + 0.4 + k * 0.23)});`))
    if (o.mid) pop(`#${id}-mid`, o.midAt ?? la + 0.3)
    if (o.label) words(`#${id}-t`, o.labelAt ?? t + 0.5)
    return id
  }

  // A → B 로 바뀐 사례 카드
  function morph(t, o) {
    const id = uid('mp')
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 250, o.ebc || '') : ''}
      <div class="mcard a" id="${id}-a" style="top:${o.aY ?? 360}px">${ic(o.from[0], 'lg')}<b>${o.from[1]}</b></div>
      <div class="cx" style="top:${(o.aY ?? 360) + 205}px"><span class="marrow" id="${id}-ar">${ic('arrowDown')}</span></div>
      <div class="mcard b" id="${id}-b" style="top:${(o.aY ?? 360) + 330}px">${ic(o.to[0], 'lg')}<b>${o.to[1]}</b></div>
      ${o.fine ? fineAt(`${id}-f`, o.fine, o.fineY ?? 1290) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    from(`#${id}-a`, o.aAt ?? t + 0.05, 'x: -700, opacity: 0', 0.4, 'power3.out')
    from(`#${id}-ar`, o.arAt ?? t + 0.45, 'y: -60, opacity: 0', 0.3)
    from(`#${id}-b`, o.bAt ?? t + 0.7, 'scale: 0.4, opacity: 0', 0.45, 'back.out(1.8)')
    if (o.fine) from(`#${id}-f`, t + 0.3, 'opacity: 0', 0.3)
    return id
  }

  // 사람들(정부·심사위원·투자자 등) + 반응
  function people(t, o) {
    const id = uid('pp'), y = o.y ?? 520
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, y - 150, o.ebc || '') : ''}<div class="people" style="top:${y}px">${o.items.map((it, i) => `<div class="person" id="${id}-${i}"><span class="pav">${ic(it[0], 'lg')}</span><b>${it[1]}</b>${o.react ? `<span class="prx ${o.react}" id="${id}-x${i}">${o.react === 'heart' ? '♥' : o.react === 'ok' ? ic('check') : o.react === 'star' ? ic('star') : '?'}</span>` : ''}</div>`).join('')}</div>
      ${o.center ? `<div class="kt m c" id="${id}-t" style="top:${o.centerY ?? y + 420}px">${WT(o.center)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    o.items.forEach((it, i) => from(`#${id}-${i}`, it[2] ?? t + 0.08 + i * 0.18, 'y: 200, opacity: 0', 0.4, 'back.out(1.5)'))
    if (o.react) tw(`tl.from('[id^="${id}-x"]', { scale: 0, y: 40, opacity: 0, duration: 0.35, ease: 'back.out(2.2)', stagger: 0.14 }, ${r2(o.reactAt ?? t + 0.7)});`)
    if (o.center) words(`#${id}-t`, o.centerAt ?? t + 0.5)
    return id
  }

  // 두 조각이 딱 맞물린다
  function puzzle(t, o) {
    const id = uid('pz'), y = o.y ?? 520
    const html = `<div class="pz a" id="${id}-a" style="top:${y}px">${ic(o.a[0], 'lg')}<b>${o.a[1]}</b></div><div class="pz b" id="${id}-b" style="top:${y}px">${ic(o.b[0], 'lg')}<b>${o.b[1]}</b></div>
      <div class="cx" style="top:${y + 330}px"><span class="chip hot big" id="${id}-r">${o.result}</span></div>${o.extra || ''}`
    shot(t, html, o.shot)
    from(`#${id}-a`, t + 0.05, 'x: -600, rotation: -12', 0.5, 'power3.out')
    from(`#${id}-b`, t + 0.05, 'x: 600, rotation: 12', 0.5, 'power3.out')
    const s = o.snapAt ?? t + 0.7
    tw(`tl.to('#${id}-a', { x: 40, duration: 0.18, ease: 'power4.in' }, ${r2(s)});`)
    tw(`tl.to('#${id}-b', { x: -40, duration: 0.18, ease: 'power4.in' }, ${r2(s)});`)
    tw(`tl.fromTo('#flash', { opacity: 0.6 }, { opacity: 0, duration: 0.3, immediateRender: false }, ${r2(s + 0.18)});`)
    from(`#${id}-r`, s + 0.25, 'scale: 0.3, opacity: 0', 0.4, 'back.out(2)')
    return id
  }

  // 회사 건물(안이 보이게) · 흔들림
  function building(t, o) {
    const id = uid('bd')
    const html = `<div class="cx" style="top:${o.y ?? 330}px"><div class="bld" id="${id}">${ic('building')}${(o.inside || []).map((x, i) => `<span class="bin" id="${id}-i${i}" style="left:${x.x}px;top:${x.y}px">${ic(x.ic)}</span>`).join('')}${o.crack ? `<svg class="crack" id="${id}-ck" viewBox="0 0 100 100"><path d="M50 5 L44 30 L56 45 L42 70 L52 95"/></svg>` : ''}</div></div>
      ${o.label ? `<div class="kt m c" id="${id}-t" style="top:${o.labelY ?? 1110}px">${WT(o.label)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    from(`#${id}`, t + 0.02, 'y: 300, opacity: 0', 0.45, 'power3.out')
    ;(o.inside || []).forEach((x, i) => pop(`#${id}-i${i}`, x.at ?? t + 0.4 + i * 0.15))
    if (o.glowAt) tw(`tl.to('#${id} .bin', { boxShadow: '0 0 40px 10px rgba(240,137,74,.8)', duration: 0.4, stagger: 0.08 }, ${r2(o.glowAt)});`)
    if (o.shakeAt) { tw(`tl.fromTo('#${id}', { x: 0, rotation: 0 }, { x: 16, rotation: 2, duration: 0.06, yoyo: true, repeat: 11, ease: 'none', immediateRender: false }, ${r2(o.shakeAt)});`); tw(`tl.set('#${id}', { x: 0, rotation: 0 }, ${r2(o.shakeAt + 0.75)});`) }
    if (o.crack) tw(`tl.fromTo('#${id}-ck path', { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 0.4, immediateRender: true }, ${r2(o.shakeAt ?? t + 0.6)});`)
    if (o.label) words(`#${id}-t`, o.labelAt ?? t + 0.45)
    return id
  }

  // 수많은 회사(경쟁)
  function crowd(t, o) {
    const id = uid('cw'), N = o.n ?? 48
    const html = `<div class="crowd" id="${id}" style="top:${o.top ?? 340}px">${Array.from({ length: N }, (_, i) => `<span class="${i === (o.ours ?? 27) ? 'me' : ''}">${ic('building')}</span>`).join('')}</div>
      ${o.label ? `<div class="kt ${o.size || 'l'} c" id="${id}-t" style="top:${o.labelY ?? 1080}px">${WT(o.label)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    tw(`tl.from('#${id} span', { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(2)', stagger: { each: 0.02, from: 'center' } }, ${r2(t + 0.05)});`)
    if (o.label) slam(`#${id}-t`, o.labelAt ?? t + 0.5)
    if (o.shakeAt) shake(`#${id}`, o.shakeAt)
    return id
  }

  // 단계 목록(로드맵) — 지금 단계만 크게
  function steps(t, o) {
    const id = uid('sp'), top = o.top ?? 300
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, top - 90, o.ebc || '') : ''}<div class="steps" style="top:${top}px">${o.items.map((it, i) => `<div class="stp ${i === o.active ? 'on' : i < o.active ? 'done' : ''}" id="${id}-${i}"><span class="num">${i < o.active ? ic('check') : i + 1}</span><div><b>${it[0]}</b>${it[1] ? `<small>${it[1]}</small>` : ''}</div>${it[2] ? ic(it[2], 'lg') : ''}</div>`).join('')}</div>${o.extra || ''}`
    shot(t, html, { bg: 'bgL', ...(o.shot || {}) })
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    tw(`tl.from('[id^="${id}-"].stp', { x: -500, opacity: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, ${r2(t + 0.05)});`)
    if (o.active != null && o.active >= 0) { tw(`tl.from('#${id}-${o.active}', { scale: 0.85, duration: 0.4, ease: 'back.out(2)' }, ${r2(t + 0.5)});`); pulse(`#${id}-${o.active} .num`, t + 0.8, 1) }
    if (o.activeAt) o.activeAt.forEach((at, i) => {
      if (i > 0) tw(`tl.set('#${id}-${i - 1}', { attr: { class: 'stp done' } }, ${r2(at)});`)
      tw(`tl.set('#${id}-${i}', { attr: { class: 'stp on' } }, ${r2(at)});`)
      tw(`tl.fromTo('#${id}-${i}', { scale: 0.88 }, { scale: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, ${r2(at)});`)
    })
    return id
  }

  // 알림이 쌓인다
  function notifs(t, o) {
    const id = uid('nt')
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 250, o.ebc || '') : ''}<div class="nstack" style="top:${o.top ?? 360}px">${o.items.map((it, i) => `<div class="ntf" id="${id}-${i}"><span class="nic ${it.c || ''}">${ic(it.ic)}</span><div><b>${it.t}</b><small>${it.s || ''}</small></div><em>${it.w || '방금'}</em></div>`).join('')}</div>${o.fine ? fineAt(`${id}-f`, o.fine, o.fineY ?? 1290) : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    o.items.forEach((it, i) => from(`#${id}-${i}`, it.at ?? t + 0.15 + i * 0.35, 'y: -160, opacity: 0, scale: 0.9', 0.4, 'back.out(1.4)'))
    if (o.fine) from(`#${id}-f`, t + 0.3, 'opacity: 0', 0.3)
    return id
  }

  // 체크리스트 — 하나씩 체크
  function checks(t, o) {
    const id = uid('ck')
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 260, o.ebc || '') : ''}<div class="checks" style="top:${o.top ?? 420}px">${o.items.map((it, i) => `<div class="chk" id="${id}-${i}"><span class="box" id="${id}-b${i}">${ic(o.xmark ? 'x' : 'check')}</span><b>${it[0]}</b></div>`).join('')}</div>${o.center ? `<div class="kt m c" id="${id}-t" style="top:${o.centerY ?? 1100}px">${WT(o.center)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    o.items.forEach((it, i) => { from(`#${id}-${i}`, t + 0.08 + i * 0.1, 'x: 400, opacity: 0', 0.35); from(`#${id}-b${i} .ic`, it[1] ?? t + 0.5 + i * 0.3, 'scale: 0, opacity: 0', 0.3, 'back.out(2.4)'); if (!o.xmark) tw(`tl.to('#${id}-b${i}', { backgroundColor: '#2FA66A', duration: 0.2 }, ${r2(it[1] ?? t + 0.5 + i * 0.3)});`) })
    if (o.center) words(`#${id}-t`, o.centerAt ?? t + 0.6)
    return id
  }

  // 가격 카드 3장
  function prices(t, o) {
    const id = uid('pr')
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 240, o.ebc || '') : ''}<div class="prices" style="top:${o.top ?? 330}px">${o.items.map((it, i) => `<div class="pcard ${i === o.active ? 'on' : ''} ${o.dim && i !== o.active ? 'dim' : ''}" id="${id}-${i}"><div class="ptop"><span class="pnum">${i + 1}</span><b>${it.name}</b>${it.tag ? `<em>${it.tag}</em>` : ''}</div><div class="pval"><b id="${id}-v${i}">${it.v}</b><span>만 원부터</span></div></div>`).join('')}</div>${o.fine ? fineAt(`${id}-f`, o.fine, o.fineY ?? 1290) : ''}${o.extra || ''}`
    shot(t, html, { bg: 'bgL', ...(o.shot || {}) })
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    o.items.forEach((it, i) => {
      if (it.at != null) { from(`#${id}-${i}`, it.at, 'x: 700, opacity: 0', 0.4, 'back.out(1.3)'); count(`#${id}-v${i}`, it.at + 0.15, 0, it.n, 0.7) }
      else from(`#${id}-${i}`, t + 0.05 + i * 0.08, 'y: 60, opacity: 0', 0.35)
    })
    if (o.active != null && o.pulseAt) pulse(`#${id}-${o.active}`, o.pulseAt, 1)
    if (o.fine) from(`#${id}-f`, t + 0.3, 'opacity: 0', 0.3)
    return id
  }

  // 챕터 칩(위쪽 작은 이름표) — 장이 바뀔 때 잠깐
  function chapter(t, label, d = 2.6) {
    const id = uid('cp')
    addOverlay(`<div class="clip chap" id="${id}" data-start="${r2(t)}" data-duration="${r2(d)}" data-track-index="7"><span>${label}</span></div>\n`)
    tw(`tl.from('#${id} span', { y: -40, opacity: 0, duration: 0.35, ease: 'power3.out' }, ${r2(t)});`)
    tw(`tl.to('#${id} span', { opacity: 0, duration: 0.3 }, ${r2(t + d - 0.3)});`)
  }

  // 화면 아래 작은 안내(※) — 장면 위에 겹쳐 둔다
  function note(t, d, text, top = 1300) {
    const id = uid('no')
    addOverlay(`<div class="clip" id="${id}" data-start="${r2(t)}" data-duration="${r2(d)}" data-track-index="8"><p class="note" style="top:${top}px">${text}</p></div>\n`)
    tw(`tl.from('#${id} .note', { y: 20, opacity: 0, duration: 0.3 }, ${r2(t)});`)
  }

  addCss(KIT_CSS)
  return { uid, chipAt, subAt, fineAt, big, tiles, stamp, counter, phoneShot, browser, swap, wall, room, docs, chart, cutline, rain, race, scatter, link, morph, people, puzzle, building, crowd, steps, notifs, checks, prices, chapter, note }
}

const KIT_CSS = `
.cx { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
.chip { display: inline-flex; align-items: center; gap: 10px; padding: 12px 28px; border-radius: 999px; background: rgba(255,255,255,.1); box-shadow: inset 0 0 0 2px rgba(255,255,255,.18); font-size: 34px; font-weight: 800; color: #E8B89A; white-space: nowrap; }
.chip.big { font-size: 46px; padding: 16px 36px; }
.chip.hot { background: #F0894A; color: #171B20; box-shadow: 0 16px 40px rgba(240,137,74,.4); }
.chip.ok { background: #2FA66A; color: #fff; box-shadow: none; }
.chip.gray { background: rgba(255,255,255,.1); color: #C9D0D8; }
.bgL .chip { background: #fff; color: #C8612E; box-shadow: 0 8px 24px rgba(23,27,32,.1); }
.bgL .chip.hot { background: #F0894A; color: #171B20; }
.abs0 { position: absolute; }
.ksub { position: absolute; left: 70px; right: 70px; text-align: center; font-size: 44px; font-weight: 700; line-height: 1.35; color: #C9D0D8; }
.bgL .ksub { color: #4A535C; }
.kt .hl { font-style: normal; color: #F0894A; } .bgL .kt .hl { color: #C8612E; }
.kt { text-shadow: 0 6px 30px rgba(0,0,0,.25); } .bgL .kt { text-shadow: none; }
.bigic { display: inline-flex; width: 230px; height: 230px; padding: 44px; border-radius: 60px; background: rgba(240,137,74,.16); color: #F0894A; box-shadow: inset 0 0 0 3px rgba(240,137,74,.4); }
.bigic .ic { width: 100%; height: 100%; }
.bigic.red { background: rgba(255,107,110,.14); color: #FF6B6E; box-shadow: inset 0 0 0 3px rgba(255,107,110,.4); }
.bigic.green { background: rgba(127,216,164,.14); color: #7FD8A4; box-shadow: inset 0 0 0 3px rgba(127,216,164,.4); }
.bigic.blue { background: rgba(126,178,255,.14); color: #7EB2FF; box-shadow: inset 0 0 0 3px rgba(126,178,255,.4); }
.bgL .bigic { background: #fff; box-shadow: 0 20px 50px rgba(23,27,32,.12); color: #C8612E; }
.tiles { position: absolute; left: 90px; right: 90px; display: flex; gap: 26px; }
.tiles.col { flex-direction: column; } .tiles.row { justify-content: center; } .tiles.row .tile { flex-direction: column; width: 280px; height: 300px; justify-content: center; text-align: center; }
.tile { position: relative; display: flex; align-items: center; gap: 30px; padding: 34px 44px; border-radius: 34px; font-size: 58px; font-weight: 900; letter-spacing: -0.03em; box-shadow: 0 24px 60px rgba(0,0,0,.35); }
.tile.c0 { background: #F0894A; color: #171B20; } .tile.c1 { background: #2E6BD6; color: #fff; } .tile.c2 { background: #2FA66A; color: #fff; } .tile.c3 { background: #fff; color: #171B20; }
.tile.dark { background: #232A33; color: #fff; box-shadow: inset 0 0 0 2px rgba(255,255,255,.14); } .tile.red { background: #D8474B; color: #fff; }
.tile .ic.lg { width: 90px; height: 90px; }
.tile .tx, .tile .tok { position: absolute; right: 30px; top: 50%; margin-top: -50px; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 20px; }
.tile .tx { background: #D8474B; color: #fff; } .tile .tok { background: #fff; color: #2FA66A; }
.tile .tx .ic, .tile .tok .ic { width: 60px; height: 60px; }
.tiles.row .tile .tx, .tiles.row .tile .tok { top: -30px; right: -20px; margin: 0; }
.stamp { padding: 30px 60px; border: 12px solid currentColor; border-radius: 30px; font-size: 128px; font-weight: 900; letter-spacing: -0.02em; transform: rotate(-6deg); background: rgba(0,0,0,.25); }
.stamp.red { color: #FF6B6E; } .stamp.green { color: #7FD8A4; } .stamp.orange { color: #F0894A; }
.bgL .stamp { background: rgba(255,255,255,.7); } .bgL .stamp.green { color: #2FA66A; } .bgL .stamp.red { color: #D8474B; }
.cnt { position: absolute; left: 0; right: 0; display: flex; align-items: baseline; justify-content: center; gap: 14px; font-weight: 900; letter-spacing: -0.04em; }
.cnt b { font-size: 250px; line-height: 1; color: #F0894A; font-variant-numeric: tabular-nums; }
.cnt .suf, .cnt .pre { font-size: 96px; color: #fff; } .bgL .cnt .suf, .bgL .cnt .pre { color: #171B20; } .bgL .cnt b { color: #C8612E; }
.cnt.mid b { font-size: 190px; } .cnt.mid .suf { font-size: 80px; }
.brw { position: absolute; left: 50px; width: 980px; border-radius: 26px; overflow: hidden; background: #0E1114; box-shadow: 0 40px 100px rgba(0,0,0,.5), 0 0 0 2px rgba(255,255,255,.12); }
.brw .bar { height: 50px; display: flex; align-items: center; gap: 10px; padding: 0 20px; background: #1E242C; }
.brw .bar i { width: 14px; height: 14px; border-radius: 50%; background: #3A434E; } .brw .bar i:first-child { background: #F26B5B; } .brw .bar i:nth-child(2) { background: #F2C14E; } .brw .bar i:nth-child(3) { background: #5BC27A; }
.brw .bar span { margin-left: 16px; font-size: 22px; font-weight: 600; color: #8A939C; }
.brw .vp { position: relative; width: 980px; height: 612px; overflow: hidden; background: #fff; }
.brw .vp img { position: absolute; left: 0; top: 0; width: 980px; transform-origin: 30% 20%; }
.btag { position: absolute; right: 18px; bottom: 18px; padding: 8px 16px; border-radius: 10px; background: rgba(0,0,0,.72); color: #fff; font-size: 22px; font-weight: 800; }
.wall { position: absolute; left: 50%; transform: translateX(-50%); display: grid; gap: 12px; }
.wall img { width: 100%; height: 100%; object-fit: cover; object-position: top left; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
.wallc { padding: 30px 56px; border-radius: 36px; background: #F0894A; color: #171B20; font-size: 96px; font-weight: 900; letter-spacing: -0.03em; box-shadow: 0 30px 80px rgba(0,0,0,.5); text-align: center; line-height: 1.1; }
.wallc small { display: block; font-size: 38px; font-weight: 800; margin-top: 8px; }
.bgRoom { background: radial-gradient(ellipse at 50% 0%, rgba(126,178,255,.22), rgba(126,178,255,0) 60%), #0F141B; }
.stage { position: absolute; left: 0; right: 0; top: 0; height: 670px; background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0)); }
.judges { position: absolute; left: 100px; right: 100px; top: 300px; display: flex; justify-content: space-between; }
.judge { position: relative; width: 230px; height: 260px; display: flex; flex-direction: column; align-items: center; }
.judge .head { width: 110px; height: 110px; border-radius: 50%; background: #3B4654; }
.judge .body { width: 210px; height: 120px; margin-top: 10px; border-radius: 100px 100px 20px 20px; background: #2C3541; }
.judge .nm { position: absolute; bottom: -8px; padding: 6px 18px; border-radius: 8px; background: #E8E2DA; color: #171B20; font-size: 24px; font-weight: 800; }
.judge .react { position: absolute; top: -30px; right: 10px; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: 900; padding: 16px; }
.judge .react.ok { background: #2FA66A; color: #fff; } .judge .react.q { background: #F2C14E; color: #171B20; } .judge .react.meh { background: #6B7280; color: #fff; }
.desk { position: absolute; left: 60px; right: 60px; top: 570px; height: 34px; border-radius: 10px; background: #5A4636; box-shadow: 0 20px 40px rgba(0,0,0,.4); }
.bub { position: relative; max-width: 920px; padding: 34px 50px; border-radius: 40px; font-size: 64px; font-weight: 900; letter-spacing: -0.03em; line-height: 1.2; text-align: center; }
.bub span { display: inline-block; }
.bub.jb { background: #fff; color: #171B20; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.bub.jb::before { content: ''; position: absolute; left: 50%; top: -30px; margin-left: -24px; border: 24px solid transparent; border-bottom: 30px solid #fff; border-top: 0; }
.bub.mb { background: #2E6BD6; color: #fff; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.bub.mb::after { content: ''; position: absolute; left: 50%; bottom: -30px; margin-left: -24px; border: 24px solid transparent; border-top: 30px solid #2E6BD6; border-bottom: 0; }
.bub .strike { position: absolute; left: 30px; right: 30px; top: 50%; height: 12px; margin-top: -6px; border-radius: 6px; background: #FF6B6E; transform-origin: 0 50%; }
.phone.held { box-shadow: 0 40px 90px rgba(0,0,0,.6), 0 0 0 3px #F0894A; }
.docs { position: absolute; left: 90px; right: 90px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 22px; }
.doc { position: relative; height: 200px; border-radius: 14px; background: #fff; box-shadow: 0 10px 24px rgba(23,27,32,.12); padding: 26px 18px; display: flex; flex-direction: column; gap: 14px; }
.doc i { display: block; height: 10px; border-radius: 5px; background: #E3DDD5; } .doc i:nth-child(2) { width: 80%; } .doc i:nth-child(4) { width: 60%; }
.doc em { position: absolute; right: 10px; bottom: 10px; padding: 3px 8px; border-radius: 6px; background: #EDE7FF; color: #6B4FD8; font-size: 18px; font-weight: 900; }
.doc.ours { background: #FFF1E7; box-shadow: 0 0 0 5px #F0894A, 0 16px 40px rgba(240,137,74,.35); z-index: 2; }
.doc.ours b { position: absolute; left: -20px; right: -20px; top: -46px; text-align: center; font-size: 24px; font-weight: 900; color: #C8612E; white-space: nowrap; }
.chart { position: absolute; left: 80px; width: 920px; height: 600px; overflow: visible; }
.chart .ax { fill: none; stroke: rgba(255,255,255,.25); stroke-width: 4; } .bgL .chart .ax { stroke: rgba(23,27,32,.2); }
.chart .pl { fill: none; stroke-width: 14; stroke-linecap: round; stroke-dasharray: 1400; }
.chart .pl.gray { stroke: #5B6571; stroke-width: 10; } .chart .pl.hot { stroke: #F0894A; }
.ctag { position: absolute; padding: 10px 22px; border-radius: 14px; background: #fff; color: #171B20; font-size: 34px; font-weight: 900; white-space: nowrap; }
.ctag.hot2 { background: #F0894A; }
.bars { position: absolute; left: 110px; right: 110px; height: 760px; display: flex; align-items: flex-end; justify-content: space-between; }
.bar2 { width: 170px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.bar2 i { display: block; width: 100%; border-radius: 18px 18px 6px 6px; background: #4B5563; }
.bar2.hot i { background: #F0894A; }
.bar2 span { font-size: 32px; font-weight: 800; color: #C9D0D8; white-space: nowrap; } .bar2.hot span { color: #F0894A; }
.cut { position: absolute; left: -30px; right: -30px; height: 0; border-top: 6px dashed #7FD8A4; }
.cut span { position: absolute; right: 0; top: -58px; font-size: 30px; font-weight: 900; color: #7FD8A4; }
.gapmark { position: absolute; width: 150px; border: 5px solid #FF6B6E; border-radius: 10px; background: rgba(255,107,110,.25); }
.gapmark b { position: absolute; left: 50%; bottom: 44px; transform: translateX(-50%); padding: 10px 22px; border-radius: 14px; background: #FF6B6E; color: #fff; font-size: 44px; font-weight: 900; white-space: nowrap; }
.rain { position: absolute; inset: 0; }
.rchip { position: absolute; top: 0; padding: 22px 36px; border-radius: 22px; font-size: 44px; font-weight: 900; white-space: nowrap; box-shadow: 0 20px 50px rgba(0,0,0,.4); }
.rchip.r0 { background: #fff; color: #171B20; } .rchip.r1 { background: #6B4FD8; color: #fff; } .rchip.r2 { background: #2E6BD6; color: #fff; } .rchip.r3 { background: #F0894A; color: #171B20; }
.lane { position: absolute; left: 0; right: 0; height: 4px; background: repeating-linear-gradient(90deg, rgba(255,255,255,.25) 0 40px, transparent 40px 80px); }
.runner { position: absolute; left: 0; width: 100px; height: 100px; color: #9AA3AD; }
.runner .ic { width: 100px; height: 100px; }
.runner .spd { position: absolute; right: 100%; top: 40%; width: 180px; height: 6px; background: linear-gradient(90deg, rgba(154,163,173,0), rgba(154,163,173,.8)); border-radius: 3px; }
.runner.ours { color: #F0894A; width: 240px; height: auto; display: flex; flex-direction: column; align-items: center; }
.runner.ours .ic { width: 130px; height: 130px; } .runner.ours b { font-size: 34px; font-weight: 900; white-space: nowrap; }
.sitem { position: absolute; display: flex; align-items: center; gap: 16px; padding: 22px 30px; border-radius: 26px; background: #fff; color: #171B20; font-size: 44px; font-weight: 900; box-shadow: 0 20px 50px rgba(0,0,0,.35); white-space: nowrap; }
.sitem.dark { background: #232A33; color: #fff; box-shadow: inset 0 0 0 2px rgba(255,255,255,.16); } .sitem.hot { background: #F0894A; }
.sitem .ic.lg { width: 70px; height: 70px; }
.core { position: absolute; width: 300px; height: 300px; border-radius: 70px; background: #F0894A; color: #171B20; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 0 0 16px rgba(240,137,74,.2), 0 30px 90px rgba(240,137,74,.5); }
.core .ic.xl { width: 150px; height: 150px; } .core b { font-size: 42px; font-weight: 900; }
.node { position: absolute; width: 360px; height: 330px; border-radius: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: #232A33; color: #fff; box-shadow: inset 0 0 0 3px rgba(255,255,255,.14), 0 30px 70px rgba(0,0,0,.35); }
.node.hot { background: #F0894A; color: #171B20; box-shadow: 0 30px 70px rgba(240,137,74,.35); } .node.blue { background: #2E6BD6; }
.node b { font-size: 50px; font-weight: 900; } .node .ic.xl { width: 130px; height: 130px; }
.bgL .node { background: #fff; color: #171B20; box-shadow: 0 20px 50px rgba(23,27,32,.12); } .bgL .node.hot { background: #F0894A; }
.wire { position: absolute; left: 0; width: 1080px; height: 200px; overflow: visible; }
.wire path { fill: none; stroke: #F0894A; stroke-width: 10; stroke-dasharray: 400; stroke-linecap: round; }
.pkt { position: absolute; left: 0; opacity: 0; width: 22px; height: 22px; margin-top: -11px; border-radius: 50%; background: #FFD8BE; box-shadow: 0 0 20px #F0894A; }
.midic { display: inline-flex; width: 120px; height: 120px; padding: 22px; border-radius: 50%; background: #fff; color: #C8612E; box-shadow: 0 16px 40px rgba(0,0,0,.35); }
.midic .ic.lg { width: 76px; height: 76px; }
.mcard { position: absolute; left: 120px; right: 120px; height: 190px; border-radius: 36px; display: flex; align-items: center; gap: 30px; padding: 0 50px; font-size: 58px; font-weight: 900; letter-spacing: -0.03em; }
.mcard.a { background: #232A33; color: #C9D0D8; box-shadow: inset 0 0 0 2px rgba(255,255,255,.14); }
.mcard.b { background: #F0894A; color: #171B20; box-shadow: 0 30px 80px rgba(240,137,74,.35); }
.mcard .ic.lg { width: 96px; height: 96px; }
.marrow { display: inline-flex; width: 90px; height: 90px; color: #F0894A; transform: rotate(0deg); }
.marrow .ic { width: 90px; height: 90px; }
.people { position: absolute; left: 60px; right: 60px; display: flex; justify-content: space-around; }
.person { position: relative; width: 290px; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.pav { width: 230px; height: 230px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #2C3541; color: #E8B89A; box-shadow: inset 0 0 0 3px rgba(255,255,255,.12); }
.pav .ic.lg { width: 120px; height: 120px; }
.bgL .pav { background: #fff; color: #C8612E; box-shadow: 0 16px 40px rgba(23,27,32,.12); }
.person b { font-size: 44px; font-weight: 900; white-space: nowrap; }
.prx { position: absolute; top: -40px; right: 10px; width: 96px; height: 96px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 56px; padding: 18px; }
.prx.heart { background: #FF6B8A; color: #fff; } .prx.ok { background: #2FA66A; color: #fff; } .prx.star { background: #F2C14E; color: #171B20; } .prx.q { background: #F2C14E; color: #171B20; font-weight: 900; }
.prx .ic { width: 100%; height: 100%; }
.pz { position: absolute; width: 440px; height: 280px; border-radius: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; font-size: 60px; font-weight: 900; }
.pz.a { left: 60px; background: #2E6BD6; color: #fff; border-radius: 40px 0 0 40px; } .pz.b { right: 60px; background: #F0894A; color: #171B20; border-radius: 0 40px 40px 0; }
.pz .ic.lg { width: 100px; height: 100px; }
.bld { position: relative; width: 560px; height: 620px; color: #E8B89A; }
.bld > .ic { width: 560px; height: 620px; }
.bin { position: absolute; width: 110px; height: 110px; padding: 20px; border-radius: 26px; background: #fff; color: #C8612E; }
.bin .ic { width: 70px; height: 70px; }
.crack { position: absolute; left: 30%; top: 5%; width: 40%; height: 90%; overflow: visible; }
.crack path { fill: none; stroke: #FF6B6E; stroke-width: 3; stroke-dasharray: 200; }
.crowd { position: absolute; left: 60px; right: 60px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 18px 10px; color: #5B6571; }
.crowd span { display: flex; justify-content: center; } .crowd .ic { width: 100px; height: 100px; } .crowd .me { color: #F0894A; }
.steps { position: absolute; left: 70px; right: 70px; display: flex; flex-direction: column; gap: 22px; }
.stp { display: flex; align-items: center; gap: 30px; padding: 30px 40px; border-radius: 34px; background: #fff; color: #9AA3AD; box-shadow: 0 10px 30px rgba(23,27,32,.08); }
.stp .num { flex: none; width: 90px; height: 90px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #EFE9E2; font-size: 48px; font-weight: 900; color: #9AA3AD; padding: 20px; }
.stp .num .ic { width: 50px; height: 50px; }
.stp div { flex: 1; } .stp b { display: block; font-size: 52px; font-weight: 900; letter-spacing: -0.03em; } .stp small { display: block; margin-top: 4px; font-size: 32px; font-weight: 700; }
.stp > .ic.lg { width: 80px; height: 80px; opacity: .5; }
.stp.done { color: #6B7680; } .stp.done .num { background: #2FA66A; color: #fff; }
.stp.on { background: #171B20; color: #fff; transform-origin: 50% 50%; box-shadow: 0 30px 70px rgba(23,27,32,.3); padding: 44px 40px; }
.stp.on .num { background: #F0894A; color: #171B20; } .stp.on b { font-size: 64px; } .stp.on small { color: #E8B89A; } .stp.on > .ic.lg { opacity: 1; color: #F0894A; }
.nstack { position: absolute; left: 80px; right: 80px; display: flex; flex-direction: column; gap: 20px; }
.ntf { display: flex; align-items: center; gap: 24px; padding: 28px 30px; border-radius: 30px; background: rgba(255,255,255,.95); color: #171B20; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
.nic { flex: none; width: 90px; height: 90px; border-radius: 24px; padding: 18px; background: #F0894A; color: #171B20; display: flex; }
.nic.blue { background: #2E6BD6; color: #fff; } .nic.green { background: #2FA66A; color: #fff; } .nic .ic { width: 54px; height: 54px; }
.ntf div { flex: 1; } .ntf b { display: block; font-size: 40px; font-weight: 900; letter-spacing: -0.02em; } .ntf small { display: block; font-size: 28px; font-weight: 700; color: #6B7680; margin-top: 4px; }
.ntf em { font-style: normal; align-self: flex-start; font-size: 24px; font-weight: 700; color: #8A939C; }
.checks { position: absolute; left: 110px; right: 110px; display: flex; flex-direction: column; gap: 26px; }
.chk { display: flex; align-items: center; gap: 30px; padding: 26px 34px; border-radius: 28px; background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 2px rgba(255,255,255,.14); }
.bgL .chk { background: #fff; box-shadow: 0 10px 30px rgba(23,27,32,.08); }
.chk .box { flex: none; width: 84px; height: 84px; border-radius: 22px; background: rgba(255,255,255,.14); color: #fff; padding: 16px; display: flex; }
.bgL .chk .box { background: #EFE9E2; }
.chk .box .ic { width: 52px; height: 52px; } .chk b { font-size: 50px; font-weight: 900; letter-spacing: -0.02em; }
.prices { position: absolute; left: 70px; right: 70px; display: flex; flex-direction: column; gap: 24px; }
.pcard { padding: 34px 44px; border-radius: 36px; background: #fff; color: #171B20; box-shadow: 0 16px 40px rgba(23,27,32,.1); }
.pcard.on { background: #171B20; color: #fff; box-shadow: 0 30px 70px rgba(23,27,32,.35), 0 0 0 5px #F0894A; }
.pcard.dim { opacity: .45; }
.ptop { display: flex; align-items: center; gap: 20px; } .pnum { width: 60px; height: 60px; border-radius: 50%; background: #F0894A; color: #171B20; display: flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 900; }
.ptop b { font-size: 46px; font-weight: 900; letter-spacing: -0.02em; } .ptop em { font-style: normal; margin-left: auto; padding: 8px 18px; border-radius: 999px; background: #FFF1E7; color: #C8612E; font-size: 26px; font-weight: 800; }
.pcard.on .ptop em { background: #F0894A; color: #171B20; }
.pval { margin-top: 10px; display: flex; align-items: baseline; gap: 12px; } .pval b { font-size: 110px; font-weight: 900; letter-spacing: -0.04em; color: #C8612E; font-variant-numeric: tabular-nums; } .pcard.on .pval b { color: #F0894A; }
.pval span { font-size: 40px; font-weight: 800; }
.chap { z-index: 31; } .chap span { position: absolute; left: 56px; top: 176px; padding: 10px 22px; border-radius: 12px; background: #F0894A; color: #171B20; font-size: 28px; font-weight: 900; }
.bgOld { background: radial-gradient(circle at 50% 30%, #5A4A38, #211A14); }
.bgOld .bigic { background: rgba(232,184,154,.14); color: #E8B89A; box-shadow: inset 0 0 0 3px rgba(232,184,154,.35); }
.dots { position: absolute; left: 140px; right: 140px; top: 820px; display: grid; grid-template-columns: repeat(25, 1fr); gap: 10px; }
.dots i { display: block; width: 22px; height: 22px; border-radius: 50%; background: #F0894A; opacity: .85; }
.ksub .red { color: #FF6B6E; font-weight: 900; }
.note { position: absolute; left: 60px; right: 60px; text-align: center; font-size: 30px; font-weight: 800; color: #fff; } .note span { display: inline-block; padding: 12px 24px; border-radius: 14px; background: rgba(8,10,13,.82); }
`
