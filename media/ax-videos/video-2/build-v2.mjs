// 영상 2 · 어떻게 진행하고, 얼마가 드나 — v2(고급판)
// 영상 1 v2 와 같은 톤(먹색 + 샴페인 골드, 유리 카드, 부드러운 전환). 화면 전환은 영상 1보다 약 15% 느리게(47장면, 평균 5.3초).
// AX 화면은 고운솥 식당·반려동물 대신 세움 제조(대시보드·AI 판단)·거래처 포털·벨로아 커머스·루미에르 헤어숍 샘플을 쓴다.
import { createBuild, r2, ic } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'
import { kit3 } from '../lib/kit3.mjs'

const TITLE = '영상 2 · 어떻게 진행하고, 얼마가 드나'
const B = createBuild('.', { title: TITLE, tag: '영상 2 · 어떻게 진행하고, 얼마가 드나', premium: true })
const K = kit(B)
const X = kit2(B, K)
const P = kit3(B, K)
const { T, C, wt, freeze, tw, from, to, phone, runFlow, count } = B
const H = P.heads
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
const SAMPLE = '샘플 화면'
B.addCssLast(`
.two-ph .lab { position: absolute; top: -70px; left: 0; right: 0; text-align: center; }
.chain { display: flex; align-items: center; gap: 14px; }
.chain span { padding: 14px 26px; border-radius: 999px; font-size: 34px; font-weight: 700; color: #9BA3AD; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14); white-space: nowrap; }
.chain i { width: 36px; height: 1.5px; background: rgba(216,168,113,.6); }
.bgL .chain span { color: #5E6670; box-shadow: inset 0 0 0 1.5px rgba(21,24,29,.14); }
.days { position: absolute; left: 150px; right: 150px; top: 760px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 16px; } .days i { display: block; height: 80px; border-radius: 14px; }
.cmp { position: absolute; left: 200px; right: 200px; display: flex; align-items: flex-end; justify-content: space-between; }
.cb { width: 260px; display: flex; flex-direction: column; align-items: center; gap: 18px; } .cb i { display: block; width: 100%; border-radius: 22px 22px 6px 6px; } .cb span { font-size: 38px; text-align: center; line-height: 1.2; }
.walker2 { position: absolute; left: 470px; top: 700px; width: 140px; height: 140px; color: #E6C396; } .walker2 .ic { width: 100%; height: 100%; }
.bub.sm { font-size: 50px; padding: 26px 40px; }
`)
// 단계 머리(STEP n / 4 + 네 칸 막대 + 제목)
function stage(n, title, at, y = 300) {
  const id = K.uid('sg')
  from(`#${id}`, at, 'opacity: 0, y: 14', 0.8, 'expo.out')
  tw(`tl.from('#${id} .stage4 i.on', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.6, ease: 'power3.out', stagger: 0.12 }, ${r2(at + 0.2)});`)
  return `<div class="cx" style="top:${y}px"><div id="${id}" style="display:flex;flex-direction:column;align-items:center;gap:22px"><span class="eyeb"><i></i>STEP ${n} / 4<i></i></span><span class="stage4">${[1, 2, 3, 4].map((k) => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span></div></div>`
    + H([{ at: at + 0.25, text: title, size: 'l' }], { y: y + 150 })
}
// 폰 하나(흐름 실행) — 한 장면의 부품
function phonePart(id, name, base, steps, sw, left, top, extraInner = '') {
  return `<div class="abs" style="left:${left}px;top:${top}px">${phone(id, name, base, steps, sw, '', extraInner)}</div>`
}

// ━━ ① 훅
{ const t = 0
  const g = P.cards([{ ic: 'gear', label: '어떻게 진행될까?', at: w('진행되고', '1.2.1') - 0.2 }, { ic: 'money', label: '얼마나 들까?', at: w('얼마가', '1.2.1') - 0.2 }], { y: 520 })
  P.scene(t, [P.eyebrow('영상 1을 보고 나면', 300, 0.05), H([{ at: 0.15, text: '드는 생각 *두 가지*', y: 370 }]), g.html,
    H([{ at: c('1.3.0'), text: '지금부터 *답해 드릴게요*' }], { y: 960 })], { bg: 'bgA', cam: 'in' }) }
P.title(B.silBefore(2, 1)[0] + 0.05, { no: '영상 2', title: '어떻게 진행하고,<br>*얼마가* 드나' })

