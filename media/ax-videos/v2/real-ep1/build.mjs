// 실제 프로젝트 1편 — 의료폐기물 수거·운반 회사 · 영상 스타일 v2(9:16 · 1.13배 · 어두운/밝은 장면 교차 · 도형 7색)
// 장면표(D 어두움 / L 밝음):
//  1 D 후킹 — AI를 도입하면 뭐가 달라질까 · 기록 → 분석 → 지금 할 일
//  2 L REAL PROJECTS — 두 곳(번호 태그)          3 D PROJECT 01 — 병원 → 수거 → 운반 · 병원마다 다른 기준
//  4 L BEFORE — 같은 정보를 몇 번씩(번호 태그 5)  5 D SCATTERED — 50여 곳 · 105톤쯤 · 흩어진 정보 · 낭비
//  6 L NOW — 실제 화면(휴대폰) + 체크              7 D HOSPITAL PORTAL — 병원 요청 말풍선 · 당일 긴급 요청 감소
//  8 L SETTLEMENT — 계약·단가 → 청구 → 입금 → 미수금(목록 줄)
//  9 D AI — 수거량 · 자재 기록 → 다시 필요할 시점 → 주문 · 추가 매출
// 10 L NEXT · PLAN — 쌓일 데이터 → 동선·배차 고도화 계획   11 D GOAL — 체크 4
// 12 L NEXT BUSINESS — 순환도(허브 + 노드 6 + 도는 점)     13 D LONG TERM — 구독형 서비스(중장기 계획)
// 14 L 마무리 — 업무 개선(취소선) → 새로운 사업 → 로고 · 다음 편
// ⚠️ 회사 이름은 밝히지 않는다. 실제 화면은 업체·병원 이름을 ○○ 로 바꾼 캡처 한 장만 짧게. 숫자는 녹음에서 말한 것만.
import { createReel2, ic } from '../../lib/reels2.mjs'

const R = createReel2('.', { title: '실제 프로젝트 1편 · 의료폐기물 수거·운반' })
const { c, ce, w, scene, el, head, note, numtag, check, row, chip, bubble, node, nodeIn, card, cardIn, mini, strike, deco, tagline, lines, phone, loop, endCard } = R
const REAL = '실제 화면 · 업체·병원 이름은 가렸습니다'

// 1 D — 후킹
{
  const t = 0, b1 = c('1.2.0'), b2 = c('1.3.0'), b3 = c('1.3.1')
  scene(t, `
  ${deco('ring', 820, 140, 260, 'copper', 0.2)}${deco('disc', -90, 1180, 240, 'teal', 0.4)}
  ${head({ eb: 'REAL PROJECTS', t: 'AI를 도입하면<br>뭐가 *달라질까요?*', size: 'h1', at: 0.15, y: 300 })}
  ${node(nodeIn('doc', '기록을<br>디지털로'), b1 + 0.2, { x: 72, y: 720, w: 260, c: 'teal', dim: b2 })}
  ${node(nodeIn('ai', '데이터<br>분석'), b2, { x: 386, y: 720, w: 260, c: 'blue', dim: b3 })}
  ${node(nodeIn('target', '지금 할 일<br>알려 주기'), b3, { x: 700, y: 720, w: 260, c: 'copper', hl: c('1.3.2') })}
  ${lines([[332, 830, 386, 830, b2 - 0.4, b2], [646, 830, 700, 830, b3 - 0.4, b3]], b1)}
  ${el(b1 + 0.6, '기록은 *시작*일 뿐', { cls: 'abs h3', style: 'left:72px;top:1010px' })}`)
}

// 2 L — 두 곳
{
  const t = c('1.4.0') - 0.1
  scene(t, `
  ${deco('sq', 860, 1080, 220, 'violet', t + 0.3)}
  ${head({ eb: 'REAL PROJECTS', t: '지금 개발 중인<br>*두 곳*을 보여 드려요', at: t })}
  ${numtag(1, '의료폐기물 수거·운반', w('두', '1.4.2'), { y: 660, w: 820, c: 'teal', sub: '1편 · 일반 중소기업 사례', hl: c('1.4.3') })}
  ${numtag(2, '쑥뜸원(웰니스 매장)', w('두', '1.4.2') + 0.35, { y: 880, w: 820, c: 'violet', sub: '2편 · 소상공인 사례', dim: c('1.4.3') })}
  ${note('회사 이름은 밝히지 않고 업종만 소개합니다', c('1.4.1'))}`, { light: true })
}

