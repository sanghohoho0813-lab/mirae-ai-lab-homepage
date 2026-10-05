// 영상 2 · 어떻게 진행하고, 얼마가 드나 — 영상 스타일 v2(9:16 · 대표님 녹음 1.13배 · 어두운/밝은 장면 교차 · 도형 7색)
// 녹음: 비용 구간 순서를 바꾸고(가격 → 정산 시점 뒤로 → 착수금·후불 → 한 단계씩 → 유지보수 → 진행 정도에 따라 정산)
//       중복 문장 하나를 뺐다 — run-audio.sh 의 --pieces(원본 기준 초).
// 장면표(D 어두움 / L 밝음):
//  1 D 후킹 — 어떻게 진행되고, 얼마가 드나?            2 L ROADMAP — 4단계(단계 카드)
//  3 D STEP 1 진단 — 설계도                            4 L STEP 2 — 2주 안에 MVP·기본 틀 · 갈아엎지 않아요
//  5 D 예시 1 ERP — 주문·재고·매출 연동                  6 L 예시 2 음식점 포스기 · 부담 적게
//  7 D STEP 3 데이터 쌓기                              8 L 쌓일수록 — 정확 · 근거 · 자산 · 새 사업
//  9 D STEP 4 외부 매력 — 벤처기업확인 · 비재무 · 재무    10 L 달라지는 모습 — 대표님 폰 한 화면(샘플)
// 11 D AI 근거 — 더 밀고, 막고(샘플)                    12 L 직원 — 권한별 화면 · 기록은 그대로
// 13 D 고객·거래처가 직접(샘플)                         14 L 쌓인 데이터 → 새 사업
// 15 D 밖에서 보기에도                                  16 L 심사 자리 — 화면을 켜고 답한다
// 17 D 격차는 벌어진다 · 먼저 도입한 회사가 유리
// 18 L 비용 — 말한 금액 비례 막대 · 정산 시점 뒤로   19 D 부담 줄이기 — 5번 이상 신청 · 착수금 · 후불   20 L 한 단계씩 · 유지보수 1년 무상
// 21 D 진행 정도에 따라 정산 · 후불이면 후불로 정산       22 L 신청까지 하나의 스토리
// 23 D 같은 팀 · 낮은 수수료                            24 L 정리 — 4단계
// 25 D 한 팀이 이어서 — 스토리 일관                     26 L 3분 진단 → 로고
// ⚠️ 금액·횟수는 녹음에서 말한 그대로. 선정·승인을 약속하지 않는다. 벤처기업확인은 '신청까지'. 특허는 '출원'.
import { readFileSync } from 'node:fs'
import { createReel2, ic } from '../../lib/reels2.mjs'

const R = createReel2('.', { title: '영상 2 · 어떻게 진행하고, 얼마가 드나' })
const { c, ce, w, scene, el, head, note, numtag, check, row, chip, bubble, node, nodeIn, hub, card, cardIn, mini, status, strike, deco, tagline, kpi, lines, phone, bars, touch, endCard } = R
const FLOWS = JSON.parse(readFileSync('assets/flows/flows.json', 'utf8'))
const FL = (n) => `assets/flows/${n}.jpg`
const SAMPLE = '영상 속 화면은 미래AI랩이 직접 만든 샘플(예시 데이터)입니다'
function flowPhone(name, steps, times, o) {
  const sw = (o.w ?? 430) - 28, k = sw / 390, taps = FLOWS[name]?.taps ?? {}
  const swaps = steps.slice(1).map((s, i) => ({ src: FL(`${name}-${s}`), at: times[i] }))
  const inner = steps.slice(1).map((s, i) => { const tp = taps[String(i + 1)]; return tp ? touch(Math.round(tp.x * k), Math.round(tp.y * k), times[i] - 0.45) : '' }).join('')
  return phone({ src: FL(`${name}-${steps[0]}`), swaps, inner, ...o })
}
const STEPS = [['target', '진단', '성장 설계도', 'teal'], ['rocket', '2주 안에 MVP·기본 틀', '기존 프로그램은 그대로', 'blue'], ['db', '데이터 쌓기', '다듬고 테스트', 'amber'], ['star', '외부 매력 다듬기', '인증 · 재무', 'copper']]
const stepCards = (at, y, gap, dimAt) => STEPS.map(([icn, t, s, col], i) => card(cardIn(icn, `${i + 1}. ${t}`, s), at[i], { x: 72, y: y + i * gap, w: 888, c: col, dim: dimAt?.[i] })).join('')

