// 컨설턴트용 소개 영상 — MIRAE AI LAB OS (자막 전용 · 목소리 없음, 약 2분 35초)
// AX 영상 1·2(고급판)와 같은 톤: 먹색 + 샴페인 골드, 유리 카드, 부드러운 전환, 한 화면 4~6초, 중요한 말 뒤 멈춤.
// 구성: 도입(컨설턴트의 하루) → ① 문제(흩어진 일) → ② 더 깊은 문제(신뢰·다음 계약) → ③ 해결(OS)
//       → ④ 다음 계약(올려 둔 서류가 다음 제안으로) → ⑤ 새 고객(첫 미팅) → ⑥ 달라지는 것(소개가 소개를) → ⑦ 오픈
// 시간표는 synth.py 가 읽는 속도로 만든다(녹음 없음). 화면은 /consultants 의 예시 화면(가상 데이터)과 실제 도구 화면.
// ⚠️ 속도·성과 숫자, 가격, 무료 체험, 이용 후기는 넣지 않는다(정식 출시 전). 화면에는 '예시 화면 · 가상 데이터'를 붙인다.
import { createBuild, r2, ic, ICON } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'
import { kit3 } from '../lib/kit3.mjs'

const LINE = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
Object.assign(ICON, {
  mail: `<svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2" ${LINE}/><path d="M3.5 7l8.5 6 8.5-6" ${LINE}/></svg>`,
  photo: `<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2" ${LINE}/><circle cx="9" cy="10" r="1.8" ${LINE}/><path d="M4 18l5.5-5 4 3.5 3-2.5 3.5 3" ${LINE}/></svg>`,
  inbox: `<svg viewBox="0 0 24 24"><path d="M3.5 13.5l2.5-8h12l2.5 8V19h-17z" ${LINE}/><path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5" ${LINE}/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" ${LINE}/><path d="M10.5 18.5h3" ${LINE}/></svg>`,
})

const TITLE = '컨설턴트 운영 OS 소개'
const B = createBuild('.', { title: TITLE, tag: 'MIRAE AI LAB OS · 컨설턴트용', premium: true })
const K = kit(B)
const X = kit2(B, K)
const P = kit3(B, K)
const { T, C, wt, freeze, tw, from, to } = B
const H = P.heads
const c = (s) => { const [b, l, p] = s.split('.').map(Number); return C(b, l, p ?? 0).start }
const w = (needle, f) => wt(needle, typeof f === 'string' ? c(f) : f)
const CS = (n) => `assets/cs/${n}`
const EX = '예시 화면 · 가상 데이터'
function fzBefore(b, l, label, sub = '') {
  const [s0, e0] = B.silBefore(b, l)
  const s = r2(s0 + 0.05), e = r2(e0 - 0.2)
  freeze(s, e - s, label, sub)
  return [s, e]
}
// 캡처 화면 한 장(유리 테두리) — 가운데 정렬
const shotImg = (id, src, y, width, extra = '') => `<div class="cx" style="top:${y}px"><div class="shotf" id="${id}" style="width:${width}px"><img src="${src}" alt="">${extra}</div></div>`
const fine = (id, text, y) => `<p class="fine c" id="${id}" style="top:${y}px">${text}</p>`

