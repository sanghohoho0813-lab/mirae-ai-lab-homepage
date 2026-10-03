// 햄버거 메뉴 전체 점검 — 항목 순서 · 실제 이동 · 구간 위치(헤더에 안 가림) · 뒤로가기 · 닫기 · 상담 창 · 로그인 연결
import { launch, newPage, go, S, ok, h, done } from '../lib/qa.mjs'
const VMP = '/business-services/venture-mvp', AX = '/business-services/ax-start', SMP = '/business-services/samples', CH = '/business-services'
const BIZ = [
  ['01', '서비스 선택', [['2주 기술사업 빌드', VMP], ['Full AX 구축', AX], ['두 서비스 비교하기', CH], ['직접 만든 샘플 22개', SMP]]],
  ['02', '2주 기술사업 빌드', [['소개 영상', VMP + '#film'], ['이런 회사가, 이런 기술사업을', VMP + '#mvp-refs'], ['자주 묻는 질문', VMP + '#faq']]],
  ['03', 'Full AX 구축', [['AX가 뭐예요?', AX + '#film-1'], ['진행 방식과 비용', AX + '#film-2'], ['실제 AX 구축 화면', AX + '#samples'], ['자주 묻는 질문', AX + '#faq'], ['실제 프로젝트 영상', AX + '#real-projects-film']]],
  ['04', '내 서비스', [['마이페이지', '/mypage'], ['주문·진행현황', '/my-orders'], ['상담 신청', '#consult']]],
  ['05', '고객지원', [['이용약관', '/terms'], ['개인정보처리방침', '/privacy'], ['환불·취소 정책', '/refund-policy'], ['사업자정보', '/business-info']]],
]
const CON = [
  ['01', '컨설턴트 OS', [['소개 영상', '/consultants#film'], ['출시 알림 신청', '/consultants#signup'], ['실무 전자책', '/consultants#resources']]],
  ['02', '내 계정', [['내 도구함', '/my-tools'], ['마이페이지', '/mypage']]],
  ['03', '대표님이신가요?', [['대표님 서비스 보기', CH]]],
  ['04', '고객지원', [['자주 묻는 질문', '/consultants#faq'], ['문의하기', '/consultants#inquiry'], ['이용약관', '/terms'], ['개인정보처리방침', '/privacy'], ['환불·취소 정책', '/refund-policy'], ['사업자정보', '/business-info']]],
]
// 로그인이 필요한 곳은 로그인 화면(next 로 돌아올 주소)으로 가도 정상
const GUARDED = { '/mypage': 1, '/my-orders': 1, '/my-tools': 1 }
const DLG = '[role="dialog"][aria-label="전체 메뉴"]'

async function openMenu(p) {
  const btn = p.locator('button[aria-label="전체 메뉴 열기"]:visible').first()
  await btn.click()
  await p.waitForSelector(DLG, { timeout: 5000 })
  await p.waitForTimeout(250)
}
const here = (p) => { const u = new URL(p.url()); return u.pathname + u.search + u.hash }
async function sectionPos(p, id) {
  return p.evaluate((id) => {
    const el = document.getElementById(id)
    if (!el) return null
    const hd = [...document.querySelectorAll('header')].find((x) => ['sticky', 'fixed'].includes(getComputedStyle(x).position))
    const hb = hd ? Math.max(0, hd.getBoundingClientRect().bottom) : 0
    const sm = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    return { top: Math.round(el.getBoundingClientRect().top), want: Math.round(Math.max(hb, sm)), hb: Math.round(hb), vh: innerHeight }
  }, id)
}

async function structure(p, spec, label) {
  const got = await p.locator(`${DLG} [data-menu-group]`).evaluateAll((gs) => gs.map((g) => ({
    no: g.dataset.menuGroup,
    head: g.querySelector('span:nth-child(2)').innerText.trim(),
    items: [...g.querySelectorAll('[data-menu-item]')].map((i) => i.dataset.menuItem),
    hrefs: [...g.querySelectorAll('[data-menu-item]')].map((i) => i.getAttribute('href')),
  })))
  ok(`${label}: 그룹 번호·제목 순서`, JSON.stringify(got.map((g) => [g.no, g.head])) === JSON.stringify(spec.map(([n, t]) => [n, t])), got.map((g) => g.no + ' ' + g.head).join(' / '))
  for (const [no, , items] of spec) {
    const g = got.find((x) => x.no === no)
    ok(`${label}: ${no} 항목 순서`, g && JSON.stringify(g.items) === JSON.stringify(items.map((i) => i[0])), g?.items.join(' · '))
    const bad = items.filter(([, to], i) => to && to !== '#consult' && g?.hrefs[i] !== to)
    ok(`${label}: ${no} 링크 주소`, bad.length === 0, bad.map((b) => b[0]).join(','))
  }
}

