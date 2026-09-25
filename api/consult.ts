// /api/consult — 사이트 내 "상담 신청 / 문의" 폼 → Resend 이메일 발송.
// 상세페이지·장바구니·정책자금·진단결과 등 어디서 눌러도 담긴 상품/선택/체크 항목을
// context 로 함께 실어 관리자 지메일로 보냅니다. 자체 포함(외부 helper import 0개).
//   - GET: health 체크
//   - POST: Resend 는 핸들러 안에서 동적 import 만 사용 (top-level import 0개)
//
// 필요 환경변수 (Vercel → Settings → Environment Variables, 등록 후 반드시 Redeploy):
//   RESEND_API_KEY      — (필수) Resend API 키. 절대 코드에 하드코딩 금지.
//   INQUIRY_TO_EMAIL    — (선택) 받는 주소. 기본값 sanghohoho0813@gmail.com
//   INQUIRY_FROM_EMAIL  — (선택) 보내는 주소. 기본값 AI Business Lab <onboarding@resend.dev>
//
// 이 파일은 Vercel 이 번들링하며, 앱의 `tsc -b`(src/ 전용)에는 포함되지 않습니다.

const SITE_NAME = '미래 AI 랩'
const DEFAULT_TO = 'sanghohoho0813@gmail.com'
const DEFAULT_FROM = 'AI Business Lab <onboarding@resend.dev>'

type ContextRow = { label?: unknown; value?: unknown }
type ConsultBody = {
  name?: string
  contact?: string
  company?: string
  message?: string
  source?: string
  page?: string
  context?: ContextRow[]
  /** 구조화 응답(진행방식·자금계획·AX 문항·동의) — Supabase consult_leads 저장용 */
  structured?: Record<string, unknown>
}

/** 신청 데이터를 Supabase consult_leads 에 저장 (비치명적 — 실패해도 이메일 발송은 계속) */
async function saveConsultLead(row: {
  name: string
  contact: string
  company: string
  source: string
  page: string
  message: string
  program: string | null
  structured: Record<string, unknown> | null
  context: Array<[string, string]>
}): Promise<string | null> {
  try {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) return null
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase
      .from('consult_leads')
      .insert({
        name: row.name,
        contact: row.contact,
        company: row.company || null,
        source: row.source || null,
        page: row.page || null,
        message: row.message || null,
        program: row.program,
        structured: row.structured,
        context: row.context.map(([label, value]) => ({ label, value })),
      })
      .select('id')
      .single()
    if (error) {
      console.error('[consult] supabase insert error:', detailOf(error))
      return null
    }
    return (data as { id?: string } | null)?.id ?? null
  } catch (e) {
    console.error('[consult] supabase save skipped:', detailOf(e))
    return null
  }
}

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── 관심 분야 목차 ────────────────────────────────────────
// 화면(src/lib/consultApi.ts CONSULT_INTEREST_GROUPS)과 같은 순서·묶음으로 메일에도 박스로 보여준다.
// ⚠️ 이 파일은 외부 helper 를 import 하지 않는 규칙이라 목록을 여기에 한 벌 더 둔다. 화면 쪽을 고치면 여기도 같이 고칠 것.
const INTEREST_LABEL = '관심 분야'
const INTEREST_GROUPS: Array<{ no: number; title: string; hint?: string; color: string; items: string[] }> = [
  { no: 1, title: '연 2%대 · 최대 10억 — 성장자금이 필요하다면', color: '#2563eb', items: ['정책자금'] },
  { no: 2, title: '정부지원사업 · 정부지원금을 놓치고 있다면', color: '#0284c7', items: ['정부지원사업', 'R&D 과제', '고용지원금'] },
  { no: 3, title: '외부에서 볼 때 좋은 회사로 보이고 싶다면', color: '#059669', items: ['벤처기업 인증', '기업부설연구소', '이노비즈 인증', '메인비즈 인증', 'ISO 인증'] },
  { no: 4, title: '사람을 뽑고, 오래 다니게 하고 싶다면', color: '#d97706', items: ['사내(공동)근로복지기금'] },
  { no: 5, title: '일하는 방식을 바꾸고 싶다면', color: '#ea580c', items: ['AX 풀 패키지', '소형 업무자동화', '사업화 아이디어 MVP', '반응형 홈페이지'] },
  { no: 6, title: '세금을 줄이고 회사 자산을 정리하고 싶다면', hint: '세무사 등 각 분야 전문가와 함께 검토', color: '#7c3aed', items: ['가지급금 정리', '이익잉여금 처분', '가업승계 증여특례', '배우자 증여 이익소각'] },
]

