// 릴스(9:16) 소개 영상 — timing.json(녹음 음성 정렬 결과) → index.html(HyperFrames) + subtitles.srt
// 장면 전환·강조는 모두 목소리의 실제 시간(문장 시작, 핵심 단어)에 맞춘다.
import { readFileSync, writeFileSync } from 'node:fs'

const W = 1080, H = 1920
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url), 'utf8'))
const meta = JSON.parse(readFileSync(new URL('./assets/shots/meta.json', import.meta.url), 'utf8'))
const r2 = (n) => Math.round(n * 100) / 100
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const L = (b, l = 1) => T.lines.find((x) => x.block === b && x.line === l)
const K = (id) => { if (!(id in T.keys)) throw new Error('no key ' + id); return T.keys[id] }
const NB = 12
const START = {}
for (let b = 1; b <= NB; b++) START[b] = b === 1 ? 0 : r2(L(b).start - 0.25)
const TOTAL = r2(T.audioEnd + 1.8)
const END = (b) => (b === NB ? TOTAL : START[b + 1])

let html = '', js = ''
const tw = (c) => { js += `  ${c}\n` }
const sec = (b, inner) => { html += `<section class="clip scene" id="s${b}" data-start="${START[b]}" data-duration="${r2(END(b) - START[b])}" data-track-index="1">${inner}</section>\n` }
const fade = (b) => {
  tw(`tl.fromTo('#s${b}', { opacity: 0 }, { opacity: 1, duration: 0.22 }, ${START[b]});`)
  if (b < NB) tw(`tl.to('#s${b}', { opacity: 0, duration: 0.18 }, ${r2(END(b) - 0.18)});`)
}
const lines = (arr) => arr.map((l) => `<div class="ln"><span>${l}</span></div>`).join('')
const reveal = (sel, at, stagger = 0.12) => tw(`tl.from('${sel}', { yPercent: 110, duration: 0.5, ease: 'power3.out', stagger: ${stagger} }, ${r2(at)});`)
const rise = (sel, at, extra = '') => tw(`tl.from('${sel}', { y: 36, opacity: 0, duration: 0.42, ease: 'power2.out'${extra} }, ${r2(at)});`)
const pop = (sel, at) => tw(`tl.from('${sel}', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, ${r2(at)});`)

// ── 그림 조각
const CERT = (id, cls = '') => `<div class="cert ${cls}" id="${id}"><div class="cert-in"><p class="cert-k">예시 그림</p><p class="cert-t">벤처기업<br>확인서</p><i></i><i></i><i style="width:62%"></i><div class="cert-seal"><svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="#fff"/></svg></div></div></div>`
const PHONE = (id, img, cls = '') => `<div class="phone ${cls}" id="${id}"><div class="screen">${img ? `<img class="mob" id="${id}-img" src="assets/shots/${img}" alt="">` : '<div class="blank"><i></i><i></i><i></i><b>MVP</b></div>'}</div></div>`
const CURSOR = (id) => `<svg class="cursor" id="${id}" viewBox="0 0 24 24" width="44" height="44"><path d="M4 2.5 L4 19 L8.6 14.8 L11.6 21.4 L14.4 20.2 L11.4 13.7 L17.6 13.4 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`
const ICON = {
  tax: '<svg viewBox="0 0 24 24"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  bldg: '<svg viewBox="0 0 24 24"><path d="M4 21V7l8-4 8 4v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 21v-5h6v5M8 10h2M14 10h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  bank: '<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
}
const BW = 960, SC = BW / 1440, MOBW = 212, MS = MOBW / 780
const BROWSER = (id, name, vph, inner) => `<div class="browser" id="${id}" style="width:${BW}px"><div class="bar"><i></i><i></i><i></i><span class="url">${esc(name)}</span></div><div class="vp" style="height:${vph}px">${inner}</div></div>`

