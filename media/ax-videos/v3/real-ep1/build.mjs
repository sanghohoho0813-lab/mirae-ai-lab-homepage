// 실제 프로젝트 1편 — 의료폐기물 수거·운반 회사 · 영상 스타일 v3(BIG INFOGRAPHIC: 크게 · 적게 · 시각 메타포 먼저)
// 장면표: ../SCENES.md (배경은 뜻에 따라 — D L L D L D D L L D D L D D L L)
// 음성·자막 정렬은 v2와 같은 규칙(1.13배 · 쉼 줄임 · -14 LUFS · 대본 글자 그대로)이라 v2 최종 음성을 그대로 쓴다.
// ⚠️ 회사 이름은 밝히지 않는다. 실제 화면은 업체·병원 이름을 ○○ 로 바꾼 캡처 한 장만 짧게. 숫자는 녹음에서 말한 것만.
import { createReel2, ic } from '../../lib/reels2.mjs'

const R = createReel2('.', { title: '실제 프로젝트 1편 · 의료폐기물 수거·운반' })
const { c, ce, w, scene, el, head, note, check, chip, bubble, node, nodeIn, hub, card, strike, deco, tagline, lines, phone, loop, kpi, endCard } = R
const REAL = '실제 화면 · 업체·병원 이름은 가렸습니다'
const C = { teal: 'var(--teal)', blue: 'var(--blue)', amber: 'var(--amber)', green: 'var(--green)', rose: 'var(--rose)', violet: 'var(--violet)', copper: 'var(--copper)' }
const badge = (icon, c, size) => `<span class="ibadge" style="--c:${C[c]}${size ? `;width:${size}px;height:${size}px` : ''}">${ic(icon)}</span>`
const panel = (icon, c, b, small, at, o = {}) =>
  card(`<div class="panel">${badge(icon, c)}<div><b>${b}</b>${small ? `<small>${small}</small>` : ''}</div></div>`, at, { x: 72, y: o.y, w: o.w ?? 888, c, hiedge: o.hiedge, dim: o.dim, hl: o.hl })
const bigNode = (icon, t, at, o) => node(`${ic(icon)}${t}${o.sub ? `<small>${o.sub}</small>` : ''}`, at, { ...o, cls: '' }).replace('class="node abs', `class="node lg${o.row ? ' hz' : ''} abs`)
const plan = (t, at, o) => el(at, `${ic('cal')}${t}`, { cls: 'plan abs', a: 'up', style: `left:${o.x ?? 72}px;top:${o.y}px` })
const svg = (inner, at, out) => `<svg class="abs draw" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;overflow:visible" data-in="${at}"${out != null ? ` data-out="${out}"` : ''} data-a="fade">${inner}</svg>`
const trav = (x, y, c, at, mv) => el(at, '', { cls: 'trav', a: 'scale', mv, style: `left:${x}px;top:${y}px;--c:${C[c]}` })

// 장면 경계(시작 문구의 자막 시작에서 조금 앞)
const B = {
  s2: c('1.3.0') - 0.2, s3: c('1.4.0') - 0.15, s4: c('2.1.0') - 0.3, s5: c('2.2.0') - 0.1, s6: c('3.1.0') - 0.2, s7: c('3.3.0') - 0.1,
  s8: c('4.1.0') - 0.15, s9: c('4.2.0') - 0.1, s10: c('4.4.0') - 0.15, s11: c('5.1.0') - 0.3, s12: c('5.4.0') - 0.15, s13: c('6.1.0') - 0.2,
  s14: c('7.1.0') - 0.25, s15: c('7.3.0') - 0.15, s16: c('8.1.0') - 0.2,
}