/** '관심 분야' 값(쉼표로 이어진 이름들)을 목차별 박스로 */
function renderInterestBoxes(value: string): string {
  const picked = value.split(',').map((x) => x.trim()).filter(Boolean)
  if (!picked.length) return ''
  const known = new Set<string>()
  const boxes = INTEREST_GROUPS.map((g) => {
    const hit = g.items.filter((i) => picked.includes(i))
    hit.forEach((i) => known.add(i))
    if (!hit.length) return ''
    return `
      <div style="border:1px solid #e2e8f0;border-left:4px solid ${g.color};border-radius:8px;padding:10px 12px;margin:0 0 8px">
        <p style="margin:0;font-size:11px;font-weight:800;color:${g.color};line-height:1.5">${g.no}. ${escapeHtml(g.title)}${g.hint ? ` <span style="font-weight:500;color:#94a3b8">(${escapeHtml(g.hint)})</span>` : ''}</p>
        <p style="margin:5px 0 0;font-size:14px;font-weight:700;color:#0f172a;line-height:1.6">${hit.map((i) => escapeHtml(i)).join(' · ')}</p>
      </div>`
  }).join('')
  const rest = picked.filter((x) => !known.has(x))
  const restBox = rest.length
    ? `<div style="border:1px solid #e2e8f0;border-left:4px solid #94a3b8;border-radius:8px;padding:10px 12px;margin:0 0 8px">
        <p style="margin:0;font-size:11px;font-weight:800;color:#64748b">기타</p>
        <p style="margin:5px 0 0;font-size:14px;font-weight:700;color:#0f172a;line-height:1.6">${rest.map((i) => escapeHtml(i)).join(' · ')}</p>
      </div>`
    : ''
  return `<div style="padding:14px 16px;border-top:8px solid #f1f5f9">
      <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#2563eb">🔖 ${INTEREST_LABEL} (${picked.length}개)</p>
      ${boxes}${restBox}
    </div>`
}

/** 같은 내용을 텍스트 메일용으로 */
function interestLines(value: string): string {
  const picked = value.split(',').map((x) => x.trim()).filter(Boolean)
  if (!picked.length) return ''
  const known = new Set<string>()
  const lines = INTEREST_GROUPS.map((g) => {
    const hit = g.items.filter((i) => picked.includes(i))
    hit.forEach((i) => known.add(i))
    return hit.length ? `${g.no}. ${g.title}${g.hint ? ` (${g.hint})` : ''}\n   - ${hit.join(' · ')}` : ''
  }).filter(Boolean)
  const rest = picked.filter((x) => !known.has(x))
  if (rest.length) lines.push(`기타\n   - ${rest.join(' · ')}`)
  return `■ ${INTEREST_LABEL}\n` + lines.join('\n')
}

// context 배열을 [label, value] 로 정규화 (문자열만, 길이 제한).
function normalizeContext(raw: unknown): Array<[string, string]> {
  if (!Array.isArray(raw)) return []
  const out: Array<[string, string]> = []
  for (const row of raw.slice(0, 40)) {
    if (!row || typeof row !== 'object') continue
    const label = String((row as ContextRow).label ?? '').trim().slice(0, 80)
    const value = String((row as ContextRow).value ?? '').trim().slice(0, 400)
    if (label && value) out.push([label, value])
  }
  return out
}

