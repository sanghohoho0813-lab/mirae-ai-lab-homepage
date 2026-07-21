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

    const rows: Array<[string, string]> = [
      ['성함', name],
      ['연락처', contact],
      ['회사명', company || '-'],
      ...(source ? ([['신청 경로', source]] as Array<[string, string]>) : []),
      // 담긴 상품·선택 항목·체크한 내용 등
      ...context,
      ['문의 내용', message || '-'],
      ['접수 시간', receivedAt],
      ['접수 페이지', siteUrl],
    ]

    const text = `${SITE_NAME} 새 상담 신청\n\n` + rows.map(([k, v]) => `■ ${k}\n${v}`).join('\n\n') + '\n'

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

    // 4) Resend 모듈 동적 import
    let resend: { emails: { send: (opts: unknown) => Promise<{ data?: { id?: string }; error?: unknown }> } }
    try {
      const mod: any = await import('resend')
      resend = new mod.Resend(apiKey)
    } catch (e) {
      return res
        .status(500)
        .json({ ok: false, message: '메일 모듈 로드에 실패했습니다.', debugCode: 'resend_import', detail: detailOf(e) })
    }

    // 5) 발송
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
      return res
        .status(502)
        .json({ ok: false, message: '메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'resend_error', detail: detailOf(error) })
    }

    return res
      .status(200)
      .json({ ok: true, message: '상담 신청이 접수되었습니다. 확인 후 빠르게 연락드리겠습니다.', id: data?.id })
  } catch (error) {
    console.error('[consult] unhandled error:', detailOf(error))
    return res.status(500).json({
      ok: false,
      message: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      debugCode: 'unhandled_exception',
      detail: error instanceof Error ? error.message : String(error),
    })
  }
}