// 3 D — PROJECT 01 · 병원마다 다른 기준
{
  const t = c('2.1.0') - 0.5, k = c('2.2.0')
  scene(t, `
  ${deco('ring', 870, 1080, 260, 'rose', t + 0.2)}
  ${head({ eb: 'PROJECT 01 · 일반 중소기업 사례', t: '의료폐기물<br>*수거·운반* 회사', at: t + 0.1 })}
  ${node(nodeIn('building', '병원'), w('병원', '2.1.0'), { x: 72, y: 560, w: 250, c: 'rose' })}
  ${node(nodeIn('truck', '수거'), w('수거하고', '2.1.1'), { x: 391, y: 560, w: 250, c: 'teal' })}
  ${node(nodeIn('route', '운반'), w('운반하는', '2.1.1'), { x: 710, y: 560, w: 250, c: 'copper' })}
  ${lines([[322, 650, 391, 650, w('수거하고', '2.1.1') - 0.3, w('수거하고', '2.1.1')], [641, 650, 710, 650, w('운반하는', '2.1.1') - 0.3, w('운반하는', '2.1.1')]], t)}
  ${row('수거 주기', '병원마다 다름', k + 0.1, { y: 830, w: 888, c: 'teal' })}
  ${row('정산 기준', '월정액', c('2.2.1'), { y: 960, w: 888, c: 'blue' })}
  ${row('정산 기준', '무게당 단가', c('2.2.2'), { y: 1090, w: 888, c: 'amber' })}
  ${tagline('꽤 복잡해요', c('2.2.3'), { y: 1220, icon: 'alert' })}`)
}

// 4 L — BEFORE
{
  const t = c('3.1.0') - 0.2
  const it = [
    ['현장 직원이 *수기*로', c('3.1.1'), 'teal'], ['사진 찍고 저녁에 정리', c('3.1.2'), 'blue'], ['사무실에 카톡으로', c('3.1.3'), 'amber'],
    ['사무실에서 다시 확인', c('3.2.0'), 'violet'], ['엑셀에 *옮겨 적기*', c('3.2.1'), 'copper'],
  ]
  scene(t, `
  ${deco('disc', 880, 180, 220, 'amber', t + 0.3)}
  ${head({ eb: 'BEFORE', t: '같은 정보를<br>*몇 번씩* 옮겨 적기', at: t + 0.05 })}
  ${it.map(([s, a, col], i) => numtag(i + 1, s, a, { y: 560 + i * 140, w: 760, c: col, dim: it[i + 1]?.[1] })).join('')}
  ${lines(it.slice(1).map(([, a], i) => [101, 560 + i * 140 + 96, 101, 560 + (i + 1) * 140 + 2, a - 0.35, a]), t, { width: 3 })}`, { light: true })
}

