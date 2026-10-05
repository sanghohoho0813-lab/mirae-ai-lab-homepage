// 영상 1 · AX가 뭐고, 왜 필요한가 — 영상 스타일 v3.3(BIG INFOGRAPHIC · DIRECTORIAL VISUAL · PRODUCT MOTION) · 비교용 시안
// 장면표: ../SCENES.md — 시퀀스: 후킹 · 왜 어려워졌나 · 재료 · 조사 · 정부와 우리 · 제품 · 마무리
// v3.3: 자막 52px(한 줄 16자) · 읽는 본문 52px 이상 · BIG MOMENT(120~260px) · 상황 연출(심사 테이블 · 계획서 더미 · 흩어진 기록) · PRODUCT PUSH
// 음성·자막 정렬: v2/film-1 최종 음성(1.13배 · 쉼 줄임 · -14 LUFS) 그대로. 대표님 녹음이라 배경음악은 넣지 않았다.
// ⚠️ 조사 사례·정부 발표는 '미래AI랩 실적 아님'을 따로 표기. 특허는 '출원'. 앱 화면은 미래AI랩이 직접 만든 샘플(예시 데이터).
import { createReel2, ic } from '../../lib/reels2.mjs'
import { stage33, PAL } from '../../lib/stage33.mjs'

const R = createReel2('.', { title: '영상 1 · AX가 뭐고, 왜 필요한가', v33: true })
const { c, w, scene, el, head, note, check, chip, bubble, node, hub, card, deco, lines, phone31, browser31, endCard } = R
const { badge, panel, giga, mega, person, panelTable, docPile, push, flowPhone } = stage33(R)
const SAMPLE = '영상 속 화면은 미래AI랩이 직접 만든 샘플(예시 데이터)입니다'
const CASE = '공개 사례 조사 요약 · 미래AI랩 실적이 아닙니다'
const SH = (n) => `assets/shots/${n}.jpg`
const bigNode = (icon, t, at, o) => node(`${ic(icon)}${t}${o.sub ? `<small>${o.sub}</small>` : ''}`, at, o).replace('class="node abs', `class="node lg${o.row ? ' hz' : ''} abs`)
const rhead = (o) => head(o).replace('left:72px;right:120px', 'left:590px;right:120px')
const strikeLine = (t, at, sAt, o) => el(at, `<span class="st">${t}<span class="sl" data-strike="${sAt}"></span></span>`, { cls: `abs ${o.cls ?? 'h3'} strike-wrap dimtxt`, out: o.out, style: `left:${o.x ?? 72}px;top:${o.y}px` })
const xl = (html) => html.replace(/chip dot abs( big)?/, 'chip dot abs big')

const B = [0, c('1.2.0') - 0.2, c('1.5.0') - 0.2, c('2.1.0') - 0.1, c('2.5.0') - 0.1, c('2.7.1') - 0.1, c('2.8.0') - 0.1, c('2.9.0') - 0.1, c('2.10.0') - 0.1,
  c('3.1.0') - 0.1, c('3.4.0') - 0.2, c('4.1.0') - 0.1, c('4.3.0') - 0.1, c('5.1.0') - 0.1, c('5.3.0') - 0.1, c('5.5.0') - 0.1, c('5.6.0') - 0.1,
  c('6.1.0') - 0.1, c('6.3.0') - 0.1, c('7.1.0') - 0.1, c('7.2.2') - 0.1, c('7.3.0') - 0.1, c('8.1.0') - 0.1, c('9.1.0') - 0.1, c('9.2.0') - 0.1,
  c('9.4.0') - 0.1, c('10.1.0') - 0.1, c('10.2.0') - 0.1, c('10.4.0') - 0.1]
const S = (i) => B[i - 1]

// ── 후킹 ─────────────────────────────────────────────
// 1 D · B — 세 막대가 선정 기준선 바로 앞에서 멈춘다(한 끗)
{
  const at = [w('정책자금', 0), w('투자도', 0), w('지원사업도', 0)], k = w('끗', '1.1.1')
  const L = [['정책자금', 'teal', 790], ['투자', 'blue', 780], ['정부지원사업', 'amber', 794]]
  scene(0, `
  ${deco('ring', 860, 150, 220, 'copper', 0.3)}
  ${head({ eb: 'FUNDING · INVESTMENT · GRANTS', t: '매번 *한 끗* 차이로<br>놓치고 계신가요?', size: 'h1', at: 0.1, y: 250 })}
  ${L.map(([l, col, wd], i) => el(at[i], l, { cls: 'ylabel abs', a: 'fade', style: `left:72px;top:${560 + i * 170}px;color:var(--ink)` })
    + `<div class="track abs" style="left:72px;top:${636 + i * 170}px;width:840px;height:26px" data-in="${at[i]}" data-a="fade"><div class="fill" style="--c:var(--${col})" data-grow="${at[i]},${at[i] + 1.4},${wd}"></div></div>`).join('')}
  ${lines([{ d: 'M884 540 V1110', t0: k - 0.4, t1: k + 0.2 }], 0, { c: 'rose', width: 6 })}
  ${el(k, '선정 기준선', { cls: 'abs tagline', a: 'fade', style: 'left:700px;top:1125px;color:var(--ink2)' })}`)
}