// req/res 는 Vercel Node 런타임 객체. 외부 타입 import 를 피하기 위해 any 사용.
export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'consult api alive' })
    }
    if (req.method !== 'POST') {
      res.setHeader?.('Allow', 'POST')
      return res.status(405).json({ ok: false, message: 'POST만 허용됩니다.', debugCode: 'method_not_allowed' })
    }

    // 1) body 파싱
    let body: ConsultBody = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res
        .status(400)
        .json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }

    const name = (body.name ?? '').trim().slice(0, 80)
    const contact = (body.contact ?? '').trim().slice(0, 120)
    const company = (body.company ?? '').trim().slice(0, 120)
    const message = (body.message ?? '').trim().slice(0, 2000)
    const source = (body.source ?? '').trim().slice(0, 120)
    const context = normalizeContext(body.context)
    // 구조화 응답 (크기 제한 — 남용 방지)
    let structured: Record<string, unknown> | null = null
    if (body.structured && typeof body.structured === 'object' && !Array.isArray(body.structured)) {
      try {
        const raw = JSON.stringify(body.structured)
        if (raw.length <= 20000) structured = JSON.parse(raw)
      } catch {
        structured = null
      }
    }
    const program = structured && typeof structured.program === 'string' ? String(structured.program).slice(0, 80) : null

    // 필수: 성함, 연락처
    if (!name || !contact) {
      return res.status(400).json({
        ok: false,
        message: '필수 항목(성함, 연락처)을 입력해주세요.',
        debugCode: 'bad_body',
      })
    }

    // 2) env
    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.INQUIRY_TO_EMAIL || DEFAULT_TO
    const from = process.env.INQUIRY_FROM_EMAIL || DEFAULT_FROM
    if (!apiKey) {
      console.error('[consult] RESEND_API_KEY is not configured')
      return res.status(500).json({
        ok: false,
        message: '메일 전송 설정이 완료되지 않았습니다. (서버 환경변수 RESEND_API_KEY 누락)',
        debugCode: 'no_env',
      })
    }

    // 3) 메일 본문 구성
    const receivedAt = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      dateStyle: 'long',
      timeStyle: 'short',
    })
    const siteUrl =
      (body.page as string | undefined) ||
      (req.headers?.referer as string | undefined) ||
      (req.headers?.origin as string | undefined) ||
      (req.headers?.host ? `https://${req.headers.host}` : SITE_NAME)

    // Supabase 저장 (비치명적 — 미설정/실패 시 이메일 발송만 진행)
    const leadId = await saveConsultLead({
      name,
      contact,
      company,
      source,
      page: String(siteUrl).slice(0, 400),
      message,
      program,
      structured,
      context,
    })

    // 관심 분야는 표 한 줄로 흘리지 않고, 아래에서 목차별 박스로 따로 보여준다
    const interestValue = context.find(([label]) => label === INTEREST_LABEL)?.[1] || ''
    const tableContext = context.filter(([label]) => label !== INTEREST_LABEL)

    const rows: Array<[string, string]> = [
      ['성함', name],
      ['연락처', contact],
      ['회사명', company || '-'],
      ...(source ? ([['신청 경로', source]] as Array<[string, string]>) : []),
      // 담긴 상품·선택 항목·체크한 내용 등
      ...tableContext,
      ['문의 내용', message || '-'],
      ['접수 시간', receivedAt],
      ['접수 페이지', siteUrl],
    ]

    const interestsHtml = renderInterestBoxes(interestValue)
    const interestsText = interestLines(interestValue)

    const text =
      `${SITE_NAME} 새 상담 신청\n\n` +
      rows.map(([k, v]) => `■ ${k}\n${v}`).join('\n\n') +
      (interestsText ? '\n\n' + interestsText : '') +
      '\n'

    const tableRows = rows
      .map(
        ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#334155;width:200px;vertical-align:top;font-size:14px">${escapeHtml(
            label,
          )}</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#0f172a;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
            value,
          ).replace(/\n/g, '<br/>')}</td>
        </tr>`,
      )
      .join('')

    const html = `
    <div style="font-family:-apple-system,'Apple SD Gothic Neo','Segoe UI',sans-serif;background:#f1f5f9;padding:24px">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
        <div style="background:#0f172a;padding:20px 24px">
          <p style="margin:0;color:#38bdf8;font-size:12px;font-weight:700;letter-spacing:1px">미래 AI 랩 · MIRAE AI LAB</p>
          <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:700">새 상담 신청 (${escapeHtml(source || '사이트 문의')})</p>
        </div>
        <table style="width:100%;border-collapse:collapse">${tableRows}</table>
        ${interestsHtml}
        <div style="padding:16px 24px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6">
          이 메일은 미래 AI 랩 사이트 상담 폼에서 자동 발송되었습니다.<br/>
          ${
            contact.includes('@')
              ? '회신(Reply) 시 신청자 이메일로 바로 답장됩니다.'
              : '위 연락처로 직접 연락하실 수 있습니다.'
          }
        </div>
      </div>
    </div>`

    // 4) 저장이 끝났으면 응답을 먼저 보낸다.
    //    메일(Resend 왕복 + 모듈 로드)을 기다리느라 제출이 몇 초씩 걸렸고, 함수 실행시간 상한에
    //    걸리면 저장은 됐는데 화면에는 오류가 뜨는 일이 있었다. Node 런타임은 핸들러가 끝날 때까지
    //    살아 있으므로 응답 뒤에도 메일은 그대로 나간다.
    //    ⚠️ 저장에 실패했다면(leadId 없음) 메일이 유일한 전달 수단이므로 예전처럼 끝까지 기다렸다가 결과를 알린다.
    const respondedEarly = !!leadId
    if (respondedEarly) {
      res.status(200).json({ ok: true, message: '상담 신청이 접수됐어요. 확인하고 빠르게 연락드릴게요.', leadId })
    }

    // 5) Resend 모듈 동적 import
    let resend: { emails: { send: (opts: unknown) => Promise<{ data?: { id?: string }; error?: unknown }> } }
    try {
      const mod: any = await import('resend')
      resend = new mod.Resend(apiKey)
    } catch (e) {
      console.error('[consult] resend import error:', detailOf(e))
      if (respondedEarly) return
      return res
        .status(500)
        .json({ ok: false, message: '메일 모듈 로드에 실패했습니다.', debugCode: 'resend_import', detail: detailOf(e) })
    }

    // 6) 발송
    const subjectTag = source ? `상담·${source}` : '상담'
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[${SITE_NAME} ${subjectTag}] ${name}${company ? ` · ${company}` : ''}`,
      html,
      text,
      ...(contact.includes('@') ? { replyTo: contact } : {}),
    })

    if (error) {
      console.error('[consult] resend send error:', detailOf(error))
      if (respondedEarly) return
      return res
        .status(502)
        .json({ ok: false, message: '메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'resend_error', detail: detailOf(error) })
    }

    if (respondedEarly) return
    return res
      .status(200)
      .json({ ok: true, message: '상담 신청이 접수됐어요. 확인하고 빠르게 연락드릴게요.', id: data?.id, leadId })
  } catch (error) {
    console.error('[consult] unhandled error:', detailOf(error))
    if (res.headersSent) return
    return res.status(500).json({
      ok: false,
      message: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      debugCode: 'unhandled_exception',
      detail: error instanceof Error ? error.message : String(error),
    })
  }
}
