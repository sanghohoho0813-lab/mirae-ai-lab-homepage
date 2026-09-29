// 영상 1 · AX가 뭐고, 왜 필요한가 — 자막 조각마다 화면을 바꾼다(한 샷 평균 2~3초)
// timing.json(녹음 정렬) + asr-fast.json(단어 시간) → index.html
import { createBuild, r2 } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'

const TITLE = '영상 1 · AX가 뭐고, 왜 필요한가'
const B = createBuild('.', { title: TITLE, tag: '영상 1 · AX가 뭐고, 왜 필요한가' })
const K = kit(B)
const X = kit2(B, K)
const { T, C, L, wt, freeze } = B
const c = (s) => { const [b, l, p] = s.split('.').map(Number); return C(b, l, p ?? 0).start }
const w = (needle, from) => wt(needle, typeof from === 'string' ? c(from) : from)
const SH = (n) => `assets/shots/${n}.jpg`
const FL = (n) => `assets/flows/${n}.jpg`
const idx = (b, l) => T.lines.findIndex((x) => x.block === b && x.line === l)
function fzBefore(b, l, label, sub = '') {
  const [s0, e0] = B.silBefore(b, l)
  const s = r2(s0 + 0.05), e = r2(e0 - 0.2)
  freeze(s, e - s, label, sub)
}
const SAMPLES = ['ax-gounsot', 'ax-edumaster', 'ax-seum', 'ax-nexmart', 'ax-materix', 'ax-lumiere', 'ax-veloa', 'ax-vitalon', 'ax-autobridge', 'ax-livarte', 'ax-cleanway', 'ax-morfit',
  'localmom-top', 'pawbeauty-top', 'expertmatch-top', 'eduplaza-top', 'cafefocus-top', 'freshfridge-top', 'insightai-top', 'rescuewalk-top', 'scamshield-top', 'stylecheck-top'].map(SH)

// ── ① 훅
K.tiles(0, { y: 470, items: [
  { ic: 'bank', label: '정책자금', at: w('정책자금', 0) },
  { ic: 'invest', label: '투자', at: w('투자도', 0) },
  { ic: 'gov', label: '정부지원사업', at: w('지원사업도', 0) }], shot: { bg: 'bgA' } })
K.cutline(c('1.1.1'), { gapAt: w('끗', '1.1.1'), shot: { trans: 'slideU' } })
K.crowd(c('1.2.0'), { label: '쉽지 않죠?', labelAt: w('쉽지', '1.2.0') })
K.stamp(c('1.3.0'), { text: '경쟁 치열', color: 'red', at: w('치열', '1.3.0') - 0.1, under: K.chipAt('x', '선정은 소수', 330, 'gray big') })
K.rain(c('1.4.0'), { eb: '매주 쏟아지는 AI 기술', labels: ['생성형 AI', 'AI 에이전트', '음성 AI', 'AI 검색', '업무 자동화', 'AI 코딩', '이미지 AI', 'AI 비서', '데이터 분석', '영상 AI', 'AI 챗봇', '멀티모달'], d: 3.3 })
K.race(c('1.4.1'), { label: '우리 회사만 *제자리?*', labelAt: w('제자리', '1.4.1') })
K.chart(c('1.4.2'), { mode: 'others', tagOurs: '우리 회사', tagOursX: 700, tagOursY: 440, tagOursAt: c('1.4.2') + 0.9, label: '<b class="red">뒤처질까 불안</b>', labelAt: w('불안', '1.4.2') })
K.tiles(c('1.5.0'), { layout: 'row', y: 520, eb: '그럼에도', ebY: 400, items: [{ ic: 'bank', label: '정책자금' }, { ic: 'invest', label: '투자' }, { ic: 'gov', label: '지원사업' }], shot: { bg: 'bgL' } })
K.checks(c('1.5.1'), { eb: '잘되는 회사는 분명히 있다', items: [['정책자금 확보', c('1.5.1') + 0.5], ['투자 유치', c('1.5.1') + 0.9], ['지원사업 선정', c('1.5.1') + 1.3]] })
K.people(c('1.6.0'), { y: 560, items: [['invest', '투자자', w('투자자', '1.6.1')], ['building', '우리 회사', c('1.6.0') + 0.05], ['user', '심사위원', w('심사위원', '1.6.1')]], react: 'heart', reactAt: w('매력적인', '1.6.2'), center: '*매력적인* 회사로', centerAt: w('매력적인', '1.6.2') })
K.big(c('1.6.3'), { icon: 'rocket', text: '끝까지 *봐 주세요*', size: 'l', y: 720, shot: { trans: 'zoom', bg: 'bgC' } })
X.title(B.silBefore(2, 1)[0] + 0.05, { no: '영상 1', title: 'AX가 뭐고,<br>*왜* 필요한가' })