// 2 D · H — 쏟아지는 기술 칩 속 제자리인 우리 회사
{
  const t = S(2), k = c('1.4.0'), me = c('1.4.1'), fear = c('1.4.2')
  const tech = [['생성형 AI', 'teal', 72, 560], ['AI 에이전트', 'blue', 470, 600], ['업무 자동화', 'violet', 120, 710], ['AI 검색', 'amber', 560, 740]]
  scene(t, `
  ${deco('sq', 880, 1150, 200, 'violet', t + 0.3)}
  ${head({ eb: 'COMPETITION', t: '경쟁은 *치열*하고<br>기술은 쏟아지고', size: 'h1', at: t + 0.1, y: 250 })}
  ${tech.map(([s, col, x, y], i) => chip(s, k + i * 0.45, { x, y: y - 140, c: col, mv: [k + i * 0.45, k + i * 0.45 + 0.9, 0, 140], dim: me })).join('')}
  ${bigNode('pin', '우리 회사', me, { x: 270, y: 900, w: 540, c: 'copper', row: true, hiNode: true })}
  ${el(fear, '“우리만 *제자리*?”', { cls: 'bubble abs', a: 'up', style: 'left:220px;top:1080px;--c:var(--rose)' })}`)
}

// 3 L · H — 투자자와 심사위원이 바라보는 '매력적인 회사'
{
  const t = S(3), inv = w('투자자와', '1.6.0'), jd = w('심사위원이', '1.6.0'), at = c('1.6.1')
  scene(t, `
  ${head({ eb: 'STILL', t: '좋은 결과를 내는<br>회사는 *분명히* 있죠', size: 'h1', at: t + 0.1, y: 250 })}
  ${person(72, 640, 190, inv, { light: true, c: 'blue' })}${el(inv + 0.2, '투자자', { cls: 'plate', a: 'fade', style: 'left:92px;top:900px' })}
  ${person(818, 640, 190, jd, { light: true, c: 'violet' })}${el(jd + 0.2, '심사위원', { cls: 'plate', a: 'fade', style: 'left:822px;top:900px' })}
  ${lines([[270, 760, 360, 760, at - 0.2, at + 0.4], [810, 760, 720, 760, at - 0.2, at + 0.4]], t, { width: 5 })}
  ${bigNode('building', '매력적인<br>회사', at, { x: 360, y: 620, w: 360, c: 'copper', hiNode: true })}
  ${el(c('1.6.2'), '끝까지 봐 주세요', { cls: 'abs h3', style: 'left:72px;top:1100px' })}`, { light: true })
}

// ── 왜 어려워졌나 ─────────────────────────────────────
// 4 L · E — 큰 계획서 한 장: 예전 통과 → 지금은 ✕
{
  const t = S(4), past = c('2.2.0'), now = c('2.3.0')
  scene(t, `
  ${deco('ring', 860, 160, 220, 'amber', t + 0.3)}
  ${head({ eb: 'WHY IS IT HARDER', t: '왜 점점<br>*어려워질까요?*', size: 'h1', at: t + 0.1, y: 250 })}
  ${el(t + 0.4, '', { cls: 'doc abs', a: 'card', style: 'left:72px;top:560px;width:300px;height:400px;background-size:60% 26px, 78% 250px;background-position:30px 40px, 30px 110px' })}
  ${el(past, '<span class="mark">✓</span><span>예전엔<br>통과</span>', { cls: 'check abs', a: 'left', dim: now, style: 'left:430px;top:580px;--c:var(--green)' })}
  ${el(now, '<span class="mark">✕</span><span>지금은<br>*경쟁력 없음*</span>', { cls: 'check abs', a: 'left', style: 'left:430px;top:780px;--c:var(--rose)' })}
  ${el(c('2.4.0'), '계획서는 결국<br>*계획일 뿐*', { cls: 'abs h2', style: 'left:72px;top:1010px' })}`, { light: true })
}

