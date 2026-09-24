// 화면 코드를 받는 동안 보이는 자리 — 대부분 0.3초 안에 끝나므로 그 전에는 아무것도 띄우지 않는다
// (짧게 깜빡이는 로딩 표시가 오히려 느려 보이게 한다). 오래 걸릴 때만 조용히 나타난다.
export default function RouteFallback() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex min-h-dvh items-center justify-center bg-[#FAFAF8]">
      <div className="flex flex-col items-center gap-3 opacity-0 [animation:fade-in_0.3s_ease_0.35s_both]">
        <span aria-hidden className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#E7EAEE] border-t-[#D47A4A]" />
        <span className="text-[0.9rem] font-semibold text-[#6B7680]">화면을 불러오는 중…</span>
      </div>
    </div>
  )
}
