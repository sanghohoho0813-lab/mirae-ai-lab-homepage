// 운영(miraeailab.com) 확인용 — curl 로 중계해 프록시/방화벽 문제를 우회한다.
import { readFileSync, existsSync, unlinkSync, mkdtempSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { promisify } from 'node:util'
const pexec = promisify(execFile); const TMP = mkdtempSync(join(tmpdir(), 'pr-')); let seq = 0
export async function cf(url, m, h, d) {
  const id = `${process.pid}-${seq++}`, hf = join(TMP, `h${id}`), bf = join(TMP, `b${id}`)
  const a = ['-sS', '-L', '--max-time', '90', '-D', hf, '-o', bf, '-X', m]
  for (const [k, v] of Object.entries(h)) { if (/^(host|connection|content-length|accept-encoding|sec-|proxy-)/i.test(k)) continue; a.push('-H', `${k}: ${v}`) }
  if (d) a.push('--data-binary', d); a.push(url)
  let got = false
  for (let k = 0; k < 3 && !got; k++) { try { await pexec('curl', a, { maxBuffer: 1 << 28 }); got = existsSync(bf) } catch { await new Promise((r) => setTimeout(r, 600)) } }
  if (!got) return null
  const body = readFileSync(bf), head = existsSync(hf) ? readFileSync(hf, 'latin1') : ''
  let st = 200; const o = {}
  for (const blk of head.split(/\r?\n\r?\n/)) { const ls = blk.split(/\r?\n/).filter(Boolean); if (!ls.length) continue; const mm = /^HTTP\/[\d.]+ (\d{3})/.exec(ls[0]); if (mm) st = Number(mm[1]); for (const l of ls.slice(1)) { const i = l.indexOf(':'); if (i < 0) continue; const k = l.slice(0, i).trim().toLowerCase(); if (['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(k)) continue; o[k] = l.slice(i + 1).trim() } }
  try { unlinkSync(hf); unlinkSync(bf) } catch {}
  return { status: st, headers: o, body }
}