// 1 D — 후킹
{
  scene(0, `
  ${deco('ring', 840, 140, 260, 'amber', 0.2)}${deco('disc', -90, 1160, 240, 'teal', 0.4)}
  ${head({ eb: 'AFTER VIDEO 1', t: '어떻게 진행되고,<br>*얼마가* 드나?', size: 'h1', at: 0.1, y: 300 })}
  ${chip('어떻게 진행될까?', w('진행되고', '1.2.1') - 0.2, { x: 72, y: 640, c: 'teal', big: true })}
  ${chip('얼마나 들까?', w('얼마가', '1.2.1') - 0.2, { x: 72, y: 760, c: 'amber', big: true })}
`)
}

// 2 L — 4단계
{
  const t = c('1.3.0') - 0.1, r = c('2.1.0'), k = c('2.2.0')
  scene(t, `
  ${deco('sq', 880, 1120, 200, 'blue', t + 0.3)}
  ${el(t + 0.1, '지금부터<br>*답해 드릴게요*', { cls: 'abs h2', out: r, style: 'left:72px;top:250px' })}
  ${head({ eb: 'ROADMAP', t: '진행은 총 *4단계*', at: r })}
  ${stepCards([r + 0.3, r + 0.5, r + 0.7, r + 0.9], 470, 170, [null, k, k, k])}`, { light: true })
}

// 3 D — STEP 1 진단
{
  const t = c('2.3.0') - 0.1
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'teal', t + 0.3)}
  ${head({ eb: 'STEP 1 · 진단', t: '무엇부터 바꿀지<br>*설계도*를 그려요', at: t })}
  ${status('9년 차 경영컨설턴트 · 특허 출원한 AX', t + 0.3, { y: 580 })}
  ${row('회사의 성장 단계', '', w('성장', '2.3.2'), { y: 720, w: 888, c: 'teal' })}
  ${row('업무', '', w('업무를', '2.3.2'), { y: 850, w: 888, c: 'blue' })}
  ${card(cardIn('target', '무엇부터 바꿀지 *설계도*'), c('2.3.3'), { x: 72, y: 990, w: 888, hiedge: true, ic: 'copper' })}
  ${note('특허는 출원 상태입니다(등록 아님)', t + 0.6)}`)
}

// 4 L — STEP 2: 2주 안에 MVP·기본 틀
{
  const t = c('3.1.0') - 0.1
  scene(t, `
  ${deco('disc', 890, 160, 200, 'blue', t + 0.3)}
  ${head({ eb: 'STEP 2 · 2주', t: '2주 안에<br>*MVP와 기본 틀*', at: t })}
  ${kpi('2주', '안에', w('2주', '3.1.0'), { y: 560 })}
  ${el(c('3.1.1') + 0.3, 'MVP = 최소 기능 제품', { cls: 'abs p', style: 'left:72px;top:800px' })}
  ${strike('지금 쓰는 프로그램을 다 갈아엎기', c('3.2.0'), w('필요는', '3.2.0'), { y: 920 })}`, { light: true })
}

// 5 D — 예시 1: ERP
{
  const t = c('3.3.0') - 0.1, k = c('3.4.1')
  scene(t, `
  ${deco('sq', 880, 220, 200, 'violet', t + 0.3)}
  ${head({ eb: 'KEEP WHAT YOU USE', t: '기존 프로그램은 *그대로*,<br>필요한 데이터만 연결', at: t })}
  ${node(nodeIn('db', 'ERP', '일반 중소기업'), c('3.4.0'), { x: 72, y: 600, w: 300, c: 'blue' })}
  ${chip('주문', w('주문', '3.4.1'), { x: 440, y: 590, c: 'teal' })}
  ${chip('재고', w('재고', '3.4.1'), { x: 440, y: 690, c: 'amber' })}
  ${chip('매출', w('매출', '3.4.1'), { x: 440, y: 790, c: 'green' })}
  ${lines([[372, 690, 440, 690, k - 0.2, k + 0.2], [640, 720, 720, 720, w('연동해서', '3.4.1'), w('연동해서', '3.4.1') + 0.5]], t)}
  ${hub('AX로<br>연동', w('연동해서', '3.4.1') + 0.3, { x: 730, y: 625 })}
  ${note('연동 방식은 쓰시는 프로그램마다 다릅니다', c('3.4.0') + 0.5)}`)
}

// 6 L — 예시 2: 음식점 포스기 · 부담 적게
{
  const t = c('3.4.2') - 0.1, k = c('3.4.3')
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'amber', t + 0.3)}
  ${head({ eb: 'EXAMPLE · 음식점', t: '쓰시던 *포스기* 매출을<br>그대로 가져와요', at: t })}
  ${chip('본점', t + 0.3, { x: 72, y: 600, c: 'amber' })}
  ${chip('2호점', w('2호점', '3.4.2'), { x: 240, y: 600, c: 'blue' })}
  ${chip('3호점', w('3호점까지', '3.4.2'), { x: 420, y: 600, c: 'teal' })}
  ${row('포스기 매출 데이터', '→ AX', k, { y: 720, w: 888, c: 'copper' })}
  ${check('천천히 적응하며 도입', c('3.5.0'), { y: 900, c: 'teal' })}
  ${check('직원 부담·반발도 *적어요*', c('3.5.1'), { y: 1020, c: 'green' })}`, { light: true })
}

