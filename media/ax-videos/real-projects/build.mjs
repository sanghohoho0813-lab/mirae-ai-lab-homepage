// 실제 AX 프로젝트 소개 — AX 상세 페이지 끝에 넣는 영상(대표님 녹음, 1.08배, 9:16)
// 톤: 영상 1·2 고급판과 같게(먹색 + 샴페인 골드, 유리 카드, 부드러운 전환).
// ⚠️ 실제 화면은 짧게, 몇 번만 — 업체명·병원명·사람 이름·금액·연락처·주소는 캡처할 때 ○○ 로 바꿨다(scratchpad mask.mjs).
//    나머지는 각 회사 시스템의 색감(의료폐기물: 남색 + 파랑 / 쑥뜸원: 짙은 청록 + 베이지)만 살려 새로 그린 '예시 화면'.
//    매출·정산·영업 화면은 쓰지 않는다.
import { createBuild, r2, ic } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'
import { kit3 } from '../lib/kit3.mjs'

const TITLE = '실제 AX 프로젝트 · 두 회사 이야기'
const B = createBuild('.', { title: TITLE, tag: '실제 프로젝트 · 업종만 공개', premium: true })
const K = kit(B)
const X = kit2(B, K)
const P = kit3(B, K)
const { T, C, wt, freeze, tw, from, to } = B
const H = P.heads
const c = (s) => { const [b, l, p] = s.split('.').map(Number); return C(b, l, p ?? 0).start }
const w = (needle, f) => wt(needle, typeof f === 'string' ? c(f) : f)
const R = (n) => `assets/real/${n}.jpg`
const REAL = '실제 화면 · 업체 정보는 가렸어요'
const EX = '예시 화면 · 색감만 살려 다시 그림'
function fzBefore(b, l, label, sub = '') {
  const [s0, e0] = B.silBefore(b, l)
  const s = r2(s0 + 0.05), e = r2(e0 - 0.2)
  freeze(s, e - s, label, sub)
}

B.addCssLast(`
.mock { position: absolute; left: 130px; right: 130px; border-radius: 34px; overflow: hidden; background: #fff; color: #15181D; box-shadow: 0 50px 110px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.12); }
.mock .mh { position: relative; display: flex; align-items: center; gap: 18px; padding: 30px 36px; color: #fff; font-size: 36px; font-weight: 800; letter-spacing: -0.02em; }
.mock .mh .ic { width: 44px; height: 44px; }
.mock .mh em { margin-left: auto; font-size: 22px; font-weight: 700; opacity: .7; }
.mock.ops .mh { background: #0A1020; } .mock.ops .mh .ic { color: #5B9BF0; }
.mock.well .mh { background: #0F4E4B; } .mock.well .mh .ic { color: #E3C99A; }
.mock .mb { display: flex; flex-direction: column; gap: 18px; padding: 30px 34px 36px; }
.mock .row { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 28px; border-radius: 20px; background: #F2F4F8; font-size: 34px; font-weight: 700; }
.mock .row small { font-size: 26px; font-weight: 600; color: #6B7380; }
.mock.well .row { background: #F4EEE3; } .mock.well .row b { color: #0F4E4B; }
.mock .rq { justify-content: flex-start; gap: 22px; font-size: 40px; font-weight: 800; background: #EEF4FE; color: #123063; box-shadow: inset 0 0 0 2px rgba(46,123,230,.25); }
.mock .rq .ic { width: 52px; height: 52px; color: #2E7BE6; }
.mock .bar { position: relative; display: block; width: 260px; height: 14px; border-radius: 7px; background: #E2D8C6; overflow: hidden; } .mock .bar i { position: absolute; inset: 0; background: #0F4E4B; transform-origin: 0 50%; }
.route { position: absolute; left: 90px; right: 90px; top: 520px; height: 600px; }
.route svg.rt { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.route svg.rt path { fill: none; stroke: #D8A871; stroke-width: 6; stroke-dasharray: 18 16; }
.rnode { position: absolute; width: 160px; margin-left: -80px; display: flex; flex-direction: column; align-items: center; gap: 14px; color: #E6C396; font-size: 34px; font-weight: 700; white-space: nowrap; }
.rnode .ic { width: 120px; height: 120px; padding: 26px; border-radius: 32px; background: #12161C; color: #D8A871; box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.5), 0 20px 50px rgba(0,0,0,.4); }
.rnode.far .ic { box-shadow: inset 0 0 0 2px #D98C7C, 0 0 40px rgba(217,140,124,.35); color: #E39A88; }
.rnode .chip { position: absolute; top: -70px; }
.rdot { position: absolute; left: 0; top: 0; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; background: #D8A871; box-shadow: 0 0 0 12px rgba(216,168,113,.2), 0 0 40px rgba(216,168,113,.7); }
.chain2 { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 16px 12px; max-width: 900px; }
.chain2 span { padding: 18px 30px; border-radius: 22px; font-size: 40px; font-weight: 700; color: #EDE3D4; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.35); white-space: nowrap; }
.chain2 i { font-style: normal; font-size: 40px; color: #D8A871; }
.ring { position: absolute; border-radius: 16px; box-shadow: 0 0 0 4px #D8A871, 0 0 30px rgba(216,168,113,.7); }
.fanchip { position: absolute; }
.side { position: absolute; display: flex; flex-direction: column; gap: 20px; }
`)