// 1 D · A — 큰 질문 → 디지털 기록은 '시작'일 뿐
{
  const k = c('1.2.0')
  scene(0, `
  ${deco('ring', 800, 150, 280, 'copper', 0.2)}${deco('disc', -100, 1160, 260, 'teal', 0.4)}
  ${head({ eb: 'REAL PROJECTS', t: 'AI를 도입하면<br>*뭐가 달라질까요?*', size: 'h1 xl', at: 0.15, y: 330 })}
  ${el(k, `${ic('doc')}디지털 기록`, { cls: 'abs klabel tagline', a: 'fade', style: 'left:72px;top:800px;color:var(--ink)' })}
  ${el(k + 0.6, '그다음은?', { cls: 'abs klabel', a: 'fade', style: 'right:120px;top:800px;text-align:right;color:var(--hi)' })}
  <div class="track abs" style="left:72px;top:870px;width:888px;height:26px" data-in="${k}" data-a="fade"><div class="fill" style="--c:var(--teal)" data-grow="${k + 0.2},${k + 1.2},250"></div></div>
  ${el(c('1.2.1'), '여기까지는 *시작*일 뿐', { cls: 'abs h3', style: 'left:72px;top:940px' })}`)
}

// 2 L · B — 데이터 → 분석 → 지금 할 일(세로 흐름)
{
  const t = B.s2, a1 = c('1.3.0') + 0.1, a2 = w('분석해서', '1.3.0'), a3 = c('1.3.1')
  scene(t, `
  ${deco('sq', 860, 1060, 220, 'blue', t + 0.3)}
  ${head({ t: '분석해서<br>*지금 할 일*까지', size: 'h1', at: t + 0.1, y: 260 })}
  ${bigNode('db', '쌓인 데이터', a1, { x: 72, y: 560, w: 640, c: 'teal', row: true, dim: a2 })}
  ${bigNode('ai', '분석', a2, { x: 72, y: 760, w: 640, c: 'blue', row: true, dim: a3 })}
  ${bigNode('target', '지금 할 일 알려 주기', a3, { x: 72, y: 960, w: 760, c: 'copper', row: true, hiNode: true })}
  ${lines([[150, 700, 150, 760, a2 - 0.4, a2], [150, 900, 150, 960, a3 - 0.4, a3]], t, { width: 5 })}`, { light: true })
}

// 3 L · F — 큰 숫자 2곳
{
  const t = B.s3, two = w('두', '1.4.2')
  scene(t, `
  ${deco('ring', 820, 1040, 240, 'violet', t + 0.3)}
  ${head({ eb: 'REAL PROJECTS', t: '개발 중인 여러 업체 중', size: 'h3', at: t + 0.1, y: 280 })}
  ${kpi('2', '곳', two - 0.1, { y: 400, size: 260 })}
  ${chip('1편 · 의료폐기물 수거·운반', two + 0.35, { y: 760, c: 'teal', big: true }).replace('chip dot abs big', 'chip dot abs xl')}
  ${chip('2편 · 쑥뜸원(웰니스 매장)', two + 0.7, { y: 890, c: 'violet', big: true }).replace('chip dot abs big', 'chip dot abs xl')}
  ${note('회사 이름은 밝히지 않고 업종만 소개합니다', t + 0.8)}`, { light: true })
}

// 4 D · A — 의료폐기물 수거·운반 회사(병원 → 수거 → 운반, 트럭 점이 이동)
{
  const t = B.s4, p1 = w('병원', '2.1.0'), p2 = w('수거하고', '2.1.1'), p3 = w('운반하는', '2.1.1')
  const xs = [142, 516, 890], y = 840
  scene(t, `
  ${deco('disc', 860, 1120, 240, 'rose', t + 0.3)}
  ${head({ eb: 'PROJECT 01 · 일반 중소기업 사례', t: '의료폐기물<br>*수거·운반* 회사', size: 'h1', at: t + 0.1, y: 300 })}
  ${lines([[212, y, 446, y, p2 - 0.3, p2 + 0.3], [586, y, 820, y, p3 - 0.3, p3 + 0.3]], t, { width: 6 })}
  ${[['building', 'rose', '병원', p1], ['truck', 'teal', '수거', p2], ['route', 'copper', '운반', p3]].map(([i, col, lb, a], k) =>
    el(a, `${badge(i, col, 140)}`, { cls: 'abs', a: 'scale', style: `left:${xs[k] - 70}px;top:${y - 70}px` })
    + el(a + 0.15, lb, { cls: 'abs h2', a: 'up', style: `left:${xs[k] - 130}px;width:260px;top:${y + 96}px;text-align:center` })).join('')}
  ${trav(212, y, 'amber', p2, [p2 + 0.1, p3 + 1.0, 608, 0])}`)
}