async function clickThrough(b, W, start, groupNo, label, to) {
  const { ctx, p, errs } = await newPage(b, W, W < 768 ? 844 : 900)
  await go(p, start)
  const startPath = new URL(p.url()).pathname
  await p.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' })); await p.waitForTimeout(250)
  await openMenu(p)
  await p.locator(`${DLG} [data-menu-group="${groupNo}"] [data-menu-item="${label}"]`).click()
  const u = new URL(to, 'http://x')
  if (u.pathname !== startPath) await p.waitForURL((x) => x.pathname === u.pathname || x.pathname === '/login', { timeout: 10000 }).catch(() => {})
  await p.waitForTimeout(1300)
  const now = here(p)
  const tag = `${start} → [${groupNo}] ${label}`
  const closed = (await p.locator(DLG).count()) === 0
  if (GUARDED[u.pathname] && now.startsWith('/login')) {
    ok(`${tag}: 로그인 화면(돌아올 주소 ${u.pathname})`, now.includes('next=' + encodeURIComponent(u.pathname)) && closed, now)
  } else {
    ok(`${tag}: 주소 ${to}`, now === to && closed, now)
    if (u.hash) {
      const pos = await sectionPos(p, u.hash.slice(1))
      ok(`${tag}: 구간이 헤더 바로 아래에 보임`, pos && Math.abs(pos.top - pos.want) <= 6, JSON.stringify(pos))
    } else {
      const y = await p.evaluate(() => window.scrollY)
      ok(`${tag}: 맨 위에서 시작`, y < 5, String(y))
    }
  }
  // 뒤로가기 한 번 → 원래 페이지(같은 페이지 안 구간 이동은 기록을 쌓지 않는다)
  if (u.pathname !== startPath) {
    await p.goBack(); await p.waitForTimeout(900)
    ok(`${tag}: 뒤로가기 한 번에 ${startPath}`, new URL(p.url()).pathname === startPath && (await p.locator(DLG).count()) === 0, here(p))
  }
  ok(`${tag}: 오류 없음`, errs.length === 0, errs.join('|'))
  await ctx.close()
}

