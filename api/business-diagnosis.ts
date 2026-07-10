// /api/business-diagnosis — 기업 성장진단 익명 저장 API (action: session | submit | event).
// 자체 포함(외부 helper import 0개) + 동적 supabase import. service_role 전용.
// ⚠️ SUPABASE_SERVICE_ROLE_KEY 는 서버에서만 사용 (VITE_ 환경변수 금지, 프론트 노출 금지).
// 원칙:
//  - 클라이언트가 보낸 리드 점수·등급을 신뢰하지 않음 → 서버가 답변 기준으로 재계산
//  - 전화번호 정규화·필수값 검증·enum 차단·길이 제한·HTML 제거·honeypot·과속 제출 차단
//  - 같은 session_token 재제출 시 기존 리드 갱신(중복 리드 생성 방지, idempotent)
//  - 개인정보(전화·이메일)는 로그에 출력하지 않음

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

// ── 검증 헬퍼 ──────────────────────────────────────────
const strip = (v: unknown, max = 200): string =>
  String(v ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max)

const normPhone = (v: unknown): string => String(v ?? '').replace(/\D/g, '').slice(0, 11)

const isValidPhone = (p: string) => /^01[016789]\d{7,8}$/.test(p)
const isValidEmail = (e: string) => e === '' || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 120)

const BIZ_TYPES = ['individual', 'corp', 'pre']
const CONTACT_METHODS = ['전화', '카카오톡', '문자', '대면상담', '아직 상담은 원하지 않음']
const EVENT_TYPES = [
  'diagnosis_started', 'stage_completed', 'question_answered', 'benefit_revealed', 'benefit_interest_clicked',
  'product_clicked', 'lead_form_viewed', 'lead_submitted', 'result_unlocked', 'consultation_clicked', 'diagnosis_restarted',
]
const SESSION_STATUS = ['in_progress', 'completed', 'submitted']

function jsonCap(v: unknown, maxLen: number): unknown {
  if (v === null || v === undefined) return null
  try {
    const s = JSON.stringify(v)
    if (s.length > maxLen) return null
    return v
  } catch {
    return null
  }
}

const one = (a: Record<string, unknown>, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)
const many = (a: Record<string, unknown>, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : [])