B.addCssLast(`
.shotf { position: relative; border-radius: 26px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,.5), 0 0 0 1.5px rgba(216,168,113,.35); background: #0E1114; }
.shotf img { display: block; width: 100%; }
.shotf .ring { position: absolute; border-radius: 14px; box-shadow: 0 0 0 4px #D8A871, 0 0 36px rgba(216,168,113,.55); opacity: 0; }
.shotf .lbl { position: absolute; left: 22px; top: 18px; padding: 8px 18px; border-radius: 999px; background: rgba(11,14,19,.82); color: #E6C396; font-size: 26px; font-weight: 700; box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.45); }
.clients { position: absolute; left: 60px; right: 60px; display: flex; flex-wrap: wrap; justify-content: center; gap: 22px; }
.clients span { padding: 22px 38px; border-radius: 24px; font-size: 44px; font-weight: 800; color: #F4F1EC; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.4); }
.thought { position: absolute; padding: 20px 30px; border-radius: 22px; font-size: 38px; font-weight: 700; color: #F4F1EC; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14); white-space: nowrap; }
.thought b { color: #E6C396; font-weight: 800; }
.chatb { position: absolute; max-width: 780px; padding: 30px 40px; border-radius: 36px; font-size: 46px; font-weight: 700; line-height: 1.32; }
.chatb small { display: block; margin-bottom: 8px; font-size: 26px; font-weight: 600; opacity: .6; }
.chatb.me { right: 80px; background: #1B2129; color: #F4F1EC; border-bottom-right-radius: 10px; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.12), 0 30px 80px rgba(0,0,0,.45); }
.chatb.you { left: 80px; background: #F2EDE6; color: #15181D; border-bottom-left-radius: 10px; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.chatb.gold { background: linear-gradient(135deg, #E6C396, #C99257); color: #15110C; }
.dcal { width: 640px; padding: 34px 40px; border-radius: 28px; background: rgba(255,255,255,.045); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.1), 0 24px 60px rgba(0,0,0,.35); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.dcal b { font-size: 44px; font-weight: 800; color: #F4F1EC; } .dcal small { display: block; font-size: 30px; color: #A9B0B8; font-weight: 500; margin-top: 6px; }
.dcal em { min-width: 200px; text-align: center; font-style: normal; font-size: 40px; font-weight: 900; padding: 12px 24px; border-radius: 16px; color: #E6C396; box-shadow: inset 0 0 0 2px rgba(216,168,113,.6); position: relative; }
.dcal em .late { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px; background: #7A2E2E; color: #F6DADA; box-shadow: inset 0 0 0 2px #B55454; opacity: 0; white-space: nowrap; font-size: 34px; }
.meter { position: absolute; left: 150px; right: 150px; }
.meter .lab { display: flex; justify-content: space-between; font-size: 36px; font-weight: 700; color: #E6C396; margin-bottom: 18px; }
.meter .trk { height: 28px; border-radius: 14px; background: rgba(255,255,255,.08); overflow: hidden; }
.meter .trk i { display: block; height: 100%; width: 100%; transform-origin: 0 50%; border-radius: 14px; background: linear-gradient(90deg, #B98A55, #E6C396); }
.fan { position: relative; width: 520px; height: 440px; }
.fan i { position: absolute; left: 110px; top: 20px; width: 300px; height: 400px; border-radius: 20px; background: linear-gradient(160deg, #26303B, #151A21); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.5), 0 30px 70px rgba(0,0,0,.45); }
.fan i::before { content: ''; position: absolute; left: 34px; right: 34px; top: 46px; height: 18px; border-radius: 9px; background: rgba(230,195,150,.7); box-shadow: 0 50px 0 rgba(255,255,255,.14), 0 90px 0 rgba(255,255,255,.1), 0 130px 0 rgba(255,255,255,.1), 0 170px 0 rgba(255,255,255,.08); }
.qmark { position: absolute; left: 0; right: 0; text-align: center; font-size: 220px; line-height: 1; font-weight: 900; color: rgba(216,168,113,.35); }
.osname { position: absolute; left: 0; right: 0; text-align: center; font-size: 104px; font-weight: 900; letter-spacing: .01em; color: #F4F1EC; }
.osname em { font-style: normal; color: #E6C396; }
.hl-row { position: absolute; left: 16px; right: 16px; height: 96px; border-radius: 14px; box-shadow: inset 0 0 0 3px #D8A871; background: rgba(216,168,113,.1); opacity: 0; }
.flowdown { position: absolute; left: 0; right: 0; display: flex; justify-content: center; color: #D8A871; }
.flowdown .ic { width: 70px; height: 70px; }
.dchips { position: absolute; left: 0; right: 0; display: flex; justify-content: center; gap: 18px; }
.dchips span { display: inline-flex; align-items: center; gap: 12px; padding: 18px 28px; border-radius: 20px; font-size: 34px; font-weight: 700; color: #F4F1EC; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.14); }
.dchips .ic { width: 40px; height: 40px; color: #E6C396; }
.cscreen { width: 640px; padding: 36px 40px 26px; border-radius: 40px; background: #F2EDE6; color: #15181D; box-shadow: 0 40px 100px rgba(0,0,0,.5), 0 0 0 10px #1B2129, 0 0 0 11.5px rgba(216,168,113,.4); }
.cscreen h4 { margin: 0 0 6px; font-size: 26px; font-weight: 700; color: #A5703C; letter-spacing: .08em; }
.cscreen h5 { margin: 0 0 18px; font-size: 40px; font-weight: 900; }
.cscreen .st { display: flex; align-items: center; gap: 20px; padding: 15px 0; font-size: 36px; font-weight: 700; color: #8A8F96; border-top: 1px solid rgba(21,24,29,.08); }
.cscreen .st i { width: 30px; height: 30px; border-radius: 50%; background: #D9D3CA; flex: none; }
.cscreen .st.done { color: #15181D; } .cscreen .st.done i { background: #C99257; }
.cscreen .st.now { color: #15181D; font-weight: 900; } .cscreen .st.now i { background: #15181D; box-shadow: 0 0 0 8px rgba(201,146,87,.35); }
.cscreen .foot2 { margin-top: 12px; font-size: 24px; color: #8A8F96; text-align: center; }
.net { position: absolute; left: 90px; width: 900px; height: 700px; }
.net line { stroke: rgba(216,168,113,.55); stroke-width: 3; }
.net circle { fill: #1B2129; stroke: rgba(216,168,113,.8); stroke-width: 3; }
.net circle.me { fill: #D8A871; stroke: #E6C396; }
.net text { fill: #F4F1EC; font-size: 30px; font-weight: 800; text-anchor: middle; font-family: Pretendard; }
.net text.me { fill: #15110C; font-size: 32px; }
.lt { position: absolute; left: 70px; right: 70px; display: flex; justify-content: space-between; }
.lt::before { content: ''; position: absolute; left: 120px; right: 120px; top: 44px; height: 3px; background: rgba(216,168,113,.35); }
.lt div { position: relative; width: 300px; text-align: center; }
.lt div i { display: block; width: 90px; height: 90px; margin: 0 auto 24px; border-radius: 50%; background: #1B2129; box-shadow: inset 0 0 0 3px rgba(216,168,113,.6); }
.lt div.on i { background: radial-gradient(circle, #E6C396 0 30%, #1B2129 32%); box-shadow: inset 0 0 0 3px #E6C396, 0 0 40px rgba(216,168,113,.5); }
.lt b { display: block; font-size: 40px; font-weight: 900; color: #F4F1EC; } .lt small { display: block; margin-top: 10px; font-size: 30px; font-weight: 600; color: #A9B0B8; line-height: 1.35; }
.ctabtn { display: inline-flex; align-items: center; gap: 22px; padding: 38px 70px; border-radius: 999px; background: linear-gradient(135deg, #E6C396, #C99257); color: #15110C; font-size: 62px; font-weight: 900; box-shadow: 0 30px 80px rgba(216,168,113,.3); }
.ctabtn .ic { width: 64px; height: 64px; }
`)