// 1) 두 고객 동시에
{
  const b = 1
  sec(b, `
    <div class="who" id="s1a" style="top:290px">${CERT('s1-cert', 'sm')}<span class="qm" id="s1-q1">?</span>
      <div class="who-txt"><span class="tag">중소기업 대표님</span><p>벤처인증은 필요한데<br><b>내세울 기술</b>이 없다면?</p></div></div>
    <div class="who" id="s1b" style="top:745px">${PHONE('s1-ph', null, 'sm')}<span class="qm" id="s1-q2">?</span>
      <div class="who-txt"><span class="tag">예비창업자</span><p>창업 준비 중인데<br><b>MVP부터</b> 막막하다면?</p></div></div>
    <div class="stamp" id="s1s">둘 다, <em>한 번에</em> 해결</div>`)
  fade(b)
  tw(`tl.from('#s1a', { x: -80, opacity: 0, duration: 0.5, ease: 'power3.out' }, ${r2(L(1, 1).start)});`)
  tw(`tl.from('#s1b', { x: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, ${r2(L(1, 2).start)});`)
  tw(`tl.from(['#s1-q1', '#s1-q2'], { scale: 0, duration: 0.35, ease: 'back.out(2.5)', stagger: ${r2(L(1, 2).start - L(1, 1).start)} }, ${r2(L(1, 1).start + 0.4)});`)
  tw(`tl.to(['#s1-q1', '#s1-q2'], { scale: 0, opacity: 0, duration: 0.25 }, ${r2(L(1, 3).start)});`)
  tw(`tl.to('#s1a', { y: 60, scale: 0.94, duration: 0.5, ease: 'power2.inOut' }, ${r2(L(1, 3).start)});`)
  tw(`tl.to('#s1b', { y: -40, scale: 0.94, duration: 0.5, ease: 'power2.inOut' }, ${r2(L(1, 3).start)});`)
  pop('#s1s', L(1, 3).start + 0.35)
}
// 2) 약속 — 벤처기업확인 + 작동하는 MVP = 기술기업
{
  const b = 2
  sec(b, `
    <div class="big" id="s2-t">${lines(['<em class="peach">작동하는 서비스</em>', '+ 벤처기업확인 신청'])}</div>
    ${CERT('s2-cert', 'md')}
    <div class="plus" id="s2-plus">+</div>
    ${PHONE('s2-ph', 'pawbeauty-mob.jpg', 'md')}
    <div class="badge" id="s2-badge"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#171B20" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><b>기술기업</b></div>
    <p class="fine" id="s2-f" style="top:1245px">*벤처인증의 정식 명칭은 벤처기업확인이에요. 확인 여부는 확인기관 심사로 정해집니다.</p>`)
  fade(b)
  reveal('#s2-t .ln:nth-child(1) > span', START[b] + 0.15)
  reveal('#s2-t .ln:nth-child(2) > span', K('b2_cert') - 0.25)
  rise('#s2-ph', START[b] + 0.3); rise('#s2-plus', K('b2_cert') - 0.35); rise('#s2-cert', K('b2_cert') - 0.2)
  tw(`tl.to('#s2-ph-img', { y: -520, duration: ${r2(END(b) - START[b] - 0.6)}, ease: 'power1.inOut' }, ${r2(START[b] + 0.5)});`)
  tw(`tl.to(['#s2-cert', '#s2-ph', '#s2-plus'], { opacity: 0.35, duration: 0.4 }, ${r2(K('b2_tech') - 0.1)});`)
  pop('#s2-badge', K('b2_tech') - 0.05)
  rise('#s2-f', K('b2_tech') + 0.4)
}
// 3) 혜택
{
  const b = 3
  const C = [['tax', '법인세·소득세', '최대 5년 <b>50%</b> 감면', 'b3_tax'], ['bldg', '취득세·재산세', '감면 가능', 'b3_half'], ['bank', '정책자금·보증', '심사 <b>우대</b>', 'b3_fund'], ['plus', '정부지원사업', '<b>가점</b>', 'b3_point']]
  sec(b, `
    <div class="big" id="s3-t">${lines(['벤처인증,', '<em class="peach">왜 받을까요?</em>'])}</div>
    <div class="grid4">${C.map(([ic, a, c], i) => `<div class="bcard" id="s3-c${i}"><span class="bic">${ICON[ic]}</span><p class="ba">${a}</p><p class="bb">${c}</p></div>`).join('')}</div>
    <p class="fine" id="s3-f" style="top:1240px">요건 충족 시(창업 3년 이내 벤처확인 등) · 기관·사업마다 기준이 달라요</p>`)
  fade(b); reveal('#s3-t .ln > span', START[b] + 0.15)
  C.forEach((c, i) => pop(`#s3-c${i}`, K(c[3]) - 0.1))
  rise('#s3-f', K('b3_tax') + 0.8)
}
// 4) 기술성·성장성 → 눌러 보는 웹앱
{
  const b = 4
  const m = meta.pawbeauty, vph = 440
  const nav = { x: (m.click.x + m.click.width / 2) * SC, y: (m.click.y + m.click.height / 2) * SC }
  const pet = { x: 540 * SC, y: 370 * SC }
  sec(b, `
    <div class="big" id="s4-t">${lines(['벤처기업확인은', '<em class="peach">기술성·성장성</em>을 봐요'])}</div>
    <div class="nope" id="s4-doc"><span class="doclines"><i></i><i></i><i style="width:60%"></i></span><p>말로만 하는 기술</p><span class="x">✕</span></div>
    <div class="abs" style="left:60px;top:800px">${BROWSER('s4-b', 'PawBeauty · 미래AI랩 자체 데모', vph, `<img class="shot" src="assets/shots/pawbeauty-home.jpg" style="width:${BW}px" alt=""><img class="shot" id="s4-inner" src="assets/shots/pawbeauty-inner.jpg" style="width:${BW}px" alt=""><div class="ripple" id="s4-r1" style="left:${r2(nav.x)}px;top:${r2(nav.y)}px"></div><div class="ripple" id="s4-r2" style="left:${r2(pet.x)}px;top:${r2(pet.y)}px"></div>${CURSOR('s4-cur')}`)}</div>
    <div class="okpill" id="s4-ok">✓ 직접 눌러 보는 웹앱</div>`)
  fade(b); reveal('#s4-t .ln > span', START[b] + 0.15)
  rise('#s4-doc', K('b4_word') - 0.15)
  tw(`tl.to('#s4-doc', { opacity: 0.4, duration: 0.3 }, ${r2(K('b4_click'))});`)
  rise('#s4-b', K('b4_click') - 0.35)
  tw(`tl.set('#s4-inner', { opacity: 0 }, ${START[b]});`)
  const c0 = K('b4_click') + 0.1
  tw(`tl.fromTo('#s4-cur', { x: ${BW - 260}, y: ${vph - 80}, opacity: 0 }, { opacity: 1, duration: 0.15 }, ${r2(c0)});`)
  tw(`tl.to('#s4-cur', { x: ${r2(nav.x - 6)}, y: ${r2(nav.y - 4)}, duration: 0.7, ease: 'power2.inOut' }, ${r2(c0 + 0.1)});`)
  tw(`tl.fromTo('#s4-r1', { scale: 0.3, opacity: 0.95 }, { scale: 1.7, opacity: 0, duration: 0.45 }, ${r2(c0 + 0.82)});`)
  tw(`tl.to('#s4-inner', { opacity: 1, duration: 0.25 }, ${r2(c0 + 1.0)});`)
  tw(`tl.to('#s4-cur', { x: ${r2(pet.x - 6)}, y: ${r2(pet.y - 4)}, duration: 0.6, ease: 'power2.inOut' }, ${r2(c0 + 1.2)});`)
  tw(`tl.fromTo('#s4-r2', { scale: 0.3, opacity: 0.95 }, { scale: 1.7, opacity: 0, duration: 0.45 }, ${r2(c0 + 1.85)});`)
  pop('#s4-ok', K('b4_ok') - 0.1)
}
// 5) 아이디어 있든 없든 + 매출로 이어지는 성장 방안
{
  const b = 5
  sec(b, `
    <div class="big" id="s5-t">${lines(['아이디어가', '<em class="peach">있든, 없든</em>'])}</div>
    <div class="row" id="s5-c1" style="top:560px"><span class="tag">아이디어가 있다면</span><p>그 아이디어를 <b>MVP로</b></p></div>
    <div class="row" id="s5-c2" style="top:770px"><span class="tag">아이디어가 없다면</span><p>지금 사업에서 <b>기술사업 찾기</b></p></div>
    <span class="pro" id="s5-pro">9년 차 경영컨설턴트 1:1</span>
    <div class="row hot" id="s5-c3" style="top:990px"><span class="tag">함께 짜 드려요</span><p><b>매출로 이어지는</b> 성장 방안</p>
      <div class="chips" id="s5-chips"><span>융자</span><span>투자</span><span>지원사업</span></div></div>`)
  fade(b); reveal('#s5-t .ln > span', START[b] + 0.15)
  rise('#s5-c1', K('b5_have') + 0.3); rise('#s5-c2', K('b5_none') - 0.1); pop('#s5-pro', K('b5_pro') - 0.1)
  rise('#s5-c3', K('b5_sales') - 0.1)
  tw(`tl.from('#s5-chips span', { scale: 0.5, opacity: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.28 }, ${r2(K('b5_loan') - 0.1)});`)
}
// 6) 다시 부르기 — AI 로 찍어낸 사업계획서
{
  const b = 6
  const rot = [-10, -5, 0, 5, 10]
  sec(b, `
    <div class="big" id="s6-t">${lines(['정책자금·지원사업', '<em class="peach">준비 중이신가요?</em>'])}</div>
    <div class="stack" id="s6-stack">${rot.map((r, i) => `<div class="plan" style="transform:translateX(${(i - 2) * 70}px) rotate(${r}deg)"><p>사업계획서</p><span class="aitag">AI로 작성</span><i></i><i></i><i style="width:70%"></i><i></i><i style="width:55%"></i></div>`).join('')}</div>
    <div class="grey" id="s6-grey">다 비슷해 보여요</div>`)
  fade(b); reveal('#s6-t .ln > span', START[b] + 0.15)
  tw(`tl.from('#s6-stack .plan', { y: 120, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.12 }, ${r2(K('b6_plan') - 0.6)});`)
  tw(`tl.to('#s6-stack', { opacity: 0.45, filter: 'grayscale(1)', duration: 0.5 }, ${r2(K('b6_hard'))});`)
  pop('#s6-grey', K('b6_hard') + 0.1)
}
// 7) MVP 가 차이 → 나중엔 AX (공식 근거는 따로)
{
  const b = 7
  sec(b, `
    <div class="big" id="s7-t1">${lines(['눌러 보여 주는 <em class="peach">MVP</em>가', '차이를 만들어요'])}</div>
    <div class="big" id="s7-t2">${lines(['나중엔 AI를 붙여', '<em class="orange">AX</em>로 키워요'])}</div>
    <div id="s7-a">
      <div class="stack mini">${[-8, 0, 8].map((r) => `<div class="plan" style="transform:rotate(${r}deg)"><p>사업계획서</p><i></i><i></i><i style="width:70%"></i></div>`).join('')}</div>
      ${PHONE('s7-ph', 'pawbeauty-mob.jpg', 'lg')}
      <span class="chip c1" id="s7-ch1">심사위원 앞에서</span><span class="chip c2" id="s7-ch2">투자자 앞에서</span>
    </div>
    <div id="s7-b"><div class="abs" style="left:60px;top:560px">${BROWSER('s7-br', 'MATERIX · 미래AI랩 자체 AX 데모', 460, `<img class="shot" id="s7-ax" src="assets/shots/ax-materix.jpg" style="width:${BW}px" alt="">`)}</div>
      <span class="aichip" id="s7-ai">+ AI</span></div>
    <div class="official" id="s7-off"><span class="otag">공식 근거</span><p>중소벤처기업부 2026 정책자금<br><b>AX 스프린트 우대트랙</b></p><small>대상·심사기준을 충족한 기업에 적용돼요</small></div>`)
  fade(b); reveal('#s7-t1 .ln > span', START[b] + 0.15)
  tw(`tl.from('#s7-a .plan', { opacity: 0, y: 40, duration: 0.4, stagger: 0.1 }, ${r2(START[b] + 0.2)});`)
  tw(`tl.from('#s7-ph', { scale: 0.7, opacity: 0, duration: 0.55, ease: 'back.out(1.7)' }, ${r2(K('b7_mvp') - 0.2)});`)
  tw(`tl.to('#s7-ph-img', { y: -560, duration: 3.6, ease: 'power1.inOut' }, ${r2(K('b7_mvp'))});`)
  tw(`tl.from(['#s7-ch1', '#s7-ch2'], { scale: 0.5, opacity: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.3 }, ${r2(K('b7_mvp') + 0.6)});`)
  const sw = K('b7_ai') - 0.35
  tw(`tl.to(['#s7-a', '#s7-t1'], { opacity: 0, duration: 0.3 }, ${r2(sw)});`)
  tw(`tl.set('#s7-t2', { opacity: 1 }, ${r2(sw)});`)
  tw(`tl.set('#s7-t2', { opacity: 0 }, ${START[b]});`)
  reveal('#s7-t2 .ln > span', sw + 0.1)
  tw(`tl.from('#s7-br', { y: 50, opacity: 0, duration: 0.5, ease: 'power2.out' }, ${r2(sw + 0.2)});`)
  tw(`tl.to('#s7-ax', { y: -160, duration: 3.2, ease: 'power1.inOut' }, ${r2(sw + 0.6)});`)
  pop('#s7-ai', sw + 0.6)
  rise('#s7-off', K('b7_gov') - 0.1)
}
// 8) 따로 vs 한 번에
{
  const b = 8
  const steps = [['설계', 'b8_design'], ['제작', 'b8_make'], ['신청', 'b8_apply'], ['컨설팅', 'b8_consult']]
  sec(b, `
    <div class="big" id="s8-t">${lines(['보통은 따로따로,', '<em class="orange">저희는 한 번에</em>'])}</div>
    <div class="sep" id="s8-l"><span class="tag">컨설팅 회사</span><p>벤처인증</p></div>
    <div class="sep r" id="s8-r"><span class="tag">개발사</span><p>MVP</p></div>
    <div class="merged" id="s8-m"><div class="mlogo"><img src="assets/logo.png" alt=""></div>
      <div class="msteps">${steps.map(([s], i) => `<span id="s8-s${i}"><i>${i + 1}</i>${s}</span>`).join('')}</div></div>
    <div class="stamp small" id="s8-once">한 번에</div>`)
  fade(b); reveal('#s8-t .ln:nth-child(1) > span', START[b] + 0.15)
  rise('#s8-l', K('b8_con') - 0.2); rise('#s8-r', K('b8_dev') - 0.2)
  const mg = K('b8_design') - 0.35
  reveal('#s8-t .ln:nth-child(2) > span', mg)
  tw(`tl.to('#s8-l', { x: 200, opacity: 0, duration: 0.4, ease: 'power2.in' }, ${r2(mg)});`)
  tw(`tl.to('#s8-r', { x: -200, opacity: 0, duration: 0.4, ease: 'power2.in' }, ${r2(mg)});`)
  tw(`tl.from('#s8-m', { scale: 0.85, opacity: 0, duration: 0.45, ease: 'back.out(1.6)' }, ${r2(mg + 0.3)});`)
  steps.forEach(([, k], i) => pop(`#s8-s${i}`, K(k) - 0.05))
  tw(`tl.from('#s8-once', { scale: 2.2, opacity: 0, rotation: -18, duration: 0.4, ease: 'power3.out' }, ${r2(K('b8_once') - 0.05)});`)
}
// 9) 대충 아님 — 실제 데모 3개
{
  const b = 9
  const D = [['pawbeauty', 'PawBeauty', '동네 반려동물 미용실', '예약·재방문 관리 플랫폼'], ['insightai', 'InsightAI', '회계·경영 자문 사무소', 'AI 경영데이터 분석 서비스'], ['stylecheck', 'StyleCheck AI', '옷가게·의류 쇼핑몰', 'AI 코디 점검 서비스']]
  const vph = 520
  const m = meta.pawbeauty
  const cx = r2((m.click.x + m.click.width / 2) * SC), cy = r2((m.click.y + m.click.height / 2) * SC)
  sec(b, `
    <div class="big" id="s9-t">${lines(['대충 만들지 않아요', '<em class="peach">실제로 이렇게 작동해요</em>'])}</div>
    ${D.map(([s, , f, t], i) => `<div class="dlabel" id="s9-l${i}"><span class="lbl">지금 하는 사업</span>${esc(f)}<p><em class="orange">→</em> ${esc(t)}</p></div>`).join('')}
    <div class="abs" style="left:60px;top:680px"><div class="browser" id="s9-b" style="width:${BW}px"><div class="bar"><i></i><i></i><i></i>${D.map(([, n], i) => `<span class="url" id="s9-u${i}">${esc(n)} · 미래AI랩 자체 데모</span>`).join('')}</div><div class="vp" style="height:${vph}px">
      <img class="shot" id="s9-h0" src="assets/shots/pawbeauty-home.jpg" style="width:${BW}px" alt="">
      <img class="shot" id="s9-i0" src="assets/shots/pawbeauty-inner.jpg" style="width:${BW}px" alt="">
      <img class="shot" id="s9-h1" src="assets/shots/insightai-home.jpg" style="width:${BW}px" alt="">
      <img class="shot" id="s9-h2" src="assets/shots/stylecheck-inner.jpg" style="width:${BW}px" alt="">
      <div class="ripple" id="s9-r" style="left:${cx}px;top:${cy}px"></div>${CURSOR('s9-cur')}</div></div></div>
    ${PHONE('s9-p0', 'pawbeauty-mob.jpg', 'dm')}${PHONE('s9-p1', 'insightai-mob.jpg', 'dm')}${PHONE('s9-p2', 'stylecheck-mob.jpg', 'dm')}`)
  fade(b); reveal('#s9-t .ln:nth-child(1) > span', START[b] + 0.15)
  reveal('#s9-t .ln:nth-child(2) > span', K('b9_works') - 0.6)
  tw(`tl.set(['#s9-i0', '#s9-h1', '#s9-h2', '#s9-l1', '#s9-l2', '#s9-u1', '#s9-u2', '#s9-p1', '#s9-p2'], { opacity: 0 }, ${START[b]});`)
  rise('#s9-l0', START[b] + 0.3); rise('#s9-b', START[b] + 0.35); rise('#s9-p0', START[b] + 0.5)
  tw(`tl.to('#s9-p0-img', { y: -500, duration: 4.5, ease: 'power1.inOut' }, ${r2(START[b] + 0.6)});`)
  const ck = K('b9_works') - 0.2
  tw(`tl.fromTo('#s9-cur', { x: ${BW - 260}, y: ${vph - 80}, opacity: 0 }, { opacity: 1, duration: 0.15 }, ${r2(ck - 0.9)});`)
  tw(`tl.to('#s9-cur', { x: ${r2(cx - 6)}, y: ${r2(cy - 4)}, duration: 0.75, ease: 'power2.inOut' }, ${r2(ck - 0.8)});`)
  tw(`tl.fromTo('#s9-r', { scale: 0.3, opacity: 0.95 }, { scale: 1.7, opacity: 0, duration: 0.45 }, ${r2(ck)});`)
  tw(`tl.to('#s9-i0', { opacity: 1, duration: 0.25 }, ${r2(ck + 0.2)});`)
  tw(`tl.to('#s9-cur', { opacity: 0, duration: 0.2 }, ${r2(ck + 0.3)});`)
  // 말에 맞춰 화면 바꾸기: 미용실 → 회계 사무소 → 옷가게
  ;[['b9_acct', 1], ['b9_cloth', 2]].forEach(([k, i]) => {
    const t = K(k) - 0.1
    tw(`tl.to(['#s9-l${i - 1}', '#s9-u${i - 1}', '#s9-p${i - 1}'], { opacity: 0, duration: 0.18 }, ${r2(t)});`)
    tw(`tl.to(['#s9-l${i}', '#s9-u${i}', '#s9-p${i}', '#s9-h${i}'], { opacity: 1, duration: 0.2 }, ${r2(t)});`)
    tw(`tl.to('#s9-p${i}-img', { y: -300, duration: 1.6, ease: 'power1.out' }, ${r2(t)});`)
  })
  tw(`tl.to('#s9-h1', { y: -120, duration: 1.2, ease: 'power1.out' }, ${r2(K('b9_acct'))});`)
  tw(`tl.to('#s9-h2', { y: -160, duration: 1.6, ease: 'power1.out' }, ${r2(K('b9_cloth'))});`)
}
// 10) 개발 몰라도 OK · 요건 먼저 · 2주
{
  const b = 10
  const S = [['기술사업', '아이디어'], ['작동하는', 'MVP'], ['벤처기업확인', '신청']]
  sec(b, `
    <div class="big" id="s10-t">${lines(['개발을 몰라도', '<em class="peach">괜찮습니다</em>'])}</div>
    <span class="pro big2" id="s10-req">✓ 벤처 요건부터 먼저 확인</span>
    <div class="two" id="s10-two"><b>2주</b><span>안에<br>끝내요</span></div>
    <div class="steps3" id="s10-st">${S.map(([a, c], i) => `<div><i>${i + 1}</i><p>${a}<br><b>${c}</b></p></div>`).join('')}</div>
    <p class="fine" id="s10-f" style="top:1215px">*2주는 자료 준비와 결정이 원활할 때의 목표 일정이에요.</p>`)
  fade(b); reveal('#s10-t .ln > span', START[b] + 0.15)
  pop('#s10-req', K('b10_req') - 0.1)
  tw(`tl.from('#s10-two b', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.8)', transformOrigin: '0% 70%' }, ${r2(K('b10_2w') - 0.15)});`)
  rise('#s10-two span', K('b10_2w') + 0.1)
  tw(`tl.from('#s10-st > div', { y: 30, opacity: 0, duration: 0.35, ease: 'power2.out', stagger: 0.14 }, ${r2(K('b10_2w') + 0.35)});`)
  rise('#s10-f', K('b10_2w') + 0.8)
}
// 11) 가격
{
  const b = 11
  sec(b, `
    <span class="hotpill" id="s11-c">런칭 기념 · 선착순 5개사</span>
    <p class="was" id="s11-was"><span>정상가</span> 500만원<i id="s11-x"></i></p>
    <p class="now" id="s11-now">300만원</p>
    <p class="incl" id="s11-in">작동하는 MVP + 벤처기업확인 신청</p>`)
  fade(b)
  pop('#s11-c', K('b11_first') - 0.15)
  rise('#s11-was', K('b11_500') - 0.3)
  tw(`tl.from('#s11-x', { scaleX: 0, duration: 0.35, ease: 'power2.inOut', transformOrigin: '0% 50%' }, ${r2(K('b11_500') + 0.45)});`)
  tw(`tl.from('#s11-now', { scale: 0.4, opacity: 0, duration: 0.55, ease: 'back.out(1.7)' }, ${r2(K('b11_300') - 0.1)});`)
  rise('#s11-in', K('b11_300') + 0.8)
}
// 12) 상담
{
  const b = 12
  sec(b, `
    <div class="big center" id="s12-t">${lines(['우리 회사도', '<em class="peach">될까요?</em>'])}</div>
    <div class="cta" id="s12-btn">무료 상담 받기 <span>→</span></div>
    <p class="url2" id="s12-url">miraeailab.com</p>
    <div class="clogo" id="s12-logo"><img src="assets/logo.png" alt="미래에이아이랩"></div>
    <p class="fine center" id="s12-f" style="top:1190px">2주는 자료 준비와 결정이 원활할 때의 목표 일정이에요.<br>벤처기업확인 여부는 확인기관 심사로 정해집니다.<br>영상 속 화면은 미래AI랩 자체 데모이며 고객사 사례가 아니에요.</p>`)
  tw(`tl.fromTo('#s12', { opacity: 0 }, { opacity: 1, duration: 0.22 }, ${START[b]});`)
  reveal('#s12-t .ln > span', START[b] + 0.1)
  pop('#s12-btn', START[b] + 0.5)
  tw(`tl.to('#s12-btn', { scale: 1.05, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, ${r2(K('b12_now'))});`)
  rise('#s12-url', START[b] + 0.9); rise('#s12-logo', START[b] + 1.1); rise('#s12-f', START[b] + 1.3)
}
// 자막 — 두 줄 안에서 가운데 가까운 띄어쓰기로 끊는다
// 쉼표 뒤를 먼저 고르고, '한 번에'·'내세울 수'처럼 한 글자 낱말이 떨어지는 자리는 피한다
const splitAt = (t) => {
  const words = t.split(' ')
  const mid = t.length / 2
  let best = null, pos = 0
  for (let i = 0; i < words.length - 1; i++) {
    pos += words[i].length
    let score = Math.abs(pos - mid)
    if (/[,.?]$/.test(words[i])) score -= 6
    if (words[i].length === 1 || words[i + 1].length === 1) score += 8
    if (!best || score < best.score) best = { pos, score }
    pos += 1
  }
  return best ? best.pos : -1
}
// 자동으로 끊으면 어색한 자막은 끊을 곳을 직접 정한다(' / ')
const BREAKS = [
  '요건을 갖춘 창업 기업은 / 법인세·소득세를',
  '아이디어가 있으면 / 그 아이디어로,',
  '없으면 9년 차 / 경영컨설턴트가',
  '매출로 이어지는 / 성장 방안까지 짜서,',
  '정책자금, 정부지원사업 / 준비 중이신가요?',
]
const twoLines = (t) => {
  const manual = BREAKS.find((x) => x.replace(' / ', ' ') === t)
  if (manual) return manual.split(' / ').map(esc).join('<br>')
  if (t.length <= 15) return esc(t)
  const sp = splitAt(t)
  return sp > 0 ? `${esc(t.slice(0, sp))}<br>${esc(t.slice(sp + 1))}` : esc(t)
}
if (process.argv.includes('--subs')) { T.cues.forEach((c) => console.log(twoLines(c.text).replace('<br>', ' / '))); process.exit(0) }
let subs = ''
T.cues.forEach((c, i) => {
  subs += `<div class="clip sub" id="sub${i}" data-start="${c.start}" data-duration="${r2(c.end - c.start)}" data-track-index="9"><span>${twoLines(c.text)}</span></div>`
  tw(`tl.from('#sub${i} span', { y: 12, opacity: 0, duration: 0.14, ease: 'power1.out' }, ${c.start});`)
})
tw(`tl.fromTo('#prog i', { scaleX: 0 }, { scaleX: 1, duration: ${TOTAL}, ease: 'none' }, 0);`)

