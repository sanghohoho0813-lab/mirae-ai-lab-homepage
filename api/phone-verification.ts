// /api/phone-verification — 휴대폰 SMS 인증 (자체 포함, 외부 helper import 0개).
//   POST action=send    : 인증번호 발송 (코드 해시만 저장, 평문 미저장)
//   POST action=verify  : 인증번호 검증 (만료·시도횟수 확인)
//   POST action=confirm : 가입/로그인 세션으로 본인 확인 후 profiles.phone_verified=true 세팅
//   GET                 : health 체크
//
// 필요 환경변수 (Vercel → Settings → Environment Variables, 등록 후 Redeploy):
//   VITE_SUPABASE_URL (또는 SUPABASE_URL)   — Supabase 프로젝트 URL
//   SUPABASE_SERVICE_ROLE_KEY               — service_role 키 (⚠️ 절대 VITE_ 접두 금지)
//   PHONE_VERIFY_SALT                        — (선택) 코드 해시 솔트. 미설정 시 service_role 키로 대체
//   SMS_PROVIDER / SMS_API_KEY / ...         — (미구현·TODO) 실제 SMS 발송 provider (예: SOLAPI, NHN, Twilio)
//
// ⚠️ 실제 SMS 발송 provider 가 설정되지 않은 동안에는 testMode 로 동작하며 인증번호를 응답으로 반환합니다.
//    운영 전환 전 반드시 SMS provider 를 연결하고 testMode 응답(devCode)을 비활성화하세요.
//
// 이 파일은 결제(PortOne)·관리자 로직과 완전히 분리되어 있으며, 기존 기능에 영향을 주지 않습니다.

const CODE_TTL_SEC = 180 // 인증번호 유효시간 3분
const MAX_ATTEMPTS = 5 // 코드 검증 최대 시도
const CONFIRM_WINDOW_SEC = 30 * 60 // verify 후 confirm 유효 시간 30분

function normalizePhone(p: unknown): string {
  return String(p ?? '').replace(/[^0-9]/g, '').slice(0, 15)
}
function isValidMobile(p: string): boolean {
  return /^01[016789][0-9]{7,8}$/.test(p)
}

