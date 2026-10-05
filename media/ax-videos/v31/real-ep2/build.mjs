// 실제 프로젝트 2편 — 웰니스 케어 매장(쑥뜸원) · 영상 스타일 v3.1(BIG INFOGRAPHIC · PRODUCT MOTION)
// 장면표: ../SCENES.md — 시퀀스 단위(소개 · 기록 · 제품 증거 · 앞으로 · 다음 사업 · 같은 원리 · 마무리)
// v3.1: 실제 화면은 기기 비율 9:19.7 그대로, 실제로 스크롤·탭·화면 전환하고 말하는 곳을 강조, 모바일 옆에 같은 시스템의 PC 화면
// 음성·자막 정렬은 v2와 같은 규칙(1.13배 · 쉼 줄임 · -14 LUFS · 대본 글자 그대로)이라 v2 최종 음성을 그대로 쓴다.
// ⚠️ 실제 화면은 업체·고객 이름을 ○○ 로 바꾼 캡처만(LEAK 0건), 장면당 10초 안팎. 숫자는 만들지 않는다.
import { createReel2, ic } from '../../lib/reels2.mjs'

const R = createReel2('.', { title: '실제 프로젝트 2편 · 쑥뜸원' })
const { phone31, browser31, c, ce, w, scene, el, head, note, check, chip, node, hub, card, deco, lines, phone, loop, touch, mock, endCard } = R
const REAL = '실제 화면 · 고객 이름은 가렸습니다'
const rnote = (at, x = 72, text = REAL) => el(at, text, { cls: 'note', a: 'fade', style: `left:${x}px` })
const A = 'assets/real31/'
const rhead = (o) => head(o).replace('left:72px;right:120px', 'left:590px;right:120px')
const C = { teal: 'var(--teal)', blue: 'var(--blue)', amber: 'var(--amber)', green: 'var(--green)', rose: 'var(--rose)', violet: 'var(--violet)', copper: 'var(--copper)' }
const badge = (icon, c, size) => `<span class="ibadge" style="--c:${C[c]}${size ? `;width:${size}px;height:${size}px` : ''}">${ic(icon)}</span>`
const panel = (icon, c, b, small, at, o = {}) =>
  card(`<div class="panel">${badge(icon, c)}<div><b>${b}</b>${small ? `<small>${small}</small>` : ''}</div></div>`, at, { x: o.x ?? 72, y: o.y, w: o.w ?? 888, c, hiedge: o.hiedge, dim: o.dim, hl: o.hl })
const bigNode = (icon, t, at, o) => node(`${ic(icon)}${t}${o.sub ? `<small>${o.sub}</small>` : ''}`, at, o).replace('class="node abs', `class="node lg${o.row ? ' hz' : ''} abs`)
const xl = (html) => html.replace(/chip dot abs( big)?/, 'chip dot abs xl')
const plan = (t, at, o) => el(at, `${ic('cal')}${t}`, { cls: 'plan abs', a: 'up', style: `left:${o.x ?? 72}px;top:${o.y}px` })
const strikeLine = (t, at, sAt, o) => el(at, `<span class="st">${t}<span class="sl" data-strike="${sAt}"></span></span>`, { cls: `abs ${o.cls ?? 'h3'} strike-wrap dimtxt`, out: o.out, style: `left:${o.x ?? 72}px;top:${o.y}px` })

const B = {
  s2: c('2.1.0') - 0.2, s3: c('2.3.0') - 0.15, s4: c('3.1.0') - 0.2, s5: c('3.3.0') - 0.15, s6: c('4.1.0') - 0.15, s7: c('5.1.0') - 0.2,
  s8: c('5.3.0') - 0.15, s9: c('6.1.0') - 0.2, s10: c('6.3.0') - 0.15, s11: c('6.4.0') - 0.15, s12: c('7.1.0') - 0.2, s13: c('8.1.0') - 0.2,
  s14: c('8.3.0') - 0.25, s15: c('9.1.0') - 0.2, s16: c('9.3.0') - 0.2,
}