const doc = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="assets/gsap.min.js"></script>
<style>
${[['Medium', 500], ['SemiBold', 600], ['Bold', 700], ['ExtraBold', 800], ['Black', 900]].map(([n, w]) => `@font-face { font-family: 'Pretendard'; src: url('assets/fonts/Pretendard-${n}.subset.woff2') format('woff2'); font-weight: ${w}; font-display: block; }`).join('\n')}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #171B20; }
#root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #171B20; color: #fff; font-family: 'Pretendard', sans-serif; word-break: keep-all; }
em { font-style: normal; } .peach { color: #E8B89A; } .orange { color: #E8894F; }
.glow1 { position: absolute; right: -300px; top: -260px; width: 900px; height: 900px; border-radius: 50%; background: radial-gradient(circle, rgba(212,122,74,.32), rgba(212,122,74,0) 66%); }
.glow2 { position: absolute; left: -300px; top: 900px; width: 820px; height: 820px; border-radius: 50%; background: radial-gradient(circle, rgba(232,184,154,.10), rgba(232,184,154,0) 66%); }
.clip { position: absolute; inset: 0; }
.abs { position: absolute; }
.brand { position: absolute; top: 120px; left: 60px; right: 60px; height: 70px; display: flex; align-items: center; justify-content: space-between; z-index: 30; }
.brand .logo { height: 70px; padding: 11px 20px; background: #fff; border-radius: 16px; display: flex; align-items: center; }
.brand .logo img { height: 48px; }
.brand .tag2 { font-size: 30px; font-weight: 800; color: #E8B89A; display: flex; align-items: center; gap: 10px; }
.brand .tag2::before { content: ''; width: 11px; height: 11px; border-radius: 50%; background: #D47A4A; }
.big { position: absolute; left: 60px; right: 50px; top: 240px; font-size: 96px; font-weight: 900; line-height: 1.16; letter-spacing: -0.035em; }
.big.center { text-align: center; left: 0; right: 0; top: 330px; font-size: 112px; }
.ln { overflow: hidden; padding-bottom: 6px; } .ln > span { display: inline-block; }
.fine { position: absolute; left: 70px; right: 70px; font-size: 26px; font-weight: 500; line-height: 1.5; color: #7C8591; }
.fine.center { text-align: center; }
.tag { display: inline-flex; align-items: center; height: 46px; padding: 0 20px; border-radius: 999px; font-size: 26px; font-weight: 800; color: #E8B89A; box-shadow: inset 0 0 0 2px rgba(232,184,154,.45); }
/* 확인서 그림 */
.cert { position: absolute; width: 300px; height: 390px; padding: 12px; border-radius: 14px; background: #FBF7EE; box-shadow: 0 24px 60px rgba(0,0,0,.5); }
.cert-in { position: relative; width: 100%; height: 100%; border: 5px double #C9A45C; border-radius: 8px; padding: 26px 22px; color: #3A2F1E; }
.cert-k { font-size: 16px; font-weight: 700; color: #A89A80; }
.cert-t { margin: 16px 0 22px; font-size: 44px; font-weight: 900; line-height: 1.12; letter-spacing: -0.02em; }
.cert-in i { display: block; height: 12px; margin-bottom: 14px; border-radius: 6px; background: #E6DDCB; }
.cert-seal { position: absolute; right: 18px; bottom: 18px; width: 76px; height: 76px; border-radius: 50%; background: #D47A4A; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px rgba(212,122,74,.25); }
.cert-seal svg { width: 40px; height: 40px; }
.cert.sm { left: 40px; top: 45px; transform: scale(.8); transform-origin: 0 0; }
.cert.md { left: 110px; top: 690px; }
/* 폰 그림 */
.phone { position: absolute; width: 230px; height: 480px; padding: 9px; border-radius: 38px; background: #0E1114; box-shadow: 0 30px 70px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.14); }
.phone .screen { width: 100%; height: 100%; border-radius: 30px; overflow: hidden; background: #fff; position: relative; }
.phone .mob { position: absolute; left: 0; top: 0; width: ${MOBW}px; display: block; }
.phone .blank { width: 100%; height: 100%; background: #F2F3F5; padding: 40px 20px; display: flex; flex-direction: column; gap: 14px; }
.phone .blank i { display: block; height: 70px; border-radius: 14px; border: 3px dashed #C5CAD1; }
.phone .blank b { margin-top: auto; text-align: center; font-size: 28px; font-weight: 900; color: #AEB6C0; }
.phone.sm { left: 55px; top: 40px; transform: scale(.72); transform-origin: 0 0; }
.phone.md { left: 640px; top: 600px; }
.phone.lg { left: 600px; top: 560px; width: 300px; height: 620px; } .phone.lg .mob { width: 282px; }
.phone.dm { left: 800px; top: 830px; z-index: 6; }
.plus { position: absolute; left: 460px; top: 790px; width: 130px; text-align: center; font-size: 120px; font-weight: 900; color: #E8894F; }
.badge { position: absolute; left: 290px; top: 700px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #F0A06E, #D47A4A 70%); box-shadow: 0 0 0 18px rgba(212,122,74,.22), 0 40px 90px rgba(0,0,0,.5); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; z-index: 5; }
.badge svg { width: 130px; height: 130px; } .badge b { font-size: 92px; font-weight: 900; color: #171B20; letter-spacing: -0.03em; }
/* 1) 두 고객 */
.who { position: absolute; left: 60px; width: 960px; height: 420px; border-radius: 34px; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.who-txt { position: absolute; left: 330px; right: 40px; top: 70px; }
.who-txt p { margin-top: 22px; font-size: 52px; font-weight: 800; line-height: 1.3; color: #D5DAE0; }
.who-txt p b { color: #fff; font-weight: 900; }
.qm { position: absolute; left: 250px; top: 24px; width: 86px; height: 86px; border-radius: 50%; background: #E8894F; color: #171B20; font-size: 60px; font-weight: 900; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,.4); z-index: 3; }
.stamp { position: absolute; left: 0; right: 0; margin: 0 auto; top: 1170px; width: max-content; padding: 26px 56px; border-radius: 999px; background: #D47A4A; color: #171B20; font-size: 72px; font-weight: 900; box-shadow: 0 24px 60px rgba(212,122,74,.45); }
.stamp em { color: #fff; }
.stamp.small { top: auto; bottom: 690px; left: auto; right: 90px; margin: 0; padding: 18px 40px; font-size: 56px; transform: rotate(-6deg); }
/* 3) 혜택 */
.grid4 { position: absolute; left: 60px; right: 60px; top: 560px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.bcard { height: 300px; padding: 34px 32px; border-radius: 30px; background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.bic { display: inline-flex; width: 76px; height: 76px; border-radius: 22px; background: rgba(212,122,74,.18); color: #E8B89A; align-items: center; justify-content: center; }
.bic svg { width: 46px; height: 46px; }
.ba { margin-top: 26px; font-size: 42px; font-weight: 900; letter-spacing: -0.02em; }
.bb { margin-top: 8px; font-size: 40px; font-weight: 700; color: #C9CED6; } .bb b { color: #E8894F; font-weight: 900; font-size: 50px; }
/* 4) */
.nope { position: absolute; left: 60px; right: 60px; top: 575px; height: 190px; padding: 0 40px; border-radius: 28px; background: #2A2F36; display: flex; align-items: center; gap: 30px; color: #8A939C; }
.nope .doclines { width: 120px; } .nope .doclines i { display: block; height: 12px; margin: 10px 0; border-radius: 6px; background: #48505A; }
.nope p { font-size: 50px; font-weight: 800; }
.nope .x { margin-left: auto; width: 96px; height: 96px; border-radius: 50%; background: #C8514A; color: #fff; font-size: 56px; font-weight: 900; display: flex; align-items: center; justify-content: center; }
.okpill { position: absolute; right: 60px; top: 760px; padding: 18px 34px; border-radius: 999px; background: #2E9E6A; color: #fff; font-size: 42px; font-weight: 900; box-shadow: 0 18px 40px rgba(0,0,0,.45); z-index: 8; }
.browser { border-radius: 22px; overflow: hidden; background: #fff; box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08); position: relative; }
.bar { height: 46px; background: #EEF0F3; display: flex; align-items: center; gap: 8px; padding: 0 18px; border-bottom: 1px solid #DDE1E6; position: relative; }
.bar i { width: 13px; height: 13px; border-radius: 50%; background: #F2A0A0; } .bar i:nth-child(2) { background: #F5D07A; } .bar i:nth-child(3) { background: #8FD6A8; }
.bar .url { position: absolute; left: 100px; height: 30px; padding: 0 14px; border-radius: 8px; background: #fff; font-size: 20px; font-weight: 700; color: #343B44; display: flex; align-items: center; top: 8px; }
.vp { position: relative; overflow: hidden; background: #fff; }
.shot { position: absolute; left: 0; top: 0; display: block; }
.cursor { position: absolute; left: 0; top: 0; z-index: 5; filter: drop-shadow(0 3px 6px rgba(0,0,0,.35)); }
.ripple { position: absolute; width: 96px; height: 96px; margin: -48px 0 0 -48px; border-radius: 50%; border: 5px solid #D47A4A; background: rgba(212,122,74,.18); opacity: 0; z-index: 4; }
/* 5) */
.row { position: absolute; left: 60px; right: 60px; height: 180px; padding: 30px 40px; border-radius: 30px; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.row p { margin-top: 18px; font-size: 52px; font-weight: 800; color: #D5DAE0; } .row p b { color: #fff; font-weight: 900; }
.row.hot { height: 250px; background: rgba(212,122,74,.12); box-shadow: inset 0 0 0 3px rgba(212,122,74,.6); }
.row.hot p b { color: #E8894F; }
.chips { position: absolute; left: 40px; bottom: 26px; display: flex; gap: 14px; }
.chips span { padding: 8px 22px; border-radius: 999px; background: #D47A4A; color: #171B20; font-size: 30px; font-weight: 900; }
.pro { position: absolute; right: 80px; top: 752px; padding: 14px 26px; border-radius: 999px; background: #E8B89A; color: #171B20; font-size: 30px; font-weight: 900; box-shadow: 0 14px 30px rgba(0,0,0,.4); z-index: 4; }
.pro.big2 { right: auto; left: 60px; top: 560px; font-size: 40px; padding: 18px 34px; background: #2E9E6A; color: #fff; }
/* 6) */
.stack { position: absolute; left: 0; right: 0; top: 640px; height: 560px; }
.plan { position: absolute; left: 330px; top: 0; width: 420px; height: 520px; padding: 40px 34px; border-radius: 22px; background: #F4F1EC; color: #343B44; box-shadow: 0 20px 50px rgba(0,0,0,.45); transform-origin: 50% 90%; }
.plan p { font-size: 40px; font-weight: 900; margin-bottom: 16px; }
.plan .aitag { display: inline-block; margin-bottom: 26px; padding: 6px 16px; border-radius: 999px; background: #DAD4C9; font-size: 22px; font-weight: 800; color: #6B6458; }
.plan i { display: block; height: 16px; border-radius: 8px; background: #D9D4CC; margin-bottom: 20px; }
.grey { position: absolute; left: 0; right: 0; margin: 0 auto; top: 1150px; width: max-content; padding: 20px 44px; border-radius: 999px; background: #3A4048; color: #E5E8EC; font-size: 50px; font-weight: 900; box-shadow: 0 18px 40px rgba(0,0,0,.4); z-index: 5; }
.stack.mini { left: 40px; right: auto; width: 520px; top: 640px; }
.stack.mini .plan { left: 40px; transform-origin: 50% 90%; opacity: .55; filter: grayscale(1); }
.chip { position: absolute; padding: 16px 30px; border-radius: 999px; font-size: 38px; font-weight: 900; box-shadow: 0 14px 34px rgba(0,0,0,.45); z-index: 8; }
.chip.c1 { left: 480px; top: 580px; background: #E8B89A; color: #171B20; }
.chip.c2 { left: 430px; top: 1150px; background: #D47A4A; color: #171B20; }
#s7-t2 { opacity: 0; }
.aichip { position: absolute; right: 70px; top: 520px; padding: 16px 32px; border-radius: 999px; background: #2F6FED; color: #fff; font-size: 44px; font-weight: 900; box-shadow: 0 16px 36px rgba(0,0,0,.45); z-index: 7; }
.official { position: absolute; left: 60px; right: 60px; top: 1090px; padding: 22px 30px; border-radius: 22px; background: #10161D; box-shadow: inset 0 0 0 2px rgba(143,214,168,.55); }
.official .otag { display: inline-block; padding: 5px 14px; border-radius: 999px; background: #2E9E6A; color: #fff; font-size: 22px; font-weight: 900; }
.official p { margin-top: 10px; font-size: 32px; font-weight: 700; line-height: 1.3; color: #C9CED6; } .official p b { color: #fff; font-weight: 900; }
.official small { display: block; margin-top: 6px; font-size: 22px; color: #7C8591; }
/* 8) */
.sep { position: absolute; left: 60px; top: 580px; width: 455px; height: 320px; padding: 40px 36px; border-radius: 30px; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.sep.r { left: 565px; }
.sep p { margin-top: 40px; font-size: 76px; font-weight: 900; letter-spacing: -0.03em; }
.merged { position: absolute; left: 60px; right: 60px; top: 580px; height: 600px; padding: 44px; border-radius: 34px; background: rgba(212,122,74,.12); box-shadow: inset 0 0 0 3px rgba(212,122,74,.65); }
.mlogo { width: 400px; padding: 14px 22px; border-radius: 18px; background: #fff; } .mlogo img { width: 100%; display: block; }
.msteps { margin-top: 44px; display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
.msteps span { display: flex; align-items: center; gap: 18px; height: 130px; padding: 0 30px; border-radius: 24px; background: rgba(255,255,255,.07); font-size: 56px; font-weight: 900; }
.msteps i { width: 62px; height: 62px; border-radius: 50%; background: #D47A4A; color: #171B20; font-style: normal; font-size: 32px; display: flex; align-items: center; justify-content: center; }
/* 9) */
.dlabel { position: absolute; left: 60px; right: 60px; top: 505px; font-size: 40px; font-weight: 700; color: #AEB6C0; }
.dlabel .lbl { display: inline-block; margin-right: 14px; padding: 6px 16px; border-radius: 999px; font-size: 26px; font-weight: 800; color: #E8B89A; box-shadow: inset 0 0 0 2px rgba(232,184,154,.45); vertical-align: 6px; }
.dlabel p { margin-top: 8px; font-size: 60px; font-weight: 900; color: #fff; letter-spacing: -0.03em; }
/* 10) */
.two { position: absolute; left: 60px; top: 690px; display: flex; align-items: flex-end; gap: 30px; }
.two b { font-size: 250px; font-weight: 900; line-height: .9; letter-spacing: -0.05em; color: #E8894F; }
.two span { font-size: 70px; font-weight: 900; line-height: 1.15; padding-bottom: 16px; }
.steps3 { position: absolute; left: 60px; right: 60px; top: 1000px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.steps3 > div { height: 190px; padding: 22px 20px; border-radius: 24px; background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.steps3 i { display: inline-flex; width: 50px; height: 50px; border-radius: 50%; background: #D47A4A; color: #171B20; font-style: normal; font-size: 28px; font-weight: 900; align-items: center; justify-content: center; }
.steps3 p { margin-top: 14px; font-size: 32px; font-weight: 700; line-height: 1.3; color: #C9CED6; } .steps3 p b { color: #fff; font-weight: 900; }
/* 11) */
.hotpill { position: absolute; left: 0; right: 0; margin: 0 auto; top: 330px; width: max-content; padding: 20px 44px; border-radius: 999px; background: #D47A4A; color: #171B20; font-size: 50px; font-weight: 900; }
.was { position: absolute; left: 0; right: 0; top: 560px; margin: 0 auto; width: max-content; font-size: 130px; font-weight: 900; color: #8A939C; letter-spacing: -0.03em; }
.was span { font-size: 50px; vertical-align: 30px; margin-right: 8px; }
.was i { position: absolute; left: -8px; right: -8px; top: 54%; height: 12px; border-radius: 6px; background: #E8894F; }
.now { position: absolute; left: 0; right: 0; top: 760px; text-align: center; font-size: 280px; font-weight: 900; line-height: 1; letter-spacing: -0.05em; color: #E8894F; }
.incl { position: absolute; left: 0; right: 0; top: 1110px; text-align: center; font-size: 44px; font-weight: 800; color: #E5E8EC; }
/* 12) */
.cta { position: absolute; left: 110px; right: 110px; top: 700px; height: 180px; border-radius: 40px; background: #D47A4A; color: #171B20; font-size: 76px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 20px; box-shadow: 0 30px 80px rgba(212,122,74,.45); }
.url2 { position: absolute; left: 0; right: 0; top: 920px; text-align: center; font-size: 50px; font-weight: 800; color: #E8B89A; }
.clogo { position: absolute; left: 50%; top: 1010px; width: 460px; margin-left: -230px; padding: 16px 26px; border-radius: 22px; background: #fff; } .clogo img { width: 100%; display: block; }
/* 자막 · 진행 막대 */
.sub { display: flex; align-items: flex-end; justify-content: center; padding: 0 70px 420px; z-index: 40; }
.sub span { max-width: 900px; padding: 18px 34px; border-radius: 22px; background: rgba(8,10,13,.88); font-size: 54px; font-weight: 800; line-height: 1.32; text-align: center; }
.foot { position: absolute; left: 70px; right: 70px; top: 1660px; text-align: center; font-size: 28px; font-weight: 700; color: #6B7680; z-index: 2; }
#prog { position: absolute; left: 70px; right: 70px; top: 1730px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.12); overflow: hidden; z-index: 2; }
#prog i { display: block; width: 100%; height: 100%; background: #D47A4A; transform-origin: 0 50%; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
  <div class="glow1"></div><div class="glow2"></div>
  <div class="brand"><span class="logo"><img src="assets/logo.png" alt="미래에이아이랩"></span><span class="tag2">2주 기술사업 빌드</span></div>
  <p class="foot">miraeailab.com · 벤처인증 + 작동하는 MVP</p><div id="prog"><i></i></div>
  ${html}
  ${subs}
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
${js}
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
</body>
</html>
`
writeFileSync(new URL('./index.html', import.meta.url), doc)
const ts = (x) => { const ms = Math.round(x * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}` }
writeFileSync(new URL('./subtitles.srt', import.meta.url), T.cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n'))
console.log('index.html · subtitles.srt', 'TOTAL', TOTAL, 's', 'scenes', Object.entries(START).map(([b, s]) => `${b}:${s}`).join(' '))