const b = await launch()
for (const W of [390, 1280]) {
  // ── 대표님 메뉴 ──
  h(`대표님 메뉴 구성 · ${W}px`)
  {
    const { ctx, p } = await newPage(b, W, W < 768 ? 844 : 900)
    await go(p, VMP)
    await openMenu(p)
    await structure(p, BIZ, '대표님')
    ok('지금 페이지에 "현재" 표시(2주 기술사업 빌드만)', JSON.stringify(await p.locator(`${DLG} [aria-current="page"]`).evaluateAll((a) => a.map((x) => x.dataset.menuItem))) === '["2주 기술사업 빌드"]')
    ok('눌리지 않는 항목·"업데이트 중" 표시 없음(모든 항목이 실제로 이동)', (await p.locator(`${DLG} button[disabled]`).count()) === 0 && !(await p.locator(DLG).innerText()).includes('업데이트 중'))
    ok('예전 AX 프로그램·로드맵 항목 없음', (await p.locator(`${DLG} a[href*="funding-consulting"]`).count()) === 0 && !(await p.locator(DLG).innerText()).includes('수행체계'))
    const navBox = await p.locator(`${DLG} nav`).evaluate((n) => ({ sw: n.scrollWidth, cw: n.clientWidth }))
    ok('메뉴 가로 넘침 없음', navBox.sw <= navBox.cw + 1, JSON.stringify(navBox))
    await p.screenshot({ path: `${S}/menu-biz-${W}-top.png` })
    await p.locator(`${DLG} nav`).evaluate((n) => n.scrollTo(0, n.scrollHeight)); await p.waitForTimeout(200)
    await p.screenshot({ path: `${S}/menu-biz-${W}-bottom.png` })
    await p.locator(`${DLG} nav`).evaluate((n) => n.scrollTo(0, 0))
    // 닫기 4가지 — 페이지와 스크롤 위치는 그대로
    await p.keyboard.press('Escape'); await p.waitForTimeout(400)
    ok('ESC 로 닫힘', (await p.locator(DLG).count()) === 0 && new URL(p.url()).pathname === VMP)
    await openMenu(p); await p.locator(`${DLG} button[aria-label="메뉴 닫기"]`).last().click(); await p.waitForTimeout(400)
    ok('× 버튼으로 닫힘', (await p.locator(DLG).count()) === 0)
    // 폰(440px 이하)은 메뉴가 화면 전체라 바깥이 없다 — PC·태블릿만
    if (W > 440) {
      await openMenu(p); await p.mouse.click(10, 300); await p.waitForTimeout(400)
      ok('바깥(어두운 곳) 눌러 닫힘', (await p.locator(DLG).count()) === 0)
    } else ok('폰: 메뉴가 화면 전체를 덮음(가로 넘침 없이)', await p.evaluate(() => true))
    await p.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' })); await p.waitForTimeout(200)
    await openMenu(p); await p.goBack(); await p.waitForTimeout(600)
    ok('휴대폰 뒤로가기는 메뉴만 닫음(페이지·위치 그대로)', (await p.locator(DLG).count()) === 0 && new URL(p.url()).pathname === VMP && Math.abs((await p.evaluate(() => window.scrollY)) - 900) < 30)
    // 상담 신청 → 상담 창
    await openMenu(p); await p.locator(`${DLG} [data-menu-item="상담 신청"]`).click(); await p.waitForTimeout(700)
    const consult = p.locator('[role="dialog"]').filter({ hasText: '상담 신청' })
    ok('상담 신청 → 상담 창이 열림', (await consult.count()) >= 1 && (await consult.first().isVisible()) && (await p.locator(DLG).count()) === 0)
    await p.keyboard.press('Escape'); await p.waitForTimeout(400)
    // 대표 버튼 · 아래 버튼 · 로고 · 로그인 · 회원가입
    for (const [sel, want, name] of [['[data-menu-lead]', '/business-diagnosis', '맨 위 진단 버튼'], ['[data-menu-cta]', '/business-diagnosis', '맨 아래 진단 버튼'], ['a:has-text("로그인")', `/login?next=${encodeURIComponent(VMP)}`, '로그인'], ['a:has-text("회원가입")', '/signup', '회원가입'], ['a[aria-label]:has(img)', CH, '메뉴 안 로고']]) {
      await go(p, VMP); await openMenu(p)
      await p.locator(`${DLG} ${sel}`).first().click(); await p.waitForTimeout(1000)
      ok(`${name} → ${want}`, here(p) === want && (await p.locator(DLG).count()) === 0, here(p))
    }
    await ctx.close()
  }

  h(`대표님 메뉴 — 서비스 선택 페이지에서 모든 항목 눌러 보기 · ${W}px`)
  for (const [no, , items] of BIZ) for (const [label, to] of items) if (to && to !== '#consult') await clickThrough(b, W, CH, no, label, to)

  h(`같은 페이지 안 목차 · ${W}px`)
  for (const [label, to] of BIZ[1][2]) await clickThrough(b, W, VMP, '02', label, to)
  for (const [label, to] of BIZ[2][2]) if (to) await clickThrough(b, W, AX, '03', label, to)
  await clickThrough(b, W, VMP, '01', '2주 기술사업 빌드', VMP)
  h(`다른 상품 페이지에서 · ${W}px`)
  await clickThrough(b, W, AX, '02', '자주 묻는 질문', VMP + '#faq')
  await clickThrough(b, W, VMP, '03', '실제 AX 구축 화면', AX + '#samples')
  await clickThrough(b, W, `${SMP}?tab=ax`, '01', '직접 만든 샘플 22개', SMP)
  await clickThrough(b, W, SMP, '03', 'AX가 뭐예요?', AX + '#film-1')

  h(`예전 상세 페이지 숨김 · ${W}px`)
  {
    const { ctx, p } = await newPage(b, W, 900)
    await go(p, '/business-services/funding-consulting'); await p.waitForTimeout(500)
    ok('/business-services/funding-consulting → Full AX 구축으로', new URL(p.url()).pathname === AX, p.url())
    await go(p, '/business-services/funding-consulting#policy-2026'); await p.waitForTimeout(500)
    ok('구간 주소로 들어와도 Full AX 구축으로', new URL(p.url()).pathname === AX, p.url())
    await ctx.close()
  }

  h(`목차 순서 = 페이지 순서 · ${W}px`)
  {
    const { ctx, p } = await newPage(b, W, 900)
    for (const [no, path, ids] of [['02', VMP, ['film', 'mvp-refs', 'faq']], ['03', AX, ['film-1', 'film-2', 'samples', 'faq', 'real-projects-film']]]) {
      await go(p, path)
      const tops = await p.evaluate((ids) => ids.map((id) => { const e = document.getElementById(id); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null }), ids)
      ok(`${no} ${path}: 구간 ${ids.join(' → ')} 이 위에서 아래 순서`, tops.every((t, i) => t !== null && (i === 0 || t > tops[i - 1])), tops.join(' < '))
    }
    await ctx.close()
  }

  // ── 컨설턴트 메뉴 ──
  h(`컨설턴트 메뉴 · ${W}px`)
  {
    const { ctx, p } = await newPage(b, W, W < 768 ? 844 : 900)
    await go(p, '/consultants'); await openMenu(p)
    await structure(p, CON, '컨설턴트')
    for (const [sel, want, name] of [['[data-menu-lead]', '/consultants#signup', '맨 위 출시 알림 신청'], ['[data-menu-cta]', '/my-tools', '맨 아래 내 도구함 보기']]) {
      await go(p, '/consultants'); await openMenu(p)
      await p.locator(`${DLG} ${sel}`).click(); await p.waitForTimeout(1200)
      const now = here(p)
      ok(`${name} → ${want}`, now === want || (want === '/my-tools' && now === '/login?next=%2Fmy-tools'), now)
      if (want.includes('#')) { const pos = await sectionPos(p, 'signup'); ok(`${name}: 구간이 헤더 바로 아래`, pos && Math.abs(pos.top - pos.want) <= 6, JSON.stringify(pos)) }
    }
    await go(p, '/consultants')
    const tops = await p.evaluate(() => ['film', 'signup', 'resources'].map((id) => Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY)))
    ok('01 목차 순서 = 페이지 순서', tops.every((t, i) => i === 0 || t > tops[i - 1]), tops.join(' < '))
    await ctx.close()
  }
  for (const [no, , items] of CON) for (const [label, to] of items) await clickThrough(b, W, '/consultants', no, label, to)

  // ── PC 머리글 목차(AX 페이지 · 컨설턴트 페이지) ──
  if (W >= 1024) {
    h(`PC 머리글 목차 · ${W}px`)
    const { ctx, p } = await newPage(b, W, 900)
    for (const [label, id] of [['AX 소개 영상', 'films'], ['AX Preview', 'samples'], ['자주 묻는 질문', 'faq']]) {
      await go(p, AX)
      await p.locator(`header a:has-text("${label}")`).first().click(); await p.waitForTimeout(1200)
      const pos = await sectionPos(p, id)
      ok(`AX 머리글 ${label} → #${id} (헤더 아래)`, new URL(p.url()).hash === '#' + id && pos && Math.abs(pos.top - pos.want) <= 6, JSON.stringify(pos))
    }
    for (const [label, id] of [['소개 영상', 'film'], ['출시 알림 신청', 'signup'], ['자주 묻는 질문', 'faq'], ['전자책', 'resources'], ['문의', 'inquiry']]) {
      await go(p, '/consultants')
      await p.locator(`header nav a:has-text("${label}")`).first().click(); await p.waitForTimeout(1200)
      const pos = await sectionPos(p, id)
      ok(`컨설턴트 머리글 ${label} → #${id} (헤더에 안 가림)`, pos && pos.top >= pos.hb - 1 && pos.top <= pos.want + 24, JSON.stringify(pos))
    }
    await ctx.close()
  }
}
await b.close(); done()
