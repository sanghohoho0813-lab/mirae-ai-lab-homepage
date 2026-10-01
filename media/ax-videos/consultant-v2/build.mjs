// 컨설턴트 운영 OS 소개 — '컨설턴트이신가요?' 페이지의 상세 페이지 대신 넣는 영상(대표님 녹음, 1.08배, 9:16)
// 톤: AX 영상 1·2 고급판과 같게(먹색 + 샴페인 골드, 유리 카드, 부드러운 전환).
// ⚠️ 실제 OS 화면은 거의 보여 주지 않는다 — '직접 쓰고 있다'는 말에 흐린 화면 한 번, 모듈 목록 한 번(사이드바·영업·정산 제외)뿐.
//    나머지 OS 화면은 색감(짙은 청록 사이드바 + 밝은 회색 + 청록 포인트)만 살려 새로 그린 '예시 화면 · 가상 데이터'.
//    영업 관리·영업자 정산 화면은 쓰지 않는다. 수수료·이익률은 ••• 로만.
import { createBuild, r2, ic } from '../lib/lib.mjs'
import { kit } from '../lib/kit.mjs'
import { kit2 } from '../lib/kit2.mjs'
import { kit3 } from '../lib/kit3.mjs'

const TITLE = '컨설턴트 운영 OS · 미래AI랩 OS'
const B = createBuild('.', { title: TITLE, tag: '컨설턴트님께 · 11월 오픈 예정', premium: true })
const K = kit(B)
const X = kit2(B, K)
const P = kit3(B, K)
const { T, C, wt, freeze, tw, from, to } = B
const H = P.heads
const c = (s) => { const [b, l, p] = s.split('.').map(Number); return C(b, l, p ?? 0).start }
const w = (needle, f) => wt(needle, typeof f === 'string' ? c(f) : f)
const EX = '예시 화면 · 가상 데이터'
function fzBefore(b, l, label, sub = '') {
  const [s0, e0] = B.silBefore(b, l)
  const s = r2(s0 + 0.05), e = r2(e0 - 0.2)
  freeze(s, e - s, label, sub)
  return [s, e]
}