// 1 D · A — 쑥뜸원 → 이용권 카드에 방문 도장
{
  const tk = c('1.2.2'), reg = w('정기적으로', '1.2.4')
  scene(0, `
  ${deco('ring', 800, 140, 280, 'green', 0.2)}${deco('disc', -100, 1180, 260, 'amber', 0.4)}
  ${head({ eb: 'PROJECT 02 · 소상공인 사례', t: '두 번째는<br>*쑥뜸원*', size: 'h1 xxl', at: 0.15, y: 300 })}
  ${chip('쑥뜸 · 온열 관리', c('1.2.0'), { y: 640, c: 'amber', big: true })}
  ${card(`<div class="panel">${badge('ticket', 'copper')}<div><b>*이용권* 매장</b><small>마사지숍 · 피부관리실처럼</small></div></div>`, tk, { x: 72, y: 780, w: 888, hl: w('이용권', '1.2.3') })}
  ${[0, 1, 2, 3, 4].map((i) => el(tk + 0.3, '', { cls: 'stamp', a: 'fade', style: `left:${120 + i * 160}px;top:1000px` })).join('')}
  ${[0, 1, 2].map((i) => el(reg + i * 0.4, ic('check'), { cls: 'stamp on', a: 'scale', style: `left:${120 + i * 160}px;top:1000px;--c:${C[['teal', 'blue', 'copper'][i]]}` })).join('')}`)
}

// 2 L · E — '기록만' 취소선 → 다섯 가지가 '하나로' 허브로
{
  const t = B.s2, one = w('하나로', '2.2.1'), hx = 540, hy = 870
  const nd = [['cal', '방문 기록', w('방문', '2.2.0'), 'teal', -90], ['ticket', '이용권', w('이용권', '2.2.0'), 'amber', -18], ['chat', '상담 내용', w('상담', '2.2.0'), 'violet', 54],
    ['hand', '관리 부위', w('관리', '2.2.1'), 'blue', 126], ['heart', '반응', w('반응', '2.2.1'), 'rose', 198]]
  const P = nd.map(([, , , , g]) => [hx + 300 * Math.cos(g * Math.PI / 180), hy + 280 * Math.sin(g * Math.PI / 180)])
  scene(t, `
  ${strikeLine('고객 정보 입력 · 기록', c('2.1.0'), c('2.1.1') + 0.3, { y: 250 })}
  ${el(c('2.2.0') - 0.1, '*하나로* 연결', { cls: 'abs h1', style: 'left:72px;top:330px' })}
  ${lines(P.map(([x, y]) => [x, y, hx, hy, one - 0.3, one + 0.6]), t, { width: 5 })}
  ${nd.map(([i, tx, a, col], k) => node(`${ic(i)}${tx}`, a, { x: Math.round(P[k][0] - 120), y: Math.round(P[k][1] - 70), w: 240, c: col })).join('')}
  ${hub('하나로', one, { x: hx - 95, y: hy - 95 })}`, { light: true })
}

// 3 L · C — 실제 화면(휴대폰): 누르면 기록 창 → 창 안 아래(관리 부위 · AI 추천일)로
{
  const t = B.s3, tap = w('누르면', '2.3.1') - 0.3, sw2 = c('2.3.2'), last = c('2.3.3'), now = w('바로', '2.3.4')
  const cover = Math.round((Math.round(480 * 19.7 / 9) - 28) * 780 / 1688)
  scene(t, `
  ${phone31({ x: 72, y: 228, w: 480, at: t + 0.1, layers: [
    { src: 'assets/real/well-record-m.jpg', coverW: cover, touch: [[105, 305, tap], [283, 305, tap + 1.1]] },
    { src: 'assets/real/well-record2-m.jpg', coverW: cover, at: sw2, focus: [{ t0: last, t1: now - 0.1, x: 8, y: 186, w: 374, h: 220 }, { t0: now, t1: now + 3, x: 8, y: 590, w: 374, h: 104 }] }] })}
  ${rhead({ eb: 'TAP TO RECORD', t: '*몇 번만*<br>누르면 기록', at: t + 0.05, y: 300 })}
  ${check('지난번 관리', last, { x: 590, y: 600, c: 'teal', dim: now })}
  ${check('좋아하신 것', w('좋아하셨는지', '2.3.4'), { x: 590, y: 720, c: 'rose', dim: now })}
  ${el(now, '다음 방문 때<br>*바로*', { cls: 'abs h3', style: 'left:590px;top:860px' })}
  ${rnote(t + 0.6, 590, '실제 화면 · 이름은 가렸습니다')}`, { light: true })
}

