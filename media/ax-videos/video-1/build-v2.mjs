// 영상 1 · AX가 뭐고, 왜 필요한가 — v2(고급판)
// 한 화면을 4~6초 두고(약 58장면), 그 안에서 말에 맞춰 요소가 차분히 쌓인다.
// 먹색 + 샴페인 골드, 유리 카드·가는 선, 부드러운 전환(페이드·블러·와이프), 느린 카메라.
import { createBuild, r2, ic } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'
import { kit3 } from '../lib/kit3.mjs'

const TITLE = '영상 1 · AX가 뭐고, 왜 필요한가'
const B = createBuild('.', { title: TITLE, tag: '영상 1 · AX가 뭐고, 왜 필요한가', premium: true })
const K = kit(B)
const X = kit2(B, K)
const P = kit3(B, K)
const { T, C, wt, freeze, tw, from, to, phone, runFlow, WT } = B
const H = P.heads
const c = (s) => { const [b, l, p] = s.split('.').map(Number); return C(b, l, p ?? 0).start }
const w = (needle, f) => wt(needle, typeof f === 'string' ? c(f) : f)
const SH = (n) => `assets/shots/${n}.jpg`
const FL = (n) => `assets/flows/${n}.jpg`
function fzBefore(b, l, label, sub = '') {
  const [s0, e0] = B.silBefore(b, l)
  const s = r2(s0 + 0.05), e = r2(e0 - 0.2)
  freeze(s, e - s, label, sub)
}
const SAMPLES = ['ax-gounsot', 'ax-edumaster', 'ax-seum', 'ax-nexmart', 'ax-materix', 'ax-lumiere', 'ax-veloa', 'ax-vitalon', 'ax-autobridge', 'ax-livarte', 'ax-cleanway', 'ax-morfit',
  'localmom-top', 'pawbeauty-top', 'expertmatch-top', 'eduplaza-top', 'cafefocus-top', 'freshfridge-top', 'insightai-top', 'rescuewalk-top', 'scamshield-top', 'stylecheck-top'].map(SH)
const FINE_CASE = '조사 사례 요약 · 미래AI랩 실적 아님'
B.addCssLast(`
.gcards.row.two .gcard { width: 400px; }
.chiprow { display: flex; gap: 16px; }
.p2r { position: absolute; width: 170px; height: 60px; overflow: visible; }
.p2r path { fill: none; stroke: #D8A871; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 400; }
.ghost.sm { position: absolute; width: 300px; height: 560px; border-radius: 44px; }
.ghost.sm .gq { font-size: 60px; }
.walker2 { position: absolute; left: 470px; top: 700px; width: 140px; height: 140px; color: #E6C396; }
.walker2 .ic { width: 100%; height: 100%; }
.bub.sm { font-size: 50px; padding: 26px 40px; }
.gline { position: absolute; left: 50px; width: 980px; height: 612px; overflow: visible; }
.gline path { fill: none; stroke: #D8A871; stroke-width: 8; stroke-linecap: round; stroke-dasharray: 1600; filter: drop-shadow(0 0 14px rgba(216,168,113,.6)); }
.chain { display: flex; align-items: center; gap: 14px; }
.chain span { padding: 14px 26px; border-radius: 999px; font-size: 34px; font-weight: 700; color: #9BA3AD; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14); }
.chain i { width: 40px; height: 1.5px; background: rgba(216,168,113,.6); }
`)

