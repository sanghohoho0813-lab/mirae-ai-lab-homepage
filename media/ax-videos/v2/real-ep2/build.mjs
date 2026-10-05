// 실제 프로젝트 2편 — 쑥뜸원(웰니스 매장) · 영상 스타일 v2(9:16 · 1.13배 · 어두운/밝은 장면 교차 · 도형 7색)
// 장면표(D 어두움 / L 밝음):
//  1 D PROJECT 02 — 쑥뜸원 · 이용권으로 다니는 매장(칩)      2 L 기록만이 아니라 하나로 연결(취소선 + 목록 줄)
//  3 D TAP TO RECORD — 실제 화면(휴대폰) + 다음 방문 때 바로   4 L TODAY — 실제 화면 + 우선순위 근거(번호 태그)
//  5 D 일일이 찾지 않아도 — 고객 세 부류(목록 줄) + 장부(취소선)  6 L CUSTOMER PLATFORM — 실제 화면 + 체크
//  7 D NEXT · PLAN — 이탈 · 재방문 → AI 분석(계획)            8 L OUTCOME — 먼저 챙길 고객 · 줄고/늘고
//  9 D NEXT BUSINESS — 예시 상품 화면(연결할 계획)             10 L STANDARDIZE — 본점 → 표준화 → 2호점·가맹점
// 11 D 프로그램이 아니라 기반(취소선)                           12 L SAME MODEL — 이용권 매장 2×2
// 13 D CLOSED LOOP — 순환도(허브 + 노드 6 + 도는 점)           14 L TWO COMPANIES — 띠 카드 2
// 15 D DECISION — 실제 화면(PC) · 데이터 뒤지기(취소선)          16 L 마무리 — 바뀔 수 있어요 → 로고
// ⚠️ 회사 이름은 밝히지 않는다. 실제 화면은 고객 이름을 ○○ 로 바꾸거나 흐리게 한 캡처만 짧게. 성과 숫자는 쓰지 않는다.
import { createReel2, ic } from '../../lib/reels2.mjs'

const R = createReel2('.', { title: '실제 프로젝트 2편 · 쑥뜸원(웰니스)' })
const { c, ce, w, scene, el, head, note, numtag, check, row, chip, node, nodeIn, card, cardIn, mini, strike, deco, tagline, lines, phone, browser, mock, loop, endCard, touch } = R
const REAL = '실제 화면 · 고객 이름은 가렸습니다'
const EX = '화면 속 고객·상품은 예시 데이터입니다'
const RR = 892 / 412

// 1 D — PROJECT 02
{
  const k = c('1.2.0')
  scene(0, `
  ${deco('ring', 830, 150, 260, 'violet', 0.2)}${deco('disc', -90, 1160, 240, 'amber', 0.4)}
  ${head({ eb: 'PROJECT 02 · 소상공인 사례', t: '쑥뜸원<br>*웰니스 매장*', size: 'h1', at: 0.15, y: 300 })}
  ${el(k, '쑥을 태워 몸을 따뜻하게 관리해 주는 곳', { cls: 'abs p', style: 'left:72px;top:560px' })}
  ${chip('마사지숍', w('마사지숍', '1.2.2'), { x: 72, y: 680, c: 'rose' })}
  ${chip('피부관리실', w('피부', '1.2.2'), { x: 330, y: 680, c: 'violet' })}
  ${chip('이용권', c('1.2.3'), { x: 72, y: 800, c: 'amber', big: true })}
  ${chip('정기 방문', c('1.2.4'), { x: 330, y: 800, c: 'teal', big: true })}`)
}