// 7 D — STEP 3 데이터 쌓기
{
  const t = c('4.1.0') - 0.1, a = [c('4.2.0'), c('4.2.1'), c('4.2.2')]
  scene(t, `
  ${deco('disc', -80, 1120, 240, 'amber', t + 0.3)}
  ${head({ eb: 'STEP 3 · 데이터', t: '데이터를 *쌓는* 단계', at: t })}
  ${numtag(1, '실제 업무 자료를 받아', a[0], { y: 520, w: 820, c: 'teal', dim: a[1] })}
  ${numtag(2, '우리 회사에 맞게 다듬고 테스트', a[1], { y: 660, w: 820, c: 'blue', dim: a[2] })}
  ${numtag(3, '데이터를 *쌓아요*', a[2], { y: 800, w: 820, c: 'amber' })}
  ${lines([[101, 616, 101, 662, a[1] - 0.4, a[1]], [101, 756, 101, 802, a[2] - 0.4, a[2]]], t, { width: 3 })}`)
}

// 8 L — 쌓일수록
{
  const t = c('4.3.0') - 0.1
  scene(t, `
  ${deco('sq', 880, 200, 200, 'green', t + 0.3)}
  ${head({ eb: 'THE MORE YOU STACK', t: '쌓일수록 *달라지는 것*', at: t })}
  ${check('AI가 더 정확해지고', t + 0.2, { y: 480, c: 'violet', dim: c('4.3.1') })}
  ${check('심사에서 *핵심 근거*', c('4.3.1'), { y: 600, c: 'blue', dim: c('4.4.0') })}
  ${check('회사의 자산이 되고', c('4.4.0'), { y: 720, c: 'green', dim: c('4.4.1') })}
  ${check('구독형 같은 *새 사업*으로', c('4.4.1'), { y: 840, c: 'copper' })}`, { light: true })
}

// 9 D — STEP 4 외부 매력
{
  const t = c('5.1.0') - 0.1
  scene(t, `
  ${deco('ring', 860, 150, 240, 'violet', t + 0.3)}
  ${head({ eb: 'STEP 4 · 밖에서 볼 때', t: '*매력적인* 회사로<br>다듬어요', at: t })}
  ${status('벤처기업확인 — 어떤 상품이든 기본 포함', c('5.2.0'), { y: 580 })}
  ${row('비재무', '기업 인증', c('5.2.1'), { y: 720, w: 888, c: 'violet' })}
  ${row('재무', '신용등급 · 부채비율', c('5.2.2'), { y: 850, w: 888, c: 'blue' })}
  ${tagline('함께 다듬어 가요', c('5.2.3'), { y: 1000, icon: 'check' })}
  ${note('벤처기업확인 신청까지 함께 준비합니다 · 결과는 확인기관 심사에 따라 달라집니다', c('5.2.0') + 0.5)}`)
}