// ━━ 도입 — 컨설턴트의 하루
{ const t = 0
  const g = P.cards([{ ic: 'doc', label: '고객사 서류 찾기', sub: '카톡 · 메일 · 사진첩을 뒤져서', bar: 0.92, at: c('1.2.0') - 0.1 }, { ic: 'chat', label: '“어디까지 됐어요?” 답장', sub: '고객사마다 따로', bar: 0.96, at: c('1.2.1') - 0.1 }], { y: 560 })
  P.scene(t, [P.eyebrow('컨설턴트의 하루', 270, 0.1), H([{ at: 0.25, text: '요즘 하루, *어떻게*<br>흘러가세요?', size: 'm' }], { y: 330 }), g.html], { bg: 'bgA', cam: 'in' }) }
{ const t = c('1.3.0'), id = K.uid('nx')
  P.scene(t, [`<div class="gcards col" style="top:440px"><div class="gcard hl" id="${id}">${ic('rocket', 'lg')}<div class="gtx"><b>다음 계약 준비</b><small>제안서 · 추가 컨설팅 설계</small></div></div></div>`,
    `<div class="cx" style="top:700px"><span class="chip" id="${id}-c">내일로 → 모레로 →</span></div>`,
    H([{ at: w('뒤로', '1.3.1') - 0.2, text: '늘 *뒤로* 밀린다', size: 'm' }], { y: 900 })], { bg: 'bgB', trans: 'fade' })
  from(`#${id}`, t + 0.1, 'x: -60, opacity: 0', 0.8, 'expo.out')
  from(`#${id}-c`, w('뒤로', '1.3.1') - 0.3, 'opacity: 0, x: -30', 0.7, 'expo.out')
  to(`#${id}`, w('뒤로', '1.3.1'), 'x: 60, scale: 0.94, opacity: 0.3', 1.4, 'power2.inOut') }
P.title(B.silBefore(2, 1)[0] + 0.05, { no: 'MIRAE AI LAB OS · 컨설턴트용', title: '고객 앞에서,<br>*더 전문가처럼*' })

// ━━ ① 문제 — 고객사가 늘면 일이 흩어진다
K.chapter(c('2.1.0'), '① 문제')
{ const t = c('2.1.0'), k = c('2.1.1'), id = K.uid('cl')
  const names = ['A사', 'B사', 'C사', 'D사', 'E사']
  const off = [[-60, -40, -8], [40, 60, 6], [-30, 80, -5], [70, -50, 9], [-80, 30, 7]]
  P.scene(t, [P.eyebrow('고객사가 늘어나면', 300, t + 0.05), `<div class="clients" id="${id}" style="top:420px">${names.map((n, i) => `<span id="${id}-${i}">${n}</span>`).join('')}</div>`,
    H([{ at: k, text: '일은 이렇게 *흩어진다*', size: 'm' }], { y: 900 })], { bg: 'bgA', trans: 'fade' })
  tw(`tl.from('#${id} span', { y: 40, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.14 }, ${r2(t + 0.3)});`)
  off.forEach(([x, y, r], i) => to(`#${id}-${i}`, k + 0.1 + i * 0.05, `x: ${x}, y: ${y}, rotation: ${r}, opacity: 0.55`, 1.2, 'power2.out')) }
{ const t = c('2.2.0')
  const sid = K.scatter(t, { items: [
    { ic: 'chat', label: '카톡', x: 110, y: 380, r: -4, at: w('카톡', t) }, { ic: 'mail', label: '메일', x: 640, y: 420, r: 3, at: w('메일', t) },
    { ic: 'photo', label: '사진첩', x: 150, y: 700, r: 3, at: w('사진첩에', t) }, { ic: 'excel', label: '엑셀 속 사업자번호', x: 560, y: 740, r: -3, at: w('엑셀', '2.2.1') }],
    extra: P.eyebrow('서류는 어디에?', 270, t + 0.05), shot: { bg: 'bgB', trans: 'fadeBlur' } })
  ;[[-30, -20, -6], [30, -30, 5], [-40, 30, 5], [30, 40, -5]].forEach(([x, y, r], i) => to(`#${sid}-${i}`, c('2.2.1') + 1.0 + i * 0.08, `x: ${x}, y: ${y}, rotation: ${r}, opacity: 0.6`, 1.2, 'power2.out')) }
{ const t = c('2.3.0'), k = c('2.3.1'), id = K.uid('th')
  const th = [['2차 기성 <b>수금 D-3</b>', 90, 640, w('수금일', t)], ['정책자금 <b>신청 마감 D-2</b>', 470, 800, w('마감', t)], ['C사 <b>다음 연락</b> · 금요일', 150, 960, w('연락할', t)]]
  P.scene(t, [P.licon('user', 330, t + 0.05), th.map(([h, x, y], i) => `<div class="thought" id="${id}-${i}" style="left:${x}px;top:${y}px">${h}</div>`).join(''),
    H([{ at: k, text: '*머릿속*에만 있다', size: 'm' }], { y: 1120 })], { bg: 'bgD', trans: 'fade' })
  th.forEach(([, , , a], i) => from(`#${id}-${i}`, a - 0.1, 'y: 30, opacity: 0', 0.8, 'expo.out'))
  tw(`tl.to('#${id}-0, #${id}-1, #${id}-2', { opacity: 0.25, filter: 'blur(6px)', duration: 1.2, ease: 'power1.inOut', stagger: 0.25 }, ${r2(k + 0.4)});`) }

