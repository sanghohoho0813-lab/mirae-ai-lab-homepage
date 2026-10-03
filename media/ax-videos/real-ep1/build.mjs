// 실제 프로젝트 1편 — 의료폐기물 수거·운반 회사(녹음 1.1배 · 9:16 · 자막 포함)
// 스타일: 먹색 바탕 + 구리색 포인트 · Pretendard · 들어올 때만 천천히(lib/reels.mjs).
// 흐름: 질문(후킹) → 예전 방식(문제) → 지금(한 번 입력 · 병원 포털 · 정산) → AI(시점 알림) → 계획(배차 · 다음 사업 · 구독형) → 정리 · 다음 편
// ⚠️ 회사 이름은 밝히지 않는다. 실제 화면은 한 번(수거 입력, 업체·병원 이름을 ○○ 로 바꾼 캡처)만 짧게.
//    나머지 앱 모양 화면은 예시 데이터로 다시 그렸다. 앞으로 할 일은 모두 '계획'으로 표기한다.
//    숫자는 녹음에서 말한 것(거래처 50여 곳 · 한 달 105톤쯤)만 쓴다.
import { createReel, ic } from '../lib/reels.mjs'

const R = createReel('.', { title: '실제 프로젝트 1편 · 의료폐기물 수거·운반', offset: 0.6, tail: 5 })
const { c, ce, w, scene, el, head, note, chip, card, cardIn, list, vflow, timeline, phone, touch, strike, loop, mock, endCard } = R
const REAL = '실제 화면 · 업체·병원 이름은 가렸습니다'
const EX = '화면 속 병원·수치는 예시 데이터입니다'

// ① 후킹
scene(0, `
  ${head({ eb: 'REAL PROJECTS', t: 'AI를 도입하면<br>뭐가 *달라질까요?*', size: 'h1', at: 0.15, y: 560 })}
  ${el(1.2, '', { cls: 'abs', a: 'fade', style: 'left:72px;top:860px;width:120px;height:6px;border-radius:3px;background:var(--acc)' })}`)

// 기록은 시작일 뿐 → 분석 → 지금 할 일
scene(c('1.2.0') - 0.1, `
  ${head({ eb: 'BEYOND RECORDS', t: '기록은<br>*시작*일 뿐입니다', at: c('1.2.0') })}
  ${vflow([
    { icon: 'doc', t: '기록을 디지털로', sub: '여기까지는 시작', at: c('1.2.0') + 0.5, dim: c('1.3.0') },
    { icon: 'ai', t: '그 데이터를 분석해서', at: c('1.3.0'), dim: c('1.3.1') },
    { icon: 'target', t: '지금 할 일까지 알려 주기', sub: '지금 만들고 있는 것', at: c('1.3.1'), hl: c('1.3.2') },
  ], { y: 600, h: 128, gap: 70 })}`)

// 두 곳만 보여 드릴게요
scene(c('1.4.0'), `
  ${head({ eb: 'REAL PROJECTS', t: '지금 개발 중인<br>*두 곳*의 변화', at: c('1.4.0') })}
  ${card(cardIn('truck', '의료폐기물 수거·운반', '1편 · 이번 영상'), w('두', '1.4.2'), { style: 'position:absolute;left:72px;top:600px;width:888px', hl: c('1.4.3') })}
  ${card(cardIn('heart', '쑥뜸원(웰니스 매장)', '2편'), w('두', '1.4.2') + 0.3, { style: 'position:absolute;left:72px;top:800px;width:888px', dim: c('1.4.3') })}
  ${note('회사 이름은 밝히지 않고 업종만 소개합니다', c('1.4.1'))}`)

// ━━ 1편 제목
const T1 = ce('1.4.3') + 0.25
scene(T1, `
  ${el(T1 + 0.05, '01', { cls: 'abs bignum', a: 'fade', style: 'left:60px;top:300px' })}
  ${head({ eb: 'PROJECT 01', t: '의료폐기물<br>*수거·운반*', size: 'h1', at: T1 + 0.2, y: 640 })}
  ${el(c('2.1.1'), '병원에서 나오는 의료폐기물을<br>수거하고 운반하는 회사', { cls: 'abs p', style: 'left:72px;top:920px' })}`)

