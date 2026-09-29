// 영상 2 · 어떻게 진행하고, 얼마가 드나 — 자막 조각마다 화면을 바꾼다
import { createBuild, r2, ic } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'

const TITLE = '영상 2 · 어떻게 진행하고, 얼마가 드나'
const B = createBuild('.', { title: TITLE, tag: '영상 2 · 어떻게 진행하고, 얼마가 드나' })
const K = kit(B)
const X = kit2(B, K)
const { T, C, wt, freeze, shot, tw, from, pop } = B
const c = (s) => { const [b, l, p] = s.split('.').map(Number); return C(b, l, p ?? 0).start }
const w = (needle, f) => wt(needle, typeof f === 'string' ? c(f) : f)
const SH = (n) => `assets/shots/${n}.jpg`
const FL = (n) => `assets/flows/${n}.jpg`
function fzBefore(b, l, label, sub = '') {
  const [s0, e0] = B.silBefore(b, l)
  const s = r2(s0 + 0.05), e = r2(e0 - 0.2)
  freeze(s, e - s, label, sub)
  return [s, e]
}
const STEPS = [['진단', '성장 설계도', 'target'], ['2주 안에 MVP·기본 틀', '기존 프로그램은 그대로', 'rocket'], ['데이터 쌓기', '다듬고 테스트', 'db'], ['외부 매력 다듬기', '인증·재무', 'star']]

// 수수료 비교(숫자 없이 모양만) — 구체 수수료는 상담 때
function compare(t, o) {
  const id = K.uid('cp')
  const html = `${K.chipAt(`${id}-eb`, '수수료', 300, 'big')}<div class="cmp" id="${id}"><div class="cb g"><i id="${id}-a" style="height:560px"></i><span>일반 정책자금<br>컨설팅</span></div><div class="cb hot"><i id="${id}-b" style="height:330px"></i><span>미래AI랩</span></div></div>${K.fineAt(`${id}-f`, '구체 수수료는 상담 때 안내드려요', 1290)}`
  shot(t, html, o.shot)
  from(`#${id}-eb`, t + 0.05, 'y: -30, opacity: 0', 0.3)
  tw(`tl.from('#${id} .cb i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.6, ease: 'power3.out', stagger: 0.35 }, ${r2(t + 0.15)});`)
  from(`#${id}-f`, t + 0.5, 'opacity: 0', 0.3)
}
B.addCss(`
.cmp { position: absolute; left: 200px; right: 200px; top: 400px; height: 800px; display: flex; align-items: flex-end; justify-content: space-between; }
.cb { width: 260px; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.cb i { display: block; width: 100%; border-radius: 22px 22px 6px 6px; background: #4B5563; }
.cb.hot i { background: #F0894A; box-shadow: 0 20px 60px rgba(240,137,74,.4); }
.cb span { font-size: 38px; font-weight: 900; text-align: center; line-height: 1.2; color: #C9D0D8; } .cb.hot span { color: #F0894A; }
`)

// ── ① 훅
K.big(0, { eb: '영상 1을 보고 나면', icon: 'q', text: '드는 생각<br>*두 가지*', size: 'l', y: 720, shot: { bg: 'bgA' } })
K.tiles(c('1.2.0'), { y: 470, eb: '좋아 보이긴 하는데…', ebY: 350, items: [
  { ic: 'gear', label: '어떻게 진행돼?', at: w('진행되고', '1.2.1') - 0.1 },
  { ic: 'money', label: '얼마나 들까?', at: w('얼마가', '1.2.1') - 0.1 }] })
K.big(c('1.3.0'), { icon: 'rocket', text: '지금부터<br>*답해 드릴게요*', size: 'l', y: 700, shot: { bg: 'bgC', trans: 'zoom' } })
X.title(B.silBefore(2, 1)[0] + 0.05, { no: '영상 2', title: '어떻게 진행하고,<br>*얼마가* 드나' })