// ━━ ① 훅
{ // 1.1 — 세 분야 모두 기준선 바로 앞에서 멈춘다
  const t = 0
  const g = P.cards([
    { ic: 'bank', label: '정책자금', at: w('정책자금', 0) - 0.1, bar: 0.955 },
    { ic: 'invest', label: '투자', at: w('투자도', 0) - 0.1, bar: 0.95 },
    { ic: 'gov', label: '정부지원사업', at: w('지원사업도', 0) - 0.1, bar: 0.96 }], { y: 380 })
  P.scene(t, [P.eyebrow('선정 기준선까지', 280, 0.05), g.html, H([{ at: w('끗', '1.1.1') - 0.25, text: '매번 *한 끗* 차이', size: 'l' }], { y: 1010 })], { bg: 'bgA', cam: 'in' })
}
{ // 1.2–1.3 — 수많은 회사, 치열한 경쟁
  const t = c('1.2.0')
  K.crowd(t, { top: 330, extra: H([{ at: w('쉽지', t), text: '*쉽지* 않죠?', size: 'l' }, { at: w('치열', '1.3.0') - 0.1, text: '경쟁은 더 *치열*', size: 'l' }], { y: 1080 }), shot: { bg: 'bgB', trans: 'fade' } })
}
K.rain(c('1.4.0'), { eb: '매주 쏟아지는 AI 기술', labels: ['생성형 AI', 'AI 에이전트', '음성 AI', 'AI 검색', '업무 자동화', 'AI 코딩', '이미지 AI', 'AI 비서', '데이터 분석', '영상 AI'], d: 3.4, shot: { bg: 'bgA', trans: 'fadeBlur' } })
K.chart(c('1.4.1'), { mode: 'others', tagOurs: '우리 회사', tagOursX: 700, tagOursY: 440, tagOursAt: c('1.4.1') + 1.0, d: 1.8,
  extra: H([{ at: w('제자리', '1.4.1') - 0.2, text: '우리만 *제자리?*' }, { at: w('불안', '1.4.2') - 0.3, text: '뒤처질까 *불안*' }], { y: 1110 }), shot: { bg: 'bgB', trans: 'fade' } })
{ // 1.5 — 그래도 잘되는 회사는 있다
  const t = c('1.5.0'), k = w('좋은', '1.5.1')
  const g = P.cards([{ ic: 'bank', label: '정책자금', at: t + 0.1, checkAt: k }, { ic: 'invest', label: '투자', at: t + 0.3, checkAt: k + 0.25 }, { ic: 'gov', label: '지원사업', at: t + 0.5, checkAt: k + 0.5 }], { layout: 'row', y: 460 })
  P.scene(t, [P.eyebrow('그럼에도', 330, t + 0.05), g.html, H([{ at: w('분명히', '1.5.1') - 0.2, text: '잘되는 회사는 *분명히* 있다' }], { y: 900 })], { bg: 'bgL', trans: 'wipeUp' })
}
K.people(c('1.6.0'), { y: 480, items: [['invest', '투자자', w('투자자와', '1.6.1')], ['building', '우리 회사', c('1.6.0') + 0.05], ['user', '심사위원', w('심사위원이', '1.6.1')]],
  react: 'star', reactAt: w('매력적인', '1.6.2'), extra: H([{ at: w('매력적인', '1.6.2') - 0.1, text: '*매력적인* 회사로' }, { at: c('1.6.3'), text: '끝까지 *봐 주세요*' }], { y: 960 }), shot: { bg: 'bgC', trans: 'fade' } })
P.title(B.silBefore(2, 1)[0] + 0.05, { no: '영상 1', title: 'AX가 뭐고,<br>*왜* 필요한가' })

// ━━ ② 문제: 심사장
K.chapter(c('2.1.0'), '② 문제 · 심사장')
{ const t = c('2.1.0'), k = c('2.2.0')
  P.scene(t, [H([{ at: t + 0.1, text: '왜 점점 *어려워질까?*' }], { y: 330 }), P.eyebrow('예전에는', 600, k + 0.05), P.licon('doc', 680, k + 0.1), P.seal('계획서만 잘 써도 통과', 900, w('통했습니다', k) - 0.3, 'gold')], { bg: 'bgA', trans: 'fade' }) }
K.docs(c('2.3.0'), { n: 18, ours: 8, top: 330, grayAt: c('2.4.0') + 0.1,
  extra: H([{ at: w('경쟁력이', '2.3.0') - 0.2, text: '계획서만으로는 *부족*' }, { at: c('2.4.0') + 0.1, text: '계획은 *계획일 뿐*' }], { y: 1060 }), shot: { bg: 'bgL', trans: 'wipeUp' } })
K.room(c('2.5.0'), { react: 'q', reactAt: w('묻습니다', '2.5.0'), q: '“그래서, 다음은<br>어떻게 되나요?”', qAt: c('2.6.0'), qType: 1.1, shot: { trans: 'fade' } })
fzBefore(2, 7, '여기서 갈립니다')
K.room(c('2.7.0'), { me: '“자금이 들어오면<br>하겠습니다…”', meY: 760, meAt: w('자금이', '2.7.0') - 0.1, react: 'meh', reactAt: w('답하면', '2.7.0'), shot: { trans: 'fadeBlur' } })
K.docs(c('2.7.1'), { n: 18, ours: 8, top: 330, ai: true, grayAt: c('2.7.3'),
  extra: H([{ at: c('2.7.1') + 0.15, text: '우리 회사 *사업계획서*' }, { at: w('누구나', '2.7.2') - 0.1, text: '*AI로 쓴* 비슷한 계획서 중 하나' }], { y: 1060, size: 's' }), shot: { bg: 'bgL', trans: 'fade' } })
