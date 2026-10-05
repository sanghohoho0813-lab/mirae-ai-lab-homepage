// 영상 1 · AX가 뭐고, 왜 필요한가 — 영상 스타일 v2(9:16 · 대표님 녹음 1.13배 · 어두운/밝은 장면 교차 · 도형 7색)
// 장면표(D 어두움 / L 밝음):
//  1 D 후킹 — 정책자금·투자·지원사업, 한 끗 차이(기준선 앞 막대)   2 L 경쟁 · 쏟아지는 AI 기술 · 우리만 제자리?
//  3 D 그래도 잘되는 회사 · 끝까지 봐 주세요                       4 L 예전 vs 지금 — 계획서만으로는
//  5 D 심사장 — “그래서, 다음은?” · “자금이 들어오면…”             6 L 비슷비슷한 계획서 중 하나 · 보여 줄 게 없다
//  7 D 계획 → 실제 화면(휴대폰)                                    8 L 결국 보는 건 하나 — 다음 단계 · 돈이 돌아오는가
//  9 D 재료는 회사 안에 — 흩어진 기록                              10 L 데이터는 자산 — 번호 태그 3
// 11 D 사례 250건 가까이(조사)                                     12 L 반복되는 흐름 — 쌓고 · 키우고 · 연결
// 13 D 플랫폼 = 우리 업종의 작은 서비스                            14 L 조사 사례 · 렌털업체(15억 원)
// 15 D 조사 사례 3가지                                             16 L 업종은 달라도 같은 구조
// 17 D 정부 공식 발표 · AX · 7,540억 원                            18 L 미래AI랩 — 플랫폼 + AX
// 19 D 안 — 대표님 폰 한 화면                                       20 L 밖 — 고객이 직접 견적·주문·예약
// 21 D 둘을 잇는 AI · 화면으로 보여 주는 성장 계획                   22 L 말 대신 화면 · 직접 눌러 보게
// 23 D 직접 만든 업종별 화면 20개+                                  24 L 저희도 AX로 — 특허 5건 출원 · 한 화면에
// 25 D 감과 기억 대신 시스템                                        26 L 다음 심사에서는 화면을
// 27 D 무엇부터 보여 줄까 · 3분 진단                                28 L 영상 2로 이어서 → 로고
// ⚠️ 조사 사례·정부 발표는 '미래AI랩 실적 아님'을 따로 표기(공식 근거와 우리 결과를 섞지 않는다). 특허는 '출원'.
//    영상 속 앱 화면은 미래AI랩이 직접 만든 샘플(예시 데이터).
import { readFileSync } from 'node:fs'
import { createReel2, ic } from '../../lib/reels2.mjs'

const R = createReel2('.', { title: '영상 1 · AX가 뭐고, 왜 필요한가' })
const { c, ce, w, scene, el, head, note, numtag, check, row, chip, bubble, node, nodeIn, hub, card, cardIn, mini, status, strike, deco, tagline, kpi, lines, phone, browser, touch, endCard } = R
const FLOWS = JSON.parse(readFileSync('assets/flows/flows.json', 'utf8'))
const FL = (n) => `assets/flows/${n}.jpg`
const SH = (n) => `assets/shots/${n}.jpg`
const SAMPLE = '영상 속 화면은 미래AI랩이 직접 만든 샘플(예시 데이터)입니다'
const CASE = '공개 사례 조사 요약 · 미래AI랩 실적이 아닙니다'
/** 샘플 앱 흐름(휴대폰) — steps 화면을 times 에 차례로 바꾸고, 바꾸기 직전 누르는 곳에 물결 */
function flowPhone(name, steps, times, o) {
  const sw = (o.w ?? 430) - 28, k = sw / 390, taps = FLOWS[name]?.taps ?? {}
  const swaps = steps.slice(1).map((s, i) => ({ src: FL(`${name}-${s}`), at: times[i] }))
  const inner = steps.slice(1).map((s, i) => { const tp = taps[String(i + 1)]; return tp ? touch(Math.round(tp.x * k), Math.round(tp.y * k), times[i] - 0.45) : '' }).join('')
  return phone({ src: FL(`${name}-${steps[0]}`), swaps, inner, ...o })
}