// ━━ ② 진행 방식
K.chapter(c('2.1.0'), '② 진행 방식')
K.steps(c('2.1.0'), { eb: '진행 4단계', items: STEPS, active: -1, top: 330, activeAt: [w('진단입니다', '2.2.0') - 0.2], shot: { trans: 'fade' } })
X.sysForm(c('2.3.0'), { title: 'AX 진단', btn: '성장 단계 분석 →', rows: [['업종', '제조'], ['성장 단계', '도약기'], ['데이터 위치', '엑셀·메신저'], ['먼저 바꿀 것', '수주·납기 관리']], top: 380, tapAt: w('살펴보고', '2.3.2') - 0.3,
  shot: { bg: 'bgL', trans: 'fade' } })
{ const t = c('2.3.0'), id = K.uid('e23')
  // 진단 폼 위 머리말(9년 차 컨설턴트 · 특허 출원 AX)
  B.addOverlay(`<div class="clip" id="${id}" data-start="${r2(t)}" data-duration="${r2(c('2.3.3') - t + 0.3)}" data-track-index="5">${P.eyebrow('9년 차 경영컨설턴트 · 특허 출원 AX', 250, t + 0.1)}</div>\n`) }
X.wire(c('2.3.3'), { chip: '성장 설계도', chipAt: w('설계도를', '2.3.3') - 0.2, shot: { trans: 'fadeBlur' } })

{ const t = c('3.1.0')
  P.scene(t, [stage(2, '2주 안에 *MVP·기본 틀*', t + 0.05, 230), P.number({ from: 0, to: 2, suf: '주', y: 560, at: w('2주', t) - 0.1, d: 0.6, cls: 'mid' }), `<div class="days" id="d31" style="top:800px">${'<i></i>'.repeat(14)}</div>`,
    `<p class="ksub" style="top:1020px" id="d31s">MVP = 최소 기능 제품</p>`], { bg: 'bgC', trans: 'fade' })
  tw(`tl.from('#d31 i', { opacity: 0, scale: 0.4, duration: 0.4, ease: 'expo.out', stagger: 0.07 }, ${r2(w('2주', t) + 0.2)});`)
  from('#d31s', w('MVP와', '3.1.1'), 'opacity: 0, y: 14', 0.7, 'expo.out') }
fzBefore(3, 2, '2주 안에 MVP·기본 틀', 'MVP = 최소 기능 제품')
{ const t = c('3.2.0'), k = c('3.3.0')
  const g = P.cards([{ ic: 'db', label: 'ERP', at: t + 0.2, checkAt: k + 0.2 }, { ic: 'money', label: '포스기', at: t + 0.4, checkAt: k + 0.45 }, { ic: 'excel', label: '엑셀', at: t + 0.6, checkAt: k + 0.7 }], { layout: 'row', y: 420 })
  P.scene(t, [P.eyebrow('지금 쓰는 프로그램', 300, t + 0.05), g.html, H([{ at: t + 0.3, text: '다 *갈아엎지* 않아요' }, { at: k, text: '기존 프로그램은 *그대로*' }, { at: w('연결해', '3.3.1') - 0.3, text: '필요한 데이터만 *연결*' }], { y: 900 })], { bg: 'bgL', trans: 'wipeUp' }) }
K.scatter(c('3.4.0'), { items: [
  { ic: 'doc', label: '주문', x: 90, y: 400, r: -3, at: w('주문', '3.4.1') }, { ic: 'db', label: '재고', x: 650, y: 430, r: 3, at: w('재고', '3.4.1') }, { ic: 'money', label: '매출', x: 170, y: 960, r: 2, at: w('매출', '3.4.1') }],
  gatherAt: w('연동해서', '3.4.1'), core: { ic: 'ai', label: 'AX로 연동' }, coreY: 600,
  extra: P.eyebrow('예시 1 · 일반 중소기업', 250, c('3.4.0') + 0.05) + H([{ at: c('3.4.0') + 0.2, text: '*ERP*를 쓴다면', y: 320 }]), shot: { bg: 'bgB', trans: 'fade' } })
{ const t = c('3.4.2')
  const g = P.cards([{ ic: 'shop', label: '본점', at: t + 0.1 }, { ic: 'shop', label: '2호점', at: w('2호점', t) }, { ic: 'shop', label: '3호점', at: w('3호점까지', t) }], { layout: 'row', y: 420 })
  P.scene(t, [P.eyebrow('예시 2 · 음식점', 300, t + 0.05), g.html, H([{ at: w('매출', '3.4.3') - 0.4, text: '포스기 매출을 *그대로 가져온다*', size: 's' }], { y: 900 })], { bg: 'bgA', trans: 'fade' }) }