X.ghost(c('2.8.0'), { mark: '?', extra: H([{ at: c('2.8.0') + 0.1, text: '계획이 부족한 게 *아니라*' }, { at: w('보여', '2.8.1') - 0.2, text: '보여 줄 게 *없다*' }], { y: 1110 }), shot: { bg: 'bgB', trans: 'fade' } })
fzBefore(2, 9, '보여 줄 게 없다')
{ // 2.9 — 계획(빈 점선) → 실제로 돌아가는 화면
  const t = c('2.9.0'), sw = 330, id = K.uid('p2r')
  const html = `<div class="ghost sm" id="${id}-g" style="left:90px;top:420px"><span class="gq">계획</span></div>
    <svg class="p2r" id="${id}-a" viewBox="0 0 170 60" style="left:405px;top:670px"><path d="M8 30 H150 M130 12 L152 30 L130 48"/></svg>
    <div class="abs" style="left:${1080 - 90 - sw - 16}px;top:320px">${phone(`${id}-p`, 'gsbk2', 0, [1, 2, 3], sw)}</div>
    ${H([{ at: w('실제로', '2.9.1') - 0.2, text: '*실제로* 보여 주는 시대' }], { y: 1120 })}`
  B.shot(t, html, { bg: 'bgA', trans: 'fade' })
  from(`#${id}-g`, t + 0.05, 'opacity: 0, x: -40', 0.8, 'expo.out')
  tw(`tl.fromTo('#${id}-a path', { strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', immediateRender: true }, ${r2(w('넘어서', t) - 0.1)});`)
  from(`#${id}-p`, w('넘어서', t) + 0.2, 'opacity: 0, x: 60', 0.9, 'expo.out')
  runFlow(`${id}-p`, 'gsbk2', [1, 2, 3], w('실제로', '2.9.1'), c('2.9.1') + 3.0)
}
K.chart(c('2.10.0'), { mode: 'up', top: 700, at: c('2.11.0') + 0.1, d: 1.4, tagTop: '다음 단계', tagTopX: 640, tagTopY: 10, tagTopAt: w('다음', '2.11.0') + 0.3,
  extra: P.licon('target', 250, c('2.10.0') + 0.1) + H([{ at: c('2.10.0') + 0.2, text: '결국 보는 건 *하나*', y: 470 }, { at: c('2.11.0'), text: '다음 단계로 *커질 수 있는가*', size: 's', y: 480 }]), shot: { bg: 'bgRoom', trans: 'fade' } })
K.link(c('2.11.1'), { a: { ic: 'bank', label: '빌려준 돈' }, b: { ic: 'building', label: '회사', cls: 'hot' }, linkAt: c('2.11.1') + 0.4,
  extra: H([{ at: w('돌아오니까요', '2.11.1') - 0.3, text: '돈이 *돌아와야* 한다' }], { y: 1060 }), shot: { bg: 'bgD', trans: 'wipeUp' } })

// ━━ ③ 문제: 회사 안
K.chapter(c('3.1.0'), '③ 문제 · 회사 안')
{ const t = c('3.1.0'), k = c('3.2.0')
  K.building(t, { inside: [{ ic: 'users', x: 100, y: 250, at: k + 0.3 }, { ic: 'money', x: 350, y: 250, at: k + 0.45 }, { ic: 'db', x: 100, y: 430, at: k + 0.6 }, { ic: 'doc', x: 350, y: 430, at: k + 0.75 }],
    glowAt: w('있습니다', k), extra: H([{ at: t + 0.1, text: '보여 줄 화면은 *어디서?*' }, { at: k + 0.05, text: '재료는 이미 *회사 안에*' }], { y: 1060 }), shot: { bg: 'bgB', trans: 'fade' } }) }