B.addCssLast(`
/* OS 예시 화면 — 실제 OS 색감(짙은 청록 + 밝은 회색 + 청록 포인트)만 살렸다 */
.os { position: absolute; left: 90px; right: 90px; border-radius: 34px; overflow: hidden; background: #F5F7F8; color: #17202A; box-shadow: 0 50px 110px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.12); }
.os .oh { display: flex; align-items: center; gap: 16px; padding: 26px 34px; background: #0F3D44; color: #fff; }
.os .oh small { font-size: 20px; font-weight: 700; letter-spacing: .14em; color: #8FC9C9; }
.os .oh b { font-size: 36px; font-weight: 800; letter-spacing: -0.02em; }
.os .oh em { margin-left: auto; padding: 6px 14px; border-radius: 10px; background: rgba(255,255,255,.12); font-size: 20px; font-weight: 700; color: #CDE6E6; }
.os .ob { display: flex; flex-direction: column; gap: 16px; padding: 26px 28px 30px; }
.os .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.os .tl { padding: 20px 24px; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 1.5px #E3E9EC; }
.os .tl small { display: block; font-size: 24px; font-weight: 600; color: #6B7680; }
.os .tl b { display: block; margin-top: 6px; font-size: 42px; font-weight: 800; letter-spacing: -0.02em; color: #0E5E63; }
.os .ln { display: flex; align-items: center; gap: 18px; padding: 20px 24px; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 1.5px #E3E9EC; font-size: 32px; font-weight: 700; }
.os .ln .ic { width: 44px; height: 44px; color: #0E7C80; }
.os .ln small { margin-left: auto; font-size: 24px; font-weight: 700; color: #6B7680; white-space: nowrap; }
.os .ln.hot { background: #E6F3F3; box-shadow: inset 0 0 0 2px #0E7C80; }
.os .ln .cp { margin-left: auto; padding: 8px 18px; border-radius: 12px; background: #0E7C80; color: #fff; font-size: 24px; font-weight: 800; }
.os .tag { display: inline-flex; padding: 6px 14px; border-radius: 10px; background: #FFF4E5; color: #A5651C; font-size: 22px; font-weight: 800; }
.os .drop { padding: 26px; border-radius: 22px; border: 3px dashed #9CCFCF; background: #EEF7F7; text-align: center; font-size: 30px; font-weight: 700; color: #0E7C80; }
.flyfile { position: absolute; display: inline-flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 18px; background: #F2EDE6; color: #15181D; font-size: 30px; font-weight: 800; box-shadow: 0 20px 50px rgba(0,0,0,.4); }
.flyfile .ic { width: 40px; height: 40px; color: #A5703C; }
.copied { position: absolute; padding: 12px 22px; border-radius: 14px; background: #0F3D44; color: #fff; font-size: 26px; font-weight: 800; box-shadow: 0 16px 40px rgba(0,0,0,.35); }
/* 진행 보드 */
.board { position: absolute; left: 60px; right: 60px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.board .col { display: flex; flex-direction: column; gap: 12px; padding: 16px 12px 20px; border-radius: 22px; background: rgba(255,255,255,.04); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.08); min-height: 520px; }
.board .col > b { text-align: center; font-size: 28px; font-weight: 700; color: #A9B0B8; padding-bottom: 6px; }
.board .cd { padding: 16px 14px; border-radius: 16px; background: #F5F7F8; color: #17202A; font-size: 26px; font-weight: 800; box-shadow: 0 12px 30px rgba(0,0,0,.3); }
.board .cd small { display: block; margin-top: 4px; font-size: 20px; font-weight: 600; color: #6B7680; }
.board .cd.on { box-shadow: 0 0 0 3px #D8A871, 0 12px 30px rgba(0,0,0,.3); }
/* 커스텀 폰(OS 예시) */
.mph { position: absolute; padding: 8px; border-radius: 42px; background: #06080B; box-shadow: 0 50px 110px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.16); }
.mph .scr { position: relative; width: 380px; height: 822px; border-radius: 34px; overflow: hidden; background: #F5F7F8; color: #17202A; }
.mph .top { padding: 54px 24px 20px; background: #0F3D44; color: #fff; } .mph .top small { display: block; font-size: 16px; letter-spacing: .14em; color: #8FC9C9; font-weight: 700; } .mph .top b { font-size: 30px; font-weight: 800; }
.mph .rows { display: flex; flex-direction: column; gap: 12px; padding: 18px 16px; }
.mph .r { display: flex; align-items: center; gap: 10px; padding: 16px 16px; border-radius: 16px; background: #fff; box-shadow: inset 0 0 0 1.5px #E3E9EC; font-size: 22px; font-weight: 700; }
.mph .r small { display: block; font-size: 17px; font-weight: 600; color: #6B7680; } .mph .r i.cp { margin-left: auto; font-style: normal; padding: 6px 12px; border-radius: 10px; background: #0E7C80; color: #fff; font-size: 17px; font-weight: 800; }
.mph .r.hot { background: #E6F3F3; box-shadow: inset 0 0 0 2px #0E7C80; }
.mph .push { position: absolute; left: 12px; right: 12px; top: 14px; display: flex; gap: 12px; align-items: center; padding: 16px; border-radius: 22px; background: rgba(242,237,230,.97); color: #15181D; box-shadow: 0 16px 40px rgba(0,0,0,.35); font-size: 20px; font-weight: 700; z-index: 3; }
.mph .push .ic { width: 40px; height: 40px; padding: 8px; border-radius: 12px; background: #D8A871; color: #15110C; } .mph .push b { display: block; font-size: 22px; font-weight: 800; }
/* 문장 사슬 */
.chain2 { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 16px 12px; max-width: 920px; }
.chain2 span { padding: 18px 28px; border-radius: 22px; font-size: 38px; font-weight: 700; color: #EDE3D4; background: rgba(255,255,255,.05); box-shadow: inset 0 0 0 1.5px rgba(216,168,113,.35); white-space: nowrap; }
.chain2 i { font-style: normal; font-size: 38px; color: #D8A871; }
.fm { position: absolute; left: 110px; right: 110px; padding: 36px 36px 40px; border-radius: 36px; background: #F2EDE6; color: #15181D; box-shadow: 0 50px 110px rgba(0,0,0,.5); }
.fm h4 { font-size: 44px; font-weight: 800; letter-spacing: -0.03em; } .fm p { margin-top: 6px; font-size: 26px; font-weight: 600; color: #7A6A55; }
.fm .fi { margin-top: 18px; padding: 22px 26px; border-radius: 18px; background: #fff; box-shadow: inset 0 0 0 1.5px rgba(21,24,29,.08); font-size: 32px; font-weight: 700; color: #9AA1A9; }
.fm .fi b { color: #15181D; font-weight: 800; margin-right: 18px; }
.fm .fb { margin-top: 26px; padding: 26px; border-radius: 20px; background: #15181D; color: #E6C396; text-align: center; font-size: 34px; font-weight: 800; }
`)

// ━━ ① 고민
{ const t = 0
  P.scene(t, [P.eyebrow('매달 돌아오는 질문', 330, 0.1), H([{ at: c('1.1.1'), text: '이번 달 계약,<br>다음 달 계약', size: 'l' }], { y: 440 }), H([{ at: c('1.1.2'), text: '*걱정* 없으신가요?', size: 'l' }], { y: 800 })], { bg: 'bgA', cam: 'in' }) }
{ const t = c('1.2.0')
  const g = P.cards([{ ic: 'building', label: '회사에서 받는 DB', at: w('회사에서', '1.3.0') }, { ic: 'money', label: '직접 구매하는 DB', at: w('구매하는', '1.3.0') }], { y: 520 })
  P.scene(t, [H([{ at: t + 0.1, text: '매달 *계약*은 해야 하고', size: 's' }, { at: c('1.2.1'), text: '신규 *DB*는 계속 구해야', size: 's' }], { y: 300 }), g.html,
    H([{ at: c('1.3.1'), text: '계약으로 이어지는 건<br>*또 별개*', size: 'm' }], { y: 880 })], { bg: 'bgB', trans: 'fade' }) }
