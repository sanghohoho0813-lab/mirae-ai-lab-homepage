// 영상 2 · 어떻게 진행하고, 얼마가 드나 — 영상 스타일 v3.3(BIG INFOGRAPHIC · DIRECTORIAL VISUAL · PRODUCT MOTION) · 비교용 시안
// 장면표: ../SCENES.md — 시퀀스: 질문 · 4단계 · 달라지는 회사 · 밖에서 보는 회사 · 비용 · 신청까지 · 정리
// v3.3: 자막 52px(한 줄 16자) · 읽는 본문 52px 이상 · BIG MOMENT(120~260px) · 상황 연출(심사 테이블 · 매장 · 하나의 공간) · PRODUCT PUSH
// 음성·자막 정렬: v2/film-2 최종 음성(1.13배 · 쉼 줄임 · -14 LUFS) 그대로. 대표님 녹음이라 배경음악은 넣지 않았다.
// ⚠️ 승인·선정 약속 문구 없음. 특허는 '출원'. 벤처기업확인은 '신청까지'. 앱 화면은 미래AI랩이 직접 만든 샘플(예시 데이터).
import { createReel2, ic } from '../../lib/reels2.mjs'
import { stage33 } from '../../lib/stage33.mjs'

const R = createReel2('.', { title: '영상 2 · 어떻게 진행하고, 얼마가 드나', v33: true })
const { c, w, scene, el, head, note, chip, row, numtag, hub, card, deco, lines, browser31, endCard } = R
const { badge, panel, giga, mega, person, panelTable, docPile, push, flowPhone } = stage33(R)
const SAMPLE = '영상 속 화면은 미래AI랩이 직접 만든 샘플(예시 데이터)입니다'
const SH = (n) => `assets/shots/${n}.jpg`
const bigNode = (icon, t, at, o) => R.node(`${ic(icon)}${t}${o.sub ? `<small>${o.sub}</small>` : ''}`, at, o).replace('class="node abs', `class="node lg${o.row ? ' hz' : ''} abs`)
const rhead = (o) => head(o).replace('left:72px;right:120px', 'left:590px;right:72px')
const strikeLine = (t, at, sAt, o) => el(at, `<span class="st">${t}<span class="sl" data-strike="${sAt}"></span></span>`, { cls: `abs ${o.cls ?? 'h3'} strike-wrap dimtxt`, out: o.out, style: `left:${o.x ?? 72}px;top:${o.y}px` })
const xl = (html) => html.replace(/chip dot abs( big)?/, 'chip dot abs big')
/** 체크 줄(52px) — mark: ✓ ↑ ↓ ! → */
const chk = (t, at, o = {}) => el(at, `<span class="mark">${o.mark ?? '✓'}</span><span>${t}</span>`, { cls: `check abs${o.hl != null ? ' hlbox' : ''}`, a: 'left', dim: o.dim, out: o.out, hl: o.hl, style: `left:${o.x ?? 72}px;top:${o.y}px;--c:var(--${o.c ?? 'copper'})` })
const eyebrow = (t, at, y = 250) => el(at, t, { cls: 'abs eyebrow', style: `left:72px;top:${y}px` })
const sampleR = (at, y = 1170, o = {}) => el(at, SAMPLE, { cls: 'note', a: 'fade', out: o.out, style: `left:590px;width:370px;top:${y}px` })

const B = [0, c('2.1.0') - 0.1, c('2.3.0') - 0.1, c('3.1.0') - 0.1, c('3.2.0') - 0.1, c('3.4.0') - 0.1, c('3.4.2') - 0.1, c('3.5.0') - 0.1,
  c('4.1.0') - 0.1, c('4.3.0') - 0.1, c('4.4.0') - 0.1, c('5.1.0') - 0.1, c('5.2.1') - 0.1, c('6.1.0') - 0.1, c('6.3.0') - 0.1, c('6.5.0') - 0.1,
  c('6.6.0') - 0.1, c('6.7.0') - 0.1, c('6.8.0') - 0.1, c('7.1.0') - 0.1, c('7.3.0') - 0.1, c('7.4.0') - 0.1, c('8.1.0') - 0.1, c('8.3.0') - 0.1,
  c('8.4.0') - 0.1, c('8.4.2') - 0.1, c('9.1.0') - 0.1, c('9.2.0') - 0.1, c('10.1.0') - 0.1, c('11.1.0') - 0.1, c('11.2.1') - 0.1, c('11.3.0') - 0.1,
  c('12.1.0') - 0.1, c('12.3.0') - 0.1, c('12.4.0') - 0.1]
const S = (i) => B[i - 1]

// ── 질문 ─────────────────────────────────────────────
// 1 D · A(BIG) — 좋아 보이긴 하는데… 그래서 얼마가?
{
  const q = c('1.2.1'), k = w('얼마가', '1.2.1')
  scene(0, `
  ${deco('sq', 880, 1060, 170, 'copper', 0.4)}
  ${eyebrow('AFTER VIDEO 1', 0.2)}
  ${person(760, 280, 200, 0.4, { c: 'copper' })}${el(0.6, '대표님', { cls: 'plate', a: 'fade', style: 'left:810px;top:550px' })}
  ${el(0.3, '영상을 보고…', { cls: 'abs h2', out: c('1.2.0') - 0.1, style: 'left:72px;top:300px' })}
  ${el(c('1.2.0'), '좋아 보이긴 하는데…', { cls: 'abs h2', style: 'left:72px;top:300px' })}
  ${mega('어떻게<br>진행되고', q, { y: 470, size: 140 })}
  ${mega('*얼마가*?', k - 0.1, { y: 790, size: 220 })}
  ${xl(chip('지금부터 답해 드릴게요', c('1.3.0'), { x: 72, y: 1100, c: 'copper' }))}`)
}