// 4 D · B — 깔때기: 세 가지 기준 → 오늘 챙길 고객 우선순위
{
  const t = B.s4, out = c('3.2.2'), rk = w('우선순위', '3.2.3')
  const inp = [['방문 주기', c('3.2.0') + 0.1, 'teal', 72], ['이용권 상태', w('이용권', '3.2.0'), 'amber', 326], ['상담 후 행동', c('3.2.1'), 'violet', 616]]
  scene(t, `
  ${deco('ring', 860, 150, 240, 'violet', t + 0.2)}
  ${head({ t: '그럼<br>*기록 다음*엔?', size: 'h1', at: t + 0.1, y: 250 })}
  ${inp.map(([tx, a, col, x]) => chip(tx, a, { x, y: 540, c: col, big: true })).join('')}
  ${lines([[190, 630, 516, 780, out - 0.4, out], [470, 630, 516, 780, out - 0.4, out], [760, 630, 516, 780, out - 0.4, out]], t, { width: 5 })}
  ${card(`<div class="panel">${badge('target', 'copper')}<div><small>오늘 다시 챙길 고객</small><b>*우선순위*부터</b></div></div>`, out, { x: 72, y: 790, w: 888, hiedge: true, hl: rk })}
  ${['teal', 'blue', 'copper'].map((col, i) => el(rk + 0.2 + i * 0.3, `<b style="font-size:44px;font-weight:900;color:#fff">${i + 1}</b>`, { cls: 'ibadge abs', a: 'scale', style: `left:${120 + i * 150}px;top:1030px;width:104px;height:104px;--c:${C[col]}` })).join('')}
  ${el(rk + 1.1, `${ic('user')} 먼저 연락할 순서`, { cls: 'abs klabel', a: 'fade', style: 'left:590px;top:1062px;display:flex;gap:12px;align-items:center' })}`)
}

// 5 L · C — PC 뒤 + 모바일 앞: 재방문 관리(같은 화면, 실제 스크롤) → 챙길 고객 3종류 · '장부 뒤지기' 취소선
{
  const t = B.s5, k1 = c('3.3.0'), k2 = c('3.3.1'), k3 = c('3.3.2')
  scene(t, `
  ${head({ eb: 'RETENTION', t: '챙길 고객이 *먼저*', at: t + 0.05, y: 240 })}
  ${browser31({ x: 72, y: 400, w: 780, at: t + 0.2, url: 'WELLNESS AX · 재방문', layers: [{ src: A + 'well-retention-pc.jpg',
    focus: [{ t0: t + 0.9, t1: k2, x: 250, y: 200, w: 1160, h: 150 }, { t0: k2 + 0.2, t1: k3 + 2.5, x: 250, y: 385, w: 1160, h: 290 }] }] })}
  ${phone31({ x: 600, y: 452, w: 360, at: t + 0.6, layers: [{ src: A + 'well-retention-m-long.jpg',
    scroll: [[k2 - 0.2, k2 + 1.2, 0, 300]],
    focus: [{ t0: t + 0.9, t1: k2, x: 12, y: 274, w: 366, h: 180 }, { t0: k2 + 1.0, t1: k3 + 2.5, x: 8, y: 476, w: 374, h: 340 }] }] })}
  ${chip('이용권 거의 끝', k1, { x: 72, y: 960, c: 'amber', dim: k2 })}
  ${chip('다시 올 때', k2, { x: 72, y: 1040, c: 'teal', dim: k3 })}
  ${chip('상담 후 미방문', k3, { x: 72, y: 1120, c: 'violet' })}
  ${strikeLine('장부 뒤지기', c('3.3.3'), w('일일이', '3.3.4'), { x: 330, y: 1100 })}
  ${rnote(t + 0.8)}`, { light: true })
}