export default async function handler(req: any, res: any) {
  try {
    // 0) health 체크
    if (req.method === 'GET') {
      const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
      const svc = process.env.SUPABASE_SERVICE_ROLE_KEY
      const smsConfigured = Boolean(process.env.SMS_PROVIDER && process.env.SMS_API_KEY)
      return res.status(200).json({
        ok: true,
        service: 'phone-verification',
        supabaseConfigured: Boolean(url && svc),
        smsConfigured,
        testMode: !smsConfigured,
      })
    }

    if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'method not allowed' })

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {})
    const action = String(body.action ?? '')

    // Supabase service_role 클라이언트 (핸들러 안에서 동적 import)
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return res.status(503).json({ ok: false, message: '인증 서버가 아직 설정되지 않았습니다. 잠시 후 다시 시도해주세요.', debugCode: 'no_supabase' })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const admin: any = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    const { createHash, randomInt } = await import('node:crypto')
    const salt = process.env.PHONE_VERIFY_SALT || serviceKey
    const hashCode = (phone: string, code: string) => createHash('sha256').update(`${phone}:${code}:${salt}`).digest('hex')

    // ── send ──────────────────────────────────────────────
    if (action === 'send') {
      const phone = normalizePhone(body.phone)
      const purpose = ['signup', 'identity', 'recover'].includes(body.purpose) ? body.purpose : 'signup'
      if (!isValidMobile(phone)) return res.status(400).json({ ok: false, message: '휴대폰 번호 형식을 확인해주세요.', debugCode: 'bad_phone' })

      // 레이트리밋: 최근 1분 3회 / 1시간 10회
      const now = Date.now()
      const { data: recent } = await admin
        .from('phone_verifications')
        .select('created_at')
        .eq('phone', phone)
        .gte('created_at', new Date(now - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20)
      const list: { created_at: string }[] = recent ?? []
      const inLastMin = list.filter((r) => now - new Date(r.created_at).getTime() < 60 * 1000).length
      if (inLastMin >= 3) return res.status(429).json({ ok: false, message: '잠시 후 다시 시도해주세요.', debugCode: 'rate_min' })
      if (list.length >= 10) return res.status(429).json({ ok: false, message: '요청이 많습니다. 잠시 후 다시 시도해주세요.', debugCode: 'rate_hour' })

      const code = String(randomInt(0, 1000000)).padStart(6, '0')
      const expiresAt = new Date(now + CODE_TTL_SEC * 1000).toISOString()
      const { error: insErr } = await admin.from('phone_verifications').insert({
        phone,
        code_hash: hashCode(phone, code),
        purpose,
        expires_at: expiresAt,
      })
      if (insErr) {
        const msg = String(insErr.message || '')
        if (/relation .*phone_verifications.* does not exist/i.test(msg)) {
          return res.status(503).json({ ok: false, message: '인증 기능 준비 중입니다(DB 미설정).', debugCode: 'no_table' })
        }
        return res.status(500).json({ ok: false, message: '인증번호 발송에 실패했습니다.', debugCode: 'insert_failed' })
      }

      const smsConfigured = Boolean(process.env.SMS_PROVIDER && process.env.SMS_API_KEY)
      if (smsConfigured) {
        // TODO(SMS): 실제 SMS 발송 provider 연동 (SOLAPI/NHN/Twilio 등).
        //   await sendSms(phone, `[미래 AI 랩] 인증번호 ${code} (3분 이내 입력)`)
        //   provider 실패 시 500 반환 및 로그. 현재는 미구현.
        return res.status(200).json({ ok: true, expiresInSec: CODE_TTL_SEC })
      }
      // 테스트모드 — provider 미설정. 인증번호를 응답으로 반환(운영 전 반드시 provider 연결).
      return res.status(200).json({ ok: true, expiresInSec: CODE_TTL_SEC, testMode: true, devCode: code })
    }

    // ── verify ────────────────────────────────────────────
    if (action === 'verify') {
      const phone = normalizePhone(body.phone)
      const code = String(body.code ?? '').replace(/[^0-9]/g, '')
      if (!isValidMobile(phone) || code.length !== 6) return res.status(400).json({ ok: false, message: '인증번호를 확인해주세요.', debugCode: 'bad_input' })

      const { data: rows } = await admin
        .from('phone_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('consumed', false)
        .order('created_at', { ascending: false })
        .limit(1)
      const row = (rows ?? [])[0]
      if (!row) return res.status(400).json({ ok: false, message: '인증번호를 먼저 요청해주세요.', debugCode: 'no_code' })
      if (new Date(row.expires_at).getTime() < Date.now()) return res.status(400).json({ ok: false, message: '인증번호가 만료되었습니다. 다시 요청해주세요.', debugCode: 'expired' })
      if (row.attempts >= MAX_ATTEMPTS) return res.status(429).json({ ok: false, message: '시도 횟수를 초과했습니다. 다시 요청해주세요.', debugCode: 'too_many' })

      if (row.code_hash !== hashCode(phone, code)) {
        await admin.from('phone_verifications').update({ attempts: row.attempts + 1 }).eq('id', row.id)
        return res.status(400).json({ ok: false, message: '인증번호가 일치하지 않습니다.', remainingAttempts: Math.max(0, MAX_ATTEMPTS - row.attempts - 1), debugCode: 'mismatch' })
      }
      await admin.from('phone_verifications').update({ verified: true, verified_at: new Date().toISOString() }).eq('id', row.id)
      return res.status(200).json({ ok: true })
    }

    // ── confirm ───────────────────────────────────────────
    // 가입/로그인(세션) 이후: 토큰으로 본인 확인 → 해당 번호의 verified 기록 확인 → phone_verified=true
    if (action === 'confirm') {
      const phone = normalizePhone(body.phone)
      const token = String(body.accessToken ?? '')
      if (!token) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.', debugCode: 'no_token' })

      const { data: userData, error: uErr } = await admin.auth.getUser(token)
      if (uErr || !userData?.user) return res.status(401).json({ ok: false, message: '유효하지 않은 인증입니다.', debugCode: 'bad_token' })
      const userId = userData.user.id

      // 프로필 휴대폰과 일치 확인 (번호 위조 방지)
      const { data: prof } = await admin.from('profiles').select('phone').eq('id', userId).maybeSingle()
      const profPhone = normalizePhone(prof?.phone)
      if (profPhone && phone && profPhone !== phone) {
        return res.status(400).json({ ok: false, message: '가입 정보의 휴대폰 번호와 일치하지 않습니다.', debugCode: 'phone_mismatch' })
      }
      const targetPhone = phone || profPhone
      if (!targetPhone) return res.status(400).json({ ok: false, message: '휴대폰 번호를 확인할 수 없습니다.', debugCode: 'no_phone' })

      const { data: rows } = await admin
        .from('phone_verifications')
        .select('*')
        .eq('phone', targetPhone)
        .eq('verified', true)
        .eq('consumed', false)
        .gte('verified_at', new Date(Date.now() - CONFIRM_WINDOW_SEC * 1000).toISOString())
        .order('verified_at', { ascending: false })
        .limit(1)
      const row = (rows ?? [])[0]
      if (!row) return res.status(400).json({ ok: false, message: '휴대폰 인증을 먼저 완료해주세요.', debugCode: 'not_verified' })

      await admin.from('profiles').update({ phone_verified: true, phone_verified_at: new Date().toISOString() }).eq('id', userId)
      await admin.from('phone_verifications').update({ consumed: true }).eq('id', row.id)
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.', debugCode: 'bad_action' })
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: '인증 처리 중 오류가 발생했습니다.', detail: String(e?.message ?? e).slice(0, 180) })
  }
}
