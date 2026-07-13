// /api/identity — PortOne V2 본인인증(PASS) + 가입 오케스트레이션 (자체 포함, action 통합 엔드포인트)
//
//   GET                       : 설정 상태 점검 (identityConfigured / required / environment)
//   POST action=prepare       : 서버가 본인인증 요청 ID 생성 (클라이언트 임의 생성 금지)
//   POST action=verify        : PortOne 단건조회로 인증 결과 서버 재검증 (클라이언트 결과 불신)
//   POST action=status        : 임시 세션 복구용 상태 조회 (뒤로가기 시 재인증 강요 방지)
//   POST action=attach        : 가입/로그인 세션(user)에 인증 결과 연결 → profiles 인증 필드 확정
//   POST action=consent       : 약관 동의 기록 (버전·시각·최소 접속정보)
//   POST action=complete      : 온보딩 완료 판정 (역할+본인인증+필수동의 모두 충족 시에만)
//   POST action=add_role      : 두 번째 역할 추가 (ceo ↔ consultant)
//   POST action=track         : 인증 퍼널 이벤트 (민감정보 금지 — provider/role/실패분류만)
//   POST action=migrate_diagnosis : 비회원 진단기록을 계정에 연결 (sessionToken 기준 멱등)
//
// 필요 환경변수 (Vercel, 등록 후 Redeploy):
//   VITE_SUPABASE_URL(또는 SUPABASE_URL) / SUPABASE_SERVICE_ROLE_KEY      — Supabase 서버
//   VITE_PORTONE_STORE_ID(또는 PORTONE_STORE_ID)                          — 상점 아이디 (결제와 공용)
//   PORTONE_API_SECRET                                                    — V2 API Secret (결제와 공용, 서버 전용)
//   VITE_PORTONE_IDENTITY_CHANNEL_KEY                                     — ⚠️ 본인인증 전용 채널키 (결제 채널키와 별개)
//   PORTONE_IDENTITY_ENV                                                  — test | live (기본 test)
//   IDENTITY_VERIFICATION_REQUIRED                                        — 기본 true. 'false' 일 때만 신규가입 인증 생략 허용
//   IDENTITY_HASH_SALT                                                    — (선택) CI 해시 솔트. 미설정 시 API Secret 파생
//
// 보안 원칙 (fail-closed):
//   * 본인인증 미설정 + REQUIRED=true → prepare 503, complete 차단 (가짜 성공·우회 없음)
//   * 이름·휴대폰·생년월일은 PortOne 서버 조회 결과만 신뢰 (클라이언트 입력 무시)
//   * CI/DI·주민번호 원문 저장 금지 — CI 는 단방향 HMAC 해시만
//   * 인증 ID 재사용 금지(used_at) · 30분 만료 · storeId 대조 · 레이트리밋
//   * 오류 응답에 PortOne/Supabase 원문·스택 미노출, 로그에 개인정보 미기록

const VERIFICATION_TTL_MIN = 30
const CONSENT_KEYS = ['terms', 'privacy', 'age14', 'identity', 'marketing'] as const
const REQUIRED_CONSENTS = ['terms', 'privacy', 'age14', 'identity'] as const
const TRACK_EVENTS = [
  'signup_page_viewed', 'signup_role_selected', 'oauth_started', 'oauth_succeeded', 'oauth_failed',
  'identity_started', 'identity_succeeded', 'identity_failed', 'terms_agreed', 'signup_submitted',
  'signup_completed', 'onboarding_abandoned', 'login_succeeded', 'login_failed', 'password_reset_requested',
] as const
const ROLES = ['ceo', 'consultant'] as const

type Cfg = {
  storeId: string | null
  apiSecret: string | null
  channelKey: string | null
  environment: 'test' | 'live'
  required: boolean
}