// 1 D — 후킹: 기준선 바로 앞에서 멈추는 세 막대
{
  const at = [w('정책자금', 0), w('투자도', 0), w('지원사업도', 0)]
  const L = [['정책자금', 'teal'], ['투자', 'blue'], ['정부지원사업', 'amber']]
  scene(0, `
  ${deco('ring', 840, 1120, 260, 'copper', 0.3)}
  ${head({ eb: 'FUNDING · INVESTMENT · GRANTS', t: '매번 *한 끗* 차이로<br>놓치고 계신가요?', size: 'h2', at: 0.1, y: 280 })}
  ${L.map(([l, col], i) => el(at[i], l, { cls: 'ylabel abs', a: 'fade', style: `left:72px;top:${580 + i * 150}px` })
    + `<div class="track abs" style="left:72px;top:${640 + i * 150}px;width:840px" data-in="${at[i]}" data-a="fade"><div class="fill" style="--c:var(--${col})" data-grow="${at[i]},${at[i] + 1.4},${[792, 786, 798][i]}"></div></div>`).join('')}
  ${lines([{ d: 'M884 560 V1060', t0: w('끗', '1.1.1') - 0.4, t1: w('끗', '1.1.1') + 0.2 }], 0, { c: 'rose' })}
  ${el(w('끗', '1.1.1'), '선정 기준선', { cls: 'abs ytag', a: 'fade', style: 'left:760px;top:1075px' })}`)
}

// 2 L — 경쟁 · AI 기술 · 우리만 제자리?
{
  const t = c('1.2.0'), k = c('1.4.0')
  const tech = ['생성형 AI', 'AI 에이전트', '업무 자동화', 'AI 검색', '음성 AI', 'AI 코딩']
  const cols = ['teal', 'blue', 'violet', 'amber', 'rose', 'green']
  scene(t, `
  ${deco('sq', 880, 200, 200, 'violet', t + 0.3)}
  ${head({ eb: 'COMPETITION', t: '쉽지 않죠?<br>경쟁이 *굉장히* 치열해요', at: t })}
  ${tech.map((s, i) => chip(s, k + 0.25 * i, { x: 72 + (i % 3) * 296, y: 590 + Math.floor(i / 3) * 110, c: cols[i], dim: c('1.4.1') })).join('')}
  ${card(cardIn('alert', 'AI 시대에 우리만 *제자리*?', '뒤처질까 불안하기도 하고요'), c('1.4.1'), { x: 72, y: 860, w: 888, hiedge: true, ic: 'rose' })}`, { light: true })
}

// 3 D — 그래도 잘되는 회사 · 끝까지
{
  const t = c('1.5.0'), ok = w('좋은', '1.5.1')
  scene(t, `
  ${deco('disc', -80, 1120, 240, 'green', t + 0.3)}
  ${head({ eb: 'STILL', t: '그럼에도 잘되는 회사는<br>*분명히* 있어요', at: t })}
  ${check('정책자금', ok, { y: 580, c: 'teal' })}
  ${check('투자', ok + 0.25, { y: 690, c: 'blue' })}
  ${check('정부지원사업', ok + 0.5, { y: 800, c: 'amber' })}
  ${chip('투자자', w('투자자와', '1.6.0'), { x: 72, y: 940, c: 'blue' })}
  ${chip('심사위원', w('심사위원이', '1.6.0'), { x: 280, y: 940, c: 'violet' })}
  ${el(w('매력적인', '1.6.1'), '*매력적인* 회사로 — 끝까지 봐 주세요', { cls: 'abs h3', style: 'left:72px;top:1060px' })}`)
}

// 4 L — 예전 vs 지금
{
  const t = c('2.1.0') - 0.3
  scene(t, `
  ${deco('ring', 860, 160, 240, 'amber', t + 0.3)}
  ${head({ eb: 'WHY IS IT HARDER', t: '왜 점점<br>*어려워질까요?*', at: t + 0.1 })}
  ${row('예전', '계획서만 잘 써도 통과', c('2.2.0'), { y: 580, w: 888, c: 'teal', dim: c('2.3.0') })}
  ${row('지금', '계획서만으로는 경쟁력 없음', c('2.3.0'), { y: 710, w: 888, c: 'rose' })}
  ${el(c('2.4.0'), '계획서는 결국<br>*계획일 뿐*이니까요', { cls: 'abs h2', style: 'left:72px;top:880px' })}`, { light: true })
}