// 5 D · H — 심사 테이블: “그래서, 다음은?”
{
  const t = S(5), q = c('2.6.0'), a = c('2.7.0')
  scene(t, `
  ${el(t + 0.05, 'AT THE REVIEW', { cls: 'abs eyebrow', style: 'left:72px;top:250px' })}
  ${panelTable({ at: t + 0.2, y: 310, n: 3, w: 190 })}
  ${el(q, '“그래서, *다음은*<br>어떻게 되나요?”', { cls: 'bubble abs', a: 'up', style: 'left:72px;top:720px;--c:var(--violet)' })}
  ${el(a, '“자금이 들어오면<br>하겠습니다…”', { cls: 'bubble r abs', a: 'up', style: 'left:330px;top:980px;--c:var(--amber)' })}`)
}

// 6 L · H(BIG) — 비슷비슷한 계획서 더미 속에 묻히는 우리 회사 계획서
{
  const t = S(6), more = c('2.7.2'), gone = c('2.7.3')
  scene(t, `
  ${head({ eb: 'ALL LOOK ALIKE', t: '누구나 AI로 쓴<br>*비슷비슷한* 계획서', size: 'h2', at: t + 0.1, y: 250 })}
  ${docPile({ at: t + 0.2, count: 14, y0: 480, y1: 1240, mine: 6, mineAt: t + 0.3, dimAt: gone, seed: 11 })}
  ${docPile({ at: more, count: 16, y0: 470, y1: 1250, seed: 23, step: 0.06 })}`, { light: true })
}

// 7 D · A(BIG) — 보여 줄 게 없는 거죠
{
  const t = S(7)
  scene(t, `
  ${strikeLine('계획이 부족한 게 아니에요', c('2.8.0'), w('아니에요', '2.8.0'), { y: 400 })}
  ${mega('보여 줄 게<br>*없는* 거죠', c('2.8.1'), { y: 520, size: 140 })}`)
}

// 8 L · I(PRODUCT PUSH) — 계획 대신 실제 화면이 앞으로
{
  const t = S(8), p = w('넘어서', '2.9.0'), k = w('실제로', '2.9.1')
  scene(t, `
  ${head({ eb: 'SHOW, NOT PLAN', t: '이제는 *실제로*<br>보여 줘야 해요', size: 'h1', at: t + 0.1, y: 250 })}
  ${el(t + 0.2, '', { cls: 'doc abs', a: 'fade', out: p + 0.4, style: 'left:72px;top:620px;width:220px;height:290px;background-size:60% 20px, 78% 180px;background-position:22px 30px, 22px 80px' })}
  ${push(flowPhone('lvcu', ['00', '01', '02'], [k + 0.6, k + 1.6], { at: p, x: 297, y: 540, w: 486 }), [[p, p + 1.1, 0.5, 1, 0, 260, 0, 0]], '540px 1072px')}
  ${el(k, SAMPLE, { cls: 'note', a: 'fade', style: 'top:496px' })}`, { light: true })
}

// 9 L · B — 심사위원이 결국 보는 하나: 다음 단계로 커질 수 있는가 → 돈이 돌아오는가
{
  const t = S(9), up = c('2.11.0'), m = c('2.11.1')
  scene(t, `
  ${head({ eb: 'ONE QUESTION', t: '결국 보는 건 *하나*', size: 'h1', at: t + 0.1, y: 250 })}
  ${person(72, 470, 170, t + 0.4, { light: true, c: 'violet' })}${el(t + 0.6, '심사위원', { cls: 'plate', a: 'fade', style: 'left:84px;top:700px' })}
  ${lines([{ d: 'M300 1000 H440 V880 H580 V760 H720 V640 H900', t0: up, t1: up + 1.4 }], t, { width: 10, c: 'copper' })}
  ${el(up + 0.6, '다음 단계로<br>*커질 수 있나*', { cls: 'abs h3', style: 'left:520px;top:900px' })}
  ${chip('빌려준 돈', m, { x: 72, y: 1110, c: 'blue' })}
  ${chip('투자한 돈', w('투자한', '2.11.1'), { x: 440, y: 1110, c: 'amber' })}
  ${el(w('돌아오니까요', '2.11.1') - 0.2, `${badge('repeat', 'green', 92)}`, { cls: 'abs', a: 'scale', style: 'left:830px;top:1105px' })}`, { light: true })
}

