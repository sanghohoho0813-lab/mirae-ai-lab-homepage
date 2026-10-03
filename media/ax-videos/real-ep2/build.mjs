// 실제 프로젝트 2편 — 쑥뜸원(웰니스 매장)(녹음 1.1배 · 9:16 · 자막 포함)
// 스타일: 1편과 같다(lib/reels.mjs) — 먹색 바탕 + 구리색 포인트 · Pretendard · 들어올 때만 천천히.
// 흐름: 어떤 곳인지 → 기록을 하나로(실제 화면) → 오늘 챙길 고객(실제 화면) → 고객 전용 플랫폼(실제 화면)
//      → AI 계획 · 다음 사업 · 표준화 → 다른 이용권 매장 → 두 회사의 같은 원리 → 대표님은 우선순위만 보고 결정 → 로고
// ⚠️ 회사 이름은 밝히지 않는다. 실제 화면은 고객 이름을 ○○ 로 바꾸거나 흐리게 한 캡처로, 짧게만.
//    고객 카드 · 상품 화면은 예시 데이터로 다시 그렸다. 앞으로 할 일은 모두 '계획'으로 표기하고, 성과 숫자는 쓰지 않는다.
import { createReel, ic } from '../lib/reels.mjs'

const R = createReel('.', { title: '실제 프로젝트 2편 · 쑥뜸원(웰니스)', offset: 0.6, tail: 5 })
const { c, ce, w, scene, el, head, note, chip, card, cardIn, list, vflow, phone, browser, touch, strike, loop, mock } = R
const REALS = '../real-projects/assets/real'
const REAL = '실제 화면 · 고객 이름은 가렸습니다'
const EX = '화면 속 고객·상품은 예시 데이터입니다'

// ━━ 2편 제목
scene(0, `
  ${el(0.05, '02', { cls: 'abs bignum', a: 'fade', style: 'left:60px;top:300px' })}
  ${head({ eb: 'PROJECT 02', t: '쑥뜸원<br>*웰니스 매장*', size: 'h1', at: 0.2, y: 640 })}
  ${el(1.3, '단골 고객이 이용권으로 다니는 곳', { cls: 'abs p', style: 'left:72px;top:920px' })}`)

// 어떤 곳인지
{
  const t = c('1.2.0') - 0.1
  scene(t, `
  ${head({ eb: 'WHAT IT IS', t: '이용권으로<br>*정기적으로* 다니는 곳', at: t })}
  ${card(cardIn('spark', '쑥을 태워 몸을 따뜻하게', '관리해 주는 곳'), t + 0.4, { style: 'position:absolute;left:72px;top:580px;width:888px' })}
  ${el(c('1.2.2'), '이런 매장처럼', { cls: 'abs eyebrow', style: 'left:76px;top:800px' })}
  ${chip('마사지숍', w('마사지숍', '1.2.2'), { icon: 'hand', cls: 'abs', style: 'left:72px;top:850px' })}
  ${chip('피부관리실', w('피부', '1.2.2'), { icon: 'heart', cls: 'abs', style: 'left:340px;top:850px' })}
  ${chip('*이용권*', c('1.2.3'), { icon: 'ticket', cls: 'abs', style: 'left:72px;top:970px', hl: c('1.2.3') + 0.4 })}
  ${chip('*정기 방문*', c('1.2.4'), { icon: 'cal', cls: 'abs', style: 'left:330px;top:970px', hl: c('1.2.4') + 0.4 })}`)
}