// 5 D — SCATTERED · 낭비
{
  const t = c('3.3.0'), sc = c('3.3.3'), lost = c('3.4.0')
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'blue', t + 0.2)}
  ${head({ eb: 'SCATTERED WORK', t: '정보가<br>*여러 곳*에 흩어져', at: t })}
  ${card(cardIn('building', '50여 곳', '거래처'), t + 0.3, { x: 72, y: 560, w: 432, ic: 'blue' })}
  ${card(cardIn('truck', '105톤쯤', '한 달 수거량'), c('3.3.1'), { x: 528, y: 560, w: 432, ic: 'teal' })}
  ${chip('수거', w('수거부터', '3.3.2'), { x: 200, y: 800, c: 'teal', mv: [sc, sc + 1.4, -110, -10] })}
  ${chip('자재', w('자재', '3.3.2'), { x: 560, y: 810, c: 'blue', mv: [sc, sc + 1.4, 150, -20] })}
  ${chip('정산', w('정산', '3.3.2'), { x: 230, y: 920, c: 'amber', mv: [sc, sc + 1.4, -130, 40] })}
  ${chip('미수금', w('미수금', '3.3.2'), { x: 540, y: 930, c: 'rose', mv: [sc, sc + 1.4, 170, 50] })}
  ${card(`<div class="ci"><span class="cic">${ic('clock')}</span><div><small>현장과 본사 사이</small><b>낭비되는 *노력과 시간*</b></div></div>`, lost, { x: 72, y: 1080, w: 888, hiedge: true, ic: 'copper' })}
  ${note('숫자는 이 회사가 직접 알려 준 규모입니다', t + 0.6, { y: 1262 })}`)
}

// 6 L — NOW · 실제 화면
{
  const t = c('4.1.0') - 0.1, fl = c('4.1.3')
  scene(t, `
  ${deco('sq', 900, 240, 200, 'teal', t + 0.3)}
  ${head({ eb: 'NOW', t: '현장에서 *한 번*만 입력', at: t })}
  ${phone({ src: 'assets/real/ops-collection-m.jpg', ratio: 892 / 412, at: t + 0.1, x: 72, y: 410, w: 430, kb: `${t},${ce('4.1.3')},1,0,0,1.07,-12,-26` })}
  ${check('수거 이력', w('수거', '4.1.1'), { x: 540, y: 520, c: 'teal' })}
  ${check('자재 · 재고', w('자재', '4.1.1'), { x: 540, y: 640, c: 'blue' })}
  ${check('정산 정보', c('4.1.2'), { x: 540, y: 760, c: 'copper' })}
  ${lines([[569, 830, 569, 940, fl - 0.2, fl + 0.6]], t)}
  ${tagline('하나의 흐름으로', fl + 0.3, { x: 540, y: 960, icon: 'flow' })}
  ${note(REAL, t + 0.6)}`, { light: true })
}

// 7 D — 병원 전용 포털
{
  const t = c('4.2.0'), dn = c('4.3.0')
  scene(t, `
  ${deco('disc', 880, 1100, 260, 'rose', t + 0.2)}
  ${head({ eb: 'HOSPITAL PORTAL', t: '병원은 *전용 포털*에서<br>미리 요청', at: t })}
  ${bubble('“다음 주 *추가 수거* 부탁드려요”', w('추가', '4.2.1') - 0.2, { x: 72, y: 600, c: 'rose' })}
  ${bubble('“용기 미리 주문할게요”', w('자재', '4.2.1'), { x: 200, y: 740, c: 'rose' })}
  ${chip('당일 긴급 수거·자재 요청 ↓', dn + 0.2, { x: 72, y: 920, big: true, c: 'green', hl: c('4.3.2') })}
  ${note('말풍선은 예시 문장입니다', t + 0.8)}`)
}

// 8 L — 정산
{
  const t = c('4.4.0') - 0.1, one = c('4.4.3')
  scene(t, `
  ${deco('ring', 860, 1120, 220, 'amber', t + 0.3)}
  ${head({ eb: 'SETTLEMENT', t: '정산도<br>*한 곳*에서 확인', at: t })}
  ${row('계약 조건 · 단가 이력', '병원별 기준', t + 0.5, { y: 580, w: 888, c: 'blue' })}
  ${row('청구', '', w('청구', '4.4.2'), { y: 740, w: 888, c: 'amber', hl: one })}
  ${row('입금', '', w('입금', '4.4.2'), { y: 900, w: 888, c: 'green', hl: one + 0.12 })}
  ${row('미수금', '', w('미수금', '4.4.2'), { y: 1060, w: 888, c: 'copper', hl: one + 0.24 })}`, { light: true })
}

// 9 D — AI · 다시 필요할 시점
{
  const t = c('5.1.0') - 0.45, k = c('5.2.0'), sale = c('5.3.0')
  scene(t, `
  ${deco('ring', 840, 160, 260, 'violet', t + 0.2)}
  ${head({ eb: 'AND THEN, AI', t: '그럼 *AI*는<br>여기서 뭘 할까요?', at: t + 0.1 })}
  ${chip('수거량', k, { x: 72, y: 560, c: 'teal' })}
  ${chip('자재 사용 기록', w('자재', '5.2.1'), { x: 300, y: 560, c: 'blue' })}
  ${lines([[516, 650, 516, 720, w('분석', '5.2.1'), w('분석', '5.2.1') + 0.5]], k)}
  ${node(`${ic('spark')}○○병원 · 용기가<br>*다시 필요할 시점*<small>최근 수거량 · 자재 사용 기록 기준</small>`, c('5.2.2'), { x: 72, y: 730, w: 888, c: 'copper', hiNode: true })}
  ${chip('실제 주문', sale, { x: 72, y: 1050, c: 'amber' })}
  ${el(sale + 0.3, '→', { cls: 'abs h3', style: 'left:330px;top:1052px;color:var(--hi)', a: 'fade' })}
  ${chip('추가 매출', w('추가', '5.3.1'), { x: 400, y: 1050, c: 'green', big: true })}
  ${note('화면 속 병원 이름은 예시입니다', c('5.2.2') + 0.5)}`)
}

// 10 L — 계획: 동선·배차
{
  const t = c('5.4.0') - 0.1, r = c('5.4.3')
  scene(t, `
  ${deco('disc', 900, 140, 220, 'teal', t + 0.3)}
  ${head({ eb: 'NEXT · PLAN', t: '데이터가 쌓이면<br>*동선과 배차*까지', at: t })}
  ${numtag(1, '병원별 수거 패턴', t + 0.4, { y: 560, w: 760, c: 'teal' })}
  ${numtag(2, '갑작스러운 추가 요청', c('5.4.1'), { y: 690, w: 760, c: 'rose' })}
  ${numtag(3, '차량 · 기사 운영 데이터', c('5.4.2'), { y: 820, w: 760, c: 'blue' })}
  ${card(cardIn('route', '같은 인원·차량으로 *더 많은 거래처*', '동선과 배차를 더 효율적으로'), r, { x: 72, y: 980, w: 888, hiedge: true, ic: 'copper' })}
  ${tagline('고도화 계획', c('5.4.7'), { y: 1200, icon: 'gear' })}`, { light: true })
}

// 11 D — 목표
{
  const t = c('6.1.0') - 0.1
  const it = [['행정 업무 · 불필요한 이동 *줄이기*', c('6.2.0') + 0.2, 'teal'], ['빠지는 정산 *막기*', c('6.2.2'), 'blue'], ['같은 인력으로 *더 많은 일*', c('6.2.3'), 'amber'], ['*새로운 매출*까지', c('6.2.4'), 'copper']]
  scene(t, `
  ${deco('ring', 860, 1100, 260, 'copper', t + 0.2)}
  ${head({ eb: 'GOAL', t: '결국 목표는<br>*분명*해요', at: t })}
  ${it.map(([s, a, col], i) => check(s, a, { y: 580 + i * 130, c: col, dim: it[i + 1]?.[1] })).join('')}`)
}

// 12 L — 다음 사업 순환도
{
  const t = c('7.1.0') - 0.2, e = c('7.2.4')
  scene(t, `
  ${head({ eb: 'NEXT BUSINESS · PLAN', t: '수거 일정에 *공급*을 더해', at: t, y: 240 })}
  ${loop({
    nodes: [
      { t: '수거', icon: 'truck', at: t + 0.5, c: 'teal' },
      { t: '사용 기록', icon: 'db', at: t + 0.8, c: 'blue' },
      { t: '시점 추천', icon: 'spark', at: w('추천', '7.2.2') - 0.3, c: 'violet' },
      { t: '주문', icon: 'receipt', at: w('주문', '7.2.3'), c: 'amber' },
      { t: '함께 공급', icon: 'box', at: w('공급', '7.2.3') - 0.2, c: 'green' },
      { t: '새로운 매출', icon: 'coin', at: e, c: 'copper', hl: e + 0.4 },
    ],
    cx: 540, cy: 820, rx: 300, ry: 340, at: t + 0.3, drawAt: t + 0.4, drawEnd: e + 0.3, orbitAt: e + 0.3, hubText: '반복해서<br>쓰는 소모품', hubAt: c('7.2.0'),
  })}`, { light: true })
}

// 13 D — 구독형 서비스(중장기)
{
  const t = c('7.3.0') - 0.1, f = c('7.3.2')
  scene(t, `
  ${deco('sq', 880, 220, 200, 'blue', t + 0.3)}
  ${head({ eb: 'LONG TERM · PLAN', t: '다른 업체도 쓰는<br>*구독형 서비스*로', at: t })}
  ${card(cardIn('db', '운영 데이터 + 노하우', '이 회사 현장에서 쌓인 것'), t + 0.4, { x: 72, y: 560, w: 888, ic: 'copper', hl: c('7.3.1') })}
  ${lines([{ d: 'M516 740 V800 H208 V860 M516 800 V860 M516 800 H824 V860', t0: f - 0.3, t1: f + 0.6 }], t)}
  ${['teal', 'blue', 'violet'].map((col, i) => card(mini('building', '의료폐기물<br>업체'), f + i * 0.25, { x: 72 + i * 304, y: 860, w: 280, ic: col })).join('')}
  ${tagline('구독형 서비스 · 중장기 계획', c('7.3.3'), { y: 1150, icon: 'repeat' })}`)
}

// 14 L — 마무리 → 로고 · 다음 편
{
  const t = c('8.1.0') - 0.2, end = R.VOICE_END + 0.1
  scene(t, `
  ${deco('ring', 840, 120, 260, 'copper', t + 0.2)}${deco('disc', -80, 1150, 240, 'teal', t + 0.4)}
  ${el(t + 0.05, 'FROM PROJECT TO BUSINESS', { cls: 'abs eyebrow', out: end, style: 'left:72px;top:420px' })}
  ${el(t + 0.2, `<span class="st">한 회사의 업무 개선<span class="sl" data-strike="${w('끝나지', '8.1.1')}"></span></span>`, { cls: 'abs h3 strike-wrap dimtxt', out: end, style: 'left:72px;top:490px' })}
  ${el(c('8.1.2'), '현장의 운영 방식을<br>*새로운 사업*으로', { cls: 'abs h1 long', out: end, style: 'left:72px;top:610px' })}
  ${endCard({ at: end, line: '다음 편 · *쑥뜸원*', sub: '이용권 매장은 어떻게 달라지고 있을까요?', cta: ['우리 회사는? 3분 AX Fit 진단', 'miraeailab.com'] })}`, { light: true })
}

R.finish()