// 6 L · C — 실제 화면(휴대폰 · 실제 스크롤): 고객 전용 플랫폼 → 내 기록 · 예약 → 앞으로 준비하는 상품·서비스
{
  const t = B.s6, u = w('이용', '4.1.1'), rq = c('4.1.2'), nw = c('4.1.3')
  const it = [['이용 내역', u, 'teal'], ['남은 이용권', w('남은', '4.1.1'), 'amber'], ['방문 요청', rq, 'blue'], ['새 상품', nw, 'copper']]
  scene(t, `
  ${phone31({ x: 72, y: 228, w: 480, at: t + 0.1, layers: [
    { src: A + 'well-welcome-m-long.jpg', scroll: [[u - 0.6, u + 0.9, 0, 420]],
      focus: [{ t0: u + 0.9, t1: rq - 0.05, x: 10, y: 1028, w: 370, h: 118 }, { t0: rq, t1: nw + 0.3, x: 10, y: 698, w: 370, h: 110 }] },
    { src: A + 'well-welcome-m-long.jpg', at: nw - 0.1, scroll: [[nw - 0.1, nw + 2.5, 6380, 6440]], focus: [{ t0: nw + 0.6, t1: nw + 4, x: 22, y: 6622, w: 346, h: 356 }] }] })}
  ${rhead({ eb: 'CUSTOMER PLATFORM', t: '고객에게는<br>*전용 플랫폼*', at: t + 0.05, y: 300 })}
  ${it.map(([tx, a, col], i) => check(tx, a, { x: 590, y: 580 + i * 120, c: col, dim: it[i + 1]?.[1] })).join('')}
  ${rnote(t + 0.6, 590, '실제 화면 · 이름은 가렸습니다')}`, { light: true })
}

// 7 D · B — 계단: 기록 ✓ → 오늘 챙길 고객 ✓ → AI 분석(계획)
{
  const t = B.s7, up = w('한', '5.1.1'), res = c('5.2.3')
  const step = (x, y, h, col, t1, sub, at, extra = {}) => card(`<div style="padding:28px 26px 0 34px"><b style="display:block;font-size:42px;font-weight:800;line-height:1.2">${t1}</b><small style="display:block;margin-top:8px;font-size:28px;font-weight:600;color:var(--ink2)">${sub}</small></div>`, at, { x, y, w: 280, h, c: col, ...extra })
  scene(t, `
  ${head({ eb: 'NEXT · PLAN', t: '데이터가 쌓이면<br>*한 단계 더*', size: 'h1', at: t + 0.05, y: 250 })}
  ${chip('이탈 가능성?', w('이탈', '5.2.0'), { x: 72, y: 540, c: 'rose', big: true })}
  ${chip('재방문 잘 되는 프로그램?', w('재방문', '5.2.1'), { x: 72, y: 650, c: 'green', big: true })}
  ${step(72, 1000, 200, 'teal', '기록', '지금 ✓', t + 0.4, { dim: up })}
  ${step(372, 880, 320, 'blue', '오늘 챙길<br>고객', '지금 ✓', t + 0.8, { dim: up })}
  ${step(672, 760, 440, 'copper', 'AI 분석', '고객 · *매출 기회*', up, { hiedge: true, hl: res })}
  ${plan('고도화 계획', c('5.2.5'), { x: 672, y: 680 })}`)
}

