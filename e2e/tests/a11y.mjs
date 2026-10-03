// 접근성(axe-core) — 주요 페이지에 '심각(serious)·치명(critical)' 위반이 하나도 없어야 한다
import { launch, newPage, go, ok, h, done, AXE_SOURCE } from '../lib/qa.mjs'
const AXE = AXE_SOURCE()
const R = (process.env.ROUTES || '/ /consultants /business-services /business-services/ax-start /business-services/venture-mvp /business-services/samples /business-diagnosis /login /signup /terms /privacy /refund-policy /business-info').split(/\s+/).filter(Boolean)
const b = await launch()
for (const W of [390, 1280]) {
  h(`${W}px`)
  for (const r of R) {
    const { ctx, p } = await newPage(b, W, W < 768 ? 844 : 900)
    await go(p, r)
    // 끝까지 한 번 내려서 나중에 그려지는 요소까지 검사한다
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } window.scrollTo(0, 0) })
    await p.waitForTimeout(300)
    await p.addScriptTag({ content: AXE })
    const v = await p.evaluate(async () => {
      const out = await window.axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })
      return out.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical').map((x) => `${x.id}(${x.nodes.length}): ${x.nodes[0]?.html.slice(0, 90)}`)
    })
    ok(`${r}: 심각·치명 접근성 위반 없음`, v.length === 0, v.join(' | '))
    await ctx.close()
  }
}
await b.close(); done()