// 기록만이 아니라 하나로 연결 — 흩어진 칩이 고객 카드 안으로 모인다
{
  const t = c('2.1.0') - 0.15, g = c('2.2.2') - 0.1
  const items = [['방문 기록', 'cal', w('방문', '2.2.0'), [110, 700], [560, 690]], ['이용권', 'ticket', w('이용권', '2.2.0'), [112, 806], [140, 800]], ['상담 내용', 'chatm', w('상담', '2.2.0'), [112, 912], [600, 880]], ['선호 부위 · 반응', 'heart', c('2.2.1'), [112, 1018], [380, 1010]]]
  scene(t, `
  ${strike('고객 정보 입력 · 기록', t + 0.1, ce('2.1.1') - 0.5, { cls: 'h3', style: 'position:absolute;left:72px;top:250px' })}
  ${el(c('2.1.1'), '어떤 프로그램이든 할 수 있어요', { cls: 'abs p', style: 'left:72px;top:320px' })}
  ${head({ t: '여기서는<br>*하나로* 연결합니다', at: c('2.2.0'), y: 420 })}
  ${card('', g, { a: 'fade', style: 'position:absolute;left:72px;top:660px;width:888px;height:480px', hl: g + 0.3 })}
  ${el(g + 0.9, `<span class="cic" style="width:150px;height:150px;border-radius:50%">${ic('user')}</span><b>고객 한 분의<br>기록</b>`, { cls: 'abs custone', a: 'scale', style: 'left:700px;top:760px' })}
  ${items.map(([lb, icn, at, [fx, fy], [sx, sy]]) => chip(lb, at, { icon: icn, cls: 'abs', style: `left:${sx}px;top:${sy}px`, mv: [g, g + 1.1, fx - sx, fy - sy] })).join('')}`)
}

// 실제 화면 — 몇 번만 누르면 기록
{
  const t = c('2.3.0') - 0.1, sw = w('누르면', '2.3.1') - 0.2
  const k = 412 / 780
  const inner = touch(Math.round(140 * k), Math.round(436 * k), sw + 0.45) + touch(Math.round(500 * k), Math.round(436 * k), sw + 0.85) + touch(Math.round(320 * k), Math.round(436 * k), sw + 1.25)
  scene(t, `
  ${head({ eb: 'TAP TO RECORD', t: '*몇 번만* 누르면 기록', at: t })}
  ${phone({ src: `${REALS}/well-record-m.jpg`, swaps: [{ src: `${REALS}/well-record2-m.jpg`, at: sw }], inner, at: t + 0.1, x: 72, y: 400, w: 440, h: 850 })}
  ${list([
    { t: '관리 부위', at: sw + 0.45, keep: true },
    { t: '고객 반응', at: sw + 0.85, keep: true },
    { t: '이용권 · 방문', at: sw + 1.25, keep: true },
  ], { x: 548, width: 412, y: 520, kind: 'check', gap: 46 })}
  ${note(REAL, t + 0.6)}`)
}

// 다음 방문 때 바로 보인다(예시 고객 카드)
{
  const t = c('2.3.2') - 0.1
  const rows = `
    ${el(c('2.3.3'), '<small>지난번 관리 부위</small><b>목·어깨 · 허리</b>', { cls: 'row', a: 'left' })}
    ${el(w('좋아하셨는지', '2.3.4'), '<small>좋아하신 점</small><b>따뜻한 온도</b>', { cls: 'row', a: 'left' })}
    ${el(w('바로', '2.3.4'), `<small>이용권</small><span style="display:flex;align-items:center;gap:16px">${R.bar(0.4, w('바로', '2.3.4') + 0.2, w('바로', '2.3.4') + 1.2)}<b>4 / 10회</b></span>`, { cls: 'row', a: 'left' })}`
  scene(t, `
  ${head({ eb: 'NEXT VISIT', t: '다음 방문 때<br>*바로* 보입니다', at: t })}
  ${mock({ theme: 'well', title: `${ic('user')}<span>김○○ 님 · 고객 카드</span>`, tag: '예시 화면', rows, at: t + 0.3, x: 120, y: 590, w: 840 })}
  ${note(EX, t + 0.6)}`)
}

// 기록 다음엔?
{
  const t = c('3.1.0') - 0.45
  scene(t, `${head({ eb: 'AFTER RECORDS', t: '기록 *다음*엔<br>뭘 할 수 있을까요?', size: 'h1', at: t + 0.1, y: 600 })}`)
}

