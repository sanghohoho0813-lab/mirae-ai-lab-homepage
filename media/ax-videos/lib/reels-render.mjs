// 릴스 장면 파일(comp.html) → MP4 — Playwright 로 1/30초마다 render(t) → JPEG → ffmpeg(H.264).
//   node ../lib/reels-render.mjs .                       전체 렌더(구간을 나눠 동시에) → renders/video.mp4 → 음성 합치기 → renders/final.mp4
//   node ../lib/reels-render.mjs . snap 1.5,8,12.3       그 순간 화면들을 이어 붙인 한 장 → snapshots/sheet.jpg (안전 영역 선 포함: GUIDE=1)
// 환경 변수: FF(ffmpeg 경로) · WORKERS(동시에 돌릴 수, 기본 3) · CRF(기본 18) · CHROMIUM(크롬 경로)
// 음성: reel.json 의 voice(v1 은 assets/voice-fast.wav)를 앞 여백(offset)만큼 늦추고, 끝 1초는 줄인다.
//   v1 은 여기서 -14 LUFS 로 맞추고(두 번 재서), v2(normalized) 는 voice2.py 가 맞춘 음성을 그대로 쓴다.
import { spawn, spawnSync, execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = resolve(process.argv[2] || '.')
const mode = process.argv[3] || 'render'
const FF = process.env.FF || 'ffmpeg'
const FPS = 30
const meta = JSON.parse(readFileSync(join(dir, 'reel.json'), 'utf8'))
const DUR = meta.duration

async function loadChromium() {
  const tries = [process.env.PW, new URL('../../../e2e/node_modules/playwright/index.mjs', import.meta.url).pathname, 'playwright'].filter(Boolean)
  for (const p of tries) {
    try { return (await import(p.startsWith('/') ? pathToFileURL(p).href : p)).chromium } catch {}
  }
  throw new Error('playwright 를 찾지 못했어요 — e2e 폴더에서 npm install 하거나 PW=경로 를 주세요')
}

async function openPage(browser, guide = false) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
  await page.goto(pathToFileURL(join(dir, 'comp.html')).href + (guide ? '?guide=1' : ''))
  await page.evaluate(() => window.ready)
  await page.waitForTimeout(300)
  return page
}

const launch = async () => (await loadChromium()).launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--disable-gpu', '--font-render-hinting=none', '--disable-lcd-text'] })

if (mode === 'snap') {
  const times = (process.argv[4] || '0').split(',').map(Number)
  const out = process.argv[5] || join(dir, 'snapshots/sheet.jpg')
  mkdirSync(join(dir, 'snapshots/f'), { recursive: true })
  const browser = await launch()
  const page = await openPage(browser, process.env.GUIDE === '1')
  const files = []
  for (const t of times) {
    await page.evaluate((x) => window.render(x), t)
    const f = join(dir, `snapshots/f/${t.toFixed(2)}.jpg`)
    await page.screenshot({ path: f, type: 'jpeg', quality: 85 })
    files.push([t, f])
  }
  await browser.close()
  // 한 장으로 이어 붙이기(한 줄 6장, 1/3 크기)
  const py = `
import sys
from PIL import Image, ImageDraw, ImageFont
fs = sys.argv[2:]; out = sys.argv[1]
W, H = 360, 640; cols = min(6, len(fs)); rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (W + 8) + 8, rows * (H + 40) + 8), (40, 40, 40))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    t, p = f.split('::')
    im = Image.open(p).resize((W, H), Image.LANCZOS)
    x = 8 + (i % cols) * (W + 8); y = 8 + (i // cols) * (H + 40)
    sheet.paste(im, (x, y + 32)); d.text((x + 4, y + 6), t + 's', fill=(255, 220, 160))
sheet.save(out, quality=82)
`
  execFileSync('python3', ['-c', py, out, ...files.map(([t, f]) => `${t}::${f}`)])
  console.log('→', out)
  process.exit(0)
}

// ── 전체 렌더 ──
const N = Math.ceil(DUR * FPS)
const WORKERS = +(process.env.WORKERS || 3)
const CRF = process.env.CRF || '18'
const tmp = join(dir, 'renders/parts')
rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })
const t0 = Date.now()
const browser = await launch()

async function renderRange(k, a, b) {
  const page = await openPage(browser)
  const cdp = await page.context().newCDPSession(page)
  const file = join(tmp, `part${String(k).padStart(2, '0')}.mp4`)
  const ff = spawn(FF, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', CRF, '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] })
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))))
  for (let f = a; f < b; f++) {
    await page.evaluate((x) => window.render(x), f / FPS)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94, optimizeForSpeed: false, captureBeyondViewport: false })
    if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r))
    if (k === 0 && (f - a) % 300 === 0) console.log(`  ${k}: ${f - a}/${b - a} 프레임 · ${Math.round((Date.now() - t0) / 1000)}초`)
  }
  ff.stdin.end()
  await done
  await page.close()
  return file
}

const per = Math.ceil(N / WORKERS)
const parts = await Promise.all(Array.from({ length: WORKERS }, (_, k) => renderRange(k, k * per, Math.min(N, (k + 1) * per))))
await browser.close()
writeFileSync(join(tmp, 'list.txt'), parts.map((p) => `file '${p}'`).join('\n'))
const video = join(dir, 'renders/video.mp4')
execFileSync(FF, ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-c', 'copy', '-movflags', '+faststart', video])
console.log(`영상 ${N}프레임 · ${Math.round((Date.now() - t0) / 1000)}초`)

// ── 음성: 앞 여백 + -14 LUFS(두 번 재기) + 끝 1초 줄이기 → 합치기 ──
const voice = join(dir, meta.voice || 'assets/voice-fast.wav')
const ms = Math.round(meta.offset * 1000)
const pre = `adelay=${ms}|${ms},apad,atrim=0:${DUR}`
let ln = 'anull'
if (!meta.normalized) {
  // v1: 여기서 -14 LUFS 로 맞춘다(두 번 재서). v2 는 voice2.py 가 이미 맞춰 둔 음성을 그대로 쓴다.
  const m1 = spawnSync(FF, ['-hide_banner', '-i', voice, '-af', `${pre},loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr
  const L = JSON.parse(m1.slice(m1.lastIndexOf('{'), m1.lastIndexOf('}') + 1))
  ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${L.input_i}:measured_TP=${L.input_tp}:measured_LRA=${L.input_lra}:measured_thresh=${L.input_thresh}:offset=${L.target_offset}:linear=true`
}
const final = join(dir, process.env.OUT || 'renders/final.mp4')
// 음성 앞 여백만큼 늦추고, 뒤는 무음으로 채워(apad) 영상 길이에 맞춘다(-shortest 를 쓰지 않는다 — 끝 로고 장면이 잘린다)
execFileSync(FF, ['-loglevel', 'error', '-y', '-i', video, '-i', voice, '-filter_complex', `[1:a]${pre},${ln},afade=t=out:st=${(DUR - 1).toFixed(2)}:d=1,aresample=48000[a]`,
  '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-t', String(DUR), '-movflags', '+faststart', final])
console.log('→', final, `· 전체 ${Math.round((Date.now() - t0) / 1000)}초`)