// ── ② 진행 방식
K.chapter(c('2.1.0'), '② 진행 방식')
K.steps(c('2.1.0'), { eb: '진행 4단계', items: STEPS, active: -1, top: 330 })
K.steps(c('2.2.0'), { eb: '첫째', items: STEPS, active: 0, top: 330, shot: { trans: 'cut' } })
K.counter(c('2.3.0'), { from: 1, to: 9, suf: '년 차', y: 420, at: c('2.3.0') + 0.1, d: 0.8, label: '경영컨설턴트가 직접', shot: { bg: 'bgB' } })
K.phoneShot(c('2.3.1'), { name: 'gsax', base: 0, steps: [], label: '직접 개발 · 특허 출원한 AX', lbc: 'hot', scrollAt: c('2.3.1') + 1.2, scrollBy: -200 })
K.checks(c('2.3.2'), { eb: '진단', items: [['성장 단계', w('성장', '2.3.2')], ['업무 흐름', w('업무를', '2.3.2')], ['데이터 위치', w('살펴보고', '2.3.2')]] })
X.wire(c('2.3.3'), { chip: '성장 설계도', chipAt: w('설계도를', '2.3.3') - 0.2 })

K.steps(c('3.1.0'), { eb: '둘째', items: STEPS, active: 1, top: 330 })
K.counter(c('3.1.1'), { from: 0, to: 2, suf: '주', y: 420, at: c('3.1.1') - 0.2, d: 0.6, label: 'MVP(최소 기능 제품)·기본 틀', shot: { bg: 'bgC' },
  extra: `<div class="days" id="days2">${'<i></i>'.repeat(14)}</div>` })
tw(`tl.from('#days2 i', { scale: 0, opacity: 0, duration: 0.25, ease: 'back.out(2)', stagger: 0.06 }, ${r2(c('3.1.1') + 0.3)});`)
B.addCss(`.days { position: absolute; left: 150px; right: 150px; top: 900px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 16px; } .days i { display: block; height: 90px; border-radius: 16px; background: #F0894A; } .days i:nth-child(n+8) { background: #FFD8BE; }`)
fzBefore(3, 2, '2주 안에 MVP·기본 틀', 'MVP = 최소 기능 제품')
K.big(c('3.2.0'), { icon: 'x', icc: 'red', text: '다 *갈아엎지*<br>않아요', size: 'l', y: 700 })
K.tiles(c('3.3.0'), { layout: 'row', y: 540, eb: '기존 프로그램은 그대로', ebY: 400, items: [
  { ic: 'db', label: 'ERP', ok: true, okAt: c('3.3.0') + 0.6 }, { ic: 'money', label: '포스기', ok: true, okAt: c('3.3.0') + 0.8 }, { ic: 'excel', label: '엑셀', ok: true, okAt: c('3.3.0') + 1.0 }], shot: { bg: 'bgL' } })
K.link(c('3.3.1'), { a: { ic: 'db', label: '기존 프로그램' }, b: { ic: 'ai', label: 'AX', cls: 'hot' }, linkAt: w('연결해', '3.3.1') - 0.3, label: '필요한 데이터만 *연결*', labelAt: w('데이터만', '3.3.1') })
K.big(c('3.4.0'), { eb: '예시 1 · 일반 중소기업', icon: 'building', text: '*ERP*를 쓴다면', size: 'l', y: 720, shot: { bg: 'bgB' } })
K.scatter(c('3.4.1'), { items: [
  { ic: 'doc', label: '주문', x: 90, y: 350, r: -5, at: w('주문', '3.4.1') }, { ic: 'db', label: '재고', x: 640, y: 420, r: 4, at: w('재고', '3.4.1') }, { ic: 'money', label: '매출', x: 170, y: 980, r: 3, at: w('매출', '3.4.1') }],
  gatherAt: w('연동해서', '3.4.1'), core: { ic: 'ai', label: 'AX로 연동' }, coreY: 560 })
K.tiles(c('3.4.2'), { layout: 'row', y: 540, eb: '예시 2 · 음식점', ebY: 400, items: [
  { ic: 'shop', label: '본점', at: c('3.4.2') + 0.05 }, { ic: 'shop', label: '2호점', at: w('2호점', '3.4.2') }, { ic: 'shop', label: '3호점', at: w('3호점까지', '3.4.2') }], shot: { bg: 'bgL' } })
