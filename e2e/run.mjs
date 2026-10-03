// 회귀 테스트 실행기 — 개발 서버를 띄우고(이미 떠 있으면 그대로 사용) 테스트를 하나씩 돌린 뒤 합계를 보여 준다.
//   npm test                  → 전부(pages · menu · films · a11y · api) — 약 15~20분
//   npm test -- pages films   → 고른 것만
//   BASE=https://miraeailab.com npm test -- pages   → 운영 사이트를 그대로 점검(서버를 띄우지 않음)
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = dirname(HERE)
const ALL = ['pages', 'films', 'a11y', 'menu', 'api']
const pick = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const tests = pick.length ? pick : ALL
const BASE = process.env.BASE || 'http://127.0.0.1:4580'

const up = async () => { try { return (await fetch(BASE + '/', { signal: AbortSignal.timeout(3000) })).ok } catch { return false } }
let server = null
const needServer = tests.some((t) => t !== 'api')
if (needServer && !(await up())) {
  if (process.env.BASE) { console.error(`✗ ${BASE} 에 연결할 수 없습니다`); process.exit(1) }
  console.log('개발 서버를 띄웁니다(127.0.0.1:4580)…')
  server = spawn('npx', ['vite', '--port', '4580', '--host', '127.0.0.1', '--strictPort'], { cwd: REPO, stdio: 'ignore', detached: true })
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 1000))
  if (!(await up())) { console.error('✗ 개발 서버가 뜨지 않았습니다'); process.exit(1) }
}

const results = []
for (const t of tests) {
  const file = t === 'api' ? join(HERE, 'tests/api.mts') : join(HERE, `tests/${t}.mjs`)
  const cmd = t === 'api' ? ['npx', ['tsx', file]] : ['node', [file]]
  console.log(`\n════════ ${t} ════════`)
  const out = await new Promise((resolve) => {
    let buf = ''
    const c = spawn(cmd[0], cmd[1], { cwd: HERE, env: { ...process.env, BASE } })
    c.stdout.on('data', (d) => { process.stdout.write(d); buf += d })
    c.stderr.on('data', (d) => process.stderr.write(d))
    c.on('close', (code) => resolve({ code, buf }))
  })
  const m = out.buf.match(/통과 (\d+) · 실패 (\d+)/g)?.pop()?.match(/(\d+)/g) || ['0', '1']
  results.push({ t, pass: +m[0], fail: +m[1] || (out.code ? 1 : 0) })
}
if (server) try { process.kill(-server.pid) } catch {}

console.log('\n════════ 합계 ════════')
for (const r of results) console.log(`  ${r.fail ? '✗' : '✓'} ${r.t.padEnd(6)} 통과 ${r.pass} · 실패 ${r.fail}`)
process.exit(results.some((r) => r.fail) ? 1 : 0)
