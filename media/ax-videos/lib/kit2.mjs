// 샷 부품 2 — 제목·끝 화면·진단 버튼, 그리고 영상 1·2 에만 쓰는 그림들
import { ic, r2 } from './lib.mjs'

export function kit2(B, K) {
  const { shot, tw, from, to, pop, rise, slam, words, pulse, count, WT, phone, runFlow, addCss } = B
  const { uid, chipAt, subAt, fineAt } = K

  // 제목 카드 — 훅이 끝나고 1초 남짓
  function title(t, o) {
    const id = uid('tt')
    const html = `<div class="ttbg" id="${id}-bg"></div><div class="cx" style="top:560px"><span class="ttno" id="${id}-n">${o.no}</span></div>
      <div class="kt xl c" id="${id}-t" style="top:700px;color:#171B20;text-shadow:none">${WT(o.title)}</div>
      <div class="cx" style="top:1080px"><span class="ttbar" id="${id}-b"></span></div>`
    shot(t, html, { bg: 'bgT', trans: 'flash', cam: 'in' })
    from(`#${id}-bg`, t, 'scaleY: 0, transformOrigin: "50% 50%"', 0.3, 'power4.out')
    slam(`#${id}-n`, t + 0.15)
    words(`#${id}-t`, t + 0.25, 0.09)
    from(`#${id}-b`, t + 0.6, 'scaleX: 0', 0.5, 'power3.out')
  }

  // 빈 폰(점선) — 보여 줄 화면이 없다
  function ghost(t, o) {
    const id = uid('gh')
    const html = `<div class="cx" style="top:${o.y ?? 260}px"><div class="ghost" id="${id}"><span class="gq" id="${id}-q">${o.mark ?? '?'}</span>${o.lens ? `<span class="lens" id="${id}-l">${ic('q')}</span>` : ''}</div></div>
      ${o.label ? `<div class="kt m c" id="${id}-t" style="top:${o.labelY ?? 1120}px">${WT(o.label)}</div>` : ''}${o.extra || ''}`
    shot(t, html, o.shot)
    from(`#${id}`, t + 0.02, 'y: 300, rotation: -6, opacity: 0', 0.45)
    pop(`#${id}-q`, t + 0.35)
    if (o.lens) tw(`tl.fromTo('#${id}-l', { x: -160, y: 120 }, { x: 160, y: -120, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: true }, ${r2(t + 0.2)});`)
    if (o.label) words(`#${id}-t`, o.labelAt ?? t + 0.4)
    return id
  }

  // 점선 설계도 건물 — 계획은 계획일 뿐
  function blueprint(t, o) {
    const id = uid('bp')
    const html = `<div class="bpgrid"></div><svg class="bpsvg" id="${id}" viewBox="0 0 600 700" style="top:${o.y ?? 280}px"><path d="M100 650 V200 L300 80 L500 200 V650 Z M100 650 H500 M170 280 h70 v70 h-70 Z M360 280 h70 v70 h-70 Z M170 420 h70 v70 h-70 Z M360 420 h70 v70 h-70 Z M260 650 v-110 h80 v110"/></svg>
      ${o.chip ? chipAt(`${id}-c`, o.chip, o.chipY ?? 1030, 'hot big') : ''}${o.extra || ''}`
    shot(t, html, { bg: 'bgBlue', ...(o.shot || {}) })
    tw(`tl.fromTo('#${id} path', { strokeDashoffset: 3000 }, { strokeDashoffset: 0, duration: ${o.d ?? 1.4}, ease: 'power1.inOut', immediateRender: true }, ${r2(t + 0.05)});`)
    if (o.chip) from(`#${id}-c`, o.chipAt ?? t + 0.7, 'scale: 0.4, opacity: 0', 0.4, 'back.out(2)')
    return id
  }

  // 같은 흐름이 여러 줄에서 반복된다(데이터 → 고객 플랫폼 → 연결)
  function flowRows(t, o) {
    const id = uid('fr'), rows = o.rows
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 250, o.ebc || '') : ''}<div class="frows" style="top:${o.top ?? 360}px">${rows.map((r, i) => `<div class="frow" id="${id}-r${i}"><b>${r}</b>${['db', 'users', 'link'].map((k, j) => `<span class="fstep s${j}">${ic(k, 'lg')}</span>${j < 2 ? '<i class="farr"></i>' : ''}`).join('')}</div>`).join('')}</div>
      ${o.center ? `<div class="kt m c" id="${id}-t" style="top:${o.centerY ?? 1130}px">${WT(o.center)}</div>` : ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
    tw(`tl.from('#${id}-r0, #${id}-r1, #${id}-r2', { x: -600, opacity: 0, duration: 0.4, ease: 'power3.out', stagger: 0.1 }, ${r2(t + 0.05)});`)
    ;[0, 1, 2].forEach((j) => tw(`tl.to('[id^="${id}-r"] .s${j}', { backgroundColor: '#F0894A', color: '#171B20', scale: 1.12, duration: 0.25, ease: 'back.out(2)' }, ${r2((o.at ?? t + 0.6) + j * 0.35)});`))
    if (o.center) words(`#${id}-t`, o.centerAt ?? t + 0.9)
    return id
  }

  // 거대 플랫폼(빌딩 숲) — ✕
  function skyline(t, o) {
    const id = uid('sk'), hs = [520, 760, 640, 880, 580]
    const html = `<div class="sky" id="${id}">${hs.map((h, i) => `<span style="height:${h}px">${Array.from({ length: Math.floor(h / 90) }, () => '<i></i>').join('')}</span>`).join('')}</div>
      ${chipAt(`${id}-c`, '거대 플랫폼', 250, 'big')}<div class="cx" style="top:560px"><span class="bigx" id="${id}-x">${ic('x')}</span></div>`
    shot(t, html, o.shot)
    tw(`tl.from('#${id} span', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.5, ease: 'power3.out', stagger: 0.07 }, ${r2(t + 0.05)});`)
    from(`#${id}-c`, t + 0.3, 'y: -30, opacity: 0', 0.3)
    slam(`#${id}-x`, o.xAt)
    tw(`tl.to('#${id}', { filter: 'grayscale(1) brightness(.5)', duration: 0.4 }, ${r2(o.xAt)});`)
    return id
  }

  // AX 뜻 — 큰 글자 + AI·데이터 → 일하는 방식
  function axdef(t, o) {
    const id = uid('ad')
    const html = `<div class="cx" style="top:300px"><span class="axbig" id="${id}">AX</span></div>
      <div class="cx" style="top:700px"><span class="chip big" id="${id}-s">AI 전환 · AI Transformation</span></div>
      <div class="axrow" style="top:880px"><span class="sitem" id="${id}-a">${ic('ai', 'lg')}<b>AI</b></span><em>+</em><span class="sitem" id="${id}-d">${ic('db', 'lg')}<b>데이터</b></span><em>→</em><span class="sitem hot" id="${id}-w">${ic('gear', 'lg')}<b>일하는 방식</b></span></div>`
    shot(t, html, o.shot)
    slam(`#${id}`, o.axAt ?? t + 0.1)
    from(`#${id}-a`, o.aAt ?? t + 0.3, 'y: 80, opacity: 0', 0.35, 'back.out(1.8)')
    from(`#${id}-d`, o.dAt ?? t + 0.5, 'y: 80, opacity: 0', 0.35, 'back.out(1.8)')
    from(`#${id}-w`, o.wAt ?? t + 0.8, 'scale: 0.4, opacity: 0', 0.4, 'back.out(1.8)')
    from(`#${id}-s`, o.sAt ?? t + 1.2, 'y: 30, opacity: 0', 0.35)
    return id
  }

  // 공식 근거 상자 — 미래AI랩 실적과 섞지 않는다
  function policy(t, o) {
    const id = uid('po')
    const html = `<div class="cnt" style="top:330px" id="${id}-c"><b id="${id}-n">0</b><span class="suf">억 원</span></div>
      <div class="cx" style="top:610px"><span class="chip big" id="${id}-l">AX 지원 규모</span></div>
      <div class="official" id="${id}-o" style="top:760px"><span class="otag">공식 근거</span>
        <div class="orow" id="${id}-r1"><b>AX-Sprint</b><p>7,540억 원 규모 지원 발표</p><small>대한민국 정책브리핑 2026.3</small></div>
        <div class="orow" id="${id}-r2"><b>중진공 정책자금</b><p>AX 스프린트 우대트랙</p><small>중소벤처기업진흥공단</small></div></div>`
    shot(t, html, o.shot)
    from(`#${id}-c`, t + 0.05, 'scale: 0.6, opacity: 0', 0.35, 'back.out(1.6)')
    count(`#${id}-n`, o.at ?? t + 0.2, 0, 7540, 1.1)
    from(`#${id}-l`, t + 0.5, 'y: 30, opacity: 0', 0.3)
    from(`#${id}-o`, t + 0.8, 'y: 200, opacity: 0', 0.45)
    tw(`tl.from('#${id}-r1, #${id}-r2', { x: 300, opacity: 0, duration: 0.35, stagger: 0.18 }, ${r2(t + 1.05)});`)
    return id
  }

  // 설계 격자 위에 화면 설계도가 그려진다
  function wire(t, o) {
    const id = uid('wr')
    const html = `<div class="bpgrid"></div><svg class="wfsvg" id="${id}" viewBox="0 0 900 900" style="top:260px">
      <rect x="40" y="60" width="380" height="780" rx="50"/><rect x="80" y="140" width="300" height="140" rx="16"/><rect x="80" y="310" width="140" height="110" rx="14"/><rect x="240" y="310" width="140" height="110" rx="14"/><rect x="80" y="450" width="300" height="220" rx="16"/>
      <rect x="480" y="160" width="380" height="560" rx="30"/><path d="M520 640 L600 540 L680 580 L780 400 L830 420"/><rect x="520" y="200" width="300" height="60" rx="10"/><path d="M420 400 C 450 400, 450 440, 480 440"/></svg>
      ${chipAt(`${id}-c`, o.chip, 1100, 'hot big')}`
    shot(t, html, { bg: 'bgBlue', ...(o.shot || {}) })
    tw(`tl.fromTo('#${id} rect, #${id} path', { strokeDashoffset: 2400 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut', stagger: 0.12, immediateRender: true }, ${r2(t + 0.05)});`)
    from(`#${id}-c`, o.chipAt ?? t + 0.9, 'scale: 0.4, opacity: 0', 0.4, 'back.out(2)')
    return id
  }

  // 폰 두 대(밖: 고객 / 안: 대표님)와 둘을 잇는 선
  function twoPhones(t, o) {
    const id = uid('tp'), sw = 330
    const html = `<div class="abs" style="left:50px;top:${o.top ?? 330}px">${phone(`${id}-a`, o.a.name, o.a.base, o.a.steps || [], sw)}</div>
      <div class="abs" style="left:${1080 - 50 - sw - 20}px;top:${o.top ?? 330}px">${phone(`${id}-b`, o.b.name, o.b.base, o.b.steps || [], sw)}</div>
      <div class="cx" style="top:${(o.top ?? 330) - 90}px"><div class="tplab"><span class="chip">${o.a.label}</span><span class="chip hot">${o.b.label}</span></div></div>
      <svg class="tpw" viewBox="0 0 200 60" style="top:${(o.top ?? 330) + 330}px"><path id="${id}-w" d="M10 30 C 60 0, 140 60, 190 30"/></svg>
      ${o.mid ? `<div class="cx" style="top:${(o.top ?? 330) + 300}px"><span class="midic" id="${id}-m">${ic(o.mid, 'lg')}</span></div>` : ''}`
    shot(t, html, o.shot)
    from(`#${id}-a`, t + 0.02, 'x: -500, rotation: -6', 0.45, 'power3.out')
    from(`#${id}-b`, t + 0.1, 'x: 500, rotation: 6', 0.45, 'power3.out')
    tw(`tl.fromTo('#${id}-w', { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.5, immediateRender: true }, ${r2(o.linkAt ?? t + 0.5)});`)
    if (o.mid) pop(`#${id}-m`, (o.linkAt ?? t + 0.5) + 0.3)
    if (o.a.run) runFlow(`${id}-a`, o.a.name, o.a.steps, o.a.run[0], o.a.run[1])
    if (o.b.run) runFlow(`${id}-b`, o.b.name, o.b.steps, o.b.run[0], o.b.run[1])
    return id
  }

  // 진단 시스템 입력(예시 화면)
  function sysForm(t, o) {
    const id = uid('sf')
    const rows = o.rows
    const html = `<div class="sys" id="${id}" style="top:${o.top ?? 300}px"><div class="shead">${ic('ai')}<b>${o.title || 'AX 진단 시스템'}</b><em>예시 화면</em></div>${rows.map((r, i) => `<div class="srow"><span>${r[0]}</span><b id="${id}-v${i}">${r[1]}</b></div>`).join('')}<div class="sbtn" id="${id}-btn">${o.btn || '분석하기 →'}</div><span class="touch" id="${id}-tap" style="left:50%;top:auto;bottom:60px"></span></div>`
    shot(t, html, { bg: 'bgL', ...(o.shot || {}) })
    from(`#${id}`, t + 0.02, 'y: 300, opacity: 0', 0.45)
    rows.forEach((r, i) => tw(`tl.fromTo('#${id}-v${i}', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'steps(8)', immediateRender: true }, ${r2(t + 0.45 + i * 0.4)});`))
    const tap = o.tapAt ?? t + 0.5 + rows.length * 0.4
    tw(`tl.fromTo('#${id}-tap', { scale: 0.4, opacity: 0.95 }, { scale: 1.6, opacity: 0, duration: 0.4, immediateRender: false }, ${r2(tap)});`)
    tw(`tl.to('#${id}-btn', { backgroundColor: '#C8612E', scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 }, ${r2(tap)});`)
    return id
  }

  // 한 화면 결과(지원금·인증·절세) — 예시 화면
  function dash(t, o) {
    const id = uid('ds')
    const html = `<div class="sys" id="${id}" style="top:${o.top ?? 280}px"><div class="shead">${ic('ai')}<b>진단 결과</b><em>예시 화면</em></div>${o.cards.map((c, i) => `<div class="dcard c${i}" id="${id}-${i}">${ic(c[0], 'lg')}<div><small>${c[1]}</small><b>${c[2]}</b></div></div>`).join('')}</div>`
    shot(t, html, { bg: 'bgL', ...(o.shot || {}) })
    from(`#${id}`, t + 0.02, 'y: 300, opacity: 0', 0.4)
    o.cards.forEach((c, i) => from(`#${id}-${i}`, c[3] ?? t + 0.35 + i * 0.3, 'x: 500, opacity: 0', 0.4, 'back.out(1.4)'))
    return id
  }

  // 사람이 문 밖으로 — 담당자 퇴사
  function leave(t, o) {
    const id = uid('lv')
    const html = `<div class="door" id="${id}-d">${ic('door')}</div><div class="walker" id="${id}-p">${ic('user')}<b>${o.who}</b></div>
      <div class="kt m c" id="${id}-t" style="top:1080px">${WT(o.label)}</div>`
    shot(t, html, o.shot)
    pop(`#${id}-d`, t + 0.05)
    from(`#${id}-p`, t + 0.1, 'scale: 0.3, opacity: 0', 0.35, 'back.out(2)')
    to(`#${id}-p`, o.goAt ?? t + 0.8, 'x: 440, opacity: 0, scale: 0.8', 1.0, 'power2.in')
    words(`#${id}-t`, o.labelAt ?? t + 0.4)
    return id
  }

  // 데이터 막대가 쌓인다
  function dataBars(t, o) {
    const id = uid('db')
    const hs = [120, 190, 250, 330, 400, 480, 560]
    const html = `${o.eb ? chipAt(`${id}-eb`, o.eb, 250, o.ebc || 'hot big') : ''}<div class="dbars" id="${id}">${hs.map((h) => `<i style="height:${h}px"></i>`).join('')}</div>
      <div class="cx" style="top:420px"><span class="bigic" id="${id}-ic" style="width:170px;height:170px;padding:34px;border-radius:44px">${ic('db')}</span></div>
      ${o.label ? `<div class="kt m c" id="${id}-t" style="top:1130px">${WT(o.label)}</div>` : ''}`
    shot(t, html, o.shot)
    if (o.eb) from(`#${id}-eb`, t + 0.05, 'scale: 0.5, opacity: 0', 0.35, 'back.out(2)')
    pop(`#${id}-ic`, t + 0.1)
    tw(`tl.from('#${id} i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.35, ease: 'back.out(1.5)', stagger: 0.18 }, ${r2(t + 0.3)});`)
    if (o.label) words(`#${id}-t`, o.labelAt ?? t + 0.5)
    return id
  }

  // 3분 진단 버튼
  function cta(t, o) {
    const id = uid('ct')
    const html = `<div class="cx" style="top:330px"><div class="timer" id="${id}-tm"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="trk"/><circle cx="50" cy="50" r="44" class="arc" id="${id}-arc"/></svg><b>3<small>분</small></b></div></div>
      <div class="cx" style="top:800px"><div class="ctab" id="${id}-b">${ic('target', 'lg')}<span>3분 기업성장·AX Fit 진단</span></div></div>
      <span class="touch" id="${id}-tap" style="left:540px;top:880px"></span>
      <div class="cx" style="top:1010px"><span class="chip" id="${id}-u">miraeailab.com</span></div>`
    shot(t, html, { bg: 'bgC', ...(o.shot || {}) })
    from(`#${id}-tm`, t + 0.02, 'scale: 0.4, opacity: 0', 0.4, 'back.out(1.8)')
    tw(`tl.fromTo('#${id}-arc', { strokeDashoffset: 277 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut', immediateRender: true }, ${r2(t + 0.2)});`)
    from(`#${id}-b`, t + 0.35, 'y: 120, opacity: 0', 0.4, 'back.out(1.6)')
    from(`#${id}-u`, t + 0.6, 'opacity: 0', 0.3)
    if (o.tapAt) { tw(`tl.fromTo('#${id}-tap', { scale: 0.4, opacity: 0.95 }, { scale: 1.8, opacity: 0, duration: 0.45, immediateRender: false }, ${r2(o.tapAt)});`); tw(`tl.to('#${id}-b', { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1 }, ${r2(o.tapAt)});`); pulse(`#${id}-b`, o.tapAt + 0.4, 2) }
    return id
  }

  // 끝 화면(다음 영상 / 진단 안내)
  function endCard(t, o) {
    const id = uid('ec')
    const html = `<div class="ttbg soft"></div>${chipAt(`${id}-e`, o.eb, 330, 'hot big')}
      <div class="ecard" id="${id}-c" style="top:480px">${o.card}</div>
      <div class="cx" style="top:${o.arrowY ?? 1060}px"><span class="earrow" id="${id}-a">${ic('arrowDown')}</span></div>`
    shot(t, html, { bg: 'bgC', trans: 'zoom', ...(o.shot || {}) })
    from(`#${id}-e`, t + 0.1, 'y: -40, opacity: 0', 0.35)
    from(`#${id}-c`, t + 0.25, 'y: 200, opacity: 0', 0.5, 'back.out(1.4)')
    from(`#${id}-a`, t + 0.6, 'opacity: 0', 0.3)
    tw(`tl.to('#${id}-a', { y: 24, duration: 0.45, yoyo: true, repeat: 7, ease: 'sine.inOut' }, ${r2(t + 0.9)});`)
    return id
  }

  addCss(KIT2_CSS)
  return { title, ghost, blueprint, flowRows, skyline, axdef, policy, wire, twoPhones, sysForm, dash, leave, dataBars, cta, endCard }
}