K.link(c('3.4.3'), { a: { ic: 'money', label: '포스기' }, b: { ic: 'ai', label: 'AX', cls: 'hot' }, linkAt: w('매출', '3.4.3') - 0.2, label: '매출 데이터를 *가져온다*', labelAt: w('가져오는', '3.4.3') - 0.3 })
K.note(c('3.4.0'), r2(c('3.5.1') + 2.9 - c('3.4.0')), '<span>※ 프로그램에 따라 연동 방식이 다릅니다</span>', 1240)
K.big(c('3.5.0'), { icon: 'clock', text: '*천천히* 적응하며<br>도입', size: 'l', y: 700, shot: { bg: 'bgD' } })
K.people(c('3.5.1'), { y: 560, items: [['user', '직원'], ['user', '점장'], ['user', '매니저']], react: 'ok', reactAt: w('적습니다', '3.5.1') - 0.3, center: '부담·반발 *↓*', centerAt: w('부담과', '3.5.1') })

K.steps(c('4.1.0'), { eb: '셋째', items: STEPS, active: 2, top: 330 })
K.checks(c('4.2.0'), { eb: '실제 업무 자료로', items: [['자료 받기', c('4.2.0') + 0.4], ['우리 회사에 맞게', w('다듬고', '4.2.1')], ['테스트', w('테스트하면서', '4.2.1')]] })
X.dataBars(c('4.2.2'), { eb: '데이터 ↑', label: '차곡차곡 *쌓기*', labelAt: c('4.2.2') + 0.3 })
K.chart(c('4.3.0'), { mode: 'up', tagTop: 'AI 정확도 ↑', tagTopX: 620, tagTopAt: w('정확해지고', '4.3.0'), eb: '쌓일수록', shot: { bg: 'bgB' } })
K.room(c('4.3.1'), { show: FL('gsbk2-11'), showAt: c('4.3.1') + 0.1, react: 'ok', reactAt: w('핵심', '4.3.1'), extra: K.chipAt('ev', '심사 핵심 근거', 1360, 'hot') })
K.scatter(c('4.4.0'), { items: [{ label: '주문', x: 90, y: 360 }, { label: '예약', x: 700, y: 380 }, { label: '재고', x: 120, y: 1000 }, { label: '고객', x: 700, y: 1000 }],
  gatherAt: c('4.4.0') + 0.75, core: { ic: 'db', label: '회사의 자산' }, coreY: 560 })
K.morph(c('4.4.1'), { from: ['db', '쌓인 데이터'], to: ['cloud', '구독형 서비스'], bAt: w('구독형', '4.4.1') - 0.1, eb: '새 사업으로' })

K.steps(c('5.1.0'), { eb: '넷째', items: STEPS, active: 3, top: 330 })
K.people(c('5.1.1'), { y: 560, items: [['invest', '투자자'], ['user', '심사위원'], ['gov', '기관']], react: 'star', reactAt: w('매력적인', '5.1.1'), center: '*매력적인* 회사로', centerAt: w('매력적인', '5.1.1') })
K.stamp(c('5.2.0'), { text: '기본 포함', color: 'green', at: w('기본으로', '5.2.0') - 0.1, y: 720,
  under: `${K.chipAt('vc', '벤처기업확인 · 신청까지 함께 준비', 360, 'big')}${K.chipAt('vc2', '어떤 상품이든', 470, 'gray')}`, extra: K.fineAt('vcf', '확인 결과·기간은 외부기관 심사에 따라 달라요', 1290) })
K.tiles(c('5.2.1'), { y: 420, eb: '비재무 · 기업 인증', ebY: 310, items: [
  { ic: 'shield', label: '벤처기업확인', c: 'dark' }, { ic: 'book', label: '기업부설연구소', c: 'dark' }, { ic: 'star', label: '이노비즈·메인비즈', c: 'dark' }], extra: K.fineAt('f521', '필요한 것만 골라 신청까지 함께 준비', 1290) })