K.link(c('1.4.0'), { a: { ic: 'chat', label: '상담' }, b: { ic: 'doc', label: '계약', cls: 'hot' }, mid: 'q', linkAt: c('1.4.1'), y: 560,
  extra: H([{ at: c('1.4.0') + 0.1, text: '상담이 들어와도', size: 's' }, { at: w('끌고', '1.4.1') - 0.2, text: '계약까지는 *쉽지 않다*', size: 's' }], { y: 300 }), shot: { bg: 'bgA', trans: 'fade' } })
{ const t = c('1.5.0')
  const g = P.cards([{ ic: 'target', label: '새 고객 찾기', sub: '늘 바쁘고', bar: 0.92, at: t + 0.3 },
    { ic: 'users', label: '이미 계약한 고객', sub: '제대로 못 챙기는 일도', bar: 0.18, at: c('1.5.1'), checkAt: w('챙기지', '1.5.2'), x: true }], { y: 520 })
  P.scene(t, [H([{ at: t + 0.1, text: '늘 *새 고객*을 찾아다니느라', size: 's' }], { y: 300 }), g.html], { bg: 'bgD', trans: 'fade' }) }
{ const t = c('1.6.0')
  const g = P.cards([{ ic: 'doc', label: '추가 계약', at: w('추가', '1.6.1') - 0.1 }, { ic: 'link', label: '소개', at: w('소개를', '1.6.1') - 0.1 }], { layout: 'row', y: 460 })
  P.scene(t, [P.eyebrow('오늘 영상에서는', 330, t + 0.05), g.html.replace('gcards row', 'gcards row two'), H([{ at: c('1.6.2'), text: '이어 가는 데 *도움이 될* 이야기', size: 's' }], { y: 900 })], { bg: 'bgC', trans: 'fade' }) }
P.title(B.silBefore(2, 1)[0] + 0.05, { no: '컨설턴트님께', title: '추가 계약과<br>*소개*가 이어지는 관리' })