// 10 L — 대표님 폰 한 화면(샘플)
{
  const t = c('6.1.0') - 0.1, k = c('6.2.0')
  scene(t, `
  ${deco('disc', 890, 160, 200, 'teal', t + 0.3)}
  ${head({ eb: 'AFTER AX', t: '이렇게 *달라집니다*', at: t })}
  ${flowPhone('mxax', ['00', '01'], [c('6.2.2')], { at: k - 0.2, x: 72, y: 440, w: 400 })}
  ${check('매출', w('매출', '6.2.0'), { x: 510, y: 500, c: 'green' })}
  ${check('재고', w('재고', '6.2.0'), { x: 510, y: 610, c: 'amber' })}
  ${check('직원별 처리 현황', w('직원별', '6.2.0'), { x: 510, y: 720, c: 'blue' })}
  ${card(cardIn('', '잘 팔리는 것 · *새는 곳*', '한 화면에 수치로'), c('6.2.2'), { x: 510, y: 860, w: 450, c: 'copper' })}
  ${note(SAMPLE, k)}`, { light: true })
}

// 11 D — AI 근거: 더 밀고, 막고
{
  const t = c('6.3.0') - 0.1, k = c('6.4.0')
  scene(t, `
  ${deco('ring', 860, 1120, 240, 'violet', t + 0.3)}
  ${head({ eb: 'AI · ONE STEP MORE', t: '다음 할 일의<br>*판단 근거*까지', at: t })}
  ${flowPhone('seum', ['01', '02'], [w('다음에', '6.3.1') + 0.4], { at: t + 0.3, x: 72, y: 470, w: 400 })}
  ${chip('잘 팔리는 건 *더 밀고*', k, { x: 510, y: 600, c: 'green', big: true })}
  ${chip('새는 것은 *막고*', w('새는', '6.4.0'), { x: 510, y: 730, c: 'rose', big: true })}
  ${note(SAMPLE, t + 0.6)}`)
}

// 12 L — 직원: 권한별 화면 · 기록은 그대로
{
  const t = c('6.5.0') - 0.1, k = c('6.6.0')
  scene(t, `
  ${deco('sq', 880, 1120, 200, 'blue', t + 0.3)}
  ${head({ eb: 'ONE WORKSPACE', t: '직원들은 *하나의 공간*에서', at: t })}
  ${row('대표', '전체', c('6.5.1'), { y: 470, w: 888, c: 'amber' })}
  ${row('점장', '매장', c('6.5.1') + 0.3, { y: 590, w: 888, c: 'blue' })}
  ${row('직원', '내 업무만 입력', c('6.5.2'), { y: 710, w: 888, c: 'teal' })}
  ${check('담당자가 바뀌어도 *기록은 그대로*', k, { y: 880, c: 'green' })}
  ${check('인수인계 부담도 줄어요', c('6.6.1'), { y: 1000, c: 'copper' })}`, { light: true })
}

// 13 D — 고객·거래처가 직접(샘플)
{
  const t = c('6.7.0') - 0.1, k = c('6.7.1')
  scene(t, `
  ${deco('disc', 890, 170, 200, 'rose', t + 0.3)}
  ${head({ eb: 'CUSTOMER PLATFORM', t: '고객과 거래처가<br>*직접* 주문·예약', at: t })}
  ${flowPhone('abcu', ['00', '01', '02'], [k, k + 1.3], { at: t + 0.2, x: 72, y: 470, w: 400 })}
  ${check('직접 주문', w('주문하고', '6.7.1'), { x: 510, y: 560, c: 'amber' })}
  ${check('직접 예약', w('예약하면서', '6.7.1'), { x: 510, y: 670, c: 'blue' })}
  ${tagline('매일 데이터가 쌓여요', c('6.7.2'), { x: 510, y: 800, icon: 'db' })}
  ${note(SAMPLE, t + 0.6)}`)
}

