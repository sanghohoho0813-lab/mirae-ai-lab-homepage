// 휴대폰 SMS 인증 필드 — 번호 입력 → 인증번호 받기 → 코드 확인 → 인증완료.
// 회원가입·소셜 온보딩 공용. 서버 /api/phone-verification 사용(phoneVerification.ts).
import { useEffect, useRef, useState } from 'react'
import { isValidKoreanMobile, sendPhoneCode, verifyPhoneCode } from '../../lib/phoneVerification'

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

export default function PhoneVerifyField({
  phone,
  onPhoneChange,
  verified,
  onVerifiedChange,
}: {
  phone: string
  onPhoneChange: (v: string) => void
  verified: boolean
  onVerifiedChange: (v: boolean) => void
}) {
  const [step, setStep] = useState<'idle' | 'sent'>('idle')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'error' | 'ok' | 'info'; text: string } | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  function startTimer(sec: number) {
    setSecondsLeft(sec)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0 }
        return s - 1
      })
    }, 1000)
  }

  async function handleSend() {
    setMsg(null)
    if (!isValidKoreanMobile(phone)) { setMsg({ tone: 'error', text: '휴대폰 번호 형식을 확인해주세요.' }); return }
    setSending(true)
    const r = await sendPhoneCode(phone, 'signup')
    setSending(false)
    if (!r.ok) { setMsg({ tone: 'error', text: r.error }); return }
    setStep('sent')
    setCode('')
    startTimer(r.expiresInSec ?? 180)
    if (r.testMode && r.devCode) {
      // provider 미설정(테스트모드) — 화면에 인증번호 노출 (운영 전 SMS provider 연결 필요)
      setMsg({ tone: 'info', text: `테스트 모드 인증번호: ${r.devCode} (SMS 미발송)` })
    } else {
      setMsg({ tone: 'ok', text: '인증번호를 문자로 보냈습니다. 3분 이내에 입력해주세요.' })
    }
  }

  async function handleVerify() {
    setMsg(null)
    if (code.replace(/\D/g, '').length !== 6) { setMsg({ tone: 'error', text: '6자리 인증번호를 입력해주세요.' }); return }
    setVerifying(true)
    const r = await verifyPhoneCode(phone, code)
    setVerifying(false)
    if (!r.ok) { setMsg({ tone: 'error', text: r.error }); return }
    onVerifiedChange(true)
    setStep('idle')
    if (timerRef.current) clearInterval(timerRef.current)
    setMsg({ tone: 'ok', text: '휴대폰 인증이 완료되었습니다.' })
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => { onPhoneChange(e.target.value); if (verified) onVerifiedChange(false) }}
          placeholder="010-0000-0000"
          autoComplete="tel"
          disabled={verified}
          className={`${inputCls} ${verified ? 'bg-slate-50 text-slate-500' : ''}`}
        />
        {verified ? (
          <span className="flex shrink-0 items-center gap-1 rounded-xl bg-emerald-50 px-3 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <span aria-hidden>✓</span> 인증완료
          </span>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="shrink-0 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
          >
            {sending ? '전송 중…' : step === 'sent' ? '재전송' : '인증번호 받기'}
          </button>
        )}
      </div>

      {step === 'sent' && !verified && (
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="인증번호 6자리"
              className={inputCls}
            />
            {secondsLeft > 0 && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold tabular-nums text-rose-500">
                {mm}:{ss}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying}
            className="shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {verifying ? '확인 중…' : '확인'}
          </button>
        </div>
      )}

      {msg && (
        <p
          className={`mt-2 text-sm font-medium ${
            msg.tone === 'error' ? 'text-rose-600' : msg.tone === 'ok' ? 'text-emerald-600' : 'text-blue-600'
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  )
}