K.scatter(c('3.3.0'), { items: [
  { ic: 'users', label: '고객', x: 90, y: 330, r: -3, at: w('고객', '3.3.0') }, { ic: 'money', label: '매출', x: 650, y: 360, r: 3, at: w('매출', '3.3.0') },
  { ic: 'db', label: '재고', x: 130, y: 560, r: 2, at: w('재고', '3.3.0') }, { ic: 'team', label: '직원', x: 640, y: 590, r: -2, at: w('직원의', '3.3.0') },
  { ic: 'excel', label: '엑셀', x: 110, y: 800, r: -4, at: w('엑셀', '3.3.1') }, { ic: 'chat', label: '메신저', x: 600, y: 830, r: 4, at: w('메신저', '3.3.1') }, { ic: 'memo', label: '메모장', x: 330, y: 960, r: -2, at: w('메모장', '3.3.1') }],
  explodeAt: c('3.3.2'), extra: H([{ at: c('3.3.2'), text: '*흩어져* 있다' }], { y: 1140 }), shot: { bg: 'bgA', trans: 'fadeBlur' } })
{ const t = c('3.4.0')
  const id = K.scatter(t, { items: [{ label: '고객', x: 100, y: 340 }, { label: '매출', x: 720, y: 360 }, { label: '재고', x: 120, y: 880 }, { label: '직원', x: 720, y: 900 }],
    gatherAt: w('쌓이면', t) - 0.2, core: { ic: 'db', label: '가장 큰 자산' }, coreY: 500,
    extra: H([{ at: w('자산인데', t) - 0.2, text: '회사의 *가장 큰 자산*' }, { at: c('3.4.1'), text: '흩어지면 *증거가 못 돼요*' }], { y: 1060 }), shot: { bg: 'bgC', trans: 'fade' } })
  to(`#${id}-core`, c('3.4.1') + 0.2, 'opacity: 0.35, scale: 0.9, filter: "grayscale(1)"', 0.8, 'power2.out') }
{ const t = c('3.4.2'), id = K.uid('wk')
  K.building(t, { y: 300, shakeAt: w('흔들릴', '3.4.3') - 0.1, crack: true, extra: `<div class="walker2" id="${id}">${ic('user')}</div>` + H([{ at: t + 0.1, text: '일 아는 직원이 *나가면*' }, { at: w('흔들릴', '3.4.3') - 0.1, text: '회사가 *흔들린다*' }], { y: 1060 }), shot: { bg: 'bgB', trans: 'wipeUp' } })
  from(`#${id}`, t + 0.3, 'opacity: 0, scale: 0.7', 0.7, 'expo.out')
  to(`#${id}`, w('나가면', t) - 0.2, 'x: 440, opacity: 0', 1.1, 'power2.in') }