// 5 L · B — 병원마다 다른 기준(위/아래 비교)
{
  const t = B.s5
  scene(t, `
  ${deco('ring', 840, 160, 240, 'amber', t + 0.3)}
  ${head({ t: '병원마다<br>*기준*이 달라요', size: 'h1', at: t + 0.1, y: 260 })}
  ${chip('수거 주기도 제각각', c('2.2.0') + 0.3, { y: 520, c: 'teal' })}
  ${panel('cal', 'blue', '월정액', '정산 기준 ①', c('2.2.1'), { y: 650 })}
  ${panel('coin', 'amber', '무게당 단가', '정산 기준 ②', c('2.2.2'), { y: 880 })}
  ${el(c('2.2.3'), `${ic('alert')} 꽤 *복잡*해요`, { cls: 'abs h3', style: 'left:72px;top:1120px' })}`, { light: true })
}

// 6 D · D — 같은 정보가 네 번 옮겨 다님(계단 흐름)
{
  const t = B.s6
  const st = [['pen', '수기 메모', w('수기', '3.1.1'), 'teal'], ['camera', '사진·정리', c('3.1.2'), 'blue'], ['chatm', '카톡 전송', w('카톡', '3.1.3'), 'amber'], ['sheet', '엑셀 입력', c('3.2.0'), 'copper', '사무실에서 다시 확인']]
  const X = (i) => 72 + i * 216, Y = (i) => 540 + i * 160
  scene(t, `
  ${deco('ring', 860, 180, 220, 'amber', t + 0.3)}
  ${head({ eb: 'BEFORE', t: '같은 정보를<br>*몇 번씩* 옮겨 적기', size: 'h1', at: t + 0.05, y: 260 })}
  ${lines(st.slice(1).map(([, , a], i) => ({ d: `M${X(i) + 240} ${Y(i) + 80} H${X(i + 1) + 120} V${Y(i + 1)}`, t0: a - 0.45, t1: a })), t, { width: 4 })}
  ${st.map(([i, tx, a, col, sub], k) => bigNode(i, tx, a, { x: X(k), y: Y(k), w: 240, c: col, sub, dim: st[k + 1]?.[2], hl: k === 3 ? w('옮겨', '3.2.1') : undefined })).join('')}`)
}

// 7 D · B — 규모 → 정보가 흩어짐 → 낭비
{
  const t = B.s7, sc = w('흩어져', '3.3.3'), lost = c('3.4.0')
  const ch = [['수거', w('수거부터', '3.3.2'), 'teal', 300, 770, 72, 690], ['자재', w('자재', '3.3.2'), 'blue', 540, 770, 730, 680],
    ['정산', w('정산', '3.3.2'), 'amber', 300, 880, 120, 960], ['미수금', w('미수금', '3.3.2'), 'rose', 520, 880, 680, 970]]
  scene(t, `
  ${el(t + 0.2, '50여 곳<small>거래처</small>', { cls: 'kpi sm abs', a: 'scale', dim: c('3.3.2'), style: 'left:72px;top:270px' })}
  ${el(c('3.3.1'), '105톤쯤<small>한 달</small>', { cls: 'kpi sm abs', a: 'scale', dim: c('3.3.2'), style: 'left:72px;top:420px' })}
  ${el(c('3.3.3'), '정보가 *흩어져* 있었죠', { cls: 'abs h2', style: 'left:72px;top:570px' })}
  ${ch.map(([tx, a, col, x0, y0, x1, y1]) => chip(tx, a, { x: x0, y: y0, c: col, mv: [sc, sc + 1.4, x1 - x0, y1 - y0] }).replace('chip dot abs', 'chip dot abs xl')).join('')}
  ${card(`<div class="panel">${badge('clock', 'copper')}<div><small>현장과 본사 사이</small><b>낭비되는 *노력과 시간*</b></div></div>`, lost, { x: 72, y: 1080, w: 888, hiedge: true })}
  ${note('숫자는 이 회사가 직접 알려 준 규모입니다', t + 0.8)}`)
}