// 실제 화면 — 오늘 챙길 고객 우선순위
{
  const t = c('3.2.0') - 0.1, pr = c('3.2.3')
  scene(t, `
  ${head({ eb: 'TODAY', t: '오늘 챙길 고객 *우선순위*', at: t })}
  ${phone({ src: `${REALS}/well-retention-m.jpg`, at: t + 0.1, x: 72, y: 400, w: 440, h: 850, kb: `${t},${ce('3.2.3')},1,0,0,1.06,-12,-24` })}
  ${list([
    { t: '방문 주기', at: w('방문', '3.2.0'), keep: true },
    { t: '이용권 상태', at: w('이용권', '3.2.0'), keep: true },
    { t: '상담 이후 행동', at: c('3.2.1'), keep: true },
  ], { x: 548, width: 412, y: 520, kind: 'chip', gap: 22 })}
  <svg class="abs draw" style="left:574px;top:810px;width:6px;height:110px" viewBox="0 0 6 110" preserveAspectRatio="none"><path d="M3 0V110" pathLength="1" data-draw="${c('3.2.2')},${c('3.2.2') + 0.6}"/></svg>
  ${el(pr - 0.2, `${ic('target')}오늘의 우선순위`, { cls: 'abs tagline', style: 'left:548px;top:940px' })}
  ${note(REAL, t + 0.6)}`)
}

// 일일이 찾지 않아도
{
  const t = c('3.3.0') - 0.1
  scene(t, `
  ${head({ eb: 'NO MORE SEARCHING', t: '직원이 *일일이*<br>찾지 않아도', at: t })}
  ${list([
    { icon: 'ticket', t: '이용권이 거의 끝난 고객', at: c('3.3.0') + 0.2 },
    { icon: 'cal', t: '다시 올 때가 된 고객', at: c('3.3.1') },
    { icon: 'chatm', t: '상담 후 아직 방문 전인 고객', at: c('3.3.2') },
  ], { y: 560, kind: 'card', gap: 24, dimPrev: false })}
  ${strike('장부에서 하나씩 찾기', c('3.3.3'), w('일일이', '3.3.4'), { cls: 'h3', style: 'position:absolute;left:72px;top:1120px;color:var(--ink2)' })}`)
}

// 실제 화면 — 고객 전용 플랫폼
{
  const t = c('4.1.0') - 0.1
  scene(t, `
  ${head({ eb: 'CUSTOMER PLATFORM', t: '고객에게는 *전용 플랫폼*', at: t })}
  ${phone({ src: `${REALS}/well-welcome-m.jpg`, at: t + 0.1, x: 72, y: 400, w: 420, h: 850, kb: `${t},${ce('4.1.4')},1,0,0,1.06,-10,-28` })}
  ${list([
    { t: '이용 내역 확인', at: c('4.1.1'), keep: true },
    { t: '남은 이용권', at: w('남은', '4.1.1'), keep: true },
    { t: '방문 요청', at: c('4.1.2'), keep: true },
    { t: '새 상품·서비스', at: c('4.1.3'), keep: true },
  ], { x: 524, width: 436, y: 520, kind: 'check', gap: 46 })}
  ${note(REAL, t + 0.6)}`)
}

// 계획 — 한 단계 더
{
  const t = c('5.1.0') - 0.15
  scene(t, `
  ${head({ eb: 'NEXT · PLAN', t: '데이터가 쌓이면<br>*한 단계* 더', at: t })}
  ${vflow([
    { icon: 'doc', t: '기록', sub: '몇 번의 터치로', at: t + 0.5, dim: c('5.1.1') },
    { icon: 'target', t: '오늘의 우선순위', sub: '지금 보여 드리는 것', at: t + 1.0, dim: c('5.1.1') },
    { icon: 'spark', t: 'AI 분석', sub: '다음 단계 · 계획', at: c('5.1.1'), hl: c('5.1.1') + 0.4 },
  ], { y: 580, h: 128, gap: 64 })}`)
}