// ── ② 문제: 심사장
K.chapter(c('2.1.0'), '② 문제 · 심사장')
K.big(c('2.1.0'), { icon: 'q', text: '왜 점점<br>*어려워질까?*', size: 'l', y: 640 })
K.stamp(c('2.2.0'), { text: '통과', color: 'green', at: w('통했습니다', '2.2.0') - 0.1, y: 760, under: `${K.chipAt('old', '예전에는', 250, 'big')}<div class="cx" style="top:380px"><span class="bigic" style="width:260px;height:260px">${'<i class="ic"><svg viewBox="0 0 24 24"><path d="M6 2.5h8l4 4V21.5H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h6M9 14.5h6M9 18h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></i>'}</span></div>`, shot: { bg: 'bgOld' } })
K.big(c('2.3.0'), { eb: '하지만 지금은', icon: 'doc', icc: 'red', text: '계획서만으로는<br>*경쟁력 ✕*', size: 'm', y: 700, ebY: 250, iconY: 360 })
X.blueprint(c('2.4.0'), { chip: '계획은 계획일 뿐', chipAt: w('계획일', '2.4.0') })
K.room(c('2.5.0'), { extra: K.chipAt('qa', '발표 끝 · 질의응답', 760, 'hot big'), react: 'q', reactAt: w('묻습니다', '2.5.0') })
K.room(c('2.6.0'), { q: '“그래서, 다음은<br>어떻게 되나요?”', qAt: c('2.6.0') + 0.05, qType: 1.1, shot: { trans: 'zoom' } })
fzBefore(2, 7, '여기서 갈립니다')
K.room(c('2.7.0'), { me: '“자금이 들어오면<br>하겠습니다…”', meY: 760, meAt: w('자금이', '2.7.0') - 0.1, react: 'meh', reactAt: w('답하면', '2.7.0') })
K.big(c('2.7.1'), { icon: 'doc', text: '우리 회사<br>*사업계획서*', size: 'l', y: 700, shot: { bg: 'bgL' } })
K.docs(c('2.7.2'), { eb: '누구나 AI로 쓴 계획서', n: 30, ours: 14, ai: true, grayAt: c('2.7.3') })
K.big(c('2.8.0'), { icon: 'check', icc: 'green', text: '계획이 부족한 게<br>*아니에요*', size: 'm', y: 700 })
X.ghost(c('2.8.1'), { mark: '?', label: '보여 줄 게 *없다*', labelAt: w('없는', '2.8.1') })
fzBefore(2, 9, '보여 줄 게 없다')
K.link(c('2.9.0'), { a: { ic: 'doc', label: '계획' }, b: { ic: 'rocket', label: '실제', cls: 'hot' }, linkAt: w('넘어서', '2.9.0'), label: '계획을 *넘어서*' })
K.phoneShot(c('2.9.1'), { name: 'gsbk2', base: 0, steps: [1, 2, 3], run: [c('2.9.1') + 0.5, c('2.9.1') + 2.6], label: '실제로 돌아가는 화면', lbc: 'hot' })
K.big(c('2.10.0'), { icon: 'target', text: '결국 보는 건<br>*하나*', size: 'l', y: 660, shot: { bg: 'bgRoom' } })
K.chart(c('2.11.0'), { mode: 'up', tagTop: '다음 단계로?', tagTopX: 600, tagTopAt: w('다음', '2.11.0'), eb: '이 회사, 커질 수 있을까?', ebc: 'hot' })
K.link(c('2.11.1'), { a: { ic: 'bank', label: '빌려준 돈' }, b: { ic: 'building', label: '회사', cls: 'hot' }, linkAt: c('2.11.1') + 0.4, label: '돈이 *돌아온다*', labelAt: w('돌아오니까요', '2.11.1') })

