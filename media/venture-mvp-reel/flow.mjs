// 데모 사이트를 모바일(또는 PC)로 열어 steps 대로 눌러 가며 화면·누른 위치를 저장한다.
// 사용: node flow.mjs <name> <url> <mobile|desktop> '<steps json>'   (steps: [{text|sel, nth?, wait?, scroll?}])
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { cf } from './prod_relay.mjs'
const [name, url, mode, stepsJson] = process.argv.slice(2)
const steps = JSON.parse(stepsJson || '[]')
const mobile = mode !== 'desktop'
const OUT = `${process.env.OUT}/${name}`; mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ args: ['--no-proxy-server'] })
const ctx = await b.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: 'ko-KR', timezoneId: 'Asia/Seoul' })
await ctx.route('**', async (r) => { const q = r.request(); if (!/^https?:/.test(q.url())) return r.continue(); const res = await cf(q.url(), q.method(), q.headers(), q.postData()); if (!res) return r.abort(); await r.fulfill({ status: res.status, headers: res.headers, body: res.body }) })
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {})
await p.waitForTimeout(1500)
const meta = []
const list = async () => p.evaluate(() => [...document.querySelectorAll('button, a, [role=button], label, input[type=radio], [data-testid]')].map((e) => { const r = e.getBoundingClientRect(); const t = (e.innerText || e.getAttribute('aria-label') || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 30); return r.width > 0 && r.height > 0 && r.top >= 0 && r.top < innerHeight && t ? `${t}@${Math.round(r.left + r.width / 2)},${Math.round(r.top + r.height / 2)}` : null }).filter(Boolean).slice(0, 45))
await p.screenshot({ path: `${OUT}/00.png` })
meta.push({ i: 0, url: p.url() })
console.log('00', p.url(), '\n  ', (await list()).join(' | '))
for (let i = 0; i < steps.length; i++) {
  const s = steps[i]
  let tap = null
  if (s.scroll) { await p.evaluate((y) => window.scrollBy(0, y), s.scroll); await p.waitForTimeout(500) }
  if (s.text || s.sel) {
    const loc = s.sel ? p.locator(s.sel) : p.getByText(s.text, { exact: !!s.exact })
    const el = loc.nth(s.nth || 0)
    await el.scrollIntoViewIfNeeded().catch(() => {})
    await p.waitForTimeout(250)
    const bb = await el.boundingBox().catch(() => null)
    if (bb) tap = { x: Math.round(bb.x + bb.width / 2), y: Math.round(bb.y + bb.height / 2) }
    // 누르기 직전 화면(누를 곳이 보이는 상태)도 저장
    await p.screenshot({ path: `${OUT}/${String(i + 1).padStart(2, '0')}a.png` })
    await el.click({ timeout: 8000 }).catch((e) => console.log('  ! click fail', s.text || s.sel, e.message.slice(0, 60)))
  }
  await p.waitForTimeout(s.wait || 1200)
  await p.screenshot({ path: `${OUT}/${String(i + 1).padStart(2, '0')}.png` })
  meta.push({ i: i + 1, step: s, tap, url: p.url() })
  console.log(String(i + 1).padStart(2, '0'), JSON.stringify(s), 'tap', JSON.stringify(tap), p.url(), '\n  ', (await list()).join(' | '))
}
writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1))
await b.close()