// ━━ ④ 실마리
K.chapter(c('4.1.0'), '④ 실마리')
{ const t = c('4.1.0')
  const g = P.cards([{ ic: 'building', label: 'A사 · 정책자금', at: t + 0.1, checkAt: t + 0.8 }, { ic: 'building', label: 'B사 · 투자 유치', at: t + 0.3, checkAt: t + 1.0 }, { ic: 'building', label: 'C사 · 지원사업', at: t + 0.5, checkAt: t + 1.2 }], { y: 360 })
  P.scene(t, [g.html, H([{ at: c('4.1.1') - 0.05, text: '뭐가 *다를까?*', size: 'l' }], { y: 980 })], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('4.2.0'), k = w('250건', '4.2.2') - 0.3, id = K.uid('cr')
  const chips = [['정책자금', w('자금과', t)], ['정부 R&D', w('R&D', t)], ['투자', w('투자를', '4.2.1')]]
  chips.forEach(([, a], i) => from(`#${id}-${i}`, a, 'y: 20, opacity: 0', 0.7, 'expo.out'))
  P.scene(t, [P.eyebrow('미래AI랩 조사 · 최근 3년', 250, t + 0.05), `<div class="cx" style="top:340px"><div class="chiprow">${chips.map(([l], i) => `<span class="chip big" id="${id}-${i}">${l}</span>`).join('')}</div></div>`,
    P.number({ to: 250, suf: '건', y: 500, at: k, d: 1.1 }), P.dots(250, 25, 860, k, 0.004)], { bg: 'bgB', trans: 'fade' }) }
fzBefore(4, 3, '사례 250건 가까이 분석', '최근 3년 · 정책자금·R&D·투자')
X.flowRows(c('4.3.0'), { eb: '반복되는 흐름', rows: ['사례 A', '사례 B', '사례 C'], stepsAt: [w('쌓고', '4.4.0') - 0.2, null, null], lit: '#D8A871',
  extra: H([{ at: c('4.3.0') + 0.2, text: '*같은 흐름*이 반복됐다', size: 's' }, { at: w('쌓고', '4.4.0') - 0.2, text: '① 고객 데이터를 *쌓고*', size: 's' }], { y: 1080 }), shot: { bg: 'bgA', trans: 'fade' } })
{ // 4.4.1–4.4.2 — 고객 플랫폼(폰) ↔ 회사 안 운영
  const t = c('4.4.1'), sw = 330, id = K.uid('pl')
  const k = w('연결해', '4.4.2') - 0.2
  const html = `<div class="abs" style="left:90px;top:300px">${phone(`${id}-p`, 'paw', 0, [1, 2, 3], sw)}</div>
    <svg class="p2r" id="${id}-a" viewBox="0 0 170 60" style="left:458px;top:620px"><path d="M8 30 H162"/></svg>
    <div class="node hot" id="${id}-n" style="left:640px;top:500px;width:350px;height:300px">${ic('gear', 'xl')}<b>회사 안 운영</b></div>
    ${H([{ at: t + 0.1, text: '고객이 쓰는 *플랫폼*' }, { at: k, text: '운영과 *하나로* 연결' }], { y: 1110 })}`
  B.shot(t, html, { bg: 'bgD', trans: 'fade' })
  from(`#${id}-p`, t + 0.05, 'opacity: 0, y: 60', 0.9, 'expo.out')
  runFlow(`${id}-p`, 'paw', [1, 2, 3], t + 0.5, k - 0.2)
  from(`#${id}-n`, k - 0.3, 'opacity: 0, x: 60', 0.8, 'expo.out')
  tw(`tl.fromTo('#${id}-a path', { strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', immediateRender: true }, ${r2(k)});`) }

// ━━ ④ 플랫폼 · 사례
X.skyline(c('5.1.0'), { xAt: c('5.1.2'), shot: { bg: 'bgB', trans: 'fade' } })
K.link(c('5.2.0'), { a: { ic: 'users', label: '고객' }, b: { ic: 'building', label: '거래처' }, mid: 'shop', linkAt: w('모이는', '5.2.1') - 0.2,
  extra: H([{ at: c('5.2.0') + 0.1, text: '우리 *업종*에 맞춘' }, { at: w('작은', '5.2.1') - 0.2, text: '*작은 서비스*에 모인다' }], { y: 1060 }), shot: { bg: 'bgL', trans: 'wipeUp' } })
K.morph(c('5.3.0'), { eb: '조사 사례 · 렌털업체', from: ['book', '손으로 쓰던 장부'], to: ['cloud', '클라우드 시스템'], aAt: c('5.4.0'), arAt: w('클라우드', '5.4.1') - 0.4, bAt: w('클라우드', '5.4.1') - 0.1,
  fine: FINE_CASE, extra: H([{ at: c('5.3.0') + 0.1, text: '실제 *사례*', size: 'l', y: 1010 }]), shot: { bg: 'bgA', trans: 'fade' } })
{ const t = c('5.4.2'), id = K.uid('ch'), kf = w('금융', '5.4.3') - 0.2
  const steps = [['장부', t + 0.1], ['클라우드', t + 0.3], ['금융 사업', kf]]
  steps.forEach(([, a], i) => { from(`#${id}-${i}`, a, 'opacity: 0, y: 16', 0.6, 'expo.out') })
  tw(`tl.to('#${id}-2', { color: '#15110C', backgroundColor: '#D8A871', boxShadow: 'inset 0 0 0 0px rgba(0,0,0,0)', duration: 0.4 }, ${r2(kf + 0.3)});`)
  P.scene(t, [P.eyebrow('조사 사례 · 렌털업체', 250, t + 0.05), `<div class="cx" style="top:340px"><div class="chain">${steps.map(([l], i) => `${i ? '<i></i>' : ''}<span id="${id}-${i}">${l}</span>`).join('')}</div></div>`,
    P.number({ to: 15, suf: '억 원', y: 520, at: w('15억', '5.4.4') - 0.2, d: 0.9 }), `<p class="ksub" id="${id}-s" style="top:800px">보증·금융지원</p>`, K.fineAt(`${id}-f`, FINE_CASE, 1290)], { bg: 'bgC', trans: 'fadeBlur' })
  from(`#${id}-s`, w('15억', '5.4.4') + 0.4, 'opacity: 0, y: 16', 0.7, 'expo.out') }
fzBefore(5, 5, '15억 원 규모 보증·금융지원', '장부 → 클라우드 → 금융')
K.morph(c('5.5.0'), { eb: '조사 사례 · 히트펌프', from: ['gear', '설비 판매'], to: ['cloud', '운영·모니터링 구독'], arAt: w('운영', '5.5.0') - 0.3, bAt: w('운영', '5.5.0'), fine: FINE_CASE, shot: { bg: 'bgB', trans: 'fade' } })
K.morph(c('5.5.1'), { eb: '조사 사례 · 수산물 유통', from: ['shop', '수산물 유통'], to: ['db', '데이터 B2B 플랫폼'], arAt: w('데이터', '5.5.1') - 0.3, bAt: w('데이터', '5.5.1'), fine: FINE_CASE, shot: { bg: 'bgD', trans: 'wipeUp' } })
K.morph(c('5.5.2'), { eb: '조사 사례 · 부동산 중개', from: ['building', '부동산 중개'], to: ['gear', '공실 관리 자동화'], arAt: w('공실', '5.5.2') - 0.3, bAt: w('공실', '5.5.2'), fine: FINE_CASE,
  extra: H([{ at: c('5.5.3'), text: '모두 *성장자금* 확보' }], { y: 1040 }), shot: { bg: 'bgA', trans: 'fade' } })
X.flowRows(c('5.6.0'), { eb: '업종은 달라도', rows: ['제조', '유통', '숙박'], stepsAt: [w('같았습니다', '5.6.1') - 0.5, w('같았습니다', '5.6.1') - 0.25, w('같았습니다', '5.6.1')], lit: '#D8A871',
  shot: { bg: 'bgB', trans: 'fade' } })
K.puzzle(c('5.7.0'), { a: ['db', '데이터'], b: ['users', '사람'], result: '회사가 크는 구조', snapAt: w('모이는', '5.7.0'), extra: P.seal('공통점', 980, c('5.7.2'), 'gold'), shot: { bg: 'bgC', trans: 'fadeBlur' } })

// ━━ ④ 정책 방향
K.link(c('6.1.0'), { a: { ic: 'gov', label: '정부' }, b: { ic: 'ai', label: 'AI 도입 기업', cls: 'hot' }, linkAt: w('도입한', '6.1.0'), extra: P.seal('공식 발표', 1000, w('공식', '6.1.1') - 0.1), shot: { bg: 'bgB', trans: 'fade' } })
X.axdef(c('6.2.0'), { axAt: c('6.2.0') + 0.1, aAt: w('AI와', '6.2.0'), dAt: w('데이터로', '6.2.0'), wAt: w('일하는', '6.2.0'), sAt: w('AX라고', '6.2.0'), shot: { bg: 'bgA', trans: 'fade' } })
X.policy(c('6.2.1'), { at: w('7540', '6.2.2') - 0.3, shot: { bg: 'bgD', trans: 'wipeUp' } })
{ const t = c('6.3.0')
  P.scene(t, [P.eyebrow('미래AI랩', 420, t + 0.05), P.licon('rocket', 500, t + 0.15), H([{ at: t + 0.3, text: '한 걸음 *더*', size: 'xl' }], { y: 740 })], { bg: 'bgC', trans: 'fade' }) }
K.people(c('6.4.0'), { y: 480, items: [['gov', '정부', w('정부와', '6.4.0')], ['user', '심사위원', w('심사위원', '6.4.0')], ['invest', '투자자', w('투자자가', '6.4.0')]],
  react: 'heart', reactAt: w('좋아할', '6.4.1') - 0.1, extra: H([{ at: w('좋아할', '6.4.1') - 0.1, text: '모두 *좋아할* 회사' }], { y: 960 }), shot: { bg: 'bgB', trans: 'fade' } })
K.puzzle(c('6.4.2'), { a: ['users', '플랫폼'], b: ['ai', 'AX'], result: '플랫폼 + AX', snapAt: w('결합한', '6.4.2') - 0.1,
  extra: H([{ at: c('6.4.3') + 0.1, text: '서비스로 *설계*' }], { y: 1000 }), shot: { bg: 'bgA', trans: 'wipeUp' } })

// ━━ ⑤ 해결
K.chapter(c('7.1.0'), '⑤ 해결')
K.link(c('7.1.0'), { a: { ic: 'building', label: '안' }, b: { ic: 'users', label: '밖', cls: 'hot' }, eb: '대표님 회사의', linkAt: c('7.1.1'),
  extra: H([{ at: w('연결해', '7.1.1') - 0.2, text: '안과 밖을 *연결*' }], { y: 1060 }), shot: { bg: 'bgC', trans: 'fade' } })
{ // 7.2.0–7.2.1 — 흩어진 네 가지가 대표님 폰 한 화면으로
  const t = c('7.2.0'), sw = 330, id = K.uid('in'), k = w('모아', '7.2.1') - 0.2
  const items = [['team', '직원', w('직원', t)], ['users', '고객', w('고객', t)], ['db', '재고', w('재고', t)], ['money', '정산', w('정산을', t)]]
  const html = `${P.eyebrow('안 · 회사 운영', 230, t + 0.05)}${items.map(([k2, l], i) => `<div class="sitem" id="${id}-${i}" style="left:80px;top:${360 + i * 150}px">${ic(k2, 'lg')}<b>${l}</b></div>`).join('')}
    <div class="abs" style="left:${1080 - 80 - sw - 16}px;top:300px">${phone(`${id}-p`, 'gsax', 1, [], sw)}</div>
    ${H([{ at: k, text: '대표님 폰 *한 화면*에' }], { y: 1110 })}`
  B.shot(t, html, { bg: 'bgA', trans: 'fade' })
  items.forEach(([, , a], i) => from(`#${id}-${i}`, a - 0.1, 'opacity: 0, x: -40', 0.7, 'expo.out'))
  from(`#${id}-p`, t + 0.1, 'opacity: 0, y: 60', 0.9, 'expo.out')
  items.forEach((_, i) => to(`#${id}-${i}`, k + i * 0.08, 'x: 600, y: ' + (250 - i * 150) + ', scale: 0.4, opacity: 0', 0.8, 'power2.in'))
  tw(`tl.to('#${id}-p', { boxShadow: '0 50px 110px rgba(0,0,0,.55), 0 0 0 3px #D8A871', duration: 0.5 }, ${r2(k + 0.6)});`) }
K.phoneShot(c('7.2.2'), { name: 'gsbk2', base: 0, steps: [1, 2, 3, 4, 5], run: [w('직접', '7.2.3') - 0.2, c('7.2.3') + 3.4], label: '밖 · 고객이 직접 예약', lbc: 'hot', shot: { bg: 'bgB', trans: 'fade' } })
X.twoPhones(c('7.3.0'), { a: { name: 'gsbk2', base: 5, label: '밖 · 고객' }, b: { name: 'gsax', base: 1, label: '안 · 대표님', swap: FL('gsax-02'), swapAt: w('알려', '7.3.2') - 0.3 }, mid: 'ai', linkAt: c('7.3.0') + 0.5,
  extra: H([{ at: w('읽고', '7.3.1') - 0.3, text: 'AI가 데이터를 *읽고*', size: 's' }, { at: w('알려', '7.3.2') - 0.3, text: '*다음 할 일*까지', size: 's' }], { y: 1110 }), shot: { bg: 'bgD', trans: 'fade' } })
{ // 7.4 — 샘플 화면 위로 성장선이 그려진다
  const t = c('7.4.0'), id = K.uid('gl')
  K.browser(t, { src: SH('ax-gounsot'), tag: '샘플 화면', top: 360, d: 6.0, zoom: 1.12,
    extra: `<svg class="gline" id="${id}" viewBox="0 0 980 612" style="top:410px"><path d="M40 560 C 260 540, 420 460, 560 360 S 820 120, 940 70"/></svg><span class="ctag hot2" id="${id}-t" style="left:700px;top:430px">성장 계획</span>` + H([{ at: c('7.4.2'), text: '화면으로 *직접* 보여 준다' }], { y: 1110 }),
    shot: { bg: 'bgA', trans: 'fade' } })
  tw(`tl.fromTo('#${id} path', { strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', immediateRender: true }, ${r2(w('성장할', '7.4.1') - 0.4)});`)
  from(`#${id}-t`, w('성장할', '7.4.1') + 0.8, 'opacity: 0, y: 10', 0.6, 'expo.out') }
{ const t = c('8.1.0')
  const id = K.room(t, { me: '“자금이 들어오면<br>하겠습니다…”', meY: 720, meAt: t + 0.05, cross: true, crossAt: w('대신에', t) - 0.1, show: FL('gsax-01'), showAt: c('8.1.1'), showY: 640, react: 'ok', reactAt: w('보여', '8.1.1'), shot: { trans: 'fade' } })
  to(`#${id}-m`, c('8.1.1') - 0.1, 'opacity: 0, y: -20', 0.4, 'power2.in') }
{ const t = c('8.1.2'), id = K.uid('bq')
  K.phoneShot(t, { name: 'paw', base: 3, steps: [4, 5, 6, 7], run: [c('8.1.3') + 0.1, c('8.1.3') + 2.2], top: 440, sw: 350,
    extra: `<div class="cx" style="top:230px"><div class="bub jb sm" id="${id}">“이거 진짜 되나요?”</div></div>`, shot: { bg: 'bgRoom', trans: 'fade' } })
  from(`#${id}`, t + 0.05, 'opacity: 0, y: -20', 0.7, 'expo.out') }
K.chart(c('8.2.0'), { mode: 'recover', at: w('다음', '8.2.1') - 1.0, d: 1.0, tagOurs: '멈춰 보였던 회사', tagOursX: 110, tagOursY: 380, tagOursAt: c('8.2.0') + 0.5, tagTop: '다음 단계', tagTopX: 700, tagTopAt: w('다음', '8.2.1') + 0.6,
  shot: { bg: 'bgD', trans: 'fade' } })
fzBefore(9, 1, '다음 단계가 보이는 회사')

// ━━ ⑥ 근거 + 차별점
K.chapter(c('9.1.0'), '⑥ 근거 + 차별점')
K.swap(c('9.1.0'), { tag: '샘플 화면', items: [
  { src: SH('ax-gounsot'), label: '음식점' }, { src: SH('ax-edumaster'), label: '학원', at: w('학원', '9.1.0') - 0.05 },
  { src: SH('ax-seum'), label: '제조', at: w('제조', '9.1.0') - 0.05 }, { src: SH('ax-nexmart'), label: '유통', at: w('유통까지', '9.1.0') - 0.05 }], shot: { bg: 'bgA', trans: 'fade' } })
K.wall(c('9.1.1'), { srcs: SAMPLES, each: 0.04, center: '20개+<small>업종별 AX·MVP 샘플</small>', centerAt: w('20개', '9.1.1') - 0.1, shot: { bg: 'bgB', trans: 'fade' } })
{ const t = c('9.1.2')
  const g = P.cards([{ ic: 'gear', label: '산업용 설비', at: t + 0.1 }, { ic: 'shield', label: '웰니스 케어', at: t + 0.25 }, { ic: 'plug', label: '전기·정보통신', at: t + 0.4 }, { ic: 'shop', label: '피혁 제조·도소매', at: t + 0.55 }], { y: 340 })
  P.scene(t, [P.eyebrow('실제 기업과 함께 제작 중 · 업체명 비공개', 250, t + 0.05), g.html], { bg: 'bgA', trans: 'wipeUp' }) }
{ const t = c('9.2.0'), k = w('특허', '9.3.0'), id = K.uid('pt')
  P.scene(t, [P.eyebrow('미래AI랩', 250, t + 0.05), H([{ at: t + 0.15, text: '저희도 *AX로* 일해요' }], { y: 330 }),
    P.number({ from: 1, to: 5, suf: '건', y: 540, at: k, d: 0.8 }), `<p class="ksub" id="${id}" style="top:830px">AX 핵심기술 특허 출원 · 2026. 9. 11</p>`, K.fineAt(`${id}-f`, '특허는 출원(등록 아님)', 1290)], { bg: 'bgC', trans: 'fade' })
  from(`#${id}`, k + 0.4, 'opacity: 0, y: 16', 0.7, 'expo.out') }
X.sysForm(c('9.3.1'), { rows: [['회사명', '○○기업'], ['업종', '제조'], ['직원 수', '12명'], ['매출 규모', '8억 원']], tapAt: w('넣으면', '9.3.1'), shot: { bg: 'bgL', trans: 'fade' } })
X.dash(c('9.3.2'), { cards: [['money', '받을 수 있는', '지원금 3건', w('지원금과', '9.3.2')], ['shield', '챙겨야 할', '인증 2건', w('인증', '9.3.2')], ['doc', '절세 포인트', '2가지', w('절세', '9.3.3')]], shot: { bg: 'bgL', trans: 'fade' } })
K.notifs(c('9.4.0'), { eb: '매일 알림', items: [{ ic: 'bell', t: '새 지원사업 공고', s: '우리 회사 해당 가능', w: '오늘' }, { ic: 'cal', t: '마감 D-7', s: '서류 준비 안내', c: 'blue', w: '오늘' }, { ic: 'money', t: '정책자금 접수 시작', s: '조건 맞음', c: 'green', w: '방금' }], fine: '예시 화면', shot: { bg: 'bgB', trans: 'fade' } })
{ const t = c('9.5.0'), k = c('9.5.1')
  const g = P.cards([{ ic: 'memo', label: '감과 기억', at: t + 0.1, checkAt: t + 1.2, x: true }, { ic: 'ai', label: '시스템이 먼저', hl: true, at: k - 0.1, checkAt: k + 0.4 }], { layout: 'row', y: 440 })
  P.scene(t, [P.eyebrow('일반적인 컨설팅과 다른 점', 320, t + 0.05), g.html.replace('gcards row', 'gcards row two'), H([{ at: c('9.5.2') - 0.05, text: '놓치는 게 *훨씬 적다*' }], { y: 900 })], { bg: 'bgD', trans: 'wipeUp' }) }

// ━━ ⑦ 닫기
K.chapter(c('10.1.0'), '⑦ 닫기')
{ const t = c('10.1.0')
  const id = K.room(t, { extra: P.eyebrow('다음 심사', 690, t + 0.1), q: '“그래서, 다음은<br>어떻게 되나요?”', qAt: c('10.1.1'), qY: 780, qType: 1.0, show: FL('gsbk2-11'), showAt: w('화면을', '10.1.3') - 0.3, showY: 640, react: 'ok', reactAt: w('보여', '10.1.3'), shot: { trans: 'fade' } })
  to(`#${id}-q`, w('화면을', '10.1.3') - 0.45, 'opacity: 0, y: -20', 0.4, 'power2.in') }
X.cta(c('10.2.0'), { at: c('10.3.0'), tapAt: c('10.3.1') + 0.2, shot: { bg: 'bgC', trans: 'fade' } })
{ const t = c('10.2.0'), id = K.uid('q10')
  B.addOverlay(`<div class="clip" id="${id}" data-start="${r2(t)}" data-duration="${r2(c('10.3.0') - t + 0.1)}" data-track-index="5">${H([{ at: t + 0.1, text: '무엇부터 *보여 줄까?*', size: 'l' }], { y: 760 })}</div>\n`) }
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(c('10.4.0'), { eb: '다음 영상 ▶', card: '<span class="no">영상 2</span><h3>어떻게 진행하고,<br>얼마가 드나</h3><ul><li>4단계 진행</li><li>비용</li><li>후불·정산</li></ul>', shot: { trans: 'fade' } })

B.finish(r2(ENDV + 3.0))