// ── ③ 문제: 회사 안
K.chapter(c('3.1.0'), '③ 문제 · 회사 안')
X.ghost(c('3.1.0'), { mark: '', lens: true, label: '보여 줄 화면은 *어디서?*', shot: { bg: 'bgB' } })
K.building(c('3.2.0'), { inside: [{ ic: 'users', x: 100, y: 250 }, { ic: 'money', x: 350, y: 250 }, { ic: 'db', x: 100, y: 430 }, { ic: 'doc', x: 350, y: 430 }], glowAt: w('있습니다', '3.2.0'), label: '재료는 *회사 안에*' })
K.tiles(c('3.3.0'), { y: 360, items: [
  { ic: 'users', label: '고객', at: w('고객', '3.3.0') }, { ic: 'money', label: '매출', at: w('매출', '3.3.0') },
  { ic: 'db', label: '재고', at: w('재고', '3.3.0') }, { ic: 'team', label: '직원 기록', at: w('직원의', '3.3.0') }] })
K.scatter(c('3.3.1'), { items: [
  { ic: 'excel', label: '엑셀', x: 80, y: 360, r: -6, at: w('엑셀', '3.3.1') }, { ic: 'chat', label: '메신저', x: 560, y: 560, r: 5, at: w('메신저', '3.3.1') },
  { ic: 'memo', label: '메모장', x: 150, y: 820, r: -4, at: w('메모장', '3.3.1') }, { label: '고객 명단', cls: 'dark', x: 620, y: 300, r: 8 }, { label: '매출표', cls: 'dark', x: 640, y: 900, r: -7 }, { label: '재고 메모', cls: 'dark', x: 90, y: 1060, r: 4 }],
  explodeAt: c('3.3.2'), center: '*흩어져* 있다', centerY: 1150, centerAt: c('3.3.2') })
K.scatter(c('3.4.0'), { items: [{ label: '고객', x: 90, y: 330 }, { label: '매출', x: 700, y: 360 }, { label: '재고', x: 110, y: 980 }, { label: '직원', x: 700, y: 1000 }],
  gatherAt: w('쌓이면', '3.4.0'), core: { ic: 'db', label: '가장 큰 자산' }, coreY: 540, center: '회사의 *가장 큰 자산*', centerY: 1130, centerAt: w('자산인데', '3.4.0') })
K.big(c('3.4.1'), { icon: 'invest', icc: 'red', text: '성장 증거로<br>*못 써요*', size: 'l', y: 680, shot: { bg: 'bgA' } })
X.leave(c('3.4.2'), { who: '일 아는 직원', label: '담당자가 *나가면*', goAt: w('나가면', '3.4.2') - 0.2 })
K.building(c('3.4.3'), { shakeAt: w('흔들릴', '3.4.3') - 0.1, crack: true, label: '회사가 *흔들린다*', labelAt: w('흔들릴', '3.4.3') })

// ── ④ 실마리
K.chapter(c('4.1.0'), '④ 실마리')
K.tiles(c('4.1.0'), { y: 420, items: [
  { ic: 'building', label: 'A사 · 정책자금', c: 'dark', ok: true, okAt: c('4.1.0') + 0.7 },
  { ic: 'building', label: 'B사 · 투자 유치', c: 'dark', ok: true, okAt: c('4.1.0') + 1.0 },
  { ic: 'building', label: 'C사 · 지원사업', c: 'dark', ok: true, okAt: c('4.1.0') + 1.3 }], eb: '잘 받는 회사들', ebY: 310 })
K.big(c('4.1.1'), { icon: 'q', text: '뭐가 *다를까?*', size: 'xl', y: 700, shot: { trans: 'zoom', bg: 'bgC' } })
K.tiles(c('4.2.0'), { layout: 'row', y: 560, eb: '최근 3년 · 미래AI랩 조사', ebY: 420, items: [
  { ic: 'bank', label: '정책자금', at: w('정책자금과', '4.2.0') }, { ic: 'ai', label: '정부 R&D', at: w('R&D', '4.2.0') }, { ic: 'invest', label: '투자', at: w('투자를', '4.2.0') }], shot: { bg: 'bgL' } })
K.counter(c('4.2.2'), { to: 250, suf: '건', y: 380, at: w('250건', '4.2.2') - 0.3, d: 1.0, label: '가까이 살펴본 사례', labelY: 690,
  extra: `<div class="dots" id="dots1">${'<i></i>'.repeat(250)}</div>` })