const KIT2_CSS = `
.bgT { background: #F0894A; }
.ttbg { position: absolute; left: 0; right: 0; top: 480px; height: 700px; background: #FFF4EC; transform: skewY(-4deg); }
.ttbg.soft { top: 420px; height: 760px; background: rgba(255,255,255,.06); }
.ttno { padding: 12px 34px; border-radius: 999px; background: #171B20; color: #F0894A; font-size: 48px; font-weight: 900; letter-spacing: .02em; }
.ttbar { display: block; width: 240px; height: 14px; border-radius: 7px; background: #171B20; }
.ghost { position: relative; width: 420px; height: 800px; border-radius: 60px; border: 8px dashed rgba(255,255,255,.45); display: flex; align-items: center; justify-content: center; }
.bgL .ghost { border-color: rgba(23,27,32,.35); }
.gq { font-size: 260px; font-weight: 900; color: #F0894A; }
.lens { position: absolute; width: 190px; height: 190px; padding: 30px; border-radius: 50%; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 8px #fff; color: #fff; }
.lens .ic { width: 100%; height: 100%; }
.bgBlue { background: #0E2A4A; }
.bpgrid { position: absolute; inset: 0; background-image: linear-gradient(rgba(126,178,255,.14) 2px, transparent 2px), linear-gradient(90deg, rgba(126,178,255,.14) 2px, transparent 2px); background-size: 60px 60px; }
.bpsvg { position: absolute; left: 240px; width: 600px; height: 700px; overflow: visible; }
.bpsvg path { fill: none; stroke: #BFD8FF; stroke-width: 6; stroke-dasharray: 3000; }
.wfsvg { position: absolute; left: 90px; width: 900px; height: 900px; overflow: visible; }
.wfsvg rect, .wfsvg path { fill: none; stroke: #BFD8FF; stroke-width: 5; stroke-dasharray: 2400; }
.frows { position: absolute; left: 70px; right: 70px; display: flex; flex-direction: column; gap: 30px; }
.frow { display: flex; align-items: center; gap: 18px; padding: 26px 30px; border-radius: 30px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); }
.frow b { width: 230px; font-size: 42px; font-weight: 900; color: #E8B89A; white-space: nowrap; }
.fstep { width: 130px; height: 130px; border-radius: 34px; display: flex; align-items: center; justify-content: center; background: #2C3541; color: #9AA3AD; }
.fstep .ic.lg { width: 76px; height: 76px; }
.farr { flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,.25); }
.sky { position: absolute; left: 80px; right: 80px; bottom: 560px; height: 900px; display: flex; align-items: flex-end; justify-content: space-between; }
.sky span { width: 160px; display: grid; grid-template-columns: repeat(3, 1fr); align-content: start; gap: 18px; padding: 30px 22px; border-radius: 16px 16px 0 0; background: linear-gradient(180deg, #3B4654, #232A33); }
.sky i { height: 36px; border-radius: 6px; background: rgba(255,214,150,.5); }
.bigx { display: inline-flex; width: 380px; height: 380px; padding: 60px; border-radius: 50%; background: #D8474B; color: #fff; box-shadow: 0 30px 90px rgba(216,71,75,.5); }
.bigx .ic { width: 100%; height: 100%; }
.axbig { font-size: 360px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: #F0894A; text-shadow: 0 30px 90px rgba(240,137,74,.45); }
.axrow { position: absolute; left: 40px; right: 40px; display: flex; align-items: center; justify-content: center; gap: 14px; }
.axrow .sitem { position: static; flex-direction: column; padding: 22px 22px; font-size: 38px; }
.axrow em { font-style: normal; font-size: 60px; font-weight: 900; color: #F0894A; }
.official { position: absolute; left: 70px; right: 70px; padding: 40px 40px 30px; border-radius: 30px; background: #F4F7FB; color: #171B20; box-shadow: 0 30px 80px rgba(0,0,0,.4); }
.otag { position: absolute; left: 36px; top: -26px; padding: 10px 22px; border-radius: 12px; background: #2E6BD6; color: #fff; font-size: 30px; font-weight: 900; }
.orow { padding: 16px 0; border-bottom: 2px solid #E1E7EF; } .orow:last-child { border: 0; }
.orow b { font-size: 40px; font-weight: 900; color: #1F4FA8; } .orow p { font-size: 40px; font-weight: 800; margin-top: 4px; } .orow small { display: block; font-size: 26px; font-weight: 700; color: #6B7680; margin-top: 4px; }
.tplab { display: flex; gap: 240px; }
.tpw { position: absolute; left: 440px; width: 200px; height: 60px; overflow: visible; }
.tpw path { fill: none; stroke: #F0894A; stroke-width: 8; stroke-dasharray: 300; stroke-linecap: round; }
.sys { position: absolute; left: 80px; right: 80px; padding: 34px; border-radius: 40px; background: #fff; color: #171B20; box-shadow: 0 30px 80px rgba(23,27,32,.18); }
.shead { display: flex; align-items: center; gap: 16px; padding-bottom: 20px; margin-bottom: 14px; border-bottom: 2px solid #EFE9E2; }
.shead .ic { width: 60px; height: 60px; color: #C8612E; } .shead b { font-size: 44px; font-weight: 900; } .shead em { margin-left: auto; font-style: normal; padding: 6px 16px; border-radius: 10px; background: #EFE9E2; color: #6B7680; font-size: 24px; font-weight: 800; }
.srow { display: flex; justify-content: space-between; align-items: center; padding: 24px 10px; border-bottom: 2px solid #F4EFE9; font-size: 40px; }
.srow span { color: #6B7680; font-weight: 700; } .srow b { font-weight: 900; }
.sbtn { margin-top: 26px; padding: 30px; border-radius: 24px; background: #F0894A; color: #171B20; text-align: center; font-size: 44px; font-weight: 900; }
.sys .touch { margin-left: -30px; }
.dcard { display: flex; align-items: center; gap: 26px; margin-top: 20px; padding: 30px; border-radius: 28px; background: #FFF4EC; }
.dcard.c1 { background: #EEF4FF; } .dcard.c2 { background: #EAF7F0; }
.dcard .ic.lg { width: 90px; height: 90px; color: #C8612E; } .dcard.c1 .ic.lg { color: #2E6BD6; } .dcard.c2 .ic.lg { color: #2FA66A; }
.dcard small { display: block; font-size: 30px; font-weight: 800; color: #6B7680; } .dcard b { display: block; font-size: 50px; font-weight: 900; letter-spacing: -0.02em; }
.door { position: absolute; left: 700px; top: 380px; width: 300px; height: 460px; padding: 40px; border-radius: 30px; background: #232A33; color: #9AA3AD; }
.door .ic { width: 100%; height: 100%; }
.walker { position: absolute; left: 200px; top: 420px; width: 300px; display: flex; flex-direction: column; align-items: center; gap: 10px; color: #E8B89A; }
.walker .ic { width: 280px; height: 280px; } .walker b { font-size: 40px; font-weight: 900; white-space: nowrap; }
.dbars { position: absolute; left: 150px; right: 150px; top: 460px; height: 600px; display: flex; align-items: flex-end; gap: 22px; }
.dbars i { flex: 1; border-radius: 14px 14px 4px 4px; background: linear-gradient(180deg, #F0894A, rgba(240,137,74,.35)); }
.timer { position: relative; width: 400px; height: 400px; }
.timer svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.timer .trk { fill: none; stroke: rgba(255,255,255,.12); stroke-width: 8; } .timer .arc { fill: none; stroke: #F0894A; stroke-width: 8; stroke-linecap: round; stroke-dasharray: 277; }
.timer b { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 190px; font-weight: 900; color: #fff; } .timer b small { font-size: 70px; margin-left: 6px; }
.ctab { display: flex; align-items: center; gap: 22px; padding: 40px 50px; border-radius: 34px; background: #F0894A; color: #171B20; font-size: 54px; font-weight: 900; letter-spacing: -0.03em; box-shadow: 0 30px 80px rgba(240,137,74,.45); white-space: nowrap; }
.ctab .ic.lg { width: 76px; height: 76px; }
.ecard { position: absolute; left: 80px; right: 80px; padding: 50px 50px 46px; border-radius: 44px; background: #fff; color: #171B20; box-shadow: 0 40px 100px rgba(0,0,0,.45); }
.ecard .no { display: inline-block; padding: 8px 22px; border-radius: 999px; background: #171B20; color: #F0894A; font-size: 34px; font-weight: 900; }
.ecard h3 { margin-top: 20px; font-size: 84px; font-weight: 900; letter-spacing: -0.04em; line-height: 1.15; }
.ecard ul { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 14px; list-style: none; }
.ecard li { padding: 12px 24px; border-radius: 999px; background: #FFF1E7; color: #C8612E; font-size: 34px; font-weight: 800; }
.earrow { display: inline-flex; width: 110px; height: 110px; padding: 20px; border-radius: 50%; background: #F0894A; color: #171B20; }
.earrow .ic { width: 100%; height: 100%; }
`