// 5 D — 심사장
{
  const t = c('2.5.0')
  scene(t, `
  ${deco('ring', -100, 1120, 260, 'violet', t + 0.3)}
  ${head({ eb: 'AT THE REVIEW', t: '브리핑이 끝나면<br>*꼭* 묻습니다', at: t })}
  ${node(nodeIn('user', '심사위원'), t + 0.4, { x: 72, y: 570, w: 220, c: 'violet' })}
  ${bubble('“그래서, *다음은*<br>어떻게 되나요?”', c('2.6.0'), { x: 320, y: 580, c: 'violet' })}
  ${node(nodeIn('building', '우리 회사'), c('2.7.0'), { x: 740, y: 820, w: 220, c: 'amber' })}
  ${bubble('“자금이 들어오면<br>하겠습니다…”', w('자금이', '2.7.0'), { x: 260, y: 830, c: 'amber', r: true })}`)
}

// 6 L — 비슷비슷한 계획서 · 보여 줄 게 없다
{
  const t = c('2.7.1') - 0.1, g = c('2.7.3'), k = c('2.8.0')
  const docs = Array.from({ length: 8 }, (_, i) => card(mini('doc', i === 4 ? '우리 회사' : '사업계획서'), t + 0.1 + i * 0.12, { x: 72 + (i % 4) * 224, y: 560 + Math.floor(i / 4) * 210, w: 200, ic: i === 4 ? 'copper' : 'blue', dim: i === 4 ? g : undefined })).join('')
  scene(t, `
  ${head({ eb: 'ALL LOOK ALIKE', t: '누구나 AI로 쓴<br>*비슷비슷한* 계획서', at: t })}
  ${docs}
  ${strike('계획이 부족한 게 아니라', k, w('아니에요', '2.8.0'), { y: 1010 })}
  ${el(c('2.8.1'), '보여 줄 게 *없는* 거죠', { cls: 'abs h2', style: 'left:72px;top:1090px' })}`, { light: true })
}

// 7 D — 계획 → 실제 화면
{
  const t = c('2.9.0') - 0.1, k = w('실제로', '2.9.1')
  scene(t, `
  ${deco('disc', 880, 1120, 220, 'teal', t + 0.3)}
  ${head({ eb: 'SHOW, NOT PLAN', t: '이제는 *실제로*<br>보여 줘야 해요', at: t })}
  ${card(mini('doc', '계획', '말과 문서'), t + 0.3, { x: 72, y: 640, w: 300, ic: 'rose', dim: k })}
  ${lines([[392, 780, 530, 780, w('넘어서', '2.9.0'), w('넘어서', '2.9.0') + 0.6]], t)}
  ${flowPhone('lvcu', ['00', '01', '02'], [k, k + 1.4], { at: w('넘어서', '2.9.0') + 0.3, x: 548, y: 470, w: 400 })}
  ${note(SAMPLE, k)}`)
}

// 8 L — 결국 보는 건 하나
{
  const t = c('2.10.0'), m = c('2.11.1')
  scene(t, `
  ${deco('sq', 880, 220, 200, 'green', t + 0.3)}
  ${head({ eb: 'ONE QUESTION', t: '심사하는 쪽이<br>결국 보는 건 *하나*', at: t })}
  ${card(cardIn('up', '다음 단계로 *커질 수 있는가*', '이 회사의 다음 그림'), c('2.11.0'), { x: 72, y: 580, w: 888, hiedge: true, ic: 'copper' })}
  ${node(nodeIn('bank', '빌려준 돈'), m, { x: 72, y: 830, w: 260, c: 'blue' })}
  ${node(nodeIn('invest', '투자한 돈'), w('투자한', '2.11.1'), { x: 386, y: 830, w: 260, c: 'amber' })}
  ${node(nodeIn('repeat', '돌아온다'), w('돌아오니까요', '2.11.1') - 0.2, { x: 700, y: 830, w: 260, c: 'green' })}
  ${lines([[332, 920, 386, 920, w('투자한', '2.11.1'), w('투자한', '2.11.1') + 0.4], [646, 920, 700, 920, w('돌아오니까요', '2.11.1') - 0.4, w('돌아오니까요', '2.11.1')]], m)}`, { light: true })
}