// 8 D · E — ↓ 놓치던 고객 / ↑ 재방문·재등록·추가 구매 → 성과
{
  const t = B.s8
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'green', t + 0.3)}
  ${el(t + 0.05, 'RESULT', { cls: 'abs eyebrow', style: 'left:72px;top:300px' })}
  ${panel('arrowDown', 'rose', '놓치던 고객은 *줄고*', '', c('5.3.0'), { y: 360, dim: c('5.3.1') })}
  ${panel('up', 'green', '재방문 · 재등록<br>추가 구매는 *늘고*', '', w('늘어나는', '5.3.2') - 0.6, { y: 580 })}
  ${el(c('5.3.3') - 0.1, '*성과*로 이어집니다', { cls: 'abs h1', style: 'left:72px;top:900px' })}`)
}

// 9 L · B — 매장 경계: 플랫폼 → 매장 밖 상품(계획)
{
  const t = B.s9, out = c('6.2.2')
  scene(t, `
  ${head({ eb: 'NEXT BUSINESS · PLAN', t: '매장 밖에서도<br>*다시 살 수 있게*', size: 'h1', at: t + 0.05, y: 240 })}
  ${el(t + 0.4, '<em>매장</em>', { cls: 'zone', a: 'fade', style: 'left:72px;top:560px;width:430px;height:520px' })}
  ${bigNode('phone', '고객 전용<br>플랫폼', c('6.2.0'), { x: 107, y: 700, w: 360, c: 'teal' })}
  ${lines([[467, 820, 600, 680, out - 0.2, out + 0.5], [467, 820, 600, 960, out, out + 0.7]], t, { width: 5 })}
  ${bigNode('bottle', '쑥 화장품', w('쑥', '6.2.1'), { x: 600, y: 590, w: 360, c: 'green', row: true })}
  ${bigNode('box', '생활 상품', w('생활', '6.2.1'), { x: 600, y: 880, w: 360, c: 'amber', row: true, hl: w('다시', '6.2.3') })}
  ${plan('연결할 계획', c('6.2.4'), { y: 1150 })}`, { light: true })
}

// 10 L · E — 본점 노하우 → 2호점·가맹점으로 그대로(표준화)
{
  const t = B.s10, kn = c('6.3.1'), std = w('표준화', '6.3.2'), ap = c('6.3.3')
  scene(t, `
  ${deco('sq', 880, 220, 200, 'violet', t + 0.3)}
  ${head({ t: '본점 노하우를<br>*그대로*', size: 'h1', at: t + 0.05, y: 250 })}
  ${bigNode('store', '본점 운영 노하우', kn, { x: 72, y: 520, w: 888, c: 'copper', row: true })}
  ${lines([{ d: 'M516 650 V760 H282 V880 M516 760 H750 V880', t0: std - 0.2, t1: std + 0.8 }], t, { width: 5 })}
  ${xl(chip('표준화', std, { x: 430, y: 720, c: 'violet', big: true }))}
  ${bigNode('store', '2호점', w('2호점', '6.3.0'), { x: 72, y: 880, w: 420, c: 'teal', row: true, hl: ap })}
  ${bigNode('store', '가맹점', w('가맹점', '6.3.0'), { x: 540, y: 880, w: 420, c: 'blue', row: true, hl: ap + 0.15 })}`, { light: true })
}

// 11 D · A — '매장 운영 프로그램' 취소선 → 사업이 커지는 기반 + 오르는 선
{
  const t = B.s11, g = c('6.4.3')
  scene(t, `
  ${deco('ring', 840, 140, 260, 'copper', t + 0.2)}
  ${strikeLine('매장 운영 프로그램', t + 0.1, w('아니라', '6.4.1'), { y: 380 })}
  ${el(c('6.4.2') - 0.1, '사업이<br>*커지는 기반*', { cls: 'abs h1 xl', style: 'left:72px;top:480px' })}
  ${lines([{ d: 'M72 1180 C 360 1170, 560 1080, 940 860', t0: g, t1: g + 1.4 }], t, { width: 7 })}
  ${el(g + 1.2, badge('up', 'copper', 96), { cls: 'abs', a: 'scale', style: 'left:892px;top:812px' })}`)
}

// 12 L · D — 큰 칩 3 → 이용권 매장이면 똑같이
{
  const t = B.s12
  scene(t, `
  ${deco('disc', 880, 1100, 240, 'teal', t + 0.3)}
  ${head({ t: '이용권 매장이라면<br>*똑같이*', size: 'h1', at: t + 0.05, y: 250 })}
  ${xl(chip('피부관리실', w('피부', '7.1.1'), { x: 72, y: 540, c: 'rose' }))}
  ${xl(chip('마사지숍', w('마사지숍', '7.1.1'), { x: 160, y: 670, c: 'violet' }))}
  ${xl(chip('필라테스', c('7.1.2'), { x: 250, y: 800, c: 'teal' }))}
  ${el(c('7.1.4'), '<span class="mark">✓</span><span>똑같이 *적용*</span>', { cls: 'check lg abs', a: 'left', style: 'left:72px;top:980px;--c:var(--copper)' })}`, { light: true })
}

// 13 D · B — 같은 원리 순환도
{
  const t = B.s13, au = c('8.2.4')
  scene(t, `
  ${head({ eb: 'SAME PRINCIPLE', t: '업종은 달라도<br>*원리는 같습니다*', size: 'h1', at: t + 0.05, y: 240 })}
  ${loop({
    nodes: [
      { t: '한 번 입력', icon: 'pen', at: c('8.2.0'), c: 'teal' },
      { t: '다음 업무로', icon: 'flow', at: w('이어지고', '8.2.1') - 0.2, c: 'blue' },
      { t: '분석', icon: 'ai', at: c('8.2.2'), c: 'violet' },
      { t: '알려 줌', icon: 'bell', at: w('알려', '8.2.3'), c: 'amber' },
      { t: '자동 처리', icon: 'gear', at: w('자동으로', '8.2.4'), c: 'copper', hl: au + 1 },
    ],
    cx: 540, cy: 880, rx: 320, ry: 300, at: t + 0.3, drawAt: c('8.2.0'), drawEnd: au + 0.8, orbitAt: au + 0.6, hubText: '같은<br>원리', hubAt: c('8.1.1'), nodeW: 250,
  })}`)
}

// 14 D · E — 두 회사, 같은 원리(위/아래)
{
  const t = B.s14, two = c('8.3.3')
  scene(t, `
  ${deco('ring', 860, 1120, 220, 'teal', t + 0.3)}
  ${head({ eb: 'TWO COMPANIES', t: '두 회사,<br>*같은 원리*', size: 'h1', at: t + 0.05, y: 250 })}
  ${panel('truck', 'teal', '시간·비용 ↓<br>처리 능력·새 매출 ↑', '의료폐기물 수거·운반', c('8.3.0') + 0.1, { y: 520, dim: two })}
  ${panel('heart', 'green', '이탈 ↓<br>재방문·재구매 ↑', '쑥뜸원', two, { y: 820, hiedge: true })}`)
}

// 15 L · C — '데이터 직접 뒤지기' 취소선 → 실제 PC 화면(AX 코치): 오늘 먼저 할 일 · 근거
{
  const t = B.s15, pr = w('우선순위와', '9.2.1')
  scene(t, `
  ${head({ t: '대표님은<br>*보고 결정*만', size: 'h1', at: t + 0.05, y: 250 })}
  ${strikeLine('데이터 직접 뒤지기', c('9.2.0'), w('필요', '9.2.0'), { y: 480 })}
  ${browser31({ x: 72, y: 580, w: 888, at: c('9.2.0') + 0.2, url: 'WELLNESS AX · AX 코치', layers: [{ src: 'assets/real/well-coach-pc.jpg',
    scroll: [[pr - 0.6, pr + 0.6, 0, 140]],
    focus: [{ t0: pr + 0.4, t1: pr + 2.2, x: 330, y: 405, w: 1070, h: 200 }, { t0: pr + 2.2, t1: pr + 6, x: 330, y: 608, w: 1070, h: 190 }] }] })}
  ${rnote(pr - 0.2)}`, { light: true })
}

// 16 L · G — 바뀔 수 있어요 → 로고 + 3분 AX Fit 진단
{
  const t = B.s16, end = c('9.4.0') - 0.1
  scene(t, `
  ${deco('ring', 840, 120, 260, 'copper', t + 0.2)}${deco('disc', -80, 1150, 240, 'teal', t + 0.4)}
  ${el(t + 0.1, '대표님 회사도<br>*바뀔 수 있어요*', { cls: 'abs h1', out: end, style: 'left:72px;top:520px' })}
  ${endCard({ at: end, line: '*더 잘 돌아가고*<br>성장하는 회사로', sub: 'AI를 넣는 데서 끝내지 않고', cta: ['우리 회사는? 3분 AX Fit 진단', 'miraeailab.com'] })}`, { light: true })
}

R.finish()