// 왜 복잡할까 — 병원마다 수거 주기 · 정산 기준
scene(c('2.2.0'), `
  ${head({ eb: 'WHY IT IS COMPLEX', t: '병원마다<br>기준이 *제각각*', at: c('2.2.0') })}
  ${card(cardIn('cal', '수거 주기', '병원마다 다릅니다'), c('2.2.0') + 0.5, { style: 'position:absolute;left:72px;top:590px;width:888px', hl: c('2.2.3') })}
  ${el(c('2.2.1'), '정산 기준', { cls: 'abs eyebrow', style: 'left:76px;top:800px' })}
  ${card(cardIn('cal', '월정액'), c('2.2.1') + 0.15, { style: 'position:absolute;left:72px;top:850px;width:432px', hl: c('2.2.3') })}
  ${card(cardIn('coin', '무게당 단가'), c('2.2.2'), { style: 'position:absolute;left:528px;top:850px;width:432px', hl: c('2.2.3') })}
  ${el(c('2.2.3'), `${ic('alert')}꽤 복잡해요`, { cls: 'abs tagline', style: 'left:72px;top:1060px' })}`)

// ② 예전 방식 — 같은 정보를 몇 번씩
scene(c('3.1.0') - 0.15, `
  ${head({ eb: 'BEFORE', t: '같은 정보를<br>*몇 번씩* 옮겨 적기', at: c('3.1.0') - 0.1 })}
  ${timeline([
    { t: '현장 직원이 *수기*로 적고', at: c('3.1.1') },
    { t: '사진을 찍어서', at: w('사진', '3.1.2') },
    { t: '저녁에 정리해', at: w('저녁', '3.1.2') },
    { t: '사무실에 카톡으로', at: c('3.1.3') },
    { t: '사무실에서 다시 확인하고', at: c('3.2.0') },
    { t: '엑셀에 *옮겨 적기*', at: c('3.2.1'), keep: true },
  ], { y: 580, step: 112, size: 40 })}`)

// 흩어진 정보
{
  const t = c('3.3.0'), sc = c('3.3.3')
  scene(t, `
  ${head({ eb: 'SCATTERED', t: '정보가<br>*여러 곳*에 흩어져', at: t })}
  ${card(`<div class="ci"><span class="cic">${ic('building')}</span><div><small>거래처</small><b>50여 곳</b></div></div>`, t + 0.3, { style: 'position:absolute;left:72px;top:580px;width:432px' })}
  ${card(`<div class="ci"><span class="cic">${ic('truck')}</span><div><small>한 달 수거</small><b>105톤쯤</b></div></div>`, c('3.3.1'), { style: 'position:absolute;left:528px;top:580px;width:432px' })}
  ${chip('수거', w('수거부터', '3.3.2'), { icon: 'truck', cls: 'abs', style: 'left:250px;top:860px', mv: [sc, sc + 1.6, -150, -20] })}
  ${chip('자재', w('자재', '3.3.2'), { icon: 'box', cls: 'abs', style: 'left:560px;top:880px', mv: [sc, sc + 1.6, 170, -40] })}
  ${chip('정산', w('정산', '3.3.2'), { icon: 'receipt', cls: 'abs', style: 'left:240px;top:1010px', mv: [sc, sc + 1.6, -140, 70] })}
  ${chip('미수금', w('미수금', '3.3.2'), { icon: 'alert', cls: 'abs', style: 'left:540px;top:1030px', mv: [sc, sc + 1.6, 190, 80] })}
  ${note('숫자는 이 회사 대표님이 직접 알려 주신 규모입니다', t + 0.6)}`)
}

// 현장 ↔ 본사 — 낭비되는 노력과 시간
{
  const t = c('3.4.0')
  scene(t, `
  ${head({ eb: 'LOST TIME', t: '현장과 본사 사이<br>*낭비되는* 시간', at: t })}
  ${card(cardIn('truck', '현장'), t + 0.3, { style: 'position:absolute;left:72px;top:600px;width:360px' })}
  ${card(cardIn('building', '본사'), t + 0.5, { style: 'position:absolute;left:600px;top:600px;width:360px' })}
  <svg class="abs draw" style="left:432px;top:640px;width:168px;height:60px" viewBox="0 0 168 60"><path d="M10 20H158M10 40H158" pathLength="1" data-draw="${t + 0.6},${t + 1.4}"/></svg>
  ${list([
    { t: '수기 → 카톡 → 엑셀', at: w('낭비', '3.4.1') - 0.2 },
    { t: '다시 확인 · 다시 옮겨 적기', at: w('노력', '3.4.1') },
    { t: '*노력과 시간*이 새는 곳', at: w('많았어요', '3.4.1') - 0.1, hl: w('많았어요', '3.4.1') + 0.3 },
  ], { y: 820, kind: 'chip', gap: 20 })}`)
}