// 9 D — 재료는 회사 안에 · 흩어진 기록
{
  const t = c('3.1.0'), sc = c('3.3.2')
  const data = [['고객', 'teal', w('고객', '3.3.0')], ['매출', 'green', w('매출', '3.3.0')], ['재고', 'amber', w('재고', '3.3.0')], ['직원의 기록', 'blue', w('직원의', '3.3.0')]]
  const where = [['엑셀', w('엑셀', '3.3.1')], ['메신저', w('메신저', '3.3.1')], ['누군가의 메모장', w('메모장', '3.3.1')]]
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'rose', t + 0.3)}
  ${head({ eb: 'INSIDE THE COMPANY', t: '보여 줄 재료는<br>이미 *회사 안에*', at: t })}
  ${data.map(([s, col, a], i) => chip(s, a, { x: 72 + (i % 2) * 300, y: 580 + Math.floor(i / 2) * 100, c: col, mv: [sc, sc + 1.4, [-40, 60, -60, 80][i], [-30, -20, 40, 30][i]] })).join('')}
  ${where.map(([s, a], i) => chip(s, a, { x: 72 + i * 250, y: 820, c: 'rose', big: false, mv: [sc, sc + 1.4, [-20, 30, 60][i], [40, -10, 50][i]] })).join('')}
  ${el(sc, '*흩어져* 있을 뿐이에요', { cls: 'abs h3', style: 'left:72px;top:1020px' })}`)
}

// 10 L — 데이터는 자산
{
  const t = c('3.4.0') - 0.1
  scene(t, `
  ${deco('disc', 890, 160, 200, 'green', t + 0.3)}
  ${head({ eb: 'YOUR BIGGEST ASSET', t: '한곳에 쌓이면<br>*가장 큰 자산*', at: t })}
  ${numtag(1, '한곳에 쌓이면 → *자산*', t + 0.4, { y: 580, w: 860, c: 'green', dim: c('3.4.1') })}
  ${numtag(2, '흩어져 있으면 → 성장 증거로 못 써요', c('3.4.1'), { y: 710, w: 860, c: 'rose', dim: c('3.4.2') })}
  ${numtag(3, '일 아는 직원이 나가면 → 회사가 흔들려요', c('3.4.2'), { y: 840, w: 860, c: 'amber' })}`, { light: true })
}

// 11 D — 사례 250건 가까이
{
  const t = c('4.1.0'), k = w('250', '4.2.2')
  scene(t, `
  ${deco('ring', 840, 150, 260, 'blue', t + 0.3)}
  ${head({ eb: 'OUR RESEARCH · 최근 3년', t: '정책자금·투자를 잘 받는<br>회사는 *뭐가 다를까?*', at: t })}
  ${chip('정책자금', w('정책자금과', '4.2.0'), { x: 72, y: 590, c: 'teal' })}
  ${chip('정부 R&D', w('R&D', '4.2.0'), { x: 300, y: 590, c: 'blue' })}
  ${chip('투자', w('투자를', '4.2.1'), { x: 540, y: 590, c: 'amber' })}
  ${kpi('250건', '가까이', k - 0.1, { y: 730 })}
  ${el(k + 0.4, '사례를 살펴봤습니다', { cls: 'abs p', style: 'left:72px;top:960px' })}
  ${note('미래AI랩이 공개 사례를 조사한 숫자입니다 · 미래AI랩 실적이 아닙니다', t + 0.6)}`)
}

// 12 L — 반복되는 흐름
{
  const t = c('4.3.0'), a = [c('4.4.0'), c('4.4.1'), c('4.4.2')]
  scene(t, `
  ${deco('sq', 880, 1100, 210, 'teal', t + 0.3)}
  ${head({ eb: 'THE PATTERN', t: '거기서 *반복되는*<br>흐름이 있었어요', at: t })}
  ${numtag(1, '고객 데이터를 꾸준히 *쌓고*', a[0], { y: 580, w: 860, c: 'teal', dim: a[1] })}
  ${numtag(2, '고객이 쓰는 *플랫폼*으로 키우고', a[1], { y: 720, w: 860, c: 'blue', dim: a[2] })}
  ${numtag(3, '회사 안 운영과 *하나로* 연결', a[2], { y: 860, w: 860, c: 'copper' })}
  ${lines([[101, 676, 101, 722, a[1] - 0.4, a[1]], [101, 816, 101, 862, a[2] - 0.4, a[2]]], t, { width: 3 })}`, { light: true })
}

// 13 D — 플랫폼 = 작은 서비스
{
  const t = c('5.1.0'), k = c('5.2.0')
  scene(t, `
  ${deco('disc', -80, 1120, 240, 'violet', t + 0.3)}
  ${el(t + 0.05, 'WHAT WE MEAN BY PLATFORM', { cls: 'abs eyebrow', style: 'left:72px;top:250px' })}
  ${strike('쿠팡·네이버 같은 거대한 서비스', t + 0.3, c('5.1.2'), { y: 310 })}
  ${el(k, '우리 업종에 특화된<br>*작은 서비스*', { cls: 'abs h2', style: 'left:72px;top:400px' })}
  ${node(nodeIn('users', '고객'), w('고객과', '5.2.1'), { x: 72, y: 700, w: 260, c: 'teal' })}
  ${node(nodeIn('building', '거래처'), w('거래처가', '5.2.1'), { x: 700, y: 700, w: 260, c: 'blue' })}
  ${hub('작은<br>서비스', w('모이는', '5.2.1'), { x: 421, y: 660 })}
  ${lines([[332, 790, 421, 760, w('모이는', '5.2.1') - 0.3, w('모이는', '5.2.1') + 0.2], [700, 790, 611, 760, w('모이는', '5.2.1') - 0.3, w('모이는', '5.2.1') + 0.2]], t)}`)
}

// 14 L — 조사 사례: 렌털업체
{
  const t = c('5.3.0'), k = w('15억', '5.4.4')
  scene(t, `
  ${deco('ring', 860, 160, 240, 'amber', t + 0.3)}
  ${head({ eb: 'CASE · 렌털업체', t: '실제로 이런<br>*사례*가 있었어요', at: t })}
  ${node(nodeIn('book', '손으로 쓰던 장부'), c('5.4.0'), { x: 72, y: 570, w: 270, c: 'amber' })}
  ${node(nodeIn('cloud', '클라우드 시스템'), c('5.4.1'), { x: 381, y: 570, w: 270, c: 'blue' })}
  ${node(nodeIn('bank', '금융 사업 논리'), c('5.4.3'), { x: 690, y: 570, w: 270, c: 'violet' })}
  ${lines([[342, 660, 381, 660, c('5.4.1') - 0.3, c('5.4.1')], [651, 660, 690, 660, c('5.4.3') - 0.3, c('5.4.3')]], t)}
  ${kpi('15억 원', '규모', k - 0.1, { y: 820 })}
  ${el(k + 0.4, '보증과 금융지원', { cls: 'abs h3', style: 'left:72px;top:1050px' })}
  ${note(CASE, t + 0.6)}`, { light: true })
}

// 15 D — 조사 사례 3가지
{
  const t = c('5.5.0'), all = c('5.5.3')
  scene(t, `
  ${deco('sq', 880, 1100, 200, 'teal', t + 0.3)}
  ${head({ eb: 'MORE CASES', t: '그 밖에도<br>*성장자금*을 받은 회사들', at: t })}
  ${row('히트펌프', '→ 운영·모니터링 구독', t + 0.4, { y: 580, w: 888, c: 'teal' })}
  ${row('수산물 유통', '→ 데이터 B2B 플랫폼', c('5.5.1'), { y: 710, w: 888, c: 'blue' })}
  ${row('부동산 중개', '→ 공실 관리 자동화', c('5.5.2'), { y: 840, w: 888, c: 'amber' })}
  ${tagline('모두 성장자금 확보', all, { y: 990, icon: 'check' })}
  ${note(CASE, t + 0.6)}`)
}

// 16 L — 업종은 달라도 같은 구조
{
  const t = c('5.6.0'), k = c('5.7.0')
  scene(t, `
  ${deco('disc', 890, 160, 200, 'rose', t + 0.3)}
  ${head({ eb: 'SAME STRUCTURE', t: '업종은 달라도<br>*흐름은 같았어요*', at: t })}
  ${chip('제조', w('제조', t), { x: 72, y: 570, c: 'teal' })}
  ${chip('유통', w('유통', t), { x: 230, y: 570, c: 'blue' })}
  ${chip('숙박', w('숙박까지', t), { x: 388, y: 570, c: 'amber' })}
  ${node(nodeIn('db', '데이터가 쌓이고'), k, { x: 72, y: 720, w: 420, c: 'teal' })}
  ${node(nodeIn('users', '사람이 모이고'), w('사람이', '5.7.0'), { x: 540, y: 720, w: 420, c: 'blue' })}
  ${lines([[282, 880, 282, 930, c('5.7.1') - 0.3, c('5.7.1')], [750, 880, 750, 930, c('5.7.1') - 0.3, c('5.7.1')], [282, 930, 750, 930, c('5.7.1'), c('5.7.1') + 0.4], [516, 930, 516, 970, c('5.7.1') + 0.3, c('5.7.1') + 0.6]], t)}
  ${card(cardIn('up', '회사가 *커질 수 있는* 구조', '이게 공통점이었어요'), c('5.7.1') + 0.4, { x: 72, y: 970, w: 888, hiedge: true, ic: 'copper' })}`, { light: true })
}

// 17 D — 정부 공식 발표 · AX · 7,540억 원
{
  const t = c('6.1.0'), k = w('7540', '6.2.2')
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'blue', t + 0.3)}
  ${head({ eb: 'GOVERNMENT · 공식 발표', t: 'AI를 적극 도입한 기업을<br>*밀어주겠다*', at: t })}
  ${chip('AI', w('AI와', '6.2.0'), { x: 72, y: 580, c: 'violet' })}
  ${chip('데이터', w('데이터로', '6.2.0'), { x: 210, y: 580, c: 'teal' })}
  ${chip('일하는 방식을 바꾸는 것 = *AX*', w('AX라고', '6.2.0') - 0.4, { x: 410, y: 580, c: 'copper' })}
  ${el(c('6.2.1'), '중소벤처기업부 · AX 도입 기업 융자', { cls: 'abs p', style: 'left:72px;top:720px' })}
  ${kpi('7,540억 원', '규모', k - 0.1, { y: 820, size: 150 })}
  ${note('정부 발표 내용입니다 · 미래AI랩 실적이 아닙니다', t + 0.6)}`)
}