// ── 리드 점수 (서버 기준) — 상담 우선순위 점수 0~100 (승인 가능성 아님) ──
export function scoreLead(answers: Record<string, unknown>, interests: string[], form: {
  consultationConsent: boolean
  preferredContactTime?: string
  email?: string
  phoneOk: boolean
}) {
  const cap = (n: number, m: number) => Math.min(n, m)
  const fundingWhen = one(answers, 'fundingWhen')
  const consultTiming = one(answers, 'consultTiming')
  const plans = many(answers, 'futurePlans')
  const website = one(answers, 'website')
  const workflow = one(answers, 'workflow')
  const hiring = one(answers, 'hiring')
  const concerns = many(answers, 'concerns')
  const bizType = one(answers, 'bizType')
  const years = one(answers, 'years')
  const hasIso = many(answers, 'iso').some((v) => ['iso9001', 'iso14001', 'iso45001', 'isoEtc'].includes(v))
  const wantsBig = plans.some((p) => ['bigCorp', 'bidding', 'export'].includes(p))
  const arrears = one(answers, 'taxArrears') === 'yes' || one(answers, 'taxArrears') === 'paying'

  // A. 실행 긴급도 (25)
  let a = 0
  a += fundingWhen === 'm1' ? 15 : fundingWhen === 'm3' ? 12 : fundingWhen === 'm6' ? 8 : fundingWhen === 'planning' ? 4 : 0
  a += consultTiming === 'now' ? 10 : consultTiming === 'm1' ? 7 : consultTiming === 'm3' ? 4 : 0
  a = cap(a, 25)

  // B. 서비스 적합도 (25)
  let b = 0
  if (bizType === 'corp') b += 5
  if (years && years !== 'pre' && years !== 'lt1') b += 4
  if (one(answers, 'employees') && one(answers, 'employees') !== 'none') b += 4
  if (['none', 'snsOnly', 'old'].includes(website ?? '')) b += 4
  if (['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '')) b += 4
  if (bizType === 'corp' && ['lt1', 'y1to3'].includes(years ?? '') && ['none', 'expired', 'unsure'].includes(one(answers, 'venture') ?? '')) b += 4
  if (wantsBig && !hasIso) b += 4
  b = cap(b, 25)

  // C. 문제의 명확성 (20)
  let c = 0
  const purposes = many(answers, 'fundingPurpose').filter((x) => x !== 'unknown')
  if (purposes.length > 0) c += 7
  if (hiring && hiring !== 'na') c += 5
  if (plans.some((p) => ['bigCorp', 'bidding', 'export', 'invest', 'newProduct'].includes(p))) c += 5
  if (concerns.includes('online') || concerns.includes('manualWork')) c += 3
  c = cap(c, 20)

  // D. 행동의향 (15)
  let d = 0
  d += cap(interests.length * 4, 8)
  if (form.consultationConsent) d += 5
  d = cap(d, 15)

  // E. 정보 완성도 (10)
  let e = 0
  for (const q of ['revenue', 'years', 'employees', 'consultTiming']) if (answers[q] !== undefined) e += 2
  if (form.phoneOk) e += 2
  e = cap(e, 10)

  // F. 가점 (5)
  let f = 0
  if (form.preferredContactTime) f += 3
  if (form.email) f += 2
  f = cap(f, 5)

  // 감점 — 정보만 확인 (체납은 과도하게 감점하지 않음: 선결과제 상담 유형으로 분류)
  let penalty = 0
  if (consultTiming === 'infoOnly' && !form.consultationConsent) penalty += 5

  const total = Math.max(0, Math.min(100, a + b + c + d + e + f - penalty))
  const grade = total >= 75 ? 'A' : total >= 50 ? 'B' : 'C'

  const flags: string[] = []
  if (total >= 85 || (fundingWhen === 'm1' && consultTiming === 'now')) flags.push('hot')
  if (fundingWhen === 'm1' || fundingWhen === 'm3') flags.push('funding_urgent')
  if (interests.some((k) => ['venture', 'researchLab', 'iso'].includes(k)) || concerns.includes('certification')) flags.push('certification_interest')
  if (hiring && hiring !== 'na') flags.push('employment_interest')
  if (['none', 'snsOnly', 'old'].includes(website ?? '') || ['excel', 'kakao', 'paper', 'scattered'].includes(workflow ?? '') || interests.includes('website') || interests.includes('workflow')) flags.push('digital_interest')
  if (arrears) flags.push('prerequisite_issue')
  if (form.consultationConsent) flags.push('consultation_opt_in')
  if (consultTiming === 'infoOnly' && !form.consultationConsent) flags.push('information_only')

  return { total, grade, flags, breakdown: { urgency: a, fit: b, clarity: c, intent: d, completeness: e, bonus: f, penalty } }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') return res.status(200).json({ ok: true, message: 'business-diagnosis api alive' })
    if (req.method !== 'POST') {
      res.setHeader?.('Allow', 'POST')
      return res.status(405).json({ ok: false, message: 'POST만 허용됩니다.', debugCode: 'method_not_allowed' })
    }

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return res.status(500).json({ ok: false, message: '서버 저장 설정이 완료되지 않았습니다.', debugCode: 'no_env' })
    }

    let body: any = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }

    const action = strip(body.action, 20)
    const sessionToken = strip(body.sessionToken, 64)
    if (!sessionToken || sessionToken.length < 10 || !/^diag_[a-z0-9_]+$/.test(sessionToken)) {
      return res.status(400).json({ ok: false, message: '세션 정보가 올바르지 않습니다.', debugCode: 'bad_session_token' })
    }

    let createClient: (u: string, k: string, o?: unknown) => any
    try {
      ;({ createClient } = await import('@supabase/supabase-js'))
    } catch (e) {
      return res.status(500).json({ ok: false, message: '저장 모듈 로드에 실패했습니다.', debugCode: 'supabase_import', detail: detailOf(e) })
    }
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // 세션 upsert 공통 페이로드
    const utm = body.utm && typeof body.utm === 'object' ? body.utm : {}
    const sessionRow = {
      session_token: sessionToken,
      diagnosis_version: Number(body.diagnosisVersion) || 0,
      answers: jsonCap(body.answers, 20000) ?? {},
      clicked_benefits: jsonCap(body.interests, 2000) ?? [],
      advantage_factors: jsonCap(body.advantageFactors ?? body.foundAdvantages, 8000),
      current_question_id: body.currentQuestionId ? strip(body.currentQuestionId, 40) : null,
      scores: jsonCap(body.scores, 4000),
      result_summary: jsonCap(body.resultSummary, 8000),
      recommended_products: jsonCap(body.recommendedProducts, 4000),
      completed_at: body.completedAt ? strip(body.completedAt, 40) : null,
      updated_at: new Date().toISOString(),
    }

    async function upsertSession(status?: string, currentStage?: number) {
      const { data: existing } = await admin.from('business_diagnosis_sessions').select('id, lead_id, status, utm_source').eq('session_token', sessionToken).maybeSingle()
      if (existing) {
        const patch: Record<string, unknown> = { ...sessionRow }
        if (status && SESSION_STATUS.includes(status) && existing.status !== 'submitted') patch.status = status
        if (currentStage) patch.current_stage = Math.min(3, Math.max(1, Number(currentStage) || 1))
        await admin.from('business_diagnosis_sessions').update(patch).eq('id', existing.id)
        return existing
      }
      const { data: created, error } = await admin
        .from('business_diagnosis_sessions')
        .insert({
          ...sessionRow,
          status: status && SESSION_STATUS.includes(status) ? status : 'in_progress',
          current_stage: currentStage ? Math.min(3, Math.max(1, Number(currentStage) || 1)) : 1,
          started_at: body.startedAt ? strip(body.startedAt, 40) : new Date().toISOString(),
          // 유입경로 — 최초 저장 시에만 기록 (첫 유입값 유지)
          utm_source: strip(utm.utmSource, 120) || null,
          utm_medium: strip(utm.utmMedium, 120) || null,
          utm_campaign: strip(utm.utmCampaign, 160) || null,
          utm_content: strip(utm.utmContent, 160) || null,
          utm_term: strip(utm.utmTerm, 160) || null,
          referrer: strip(utm.referrer, 300) || null,
          landing_path: strip(utm.landingPath, 300) || null,
        })
        .select('id, lead_id, status')
        .single()
      if (error) throw error
      return created
    }

    // ── action: session ──
    if (action === 'session') {
      const s = await upsertSession(strip(body.status, 20) || undefined, body.currentStage)
      return res.status(200).json({ ok: true, sessionId: s.id })
    }

    // ── action: event ──
    if (action === 'event') {
      const eventType = strip(body.eventType, 40)
      if (!EVENT_TYPES.includes(eventType)) {
        return res.status(400).json({ ok: false, message: '허용되지 않은 이벤트입니다.', debugCode: 'bad_event_type' })
      }
      const s = await upsertSession()
      await admin.from('business_diagnosis_events').insert({
        session_id: s.id,
        event_type: eventType,
        event_key: body.eventKey ? strip(body.eventKey, 80) : null,
        payload: jsonCap(body.payload, 2000),
      })
      return res.status(200).json({ ok: true })
    }

    // ── action: submit ──
    if (action === 'submit') {
      const form = body.form && typeof body.form === 'object' ? body.form : {}

      // honeypot — 봇이 채우는 숨은 필드
      if (strip(form.honeypot, 10)) {
        return res.status(400).json({ ok: false, message: '요청을 처리할 수 없습니다.', debugCode: 'rejected' })
      }
      // 지나치게 빠른 제출 방지
      const elapsed = Number(form.formElapsedMs) || 0
      if (elapsed > 0 && elapsed < 2500) {
        return res.status(400).json({ ok: false, message: '입력 내용을 확인한 뒤 다시 제출해주세요.', debugCode: 'too_fast' })
      }

      const companyName = strip(form.companyName, 80)
      const repName = strip(form.representativeName, 40)
      const phone = normPhone(form.phone)
      const email = strip(form.email, 120)
      const businessType = strip(form.businessType ?? one(body.answers ?? {}, 'bizType'), 20)
      const industry = strip(form.industry ?? one(body.answers ?? {}, 'industry'), 40)
      const contactMethod = strip(form.contactMethod, 30)
      const preferredContactTime = strip(form.preferredContactTime, 80)
      const privacyConsent = form.privacyConsent === true
      const consultationConsent = form.consultationConsent === true
      const marketingConsent = form.marketingConsent === true
      const consentVersion = strip(form.privacyConsentVersion, 20) || 'unknown'

      if (!companyName || !repName || !privacyConsent) {
        return res.status(400).json({ ok: false, message: '필수 항목(회사명, 대표자명, 개인정보 동의)을 확인해주세요.', debugCode: 'missing_required' })
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ ok: false, message: '올바른 휴대전화번호를 입력해주세요.', debugCode: 'bad_phone' })
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ ok: false, message: '이메일 형식을 확인해주세요.', debugCode: 'bad_email' })
      }
      if (businessType && !BIZ_TYPES.includes(businessType)) {
        return res.status(400).json({ ok: false, message: '사업자 유형 값이 올바르지 않습니다.', debugCode: 'bad_enum' })
      }
      if (contactMethod && !CONTACT_METHODS.includes(contactMethod)) {
        return res.status(400).json({ ok: false, message: '상담 방식 값이 올바르지 않습니다.', debugCode: 'bad_enum' })
      }

      const answers = body.answers && typeof body.answers === 'object' ? body.answers : {}
      const interests = Array.isArray(body.interests) ? body.interests.map((x: unknown) => strip(x, 30)).slice(0, 20) : []

      // 서버 기준 리드 점수 (클라이언트 값 불신)
      const scored = scoreLead(answers, interests, {
        consultationConsent,
        preferredContactTime: preferredContactTime || undefined,
        email: email || undefined,
        phoneOk: true,
      })

      const s = await upsertSession('submitted')

      const leadFields = {
        company_name: companyName,
        representative_name: repName,
        phone,
        email: email || null,
        business_type: businessType || null,
        industry: industry || null,
        contact_method: contactMethod || null,
        preferred_contact_time: preferredContactTime || null,
        privacy_consent: privacyConsent,
        privacy_consent_version: consentVersion,
        consultation_consent: consultationConsent,
        marketing_consent: marketingConsent,
        consent_at: new Date().toISOString(),
        lead_score: scored.total,
        lead_grade: scored.grade,
        score_breakdown: scored.breakdown,
        flags: scored.flags,
        source_channel: strip((utm as any).utmSource, 120) || null,
        updated_at: new Date().toISOString(),
      }

      // idempotent — 같은 세션 재제출 시 기존 리드 갱신 (중복 리드 방지)
      let leadId: string
      if (s.lead_id) {
        await admin.from('business_diagnosis_leads').update(leadFields).eq('id', s.lead_id)
        leadId = s.lead_id
      } else {
        const { data: lead, error: leadErr } = await admin
          .from('business_diagnosis_leads')
          .insert({ ...leadFields, lead_status: 'new' })
          .select('id')
          .single()
        if (leadErr) throw leadErr
        leadId = lead.id
        await admin
          .from('business_diagnosis_sessions')
          .update({ lead_id: leadId, status: 'submitted', submitted_at: new Date().toISOString(), ...sessionRow })
          .eq('id', s.id)
      }

      await admin.from('business_diagnosis_events').insert({
        session_id: s.id,
        event_type: 'lead_submitted',
        event_key: leadId,
        payload: { grade: scored.grade, score: scored.total },
      })

      return res.status(200).json({ ok: true, leadId })
    }

    return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.', debugCode: 'bad_action' })
  } catch (error) {
    console.error('[business-diagnosis] error:', detailOf(error)) // 개인정보 미포함
    return res.status(500).json({ ok: false, message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'unhandled', detail: detailOf(error) })
  }
}