// ③ 지금 — 현장에서 한 번 입력(실제 화면)
{
  const t = c('4.1.0'), fl = c('4.1.4')
  scene(t - 0.1, `
  ${head({ eb: 'NOW', t: '현장에서 *한 번*만 입력', at: t - 0.05, size: 'h2' })}
  ${phone({ src: '../real-projects/assets/real/ops-collection-m.jpg', at: t + 0.1, x: 72, y: 400, w: 440, h: 850, kb: `${t},${ce('4.1.4')},1,0,0,1.07,-14,-30` })}
  ${list([
    { t: '수거 이력', at: w('수거', '4.1.2'), hl: fl, keep: true },
    { t: '자재 · 재고', at: w('자재', '4.1.2'), hl: fl + 0.15, keep: true },
    { t: '정산 정보', at: c('4.1.3'), hl: fl + 0.3, keep: true },
  ], { x: 548, width: 412, y: 520, kind: 'check', gap: 46 })}
  <svg class="abs draw" style="left:574px;top:790px;width:6px;height:150px" viewBox="0 0 6 150" preserveAspectRatio="none"><path d="M3 0V150" pathLength="1" data-draw="${fl - 0.2},${fl + 0.5}"/></svg>
  ${el(fl + 0.3, `${ic('flow')}하나의 흐름으로`, { cls: 'abs tagline', style: 'left:548px;top:960px' })}
  ${note(REAL, t + 0.6)}`)
}

// 병원 전용 포털 — 미리 요청 → 당일 긴급 요청이 줄어요
{
  const t = c('4.2.0'), dn = c('4.3.0')
  const rows = `
    <div class="row"><span style="display:flex;align-items:center;gap:16px">${ic('truck')}추가 수거 요청</span><span class="btn">요청</span></div>
    <div class="row"><span style="display:flex;align-items:center;gap:16px">${ic('box')}자재 · 용기 요청</span><span class="btn">요청</span></div>
    <div class="row"><small>다음 정기 수거</small><b>화요일 오전</b></div>`
  scene(t, `
  ${head({ eb: 'HOSPITAL PORTAL', t: '병원은 *전용 포털*에서<br>미리 요청', at: t })}
  ${mock({ theme: 'ops', title: `${ic('building')}<span>우리 병원 · 요청하기</span>`, tag: '예시 화면', rows, at: t + 0.3, x: 120, y: 590, w: 840 })}
  ${touch(830, 718, w('추가', '4.2.1') + 0.1)}${touch(830, 832, w('자재', '4.2.1') + 0.1)}
  ${el(dn, `${ic('down')}당일 긴급 수거·자재 요청이 *줄고* 있어요`, { cls: 'abs tagline', style: 'left:120px;top:1110px' })}
  ${note(EX, t + 0.6)}`)
}

// 정산도 한 곳에서
{
  const t = c('4.4.0')
  scene(t, `
  ${head({ eb: 'SETTLEMENT', t: '정산도<br>*한 곳*에서 확인', at: t })}
  ${vflow([
    { icon: 'doc', t: '계약 조건 · 단가 이력', sub: '병원별 기준', at: t + 0.5 },
    { icon: 'receipt', t: '청구', at: w('청구', '4.4.2'), hl: c('4.4.3') },
    { icon: 'coin', t: '입금', at: w('입금', '4.4.2'), hl: c('4.4.3') + 0.12 },
    { icon: 'alert', t: '미수금', at: w('미수금', '4.4.2'), hl: c('4.4.3') + 0.24 },
  ], { y: 580, h: 108, gap: 48 })}
  ${el(c('4.4.4'), `${ic('gear')}지금 만들고 있어요`, { cls: 'abs tagline', style: 'left:72px;top:1200px' })}`)
}

// ④ AI 는 뭘 할까?
{
  const t = c('5.1.0') - 0.45
  scene(t, `${head({ eb: 'AND THEN, AI', t: '그럼 *AI*는<br>여기서 뭘 할까요?', size: 'h1', at: t + 0.1, y: 600 })}`)
}