K.note(c('3.4.0'), r2(c('3.5.0') - c('3.4.0') + 5.0), '<span>※ 프로그램에 따라 연동 방식이 다릅니다</span>', 1240)
K.people(c('3.5.0'), { y: 480, items: [['user', '직원'], ['user', '점장'], ['user', '매니저']], react: 'ok', reactAt: w('적습니다', '3.5.1') - 0.3,
  extra: H([{ at: c('3.5.0') + 0.15, text: '*천천히* 적응하며 도입' }, { at: w('부담과', '3.5.1') - 0.2, text: '부담·반발 *↓*' }], { y: 940 }), shot: { bg: 'bgD', trans: 'fade' } })

{ const t = c('4.1.0'), k = c('4.2.0')
  const id = 'db42'
  tw(`tl.from('#${id} i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.7, ease: 'expo.out', stagger: 0.4 }, ${r2(c('4.2.0') + 0.2)});`)
  P.scene(t, [stage(3, '데이터 *쌓기*', t + 0.05, 260), `<div class="dbars" id="${id}" style="top:560px;height:440px">${[120, 180, 230, 290, 340, 400, 440].map((h) => `<i style="height:${h}px"></i>`).join('')}</div>`,
    H([{ at: k + 0.1, text: '실제 자료로 *다듬고 테스트*', size: 's' }], { y: 1070 })], { bg: 'bgA', trans: 'fade' }) }
K.chart(c('4.3.0'), { mode: 'up', tagTop: 'AI 정확도 ↑', tagTopX: 620, tagTopAt: w('정확해지고', '4.3.0'), d: 1.6,
  extra: H([{ at: c('4.3.0') + 0.1, text: '쌓일수록 *더 정확*', y: 280 }, { at: c('4.3.1'), text: '심사의 *핵심 근거*', y: 280 }]), shot: { bg: 'bgB', trans: 'fade' } })
K.morph(c('4.4.0'), { from: ['db', '쌓인 데이터'], to: ['cloud', '구독형 서비스'], arAt: w('구독형', '4.4.1') - 0.4, bAt: w('구독형', '4.4.1') - 0.1,
  extra: H([{ at: c('4.4.0') + 0.1, text: '회사의 *자산*이 된다', y: 1040 }]), shot: { bg: 'bgD', trans: 'wipeUp' } })