// 실제 화면(폰) 한 장 — 가운데 또는 왼쪽, 아래에 '실제 화면' 칩
function realPhone(t, src, o = {}) {
  const id = K.uid('rp'), sw = o.sw ?? 380, left = o.left ?? (1080 - sw - 16) / 2, top = o.top ?? 300
  const html = `${o.head || ''}<div class="abs" id="${id}" style="left:${left}px;top:${top}px">${B.phoneImg(`${id}-ph`, src, sw)}${o.inner ? `<div class="abs" style="left:8px;top:8px;width:${sw}px">${o.inner}</div>` : ''}</div>
    ${K.chipAt(`${id}-lb`, o.label ?? REAL, o.labelY ?? top + sw * 844 / 390 + 34, o.lbc || '')}${o.extra || ''}`
  B.shot(t, html, o.shot)
  from(`#${id}`, t + 0.05, 'y: 120, opacity: 0', 0.9, 'expo.out')
  from(`#${id}-lb`, t + 0.5, 'opacity: 0', 0.6, 'power1.out')
  return id
}

// ━━ 도입
{ const t = 0
  P.scene(t, [P.eyebrow('REAL PROJECTS', 330, 0.05), H([{ at: 0.15, text: 'AI를 도입하면<br>우리 회사는<br>*뭐가 달라질까?*', size: 'l', y: 470 }])], { bg: 'bgA', cam: 'in' }) }
{ const t = c('1.2.0')
  const g = P.cards([{ ic: 'building', label: '의료폐기물 수거·운반', sub: '병원 수십 곳 · 현장 직원', at: w('두', '1.2.1') - 0.1 }, { ic: 'users', label: '쑥뜸원(웰니스)', sub: '단골 고객 · 방문 관리', at: w('곳을', '1.2.1') }], { y: 660 })
  P.scene(t, [H([{ at: t + 0.1, text: '말보다 *실제 회사*로', size: 'm' }], { y: 330 }), P.eyebrow('지금 만들고 있는 두 곳', 540, w('실제로', '1.2.1') - 0.3), g.html,
    K.fineAt('f12', '회사 이름은 밝히지 않고 업종만 소개해요', 1250)], { bg: 'bgB', trans: 'fade' })
  from('#f12', t + 1.2, 'opacity: 0', 0.6, 'power1.out') }
P.title(B.silBefore(2, 1)[0] + 0.05, { no: 'REAL PROJECT 01', title: '의료폐기물<br>*수거·운반*' })