// 다시 필요할 시점을 먼저 → 주문 · 추가 매출
{
  const t = c('5.2.0') - 0.1, sale = c('5.3.0')
  scene(t, `
  ${head({ eb: 'AI · TIMING', t: '다시 필요할<br>*시점*을 먼저', at: t })}
  ${chip('수거량', c('5.2.0'), { icon: 'truck', cls: 'abs', style: 'left:72px;top:580px' })}
  ${chip('자재 사용 기록', w('자재', '5.2.1'), { icon: 'box', cls: 'abs', style: 'left:330px;top:580px' })}
  <svg class="abs draw" style="left:510px;top:680px;width:6px;height:70px" viewBox="0 0 6 70" preserveAspectRatio="none"><path d="M3 0V70" pathLength="1" data-draw="${w('분석', '5.2.1')},${w('분석', '5.2.1') + 0.5}"/></svg>
  ${card(`<div class="ci" style="padding:30px 34px"><span class="cic">${ic('spark')}</span><div><small>AI 알림 · 예시</small><b>○○병원 · 용기가<br>다시 필요할 시점이에요</b><small>최근 수거량 · 자재 사용 기록 기준</small></div></div>`, c('5.2.2'), { style: 'position:absolute;left:72px;top:770px;width:888px', hl: c('5.2.3') })}
  ${chip('실제 주문', sale, { icon: 'receipt', cls: 'abs', style: 'left:72px;top:1110px' })}
  ${el(sale + 0.3, ic('arrowRight'), { cls: 'abs', a: 'fade', style: 'left:350px;top:1124px;color:var(--acc)' })}
  ${chip('*추가 매출*', w('추가', '5.3.1'), { icon: 'up', cls: 'abs', style: 'left:420px;top:1110px', hl: w('추가', '5.3.1') + 0.4 })}
  ${note(EX, t + 0.8)}`)
}

// 계획 1 — 데이터가 쌓이면
{
  const t = c('5.4.0') - 0.1
  scene(t, `
  ${head({ eb: 'NEXT · PLAN', t: '앞으로 *쌓일* 데이터', at: t })}
  ${list([
    { icon: 'cal', t: '병원별 수거 패턴', at: c('5.4.0') + 0.2 },
    { icon: 'alert', t: '갑작스러운 추가 요청', at: c('5.4.1') },
    { icon: 'truck', t: '차량 · 기사 운영 데이터', at: c('5.4.2') },
  ], { y: 480, kind: 'card', gap: 24, dimPrev: false })}
  ${el(w('쌓이면', '5.4.2'), `${ic('layers')}차곡차곡 쌓이면`, { cls: 'abs tagline', style: 'left:72px;top:1040px' })}`)
}

// 계획 2 — 동선과 배차
{
  const t = c('5.4.3') - 0.1, d0 = c('5.4.3') + 0.2, d1 = ce('5.4.4')
  const pins = [[220, 230], [400, 120], [620, 170], [760, 330], [560, 420], [300, 410]]
  const pinHtml = pins.map(([x, y], i) => el(t + 0.3 + i * 0.08, ic('building'), { cls: 'abs pin', a: 'scale', style: `left:${x - 30}px;top:${y - 30}px` })).join('')
  scene(t, `
  ${head({ eb: 'ROUTING · PLAN', t: '*동선과 배차*를<br>더 효율적으로', at: t })}
  ${el(t + 0.15, `
    <svg class="abs draw" style="left:0;top:0;width:888px;height:540px" viewBox="0 0 888 540"><path d="M100 470 C 150 330, 200 260, 220 230 S 360 110, 400 120 S 580 140, 620 170 S 770 280, 760 330 S 620 420, 560 420 S 360 430, 300 410" pathLength="1" data-draw="${d0},${d1}"/></svg>
    ${pinHtml}
    <span class="abs depot" style="left:70px;top:440px">${ic('truck')}</span>`, { cls: 'abs glass routemap', a: 'card', style: 'left:72px;top:540px;width:888px;height:540px' })}
  ${chip('같은 인원 · 같은 차량으로', c('5.4.5'), { icon: 'team', cls: 'abs', style: 'left:72px;top:1110px' })}
  ${el(c('5.4.6'), `${ic('plus')}더 많은 거래처`, { cls: 'abs tagline', style: 'left:72px;top:1210px' })}
  ${el(c('5.4.7'), '고도화 계획', { cls: 'abs tagline', style: 'left:470px;top:1210px' })}`)
}

