// 서버 함수(api/*) 입력 검사 — 실제 메일·DB 없이 함수만 불러 확인한다(환경변수 없음 = 메일 키 없음)
import inquiry from '../../api/inquiry.ts'
import consult from '../../api/consult.ts'
import phone from '../../api/phone-verification.ts'

let pass = 0, fail = 0
const ok = (n: string, c: boolean, x = '') => { c ? pass++ : fail++; console.log(`  ${c ? '✓' : '✗'} ${n}${x && !c ? ' — ' + x : ''}`) }
for (const k of ['RESEND_API_KEY', 'SMS_PROVIDER', 'SMS_API_KEY', 'PHONE_VERIFICATION_DEV', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[k]

async function call(h: any, body: unknown) {
  let status = 0, out: any = null
  const res: any = { setHeader() {}, status(c: number) { status = c; return res }, json(b: any) { out = b; return res }, end() { return res } }
  const ce = console.error; console.error = () => {}
  try { await h({ method: 'POST', body, headers: {}, query: {} }, res) } finally { console.error = ce }
  return { status, out: out ?? {} }
}

console.log('\n■ /api/inquiry')
let r = await call(inquiry, { name: 1, contact: {}, repetitiveTask: [], message: 2 })
ok('문자열이 아닌 값 → 400 (멈추지 않음)', r.status === 400, JSON.stringify(r))
r = await call(inquiry, { name: '홍', contact: 'a@b.com', repetitiveTask: 'x', message: 'y', website: 'http://spam' })
ok('스팸 함정 칸 채움 → 200 · 메일 안 보냄', r.status === 200 && r.out.ok === true, JSON.stringify(r))
r = await call(inquiry, '{bad json')
ok('깨진 JSON → 400 · 내부 오류 원문(detail) 없음', r.status === 400 && !('detail' in r.out), JSON.stringify(r))
r = await call(inquiry, { name: '홍', contact: '010-1 / a@b.com', repetitiveTask: 'x', message: 'y'.repeat(10000) })
ok('메일 키 없음 → 안내 · 환경변수 이름 노출 없음', r.out.debugCode === 'no_env' && !/RESEND|환경변수/.test(r.out.message), JSON.stringify(r.out))

console.log('\n■ /api/consult')
r = await call(consult, { name: '홍길동', contact: '010-1234-5678 / a@b.com', message: '상담', page: 1 })
ok('page 가 숫자여도 멈추지 않음', r.out.debugCode === 'no_env' || r.status < 500, JSON.stringify(r))
ok('응답에 detail 없음 · 환경변수 이름 없음', !('detail' in r.out) && !/RESEND/.test(String(r.out.message)), JSON.stringify(r.out))

console.log('\n■ /api/phone-verification')
r = await call(phone, { action: 'send', phone: '01012345678' })
ok('SMS 연동 전에는 닫혀 있음(503) · 인증번호 응답 없음', r.status === 503 && !('devCode' in r.out), JSON.stringify(r.out))

console.log(`\n통과 ${pass} · 실패 ${fail}`)
if (fail) process.exitCode = 1
