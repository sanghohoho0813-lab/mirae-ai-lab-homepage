// OAuth "이동 중…" pending 상태를 페이지 복귀 시 안전하게 해제하는 공통 훅.
// bfcache 복원(뒤로가기)·재표시·탭 복귀·창 포커스·history back 에서 reset 을 호출합니다.
//
// 왜 필요한가: 소셜 로그인 버튼을 누르면 외부(카카오/구글)로 리다이렉트되며, 그 직전에
// setBusy(provider) 로 "이동 중…" 표시를 남깁니다. 사용자가 외부 화면에서 로그인하지 않고
// 뒤로가기를 누르면 브라우저가 로그인 페이지를 bfcache 에서 복원하는데, 이때 React 는
// re-mount 되지 않아 busy 상태가 그대로 남습니다. 아래 이벤트에서 명시적으로 해제해야 합니다.
import { useEffect, useRef } from 'react'

export function useOAuthPendingReset(reset: () => void) {
  // 최신 reset 클로저 유지 (리스너 재등록 없이) → 중복 등록·무한 렌더 방지
  const resetRef = useRef(reset)
  resetRef.current = reset

  useEffect(() => {
    const run = () => resetRef.current()

    // A/B: 뒤로가기 bfcache 복원 + 일반 재표시 — persisted 여부와 무관하게 해제해도 안전
    //      (로그인 성공 시엔 /auth/callback 으로 이동해 이 컴포넌트가 언마운트되므로,
    //       이 화면이 다시 보인다는 것은 OAuth 가 완료되지 않았다는 뜻)
    const onPageShow = (_e: PageTransitionEvent) => run()
    // C: 다른 탭 갔다가 복귀
    const onVisibility = () => { if (document.visibilityState === 'visible') run() }
    // 창 포커스 복귀
    const onFocus = () => run()
    // 로그인 페이지로 history back
    const onPopState = () => run()

    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])
}
