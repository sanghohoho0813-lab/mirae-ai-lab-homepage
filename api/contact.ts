// Vercel Serverless (Edge) Function — receives contact-form submissions and
// emails them via Resend (https://resend.com).
//
// Required env vars (see .env.example):
//   RESEND_API_KEY     — Resend API key
//   CONTACT_TO_EMAIL   — recipient (defaults to sanghohoho0813@gmail.com)
//   CONTACT_FROM_EMAIL — verified sender (defaults to Resend's onboarding sender)
//
// This file is built by Vercel, not by the app's `tsc -b` (which only includes
// src/), so it is intentionally framework-light.

export const config = { runtime: 'edge' }

type Payload = {
  name?: string
  contact?: string
  role?: string
  toolType?: string
  repetitiveTask?: string
  message?: string
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let data: Payload
  try {
    data = (await req.json()) as Payload
  } catch {
    return json({ error: '잘못된 요청입니다.' }, 400)
  }

  const name = (data.name ?? '').trim()
  const contact = (data.contact ?? '').trim()
  if (!name || !contact) {
    return json({ error: '이름과 연락처를 입력해주세요.' }, 422)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Not yet configured — surface a clear, non-fatal signal to the client.
    return json({ error: '문의 기능이 아직 설정되지 않았습니다.' }, 503)
  }

  const to = process.env.CONTACT_TO_EMAIL || 'sanghohoho0813@gmail.com'
  const from = process.env.CONTACT_FROM_EMAIL || 'AI Business Lab <onboarding@resend.dev>'

  const rows: Array<[string, string]> = [
    ['이름', name],
    ['연락처', contact],
    ['직업/소속', (data.role ?? '').trim() || '-'],
    ['만들고 싶은 도구', (data.toolType ?? '').trim() || '-'],
    ['가장 시간이 오래 걸리는 반복 업무', (data.repetitiveTask ?? '').trim() || '-'],
    ['문의 내용', (data.message ?? '').trim() || '-'],
  ]

  const html = `
    <div style="font-family:-apple-system,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
      <h2 style="margin:0 0 16px">[AI Business Lab] 새 문의가 도착했습니다</h2>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;width:200px;vertical-align:top">${escapeHtml(
              label,
            )}</td>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join('')}
      </table>
    </div>`

  const replyTo = contact.includes('@') ? contact : undefined

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[AI Business Lab 문의] ${name}`,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!sent.ok) {
    return json({ error: '메일 전송에 실패했습니다.' }, 502)
  }

  return json({ ok: true })
}