B.tw(`tl.from('#dots1 i', { scale: 0, opacity: 0, duration: 0.2, stagger: { each: 0.004, from: 'start' } }, ${r2(w('250건', '4.2.2') - 0.3)});`)
fzBefore(4, 3, '사례 250건 가까이 분석', '최근 3년 · 정책자금·R&D·투자')
X.flowRows(c('4.3.0'), { eb: '반복되는 흐름', rows: ['사례 A', '사례 B', '사례 C'], at: c('4.3.0') + 0.6 })
X.dataBars(c('4.4.0'), { eb: '1 · 고객 데이터', label: '꾸준히 *쌓고*', labelAt: w('쌓고', '4.4.0') })
K.phoneShot(c('4.4.1'), { name: 'paw', base: 0, steps: [1, 2, 3], run: [c('4.4.1') + 0.5, c('4.4.1') + 2.6], label: '2 · 고객이 직접 쓰는 플랫폼', lbc: 'hot' })
K.link(c('4.4.2'), { eb: '3 · 하나로 연결', ebc: 'hot', a: { ic: 'gear', label: '회사 안 운영' }, b: { ic: 'users', label: '고객 플랫폼', cls: 'hot' }, linkAt: w('연결해', '4.4.2') - 0.2, label: '*하나로* 연결', labelAt: w('하나로', '4.4.2') })

// ── ④ 플랫폼이란 · 사례
K.big(c('5.1.0'), { icon: 'users', text: '*플랫폼*이란?', size: 'xl', y: 700, shot: { bg: 'bgB' } })
X.skyline(c('5.1.1'), { xAt: c('5.1.2') })
K.big(c('5.2.0'), { icon: 'shop', text: '우리 *업종* 맞춤', size: 'l', y: 700, shot: { bg: 'bgL' } })
K.link(c('5.2.1'), { a: { ic: 'users', label: '고객' }, b: { ic: 'building', label: '거래처' }, mid: 'shop', label: '*작은 서비스*에 모인다', labelAt: w('작은', '5.2.1') })
K.big(c('5.3.0'), { eb: '조사 사례', ebc: 'hot', icon: 'doc', text: '실제 *사례*', size: 'xl', y: 700, fine: '조사 사례 요약 · 미래AI랩 실적 아님', shot: { trans: 'flash' } })
K.big(c('5.4.0'), { eb: '렌털업체', icon: 'book', text: '손으로 쓰던 *장부*', size: 'l', y: 700, shot: { bg: 'bgOld' } })
K.morph(c('5.4.1'), { eb: '렌털업체', from: ['book', '손 장부'], to: ['cloud', '클라우드 시스템'], bAt: w('클라우드', '5.4.1') })
K.link(c('5.4.2'), { a: { ic: 'db', label: '데이터' }, b: { ic: 'bank', label: '금융 사업', cls: 'hot' }, linkAt: w('금융', '5.4.3') - 0.3, label: '금융 사업까지 *확장*', labelAt: w('넓힐', '5.4.3') })
K.counter(c('5.4.4'), { to: 15, suf: '억 원', y: 420, at: w('15억', '5.4.4') - 0.2, d: 0.9, label: '보증·금융지원', fine: '조사 사례 요약 · 미래AI랩 실적 아님', shot: { bg: 'bgC' } })
fzBefore(5, 5, '15억 원 규모 보증·금융지원', '렌털 장부 → 클라우드 → 금융')
K.big(c('5.5.0'), { eb: '조사 사례 2', icon: 'gear', text: '*히트펌프*', size: 'xl', y: 700 })
K.morph(w('운영', '5.5.0') - 0.25, { eb: '히트펌프', from: ['gear', '설비 판매'], to: ['cloud', '운영·모니터링 구독'], bAt: w('구독', '5.5.0') - 0.1 })
K.morph(c('5.5.1'), { eb: '조사 사례 3 · 수산물 유통', from: ['shop', '수산물 유통'], to: ['db', '데이터 B2B 플랫폼'], bAt: w('데이터', '5.5.1') - 0.1, shot: { bg: 'bgB' } })
K.morph(c('5.5.2'), { eb: '조사 사례 4 · 부동산 중개', from: ['building', '부동산 중개'], to: ['gear', '공실 관리 자동화'], bAt: w('공실', '5.5.2') - 0.1, shot: { bg: 'bgD' } })
K.tiles(c('5.5.3'), { y: 420, eb: '성장자금 ✓', ebY: 310, items: [
  { ic: 'gear', label: '히트펌프', c: 'dark', ok: true, okAt: c('5.5.3') + 0.5 }, { ic: 'shop', label: '수산물 유통', c: 'dark', ok: true, okAt: c('5.5.3') + 0.8 },
  { ic: 'building', label: '부동산 중개', c: 'dark', ok: true, okAt: c('5.5.3') + 1.1 }], extra: K.fineAt('f553', '조사 사례 요약 · 미래AI랩 실적 아님', 1290) })
