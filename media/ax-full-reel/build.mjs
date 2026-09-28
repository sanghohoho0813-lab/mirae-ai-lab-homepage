// AX 풀 구축 소개 영상(릴스 9:16) — timing.json(문장·핵심 단어 시간) → index.html(HyperFrames) + subtitles.srt
// 흐름: 문제 제기(대표님 상황 4가지) → 심사장 장면 → 회사 안 → 잘 받는 회사의 특징(250곳 조사) → 사례 이야기·몽타주
//      → 정책 방향(공식 근거) → 회사의 안(AX)과 밖(고객 예약)을 실제 데모로 잇기 → 처음 고민이 답으로 → 우리 근거 → 진행 → 인증
//      → 심사장으로 돌아와 닫기 → 끝 화면(업종별 AX 12개). 장면 전환·강조는 모두 말(핵심 단어) 시간에 맞춘다.
// ⚠️ 사례는 '공개 사례 요약 · 미래AI랩 실적 아님', 정책은 '공식 근거' 상자로 따로. 인증은 '신청까지', 특허는 '출원'만.
import { readFileSync, writeFileSync } from 'node:fs'

const W = 1080, H = 1920
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url), 'utf8'))
const FLOWS = JSON.parse(readFileSync(new URL('./assets/flows/flows.json', import.meta.url), 'utf8'))
const r2 = (n) => Math.round(n * 100) / 100
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const L = (b, l = 1) => T.lines.find((x) => x.block === b && x.line === l)
const K = (id) => { if (!(id in T.keys)) throw new Error('no key ' + id); return T.keys[id] }
const NB = 13
const START = {}
for (let b = 1; b <= NB; b++) START[b] = b === 1 ? 0 : r2(L(b).start - 0.25)
const END_START = r2(T.audioEnd + 0.4)
const TOTAL = r2(END_START + 5.0)  // 끝 화면 5초(소리 없음)
const END = (b) => (b === NB ? END_START : START[b + 1])
const lastLine = (b) => T.lines.filter((x) => x.block === b).pop()

let html = '', js = ''
const tw = (c) => { js += `  ${c}\n` }
const sec = (b, inner, cls = '') => { html += `<section class="clip scene ${cls}" id="s${b}" data-start="${START[b]}" data-duration="${r2(END(b) - START[b])}" data-track-index="1">${inner}</section>\n` }
const fade = (b) => {
  if (b > 1) tw(`tl.fromTo('#s${b}', { opacity: 0 }, { opacity: 1, duration: 0.22 }, ${START[b]});`)
  tw(`tl.to('#s${b}', { opacity: 0, duration: 0.18 }, ${r2(END(b) - 0.18)});`)
}
const lines = (arr) => arr.map((l) => `<div class="ln"><span>${l}</span></div>`).join('')
const reveal = (sel, at, stagger = 0.12) => tw(`tl.from('${sel}', { yPercent: 110, duration: 0.5, ease: 'power3.out', stagger: ${stagger} }, ${r2(at)});`)
const rise = (sel, at, extra = '') => tw(`tl.from('${sel}', { y: 36, opacity: 0, duration: 0.42, ease: 'power2.out'${extra} }, ${r2(at)});`)
const pop = (sel, at) => tw(`tl.from('${sel}', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, ${r2(at)});`)
const slam = (sel, at) => tw(`tl.from('${sel}', { scale: 1.18, opacity: 0, duration: 0.3, ease: 'back.out(1.4)' }, ${r2(at)});`)
const dim = (sel, at, to = 0.3) => tw(`tl.to('${sel}', { opacity: ${to}, duration: 0.3 }, ${r2(at)});`)