// 8 L · C — 실제 화면: 현장에서 한 번 입력 → 하나의 흐름
{
  const t = B.s8, fl = c('4.1.3')
  const it = [['수거 이력', w('수거', '4.1.1'), 'teal', 470], ['자재·재고', w('자재', '4.1.1'), 'blue', 590], ['정산 정보', c('4.1.2'), 'copper', 710]]
  scene(t, `
  ${head({ eb: 'NOW', t: '현장에서 *한 번* 입력', at: t + 0.05, y: 240 })}
  ${phone({ src: 'assets/real/ops-collection-m.jpg', ratio: 1688 / 780, at: t + 0.15, x: 72, y: 380, w: 560, h: 860, kb: `${t},${ce('4.1.3')},1,0,0,1.06,-14,-40` })}
  ${it.map(([tx, a, col, y]) => check(tx, a, { x: 668, y, c: col })).join('')}
  ${lines([[697, 540, 697, 590, fl - 0.3, fl], [697, 660, 697, 710, fl, fl + 0.3], [697, 780, 697, 860, fl + 0.3, fl + 0.8]], t, { width: 5 })}
  ${el(fl + 0.6, '*하나의<br>흐름*으로', { cls: 'abs h3', style: 'left:668px;top:880px' })}
  ${note(REAL, t + 0.6)}`, { light: true })
}

// 9 L · D — 병원 요청 말풍선 → 당일 긴급 요청 ↓
{
  const t = B.s9, dn = c('4.3.0')
  scene(t, `
  ${deco('disc', 880, 1080, 240, 'rose', t + 0.3)}
  ${head({ eb: 'HOSPITAL PORTAL', t: '병원은<br>*미리* 요청', size: 'h1', at: t + 0.05, y: 260 })}
  ${el(w('추가', '4.2.1') - 0.2, '“추가 수거 부탁드려요”', { cls: 'bubble lg abs', a: 'up', dim: dn, style: 'left:72px;top:560px;--c:var(--rose)' })}
  ${el(w('자재', '4.2.1'), '“용기 미리 주문할게요”', { cls: 'bubble lg abs', a: 'up', dim: dn, style: 'left:200px;top:720px;--c:var(--violet)' })}
  ${panel('arrowDown', 'green', '당일 긴급 요청', '줄어드는 중', dn + 0.1, { y: 920, hiedge: true, hl: c('4.3.2') })}
  ${note('말풍선은 예시 문장입니다', t + 1)}`, { light: true })
}

// 10 D · B — 청구·입금·미수금이 '한 곳'으로 모임(허브)
{
  const t = B.s10, one = c('4.4.3'), hx = 540, hy = 860
  const nd = [['receipt', '청구', w('청구', '4.4.2'), 'amber', 72, 610], ['bank', '입금', w('입금', '4.4.2'), 'green', 718, 610], ['coin', '미수금', w('미수금', '4.4.2'), 'copper', 395, 1060]]
  scene(t, `
  ${deco('ring', 860, 1120, 220, 'blue', t + 0.3)}
  ${head({ t: '정산도<br>*한 곳*에서', size: 'h1', at: t + 0.05, y: 260 })}
  ${chip('병원별 계약 조건 · 단가 이력', c('4.4.0') + 0.4, { y: 500, c: 'blue' })}
  ${lines(nd.map(([, , , , x, y]) => [x + 135, y + 70, hx, hy, one - 0.3, one + 0.6]), t, { width: 5 })}
  ${nd.map(([i, tx, a, col, x, y]) => bigNode(i, tx, a, { x, y, w: 270, c: col })).join('')}
  ${hub('한 곳', one, { x: hx - 95, y: hy - 95 })}`)
}

