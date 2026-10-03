// 전 페이지 점검 — 오류(스크립트·콘솔) · 못 받은 파일 · 깨진 이미지 · 가로 넘침 · 맨 아래 바탕색(시스템 바 띠)이 화면 맨 아래 색과 같은지
import { launch, newPage, go, ok, h, done, BASE } from '../lib/qa.mjs'
const ROUTES = (process.env.ROUTES || `/ /consultants /login /signup /forgot-password /business-services /business-services/ax-start /business-services/venture-mvp /business-services/samples /business-services/samples?tab=ax /business-services/all /business-diagnosis /terms /privacy /refund-policy /business-info
/business-services/employment-subsidy /business-services/venture-innovation /business-services/ai-ax-system /business-services/ax-full-package /business-services/rnd-center /business-services/growth-roadmap-package
/ax-industries/manufacturing /ax-industries/beauty /ax-industries/healthcare /ax-industries/hair-salon /business-services/ax /business-services/funding-consulting /mypage /my-tools /no-such-page`).split(/\s+/).filter(Boolean)
const b = await launch()
const tops = []
// 화면 맨 아래 한가운데 내용 색(캔버스로 rgb 로 바꿔 비교 — 부품의 색 읽기 코드와 독립)
const probe = () => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1
  const cx = cv.getContext('2d', { willReadFrequently: true })
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data] }
  const root = document.documentElement
  let want = [255, 255, 255, 255]
  for (const el of document.elementsFromPoint(Math.round(innerWidth / 2), Math.max(0, innerHeight - 2))) {
    if (el === root || el === document.body) continue
    const v = rgba(getComputedStyle(el).backgroundColor)
    if (v[3] >= 217) { want = v; break }
  }
  const got = rgba(getComputedStyle(root).backgroundColor)
  const same = want.slice(0, 3).every((x, i) => Math.abs(x - got[i]) <= 2)
  const lum = (got[0] * 0.299 + got[1] * 0.587 + got[2] * 0.114) / 255
  return { same, want: want.slice(0, 3).join(','), got: got.slice(0, 3).join(','), lum }
}
for (const W of [390, 1280]) {
  h(`${W}px`)
  for (const r of ROUTES) {
    // 개발 서버는 처음 보는 화면의 부품을 준비하며 페이지를 한 번 새로고침할 때가 있다 — 그때는 한 번 더 확인한다
    let ctx = null
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const opened = await newPage(b, W, W < 768 ? 844 : 900)
        ctx = opened.ctx
        const { p, errs } = opened
        const cons = [], bad = []
        p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource: net::ERR_NAME_NOT_RESOLVED|googletagmanager|kakao|daum|ERR_NAME/.test(m.text())) cons.push(m.text().slice(0, 140)) })
        p.on('response', (res) => { const u = res.url(); if (u.startsWith(BASE) && res.status() >= 400 && !u.includes('/api/')) bad.push(`${res.status()} ${u.replace(BASE, '')}`) })
        p.on('requestfailed', (q) => { const u = q.url(); if (u.startsWith(BASE) && !/\.(mp4|webm)$/.test(u)) bad.push(`FAIL ${u.replace(BASE, '')} ${q.failure()?.errorText}`) })
        try { await go(p, r) } catch (e) { ok(`${r}: 열림`, false, String(e).slice(0, 120)); await ctx.close(); break }
        const final = new URL(p.url()); const at = final.pathname + final.search
        const info = await p.evaluate(() => ({
          over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src') && !i.closest('[aria-hidden="true"]') && i.loading !== 'lazy').map((i) => i.getAttribute('src')).slice(0, 4),
          title: document.title,
        }))
        // 맨 아래 띠 색 — 맨 위 · 중간 · 맨 아래에서 html 바탕색 = 화면 맨 아래 내용 색
        const tints = []
        for (const f of [0, 0.5, 1]) {
          await p.evaluate((f) => window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * f, behavior: 'instant' }), f)
          await p.waitForTimeout(700)
          const t = await p.evaluate(probe)
          tints.push(t.same ? 'ok' : `${t.want}≠${t.got}`)
          if (f === 0) tops.push([r, W, t.lum])
        }
        const tag = `${r}${at !== r ? ' → ' + at : ''}`
        ok(`${tag}: 스크립트 오류 없음`, errs.length === 0, errs.join(' | ').slice(0, 200))
        ok(`${tag}: 콘솔 오류 없음`, cons.length === 0, cons.join(' | ').slice(0, 300))
        ok(`${tag}: 못 받은 파일 없음`, bad.length === 0, bad.slice(0, 4).join(' | '))
        ok(`${tag}: 깨진 이미지 없음`, info.broken.length === 0, info.broken.join(','))
        ok(`${tag}: 가로 넘침 없음`, info.over <= 0, String(info.over))
        ok(`${tag}: 맨 아래 띠 색 = 화면 맨 아래 색(위·중간·아래)`, tints.every((t) => t === 'ok'), tints.join(' / '))
        await ctx.close()
        break
      } catch (e) {
        await ctx?.close().catch(() => {})
        if (attempt === 1 || !/context was destroyed|navigat/i.test(String(e))) throw e
        console.log(`  (${r}: 개발 서버가 페이지를 새로고침해 한 번 더 확인)`)
      }
    }
  }
}
// 어두운 첫 화면은 띠도 어둡게(녹화에서 문제였던 곳)
for (const [r, W, l] of tops) if (['/', '/consultants'].includes(r) && W === 390) ok(`${r} ${W}px: 첫 화면 맨 아래 띠가 어두움`, l < 0.2, l.toFixed(2))
await b.close(); done()