// 2 L — 기록만이 아니라 하나로
{
  const t = c('2.1.0') - 0.15, one = w('하나로', '2.2.1')
  scene(t, `
  ${deco('sq', 870, 1090, 220, 'teal', t + 0.3)}
  ${el(t + 0.05, 'NOT JUST RECORDS', { cls: 'abs eyebrow', style: 'left:72px;top:250px' })}
  ${strike('고객 정보 입력 · 기록', t + 0.15, ce('2.1.1') - 0.5, { y: 300 })}
  ${el(c('2.2.0') - 0.1, '여기서는<br>*하나로* 연결합니다', { cls: 'abs h2', style: 'left:72px;top:390px' })}
  ${row('방문 기록', '', w('방문', '2.2.0'), { y: 600, w: 888, c: 'teal', hl: one })}
  ${row('이용권', '', w('이용권', '2.2.0'), { y: 720, w: 888, c: 'amber', hl: one + 0.1 })}
  ${row('상담 내용', '', w('상담', '2.2.0'), { y: 840, w: 888, c: 'violet', hl: one + 0.2 })}
  ${row('선호 부위 · 반응', '', c('2.2.1'), { y: 960, w: 888, c: 'rose', hl: one + 0.3 })}
  ${tagline('고객 한 분의 기록으로', one + 0.4, { y: 1100, icon: 'user' })}`, { light: true })
}

