// Vercel Serverless Function (Node runtime) — receives contact-form submissions
// and emails them to the site owner via Resend (https://resend.com).
//
// Required / optional environment variables (see .env.example):
//   RESEND_API_KEY      — (required) Resend API key
//   INQUIRY_TO_EMAIL    — (optional) recipient, defaults to sanghohoho0813@gmail.com
//   INQUIRY_FROM_EMAIL  — (optional) sender, defaults to Resend's onboarding sender.
//                         Switch to a verified-domain sender after domain auth.
//
// This file is built/bundled by Vercel, not by the app's `tsc -b` (which only
// includes src/), so the app still builds without these env vars.
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const SITE_NAME = 'AI Business Lab'
const DEFAULT_TO = 'sanghohoho0813@gmail.com'
const DEFAULT_FROM = 'AI Business Lab <onboarding@resend.dev>'

type InquiryBody = {
  name?: string
  contact?: string
  role?: string
  toolType?: string
  repetitiveTask?: string
  message?: string
}

function safeJson(value: string): InquiryBody {
  try {
    return JSON.parse(value) as InquiryBody
  } catch {
    return {}
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: '허용되지 않은 요청입니다.' })
  }

  const body: InquiryBody = typeof req.body === 'string' ? safeJson(req.body) : (req.body ?? {})

  const name = (body.name ?? '').trim()
  const contact = (body.contact ?? '').trim()
  const role = (body.role ?? '').trim()
  const toolType = (body.toolType ?? '').trim()
  const repetitiveTask = (body.repetitiveTask ?? '').trim()
  const message = (body.message ?? '').trim()

  // Required: 이름, 연락처, 반복 업무, 문의 내용
  if (!name || !contact || !repetitiveTask || !message) {
    return res
      .status(400)
      .json({ message: '필수 항목(이름, 연락처, 반복 업무, 문의 내용)을 모두 입력해주세요.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.INQUIRY_TO_EMAIL || DEFAULT_TO
  const from = process.env.INQUIRY_FROM_EMAIL || DEFAULT_FROM

  if (!apiKey) {
    console.error('[inquiry] RESEND_API_KEY is not configured')
    return res
      .status(500)
      .json({ message: '메일 전송 설정이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.' })
  }

  const receivedAt = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'long',
    timeStyle: 'short',
  })
  const siteUrl =
    (req.headers.referer as string | undefined) ||
    (req.headers.origin as string | undefined) ||
    (req.headers.host ? `https://${req.headers.host}` : SITE_NAME)

  const rows: Array<[string, string]> = [
    ['이름', name],
    ['연락처', contact],
    ['직업/소속', role || '-'],
    ['만들고 싶은 도구 유형', toolType || '-'],
    ['가장 시간이 오래 걸리는 반복 업무', repetitiveTask],
    ['문의 내용', message],
    ['접수 시간', receivedAt],
    ['사이트', siteUrl],
  ]

  const text =
    `AI Business Lab 새 문의\n\n` + rows.map(([k, v]) => `■ ${k}\n${v}`).join('\n\n') + '\n'

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#334155;width:180px;vertical-align:top;font-size:14px">${escapeHtml(
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
          <p style="margin:0;color:#38bdf8;font-size:12px;font-weight:700;letter-spacing:1px">AI BUSINESS LAB</p>
          <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:700">새 업무 자동화 제작 문의</p>
        </div>
        <table style="width:100%;border-collapse:collapse">${tableRows}</table>
        <div style="padding:16px 24px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6">
          이 메일은 AI Business Lab 문의 폼에서 자동 발송되었습니다.<br/>
          ${contact.includes('@') ? '회신 버튼을 누르면 문의자 이메일로 바로 답장할 수 있습니다.' : '연락처로 직접 연락하실 수 있습니다.'}
        </div>
      </div>
    </div>`

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[${SITE_NAME} 문의] ${name}`,
      html,
      text,
      ...(contact.includes('@') ? { replyTo: contact } : {}),
    })

    if (error) {
      console.error('[inquiry] resend send error:', error)
      return res
        .status(500)
        .json({ message: '메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' })
    }

    return res
      .status(200)
      .json({ message: '문의가 접수되었습니다. 확인 후 연락드리겠습니다.', id: data?.id })
  } catch (err) {
    console.error('[inquiry] unexpected error:', err)
    return res
      .status(500)
      .json({ message: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
  }
}