// ━━ 1. 의료폐기물 수거·운반
K.browser(c('2.1.0'), { src: R('ops-clients-pc'), url: 'Business AX · 거래처 관리', tag: REAL, top: 420, zoom: 1.12, panX: -30, panY: -20, d: 4.2,
  extra: H([{ at: c('2.1.0') + 0.1, text: '병원 거래처를 *한 화면*에', size: 's' }], { y: 250 }), shot: { bg: 'bgBlue', trans: 'fade' } })
{ const t = c('2.2.0')
  const g = P.cards([{ ic: 'cal', label: '병원마다 수거 주기', at: c('2.2.1') }, { ic: 'money', label: '월 정액', at: c('2.2.2') }, { ic: 'db', label: '무게당 단가', at: c('2.2.3') }], { y: 520 })
  P.scene(t, [H([{ at: t + 0.1, text: '왜 *복잡할까?*', size: 'l' }], { y: 300 }), g.html], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('2.3.0')
  const g = P.cards([{ ic: 'shop', label: '자재 공급', at: t + 0.1 }, { ic: 'money', label: '정산 방식', at: c('2.3.1') }], { layout: 'row', y: 460 })
  P.scene(t, [P.eyebrow('여기에 더해', 330, t + 0.05), g.html.replace('gcards row', 'gcards row two'), H([{ at: w('제각각이고요', '2.3.1') - 0.3, text: '병원마다 *제각각*' }], { y: 920 })], { bg: 'bgL', trans: 'wipeUp' }) }
{ const t = c('2.4.0'), id = K.uid('ch')
  const items = [['수기로 적고', t + 0.6], ['사진 찍고', c('2.4.1')], ['카톡으로 보내고', w('카톡으로', '2.4.1') - 0.1], ['사무실에서 다시 확인', c('2.4.2')], ['엑셀에 옮겨 적기', c('2.4.3')]]
  items.forEach(([, a], i) => from(`#${id}-${i}`, a, 'opacity: 0, y: 16', 0.7, 'expo.out'))
  P.scene(t, [P.eyebrow('예전에는', 300, t + 0.05), H([{ at: t + 0.15, text: '같은 내용을 *몇 번씩*', size: 'm' }], { y: 380 }),
    `<div class="cx" style="top:640px"><div class="chain2">${items.map(([l], i) => `${i ? `<i id="${id}-a${i}">→</i>` : ''}<span id="${id}-${i}">${l}</span>`).join('')}</div></div>`], { bg: 'bgOld', trans: 'fade' })
  items.forEach(([, a], i) => { if (i) from(`#${id}-a${i}`, a - 0.1, 'opacity: 0', 0.5, 'power1.out') }) }
{ const t = c('2.5.0')
  K.notifs(t, { top: 560, items: [{ ic: 'clock', t: '전달이 늦어요', s: '현장 → 사무실', w: '', at: c('2.6.0') }, { ic: 'x', t: '한 번 놓치면 다시 확인', s: '전화 · 카톡 · 엑셀을 다시', w: '', at: c('2.6.1') }],
    extra: H([{ at: t + 0.1, text: '그러면 *어떤 일*이?', size: 'm' }], { y: 300 }), shot: { bg: 'bgB', trans: 'fade' } }) }
{ const t = c('2.6.2'), id = K.uid('rt')
  // 사무실 → 예정에 없던 먼 병원 — 점선 길이 그려지고, 점(차)이 길을 따라 간다
  const P0 = [90, 500], P1 = [330, 500], P2 = [260, 110], P3 = [790, 100]
  const bz = (u) => [0, 1].map((k) => (1 - u) ** 3 * P0[k] + 3 * (1 - u) ** 2 * u * P1[k] + 3 * (1 - u) * u * u * P2[k] + u ** 3 * P3[k])
  const kf = Array.from({ length: 13 }, (_, i) => { const [x, y] = bz(i / 12); return { x: r2(x), y: r2(y) } })
  const html = `${H([{ at: t + 0.1, text: '갑자기 *추가 수거·용기 요청*', size: 's' }, { at: c('2.6.3'), text: '예정에 없던 *먼 거리*를 또', size: 's' }], { y: 290 })}
    <div class="route" id="${id}"><svg class="rt" viewBox="0 0 900 600"><path id="${id}-p" d="M${P0} C ${P1}, ${P2}, ${P3}"/></svg>
    <span class="rnode" style="left:${P0[0]}px;top:${P0[1] - 60}px">${ic('building')}<b>사무실</b></span>
    <span class="rnode far" id="${id}-far" style="left:${P3[0]}px;top:${P3[1] - 60}px"><span class="chip hot" id="${id}-rq">+ 추가 요청</span>${ic('building')}<b>먼 병원</b></span>
    <span class="rdot" id="${id}-d"></span></div>`
  B.shot(t, html, { bg: 'bgA', trans: 'fade' })
  tw(`tl.set('#${id}-d', { x: ${P0[0]}, y: ${P0[1]} }, ${r2(t)});`)
  from(`#${id}-far`, t + 0.3, 'opacity: 0, scale: 0.85', 0.7, 'expo.out')
  from(`#${id}-rq`, t + 0.6, 'opacity: 0, y: 14', 0.6, 'expo.out')
  tw(`tl.fromTo('#${id} svg.rt', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2.4, ease: 'power1.inOut', immediateRender: true }, ${r2(c('2.6.3') + 0.1)});`)
  tw(`tl.to('#${id}-d', { keyframes: ${JSON.stringify(kf.slice(1))}, duration: 2.4, ease: 'power1.inOut' }, ${r2(c('2.6.3') + 0.1)});`) }
fzBefore(3, 1, '한 번 놓치면, 먼 거리를 또', '예전 방식의 비용')

{ const t = c('3.1.0'), id = K.uid('fan')
  const chips = [['수거 이력', w('수거', '3.1.2')], ['자재', w('자제', '3.1.2')], ['정산 정보', w('정산에', '3.1.2')]]
  const extra = `<div class="side" style="left:560px;top:520px">${chips.map(([l], i) => `<span class="chip big" id="${id}-${i}">${ic('check')}${l}</span>`).join('')}</div>`
  realPhone(t, R('ops-collection-m'), { sw: 380, left: 80, top: 300, extra: extra + H([{ at: t + 0.1, text: '현장에서 *한 번만*', size: 's' }], { y: 225 }), shot: { bg: 'bgBlue', trans: 'fade' } })
  chips.forEach(([, a], i) => from(`#${id}-${i}`, a, 'x: -60, opacity: 0', 0.8, 'expo.out'))
  tw(`tl.to('#${id}-0, #${id}-1, #${id}-2', { backgroundColor: '#D8A871', color: '#15110C', duration: 0.5, stagger: 0.12 }, ${r2(w('한꺼번에', '3.1.3'))});`) }
{ const t = c('3.2.0'), id = K.uid('pt')
  const html = `${H([{ at: t + 0.1, text: '병원도 *전용 포털*에서', size: 's' }], { y: 230 })}
    <div class="mock ops" id="${id}" style="top:380px"><div class="mh">${ic('building')}<span>우리 병원 · 요청하기</span><em>예시 화면</em></div><div class="mb">
      <div class="row rq" id="${id}-a">${ic('rocket')}추가 수거 요청</div><div class="row rq" id="${id}-b">${ic('shop')}자재 요청</div><div class="row rq" id="${id}-c">${ic('db')}용기 요청</div></div></div>
    <div class="cx" style="top:1090px"><div class="ntf" id="${id}-n" style="width:860px"><span class="nic">${ic('bell')}</span><div><b>새 요청 · ○○병원</b><small>추가 수거 · 바로 확인</small></div><em>방금</em></div></div>
    ${K.fineAt(`${id}-f`, EX, 1300)}`
  B.shot(t, html, { bg: 'bgB', trans: 'fade' })
  from(`#${id}`, t + 0.1, 'y: 80, opacity: 0', 0.9, 'expo.out')
  ;[['a', w('수거나', '3.2.1')], ['b', w('자제', '3.2.1')], ['c', w('용기', '3.2.1')]].forEach(([k, a]) => tw(`tl.fromTo('#${id}-${k}', { scale: 1 }, { scale: 1.04, backgroundColor: '#DCE9FD', duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ${r2(a)});`))
  from(`#${id}-n`, w('훨씬', '3.2.3') - 0.2, 'y: 60, opacity: 0', 0.8, 'expo.out')
  from(`#${id}-f`, t + 0.8, 'opacity: 0', 0.6, 'power1.out') }
P.title(B.silBefore(4, 1)[0] + 0.05, { no: 'REAL PROJECT 02', title: '쑥뜸원<br>*웰니스*' })

// ━━ 2. 쑥뜸원
K.scatter(c('4.2.0'), { items: [
  { ic: 'cal', label: '방문 기록', x: 100, y: 470, r: -4, at: w('방문', '4.2.0') }, { ic: 'doc', label: '이용권', x: 640, y: 500, r: 3, at: w('이용권,', '4.2.0') },
  { ic: 'chat', label: '상담 내용', x: 150, y: 860, r: 3, at: w('상담', '4.2.0') }, { ic: 'user', label: '선호 부위', x: 620, y: 900, r: -3, at: c('4.2.1') }],
  explodeAt: w('흩어지기', '4.2.2') - 0.2,
  extra: P.eyebrow('이런 곳은', 260, c('4.2.0') + 0.05) + H([{ at: c('4.2.2'), text: '장부·메모 *여기저기*', size: 's', y: 330 }]), shot: { bg: 'bgOld', trans: 'fade' } })
{ const t = c('4.3.0'), id = K.uid('bd'), sw = 380, k = sw / 390
  // 실제 방문 기록 창(부위 그림) → 부위 고르기 — 누르는 곳에 골드 고리
  const inner = `<span class="touch" id="${id}-t1" style="left:${r2(118 * k)}px;top:${r2(598 * k)}px"></span><span class="touch" id="${id}-t2" style="left:${r2(268 * k)}px;top:${r2(600 * k)}px"></span><span class="touch" id="${id}-t3" style="left:${r2(268 * k)}px;top:${r2(668 * k)}px"></span>
    <img class="fimg" id="${id}-sw" src="${R('well-record2-m')}" style="width:${sw}px;opacity:0" alt="">
    <span class="ring" id="${id}-r1" style="left:${r2(22 * k)}px;top:${r2(198 * k)}px;width:${r2(100 * k)}px;height:${r2(46 * k)}px;opacity:0"></span>
    <span class="ring" id="${id}-r2" style="left:${r2(210 * k)}px;top:${r2(198 * k)}px;width:${r2(80 * k)}px;height:${r2(46 * k)}px;opacity:0"></span>`
  const side = `<div class="side" style="left:540px;top:560px"><span class="chip big" id="${id}-c1">${ic('check')}목·어깨</span><span class="chip big" id="${id}-c2">${ic('check')}허리</span><span class="chip big hot" id="${id}-c3">고객 반응 · 좋아요</span></div>`
  realPhone(t, R('well-record-m'), { sw, left: 70, top: 300, inner, extra: side + H([{ at: t + 0.1, text: '몇 번만 누르면 *기록 끝*', size: 's' }], { y: 225 }), shot: { bg: 'bgD', trans: 'fade' } })
  ;[[1, w('부위와', '4.3.1') - 0.3], [2, w('부위와', '4.3.1')], [3, w('부위와', '4.3.1') + 0.3]].forEach(([n, a]) => tw(`tl.fromTo('#${id}-t${n}', { scale: 0.4, opacity: 0.95 }, { scale: 1.6, opacity: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, ${r2(a)});`))
  const sw2 = w('반응을', '4.3.1') - 0.2
  tw(`tl.to('#${id}-sw', { opacity: 1, duration: 0.4 }, ${r2(sw2)});`)
  tw(`tl.to('#${id}-r1, #${id}-r2', { opacity: 1, duration: 0.3, stagger: 0.15 }, ${r2(sw2 + 0.4)});`)
  from(`#${id}-c1`, w('부위와', '4.3.1'), 'x: -50, opacity: 0', 0.8, 'expo.out'); from(`#${id}-c2`, w('부위와', '4.3.1') + 0.3, 'x: -50, opacity: 0', 0.8, 'expo.out')
  from(`#${id}-c3`, w('반응을', '4.3.1'), 'x: -50, opacity: 0', 0.8, 'expo.out') }
{ const t = c('4.4.0'), id = K.uid('cc')
  const html = `${H([{ at: t + 0.1, text: '다음 방문 때 *한눈에*', size: 's' }], { y: 230 })}
    <div class="mock well" id="${id}" style="top:380px"><div class="mh">${ic('user')}<span>고객 카드</span><em>예시 화면</em></div><div class="mb">
      <div class="row" id="${id}-a"><small>지난번 관리 부위</small><b>목·어깨 · 허리</b></div>
      <div class="row" id="${id}-b"><small>좋아하신 점</small><b>따뜻한 온도 · 꼼꼼한 상담</b></div>
      <div class="row" id="${id}-c"><small>이용권</small><span style="display:flex;align-items:center;gap:18px"><span class="bar"><i id="${id}-bar"></i></span><b>4 / 10회</b></span></div>
      <div class="row" id="${id}-d"><small>방문 기록</small><b>4회 · 다음 예정 10.15</b></div></div></div>`
  B.shot(t, html, { bg: 'bgD', trans: 'fade' })
  from(`#${id}`, t + 0.05, 'y: 80, opacity: 0', 0.9, 'expo.out')
  ;[['a', c('4.4.1')], ['b', c('4.4.2')], ['c', c('4.4.3')], ['d', w('방문', '4.4.3')]].forEach(([k, a]) => from(`#${id}-${k}`, a, 'x: -40, opacity: 0', 0.7, 'expo.out'))
  tw(`tl.fromTo('#${id}-bar', { scaleX: 0 }, { scaleX: 0.4, duration: 1.0, ease: 'power2.out', immediateRender: true }, ${r2(c('4.4.3') + 0.3)});`) }
realPhone(c('4.5.0'), R('well-retention-m'), { sw: 380, top: 300, head: H([{ at: c('4.5.0') + 0.1, text: '오늘 *챙길 고객*을 먼저', size: 's' }], { y: 225 }), shot: { bg: 'bgD', trans: 'fade' } })
{ const t = c('4.6.0'), id = K.uid('pf')
  const chips = [['이용 내역 확인', w('이용', '4.7.0')], ['방문 요청', w('방문을', '4.7.0')], ['새 상품·서비스', c('4.7.1')]]
  const side = `<div class="side" style="left:560px;top:600px">${chips.map(([l], i) => `<span class="chip big" id="${id}-${i}">${ic('check')}${l}</span>`).join('')}</div>`
  realPhone(t, R('well-welcome-m'), { sw: 380, left: 80, top: 300, extra: side + H([{ at: t + 0.1, text: '홈페이지 말고 *전용 플랫폼*', size: 's' }], { y: 225 }), shot: { bg: 'bgD', trans: 'fade' } })
  chips.forEach(([, a], i) => from(`#${id}-${i}`, a, 'x: -60, opacity: 0', 0.8, 'expo.out')) }
fzBefore(5, 1, '기록은 몇 번의 터치로', '고객에게는 전용 플랫폼')

// ━━ 3. 쌓인 데이터 → AI
{ const t = c('5.1.0')
  P.scene(t, [P.licon('ai', 360, t + 0.05), H([{ at: t + 0.1, text: '여기서 *끝이 아니에요*', size: 'm' }, { at: c('5.2.0'), text: '쌓인 데이터를<br>*AI가 살펴보고*', size: 'm' }], { y: 640 })], { bg: 'bgB', trans: 'fadeBlur' }) }
{ const t = c('5.3.0')
  const g = P.cards([{ ic: 'clock', label: '시간이 새는 곳', sub: '어디서 낭비되고 있는지', at: t + 0.05 }, { ic: 'user', label: '다시 챙길 고객', sub: '누구에게 먼저 연락할지', at: c('5.3.1') },
    { ic: 'target', label: '먼저 고칠 것', sub: '비용은 줄이고 · 매출 기회는 늘리고', at: c('5.3.2'), hl: true }], { y: 420 })
  P.scene(t, [P.eyebrow('AI가 알려 주는 것', 300, t + 0.05), g.html], { bg: 'bgA', trans: 'fade' }) }
K.browser(c('5.4.0'), { src: R('well-coach-pc'), url: 'Wellness AX · 오늘 이것만 해보세요', tag: REAL, top: 430, zoom: 1.3, panX: -180, panY: -140, d: 5.4,
  extra: H([{ at: c('5.4.0') + 0.1, text: '데이터를 뒤질 필요 *없이*', size: 's' }, { at: c('5.4.1'), text: '*우선순위*만 보고 결정', size: 's' }], { y: 250 }), shot: { bg: 'bgD', trans: 'fade' } })
fzBefore(6, 1, '우선순위만 보고 결정', 'AI가 정리해 둔 다음 할 일')

// ━━ 정리
{ const t = c('6.1.0')
  const g = P.cards([{ ic: 'memo', label: '현장에서 한 번 입력', at: w('현장에서', '6.2.0') }, { ic: 'link', label: '정보가 모두 이어지고', at: w('이어지고,', '6.2.0') - 0.3 }, { ic: 'ai', label: '다음 할 일을 알려 준다', at: c('6.2.1'), hl: true }], { y: 560 })
  P.scene(t, [H([{ at: t + 0.1, text: '업종은 달라도<br>*원리는 같아요*', size: 'm' }], { y: 290 }), g.html], { bg: 'bgB', trans: 'fade' }) }
{ const t = c('6.3.0')
  P.scene(t, [P.eyebrow('미래AI랩', 330, t + 0.05), H([{ at: t + 0.1, text: '대표님의 회사도<br>*이렇게* 바뀔 수 있어요', size: 'l' }, { at: c('6.4.0'), text: 'AI를 넣는 데서<br>끝내지 않고', size: 'l' }, { at: c('6.4.1'), text: '회사가 실제로<br>*더 잘 돌아가도록*', size: 'l' }], { y: 560 })], { bg: 'bgC', trans: 'fade' }) }
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(ENDV - 0.1, { eb: '다음 단계', card: '<span class="no">REAL PROJECTS</span><h3>우리 회사도<br>바뀔 수 있을까요?</h3><ul><li>3분 AX Fit 진단</li><li>miraeailab.com</li><li>무료 상담</li></ul>', shot: { trans: 'fade' } })

B.finish(r2(ENDV + 3.2))
