// 화면 하나가 오류로 멈춰도 사이트 전체가 흰 화면이 되지 않게 받아 준다.
//  - 배포 직후 코드 파일을 못 받은 경우 → 한 번 자동 새로고침 (lib/chunkRecovery)
//  - 그 밖의 오류 → 안내 + 새로고침 / 처음 화면 / 카카오톡 문의
//  - 다른 주소로 이동하면 오류 상태를 풀어 준다 (resetKey = pathname)
// ⚠️ 대체 화면은 라우터·로그인 상태에 기대지 않는다(그쪽이 고장났을 수도 있으므로) — 일반 <a> 로만 이동한다.
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { consultLinks } from '../config/businessInfo'
import { isChunkLoadError, reloadOnce } from '../lib/chunkRecovery'

type BoundaryProps = { children: ReactNode; resetKey: string }
type BoundaryState = { error: Error | null }

class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error) && reloadOnce()) return
    console.error('[AppErrorBoundary]', error, info.componentStack)
  }

  componentDidUpdate(prev: BoundaryProps) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return <ErrorFallback updated={isChunkLoadError(this.state.error)} />
  }
}

function ErrorFallback({ updated }: { updated: boolean }) {
  return (
    <div data-error-fallback className="flex min-h-dvh items-center justify-center bg-[#FAFAF8] px-5 py-10 text-[#171B20] antialiased [word-break:keep-all]">
      <div role="alert" className="w-full max-w-md rounded-3xl border border-[#E7EAEE] bg-white p-7 text-center shadow-xl shadow-slate-900/5 sm:p-8">
        <span aria-hidden className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F3D9C8]/70 text-[#D47A4A]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {updated ? <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" /> : <path d="M12 8v5M12 16.5v.5M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />}
          </svg>
        </span>
        <h1 className="mt-4 text-[1.3rem] font-black leading-snug tracking-tight">
          {updated ? '사이트가 방금 새 버전으로 바뀌었어요' : '화면을 불러오지 못했어요'}
        </h1>
        <p className="mt-2.5 text-[0.98rem] leading-relaxed text-[#6B7680]">
          {updated
            ? '새로고침하면 최신 화면으로 바로 이어집니다.'
            : '일시적인 문제일 수 있어요. 새로고침하면 대부분 바로 해결됩니다.'}
        </p>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-[#6B7680]">3분 진단 답변은 이 기기에 저장돼 있어, 다시 열면 이어서 할 수 있어요.</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#171B20] px-5 text-[1.02rem] font-black text-white transition-colors hover:bg-[#343B44]"
        >
          새로고침
        </button>
        <a
          href="/"
          className="mt-2.5 flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[#E7EAEE] bg-white px-5 text-[0.98rem] font-bold text-[#343B44] transition-colors hover:bg-[#FAFAF8]"
        >
          처음 화면으로
        </a>
        <a
          href={consultLinks.kakaoChat}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-1 text-[0.92rem] font-semibold text-[#6B7680] underline underline-offset-4 hover:text-[#171B20]"
        >
          계속 안 되면 카카오톡으로 알려주세요 <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  )
}

export default function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <Boundary resetKey={pathname}>{children}</Boundary>
}