// ── 그림 조각
const ICON = {
  excel: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#1F7A4D"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="#F2C94C"/><circle cx="9" cy="10.5" r="1.2" fill="#3A3000"/><circle cx="12.5" cy="10.5" r="1.2" fill="#3A3000"/><circle cx="16" cy="10.5" r="1.2" fill="#3A3000"/></svg>',
  memo: '<svg viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5z" fill="#FFF3B0"/><path d="M8 9h8M8 13h8M8 17h5" stroke="#9A8A3A" stroke-width="1.6" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  coin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#E8B84A"/><text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="900" fill="#7A5A10">₩</text></svg>',
  door: '<svg viewBox="0 0 24 24"><path d="M5 21V4h9v17" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 12h7M18 9l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M3 6l7 7 4-4 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 11v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M20 4h-4a2 2 0 0 0-2 2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 8h4M6.5 11h4M6.5 14h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 7 18z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  apps: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity=".6"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity=".6"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/></svg>',
  bank: '<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}
const ic = (k, cls = '') => `<i class="ic ${cls}">${ICON[k]}</i>`
const CURSOR = (id) => `<svg class="cursor" id="${id}" viewBox="0 0 24 24" width="44" height="44"><path d="M4 2.5 L4 19 L8.6 14.8 L11.6 21.4 L14.4 20.2 L11.4 13.7 L17.6 13.4 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`

// ── 실제로 눌러 가는 폰 흐름. flows.json 에 단계별 누른 위치(원래 390px 화면 기준)와 '누르기 직전(a)' 화면 여부가 있다.
const nn = (x) => String(x).padStart(2, '0')
const hasA = (name, st) => (FLOWS[name].a || []).includes(st)
const flowLayer = (id, name, steps, width) => steps.map((st) =>
  (hasA(name, st) ? `<img class="fimg" id="${id}-${name}-${nn(st)}a" src="assets/flows/${name}-${nn(st)}a.jpg" style="width:${width}px;opacity:0" alt="">` : '') +
  `<img class="fimg" id="${id}-${name}-${nn(st)}" src="assets/flows/${name}-${nn(st)}.jpg" style="width:${width}px;opacity:0" alt="">`).join('')
const touchLayer = (id, name, steps, sc) => steps.filter((st) => FLOWS[name].taps[st]).map((st) => {
  const t = FLOWS[name].taps[st]
  return `<span class="touch" id="${id}-${name}-t${st}" style="left:${r2(t.x * sc)}px;top:${r2(t.y * sc)}px"></span>`
}).join('')
// 한 단계: 누르기 직전 화면(a) → 누른 자리 동그라미 → 0.2초 뒤 다음 화면. a 가 없는 단계(입력·스크롤)는 다음 화면만 바꾼다
const stepAt = (id, name, st, t) => {
  if (hasA(name, st)) tw(`tl.set('#${id}-${name}-${nn(st)}a', { opacity: 1 }, ${r2(t)});`)
  if (FLOWS[name].taps[st]) tw(`tl.fromTo('#${id}-${name}-t${st}', { scale: 0.4, opacity: 0.95 }, { scale: 1.5, opacity: 0, duration: 0.36, ease: 'power2.out', immediateRender: false }, ${r2(t + 0.04)});`)
  tw(`tl.to('#${id}-${name}-${nn(st)}', { opacity: 1, duration: 0.12 }, ${r2(t + (hasA(name, st) ? 0.2 : 0))});`)
}
const PHONE = (id, cls, sw, inner) => `<div class="phone ${cls}" id="${id}"><div class="screen" style="width:${sw}px">${inner}</div></div>`
const IMG = (src, width, extra = '') => `<img class="fimg" src="${src}" style="width:${width}px${extra}" alt="">`

// 대표님 상황 4가지 — 보내 주신 카드 디자인(큰 주황 숫자 + 세로줄 + 흰 글자, 강조는 주황)
const HOOK = [
  '정책자금이나 보증을<br>이미 받을 만큼 받아서,<br><em>새로운 성장성</em>을 설명하기 어렵다.',
  '매출은 꾸준한데, ‘그래서 <em>다음은<br>어떻게 되나요?</em>’ 앞에서<br>‘자금이 조달되면 하겠습니다’<br>외엔 할 말이 없다.',
  '새 아이디어로 투자·지원금을<br>받고 싶은데, <em>‘진짜 되는 건가요?’</em><br>앞에서 보여 줄 게 없다.',
  '사업 초기라 실적은 부족한데,<br><em>수억 원 이상의 성장자금</em>이<br>필요하다.',
]
const ANSWER = ['새로운 성장 단계를<br><b>보여 준다</b>', '이미 돌아가는 화면을<br><b>보여 준다</b>', '‘진짜 되나요?’엔<br><b>직접 눌러 보게</b>', '쌓이는 데이터를<br><b>증거로</b>']
const hookCard = (i, cls = '') => `<div class="hk ${cls}" id="${cls ? 'a' : 'h'}${i + 1}"><b class="hn">${i + 1}.</b><i class="hbar"></i><p>${HOOK[i]}</p></div>`

// 심사장 — 발표 화면 + 심사위원 3명 + 책상 (2번·13번 장면에서 같은 그림)
const ROOM = (id) => `<div class="room" id="${id}">
  <div class="screen2"><p>사업계획서 브리핑</p><i></i><i></i><i style="width:60%"></i></div>
  <div class="judges">${[0, 1, 2].map(() => `<div class="judge"><span class="jh"></span><span class="jb"></span></div>`).join('')}</div>
  <div class="desk"><span>심사위원</span></div>
</div>`

// ════════ 1) 문제 제기 — 첫 프레임부터 카드 1이 보인다
{
  const b = 1
  sec(b, `
    <div class="hstack" id="s1-stack">${HOOK.map((_, i) => hookCard(i)).join('')}</div>
    <div class="kkut" id="s1-k"><div class="kchips"><span>정부지원사업</span><span>투자</span></div><div class="stampr" id="s1-stamp">한 끗 차이</div></div>
    <div class="watch" id="s1-w">이 영상, 끝까지 봐 주세요 <span>▼</span></div>`)
  fade(b)
  tw(`tl.fromTo('#h1', { scale: 1.05 }, { scale: 1, duration: 0.45, ease: 'power2.out' }, 0);`)
  ;['h2', 'h3', 'h4'].forEach((k, i) => slam(`#h${i + 2}`, K(k) - 0.12))
  ;['h2', 'h3', 'h4'].forEach((k) => tw(`tl.fromTo('#s1-stack', { x: -10 }, { x: 0, duration: 0.25, ease: 'elastic.out(1.2, 0.3)', immediateRender: false }, ${r2(K(k) + 0.05)});`))
  dim('#s1-stack', K('h5') - 0.1, 0.28)
  pop('#s1-k .kchips span', K('h5'))
  tw(`tl.from('#s1-stamp', { scale: 2.4, opacity: 0, rotation: -24, duration: 0.35, ease: 'power3.out' }, ${r2(K('h5_kkut') - 0.05)});`)
  tw(`tl.from('#s1-w', { y: 40, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, ${r2(K('h5_end') - 0.1)});`)
  tw(`tl.to('#s1-w span', { y: 10, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: 3 }, ${r2(K('h5_end') + 0.3)});`)
}
// ════════ 2) 심사장 — "그래서, 다음은 어떻게 되나요?" "자금이 조달되면 하겠습니다." → 보여 줄 게 없다
{
  const b = 2
  sec(b, `
    <div class="big sm" id="s2-t">${lines(['왜 이렇게', '<em class="peach">막히는 걸까요?</em>'])}</div>
    ${ROOM('s2-room')}
    <div class="bub q" id="s2-q">그래서, <b>다음은 어떻게 되나요?</b></div>
    <div class="bub a" id="s2-a1">자금이 조달되면 하겠습니다…</div>
    <div class="bub a a2" id="s2-a2">지원금 받으면 하겠습니다…</div>
    <div class="nomvp" id="s2-mvp"><span class="slot">MVP <small>(최소 기능 제품)</small> · 웹앱</span><b class="x">✕</b><p>보여 줄 게 없이</p></div>
    <div class="pile" id="s2-pile">${[-12, -6, 0, 6, 12].map((r, i) => `<div class="plan" style="transform:translateX(${(i - 2) * 64}px) rotate(${r}deg)"><p>사업계획서</p><span class="aitag">AI로 작성</span><i></i><i></i><i style="width:70%"></i><i></i></div>`).join('')}<div class="plan mine" id="s2-mine"><p>우리 회사<br>사업계획서</p><i></i><i></i><i style="width:60%"></i></div></div>
    <div class="verdict" id="s2-v"><p>계획이 부족한 게 아니라,</p><p class="vb">보여 줄 게 없는 것</p></div>`)
  fade(b); reveal('#s2-t .ln > span', START[b] + 0.1)
  rise('#s2-room', START[b] + 0.3)
  pop('#s2-q', K('r_q') - 0.1)
  pop('#s2-a1', K('r_a1') - 0.1)
  pop('#s2-a2', K('r_a2') - 0.1)
  // 정적 — 심사위원 쪽이 어두워진다
  tw(`tl.to('#s2-room .judge', { opacity: 0.45, duration: 0.6 }, ${r2(K('r_a2') + 1.0)});`)
  const t4 = L(2, 4).start
  tw(`tl.to(['#s2-room', '#s2-q', '#s2-a1', '#s2-a2'], { opacity: 0, y: -30, duration: 0.35 }, ${r2(t4 - 0.1)});`)
  pop('#s2-mvp', K('r_mvp') - 0.1)
  tw(`tl.from('#s2-mvp .x', { scale: 3, opacity: 0, duration: 0.3, ease: 'power3.out' }, ${r2(K('r_mvp') + 0.4)});`)
  tw(`tl.from('#s2-pile .plan:not(.mine)', { y: 140, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08 }, ${r2(K('r_plan') - 0.3)});`)
  tw(`tl.from('#s2-mine', { y: -320, x: 260, rotation: 20, opacity: 0, duration: 0.6, ease: 'power2.in' }, ${r2(K('r_plan'))});`)
  tw(`tl.to('#s2-pile', { opacity: 0.4, filter: 'grayscale(1)', duration: 0.5 }, ${r2(K('r_same') + 0.2)});`)
  tw(`tl.to('#s2-mvp', { opacity: 0.25, duration: 0.3 }, ${r2(K('r_same') + 0.2)});`)
  pop('#s2-v', K('r_not') - 0.9)
  tw(`tl.from('#s2-v .vb', { scale: 0.7, opacity: 0, duration: 0.45, ease: 'back.out(2)' }, ${r2(K('r_not') - 0.1)});`)
}
// ════════ 3) 회사 안 — 흩어진 기록 → 쌓이면 가장 큰 자산인데 텅 빈 금고 → 새는 시간·돈 · 퇴사에 휘청 · 더 크기 어렵다
{
  const b = 3
  const SRC = [['excel', '엑셀', ['고객', '매출']], ['chat', '메신저', ['재고', '주문']], ['memo', '메모장', ['직원', '일정']]]
  sec(b, `
    <div class="big sm" id="s3-t">${lines(['더 큰 문제는', '<em class="orange">회사 안</em>에 있어요'])}</div>
    <div class="srcs" id="s3-src">${SRC.map(([k, n, ch], i) => `<div class="src" id="s3-s${i}">${ic(k, 'lg')}<b>${n}</b><div class="dots">${ch.map((c) => `<span>${c}</span>`).join('')}</div></div>`).join('')}</div>
    <div class="vault" id="s3-vault"><div class="vin">${ic('lock')}<p>회사의 가장 큰 자산</p><b>데이터</b></div><span class="empty" id="s3-empty">텅 비어 있어요</span></div>
    <div class="cons" id="s3-cons">
      <div class="con" id="s3-c1"><span class="cic">${ic('clock')}</span><p><b>매달 새는 시간 · 돈</b><small>자료를 찾고 맞추는 데</small></p><span class="coins">${[0, 1, 2].map(() => ic('coin', 'cn')).join('')}</span></div>
      <div class="con" id="s3-c2"><span class="cic">${ic('door')}</span><p><b>직원 한 명 퇴사에 휘청</b><small>일을 아는 사람만 아는 회사</small></p><span class="leave" id="s3-leave">${ic('person')}</span></div>
      <div class="con hot" id="s3-c3"><span class="cic">${ic('down')}</span><p><b>회사는 더 크기 어려워요</b></p></div>
    </div>`)
  fade(b); reveal('#s3-t .ln > span', START[b] + 0.1)
  tw(`tl.from('#s3-src .src', { y: 50, opacity: 0, rotation: (i) => [-6, 4, -3][i], duration: 0.4, ease: 'back.out(1.6)', stagger: 0.18 }, ${r2(K('c_rec') - 0.2)});`)
  tw(`tl.from('#s3-src .dots span', { scale: 0, duration: 0.25, ease: 'back.out(2)', stagger: 0.06 }, ${r2(K('c_excel'))});`)
  tw(`tl.to('#s3-src .src', { y: (i) => [-8, 10, -4][i], rotation: (i) => [-5, 4, -3][i], duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 3 }, ${r2(K('c_excel') + 0.4)});`)
  pop('#s3-vault', K('c_asset') - 0.5)
  tw(`tl.from('#s3-empty', { opacity: 0, y: 12, duration: 0.3 }, ${r2(K('c_asset') + 0.8)});`)
  const t4 = L(3, 4).start
  tw(`tl.to(['#s3-src', '#s3-vault'], { opacity: 0, y: -40, duration: 0.35 }, ${r2(t4 - 0.15)});`)
  rise('#s3-c1', t4)
  tw(`tl.from('#s3-c1 .cn', { y: -40, opacity: 0, duration: 0.5, ease: 'bounce.out', stagger: 0.15 }, ${r2(K('c_leak'))});`)
  rise('#s3-c2', K('c_quit') - 0.4)
  tw(`tl.to('#s3-leave', { x: 150, opacity: 0, duration: 0.8, ease: 'power1.in' }, ${r2(K('c_quit') + 0.2)});`)
  tw(`tl.fromTo('#s3-cons', { rotation: 0 }, { rotation: 1.4, duration: 0.08, yoyo: true, repeat: 7, ease: 'none', immediateRender: false }, ${r2(K('c_shake'))});`)
  tw(`tl.set('#s3-cons', { rotation: 0 }, ${r2(K('c_shake') + 0.7)});`)
  rise('#s3-c3', K('c_grow') - 0.5)
}
// ════════ 4) 잘 받는 회사는 뭐가 다를까? — 250곳 이상 조사 · 특징 3가지
{
  const b = 4
  const N = 252
  const tiles = Array.from({ length: N }, (_, i) => `<i style="opacity:${[0.35, 0.55, 0.8, 0.45, 0.65][(i * 7) % 5]}"></i>`).join('')
  const PIL = [['고객 데이터를', '꾸준히 쌓고'], ['새 제품 · 포털 · 플랫폼으로', '고객이 직접 쓰게 키우고'], ['회사 안 운영과', '하나로 연결']]
  sec(b, `
    <div class="big sm" id="s4-t">${lines(['잘 받는 회사는', '<em class="peach">대체 뭐가 다를까요?</em>'])}</div>
    <div class="grid250" id="s4-g">${tiles}</div>
    <div class="n250" id="s4-n"><b>250</b><span>곳 이상 조사</span></div>
    <div class="range" id="s4-r">최근 3년 · <b>수억 ~ 수백억 원</b> 융자 · 투자 유치</div>
    <div class="pils" id="s4-p">${PIL.map(([a, c], i) => `<div class="pil" id="s4-p${i}"><i>${i + 1}</i><p>${a}<br><b>${c}</b></p></div>`).join('<span class="parr">→</span>')}</div>
    <p class="fine" id="s4-f" style="top:1262px">미래AI랩 자체 조사 · 공개 자료 기준</p>`)
  fade(b); reveal('#s4-t .ln > span', START[b] + 0.1)
  tw(`tl.from('#s4-g i', { scale: 0, duration: 0.18, stagger: { each: 0.006, from: 'random' } }, ${r2(L(4, 2).start)});`)
  tw(`tl.from('#s4-r', { y: 20, opacity: 0, duration: 0.35 }, ${r2(K('f_range') - 0.1)});`)
  tw(`tl.from('#s4-n', { scale: 0.4, opacity: 0, duration: 0.45, ease: 'back.out(2)' }, ${r2(K('f_250') - 0.15)});`)
  tw(`tl.to('#s4-g', { opacity: 0.25, duration: 0.4 }, ${r2(L(4, 3).start)});`)
  ;['f_data', 'f_portal', 'f_link'].forEach((k, i) => pop(`#s4-p${i}`, K(k) - 0.15))
  tw(`tl.from('#s4-p .parr', { opacity: 0, x: -10, duration: 0.3, stagger: 0.6 }, ${r2(K('f_portal') - 0.3)});`)
  rise('#s4-f', K('f_data'))
}
// ════════ 5) 사례 하나 — 렌탈 장부를 손으로 쓰던 회사 → 클라우드 → 서비스 → 금융 · 10억 원 이상
{
  const b = 5
  const NODES = [['book', '렌탈 장부를', '손으로 쓰던 회사', 's_book'], ['cloud', '관리 방식을', '클라우드 시스템으로', 's_cloud'], ['apps', '그걸', '서비스로 키우고', 's_service'], ['bank', '사업을', '금융까지 넓혀', 's_fin']]
  sec(b, `
    <p class="case" id="s5-c">CASE · 공개 사례</p>
    <div class="big sm" id="s5-t">${lines(['사례를', '<em class="peach">하나 볼게요</em>'])}</div>
    <div class="path" id="s5-path">${NODES.map(([k, a, c], i) => `<div class="node" id="s5-n${i}">${ic(k, 'lg')}<p>${a}<br><b>${c}</b></p></div>`).join('<i class="down"></i>')}</div>
    <div class="win" id="s5-win"><small>조달</small><b>10억 원+</b></div>
    <p class="fine" id="s5-f" style="top:1262px">공개 사례 요약 · 미래AI랩 실적이 아니에요</p>`)
  fade(b); reveal('#s5-t .ln > span', START[b] + 0.1)
  tw(`tl.from('#s5-c', { opacity: 0, duration: 0.3 }, ${r2(START[b] + 0.1)});`)
  NODES.forEach(([, , , k], i) => rise(`#s5-n${i}`, K(k) - 0.3))
  tw(`tl.from('#s5-path .down', { scaleY: 0, transformOrigin: '50% 0%', duration: 0.3, stagger: 0.8 }, ${r2(K('s_cloud') - 0.6)});`)
  tw(`tl.from('#s5-win', { scale: 2.2, opacity: 0, rotation: -14, duration: 0.4, ease: 'power3.out' }, ${r2(K('s_10') - 0.1)});`)
  rise('#s5-f', K('s_book'))
}
// ════════ 6) 이런 회사는 하나가 아니었다 — 사례 몽타주 5개
{
  const b = 6
  const CASES = [
    ['부동산 중개', '공실 · 임대 관리', '자동화 플랫폼', '10억+', 'm_re'],
    ['숙박업', '예약 · 매출 관리', '운영 자동화', '10억+', 'm_stay'],
    ['히트펌프 판매', '판매', '운영·모니터링 구독', '5~9억', 'm_heat'],
    ['김 양식', '바다 양식장', '육상 자동화 · AI 모니터링', '5~9억', 'm_kim'],
    ['체형관리 스튜디오', '스튜디오', '웰니스 플랫폼', '3~4억', 'm_body'],
  ]
  sec(b, `
    <div class="big sm" id="s6-t">${lines(['이런 회사는', '<em class="peach">하나가 아니었어요</em>'])}</div>
    <div class="cases" id="s6-cs">${CASES.map(([ind, from, to, tier], i) => `<div class="cs" id="s6-c${i}"><span class="ind">${ind}</span><p>${from} <em class="orange">→</em> <b>${to}</b></p><span class="tier">${tier}</span></div>`).join('')}</div>
    <div class="eq" id="s6-eq">하던 일 <em>+</em> 고객 데이터 <em>+</em> 플랫폼 <em>=</em> <b>다음 단계</b></div>
    <p class="fine" id="s6-f" style="top:1262px">공개 사례 요약 · 미래AI랩 실적이 아니에요 · 금액은 조달 규모 구간</p>`)
  fade(b); reveal('#s6-t .ln > span', START[b] + 0.1)
  CASES.forEach(([, , , , k], i) => tw(`tl.from('#s6-c${i}', { x: ${i % 2 ? 160 : -160}, opacity: 0, duration: 0.38, ease: 'power3.out' }, ${r2(K(k) - 0.2)});`))
  CASES.forEach((_, i) => tw(`tl.from('#s6-c${i} .tier', { scale: 0, duration: 0.3, ease: 'back.out(2.5)' }, ${r2(K(CASES[i][4]) + 0.3)});`))
  rise('#s6-f', K('m_re'))
  dim('#s6-cs', K('m_eq') - 0.6, 0.3)
  pop('#s6-eq', K('m_eq') - 0.5)
}
// ════════ 7) 정부 돈의 방향 — 공식 근거 상자(미래AI랩 실적과 섞지 않는다)
{
  const b = 7
  sec(b, `
    <div class="big sm" id="s7-t">${lines(['정부 돈의 방향도', '<em class="green">같아요</em>'])}</div>
    <div class="official" id="s7-o"><span class="otag">공식 근거</span>
      <div class="orow" id="s7-r1"><b>AX-Sprint</b><p>7,540억 원 규모 지원 발표</p><small>대한민국 정책브리핑 2026.3 · 기후에너지환경부 2026.6.19</small></div>
      <div class="orow" id="s7-r2"><b>중진공 정책자금</b><p>신성장기반자금 AX 스프린트 우대트랙</p><small>중소벤처기업진흥공단</small></div>
      <div class="orow" id="s7-r3"><b>정책우선도 평가</b><p>혁신성장 · 지식재산(IP) 반영</p><small>중소벤처기업부 2026 정책자금</small></div>
      <p class="odis">기관 발표를 요약한 것으로 미래AI랩의 실적이 아니에요. 지원·선정은 각 기관 심사로 정해져요.</p>
    </div>`)
  fade(b); reveal('#s7-t .ln > span', START[b] + 0.1)
  rise('#s7-o', L(7, 2).start - 0.4)
  rise('#s7-r1', K('p_sprint') - 0.2); rise('#s7-r2', K('p_track') - 0.2); rise('#s7-r3', K('p_track') + 1.2)
}
// ════════ 8) 회사의 안과 밖을 연결 — 고객이 예약(밖) → AX 수요 예측에 반영(안) → AI 가 발주 추천
{
  const b = 8
  const SW = 340, sc = SW / 390
  const OUT_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const outer = IMG('assets/flows/gsbk2-00.jpg', SW) + flowLayer('o', 'gsbk2', OUT_STEPS, SW) + touchLayer('o', 'gsbk2', [...OUT_STEPS, 11], sc)
  // 안(대표님 폰): AX 홈(브리핑) → 예약이 반영된 수요 예측(gsbk2-11) → '발주에 반영' → 스마트 발주(gsax-02)
  const inner = IMG('assets/flows/gsax-01.jpg', SW) + `<img class="fimg" id="i-demand" src="assets/flows/gsbk2-11.jpg" style="width:${SW}px;opacity:0" alt=""><img class="fimg" id="i-purchase" src="assets/flows/gsax-02.jpg" style="width:${SW}px;opacity:0" alt=""><span class="touch" id="i-t1" style="left:${r2(202 * sc)}px;top:${r2(764 * sc)}px"></span>`
  sec(b, `
    <div class="big sm" id="s8-t">${lines(['회사의 <em class="orange">안</em>과 <em class="peach">밖</em>을', '연결해 드립니다'])}</div>
    <p class="plbl l" id="s8-lo"><em class="peach">밖</em> · 고객이 직접 예약</p>
    <p class="plbl r" id="s8-li"><em class="orange">안</em> · 대표님 폰(AX)</p>
    ${PHONE('s8-out', 'pl', SW, outer)}
    ${PHONE('s8-in', 'pr', SW, inner)}
    <svg class="wire" id="s8-wire" viewBox="0 0 200 60"><path d="M0 30 C 60 0, 140 60, 200 30" fill="none" stroke="#E8894F" stroke-width="5" stroke-dasharray="10 8"/></svg>
    <span class="pulse" id="s8-pulse"></span>
    <div class="aib" id="s8-ai"><span>AI</span> 예약 반영 → <b>한우 사골 70kg 발주 추천</b></div>
    <p class="fine" id="s8-f" style="top:1262px">미래AI랩 자체 데모(고운솥 식당) · 가상 시연 데이터</p>`)
  fade(b); reveal('#s8-t .ln > span', START[b] + 0.1)
  rise('#s8-li', K('x_in') - 0.3); tw(`tl.from('#s8-in', { y: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, ${r2(K('x_in') - 0.3)});`)
  rise('#s8-lo', K('x_out') - 0.3); tw(`tl.from('#s8-out', { y: 80, opacity: 0, duration: 0.5, ease: 'power3.out' }, ${r2(K('x_out') - 0.3)});`)
  // 밖: 예약 흐름을 '밖으로는' ~ '둘을 연결해' 사이에 빠르게
  const t0 = K('x_out') + 0.4, t1 = K('x_link') - 0.5
  OUT_STEPS.forEach((st, i) => stepAt('o', 'gsbk2', st, t0 + (i * (t1 - t0)) / OUT_STEPS.length))
  // 연결: 'AX에서 반영 확인'을 누르면 데이터가 건너가 안쪽 화면이 수요 예측으로
  const tl0 = K('x_link')
  tw(`tl.fromTo('#o-gsbk2-t11', { scale: 0.4, opacity: 0.95 }, { scale: 1.5, opacity: 0, duration: 0.36, ease: 'power2.out', immediateRender: false }, ${r2(tl0 - 0.1)});`)
  tw(`tl.from('#s8-wire', { opacity: 0, duration: 0.3 }, ${r2(tl0)});`)
  tw(`tl.fromTo('#s8-pulse', { x: 0, opacity: 1 }, { x: 150, duration: 0.7, ease: 'power1.inOut', immediateRender: false }, ${r2(tl0 + 0.1)});`)
  tw(`tl.to('#s8-pulse', { opacity: 0, duration: 0.2 }, ${r2(tl0 + 0.8)});`)
  tw(`tl.to('#i-demand', { opacity: 1, duration: 0.2 }, ${r2(tl0 + 0.75)});`)
  tw(`tl.fromTo('#s8-in', { boxShadow: '0 30px 70px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.14)' }, { boxShadow: '0 30px 70px rgba(0,0,0,.6), 0 0 0 8px rgba(232,137,79,.9)', duration: 0.25, yoyo: true, repeat: 1, immediateRender: false }, ${r2(tl0 + 0.75)});`)
  // AI: 수요 예측 → '발주에 반영' → 스마트 발주(AI 추천)
  const ta = K('x_ai') + 0.2
  tw(`tl.fromTo('#i-t1', { scale: 0.4, opacity: 0.95 }, { scale: 1.5, opacity: 0, duration: 0.36, ease: 'power2.out', immediateRender: false }, ${r2(ta)});`)
  tw(`tl.to('#i-purchase', { opacity: 1, duration: 0.15 }, ${r2(ta + 0.2)});`)
  pop('#s8-ai', ta + 0.35)
  rise('#s8-f', K('x_out'))
}
// ════════ 9) 처음의 고민 → 답 (카드가 하나씩 뒤집힌다)
{
  const b = 9
  sec(b, `
    <div class="big sm" id="s9-t">${lines(['처음의 고민은', '<em class="green">이렇게 바뀌어요</em>'])}</div>
    <div class="hstack sm" id="s9-stack">${HOOK.map((_, i) => `<div class="flip" id="s9-f${i}">${hookCard(i, 'small')}<div class="ans" id="s9-a${i}"><b class="hn g">${ic('check')}</b><i class="hbar"></i><p>${ANSWER[i]}</p></div></div>`).join('')}</div>`)
  fade(b); reveal('#s9-t .ln > span', START[b] + 0.1)
  tw(`tl.from('#s9-stack .flip', { y: 40, opacity: 0, duration: 0.35, stagger: 0.1 }, ${r2(START[b] + 0.25)});`)
  ;['a1', 'a2', 'a3', 'a4'].forEach((k, i) => {
    const t = K(k) - 0.1
    tw(`tl.to('#s9-f${i} .hk', { scaleY: 0, duration: 0.16, ease: 'power2.in' }, ${r2(t)});`)
    tw(`tl.fromTo('#s9-a${i}', { scaleY: 0 }, { scaleY: 1, duration: 0.2, ease: 'back.out(2)', immediateRender: true }, ${r2(t + 0.16)});`)
  })
}
// ════════ 10) 저희는 — 업종별 AX 화면 12개 · 실제 기업 프로젝트(업종만) · 특허 5건 출원
{
  const b = 10
  const AX = [['ax-gounsot', '음식점'], ['ax-edumaster', '학원'], ['ax-seum', '제조'], ['ax-nexmart', '유통'], ['ax-materix', '자재 유통'], ['ax-lumiere', '헤어숍'], ['ax-veloa', '뷰티 커머스'], ['ax-vitalon', '피트니스'], ['ax-autobridge', '자동차 정비'], ['ax-livarte', '인테리어'], ['ax-cleanway', '현장 서비스'], ['ax-morfit', '패션']]
  const REAL = ['의료폐기물 수거·운반', '웰니스 케어', '피혁 제조·도소매', '산업계측·장비유통', '전기·정보통신', '산업용 설비·펌프']
  sec(b, `
    <div class="big sm" id="s10-t">${lines(['저희는', '<em class="peach">직접 만들었습니다</em>'])}</div>
    <div class="axw" id="s10-w">${AX.map(([img, n], i) => `<figure class="axc" id="s10-x${i}"><img src="assets/shots/${img}.jpg" alt=""><figcaption>${n}</figcaption></figure>`).join('')}</div>
    <div class="real" id="s10-r"><p class="rt">실제 기업과 함께 만드는 중 <small>업체명 비공개</small></p><div>${REAL.map((r) => `<span>${r}</span>`).join('')}</div></div>
    <div class="patent" id="s10-p"><b>AX 핵심기술 특허 출원 5건</b><span>2026. 9. 11</span></div>
    <p class="fine" id="s10-f" style="top:1262px">AX 화면은 예시 화면(Concept Prototype) · 특허는 출원(등록 아님)</p>`)
  fade(b); reveal('#s10-t .ln > span', START[b] + 0.1)
  tw(`tl.from('#s10-w .axc', { scale: 0.4, opacity: 0, duration: 0.3, ease: 'back.out(2)', stagger: 0.09 }, ${r2(K('o_12') - 0.3)});`)
  tw(`tl.to('#s10-w', { opacity: 0.35, duration: 0.3 }, ${r2(K('o_real') - 0.2)});`)
  rise('#s10-r', K('o_real') - 0.2)
  tw(`tl.from('#s10-r span', { scale: 0.5, opacity: 0, duration: 0.25, stagger: 0.08 }, ${r2(K('o_real') + 0.2)});`)
  tw(`tl.from('#s10-p', { scale: 1.8, opacity: 0, rotation: -8, duration: 0.4, ease: 'power3.out' }, ${r2(K('o_pat') - 0.2)});`)
  rise('#s10-f', K('o_12'))
}
// ════════ 11) 진행 — 9년 차 경영컨설턴트 진단 → 성장 설계도 → 급한 것부터 · 기존 프로그램 위에
{
  const b = 11
  const ST = [['기업 성장 · AX 진단', '성장 단계와 업무부터', 'g_diag'], ['성장 설계도', '무엇부터 바꿔야 자금·매출로 이어지는지', 'g_bp'], ['필요한 것만 실행', '급한 한 가지부터, 필요한 만큼', 'g_step']]
  sec(b, `
    <div class="big sm" id="s11-t">${lines(['진행은', '<em class="peach">이렇게 해요</em>'])}</div>
    <span class="pro" id="s11-pro">9년 차 경영컨설턴트</span>
    <div class="steps" id="s11-st">${ST.map(([a, c], i) => `<div class="st" id="s11-s${i}"><i>STEP ${i + 1}</i><p><b>${a}</b><small>${c}</small></p></div>`).join('')}</div>
    <div class="layer" id="s11-l"><div class="ly ax" id="s11-ax">AX 한 층</div><div class="ly old">이미 잘 쓰는 프로그램은 그대로</div></div>`)
  fade(b); reveal('#s11-t .ln > span', START[b] + 0.1)
  pop('#s11-pro', L(11, 2).start - 0.1)
  ST.forEach(([, , k], i) => rise(`#s11-s${i}`, K(k) - 0.3))
  rise('#s11-l .old', K('g_keep') - 0.3)
  tw(`tl.from('#s11-ax', { y: -80, opacity: 0, duration: 0.45, ease: 'bounce.out' }, ${r2(K('g_keep') + 0.3)});`)
}
// ════════ 12) 인증 — 신청까지 함께 준비(결과·처리기간은 외부기관 심사)
{
  const b = 12
  const BADGE = [['벤처기업확인', 'k_v', 'b1'], ['기업부설연구소', 'k_lab', 'b2'], ['이노비즈', 'k_inno', 'b3'], ['메인비즈', 'k_main', 'b4'], ['특허 출원', 'k_pat', 'b5']]
  sec(b, `
    <div class="big sm" id="s12-t">${lines(['인증은요?', '<em class="peach">신청까지 함께 준비해요</em>'])}</div>
    ${PHONE('s12-ph', 'pc', 300, IMG('assets/flows/gsax-01.jpg', 300))}
    ${BADGE.map(([n, , c]) => `<span class="badge2 ${c}" id="s12-${c}">${ic('check')}${n}</span>`).join('')}
    <div class="partners" id="s12-pt">함께하는 전문가 <span>세무사</span><span>법무사</span><span>변리사</span></div>
    <p class="fine center" id="s12-f" style="top:1262px">필요한 것만 골라 진행 · 결과와 처리기간은 외부기관 심사·절차에 따라 달라요 · 특허는 제휴 변리사</p>`)
  fade(b); reveal('#s12-t .ln > span', START[b] + 0.1)
  tw(`tl.from('#s12-ph', { scale: 0.8, opacity: 0, duration: 0.45, ease: 'back.out(1.6)' }, ${r2(START[b] + 0.4)});`)
  BADGE.forEach(([, k, c]) => pop(`#s12-${c}`, K(k) - 0.1))
  rise('#s12-pt', lastLine(12).start - 0.2)
  rise('#s12-f', K('k_v'))
}
// ════════ 13) 닫기 — 같은 질문, 이번엔 화면을 보여 준다 → 3분 AX 진단
{
  const b = 13
  sec(b, `
    ${ROOM('s13-room')}
    <div class="bub q" id="s13-q">그래서, <b>다음은 어떻게 되나요?</b></div>
    <div class="show" id="s13-show">${PHONE('s13-ph', 'ps', 250, IMG('assets/flows/gsbk2-11.jpg', 250))}<span class="nod" id="s13-nod">${ic('check')}</span></div>
    <div class="ctab" id="s13-cta"><p class="q">우리 회사는 지금<br><b>무엇부터 보여 줘야 할까요?</b></p><div class="cta">3분 AX Fit 진단 받기 <span>→</span></div><p class="url2">miraeailab.com</p></div>
    <p class="fine center" id="s13-f" style="top:1262px">자금조달·선정 결과는 기관 심사에 따라 달라지며 보장되지 않아요 · 영상 속 화면은 자체 데모</p>`)
  fade(b)
  rise('#s13-room', START[b] + 0.1)
  pop('#s13-q', K('e_q') - 0.1)
  tw(`tl.to(['#s13-room', '#s13-q'], { opacity: 0, y: -60, duration: 0.35 }, ${r2(K('e_show') - 0.6)});`)
  tw(`tl.from('#s13-show', { y: 260, opacity: 0, duration: 0.55, ease: 'back.out(1.4)' }, ${r2(K('e_show') - 0.4)});`)
  tw(`tl.from('#s13-nod', { scale: 0, duration: 0.35, ease: 'back.out(3)' }, ${r2(K('e_show') + 0.4)});`)
  const t2 = L(13, 2).start
  tw(`tl.to('#s13-show', { opacity: 0, y: -40, duration: 0.35 }, ${r2(t2 - 0.2)});`)
  pop('#s13-cta', t2)
  tw(`tl.to('#s13-cta .cta', { scale: 1.05, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, ${r2(K('e_cta'))});`)
  rise('#s13-f', t2 + 0.5)
}
// ════════ 끝 화면 5초(소리 없음) — 업종별 AX 12개 → 직접 눌러 보세요
{
  const AX = ['ax-gounsot', 'ax-edumaster', 'ax-seum', 'ax-nexmart', 'ax-materix', 'ax-lumiere', 'ax-veloa', 'ax-vitalon', 'ax-autobridge', 'ax-livarte', 'ax-cleanway', 'ax-morfit']
  html += `<section class="clip scene" id="s14" data-start="${END_START}" data-duration="${r2(TOTAL - END_START)}" data-track-index="1">
    <p class="bhead" id="s14-h">미래AI랩이 직접 만든 <b>업종별 AX 12개</b></p>
    <div class="bgrid" id="s14-g">${AX.map((img) => `<figure class="bcell"><img src="assets/shots/${img}.jpg" alt=""></figure>`).join('')}</div>
    <div class="endcard" id="s14-end"><p class="e1">직접 눌러서</p><p class="e1"><em class="peach">확인해 보세요</em></p><i class="ebar"></i><p class="e5">어떤 업종이든,<br><b>우리 회사에 맞춰</b> 만들어 드립니다</p><p class="e3">miraeailab.com</p></div>
  </section>\n`
  const t0 = END_START
  tw(`tl.fromTo('#s14', { opacity: 0 }, { opacity: 1, duration: 0.15 }, ${t0});`)
  rise('#s14-h', t0 + 0.05)
  tw(`tl.from('#s14-g .bcell', { scale: 0.3, opacity: 0, duration: 0.24, ease: 'back.out(2)', stagger: 0.12 }, ${r2(t0 + 0.15)});`)
  const te = r2(t0 + 0.15 + 12 * 0.12 + 0.3)
  tw(`tl.to(['#s14-g', '#s14-h'], { opacity: 0.2, duration: 0.35 }, ${te});`)
  tw(`tl.from('#s14-end', { scale: 0.88, opacity: 0, duration: 0.45, ease: 'back.out(1.6)' }, ${te});`)
  tw(`tl.from('#s14-end .e5', { y: 24, opacity: 0, duration: 0.4, ease: 'power2.out' }, ${r2(te + 0.6)});`)
}

// ── 자막 — 두 줄 안에서 가운데 가까운 띄어쓰기로 끊는다
const splitAt = (t) => {
  const words = t.split(' ')
  const mid = t.length / 2
  let best = null, pos = 0
  for (let i = 0; i < words.length - 1; i++) {
    pos += words[i].length
    let score = Math.abs(pos - mid)
    if (/[,.?’]$/.test(words[i])) score -= 6
    if (words[i].length === 1 || words[i + 1].length === 1) score += 8
    if (!best || score < best.score) best = { pos, score }
    pos += 1
  }
  return best ? best.pos : -1
}
// 한 줄에 들어가는지 글자 폭으로 어림한다(자막 50px, 안쪽 폭 약 890px)
const textW = (t) => [...t].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? 50 : /[A-Za-z0-9]/.test(ch) ? 30 : ch === ' ' ? 14 : 18), 0)
// 자동으로 끊으면 어색한 자막은 끊을 곳을 직접 정한다(' / ')
const BREAKS = [
  '‘진짜 되는 건가요?’라는 / 질문 앞에서 보여 줄 게 없거나,',
  '자료를 찾고 맞추는 데 / 매달 시간과 돈이 새고,',
  '렌탈 장부를 손으로 쓰던 / 회사가 있었어요.',
  '바다 김 양식장은 / 육상 자동화와 AI 모니터링으로,',
  '웰니스 플랫폼으로 / 다음 단계를 열었어요.',
  '중진공 정책자금엔 / AX 우대트랙도 생겼어요.',
  '9년 차 경영컨설턴트가 / 회사의 성장 단계와 업무를 진단해,',
  '무엇부터 바꿔야 / 자금과 매출로 이어지는지',
  '필요한 것을 골라 / 신청까지 함께 준비합니다.',
  '직접 만든 AX가 곧 / 기술력의 근거가 되니까요.',
]
const twoLines = (t) => {
  const manual = BREAKS.find((x) => x.replace(' / ', ' ') === t)
  if (manual) return manual.split(' / ').map(esc).join('<br>')
  if (textW(t) <= 870) return esc(t)
  const sp = splitAt(t)
  return sp > 0 ? `${esc(t.slice(0, sp))}<br>${esc(t.slice(sp + 1))}` : esc(t)
}
if (process.argv.includes('--subs')) { T.cues.forEach((c) => console.log(`${c.start.toFixed(1)} ${twoLines(c.text).replace('<br>', ' / ')}`)); process.exit(0) }
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
em { font-style: normal; } .peach { color: #E8B89A; } .orange { color: #E8894F; } .green { color: #8FD6A8; }
.glow1 { position: absolute; right: -300px; top: -260px; width: 900px; height: 900px; border-radius: 50%; background: radial-gradient(circle, rgba(212,122,74,.30), rgba(212,122,74,0) 66%); }
.glow2 { position: absolute; left: -300px; top: 900px; width: 820px; height: 820px; border-radius: 50%; background: radial-gradient(circle, rgba(232,184,154,.10), rgba(232,184,154,0) 66%); }
.clip { position: absolute; inset: 0; }
.brand { position: absolute; top: 110px; left: 60px; right: 60px; height: 64px; display: flex; align-items: center; justify-content: space-between; z-index: 30; }
.brand .logo { height: 64px; padding: 10px 18px; background: #fff; border-radius: 14px; display: flex; align-items: center; } .brand .logo img { height: 44px; }
.brand .tag2 { font-size: 28px; font-weight: 800; color: #E8B89A; display: flex; align-items: center; gap: 10px; }
.brand .tag2::before { content: ''; width: 11px; height: 11px; border-radius: 50%; background: #D47A4A; }
.big { position: absolute; left: 60px; right: 50px; top: 220px; font-size: 96px; font-weight: 900; line-height: 1.16; letter-spacing: -0.035em; }
.big.sm { font-size: 80px; }
.ln { overflow: hidden; padding-bottom: 6px; } .ln > span { display: inline-block; }
.fine { position: absolute; left: 70px; right: 70px; font-size: 24px; font-weight: 500; line-height: 1.45; color: #7C8591; } .fine.center { text-align: center; }
.ic { display: inline-flex; width: 44px; height: 44px; color: currentColor; } .ic svg { width: 100%; height: 100%; } .ic.lg { width: 64px; height: 64px; }
.fimg { position: absolute; left: 0; top: 0; display: block; }
.touch { position: absolute; width: 60px; height: 60px; margin: -30px 0 0 -30px; border-radius: 50%; background: rgba(255,255,255,.55); box-shadow: 0 0 0 4px rgba(212,122,74,.95); opacity: 0; z-index: 5; }
.phone { position: absolute; padding: 9px; border-radius: 40px; background: #0E1114; box-shadow: 0 30px 70px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.14); }
.phone .screen { position: relative; overflow: hidden; border-radius: 31px; background: #fff; aspect-ratio: 390 / 844; }
/* 1) 대표님 상황 카드 */
.hstack { position: absolute; left: 44px; right: 44px; top: 214px; display: grid; gap: 18px; }
.hk { position: relative; display: flex; align-items: center; height: 250px; padding: 0 34px 0 26px; border-radius: 30px; background: linear-gradient(135deg, rgba(40,46,54,.96), rgba(22,26,31,.96)); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12), 0 20px 50px rgba(0,0,0,.45); }
.hk .hn { flex: none; width: 170px; text-align: center; font-size: 150px; font-weight: 900; line-height: 1; letter-spacing: -0.06em; background: linear-gradient(180deg, #F6B07C, #D47A4A); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hk .hbar { flex: none; width: 2px; height: 150px; margin: 0 30px 0 12px; background: rgba(255,255,255,.18); }
.hk p { font-size: 40px; font-weight: 800; line-height: 1.3; color: #fff; letter-spacing: -0.02em; } .hk p em { color: #F09A5E; }
.kkut { position: absolute; left: 0; right: 0; top: 560px; text-align: center; z-index: 5; }
.kchips { display: flex; justify-content: center; gap: 22px; } .kchips span { padding: 20px 40px; border-radius: 999px; background: #fff; color: #171B20; font-size: 54px; font-weight: 900; box-shadow: 0 20px 50px rgba(0,0,0,.5); }
.stampr { display: inline-block; margin-top: 36px; padding: 18px 48px; border: 8px solid #E5484D; border-radius: 20px; color: #FF6B6E; font-size: 96px; font-weight: 900; transform: rotate(-8deg); background: rgba(23,27,32,.75); }
.watch { position: absolute; left: 0; right: 0; margin: 0 auto; top: 1040px; width: max-content; padding: 22px 46px; border-radius: 999px; background: #D47A4A; color: #171B20; font-size: 50px; font-weight: 900; z-index: 6; box-shadow: 0 20px 50px rgba(212,122,74,.45); } .watch span { display: inline-block; }
/* 2) 심사장 */
.room { position: absolute; left: 60px; right: 60px; top: 440px; height: 480px; }
.screen2 { position: absolute; left: 150px; right: 150px; top: 0; height: 200px; padding: 34px 40px; border-radius: 16px; background: #2A3038; box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.screen2 p { font-size: 34px; font-weight: 800; color: #C9CED6; margin-bottom: 18px; } .screen2 i { display: block; height: 16px; border-radius: 8px; background: #454C56; margin-bottom: 16px; }
.judges { position: absolute; left: 0; right: 0; top: 250px; display: flex; justify-content: center; gap: 90px; }
.judge { position: relative; width: 150px; height: 170px; } .judge .jh { position: absolute; left: 45px; top: 0; width: 60px; height: 60px; border-radius: 50%; background: #5A6370; } .judge .jb { position: absolute; left: 0; top: 70px; width: 150px; height: 100px; border-radius: 75px 75px 0 0; background: #474F5A; }
.desk { position: absolute; left: 20px; right: 20px; top: 380px; height: 90px; border-radius: 14px; background: #3A3F47; display: flex; align-items: center; justify-content: center; } .desk span { padding: 6px 20px; border-radius: 8px; background: #F4F1EC; color: #343B44; font-size: 26px; font-weight: 800; }
.bub { position: absolute; padding: 22px 34px; border-radius: 28px; font-size: 42px; font-weight: 800; z-index: 6; box-shadow: 0 18px 44px rgba(0,0,0,.5); }
.bub.q { left: 120px; right: 120px; top: 950px; text-align: center; background: #fff; color: #171B20; border: 5px solid #E8894F; } .bub.q b { color: #C8612E; }
.bub.q::after { content: ''; position: absolute; left: 50%; top: -24px; margin-left: -18px; border: 18px solid transparent; border-bottom: 22px solid #E8894F; border-top: 0; }
.bub.a { left: 70px; top: 1085px; background: #3A4048; color: #E5E8EC; } .bub.a2 { left: auto; right: 70px; top: 1195px; }
.nomvp { position: absolute; left: 100px; right: 100px; top: 470px; height: 220px; border: 5px dashed #5A6370; border-radius: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.nomvp .slot { font-size: 50px; font-weight: 900; color: #AEB6C0; } .nomvp .slot small { font-size: 30px; }
.nomvp .x { position: absolute; right: -30px; top: -40px; width: 110px; height: 110px; border-radius: 50%; background: #C8514A; color: #fff; font-size: 64px; display: flex; align-items: center; justify-content: center; }
.nomvp p { margin-top: 10px; font-size: 32px; font-weight: 700; color: #8A939C; }
.pile { position: absolute; left: 0; right: 0; top: 740px; height: 360px; }
.plan { position: absolute; left: 380px; top: 0; width: 320px; height: 360px; padding: 30px 26px; border-radius: 18px; background: #F4F1EC; color: #343B44; box-shadow: 0 16px 40px rgba(0,0,0,.45); transform-origin: 50% 90%; }
.plan p { font-size: 32px; font-weight: 900; margin-bottom: 12px; line-height: 1.2; } .plan .aitag { display: inline-block; margin-bottom: 18px; padding: 5px 14px; border-radius: 999px; background: #DAD4C9; font-size: 20px; font-weight: 800; color: #6B6458; }
.plan i { display: block; height: 13px; border-radius: 7px; background: #D9D4CC; margin-bottom: 16px; } .plan.mine { background: #FFF6EE; box-shadow: 0 0 0 4px #E8894F, 0 16px 40px rgba(0,0,0,.45); }
.verdict { position: absolute; left: 60px; right: 60px; top: 1130px; text-align: center; z-index: 7; }
.verdict p { font-size: 44px; font-weight: 800; color: #D5DAE0; } .verdict .vb { display: inline-block; margin-top: 10px; padding: 14px 40px; border-radius: 999px; background: #D47A4A; color: #171B20; font-size: 58px; font-weight: 900; }
/* 3) 회사 안 */
.srcs { position: absolute; left: 60px; right: 60px; top: 480px; display: flex; justify-content: space-between; }
.src { width: 300px; padding: 26px 20px; border-radius: 26px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); text-align: center; }
.src b { display: block; margin-top: 8px; font-size: 36px; font-weight: 900; } .src .dots { margin-top: 14px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.src .dots span { padding: 6px 14px; border-radius: 999px; background: #D47A4A; color: #171B20; font-size: 24px; font-weight: 900; }
.vault { position: absolute; left: 180px; right: 180px; top: 820px; height: 360px; border: 6px dashed #E8B89A; border-radius: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.vault .vin { text-align: center; color: #E8B89A; } .vault .vin .ic { width: 70px; height: 70px; } .vault p { margin-top: 10px; font-size: 38px; font-weight: 800; color: #D5DAE0; } .vault b { font-size: 76px; font-weight: 900; color: #fff; }
.vault .empty { position: absolute; bottom: -34px; padding: 10px 26px; border-radius: 999px; background: #3A4048; color: #FF8A8C; font-size: 30px; font-weight: 900; }
.cons { position: absolute; left: 60px; right: 60px; top: 520px; display: grid; gap: 26px; transform-origin: 50% 100%; }
.con { position: relative; display: flex; align-items: center; gap: 26px; height: 210px; padding: 0 36px; border-radius: 30px; background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.con .cic { width: 110px; height: 110px; border-radius: 28px; background: rgba(212,122,74,.18); color: #E8B89A; display: flex; align-items: center; justify-content: center; } .con .cic .ic { width: 64px; height: 64px; }
.con p b { display: block; font-size: 50px; font-weight: 900; } .con p small { display: block; margin-top: 6px; font-size: 30px; color: #AEB6C0; }
.con.hot { background: rgba(229,72,77,.12); box-shadow: inset 0 0 0 3px rgba(229,72,77,.6); } .con.hot .cic { background: rgba(229,72,77,.2); color: #FF8A8C; } .con.hot p b { color: #FF8A8C; }
.coins { position: absolute; right: 40px; top: 60px; display: flex; gap: 8px; } .coins .ic { width: 54px; height: 54px; }
.leave { position: absolute; right: 60px; top: 70px; color: #AEB6C0; } .leave .ic { width: 70px; height: 70px; }
/* 4) 250곳 */
.grid250 { position: absolute; left: 60px; right: 60px; top: 470px; height: 300px; display: grid; grid-template-columns: repeat(21, 1fr); grid-auto-rows: 1fr; gap: 6px; }
.grid250 i { display: block; border-radius: 4px; background: #E8894F; }
.n250 { position: absolute; left: 0; right: 0; top: 520px; text-align: center; z-index: 3; } .n250 b { font-size: 190px; font-weight: 900; letter-spacing: -0.05em; text-shadow: 0 10px 40px rgba(0,0,0,.6); } .n250 span { font-size: 56px; font-weight: 900; margin-left: 10px; }
.range { position: absolute; left: 60px; right: 60px; top: 800px; padding: 18px; border-radius: 20px; background: rgba(255,255,255,.08); text-align: center; font-size: 36px; font-weight: 700; color: #D5DAE0; } .range b { color: #E8B89A; font-weight: 900; }
.pils { position: absolute; left: 50px; right: 50px; top: 920px; display: flex; align-items: center; gap: 8px; }
.pil { flex: 1; height: 300px; padding: 26px 22px; border-radius: 26px; background: rgba(212,122,74,.12); box-shadow: inset 0 0 0 3px rgba(212,122,74,.55); }
.pil i { display: inline-flex; width: 56px; height: 56px; border-radius: 50%; background: #D47A4A; color: #171B20; font-style: normal; font-size: 32px; font-weight: 900; align-items: center; justify-content: center; }
.pil p { margin-top: 16px; font-size: 30px; font-weight: 700; line-height: 1.35; color: #D5DAE0; } .pil p b { color: #fff; font-weight: 900; }
.parr { font-size: 40px; font-weight: 900; color: #E8894F; }
/* 5) 사례 이야기 */
.case { position: absolute; left: 60px; top: 205px; font-size: 26px; font-weight: 900; letter-spacing: .12em; color: #E8894F; }
.big#s5-t { top: 245px; }
.path { position: absolute; left: 60px; right: 360px; top: 480px; display: flex; flex-direction: column; align-items: stretch; }
.node { display: flex; align-items: center; gap: 24px; height: 150px; padding: 0 30px; border-radius: 26px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); color: #E8B89A; }
.node p { font-size: 32px; font-weight: 700; color: #C9CED6; line-height: 1.3; } .node p b { font-size: 40px; color: #fff; font-weight: 900; }
.path .down { display: block; width: 6px; height: 40px; margin: 0 auto; background: #E8894F; border-radius: 3px; }
.win { position: absolute; right: 50px; top: 990px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #F0A06E, #D47A4A 70%); color: #171B20; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 0 16px rgba(212,122,74,.22), 0 30px 70px rgba(0,0,0,.5); transform: rotate(-8deg); }
.win small { font-size: 36px; font-weight: 900; } .win b { font-size: 68px; font-weight: 900; letter-spacing: -0.04em; }
/* 6) 몽타주 */
.cases { position: absolute; left: 50px; right: 50px; top: 470px; display: grid; gap: 16px; }
.cs { display: flex; align-items: center; gap: 20px; height: 140px; padding: 0 26px; border-radius: 24px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); }
.cs .ind { flex: none; width: 190px; font-size: 28px; font-weight: 900; color: #E8B89A; line-height: 1.2; }
.cs p { flex: 1; font-size: 34px; font-weight: 700; color: #C9CED6; line-height: 1.25; } .cs p b { color: #fff; font-weight: 900; }
.cs .tier { flex: none; padding: 10px 18px; border-radius: 16px; background: #D47A4A; color: #171B20; font-size: 32px; font-weight: 900; }
.eq { position: absolute; left: 40px; right: 40px; top: 760px; padding: 34px 20px; border-radius: 30px; background: #fff; color: #171B20; text-align: center; font-size: 46px; font-weight: 900; z-index: 5; box-shadow: 0 30px 70px rgba(0,0,0,.55); } .eq em { color: #D47A4A; margin: 0 6px; } .eq b { color: #C8612E; }
/* 7) 공식 근거 */
.official { position: absolute; left: 60px; right: 60px; top: 480px; padding: 34px 36px; border-radius: 30px; background: #10161D; box-shadow: inset 0 0 0 3px rgba(143,214,168,.6); }
.otag { display: inline-block; padding: 8px 20px; border-radius: 999px; background: #2E9E6A; color: #fff; font-size: 30px; font-weight: 900; }
.orow { margin-top: 26px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.1); } .orow b { font-size: 36px; font-weight: 900; color: #8FD6A8; } .orow p { margin-top: 6px; font-size: 44px; font-weight: 900; color: #fff; line-height: 1.25; } .orow small { display: block; margin-top: 8px; font-size: 24px; color: #7C8591; }
.odis { margin-top: 26px; font-size: 24px; line-height: 1.45; color: #7C8591; }
/* 8) 안과 밖 */
.plbl { position: absolute; top: 470px; font-size: 34px; font-weight: 900; color: #D5DAE0; } .plbl.l { left: 64px; } .plbl.r { right: 64px; }
.phone.pl { left: 50px; top: 530px; } .phone.pr { right: 50px; top: 530px; }
.wire { position: absolute; left: 440px; top: 860px; width: 200px; height: 60px; z-index: 7; }
.pulse { position: absolute; left: 455px; top: 872px; width: 36px; height: 36px; border-radius: 50%; background: #E8894F; box-shadow: 0 0 0 10px rgba(232,137,79,.3), 0 0 30px #E8894F; opacity: 0; z-index: 8; }
.aib { position: absolute; left: 60px; right: 60px; top: 1180px; padding: 20px 26px; border-radius: 22px; background: #fff; color: #171B20; font-size: 34px; font-weight: 800; text-align: center; z-index: 9; box-shadow: 0 20px 50px rgba(0,0,0,.5); }
.aib span { display: inline-block; margin-right: 10px; padding: 4px 14px; border-radius: 10px; background: #2F6FED; color: #fff; font-weight: 900; } .aib b { color: #C8612E; }
/* 9) 답 */
.hstack.sm { top: 470px; gap: 14px; }
.flip { position: relative; height: 190px; }
.flip .hk, .flip .ans { position: absolute; inset: 0; height: 190px; transform-origin: 50% 50%; }
.hk.small .hn { width: 120px; font-size: 104px; } .hk.small .hbar { height: 110px; margin: 0 22px 0 8px; } .hk.small p { font-size: 30px; }
.ans { display: flex; align-items: center; padding: 0 34px 0 26px; border-radius: 30px; background: linear-gradient(135deg, #1D3A2C, #16271F); box-shadow: inset 0 0 0 3px rgba(143,214,168,.7), 0 20px 50px rgba(0,0,0,.45); transform: scaleY(0); }
.ans .hn.g { flex: none; width: 120px; display: flex; justify-content: center; color: #8FD6A8; } .ans .hn.g .ic { width: 84px; height: 84px; }
.ans .hbar { flex: none; width: 2px; height: 110px; margin: 0 22px 0 8px; background: rgba(143,214,168,.35); }
.ans p { font-size: 44px; font-weight: 800; line-height: 1.25; color: #D5DAE0; } .ans p b { color: #8FD6A8; font-weight: 900; }
/* 10) 우리 근거 */
.axw { position: absolute; left: 50px; right: 50px; top: 470px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.axc { position: relative; aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px rgba(0,0,0,.45); } .axc img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.axc figcaption { position: absolute; left: 8px; bottom: 8px; padding: 3px 12px; border-radius: 999px; background: rgba(23,27,32,.88); font-size: 22px; font-weight: 800; }
.real { position: absolute; left: 60px; right: 60px; top: 700px; padding: 28px 30px; border-radius: 28px; background: #10161D; box-shadow: inset 0 0 0 2px rgba(232,184,154,.45); z-index: 3; }
.real .rt { font-size: 40px; font-weight: 900; } .real .rt small { margin-left: 10px; font-size: 24px; font-weight: 700; color: #7C8591; }
.real div { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 12px; } .real span { padding: 10px 20px; border-radius: 999px; background: rgba(255,255,255,.1); font-size: 28px; font-weight: 800; color: #E5E8EC; }
.patent { position: absolute; left: 0; right: 0; margin: 0 auto; top: 1090px; width: max-content; padding: 22px 44px; border-radius: 22px; background: #D47A4A; color: #171B20; text-align: center; box-shadow: 0 20px 50px rgba(212,122,74,.4); z-index: 4; }
.patent b { display: block; font-size: 48px; font-weight: 900; } .patent span { font-size: 28px; font-weight: 800; }
/* 11) 진행 */
.pro { position: absolute; left: 60px; top: 460px; padding: 14px 30px; border-radius: 999px; background: #2E9E6A; color: #fff; font-size: 34px; font-weight: 900; }
.steps { position: absolute; left: 60px; right: 60px; top: 560px; display: grid; gap: 18px; }
.st { display: flex; align-items: center; gap: 26px; height: 150px; padding: 0 30px; border-radius: 26px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); }
.st i { flex: none; padding: 10px 16px; border-radius: 14px; background: #D47A4A; color: #171B20; font-style: normal; font-size: 26px; font-weight: 900; }
.st p b { display: block; font-size: 44px; font-weight: 900; } .st p small { display: block; margin-top: 6px; font-size: 28px; color: #AEB6C0; }
.layer { position: absolute; left: 120px; right: 120px; top: 1090px; }
.ly { height: 80px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; } .ly.ax { background: #D47A4A; color: #171B20; margin-bottom: 10px; } .ly.old { background: #3A4048; color: #D5DAE0; font-weight: 800; }
/* 12) 인증 */
.phone.pc { left: 380px; top: 500px; }
.badge2 { position: absolute; display: inline-flex; align-items: center; gap: 10px; padding: 18px 28px; border-radius: 999px; background: #fff; color: #171B20; font-size: 38px; font-weight: 900; box-shadow: 0 16px 40px rgba(0,0,0,.5); z-index: 5; } .badge2 .ic { width: 40px; height: 40px; color: #2E9E6A; }
.badge2.b1 { left: 50px; top: 540px; } .badge2.b2 { right: 40px; top: 640px; } .badge2.b3 { left: 70px; top: 780px; } .badge2.b4 { right: 60px; top: 900px; } .badge2.b5 { left: 60px; top: 1020px; }
.partners { position: absolute; left: 60px; right: 60px; top: 1195px; text-align: center; font-size: 30px; font-weight: 800; color: #AEB6C0; } .partners span { display: inline-block; margin-left: 10px; padding: 8px 20px; border-radius: 999px; background: rgba(255,255,255,.1); color: #fff; }
/* 13) 닫기 */
.room#s13-room { top: 330px; }
#s13-q { top: 830px; }
.show { position: absolute; left: 0; right: 0; top: 500px; height: 580px; } .phone.ps { left: 405px; top: 0; transform: rotate(-4deg); }
.nod { position: absolute; left: 700px; top: 20px; width: 110px; height: 110px; border-radius: 50%; background: #2E9E6A; color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 30px rgba(0,0,0,.5); } .nod .ic { width: 64px; height: 64px; }
.ctab { position: absolute; left: 60px; right: 60px; top: 360px; text-align: center; }
.ctab .q { font-size: 56px; font-weight: 800; line-height: 1.3; color: #D5DAE0; } .ctab .q b { color: #fff; font-weight: 900; }
.cta { margin: 60px auto 0; width: 820px; height: 170px; border-radius: 40px; background: #D47A4A; color: #171B20; font-size: 64px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 18px; box-shadow: 0 30px 80px rgba(212,122,74,.45); }
.url2 { margin-top: 40px; font-size: 48px; font-weight: 800; color: #E8B89A; }
/* 끝 화면 */
.bhead { position: absolute; left: 0; right: 0; top: 230px; text-align: center; font-size: 52px; font-weight: 800; color: #D5DAE0; } .bhead b { color: #E8894F; font-weight: 900; }
.bgrid { position: absolute; left: 50px; right: 50px; top: 340px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.bcell { aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px rgba(0,0,0,.45); } .bcell img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.endcard { position: absolute; left: 70px; right: 70px; top: 520px; padding: 70px 40px 60px; border-radius: 40px; background: rgba(16,20,25,.95); box-shadow: 0 30px 90px rgba(0,0,0,.6), inset 0 0 0 2px rgba(232,184,154,.35); text-align: center; }
.endcard .e1 { font-size: 92px; font-weight: 900; letter-spacing: -0.03em; } .endcard .ebar { display: block; width: 120px; height: 6px; margin: 36px auto 30px; border-radius: 3px; background: #D47A4A; }
.endcard .e5 { font-size: 48px; font-weight: 700; line-height: 1.35; color: #D5DAE0; } .endcard .e5 b { color: #E8B89A; font-weight: 900; } .endcard .e3 { margin-top: 30px; font-size: 44px; font-weight: 800; color: #E8B89A; }
/* 자막 · 진행 막대 */
.sub { display: flex; align-items: flex-end; justify-content: center; padding: 0 60px 420px; z-index: 40; }
.sub span { max-width: 960px; padding: 18px 34px; border-radius: 22px; background: rgba(8,10,13,.88); font-size: 50px; font-weight: 800; line-height: 1.32; text-align: center; }
.foot { position: absolute; left: 70px; right: 70px; top: 1660px; text-align: center; font-size: 28px; font-weight: 700; color: #6B7680; z-index: 2; }
#prog { position: absolute; left: 70px; right: 70px; top: 1730px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.12); overflow: hidden; z-index: 2; }
#prog i { display: block; width: 100%; height: 100%; background: #D47A4A; transform-origin: 0 50%; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
  <div class="glow1"></div><div class="glow2"></div>
  <div class="brand"><span class="logo"><img src="assets/logo.png" alt="미래에이아이랩"></span><span class="tag2">경영컨설턴트가 설계하는 AX</span></div>
  <p class="foot">miraeailab.com · 회사의 안과 밖을 잇는 AX</p><div id="prog"><i></i></div>
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