// 14 L — 쌓인 데이터 → 새 사업
{
  const t = c('6.8.0') - 0.1, a = [c('6.9.0'), c('6.9.1'), c('6.9.2')]
  scene(t, `
  ${deco('ring', 860, 1100, 240, 'green', t + 0.3)}
  ${head({ eb: 'NEW BUSINESS', t: '데이터는 심사용만이<br>*아니에요*', at: t })}
  ${node(nodeIn('db', '쌓인 데이터'), t + 0.4, { x: 72, y: 600, w: 410, c: 'teal' })}
  ${node(nodeIn('rocket', '서비스로 출시'), a[0], { x: 550, y: 600, w: 410, c: 'blue' })}
  ${node(nodeIn('repeat', '구독 방식 운영'), a[1], { x: 72, y: 820, w: 410, c: 'violet' })}
  ${node(nodeIn('up', '*새로운 사업*'), a[2], { x: 550, y: 820, w: 410, c: 'copper', hl: a[2] + 0.4 })}
  ${lines([[482, 690, 550, 690, a[0] - 0.3, a[0]], [755, 780, 290, 820, a[1] - 0.4, a[1]], [482, 910, 550, 910, a[2] - 0.3, a[2]]], t)}`, { light: true })
}

// 15 D — 밖에서 보기에도
{
  const t = c('7.1.0') - 0.1, k = c('7.2.1')
  scene(t, `
  ${deco('sq', -80, 1120, 220, 'amber', t + 0.3)}
  ${head({ eb: 'FROM THE OUTSIDE', t: '쌓인 화면과 데이터는<br>*밖에서 보기에도* 달라요', at: t })}
  ${chip('투자자', w('투자자와', '7.2.0'), { x: 72, y: 620, c: 'blue' })}
  ${chip('심사위원', w('심사위원에게는', '7.2.0'), { x: 270, y: 620, c: 'violet' })}
  ${card(cardIn('star', '*투자하고 싶고* 지원하고 싶은 회사'), k, { x: 72, y: 760, w: 888, hiedge: true, ic: 'copper' })}`)
}

// 16 L — 심사 자리: 화면을 켜고 답한다
{
  const t = c('7.3.0') - 0.1, k = c('7.3.2')
  scene(t, `
  ${deco('disc', 890, 160, 200, 'violet', t + 0.3)}
  ${head({ eb: 'AT THE REVIEW', t: '이제는 *화면을 켜고*<br>답할 수 있어요', at: t })}
  ${bubble('“그래서, *다음은*<br>어떻게 되나요?”', w('그래서', '7.3.1'), { x: 72, y: 600, c: 'violet' })}
  ${flowPhone('mxax', ['01'], [], { at: k - 0.2, x: 540, y: 520, w: 400 })}
  ${note(SAMPLE, k)}`, { light: true })
}

// 17 D — 격차 · 먼저 도입한 회사가 유리
{
  const t = c('7.4.0') - 0.1, g = c('7.4.2')
  scene(t, `
  ${deco('ring', 860, 1120, 240, 'copper', t + 0.3)}
  ${head({ eb: 'THE GAP', t: '격차는 시간이 갈수록<br>*벌어질 수밖에*', at: t })}
  ${el(t + 0.3, 'AI를 적극 도입한 회사', { cls: 'ylabel abs', a: 'fade', style: 'left:72px;top:580px' })}
  <div class="track abs" style="left:72px;top:640px;width:888px" data-in="${t + 0.3}" data-a="fade"><div class="fill" style="--c:var(--copper)" data-grow="${g},${g + 2},860"></div></div>
  ${el(c('7.4.1'), '그렇지 않은 회사', { cls: 'ylabel abs', a: 'fade', style: 'left:72px;top:720px' })}
  <div class="track abs" style="left:72px;top:780px;width:888px" data-in="${c('7.4.1')}" data-a="fade"><div class="fill" style="--c:var(--blue)" data-grow="${g},${g + 2},300"></div></div>
  ${card(cardIn('rocket', '먼저 도입한 회사가 *확실히 유리*'), c('7.5.0'), { x: 72, y: 900, w: 888, hiedge: true, ic: 'copper' })}`)
}