K.tiles(c('5.2.2'), { y: 480, eb: '재무', ebY: 370, items: [{ ic: 'invest', label: '신용등급', at: w('신용등급', '5.2.2') }, { ic: 'money', label: '부채비율', at: w('부채비율', '5.2.2') }], shot: { bg: 'bgL' } })
K.puzzle(c('5.2.3'), { a: ['shield', '비재무'], b: ['money', '재무'], result: '함께 다듬기', snapAt: c('5.2.3') + 0.6 })

// ── ③ 달라지는 모습
K.chapter(c('6.1.0'), '③ 도입하면 달라지는 모습')
K.big(c('6.1.0'), { icon: 'rocket', text: '이렇게<br>*달라집니다*', size: 'xl', y: 680, shot: { bg: 'bgC', trans: 'zoom' } })
K.tiles(c('6.2.0'), { y: 420, items: [{ ic: 'money', label: '매출', at: w('매출', '6.2.0') }, { ic: 'db', label: '재고', at: w('재고', '6.2.0') }, { ic: 'team', label: '직원별 처리 현황', at: w('직원별', '6.2.0') }] })
K.phoneShot(c('6.2.1'), { name: 'gsax', base: 1, steps: [], label: '대표님 폰 · 한 화면에 수치로', lbc: 'hot', scrollAt: c('6.2.1') + 1.0, scrollBy: -240 })
K.phoneShot(c('6.2.2'), { name: 'gsbk2', base: 11, steps: [], label: '잘 팔리는 것 · 수요 예측', lbc: 'hot', scrollAt: c('6.2.2') + 0.6, scrollBy: -160 })
K.big(c('6.2.3'), { icon: 'down', icc: 'red', text: '시간·돈이<br>*새는 곳*', size: 'l', y: 700 })
K.big(c('6.3.0'), { icon: 'ai', text: 'AI는<br>*한 걸음 더*', size: 'l', y: 700, shot: { bg: 'bgB' } })
K.phoneShot(c('6.3.1'), { name: 'gsax', base: 2, steps: [], label: 'AI 추천 · 다음 할 일', lbc: 'hot', scrollAt: c('6.3.1') + 1.4, scrollBy: -220 })
K.chart(c('6.4.0'), { mode: 'up', tagTop: '더 밀기', tagTopX: 700, tagTopAt: w('밀고', '6.4.0'), eb: '잘 팔리는 건', shot: { bg: 'bgD' } })
K.big(c('6.4.1'), { icon: 'shield', icc: 'green', text: '새는 것은<br>*막기*', size: 'l', y: 700 })
K.notifs(c('6.5.0'), { eb: '하나의 업무 공간', items: [{ ic: 'chat', t: '오늘 발주 확인 부탁드려요', s: '점장', w: '09:12' }, { ic: 'check', t: '재고 입력 완료', s: '주방', c: 'green', w: '09:20' }, { ic: 'bell', t: '예약 3건 추가', s: 'AI 알림', c: 'blue', w: '09:31' }], fine: '예시 화면' })
K.tiles(c('6.5.1'), { y: 420, eb: '권한별 화면', ebY: 310, items: [{ ic: 'user', label: '대표 · 전체' }, { ic: 'team', label: '점장 · 매장' }, { ic: 'lock', label: '직원 · 내 업무' }] })
X.sysForm(c('6.5.2'), { title: '오늘 입력', btn: '저장 →', rows: [['입고', '한우 20kg'], ['담당', '주방']], tapAt: w('입력하고요', '6.5.2') - 0.2 })
X.leave(c('6.6.0'), { who: '담당자', label: '기록은 *그대로*', goAt: w('바뀌어도', '6.6.0') - 0.1, labelAt: w('기록이', '6.6.0') })
K.big(c('6.6.1'), { icon: 'clock', icc: 'green', text: '인수인계<br>*부담 ↓*', size: 'l', y: 700, shot: { bg: 'bgD' } })
K.people(c('6.7.0'), { y: 560, eb: '우리 플랫폼에서', items: [['users', '고객'], ['building', '거래처']], shot: { bg: 'bgL' } })
K.phoneShot(c('6.7.1'), { name: 'mom', base: 0, steps: [1, 2, 3], run: [c('6.7.1') + 0.2, c('6.7.1') + 1.5], label: '직접 주문 · 예약', lbc: 'hot' })
X.dataBars(c('6.7.2'), { eb: '매일', label: '데이터가 *쌓인다*', labelAt: c('6.7.2') + 0.3 })
K.big(c('6.8.0'), { icon: 'db', text: '심사용만이<br>*아니에요*', size: 'l', y: 700, shot: { bg: 'bgC' } })
K.morph(c('6.9.0'), { from: ['db', '쌓인 데이터'], to: ['rocket', '새 서비스 출시'], bAt: w('출시해서', '6.9.0') - 0.1 })
K.big(c('6.9.1'), { icon: 'cloud', text: '*구독* 방식으로', size: 'l', y: 700, shot: { bg: 'bgB' } })
K.chart(c('6.9.2'), { mode: 'up', tagTop: '새로운 사업', tagTopX: 640, tagTopAt: w('사업으로', '6.9.2'), shot: { bg: 'bgD' } })