// ━━ ② 더 깊은 문제 — 신뢰가 흔들리면 다음 계약도 멀어진다
K.chapter(c('3.1.0'), '② 더 깊은 문제')
{ const t = c('3.1.0'), a = c('3.2.0'), b = c('3.2.1'), id = K.uid('ch')
  P.scene(t, [H([{ at: t + 0.1, text: '더 큰 문제는<br>*따로* 있다', size: 'm' }, { at: b, text: '고객은 *조용히*<br>불안해진다', size: 'm' }], { y: 300 }),
    `<div class="chatb me" id="${id}-a" style="top:620px"><small>컨설턴트</small>사업자등록증, 한 번만<br>더 보내 주시겠어요?</div>`,
    `<div class="chatb you" id="${id}-b" style="top:900px"><small>고객사 대표님</small>…지난번에 보냈는데요?</div>`], { bg: 'bgA', trans: 'fade' })
  from(`#${id}-a`, a, 'y: 40, opacity: 0', 0.8, 'expo.out')
  from(`#${id}-b`, b + 0.2, 'y: 40, opacity: 0', 0.8, 'expo.out') }
{ const t = c('3.3.0'), k = w('흔들립니다', '3.3.1'), id = K.uid('tr')
  P.scene(t, [`<div class="cx" style="top:330px"><div class="dcal" id="${id}-c"><div><b>B사 정책자금 신청</b><small>서류 최종 확인</small></div><em>D-0<span class="late" id="${id}-l">마감 지남</span></em></div></div>`,
    `<div class="meter" id="${id}-m" style="top:640px"><div class="lab"><span>쌓아 온 신뢰</span></div><div class="trk"><i id="${id}-i"></i></div></div>`,
    H([{ at: c('3.3.1'), text: '신뢰가 *한 번에*<br>흔들린다', size: 'm' }], { y: 900 })], { bg: 'bgB', trans: 'fade' })
  from(`#${id}-c`, t + 0.1, 'y: 40, opacity: 0', 0.8, 'expo.out')
  tw(`tl.to('#${id}-l', { opacity: 1, duration: 0.4, ease: 'power1.out' }, ${r2(w('놓치면', t) + 0.3)});`)
  from(`#${id}-m`, t + 0.4, 'opacity: 0', 0.6, 'power1.out')
  tw(`tl.fromTo('#${id}-i', { scaleX: 0 }, { scaleX: 0.92, duration: 1.0, ease: 'power2.out', immediateRender: true }, ${r2(t + 0.5)});`)
  tw(`tl.to('#${id}-i', { scaleX: 0.3, duration: 0.9, ease: 'power3.in' }, ${r2(k - 0.2)});`) }
{ const t = c('3.4.0'), k = c('3.4.1')
  const g = P.cards([{ ic: 'rocket', label: '추가 계약', at: w('추가', t) - 0.1 }, { ic: 'users', label: '소개', at: w('소개도', t) - 0.1 }], { layout: 'row', y: 420 })
  P.scene(t, [g.html.replace('gcards row', 'gcards row two'), H([{ at: k, text: '조용히 *멀어진다*', size: 'm' }], { y: 900 })], { bg: 'bgD', trans: 'fade' })
  to(`#${g.id}-0`, k + 0.2, 'x: -70, opacity: 0.3', 1.4, 'power2.inOut')
  to(`#${g.id}-1`, k + 0.3, 'x: 70, opacity: 0.3', 1.4, 'power2.inOut') }
fzBefore(4, 1, '신뢰가 흔들리면', '추가 계약도, 소개도 멀어진다')

{ const t = c('4.1.0'), k = c('4.1.1'), id = K.uid('fn')
  P.scene(t, [P.eyebrow('다음 계약을 부르는 건', 280, t + 0.05),
    `<div class="cx" style="top:400px"><div class="fan" id="${id}"><i style="transform:rotate(-9deg) translateX(-70px)"></i><i style="transform:rotate(7deg) translateX(70px)"></i><i></i></div></div>`,
    H([{ at: k, text: '화려한 *제안서*보다', size: 'm' }], { y: 960 })], { bg: 'bgC', trans: 'fade' })
  tw(`tl.from('#${id} i', { y: 60, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12 }, ${r2(t + 0.3)});`)
  to(`#${id}`, k + 0.6, 'opacity: 0.3, filter: "grayscale(1)"', 1.0, 'power1.inOut') }
{ const t = c('4.2.0'), k = c('4.2.1')
  P.scene(t, [P.eyebrow('가장 강한 영업', 300, t + 0.05), '<div class="qmark" style="top:380px">“</div>',
    H([{ at: t + 0.15, text: '그 컨설턴트는<br>*관리가 확실해*', size: 'l' }], { y: 560 }), P.seal('이 한마디', 900, k, 'gold')], { bg: 'bgC', trans: 'fadeBlur' }) }
