import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { openToolPass } from '../lib/portal'

// 초대 링크(/pass/:token) — 로그인 없이 도구를 여는 한 장짜리 중계 페이지.
// 관리자가 발급한 링크를 받은 사람이 처음 보는 화면이다. 서버가 링크를 확인해
// 짧은 진입 티켓이 붙은 도구 주소를 내려주면 그대로 이동한다.
// 도구 주소 자체는 링크에 들어 있지 않다 — 링크가 만료되면 주소도 얻을 수 없다.

const errMsg = (e: unknown) => (e instanceof Error ? e.message : '링크를 열 수 없습니다.')

export default function ToolPassPage() {
  const { token = '' } = useParams()
  const [error, setError] = useState('')
  const [toolTitle, setToolTitle] = useState<string | null>(null)
  // StrictMode 의 이중 실행으로 사용 횟수가 2로 세지지 않게 한 번만 연다
  const startedRef = useRef(false)

  useEffect(() => {
    document.title = '초대 링크 여는 중 | 미래AI랩'
    if (startedRef.current) return
    startedRef.current = true

    void (async () => {
      try {
        const r = await openToolPass(token)
        setToolTitle(r.toolTitle)
        window.location.replace(r.url)
      } catch (e) {
        setError(errMsg(e))
      }
    })()
  }, [token])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171B20] px-5 py-16 [word-break:keep-all]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1F252C] p-7 text-center shadow-xl sm:p-9">
        {error ? (
          <>
            <p className="text-[0.78rem] font-black uppercase tracking-[0.18em] text-[#E8B89A]">MIRAE AI LAB</p>
            <h1 className="mt-4 break-keep text-[1.35rem] font-black leading-snug text-white sm:text-[1.5rem]">
              링크를 열 수 없습니다
            </h1>
            <p className="mt-3 break-keep text-[1.02rem] leading-[1.75] text-slate-300">{error}</p>
            <a
              href="https://miraeailab.com"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#D47A4A] px-6 py-3.5 text-[1.05rem] font-black text-[#171B20] transition-colors hover:bg-[#E8B89A]"
            >
              미래AI랩 홈으로
            </a>
          </>
        ) : (
          <>
            <span
              aria-hidden
              className="mx-auto block h-9 w-9 animate-spin rounded-full border-[3px] border-white/15 border-t-[#D47A4A]"
            />
            <h1 className="mt-5 break-keep text-[1.2rem] font-black leading-snug text-white sm:text-[1.3rem]">
              {toolTitle ? `${toolTitle} 여는 중…` : '초대 링크를 확인하는 중…'}
            </h1>
            <p className="mt-2.5 break-keep text-[0.98rem] leading-[1.7] text-slate-400">
              잠시만 기다려 주세요. 자동으로 이동합니다.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
