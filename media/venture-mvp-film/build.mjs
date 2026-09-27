// story.mjs → index.html(HyperFrames 컴포지션) + subtitles.srt + script.md
import { readFileSync, writeFileSync } from 'node:fs'
import { W, H, DEMOS, SCENES, SUBS, TOTAL } from './story.mjs'

const meta = JSON.parse(readFileSync(new URL('./assets/shots/meta.json', import.meta.url), 'utf8'))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const r2 = (n) => Math.round(n * 100) / 100

// ── 브라우저·폰 틀 치수
const BW = 900 // 브라우저 폭
const S = BW / 1440 // PC 캡처(1440) → 화면 배율
const VPH = Math.round(900 * S) // 보이는 높이
const PHONE_W = 230, PHONE_H = 480, PHONE_PAD = 9
const MOB_W = PHONE_W - PHONE_PAD * 2
const MS = MOB_W / 780 // 모바일 캡처(390×2배) → 화면 배율

const WALL = [
  ['pawbeauty', 'PawBeauty'], ['localmom', '로컬맘'], ['expertmatch', 'ExpertMatch'], ['eduplaza', 'EduPlaza'], ['insightai', 'InsightAI'],
  ['rescuewalk', 'RescueWalk'], ['cafefocus', 'CafeFocus'], ['scamshield', 'ScamShield'], ['freshfridge', 'FreshFridge'], ['stylecheck', 'StyleCheck AI'],
]

const scene = (id) => SCENES.find((s) => s.id === id)
const attrs = (s, track = 1) => `class="clip scene" id="${s.id}" data-start="${s.start}" data-duration="${s.dur}" data-track-index="${track}"`
const lines = (arr) => arr.map((l) => `<div class="ln"><span>${l}</span></div>`).join('')

let html = ''
let js = ''
const tw = (code) => { js += `  ${code}\n` }
// 장면 공통: 들어올 때 살짝 밝아지고, 끝나기 직전 어두워진다
const inout = (s) => {
  tw(`tl.fromTo('#${s.id}', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' }, ${s.start});`)
  tw(`tl.to('#${s.id}', { opacity: 0, duration: 0.2, ease: 'power1.in' }, ${r2(s.start + s.dur - 0.2)});`)
}
const reveal = (sel, at, stagger = 0.1) =>
  tw(`tl.from('${sel}', { yPercent: 110, duration: 0.55, ease: 'power3.out', stagger: ${stagger} }, ${r2(at)});`)
const rise = (sel, at, extra = '') =>
  tw(`tl.from('${sel}', { y: 30, opacity: 0, duration: 0.45, ease: 'power2.out'${extra} }, ${r2(at)});`)