K.tiles(c('5.6.0'), { layout: 'row', y: 560, items: [{ ic: 'gear', label: '제조', at: w('제조', '5.6.0') }, { ic: 'shop', label: '유통', at: w('유통', '5.6.0') }, { ic: 'building', label: '숙박', at: w('숙박까지', '5.6.0') }], eb: '업종은 달라도', ebY: 420, shot: { bg: 'bgL' } })
X.flowRows(c('5.6.1'), { eb: '흐름은 같았다', ebc: 'hot', rows: ['제조', '유통', '숙박'], at: c('5.6.1') + 0.4, shot: { bg: 'bgA' } })
K.puzzle(c('5.7.0'), { a: ['db', '데이터'], b: ['users', '사람'], result: '회사가 크는 구조', snapAt: w('모이는', '5.7.0') })
K.chart(c('5.7.1'), { mode: 'up', tagTop: '더 커질 회사', tagTopX: 640, tagTopAt: w('커질', '5.7.1') })
K.stamp(c('5.7.2'), { text: '공통점', color: 'orange', at: c('5.7.2') + 0.15, shot: { bg: 'bgC' } })

// ── ④ 정책 방향
K.link(c('6.1.0'), { a: { ic: 'gov', label: '정부' }, b: { ic: 'ai', label: 'AI 도입 기업', cls: 'hot' }, linkAt: w('도입한', '6.1.0'), shot: { bg: 'bgB' } })
K.stamp(c('6.1.1'), { text: '공식 발표', color: 'orange', at: w('공식', '6.1.1'), under: K.chipAt('gov1', '정부 · 2026', 330, 'big') })
X.axdef(c('6.2.0'), { axAt: w('AX라고', '6.2.0') - 0.8, aAt: w('AI와', '6.2.0'), dAt: w('데이터로', '6.2.0'), wAt: w('일하는', '6.2.0'), sAt: w('AX라고', '6.2.0') })
K.link(c('6.2.1'), { a: { ic: 'gov', label: '정부' }, b: { ic: 'ai', label: 'AX 도입 기업', cls: 'hot' }, mid: 'money', linkAt: w('도입한', '6.2.1') - 0.3, label: 'AX 기업에 *자금*', labelAt: w('기업에', '6.2.1') })
X.policy(c('6.2.2'), { at: w('7540', '6.2.2') - 0.2 })
K.big(c('6.3.0'), { eb: '미래AI랩', ebc: 'hot', icon: 'rocket', text: '한 걸음 *더*', size: 'xl', y: 700, shot: { bg: 'bgC', trans: 'zoom' } })
K.people(c('6.4.0'), { y: 560, items: [['gov', '정부', w('정부와', '6.4.0')], ['user', '심사위원', w('심사위원', '6.4.0')], ['invest', '투자자', w('투자자가', '6.4.0')]], react: 'heart', reactAt: w('좋아할', '6.4.1') - 0.1, center: '모두 *좋아할* 회사', centerAt: w('좋아할', '6.4.1') })
K.puzzle(c('6.4.2'), { a: ['users', '플랫폼'], b: ['ai', 'AX'], result: '플랫폼 + AX', snapAt: w('결합한', '6.4.2') - 0.1 })
X.wire(c('6.4.3'), { chip: '서비스로 설계', chipAt: w('설계했습니다', '6.4.3') - 0.2 })

// ── ⑤ 해결
K.chapter(c('7.1.0'), '⑤ 해결')
K.link(c('7.1.0'), { a: { ic: 'building', label: '안' }, b: { ic: 'users', label: '밖', cls: 'hot' }, eb: '대표님 회사의', linkAt: c('7.1.1'), label: '안과 밖을 *연결*', labelAt: w('연결해', '7.1.1') })
K.tiles(c('7.2.0'), { y: 360, eb: '안 · 회사 운영', ebY: 250, items: [
  { ic: 'team', label: '직원', at: w('직원', '7.2.0') }, { ic: 'users', label: '고객', at: w('고객', '7.2.0') },
  { ic: 'db', label: '재고', at: w('재고', '7.2.0') }, { ic: 'money', label: '정산', at: w('정산을', '7.2.0') }] })
