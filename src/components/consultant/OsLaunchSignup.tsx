// 컨설턴트 운영 OS 출시 알림 신청 — 이름 · 소속 · 이메일 · 연락처만 받는다(영상 끝 안내와 같은 네 칸).
// 새 서버 함수를 만들지 않고 기존 문의 메일(/api/inquiry)로 보낸다:
//   contact = 이메일(답장 주소가 되도록) · role = 소속 · 필수인 repetitiveTask/message 에는 신청 내용을 채운다.
import { useState, type FormEvent } from 'react'
import { consultLinks } from '../../config/businessInfo'
import { postJson } from '../../lib/apiFetch'
import HoneypotField from '../HoneypotField'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const input =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
const label = 'mb-2 block text-base font-semibold text-slate-800'

export const OS_SIGNUP_ID = 'signup'

export default function OsLaunchSignup() {
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    const form = e.currentTarget
    const f = Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v).trim()]))
    setStatus('submitting')
    setMsg('')
    try {
      await postJson('/api/inquiry', {
        name: f.name,
        contact: f.email,
        role: f.org,
        toolType: '컨설턴트 운영 OS · 출시 알림 신청',
        repetitiveTask: '출시 알림 신청',
        message: `컨설턴트 운영 OS(미래AI랩 OS) 출시 알림 신청\n이름: ${f.name}\n소속: ${f.org}\n이메일: ${f.email}\n연락처: ${f.phone}`,
        website: f.website ?? '',
      })
      setStatus('success')
      form.reset()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '')
      setStatus('error')
    }
  }

  return (
    <section id={OS_SIGNUP_ID} data-os-signup className="scroll-mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
        <div>
          <p className="text-base font-bold uppercase tracking-widest text-sky-700">출시 알림 신청</p>
          <h2 className="mt-3 break-keep text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            출시되면
            <br /> 가장 먼저 알려 드릴게요
          </h2>
          <p className="mt-4 break-keep text-lg leading-relaxed text-slate-600">
            컨설턴트 운영 OS는 <b className="font-bold text-slate-900">11월 중 오픈</b>을 계획하고 있어요. 절세 모듈은 세무사 같은 전문가 검증을 거쳐 열 예정이에요.
          </p>
          <ul className="mt-6 grid gap-2.5">
            {['오픈 소식을 가장 먼저 알려 드려요', '초기에 함께해 주시는 분께는 무료로 써 보실 기회와 할인 혜택도 같이 안내드릴 예정이에요', '이름 · 소속 · 이메일 · 연락처만 남겨 주세요'].map((t) => (
              <li key={t} className="flex items-start gap-2.5 break-keep text-[1.02rem] leading-relaxed text-slate-700">
                <span aria-hidden className="mt-0.5 shrink-0 font-black text-sky-500">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <HoneypotField />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="os-name" className={label}>
                이름 <span className="text-rose-500">*</span>
              </label>
              <input id="os-name" name="name" type="text" required autoComplete="name" placeholder="예: 홍길동" className={input} />
            </div>
            <div>
              <label htmlFor="os-org" className={label}>
                소속 <span className="text-rose-500">*</span>
              </label>
              <input id="os-org" name="org" type="text" required autoComplete="organization" placeholder="예: ○○ 컨설팅 / 법인영업팀" className={input} />
            </div>
            <div>
              <label htmlFor="os-email" className={label}>
                이메일 <span className="text-rose-500">*</span>
              </label>
              <input id="os-email" name="email" type="email" required autoComplete="email" placeholder="name@example.com" className={input} />
            </div>
            <div>
              <label htmlFor="os-phone" className={label}>
                연락처 <span className="text-rose-500">*</span>
              </label>
              <input
                id="os-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                minLength={9}
                placeholder="010-0000-0000"
                className={input}
              />
            </div>
          </div>

          {status === 'success' && (
            <p role="status" data-os-signup-ok className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-base font-semibold text-emerald-800">
              신청됐어요. 출시되면 가장 먼저 알려 드릴게요.
            </p>
          )}
          {status === 'error' && (
            <div role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
              <p className="text-base font-bold leading-snug">{msg || '보내지 못했어요. 잠시 후 다시 눌러 주세요.'}</p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-amber-800">입력하신 내용은 그대로 남아 있어요. 급하시면 카카오톡으로 남겨 주세요.</p>
              <a
                href={consultLinks.kakaoChat}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-[#FEE500] px-4 text-[0.95rem] font-bold text-[#181600]"
              >
                카카오톡 문의 ↗
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-slate-900 px-6 text-lg font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? '보내는 중…' : '출시 알림 신청하기'}
          </button>
          <p className="mt-3 break-keep text-center text-[0.86rem] leading-relaxed text-slate-500">
            남겨 주신 정보는 출시 안내 연락에만 써요.{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-slate-700">
              개인정보처리방침
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}