// 1) 훅
{
  const s = scene('s-hook')
  html += `<section ${attrs(s)}>
    <p class="eyebrow" id="hook-eb">중소기업 대표님께</p>
    <div class="big" id="hook-big">${lines(['기술사업,', '해야 한다는데<em class="peach">…</em>'])}</div>
  </section>`
  inout(s); rise('#hook-eb', s.start + 0.1); reveal('#hook-big .ln > span', s.start + 0.25, 0.14)
}
// 2) 막막함
{
  const s = scene('s-pain')
  html += `<section ${attrs(s)}>
    <p class="eyebrow" id="pain-eb">아이디어도, 개발도 처음이라</p>
    <div class="big" id="pain-big">${lines(['뭘 만들지', '<em class="orange">막막</em>하셨죠?'])}</div>
  </section>`
  inout(s); rise('#pain-eb', s.start + 0.1); reveal('#pain-big .ln > span', s.start + 0.2, 0.14)
}
// 3) 약속 — 히어로 문구
{
  const s = scene('s-promise')
  html += `<section ${attrs(s)}>
    <div class="big mid" id="pro-big">${lines(['아이디어는', '<em class="peach">작동하는 서비스로</em>', '회사는', '<em class="orange">벤처기업으로</em>'])}</div>
    <p class="fine" id="pro-fine">*벤처기업확인 여부는 확인기관 심사로 정해집니다.</p>
  </section>`
  inout(s)
  tw(`tl.from('#pro-big .ln:nth-child(-n+2) > span', { yPercent: 110, duration: 0.55, ease: 'power3.out', stagger: 0.14 }, ${r2(s.start + 0.2)});`)
  tw(`tl.from('#pro-big .ln:nth-child(n+3) > span', { yPercent: 110, duration: 0.55, ease: 'power3.out', stagger: 0.14 }, ${r2(s.start + 3.0)});`)
  rise('#pro-fine', s.start + 3.6)
}
// 4) 아이디어 없어도 OK
{
  const s = scene('s-noidea')
  html += `<section ${attrs(s)}>
    <div class="big" id="no-big">${lines(['아이디어가', '없어도 <em class="orange">OK</em>'])}</div>
    <div class="flow" id="no-flow">
      <span class="pill ghost">지금 하는 사업</span><span class="flow-arr">→</span><span class="pill hot">기술사업 아이디어</span>
    </div>
    <p class="lead" id="no-lead">9년 차 경영컨설턴트가<br>지금 하는 사업에서 찾아 드려요.</p>
  </section>`
  inout(s); reveal('#no-big .ln > span', s.start + 0.15, 0.14)
  tw(`tl.from('#no-flow > *', { x: -30, opacity: 0, duration: 0.4, ease: 'power2.out', stagger: 0.25 }, ${r2(s.start + 1.0)});`)
  rise('#no-lead', s.start + 1.9)
}
// 5) 데모 6개
for (const s of SCENES.filter((x) => x.demo)) {
  const d = s.demo, m = meta[d.slug], t = s.start, id = s.id
  const cx = m.click.x + m.click.width / 2, cy = m.click.y + m.click.height / 2
  const scrollY = cy > 700 ? Math.min(cy - 450, m.homeH - 900) : 0
  const tx = r2(cx * S), ty = r2((cy - scrollY) * S)
  const innerPan = Math.max(0, Math.min(420, m.innerH - 900))
  const mobH = m.mobH * 2 * MS, mobPan = Math.max(0, Math.min(mobH - (PHONE_H - PHONE_PAD * 2), 640))
  html += `<section ${attrs(s)}>
    <div class="d-head">
      <p class="d-count" id="${id}-c">예를 들면 <b>${String(s.index + 1).padStart(2, '0')}</b> / ${String(DEMOS.length).padStart(2, '0')}</p>
      <p class="d-from" id="${id}-f"><span class="lbl">지금 하는 사업</span>${esc(d.from)}</p>
      <p class="d-to" id="${id}-t"><span class="orange">→</span> ${esc(d.to)}</p>
    </div>
    <div class="browser" id="${id}-b">
      <div class="bar"><i></i><i></i><i></i><span class="url">${esc(d.name)} <em>· 미래AI랩 자체 데모</em></span></div>
      <div class="vp">
        <img class="shot" id="${id}-home" src="assets/shots/${d.slug}-home.jpg" alt="">
        <img class="shot" id="${id}-inner" src="assets/shots/${d.slug}-inner.jpg" alt="">
        <div class="ripple" id="${id}-rp" style="left:${tx}px;top:${ty}px"></div>
        <svg class="cursor" id="${id}-cur" viewBox="0 0 24 24" width="40" height="40"><path d="M4 2.5 L4 19 L8.6 14.8 L11.6 21.4 L14.4 20.2 L11.4 13.7 L17.6 13.4 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>
      </div>
    </div>
    <div class="phone" id="${id}-p"><div class="screen"><img class="mob" id="${id}-mob" src="assets/shots/${d.slug}-mob.jpg" alt=""></div></div>
  </section>`
  inout(s)
  tw(`tl.from(['#${id}-c', '#${id}-f', '#${id}-t'], { y: 26, opacity: 0, duration: 0.42, ease: 'power2.out', stagger: 0.08 }, ${r2(t + 0.05)});`)
  tw(`tl.from('#${id}-b', { y: 40, opacity: 0, duration: 0.5, ease: 'power2.out' }, ${r2(t + 0.1)});`)
  tw(`tl.from('#${id}-p', { y: 80, opacity: 0, duration: 0.55, ease: 'power2.out' }, ${r2(t + 0.3)});`)
  tw(`tl.set('#${id}-inner', { opacity: 0 }, ${t});`)
  if (scrollY > 0) tw(`tl.to('#${id}-home', { y: ${r2(-scrollY * S)}, duration: 1.1, ease: 'power2.inOut' }, ${r2(t + 0.55)});`)
  tw(`tl.fromTo('#${id}-cur', { x: ${BW - 230}, y: ${VPH - 90}, opacity: 0, scale: 1 }, { opacity: 1, duration: 0.2 }, ${r2(t + 0.7)});`)
  tw(`tl.to('#${id}-cur', { x: ${tx - 6}, y: ${ty - 4}, duration: 1.05, ease: 'power2.inOut' }, ${r2(t + 0.8)});`)
  tw(`tl.to('#${id}-cur', { scale: 0.82, duration: 0.1, yoyo: true, repeat: 1 }, ${r2(t + 1.9)});`)
  tw(`tl.fromTo('#${id}-rp', { scale: 0.3, opacity: 0.95 }, { scale: 1.7, opacity: 0, duration: 0.5, ease: 'power2.out' }, ${r2(t + 1.92)});`)
  tw(`tl.to('#${id}-inner', { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, ${r2(t + 2.2)});`)
  tw(`tl.to('#${id}-cur', { opacity: 0, duration: 0.2 }, ${r2(t + 2.25)});`)
  if (innerPan > 0) tw(`tl.to('#${id}-inner', { y: ${r2(-innerPan * S)}, duration: 2.2, ease: 'power1.inOut' }, ${r2(t + 2.55)});`)
  else tw(`tl.fromTo('#${id}-inner', { scale: 1 }, { scale: 1.05, duration: 2.4, ease: 'none', transformOrigin: '50% 0%' }, ${r2(t + 2.5)});`)
  tw(`tl.to('#${id}-mob', { y: ${r2(-mobPan)}, duration: 4.1, ease: 'power1.inOut' }, ${r2(t + 0.6)});`)
}
// 6) 10개 전부 — 화면 벽
{
  const s = scene('s-wall')
  const row = (items, rid) =>
    `<div class="wall-row" id="${rid}">${items.map(([slug, name]) => `<figure class="wcard"><img src="assets/shots/${slug}-top.jpg" alt=""><figcaption>${esc(name)}</figcaption></figure>`).join('')}</div>`
  const A = WALL.slice(0, 5), B = WALL.slice(5), C = [WALL[7], WALL[1], WALL[9], WALL[3], WALL[5]]
  html += `<section ${attrs(s)}>
    <div class="wall" id="wall">${row(A, 'w1')}${row(B, 'w2')}${row(C, 'w3')}</div>
    <div class="wall-shade"></div>
    <div class="big top" id="wall-big">${lines(['10개 전부,', '<em class="peach">실제로 작동</em>해요'])}</div>
    <p class="fine wall-fine" id="wall-fine">미래AI랩이 직접 만든 자체 데모 10종 · 고객사 사례가 아니에요</p>
  </section>`
  inout(s)
  tw(`tl.fromTo('#w1', { x: 40 }, { x: -700, duration: ${s.dur}, ease: 'none' }, ${s.start});`)
  tw(`tl.fromTo('#w2', { x: -900 }, { x: -160, duration: ${s.dur}, ease: 'none' }, ${s.start});`)
  tw(`tl.fromTo('#w3', { x: -120 }, { x: -860, duration: ${s.dur}, ease: 'none' }, ${s.start});`)
  tw(`tl.from('#wall .wcard', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.out', stagger: 0.03 }, ${r2(s.start + 0.05)});`)
  reveal('#wall-big .ln > span', s.start + 0.35, 0.14)
  rise('#wall-fine', s.start + 1.1)
}
// 7) 말 대신 눌러서
{
  const s = scene('s-proof')
  html += `<section ${attrs(s)}>
    <div class="big top" id="pf-big">${lines(['말 대신,', '<em class="peach">눌러서</em> 보여 주세요'])}</div>
    <div class="pf-doc" id="pf-doc">
      <p class="doc-t">사업계획서</p>
      <i style="width:92%"></i><i style="width:80%"></i><i style="width:88%"></i><i style="width:64%"></i><i style="width:84%"></i><i style="width:72%"></i><i style="width:90%"></i><i style="width:56%"></i>
      <p class="doc-q">“이런 서비스를 만들 계획입니다…”</p>
    </div>
    <p class="pf-cap left" id="pf-cap1">말로만 하던 사업계획</p>
    <div class="pf-arr" id="pf-arr">→</div>
    <div class="pf-dev" id="pf-dev">
      <div class="bar"><i></i><i></i><i></i></div>
      <div class="vp2"><img src="assets/shots/stylecheck-inner.jpg" alt=""></div>
      <svg class="cursor" id="pf-cur" viewBox="0 0 24 24" width="40" height="40"><path d="M4 2.5 L4 19 L8.6 14.8 L11.6 21.4 L14.4 20.2 L11.4 13.7 L17.6 13.4 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>
      <div class="ripple" id="pf-rp" style="left:250px;top:140px"></div>
    </div>
    <p class="pf-cap right" id="pf-cap2">눈에 보이는 근거</p>
    <span class="chip c1" id="pf-ch1">심사위원 앞에서</span>
    <span class="chip c2" id="pf-ch2">투자자 앞에서</span>
  </section>`
  inout(s); reveal('#pf-big .ln > span', s.start + 0.15, 0.14)
  rise('#pf-doc', s.start + 0.7); rise('#pf-cap1', s.start + 1.0)
  tw(`tl.from('#pf-arr', { x: -40, opacity: 0, duration: 0.45, ease: 'power2.out' }, ${r2(s.start + 1.5)});`)
  tw(`tl.to('#pf-doc', { opacity: 0.45, duration: 0.5 }, ${r2(s.start + 1.6)});`)
  tw(`tl.from('#pf-dev', { scale: 0.9, opacity: 0, duration: 0.55, ease: 'back.out(1.6)' }, ${r2(s.start + 1.75)});`)
  tw(`tl.fromTo('#pf-cur', { x: 330, y: 260, opacity: 0 }, { opacity: 1, duration: 0.2 }, ${r2(s.start + 2.3)});`)
  tw(`tl.to('#pf-cur', { x: 244, y: 136, duration: 0.7, ease: 'power2.inOut' }, ${r2(s.start + 2.4)});`)
  tw(`tl.fromTo('#pf-rp', { scale: 0.3, opacity: 0.95 }, { scale: 1.7, opacity: 0, duration: 0.5, ease: 'power2.out' }, ${r2(s.start + 3.12)});`)
  tw(`tl.to('#pf-cur', { scale: 0.82, duration: 0.1, yoyo: true, repeat: 1 }, ${r2(s.start + 3.1)});`)
  tw(`tl.from(['#pf-ch1', '#pf-ch2'], { y: 20, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)', stagger: 0.2 }, ${r2(s.start + 3.4)});`)
  rise('#pf-cap2', s.start + 3.9)
}
// 8) 2주 · 3단계
{
  const s = scene('s-steps')
  const STEPS = [['기술사업 아이디어', '지금 하는 사업에서 찾아요'], ['작동하는 MVP', '직접 눌러 볼 수 있는 첫 버전'], ['벤처기업확인 신청', '신청까지 함께 준비해요']]
  html += `<section ${attrs(s)}>
    <div class="two" id="st-two"><b>2주</b><span>안에<br>함께해요</span></div>
    <span class="pill ghost st-chip" id="st-chip">9년 차 경영컨설턴트 1:1 설계</span>
    <ol class="steps" id="st-list">${STEPS.map(([a, b], i) => `<li><span class="no">${i + 1}</span><div><p class="st-a">${a}</p><p class="st-b">${b}</p></div><span class="ok">✓</span></li>`).join('')}</ol>
    <p class="fine st-fine" id="st-fine">*2주는 자료 준비와 결정이 원활할 때의 목표 일정이에요.</p>
  </section>`
  inout(s)
  tw(`tl.from('#st-two b', { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(1.8)', transformOrigin: '0% 70%' }, ${r2(s.start + 0.15)});`)
  tw(`tl.from('#st-two span', { x: -20, opacity: 0, duration: 0.45, ease: 'power2.out' }, ${r2(s.start + 0.45)});`)
  rise('#st-chip', s.start + 0.8)
  tw(`tl.from('#st-list li', { x: -40, opacity: 0, duration: 0.45, ease: 'power2.out', stagger: 0.45 }, ${r2(s.start + 1.3)});`)
  tw(`tl.from('#st-list .ok', { scale: 0, duration: 0.3, ease: 'back.out(2.5)', stagger: 0.45 }, ${r2(s.start + 1.65)});`)
  rise('#st-fine', s.start + 3.2)
}
// 9) 가격
{
  const s = scene('s-price')
  html += `<section ${attrs(s)}>
    <p class="eyebrow" id="pr-eb">런칭 파트너 모집</p>
    <div class="big" id="pr-big">${lines(['선착순', '<em class="orange">5개사</em>만'])}</div>
    <div class="price" id="pr-card">
      <p class="was" id="pr-was">정상가 500만원<i id="pr-strike"></i></p>
      <p class="now"><span class="who">런칭 파트너</span><b id="pr-now">300만원</b></p>
    </div>
  </section>`
  inout(s); rise('#pr-eb', s.start + 0.1); reveal('#pr-big .ln > span', s.start + 0.2, 0.14)
  rise('#pr-card', s.start + 0.9)
  tw(`tl.from('#pr-strike', { scaleX: 0, duration: 0.45, ease: 'power2.inOut', transformOrigin: '0% 50%' }, ${r2(s.start + 1.6)});`)
  tw(`tl.from('#pr-now', { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', transformOrigin: '0% 80%' }, ${r2(s.start + 2.1)});`)
}
// 10) 상담
{
  const s = scene('s-cta')
  html += `<section ${attrs(s)}>
    <p class="cta-q" id="cta-q">우리 회사도 가능할까요?</p>
    <div class="cta-btn" id="cta-btn">무료로 상담받기 <span>→</span></div>
    <p class="cta-url" id="cta-url">miraeailab.com</p>
    <div class="cta-logo" id="cta-logo"><img src="assets/logo.png" alt="미래에이아이랩"></div>
    <p class="fine cta-fine" id="cta-fine">2주는 자료 준비와 결정이 원활할 때의 목표 일정이에요.<br>벤처기업확인 여부는 확인기관 심사로 정해집니다.<br>영상 속 화면은 미래AI랩 자체 데모이며 고객사 사례가 아니에요.</p>
  </section>`
  tw(`tl.fromTo('#${s.id}', { opacity: 0 }, { opacity: 1, duration: 0.25 }, ${s.start});`)
  rise('#cta-q', s.start + 0.1)
  tw(`tl.from('#cta-btn', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, ${r2(s.start + 0.4)});`)
  tw(`tl.to('#cta-btn', { scale: 1.04, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 3 }, ${r2(s.start + 1.1)});`)
  rise('#cta-url', s.start + 0.8); rise('#cta-logo', s.start + 1.0); rise('#cta-fine', s.start + 1.3)
}
// 자막
let subs = ''
SUBS.forEach(([a, b, t], i) => {
  subs += `<div class="clip sub" id="sub${i}" data-start="${a}" data-duration="${r2(b - a)}" data-track-index="9"><span>${esc(t).split('\n').join('<br>')}</span></div>`
  tw(`tl.from('#sub${i} span', { y: 14, opacity: 0, duration: 0.18, ease: 'power1.out' }, ${a});`)
})

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
.glow1 { position: absolute; right: -260px; top: -300px; width: 820px; height: 820px; border-radius: 50%; background: radial-gradient(circle, rgba(212,122,74,.33), rgba(212,122,74,0) 66%); }
.glow2 { position: absolute; left: -280px; bottom: -320px; width: 760px; height: 760px; border-radius: 50%; background: radial-gradient(circle, rgba(232,184,154,.12), rgba(232,184,154,0) 66%); }
.clip { position: absolute; inset: 0; }
.brand { position: absolute; top: 44px; left: 60px; right: 60px; height: 66px; display: flex; align-items: center; justify-content: space-between; z-index: 30; }
.brand .logo { height: 66px; padding: 10px 18px; background: #fff; border-radius: 14px; display: flex; align-items: center; }
.brand .logo img { height: 46px; }
.brand .tag { font-size: 28px; font-weight: 700; color: #E8B89A; display: flex; align-items: center; gap: 10px; }
.brand .tag::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: #D47A4A; }
em { font-style: normal; }
.peach { color: #E8B89A; } .orange { color: #E8894F; }
.eyebrow { position: absolute; left: 90px; top: 420px; font-size: 40px; font-weight: 700; color: #E8B89A; }
.big { position: absolute; left: 90px; right: 70px; top: 500px; font-size: 128px; font-weight: 900; line-height: 1.16; letter-spacing: -0.035em; }
.big.mid { top: 300px; font-size: 118px; }
.big.top { top: 170px; font-size: 104px; }
.ln { overflow: hidden; padding-bottom: 6px; }
.ln > span { display: inline-block; }
.fine { position: absolute; left: 90px; right: 90px; font-size: 27px; font-weight: 500; color: #7C8591; line-height: 1.5; }
#pro-fine { top: 930px; }
#no-big { top: 330px; }
#pr-eb { top: 200px; }
.flow { position: absolute; left: 90px; top: 760px; display: flex; align-items: center; gap: 18px; }
.pill { display: inline-flex; align-items: center; height: 76px; padding: 0 32px; border-radius: 999px; font-size: 36px; font-weight: 800; }
.pill.ghost { background: rgba(255,255,255,.07); color: #E5E8EC; box-shadow: inset 0 0 0 2px rgba(255,255,255,.16); }
.pill.hot { background: #D47A4A; color: #171B20; }
.flow-arr { font-size: 44px; font-weight: 900; color: #E8894F; }
.lead { position: absolute; left: 90px; top: 890px; font-size: 42px; font-weight: 600; line-height: 1.45; color: #C9CED6; }
/* 데모 */
.d-head { position: absolute; left: 60px; right: 60px; top: 150px; }
.d-count { font-size: 31px; font-weight: 700; color: #8A939C; }
.d-count b { color: #E8B89A; }
.d-from { margin-top: 16px; font-size: 43px; font-weight: 600; color: #AEB6C0; display: flex; align-items: center; gap: 14px; }
.d-from .lbl { font-size: 26px; font-weight: 800; color: #E8B89A; padding: 7px 14px; border-radius: 999px; box-shadow: inset 0 0 0 2px rgba(232,184,154,.45); }
.d-to { margin-top: 10px; font-size: 62px; font-weight: 900; letter-spacing: -0.03em; line-height: 1.15; }
.browser { position: absolute; left: 60px; top: 400px; width: ${BW}px; border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08); }
.bar { height: 44px; background: #EEF0F3; display: flex; align-items: center; gap: 8px; padding: 0 16px; border-bottom: 1px solid #DDE1E6; }
.bar i { width: 12px; height: 12px; border-radius: 50%; background: #F2A0A0; } .bar i:nth-child(2) { background: #F5D07A; } .bar i:nth-child(3) { background: #8FD6A8; }
.bar .url { margin-left: 14px; height: 30px; padding: 0 14px; border-radius: 8px; background: #fff; font-size: 19px; font-weight: 700; color: #343B44; display: flex; align-items: center; }
.bar .url em { color: #9AA3AD; font-weight: 600; margin-left: 4px; }
.vp { position: relative; height: ${VPH}px; overflow: hidden; background: #fff; }
.shot { position: absolute; left: 0; top: 0; width: ${BW}px; display: block; }
.cursor { position: absolute; left: 0; top: 0; z-index: 5; filter: drop-shadow(0 3px 6px rgba(0,0,0,.35)); transform-origin: 20% 10%; }
.ripple { position: absolute; width: 90px; height: 90px; margin: -45px 0 0 -45px; border-radius: 50%; border: 5px solid #D47A4A; background: rgba(212,122,74,.18); opacity: 0; z-index: 4; }
.phone { position: absolute; left: 800px; top: 560px; width: ${PHONE_W}px; height: ${PHONE_H}px; padding: ${PHONE_PAD}px; border-radius: 38px; background: #0E1114; box-shadow: 0 30px 70px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.12); z-index: 6; }
.phone .screen { width: 100%; height: 100%; border-radius: 30px; overflow: hidden; background: #fff; position: relative; }
.mob { position: absolute; left: 0; top: 0; width: ${MOB_W}px; display: block; }
/* 벽 */
.wall { position: absolute; left: 0; right: 0; top: 470px; }
.wall-row { display: flex; gap: 24px; margin-bottom: 24px; width: max-content; }
.wcard { position: relative; width: 400px; height: 250px; border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 18px 40px rgba(0,0,0,.45); }
.wcard img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.wcard figcaption { position: absolute; left: 12px; bottom: 12px; padding: 6px 14px; border-radius: 999px; background: rgba(23,27,32,.85); font-size: 22px; font-weight: 800; color: #fff; }
.wall-shade { position: absolute; left: 0; right: 0; top: 0; height: 560px; background: linear-gradient(#171B20 62%, rgba(23,27,32,0)); }
.wall-fine { top: 408px; color: #AEB6C0; }
/* 말 대신 */
.pf-doc { position: absolute; left: 60px; top: 560px; width: 360px; height: 420px; padding: 34px 32px; border-radius: 22px; background: #F4F1EC; color: #343B44; }
.pf-doc .doc-t { font-size: 34px; font-weight: 900; margin-bottom: 22px; }
.pf-doc i { display: block; height: 14px; border-radius: 7px; background: #D9D4CC; margin-bottom: 16px; }
.pf-doc .doc-q { margin-top: 18px; font-size: 22px; font-weight: 600; color: #8A857D; }
.pf-cap { position: absolute; top: 1010px; font-size: 32px; font-weight: 800; }
.pf-cap.left { left: 60px; width: 360px; text-align: center; color: #8A939C; }
.pf-cap.right { left: 520px; width: 500px; text-align: center; color: #E8894F; }
.pf-arr { position: absolute; left: 430px; top: 720px; font-size: 80px; font-weight: 900; color: #E8894F; }
.pf-dev { position: absolute; left: 520px; top: 600px; width: 500px; border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 30px 70px rgba(0,0,0,.55); }
.pf-dev .vp2 { height: 312px; overflow: hidden; }
.pf-dev .vp2 img { width: 500px; display: block; }
.chip { position: absolute; padding: 12px 22px; border-radius: 999px; font-size: 28px; font-weight: 900; box-shadow: 0 12px 30px rgba(0,0,0,.4); z-index: 8; }
.chip.c1 { left: 560px; top: 530px; background: #E8B89A; color: #171B20; }
.chip.c2 { left: 800px; top: 920px; background: #D47A4A; color: #171B20; }
/* 2주 */
.two { position: absolute; left: 90px; top: 170px; display: flex; align-items: flex-end; gap: 28px; }
.two b { font-size: 260px; font-weight: 900; line-height: .9; letter-spacing: -0.05em; color: #E8894F; }
.two span { font-size: 64px; font-weight: 900; line-height: 1.15; padding-bottom: 14px; }
.st-chip { position: absolute; left: 90px; top: 470px; height: 64px; font-size: 30px; }
.steps { position: absolute; left: 90px; right: 90px; top: 590px; list-style: none; }
.steps li { display: flex; align-items: center; gap: 26px; height: 128px; padding: 0 30px; margin-bottom: 22px; border-radius: 26px; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.steps .no { width: 64px; height: 64px; border-radius: 50%; background: #D47A4A; color: #171B20; font-size: 34px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex: none; }
.steps .st-a { font-size: 46px; font-weight: 900; letter-spacing: -0.02em; }
.steps .st-b { margin-top: 4px; font-size: 29px; font-weight: 600; color: #AEB6C0; }
.steps .ok { margin-left: auto; font-size: 44px; font-weight: 900; color: #8FD6A8; }
.st-fine { top: 1060px; }
/* 가격 */
#pr-eb { top: 200px; }
#pr-big { top: 270px; font-size: 120px; }
.price { position: absolute; left: 90px; right: 90px; top: 600px; padding: 44px 48px; border-radius: 34px; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12); }
.price .was { position: relative; display: inline-block; font-size: 50px; font-weight: 800; color: #8A939C; }
.price .was i { position: absolute; left: -4px; right: -4px; top: 52%; height: 6px; border-radius: 3px; background: #D47A4A; }
.price .now { margin-top: 22px; display: flex; flex-direction: column; gap: 6px; }
.price .who { font-size: 52px; font-weight: 900; }
.price .now b { display: inline-block; align-self: flex-start; font-size: 200px; font-weight: 900; line-height: 1; letter-spacing: -0.04em; color: #E8894F; }
/* 상담 */
.cta-q { position: absolute; left: 0; right: 0; top: 300px; text-align: center; font-size: 76px; font-weight: 900; letter-spacing: -0.03em; }
.cta-btn { position: absolute; left: 130px; right: 130px; top: 460px; height: 150px; border-radius: 34px; background: #D47A4A; color: #171B20; font-size: 62px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 18px; box-shadow: 0 24px 70px rgba(212,122,74,.45); }
.cta-url { position: absolute; left: 0; right: 0; top: 660px; text-align: center; font-size: 44px; font-weight: 800; color: #E8B89A; letter-spacing: .01em; }
.cta-logo { position: absolute; left: 50%; top: 770px; width: 420px; margin-left: -210px; padding: 16px 26px; border-radius: 20px; background: #fff; }
.cta-logo img { width: 100%; display: block; }
.cta-fine { top: 950px; text-align: center; font-size: 26px; }
/* 자막 */
.sub { display: flex; align-items: flex-end; justify-content: center; padding: 0 50px 50px; z-index: 40; }
.sub span { max-width: 980px; padding: 16px 32px; border-radius: 20px; background: rgba(8,10,13,.9); font-size: 50px; font-weight: 700; line-height: 1.38; text-align: center; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
  <div class="glow1"></div><div class="glow2"></div>
  <div class="brand"><span class="logo"><img src="assets/logo.png" alt="미래에이아이랩"></span><span class="tag">2주 기술사업 빌드</span></div>
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

// 자막 파일(SRT) · 대본
const ts = (x) => {
  const ms = Math.round(x * 1000), h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s2 = Math.floor((ms % 60000) / 1000), f = ms % 1000
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s2).padStart(2, '0')},${String(f).padStart(3, '0')}`
}
writeFileSync(new URL('./subtitles.srt', import.meta.url), SUBS.map(([a, b, t], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${t}\n`).join('\n'))
const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`
writeFileSync(
  new URL('./script.md', import.meta.url),
  `# 2주 기술사업 빌드 — 1분 소개 영상 대본 (${TOTAL}초)\n\n녹음할 때 아래 문장을 시간에 맞춰 읽으면 자막과 맞아요.\n\n| 시간 | 읽을 문장 |\n|---|---|\n${SUBS.map(([a, b, t]) => `| ${mmss(a)}–${mmss(b)} | ${t.replace(/\n/g, ' ')} |`).join('\n')}\n`,
)
console.log('index.html · subtitles.srt · script.md 생성', SCENES.length, '장면', SUBS.length, '자막')