fzBefore(5, 1, '관리가 곧 영업이다')

// ━━ ③ 해결 — MIRAE AI LAB OS
K.chapter(c('5.1.0'), '③ 해결')
{ const t = c('5.1.0'), k = c('5.1.1'), id = K.uid('os')
  P.scene(t, [P.eyebrow('그래서 만들었습니다', 480, t + 0.05), `<div class="osname" id="${id}" style="top:560px">MIRAE AI LAB <em>OS</em></div>`,
    `<p class="ksub" id="${id}-s" style="top:720px">컨설턴트 운영 OS</p>`], { bg: 'bgC', trans: 'fade', cam: 'in' })
  from(`#${id}`, k - 0.2, 'opacity: 0, y: 30, scale: 0.98', 1.1, 'expo.out')
  from(`#${id}-s`, k + 0.4, 'opacity: 0, y: 16', 0.8, 'expo.out') }
{ const t = c('5.2.0'), k = c('5.2.1'), id = K.uid('yr')
  P.scene(t, [P.eyebrow('만든 사람', 280, t + 0.05), P.number({ from: 1, to: 9, suf: '년', y: 360, at: w('9년', t), d: 0.8 }),
    `<p class="ksub" id="${id}" style="top:660px">세무 · 노무 · 법무 · 자금 현장의 일을 담아</p>`, P.seal('매일 직접 쓰는 기능만', 860, k, 'gold')], { bg: 'bgA', trans: 'fade' })
  from(`#${id}`, w('현장의', t), 'opacity: 0, y: 14', 0.7, 'expo.out') }
{ const t = c('5.3.0')
  K.browser(t, { src: CS('dash.jpg'), tag: EX, top: 400, d: 4.4, zoom: 1.16, panX: 60, panY: 40,
    extra: P.eyebrow('아침에 열면', 290, t + 0.05) + H([{ at: c('5.3.1'), text: '오늘 꼭 할 일이<br>*정리돼* 있다', size: 's' }], { y: 1110 }), shot: { bg: 'bgB', trans: 'fade' } }) }
{ const t = c('5.4.0'), k = c('5.4.1'), id = K.uid('t3')
  const W3 = 960, sc = W3 / 1212
  const rows = [[144, 0], [272, 1], [398, 2]]
  P.scene(t, [P.eyebrow('먼저 할 세 가지', 300, t + 0.05), shotImg(id, CS('dash-top3.png'), 400, W3, rows.map(([y], i) => `<span class="hl-row" id="${id}-r${i}" style="top:${r2((y - 58) * sc)}px;height:${r2(116 * sc)}px"></span>`).join('')),
    H([{ at: k, text: '*이유*와 함께 알려 준다', size: 's' }], { y: 860 }), fine(`${id}-f`, EX, 1000)], { bg: 'bgA', trans: 'fade' })
  from(`#${id}`, t + 0.15, 'y: 40, opacity: 0', 0.9, 'expo.out')
  rows.forEach(([, i]) => tw(`tl.to('#${id}-r${i}', { opacity: 1, duration: 0.3 }, ${r2(k + i * 0.45)}); tl.to('#${id}-r${i}', { opacity: 0, duration: 0.3 }, ${r2(k + i * 0.45 + 0.42)});`))
  from(`#${id}-f`, t + 0.6, 'opacity: 0', 0.6, 'power1.out') }

{ const t = c('6.1.0'), k = c('6.1.1')
  const g = P.cards([{ ic: 'doc', label: '사업자등록증', at: t + 0.1, checkAt: t + 0.6 }, { ic: 'doc', label: '재무제표', at: t + 0.25, checkAt: t + 0.85 }, { ic: 'doc', label: '4대보험 가입자명부', at: t + 0.4, checkAt: t + 1.1 }], { y: 340 })
  P.scene(t, [g.html, H([{ at: t + 0.3, text: '서류는 *한 번만*', size: 'm' }, { at: k, text: '밖에서도 *폰으로*', size: 'm' }], { y: 900 })], { bg: 'bgD', trans: 'wipeUp' }) }
{ const t = c('6.2.0'), id = K.uid('hc')
  const W = 700, sc = W / 898
  const ring = (x, y, w2, h2) => `left:${r2(x * sc)}px;top:${r2(y * sc)}px;width:${r2(w2 * sc)}px;height:${r2(h2 * sc)}px`
  P.scene(t, [shotImg(id, CS('hero-card.png'), 290, W, `<span class="ring" id="${id}-a" style="${ring(38, 180, 408, 124)}"></span><span class="ring" id="${id}-b" style="${ring(38, 314, 822, 168)}"></span>`),
    H([{ at: c('6.2.1'), text: '고객사 정보가 *한 화면에*', size: 's' }], { y: 1010 })], { bg: 'bgB', trans: 'fade' })
  from(`#${id}`, t + 0.1, 'y: 50, opacity: 0', 0.9, 'expo.out')
  tw(`tl.to('#${id}-a', { opacity: 1, duration: 0.35 }, ${r2(w('사업자등록번호부터', t) + 0.2)}); tl.to('#${id}-a', { opacity: 0, duration: 0.3 }, ${r2(w('받은', t) - 0.1)});`)
  tw(`tl.to('#${id}-b', { opacity: 1, duration: 0.35 }, ${r2(w('받은', t) + 0.1)});`) }