K.phoneShot(c('7.2.1'), { name: 'gsax', base: 1, steps: [], label: '대표님 폰 · 한 화면', lbc: 'hot', scrollAt: c('7.2.1') + 1.0, scrollBy: -260 })
K.people(c('7.2.2'), { eb: '밖 · 고객 플랫폼', y: 520, items: [['users', '고객'], ['building', '거래처']], react: 'ok', reactAt: c('7.2.2') + 0.9, shot: { bg: 'bgL' } })
K.phoneShot(c('7.2.3'), { name: 'gsbk2', base: 0, steps: [1, 2, 3, 4, 5], run: [c('7.2.3') + 0.3, c('7.2.3') + 3.3], label: '고객이 직접 예약', lbc: 'hot' })
X.twoPhones(c('7.3.0'), { a: { name: 'gsbk2', base: 5, label: '밖 · 고객' }, b: { name: 'gsax', base: 1, label: '안 · 대표님' }, mid: 'link', linkAt: c('7.3.0') + 0.4 })
K.link(c('7.3.1'), { a: { ic: 'db', label: '쌓이는 데이터' }, b: { ic: 'ai', label: 'AI', cls: 'hot' }, linkAt: c('7.3.1') + 0.3, label: 'AI가 *읽는다*', labelAt: w('읽고', '7.3.1'), shot: { bg: 'bgB' } })
K.phoneShot(c('7.3.2'), { name: 'gsbk2', base: 11, steps: [], label: 'AI · 다음 할 일', lbc: 'hot',
  inner: `<img class="fimg" id="p732b" src="${FL('gsax-02')}" style="width:420px;opacity:0" alt="">` })
B.tw(`tl.to('#p732b', { opacity: 1, duration: 0.2 }, ${r2(w('알려', '7.3.2') - 0.2)});`)
K.browser(c('7.4.0'), { src: SH('ax-gounsot'), tag: '샘플 화면', label: '우리 회사의 플랫폼', lbc: 'hot', d: 2.4 })
K.chart(c('7.4.1'), { mode: 'up', tagTop: '성장 계획', tagTopX: 660, tagTopAt: w('성장할', '7.4.1'), eb: '앞으로 어떻게?', shot: { bg: 'bgD' } })
K.phoneShot(c('7.4.2'), { name: 'mom', base: 0, steps: [1, 2, 3], run: [c('7.4.2') + 0.4, c('7.4.2') + 2.6], label: '샘플 화면 · 직접 보여 주기', lbc: 'hot' })

K.room(c('8.1.0'), { me: '“자금이 들어오면<br>하겠습니다…”', meY: 760, meAt: c('8.1.0') + 0.05, cross: true, crossAt: w('대신에', '8.1.0') - 0.1 })
K.room(c('8.1.1'), { show: FL('gsax-01'), showAt: c('8.1.1') + 0.05, showY: 640, react: 'ok', reactAt: w('보여', '8.1.1') })
K.room(c('8.1.2'), { q: '“이거 진짜<br>되나요?”', qAt: c('8.1.2') + 0.05, qType: 0.8, shot: { trans: 'zoom' } })
K.phoneShot(c('8.1.3'), { name: 'paw', base: 3, steps: [4, 5, 6, 7], run: [c('8.1.3') + 0.2, c('8.1.3') + 2.2], label: '직접 눌러 보기', lbc: 'hot' })
K.chart(c('8.2.0'), { mode: 'flat', tagOurs: '멈춰 보였던 회사', tagOursX: 540, tagOursY: 300, tagOursAt: c('8.2.0') + 0.8 })
K.chart(c('8.2.1'), { mode: 'recover', tagTop: '다음 단계', tagTopX: 660, tagTopAt: w('다음', '8.2.1'), at: c('8.2.1') - 0.1, d: 1.0, shot: { bg: 'bgD' } })
fzBefore(9, 1, '다음 단계가 보이는 회사')