// 18 L — 비용(말한 금액 비례)
{
  const t = c('8.1.0') - 0.1
  scene(t, `
  ${deco('sq', 880, 1120, 200, 'teal', t + 0.3)}
  ${head({ eb: 'PRICING', t: '비용을 *말씀드릴게요*', at: t })}
  ${bars([
    { label: 'MVP · 최소 기능 제품', val: '500만 원부터', v: 500, at: w('500만', '8.2.0') - 0.2, c: 'teal' },
    { label: '플랫폼형 · 고객이 쓰는', val: '1,500만 원부터', v: 1500, at: w('1500만', '8.2.1') - 0.2, c: 'blue' },
    { label: '풀 패키지 · AX + 플랫폼', val: '3,000만 원부터', v: 3000, at: w('3000만', '8.2.3') - 0.3, c: 'copper' },
  ], { y: 470, step: 150 })}
  ${card(cardIn('clock', '자금 흐름이 부담되면', '정산 시점을 자금이 들어온 *뒤로*'), c('8.3.0'), { x: 72, y: 920, w: 888, hiedge: true, ic: 'green' })}`, { light: true })
}

// 19 D — 부담 줄이기
{
  const t = c('8.4.0') - 0.1, a = [c('8.4.0'), c('8.4.2'), c('8.4.3')]
  scene(t, `
  ${deco('ring', 860, 150, 240, 'green', t + 0.3)}
  ${head({ eb: 'EASIER START', t: '초기 부담은<br>*크지 않게*', at: t })}
  ${numtag(1, '1년 동안 지원금·정책자금 *최소 5번 이상* 신청', a[0] + 0.2, { y: 540, w: 880, c: 'blue', dim: a[1] })}
  ${numtag(2, '처음엔 컨설팅 착수금만', a[1], { y: 680, w: 880, c: 'amber', dim: a[2] })}
  ${numtag(3, '개발비는 *후불로도* 가능', a[2], { y: 820, w: 880, c: 'copper' })}
  ${tagline('초기 부담이 크지 않아요', c('8.4.4'), { y: 990, icon: 'check' })}
  ${note('신청을 해 드리는 횟수입니다 · 선정·승인은 기관 심사에 따라 달라집니다', a[0] + 0.4)}`)
}

// 20 L — 한 단계씩 · 유지보수 1년 무상
{
  const t = c('9.1.0') - 0.1, k = c('9.2.0')
  scene(t, `
  ${deco('disc', 890, 160, 200, 'amber', t + 0.3)}
  ${head({ eb: 'STEP BY STEP', t: '작게 시작해서<br>*한 단계씩*', at: t })}
  ${card(cardIn('', 'MVP'), w('MVP나', '9.1.0'), { x: 72, y: 600, w: 300, c: 'teal', dim: c('9.1.1') + 0.6 })}
  ${card(cardIn('', '플랫폼형'), c('9.1.1'), { x: 366, y: 540, w: 300, c: 'blue', dim: k })}
  ${card(cardIn('', '풀 패키지'), c('9.1.1') + 0.6, { x: 660, y: 480, w: 300, c: 'copper', hiedge: true })}
  ${check('풀 패키지도 2주 안에 기본 틀', k, { y: 760, c: 'blue', dim: c('9.2.2') })}
  ${check('커스터마이징 · 테스트를 이어 가고', c('9.2.1'), { y: 870, c: 'violet', dim: c('9.2.2') })}
  ${status('기본 AX·플랫폼 유지보수 *1년 무상*', c('9.2.2'), { y: 1010 })}`, { light: true })
}

// 21 D — 진행 정도에 따라 정산 · 후불이면 후불로
{
  const t = c('10.1.0') - 0.1, k = c('10.1.2')
  scene(t, `
  ${deco('ring', -100, 1120, 260, 'blue', t + 0.3)}
  ${head({ eb: 'HOW WE SETTLE', t: '자금 승인과 *관계없이*<br>진행한 만큼 정산', at: t })}
  ${chip('컨설팅', w('컨설팅과', '10.1.0'), { x: 72, y: 600, c: 'violet' })}
  ${chip('개발', w('개발에', '10.1.0'), { x: 260, y: 600, c: 'blue' })}
  ${card(cardIn('check', '후불로 진행하기로 했다면', '*후불로 정산*합니다'), k + 0.5, { x: 72, y: 760, w: 888, hiedge: true, ic: 'copper', hl: k + 1.2 })}`)
}