K.browser(c('7.1.0'), { src: SH('ax-lumiere-dash'), tag: '샘플 화면', label: '밖에서 봐도 달라요', lbc: 'hot', d: 3.0 })
K.people(c('7.2.0'), { y: 560, items: [['invest', '투자자', w('투자자와', '7.2.0')], ['user', '심사위원', w('심사위원에게는', '7.2.0')]], react: 'heart', reactAt: w('투자하고', '7.2.1'), center: '*투자하고 싶은* 회사', centerAt: w('투자하고', '7.2.1') })
K.room(c('7.3.0'), { q: '“그래서, 다음은<br>어떻게 되나요?”', qAt: w('그래서', '7.3.1') - 0.1, qType: 0.9, extra: K.chipAt('ss', '심사 자리', 700, 'big') })
K.room(c('7.3.2'), { show: FL('gsax-01'), showAt: c('7.3.2') + 0.05, react: 'ok', reactAt: w('답할', '7.3.2') - 0.2 })
K.chart(c('7.4.0'), { mode: 'gap', tagTop: 'AI 도입 회사', tagTopX: 560, tagTopAt: c('7.4.0') + 0.9, tagOurs: '그렇지 않은 회사', tagOursX: 440, tagOursY: 480, tagOursAt: w('그렇지', '7.4.1'), d: 1.6 })
K.big(c('7.4.2'), { icon: 'up', text: '격차는<br>*계속 벌어져요*', size: 'l', y: 700, shot: { bg: 'bgA' } })
K.big(c('7.5.0'), { icon: 'rocket', text: '*먼저* 도입한<br>회사가 유리', size: 'l', y: 700, shot: { bg: 'bgC', trans: 'zoom' } })
{
  const [, e] = fzBefore(8, 1, '먼저 도입한 회사가 유리', '샘플에서 직접 눌러 보세요')
  K.note(c('7.5.0') + 0.5, r2(e - c('7.5.0') - 0.5), '<span>▶ 샘플에서 직접 눌러 보세요 · miraeailab.com</span>', 1240)
}