// ── 재료 ─────────────────────────────────────────────
// 10 D · H — 회사 안의 기록이 엑셀·메신저·메모장으로 흩어진다
{
  const t = S(10), sc = c('3.3.2')
  const data = [['고객', 'teal', w('고객', '3.3.0'), 330, 640, -258, 230], ['매출', 'green', w('매출', '3.3.0'), 560, 640, 180, -80], ['재고', 'amber', w('재고', '3.3.0'), 330, 760, 410, 110], ['직원 기록', 'blue', w('직원의', '3.3.0'), 500, 760, -428, -200]]
  const isl = [['excel', '엑셀', 'green', 72, 1040, w('엑셀', '3.3.1')], ['chatm', '메신저', 'blue', 380, 1040, w('메신저', '3.3.1')], ['memo', '메모장', 'amber', 700, 1040, w('메모장', '3.3.1')]]
  scene(t, `
  ${head({ eb: 'INSIDE THE COMPANY', t: '보여 줄 재료는<br>*회사 안에*', size: 'h1', at: t + 0.1, y: 250 })}
  ${isl.map(([icon, l, col, x, y, a]) => el(a, `${badge(icon, col, 84)}<span>${l}</span>`, { cls: 'abs h3', a: 'scale', style: `left:${x}px;top:${y}px;display:flex;align-items:center;gap:16px` })).join('')}
  ${data.map(([s, col, a, x, y, dx, dy]) => chip(s, a, { x, y, c: col, mv: [sc, sc + 1.4, dx, dy] })).join('')}
  ${el(sc + 0.6, '*흩어져* 있을 뿐', { cls: 'abs h2', style: 'left:72px;top:1170px' })}`)
}

// 11 D · E — 한곳에 쌓으면 자산 → 흩어지면 증거로 못 쓰고 → 직원이 나가면 흔들린다
{
  const t = S(11), sp = c('3.4.1'), lv = c('3.4.2'), sh = c('3.4.3')
  const cols = ['teal', 'blue', 'amber', 'violet', 'copper'], names = ['고객', '매출', '재고', '기록', '노하우']
  const mvs = [[-240, -50], [240, -5], [-220, -240], [240, -55], [0, 190]]
  scene(t, `
  ${head({ eb: 'YOUR BIGGEST ASSET', t: '한곳에 쌓이면<br>*가장 큰 자산*', size: 'h1', at: t + 0.1, y: 250 })}
  ${cols.map((col, i) => card(`<b style="display:block;padding:14px 0 0 44px;font-size:52px;font-weight:800;line-height:1.2">${names[i]}</b>`, t + 0.4 + i * 0.18, { x: 300, y: 1010 - i * 105, w: 420, h: 92, c: col, mv: [sp, sp + 1.2, ...mvs[i]], dim: sp })).join('')}
  ${el(sp + 0.5, '증거로 *못 써요*', { cls: 'abs h3', out: sh - 0.1, style: 'left:72px;top:1150px' })}
  ${person(800, 300, 150, lv, { c: 'blue', mv: [lv + 0.8, lv + 2.2, 260, 0] })}
  ${el(sh, '회사가 *흔들려요*', { cls: 'abs h3', style: 'left:72px;top:1150px' })}`)
}

// ── 조사 ─────────────────────────────────────────────
// 12 L · F(BIG) — 250건 가까이
{
  const t = S(12), k = w('250', '4.2.2')
  scene(t, `
  ${head({ eb: 'OUR RESEARCH · 최근 3년', t: '잘 받는 회사는<br>*뭐가 다를까?*', size: 'h1', at: t + 0.1, y: 250 })}
  ${chip('정책자금', w('정책자금과', '4.2.0'), { x: 72, y: 540, c: 'teal' })}
  ${chip('R&D', w('R&D', '4.2.0'), { x: 400, y: 540, c: 'blue' })}
  ${chip('투자', w('투자를', '4.2.1'), { x: 640, y: 540, c: 'amber' })}
  ${giga('250건', '가까이', k - 0.1, { y: 720 })}
  ${note('미래AI랩이 공개 사례를 조사한 숫자입니다 · 미래AI랩 실적이 아닙니다', t + 0.6)}`, { light: true })
}

// 13 L · B — 반복되는 흐름: 쌓고 → 키우고 → 연결
{
  const t = S(13), a = [c('4.4.0'), c('4.4.1'), c('4.4.2')]
  scene(t, `
  ${head({ eb: 'THE PATTERN', t: '반복되는<br>*흐름*이 있었어요', size: 'h1', at: t + 0.1, y: 250 })}
  ${bigNode('db', '데이터를 쌓고', a[0], { x: 72, y: 540, w: 760, c: 'teal', row: true, dim: a[1] })}
  ${bigNode('users', '플랫폼으로 키우고', a[1], { x: 72, y: 740, w: 760, c: 'blue', row: true, dim: a[2] })}
  ${bigNode('link', '운영과 *하나로*', a[2], { x: 72, y: 940, w: 760, c: 'copper', row: true, hiNode: true })}
  ${lines([[150, 680, 150, 740, a[1] - 0.4, a[1]], [150, 880, 150, 940, a[2] - 0.4, a[2]]], t, { width: 6 })}`, { light: true })
}