// 22 L — 신청까지 하나의 스토리
{
  const t = c('11.1.0') - 0.1, s = c('11.2.2')
  scene(t, `
  ${deco('sq', 880, 1100, 200, 'violet', t + 0.3)}
  ${head({ eb: 'ONE STORY', t: '정책자금·지원사업<br>*신청까지* 함께', at: t })}
  ${node(nodeIn('ai', 'AX 개발'), w('개발부터', '11.2.1'), { x: 72, y: 600, w: 260, c: 'teal' })}
  ${node(nodeIn('shield', '인증'), w('인증까지', '11.2.1'), { x: 386, y: 600, w: 260, c: 'blue' })}
  ${node(nodeIn('doc', '자금 신청'), s, { x: 700, y: 600, w: 260, c: 'copper' })}
  ${lines([[332, 690, 386, 690, w('인증까지', '11.2.1') - 0.3, w('인증까지', '11.2.1')], [646, 690, 700, 690, s - 0.3, s]], t)}
  ${check('신청서 내용이 처음부터 *연결*', c('11.2.3'), { y: 860, c: 'green' })}`, { light: true })
}

// 23 D — 같은 팀 · 낮은 수수료
{
  const t = c('11.3.0') - 0.1
  scene(t, `
  ${deco('disc', 890, 170, 200, 'teal', t + 0.3)}
  ${head({ eb: 'SAME TEAM', t: '따로 맡기실 필요 *없이*', at: t })}
  ${check('추가 개발까지 같은 팀이 이어서', c('11.3.1'), { y: 500, c: 'blue' })}
  ${check('수수료는 일반 정책자금 컨설팅사보다 *낮게*', c('11.3.2'), { y: 620, w: 888, c: 'copper' })}
  ${tagline('자세한 내용은 상담 때 안내드릴게요', c('11.4.0'), { y: 800, icon: 'chatm' })}`)
}

// 24 L — 정리: 4단계
{
  const t = c('12.1.0') - 0.1
  scene(t, `
  ${deco('ring', 860, 1120, 240, 'amber', t + 0.3)}
  ${head({ eb: 'SUMMARY', t: '정리하겠습니다', at: t })}
  ${stepCards([c('12.2.0'), c('12.2.1'), c('12.2.2'), c('12.2.3')], 470, 170)}`, { light: true })
}

// 25 D — 한 팀이 이어서
{
  const t = c('12.3.0') - 0.1
  scene(t, `
  ${deco('sq', -80, 1120, 220, 'rose', t + 0.3)}
  ${head({ eb: 'ONE TEAM', t: '회사가 커져도<br>*스토리는 일관되게*', at: t })}
  ${node(nodeIn('flow', '기획'), w('기획부터', '12.3.1'), { x: 72, y: 600, w: 260, c: 'teal' })}
  ${node(nodeIn('gear', '개발'), w('개발', '12.3.1'), { x: 386, y: 600, w: 260, c: 'blue' })}
  ${node(nodeIn('bank', '자금 신청'), w('자금', '12.3.1'), { x: 700, y: 600, w: 260, c: 'amber' })}
  ${lines([{ d: 'M202 790 V840 H830 V790', t0: c('12.3.2') - 0.2, t1: c('12.3.2') + 0.6 }], t)}
  ${hub('한 팀', c('12.3.2'), { x: 421, y: 860 })}`)
}

// 26 L — 3분 진단 → 로고
{
  const t = c('12.4.0') - 0.1
  scene(t, `
  ${deco('ring', 840, 120, 260, 'copper', t + 0.2)}${deco('disc', -80, 1150, 240, 'teal', t + 0.4)}
  ${endCard({ at: t + 0.1, sub: '우리 회사는 어디서부터 시작하면 좋을까요?', subAt: t + 0.3, line: '3분 기업성장·<br>*AX Fit 진단*', lineAt: c('12.4.1'), cta: ['3분 AX Fit 진단 받기', 'miraeailab.com'], ctaAt: R.VOICE_END - 0.4 })}`, { light: true })
}

R.finish()
