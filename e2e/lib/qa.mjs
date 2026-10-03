// 회귀 테스트 공용 도구 — 브라우저 열기 · 페이지 이동 · 결과 집계(통과 N · 실패 M)
//  - BASE: 점검할 주소(기본 http://127.0.0.1:4580 — run.mjs 가 개발 서버를 띄운다)
//  - 바깥 주소(구글·카카오·글꼴 CDN 등)는 막고, 글꼴(Pretendard)은 node_modules 에서 바로 준다 → 매번 같은 결과
//  - /api/** 는 가짜 성공 응답(실제 메일·DB 를 건드리지 않는다). 테스트마다 api 옵션으로 바꿀 수 있다
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
export const OUT = join(ROOT, '.out')
mkdirSync(OUT, { recursive: true })
export const S = OUT
export const BASE = process.env.BASE || 'http://127.0.0.1:4580'
export let pass = 0, fail = 0
export const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(`  ${c ? '✓' : '✗'} ${n}${x ? ' — ' + x : ''}`) }
export const h = (t) => console.log(`\n■ ${t}`)
export const done = () => { console.log(`\n통과 ${pass} · 실패 ${fail}`); if (fail) process.exitCode = 1 }

const FONT_DIR = join(dirname(require.resolve('pretendard/package.json')), 'dist/web/static/woff2')
const FONT = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' }

export async function launch() {
  const base = new URL(BASE)
  return chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: [`--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE ${base.hostname}`],
  })
}

export async function newPage(b, W, H = 844, { api } = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: W < 768, hasTouch: W < 768, locale: 'ko-KR', reducedMotion: 'reduce' })
  await ctx.route('**/pretendard*.css', (r) => r.fulfill({ contentType: 'text/css', body: Object.entries(FONT).map(([w, f]) => `@font-face{font-family:'Pretendard Variable';font-weight:${w};font-display:block;src:url('/__font/${f}.woff2') format('woff2')}`).join('\n') }))
  await ctx.route('**/__font/*.woff2', (r) => r.fulfill({ contentType: 'font/woff2', body: readFileSync(join(FONT_DIR, `Pretendard-${r.request().url().split('/').pop()}`)) }))
  await ctx.route(`${BASE}/api/**`, api || ((r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"message":"접수됐어요","sessionId":"qa","leadId":"qa","id":"qa"}' })))
  const p = await ctx.newPage()
  const errs = []; p.on('pageerror', (e) => errs.push(e.message))
  return { ctx, p, errs }
}

export async function go(p, path) {
  await p.goto(BASE + path, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(500)
}
export const text = (p, sel = 'body') => p.evaluate((s) => (document.querySelector(s)?.innerText || '').replace(/\s+/g, ' '), sel)
export const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
export const AXE_SOURCE = () => readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