// 18 L — 미래AI랩: 플랫폼 + AX
{
  const t = c('6.3.0'), k = c('6.4.2')
  scene(t, `
  ${deco('sq', 880, 1100, 210, 'amber', t + 0.3)}
  ${head({ eb: 'MIRAE AI LAB', t: '그래서 저희는<br>*한 걸음 더*', at: t })}
  ${chip('정부', w('정부와', '6.4.0'), { x: 72, y: 570, c: 'teal' })}
  ${chip('심사위원', w('심사위원', '6.4.0'), { x: 230, y: 570, c: 'violet' })}
  ${chip('투자자', w('투자자가', '6.4.0'), { x: 450, y: 570, c: 'amber' })}
  ${el(c('6.4.1'), '모두 *좋아할 수밖에* 없도록', { cls: 'abs h3', style: 'left:72px;top:690px' })}
  ${node(nodeIn('users', '플랫폼'), k, { x: 72, y: 830, w: 300, c: 'blue' })}
  ${node(nodeIn('ai', 'AX'), w('AX를', '6.4.2'), { x: 660, y: 830, w: 300, c: 'violet' })}
  ${hub('결합한<br>서비스', w('결합한', '6.4.2'), { x: 421, y: 800 })}`, { light: true })
}

// 19 D — 안: 대표님 폰 한 화면
{
  const t = c('7.1.0'), k = c('7.2.0'), one = c('7.2.1')
  scene(t, `
  ${deco('ring', 860, 1120, 240, 'teal', t + 0.3)}
  ${head({ eb: 'INSIDE', t: '회사의 안과 밖을<br>*함께* 연결해요', at: t })}
  ${flowPhone('lvax', ['00', '01'], [one + 0.8], { at: k, x: 72, y: 540, w: 400 })}
  ${check('직원', w('직원', '7.2.0'), { x: 510, y: 580, c: 'blue' })}
  ${check('고객', w('고객', '7.2.0'), { x: 510, y: 690, c: 'teal' })}
  ${check('재고', w('재고', '7.2.0'), { x: 510, y: 800, c: 'amber' })}
  ${check('정산', w('정산을', '7.2.0'), { x: 510, y: 910, c: 'green' })}
  ${tagline('대표님 폰 한 화면에', one, { x: 510, y: 1030, icon: 'phone' })}
  ${note(SAMPLE, k + 0.5)}`)
}