// 계획 — AI 가 먼저 챙길 고객 · 매출 기회
{
  const t = c('5.2.0') - 0.1
  scene(t, `
  ${head({ eb: 'AI · PLAN', t: '먼저 챙길 고객과<br>*매출 기회*', at: t })}
  ${list([
    { icon: 'door', t: '이탈 가능성이 높은 고객', at: c('5.2.0') + 0.2 },
    { icon: 'repeat', t: '재방문으로 잘 이어지는 프로그램', at: c('5.2.1') },
  ], { y: 540, kind: 'card', gap: 22, dimPrev: false })}
  <svg class="abs draw" style="left:513px;top:860px;width:6px;height:60px" viewBox="0 0 6 60" preserveAspectRatio="none"><path d="M3 0V60" pathLength="1" data-draw="${c('5.2.2')},${c('5.2.2') + 0.5}"/></svg>
  ${card(cardIn('target', '대표님이 먼저 챙길 고객', '+ 매출 기회를 알려 드리기'), c('5.2.3'), { style: 'position:absolute;left:72px;top:940px;width:888px', hl: c('5.2.4') })}
  ${el(c('5.2.5'), `${ic('gear')}고도화 계획`, { cls: 'abs tagline', style: 'left:72px;top:1170px' })}`)
}

// 줄어드는 것 · 늘어나는 것
{
  const t = c('5.3.0') - 0.1
  scene(t, `
  ${head({ eb: 'OUTCOME', t: '줄어드는 것,<br>*늘어나는 것*', at: t })}
  ${card(cardIn('down', '놓치던 고객', '줄고'), c('5.3.0') + 0.2, { style: 'position:absolute;left:72px;top:580px;width:888px', dim: c('5.3.1') })}
  ${card(cardIn('up', '재방문 · 이용권 재등록 · 추가 구매', '늘어나고'), c('5.3.1'), { style: 'position:absolute;left:72px;top:780px;width:888px', hl: c('5.3.2') })}
  ${el(c('5.3.3'), `${ic('check')}성과로 이어집니다`, { cls: 'abs tagline', style: 'left:72px;top:1000px' })}`)
}

// 다음 사업 — 매장 밖에서도 다시 살 수 있게(예시 상품 화면)
{
  const t = c('6.1.0') - 0.15
  const rows = `
    ${el(w('화장품', '6.2.1'), `<span style="display:flex;align-items:center;gap:16px">${ic('bottle')}쑥 화장품</span><span class="btn">다시 구매</span>`, { cls: 'row', a: 'left' })}
    ${el(w('생활', '6.2.1'), `<span style="display:flex;align-items:center;gap:16px">${ic('box')}생활 상품</span><span class="btn">다시 구매</span>`, { cls: 'row', a: 'left' })}
    ${el(c('6.2.2'), '<small>매장 밖에서도</small><b>집으로 받기</b>', { cls: 'row', a: 'left' })}`
  scene(t, `
  ${head({ eb: 'NEXT BUSINESS', t: '매장 밖에서도<br>*다시 살 수 있게*', at: t })}
  ${mock({ theme: 'well', title: `${ic('store')}<span>고객 전용 플랫폼 · 상품</span>`, tag: '예시 화면', rows, at: c('6.2.0'), x: 120, y: 590, w: 840 })}
  ${el(c('6.2.4'), `${ic('link')}연결할 계획`, { cls: 'abs tagline', style: 'left:120px;top:1080px' })}
  ${note(EX, c('6.2.0') + 0.5)}`)
}