{ const t = c('5.1.0')
  K.people(t, { y: 620, items: [['invest', '투자자', t + 0.6], ['user', '심사위원', t + 0.8], ['gov', '기관', t + 1.0]], react: 'star', reactAt: w('매력적인', '5.1.1'),
    extra: stage(4, '밖에서 봐도 *매력적인* 회사', t + 0.05, 230), shot: { bg: 'bgC', trans: 'fade' } }) }
{ const t = c('5.2.0'), k = c('5.2.1')
  const g = P.cards([{ ic: 'shield', label: '벤처기업확인', at: k }, { ic: 'book', label: '기업부설연구소', at: k + 0.2 }, { ic: 'star', label: '이노비즈·메인비즈', at: k + 0.4 }], { y: 640 })
  P.scene(t, [P.eyebrow('어떤 상품이든 기본 포함', 250, t + 0.05), P.seal('벤처기업확인', 300, w('기본으로', t) - 0.3, 'gold'), g.html,
    K.fineAt('f52', '신청까지 함께 준비 · 결과·기간은 외부기관 심사에 따라 달라요', 1290)], { bg: 'bgB', trans: 'fade' })
  from('#f52', t + 0.6, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('5.2.2')
  const g = P.cards([{ ic: 'invest', label: '신용등급', at: w('신용등급', t) }, { ic: 'money', label: '부채비율', at: w('부채비율', t) }], { layout: 'row', y: 440 })
  P.scene(t, [P.eyebrow('재무', 320, t + 0.05), g.html.replace('gcards row', 'gcards row two'), H([{ at: c('5.2.3'), text: '비재무 + 재무 *함께*' }], { y: 900 })], { bg: 'bgL', trans: 'wipeUp' }) }

// ━━ ③ 도입하면 달라지는 모습
K.chapter(c('6.1.0'), '③ 도입하면 달라지는 모습')
{ const t = c('6.1.0'), k = c('6.2.0')
  const g = P.cards([{ ic: 'money', label: '매출', at: w('매출', k) - 0.1 }, { ic: 'db', label: '재고', at: w('재고', k) - 0.1 }, { ic: 'team', label: '직원별 처리 현황', at: w('직원별', k) - 0.1 }], { y: 560 })
  P.scene(t, [H([{ at: t + 0.1, text: '이렇게 *달라집니다*', size: 'xl' }], { y: 300 }), g.html], { bg: 'bgC', trans: 'fade' }) }
{ // 6.2.1–6.2.3 — 대표님 폰(제조 대시보드) · 잘 팔리는 상품(커머스) — 서로 다른 샘플
  const t = c('6.2.1'), sw = 330, id = K.uid('tp')
  const html = `<div class="cx" style="top:250px"><span class="chip" id="${id}-t">${SAMPLE}</span></div>
    <div id="${id}-a">${phonePart(`${id}-pa`, 'seum', 1, [], sw, 60, 330)}<div class="cx" style="top:1100px;left:60px;right:auto;width:${sw + 16}px"><span class="chip hot">대표님 폰 · 수치</span></div></div>
    <div id="${id}-b">${phonePart(`${id}-pb`, 'veloa', 2, [], sw, 1080 - 60 - sw - 16, 330)}<div class="cx" style="top:1100px;left:auto;right:60px;width:${sw + 16}px"><span class="chip">잘 팔리는 상품</span></div></div>`
  B.shot(t, html, { bg: 'bgA', trans: 'fade' })
  from(`#${id}-t`, t + 0.1, 'opacity: 0', 0.6, 'power1.out')
  from(`#${id}-a`, t + 0.05, 'opacity: 0, y: 60', 0.9, 'expo.out')
  from(`#${id}-b`, w('어떤', '6.2.2') - 0.2, 'opacity: 0, y: 60', 0.9, 'expo.out')
  to(`#${id}-pb .screen > img`, w('어디서', '6.2.3'), 'y: -120', 1.4, 'power2.inOut') }
{ const t = c('6.3.0')
  K.phoneShot(t, { name: 'seum', base: 1, steps: [2, 3], run: [w('다음에', '6.3.1') - 0.3, c('6.3.1') + 3.2], top: 340, sw: 340, label: 'AI 판단 · 근거까지', lbc: 'hot', labelY: 1110,
    extra: H([{ at: t + 0.1, text: 'AI는 *한 걸음 더*', size: 's', y: 225 }]), shot: { bg: 'bgB', trans: 'fade' } }) }
{ const t = c('6.4.0')
  K.phoneShot(t, { name: 'lumiere', base: 1, steps: [2], run: [w('밀고', t) - 0.1, w('밀고', t) + 0.5], top: 340, sw: 340, label: SAMPLE, labelY: 1110,
    extra: H([{ at: t + 0.1, text: '잘 되는 건 *더 밀고*', size: 's', y: 225 }, { at: c('6.4.1'), text: '새는 것은 *막고*', size: 's', y: 225 }]), shot: { bg: 'bgD', trans: 'fade' } }) }
{ const t = c('6.5.0'), k = c('6.5.1'), id = K.uid('rl')
  const roles = [['user', '대표 · 전체'], ['team', '점장 · 매장'], ['lock', '직원 · 내 업무']]
  roles.forEach((_, i) => from(`#${id}-${i}`, k + i * 0.18, 'opacity: 0, y: 20', 0.7, 'expo.out'))
  K.notifs(t, { eb: '하나의 업무 공간', items: [{ ic: 'chat', t: '오늘 발주 확인 부탁드려요', s: '점장', w: '09:12', at: t + 0.4 }, { ic: 'check', t: '재고 입력 완료', s: '주방', c: 'green', w: '09:20', at: t + 0.9 }],
    extra: `<div class="cx" style="top:720px"><div class="chiprow" style="display:flex;gap:14px">${roles.map(([k2, l], i) => `<span class="chip big" id="${id}-${i}">${l}</span>`).join('')}</div></div>` + H([{ at: w('입력할', '6.5.2') - 0.2, text: '입력할 것만 *입력*' }], { y: 900 }),
    fine: '예시 화면', shot: { bg: 'bgA', trans: 'fade' } }) }
{ const t = c('6.6.0'), id = K.uid('wk')
  K.building(t, { y: 300, inside: [{ ic: 'doc', x: 100, y: 250, at: t + 0.3 }, { ic: 'doc', x: 350, y: 250, at: t + 0.4 }, { ic: 'db', x: 100, y: 430, at: t + 0.5 }, { ic: 'doc', x: 350, y: 430, at: t + 0.6 }], glowAt: w('기록이', t),
    extra: `<div class="walker2" id="${id}">${ic('user')}</div>` + H([{ at: t + 0.1, text: '담당자가 바뀌어도 *기록은 그대로*', size: 's' }, { at: c('6.6.1'), text: '인수인계 부담 *↓*', size: 's' }], { y: 1070 }), shot: { bg: 'bgB', trans: 'wipeUp' } })
  from(`#${id}`, t + 0.2, 'opacity: 0, scale: 0.7', 0.7, 'expo.out')
  to(`#${id}`, w('바뀌어도', t) - 0.1, 'x: 440, opacity: 0', 1.1, 'power2.in') }
K.phoneShot(c('6.7.0'), { name: 'seumportal', base: 0, steps: [1, 2, 3, 4], run: [c('6.7.0') + 0.4, c('6.7.2') + 0.6], top: 340, sw: 340, label: '거래처가 직접 견적 요청 · 샘플', lbc: 'hot', labelY: 1110,
  extra: H([{ at: c('6.7.2'), text: '매일 *데이터*가 쌓인다', size: 's', y: 225 }]), shot: { bg: 'bgD', trans: 'fade' } })
K.morph(c('6.8.0'), { from: ['db', '쌓인 데이터'], to: ['rocket', '새 서비스 출시'], aAt: c('6.9.0') - 0.2, arAt: w('출시해서', '6.9.0') - 0.3, bAt: w('출시해서', '6.9.0'),
  extra: H([{ at: c('6.8.0') + 0.1, text: '심사용만이 *아니에요*', y: 1040 }]), shot: { bg: 'bgC', trans: 'fade' } })
K.chart(c('6.9.1'), { mode: 'up', tagOurs: '구독 서비스', tagOursX: 360, tagOursY: 330, tagOursAt: w('구독', '6.9.1'), tagTop: '새로운 사업', tagTopX: 640, tagTopAt: w('사업으로', '6.9.2'), shot: { bg: 'bgD', trans: 'fade' } })

K.browser(c('7.1.0'), { src: SH('ax-lumiere-dash'), tag: SAMPLE, top: 360, d: 7.6, zoom: 1.14,
  extra: H([{ at: c('7.1.0') + 0.2, text: '밖에서 보기에도 *달라요*' }, { at: w('투자하고', '7.2.1') - 0.2, text: '*투자하고 싶은* 회사로' }], { y: 1110 }), shot: { bg: 'bgA', trans: 'fade' } })
{ const t = c('7.3.0')
  const id = K.room(t, { extra: `<div id="eb73">${P.eyebrow('심사 자리', 690, t + 0.1)}</div>`, q: '“그래서, 다음은<br>어떻게 되나요?”', qAt: w('그래서', '7.3.1') - 0.1, qY: 780, qType: 0.9, show: FL('seum-01'), showAt: c('7.3.2') - 0.1, showY: 640, react: 'ok', reactAt: w('답할', '7.3.2') - 0.2, shot: { trans: 'fade' } })
  to(`#${id}-q`, c('7.3.2') - 0.25, 'opacity: 0, y: -20', 0.4, 'power2.in')
  to('#eb73', c('7.3.2') - 0.25, 'opacity: 0', 0.3, 'power1.in') }
K.chart(c('7.4.0'), { mode: 'gap', tagTop: 'AI 도입 회사', tagTopX: 560, tagTopAt: c('7.4.0') + 1.0, tagOurs: '그렇지 않은 회사', tagOursX: 440, tagOursY: 480, tagOursAt: w('그렇지', '7.4.1'), d: 2.0,
  extra: H([{ at: w('시간이', '7.4.2') - 0.2, text: '격차는 *계속 벌어진다*', y: 280 }]), shot: { bg: 'bgB', trans: 'fade' } })
{ const t = c('7.5.0')
  P.scene(t, [P.licon('rocket', 520, t + 0.05), H([{ at: t + 0.15, text: '*먼저* 도입한 회사가 유리', size: 'l' }], { y: 760 })], { bg: 'bgC', trans: 'fade' })
  const [, e] = fzBefore(8, 1, '먼저 도입한 회사가 유리', '샘플에서 직접 눌러 보세요')
  K.note(t + 0.4, r2(e - t - 0.4), '<span>▶ 샘플에서 직접 눌러 보세요 · miraeailab.com</span>', 1240) }

// ━━ ④ 비용
K.chapter(c('8.1.0'), '④ 비용')
{ const t = c('8.1.0')
  const PR = [{ name: 'MVP', tag: '최소 기능 제품', v: '500', n: 500, at: w('500만', '8.2.0') - 0.4 }, { name: '플랫폼형', tag: '고객이 쓰는', v: '1,500', n: 1500, at: w('1500만', '8.2.1') - 0.4 }, { name: '풀 패키지', tag: 'AX + 플랫폼', v: '3,000', n: 3000, at: w('3000만', '8.2.3') - 0.5 }]
  const id = K.prices(t, { eb: '비용', items: PR, top: 340, shot: { bg: 'bgL', trans: 'fade' } })
  tw(`tl.set('#${id}-2', { attr: { class: 'pcard on' } }, ${r2(w('풀', '8.2.2') - 0.1)});`) }
fzBefore(8, 3, '500 · 1,500 · 3,000만 원부터', 'MVP · 플랫폼형 · 풀 패키지')
{ const t = c('8.3.0'), id = K.uid('st')
  const hs = [240, 400, 560], names = ['MVP', '플랫폼형', '풀 패키지']
  const k1 = w('MVP나', t), k2 = w('단계씩', '8.3.1') - 0.2
  const html = `${P.eyebrow('처음엔 작게 시작해도', 250, t + 0.05)}<div class="stairs" style="top:340px">${hs.map((h, i) => `<div id="${id}-${i}"><i style="height:${h}px"></i><b>${names[i]}</b></div>`).join('')}</div>
    <span class="climber" id="${id}-c" style="left:${120 + 105}px;top:${340 + 620 - 240 - 90}px"></span>${H([{ at: k2, text: '한 단계씩 *올라가도* 돼요' }], { y: 1080 })}`
  B.shot(t, html, { bg: 'bgD', trans: 'fade' })
  tw(`tl.from('#${id}-0 i, #${id}-1 i, #${id}-2 i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, ease: 'expo.out', stagger: 0.15 }, ${r2(t + 0.2)});`)
  from(`#${id}-c`, k1, 'opacity: 0, scale: 0.4', 0.6, 'expo.out')
  tw(`tl.set('#${id}-0', { attr: { class: 'on' } }, ${r2(k1)});`)
  tw(`tl.to('#${id}-c', { x: 280, y: -160, duration: 0.7, ease: 'power2.inOut' }, ${r2(k2)});`)
  tw(`tl.to('#${id}-c', { x: 560, y: -320, duration: 0.7, ease: 'power2.inOut' }, ${r2(k2 + 0.9)});`)
  tw(`tl.set('#${id}-1', { attr: { class: 'on' } }, ${r2(k2 + 0.7)});`)
  tw(`tl.set('#${id}-2', { attr: { class: 'on' } }, ${r2(k2 + 1.6)});`) }
{ const t = c('8.4.0')
  const g = P.cards([{ ic: 'rocket', label: '2주 · 기본 틀', at: t + 0.2, checkAt: w('잡은', t) }, { ic: 'gear', label: '커스터마이징', at: w('커스터마이징과', '8.4.1') - 0.1 }, { ic: 'check', label: '테스트', at: w('테스트를', '8.4.1') - 0.1 }], { y: 400 })
  P.scene(t, [P.eyebrow('풀 패키지 진행', 300, t + 0.05), g.html], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('8.4.2')
  P.scene(t, [P.eyebrow('기본 AX·플랫폼 유지보수', 520, t + 0.1), P.seal('1년 무상', 600, w('무상으로', '8.4.3') - 0.2, 'gold')], { bg: 'bgC', trans: 'fadeBlur' }) }
fzBefore(9, 1, '유지보수 1년 무상', '기본 AX·플랫폼')
{ const t = c('9.1.0')
  const g = P.cards([{ ic: 'user', label: '컨설팅', at: w('컨설팅과', t) - 0.1 }, { ic: 'gear', label: '개발', at: w('개발에', t) - 0.1 }], { layout: 'row', y: 440 })
  P.scene(t, [P.eyebrow('이 금액은', 320, t + 0.05), g.html.replace('gcards row', 'gcards row two'), H([{ at: w('관계없이', '9.1.1') - 0.3, text: '자금 승인과 *관계없이*', size: 's' }, { at: c('9.1.2'), text: '진행한 만큼 *정산*', size: 's' }], { y: 900 })], { bg: 'bgL', trans: 'wipeUp' }) }
K.link(c('9.2.0'), { a: { ic: 'bank', label: '자금 입금' }, b: { ic: 'money', label: '그 뒤 정산', cls: 'hot' }, linkAt: w('들어온', '9.2.1') - 0.2,
  extra: H([{ at: c('9.2.0') + 0.1, text: '자금 흐름이 *부담*된다면' }, { at: w('뒤로', '9.2.1') - 0.3, text: '정산 시점을 *뒤로*' }], { y: 1060 }), shot: { bg: 'bgB', trans: 'fade' } })
{ const t = c('9.3.0'), k = w('5번', '9.3.1') - 0.3, id = K.uid('n5')
  P.scene(t, [P.eyebrow('1년 동안 · 지원금 + 정책자금', 280, t + 0.05), P.number({ from: 1, to: 5, suf: '번 이상', y: 440, at: k, d: 0.6 }), `<p class="ksub" id="${id}" style="top:740px">신청해 드립니다</p>`,
    K.fineAt(`${id}-f`, '선정·승인은 기관 심사에 따라 달라요', 1290)], { bg: 'bgC', trans: 'fade' })
  from(`#${id}`, k + 0.4, 'opacity: 0, y: 14', 0.7, 'expo.out'); from(`#${id}-f`, t + 0.5, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('9.3.2')
  const g = P.cards([{ ic: 'user', label: '처음엔 컨설팅 착수금만', at: t + 0.1, checkAt: w('내시면', t) - 0.2 }, { ic: 'gear', label: '개발비는 후불로도 가능', hl: true, at: w('후별로도', '9.3.3') - 0.2, checkAt: w('후별로도', '9.3.3') + 0.3 }], { y: 420 })
  P.scene(t, [g.html, H([{ at: c('9.3.4'), text: '초기 부담 *크지 않아요*' }], { y: 900 })], { bg: 'bgA', trans: 'fade' }) }
fzBefore(10, 2, '개발비 후불 가능', '착수금으로 시작')

// ━━ ⑤ 자금 신청·관리
K.chapter(c('10.2.0'), '⑤ 자금 신청·관리')
{ const t = c('10.2.0')
  const g = P.cards([{ ic: 'bank', label: '정책자금', at: w('정책자금과', t) - 0.1 }, { ic: 'gov', label: '지원사업', at: w('지원사업', t) - 0.1 }], { layout: 'row', y: 440 })
  P.scene(t, [g.html.replace('gcards row', 'gcards row two'), H([{ at: c('10.2.1'), text: '신청까지 *쭉 함께*' }], { y: 900 })], { bg: 'bgL', trans: 'fade' }) }
{ const t = c('10.3.0'), id = K.uid('ch')
  const steps = [['AX 개발', w('개발부터', '10.3.1') - 0.2], ['인증', w('인증까지', '10.3.1') - 0.1], ['자금 신청', w('하나의', '10.3.2')]]
  steps.forEach(([, a], i) => from(`#${id}-${i}`, a, 'opacity: 0, y: 14', 0.7, 'expo.out'))
  tw(`tl.to('#${id} span', { color: '#15110C', backgroundColor: '#D8A871', duration: 0.4, stagger: 0.15 }, ${r2(w('설계하다', '10.3.2') - 0.2)});`)
  P.scene(t, [P.licon('book', 280, t + 0.05), H([{ at: t + 0.15, text: '심사는 *스토리*', size: 'l' }], { y: 500 }),
    `<div class="cx" style="top:760px"><div class="chain" id="${id}">${steps.map(([l], i) => `${i ? '<i></i>' : ''}<span id="${id}-${i}">${l}</span>`).join('')}</div></div>`,
    H([{ at: w('설계하다', '10.3.2') - 0.1, text: '하나의 *스토리*로 설계', size: 's' }], { y: 900 })], { bg: 'bgB', trans: 'fade' }) }
K.checks(c('10.3.3'), { okColor: '#C99257', eb: '처음부터 연결', items: [['사업계획서', c('10.3.3') + 0.4], ['인증 서류', c('10.3.3') + 0.9], ['자금 신청서', c('10.3.3') + 1.4]], shot: { bg: 'bgL', trans: 'fade' } })
K.people(c('10.4.0'), { y: 480, items: [['ai', '추가 개발'], ['shield', '인증'], ['bank', '자금']], react: 'ok', reactAt: w('같은', '10.4.1'),
  extra: H([{ at: c('10.4.0') + 0.1, text: '따로 맡길 *필요 없이*' }, { at: w('같은', '10.4.1') - 0.1, text: '*한 팀*이 이어서' }], { y: 960 }), shot: { bg: 'bgA', trans: 'fade' } })
{ const t = c('10.4.2'), id = K.uid('cp')
  const html = `<div class="cmp" id="${id}"><div class="cb g"><i style="height:520px"></i><span>일반 정책자금<br>컨설팅</span></div><div class="cb hot"><i style="height:300px"></i><span>미래AI랩</span></div></div>
    ${K.fineAt(`${id}-f`, '구체 수수료는 상담 때 안내드려요', 1290)}${H([{ at: t + 0.1, text: '수수료는 *낮게*', size: 's' }, { at: c('10.5.0'), text: '자세한 건 *상담 때*', size: 's' }], { y: 250 })}`
  B.shot(t, html, { bg: 'bgD', trans: 'fade' })
  tw(`tl.from('#${id} .cb i', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'expo.out', stagger: 0.4 }, ${r2(t + 0.2)});`)
  from(`#${id}-f`, t + 0.8, 'opacity: 0', 0.6, 'power1.out') }
B.addCssLast(`.cmp { top: 420px; height: 700px; }`)

// ━━ ⑥ 정리
K.chapter(c('11.1.0'), '⑥ 정리')
K.steps(c('11.1.0'), { eb: '정리', items: STEPS, active: -1, top: 330, activeAt: [w('진단으로', '11.2.0'), w('2주', '11.2.1'), w('데이터를', '11.2.2'), w('기업', '11.2.3')], shot: { trans: 'fade' } })
{ const t = c('11.3.0'), id = K.uid('ch3')
  const steps = [['기획', w('기획부터', '11.3.1')], ['개발', w('개발', '11.3.1') + 0.1], ['자금 신청', w('자금', '11.3.1')]]
  steps.forEach(([, a], i) => from(`#${id}-${i}`, a, 'opacity: 0, y: 14', 0.7, 'expo.out'))
  K.chart(t, { mode: 'up', top: 520, tagTop: '새 기능 · 새 사업', tagTopX: 520, tagTopAt: w('새', t),
    extra: P.eyebrow('회사가 커져도', 250, t + 0.05) + `<div class="cx" style="top:340px"><div class="chain" id="${id}">${steps.map(([l], i) => `${i ? '<i></i>' : ''}<span id="${id}-${i}">${l}</span>`).join('')}</div></div>`, shot: { bg: 'bgA', trans: 'fade' } }) }
{ const t = c('11.3.2')
  P.scene(t, [P.eyebrow('한 팀이 이어서', 520, t + 0.05), P.seal('일관된 스토리', 600, w('일관되게', '11.3.3') - 0.2, 'gold')], { bg: 'bgC', trans: 'fadeBlur' }) }
X.cta(c('11.4.0'), { at: c('11.4.1'), tapAt: w('확인해', '11.4.1'), shot: { bg: 'bgC', trans: 'fade' } })
{ const t = c('11.4.0'), id = K.uid('q11')
  B.addOverlay(`<div class="clip" id="${id}" data-start="${r2(t)}" data-duration="${r2(c('11.4.1') - t + 0.1)}" data-track-index="5">${H([{ at: t + 0.1, text: '어디서부터 *시작할까?*', size: 'l' }], { y: 760 })}</div>\n`) }
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(ENDV - 0.1, { eb: '지금 바로', card: '<span class="no">3분 · 무료</span><h3>기업성장·AX Fit<br>진단 받기</h3><ul><li>miraeailab.com</li><li>무료 상담</li><li>샘플 직접 눌러 보기</li></ul>', shot: { trans: 'fade' } })

B.finish(r2(ENDV + 3.2))