K.notifs(c('6.3.0'), { items: [
  { ic: 'money', t: 'A사 2차 기성 수금', s: '수금 예정일 D-3', w: '오늘', at: w('받을', '6.3.0') },
  { ic: 'cal', t: 'B사 정책자금 신청 마감', s: 'D-2 · 서류 최종 확인', w: '오늘', at: w('마감', '6.3.0') },
  { ic: 'bell', t: 'C사 다음 연락', s: '금요일 · 진행 상황 공유', w: '이번 주', at: w('연락할', '6.3.0') }],
  fine: EX, extra: P.eyebrow('먼저 알려 주는 것', 270, c('6.3.0') + 0.05) + H([{ at: c('6.3.1'), text: 'OS가 *먼저* 챙긴다', size: 'm' }], { y: 960 }), shot: { bg: 'bgA', trans: 'fade' } })

{ const t = c('7.1.0'), k = c('7.1.1'), id = K.uid('ib')
  P.scene(t, [`<div class="dchips" id="${id}-d" style="top:300px"><span>${ic('user')}고객</span><span>${ic('doc')}서류 올림</span><span>${ic('chat')}요청 남김</span></div>`,
    `<div class="flowdown" id="${id}-a" style="top:430px">${ic('arrowDown')}</div>`,
    shotImg(id, CS('dash-inbox.png'), 540, 560), fine(`${id}-f`, EX, 1150)], { bg: 'bgD', trans: 'fade' })
  tw(`tl.from('#${id}-d span', { y: 30, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.2 }, ${r2(t + 0.15)});`)
  from(`#${id}-a`, k - 0.3, 'y: -30, opacity: 0', 0.7, 'expo.out')
  from(`#${id}`, k, 'y: 50, opacity: 0', 0.9, 'expo.out')
  from(`#${id}-f`, k + 0.4, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('7.2.0'), k = c('7.2.1')
  const g = P.cards([{ ic: 'lock', label: '내부 메모 · 초안', sub: '고객에겐 안 보여요', at: t + 0.1 }, { ic: 'check', label: '정리된 결과', sub: '고객 화면에만', hl: true, at: w('결과만', t) }], { layout: 'row', y: 380 })
  P.scene(t, [g.html.replace('gcards row', 'gcards row two'), H([{ at: k, text: '“어디까지 됐어요?”<br>*카톡이 줄어든다*', size: 's' }], { y: 900 })], { bg: 'bgB', trans: 'fade' }) }

// ━━ ④ 다음 계약 — 올려 둔 서류가 다음 제안 거리를 찾아 준다
K.chapter(c('8.1.0'), '④ 다음 계약')
{ const t = c('8.1.0')
  P.scene(t, [P.licon('star', 470, t + 0.05), H([{ at: t + 0.15, text: '여기서부터가<br>*진짜*', size: 'l' }], { y: 690 })], { bg: 'bgC', trans: 'fadeBlur', cam: 'in' }) }
{ const t = c('8.2.0'), k = c('8.2.1'), id = K.uid('nx')
  P.scene(t, [`<div class="dchips" id="${id}-d" style="top:330px"><span>${ic('doc')}사업자등록증</span><span>${ic('doc')}재무제표</span><span>${ic('doc')}4대보험 명부</span></div>`,
    shotImg(id, CS('hero-next.png'), 620, 900), H([{ at: k, text: '다음 제안 거리를<br>*찾아 준다*', size: 's' }], { y: 980 }), fine(`${id}-f`, EX, 1250)], { bg: 'bgA', trans: 'fade' })
  tw(`tl.from('#${id}-d span', { y: -30, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.15 }, ${r2(t + 0.1)});`)
  tw(`tl.to('#${id}-d span', { y: 230, opacity: 0, scale: 0.8, duration: 0.9, ease: 'power2.in', stagger: 0.12 }, ${r2(k - 0.6)});`)
  from(`#${id}`, k - 0.1, 'y: 40, opacity: 0', 0.9, 'expo.out')
  from(`#${id}-f`, k + 0.3, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('8.3.0'), k = c('8.3.1')
  const g = P.cards([{ ic: 'team', label: '고용지원금 매니저', at: w('고용지원금', t) - 0.1 }, { ic: 'book', label: '기업부설연구소 OS', at: w('기업부설연구소', t) - 0.1 },
    { ic: 'bank', label: '정책자금 진단', at: w('정책자금', t) - 0.1 }, { ic: 'money', label: '세금 계산기', at: w('세금까지', t) - 0.1 }], { y: 300 })
  P.scene(t, [g.html, H([{ at: k, text: '다음 모듈로 *그대로*', size: 's' }], { y: 1090 })], { bg: 'bgD', trans: 'fade' }) }
{ const t = c('8.4.0'), k = c('8.4.1'), id = K.uid('up')
  const g = P.cards([{ ic: 'rocket', label: '추가 계약', sub: '같은 고객사, 다음 컨설팅', hl: true, at: k, checkAt: k + 0.6 }], { y: 720 })
  P.scene(t, [`<div class="chatb gold" id="${id}" style="top:330px;right:90px">“대표님, 다음엔<br>이걸 해 보시죠.”</div>`, g.html,
    H([{ at: k + 0.3, text: '추가 계약이 *자연스럽게*', size: 's' }], { y: 1010 })], { bg: 'bgC', trans: 'fade' })
  from(`#${id}`, t + 0.1, 'y: 40, opacity: 0', 0.9, 'expo.out') }
fzBefore(9, 1, '올려 둔 서류가, 다음 계약으로')

// ━━ ⑤ 새 고객 — 첫 미팅부터 달라 보인다
K.chapter(c('9.1.0'), '⑤ 새 고객')
{ const t = c('9.1.0')
  K.people(t, { y: 460, items: [['user', '고객사 대표님'], ['user', '컨설턴트님']], react: 'star', reactAt: t + 1.0,
    extra: H([{ at: t + 0.2, text: '첫 미팅부터<br>*달라 보인다*', size: 'm' }], { y: 900 }), shot: { bg: 'bgA', trans: 'fade' } }) }
{ const t = c('9.2.0'), k = c('9.2.1'), id = K.uid('cs')
  const st = [['준비 중', 'done'], ['자료 확인 중', 'done'], ['진행 중', 'now'], ['기관 접수', ''], ['결과 대기', ''], ['완료', '']]
  P.scene(t, [`<div class="chatb me" id="${id}-q" style="top:250px;right:90px;font-size:40px">“서류는 여기 올려 주시고,<br>진행 상황은 여기서 보시면 돼요.”</div>`,
    `<div class="cx" style="top:560px"><div class="cscreen" id="${id}"><h4>고객 화면 · 예시</h4><h5>B사 · 정책자금 신청</h5>${st.map(([l, s], i) => `<div class="st ${s}" id="${id}-${i}"><i></i>${l}</div>`).join('')}<p class="foot2">${EX}</p></div></div>`], { bg: 'bgB', trans: 'fade' })
  from(`#${id}-q`, t + 0.1, 'y: 30, opacity: 0', 0.8, 'expo.out')
  from(`#${id}`, k - 0.2, 'y: 60, opacity: 0', 0.9, 'expo.out')
  tw(`tl.from('#${id} .st', { x: -20, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.12 }, ${r2(k)});`) }
{ const t = c('9.3.0'), k = c('9.3.1'), a = K.uid('tl'), b = K.uid('tl')
  P.scene(t, [`<div class="cx" style="top:250px"><span class="chip" id="${a}-c">크레탑 분석기 · 실제 도구 화면</span></div>`, shotImg(a, CS('tool-cretop.png'), 330, 820),
    `<div class="cx" style="top:770px"><span class="chip" id="${b}-c">창업감면 판정기 · 실제 도구 화면</span></div>`, shotImg(b, CS('tool-tax.png'), 850, 780)], { bg: 'bgA', trans: 'fade' })
  from(`#${a}-c, #${a}`, t + 0.1, 'y: 40, opacity: 0', 0.9, 'expo.out')
  from(`#${b}-c, #${b}`, w('세금', t), 'y: 40, opacity: 0', 0.9, 'expo.out') }

// ━━ ⑥ 달라지는 것 — 소개가 소개를 부른다
K.chapter(c('10.1.0'), '⑥ 달라지는 것')
{ const t = c('10.1.0')
  const g = P.cards([{ ic: 'door', label: '헛걸음이 사라지고', at: t + 0.1, checkAt: t + 0.8 }, { ic: 'users', label: '같은 시간에 더 많은 고객사를', at: c('10.1.1'), checkAt: c('10.1.1') + 0.8 },
    { ic: 'book', label: '처음 맡는 분야도 금방', at: c('10.2.0'), checkAt: c('10.2.0') + 0.8 }], { y: 400 })
  P.scene(t, [P.eyebrow('써 보면 달라지는 것', 300, t + 0.05), g.html], { bg: 'bgD', trans: 'fade' }) }
{ const t = c('10.3.0'), k = c('10.3.1'), id = K.uid('nw')
  const cx = 450, cy = 330
  const ring1 = [[450, 110], [700, 470], [200, 470]]
  const ring2 = [[250, 70], [650, 70], [830, 300], [790, 620], [110, 620], [70, 300]]
  const lines = [...ring1.map(([x, y]) => [cx, cy, x, y]), [450, 110, 250, 70], [450, 110, 650, 70], [700, 470, 830, 300], [700, 470, 790, 620], [200, 470, 110, 620], [200, 470, 70, 300]]
  const svg = `<svg class="net" id="${id}" viewBox="0 0 900 700" style="top:300px">
    ${lines.map(([a, b, c2, d], i) => `<line id="${id}-l${i}" x1="${a}" y1="${b}" x2="${c2}" y2="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join('')}
    ${ring2.map(([x, y], i) => `<g id="${id}-o${i}"><circle cx="${x}" cy="${y}" r="42"/></g>`).join('')}
    ${ring1.map(([x, y], i) => `<g id="${id}-m${i}"><circle cx="${x}" cy="${y}" r="56"/><text x="${x}" y="${y + 11}">소개</text></g>`).join('')}
    <g id="${id}-c"><circle class="me" cx="${cx}" cy="${cy}" r="92"/><text class="me" x="${cx}" y="${cy + 11}">컨설턴트님</text></g></svg>`
  P.scene(t, [svg, H([{ at: k, text: '소개가 *소개를* 부른다', size: 'm' }], { y: 1070 })], { bg: 'bgC', trans: 'fade' })
  from(`#${id}-c`, t + 0.1, 'opacity: 0, scale: 0.8, transformOrigin: "50% 50%"', 0.8, 'expo.out')
  tw(`tl.to('#${id}-l0, #${id}-l1, #${id}-l2', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, ${r2(t + 0.6)});`)
  tw(`tl.from('#${id}-m0, #${id}-m1, #${id}-m2', { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.7, ease: 'expo.out', stagger: 0.12 }, ${r2(t + 0.9)});`)
  tw(`tl.to('${[3, 4, 5, 6, 7, 8].map((i) => `#${id}-l${i}`).join(', ')}', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, ${r2(k)});`)
  tw(`tl.from('${ring2.map((_, i) => `#${id}-o${i}`).join(', ')}', { opacity: 0, scale: 0.5, transformOrigin: "50% 50%", duration: 0.7, ease: 'expo.out', stagger: 0.08 }, ${r2(k + 0.3)});`) }
K.chart(c('10.4.0'), { mode: 'up', top: 520, tagTop: '다음 계약', tagTopX: 640, tagTopAt: c('10.4.0') + 1.2, d: 1.6,
  extra: H([{ at: c('10.4.0') + 0.1, text: '일이 *일을 부르는*<br>컨설턴트', size: 'm', y: 250 }, { at: c('10.4.1'), text: '이제 *컨설턴트님*<br>차례예요', size: 'm', y: 250 }]), shot: { bg: 'bgA', trans: 'fade' } })
fzBefore(11, 1, '일이 일을 부르는 컨설턴트')

// ━━ ⑦ 오픈
K.chapter(c('11.1.0'), '⑦ 오픈')
{ const t = c('11.1.0'), k = w('10월부터', t), id = K.uid('lt')
  const st = [['지금', '다듬는 중', ''], ['2026년 10월', '운영 · 기업성장<br>모듈부터', 'on'], ['그다음', '절세·재무 등<br>하나씩', '']]
  P.scene(t, [P.eyebrow('출시 일정', 300, t + 0.05), `<div class="lt" id="${id}" style="top:440px">${st.map(([a, b2, cl], i) => `<div class="${cl}" id="${id}-${i}"><i></i><b>${a}</b><small>${b2}</small></div>`).join('')}</div>`,
    H([{ at: c('11.1.1'), text: '모듈을 *하나씩* 연다', size: 'm' }], { y: 900 }), fine(`${id}-f`, '모듈별 일정은 바뀔 수 있어요', 1250)], { bg: 'bgB', trans: 'fade' })
  from(`#${id}-0`, t + 0.2, 'y: 30, opacity: 0', 0.7, 'expo.out')
  from(`#${id}-1`, k - 0.1, 'y: 30, opacity: 0', 0.7, 'expo.out')
  from(`#${id}-2`, c('11.1.1') + 0.1, 'y: 30, opacity: 0', 0.7, 'expo.out')
  from(`#${id}-f`, t + 0.6, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('11.2.0'), k = c('11.2.1'), id = K.uid('cta')
  P.scene(t, [P.eyebrow('가장 먼저 써 보고 싶다면', 360, t + 0.05), `<div class="cx" style="top:560px"><span class="ctabtn" id="${id}">${ic('bell')}오픈 소식 받기</span></div>`,
    `<span class="touch" id="${id}-t" style="left:720px;top:640px"></span>`, `<div class="cx" style="top:800px"><span class="chip" id="${id}-u">miraeailab.com/consultants</span></div>`], { bg: 'bgC', trans: 'fade', cam: 'in' })
  from(`#${id}`, t + 0.3, 'scale: 0.92, opacity: 0', 0.9, 'expo.out')
  tw(`tl.fromTo('#${id}-t', { scale: 0.4, opacity: 0.95 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, ${r2(k + 0.4)});`)
  tw(`tl.to('#${id}', { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 }, ${r2(k + 0.4)});`)
  from(`#${id}-u`, k, 'opacity: 0, y: 14', 0.7, 'expo.out') }
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(ENDV - 0.1, { eb: 'MIRAE AI LAB OS', card: '<span class="no">2026년 10월부터 하나씩</span><h3>오픈 소식<br>받기</h3><ul><li>miraeailab.com/consultants</li><li>모듈을 열 때마다 먼저 연락</li><li>도입 문의 · 직접 답해 드려요</li></ul>', shot: { trans: 'fade' } })

B.finish(r2(ENDV + 3.2))