// ── ⑥ 근거 + 차별점
K.chapter(c('9.1.0'), '⑥ 근거 + 차별점')
K.swap(c('9.1.0'), { tag: '샘플 화면', items: [
  { src: SH('ax-gounsot'), label: '음식점' }, { src: SH('ax-edumaster'), label: '학원', at: w('학원', '9.1.0') - 0.05 },
  { src: SH('ax-seum'), label: '제조', at: w('제조', '9.1.0') - 0.05 }, { src: SH('ax-nexmart'), label: '유통', at: w('유통까지', '9.1.0') - 0.05 }] })
K.wall(c('9.1.1'), { srcs: SAMPLES, center: '20개+<small>업종별 AX·MVP 샘플</small>', centerAt: w('20개', '9.1.1') - 0.1 })
K.tiles(c('9.1.2'), { y: 360, eb: '실제 기업과 함께 제작 중 · 업체명 비공개', ebY: 250, items: [
  { ic: 'gear', label: '산업용 설비', c: 'dark' }, { ic: 'shield', label: '웰니스 케어', c: 'dark' }, { ic: 'plug', label: '전기·정보통신', c: 'dark' }, { ic: 'shop', label: '피혁 제조·도소매', c: 'dark' }] })
K.big(c('9.2.0'), { eb: '미래AI랩', ebc: 'hot', icon: 'gear', text: '저희도 *AX로* 일해요', size: 'm', y: 700, shot: { bg: 'bgC' } })
K.counter(c('9.3.0'), { eb: 'AX 핵심기술 특허 출원', ebc: 'hot', from: 1, to: 5, suf: '건', y: 420, at: w('특허', '9.3.0'), d: 0.8, label: '2026. 9. 11 출원', fine: '특허는 출원(등록 아님)' })
X.sysForm(c('9.3.1'), { rows: [['회사명', '○○기업'], ['업종', '제조'], ['직원 수', '12명'], ['매출 규모', '8억 원']], tapAt: w('넣으면', '9.3.1') })
X.dash(c('9.3.2'), { cards: [['money', '받을 수 있는', '지원금 3건', w('지원금과', '9.3.2')], ['shield', '챙겨야 할', '인증 2건', w('인증', '9.3.2')], ['doc', '절세 포인트', '2가지', w('절세', '9.3.3')]] })
K.notifs(c('9.4.0'), { eb: '매일 알림', items: [{ ic: 'bell', t: '새 지원사업 공고', s: '우리 회사 해당 가능', w: '오늘' }, { ic: 'cal', t: '마감 D-7', s: '서류 준비 안내', c: 'blue', w: '오늘' }, { ic: 'money', t: '정책자금 접수 시작', s: '조건 맞음', c: 'green', w: '방금' }], fine: '예시 화면' })
K.big(c('9.5.0'), { icon: 'memo', icc: 'red', text: '감과 기억에만<br>*기대지 않아요*', size: 'm', y: 700 })
K.big(c('9.5.1'), { icon: 'ai', icc: 'green', text: '시스템이 *먼저*', size: 'l', y: 700, shot: { bg: 'bgD' } })
K.checks(c('9.5.2'), { eb: '놓치는 게 줄어요', items: [['지원금', c('9.5.2') + 0.3], ['인증', c('9.5.2') + 0.55], ['마감일', c('9.5.2') + 0.8], ['절세', c('9.5.2') + 1.05]], shot: { bg: 'bgL' } })

// ── ⑦ 닫기
K.chapter(c('10.1.0'), '⑦ 닫기')
K.room(c('10.1.0'), { extra: K.chipAt('next', '다음 심사', 700, 'big'), q: '“그래서, 다음은<br>어떻게 되나요?”', qAt: c('10.1.1'), qY: 820, qType: 1.0 })
K.room(c('10.1.2'), { show: FL('gsbk2-11'), showAt: w('화면을', '10.1.3') - 0.3, showY: 640, react: 'ok', reactAt: w('보여', '10.1.3') })
K.big(c('10.2.0'), { icon: 'q', text: '무엇부터<br>*보여 줄까?*', size: 'l', y: 660 })
X.cta(c('10.3.0'), { tapAt: c('10.3.1') + 0.2 })
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(c('10.4.0'), { eb: '다음 영상 ▶', card: '<span class="no">영상 2</span><h3>어떻게 진행하고,<br>얼마가 드나</h3><ul><li>4단계 진행</li><li>비용</li><li>후불·정산</li></ul>' })

const TOTAL = r2(ENDV + 3.0)
B.finish(TOTAL)