// ── ④ 비용
K.chapter(c('8.1.0'), '④ 비용')
K.big(c('8.1.0'), { icon: 'money', text: '*비용*', size: 'xl', y: 720, shot: { bg: 'bgL', trans: 'flash' } })
K.counter(c('8.2.0'), { eb: '1 · MVP(최소 기능 제품)', to: 500, suf: '만 원~', y: 520, at: w('500만', '8.2.0') - 0.3, d: 0.7, label: '작게, 빨리 시작', shot: { bg: 'bgA' } })
K.counter(c('8.2.1'), { eb: '2 · 고객이 쓰는 플랫폼형', to: 1500, suf: '만 원~', y: 520, cls: 'mid', at: w('1500만', '8.2.1') - 0.3, d: 0.7, label: '고객·거래처가 직접 쓰는 화면', shot: { bg: 'bgB' } })
K.counter(c('8.2.2'), { eb: '3 · 풀 패키지', ebc: 'hot', to: 3000, suf: '만 원~', y: 520, cls: 'mid', at: w('3000만', '8.2.3') - 0.4, d: 0.7, label: 'AX + 플랫폼 모두 연결', labelAt: c('8.2.2') + 0.5, shot: { bg: 'bgC' } })
fzBefore(8, 3, '500 · 1,500 · 3,000만 원부터', 'MVP · 플랫폼형 · 풀 패키지')
const PR = [{ name: 'MVP', tag: '최소 기능 제품', v: '500', n: 500 }, { name: '플랫폼형', tag: '고객이 쓰는', v: '1,500', n: 1500 }, { name: '풀 패키지', tag: 'AX + 플랫폼', v: '3,000', n: 3000 }]
K.prices(c('8.3.0'), { eb: '처음엔 작게 시작해도', items: PR, active: 0, pulseAt: w('MVP나', '8.3.0'), top: 360 })
K.big(c('8.3.1'), { icon: 'up', icc: 'green', text: '한 단계씩<br>*올라가도 돼요*', size: 'l', y: 700, shot: { bg: 'bgD' } })
K.tiles(c('8.4.0'), { y: 420, eb: '풀 패키지 진행', ebY: 310, items: [
  { ic: 'rocket', label: '2주 · 기본 틀', ok: true, okAt: w('잡은', '8.4.0') },
  { ic: 'gear', label: '커스터마이징', at: w('커스터마이징과', '8.4.1') - 0.1 },
  { ic: 'check', label: '테스트', at: w('테스트를', '8.4.1') - 0.1 }] })
K.stamp(c('8.4.2'), { text: '1년 무상', color: 'green', at: w('무상으로', '8.4.3') - 0.15, y: 700, under: K.chipAt('ms', '기본 AX·플랫폼 유지보수', 400, 'big') })
fzBefore(9, 1, '유지보수 1년 무상', '기본 AX·플랫폼')

K.tiles(c('9.1.0'), { layout: 'row', y: 540, eb: '이 금액은', ebY: 400, items: [{ ic: 'user', label: '컨설팅', at: w('컨설팅과', '9.1.0') }, { ic: 'gear', label: '개발', at: w('개발에', '9.1.0') }], shot: { bg: 'bgL' } })
K.checks(c('9.1.1'), { eb: '진행한 만큼 정산', items: [['진단', w('진행', '9.1.2')], ['MVP·기본 틀', w('정도에', '9.1.2')], ['데이터·테스트', w('정산합니다', '9.1.2')]], extra: K.fineAt('f911', '자금 승인 여부와 관계없이', 1290) })
K.big(c('9.2.0'), { icon: 'money', icc: 'red', text: '자금 흐름이<br>*부담*된다면', size: 'l', y: 700, shot: { bg: 'bgB' } })
K.link(c('9.2.1'), { a: { ic: 'bank', label: '자금 입금' }, b: { ic: 'money', label: '그 뒤 정산', cls: 'hot' }, linkAt: w('들어온', '9.2.1') - 0.2, label: '정산 시점을 *뒤로*', labelAt: w('뒤로', '9.2.1') - 0.3 })
K.counter(c('9.3.0'), { eb: '1년 동안 · 지원금+정책자금', from: 1, to: 5, suf: '번 이상', y: 460, at: w('5번', '9.3.1') - 0.3, d: 0.6, label: '신청해 드려요', fine: '선정·승인은 기관 심사에 따라 달라요', shot: { bg: 'bgC' } })
K.tiles(c('9.3.2'), { y: 460, eb: '처음에는', ebY: 350, items: [{ ic: 'user', label: '컨설팅 착수금만', ok: true, okAt: w('내시면', '9.3.2') - 0.2 }] , shot: { bg: 'bgA' } })
K.stamp(c('9.3.3'), { text: '개발비 후불', color: 'green', at: w('후별로도', '9.3.3') - 0.1, y: 700 })
K.big(c('9.3.4'), { icon: 'check', icc: 'green', text: '초기 부담<br>*크지 않아요*', size: 'l', y: 700, shot: { bg: 'bgD' } })
fzBefore(10, 2, '개발비 후불 가능', '착수금으로 시작')

