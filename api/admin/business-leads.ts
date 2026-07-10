// /api/admin/business-leads — 기업 성장진단 리드 관리 (관리자 전용).
// GET  ?action=list          — 리드 + 세션 요약 목록 (+상단 요약 수치)
// GET  ?action=detail&id=…   — 리드 상세 (세션 답변·이벤트 포함)
// POST {action:'update',…}   — 상태/담당자/메모 변경
// 자체 포함 + 동적 supabase import. service_role 은 서버에서만 사용.
// 관리자 판정: Bearer 토큰 → auth.getUser → profiles.role === 'admin' (기존 체계 재사용)

const LEAD_STATUS = ['new', 'reviewing', 'contacted', 'meeting_scheduled', 'proposal_sent', 'contracted', 'nurture', 'not_qualified', 'closed']

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

const strip = (v: unknown, max = 200): string =>
  String(v ?? '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, max)

export default async function handler(req: any, res: any) {
  try {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return res.status(500).json({ ok: false, message: '서버 환경변수가 설정되지 않았습니다.', debugCode: 'no_env' })
    }

    // ── 관리자 인증 (기존 admin/access 패턴 재사용) ──
    const authHeader: unknown = req.headers?.authorization ?? req.headers?.Authorization
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ ok: false, message: '인증 토큰이 없습니다. 다시 로그인해 주세요.', debugCode: 'no_auth' })

    let createClient: (u: string, k: string, o?: unknown) => any
    try {
      ;({ createClient } = await import('@supabase/supabase-js'))
    } catch (e) {
      return res.status(500).json({ ok: false, message: 'Supabase 모듈 로드에 실패했습니다.', debugCode: 'supabase_import', detail: detailOf(e) })
    }
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    const { data: userData, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userData?.user) {
      return res.status(401).json({ ok: false, message: '세션이 유효하지 않습니다. 다시 로그인해 주세요.', debugCode: 'bad_token', detail: detailOf(userErr) })
    }
    const { data: me } = await admin.from('profiles').select('role').eq('id', userData.user.id).maybeSingle()
    if ((me as { role?: string } | null)?.role !== 'admin') {
      return res.status(403).json({ ok: false, message: '관리자 권한이 필요합니다.', debugCode: 'not_admin' })
    }

    // ── GET: list / detail ──
    if (req.method === 'GET') {
      const q = req.query ?? {}
      const action = strip(q.action, 20) || 'list'

      if (action === 'detail') {
        const id = strip(q.id, 60)
        if (!id) return res.status(400).json({ ok: false, message: 'id가 필요합니다.', debugCode: 'bad_id' })
        const { data: lead, error } = await admin.from('business_diagnosis_leads').select('*').eq('id', id).maybeSingle()
        if (error || !lead) return res.status(404).json({ ok: false, message: '리드를 찾을 수 없습니다.', debugCode: 'not_found' })
        const { data: session } = await admin.from('business_diagnosis_sessions').select('*').eq('lead_id', id).maybeSingle()
        let events: unknown[] = []
        if (session) {
          const { data: ev } = await admin
            .from('business_diagnosis_events')
            .select('event_type, event_key, payload, created_at')
            .eq('session_id', (session as { id: string }).id)
            .order('created_at', { ascending: true })
            .limit(200)
          events = ev ?? []
        }
        return res.status(200).json({ ok: true, lead, session, events })
      }

      // list — 최근 500건 + 세션 요약 (필터·검색은 관리자 화면에서 처리 → CSV 도 필터 결과 그대로)
      const { data: leads, error: leadsErr } = await admin
        .from('business_diagnosis_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      if (leadsErr) throw leadsErr

      const ids = (leads ?? []).map((l: { id: string }) => l.id)
      let sessions: unknown[] = []
      if (ids.length > 0) {
        const { data: ss } = await admin
          .from('business_diagnosis_sessions')
          .select('id, lead_id, answers, scores, result_summary, advantage_factors, recommended_products, clicked_benefits, skipped_benefits, completed_stage, diagnosis_depth, stopped_after_stage, next_stage_interest, stage1_duration_seconds, stage2_duration_seconds, stage3_duration_seconds, total_duration_seconds, utm_source, utm_medium, utm_campaign, referrer, landing_path, started_at, completed_at, submitted_at')
          .in('lead_id', ids)
        sessions = ss ?? []
      }

      // 상단 요약 수치
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const list = (leads ?? []) as Array<{ created_at: string; lead_grade: string; consultation_consent: boolean; flags?: string[] }>
      const stats = {
        total: list.length,
        today: list.filter((l) => new Date(l.created_at) >= today).length,
        gradeA: list.filter((l) => l.lead_grade === 'A').length,
        consented: list.filter((l) => l.consultation_consent).length,
        fundingUrgent: list.filter((l) => Array.isArray(l.flags) && l.flags.includes('funding_urgent')).length,
      }

      return res.status(200).json({ ok: true, leads: leads ?? [], sessions, stats })
    }

    // ── POST: update ──
    if (req.method === 'POST') {
      let body: any = {}
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
      } catch (e) {
        return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
      }
      if (strip(body.action, 20) !== 'update') {
        return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.', debugCode: 'bad_action' })
      }
      const id = strip(body.id, 60)
      if (!id) return res.status(400).json({ ok: false, message: 'id가 필요합니다.', debugCode: 'bad_id' })

      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (body.leadStatus !== undefined) {
        const st = strip(body.leadStatus, 30)
        if (!LEAD_STATUS.includes(st)) return res.status(400).json({ ok: false, message: '허용되지 않은 상태값입니다.', debugCode: 'bad_enum' })
        patch.lead_status = st
      }
      if (body.memo !== undefined) patch.memo = strip(body.memo, 4000)
      if (body.assignedLabel !== undefined) {
        patch.assigned_label = strip(body.assignedLabel, 60) || null
        patch.assignment_status = patch.assigned_label ? 'assigned' : 'unassigned'
        patch.assigned_at = patch.assigned_label ? new Date().toISOString() : null
      }
      if (body.contactedAt !== undefined) patch.contacted_at = body.contactedAt ? new Date().toISOString() : null
      if (body.meetingMemo !== undefined) patch.meeting_memo = strip(body.meetingMemo, 1000)

      const { error } = await admin.from('business_diagnosis_leads').update(patch).eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    res.setHeader?.('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, message: '허용되지 않은 메서드입니다.', debugCode: 'method_not_allowed' })
  } catch (error) {
    console.error('[admin/business-leads] error:', detailOf(error)) // 개인정보 미포함
    return res.status(500).json({ ok: false, message: '요청 처리 중 오류가 발생했습니다.', debugCode: 'unhandled', detail: detailOf(error) })
  }
}