// 14 D · H — 거대한 서비스(쿠팡·네이버)가 줄어들어 우리 업종의 작은 서비스로
{
  const t = S(14), big = c('5.1.1'), sm = c('5.2.0'), who = c('5.2.1')
  scene(t, `
  ${el(t + 0.05, 'WHAT WE MEAN BY PLATFORM', { cls: 'abs eyebrow', style: 'left:72px;top:250px' })}
  ${el(t + 0.2, '쿠팡·네이버 같은<br>*거대한 서비스*?', { cls: 'abs h2', out: sm - 0.1, style: 'left:72px;top:300px' })}
  ${el(sm, '우리 업종에 특화된<br>*작은 서비스*', { cls: 'abs h2', style: 'left:72px;top:300px' })}
  ${push(`<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0" data-in="${big}" data-a="fade"><circle cx="540" cy="860" r="330" fill="rgba(232,184,154,.10)" stroke="rgba(232,184,154,.5)" stroke-width="6"/></svg>`, [[sm, sm + 1.2, 1, 0.42]], '540px 860px')}
  ${hub('작은<br>서비스', sm + 1, { x: 420, y: 740 })}
  ${bigNode('users', '고객', w('고객과', '5.2.1'), { x: 72, y: 760, w: 260, c: 'teal' })}
  ${bigNode('building', '거래처', w('거래처가', '5.2.1'), { x: 748, y: 760, w: 260, c: 'blue' })}
  ${lines([[332, 860, 420, 860, who + 0.6, who + 1.1], [748, 860, 660, 860, who + 0.6, who + 1.1]], t, { width: 6 })}`)
}

// 15 L · F(BIG) — 조사 사례: 장부 → 클라우드 → 금융 → 15억 원
{
  const t = S(15), k = w('15억', '5.4.4')
  const st = [['book', '장부', 'amber', c('5.4.0')], ['cloud', '클라우드', 'blue', c('5.4.1')], ['bank', '금융 사업', 'violet', c('5.4.3')]]
  scene(t, `
  ${head({ eb: 'CASE · 렌털업체', t: '실제로 이런 *사례*', size: 'h1', at: t + 0.1, y: 250 })}
  ${st.map(([icon, l, col, a], i) => el(a, `${badge(icon, col, 110)}<span>${l}</span>`, { cls: 'abs h3', a: 'scale', style: `left:${72 + i * 300}px;top:440px;display:flex;flex-direction:column;align-items:flex-start;gap:14px` })).join('')}
  ${lines([[200, 495, 360, 495, c('5.4.1') - 0.3, c('5.4.1')], [500, 495, 660, 495, c('5.4.3') - 0.3, c('5.4.3')]], t, { width: 6 })}
  ${giga('15억 원', '규모', k - 0.1, { y: 760, size: 200 })}
  ${el(k + 0.5, '보증과 금융지원', { cls: 'abs h3', style: 'left:72px;top:1000px' })}
  ${note(CASE, t + 0.6)}`, { light: true })
}

// 16 L · D — 그 밖의 사례 세 곳
{
  const t = S(16)
  scene(t, `
  ${head({ eb: 'MORE CASES', t: '그 밖에도 *성장자금*을', size: 'h2', at: t + 0.1, y: 250 })}
  ${panel('repeat', 'teal', '히트펌프', '운영·모니터링 구독 서비스로', t + 0.4, { y: 400, dim: c('5.5.1') })}
  ${panel('db', 'blue', '수산물 유통', '데이터 기반 B2B 플랫폼으로', c('5.5.1'), { y: 640, dim: c('5.5.2') })}
  ${panel('building', 'amber', '부동산 중개', '공실 관리 자동화 플랫폼으로', c('5.5.2'), { y: 880 })}
  ${note(CASE, t + 0.6)}`, { light: true })
}

// 17 D · E — 업종은 달라도 같은 구조 → 커질 수 있는 회사
{
  const t = S(17), k = c('5.7.0'), up = c('5.7.1')
  scene(t, `
  ${head({ eb: 'SAME STRUCTURE', t: '업종은 달라도<br>*흐름은 같았다*', size: 'h1', at: t + 0.1, y: 250 })}
  ${chip('제조', w('제조', t), { x: 72, y: 540, c: 'teal' })}
  ${chip('유통', w('유통', t), { x: 330, y: 540, c: 'blue' })}
  ${chip('숙박', w('숙박까지', t), { x: 588, y: 540, c: 'amber' })}
  ${lines([[160, 640, 520, 720, k - 0.5, k], [420, 640, 520, 720, k - 0.5, k], [676, 640, 520, 720, k - 0.5, k]], t, { width: 5 })}
  ${panel('users', 'blue', '데이터가 쌓이고<br>사람이 모이는 구조', '', k, { y: 730 })}
  ${el(up, `${badge('up', 'copper', 96)}<span>*커질 수 있는* 회사</span>`, { cls: 'abs h2', style: 'left:72px;top:1030px;display:flex;align-items:center;gap:24px' })}`)
}

// ── 정부와 우리 ───────────────────────────────────────
// 18 D · F(BIG) — 정부 공식 발표 · AX · 7,540억 원
{
  const t = S(18), ax = w('AX라고', '6.2.0'), k = w('7540', '6.2.2')
  scene(t, `
  ${head({ eb: 'GOVERNMENT · 공식 발표', t: 'AI 도입 기업을<br>*밀어주겠다*', size: 'h1', at: t + 0.1, y: 250 })}
  ${el(ax - 0.6, 'AI·데이터로 일하는 방식을<br>바꾸는 것 = *AX*', { cls: 'abs h3', style: 'left:72px;top:520px' })}
  ${el(c('6.2.1'), '중소벤처기업부 · AX 도입 기업 융자', { cls: 'abs tagline', a: 'fade', style: 'left:72px;top:720px' })}
  ${giga('7,540억', '원', k - 0.1, { y: 800, size: 190 })}
  ${note('정부 발표 내용입니다 · 미래AI랩 실적이 아닙니다', t + 0.6)}`)
}

// 19 L · H — 정부·심사위원·투자자 모두 ✓ → 플랫폼 + AX
{
  const t = S(19), ok = c('6.4.1'), k = c('6.4.2')
  const P = [['정부', 'teal', w('정부와', '6.4.0')], ['심사위원', 'violet', w('심사위원', '6.4.0')], ['투자자', 'amber', w('투자자가', '6.4.0')]]
  scene(t, `
  ${head({ eb: 'MIRAE AI LAB', t: '그래서 저희는<br>*한 걸음 더*', size: 'h1', at: t + 0.1, y: 250 })}
  ${P.map(([l, col, a], i) => person(110 + i * 320, 560, 170, a, { light: true, c: col }) + el(a + 0.2, l, { cls: 'plate', a: 'fade', style: `left:${130 + i * 320}px;top:790px` }) + el(ok + i * 0.2, ic('check'), { cls: 'ibadge abs', a: 'scale', style: `left:${210 + i * 320}px;top:520px;width:76px;height:76px;--c:var(--green)` })).join('')}
  ${hub('플랫폼<br>+ AX', k, { x: 420, y: 900 })}
  ${lines([[195, 840, 460, 960, k - 0.3, k + 0.3], [540, 840, 540, 900, k - 0.3, k + 0.3], [885, 840, 620, 960, k - 0.3, k + 0.3]], t, { width: 5 })}`, { light: true })
}

// ── 제품 ─────────────────────────────────────────────
// 20 D · A → I — '안과 밖' 큰 문장 → 휴대폰이 앞으로(대표님 폰 한 화면)
{
  const t = S(20), k = c('7.2.0'), one = c('7.2.1')
  const it = [['직원', w('직원', '7.2.0'), 'blue'], ['고객', w('고객', '7.2.0'), 'teal'], ['재고', w('재고', '7.2.0'), 'amber'], ['정산', w('정산을', '7.2.0'), 'green']]
  scene(t, `
  ${mega('안과 밖을<br>*함께* 연결', t + 0.1, { y: 520, size: 140, out: k - 0.1 })}
  ${push(flowPhone('lvax', ['00', '01'], [one + 0.8], { at: k, x: 72, y: 228, w: 486 }), [[k, k + 1.1, 0.55, 1, 0, 300, 0, 0]], '315px 760px')}
  ${rhead({ eb: 'INSIDE', t: '대표님 폰<br>*한 화면*에', at: k + 0.3, y: 300 })}
  ${it.map(([s, a, col], i) => check(s, a, { x: 590, y: 560 + i * 120, c: col })).join('')}
  ${el(k + 0.6, SAMPLE, { cls: 'note', a: 'fade', style: 'left:590px;width:370px' })}`)
}

// 21 L · C — PC 뒤 + 휴대폰 앞: 고객이 직접 견적·주문·예약
{
  const t = S(21), q = w('견적', '7.2.3'), o = w('주문', '7.2.3'), r = w('예약을', '7.2.3')
  scene(t, `
  ${head({ eb: 'OUTSIDE', t: '밖에서는 *고객이 직접*', size: 'h2', at: t + 0.05, y: 250 })}
  ${browser31({ x: 72, y: 400, w: 780, at: t + 0.2, url: 'SAMPLE · 고객 플랫폼', layers: [{ src: SH('ax-livarte') }] })}
  ${flowPhone('lvcu', ['00', '01', '02'], [q + 0.3, r + 0.3], { at: t + 0.5, x: 600, y: 452, w: 360 })}
  ${chip('견적', q, { x: 72, y: 960, c: 'blue' })}
  ${chip('주문', o, { x: 72, y: 1060, c: 'amber' })}
  ${chip('예약', r, { x: 72, y: 1160, c: 'copper' })}
  ${note(SAMPLE, t + 0.6)}`, { light: true })
}

// 22 L · B — 둘을 잇는 AI → 성장 계획을 화면으로
{
  const t = S(22), ai = w('AI가', '7.3.1'), k = c('7.4.0')
  scene(t, `
  ${head({ eb: 'CONNECTED BY AI', t: 'AI가 데이터를 읽고<br>*다음 할 일*까지', size: 'h2', at: t + 0.1, y: 250 })}
  ${bigNode('building', '안', t + 0.3, { x: 72, y: 470, w: 240, c: 'teal', dim: k })}
  ${bigNode('users', '밖', t + 0.5, { x: 768, y: 470, w: 240, c: 'blue', dim: k })}
  ${hub('AI', ai, { x: 420, y: 440 })}
  ${lines([[312, 560, 420, 560, ai - 0.2, ai + 0.4], [768, 560, 660, 560, ai - 0.2, ai + 0.4]], t, { width: 6 })}
  ${push(browser31({ x: 72, y: 730, w: 888, h: 500, at: k, url: 'SAMPLE · 성장 계획', layers: [{ src: SH('ax-lumiere-dash') }] }), [[k, k + 6, 1, 1.05]], '516px 980px')}
  ${note(SAMPLE, k + 0.4)}`, { light: true })
}

// 23 D · C — 말 대신 돌아가는 화면: 직접 눌러 보게
{
  const t = S(23), tap = w('직접', '8.1.3'), g = c('8.2.0')
  scene(t, `
  ${flowPhone('lvstyle', ['00', '01', '02'], [tap + 0.3, tap + 1.5], { at: t + 0.2, x: 72, y: 228, w: 486 })}
  ${strikeLine('자금이<br>들어오면', t + 0.1, w('대신에', '8.1.0'), { x: 590, y: 260 })}
  ${el(c('8.1.1'), '이미<br>*돌아가는*<br>화면', { cls: 'abs h3', style: 'left:590px;top:420px' })}
  ${el(c('8.1.2'), '진짜<br>*되나요?*', { cls: 'bubble r abs', a: 'up', style: 'left:590px;top:680px;--c:var(--violet)' })}
  ${el(c('8.1.3'), '<span class="mark">✓</span><span>직접<br>눌러 보게</span>', { cls: 'check abs', a: 'left', style: 'left:590px;top:900px;--c:var(--green)' })}
  ${el(g, '*다음 단계*가<br>보이는 회사', { cls: 'abs h3', style: 'left:590px;top:1090px' })}
  ${el(t + 0.6, SAMPLE, { cls: 'note', a: 'fade', style: 'left:72px' })}`)
}

// ── 우리 ─────────────────────────────────────────────
// 24 D · F(BIG) — 업종별 화면 20개+
{
  const t = S(24), k = w('20', '9.1.1')
  const sw = [['ax-gounsot', t + 0.2], ['ax-edumaster', w('학원', '9.1.0')], ['ax-seum', w('제조', '9.1.0')], ['ax-nexmart', w('유통까지', '9.1.0')]]
  scene(t, `
  ${head({ eb: 'BUILT BY US', t: '업종별 화면을<br>*직접* 만들었어요', size: 'h2', at: t + 0.1, y: 250 })}
  ${browser31({ x: 72, y: 470, w: 888, h: 520, at: t + 0.2, url: 'SAMPLE · 업종별 AX', layers: sw.map(([n, a], i) => ({ src: SH(n), at: i ? a : undefined })) })}
  ${giga('20개+', '', k - 0.1, { y: 1020, size: 200 })}
  ${el(k + 0.4, '음식점 · 학원<br>제조 · 유통', { cls: 'abs tagline', a: 'fade', style: 'left:640px;top:1090px;line-height:1.4' })}`)
}

// 25 L · F(BIG) — 특허 5건 출원 → 회사 정보를 넣으면 한 화면에
{
  const t = S(25), pt = c('9.3.0'), k = c('9.3.1')
  scene(t, `
  ${head({ eb: 'WE WORK WITH AX', t: '저희도 *AX로*<br>일하고 있어요', size: 'h1', at: t + 0.1, y: 250 })}
  ${giga('5건', '특허 출원', pt, { y: 520, out: k - 0.1 })}
  ${el(pt + 0.4, 'AX 핵심기술 · 올해 9월', { cls: 'abs h3', out: k - 0.1, style: 'left:72px;top:790px' })}
  ${el(k, '회사 정보를 넣으면<br>*한 화면에* 먼저', { cls: 'abs h2', style: 'left:72px;top:520px' })}
  ${panel('coin', 'green', '받을 수 있는 지원금', '', w('지원금과', '9.3.2'), { y: 720 })}
  ${panel('shield', 'blue', '챙겨야 할 인증', '', w('인증', '9.3.2'), { y: 880 })}
  ${panel('receipt', 'amber', '절세 포인트', '', c('9.3.3'), { y: 1040 })}
  ${note('특허는 출원 상태입니다(등록 아님)', pt + 0.4)}`, { light: true })
}

// 26 L · D — 매일 오는 새 지원사업 알림 · 감과 기억 대신 시스템
{
  const t = S(26), sy = c('9.5.1')
  scene(t, `
  ${head({ eb: 'SYSTEM FIRST', t: '새 지원사업도<br>*매일* 알려 드려요', size: 'h1', at: t + 0.1, y: 250 })}
  ${[0, 1, 2].map((i) => el(t + 0.5 + i * 0.35, `${badge('bell', ['teal', 'blue', 'amber'][i], 72)}<span>새 공고 알림</span>`, { cls: 'abs h3', a: 'left', dim: c('9.5.0'), style: `left:${120 + i * 60}px;top:${520 + i * 110}px;display:flex;align-items:center;gap:18px` })).join('')}
  ${strikeLine('감과 기억', c('9.5.0'), w('아니라', '9.5.0'), { y: 900 })}
  ${el(sy, '<span class="mark">✓</span><span>시스템이 *먼저*</span>', { cls: 'check abs hlbox', a: 'left', hl: c('9.5.2'), style: 'left:72px;top:1010px;--c:var(--copper)' })}`, { light: true })
}

// ── 마무리 ───────────────────────────────────────────
// 27 D · H + I — 다음 심사: 질문하는 심사위원 앞으로 휴대폰이 다가온다
{
  const t = S(27), q = w('그래서', '10.1.0'), k = c('10.1.2')
  scene(t, `
  ${panelTable({ at: t + 0.1, y: 260, n: 3, w: 170 })}
  ${el(q, '“그래서, *다음은*?”', { cls: 'bubble abs', a: 'up', style: 'left:72px;top:620px;--c:var(--violet)' })}
  ${push(flowPhone('cwax', ['00', '01'], [k + 1.2], { at: k - 0.2, x: 297, y: 760, w: 486 }), [[k - 0.2, k + 1, 0.45, 1, 0, 500, 0, 0]], '540px 1290px')}`)
}

// 28 D · A(BIG) — 무엇부터 보여 줄까 → 3분 진단
{
  const t = S(28)
  scene(t, `
  ${mega('우리 회사는<br>*무엇부터*?', t + 0.1, { y: 400, size: 130 })}
  ${xl(chip('3분 기업성장·AX Fit 진단', c('10.3.0'), { x: 72, y: 800, c: 'copper' }))}`)
}

// 29 L · G — 영상 2로 이어서 → 로고
{
  const t = S(29)
  scene(t, `
  ${deco('ring', 840, 120, 260, 'teal', t + 0.2)}${deco('disc', -80, 1150, 240, 'amber', t + 0.4)}
  ${endCard({ at: t + 0.1, sub: '진행 방식과 비용은 다음 영상에서', subAt: t + 0.3, line: '영상 2 · 어떻게 진행하고,<br>*얼마가 드나*', lineAt: c('10.4.1'), cta: ['3분 AX Fit 진단', 'miraeailab.com'], ctaAt: R.VOICE_END - 0.4 })}`, { light: true })
}

R.finish()