// ── 4단계 ────────────────────────────────────────────
// 2 L · F(BIG) — 총 4단계 → 첫째 진단
{
  const t = S(2), k = w('4단계', '2.1.0'), d = w('진단', '2.2.0')
  const cols = ['teal', 'blue', 'amber', 'violet']
  scene(t, `
  ${head({ eb: 'HOW IT WORKS', t: '진행은 총', size: 'h1', at: t + 0.1, y: 250 })}
  ${giga('4단계', '', k - 0.1, { y: 420 })}
  ${lines([[160, 860, 870, 860, k + 0.3, k + 1.1]], t, { width: 6 })}
  ${cols.map((col, i) => el(k + 0.4 + i * 0.15, String(i + 1), { cls: 'abs', a: 'scale', dim: i ? d : undefined, style: `left:${72 + i * 236}px;top:770px;width:180px;height:180px;border-radius:50%;background:var(--${col});color:#fff;display:grid;place-items:center;font-size:96px;font-weight:900` })).join('')}
  ${el(d, '첫째 · *진단*', { cls: 'abs h1', style: 'left:72px;top:1000px' })}`, { light: true })
}

// 3 D · H — 9년 차 경영컨설턴트 + 특허 출원 AX → 성장 단계·업무 → 설계도
{
  const t = S(3), pat = w('특허까지', '2.3.1'), see = c('2.3.2'), bp = c('2.3.3'), k = w('설계도', '2.3.3')
  scene(t, `
  ${eyebrow('STEP 1 · 진단', t + 0.05)}
  ${person(72, 310, 190, t + 0.1, { c: 'copper' })}
  ${el(t + 0.3, '9년 차<br>*경영컨설턴트*', { cls: 'abs h2', style: 'left:310px;top:350px' })}
  ${xl(chip('특허 출원한 AX', pat, { x: 72, y: 600, c: 'teal' }))}
  ${chip('성장 단계', see, { x: 72, y: 740, c: 'blue' })}
  ${chip('업무', w('업무를', '2.3.2'), { x: 430, y: 740, c: 'amber' })}
  ${el(see + 0.6, badge('search', 'violet', 100), { cls: 'abs', a: 'scale', style: 'left:690px;top:734px' })}
  ${el(bp, '', { cls: 'abs', a: 'card', style: 'left:72px;top:880px;width:888px;height:350px;border-radius:28px;background-color:#1f3b5c;background-image:linear-gradient(rgba(255,255,255,.09) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.09) 2px,transparent 2px);background-size:48px 48px' })}
  ${lines([{ d: 'M120 925 H480 V1185 H120 Z', t0: bp + 0.2, t1: bp + 1.2 }, { d: 'M530 925 H910 V1045 H530 Z', t0: bp + 0.6, t1: bp + 1.5 }, { d: 'M530 1075 H910 V1185 H530 Z', t0: bp + 0.9, t1: bp + 1.8 }, { d: 'M480 1055 H530', t0: bp + 1.4, t1: bp + 1.8 }], t, { width: 4, c: '#cfe3ff' })}
  ${el(k, '설계도', { cls: 'abs h1', style: 'left:168px;top:1000px;color:#fff' })}
  ${el(k + 0.4, '무엇부터', { cls: 'abs h3', style: 'left:570px;top:952px;color:#cfe3ff' })}
  ${el(k + 0.6, '어떻게', { cls: 'abs h3', style: 'left:570px;top:1097px;color:#cfe3ff' })}
  ${note('특허는 출원 상태입니다(등록 아님)', pat + 0.4)}`)
}

// 4 L · F(BIG) — 2주 안에 MVP·기본 틀(14칸이 채워진다)
{
  const t = S(4), k = w('2주', '3.1.0'), m = c('3.1.1')
  scene(t, `
  ${eyebrow('STEP 2 · MVP', t + 0.05)}
  ${giga('2주', '안에', k - 0.1, { y: 310, size: 260 })}
  ${Array.from({ length: 14 }, (_, i) => el(k + 0.3 + i * 0.1, '', { cls: 'abs', a: 'scale', style: `left:${72 + (i % 7) * 122}px;top:${640 + Math.floor(i / 7) * 122}px;width:100px;height:100px;border-radius:22px;background:var(--${i === 13 ? 'copper' : 'teal'})` })).join('')}
  ${el(m, 'MVP와 *기본 틀*', { cls: 'abs h1', style: 'left:72px;top:930px' })}
  ${el(m + 0.5, 'MVP = 최소 기능 제품', { cls: 'abs h3', style: 'left:72px;top:1070px' })}`, { light: true })
}

// 5 D · H — 다 갈아엎을 필요 없어요: 기존 프로그램은 그대로 + 필요한 데이터만 하나씩
{
  const t = S(5), keep = w('그대로', '3.3.0'), con = c('3.3.1')
  scene(t, `
  ${head({ eb: 'KEEP WHAT YOU USE', t: '다 갈아엎을<br>*필요는 없어요*', size: 'h1', at: t + 0.1, y: 250 })}
  ${card(`<div style="padding:40px 40px 0 48px">${badge('gear', 'blue', 100)}<b style="display:block;margin-top:24px;font-size:56px;font-weight:800;line-height:1.2">지금 쓰는<br>프로그램</b></div>`, t + 0.5, { x: 72, y: 560, w: 400, h: 380, c: 'blue' })}
  ${chk('*그대로*', keep, { y: 975, c: 'green' })}
  ${hub('새<br>플랫폼', con, { x: 720, y: 630 })}
  ${lines([[472, 680, 720, 720, con + 0.2, con + 0.7], [472, 750, 720, 750, con + 0.8, con + 1.3], [472, 820, 720, 780, con + 1.4, con + 1.9]], t, { width: 6, c: 'copper' })}
  ${el(con + 0.4, '필요한 데이터만<br>*하나씩* 연결', { cls: 'abs h2', style: 'left:72px;top:1085px' })}`)
}

// 6 L · H — 일반 중소기업: ERP의 주문·재고·매출 데이터를 연동
{
  const t = S(6), erp = w('ERP를', '3.4.0'), k = c('3.4.1')
  const d = [['주문', 'blue', w('주문', '3.4.1'), 72], ['재고', 'amber', w('재고', '3.4.1'), 342], ['매출', 'green', w('매출', '3.4.1'), 612]]
  scene(t, `
  ${head({ eb: 'EXAMPLE · 일반 중소기업', t: '*ERP*를 쓰고 있다면', size: 'h1', at: t + 0.1, y: 250 })}
  ${bigNode('db', 'ERP', erp, { x: 72, y: 410, w: 330, c: 'blue', row: true })}
  ${d.map(([s, col, a, x]) => chip(s, a, { x, y: 570, c: col })).join('')}
  ${lines(d.map(([, , a, x]) => [x + 100, 672, x + 100, 730, a + 0.2, a + 0.6]), t, { width: 6, c: 'copper' })}
  ${push(browser31({ x: 72, y: 730, w: 888, h: 500, at: k + 0.2, url: 'SAMPLE · 우리 회사 AX', layers: [{ src: SH('ax-materix') }] }), [[k + 0.2, k + 4.5, 1, 1.04]], '516px 980px')}
  ${note(SAMPLE, k + 0.6)}`, { light: true })
}

// 7 L · C — 2호점·3호점 음식점: 포스기 매출 → 매장 전체 브리핑(휴대폰)
{
  const t = S(7), pos = w('포스기의', '3.4.3')
  const st = [['본점', 'teal', w('2호점', '3.4.2') - 0.3], ['2호점', 'blue', w('2호점', '3.4.2')], ['3호점', 'amber', w('3호점까지', '3.4.2')]]
  scene(t, `
  ${flowPhone('gsax', ['01', '02'], [pos + 1.6], { at: t + 0.2, x: 72, y: 228, w: 486 })}
  ${rhead({ eb: 'EXAMPLE · 음식점', t: '여러 매장의<br>*포스기* 매출', at: t + 0.1, y: 260 })}
  ${st.map(([s, col, a], i) => el(a, `${badge('store', col, 84)}<span>${s}</span>`, { cls: 'abs h3', a: 'left', style: `left:610px;top:${540 + i * 130}px;display:flex;align-items:center;gap:18px` })).join('')}
  ${lines([[600, 582, 560, 640, pos - 0.2, pos + 0.3], [600, 712, 560, 700, pos - 0.1, pos + 0.4], [600, 842, 560, 760, pos, pos + 0.5]], t, { width: 5, c: 'copper' })}
  ${chk('그대로<br>*가져와요*', pos + 0.3, { x: 590, y: 950, mark: '→' })}
  ${sampleR(t + 0.6)}`, { light: true })
}

// 8 D · H — 천천히 적응: 계단 위 직원들 · 부담과 반발 ↓
{
  const t = S(8), k = c('3.5.1')
  scene(t, `
  ${head({ eb: 'STEP BY STEP', t: '천천히<br>*적응*하면서', size: 'h1', at: t + 0.1, y: 250 })}
  ${lines([{ d: 'M72 900 H270 V840 H470 V780 H670 V720 H870 V660 H1008', t0: t + 0.3, t1: t + 1.6 }], t, { width: 6, c: 'copper' })}
  ${[[96, 900, 'teal'], [496, 780, 'blue'], [896, 660, 'amber']].map(([x, by, col], i) => person(x, by - 195, 150, t + 0.6 + i * 0.25, { c: col })).join('')}
  ${chk('직원분들의<br>*부담과 반발*', k, { y: 975, mark: '↓', c: 'green' })}`)
}

// 9 L · H — STEP 3 실제 업무 자료 → 다듬고·테스트 → 데이터가 쌓인다
{
  const t = S(9), doc = c('4.2.0'), fit = c('4.2.1'), st = c('4.2.2')
  const blk = [['고객', 'teal'], ['주문', 'blue'], ['재고', 'amber'], ['기록', 'violet']]
  scene(t, `
  ${head({ eb: 'STEP 3 · DATA', t: '*데이터*를 쌓는 단계', size: 'h1', at: t + 0.1, y: 250 })}
  ${docPile({ at: doc, count: 7, x0: 60, y0: 440, x1: 520, y1: 900, seed: 5, step: 0.12 })}
  ${el(doc + 0.4, '실제 업무 자료', { cls: 'abs h3', style: 'left:72px;top:960px' })}
  ${bigNode('gear', '다듬고<br>테스트', fit, { x: 600, y: 440, w: 360, c: 'blue' })}
  ${lines([[500, 640, 600, 580, fit - 0.2, fit + 0.3], [780, 735, 780, 790, st - 0.3, st]], t, { width: 6, c: 'copper' })}
  ${blk.map(([s, col], i) => card(`<b style="display:block;padding:10px 0 0 44px;font-size:52px;font-weight:800;line-height:1.2">${s}</b>`, st + i * 0.25, { x: 600, y: 1130 - i * 100, w: 360, h: 86, c: col })).join('')}`, { light: true })
}

// 10 D · F — 쌓일수록 AI가 더 정확 → 심사에서 핵심 근거
{
  const t = S(10), acc = c('4.3.0'), ev = c('4.3.1'), k = w('핵심', '4.3.1')
  scene(t, `
  ${head({ eb: 'MORE DATA · BETTER AI', t: '쌓일수록<br>AI도 *더 정확*', size: 'h1', at: t + 0.1, y: 250 })}
  ${el(acc, 'AI 정확도', { cls: 'ylabel abs', a: 'fade', style: 'left:72px;top:560px' })}
  <div class="track abs" style="left:72px;top:645px;width:888px;height:26px" data-in="${acc}" data-a="fade"><div class="fill" style="--c:var(--teal)" data-grow="${acc},${acc + 2},830"></div></div>
  ${person(72, 760, 170, ev, { c: 'violet' })}${el(ev + 0.2, '심사위원', { cls: 'plate', a: 'fade', style: 'left:84px;top:990px' })}
  ${el(ev + 0.3, '', { cls: 'doc abs', a: 'card', style: 'left:300px;top:740px;width:220px;height:290px;background-size:60% 20px, 78% 180px;background-position:22px 30px, 22px 80px' })}
  ${el(k, ic('check'), { cls: 'ibadge abs', a: 'scale', style: 'left:450px;top:950px;width:100px;height:100px;--c:var(--copper)' })}
  ${el(k, '심사의<br>*핵심 근거*', { cls: 'abs h2', style: 'left:600px;top:800px' })}`)
}

// 11 L · E — 회사의 자산 → 구독형 서비스 같은 새 사업
{
  const t = S(11), as = w('자산', '4.4.0'), sub = c('4.4.1')
  scene(t, `
  ${eyebrow('ASSET', t + 0.05)}
  ${el(t + 0.1, badge('db', 'teal', 150), { cls: 'abs', a: 'scale', style: 'left:72px;top:320px' })}
  ${lines([[250, 395, 340, 395, as - 0.3, as]], t, { width: 6, c: 'copper' })}
  ${el(as - 0.1, badge('coin', 'amber', 150), { cls: 'abs', a: 'scale', style: 'left:360px;top:320px' })}
  ${mega('회사의<br>*자산*이 되고', as, { y: 540, size: 140 })}
  ${panel('repeat', 'blue', '구독형 서비스', '같은 새 사업으로', sub, { y: 900 })}`, { light: true })
}

// 12 D · H — STEP 4 외부에서 볼 때 매력적인 회사 + 벤처기업확인 신청까지 기본 포함
{
  const t = S(12), out = w('외부에서', '5.1.0'), at = c('5.1.1'), v = c('5.2.0'), k = w('기본으로', '5.2.0')
  scene(t, `
  ${head({ eb: 'STEP 4 · 외부에서 볼 때', t: '*매력적인 회사*로', size: 'h1', at: t + 0.1, y: 250 })}
  ${person(72, 470, 170, out, { c: 'blue' })}${el(out + 0.2, '투자자', { cls: 'plate', a: 'fade', style: 'left:96px;top:700px' })}
  ${person(838, 470, 170, out + 0.2, { c: 'violet' })}${el(out + 0.4, '심사위원', { cls: 'plate', a: 'fade', style: 'left:842px;top:700px' })}
  ${lines([[250, 580, 385, 580, at - 0.2, at + 0.3], [830, 580, 695, 580, at - 0.2, at + 0.3]], t, { width: 5 })}
  ${bigNode('building', '우리<br>회사', at, { x: 390, y: 450, w: 300, c: 'copper', hiNode: true })}
  ${chk('벤처기업확인 신청까지<br>*기본 포함*', v, { y: 860, c: 'green', hl: k })}
  ${el(v + 0.3, '어떤 상품이든', { cls: 'abs h3', style: 'left:164px;top:1030px' })}
  ${note('벤처기업확인 심사수수료(확인기관 납부 · 혁신성장유형 기준 45만 5천 원, 부가세 포함)는 별도입니다', v + 0.6)}`)
}

// 13 L · B — 비재무(기업 인증) + 재무(신용등급·부채비율) 함께 다듬기
{
  const t = S(13), tog = c('5.2.3')
  const colCard = (x, icon, col, ttl, items, at) => card(`<div style="padding:36px 36px 0 44px">${badge(icon, col, 96)}<b style="display:block;margin-top:22px;font-size:64px;font-weight:800;line-height:1.2">${ttl}</b></div>`, at, { x, y: 420, w: 430, h: 640, c: col })
    + items.map(([s, a], i) => chip(s, a, { x: x + 40, y: 720 + i * 130, c: col })).join('')
  scene(t, `
  ${eyebrow('NON-FINANCIAL · FINANCIAL', t + 0.05)}
  ${el(t + 0.1, '두 가지를 *함께*', { cls: 'abs h1', style: 'left:72px;top:300px' })}
  ${colCard(72, 'shield', 'teal', '비재무', [['기업 인증', w('기업', '5.2.1')]], t + 0.3)}
  ${colCard(530, 'bank', 'blue', '재무', [['신용등급', w('신용등급', '5.2.2')], ['부채비율', w('부채비율', '5.2.2')]], c('5.2.2') - 0.2)}
  ${chk('함께 *다듬어* 갑니다', tog, { y: 1100, mark: '↑' })}`, { light: true })
}

// ── 달라지는 회사 ─────────────────────────────────────
// 14 D · A → I — '이렇게 달라집니다' → 대표님 폰 한 화면(PRODUCT PUSH)
{
  const t = S(14), k = c('6.2.0'), one = w('한', '6.2.1'), sell = c('6.2.2'), leak = c('6.2.3')
  const it = [['매출', w('매출', '6.2.0'), 'green'], ['재고', w('재고', '6.2.0'), 'amber'], ['처리 현황', w('직원별', '6.2.0'), 'blue']]
  scene(t, `
  ${mega('우리 회사는<br>*이렇게*<br>달라집니다', t + 0.1, { y: 420, size: 140, out: k - 0.1 })}
  ${push(flowPhone('seum', ['00', '01'], [one + 0.6], { at: k, x: 72, y: 228, w: 486 }), [[k, k + 1.1, 0.55, 1, 0, 300, 0, 0]], '315px 760px')}
  ${rhead({ eb: 'ONE SCREEN', t: '대표님 폰<br>*한 화면*에', at: k + 0.3, y: 300 })}
  ${it.map(([s, a, col], i) => chk(s, a, { x: 590, y: 560 + i * 120, c: col, out: sell - 0.1 })).join('')}
  ${chk('잘 팔리는<br>*상품*', sell, { x: 590, y: 560, mark: '↑', c: 'green' })}
  ${chk('새는<br>*시간과 돈*', leak, { x: 590, y: 760, mark: '!', c: 'rose' })}
  ${sampleR(k + 0.6, 1000)}`)
}

// 15 L · C — PC 뒤 + 휴대폰 앞: AI가 판단할 근거까지 → 더 밀고 · 막고
{
  const t = S(15), p = c('6.4.0'), stop = w('새는', '6.4.0')
  scene(t, `
  ${head({ eb: 'AI · NEXT ACTION', t: 'AI가 판단할<br>*근거*까지', size: 'h1', at: t + 0.1, y: 250 })}
  ${browser31({ x: 72, y: 540, w: 700, at: t + 0.3, url: 'SAMPLE · AX 대시보드', layers: [{ src: SH('ax-seum') }], out: p - 0.1 })}
  ${flowPhone('seum', ['02'], [], { at: t + 0.6, x: 640, y: 480, w: 330, out: p - 0.1 })}
  ${panel('up', 'green', '잘 팔리는 건 *더 밀고*', '', p, { y: 600 })}
  ${panel('x', 'rose', '새는 것은 *막고*', '', stop, { y: 840 })}
  ${note(SAMPLE, t + 0.6, { out: p - 0.1 })}`, { light: true })
}

// 16 D · H — 카카오톡처럼 하나의 공간 · 권한에 맞는 화면만 · 입력할 것만
{
  const t = S(16), one = w('하나의', '6.5.0'), role = c('6.5.1'), inp = c('6.5.2')
  const R3 = [['현장', 'teal'], ['사무', 'blue'], ['관리', 'amber']]
  scene(t, `
  ${head({ eb: 'ONE SPACE FOR THE TEAM', t: '카카오톡처럼<br>*하나의 공간*', size: 'h1', at: t + 0.1, y: 250 })}
  ${el(one, '', { cls: 'abs glass', a: 'card', style: 'left:72px;top:540px;width:888px;height:560px;border-radius:44px' })}
  ${R3.map(([, col], i) => person(140 + i * 290, 570, 150, one + 0.3 + i * 0.15, { c: col })).join('')}
  ${R3.map(([s, col], i) => el(role + i * 0.25, `<span style="display:block;font-size:56px;font-weight:800">${s}</span><i style="display:block;width:120px;height:10px;margin-top:14px;border-radius:5px;background:rgba(255,255,255,.55)"></i><i style="display:block;width:84px;height:10px;margin-top:10px;border-radius:5px;background:rgba(255,255,255,.4)"></i>`, { cls: 'abs', a: 'up', style: `left:${110 + i * 290}px;top:790px;width:210px;height:200px;border-radius:26px;background:var(--${col});color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center` })).join('')}
  ${el(role + 0.9, '각자 권한에 맞는 화면만', { cls: 'abs h3', style: 'left:110px;top:1012px' })}
  ${chk('입력할 것만 *입력*', inp, { y: 1140, c: 'green' })}`)
}

// 17 L · E — 담당자가 바뀌어도 기록은 그대로 → 인수인계에 매달릴 일 ↓
{
  const t = S(17), ch = w('바뀌어도', '6.6.0'), k = w('그대로', '6.6.0'), hand = c('6.6.1'), less = w('줄고요', '6.6.1')
  scene(t, `
  ${head({ eb: 'HANDOVER', t: '담당자가 *바뀌어도*', size: 'h1', at: t + 0.1, y: 250 })}
  ${person(72, 440, 170, t + 0.2, { light: true, c: 'blue', mv: [ch, ch + 1, -330, 0] })}
  ${person(838, 440, 170, ch + 0.5, { light: true, c: 'teal', a: 'left' })}
  ${bigNode('db', '기록', t + 0.3, { x: 390, y: 440, w: 300, c: 'copper', hiNode: true })}
  ${chk('기록은 *그대로*', k, { y: 760, c: 'green' })}
  ${strikeLine('인수인계에 매달릴 일', hand, less, { y: 920 })}
  ${chk('*줄어요*', less + 0.2, { y: 1030, mark: '↓', c: 'green' })}`, { light: true })
}

// 18 L · C — 고객·거래처가 플랫폼에서 직접 주문·예약 → 매일 쌓이는 데이터
{
  const t = S(18), o = w('주문하고', '6.7.1'), r = w('예약하면서', '6.7.1'), day = c('6.7.2')
  const hs = [120, 170, 150, 210, 190, 250, 300]
  scene(t, `
  ${flowPhone('abcu', ['00', '01', '02'], [o + 0.2, r + 0.2], { at: t + 0.2, x: 72, y: 228, w: 486 })}
  ${rhead({ eb: 'CUSTOMERS · PARTNERS', t: '고객·거래처<br>*직접* 주문', at: t + 0.1, y: 260 })}
  ${chip('주문', o, { x: 590, y: 520, c: 'blue' })}
  ${chip('예약', r, { x: 800, y: 520, c: 'copper' })}
  ${hs.map((h, i) => el(day + i * 0.12, '', { cls: 'abs', a: 'up', style: `left:${590 + i * 58}px;top:${1060 - h}px;width:44px;height:${h}px;border-radius:10px;background:var(--teal)` })).join('')}
  ${el(day + 0.3, '*매일* 쌓여요', { cls: 'abs h2', style: 'left:590px;top:1085px' })}
  ${sampleR(t + 0.6, 1180)}`, { light: true })
}

// 19 D · E — 심사용만이 아니다 → 하나의 서비스로 출시 → 구독 → 새 사업
{
  const t = S(19), svc = c('6.9.0'), sub = w('구독', '6.9.1'), nw = c('6.9.2')
  scene(t, `
  ${eyebrow('BEYOND THE REVIEW', t + 0.05)}
  ${strikeLine('심사에서만 쓰는 데이터', t + 0.1, w('아니에요', '6.8.0'), { y: 310, cls: 'h2' })}
  ${bigNode('box', '하나의 서비스로 *출시*', svc, { x: 72, y: 470, w: 888, c: 'teal', row: true })}
  ${el(sub, `${badge('repeat', 'blue', 150)}<span>*구독* 방식</span>`, { cls: 'abs mega', a: 'scale', style: 'left:72px;top:690px;display:flex;align-items:center;gap:36px;font-size:120px' })}
  ${panel('rocket', 'violet', '새로운 *사업*으로', '', nw, { y: 940 })}`)
}

// ── 밖에서 보는 회사 ───────────────────────────────────
// 20 L · H — 쌓인 화면과 데이터: 투자자·심사위원에게 '투자하고 싶고 지원하고 싶은 회사'
{
  const t = S(20), inv = w('투자자와', '7.2.0'), jd = w('심사위원에게는', '7.2.0'), want = c('7.2.1'), sup = w('지원하고', '7.2.1')
  scene(t, `
  ${head({ eb: 'FROM OUTSIDE', t: '외부에서 보기에도<br>*달라요*', size: 'h1', at: t + 0.1, y: 250 })}
  ${browser31({ x: 72, y: 520, w: 888, h: 440, at: t + 0.4, url: 'SAMPLE · 쌓인 화면과 데이터', layers: [{ src: SH('ax-cleanway') }] })}
  ${person(72, 1000, 150, inv, { light: true, c: 'blue' })}${el(inv + 0.2, '투자자', { cls: 'plate', a: 'fade', style: 'left:90px;top:1200px' })}
  ${person(858, 1000, 150, jd, { light: true, c: 'violet' })}${el(jd + 0.2, '심사위원', { cls: 'plate', a: 'fade', style: 'left:862px;top:1200px' })}
  ${el(want, '투자하고 *싶고*', { cls: 'bubble abs', a: 'up', style: 'left:240px;top:990px;--c:var(--blue)' })}
  ${el(sup, '지원하고 *싶은*', { cls: 'bubble r abs', a: 'up', style: 'left:420px;top:1110px;--c:var(--violet)' })}
  ${note(SAMPLE, t + 0.6)}`, { light: true })
}

// 21 D · H + I — 심사 자리 “그래서, 다음은?” → 화면을 켜고 답한다
{
  const t = S(21), q = c('7.3.1'), k = w('화면을', '7.3.2')
  scene(t, `
  ${panelTable({ at: t + 0.1, y: 260, n: 3, w: 170 })}
  ${el(q, '“그래서, *다음은*<br>어떻게 되나요?”', { cls: 'bubble abs', a: 'up', dim: k + 0.3, style: 'left:72px;top:600px;--c:var(--violet)' })}
  ${push(flowPhone('abax', ['00', '01'], [k + 1.4], { at: k - 0.2, x: 297, y: 820, w: 486 }), [[k - 0.2, k + 1, 0.45, 1, 0, 480, 0, 0]], '540px 1350px')}`)
}

// 22 L · F(BIG) — 도입한 회사와 아닌 회사의 격차가 벌어진다
{
  const t = S(22), a = c('7.4.0'), b = c('7.4.1'), k = w('벌어질', '7.4.2'), win = c('7.5.0')
  const up = 'M100 940 C380 920, 640 760, 960 440', flat = 'M100 940 C380 940, 640 930, 960 900'
  scene(t, `
  ${head({ eb: 'THE GAP', t: '시간이 갈수록', size: 'h1', at: t + 0.1, y: 250 })}
  <svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0" data-in="${k}" data-a="fade"><path d="${up} L960 900 C640 930, 380 940, 100 940 Z" fill="rgba(212,122,74,.18)"/></svg>
  ${lines([[100, 980, 980, 980, t + 0.2, t + 0.8], [100, 430, 100, 980, t + 0.2, t + 0.8]], t, { width: 4, c: '#b9ada0' })}
  ${lines([{ d: up, t0: a, t1: a + 2 }], t, { width: 12, c: 'copper' })}
  ${lines([{ d: flat, t0: b, t1: b + 1.4 }], t, { width: 10, c: '#8d96a0' })}
  ${el(a + 0.8, 'AI 도입 회사', { cls: 'abs h3', style: 'left:300px;top:600px;color:var(--hi)' })}
  ${el(b + 0.5, '그렇지 않은 회사', { cls: 'abs h3', style: 'left:400px;top:1000px;color:var(--ink2)' })}
  ${el(k, '격차', { cls: 'abs mega', a: 'scale', style: 'left:700px;top:720px;font-size:120px' })}
  ${el(win, '먼저 도입한 회사가<br>*확실히 유리*', { cls: 'abs h2', style: 'left:72px;top:1095px' })}`, { light: true })
}

// ── 비용 ─────────────────────────────────────────────
// 23 D · F(BIG) — 비용: MVP 500만 원부터 → 플랫폼형 → 풀 패키지
{
  const t = S(23), m = w('500만', '8.2.0')
  scene(t, `
  ${eyebrow('COST', t + 0.05)}
  ${el(t + 0.1, '*비용*을 말씀드릴게요', { cls: 'abs h1', style: 'left:72px;top:300px' })}
  ${el(c('8.2.0'), 'MVP · 최소 기능 제품', { cls: 'abs h3', style: 'left:72px;top:470px' })}
  ${giga('500만 원', '부터', m - 0.1, { y: 560, size: 180 })}
  ${row('플랫폼형', '1,500만 원부터', c('8.2.1'), { y: 860, w: 888, c: 'blue' })}
  ${row('풀 패키지', '3,000만 원부터', c('8.2.3') - 0.3, { y: 1010, w: 888, c: 'violet' })}`)
}

// 24 L · B — 정산 시점을 자금이 들어온 뒤로
{
  const t = S(24), k = c('8.3.1'), back = w('뒤로', '8.3.1')
  scene(t, `
  ${head({ eb: 'PAYMENT TIMING', t: '자금 흐름이<br>*부담*되시면', size: 'h1', at: t + 0.1, y: 250 })}
  ${lines([[72, 820, 1008, 820, t + 0.3, t + 1]], t, { width: 6, c: '#b9ada0' })}
  ${el(w('자금이', '8.3.1'), badge('coin', 'green', 96), { cls: 'abs', a: 'scale', style: 'left:560px;top:772px' })}
  ${el(w('자금이', '8.3.1') + 0.2, '자금 들어옴', { cls: 'abs h3', style: 'left:470px;top:890px' })}
  ${el(k, badge('receipt', 'copper', 96), { cls: 'abs', a: 'scale', mv: [back, back + 1.2, 640, 0], style: 'left:180px;top:772px' })}
  ${el(k + 0.1, '정산', { cls: 'abs h3', mv: [back, back + 1.2, 640, 0], style: 'left:180px;top:670px' })}
  ${chk('정산은 *뒤로*', back + 0.8, { y: 1040, mark: '→' })}`, { light: true })
}

// 25 D · F(BIG) — 1년 동안 지원금·정책자금 최소 5번 이상 신청
{
  const t = S(25), k = w('5번', '8.4.1')
  const mo = [0, 2, 5, 7, 10]
  scene(t, `
  ${head({ eb: 'EVERY YEAR', t: '1년 동안 지원금과<br>정책자금을 합쳐', size: 'h2', at: t + 0.1, y: 250 })}
  ${el(k - 0.4, '최소', { cls: 'abs h2', style: 'left:72px;top:470px' })}
  ${giga('5번', '이상 신청', k - 0.1, { y: 550, size: 240 })}
  ${Array.from({ length: 12 }, (_, i) => `<div class="abs" style="left:${72 + i * 78}px;top:1010px;width:72px;height:18px;border-radius:9px;background:rgba(255,255,255,.12)" data-in="${t + 0.4 + i * 0.03}" data-a="fade"></div>`).join('')}
  ${mo.map((m, i) => el(k + 0.3 + i * 0.2, badge('doc', ['teal', 'blue', 'amber', 'violet', 'copper'][i], 72), { cls: 'abs', a: 'up', style: `left:${72 + m * 78}px;top:910px` })).join('')}
  ${el(k + 0.6, '12개월', { cls: 'abs h3', style: 'left:72px;top:1060px;color:var(--ink2)' })}
  ${note('신청 횟수입니다 · 선정과 승인은 각 기관의 심사로 결정됩니다', k + 0.4)}`)
}

// 26 L · B — 처음엔 컨설팅 착수금만 → 개발비는 후불도 가능 → 초기 부담 ↓
{
  const t = S(26), post = w('후불로도', '8.4.3'), low = c('8.4.4')
  scene(t, `
  ${head({ eb: 'START LIGHT', t: '처음에는', size: 'h1', at: t + 0.1, y: 250 })}
  ${panel('coin', 'teal', '컨설팅 *착수금*만', '', w('착수금만', '8.4.2'), { y: 430 })}
  ${panel('clock', 'blue', '개발비는 *후불*도 가능', '', post, { y: 660 })}
  ${chk('초기 부담이 *크지 않아요*', low, { y: 920, mark: '↓', c: 'green' })}`, { light: true })
}

// 27 D · H — MVP·플랫폼형으로 시작 → 한 단계씩 올라가도
{
  const t = S(27), k = w('한', '9.1.1')
  const st = [['MVP', 'teal', w('MVP나', '9.1.0')], ['플랫폼형', 'blue', w('플랫폼형으로', '9.1.0')], ['풀 패키지', 'violet', k]]
  scene(t, `
  ${head({ eb: 'STEP UP', t: '작게 시작해서', size: 'h1', at: t + 0.1, y: 250 })}
  ${mega('*한 단계씩*', k, { y: 420, size: 130 })}
  ${st.map(([s, col, a], i) => el(a, s, { cls: 'abs', a: 'up', style: `left:${72 + i * 302}px;top:${1180 - (i + 1) * 170}px;width:290px;height:${(i + 1) * 170}px;border-radius:22px 22px 0 0;background:var(--${col});color:#fff;font-size:52px;font-weight:800;display:flex;justify-content:center;padding-top:44px` })).join('')}
  ${person(142, 1010 - 195, 150, t + 0.4, { c: 'copper', mv: [k + 0.2, k + 1.6, 604, -340] })}`)
}

// 28 L · F(BIG) — 풀 패키지도 2주 기본 틀 → 커스터마이징·테스트 → 유지보수 1년 무상
{
  const t = S(28), b = c('9.2.1'), m = c('9.2.2'), k = w('1년', '9.2.3')
  scene(t, `
  ${eyebrow('FULL PACKAGE', t + 0.05)}
  ${chip('2주 · 기본 틀', t + 0.4, { x: 72, y: 310, c: 'teal', dim: m })}
  ${lines([[180, 412, 180, 450, b - 0.3, b]], t, { width: 5 })}
  ${chip('커스터마이징·테스트', b, { x: 72, y: 450, c: 'blue', dim: m })}
  ${el(m, 'AX·플랫폼 유지보수', { cls: 'abs h1', style: 'left:72px;top:640px' })}
  ${giga('1년 *무상*', '', k - 0.1, { y: 790, size: 200 })}`, { light: true })
}

// 29 D · B — 컨설팅과 개발 비용 · 자금 승인 여부와 관계없이 · 진행 정도에 따라 정산
{
  const t = S(29), ap = c('10.1.1'), k = w('진행', '10.1.2')
  scene(t, `
  ${head({ eb: 'HOW WE SETTLE', t: '이 금액은<br>*컨설팅과 개발* 비용', size: 'h1', at: t + 0.1, y: 250 })}
  ${strikeLine('자금 승인 여부', ap, w('관계없이', '10.1.1'), { y: 580, cls: 'h2' })}
  ${el(k - 0.2, '진행 정도', { cls: 'ylabel abs', a: 'fade', style: 'left:72px;top:740px' })}
  <div class="track abs" style="left:72px;top:825px;width:888px;height:26px" data-in="${k - 0.2}" data-a="fade"><div class="fill" style="--c:var(--copper)" data-grow="${k},${k + 1.6},560"></div></div>
  ${chk('*진행 정도*에 따라 정산', k + 0.8, { y: 930 })}
  ${note('정책자금·지원사업의 선정과 승인은 각 기관의 심사로 결정됩니다', t + 0.6)}`)
}

// ── 신청까지 ─────────────────────────────────────────
// 30 L · B — 정책자금·지원사업 신청까지 쭉 함께 · 심사에서는 스토리
{
  const t = S(30), k = w('쭉', '11.1.1'), story = c('11.2.0')
  scene(t, `
  ${head({ eb: 'ALL THE WAY', t: '신청까지<br>*쭉 함께*', size: 'h1', at: t + 0.1, y: 250 })}
  ${lines([[72, 760, 1008, 760, t + 0.3, k + 0.6]], t, { width: 8, c: 'copper' })}
  ${chip('정책자금', w('정책자금과', '11.1.0'), { x: 72, y: 600, c: 'teal' })}
  ${chip('지원사업 신청', w('지원사업', '11.1.0'), { x: 420, y: 600, c: 'blue' })}
  ${person(160, 800, 150, k, { light: true, c: 'copper' })}${el(k + 0.2, '미래AI랩', { cls: 'plate', a: 'fade', style: 'left:162px;top:1000px' })}
  ${person(360, 800, 150, k + 0.15, { light: true, c: 'blue' })}${el(k + 0.35, '대표님', { cls: 'plate', a: 'fade', style: 'left:383px;top:1000px' })}
  ${el(story, '심사에서는<br>*스토리*가 중요', { cls: 'bubble r abs', a: 'up', style: 'left:560px;top:860px;--c:var(--violet)' })}`, { light: true })
}

// 31 L · H — AX 개발부터 인증까지 하나의 스토리 → 신청서가 처음부터 연결
{
  const t = S(31), one = w('하나의', '11.2.2'), app = c('11.2.3')
  const P = [['AX 개발', 'teal', w('AX', '11.2.1')], ['인증', 'blue', w('인증까지', '11.2.1')], ['신청서', 'violet', app]]
  scene(t, `
  ${eyebrow('ONE STORY', t + 0.05)}
  ${P.map(([s, col, a], i) => card(`<b style="display:block;padding:44px 0 0 40px;font-size:56px;font-weight:800">${s}</b>`, a, { x: 72 + i * 306, y: 320, w: 276, h: 200, c: col })).join('')}
  ${lines([{ d: 'M210 540 C 300 620, 420 620, 516 540 C 610 620, 730 620, 822 540', t0: one, t1: one + 1.2 }], t, { width: 8, c: 'copper' })}
  ${mega('*하나의 스토리*로', one, { y: 650, size: 120 })}
  ${chk('신청서가 처음부터<br>*모두 연결*', app + 0.4, { y: 940, c: 'green' })}`, { light: true })
}

// 32 D · E — 따로 맡길 필요 없이 같은 팀 → 수수료 낮게 → 상담 때 안내
{
  const t = S(32), same = w('같은', '11.3.1'), low = w('낮게', '11.3.3'), more = c('11.4.0')
  const T3 = [['기획', 'teal'], ['개발', 'blue'], ['자금 신청', 'amber']]
  scene(t, `
  ${strikeLine('따로 맡기기', t + 0.1, w('필요', '11.3.0'), { y: 260, cls: 'h2' })}
  ${el(same - 0.2, '', { cls: 'abs glass hiedge', a: 'card', style: 'left:72px;top:400px;width:888px;height:420px;border-radius:44px' })}
  ${T3.map(([s, col], i) => person(150 + i * 290, 440, 150, same + i * 0.15, { c: col }) + el(same + 0.2 + i * 0.15, s, { cls: 'plate', a: 'fade', style: `left:${225 + i * 290}px;transform:translateX(-50%);top:650px` })).join('')}
  ${el(same + 0.4, '*같은 팀*이 이어서', { cls: 'abs h2', style: 'left:120px;top:715px' })}
  ${chk('수수료는 *낮게*', low, { y: 880, mark: '↓', c: 'green' })}
  ${el(more, '자세한 내용은 상담 때 안내', { cls: 'abs h3', style: 'left:72px;top:1010px;color:var(--ink2)' })}`)
}

// ── 정리 ─────────────────────────────────────────────
// 33 L · B — 정리: 4단계 다시
{
  const t = S(33)
  const R4 = [['진단 → *설계도*', 'teal', c('12.2.0')], ['*2주* 안에 기본 틀', 'blue', c('12.2.1')], ['*데이터* 쌓기', 'amber', c('12.2.2')], ['인증·재무 *다듬기*', 'violet', c('12.2.3')]]
  scene(t, `
  ${head({ eb: 'RECAP', t: '정리하면', size: 'h1', at: t + 0.1, y: 250 })}
  ${R4.map(([s, col, a], i) => numtag(String(i + 1), s, a, { y: 450 + i * 170, w: 888, c: col })).join('')}`, { light: true })
}

// 34 D · H — 새 기능·새 사업이 생겨도 한 팀이 이어서 → 스토리가 일관되게
{
  const t = S(34), team = c('12.3.2'), k = w('일관되게', '12.3.3')
  const N = [['pen', '기획', 'teal', w('기획부터', '12.3.1')], ['gear', '개발', 'blue', w('개발', '12.3.1')], ['coin', '자금 신청', 'amber', w('자금', '12.3.1')]]
  scene(t, `
  ${eyebrow('AS YOU GROW', t + 0.05)}
  ${chip('새 기능', t + 0.3, { x: 72, y: 300, c: 'violet' })}
  ${chip('새 사업', w('새', t + 1.2), { x: 360, y: 300, c: 'copper' })}
  ${N.map(([icon, s, col, a], i) => bigNode(icon, s, a, { x: 72 + i * 300, y: 450, w: 288, c: col })).join('')}
  ${lines([[100, 735, 980, 735, team, team + 1]], t, { width: 10, c: 'copper' })}
  ${el(team + 0.3, '한 팀', { cls: 'abs h2', style: 'left:72px;top:760px' })}
  ${mega('스토리가<br>*일관되게*', k, { y: 880, size: 130 })}`)
}

// 35 L · G — 어디서부터? → 3분 기업성장·AX Fit 진단 → 로고
{
  const t = S(35)
  scene(t, `
  ${deco('ring', 840, 120, 260, 'teal', t + 0.2)}${deco('disc', -80, 1150, 240, 'amber', t + 0.4)}
  ${endCard({ at: t + 0.1, sub: '우리 회사는 어디서부터?', subAt: t + 0.3, line: '3분 기업성장·<br>*AX Fit* 진단', lineAt: c('12.4.1'), cta: ['3분 AX Fit 진단', 'miraeailab.com'], ctaAt: R.VOICE_END - 0.4 })}`, { light: true })
}

R.finish()