// 3 D — 몇 번만 누르면 기록 · 다음 방문 때 바로(실제 화면)
{
  const t = c('2.3.0') - 0.1, sw = w('누르면', '2.3.1') - 0.2, k = 402 / 780
  const inner = touch(Math.round(140 * k), Math.round(436 * k), sw + 0.45) + touch(Math.round(500 * k), Math.round(436 * k), sw + 0.85)
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'teal', t + 0.3)}
  ${head({ eb: 'TAP TO RECORD', t: '*몇 번만* 누르면 기록', at: t })}
  ${phone({ src: 'assets/real/well-record-m.jpg', ratio: RR, swaps: [{ src: 'assets/real/well-record2-m.jpg', at: sw }], inner, at: t + 0.1, x: 72, y: 400, w: 430 })}
  ${check('관리 부위', sw + 0.45, { x: 540, y: 520, c: 'teal' })}
  ${check('고객 반응', sw + 0.85, { x: 540, y: 640, c: 'rose' })}
  ${card(cardIn('', '다음 방문 때 *바로*', '지난번 관리 · 좋아하신 점'), c('2.3.2'), { x: 540, y: 780, w: 420, c: 'copper' })}
  ${note(REAL, t + 0.6)}`)
}

// 4 L — 기록 다음엔 · 오늘의 우선순위(실제 화면)
{
  const t = c('3.1.0') - 0.4, k = c('3.2.0')
  scene(t, `
  ${deco('disc', 890, 150, 200, 'amber', t + 0.3)}
  ${head({ eb: 'TODAY', t: '기록 다음엔<br>*오늘 챙길 고객*', at: t + 0.1 })}
  ${phone({ src: 'assets/real/well-retention-m.jpg', ratio: RR, at: k - 0.2, x: 72, y: 500, w: 400, kb: `${k},${ce('3.2.3')},1,0,0,1.06,-10,-22` })}
  ${numtag(1, '방문 주기', w('방문', '3.2.0'), { x: 500, y: 560, w: 460, c: 'teal' })}
  ${numtag(2, '이용권 상태', w('이용권', '3.2.0'), { x: 500, y: 680, w: 460, c: 'amber' })}
  ${numtag(3, '상담 이후 행동', c('3.2.1'), { x: 500, y: 800, w: 460, c: 'violet' })}
  ${lines([[528, 900, 528, 950, c('3.2.2'), c('3.2.2') + 0.5]], k)}
  ${tagline('오늘의 우선순위', c('3.2.3') - 0.2, { x: 500, y: 970, icon: 'target' })}
  ${note(REAL, k)}`, { light: true })
}

// 5 D — 일일이 찾지 않아도
{
  const t = c('3.3.0') - 0.1
  scene(t, `
  ${deco('ring', -100, 1100, 260, 'violet', t + 0.3)}
  ${head({ eb: 'NO MORE SEARCHING', t: '직원이 *일일이*<br>찾지 않아도', at: t })}
  ${row('이용권이 거의 끝난 고객', '', c('3.3.0') + 0.2, { y: 580, w: 888, c: 'amber' })}
  ${row('다시 올 때가 된 고객', '', c('3.3.1'), { y: 710, w: 888, c: 'teal' })}
  ${row('상담 후 아직 방문 전인 고객', '', c('3.3.2'), { y: 840, w: 888, c: 'violet' })}
  ${strike('장부에서 하나씩 찾기', c('3.3.3'), w('일일이', '3.3.4'), { y: 1010 })}`)
}

// 6 L — 고객 전용 플랫폼(실제 화면)
{
  const t = c('4.1.0') - 0.1
  scene(t, `
  ${deco('sq', 880, 1080, 210, 'rose', t + 0.3)}
  ${head({ eb: 'CUSTOMER PLATFORM', t: '고객에게는 *전용 플랫폼*', at: t })}
  ${phone({ src: 'assets/real/well-welcome-m.jpg', ratio: RR, at: t + 0.1, x: 72, y: 400, w: 430, kb: `${t},${ce('4.1.4')},1,0,0,1.06,-10,-28` })}
  ${check('이용 내역 확인', c('4.1.1'), { x: 540, y: 520, c: 'teal' })}
  ${check('남은 이용권', w('남은', '4.1.1'), { x: 540, y: 640, c: 'amber' })}
  ${check('방문 요청', c('4.1.2'), { x: 540, y: 760, c: 'blue' })}
  ${check('새 상품·서비스', c('4.1.3'), { x: 540, y: 880, c: 'copper' })}
  ${note(REAL, t + 0.6)}`, { light: true })
}

// 7 D — 계획: 한 단계 더(AI 분석)
{
  const t = c('5.1.0') - 0.15, ai = c('5.2.2')
  scene(t, `
  ${deco('ring', 840, 150, 260, 'blue', t + 0.2)}
  ${head({ eb: 'NEXT · PLAN', t: '데이터가 쌓이면<br>*한 단계* 더', at: t })}
  ${node(nodeIn('door', '이탈 가능성이<br>높은 고객'), c('5.2.0'), { x: 72, y: 580, w: 420, c: 'rose' })}
  ${node(nodeIn('repeat', '재방문으로 잘<br>이어지는 프로그램'), c('5.2.1'), { x: 540, y: 580, w: 420, c: 'teal' })}
  ${lines([[282, 790, 282, 850, ai - 0.3, ai], [750, 790, 750, 850, ai - 0.3, ai], [282, 850, 750, 850, ai, ai + 0.4], [516, 850, 516, 900, ai + 0.3, ai + 0.6]], t)}
  ${node(`${ic('spark')}*AI 분석*<small>앞으로 고도화할 계획</small>`, ai + 0.3, { x: 316, y: 900, w: 400, c: 'copper', hiNode: true })}`)
}

// 8 L — 먼저 챙길 고객 · 줄고 늘고
{
  const t = c('5.2.3') - 0.1, out = c('5.3.0')
  scene(t, `
  ${deco('disc', 890, 1120, 220, 'green', t + 0.3)}
  ${head({ eb: 'OUTCOME', t: '먼저 챙길 고객과<br>*매출 기회*', at: t })}
  ${card(cardIn('target', '대표님이 먼저 챙길 고객', '+ 매출 기회를 알려 드리기'), t + 0.3, { x: 72, y: 580, w: 888, c: 'copper', dim: out })}
  ${row('놓치던 고객', '줄고 ↓', out, { y: 790, w: 888, c: 'rose' })}
  ${row('재방문 · 재등록 · 추가 구매', '늘고 ↑', c('5.3.1'), { y: 920, w: 888, c: 'green', hl: c('5.3.2') })}
  ${tagline('성과로 이어집니다', c('5.3.3'), { y: 1070, icon: 'check' })}`, { light: true })
}

// 9 D — 다음 사업: 매장 밖에서도 다시 살 수 있게(예시 화면)
{
  const t = c('6.1.0') - 0.15
  const rows = `
    ${el(w('화장품', '6.2.1'), `<span style="display:flex;align-items:center;gap:16px">${ic('bottle')}쑥 화장품</span><span class="btn">다시 구매</span>`, { cls: 'mrow', a: 'left' })}
    ${el(w('생활', '6.2.1'), `<span style="display:flex;align-items:center;gap:16px">${ic('box')}생활 상품</span><span class="btn">다시 구매</span>`, { cls: 'mrow', a: 'left' })}
    ${el(c('6.2.2'), '<small>매장 밖에서도</small><b>집으로 받기</b>', { cls: 'mrow', a: 'left' })}`
  scene(t, `
  ${deco('sq', 880, 1120, 220, 'amber', t + 0.3)}
  ${head({ eb: 'NEXT BUSINESS · PLAN', t: '매장 밖에서도<br>*다시 살 수 있게*', at: t })}
  ${mock({ theme: 'well', title: `${ic('store')}<span>고객 전용 플랫폼 · 상품</span>`, rows, at: c('6.2.0'), x: 72, y: 580, w: 888 })}
  ${tagline('연결할 계획', c('6.2.4'), { y: 1110, icon: 'link' })}
  ${note(EX, c('6.2.0') + 0.5)}`)
}

// 10 L — 표준화
{
  const t = c('6.3.0') - 0.1, ln = c('6.3.3')
  scene(t, `
  ${deco('ring', 870, 150, 220, 'teal', t + 0.3)}
  ${head({ eb: 'STANDARDIZE', t: '본점 노하우를<br>*표준화*해서 그대로', at: t })}
  ${card(cardIn('store', '본점 · 운영 노하우'), c('6.3.1'), { x: 72, y: 570, w: 888, c: 'amber' })}
  ${card(cardIn('layers', '데이터 · 시스템으로 *표준화*'), c('6.3.2'), { x: 72, y: 750, w: 888, c: 'copper', hiedge: true })}
  ${lines([{ d: 'M516 900 V940 H288 V990 M516 940 H744 V990', t0: ln - 0.2, t1: ln + 0.6 }], t)}
  ${card(mini('branch', '2호점'), c('6.3.0') + 0.3, { x: 72, y: 990, w: 432, ic: 'teal' })}
  ${card(mini('branch', '가맹점'), w('가맹점', '6.3.0'), { x: 528, y: 990, w: 432, ic: 'violet' })}`, { light: true })
}

// 11 D — 프로그램이 아니라 기반
{
  const t = c('6.4.0') - 0.1
  scene(t, `
  ${deco('disc', 870, 1100, 240, 'copper', t + 0.3)}
  ${el(t + 0.05, 'NOT JUST A PROGRAM', { cls: 'abs eyebrow', style: 'left:72px;top:420px' })}
  ${strike('매장 하나 편하게 운영하는 프로그램', t + 0.2, w('아니라', '6.4.1'), { y: 480 })}
  ${el(c('6.4.2'), '사업 자체가<br>*커질 수 있는* 기반', { cls: 'abs h1 long', style: 'left:72px;top:600px' })}
  ${el(c('6.4.2') + 0.6, '고객과 계속 이어지면서', { cls: 'abs p', style: 'left:72px;top:860px' })}`)
}

// 12 L — 같은 방식(이용권 매장)
{
  const t = c('7.1.0') - 0.1, all = c('7.1.4')
  scene(t, `
  ${deco('sq', 880, 220, 200, 'rose', t + 0.3)}
  ${head({ eb: 'SAME MODEL', t: '이용권 매장이라면<br>*똑같이* 적용', at: t })}
  ${card(mini('spark', '쑥뜸원'), t + 0.3, { x: 72, y: 580, w: 432, ic: 'amber', dim: c('7.1.1') })}
  ${card(mini('heart', '피부관리실'), w('피부', '7.1.1'), { x: 528, y: 580, w: 432, ic: 'rose', hl: all })}
  ${card(mini('hand', '마사지숍'), w('마사지숍', '7.1.1'), { x: 72, y: 800, w: 432, ic: 'violet', hl: all + 0.1 })}
  ${card(mini('users', '필라테스'), c('7.1.2'), { x: 528, y: 800, w: 432, ic: 'teal', hl: all + 0.2 })}
  ${chip('이용권을 끊고 다시 오는 매장', c('7.1.3'), { x: 72, y: 1040, c: 'copper' })}`, { light: true })
}

// 13 D — 원리는 같다(순환도)
{
  const t = c('8.1.0') - 0.25, e = w('자동', '8.2.4')
  scene(t, `
  ${head({ eb: 'CLOSED LOOP', t: '업종은 달라도 *원리는 같습니다*', at: t, y: 240, size: 'h3' })}
  ${loop({
    nodes: [
      { t: '한 번 입력', icon: 'pen', at: c('8.2.0'), c: 'teal' },
      { t: '다음 업무로', icon: 'flow', at: w('다음', '8.2.1'), c: 'blue' },
      { t: '데이터 쌓임', icon: 'db', at: c('8.2.2'), c: 'amber' },
      { t: '분석', icon: 'ai', at: w('분석', '8.2.2'), c: 'violet' },
      { t: '다음 할 일', icon: 'target', at: c('8.2.3'), c: 'green' },
      { t: '자동 처리', icon: 'gear', at: e, c: 'copper', hl: e + 0.4 },
    ],
    cx: 540, cy: 800, rx: 300, ry: 340, at: t + 0.2, drawAt: c('8.2.0') - 0.2, drawEnd: e + 0.3, orbitAt: e + 0.3, hubText: '같은<br>원리', hubAt: c('8.1.1'),
  })}`)
}

// 14 L — 두 회사, 같은 원리
{
  const t = c('8.3.0') - 0.1
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'violet', t + 0.3)}
  ${head({ eb: 'TWO COMPANIES', t: '두 회사,<br>*같은 원리*', at: t })}
  ${card(cardIn('truck', '의료폐기물 수거·운반', '시간과 비용은 줄이고 · 처리 능력과 새로운 매출은 키우고'), t + 0.3, { x: 72, y: 580, w: 888, c: 'teal', dim: c('8.3.3') })}
  ${card(cardIn('spark', '쑥뜸원(웰니스)', '이탈은 줄이고 · 재방문과 재구매는 늘리고'), c('8.3.3'), { x: 72, y: 830, w: 888, c: 'violet', hl: c('8.3.4') + 0.3 })}`, { light: true })
}