// 20 L — 밖: 고객이 직접
{
  const t = c('7.2.2') - 0.1
  scene(t, `
  ${deco('disc', 890, 170, 200, 'rose', t + 0.3)}
  ${head({ eb: 'OUTSIDE', t: '고객과 거래처가<br>*직접* 하는 플랫폼', at: t })}
  ${flowPhone('lvcu', ['00', '01', '02'], [w('견적', '7.2.3') + 0.3, w('예약을', '7.2.3') + 0.3], { at: t + 0.2, x: 72, y: 540, w: 400 })}
  ${check('견적', w('견적', '7.2.3'), { x: 510, y: 600, c: 'blue' })}
  ${check('주문', w('주문', '7.2.3'), { x: 510, y: 710, c: 'amber' })}
  ${check('예약', w('예약을', '7.2.3'), { x: 510, y: 820, c: 'copper' })}
  ${note(SAMPLE, t + 0.6)}`, { light: true })
}

// 21 D — 둘을 잇는 AI · 성장 계획을 화면으로
{
  const t = c('7.3.0'), k = c('7.4.0')
  scene(t, `
  ${head({ eb: 'CONNECTED BY AI', t: 'AI가 데이터를 읽고<br>*다음 할 일*까지', at: t })}
  ${node(nodeIn('building', '안 · 운영'), t + 0.3, { x: 72, y: 560, w: 280, c: 'teal', dim: k })}
  ${node(nodeIn('users', '밖 · 고객'), t + 0.5, { x: 680, y: 560, w: 280, c: 'blue', dim: k })}
  ${hub('AI', w('AI가', '7.3.1'), { x: 421, y: 530 })}
  ${lines([[352, 640, 421, 625, t + 0.6, t + 1.1], [680, 640, 611, 625, t + 0.6, t + 1.1]], t)}
  ${browser({ src: SH('ax-livarte'), at: k, x: 72, y: 800, w: 888, h: 440, url: 'SAMPLE · 성장 계획', kb: `${k},${ce('7.4.2')},1.0,0,0,1.08,-30,-18` })}
  ${note(SAMPLE, k + 0.4)}`)
}

