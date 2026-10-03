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

  h(`AX 페이지 끝 실제 프로젝트 영상 · ${W}px`)
  {
    const { ctx, p, errs } = await newPage(b, W, W < 768 ? 844 : 900)
    await go(p, AX)
    const sec = p.locator('#real-projects-film')
    ok('구간 있음 · FAQ 다음 · 마무리 앞', (await sec.count()) === 1 && (await p.evaluate(() => { const y = (id) => document.getElementById(id)?.getBoundingClientRect().top; return y('faq') < y('real-projects-film') && y('real-projects-film') < y('cta') })))
    const v = sec.locator('video')
    const srcsNow = () => v.locator('source').evaluateAll((s) => s.map((x) => x.getAttribute('src')))
    const EP = { ep1: 'ax-real-ep1', ep2: 'ax-real-ep2', summary: 'ax-real-projects' }
    ok('편 고르기 3개(1편 · 2편 · 요약본)', (await sec.locator('[data-real-ep]').count()) === 3)
    ok('처음엔 1편', (await sec.locator('[data-real-ep="ep1"]').getAttribute('aria-pressed')) === 'true')
    for (const id of ['ep2', 'summary', 'ep1']) {
      await sec.locator(`[data-real-ep="${id}"]`).click(); await p.waitForTimeout(200)
      const srcs = await srcsNow()
      ok(`${id} 영상 주소 mp4 · webm`, JSON.stringify(srcs) === JSON.stringify([`/business/ax/${EP[id]}.mp4`, `/business/ax/${EP[id]}.webm`]), srcs.join(','))
      for (const u of [...srcs, await v.getAttribute('poster')]) { const n = await size(p, u); ok(`파일 있음 ${u}`, n > 10000, String(n)) }
    }
    ok('업종만 공개 안내', /업종만/.test(await text(p, '#real-projects-film')))
    ok('미리 받지 않음(preload none)', (await v.getAttribute('preload')) === 'none')
    await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(300)
    await p.screenshot({ path: `${S}/axreal-${W}.png` })
    await sec.locator('[data-story-sound]').click(); await p.waitForTimeout(700)
    ok('누르면 소리 켜고 재생(조절 막대 표시)', await v.evaluate((x) => !x.muted && x.controls))
    await sec.locator('[data-speed="1.25"]').click()
    ok('재생 속도 1.25배', (await v.evaluate((x) => x.playbackRate)) === 1.25)
    // 1편 끝 → '2편 이어 보기' → 2편이 소리 켜고 바로 재생
    await v.evaluate((x) => new Promise((r) => { const go = () => { x.currentTime = Math.max(0, x.duration - 0.4); x.play().catch(() => {}); r() }; x.readyState >= 1 ? go() : x.addEventListener('loadedmetadata', go, { once: true }) }))
    await sec.locator('[data-real-next]').waitFor({ timeout: 8000 }).catch(() => {})
    ok('1편 끝 화면에 2편 이어 보기', (await sec.locator('[data-real-next]').count()) === 1)
    if (await sec.locator('[data-real-next]').count()) {
      await sec.locator('[data-real-next]').click(); await p.waitForTimeout(900)
      const srcs = await srcsNow()
      ok('2편으로 바뀜', srcs[0] === '/business/ax/ax-real-ep2.mp4' && (await sec.locator('[data-real-ep="ep2"]').getAttribute('aria-pressed')) === 'true', srcs.join(','))
      ok('2편 소리 켜고 재생', await v.evaluate((x) => !x.muted && !x.paused && x.controls))
    }
    ok('가로 넘침 없음', (await overflow(p)) <= 0)
    ok('오류 없음', errs.length === 0, errs.join('|'))
    await ctx.close()
  }
}
await b.close(); done()