// ━━ ② 잘하시는 분들의 공통점
K.chapter(c('2.1.0'), '잘하시는 분들의 공통점')
{ const t = c('2.1.0')
  P.scene(t, [P.number({ from: 0, to: 9, suf: '년 차', y: 360, at: w('9년', t) - 0.1, d: 0.7, cls: 'mid' }), H([{ at: t + 0.4, text: '경영컨설턴트', size: 'm' }, { at: c('2.2.1'), text: '영업을 *아주 잘하는*<br>사람은 아니에요', size: 'm' }], { y: 680 })], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('2.3.0')
  P.scene(t, [P.dots(70, 10, 360, t + 0.2, 0.012), H([{ at: t + 0.4, text: '잘하시는 분들을<br>*정말 많이* 봐 왔어요', size: 'm' }], { y: 880 })], { bg: 'bgB', trans: 'fade' }) }
{ const t = c('2.4.0')
  const g = P.cards([{ ic: 'users', label: '이미 계약한 고객을 챙긴다', hl: true, at: c('2.4.1') },
    { ic: 'doc', label: '추가 계약', at: c('2.5.0'), checkAt: c('2.5.0') + 0.4 }, { ic: 'link', label: '소개', at: c('2.5.1'), checkAt: c('2.5.1') + 0.3 }], { y: 440 })
  P.scene(t, [P.eyebrow('잘하시는 분들은', 330, t + 0.05), g.html, H([{ at: c('2.6.0'), text: '여기까지는 *다들 아시죠*', size: 's' }], { y: 980 })], { bg: 'bgC', trans: 'fade' }) }
fzBefore(3, 1, '이미 계약한 고객을 챙긴다', '그러면 추가 계약 · 소개')

// ━━ ③ 관리가 어려운 이유
K.chapter(c('3.1.0'), '관리가 어려운 이유')
{ const t = c('3.1.0')
  P.scene(t, [P.licon('q', 360, t + 0.05), H([{ at: t + 0.1, text: '관리가 말처럼<br>*쉽지 않죠*', size: 'l' }, { at: c('3.2.0'), text: '대부분 *주먹구구*', size: 'l' }, { at: c('3.2.1'), text: '감과 기억에<br>*의존*', size: 'l' }], { y: 640 })], { bg: 'bgA', trans: 'fade' }) }
K.scatter(c('3.3.0'), { items: [
  { ic: 'chat', label: '카톡', x: 100, y: 420, r: -4, at: w('카톡', '3.3.0') }, { ic: 'doc', label: '메일', x: 640, y: 440, r: 3, at: w('메일', '3.3.0') },
  { ic: 'cloud', label: '사진첩', x: 360, y: 600, r: -2, at: w('사진첩에', '3.3.0') }, { ic: 'memo', label: '메모장', x: 90, y: 800, r: 3, at: w('메모장과', '3.3.1') },
  { ic: 'cal', label: '캘린더', x: 640, y: 820, r: -3, at: w('캘린더에', '3.3.1') }],
  extra: P.eyebrow('서류 · 일정이 흩어진 곳', 280, c('3.3.0') + 0.05) + H([{ at: c('3.3.2'), text: '해 드릴 일은<br>*머릿속에만*', size: 'm' }], { y: 1010 }), shot: { bg: 'bgOld', trans: 'fade' } })
{ const t = c('3.4.0')
  const g = P.cards([{ ic: 'chat', label: '자주 찾아가고 식사도', sub: '관계를 챙기는 방법', at: t + 0.2 },
    { ic: 'check', label: '철저하고 체계적인 관리', sub: '가장 잘하는 분들의 공통점', hl: true, at: c('3.4.3'), checkAt: c('3.4.3') + 0.6 }], { y: 480 })
  P.scene(t, [H([{ at: t + 0.1, text: '관계도 중요하지만', size: 's' }, { at: c('3.4.2'), text: '결국 *가장 잘하는 분들*은', size: 's' }], { y: 300 }), g.html], { bg: 'bgB', trans: 'fade' }) }
{ const t = c('4.1.0'), id = K.uid('ch')
  const items = [['고객 폴더 찾고', c('4.1.1')], ['서류 열어 번호 확인', c('4.1.2')], ['신청 사이트 ↔ 파일', c('4.1.3')]]
  items.forEach(([, a], i) => from(`#${id}-${i}`, a, 'opacity: 0, y: 16', 0.7, 'expo.out'))
  P.scene(t, [P.eyebrow('신청을 대행할 때도', 300, t + 0.05),
    `<div class="cx" style="top:420px"><div class="chain2">${items.map(([l], i) => `${i ? `<i id="${id}-a${i}">→</i>` : ''}<span id="${id}-${i}">${l}</span>`).join('')}</div></div>`,
    P.licon('clock', 700, c('4.1.4') - 0.2), H([{ at: c('4.1.4'), text: '시간이 *훌쩍*', size: 'l' }], { y: 920 })], { bg: 'bgOld', trans: 'fade' })
  items.forEach(([, a], i) => { if (i) from(`#${id}-a${i}`, a - 0.1, 'opacity: 0', 0.5, 'power1.out') }) }
K.notifs(c('4.2.0'), { top: 520, items: [{ ic: 'chat', t: '“그거 지난번에 드렸는데요?”', s: '이미 받은 서류를 또 요청', w: '고객', at: c('4.2.1') }, { ic: 'chat', t: '“저희 잘 진행되고 있나요?”', s: '고객이 먼저 묻는다', w: '고객', at: c('4.3.1') }],
  extra: H([{ at: c('4.2.0') + 0.1, text: '그러다 보면', size: 's' }, { at: c('4.3.0'), text: '고객이 *먼저* 묻는다', size: 's' }], { y: 300 }), shot: { bg: 'bgA', trans: 'fade' } })
{ const t = c('4.4.0'), id = K.uid('fd')
  const g = P.cards([{ ic: 'doc', label: '추가 계약', at: t + 0.15 }, { ic: 'link', label: '소개', at: t + 0.3 }], { layout: 'row', y: 520 })
  P.scene(t, [H([{ at: t + 0.1, text: '이런 *틈*이 쌓이면', size: 'm' }], { y: 300 }), `<div id="${id}">${g.html.replace('gcards row', 'gcards row two')}</div>`,
    H([{ at: w('멀어지기', '4.4.1') - 0.2, text: '*멀어지기* 쉽죠', size: 'm' }], { y: 960 })], { bg: 'bgD', trans: 'fade' })
  to(`#${id}`, w('멀어지기', '4.4.1'), 'opacity: 0.25, scale: 0.9, y: 40', 1.2, 'power2.inOut') }
fzBefore(5, 1, '작은 틈이 쌓이면', '추가 계약도, 소개도 멀어진다')

// ━━ ④ 미래AI랩 OS
K.chapter(c('5.1.0'), '미래AI랩 OS')
{ const t = c('5.1.0')
  P.scene(t, [H([{ at: t + 0.1, text: '그래서 *직접*<br>만들고 있습니다', size: 'l' }], { y: 330 }), P.eyebrow('컨설턴트 운영 OS', 760, c('5.2.0')), P.seal('미래AI랩 OS', 830, w('미래의', '5.2.1') - 0.1, 'gold')], { bg: 'bgC', trans: 'fadeBlur' }) }
{ // 5.3 — 실제 OS(흐리게) — '저희도 실무에서 직접 쓰고 있어요'
  const id = K.browser(c('5.3.0'), { src: 'assets/real/os-today-pc.jpg', url: 'MIRAE AI LAB OS', tag: '실제 사용 중 · 화면은 흐리게', top: 460, zoom: 1.08, panX: -20, panY: -10, d: 2.6,
    extra: H([{ at: c('5.3.0') + 0.1, text: '저희도 실무에서 *직접* 써요', size: 's' }], { y: 280 }), shot: { bg: 'bgB', trans: 'fade' } })
  B.addCssLast(`#${id} .vp img { filter: blur(9px) saturate(.85); }`) }
{ // 6.1–6.2 — 고객사 한 화면(예시)
  const t = c('6.1.0'), id = K.uid('cs')
  const html = `${H([{ at: t + 0.1, text: '고객사를 열면 *한 화면*에', size: 's' }], { y: 230 })}
    <div class="os" id="${id}" style="top:380px"><div class="oh"><div><small>MIRAE AI LAB OS</small><br><b>예시 고객사 A</b></div><em>${EX}</em></div><div class="ob">
      <div class="grid" id="${id}-g1"><div class="tl"><small>업종 · 설립</small><b>제조 · 7년 차</b></div><div class="tl"><small>매출 · 영업이익</small><b>24억 · 2.1억</b></div></div>
      <div class="grid" id="${id}-g2"><div class="tl"><small>부채비율</small><b>142%</b></div><div class="tl"><small>기업 신용등급</small><b>BB+</b></div></div>
      <div class="ln" id="${id}-a">${ic('gear')}진행 중 · 정책자금 서류<small>3/5 단계</small></div>
      <div class="ln" id="${id}-b">${ic('cal')}다음 약속<small>10.15 (목) 14:00</small></div>
      <div class="ln hot" id="${id}-c">${ic('bell')}지금 챙길 것 · 재무제표 갱신<small>D-3</small></div></div></div>`
  B.shot(t, html, { bg: 'bgA', trans: 'fade' })
  from(`#${id}`, t + 0.05, 'y: 80, opacity: 0', 0.9, 'expo.out')
  ;[['g1', w('기본', '6.2.0') - 0.2], ['g2', c('6.2.1')], ['a', w('진행', '6.2.2')], ['b', w('다음', '6.2.2')], ['c', c('6.2.3')]].forEach(([k, a]) => from(`#${id}-${k}`, a, 'x: -40, opacity: 0', 0.7, 'expo.out')) }
{ // 6.3 — 서류는 올리기만 하면 정리 · 복사해서 붙여 넣기
  const t = c('6.3.0'), id = K.uid('up')
  const files = [['사업자등록증', 150, 330], ['재무제표 3년', 560, 300], ['4대보험 명부', 340, 250]]
  const html = `${H([{ at: t + 0.1, text: '서류는 *올리기만*', size: 's' }, { at: c('6.3.2'), text: '필요한 정보는 *복사 · 붙여넣기*', size: 's' }], { y: 230 })}
    ${files.map(([l, x, y], i) => `<span class="flyfile" id="${id}-f${i}" style="left:${x}px;top:${y + 80}px">${ic('doc')}${l}</span>`).join('')}
    <div class="os" id="${id}" style="top:520px"><div class="oh"><div><small>MIRAE AI LAB OS</small><br><b>서류함 · 예시 고객사 A</b></div><em>${EX}</em></div><div class="ob">
      <div class="drop" id="${id}-dz">여기에 올리면 알아서 정리돼요</div>
      ${files.map(([l], i) => `<div class="ln" id="${id}-r${i}">${ic('doc')}${l}${i === 0 ? `<span class="cp" id="${id}-cp">복사</span>` : `<small>정리됨</small>`}</div>`).join('')}</div></div>
    <div class="cx" style="top:1150px"><span class="copied" id="${id}-ok" style="position:relative">사업자번호 복사됨 ✓ · 신청 사이트에 붙여넣기</span></div>`
  B.shot(t, html, { bg: 'bgB', trans: 'fade' })
  from(`#${id}`, t + 0.05, 'y: 80, opacity: 0', 0.9, 'expo.out')
  files.forEach((_, i) => {
    const a = t + 0.5 + i * 0.35
    from(`#${id}-f${i}`, a - 0.3, 'y: -60, opacity: 0', 0.5, 'expo.out')
    to(`#${id}-f${i}`, c('6.3.1') - 0.2 + i * 0.12, 'y: 300, scale: 0.6, opacity: 0', 0.6, 'power2.in')
    from(`#${id}-r${i}`, c('6.3.1') + 0.2 + i * 0.15, 'x: -40, opacity: 0', 0.6, 'expo.out')
  })
  tw(`tl.to('#${id}-cp', { scale: 1.12, backgroundColor: '#D8A871', color: '#15110C', duration: 0.2, yoyo: true, repeat: 1 }, ${r2(w('복사해서', '6.3.2'))});`)
  from(`#${id}-ok`, w('복사해서', '6.3.2') + 0.3, 'y: 20, opacity: 0', 0.6, 'expo.out') }
{ // 6.4 — 급한 요청도 폰으로 바로
  const t = c('6.4.0'), id = K.uid('mp')
  const html = `${H([{ at: t + 0.1, text: '폴더를 뒤질 *필요 없이*', size: 's' }, { at: c('6.4.1'), text: '급한 요청도 *폰으로 바로*', size: 's' }], { y: 230 })}
    <div class="mph" id="${id}" style="left:${(1080 - 396) / 2}px;top:340px"><div class="scr">
      <div class="push" id="${id}-p">${ic('chat')}<div><b>고객 · 급한 요청</b>사업자번호랑 설립일 좀 알려 주세요</div></div>
      <div class="top"><small>MIRAE AI LAB OS</small><b>예시 고객사 A</b></div>
      <div class="rows"><div class="r hot" id="${id}-r0"><div><small>사업자등록번호</small>000-00-00000</div><i class="cp">복사</i></div>
        <div class="r" id="${id}-r1"><div><small>설립일</small>2019.03.04</div><i class="cp">복사</i></div>
        <div class="r"><div><small>대표 · 업종</small>○○○ · 제조</div></div><div class="r"><div><small>최근 서류</small>재무제표 3년 · 정리됨</div></div></div></div></div>
    ${K.fineAt(`${id}-f`, EX, 1250)}`
  B.shot(t, html, { bg: 'bgD', trans: 'fade' })
  from(`#${id}`, t + 0.05, 'y: 120, opacity: 0', 0.9, 'expo.out')
  from(`#${id}-p`, c('6.4.1'), 'y: -80, opacity: 0', 0.7, 'expo.out')
  tw(`tl.to('#${id}-r0, #${id}-r1', { scale: 1.03, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.25 }, ${r2(w('꺼내서', '6.4.2'))});`)
  from(`#${id}-f`, t + 0.6, 'opacity: 0', 0.6, 'power1.out') }
{ // 7.1 — 모든 계약 건 진행 단계 + 알림
  const t = c('7.1.0'), id = K.uid('bd')
  const cols = [['상담', [['A사', '첫 미팅']]], ['서류', [['B사', '재무제표 대기'], ['C사', '확인 중']]], ['신청', [['D사', '접수 완료']]], ['결과', [['E사', '결과 안내']]]]
  let n = 0
  const html = `${H([{ at: t + 0.1, text: '모든 계약 건이 *한눈에*', size: 's' }], { y: 230 })}
    <div class="board" id="${id}" style="top:370px">${cols.map(([h, cs]) => `<div class="col"><b>${h}</b>${cs.map(([a, s]) => `<div class="cd" id="${id}-${n++}">${a}<small>${s}</small></div>`).join('')}</div>`).join('')}</div>
    <div class="nstack" style="top:930px"><div class="ntf" id="${id}-n"><span class="nic">${ic('bell')}</span><div><b>내일 B사 서류 마감</b><small>설정해 둔 알림 · 미리 챙기기</small></div><em>알림</em></div></div>
    ${K.fineAt(`${id}-f`, EX, 1300)}`
  B.shot(t, html, { bg: 'bgB', trans: 'fade' })
  tw(`tl.from('[id^="${id}-"].cd', { y: 30, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.12 }, ${r2(t + 0.3)});`)
  tw(`tl.set('#${id}-1', { attr: { class: 'cd on' } }, ${r2(c('7.1.2'))});`)
  from(`#${id}-n`, c('7.1.2') + 0.1, 'y: -60, opacity: 0, scale: 0.95', 0.7, 'expo.out')
  from(`#${id}-f`, t + 0.6, 'opacity: 0', 0.6, 'power1.out') }
K.notifs(c('7.2.0'), { top: 560, items: [{ ic: 'chat', t: '“A사 서류, 오늘 접수했습니다.”', s: '컨설턴트가 먼저 알림', w: '나', c: 'blue', at: c('7.2.1') }],
  extra: H([{ at: c('7.2.0') + 0.1, text: '고객이 묻기 *전에*', size: 'm' }, { at: c('7.2.2'), text: '컨설턴트가 *먼저*', size: 'm' }], { y: 300 }), shot: { bg: 'bgC', trans: 'fade' } })
{ const t = c('7.3.0')
  const g = P.cards([{ ic: 'money', label: '받은 수수료', sub: '••• 만 원', at: t + 0.2 }, { ic: 'cal', label: '날짜', sub: '••. ••', at: w('날짜', t) }, { ic: 'invest', label: '이익률', sub: '•• %', at: c('7.3.1') }], { layout: 'row', y: 460 })
  P.scene(t, [P.eyebrow('계약 건마다', 330, t + 0.05), g.html, K.fineAt('f73', '금액은 가렸어요 · 내 계약 건만 보여요', 1000)], { bg: 'bgA', trans: 'fade' })
  from('#f73', t + 0.8, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('7.4.0')
  const g = P.cards([{ ic: 'q', label: '감과 기억에 의존', at: t + 0.2, checkAt: t + 0.9, x: true }, { ic: 'db', label: '기록이 남는 관리', hl: true, at: t + 0.7, checkAt: t + 1.3 }], { y: 420 })
  P.scene(t, [g.html, H([{ at: c('7.4.1'), text: '보여 드려도 되는 화면은<br>*새 고객 앞에서* 그대로', size: 's' }], { y: 860 })], { bg: 'bgB', trans: 'fade' }) }
fzBefore(8, 1, '감이 아닌 기록으로', '고객이 묻기 전에 먼저')

// ━━ ⑤ 모듈 · AI
K.chapter(c('8.1.0'), '모듈 · AI')
{ const t = c('8.1.0')
  const g = P.cards([{ ic: 'bank', label: '정책자금', at: w('정책자금', t) }, { ic: 'team', label: '고용지원금', at: w('고용지원금', t) }, { ic: 'money', label: '절세', at: w('절세', t) }, { ic: 'shield', label: '기업 인증', at: w('기업', t) }], { y: 360 })
  P.scene(t, [g.html, H([{ at: c('8.1.1'), text: '모듈이 *하나씩* 붙는 중', size: 's' }], { y: 1010 })], { bg: 'bgA', trans: 'fade' }) }
K.steps(c('8.2.0'), { eb: '따로 크게 배우지 않아도', items: [['고객사 정보 넣기', '한 번만', 'db'], ['AI가 다음 단계 안내', '따라가기만', 'ai'], ['서류 · 신청 준비', '체크리스트로', 'check']], active: -1, top: 380,
  activeAt: [c('8.2.0') + 0.8, w('따라가며', '8.2.1'), w('AI를', '8.2.2')], shot: { trans: 'fade' } })
{ const t = c('8.3.0')
  P.scene(t, [P.eyebrow('그래서', 400, t + 0.05), P.seal('나만의 무기', 480, t + 0.2, 'gold'), H([{ at: c('8.3.1'), text: '훨씬 *빨리* 늘린다', size: 'm' }], { y: 860 })], { bg: 'bgC', trans: 'fadeBlur' }) }
{ // 8.4 — AI가 해 드릴 수 있는 일을 먼저 추천(예시)
  const t = c('8.4.0'), id = K.uid('ai')
  const html = `${H([{ at: t + 0.1, text: '고객사 정보만 넣어 두면', size: 's' }, { at: c('8.4.2'), text: '약속 안 한 일도 *먼저*', size: 's' }], { y: 230 })}
    <div class="os" id="${id}" style="top:380px"><div class="oh"><div><small>MIRAE AI LAB OS · AI 추천</small><br><b>해 드릴 수 있는 일</b></div><em>${EX}</em></div><div class="ob">
      <div class="ln" id="${id}-0">${ic('team')}고용지원금 대상 검토<small>확인 필요</small></div>
      <div class="ln" id="${id}-1">${ic('book')}기업부설연구소 설립 검토<small>확인 필요</small></div>
      <div class="ln hot" id="${id}-2">${ic('money')}절세 항목 점검<small>바로 가능</small></div></div></div>
    <div class="cx" style="top:930px"><span class="chip hot big" id="${id}-r">${ic('link')}소개로 이어진다</span></div>`
  B.shot(t, html, { bg: 'bgD', trans: 'fade' })
  from(`#${id}`, t + 0.05, 'y: 80, opacity: 0', 0.9, 'expo.out')
  ;[0, 1, 2].forEach((i) => from(`#${id}-${i}`, c('8.4.1') + 0.2 + i * 0.35, 'x: -40, opacity: 0', 0.7, 'expo.out'))
  tw(`tl.to('#${id}-2', { scale: 1.03, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, ${r2(c('8.4.3'))});`)
  from(`#${id}-r`, c('8.4.4'), 'y: 30, opacity: 0', 0.7, 'expo.out') }
{ const t = c('8.5.0')
  K.morph(t, { from: ['door', '외부에 맡기던 인증'], to: ['check', '직접 · 간편하게'], aAt: c('8.5.1'), arAt: c('8.5.2') - 0.2, bAt: c('8.5.2'), aY: 420,
    fine: '계속 업데이트 중인 기능이에요', fineY: 1150, extra: H([{ at: t + 0.1, text: '이 모든 게 *한 화면* 안에서', size: 's' }], { y: 260 }), shot: { bg: 'bgB', trans: 'fade' } }) }
{ const t = c('9.1.0')
  const g = P.cards([{ ic: 'doc', label: '녹취록 · 교육 자료', at: c('9.2.0') + 0.1 }, { ic: 'ai', label: 'AI가 요약', at: c('9.2.1') }, { ic: 'book', label: '나만의 지식 창고', hl: true, at: w('지식', '9.2.2') - 0.2 }], { y: 520 })
  P.scene(t, [H([{ at: t + 0.1, text: '교육도 *매우 중요*하죠', size: 'm' }], { y: 290 }), g.html], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('9.2.3')
  const g = P.cards([{ ic: 'invest', label: '재무 정보 분석기', at: c('9.2.4') }, { ic: 'target', label: '미팅 전략', at: c('9.2.5') }], { layout: 'row', y: 460 })
  P.scene(t, [P.eyebrow('첫 미팅 준비', 330, t + 0.05), g.html.replace('gcards row', 'gcards row two'), H([{ at: c('9.2.5') + 0.3, text: '미팅 전 *한 번에* 준비', size: 's' }], { y: 900 })], { bg: 'bgC', trans: 'fade' }) }
fzBefore(10, 1, '교육 · 첫 미팅 준비까지', '나만의 지식 창고')

// ━━ ⑥ 함께 다듬는 중 · DB
K.people(c('10.1.0'), { y: 460, items: [['users', '동료 컨설턴트', c('10.1.0') + 0.3], ['star', '고성과자분들', c('10.1.1') + 0.2]], react: 'ok', reactAt: c('10.1.2'),
  extra: H([{ at: c('10.1.2'), text: '실무에 쓰며 *다듬는 중*', size: 's' }], { y: 960 }), shot: { bg: 'bgB', trans: 'fade' } })
{ const t = c('10.2.0')
  P.scene(t, [P.eyebrow('솔직하게', 560, t + 0.05), H([{ at: t + 0.1, text: '없다고 계약이<br>*안 되는 건* 아니죠', size: 'l' }], { y: 640 })], { bg: 'bgL', trans: 'wipeUp' }) }
{ const t = c('10.3.0')
  const g = P.cards([{ ic: 'star', label: '보여 드리기 쉽고', at: t + 0.3 }, { ic: 'check', label: '관리가 좋아지고', at: c('10.3.1') }, { ic: 'clock', label: '낭비 시간은 줄고', at: c('10.3.2') }, { ic: 'users', label: '고객에게 더 집중', hl: true, at: c('10.3.3') }], { y: 400 })
  P.scene(t, [P.eyebrow('있으면', 300, t + 0.05), g.html], { bg: 'bgA', trans: 'fade' }) }
K.chapter(c('11.1.0'), 'DB 고민')
{ const t = c('11.1.0')
  P.scene(t, [P.licon('db', 360, t + 0.05), H([{ at: t + 0.1, text: 'DB 고민도<br>*잘 알고* 있어요', size: 'l' }, { at: c('11.2.0'), text: '신규 DB 확보도<br>*중요*하죠', size: 'l' }], { y: 640 })], { bg: 'bgB', trans: 'fade' }) }
{ const t = c('11.3.0')
  const g = P.cards([{ ic: 'star', label: '다른 컨설턴트와의 차별점', at: t + 0.4 }, { ic: 'doc', label: '신규 계약', at: w('신규', '11.3.2') }, { ic: 'doc', label: '추가 계약', at: w('추가', '11.3.2') }, { ic: 'link', label: '소개', hl: true, at: w('소개로', '11.3.2') }], { y: 400 })
  P.scene(t, [P.eyebrow('지금 집중하는 것', 300, t + 0.05), g.html, H([{ at: c('11.3.4'), text: '계속 *업데이트* 중', size: 's' }], { y: 1080 })], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('11.4.0')
  P.scene(t, [P.eyebrow('추후 계획', 330, t + 0.05), P.licon('rocket', 420, t + 0.1), H([{ at: t + 0.2, text: '신규 DB 만들기도<br>*이 한 화면*에서', size: 'l' }], { y: 680 }), K.fineAt('f114', '계획 중인 기능이에요 · 일정은 바뀔 수 있어요', 1080)], { bg: 'bgC', trans: 'fade' })
  from('#f114', t + 0.8, 'opacity: 0', 0.6, 'power1.out') }
fzBefore(12, 1, '신규 DB도 한 화면에서', '추후 계획')

// ━━ ⑦ 오픈 안내 · 신청
K.chapter(c('12.1.0'), '오픈 안내')
{ const t = c('12.1.0')
  const g = P.cards([{ ic: 'money', label: '절세 모듈', sub: '세무사 등 전문가 검증 후 오픈', at: c('12.1.2') }], { y: 820 })
  P.scene(t, [P.eyebrow('컨설턴트 운영 OS', 330, t + 0.05), P.seal('11월 오픈 예정', 400, w('11월', '12.1.1') - 0.1, 'gold'), g.html, K.fineAt('f121', '오픈 일정은 준비 상황에 따라 조금 달라질 수 있어요', 1080)], { bg: 'bgC', trans: 'fade' })
  from('#f121', w('11월', '12.1.1') + 0.6, 'opacity: 0', 0.6, 'power1.out') }
{ const t = c('12.2.0')
  const g = P.cards([{ ic: 'bell', label: '오픈 소식 가장 먼저', at: c('12.2.1') }, { ic: 'star', label: '초기에 함께하시는 분께', sub: '무료로 써 보실 기회 · 할인 혜택 안내', hl: true, at: c('12.2.2') }], { y: 440 })
  P.scene(t, [P.eyebrow('지금 신청하시면', 330, t + 0.05), g.html], { bg: 'bgA', trans: 'fade' }) }
{ const t = c('12.3.0'), id = K.uid('fm')
  const fs = [['이름', '홍길동', w('이름', '12.3.1')], ['소속', '○○ 컨설팅', w('소속', '12.3.1')], ['이메일', 'name@mail.com', w('이메일', '12.3.1')], ['연락처', '010-0000-0000', w('연락처만', '12.3.1')]]
  const html = `${H([{ at: t + 0.1, text: '가장 빠르게 *소식 받기*', size: 's' }], { y: 230 })}
    <div class="fm" id="${id}" style="top:370px"><h4>출시 알림 신청</h4><p>출시되면 가장 먼저 알려 드릴게요</p>
      ${fs.map(([k, v], i) => `<div class="fi" id="${id}-${i}"><b>${k}</b>${v}</div>`).join('')}<div class="fb" id="${id}-b">알림 신청하기 ↓</div></div>`
  B.shot(t, html, { bg: 'bgC', trans: 'fade' })
  from(`#${id}`, t + 0.05, 'y: 80, opacity: 0', 0.9, 'expo.out')
  fs.forEach(([, , a], i) => tw(`tl.fromTo('#${id}-${i}', { boxShadow: 'inset 0 0 0 1.5px rgba(21,24,29,.08)' }, { boxShadow: 'inset 0 0 0 3px #D8A871', duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, ${r2(a)});`))
  tw(`tl.to('#${id}-b', { scale: 1.04, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, ${r2(c('12.3.1') + 2.4)});`) }
const ENDV = T.cues[T.cues.length - 1].end
X.endCard(ENDV - 0.1, { eb: '컨설턴트님께', card: '<span class="no">11월 오픈 예정</span><h3>미래AI랩 OS<br>출시 알림 신청</h3><ul><li>이름 · 소속 · 이메일 · 연락처</li><li>아래에서 바로 신청</li></ul>', shot: { trans: 'fade' } })

B.finish(r2(ENDV + 3.2))