// 22 L — 말 대신 화면 · 직접 눌러 보게
{
  const t = c('8.1.0'), k = c('8.1.2'), g = c('8.2.0')
  scene(t, `
  ${deco('ring', 860, 150, 240, 'violet', t + 0.3)}
  ${strike('“자금이 들어오면 하겠다”', t + 0.1, w('대신에', '8.1.0'), { y: 260 })}
  ${el(c('8.1.1'), '이미 *돌아가는 화면*을', { cls: 'abs h2', style: 'left:72px;top:340px' })}
  ${flowPhone('lvstyle', ['00', '01', '02'], [w('직접', '8.1.3') + 0.3, w('직접', '8.1.3') + 1.5], { at: c('8.1.1') + 0.2, x: 72, y: 470, w: 400 })}
  ${bubble('“이거 진짜<br>*되나요?*”', k, { x: 510, y: 520, c: 'violet', r: true })}
  ${check('직접 눌러 보시게', c('8.1.3'), { x: 510, y: 760, c: 'green' })}
  ${card(cardIn('up', '*다음 단계*가 보이는 회사', '성장이 멈춰 보였던 회사가'), g, { x: 510, y: 900, w: 450, ic: 'copper' })}
  ${note(SAMPLE, c('8.1.1') + 0.5)}`, { light: true })
}

// 23 D — 직접 만든 업종별 화면 20개+
{
  const t = c('9.1.0')
  const sw = [['ax-gounsot', '음식점', t + 0.1], ['ax-edumaster', '학원', w('학원', '9.1.0')], ['ax-seum', '제조', w('제조', '9.1.0')], ['ax-nexmart', '유통', w('유통까지', '9.1.0')]]
  scene(t, `
  ${deco('disc', 880, 1120, 220, 'amber', t + 0.3)}
  ${head({ eb: 'BUILT BY US', t: '업종별 화면을<br>*직접* 만들었어요', at: t })}
  ${browser({ src: SH(sw[0][0]), swaps: sw.slice(1).map(([n, , a]) => ({ src: SH(n), at: a })), at: t + 0.2, x: 72, y: 560, w: 888, h: 520, url: 'SAMPLE · AX', kb: `${t},${c('9.2.0')},1.02,0,0,1.08,-20,-14` })}
  ${sw.map(([, l, a], i) => chip(l, a, { x: 72 + i * 180, y: 1110, c: ['amber', 'blue', 'teal', 'violet'][i] })).join('')}
  ${tagline('업종별 AX·MVP 화면 20개 넘게 · 지금도 실제 기업과 함께', c('9.1.1'), { y: 1210, icon: 'check' })}`)
}