// 표준화 — 본점 노하우를 2호점 · 가맹점에 그대로
{
  const t = c('6.3.0') - 0.1, ln = c('6.3.3')
  scene(t, `
  ${head({ eb: 'STANDARDIZE', t: '본점 노하우를<br>*표준화*해서 그대로', at: t })}
  ${card(cardIn('store', '본점 · 운영 노하우'), c('6.3.1'), { style: 'position:absolute;left:72px;top:560px;width:888px' })}
  ${card(cardIn('layers', '데이터 · 시스템으로 표준화'), c('6.3.2'), { style: 'position:absolute;left:72px;top:760px;width:888px', hl: c('6.3.2') + 0.5 })}
  <svg class="abs draw" style="left:72px;top:900px;width:888px;height:100px" viewBox="0 0 888 100"><path d="M444 0V40H216V100M444 40H672V100" pathLength="1" data-draw="${ln - 0.2},${ln + 0.6}"/></svg>
  ${card(`<div class="mini">${ic('branch')}<b>2호점</b></div>`, c('6.3.0') + 0.3, { style: 'position:absolute;left:72px;top:1000px;width:432px' })}
  ${card(`<div class="mini">${ic('branch')}<b>가맹점</b></div>`, w('가맹점', '6.3.0'), { style: 'position:absolute;left:528px;top:1000px;width:432px' })}`)
}

// 프로그램이 아니라 사업이 커지는 기반
{
  const t = c('6.4.0') - 0.1
  scene(t, `
  ${el(t + 0.05, 'NOT JUST A PROGRAM', { cls: 'abs eyebrow', style: 'left:72px;top:420px' })}
  ${strike('매장 하나 편하게 운영하는 프로그램', t + 0.2, w('아니라', '6.4.1'), { style: 'position:absolute;left:72px;top:490px', cls: 'h3' })}
  ${head({ t: '사업 자체가<br>*커질 수 있는* 기반', size: 'h1', at: c('6.4.2'), y: 620 })}
  ${el(c('6.4.2') + 0.6, '고객과 계속 이어지면서', { cls: 'abs p', style: 'left:72px;top:880px' })}`)
}

// 같은 방식 — 이용권 매장이라면
{
  const t = c('7.1.0') - 0.1, all = c('7.1.4')
  const m = (icn, lb, at, x, y, o = {}) => card(`<div class="mini">${ic(icn)}<b>${lb}</b></div>`, at, { style: `position:absolute;left:${x}px;top:${y}px;width:432px`, hl: o.hl, dim: o.dim })
  scene(t, `
  ${head({ eb: 'SAME MODEL', t: '이용권 매장이라면<br>*똑같이* 적용', at: t })}
  ${m('spark', '쑥뜸원', t + 0.3, 72, 570, { dim: c('7.1.1') })}
  ${m('heart', '피부관리실', w('피부', '7.1.1'), 528, 570, { hl: all })}
  ${m('hand', '마사지숍', w('마사지숍', '7.1.1'), 72, 790, { hl: all + 0.1 })}
  ${m('users', '필라테스', c('7.1.2'), 528, 790, { hl: all + 0.2 })}
  ${chip('이용권을 끊고 다시 오는 매장', c('7.1.3'), { icon: 'ticket', cls: 'abs', style: 'left:72px;top:1040px' })}`)
}

// 업종은 달라도 원리는 같다 — 순환도
{
  const t = c('8.1.0') - 0.25, e = c('8.3.0')
  scene(t, loop({
    nodes: [
      { t: '한 번 입력', icon: 'pen', at: c('8.2.0') },
      { t: '다음 업무로', icon: 'flow', at: w('다음', '8.2.1') },
      { t: '데이터 쌓임', icon: 'db', at: c('8.2.2') },
      { t: '분석', icon: 'ai', at: w('분석', '8.2.2') },
      { t: '다음 할 일', icon: 'target', at: c('8.2.3') },
      { t: '자동 처리', icon: 'gear', at: w('자동', '8.2.4'), hl: w('자동', '8.2.4') + 0.4 },
    ],
    cx: 540, cy: 780, rx: 290, ry: 420, drawAt: c('8.2.0') - 0.2, drawEnd: w('자동', '8.2.4') + 0.3, dot: [w('자동', '8.2.4') + 0.3, e + 0.4, 360],
    center: `${el(t + 0.1, 'CLOSED LOOP', { cls: 'eyebrow' })}${el(t + 0.25, '업종은 달라도<br>*원리는 같습니다*', { cls: 'h3' })}`,
  }))
}