// 11 D · B — AI 파이프라인: 기록 → 분석 → 다시 필요할 시점 → 주문·추가 매출
{
  const t = B.s11, k = c('5.2.0'), an = w('분석해서', '5.2.1'), pt = c('5.2.2'), sale = c('5.3.0')
  scene(t, `
  ${deco('ring', 840, 150, 260, 'violet', t + 0.2)}
  ${head({ eb: 'AND THEN, AI', t: '그럼 *AI*는<br>뭘 할까요?', size: 'h1', at: t + 0.1, y: 250 })}
  ${chip('수거량', k, { x: 72, y: 520, c: 'teal', big: true })}
  ${chip('자재 사용 기록', w('자재', '5.2.1'), { x: 300, y: 520, c: 'blue', big: true })}
  ${lines([[300, 608, 300, 660, an - 0.3, an], [300, 790, 300, 850, pt - 0.4, pt]], t, { width: 5 })}
  ${bigNode('ai', 'AI 분석', an, { x: 72, y: 660, w: 456, c: 'violet', row: true })}
  ${card(`<div class="panel">${badge('spark', 'copper')}<div><small>○○병원 · 용기</small><b>*다시 필요할 시점*</b></div></div>`, pt, { x: 72, y: 850, w: 888, hiedge: true })}
  ${chip('실제 주문', sale, { x: 72, y: 1110, c: 'amber', big: true })}
  ${el(sale + 0.3, '→', { cls: 'abs h3', a: 'fade', style: 'left:318px;top:1112px;color:var(--hi)' })}
  ${chip('추가 매출', w('추가', '5.3.1'), { x: 380, y: 1100, c: 'copper' }).replace('chip dot abs', 'chip dot abs xl')}
  ${note('병원 이름은 예시입니다', pt + 0.6)}`)
}

// 12 L · E — 동선 지도: 엉킨 동선 → 정리된 동선, 거래처가 늘어남(계획)
{
  const t = B.s12, r = c('5.4.3'), more = c('5.4.6')
  const dep = [130, 930]
  const H = [[300, 760], [480, 700], [670, 730], [840, 830], [800, 1020], [600, 1080], [400, 1040]]
  const messy = [dep, H[2], H[6], H[3], H[0], H[5], H[1], H[4]]
  const clean = [dep, ...H, dep]
  const path = (pts) => 'M' + pts.map((p) => p.join(' ')).join(' L')
  const smooth = (pts) => { let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += ` Q${x0} ${y0} ${(x0 + x1) / 2} ${(y0 + y1) / 2}` } return d + ` T${pts[pts.length - 1].join(' ')}` }
  const dots = (pts, col, r0 = 16) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r0}" style="fill:${C[col]};stroke:#fff;stroke-width:4"/>`).join('')
  const NEW = [[230, 1100], [900, 700], [560, 900]]
  scene(t, `
  ${head({ eb: 'NEXT · PLAN', t: '*동선과 배차*를<br>더 효율적으로', size: 'h1', at: t + 0.05, y: 250 })}
  ${chip('수거 패턴', t + 0.4, { x: 72, y: 520, c: 'teal' })}
  ${chip('추가 요청', c('5.4.1'), { x: 300, y: 520, c: 'rose' })}
  ${chip('차량·기사 데이터', c('5.4.2'), { x: 528, y: 520, c: 'blue' })}
  ${svg(`<path d="${path(messy)}" pathLength="1" data-draw="${t + 0.8},${r - 0.3}" style="stroke:rgba(23,27,32,.3);stroke-width:4;stroke-dasharray:1 1"/>`, t + 0.6, r + 0.8)}
  ${svg(`<path d="${smooth(clean)}" pathLength="1" data-draw="${r},${r + 1.6}" style="stroke-width:6"/>`, r)}
  ${svg(dots(H, 'rose'), t + 0.6)}
  ${el(t + 0.6, badge('truck', 'copper', 96), { cls: 'abs', a: 'scale', style: `left:${dep[0] - 48}px;top:${dep[1] - 48}px` })}
  ${svg(dots(NEW, 'green', 18), more)}
  ${el(more + 0.3, '같은 인원·차량으로 *더 많은 거래처*', { cls: 'abs h3', style: 'left:72px;top:1150px' })}
  ${plan('고도화 계획', c('5.4.7'), { x: 700, y: 250 })}`, { light: true })
}