// ── ⑤ 자금 신청·관리
K.chapter(c('10.2.0'), '⑤ 자금 신청·관리')
K.tiles(c('10.2.0'), { layout: 'row', y: 540, eb: '신청까지 쭉 함께', ebY: 400, items: [{ ic: 'bank', label: '정책자금', at: w('정책자금과', '10.2.0') }, { ic: 'gov', label: '지원사업', at: w('지원사업', '10.2.0') }], shot: { bg: 'bgL' } })
K.big(c('10.3.0'), { icon: 'book', text: '심사는<br>*스토리*', size: 'xl', y: 680, shot: { bg: 'bgB' } })
K.tiles(c('10.3.1'), { layout: 'row', y: 540, eb: '하나의 스토리로 설계', ebY: 400, items: [{ ic: 'ai', label: 'AX 개발', at: w('개발부터', '10.3.1') - 0.2 }, { ic: 'shield', label: '인증', at: w('인증까지', '10.3.1') - 0.1 }, { ic: 'bank', label: '자금 신청', at: w('하나의', '10.3.2') }] })
K.checks(c('10.3.3'), { eb: '처음부터 연결', items: [['사업계획서', c('10.3.3') + 0.4], ['인증 서류', c('10.3.3') + 0.8], ['자금 신청서', c('10.3.3') + 1.2]], shot: { bg: 'bgL' } })
K.big(c('10.4.0'), { icon: 'team', text: '따로 맡길<br>*필요 없이*', size: 'l', y: 700, shot: { bg: 'bgA' } })
K.people(c('10.4.1'), { y: 560, items: [['ai', '추가 개발'], ['shield', '인증'], ['bank', '자금']], react: 'ok', reactAt: w('같은', '10.4.1'), center: '*한 팀*이 이어서', centerAt: w('같은', '10.4.1') })
compare(c('10.4.2'), {})
K.big(c('10.5.0'), { icon: 'chat', text: '자세한 건<br>*상담 때*', size: 'l', y: 700, shot: { bg: 'bgC' } })

// ── ⑥ 정리
K.chapter(c('11.1.0'), '⑥ 정리')
K.big(c('11.1.0'), { icon: 'check', icc: 'green', text: '*정리*', size: 'xl', y: 700, shot: { trans: 'flash' } })
K.steps(c('11.2.0'), { eb: '한 번에 보기', items: STEPS, active: -1, top: 330, activeAt: [w('진단으로', '11.2.0'), w('2주', '11.2.1'), w('데이터를', '11.2.2'), w('기업', '11.2.3')] })
K.chart(c('11.3.0'), { mode: 'up', tagTop: '새 기능 · 새 사업', tagTopX: 520, tagTopAt: w('새', '11.3.0'), eb: '회사가 커져도', shot: { bg: 'bgD' } })
K.tiles(c('11.3.1'), { layout: 'row', y: 540, eb: '한 팀이 이어서', ebY: 400, items: [{ ic: 'target', label: '기획', at: w('기획부터', '11.3.1') }, { ic: 'gear', label: '개발', at: w('개발', '11.3.1') + 0.1 }, { ic: 'bank', label: '자금 신청', at: w('자금', '11.3.1') }], shot: { bg: 'bgL' } })
K.stamp(c('11.3.3'), { text: '일관된 스토리', color: 'orange', at: w('일관되게', '11.3.3') - 0.1, y: 700 })
K.big(c('11.4.0'), { icon: 'q', text: '어디서부터<br>*시작할까?*', size: 'l', y: 700, shot: { bg: 'bgB' } })
X.cta(c('11.4.1'), { tapAt: w('확인해', '11.4.1') })
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(ENDV - 0.1, { eb: '지금 바로', card: '<span class="no">3분 · 무료</span><h3>기업성장·AX Fit<br>진단 받기</h3><ul><li>miraeailab.com</li><li>무료 상담</li><li>샘플 직접 눌러 보기</li></ul>' })

B.finish(r2(ENDV + 3.2))