// 두 회사, 같은 원리
{
  const t = c('8.3.0') - 0.1
  const kv = (icn, txt, at) => el(at, `${ic(icn)}<span>${txt}</span>`, { cls: 'kv', a: 'left' })
  scene(t, `
  ${head({ eb: 'TWO COMPANIES', t: '두 회사,<br>*같은 원리*', at: t })}
  ${card(`<div class="ci" style="padding-bottom:10px"><span class="cic">${ic('truck')}</span><div><b>의료폐기물 수거·운반</b></div></div><div class="kvs">${kv('down', '시간과 비용은 줄이고', c('8.3.1'))}${kv('up', '처리 능력 · 새로운 매출은 키우고', c('8.3.2'))}</div>`, t + 0.3, { style: 'position:absolute;left:72px;top:560px;width:888px', dim: c('8.3.3') })}
  ${card(`<div class="ci" style="padding-bottom:10px"><span class="cic">${ic('spark')}</span><div><b>쑥뜸원(웰니스)</b></div></div><div class="kvs">${kv('down', '이탈은 줄이고', w('이탈', '8.3.3'))}${kv('up', '재방문 · 재구매는 늘리고', c('8.3.4'))}</div>`, c('8.3.3'), { style: 'position:absolute;left:72px;top:880px;width:888px', hl: c('8.3.4') + 0.3 })}`)
}

// 대표님한테는?
{
  const t = c('9.1.0') - 0.45
  scene(t, `${head({ eb: 'FOR YOU', t: '대표님한테는<br>뭐가 *달라질까요?*', size: 'h1', at: t + 0.1, y: 600 })}`)
}

// 실제 화면(PC) — 우선순위와 근거만 보고 결정
{
  const t = c('9.2.0') - 0.1
  scene(t, `
  ${head({ eb: 'DECISION', t: '우선순위와 *근거*만 보고', at: t })}
  ${strike('데이터를 직접 뒤지기', t + 0.2, w('필요', '9.2.0'), { cls: 'h3', style: 'position:absolute;left:72px;top:420px;color:var(--ink2)' })}
  ${browser({ src: `${REALS}/well-coach-pc.jpg`, at: c('9.2.1') - 0.2, x: 72, y: 560, w: 888, h: 640, url: '오늘 이것만 해보세요', kb: `${c('9.2.1') - 0.2},${ce('9.2.2') + 0.5},1.3,-230,-110,1.45,-300,-170` })}
  ${note(REAL, c('9.2.1'))}`)
}

// 대표님 회사도 바뀔 수 있어요
{
  const t = c('9.3.0') - 0.3
  scene(t, `${head({ eb: 'YOUR COMPANY', t: '대표님 회사도<br>*바뀔 수 있어요*', size: 'h1', at: t + 0.1, y: 600 })}`)
}

// 끝 — 미래AI랩
{
  const t = c('9.4.0') - 0.1, end = R.SPEECH_END + 0.3
  scene(t, `
  ${el(t + 0.05, '<img src="assets/logo.png" alt="미래AI랩">', { cls: 'logo-box', a: 'scale', style: 'left:290px;top:400px' })}
  ${el(c('9.4.1'), 'AI를 넣는 데서 끝내지 않고', { cls: 'abs p center-x', style: 'top:640px' })}
  ${el(c('9.4.2'), '회사가 더 잘 돌아가고<br>*성장하도록*', { cls: 'abs h2 center-x', style: 'top:720px' })}
  <div class="abs col center" style="left:140px;right:140px;top:980px;gap:20px">${el(end, '우리 회사는? 3분 AX Fit 진단', { cls: 'cta' })}${el(end + 0.2, 'miraeailab.com', { cls: 'cta sub' })}</div>`)
}

R.finish()