// 결국 목표
{
  const t = c('6.1.0') - 0.1
  scene(t, `
  ${head({ eb: 'GOAL', t: '결국 목표는<br>*분명*해요', at: t })}
  ${list([
    { t: '행정 업무 · 불필요한 이동 *줄이기*', at: c('6.2.0') + 0.2 },
    { t: '빠지는 정산 *막기*', at: c('6.2.2') },
    { t: '같은 인력으로 *더 많은 일*', at: c('6.2.3') },
    { t: '*새로운 매출*까지', at: c('6.2.4'), keep: true },
  ], { y: 600, kind: 'check', gap: 52 })}`)
}

// 다음 사업 — 수거 일정에 공급을 더하는 순환
{
  const t = c('7.1.0') - 0.2, e = c('7.3.0')
  scene(t, loop({
    nodes: [
      { t: '수거', icon: 'truck', at: t + 0.3 },
      { t: '사용 기록', icon: 'db', at: t + 0.55 },
      { t: '시점 추천', icon: 'spark', at: w('추천', '7.2.2') - 0.3 },
      { t: '주문', icon: 'receipt', at: w('주문', '7.2.3') },
      { t: '수거 때 함께 공급', icon: 'box', at: w('공급', '7.2.3') - 0.2 },
      { t: '새로운 매출', icon: 'coin', at: c('7.2.4'), hl: c('7.2.4') + 0.4 },
    ],
    cx: 540, cy: 780, rx: 290, ry: 420, drawAt: t + 0.2, drawEnd: c('7.2.4') + 0.4, dot: [c('7.2.4') + 0.4, e + 0.4, 360],
    center: `${el(t + 0.1, 'NEXT BUSINESS', { cls: 'eyebrow' })}${el(t + 0.25, '다음 사업도<br>*같이* 보고 있어요', { cls: 'h3' })}${el(c('7.2.4'), '계획', { cls: 'tagline' })}`,
  }))
}

// 중장기 — 구독형 서비스
{
  const t = c('7.3.0') - 0.1, f = c('7.3.2')
  const co = (x, k) => card(`<div class="mini">${ic('building')}<b>의료폐기물<br>업체</b></div>`, f + k * 0.25, { style: `position:absolute;left:${x}px;top:960px;width:272px` })
  scene(t, `
  ${head({ eb: 'LONG TERM · PLAN', t: '다른 업체도 쓰는<br>*구독형 서비스*로', at: t })}
  ${card(cardIn('db', '운영 데이터 + 노하우', '이 회사 현장에서 쌓인 것'), t + 0.4, { style: 'position:absolute;left:72px;top:580px;width:888px', hl: c('7.3.1') })}
  <svg class="abs draw" style="left:72px;top:760px;width:888px;height:200px" viewBox="0 0 888 200"><path d="M444 0V60H136V200M444 60V200M444 60H752V200" pathLength="1" data-draw="${f - 0.3},${f + 0.6}"/></svg>
  ${co(72, 0)}${co(380, 1)}${co(688, 2)}
  ${el(c('7.3.3'), `${ic('repeat')}구독형 서비스 · 중장기 계획`, { cls: 'abs tagline', style: 'left:72px;top:1200px' })}`)
}

// 정리 — 업무 개선에서 끝나지 않고 새로운 사업으로
{
  const t = c('8.1.0') - 0.2
  scene(t, `
  ${el(t + 0.05, 'FROM PROJECT TO BUSINESS', { cls: 'abs eyebrow', style: 'left:72px;top:420px' })}
  ${strike('한 회사의 업무 개선', t + 0.2, w('끝나지', '8.1.1'), { style: 'position:absolute;left:72px;top:490px', cls: 'h3' })}
  ${head({ t: '현장의 운영 방식을<br>*새로운 사업*으로', size: 'h1', at: c('8.1.2'), y: 620 })}`)
}

// 끝 화면
endCard && scene(R.SPEECH_END + 0.3, endCard({ at: R.SPEECH_END + 0.4, line: '다음 편 · *쑥뜸원*', sub: '이용권 매장은 어떻게 달라지고 있을까요?', cta: ['우리 회사는? 3분 AX Fit 진단', 'miraeailab.com'] }))

R.finish()