// 15 D — 결정은 우선순위와 근거만 보고(실제 화면 PC)
{
  const t = c('9.1.0') - 0.4
  scene(t, `
  ${deco('disc', 900, 180, 200, 'blue', t + 0.3)}
  ${head({ eb: 'FOR YOU', t: '대표님한테는<br>뭐가 *달라질까요?*', at: t + 0.1 })}
  ${strike('데이터를 직접 뒤지기', c('9.2.0'), w('필요', '9.2.0'), { y: 540 })}
  ${browser({ src: 'assets/real/well-coach-pc.jpg', at: c('9.2.1') - 0.2, x: 72, y: 640, w: 888, h: 560, url: 'WELLNESS AX', kb: `${c('9.2.1') - 0.2},${ce('9.2.2') + 0.5},1.3,-230,-110,1.42,-290,-160` })}
  ${note(REAL, c('9.2.1'))}`)
}

// 16 L — 마무리 → 로고
{
  const t = c('9.3.0') - 0.3, end = c('9.4.0')
  scene(t, `
  ${deco('ring', 840, 130, 260, 'copper', t + 0.2)}${deco('disc', -80, 1160, 240, 'teal', t + 0.4)}
  ${el(t + 0.1, 'YOUR COMPANY', { cls: 'abs eyebrow', out: end, style: 'left:72px;top:520px' })}
  ${el(t + 0.25, '대표님 회사도<br>*바뀔 수 있어요*', { cls: 'abs h1', out: end, style: 'left:72px;top:580px' })}
  ${endCard({ at: end, sub: 'AI를 넣는 데서 끝내지 않고', subAt: c('9.4.1'), line: '회사가 더 잘 돌아가고<br>*성장하도록*', lineAt: c('9.4.2'), cta: ['우리 회사는? 3분 AX Fit 진단', 'miraeailab.com'], ctaAt: R.VOICE_END })}`, { light: true })
}

R.finish()