// 13 D · D — 목표: ↓ 줄이고·막고 / ↑ 더 많은 일·새로운 매출
{
  const t = B.s13, up = c('6.2.3')
  scene(t, `
  ${deco('ring', 860, 1120, 240, 'copper', t + 0.3)}
  ${head({ eb: 'GOAL', t: '결국 목표는<br>*분명*해요', size: 'h1', at: t + 0.05, y: 260 })}
  ${panel('arrowDown', 'teal', '줄이고 · 막고', '행정 업무 · 불필요한 이동 · 빠지는 정산', c('6.2.0') + 0.1, { y: 560, dim: up })}
  ${panel('up', 'copper', '더 많은 일 · *새로운 매출*', '같은 인력으로', up, { y: 820, hiedge: true, hl: c('6.2.4') })}`)
}

// 14 D · B — 다음 사업 순환도(계획)
{
  const t = B.s14, e = c('7.2.4')
  scene(t, `
  ${head({ eb: 'NEXT BUSINESS · PLAN', t: '수거 일정에<br>*공급*을 더해', size: 'h1', at: t + 0.05, y: 240 })}
  ${loop({
    nodes: [
      { t: '수거', icon: 'truck', at: t + 0.5, c: 'teal' },
      { t: '사용 기록', icon: 'db', at: t + 0.8, c: 'blue' },
      { t: '시점 추천', icon: 'spark', at: w('추천', '7.2.2') - 0.3, c: 'violet' },
      { t: '주문', icon: 'receipt', at: w('주문', '7.2.3'), c: 'amber' },
      { t: '함께 공급', icon: 'box', at: w('공급', '7.2.3') - 0.2, c: 'green' },
      { t: '새로운 매출', icon: 'coin', at: e, c: 'copper', hl: e + 0.4 },
    ],
    cx: 540, cy: 880, rx: 320, ry: 300, at: t + 0.3, drawAt: t + 0.4, drawEnd: e + 0.3, orbitAt: e + 0.3, hubText: '반복해서<br>쓰는 소모품', hubAt: c('7.2.0'), nodeW: 240,
  })}`)
}

// 15 L · E — 하나 → 여럿: 구독형 서비스(중장기 계획)
{
  const t = B.s15, f = c('7.3.2')
  scene(t, `
  ${deco('sq', 880, 1100, 200, 'blue', t + 0.3)}
  ${head({ eb: 'LONG TERM · PLAN', t: '다른 업체도 쓰는<br>*구독형 서비스*', size: 'h1', at: t + 0.05, y: 250 })}
  ${bigNode('db', '운영 데이터 + 노하우', t + 0.4, { x: 72, y: 560, w: 888, c: 'copper', row: true, hl: c('7.3.1') })}
  ${lines([{ d: 'M516 700 V780 H207 V860 M516 780 V860 M516 780 H825 V860', t0: f - 0.3, t1: f + 0.7 }], t, { width: 5 })}
  ${['teal', 'blue', 'violet'].map((col, i) => bigNode('building', '같은 업종', f + 0.2 + i * 0.3, { x: 72 + i * 309, y: 860, w: 270, c: col, sub: '의료폐기물 업체' })).join('')}
  ${plan('구독형 서비스 · 중장기 계획', c('7.3.3'), { y: 1150 })}`, { light: true })
}

// 16 L · G — 업무 개선(취소선) → 새로운 사업 → 로고 · 다음 편
{
  const t = B.s16, end = R.VOICE_END + 0.1
  scene(t, `
  ${deco('ring', 840, 120, 260, 'copper', t + 0.2)}${deco('disc', -80, 1150, 240, 'teal', t + 0.4)}
  ${el(t + 0.15, `<span class="st">한 회사의 업무 개선<span class="sl" data-strike="${w('끝나지', '8.1.1')}"></span></span>`, { cls: 'abs h3 strike-wrap dimtxt', out: end, style: 'left:72px;top:420px' })}
  ${el(c('8.1.2'), '현장의 운영 방식을<br>*새로운 사업*으로', { cls: 'abs h1', out: end, style: 'left:72px;top:520px' })}
  ${endCard({ at: end, line: '다음 편 · *쑥뜸원*', sub: '이용권 매장은 어떻게 달라지고 있을까요?', cta: ['우리 회사는? 3분 AX Fit 진단', 'miraeailab.com'] })}`, { light: true })
}

R.finish()