// 24 L — 저희도 AX로 일해요
{
  const t = c('9.2.0'), k = c('9.3.1')
  scene(t, `
  ${deco('sq', 880, 200, 200, 'blue', t + 0.3)}
  ${head({ eb: 'WE WORK WITH AX', t: '저희도 *AX로*<br>일하고 있어요', at: t })}
  ${status('AX 핵심기술 특허 5건 출원 · 올해 9월', c('9.3.0'), { y: 570 })}
  ${el(k, '회사 정보를 넣으면 *한 화면에* 먼저', { cls: 'abs h3', style: 'left:72px;top:700px' })}
  ${row('받을 수 있는 지원금', '', w('지원금과', '9.3.2'), { y: 800, w: 888, c: 'green' })}
  ${row('챙겨야 할 인증', '', w('인증', '9.3.2'), { y: 920, w: 888, c: 'blue' })}
  ${row('절세 포인트', '', c('9.3.3'), { y: 1040, w: 888, c: 'amber' })}
  ${note('특허는 출원 상태입니다(등록 아님)', c('9.3.0') + 0.4)}`, { light: true })
}

// 25 D — 감과 기억 대신 시스템
{
  const t = c('9.4.0')
  scene(t, `
  ${deco('ring', -100, 1100, 260, 'green', t + 0.3)}
  ${head({ eb: 'SYSTEM FIRST', t: '새 지원사업도<br>*매일* 알려 드려요', at: t })}
  ${strike('감과 기억에만 의존하는 컨설팅', c('9.5.0'), w('아니라', '9.5.0'), { y: 600 })}
  ${check('시스템이 *먼저* 알려 드려요', c('9.5.1'), { y: 720, c: 'teal' })}
  ${check('놓치는 부분이 *훨씬 적어요*', c('9.5.2'), { y: 840, c: 'copper' })}`)
}

// 26 L — 다음 심사에서는 화면을
{
  const t = c('10.1.0'), k = c('10.1.2')
  scene(t, `
  ${deco('disc', 890, 160, 200, 'violet', t + 0.3)}
  ${head({ eb: 'NEXT REVIEW', t: '다음 심사에서는<br>*말 대신 화면*을', at: t })}
  ${bubble('“그래서, *다음은*<br>어떻게 되나요?”', w('그래서', '10.1.0'), { x: 72, y: 580, c: 'violet' })}
  ${flowPhone('cwax', ['00', '01'], [k + 0.4], { at: k - 0.2, x: 540, y: 520, w: 400 })}
  ${note(SAMPLE, k)}`, { light: true })
}

// 27 D — 무엇부터 보여 줄까 · 3분 진단
{
  const t = c('10.2.0') - 0.1
  scene(t, `
  ${deco('ring', 840, 150, 260, 'copper', t + 0.3)}
  ${head({ eb: 'START HERE', t: '우리 회사는<br>*무엇부터* 보여 줘야<br>할까요?', size: 'h1 long', at: t + 0.05, y: 360 })}
  ${chip('3분 기업성장·AX Fit 진단', c('10.3.0'), { x: 72, y: 800, c: 'copper', big: true })}`)
}

// 28 L — 영상 2로 이어서 → 로고
{
  const t = c('10.4.0') - 0.1
  scene(t, `
  ${deco('ring', 840, 120, 260, 'teal', t + 0.2)}${deco('disc', -80, 1150, 240, 'amber', t + 0.4)}
  ${endCard({ at: t + 0.1, sub: '진행 방식과 비용은 다음 영상에서', subAt: t + 0.3, line: '영상 2 · 어떻게 진행하고,<br>*얼마가 드나*', lineAt: c('10.4.1'), cta: ['3분 AX Fit 진단', 'miraeailab.com'], ctaAt: R.VOICE_END - 0.4 })}`, { light: true })
}

R.finish()
