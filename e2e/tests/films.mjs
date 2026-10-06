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

  h(`AX 페이지 순서 · 실제 프로젝트 영상(영상 1 → 22개 화면 → 실제 프로젝트 → 영상 2 · 비용 → FAQ) · ${W}px`)
  {
    const { ctx, p, errs } = await newPage(b, W, W < 768 ? 844 : 900)
    await go(p, AX)
    const sec = p.locator('#real-projects-film')
    const order = ['concerns', 'film-1', 'samples', 'real-projects-film', 'film-2', 'outcome', 'faq', 'cta']
    const tops = await p.evaluate((ids) => ids.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? null), order)
    ok(`구간 순서 ${order.join(' → ')}`, tops.every((t, i) => t !== null && (i === 0 || t > tops[i - 1])), tops.map(Math.round).join(' < '))
    // 히어로 다음 '고민 4개' · FAQ 앞 '그래서 AX를 도입하면?' — 문구는 대표님 원문 그대로, 글자는 히어로 제목보다 작게, 왼쪽 기준선은 히어로와 같게
    const extra = await p.evaluate(() => {
      const fs = (el) => parseFloat(getComputedStyle(el).fontSize)
      const h1 = document.querySelector('h1'), c = document.getElementById('concerns'), o = document.getElementById('outcome')
      const t = (el) => el.innerText.replace(/\s+/g, ' ').trim()
      return {
        hero: fs(h1), heroL: Math.round(h1.getBoundingClientRect().left),
        cH2: t(c.querySelector('h2')), cItems: [...c.querySelectorAll('[data-ax-concern]')].map((li) => t(li)), cNext: t(c.querySelector('[data-ax-concerns-next]')),
        cSize: Math.max(fs(c.querySelector('h2')), fs(c.querySelector('[data-ax-concerns-next]'))), cL: Math.round(c.querySelector('h2').getBoundingClientRect().left),
        cols: new Set([...c.querySelectorAll('[data-ax-concern]')].map((li) => Math.round(li.getBoundingClientRect().left))).size,
        bold: [...c.querySelectorAll('[data-ax-concern] b')].map((b) => t(b)),
        oH2: t(o.querySelector('h2')), oText: t(o), oSize: Math.max(fs(o.querySelector('h2')), fs(o.querySelector('[data-ax-outcome-brand]'))), oL: Math.round(o.querySelector('h2').getBoundingClientRect().left),
        oBold: [...o.querySelectorAll('[data-ax-outcome-key] b')].map((b) => t(b)),
      }
    })
    ok('고민 구간 제목', extra.cH2 === '혹시, 이런 고민을 하고 계시진 않나요?', extra.cH2)
    ok('고민 4개 = 01~04 · 원문 그대로', extra.cItems.join('|') === [
      '01 지금은 매출이 나오고 있지만, 지금 방식 그대로 앞으로도 계속 성장할 수 있을지 불안하다.',
      '02 AI를 도입하지 않으면 뒤처질 것 같은데, 챗GPT·클로드를 쓰는 수준을 넘어 우리 회사 업무를 어디부터 어떻게 바꿔야 할지 모르겠다.',
      '03 매출은 늘어도 사람·관리비·리스크까지 같이 늘어, 정작 이익률은 좀처럼 좋아지지 않는다.',
      '04 정책자금·지원사업·투자 같은 기회가 와도, 왜 우리 회사가 경쟁력 있고 선택받아야 하는지 보여줄 근거가 부족하다.',
    ].join('|'), JSON.stringify(extra.cItems))
    ok('항목마다 핵심 문장 하나만 굵게', extra.bold.length === 4, JSON.stringify(extra.bold))
    ok('연결 문구 원문 그대로', extra.cNext === '하나라도 해당된다면, 우리 회사가 AX로 어떻게 달라질 수 있는지 영상으로 먼저 보여드릴게요.', extra.cNext)
    ok(`고민 4개 배치: ${W < 1024 ? '1열' : '2×2'}`, extra.cols === (W < 1024 ? 1 : 2), String(extra.cols))
    ok('마지막 정리 제목', extra.oH2 === '그래서, 우리 회사에 AX를 도입하면?', extra.oH2)
    ok('마지막 정리 문구 원문 그대로', extra.oText === '그래서, 우리 회사에 AX를 도입하면? 같은 인원으로 더 많은 고객과 업무를 처리하고, 놓치던 고객과 기회를 매출로 연결할 수 있는 구조를 만들고, 대표가 일일이 챙기지 않아도 일이 이어집니다. 밖에서도 휴대폰 하나면 우리 회사가 지금 어떻게 돌아가고 있는지 한눈에 볼 수 있습니다. 그리고 이런 변화가 쌓여 매출·정책자금·지원사업·투자로 이어질 수 있는 회사의 경쟁력과 성장 증거가 됩니다. AI를 도입하는 데서 끝내지 않습니다. 회사를 한 단계 더 성장시킵니다.', extra.oText)
    ok('강조: 매출·정책자금·지원사업·투자 · 회사의 경쟁력과 성장 증거', extra.oBold.join('|') === '매출·정책자금·지원사업·투자|회사의 경쟁력과 성장 증거', extra.oBold.join('|'))
    ok('두 구간 글자는 히어로 제목보다 작게', extra.cSize < extra.hero && extra.oSize < extra.hero, `${extra.cSize}/${extra.oSize} < ${extra.hero}`)
    ok('두 구간 왼쪽 기준선 = 히어로 제목', extra.cL === extra.heroL && extra.oL === extra.heroL, `${extra.cL}/${extra.oL}/${extra.heroL}`)
    const picks = await p.$$eval('[data-ax-film-pick]', (bs) => bs.map((x) => { const r = x.getBoundingClientRect(); return { id: x.dataset.axFilmPick, no: x.querySelector('span').textContent.trim(), top: Math.round(r.top), left: Math.round(r.left) } }))
    ok('골라 보기 번호 1~4 = 페이지 순서(영상 1 → 22개 화면 → 실제 프로젝트 → 영상 2)', picks.map((x) => x.no).join('') === '1234' && picks.map((x) => x.id).join() === 'film-1,samples,real-projects-film,film-2', JSON.stringify(picks.map((x) => x.no + x.id)))
    ok('골라 보기는 읽는 순서대로 놓임(왼쪽→오른쪽, 위→아래)', picks.every((x, i) => i === 0 || x.top > picks[i - 1].top || (x.top === picks[i - 1].top && x.left > picks[i - 1].left)))
    const marks = await p.evaluate(() => ['film-1', 'real-project-1', 'real-project-2', 'film-2'].map((id) => document.querySelector(`#${id} [data-film-mark]`)?.textContent.trim() + '|' + document.getElementById(id)?.querySelector('p')?.textContent))
    ok('영상 머리표 번호 = 골라 보기 번호(1 · 3 1편 · 3 2편 · 4)', marks[0].startsWith('1|') && marks[1].startsWith('3|') && marks[1].includes('1편') && marks[2].startsWith('3|') && marks[2].includes('2편') && marks[3].startsWith('4|'), JSON.stringify(marks.map((m) => m.slice(0, 20))))
    const cost = await p.locator('#film-2').evaluate((el) => el.textContent) // 휴대폰에서는 요점 목록이 접혀 있어 글자 기준으로 본다
    ok('비용 영상 설명: "500만 원부터"만(플랫폼형·풀 패키지 금액 없음)', cost.includes('500만 원부터') && !/1,500만|3,000만/.test(cost))
    ok('22개 화면 구간에는 실제 프로젝트 없음', (await p.locator('#samples [data-ax-real-project], #samples [data-real-episode]').count()) === 0)
    ok('실제 프로젝트는 살구색 바탕(영상 1·2와 같은 색)', await p.evaluate(() => ['films', 'real-projects-film'].map((id) => getComputedStyle(document.getElementById(id)).backgroundColor).every((c, _, a) => c === a[0])))
    ok('두 편 연달아(1편 → 2편)', (await sec.locator('[data-real-episode]').count()) === 2 && (await p.evaluate(() => document.getElementById('real-project-1').getBoundingClientRect().top < document.getElementById('real-project-2').getBoundingClientRect().top)))
    ok('나머지 4곳은 작은 카드(의료폐기물·웰니스 빼고)', await p.evaluate(() => { const t = [...document.querySelectorAll('#real-projects-film [data-ax-real-project]')].map((x) => x.textContent); return t.length === 4 && !t.some((x) => /의료폐기물|Wellness/.test(x)) }))
    const body = await text(p, '#real-projects-film')
    ok('1편 표시: 일반 중소기업 사례', /일반 중소기업 사례/.test(await text(p, '#real-project-1')))
    ok('2편 표시: 소상공인 사례', /소상공인 사례/.test(await text(p, '#real-project-2')))
    for (const n of [1, 2]) {
      const st = await text(p, `#real-project-${n} [data-film-status]`)
      ok(`${n}편 진행 상태: 완성 · 유지보수 단계 · 정책자금·지원사업 따로 신청 중`, /완성 · 실무에서 쓰며 안정화하는 유지보수 단계/.test(st) && /정책자금·지원사업은 따로 계속 신청 중/.test(st), st)
    }
    ok('업종만 공개 안내', /업종만/.test(body))
    const f1 = p.locator('#real-project-1'), f2 = p.locator('#real-project-2'), fc = p.locator('#film-2')
    const v1 = f1.locator('video'), v2 = f2.locator('video'), vc = fc.locator('video')
    for (const [n, f, v] of [[1, f1, v1], [2, f2, v2]]) {
      const srcs = await v.locator('source').evaluateAll((s) => s.map((x) => x.getAttribute('src')))
      ok(`${n}편 영상 주소 mp4 · webm`, JSON.stringify(srcs) === JSON.stringify([`/business/ax/ax-real-ep${n}.mp4`, `/business/ax/ax-real-ep${n}.webm`]), srcs.join(','))
      for (const u of [...srcs, await v.getAttribute('poster')]) { const k = await size(p, u); ok(`파일 있음 ${u}`, k > 10000, String(k)) }
      ok(`${n}편 미리 받지 않음(preload none)`, (await v.getAttribute('preload')) === 'none')
      ok(`${n}편 재생 속도 1 · 1.25 · 1.5배 버튼`, (await f.locator('[data-speed]').evaluateAll((b) => b.map((x) => x.getAttribute('data-speed')).join(','))) === '1,1.25,1.5')
    }
    await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(300)
    await p.screenshot({ path: `${S}/axreal-${W}.png` })
    await f1.screenshot({ path: `${S}/axreal-ep1-${W}.png` })
    await f1.locator('[data-ax-sound]').click(); await p.waitForTimeout(700)
    ok('1편 누르면 소리 켜고 재생(조절 막대 표시)', await v1.evaluate((x) => !x.muted && x.controls))
    await f1.locator('[data-speed="1.25"]').click()
    ok('1편 재생 속도 1.25배', (await v1.evaluate((x) => x.playbackRate)) === 1.25)
    await f2.locator('[data-speed="1.5"]').click()
    ok('2편 재생 속도 1.5배(1편과 따로)', (await v2.evaluate((x) => x.playbackRate)) === 1.5 && (await v1.evaluate((x) => x.playbackRate)) === 1.25)
    const toEnd = (v) => v.evaluate((x) => new Promise((r) => { const go = () => { x.currentTime = Math.max(0, x.duration - 0.4); x.play().catch(() => {}); r() }; x.readyState >= 1 ? go() : x.addEventListener('loadedmetadata', go, { once: true }) }))
    // 1편 끝 → '2편 이어 보기' → 2편이 소리 켜고 바로 재생, 1편은 멈춤
    await toEnd(v1)
    await f1.locator('[data-real-next]').waitFor({ timeout: 8000 }).catch(() => {})
    ok('1편 끝 화면에 2편 이어 보기', (await f1.locator('[data-real-next]').count()) === 1)
    if (await f1.locator('[data-real-next]').count()) {
      await f1.locator('[data-real-next]').click(); await p.waitForTimeout(1200)
      ok('2편 소리 켜고 재생', await v2.evaluate((x) => !x.muted && !x.paused && x.controls))
      ok('1편은 멈춤', await v1.evaluate((x) => x.paused))
    }
    // 2편 끝 → '진행 방식·비용(영상 2) 보기' → 영상 2가 소리 켜고 재생, 2편은 멈춤
    await toEnd(v2)
    await f2.locator('[data-real-cost]').waitFor({ timeout: 8000 }).catch(() => {})
    ok('2편 끝 화면에 영상 2(비용) 보기', (await f2.locator('[data-real-cost]').count()) === 1)
    if (await f2.locator('[data-real-cost]').count()) {
      await f2.locator('[data-real-cost]').click(); await p.waitForTimeout(1200)
      ok('영상 2 소리 켜고 재생', await vc.evaluate((x) => !x.muted && !x.paused && x.controls))
      ok('2편은 멈춤', await v2.evaluate((x) => x.paused))
      ok('영상 2가 화면에 보임', await vc.evaluate((x) => { const r = x.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 }))
    }
    ok('가로 넘침 없음', (await overflow(p)) <= 0)
    ok('오류 없음', errs.length === 0, errs.join('|'))
    await ctx.close()
  }
}
await b.close(); done()
