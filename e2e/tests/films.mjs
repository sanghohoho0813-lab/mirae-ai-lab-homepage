// 영상 구간 — 컨설턴트 페이지는 '준비 중'(재생 안 함) · AX 페이지 끝 실제 프로젝트 영상 · 출시 알림 신청 폼
import { launch, newPage, go, S, ok, h, done, text, overflow, BASE } from '../lib/qa.mjs'
const AX = '/business-services/ax-start'
const DLG = '[role="dialog"][aria-label="전체 메뉴"]'
const size = async (p, u) => { const r = await p.request.fetch(BASE + u, { method: 'HEAD' }); return r.ok() ? Number(r.headers()['content-length'] || 0) : -r.status() }
const b = await launch()

for (const W of [390, 1280]) {
  h(`컨설턴트 페이지 — 영상 '준비 중' · 출시 알림 신청 · ${W}px`)
  {
    let sent = null
    const { ctx, p, errs } = await newPage(b, W, W < 768 ? 844 : 900, {
      api: (r) => { try { sent = JSON.parse(r.request().postData() || '{}') } catch {} r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }) },
    })
    const media = []
    p.on('request', (r) => { if (/os-film/.test(r.url())) media.push(r.url()) })
    await go(p, '/consultants')
    ok('영상(재생 요소) 없음', (await p.locator('#film video, [data-story-film="os"]').count()) === 0)
    const soon = p.locator('[data-os-film-soon]')
    ok('영상 자리에 "준비 중"', (await soon.count()) === 1 && (await soon.isVisible()) && (await soon.innerText()).includes('준비 중'))
    ok('"영상 소리 켜고 보기" 버튼 없음', (await p.locator('[data-os-film-cta]').count()) === 0)
    await p.waitForTimeout(500)
    ok('영상 파일·포스터를 받지 않음', media.length === 0, media.join(','))
    const t = await text(p)
    ok('11월 오픈 예정 표기 · 예전 일정(10월부터) 없음', t.includes('11월 오픈 예정') && !t.includes('10월부터'))
    ok('남은 구간 순서: 영상 → 출시 알림 → 질문 → 전자책 → 문의', await p.evaluate(() => { const ids = ['film', 'signup', 'faq', 'resources', 'inquiry'].map((id) => document.getElementById(id)?.getBoundingClientRect().top); return ids.every((x, i) => x != null && (i === 0 || x > ids[i - 1])) }))
    ok('가로 넘침 없음', (await overflow(p)) <= 0)
    await p.locator('[data-os-signup-cta]').click(); await p.waitForTimeout(900)
    ok('히어로 "출시 알림 신청" → #signup', new URL(p.url()).hash === '#signup')
    await p.locator('#signup button[type="submit"]').click(); await p.waitForTimeout(300)
    ok('빈 칸이면 보내지 않음', sent === null)
    await p.locator('#os-name').fill('홍길동'); await p.locator('#os-org').fill('테스트 컨설팅')
    await p.locator('#os-email').fill('qa@example.com'); await p.locator('#os-phone').fill('010-1234-5678')
    await p.locator('#signup button[type="submit"]').click(); await p.waitForTimeout(800)
    ok('보낸 내용: 이름·소속·이메일(답장 주소)·연락처 · 함정 칸 비어 있음', sent && sent.name === '홍길동' && sent.role === '테스트 컨설팅' && sent.contact === 'qa@example.com' && String(sent.message).includes('010-1234-5678') && !sent.website, JSON.stringify(sent))
    ok('신청 완료 안내', await p.locator('[data-os-signup-ok]').isVisible())
    ok('스팸 함정 칸은 화면·키보드에서 숨김', await p.locator('#signup input[name="website"]').evaluate((el) => el.tabIndex === -1 && el.closest('[aria-hidden="true"]') !== null && el.getBoundingClientRect().right < 0))
    ok('오류 없음', errs.length === 0, errs.join('|'))
    // 메뉴 '소개 영상' → 준비 중 칸
    await p.locator('button[aria-label="전체 메뉴 열기"]:visible').first().click(); await p.waitForSelector(DLG)
    const item = p.locator(`${DLG} [data-menu-item="소개 영상"]`)
    ok('메뉴 설명 "준비 중이에요"', (await item.innerText()).includes('준비 중이에요'))
    await ctx.close()
  }

  h(`AX 페이지 실제 프로젝트 영상(22개 화면 아래 · 목록 맨 앞) · ${W}px`)
  {
    const { ctx, p, errs } = await newPage(b, W, W < 768 ? 844 : 900)
    await go(p, AX)
    const sec = p.locator('#real-projects-film')
    ok('22개 화면 구간 안 · 실제 프로젝트 목록 맨 앞 · FAQ 위', (await sec.count()) === 1 && (await p.evaluate(() => { const y = (s) => document.querySelector(s)?.getBoundingClientRect().top; return !!document.querySelector('#samples #real-projects-film [data-ax-real-film]') && y('[data-ax-samples-all]') < y('#real-projects-film') && y('[data-ax-real-film]') < y('[data-ax-real-rest]') && y('#real-projects-film') < y('#faq') })))
    ok('나머지 4곳은 작은 카드(의료폐기물·웰니스 빼고)', await p.evaluate(() => { const t = [...document.querySelectorAll('[data-ax-real-project]')].map((x) => x.textContent); return t.length === 4 && !t.some((x) => /의료폐기물|Wellness/.test(x)) }))
    // 두 편 연달아 — 1편(중소기업에 가까운 사례) → 2편(소상공인에 가까운 사례), 편마다 옆에 안내
    ok('두 편 연달아(1편 → 2편)', (await sec.locator('[data-real-episode]').count()) === 2 && (await p.evaluate(() => document.getElementById('real-project-1').getBoundingClientRect().top < document.getElementById('real-project-2').getBoundingClientRect().top)))
    const body = await text(p, '#real-projects-film')
    ok('1편 안내: 중소기업에 가까운 사례', /중소기업에 가까운 사례/.test(await text(p, '#real-project-1')))
    ok('2편 안내: 소상공인에 가까운 사례', /소상공인에 가까운 사례/.test(await text(p, '#real-project-2')))
    ok('흐름 예상 안내', /대략 어떻게 흘러가는지/.test(body))
    ok('업종만 공개 안내', /업종만/.test(body))
    ok('요약본(예전 영상)은 없음', !(await p.locator('#real-projects-film source[src*="ax-real-projects"]').count()))
    const f1 = sec.locator('[data-story-film="ax-real-1"]'), f2 = sec.locator('[data-story-film="ax-real-2"]')
    const v1 = f1.locator('video'), v2 = f2.locator('video')
    for (const [n, f, v] of [[1, f1, v1], [2, f2, v2]]) {
      const srcs = await v.locator('source').evaluateAll((s) => s.map((x) => x.getAttribute('src')))
      ok(`${n}편 영상 주소 mp4 · webm`, JSON.stringify(srcs) === JSON.stringify([`/business/ax/ax-real-ep${n}.mp4`, `/business/ax/ax-real-ep${n}.webm`]), srcs.join(','))
      for (const u of [...srcs, await v.getAttribute('poster')]) { const k = await size(p, u); ok(`파일 있음 ${u}`, k > 10000, String(k)) }
      ok(`${n}편 미리 받지 않음(preload none)`, (await v.getAttribute('preload')) === 'none')
      ok(`${n}편 재생 속도 1 · 1.25 · 1.5배 버튼`, (await f.locator('[data-speed]').evaluateAll((b) => b.map((x) => x.getAttribute('data-speed')).join(','))) === '1,1.25,1.5')
    }
    await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(300)
    await p.screenshot({ path: `${S}/axreal-${W}.png` })
    await p.locator('#real-project-1').screenshot({ path: `${S}/axreal-ep1-${W}.png` })
    await p.locator('#real-project-2').screenshot({ path: `${S}/axreal-ep2-${W}.png` })
    await f1.locator('[data-story-sound]').click(); await p.waitForTimeout(700)
    ok('1편 누르면 소리 켜고 재생(조절 막대 표시)', await v1.evaluate((x) => !x.muted && x.controls))
    await f1.locator('[data-speed="1.25"]').click()
    ok('1편 재생 속도 1.25배', (await v1.evaluate((x) => x.playbackRate)) === 1.25)
    await f2.locator('[data-speed="1.5"]').click()
    ok('2편 재생 속도 1.5배(1편과 따로)', (await v2.evaluate((x) => x.playbackRate)) === 1.5 && (await v1.evaluate((x) => x.playbackRate)) === 1.25)
    // 1편 끝 → '2편 이어 보기' → 2편이 소리 켜고 바로 재생, 1편은 멈춤
    await v1.evaluate((x) => new Promise((r) => { const go = () => { x.currentTime = Math.max(0, x.duration - 0.4); x.play().catch(() => {}); r() }; x.readyState >= 1 ? go() : x.addEventListener('loadedmetadata', go, { once: true }) }))
    await f1.locator('[data-real-next]').waitFor({ timeout: 8000 }).catch(() => {})
    ok('1편 끝 화면에 2편 이어 보기', (await f1.locator('[data-real-next]').count()) === 1)
    if (await f1.locator('[data-real-next]').count()) {
      await f1.locator('[data-real-next]').click(); await p.waitForTimeout(1200)
      ok('2편 소리 켜고 재생', await v2.evaluate((x) => !x.muted && !x.paused && x.controls))
      ok('1편은 멈춤', await v1.evaluate((x) => x.paused))
      ok('2편이 화면에 보임', await p.evaluate(() => { const r = document.querySelector('[data-story-film="ax-real-2"] video').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 }))
    }
    ok('가로 넘침 없음', (await overflow(p)) <= 0)
    ok('오류 없음', errs.length === 0, errs.join('|'))
    await ctx.close()
  }
}
await b.close(); done()