function readConfig(): Cfg {
  return {
    storeId: process.env.VITE_PORTONE_STORE_ID || process.env.PORTONE_STORE_ID || null,
    apiSecret: process.env.PORTONE_API_SECRET || null,
    channelKey: process.env.VITE_PORTONE_IDENTITY_CHANNEL_KEY || null,
    environment: process.env.PORTONE_IDENTITY_ENV === 'live' ? 'live' : 'test',
    required: process.env.IDENTITY_VERIFICATION_REQUIRED !== 'false',
  }
}
function identityConfigured(c: Cfg): boolean {
  return Boolean(c.storeId && c.apiSecret && c.channelKey)
}
function normPhone(p: unknown): string {
  return String(p ?? '').replace(/[^0-9]/g, '').slice(0, 15)
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
/** 소셜(google/kakao) 로그인 여부 — app_metadata.provider/providers + identities[].provider */
function detectSocial(u: any): boolean {
  const ap = u?.app_metadata ?? {}
  const list = [ap.provider, ...((ap.providers as string[] | undefined) ?? []), ...(((u?.identities as any[] | undefined) ?? []).map((i) => i?.provider))]
  return list.some((p) => p === 'google' || p === 'kakao')
}
/** OAuth provider 가 검증한 이메일 해석 — user.email → identities.identity_data.email → user_metadata.(account_)email */
function resolveEmail(u: any): string | null {
  const meta = u?.user_metadata ?? {}
  const cands = [u?.email, ...(((u?.identities as any[] | undefined) ?? []).map((i) => i?.identity_data?.email)), meta.email, meta.account_email]
  const f = cands.find((e) => typeof e === 'string' && EMAIL_RE.test(e))
  return typeof f === 'string' ? f : null
}

// 인스턴스 단위 레이트리밋 (보조 — DB 카운트가 1차)
const rateBucket = new Map<string, number[]>()
function hitRate(key: string, maxPerMin: number): boolean {
  const now = Date.now()
  const arr = (rateBucket.get(key) ?? []).filter((t) => now - t < 60_000)
  if (arr.length >= maxPerMin) return false
  arr.push(now)
  rateBucket.set(key, arr)
  return true
}

export default async function handler(req: any, res: any) {
  try {
    const cfg = readConfig()

    if (req.method === 'GET') {
      const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
      return res.status(200).json({
        ok: true,
        service: 'identity',
        identityConfigured: identityConfigured(cfg),
        required: cfg.required,
        environment: cfg.environment,
        supabaseConfigured: Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY),
      })
    }
    if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'method not allowed' })

    // body 크기 제한 + 파싱
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {})
    if (raw.length > 20_000) return res.status(413).json({ ok: false, message: '요청이 너무 큽니다.' })
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {})
    const action = String(body.action ?? '')

    const supaUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supaUrl || !serviceKey) {
      return res.status(503).json({ ok: false, message: '서버가 아직 설정되지 않았습니다. 잠시 후 다시 시도해주세요.', debugCode: 'no_supabase' })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const admin: any = createClient(supaUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    const { createHash, createHmac, randomUUID } = await import('node:crypto')
    const salt = process.env.IDENTITY_HASH_SALT || `idv:${serviceKey.slice(0, 24)}`
    const hmac = (v: string) => createHmac('sha256', salt).update(v).digest('hex')
    const ipOf = () => {
      const xf = req.headers['x-forwarded-for']
      const ip = (Array.isArray(xf) ? xf[0] : xf || '').split(',')[0].trim() || req.socket?.remoteAddress || ''
      return ip ? createHash('sha256').update(`${ip}:${salt}`).digest('hex') : null
    }
    const uaOf = () => String(req.headers['user-agent'] ?? '').slice(0, 200) || null

    async function getUser(token: unknown): Promise<{ id: string } | null> {
      const t = String(token ?? '')
      if (!t) return null
      const { data, error } = await admin.auth.getUser(t)
      if (error || !data?.user) return null
      return { id: data.user.id }
    }
    async function getUserFull(token: unknown): Promise<any | null> {
      const t = String(token ?? '')
      if (!t) return null
      const { data, error } = await admin.auth.getUser(t)
      if (error || !data?.user) return null
      return data.user
    }
    async function audit(userId: string | null, eventType: string, provider: string | null, metadata: Record<string, unknown> | null) {
      try {
        await admin.from('auth_audit_logs').insert({ user_id: userId, event_type: eventType, provider, metadata })
      } catch { /* 감사 실패가 본 흐름을 막지 않음 */ }
    }

    // ── prepare — 서버 생성 인증 요청 ID ─────────────────────────
    if (action === 'prepare') {
      if (!identityConfigured(cfg)) {
        return res.status(503).json({
          ok: false, notConfigured: true,
          message: '현재 휴대폰 본인인증 설정을 준비하고 있습니다. 잠시 후 다시 이용해주세요.',
          debugCode: 'identity_not_configured',
        })
      }
      const sessionId = String(body.sessionId ?? '').slice(0, 64) || null
      const ipHash = ipOf()
      if (!hitRate(`prep:${ipHash ?? 'noip'}`, 6)) {
        return res.status(429).json({ ok: false, message: '요청이 많습니다. 잠시 후 다시 시도해주세요.', debugCode: 'rate' })
      }
      // DB 기준 레이트리밋 — 같은 임시 세션으로 10분 내 5회
      if (sessionId) {
        const { data: recent } = await admin
          .from('identity_verifications').select('id')
          .eq('initial_session_id', sessionId)
          .gte('created_at', new Date(Date.now() - 10 * 60_000).toISOString())
          .limit(6)
        if ((recent ?? []).length >= 5) {
          return res.status(429).json({ ok: false, message: '인증 시도가 많습니다. 잠시 후 다시 시도해주세요.', debugCode: 'rate_db' })
        }
      }
      const verificationId = `idv-${randomUUID()}`
      const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MIN * 60_000).toISOString()
      const { error } = await admin.from('identity_verifications').insert({
        verification_id: verificationId, provider: 'portone', environment: cfg.environment,
        status: 'prepared', initial_session_id: sessionId, expires_at: expiresAt,
      })
      if (error) {
        const msg = String(error.message || '')
        if (/identity_verifications.*does not exist/i.test(msg)) {
          return res.status(503).json({ ok: false, message: '본인인증 준비 중입니다(DB 미설정).', debugCode: 'no_table' })
        }
        return res.status(500).json({ ok: false, message: '본인인증을 시작하지 못했습니다.', debugCode: 'insert_failed' })
      }
      return res.status(200).json({
        ok: true, identityVerificationId: verificationId,
        storeId: cfg.storeId, channelKey: cfg.channelKey, environment: cfg.environment, expiresAt,
      })
    }

    // ── verify — PortOne 서버 재조회 (유일한 신뢰 경로) ──────────
    if (action === 'verify') {
      if (!identityConfigured(cfg)) {
        return res.status(503).json({ ok: false, message: '현재 휴대폰 본인인증 설정을 준비하고 있습니다.', debugCode: 'identity_not_configured' })
      }
      const id = String(body.identityVerificationId ?? '')
      if (!/^idv-[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ ok: false, message: '잘못된 인증 요청입니다.', debugCode: 'bad_id' })
      if (!hitRate(`verify:${id}`, 10)) return res.status(429).json({ ok: false, message: '잠시 후 다시 시도해주세요.', debugCode: 'rate' })

      const { data: row } = await admin.from('identity_verifications').select('*').eq('verification_id', id).maybeSingle()
      if (!row) return res.status(404).json({ ok: false, message: '인증 요청을 찾을 수 없습니다. 처음부터 다시 시도해주세요.', debugCode: 'not_found' })
      if (row.used_at) return res.status(409).json({ ok: false, message: '이미 사용된 인증 요청입니다.', debugCode: 'used' })
      if (new Date(row.expires_at).getTime() < Date.now()) {
        await admin.from('identity_verifications').update({ status: 'expired' }).eq('id', row.id)
        return res.status(410).json({ ok: false, message: '인증 시간이 만료되었습니다. 다시 인증해주세요.', debugCode: 'expired' })
      }

      // PortOne 단건조회 — storeId 대조 포함
      let po: any = null
      try {
        const r = await fetch(
          `https://api.portone.io/identity-verifications/${encodeURIComponent(id)}?storeId=${encodeURIComponent(cfg.storeId!)}`,
          { headers: { Authorization: `PortOne ${cfg.apiSecret}` } },
        )
        po = await r.json().catch(() => null)
        if (!r.ok) {
          const code = po?.type ?? `http_${r.status}`
          if (r.status === 404) return res.status(400).json({ ok: false, message: '아직 인증이 완료되지 않았습니다. 인증 창에서 인증을 마친 뒤 다시 확인해주세요.', debugCode: 'po_not_found' })
          await audit(null, 'identity_failed', 'portone', { failure_category: String(code).slice(0, 60) })
          return res.status(502).json({ ok: false, message: '본인인증 확인 중 문제가 발생했습니다. 다시 시도해주세요.', debugCode: 'po_error' })
        }
      } catch {
        return res.status(502).json({ ok: false, message: '본인인증 서버와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'po_network' })
      }

      if (po?.id && po.id !== id) return res.status(409).json({ ok: false, message: '인증 정보가 일치하지 않습니다.', debugCode: 'id_mismatch' })
      if (po?.status === 'FAILED') {
        await admin.from('identity_verifications').update({ status: 'failed', fail_reason: String(po?.failure?.reason ?? 'failed').slice(0, 120) }).eq('id', row.id)
        await audit(null, 'identity_failed', 'portone', { failure_category: 'pg_failed' })
        return res.status(400).json({ ok: false, message: '본인인증을 완료하지 못했습니다. 다시 시도해주세요.', debugCode: 'failed' })
      }
      if (po?.status !== 'VERIFIED') {
        return res.status(400).json({ ok: false, message: '아직 인증이 완료되지 않았습니다.', debugCode: 'not_verified' })
      }

      const vc = po.verifiedCustomer ?? {}
      const name = String(vc.name ?? '').slice(0, 60)
      const phone = normPhone(vc.phoneNumber)
      if (!name || phone.length < 9) {
        return res.status(502).json({ ok: false, message: '인증 결과를 확인하지 못했습니다. 다시 시도해주세요.', debugCode: 'no_customer' })
      }
      // 최소수집: 출생연도·만14세 여부만 계산, CI 는 단방향 해시만 (원문 미저장)
      let birthYear: number | null = null
      let ageOver14: boolean | null = null
      const bd = String(vc.birthDate ?? '') // 'YYYY-MM-DD'
      if (/^\d{4}-\d{2}-\d{2}$/.test(bd)) {
        birthYear = Number(bd.slice(0, 4))
        ageOver14 = Date.now() - new Date(bd).getTime() >= 14 * 365.25 * 24 * 3600 * 1000
      }
      const identityHash = vc.ci ? hmac(String(vc.ci)) : null

      await admin.from('identity_verifications').update({
        status: 'verified', verified_name: name, verified_phone: phone,
        birth_year: birthYear, age_over_14: ageOver14, identity_hash: identityHash,
        verified_at: new Date().toISOString(),
      }).eq('id', row.id)
      await audit(null, 'identity_succeeded', 'portone', { environment: cfg.environment })
      // 본인에게만 본인 정보 반환 (원문 응답 전체는 반환·저장하지 않음)
      return res.status(200).json({ ok: true, name, phone, ageOver14 })
    }

    // ── status — 임시 세션 복구 (미사용·미만료 verified 만) ──────
    if (action === 'status') {
      const id = String(body.identityVerificationId ?? '')
      if (!/^idv-[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ ok: false, message: '잘못된 요청입니다.', debugCode: 'bad_id' })
      const { data: row } = await admin.from('identity_verifications')
        .select('status, verified_name, verified_phone, expires_at, used_at').eq('verification_id', id).maybeSingle()
      if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now() || row.status !== 'verified') {
        return res.status(200).json({ ok: true, status: 'none' })
      }
      return res.status(200).json({ ok: true, status: 'verified', name: row.verified_name, phone: row.verified_phone })
    }

    // ── attach — 인증 결과를 로그인 사용자에 연결 ────────────────
    if (action === 'attach') {
      const user = await getUser(body.accessToken)
      if (!user) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.', debugCode: 'no_token' })
      const id = String(body.identityVerificationId ?? '')
      if (!/^idv-[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ ok: false, message: '잘못된 인증 요청입니다.', debugCode: 'bad_id' })

      const { data: row } = await admin.from('identity_verifications').select('*').eq('verification_id', id).maybeSingle()
      if (row?.used_at) return res.status(409).json({ ok: false, message: '이미 사용된 인증 요청입니다.', debugCode: 'used' })
      if (!row || row.status !== 'verified') return res.status(400).json({ ok: false, message: '본인인증을 먼저 완료해주세요.', debugCode: 'not_verified' })
      if (new Date(row.expires_at).getTime() < Date.now()) return res.status(410).json({ ok: false, message: '인증 시간이 만료되었습니다. 다시 인증해주세요.', debugCode: 'expired' })

      const nowIso = new Date().toISOString()
      const { error: pErr } = await admin.from('profiles').update({
        name: row.verified_name, phone: row.verified_phone,
        phone_verified: true, phone_verified_at: nowIso,
        identity_verified: true, identity_provider: 'portone', identity_verified_at: nowIso,
      }).eq('id', user.id)
      if (pErr) {
        if (String(pErr.code) === '23505' || /duplicate|unique/i.test(String(pErr.message))) {
          return res.status(409).json({ ok: false, message: '이 휴대폰 번호로 가입된 다른 계정이 있습니다. 기존 계정으로 로그인해주세요.', debugCode: 'phone_taken' })
        }
        return res.status(500).json({ ok: false, message: '인증 정보를 저장하지 못했습니다.', debugCode: 'profile_update_failed' })
      }
      await admin.from('identity_verifications').update({ status: 'used', used_at: nowIso, user_id: user.id }).eq('id', row.id)
      await audit(user.id, 'identity_attached', 'portone', null)
      return res.status(200).json({ ok: true })
    }

    // ── consent — 약관 동의 기록 ─────────────────────────────────
    if (action === 'consent') {
      const user = await getUser(body.accessToken)
      if (!user) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.', debugCode: 'no_token' })
      const list = Array.isArray(body.consents) ? body.consents.slice(0, 10) : []
      if (list.length === 0) return res.status(400).json({ ok: false, message: '동의 내역이 없습니다.', debugCode: 'empty' })
      const ipHash = ipOf(); const ua = uaOf()
      const nowIso = new Date().toISOString()
      for (const c of list) {
        const key = String(c?.key ?? '')
        const version = String(c?.version ?? '').slice(0, 40)
        const agreed = c?.agreed === true
        if (!(CONSENT_KEYS as readonly string[]).includes(key) || !version) {
          return res.status(400).json({ ok: false, message: '알 수 없는 동의 항목입니다.', debugCode: 'bad_key' })
        }
        const { error } = await admin.from('user_consents').upsert(
          { user_id: user.id, consent_key: key, version, agreed, agreed_at: nowIso, ip_hash: ipHash, user_agent: ua },
          { onConflict: 'user_id,consent_key,version' },
        )
        if (error) return res.status(500).json({ ok: false, message: '동의 내역을 저장하지 못했습니다.', debugCode: 'consent_failed' })
        if (key === 'terms' && agreed) await admin.from('profiles').update({ terms_agreed_at: nowIso }).eq('id', user.id)
        if (key === 'privacy' && agreed) await admin.from('profiles').update({ privacy_agreed_at: nowIso }).eq('id', user.id)
      }
      await audit(user.id, 'terms_agreed', null, null)
      return res.status(200).json({ ok: true })
    }

    // ── complete — 온보딩(가입) 완료 판정 ────────────────────────
    if (action === 'complete') {
      const fullUser = await getUserFull(body.accessToken)
      if (!fullUser) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.', debugCode: 'no_token' })
      const userId: string = fullUser.id
      const isSocial = detectSocial(fullUser)
      const resolvedEmail = resolveEmail(fullUser)
      const role = String(body.role ?? '')
      if (!(ROLES as readonly string[]).includes(role)) return res.status(400).json({ ok: false, message: '회원유형을 선택해주세요.', debugCode: 'bad_role' })

      // 1) 필수 동의 확인
      const { data: consents } = await admin.from('user_consents').select('consent_key, agreed').eq('user_id', userId).eq('agreed', true)
      const agreedKeys = new Set(((consents ?? []) as { consent_key: string }[]).map((c) => c.consent_key))
      const missing = REQUIRED_CONSENTS.filter((k) => !agreedKeys.has(k))
      if (missing.length > 0) {
        return res.status(400).json({ ok: false, message: '필수 약관 동의가 완료되지 않았습니다.', debugCode: 'consent_missing' })
      }

      // 2) 본인인증 확인 — 소셜 로그인 사용자는 provider 검증을 신뢰해 휴대폰 본인인증 면제.
      //    이메일/비밀번호 가입만 fail-closed(필수인데 미설정이면 완료 차단).
      const { data: prof } = await admin.from('profiles').select('identity_verified, member_type, onboarding_status, email').eq('id', userId).maybeSingle()
      if (cfg.required && !isSocial) {
        if (!identityConfigured(cfg)) {
          return res.status(503).json({
            ok: false, notConfigured: true,
            message: '현재 휴대폰 본인인증 설정을 준비하고 있습니다. 잠시 후 다시 이용해주세요.',
            debugCode: 'identity_not_configured',
          })
        }
        if (prof?.identity_verified !== true) {
          return res.status(400).json({ ok: false, message: '휴대폰 본인인증을 먼저 완료해주세요.', debugCode: 'identity_required' })
        }
      }

      // 2-1) provider 이메일을 서비스 프로필 이메일로 저장 (profiles.email 이 비어있을 때만; auth.users.email 강제 변경 안 함)
      if (resolvedEmail) {
        const curEmail = (prof as { email?: string } | null)?.email
        if (!curEmail || !EMAIL_RE.test(curEmail)) {
          try { await admin.from('profiles').update({ email: resolvedEmail }).eq('id', userId) } catch { /* unique 충돌 등은 무시 */ }
        }
      }

      // 3) 역할 + 프로필 확정 (멱등 — unique(user_id, role) / upsert)
      const { error: rErr } = await admin.from('user_roles').upsert(
        { user_id: userId, role }, { onConflict: 'user_id,role', ignoreDuplicates: true },
      )
      if (rErr && !/duplicate/i.test(String(rErr.message))) {
        return res.status(500).json({ ok: false, message: '역할을 저장하지 못했습니다.', debugCode: 'role_failed' })
      }
      const nowIso = new Date().toISOString()
      const patch: Record<string, unknown> = {
        role_selected_at: nowIso, onboarding_status: 'completed', signup_completed_at: nowIso,
      }
      if (!prof?.member_type) patch.member_type = role === 'ceo' ? 'business' : 'consultant'
      await admin.from('profiles').update(patch).eq('id', userId)
      await audit(userId, 'signup_completed', isSocial ? 'social' : null, { role })

      const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', userId)
      return res.status(200).json({ ok: true, roles: ((roles ?? []) as { role: string }[]).map((r) => r.role) })
    }

    // ── add_role — 두 번째 역할 추가 ─────────────────────────────
    if (action === 'add_role') {
      const user = await getUser(body.accessToken)
      if (!user) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.', debugCode: 'no_token' })
      const role = String(body.role ?? '')
      if (!(ROLES as readonly string[]).includes(role)) return res.status(400).json({ ok: false, message: '추가할 역할을 확인해주세요.', debugCode: 'bad_role' })
      await admin.from('user_roles').upsert({ user_id: user.id, role }, { onConflict: 'user_id,role', ignoreDuplicates: true })
      await audit(user.id, 'role_added', null, { role })
      const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id)
      return res.status(200).json({ ok: true, roles: ((roles ?? []) as { role: string }[]).map((r) => r.role) })
    }

    // ── track — 인증 퍼널 이벤트 (민감정보 금지) ─────────────────
    if (action === 'track') {
      const event = String(body.event ?? '')
      if (!(TRACK_EVENTS as readonly string[]).includes(event)) return res.status(200).json({ ok: true, skipped: true })
      if (!hitRate(`track:${ipOf() ?? 'noip'}`, 30)) return res.status(200).json({ ok: true, skipped: true })
      const user = body.accessToken ? await getUser(body.accessToken) : null
      const provider = ['google', 'kakao', 'email', 'portone'].includes(String(body.provider)) ? String(body.provider) : null
      const meta: Record<string, unknown> = {}
      if ((ROLES as readonly string[]).includes(String(body.role))) meta.role = String(body.role)
      if (body.failureCategory) meta.failure_category = String(body.failureCategory).slice(0, 60)
      if (Number.isFinite(Number(body.elapsedSeconds))) meta.elapsed_seconds = Math.min(3600, Math.max(0, Math.round(Number(body.elapsedSeconds))))
      await audit(user?.id ?? null, event, provider, Object.keys(meta).length ? meta : null)
      return res.status(200).json({ ok: true })
    }

    // ── migrate_diagnosis — 비회원 진단기록 계정 연결 (멱등) ─────
    if (action === 'migrate_diagnosis') {
      const user = await getUser(body.accessToken)
      if (!user) return res.status(401).json({ ok: false, message: '로그인이 필요합니다.', debugCode: 'no_token' })
      const tokens = (Array.isArray(body.sessionTokens) ? body.sessionTokens : [])
        .map((t: unknown) => String(t ?? '').slice(0, 80)).filter(Boolean).slice(0, 20)
      if (tokens.length === 0) return res.status(200).json({ ok: true, claimed: 0 })
      try {
        const { data } = await admin.from('business_diagnosis_sessions')
          .update({ claimed_by_user_id: user.id })
          .in('session_token', tokens)
          .is('claimed_by_user_id', null)
          .select('id')
        return res.status(200).json({ ok: true, claimed: (data ?? []).length })
      } catch {
        return res.status(200).json({ ok: true, claimed: 0, skipped: true })
      }
    }

    return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.', debugCode: 'bad_action' })
  } catch (e: any) {
    // 내부 오류 상세(스택·키·원문)는 노출하지 않음
    return res.status(500).json({ ok: false, message: '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.' })
  }
}
